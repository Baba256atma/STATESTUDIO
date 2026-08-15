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
    | "ordinal";
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
  unknown: "unknown",
});

/** Reason codes used by the resolver (stable, machine-readable). */
export const CONVERSATIONAL_INTENT_REASON = Object.freeze({
  NORMALIZED: "normalized-utterance",
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
