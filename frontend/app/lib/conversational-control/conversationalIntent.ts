/**
 * CC:1 — Conversational Intent Foundation.
 *
 * Converts an executive utterance into a typed Nexora Executive Intent.
 * Interprets only — does not execute, resolve object IDs, or mutate Runtime/Stage/Director.
 *
 * Pipeline boundary:
 *   Utterance → Normalization → Intent Resolution → Canonical Intent → STOP
 */

// ─── Identity ───────────────────────────────────────────────────────────────

export const conversationalIntentFoundationIdentity =
  "CC:1/ConversationalIntentFoundation" as const;

export const conversationalIntentFoundationVersion = "1.0.0" as const;

export const conversationalIntentFoundationNamespace =
  "nexora.conversational-control.conversational-intent.foundation" as const;

export const conversationalIntentFoundationPhase =
  "ConversationalIntentFoundation" as const;

export const conversationalIntentFoundationArchitecturalRole =
  "ConversationalIntentInterpreterAuthority" as const;

export type ConversationalIntentFoundationIdentity = {
  readonly id: typeof conversationalIntentFoundationIdentity;
  readonly version: typeof conversationalIntentFoundationVersion;
  readonly namespace: typeof conversationalIntentFoundationNamespace;
  readonly phase: typeof conversationalIntentFoundationPhase;
  readonly architecturalRole: typeof conversationalIntentFoundationArchitecturalRole;
};

const IDENTITY: ConversationalIntentFoundationIdentity = Object.freeze({
  id: conversationalIntentFoundationIdentity,
  version: conversationalIntentFoundationVersion,
  namespace: conversationalIntentFoundationNamespace,
  phase: conversationalIntentFoundationPhase,
  architecturalRole: conversationalIntentFoundationArchitecturalRole,
});

export function getConversationalIntentFoundationIdentity(): ConversationalIntentFoundationIdentity {
  return IDENTITY;
}

/** Hard architectural boundary for CC:1. */
export const CONVERSATIONAL_INTENT_BOUNDARY = Object.freeze({
  architecturalRole: conversationalIntentFoundationArchitecturalRole,
  executesIntent: false as const,
  mutatesRuntime: false as const,
  mutatesStage: false as const,
  mutatesDirector: false as const,
  resolvesCanonicalObjectIds: false as const,
  usesLlmOrExternalProvider: false as const,
  writesFocusSelectionOrCamera: false as const,
  phaseStopsAtCanonicalIntent: true as const,
});

// ─── Canonical intent kinds ─────────────────────────────────────────────────
//
// Vocabulary aligns with existing Nexora terms:
// - focus / overview / navigate-back  ↔ DRI focus-target, clear/overview, navigate-back
// - show-problems|scenarios|decisions|execution ↔ REX workspace / Queue categories
// - explore / compare / analyze / simulate ↔ REX + Data Reality advisor intents
// - navigate-forward ↔ Stage 2D trail forward (no DRI twin; Stage-native)

export const NEXORA_CONVERSATIONAL_INTENT_KINDS = Object.freeze([
  "greet",
  "help",
  "situation",
  "evidence",
  "change",
  "risk",
  "decision-status",
  "execution-status",
  "focus",
  "explore",
  "overview",
  "show-related",
  "show-problems",
  "show-goals",
  "show-scenarios",
  "show-decisions",
  "show-execution",
  "compare",
  "analyze",
  "simulate",
  "navigate-back",
  "navigate-forward",
  "prepare-context",
  "switch-workspace",
  "recommend",
  "explain",
  "prioritize",
  "explore-scenario",
  "define-scenario",
  "compare-scenarios",
  "explain-scenario",
  "modify-scenario",
  "select-scenario-reference",
  "commit-decision",
  "prefer-option",
  "reject-decision",
  "defer-decision",
  "reconsider-decision",
  "confirm-decision-commitment",
  "cancel-decision-commitment",
  "unknown",
] as const);

export type NexoraConversationalIntentKind =
  (typeof NEXORA_CONVERSATIONAL_INTENT_KINDS)[number];

export const NEXORA_CONVERSATIONAL_EXECUTION_CLASSES = Object.freeze([
  "navigation",
  "exploration",
  "analysis",
  "simulation",
  "unknown",
] as const);

export type NexoraConversationalExecutionClass =
  (typeof NEXORA_CONVERSATIONAL_EXECUTION_CLASSES)[number];

export const NEXORA_CONVERSATIONAL_INTENT_SOURCES = Object.freeze([
  "conversation",
] as const);

export type NexoraConversationalIntentSource =
  (typeof NEXORA_CONVERSATIONAL_INTENT_SOURCES)[number];

