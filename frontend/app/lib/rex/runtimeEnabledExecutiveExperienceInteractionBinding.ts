/**
 * REX-1:5 — Executive Interaction Binding.
 *
 * Binds approved runtime interaction context into framework-neutral Executive
 * Experience interaction structures for later UI/product consumers.
 *
 * Canonical flow:
 *   … → REX-1:4 Executive Scene Binding → REX-1:5 Executive Interaction Binding
 *
 * Represents what interaction is available, targeted, and runtime-approved.
 * Does NOT execute interactions, dispatch events, navigate, raycast, animate,
 * invoke AI, or mutate runtime state.
 */

import {
  EXECUTIVE_RUNTIME_SCENE_BINDING_STATUSES,
  runtimeEnabledExecutiveExperienceSceneBindingIdentity,
  runtimeEnabledExecutiveExperienceSceneBindingVersion,
  validateExecutiveRuntimeSceneGraph,
  type ExecutiveRuntimeSceneAttention,
  type ExecutiveRuntimeSceneBindingResult,
  type ExecutiveRuntimeSceneBindingStatus,
  type ExecutiveRuntimeSceneFocus,
  type ExecutiveRuntimeSceneGraph,
  type ExecutiveRuntimeSceneNode,
  type ExecutiveRuntimeScenePresentation,
  type ExecutiveRuntimeSceneReadiness,
  type ExecutiveRuntimeSceneAuthority,
  type ExecutiveRuntimeSceneSnapshot,
  type ExecutiveRuntimeSceneSubjectReference,
  type ExecutiveRuntimeSceneSurfaceBinding,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceSceneBinding";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperienceInteractionBindingIdentity =
  "REX-1:5/ExecutiveInteractionBinding" as const;

export const runtimeEnabledExecutiveExperienceInteractionBindingVersion =
  "1.5.0" as const;

export const runtimeEnabledExecutiveExperienceInteractionBindingNamespace =
  "nexora.rex.runtime-enabled-executive-experience.interaction-binding" as const;

export const runtimeEnabledExecutiveExperienceInteractionBindingLayer =
  "REX" as const;

export const runtimeEnabledExecutiveExperienceInteractionBindingPhase =
  "REX-1" as const;

export const runtimeEnabledExecutiveExperienceInteractionBindingStage =
  "ExecutiveInteractionBinding" as const;

export const runtimeEnabledExecutiveExperienceInteractionBindingArchitecturalRole =
  "ExecutiveRuntimeInteractionBindingBoundary" as const;

export const runtimeEnabledExecutiveExperienceInteractionBindingDependencyIdentity =
  runtimeEnabledExecutiveExperienceSceneBindingIdentity;

export const runtimeEnabledExecutiveExperienceInteractionBindingDependencyPath =
  "@/app/lib/rex/runtimeEnabledExecutiveExperienceSceneBinding" as const;

export const runtimeEnabledExecutiveExperienceInteractionBindingStability =
  "InteractionBindingReady" as const;

export const runtimeEnabledExecutiveExperienceInteractionBindingDeterministic =
  true as const;

export const runtimeEnabledExecutiveExperienceInteractionBindingSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeEnabledExecutiveExperienceInteractionBindingMutationPolicy =
  "immutable" as const;

export const runtimeEnabledExecutiveExperienceInteractionBindingCanonicalIdentity =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperienceInteractionBindingIdentity,
    version: runtimeEnabledExecutiveExperienceInteractionBindingVersion,
    namespace: runtimeEnabledExecutiveExperienceInteractionBindingNamespace,
    layer: runtimeEnabledExecutiveExperienceInteractionBindingLayer,
    phase: runtimeEnabledExecutiveExperienceInteractionBindingPhase,
    stage: runtimeEnabledExecutiveExperienceInteractionBindingStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceInteractionBindingArchitecturalRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceInteractionBindingDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceInteractionBindingDependencyPath,
    stabilityStatus:
      runtimeEnabledExecutiveExperienceInteractionBindingStability,
    deterministicStatus:
      runtimeEnabledExecutiveExperienceInteractionBindingDeterministic,
    sideEffectPolicy:
      runtimeEnabledExecutiveExperienceInteractionBindingSideEffectPolicy,
    mutationPolicy:
      runtimeEnabledExecutiveExperienceInteractionBindingMutationPolicy,
  });

export const EXECUTIVE_RUNTIME_INTERACTION_BINDING_PRINCIPLE =
  "Executive Scene + Runtime Interaction Context → Executive Interaction Binding. Interactions are represented, not executed." as const;

export const EXECUTIVE_RUNTIME_INTERACTION_BINDING_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-enabled-Executive-Experience" as const,
  interactionBindingAuthority: "REX-1:5" as const,
  architecturalRole: "ExecutiveRuntimeInteractionBindingBoundary" as const,
  soleImmediateDependency: "REX-1:4/ExecutiveSceneBinding" as const,
  consumesSceneBindingOnly: true as const,
  importsStateBindingDirectly: false as const,
  importsContractsDirectly: false as const,
  importsFoundationDirectly: false as const,
  importsExDriDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  executesInteractions: false as const,
  dispatchesEvents: false as const,
  navigates: false as const,
  raycasts: false as const,
  fabricatesActiveInteraction: false as const,
  fabricatesEligibility: false as const,
  fabricatesApproval: false as const,
  calculatesFocus: false as const,
  calculatesAttention: false as const,
  resolvesPresentation: false as const,
  rewritesRuntimeAuthority: false as const,
});

// ─── Vocabularies ───────────────────────────────────────────────────────────

/**
 * Compact interaction-kind vocabulary compatible with existing REX usage.
 * REX-1:4 does not expose a frozen kind enum; these values align with prior
 * interaction-context strings (select/focus/…) without enlarging semantics.
 */
export const EXECUTIVE_RUNTIME_INTERACTION_KINDS = Object.freeze([
  "select",
  "focus",
  "open",
  "inspect",
  "compare",
  "activate",
  "dismiss",
] as const);

export type ExecutiveRuntimeInteractionKind =
  (typeof EXECUTIVE_RUNTIME_INTERACTION_KINDS)[number];

/**
 * Canonical Executive Experience surfaces for interaction addressing.
 * Compatible with the REX surface vocabulary established through prior stages.
 */
export const EXECUTIVE_RUNTIME_INTERACTION_SURFACES = Object.freeze([
  "experience",
  "stage",
  "advisor",
  "insight",
  "timeline",
  "explorer",
] as const);

export type ExecutiveRuntimeInteractionSurface =
  (typeof EXECUTIVE_RUNTIME_INTERACTION_SURFACES)[number];

export const EXECUTIVE_RUNTIME_INTERACTION_ELIGIBILITY = Object.freeze([
  "ineligible",
  "eligible",
  "restricted",
] as const);

export type ExecutiveRuntimeInteractionEligibility =
  (typeof EXECUTIVE_RUNTIME_INTERACTION_ELIGIBILITY)[number];

export const EXECUTIVE_RUNTIME_INTERACTION_AVAILABILITY = Object.freeze([
  "unavailable",
  "available",
  "ready",
] as const);

export type ExecutiveRuntimeInteractionAvailability =
  (typeof EXECUTIVE_RUNTIME_INTERACTION_AVAILABILITY)[number];

export const EXECUTIVE_RUNTIME_INTERACTION_APPROVAL = Object.freeze([
  "not-required",
  "required",
  "approved",
  "rejected",
] as const);

export type ExecutiveRuntimeInteractionApproval =
  (typeof EXECUTIVE_RUNTIME_INTERACTION_APPROVAL)[number];

/** Lifecycle representation only — no transitions are performed. */
export const EXECUTIVE_RUNTIME_INTERACTION_LIFECYCLE_STATES = Object.freeze([
  "idle",
  "pending",
  "active",
  "completed",
  "cancelled",
] as const);

export type ExecutiveRuntimeInteractionLifecycleState =
  (typeof EXECUTIVE_RUNTIME_INTERACTION_LIFECYCLE_STATES)[number];

export const EXECUTIVE_RUNTIME_INTERACTION_RELATIONSHIP_KINDS = Object.freeze([
  "originates-from",
  "targets",
  "affects",
  "continues",
  "cancels",
] as const);

export type ExecutiveRuntimeInteractionRelationshipKind =
  (typeof EXECUTIVE_RUNTIME_INTERACTION_RELATIONSHIP_KINDS)[number];

export const EXECUTIVE_RUNTIME_INTERACTION_BINDING_STATUSES =
  EXECUTIVE_RUNTIME_SCENE_BINDING_STATUSES;

export type ExecutiveRuntimeInteractionBindingStatus =
  ExecutiveRuntimeSceneBindingStatus;

export const EXECUTIVE_RUNTIME_INTERACTION_BINDING_ISSUE_CODES = Object.freeze([
  "missing-scene-context",
  "missing-interaction-source",
  "missing-interaction-target",
  "invalid-interaction-kind",
  "invalid-source-surface",
  "invalid-target-surface",
  "interaction-unavailable",
  "interaction-not-eligible",
  "approval-required",
  "missing-runtime-authority",
  "invalid-interaction-descriptor",
  "duplicate-interaction-id",
] as const);

export type ExecutiveRuntimeInteractionBindingIssueCode =
  (typeof EXECUTIVE_RUNTIME_INTERACTION_BINDING_ISSUE_CODES)[number];

export interface ExecutiveRuntimeInteractionBindingIssue {
  readonly code: ExecutiveRuntimeInteractionBindingIssueCode;
  readonly message: string;
  readonly path?: string;
}

/**
 * Ordering rule: preserve upstream interaction collection order when supplied.
 * Never sort by focus, attention, or UI priority unless explicitly supplied.
 */
