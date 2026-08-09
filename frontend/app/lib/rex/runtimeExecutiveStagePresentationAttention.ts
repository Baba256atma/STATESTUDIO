/**
 * REX-2:5 — Runtime Executive Stage Presentation & Attention.
 *
 * Pure deterministic resolution of how much information each Stage subject
 * should expose and how strongly it should demand executive awareness.
 * Renderer-neutral — no layout, colors, materials, animation, or scene
 * membership orchestration.
 *
 * Canonical flow:
 *   REX-2:4 Focus & Selection → REX-2:5 Presentation & Attention → REX-2:6 Orchestration
 *
 * REX-2:4 answers: What is the executive looking at, and what matters around it?
 * REX-2:5 answers: How much should each subject reveal, and how strongly should it demand awareness?
 *
 * Combined resolution order: attention first, then presentation
 * (attention may promote presentation; presentation never changes attention).
 */

import {
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_ATTENTION_LEVELS,
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_FOCUS_ROLES,
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_STATUSES,
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_SUBJECT_KINDS,
  createRuntimeExecutiveStageModel,
  getRuntimeExecutiveStageSubjectById,
  projectRuntimeExecutiveStageFocusSelection,
  resolveRuntimeExecutiveStageFocusSelection,
  runtimeExecutiveStageFocusSelectionIdentity,
  runtimeExecutiveStageFocusSelectionVersion,
  verifyRuntimeExecutiveStageFocusSelectionResult,
  verifyRuntimeExecutiveStageModelConsistency,
  type RuntimeExecutiveStageAttentionLevel,
  type RuntimeExecutiveStageFocusRole,
  type RuntimeExecutiveStageFocusSelectionRequestReason,
  type RuntimeExecutiveStageFocusSelectionResult,
  type RuntimeExecutiveStageFocusSelectionSource,
  type RuntimeExecutiveStageFocusSelectionStatus,
  type RuntimeExecutiveStageModel,
  type RuntimeExecutiveStageModelConsistencyResult,
  type RuntimeExecutiveStagePresentationState,
  type RuntimeExecutiveStageScene,
  type RuntimeExecutiveStageSubject,
  type RuntimeExecutiveStageSubjectKind,
  type RuntimeExecutiveStageSubjectModel,
} from "@/app/lib/rex/runtimeExecutiveStageFocusSelection";

// ─── Transitively published Focus/Model surface (for REX-2:6+) ───────────────
// Publication fix: REX-2:6 must orchestrate through REX-2:5 only.

export {
  createRuntimeExecutiveStageModel,
  getRuntimeExecutiveStageSubjectById,
  projectRuntimeExecutiveStageFocusSelection,
  resolveRuntimeExecutiveStageFocusSelection,
  verifyRuntimeExecutiveStageFocusSelectionResult,
  verifyRuntimeExecutiveStageModelConsistency,
};

