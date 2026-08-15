/**
 * CC:4 — Runtime Control Bridge contracts.
 *
 * Maps validated CC:3 conversational commands into existing Nexora Runtime
 * authority. Adapter only — not a second Director or Stage controller.
 *
 * Pipeline:
 *   CC:3 Command → CC:4 Bridge → Existing Runtime Authority → Director → Stage
 */

import type { NexoraConversationalCommand } from "./conversationalCommand.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const conversationalRuntimeBridgeIdentity =
  "CC:4/RuntimeControlBridge" as const;

export const conversationalRuntimeBridgeVersion = "1.0.0" as const;

export const conversationalRuntimeBridgeNamespace =
  "nexora.conversational-control.runtime-control-bridge" as const;

export const conversationalRuntimeBridgePhase =
  "RuntimeControlBridge" as const;

export const conversationalRuntimeBridgeArchitecturalRole =
  "ConversationalRuntimeBridgeAuthority" as const;

export type ConversationalRuntimeBridgeIdentity = {
  readonly id: typeof conversationalRuntimeBridgeIdentity;
  readonly version: typeof conversationalRuntimeBridgeVersion;
  readonly namespace: typeof conversationalRuntimeBridgeNamespace;
  readonly phase: typeof conversationalRuntimeBridgePhase;
  readonly architecturalRole: typeof conversationalRuntimeBridgeArchitecturalRole;
};

const IDENTITY: ConversationalRuntimeBridgeIdentity = Object.freeze({
  id: conversationalRuntimeBridgeIdentity,
  version: conversationalRuntimeBridgeVersion,
  namespace: conversationalRuntimeBridgeNamespace,
  phase: conversationalRuntimeBridgePhase,
  architecturalRole: conversationalRuntimeBridgeArchitecturalRole,
});

export function getConversationalRuntimeBridgeIdentity(): ConversationalRuntimeBridgeIdentity {
  return IDENTITY;
}

/** Hard architectural boundary for CC:4. */
export const CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY = Object.freeze({
  architecturalRole: conversationalRuntimeBridgeArchitecturalRole,
  createsParallelStageController: false as const,
  writesStageCoordinates: false as const,
  movesCamera: false as const,
  changesSemanticTopologyZ: false as const,
  parsesRawLanguage: false as const,
  resolvesIntent: false as const,
  resolvesCanonicalObjectIds: false as const,
  inventsRelationships: false as const,
  inventsComparisonEngine: false as const,
  inventsAnalysisEngine: false as const,
  inventsSimulationEngine: false as const,
  usesLlmOrExternalProvider: false as const,
  convergesWithDirectInteraction: true as const,
  conversationCountsAsDirectUserControl: true as const,
});

// ─── Control source ─────────────────────────────────────────────────────────

export const NEXORA_RUNTIME_CONTROL_SOURCES = Object.freeze([
  "direct-interaction",
  "conversation",
  "navigation-restore",
  "automatic-attention",
  "fallback",
] as const);

export type NexoraRuntimeControlSource =
  (typeof NEXORA_RUNTIME_CONTROL_SOURCES)[number];

export const NEXORA_CONVERSATIONAL_RUNTIME_BRIDGE_STATUSES = Object.freeze([
  "applied",
  "rejected",
  "unsupported",
  "confirmation-required",
  "no-op",
] as const);

export type NexoraConversationalRuntimeBridgeStatus =
  (typeof NEXORA_CONVERSATIONAL_RUNTIME_BRIDGE_STATUSES)[number];

/**
 * Runtime action kinds mapped from CC:3 commands.
 * These name existing MVP authorities — not a parallel action taxonomy.
 */
export const NEXORA_CONVERSATIONAL_RUNTIME_ACTION_KINDS = Object.freeze([
  "select-interaction-subject",
  "reset-overview",
  "navigation-step-back",
  "navigation-step-forward",
  "open-queue-collection",
  "change-workspace",
  "resolve-executive-recommendation",
  "resolve-executive-scenario",
  "resolve-executive-decision-commitment",
  "unsupported",
] as const);

export type NexoraConversationalRuntimeActionKind =
  (typeof NEXORA_CONVERSATIONAL_RUNTIME_ACTION_KINDS)[number];

