/**
 * CC:5 — Conversational Experience Integration contracts.
 *
 * Experience/integration layer around CC:1–4. Owns UX feedback and session
 * continuity — not Runtime semantics, Stage choreography, or focus writers.
 */

import type { NexoraConversationalIntentResolution } from "./conversationalIntent.ts";
import type { NexoraConversationalContextResolution } from "./conversationalContext.ts";
import type { NexoraConversationalCommandMappingResult } from "./conversationalCommand.ts";
import type { NexoraConversationalRuntimeBridgeResult } from "./conversationalRuntimeBridge.ts";
import type { NexoraConversationContextSnapshot } from "./conversationalContext.ts";
import type { NexoraConversationalExperienceContextResolution } from "./conversationalExperienceContext.ts";
import type {
  NexoraExecutiveContextSnapshot,
  NexoraExecutiveContextUpdateResult,
} from "./executiveContextSnapshot.ts";
import type { NexoraExecutiveRecommendationResult } from "./executiveRecommendation.ts";
import type { NexoraExecutiveScenarioConversationResult } from "./executiveScenarioResolver.ts";
import type { NexoraExecutiveScenarioSession } from "./executiveScenarioResolver.ts";
import type { NexoraDecisionCommitmentResult } from "./executiveDecisionCommitmentResolver.ts";
import type { NexoraExecutiveDecisionSession } from "./executiveDecisionAuthority.ts";
import type {
  NexoraPendingTurnExpectation,
  NexoraPendingTurnResolution,
} from "./conversationalTurnExpectation.ts";
import type { NexoraConversationalActionDescriptor } from "./conversationalActionDescriptor.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const conversationalExperienceIdentity =
  "CC:5/ConversationalExperienceIntegration" as const;

export const conversationalExperienceVersion = "1.0.0" as const;

export const conversationalExperienceNamespace =
  "nexora.conversational-control.conversational-experience-integration" as const;

export const conversationalExperiencePhase =
  "ConversationalExperienceIntegration" as const;

export const conversationalExperienceArchitecturalRole =
  "ConversationalExperienceIntegrationAuthority" as const;

export type ConversationalExperienceIdentity = {
  readonly id: typeof conversationalExperienceIdentity;
  readonly version: typeof conversationalExperienceVersion;
  readonly namespace: typeof conversationalExperienceNamespace;
  readonly phase: typeof conversationalExperiencePhase;
  readonly architecturalRole: typeof conversationalExperienceArchitecturalRole;
};

const IDENTITY: ConversationalExperienceIdentity = Object.freeze({
  id: conversationalExperienceIdentity,
  version: conversationalExperienceVersion,
  namespace: conversationalExperienceNamespace,
  phase: conversationalExperiencePhase,
  architecturalRole: conversationalExperienceArchitecturalRole,
});

export function getConversationalExperienceIdentity(): ConversationalExperienceIdentity {
  return IDENTITY;
}

export const CONVERSATIONAL_EXPERIENCE_BOUNDARY = Object.freeze({
  architecturalRole: conversationalExperienceArchitecturalRole,
  ownsRuntimeSemantics: false as const,
  writesFocusDirectly: false as const,
  writesSelectionDirectly: false as const,
  writesAnchorDirectly: false as const,
  writesStageCoordinates: false as const,
  createsParallelStageController: false as const,
  usesLlmOrExternalProvider: false as const,
  durableConversationMemory: false as const,
  alwaysUsesCc1ThroughCc4: true as const,
  /** Certified pipeline includes CC:6 experience resolution before CC:3/4; CC:8 advisory on recommend. */
  pipelineOrder:
    "CC:1→CC:2→CC:6→CC:3→CC:4→CC:8?→CC:9?→CC:10?→CC:7→CC:5-feedback" as const,
  /** Production path uses applyNexoraMVPConversationalCommand; event is debug-only. */
  canonicalRuntimeEntry: "applyNexoraMVPConversationalCommand" as const,
  debugRuntimeEntry: "nexora-cc4-dispatch" as const,
});

// ─── Experience statuses ────────────────────────────────────────────────────

export const NEXORA_CONVERSATIONAL_EXPERIENCE_STATUSES = Object.freeze([
  "applied",
  "clarification-required",
  "not-found",
  "unsupported",
  "confirmation-required",
  "no-op",
  "failed",
] as const);

export type NexoraConversationalExperienceStatus =
  (typeof NEXORA_CONVERSATIONAL_EXPERIENCE_STATUSES)[number];

