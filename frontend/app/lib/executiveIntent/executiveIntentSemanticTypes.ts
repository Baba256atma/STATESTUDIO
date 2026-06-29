/**
 * APP-3:5 — Executive Intent semantic model types.
 * Canonical semantic vocabulary — normalization only, no classification or recommendations.
 */

import type { IntentIdentifier, ExecutiveIntentWorkspaceId } from "./executiveIntentTypes.ts";
import type { IntentSemanticDiagnostic } from "./executiveIntentSemanticDiagnostics.ts";

export const EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION = "APP-3/5" as const;

export type SemanticBusinessDimension =
  | "financial"
  | "operations"
  | "sales"
  | "marketing"
  | "customer"
  | "people"
  | "technology"
  | "risk"
  | "compliance"
  | "supply_chain"
  | "strategy"
  | "innovation"
  | "custom";

export type SemanticActionType =
  | "increase"
  | "decrease"
  | "maintain"
  | "create"
  | "remove"
  | "replace"
  | "expand"
  | "reduce"
  | "optimize"
  | "protect"
  | "monitor"
  | "transform"
  | "custom";

export type SemanticTimeHorizonKind =
  | "immediate"
  | "short_term"
  | "medium_term"
  | "long_term"
  | "specific_date"
  | "specific_period"
  | "unknown";

export type SemanticUnknownKind =
  | "target_value"
  | "deadline"
  | "actor"
  | "resource"
  | "kpi"
  | "constraint"
  | "assumption"
  | "evidence"
  | "target_entity"
  | "measure"
  | "business_dimension"
  | "action_type";

export type SemanticGoal = Readonly<{
  goalId: string;
  intentId: IntentIdentifier | null;
  label: string;
  actionType: SemanticActionType;
  actionVerb: string;
  rawPhrase: string;
  readOnly: true;
}>;

export type SemanticOutcome = Readonly<{
  outcomeId: string;
  desiredFutureState: string;
  explicitText: string;
  readOnly: true;
}>;

export type SemanticTarget = Readonly<{
  targetId: string;
  entityLabel: string;
  entityType: string | null;
  readOnly: true;
}>;

export type SemanticMeasure = Readonly<{
  measureId: string;
  label: string;
  numericValue: number | null;
  unit: string | null;
  explicitText: string | null;
  readOnly: true;
}>;

export type SemanticChange = Readonly<{
  changeId: string;
  actionType: SemanticActionType;
  targetLabel: string;
  measureLabel: string | null;
  readOnly: true;
}>;

export type SemanticTimeHorizon = Readonly<{
  horizonId: string;
  kind: SemanticTimeHorizonKind;
  label: string;
  explicitText: string | null;
  readOnly: true;
}>;

export type SemanticConstraint = Readonly<{
  constraintId: string;
  label: string;
  description: string;
  explicitText: string;
  readOnly: true;
}>;

export type SemanticAssumption = Readonly<{
  assumptionId: string;
  label: string;
  description: string;
  explicitText: string;
  readOnly: true;
}>;

export type SemanticActor = Readonly<{
  actorId: string;
  name: string;
  role: string | null;
  explicitText: string;
  readOnly: true;
}>;

export type SemanticObject = Readonly<{
  objectId: string;
  label: string;
  objectType: string;
  readOnly: true;
}>;

export type SemanticUnknown = Readonly<{
  unknownId: string;
  kind: SemanticUnknownKind;
  label: string;
  reason: string;
  readOnly: true;
}>;

export type SemanticFlags = Readonly<{
  multipleGoals: boolean;
  incompleteObjective: boolean;
  missingMeasure: boolean;
  missingTarget: boolean;
  hasConstraints: boolean;
  hasAssumptions: boolean;
  hasEvidence: boolean;
  requiresClarification: boolean;
  explicitPriority: boolean;
  explicitScope: boolean;
  futureCompatible: true;
  readOnly: true;
}>;

export type SemanticSummary = Readonly<{
  headline: string;
  primaryGoalLabel: string;
  businessDimension: SemanticBusinessDimension;
  actionType: SemanticActionType;
  timeHorizonLabel: string;
  unknownCount: number;
  goalCount: number;
  readOnly: true;
}>;

export type SemanticNormalizationResult = Readonly<{
  modelId: string;
  status: "ready" | "partial" | "incomplete";
  model: ExecutiveIntentSemanticModel;
  diagnostics: readonly IntentSemanticDiagnostic[];
  summary: SemanticSummary;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveIntentSemanticModel = Readonly<{
  modelId: string;
  workspaceId: ExecutiveIntentWorkspaceId;
  extractionId: string;
  primaryGoal: SemanticGoal | null;
  goals: readonly SemanticGoal[];
  desiredFutureState: SemanticOutcome | null;
  businessDimension: SemanticBusinessDimension;
  targetEntity: SemanticTarget | null;
  targetMeasure: SemanticMeasure | null;
  semanticChange: SemanticChange | null;
  actionType: SemanticActionType;
  timeHorizon: SemanticTimeHorizon;
  actors: readonly SemanticActor[];
  businessObjects: readonly SemanticObject[];
  constraints: readonly SemanticConstraint[];
  assumptions: readonly SemanticAssumption[];
  evidence: readonly import("./executiveIntentExtractionTypes.ts").ExtractedEvidence[];
  knownInformation: readonly string[];
  unknowns: readonly SemanticUnknown[];
  flags: SemanticFlags;
  diagnostics: readonly IntentSemanticDiagnostic[];
  summary: SemanticSummary;
  versionMetadata: Readonly<{
    semanticModelVersion: typeof EXECUTIVE_INTENT_SEMANTIC_MODEL_VERSION;
    extractionEngineVersion: string;
    contractVersion: string;
  }>;
  timestamp: string;
  readOnly: true;
}>;

export type SemanticModelValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
  readOnly: true;
}>;

/** Reserved for APP-3:6 extension. */
export type SemanticModelFutureExtension = Readonly<{
  classificationBindings: null;
  confidenceBindings: null;
  dependencyBindings: null;
}>;

export const SEMANTIC_MODEL_FUTURE_EXTENSION: SemanticModelFutureExtension = Object.freeze({
  classificationBindings: null,
  confidenceBindings: null,
  dependencyBindings: null,
});

export function createExecutiveIntentSemanticModel(
  input: Omit<ExecutiveIntentSemanticModel, "readOnly">
): ExecutiveIntentSemanticModel {
  return Object.freeze({ ...input, readOnly: true as const });
}
