/**
 * APP-3:7 — Executive Intent conflict detection rules.
 * Deterministic comparison of semantic models, classifications, and state — no AI.
 */

import type { IntentClassificationResult } from "./executiveIntentClassificationTypes.ts";
import type { IntentResolutionResult } from "./executiveIntentStateTypes.ts";
import type {
  ExecutiveIntentSemanticModel,
  SemanticActionType,
} from "./executiveIntentSemanticTypes.ts";
import type {
  IntentConflict,
  IntentConflictCategory,
  IntentConflictReference,
  IntentConflictSeverity,
} from "./executiveIntentConflictTypes.ts";

export const EXECUTIVE_INTENT_CONFLICT_RULES_VERSION = "APP-3/7-RULES-1" as const;

export const CONFLICT_RULE_IDS = Object.freeze([
  "RULE_DUPLICATE_INTENT",
  "RULE_TARGET_SHARED",
  "RULE_GOAL_CONTRADICTION",
  "RULE_ACTION_OPPOSITION",
  "RULE_RESOURCE_ACTOR_OVERLAP",
  "RULE_RESOURCE_KEYWORD",
  "RULE_TIME_OVERLAP",
  "RULE_TIME_SAME_HORIZON",
  "RULE_CONSTRAINT_OPPOSITION",
  "RULE_ASSUMPTION_OPPOSITION",
  "RULE_CLASSIFICATION_TENSION",
  "RULE_GROWTH_VS_COST",
  "RULE_TECHNOLOGY_REPLACEMENT",
  "RULE_COMPLIANCE_TENSION",
  "RULE_STATE_BLOCKED",
  "RULE_UNKNOWN_COMPARISON",
  "RULE_COMPATIBLE_INTENTS",
] as const);

export type ConflictRuleId = (typeof CONFLICT_RULE_IDS)[number];

export const CONFLICT_SEVERITY_ORDER = Object.freeze([
  "none",
  "informational",
  "low",
  "medium",
  "high",
  "critical",
  "unknown",
] as const satisfies readonly IntentConflictSeverity[]);

export const CONFLICT_CATEGORY_ORDER = Object.freeze([
  "duplicate",
  "target",
  "financial",
  "resource",
  "time",
  "strategic",
  "constraint",
  "assumption",
  "operational",
  "technology",
  "compliance",
  "customer",
  "people",
  "priority",
  "scope",
  "unknown",
  "custom",
] as const satisfies readonly IntentConflictCategory[]);

const OPPOSED_ACTIONS: Readonly<Record<SemanticActionType, readonly SemanticActionType[]>> =
  Object.freeze({
    increase: Object.freeze(["decrease", "reduce", "remove"]),
    decrease: Object.freeze(["increase", "expand"]),
    reduce: Object.freeze(["increase", "expand", "create"]),
    expand: Object.freeze(["reduce", "decrease", "remove"]),
    create: Object.freeze(["remove", "reduce"]),
    remove: Object.freeze(["create", "expand", "increase"]),
    replace: Object.freeze(["maintain", "protect"]),
    transform: Object.freeze(["maintain"]),
    optimize: Object.freeze([]),
    protect: Object.freeze([]),
    monitor: Object.freeze([]),
    maintain: Object.freeze(["replace", "transform", "remove"]),
    custom: Object.freeze([]),
  });

const CONSTRAINT_OPPOSITION_MARKERS = Object.freeze([
  Object.freeze(["without increasing headcount", "hire"]),
  Object.freeze(["without increasing cost", "expand"]),
  Object.freeze(["reduce cost", "increase"]),
  Object.freeze(["without increasing budget", "expand"]),
] as const);

