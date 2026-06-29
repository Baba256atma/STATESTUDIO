/**
 * APP-3:2 — Executive Intent State Engine result types.
 * Immutable state resolution output — no UI or execution artifacts.
 */

import type { ExecutiveIntentWorkspaceId, IntentIdentifier } from "./executiveIntentTypes.ts";
import type { ExecutiveIntentDiagnostic } from "./executiveIntentDiagnostics.ts";
import type { IntentLifecycleTransitionValidation } from "./executiveIntentLifecycleMatrix.ts";

export const EXECUTIVE_INTENT_STATE_ENGINE_VERSION = "APP-3/2" as const;

export type ExecutiveIntentStateCategory =
  | "draft"
  | "valid"
  | "ready"
  | "blocked"
  | "paused"
  | "completed"
  | "archived"
  | "invalid"
  | "unknown";

export type IntentReadiness =
  | "not_ready"
  | "waiting"
  | "ready"
  | "blocked"
  | "completed"
  | "archived";

export type IntentStructuralHealth =
  | "healthy"
  | "warning"
  | "invalid"
  | "corrupted"
  | "unknown";

export type IntentFreshness =
  | "fresh"
  | "recent"
  | "aging"
  | "stale"
  | "expired"
  | "unknown";

export type IntentExecutionState =
  | "idle"
  | "awaiting_validation"
  | "awaiting_activation"
  | "active"
  | "paused"
  | "terminal"
  | "unknown";

export type IntentStateFlags = Readonly<{
  isReady: boolean;
  isBlocked: boolean;
  isArchived: boolean;
  isActionable: boolean;
  isStale: boolean;
  isStructurallyValid: boolean;
  isDownstreamReady: boolean;
  workspaceIsolated: boolean;
}>;

export type IntentStateSummary = Readonly<{
  intentId: IntentIdentifier;
  workspaceId: ExecutiveIntentWorkspaceId;
  headline: string;
  stateCategory: ExecutiveIntentStateCategory;
  readiness: IntentReadiness;
  structuralHealth: IntentStructuralHealth;
  freshness: IntentFreshness;
  executionState: IntentExecutionState;
  diagnosticCount: number;
  blockingDiagnosticCount: number;
  readOnly: true;
}>;

export type ExecutiveIntentState = Readonly<{
  intentId: IntentIdentifier;
  workspaceId: ExecutiveIntentWorkspaceId;
  stateCategory: ExecutiveIntentStateCategory;
  readiness: IntentReadiness;
  structuralHealth: IntentStructuralHealth;
  freshness: IntentFreshness;
  executionState: IntentExecutionState;
  flags: IntentStateFlags;
  readOnly: true;
}>;

export type IntentResolutionResult = Readonly<{
  intentId: IntentIdentifier;
  workspaceId: ExecutiveIntentWorkspaceId;
  state: ExecutiveIntentState;
  readiness: IntentReadiness;
  structuralHealth: IntentStructuralHealth;
  freshness: IntentFreshness;
  executionState: IntentExecutionState;
  lifecycleValidation: IntentLifecycleTransitionValidation | null;
  diagnostics: readonly ExecutiveIntentDiagnostic[];
  summary: IntentStateSummary;
  timestamp: string;
  contractVersion: string;
  engineVersion: typeof EXECUTIVE_INTENT_STATE_ENGINE_VERSION;
  compatibilityMetadata: Readonly<{
    contextEngineReady: true;
    extractionReady: false;
    readOnly: true;
  }>;
  readOnly: true;
}>;

export type ExecutiveIntentStateResolveRequest = Readonly<{
  intent: import("./executiveIntentTypes.ts").ExecutiveIntent | null;
  intentId: IntentIdentifier;
  workspaceId: ExecutiveIntentWorkspaceId;
  evaluatedAt: string;
  proposedLifecycleTransition?: Readonly<{
    from: import("./executiveIntentTypes.ts").IntentLifecycleStage;
    to: import("./executiveIntentTypes.ts").IntentLifecycleStage;
  }> | null;
}>;

export function createExecutiveIntentState(
  input: Omit<ExecutiveIntentState, "readOnly">
): ExecutiveIntentState {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createIntentStateSummary(
  input: Omit<IntentStateSummary, "readOnly">
): IntentStateSummary {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createIntentResolutionResult(
  input: Omit<
    IntentResolutionResult,
    "readOnly" | "engineVersion" | "compatibilityMetadata"
  >
): IntentResolutionResult {
  return Object.freeze({
    ...input,
    engineVersion: EXECUTIVE_INTENT_STATE_ENGINE_VERSION,
    compatibilityMetadata: Object.freeze({
      contextEngineReady: true,
      extractionReady: false,
      readOnly: true as const,
    }),
    readOnly: true as const,
  });
}

export type IntentStateEvaluationContext = Readonly<{
  request: ExecutiveIntentStateResolveRequest;
  diagnostics: readonly ExecutiveIntentDiagnostic[];
  structuralHealth: IntentStructuralHealth;
  freshness: IntentFreshness;
  readiness: IntentReadiness;
  executionState: IntentExecutionState;
  stateCategory: ExecutiveIntentStateCategory;
  flags: IntentStateFlags;
  lifecycleValidation: IntentLifecycleTransitionValidation | null;
}>;

/** Reserved for APP-3:3 Context Engine extension. */
export type IntentStateFutureExtension = Readonly<{
  contextBindings: null;
  timelineAnchors: null;
  evolutionTrail: null;
}>;

export const INTENT_STATE_FUTURE_EXTENSION_PLACEHOLDER: IntentStateFutureExtension = Object.freeze({
  contextBindings: null,
  timelineAnchors: null,
  evolutionTrail: null,
});
