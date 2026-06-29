/**
 * APP-3:4 — Executive Intent extraction types.
 * Structured extraction vocabulary — no classification, ranking, or recommendations.
 */

import type {
  ExecutiveIntent,
  ExecutiveIntentWorkspaceId,
  IntentCategory,
  IntentIdentifier,
  IntentPriority,
  IntentScope,
  IntentTarget,
} from "./executiveIntentTypes.ts";
import type { IntentExtractionDiagnostic } from "./executiveIntentExtractionDiagnostics.ts";

export const EXECUTIVE_INTENT_EXTRACTION_ENGINE_VERSION = "APP-3/4" as const;

export type IntentExtractionStatus = "success" | "partial" | "failed";

export type IntentExtractionLanguageCode = string;

export type ExtractedGoal = Readonly<{
  goalId: string;
  actionVerb: string;
  primaryPhrase: string;
  rawSegment: string;
  readOnly: true;
}>;

export type ExtractedTarget = Readonly<{
  targetId: string;
  objectLabel: string;
  valueLabel: string | null;
  numericValue: number | null;
  unit: string | null;
  businessArea: string | null;
  intentTarget: IntentTarget | null;
  readOnly: true;
}>;

export type ExtractedConstraint = Readonly<{
  constraintId: string;
  label: string;
  description: string;
  explicitText: string;
  readOnly: true;
}>;

export type ExtractedAssumption = Readonly<{
  assumptionId: string;
  label: string;
  description: string;
  explicitText: string;
  readOnly: true;
}>;

export type ExtractedTimeReference = Readonly<{
  timeRefId: string;
  phrase: string;
  normalizedLabel: string;
  explicitText: string;
  readOnly: true;
}>;

export type ExtractedEvidence = Readonly<{
  evidenceId: string;
  source: string;
  summary: string;
  explicitText: string;
  readOnly: true;
}>;

export type ExtractedActor = Readonly<{
  actorId: string;
  name: string;
  role: string | null;
  explicitText: string;
  readOnly: true;
}>;

export type ExtractionMetadata = Readonly<{
  extractionId: string;
  languageCode: IntentExtractionLanguageCode;
  ruleSetVersion: string;
  inputLength: number;
  segmentCount: number;
  explicitPriority: boolean;
  explicitScope: boolean;
  explicitCategory: boolean;
  readOnly: true;
}>;

export type ExtractionDiagnostics = Readonly<{
  status: IntentExtractionStatus;
  codes: readonly string[];
  warnings: readonly string[];
  extractedFieldNames: readonly string[];
  missingRequiredFields: readonly string[];
  unsupportedConstructs: readonly string[];
  explanation: string;
  entries: readonly IntentExtractionDiagnostic[];
  readOnly: true;
}>;

export type IntentExtractionRequest = Readonly<{
  text: string;
  workspaceId: ExecutiveIntentWorkspaceId;
  owner: string;
  languageCode?: IntentExtractionLanguageCode;
  generatedAt: string;
  intentIdPrefix?: string;
  explicitTags?: readonly string[];
  explicitScope?: IntentScope | null;
  explicitPriority?: IntentPriority | null;
}>;

export type IntentExtractionResult = Readonly<{
  extractionId: string;
  status: IntentExtractionStatus;
  intents: readonly ExecutiveIntent[];
  primaryIntent: ExecutiveIntent | null;
  goals: readonly ExtractedGoal[];
  targets: readonly ExtractedTarget[];
  constraints: readonly ExtractedConstraint[];
  assumptions: readonly ExtractedAssumption[];
  timeReferences: readonly ExtractedTimeReference[];
  evidence: readonly ExtractedEvidence[];
  actors: readonly ExtractedActor[];
  diagnostics: ExtractionDiagnostics;
  metadata: ExtractionMetadata;
  timestamp: string;
  contractVersion: string;
  engineVersion: typeof EXECUTIVE_INTENT_EXTRACTION_ENGINE_VERSION;
  readOnly: true;
}>;

export type IntentExtractionBatchResult = Readonly<{
  results: readonly IntentExtractionResult[];
  successCount: number;
  partialCount: number;
  failedCount: number;
  readOnly: true;
}>;

export type IntentExtractionValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
  readOnly: true;
}>;

/** Reserved for APP-3:5 classification extension. */
export type IntentExtractionFutureExtension = Readonly<{
  classificationLabels: null;
  confidenceScores: null;
  rankingHints: null;
}>;

export const INTENT_EXTRACTION_FUTURE_EXTENSION: IntentExtractionFutureExtension = Object.freeze({
  classificationLabels: null,
  confidenceScores: null,
  rankingHints: null,
});

export function createIntentExtractionResult(
  input: Omit<
    IntentExtractionResult,
    "readOnly" | "engineVersion" | "contractVersion"
  > & { contractVersion: string }
): IntentExtractionResult {
  return Object.freeze({
    ...input,
    engineVersion: EXECUTIVE_INTENT_EXTRACTION_ENGINE_VERSION,
    readOnly: true as const,
  });
}
