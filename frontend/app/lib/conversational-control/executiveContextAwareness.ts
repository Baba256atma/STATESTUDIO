/**
 * CC:7 — Executive Context Awareness contracts.
 *
 * Maintains structured executive situation across turns.
 * Observes trusted results only — does not reason, recommend, or mutate Runtime/Stage.
 */

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveContextAwarenessIdentity =
  "CC:7/ExecutiveContextAwareness" as const;

export const executiveContextAwarenessVersion = "1.0.0" as const;

export const executiveContextAwarenessNamespace =
  "nexora.conversational-control.executive-context-awareness" as const;

export const executiveContextAwarenessPhase =
  "ExecutiveContextAwareness" as const;

export const executiveContextAwarenessArchitecturalRole =
  "ExecutiveContextAwarenessAuthority" as const;

export type ExecutiveContextAwarenessIdentity = {
  readonly id: typeof executiveContextAwarenessIdentity;
  readonly version: typeof executiveContextAwarenessVersion;
  readonly namespace: typeof executiveContextAwarenessNamespace;
  readonly phase: typeof executiveContextAwarenessPhase;
  readonly architecturalRole: typeof executiveContextAwarenessArchitecturalRole;
};

const IDENTITY: ExecutiveContextAwarenessIdentity = Object.freeze({
  id: executiveContextAwarenessIdentity,
  version: executiveContextAwarenessVersion,
  namespace: executiveContextAwarenessNamespace,
  phase: executiveContextAwarenessPhase,
  architecturalRole: executiveContextAwarenessArchitecturalRole,
});

export function getExecutiveContextAwarenessIdentity(): ExecutiveContextAwarenessIdentity {
  return IDENTITY;
}

export const EXECUTIVE_CONTEXT_AWARENESS_BOUNDARY = Object.freeze({
  architecturalRole: executiveContextAwarenessArchitecturalRole,
  mutatesRuntime: false as const,
  mutatesStage: false as const,
  movesCamera: false as const,
  executesCommands: false as const,
  generatesRecommendations: false as const,
  runsScenarios: false as const,
  commitsDecisions: false as const,
  performsExecutionFollowUp: false as const,
  usesLlmOrExternalProvider: false as const,
  durableCrossSessionMemory: false as const,
  rawChatIsNotAuthority: true as const,
  sessionLifetimeOnly: true as const,
  /** Certified pipeline position after Runtime apply. */
  updatesAfterTrustedRuntimeResults: true as const,
});

/** Deterministic bounded history limits. */
export const EXECUTIVE_CONTEXT_BOUNDS = Object.freeze({
  previousSubjects: 8,
  recentReferences: 12,
  presentedSetSubjects: 12,
});

export const EXECUTIVE_CONTEXT_REASON = Object.freeze({
  EXPLICIT_SUBJECT_BECAME_CURRENT: "explicit-subject-became-current",
  CURRENT_SUBJECT_PUSHED_TO_HISTORY: "current-subject-pushed-to-history",
  SEMANTIC_SLOT_UPDATED: "semantic-slot-updated",
  WORKSPACE_SCOPE_CHANGED: "workspace-scope-changed",
  STALE_REFERENCE_DROPPED: "stale-reference-dropped",
  EXPLICIT_REFERENCE_PRESERVED: "explicit-reference-preserved",
  PRESENTED_SET_RECORDED: "presented-set-recorded",
  FAILED_TURN_CONTEXT_PRESERVED: "failed-turn-context-preserved",
  AUTOMATIC_ATTENTION_NOT_CONTEXT_AUTHORITY:
    "automatic-attention-not-context-authority",
  RUNTIME_FOCUS_SYNCHRONIZED: "runtime-focus-synchronized",
  NAVIGATION_FOCUS_SYNCHRONIZED: "navigation-focus-synchronized",
  OVERVIEW_PRESERVED_EXECUTIVE_STRUCTURE:
    "overview-preserved-executive-structure",
  LAST_COMMAND_RECORDED: "last-command-recorded",
  LAST_RUNTIME_RESULT_RECORDED: "last-runtime-result-recorded",
  LAST_RECOMMENDATION_RECORDED: "last-recommendation-id-recorded",
  TURN_INDEX_ADVANCED: "turn-index-advanced",
  DETERMINISTIC: "deterministic-executive-context-update",
} as const);

export type ExecutiveContextReasonCode =
  (typeof EXECUTIVE_CONTEXT_REASON)[keyof typeof EXECUTIVE_CONTEXT_REASON];
