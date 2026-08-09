/**
 * REX-2:4 — Runtime Executive Stage Focus & Selection.
 *
 * Pure deterministic resolution of Stage selection and focus roles around
 * executive intent. Renderer-neutral — no presentation, attention, scene
 * orchestration, layout, or UI interaction handling.
 *
 * Canonical flow:
 *   REX-2:3 Stage Model → REX-2:4 Focus & Selection → REX-2:5 Presentation & Attention
 *
 * REX-2:3 answers: What does the complete Executive Stage look like semantically now?
 * REX-2:4 answers: What is the executive looking at, and what is semantically relevant around it?
 */

import {
  RUNTIME_EXECUTIVE_STAGE_MODEL_ATTENTION_LEVELS,
  RUNTIME_EXECUTIVE_STAGE_MODEL_CONNECTION_KINDS,
  RUNTIME_EXECUTIVE_STAGE_MODEL_FOCUS_ROLES,
  RUNTIME_EXECUTIVE_STAGE_MODEL_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_STAGE_MODEL_SUBJECT_KINDS,
  createRuntimeExecutiveStageModel,
  getRuntimeExecutiveStageConnectionsForSubject,
  getRuntimeExecutiveStageNeighborhood,
  getRuntimeExecutiveStagePrimaryFocus,
  getRuntimeExecutiveStageSelectedSubject,
  getRuntimeExecutiveStageSubjectById,
  getRuntimeExecutiveStageSubjectIndex,
  runtimeExecutiveStageModelIdentity,
  runtimeExecutiveStageModelVersion,
  verifyRuntimeExecutiveStageModelConsistency,
  type RuntimeExecutiveStageAttentionLevel,
  type RuntimeExecutiveStageConnectionKind,
  type RuntimeExecutiveStageFocusRole,
  type RuntimeExecutiveStageModel,
  type RuntimeExecutiveStageModelConsistencyResult,
  type RuntimeExecutiveStagePresentationState,
  type RuntimeExecutiveStageScene,
  type RuntimeExecutiveStageSelectionModel,
  type RuntimeExecutiveStageSubject,
  type RuntimeExecutiveStageSubjectKind,
  type RuntimeExecutiveStageSubjectModel,
} from "@/app/lib/rex/runtimeExecutiveStageModel";

// ─── Transitively published Stage Model surface (for REX-2:5+) ───────────────
// Publication fix: REX-2:5 must consume Model construction/vocabularies only
// through REX-2:4 without importing REX-2:3 directly.

export {
  createRuntimeExecutiveStageModel,
  getRuntimeExecutiveStageSubjectById,
  verifyRuntimeExecutiveStageModelConsistency,
};

export const RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_STAGE_MODEL_PRESENTATION_STATES;
export const RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_ATTENTION_LEVELS =
  RUNTIME_EXECUTIVE_STAGE_MODEL_ATTENTION_LEVELS;
export const RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_SUBJECT_KINDS =
  RUNTIME_EXECUTIVE_STAGE_MODEL_SUBJECT_KINDS;

export type {
  RuntimeExecutiveStageAttentionLevel,
  RuntimeExecutiveStageFocusRole,
  RuntimeExecutiveStageModel,
  RuntimeExecutiveStageModelConsistencyResult,
  RuntimeExecutiveStagePresentationState,
  RuntimeExecutiveStageScene,
  RuntimeExecutiveStageSubject,
  RuntimeExecutiveStageSubjectKind,
  RuntimeExecutiveStageSubjectModel,
};

// ─── Transitively published request provenance shapes ───────────────────────

export type RuntimeExecutiveStageFocusSelectionSource = NonNullable<
  RuntimeExecutiveStageSelectionModel["source"]
>;

export type RuntimeExecutiveStageFocusSelectionRequestReason = NonNullable<
  RuntimeExecutiveStageSelectionModel["reason"]
>;

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveStageFocusSelectionIdentity =
  "REX-2:4/RuntimeExecutiveStageFocusSelection" as const;

export const runtimeExecutiveStageFocusSelectionVersion = "2.4.0" as const;

export const runtimeExecutiveStageFocusSelectionNamespace =
  "nexora.rex.stage.focus-selection" as const;

export const runtimeExecutiveStageFocusSelectionLayer =
  "RuntimeExecutiveExperience" as const;

export const runtimeExecutiveStageFocusSelectionDomain =
  "ExecutiveStage" as const;

export const runtimeExecutiveStageFocusSelectionPhase =
  "FocusSelection" as const;

export const runtimeExecutiveStageFocusSelectionArchitecturalRole =
  "RuntimeExecutiveStageFocusSelectionBoundary" as const;

export const runtimeExecutiveStageFocusSelectionConsumerRole =
  "InternalRuntimeResolver" as const;

export const runtimeExecutiveStageFocusSelectionDependencyIdentity =
  runtimeExecutiveStageModelIdentity;

export const runtimeExecutiveStageFocusSelectionDependencyPath =
  "@/app/lib/rex/runtimeExecutiveStageModel" as const;

export const runtimeExecutiveStageFocusSelectionStability =
  "FocusSelectionReady" as const;

export const runtimeExecutiveStageFocusSelectionDeterministic = true as const;

export const runtimeExecutiveStageFocusSelectionSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveStageFocusSelectionMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveStageFocusSelectionCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveStageFocusSelectionIdentity,
    version: runtimeExecutiveStageFocusSelectionVersion,
    namespace: runtimeExecutiveStageFocusSelectionNamespace,
    layer: runtimeExecutiveStageFocusSelectionLayer,
    domain: runtimeExecutiveStageFocusSelectionDomain,
    phase: runtimeExecutiveStageFocusSelectionPhase,
    architecturalRole:
      runtimeExecutiveStageFocusSelectionArchitecturalRole,
    consumerRole: runtimeExecutiveStageFocusSelectionConsumerRole,
    dependencyIdentity:
      runtimeExecutiveStageFocusSelectionDependencyIdentity,
    dependencyPath: runtimeExecutiveStageFocusSelectionDependencyPath,
    upstreamVersion: runtimeExecutiveStageModelVersion,
    stabilityStatus: runtimeExecutiveStageFocusSelectionStability,
    deterministicStatus:
      runtimeExecutiveStageFocusSelectionDeterministic,
    sideEffectPolicy:
      runtimeExecutiveStageFocusSelectionSideEffectPolicy,
    mutationPolicy: runtimeExecutiveStageFocusSelectionMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_PRINCIPLE =
  "Focus & Selection resolve what the executive is looking at and what is semantically relevant around that intent. They do not resolve presentation, attention, scene membership, or rendering." as const;

export const RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-enabled-Executive-Experience" as const,
  focusSelectionAuthority: "REX-2:4" as const,
  architecturalRole:
    "RuntimeExecutiveStageFocusSelectionBoundary" as const,
  consumerRole: "InternalRuntimeResolver" as const,
  soleImmediateDependency: "REX-2:3/RuntimeExecutiveStageModel" as const,
  consumesStageModelOnly: true as const,
  importsRex22Directly: false as const,
  importsRex21Directly: false as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  mutatesInputModel: false as const,
  resolvesPresentation: false as const,
  resolvesAttention: false as const,
  resolvesVisibility: false as const,
  orchestratesScene: false as const,
  createsUiHandlers: false as const,
});

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_FOCUS_ROLES =
  RUNTIME_EXECUTIVE_STAGE_MODEL_FOCUS_ROLES;

export const RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_CONNECTION_KINDS =
  RUNTIME_EXECUTIVE_STAGE_MODEL_CONNECTION_KINDS;

export const RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_STATUSES = Object.freeze([
  "accepted",
  "rejected",
  "invalid",
] as const);

