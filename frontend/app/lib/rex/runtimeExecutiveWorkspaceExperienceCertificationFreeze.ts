/**
 * REX-6:8 — Runtime Executive Workspace Experience Certification & Freeze.
 *
 * Certifies, freezes, and locks the REX-6:7 platform surface.
 * Inspects the platform — does not alter workspace semantics, resolution,
 * composition, transition, Dial, or orchestration behavior.
 *
 * Canonical outcome when all checks pass:
 *   Certified · Compatible · Frozen · Locked · Stable · ReadyForPublicIndex
 *
 * Semantic Workspace Dial is frozen.
 * Visual Cadillac/Porsche Workspace Dial is NOT frozen.
 *
 * REX-6:9 Public Index is not implemented here.
 */

import {
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
  RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_BOUNDARY,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_FUNCTIONAL_APIS,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PUBLIC_TYPES,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_SECTIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_VALIDATION_APIS,
  RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK,
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES,
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  createRuntimeExecutiveWorkspaceContextContract,
  createRuntimeExecutiveWorkspaceExperienceSnapshot,
  deriveRuntimeExecutiveWorkspaceExperienceSnapshot,
  getRuntimeExecutiveWorkspaceExperiencePlatformCapabilities,
  getRuntimeExecutiveWorkspaceExperiencePlatformGuarantees,
  getRuntimeExecutiveWorkspaceExperiencePlatformIdentity,
  getRuntimeExecutiveWorkspaceExperiencePlatformRegistry,
  getRuntimeExecutiveWorkspaceExperiencePlatformSummary,
  hasRuntimeExecutiveWorkspaceChanged,
  hasRuntimeExecutiveWorkspaceContextChanged,
  isRuntimeExecutiveWorkspaceContextContract,
  isRuntimeExecutiveWorkspaceDialRequest,
  isRuntimeExecutiveWorkspaceExperienceOrchestrationResult,
  isRuntimeExecutiveWorkspaceExperienceOrchestrationStatus,
  isRuntimeExecutiveWorkspaceExperienceRequest,
  isRuntimeExecutiveWorkspaceExperienceSnapshot,
  isRuntimeExecutiveWorkspaceKind,
  isRuntimeExecutiveWorkspacePresentationState,
  isRuntimeExecutiveWorkspaceSurfaceCompositionResult,
  isRuntimeExecutiveWorkspaceSurfaceParticipation,
  isRuntimeExecutiveWorkspaceSurfaceRole,
  isRuntimeExecutiveWorkspaceSurfaceTransitionKind,
  isRuntimeExecutiveWorkspaceTransitionPhase,
  isRuntimeExecutiveWorkspaceTransitionReason,
  isRuntimeExecutiveWorkspaceTransitionSource,
  isRuntimeExecutiveWorkspaceTransitionStatus,
  normalizeRuntimeExecutiveWorkspaceDialRequest,
  orchestrateRuntimeExecutiveWorkspaceExperience,
  orchestrateRuntimeExecutiveWorkspaceExperienceFromDialRequest,
  orchestrateRuntimeExecutiveWorkspaceTransition,
  planRuntimeExecutiveWorkspaceTransition,
  resolveRuntimeExecutiveWorkspaceActivation,
  resolveRuntimeExecutiveWorkspaceContext,
  resolveRuntimeExecutiveWorkspaceDialSelection,
  resolveRuntimeExecutiveWorkspaceFocus,
  resolveRuntimeExecutiveWorkspaceIntent,
  resolveRuntimeExecutiveWorkspaceMode,
  resolveRuntimeExecutiveWorkspacePresentation,
  resolveRuntimeExecutiveWorkspaceSubject,
  resolveRuntimeExecutiveWorkspaceSurfaceComposition,
  resolveRuntimeExecutiveWorkspaceSurfaceParticipation,
  resolveRuntimeExecutiveWorkspaceSurfaceTransition,
  runtimeExecutiveWorkspaceExperiencePlatform,
  runtimeExecutiveWorkspaceExperiencePlatformIdentity,
  runtimeExecutiveWorkspaceExperiencePlatformNamespace,
  runtimeExecutiveWorkspaceExperiencePlatformPhase,
  runtimeExecutiveWorkspaceExperiencePlatformSupportedImportPath,
  runtimeExecutiveWorkspaceExperiencePlatformVersion,
  verifyRuntimeExecutiveWorkspaceExperienceOrchestration,
  verifyRuntimeExecutiveWorkspaceExperiencePlatform,
  type RuntimeExecutiveWorkspaceContextContract,
  type RuntimeExecutiveWorkspaceContextResolutionResult,
  type RuntimeExecutiveWorkspaceDialRequest,
  type RuntimeExecutiveWorkspaceExperienceOrchestrationInput,
  type RuntimeExecutiveWorkspaceExperienceOrchestrationResult,
  type RuntimeExecutiveWorkspaceExperienceRequest,
  type RuntimeExecutiveWorkspaceExperienceSnapshot,
  type RuntimeExecutiveWorkspaceFocusContract,
  type RuntimeExecutiveWorkspaceIntent,
  type RuntimeExecutiveWorkspaceKind,
  type RuntimeExecutiveWorkspacePresentationState,
  type RuntimeExecutiveWorkspaceSubjectContract,
  type RuntimeExecutiveWorkspaceSurfaceCompositionResult,
  type RuntimeExecutiveWorkspaceSurfaceParticipation,
  type RuntimeExecutiveWorkspaceSurfaceRole,
  type RuntimeExecutiveWorkspaceTransitionOrchestrationResult,
  type RuntimeExecutiveWorkspaceTransitionPlan,
  type RuntimeExecutiveWorkspaceTransitionReason,
  type RuntimeExecutiveWorkspaceTransitionSource,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceExperiencePlatform";

// ─── Additive frozen-surface publication for REX-6:9 (no behavior change) ───

export {
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
  RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_FUNCTIONAL_APIS,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PUBLIC_TYPES,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_VALIDATION_APIS,
  RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK,
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES,
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  createRuntimeExecutiveWorkspaceContextContract,
  createRuntimeExecutiveWorkspaceExperienceSnapshot,
  deriveRuntimeExecutiveWorkspaceExperienceSnapshot,
  getRuntimeExecutiveWorkspaceExperiencePlatformCapabilities,
  getRuntimeExecutiveWorkspaceExperiencePlatformGuarantees,
  getRuntimeExecutiveWorkspaceExperiencePlatformIdentity,
  getRuntimeExecutiveWorkspaceExperiencePlatformRegistry,
  getRuntimeExecutiveWorkspaceExperiencePlatformSummary,
  hasRuntimeExecutiveWorkspaceChanged,
  hasRuntimeExecutiveWorkspaceContextChanged,
  isRuntimeExecutiveWorkspaceContextContract,
  isRuntimeExecutiveWorkspaceDialRequest,
  isRuntimeExecutiveWorkspaceExperienceOrchestrationResult,
  isRuntimeExecutiveWorkspaceExperienceOrchestrationStatus,
  isRuntimeExecutiveWorkspaceExperienceRequest,
  isRuntimeExecutiveWorkspaceExperienceSnapshot,
  isRuntimeExecutiveWorkspaceKind,
  isRuntimeExecutiveWorkspacePresentationState,
  isRuntimeExecutiveWorkspaceSurfaceCompositionResult,
  isRuntimeExecutiveWorkspaceSurfaceParticipation,
  isRuntimeExecutiveWorkspaceSurfaceRole,
  isRuntimeExecutiveWorkspaceSurfaceTransitionKind,
  isRuntimeExecutiveWorkspaceTransitionPhase,
  isRuntimeExecutiveWorkspaceTransitionReason,
  isRuntimeExecutiveWorkspaceTransitionSource,
  isRuntimeExecutiveWorkspaceTransitionStatus,
  normalizeRuntimeExecutiveWorkspaceDialRequest,
  orchestrateRuntimeExecutiveWorkspaceExperience,
  orchestrateRuntimeExecutiveWorkspaceExperienceFromDialRequest,
  orchestrateRuntimeExecutiveWorkspaceTransition,
  planRuntimeExecutiveWorkspaceTransition,
  resolveRuntimeExecutiveWorkspaceActivation,
  resolveRuntimeExecutiveWorkspaceContext,
  resolveRuntimeExecutiveWorkspaceDialSelection,
  resolveRuntimeExecutiveWorkspaceFocus,
  resolveRuntimeExecutiveWorkspaceIntent,
  resolveRuntimeExecutiveWorkspaceMode,
  resolveRuntimeExecutiveWorkspacePresentation,
  resolveRuntimeExecutiveWorkspaceSubject,
  resolveRuntimeExecutiveWorkspaceSurfaceComposition,
  resolveRuntimeExecutiveWorkspaceSurfaceParticipation,
  resolveRuntimeExecutiveWorkspaceSurfaceTransition,
  verifyRuntimeExecutiveWorkspaceExperienceOrchestration,
  verifyRuntimeExecutiveWorkspaceExperiencePlatform,
};

export type {
  RuntimeExecutiveWorkspaceContextContract,
  RuntimeExecutiveWorkspaceContextResolutionResult,
  RuntimeExecutiveWorkspaceDialRequest,
  RuntimeExecutiveWorkspaceExperienceOrchestrationInput,
  RuntimeExecutiveWorkspaceExperienceOrchestrationResult,
  RuntimeExecutiveWorkspaceExperienceRequest,
  RuntimeExecutiveWorkspaceExperienceSnapshot,
  RuntimeExecutiveWorkspaceFocusContract,
  RuntimeExecutiveWorkspaceIntent,
  RuntimeExecutiveWorkspaceKind,
  RuntimeExecutiveWorkspacePresentationState,
  RuntimeExecutiveWorkspaceSubjectContract,
  RuntimeExecutiveWorkspaceSurfaceCompositionResult,
  RuntimeExecutiveWorkspaceSurfaceParticipation,
  RuntimeExecutiveWorkspaceSurfaceRole,
  RuntimeExecutiveWorkspaceTransitionOrchestrationResult,
  RuntimeExecutiveWorkspaceTransitionPlan,
  RuntimeExecutiveWorkspaceTransitionReason,
  RuntimeExecutiveWorkspaceTransitionSource,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeIdentity =
  "REX-6:8/RuntimeExecutiveWorkspaceExperienceCertificationFreeze" as const;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeVersion =
  "6.8.0" as const;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeNamespace =
  "nexora.rex.workspace-experience.certification-freeze" as const;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeLayer =
  "REX" as const;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeCapability =
  "RuntimeExecutiveWorkspaceExperience" as const;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezePhase =
  "CertificationFreeze" as const;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeArchitecturalRole =
  "RuntimeExecutiveWorkspaceExperienceCertificationFreeze" as const;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeConsumerRole =
  "FrozenPrePublicIndexSurface" as const;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeDependencyIdentity =
  runtimeExecutiveWorkspaceExperiencePlatformIdentity;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeDependencyPath =
  runtimeExecutiveWorkspaceExperiencePlatformSupportedImportPath;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceCertificationFreeze" as const;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeStability =
  "Stable" as const;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeStatus =
  "ReadyForPublicIndex" as const;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeDeterministic =
  true as const;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeMutationPolicy =
  "immutable" as const;

/** Canonical immutable REX-6 platform lock. */
export const REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED =
  "REX-6-RUNTIME-EXECUTIVE-WORKSPACE-EXPERIENCE-PLATFORM-LOCKED" as const;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveWorkspaceExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveWorkspaceExperienceCertificationFreezeNamespace,
    layer: runtimeExecutiveWorkspaceExperienceCertificationFreezeLayer,
    capability:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeCapability,
    phase: runtimeExecutiveWorkspaceExperienceCertificationFreezePhase,
    status: runtimeExecutiveWorkspaceExperienceCertificationFreezeStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeArchitecturalRole,
    consumerRole:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeConsumerRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeSupportedImportPath,
    upstreamVersion: runtimeExecutiveWorkspaceExperiencePlatformVersion,
    stabilityStatus:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeStability,
    platformLock: REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED,
    deterministicStatus:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeDeterministic,
    sideEffectPolicy:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_PRINCIPLE =
  "REX-6:7 defines the complete platform; REX-6:8 proves and freezes that platform; REX-6:9 publishes it. Semantic Dial is frozen; visual Dial is not." as const;

export const RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-Executive-Experience" as const,
    certificationAuthority: "REX-6:8" as const,
    architecturalRole:
      "RuntimeExecutiveWorkspaceExperienceCertificationFreeze" as const,
    soleImmediateDependency:
      "REX-6:7/RuntimeExecutiveWorkspaceExperiencePlatform" as const,
    consumesPlatformOnly: true as const,
    importsRex66Directly: false as const,
    importsRex65Directly: false as const,
    importsRex64Directly: false as const,
    importsRex63Directly: false as const,
    importsRex62Directly: false as const,
    importsRex61Directly: false as const,
    introducesRuntimeBehavior: false as const,
    introducesNewWorkspaceSemantics: false as const,
    modifiesPlatformPolicy: false as const,
    introducesUi: false as const,
    introducesDialGeometry: false as const,
    freezesCockpitLayout: false as const,
    freezesAutomotiveStyling: false as const,
    freezesBusinessWorkflow: false as const,
    isFinalPublicConsumerIndex: false as const,
    isReleased: false as const,
    readyForConsumer: false as const,
  });

