/**
 * APP-3:5 — Executive Intent semantic normalization rules.
 * Deterministic mapping from extracted structures — no inference.
 */

import type { IntentCategory } from "./executiveIntentTypes.ts";
import type {
  ExtractedGoal,
  ExtractedTarget,
  ExtractedTimeReference,
} from "./executiveIntentExtractionTypes.ts";
import type {
  SemanticActionType,
  SemanticBusinessDimension,
  SemanticTimeHorizonKind,
} from "./executiveIntentSemanticTypes.ts";

export const EXECUTIVE_INTENT_SEMANTIC_RULES_VERSION = "APP-3/5" as const;

export const SEMANTIC_BUSINESS_DIMENSION_KEYS = Object.freeze([
  "financial",
  "operations",
  "sales",
  "marketing",
  "customer",
  "people",
  "technology",
  "risk",
  "compliance",
  "supply_chain",
  "strategy",
  "innovation",
  "custom",
] as const satisfies readonly SemanticBusinessDimension[]);

export const SEMANTIC_ACTION_TYPE_KEYS = Object.freeze([
  "increase",
  "decrease",
  "maintain",
  "create",
  "remove",
  "replace",
  "expand",
  "reduce",
  "optimize",
  "protect",
  "monitor",
  "transform",
  "custom",
] as const satisfies readonly SemanticActionType[]);

export const SEMANTIC_TIME_HORIZON_KEYS = Object.freeze([
  "immediate",
  "short_term",
  "medium_term",
  "long_term",
  "specific_date",
  "specific_period",
  "unknown",
] as const satisfies readonly SemanticTimeHorizonKind[]);

const CATEGORY_TO_DIMENSION: Readonly<Record<IntentCategory, SemanticBusinessDimension>> =
  Object.freeze({
    financial: "financial",
    operational: "operations",
    growth: "strategy",
    innovation: "innovation",
    risk_reduction: "risk",
    customer: "customer",
    people: "people",
    compliance: "compliance",
    technology: "technology",
    strategic: "strategy",
    custom: "custom",
  });

const VERB_TO_ACTION: Readonly<Record<string, SemanticActionType>> = Object.freeze({
  increase: "increase",
  decrease: "decrease",
  reduce: "reduce",
  cut: "reduce",
  improve: "optimize",
  optimize: "optimize",
  expand: "expand",
  grow: "expand",
  hire: "create",
  launch: "create",
  implement: "create",
  maintain: "maintain",
  ensure: "monitor",
  comply: "monitor",
  mitigate: "protect",
  protect: "protect",
  modernize: "transform",
  upgrade: "transform",
  transform: "transform",
  remove: "remove",
  replace: "replace",
  achieve: "maintain",
  aumentar: "increase",
  reducir: "reduce",
  mejorar: "optimize",
  expandir: "expand",
  crecer: "expand",
  contratar: "create",
  implementar: "create",
});

const TARGET_KEYWORD_TO_DIMENSION: Readonly<Record<string, SemanticBusinessDimension>> =
  Object.freeze({
    profit: "financial",
    revenue: "financial",
    cost: "financial",
    margin: "financial",
    cash: "financial",
    budget: "financial",
    efficiency: "operations",
    operational: "operations",
    process: "operations",
    "market share": "sales",
    market: "strategy",
    customer: "customer",
    satisfaction: "customer",
    engineer: "people",
    headcount: "people",
    talent: "people",
    risk: "risk",
    compliance: "compliance",
    regulation: "compliance",
    technology: "technology",
    platform: "technology",
    cloud: "technology",
    "supply chain": "supply_chain",
  });

export function mapIntentCategoryToBusinessDimension(
  category: IntentCategory | null | undefined
): SemanticBusinessDimension {
  if (!category) return "custom";
  return CATEGORY_TO_DIMENSION[category] ?? "custom";
}

export function mapTargetKeywordToBusinessDimension(label: string): SemanticBusinessDimension | null {
  const normalized = label.trim().toLowerCase();
  for (const [keyword, dimension] of Object.entries(TARGET_KEYWORD_TO_DIMENSION)) {
    if (normalized.includes(keyword)) return dimension;
  }
  return null;
}

export function mapActionVerbToActionType(verb: string): SemanticActionType {
  const normalized = verb.trim().toLowerCase();
  return VERB_TO_ACTION[normalized] ?? "custom";
}

export function isSemanticActionType(value: string): value is SemanticActionType {
  return (SEMANTIC_ACTION_TYPE_KEYS as readonly string[]).includes(value);
}

export function isSemanticBusinessDimension(value: string): value is SemanticBusinessDimension {
  return (SEMANTIC_BUSINESS_DIMENSION_KEYS as readonly string[]).includes(value);
}

export function normalizeTimeReferenceToHorizon(
  reference: ExtractedTimeReference | null
): Readonly<{ kind: SemanticTimeHorizonKind; label: string }> {
  if (!reference) {
    return Object.freeze({ kind: "unknown", label: "Unknown" });
  }
  const phrase = reference.normalizedLabel.toLowerCase();
  if (phrase.includes("immediate") || phrase.includes("now")) {
    return Object.freeze({ kind: "immediate", label: "Immediate" });
  }
  if (phrase.includes("this year") || phrase.includes("this quarter") || phrase.includes("q1") || phrase.includes("q2") || phrase.includes("q3") || phrase.includes("q4")) {
    if (/^q[1-4]$/.test(phrase) || phrase.includes("quarter")) {
      return Object.freeze({ kind: "specific_period", label: reference.normalizedLabel });
    }
    return Object.freeze({ kind: "short_term", label: reference.normalizedLabel });
  }
  if (phrase.includes("next year") || phrase.includes("within 12 months")) {
    return Object.freeze({ kind: "long_term", label: reference.normalizedLabel });
  }
  if (phrase.includes("within 6 months") || phrase.includes("next quarter")) {
    return Object.freeze({ kind: "medium_term", label: reference.normalizedLabel });
  }
  if (/^20\d{2}$/.test(phrase)) {
    return Object.freeze({ kind: "specific_date", label: reference.normalizedLabel });
  }
  return Object.freeze({ kind: "specific_period", label: reference.normalizedLabel });
}

export function resolveBusinessDimensionFromExtraction(
  category: IntentCategory | null | undefined,
  target: ExtractedTarget | null
): SemanticBusinessDimension {
  const fromCategory = mapIntentCategoryToBusinessDimension(category);
  if (fromCategory !== "custom") return fromCategory;
  if (target?.objectLabel) {
    const fromTarget = mapTargetKeywordToBusinessDimension(target.objectLabel);
    if (fromTarget) return fromTarget;
  }
  return "custom";
}

export function buildDesiredFutureStatePhrase(
  goal: ExtractedGoal | null,
  target: ExtractedTarget | null,
  actionType: SemanticActionType
): string {
  if (!goal) return "Desired future state unknown.";
  const targetPart = target?.objectLabel ? ` ${target.objectLabel}` : "";
  const valuePart = target?.valueLabel ? ` by ${target.valueLabel}` : "";
  return `${actionType} ${targetPart.trim()}${valuePart}`.trim();
}

export const ExecutiveIntentSemanticRules = Object.freeze({
  version: EXECUTIVE_INTENT_SEMANTIC_RULES_VERSION,
  mapActionVerbToActionType,
  mapIntentCategoryToBusinessDimension,
  normalizeTimeReferenceToHorizon,
  resolveBusinessDimensionFromExtraction,
  buildDesiredFutureStatePhrase,
});
