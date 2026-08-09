/**
 * REX-1:4 — Executive Scene Binding.
 *
 * Converts bound Executive Runtime State (REX-1:3) into a framework-neutral
 * Executive Scene representation for later Stage/rendering consumers.
 *
 * Canonical flow:
 *   EX-DRI → REX-1:1 → REX-1:2 → REX-1:3 → REX-1:4 Executive Scene Binding
 *
 * Scene binding only — no React, Three.js, geometry, camera, animation,
 * interaction execution, AI, persistence, networking, or business calculations.
 */

import {
  EXECUTIVE_RUNTIME_BINDING_STATUSES,
  runtimeEnabledExecutiveExperienceStateBindingIdentity,
  runtimeEnabledExecutiveExperienceStateBindingVersion,
  validateBoundExecutiveRuntimeExperienceState,
  type BoundExecutiveRuntimeExperienceState,
  type BoundExecutiveRuntimeSurfaceState,
  type ExecutiveRuntimeBindingStatus,
  type ExecutiveRuntimeBoundSnapshot,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceStateBinding";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperienceSceneBindingIdentity =
  "REX-1:4/ExecutiveSceneBinding" as const;

export const runtimeEnabledExecutiveExperienceSceneBindingVersion =
  "1.4.0" as const;

export const runtimeEnabledExecutiveExperienceSceneBindingNamespace =
  "nexora.rex.runtime-enabled-executive-experience.scene-binding" as const;

export const runtimeEnabledExecutiveExperienceSceneBindingLayer =
  "REX" as const;

export const runtimeEnabledExecutiveExperienceSceneBindingPhase =
  "REX-1" as const;

export const runtimeEnabledExecutiveExperienceSceneBindingStage =
  "ExecutiveSceneBinding" as const;

export const runtimeEnabledExecutiveExperienceSceneBindingArchitecturalRole =
  "ExecutiveRuntimeSceneBindingBoundary" as const;

export const runtimeEnabledExecutiveExperienceSceneBindingDependencyIdentity =
  runtimeEnabledExecutiveExperienceStateBindingIdentity;

export const runtimeEnabledExecutiveExperienceSceneBindingDependencyPath =
  "@/app/lib/rex/runtimeEnabledExecutiveExperienceStateBinding" as const;

export const runtimeEnabledExecutiveExperienceSceneBindingStability =
  "SceneBindingReady" as const;

export const runtimeEnabledExecutiveExperienceSceneBindingDeterministic =
  true as const;

export const runtimeEnabledExecutiveExperienceSceneBindingSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeEnabledExecutiveExperienceSceneBindingMutationPolicy =
  "immutable" as const;

export const runtimeEnabledExecutiveExperienceSceneBindingCanonicalIdentity =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperienceSceneBindingIdentity,
    version: runtimeEnabledExecutiveExperienceSceneBindingVersion,
    namespace: runtimeEnabledExecutiveExperienceSceneBindingNamespace,
    layer: runtimeEnabledExecutiveExperienceSceneBindingLayer,
    phase: runtimeEnabledExecutiveExperienceSceneBindingPhase,
    stage: runtimeEnabledExecutiveExperienceSceneBindingStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceSceneBindingArchitecturalRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceSceneBindingDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceSceneBindingDependencyPath,
    stabilityStatus:
      runtimeEnabledExecutiveExperienceSceneBindingStability,
    deterministicStatus:
      runtimeEnabledExecutiveExperienceSceneBindingDeterministic,
    sideEffectPolicy:
      runtimeEnabledExecutiveExperienceSceneBindingSideEffectPolicy,
    mutationPolicy:
      runtimeEnabledExecutiveExperienceSceneBindingMutationPolicy,
  });

export const EXECUTIVE_RUNTIME_SCENE_BINDING_PRINCIPLE =
  "Bound Executive Runtime State → Executive Scene Binding. Scene binding represents; it does not render or decide." as const;

export const EXECUTIVE_RUNTIME_SCENE_BINDING_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-enabled-Executive-Experience" as const,
  sceneBindingAuthority: "REX-1:4" as const,
  architecturalRole: "ExecutiveRuntimeSceneBindingBoundary" as const,
  soleImmediateDependency: "REX-1:3/RuntimeContextStateBinding" as const,
  consumesStateBindingOnly: true as const,
  importsContractsDirectly: false as const,
  importsFoundationDirectly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  calculatesFocus: false as const,
  calculatesAttention: false as const,
  resolvesPresentation: false as const,
  calculatesLayoutCoordinates: false as const,
  calculatesCameraBehavior: false as const,
  implementsAnimation: false as const,
  inventsSubjectIds: false as const,
  infersActiveSubject: false as const,
  executesInteraction: false as const,
  rewritesRuntimeAuthority: false as const,
});

// ─── Derived subject / presentation types from REX-1:3 bound state ──────────

export type ExecutiveRuntimeSceneSubjectReference = NonNullable<
  BoundExecutiveRuntimeExperienceState["activeSubject"]
>;

export type ExecutiveRuntimeSceneSubjectKind =
  ExecutiveRuntimeSceneSubjectReference["kind"];

export type ExecutiveRuntimeScenePresentationState = NonNullable<
  BoundExecutiveRuntimeExperienceState["presentation"]
>["presentationState"];

export type ExecutiveRuntimeSceneFocusContract = NonNullable<
  BoundExecutiveRuntimeExperienceState["focus"]
>;

export type ExecutiveRuntimeSceneAttentionContract = NonNullable<
  BoundExecutiveRuntimeExperienceState["attention"]
>;

export type ExecutiveRuntimeScenePresentationContract = NonNullable<
  BoundExecutiveRuntimeExperienceState["presentation"]
>;

export type ExecutiveRuntimeSceneReadiness =
  BoundExecutiveRuntimeExperienceState["readiness"];

export type ExecutiveRuntimeSceneAuthority =
  BoundExecutiveRuntimeExperienceState["authority"];

export type ExecutiveRuntimeSceneRuntimeSource =
  BoundExecutiveRuntimeExperienceState["authority"]["runtimeSource"];

export type ExecutiveRuntimeSceneActivationState = NonNullable<
  BoundExecutiveRuntimeExperienceState["activeSurface"]
>["activationState"];

export type ExecutiveRuntimeSceneRuntimeState = NonNullable<
  BoundExecutiveRuntimeExperienceState["activeSurface"]
>["runtimeState"];

// ─── Visibility / relationship vocabularies ─────────────────────────────────

/**
 * Scene-facing visibility state only — not rendering logic.
 */
export const EXECUTIVE_RUNTIME_SCENE_VISIBILITY = Object.freeze([
  "visible",
  "hidden",
  "collapsed",
] as const);

export type ExecutiveRuntimeSceneVisibility =
  (typeof EXECUTIVE_RUNTIME_SCENE_VISIBILITY)[number];

/**
 * Compact generic relationship kinds for optional scene edges.
 * Used only when relationship data is explicitly supplied on the binding input.
 */
export const EXECUTIVE_RUNTIME_SCENE_RELATIONSHIP_KINDS = Object.freeze([
  "depends-on",
  "influences",
  "contains",
  "associated-with",
  "precedes",
  "supports",
] as const);

export type ExecutiveRuntimeSceneRelationshipKind =
  (typeof EXECUTIVE_RUNTIME_SCENE_RELATIONSHIP_KINDS)[number];

export const EXECUTIVE_RUNTIME_SCENE_BINDING_STATUSES =
  EXECUTIVE_RUNTIME_BINDING_STATUSES;

export type ExecutiveRuntimeSceneBindingStatus = ExecutiveRuntimeBindingStatus;

export const EXECUTIVE_RUNTIME_SCENE_BINDING_ISSUE_CODES = Object.freeze([
  "missing-bound-runtime-state",
  "missing-stage-surface",
  "invalid-scene-subject",
  "invalid-scene-node",
  "invalid-scene-edge",
  "missing-runtime-authority",
  "presentation-unavailable",
  "relationship-source-missing",
  "relationship-target-missing",
  "invalid-relationship-kind",
  "duplicate-scene-node",
  "duplicate-scene-edge",
] as const);

