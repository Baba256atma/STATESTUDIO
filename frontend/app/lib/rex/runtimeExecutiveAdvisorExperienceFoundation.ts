/**
 * REX-3:1 — Runtime Executive Advisor Experience Foundation.
 *
 * Establishes renderer-neutral, AI-provider-neutral foundation semantics for
 * the Executive Advisor as an Executive Guidance Surface:
 * subjects, context, engagement, guidance intent, attention, presentation,
 * density, confidence, urgency, provenance, Stage relationship, action
 * affordances, snapshots, readiness predicates, validation, and registry.
 *
 * Canonical flow:
 *   REX-2:9 Public Index → REX-3:1 Runtime Executive Advisor Experience Foundation
 *
 * Foundation only. No LLM, chat, UI, Stage mutation, orchestration,
 * recommendation ranking, or action execution.
 *
 * REX-2 answers: What is happening on the Executive Stage?
 * REX-3 answers: What should the Executive Advisor understand about it?
 * REX-3:1 stops at the Guidance-ready State boundary.
 */

import {
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_ATTENTION_LEVELS,
  runtimeExecutiveStageExperiencePublicIndexIdentity,
  runtimeExecutiveStageExperiencePublicIndexSupportedImportPath,
  runtimeExecutiveStageExperiencePublicIndexVersion,
  verifyRuntimeExecutiveStageExperienceConsumerEntry,
} from "@/app/lib/rex/runtimeExecutiveStageExperiencePublicIndex";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorExperienceFoundationIdentity =
  "REX-3:1/RuntimeExecutiveAdvisorExperienceFoundation" as const;

export const runtimeExecutiveAdvisorExperienceFoundationVersion =
  "3.1.0" as const;

export const runtimeExecutiveAdvisorExperienceFoundationNamespace =
  "nexora.rex.advisor-experience.foundation" as const;

export const runtimeExecutiveAdvisorExperienceFoundationLayer =
  "RuntimeExecutiveExperience" as const;

export const runtimeExecutiveAdvisorExperienceFoundationDomain =
  "ExecutiveAdvisor" as const;

export const runtimeExecutiveAdvisorExperienceFoundationPhase =
  "Foundation" as const;

export const runtimeExecutiveAdvisorExperienceFoundationArchitecturalRole =
  "RuntimeExecutiveAdvisorExperienceFoundationBoundary" as const;

export const runtimeExecutiveAdvisorExperienceFoundationDependencyIdentity =
  runtimeExecutiveStageExperiencePublicIndexIdentity;

export const runtimeExecutiveAdvisorExperienceFoundationDependencyPath =
  runtimeExecutiveStageExperiencePublicIndexSupportedImportPath;

/** Sole supported import path for REX-3 consumers of this foundation. */
export const runtimeExecutiveAdvisorExperienceFoundationSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveAdvisorExperienceFoundation" as const;

export const runtimeExecutiveAdvisorExperienceFoundationStability =
  "FoundationReady" as const;

export const runtimeExecutiveAdvisorExperienceFoundationDeterministic =
  true as const;

export const runtimeExecutiveAdvisorExperienceFoundationSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveAdvisorExperienceFoundationMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveAdvisorExperienceFoundationCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveAdvisorExperienceFoundationIdentity,
    version: runtimeExecutiveAdvisorExperienceFoundationVersion,
    namespace: runtimeExecutiveAdvisorExperienceFoundationNamespace,
    layer: runtimeExecutiveAdvisorExperienceFoundationLayer,
    domain: runtimeExecutiveAdvisorExperienceFoundationDomain,
    phase: runtimeExecutiveAdvisorExperienceFoundationPhase,
    architecturalRole:
      runtimeExecutiveAdvisorExperienceFoundationArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveAdvisorExperienceFoundationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveAdvisorExperienceFoundationDependencyPath,
    supportedImportPath:
      runtimeExecutiveAdvisorExperienceFoundationSupportedImportPath,
    upstreamVersion: runtimeExecutiveStageExperiencePublicIndexVersion,
    stabilityStatus:
      runtimeExecutiveAdvisorExperienceFoundationStability,
    deterministicStatus:
      runtimeExecutiveAdvisorExperienceFoundationDeterministic,
    sideEffectPolicy:
      runtimeExecutiveAdvisorExperienceFoundationSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveAdvisorExperienceFoundationMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_PRINCIPLE =
  "The Executive Advisor is an Executive Guidance Surface — runtime context → executive subject → advisor context → guidance-ready state — not a chatbot, and not a second Director." as const;

export const RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  advisorAuthority: "REX-3:1" as const,
  architecturalRole:
    "RuntimeExecutiveAdvisorExperienceFoundationBoundary" as const,
  soleImmediateDependency:
    "REX-2:9/RuntimeExecutiveStageExperiencePublicIndex" as const,
  consumesPublicIndexOnly: true as const,
  importsRex2InternalDirectly: false as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  introducesRendering: false as const,
  introducesOrchestration: false as const,
  introducesLlmGeneration: false as const,
  introducesChatBehavior: false as const,
  introducesActionExecution: false as const,
  mutatesStageState: false as const,
  ownsStageExperience: false as const,
  encodesRendererStyling: false as const,
});

