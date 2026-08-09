/**
 * REX-2:6 — Runtime Executive Stage Experience Orchestration.
 *
 * Deterministic orchestration authority that combines Stage Model,
 * Focus & Selection, and Presentation & Attention into one immutable
 * Runtime Executive Stage Experience Plan.
 *
 * Canonical flow:
 *   REX-2:5 Presentation & Attention → REX-2:6 Orchestration → Stage Experience Plan
 *
 * REX-2:5 answers: How much should each subject reveal, and how strongly should it demand awareness?
 * REX-2:6 answers: What should the Executive Stage experience become now?
 *
 * Renderer-neutral. No React, Three.js, layout, animation, or business calculation.
 */

import {
  RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS,
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_FOCUS_ROLES,
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_STATUSES,
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES,
  createRuntimeExecutiveStageModel,
  projectRuntimeExecutiveStagePresentationAttention,
  resolveRuntimeExecutiveStagePresentationAttentionFromSelection,
  runtimeExecutiveStagePresentationAttentionIdentity,
  runtimeExecutiveStagePresentationAttentionVersion,
  verifyRuntimeExecutiveStagePresentationAttentionResult,
  type RuntimeExecutiveStageAttentionAssignment,
  type RuntimeExecutiveStageAttentionLevel,
  type RuntimeExecutiveStageFocusRole,
  type RuntimeExecutiveStageFocusSelectionRequestReason,
  type RuntimeExecutiveStageFocusSelectionResult,
  type RuntimeExecutiveStageFocusSelectionSource,
  type RuntimeExecutiveStageModel,
  type RuntimeExecutiveStagePresentationAssignment,
  type RuntimeExecutiveStagePresentationAttentionResult,
  type RuntimeExecutiveStagePresentationState,
  type RuntimeExecutiveStageSubjectModel,
} from "@/app/lib/rex/runtimeExecutiveStagePresentationAttention";

// ─── Transitively published Stage Model surface (for REX-2:7+) ───────────────
// Publication fix: platform consumers obtain Stage Model construction through
// REX-2:6 without importing REX-2:1–2:5.

export { createRuntimeExecutiveStageModel };

export type {
  RuntimeExecutiveStageAttentionLevel,
  RuntimeExecutiveStageFocusRole,
  RuntimeExecutiveStageFocusSelectionRequestReason,
  RuntimeExecutiveStageFocusSelectionResult,
  RuntimeExecutiveStageFocusSelectionSource,
  RuntimeExecutiveStageModel,
  RuntimeExecutiveStagePresentationAttentionResult,
  RuntimeExecutiveStagePresentationState,
  RuntimeExecutiveStageSubjectModel,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveStageExperienceOrchestrationIdentity =
  "REX-2:6/RuntimeExecutiveStageExperienceOrchestration" as const;

export const runtimeExecutiveStageExperienceOrchestrationVersion =
  "2.6.0" as const;

export const runtimeExecutiveStageExperienceOrchestrationNamespace =
  "nexora.rex.stage-experience.orchestration" as const;

export const runtimeExecutiveStageExperienceOrchestrationLayer =
  "REX" as const;

export const runtimeExecutiveStageExperienceOrchestrationDomain =
  "Runtime Executive Stage Experience" as const;

export const runtimeExecutiveStageExperienceOrchestrationPhase =
  "Orchestration" as const;

export const runtimeExecutiveStageExperienceOrchestrationArchitecturalRole =
  "RuntimeExecutiveStageExperienceOrchestrationBoundary" as const;

export const runtimeExecutiveStageExperienceOrchestrationConsumerRole =
  "InternalRuntimeOrchestrator" as const;

export const runtimeExecutiveStageExperienceOrchestrationDependencyIdentity =
  runtimeExecutiveStagePresentationAttentionIdentity;

export const runtimeExecutiveStageExperienceOrchestrationDependencyPath =
  "@/app/lib/rex/runtimeExecutiveStagePresentationAttention" as const;

export const runtimeExecutiveStageExperienceOrchestrationStability =
  "OrchestrationReady" as const;

export const runtimeExecutiveStageExperienceOrchestrationDeterministic =
  true as const;

export const runtimeExecutiveStageExperienceOrchestrationSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveStageExperienceOrchestrationMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveStageExperienceOrchestrationCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveStageExperienceOrchestrationIdentity,
    version: runtimeExecutiveStageExperienceOrchestrationVersion,
    namespace: runtimeExecutiveStageExperienceOrchestrationNamespace,
    layer: runtimeExecutiveStageExperienceOrchestrationLayer,
    domain: runtimeExecutiveStageExperienceOrchestrationDomain,
    phase: runtimeExecutiveStageExperienceOrchestrationPhase,
    architecturalRole:
      runtimeExecutiveStageExperienceOrchestrationArchitecturalRole,
    consumerRole: runtimeExecutiveStageExperienceOrchestrationConsumerRole,
    dependencyIdentity:
      runtimeExecutiveStageExperienceOrchestrationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveStageExperienceOrchestrationDependencyPath,
    upstreamVersion: runtimeExecutiveStagePresentationAttentionVersion,
    stabilityStatus: runtimeExecutiveStageExperienceOrchestrationStability,
    deterministicStatus:
      runtimeExecutiveStageExperienceOrchestrationDeterministic,
    sideEffectPolicy:
      runtimeExecutiveStageExperienceOrchestrationSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveStageExperienceOrchestrationMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_PRINCIPLE =
  "The Stage is an executive presentation environment. REX-2:6 orchestrates approved runtime meaning into a renderer-neutral Stage Experience Plan — it does not invent meaning, render, or calculate business intelligence." as const;

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-enabled-Executive-Experience" as const,
    orchestrationAuthority: "REX-2:6" as const,
    architecturalRole:
      "RuntimeExecutiveStageExperienceOrchestrationBoundary" as const,
    consumerRole: "InternalRuntimeOrchestrator" as const,
    soleImmediateDependency:
      "REX-2:5/RuntimeExecutiveStagePresentationAttention" as const,
    consumesPresentationAttentionOnly: true as const,
    importsRex24Directly: false as const,
    importsRex23Directly: false as const,
    importsRex22Directly: false as const,
    importsRex21Directly: false as const,
    importsRex1Directly: false as const,
    importsExDriDirectly: false as const,
    importsDriDirectly: false as const,
    importsNolDirectly: false as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    mutatesInput: false as const,
    inventsExecutiveMeaning: false as const,
    calculatesKpi: false as const,
    calculatesKoi: false as const,
    rendersUi: false as const,
    executesAnimation: false as const,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES;

export const RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_ATTENTION_LEVELS =
  RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS;

export const RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_FOCUS_ROLES =
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_FOCUS_ROLES;

export const RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_STATUSES =
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_STATUSES;

export type RuntimeExecutiveStageOrchestrationStatus =
  (typeof RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_STATUSES)[number];

/**
 * Stage subject disposition — composed from upstream focus/selection/attention
 * without inventing a competing state machine.
 */
export const RUNTIME_EXECUTIVE_STAGE_OBJECT_DISPOSITIONS = Object.freeze([
  "primary",
  "contextual",
  "related",
  "selected",
  "attention-bearing",
  "background",
  "suppressed",
] as const);

export type RuntimeExecutiveStageObjectDisposition =
  (typeof RUNTIME_EXECUTIVE_STAGE_OBJECT_DISPOSITIONS)[number];

export const RUNTIME_EXECUTIVE_STAGE_CONNECTION_DISPOSITIONS = Object.freeze([
  "emphasized",
  "visible",
  "contextual",
  "de-emphasized",
  "suppressed",
] as const);

export type RuntimeExecutiveStageConnectionDisposition =
  (typeof RUNTIME_EXECUTIVE_STAGE_CONNECTION_DISPOSITIONS)[number];

export const RUNTIME_EXECUTIVE_STAGE_SCENE_TRANSITION_INTENTS = Object.freeze([
  "initial-scene",
  "focus-change",
  "selection-change",
  "attention-change",
  "presentation-state-change",
  "relationship-emphasis-change",
  "scene-replacement",
  "scene-restoration",
  "noise-reduction",
] as const);

export type RuntimeExecutiveStageSceneTransitionIntent =
  (typeof RUNTIME_EXECUTIVE_STAGE_SCENE_TRANSITION_INTENTS)[number];

export const RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_REASON_KINDS = Object.freeze([
  "primary-focus",
  "explicit-selection",
  "attention-required",
  "related-to-focus",
  "scene-required",
  "presentation-state-required",
  "connection-relevant",
  "context-preserved",
  "noise-reduction",
  "scene-transition",
  "secondary-focus",
  "contextual-focus",
  "background-subject",
  "invalid-input",
] as const);

export type RuntimeExecutiveStageOrchestrationReasonKind =
  (typeof RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_REASON_KINDS)[number];

/**
 * Deterministic experience precedence (highest → lowest):
 * 1. scene validity
 * 2. primary focus
 * 3. explicit selection
 * 4. critical/important attention
 * 5. relationship context
 * 6. presentation-state requirements
 * 7. background/contextual subjects
 */
export const RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_PRECEDENCE = Object.freeze([
  "scene-validity",
  "primary-focus",
  "explicit-selection",
  "critical-attention",
  "relationship-context",
  "presentation-state",
  "background-contextual",
] as const);

export const RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_CAPABILITIES = Object.freeze([
  "stage-experience-plan",
  "object-disposition-resolution",
  "focus-composition",
  "selection-composition",
  "attention-composition",
  "connection-composition",
  "presentation-state-composition",
  "scene-transition-composition",
  "noise-reduction",
  "experience-comparison",
  "orchestration-explainability",
  "structural-verification",
] as const);

export type RuntimeExecutiveStageOrchestrationCapability =
  (typeof RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_CAPABILITIES)[number];

// ─── Public types ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveStageOrchestrationReason {
  readonly kind: RuntimeExecutiveStageOrchestrationReasonKind;
  readonly subjectId?: string;
  readonly connectionId?: string;
  readonly detail?: string;
}