/**
 * Raw lexical target hint extracted from the utterance.
 * Never a canonical object id (obj-*), workspace id, or Data Reality id.
 * CC:2 owns context → subject mapping.
 */
export type NexoraConversationalTargetHint = {
  readonly raw: string;
  readonly role:
    | "primary"
    | "secondary"
    | "compare-left"
    | "compare-right"
    | "experience"
    | "ordinal"
    | "scenario-op"
    | "scenario-value"
    | "scenario-horizon"
    | "scenario-assumption";
};

/** Optional structured scenario payload (CC:9). Lexical only — no object IDs. */
export type NexoraConversationalScenarioIntentPayload = {
  readonly operation:
    | "do-nothing"
    | "intervention"
    | "modify"
    | "add-assumption"
    | "compare"
    | "downside"
    | "explain-preference"
    | "describe"
    | "confidence"
    | "affected"
    | "kpi-impact"
    | "impact-why"
    | "open-ordinal"
    | "commitment-attempt";
  readonly actionKind?: "increase-by" | "decrease-by" | "hold" | "delay";
  readonly changeKind?: "directional" | "state";
  readonly state?: string;
  readonly direction?:
    | "increase"
    | "decrease"
    | "delay"
    | "worsen"
    | "improve"
    | "hold";
  readonly intensity?: "too" | "very" | "extremely" | "more" | "less";
  readonly value?: number;
  readonly unit?: "%" | string;
  readonly horizonAmount?: number;
  readonly horizonUnit?: "day" | "week" | "month" | "quarter" | "year";
  readonly assumptionSubjectRaw?: string;
  readonly ordinal?: number;
};

export type NexoraConversationalDecisionCommitmentPayload = {
  readonly action:
    | "approve"
    | "create"
    | "reject"
    | "defer"
    | "reconsider"
    | "confirm"
    | "cancel"
    | "preference";
  readonly strength: "preference" | "soft" | "explicit";
  readonly hasCompoundExecutionRequest?: boolean;
};

export type NexoraConversationalIntent = {
  readonly kind: NexoraConversationalIntentKind;
  /** 0..1 inclusive; deterministic heuristic, not probabilistic model score. */
  readonly confidence: number;
  readonly normalizedUtterance: string;
  readonly source: NexoraConversationalIntentSource;
  readonly requiresContext: boolean;
  readonly requiresTarget: boolean;
  readonly executionClass: NexoraConversationalExecutionClass;
  readonly reasons: readonly string[];
  /** Lexical hints only — never canonical object IDs. */
  readonly targetHints: readonly NexoraConversationalTargetHint[];
  readonly scenarioPayload?: NexoraConversationalScenarioIntentPayload | null;
  readonly decisionCommitmentPayload?: NexoraConversationalDecisionCommitmentPayload | null;
};

export type NexoraConversationalIntentInput = {
  readonly utterance: string;
};

/**
 * Deterministic observability trace (reason codes only — no chain-of-thought).
 */
export type NexoraConversationalIntentTrace = {
  readonly utterance: string;
  readonly normalizedUtterance: string;
  readonly candidateKinds: readonly NexoraConversationalIntentKind[];
  readonly finalKind: NexoraConversationalIntentKind;
  readonly confidence: number;
  readonly reasons: readonly string[];
  readonly targetHints: readonly NexoraConversationalTargetHint[];
  readonly requiresContext: boolean;
  readonly requiresTarget: boolean;
};

export type NexoraConversationalIntentResolution = {
  readonly intent: NexoraConversationalIntent;
  readonly trace: NexoraConversationalIntentTrace;
};

export const EXECUTION_CLASS_BY_INTENT_KIND: Readonly<
  Record<NexoraConversationalIntentKind, NexoraConversationalExecutionClass>
> = Object.freeze({
  greet: "analysis",
  help: "analysis",
  situation: "analysis",
  evidence: "analysis",
  change: "analysis",
  risk: "analysis",
  "decision-status": "analysis",
  "execution-status": "analysis",
  focus: "navigation",
  explore: "exploration",
  overview: "navigation",
  "show-related": "exploration",
  "show-problems": "exploration",
  "show-goals": "exploration",
  "show-scenarios": "exploration",
  "show-decisions": "exploration",
  "show-execution": "exploration",
  compare: "analysis",
  analyze: "analysis",
  simulate: "simulation",
  "navigate-back": "navigation",
  "navigate-forward": "navigation",
  "prepare-context": "navigation",
  "switch-workspace": "navigation",
  recommend: "analysis",
  explain: "analysis",
  prioritize: "analysis",
  "explore-scenario": "simulation",
  "define-scenario": "simulation",
  "compare-scenarios": "analysis",
  "explain-scenario": "analysis",
  "modify-scenario": "simulation",
  "select-scenario-reference": "navigation",
  "commit-decision": "analysis",
  "prefer-option": "analysis",
  "reject-decision": "analysis",
  "defer-decision": "analysis",
  "reconsider-decision": "analysis",
  "confirm-decision-commitment": "analysis",
  "cancel-decision-commitment": "analysis",
  unknown: "unknown",
});

