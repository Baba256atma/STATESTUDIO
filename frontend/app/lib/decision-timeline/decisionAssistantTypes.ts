/**
 * APP-6:10 — Decision Assistant Integration domain types.
 * Immutable assistant explanation models — no AI or business logic.
 */

import type { DecisionEngineLifecycle } from "./decisionEventTypes.ts";
import type {
  DecisionDashboardComparisonSummary,
  DecisionDashboardReplaySummary,
  DecisionDashboardStateSummary,
} from "./decisionDashboardTypes.ts";
import type {
  DecisionId,
  DecisionStatus,
  DecisionValidationIssue,
  DecisionValidationResult,
  DecisionWorkspaceId,
} from "./decisionTimelineTypes.ts";

export const DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION = "APP-6/10" as const;
export const DECISION_ASSISTANT_INTEGRATION_ARCHITECTURE_VERSION = "APP-6/10-assistant-integration-arch" as const;

export const DECISION_ASSISTANT_INTEGRATION_TAGS = Object.freeze([
  "[APP6_10]",
  "[DECISION_ASSISTANT_INTEGRATION]",
  "[ADAPTER_ONLY]",
  "[READ_ONLY]",
  "[NO_LLM]",
  "[NO_PERSISTENCE]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_ASSISTANT_BINDINGS = Object.freeze([
  "single_decision_explanation",
  "decision_summary",
  "comparison_summary",
  "replay_summary",
  "status_explanation",
  "active_decision_summary",
  "terminal_decision_summary",
] as const);

export const DECISION_ASSISTANT_MANDATORY_MODEL_FIELDS = Object.freeze([
  "modelId",
  "binding",
  "decisionSummary",
  "decisionExplanation",
  "decisionStateSummary",
  "comparisonSummary",
  "replaySummary",
  "dashboardSummary",
  "validationMessages",
  "generatedAt",
  "readOnly",
] as const);

export const DECISION_ASSISTANT_INTEGRATION_LIMITS = Object.freeze({
  maxRegisteredModels: 1_024,
} as const);

export const DECISION_ASSISTANT_INTEGRATION_FORBIDDEN_PATTERNS = Object.freeze([
  "openai",
  "ChatGPT",
  "prompt(",
  "chatCompletion",
  "RecommendationEngine",
  "localStorage",
  "indexedDB",
  ".tsx",
  "React.",
] as const);

export const DECISION_ASSISTANT_INTEGRATION_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "deriveDecisionLifecycle",
  "buildDecisionHistory(",
  "compareDecisionStates(",
  "moveReplayCursor(",
  "getDecisionById(",
] as const);

export const DECISION_ASSISTANT_FUTURE_CONSUMERS = Object.freeze([
  "decision_platform_certification",
  "decision_api_layer",
] as const);

export type DecisionAssistantBinding = (typeof DECISION_ASSISTANT_BINDINGS)[number];

export type DecisionAssistantIntegrationInput = Readonly<{
  binding: DecisionAssistantBinding;
  decisionId?: DecisionId;
  leftDecisionId?: DecisionId;
  rightDecisionId?: DecisionId;
  workspaceId?: DecisionWorkspaceId;
  replayId?: string;
  comparisonId?: string;
  recentLimit?: number;
}>;

export type DecisionAssistantExplanation = Readonly<{
  explanationId: string;
  binding: DecisionAssistantBinding;
  decisionId: DecisionId | null;
  workspaceId: DecisionWorkspaceId | null;
  text: string;
  readOnly: true;
}>;

export type DecisionAssistantModel = Readonly<{
  modelId: string;
  binding: DecisionAssistantBinding;
  workspaceId: DecisionWorkspaceId | null;
  decisionSummary: string;
  decisionExplanation: string;
  decisionStateSummary: DecisionDashboardStateSummary | null;
  decisionStateSummaries: readonly DecisionDashboardStateSummary[];
  comparisonSummary: DecisionDashboardComparisonSummary | null;
  replaySummary: DecisionDashboardReplaySummary | null;
  dashboardSummary: string;
  status: DecisionStatus | null;
  lifecycle: DecisionEngineLifecycle | null;
  validationMessages: readonly string[];
  validation: DecisionValidationResult;
  generatedAt: string;
  contractVersion: typeof DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION;
  readOnly: true;
}>;

export type DecisionAssistantIntegrationState = Readonly<{
  integrationId: "decision-assistant-integration";
  contractVersion: typeof DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION;
  initialized: boolean;
  registeredModelCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionAssistantIntegrationResponse = Readonly<{
  success: boolean;
  reason: string;
  data: DecisionAssistantModel | null;
  readOnly: true;
}>;

export type DecisionAssistantRegistrySnapshot = Readonly<{
  registryVersion: string;
  registeredModelCount: number;
  modelIds: readonly string[];
  readOnly: true;
}>;

export type DecisionAssistantContractSurface = Readonly<{
  contractVersion: typeof DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION;
  mandatoryFields: readonly string[];
  supportedBindings: readonly DecisionAssistantBinding[];
  futureConsumers: typeof DECISION_ASSISTANT_FUTURE_CONSUMERS;
  readOnly: true;
}>;

export type DecisionAssistantCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionAssistantIntegrationCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionAssistantCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { DecisionValidationIssue, DecisionValidationResult };

export function assistantSuccess(reason: string, data: DecisionAssistantModel): DecisionAssistantIntegrationResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function assistantFailure(reason: string): DecisionAssistantIntegrationResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}