export interface RuntimeExecutiveStageOrchestrationInput {
  readonly planId: string;
  readonly model: RuntimeExecutiveStageModel;
  readonly presentationAttention: RuntimeExecutiveStagePresentationAttentionResult;
  readonly previousPlan?: RuntimeExecutiveStageExperiencePlan;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly reason?: RuntimeExecutiveStageFocusSelectionRequestReason;
  readonly interactionReason?: string;
  /** When true, background/unfocused subjects without elevated attention are suppressed. */
  readonly enableNoiseReduction?: boolean;
}

export interface RuntimeExecutiveStageSubjectExperience {
  readonly subjectId: string;
  readonly kind: RuntimeExecutiveStageSubjectModel["kind"];
  readonly dispositions: ReadonlyArray<RuntimeExecutiveStageObjectDisposition>;
  readonly focusRole: RuntimeExecutiveStageFocusRole;
  readonly selected: boolean;
  readonly presentationState: RuntimeExecutiveStagePresentationState;
  readonly attention: RuntimeExecutiveStageAttentionLevel;
  readonly visibility: RuntimeExecutiveStageSubjectModel["visibility"];
  readonly stageVisible: boolean;
  readonly orderIndex: number;
  readonly reasons: ReadonlyArray<RuntimeExecutiveStageOrchestrationReason>;
}

export interface RuntimeExecutiveStageConnectionExperience {
  readonly connectionId: string;
  readonly sourceSubjectId: string;
  readonly targetSubjectId: string;
  readonly kind: string;
  readonly direction: string;
  readonly disposition: RuntimeExecutiveStageConnectionDisposition;
  readonly emphasized: boolean;
  readonly orderIndex: number;
  readonly reasons: ReadonlyArray<RuntimeExecutiveStageOrchestrationReason>;
}

export interface RuntimeExecutiveStageSceneTransitionComposition {
  readonly intents: ReadonlyArray<RuntimeExecutiveStageSceneTransitionIntent>;
  readonly previousSceneId?: string;
  readonly currentSceneId: string;
  readonly previousRevision?: string;
  readonly currentRevision: string;
  readonly reasons: ReadonlyArray<RuntimeExecutiveStageOrchestrationReason>;
}

export interface RuntimeExecutiveStageExperiencePlan {
  readonly planId: string;
  readonly status: RuntimeExecutiveStageOrchestrationStatus;
  readonly sceneId: string;
  readonly revision: string;
  readonly modelId: string;
  readonly primaryFocusSubjectId?: string;
  readonly secondaryFocusSubjectIds: ReadonlyArray<string>;
  readonly contextualSubjectIds: ReadonlyArray<string>;
  readonly selectedSubjectIds: ReadonlyArray<string>;
  readonly attentionSubjectIds: ReadonlyArray<string>;
  readonly visibleSubjectIds: ReadonlyArray<string>;
  readonly suppressedSubjectIds: ReadonlyArray<string>;
  readonly subjects: ReadonlyArray<RuntimeExecutiveStageSubjectExperience>;
  readonly connections: ReadonlyArray<RuntimeExecutiveStageConnectionExperience>;
  readonly emphasizedConnectionIds: ReadonlyArray<string>;
  readonly stagePresentationState: RuntimeExecutiveStagePresentationState;
  readonly stageAttention: RuntimeExecutiveStageAttentionLevel;
  readonly sceneTransition: RuntimeExecutiveStageSceneTransitionComposition;
  readonly reasons: ReadonlyArray<RuntimeExecutiveStageOrchestrationReason>;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly focusSelection: RuntimeExecutiveStageFocusSelectionResult;
  readonly presentationAttention: RuntimeExecutiveStagePresentationAttentionResult;
  readonly orchestrationIdentity: typeof runtimeExecutiveStageExperienceOrchestrationIdentity;
  readonly orchestrationVersion: typeof runtimeExecutiveStageExperienceOrchestrationVersion;
}