export type RuntimeExecutiveStageFocusSelectionStatus =
  (typeof RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_STAGE_SELECTION_RESOLUTION_KINDS = Object.freeze([
  "select",
  "clear",
  "preserve",
] as const);

export type RuntimeExecutiveStageSelectionResolutionKind =
  (typeof RUNTIME_EXECUTIVE_STAGE_SELECTION_RESOLUTION_KINDS)[number];

export const RUNTIME_EXECUTIVE_STAGE_FOCUS_REASON_KINDS = Object.freeze([
  "explicit-focus",
  "selected-subject",
  "direct-relationship",
  "kpi-relationship",
  "koi-relationship",
  "dependency",
  "influence",
  "flow",
  "impact",
  "execution",
  "hierarchy",
  "contextual",
  "preserved-existing-focus",
  "selection-cleared",
  "selection-preserved",
  "invalid-target",
  "background",
] as const);

export type RuntimeExecutiveStageFocusReasonKind =
  (typeof RUNTIME_EXECUTIVE_STAGE_FOCUS_REASON_KINDS)[number];

/**
 * Canonical connection-kind priority for supporting/contextual ranking.
 * Lower score = higher priority. Ties preserve Stage subject order.
 *
 * 1. kpi/koi relationships
 * 2. dependency / influence / flow
 * 3. impact / execution / hierarchy
 * 4. contextual
 */
export const RUNTIME_EXECUTIVE_STAGE_FOCUS_CONNECTION_PRIORITY = Object.freeze({
  "kpi-relationship": 1,
  "koi-relationship": 1,
  dependency: 2,
  influence: 2,
  flow: 2,
  impact: 3,
  execution: 3,
  hierarchy: 3,
  contextual: 4,
} as const satisfies Record<RuntimeExecutiveStageConnectionKind, number>);

export const RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_CAPABILITIES =
  Object.freeze([
    "selection-resolution",
    "selection-clear",
    "selection-preservation",
    "primary-focus-resolution",
    "supporting-focus-resolution",
    "contextual-focus-resolution",
    "background-focus-resolution",
    "semantic-neighborhood-focus",
    "explicit-focus-override",
    "focus-explainability",
    "focus-selection-projection",
    "structural-verification",
  ] as const);

export type RuntimeExecutiveStageFocusSelectionCapability =
  (typeof RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_CAPABILITIES)[number];

// ─── Policy ─────────────────────────────────────────────────────────────────

export interface RuntimeExecutiveStageFocusPolicy {
  readonly selectionSuggestsPrimaryFocus: boolean;
  readonly maxSupportingFocus: number;
  readonly maxContextualFocus: number;
  readonly relationshipDepth: 0 | 1 | 2;
  /**
   * Only direct neighbors whose best connection priority is <= this value
   * may become supporting focus. Lower priority neighbors become contextual.
   * Default 2 admits kpi/koi/dependency/influence/flow; impact+ stay contextual.
   */
  readonly maxSupportingConnectionPriority: number;
  readonly acceptedRelationshipKinds: ReadonlyArray<RuntimeExecutiveStageConnectionKind>;
  readonly explicitFocusOverridesSelectionDerived: boolean;
  readonly hiddenSubjectsSelectable: boolean;
  readonly hiddenSubjectsFocusEligible: boolean;
  readonly collapsedSubjectsFocusEligible: boolean;
  readonly preserveFocusWhenNoFocusInput: boolean;
  readonly selectionCreatesFocus: boolean;
}

export const DEFAULT_RUNTIME_EXECUTIVE_STAGE_FOCUS_POLICY = Object.freeze({
  selectionSuggestsPrimaryFocus: true,
  maxSupportingFocus: 2,
  maxContextualFocus: 3,
  relationshipDepth: 2,
  maxSupportingConnectionPriority: 2,
  acceptedRelationshipKinds: RUNTIME_EXECUTIVE_STAGE_MODEL_CONNECTION_KINDS,
  explicitFocusOverridesSelectionDerived: true,
  hiddenSubjectsSelectable: false,
  hiddenSubjectsFocusEligible: false,
  collapsedSubjectsFocusEligible: true,
  preserveFocusWhenNoFocusInput: true,
  /** Default favors separation: focus does not create selection. */
  selectionCreatesFocus: false,
}) satisfies RuntimeExecutiveStageFocusPolicy;

// ─── Public types ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveStageFocusReason {
  readonly kind: RuntimeExecutiveStageFocusReasonKind;
  readonly subjectId?: string;
  readonly relatedSubjectId?: string;
  readonly connectionKind?: RuntimeExecutiveStageConnectionKind;
  readonly detail?: string;
}

export interface RuntimeExecutiveStageSelectionRequest {
  readonly kind: RuntimeExecutiveStageSelectionResolutionKind;
  readonly subjectId?: string;
}

export interface RuntimeExecutiveStageFocusRequest {
  readonly primaryFocusSubjectId: string;
}

export interface RuntimeExecutiveStageFocusSelectionInput {
  readonly model: RuntimeExecutiveStageModel;
  readonly selectionRequest?: RuntimeExecutiveStageSelectionRequest;
  readonly focusRequest?: RuntimeExecutiveStageFocusRequest;
  readonly policy?: RuntimeExecutiveStageFocusPolicy;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly reason?: RuntimeExecutiveStageFocusSelectionRequestReason;
  readonly nextRevision?: string;
}

export interface RuntimeExecutiveStageSelectionResolution {
  readonly status: RuntimeExecutiveStageFocusSelectionStatus;
  readonly kind: RuntimeExecutiveStageSelectionResolutionKind;
  readonly previousSelectedSubjectId?: string;
  readonly resolvedSelectedSubjectId?: string;
  readonly selectionChanged: boolean;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly reason: RuntimeExecutiveStageFocusReason;
  readonly modelId: string;
  readonly sceneId: string;
  readonly revision: string;
  readonly issues: ReadonlyArray<string>;
}

export type RuntimeExecutiveStageSelectionResult =
  RuntimeExecutiveStageSelectionResolution;

export interface RuntimeExecutiveStageFocusAssignment {
  readonly subjectId: string;
  readonly focusRole: RuntimeExecutiveStageFocusRole;
  readonly reason: RuntimeExecutiveStageFocusReason;
  readonly relatedPrimaryFocusSubjectId?: string;
  readonly derivation: "explicit" | "selection" | "relationship" | "preserved" | "background";
}

export interface RuntimeExecutiveStageFocusResolution {
  readonly status: RuntimeExecutiveStageFocusSelectionStatus;
  readonly previousPrimaryFocusSubjectId?: string;
  readonly primaryFocusSubjectId?: string;
  readonly supportingSubjectIds: ReadonlyArray<string>;
  readonly contextualSubjectIds: ReadonlyArray<string>;
  readonly backgroundSubjectIds: ReadonlyArray<string>;
  readonly unfocusedSubjectIds: ReadonlyArray<string>;
  readonly assignments: ReadonlyArray<RuntimeExecutiveStageFocusAssignment>;
  readonly focusChanged: boolean;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly reason: RuntimeExecutiveStageFocusReason;
  readonly modelId: string;
  readonly sceneId: string;
  readonly revision: string;
  readonly relationshipDepth: number;
  readonly issues: ReadonlyArray<string>;
}

export type RuntimeExecutiveStageFocusResult =
  RuntimeExecutiveStageFocusResolution;

