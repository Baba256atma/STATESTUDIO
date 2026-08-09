/**
 * REX-6:7 — Runtime Executive Workspace Experience Platform.
 *
 * Packages approved REX-6:1–6:6 capabilities into one coherent, deterministic,
 * inspectable runtime workspace-experience platform surface for later
 * certification (REX-6:8) and public index (REX-6:9).
 *
 * Assemble / expose / register / describe / verify.
 * Does not introduce new workspace semantics, resolution, composition,
 * transition, or orchestration policy. No UI, Dial geometry, cockpit layout,
 * React, or Three.js/R3F.
 *
 * REX-6:1..6:6 build capabilities.
 * REX-6:7 packages capabilities.
 * REX-6:8 certifies and freezes capabilities.
 * REX-6:9 publishes capabilities.
 */

import {
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
  RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES,
  RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK,
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES,
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  createRuntimeExecutiveWorkspaceContextContract,
  createRuntimeExecutiveWorkspaceExperienceSnapshot,
  deriveRuntimeExecutiveWorkspaceExperienceSnapshot,
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
  runtimeExecutiveWorkspaceExperienceOrchestrationIdentity,
  runtimeExecutiveWorkspaceExperienceOrchestrationSupportedImportPath,
  runtimeExecutiveWorkspaceExperienceOrchestrationVersion,
  verifyRuntimeExecutiveWorkspaceExperienceOrchestration,
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
} from "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceOrchestration";

// ─── Approved platform re-exports (no behavior change) ──────────────────────