// ─── Status vocabularies ────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_STATUSES = Object.freeze([
  "certified",
  "failed",
] as const);

export type RuntimeExecutiveWorkspaceExperienceCertificationStatus =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_COMPATIBILITY_STATUSES = Object.freeze([
  "compatible",
  "incompatible",
] as const);

export type RuntimeExecutiveWorkspaceExperienceCompatibilityStatus =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPATIBILITY_STATUSES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_FREEZE_STATUSES = Object.freeze([
  "frozen",
  "unfrozen",
] as const);

export type RuntimeExecutiveWorkspaceExperienceFreezeStatus =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_FREEZE_STATUSES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_LOCK_STATUSES = Object.freeze([
  "locked",
  "unlocked",
] as const);

export type RuntimeExecutiveWorkspaceExperienceLockStatus =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_LOCK_STATUSES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_STABILITY_STATUSES = Object.freeze([
  "stable",
  "unstable",
] as const);

export type RuntimeExecutiveWorkspaceExperienceStabilityStatus =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_STABILITY_STATUSES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_READINESS = Object.freeze([
  "ready-for-public-index",
  "not-ready",
] as const);

export type RuntimeExecutiveWorkspaceExperiencePublicIndexReadiness =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_READINESS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_DOMAINS = Object.freeze([
  "identity",
  "dependency",
  "platform-integrity",
  "workspace-vocabulary",
  "contract-integrity",
  "context-resolution",
  "surface-composition",
  "transition-orchestration",
  "dial-boundary",
  "experience-orchestration",
  "presentation-independence",
  "non-linear-navigation",
  "determinism",
  "immutability",
  "serialization",
  "framework-independence",
  "renderer-independence",
  "business-independence",
  "registry-integrity",
  "approved-exports",
  "platform-guarantees",
  "freeze-integrity",
  "compatibility",
] as const);