export const EXECUTIVE_RUNTIME_INTERACTION_ORDERING_RULE =
  "preserve-upstream-collection-order" as const;

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface ExecutiveRuntimeInteractionSource {
  readonly surface: ExecutiveRuntimeInteractionSurface;
  readonly subject?: ExecutiveRuntimeSceneSubjectReference;
  readonly sceneNodeId?: string;
  readonly interactionId?: string;
  readonly runtimeSource: ExecutiveRuntimeSceneAuthority["runtimeSource"];
}

export interface ExecutiveRuntimeInteractionTarget {
  readonly surface: ExecutiveRuntimeInteractionSurface;
  readonly subject?: ExecutiveRuntimeSceneSubjectReference;
  readonly sceneNodeId?: string;
  readonly relationshipId?: string;
  readonly runtimeSource: ExecutiveRuntimeSceneAuthority["runtimeSource"];
}

export interface ExecutiveRuntimeInteractionIntent {
  readonly interactionId: string;
  readonly kind: ExecutiveRuntimeInteractionKind;
  readonly source: ExecutiveRuntimeInteractionSource;
  readonly target: ExecutiveRuntimeInteractionTarget;
  readonly activeSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly activeSurface?: ExecutiveRuntimeInteractionSurface;
  readonly runtimeContextId?: string;
  readonly sceneId?: string;
  readonly runtimeSource: ExecutiveRuntimeSceneAuthority["runtimeSource"];
}

export interface ExecutiveRuntimeInteractionRelationship {
  readonly relationshipId: string;
  readonly kind: ExecutiveRuntimeInteractionRelationshipKind;
  readonly interactionId: string;
  readonly sceneNodeId?: string;
  readonly sceneEdgeId?: string;
  readonly subjectId?: string;
  readonly surface?: ExecutiveRuntimeInteractionSurface;
  readonly relatedInteractionId?: string;
}

export interface ExecutiveRuntimeInteractionReadiness {
  readonly contextReady: boolean;
  readonly sourceReady: boolean;
  readonly targetReady: boolean;
  readonly runtimeReady: boolean;
  readonly interactionReady: boolean;
  readonly overallReady: boolean;
}

export interface ExecutiveRuntimeActiveInteraction {
  readonly interactionId: string;
  readonly kind: ExecutiveRuntimeInteractionKind;
  readonly source: ExecutiveRuntimeInteractionSource;
  readonly target: ExecutiveRuntimeInteractionTarget;
  readonly state: ExecutiveRuntimeInteractionLifecycleState;
  readonly runtimeContextId?: string;
}

export interface ExecutiveRuntimeInteractionBinding {
  readonly interactionId: string;
  readonly kind: ExecutiveRuntimeInteractionKind;
  readonly source: ExecutiveRuntimeInteractionSource;
  readonly target: ExecutiveRuntimeInteractionTarget;
  readonly intent: ExecutiveRuntimeInteractionIntent;
  readonly eligibility: ExecutiveRuntimeInteractionEligibility;
  readonly availability: ExecutiveRuntimeInteractionAvailability;
  readonly approval: ExecutiveRuntimeInteractionApproval;
  readonly lifecycleState: ExecutiveRuntimeInteractionLifecycleState;
  readonly activeSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly activeSurface?: ExecutiveRuntimeInteractionSurface;
  readonly focus?: ExecutiveRuntimeSceneFocus;
  readonly attention?: ExecutiveRuntimeSceneAttention;
  readonly presentation?: ExecutiveRuntimeScenePresentation;
  readonly sceneId?: string;
  readonly relationships: ReadonlyArray<ExecutiveRuntimeInteractionRelationship>;
  readonly readiness: ExecutiveRuntimeInteractionReadiness;
  readonly authority: ExecutiveRuntimeSceneAuthority;
  readonly bindingIdentity: typeof runtimeEnabledExecutiveExperienceInteractionBindingIdentity;
  readonly bindingVersion: typeof runtimeEnabledExecutiveExperienceInteractionBindingVersion;
}

export interface ExecutiveRuntimeSurfaceInteractionBinding {
  readonly surface: ExecutiveRuntimeInteractionSurface;
  readonly interactions: ReadonlyArray<ExecutiveRuntimeInteractionBinding>;
  readonly activeInteraction?: ExecutiveRuntimeActiveInteraction;
  readonly readiness: ExecutiveRuntimeInteractionReadiness;
  readonly availability: ExecutiveRuntimeInteractionAvailability;
  readonly authority: ExecutiveRuntimeSceneAuthority;
}

export interface ExecutiveRuntimeStageInteractionBinding {
  readonly surface: "stage";
  readonly selectedSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly focusedSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly targetSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly eligibleKinds: ReadonlyArray<ExecutiveRuntimeInteractionKind>;
  readonly interactions: ReadonlyArray<ExecutiveRuntimeInteractionBinding>;
  readonly relationshipContextIds: ReadonlyArray<string>;
  readonly readiness: ExecutiveRuntimeInteractionReadiness;
}

export interface ExecutiveRuntimeAdvisorInteractionBinding {
  readonly surface: "advisor";
  readonly activeSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly contextId?: string;
  readonly intents: ReadonlyArray<ExecutiveRuntimeInteractionIntent>;
  readonly targetReferences: ReadonlyArray<ExecutiveRuntimeInteractionTarget>;
  readonly readiness: ExecutiveRuntimeInteractionReadiness;
}

export interface ExecutiveRuntimeInsightInteractionBinding {
  readonly surface: "insight";
  readonly activeSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly selectedMetricId?: string;
  readonly intents: ReadonlyArray<ExecutiveRuntimeInteractionIntent>;
  readonly target?: ExecutiveRuntimeInteractionTarget;
  readonly readiness: ExecutiveRuntimeInteractionReadiness;
}

export interface ExecutiveRuntimeTimelineInteractionBinding {
  readonly surface: "timeline";
  readonly temporalContextId?: string;
  readonly selectedPackId?: string;
  readonly intents: ReadonlyArray<ExecutiveRuntimeInteractionIntent>;
  readonly target?: ExecutiveRuntimeInteractionTarget;
  readonly readiness: ExecutiveRuntimeInteractionReadiness;
}

export interface ExecutiveRuntimeExplorerInteractionBinding {
  readonly surface: "explorer";
  readonly collectionContextId?: string;
  readonly selectedSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly intents: ReadonlyArray<ExecutiveRuntimeInteractionIntent>;
  readonly targetReferences: ReadonlyArray<ExecutiveRuntimeInteractionTarget>;
  readonly readiness: ExecutiveRuntimeInteractionReadiness;
}

/**
 * Plain-data interaction descriptor supplied with scene context.
 * Does not accept React/browser/renderer events.
 */
export interface ExecutiveRuntimeInteractionDescriptor {
  readonly interactionId: string;
  readonly kind: ExecutiveRuntimeInteractionKind;
  readonly sourceSurface: ExecutiveRuntimeInteractionSurface;
  readonly targetSurface: ExecutiveRuntimeInteractionSurface;
  readonly sourceSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly targetSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly sourceSceneNodeId?: string;
  readonly targetSceneNodeId?: string;
  readonly runtimeContextId?: string;
  readonly eligibility?: ExecutiveRuntimeInteractionEligibility;
  readonly availability?: ExecutiveRuntimeInteractionAvailability;
  readonly approval?: ExecutiveRuntimeInteractionApproval;
  readonly lifecycleState?: ExecutiveRuntimeInteractionLifecycleState;
  readonly active?: boolean;
  readonly relationships?: ReadonlyArray<ExecutiveRuntimeInteractionRelationship>;
  readonly selectedMetricId?: string;
  readonly temporalContextId?: string;
  readonly selectedPackId?: string;
  readonly collectionContextId?: string;
}

export interface ExecutiveRuntimeInteractionBindingInput {
  readonly sceneSnapshot?: ExecutiveRuntimeSceneSnapshot;
  readonly sceneGraph?: ExecutiveRuntimeSceneGraph;
  readonly sceneBindingResult?: ExecutiveRuntimeSceneBindingResult;
  readonly surfaceBinding?: ExecutiveRuntimeSceneSurfaceBinding;
  readonly interactions?: ReadonlyArray<ExecutiveRuntimeInteractionDescriptor>;
  readonly activeInteractionId?: string;
}

export interface ExecutiveRuntimeInteractionBindingResult {
  readonly status: ExecutiveRuntimeInteractionBindingStatus;
  readonly interactionBindings: ReadonlyArray<ExecutiveRuntimeInteractionBinding>;
  readonly surfaceBindings: ReadonlyArray<ExecutiveRuntimeSurfaceInteractionBinding>;
  readonly stage?: ExecutiveRuntimeStageInteractionBinding;
  readonly advisor?: ExecutiveRuntimeAdvisorInteractionBinding;
  readonly insight?: ExecutiveRuntimeInsightInteractionBinding;
  readonly timeline?: ExecutiveRuntimeTimelineInteractionBinding;
  readonly explorer?: ExecutiveRuntimeExplorerInteractionBinding;
  readonly activeInteraction?: ExecutiveRuntimeActiveInteraction;
  readonly issues: ReadonlyArray<ExecutiveRuntimeInteractionBindingIssue>;
  readonly sourceIdentity: typeof runtimeEnabledExecutiveExperienceInteractionBindingIdentity;
  readonly sourceVersion: typeof runtimeEnabledExecutiveExperienceInteractionBindingVersion;
  readonly upstreamIdentity: typeof runtimeEnabledExecutiveExperienceSceneBindingIdentity;
  readonly upstreamVersion: typeof runtimeEnabledExecutiveExperienceSceneBindingVersion;
}

