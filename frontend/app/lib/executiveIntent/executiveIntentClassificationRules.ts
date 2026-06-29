/**
 * APP-3:6 — Executive Intent classification rules.
 * Deterministic mapping from semantic model — no AI, no inference beyond explicit rules.
 */

import type {
  ExecutiveIntentSemanticModel,
  SemanticActionType,
  SemanticBusinessDimension,
  SemanticGoal,
} from "./executiveIntentSemanticTypes.ts";
import type { IntentTaxonomyClassKey } from "./executiveIntentClassificationTaxonomy.ts";
import { sortIntentClasses } from "./executiveIntentClassificationTaxonomy.ts";

export const EXECUTIVE_INTENT_CLASSIFICATION_RULES_VERSION = "APP-3/6-RULES-1" as const;

export const CLASSIFICATION_RULE_IDS = Object.freeze([
  "RULE_DIMENSION_PRIMARY",
  "RULE_ACTION_SECONDARY",
  "RULE_GOAL_MULTI_LABEL",
  "RULE_KEYWORD_TARGET",
  "RULE_KEYWORD_GOAL",
  "RULE_COMPOSITE_INTENT",
  "RULE_HYBRID_INTENT",
  "RULE_CUSTOM_FALLBACK",
] as const);

export type ClassificationRuleId = (typeof CLASSIFICATION_RULE_IDS)[number];

export type ClassificationCandidate = Readonly<{
  classId: IntentTaxonomyClassKey;
  ruleId: ClassificationRuleId;
  source: "dimension" | "action" | "goal" | "keyword" | "custom";
  priority: number;
}>;

const DIMENSION_TO_CLASS: Readonly<Record<SemanticBusinessDimension, IntentTaxonomyClassKey>> =
  Object.freeze({
    financial: "financial",
    operations: "operational",
    sales: "sales",
    marketing: "marketing",
    customer: "customer",
    people: "people",
    technology: "technology",
    risk: "risk",
    compliance: "compliance",
    supply_chain: "supply_chain",
    strategy: "strategic",
    innovation: "innovation",
    custom: "custom",
  });

const ACTION_TO_CLASS: Readonly<Partial<Record<SemanticActionType, IntentTaxonomyClassKey>>> =
  Object.freeze({
    transform: "transformation",
    expand: "growth",
    create: "resource",
    protect: "risk",
    monitor: "governance",
    optimize: "operational",
  });

const KEYWORD_TO_CLASS: Readonly<Record<string, IntentTaxonomyClassKey>> = Object.freeze({
  profit: "financial",
  revenue: "financial",
  cost: "financial",
  cash: "financial",
  margin: "financial",
  budget: "financial",
  market: "growth",
  expansion: "growth",
  growth: "growth",
  digital: "transformation",
  modernize: "transformation",
  transform: "transformation",
  technology: "technology",
  platform: "technology",
  compliance: "compliance",
  regulatory: "compliance",
  audit: "compliance",
  risk: "risk",
  mitigate: "risk",
  customer: "customer",
  satisfaction: "customer",
  experience: "customer",
  hire: "resource",
  hiring: "resource",
  engineer: "resource",
  talent: "people",
  workforce: "people",
  innovation: "innovation",
  product: "innovation",
  supply: "supply_chain",
  logistics: "supply_chain",
  marketing: "marketing",
  brand: "marketing",
  sales: "sales",
  pipeline: "sales",
  governance: "governance",
  board: "governance",
  sustainability: "sustainability",
  esg: "sustainability",
  carbon: "sustainability",
  strategic: "strategic",
  efficiency: "operational",
  operational: "operational",
});

const SUPPORTED_ACTION_TYPES: readonly SemanticActionType[] = Object.freeze([
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
]);

function scanKeywords(text: string): IntentTaxonomyClassKey[] {
  const normalized = text.toLowerCase();
  const matches: IntentTaxonomyClassKey[] = [];
  for (const [keyword, classId] of Object.entries(KEYWORD_TO_CLASS)) {
    if (normalized.includes(keyword)) {
      matches.push(classId);
    }
  }
  return matches;
}

function addCandidate(
  candidates: ClassificationCandidate[],
  classId: IntentTaxonomyClassKey,
  ruleId: ClassificationRuleId,
  source: ClassificationCandidate["source"],
  priority: number
): void {
  candidates.push(Object.freeze({ classId, ruleId, source, priority }));
}

export function resolveDimensionClass(
  dimension: SemanticBusinessDimension
): IntentTaxonomyClassKey {
  return DIMENSION_TO_CLASS[dimension] ?? "custom";
}

export function resolveActionClass(actionType: SemanticActionType): IntentTaxonomyClassKey | null {
  return ACTION_TO_CLASS[actionType] ?? null;
}

