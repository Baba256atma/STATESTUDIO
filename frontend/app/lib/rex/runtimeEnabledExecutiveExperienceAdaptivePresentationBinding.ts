/**
 * REX-1:6 — Adaptive Presentation Binding.
 *
 * Binds runtime-approved scene/interaction state into a deterministic,
 * framework-neutral Executive Presentation Binding for later UI/rendering.
 *
 * Canonical flow:
 *   … → REX-1:5 Executive Interaction Binding → REX-1:6 Adaptive Presentation Binding
 *
 * Binds presentation decisions. Does not invent them, render them, or run
 * adaptive-presentation algorithms.
 */

import {
  EXECUTIVE_RUNTIME_INTERACTION_BINDING_STATUSES,
  EXECUTIVE_RUNTIME_INTERACTION_SURFACES,
  runtimeEnabledExecutiveExperienceInteractionBindingIdentity,
  runtimeEnabledExecutiveExperienceInteractionBindingVersion,
  type ExecutiveRuntimeActiveInteraction,
  type ExecutiveRuntimeInteractionBinding,
  type ExecutiveRuntimeInteractionBindingResult,
  type ExecutiveRuntimeInteractionBindingStatus,
  type ExecutiveRuntimeInteractionSnapshot,
  type ExecutiveRuntimeInteractionSurface,
  type ExecutiveRuntimeSurfaceInteractionBinding,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceInteractionBinding";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity =
  "REX-1:6/AdaptivePresentationBinding" as const;

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion =
  "1.6.0" as const;

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingNamespace =
  "nexora.rex.runtime-enabled-executive-experience.adaptive-presentation-binding" as const;

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingLayer =
  "REX" as const;

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingPhase =
  "REX-1" as const;

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingStage =
  "AdaptivePresentationBinding" as const;

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingArchitecturalRole =
  "ExecutiveRuntimeAdaptivePresentationBindingBoundary" as const;

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingDependencyIdentity =
  runtimeEnabledExecutiveExperienceInteractionBindingIdentity;

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingDependencyPath =
  "@/app/lib/rex/runtimeEnabledExecutiveExperienceInteractionBinding" as const;

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingStability =
  "AdaptivePresentationBindingReady" as const;

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingDeterministic =
  true as const;

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingMutationPolicy =
  "immutable" as const;

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingCanonicalIdentity =
  Object.freeze({
    identity:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
    version:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
    namespace:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingNamespace,
    layer: runtimeEnabledExecutiveExperienceAdaptivePresentationBindingLayer,
    phase: runtimeEnabledExecutiveExperienceAdaptivePresentationBindingPhase,
    stage: runtimeEnabledExecutiveExperienceAdaptivePresentationBindingStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingArchitecturalRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingDependencyPath,
    stabilityStatus:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingStability,
    deterministicStatus:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingDeterministic,
    sideEffectPolicy:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingSideEffectPolicy,
    mutationPolicy:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingMutationPolicy,
  });

export const EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_PRINCIPLE =
  "Runtime-bound Experience + Scene + Interaction State → Executive Presentation Binding. Presentation is bound, not calculated." as const;

export const EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-enabled-Executive-Experience" as const,
    presentationBindingAuthority: "REX-1:6" as const,
    architecturalRole:
      "ExecutiveRuntimeAdaptivePresentationBindingBoundary" as const,
    soleImmediateDependency: "REX-1:5/ExecutiveInteractionBinding" as const,
    consumesInteractionBindingOnly: true as const,
    importsSceneBindingDirectly: false as const,
    importsStateBindingDirectly: false as const,
    importsContractsDirectly: false as const,
    importsFoundationDirectly: false as const,
    importsExDriDirectly: false as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    calculatesPresentation: false as const,
    upgradesPresentationState: false as const,
    infersVisibilityFromFocus: false as const,
    fabricatesCriticalEmphasis: false as const,
    fabricatesHighPriority: false as const,
    calculatesFocus: false as const,
    calculatesAttention: false as const,
    executesInteraction: false as const,
    rewritesRuntimeAuthority: false as const,
  });

// ─── Derived / compatible vocabularies ──────────────────────────────────────

export type ExecutiveRuntimePresentationSubjectReference = NonNullable<
  ExecutiveRuntimeInteractionBinding["activeSubject"]
>;

export type ExecutiveRuntimePresentationAuthority = NonNullable<
  ExecutiveRuntimeInteractionBinding["authority"]
>;

export type ExecutiveRuntimePresentationRuntimeSource =
  ExecutiveRuntimePresentationAuthority["runtimeSource"];

/**
 * Canonical NexoraObject presentation states — preserved exactly.
 * Prefer upstream-compatible type from interaction/scene presentation.
 */
export type ExecutiveRuntimePresentationState = NonNullable<
  NonNullable<ExecutiveRuntimeInteractionBinding["presentation"]>["presentationState"]
>;

export const EXECUTIVE_RUNTIME_PRESENTATION_STATES = Object.freeze([
  "minimum",
  "report",
  "operation",
] as const);

/**
 * Scene-compatible visibility vocabulary carried through REX-1:5 presentation.
 */
export const EXECUTIVE_RUNTIME_PRESENTATION_VISIBILITY = Object.freeze([
  "visible",
  "hidden",
  "collapsed",
] as const);

export type ExecutiveRuntimePresentationVisibility =
  (typeof EXECUTIVE_RUNTIME_PRESENTATION_VISIBILITY)[number];

/**
 * Upstream-compatible emphasis values already carried on presentation contracts
 * (none / low / medium / high). Do not invent competing critical/strong semantics.
 */
export const EXECUTIVE_RUNTIME_PRESENTATION_EMPHASIS = Object.freeze([
  "none",
  "low",
  "medium",
  "high",
] as const);

export type ExecutiveRuntimePresentationEmphasis =
  (typeof EXECUTIVE_RUNTIME_PRESENTATION_EMPHASIS)[number];

/**
 * Compact priority vocabulary for optional string priorities.
 * Numeric upstream priorityScore is preserved separately when supplied.
 */
export const EXECUTIVE_RUNTIME_PRESENTATION_PRIORITIES = Object.freeze([
  "low",
  "normal",
  "high",
  "critical",
] as const);

export type ExecutiveRuntimePresentationPriority =
  (typeof EXECUTIVE_RUNTIME_PRESENTATION_PRIORITIES)[number];

/**
 * Optional density descriptor. Not used for layout calculation.
 */
export const EXECUTIVE_RUNTIME_PRESENTATION_DENSITIES = Object.freeze([
  "compact",
  "balanced",
  "detailed",
] as const);

export type ExecutiveRuntimePresentationDensity =
  (typeof EXECUTIVE_RUNTIME_PRESENTATION_DENSITIES)[number];

export const EXECUTIVE_RUNTIME_PRESENTATION_SURFACES =
  EXECUTIVE_RUNTIME_INTERACTION_SURFACES;

export type ExecutiveRuntimePresentationSurface =
  ExecutiveRuntimeInteractionSurface;

export const EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_STATUSES =
  EXECUTIVE_RUNTIME_INTERACTION_BINDING_STATUSES;

export type ExecutiveRuntimeAdaptivePresentationBindingStatus =
  ExecutiveRuntimeInteractionBindingStatus;

export const EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_ISSUE_CODES =
  Object.freeze([
    "missing-interaction-binding",
    "missing-runtime-authority",
    "missing-active-surface",
    "missing-subject-presentation",
    "presentation-unavailable",
    "invalid-presentation-state",
    "invalid-visibility",
    "invalid-emphasis",
    "invalid-priority",
    "invalid-density",
    "surface-presentation-unavailable",
    "invalid-surface-presentation",
  ] as const);

export type ExecutiveRuntimeAdaptivePresentationBindingIssueCode =
  (typeof EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_ISSUE_CODES)[number];

export interface ExecutiveRuntimeAdaptivePresentationBindingIssue {
  readonly code: ExecutiveRuntimeAdaptivePresentationBindingIssueCode;
  readonly message: string;
  readonly path?: string;
}

/**
 * Ordering rule: preserve upstream subject/surface/interaction order.
 * Never reorder by focus, attention, emphasis, priority, or presentation state.
 */
export const EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_ORDERING_RULE =
  "preserve-upstream-collection-order" as const;

/**
 * Safe fallback rule: absent optional metadata remains undefined.
 * Never fabricate critical emphasis, high priority, upgraded presentation,
 * focus-inferred visibility, or density from subject count.
 */
export const EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_SAFE_FALLBACK_RULE =
  "absent-metadata-remains-undefined" as const;

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface ExecutiveRuntimePresentationReadiness {
  readonly runtimeReady: boolean;
  readonly contextReady: boolean;
  readonly subjectReady: boolean;
  readonly surfaceReady: boolean;
  readonly presentationReady: boolean;
  readonly interactionReady: boolean;
  readonly overallReady: boolean;
}

