/**
 * CC:2 — Executive Context Resolution contracts.
 *
 * Maps CC:1 intent + target hints (+ optional context snapshots) to canonical
 * Nexora subjects. Resolver only — no Runtime/Stage/Director mutation or execution.
 *
 * Pipeline boundary:
 *   CC:1 Intent + Hints → CC:2 Context Resolution → Resolved Subject Context → STOP
 */

import type {
  NexoraConversationalIntent,
  NexoraConversationalTargetHint,
} from "./conversationalIntent.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const conversationalContextResolutionIdentity =
  "CC:2/ExecutiveContextResolution" as const;

export const conversationalContextResolutionVersion = "1.0.0" as const;

export const conversationalContextResolutionNamespace =
  "nexora.conversational-control.executive-context-resolution" as const;

export const conversationalContextResolutionPhase =
  "ExecutiveContextResolution" as const;

export const conversationalContextResolutionArchitecturalRole =
  "ConversationalContextResolverAuthority" as const;

export type ConversationalContextResolutionIdentity = {
  readonly id: typeof conversationalContextResolutionIdentity;
  readonly version: typeof conversationalContextResolutionVersion;
  readonly namespace: typeof conversationalContextResolutionNamespace;
  readonly phase: typeof conversationalContextResolutionPhase;
  readonly architecturalRole: typeof conversationalContextResolutionArchitecturalRole;
};

const IDENTITY: ConversationalContextResolutionIdentity = Object.freeze({
  id: conversationalContextResolutionIdentity,
  version: conversationalContextResolutionVersion,
  namespace: conversationalContextResolutionNamespace,
  phase: conversationalContextResolutionPhase,
  architecturalRole: conversationalContextResolutionArchitecturalRole,
});

export function getConversationalContextResolutionIdentity(): ConversationalContextResolutionIdentity {
  return IDENTITY;
}

/** Hard architectural boundary for CC:2. */
export const CONVERSATIONAL_CONTEXT_BOUNDARY = Object.freeze({
  architecturalRole: conversationalContextResolutionArchitecturalRole,
  executesIntent: false as const,
  mutatesRuntime: false as const,
  mutatesStage: false as const,
  mutatesDirector: false as const,
  resolvesCanonicalObjectIds: true as const,
  synthesizesObjectIdsFromHints: false as const,
  usesLlmOrExternalProvider: false as const,
  ownsDurableConversationMemory: false as const,
  phaseStopsAtResolvedContext: true as const,
});

// ─── Subject kinds (aligned with REX workspace subject kinds + business/unknown)

export const NEXORA_CONVERSATIONAL_SUBJECT_KINDS = Object.freeze([
  "object",
  "goal",
  "problem",
  "scenario",
  "decision",
  "execution",
  "outcome",
  "workspace",
  "business",
  "unknown",
] as const);

export type NexoraConversationalSubjectKind =
  (typeof NEXORA_CONVERSATIONAL_SUBJECT_KINDS)[number];

export const NEXORA_CONVERSATIONAL_RESOLUTION_STATUSES = Object.freeze([
  "resolved",
  "ambiguous",
  "missing-context",
  "not-found",
  "not-required",
] as const);

export type NexoraConversationalResolutionStatus =
  (typeof NEXORA_CONVERSATIONAL_RESOLUTION_STATUSES)[number];

export const NEXORA_CONVERSATIONAL_RESOLUTION_SOURCES = Object.freeze([
  "explicit-hint",
  "conversation-context",
  "active-stage-context",
  "canonical-match",
  "none",
] as const);

export type NexoraConversationalResolutionSource =
  (typeof NEXORA_CONVERSATIONAL_RESOLUTION_SOURCES)[number];

export type NexoraConversationalResolvedSubject = {
  readonly subjectKind: NexoraConversationalSubjectKind;
  readonly subjectId: string;
  readonly canonicalName: string;
  readonly matchedHint?: string;
};

/**
 * Minimal read-only conversation context snapshot.
 * CC:2 consumes this; it does not own durable storage.
 * Prefer projecting from CC:7 via projectExecutiveContextForConversation.
 */
export type NexoraConversationContextSnapshot = {
  readonly currentSubjectId?: string | null;
  readonly previousSubjectIds?: readonly string[];
  readonly currentWorkspaceId?: string | null;
  readonly currentModelId?: string | null;
  /** CC:7 presented candidate set (ordinal resolution). */
  readonly presentedSubjectIds?: readonly string[];
  readonly presentedSetKind?: string | null;
  readonly presentedAnchorSubjectId?: string | null;
  readonly recentCandidateIds?: readonly string[];
};

/**
 * Optional read-only Stage/Runtime presentation snapshot.
 * Separate from conversation context. Used only when explicitly permitted.
 */
export type NexoraActiveStageContextSnapshot = {
  readonly focusedSubjectId?: string | null;
  readonly selectedSubjectId?: string | null;
};

/**
 * Canonical subject record supplied to CC:2 (read-only projection).
 * IDs must already exist in Nexora — never synthesized from hints.
 */