export const RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_RELATIONSHIP_CHAIN =
  Object.freeze([
    "Runtime Context",
    "Executive Subject",
    "Advisor Context",
    "Guidance-ready State",
    "Later REX-3 orchestration",
    "Advisor Presentation / Actions",
  ] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_RESPONSIBILITY_SEPARATION =
  Object.freeze({
    rex2Owns: "What is happening on the Executive Stage?" as const,
    rex3Owns:
      "What should the Executive Advisor understand about what is happening?" as const,
    laterRex3Owns: "What guidance should be presented?" as const,
    advisorIsNotSecondDirector: true as const,
    stageMutationRequiresApprovedBoundaries: true as const,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

/**
 * Advisor subject kinds — what executive matter the Advisor reasons about.
 * KOI = Key Output Index. KPI = Key Performance Indicator.
 * Do not introduce KOR. Additive extension must not redefine existing kinds.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_SUBJECT_KINDS = Object.freeze([
  "workspace",
  "goal",
  "nexora-object",
  "kpi",
  "koi",
  "problem",
  "scenario",
  "decision",
  "execution",
  "pack",
  "connection",
  "scene",
] as const);

export type RuntimeExecutiveAdvisorSubjectKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_SUBJECT_KINDS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_SUBJECT_KIND_SEMANTICS = Object.freeze({
  kpi: "Key Performance Indicator" as const,
  koi: "Key Output Index" as const,
  usesOnlyCanonicalIndexTerminology: true as const,
  introducesKor: false as const,
});

export const RUNTIME_EXECUTIVE_ADVISOR_ENGAGEMENT_STATES = Object.freeze([
  "idle",
  "aware",
  "engaged",
  "guiding",
] as const);

export type RuntimeExecutiveAdvisorEngagementState =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_ENGAGEMENT_STATES)[number];

/**
 * Guidance intents describe executive purpose of the Advisor context.
 * They are NOT commands and MUST NOT execute anything.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_INTENTS = Object.freeze([
  "observe",
  "explain",
  "inspect",
  "compare",
  "investigate",
  "evaluate",
  "recommend",
  "decide",
  "act",
] as const);

export type RuntimeExecutiveAdvisorGuidanceIntent =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_INTENTS)[number];

/**
 * Advisor attention — executive relevance strength only.
 * Compatible with REX-2 elevated/critical semantics; does not encode color.
 * ambient/normal are Advisor-surface refinements of background/standard relevance.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_ATTENTION_LEVELS = Object.freeze([
  "ambient",
  "normal",
  "elevated",
  "critical",
] as const);

export type RuntimeExecutiveAdvisorAttentionLevel =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_ATTENTION_LEVELS)[number];

/**
 * Canonical Nexora presentation states — reused exactly from REX-2:9 frozen surface.
 * minimum = concise executive signal; report = structured explanation;
 * operation = guidance/action-oriented state.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_PRESENTATION_STATES;

export type RuntimeExecutiveAdvisorPresentationState =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_STATES)[number];

/**
 * Information density is independent of presentation state.
 * report+compact and report+expanded are both valid.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_INFORMATION_DENSITIES = Object.freeze([
  "compact",
  "balanced",
  "expanded",
] as const);

export type RuntimeExecutiveAdvisorInformationDensity =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_INFORMATION_DENSITIES)[number];

/**
 * Confidence in available runtime context/provenance — not an LLM probability.
 * No numeric confidence scores.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_CONFIDENCE_LEVELS = Object.freeze([
  "unknown",
  "low",
  "medium",
  "high",
] as const);

export type RuntimeExecutiveAdvisorConfidence =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_CONFIDENCE_LEVELS)[number];

/**
 * Urgency is independent of attention.
 * elevated attention + low urgency is valid for long-term strategic matters.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_URGENCY_LEVELS = Object.freeze([
  "none",
  "low",
  "medium",
  "high",
  "immediate",
] as const);

export type RuntimeExecutiveAdvisorUrgency =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_URGENCY_LEVELS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_PROVENANCE_KINDS = Object.freeze([
  "runtime-context",
  "stage-focus",
  "stage-selection",
  "scene",
  "interaction",
  "attention",
  "presentation-state",
  "explicit-manager-intent",
] as const);

export type RuntimeExecutiveAdvisorProvenanceKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_PROVENANCE_KINDS)[number];

/**
 * How the Advisor subject relates to the current Stage.
 * REX-3 observes Stage; it does not own it.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_STAGE_RELATIONSHIPS = Object.freeze([
  "none",
  "observing",
  "focused-subject",
  "selected-subject",
  "related-subject",
] as const);

export type RuntimeExecutiveAdvisorStageRelationship =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_STAGE_RELATIONSHIPS)[number];

/**
 * Action affordance kinds — actions that may later be offered.
 * An affordance is NOT an executed action. No handlers or side effects.
 */
export const RUNTIME_EXECUTIVE_ADVISOR_ACTION_KINDS = Object.freeze([
  "inspect",
  "focus",
  "explain",
  "compare",
  "trace",
  "open-scenario",
  "open-decision",
  "open-execution",
  "show-related",
  "dismiss",
] as const);

export type RuntimeExecutiveAdvisorActionKind =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_ACTION_KINDS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_CAPABILITIES = Object.freeze([
  "advisor-subject-modeling",
  "advisor-context-modeling",
  "advisor-engagement-modeling",
  "guidance-intent-modeling",
  "advisor-attention-modeling",
  "advisor-presentation-modeling",
  "advisor-density-modeling",
  "advisor-confidence-modeling",
  "advisor-urgency-modeling",
  "advisor-provenance-modeling",
  "stage-relationship-modeling",
  "action-affordance-modeling",
  "guidance-readiness",
  "contextual-awareness",
  "foundation-validation",
] as const);

export type RuntimeExecutiveAdvisorFoundationCapability =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_CAPABILITIES)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface RuntimeExecutiveAdvisorSubject {
  readonly id: string;
  readonly kind: RuntimeExecutiveAdvisorSubjectKind;
  readonly label: string;
  readonly sourceId?: string;
  readonly parentId?: string;
}

export interface RuntimeExecutiveAdvisorProvenance {
  readonly kind: RuntimeExecutiveAdvisorProvenanceKind;
  readonly sourceId?: string;
  readonly reason?: string;
}

export interface RuntimeExecutiveAdvisorActionAffordance {
  readonly id: string;
  readonly kind: RuntimeExecutiveAdvisorActionKind;
  readonly label: string;
  readonly subjectId?: string;
  readonly enabled: boolean;
}

export interface RuntimeExecutiveAdvisorContext {
  readonly subject: RuntimeExecutiveAdvisorSubject | null;
  readonly engagement: RuntimeExecutiveAdvisorEngagementState;
  readonly intent: RuntimeExecutiveAdvisorGuidanceIntent;
  readonly attention: RuntimeExecutiveAdvisorAttentionLevel;
  readonly presentationState: RuntimeExecutiveAdvisorPresentationState;
  readonly informationDensity: RuntimeExecutiveAdvisorInformationDensity;
  readonly confidence: RuntimeExecutiveAdvisorConfidence;
  readonly urgency: RuntimeExecutiveAdvisorUrgency;
  readonly stageRelationship: RuntimeExecutiveAdvisorStageRelationship;
  readonly provenance: ReadonlyArray<RuntimeExecutiveAdvisorProvenance>;
  readonly actionAffordances: ReadonlyArray<RuntimeExecutiveAdvisorActionAffordance>;
}

export interface RuntimeExecutiveAdvisorSnapshot {
  readonly context: RuntimeExecutiveAdvisorContext;
  readonly activeSubjectId: string | null;
  readonly isContextual: boolean;
  readonly isGuidanceReady: boolean;
  readonly foundationIdentity: typeof runtimeExecutiveAdvisorExperienceFoundationIdentity;
  readonly foundationVersion: typeof runtimeExecutiveAdvisorExperienceFoundationVersion;
}

export interface RuntimeExecutiveAdvisorFoundationIssue {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export interface RuntimeExecutiveAdvisorFoundationValidationResult {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<RuntimeExecutiveAdvisorFoundationIssue>;
}

// ─── Invariants / forbidden ─────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "advisor-is-guidance-surface",
    order: 1,
    statement:
      "The Executive Advisor is modeled as an Executive Guidance Surface, not a chatbot.",
  }),
  Object.freeze({
    id: "stable-subject-identifier",
    order: 2,
    statement: "Every Advisor subject has a stable non-empty identifier.",
  }),
  Object.freeze({
    id: "canonical-subject-kinds",
    order: 3,
    statement: "Subject kind is one of the approved Advisor subject kinds.",
  }),
  Object.freeze({
    id: "no-kor-terminology",
    order: 4,
    statement: "KOR terminology is not part of the Advisor foundation.",
  }),
  Object.freeze({
    id: "engagement-not-generation",
    order: 5,
    statement:
      "Engagement state guiding does not itself generate guidance or advice text.",
  }),
  Object.freeze({
    id: "intent-not-command",
    order: 6,
    statement: "Guidance intent describes purpose and does not execute actions.",
  }),
  Object.freeze({
    id: "attention-not-styling",
    order: 7,
    statement: "Advisor attention does not encode renderer color or styling.",
  }),
  Object.freeze({
    id: "canonical-presentation-states",
    order: 8,
    statement:
      "Presentation state reuses the approved minimum / report / operation model.",
  }),
  Object.freeze({
    id: "density-independent-of-presentation",
    order: 9,
    statement:
      "Information density and presentation state are independent concepts.",
  }),
  Object.freeze({
    id: "confidence-not-llm-probability",
    order: 10,
    statement:
      "Confidence reflects runtime context/provenance, not LLM probability.",
  }),
  Object.freeze({
    id: "urgency-independent-of-attention",
    order: 11,
    statement: "Urgency and attention are independent dimensions.",
  }),
  Object.freeze({
    id: "affordance-not-execution",
    order: 12,
    statement:
      "Action affordances represent offerable actions, not executed actions.",
  }),
  Object.freeze({
    id: "unique-action-affordance-ids",
    order: 13,
    statement: "Action affordance identifiers within a context are unique.",
  }),
  Object.freeze({
    id: "advisor-observes-stage",
    order: 14,
    statement:
      "REX-3 observes Stage experience through REX-2:9 and does not own Stage mutation.",
  }),
  Object.freeze({
    id: "no-caller-input-mutation",
    order: 15,
    statement: "Foundation APIs do not mutate caller input.",
  }),
  Object.freeze({
    id: "deterministic-foundation",
    order: 16,
    statement:
      "Equivalent foundation input produces equivalent foundation output.",
  }),
] as const);