export interface ExecutiveRuntimeFocusPresentation {
  readonly subject: ExecutiveRuntimePresentationSubjectReference;
  readonly relationship?: NonNullable<
    ExecutiveRuntimeInteractionBinding["focus"]
  >["relationship"];
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly runtimeSource: ExecutiveRuntimePresentationRuntimeSource;
}

export interface ExecutiveRuntimeAttentionPresentation {
  readonly subject: ExecutiveRuntimePresentationSubjectReference;
  readonly level?: NonNullable<
    ExecutiveRuntimeInteractionBinding["attention"]
  >["level"];
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly persistence?: NonNullable<
    ExecutiveRuntimeInteractionBinding["attention"]
  >["persistence"];
  readonly runtimeSource: ExecutiveRuntimePresentationRuntimeSource;
}

export interface ExecutiveRuntimeInteractionPresentation {
  readonly interactionId: string;
  readonly interactionKind: ExecutiveRuntimeInteractionBinding["kind"];
  readonly sourceSurface: ExecutiveRuntimePresentationSurface;
  readonly targetSurface: ExecutiveRuntimePresentationSurface;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
}

export interface ExecutiveRuntimeSubjectPresentationBinding {
  readonly subject: ExecutiveRuntimePresentationSubjectReference;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly priority?: ExecutiveRuntimePresentationPriority;
  readonly priorityScore?: number;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly focus?: ExecutiveRuntimeFocusPresentation;
  readonly attention?: ExecutiveRuntimeAttentionPresentation;
  readonly interactionId?: string;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
  readonly authority: ExecutiveRuntimePresentationAuthority;
  readonly runtimeSource: ExecutiveRuntimePresentationRuntimeSource;
}

export interface ExecutiveRuntimeSurfacePresentationBinding {
  readonly surface: ExecutiveRuntimePresentationSurface;
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly priority?: ExecutiveRuntimePresentationPriority;
  readonly priorityScore?: number;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly activeInteraction?: ExecutiveRuntimeActiveInteraction;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
  readonly authority: ExecutiveRuntimePresentationAuthority;
}

export interface ExecutiveRuntimeStagePresentationBinding {
  readonly surface: "stage";
  readonly scenePresentationState?: ExecutiveRuntimePresentationState;
  readonly activeSubjectPresentation?: ExecutiveRuntimeSubjectPresentationBinding;
  readonly subjectPresentations: ReadonlyArray<ExecutiveRuntimeSubjectPresentationBinding>;
  readonly focusPresentation?: ExecutiveRuntimeFocusPresentation;
  readonly attentionPresentation?: ExecutiveRuntimeAttentionPresentation;
  readonly interactionPresentation?: ExecutiveRuntimeInteractionPresentation;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
}

export interface ExecutiveRuntimeAdvisorPresentationBinding {
  readonly surface: "advisor";
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly contextId?: string;
  readonly interactionReady: boolean;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
  readonly authority: ExecutiveRuntimePresentationAuthority;
}

export interface ExecutiveRuntimeInsightPresentationBinding {
  readonly surface: "insight";
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly selectedMetricId?: string;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
}

export interface ExecutiveRuntimeTimelinePresentationBinding {
  readonly surface: "timeline";
  readonly temporalContextId?: string;
  readonly selectedPackId?: string;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
}

export interface ExecutiveRuntimeExplorerPresentationBinding {
  readonly surface: "explorer";
  readonly collectionContextId?: string;
  readonly selectedSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
}

export interface ExecutiveRuntimeExperiencePresentationBinding {
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly activeSurface?: ExecutiveRuntimePresentationSurface;
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly surfacePresentations: ReadonlyArray<ExecutiveRuntimeSurfacePresentationBinding>;
  readonly subjectPresentations: ReadonlyArray<ExecutiveRuntimeSubjectPresentationBinding>;
  readonly focusPresentation?: ExecutiveRuntimeFocusPresentation;
  readonly attentionPresentation?: ExecutiveRuntimeAttentionPresentation;
  readonly interactionPresentation?: ExecutiveRuntimeInteractionPresentation;
  readonly stage?: ExecutiveRuntimeStagePresentationBinding;
  readonly advisor?: ExecutiveRuntimeAdvisorPresentationBinding;
  readonly insight?: ExecutiveRuntimeInsightPresentationBinding;
  readonly timeline?: ExecutiveRuntimeTimelinePresentationBinding;
  readonly explorer?: ExecutiveRuntimeExplorerPresentationBinding;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
  readonly authority: ExecutiveRuntimePresentationAuthority;
  readonly bindingIdentity: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity;
  readonly bindingVersion: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion;
}

/**
 * Optional approved per-surface presentation descriptor.
 * Enables cross-surface presentation differences without inventing decisions.
 */
export interface ExecutiveRuntimeSurfacePresentationDescriptor {
  readonly surface: ExecutiveRuntimePresentationSurface;
  readonly subject?: ExecutiveRuntimePresentationSubjectReference;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly priority?: ExecutiveRuntimePresentationPriority;
  readonly priorityScore?: number;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly selectedMetricId?: string;
  readonly temporalContextId?: string;
  readonly selectedPackId?: string;
  readonly collectionContextId?: string;
  readonly contextId?: string;
}

export interface ExecutiveRuntimeAdaptivePresentationBindingInput {
  readonly interactionSnapshot?: ExecutiveRuntimeInteractionSnapshot;
  readonly interactionBindingResult?: ExecutiveRuntimeInteractionBindingResult;
  readonly surfacePresentations?: ReadonlyArray<ExecutiveRuntimeSurfacePresentationDescriptor>;
}

export interface ExecutiveRuntimeAdaptivePresentationBindingResult {
  readonly status: ExecutiveRuntimeAdaptivePresentationBindingStatus;
  readonly experiencePresentation?: ExecutiveRuntimeExperiencePresentationBinding;
  readonly surfacePresentations: ReadonlyArray<ExecutiveRuntimeSurfacePresentationBinding>;
  readonly subjectPresentations: ReadonlyArray<ExecutiveRuntimeSubjectPresentationBinding>;
  readonly issues: ReadonlyArray<ExecutiveRuntimeAdaptivePresentationBindingIssue>;
  readonly sourceIdentity: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity;
  readonly sourceVersion: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion;
  readonly upstreamIdentity: typeof runtimeEnabledExecutiveExperienceInteractionBindingIdentity;
  readonly upstreamVersion: typeof runtimeEnabledExecutiveExperienceInteractionBindingVersion;
}