export function resolveGoalClasses(goal: SemanticGoal): readonly IntentTaxonomyClassKey[] {
  const fromLabel = scanKeywords(goal.label);
  const fromPhrase = scanKeywords(goal.rawPhrase);
  return sortIntentClasses([...fromLabel, ...fromPhrase]);
}

export function resolveKeywordClasses(model: ExecutiveIntentSemanticModel): IntentTaxonomyClassKey[] {
  const corpus = [
    model.primaryGoal?.label ?? "",
    model.primaryGoal?.rawPhrase ?? "",
    model.targetEntity?.entityLabel ?? "",
    model.desiredFutureState?.desiredFutureState ?? "",
    ...model.knownInformation,
    ...model.businessObjects.map((entry) => entry.label),
  ].join(" ");
  return sortIntentClasses(scanKeywords(corpus));
}

export function resolveClassificationCandidates(
  model: ExecutiveIntentSemanticModel
): readonly ClassificationCandidate[] {
  const candidates: ClassificationCandidate[] = [];

  const dimensionClass = resolveDimensionClass(model.businessDimension);
  addCandidate(candidates, dimensionClass, "RULE_DIMENSION_PRIMARY", "dimension", 100);

  const actionClass = resolveActionClass(model.actionType);
  if (actionClass) {
    addCandidate(candidates, actionClass, "RULE_ACTION_SECONDARY", "action", 80);
  }

  if (model.actionType === "custom") {
    addCandidate(candidates, "custom", "RULE_CUSTOM_FALLBACK", "custom", 10);
  }

  if (model.businessDimension === "custom") {
    addCandidate(candidates, "custom", "RULE_CUSTOM_FALLBACK", "custom", 10);
  }

  if (model.businessDimension === "strategy" && model.actionType === "expand") {
    addCandidate(candidates, "growth", "RULE_ACTION_SECONDARY", "action", 110);
  }

  if (model.businessDimension === "technology" && model.actionType === "transform") {
    addCandidate(candidates, "transformation", "RULE_ACTION_SECONDARY", "action", 110);
  }

  if (model.flags.multipleGoals) {
    for (const goal of model.goals) {
      for (const classId of resolveGoalClasses(goal)) {
        addCandidate(candidates, classId, "RULE_GOAL_MULTI_LABEL", "goal", 70);
      }
    }
    addCandidate(candidates, dimensionClass, "RULE_COMPOSITE_INTENT", "goal", 60);
  }

  for (const classId of resolveKeywordClasses(model)) {
    addCandidate(candidates, classId, "RULE_KEYWORD_TARGET", "keyword", 50);
  }

  for (const goal of model.goals) {
    for (const classId of resolveGoalClasses(goal)) {
      addCandidate(candidates, classId, "RULE_KEYWORD_GOAL", "goal", 55);
    }
  }

  const uniqueClasses = sortIntentClasses(candidates.map((entry) => entry.classId));
  const dimensionGroups = new Set(
    uniqueClasses.map((classId) => {
      if (classId === "growth" || classId === "strategic") return "strategic";
      if (classId === "transformation" || classId === "technology") return "transformation";
      return classId;
    })
  );
  if (dimensionGroups.size >= 3) {
    addCandidate(candidates, dimensionClass, "RULE_HYBRID_INTENT", "keyword", 40);
  }

  return Object.freeze(candidates);
}

export function resolvePrimaryClassFromCandidates(
  candidates: readonly ClassificationCandidate[]
): IntentTaxonomyClassKey | null {
  if (candidates.length === 0) return null;

  const sorted = [...candidates].sort((left, right) => {
    if (right.priority !== left.priority) return right.priority - left.priority;
    return (
      sortIntentClasses([left.classId, right.classId]).indexOf(left.classId) -
      sortIntentClasses([left.classId, right.classId]).indexOf(right.classId)
    );
  });

  const topPriority = sorted[0]!.priority;
  const topCandidates = sorted.filter((entry) => entry.priority === topPriority);
  const topClasses = sortIntentClasses(topCandidates.map((entry) => entry.classId));

  return topClasses[0] ?? null;
}

export function resolveSecondaryClassesFromCandidates(
  candidates: readonly ClassificationCandidate[],
  primaryClass: IntentTaxonomyClassKey | null
): IntentTaxonomyClassKey[] {
  const all = sortIntentClasses(candidates.map((entry) => entry.classId));
  if (!primaryClass) return all;
  return all.filter((classId) => classId !== primaryClass);
}

export function isSupportedActionType(actionType: SemanticActionType): boolean {
  return (SUPPORTED_ACTION_TYPES as readonly string[]).includes(actionType);
}

export function collectRulesApplied(candidates: readonly ClassificationCandidate[]): readonly string[] {
  const rules = [...new Set(candidates.map((entry) => entry.ruleId))];
  return Object.freeze(rules.sort());
}