export type RuntimeExecutiveWorkspaceExperienceCertificationDomain =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_DOMAINS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Certification",
    "CertificationDomains",
    "CertificationChecks",
    "Compatibility",
    "Freeze",
    "Lock",
    "Stability",
    "Readiness",
    "FreezeManifest",
    "Invariants",
    "ConsumerInformation",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "sole-dependency-rex-6-7",
      order: 1,
      statement: "REX-6:7 is the sole immediate dependency.",
    }),
    Object.freeze({
      id: "no-runtime-behavior",
      order: 2,
      statement: "Certification introduces no runtime behavior.",
    }),
    Object.freeze({
      id: "no-policy-modification",
      order: 3,
      statement: "Certification does not modify platform policy.",
    }),
    Object.freeze({
      id: "checks-deterministic",
      order: 4,
      statement: "Certification checks are deterministic.",
    }),
    Object.freeze({
      id: "domains-unique",
      order: 5,
      statement: "Every certification domain is unique.",
    }),
    Object.freeze({
      id: "check-ids-unique",
      order: 6,
      statement: "Every certification check ID is unique.",
    }),
    Object.freeze({
      id: "passed-plus-failed-equals-total",
      order: 7,
      statement: "passed + failed = total.",
    }),
    Object.freeze({
      id: "certified-requires-zero-failures",
      order: 8,
      statement: "Certified requires zero failed checks.",
    }),
    Object.freeze({
      id: "compatible-requires-compatibility-checks",
      order: 9,
      statement: "Compatible requires all compatibility checks pass.",
    }),
    Object.freeze({
      id: "frozen-requires-certified",
      order: 10,
      statement: "Frozen requires Certified.",
    }),
    Object.freeze({
      id: "locked-requires-frozen",
      order: 11,
      statement: "Locked requires Frozen.",
    }),
    Object.freeze({
      id: "stable-requires-certified-compatible",
      order: 12,
      statement: "Stable requires Certified + Compatible.",
    }),
    Object.freeze({
      id: "ready-requires-all-gates",
      order: 13,
      statement:
        "ReadyForPublicIndex requires Certified + Compatible + Frozen + Locked + Stable.",
    }),
    Object.freeze({
      id: "platform-lock-exact",
      order: 14,
      statement: "Canonical platform lock is exact and immutable.",
    }),
    Object.freeze({
      id: "workspace-vocabulary-unchanged",
      order: 15,
      statement: "Workspace vocabulary is unchanged.",
    }),
    Object.freeze({
      id: "surface-vocabulary-unchanged",
      order: 16,
      statement: "Surface vocabulary is unchanged.",
    }),
    Object.freeze({
      id: "dial-not-workspace",
      order: 17,
      statement: "Dial is not a workspace.",
    }),
    Object.freeze({
      id: "dial-not-surface",
      order: 18,
      statement: "Dial is not a surface.",
    }),
    Object.freeze({
      id: "dial-geometry-absent",
      order: 19,
      statement: "Dial geometry is absent.",
    }),
    Object.freeze({
      id: "non-linear-supported",
      order: 20,
      statement: "Non-linear navigation remains supported.",
    }),
    Object.freeze({
      id: "same-workspace-context-supported",
      order: 21,
      statement: "Same-workspace context change remains supported.",
    }),
    Object.freeze({
      id: "presentation-independence",
      order: 22,
      statement: "Workspace/presentation independence remains certified.",
    }),
    Object.freeze({
      id: "stage-primary",
      order: 23,
      statement: "Stage remains canonical primary surface.",
    }),
    Object.freeze({
      id: "complete-compositions",
      order: 24,
      statement: "Complete surface compositions remain certified.",
    }),
    Object.freeze({
      id: "orchestration-deterministic",
      order: 25,
      statement: "Orchestration remains deterministic.",
    }),
    Object.freeze({
      id: "no-react",
      order: 26,
      statement: "No React dependency exists.",
    }),
    Object.freeze({
      id: "no-three",
      order: 27,
      statement: "No Three.js dependency exists.",
    }),
    Object.freeze({
      id: "no-r3f",
      order: 28,
      statement: "No R3F dependency exists.",
    }),
    Object.freeze({
      id: "no-cockpit-geometry",
      order: 29,
      statement: "No cockpit geometry is frozen.",
    }),
    Object.freeze({
      id: "no-automotive-styling",
      order: 30,
      statement: "No Cadillac/Porsche semantics are frozen.",
    }),
    Object.freeze({
      id: "no-business-workflow",
      order: 31,
      statement: "No business workflow is frozen.",
    }),
    Object.freeze({
      id: "no-business-execution",
      order: 32,
      statement: "No business action execution exists.",
    }),
    Object.freeze({
      id: "registries-mutation-safe",
      order: 33,
      statement: "Canonical registries are mutation-safe.",
    }),
    Object.freeze({
      id: "result-serializable-friendly",
      order: 34,
      statement: "Certification result is serializable-friendly.",
    }),
    Object.freeze({
      id: "ready-for-public-index",
      order: 35,
      statement: "Successful canonical result is ReadyForPublicIndex.",
    }),
    Object.freeze({
      id: "rex-6-9-not-implemented",
      order: 36,
      statement: "REX-6:9 has not been implemented.",
    }),
  ]);

export type RuntimeExecutiveWorkspaceExperienceCertificationInvariant =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_INVARIANTS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface RuntimeExecutiveWorkspaceExperienceCertificationCheck {
  readonly id: string;
  readonly domain: RuntimeExecutiveWorkspaceExperienceCertificationDomain;
  readonly passed: boolean;
  readonly message: string;
}

export interface RuntimeExecutiveWorkspaceExperienceCertificationResult {
  readonly status: RuntimeExecutiveWorkspaceExperienceCertificationStatus;
  readonly compatibility: RuntimeExecutiveWorkspaceExperienceCompatibilityStatus;
  readonly freeze: RuntimeExecutiveWorkspaceExperienceFreezeStatus;
  readonly lock: RuntimeExecutiveWorkspaceExperienceLockStatus;
  readonly stability: RuntimeExecutiveWorkspaceExperienceStabilityStatus;
  readonly readiness: RuntimeExecutiveWorkspaceExperiencePublicIndexReadiness;
  readonly readinessDisplay: "ReadyForPublicIndex" | "NotReady";
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly totalCheckCount: number;
  readonly domains: typeof RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_DOMAINS;
  readonly checks: ReadonlyArray<RuntimeExecutiveWorkspaceExperienceCertificationCheck>;
  readonly passedChecks: ReadonlyArray<string>;
  readonly failedChecks: ReadonlyArray<string>;
  readonly platformIdentity: typeof runtimeExecutiveWorkspaceExperiencePlatformIdentity;
  readonly platformVersion: typeof runtimeExecutiveWorkspaceExperiencePlatformVersion;
  readonly platformLock: typeof REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED | "";
  readonly certification: "Certified" | "Failed";
  readonly compatibilityDisplay: "Compatible" | "Incompatible";
  readonly freezeDisplay: "Frozen" | "Unfrozen";
  readonly lockDisplay: "Locked" | "Unlocked";
  readonly stabilityDisplay: "Stable" | "Unstable";
}

export interface RuntimeExecutiveWorkspaceExperienceFreezeManifest {
  readonly identity: typeof runtimeExecutiveWorkspaceExperiencePlatformIdentity;
  readonly version: typeof runtimeExecutiveWorkspaceExperiencePlatformVersion;
  readonly namespace: typeof runtimeExecutiveWorkspaceExperiencePlatformNamespace;
  readonly phase: typeof runtimeExecutiveWorkspaceExperiencePlatformPhase;
  readonly platformLock: typeof REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED;
  readonly workspaces: typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS;
  readonly surfaces: typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES;
  readonly participations: typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS;
  readonly presentationStates: typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRESENTATION_STATES;
  readonly compositionMatrix: typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX;
  readonly primarySurface: typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE;
  readonly transitionPhases: typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES;
  readonly surfaceTransitionKinds: typeof RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS;
  readonly transitionSources: typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES;
  readonly dialOptions: typeof RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS;
  readonly pipelineStages: typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES;
  readonly orchestrationStatuses: typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES;
  readonly capabilities: typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES;
  readonly guarantees: typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES;
  readonly approvedExports: typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS;
  readonly dialIsNotWorkspace: true;
  readonly dialIsNotSurface: true;
  readonly dialGeometryFrozen: false;
  readonly cockpitLayoutFrozen: false;
  readonly automotiveStylingFrozen: false;
  readonly visualDialFrozen: false;
  readonly semanticDialFrozen: true;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function exactOrder<T>(actual: readonly T[], expected: readonly T[]): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function freezeArray<T>(values: readonly T[]): ReadonlyArray<T> {
  return Object.freeze([...values]);
}

function check(
  id: string,
  domain: RuntimeExecutiveWorkspaceExperienceCertificationDomain,
  passed: boolean,
  message: string,
): RuntimeExecutiveWorkspaceExperienceCertificationCheck {
  return Object.freeze({ id, domain, passed, message });
}

function deepEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function participationMap(
  composition: {
    readonly surfaces: ReadonlyArray<{
      readonly surface: RuntimeExecutiveWorkspaceSurfaceRole;
      readonly participation: RuntimeExecutiveWorkspaceSurfaceParticipation;
    }>;
  },
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const entry of composition.surfaces) {
    map[entry.surface] = entry.participation;
  }
  return map;
}