export {
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
  RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES,
  RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PIPELINE_STAGES,
  RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK,
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES,
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  createRuntimeExecutiveWorkspaceContextContract,
  createRuntimeExecutiveWorkspaceExperienceSnapshot,
  deriveRuntimeExecutiveWorkspaceExperienceSnapshot,
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

export const runtimeExecutiveWorkspaceExperiencePlatformIdentity =
  "REX-6:7/RuntimeExecutiveWorkspaceExperiencePlatform" as const;

export const runtimeExecutiveWorkspaceExperiencePlatformVersion =
  "6.7.0" as const;

export const runtimeExecutiveWorkspaceExperiencePlatformNamespace =
  "nexora.rex.workspace-experience.platform" as const;

export const runtimeExecutiveWorkspaceExperiencePlatformLayer =
  "REX" as const;

export const runtimeExecutiveWorkspaceExperiencePlatformCapability =
  "RuntimeExecutiveWorkspaceExperience" as const;

export const runtimeExecutiveWorkspaceExperiencePlatformPhase =
  "Platform" as const;

export const runtimeExecutiveWorkspaceExperiencePlatformStatus =
  "Assembled" as const;

export const runtimeExecutiveWorkspaceExperiencePlatformArchitecturalRole =
  "RuntimeExecutiveWorkspaceExperiencePlatform" as const;

export const runtimeExecutiveWorkspaceExperiencePlatformConsumerRole =
  "PlatformInternal" as const;

export const runtimeExecutiveWorkspaceExperiencePlatformDependencyIdentity =
  runtimeExecutiveWorkspaceExperienceOrchestrationIdentity;

export const runtimeExecutiveWorkspaceExperiencePlatformDependencyPath =
  runtimeExecutiveWorkspaceExperienceOrchestrationSupportedImportPath;

export const runtimeExecutiveWorkspaceExperiencePlatformSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveWorkspaceExperiencePlatform" as const;

export const runtimeExecutiveWorkspaceExperiencePlatformStability =
  "ReadyForCertification" as const;

export const runtimeExecutiveWorkspaceExperiencePlatformDeterministic =
  true as const;

export const runtimeExecutiveWorkspaceExperiencePlatformSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveWorkspaceExperiencePlatformMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveWorkspaceExperiencePlatformCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperiencePlatformIdentity,
    version: runtimeExecutiveWorkspaceExperiencePlatformVersion,
    namespace: runtimeExecutiveWorkspaceExperiencePlatformNamespace,
    layer: runtimeExecutiveWorkspaceExperiencePlatformLayer,
    capability: runtimeExecutiveWorkspaceExperiencePlatformCapability,
    phase: runtimeExecutiveWorkspaceExperiencePlatformPhase,
    status: runtimeExecutiveWorkspaceExperiencePlatformStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceExperiencePlatformArchitecturalRole,
    consumerRole: runtimeExecutiveWorkspaceExperiencePlatformConsumerRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperiencePlatformDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceExperiencePlatformDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperiencePlatformSupportedImportPath,
    upstreamVersion:
      runtimeExecutiveWorkspaceExperienceOrchestrationVersion,
    stabilityStatus: runtimeExecutiveWorkspaceExperiencePlatformStability,
    deterministicStatus:
      runtimeExecutiveWorkspaceExperiencePlatformDeterministic,
    sideEffectPolicy:
      runtimeExecutiveWorkspaceExperiencePlatformSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveWorkspaceExperiencePlatformMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PRINCIPLE =
  "REX-6:1..6:6 build capabilities; REX-6:7 packages capabilities; REX-6:8 certifies and freezes; REX-6:9 publishes. Platform ≠ new behavior." as const;

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-Executive-Experience" as const,
    platformAuthority: "REX-6:7" as const,
    architecturalRole:
      "RuntimeExecutiveWorkspaceExperiencePlatform" as const,
    consumerRole: "PlatformInternal" as const,
    soleImmediateDependency:
      "REX-6:6/RuntimeExecutiveWorkspaceExperienceOrchestration" as const,
    consumesOrchestrationOnly: true as const,
    importsRex65Directly: false as const,
    importsRex64Directly: false as const,
    importsRex63Directly: false as const,
    importsRex62Directly: false as const,
    importsRex61Directly: false as const,
    importsRex5Directly: false as const,
    importsRex4Directly: false as const,
    importsRex3Directly: false as const,
    importsRex2Directly: false as const,
    importsRex1Directly: false as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    introducesNewWorkspaceSemantics: false as const,
    introducesNewResolutionPolicy: false as const,
    introducesNewCompositionPolicy: false as const,
    introducesNewTransitionPolicy: false as const,
    duplicatesOrchestrationPolicy: false as const,
    dialGeometryIndependent: true as const,
    cockpitLayoutIndependent: true as const,
    automotiveStylingIndependent: true as const,
    animationTimingIndependent: true as const,
    introducesUi: false as const,
    introducesRendering: false as const,
    introducesTimers: false as const,
    introducesBusinessExecution: false as const,
    introducesPersistence: false as const,
    introducesExternalIntegration: false as const,
    isFinalPublicConsumerIndex: false as const,
    isCertified: false as const,
    isFrozen: false as const,
    isReleased: false as const,
    readyForCertification: true as const,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES =
  Object.freeze([
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
  ] as const);

export type RuntimeExecutiveWorkspaceExperiencePlatformCapability =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES =
  Object.freeze([
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
  ] as const);

export type RuntimeExecutiveWorkspaceExperiencePlatformGuarantee =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_SECTIONS =
  Object.freeze([
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
  ] as const);

export type RuntimeExecutiveWorkspaceExperiencePlatformSection =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_SECTIONS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_VERIFICATION_STATUSES =
  Object.freeze(["valid", "invalid"] as const);

export type RuntimeExecutiveWorkspaceExperiencePlatformVerificationStatus =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_VERIFICATION_STATUSES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_VERIFICATION_DOMAINS =
  Object.freeze([
    "identity",
    "dependency",
    "capabilities",
    "approved-exports",
    "registry",
    "workspace-vocabulary",
    "surface-vocabulary",
    "resolution-exposure",
    "composition-exposure",
    "transition-exposure",
    "orchestration-exposure",
    "dial-semantic-boundary",
    "platform-guarantees",
  ] as const);

export type RuntimeExecutiveWorkspaceExperiencePlatformVerificationDomain =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_VERIFICATION_DOMAINS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "sole-dependency-rex-6-6",
      order: 1,
      statement: "REX-6:6 is the sole immediate dependency.",
    }),
    Object.freeze({
      id: "no-new-workspace-behavior",
      order: 2,
      statement: "REX-6:7 introduces no new workspace behavior.",
    }),
    Object.freeze({
      id: "workspace-set-unchanged",
      order: 3,
      statement: "Canonical workspace set is unchanged.",
    }),
    Object.freeze({
      id: "surface-set-unchanged",
      order: 4,
      statement: "Canonical surface set is unchanged.",
    }),
    Object.freeze({
      id: "participation-vocabulary-unchanged",
      order: 5,
      statement: "Canonical participation vocabulary is unchanged.",
    }),
    Object.freeze({
      id: "transition-phases-unchanged",
      order: 6,
      statement: "Canonical transition phases are unchanged.",
    }),
    Object.freeze({
      id: "orchestration-statuses-unchanged",
      order: 7,
      statement: "Approved orchestration statuses are unchanged.",
    }),
    Object.freeze({
      id: "capability-names-unique",
      order: 8,
      statement: "Platform capability names are unique.",
    }),
    Object.freeze({
      id: "approved-export-names-unique",
      order: 9,
      statement: "Approved export names are unique.",
    }),
    Object.freeze({
      id: "guarantee-names-unique",
      order: 10,
      statement: "Platform guarantee names are unique.",
    }),
    Object.freeze({
      id: "registry-sections-unique",
      order: 11,
      statement: "Registry sections are unique.",
    }),
    Object.freeze({
      id: "registry-ordering-deterministic",
      order: 12,
      statement: "Registry ordering is deterministic.",
    }),
    Object.freeze({
      id: "derived-counts-correct",
      order: 13,
      statement: "All derived counts are correct.",
    }),
    Object.freeze({
      id: "approved-apis-on-surface",
      order: 14,
      statement: "Every approved API belongs to the platform surface.",
    }),
    Object.freeze({
      id: "no-implementation-helper-approved",
      order: 15,
      statement: "No implementation-only helper is accidentally approved.",
    }),
    Object.freeze({
      id: "presentation-independence-preserved",
      order: 16,
      statement: "Workspace/presentation independence is preserved.",
    }),
    Object.freeze({
      id: "non-linear-navigation-preserved",
      order: 17,
      statement: "Non-linear navigation is preserved.",
    }),
    Object.freeze({
      id: "same-workspace-context-preserved",
      order: 18,
      statement: "Same-workspace context change support is preserved.",
    }),
    Object.freeze({
      id: "stage-primary-preserved",
      order: 19,
      statement: "Stage-primary semantic policy is preserved.",
    }),
    Object.freeze({
      id: "complete-composition-preserved",
      order: 20,
      statement: "Complete surface composition is preserved.",
    }),
    Object.freeze({
      id: "dial-semantic-boundary",
      order: 21,
      statement:
        "Dial is preserved as semantic source/control boundary only.",
    }),
    Object.freeze({
      id: "dial-not-surface",
      order: 22,
      statement: "Dial is not a canonical surface.",
    }),
    Object.freeze({
      id: "dial-geometry-absent",
      order: 23,
      statement: "Dial geometry is absent.",
    }),
    Object.freeze({
      id: "cockpit-layout-absent",
      order: 24,
      statement: "Cockpit layout is absent.",
    }),
    Object.freeze({
      id: "no-react",
      order: 25,
      statement: "React dependency is absent.",
    }),
    Object.freeze({
      id: "no-three",
      order: 26,
      statement: "Three.js dependency is absent.",
    }),
    Object.freeze({
      id: "no-r3f",
      order: 27,
      statement: "R3F dependency is absent.",
    }),
    Object.freeze({
      id: "no-network",
      order: 28,
      statement: "Network behavior is absent.",
    }),
    Object.freeze({
      id: "no-persistence",
      order: 29,
      statement: "Persistence behavior is absent.",
    }),
    Object.freeze({
      id: "no-business-execution",
      order: 30,
      statement: "Business execution behavior is absent.",
    }),
    Object.freeze({
      id: "platform-metadata-immutable",
      order: 31,
      statement: "Platform metadata is immutable.",
    }),
    Object.freeze({
      id: "verification-deterministic",
      order: 32,
      statement: "Verification is deterministic.",
    }),
    Object.freeze({
      id: "serialization-friendly",
      order: 33,
      statement: "Platform output is serialization-friendly.",
    }),
    Object.freeze({
      id: "ready-for-certification-not-certified",
      order: 34,
      statement: "Platform is ready for certification, not yet certified.",
    }),
    Object.freeze({
      id: "rex-6-8-not-implemented",
      order: 35,
      statement: "REX-6:8 has not been implemented.",
    }),
  ]);