export type {
  RuntimeExecutiveStageAttentionLevel,
  RuntimeExecutiveStageFocusRole,
  RuntimeExecutiveStageFocusSelectionRequestReason,
  RuntimeExecutiveStageFocusSelectionResult,
  RuntimeExecutiveStageFocusSelectionSource,
  RuntimeExecutiveStageModel,
  RuntimeExecutiveStageModelConsistencyResult,
  RuntimeExecutiveStagePresentationState,
  RuntimeExecutiveStageScene,
  RuntimeExecutiveStageSubject,
  RuntimeExecutiveStageSubjectKind,
  RuntimeExecutiveStageSubjectModel,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveStagePresentationAttentionIdentity =
  "REX-2:5/RuntimeExecutiveStagePresentationAttention" as const;

export const runtimeExecutiveStagePresentationAttentionVersion =
  "2.5.0" as const;

export const runtimeExecutiveStagePresentationAttentionNamespace =
  "nexora.rex.stage.presentation-attention" as const;

export const runtimeExecutiveStagePresentationAttentionLayer =
  "RuntimeExecutiveExperience" as const;

export const runtimeExecutiveStagePresentationAttentionDomain =
  "ExecutiveStage" as const;

export const runtimeExecutiveStagePresentationAttentionPhase =
  "PresentationAttention" as const;

export const runtimeExecutiveStagePresentationAttentionArchitecturalRole =
  "RuntimeExecutiveStagePresentationAttentionBoundary" as const;

export const runtimeExecutiveStagePresentationAttentionConsumerRole =
  "InternalRuntimeResolver" as const;

export const runtimeExecutiveStagePresentationAttentionDependencyIdentity =
  runtimeExecutiveStageFocusSelectionIdentity;

export const runtimeExecutiveStagePresentationAttentionDependencyPath =
  "@/app/lib/rex/runtimeExecutiveStageFocusSelection" as const;

export const runtimeExecutiveStagePresentationAttentionStability =
  "PresentationAttentionReady" as const;

export const runtimeExecutiveStagePresentationAttentionDeterministic =
  true as const;

export const runtimeExecutiveStagePresentationAttentionSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveStagePresentationAttentionMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveStagePresentationAttentionCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveStagePresentationAttentionIdentity,
    version: runtimeExecutiveStagePresentationAttentionVersion,
    namespace: runtimeExecutiveStagePresentationAttentionNamespace,
    layer: runtimeExecutiveStagePresentationAttentionLayer,
    domain: runtimeExecutiveStagePresentationAttentionDomain,
    phase: runtimeExecutiveStagePresentationAttentionPhase,
    architecturalRole:
      runtimeExecutiveStagePresentationAttentionArchitecturalRole,
    consumerRole: runtimeExecutiveStagePresentationAttentionConsumerRole,
    dependencyIdentity:
      runtimeExecutiveStagePresentationAttentionDependencyIdentity,
    dependencyPath:
      runtimeExecutiveStagePresentationAttentionDependencyPath,
    upstreamVersion: runtimeExecutiveStageFocusSelectionVersion,
    stabilityStatus: runtimeExecutiveStagePresentationAttentionStability,
    deterministicStatus:
      runtimeExecutiveStagePresentationAttentionDeterministic,
    sideEffectPolicy:
      runtimeExecutiveStagePresentationAttentionSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveStagePresentationAttentionMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_PRINCIPLE =
  "Presentation is how much information a subject exposes. Attention is how strongly it demands executive awareness. They are independent semantic dimensions — not renderer styling." as const;

export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-enabled-Executive-Experience" as const,
    presentationAttentionAuthority: "REX-2:5" as const,
    architecturalRole:
      "RuntimeExecutiveStagePresentationAttentionBoundary" as const,
    consumerRole: "InternalRuntimeResolver" as const,
    soleImmediateDependency:
      "REX-2:4/RuntimeExecutiveStageFocusSelection" as const,
    consumesFocusSelectionOnly: true as const,
    importsRex23Directly: false as const,
    importsRex22Directly: false as const,
    importsRex21Directly: false as const,
    importsRex1Directly: false as const,
    importsExDriDirectly: false as const,
    importsDriDirectly: false as const,
    importsNolDirectly: false as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    mutatesInputModel: false as const,
    resolvesSelection: false as const,
    resolvesFocus: false as const,
    resolvesVisibility: false as const,
    orchestratesScene: false as const,
    createsUiHandlers: false as const,
    mapsColors: false as const,
    definesAnimation: false as const,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_PRESENTATION_STATES;

export const RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS =
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_ATTENTION_LEVELS;

export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_FOCUS_ROLES =
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_FOCUS_ROLES;

export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_SUBJECT_KINDS =
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_SUBJECT_KINDS;

export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_STATUSES =
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_STATUSES;

export type RuntimeExecutiveStagePresentationAttentionStatus =
  RuntimeExecutiveStageFocusSelectionStatus;

/**
 * Presentation precedence (highest → lowest):
 * 1. explicit valid presentation request
 * 2. explicit operational context
 * 3. selected + primary-focus actionable → operation (if eligible)
 * 4. primary focus → at least report
 * 5. warning/critical attention → at least report
 * 6. supporting focus → report
 * 7. contextual focus → minimum
 * 8. preserved existing valid state
 * 9. default minimum
 */
export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_PRECEDENCE = Object.freeze([
  "explicit-request",
  "operational-context",
  "selected-primary-focus",
  "primary-focus",
  "warning-critical-promotion",
  "supporting-focus",
  "contextual-focus",
  "preserved-state",
  "default-minimum",
] as const);

/**
 * Attention precedence (highest → lowest):
 * 1. explicit critical runtime signal / existing critical
 * 2. explicit attention request
 * 3. existing warning/critical semantic state
 * 4. primary-focus relevance
 * 5. supporting-focus relevance
 * 6. contextual relevance
 * 7. preserved attention
 * 8. default attention
 */
export const RUNTIME_EXECUTIVE_STAGE_ATTENTION_PRECEDENCE = Object.freeze([
  "runtime-critical",
  "explicit-attention",
  "runtime-warning",
  "primary-focus-relevance",
  "supporting-focus-relevance",
  "contextual-relevance",
  "preserved-attention",
  "default-attention",
] as const);

export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_REASON_KINDS = Object.freeze([
  "explicit-request",
  "primary-focus",
  "selected-primary-focus",
  "operational-context",
  "supporting-focus",
  "contextual-focus",
  "warning-promotion",
  "critical-promotion",
  "preserved-state",
  "default-minimum",
  "subject-ineligible-for-operation",
  "background-focus",
] as const);

export type RuntimeExecutiveStagePresentationReasonKind =
  (typeof RUNTIME_EXECUTIVE_STAGE_PRESENTATION_REASON_KINDS)[number];

export const RUNTIME_EXECUTIVE_STAGE_ATTENTION_REASON_KINDS = Object.freeze([
  "explicit-attention",
  "runtime-warning",
  "runtime-critical",
  "kpi-warning",
  "koi-significance",
  "dependency-risk",
  "impact-risk",
  "execution-risk",
  "primary-focus-relevance",
  "supporting-focus-relevance",
  "contextual-relevance",
  "preserved-attention",
  "default-attention",
] as const);

export type RuntimeExecutiveStageAttentionReasonKind =
  (typeof RUNTIME_EXECUTIVE_STAGE_ATTENTION_REASON_KINDS)[number];

export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_CAPABILITIES =
  Object.freeze([
    "presentation-resolution",
    "minimum-presentation",
    "report-presentation",
    "operation-presentation",
    "presentation-eligibility",
    "presentation-preservation",
    "attention-resolution",
    "attention-preservation",
    "focus-aware-presentation",
    "focus-aware-attention",
    "attention-aware-presentation-promotion",
    "explicit-presentation-override",
    "explicit-attention-override",
    "presentation-attention-explainability",
    "presentation-attention-projection",
    "structural-verification",
  ] as const);

export type RuntimeExecutiveStagePresentationAttentionCapability =
  (typeof RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_CAPABILITIES)[number];

// ─── Eligibility ────────────────────────────────────────────────────────────

export interface RuntimeExecutiveStagePresentationEligibility {
  readonly subjectKind: RuntimeExecutiveStageSubjectKind;
  readonly supportsMinimum: true;
  readonly supportsReport: boolean;
  readonly supportsOperation: boolean;
}

/**
 * Minimal deterministic eligibility by subject kind.
 * Operation is reserved for actionable executive subjects.
 */
export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ELIGIBILITY_BY_KIND =
  Object.freeze({
    object: Object.freeze({
      subjectKind: "object",
      supportsMinimum: true,
      supportsReport: true,
      supportsOperation: true,
    }),
    kpi: Object.freeze({
      subjectKind: "kpi",
      supportsMinimum: true,
      supportsReport: true,
      supportsOperation: false,
    }),
    koi: Object.freeze({
      subjectKind: "koi",
      supportsMinimum: true,
      supportsReport: true,
      supportsOperation: false,
    }),
    goal: Object.freeze({
      subjectKind: "goal",
      supportsMinimum: true,
      supportsReport: true,
      supportsOperation: false,
    }),
    decision: Object.freeze({
      subjectKind: "decision",
      supportsMinimum: true,
      supportsReport: true,
      supportsOperation: true,
    }),
    execution: Object.freeze({
      subjectKind: "execution",
      supportsMinimum: true,
      supportsReport: true,
      supportsOperation: true,
    }),
    task: Object.freeze({
      subjectKind: "task",
      supportsMinimum: true,
      supportsReport: true,
      supportsOperation: true,
    }),
    insight: Object.freeze({
      subjectKind: "insight",
      supportsMinimum: true,
      supportsReport: true,
      supportsOperation: false,
    }),
    "advisor-subject": Object.freeze({
      subjectKind: "advisor-subject",
      supportsMinimum: true,
      supportsReport: true,
      supportsOperation: false,
    }),
  } as const satisfies Record<
    string,
    RuntimeExecutiveStagePresentationEligibility
  >);

// ─── Policies ───────────────────────────────────────────────────────────────

export interface RuntimeExecutiveStagePresentationPolicy {
  readonly primaryFocusMinimumState: RuntimeExecutiveStagePresentationState;
  readonly supportingFocusDefaultState: RuntimeExecutiveStagePresentationState;
  readonly contextualFocusDefaultState: RuntimeExecutiveStagePresentationState;
  readonly backgroundDefaultState: RuntimeExecutiveStagePresentationState;
  readonly selectedPrimaryPrefersOperation: boolean;
  readonly promoteWarningToReport: boolean;
  readonly promoteCriticalToReport: boolean;
  readonly preserveWhenNoChangeRequired: boolean;
  readonly operationalContextPrefersOperation: boolean;
}

export const DEFAULT_RUNTIME_EXECUTIVE_STAGE_PRESENTATION_POLICY =
  Object.freeze({
    primaryFocusMinimumState: "report",
    supportingFocusDefaultState: "report",
    contextualFocusDefaultState: "minimum",
    backgroundDefaultState: "minimum",
    selectedPrimaryPrefersOperation: true,
    promoteWarningToReport: true,
    promoteCriticalToReport: true,
    preserveWhenNoChangeRequired: true,
    operationalContextPrefersOperation: true,
  }) satisfies RuntimeExecutiveStagePresentationPolicy;

export interface RuntimeExecutiveStageAttentionPolicy {
  readonly primaryFocusAttention: RuntimeExecutiveStageAttentionLevel;
  readonly supportingFocusAttention: RuntimeExecutiveStageAttentionLevel;
  readonly contextualFocusAttention: RuntimeExecutiveStageAttentionLevel;
  readonly backgroundFocusAttention: RuntimeExecutiveStageAttentionLevel;
  readonly preserveExistingWarningOrCritical: boolean;
  readonly preserveWhenNoChangeRequired: boolean;
  readonly maxElevatedSubjects: number;
  readonly backgroundMayRetainElevated: boolean;
}

export const DEFAULT_RUNTIME_EXECUTIVE_STAGE_ATTENTION_POLICY = Object.freeze({
  primaryFocusAttention: "elevated",
  supportingFocusAttention: "normal",
  contextualFocusAttention: "normal",
  backgroundFocusAttention: "normal",
  preserveExistingWarningOrCritical: true,
  preserveWhenNoChangeRequired: true,
  maxElevatedSubjects: 3,
  backgroundMayRetainElevated: true,
}) satisfies RuntimeExecutiveStageAttentionPolicy;

// ─── Public types ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveStagePresentationReason {
  readonly kind: RuntimeExecutiveStagePresentationReasonKind;
  readonly subjectId?: string;
  readonly detail?: string;
}

export interface RuntimeExecutiveStageAttentionReason {
  readonly kind: RuntimeExecutiveStageAttentionReasonKind;
  readonly subjectId?: string;
  readonly detail?: string;
}

export interface RuntimeExecutiveStagePresentationRequest {
  readonly subjectId: string;
  readonly presentationState: RuntimeExecutiveStagePresentationState;
}

export interface RuntimeExecutiveStageAttentionRequest {
  readonly subjectId: string;
  readonly attention: RuntimeExecutiveStageAttentionLevel;
}