function workspaceSubject(
  kind: RuntimeExecutiveWorkspaceSubjectContract["kind"],
  id: string,
): RuntimeExecutiveWorkspaceSubjectContract {
  return Object.freeze({ kind, id });
}

function subjectForWorkspace(
  workspace: RuntimeExecutiveWorkspaceKind,
  id: string,
): RuntimeExecutiveWorkspaceSubjectContract | null {
  if (workspace === "overview") return null;
  return workspaceSubject(workspace, id);
}

function experienceFor(
  kind: RuntimeExecutiveWorkspaceKind,
  subjectId?: string,
  presentation: RuntimeExecutiveWorkspacePresentationState = "report",
): RuntimeExecutiveWorkspaceExperienceSnapshot {
  const subject =
    kind === "overview"
      ? null
      : {
          kind,
          id:
            subjectId ??
            (kind === "problem"
              ? "supply-risk"
              : kind === "scenario"
                ? "scenario-a"
                : kind === "decision"
                  ? "increase-capacity"
                  : "capacity-expansion"),
        };
  const intent =
    kind === "overview"
      ? ("observe" as const)
      : kind === "problem"
        ? ("investigate" as const)
        : kind === "scenario"
          ? ("explore" as const)
          : kind === "decision"
            ? ("decide" as const)
            : ("execute" as const);

  const current = createRuntimeExecutiveWorkspaceContextContract({
    workspace: {
      workspaceId: `workspace.cert.${kind}`,
      workspaceKind: kind,
    },
    subject,
    focus: { primarySubject: subject, relatedSubjects: [] },
    intent: { intent },
    activation: { state: "active" },
    presentation: { state: presentation },
  });
  const resolution = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: current,
    requestedWorkspaceKind: kind,
    requestedSubject: current.subject,
    requestedIntent: current.intent.intent,
    requestedPresentation: presentation,
  });
  return createRuntimeExecutiveWorkspaceExperienceSnapshot({
    context: resolution.resolvedContext,
    composition: composeRuntimeExecutiveWorkspaceSurfacesFromResolution(
      resolution,
    ),
  });
}

function compositionComplete(kind: RuntimeExecutiveWorkspaceKind): boolean {
  const experience = experienceFor(kind);
  const surfaces = experience.composition.surfaces.map((entry) => entry.surface);
  const primaryCount = experience.composition.surfaces.filter(
    (entry) => entry.participation === "primary",
  ).length;
  return (
    exactOrder(surfaces, ["stage", "advisor", "insight", "action"]) &&
    unique(surfaces) &&
    primaryCount === 1 &&
    experience.composition.primarySurface === "stage" &&
    experience.composition.surfaces.every(
      (entry) =>
        entry.surface !== "stage" || entry.participation === "primary",
    ) &&
    deepEqual(
      participationMap(experience.composition),
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX[kind],
    )
  );
}

// ─── Certification checks ───────────────────────────────────────────────────

