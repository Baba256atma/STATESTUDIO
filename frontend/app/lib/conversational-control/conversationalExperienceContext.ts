/**
 * CC:6 — Workspace & Experience Control contracts.
 *
 * Resolves executive working context (workspace/presentation) from conversation.
 * Does not invent workspaces, mutate Stage coordinates, or bypass CC:4.
 */

import type { NexoraMVPPresentationState } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation.ts";
import type { NexoraMVPWorkspaceKind } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const conversationalExperienceControlIdentity =
  "CC:6/WorkspaceAndExperienceControl" as const;

export const conversationalExperienceControlVersion = "1.0.0" as const;

export const conversationalExperienceControlNamespace =
  "nexora.conversational-control.workspace-and-experience-control" as const;

export const conversationalExperienceControlPhase =
  "WorkspaceAndExperienceControl" as const;

export const conversationalExperienceControlArchitecturalRole =
  "ConversationalExperienceContextResolverAuthority" as const;

export type ConversationalExperienceControlIdentity = {
  readonly id: typeof conversationalExperienceControlIdentity;
  readonly version: typeof conversationalExperienceControlVersion;
  readonly namespace: typeof conversationalExperienceControlNamespace;
  readonly phase: typeof conversationalExperienceControlPhase;
  readonly architecturalRole: typeof conversationalExperienceControlArchitecturalRole;
};

const IDENTITY: ConversationalExperienceControlIdentity = Object.freeze({
  id: conversationalExperienceControlIdentity,
  version: conversationalExperienceControlVersion,
  namespace: conversationalExperienceControlNamespace,
  phase: conversationalExperienceControlPhase,
  architecturalRole: conversationalExperienceControlArchitecturalRole,
});

export function getConversationalExperienceControlIdentity(): ConversationalExperienceControlIdentity {
  return IDENTITY;
}

export const CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY = Object.freeze({
  architecturalRole: conversationalExperienceControlArchitecturalRole,
  inventsWorkspaceIds: false as const,
  inventsBusinessData: false as const,
  writesStageCoordinates: false as const,
  movesCamera: false as const,
  createsSecondWorkspaceAuthority: false as const,
  bypassesCc4: false as const,
  usesLlmOrExternalProvider: false as const,
  durableMemory: false as const,
  autonomousPlanner: false as const,
  calendarIntegration: false as const,
  /** Experiences map only onto existing NexoraMVPWorkspaceKind values. */
  registeredExperiencesMapToExistingWorkspacesOnly: true as const,
});

// ─── Experience context ─────────────────────────────────────────────────────

export const NEXORA_EXPERIENCE_CONTEXT_REASONS = Object.freeze([
  "explicit-request",
  "meeting-context",
  "task-context",
  "subject-context",
  "current-context",
  "fallback",
] as const);

export type NexoraExperienceContextReason =
  (typeof NEXORA_EXPERIENCE_CONTEXT_REASONS)[number];

/**
 * Executive working context — workspace + optional presentation depth.
 * modelId/lensId are optional scope keys only; not inventable product IDs.
 */
export type NexoraExecutiveExperienceContext = {
  readonly experienceId: string | null;
  readonly workspaceId: NexoraMVPWorkspaceKind | null;
  readonly modelId: string | null;
  readonly presentationState: NexoraMVPPresentationState | null;
  readonly entrySubjectId: string | null;
  readonly reason: NexoraExperienceContextReason;
  readonly confidence: number;
};

export const NEXORA_EXPERIENCE_TRANSITION_DECISIONS = Object.freeze([
  "keep-current",
  "transition",
  "clarification-required",
  "unsupported",
] as const);

export type NexoraExperienceTransitionDecision =
  (typeof NEXORA_EXPERIENCE_TRANSITION_DECISIONS)[number];

export const NEXORA_EXPERIENCE_RESOLUTION_STATUSES = Object.freeze([
  "resolved",
  "keep-current",
  "ambiguous",
  "not-found",
  "not-required",
  "unsupported",
] as const);

export type NexoraExperienceResolutionStatus =
  (typeof NEXORA_EXPERIENCE_RESOLUTION_STATUSES)[number];

export type NexoraExperienceContextChange = {
  readonly field: "workspace" | "presentationState" | "entrySubject";
  readonly from: string | null;
  readonly to: string | null;
};

export type NexoraExecutiveExperienceTransitionPlan = {
  readonly from: NexoraExecutiveExperienceContext;
  readonly to: NexoraExecutiveExperienceContext;
  readonly changes: readonly NexoraExperienceContextChange[];
  readonly decision: NexoraExperienceTransitionDecision;
  readonly executable: boolean;
  readonly requiresConfirmation: boolean;
  readonly reasons: readonly string[];
};

export type NexoraConversationalExperienceContextTrace = {
  readonly situationHint: string | null;
  readonly candidateExperienceIds: readonly string[];
  readonly matchedExperienceId: string | null;
  readonly currentWorkspaceId: string | null;
  readonly decision: NexoraExperienceTransitionDecision;
  readonly resolutionStatus: NexoraExperienceResolutionStatus;
  readonly reasons: readonly string[];
};

export type NexoraConversationalExperienceContextResolution = {
  readonly targetExperienceContext: NexoraExecutiveExperienceContext;
  readonly resolutionStatus: NexoraExperienceResolutionStatus;
  readonly decision: NexoraExperienceTransitionDecision;
  readonly plan: NexoraExecutiveExperienceTransitionPlan | null;
  readonly reasons: readonly string[];
  readonly trace: NexoraConversationalExperienceContextTrace;
};

export const CONVERSATIONAL_EXPERIENCE_CONTROL_REASON = Object.freeze({
  EXPLICIT_EXPERIENCE_MATCH: "explicit-experience-match",
  IMPLICIT_SITUATION_MATCH: "implicit-situation-match",
  MULTIPLE_EXPERIENCE_MATCHES: "multiple-experience-matches",
  EXPERIENCE_NOT_FOUND: "experience-not-found",
  CURRENT_EXPERIENCE_SATISFIES: "current-experience-satisfies-request",
  EXPERIENCE_TRANSITION_REQUIRED: "experience-transition-required",
  EXPERIENCE_TRANSITION_APPLIED: "experience-transition-applied",
  EXPERIENCE_TRANSITION_REJECTED: "experience-transition-rejected",
  EXPERIENCE_NOT_REQUIRED: "experience-not-required-for-intent",
  EXPLICIT_SUBJECT_PRESERVED: "explicit-subject-preserved",
  AUTOMATIC_ATTENTION_NOT_AUTHORITATIVE: "automatic-attention-not-authoritative",
  REGISTERED_EXPERIENCE_ONLY: "resolved-against-registered-experiences-only",
  NO_SYNTHESIZED_WORKSPACE: "did-not-synthesize-workspace-id",
  DETERMINISTIC: "deterministic-experience-context-resolution",
} as const);

export type ConversationalExperienceControlReasonCode =
  (typeof CONVERSATIONAL_EXPERIENCE_CONTROL_REASON)[keyof typeof CONVERSATIONAL_EXPERIENCE_CONTROL_REASON];
