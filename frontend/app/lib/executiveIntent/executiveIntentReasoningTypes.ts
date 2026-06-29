/**
 * APP-3:11 — Executive Intent reasoning types.
 * Unified reasoning model — orchestration only, no recommendations.
 */

import type { ExecutiveIntentWorkspaceId, IntentIdentifier } from "./executiveIntentTypes.ts";
import type { IntentReasoningDiagnostic } from "./executiveIntentReasoningDiagnostics.ts";

export const EXECUTIVE_INTENT_REASONING_ENGINE_VERSION = "APP-3/11" as const;

export type ExecutiveIntentReadinessState =
  | "ready"
  | "needs_clarification"
  | "blocked"
  | "incomplete"
  | "not_ready"
  | "archived"
  | "unknown";

export type ExecutiveIntentReasoningHighlightKey =
  | "clearly_defined_objective"
  | "stable_strategy"
  | "strong_semantic_model"
  | "no_major_conflicts"
  | "critical_dependency"
  | "multiple_unknowns"
  | "recent_strategy_shift"
  | "high_structural_confidence";

export type ExecutiveIntentReasoningIssueKey =
  | "missing_deadline"
  | "missing_target_value"
  | "conflicting_objectives"
  | "circular_dependency"
  | "unstable_evolution"
  | "low_understanding_confidence"
  | "incomplete_classification"
  | "unknown_constraints";

export type ExecutiveIntentReasoningSectionKey =
  | "intent_summary"
  | "current_state"
  | "semantic_summary"
  | "primary_classification"
  | "secondary_classifications"
  | "conflict_summary"
  | "dependency_summary"
  | "evolution_summary"
  | "confidence_summary"
  | "known_information"
  | "unknown_information";

export type ExecutiveIntentReasoningSection = Readonly<{
  sectionId: string;
  sectionKey: ExecutiveIntentReasoningSectionKey;
  title: string;
  content: string;
  available: boolean;
  sourceEngine: string | null;
  readOnly: true;
}>;

export type ExecutiveIntentReasoningEvidence = Readonly<{
  evidenceId: string;
  label: string;
  description: string;
  sourceEngine: string;
  sourceReference: string | null;
  readOnly: true;
}>;

export type ExecutiveIntentReasoningIssue = Readonly<{
  issueId: string;
  issueKey: ExecutiveIntentReasoningIssueKey;
  label: string;
  description: string;
  severity: "info" | "warning" | "error";
  sourceEngine: string;
  blocking: boolean;
  readOnly: true;
}>;

export type ExecutiveIntentReasoningUnknown = Readonly<{
  unknownId: string;
  label: string;
  description: string;
  sourceEngine: string;
  readOnly: true;
}>;

export type ExecutiveIntentReasoningHighlights = Readonly<{
  highlightsId: string;
  items: readonly Readonly<{
    highlightId: string;
    highlightKey: ExecutiveIntentReasoningHighlightKey;
    label: string;
    description: string;
    readOnly: true;
  }>[];
  readOnly: true;
}>;

export type ExecutiveIntentReadinessAssessment = Readonly<{
  assessmentId: string;
  state: ExecutiveIntentReadinessState;
  headline: string;
  explanation: string;
  readyForAssistant: boolean;
  readyForDashboard: boolean;
  blockingIssueCount: number;
  readOnly: true;
}>;

export type ExecutiveIntentReasoningSummary = Readonly<{
  summaryId: string;
  headline: string;
  intentLabel: string;
  readinessState: ExecutiveIntentReadinessState;
  confidenceLevel: string | null;
  primaryClassification: string | null;
  issueCount: number;
  unknownCount: number;
  highlightCount: number;
  readOnly: true;
}>;

export type ExecutiveIntentReasoningFlags = Readonly<{
  reasoningComplete: boolean;
  reasoningIncomplete: boolean;
  hasConflicts: boolean;
  hasDependencies: boolean;
  hasEvolutionHistory: boolean;
  lowConfidence: boolean;
  multipleUnknowns: boolean;
  readyForAssistant: boolean;
  readyForDashboard: boolean;
  futureCompatible: true;
  readOnly: true;
  deterministic: true;
}>;

export type ExecutiveIntentReasoningMetadata = Readonly<{
  reasoningEngineVersion: typeof EXECUTIVE_INTENT_REASONING_ENGINE_VERSION;
  contractVersion: string | null;
  extractionEngineVersion: string | null;
  stateEngineVersion: string | null;
  semanticModelVersion: string | null;
  classificationEngineVersion: string | null;
  conflictEngineVersion: string | null;
  dependencyEngineVersion: string | null;
  evolutionEngineVersion: string | null;
  confidenceEngineVersion: string | null;
  rulesApplied: readonly string[];
  enginesConsumed: readonly string[];
  readOnly: true;
}>;

export type ExecutiveIntentReasoning = Readonly<{
  reasoningId: string;
  workspaceId: ExecutiveIntentWorkspaceId;
  focusIntentId: IntentIdentifier | null;
  summary: ExecutiveIntentReasoningSummary;
  sections: readonly ExecutiveIntentReasoningSection[];
  highlights: ExecutiveIntentReasoningHighlights;
  issues: readonly ExecutiveIntentReasoningIssue[];
  evidence: readonly ExecutiveIntentReasoningEvidence[];
  unknowns: readonly ExecutiveIntentReasoningUnknown[];
  readinessAssessment: ExecutiveIntentReadinessAssessment;
  flags: ExecutiveIntentReasoningFlags;
  diagnostics: readonly IntentReasoningDiagnostic[];
  metadata: ExecutiveIntentReasoningMetadata;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveIntentReasoningAnalysisInput = Readonly<{
  workspaceId: ExecutiveIntentWorkspaceId;
  focusIntentId: IntentIdentifier | null;
  extraction: import("./executiveIntentExtractionTypes.ts").IntentExtractionResult | null;
  state: import("./executiveIntentStateTypes.ts").IntentResolutionResult | null;
  semanticModel: import("./executiveIntentSemanticTypes.ts").ExecutiveIntentSemanticModel | null;
  classification: import("./executiveIntentClassificationTypes.ts").IntentClassificationResult | null;
  conflict: import("./executiveIntentConflictTypes.ts").IntentConflictResult | null;
  dependency: import("./executiveIntentDependencyTypes.ts").IntentDependencyResult | null;
  evolution: import("./executiveIntentEvolutionTypes.ts").IntentEvolutionResult | null;
  confidence: import("./executiveIntentConfidenceTypes.ts").IntentConfidenceResult | null;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveIntentReasoningValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
  readOnly: true;
}>;

/** Reserved for APP-3:12 extension. */
export type ExecutiveIntentReasoningFutureExtension = Readonly<{
  assistantBindings: null;
  dashboardBindings: null;
  scenarioBindings: null;
}>;

export const REASONING_FUTURE_EXTENSION: ExecutiveIntentReasoningFutureExtension = Object.freeze({
  assistantBindings: null,
  dashboardBindings: null,
  scenarioBindings: null,
});

export function createExecutiveIntentReasoning(
  input: Omit<ExecutiveIntentReasoning, "readOnly">
): ExecutiveIntentReasoning {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveIntentReasoningAnalysisInput(
  input: Omit<ExecutiveIntentReasoningAnalysisInput, "readOnly">
): ExecutiveIntentReasoningAnalysisInput {
  return Object.freeze({ ...input, readOnly: true as const });
}