export interface RuntimeExecutiveStagePresentationAttentionInput {
  readonly model: RuntimeExecutiveStageModel;
  readonly focusSelection: RuntimeExecutiveStageFocusSelectionResult;
  readonly presentationRequests?: ReadonlyArray<RuntimeExecutiveStagePresentationRequest>;
  readonly attentionRequests?: ReadonlyArray<RuntimeExecutiveStageAttentionRequest>;
  readonly operationalContext?: boolean;
  readonly presentationPolicy?: RuntimeExecutiveStagePresentationPolicy;
  readonly attentionPolicy?: RuntimeExecutiveStageAttentionPolicy;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly reason?: RuntimeExecutiveStageFocusSelectionRequestReason;
  readonly nextRevision?: string;
}

export interface RuntimeExecutiveStagePresentationAssignment {
  readonly subjectId: string;
  readonly previousPresentationState: RuntimeExecutiveStagePresentationState;
  readonly presentationState: RuntimeExecutiveStagePresentationState;
  readonly changed: boolean;
  readonly reason: RuntimeExecutiveStagePresentationReason;
  readonly derivation:
    | "explicit"
    | "focus"
    | "attention-promotion"
    | "operational"
    | "preserved"
    | "default";
  readonly focusRole: RuntimeExecutiveStageFocusRole;
  readonly modelId: string;
  readonly sceneId: string;
  readonly revision: string;
}

export interface RuntimeExecutiveStageAttentionAssignment {
  readonly subjectId: string;
  readonly previousAttention: RuntimeExecutiveStageAttentionLevel;
  readonly attention: RuntimeExecutiveStageAttentionLevel;
  readonly changed: boolean;
  readonly reason: RuntimeExecutiveStageAttentionReason;
  readonly derivation:
    | "explicit"
    | "runtime-signal"
    | "focus"
    | "preserved"
    | "default";
  readonly focusRole: RuntimeExecutiveStageFocusRole;
  readonly relatedPrimaryFocusSubjectId?: string;
  readonly modelId: string;
  readonly sceneId: string;
  readonly revision: string;
}

export interface RuntimeExecutiveStagePresentationResolution {
  readonly status: RuntimeExecutiveStagePresentationAttentionStatus;
  readonly assignments: ReadonlyArray<RuntimeExecutiveStagePresentationAssignment>;
  readonly presentationChanged: boolean;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly reasons: ReadonlyArray<RuntimeExecutiveStagePresentationReason>;
  readonly modelId: string;
  readonly sceneId: string;
  readonly revision: string;
  readonly issues: ReadonlyArray<string>;
}

export interface RuntimeExecutiveStageAttentionResolution {
  readonly status: RuntimeExecutiveStagePresentationAttentionStatus;
  readonly assignments: ReadonlyArray<RuntimeExecutiveStageAttentionAssignment>;
  readonly attentionChanged: boolean;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly reasons: ReadonlyArray<RuntimeExecutiveStageAttentionReason>;
  readonly modelId: string;
  readonly sceneId: string;
  readonly revision: string;
  readonly issues: ReadonlyArray<string>;
}

export interface RuntimeExecutiveStagePresentationAttentionConsistencyResult {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<string>;
  readonly modelConsistency: RuntimeExecutiveStageModelConsistencyResult;
  readonly focusSelectionOk: boolean;
}

export interface RuntimeExecutiveStagePresentationAttentionResult {
  readonly status: RuntimeExecutiveStagePresentationAttentionStatus;
  readonly presentation: RuntimeExecutiveStagePresentationResolution;
  readonly attention: RuntimeExecutiveStageAttentionResolution;
  readonly presentationAssignments: ReadonlyArray<RuntimeExecutiveStagePresentationAssignment>;
  readonly attentionAssignments: ReadonlyArray<RuntimeExecutiveStageAttentionAssignment>;
  readonly presentationChanged: boolean;
  readonly attentionChanged: boolean;
  readonly orderedAffectedSubjectIds: ReadonlyArray<string>;
  readonly reasons: ReadonlyArray<
    | RuntimeExecutiveStagePresentationReason
    | RuntimeExecutiveStageAttentionReason
  >;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly modelId: string;
  readonly sceneId: string;
  readonly revision: string;
  readonly consistency: RuntimeExecutiveStagePresentationAttentionConsistencyResult;
  readonly projectedModel?: RuntimeExecutiveStageModel;
  /** Preserved focus/selection inputs — never recalculated here. */
  readonly focusSelection: RuntimeExecutiveStageFocusSelectionResult;
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "depends-only-on-rex-2-4",
      order: 1,
      statement: "REX-2:5 depends only on REX-2:4.",
    }),
    Object.freeze({
      id: "no-direct-rex-2-3",
      order: 2,
      statement: "No direct REX-2:3 import.",
    }),
    Object.freeze({
      id: "no-direct-rex-2-2",
      order: 3,
      statement: "No direct REX-2:2 import.",
    }),
    Object.freeze({
      id: "no-direct-rex-2-1",
      order: 4,
      statement: "No direct REX-2:1 import.",
    }),
    Object.freeze({
      id: "no-direct-rex-1",
      order: 5,
      statement: "No direct REX-1 import.",
    }),
    Object.freeze({
      id: "no-direct-dri",
      order: 6,
      statement: "No direct DRI import.",
    }),
    Object.freeze({
      id: "no-direct-nol",
      order: 7,
      statement: "No direct NOL import.",
    }),
    Object.freeze({
      id: "no-direct-ex-dri",
      order: 8,
      statement: "No direct EX-DRI import.",
    }),
    Object.freeze({
      id: "canonical-presentation-states",
      order: 9,
      statement: "Presentation uses only canonical states.",
    }),
    Object.freeze({
      id: "canonical-attention-levels",
      order: 10,
      statement: "Attention uses only canonical levels.",
    }),
    Object.freeze({
      id: "presentation-attention-independent",
      order: 11,
      statement: "Presentation and attention are independent dimensions.",
    }),
    Object.freeze({
      id: "focus-attention-independent",
      order: 12,
      statement: "Focus and attention are independent dimensions.",
    }),
    Object.freeze({
      id: "focus-presentation-independent",
      order: 13,
      statement: "Focus and presentation are independent dimensions.",
    }),
    Object.freeze({
      id: "selection-not-modified",
      order: 14,
      statement: "Selection is not modified.",
    }),
    Object.freeze({
      id: "focus-not-modified",
      order: 15,
      statement: "Focus is not modified.",
    }),
    Object.freeze({
      id: "visibility-not-modified",
      order: 16,
      statement: "Visibility is not modified.",
    }),
    Object.freeze({
      id: "membership-not-modified",
      order: 17,
      statement: "Scene membership is not modified.",
    }),
    Object.freeze({
      id: "subject-order-preserved",
      order: 18,
      statement: "Subject ordering is preserved.",
    }),
    Object.freeze({
      id: "connection-order-preserved",
      order: 19,
      statement: "Connection ordering is preserved.",
    }),
    Object.freeze({
      id: "connections-not-created",
      order: 20,
      statement: "Connections are not created.",
    }),
    Object.freeze({
      id: "connections-not-removed",
      order: 21,
      statement: "Connections are not removed.",
    }),
    Object.freeze({
      id: "presentation-deterministic",
      order: 22,
      statement: "Presentation resolution is deterministic.",
    }),
    Object.freeze({
      id: "attention-deterministic",
      order: 23,
      statement: "Attention resolution is deterministic.",
    }),
    Object.freeze({
      id: "combined-deterministic",
      order: 24,
      statement: "Combined resolution is deterministic.",
    }),
    Object.freeze({
      id: "resolution-idempotent",
      order: 25,
      statement: "Resolution is idempotent.",
    }),
    Object.freeze({
      id: "inputs-not-mutated",
      order: 26,
      statement: "Inputs are not mutated.",
    }),
    Object.freeze({
      id: "outputs-immutable",
      order: 27,
      statement: "Outputs are immutable according to project convention.",
    }),
    Object.freeze({
      id: "operation-requires-eligibility",
      order: 28,
      statement: "Operation requires semantic eligibility.",
    }),
    Object.freeze({
      id: "attention-cannot-force-operation",
      order: 29,
      statement: "Attention alone cannot force operation.",
    }),
    Object.freeze({
      id: "promotion-by-explicit-policy",
      order: 30,
      statement:
        "Warning/critical may promote presentation only according to explicit policy.",
    }),
    Object.freeze({
      id: "invalid-presentation-deterministic",
      order: 31,
      statement: "Invalid explicit presentation requests resolve deterministically.",
    }),
    Object.freeze({
      id: "invalid-attention-deterministic",
      order: 32,
      statement: "Invalid attention requests resolve deterministically.",
    }),
    Object.freeze({
      id: "structured-reasons",
      order: 33,
      statement: "Structured reasons are supplied.",
    }),
    Object.freeze({
      id: "presentation-no-renderer-state",
      order: 34,
      statement: "Presentation contains no renderer state.",
    }),
    Object.freeze({
      id: "attention-no-renderer-styling",
      order: 35,
      statement: "Attention contains no renderer styling.",
    }),
    Object.freeze({
      id: "no-color-mapping",
      order: 36,
      statement: "No color mapping exists.",
    }),
    Object.freeze({
      id: "no-animation",
      order: 37,
      statement: "No animation behavior exists.",
    }),
    Object.freeze({
      id: "no-react",
      order: 38,
      statement: "No React dependency exists.",
    }),
    Object.freeze({
      id: "no-threejs",
      order: 39,
      statement: "No Three.js dependency exists.",
    }),
    Object.freeze({
      id: "no-browser-dom",
      order: 40,
      statement: "No DOM/browser dependency exists.",
    }),
    Object.freeze({
      id: "no-focus-resolver",
      order: 41,
      statement: "No focus resolver exists in this phase.",
    }),
    Object.freeze({
      id: "no-selection-resolver",
      order: 42,
      statement: "No selection resolver exists in this phase.",
    }),
    Object.freeze({
      id: "no-scene-orchestration",
      order: 43,
      statement: "No scene orchestration exists.",
    }),
    Object.freeze({
      id: "no-layout",
      order: 44,
      statement: "No layout logic exists.",
    }),
    Object.freeze({
      id: "no-camera",
      order: 45,
      statement: "No camera behavior exists.",
    }),
  ] as const);

