/**
 * CC:3 — Command & Action Mapping contracts.
 *
 * Maps CC:1 Intent + CC:2 Resolved Context → Canonical Nexora Command.
 * Mapper only — does not execute, mutate Runtime/Stage, or invoke Director.
 *
 * Pipeline boundary:
 *   Intent + Context → Command Mapping → Canonical Command → STOP
 *
 * Vocabulary note:
 * - focus-subject / navigate-back align with DRI focus-target / navigate-back
 * - open-overview aligns with clear-focus / overview reset semantics
 * - reveal-* / compare / analyze / simulate are conversational executive commands
 *   that CC:4 may later bridge onto the same Runtime authority as click interaction
 */

import type { NexoraConversationalExecutionClass } from "./conversationalIntent.ts";
import type {
  NexoraConversationalSubjectKind,
  NexoraResolvedConversationalContext,
} from "./conversationalContext.ts";
import type { NexoraConversationalIntent } from "./conversationalIntent.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const conversationalCommandMappingIdentity =
  "CC:3/CommandAndActionMapping" as const;

export const conversationalCommandMappingVersion = "1.0.0" as const;

export const conversationalCommandMappingNamespace =
  "nexora.conversational-control.command-and-action-mapping" as const;

export const conversationalCommandMappingPhase =
  "CommandAndActionMapping" as const;

export const conversationalCommandMappingArchitecturalRole =
  "ConversationalCommandMapperAuthority" as const;

export type ConversationalCommandMappingIdentity = {
  readonly id: typeof conversationalCommandMappingIdentity;
  readonly version: typeof conversationalCommandMappingVersion;
  readonly namespace: typeof conversationalCommandMappingNamespace;
  readonly phase: typeof conversationalCommandMappingPhase;
  readonly architecturalRole: typeof conversationalCommandMappingArchitecturalRole;
};

const IDENTITY: ConversationalCommandMappingIdentity = Object.freeze({
  id: conversationalCommandMappingIdentity,
  version: conversationalCommandMappingVersion,
  namespace: conversationalCommandMappingNamespace,
  phase: conversationalCommandMappingPhase,
  architecturalRole: conversationalCommandMappingArchitecturalRole,
});

export function getConversationalCommandMappingIdentity(): ConversationalCommandMappingIdentity {
  return IDENTITY;
}

/** Hard architectural boundary for CC:3. */
export const CONVERSATIONAL_COMMAND_BOUNDARY = Object.freeze({
  architecturalRole: conversationalCommandMappingArchitecturalRole,
  executesCommand: false as const,
  mutatesRuntime: false as const,
  mutatesStage: false as const,
  mutatesDirector: false as const,
  invokesDirector: false as const,
  resolvesCanonicalObjectIds: false as const,
  parsesRawLanguage: false as const,
  expandsIntoUiStageEffects: false as const,
  manipulatesNavigationTrail: false as const,
  queriesRelationships: false as const,
  usesLlmOrExternalProvider: false as const,
  phaseStopsAtCanonicalCommand: true as const,
});

// ─── Command kinds ──────────────────────────────────────────────────────────
// Aligned with DRI where possible; reveal/compare/analyze/simulate are CC semantic.

export const NEXORA_CONVERSATIONAL_COMMAND_KINDS = Object.freeze([
  "focus-subject",
  "open-overview",
  "reveal-related",
  "reveal-problems",
  "reveal-goals",
  "reveal-scenarios",
  "reveal-decisions",
  "reveal-execution",
  "explore-subject",
  "compare-subjects",
  "analyze-subject",
  "simulate-scenario",
  "navigate-back",
  "navigate-forward",
  "prepare-executive-context",
  "switch-workspace",
  "request-recommendation",
  "request-explanation",
  "request-prioritization",
  "unsupported",
] as const);

export type NexoraConversationalCommandKind =
  (typeof NEXORA_CONVERSATIONAL_COMMAND_KINDS)[number];

export const NEXORA_COMMAND_MAPPING_STATUSES = Object.freeze([
  "mapped",
  "missing-target",
  "ambiguous-context",
  "unsupported-intent",
  "invalid-context",
  "confirmation-required",
] as const);

