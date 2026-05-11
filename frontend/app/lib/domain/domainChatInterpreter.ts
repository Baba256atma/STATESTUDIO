import { buildDomainActionPlan } from "./domainActionPlanner.ts";
import { extractDomainEntities } from "./domainEntityExtraction.ts";
import { getDomainDefinition, listDomainDefinitions } from "./domainRegistry.ts";
import { inferDomainFromText } from "./domainHelpers.ts";
import type { DomainChatIntent, DomainChatInterpretation } from "./domainChatIntents.ts";
import type { NexoraDomainId } from "./domainTypes.ts";

const CREATE_KEYWORDS = ["add", "create", "include", "track", "we have", "there is", "our"];
const CONNECT_KEYWORDS = ["connect", "link", "relate", "depends on", "flows to", "to"];
const RISK_KEYWORDS = ["risk", "fragility", "delay", "collapsing", "exposure", "threat", "issue", "problem"];
const OPEN_PANEL_KEYWORDS = ["show", "open", "view", "dashboard", "panel"];

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function includesAny(text: string, keywords: readonly string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function scoreDomain(text: string, domainId: NexoraDomainId): number {
  const domain = getDomainDefinition(domainId);
  let score = 0;
  if (text.includes(domainId.replace(/_/g, " "))) score += 2;
  if (text.includes(domain.name.toLowerCase())) score += 2;
  for (const template of domain.objectTemplates) {
    if (text.includes(template.label.toLowerCase())) score += 1;
    for (const alias of template.aliases) {
      if (text.includes(alias.toLowerCase())) score += 0.8;
    }
  }
  for (const signal of domain.riskSignals) {
    if (text.includes(signal.label.toLowerCase())) score += 0.7;
    for (const alias of signal.aliases) {
      if (text.includes(alias.toLowerCase())) score += 0.6;
    }
  }
  return score;
}

function detectDomain(text: string): { domainId: NexoraDomainId; confidence: number } {
  const inferred = inferDomainFromText(text);
  const scores = listDomainDefinitions().map((domain) => ({
    domainId: domain.id,
    score: scoreDomain(text, domain.id),
  }));
  const best = scores.sort((left, right) => right.score - left.score || left.domainId.localeCompare(right.domainId))[0];
  const topScore = best?.score ?? 0;
  const confidence = topScore <= 0 ? 0.2 : clamp01(0.35 + topScore * 0.12);
  return {
    domainId: topScore > 0 ? best!.domainId : inferred,
    confidence,
  };
}

function detectIntent(text: string, entityCount: number): DomainChatIntent {
  if (!text) return "unknown";
  if (includesAny(text, CONNECT_KEYWORDS) && entityCount >= 2) return "connect_objects";
  if (includesAny(text, OPEN_PANEL_KEYWORDS) && (text.includes("risk") || text.includes("object") || text.includes("dashboard"))) {
    return "open_panel";
  }
  if (includesAny(text, RISK_KEYWORDS)) return entityCount > 0 ? "create_object" : "analyze_risk";
  if (includesAny(text, CREATE_KEYWORDS) && entityCount > 0) return "create_object";
  if (entityCount > 0) return "create_object";
  return "unknown";
}

function confidenceFor(input: {
  domainConfidence: number;
  entityCount: number;
  intent: DomainChatIntent;
}): number {
  if (input.intent === "unknown") return 0.15;
  const entityBoost = Math.min(0.28, input.entityCount * 0.11);
  const intentBoost = input.intent === "connect_objects" ? 0.14 : input.intent === "create_object" ? 0.12 : 0.08;
  return Number(clamp01(input.domainConfidence + entityBoost + intentBoost).toFixed(2));
}

export function interpretDomainChatMessage(params: {
  text: string;
}): DomainChatInterpretation {
  const rawText = String(params.text ?? "");
  const text = normalizeText(rawText);
  const warnings: string[] = [];
  const detected = detectDomain(text);
  const entities = extractDomainEntities({ text, domainId: detected.domainId });
  const intent = detectIntent(text, entities.length);
  const confidence = confidenceFor({
    domainConfidence: detected.confidence,
    entityCount: entities.length,
    intent,
  });

  if (!text) warnings.push("empty_text");
  if (entities.length === 0) warnings.push("no_domain_entities");
  if (confidence < 0.45) warnings.push("low_confidence");

  const base: DomainChatInterpretation = {
    rawText,
    detectedDomainId: detected.domainId,
    intent,
    entities,
    confidence,
    suggestedActions: [],
    warnings: warnings.length ? warnings : undefined,
  };
  const planned = buildDomainActionPlan(base);

  return {
    ...base,
    suggestedActions: planned.map((action) => ({
      type: action.type,
      payload: action.payload,
    })),
  };
}