export interface ExecutiveRuntimePresentationSnapshot {
  readonly snapshotId: string;
  readonly experiencePresentation: ExecutiveRuntimeExperiencePresentationBinding;
  readonly surfacePresentations: ReadonlyArray<ExecutiveRuntimeSurfacePresentationBinding>;
  readonly subjectPresentations: ReadonlyArray<ExecutiveRuntimeSubjectPresentationBinding>;
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly activeSurface?: ExecutiveRuntimePresentationSurface;
  readonly focusPresentation?: ExecutiveRuntimeFocusPresentation;
  readonly attentionPresentation?: ExecutiveRuntimeAttentionPresentation;
  readonly interactionPresentation?: ExecutiveRuntimeInteractionPresentation;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
  readonly authority: ExecutiveRuntimePresentationAuthority;
  readonly sourceVersion: ExecutiveRuntimePresentationAuthority["sourceVersion"];
  readonly bindingIdentity: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity;
  readonly bindingVersion: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion;
  readonly timestampIso?: string;
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_GUARANTEES =
  Object.freeze([
    Object.freeze({
      id: "depends-only-on-rex-1-5",
      order: 1,
      statement: "REX-1:6 depends only on REX-1:5.",
    }),
    Object.freeze({
      id: "framework-neutral-presentation-binding",
      order: 2,
      statement: "Adaptive presentation binding is framework-neutral.",
    }),
    Object.freeze({
      id: "upstream-presentation-preserved",
      order: 3,
      statement: "Existing runtime presentation decisions are preserved.",
    }),
    Object.freeze({
      id: "presentation-bound-not-calculated",
      order: 4,
      statement: "Presentation state is bound, not calculated.",
    }),
    Object.freeze({
      id: "focus-represented-not-calculated",
      order: 5,
      statement: "Focus is represented, not calculated.",
    }),
    Object.freeze({
      id: "attention-represented-not-calculated",
      order: 6,
      statement: "Attention is represented, not calculated.",
    }),
    Object.freeze({
      id: "interaction-represented-not-executed",
      order: 7,
      statement: "Interaction is represented, not executed.",
    }),
    Object.freeze({
      id: "visibility-represented-not-rendered",
      order: 8,
      statement: "Visibility is represented, not rendered.",
    }),
    Object.freeze({
      id: "emphasis-represented-not-animated",
      order: 9,
      statement: "Emphasis is represented, not animated.",
    }),
    Object.freeze({
      id: "density-represented-not-layout",
      order: 10,
      statement: "Density is represented, not used for layout.",
    }),
    Object.freeze({
      id: "priority-represented-not-sorted",
      order: 11,
      statement: "Priority is represented, not used for automatic sorting.",
    }),
    Object.freeze({
      id: "runtime-authority-preserved",
      order: 12,
      statement: "Runtime authority is preserved.",
    }),
    Object.freeze({
      id: "subject-identity-preserved",
      order: 13,
      statement: "Subject identity is preserved.",
    }),
    Object.freeze({
      id: "surface-identity-preserved",
      order: 14,
      statement: "Surface identity is preserved.",
    }),
    Object.freeze({
      id: "presentation-may-differ-by-surface",
      order: 15,
      statement: "Presentation can differ by surface.",
    }),
    Object.freeze({
      id: "no-forced-global-presentation",
      order: 16,
      statement: "No global presentation state is forced.",
    }),
    Object.freeze({
      id: "no-aggressive-defaults",
      order: 17,
      statement:
        "Missing metadata does not produce aggressive presentation defaults.",
    }),
    Object.freeze({
      id: "no-caller-input-mutation",
      order: 18,
      statement: "Caller-owned inputs are never mutated.",
    }),
    Object.freeze({
      id: "deterministic-ordering",
      order: 19,
      statement: "Output ordering is deterministic.",
    }),
    Object.freeze({
      id: "no-react-dependency",
      order: 20,
      statement: "No React dependency is introduced.",
    }),
    Object.freeze({
      id: "no-threejs-dependency",
      order: 21,
      statement: "No Three.js dependency is introduced.",
    }),
    Object.freeze({
      id: "no-renderer-dependency",
      order: 22,
      statement: "No renderer dependency is introduced.",
    }),
    Object.freeze({
      id: "no-camera-behavior",
      order: 23,
      statement: "No camera behavior is introduced.",
    }),
    Object.freeze({
      id: "no-animation-behavior",
      order: 24,
      statement: "No animation behavior is introduced.",
    }),
    Object.freeze({
      id: "no-ai-reasoning",
      order: 25,
      statement: "No AI reasoning is introduced.",
    }),
    Object.freeze({
      id: "no-kpi-calculation",
      order: 26,
      statement: "No KPI calculation is introduced.",
    }),
    Object.freeze({
      id: "no-koi-calculation",
      order: 27,
      statement: "No KOI calculation is introduced.",
    }),
    Object.freeze({
      id: "no-persistence",
      order: 28,
      statement: "No persistence is introduced.",
    }),
    Object.freeze({
      id: "no-networking",
      order: 29,
      statement: "No networking is introduced.",
    }),
    Object.freeze({
      id: "no-store-event-bus",
      order: 30,
      statement: "No global store/event bus is introduced.",
    }),
  ] as const);

export type ExecutiveRuntimeAdaptivePresentationBindingGuarantee =
  (typeof EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_GUARANTEES)[number];

export const EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "React integration",
    "Stage rendering",
    "object materials",
    "label rendering",
    "camera behavior",
    "node positioning",
    "animation",
    "click handling",
    "Live Lens",
    "Advisor message generation",
    "Insight chart generation",
    "Timeline replay",
    "Explorer drawer behavior",
    "presentation-state calculation",
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

export const EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "PresentationStates",
    "Visibility",
    "Emphasis",
    "Priority",
    "Density",
    "SubjectPresentation",
    "SurfacePresentation",
    "Stage",
    "Advisor",
    "Insight",
    "Timeline",
    "Explorer",
    "FocusPresentation",
    "AttentionPresentation",
    "InteractionPresentation",
    "Readiness",
    "Snapshot",
    "Status",
    "Issues",
    "Validation",
    "Guarantees",
  ] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function issue(
  code: ExecutiveRuntimeAdaptivePresentationBindingIssueCode,
  message: string,
  path?: string,
): ExecutiveRuntimeAdaptivePresentationBindingIssue {
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
  subject: ExecutiveRuntimePresentationSubjectReference,
): ExecutiveRuntimePresentationSubjectReference {
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

function subjectKey(
  subject: ExecutiveRuntimePresentationSubjectReference,
): string {
  return `${subject.kind}:${subject.id}`;
}

function resolveInteractionContext(
  input: ExecutiveRuntimeAdaptivePresentationBindingInput,
): {
  readonly snapshot?: ExecutiveRuntimeInteractionSnapshot;
  readonly result?: ExecutiveRuntimeInteractionBindingResult;
  readonly bindings: ReadonlyArray<ExecutiveRuntimeInteractionBinding>;
  readonly surfaceBindings: ReadonlyArray<ExecutiveRuntimeSurfaceInteractionBinding>;
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly activeSurface?: ExecutiveRuntimePresentationSurface;
  readonly activeInteraction?: ExecutiveRuntimeActiveInteraction;
  readonly authority?: ExecutiveRuntimePresentationAuthority;
  readonly interactionReadiness?: ExecutiveRuntimeInteractionSnapshot["readiness"];
} {
  const snapshot = input.interactionSnapshot;
  const result = input.interactionBindingResult;
  const bindings =
    snapshot?.interactionBindings ?? result?.interactionBindings ?? [];
  const surfaceBindings =
    snapshot?.surfaceBindings ?? result?.surfaceBindings ?? [];
  const primary = bindings[0];
  return {
    snapshot,
    result,
    bindings,
    surfaceBindings,
    activeSubject: snapshot?.activeSubject ?? primary?.activeSubject,
    activeSurface: snapshot?.activeSurface ?? primary?.activeSurface,
    activeInteraction: snapshot?.activeInteraction ?? result?.activeInteraction,
    authority: snapshot?.authority ?? primary?.authority,
    interactionReadiness: snapshot?.readiness ?? primary?.readiness,
  };
}

function upstreamPresentation(
  bindings: ReadonlyArray<ExecutiveRuntimeInteractionBinding>,
): ExecutiveRuntimeInteractionBinding["presentation"] {
  return bindings.find((binding) => binding.presentation !== undefined)
    ?.presentation;
}

function mapReadiness(args: {
  readonly runtimeReady: boolean;
  readonly contextReady: boolean;
  readonly subjectReady: boolean;
  readonly surfaceReady: boolean;
  readonly presentationReady: boolean;
  readonly interactionReady: boolean;
}): ExecutiveRuntimePresentationReadiness {
  const overallReady =
    args.runtimeReady &&
    args.contextReady &&
    args.presentationReady &&
    args.interactionReady;
  return Object.freeze({
    runtimeReady: args.runtimeReady,
    contextReady: args.contextReady,
    subjectReady: args.subjectReady,
    surfaceReady: args.surfaceReady,
    presentationReady: args.presentationReady,
    interactionReady: args.interactionReady,
    overallReady,
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function isExecutiveRuntimePresentationState(
  value: unknown,
): value is ExecutiveRuntimePresentationState {
  return (
    EXECUTIVE_RUNTIME_PRESENTATION_STATES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveRuntimePresentationVisibility(
  value: unknown,
): value is ExecutiveRuntimePresentationVisibility {
  return (
    EXECUTIVE_RUNTIME_PRESENTATION_VISIBILITY as readonly unknown[]
  ).includes(value);
}

export function isExecutiveRuntimePresentationEmphasis(
  value: unknown,
): value is ExecutiveRuntimePresentationEmphasis {
  return (
    EXECUTIVE_RUNTIME_PRESENTATION_EMPHASIS as readonly unknown[]
  ).includes(value);
}

export function isExecutiveRuntimePresentationPriority(
  value: unknown,
): value is ExecutiveRuntimePresentationPriority {
  return (
    EXECUTIVE_RUNTIME_PRESENTATION_PRIORITIES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveRuntimePresentationDensity(
  value: unknown,
): value is ExecutiveRuntimePresentationDensity {
  return (
    EXECUTIVE_RUNTIME_PRESENTATION_DENSITIES as readonly unknown[]
  ).includes(value);
}

export function validateExecutiveRuntimeSubjectPresentationBinding(
  value: unknown,
): value is ExecutiveRuntimeSubjectPresentationBinding {
  if (!isPlainObject(value)) return false;
  if (!isPlainObject(value.subject) || !isNonEmptyString(value.subject.id)) {
    return false;
  }
  if (
    value.presentationState !== undefined &&
    !isExecutiveRuntimePresentationState(value.presentationState)
  ) {
    return false;
  }
  if (
    value.visibility !== undefined &&
    !isExecutiveRuntimePresentationVisibility(value.visibility)
  ) {
    return false;
  }
  return value.authority !== undefined && isPlainObject(value.readiness);
}

export function validateExecutiveRuntimeSurfacePresentationBinding(
  value: unknown,
): value is ExecutiveRuntimeSurfacePresentationBinding {
  if (!isPlainObject(value)) return false;
  if (
    !(
      EXECUTIVE_RUNTIME_PRESENTATION_SURFACES as readonly unknown[]
    ).includes(value.surface)
  ) {
    return false;
  }
  if (
    value.presentationState !== undefined &&
    !isExecutiveRuntimePresentationState(value.presentationState)
  ) {
    return false;
  }
  return value.authority !== undefined && isPlainObject(value.readiness);
}

export function validateExecutiveRuntimeExperiencePresentationBinding(
  value: unknown,
): value is ExecutiveRuntimeExperiencePresentationBinding {
  if (!isPlainObject(value)) return false;
  return (
    Array.isArray(value.surfacePresentations) &&
    Array.isArray(value.subjectPresentations) &&
    value.authority !== undefined &&
    isPlainObject(value.readiness) &&
    value.bindingIdentity ===
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity &&
    value.bindingVersion ===
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion
  );
}

// ─── Binding helpers ────────────────────────────────────────────────────────

export function bindExecutiveRuntimeSubjectPresentation(input: {
  readonly subject: ExecutiveRuntimePresentationSubjectReference;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly priority?: ExecutiveRuntimePresentationPriority;
  readonly priorityScore?: number;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly focus?: ExecutiveRuntimeFocusPresentation;
  readonly attention?: ExecutiveRuntimeAttentionPresentation;
  readonly interactionId?: string;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
  readonly authority: ExecutiveRuntimePresentationAuthority;
}): ExecutiveRuntimeSubjectPresentationBinding {
  if (
    input.presentationState !== undefined &&
    !isExecutiveRuntimePresentationState(input.presentationState)
  ) {
    throw new TypeError("presentationState must be minimum, report, or operation");
  }
  if (
    input.visibility !== undefined &&
    !isExecutiveRuntimePresentationVisibility(input.visibility)
  ) {
    throw new TypeError("visibility is invalid");
  }
  if (
    input.emphasis !== undefined &&
    !isExecutiveRuntimePresentationEmphasis(input.emphasis)
  ) {
    throw new TypeError("emphasis is invalid");
  }
  if (
    input.priority !== undefined &&
    !isExecutiveRuntimePresentationPriority(input.priority)
  ) {
    throw new TypeError("priority is invalid");
  }
  if (
    input.density !== undefined &&
    !isExecutiveRuntimePresentationDensity(input.density)
  ) {
    throw new TypeError("density is invalid");
  }

  return Object.freeze({
    subject: freezeSubject(input.subject),
    readiness: input.readiness,
    authority: input.authority,
    runtimeSource: input.authority.runtimeSource,
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.visibility !== undefined ? { visibility: input.visibility } : {}),
    ...(input.emphasis !== undefined ? { emphasis: input.emphasis } : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
    ...(input.priorityScore !== undefined
      ? { priorityScore: input.priorityScore }
      : {}),
    ...(input.density !== undefined ? { density: input.density } : {}),
    ...(input.focus !== undefined ? { focus: input.focus } : {}),
    ...(input.attention !== undefined ? { attention: input.attention } : {}),
    ...(input.interactionId !== undefined
      ? { interactionId: input.interactionId }
      : {}),
  });
}

export function bindExecutiveRuntimeSurfacePresentation(input: {
  readonly surface: ExecutiveRuntimePresentationSurface;
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly priority?: ExecutiveRuntimePresentationPriority;
  readonly priorityScore?: number;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly activeInteraction?: ExecutiveRuntimeActiveInteraction;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
  readonly authority: ExecutiveRuntimePresentationAuthority;
}): ExecutiveRuntimeSurfacePresentationBinding {
  if (
    !(
      EXECUTIVE_RUNTIME_PRESENTATION_SURFACES as readonly string[]
    ).includes(input.surface)
  ) {
    throw new TypeError("surface is not a canonical Executive Experience surface");
  }
  if (
    input.presentationState !== undefined &&
    !isExecutiveRuntimePresentationState(input.presentationState)
  ) {
    throw new TypeError("presentationState must be minimum, report, or operation");
  }

  return Object.freeze({
    surface: input.surface,
    readiness: input.readiness,
    authority: input.authority,
    ...(input.activeSubject !== undefined
      ? { activeSubject: freezeSubject(input.activeSubject) }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.visibility !== undefined ? { visibility: input.visibility } : {}),
    ...(input.emphasis !== undefined ? { emphasis: input.emphasis } : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
    ...(input.priorityScore !== undefined
      ? { priorityScore: input.priorityScore }
      : {}),
    ...(input.density !== undefined ? { density: input.density } : {}),
    ...(input.activeInteraction !== undefined
      ? { activeInteraction: input.activeInteraction }
      : {}),
  });
}

function bindFocusPresentation(
  binding: ExecutiveRuntimeInteractionBinding | undefined,
  presentation: ExecutiveRuntimeInteractionBinding["presentation"],
): ExecutiveRuntimeFocusPresentation | undefined {
  if (binding?.focus === undefined) return undefined;
  return Object.freeze({
    subject: freezeSubject(binding.focus.focusedSubject),
    runtimeSource: binding.focus.runtimeSource,
    ...(binding.focus.relationship !== undefined
      ? { relationship: binding.focus.relationship }
      : {}),
    ...(presentation?.emphasis !== undefined &&
    isExecutiveRuntimePresentationEmphasis(presentation.emphasis)
      ? { emphasis: presentation.emphasis }
      : {}),
    ...(presentation?.visibility !== undefined
      ? { visibility: presentation.visibility }
      : {}),
    ...(presentation?.presentationState !== undefined
      ? { presentationState: presentation.presentationState }
      : {}),
  });
}

function bindAttentionPresentation(
  binding: ExecutiveRuntimeInteractionBinding | undefined,
  presentation: ExecutiveRuntimeInteractionBinding["presentation"],
): ExecutiveRuntimeAttentionPresentation | undefined {
  if (binding?.attention === undefined) return undefined;
  return Object.freeze({
    subject: freezeSubject(binding.attention.subject),
    runtimeSource: binding.attention.runtimeSource,
    ...(binding.attention.level !== undefined
      ? { level: binding.attention.level }
      : {}),
    ...(binding.attention.persistence !== undefined
      ? { persistence: binding.attention.persistence }
      : {}),
    ...(presentation?.emphasis !== undefined &&
    isExecutiveRuntimePresentationEmphasis(presentation.emphasis)
      ? { emphasis: presentation.emphasis }
      : {}),
    ...(presentation?.visibility !== undefined
      ? { visibility: presentation.visibility }
      : {}),
    ...(presentation?.presentationState !== undefined
      ? { presentationState: presentation.presentationState }
      : {}),
  });
}

function bindInteractionPresentation(
  binding: ExecutiveRuntimeInteractionBinding | undefined,
  readiness: ExecutiveRuntimePresentationReadiness,
): ExecutiveRuntimeInteractionPresentation | undefined {
  if (binding === undefined) return undefined;
  return Object.freeze({
    interactionId: binding.interactionId,
    interactionKind: binding.kind,
    sourceSurface: binding.source.surface,
    targetSurface: binding.target.surface,
    readiness,
    ...(binding.presentation?.presentationState !== undefined
      ? { presentationState: binding.presentation.presentationState }
      : {}),
    ...(binding.presentation?.visibility !== undefined
      ? { visibility: binding.presentation.visibility }
      : {}),
    ...(binding.presentation?.emphasis !== undefined &&
    isExecutiveRuntimePresentationEmphasis(binding.presentation.emphasis)
      ? { emphasis: binding.presentation.emphasis }
      : {}),
  });
}

function descriptorForSurface(
  descriptors: ReadonlyArray<ExecutiveRuntimeSurfacePresentationDescriptor> | undefined,
  surface: ExecutiveRuntimePresentationSurface,
): ExecutiveRuntimeSurfacePresentationDescriptor | undefined {
  return descriptors?.find((entry) => entry.surface === surface);
}

export function bindExecutiveRuntimeStagePresentation(input: {
  readonly subjectPresentations: ReadonlyArray<ExecutiveRuntimeSubjectPresentationBinding>;
  readonly activeSubjectPresentation?: ExecutiveRuntimeSubjectPresentationBinding;
  readonly focusPresentation?: ExecutiveRuntimeFocusPresentation;
  readonly attentionPresentation?: ExecutiveRuntimeAttentionPresentation;
  readonly interactionPresentation?: ExecutiveRuntimeInteractionPresentation;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
}): ExecutiveRuntimeStagePresentationBinding {
  return Object.freeze({
    surface: "stage" as const,
    subjectPresentations: Object.freeze([...input.subjectPresentations]),
    readiness: input.readiness,
    ...(input.presentationState !== undefined
      ? { scenePresentationState: input.presentationState }
      : {}),
    ...(input.activeSubjectPresentation !== undefined
      ? { activeSubjectPresentation: input.activeSubjectPresentation }
      : {}),
    ...(input.focusPresentation !== undefined
      ? { focusPresentation: input.focusPresentation }
      : {}),
    ...(input.attentionPresentation !== undefined
      ? { attentionPresentation: input.attentionPresentation }
      : {}),
    ...(input.interactionPresentation !== undefined
      ? { interactionPresentation: input.interactionPresentation }
      : {}),
    ...(input.density !== undefined ? { density: input.density } : {}),
  });
}

export function bindExecutiveRuntimeAdvisorPresentation(input: {
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly contextId?: string;
  readonly interactionReady: boolean;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
  readonly authority: ExecutiveRuntimePresentationAuthority;
}): ExecutiveRuntimeAdvisorPresentationBinding {
  return Object.freeze({
    surface: "advisor" as const,
    interactionReady: input.interactionReady,
    readiness: input.readiness,
    authority: input.authority,
    ...(input.activeSubject !== undefined
      ? { activeSubject: freezeSubject(input.activeSubject) }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.visibility !== undefined ? { visibility: input.visibility } : {}),
    ...(input.emphasis !== undefined ? { emphasis: input.emphasis } : {}),
    ...(input.density !== undefined ? { density: input.density } : {}),
    ...(input.contextId !== undefined ? { contextId: input.contextId } : {}),
  });
}

export function bindExecutiveRuntimeInsightPresentation(input: {
  readonly activeSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly selectedMetricId?: string;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
}): ExecutiveRuntimeInsightPresentationBinding {
  return Object.freeze({
    surface: "insight" as const,
    readiness: input.readiness,
    ...(input.activeSubject !== undefined
      ? { activeSubject: freezeSubject(input.activeSubject) }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.visibility !== undefined ? { visibility: input.visibility } : {}),
    ...(input.emphasis !== undefined ? { emphasis: input.emphasis } : {}),
    ...(input.selectedMetricId !== undefined
      ? { selectedMetricId: input.selectedMetricId }
      : {}),
    ...(input.density !== undefined ? { density: input.density } : {}),
  });
}

export function bindExecutiveRuntimeTimelinePresentation(input: {
  readonly temporalContextId?: string;
  readonly selectedPackId?: string;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
}): ExecutiveRuntimeTimelinePresentationBinding {
  return Object.freeze({
    surface: "timeline" as const,
    readiness: input.readiness,
    ...(input.temporalContextId !== undefined
      ? { temporalContextId: input.temporalContextId }
      : {}),
    ...(input.selectedPackId !== undefined
      ? { selectedPackId: input.selectedPackId }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.visibility !== undefined ? { visibility: input.visibility } : {}),
    ...(input.emphasis !== undefined ? { emphasis: input.emphasis } : {}),
    ...(input.density !== undefined ? { density: input.density } : {}),
  });
}

export function bindExecutiveRuntimeExplorerPresentation(input: {
  readonly collectionContextId?: string;
  readonly selectedSubject?: ExecutiveRuntimePresentationSubjectReference;
  readonly presentationState?: ExecutiveRuntimePresentationState;
  readonly visibility?: ExecutiveRuntimePresentationVisibility;
  readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
  readonly density?: ExecutiveRuntimePresentationDensity;
  readonly readiness: ExecutiveRuntimePresentationReadiness;
}): ExecutiveRuntimeExplorerPresentationBinding {
  return Object.freeze({
    surface: "explorer" as const,
    readiness: input.readiness,
    ...(input.collectionContextId !== undefined
      ? { collectionContextId: input.collectionContextId }
      : {}),
    ...(input.selectedSubject !== undefined
      ? { selectedSubject: freezeSubject(input.selectedSubject) }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.visibility !== undefined ? { visibility: input.visibility } : {}),
    ...(input.emphasis !== undefined ? { emphasis: input.emphasis } : {}),
    ...(input.density !== undefined ? { density: input.density } : {}),
  });
}

export function bindExecutiveRuntimeExperiencePresentation(
  input: ExecutiveRuntimeAdaptivePresentationBindingInput,
): ExecutiveRuntimeAdaptivePresentationBindingResult {
  const context = resolveInteractionContext(input);
  const issues: ExecutiveRuntimeAdaptivePresentationBindingIssue[] = [];

  if (
    context.snapshot === undefined &&
    context.result === undefined &&
    context.bindings.length === 0
  ) {
    issues.push(
      issue(
        "missing-interaction-binding",
        "interaction snapshot or binding result is required",
        "interactionSnapshot",
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

  if (
    issues.some((entry) =>
      (
        [
          "missing-interaction-binding",
          "missing-runtime-authority",
        ] as readonly ExecutiveRuntimeAdaptivePresentationBindingIssueCode[]
      ).includes(entry.code),
    )
  ) {
    return Object.freeze({
      status: "invalid" as const,
      surfacePresentations: Object.freeze([]),
      subjectPresentations: Object.freeze([]),
      issues: Object.freeze(issues),
      sourceIdentity:
        runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
      sourceVersion:
        runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
      upstreamIdentity:
        runtimeEnabledExecutiveExperienceInteractionBindingIdentity,
      upstreamVersion:
        runtimeEnabledExecutiveExperienceInteractionBindingVersion,
    });
  }

  const authority = context.authority!;
  const presentation = upstreamPresentation(context.bindings);
  const primaryBinding = context.bindings[0];

  if (presentation === undefined) {
    issues.push(
      issue(
        "presentation-unavailable",
        "no upstream presentation was available on interaction bindings",
        "presentation",
      ),
    );
  }

  if (context.activeSurface === undefined) {
    issues.push(
      issue(
        "missing-active-surface",
        "active surface was not available on the interaction binding",
        "activeSurface",
      ),
    );
  }

  // Validate optional surface presentation descriptors without inventing values.
  for (const descriptor of input.surfacePresentations ?? []) {
    if (
      !(
        EXECUTIVE_RUNTIME_PRESENTATION_SURFACES as readonly string[]
      ).includes(descriptor.surface)
    ) {
      issues.push(
        issue(
          "invalid-surface-presentation",
          `surface ${String(descriptor.surface)} is not canonical`,
          "surfacePresentations",
        ),
      );
    }
    if (
      descriptor.presentationState !== undefined &&
      !isExecutiveRuntimePresentationState(descriptor.presentationState)
    ) {
      issues.push(
        issue(
          "invalid-presentation-state",
          "presentationState must be minimum, report, or operation",
          "surfacePresentations.presentationState",
        ),
      );
    }
    if (
      descriptor.visibility !== undefined &&
      !isExecutiveRuntimePresentationVisibility(descriptor.visibility)
    ) {
      issues.push(
        issue(
          "invalid-visibility",
          "visibility must be visible, hidden, or collapsed",
          "surfacePresentations.visibility",
        ),
      );
    }
    if (
      descriptor.emphasis !== undefined &&
      !isExecutiveRuntimePresentationEmphasis(descriptor.emphasis)
    ) {
      issues.push(
        issue(
          "invalid-emphasis",
          "emphasis must be an upstream-compatible emphasis value",
          "surfacePresentations.emphasis",
        ),
      );
    }
    if (
      descriptor.priority !== undefined &&
      !isExecutiveRuntimePresentationPriority(descriptor.priority)
    ) {
      issues.push(
        issue(
          "invalid-priority",
          "priority must be a known presentation priority",
          "surfacePresentations.priority",
        ),
      );
    }
    if (
      descriptor.density !== undefined &&
      !isExecutiveRuntimePresentationDensity(descriptor.density)
    ) {
      issues.push(
        issue(
          "invalid-density",
          "density must be compact, balanced, or detailed",
          "surfacePresentations.density",
        ),
      );
    }
  }

  if (
    issues.some((entry) =>
      (
        [
          "invalid-presentation-state",
          "invalid-visibility",
          "invalid-emphasis",
          "invalid-priority",
          "invalid-density",
          "invalid-surface-presentation",
        ] as readonly ExecutiveRuntimeAdaptivePresentationBindingIssueCode[]
      ).includes(entry.code),
    )
  ) {
    return Object.freeze({
      status: "invalid" as const,
      surfacePresentations: Object.freeze([]),
      subjectPresentations: Object.freeze([]),
      issues: Object.freeze(issues),
      sourceIdentity:
        runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
      sourceVersion:
        runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
      upstreamIdentity:
        runtimeEnabledExecutiveExperienceInteractionBindingIdentity,
      upstreamVersion:
        runtimeEnabledExecutiveExperienceInteractionBindingVersion,
    });
  }

  const runtimeReady =
    context.interactionReadiness?.runtimeReady !== false &&
    context.result?.status !== "unavailable";
  const interactionReady =
    context.interactionReadiness?.interactionReady === true ||
    context.bindings.some((binding) => binding.readiness.interactionReady);

  const baseReadiness = mapReadiness({
    runtimeReady,
    contextReady: context.bindings.length > 0,
    subjectReady: context.activeSubject !== undefined,
    surfaceReady: context.activeSurface !== undefined,
    presentationReady: presentation !== undefined,
    interactionReady,
  });

  const focusPresentation = bindFocusPresentation(primaryBinding, presentation);
  const attentionPresentation = bindAttentionPresentation(
    primaryBinding,
    presentation,
  );
  const interactionPresentation = bindInteractionPresentation(
    primaryBinding,
    baseReadiness,
  );

  const subjectPresentations: ExecutiveRuntimeSubjectPresentationBinding[] = [];
  const seenSubjects = new Set<string>();

  const pushSubject = (
    subject: ExecutiveRuntimePresentationSubjectReference | undefined,
    extras?: {
      readonly presentationState?: ExecutiveRuntimePresentationState;
      readonly visibility?: ExecutiveRuntimePresentationVisibility;
      readonly emphasis?: ExecutiveRuntimePresentationEmphasis;
      readonly priority?: ExecutiveRuntimePresentationPriority;
      readonly priorityScore?: number;
      readonly density?: ExecutiveRuntimePresentationDensity;
      readonly interactionId?: string;
    },
  ): void => {
    if (subject === undefined) return;
    const key = subjectKey(subject);
    if (seenSubjects.has(key)) return;
    seenSubjects.add(key);
    subjectPresentations.push(
      bindExecutiveRuntimeSubjectPresentation({
        subject,
        readiness: baseReadiness,
        authority,
        focus: focusPresentation,
        attention: attentionPresentation,
        // Preserve upstream presentation only — never upgrade/fabricate.
        presentationState:
          extras?.presentationState ?? presentation?.presentationState,
        visibility: extras?.visibility ?? presentation?.visibility,
        emphasis:
          extras?.emphasis ??
          (presentation?.emphasis !== undefined &&
          isExecutiveRuntimePresentationEmphasis(presentation.emphasis)
            ? presentation.emphasis
            : undefined),
        priority: extras?.priority,
        priorityScore:
          extras?.priorityScore ?? presentation?.priority,
        density: extras?.density,
        interactionId: extras?.interactionId ?? primaryBinding?.interactionId,
      }),
    );
  };

  // Preserve upstream interaction/subject encounter order.
  pushSubject(context.activeSubject);
  for (const binding of context.bindings) {
    pushSubject(binding.activeSubject, {
      presentationState: binding.presentation?.presentationState,
      visibility: binding.presentation?.visibility,
      emphasis:
        binding.presentation?.emphasis !== undefined &&
        isExecutiveRuntimePresentationEmphasis(binding.presentation.emphasis)
          ? binding.presentation.emphasis
          : undefined,
      priorityScore: binding.presentation?.priority,
      interactionId: binding.interactionId,
    });
    pushSubject(binding.source.subject);
    pushSubject(binding.target.subject);
  }
  for (const descriptor of input.surfacePresentations ?? []) {
    pushSubject(descriptor.subject, {
      presentationState: descriptor.presentationState,
      visibility: descriptor.visibility,
      emphasis: descriptor.emphasis,
      priority: descriptor.priority,
      priorityScore: descriptor.priorityScore,
      density: descriptor.density,
    });
  }

  if (subjectPresentations.length === 0) {
    issues.push(
      issue(
        "missing-subject-presentation",
        "no subject presentation could be bound from interaction context",
        "subjectPresentations",
      ),
    );
  }

  const frozenSubjects = Object.freeze(subjectPresentations);
  const activeSubjectPresentation = frozenSubjects.find(
    (entry) =>
      context.activeSubject !== undefined &&
      subjectKey(entry.subject) === subjectKey(context.activeSubject),
  );

  // Canonical surface order; per-surface presentation may differ via descriptors.
  const surfacePresentations = Object.freeze(
    EXECUTIVE_RUNTIME_PRESENTATION_SURFACES.map((surface) => {
      const descriptor = descriptorForSurface(
        input.surfacePresentations,
        surface,
      );
      const surfaceInteraction = context.surfaceBindings.find(
        (entry) => entry.surface === surface,
      );
      if (
        descriptor === undefined &&
        surfaceInteraction === undefined &&
        surface !== context.activeSurface &&
        surface !== "experience"
      ) {
        issues.push(
          issue(
            "surface-presentation-unavailable",
            `no presentation descriptor/interaction binding for surface ${surface}`,
            `surfacePresentations.${surface}`,
          ),
        );
      }

      // Preserve explicit per-surface descriptor over shared upstream presentation.
      // Do not force one global presentation across all surfaces.
      return bindExecutiveRuntimeSurfacePresentation({
        surface,
        activeSubject: descriptor?.subject ?? context.activeSubject,
        presentationState:
          descriptor?.presentationState ??
          (surface === context.activeSurface || surface === "experience"
            ? presentation?.presentationState
            : descriptor?.presentationState),
        visibility:
          descriptor?.visibility ??
          (surface === context.activeSurface || surface === "experience"
            ? presentation?.visibility
            : undefined),
        emphasis:
          descriptor?.emphasis ??
          (surface === context.activeSurface || surface === "experience"
            ? presentation?.emphasis !== undefined &&
              isExecutiveRuntimePresentationEmphasis(presentation.emphasis)
              ? presentation.emphasis
              : undefined
            : undefined),
        priority: descriptor?.priority,
        priorityScore:
          descriptor?.priorityScore ??
          (surface === context.activeSurface || surface === "experience"
            ? presentation?.priority
            : undefined),
        density: descriptor?.density,
        activeInteraction:
          surfaceInteraction?.activeInteraction ??
          (context.activeInteraction?.source.surface === surface ||
          context.activeInteraction?.target.surface === surface
            ? context.activeInteraction
            : undefined),
        readiness: mapReadiness({
          runtimeReady,
          contextReady: true,
          subjectReady:
            (descriptor?.subject ?? context.activeSubject) !== undefined,
          surfaceReady: true,
          presentationReady:
            (descriptor?.presentationState ??
              (surface === context.activeSurface || surface === "experience"
                ? presentation?.presentationState
                : undefined)) !== undefined,
          interactionReady:
            surfaceInteraction?.readiness.interactionReady === true ||
            interactionReady,
        }),
        authority,
      });
    }),
  );

  const stageDescriptor = descriptorForSurface(
    input.surfacePresentations,
    "stage",
  );
  const advisorDescriptor = descriptorForSurface(
    input.surfacePresentations,
    "advisor",
  );
  const insightDescriptor = descriptorForSurface(
    input.surfacePresentations,
    "insight",
  );
  const timelineDescriptor = descriptorForSurface(
    input.surfacePresentations,
    "timeline",
  );
  const explorerDescriptor = descriptorForSurface(
    input.surfacePresentations,
    "explorer",
  );

  const stage = bindExecutiveRuntimeStagePresentation({
    subjectPresentations: frozenSubjects,
    activeSubjectPresentation,
    focusPresentation,
    attentionPresentation,
    interactionPresentation,
    presentationState:
      stageDescriptor?.presentationState ?? presentation?.presentationState,
    density: stageDescriptor?.density,
    readiness: baseReadiness,
  });

  const advisor = bindExecutiveRuntimeAdvisorPresentation({
    activeSubject: advisorDescriptor?.subject ?? context.activeSubject,
    presentationState: advisorDescriptor?.presentationState,
    visibility: advisorDescriptor?.visibility,
    emphasis: advisorDescriptor?.emphasis,
    density: advisorDescriptor?.density,
    contextId: advisorDescriptor?.contextId,
    interactionReady,
    readiness: baseReadiness,
    authority,
  });

  const insight = bindExecutiveRuntimeInsightPresentation({
    activeSubject: insightDescriptor?.subject ?? context.activeSubject,
    presentationState: insightDescriptor?.presentationState,
    visibility: insightDescriptor?.visibility,
    emphasis: insightDescriptor?.emphasis,
    selectedMetricId: insightDescriptor?.selectedMetricId,
    density: insightDescriptor?.density,
    readiness: baseReadiness,
  });

  const timeline = bindExecutiveRuntimeTimelinePresentation({
    temporalContextId: timelineDescriptor?.temporalContextId,
    selectedPackId: timelineDescriptor?.selectedPackId,
    presentationState: timelineDescriptor?.presentationState,
    visibility: timelineDescriptor?.visibility,
    emphasis: timelineDescriptor?.emphasis,
    density: timelineDescriptor?.density,
    readiness: baseReadiness,
  });

  const explorer = bindExecutiveRuntimeExplorerPresentation({
    collectionContextId: explorerDescriptor?.collectionContextId,
    selectedSubject: explorerDescriptor?.subject ?? context.activeSubject,
    presentationState: explorerDescriptor?.presentationState,
    visibility: explorerDescriptor?.visibility,
    emphasis: explorerDescriptor?.emphasis,
    density: explorerDescriptor?.density,
    readiness: baseReadiness,
  });

  const experiencePresentation: ExecutiveRuntimeExperiencePresentationBinding =
    Object.freeze({
      surfacePresentations,
      subjectPresentations: frozenSubjects,
      readiness: baseReadiness,
      authority,
      bindingIdentity:
        runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
      bindingVersion:
        runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
      stage,
      advisor,
      insight,
      timeline,
      explorer,
      ...(presentation?.presentationState !== undefined
        ? { presentationState: presentation.presentationState }
        : {}),
      ...(context.activeSurface !== undefined
        ? { activeSurface: context.activeSurface }
        : {}),
      ...(context.activeSubject !== undefined
        ? { activeSubject: freezeSubject(context.activeSubject) }
        : {}),
      ...(focusPresentation !== undefined
        ? { focusPresentation }
        : {}),
      ...(attentionPresentation !== undefined
        ? { attentionPresentation }
        : {}),
      ...(interactionPresentation !== undefined
        ? { interactionPresentation }
        : {}),
    });

  const status: ExecutiveRuntimeAdaptivePresentationBindingStatus = !runtimeReady
    ? "unavailable"
    : issues.length > 0 ||
        presentation === undefined ||
        context.activeSubject === undefined ||
        !baseReadiness.overallReady
      ? "partial"
      : "bound";

  return Object.freeze({
    status,
    experiencePresentation,
    surfacePresentations,
    subjectPresentations: frozenSubjects,
    issues: Object.freeze(issues),
    sourceIdentity:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
    sourceVersion:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
    upstreamIdentity:
      runtimeEnabledExecutiveExperienceInteractionBindingIdentity,
    upstreamVersion:
      runtimeEnabledExecutiveExperienceInteractionBindingVersion,
  });
}

export function createExecutiveRuntimePresentationSnapshot(input: {
  readonly snapshotId: string;
  readonly result: ExecutiveRuntimeAdaptivePresentationBindingResult;
  readonly timestampIso?: string;
}): ExecutiveRuntimePresentationSnapshot {
  if (!isNonEmptyString(input.snapshotId)) {
    throw new TypeError("snapshotId must be a non-empty opaque identifier");
  }
  if (
    input.result.experiencePresentation === undefined ||
    !validateExecutiveRuntimeExperiencePresentationBinding(
      input.result.experiencePresentation,
    )
  ) {
    throw new TypeError(
      "experience presentation binding is required for snapshot creation",
    );
  }

  const experience = input.result.experiencePresentation;
  return Object.freeze({
    snapshotId: input.snapshotId,
    experiencePresentation: experience,
    surfacePresentations: input.result.surfacePresentations,
    subjectPresentations: input.result.subjectPresentations,
    readiness: experience.readiness,
    authority: experience.authority,
    sourceVersion: experience.authority.sourceVersion,
    bindingIdentity:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
    bindingVersion:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
    ...(experience.activeSubject !== undefined
      ? { activeSubject: experience.activeSubject }
      : {}),
    ...(experience.activeSurface !== undefined
      ? { activeSurface: experience.activeSurface }
      : {}),
    ...(experience.focusPresentation !== undefined
      ? { focusPresentation: experience.focusPresentation }
      : {}),
    ...(experience.attentionPresentation !== undefined
      ? { attentionPresentation: experience.attentionPresentation }
      : {}),
    ...(experience.interactionPresentation !== undefined
      ? { interactionPresentation: experience.interactionPresentation }
      : {}),
    ...(input.timestampIso !== undefined
      ? { timestampIso: input.timestampIso }
      : {}),
  });
}

export function getRuntimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity():
  typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingCanonicalIdentity {
  return runtimeEnabledExecutiveExperienceAdaptivePresentationBindingCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingApiNames =
  Object.freeze([
    "getRuntimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity",
    "isExecutiveRuntimePresentationState",
    "isExecutiveRuntimePresentationVisibility",
    "isExecutiveRuntimePresentationEmphasis",
    "isExecutiveRuntimePresentationPriority",
    "isExecutiveRuntimePresentationDensity",
    "validateExecutiveRuntimeSubjectPresentationBinding",
    "validateExecutiveRuntimeSurfacePresentationBinding",
    "validateExecutiveRuntimeExperiencePresentationBinding",
    "bindExecutiveRuntimeSubjectPresentation",
    "bindExecutiveRuntimeSurfacePresentation",
    "bindExecutiveRuntimeStagePresentation",
    "bindExecutiveRuntimeAdvisorPresentation",
    "bindExecutiveRuntimeInsightPresentation",
    "bindExecutiveRuntimeTimelinePresentation",
    "bindExecutiveRuntimeExplorerPresentation",
    "bindExecutiveRuntimeExperiencePresentation",
    "createExecutiveRuntimePresentationSnapshot",
    "verifyAdaptivePresentationBinding",
  ] as const);

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBindingRegistry =
  Object.freeze({
    identity:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
    version:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
    namespace:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingNamespace,
    layer: runtimeEnabledExecutiveExperienceAdaptivePresentationBindingLayer,
    phase: runtimeEnabledExecutiveExperienceAdaptivePresentationBindingPhase,
    stage: runtimeEnabledExecutiveExperienceAdaptivePresentationBindingStage,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingDependencyPath,
    sections:
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_REGISTRY_SECTIONS,
    sectionCount:
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_REGISTRY_SECTIONS.length,
    presentationStates: EXECUTIVE_RUNTIME_PRESENTATION_STATES,
    presentationStateCount: EXECUTIVE_RUNTIME_PRESENTATION_STATES.length,
    visibility: EXECUTIVE_RUNTIME_PRESENTATION_VISIBILITY,
    visibilityCount: EXECUTIVE_RUNTIME_PRESENTATION_VISIBILITY.length,
    emphasis: EXECUTIVE_RUNTIME_PRESENTATION_EMPHASIS,
    emphasisCount: EXECUTIVE_RUNTIME_PRESENTATION_EMPHASIS.length,
    priorities: EXECUTIVE_RUNTIME_PRESENTATION_PRIORITIES,
    priorityCount: EXECUTIVE_RUNTIME_PRESENTATION_PRIORITIES.length,
    densities: EXECUTIVE_RUNTIME_PRESENTATION_DENSITIES,
    densityCount: EXECUTIVE_RUNTIME_PRESENTATION_DENSITIES.length,
    surfaces: EXECUTIVE_RUNTIME_PRESENTATION_SURFACES,
    surfaceCount: EXECUTIVE_RUNTIME_PRESENTATION_SURFACES.length,
    statuses: EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_STATUSES,
    statusCount: EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_STATUSES.length,
    issueCodes: EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_ISSUE_CODES,
    issueCodeCount:
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_ISSUE_CODES.length,
    guarantees: EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_GUARANTEES,
    guaranteeCount:
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_GUARANTEES.length,
    orderingRule: EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_ORDERING_RULE,
    safeFallbackRule:
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_SAFE_FALLBACK_RULE,
    publicApis:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingApiNames,
    publicApiCount:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingApiNames
        .length,
  });

export const runtimeEnabledExecutiveExperienceAdaptivePresentationBinding =
  Object.freeze({
    phase: "REX-1" as const,
    name: "AdaptivePresentationBinding" as const,
    identity:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
    version:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
    namespace:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingNamespace,
    layer: runtimeEnabledExecutiveExperienceAdaptivePresentationBindingLayer,
    stage: runtimeEnabledExecutiveExperienceAdaptivePresentationBindingStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingArchitecturalRole,
    role: "AdaptivePresentationBinding" as const,
    status:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingStability,
    upstreamDependency:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingDependencyPath,
    deterministic:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingDeterministic,
    immutable: true as const,
    sideEffectFree: true as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    browserIndependent: true as const,
    adaptivePresentationBinding: true as const,
    principle: EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_PRINCIPLE,
    boundary: EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_BOUNDARY,
    presentationStates: EXECUTIVE_RUNTIME_PRESENTATION_STATES,
    visibility: EXECUTIVE_RUNTIME_PRESENTATION_VISIBILITY,
    emphasis: EXECUTIVE_RUNTIME_PRESENTATION_EMPHASIS,
    priorities: EXECUTIVE_RUNTIME_PRESENTATION_PRIORITIES,
    densities: EXECUTIVE_RUNTIME_PRESENTATION_DENSITIES,
    statuses: EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_STATUSES,
    issueCodes: EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_ISSUE_CODES,
    guarantees: EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_GUARANTEES,
    forbiddenResponsibilities:
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_FORBIDDEN_RESPONSIBILITIES,
    orderingRule: EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_ORDERING_RULE,
    safeFallbackRule:
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_SAFE_FALLBACK_RULE,
    publicApiSurface:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingApiNames,
    registry:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingRegistry,
    interactionBindingBoundary: "REX-1:5-interaction-binding-only" as const,
    architecturalStatus:
      "Adaptive Presentation Binding Complete · Deterministic · Immutable · Framework-Independent · ReadyForRuntimeEnabledExecutiveExperiencePlatform" as const,
  });

// ─── Verification ───────────────────────────────────────────────────────────

export interface AdaptivePresentationBindingVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity;
  readonly version: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion;
  readonly namespace: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingNamespace;
  readonly layer: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingLayer;
  readonly phase: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingPhase;
  readonly stage: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingStage;
  readonly architecturalRole: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeEnabledExecutiveExperienceAdaptivePresentationBindingDependencyIdentity;
  readonly presentationStateCount: number;
  readonly visibilityCount: number;
  readonly emphasisCount: number;
  readonly priorityCount: number;
  readonly densityCount: number;
  readonly guaranteeCount: number;
  readonly registrySectionCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly interactionBindingBoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly guaranteesPresent: boolean;
  readonly orderingRuleValid: boolean;
  readonly safeFallbackRuleValid: boolean;
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

export function verifyAdaptivePresentationBinding():
  AdaptivePresentationBindingVerification {
  const module = runtimeEnabledExecutiveExperienceAdaptivePresentationBinding;
  const registry =
    runtimeEnabledExecutiveExperienceAdaptivePresentationBindingRegistry;

  const identityOk =
    module.identity === "REX-1:6/AdaptivePresentationBinding" &&
    module.version === "1.6.0" &&
    module.namespace ===
      "nexora.rex.runtime-enabled-executive-experience.adaptive-presentation-binding" &&
    module.layer === "REX" &&
    module.phase === "REX-1" &&
    module.stage === "AdaptivePresentationBinding" &&
    module.architecturalRole ===
      "ExecutiveRuntimeAdaptivePresentationBindingBoundary" &&
    module.upstreamDependency === "REX-1:5/ExecutiveInteractionBinding" &&
    module.upstreamDependency ===
      runtimeEnabledExecutiveExperienceInteractionBindingIdentity &&
    module.interactionBindingBoundary === "REX-1:5-interaction-binding-only";

  const dependencyOk =
    module.dependencyPath ===
      "@/app/lib/rex/runtimeEnabledExecutiveExperienceInteractionBinding" &&
    EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_BOUNDARY
      .consumesInteractionBindingOnly === true &&
    EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_BOUNDARY
      .importsSceneBindingDirectly === false &&
    EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_BOUNDARY
      .importsExDriDirectly === false;

  const vocabOk =
    exactOrder(EXECUTIVE_RUNTIME_PRESENTATION_STATES, [
      "minimum",
      "report",
      "operation",
    ]) &&
    exactOrder(EXECUTIVE_RUNTIME_PRESENTATION_VISIBILITY, [
      "visible",
      "hidden",
      "collapsed",
    ]) &&
    exactOrder(EXECUTIVE_RUNTIME_PRESENTATION_EMPHASIS, [
      "none",
      "low",
      "medium",
      "high",
    ]) &&
    exactOrder(EXECUTIVE_RUNTIME_PRESENTATION_PRIORITIES, [
      "low",
      "normal",
      "high",
      "critical",
    ]) &&
    exactOrder(EXECUTIVE_RUNTIME_PRESENTATION_DENSITIES, [
      "compact",
      "balanced",
      "detailed",
    ]);

  const guaranteesPresent =
    EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_GUARANTEES.length === 30 &&
    exactOrder(
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_GUARANTEES.map(
        (entry) => entry.id,
      ),
      [
        "depends-only-on-rex-1-5",
        "framework-neutral-presentation-binding",
        "upstream-presentation-preserved",
        "presentation-bound-not-calculated",
        "focus-represented-not-calculated",
        "attention-represented-not-calculated",
        "interaction-represented-not-executed",
        "visibility-represented-not-rendered",
        "emphasis-represented-not-animated",
        "density-represented-not-layout",
        "priority-represented-not-sorted",
        "runtime-authority-preserved",
        "subject-identity-preserved",
        "surface-identity-preserved",
        "presentation-may-differ-by-surface",
        "no-forced-global-presentation",
        "no-aggressive-defaults",
        "no-caller-input-mutation",
        "deterministic-ordering",
        "no-react-dependency",
        "no-threejs-dependency",
        "no-renderer-dependency",
        "no-camera-behavior",
        "no-animation-behavior",
        "no-ai-reasoning",
        "no-kpi-calculation",
        "no-koi-calculation",
        "no-persistence",
        "no-networking",
        "no-store-event-bus",
      ],
    ) &&
    EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const orderingRuleValid =
    EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_ORDERING_RULE ===
    "preserve-upstream-collection-order";
  const safeFallbackRuleValid =
    EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_SAFE_FALLBACK_RULE ===
    "absent-metadata-remains-undefined";

  const immutabilityOk =
    Object.isFrozen(module) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingCanonicalIdentity,
    ) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_PRESENTATION_STATES) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_PRESENTATION_VISIBILITY) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_PRESENTATION_EMPHASIS) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_PRESENTATION_PRIORITIES) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_PRESENTATION_DENSITIES) &&
    Object.isFrozen(
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_GUARANTEES,
    ) &&
    Object.isFrozen(
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_BOUNDARY,
    ) &&
    Object.isFrozen(
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_ISSUE_CODES,
    ) &&
    Object.isFrozen(
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_REGISTRY_SECTIONS,
    );

  const uniquenessOk =
    unique([...EXECUTIVE_RUNTIME_PRESENTATION_STATES]) &&
    unique([...EXECUTIVE_RUNTIME_PRESENTATION_VISIBILITY]) &&
    unique([...EXECUTIVE_RUNTIME_PRESENTATION_EMPHASIS]) &&
    unique([
      ...EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_ISSUE_CODES,
    ]) &&
    unique(
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_GUARANTEES.map(
        (entry) => entry.id,
      ),
    );

  const interactionBindingBoundaryIntact =
    module.boundary.soleImmediateDependency ===
      "REX-1:5/ExecutiveInteractionBinding" &&
    module.boundary.consumesInteractionBindingOnly === true &&
    module.boundary.calculatesPresentation === false &&
    module.boundary.upgradesPresentationState === false &&
    module.boundary.fabricatesCriticalEmphasis === false &&
    module.boundary.fabricatesHighPriority === false;

  const frameworkIndependent =
    module.frameworkIndependent === true &&
    module.rendererIndependent === true &&
    module.boundary.frameworkIndependent === true;

  const ok =
    identityOk &&
    dependencyOk &&
    vocabOk &&
    guaranteesPresent &&
    orderingRuleValid &&
    safeFallbackRuleValid &&
    immutabilityOk &&
    uniquenessOk &&
    interactionBindingBoundaryIntact &&
    frameworkIndependent &&
    module.principle ===
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_PRINCIPLE;

  return Object.freeze({
    ok,
    identity:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingIdentity,
    version:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingVersion,
    namespace:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingNamespace,
    layer: runtimeEnabledExecutiveExperienceAdaptivePresentationBindingLayer,
    phase: runtimeEnabledExecutiveExperienceAdaptivePresentationBindingPhase,
    stage: runtimeEnabledExecutiveExperienceAdaptivePresentationBindingStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingArchitecturalRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingDependencyIdentity,
    presentationStateCount: EXECUTIVE_RUNTIME_PRESENTATION_STATES.length,
    visibilityCount: EXECUTIVE_RUNTIME_PRESENTATION_VISIBILITY.length,
    emphasisCount: EXECUTIVE_RUNTIME_PRESENTATION_EMPHASIS.length,
    priorityCount: EXECUTIVE_RUNTIME_PRESENTATION_PRIORITIES.length,
    densityCount: EXECUTIVE_RUNTIME_PRESENTATION_DENSITIES.length,
    guaranteeCount:
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_GUARANTEES.length,
    registrySectionCount:
      EXECUTIVE_RUNTIME_ADAPTIVE_PRESENTATION_BINDING_REGISTRY_SECTIONS.length,
    publicApiCount:
      runtimeEnabledExecutiveExperienceAdaptivePresentationBindingApiNames
        .length,
    frozen: immutabilityOk,
    interactionBindingBoundaryIntact,
    frameworkIndependent,
    guaranteesPresent,
    orderingRuleValid,
    safeFallbackRuleValid,
  });
}