export type RuntimeExecutiveStagePresentationAttentionInvariant =
  (typeof RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_FORBIDDEN =
  Object.freeze([
    "visibility-orchestration",
    "scene-orchestration",
    "focus-resolution",
    "selection-resolution",
    "layout",
    "rendering",
    "animation",
    "color-mapping",
    "ui-event-handlers",
    "adapters",
  ] as const);

export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "RuntimeExecutiveStagePresentationPolicy",
    "RuntimeExecutiveStageAttentionPolicy",
    "RuntimeExecutiveStagePresentationResolution",
    "RuntimeExecutiveStageAttentionResolution",
    "RuntimeExecutiveStagePresentationAssignment",
    "RuntimeExecutiveStageAttentionAssignment",
    "RuntimeExecutiveStagePresentationAttentionInput",
    "RuntimeExecutiveStagePresentationAttentionResult",
    "RuntimeExecutiveStagePresentationReason",
    "RuntimeExecutiveStageAttentionReason",
    "RuntimeExecutiveStagePresentationEligibility",
    "RuntimeExecutiveStagePresentationAttentionConsistencyResult",
  ] as const);

export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "Capabilities",
    "PresentationStates",
    "AttentionLevels",
    "PresentationReasons",
    "AttentionReasons",
    "Policies",
    "Eligibility",
    "PublicTypes",
    "APIs",
    "Invariants",
  ] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function freezePresentationReason(
  reason: RuntimeExecutiveStagePresentationReason,
): RuntimeExecutiveStagePresentationReason {
  return Object.freeze({
    kind: reason.kind,
    ...(reason.subjectId !== undefined ? { subjectId: reason.subjectId } : {}),
    ...(reason.detail !== undefined ? { detail: reason.detail } : {}),
  });
}

function freezeAttentionReason(
  reason: RuntimeExecutiveStageAttentionReason,
): RuntimeExecutiveStageAttentionReason {
  return Object.freeze({
    kind: reason.kind,
    ...(reason.subjectId !== undefined ? { subjectId: reason.subjectId } : {}),
    ...(reason.detail !== undefined ? { detail: reason.detail } : {}),
  });
}

function normalizePresentationPolicy(
  policy: RuntimeExecutiveStagePresentationPolicy | undefined,
): RuntimeExecutiveStagePresentationPolicy {
  if (policy === undefined) {
    return DEFAULT_RUNTIME_EXECUTIVE_STAGE_PRESENTATION_POLICY;
  }
  return Object.freeze({ ...policy });
}

function normalizeAttentionPolicy(
  policy: RuntimeExecutiveStageAttentionPolicy | undefined,
): RuntimeExecutiveStageAttentionPolicy {
  if (policy === undefined) {
    return DEFAULT_RUNTIME_EXECUTIVE_STAGE_ATTENTION_POLICY;
  }
  if (
    !Number.isInteger(policy.maxElevatedSubjects) ||
    policy.maxElevatedSubjects < 0
  ) {
    throw new TypeError("attention policy maxElevatedSubjects is invalid");
  }
  return Object.freeze({ ...policy });
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
    case "normal":
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
    case "minimum":
    default:
      return 1;
  }
}

function maxPresentation(
  a: RuntimeExecutiveStagePresentationState,
  b: RuntimeExecutiveStagePresentationState,
): RuntimeExecutiveStagePresentationState {
  return presentationRank(a) >= presentationRank(b) ? a : b;
}

function getEligibility(
  kind: RuntimeExecutiveStageSubjectKind,
): RuntimeExecutiveStagePresentationEligibility {
  const map = RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ELIGIBILITY_BY_KIND as
    Readonly<Record<string, RuntimeExecutiveStagePresentationEligibility>>;
  return (
    map[kind] ??
    Object.freeze({
      subjectKind: kind,
      supportsMinimum: true as const,
      supportsReport: true,
      supportsOperation: false,
    })
  );
}

function focusRoleForSubject(
  focusSelection: RuntimeExecutiveStageFocusSelectionResult,
  subjectId: string,
): RuntimeExecutiveStageFocusRole {
  const assignment = focusSelection.assignments.find(
    (entry) => entry.subjectId === subjectId,
  );
  return assignment?.focusRole ?? "unfocused";
}

function buildFocusRoleMap(
  focusSelection: RuntimeExecutiveStageFocusSelectionResult,
): Map<string, RuntimeExecutiveStageFocusRole> {
  const map = new Map<string, RuntimeExecutiveStageFocusRole>();
  for (const assignment of focusSelection.assignments) {
    map.set(assignment.subjectId, assignment.focusRole);
  }
  return map;
}

// ─── Eligibility API ────────────────────────────────────────────────────────

export function canRuntimeExecutiveStageSubjectUsePresentationState(
  subject: RuntimeExecutiveStageSubjectModel | RuntimeExecutiveStageSubject,
  state: RuntimeExecutiveStagePresentationState,
): boolean {
  if (
    !(
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES as readonly string[]
    ).includes(state)
  ) {
    return false;
  }
  const eligibility = getEligibility(subject.kind);
  if (state === "minimum") return eligibility.supportsMinimum;
  if (state === "report") return eligibility.supportsReport;
  if (state === "operation") return eligibility.supportsOperation;
  return false;
}

export function getRuntimeExecutiveStagePresentationEligibility(
  kind: RuntimeExecutiveStageSubjectKind,
): RuntimeExecutiveStagePresentationEligibility {
  return getEligibility(kind);
}

// ─── Attention resolution ───────────────────────────────────────────────────

