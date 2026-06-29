/**
 * APP-3:12 — Executive Intent assistant types.
 * Presentation layer only — consumes APP-3:11 reasoning model.
 */

import type { ExecutiveIntentWorkspaceId, IntentIdentifier } from "./executiveIntentTypes.ts";
import type { AssistantIntentDiagnostic } from "./executiveIntentAssistantDiagnostics.ts";

export const EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_VERSION = "APP-3/12" as const;

export type AssistantIntentStatus =
  | "ready"
  | "needs_clarification"
  | "blocked"
  | "archived"
  | "incomplete"
  | "unknown";

export type AssistantIntentSectionKey =
  | "overview"
  | "intent"
  | "state"
  | "classification"
  | "confidence"
  | "conflicts"
  | "dependencies"
  | "evolution"
  | "known_information"
  | "unknown_information"
  | "highlights"
  | "issues"
  | "questions"
  | "diagnostics";

export type AssistantClarificationQuestionType =
  | "deadline"
  | "target_value"
  | "business_unit_owner"
  | "department_responsible"
  | "constraint_clarification"
  | "classification_clarification"
  | "general_unknown";

export type AssistantIntentSection = Readonly<{
  sectionId: string;
  sectionKey: AssistantIntentSectionKey;
  title: string;
  body: string;
  available: boolean;
  readOnly: true;
}>;

export type AssistantIntentQuestion = Readonly<{
  questionId: string;
  questionType: AssistantClarificationQuestionType;
  prompt: string;
  context: string;
  readOnly: true;
}>;

export type AssistantIntentExplanation = Readonly<{
  explanationId: string;
  topic: string;
  body: string;
  sourceSection: AssistantIntentSectionKey | null;
  readOnly: true;
}>;

export type AssistantIntentWarning = Readonly<{
  warningId: string;
  label: string;
  message: string;
  severity: "info" | "warning" | "error";
  readOnly: true;
}>;

export type AssistantIntentClarification = Readonly<{
  clarificationId: string;
  required: boolean;
  headline: string;
  questions: readonly AssistantIntentQuestion[];
  readOnly: true;
}>;

export type AssistantIntentFlags = Readonly<{
  assistantReady: boolean;
  reasoningAvailable: boolean;
  clarificationRequired: boolean;
  hasWarnings: boolean;
  hasConflicts: boolean;
  hasDependencies: boolean;
  lowConfidence: boolean;
  futureCompatible: true;
  readOnly: true;
  deterministic: true;
}>;

export type AssistantIntentMetadata = Readonly<{
  assistantIntegrationVersion: typeof EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_VERSION;
  reasoningEngineVersion: string | null;
  reasoningId: string | null;
  enginesConsumed: readonly string[];
  sectionCount: number;
  questionCount: number;
  readOnly: true;
}>;

export type AssistantIntentResponse = Readonly<{
  responseId: string;
  workspaceId: ExecutiveIntentWorkspaceId | null;
  focusIntentId: IntentIdentifier | null;
  status: AssistantIntentStatus;
  summary: string;
  sections: readonly AssistantIntentSection[];
  explanations: readonly AssistantIntentExplanation[];
  warnings: readonly AssistantIntentWarning[];
  clarifications: AssistantIntentClarification | null;
  highlights: readonly string[];
  openIssues: readonly string[];
  flags: AssistantIntentFlags;
  diagnostics: readonly AssistantIntentDiagnostic[];
  metadata: AssistantIntentMetadata;
  timestamp: string;
  readOnly: true;
}>;

export type AssistantIntentValidationResult = Readonly<{
  valid: boolean;
  issues: readonly string[];
  readOnly: true;
}>;

/** Reserved for APP-3:13 extension. */
export type AssistantIntentFutureExtension = Readonly<{
  dashboardBindings: null;
  layoutBindings: null;
}>;

export const ASSISTANT_FUTURE_EXTENSION: AssistantIntentFutureExtension = Object.freeze({
  dashboardBindings: null,
  layoutBindings: null,
});

export function createAssistantIntentResponse(
  input: Omit<AssistantIntentResponse, "readOnly">
): AssistantIntentResponse {
  return Object.freeze({ ...input, readOnly: true as const });
}
