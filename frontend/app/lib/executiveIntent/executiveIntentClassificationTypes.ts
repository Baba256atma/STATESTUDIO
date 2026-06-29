/**
 * APP-3:6 — Executive Intent classification types.
 * Canonical taxonomy classification — no quality scoring or recommendations.
 */

import type { ExecutiveIntentWorkspaceId } from "./executiveIntentTypes.ts";
import type { IntentClassificationDiagnostic } from "./executiveIntentClassificationDiagnostics.ts";
import type { IntentTaxonomyClassKey } from "./executiveIntentClassificationTaxonomy.ts";
import { EXECUTIVE_INTENT_CLASSIFICATION_TAXONOMY_VERSION } from "./executiveIntentClassificationTaxonomy.ts";

export const EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION = "APP-3/6" as const;

export type IntentClass = IntentTaxonomyClassKey;

export type IntentPrimaryClass = Readonly<{
  classId: IntentClass;
  label: string;
  ruleId: string;
  source: "dimension" | "action" | "goal" | "keyword" | "custom";
  readOnly: true;
}>;

export type IntentSecondaryClass = Readonly<{
  classId: IntentClass;
  label: string;
  ruleId: string;
  source: "dimension" | "action" | "goal" | "keyword" | "composite";
  readOnly: true;
}>;

export type IntentClassificationExplanation = Readonly<{
  explanationId: string;
  ruleId: string;
  description: string;
  readOnly: true;
}>;

export type IntentClassificationFlags = Readonly<{
  multiClass: boolean;
  compositeIntent: boolean;
  hybridIntent: boolean;
  customClassification: boolean;
  requiresManualReview: boolean;
  futureCompatible: true;
  readOnly: true;
  deterministic: true;
}>;

export type IntentClassificationSummary = Readonly<{
  headline: string;
  primaryClassLabel: string;
  secondaryClassLabels: readonly string[];
  classCount: number;
  taxonomyVersion: typeof EXECUTIVE_INTENT_CLASSIFICATION_TAXONOMY_VERSION;
  readOnly: true;
}>;

export type IntentClassificationMetadata = Readonly<{
  taxonomyVersion: typeof EXECUTIVE_INTENT_CLASSIFICATION_TAXONOMY_VERSION;
  classificationEngineVersion: typeof EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_VERSION;
  semanticModelVersion: string;
  rulesApplied: readonly string[];
  semanticModelId: string;
  readOnly: true;
}>;

export type IntentClassificationResult = Readonly<{
  classificationId: string;
  workspaceId: ExecutiveIntentWorkspaceId;
  semanticModelId: string;
  status: "classified" | "partial" | "incomplete" | "unknown";
  primaryClass: IntentPrimaryClass | null;
  secondaryClasses: readonly IntentSecondaryClass[];
  allClasses: readonly IntentClass[];
  flags: IntentClassificationFlags;
  explanations: readonly IntentClassificationExplanation[];
  diagnostics: readonly IntentClassificationDiagnostic[];
  summary: IntentClassificationSummary;
  metadata: IntentClassificationMetadata;
  timestamp: string;
  readOnly: true;
}>;

export type IntentClassificationValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
  readOnly: true;
}>;

/** Reserved for APP-3:7 extension. */
export type IntentClassificationFutureExtension = Readonly<{
  confidenceBindings: null;
  recommendationBindings: null;
  conflictBindings: null;
}>;

export const CLASSIFICATION_FUTURE_EXTENSION: IntentClassificationFutureExtension = Object.freeze({
  confidenceBindings: null,
  recommendationBindings: null,
  conflictBindings: null,
});

export function createIntentClassificationResult(
  input: Omit<IntentClassificationResult, "readOnly">
): IntentClassificationResult {
  return Object.freeze({ ...input, readOnly: true as const });
}