export type NexoraConversationalMessageRole = "manager" | "nexora";

export type NexoraConversationalMessage = {
  readonly id: string;
  readonly role: NexoraConversationalMessageRole;
  readonly text: string;
  readonly createdAt?: string;
  readonly status?: NexoraConversationalExperienceStatus;
  readonly commandId?: string;
};

/**
 * Read-only CC:5 projection of the existing UX:3 Professional Advisor.
 * Conversation may present this truth; it does not own or recompute it.
 */
export type NexoraConversationalAdvisorGrounding = {
  readonly isOverview: boolean;
  readonly currentSubjectId: string | null;
  readonly currentSubjectLabel: string | null;
  readonly attentionSubjectId: string | null;
  readonly attentionSubjectLabel: string | null;
  readonly attentionReason: string | null;
  readonly situation: string | null;
  readonly whyItMatters: string | null;
  readonly recommendation: string | null;
  readonly noRecommendationReason: string | null;
  readonly primaryActionLabel: string | null;
  readonly evidenceState: "strong" | "limited" | "incomplete" | "stale" | "none";
  readonly evidenceSummary: string | null;
  readonly recommendationAuthority: string;
  readonly primaryAction?: NexoraConversationalActionDescriptor | null;
  readonly availableActions?: readonly NexoraConversationalActionDescriptor[];
};

export type NexoraConversationalExperienceTrace = {
  readonly utterance: string;
  readonly intentKind: string | null;
  readonly contextStatus: string | null;
  readonly primarySubjectId: string | null;
  readonly experienceDecision: string | null;
  readonly experienceId: string | null;
  readonly commandKind: string | null;
  readonly runtimeStatus: string | null;
  readonly experienceStatus: NexoraConversationalExperienceStatus;
  readonly responseText: string;
  readonly executiveContextTurnIndex?: number | null;
  readonly executiveCurrentSubjectId?: string | null;
  readonly pendingTurnExpectationKind?: string | null;
  readonly pendingTurnResolutionStatus?: string | null;
};

export type NexoraConversationalExperienceResult = {
  readonly status: NexoraConversationalExperienceStatus;
  readonly response: string;
  readonly intentResult: NexoraConversationalIntentResolution;
  readonly contextResult: NexoraConversationalContextResolution;
  readonly experienceResult: NexoraConversationalExperienceContextResolution | null;
  readonly commandResult: NexoraConversationalCommandMappingResult | null;
  readonly runtimeResult: NexoraConversationalRuntimeBridgeResult | null;
  /** CC:8 advisory output when recommendation commands are applied. */
  readonly recommendationResult: NexoraExecutiveRecommendationResult | null;
  /** CC:9 scenario conversation output (session drafts). */
  readonly scenarioResult: NexoraExecutiveScenarioConversationResult | null;
  readonly nextScenarioSession: NexoraExecutiveScenarioSession | null;
  /** CC:10 Decision commitment output. */
  readonly decisionCommitmentResult: NexoraDecisionCommitmentResult | null;
  readonly nextDecisionSession: NexoraExecutiveDecisionSession | null;
  /** UX:4-FIX2 session-only dialogue expectation; never durable memory. */
  readonly nextPendingTurnExpectation: NexoraPendingTurnExpectation | null;
  readonly pendingTurnResolution: NexoraPendingTurnResolution | null;
  readonly nextConversationContext: NexoraConversationContextSnapshot;
  /** CC:7 structured executive context (session-scoped). */
  readonly nextExecutiveContext: NexoraExecutiveContextSnapshot;
  readonly executiveContextUpdate: NexoraExecutiveContextUpdateResult | null;
  readonly managerMessage: NexoraConversationalMessage;
  readonly nexoraMessage: NexoraConversationalMessage;
  readonly trace: NexoraConversationalExperienceTrace;
  /** True only when CC:4 applied and Runtime state should be committed. */
  readonly shouldCommitRuntime: boolean;
};

export const CONVERSATIONAL_EXPERIENCE_REASON = Object.freeze({
  PIPELINE_CC1_CC4: "pipeline-cc1-through-cc4",
  RESPONSE_FROM_RUNTIME: "response-reflects-runtime-result",
  CONTEXT_UPDATED_ON_SUCCESS: "context-updated-only-on-trusted-success",
  CONTEXT_PRESERVED_ON_FAILURE: "context-preserved-on-failure",
  NO_DIRECT_FOCUS_WRITE: "ui-did-not-write-focus",
  DETERMINISTIC: "deterministic-experience-orchestration",
} as const);