export type NexoraConversationalSubjectRecord = {
  readonly subjectId: string;
  readonly subjectKind: NexoraConversationalSubjectKind;
  readonly canonicalName: string;
  /** Explicitly registered aliases (normalized matching applied at resolve time). */
  readonly aliases?: readonly string[];
  /** Optional stable business key. */
  readonly businessKey?: string | null;
};

export type NexoraResolvedConversationalContext = {
  readonly primarySubject: NexoraConversationalResolvedSubject | null;
  readonly secondarySubjects: readonly NexoraConversationalResolvedSubject[];
  readonly resolutionStatus: NexoraConversationalResolutionStatus;
  readonly source: NexoraConversationalResolutionSource;
  readonly confidence: number;
  readonly reasons: readonly string[];
};

export type NexoraConversationalContextTrace = {
  readonly intentKind: string;
  readonly targetHints: readonly NexoraConversationalTargetHint[];
  readonly contextCandidates: readonly string[];
  readonly canonicalCandidates: readonly string[];
  readonly precedenceApplied: readonly string[];
  readonly finalPrimarySubjectId: string | null;
  readonly finalSecondarySubjectIds: readonly string[];
  readonly resolutionStatus: NexoraConversationalResolutionStatus;
  readonly source: NexoraConversationalResolutionSource;
  readonly confidence: number;
  readonly reasons: readonly string[];
};

export type NexoraConversationalContextResolution = {
  readonly context: NexoraResolvedConversationalContext;
  readonly trace: NexoraConversationalContextTrace;
};

export type NexoraExecutiveConversationalContextInput = {
  readonly intent: NexoraConversationalIntent;
  readonly targetHints?: readonly NexoraConversationalTargetHint[];
  readonly conversationContext?: NexoraConversationContextSnapshot | null;
  readonly activeStageContext?: NexoraActiveStageContextSnapshot | null;
  /**
   * When true, may fall back to focused/selected Stage subject after
   * conversation context — never overrides explicit hints.
   */
  readonly allowActiveStageContext?: boolean;
  /** Canonical Nexora subjects — required for explicit matching. */
  readonly executiveSubjects: readonly NexoraConversationalSubjectRecord[];
};

/** Stable reason codes for CC:2 traces. */
export const CONVERSATIONAL_CONTEXT_REASON = Object.freeze({
  INTENT_NOT_REQUIRING_SUBJECT: "intent-does-not-require-subject",
  EXPLICIT_TARGET_MATCH: "explicit-target-match",
  EXPLICIT_TARGET_PRECEDENCE: "explicit-user-target-beats-automatic-context",
  CANONICAL_SUBJECT_MATCH: "canonical-subject-match",
  MULTIPLE_CANONICAL_MATCHES: "multiple-canonical-matches",
  CANONICAL_SUBJECT_NOT_FOUND: "canonical-subject-not-found",
  RESOLVED_FROM_CURRENT_SUBJECT: "resolved-from-current-subject",
  RESOLVED_FROM_PREVIOUS_SUBJECT: "resolved-from-previous-subject",
  RESOLVED_FROM_PRESENTED_SET_ORDINAL: "resolved-from-presented-set-ordinal",
  PRESENTED_SET_MISSING_FOR_ORDINAL: "presented-set-missing-for-ordinal",
  ORDINAL_OUT_OF_RANGE: "ordinal-out-of-range",
  RESOLVED_FROM_STAGE_FOCUS: "resolved-from-active-stage-focus",
  RESOLVED_FROM_STAGE_SELECTION: "resolved-from-active-stage-selection",
  MISSING_CONVERSATION_CONTEXT: "missing-conversation-context",
  SECONDARY_SUBJECT_RESOLVED: "secondary-subject-resolved",
  SUBJECT_ORDER_PRESERVED: "multi-subject-order-preserved",
  RELATION_SCOPED_ANCHOR_ONLY: "relation-scoped-anchor-only-no-member-fetch",
  ID_FROM_REGISTRY_ONLY: "canonical-id-from-registered-subject-only",
  NO_SYNTHESIZED_ID: "did-not-synthesize-id-from-hint",
  DETERMINISTIC: "deterministic-context-resolution",
  STAGE_CONTEXT_NOT_PERMITTED: "active-stage-context-not-permitted",
  UNKNOWN_SUBJECT_IN_CONTEXT: "context-subject-id-not-in-registry",
} as const);

export type ConversationalContextReasonCode =
  (typeof CONVERSATIONAL_CONTEXT_REASON)[keyof typeof CONVERSATIONAL_CONTEXT_REASON];

/**
 * Precedence (highest → lowest), matching Nexora interaction philosophy:
 * EXPLICIT USER REFERENCE > CONVERSATION CONTEXT > ACTIVE PRESENTATION > FALLBACK
 */
export const CONVERSATIONAL_CONTEXT_PRECEDENCE = Object.freeze([
  "explicit-canonical-target-hint",
  "explicit-conversational-reference",
  "conversation-context",
  "active-stage-context-when-permitted",
  "no-resolution",
] as const);