export interface RuntimeExecutiveStageFocusSelectionResult {
  readonly status: RuntimeExecutiveStageFocusSelectionStatus;
  readonly selection: RuntimeExecutiveStageSelectionResult;
  readonly focus: RuntimeExecutiveStageFocusResult;
  readonly resolvedSelectedSubjectId?: string;
  readonly resolvedPrimaryFocusSubjectId?: string;
  readonly orderedSupportingSubjectIds: ReadonlyArray<string>;
  readonly orderedContextualSubjectIds: ReadonlyArray<string>;
  readonly orderedBackgroundSubjectIds: ReadonlyArray<string>;
  readonly orderedUnfocusedSubjectIds: ReadonlyArray<string>;
  readonly assignments: ReadonlyArray<RuntimeExecutiveStageFocusAssignment>;
  readonly selectionChanged: boolean;
  readonly focusChanged: boolean;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly reasons: ReadonlyArray<RuntimeExecutiveStageFocusReason>;
  readonly modelId: string;
  readonly sceneId: string;
  readonly revision: string;
  readonly consistency: RuntimeExecutiveStageModelConsistencyResult;
  readonly projectedModel?: RuntimeExecutiveStageModel;
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "depends-only-on-rex-2-3",
    order: 1,
    statement: "REX-2:4 depends only on REX-2:3.",
  }),
  Object.freeze({
    id: "no-direct-rex-2-2",
    order: 2,
    statement: "No direct REX-2:2 import.",
  }),
  Object.freeze({
    id: "no-direct-rex-2-1",
    order: 3,
    statement: "No direct REX-2:1 import.",
  }),
  Object.freeze({
    id: "no-direct-rex-1",
    order: 4,
    statement: "No direct REX-1 import.",
  }),
  Object.freeze({
    id: "no-direct-dri",
    order: 5,
    statement: "No direct DRI import.",
  }),
  Object.freeze({
    id: "no-direct-nol",
    order: 6,
    statement: "No direct NOL import.",
  }),
  Object.freeze({
    id: "no-direct-ex-dri",
    order: 7,
    statement: "No direct EX-DRI import.",
  }),
  Object.freeze({
    id: "selection-target-exists",
    order: 8,
    statement: "Selection target must exist.",
  }),
  Object.freeze({
    id: "primary-focus-target-exists",
    order: 9,
    statement: "Primary-focus target must exist.",
  }),
  Object.freeze({
    id: "at-most-one-selected",
    order: 10,
    statement: "At most one selected subject exists.",
  }),
  Object.freeze({
    id: "at-most-one-primary-focus",
    order: 11,
    statement: "At most one primary focus exists.",
  }),
  Object.freeze({
    id: "selection-focus-independent",
    order: 12,
    statement: "Selection and focus remain independent.",
  }),
  Object.freeze({
    id: "selection-no-presentation",
    order: 13,
    statement: "Selection does not automatically alter presentation.",
  }),
  Object.freeze({
    id: "focus-no-presentation",
    order: 14,
    statement: "Focus does not automatically alter presentation.",
  }),
  Object.freeze({
    id: "selection-no-attention",
    order: 15,
    statement: "Selection does not automatically alter attention.",
  }),
  Object.freeze({
    id: "focus-no-attention",
    order: 16,
    statement: "Focus does not automatically alter attention.",
  }),
  Object.freeze({
    id: "focus-no-visibility",
    order: 17,
    statement: "Focus resolution does not alter visibility.",
  }),
  Object.freeze({
    id: "focus-no-membership",
    order: 18,
    statement: "Focus resolution does not alter scene membership.",
  }),
  Object.freeze({
    id: "focus-no-connections",
    order: 19,
    statement: "Focus resolution does not alter connections.",
  }),
  Object.freeze({
    id: "supporting-order-deterministic",
    order: 20,
    statement: "Supporting-focus ordering is deterministic.",
  }),
  Object.freeze({
    id: "contextual-order-deterministic",
    order: 21,
    statement: "Contextual-focus ordering is deterministic.",
  }),
  Object.freeze({
    id: "background-order-deterministic",
    order: 22,
    statement: "Background-subject ordering is deterministic.",
  }),
  Object.freeze({
    id: "resolution-idempotent",
    order: 23,
    statement: "Resolution is idempotent.",
  }),
  Object.freeze({
    id: "resolution-side-effect-free",
    order: 24,
    statement: "Resolution is side-effect free.",
  }),
  Object.freeze({
    id: "input-model-immutable",
    order: 25,
    statement: "Input Stage Model is not mutated.",
  }),
  Object.freeze({
    id: "input-request-immutable",
    order: 26,
    statement: "Input request is not mutated.",
  }),
  Object.freeze({
    id: "explicit-focus-precedence",
    order: 27,
    statement: "Explicit valid focus has precedence according to policy.",
  }),
  Object.freeze({
    id: "selection-derived-focus-policy",
    order: 28,
    statement: "Selection-derived focus obeys canonical policy.",
  }),
  Object.freeze({
    id: "bounded-relationship-depth",
    order: 29,
    statement: "Relationship traversal depth is bounded.",
  }),
  Object.freeze({
    id: "invalid-targets-deterministic",
    order: 30,
    statement: "Invalid targets resolve deterministically.",
  }),
  Object.freeze({
    id: "structured-result-reasons",
    order: 31,
    statement: "Result reasons are structured.",
  }),
  Object.freeze({
    id: "no-renderer-semantics",
    order: 32,
    statement: "No renderer semantics enter resolution.",
  }),
  Object.freeze({
    id: "no-react",
    order: 33,
    statement: "No React dependency exists.",
  }),
  Object.freeze({
    id: "no-threejs",
    order: 34,
    statement: "No Three.js dependency exists.",
  }),
  Object.freeze({
    id: "no-browser-dom",
    order: 35,
    statement: "No browser/DOM dependency exists.",
  }),
  Object.freeze({
    id: "no-animation",
    order: 36,
    statement: "No animation behavior exists.",
  }),
  Object.freeze({
    id: "no-presentation-resolver",
    order: 37,
    statement: "No presentation-state resolver exists.",
  }),
  Object.freeze({
    id: "no-attention-resolver",
    order: 38,
    statement: "No attention resolver exists.",
  }),
  Object.freeze({
    id: "no-scene-orchestration",
    order: 39,
    statement: "No scene orchestration exists.",
  }),
  Object.freeze({
    id: "no-ui-event-handler",
    order: 40,
    statement: "No UI event handler exists.",
  }),
] as const);

export type RuntimeExecutiveStageFocusSelectionInvariant =
  (typeof RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_FORBIDDEN =
  Object.freeze([
    "presentation-resolution",
    "attention-resolution",
    "visibility-resolution",
    "scene-orchestration",
    "rendering",
    "animation",
    "layout",
    "ui-event-handlers",
    "adapters",
  ] as const);

export const RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveStageFocusPolicy",
    "RuntimeExecutiveStageFocusSelectionInput",
    "RuntimeExecutiveStageSelectionRequest",
    "RuntimeExecutiveStageFocusRequest",
    "RuntimeExecutiveStageSelectionResult",
    "RuntimeExecutiveStageFocusResult",
    "RuntimeExecutiveStageFocusSelectionResult",
    "RuntimeExecutiveStageFocusAssignment",
    "RuntimeExecutiveStageFocusReason",
    "RuntimeExecutiveStageSelectionResolution",
    "RuntimeExecutiveStageFocusResolution",
  ] as const);

export const RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "Capabilities",
    "FocusRoles",
    "SelectionKinds",
    "ReasonKinds",
    "Policy",
    "PublicTypes",
    "APIs",
    "Invariants",
  ] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function freezeReason(
  reason: RuntimeExecutiveStageFocusReason,
): RuntimeExecutiveStageFocusReason {
  return Object.freeze({
    kind: reason.kind,
    ...(reason.subjectId !== undefined ? { subjectId: reason.subjectId } : {}),
    ...(reason.relatedSubjectId !== undefined
      ? { relatedSubjectId: reason.relatedSubjectId }
      : {}),
    ...(reason.connectionKind !== undefined
      ? { connectionKind: reason.connectionKind }
      : {}),
    ...(reason.detail !== undefined ? { detail: reason.detail } : {}),
  });
}

function normalizePolicy(
  policy: RuntimeExecutiveStageFocusPolicy | undefined,
): RuntimeExecutiveStageFocusPolicy {
  if (policy === undefined) {
    return DEFAULT_RUNTIME_EXECUTIVE_STAGE_FOCUS_POLICY;
  }
  if (
    !Number.isInteger(policy.maxSupportingFocus) ||
    policy.maxSupportingFocus < 0 ||
    !Number.isInteger(policy.maxContextualFocus) ||
    policy.maxContextualFocus < 0 ||
    !Number.isInteger(policy.maxSupportingConnectionPriority) ||
    policy.maxSupportingConnectionPriority < 0 ||
    (policy.relationshipDepth !== 0 &&
      policy.relationshipDepth !== 1 &&
      policy.relationshipDepth !== 2)
  ) {
    throw new TypeError("focus policy is structurally invalid");
  }
  return Object.freeze({
    selectionSuggestsPrimaryFocus: policy.selectionSuggestsPrimaryFocus,
    maxSupportingFocus: policy.maxSupportingFocus,
    maxContextualFocus: policy.maxContextualFocus,
    relationshipDepth: policy.relationshipDepth,
    maxSupportingConnectionPriority: policy.maxSupportingConnectionPriority,
    acceptedRelationshipKinds: Object.freeze([
      ...policy.acceptedRelationshipKinds,
    ]),
    explicitFocusOverridesSelectionDerived:
      policy.explicitFocusOverridesSelectionDerived,
    hiddenSubjectsSelectable: policy.hiddenSubjectsSelectable,
    hiddenSubjectsFocusEligible: policy.hiddenSubjectsFocusEligible,
    collapsedSubjectsFocusEligible: policy.collapsedSubjectsFocusEligible,
    preserveFocusWhenNoFocusInput: policy.preserveFocusWhenNoFocusInput,
    selectionCreatesFocus: policy.selectionCreatesFocus,
  });
}

