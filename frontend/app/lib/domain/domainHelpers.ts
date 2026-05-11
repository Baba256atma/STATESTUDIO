import {
  getDefaultDomain,
  getDomainDefinition,
  isKnownDomainId,
  listDomainDefinitions,
} from "./domainRegistry.ts";
import type {
  DomainObjectTemplate,
  DomainRiskSignal,
  NexoraDomainDefinition,
  NexoraDomainId,
} from "./domainTypes.ts";

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function includesPhrase(text: string, phrase: string): boolean {
  const normalizedPhrase = normalizeText(phrase);
  return Boolean(normalizedPhrase) && text.includes(normalizedPhrase);
}

function getDomainKeywords(domain: NexoraDomainDefinition): string[] {
  return [
    domain.id,
    domain.name,
    ...domain.objectTemplates.flatMap((template) => [template.label, ...template.aliases]),
    ...domain.riskSignals.flatMap((signal) => [signal.label, ...signal.aliases]),
  ];
}

export function normalizeDomainId(value: unknown): NexoraDomainId {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (isKnownDomainId(normalized)) return normalized;
  if (normalized === "devops" || normalized === "saas" || normalized === "sre") return "saas_devops";
  if (normalized === "supply-chain" || normalized === "supply chain" || normalized === "scm") return "supply_chain";
  if (normalized === "healthcare" || normalized === "healthcare ops") return "healthcare_ops";
  return getDefaultDomain().id;
}

export function getDomainObjectTemplates(domainId: unknown): DomainObjectTemplate[] {
  return getDomainDefinition(normalizeDomainId(domainId)).objectTemplates;
}

export function getDomainRiskSignals(domainId: unknown): DomainRiskSignal[] {
  return getDomainDefinition(normalizeDomainId(domainId)).riskSignals;
}

export function findDomainObjectTemplate(domainId: unknown, text: string): DomainObjectTemplate | null {
  const normalizedText = normalizeText(text);
  if (!normalizedText) return null;

  for (const template of getDomainObjectTemplates(domainId)) {
    if (includesPhrase(normalizedText, template.label)) return template;
    if (template.aliases.some((alias) => includesPhrase(normalizedText, alias))) return template;
  }

  return null;
}

export function inferDomainFromText(text: string): NexoraDomainId {
  const normalizedText = normalizeText(text);
  if (!normalizedText) return getDefaultDomain().id;

  const scores = new Map<NexoraDomainId, number>();
  for (const domain of listDomainDefinitions()) {
    let score = 0;
    for (const keyword of getDomainKeywords(domain)) {
      if (includesPhrase(normalizedText, keyword)) score += keyword === domain.id || keyword === domain.name ? 2 : 1;
    }
    scores.set(domain.id, score);
  }

  const supplyScore = scores.get("supply_chain") ?? 0;
  const retailScore = scores.get("retail") ?? 0;
  if (supplyScore > 0 && supplyScore === retailScore) return "supply_chain";

  const ranked = Array.from(scores.entries()).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });
  const [bestDomain, bestScore] = ranked[0] ?? [getDefaultDomain().id, 0];
  return bestScore > 0 ? bestDomain : getDefaultDomain().id;
}