export function resolveRuntimeExecutiveStageAttention(input: {
  readonly model: RuntimeExecutiveStageModel;
  readonly focusSelection: RuntimeExecutiveStageFocusSelectionResult;
  readonly attentionRequests?: ReadonlyArray<RuntimeExecutiveStageAttentionRequest>;
  readonly attentionPolicy?: RuntimeExecutiveStageAttentionPolicy;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
}): RuntimeExecutiveStageAttentionResolution {
  const model = input.model;
  const policy = normalizeAttentionPolicy(input.attentionPolicy);
  const focusRoles = buildFocusRoleMap(input.focusSelection);
  const requestById = new Map(
    (input.attentionRequests ?? []).map((request) => [
      request.subjectId,
      request,
    ]),
  );
  const issues: string[] = [];
  const assignments: RuntimeExecutiveStageAttentionAssignment[] = [];
  const reasons: RuntimeExecutiveStageAttentionReason[] = [];
  let elevatedCount = 0;

  for (const subject of model.subjects) {
    const previous = subject.attention;
    const focusRole = focusRoles.get(subject.subjectId) ?? subject.focusRole;
    let resolved: RuntimeExecutiveStageAttentionLevel = previous;
    let reasonKind: RuntimeExecutiveStageAttentionReasonKind =
      "preserved-attention";
    let derivation: RuntimeExecutiveStageAttentionAssignment["derivation"] =
      "preserved";

    const request = requestById.get(subject.subjectId);
    if (request !== undefined) {
      if (
        !(
          RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS as readonly string[]
        ).includes(request.attention)
      ) {
        issues.push(`invalid-attention:${subject.subjectId}`);
        reasonKind = "preserved-attention";
        resolved = previous;
        derivation = "preserved";
      } else if (
        getRuntimeExecutiveStageSubjectById(model, request.subjectId) ===
        undefined
      ) {
        issues.push(`unknown-attention-subject:${subject.subjectId}`);
      } else {
        resolved = request.attention;
        reasonKind = "explicit-attention";
        derivation = "explicit";
      }
    } else if (
      policy.preserveExistingWarningOrCritical &&
      (previous === "critical" || previous === "warning")
    ) {
      resolved = previous;
      reasonKind =
        previous === "critical" ? "runtime-critical" : "runtime-warning";
      if (subject.kind === "kpi" && previous === "warning") {
        reasonKind = "kpi-warning";
      }
      if (subject.kind === "koi") {
        reasonKind = "koi-significance";
      }
      derivation = "runtime-signal";
    } else if (focusRole === "primary") {
      resolved = policy.primaryFocusAttention;
      reasonKind = "primary-focus-relevance";
      derivation = "focus";
    } else if (focusRole === "secondary") {
      resolved = policy.supportingFocusAttention;
      reasonKind = "supporting-focus-relevance";
      derivation = "focus";
    } else if (focusRole === "contextual") {
      resolved = policy.contextualFocusAttention;
      reasonKind = "contextual-relevance";
      derivation = "focus";
    } else if (
      policy.preserveWhenNoChangeRequired &&
      attentionRank(previous) > attentionRank("normal")
    ) {
      if (
        (focusRole === "background" || focusRole === "unfocused") &&
        !policy.backgroundMayRetainElevated &&
        attentionRank(previous) >= attentionRank("elevated") &&
        previous !== "warning" &&
        previous !== "critical"
      ) {
        resolved = policy.backgroundFocusAttention;
        reasonKind = "default-attention";
        derivation = "default";
      } else {
        resolved = previous;
        reasonKind = "preserved-attention";
        derivation = "preserved";
      }
    } else {
      resolved =
        focusRole === "background" || focusRole === "unfocused"
          ? policy.backgroundFocusAttention
          : "normal";
      reasonKind = "default-attention";
      derivation = "default";
    }

    // Cap elevated (not warning/critical) subjects
    if (
      resolved === "elevated" &&
      previous !== "elevated" &&
      elevatedCount >= policy.maxElevatedSubjects
    ) {
      resolved = "informational";
      reasonKind = "default-attention";
      derivation = "default";
    }
    if (resolved === "elevated") {
      elevatedCount += 1;
    }

    const reason = freezeAttentionReason({
      kind: reasonKind,
      subjectId: subject.subjectId,
    });
    reasons.push(reason);
    assignments.push(
      Object.freeze({
        subjectId: subject.subjectId,
        previousAttention: previous,
        attention: resolved,
        changed: previous !== resolved,
        reason,
        derivation,
        focusRole,
        ...(input.focusSelection.resolvedPrimaryFocusSubjectId !== undefined
          ? {
              relatedPrimaryFocusSubjectId:
                input.focusSelection.resolvedPrimaryFocusSubjectId,
            }
          : {}),
        modelId: model.identity.modelId,
        sceneId: model.identity.sceneId,
        revision: model.revision,
      }),
    );
  }

  const status: RuntimeExecutiveStagePresentationAttentionStatus =
    issues.some((issue) => issue.startsWith("invalid-attention"))
      ? "invalid"
      : issues.some((issue) => issue.startsWith("unknown-attention"))
        ? "rejected"
        : "accepted";

  return Object.freeze({
    status,
    assignments: Object.freeze(assignments),
    attentionChanged: assignments.some((entry) => entry.changed),
    source: input.source,
    reasons: Object.freeze(reasons),
    modelId: model.identity.modelId,
    sceneId: model.identity.sceneId,
    revision: model.revision,
    issues: Object.freeze(issues),
  });
}

// ─── Presentation resolution ────────────────────────────────────────────────