function isFocusEligible(
  subject: RuntimeExecutiveStageSubjectModel,
  policy: RuntimeExecutiveStageFocusPolicy,
): boolean {
  if (subject.visibility === "hidden" && !policy.hiddenSubjectsFocusEligible) {
    return false;
  }
  if (
    subject.visibility === "collapsed" &&
    !policy.collapsedSubjectsFocusEligible
  ) {
    return false;
  }
  return true;
}

function connectionPriority(kind: RuntimeExecutiveStageConnectionKind): number {
  return RUNTIME_EXECUTIVE_STAGE_FOCUS_CONNECTION_PRIORITY[kind] ?? 99;
}

function reasonKindForConnection(
  kind: RuntimeExecutiveStageConnectionKind,
): RuntimeExecutiveStageFocusReasonKind {
  switch (kind) {
    case "kpi-relationship":
      return "kpi-relationship";
    case "koi-relationship":
      return "koi-relationship";
    case "dependency":
      return "dependency";
    case "influence":
      return "influence";
    case "flow":
      return "flow";
    case "impact":
      return "impact";
    case "execution":
      return "execution";
    case "hierarchy":
      return "hierarchy";
    case "contextual":
      return "contextual";
    default:
      return "direct-relationship";
  }
}

function bestConnectionToNeighbor(
  model: RuntimeExecutiveStageModel,
  centerId: string,
  neighborId: string,
  accepted: ReadonlyArray<RuntimeExecutiveStageConnectionKind>,
): RuntimeExecutiveStageConnectionKind | undefined {
  const connections = getRuntimeExecutiveStageConnectionsForSubject(
    model,
    centerId,
  ).filter(
    (connection) =>
      accepted.includes(connection.kind) &&
      (connection.sourceSubjectId === neighborId ||
        connection.targetSubjectId === neighborId),
  );
  if (connections.length === 0) return undefined;
  let best = connections[0]!.kind;
  let bestScore = connectionPriority(best);
  for (const connection of connections.slice(1)) {
    const score = connectionPriority(connection.kind);
    if (score < bestScore) {
      best = connection.kind;
      bestScore = score;
    }
  }
  return best;
}

function sortByPriorityThenStageOrder(
  model: RuntimeExecutiveStageModel,
  subjectIds: readonly string[],
  centerId: string,
  selectedSubjectId: string | undefined,
  accepted: ReadonlyArray<RuntimeExecutiveStageConnectionKind>,
): string[] {
  return [...subjectIds].sort((a, b) => {
    const kindA = bestConnectionToNeighbor(model, centerId, a, accepted);
    const kindB = bestConnectionToNeighbor(model, centerId, b, accepted);
    const scoreA =
      (kindA !== undefined ? connectionPriority(kindA) : 99) -
      (selectedSubjectId === a ? 0.5 : 0);
    const scoreB =
      (kindB !== undefined ? connectionPriority(kindB) : 99) -
      (selectedSubjectId === b ? 0.5 : 0);
    if (scoreA !== scoreB) return scoreA - scoreB;
    return (
      getRuntimeExecutiveStageSubjectIndex(model, a) -
      getRuntimeExecutiveStageSubjectIndex(model, b)
    );
  });
}

function collectDepthNeighbors(
  model: RuntimeExecutiveStageModel,
  centerId: string,
  depth: 0 | 1 | 2,
  accepted: ReadonlyArray<RuntimeExecutiveStageConnectionKind>,
): { depth1: string[]; depth2: string[] } {
  if (depth === 0) {
    return { depth1: [], depth2: [] };
  }

  const neighborhood = getRuntimeExecutiveStageNeighborhood(model, centerId);
  const depth1 = neighborhood.connectedSubjectIds.filter((subjectId) => {
    const kind = bestConnectionToNeighbor(model, centerId, subjectId, accepted);
    return kind !== undefined;
  });

  if (depth === 1) {
    return { depth1: [...depth1], depth2: [] };
  }

  const depth1Set = new Set(depth1);
  const depth2Set = new Set<string>();
  for (const neighborId of depth1) {
    const second = getRuntimeExecutiveStageNeighborhood(model, neighborId);
    for (const candidate of second.connectedSubjectIds) {
      if (candidate === centerId || depth1Set.has(candidate)) continue;
      const kind = bestConnectionToNeighbor(
        model,
        neighborId,
        candidate,
        accepted,
      );
      if (kind !== undefined) {
        depth2Set.add(candidate);
      }
    }
  }

  return {
    depth1: [...depth1],
    depth2: [...depth2Set],
  };
}

function preserveStageOrder(
  model: RuntimeExecutiveStageModel,
  subjectIds: readonly string[],
): string[] {
  return [...subjectIds].sort(
    (a, b) =>
      getRuntimeExecutiveStageSubjectIndex(model, a) -
      getRuntimeExecutiveStageSubjectIndex(model, b),
  );
}

function sameIdMembership(
  left: readonly string[] | undefined,
  right: readonly string[] | undefined,
): boolean {
  const a = left ?? [];
  const b = right ?? [];
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((value) => set.has(value));
}

// ─── Selection resolution ───────────────────────────────────────────────────

export function resolveRuntimeExecutiveStageSelection(input: {
  readonly model: RuntimeExecutiveStageModel;
  readonly selectionRequest?: RuntimeExecutiveStageSelectionRequest;
  readonly policy?: RuntimeExecutiveStageFocusPolicy;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly reason?: RuntimeExecutiveStageFocusSelectionRequestReason;
}): RuntimeExecutiveStageSelectionResult {
  const model = input.model;
  const policy = normalizePolicy(input.policy);
  const previousSelectedSubjectId =
    getRuntimeExecutiveStageSelectedSubject(model)?.subjectId ??
    model.selection.selectedSubjectId;
  const request = input.selectionRequest ?? { kind: "preserve" as const };
  const base = {
    kind: request.kind,
    previousSelectedSubjectId,
    source: input.source,
    modelId: model.identity.modelId,
    sceneId: model.identity.sceneId,
    revision: model.revision,
  };

  if (
    !(
      RUNTIME_EXECUTIVE_STAGE_SELECTION_RESOLUTION_KINDS as readonly string[]
    ).includes(request.kind)
  ) {
    return Object.freeze({
      ...base,
      status: "invalid" as const,
      selectionChanged: false,
      ...(previousSelectedSubjectId !== undefined
        ? { resolvedSelectedSubjectId: previousSelectedSubjectId }
        : {}),
      reason: freezeReason({
        kind: "invalid-target",
        detail: "selection request kind is invalid",
      }),
      issues: Object.freeze(["invalid-selection-kind"]),
    });
  }

  if (request.kind === "preserve") {
    return Object.freeze({
      ...base,
      status: "accepted" as const,
      ...(previousSelectedSubjectId !== undefined
        ? { resolvedSelectedSubjectId: previousSelectedSubjectId }
        : {}),
      selectionChanged: false,
      reason: freezeReason({
        kind: "selection-preserved",
        ...(previousSelectedSubjectId !== undefined
          ? { subjectId: previousSelectedSubjectId }
          : {}),
        ...(input.reason?.detail !== undefined
          ? { detail: input.reason.detail }
          : {}),
      }),
      issues: Object.freeze([] as string[]),
    });
  }

  if (request.kind === "clear") {
    return Object.freeze({
      ...base,
      status: "accepted" as const,
      selectionChanged: previousSelectedSubjectId !== undefined,
      reason: freezeReason({
        kind: "selection-cleared",
        ...(previousSelectedSubjectId !== undefined
          ? { subjectId: previousSelectedSubjectId }
          : {}),
      }),
      issues: Object.freeze([] as string[]),
    });
  }

  // select
  if (!isNonEmptyString(request.subjectId)) {
    return Object.freeze({
      ...base,
      status: "invalid" as const,
      selectionChanged: false,
      ...(previousSelectedSubjectId !== undefined
        ? { resolvedSelectedSubjectId: previousSelectedSubjectId }
        : {}),
      reason: freezeReason({
        kind: "invalid-target",
        detail: "select requires subjectId",
      }),
      issues: Object.freeze(["missing-subject-id"]),
    });
  }

  const subject = getRuntimeExecutiveStageSubjectById(model, request.subjectId);
  if (subject === undefined) {
    return Object.freeze({
      ...base,
      status: "rejected" as const,
      selectionChanged: false,
      ...(previousSelectedSubjectId !== undefined
        ? { resolvedSelectedSubjectId: previousSelectedSubjectId }
        : {}),
      reason: freezeReason({
        kind: "invalid-target",
        subjectId: request.subjectId,
        detail: "selection target does not exist in Stage Model",
      }),
      issues: Object.freeze(["unknown-subject"]),
    });
  }

  if (subject.visibility === "hidden" && !policy.hiddenSubjectsSelectable) {
    return Object.freeze({
      ...base,
      status: "rejected" as const,
      selectionChanged: false,
      ...(previousSelectedSubjectId !== undefined
        ? { resolvedSelectedSubjectId: previousSelectedSubjectId }
        : {}),
      reason: freezeReason({
        kind: "invalid-target",
        subjectId: request.subjectId,
        detail: "hidden subjects are not selectable under default policy",
      }),
      issues: Object.freeze(["hidden-subject-not-selectable"]),
    });
  }

  const selectionChanged = previousSelectedSubjectId !== request.subjectId;
  return Object.freeze({
    ...base,
    status: "accepted" as const,
    resolvedSelectedSubjectId: request.subjectId,
    selectionChanged,
    reason: freezeReason({
      kind: "selected-subject",
      subjectId: request.subjectId,
      ...(input.reason?.detail !== undefined
        ? { detail: input.reason.detail }
        : {}),
    }),
    issues: Object.freeze([] as string[]),
  });
}