export type ExecutiveRuntimeSceneBindingIssueCode =
  (typeof EXECUTIVE_RUNTIME_SCENE_BINDING_ISSUE_CODES)[number];

export interface ExecutiveRuntimeSceneBindingIssue {
  readonly code: ExecutiveRuntimeSceneBindingIssueCode;
  readonly message: string;
  readonly path?: string;
}

// ─── Scene contracts ────────────────────────────────────────────────────────

export interface ExecutiveRuntimeSceneSubject {
  readonly subject: ExecutiveRuntimeSceneSubjectReference;
  readonly sceneId: string;
  readonly subjectKind: ExecutiveRuntimeSceneSubjectKind;
  readonly presentationState?: ExecutiveRuntimeScenePresentationState;
  readonly visibility: ExecutiveRuntimeSceneVisibility;
  readonly activationState?: ExecutiveRuntimeSceneActivationState;
  readonly focus?: ExecutiveRuntimeSceneFocusContract;
  readonly attention?: ExecutiveRuntimeSceneAttentionContract;
  readonly readiness: ExecutiveRuntimeSceneRuntimeState;
  readonly runtimeSource: ExecutiveRuntimeSceneRuntimeSource;
}

export interface ExecutiveRuntimeScenePresentation {
  readonly subject: ExecutiveRuntimeSceneSubjectReference;
  readonly presentationState: ExecutiveRuntimeScenePresentationState;
  readonly visibility?: ExecutiveRuntimeSceneVisibility;
  readonly emphasis?: NonNullable<
    BoundExecutiveRuntimeExperienceState["presentation"]
  >["emphasis"];
  readonly priority?: number;
  readonly runtimeSource: ExecutiveRuntimeSceneRuntimeSource;
}

export interface ExecutiveRuntimeSceneFocus {
  readonly focusedSubject: ExecutiveRuntimeSceneSubjectReference;
  readonly relationship?: ExecutiveRuntimeSceneFocusContract["relationship"];
  readonly secondarySubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly scope?: ExecutiveRuntimeSceneFocusContract["scope"];
  readonly reason?: string;
  readonly runtimeSource: ExecutiveRuntimeSceneRuntimeSource;
}

export interface ExecutiveRuntimeSceneAttention {
  readonly subject: ExecutiveRuntimeSceneSubjectReference;
  readonly level?: ExecutiveRuntimeSceneAttentionContract["level"];
  readonly reason?: string;
  readonly scope?: ExecutiveRuntimeSceneAttentionContract["scope"];
  readonly persistence?: ExecutiveRuntimeSceneAttentionContract["persistence"];
  readonly runtimeSource: ExecutiveRuntimeSceneRuntimeSource;
}

export interface ExecutiveRuntimeSceneRelationship {
  readonly relationshipId: string;
  readonly sourceSubject: ExecutiveRuntimeSceneSubjectReference;
  readonly targetSubject: ExecutiveRuntimeSceneSubjectReference;
  readonly relationshipKind: ExecutiveRuntimeSceneRelationshipKind;
  readonly active: boolean;
  readonly emphasis?: NonNullable<
    BoundExecutiveRuntimeExperienceState["presentation"]
  >["emphasis"];
  readonly runtimeSource: ExecutiveRuntimeSceneRuntimeSource;
}

export interface ExecutiveRuntimeSceneNode {
  readonly nodeId: string;
  readonly subject: ExecutiveRuntimeSceneSubjectReference;
  readonly subjectKind: ExecutiveRuntimeSceneSubjectKind;
  readonly label?: string;
  readonly presentationState?: ExecutiveRuntimeScenePresentationState;
  readonly visibility: ExecutiveRuntimeSceneVisibility;
  readonly activation?: ExecutiveRuntimeSceneActivationState;
  readonly focus?: ExecutiveRuntimeSceneFocus;
  readonly attention?: ExecutiveRuntimeSceneAttention;
  readonly readiness: ExecutiveRuntimeSceneRuntimeState;
  readonly runtimeSource: ExecutiveRuntimeSceneRuntimeSource;
}

export interface ExecutiveRuntimeSceneEdge {
  readonly edgeId: string;
  readonly sourceNodeId: string;
  readonly targetNodeId: string;
  readonly relationshipKind: ExecutiveRuntimeSceneRelationshipKind;
  readonly active: boolean;
  readonly emphasis?: NonNullable<
    BoundExecutiveRuntimeExperienceState["presentation"]
  >["emphasis"];
  readonly runtimeSource: ExecutiveRuntimeSceneRuntimeSource;
}

export interface ExecutiveRuntimeSceneGraph {
  readonly sceneId: string;
  readonly nodes: ReadonlyArray<ExecutiveRuntimeSceneNode>;
  readonly edges: ReadonlyArray<ExecutiveRuntimeSceneEdge>;
  readonly activeNode?: ExecutiveRuntimeSceneNode;
  readonly focusedNodes: ReadonlyArray<ExecutiveRuntimeSceneNode>;
  readonly attentionNodes: ReadonlyArray<ExecutiveRuntimeSceneNode>;
  readonly presentation?: ExecutiveRuntimeScenePresentation;
  readonly readiness: ExecutiveRuntimeSceneReadiness;
  readonly authority: ExecutiveRuntimeSceneAuthority;
  readonly sourceVersion: ExecutiveRuntimeSceneAuthority["sourceVersion"];
  readonly bindingIdentity: typeof runtimeEnabledExecutiveExperienceSceneBindingIdentity;
  readonly bindingVersion: typeof runtimeEnabledExecutiveExperienceSceneBindingVersion;
}

/**
 * Narrow Stage-targeted scene surface relationship.
 * Stage is a scene target, not a UI component. Other surfaces remain independent.
 */
export interface ExecutiveRuntimeSceneSurfaceBinding {
  readonly targetSurface: "stage";
  readonly sceneAvailability: ExecutiveRuntimeSceneRuntimeState;
  readonly activation: ExecutiveRuntimeSceneActivationState;
  readonly readiness: ExecutiveRuntimeSceneRuntimeState;
  readonly activeSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly stagePresent: boolean;
}

export interface ExecutiveRuntimeSceneBindingInput {
  readonly boundState?: BoundExecutiveRuntimeExperienceState;
  readonly boundSnapshot?: ExecutiveRuntimeBoundSnapshot;
  readonly relationships?: ReadonlyArray<ExecutiveRuntimeSceneRelationship>;
  readonly sceneId?: string;
}

export interface ExecutiveRuntimeSceneBindingResult {
  readonly status: ExecutiveRuntimeSceneBindingStatus;
  readonly sceneGraph?: ExecutiveRuntimeSceneGraph;
  readonly sceneSubject?: ExecutiveRuntimeSceneSubject;
  readonly surfaceBinding?: ExecutiveRuntimeSceneSurfaceBinding;
  readonly issues: ReadonlyArray<ExecutiveRuntimeSceneBindingIssue>;
  readonly sourceIdentity: typeof runtimeEnabledExecutiveExperienceSceneBindingIdentity;
  readonly sourceVersion: typeof runtimeEnabledExecutiveExperienceSceneBindingVersion;
  readonly upstreamIdentity: typeof runtimeEnabledExecutiveExperienceStateBindingIdentity;
  readonly upstreamVersion: typeof runtimeEnabledExecutiveExperienceStateBindingVersion;
}