function buildCertificationChecks(): ReadonlyArray<RuntimeExecutiveWorkspaceExperienceCertificationCheck> {
  const platformVerification = verifyRuntimeExecutiveWorkspaceExperiencePlatform();
  const registry = getRuntimeExecutiveWorkspaceExperiencePlatformRegistry();
  const boundary = RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_BOUNDARY;
  const platform = runtimeExecutiveWorkspaceExperiencePlatform;

  const bootstrap = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: null,
    request: Object.freeze({ source: "system", reason: "restore" }),
  });

  const explicit = resolveRuntimeExecutiveWorkspaceContext({
    requestedWorkspaceKind: "decision",
    requestedSubject: { kind: "decision", id: "increase-capacity" },
  });
  const subjectDerived = resolveRuntimeExecutiveWorkspaceContext({
    requestedSubject: { kind: "scenario", id: "scenario-x" },
  });
  const intentDerived = resolveRuntimeExecutiveWorkspaceContext({
    requestedIntent: "execute",
  });
  const preserved = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: experienceFor("problem").context,
  });
  const fallback = resolveRuntimeExecutiveWorkspaceContext({});

  const defaultIntentsOk =
    experienceFor("overview").intent === "observe" &&
    experienceFor("problem").intent === "investigate" &&
    experienceFor("scenario").intent === "explore" &&
    experienceFor("decision").intent === "decide" &&
    experienceFor("execution").intent === "execute";

  const nonLinearPairs: ReadonlyArray<
    readonly [RuntimeExecutiveWorkspaceKind, RuntimeExecutiveWorkspaceKind]
  > = [
    ["problem", "scenario"],
    ["scenario", "decision"],
    ["decision", "execution"],
    ["decision", "scenario"],
    ["execution", "decision"],
    ["scenario", "problem"],
    ["problem", "overview"],
    ["overview", "decision"],
  ];
  const nonLinearOk = nonLinearPairs.every(([from, to]) => {
    const result = orchestrateRuntimeExecutiveWorkspaceExperience({
      currentExperience: experienceFor(from),
      request: Object.freeze({
        requestedWorkspace: to,
        ...(to === "overview"
          ? {}
          : {
              requestedSubject: {
                kind: to,
                id: `${to}-nl`,
              },
            }),
        source: "user" as const,
        reason: "user-request" as const,
      }),
    });
    return (
      result.status === "resolved" &&
      result.nextExperience?.workspace === to &&
      result.workspaceChanged === true
    );
  });

  const sameWorkspace = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("scenario", "scenario-a"),
    request: Object.freeze({
      requestedWorkspace: "scenario",
      requestedSubject: workspaceSubject("scenario", "scenario-b"),
      source: "user",
      reason: "subject-selection",
    }),
  });

  const presentationCombos: ReadonlyArray<
    readonly [
      RuntimeExecutiveWorkspaceKind,
      RuntimeExecutiveWorkspacePresentationState,
    ]
  > = [
    ["decision", "minimum"],
    ["decision", "report"],
    ["decision", "operation"],
    ["scenario", "minimum"],
    ["scenario", "report"],
    ["scenario", "operation"],
    ["execution", "report"],
  ];
  const presentationOk = presentationCombos.every(([workspace, presentation]) => {
    const result = orchestrateRuntimeExecutiveWorkspaceExperience({
      currentExperience: experienceFor("overview", undefined, presentation),
      request: Object.freeze({
        requestedWorkspace: workspace,
        requestedSubject: subjectForWorkspace(workspace, `${workspace}-p`),
        requestedPresentation: presentation,
        source: "user" as const,
        reason: "user-request" as const,
      }),
    });
    return (
      result.status === "resolved" &&
      result.nextExperience?.workspace === workspace &&
      result.nextExperience?.presentation === presentation
    );
  });

  const presentationPreserved = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("scenario", "scenario-a", "report"),
    request: Object.freeze({
      requestedWorkspace: "decision",
      requestedSubject: workspaceSubject("decision", "increase-capacity"),
      source: "user",
      reason: "user-request",
    }),
  });

  const surfaceTransitions =
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "supporting",
      to: "supporting",
    }) === "preserve" &&
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "inactive",
      to: "contextual",
    }) === "activate" &&
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "contextual",
      to: "supporting",
    }) === "promote" &&
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "supporting",
      to: "contextual",
    }) === "demote" &&
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "supporting",
      to: "inactive",
    }) === "deactivate";

  const dialNormalized = normalizeRuntimeExecutiveWorkspaceDialRequest({
    requestedWorkspace: "decision",
    requestedSubject: { kind: "decision", id: "increase-capacity" },
  });

  const problemToScenario = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("problem"),
    request: Object.freeze({
      requestedWorkspace: "scenario",
      requestedSubject: workspaceSubject("scenario", "scenario-b"),
      source: "dial",
      reason: "user-request",
    }),
  });
  const scenarioToDecision = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("scenario", "scenario-b"),
    request: Object.freeze({
      requestedWorkspace: "decision",
      requestedSubject: workspaceSubject("decision", "increase-capacity"),
      source: "user",
      reason: "user-request",
    }),
  });
  const decisionToExecution = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("decision"),
    request: Object.freeze({
      requestedWorkspace: "execution",
      requestedSubject: workspaceSubject("execution", "capacity-expansion"),
      source: "action",
      reason: "action-result",
    }),
  });

  const identical = experienceFor("decision", "increase-capacity", "report");
  const unchanged = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: identical,
    request: Object.freeze({
      requestedWorkspace: "decision",
      requestedSubject: identical.subject,
      requestedIntent: "decide",
      requestedPresentation: "report",
      source: "user",
      reason: "user-request",
    }),
  });

  const rejected = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: experienceFor("decision"),
    request: Object.freeze({
      source: "user",
      reason: "not-a-reason" as never,
    } as never),
  });

  const sourceEquivalence = (
    ["user", "dial", "advisor", "action", "runtime", "system"] as const
  ).every((source) => {
    const result = orchestrateRuntimeExecutiveWorkspaceExperience({
      currentExperience: experienceFor("overview"),
      request: Object.freeze({
        requestedWorkspace: "decision",
        requestedSubject: workspaceSubject("decision", "increase-capacity"),
        source,
        reason: "user-request",
      }),
    });
    return (
      result.status === "resolved" &&
      result.nextExperience?.workspace === "decision" &&
      result.source === source
    );
  });

  const detBootstrapA = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: null,
    request: Object.freeze({ source: "system", reason: "restore" }),
  });
  const detBootstrapB = orchestrateRuntimeExecutiveWorkspaceExperience({
    currentExperience: null,
    request: Object.freeze({ source: "system", reason: "restore" }),
  });
  const detDialA = normalizeRuntimeExecutiveWorkspaceDialRequest({
    requestedWorkspace: "decision",
  });
  const detDialB = normalizeRuntimeExecutiveWorkspaceDialRequest({
    requestedWorkspace: "decision",
  });
  const detTransitionA = resolveRuntimeExecutiveWorkspaceSurfaceTransition({
    from: "contextual",
    to: "supporting",
  });
  const detTransitionB = resolveRuntimeExecutiveWorkspaceSurfaceTransition({
    from: "contextual",
    to: "supporting",
  });
  const detPlatformA = verifyRuntimeExecutiveWorkspaceExperiencePlatform();
  const detPlatformB = verifyRuntimeExecutiveWorkspaceExperiencePlatform();

  const probeContext = experienceFor("problem").context;
  const probeBefore = JSON.stringify(probeContext);
  resolveRuntimeExecutiveWorkspaceContext({
    currentContext: probeContext,
    requestedWorkspaceKind: "scenario",
    requestedSubject: { kind: "scenario", id: "scenario-probe" },
  });
  const probeUnmutated = JSON.stringify(probeContext) === probeBefore;

  const serializationSafe =
    !JSON.stringify(registry).includes("[object Map]") &&
    !JSON.stringify(platformVerification).includes("\"__proto__\"") &&
    typeof registry.identity === "string";

  const forbiddenSurfacesAbsent = (
    ["dial", "workspace-dial", "timeline", "left-nav", "right-panel", "top-controls"] as const
  ).every(
    (value) =>
      !(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES as readonly string[])
        .includes(value) &&
      !(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS as readonly string[])
        .includes(value),
  );

  return freezeArray([
    check(
      "identity-platform",
      "identity",
      runtimeExecutiveWorkspaceExperiencePlatformIdentity ===
        "REX-6:7/RuntimeExecutiveWorkspaceExperiencePlatform" &&
        runtimeExecutiveWorkspaceExperiencePlatformVersion === "6.7.0" &&
        runtimeExecutiveWorkspaceExperiencePlatformPhase === "Platform" &&
        platformVerification.valid,
      "Upstream REX-6:7 identity/version/phase are exact and valid",
    ),
    check(
      "identity-certification",
      "identity",
      runtimeExecutiveWorkspaceExperienceCertificationFreezeIdentity ===
        "REX-6:8/RuntimeExecutiveWorkspaceExperienceCertificationFreeze" &&
        runtimeExecutiveWorkspaceExperienceCertificationFreezeVersion ===
          "6.8.0" &&
        runtimeExecutiveWorkspaceExperienceCertificationFreezePhase ===
          "CertificationFreeze",
      "REX-6:8 certification identity is exact",
    ),
    check(
      "dependency-sole",
      "dependency",
      runtimeExecutiveWorkspaceExperienceCertificationFreezeDependencyIdentity ===
        "REX-6:7/RuntimeExecutiveWorkspaceExperiencePlatform" &&
        RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_BOUNDARY
          .consumesPlatformOnly &&
        !RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_BOUNDARY
          .importsRex66Directly,
      "Sole immediate dependency is REX-6:7 platform",
    ),
    check(
      "platform-integrity",
      "platform-integrity",
      platformVerification.valid &&
        platform.readyForCertification &&
        !platform.isCertified &&
        !platform.isFrozen,
      "Platform verification is valid and pre-certification",
    ),
    check(
      "workspace-vocabulary",
      "workspace-vocabulary",
      exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS], [
        "overview",
        "problem",
        "scenario",
        "decision",
        "execution",
      ]) &&
        unique([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS]) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS),
      "Canonical workspace set is exact, unique, and frozen",
    ),
    check(
      "surface-vocabulary",
      "workspace-vocabulary",
      exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES], [
        "stage",
        "advisor",
        "insight",
        "action",
      ]) &&
        unique([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES]) &&
        forbiddenSurfacesAbsent &&
        Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES),
      "Canonical surfaces exact; dial/timeline/cockpit controls excluded",
    ),
    check(
      "participation-vocabulary",
      "contract-integrity",
      exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS], [
        "primary",
        "supporting",
        "contextual",
        "inactive",
      ]) && unique([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS]),
      "Participation vocabulary is exact and unique",
    ),
    check(
      "context-resolution",
      "context-resolution",
      explicit.resolvedWorkspaceKind === "decision" &&
        subjectDerived.resolvedWorkspaceKind === "scenario" &&
        intentDerived.resolvedWorkspaceKind === "execution" &&
        preserved.resolvedWorkspaceKind === "problem" &&
        fallback.resolvedWorkspaceKind === "overview" &&
        defaultIntentsOk,
      "Explicit/subject/intent/preserve/fallback resolution and default intents hold",
    ),
    check(
      "surface-composition-matrix",
      "surface-composition",
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS.every((kind) =>
        compositionComplete(kind),
      ) &&
        RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE === "stage",
      "All five compositions complete with Stage primary exactly once",
    ),
    check(
      "stage-primary",
      "surface-composition",
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS.every(
        (kind) =>
          RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX[kind].stage ===
            "primary" && experienceFor(kind).composition.primarySurface === "stage",
      ),
      "Stage is semantic primary for every canonical workspace",
    ),
    check(
      "presentation-independence",
      "presentation-independence",
      presentationOk &&
        presentationPreserved.nextExperience?.presentation === "report" &&
        presentationPreserved.nextExperience?.workspace === "decision",
      "Workspace/presentation combinations remain independent",
    ),
    check(
      "non-linear-navigation",
      "non-linear-navigation",
      nonLinearOk,
      "Forward and backward workspace transitions remain supported",
    ),
    check(
      "same-workspace-context-change",
      "experience-orchestration",
      sameWorkspace.status === "resolved" &&
        sameWorkspace.workspaceChanged === false &&
        sameWorkspace.contextChanged === true &&
        sameWorkspace.transition?.subject.kind === "replace",
      "scenario:A → scenario:B yields workspaceChanged=false contextChanged=true",
    ),
    check(
      "transition-phases",
      "transition-orchestration",
      exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES], [
        "prepare",
        "leave",
        "enter",
        "settle",
      ]) &&
        unique([...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES]) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES),
      "Transition phases prepare→leave→enter→settle are exact and immutable",
    ),
    check(
      "surface-transition-classification",
      "transition-orchestration",
      surfaceTransitions &&
        exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS], [
          "preserve",
          "activate",
          "deactivate",
          "promote",
          "demote",
        ]) &&
        RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK.inactive === 0 &&
        RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK.contextual === 1 &&
        RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK.supporting === 2 &&
        RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK.primary === 3,
      "Surface transition kinds and participation ranks are exact",
    ),
    check(
      "dial-boundary",
      "dial-boundary",
      dialNormalized.source === "dial" &&
        dialNormalized.requestedWorkspaceKind === "decision" &&
        dialNormalized.reason === "user-request" &&
        (RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES as readonly string[])
          .includes("dial") &&
        !(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS as readonly string[])
          .includes("dial") &&
        !(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES as readonly string[])
          .includes("dial") &&
        platform.dialIsNotSurface &&
        exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS], [
          "overview",
          "problem",
          "scenario",
          "decision",
          "execution",
        ]),
      "Dial is semantic source/control only — not workspace or surface",
    ),
    check(
      "dial-geometry-absent",
      "dial-boundary",
      !("angle" in dialNormalized) &&
        !("degrees" in dialNormalized) &&
        !("radius" in dialNormalized) &&
        !("rotation" in dialNormalized) &&
        boundary.dialGeometryIndependent &&
        RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_BOUNDARY
          .introducesDialGeometry === false &&
        RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_BOUNDARY
          .freezesAutomotiveStyling === false,
      "Dial geometry and automotive styling remain unfrozen",
    ),
    check(
      "input-device-independence",
      "compatibility",
      sourceEquivalence &&
        exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES], [
          "user",
          "dial",
          "advisor",
          "action",
          "runtime",
          "system",
        ]),
      "Equivalent semantic requests work across approved sources",
    ),
    check(
      "experience-orchestration",
      "experience-orchestration",
      bootstrap.status === "resolved" &&
        bootstrap.nextExperience?.workspace === "overview" &&
        bootstrap.nextExperience?.intent === "observe" &&
        problemToScenario.status === "resolved" &&
        problemToScenario.source === "dial" &&
        scenarioToDecision.status === "resolved" &&
        scenarioToDecision.transition?.surfaces.find(
          (entry) => entry.surface === "action",
        )?.kind === "promote" &&
        decisionToExecution.status === "resolved" &&
        decisionToExecution.source === "action" &&
        unchanged.status === "unchanged" &&
        unchanged.workspaceChanged === false &&
        unchanged.contextChanged === false &&
        rejected.status === "rejected",
      "Bootstrap, transitions, unchanged, rejected, and Action-origin orchestration hold",
    ),
    check(
      "pipeline-order",
      "experience-orchestration",
      exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES], [
        "request",
        "context-resolution",
        "surface-composition",
        "transition-orchestration",
        "snapshot",
        "complete",
      ]) &&
        deepEqual(
          problemToScenario.trace.stages.map((entry) => entry.stage),
          [...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES],
        ),
      "Canonical orchestration pipeline order is exact",
    ),
    check(
      "bootstrap",
      "experience-orchestration",
      bootstrap.reason === "bootstrap" &&
        deepEqual(
          participationMap(bootstrap.nextExperience!.composition),
          RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX.overview,
        ),
      "Bootstrap resolves to overview/observe with overview composition",
    ),
    check(
      "snapshot-coherence",
      "experience-orchestration",
      problemToScenario.nextExperience !== null &&
        problemToScenario.nextExperience.workspace ===
          problemToScenario.resolvedContext!.workspace.workspaceKind &&
        deepEqual(
          problemToScenario.nextExperience.composition,
          problemToScenario.targetComposition,
        ) &&
        problemToScenario.nextExperience.subject?.id === "scenario-b",
      "Next snapshot matches resolved context and target composition",
    ),
    check(
      "determinism",
      "determinism",
      deepEqual(detBootstrapA, detBootstrapB) &&
        deepEqual(detDialA, detDialB) &&
        detTransitionA === detTransitionB &&
        deepEqual(detPlatformA, detPlatformB) &&
        deepEqual(
          normalizeRuntimeExecutiveWorkspaceDialRequest({
            requestedWorkspace: "decision",
            requestedSubject: {
              kind: "decision",
              id: "increase-capacity",
            },
          }),
          dialNormalized,
        ),
      "Representative APIs and certification inputs are deterministic",
    ),
    check(
      "immutability",
      "immutability",
      Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES) &&
        Object.isFrozen(
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES,
        ) &&
        Object.isFrozen(
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS,
        ) &&
        Object.isFrozen(
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES,
        ) &&
        REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED ===
          "REX-6-RUNTIME-EXECUTIVE-WORKSPACE-EXPERIENCE-PLATFORM-LOCKED" &&
        probeUnmutated,
      "Canonical registries are frozen and inputs are not mutated",
    ),
    check(
      "serialization",
      "serialization",
      serializationSafe &&
        typeof JSON.parse(JSON.stringify(platformVerification)) === "object",
      "Platform/certification metadata is serialization-friendly",
    ),
    check(
      "framework-independence",
      "framework-independence",
      boundary.frameworkIndependent &&
        RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_BOUNDARY.introducesUi ===
          false,
      "Framework independence preserved; no UI introduced",
    ),
    check(
      "renderer-independence",
      "renderer-independence",
      boundary.rendererIndependent &&
        boundary.animationTimingIndependent,
      "Renderer independence preserved",
    ),
    check(
      "cockpit-layout-independence",
      "business-independence",
      boundary.cockpitLayoutIndependent &&
        RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_BOUNDARY
          .freezesCockpitLayout === false,
      "No cockpit layout geometry is frozen",
    ),
    check(
      "business-independence",
      "business-independence",
      boundary.introducesBusinessExecution === false &&
        RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_BOUNDARY
          .freezesBusinessWorkflow === false &&
        decisionToExecution.status === "resolved" &&
        decisionToExecution.source === "action",
      "Business workflows unfrozen; Action-origin requests orchestrate without execution",
    ),
    check(
      "approved-exports",
      "approved-exports",
      unique([...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS]) &&
        RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_FUNCTIONAL_APIS.every(
          (name) =>
            (
              RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS as readonly string[]
            ).includes(name),
        ) &&
        RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PUBLIC_TYPES.every(
          (name) =>
            (
              RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS as readonly string[]
            ).includes(name),
        ) &&
        !(
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS as readonly string[]
        ).includes("useState") &&
        !(
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS as readonly string[]
        ).includes("Mesh"),
      "Approved exports unique, complete, and free of UI/renderer symbols",
    ),
    check(
      "platform-capabilities",
      "platform-guarantees",
      exactOrder(
        [...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES],
        [
          "workspace-foundation",
          "workspace-contracts",
          "context-resolution",
          "surface-composition",
          "transition-orchestration",
          "dial-request-normalization",
          "experience-orchestration",
          "snapshot-derivation",
          "validation",
          "registry-inspection",
        ],
      ) &&
        getRuntimeExecutiveWorkspaceExperiencePlatformCapabilities() ===
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES,
      "Platform capabilities remain exact and unique",
    ),
    check(
      "platform-guarantees",
      "platform-guarantees",
      exactOrder(
        [...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES],
        [
          "determinism",
          "immutability",
          "serialization",
          "workspace-canonicality",
          "non-linear-navigation",
          "presentation-independence",
          "surface-completeness",
          "single-primary-surface",
          "stage-primary",
          "transition-determinism",
          "same-workspace-context-change",
          "dial-semantic-independence",
          "renderer-independence",
          "framework-independence",
          "business-action-independence",
        ],
      ) &&
        getRuntimeExecutiveWorkspaceExperiencePlatformGuarantees() ===
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES,
      "Platform guarantees match implemented certified behavior",
    ),
    check(
      "registry-integrity",
      "registry-integrity",
      exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_SECTIONS], [
        "Identity",
        "PublicTypes",
        "PublicAPIs",
        "Resolution",
        "Composition",
        "Transition",
        "Orchestration",
        "Validation",
        "Registry",
        "Guarantees",
      ]) &&
        registry.sectionCount ===
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_SECTIONS.length &&
        registry.capabilityCount ===
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES.length &&
        registry.approvedExportCount ===
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS.length &&
        registry.guaranteeCount ===
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES.length &&
        registry.workspaceCount === 5 &&
        registry.surfaceCount === 4,
      "Platform registry sections and derived counts are consistent",
    ),
    check(
      "freeze-lock-identity",
      "freeze-integrity",
      REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED ===
        "REX-6-RUNTIME-EXECUTIVE-WORKSPACE-EXPERIENCE-PLATFORM-LOCKED",
      "Canonical platform lock identity is exact",
    ),
    check(
      "compatibility",
      "compatibility",
      platformVerification.valid &&
        nonLinearOk &&
        presentationOk &&
        sameWorkspace.contextChanged &&
        !sameWorkspace.workspaceChanged,
      "Compatibility-critical platform behaviors hold",
    ),
    check(
      "no-public-index-yet",
      "freeze-integrity",
      RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_BOUNDARY
        .isFinalPublicConsumerIndex === false &&
        RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_BOUNDARY
          .readyForConsumer === false &&
        RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_BOUNDARY.isReleased ===
          false,
      "REX-6:9 release/consumer semantics are not claimed",
    ),
    check(
      "transition-planning-available",
      "transition-orchestration",
      typeof planRuntimeExecutiveWorkspaceTransition === "function" &&
        problemToScenario.transition !== null &&
        problemToScenario.transition.status === "planned",
      "Transition planning remains available through the platform",
    ),
    check(
      "identity-api",
      "identity",
      getRuntimeExecutiveWorkspaceExperiencePlatformIdentity().identity ===
        "REX-6:7/RuntimeExecutiveWorkspaceExperiencePlatform" &&
        getRuntimeExecutiveWorkspaceExperiencePlatformRegistry() === registry,
      "Platform identity/registry APIs remain stable",
    ),
  ]);
}