// ─── Focus resolution ───────────────────────────────────────────────────────

export function resolveRuntimeExecutiveStageFocus(input: {
  readonly model: RuntimeExecutiveStageModel;
  readonly selectedSubjectId?: string;
  readonly focusRequest?: RuntimeExecutiveStageFocusRequest;
  readonly policy?: RuntimeExecutiveStageFocusPolicy;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly reason?: RuntimeExecutiveStageFocusSelectionRequestReason;
}): RuntimeExecutiveStageFocusResult {
  const model = input.model;
  const policy = normalizePolicy(input.policy);
  const previousPrimaryFocusSubjectId =
    getRuntimeExecutiveStagePrimaryFocus(model)?.subjectId ??
    model.focus.primaryFocusSubjectId;

  const fail = (
    status: RuntimeExecutiveStageFocusSelectionStatus,
    issues: readonly string[],
    detail: string,
  ): RuntimeExecutiveStageFocusResult =>
    Object.freeze({
      status,
      ...(previousPrimaryFocusSubjectId !== undefined
        ? { previousPrimaryFocusSubjectId }
        : {}),
      ...(previousPrimaryFocusSubjectId !== undefined
        ? { primaryFocusSubjectId: previousPrimaryFocusSubjectId }
        : {}),
      supportingSubjectIds: Object.freeze([] as string[]),
      contextualSubjectIds: Object.freeze([] as string[]),
      backgroundSubjectIds: Object.freeze(
        model.subjects.map((subject) => subject.subjectId),
      ),
      unfocusedSubjectIds: Object.freeze(
        model.subjects.map((subject) => subject.subjectId),
      ),
      assignments: Object.freeze(
        model.subjects.map((subject) =>
          Object.freeze({
            subjectId: subject.subjectId,
            focusRole: subject.focusRole,
            reason: freezeReason({ kind: "preserved-existing-focus" }),
            derivation: "preserved" as const,
          }),
        ),
      ),
      focusChanged: false,
      source: input.source,
      reason: freezeReason({ kind: "invalid-target", detail }),
      modelId: model.identity.modelId,
      sceneId: model.identity.sceneId,
      revision: model.revision,
      relationshipDepth: policy.relationshipDepth,
      issues: Object.freeze([...issues]),
    });

  let primaryId: string | undefined;
  let primaryReason: RuntimeExecutiveStageFocusReason;
  let primaryDerivation: RuntimeExecutiveStageFocusAssignment["derivation"];

  const explicitId = input.focusRequest?.primaryFocusSubjectId;
  if (explicitId !== undefined) {
    if (!isNonEmptyString(explicitId)) {
      return fail("invalid", ["missing-primary-focus-id"], "explicit focus id empty");
    }
    const explicitSubject = getRuntimeExecutiveStageSubjectById(
      model,
      explicitId,
    );
    if (explicitSubject === undefined) {
      return fail(
        "rejected",
        ["unknown-primary-focus"],
        "explicit primary focus target does not exist",
      );
    }
    if (!isFocusEligible(explicitSubject, policy)) {
      return fail(
        "rejected",
        ["primary-focus-not-eligible"],
        "explicit primary focus subject is not focus-eligible",
      );
    }
    primaryId = explicitId;
    primaryReason = freezeReason({
      kind: "explicit-focus",
      subjectId: explicitId,
      ...(input.reason?.detail !== undefined
        ? { detail: input.reason.detail }
        : {}),
    });
    primaryDerivation = "explicit";
  } else if (
    policy.selectionSuggestsPrimaryFocus &&
    input.selectedSubjectId !== undefined
  ) {
    const selected = getRuntimeExecutiveStageSubjectById(
      model,
      input.selectedSubjectId,
    );
    if (selected === undefined) {
      return fail(
        "rejected",
        ["unknown-selected-for-focus"],
        "selected subject for focus derivation does not exist",
      );
    }
    if (!isFocusEligible(selected, policy)) {
      // fall through to preservation
      primaryId = undefined;
      primaryReason = freezeReason({ kind: "preserved-existing-focus" });
      primaryDerivation = "preserved";
    } else {
      primaryId = input.selectedSubjectId;
      primaryReason = freezeReason({
        kind: "selected-subject",
        subjectId: input.selectedSubjectId,
      });
      primaryDerivation = "selection";
    }
  } else if (
    policy.preserveFocusWhenNoFocusInput &&
    previousPrimaryFocusSubjectId !== undefined
  ) {
    const previous = getRuntimeExecutiveStageSubjectById(
      model,
      previousPrimaryFocusSubjectId,
    );
    if (previous !== undefined && isFocusEligible(previous, policy)) {
      primaryId = previousPrimaryFocusSubjectId;
      primaryReason = freezeReason({
        kind: "preserved-existing-focus",
        subjectId: previousPrimaryFocusSubjectId,
      });
      primaryDerivation = "preserved";
    } else {
      primaryId = undefined;
      primaryReason = freezeReason({ kind: "preserved-existing-focus" });
      primaryDerivation = "preserved";
    }
  } else {
    primaryId = undefined;
    primaryReason = freezeReason({ kind: "preserved-existing-focus" });
    primaryDerivation = "preserved";
  }

  // If explicit focus was absent and selection-derived path was skipped due to
  // ineligibility, try preservation.
  if (
    primaryId === undefined &&
    policy.preserveFocusWhenNoFocusInput &&
    previousPrimaryFocusSubjectId !== undefined &&
    explicitId === undefined
  ) {
    const previous = getRuntimeExecutiveStageSubjectById(
      model,
      previousPrimaryFocusSubjectId,
    );
    if (previous !== undefined && isFocusEligible(previous, policy)) {
      primaryId = previousPrimaryFocusSubjectId;
      primaryReason = freezeReason({
        kind: "preserved-existing-focus",
        subjectId: previousPrimaryFocusSubjectId,
      });
      primaryDerivation = "preserved";
    }
  }

  const assignments: RuntimeExecutiveStageFocusAssignment[] = [];
  const supporting: string[] = [];
  const contextual: string[] = [];
  const background: string[] = [];
  const unfocused: string[] = [];

  if (primaryId !== undefined) {
    assignments.push(
      Object.freeze({
        subjectId: primaryId,
        focusRole: "primary" as const,
        reason: primaryReason,
        derivation: primaryDerivation,
      }),
    );

    const { depth1, depth2 } = collectDepthNeighbors(
      model,
      primaryId,
      policy.relationshipDepth,
      policy.acceptedRelationshipKinds,
    );

    const rankedDepth1 = sortByPriorityThenStageOrder(
      model,
      depth1.filter((id) => id !== primaryId),
      primaryId,
      input.selectedSubjectId,
      policy.acceptedRelationshipKinds,
    ).filter((id) => {
      const subject = getRuntimeExecutiveStageSubjectById(model, id);
      return subject !== undefined && isFocusEligible(subject, policy);
    });

    for (const subjectId of rankedDepth1) {
      if (supporting.length >= policy.maxSupportingFocus) break;
      const connectionKind = bestConnectionToNeighbor(
        model,
        primaryId,
        subjectId,
        policy.acceptedRelationshipKinds,
      );
      const priority =
        connectionKind !== undefined
          ? connectionPriority(connectionKind)
          : 99;
      if (priority > policy.maxSupportingConnectionPriority) {
        continue;
      }
      supporting.push(subjectId);
      assignments.push(
        Object.freeze({
          subjectId,
          focusRole: "secondary" as const,
          reason: freezeReason({
            kind:
              connectionKind !== undefined
                ? reasonKindForConnection(connectionKind)
                : "direct-relationship",
            subjectId,
            relatedSubjectId: primaryId,
            ...(connectionKind !== undefined
              ? { connectionKind }
              : {}),
            detail: "supporting focus via direct semantic relationship",
          }),
          relatedPrimaryFocusSubjectId: primaryId,
          derivation: "relationship",
        }),
      );
    }

    const supportingSet = new Set(supporting);
    const rankedDepth2 = preserveStageOrder(
      model,
      depth2.filter(
        (id) => id !== primaryId && !supportingSet.has(id),
      ),
    ).filter((id) => {
      const subject = getRuntimeExecutiveStageSubjectById(model, id);
      return subject !== undefined && isFocusEligible(subject, policy);
    });

    // Depth-1 neighbors excluded from supporting (priority or capacity) → contextual
    const depth1Overflow = rankedDepth1.filter(
      (id) => !supportingSet.has(id),
    );
    const contextualCandidates = preserveStageOrder(model, [
      ...depth1Overflow,
      ...rankedDepth2,
    ]);

    for (const subjectId of contextualCandidates) {
      if (contextual.length >= policy.maxContextualFocus) break;
      if (supportingSet.has(subjectId) || subjectId === primaryId) continue;
      contextual.push(subjectId);
      assignments.push(
        Object.freeze({
          subjectId,
          focusRole: "contextual" as const,
          reason: freezeReason({
            kind: "contextual",
            subjectId,
            relatedSubjectId: primaryId,
            detail: "contextual focus via bounded semantic neighborhood",
          }),
          relatedPrimaryFocusSubjectId: primaryId,
          derivation: "relationship",
        }),
      );
    }
  }

  const assigned = new Set(assignments.map((entry) => entry.subjectId));
  for (const subject of model.subjects) {
    if (assigned.has(subject.subjectId)) continue;
    // Remaining subjects: background if previously focused-ish, else unfocused.
    // Canonical: subjects not primary/supporting/contextual → background/unfocused.
    // Use background for subjects that had a non-unfocused role; else unfocused.
    // Spec: "background/unfocused according to canonical Foundation vocabulary"
    // Default: unfocused for clarity; use background when previously background.
    const role: RuntimeExecutiveStageFocusRole =
      subject.focusRole === "background" ? "background" : "unfocused";
    if (role === "background") {
      background.push(subject.subjectId);
    } else {
      unfocused.push(subject.subjectId);
    }
    assignments.push(
      Object.freeze({
        subjectId: subject.subjectId,
        focusRole: role,
        reason: freezeReason({
          kind: "background",
          subjectId: subject.subjectId,
        }),
        ...(primaryId !== undefined
          ? { relatedPrimaryFocusSubjectId: primaryId }
          : {}),
        derivation: "background",
      }),
    );
  }

  // Stable Stage order for background/unfocused lists
  const orderedBackground = preserveStageOrder(model, background);
  const orderedUnfocused = preserveStageOrder(model, unfocused);
  const orderedSupporting = preserveStageOrder(model, supporting);
  // Supporting was ranked by priority first — preserve that ranked order, not Stage order
  // Spec: "if semantic priority is used, ties must preserve Stage order"
  // We already sorted by priority then stage order, so keep supporting/contextual as built.
  const finalSupporting = Object.freeze([...supporting]);
  const finalContextual = Object.freeze([...contextual]);

  const assignmentById = new Map(
    assignments.map((assignment) => [assignment.subjectId, assignment]),
  );
  const orderedAssignments = Object.freeze(
    model.subjects.map((subject) => assignmentById.get(subject.subjectId)!),
  );

  const focusChanged =
    previousPrimaryFocusSubjectId !== primaryId ||
    !sameIdMembership(model.focus.secondaryFocusSubjectIds, finalSupporting) ||
    !sameIdMembership(model.focus.contextualFocusSubjectIds, finalContextual);

  return Object.freeze({
    status: "accepted" as const,
    ...(previousPrimaryFocusSubjectId !== undefined
      ? { previousPrimaryFocusSubjectId }
      : {}),
    ...(primaryId !== undefined ? { primaryFocusSubjectId: primaryId } : {}),
    supportingSubjectIds: finalSupporting,
    contextualSubjectIds: finalContextual,
    backgroundSubjectIds: Object.freeze(orderedBackground),
    unfocusedSubjectIds: Object.freeze(orderedUnfocused),
    assignments: orderedAssignments,
    focusChanged,
    source: input.source,
    reason: primaryReason,
    modelId: model.identity.modelId,
    sceneId: model.identity.sceneId,
    revision: model.revision,
    relationshipDepth: policy.relationshipDepth,
    issues: Object.freeze([] as string[]),
  });
}