export type RuntimeExecutiveWorkspaceExperiencePlatformInvariant =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_INVARIANTS)[number];

// ─── Approved export registries ─────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PUBLIC_TYPES =
  Object.freeze([
    "RuntimeExecutiveWorkspaceKind",
    "RuntimeExecutiveWorkspaceSubjectContract",
    "RuntimeExecutiveWorkspaceIntent",
    "RuntimeExecutiveWorkspaceFocusContract",
    "RuntimeExecutiveWorkspacePresentationState",
    "RuntimeExecutiveWorkspaceSurfaceRole",
    "RuntimeExecutiveWorkspaceSurfaceParticipation",
    "RuntimeExecutiveWorkspaceContextContract",
    "RuntimeExecutiveWorkspaceContextResolutionResult",
    "RuntimeExecutiveWorkspaceSurfaceCompositionResult",
    "RuntimeExecutiveWorkspaceTransitionReason",
    "RuntimeExecutiveWorkspaceTransitionSource",
    "RuntimeExecutiveWorkspaceTransitionPlan",
    "RuntimeExecutiveWorkspaceTransitionOrchestrationResult",
    "RuntimeExecutiveWorkspaceDialRequest",
    "RuntimeExecutiveWorkspaceExperienceRequest",
    "RuntimeExecutiveWorkspaceExperienceSnapshot",
    "RuntimeExecutiveWorkspaceExperienceOrchestrationInput",
    "RuntimeExecutiveWorkspaceExperienceOrchestrationResult",
    "RuntimeExecutiveWorkspaceExperiencePlatformCapability",
    "RuntimeExecutiveWorkspaceExperiencePlatformGuarantee",
    "RuntimeExecutiveWorkspaceExperiencePlatform",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_FUNCTIONAL_APIS =
  Object.freeze([
    "resolveRuntimeExecutiveWorkspaceContext",
    "resolveRuntimeExecutiveWorkspaceMode",
    "resolveRuntimeExecutiveWorkspaceSubject",
    "resolveRuntimeExecutiveWorkspaceIntent",
    "resolveRuntimeExecutiveWorkspaceFocus",
    "resolveRuntimeExecutiveWorkspaceActivation",
    "resolveRuntimeExecutiveWorkspacePresentation",
    "resolveRuntimeExecutiveWorkspaceSurfaceComposition",
    "resolveRuntimeExecutiveWorkspaceSurfaceParticipation",
    "composeRuntimeExecutiveWorkspaceSurfacesFromResolution",
    "planRuntimeExecutiveWorkspaceTransition",
    "orchestrateRuntimeExecutiveWorkspaceTransition",
    "resolveRuntimeExecutiveWorkspaceSurfaceTransition",
    "normalizeRuntimeExecutiveWorkspaceDialRequest",
    "resolveRuntimeExecutiveWorkspaceDialSelection",
    "orchestrateRuntimeExecutiveWorkspaceExperience",
    "orchestrateRuntimeExecutiveWorkspaceExperienceFromDialRequest",
    "deriveRuntimeExecutiveWorkspaceExperienceSnapshot",
    "createRuntimeExecutiveWorkspaceExperienceSnapshot",
    "createRuntimeExecutiveWorkspaceContextContract",
    "hasRuntimeExecutiveWorkspaceChanged",
    "hasRuntimeExecutiveWorkspaceContextChanged",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_VALIDATION_APIS =
  Object.freeze([
    "isRuntimeExecutiveWorkspaceKind",
    "isRuntimeExecutiveWorkspaceSurfaceRole",
    "isRuntimeExecutiveWorkspaceSurfaceParticipation",
    "isRuntimeExecutiveWorkspacePresentationState",
    "isRuntimeExecutiveWorkspaceContextContract",
    "isRuntimeExecutiveWorkspaceSurfaceCompositionResult",
    "isRuntimeExecutiveWorkspaceTransitionSource",
    "isRuntimeExecutiveWorkspaceTransitionReason",
    "isRuntimeExecutiveWorkspaceTransitionPhase",
    "isRuntimeExecutiveWorkspaceTransitionStatus",
    "isRuntimeExecutiveWorkspaceDialRequest",
    "isRuntimeExecutiveWorkspaceExperienceRequest",
    "isRuntimeExecutiveWorkspaceExperienceSnapshot",
    "isRuntimeExecutiveWorkspaceExperienceOrchestrationStatus",
    "isRuntimeExecutiveWorkspaceExperienceOrchestrationResult",
    "isRuntimeExecutiveWorkspaceExperiencePlatformCapability",
    "isRuntimeExecutiveWorkspaceExperienceApprovedExport",
    "verifyRuntimeExecutiveWorkspaceExperienceOrchestration",
    "verifyRuntimeExecutiveWorkspaceExperiencePlatformRegistry",
    "verifyRuntimeExecutiveWorkspaceExperiencePlatform",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PLATFORM_APIS =
  Object.freeze([
    "getRuntimeExecutiveWorkspaceExperiencePlatformIdentity",
    "getRuntimeExecutiveWorkspaceExperiencePlatformRegistry",
    "getRuntimeExecutiveWorkspaceExperiencePlatformCapabilities",
    "getRuntimeExecutiveWorkspaceExperiencePlatformGuarantees",
    "getRuntimeExecutiveWorkspaceExperiencePlatformSummary",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS =
  Object.freeze([
    ...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PUBLIC_TYPES,
    ...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_FUNCTIONAL_APIS,
    ...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_VALIDATION_APIS,
    ...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PLATFORM_APIS,
    "RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS",
    "RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES",
    "RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS",
    "RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES",
    "RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES",
    "RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS",
    "RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES",
    "RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES",
    "RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES",
    "RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS",
    "runtimeExecutiveWorkspaceExperiencePlatform",
  ] as const);

export type RuntimeExecutiveWorkspaceExperienceApprovedExport =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS)[number];

// ─── Section metadata ───────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_RESOLUTION_SECTION =
  Object.freeze({
    supportsWorkspaceResolution: true as const,
    supportsSubjectResolution: true as const,
    supportsIntentResolution: true as const,
    supportsFocusResolution: true as const,
    supportsActivationResolution: true as const,
    supportsWorkspaceChangeDetection: true as const,
    supportsContextChangeDetection: true as const,
    supportsOverviewFallback: true as const,
    supportsNonLinearWorkspaceMovement: true as const,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_COMPOSITION_SECTION =
  Object.freeze({
    surfaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
    participations: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
    workspaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
    primarySurface: "stage" as const,
    completeCompositionRequired: true as const,
    dialIsNotSurface: true as const,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_TRANSITION_SECTION =
  Object.freeze({
    phases: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES,
    sources: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES,
    supportsTransitionPlanning: true as const,
    supportsSurfaceTransitionInstructions: true as const,
    supportsSubjectTransition: true as const,
    supportsFocusTransition: true as const,
    supportsPresentationPreservation: true as const,
    supportsNonLinearTransitions: true as const,
    supportsDialSemanticRequests: true as const,
    dialGeometryIndependent: true as const,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_ORCHESTRATION_SECTION =
  Object.freeze({
    statuses: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES,
    supportsBootstrap: true as const,
    supportsWorkspaceChange: true as const,
    supportsSameWorkspaceContextChange: true as const,
    supportsUnchanged: true as const,
    supportsRejectedRequest: true as const,
    supportsSnapshotDerivation: true as const,
    supportsCompletePipeline: true as const,
  });

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

function check(
  id: string,
  domain: RuntimeExecutiveWorkspaceExperiencePlatformVerificationDomain,
  passed: boolean,
  reason: string,
): RuntimeExecutiveWorkspaceExperiencePlatformCheck {
  return Object.freeze({ id, domain, passed, reason });
}

const PLATFORM_FUNCTIONAL_API_MAP = Object.freeze({
  resolveRuntimeExecutiveWorkspaceContext,
  resolveRuntimeExecutiveWorkspaceMode,
  resolveRuntimeExecutiveWorkspaceSubject,
  resolveRuntimeExecutiveWorkspaceIntent,
  resolveRuntimeExecutiveWorkspaceFocus,
  resolveRuntimeExecutiveWorkspaceActivation,
  resolveRuntimeExecutiveWorkspacePresentation,
  resolveRuntimeExecutiveWorkspaceSurfaceComposition,
  resolveRuntimeExecutiveWorkspaceSurfaceParticipation,
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  planRuntimeExecutiveWorkspaceTransition,
  orchestrateRuntimeExecutiveWorkspaceTransition,
  resolveRuntimeExecutiveWorkspaceSurfaceTransition,
  normalizeRuntimeExecutiveWorkspaceDialRequest,
  resolveRuntimeExecutiveWorkspaceDialSelection,
  orchestrateRuntimeExecutiveWorkspaceExperience,
  orchestrateRuntimeExecutiveWorkspaceExperienceFromDialRequest,
  deriveRuntimeExecutiveWorkspaceExperienceSnapshot,
  createRuntimeExecutiveWorkspaceExperienceSnapshot,
  createRuntimeExecutiveWorkspaceContextContract,
  hasRuntimeExecutiveWorkspaceChanged,
  hasRuntimeExecutiveWorkspaceContextChanged,
} as const);

// ─── Validation ─────────────────────────────────────────────────────────────

export function isRuntimeExecutiveWorkspaceExperiencePlatformCapability(
  value: unknown,
): value is RuntimeExecutiveWorkspaceExperiencePlatformCapability {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceExperienceApprovedExport(
  value: unknown,
): value is RuntimeExecutiveWorkspaceExperienceApprovedExport {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveWorkspaceExperiencePlatformGuarantee(
  value: unknown,
): value is RuntimeExecutiveWorkspaceExperiencePlatformGuarantee {
  return (
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES as readonly unknown[]
  ).includes(value);
}

// ─── Registry / summary ─────────────────────────────────────────────────────

export const runtimeExecutiveWorkspaceExperiencePlatformRegistry =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperiencePlatformIdentity,
    version: runtimeExecutiveWorkspaceExperiencePlatformVersion,
    namespace: runtimeExecutiveWorkspaceExperiencePlatformNamespace,
    phase: runtimeExecutiveWorkspaceExperiencePlatformPhase,
    architecturalRole:
      runtimeExecutiveWorkspaceExperiencePlatformArchitecturalRole,
    consumerRole: runtimeExecutiveWorkspaceExperiencePlatformConsumerRole,
    status: runtimeExecutiveWorkspaceExperiencePlatformStatus,
    readiness: runtimeExecutiveWorkspaceExperiencePlatformStability,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperiencePlatformDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceExperiencePlatformDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperiencePlatformSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_SECTIONS,
    sectionCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_SECTIONS.length,
    capabilities: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES,
    capabilityCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES.length,
    guarantees: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES,
    guaranteeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES.length,
    approvedExports: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS,
    approvedExportCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS.length,
    publicTypes: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PUBLIC_TYPES,
    publicTypeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PUBLIC_TYPES.length,
    functionalApis:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_FUNCTIONAL_APIS,
    functionalApiCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_FUNCTIONAL_APIS.length,
    validationApis:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_VALIDATION_APIS,
    validationApiCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_VALIDATION_APIS.length,
    platformApis: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PLATFORM_APIS,
    platformApiCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PLATFORM_APIS.length,
    workspaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
    workspaceCount: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS.length,
    surfaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
    surfaceCount: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES.length,
    participations: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
    participationCount:
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS.length,
    transitionPhases: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES,
    transitionPhaseCount: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES.length,
    transitionSources: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES,
    transitionSourceCount:
      RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES.length,
    dialOptions: RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS,
    dialOptionCount: RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS.length,
    orchestrationStatuses:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES,
    orchestrationStatusCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES.length,
    resolution: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_RESOLUTION_SECTION,
    composition:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_COMPOSITION_SECTION,
    transition: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_TRANSITION_SECTION,
    orchestration:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_ORCHESTRATION_SECTION,
    invariants: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_INVARIANTS,
    invariantCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_INVARIANTS.length,
    verificationDomains:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_VERIFICATION_DOMAINS,
    verificationDomainCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_VERIFICATION_DOMAINS.length,
  });

export interface RuntimeExecutiveWorkspaceExperiencePlatform {
  readonly identity: typeof runtimeExecutiveWorkspaceExperiencePlatformIdentity;
  readonly version: typeof runtimeExecutiveWorkspaceExperiencePlatformVersion;
  readonly namespace: typeof runtimeExecutiveWorkspaceExperiencePlatformNamespace;
  readonly phase: typeof runtimeExecutiveWorkspaceExperiencePlatformPhase;
  readonly architecturalRole: typeof runtimeExecutiveWorkspaceExperiencePlatformArchitecturalRole;
  readonly consumerRole: typeof runtimeExecutiveWorkspaceExperiencePlatformConsumerRole;
  readonly status: typeof runtimeExecutiveWorkspaceExperiencePlatformStatus;
  readonly readiness: typeof runtimeExecutiveWorkspaceExperiencePlatformStability;
  readonly capabilities: typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES;
  readonly guarantees: typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES;
  readonly registry: typeof runtimeExecutiveWorkspaceExperiencePlatformRegistry;
  readonly workspaces: typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS;
  readonly surfaces: typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES;
  readonly participations: typeof RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS;
  readonly transitionPhases: typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES;
  readonly transitionSources: typeof RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES;
  readonly orchestrationStatuses: typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES;
  readonly primarySurface: "stage";
  readonly dialIsNotSurface: true;
  readonly isCertified: false;
  readonly isFrozen: false;
  readonly readyForCertification: true;
}

export const runtimeExecutiveWorkspaceExperiencePlatform =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperiencePlatformIdentity,
    version: runtimeExecutiveWorkspaceExperiencePlatformVersion,
    namespace: runtimeExecutiveWorkspaceExperiencePlatformNamespace,
    phase: runtimeExecutiveWorkspaceExperiencePlatformPhase,
    architecturalRole:
      runtimeExecutiveWorkspaceExperiencePlatformArchitecturalRole,
    consumerRole: runtimeExecutiveWorkspaceExperiencePlatformConsumerRole,
    status: runtimeExecutiveWorkspaceExperiencePlatformStatus,
    readiness: runtimeExecutiveWorkspaceExperiencePlatformStability,
    upstreamDependency:
      runtimeExecutiveWorkspaceExperiencePlatformDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceExperiencePlatformDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperiencePlatformSupportedImportPath,
    principle: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PRINCIPLE,
    boundary: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_BOUNDARY,
    capabilities: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES,
    guarantees: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES,
    registry: runtimeExecutiveWorkspaceExperiencePlatformRegistry,
    workspaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
    surfaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
    participations: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
    transitionPhases: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES,
    transitionSources: RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES,
    orchestrationStatuses:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES,
    dialOptions: RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS,
    primarySurface: "stage" as const,
    dialIsNotSurface: true as const,
    dialGeometryIndependent: true as const,
    cockpitLayoutIndependent: true as const,
    automotiveStylingIndependent: true as const,
    isCertified: false as const,
    isFrozen: false as const,
    isReleased: false as const,
    readyForCertification: true as const,
    invariants: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_INVARIANTS,
    approvedExports: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS,
    functionalApis:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_FUNCTIONAL_APIS,
    validationApis:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_VALIDATION_APIS,
    architecturalStatus:
      "REX-6:7 Runtime Executive Workspace Experience Platform — Assembled / ReadyForCertification" as const,
  }) satisfies RuntimeExecutiveWorkspaceExperiencePlatform &
    Record<string, unknown>;

export function getRuntimeExecutiveWorkspaceExperiencePlatformIdentity():
  typeof runtimeExecutiveWorkspaceExperiencePlatformCanonicalIdentity {
  return runtimeExecutiveWorkspaceExperiencePlatformCanonicalIdentity;
}

export function getRuntimeExecutiveWorkspaceExperiencePlatformRegistry():
  typeof runtimeExecutiveWorkspaceExperiencePlatformRegistry {
  return runtimeExecutiveWorkspaceExperiencePlatformRegistry;
}

export function getRuntimeExecutiveWorkspaceExperiencePlatformCapabilities():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES {
  return RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES;
}

export function getRuntimeExecutiveWorkspaceExperiencePlatformGuarantees():
  typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES {
  return RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES;
}

export function getRuntimeExecutiveWorkspaceExperiencePlatformSummary():
  Readonly<{
    readonly identity: typeof runtimeExecutiveWorkspaceExperiencePlatformIdentity;
    readonly version: typeof runtimeExecutiveWorkspaceExperiencePlatformVersion;
    readonly namespace: typeof runtimeExecutiveWorkspaceExperiencePlatformNamespace;
    readonly phase: typeof runtimeExecutiveWorkspaceExperiencePlatformPhase;
    readonly status: typeof runtimeExecutiveWorkspaceExperiencePlatformStatus;
    readonly readiness: typeof runtimeExecutiveWorkspaceExperiencePlatformStability;
    readonly capabilityCount: number;
    readonly publicTypeCount: number;
    readonly functionalApiCount: number;
    readonly validationApiCount: number;
    readonly guaranteeCount: number;
    readonly workspaceCount: number;
    readonly surfaceCount: number;
    readonly approvedExportCount: number;
    readonly readyForCertification: true;
    readonly isCertified: false;
    readonly isFrozen: false;
  }> {
  const registry = runtimeExecutiveWorkspaceExperiencePlatformRegistry;
  return Object.freeze({
    identity: runtimeExecutiveWorkspaceExperiencePlatformIdentity,
    version: runtimeExecutiveWorkspaceExperiencePlatformVersion,
    namespace: runtimeExecutiveWorkspaceExperiencePlatformNamespace,
    phase: runtimeExecutiveWorkspaceExperiencePlatformPhase,
    status: runtimeExecutiveWorkspaceExperiencePlatformStatus,
    readiness: runtimeExecutiveWorkspaceExperiencePlatformStability,
    capabilityCount: registry.capabilityCount,
    publicTypeCount: registry.publicTypeCount,
    functionalApiCount: registry.functionalApiCount,
    validationApiCount: registry.validationApiCount,
    guaranteeCount: registry.guaranteeCount,
    workspaceCount: registry.workspaceCount,
    surfaceCount: registry.surfaceCount,
    approvedExportCount: registry.approvedExportCount,
    readyForCertification: true as const,
    isCertified: false as const,
    isFrozen: false as const,
  });
}

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveWorkspaceExperiencePlatformCheck {
  readonly id: string;
  readonly domain: RuntimeExecutiveWorkspaceExperiencePlatformVerificationDomain;
  readonly passed: boolean;
  readonly reason: string;
}

export interface RuntimeExecutiveWorkspaceExperiencePlatformVerification {
  readonly status: RuntimeExecutiveWorkspaceExperiencePlatformVerificationStatus;
  readonly valid: boolean;
  readonly checks: ReadonlyArray<RuntimeExecutiveWorkspaceExperiencePlatformCheck>;
  readonly passedChecks: ReadonlyArray<string>;
  readonly failedChecks: ReadonlyArray<string>;
  readonly passedCount: number;
  readonly failedCount: number;
  readonly capabilityCount: number;
  readonly exportCount: number;
  readonly guaranteeCount: number;
  readonly registryIntegrity: boolean;
  readonly dependencyIntegrity: boolean;
  readonly readyForCertification: boolean;
  readonly isCertified: false;
  readonly isFrozen: false;
  readonly upstreamOrchestrationOk: boolean;
}

export function verifyRuntimeExecutiveWorkspaceExperiencePlatformRegistry(
  registry: typeof runtimeExecutiveWorkspaceExperiencePlatformRegistry = runtimeExecutiveWorkspaceExperiencePlatformRegistry,
): RuntimeExecutiveWorkspaceExperiencePlatformVerification {
  const checks: RuntimeExecutiveWorkspaceExperiencePlatformCheck[] = [];

  checks.push(
    check(
      "sections-unique",
      "registry",
      unique([...registry.sections]),
      "registry section names are unique",
    ),
  );
  checks.push(
    check(
      "sections-order",
      "registry",
      exactOrder([...registry.sections], [
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
      ]),
      "registry section order is canonical",
    ),
  );
  checks.push(
    check(
      "capabilities-unique",
      "capabilities",
      unique([...registry.capabilities]),
      "capability names are unique",
    ),
  );
  checks.push(
    check(
      "exports-unique",
      "approved-exports",
      unique([...registry.approvedExports]),
      "approved export names are unique",
    ),
  );
  checks.push(
    check(
      "guarantees-unique",
      "platform-guarantees",
      unique([...registry.guarantees]),
      "guarantee names are unique",
    ),
  );
  checks.push(
    check(
      "counts-derived",
      "registry",
      registry.sectionCount === registry.sections.length &&
        registry.capabilityCount === registry.capabilities.length &&
        registry.guaranteeCount === registry.guarantees.length &&
        registry.approvedExportCount === registry.approvedExports.length &&
        registry.workspaceCount === registry.workspaces.length &&
        registry.surfaceCount === registry.surfaces.length &&
        registry.participationCount === registry.participations.length &&
        registry.transitionPhaseCount === registry.transitionPhases.length &&
        registry.transitionSourceCount === registry.transitionSources.length &&
        registry.orchestrationStatusCount ===
          registry.orchestrationStatuses.length,
      "derived counts match collection lengths",
    ),
  );
  checks.push(
    check(
      "identity-fields",
      "identity",
      registry.identity ===
        "REX-6:7/RuntimeExecutiveWorkspaceExperiencePlatform" &&
        registry.version === "6.7.0" &&
        registry.namespace === "nexora.rex.workspace-experience.platform" &&
        registry.phase === "Platform" &&
        registry.architecturalRole ===
          "RuntimeExecutiveWorkspaceExperiencePlatform",
      "required platform identity fields exist",
    ),
  );
  checks.push(
    check(
      "workspace-vocabulary",
      "workspace-vocabulary",
      exactOrder([...registry.workspaces], [
        "overview",
        "problem",
        "scenario",
        "decision",
        "execution",
      ]),
      "canonical workspace kinds only",
    ),
  );
  checks.push(
    check(
      "surface-vocabulary",
      "surface-vocabulary",
      exactOrder([...registry.surfaces], [
        "stage",
        "advisor",
        "insight",
        "action",
      ]) &&
        !(registry.surfaces as readonly string[]).includes("dial") &&
        !(registry.surfaces as readonly string[]).includes("timeline"),
      "canonical surfaces only; dial/timeline absent",
    ),
  );

  const failedChecks = checks.filter((entry) => !entry.passed).map((e) => e.id);
  const passedChecks = checks.filter((entry) => entry.passed).map((e) => e.id);
  const valid = failedChecks.length === 0;

  return Object.freeze({
    status: valid ? "valid" : "invalid",
    valid,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    passedCount: passedChecks.length,
    failedCount: failedChecks.length,
    capabilityCount: registry.capabilityCount,
    exportCount: registry.approvedExportCount,
    guaranteeCount: registry.guaranteeCount,
    registryIntegrity: valid,
    dependencyIntegrity:
      registry.dependencyIdentity ===
      "REX-6:6/RuntimeExecutiveWorkspaceExperienceOrchestration",
    readyForCertification: valid,
    isCertified: false,
    isFrozen: false,
    upstreamOrchestrationOk: true,
  });
}

export function verifyRuntimeExecutiveWorkspaceExperiencePlatform():
  RuntimeExecutiveWorkspaceExperiencePlatformVerification {
  const upstream = verifyRuntimeExecutiveWorkspaceExperienceOrchestration();
  const checks: RuntimeExecutiveWorkspaceExperiencePlatformCheck[] = [];

  checks.push(
    check(
      "identity",
      "identity",
      runtimeExecutiveWorkspaceExperiencePlatform.identity ===
        "REX-6:7/RuntimeExecutiveWorkspaceExperiencePlatform" &&
        runtimeExecutiveWorkspaceExperiencePlatform.version === "6.7.0" &&
        runtimeExecutiveWorkspaceExperiencePlatform.namespace ===
          "nexora.rex.workspace-experience.platform" &&
        runtimeExecutiveWorkspaceExperiencePlatform.phase === "Platform",
      "exact REX-6:7 identity",
    ),
  );
  checks.push(
    check(
      "dependency",
      "dependency",
      runtimeExecutiveWorkspaceExperiencePlatform.upstreamDependency ===
        "REX-6:6/RuntimeExecutiveWorkspaceExperienceOrchestration" &&
        upstream.ok,
      "sole immediate dependency is REX-6:6",
    ),
  );
  checks.push(
    check(
      "capabilities",
      "capabilities",
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES.length ===
        10 &&
        unique([
          ...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES,
        ]),
      "ten unique platform capabilities",
    ),
  );
  checks.push(
    check(
      "approved-exports",
      "approved-exports",
      unique([
        ...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS,
      ]) &&
        RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_FUNCTIONAL_APIS.every(
          (name) =>
            typeof PLATFORM_FUNCTIONAL_API_MAP[
              name as keyof typeof PLATFORM_FUNCTIONAL_API_MAP
            ] === "function",
        ),
      "approved functional APIs exist and export names are unique",
    ),
  );

  const registryResult = verifyRuntimeExecutiveWorkspaceExperiencePlatformRegistry();
  for (const entry of registryResult.checks) {
    checks.push(entry);
  }

  checks.push(
    check(
      "resolution-exposure",
      "resolution-exposure",
      typeof resolveRuntimeExecutiveWorkspaceContext === "function" &&
        typeof resolveRuntimeExecutiveWorkspaceMode === "function" &&
        typeof resolveRuntimeExecutiveWorkspaceSubject === "function" &&
        typeof resolveRuntimeExecutiveWorkspaceIntent === "function" &&
        typeof resolveRuntimeExecutiveWorkspaceFocus === "function" &&
        typeof resolveRuntimeExecutiveWorkspaceActivation === "function",
      "resolution APIs exposed",
    ),
  );
  checks.push(
    check(
      "composition-exposure",
      "composition-exposure",
      typeof resolveRuntimeExecutiveWorkspaceSurfaceComposition ===
        "function" &&
        typeof resolveRuntimeExecutiveWorkspaceSurfaceParticipation ===
          "function" &&
        RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_COMPOSITION_SECTION
          .primarySurface === "stage",
      "composition APIs and stage-primary exposed",
    ),
  );
  checks.push(
    check(
      "transition-exposure",
      "transition-exposure",
      typeof planRuntimeExecutiveWorkspaceTransition === "function" &&
        typeof orchestrateRuntimeExecutiveWorkspaceTransition ===
          "function" &&
        exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES], [
          "prepare",
          "leave",
          "enter",
          "settle",
        ]),
      "transition APIs and phases exposed",
    ),
  );
  checks.push(
    check(
      "orchestration-exposure",
      "orchestration-exposure",
      typeof orchestrateRuntimeExecutiveWorkspaceExperience === "function" &&
        typeof deriveRuntimeExecutiveWorkspaceExperienceSnapshot ===
          "function" &&
        exactOrder(
          [...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_ORCHESTRATION_STATUSES],
          ["resolved", "unchanged", "rejected"],
        ),
      "orchestration APIs and statuses exposed",
    ),
  );
  checks.push(
    check(
      "dial-semantic-boundary",
      "dial-semantic-boundary",
      typeof normalizeRuntimeExecutiveWorkspaceDialRequest === "function" &&
        typeof resolveRuntimeExecutiveWorkspaceDialSelection === "function" &&
        (RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES as readonly string[]).includes(
          "dial",
        ) &&
        !(
          RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES as readonly string[]
        ).includes("dial") &&
        runtimeExecutiveWorkspaceExperiencePlatform.dialGeometryIndependent,
      "Dial is semantic source only; not a surface; no geometry",
    ),
  );
  checks.push(
    check(
      "platform-guarantees",
      "platform-guarantees",
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES.length ===
        15 &&
        unique([
          ...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES,
        ]) &&
        runtimeExecutiveWorkspaceExperiencePlatform.readyForCertification &&
        !runtimeExecutiveWorkspaceExperiencePlatform.isCertified &&
        !runtimeExecutiveWorkspaceExperiencePlatform.isFrozen,
      "guarantees unique; ready for certification but not certified/frozen",
    ),
  );
  checks.push(
    check(
      "immutability",
      "registry",
      Object.isFrozen(runtimeExecutiveWorkspaceExperiencePlatform) &&
        Object.isFrozen(
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES,
        ) &&
        Object.isFrozen(
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS,
        ) &&
        Object.isFrozen(
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES,
        ) &&
        Object.isFrozen(
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_SECTIONS,
        ),
      "canonical platform collections are frozen",
    ),
  );

  const failedChecks = checks.filter((entry) => !entry.passed).map((e) => e.id);
  const passedChecks = checks.filter((entry) => entry.passed).map((e) => e.id);
  const valid = failedChecks.length === 0 && upstream.ok;

  return Object.freeze({
    status: valid ? "valid" : "invalid",
    valid,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    passedCount: passedChecks.length,
    failedCount: failedChecks.length,
    capabilityCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_CAPABILITIES.length,
    exportCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS.length,
    guaranteeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_GUARANTEES.length,
    registryIntegrity: registryResult.registryIntegrity,
    dependencyIntegrity:
      runtimeExecutiveWorkspaceExperiencePlatform.upstreamDependency ===
      "REX-6:6/RuntimeExecutiveWorkspaceExperienceOrchestration",
    readyForCertification: valid,
    isCertified: false,
    isFrozen: false,
    upstreamOrchestrationOk: upstream.ok,
  });
}