/** Reason codes used by the resolver (stable, machine-readable). */
export const CONVERSATIONAL_INTENT_REASON = Object.freeze({
  NORMALIZED: "normalized-utterance",
  MATCHED_GREETING: "matched-professional-greeting-pattern",
  MATCHED_HELP: "matched-conversational-help-pattern",
  MATCHED_SITUATION: "matched-situation-question-pattern",
  MATCHED_EVIDENCE: "matched-evidence-question-pattern",
  MATCHED_CHANGE: "matched-change-question-pattern",
  MATCHED_RISK: "matched-risk-question-pattern",
  MATCHED_DECISION_STATUS: "matched-decision-status-question-pattern",
  MATCHED_EXECUTION_STATUS: "matched-execution-status-question-pattern",
  MATCHED_FOCUS: "matched-focus-pattern",
  MATCHED_OPEN_SHOW_TARGET: "matched-open-or-show-target-pattern",
  MATCHED_OVERVIEW: "matched-overview-pattern",
  MATCHED_RELATED: "matched-show-related-pattern",
  MATCHED_PROBLEMS: "matched-show-problems-pattern",
  MATCHED_GOALS: "matched-show-goals-pattern",
  MATCHED_SCENARIOS: "matched-show-scenarios-pattern",
  MATCHED_DECISIONS: "matched-show-decisions-pattern",
  MATCHED_EXECUTION: "matched-show-execution-pattern",
  MATCHED_COMPARE: "matched-compare-pattern",
  MATCHED_ANALYZE: "matched-analyze-pattern",
  MATCHED_SIMULATE: "matched-simulate-pattern",
  MATCHED_NAVIGATE_BACK: "matched-navigate-back-pattern",
  MATCHED_NAVIGATE_FORWARD: "matched-navigate-forward-pattern",
  MATCHED_PREPARE_CONTEXT: "matched-prepare-context-pattern",
  MATCHED_SWITCH_WORKSPACE: "matched-switch-workspace-pattern",
  MATCHED_ORDINAL_REFERENCE: "matched-ordinal-reference-pattern",
  MATCHED_RECOMMEND: "matched-recommend-pattern",
  MATCHED_EXPLAIN: "matched-explain-pattern",
  MATCHED_PRIORITIZE: "matched-prioritize-pattern",
  MATCHED_EXPLORE_SCENARIO: "matched-explore-scenario-pattern",
  MATCHED_MODIFY_SCENARIO: "matched-modify-scenario-pattern",
  MATCHED_COMPARE_SCENARIOS: "matched-compare-scenarios-pattern",
  MATCHED_EXPLAIN_SCENARIO: "matched-explain-scenario-pattern",
  MATCHED_SELECT_SCENARIO: "matched-select-scenario-pattern",
  MATCHED_COMMIT_DECISION: "matched-commit-decision-pattern",
  MATCHED_PREFER_OPTION: "matched-prefer-option-pattern",
  MATCHED_REJECT_DECISION: "matched-reject-decision-pattern",
  MATCHED_DEFER_DECISION: "matched-defer-decision-pattern",
  MATCHED_RECONSIDER_DECISION: "matched-reconsider-decision-pattern",
  MATCHED_CONFIRM_DECISION: "matched-confirm-decision-pattern",
  MATCHED_CANCEL_DECISION: "matched-cancel-decision-pattern",
  MATCHED_RELATION_SCOPED: "matched-relation-scoped-collection-pattern",
  AMBIGUOUS_REFERENCE: "ambiguous-reference-requires-context",
  TARGET_HINT_EXTRACTED: "target-hint-extracted-lexical-only",
  EXPERIENCE_HINT_EXTRACTED: "experience-hint-extracted-lexical-only",
  TARGET_REQUIRED: "target-required-not-resolved-to-object-id",
  NO_CANONICAL_OBJECT_ID: "does-not-resolve-canonical-object-id",
  UNKNOWN_UTTERANCE: "unknown-utterance-no-safe-mapping",
  DETERMINISTIC: "deterministic-rule-resolution",
} as const);

export type ConversationalIntentReasonCode =
  (typeof CONVERSATIONAL_INTENT_REASON)[keyof typeof CONVERSATIONAL_INTENT_REASON];