// ─── Combined resolution ────────────────────────────────────────────────────

export function resolveRuntimeExecutiveStageFocusSelection(
  input: RuntimeExecutiveStageFocusSelectionInput,
  options?: { readonly project?: boolean },
): RuntimeExecutiveStageFocusSelectionResult {
  const policy = normalizePolicy(input.policy);
  const consistency = verifyRuntimeExecutiveStageModelConsistency(input.model);

  if (!consistency.ok) {
    const selection = resolveRuntimeExecutiveStageSelection({
      model: input.model,
      selectionRequest: { kind: "preserve" },
      policy,
      source: input.source,
      reason: input.reason,
    });
    const focus = resolveRuntimeExecutiveStageFocus({
      model: input.model,
      selectedSubjectId: selection.resolvedSelectedSubjectId,
      policy,
      source: input.source,
      reason: input.reason,
    });
    return Object.freeze({
      status: "invalid" as const,
      selection,
      focus,
      ...(selection.resolvedSelectedSubjectId !== undefined
        ? { resolvedSelectedSubjectId: selection.resolvedSelectedSubjectId }
        : {}),
      ...(focus.primaryFocusSubjectId !== undefined
        ? { resolvedPrimaryFocusSubjectId: focus.primaryFocusSubjectId }
        : {}),
      orderedSupportingSubjectIds: focus.supportingSubjectIds,
      orderedContextualSubjectIds: focus.contextualSubjectIds,
      orderedBackgroundSubjectIds: focus.backgroundSubjectIds,
      orderedUnfocusedSubjectIds: focus.unfocusedSubjectIds,
      assignments: focus.assignments,
      selectionChanged: false,
      focusChanged: false,
      source: input.source,
      reasons: Object.freeze([
        freezeReason({
          kind: "invalid-target",
          detail: "Stage Model failed structural consistency verification",
        }),
      ]),
      modelId: input.model.identity.modelId,
      sceneId: input.model.identity.sceneId,
      revision: input.model.revision,
      consistency,
    });
  }

  const selection = resolveRuntimeExecutiveStageSelection({
    model: input.model,
    selectionRequest: input.selectionRequest,
    policy,
    source: input.source,
    reason: input.reason,
  });

  if (selection.status !== "accepted") {
    const focus = resolveRuntimeExecutiveStageFocus({
      model: input.model,
      selectedSubjectId: selection.resolvedSelectedSubjectId,
      focusRequest: input.focusRequest,
      policy,
      source: input.source,
      reason: input.reason,
    });
    return Object.freeze({
      status: selection.status,
      selection,
      focus,
      ...(selection.resolvedSelectedSubjectId !== undefined
        ? { resolvedSelectedSubjectId: selection.resolvedSelectedSubjectId }
        : {}),
      ...(focus.primaryFocusSubjectId !== undefined
        ? { resolvedPrimaryFocusSubjectId: focus.primaryFocusSubjectId }
        : {}),
      orderedSupportingSubjectIds: focus.supportingSubjectIds,
      orderedContextualSubjectIds: focus.contextualSubjectIds,
      orderedBackgroundSubjectIds: focus.backgroundSubjectIds,
      orderedUnfocusedSubjectIds: focus.unfocusedSubjectIds,
      assignments: focus.assignments,
      selectionChanged: selection.selectionChanged,
      focusChanged: false,
      source: input.source,
      reasons: Object.freeze([selection.reason]),
      modelId: input.model.identity.modelId,
      sceneId: input.model.identity.sceneId,
      revision: input.model.revision,
      consistency,
    });
  }

  const focus = resolveRuntimeExecutiveStageFocus({
    model: input.model,
    selectedSubjectId: selection.resolvedSelectedSubjectId,
    focusRequest: input.focusRequest,
    policy,
    source: input.source,
    reason: input.reason,
  });

  const status: RuntimeExecutiveStageFocusSelectionStatus =
    focus.status === "accepted" ? "accepted" : focus.status;

  const result: RuntimeExecutiveStageFocusSelectionResult = {
    status,
    selection,
    focus,
    ...(selection.resolvedSelectedSubjectId !== undefined
      ? { resolvedSelectedSubjectId: selection.resolvedSelectedSubjectId }
      : {}),
    ...(focus.primaryFocusSubjectId !== undefined
      ? { resolvedPrimaryFocusSubjectId: focus.primaryFocusSubjectId }
      : {}),
    orderedSupportingSubjectIds: focus.supportingSubjectIds,
    orderedContextualSubjectIds: focus.contextualSubjectIds,
    orderedBackgroundSubjectIds: focus.backgroundSubjectIds,
    orderedUnfocusedSubjectIds: focus.unfocusedSubjectIds,
    assignments: focus.assignments,
    selectionChanged: selection.selectionChanged,
    focusChanged: focus.focusChanged,
    source: input.source,
    reasons: Object.freeze([selection.reason, focus.reason]),
    modelId: input.model.identity.modelId,
    sceneId: input.model.identity.sceneId,
    revision: input.model.revision,
    consistency,
  };

  if (options?.project === true && status === "accepted") {
    const projectedModel = projectRuntimeExecutiveStageFocusSelection(
      input.model,
      result,
      {
        source: input.source,
        reason: input.reason,
        nextRevision: input.nextRevision,
      },
    );
    return Object.freeze({
      ...result,
      projectedModel,
    });
  }

  return Object.freeze(result);
}