function normalizeText(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function deterministicId(prefix: string, payload: string): string {
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}

export function buildConflictReference(
  model: ExecutiveIntentSemanticModel
): IntentConflictReference {
  return Object.freeze({
    referenceId: deterministicId("conflict-ref", model.modelId),
    intentId: model.primaryGoal?.intentId ?? null,
    semanticModelId: model.modelId,
    label: model.summary.headline || model.primaryGoal?.label || model.modelId,
    readOnly: true as const,
  });
}

export function targetsOverlap(left: ExecutiveIntentSemanticModel, right: ExecutiveIntentSemanticModel): boolean {
  const leftTarget = normalizeText(left.targetEntity?.entityLabel);
  const rightTarget = normalizeText(right.targetEntity?.entityLabel);
  if (!leftTarget || !rightTarget) return false;
  return leftTarget === rightTarget || leftTarget.includes(rightTarget) || rightTarget.includes(leftTarget);
}

export function measuresOverlap(left: ExecutiveIntentSemanticModel, right: ExecutiveIntentSemanticModel): boolean {
  const leftMeasure = normalizeText(left.targetMeasure?.label ?? left.targetMeasure?.explicitText);
  const rightMeasure = normalizeText(right.targetMeasure?.label ?? right.targetMeasure?.explicitText);
  if (!leftMeasure || !rightMeasure) return false;
  return leftMeasure === rightMeasure || leftMeasure.includes(rightMeasure) || rightMeasure.includes(leftMeasure);
}

export function actionsOppose(left: SemanticActionType, right: SemanticActionType): boolean {
  return (OPPOSED_ACTIONS[left] ?? []).includes(right) || (OPPOSED_ACTIONS[right] ?? []).includes(left);
}

export function actorsOverlap(left: ExecutiveIntentSemanticModel, right: ExecutiveIntentSemanticModel): boolean {
  const leftNames = new Set(left.actors.map((entry) => normalizeText(entry.name)));
  const rightNames = right.actors.map((entry) => normalizeText(entry.name));
  return rightNames.some((name) => name && leftNames.has(name));
}

export function timeHorizonsOverlap(
  left: ExecutiveIntentSemanticModel,
  right: ExecutiveIntentSemanticModel
): boolean {
  if (left.timeHorizon.kind === "unknown" || right.timeHorizon.kind === "unknown") return false;
  return left.timeHorizon.kind === right.timeHorizon.kind;
}

function createConflict(
  left: IntentConflictReference,
  right: IntentConflictReference,
  category: IntentConflictCategory,
  severity: IntentConflictSeverity,
  ruleId: ConflictRuleId,
  summary: string,
  explanation: string
): IntentConflict {
  return Object.freeze({
    conflictId: deterministicId("conflict", `${left.semanticModelId}:${right.semanticModelId}:${ruleId}`),
    category,
    severity,
    ruleId,
    summary,
    explanation,
    leftReference: left,
    rightReference: right,
    compatible: false as const,
    readOnly: true as const,
  });
}

export function detectPairConflicts(input: Readonly<{
  left: IntentConflictAnalysisBundle;
  right: IntentConflictAnalysisBundle;
}>): readonly IntentConflict[] {
  const conflicts: IntentConflict[] = [];
  const leftRef = buildConflictReference(input.left.semanticModel);
  const rightRef = buildConflictReference(input.right.semanticModel);
  const left = input.left.semanticModel;
  const right = input.right.semanticModel;

  const leftGoal = normalizeText(left.primaryGoal?.label);
  const rightGoal = normalizeText(right.primaryGoal?.label);
  const sameTarget = targetsOverlap(left, right);
  const sameMeasure = measuresOverlap(left, right);

  if (
    leftGoal &&
    rightGoal &&
    leftGoal === rightGoal &&
    left.actionType === right.actionType &&
    sameTarget
  ) {
    conflicts.push(
      createConflict(
        leftRef,
        rightRef,
        "duplicate",
        "high",
        "RULE_DUPLICATE_INTENT",
        "Duplicate executive intent detected.",
        "Both intents express the same goal, action, and target entity."
      )
    );
  }

  if (sameTarget && actionsOppose(left.actionType, right.actionType)) {
    conflicts.push(
      createConflict(
        leftRef,
        rightRef,
        "target",
        sameMeasure ? "critical" : "high",
        "RULE_GOAL_CONTRADICTION",
        "Opposing actions target the same entity.",
        `Action ${left.actionType} conflicts with ${right.actionType} on shared target.`
      )
    );
  }

  if (sameMeasure && actionsOppose(left.actionType, right.actionType)) {
    conflicts.push(
      createConflict(
        leftRef,
        rightRef,
        "target",
        "critical",
        "RULE_ACTION_OPPOSITION",
        "Opposing actions apply to the same measure.",
        `Measure-level opposition between ${left.actionType} and ${right.actionType}.`
      )
    );
  }

  if (sameTarget && !actionsOppose(left.actionType, right.actionType) && leftGoal !== rightGoal) {
    conflicts.push(
      createConflict(
        leftRef,
        rightRef,
        "target",
        "medium",
        "RULE_TARGET_SHARED",
        "Shared target entity with distinct goals.",
        "Intents overlap on target entity but actions are not strictly opposed."
      )
    );
  }

  if (actorsOverlap(left, right)) {
    conflicts.push(
      createConflict(
        leftRef,
        rightRef,
        "resource",
        "medium",
        "RULE_RESOURCE_ACTOR_OVERLAP",
        "Shared actors referenced by both intents.",
        "Both intents reference the same explicit actor."
      )
    );
  }

  const leftConstraintText = left.constraints.map((entry) => normalizeText(entry.explicitText)).join(" ");
  const rightConstraintText = right.constraints.map((entry) => normalizeText(entry.explicitText)).join(" ");
  const leftGoalText = normalizeText(left.primaryGoal?.rawPhrase);
  const rightGoalText = normalizeText(right.primaryGoal?.rawPhrase);
  const combinedLeft = `${leftConstraintText} ${leftGoalText}`;
  const combinedRight = `${rightConstraintText} ${rightGoalText}`;

  for (const [markerA, markerB] of CONSTRAINT_OPPOSITION_MARKERS) {
    const leftHasA = combinedLeft.includes(markerA);
    const rightHasB = combinedRight.includes(markerB);
    const leftHasB = combinedLeft.includes(markerB);
    const rightHasA = combinedRight.includes(markerA);
    if ((leftHasA && rightHasB) || (leftHasB && rightHasA)) {
      conflicts.push(
        createConflict(
          leftRef,
          rightRef,
          "constraint",
          "medium",
          "RULE_CONSTRAINT_OPPOSITION",
          "Explicit constraints oppose each other.",
          `Constraint marker "${markerA}" conflicts with "${markerB}".`
        )
      );
    }
  }

  if (
    (combinedLeft.includes("budget") || combinedLeft.includes("cost")) &&
    (combinedRight.includes("budget") || combinedRight.includes("cost")) &&
    actionsOppose(left.actionType, right.actionType)
  ) {
    conflicts.push(
      createConflict(
        leftRef,
        rightRef,
        "financial",
        "high",
        "RULE_RESOURCE_KEYWORD",
        "Shared budget or cost resource tension.",
        "Both intents reference financial resources with opposing actions."
      )
    );
  }

  if (timeHorizonsOverlap(left, right) && (sameTarget || sameMeasure)) {
    conflicts.push(
      createConflict(
        leftRef,
        rightRef,
        "time",
        "medium",
        "RULE_TIME_SAME_HORIZON",
        "Same time horizon with overlapping targets.",
        `Both intents target the same horizon (${left.timeHorizon.label}).`
      )
    );
  } else if (timeHorizonsOverlap(left, right)) {
    conflicts.push(
      createConflict(
        leftRef,
        rightRef,
        "time",
        "informational",
        "RULE_TIME_OVERLAP",
        "Timeline overlap detected.",
        "Intents share the same time horizon."
      )
    );
  }

  const leftAssumptions = left.assumptions.map((entry) => normalizeText(entry.explicitText));
  const rightAssumptions = right.assumptions.map((entry) => normalizeText(entry.explicitText));
  for (const leftAssumption of leftAssumptions) {
    for (const rightAssumption of rightAssumptions) {
      if (
        leftAssumption &&
        rightAssumption &&
        ((leftAssumption.includes("stable") && rightAssumption.includes("volatile")) ||
          (leftAssumption.includes("growth") && rightAssumption.includes("decline")))
      ) {
        conflicts.push(
          createConflict(
            leftRef,
            rightRef,
            "assumption",
            "low",
            "RULE_ASSUMPTION_OPPOSITION",
            "Assumptions may be incompatible.",
            "Explicit assumptions contain opposing market signals."
          )
        );
      }
    }
  }

  const leftClass = input.left.classification;
  const rightClass = input.right.classification;
  if (leftClass?.primaryClass && rightClass?.primaryClass) {
    const leftPrimary = leftClass.primaryClass.classId;
    const rightPrimary = rightClass.primaryClass.classId;
    const growthVsCost =
      (leftPrimary === "growth" && rightPrimary === "financial" && right.actionType === "reduce") ||
      (rightPrimary === "growth" && leftPrimary === "financial" && left.actionType === "reduce");
    if (growthVsCost) {
      conflicts.push(
        createConflict(
          leftRef,
          rightRef,
          "strategic",
          "high",
          "RULE_GROWTH_VS_COST",
          "Growth objective conflicts with cost reduction.",
          "Classification and action types indicate growth vs cost tension."
        )
      );
    }

    const techReplace =
      leftPrimary === "technology" &&
      rightPrimary === "technology" &&
      (left.actionType === "replace" || right.actionType === "replace" || left.actionType === "transform");
    if (techReplace && left.modelId !== right.modelId) {
      conflicts.push(
        createConflict(
          leftRef,
          rightRef,
          "technology",
          "medium",
          "RULE_TECHNOLOGY_REPLACEMENT",
          "Technology replacement overlap detected.",
          "Both intents involve technology replacement or transformation."
        )
      );
    }

    const complianceTension =
      leftPrimary === "compliance" &&
      rightPrimary === "compliance" &&
      left.actionType !== right.actionType;
    if (complianceTension) {
      conflicts.push(
        createConflict(
          leftRef,
          rightRef,
          "compliance",
          "medium",
          "RULE_COMPLIANCE_TENSION",
          "Compliance objectives use different action types.",
          "Multiple compliance intents with differing actions may conflict."
        )
      );
    }

    if (
      leftPrimary !== rightPrimary &&
      actionsOppose(left.actionType, right.actionType) &&
      left.businessDimension === right.businessDimension
    ) {
      conflicts.push(
        createConflict(
          leftRef,
          rightRef,
          "strategic",
          "low",
          "RULE_CLASSIFICATION_TENSION",
          "Classification categories differ with opposing actions.",
          `Classes ${leftPrimary} and ${rightPrimary} tension detected.`
        )
      );
    }
  }

  const leftState = input.left.state;
  const rightState = input.right.state;
  if (leftState?.state.flags.isBlocked && rightState?.state.flags.isBlocked) {
    conflicts.push(
      createConflict(
        leftRef,
        rightRef,
        "operational",
        "informational",
        "RULE_STATE_BLOCKED",
        "Both intents are in blocked state.",
        "Blocked state on both intents may indicate operational conflict."
      )
    );
  }

  if (
    (left.flags.incompleteObjective || right.flags.incompleteObjective) &&
    conflicts.length === 0
  ) {
    conflicts.push(
      createConflict(
        leftRef,
        rightRef,
        "unknown",
        "unknown",
        "RULE_UNKNOWN_COMPARISON",
        "Insufficient semantic information for full conflict analysis.",
        "One or both intents are incomplete; conflict status is unknown."
      )
    );
  }

  return sortConflicts(conflicts);
}

export type IntentConflictAnalysisBundle = Readonly<{
  semanticModel: ExecutiveIntentSemanticModel;
  classification: IntentClassificationResult | null;
  state: IntentResolutionResult | null;
}>;

export function sortConflicts(conflicts: readonly IntentConflict[]): readonly IntentConflict[] {
  return Object.freeze(
    [...conflicts].sort((left, right) => {
      const severityDiff =
        CONFLICT_SEVERITY_ORDER.indexOf(right.severity) -
        CONFLICT_SEVERITY_ORDER.indexOf(left.severity);
      if (severityDiff !== 0) return severityDiff;
      const categoryDiff =
        CONFLICT_CATEGORY_ORDER.indexOf(left.category) -
        CONFLICT_CATEGORY_ORDER.indexOf(right.category);
      if (categoryDiff !== 0) return categoryDiff;
      return left.conflictId.localeCompare(right.conflictId);
    })
  );
}

export function resolveConflictCategory(conflict: IntentConflict): IntentConflictCategory {
  return conflict.category;
}

export function resolveConflictSeverity(conflict: IntentConflict): IntentConflictSeverity {
  return conflict.severity;
}

export function highestConflictSeverity(
  conflicts: readonly IntentConflict[]
): IntentConflictSeverity {
  if (conflicts.length === 0) return "none";
  const sorted = sortConflicts(conflicts);
  return sorted[0]!.severity;
}

export function collectConflictRulesApplied(
  conflicts: readonly IntentConflict[]
): readonly string[] {
  return Object.freeze([...new Set(conflicts.map((entry) => entry.ruleId))].sort());
}

export function pairKey(leftId: string, rightId: string): string {
  return leftId < rightId ? `${leftId}::${rightId}` : `${rightId}::${leftId}`;
}