export type RuntimeExecutiveAdvisorFoundationInvariant =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "LLM calls",
    "prompt engineering",
    "natural-language response generation",
    "Advisor chat",
    "message history",
    "conversation persistence",
    "recommendation algorithms",
    "scenario generation",
    "decision generation",
    "execution commands",
    "Stage mutation",
    "focus mutation",
    "selection mutation",
    "scene orchestration",
    "action execution",
    "UI components",
    "React hooks",
    "Zustand/Redux stores",
    "animation",
    "API routes",
    "persistence",
    "telemetry",
    "renderer behavior",
    "Director computation",
  ] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "SubjectKinds",
    "EngagementStates",
    "GuidanceIntents",
    "AttentionLevels",
    "PresentationStates",
    "InformationDensities",
    "ConfidenceLevels",
    "UrgencyLevels",
    "ProvenanceKinds",
    "StageRelationships",
    "ActionKinds",
    "Capabilities",
  ] as const);

export type RuntimeExecutiveAdvisorFoundationRegistrySection =
  (typeof RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_REGISTRY_SECTIONS)[number];

// ─── Helpers ────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function exactOrder<T extends string>(
  actual: readonly T[],
  expected: readonly T[],
): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function issue(
  code: string,
  message: string,
  path?: string,
): RuntimeExecutiveAdvisorFoundationIssue {
  return Object.freeze(
    path === undefined ? { code, message } : { code, message, path },
  );
}

// ─── Predicates (vocabulary) ────────────────────────────────────────────────