// ─── Projection ─────────────────────────────────────────────────────────────

export function projectRuntimeExecutiveStageFocusSelection(
  model: RuntimeExecutiveStageModel,
  result: RuntimeExecutiveStageFocusSelectionResult,
  options?: {
    readonly source?: RuntimeExecutiveStageFocusSelectionSource;
    readonly reason?: RuntimeExecutiveStageFocusSelectionRequestReason;
    readonly nextRevision?: string;
  },
): RuntimeExecutiveStageModel {
  if (result.status !== "accepted") {
    throw new TypeError(
      "cannot project a non-accepted focus/selection result into a Stage Model",
    );
  }

  const assignmentById = new Map(
    result.assignments.map((assignment) => [
      assignment.subjectId,
      assignment,
    ]),
  );

  const nextSubjects: RuntimeExecutiveStageSubject[] = model.subjects.map(
    (subjectModel) => {
      const assignment = assignmentById.get(subjectModel.subjectId);
      const focusRole = assignment?.focusRole ?? "unfocused";
      const selection =
        result.resolvedSelectedSubjectId === subjectModel.subjectId
          ? ("selected" as const)
          : ("unselected" as const);
      const base = subjectModel.subject;
      return Object.freeze({
        subjectId: base.subjectId,
        kind: base.kind,
        presentationState: base.presentationState,
        visibility: base.visibility,
        attention: base.attention,
        selection,
        focusRole,
        ...(base.parentId !== undefined ? { parentId: base.parentId } : {}),
        ...(base.label !== undefined ? { label: base.label } : {}),
        ...(base.lifecycleState !== undefined
          ? { lifecycleState: base.lifecycleState }
          : {}),
        ...(base.sourceVersion !== undefined
          ? { sourceVersion: base.sourceVersion }
          : {}),
      });
    },
  );

  const scene = model.scene.scene;
  const revision = options?.nextRevision ?? model.revision;
  const nextScene: RuntimeExecutiveStageScene = Object.freeze({
    sceneId: scene.sceneId,
    revision: scene.revision,
    subjects: Object.freeze(nextSubjects),
    connections: scene.connections,
    sceneState: scene.sceneState,
    context: scene.context,
    foundationIdentity: scene.foundationIdentity,
    foundationVersion: scene.foundationVersion,
    ...(result.resolvedSelectedSubjectId !== undefined
      ? { selectedSubjectId: result.resolvedSelectedSubjectId }
      : {}),
    ...(result.resolvedPrimaryFocusSubjectId !== undefined
      ? { primaryFocusSubjectId: result.resolvedPrimaryFocusSubjectId }
      : {}),
    ...(scene.presentationContext !== undefined
      ? { presentationContext: scene.presentationContext }
      : {}),
  });

  return createRuntimeExecutiveStageModel({
    modelId: model.identity.modelId,
    scene: nextScene,
    source: options?.source ?? model.source ?? result.source,
    revision,
    ...(model.identity.logicalVersion !== undefined
      ? { logicalVersion: model.identity.logicalVersion }
      : {}),
    ...(options?.reason !== undefined
      ? { reason: options.reason }
      : model.reason !== undefined
        ? { reason: model.reason }
        : {}),
  });
}

// ─── Inspectors ─────────────────────────────────────────────────────────────

export function getRuntimeExecutiveStageFocusAssignments(
  result: RuntimeExecutiveStageFocusSelectionResult | RuntimeExecutiveStageFocusResult,
): ReadonlyArray<RuntimeExecutiveStageFocusAssignment> {
  return result.assignments;
}

export function getRuntimeExecutiveStageSupportingFocus(
  result: RuntimeExecutiveStageFocusSelectionResult | RuntimeExecutiveStageFocusResult,
): ReadonlyArray<string> {
  return "orderedSupportingSubjectIds" in result
    ? result.orderedSupportingSubjectIds
    : result.supportingSubjectIds;
}

export function getRuntimeExecutiveStageContextualFocus(
  result: RuntimeExecutiveStageFocusSelectionResult | RuntimeExecutiveStageFocusResult,
): ReadonlyArray<string> {
  return "orderedContextualSubjectIds" in result
    ? result.orderedContextualSubjectIds
    : result.contextualSubjectIds;
}

export function getRuntimeExecutiveStageBackgroundSubjects(
  result: RuntimeExecutiveStageFocusSelectionResult | RuntimeExecutiveStageFocusResult,
): ReadonlyArray<string> {
  if ("orderedBackgroundSubjectIds" in result) {
    return Object.freeze([
      ...result.orderedBackgroundSubjectIds,
      ...result.orderedUnfocusedSubjectIds,
    ]);
  }
  return Object.freeze([
    ...result.backgroundSubjectIds,
    ...result.unfocusedSubjectIds,
  ]);
}