export interface ExecutiveRuntimeSceneSnapshot {
  readonly snapshotId: string;
  readonly sceneGraph: ExecutiveRuntimeSceneGraph;
  readonly activeSubject?: ExecutiveRuntimeSceneSubjectReference;
  readonly activeNode?: ExecutiveRuntimeSceneNode;
  readonly focus?: ExecutiveRuntimeSceneFocus;
  readonly attention?: ExecutiveRuntimeSceneAttention;
  readonly presentation?: ExecutiveRuntimeScenePresentation;
  readonly readiness: ExecutiveRuntimeSceneReadiness;
  readonly authority: ExecutiveRuntimeSceneAuthority;
  readonly sourceVersion: ExecutiveRuntimeSceneAuthority["sourceVersion"];
  readonly surfaceBinding?: ExecutiveRuntimeSceneSurfaceBinding;
  readonly bindingIdentity: typeof runtimeEnabledExecutiveExperienceSceneBindingIdentity;
  readonly bindingVersion: typeof runtimeEnabledExecutiveExperienceSceneBindingVersion;
  readonly timestampIso?: string;
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const EXECUTIVE_RUNTIME_SCENE_BINDING_GUARANTEES = Object.freeze([
  Object.freeze({
    id: "depends-only-on-rex-1-3",
    order: 1,
    statement: "REX-1:4 depends only on REX-1:3.",
  }),
  Object.freeze({
    id: "framework-neutral-scene-binding",
    order: 2,
    statement: "Scene binding is framework-neutral.",
  }),
  Object.freeze({
    id: "no-react-dependency",
    order: 3,
    statement: "No React dependency exists.",
  }),
  Object.freeze({
    id: "no-threejs-dependency",
    order: 4,
    statement: "No Three.js dependency exists.",
  }),
  Object.freeze({
    id: "nodes-no-renderer-objects",
    order: 5,
    statement: "Scene nodes contain no renderer objects.",
  }),
  Object.freeze({
    id: "edges-no-renderer-objects",
    order: 6,
    statement: "Scene edges contain no renderer objects.",
  }),
  Object.freeze({
    id: "no-layout-coordinates",
    order: 7,
    statement: "Layout coordinates are not calculated.",
  }),
  Object.freeze({
    id: "no-camera-behavior",
    order: 8,
    statement: "Camera behavior is not calculated.",
  }),
  Object.freeze({
    id: "no-animation-behavior",
    order: 9,
    statement: "Animation behavior is not implemented.",
  }),
  Object.freeze({
    id: "focus-bound-not-calculated",
    order: 10,
    statement: "Focus is bound, not calculated.",
  }),
  Object.freeze({
    id: "attention-bound-not-calculated",
    order: 11,
    statement: "Attention is bound, not calculated.",
  }),
  Object.freeze({
    id: "presentation-bound-not-resolved",
    order: 12,
    statement: "Presentation is bound, not resolved.",
  }),
  Object.freeze({
    id: "visibility-represented-not-rendered",
    order: 13,
    statement: "Visibility is represented, not rendered.",
  }),
  Object.freeze({
    id: "runtime-authority-preserved",
    order: 14,
    statement: "Runtime authority is preserved.",
  }),
  Object.freeze({
    id: "subject-identity-preserved",
    order: 15,
    statement: "Subject identity is preserved.",
  }),
  Object.freeze({
    id: "subject-ids-never-invented",
    order: 16,
    statement: "Subject IDs are never invented.",
  }),
  Object.freeze({
    id: "active-subject-never-inferred",
    order: 17,
    statement: "Active subject is never inferred.",
  }),
  Object.freeze({
    id: "node-order-deterministic",
    order: 18,
    statement: "Node order is deterministic.",
  }),
  Object.freeze({
    id: "edge-order-deterministic",
    order: 19,
    statement: "Edge order is deterministic.",
  }),
  Object.freeze({
    id: "no-caller-input-mutation",
    order: 20,
    statement: "Caller inputs are never mutated.",
  }),
  Object.freeze({
    id: "no-interaction-execution",
    order: 21,
    statement: "No interaction execution is introduced.",
  }),
  Object.freeze({
    id: "no-ai-reasoning",
    order: 22,
    statement: "No AI reasoning is introduced.",
  }),
  Object.freeze({
    id: "no-kpi-calculation",
    order: 23,
    statement: "No KPI calculation is introduced.",
  }),
  Object.freeze({
    id: "no-koi-calculation",
    order: 24,
    statement: "No KOI calculation is introduced.",
  }),
  Object.freeze({
    id: "no-persistence",
    order: 25,
    statement: "No persistence is introduced.",
  }),
  Object.freeze({
    id: "no-networking",
    order: 26,
    statement: "No networking is introduced.",
  }),
  Object.freeze({
    id: "no-store-event-bus",
    order: 27,
    statement: "No store/event bus is introduced.",
  }),
  Object.freeze({
    id: "stage-is-scene-target-not-component",
    order: 28,
    statement: "Stage is represented as a scene target, not a UI component.",
  }),
  Object.freeze({
    id: "surfaces-remain-independent",
    order: 29,
    statement:
      "Advisor/Insight/Timeline/Explorer remain independent surfaces.",
  }),
  Object.freeze({
    id: "presentation-states-unchanged",
    order: 30,
    statement: "Existing presentation states remain unchanged.",
  }),
] as const);

export type ExecutiveRuntimeSceneBindingGuarantee =
  (typeof EXECUTIVE_RUNTIME_SCENE_BINDING_GUARANTEES)[number];

export const EXECUTIVE_RUNTIME_SCENE_BINDING_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "Executive Stage rendering",
    "Three.js scene creation",
    "object geometry",
    "camera controls",
    "object centering",
    "Live Lens transitions",
    "connection arrows",
    "animations",
    "interaction orchestration",
    "click handlers",
    "layout coordinates",
    "focus calculation",
    "attention calculation",
    "KPI calculation",
    "KOI calculation",
    "AI reasoning",
    "persistence",
    "networking",
    "global store",
    "event bus",
  ] as const);

export const EXECUTIVE_RUNTIME_SCENE_BINDING_REGISTRY_SECTIONS = Object.freeze([
  "Identity",
  "Dependency",
  "Input",
  "SceneSubjects",
  "Visibility",
  "Presentation",
  "Focus",
  "Attention",
  "Relationships",
  "Nodes",
  "Edges",
  "SceneGraph",
  "SurfaceBinding",
  "Snapshot",
  "Status",
  "Issues",
  "Validation",
  "Guarantees",
] as const);

/**
 * Ordering rule:
 * Preserve upstream collection order whenever supplied.
 * Never reorder nodes based on focus or attention.
 * Never reorder edges based on activity.
 * Identical inputs produce identical ordered outputs.
 */
export const EXECUTIVE_RUNTIME_SCENE_ORDERING_RULE =
  "preserve-upstream-collection-order" as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

function issue(
  code: ExecutiveRuntimeSceneBindingIssueCode,
  message: string,
  path?: string,
): ExecutiveRuntimeSceneBindingIssue {
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

function subjectKey(subject: ExecutiveRuntimeSceneSubjectReference): string {
  return `${subject.kind}:${subject.id}`;
}

function nodeIdForSubject(
  subject: ExecutiveRuntimeSceneSubjectReference,
): string {
  return `node.${subject.kind}.${subject.id}`;
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

function isSubjectReference(
  value: unknown,
): value is ExecutiveRuntimeSceneSubjectReference {
  if (!isPlainObject(value)) return false;
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.kind) &&
    (
      [
        "goal",
        "object",
        "problem",
        "scenario",
        "decision",
        "execution",
        "kpi",
        "koi",
        "pack",
      ] as readonly string[]
    ).includes(value.kind)
  );
}

function mapPresentationVisibility(
  presentation: BoundExecutiveRuntimeExperienceState["presentation"],
): ExecutiveRuntimeSceneVisibility {
  const visibility = presentation?.visibility;
  if (visibility === "hidden") return "hidden";
  if (visibility === "dimmed") return "collapsed";
  return "visible";
}

