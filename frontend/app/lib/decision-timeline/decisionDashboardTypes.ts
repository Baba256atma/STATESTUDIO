/**
 * APP-6:9 — Decision Dashboard Integration domain types.
 * Immutable dashboard view models — no business logic.
 */

import type { DecisionEngineLifecycle } from "./decisionEventTypes.ts";
import type {
  DecisionId,
  DecisionStatus,
  DecisionValidationIssue,
  DecisionValidationResult,
  DecisionWorkspaceId,
} from "./decisionTimelineTypes.ts";

export const DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION = "APP-6/9" as const;
export const DECISION_DASHBOARD_INTEGRATION_ARCHITECTURE_VERSION = "APP-6/9-dashboard-integration-arch" as const;

export const DECISION_DASHBOARD_INTEGRATION_TAGS = Object.freeze([
  "[APP6_9]",
  "[DECISION_DASHBOARD_INTEGRATION]",
  "[ADAPTER_ONLY]",
  "[READ_ONLY]",
  "[NO_UI]",
  "[NO_PERSISTENCE]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_DASHBOARD_BINDINGS = Object.freeze([
  "single_decision",
  "decision_list",
  "decision_comparison",
  "replay_summary",
  "active_decisions",
  "terminal_decisions",
  "recent_decisions",
] as const);

export const DECISION_DASHBOARD_MANDATORY_MODEL_FIELDS = Object.freeze([
  "modelId",
  "binding",
  "decisionSummary",
  "decisionState",
  "comparisonSummary",
  "replaySummary",
  "status",
  "lifecycle",
  "validation",
  "generatedAt",
  "readOnly",
] as const);

export const DECISION_DASHBOARD_INTEGRATION_LIMITS = Object.freeze({
  maxRegisteredModels: 1_024,
  maxListItems: 512,
} as const);

export const DECISION_DASHBOARD_INTEGRATION_FORBIDDEN_PATTERNS = Object.freeze([
  "AssistantEngine",
  "DecisionChart",
  "DashboardWidget",
  "localStorage",
  "indexedDB",
  ".tsx",
  "React.",
] as const);

export const DECISION_DASHBOARD_INTEGRATION_ENGINE_FORBIDDEN_PATTERNS = Object.freeze([
  "deriveDecisionLifecycle",
  "buildDecisionHistory(",
  "compareDecisionStates(",
  "moveReplayCursor(",
] as const);

export const DECISION_DASHBOARD_FUTURE_CONSUMERS = Object.freeze([
  "decision_assistant",
  "decision_api_layer",
  "decision_platform_certification",
] as const);

export type DecisionDashboardBinding = (typeof DECISION_DASHBOARD_BINDINGS)[number];

export type DecisionDashboardIntegrationInput = Readonly<{
  binding: DecisionDashboardBinding;
  decisionId?: DecisionId;
  leftDecisionId?: DecisionId;
  rightDecisionId?: DecisionId;
  workspaceId?: DecisionWorkspaceId;
  replayId?: string;
  comparisonId?: string;
  recentLimit?: number;
}>;

export type DecisionDashboardStateSummary = Readonly<{
  decisionId: DecisionId;
  workspaceId: DecisionWorkspaceId;
  status: DecisionStatus;
  lifecycle: DecisionEngineLifecycle | null;
  isTerminal: boolean;
  isValid: boolean;
  currentVersion: string;
  latestTimestamp: string | null;
  readOnly: true;
}>;

export type DecisionDashboardComparisonSummary = Readonly<{
  comparisonId: string;
  leftDecisionId: DecisionId;
  rightDecisionId: DecisionId;
  hasDifferences: boolean;
  lifecycleChanged: boolean;
  statusChanged: boolean;
  terminalChanged: boolean;
  messages: readonly string[];
  readOnly: true;
}>;

export type DecisionDashboardReplaySummary = Readonly<{
  replayId: string;
  decisionId: DecisionId;
  cursorIndex: number;
  totalEvents: number;
  currentEventId: string | null;
  isFirst: boolean;
  isLast: boolean;
  readOnly: true;
}>;

export type DecisionDashboardModel = Readonly<{
  modelId: string;
  binding: DecisionDashboardBinding;
  workspaceId: DecisionWorkspaceId | null;
  decisionSummary: string;
  decisionState: DecisionDashboardStateSummary | null;
  decisionStates: readonly DecisionDashboardStateSummary[];
  comparisonSummary: DecisionDashboardComparisonSummary | null;
  replaySummary: DecisionDashboardReplaySummary | null;
  status: DecisionStatus | null;
  lifecycle: DecisionEngineLifecycle | null;
  validation: DecisionValidationResult;
  generatedAt: string;
  contractVersion: typeof DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION;
  readOnly: true;
}>;

export type DecisionDashboardIntegrationState = Readonly<{
  integrationId: "decision-dashboard-integration";
  contractVersion: typeof DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION;
  initialized: boolean;
  registeredModelCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type DecisionDashboardIntegrationResponse = Readonly<{
  success: boolean;
  reason: string;
  data: DecisionDashboardModel | null;
  readOnly: true;
}>;

export type DecisionDashboardRegistrySnapshot = Readonly<{
  registryVersion: string;
  registeredModelCount: number;
  modelIds: readonly string[];
  readOnly: true;
}>;

export type DecisionDashboardContractSurface = Readonly<{
  contractVersion: typeof DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION;
  mandatoryFields: readonly string[];
  supportedBindings: readonly DecisionDashboardBinding[];
  futureConsumers: typeof DECISION_DASHBOARD_FUTURE_CONSUMERS;
  readOnly: true;
}>;

export type DecisionDashboardCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionDashboardIntegrationCertificationResult = Readonly<{
  certified: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  checks: readonly DecisionDashboardCertificationCheck[];
  score: number;
  readOnly: true;
}>;

export type { DecisionValidationIssue, DecisionValidationResult };

export function dashboardSuccess(reason: string, data: DecisionDashboardModel): DecisionDashboardIntegrationResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}

export function dashboardFailure(reason: string): DecisionDashboardIntegrationResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}
