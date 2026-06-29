/**
 * APP-3:4 — Executive Intent extraction rules.
 * Deterministic pattern definitions and language-neutral adapters.
 */

import type { IntentCategory, IntentPriority, IntentScope } from "./executiveIntentTypes.ts";

export const EXECUTIVE_INTENT_EXTRACTION_RULES_VERSION = "APP-3/4" as const;

export const EXECUTIVE_INTENT_EXTRACTION_RULE_IDS = Object.freeze([
  "RULE_ACTION_VERB",
  "RULE_TARGET_OBJECT",
  "RULE_TARGET_VALUE_PERCENT",
  "RULE_TARGET_VALUE_NUMBER",
  "RULE_TIME_ABSOLUTE_YEAR",
  "RULE_TIME_RELATIVE",
  "RULE_CONSTRAINT_MARKER",
  "RULE_ASSUMPTION_MARKER",
  "RULE_EVIDENCE_MARKER",
  "RULE_ACTOR_MARKER",
  "RULE_PRIORITY_EXPLICIT",
  "RULE_SCOPE_EXPLICIT",
  "RULE_CATEGORY_KEYWORD",
  "RULE_MULTI_INTENT_SPLIT",
  "RULE_CONFLICT_MARKER",
] as const);

export type IntentExtractionRuleId = (typeof EXECUTIVE_INTENT_EXTRACTION_RULE_IDS)[number];

export type IntentExtractionLanguageAdapter = Readonly<{
  languageCode: string;
  actionVerbs: readonly string[];
  categoryKeywords: Readonly<Partial<Record<IntentCategory, readonly string[]>>>;
  priorityKeywords: Readonly<Partial<Record<IntentPriority, readonly string[]>>>;
  scopeKeywords: Readonly<Partial<Record<IntentScope, readonly string[]>>>;
  constraintMarkers: readonly string[];
  assumptionMarkers: readonly string[];
  evidenceMarkers: readonly string[];
  timeRelativePhrases: readonly string[];
  conflictMarkers: readonly string[];
  normalizeText: (text: string) => string;
}>;

export const INTENT_EXTRACTION_NEUTRAL_LANGUAGE_ADAPTER: IntentExtractionLanguageAdapter =
  Object.freeze({
    languageCode: "neutral",
    actionVerbs: Object.freeze([]),
    categoryKeywords: Object.freeze({}),
    priorityKeywords: Object.freeze({}),
    scopeKeywords: Object.freeze({}),
    constraintMarkers: Object.freeze([]),
    assumptionMarkers: Object.freeze([]),
    evidenceMarkers: Object.freeze([]),
    timeRelativePhrases: Object.freeze([]),
    conflictMarkers: Object.freeze([]),
    normalizeText: (text: string) => text.trim().replace(/\s+/g, " "),
  });

export const INTENT_EXTRACTION_ENGLISH_LANGUAGE_ADAPTER: IntentExtractionLanguageAdapter =
  Object.freeze({
    languageCode: "en",
    actionVerbs: Object.freeze([
      "increase",
      "decrease",
      "reduce",
      "improve",
      "expand",
      "grow",
      "cut",
      "optimize",
      "modernize",
      "upgrade",
      "hire",
      "achieve",
      "maintain",
      "ensure",
      "launch",
      "implement",
      "comply",
      "mitigate",
    ]),
    categoryKeywords: Object.freeze({
      financial: Object.freeze(["profit", "revenue", "cost", "budget", "margin", "expense"]),
      growth: Object.freeze(["growth", "market share", "expand", "acquire"]),
      operational: Object.freeze(["operational", "efficiency", "throughput", "process"]),
      risk_reduction: Object.freeze(["risk", "mitigate", "exposure", "compliance breach"]),
      people: Object.freeze(["hire", "headcount", "talent", "retention", "workforce"]),
      compliance: Object.freeze(["comply", "compliance", "regulation", "audit"]),
      technology: Object.freeze(["modernize", "technology", "platform", "digital", "cloud"]),
      customer: Object.freeze(["customer", "satisfaction", "nps", "retention"]),
      innovation: Object.freeze(["innovate", "innovation", "r&d", "research"]),
      strategic: Object.freeze(["strategic", "company", "enterprise"]),
    }),
    priorityKeywords: Object.freeze({
      critical: Object.freeze(["critical priority", "critically important"]),
      high: Object.freeze(["high priority", "urgent"]),
      medium: Object.freeze(["medium priority"]),
      low: Object.freeze(["low priority"]),
      very_low: Object.freeze(["very low priority"]),
    }),
    scopeKeywords: Object.freeze({
      enterprise: Object.freeze(["company", "enterprise", "organization", "firm"]),
      department: Object.freeze(["department", "division"]),
      project: Object.freeze(["project"]),
      business_unit: Object.freeze(["business unit", "bu"]),
    }),
    constraintMarkers: Object.freeze(["without", "must not", "cannot", "no more than", "limit"]),
    assumptionMarkers: Object.freeze(["assuming", "assume", "given that"]),
    evidenceMarkers: Object.freeze(["based on", "according to", "per report", "evidence:"]),
    timeRelativePhrases: Object.freeze([
      "next year",
      "this year",
      "next quarter",
      "by q1",
      "by q2",
      "by q3",
      "by q4",
      "within 12 months",
      "within 6 months",
    ]),
    conflictMarkers: Object.freeze(["but also", "however", "on the other hand", "conflicting"]),
    normalizeText: (text: string) => text.trim().replace(/\s+/g, " ").toLowerCase(),
  });