function resolveBoundState(
  input: ExecutiveRuntimeSceneBindingInput,
): BoundExecutiveRuntimeExperienceState | undefined {
  if (input.boundState !== undefined) return input.boundState;
  if (input.boundSnapshot !== undefined) {
    return Object.freeze({
      context: input.boundSnapshot.context,
      surfaceStates: input.boundSnapshot.surfaceStates,
      readiness: input.boundSnapshot.readiness,
      authority: input.boundSnapshot.authority,
      contractIdentity:
        "REX-1:2/ExecutiveRuntimeContracts" as BoundExecutiveRuntimeExperienceState["contractIdentity"],
      contractVersion:
        "1.2.0" as BoundExecutiveRuntimeExperienceState["contractVersion"],
      bindingIdentity: input.boundSnapshot.bindingIdentity,
      bindingVersion: input.boundSnapshot.bindingVersion,
      ...(input.boundSnapshot.activeSubject !== undefined
        ? { activeSubject: input.boundSnapshot.activeSubject }
        : {}),
      ...(input.boundSnapshot.activeSurface !== undefined
        ? { activeSurface: input.boundSnapshot.activeSurface }
        : {}),
      ...(input.boundSnapshot.focus !== undefined
        ? { focus: input.boundSnapshot.focus }
        : {}),
      ...(input.boundSnapshot.attention !== undefined
        ? { attention: input.boundSnapshot.attention }
        : {}),
      ...(input.boundSnapshot.presentation !== undefined
        ? { presentation: input.boundSnapshot.presentation }
        : {}),
    });
  }
  return undefined;
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function isExecutiveRuntimeSceneVisibility(
  value: unknown,
): value is ExecutiveRuntimeSceneVisibility {
  return (
    EXECUTIVE_RUNTIME_SCENE_VISIBILITY as readonly unknown[]
  ).includes(value);
}

export function isExecutiveRuntimeSceneRelationshipKind(
  value: unknown,
): value is ExecutiveRuntimeSceneRelationshipKind {
  return (
    EXECUTIVE_RUNTIME_SCENE_RELATIONSHIP_KINDS as readonly unknown[]
  ).includes(value);
}

export function validateExecutiveRuntimeSceneNode(
  value: unknown,
): value is ExecutiveRuntimeSceneNode {
  if (!isPlainObject(value)) return false;
  return (
    isNonEmptyString(value.nodeId) &&
    isSubjectReference(value.subject) &&
    value.subjectKind === value.subject.kind &&
    isExecutiveRuntimeSceneVisibility(value.visibility) &&
    isNonEmptyString(value.readiness) &&
    value.runtimeSource !== undefined
  );
}

export function validateExecutiveRuntimeSceneEdge(
  value: unknown,
): value is ExecutiveRuntimeSceneEdge {
  if (!isPlainObject(value)) return false;
  return (
    isNonEmptyString(value.edgeId) &&
    isNonEmptyString(value.sourceNodeId) &&
    isNonEmptyString(value.targetNodeId) &&
    isExecutiveRuntimeSceneRelationshipKind(value.relationshipKind) &&
    typeof value.active === "boolean" &&
    value.runtimeSource !== undefined
  );
}

export function validateExecutiveRuntimeSceneGraph(
  value: unknown,
): value is ExecutiveRuntimeSceneGraph {
  if (!isPlainObject(value)) return false;
  if (!isNonEmptyString(value.sceneId)) return false;
  if (!Array.isArray(value.nodes) || !Array.isArray(value.edges)) return false;
  if (!value.nodes.every((node) => validateExecutiveRuntimeSceneNode(node))) {
    return false;
  }
  if (!value.edges.every((edge) => validateExecutiveRuntimeSceneEdge(edge))) {
    return false;
  }
  return (
    Array.isArray(value.focusedNodes) &&
    Array.isArray(value.attentionNodes) &&
    value.readiness !== undefined &&
    value.authority !== undefined &&
    value.bindingIdentity ===
      runtimeEnabledExecutiveExperienceSceneBindingIdentity &&
    value.bindingVersion ===
      runtimeEnabledExecutiveExperienceSceneBindingVersion
  );
}

// ─── Binding helpers ────────────────────────────────────────────────────────

export function bindExecutiveRuntimeActiveSceneSubject(
  boundState: BoundExecutiveRuntimeExperienceState,
): ExecutiveRuntimeSceneSubjectReference | undefined {
  if (boundState.activeSubject === undefined) return undefined;
  if (!isSubjectReference(boundState.activeSubject)) {
    throw new TypeError("active scene subject is structurally invalid");
  }
  return freezeSubject(boundState.activeSubject);
}

export function bindExecutiveRuntimeSceneFocus(
  focus: BoundExecutiveRuntimeExperienceState["focus"],
): ExecutiveRuntimeSceneFocus | undefined {
  if (focus === undefined) return undefined;
  if (!isSubjectReference(focus.focusedSubject)) {
    throw new TypeError("scene focus subject is structurally invalid");
  }
  return Object.freeze({
    focusedSubject: freezeSubject(focus.focusedSubject),
    runtimeSource: focus.runtimeSource,
    ...(focus.relationship !== undefined
      ? { relationship: focus.relationship }
      : {}),
    ...(focus.secondarySubject !== undefined
      ? { secondarySubject: freezeSubject(focus.secondarySubject) }
      : {}),
    ...(focus.scope !== undefined ? { scope: focus.scope } : {}),
    ...(focus.reason !== undefined ? { reason: focus.reason } : {}),
  });
}

export function bindExecutiveRuntimeSceneAttention(
  attention: BoundExecutiveRuntimeExperienceState["attention"],
): ExecutiveRuntimeSceneAttention | undefined {
  if (attention === undefined) return undefined;
  if (!isSubjectReference(attention.subject)) {
    throw new TypeError("scene attention subject is structurally invalid");
  }
  return Object.freeze({
    subject: freezeSubject(attention.subject),
    runtimeSource: attention.runtimeSource,
    ...(attention.level !== undefined ? { level: attention.level } : {}),
    ...(attention.reason !== undefined ? { reason: attention.reason } : {}),
    ...(attention.scope !== undefined ? { scope: attention.scope } : {}),
    ...(attention.persistence !== undefined
      ? { persistence: attention.persistence }
      : {}),
  });
}

export function bindExecutiveRuntimeScenePresentation(
  presentation: BoundExecutiveRuntimeExperienceState["presentation"],
): ExecutiveRuntimeScenePresentation | undefined {
  if (presentation === undefined) return undefined;
  if (!isSubjectReference(presentation.subject)) {
    throw new TypeError("scene presentation subject is structurally invalid");
  }
  if (
    presentation.presentationState !== "minimum" &&
    presentation.presentationState !== "report" &&
    presentation.presentationState !== "operation"
  ) {
    throw new TypeError(
      "presentation state must remain minimum, report, or operation",
    );
  }
  return Object.freeze({
    subject: freezeSubject(presentation.subject),
    presentationState: presentation.presentationState,
    runtimeSource: presentation.runtimeSource,
    visibility: mapPresentationVisibility(presentation),
    ...(presentation.emphasis !== undefined
      ? { emphasis: presentation.emphasis }
      : {}),
    ...(presentation.priority !== undefined
      ? { priority: presentation.priority }
      : {}),
  });
}

export function bindExecutiveRuntimeSceneSurface(
  surfaceStates: ReadonlyArray<BoundExecutiveRuntimeSurfaceState>,
  activeSubject: ExecutiveRuntimeSceneSubjectReference | undefined,
): ExecutiveRuntimeSceneSurfaceBinding {
  const stage = surfaceStates.find((surface) => surface.surface === "stage");
  if (stage === undefined) {
    return Object.freeze({
      targetSurface: "stage" as const,
      sceneAvailability: "unavailable" as ExecutiveRuntimeSceneRuntimeState,
      activation: "inactive" as ExecutiveRuntimeSceneActivationState,
      readiness: "unavailable" as ExecutiveRuntimeSceneRuntimeState,
      stagePresent: false,
      ...(activeSubject !== undefined ? { activeSubject } : {}),
    });
  }
  return Object.freeze({
    targetSurface: "stage" as const,
    sceneAvailability: stage.availability,
    activation: stage.activation,
    readiness: stage.readiness,
    stagePresent: true,
    ...(activeSubject !== undefined
      ? { activeSubject }
      : stage.activeSubject !== undefined
        ? { activeSubject: freezeSubject(stage.activeSubject) }
        : {}),
  });
}

export function bindExecutiveRuntimeSceneNode(input: {
  readonly subject: ExecutiveRuntimeSceneSubjectReference;
  readonly sceneId: string;
  readonly boundState: BoundExecutiveRuntimeExperienceState;
  readonly visibility?: ExecutiveRuntimeSceneVisibility;
}): ExecutiveRuntimeSceneNode {
  if (!isSubjectReference(input.subject)) {
    throw new TypeError("scene node subject is structurally invalid");
  }
  const subject = freezeSubject(input.subject);
  const focus = bindExecutiveRuntimeSceneFocus(input.boundState.focus);
  const attention = bindExecutiveRuntimeSceneAttention(
    input.boundState.attention,
  );
  const presentation = bindExecutiveRuntimeScenePresentation(
    input.boundState.presentation,
  );
  const subjectFocus =
    focus !== undefined && subjectKey(focus.focusedSubject) === subjectKey(subject)
      ? focus
      : undefined;
  const subjectAttention =
    attention !== undefined &&
    subjectKey(attention.subject) === subjectKey(subject)
      ? attention
      : undefined;

  return Object.freeze({
    nodeId: nodeIdForSubject(subject),
    subject,
    subjectKind: subject.kind,
    visibility:
      input.visibility ??
      (presentation !== undefined
        ? presentation.visibility ?? "visible"
        : "visible"),
    readiness: input.boundState.context.runtimeState,
    runtimeSource: input.boundState.authority.runtimeSource,
    ...(subject.label !== undefined ? { label: subject.label } : {}),
    ...(presentation !== undefined &&
    subjectKey(presentation.subject) === subjectKey(subject)
      ? { presentationState: presentation.presentationState }
      : {}),
    ...(input.boundState.activeSurface !== undefined
      ? { activation: input.boundState.activeSurface.activationState }
      : {}),
    ...(subjectFocus !== undefined ? { focus: subjectFocus } : {}),
    ...(subjectAttention !== undefined ? { attention: subjectAttention } : {}),
  });
}

/**
 * Collect scene subjects in stable upstream-derived order:
 * active → focus primary → focus secondary → attention → presentation →
 * surface-state subjects (surfaceStates collection order).
 * Never reorder by focus/attention activity.
 */
function collectSceneSubjects(
  boundState: BoundExecutiveRuntimeExperienceState,
): ReadonlyArray<ExecutiveRuntimeSceneSubjectReference> {
  const ordered: ExecutiveRuntimeSceneSubjectReference[] = [];
  const seen = new Set<string>();

  const push = (
    subject: ExecutiveRuntimeSceneSubjectReference | undefined,
  ): void => {
    if (subject === undefined || !isSubjectReference(subject)) return;
    const key = subjectKey(subject);
    if (seen.has(key)) return;
    seen.add(key);
    ordered.push(freezeSubject(subject));
  };

  push(boundState.activeSubject);
  push(boundState.focus?.focusedSubject);
  push(boundState.focus?.secondarySubject);
  push(boundState.attention?.subject);
  push(boundState.presentation?.subject);
  for (const surface of boundState.surfaceStates) {
    push(surface.activeSubject);
    push(surface.focus?.focusedSubject);
    push(surface.focus?.secondarySubject);
    push(surface.attention?.subject);
    push(surface.presentation?.subject);
  }

  return Object.freeze(ordered);
}

export function bindExecutiveRuntimeSceneNodes(
  boundState: BoundExecutiveRuntimeExperienceState,
  sceneId: string,
): ReadonlyArray<ExecutiveRuntimeSceneNode> {
  const subjects = collectSceneSubjects(boundState);
  return Object.freeze(
    subjects.map((subject) =>
      bindExecutiveRuntimeSceneNode({ subject, sceneId, boundState }),
    ),
  );
}

export function bindExecutiveRuntimeSceneEdge(input: {
  readonly relationship: ExecutiveRuntimeSceneRelationship;
  readonly nodes: ReadonlyArray<ExecutiveRuntimeSceneNode>;
}): {
  readonly edge?: ExecutiveRuntimeSceneEdge;
  readonly issues: ReadonlyArray<ExecutiveRuntimeSceneBindingIssue>;
} {
  const relationship = input.relationship;
  const issues: ExecutiveRuntimeSceneBindingIssue[] = [];

  if (!isNonEmptyString(relationship.relationshipId)) {
    issues.push(
      issue(
        "invalid-scene-edge",
        "relationship id must be a non-empty string",
        "relationshipId",
      ),
    );
  }
  if (!isExecutiveRuntimeSceneRelationshipKind(relationship.relationshipKind)) {
    issues.push(
      issue(
        "invalid-relationship-kind",
        "relationship kind is not a known scene relationship kind",
        "relationshipKind",
      ),
    );
  }
  if (!isSubjectReference(relationship.sourceSubject)) {
    issues.push(
      issue(
        "invalid-scene-subject",
        "relationship source subject is invalid",
        "sourceSubject",
      ),
    );
  }
  if (!isSubjectReference(relationship.targetSubject)) {
    issues.push(
      issue(
        "invalid-scene-subject",
        "relationship target subject is invalid",
        "targetSubject",
      ),
    );
  }

  const sourceNodeId = isSubjectReference(relationship.sourceSubject)
    ? nodeIdForSubject(relationship.sourceSubject)
    : undefined;
  const targetNodeId = isSubjectReference(relationship.targetSubject)
    ? nodeIdForSubject(relationship.targetSubject)
    : undefined;
  const nodeIds = new Set(input.nodes.map((node) => node.nodeId));

  if (sourceNodeId !== undefined && !nodeIds.has(sourceNodeId)) {
    issues.push(
      issue(
        "relationship-source-missing",
        `source node ${sourceNodeId} is not present in the scene graph`,
        "sourceSubject",
      ),
    );
  }
  if (targetNodeId !== undefined && !nodeIds.has(targetNodeId)) {
    issues.push(
      issue(
        "relationship-target-missing",
        `target node ${targetNodeId} is not present in the scene graph`,
        "targetSubject",
      ),
    );
  }

  if (issues.length > 0 || sourceNodeId === undefined || targetNodeId === undefined) {
    return { issues: Object.freeze(issues) };
  }

  return {
    edge: Object.freeze({
      edgeId: `edge.${relationship.relationshipId}`,
      sourceNodeId,
      targetNodeId,
      relationshipKind: relationship.relationshipKind,
      active: relationship.active,
      runtimeSource: relationship.runtimeSource,
      ...(relationship.emphasis !== undefined
        ? { emphasis: relationship.emphasis }
        : {}),
    }),
    issues: Object.freeze(issues),
  };
}

/**
 * Preserve relationship input order. Never reorder edges by activity.
 */
export function bindExecutiveRuntimeSceneEdges(
  relationships: ReadonlyArray<ExecutiveRuntimeSceneRelationship> | undefined,
  nodes: ReadonlyArray<ExecutiveRuntimeSceneNode>,
): {
  readonly edges: ReadonlyArray<ExecutiveRuntimeSceneEdge>;
  readonly issues: ReadonlyArray<ExecutiveRuntimeSceneBindingIssue>;
} {
  if (relationships === undefined || relationships.length === 0) {
    return { edges: Object.freeze([]), issues: Object.freeze([]) };
  }

  const edges: ExecutiveRuntimeSceneEdge[] = [];
  const issues: ExecutiveRuntimeSceneBindingIssue[] = [];
  const seen = new Set<string>();

  for (const relationship of relationships) {
    const bound = bindExecutiveRuntimeSceneEdge({ relationship, nodes });
    issues.push(...bound.issues);
    if (bound.edge === undefined) continue;
    if (seen.has(bound.edge.edgeId)) {
      issues.push(
        issue(
          "duplicate-scene-edge",
          `duplicate edge id ${bound.edge.edgeId}`,
          "relationshipId",
        ),
      );
      continue;
    }
    seen.add(bound.edge.edgeId);
    edges.push(bound.edge);
  }

  return {
    edges: Object.freeze(edges),
    issues: Object.freeze(issues),
  };
}

export function bindExecutiveRuntimeSceneGraph(
  input: ExecutiveRuntimeSceneBindingInput,
): {
  readonly graph?: ExecutiveRuntimeSceneGraph;
  readonly surfaceBinding?: ExecutiveRuntimeSceneSurfaceBinding;
  readonly sceneSubject?: ExecutiveRuntimeSceneSubject;
  readonly issues: ReadonlyArray<ExecutiveRuntimeSceneBindingIssue>;
} {
  const issues: ExecutiveRuntimeSceneBindingIssue[] = [];
  const boundState = resolveBoundState(input);

  if (boundState === undefined) {
    return {
      issues: Object.freeze([
        issue(
          "missing-bound-runtime-state",
          "bound executive runtime state is required for scene binding",
          "boundState",
        ),
      ]),
    };
  }

  if (!validateBoundExecutiveRuntimeExperienceState(boundState)) {
    return {
      issues: Object.freeze([
        issue(
          "missing-bound-runtime-state",
          "bound executive runtime state is structurally invalid",
          "boundState",
        ),
      ]),
    };
  }

  if (
    boundState.authority === undefined ||
    boundState.authority.relationship !== "EX-DRI → REX"
  ) {
    issues.push(
      issue(
        "missing-runtime-authority",
        "runtime authority must preserve EX-DRI → REX",
        "authority",
      ),
    );
  }

  const sceneId =
    input.sceneId ?? `scene.${boundState.context.experienceId}`;
  const activeSubject = bindExecutiveRuntimeActiveSceneSubject(boundState);
  const nodes = bindExecutiveRuntimeSceneNodes(boundState, sceneId);
  const edgeResult = bindExecutiveRuntimeSceneEdges(
    input.relationships,
    nodes,
  );
  issues.push(...edgeResult.issues);

  const presentation = bindExecutiveRuntimeScenePresentation(
    boundState.presentation,
  );
  if (presentation === undefined) {
    issues.push(
      issue(
        "presentation-unavailable",
        "presentation was not available on the bound runtime state",
        "presentation",
      ),
    );
  }

  const surfaceBinding = bindExecutiveRuntimeSceneSurface(
    boundState.surfaceStates,
    activeSubject,
  );
  if (!surfaceBinding.stagePresent) {
    issues.push(
      issue(
        "missing-stage-surface",
        "stage surface state was not present in bound surface states",
        "surfaceStates",
      ),
    );
  }

  const focus = bindExecutiveRuntimeSceneFocus(boundState.focus);
  const attention = bindExecutiveRuntimeSceneAttention(boundState.attention);

  const focusedNodes = Object.freeze(
    nodes.filter(
      (node) =>
        focus !== undefined &&
        (subjectKey(node.subject) === subjectKey(focus.focusedSubject) ||
          (focus.secondarySubject !== undefined &&
            subjectKey(node.subject) ===
              subjectKey(focus.secondarySubject))),
    ),
  );
  const attentionNodes = Object.freeze(
    nodes.filter(
      (node) =>
        attention !== undefined &&
        subjectKey(node.subject) === subjectKey(attention.subject),
    ),
  );
  const activeNode =
    activeSubject === undefined
      ? undefined
      : nodes.find(
          (node) => subjectKey(node.subject) === subjectKey(activeSubject),
        );

  const sceneSubject =
    activeSubject === undefined
      ? undefined
      : Object.freeze({
          subject: activeSubject,
          sceneId,
          subjectKind: activeSubject.kind,
          visibility:
            presentation?.visibility ??
            ("visible" as ExecutiveRuntimeSceneVisibility),
          readiness: boundState.context.runtimeState,
          runtimeSource: boundState.authority.runtimeSource,
          ...(presentation !== undefined
            ? { presentationState: presentation.presentationState }
            : {}),
          ...(boundState.activeSurface !== undefined
            ? { activationState: boundState.activeSurface.activationState }
            : {}),
          ...(focus !== undefined
            ? {
                focus: boundState.focus,
              }
            : {}),
          ...(attention !== undefined
            ? {
                attention: boundState.attention,
              }
            : {}),
        } as ExecutiveRuntimeSceneSubject);

  if (issues.some((entry) => entry.code === "missing-runtime-authority")) {
    return {
      surfaceBinding,
      sceneSubject,
      issues: Object.freeze(issues),
    };
  }

  const graph: ExecutiveRuntimeSceneGraph = Object.freeze({
    sceneId,
    nodes,
    edges: edgeResult.edges,
    focusedNodes,
    attentionNodes,
    readiness: boundState.readiness,
    authority: boundState.authority,
    sourceVersion: boundState.authority.sourceVersion,
    bindingIdentity: runtimeEnabledExecutiveExperienceSceneBindingIdentity,
    bindingVersion: runtimeEnabledExecutiveExperienceSceneBindingVersion,
    ...(activeNode !== undefined ? { activeNode } : {}),
    ...(presentation !== undefined ? { presentation } : {}),
  });

  return {
    graph,
    surfaceBinding,
    sceneSubject,
    issues: Object.freeze(issues),
  };
}

function deriveSceneBindingStatus(args: {
  readonly issues: ReadonlyArray<ExecutiveRuntimeSceneBindingIssue>;
  readonly graph?: ExecutiveRuntimeSceneGraph;
  readonly boundState?: BoundExecutiveRuntimeExperienceState;
  readonly surfaceBinding?: ExecutiveRuntimeSceneSurfaceBinding;
}): ExecutiveRuntimeSceneBindingStatus {
  const invalidCodes: ReadonlyArray<ExecutiveRuntimeSceneBindingIssueCode> = [
    "invalid-scene-subject",
    "invalid-scene-node",
    "invalid-scene-edge",
    "invalid-relationship-kind",
    "duplicate-scene-node",
    "duplicate-scene-edge",
    "missing-runtime-authority",
    "missing-bound-runtime-state",
  ];
  if (args.issues.some((entry) => invalidCodes.includes(entry.code))) {
    return "invalid";
  }
  if (
    args.boundState === undefined ||
    args.graph === undefined ||
    args.boundState.context.runtimeState === "unavailable" ||
    args.boundState.readiness.runtimeAvailable === false ||
    args.surfaceBinding?.sceneAvailability === "unavailable"
  ) {
    return "unavailable";
  }
  if (
    args.issues.length > 0 ||
    args.boundState.readiness.overallReady === false ||
    args.boundState.activeSubject === undefined ||
    args.graph.presentation === undefined
  ) {
    return "partial";
  }
  return "bound";
}

export function bindExecutiveRuntimeScene(
  input: ExecutiveRuntimeSceneBindingInput,
): ExecutiveRuntimeSceneBindingResult {
  const boundState = resolveBoundState(input);
  const bound = bindExecutiveRuntimeSceneGraph(input);
  const status = deriveSceneBindingStatus({
    issues: bound.issues,
    graph: bound.graph,
    boundState,
    surfaceBinding: bound.surfaceBinding,
  });

  return Object.freeze({
    status,
    issues: bound.issues,
    sourceIdentity: runtimeEnabledExecutiveExperienceSceneBindingIdentity,
    sourceVersion: runtimeEnabledExecutiveExperienceSceneBindingVersion,
    upstreamIdentity: runtimeEnabledExecutiveExperienceStateBindingIdentity,
    upstreamVersion: runtimeEnabledExecutiveExperienceStateBindingVersion,
    ...(bound.graph !== undefined && status !== "invalid"
      ? { sceneGraph: bound.graph }
      : {}),
    ...(bound.sceneSubject !== undefined && status !== "invalid"
      ? { sceneSubject: bound.sceneSubject }
      : {}),
    ...(bound.surfaceBinding !== undefined && status !== "invalid"
      ? { surfaceBinding: bound.surfaceBinding }
      : {}),
  });
}

export function createExecutiveRuntimeSceneSnapshot(input: {
  readonly snapshotId: string;
  readonly sceneGraph: ExecutiveRuntimeSceneGraph;
  readonly surfaceBinding?: ExecutiveRuntimeSceneSurfaceBinding;
  readonly timestampIso?: string;
}): ExecutiveRuntimeSceneSnapshot {
  if (!isNonEmptyString(input.snapshotId)) {
    throw new TypeError("snapshotId must be a non-empty opaque identifier");
  }
  if (!validateExecutiveRuntimeSceneGraph(input.sceneGraph)) {
    throw new TypeError("sceneGraph must be a valid executive scene graph");
  }

  return Object.freeze({
    snapshotId: input.snapshotId,
    sceneGraph: input.sceneGraph,
    readiness: input.sceneGraph.readiness,
    authority: input.sceneGraph.authority,
    sourceVersion: input.sceneGraph.sourceVersion,
    bindingIdentity: runtimeEnabledExecutiveExperienceSceneBindingIdentity,
    bindingVersion: runtimeEnabledExecutiveExperienceSceneBindingVersion,
    ...(input.sceneGraph.activeNode !== undefined
      ? {
          activeNode: input.sceneGraph.activeNode,
          activeSubject: input.sceneGraph.activeNode.subject,
        }
      : {}),
    ...(input.sceneGraph.activeNode?.focus !== undefined
      ? { focus: input.sceneGraph.activeNode.focus }
      : {}),
    ...(input.sceneGraph.attentionNodes[0]?.attention !== undefined
      ? { attention: input.sceneGraph.attentionNodes[0].attention }
      : {}),
    ...(input.sceneGraph.presentation !== undefined
      ? { presentation: input.sceneGraph.presentation }
      : {}),
    ...(input.surfaceBinding !== undefined
      ? { surfaceBinding: input.surfaceBinding }
      : {}),
    ...(input.timestampIso !== undefined
      ? { timestampIso: input.timestampIso }
      : {}),
  });
}

export function getRuntimeEnabledExecutiveExperienceSceneBindingIdentity():
  typeof runtimeEnabledExecutiveExperienceSceneBindingCanonicalIdentity {
  return runtimeEnabledExecutiveExperienceSceneBindingCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperienceSceneBindingApiNames =
  Object.freeze([
    "getRuntimeEnabledExecutiveExperienceSceneBindingIdentity",
    "isExecutiveRuntimeSceneVisibility",
    "isExecutiveRuntimeSceneRelationshipKind",
    "validateExecutiveRuntimeSceneNode",
    "validateExecutiveRuntimeSceneEdge",
    "validateExecutiveRuntimeSceneGraph",
    "bindExecutiveRuntimeActiveSceneSubject",
    "bindExecutiveRuntimeSceneFocus",
    "bindExecutiveRuntimeSceneAttention",
    "bindExecutiveRuntimeScenePresentation",
    "bindExecutiveRuntimeSceneSurface",
    "bindExecutiveRuntimeSceneNode",
    "bindExecutiveRuntimeSceneNodes",
    "bindExecutiveRuntimeSceneEdge",
    "bindExecutiveRuntimeSceneEdges",
    "bindExecutiveRuntimeSceneGraph",
    "bindExecutiveRuntimeScene",
    "createExecutiveRuntimeSceneSnapshot",
    "verifyExecutiveSceneBinding",
  ] as const);

export const runtimeEnabledExecutiveExperienceSceneBindingRegistry =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperienceSceneBindingIdentity,
    version: runtimeEnabledExecutiveExperienceSceneBindingVersion,
    namespace: runtimeEnabledExecutiveExperienceSceneBindingNamespace,
    layer: runtimeEnabledExecutiveExperienceSceneBindingLayer,
    phase: runtimeEnabledExecutiveExperienceSceneBindingPhase,
    stage: runtimeEnabledExecutiveExperienceSceneBindingStage,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceSceneBindingDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceSceneBindingDependencyPath,
    sections: EXECUTIVE_RUNTIME_SCENE_BINDING_REGISTRY_SECTIONS,
    sectionCount: EXECUTIVE_RUNTIME_SCENE_BINDING_REGISTRY_SECTIONS.length,
    visibility: EXECUTIVE_RUNTIME_SCENE_VISIBILITY,
    visibilityCount: EXECUTIVE_RUNTIME_SCENE_VISIBILITY.length,
    relationshipKinds: EXECUTIVE_RUNTIME_SCENE_RELATIONSHIP_KINDS,
    relationshipKindCount: EXECUTIVE_RUNTIME_SCENE_RELATIONSHIP_KINDS.length,
    statuses: EXECUTIVE_RUNTIME_SCENE_BINDING_STATUSES,
    statusCount: EXECUTIVE_RUNTIME_SCENE_BINDING_STATUSES.length,
    issueCodes: EXECUTIVE_RUNTIME_SCENE_BINDING_ISSUE_CODES,
    issueCodeCount: EXECUTIVE_RUNTIME_SCENE_BINDING_ISSUE_CODES.length,
    guarantees: EXECUTIVE_RUNTIME_SCENE_BINDING_GUARANTEES,
    guaranteeCount: EXECUTIVE_RUNTIME_SCENE_BINDING_GUARANTEES.length,
    orderingRule: EXECUTIVE_RUNTIME_SCENE_ORDERING_RULE,
    publicApis: runtimeEnabledExecutiveExperienceSceneBindingApiNames,
    publicApiCount:
      runtimeEnabledExecutiveExperienceSceneBindingApiNames.length,
  });