export interface ExecutiveRuntimeInteractionSnapshot {
  readonly snapshotId: string;
  readonly interactionBindings: ReadonlyArray<ExecutiveRuntimeInteractionBinding>;
  readonly surfaceBindings: ReadonlyArray<ExecutiveRuntimeSurfaceInteractionBinding>;
  readonly activeInteraction?: ExecutiveRuntimeActiveInteraction;
  readonly activeSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly activeSurface?: ExecutiveRuntimeInteractionSurface;
  readonly sceneId?: string;
  readonly readiness: ExecutiveRuntimeInteractionReadiness;
  readonly authority: ExecutiveRuntimeSceneAuthority;
  readonly sourceVersion: ExecutiveRuntimeSceneAuthority["sourceVersion"];
  readonly bindingIdentity: typeof runtimeEnabledExecutiveExperienceInteractionBindingIdentity;
  readonly bindingVersion: typeof runtimeEnabledExecutiveExperienceInteractionBindingVersion;
  readonly timestampIso?: string;
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const EXECUTIVE_RUNTIME_INTERACTION_BINDING_GUARANTEES = Object.freeze([
  Object.freeze({
    id: "depends-only-on-rex-1-4",
    order: 1,
    statement: "REX-1:5 depends only on REX-1:4.",
  }),
  Object.freeze({
    id: "framework-neutral-interaction-binding",
    order: 2,
    statement: "Interaction binding is framework-neutral.",
  }),
  Object.freeze({
    id: "interactions-represented-not-executed",
    order: 3,
    statement: "Interactions are represented, not executed.",
  }),
  Object.freeze({
    id: "no-react-event-handlers",
    order: 4,
    statement: "No React event handlers are introduced.",
  }),
  Object.freeze({
    id: "no-browser-events",
    order: 5,
    statement: "No browser events are exposed.",
  }),
  Object.freeze({
    id: "no-threejs-interaction",
    order: 6,
    statement: "No Three.js interaction implementation is introduced.",
  }),
  Object.freeze({
    id: "no-raycasting",
    order: 7,
    statement: "No raycasting is introduced.",
  }),
  Object.freeze({
    id: "no-navigation",
    order: 8,
    statement: "No navigation is introduced.",
  }),
  Object.freeze({
    id: "no-runtime-mutation",
    order: 9,
    statement: "No runtime mutation is introduced.",
  }),
  Object.freeze({
    id: "no-event-bus",
    order: 10,
    statement: "No event bus is introduced.",
  }),
  Object.freeze({
    id: "no-global-store",
    order: 11,
    statement: "No global store is introduced.",
  }),
  Object.freeze({
    id: "source-identity-preserved",
    order: 12,
    statement: "Interaction source identity is preserved.",
  }),
  Object.freeze({
    id: "target-identity-preserved",
    order: 13,
    statement: "Interaction target identity is preserved.",
  }),
  Object.freeze({
    id: "runtime-authority-preserved",
    order: 14,
    statement: "Runtime authority is preserved.",
  }),
  Object.freeze({
    id: "active-interaction-never-fabricated",
    order: 15,
    statement: "Active interaction is never fabricated.",
  }),
  Object.freeze({
    id: "eligibility-never-fabricated",
    order: 16,
    statement: "Eligibility is never fabricated.",
  }),
  Object.freeze({
    id: "approval-never-fabricated",
    order: 17,
    statement: "Approval is never fabricated.",
  }),
  Object.freeze({
    id: "ordering-deterministic",
    order: 18,
    statement: "Interaction ordering is deterministic.",
  }),
  Object.freeze({
    id: "no-caller-input-mutation",
    order: 19,
    statement: "Caller-owned input is never mutated.",
  }),
  Object.freeze({
    id: "cross-surface-representational",
    order: 20,
    statement: "Cross-surface interactions remain representational.",
  }),
  Object.freeze({
    id: "focus-not-calculated",
    order: 21,
    statement: "Focus is not calculated.",
  }),
  Object.freeze({
    id: "attention-not-calculated",
    order: 22,
    statement: "Attention is not calculated.",
  }),
  Object.freeze({
    id: "presentation-not-resolved",
    order: 23,
    statement: "Presentation is not resolved.",
  }),
  Object.freeze({
    id: "no-ai-reasoning",
    order: 24,
    statement: "No AI reasoning is introduced.",
  }),
  Object.freeze({
    id: "no-kpi-calculation",
    order: 25,
    statement: "No KPI calculation is introduced.",
  }),
  Object.freeze({
    id: "no-koi-calculation",
    order: 26,
    statement: "No KOI calculation is introduced.",
  }),
  Object.freeze({
    id: "no-persistence",
    order: 27,
    statement: "No persistence is introduced.",
  }),
  Object.freeze({
    id: "no-networking",
    order: 28,
    statement: "No networking is introduced.",
  }),
  Object.freeze({
    id: "no-ui-control-selection",
    order: 29,
    statement: "No UI control selection is introduced.",
  }),
  Object.freeze({
    id: "surfaces-independently-addressable",
    order: 30,
    statement:
      "Existing Executive surfaces remain independently addressable.",
  }),
] as const);

export type ExecutiveRuntimeInteractionBindingGuarantee =
  (typeof EXECUTIVE_RUNTIME_INTERACTION_BINDING_GUARANTEES)[number];

export const EXECUTIVE_RUNTIME_INTERACTION_BINDING_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "click handling",
    "pointer handling",
    "keyboard handling",
    "right-click menus",
    "drag/drop",
    "object centering",
    "camera movement",
    "raycasting",
    "navigation",
    "event dispatch",
    "runtime mutation",
    "Advisor action execution",
    "Timeline replay",
    "Explorer navigation",
    "AI reasoning",
    "KPI calculation",
    "KOI calculation",
    "persistence",
    "networking",
    "global store",
    "event bus",
  ] as const);