export interface RuntimeExecutiveStageExperienceComparison {
  readonly identical: boolean;
  readonly focusChanged: boolean;
  readonly selectionChanged: boolean;
  readonly attentionChanged: boolean;
  readonly presentationChanged: boolean;
  readonly visibilityChanged: boolean;
  readonly connectionEmphasisChanged: boolean;
  readonly sceneChanged: boolean;
  readonly revisionChanged: boolean;
  readonly leftPlanId: string;
  readonly rightPlanId: string;
  readonly transitionIntents: ReadonlyArray<RuntimeExecutiveStageSceneTransitionIntent>;
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "depends-only-on-rex-2-5",
      order: 1,
      statement: "REX-2:6 depends only on REX-2:5.",
    }),
    Object.freeze({
      id: "no-direct-rex-2-4",
      order: 2,
      statement: "No direct REX-2:4 import.",
    }),
    Object.freeze({
      id: "no-direct-rex-2-3",
      order: 3,
      statement: "No direct REX-2:3 import.",
    }),
    Object.freeze({
      id: "no-direct-rex-2-2",
      order: 4,
      statement: "No direct REX-2:2 import.",
    }),
    Object.freeze({
      id: "no-direct-rex-2-1",
      order: 5,
      statement: "No direct REX-2:1 import.",
    }),
    Object.freeze({
      id: "focus-distinct-from-selection",
      order: 6,
      statement: "Focus remains distinct from selection.",
    }),
    Object.freeze({
      id: "attention-distinct-from-focus",
      order: 7,
      statement: "Attention remains distinct from focus.",
    }),
    Object.freeze({
      id: "attention-distinct-from-selection",
      order: 8,
      statement: "Attention remains distinct from selection.",
    }),
    Object.freeze({
      id: "canonical-presentation-states",
      order: 9,
      statement: "Presentation states remain minimum/report/operation.",
    }),
    Object.freeze({
      id: "deterministic-orchestration",
      order: 10,
      statement: "Orchestration is deterministic.",
    }),
    Object.freeze({
      id: "immutable-outputs",
      order: 11,
      statement: "Stage Experience Plan is immutable.",
    }),
    Object.freeze({
      id: "input-not-mutated",
      order: 12,
      statement: "Caller-owned inputs are never mutated.",
    }),
    Object.freeze({
      id: "deterministic-subject-order",
      order: 13,
      statement: "Subject ordering is deterministic.",
    }),
    Object.freeze({
      id: "deterministic-connection-order",
      order: 14,
      statement: "Connection ordering is deterministic.",
    }),
    Object.freeze({
      id: "renderer-neutral-plan",
      order: 15,
      statement: "Plan contains no renderer-specific data.",
    }),
    Object.freeze({
      id: "no-react",
      order: 16,
      statement: "No React dependency exists.",
    }),
    Object.freeze({
      id: "no-threejs",
      order: 17,
      statement: "No Three.js dependency exists.",
    }),
    Object.freeze({
      id: "no-browser-dom",
      order: 18,
      statement: "No browser/DOM dependency exists.",
    }),
    Object.freeze({
      id: "no-kpi-calculation",
      order: 19,
      statement: "No KPI calculation exists.",
    }),
    Object.freeze({
      id: "no-koi-calculation",
      order: 20,
      statement: "No KOI calculation exists.",
    }),
    Object.freeze({
      id: "does-not-invent-meaning",
      order: 21,
      statement: "Orchestration does not invent executive meaning.",
    }),
    Object.freeze({
      id: "noise-reduction-supported",
      order: 22,
      statement: "Unrelated Stage noise can be suppressed.",
    }),
    Object.freeze({
      id: "explainable-reasons",
      order: 23,
      statement: "Orchestration reasons are structured and preserved.",
    }),
  ] as const);

export type RuntimeExecutiveStageExperienceOrchestrationInvariant =
  (typeof RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_FORBIDDEN =
  Object.freeze([
    "rendering",
    "react",
    "threejs",
    "dom",
    "css",
    "animation-execution",
    "kpi-calculation",
    "koi-calculation",
    "business-relationship-creation",
    "executive-decision-making",
    "network",
    "persistence",
  ] as const);

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveStageOrchestrationInput",
    "RuntimeExecutiveStageExperiencePlan",
    "RuntimeExecutiveStageSubjectExperience",
    "RuntimeExecutiveStageConnectionExperience",
    "RuntimeExecutiveStageSceneTransitionComposition",
    "RuntimeExecutiveStageExperienceComparison",
    "RuntimeExecutiveStageOrchestrationReason",
    "RuntimeExecutiveStageObjectDisposition",
    "RuntimeExecutiveStageConnectionDisposition",
    "RuntimeExecutiveStageSceneTransitionIntent",
  ] as const);

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "Capabilities",
    "Dispositions",
    "Transitions",
    "Reasons",
    "Precedence",
    "PublicTypes",
    "APIs",
    "Invariants",
  ] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function freezeReason(
  reason: RuntimeExecutiveStageOrchestrationReason,
): RuntimeExecutiveStageOrchestrationReason {
  return Object.freeze({
    kind: reason.kind,
    ...(reason.subjectId !== undefined ? { subjectId: reason.subjectId } : {}),
    ...(reason.connectionId !== undefined
      ? { connectionId: reason.connectionId }
      : {}),
    ...(reason.detail !== undefined ? { detail: reason.detail } : {}),
  });
}

function attentionRank(level: RuntimeExecutiveStageAttentionLevel): number {
  switch (level) {
    case "critical":
      return 5;
    case "warning":
      return 4;
    case "elevated":
      return 3;
    case "informational":
      return 2;
    default:
      return 1;
  }
}

function presentationRank(
  state: RuntimeExecutiveStagePresentationState,
): number {
  switch (state) {
    case "operation":
      return 3;
    case "report":
      return 2;
    default:
      return 1;
  }
}

function isAttentionBearing(level: RuntimeExecutiveStageAttentionLevel): boolean {
  return attentionRank(level) >= attentionRank("elevated");
}

function maxPresentation(
  states: readonly RuntimeExecutiveStagePresentationState[],
): RuntimeExecutiveStagePresentationState {
  let best: RuntimeExecutiveStagePresentationState = "minimum";
  for (const state of states) {
    if (presentationRank(state) > presentationRank(best)) best = state;
  }
  return best;
}

function maxAttention(
  levels: readonly RuntimeExecutiveStageAttentionLevel[],
): RuntimeExecutiveStageAttentionLevel {
  let best: RuntimeExecutiveStageAttentionLevel = "normal";
  for (const level of levels) {
    if (attentionRank(level) > attentionRank(best)) best = level;
  }
  return best;
}