export function resolveRuntimeExecutiveStagePresentation(input: {
  readonly model: RuntimeExecutiveStageModel;
  readonly focusSelection: RuntimeExecutiveStageFocusSelectionResult;
  readonly attentionAssignments?: ReadonlyArray<RuntimeExecutiveStageAttentionAssignment>;
  readonly presentationRequests?: ReadonlyArray<RuntimeExecutiveStagePresentationRequest>;
  readonly operationalContext?: boolean;
  readonly presentationPolicy?: RuntimeExecutiveStagePresentationPolicy;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
}): RuntimeExecutiveStagePresentationResolution {
  const model = input.model;
  const policy = normalizePresentationPolicy(input.presentationPolicy);
  const focusRoles = buildFocusRoleMap(input.focusSelection);
  const attentionById = new Map(
    (input.attentionAssignments ?? []).map((assignment) => [
      assignment.subjectId,
      assignment.attention,
    ]),
  );
  const requestById = new Map(
    (input.presentationRequests ?? []).map((request) => [
      request.subjectId,
      request,
    ]),
  );
  const selectedId = input.focusSelection.resolvedSelectedSubjectId;
  const primaryId = input.focusSelection.resolvedPrimaryFocusSubjectId;
  const issues: string[] = [];
  const assignments: RuntimeExecutiveStagePresentationAssignment[] = [];
  const reasons: RuntimeExecutiveStagePresentationReason[] = [];

  for (const subject of model.subjects) {
    const previous = subject.presentationState;
    const focusRole = focusRoles.get(subject.subjectId) ?? subject.focusRole;
    const attention =
      attentionById.get(subject.subjectId) ?? subject.attention;
    let resolved: RuntimeExecutiveStagePresentationState = previous;
    let reasonKind: RuntimeExecutiveStagePresentationReasonKind =
      "preserved-state";
    let derivation: RuntimeExecutiveStagePresentationAssignment["derivation"] =
      "preserved";

    const request = requestById.get(subject.subjectId);
    if (request !== undefined) {
      if (
        !(
          RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES as readonly string[]
        ).includes(request.presentationState)
      ) {
        issues.push(`invalid-presentation:${subject.subjectId}`);
        resolved = previous;
        reasonKind = "preserved-state";
        derivation = "preserved";
      } else if (
        !canRuntimeExecutiveStageSubjectUsePresentationState(
          subject,
          request.presentationState,
        )
      ) {
        // Deterministic fallback for ineligible operation → report
        if (request.presentationState === "operation") {
          resolved = "report";
          reasonKind = "subject-ineligible-for-operation";
          derivation = "explicit";
          issues.push(`ineligible-operation:${subject.subjectId}`);
        } else {
          resolved = previous;
          reasonKind = "preserved-state";
          derivation = "preserved";
          issues.push(`ineligible-presentation:${subject.subjectId}`);
        }
      } else {
        resolved = request.presentationState;
        reasonKind = "explicit-request";
        derivation = "explicit";
      }
    } else {
      // Policy-driven candidate, then clamp by eligibility
      let candidate: RuntimeExecutiveStagePresentationState = "minimum";
      let candidateReason: RuntimeExecutiveStagePresentationReasonKind =
        "default-minimum";
      let candidateDerivation: RuntimeExecutiveStagePresentationAssignment["derivation"] =
        "default";

      if (
        policy.operationalContextPrefersOperation &&
        input.operationalContext === true &&
        focusRole === "primary"
      ) {
        candidate = "operation";
        candidateReason = "operational-context";
        candidateDerivation = "operational";
      }

      if (
        policy.selectedPrimaryPrefersOperation &&
        selectedId === subject.subjectId &&
        primaryId === subject.subjectId
      ) {
        candidate = maxPresentation(candidate, "operation");
        candidateReason = "selected-primary-focus";
        candidateDerivation = "focus";
      }

      if (focusRole === "primary") {
        candidate = maxPresentation(
          candidate,
          policy.primaryFocusMinimumState,
        );
        if (candidateReason === "default-minimum") {
          candidateReason = "primary-focus";
          candidateDerivation = "focus";
        }
      } else if (focusRole === "secondary") {
        candidate = maxPresentation(
          candidate,
          policy.supportingFocusDefaultState,
        );
        if (candidateReason === "default-minimum") {
          candidateReason = "supporting-focus";
          candidateDerivation = "focus";
        }
      } else if (focusRole === "contextual") {
        candidate = maxPresentation(
          candidate,
          policy.contextualFocusDefaultState,
        );
        if (candidateReason === "default-minimum") {
          candidateReason = "contextual-focus";
          candidateDerivation = "focus";
        }
      } else {
        candidate = maxPresentation(
          candidate,
          policy.backgroundDefaultState,
        );
        if (candidateReason === "default-minimum") {
          candidateReason = "background-focus";
          candidateDerivation = "default";
        }
      }

      // Attention-aware promotion to report only (never to operation)
      if (
        policy.promoteCriticalToReport &&
        attention === "critical" &&
        presentationRank(candidate) < presentationRank("report")
      ) {
        candidate = "report";
        candidateReason = "critical-promotion";
        candidateDerivation = "attention-promotion";
      } else if (
        policy.promoteWarningToReport &&
        attention === "warning" &&
        presentationRank(candidate) < presentationRank("report")
      ) {
        candidate = "report";
        candidateReason = "warning-promotion";
        candidateDerivation = "attention-promotion";
      }

      // Eligibility clamp — operation → report if ineligible
      if (
        candidate === "operation" &&
        !canRuntimeExecutiveStageSubjectUsePresentationState(
          subject,
          "operation",
        )
      ) {
        candidate = "report";
        candidateReason = "subject-ineligible-for-operation";
        candidateDerivation = "focus";
      } else if (
        !canRuntimeExecutiveStageSubjectUsePresentationState(subject, candidate)
      ) {
        candidate = "minimum";
        candidateReason = "default-minimum";
        candidateDerivation = "default";
      }

      // Stability: if policy says preserve and existing state already meets
      // or exceeds the candidate (and remains eligible), keep existing.
      if (
        policy.preserveWhenNoChangeRequired &&
        canRuntimeExecutiveStageSubjectUsePresentationState(subject, previous) &&
        presentationRank(previous) >= presentationRank(candidate) &&
        // Do not preserve operation when no longer selected-primary/operational
        !(
          previous === "operation" &&
          candidate !== "operation" &&
          !(
            selectedId === subject.subjectId &&
            primaryId === subject.subjectId
          )
        )
      ) {
        resolved = previous;
        reasonKind = "preserved-state";
        derivation = "preserved";
      } else {
        resolved = candidate;
        reasonKind = candidateReason;
        derivation = candidateDerivation;
      }
    }

    const reason = freezePresentationReason({
      kind: reasonKind,
      subjectId: subject.subjectId,
    });
    reasons.push(reason);
    assignments.push(
      Object.freeze({
        subjectId: subject.subjectId,
        previousPresentationState: previous,
        presentationState: resolved,
        changed: previous !== resolved,
        reason,
        derivation,
        focusRole,
        modelId: model.identity.modelId,
        sceneId: model.identity.sceneId,
        revision: model.revision,
      }),
    );
  }

  const status: RuntimeExecutiveStagePresentationAttentionStatus =
    issues.some((issue) => issue.startsWith("invalid-presentation"))
      ? "invalid"
      : issues.some((issue) => issue.startsWith("unknown-"))
        ? "rejected"
        : "accepted";

  return Object.freeze({
    status,
    assignments: Object.freeze(assignments),
    presentationChanged: assignments.some((entry) => entry.changed),
    source: input.source,
    reasons: Object.freeze(reasons),
    modelId: model.identity.modelId,
    sceneId: model.identity.sceneId,
    revision: model.revision,
    issues: Object.freeze(issues),
  });
}

// ─── Combined resolution ────────────────────────────────────────────────────

export function resolveRuntimeExecutiveStagePresentationAttention(
  input: RuntimeExecutiveStagePresentationAttentionInput,
  options?: { readonly project?: boolean },
): RuntimeExecutiveStagePresentationAttentionResult {
  const modelConsistency = verifyRuntimeExecutiveStageModelConsistency(
    input.model,
  );
  const focusOk = verifyRuntimeExecutiveStageFocusSelectionResult(
    input.focusSelection,
  ).ok;

  const consistency: RuntimeExecutiveStagePresentationAttentionConsistencyResult =
    Object.freeze({
      ok: modelConsistency.ok && focusOk && input.focusSelection.status === "accepted",
      issues: Object.freeze([
        ...(modelConsistency.ok ? [] : ["model-inconsistent"]),
        ...(focusOk ? [] : ["focus-selection-invalid"]),
        ...(input.focusSelection.status === "accepted"
          ? []
          : ["focus-selection-not-accepted"]),
      ]),
      modelConsistency,
      focusSelectionOk: focusOk,
    });

  if (!consistency.ok) {
    const emptyAttention = resolveRuntimeExecutiveStageAttention({
      model: input.model,
      focusSelection: input.focusSelection,
      source: input.source,
      attentionPolicy: input.attentionPolicy,
    });
    const emptyPresentation = resolveRuntimeExecutiveStagePresentation({
      model: input.model,
      focusSelection: input.focusSelection,
      attentionAssignments: emptyAttention.assignments,
      source: input.source,
      presentationPolicy: input.presentationPolicy,
    });
    return Object.freeze({
      status: "invalid" as const,
      presentation: emptyPresentation,
      attention: emptyAttention,
      presentationAssignments: emptyPresentation.assignments,
      attentionAssignments: emptyAttention.assignments,
      presentationChanged: false,
      attentionChanged: false,
      orderedAffectedSubjectIds: Object.freeze([] as string[]),
      reasons: Object.freeze([
        freezePresentationReason({
          kind: "preserved-state",
          detail: "resolution skipped due to inconsistent inputs",
        }),
      ]),
      source: input.source,
      modelId: input.model.identity.modelId,
      sceneId: input.model.identity.sceneId,
      revision: input.model.revision,
      consistency,
      focusSelection: input.focusSelection,
    });
  }

  // 1) Attention first
  const attention = resolveRuntimeExecutiveStageAttention({
    model: input.model,
    focusSelection: input.focusSelection,
    attentionRequests: input.attentionRequests,
    attentionPolicy: input.attentionPolicy,
    source: input.source,
  });

  // 2) Presentation second (may use attention for promotion)
  const presentation = resolveRuntimeExecutiveStagePresentation({
    model: input.model,
    focusSelection: input.focusSelection,
    attentionAssignments: attention.assignments,
    presentationRequests: input.presentationRequests,
    operationalContext: input.operationalContext,
    presentationPolicy: input.presentationPolicy,
    source: input.source,
  });

  const status: RuntimeExecutiveStagePresentationAttentionStatus =
    attention.status === "accepted" && presentation.status === "accepted"
      ? "accepted"
      : attention.status === "invalid" || presentation.status === "invalid"
        ? "invalid"
        : "rejected";

  const affected = Object.freeze(
    input.model.subjects
      .map((subject) => subject.subjectId)
      .filter((subjectId) => {
        const p = presentation.assignments.find(
          (entry) => entry.subjectId === subjectId,
        );
        const a = attention.assignments.find(
          (entry) => entry.subjectId === subjectId,
        );
        return p?.changed === true || a?.changed === true;
      }),
  );

  const result: RuntimeExecutiveStagePresentationAttentionResult = {
    status,
    presentation,
    attention,
    presentationAssignments: presentation.assignments,
    attentionAssignments: attention.assignments,
    presentationChanged: presentation.presentationChanged,
    attentionChanged: attention.attentionChanged,
    orderedAffectedSubjectIds: affected,
    reasons: Object.freeze([
      ...attention.reasons,
      ...presentation.reasons,
    ]),
    source: input.source,
    modelId: input.model.identity.modelId,
    sceneId: input.model.identity.sceneId,
    revision: input.model.revision,
    consistency,
    focusSelection: input.focusSelection,
  };

  if (options?.project === true && status === "accepted") {
    return Object.freeze({
      ...result,
      projectedModel: projectRuntimeExecutiveStagePresentationAttention(
        input.model,
        result,
        {
          source: input.source,
          reason: input.reason,
          nextRevision: input.nextRevision,
        },
      ),
    });
  }

  return Object.freeze(result);
}