export function verifyRuntimeExecutiveStageFocusSelectionResult(
  result: RuntimeExecutiveStageFocusSelectionResult,
): {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<string>;
} {
  const issues: string[] = [];

  if (
    !(
      RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_STATUSES as readonly string[]
    ).includes(result.status)
  ) {
    issues.push("invalid-status");
  }

  const primaryCount = result.assignments.filter(
    (assignment) => assignment.focusRole === "primary",
  ).length;
  if (primaryCount > 1) {
    issues.push("multiple-primary-focus");
  }

  if (
    result.resolvedPrimaryFocusSubjectId !== undefined &&
    result.assignments.find(
      (assignment) =>
        assignment.subjectId === result.resolvedPrimaryFocusSubjectId,
    )?.focusRole !== "primary"
  ) {
    issues.push("primary-focus-assignment-mismatch");
  }

  if (
    result.status === "accepted" &&
    result.resolvedSelectedSubjectId !== undefined &&
    result.selection.resolvedSelectedSubjectId !==
      result.resolvedSelectedSubjectId
  ) {
    issues.push("selection-mismatch");
  }

  const supporting = getRuntimeExecutiveStageSupportingFocus(result);
  if (new Set(supporting).size !== supporting.length) {
    issues.push("duplicate-supporting");
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function getRuntimeExecutiveStageFocusSelectionIdentity():
  typeof runtimeExecutiveStageFocusSelectionCanonicalIdentity {
  return runtimeExecutiveStageFocusSelectionCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveStageFocusSelectionApiNames = Object.freeze([
  "resolveRuntimeExecutiveStageSelection",
  "resolveRuntimeExecutiveStageFocus",
  "resolveRuntimeExecutiveStageFocusSelection",
  "getRuntimeExecutiveStageFocusAssignments",
  "getRuntimeExecutiveStageSupportingFocus",
  "getRuntimeExecutiveStageContextualFocus",
  "getRuntimeExecutiveStageBackgroundSubjects",
  "verifyRuntimeExecutiveStageFocusSelectionResult",
  "projectRuntimeExecutiveStageFocusSelection",
  "verifyRuntimeExecutiveStageFocusSelection",
  "getRuntimeExecutiveStageFocusSelectionIdentity",
] as const);

export const RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_REGISTRY = Object.freeze({
  identity: runtimeExecutiveStageFocusSelectionIdentity,
  version: runtimeExecutiveStageFocusSelectionVersion,
  namespace: runtimeExecutiveStageFocusSelectionNamespace,
  layer: runtimeExecutiveStageFocusSelectionLayer,
  domain: runtimeExecutiveStageFocusSelectionDomain,
  phase: runtimeExecutiveStageFocusSelectionPhase,
  consumerRole: runtimeExecutiveStageFocusSelectionConsumerRole,
  immediateDependency:
    runtimeExecutiveStageFocusSelectionDependencyIdentity,
  dependencyPath: runtimeExecutiveStageFocusSelectionDependencyPath,
  sections: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_REGISTRY_SECTIONS,
  sectionCount: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_REGISTRY_SECTIONS.length,
  capabilities: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_CAPABILITIES,
  capabilityCount: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_CAPABILITIES.length,
  focusRoles: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_FOCUS_ROLES,
  focusRoleCount: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_FOCUS_ROLES.length,
  selectionResolutionKinds: RUNTIME_EXECUTIVE_STAGE_SELECTION_RESOLUTION_KINDS,
  selectionResolutionKindCount:
    RUNTIME_EXECUTIVE_STAGE_SELECTION_RESOLUTION_KINDS.length,
  reasonKinds: RUNTIME_EXECUTIVE_STAGE_FOCUS_REASON_KINDS,
  reasonKindCount: RUNTIME_EXECUTIVE_STAGE_FOCUS_REASON_KINDS.length,
  statuses: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_STATUSES,
  statusCount: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_STATUSES.length,
  defaultPolicy: DEFAULT_RUNTIME_EXECUTIVE_STAGE_FOCUS_POLICY,
  relationshipDepth: DEFAULT_RUNTIME_EXECUTIVE_STAGE_FOCUS_POLICY.relationshipDepth,
  acceptedRelationshipKinds:
    DEFAULT_RUNTIME_EXECUTIVE_STAGE_FOCUS_POLICY.acceptedRelationshipKinds,
  publicTypeNames: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_PUBLIC_TYPE_NAMES.length,
  publicApis: runtimeExecutiveStageFocusSelectionApiNames,
  publicApiCount: runtimeExecutiveStageFocusSelectionApiNames.length,
  invariants: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_INVARIANTS,
  invariantCount: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_INVARIANTS.length,
});

export const runtimeExecutiveStageFocusSelection = Object.freeze({
  phase: "FocusSelection" as const,
  name: "RuntimeExecutiveStageFocusSelection" as const,
  identity: runtimeExecutiveStageFocusSelectionIdentity,
  version: runtimeExecutiveStageFocusSelectionVersion,
  namespace: runtimeExecutiveStageFocusSelectionNamespace,
  layer: runtimeExecutiveStageFocusSelectionLayer,
  domain: runtimeExecutiveStageFocusSelectionDomain,
  architecturalRole:
    runtimeExecutiveStageFocusSelectionArchitecturalRole,
  consumerRole: runtimeExecutiveStageFocusSelectionConsumerRole,
  role: "FocusSelection" as const,
  status: runtimeExecutiveStageFocusSelectionStability,
  upstreamDependency:
    runtimeExecutiveStageFocusSelectionDependencyIdentity,
  dependencyPath: runtimeExecutiveStageFocusSelectionDependencyPath,
  deterministic: runtimeExecutiveStageFocusSelectionDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_BOUNDARY,
  capabilities: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_CAPABILITIES,
  focusRoles: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_FOCUS_ROLES,
  selectionResolutionKinds: RUNTIME_EXECUTIVE_STAGE_SELECTION_RESOLUTION_KINDS,
  reasonKinds: RUNTIME_EXECUTIVE_STAGE_FOCUS_REASON_KINDS,
  defaultPolicy: DEFAULT_RUNTIME_EXECUTIVE_STAGE_FOCUS_POLICY,
  invariants: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_FORBIDDEN,
  publicTypeNames: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveStageFocusSelectionApiNames,
  registry: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_REGISTRY,
  modelBoundary: "REX-2:3-stage-model-only" as const,
  architecturalStatus:
    "REX-2:4 Runtime Executive Stage Focus & Selection Complete — Ready for REX-2:5 Runtime Executive Stage Presentation & Attention" as const,
});

export interface RuntimeExecutiveStageFocusSelectionVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveStageFocusSelectionIdentity;
  readonly version: typeof runtimeExecutiveStageFocusSelectionVersion;
  readonly namespace: typeof runtimeExecutiveStageFocusSelectionNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveStageFocusSelectionDependencyIdentity;
  readonly consumerRole: typeof runtimeExecutiveStageFocusSelectionConsumerRole;
  readonly capabilityCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly reasonKindCount: number;
  readonly frozen: boolean;
  readonly modelBoundaryIntact: boolean;
  readonly rendererIndependent: boolean;
  readonly resolutionOnly: boolean;
}

export function verifyRuntimeExecutiveStageFocusSelection():
  RuntimeExecutiveStageFocusSelectionVerification {
  const registry = RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_REGISTRY;
  const frozen =
    Object.isFrozen(DEFAULT_RUNTIME_EXECUTIVE_STAGE_FOCUS_POLICY) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_CAPABILITIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_INVARIANTS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_FOCUS_REASON_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_REGISTRY) &&
    Object.isFrozen(runtimeExecutiveStageFocusSelection);

  const modelBoundaryIntact =
    runtimeExecutiveStageFocusSelectionDependencyIdentity ===
      runtimeExecutiveStageModelIdentity &&
    runtimeExecutiveStageFocusSelectionDependencyPath ===
      "@/app/lib/rex/runtimeExecutiveStageModel" &&
    RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_BOUNDARY.consumesStageModelOnly ===
      true &&
    RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_BOUNDARY.importsRex22Directly ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_BOUNDARY.importsRex21Directly ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_BOUNDARY.importsRex1Directly ===
      false;

  const countsAligned =
    registry.capabilityCount ===
      RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_CAPABILITIES.length &&
    registry.publicTypeCount ===
      RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_PUBLIC_TYPE_NAMES.length &&
    registry.publicApiCount ===
      runtimeExecutiveStageFocusSelectionApiNames.length &&
    registry.invariantCount ===
      RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_INVARIANTS.length &&
    registry.reasonKindCount ===
      RUNTIME_EXECUTIVE_STAGE_FOCUS_REASON_KINDS.length;

  const invariantsOrdered =
    RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_INVARIANTS.length === 40 &&
    RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    );

  const resolutionOnly =
    RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_BOUNDARY.resolvesPresentation ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_BOUNDARY.resolvesAttention ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_BOUNDARY.resolvesVisibility ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_BOUNDARY.orchestratesScene ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_BOUNDARY.createsUiHandlers === false;

  const ok =
    frozen &&
    modelBoundaryIntact &&
    countsAligned &&
    invariantsOrdered &&
    resolutionOnly &&
    runtimeExecutiveStageFocusSelectionIdentity ===
      "REX-2:4/RuntimeExecutiveStageFocusSelection" &&
    runtimeExecutiveStageFocusSelectionVersion === "2.4.0" &&
    runtimeExecutiveStageFocusSelectionNamespace ===
      "nexora.rex.stage.focus-selection" &&
    runtimeExecutiveStageFocusSelectionConsumerRole ===
      "InternalRuntimeResolver";

  return Object.freeze({
    ok,
    identity: runtimeExecutiveStageFocusSelectionIdentity,
    version: runtimeExecutiveStageFocusSelectionVersion,
    namespace: runtimeExecutiveStageFocusSelectionNamespace,
    dependencyIdentity:
      runtimeExecutiveStageFocusSelectionDependencyIdentity,
    consumerRole: runtimeExecutiveStageFocusSelectionConsumerRole,
    capabilityCount:
      RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_CAPABILITIES.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveStageFocusSelectionApiNames.length,
    invariantCount: RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_INVARIANTS.length,
    reasonKindCount: RUNTIME_EXECUTIVE_STAGE_FOCUS_REASON_KINDS.length,
    frozen,
    modelBoundaryIntact,
    rendererIndependent:
      RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_BOUNDARY.rendererIndependent,
    resolutionOnly,
  });
}