export function isRuntimeExecutiveAdvisorSubjectKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorSubjectKind {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_SUBJECT_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorEngagementState(
  value: unknown,
): value is RuntimeExecutiveAdvisorEngagementState {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_ENGAGEMENT_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorGuidanceIntent(
  value: unknown,
): value is RuntimeExecutiveAdvisorGuidanceIntent {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_INTENTS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorAttentionLevel(
  value: unknown,
): value is RuntimeExecutiveAdvisorAttentionLevel {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_ATTENTION_LEVELS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorPresentationState(
  value: unknown,
): value is RuntimeExecutiveAdvisorPresentationState {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_STATES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorInformationDensity(
  value: unknown,
): value is RuntimeExecutiveAdvisorInformationDensity {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_INFORMATION_DENSITIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorConfidence(
  value: unknown,
): value is RuntimeExecutiveAdvisorConfidence {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_CONFIDENCE_LEVELS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorUrgency(
  value: unknown,
): value is RuntimeExecutiveAdvisorUrgency {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_URGENCY_LEVELS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorProvenanceKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorProvenanceKind {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_PROVENANCE_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorStageRelationship(
  value: unknown,
): value is RuntimeExecutiveAdvisorStageRelationship {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_STAGE_RELATIONSHIPS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorActionKind(
  value: unknown,
): value is RuntimeExecutiveAdvisorActionKind {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_ACTION_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveAdvisorFoundationCapability(
  value: unknown,
): value is RuntimeExecutiveAdvisorFoundationCapability {
  return (
    RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_CAPABILITIES as readonly unknown[]
  ).includes(value);
}

/**
 * Maps a REX-2 Stage attention level onto Advisor attention without inventing
 * executive facts beyond the compatible overlap (elevated / critical).
 */
export function mapRuntimeExecutiveStageAttentionToAdvisorAttention(
  stageAttention: (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_PLATFORM_ATTENTION_LEVELS)[number],
): RuntimeExecutiveAdvisorAttentionLevel {
  switch (stageAttention) {
    case "critical":
      return "critical";
    case "elevated":
    case "warning":
      return "elevated";
    case "informational":
      return "normal";
    case "normal":
    default:
      return "ambient";
  }
}

// ─── Empty / default foundation state ───────────────────────────────────────

export const RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT: RuntimeExecutiveAdvisorContext =
  Object.freeze({
    subject: null,
    engagement: "idle",
    intent: "observe",
    attention: "ambient",
    presentationState: "minimum",
    informationDensity: "compact",
    confidence: "unknown",
    urgency: "none",
    stageRelationship: "none",
    provenance: Object.freeze(
      [] as RuntimeExecutiveAdvisorProvenance[],
    ),
    actionAffordances: Object.freeze(
      [] as RuntimeExecutiveAdvisorActionAffordance[],
    ),
  });

export function createRuntimeExecutiveAdvisorEmptyContext(): RuntimeExecutiveAdvisorContext {
  return RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT;
}

// ─── Normalization ──────────────────────────────────────────────────────────

export function normalizeRuntimeExecutiveAdvisorSubject(
  input: RuntimeExecutiveAdvisorSubject,
): RuntimeExecutiveAdvisorSubject {
  if (!isNonEmptyString(input.id)) {
    throw new TypeError("id must be a non-empty string");
  }
  if (!isRuntimeExecutiveAdvisorSubjectKind(input.kind)) {
    throw new TypeError("kind must be a known Advisor subject kind");
  }
  if (typeof input.label !== "string") {
    throw new TypeError("label must be a string");
  }
  if (input.sourceId !== undefined && !isNonEmptyString(input.sourceId)) {
    throw new TypeError("sourceId must be a non-empty string when provided");
  }
  if (input.parentId !== undefined && !isNonEmptyString(input.parentId)) {
    throw new TypeError("parentId must be a non-empty string when provided");
  }

  return Object.freeze({
    id: input.id,
    kind: input.kind,
    label: input.label,
    ...(input.sourceId !== undefined ? { sourceId: input.sourceId } : {}),
    ...(input.parentId !== undefined ? { parentId: input.parentId } : {}),
  });
}

export function normalizeRuntimeExecutiveAdvisorProvenance(
  input: RuntimeExecutiveAdvisorProvenance,
): RuntimeExecutiveAdvisorProvenance {
  if (!isRuntimeExecutiveAdvisorProvenanceKind(input.kind)) {
    throw new TypeError("kind must be a known Advisor provenance kind");
  }
  if (input.sourceId !== undefined && !isNonEmptyString(input.sourceId)) {
    throw new TypeError("sourceId must be a non-empty string when provided");
  }
  if (input.reason !== undefined && typeof input.reason !== "string") {
    throw new TypeError("reason must be a string when provided");
  }

  return Object.freeze({
    kind: input.kind,
    ...(input.sourceId !== undefined ? { sourceId: input.sourceId } : {}),
    ...(input.reason !== undefined ? { reason: input.reason } : {}),
  });
}

export function normalizeRuntimeExecutiveAdvisorActionAffordances(
  input: ReadonlyArray<RuntimeExecutiveAdvisorActionAffordance>,
): ReadonlyArray<RuntimeExecutiveAdvisorActionAffordance> {
  if (!Array.isArray(input)) {
    throw new TypeError("actionAffordances must be a readonly array");
  }

  const normalized = input.map((affordance, index) => {
    if (!isNonEmptyString(affordance.id)) {
      throw new TypeError(
        `actionAffordances[${index}].id must be a non-empty string`,
      );
    }
    if (!isRuntimeExecutiveAdvisorActionKind(affordance.kind)) {
      throw new TypeError(
        `actionAffordances[${index}].kind must be a known Advisor action kind`,
      );
    }
    if (typeof affordance.label !== "string") {
      throw new TypeError(
        `actionAffordances[${index}].label must be a string`,
      );
    }
    if (typeof affordance.enabled !== "boolean") {
      throw new TypeError(
        `actionAffordances[${index}].enabled must be a boolean`,
      );
    }
    if (
      affordance.subjectId !== undefined &&
      !isNonEmptyString(affordance.subjectId)
    ) {
      throw new TypeError(
        `actionAffordances[${index}].subjectId must be a non-empty string when provided`,
      );
    }
    return Object.freeze({
      id: affordance.id,
      kind: affordance.kind,
      label: affordance.label,
      enabled: affordance.enabled,
      ...(affordance.subjectId !== undefined
        ? { subjectId: affordance.subjectId }
        : {}),
    });
  });

  const ids = normalized.map((affordance) => affordance.id);
  if (!unique(ids)) {
    throw new TypeError("action affordance identifiers must be unique");
  }

  return Object.freeze(normalized);
}

export function normalizeRuntimeExecutiveAdvisorContext(
  input: RuntimeExecutiveAdvisorContext,
): RuntimeExecutiveAdvisorContext {
  const subject =
    input.subject === null
      ? null
      : normalizeRuntimeExecutiveAdvisorSubject(input.subject);

  if (!isRuntimeExecutiveAdvisorEngagementState(input.engagement)) {
    throw new TypeError("engagement must be a known Advisor engagement state");
  }
  if (!isRuntimeExecutiveAdvisorGuidanceIntent(input.intent)) {
    throw new TypeError("intent must be a known Advisor guidance intent");
  }
  if (!isRuntimeExecutiveAdvisorAttentionLevel(input.attention)) {
    throw new TypeError("attention must be a known Advisor attention level");
  }
  if (!isRuntimeExecutiveAdvisorPresentationState(input.presentationState)) {
    throw new TypeError(
      "presentationState must be minimum, report, or operation",
    );
  }
  if (!isRuntimeExecutiveAdvisorInformationDensity(input.informationDensity)) {
    throw new TypeError(
      "informationDensity must be compact, balanced, or expanded",
    );
  }
  if (!isRuntimeExecutiveAdvisorConfidence(input.confidence)) {
    throw new TypeError("confidence must be a known Advisor confidence level");
  }
  if (!isRuntimeExecutiveAdvisorUrgency(input.urgency)) {
    throw new TypeError("urgency must be a known Advisor urgency level");
  }
  if (!isRuntimeExecutiveAdvisorStageRelationship(input.stageRelationship)) {
    throw new TypeError(
      "stageRelationship must be a known Advisor Stage relationship",
    );
  }
  if (!Array.isArray(input.provenance)) {
    throw new TypeError("provenance must be a readonly array");
  }

  const provenance = Object.freeze(
    input.provenance.map((entry) =>
      normalizeRuntimeExecutiveAdvisorProvenance(entry),
    ),
  );
  const actionAffordances = normalizeRuntimeExecutiveAdvisorActionAffordances(
    input.actionAffordances,
  );

  return Object.freeze({
    subject,
    engagement: input.engagement,
    intent: input.intent,
    attention: input.attention,
    presentationState: input.presentationState,
    informationDensity: input.informationDensity,
    confidence: input.confidence,
    urgency: input.urgency,
    stageRelationship: input.stageRelationship,
    provenance,
    actionAffordances,
  });
}

// ─── Constructors ───────────────────────────────────────────────────────────

export function createRuntimeExecutiveAdvisorSubject(input: {
  readonly id: string;
  readonly kind: RuntimeExecutiveAdvisorSubjectKind;
  readonly label: string;
  readonly sourceId?: string;
  readonly parentId?: string;
}): RuntimeExecutiveAdvisorSubject {
  return normalizeRuntimeExecutiveAdvisorSubject({
    id: input.id,
    kind: input.kind,
    label: input.label,
    ...(input.sourceId !== undefined ? { sourceId: input.sourceId } : {}),
    ...(input.parentId !== undefined ? { parentId: input.parentId } : {}),
  });
}

export function createRuntimeExecutiveAdvisorProvenance(input: {
  readonly kind: RuntimeExecutiveAdvisorProvenanceKind;
  readonly sourceId?: string;
  readonly reason?: string;
}): RuntimeExecutiveAdvisorProvenance {
  return normalizeRuntimeExecutiveAdvisorProvenance({
    kind: input.kind,
    ...(input.sourceId !== undefined ? { sourceId: input.sourceId } : {}),
    ...(input.reason !== undefined ? { reason: input.reason } : {}),
  });
}

export function createRuntimeExecutiveAdvisorActionAffordance(input: {
  readonly id: string;
  readonly kind: RuntimeExecutiveAdvisorActionKind;
  readonly label: string;
  readonly subjectId?: string;
  readonly enabled?: boolean;
}): RuntimeExecutiveAdvisorActionAffordance {
  return normalizeRuntimeExecutiveAdvisorActionAffordances([
    {
      id: input.id,
      kind: input.kind,
      label: input.label,
      enabled: input.enabled ?? true,
      ...(input.subjectId !== undefined ? { subjectId: input.subjectId } : {}),
    },
  ])[0]!;
}

export function createRuntimeExecutiveAdvisorContext(input?: {
  readonly subject?: RuntimeExecutiveAdvisorSubject | null;
  readonly engagement?: RuntimeExecutiveAdvisorEngagementState;
  readonly intent?: RuntimeExecutiveAdvisorGuidanceIntent;
  readonly attention?: RuntimeExecutiveAdvisorAttentionLevel;
  readonly presentationState?: RuntimeExecutiveAdvisorPresentationState;
  readonly informationDensity?: RuntimeExecutiveAdvisorInformationDensity;
  readonly confidence?: RuntimeExecutiveAdvisorConfidence;
  readonly urgency?: RuntimeExecutiveAdvisorUrgency;
  readonly stageRelationship?: RuntimeExecutiveAdvisorStageRelationship;
  readonly provenance?: ReadonlyArray<RuntimeExecutiveAdvisorProvenance>;
  readonly actionAffordances?: ReadonlyArray<RuntimeExecutiveAdvisorActionAffordance>;
}): RuntimeExecutiveAdvisorContext {
  const base = RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT;
  return normalizeRuntimeExecutiveAdvisorContext({
    subject: input?.subject === undefined ? base.subject : input.subject,
    engagement: input?.engagement ?? base.engagement,
    intent: input?.intent ?? base.intent,
    attention: input?.attention ?? base.attention,
    presentationState: input?.presentationState ?? base.presentationState,
    informationDensity: input?.informationDensity ?? base.informationDensity,
    confidence: input?.confidence ?? base.confidence,
    urgency: input?.urgency ?? base.urgency,
    stageRelationship: input?.stageRelationship ?? base.stageRelationship,
    provenance: input?.provenance ?? base.provenance,
    actionAffordances: input?.actionAffordances ?? base.actionAffordances,
  });
}

// ─── Contextual awareness / guidance readiness ──────────────────────────────

export function isRuntimeExecutiveAdvisorContextual(
  context: RuntimeExecutiveAdvisorContext,
): boolean {
  return context.subject !== null && isNonEmptyString(context.subject.id);
}

/**
 * Deterministic readiness for a later REX-3 layer to attempt guidance.
 * Does not call an LLM, inspect React state, or claim advice correctness.
 */
export function isRuntimeExecutiveAdvisorGuidanceReady(
  context: RuntimeExecutiveAdvisorContext,
): boolean {
  if (!isRuntimeExecutiveAdvisorContextual(context)) {
    return false;
  }
  return (
    context.engagement === "engaged" || context.engagement === "guiding"
  );
}

export function createRuntimeExecutiveAdvisorSnapshot(input: {
  readonly context: RuntimeExecutiveAdvisorContext;
}): RuntimeExecutiveAdvisorSnapshot {
  const context = normalizeRuntimeExecutiveAdvisorContext(input.context);
  const activeSubjectId = context.subject?.id ?? null;
  return Object.freeze({
    context,
    activeSubjectId,
    isContextual: isRuntimeExecutiveAdvisorContextual(context),
    isGuidanceReady: isRuntimeExecutiveAdvisorGuidanceReady(context),
    foundationIdentity: runtimeExecutiveAdvisorExperienceFoundationIdentity,
    foundationVersion: runtimeExecutiveAdvisorExperienceFoundationVersion,
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

function validateSubject(
  value: unknown,
  path: string,
  issues: RuntimeExecutiveAdvisorFoundationIssue[],
): void {
  if (value === null) return;
  if (!isPlainObject(value)) {
    issues.push(issue("invalid-subject", "subject must be an object or null", path));
    return;
  }
  if (!isNonEmptyString(value.id)) {
    issues.push(
      issue("invalid-subject-id", "subject id must be a non-empty string", `${path}.id`),
    );
  }
  if (!isRuntimeExecutiveAdvisorSubjectKind(value.kind)) {
    issues.push(
      issue("invalid-subject-kind", "subject kind is not approved", `${path}.kind`),
    );
  }
  if (typeof value.label !== "string") {
    issues.push(
      issue("invalid-subject-label", "subject label must be a string", `${path}.label`),
    );
  }
  if (value.sourceId !== undefined && !isNonEmptyString(value.sourceId)) {
    issues.push(
      issue(
        "invalid-subject-source-id",
        "subject sourceId must be a non-empty string when provided",
        `${path}.sourceId`,
      ),
    );
  }
  if (value.parentId !== undefined && !isNonEmptyString(value.parentId)) {
    issues.push(
      issue(
        "invalid-subject-parent-id",
        "subject parentId must be a non-empty string when provided",
        `${path}.parentId`,
      ),
    );
  }
}

export function validateRuntimeExecutiveAdvisorContext(
  value: unknown,
): RuntimeExecutiveAdvisorFoundationValidationResult {
  const issues: RuntimeExecutiveAdvisorFoundationIssue[] = [];

  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-context", "context must be a plain object"),
      ]),
    });
  }

  validateSubject(value.subject, "subject", issues);

  if (!isRuntimeExecutiveAdvisorEngagementState(value.engagement)) {
    issues.push(
      issue("invalid-engagement", "engagement state is not approved", "engagement"),
    );
  }
  if (!isRuntimeExecutiveAdvisorGuidanceIntent(value.intent)) {
    issues.push(
      issue("invalid-intent", "guidance intent is not approved", "intent"),
    );
  }
  if (!isRuntimeExecutiveAdvisorAttentionLevel(value.attention)) {
    issues.push(
      issue("invalid-attention", "attention level is not approved", "attention"),
    );
  }
  if (!isRuntimeExecutiveAdvisorPresentationState(value.presentationState)) {
    issues.push(
      issue(
        "invalid-presentation-state",
        "presentation state must be minimum, report, or operation",
        "presentationState",
      ),
    );
  }
  if (!isRuntimeExecutiveAdvisorInformationDensity(value.informationDensity)) {
    issues.push(
      issue(
        "invalid-information-density",
        "information density is not approved",
        "informationDensity",
      ),
    );
  }
  if (!isRuntimeExecutiveAdvisorConfidence(value.confidence)) {
    issues.push(
      issue("invalid-confidence", "confidence level is not approved", "confidence"),
    );
  }
  if (!isRuntimeExecutiveAdvisorUrgency(value.urgency)) {
    issues.push(
      issue("invalid-urgency", "urgency level is not approved", "urgency"),
    );
  }
  if (!isRuntimeExecutiveAdvisorStageRelationship(value.stageRelationship)) {
    issues.push(
      issue(
        "invalid-stage-relationship",
        "Stage relationship is not approved",
        "stageRelationship",
      ),
    );
  }

  if (!Array.isArray(value.provenance)) {
    issues.push(
      issue("invalid-provenance", "provenance must be an array", "provenance"),
    );
  } else {
    value.provenance.forEach((entry, index) => {
      if (!isPlainObject(entry)) {
        issues.push(
          issue(
            "invalid-provenance-entry",
            "provenance entry must be an object",
            `provenance[${index}]`,
          ),
        );
        return;
      }
      if (!isRuntimeExecutiveAdvisorProvenanceKind(entry.kind)) {
        issues.push(
          issue(
            "invalid-provenance-kind",
            "provenance kind is not approved",
            `provenance[${index}].kind`,
          ),
        );
      }
      if (entry.sourceId !== undefined && !isNonEmptyString(entry.sourceId)) {
        issues.push(
          issue(
            "invalid-provenance-source-id",
            "provenance sourceId must be a non-empty string when provided",
            `provenance[${index}].sourceId`,
          ),
        );
      }
    });
  }

  if (!Array.isArray(value.actionAffordances)) {
    issues.push(
      issue(
        "invalid-action-affordances",
        "actionAffordances must be an array",
        "actionAffordances",
      ),
    );
  } else {
    const ids: string[] = [];
    value.actionAffordances.forEach((affordance, index) => {
      if (!isPlainObject(affordance)) {
        issues.push(
          issue(
            "invalid-action-affordance",
            "action affordance must be an object",
            `actionAffordances[${index}]`,
          ),
        );
        return;
      }
      if (!isNonEmptyString(affordance.id)) {
        issues.push(
          issue(
            "invalid-action-id",
            "action affordance id must be a non-empty string",
            `actionAffordances[${index}].id`,
          ),
        );
      } else {
        ids.push(affordance.id);
      }
      if (!isRuntimeExecutiveAdvisorActionKind(affordance.kind)) {
        issues.push(
          issue(
            "invalid-action-kind",
            "action kind is not approved",
            `actionAffordances[${index}].kind`,
          ),
        );
      }
      if (typeof affordance.label !== "string") {
        issues.push(
          issue(
            "invalid-action-label",
            "action label must be a string",
            `actionAffordances[${index}].label`,
          ),
        );
      }
      if (typeof affordance.enabled !== "boolean") {
        issues.push(
          issue(
            "invalid-action-enabled",
            "action enabled must be a boolean",
            `actionAffordances[${index}].enabled`,
          ),
        );
      }
      if (
        affordance.subjectId !== undefined &&
        !isNonEmptyString(affordance.subjectId)
      ) {
        issues.push(
          issue(
            "invalid-action-subject-id",
            "action subjectId must be a non-empty string when provided",
            `actionAffordances[${index}].subjectId`,
          ),
        );
      }
    });
    if (!unique(ids)) {
      issues.push(
        issue(
          "duplicate-action-id",
          "action affordance identifiers must be unique",
          "actionAffordances",
        ),
      );
    }
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateRuntimeExecutiveAdvisorSnapshot(
  value: unknown,
): RuntimeExecutiveAdvisorFoundationValidationResult {
  const issues: RuntimeExecutiveAdvisorFoundationIssue[] = [];

  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        issue("invalid-snapshot", "snapshot must be a plain object"),
      ]),
    });
  }

  const contextResult = validateRuntimeExecutiveAdvisorContext(value.context);
  for (const entry of contextResult.issues) {
    issues.push(
      issue(entry.code, entry.message, entry.path ? `context.${entry.path}` : "context"),
    );
  }

  if (
    value.foundationIdentity !==
      runtimeExecutiveAdvisorExperienceFoundationIdentity ||
    value.foundationVersion !==
      runtimeExecutiveAdvisorExperienceFoundationVersion
  ) {
    issues.push(
      issue(
        "invalid-foundation-metadata",
        "snapshot foundation identity/version metadata is invalid",
      ),
    );
  }

  if (typeof value.isContextual !== "boolean") {
    issues.push(
      issue("invalid-is-contextual", "isContextual must be a boolean", "isContextual"),
    );
  }
  if (typeof value.isGuidanceReady !== "boolean") {
    issues.push(
      issue(
        "invalid-is-guidance-ready",
        "isGuidanceReady must be a boolean",
        "isGuidanceReady",
      ),
    );
  }

  if (
    value.activeSubjectId !== null &&
    !isNonEmptyString(value.activeSubjectId)
  ) {
    issues.push(
      issue(
        "invalid-active-subject-id",
        "activeSubjectId must be null or a non-empty string",
        "activeSubjectId",
      ),
    );
  }

  if (isPlainObject(value.context)) {
    const subject = value.context.subject;
    const expectedActiveId =
      isPlainObject(subject) && isNonEmptyString(subject.id) ? subject.id : null;
    if (
      typeof value.isContextual === "boolean" &&
      value.isContextual !== (expectedActiveId !== null)
    ) {
      issues.push(
        issue(
          "inconsistent-is-contextual",
          "isContextual must derive from subject presence",
          "isContextual",
        ),
      );
    }
    if (value.activeSubjectId !== expectedActiveId) {
      issues.push(
        issue(
          "inconsistent-active-subject-id",
          "activeSubjectId must match context.subject.id or null",
          "activeSubjectId",
        ),
      );
    }
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function getRuntimeExecutiveAdvisorExperienceFoundationIdentity():
  typeof runtimeExecutiveAdvisorExperienceFoundationCanonicalIdentity {
  return runtimeExecutiveAdvisorExperienceFoundationCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveAdvisorExperienceFoundationApiNames =
  Object.freeze([
    "createRuntimeExecutiveAdvisorSubject",
    "createRuntimeExecutiveAdvisorProvenance",
    "createRuntimeExecutiveAdvisorActionAffordance",
    "createRuntimeExecutiveAdvisorContext",
    "createRuntimeExecutiveAdvisorEmptyContext",
    "createRuntimeExecutiveAdvisorSnapshot",
    "normalizeRuntimeExecutiveAdvisorSubject",
    "normalizeRuntimeExecutiveAdvisorProvenance",
    "normalizeRuntimeExecutiveAdvisorActionAffordances",
    "normalizeRuntimeExecutiveAdvisorContext",
    "isRuntimeExecutiveAdvisorSubjectKind",
    "isRuntimeExecutiveAdvisorEngagementState",
    "isRuntimeExecutiveAdvisorGuidanceIntent",
    "isRuntimeExecutiveAdvisorAttentionLevel",
    "isRuntimeExecutiveAdvisorPresentationState",
    "isRuntimeExecutiveAdvisorInformationDensity",
    "isRuntimeExecutiveAdvisorConfidence",
    "isRuntimeExecutiveAdvisorUrgency",
    "isRuntimeExecutiveAdvisorProvenanceKind",
    "isRuntimeExecutiveAdvisorStageRelationship",
    "isRuntimeExecutiveAdvisorActionKind",
    "isRuntimeExecutiveAdvisorFoundationCapability",
    "isRuntimeExecutiveAdvisorContextual",
    "isRuntimeExecutiveAdvisorGuidanceReady",
    "mapRuntimeExecutiveStageAttentionToAdvisorAttention",
    "validateRuntimeExecutiveAdvisorContext",
    "validateRuntimeExecutiveAdvisorSnapshot",
    "verifyRuntimeExecutiveAdvisorExperienceFoundation",
    "getRuntimeExecutiveAdvisorExperienceFoundationIdentity",
  ] as const);

export const RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveAdvisorSubjectKind",
    "RuntimeExecutiveAdvisorEngagementState",
    "RuntimeExecutiveAdvisorGuidanceIntent",
    "RuntimeExecutiveAdvisorAttentionLevel",
    "RuntimeExecutiveAdvisorPresentationState",
    "RuntimeExecutiveAdvisorInformationDensity",
    "RuntimeExecutiveAdvisorConfidence",
    "RuntimeExecutiveAdvisorUrgency",
    "RuntimeExecutiveAdvisorProvenanceKind",
    "RuntimeExecutiveAdvisorStageRelationship",
    "RuntimeExecutiveAdvisorActionKind",
    "RuntimeExecutiveAdvisorFoundationCapability",
    "RuntimeExecutiveAdvisorSubject",
    "RuntimeExecutiveAdvisorProvenance",
    "RuntimeExecutiveAdvisorActionAffordance",
    "RuntimeExecutiveAdvisorContext",
    "RuntimeExecutiveAdvisorSnapshot",
    "RuntimeExecutiveAdvisorFoundationIssue",
    "RuntimeExecutiveAdvisorFoundationValidationResult",
    "RuntimeExecutiveAdvisorFoundationInvariant",
    "RuntimeExecutiveAdvisorFoundationRegistrySection",
    "RuntimeExecutiveAdvisorExperienceFoundationVerification",
  ] as const);

export const runtimeExecutiveAdvisorExperienceFoundationRegistry =
  Object.freeze({
    identity: runtimeExecutiveAdvisorExperienceFoundationIdentity,
    version: runtimeExecutiveAdvisorExperienceFoundationVersion,
    namespace: runtimeExecutiveAdvisorExperienceFoundationNamespace,
    layer: runtimeExecutiveAdvisorExperienceFoundationLayer,
    domain: runtimeExecutiveAdvisorExperienceFoundationDomain,
    phase: runtimeExecutiveAdvisorExperienceFoundationPhase,
    dependencyIdentity:
      runtimeExecutiveAdvisorExperienceFoundationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveAdvisorExperienceFoundationDependencyPath,
    supportedImportPath:
      runtimeExecutiveAdvisorExperienceFoundationSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_REGISTRY_SECTIONS,
    sectionCount: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_REGISTRY_SECTIONS.length,
    subjectKinds: RUNTIME_EXECUTIVE_ADVISOR_SUBJECT_KINDS,
    subjectKindCount: RUNTIME_EXECUTIVE_ADVISOR_SUBJECT_KINDS.length,
    engagementStates: RUNTIME_EXECUTIVE_ADVISOR_ENGAGEMENT_STATES,
    engagementStateCount: RUNTIME_EXECUTIVE_ADVISOR_ENGAGEMENT_STATES.length,
    guidanceIntents: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_INTENTS,
    guidanceIntentCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_INTENTS.length,
    attentionLevels: RUNTIME_EXECUTIVE_ADVISOR_ATTENTION_LEVELS,
    attentionLevelCount: RUNTIME_EXECUTIVE_ADVISOR_ATTENTION_LEVELS.length,
    presentationStates: RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_STATES,
    presentationStateCount:
      RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_STATES.length,
    informationDensities: RUNTIME_EXECUTIVE_ADVISOR_INFORMATION_DENSITIES,
    informationDensityCount:
      RUNTIME_EXECUTIVE_ADVISOR_INFORMATION_DENSITIES.length,
    confidenceLevels: RUNTIME_EXECUTIVE_ADVISOR_CONFIDENCE_LEVELS,
    confidenceLevelCount: RUNTIME_EXECUTIVE_ADVISOR_CONFIDENCE_LEVELS.length,
    urgencyLevels: RUNTIME_EXECUTIVE_ADVISOR_URGENCY_LEVELS,
    urgencyLevelCount: RUNTIME_EXECUTIVE_ADVISOR_URGENCY_LEVELS.length,
    provenanceKinds: RUNTIME_EXECUTIVE_ADVISOR_PROVENANCE_KINDS,
    provenanceKindCount: RUNTIME_EXECUTIVE_ADVISOR_PROVENANCE_KINDS.length,
    stageRelationships: RUNTIME_EXECUTIVE_ADVISOR_STAGE_RELATIONSHIPS,
    stageRelationshipCount:
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_RELATIONSHIPS.length,
    actionKinds: RUNTIME_EXECUTIVE_ADVISOR_ACTION_KINDS,
    actionKindCount: RUNTIME_EXECUTIVE_ADVISOR_ACTION_KINDS.length,
    capabilities: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_CAPABILITIES,
    capabilityCount: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_CAPABILITIES.length,
    invariants: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_INVARIANTS,
    invariantCount: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_INVARIANTS.length,
    publicTypes: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveAdvisorExperienceFoundationApiNames,
    publicApiCount:
      runtimeExecutiveAdvisorExperienceFoundationApiNames.length,
    relationshipChain: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_RELATIONSHIP_CHAIN,
  });

export const runtimeExecutiveAdvisorExperienceFoundation = Object.freeze({
  phase: "Foundation" as const,
  name: "RuntimeExecutiveAdvisorExperienceFoundation" as const,
  identity: runtimeExecutiveAdvisorExperienceFoundationIdentity,
  version: runtimeExecutiveAdvisorExperienceFoundationVersion,
  namespace: runtimeExecutiveAdvisorExperienceFoundationNamespace,
  layer: runtimeExecutiveAdvisorExperienceFoundationLayer,
  domain: runtimeExecutiveAdvisorExperienceFoundationDomain,
  architecturalRole:
    runtimeExecutiveAdvisorExperienceFoundationArchitecturalRole,
  role: "Foundation" as const,
  status: runtimeExecutiveAdvisorExperienceFoundationStability,
  upstreamDependency:
    runtimeExecutiveAdvisorExperienceFoundationDependencyIdentity,
  dependencyPath:
    runtimeExecutiveAdvisorExperienceFoundationDependencyPath,
  supportedImportPath:
    runtimeExecutiveAdvisorExperienceFoundationSupportedImportPath,
  deterministic: runtimeExecutiveAdvisorExperienceFoundationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  aiProviderIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_BOUNDARY,
  responsibilitySeparation:
    RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_RESPONSIBILITY_SEPARATION,
  subjectKinds: RUNTIME_EXECUTIVE_ADVISOR_SUBJECT_KINDS,
  engagementStates: RUNTIME_EXECUTIVE_ADVISOR_ENGAGEMENT_STATES,
  guidanceIntents: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_INTENTS,
  attentionLevels: RUNTIME_EXECUTIVE_ADVISOR_ATTENTION_LEVELS,
  presentationStates: RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_STATES,
  informationDensities: RUNTIME_EXECUTIVE_ADVISOR_INFORMATION_DENSITIES,
  confidenceLevels: RUNTIME_EXECUTIVE_ADVISOR_CONFIDENCE_LEVELS,
  urgencyLevels: RUNTIME_EXECUTIVE_ADVISOR_URGENCY_LEVELS,
  provenanceKinds: RUNTIME_EXECUTIVE_ADVISOR_PROVENANCE_KINDS,
  stageRelationships: RUNTIME_EXECUTIVE_ADVISOR_STAGE_RELATIONSHIPS,
  actionKinds: RUNTIME_EXECUTIVE_ADVISOR_ACTION_KINDS,
  capabilities: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_CAPABILITIES,
  emptyContext: RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT,
  invariants: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_FORBIDDEN_RESPONSIBILITIES,
  relationshipChain: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_RELATIONSHIP_CHAIN,
  publicTypeNames: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveAdvisorExperienceFoundationApiNames,
  registry: runtimeExecutiveAdvisorExperienceFoundationRegistry,
  publicIndexBoundary: "REX-2:9-public-index-only" as const,
  architecturalStatus:
    "REX-3:1 Foundation Complete — Ready for REX-3:2 Advisor Context & Subject Binding" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveAdvisorExperienceFoundationVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveAdvisorExperienceFoundationIdentity;
  readonly version: typeof runtimeExecutiveAdvisorExperienceFoundationVersion;
  readonly namespace: typeof runtimeExecutiveAdvisorExperienceFoundationNamespace;
  readonly layer: typeof runtimeExecutiveAdvisorExperienceFoundationLayer;
  readonly domain: typeof runtimeExecutiveAdvisorExperienceFoundationDomain;
  readonly phase: typeof runtimeExecutiveAdvisorExperienceFoundationPhase;
  readonly dependencyIdentity: typeof runtimeExecutiveAdvisorExperienceFoundationDependencyIdentity;
  readonly subjectKindCount: number;
  readonly engagementStateCount: number;
  readonly guidanceIntentCount: number;
  readonly attentionLevelCount: number;
  readonly presentationStateCount: number;
  readonly informationDensityCount: number;
  readonly confidenceLevelCount: number;
  readonly urgencyLevelCount: number;
  readonly provenanceKindCount: number;
  readonly stageRelationshipCount: number;
  readonly actionKindCount: number;
  readonly capabilityCount: number;
  readonly sectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
  readonly publicIndexBoundaryIntact: boolean;
  readonly rendererIndependent: boolean;
  readonly aiProviderIndependent: boolean;
  readonly reusesUpstreamPresentationStates: boolean;
  readonly upstreamConsumerEntryOk: boolean;
  readonly noKor: boolean;
}

export function verifyRuntimeExecutiveAdvisorExperienceFoundation():
  RuntimeExecutiveAdvisorExperienceFoundationVerification {
  const runtimeModule = runtimeExecutiveAdvisorExperienceFoundation;
  const registry = runtimeExecutiveAdvisorExperienceFoundationRegistry;
  const upstream = verifyRuntimeExecutiveStageExperienceConsumerEntry();

  const identityOk =
    runtimeModule.identity ===
      "REX-3:1/RuntimeExecutiveAdvisorExperienceFoundation" &&
    runtimeModule.version === "3.1.0" &&
    runtimeModule.namespace === "nexora.rex.advisor-experience.foundation" &&
    runtimeModule.layer === "RuntimeExecutiveExperience" &&
    runtimeModule.domain === "ExecutiveAdvisor" &&
    runtimeModule.phase === "Foundation" &&
    runtimeModule.upstreamDependency ===
      "REX-2:9/RuntimeExecutiveStageExperiencePublicIndex" &&
    runtimeModule.upstreamDependency ===
      runtimeExecutiveStageExperiencePublicIndexIdentity &&
    runtimeModule.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveStageExperiencePublicIndex" &&
    runtimeModule.publicIndexBoundary === "REX-2:9-public-index-only";

  const vocabOk =
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_SUBJECT_KINDS], [
      "workspace",
      "goal",
      "nexora-object",
      "kpi",
      "koi",
      "problem",
      "scenario",
      "decision",
      "execution",
      "pack",
      "connection",
      "scene",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_ENGAGEMENT_STATES], [
      "idle",
      "aware",
      "engaged",
      "guiding",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_INTENTS], [
      "observe",
      "explain",
      "inspect",
      "compare",
      "investigate",
      "evaluate",
      "recommend",
      "decide",
      "act",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_ATTENTION_LEVELS], [
      "ambient",
      "normal",
      "elevated",
      "critical",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_STATES], [
      "minimum",
      "report",
      "operation",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_INFORMATION_DENSITIES], [
      "compact",
      "balanced",
      "expanded",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_CONFIDENCE_LEVELS], [
      "unknown",
      "low",
      "medium",
      "high",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_URGENCY_LEVELS], [
      "none",
      "low",
      "medium",
      "high",
      "immediate",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_PROVENANCE_KINDS], [
      "runtime-context",
      "stage-focus",
      "stage-selection",
      "scene",
      "interaction",
      "attention",
      "presentation-state",
      "explicit-manager-intent",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_STAGE_RELATIONSHIPS], [
      "none",
      "observing",
      "focused-subject",
      "selected-subject",
      "related-subject",
    ]) &&
    exactOrder([...RUNTIME_EXECUTIVE_ADVISOR_ACTION_KINDS], [
      "inspect",
      "focus",
      "explain",
      "compare",
      "trace",
      "open-scenario",
      "open-decision",
      "open-execution",
      "show-related",
      "dismiss",
    ]) &&
    exactOrder(
      [...RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_REGISTRY_SECTIONS],
      [
        "Identity",
        "SubjectKinds",
        "EngagementStates",
        "GuidanceIntents",
        "AttentionLevels",
        "PresentationStates",
        "InformationDensities",
        "ConfidenceLevels",
        "UrgencyLevels",
        "ProvenanceKinds",
        "StageRelationships",
        "ActionKinds",
        "Capabilities",
      ],
    );

  const noKor =
    !RUNTIME_EXECUTIVE_ADVISOR_SUBJECT_KINDS.includes("kor" as never) &&
    RUNTIME_EXECUTIVE_ADVISOR_SUBJECT_KIND_SEMANTICS.introducesKor === false;

  const reusesUpstreamPresentationStates =
    RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_STATES ===
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_FROZEN_PRESENTATION_STATES;

  const registryCountsOk =
    registry.subjectKindCount ===
      RUNTIME_EXECUTIVE_ADVISOR_SUBJECT_KINDS.length &&
    registry.engagementStateCount ===
      RUNTIME_EXECUTIVE_ADVISOR_ENGAGEMENT_STATES.length &&
    registry.guidanceIntentCount ===
      RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_INTENTS.length &&
    registry.attentionLevelCount ===
      RUNTIME_EXECUTIVE_ADVISOR_ATTENTION_LEVELS.length &&
    registry.presentationStateCount ===
      RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_STATES.length &&
    registry.informationDensityCount ===
      RUNTIME_EXECUTIVE_ADVISOR_INFORMATION_DENSITIES.length &&
    registry.confidenceLevelCount ===
      RUNTIME_EXECUTIVE_ADVISOR_CONFIDENCE_LEVELS.length &&
    registry.urgencyLevelCount ===
      RUNTIME_EXECUTIVE_ADVISOR_URGENCY_LEVELS.length &&
    registry.provenanceKindCount ===
      RUNTIME_EXECUTIVE_ADVISOR_PROVENANCE_KINDS.length &&
    registry.stageRelationshipCount ===
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_RELATIONSHIPS.length &&
    registry.actionKindCount === RUNTIME_EXECUTIVE_ADVISOR_ACTION_KINDS.length &&
    registry.capabilityCount ===
      RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_CAPABILITIES.length &&
    registry.sectionCount ===
      RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_REGISTRY_SECTIONS.length &&
    registry.publicApiCount ===
      runtimeExecutiveAdvisorExperienceFoundationApiNames.length &&
    registry.publicTypeCount ===
      RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_PUBLIC_TYPE_NAMES.length;

  const invariantsOk =
    RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_INVARIANTS.length === 16 &&
    RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    ) &&
    unique(
      RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_INVARIANTS.map((entry) => entry.id),
    );

  const frozen =
    Object.isFrozen(module) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      runtimeExecutiveAdvisorExperienceFoundationCanonicalIdentity,
    ) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_SUBJECT_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_ENGAGEMENT_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_INTENTS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_ATTENTION_LEVELS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_INFORMATION_DENSITIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_CONFIDENCE_LEVELS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_URGENCY_LEVELS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_PROVENANCE_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_STAGE_RELATIONSHIPS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_ACTION_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_CAPABILITIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_INVARIANTS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_BOUNDARY);

  const publicIndexBoundaryIntact =
    runtimeModule.boundary.soleImmediateDependency ===
      "REX-2:9/RuntimeExecutiveStageExperiencePublicIndex" &&
    runtimeModule.boundary.consumesPublicIndexOnly === true &&
    runtimeModule.boundary.importsRex2InternalDirectly === false &&
    runtimeModule.boundary.importsRex1Directly === false &&
    runtimeModule.boundary.importsExDriDirectly === false &&
    runtimeModule.boundary.importsDriDirectly === false &&
    runtimeModule.boundary.importsNolDirectly === false &&
    runtimeModule.boundary.introducesLlmGeneration === false &&
    runtimeModule.boundary.mutatesStageState === false &&
    runtimeModule.boundary.ownsStageExperience === false;

  const emptyOk =
    RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT.subject === null &&
    RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT.engagement === "idle" &&
    RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT.intent === "observe" &&
    RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT.attention === "ambient" &&
    RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT.presentationState === "minimum" &&
    RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT.informationDensity === "compact" &&
    RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT.confidence === "unknown" &&
    RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT.urgency === "none" &&
    RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT.stageRelationship === "none" &&
    RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT.provenance.length === 0 &&
    RUNTIME_EXECUTIVE_ADVISOR_EMPTY_CONTEXT.actionAffordances.length === 0;

  const ok =
    identityOk &&
    vocabOk &&
    noKor &&
    reusesUpstreamPresentationStates &&
    registryCountsOk &&
    invariantsOk &&
    frozen &&
    publicIndexBoundaryIntact &&
    emptyOk &&
    runtimeModule.frameworkIndependent === true &&
    runtimeModule.rendererIndependent === true &&
    runtimeModule.aiProviderIndependent === true &&
    upstream.ok === true &&
    runtimeModule.principle === RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveAdvisorExperienceFoundationIdentity,
    version: runtimeExecutiveAdvisorExperienceFoundationVersion,
    namespace: runtimeExecutiveAdvisorExperienceFoundationNamespace,
    layer: runtimeExecutiveAdvisorExperienceFoundationLayer,
    domain: runtimeExecutiveAdvisorExperienceFoundationDomain,
    phase: runtimeExecutiveAdvisorExperienceFoundationPhase,
    dependencyIdentity:
      runtimeExecutiveAdvisorExperienceFoundationDependencyIdentity,
    subjectKindCount: RUNTIME_EXECUTIVE_ADVISOR_SUBJECT_KINDS.length,
    engagementStateCount: RUNTIME_EXECUTIVE_ADVISOR_ENGAGEMENT_STATES.length,
    guidanceIntentCount: RUNTIME_EXECUTIVE_ADVISOR_GUIDANCE_INTENTS.length,
    attentionLevelCount: RUNTIME_EXECUTIVE_ADVISOR_ATTENTION_LEVELS.length,
    presentationStateCount:
      RUNTIME_EXECUTIVE_ADVISOR_PRESENTATION_STATES.length,
    informationDensityCount:
      RUNTIME_EXECUTIVE_ADVISOR_INFORMATION_DENSITIES.length,
    confidenceLevelCount: RUNTIME_EXECUTIVE_ADVISOR_CONFIDENCE_LEVELS.length,
    urgencyLevelCount: RUNTIME_EXECUTIVE_ADVISOR_URGENCY_LEVELS.length,
    provenanceKindCount: RUNTIME_EXECUTIVE_ADVISOR_PROVENANCE_KINDS.length,
    stageRelationshipCount:
      RUNTIME_EXECUTIVE_ADVISOR_STAGE_RELATIONSHIPS.length,
    actionKindCount: RUNTIME_EXECUTIVE_ADVISOR_ACTION_KINDS.length,
    capabilityCount: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_CAPABILITIES.length,
    sectionCount: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_REGISTRY_SECTIONS.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeExecutiveAdvisorExperienceFoundationApiNames.length,
    invariantCount: RUNTIME_EXECUTIVE_ADVISOR_FOUNDATION_INVARIANTS.length,
    frozen,
    publicIndexBoundaryIntact,
    rendererIndependent: runtimeModule.rendererIndependent === true,
    aiProviderIndependent: runtimeModule.aiProviderIndependent === true,
    reusesUpstreamPresentationStates,
    upstreamConsumerEntryOk: upstream.ok === true,
    noKor,
  });
}