export const INTENT_EXTRACTION_SPANISH_LANGUAGE_ADAPTER: IntentExtractionLanguageAdapter =
  Object.freeze({
    languageCode: "es",
    actionVerbs: Object.freeze([
      "aumentar",
      "reducir",
      "mejorar",
      "expandir",
      "crecer",
      "contratar",
      "lograr",
      "implementar",
    ]),
    categoryKeywords: Object.freeze({
      financial: Object.freeze(["beneficio", "beneficios", "ingresos", "costo", "presupuesto"]),
      growth: Object.freeze(["crecimiento", "cuota de mercado"]),
      operational: Object.freeze(["operacional", "eficiencia"]),
      people: Object.freeze(["contratar", "personal", "talento"]),
      compliance: Object.freeze(["cumplir", "cumplimiento", "regulacion"]),
      technology: Object.freeze(["modernizar", "tecnologia", "digital"]),
    }),
    priorityKeywords: Object.freeze({
      high: Object.freeze(["prioridad alta", "urgente"]),
      critical: Object.freeze(["prioridad critica"]),
    }),
    scopeKeywords: Object.freeze({
      enterprise: Object.freeze(["empresa", "organizacion"]),
    }),
    constraintMarkers: Object.freeze(["sin", "no debe", "no mas de"]),
    assumptionMarkers: Object.freeze(["asumiendo", "suponiendo"]),
    evidenceMarkers: Object.freeze(["segun", "basado en"]),
    timeRelativePhrases: Object.freeze(["el proximo ano", "este ano", "proximo trimestre"]),
    conflictMarkers: Object.freeze(["pero tambien", "sin embargo"]),
    normalizeText: (text: string) => text.trim().replace(/\s+/g, " ").toLowerCase(),
  });

export const INTENT_EXTRACTION_LANGUAGE_ADAPTERS = Object.freeze([
  INTENT_EXTRACTION_ENGLISH_LANGUAGE_ADAPTER,
  INTENT_EXTRACTION_SPANISH_LANGUAGE_ADAPTER,
  INTENT_EXTRACTION_NEUTRAL_LANGUAGE_ADAPTER,
] as const);

export const INTENT_EXTRACTION_PATTERN_RULES = Object.freeze({
  percentValue: /(\d+(?:\.\d+)?)\s*(?:%|percent|pct)/i,
  numericValue: /\b(\d+(?:\.\d+)?)\b/,
  absoluteYear: /\b(20\d{2})\b/,
  quarterReference: /\bq([1-4])\b/i,
  multiIntentSplit: /[.;]|(?:\band\b(?=\s+\w+\s+(?:profit|cost|revenue|risk|headcount)))/i,
} as const);

export function resolveIntentExtractionLanguageAdapter(
  languageCode: string
): IntentExtractionLanguageAdapter {
  const normalized = languageCode.trim().toLowerCase();
  const adapter = INTENT_EXTRACTION_LANGUAGE_ADAPTERS.find(
    (entry) => entry.languageCode === normalized
  );
  return adapter ?? INTENT_EXTRACTION_ENGLISH_LANGUAGE_ADAPTER;
}

export function findFirstMatchingKeyword(
  text: string,
  keywords: readonly string[]
): string | null {
  const normalized = text.toLowerCase();
  let best: string | null = null;
  for (const keyword of keywords) {
    if (normalized.includes(keyword.toLowerCase())) {
      if (!best || keyword.length > best.length) best = keyword;
    }
  }
  return best;
}

export function findActionVerb(
  text: string,
  adapter: IntentExtractionLanguageAdapter
): string | null {
  const normalized = adapter.normalizeText(text);
  for (const verb of adapter.actionVerbs) {
    const pattern = new RegExp(`\\b${escapeRegex(verb)}\\b`, "i");
    if (pattern.test(normalized)) return verb;
  }
  return null;
}

export const INTENT_EXTRACTION_CATEGORY_RESOLUTION_ORDER = Object.freeze([
  "risk_reduction",
  "people",
  "compliance",
  "technology",
  "operational",
  "growth",
  "financial",
  "customer",
  "innovation",
  "strategic",
  "custom",
] as const satisfies readonly IntentCategory[]);

export function resolveExplicitCategory(
  text: string,
  adapter: IntentExtractionLanguageAdapter
): IntentCategory | null {
  for (const category of INTENT_EXTRACTION_CATEGORY_RESOLUTION_ORDER) {
    const keywords = adapter.categoryKeywords[category];
    if (keywords && findFirstMatchingKeyword(text, keywords)) {
      return category;
    }
  }
  return null;
}

export function resolveExplicitPriority(
  text: string,
  adapter: IntentExtractionLanguageAdapter
): IntentPriority | null {
  for (const [priority, keywords] of Object.entries(adapter.priorityKeywords) as Array<
    [IntentPriority, readonly string[] | undefined]
  >) {
    if (!keywords) continue;
    if (findFirstMatchingKeyword(text, keywords)) return priority;
  }
  return null;
}

export function resolveExplicitScope(
  text: string,
  adapter: IntentExtractionLanguageAdapter
): IntentScope | null {
  for (const [scope, keywords] of Object.entries(adapter.scopeKeywords) as Array<
    [IntentScope, readonly string[] | undefined]
  >) {
    if (!keywords) continue;
    if (findFirstMatchingKeyword(text, keywords)) return scope;
  }
  return null;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const ExecutiveIntentExtractionRules = Object.freeze({
  version: EXECUTIVE_INTENT_EXTRACTION_RULES_VERSION,
  ruleIds: EXECUTIVE_INTENT_EXTRACTION_RULE_IDS,
  patternRules: INTENT_EXTRACTION_PATTERN_RULES,
  resolveIntentExtractionLanguageAdapter,
  findActionVerb,
  resolveExplicitCategory,
  resolveExplicitPriority,
  resolveExplicitScope,
});