export type NexoraConversationalRuntimeActionPlan = {
  readonly runtimeActionKind: NexoraConversationalRuntimeActionKind;
  readonly primaryTargetId: string | null;
  readonly secondaryTargetIds: readonly string[];
  /** Queue category when opening a collection. */
  readonly collectionCategory:
    | "problem"
    | "scenario"
    | "decision"
    | "execution"
    | null;
  readonly source: "conversation";
  readonly notes: readonly string[];
};

export type NexoraConversationalRuntimeBridgeTrace = {
  readonly commandId: string;
  readonly commandKind: string;
  readonly validationPassed: boolean;
  readonly supportCheck: string;
  readonly mappedRuntimeActionKind: NexoraConversationalRuntimeActionKind | null;
  readonly authorityInvoked: string | null;
  readonly affectedSubjectIds: readonly string[];
  readonly status: NexoraConversationalRuntimeBridgeStatus;
  readonly reasons: readonly string[];
};

export type NexoraConversationalRuntimeBridgeResult = {
  readonly status: NexoraConversationalRuntimeBridgeStatus;
  readonly commandId: string;
  readonly runtimeActionKind: NexoraConversationalRuntimeActionKind | null;
  readonly source: "conversation";
  readonly affectedSubjectIds: readonly string[];
  readonly reasons: readonly string[];
  readonly plan: NexoraConversationalRuntimeActionPlan | null;
  readonly trace: NexoraConversationalRuntimeBridgeTrace;
};

export type NexoraConversationalRuntimeBridgeInput = {
  readonly command: NexoraConversationalCommand | null;
  /**
   * Optional known subject ids for target validation.
   * When omitted, target presence is still required for focus-like commands
   * but registry membership is left to the Runtime applicator.
   */
  readonly knownSubjectIds?: readonly string[];
  /** Prior command id for lightweight duplicate-dispatch detection. */
  readonly lastAppliedCommandId?: string | null;
};

export const CONVERSATIONAL_RUNTIME_BRIDGE_REASON = Object.freeze({
  RUNTIME_COMMAND_APPLIED: "runtime-command-applied",
  RUNTIME_COMMAND_PLANNED: "runtime-command-planned",
  RUNTIME_COMMAND_UNSUPPORTED: "runtime-command-unsupported",
  RUNTIME_TARGET_INVALID: "runtime-target-invalid",
  RUNTIME_CONFIRMATION_REQUIRED: "runtime-confirmation-required",
  RUNTIME_FOCUS_DISPATCHED: "runtime-focus-dispatched",
  RUNTIME_OVERVIEW_DISPATCHED: "runtime-overview-dispatched",
  RUNTIME_NAVIGATION_BACK_DISPATCHED: "runtime-navigation-back-dispatched",
  RUNTIME_NAVIGATION_FORWARD_DISPATCHED:
    "runtime-navigation-forward-dispatched",
  RUNTIME_REVEAL_DISPATCHED: "runtime-reveal-dispatched",
  RUNTIME_WORKSPACE_DISPATCHED: "runtime-workspace-change-dispatched",
  RUNTIME_RECOMMENDATION_DISPATCHED: "runtime-recommendation-authority-dispatched",
  RUNTIME_SCENARIO_DISPATCHED: "runtime-scenario-authority-dispatched",
  RUNTIME_DECISION_COMMITMENT_DISPATCHED:
    "runtime-decision-commitment-authority-dispatched",
  RUNTIME_EXPLORE_AS_FOCUS: "runtime-explore-mapped-to-focus-authority",
  RUNTIME_ANALYZE_AS_FOCUS: "runtime-analyze-mapped-to-focus-advisor-derive",
  RUNTIME_NO_OP: "runtime-no-op",
  RUNTIME_COMMAND_NULL: "runtime-command-null",
  RUNTIME_NOT_EXECUTABLE: "runtime-command-not-executable",
  RUNTIME_DUPLICATE_DISPATCH: "runtime-duplicate-dispatch-no-op",
  CONVERGES_WITH_CLICK: "converges-with-direct-interaction-authority",
  NO_STAGE_COORDINATE_WRITE: "did-not-write-stage-coordinates",
  NO_CAMERA_MOVE: "did-not-move-camera",
  NO_RAW_LANGUAGE: "did-not-parse-raw-language",
  DETERMINISTIC: "deterministic-runtime-bridge",
} as const);

export type ConversationalRuntimeBridgeReasonCode =
  (typeof CONVERSATIONAL_RUNTIME_BRIDGE_REASON)[keyof typeof CONVERSATIONAL_RUNTIME_BRIDGE_REASON];