function sameOrderedIds(
  left: readonly string[] | undefined,
  right: readonly string[] | undefined,
): boolean {
  const a = left ?? [];
  const b = right ?? [];
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function sameMembership(
  left: readonly string[] | undefined,
  right: readonly string[] | undefined,
): boolean {
  const a = new Set(left ?? []);
  const b = right ?? [];
  if (a.size !== b.length) return false;
  return b.every((value) => a.has(value));
}

// ─── Disposition / composition resolvers ────────────────────────────────────

export function resolveRuntimeExecutiveStageObjectDisposition(input: {
  readonly subjectId: string;
  readonly focusRole: RuntimeExecutiveStageFocusRole;
  readonly selected: boolean;
  readonly attention: RuntimeExecutiveStageAttentionLevel;
  readonly stageVisible: boolean;
}): ReadonlyArray<RuntimeExecutiveStageObjectDisposition> {
  const dispositions: RuntimeExecutiveStageObjectDisposition[] = [];
  if (!input.stageVisible) {
    dispositions.push("suppressed");
    return Object.freeze(dispositions);
  }
  if (input.focusRole === "primary") dispositions.push("primary");
  if (input.focusRole === "secondary") dispositions.push("related");
  if (input.focusRole === "contextual") dispositions.push("contextual");
  if (input.selected) dispositions.push("selected");
  if (isAttentionBearing(input.attention)) {
    dispositions.push("attention-bearing");
  }
  if (
    input.focusRole === "background" ||
    input.focusRole === "unfocused"
  ) {
    dispositions.push("background");
  }
  if (dispositions.length === 0) dispositions.push("background");
  return Object.freeze(dispositions);
}

export function resolveRuntimeExecutiveStageFocusComposition(
  focusSelection: RuntimeExecutiveStageFocusSelectionResult,
): {
  readonly primaryFocusSubjectId?: string;
  readonly secondaryFocusSubjectIds: ReadonlyArray<string>;
  readonly contextualSubjectIds: ReadonlyArray<string>;
} {
  return Object.freeze({
    ...(focusSelection.resolvedPrimaryFocusSubjectId !== undefined
      ? { primaryFocusSubjectId: focusSelection.resolvedPrimaryFocusSubjectId }
      : {}),
    secondaryFocusSubjectIds: Object.freeze([
      ...focusSelection.orderedSupportingSubjectIds,
    ]),
    contextualSubjectIds: Object.freeze([
      ...focusSelection.orderedContextualSubjectIds,
    ]),
  });
}

export function resolveRuntimeExecutiveStageSelectionComposition(
  focusSelection: RuntimeExecutiveStageFocusSelectionResult,
): ReadonlyArray<string> {
  return Object.freeze(
    focusSelection.resolvedSelectedSubjectId !== undefined
      ? [focusSelection.resolvedSelectedSubjectId]
      : [],
  );
}

export function resolveRuntimeExecutiveStageAttentionComposition(
  attentionAssignments: ReadonlyArray<RuntimeExecutiveStageAttentionAssignment>,
): ReadonlyArray<string> {
  return Object.freeze(
    attentionAssignments
      .filter((assignment) => isAttentionBearing(assignment.attention))
      .map((assignment) => assignment.subjectId),
  );
}

export function resolveRuntimeExecutiveStageConnectionDisposition(input: {
  readonly sourceVisible: boolean;
  readonly targetVisible: boolean;
  readonly touchesPrimary: boolean;
  readonly touchesSelected: boolean;
  readonly touchesAttention: boolean;
}): RuntimeExecutiveStageConnectionDisposition {
  if (!input.sourceVisible && !input.targetVisible) return "suppressed";
  if (input.touchesPrimary || input.touchesAttention) return "emphasized";
  if (input.touchesSelected && input.sourceVisible && input.targetVisible) {
    return "visible";
  }
  if (input.sourceVisible && input.targetVisible) return "contextual";
  if (input.sourceVisible || input.targetVisible) return "de-emphasized";
  return "suppressed";
}

export function resolveRuntimeExecutiveStagePresentationStateComposition(
  presentationAssignments: ReadonlyArray<RuntimeExecutiveStagePresentationAssignment>,
  visibleSubjectIds: ReadonlyArray<string>,
): RuntimeExecutiveStagePresentationState {
  const visible = new Set(visibleSubjectIds);
  const states = presentationAssignments
    .filter((assignment) => visible.has(assignment.subjectId))
    .map((assignment) => assignment.presentationState);
  return maxPresentation(states);
}

export function resolveRuntimeExecutiveStageSceneTransitionComposition(input: {
  readonly previousPlan?: RuntimeExecutiveStageExperiencePlan;
  readonly currentSceneId: string;
  readonly currentRevision: string;
  readonly focusChanged: boolean;
  readonly selectionChanged: boolean;
  readonly attentionChanged: boolean;
  readonly presentationChanged: boolean;
  readonly connectionEmphasisChanged: boolean;
  readonly noiseReductionApplied: boolean;
}): RuntimeExecutiveStageSceneTransitionComposition {
  const intents: RuntimeExecutiveStageSceneTransitionIntent[] = [];
  const reasons: RuntimeExecutiveStageOrchestrationReason[] = [];

  if (input.previousPlan === undefined) {
    intents.push("initial-scene");
    reasons.push(
      freezeReason({
        kind: "scene-transition",
        detail: "initial Stage Experience Plan",
      }),
    );
  } else {
    if (input.previousPlan.sceneId !== input.currentSceneId) {
      intents.push("scene-replacement");
    }
    if (input.focusChanged) intents.push("focus-change");
    if (input.selectionChanged) intents.push("selection-change");
    if (input.attentionChanged) intents.push("attention-change");
    if (input.presentationChanged) intents.push("presentation-state-change");
    if (input.connectionEmphasisChanged) {
      intents.push("relationship-emphasis-change");
    }
    if (input.noiseReductionApplied) intents.push("noise-reduction");
    if (intents.length === 0) {
      intents.push("scene-restoration");
    }
    for (const intent of intents) {
      reasons.push(
        freezeReason({
          kind: "scene-transition",
          detail: intent,
        }),
      );
    }
  }

  return Object.freeze({
    intents: Object.freeze([...intents]),
    ...(input.previousPlan !== undefined
      ? {
          previousSceneId: input.previousPlan.sceneId,
          previousRevision: input.previousPlan.revision,
        }
      : {}),
    currentSceneId: input.currentSceneId,
    currentRevision: input.currentRevision,
    reasons: Object.freeze(reasons),
  });
}

// ─── Core orchestration ─────────────────────────────────────────────────────

export function createRuntimeExecutiveStageExperiencePlan(
  input: RuntimeExecutiveStageOrchestrationInput,
): RuntimeExecutiveStageExperiencePlan {
  if (!isNonEmptyString(input.planId)) {
    return Object.freeze({
      planId: "",
      status: "invalid" as const,
      sceneId: input.model.identity.sceneId,
      revision: input.model.revision,
      modelId: input.model.identity.modelId,
      secondaryFocusSubjectIds: Object.freeze([] as string[]),
      contextualSubjectIds: Object.freeze([] as string[]),
      selectedSubjectIds: Object.freeze([] as string[]),
      attentionSubjectIds: Object.freeze([] as string[]),
      visibleSubjectIds: Object.freeze([] as string[]),
      suppressedSubjectIds: Object.freeze([] as string[]),
      subjects: Object.freeze([] as RuntimeExecutiveStageSubjectExperience[]),
      connections: Object.freeze(
        [] as RuntimeExecutiveStageConnectionExperience[],
      ),
      emphasizedConnectionIds: Object.freeze([] as string[]),
      stagePresentationState: "minimum" as const,
      stageAttention: "normal" as const,
      sceneTransition: Object.freeze({
        intents: Object.freeze(["initial-scene"] as const),
        currentSceneId: input.model.identity.sceneId,
        currentRevision: input.model.revision,
        reasons: Object.freeze([
          freezeReason({
            kind: "invalid-input",
            detail: "planId must be a non-empty string",
          }),
        ]),
      }),
      reasons: Object.freeze([
        freezeReason({
          kind: "invalid-input",
          detail: "planId must be a non-empty string",
        }),
      ]),
      source: input.source,
      focusSelection: input.presentationAttention.focusSelection,
      presentationAttention: input.presentationAttention,
      orchestrationIdentity:
        runtimeExecutiveStageExperienceOrchestrationIdentity,
      orchestrationVersion: runtimeExecutiveStageExperienceOrchestrationVersion,
    });
  }

  const pa = input.presentationAttention;
  const paOk = verifyRuntimeExecutiveStagePresentationAttentionResult(pa).ok;
  if (!paOk || pa.status !== "accepted") {
    return Object.freeze({
      planId: input.planId,
      status: pa.status === "rejected" ? "rejected" : "invalid",
      sceneId: input.model.identity.sceneId,
      revision: input.model.revision,
      modelId: input.model.identity.modelId,
      secondaryFocusSubjectIds: Object.freeze([] as string[]),
      contextualSubjectIds: Object.freeze([] as string[]),
      selectedSubjectIds: Object.freeze([] as string[]),
      attentionSubjectIds: Object.freeze([] as string[]),
      visibleSubjectIds: Object.freeze([] as string[]),
      suppressedSubjectIds: Object.freeze(
        input.model.subjects.map((subject) => subject.subjectId),
      ),
      subjects: Object.freeze([] as RuntimeExecutiveStageSubjectExperience[]),
      connections: Object.freeze(
        [] as RuntimeExecutiveStageConnectionExperience[],
      ),
      emphasizedConnectionIds: Object.freeze([] as string[]),
      stagePresentationState: "minimum" as const,
      stageAttention: "normal" as const,
      sceneTransition: Object.freeze({
        intents: Object.freeze(["initial-scene"] as const),
        currentSceneId: input.model.identity.sceneId,
        currentRevision: input.model.revision,
        reasons: Object.freeze([
          freezeReason({
            kind: "invalid-input",
            detail: "presentation/attention result is not accepted",
          }),
        ]),
      }),
      reasons: Object.freeze([
        freezeReason({
          kind: "invalid-input",
          detail: "presentation/attention result is not accepted",
        }),
      ]),
      source: input.source,
      focusSelection: pa.focusSelection,
      presentationAttention: pa,
      orchestrationIdentity:
        runtimeExecutiveStageExperienceOrchestrationIdentity,
      orchestrationVersion: runtimeExecutiveStageExperienceOrchestrationVersion,
    });
  }

  const focusSelection = pa.focusSelection;
  const focusComposition =
    resolveRuntimeExecutiveStageFocusComposition(focusSelection);
  const selectedSubjectIds =
    resolveRuntimeExecutiveStageSelectionComposition(focusSelection);
  const attentionSubjectIds = resolveRuntimeExecutiveStageAttentionComposition(
    pa.attentionAssignments,
  );

  const presentationById = new Map(
    pa.presentationAssignments.map((assignment) => [
      assignment.subjectId,
      assignment,
    ]),
  );
  const attentionById = new Map(
    pa.attentionAssignments.map((assignment) => [
      assignment.subjectId,
      assignment,
    ]),
  );
  const focusRoleById = new Map(
    focusSelection.assignments.map((assignment) => [
      assignment.subjectId,
      assignment.focusRole,
    ]),
  );

  const enableNoiseReduction = input.enableNoiseReduction !== false;
  const primaryId = focusComposition.primaryFocusSubjectId;
  const selectedSet = new Set(selectedSubjectIds);
  const attentionSet = new Set(attentionSubjectIds);
  const supportingSet = new Set(focusComposition.secondaryFocusSubjectIds);
  const contextualSet = new Set(focusComposition.contextualSubjectIds);

  const subjectExperiences: RuntimeExecutiveStageSubjectExperience[] = [];
  const visibleSubjectIds: string[] = [];
  const suppressedSubjectIds: string[] = [];
  const planReasons: RuntimeExecutiveStageOrchestrationReason[] = [];

  for (const subject of input.model.subjects) {
    const focusRole =
      focusRoleById.get(subject.subjectId) ?? subject.focusRole;
    const selected = selectedSet.has(subject.subjectId);
    const presentation =
      presentationById.get(subject.subjectId)?.presentationState ??
      subject.presentationState;
    const attention =
      attentionById.get(subject.subjectId)?.attention ?? subject.attention;

    const keepForFocus =
      focusRole === "primary" ||
      focusRole === "secondary" ||
      focusRole === "contextual";
    const keepForSelection = selected;
    const keepForAttention = isAttentionBearing(attention);
    const stageVisible =
      !enableNoiseReduction ||
      keepForFocus ||
      keepForSelection ||
      keepForAttention;

    const dispositions = resolveRuntimeExecutiveStageObjectDisposition({
      subjectId: subject.subjectId,
      focusRole,
      selected,
      attention,
      stageVisible,
    });

    const reasons: RuntimeExecutiveStageOrchestrationReason[] = [];
    if (focusRole === "primary") {
      reasons.push(
        freezeReason({
          kind: "primary-focus",
          subjectId: subject.subjectId,
        }),
      );
    } else if (focusRole === "secondary") {
      reasons.push(
        freezeReason({
          kind: "secondary-focus",
          subjectId: subject.subjectId,
        }),
      );
    } else if (focusRole === "contextual") {
      reasons.push(
        freezeReason({
          kind: "contextual-focus",
          subjectId: subject.subjectId,
        }),
      );
    }
    if (selected) {
      reasons.push(
        freezeReason({
          kind: "explicit-selection",
          subjectId: subject.subjectId,
        }),
      );
    }
    if (keepForAttention) {
      reasons.push(
        freezeReason({
          kind: "attention-required",
          subjectId: subject.subjectId,
        }),
      );
    }
    if (!stageVisible) {
      reasons.push(
        freezeReason({
          kind: "noise-reduction",
          subjectId: subject.subjectId,
        }),
      );
    }
    reasons.push(
      freezeReason({
        kind: "presentation-state-required",
        subjectId: subject.subjectId,
        detail: presentation,
      }),
    );

    if (stageVisible) {
      visibleSubjectIds.push(subject.subjectId);
    } else {
      suppressedSubjectIds.push(subject.subjectId);
    }

    subjectExperiences.push(
      Object.freeze({
        subjectId: subject.subjectId,
        kind: subject.kind,
        dispositions,
        focusRole,
        selected,
        presentationState: presentation,
        attention,
        visibility: subject.visibility,
        stageVisible,
        orderIndex: subject.orderIndex,
        reasons: Object.freeze(reasons),
      }),
    );

    planReasons.push(...reasons);
  }

  const visibleSet = new Set(visibleSubjectIds);
  const connectionExperiences: RuntimeExecutiveStageConnectionExperience[] = [];
  const emphasizedConnectionIds: string[] = [];

  for (const connection of input.model.connections) {
    const sourceVisible = visibleSet.has(connection.sourceSubjectId);
    const targetVisible = visibleSet.has(connection.targetSubjectId);
    const touchesPrimary =
      primaryId !== undefined &&
      (connection.sourceSubjectId === primaryId ||
        connection.targetSubjectId === primaryId);
    const touchesSelected =
      selectedSet.has(connection.sourceSubjectId) ||
      selectedSet.has(connection.targetSubjectId);
    const touchesAttention =
      attentionSet.has(connection.sourceSubjectId) ||
      attentionSet.has(connection.targetSubjectId);
    const touchesSupporting =
      supportingSet.has(connection.sourceSubjectId) ||
      supportingSet.has(connection.targetSubjectId) ||
      contextualSet.has(connection.sourceSubjectId) ||
      contextualSet.has(connection.targetSubjectId);

    const disposition = resolveRuntimeExecutiveStageConnectionDisposition({
      sourceVisible,
      targetVisible,
      touchesPrimary: touchesPrimary || touchesSupporting,
      touchesSelected,
      touchesAttention,
    });

    const reasons: RuntimeExecutiveStageOrchestrationReason[] = [];
    if (disposition === "emphasized") {
      reasons.push(
        freezeReason({
          kind: "connection-relevant",
          connectionId: connection.connectionId,
          detail: "emphasized around focus/attention path",
        }),
      );
      emphasizedConnectionIds.push(connection.connectionId);
    } else if (disposition === "suppressed") {
      reasons.push(
        freezeReason({
          kind: "noise-reduction",
          connectionId: connection.connectionId,
        }),
      );
    } else {
      reasons.push(
        freezeReason({
          kind: "related-to-focus",
          connectionId: connection.connectionId,
        }),
      );
    }

    connectionExperiences.push(
      Object.freeze({
        connectionId: connection.connectionId,
        sourceSubjectId: connection.sourceSubjectId,
        targetSubjectId: connection.targetSubjectId,
        kind: connection.kind,
        direction: connection.direction,
        disposition,
        emphasized: disposition === "emphasized",
        orderIndex: connection.orderIndex,
        reasons: Object.freeze(reasons),
      }),
    );
    planReasons.push(...reasons);
  }

  const stagePresentationState =
    resolveRuntimeExecutiveStagePresentationStateComposition(
      pa.presentationAssignments,
      visibleSubjectIds,
    );
  const stageAttention = maxAttention(
    pa.attentionAssignments
      .filter((assignment) => visibleSet.has(assignment.subjectId))
      .map((assignment) => assignment.attention),
  );

  const previous = input.previousPlan;
  const focusChanged =
    previous === undefined
      ? true
      : previous.primaryFocusSubjectId !== primaryId ||
        !sameOrderedIds(
          previous.secondaryFocusSubjectIds,
          focusComposition.secondaryFocusSubjectIds,
        );
  const selectionChanged =
    previous === undefined
      ? selectedSubjectIds.length > 0
      : !sameOrderedIds(previous.selectedSubjectIds, selectedSubjectIds);
  const attentionChanged =
    previous === undefined
      ? attentionSubjectIds.length > 0
      : !sameMembership(previous.attentionSubjectIds, attentionSubjectIds);
  const presentationChanged =
    previous === undefined
      ? true
      : previous.stagePresentationState !== stagePresentationState ||
        previous.subjects.some((subject) => {
          const current = subjectExperiences.find(
            (entry) => entry.subjectId === subject.subjectId,
          );
          return (
            current !== undefined &&
            current.presentationState !== subject.presentationState
          );
        });
  const connectionEmphasisChanged =
    previous === undefined
      ? emphasizedConnectionIds.length > 0
      : !sameMembership(
          previous.emphasizedConnectionIds,
          emphasizedConnectionIds,
        );
  const noiseReductionApplied = suppressedSubjectIds.length > 0;

  const sceneTransition = resolveRuntimeExecutiveStageSceneTransitionComposition(
    {
      previousPlan: previous,
      currentSceneId: input.model.identity.sceneId,
      currentRevision: input.model.revision,
      focusChanged,
      selectionChanged,
      attentionChanged,
      presentationChanged,
      connectionEmphasisChanged,
      noiseReductionApplied,
    },
  );

  planReasons.push(
    freezeReason({
      kind: "scene-required",
      detail: input.model.identity.sceneId,
    }),
  );
  if (input.interactionReason !== undefined) {
    planReasons.push(
      freezeReason({
        kind: "context-preserved",
        detail: input.interactionReason,
      }),
    );
  }

  return Object.freeze({
    planId: input.planId,
    status: "accepted" as const,
    sceneId: input.model.identity.sceneId,
    revision: input.model.revision,
    modelId: input.model.identity.modelId,
    ...(primaryId !== undefined ? { primaryFocusSubjectId: primaryId } : {}),
    secondaryFocusSubjectIds: focusComposition.secondaryFocusSubjectIds,
    contextualSubjectIds: focusComposition.contextualSubjectIds,
    selectedSubjectIds,
    attentionSubjectIds,
    visibleSubjectIds: Object.freeze([...visibleSubjectIds]),
    suppressedSubjectIds: Object.freeze([...suppressedSubjectIds]),
    subjects: Object.freeze(subjectExperiences),
    connections: Object.freeze(connectionExperiences),
    emphasizedConnectionIds: Object.freeze([...emphasizedConnectionIds]),
    stagePresentationState,
    stageAttention,
    sceneTransition,
    reasons: Object.freeze(planReasons),
    source: input.source,
    focusSelection,
    presentationAttention: pa,
    orchestrationIdentity:
      runtimeExecutiveStageExperienceOrchestrationIdentity,
    orchestrationVersion: runtimeExecutiveStageExperienceOrchestrationVersion,
  });
}

export function resolveRuntimeExecutiveStageExperiencePlan(input: {
  readonly planId: string;
  readonly model: RuntimeExecutiveStageModel;
  readonly selectionSubjectId: string;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly focusRequest?: { readonly primaryFocusSubjectId: string };
  readonly previousPlan?: RuntimeExecutiveStageExperiencePlan;
  readonly enableNoiseReduction?: boolean;
  readonly interactionReason?: string;
}): RuntimeExecutiveStageExperiencePlan {
  const presentationAttention =
    resolveRuntimeExecutiveStagePresentationAttentionFromSelection({
      model: input.model,
      selectionSubjectId: input.selectionSubjectId,
      source: input.source,
      ...(input.focusRequest !== undefined
        ? { focusRequest: input.focusRequest }
        : {}),
    });

  const modelForPlan =
    presentationAttention.status === "accepted"
      ? projectRuntimeExecutiveStagePresentationAttention(
          input.model,
          presentationAttention,
          { source: input.source },
        )
      : input.model;

  return createRuntimeExecutiveStageExperiencePlan({
    planId: input.planId,
    model: modelForPlan,
    presentationAttention,
    previousPlan: input.previousPlan,
    source: input.source,
    enableNoiseReduction: input.enableNoiseReduction,
    interactionReason: input.interactionReason,
  });
}

export function compareRuntimeExecutiveStageExperiencePlans(
  left: RuntimeExecutiveStageExperiencePlan,
  right: RuntimeExecutiveStageExperiencePlan,
): RuntimeExecutiveStageExperienceComparison {
  const focusChanged =
    left.primaryFocusSubjectId !== right.primaryFocusSubjectId ||
    !sameOrderedIds(
      left.secondaryFocusSubjectIds,
      right.secondaryFocusSubjectIds,
    );
  const selectionChanged = !sameOrderedIds(
    left.selectedSubjectIds,
    right.selectedSubjectIds,
  );
  const attentionChanged = !sameMembership(
    left.attentionSubjectIds,
    right.attentionSubjectIds,
  );
  const presentationChanged =
    left.stagePresentationState !== right.stagePresentationState ||
    left.subjects.some((subject) => {
      const other = right.subjects.find(
        (entry) => entry.subjectId === subject.subjectId,
      );
      return (
        other !== undefined &&
        other.presentationState !== subject.presentationState
      );
    });
  const visibilityChanged = !sameOrderedIds(
    left.visibleSubjectIds,
    right.visibleSubjectIds,
  );
  const connectionEmphasisChanged = !sameMembership(
    left.emphasizedConnectionIds,
    right.emphasizedConnectionIds,
  );
  const sceneChanged = left.sceneId !== right.sceneId;
  const revisionChanged = left.revision !== right.revision;

  const transitionIntents: RuntimeExecutiveStageSceneTransitionIntent[] = [];
  if (sceneChanged) transitionIntents.push("scene-replacement");
  if (focusChanged) transitionIntents.push("focus-change");
  if (selectionChanged) transitionIntents.push("selection-change");
  if (attentionChanged) transitionIntents.push("attention-change");
  if (presentationChanged) transitionIntents.push("presentation-state-change");
  if (connectionEmphasisChanged) {
    transitionIntents.push("relationship-emphasis-change");
  }
  if (
    !sameMembership(left.suppressedSubjectIds, right.suppressedSubjectIds)
  ) {
    transitionIntents.push("noise-reduction");
  }

  const identical =
    !focusChanged &&
    !selectionChanged &&
    !attentionChanged &&
    !presentationChanged &&
    !visibilityChanged &&
    !connectionEmphasisChanged &&
    !sceneChanged &&
    !revisionChanged;

  return Object.freeze({
    identical,
    focusChanged,
    selectionChanged,
    attentionChanged,
    presentationChanged,
    visibilityChanged,
    connectionEmphasisChanged,
    sceneChanged,
    revisionChanged,
    leftPlanId: left.planId,
    rightPlanId: right.planId,
    transitionIntents: Object.freeze(transitionIntents),
  });
}

export function verifyRuntimeExecutiveStageExperiencePlan(
  plan: RuntimeExecutiveStageExperiencePlan,
): {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<string>;
} {
  const issues: string[] = [];

  if (
    !(
      RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_STATUSES as readonly string[]
    ).includes(plan.status)
  ) {
    issues.push("invalid-status");
  }

  if (plan.status === "accepted") {
    if (!isNonEmptyString(plan.planId)) issues.push("missing-plan-id");
    if (!isNonEmptyString(plan.sceneId)) issues.push("missing-scene-id");

    const subjectIds = plan.subjects.map((subject) => subject.subjectId);
    if (new Set(subjectIds).size !== subjectIds.length) {
      issues.push("duplicate-subjects");
    }

    const orderOk = plan.subjects.every(
      (subject, index) => subject.orderIndex === index,
    );
    if (!orderOk) issues.push("non-deterministic-subject-order");

    const connectionOrderOk = plan.connections.every(
      (connection, index) => connection.orderIndex === index,
    );
    if (!connectionOrderOk) issues.push("non-deterministic-connection-order");

    for (const subject of plan.subjects) {
      if (
        !(
          RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_PRESENTATION_STATES as readonly string[]
        ).includes(subject.presentationState)
      ) {
        issues.push(`invalid-presentation:${subject.subjectId}`);
      }
      if (
        !(
          RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_ATTENTION_LEVELS as readonly string[]
        ).includes(subject.attention)
      ) {
        issues.push(`invalid-attention:${subject.subjectId}`);
      }
    }

    // Focus ≠ selection (dimensions must both be represented independently)
    if (
      plan.primaryFocusSubjectId !== undefined &&
      plan.selectedSubjectIds.length === 1 &&
      plan.primaryFocusSubjectId !== plan.selectedSubjectIds[0] &&
      !plan.subjects.some(
        (subject) =>
          subject.subjectId === plan.selectedSubjectIds[0] && subject.selected,
      )
    ) {
      issues.push("selection-lost");
    }
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function getRuntimeExecutiveStageExperienceOrchestrationIdentity():
  typeof runtimeExecutiveStageExperienceOrchestrationCanonicalIdentity {
  return runtimeExecutiveStageExperienceOrchestrationCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveStageExperienceOrchestrationApiNames =
  Object.freeze([
    "createRuntimeExecutiveStageExperiencePlan",
    "resolveRuntimeExecutiveStageExperiencePlan",
    "resolveRuntimeExecutiveStageObjectDisposition",
    "resolveRuntimeExecutiveStageFocusComposition",
    "resolveRuntimeExecutiveStageSelectionComposition",
    "resolveRuntimeExecutiveStageAttentionComposition",
    "resolveRuntimeExecutiveStageConnectionDisposition",
    "resolveRuntimeExecutiveStagePresentationStateComposition",
    "resolveRuntimeExecutiveStageSceneTransitionComposition",
    "compareRuntimeExecutiveStageExperiencePlans",
    "verifyRuntimeExecutiveStageExperiencePlan",
    "verifyRuntimeExecutiveStageExperienceOrchestration",
    "getRuntimeExecutiveStageExperienceOrchestrationIdentity",
  ] as const);

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_REGISTRY =
  Object.freeze({
    identity: runtimeExecutiveStageExperienceOrchestrationIdentity,
    version: runtimeExecutiveStageExperienceOrchestrationVersion,
    namespace: runtimeExecutiveStageExperienceOrchestrationNamespace,
    layer: runtimeExecutiveStageExperienceOrchestrationLayer,
    domain: runtimeExecutiveStageExperienceOrchestrationDomain,
    phase: runtimeExecutiveStageExperienceOrchestrationPhase,
    consumerRole: runtimeExecutiveStageExperienceOrchestrationConsumerRole,
    immediateDependency:
      runtimeExecutiveStageExperienceOrchestrationDependencyIdentity,
    dependencyPath:
      runtimeExecutiveStageExperienceOrchestrationDependencyPath,
    sections:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_REGISTRY_SECTIONS,
    sectionCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_REGISTRY_SECTIONS.length,
    capabilities: RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_CAPABILITIES,
    capabilityCount: RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_CAPABILITIES.length,
    objectDispositions: RUNTIME_EXECUTIVE_STAGE_OBJECT_DISPOSITIONS,
    objectDispositionCount: RUNTIME_EXECUTIVE_STAGE_OBJECT_DISPOSITIONS.length,
    connectionDispositions: RUNTIME_EXECUTIVE_STAGE_CONNECTION_DISPOSITIONS,
    connectionDispositionCount:
      RUNTIME_EXECUTIVE_STAGE_CONNECTION_DISPOSITIONS.length,
    sceneTransitionIntents: RUNTIME_EXECUTIVE_STAGE_SCENE_TRANSITION_INTENTS,
    sceneTransitionIntentCount:
      RUNTIME_EXECUTIVE_STAGE_SCENE_TRANSITION_INTENTS.length,
    reasonKinds: RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_REASON_KINDS,
    reasonKindCount: RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_REASON_KINDS.length,
    precedence: RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_PRECEDENCE,
    presentationStates:
      RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_PRESENTATION_STATES,
    attentionLevels: RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_ATTENTION_LEVELS,
    publicTypeNames:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveStageExperienceOrchestrationApiNames,
    publicApiCount:
      runtimeExecutiveStageExperienceOrchestrationApiNames.length,
    invariants: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_INVARIANTS,
    invariantCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_INVARIANTS.length,
  });

export const runtimeExecutiveStageExperienceOrchestration = Object.freeze({
  phase: "Orchestration" as const,
  name: "RuntimeExecutiveStageExperienceOrchestration" as const,
  identity: runtimeExecutiveStageExperienceOrchestrationIdentity,
  version: runtimeExecutiveStageExperienceOrchestrationVersion,
  namespace: runtimeExecutiveStageExperienceOrchestrationNamespace,
  layer: runtimeExecutiveStageExperienceOrchestrationLayer,
  domain: runtimeExecutiveStageExperienceOrchestrationDomain,
  architecturalRole:
    runtimeExecutiveStageExperienceOrchestrationArchitecturalRole,
  consumerRole: runtimeExecutiveStageExperienceOrchestrationConsumerRole,
  role: "Orchestration" as const,
  status: runtimeExecutiveStageExperienceOrchestrationStability,
  upstreamDependency:
    runtimeExecutiveStageExperienceOrchestrationDependencyIdentity,
  dependencyPath:
    runtimeExecutiveStageExperienceOrchestrationDependencyPath,
  deterministic: runtimeExecutiveStageExperienceOrchestrationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_BOUNDARY,
  capabilities: RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_CAPABILITIES,
  objectDispositions: RUNTIME_EXECUTIVE_STAGE_OBJECT_DISPOSITIONS,
  connectionDispositions: RUNTIME_EXECUTIVE_STAGE_CONNECTION_DISPOSITIONS,
  sceneTransitionIntents: RUNTIME_EXECUTIVE_STAGE_SCENE_TRANSITION_INTENTS,
  reasonKinds: RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_REASON_KINDS,
  precedence: RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_PRECEDENCE,
  presentationStates:
    RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_PRESENTATION_STATES,
  attentionLevels: RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_ATTENTION_LEVELS,
  invariants: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_FORBIDDEN,
  publicTypeNames:
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveStageExperienceOrchestrationApiNames,
  registry: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_REGISTRY,
  presentationAttentionBoundary: "REX-2:5-presentation-attention-only" as const,
  architecturalStatus:
    "REX-2:6 Runtime Executive Stage Experience Orchestration Complete — Ready for REX-2:7" as const,
});

export interface RuntimeExecutiveStageExperienceOrchestrationVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveStageExperienceOrchestrationIdentity;
  readonly version: typeof runtimeExecutiveStageExperienceOrchestrationVersion;
  readonly namespace: typeof runtimeExecutiveStageExperienceOrchestrationNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveStageExperienceOrchestrationDependencyIdentity;
  readonly consumerRole: typeof runtimeExecutiveStageExperienceOrchestrationConsumerRole;
  readonly capabilityCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly reasonKindCount: number;
  readonly frozen: boolean;
  readonly presentationAttentionBoundaryIntact: boolean;
  readonly rendererIndependent: boolean;
  readonly orchestrationOnly: boolean;
}

export function verifyRuntimeExecutiveStageExperienceOrchestration():
  RuntimeExecutiveStageExperienceOrchestrationVerification {
  const registry = RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_REGISTRY;
  const frozen =
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_OBJECT_DISPOSITIONS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_CAPABILITIES) &&
    Object.isFrozen(
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_INVARIANTS,
    ) &&
    Object.isFrozen(
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_REGISTRY,
    ) &&
    Object.isFrozen(runtimeExecutiveStageExperienceOrchestration);

  const presentationAttentionBoundaryIntact =
    runtimeExecutiveStageExperienceOrchestrationDependencyIdentity ===
      runtimeExecutiveStagePresentationAttentionIdentity &&
    runtimeExecutiveStageExperienceOrchestrationDependencyPath ===
      "@/app/lib/rex/runtimeExecutiveStagePresentationAttention" &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_BOUNDARY
      .consumesPresentationAttentionOnly === true &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_BOUNDARY
      .importsRex24Directly === false &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_BOUNDARY
      .importsRex23Directly === false;

  const countsAligned =
    registry.capabilityCount ===
      RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_CAPABILITIES.length &&
    registry.publicTypeCount ===
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_PUBLIC_TYPE_NAMES
        .length &&
    registry.publicApiCount ===
      runtimeExecutiveStageExperienceOrchestrationApiNames.length &&
    registry.invariantCount ===
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_INVARIANTS.length &&
    registry.reasonKindCount ===
      RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_REASON_KINDS.length;

  const invariantsOrdered =
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_INVARIANTS.length === 23 &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    );

  const orchestrationOnly =
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_BOUNDARY.rendersUi ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_BOUNDARY
      .executesAnimation === false &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_BOUNDARY.calculatesKpi ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_BOUNDARY.calculatesKoi ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_BOUNDARY
      .inventsExecutiveMeaning === false;

  const ok =
    frozen &&
    presentationAttentionBoundaryIntact &&
    countsAligned &&
    invariantsOrdered &&
    orchestrationOnly &&
    runtimeExecutiveStageExperienceOrchestrationIdentity ===
      "REX-2:6/RuntimeExecutiveStageExperienceOrchestration" &&
    runtimeExecutiveStageExperienceOrchestrationVersion === "2.6.0" &&
    runtimeExecutiveStageExperienceOrchestrationNamespace ===
      "nexora.rex.stage-experience.orchestration";

  return Object.freeze({
    ok,
    identity: runtimeExecutiveStageExperienceOrchestrationIdentity,
    version: runtimeExecutiveStageExperienceOrchestrationVersion,
    namespace: runtimeExecutiveStageExperienceOrchestrationNamespace,
    dependencyIdentity:
      runtimeExecutiveStageExperienceOrchestrationDependencyIdentity,
    consumerRole: runtimeExecutiveStageExperienceOrchestrationConsumerRole,
    capabilityCount: RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_CAPABILITIES.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeExecutiveStageExperienceOrchestrationApiNames.length,
    invariantCount:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_INVARIANTS.length,
    reasonKindCount: RUNTIME_EXECUTIVE_STAGE_ORCHESTRATION_REASON_KINDS.length,
    frozen,
    presentationAttentionBoundaryIntact,
    rendererIndependent:
      RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_ORCHESTRATION_BOUNDARY
        .rendererIndependent,
    orchestrationOnly,
  });
}