export const RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_CHECKS =
  buildCertificationChecks();

function deriveStatuses(
  checks: ReadonlyArray<RuntimeExecutiveWorkspaceExperienceCertificationCheck>,
): Omit<
  RuntimeExecutiveWorkspaceExperienceCertificationResult,
  "checks" | "domains" | "platformIdentity" | "platformVersion"
> & {
  readonly checks: ReadonlyArray<RuntimeExecutiveWorkspaceExperienceCertificationCheck>;
  readonly domains: typeof RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_DOMAINS;
  readonly platformIdentity: typeof runtimeExecutiveWorkspaceExperiencePlatformIdentity;
  readonly platformVersion: typeof runtimeExecutiveWorkspaceExperiencePlatformVersion;
} {
  const passedChecks = checks.filter((entry) => entry.passed).map((e) => e.id);
  const failedChecks = checks.filter((entry) => !entry.passed).map((e) => e.id);
  const passedCheckCount = passedChecks.length;
  const failedCheckCount = failedChecks.length;
  const totalCheckCount = checks.length;
  const certified = failedCheckCount === 0;
  const compatible =
    certified &&
    checks
      .filter((entry) => entry.domain === "compatibility")
      .every((entry) => entry.passed);
  const freeze: RuntimeExecutiveWorkspaceExperienceFreezeStatus = certified
    ? "frozen"
    : "unfrozen";
  const lock: RuntimeExecutiveWorkspaceExperienceLockStatus =
    freeze === "frozen" ? "locked" : "unlocked";
  const stability: RuntimeExecutiveWorkspaceExperienceStabilityStatus =
    certified && compatible ? "stable" : "unstable";
  const readiness: RuntimeExecutiveWorkspaceExperiencePublicIndexReadiness =
    certified &&
    compatible &&
    freeze === "frozen" &&
    lock === "locked" &&
    stability === "stable"
      ? "ready-for-public-index"
      : "not-ready";

  return Object.freeze({
    status: certified ? ("certified" as const) : ("failed" as const),
    compatibility: compatible
      ? ("compatible" as const)
      : ("incompatible" as const),
    freeze,
    lock,
    stability,
    readiness,
    readinessDisplay:
      readiness === "ready-for-public-index"
        ? ("ReadyForPublicIndex" as const)
        : ("NotReady" as const),
    passedCheckCount,
    failedCheckCount,
    totalCheckCount,
    domains: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_DOMAINS,
    checks,
    passedChecks: freezeArray(passedChecks),
    failedChecks: freezeArray(failedChecks),
    platformIdentity: runtimeExecutiveWorkspaceExperiencePlatformIdentity,
    platformVersion: runtimeExecutiveWorkspaceExperiencePlatformVersion,
    platformLock: certified
      ? REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED
      : ("" as const),
    certification: certified ? ("Certified" as const) : ("Failed" as const),
    compatibilityDisplay: compatible
      ? ("Compatible" as const)
      : ("Incompatible" as const),
    freezeDisplay: freeze === "frozen" ? ("Frozen" as const) : ("Unfrozen" as const),
    lockDisplay: lock === "locked" ? ("Locked" as const) : ("Unlocked" as const),
    stabilityDisplay:
      stability === "stable" ? ("Stable" as const) : ("Unstable" as const),
  });
}

