/**
 * APP-10:2 — Pattern Extraction Engine domain types.
 */

import type {
  PATTERN_CATEGORY_KEYS,
  PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION,
  PATTERN_EXTRACTION_PIPELINE_STAGES,
  PATTERN_TYPE_KEYS,
} from "./patternExtractionEngineConstants.ts";

export type PatternId = string;
export type PatternWorkspaceId = string;
export type ScenarioId = string;
export type DecisionId = string;
export type EvidenceId = string;

export type PatternCategory = (typeof PATTERN_CATEGORY_KEYS)[number];
export type PatternType = (typeof PATTERN_TYPE_KEYS)[number];
export type PatternExtractionPipelineStage = (typeof PATTERN_EXTRACTION_PIPELINE_STAGES)[number];

export type PatternMetadata = Readonly<{
  metadataVersion: string;
  owner?: string;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type PatternConfidenceMetadata = Readonly<{
  referenceCount: number;
  confidenceVersion: string;
  confidenceReferences: readonly string[];
  readOnly: true;
}>;

export type PatternProvenance = Readonly<{
  scenarioIds: readonly ScenarioId[];
  decisionIds: readonly DecisionId[];
  confidenceVersion: string;
  journalEntryIds: readonly string[];
  timelineReferences: readonly string[];
  extractionVersion: typeof PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION;
  engineVersion: typeof PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION;
  foundationVersion: "APP-10/1";
  readOnly: true;
}>;

export type PatternEvidence = Readonly<{
  evidenceId: EvidenceId;
  sourceApp: string;
  sourceType: string;
  referenceId: string;
  scenarioId: ScenarioId;
  decisionId?: DecisionId;
  description: string;
  readOnly: true;
}>;

export type PatternOutcome = Readonly<{
  outcomeId: string;
  summary: string;
  scenarioIds: readonly ScenarioId[];
  readOnly: true;
}>;

export type PatternSummary = Readonly<{
  evidenceCount: number;
  contributingScenarios: readonly ScenarioId[];
  contributingDecisions: readonly DecisionId[];
  contributingOutcomes: readonly PatternOutcome[];
  timelineReferences: readonly string[];
  journalReferences: readonly string[];
  confidenceReferences: readonly string[];
  readOnly: true;
}>;

export type ExecutivePattern = Readonly<{
  patternId: PatternId;
  patternName: string;
  patternType: PatternType;
  patternCategory: PatternCategory;
  workspaceId: PatternWorkspaceId;
  executiveSummary: string;
  supportingEvidence: readonly PatternEvidence[];
  sourceScenarioIds: readonly ScenarioId[];
  sourceDecisionIds: readonly DecisionId[];
  outcomeSummary: string;
  confidenceMetadata: PatternConfidenceMetadata;
  extractionTimestamp: string;
  version: typeof PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION;
  provenance: PatternProvenance;
  metadata: PatternMetadata;
  readOnly: true;
}>;

export type PatternRegistrySnapshot = Readonly<{
  registryVersion: typeof PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION;
  patternCount: number;
  patternIds: readonly PatternId[];
  readOnly: true;
}>;

export type PatternValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type PatternValidationResult = Readonly<{
  valid: boolean;
  issues: readonly PatternValidationIssue[];
  readOnly: true;
}>;

export type PatternExtractionEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type PatternEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: PatternExtractionEngineError | null;
  readOnly: true;
}>;

export type CertifiedCompletedScenarioInput = Readonly<{
  scenarioId: ScenarioId;
  workspaceId: PatternWorkspaceId;
  scenarioTitle: string;
  patternCategory: PatternCategory;
  patternType: PatternType;
  strategyChain: readonly string[];
  decisionIds: readonly DecisionId[];
  outcomeSummary: string;
  timelineReferences: readonly string[];
  journalReferences: readonly string[];
  confidenceReferences: readonly string[];
  confidenceVersion?: string;
  sourceApps: readonly string[];
}>;

export type NormalizedCompletedScenario = Readonly<{
  scenarioId: ScenarioId;
  workspaceId: PatternWorkspaceId;
  scenarioTitle: string;
  patternCategory: PatternCategory;
  patternType: PatternType;
  strategyChain: readonly string[];
  strategySignature: string;
  decisionIds: readonly DecisionId[];
  outcomeSummary: string;
  timelineReferences: readonly string[];
  journalReferences: readonly string[];
  confidenceReferences: readonly string[];
  confidenceVersion: string;
  sourceApps: readonly string[];
  readOnly: true;
}>;

export type PatternExtractionRequest = Readonly<{
  workspaceId: PatternWorkspaceId;
  scenarios: readonly CertifiedCompletedScenarioInput[];
  minOccurrences?: number;
  extractionTimestamp?: string;
  patternNamePrefix?: string;
}>;

export type PatternExtractionResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: PatternWorkspaceId;
  extractedPatterns: readonly ExecutivePattern[];
  registeredPatternIds: readonly PatternId[];
  skippedGroups: number;
  pipelineStages: readonly PatternExtractionPipelineStage[];
  extractionTimestamp: string;
  readOnly: true;
}>;

export type PatternExtractionEngineState = Readonly<{
  engineId: "pattern-extraction-engine";
  contractVersion: typeof PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredPatternCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type PatternExtractionCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type PatternExtractionCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-10/2";
  contractVersion: typeof PATTERN_EXTRACTION_ENGINE_CONTRACT_VERSION;
  checks: readonly PatternExtractionCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export function patternExtractionEngineErrorFromCode(
  code: string,
  message: string,
  field?: string
): PatternExtractionEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}