export const runtimeEnabledExecutiveExperienceSceneBinding = Object.freeze({
  phase: "REX-1" as const,
  name: "ExecutiveSceneBinding" as const,
  identity: runtimeEnabledExecutiveExperienceSceneBindingIdentity,
  version: runtimeEnabledExecutiveExperienceSceneBindingVersion,
  namespace: runtimeEnabledExecutiveExperienceSceneBindingNamespace,
  layer: runtimeEnabledExecutiveExperienceSceneBindingLayer,
  stage: runtimeEnabledExecutiveExperienceSceneBindingStage,
  architecturalRole:
    runtimeEnabledExecutiveExperienceSceneBindingArchitecturalRole,
  role: "ExecutiveSceneBinding" as const,
  status: runtimeEnabledExecutiveExperienceSceneBindingStability,
  upstreamDependency:
    runtimeEnabledExecutiveExperienceSceneBindingDependencyIdentity,
  dependencyPath:
    runtimeEnabledExecutiveExperienceSceneBindingDependencyPath,
  deterministic:
    runtimeEnabledExecutiveExperienceSceneBindingDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  sceneBinding: true as const,
  principle: EXECUTIVE_RUNTIME_SCENE_BINDING_PRINCIPLE,
  boundary: EXECUTIVE_RUNTIME_SCENE_BINDING_BOUNDARY,
  visibility: EXECUTIVE_RUNTIME_SCENE_VISIBILITY,
  relationshipKinds: EXECUTIVE_RUNTIME_SCENE_RELATIONSHIP_KINDS,
  statuses: EXECUTIVE_RUNTIME_SCENE_BINDING_STATUSES,
  issueCodes: EXECUTIVE_RUNTIME_SCENE_BINDING_ISSUE_CODES,
  guarantees: EXECUTIVE_RUNTIME_SCENE_BINDING_GUARANTEES,
  forbiddenResponsibilities:
    EXECUTIVE_RUNTIME_SCENE_BINDING_FORBIDDEN_RESPONSIBILITIES,
  orderingRule: EXECUTIVE_RUNTIME_SCENE_ORDERING_RULE,
  publicApiSurface: runtimeEnabledExecutiveExperienceSceneBindingApiNames,
  registry: runtimeEnabledExecutiveExperienceSceneBindingRegistry,
  stateBindingBoundary: "REX-1:3-state-binding-only" as const,
  architecturalStatus:
    "Scene Binding Complete · Deterministic · Immutable · Framework-Independent · ReadyForExecutiveInteractionBinding" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface ExecutiveSceneBindingVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeEnabledExecutiveExperienceSceneBindingIdentity;
  readonly version: typeof runtimeEnabledExecutiveExperienceSceneBindingVersion;
  readonly namespace: typeof runtimeEnabledExecutiveExperienceSceneBindingNamespace;
  readonly layer: typeof runtimeEnabledExecutiveExperienceSceneBindingLayer;
  readonly phase: typeof runtimeEnabledExecutiveExperienceSceneBindingPhase;
  readonly stage: typeof runtimeEnabledExecutiveExperienceSceneBindingStage;
  readonly architecturalRole: typeof runtimeEnabledExecutiveExperienceSceneBindingArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeEnabledExecutiveExperienceSceneBindingDependencyIdentity;
  readonly visibilityCount: number;
  readonly relationshipKindCount: number;
  readonly statusCount: number;
  readonly issueCodeCount: number;
  readonly guaranteeCount: number;
  readonly registrySectionCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly stateBindingBoundaryIntact: boolean;
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

export function verifyExecutiveSceneBinding():
  ExecutiveSceneBindingVerification {
  const sceneBinding = runtimeEnabledExecutiveExperienceSceneBinding;
  const registry = runtimeEnabledExecutiveExperienceSceneBindingRegistry;

  const identityOk =
    sceneBinding.identity === "REX-1:4/ExecutiveSceneBinding" &&
    sceneBinding.version === "1.4.0" &&
    sceneBinding.namespace ===
      "nexora.rex.runtime-enabled-executive-experience.scene-binding" &&
    sceneBinding.layer === "REX" &&
    sceneBinding.phase === "REX-1" &&
    sceneBinding.stage === "ExecutiveSceneBinding" &&
    sceneBinding.architecturalRole ===
      "ExecutiveRuntimeSceneBindingBoundary" &&
    sceneBinding.upstreamDependency ===
      "REX-1:3/RuntimeContextStateBinding" &&
    sceneBinding.upstreamDependency ===
      runtimeEnabledExecutiveExperienceStateBindingIdentity &&
    sceneBinding.stateBindingBoundary === "REX-1:3-state-binding-only";

  const dependencyOk =
    sceneBinding.dependencyPath ===
      "@/app/lib/rex/runtimeEnabledExecutiveExperienceStateBinding" &&
    EXECUTIVE_RUNTIME_SCENE_BINDING_BOUNDARY.consumesStateBindingOnly ===
      true &&
    EXECUTIVE_RUNTIME_SCENE_BINDING_BOUNDARY.importsContractsDirectly ===
      false &&
    EXECUTIVE_RUNTIME_SCENE_BINDING_BOUNDARY.importsFoundationDirectly ===
      false &&
    EXECUTIVE_RUNTIME_SCENE_BINDING_BOUNDARY.importsExDriDirectly === false;

  const vocabOk =
    exactOrder(EXECUTIVE_RUNTIME_SCENE_VISIBILITY, [
      "visible",
      "hidden",
      "collapsed",
    ]) &&
    exactOrder(EXECUTIVE_RUNTIME_SCENE_RELATIONSHIP_KINDS, [
      "depends-on",
      "influences",
      "contains",
      "associated-with",
      "precedes",
      "supports",
    ]) &&
    exactOrder(EXECUTIVE_RUNTIME_SCENE_BINDING_STATUSES, [
      "bound",
      "partial",
      "unavailable",
      "invalid",
    ]);

  const guaranteesPresent =
    EXECUTIVE_RUNTIME_SCENE_BINDING_GUARANTEES.length === 30 &&
    exactOrder(
      EXECUTIVE_RUNTIME_SCENE_BINDING_GUARANTEES.map((entry) => entry.id),
      [
        "depends-only-on-rex-1-3",
        "framework-neutral-scene-binding",
        "no-react-dependency",
        "no-threejs-dependency",
        "nodes-no-renderer-objects",
        "edges-no-renderer-objects",
        "no-layout-coordinates",
        "no-camera-behavior",
        "no-animation-behavior",
        "focus-bound-not-calculated",
        "attention-bound-not-calculated",
        "presentation-bound-not-resolved",
        "visibility-represented-not-rendered",
        "runtime-authority-preserved",
        "subject-identity-preserved",
        "subject-ids-never-invented",
        "active-subject-never-inferred",
        "node-order-deterministic",
        "edge-order-deterministic",
        "no-caller-input-mutation",
        "no-interaction-execution",
        "no-ai-reasoning",
        "no-kpi-calculation",
        "no-koi-calculation",
        "no-persistence",
        "no-networking",
        "no-store-event-bus",
        "stage-is-scene-target-not-component",
        "surfaces-remain-independent",
        "presentation-states-unchanged",
      ],
    ) &&
    EXECUTIVE_RUNTIME_SCENE_BINDING_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const orderingRuleValid =
    EXECUTIVE_RUNTIME_SCENE_ORDERING_RULE ===
    "preserve-upstream-collection-order";

  const immutabilityOk =
    Object.isFrozen(sceneBinding) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      runtimeEnabledExecutiveExperienceSceneBindingCanonicalIdentity,
    ) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_SCENE_VISIBILITY) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_SCENE_RELATIONSHIP_KINDS) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_SCENE_BINDING_GUARANTEES) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_SCENE_BINDING_BOUNDARY) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_SCENE_BINDING_ISSUE_CODES) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_SCENE_BINDING_REGISTRY_SECTIONS);

  const uniquenessOk =
    unique([...EXECUTIVE_RUNTIME_SCENE_VISIBILITY]) &&
    unique([...EXECUTIVE_RUNTIME_SCENE_RELATIONSHIP_KINDS]) &&
    unique([...EXECUTIVE_RUNTIME_SCENE_BINDING_ISSUE_CODES]) &&
    unique(EXECUTIVE_RUNTIME_SCENE_BINDING_GUARANTEES.map((entry) => entry.id));

  const stateBindingBoundaryIntact =
    sceneBinding.boundary.soleImmediateDependency ===
      "REX-1:3/RuntimeContextStateBinding" &&
    sceneBinding.boundary.consumesStateBindingOnly === true &&
    sceneBinding.boundary.infersActiveSubject === false &&
    sceneBinding.boundary.calculatesLayoutCoordinates === false;

  const frameworkIndependent =
    sceneBinding.frameworkIndependent === true &&
    sceneBinding.rendererIndependent === true &&
    sceneBinding.boundary.frameworkIndependent === true;

  const ok =
    identityOk &&
    dependencyOk &&
    vocabOk &&
    guaranteesPresent &&
    orderingRuleValid &&
    immutabilityOk &&
    uniquenessOk &&
    stateBindingBoundaryIntact &&
    frameworkIndependent &&
    sceneBinding.principle === EXECUTIVE_RUNTIME_SCENE_BINDING_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: runtimeEnabledExecutiveExperienceSceneBindingIdentity,
    version: runtimeEnabledExecutiveExperienceSceneBindingVersion,
    namespace: runtimeEnabledExecutiveExperienceSceneBindingNamespace,
    layer: runtimeEnabledExecutiveExperienceSceneBindingLayer,
    phase: runtimeEnabledExecutiveExperienceSceneBindingPhase,
    stage: runtimeEnabledExecutiveExperienceSceneBindingStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceSceneBindingArchitecturalRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceSceneBindingDependencyIdentity,
    visibilityCount: EXECUTIVE_RUNTIME_SCENE_VISIBILITY.length,
    relationshipKindCount: EXECUTIVE_RUNTIME_SCENE_RELATIONSHIP_KINDS.length,
    statusCount: EXECUTIVE_RUNTIME_SCENE_BINDING_STATUSES.length,
    issueCodeCount: EXECUTIVE_RUNTIME_SCENE_BINDING_ISSUE_CODES.length,
    guaranteeCount: EXECUTIVE_RUNTIME_SCENE_BINDING_GUARANTEES.length,
    registrySectionCount:
      EXECUTIVE_RUNTIME_SCENE_BINDING_REGISTRY_SECTIONS.length,
    publicApiCount:
      runtimeEnabledExecutiveExperienceSceneBindingApiNames.length,
    frozen: immutabilityOk,
    stateBindingBoundaryIntact,
    frameworkIndependent,
    guaranteesPresent,
    orderingRuleValid,
  });
}