// ─── Public APIs ────────────────────────────────────────────────────────────

export function certifyRuntimeExecutiveWorkspaceExperience():
  RuntimeExecutiveWorkspaceExperienceCertificationResult {
  return deriveStatuses(RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_CHECKS);
}

export function verifyRuntimeExecutiveWorkspaceExperienceCompatibility():
  Readonly<{
    readonly status: RuntimeExecutiveWorkspaceExperienceCompatibilityStatus;
    readonly reasons: ReadonlyArray<string>;
  }> {
  const result = certifyRuntimeExecutiveWorkspaceExperience();
  return Object.freeze({
    status: result.compatibility,
    reasons: result.failedChecks,
  });
}

export function getRuntimeExecutiveWorkspaceExperienceFreezeManifest():
  RuntimeExecutiveWorkspaceExperienceFreezeManifest {
  return runtimeExecutiveWorkspaceExperienceFreezeManifest;
}

export function getRuntimeExecutiveWorkspaceExperienceCertificationFreezeIdentity():
  typeof runtimeExecutiveWorkspaceExperienceCertificationFreezeCanonicalIdentity {
  return runtimeExecutiveWorkspaceExperienceCertificationFreezeCanonicalIdentity;
}

export function getRuntimeExecutiveWorkspaceExperienceCertificationSummary():
  Readonly<{
    readonly status: RuntimeExecutiveWorkspaceExperienceCertificationStatus;
    readonly compatibility: RuntimeExecutiveWorkspaceExperienceCompatibilityStatus;
    readonly freeze: RuntimeExecutiveWorkspaceExperienceFreezeStatus;
    readonly lock: RuntimeExecutiveWorkspaceExperienceLockStatus;
    readonly stability: RuntimeExecutiveWorkspaceExperienceStabilityStatus;
    readonly readiness: RuntimeExecutiveWorkspaceExperiencePublicIndexReadiness;
    readonly readinessDisplay: "ReadyForPublicIndex" | "NotReady";
    readonly domainCount: number;
    readonly checkCount: number;
    readonly passed: number;
    readonly failed: number;
    readonly platformLock: typeof REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED | "";
    readonly certification: "Certified" | "Failed";
  }> {
  const result = certifyRuntimeExecutiveWorkspaceExperience();
  return Object.freeze({
    status: result.status,
    compatibility: result.compatibility,
    freeze: result.freeze,
    lock: result.lock,
    stability: result.stability,
    readiness: result.readiness,
    readinessDisplay: result.readinessDisplay,
    domainCount: result.domains.length,
    checkCount: result.totalCheckCount,
    passed: result.passedCheckCount,
    failed: result.failedCheckCount,
    platformLock: result.platformLock,
    certification: result.certification,
  });
}