export type NexoraCommandMappingStatus =
  (typeof NEXORA_COMMAND_MAPPING_STATUSES)[number];

/**
 * Canonical conversational command.
 * Command ≠ Runtime Action. CC:3 never expands into Stage UI effect sequences.
 */
export type NexoraConversationalCommand = {
  readonly commandId: string;
  readonly kind: NexoraConversationalCommandKind;
  readonly source: "conversation";
  readonly executionClass: Exclude<
    NexoraConversationalExecutionClass,
    "unknown"
  >;
  readonly primaryTargetId: string | null;
  readonly secondaryTargetIds: readonly string[];
  /** Future mutating commands may require confirmation; current set is false. */
  readonly requiresConfirmation: boolean;
  /**
   * Structurally valid for a future executor (CC:4+).
   * Does NOT mean CC:3 executed anything.
   */
  readonly executable: boolean;
  readonly reasons: readonly string[];
};

export type NexoraConversationalCommandTrace = {
  readonly intentKind: string;
  readonly contextStatus: string;
  readonly primarySubjectId: string | null;
  readonly secondarySubjectIds: readonly string[];
  readonly primarySubjectKind: NexoraConversationalSubjectKind | null;
  readonly mappingRule: string | null;
  readonly compatibilityPassed: boolean;
  readonly commandKind: NexoraConversationalCommandKind | null;
  readonly mappingStatus: NexoraCommandMappingStatus;
  readonly reasons: readonly string[];
};

export type NexoraConversationalCommandMappingResult = {
  readonly command: NexoraConversationalCommand | null;
  readonly status: NexoraCommandMappingStatus;
  readonly trace: NexoraConversationalCommandTrace;
};

export type NexoraConversationalCommandMappingInput = {
  readonly intent: NexoraConversationalIntent;
  readonly context: NexoraResolvedConversationalContext;
  /**
   * Optional CC:6 experience resolution. When present for prepare/switch intents,
   * command targets come from registered experience context (workspace id).
   */
  readonly experienceResolution?: {
    readonly decision: string;
    readonly workspaceId: string | null;
    readonly experienceId: string | null;
    readonly entrySubjectId: string | null;
  } | null;
};

export const CONVERSATIONAL_COMMAND_REASON = Object.freeze({
  MAPPED_FOCUS: "mapped-focus-command",
  MAPPED_OVERVIEW: "mapped-overview-command",
  MAPPED_RELATION: "mapped-relation-command",
  MAPPED_COMPARISON: "mapped-comparison-command",
  MAPPED_ANALYSIS: "mapped-analysis-command",
  MAPPED_SIMULATION: "mapped-simulation-command",
  MAPPED_EXPLORATION: "mapped-exploration-command",
  MAPPED_NAVIGATION: "mapped-navigation-command",
  MAPPED_EXPERIENCE: "mapped-executive-experience-command",
  MAPPED_RECOMMENDATION: "mapped-recommendation-command",
  MISSING_PRIMARY_TARGET: "missing-primary-target",
  MISSING_SECONDARY_TARGET: "missing-secondary-target",
  AMBIGUOUS_CONTEXT_BLOCKED: "ambiguous-context-blocked",
  NOT_FOUND_CONTEXT_BLOCKED: "not-found-context-blocked",
  MISSING_CONTEXT_BLOCKED: "missing-context-blocked",
  SUBJECT_KIND_INCOMPATIBLE: "subject-kind-incompatible",
  UNSUPPORTED_INTENT: "unsupported-intent",
  EXPERIENCE_TARGET_REQUIRED: "experience-workspace-target-required",
  ORDER_PRESERVED: "multi-target-order-preserved",
  CONFIRMATION_NOT_REQUIRED: "confirmation-not-required-for-read-navigation",
  EXECUTABLE_NOT_EXECUTED: "executable-means-structurally-valid-not-executed",
  NO_RAW_LANGUAGE_PARSE: "did-not-parse-raw-language",
  NO_ID_RESOLUTION: "did-not-resolve-canonical-ids",
  DETERMINISTIC: "deterministic-command-mapping",
} as const);

export type ConversationalCommandReasonCode =
  (typeof CONVERSATIONAL_COMMAND_REASON)[keyof typeof CONVERSATIONAL_COMMAND_REASON];