// ─── Projection ─────────────────────────────────────────────────────────────

export function projectRuntimeExecutiveStagePresentationAttention(
  model: RuntimeExecutiveStageModel,
  result: RuntimeExecutiveStagePresentationAttentionResult,
  options?: {
    readonly source?: RuntimeExecutiveStageFocusSelectionSource;
    readonly reason?: RuntimeExecutiveStageFocusSelectionRequestReason;
    readonly nextRevision?: string;
  },
): RuntimeExecutiveStageModel {
  if (result.status !== "accepted") {
    throw new TypeError(
      "cannot project a non-accepted presentation/attention result",
    );
  }

  const presentationById = new Map(
    result.presentationAssignments.map((assignment) => [
      assignment.subjectId,
      assignment.presentationState,
    ]),
  );
  const attentionById = new Map(
    result.attentionAssignments.map((assignment) => [
      assignment.subjectId,
      assignment.attention,
    ]),
  );

  // Preserve selection/focus from focusSelection result (inputs), not recalculated.
  const selectedId = result.focusSelection.resolvedSelectedSubjectId;
  const primaryId = result.focusSelection.resolvedPrimaryFocusSubjectId;
  const focusById = new Map(
    result.focusSelection.assignments.map((assignment) => [
      assignment.subjectId,
      assignment.focusRole,
    ]),
  );

  const nextSubjects: RuntimeExecutiveStageSubject[] = model.subjects.map(
    (subjectModel) => {
      const base = subjectModel.subject;
      const presentationState =
        presentationById.get(subjectModel.subjectId) ??
        base.presentationState;
      const attention =
        attentionById.get(subjectModel.subjectId) ?? base.attention;
      const focusRole =
        focusById.get(subjectModel.subjectId) ?? base.focusRole;
      const selection =
        selectedId === subjectModel.subjectId
          ? ("selected" as const)
          : ("unselected" as const);

      return Object.freeze({
        subjectId: base.subjectId,
        kind: base.kind,
        presentationState,
        visibility: base.visibility,
        attention,
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
    ...(selectedId !== undefined ? { selectedSubjectId: selectedId } : {}),
    ...(primaryId !== undefined ? { primaryFocusSubjectId: primaryId } : {}),
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

export function getRuntimeExecutiveStagePresentationAssignments(
  result: RuntimeExecutiveStagePresentationAttentionResult | RuntimeExecutiveStagePresentationResolution,
): ReadonlyArray<RuntimeExecutiveStagePresentationAssignment> {
  return "presentationAssignments" in result
    ? result.presentationAssignments
    : result.assignments;
}

export function getRuntimeExecutiveStageAttentionAssignments(
  result: RuntimeExecutiveStagePresentationAttentionResult | RuntimeExecutiveStageAttentionResolution,
): ReadonlyArray<RuntimeExecutiveStageAttentionAssignment> {
  return "attentionAssignments" in result
    ? result.attentionAssignments
    : result.assignments;
}

export function verifyRuntimeExecutiveStagePresentationAttentionResult(
  result: RuntimeExecutiveStagePresentationAttentionResult,
): {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<string>;
} {
  const issues: string[] = [];

  for (const assignment of result.presentationAssignments) {
    if (
      !(
        RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES as readonly string[]
      ).includes(assignment.presentationState)
    ) {
      issues.push(`invalid-presentation:${assignment.subjectId}`);
    }
  }
  for (const assignment of result.attentionAssignments) {
    if (
      !(
        RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS as readonly string[]
      ).includes(assignment.attention)
    ) {
      issues.push(`invalid-attention:${assignment.subjectId}`);
    }
  }

  // Must not invent focus/selection changes in this phase
  if (
    result.projectedModel !== undefined &&
    result.projectedModel.selection.selectedSubjectId !==
      result.focusSelection.resolvedSelectedSubjectId
  ) {
    issues.push("selection-mutated");
  }
  if (
    result.projectedModel !== undefined &&
    result.projectedModel.focus.primaryFocusSubjectId !==
      result.focusSelection.resolvedPrimaryFocusSubjectId
  ) {
    issues.push("focus-mutated");
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function getRuntimeExecutiveStagePresentationAttentionIdentity():
  typeof runtimeExecutiveStagePresentationAttentionCanonicalIdentity {
  return runtimeExecutiveStagePresentationAttentionCanonicalIdentity;
}

/** Convenience: resolve focus/selection then presentation/attention. */
export function resolveRuntimeExecutiveStagePresentationAttentionFromSelection(input: {
  readonly model: RuntimeExecutiveStageModel;
  readonly selectionSubjectId: string;
  readonly source: RuntimeExecutiveStageFocusSelectionSource;
  readonly focusRequest?: { readonly primaryFocusSubjectId: string };
  readonly presentationRequests?: ReadonlyArray<RuntimeExecutiveStagePresentationRequest>;
  readonly attentionRequests?: ReadonlyArray<RuntimeExecutiveStageAttentionRequest>;
  readonly operationalContext?: boolean;
}): RuntimeExecutiveStagePresentationAttentionResult {
  const focusSelection = resolveRuntimeExecutiveStageFocusSelection({
    model: input.model,
    selectionRequest: {
      kind: "select",
      subjectId: input.selectionSubjectId,
    },
    ...(input.focusRequest !== undefined
      ? { focusRequest: input.focusRequest }
      : {}),
    source: input.source,
  });
  const modelForPa =
    focusSelection.status === "accepted"
      ? projectRuntimeExecutiveStageFocusSelection(input.model, focusSelection)
      : input.model;

  return resolveRuntimeExecutiveStagePresentationAttention({
    model: modelForPa,
    focusSelection,
    presentationRequests: input.presentationRequests,
    attentionRequests: input.attentionRequests,
    operationalContext: input.operationalContext,
    source: input.source,
  });
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveStagePresentationAttentionApiNames = Object.freeze([
  "resolveRuntimeExecutiveStagePresentation",
  "resolveRuntimeExecutiveStageAttention",
  "resolveRuntimeExecutiveStagePresentationAttention",
  "canRuntimeExecutiveStageSubjectUsePresentationState",
  "getRuntimeExecutiveStagePresentationEligibility",
  "getRuntimeExecutiveStagePresentationAssignments",
  "getRuntimeExecutiveStageAttentionAssignments",
  "verifyRuntimeExecutiveStagePresentationAttentionResult",
  "projectRuntimeExecutiveStagePresentationAttention",
  "resolveRuntimeExecutiveStagePresentationAttentionFromSelection",
  "verifyRuntimeExecutiveStagePresentationAttention",
  "getRuntimeExecutiveStagePresentationAttentionIdentity",
] as const);

export const RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_REGISTRY =
  Object.freeze({
    identity: runtimeExecutiveStagePresentationAttentionIdentity,
    version: runtimeExecutiveStagePresentationAttentionVersion,
    namespace: runtimeExecutiveStagePresentationAttentionNamespace,
    layer: runtimeExecutiveStagePresentationAttentionLayer,
    domain: runtimeExecutiveStagePresentationAttentionDomain,
    phase: runtimeExecutiveStagePresentationAttentionPhase,
    consumerRole: runtimeExecutiveStagePresentationAttentionConsumerRole,
    immediateDependency:
      runtimeExecutiveStagePresentationAttentionDependencyIdentity,
    dependencyPath:
      runtimeExecutiveStagePresentationAttentionDependencyPath,
    sections: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_REGISTRY_SECTIONS,
    sectionCount:
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_REGISTRY_SECTIONS.length,
    capabilities: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_CAPABILITIES,
    capabilityCount:
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_CAPABILITIES.length,
    presentationStates: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES,
    presentationStateCount: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES.length,
    attentionLevels: RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS,
    attentionLevelCount: RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS.length,
    presentationReasonKinds: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_REASON_KINDS,
    presentationReasonKindCount:
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_REASON_KINDS.length,
    attentionReasonKinds: RUNTIME_EXECUTIVE_STAGE_ATTENTION_REASON_KINDS,
    attentionReasonKindCount:
      RUNTIME_EXECUTIVE_STAGE_ATTENTION_REASON_KINDS.length,
    presentationPrecedence: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_PRECEDENCE,
    attentionPrecedence: RUNTIME_EXECUTIVE_STAGE_ATTENTION_PRECEDENCE,
    defaultPresentationPolicy:
      DEFAULT_RUNTIME_EXECUTIVE_STAGE_PRESENTATION_POLICY,
    defaultAttentionPolicy: DEFAULT_RUNTIME_EXECUTIVE_STAGE_ATTENTION_POLICY,
    publicTypeNames:
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveStagePresentationAttentionApiNames,
    publicApiCount: runtimeExecutiveStagePresentationAttentionApiNames.length,
    invariants: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_INVARIANTS,
    invariantCount:
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_INVARIANTS.length,
  });

export const runtimeExecutiveStagePresentationAttention = Object.freeze({
  phase: "PresentationAttention" as const,
  name: "RuntimeExecutiveStagePresentationAttention" as const,
  identity: runtimeExecutiveStagePresentationAttentionIdentity,
  version: runtimeExecutiveStagePresentationAttentionVersion,
  namespace: runtimeExecutiveStagePresentationAttentionNamespace,
  layer: runtimeExecutiveStagePresentationAttentionLayer,
  domain: runtimeExecutiveStagePresentationAttentionDomain,
  architecturalRole:
    runtimeExecutiveStagePresentationAttentionArchitecturalRole,
  consumerRole: runtimeExecutiveStagePresentationAttentionConsumerRole,
  role: "PresentationAttention" as const,
  status: runtimeExecutiveStagePresentationAttentionStability,
  upstreamDependency:
    runtimeExecutiveStagePresentationAttentionDependencyIdentity,
  dependencyPath:
    runtimeExecutiveStagePresentationAttentionDependencyPath,
  deterministic: runtimeExecutiveStagePresentationAttentionDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_BOUNDARY,
  capabilities: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_CAPABILITIES,
  presentationStates: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES,
  attentionLevels: RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS,
  presentationReasonKinds: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_REASON_KINDS,
  attentionReasonKinds: RUNTIME_EXECUTIVE_STAGE_ATTENTION_REASON_KINDS,
  presentationPrecedence: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_PRECEDENCE,
  attentionPrecedence: RUNTIME_EXECUTIVE_STAGE_ATTENTION_PRECEDENCE,
  defaultPresentationPolicy:
    DEFAULT_RUNTIME_EXECUTIVE_STAGE_PRESENTATION_POLICY,
  defaultAttentionPolicy: DEFAULT_RUNTIME_EXECUTIVE_STAGE_ATTENTION_POLICY,
  invariants: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_FORBIDDEN,
  publicTypeNames:
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveStagePresentationAttentionApiNames,
  registry: RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_REGISTRY,
  focusSelectionBoundary: "REX-2:4-focus-selection-only" as const,
  architecturalStatus:
    "REX-2:5 Runtime Executive Stage Presentation & Attention Complete — Ready for REX-2:6 Runtime Executive Stage Scene & Connection Orchestration" as const,
});

export interface RuntimeExecutiveStagePresentationAttentionVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveStagePresentationAttentionIdentity;
  readonly version: typeof runtimeExecutiveStagePresentationAttentionVersion;
  readonly namespace: typeof runtimeExecutiveStagePresentationAttentionNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveStagePresentationAttentionDependencyIdentity;
  readonly consumerRole: typeof runtimeExecutiveStagePresentationAttentionConsumerRole;
  readonly capabilityCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly presentationReasonKindCount: number;
  readonly attentionReasonKindCount: number;
  readonly frozen: boolean;
  readonly focusSelectionBoundaryIntact: boolean;
  readonly rendererIndependent: boolean;
  readonly resolutionOnly: boolean;
}

export function verifyRuntimeExecutiveStagePresentationAttention():
  RuntimeExecutiveStagePresentationAttentionVerification {
  const registry = RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_REGISTRY;
  const frozen =
    Object.isFrozen(DEFAULT_RUNTIME_EXECUTIVE_STAGE_PRESENTATION_POLICY) &&
    Object.isFrozen(DEFAULT_RUNTIME_EXECUTIVE_STAGE_ATTENTION_POLICY) &&
    Object.isFrozen(
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_CAPABILITIES,
    ) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_INVARIANTS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_REGISTRY) &&
    Object.isFrozen(runtimeExecutiveStagePresentationAttention);

  const focusSelectionBoundaryIntact =
    runtimeExecutiveStagePresentationAttentionDependencyIdentity ===
      runtimeExecutiveStageFocusSelectionIdentity &&
    runtimeExecutiveStagePresentationAttentionDependencyPath ===
      "@/app/lib/rex/runtimeExecutiveStageFocusSelection" &&
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_BOUNDARY
      .consumesFocusSelectionOnly === true &&
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_BOUNDARY
      .importsRex23Directly === false &&
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_BOUNDARY
      .importsRex22Directly === false &&
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_BOUNDARY
      .importsRex21Directly === false;

  const countsAligned =
    registry.capabilityCount ===
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_CAPABILITIES.length &&
    registry.publicTypeCount ===
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_PUBLIC_TYPE_NAMES.length &&
    registry.publicApiCount ===
      runtimeExecutiveStagePresentationAttentionApiNames.length &&
    registry.invariantCount ===
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_INVARIANTS.length &&
    registry.presentationReasonKindCount ===
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_REASON_KINDS.length &&
    registry.attentionReasonKindCount ===
      RUNTIME_EXECUTIVE_STAGE_ATTENTION_REASON_KINDS.length;

  const invariantsOrdered =
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_INVARIANTS.length === 45 &&
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    );

  const resolutionOnly =
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_BOUNDARY.resolvesSelection ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_BOUNDARY.resolvesFocus ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_BOUNDARY
      .resolvesVisibility === false &&
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_BOUNDARY.orchestratesScene ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_BOUNDARY.mapsColors ===
      false &&
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_BOUNDARY.definesAnimation ===
      false;

  const ok =
    frozen &&
    focusSelectionBoundaryIntact &&
    countsAligned &&
    invariantsOrdered &&
    resolutionOnly &&
    runtimeExecutiveStagePresentationAttentionIdentity ===
      "REX-2:5/RuntimeExecutiveStagePresentationAttention" &&
    runtimeExecutiveStagePresentationAttentionVersion === "2.5.0" &&
    runtimeExecutiveStagePresentationAttentionNamespace ===
      "nexora.rex.stage.presentation-attention" &&
    runtimeExecutiveStagePresentationAttentionConsumerRole ===
      "InternalRuntimeResolver" &&
    RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES.length === 3;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveStagePresentationAttentionIdentity,
    version: runtimeExecutiveStagePresentationAttentionVersion,
    namespace: runtimeExecutiveStagePresentationAttentionNamespace,
    dependencyIdentity:
      runtimeExecutiveStagePresentationAttentionDependencyIdentity,
    consumerRole: runtimeExecutiveStagePresentationAttentionConsumerRole,
    capabilityCount:
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_CAPABILITIES.length,
    publicTypeCount:
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveStagePresentationAttentionApiNames.length,
    invariantCount:
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_INVARIANTS.length,
    presentationReasonKindCount:
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_REASON_KINDS.length,
    attentionReasonKindCount:
      RUNTIME_EXECUTIVE_STAGE_ATTENTION_REASON_KINDS.length,
    frozen,
    focusSelectionBoundaryIntact,
    rendererIndependent:
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_BOUNDARY
        .rendererIndependent,
    resolutionOnly,
  });
}