export const runtimeExecutiveWorkspaceExperienceFreezeManifest =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperiencePlatformIdentity,
    version: runtimeExecutiveWorkspaceExperiencePlatformVersion,
    namespace: runtimeExecutiveWorkspaceExperiencePlatformNamespace,
    phase: runtimeExecutiveWorkspaceExperiencePlatformPhase,
    platformLock: REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED,
    workspaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
    surfaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
    participations: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
    presentationStates:
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRESENTATION_STATES,
    compositionMatrix: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX,
    primarySurface: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE,
    transitionPhases: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES,
    surfaceTransitionKinds:
      RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS,
    transitionSources: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES,
    dialOptions: RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS,
    pipelineStages: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES,
    orchestrationStatuses:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES,
    capabilities: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES,
    guarantees: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES,
    approvedExports: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS,
    dialIsNotWorkspace: true as const,
    dialIsNotSurface: true as const,
    dialGeometryFrozen: false as const,
    cockpitLayoutFrozen: false as const,
    automotiveStylingFrozen: false as const,
    visualDialFrozen: false as const,
    semanticDialFrozen: true as const,
  }) satisfies RuntimeExecutiveWorkspaceExperienceFreezeManifest;

export const runtimeExecutiveWorkspaceExperienceCertificationFreezeRegistry =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveWorkspaceExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveWorkspaceExperienceCertificationFreezeNamespace,
    phase: runtimeExecutiveWorkspaceExperienceCertificationFreezePhase,
    architecturalRole:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_REGISTRY_SECTIONS,
    sectionCount:
      RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_REGISTRY_SECTIONS.length,
    domains: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_DOMAINS,
    domainCount: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_DOMAINS.length,
    checks: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_CHECKS,
    checkCount: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_CHECKS.length,
    statuses: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_STATUSES,
    compatibilityStatuses: RUNTIME_EXECUTIVE_WORKSPACE_COMPATIBILITY_STATUSES,
    freezeStatuses: RUNTIME_EXECUTIVE_WORKSPACE_FREEZE_STATUSES,
    lockStatuses: RUNTIME_EXECUTIVE_WORKSPACE_LOCK_STATUSES,
    stabilityStatuses: RUNTIME_EXECUTIVE_WORKSPACE_STABILITY_STATUSES,
    readinessStatuses: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_READINESS,
    platformLock: REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED,
    invariants: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_INVARIANTS,
    invariantCount: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_INVARIANTS.length,
    freezeManifest: runtimeExecutiveWorkspaceExperienceFreezeManifest,
  });

export function getRuntimeExecutiveWorkspaceExperienceCertificationFreezeRegistry():
  typeof runtimeExecutiveWorkspaceExperienceCertificationFreezeRegistry {
  return runtimeExecutiveWorkspaceExperienceCertificationFreezeRegistry;
}

export interface RuntimeExecutiveWorkspaceExperienceCertificationFreezeVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveWorkspaceExperienceCertificationFreezeIdentity;
  readonly version: typeof runtimeExecutiveWorkspaceExperienceCertificationFreezeVersion;
  readonly namespace: typeof runtimeExecutiveWorkspaceExperienceCertificationFreezeNamespace;
  readonly phase: typeof runtimeExecutiveWorkspaceExperienceCertificationFreezePhase;
  readonly dependencyIdentity: typeof runtimeExecutiveWorkspaceExperienceCertificationFreezeDependencyIdentity;
  readonly platformLock: typeof REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED;
  readonly domainCount: number;
  readonly checkCount: number;
  readonly invariantCount: number;
  readonly domainsUnique: boolean;
  readonly checkIdsUnique: boolean;
  readonly certified: boolean;
  readonly compatible: boolean;
  readonly frozen: boolean;
  readonly locked: boolean;
  readonly stable: boolean;
  readonly readyForPublicIndex: boolean;
  readonly isReleased: false;
  readonly readyForConsumer: false;
}

export function verifyRuntimeExecutiveWorkspaceExperienceCertificationFreeze():
  RuntimeExecutiveWorkspaceExperienceCertificationFreezeVerification {
  const result = certifyRuntimeExecutiveWorkspaceExperience();
  const domainsUnique = unique([
    ...RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_DOMAINS,
  ]);
  const checkIdsUnique = unique(
    RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_CHECKS.map((entry) => entry.id),
  );
  const countsOk =
    result.passedCheckCount + result.failedCheckCount ===
    result.totalCheckCount;
  const gatesOk =
    (result.status === "certified") === (result.failedCheckCount === 0) &&
    (result.freeze === "frozen") === (result.status === "certified") &&
    (result.lock === "locked") === (result.freeze === "frozen") &&
    (result.stability === "stable") ===
      (result.status === "certified" &&
        result.compatibility === "compatible") &&
    (result.readiness === "ready-for-public-index") ===
      (result.status === "certified" &&
        result.compatibility === "compatible" &&
        result.freeze === "frozen" &&
        result.lock === "locked" &&
        result.stability === "stable");

  const ok =
    result.status === "certified" &&
    result.compatibility === "compatible" &&
    result.freeze === "frozen" &&
    result.lock === "locked" &&
    result.stability === "stable" &&
    result.readiness === "ready-for-public-index" &&
    domainsUnique &&
    checkIdsUnique &&
    countsOk &&
    gatesOk &&
    RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_INVARIANTS.length === 36 &&
    Object.isFrozen(runtimeExecutiveWorkspaceExperienceFreezeManifest) &&
    Object.isFrozen(
      RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_CHECKS,
    );

  return Object.freeze({
    ok,
    identity: runtimeExecutiveWorkspaceExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveWorkspaceExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveWorkspaceExperienceCertificationFreezeNamespace,
    phase: runtimeExecutiveWorkspaceExperienceCertificationFreezePhase,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeDependencyIdentity,
    platformLock: REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED,
    domainCount: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_DOMAINS.length,
    checkCount: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_CHECKS.length,
    invariantCount: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_INVARIANTS.length,
    domainsUnique,
    checkIdsUnique,
    certified: result.status === "certified",
    compatible: result.compatibility === "compatible",
    frozen: result.freeze === "frozen",
    locked: result.lock === "locked",
    stable: result.stability === "stable",
    readyForPublicIndex: result.readiness === "ready-for-public-index",
    isReleased: false,
    readyForConsumer: false,
  });
}

export const runtimeExecutiveWorkspaceExperienceCertificationFreeze =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperienceCertificationFreezeIdentity,
    version: runtimeExecutiveWorkspaceExperienceCertificationFreezeVersion,
    namespace: runtimeExecutiveWorkspaceExperienceCertificationFreezeNamespace,
    phase: runtimeExecutiveWorkspaceExperienceCertificationFreezePhase,
    architecturalRole:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeArchitecturalRole,
    consumerRole:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeConsumerRole,
    upstreamDependency:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeSupportedImportPath,
    principle: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_PRINCIPLE,
    boundary: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_FREEZE_BOUNDARY,
    platformLock: REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED,
    domains: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_DOMAINS,
    checks: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_CHECKS,
    invariants: RUNTIME_EXECUTIVE_WORKSPACE_CERTIFICATION_INVARIANTS,
    freezeManifest: runtimeExecutiveWorkspaceExperienceFreezeManifest,
    registry: runtimeExecutiveWorkspaceExperienceCertificationFreezeRegistry,
    status: runtimeExecutiveWorkspaceExperienceCertificationFreezeStatus,
    stability: runtimeExecutiveWorkspaceExperienceCertificationFreezeStability,
    isReleased: false as const,
    readyForConsumer: false as const,
    architecturalStatus:
      "REX-6:8 Runtime Executive Workspace Experience Certification & Freeze — Certified · Compatible · Frozen · Locked · Stable · ReadyForPublicIndex" as const,
  });