export const EXECUTIVE_RUNTIME_INTERACTION_BINDING_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "Kinds",
    "Sources",
    "Targets",
    "Intent",
    "Eligibility",
    "Availability",
    "Approval",
    "Lifecycle",
    "SurfaceBindings",
    "Stage",
    "Advisor",
    "Insight",
    "Timeline",
    "Explorer",
    "Relationships",
    "Readiness",
    "Snapshot",
    "Status",
    "Issues",
    "Validation",
    "Guarantees",
  ] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function issue(
  code: ExecutiveRuntimeInteractionBindingIssueCode,
  message: string,
  path?: string,
): ExecutiveRuntimeInteractionBindingIssue {
  return Object.freeze({
    code,
    message,
    ...(path !== undefined ? { path } : {}),
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function freezeSubject(
  subject: ExecutiveRuntimeSceneSubjectReference,
): ExecutiveRuntimeSceneSubjectReference {
  return Object.freeze({
    kind: subject.kind,
    id: subject.id,
    ...(subject.label !== undefined ? { label: subject.label } : {}),
    ...(subject.parentId !== undefined ? { parentId: subject.parentId } : {}),
    ...(subject.sourceVersion !== undefined
      ? { sourceVersion: subject.sourceVersion }
      : {}),
  });
}

function resolveSceneContext(input: ExecutiveRuntimeInteractionBindingInput): {
  readonly graph?: ExecutiveRuntimeSceneGraph;
  readonly surfaceBinding?: ExecutiveRuntimeSceneSurfaceBinding;
  readonly activeSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly focus?: ExecutiveRuntimeSceneFocus;
  readonly attention?: ExecutiveRuntimeSceneAttention;
  readonly presentation?: ExecutiveRuntimeScenePresentation;
  readonly readiness?: ExecutiveRuntimeSceneReadiness;
  readonly authority?: ExecutiveRuntimeSceneAuthority;
} {
  const graph =
    input.sceneGraph ??
    input.sceneSnapshot?.sceneGraph ??
    input.sceneBindingResult?.sceneGraph;
  const surfaceBinding =
    input.surfaceBinding ??
    input.sceneSnapshot?.surfaceBinding ??
    input.sceneBindingResult?.surfaceBinding;
  return {
    graph,
    surfaceBinding,
    activeSubject:
      input.sceneSnapshot?.activeSubject ??
      graph?.activeNode?.subject ??
      surfaceBinding?.activeSubject,
    focus: input.sceneSnapshot?.focus ?? graph?.activeNode?.focus,
    attention:
      input.sceneSnapshot?.attention ?? graph?.attentionNodes[0]?.attention,
    presentation: input.sceneSnapshot?.presentation ?? graph?.presentation,
    readiness: input.sceneSnapshot?.readiness ?? graph?.readiness,
    authority: input.sceneSnapshot?.authority ?? graph?.authority,
  };
}

function findNode(
  graph: ExecutiveRuntimeSceneGraph | undefined,
  nodeId: string | undefined,
): ExecutiveRuntimeSceneNode | undefined {
  if (graph === undefined || nodeId === undefined) return undefined;
  return graph.nodes.find((node) => node.nodeId === nodeId);
}

// ─── Validation helpers ─────────────────────────────────────────────────────

export function isExecutiveRuntimeInteractionKind(
  value: unknown,
): value is ExecutiveRuntimeInteractionKind {
  return (
    EXECUTIVE_RUNTIME_INTERACTION_KINDS as readonly unknown[]
  ).includes(value);
}

export function isExecutiveRuntimeInteractionSurface(
  value: unknown,
): value is ExecutiveRuntimeInteractionSurface {
  return (
    EXECUTIVE_RUNTIME_INTERACTION_SURFACES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveRuntimeInteractionEligibility(
  value: unknown,
): value is ExecutiveRuntimeInteractionEligibility {
  return (
    EXECUTIVE_RUNTIME_INTERACTION_ELIGIBILITY as readonly unknown[]
  ).includes(value);
}

export function isExecutiveRuntimeInteractionAvailability(
  value: unknown,
): value is ExecutiveRuntimeInteractionAvailability {
  return (
    EXECUTIVE_RUNTIME_INTERACTION_AVAILABILITY as readonly unknown[]
  ).includes(value);
}

export function isExecutiveRuntimeInteractionApproval(
  value: unknown,
): value is ExecutiveRuntimeInteractionApproval {
  return (
    EXECUTIVE_RUNTIME_INTERACTION_APPROVAL as readonly unknown[]
  ).includes(value);
}

export function isExecutiveRuntimeInteractionLifecycleState(
  value: unknown,
): value is ExecutiveRuntimeInteractionLifecycleState {
  return (
    EXECUTIVE_RUNTIME_INTERACTION_LIFECYCLE_STATES as readonly unknown[]
  ).includes(value);
}

export function validateExecutiveRuntimeInteractionBinding(
  value: unknown,
): value is ExecutiveRuntimeInteractionBinding {
  if (!isPlainObject(value)) return false;
  return (
    isNonEmptyString(value.interactionId) &&
    isExecutiveRuntimeInteractionKind(value.kind) &&
    isPlainObject(value.source) &&
    isExecutiveRuntimeInteractionSurface(value.source.surface) &&
    isPlainObject(value.target) &&
    isExecutiveRuntimeInteractionSurface(value.target.surface) &&
    isPlainObject(value.intent) &&
    isExecutiveRuntimeInteractionEligibility(value.eligibility) &&
    isExecutiveRuntimeInteractionAvailability(value.availability) &&
    isExecutiveRuntimeInteractionApproval(value.approval) &&
    isExecutiveRuntimeInteractionLifecycleState(value.lifecycleState) &&
    Array.isArray(value.relationships) &&
    isPlainObject(value.readiness) &&
    value.authority !== undefined &&
    value.bindingIdentity ===
      runtimeEnabledExecutiveExperienceInteractionBindingIdentity &&
    value.bindingVersion ===
      runtimeEnabledExecutiveExperienceInteractionBindingVersion
  );
}

// ─── Binding helpers ────────────────────────────────────────────────────────

export function bindExecutiveRuntimeInteractionEligibility(
  eligibility: ExecutiveRuntimeInteractionEligibility | undefined,
): ExecutiveRuntimeInteractionEligibility {
  if (eligibility === undefined) return "ineligible";
  if (!isExecutiveRuntimeInteractionEligibility(eligibility)) {
    throw new TypeError("eligibility value is invalid");
  }
  return eligibility;
}

export function bindExecutiveRuntimeInteractionApproval(
  approval: ExecutiveRuntimeInteractionApproval | undefined,
): ExecutiveRuntimeInteractionApproval {
  if (approval === undefined) return "not-required";
  if (!isExecutiveRuntimeInteractionApproval(approval)) {
    throw new TypeError("approval value is invalid");
  }
  return approval;
}

export function bindExecutiveRuntimeInteractionAvailability(
  availability: ExecutiveRuntimeInteractionAvailability | undefined,
  runtimeReady: boolean,
): ExecutiveRuntimeInteractionAvailability {
  if (!runtimeReady) return "unavailable";
  if (availability === undefined) return "available";
  if (!isExecutiveRuntimeInteractionAvailability(availability)) {
    throw new TypeError("availability value is invalid");
  }
  return availability;
}

export function bindExecutiveRuntimeInteractionSource(input: {
  readonly surface: ExecutiveRuntimeInteractionSurface;
  readonly subject?: ExecutiveRuntimeSceneSubjectReference;
  readonly sceneNodeId?: string;
  readonly interactionId?: string;
  readonly runtimeSource: ExecutiveRuntimeSceneAuthority["runtimeSource"];
}): ExecutiveRuntimeInteractionSource {
  if (!isExecutiveRuntimeInteractionSurface(input.surface)) {
    throw new TypeError("interaction source surface is invalid");
  }
  return Object.freeze({
    surface: input.surface,
    runtimeSource: input.runtimeSource,
    ...(input.subject !== undefined
      ? { subject: freezeSubject(input.subject) }
      : {}),
    ...(input.sceneNodeId !== undefined
      ? { sceneNodeId: input.sceneNodeId }
      : {}),
    ...(input.interactionId !== undefined
      ? { interactionId: input.interactionId }
      : {}),
  });
}

export function bindExecutiveRuntimeInteractionTarget(input: {
  readonly surface: ExecutiveRuntimeInteractionSurface;
  readonly subject?: ExecutiveRuntimeSceneSubjectReference;
  readonly sceneNodeId?: string;
  readonly relationshipId?: string;
  readonly runtimeSource: ExecutiveRuntimeSceneAuthority["runtimeSource"];
}): ExecutiveRuntimeInteractionTarget {
  if (!isExecutiveRuntimeInteractionSurface(input.surface)) {
    throw new TypeError("interaction target surface is invalid");
  }
  return Object.freeze({
    surface: input.surface,
    runtimeSource: input.runtimeSource,
    ...(input.subject !== undefined
      ? { subject: freezeSubject(input.subject) }
      : {}),
    ...(input.sceneNodeId !== undefined
      ? { sceneNodeId: input.sceneNodeId }
      : {}),
    ...(input.relationshipId !== undefined
      ? { relationshipId: input.relationshipId }
      : {}),
  });
}

export function bindExecutiveRuntimeInteractionIntent(input: {
  readonly interactionId: string;
  readonly kind: ExecutiveRuntimeInteractionKind;
  readonly source: ExecutiveRuntimeInteractionSource;
  readonly target: ExecutiveRuntimeInteractionTarget;
  readonly activeSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly activeSurface?: ExecutiveRuntimeInteractionSurface;
  readonly runtimeContextId?: string;
  readonly sceneId?: string;
}): ExecutiveRuntimeInteractionIntent {
  if (!isNonEmptyString(input.interactionId)) {
    throw new TypeError("interactionId must be a non-empty opaque identifier");
  }
  if (!isExecutiveRuntimeInteractionKind(input.kind)) {
    throw new TypeError("interaction kind is invalid");
  }
  return Object.freeze({
    interactionId: input.interactionId,
    kind: input.kind,
    source: input.source,
    target: input.target,
    runtimeSource: input.source.runtimeSource,
    ...(input.activeSubject !== undefined
      ? { activeSubject: freezeSubject(input.activeSubject) }
      : {}),
    ...(input.activeSurface !== undefined
      ? { activeSurface: input.activeSurface }
      : {}),
    ...(input.runtimeContextId !== undefined
      ? { runtimeContextId: input.runtimeContextId }
      : {}),
    ...(input.sceneId !== undefined ? { sceneId: input.sceneId } : {}),
  });
}

function bindInteractionReadiness(args: {
  readonly contextReady: boolean;
  readonly sourceReady: boolean;
  readonly targetReady: boolean;
  readonly runtimeReady: boolean;
  readonly eligibility: ExecutiveRuntimeInteractionEligibility;
  readonly availability: ExecutiveRuntimeInteractionAvailability;
}): ExecutiveRuntimeInteractionReadiness {
  const interactionReady =
    args.contextReady &&
    args.sourceReady &&
    args.targetReady &&
    args.runtimeReady &&
    args.eligibility === "eligible" &&
    args.availability !== "unavailable";
  return Object.freeze({
    contextReady: args.contextReady,
    sourceReady: args.sourceReady,
    targetReady: args.targetReady,
    runtimeReady: args.runtimeReady,
    interactionReady,
    overallReady: interactionReady,
  });
}

export function bindExecutiveRuntimeInteraction(input: {
  readonly descriptor: ExecutiveRuntimeInteractionDescriptor;
  readonly graph?: ExecutiveRuntimeSceneGraph;
  readonly activeSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly focus?: ExecutiveRuntimeSceneFocus;
  readonly attention?: ExecutiveRuntimeSceneAttention;
  readonly presentation?: ExecutiveRuntimeScenePresentation;
  readonly authority: ExecutiveRuntimeSceneAuthority;
  readonly runtimeReady: boolean;
}): {
  readonly binding?: ExecutiveRuntimeInteractionBinding;
  readonly issues: ReadonlyArray<ExecutiveRuntimeInteractionBindingIssue>;
} {
  const descriptor = input.descriptor;
  const issues: ExecutiveRuntimeInteractionBindingIssue[] = [];

  if (!isNonEmptyString(descriptor.interactionId)) {
    issues.push(
      issue(
        "invalid-interaction-descriptor",
        "interactionId must be non-empty",
        "interactionId",
      ),
    );
  }
  if (!isExecutiveRuntimeInteractionKind(descriptor.kind)) {
    issues.push(
      issue(
        "invalid-interaction-kind",
        "interaction kind is not in the approved vocabulary",
        "kind",
      ),
    );
  }
  if (!isExecutiveRuntimeInteractionSurface(descriptor.sourceSurface)) {
    issues.push(
      issue(
        "invalid-source-surface",
        "source surface is not a canonical Executive Experience surface",
        "sourceSurface",
      ),
    );
  }
  if (!isExecutiveRuntimeInteractionSurface(descriptor.targetSurface)) {
    issues.push(
      issue(
        "invalid-target-surface",
        "target surface is not a canonical Executive Experience surface",
        "targetSurface",
      ),
    );
  }

  const sourceNode = findNode(input.graph, descriptor.sourceSceneNodeId);
  const targetNode = findNode(input.graph, descriptor.targetSceneNodeId);
  const sourceSubject =
    descriptor.sourceSubject ?? sourceNode?.subject ?? input.activeSubject;
  const targetSubject =
    descriptor.targetSubject ?? targetNode?.subject ?? input.activeSubject;

  const sourceReady =
    isExecutiveRuntimeInteractionSurface(descriptor.sourceSurface) &&
    (sourceSubject !== undefined || descriptor.sourceSceneNodeId === undefined);
  const targetReady =
    isExecutiveRuntimeInteractionSurface(descriptor.targetSurface) &&
    (targetSubject !== undefined || descriptor.targetSceneNodeId === undefined);

  if (!sourceReady) {
    issues.push(
      issue(
        "missing-interaction-source",
        "interaction source subject/node could not be resolved",
        "source",
      ),
    );
  }
  if (!targetReady) {
    issues.push(
      issue(
        "missing-interaction-target",
        "interaction target subject/node could not be resolved",
        "target",
      ),
    );
  }

  if (
    issues.some((entry) =>
      (
        [
          "invalid-interaction-kind",
          "invalid-source-surface",
          "invalid-target-surface",
          "invalid-interaction-descriptor",
        ] as readonly ExecutiveRuntimeInteractionBindingIssueCode[]
      ).includes(entry.code),
    )
  ) {
    return { issues: Object.freeze(issues) };
  }

  const eligibility = bindExecutiveRuntimeInteractionEligibility(
    descriptor.eligibility,
  );
  if (eligibility === "ineligible") {
    issues.push(
      issue(
        "interaction-not-eligible",
        "interaction is explicitly ineligible",
        "eligibility",
      ),
    );
  }

  const approval = bindExecutiveRuntimeInteractionApproval(descriptor.approval);
  if (approval === "required") {
    issues.push(
      issue(
        "approval-required",
        "interaction approval is required and not yet approved",
        "approval",
      ),
    );
  }

  const availability = bindExecutiveRuntimeInteractionAvailability(
    descriptor.availability,
    input.runtimeReady,
  );
  if (availability === "unavailable") {
    issues.push(
      issue(
        "interaction-unavailable",
        "interaction is unavailable for consumption",
        "availability",
      ),
    );
  }

  const lifecycleState =
    descriptor.lifecycleState !== undefined &&
    isExecutiveRuntimeInteractionLifecycleState(descriptor.lifecycleState)
      ? descriptor.lifecycleState
      : descriptor.active === true
        ? ("active" as const)
        : ("idle" as const);

  const source = bindExecutiveRuntimeInteractionSource({
    surface: descriptor.sourceSurface,
    subject: sourceSubject,
    sceneNodeId: descriptor.sourceSceneNodeId ?? sourceNode?.nodeId,
    interactionId: descriptor.interactionId,
    runtimeSource: input.authority.runtimeSource,
  });
  const target = bindExecutiveRuntimeInteractionTarget({
    surface: descriptor.targetSurface,
    subject: targetSubject,
    sceneNodeId: descriptor.targetSceneNodeId ?? targetNode?.nodeId,
    runtimeSource: input.authority.runtimeSource,
  });
  const intent = bindExecutiveRuntimeInteractionIntent({
    interactionId: descriptor.interactionId,
    kind: descriptor.kind,
    source,
    target,
    activeSubject: input.activeSubject,
    activeSurface: descriptor.sourceSurface,
    runtimeContextId: descriptor.runtimeContextId,
    sceneId: input.graph?.sceneId,
  });
  const readiness = bindInteractionReadiness({
    contextReady: input.graph !== undefined,
    sourceReady,
    targetReady,
    runtimeReady: input.runtimeReady,
    eligibility,
    availability,
  });

  const binding: ExecutiveRuntimeInteractionBinding = Object.freeze({
    interactionId: descriptor.interactionId,
    kind: descriptor.kind,
    source,
    target,
    intent,
    eligibility,
    availability,
    approval,
    lifecycleState,
    relationships: Object.freeze([...(descriptor.relationships ?? [])]),
    readiness,
    authority: input.authority,
    bindingIdentity:
      runtimeEnabledExecutiveExperienceInteractionBindingIdentity,
    bindingVersion:
      runtimeEnabledExecutiveExperienceInteractionBindingVersion,
    ...(input.activeSubject !== undefined
      ? { activeSubject: freezeSubject(input.activeSubject) }
      : {}),
    ...(descriptor.sourceSurface !== undefined
      ? { activeSurface: descriptor.sourceSurface }
      : {}),
    ...(input.focus !== undefined ? { focus: input.focus } : {}),
    ...(input.attention !== undefined ? { attention: input.attention } : {}),
    ...(input.presentation !== undefined
      ? { presentation: input.presentation }
      : {}),
    ...(input.graph?.sceneId !== undefined
      ? { sceneId: input.graph.sceneId }
      : {}),
  });

  return { binding, issues: Object.freeze(issues) };
}

export function bindExecutiveRuntimeSurfaceInteraction(input: {
  readonly surface: ExecutiveRuntimeInteractionSurface;
  readonly interactions: ReadonlyArray<ExecutiveRuntimeInteractionBinding>;
  readonly activeInteraction?: ExecutiveRuntimeActiveInteraction;
  readonly authority: ExecutiveRuntimeSceneAuthority;
}): ExecutiveRuntimeSurfaceInteractionBinding {
  const surfaceInteractions = Object.freeze(
    input.interactions.filter(
      (interaction) =>
        interaction.source.surface === input.surface ||
        interaction.target.surface === input.surface,
    ),
  );
  const readiness =
    surfaceInteractions[0]?.readiness ??
    Object.freeze({
      contextReady: false,
      sourceReady: false,
      targetReady: false,
      runtimeReady: false,
      interactionReady: false,
      overallReady: false,
    });
  const availability: ExecutiveRuntimeInteractionAvailability =
    surfaceInteractions.length === 0
      ? "unavailable"
      : surfaceInteractions.every(
            (interaction) => interaction.availability === "ready",
          )
        ? "ready"
        : surfaceInteractions.some(
              (interaction) => interaction.availability !== "unavailable",
            )
          ? "available"
          : "unavailable";

  return Object.freeze({
    surface: input.surface,
    interactions: surfaceInteractions,
    readiness,
    availability,
    authority: input.authority,
    ...(input.activeInteraction !== undefined &&
    (input.activeInteraction.source.surface === input.surface ||
      input.activeInteraction.target.surface === input.surface)
      ? { activeInteraction: input.activeInteraction }
      : {}),
  });
}

/**
 * Preserve upstream interaction order. Canonical surface order is used only
 * for the surface-binding collection, not for reordering interactions.
 */
export function bindExecutiveRuntimeSurfaceInteractions(input: {
  readonly interactions: ReadonlyArray<ExecutiveRuntimeInteractionBinding>;
  readonly activeInteraction?: ExecutiveRuntimeActiveInteraction;
  readonly authority: ExecutiveRuntimeSceneAuthority;
}): ReadonlyArray<ExecutiveRuntimeSurfaceInteractionBinding> {
  return Object.freeze(
    EXECUTIVE_RUNTIME_INTERACTION_SURFACES.map((surface) =>
      bindExecutiveRuntimeSurfaceInteraction({
        surface,
        interactions: input.interactions,
        activeInteraction: input.activeInteraction,
        authority: input.authority,
      }),
    ),
  );
}

function bindStageInteraction(input: {
  readonly interactions: ReadonlyArray<ExecutiveRuntimeInteractionBinding>;
  readonly activeSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly focus?: ExecutiveRuntimeSceneFocus;
  readonly readiness: ExecutiveRuntimeInteractionReadiness;
}): ExecutiveRuntimeStageInteractionBinding {
  const stageInteractions = Object.freeze(
    input.interactions.filter(
      (interaction) =>
        interaction.source.surface === "stage" ||
        interaction.target.surface === "stage",
    ),
  );
  const eligibleKinds = Object.freeze(
    EXECUTIVE_RUNTIME_INTERACTION_KINDS.filter((kind) =>
      stageInteractions.some(
        (interaction) =>
          interaction.kind === kind && interaction.eligibility === "eligible",
      ),
    ),
  );
  const relationshipContextIds = Object.freeze(
    stageInteractions.flatMap((interaction) =>
      interaction.relationships.map((relationship) => relationship.relationshipId),
    ),
  );
  const targetSubject =
    stageInteractions.find((interaction) => interaction.target.subject)?.target
      .subject ?? input.activeSubject;

  return Object.freeze({
    surface: "stage" as const,
    eligibleKinds,
    interactions: stageInteractions,
    relationshipContextIds,
    readiness: input.readiness,
    ...(input.activeSubject !== undefined
      ? { selectedSubject: freezeSubject(input.activeSubject) }
      : {}),
    ...(input.focus?.focusedSubject !== undefined
      ? { focusedSubject: freezeSubject(input.focus.focusedSubject) }
      : {}),
    ...(targetSubject !== undefined
      ? { targetSubject: freezeSubject(targetSubject) }
      : {}),
  });
}

function bindSurfaceSpecialtyBindings(input: {
  readonly interactions: ReadonlyArray<ExecutiveRuntimeInteractionBinding>;
  readonly activeSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly descriptors: ReadonlyArray<ExecutiveRuntimeInteractionDescriptor>;
  readonly readiness: ExecutiveRuntimeInteractionReadiness;
}): {
  readonly advisor: ExecutiveRuntimeAdvisorInteractionBinding;
  readonly insight: ExecutiveRuntimeInsightInteractionBinding;
  readonly timeline: ExecutiveRuntimeTimelineInteractionBinding;
  readonly explorer: ExecutiveRuntimeExplorerInteractionBinding;
} {
  const forSurface = (surface: ExecutiveRuntimeInteractionSurface) =>
    input.interactions.filter(
      (interaction) =>
        interaction.source.surface === surface ||
        interaction.target.surface === surface,
    );

  const advisorInteractions = forSurface("advisor");
  const insightInteractions = forSurface("insight");
  const timelineInteractions = forSurface("timeline");
  const explorerInteractions = forSurface("explorer");

  const insightDescriptor = input.descriptors.find(
    (descriptor) =>
      descriptor.sourceSurface === "insight" ||
      descriptor.targetSurface === "insight",
  );
  const timelineDescriptor = input.descriptors.find(
    (descriptor) =>
      descriptor.sourceSurface === "timeline" ||
      descriptor.targetSurface === "timeline",
  );
  const explorerDescriptor = input.descriptors.find(
    (descriptor) =>
      descriptor.sourceSurface === "explorer" ||
      descriptor.targetSurface === "explorer",
  );

  return {
    advisor: Object.freeze({
      surface: "advisor" as const,
      intents: Object.freeze(advisorInteractions.map((item) => item.intent)),
      targetReferences: Object.freeze(
        advisorInteractions.map((item) => item.target),
      ),
      readiness: input.readiness,
      ...(input.activeSubject !== undefined
        ? { activeSubject: freezeSubject(input.activeSubject) }
        : {}),
      ...(advisorInteractions[0]?.intent.runtimeContextId !== undefined
        ? { contextId: advisorInteractions[0].intent.runtimeContextId }
        : {}),
    }),
    insight: Object.freeze({
      surface: "insight" as const,
      intents: Object.freeze(insightInteractions.map((item) => item.intent)),
      readiness: input.readiness,
      ...(input.activeSubject !== undefined
        ? { activeSubject: freezeSubject(input.activeSubject) }
        : {}),
      ...(insightDescriptor?.selectedMetricId !== undefined
        ? { selectedMetricId: insightDescriptor.selectedMetricId }
        : {}),
      ...(insightInteractions[0]?.target !== undefined
        ? { target: insightInteractions[0].target }
        : {}),
    }),
    timeline: Object.freeze({
      surface: "timeline" as const,
      intents: Object.freeze(timelineInteractions.map((item) => item.intent)),
      readiness: input.readiness,
      ...(timelineDescriptor?.temporalContextId !== undefined
        ? { temporalContextId: timelineDescriptor.temporalContextId }
        : {}),
      ...(timelineDescriptor?.selectedPackId !== undefined
        ? { selectedPackId: timelineDescriptor.selectedPackId }
        : {}),
      ...(timelineInteractions[0]?.target !== undefined
        ? { target: timelineInteractions[0].target }
        : {}),
    }),
    explorer: Object.freeze({
      surface: "explorer" as const,
      intents: Object.freeze(explorerInteractions.map((item) => item.intent)),
      targetReferences: Object.freeze(
        explorerInteractions.map((item) => item.target),
      ),
      readiness: input.readiness,
      ...(explorerDescriptor?.collectionContextId !== undefined
        ? { collectionContextId: explorerDescriptor.collectionContextId }
        : {}),
      ...(input.activeSubject !== undefined
        ? { selectedSubject: freezeSubject(input.activeSubject) }
        : {}),
    }),
  };
}

function deriveInteractionBindingStatus(args: {
  readonly issues: ReadonlyArray<ExecutiveRuntimeInteractionBindingIssue>;
  readonly graph?: ExecutiveRuntimeSceneGraph;
  readonly authority?: ExecutiveRuntimeSceneAuthority;
  readonly bindings: ReadonlyArray<ExecutiveRuntimeInteractionBinding>;
  readonly runtimeReady: boolean;
}): ExecutiveRuntimeInteractionBindingStatus {
  const invalidCodes: ReadonlyArray<ExecutiveRuntimeInteractionBindingIssueCode> =
    [
      "invalid-interaction-kind",
      "invalid-source-surface",
      "invalid-target-surface",
      "invalid-interaction-descriptor",
      "duplicate-interaction-id",
      "missing-runtime-authority",
      "missing-scene-context",
    ];
  if (args.issues.some((entry) => invalidCodes.includes(entry.code))) {
    return "invalid";
  }
  if (
    args.graph === undefined ||
    args.authority === undefined ||
    !args.runtimeReady
  ) {
    return "unavailable";
  }
  if (
    args.bindings.length === 0 ||
    args.issues.length > 0 ||
    args.bindings.some((binding) => !binding.readiness.overallReady)
  ) {
    return "partial";
  }
  return "bound";
}

export function bindExecutiveRuntimeExperienceInteractions(
  input: ExecutiveRuntimeInteractionBindingInput,
): ExecutiveRuntimeInteractionBindingResult {
  const context = resolveSceneContext(input);
  const issues: ExecutiveRuntimeInteractionBindingIssue[] = [];

  if (context.graph === undefined) {
    issues.push(
      issue(
        "missing-scene-context",
        "scene graph/snapshot context is required for interaction binding",
        "sceneGraph",
      ),
    );
  } else if (!validateExecutiveRuntimeSceneGraph(context.graph)) {
    issues.push(
      issue(
        "missing-scene-context",
        "scene graph is structurally invalid",
        "sceneGraph",
      ),
    );
  }

  if (
    context.authority === undefined ||
    context.authority.relationship !== "EX-DRI → REX"
  ) {
    issues.push(
      issue(
        "missing-runtime-authority",
        "runtime authority must preserve EX-DRI → REX",
        "authority",
      ),
    );
  }

  const runtimeReady =
    context.authority !== undefined &&
    context.graph !== undefined &&
    context.readiness?.runtimeAvailable !== false &&
    context.graph.readiness.runtimeAvailable !== false;

  if (
    issues.some((entry) =>
      (
        [
          "missing-scene-context",
          "missing-runtime-authority",
        ] as readonly ExecutiveRuntimeInteractionBindingIssueCode[]
      ).includes(entry.code),
    )
  ) {
    return Object.freeze({
      status: "invalid" as const,
      interactionBindings: Object.freeze([]),
      surfaceBindings: Object.freeze([]),
      issues: Object.freeze(issues),
      sourceIdentity:
        runtimeEnabledExecutiveExperienceInteractionBindingIdentity,
      sourceVersion:
        runtimeEnabledExecutiveExperienceInteractionBindingVersion,
      upstreamIdentity: runtimeEnabledExecutiveExperienceSceneBindingIdentity,
      upstreamVersion: runtimeEnabledExecutiveExperienceSceneBindingVersion,
    });
  }

  const authority = context.authority!;
  const graph = context.graph!;
  const descriptors = input.interactions ?? [];
  const bindings: ExecutiveRuntimeInteractionBinding[] = [];
  const seen = new Set<string>();

  for (const descriptor of descriptors) {
    if (seen.has(descriptor.interactionId)) {
      issues.push(
        issue(
          "duplicate-interaction-id",
          `duplicate interaction id ${descriptor.interactionId}`,
          "interactionId",
        ),
      );
      continue;
    }
    seen.add(descriptor.interactionId);
    const bound = bindExecutiveRuntimeInteraction({
      descriptor,
      graph,
      activeSubject: context.activeSubject,
      focus: context.focus,
      attention: context.attention,
      presentation: context.presentation,
      authority,
      runtimeReady,
    });
    issues.push(...bound.issues);
    if (bound.binding !== undefined) {
      bindings.push(bound.binding);
    }
  }

  const interactionBindings = Object.freeze(bindings);

  let activeInteraction: ExecutiveRuntimeActiveInteraction | undefined;
  if (input.activeInteractionId !== undefined) {
    const active = interactionBindings.find(
      (binding) => binding.interactionId === input.activeInteractionId,
    );
    if (active !== undefined) {
      activeInteraction = Object.freeze({
        interactionId: active.interactionId,
        kind: active.kind,
        source: active.source,
        target: active.target,
        state: active.lifecycleState,
        ...(active.intent.runtimeContextId !== undefined
          ? { runtimeContextId: active.intent.runtimeContextId }
          : {}),
      });
    }
  } else {
    const markedActive = interactionBindings.find(
      (binding) => binding.lifecycleState === "active",
    );
    if (markedActive !== undefined) {
      activeInteraction = Object.freeze({
        interactionId: markedActive.interactionId,
        kind: markedActive.kind,
        source: markedActive.source,
        target: markedActive.target,
        state: markedActive.lifecycleState,
        ...(markedActive.intent.runtimeContextId !== undefined
          ? { runtimeContextId: markedActive.intent.runtimeContextId }
          : {}),
      });
    }
  }

  const surfaceBindings = bindExecutiveRuntimeSurfaceInteractions({
    interactions: interactionBindings,
    activeInteraction,
    authority,
  });

  const aggregateReadiness =
    interactionBindings[0]?.readiness ??
    Object.freeze({
      contextReady: true,
      sourceReady: false,
      targetReady: false,
      runtimeReady,
      interactionReady: false,
      overallReady: false,
    });

  const stage = bindStageInteraction({
    interactions: interactionBindings,
    activeSubject: context.activeSubject,
    focus: context.focus,
    readiness: aggregateReadiness,
  });
  const specialty = bindSurfaceSpecialtyBindings({
    interactions: interactionBindings,
    activeSubject: context.activeSubject,
    descriptors,
    readiness: aggregateReadiness,
  });

  const status = deriveInteractionBindingStatus({
    issues,
    graph,
    authority,
    bindings: interactionBindings,
    runtimeReady,
  });

  return Object.freeze({
    status,
    interactionBindings,
    surfaceBindings,
    stage,
    advisor: specialty.advisor,
    insight: specialty.insight,
    timeline: specialty.timeline,
    explorer: specialty.explorer,
    issues: Object.freeze(issues),
    sourceIdentity:
      runtimeEnabledExecutiveExperienceInteractionBindingIdentity,
    sourceVersion:
      runtimeEnabledExecutiveExperienceInteractionBindingVersion,
    upstreamIdentity: runtimeEnabledExecutiveExperienceSceneBindingIdentity,
    upstreamVersion: runtimeEnabledExecutiveExperienceSceneBindingVersion,
    ...(activeInteraction !== undefined ? { activeInteraction } : {}),
  });
}

export function createExecutiveRuntimeInteractionSnapshot(input: {
  readonly snapshotId: string;
  readonly result: ExecutiveRuntimeInteractionBindingResult;
  readonly sceneId?: string;
  readonly activeSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly activeSurface?: ExecutiveRuntimeInteractionSurface;
  readonly timestampIso?: string;
}): ExecutiveRuntimeInteractionSnapshot {
  if (!isNonEmptyString(input.snapshotId)) {
    throw new TypeError("snapshotId must be a non-empty opaque identifier");
  }
  if (
    input.result.status === "invalid" ||
    input.result.interactionBindings === undefined
  ) {
    throw new TypeError(
      "cannot create interaction snapshot from an invalid binding result",
    );
  }

  const authority =
    input.result.interactionBindings[0]?.authority ??
    input.result.surfaceBindings[0]?.authority;
  if (authority === undefined) {
    throw new TypeError("authority is required for interaction snapshot");
  }

  const readiness =
    input.result.interactionBindings[0]?.readiness ??
    Object.freeze({
      contextReady: false,
      sourceReady: false,
      targetReady: false,
      runtimeReady: false,
      interactionReady: false,
      overallReady: false,
    });

  return Object.freeze({
    snapshotId: input.snapshotId,
    interactionBindings: input.result.interactionBindings,
    surfaceBindings: input.result.surfaceBindings,
    readiness,
    authority,
    sourceVersion: authority.sourceVersion,
    bindingIdentity:
      runtimeEnabledExecutiveExperienceInteractionBindingIdentity,
    bindingVersion:
      runtimeEnabledExecutiveExperienceInteractionBindingVersion,
    ...(input.result.activeInteraction !== undefined
      ? { activeInteraction: input.result.activeInteraction }
      : {}),
    ...(input.activeSubject !== undefined
      ? { activeSubject: freezeSubject(input.activeSubject) }
      : {}),
    ...(input.activeSurface !== undefined
      ? { activeSurface: input.activeSurface }
      : {}),
    ...(input.sceneId !== undefined ? { sceneId: input.sceneId } : {}),
    ...(input.timestampIso !== undefined
      ? { timestampIso: input.timestampIso }
      : {}),
  });
}

export function getRuntimeEnabledExecutiveExperienceInteractionBindingIdentity():
  typeof runtimeEnabledExecutiveExperienceInteractionBindingCanonicalIdentity {
  return runtimeEnabledExecutiveExperienceInteractionBindingCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperienceInteractionBindingApiNames =
  Object.freeze([
    "getRuntimeEnabledExecutiveExperienceInteractionBindingIdentity",
    "isExecutiveRuntimeInteractionKind",
    "isExecutiveRuntimeInteractionSurface",
    "isExecutiveRuntimeInteractionEligibility",
    "isExecutiveRuntimeInteractionAvailability",
    "isExecutiveRuntimeInteractionApproval",
    "isExecutiveRuntimeInteractionLifecycleState",
    "validateExecutiveRuntimeInteractionBinding",
    "bindExecutiveRuntimeInteractionSource",
    "bindExecutiveRuntimeInteractionTarget",
    "bindExecutiveRuntimeInteractionIntent",
    "bindExecutiveRuntimeInteractionEligibility",
    "bindExecutiveRuntimeInteractionApproval",
    "bindExecutiveRuntimeInteractionAvailability",
    "bindExecutiveRuntimeInteraction",
    "bindExecutiveRuntimeSurfaceInteraction",
    "bindExecutiveRuntimeSurfaceInteractions",
    "bindExecutiveRuntimeExperienceInteractions",
    "createExecutiveRuntimeInteractionSnapshot",
    "verifyExecutiveInteractionBinding",
  ] as const);

export const runtimeEnabledExecutiveExperienceInteractionBindingRegistry =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperienceInteractionBindingIdentity,
    version: runtimeEnabledExecutiveExperienceInteractionBindingVersion,
    namespace: runtimeEnabledExecutiveExperienceInteractionBindingNamespace,
    layer: runtimeEnabledExecutiveExperienceInteractionBindingLayer,
    phase: runtimeEnabledExecutiveExperienceInteractionBindingPhase,
    stage: runtimeEnabledExecutiveExperienceInteractionBindingStage,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceInteractionBindingDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceInteractionBindingDependencyPath,
    sections: EXECUTIVE_RUNTIME_INTERACTION_BINDING_REGISTRY_SECTIONS,
    sectionCount:
      EXECUTIVE_RUNTIME_INTERACTION_BINDING_REGISTRY_SECTIONS.length,
    kinds: EXECUTIVE_RUNTIME_INTERACTION_KINDS,
    kindCount: EXECUTIVE_RUNTIME_INTERACTION_KINDS.length,
    surfaces: EXECUTIVE_RUNTIME_INTERACTION_SURFACES,
    surfaceCount: EXECUTIVE_RUNTIME_INTERACTION_SURFACES.length,
    eligibility: EXECUTIVE_RUNTIME_INTERACTION_ELIGIBILITY,
    eligibilityCount: EXECUTIVE_RUNTIME_INTERACTION_ELIGIBILITY.length,
    availability: EXECUTIVE_RUNTIME_INTERACTION_AVAILABILITY,
    availabilityCount: EXECUTIVE_RUNTIME_INTERACTION_AVAILABILITY.length,
    approval: EXECUTIVE_RUNTIME_INTERACTION_APPROVAL,
    approvalCount: EXECUTIVE_RUNTIME_INTERACTION_APPROVAL.length,
    lifecycleStates: EXECUTIVE_RUNTIME_INTERACTION_LIFECYCLE_STATES,
    lifecycleStateCount: EXECUTIVE_RUNTIME_INTERACTION_LIFECYCLE_STATES.length,
    relationshipKinds: EXECUTIVE_RUNTIME_INTERACTION_RELATIONSHIP_KINDS,
    relationshipKindCount:
      EXECUTIVE_RUNTIME_INTERACTION_RELATIONSHIP_KINDS.length,
    statuses: EXECUTIVE_RUNTIME_INTERACTION_BINDING_STATUSES,
    statusCount: EXECUTIVE_RUNTIME_INTERACTION_BINDING_STATUSES.length,
    issueCodes: EXECUTIVE_RUNTIME_INTERACTION_BINDING_ISSUE_CODES,
    issueCodeCount: EXECUTIVE_RUNTIME_INTERACTION_BINDING_ISSUE_CODES.length,
    guarantees: EXECUTIVE_RUNTIME_INTERACTION_BINDING_GUARANTEES,
    guaranteeCount: EXECUTIVE_RUNTIME_INTERACTION_BINDING_GUARANTEES.length,
    orderingRule: EXECUTIVE_RUNTIME_INTERACTION_ORDERING_RULE,
    publicApis: runtimeEnabledExecutiveExperienceInteractionBindingApiNames,
    publicApiCount:
      runtimeEnabledExecutiveExperienceInteractionBindingApiNames.length,
  });

export const runtimeEnabledExecutiveExperienceInteractionBinding =
  Object.freeze({
    phase: "REX-1" as const,
    name: "ExecutiveInteractionBinding" as const,
    identity: runtimeEnabledExecutiveExperienceInteractionBindingIdentity,
    version: runtimeEnabledExecutiveExperienceInteractionBindingVersion,
    namespace: runtimeEnabledExecutiveExperienceInteractionBindingNamespace,
    layer: runtimeEnabledExecutiveExperienceInteractionBindingLayer,
    stage: runtimeEnabledExecutiveExperienceInteractionBindingStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceInteractionBindingArchitecturalRole,
    role: "ExecutiveInteractionBinding" as const,
    status: runtimeEnabledExecutiveExperienceInteractionBindingStability,
    upstreamDependency:
      runtimeEnabledExecutiveExperienceInteractionBindingDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceInteractionBindingDependencyPath,
    deterministic:
      runtimeEnabledExecutiveExperienceInteractionBindingDeterministic,
    immutable: true as const,
    sideEffectFree: true as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    browserIndependent: true as const,
    interactionBinding: true as const,
    principle: EXECUTIVE_RUNTIME_INTERACTION_BINDING_PRINCIPLE,
    boundary: EXECUTIVE_RUNTIME_INTERACTION_BINDING_BOUNDARY,
    kinds: EXECUTIVE_RUNTIME_INTERACTION_KINDS,
    surfaces: EXECUTIVE_RUNTIME_INTERACTION_SURFACES,
    eligibility: EXECUTIVE_RUNTIME_INTERACTION_ELIGIBILITY,
    availability: EXECUTIVE_RUNTIME_INTERACTION_AVAILABILITY,
    approval: EXECUTIVE_RUNTIME_INTERACTION_APPROVAL,
    lifecycleStates: EXECUTIVE_RUNTIME_INTERACTION_LIFECYCLE_STATES,
    statuses: EXECUTIVE_RUNTIME_INTERACTION_BINDING_STATUSES,
    issueCodes: EXECUTIVE_RUNTIME_INTERACTION_BINDING_ISSUE_CODES,
    guarantees: EXECUTIVE_RUNTIME_INTERACTION_BINDING_GUARANTEES,
    forbiddenResponsibilities:
      EXECUTIVE_RUNTIME_INTERACTION_BINDING_FORBIDDEN_RESPONSIBILITIES,
    orderingRule: EXECUTIVE_RUNTIME_INTERACTION_ORDERING_RULE,
    publicApiSurface:
      runtimeEnabledExecutiveExperienceInteractionBindingApiNames,
    registry: runtimeEnabledExecutiveExperienceInteractionBindingRegistry,
    sceneBindingBoundary: "REX-1:4-scene-binding-only" as const,
    architecturalStatus:
      "Interaction Binding Complete · Deterministic · Immutable · Framework-Independent · ReadyForAdaptivePresentationBinding" as const,
  });

// ─── Verification ───────────────────────────────────────────────────────────

export interface ExecutiveInteractionBindingVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeEnabledExecutiveExperienceInteractionBindingIdentity;
  readonly version: typeof runtimeEnabledExecutiveExperienceInteractionBindingVersion;
  readonly namespace: typeof runtimeEnabledExecutiveExperienceInteractionBindingNamespace;
  readonly layer: typeof runtimeEnabledExecutiveExperienceInteractionBindingLayer;
  readonly phase: typeof runtimeEnabledExecutiveExperienceInteractionBindingPhase;
  readonly stage: typeof runtimeEnabledExecutiveExperienceInteractionBindingStage;
  readonly architecturalRole: typeof runtimeEnabledExecutiveExperienceInteractionBindingArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeEnabledExecutiveExperienceInteractionBindingDependencyIdentity;
  readonly kindCount: number;
  readonly surfaceCount: number;
  readonly eligibilityCount: number;
  readonly availabilityCount: number;
  readonly approvalCount: number;
  readonly lifecycleStateCount: number;
  readonly guaranteeCount: number;
  readonly registrySectionCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly sceneBindingBoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly guaranteesPresent: boolean;
  readonly orderingRuleValid: boolean;
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

export function verifyExecutiveInteractionBinding():
  ExecutiveInteractionBindingVerification {
  const runtimeModule = runtimeEnabledExecutiveExperienceInteractionBinding;
  const registry = runtimeEnabledExecutiveExperienceInteractionBindingRegistry;

  const identityOk =
    runtimeModule.identity === "REX-1:5/ExecutiveInteractionBinding" &&
    runtimeModule.version === "1.5.0" &&
    runtimeModule.namespace ===
      "nexora.rex.runtime-enabled-executive-experience.interaction-binding" &&
    runtimeModule.layer === "REX" &&
    runtimeModule.phase === "REX-1" &&
    runtimeModule.stage === "ExecutiveInteractionBinding" &&
    runtimeModule.architecturalRole ===
      "ExecutiveRuntimeInteractionBindingBoundary" &&
    runtimeModule.upstreamDependency === "REX-1:4/ExecutiveSceneBinding" &&
    runtimeModule.upstreamDependency ===
      runtimeEnabledExecutiveExperienceSceneBindingIdentity &&
    runtimeModule.sceneBindingBoundary === "REX-1:4-scene-binding-only";

  const dependencyOk =
    runtimeModule.dependencyPath ===
      "@/app/lib/rex/runtimeEnabledExecutiveExperienceSceneBinding" &&
    EXECUTIVE_RUNTIME_INTERACTION_BINDING_BOUNDARY.consumesSceneBindingOnly ===
      true &&
    EXECUTIVE_RUNTIME_INTERACTION_BINDING_BOUNDARY
      .importsStateBindingDirectly === false &&
    EXECUTIVE_RUNTIME_INTERACTION_BINDING_BOUNDARY.importsContractsDirectly ===
      false &&
    EXECUTIVE_RUNTIME_INTERACTION_BINDING_BOUNDARY.importsExDriDirectly ===
      false;

  const vocabOk =
    exactOrder(EXECUTIVE_RUNTIME_INTERACTION_KINDS, [
      "select",
      "focus",
      "open",
      "inspect",
      "compare",
      "activate",
      "dismiss",
    ]) &&
    exactOrder(EXECUTIVE_RUNTIME_INTERACTION_SURFACES, [
      "experience",
      "stage",
      "advisor",
      "insight",
      "timeline",
      "explorer",
    ]) &&
    exactOrder(EXECUTIVE_RUNTIME_INTERACTION_ELIGIBILITY, [
      "ineligible",
      "eligible",
      "restricted",
    ]) &&
    exactOrder(EXECUTIVE_RUNTIME_INTERACTION_AVAILABILITY, [
      "unavailable",
      "available",
      "ready",
    ]) &&
    exactOrder(EXECUTIVE_RUNTIME_INTERACTION_APPROVAL, [
      "not-required",
      "required",
      "approved",
      "rejected",
    ]) &&
    exactOrder(EXECUTIVE_RUNTIME_INTERACTION_LIFECYCLE_STATES, [
      "idle",
      "pending",
      "active",
      "completed",
      "cancelled",
    ]);

  const guaranteesPresent =
    EXECUTIVE_RUNTIME_INTERACTION_BINDING_GUARANTEES.length === 30 &&
    exactOrder(
      EXECUTIVE_RUNTIME_INTERACTION_BINDING_GUARANTEES.map((entry) => entry.id),
      [
        "depends-only-on-rex-1-4",
        "framework-neutral-interaction-binding",
        "interactions-represented-not-executed",
        "no-react-event-handlers",
        "no-browser-events",
        "no-threejs-interaction",
        "no-raycasting",
        "no-navigation",
        "no-runtime-mutation",
        "no-event-bus",
        "no-global-store",
        "source-identity-preserved",
        "target-identity-preserved",
        "runtime-authority-preserved",
        "active-interaction-never-fabricated",
        "eligibility-never-fabricated",
        "approval-never-fabricated",
        "ordering-deterministic",
        "no-caller-input-mutation",
        "cross-surface-representational",
        "focus-not-calculated",
        "attention-not-calculated",
        "presentation-not-resolved",
        "no-ai-reasoning",
        "no-kpi-calculation",
        "no-koi-calculation",
        "no-persistence",
        "no-networking",
        "no-ui-control-selection",
        "surfaces-independently-addressable",
      ],
    ) &&
    EXECUTIVE_RUNTIME_INTERACTION_BINDING_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const orderingRuleValid =
    EXECUTIVE_RUNTIME_INTERACTION_ORDERING_RULE ===
    "preserve-upstream-collection-order";

  const immutabilityOk =
    Object.isFrozen(module) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      runtimeEnabledExecutiveExperienceInteractionBindingCanonicalIdentity,
    ) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_INTERACTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_INTERACTION_SURFACES) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_INTERACTION_ELIGIBILITY) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_INTERACTION_AVAILABILITY) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_INTERACTION_APPROVAL) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_INTERACTION_LIFECYCLE_STATES) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_INTERACTION_BINDING_GUARANTEES) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_INTERACTION_BINDING_BOUNDARY) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_INTERACTION_BINDING_ISSUE_CODES) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_INTERACTION_BINDING_REGISTRY_SECTIONS);

  const uniquenessOk =
    unique([...EXECUTIVE_RUNTIME_INTERACTION_KINDS]) &&
    unique([...EXECUTIVE_RUNTIME_INTERACTION_SURFACES]) &&
    unique([...EXECUTIVE_RUNTIME_INTERACTION_BINDING_ISSUE_CODES]) &&
    unique(
      EXECUTIVE_RUNTIME_INTERACTION_BINDING_GUARANTEES.map((entry) => entry.id),
    );

  const sceneBindingBoundaryIntact =
    runtimeModule.boundary.soleImmediateDependency ===
      "REX-1:4/ExecutiveSceneBinding" &&
    runtimeModule.boundary.consumesSceneBindingOnly === true &&
    runtimeModule.boundary.executesInteractions === false &&
    runtimeModule.boundary.fabricatesActiveInteraction === false &&
    runtimeModule.boundary.fabricatesEligibility === false &&
    runtimeModule.boundary.fabricatesApproval === false;

  const frameworkIndependent =
    runtimeModule.frameworkIndependent === true &&
    runtimeModule.rendererIndependent === true &&
    runtimeModule.boundary.frameworkIndependent === true;

  const ok =
    identityOk &&
    dependencyOk &&
    vocabOk &&
    guaranteesPresent &&
    orderingRuleValid &&
    immutabilityOk &&
    uniquenessOk &&
    sceneBindingBoundaryIntact &&
    frameworkIndependent &&
    runtimeModule.principle === EXECUTIVE_RUNTIME_INTERACTION_BINDING_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: runtimeEnabledExecutiveExperienceInteractionBindingIdentity,
    version: runtimeEnabledExecutiveExperienceInteractionBindingVersion,
    namespace: runtimeEnabledExecutiveExperienceInteractionBindingNamespace,
    layer: runtimeEnabledExecutiveExperienceInteractionBindingLayer,
    phase: runtimeEnabledExecutiveExperienceInteractionBindingPhase,
    stage: runtimeEnabledExecutiveExperienceInteractionBindingStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceInteractionBindingArchitecturalRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceInteractionBindingDependencyIdentity,
    kindCount: EXECUTIVE_RUNTIME_INTERACTION_KINDS.length,
    surfaceCount: EXECUTIVE_RUNTIME_INTERACTION_SURFACES.length,
    eligibilityCount: EXECUTIVE_RUNTIME_INTERACTION_ELIGIBILITY.length,
    availabilityCount: EXECUTIVE_RUNTIME_INTERACTION_AVAILABILITY.length,
    approvalCount: EXECUTIVE_RUNTIME_INTERACTION_APPROVAL.length,
    lifecycleStateCount: EXECUTIVE_RUNTIME_INTERACTION_LIFECYCLE_STATES.length,
    guaranteeCount: EXECUTIVE_RUNTIME_INTERACTION_BINDING_GUARANTEES.length,
    registrySectionCount:
      EXECUTIVE_RUNTIME_INTERACTION_BINDING_REGISTRY_SECTIONS.length,
    publicApiCount:
      runtimeEnabledExecutiveExperienceInteractionBindingApiNames.length,
    frozen: immutabilityOk,
    sceneBindingBoundaryIntact,
    frameworkIndependent,
    guaranteesPresent,
    orderingRuleValid,
  });
}
