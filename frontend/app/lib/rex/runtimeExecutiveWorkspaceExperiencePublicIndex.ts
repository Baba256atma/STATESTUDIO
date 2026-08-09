/**
 * REX-6:9 — Runtime Executive Workspace Experience Public Index.
 *
 * Sole supported consumer entry point for the certified, frozen REX-6
 * Runtime Executive Workspace Experience.
 *
 * Canonical flow:
 *   … → REX-6:8 Certification & Freeze → REX-6:9 Public Index
 *
 * Publication only. No new workspace, composition, transition, Dial, or
 * orchestration behavior.
 *
 * Consumers know REX-6:9.
 * REX-6:9 knows REX-6:8.
 * REX-6:8 protects the certified platform.
 *
 * Supported import:
 *   @/app/lib/rex/runtimeExecutiveWorkspaceExperiencePublicIndex
 *
 * REX defines executive experience semantics.
 * Cockpit defines physical experience.
 * Renderer defines visuals.
 *
 * REX-6 freezes the meaning of Workspace Dial.
 * Future Cockpit freezes the appearance of Workspace Dial.
 */

import {
  REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED,
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
  certifyRuntimeExecutiveWorkspaceExperience,
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  createRuntimeExecutiveWorkspaceContextContract,
  createRuntimeExecutiveWorkspaceExperienceSnapshot,
  deriveRuntimeExecutiveWorkspaceExperienceSnapshot,
  getRuntimeExecutiveWorkspaceExperienceCertificationFreezeIdentity,
  getRuntimeExecutiveWorkspaceExperienceCertificationFreezeRegistry,
  getRuntimeExecutiveWorkspaceExperienceCertificationSummary,
  getRuntimeExecutiveWorkspaceExperienceFreezeManifest,
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
  runtimeExecutiveWorkspaceExperienceCertificationFreeze,
  runtimeExecutiveWorkspaceExperienceCertificationFreezeIdentity,
  runtimeExecutiveWorkspaceExperienceCertificationFreezeSupportedImportPath,
  runtimeExecutiveWorkspaceExperienceCertificationFreezeVersion,
  runtimeExecutiveWorkspaceExperienceFreezeManifest,
  verifyRuntimeExecutiveWorkspaceExperienceCertificationFreeze,
  verifyRuntimeExecutiveWorkspaceExperienceCompatibility,
  verifyRuntimeExecutiveWorkspaceExperienceOrchestration,
  verifyRuntimeExecutiveWorkspaceExperiencePlatform,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceCertificationFreeze";

// ─── Exact REX-6:8-approved publication (direct re-export) ──────────────────

export {
  REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED,
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
  certifyRuntimeExecutiveWorkspaceExperience,
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  createRuntimeExecutiveWorkspaceContextContract,
  createRuntimeExecutiveWorkspaceExperienceSnapshot,
  deriveRuntimeExecutiveWorkspaceExperienceSnapshot,
  getRuntimeExecutiveWorkspaceExperienceCertificationFreezeIdentity,
  getRuntimeExecutiveWorkspaceExperienceCertificationFreezeRegistry,
  getRuntimeExecutiveWorkspaceExperienceCertificationSummary,
  getRuntimeExecutiveWorkspaceExperienceFreezeManifest,
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
  runtimeExecutiveWorkspaceExperienceFreezeManifest,
  verifyRuntimeExecutiveWorkspaceExperienceCertificationFreeze,
  verifyRuntimeExecutiveWorkspaceExperienceCompatibility,
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
  RuntimeExecutiveWorkspaceExperienceCertificationCheck,
  RuntimeExecutiveWorkspaceExperienceCertificationResult,
  RuntimeExecutiveWorkspaceExperienceCertificationStatus,
  RuntimeExecutiveWorkspaceExperienceCompatibilityStatus,
  RuntimeExecutiveWorkspaceExperienceFreezeStatus,
  RuntimeExecutiveWorkspaceExperienceLockStatus,
  RuntimeExecutiveWorkspaceExperienceFreezeManifest,
  RuntimeExecutiveWorkspaceExperiencePublicIndexReadiness,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceCertificationFreeze";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveWorkspaceExperiencePublicIndexIdentity =
  "REX-6:9/RuntimeExecutiveWorkspaceExperiencePublicIndex" as const;

export const runtimeExecutiveWorkspaceExperiencePublicIndexVersion =
  "6.9.0" as const;

export const runtimeExecutiveWorkspaceExperiencePublicIndexNamespace =
  "nexora.rex.workspace-experience.public-index" as const;

export const runtimeExecutiveWorkspaceExperiencePublicIndexLayer =
  "REX" as const;

export const runtimeExecutiveWorkspaceExperiencePublicIndexCapability =
  "RuntimeExecutiveWorkspaceExperience" as const;

export const runtimeExecutiveWorkspaceExperiencePublicIndexPhase =
  "PublicIndex" as const;

export const runtimeExecutiveWorkspaceExperiencePublicIndexArchitecturalRole =
  "RuntimeExecutiveWorkspaceExperiencePublicIndex" as const;

export const runtimeExecutiveWorkspaceExperiencePublicIndexConsumerRole =
  "SoleConsumerEntryPoint" as const;

export const runtimeExecutiveWorkspaceExperiencePublicIndexDependencyIdentity =
  runtimeExecutiveWorkspaceExperienceCertificationFreezeIdentity;

export const runtimeExecutiveWorkspaceExperiencePublicIndexDependencyPath =
  runtimeExecutiveWorkspaceExperienceCertificationFreezeSupportedImportPath;

export const runtimeExecutiveWorkspaceExperiencePublicIndexSupportedImportPath =
  "@/app/lib/rex/runtimeExecutiveWorkspaceExperiencePublicIndex" as const;

export const runtimeExecutiveWorkspaceExperiencePublicIndexStatus =
  "Released" as const;

export const runtimeExecutiveWorkspaceExperiencePublicIndexStability =
  "Stable" as const;

export const runtimeExecutiveWorkspaceExperiencePublicIndexDeterministic =
  true as const;

export const runtimeExecutiveWorkspaceExperiencePublicIndexSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveWorkspaceExperiencePublicIndexMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveWorkspaceExperiencePublicIndexCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperiencePublicIndexIdentity,
    version: runtimeExecutiveWorkspaceExperiencePublicIndexVersion,
    namespace: runtimeExecutiveWorkspaceExperiencePublicIndexNamespace,
    layer: runtimeExecutiveWorkspaceExperiencePublicIndexLayer,
    capability: runtimeExecutiveWorkspaceExperiencePublicIndexCapability,
    phase: runtimeExecutiveWorkspaceExperiencePublicIndexPhase,
    status: runtimeExecutiveWorkspaceExperiencePublicIndexStatus,
    architecturalRole:
      runtimeExecutiveWorkspaceExperiencePublicIndexArchitecturalRole,
    consumerRole: runtimeExecutiveWorkspaceExperiencePublicIndexConsumerRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperiencePublicIndexDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceExperiencePublicIndexDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperiencePublicIndexSupportedImportPath,
    upstreamVersion:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeVersion,
    stabilityStatus: runtimeExecutiveWorkspaceExperiencePublicIndexStability,
    platformLock: REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED,
    deterministicStatus:
      runtimeExecutiveWorkspaceExperiencePublicIndexDeterministic,
    sideEffectPolicy:
      runtimeExecutiveWorkspaceExperiencePublicIndexSideEffectPolicy,
    mutationPolicy:
      runtimeExecutiveWorkspaceExperiencePublicIndexMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_PRINCIPLE =
  "Frozen surface → Public publication. REX-6:9 publishes the certified REX-6:8 surface as the sole consumer entry point — no new runtime behavior." as const;

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-Executive-Experience" as const,
  publicationAuthority: "REX-6:9" as const,
  architecturalRole:
    "RuntimeExecutiveWorkspaceExperiencePublicIndex" as const,
  consumerRole: "SoleConsumerEntryPoint" as const,
  soleImmediateDependency:
    "REX-6:8/RuntimeExecutiveWorkspaceExperienceCertificationFreeze" as const,
  consumesCertificationFreezeOnly: true as const,
  importsRex67Directly: false as const,
  importsRex66Directly: false as const,
  importsRex65Directly: false as const,
  importsRex64Directly: false as const,
  importsRex63Directly: false as const,
  importsRex62Directly: false as const,
  importsRex61Directly: false as const,
  introducesRuntimeBehavior: false as const,
  introducesNewWorkspaceSemantics: false as const,
  introducesNewCompositionSemantics: false as const,
  introducesNewTransitionSemantics: false as const,
  introducesNewDialSemantics: false as const,
  introducesOrchestrationPolicy: false as const,
  introducesUi: false as const,
  introducesDialGeometry: false as const,
  freezesCockpitLayout: false as const,
  freezesAutomotiveStyling: false as const,
  isSoleConsumerEntryPoint: true as const,
  isFinalRex6PublicationLayer: true as const,
  rex6Complete: true as const,
  introducesRex7: false as const,
});

// ─── Release / publication vocabularies ─────────────────────────────────────

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_SECTIONS = Object.freeze([
  "Identity",
  "PublicTypes",
  "PublicAPIs",
  "Validation",
  "Certification",
  "ReleaseInformation",
  "Compatibility",
  "Registry",
  "ConsumerInformation",
] as const);

export type RuntimeExecutiveWorkspaceExperiencePublicIndexSection =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_SECTIONS)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_CONSUMER_GUARANTEES =
  Object.freeze([
    "sole-consumer-entry-point",
    "certified",
    "compatible",
    "frozen",
    "locked",
    "stable",
    "ready-for-consumer",
    "workspace-vocabulary-canonical",
    "surface-vocabulary-canonical",
    "presentation-independence",
    "non-linear-navigation",
    "same-workspace-context-change",
    "stage-primary",
    "surface-composition-deterministic",
    "transition-planning-deterministic",
    "experience-orchestration-deterministic",
    "dial-semantic-only",
    "dial-not-workspace",
    "dial-not-surface",
    "renderer-independence",
    "cockpit-geometry-not-frozen",
    "business-action-execution-outside-rex-6",
  ] as const);

export type RuntimeExecutiveWorkspaceExperienceConsumerGuarantee =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_CONSUMER_GUARANTEES)[number];

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_RESOLUTION_APIS = Object.freeze([
  "resolveRuntimeExecutiveWorkspaceContext",
  "resolveRuntimeExecutiveWorkspaceMode",
  "resolveRuntimeExecutiveWorkspaceSubject",
  "resolveRuntimeExecutiveWorkspaceIntent",
  "resolveRuntimeExecutiveWorkspaceFocus",
  "resolveRuntimeExecutiveWorkspaceActivation",
  "resolveRuntimeExecutiveWorkspacePresentation",
  "hasRuntimeExecutiveWorkspaceChanged",
  "hasRuntimeExecutiveWorkspaceContextChanged",
] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_COMPOSITION_APIS = Object.freeze([
  "resolveRuntimeExecutiveWorkspaceSurfaceComposition",
  "resolveRuntimeExecutiveWorkspaceSurfaceParticipation",
  "composeRuntimeExecutiveWorkspaceSurfacesFromResolution",
] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_TRANSITION_APIS = Object.freeze([
  "planRuntimeExecutiveWorkspaceTransition",
  "orchestrateRuntimeExecutiveWorkspaceTransition",
  "resolveRuntimeExecutiveWorkspaceSurfaceTransition",
] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_DIAL_APIS = Object.freeze([
  "normalizeRuntimeExecutiveWorkspaceDialRequest",
  "resolveRuntimeExecutiveWorkspaceDialSelection",
] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_ORCHESTRATION_APIS =
  Object.freeze([
    "orchestrateRuntimeExecutiveWorkspaceExperience",
    "orchestrateRuntimeExecutiveWorkspaceExperienceFromDialRequest",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_SNAPSHOT_APIS = Object.freeze([
  "deriveRuntimeExecutiveWorkspaceExperienceSnapshot",
  "createRuntimeExecutiveWorkspaceExperienceSnapshot",
  "createRuntimeExecutiveWorkspaceContextContract",
] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_VALIDATION_APIS = Object.freeze([
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
  "isRuntimeExecutiveWorkspaceSurfaceTransitionKind",
] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_CERTIFICATION_APIS =
  Object.freeze([
    "certifyRuntimeExecutiveWorkspaceExperience",
    "verifyRuntimeExecutiveWorkspaceExperienceCompatibility",
    "verifyRuntimeExecutiveWorkspaceExperienceCertificationFreeze",
    "getRuntimeExecutiveWorkspaceExperienceCertificationFreezeIdentity",
    "getRuntimeExecutiveWorkspaceExperienceCertificationFreezeRegistry",
    "getRuntimeExecutiveWorkspaceExperienceFreezeManifest",
    "getRuntimeExecutiveWorkspaceExperienceCertificationSummary",
    "verifyRuntimeExecutiveWorkspaceExperiencePlatform",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_PUBLICATION_APIS =
  Object.freeze([
    "getRuntimeExecutiveWorkspaceExperiencePublicIndexIdentity",
    "getRuntimeExecutiveWorkspaceExperiencePublicIndexRegistry",
    "getRuntimeExecutiveWorkspaceExperienceConsumerInformation",
    "getRuntimeExecutiveWorkspaceExperiencePublicIndexSummary",
    "verifyRuntimeExecutiveWorkspaceExperiencePublicIndex",
  ] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_TYPE_NAMES = Object.freeze([
  ...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_PUBLIC_TYPES,
  "RuntimeExecutiveWorkspaceExperienceCertificationCheck",
  "RuntimeExecutiveWorkspaceExperienceCertificationResult",
  "RuntimeExecutiveWorkspaceExperienceCertificationStatus",
  "RuntimeExecutiveWorkspaceExperienceCompatibilityStatus",
  "RuntimeExecutiveWorkspaceExperienceFreezeStatus",
  "RuntimeExecutiveWorkspaceExperienceLockStatus",
  "RuntimeExecutiveWorkspaceExperienceFreezeManifest",
  "RuntimeExecutiveWorkspaceExperiencePublicIndexReadiness",
  "RuntimeExecutiveWorkspaceExperienceConsumerGuarantee",
  "RuntimeExecutiveWorkspaceExperienceConsumerInformation",
  "RuntimeExecutiveWorkspaceExperiencePublicIndexSection",
  "RuntimeExecutiveWorkspaceExperiencePublicIndexVerification",
] as const);

export const RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "sole-dependency-rex-6-8",
    order: 1,
    statement: "REX-6:8 is the sole immediate dependency.",
  }),
  Object.freeze({
    id: "no-new-runtime-behavior",
    order: 2,
    statement: "Public Index introduces no new runtime behavior.",
  }),
  Object.freeze({
    id: "no-new-workspace-semantics",
    order: 3,
    statement: "Public Index introduces no new workspace semantics.",
  }),
  Object.freeze({
    id: "no-new-surface-semantics",
    order: 4,
    statement: "Public Index introduces no new surface semantics.",
  }),
  Object.freeze({
    id: "no-new-transition-semantics",
    order: 5,
    statement: "Public Index introduces no new transition semantics.",
  }),
  Object.freeze({
    id: "no-new-dial-semantics",
    order: 6,
    statement: "Public Index introduces no new Dial semantics.",
  }),
  Object.freeze({
    id: "no-orchestration-policy",
    order: 7,
    statement: "Public Index introduces no orchestration policy.",
  }),
  Object.freeze({
    id: "only-frozen-exports",
    order: 8,
    statement: "Only frozen approved exports are published.",
  }),
  Object.freeze({
    id: "export-names-unique",
    order: 9,
    statement: "Approved export names are unique.",
  }),
  Object.freeze({
    id: "sections-unique",
    order: 10,
    statement: "Public Index sections are unique.",
  }),
  Object.freeze({
    id: "section-order-deterministic",
    order: 11,
    statement: "Section ordering is deterministic.",
  }),
  Object.freeze({
    id: "consumer-guarantees-unique",
    order: 12,
    statement: "Consumer guarantees are unique.",
  }),
  Object.freeze({
    id: "release-released",
    order: 13,
    statement: "Release status is Released.",
  }),
  Object.freeze({
    id: "certification-certified",
    order: 14,
    statement: "Certification status is Certified.",
  }),
  Object.freeze({
    id: "compatibility-compatible",
    order: 15,
    statement: "Compatibility status is Compatible.",
  }),
  Object.freeze({
    id: "freeze-frozen",
    order: 16,
    statement: "Freeze status is Frozen.",
  }),
  Object.freeze({
    id: "lock-locked",
    order: 17,
    statement: "Lock status is Locked.",
  }),
  Object.freeze({
    id: "stability-stable",
    order: 18,
    statement: "Stability is Stable.",
  }),
  Object.freeze({
    id: "readiness-ready-for-consumer",
    order: 19,
    statement: "Readiness is ReadyForConsumer.",
  }),
  Object.freeze({
    id: "platform-lock-exact",
    order: 20,
    statement: "Platform lock is exact.",
  }),
  Object.freeze({
    id: "supported-import-path-exact",
    order: 21,
    statement: "Supported consumer import path is exact.",
  }),
  Object.freeze({
    id: "consumer-role-sole-entry",
    order: 22,
    statement: "Consumer role is SoleConsumerEntryPoint.",
  }),
  Object.freeze({
    id: "workspace-vocabulary-unchanged",
    order: 23,
    statement: "Workspace vocabulary is unchanged.",
  }),
  Object.freeze({
    id: "surface-vocabulary-unchanged",
    order: 24,
    statement: "Canonical surface vocabulary is unchanged.",
  }),
  Object.freeze({
    id: "dial-not-workspace",
    order: 25,
    statement: "Dial is not a workspace.",
  }),
  Object.freeze({
    id: "dial-not-surface",
    order: 26,
    statement: "Dial is not a canonical surface.",
  }),
  Object.freeze({
    id: "dial-geometry-absent",
    order: 27,
    statement: "Dial geometry is absent.",
  }),
  Object.freeze({
    id: "non-linear-available",
    order: 28,
    statement: "Non-linear navigation remains available.",
  }),
  Object.freeze({
    id: "same-workspace-context-available",
    order: 29,
    statement: "Same-workspace context changes remain available.",
  }),
  Object.freeze({
    id: "presentation-independence-preserved",
    order: 30,
    statement: "Workspace/presentation independence remains preserved.",
  }),
  Object.freeze({
    id: "stage-primary-preserved",
    order: 31,
    statement: "Stage-primary semantic guarantee remains preserved.",
  }),
  Object.freeze({
    id: "no-react",
    order: 32,
    statement: "No React dependency is introduced.",
  }),
  Object.freeze({
    id: "no-three-r3f",
    order: 33,
    statement: "No Three.js/R3F dependency is introduced.",
  }),
  Object.freeze({
    id: "no-cockpit-geometry",
    order: 34,
    statement: "No cockpit geometry is frozen.",
  }),
  Object.freeze({
    id: "no-automotive-styling",
    order: 35,
    statement: "No Cadillac/Porsche styling semantics are frozen.",
  }),
  Object.freeze({
    id: "no-business-execution",
    order: 36,
    statement: "No business action execution is introduced.",
  }),
  Object.freeze({
    id: "metadata-mutation-safe",
    order: 37,
    statement: "Metadata is mutation-safe.",
  }),
  Object.freeze({
    id: "verification-deterministic",
    order: 38,
    statement: "Publication verification is deterministic.",
  }),
  Object.freeze({
    id: "final-rex-6-publication",
    order: 39,
    statement: "Public Index is the final REX-6 consumer publication layer.",
  }),
  Object.freeze({
    id: "rex-6-complete",
    order: 40,
    statement: "REX-6 is complete after successful REX-6:9.",
  }),
]);

export type RuntimeExecutiveWorkspaceExperiencePublicIndexInvariant =
  (typeof RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_INVARIANTS)[number];

// ─── Release gate (derived from REX-6:8 — not recomputed independently) ─────

function evaluateReleaseGate(): Readonly<{
  readonly releaseStatus: "Released" | "Unreleased";
  readonly certificationStatus: "Certified" | "NotCertified";
  readonly compatibilityStatus: "Compatible" | "Incompatible";
  readonly freezeStatus: "Frozen" | "Unfrozen";
  readonly lockStatus: "Locked" | "Unlocked";
  readonly stability: "Stable" | "Unstable";
  readonly readiness: "ReadyForConsumer" | "NotReadyForConsumer";
  readonly gatePassed: boolean;
}> {
  const certification = certifyRuntimeExecutiveWorkspaceExperience();
  const compatibility = verifyRuntimeExecutiveWorkspaceExperienceCompatibility();
  const freeze = verifyRuntimeExecutiveWorkspaceExperienceCertificationFreeze();
  const gatePassed =
    certification.status === "certified" &&
    certification.compatibility === "compatible" &&
    certification.freeze === "frozen" &&
    certification.lock === "locked" &&
    certification.stability === "stable" &&
    certification.readiness === "ready-for-public-index" &&
    compatibility.status === "compatible" &&
    freeze.ok &&
    freeze.platformLock ===
      REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED;

  return Object.freeze({
    releaseStatus: gatePassed ? ("Released" as const) : ("Unreleased" as const),
    certificationStatus: gatePassed
      ? ("Certified" as const)
      : ("NotCertified" as const),
    compatibilityStatus: gatePassed
      ? ("Compatible" as const)
      : ("Incompatible" as const),
    freezeStatus: gatePassed ? ("Frozen" as const) : ("Unfrozen" as const),
    lockStatus: gatePassed ? ("Locked" as const) : ("Unlocked" as const),
    stability: gatePassed ? ("Stable" as const) : ("Unstable" as const),
    readiness: gatePassed
      ? ("ReadyForConsumer" as const)
      : ("NotReadyForConsumer" as const),
    gatePassed,
  });
}

const RELEASE_GATE = evaluateReleaseGate();

export interface RuntimeExecutiveWorkspaceExperienceConsumerInformation {
  readonly consumerRole: "SoleConsumerEntryPoint";
  readonly supportedImportPath: typeof runtimeExecutiveWorkspaceExperiencePublicIndexSupportedImportPath;
  readonly upstreamFrozenDependency: typeof runtimeExecutiveWorkspaceExperienceCertificationFreezeIdentity;
  readonly releaseStatus: "Released";
  readonly certificationStatus: "Certified";
  readonly compatibilityStatus: "Compatible";
  readonly freezeStatus: "Frozen";
  readonly lockStatus: "Locked";
  readonly stability: "Stable";
  readonly readiness: "ReadyForConsumer";
  readonly platformLock: typeof REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED;
  readonly dialIsNotWorkspace: true;
  readonly dialIsNotSurface: true;
  readonly dialGeometryPublished: false;
  readonly cockpitLayoutFrozen: false;
  readonly automotiveStylingFrozen: false;
  readonly primarySurface: "stage";
  readonly uiRenderingSupport: "NotProvided";
  readonly businessExecutionSupport: "NotProvided";
}

export const runtimeExecutiveWorkspaceExperienceConsumerInformation =
  Object.freeze({
    consumerRole: "SoleConsumerEntryPoint" as const,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperiencePublicIndexSupportedImportPath,
    upstreamFrozenDependency:
      runtimeExecutiveWorkspaceExperienceCertificationFreezeIdentity,
    releaseStatus: "Released" as const,
    certificationStatus: "Certified" as const,
    compatibilityStatus: "Compatible" as const,
    freezeStatus: "Frozen" as const,
    lockStatus: "Locked" as const,
    stability: "Stable" as const,
    readiness: "ReadyForConsumer" as const,
    platformLock: REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED,
    dialIsNotWorkspace: true as const,
    dialIsNotSurface: true as const,
    dialGeometryPublished: false as const,
    cockpitLayoutFrozen: false as const,
    automotiveStylingFrozen: false as const,
    primarySurface: "stage" as const,
    uiRenderingSupport: "NotProvided" as const,
    businessExecutionSupport: "NotProvided" as const,
  }) satisfies RuntimeExecutiveWorkspaceExperienceConsumerInformation;

export const runtimeExecutiveWorkspaceExperienceReleaseInformation =
  Object.freeze({
    releaseStatus: RELEASE_GATE.releaseStatus,
    certificationStatus: RELEASE_GATE.certificationStatus,
    compatibilityStatus: RELEASE_GATE.compatibilityStatus,
    freezeStatus: RELEASE_GATE.freezeStatus,
    lockStatus: RELEASE_GATE.lockStatus,
    stability: RELEASE_GATE.stability,
    readiness: RELEASE_GATE.readiness,
    version: runtimeExecutiveWorkspaceExperiencePublicIndexVersion,
    platformLock: REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED,
    rex6Complete: true as const,
  });

export const runtimeExecutiveWorkspaceExperiencePublicIndexRegistry =
  Object.freeze({
    identity: runtimeExecutiveWorkspaceExperiencePublicIndexIdentity,
    version: runtimeExecutiveWorkspaceExperiencePublicIndexVersion,
    namespace: runtimeExecutiveWorkspaceExperiencePublicIndexNamespace,
    phase: runtimeExecutiveWorkspaceExperiencePublicIndexPhase,
    architecturalRole:
      runtimeExecutiveWorkspaceExperiencePublicIndexArchitecturalRole,
    consumerRole: runtimeExecutiveWorkspaceExperiencePublicIndexConsumerRole,
    dependencyIdentity:
      runtimeExecutiveWorkspaceExperiencePublicIndexDependencyIdentity,
    dependencyPath:
      runtimeExecutiveWorkspaceExperiencePublicIndexDependencyPath,
    supportedImportPath:
      runtimeExecutiveWorkspaceExperiencePublicIndexSupportedImportPath,
    sections: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_SECTIONS,
    sectionCount: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_SECTIONS.length,
    publicTypes: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_TYPE_NAMES,
    publicTypeCount: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_TYPE_NAMES.length,
    resolutionApis: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_RESOLUTION_APIS,
    resolutionApiCount: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_RESOLUTION_APIS.length,
    compositionApis: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_COMPOSITION_APIS,
    compositionApiCount:
      RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_COMPOSITION_APIS.length,
    transitionApis: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_TRANSITION_APIS,
    transitionApiCount: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_TRANSITION_APIS.length,
    dialApis: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_DIAL_APIS,
    dialApiCount: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_DIAL_APIS.length,
    orchestrationApis: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_ORCHESTRATION_APIS,
    orchestrationApiCount:
      RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_ORCHESTRATION_APIS.length,
    snapshotApis: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_SNAPSHOT_APIS,
    snapshotApiCount: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_SNAPSHOT_APIS.length,
    validationApis: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_VALIDATION_APIS,
    validationApiCount: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_VALIDATION_APIS.length,
    certificationApis: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_CERTIFICATION_APIS,
    certificationApiCount:
      RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_CERTIFICATION_APIS.length,
    publicationApis: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_PUBLICATION_APIS,
    publicationApiCount:
      RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_PUBLICATION_APIS.length,
    functionalApiCount:
      RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_RESOLUTION_APIS.length +
      RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_COMPOSITION_APIS.length +
      RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_TRANSITION_APIS.length +
      RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_DIAL_APIS.length +
      RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_ORCHESTRATION_APIS.length +
      RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_SNAPSHOT_APIS.length,
    approvedExports: RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS,
    approvedExportCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_APPROVED_EXPORTS.length,
    consumerGuarantees:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_CONSUMER_GUARANTEES,
    consumerGuaranteeCount:
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_CONSUMER_GUARANTEES.length,
    workspaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
    workspaceCount: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS.length,
    surfaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
    surfaceCount: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES.length,
    participations: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
    participationCount:
      RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS.length,
    platformLock: REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED,
    release: runtimeExecutiveWorkspaceExperienceReleaseInformation,
    consumerInformation:
      runtimeExecutiveWorkspaceExperienceConsumerInformation,
    freezeManifest: runtimeExecutiveWorkspaceExperienceFreezeManifest,
    invariants: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_INVARIANTS,
    invariantCount: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_INVARIANTS.length,
  });

export const runtimeExecutiveWorkspaceExperiencePublicIndex = Object.freeze({
  identity: runtimeExecutiveWorkspaceExperiencePublicIndexIdentity,
  version: runtimeExecutiveWorkspaceExperiencePublicIndexVersion,
  namespace: runtimeExecutiveWorkspaceExperiencePublicIndexNamespace,
  phase: runtimeExecutiveWorkspaceExperiencePublicIndexPhase,
  architecturalRole:
    runtimeExecutiveWorkspaceExperiencePublicIndexArchitecturalRole,
  consumerRole: runtimeExecutiveWorkspaceExperiencePublicIndexConsumerRole,
  upstreamDependency:
    runtimeExecutiveWorkspaceExperiencePublicIndexDependencyIdentity,
  dependencyPath:
    runtimeExecutiveWorkspaceExperiencePublicIndexDependencyPath,
  supportedImportPath:
    runtimeExecutiveWorkspaceExperiencePublicIndexSupportedImportPath,
  principle: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_BOUNDARY,
  status: runtimeExecutiveWorkspaceExperiencePublicIndexStatus,
  stability: runtimeExecutiveWorkspaceExperiencePublicIndexStability,
  release: runtimeExecutiveWorkspaceExperienceReleaseInformation,
  consumerInformation:
    runtimeExecutiveWorkspaceExperienceConsumerInformation,
  registry: runtimeExecutiveWorkspaceExperiencePublicIndexRegistry,
  platformLock: REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED,
  workspaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS,
  surfaces: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES,
  participations: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS,
  primarySurface: RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE,
  consumerGuarantees:
    RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_CONSUMER_GUARANTEES,
  dialIsNotWorkspace: true as const,
  dialIsNotSurface: true as const,
  dialGeometryPublished: false as const,
  cockpitLayoutFrozen: false as const,
  automotiveStylingFrozen: false as const,
  rex6Complete: true as const,
  architecturalStatus:
    "REX-6:9 Runtime Executive Workspace Experience Public Index — Released · Certified · Compatible · Frozen · Locked · Stable · ReadyForConsumer — REX-6 COMPLETE" as const,
});

// ─── Public Index APIs ──────────────────────────────────────────────────────

export function getRuntimeExecutiveWorkspaceExperiencePublicIndexIdentity():
  typeof runtimeExecutiveWorkspaceExperiencePublicIndexCanonicalIdentity {
  return runtimeExecutiveWorkspaceExperiencePublicIndexCanonicalIdentity;
}

export function getRuntimeExecutiveWorkspaceExperiencePublicIndexRegistry():
  typeof runtimeExecutiveWorkspaceExperiencePublicIndexRegistry {
  return runtimeExecutiveWorkspaceExperiencePublicIndexRegistry;
}

export function getRuntimeExecutiveWorkspaceExperienceConsumerInformation():
  typeof runtimeExecutiveWorkspaceExperienceConsumerInformation {
  return runtimeExecutiveWorkspaceExperienceConsumerInformation;
}

export function getRuntimeExecutiveWorkspaceExperiencePublicIndexSummary():
  Readonly<{
    readonly identity: typeof runtimeExecutiveWorkspaceExperiencePublicIndexIdentity;
    readonly version: typeof runtimeExecutiveWorkspaceExperiencePublicIndexVersion;
    readonly namespace: typeof runtimeExecutiveWorkspaceExperiencePublicIndexNamespace;
    readonly releaseStatus: "Released";
    readonly certificationStatus: "Certified";
    readonly compatibilityStatus: "Compatible";
    readonly freezeStatus: "Frozen";
    readonly lockStatus: "Locked";
    readonly stability: "Stable";
    readonly readiness: "ReadyForConsumer";
    readonly platformLock: typeof REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED;
    readonly approvedExportCount: number;
    readonly publicTypeCount: number;
    readonly functionalApiCount: number;
    readonly validationApiCount: number;
    readonly certificationApiCount: number;
    readonly consumerGuaranteeCount: number;
    readonly workspaceCount: number;
    readonly surfaceCount: number;
    readonly rex6Complete: true;
  }> {
  const registry = runtimeExecutiveWorkspaceExperiencePublicIndexRegistry;
  return Object.freeze({
    identity: runtimeExecutiveWorkspaceExperiencePublicIndexIdentity,
    version: runtimeExecutiveWorkspaceExperiencePublicIndexVersion,
    namespace: runtimeExecutiveWorkspaceExperiencePublicIndexNamespace,
    releaseStatus: "Released" as const,
    certificationStatus: "Certified" as const,
    compatibilityStatus: "Compatible" as const,
    freezeStatus: "Frozen" as const,
    lockStatus: "Locked" as const,
    stability: "Stable" as const,
    readiness: "ReadyForConsumer" as const,
    platformLock: REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED,
    approvedExportCount: registry.approvedExportCount,
    publicTypeCount: registry.publicTypeCount,
    functionalApiCount: registry.functionalApiCount,
    validationApiCount: registry.validationApiCount,
    certificationApiCount: registry.certificationApiCount,
    consumerGuaranteeCount: registry.consumerGuaranteeCount,
    workspaceCount: registry.workspaceCount,
    surfaceCount: registry.surfaceCount,
    rex6Complete: true as const,
  });
}

// ─── Publication verification ───────────────────────────────────────────────

export interface RuntimeExecutiveWorkspaceExperiencePublicIndexVerificationCheck {
  readonly id: string;
  readonly passed: boolean;
  readonly reason: string;
}

export interface RuntimeExecutiveWorkspaceExperiencePublicIndexVerification {
  readonly valid: boolean;
  readonly checks: ReadonlyArray<RuntimeExecutiveWorkspaceExperiencePublicIndexVerificationCheck>;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly issues: ReadonlyArray<string>;
  readonly readyForConsumer: boolean;
  readonly rex6Complete: boolean;
}

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
  passed: boolean,
  reason: string,
): RuntimeExecutiveWorkspaceExperiencePublicIndexVerificationCheck {
  return Object.freeze({ id, passed, reason });
}

const PUBLIC_FUNCTIONAL_API_MAP = Object.freeze({
  resolveRuntimeExecutiveWorkspaceContext,
  resolveRuntimeExecutiveWorkspaceMode,
  resolveRuntimeExecutiveWorkspaceSubject,
  resolveRuntimeExecutiveWorkspaceIntent,
  resolveRuntimeExecutiveWorkspaceFocus,
  resolveRuntimeExecutiveWorkspaceActivation,
  resolveRuntimeExecutiveWorkspacePresentation,
  hasRuntimeExecutiveWorkspaceChanged,
  hasRuntimeExecutiveWorkspaceContextChanged,
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
} as const);

export function verifyRuntimeExecutiveWorkspaceExperiencePublicIndex():
  RuntimeExecutiveWorkspaceExperiencePublicIndexVerification {
  const freeze = verifyRuntimeExecutiveWorkspaceExperienceCertificationFreeze();
  const certification = certifyRuntimeExecutiveWorkspaceExperience();
  const checks = [
    check(
      "identity",
      runtimeExecutiveWorkspaceExperiencePublicIndexIdentity ===
        "REX-6:9/RuntimeExecutiveWorkspaceExperiencePublicIndex" &&
        runtimeExecutiveWorkspaceExperiencePublicIndexVersion === "6.9.0" &&
        runtimeExecutiveWorkspaceExperiencePublicIndexNamespace ===
          "nexora.rex.workspace-experience.public-index" &&
        runtimeExecutiveWorkspaceExperiencePublicIndexPhase === "PublicIndex" &&
        runtimeExecutiveWorkspaceExperiencePublicIndexConsumerRole ===
          "SoleConsumerEntryPoint",
      "exact Public Index identity and consumer role",
    ),
    check(
      "dependency",
      runtimeExecutiveWorkspaceExperiencePublicIndexDependencyIdentity ===
        "REX-6:8/RuntimeExecutiveWorkspaceExperienceCertificationFreeze" &&
        RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_BOUNDARY
          .consumesCertificationFreezeOnly &&
        freeze.ok,
      "sole immediate dependency is certified REX-6:8",
    ),
    check(
      "release-states",
      RELEASE_GATE.gatePassed &&
        runtimeExecutiveWorkspaceExperiencePublicIndexStatus === "Released" &&
        runtimeExecutiveWorkspaceExperienceConsumerInformation.readiness ===
          "ReadyForConsumer" &&
        certification.status === "certified",
      "Released · Certified · Compatible · Frozen · Locked · Stable · ReadyForConsumer",
    ),
    check(
      "platform-lock",
      REX_6_RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_PLATFORM_LOCKED ===
        "REX-6-RUNTIME-EXECUTIVE-WORKSPACE-EXPERIENCE-PLATFORM-LOCKED",
      "exact platform lock published",
    ),
    check(
      "sections",
      exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_SECTIONS], [
        "Identity",
        "PublicTypes",
        "PublicAPIs",
        "Validation",
        "Certification",
        "ReleaseInformation",
        "Compatibility",
        "Registry",
        "ConsumerInformation",
      ]) && unique([...RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_SECTIONS]),
      "Public Index sections exact and unique",
    ),
    check(
      "workspaces-surfaces",
      exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_KINDS], [
        "overview",
        "problem",
        "scenario",
        "decision",
        "execution",
      ]) &&
        exactOrder([...RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES], [
          "stage",
          "advisor",
          "insight",
          "action",
        ]) &&
        !(
          RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES as readonly string[]
        ).includes("dial") &&
        RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE === "stage",
      "canonical workspaces/surfaces published; Dial not a surface",
    ),
    check(
      "approved-apis-exist",
      Object.values(PUBLIC_FUNCTIONAL_API_MAP).every(
        (value) => typeof value === "function",
      ) &&
        unique([
          ...RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_RESOLUTION_APIS,
          ...RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_COMPOSITION_APIS,
          ...RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_TRANSITION_APIS,
          ...RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_DIAL_APIS,
          ...RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_ORCHESTRATION_APIS,
          ...RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_SNAPSHOT_APIS,
        ]),
      "approved functional APIs exist and are uniquely categorized",
    ),
    check(
      "consumer-guarantees",
      RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_CONSUMER_GUARANTEES.length ===
        22 &&
        unique([
          ...RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_CONSUMER_GUARANTEES,
        ]) &&
        Object.isFrozen(
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_CONSUMER_GUARANTEES,
        ),
      "consumer guarantees unique, complete, and frozen",
    ),
    check(
      "dial-boundary",
      runtimeExecutiveWorkspaceExperienceFreezeManifest.dialIsNotWorkspace &&
        runtimeExecutiveWorkspaceExperienceFreezeManifest.dialIsNotSurface &&
        !runtimeExecutiveWorkspaceExperienceFreezeManifest.dialGeometryFrozen &&
        runtimeExecutiveWorkspaceExperienceFreezeManifest.semanticDialFrozen,
      "Dial remains semantic-only in published freeze manifest",
    ),
    check(
      "immutability",
      Object.isFrozen(runtimeExecutiveWorkspaceExperiencePublicIndex) &&
        Object.isFrozen(
          runtimeExecutiveWorkspaceExperiencePublicIndexRegistry,
        ) &&
        Object.isFrozen(
          runtimeExecutiveWorkspaceExperienceConsumerInformation,
        ) &&
        Object.isFrozen(RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_SECTIONS) &&
        Object.isFrozen(
          RUNTIME_EXECUTIVE_WORKSPACE_EXPERIENCE_CONSUMER_GUARANTEES,
        ),
      "Public Index metadata is mutation-safe",
    ),
    check(
      "no-new-behavior",
      RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_BOUNDARY
        .introducesRuntimeBehavior === false &&
        RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_BOUNDARY
          .introducesNewWorkspaceSemantics === false &&
        RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_BOUNDARY.introducesRex7 ===
          false &&
        RUNTIME_EXECUTIVE_WORKSPACE_PUBLIC_INDEX_BOUNDARY.rex6Complete === true,
      "publication-only; REX-6 complete; no REX-7",
    ),
    check(
      "upstream-certification",
      certification.certification === "Certified" &&
        certification.compatibilityDisplay === "Compatible" &&
        certification.freezeDisplay === "Frozen" &&
        certification.lockDisplay === "Locked" &&
        runtimeExecutiveWorkspaceExperienceCertificationFreeze.status ===
          "ReadyForPublicIndex",
      "inherited REX-6:8 certification/freeze state remains valid",
    ),
  ];

  const failed = checks.filter((entry) => !entry.passed);
  const passed = checks.filter((entry) => entry.passed);
  const valid = failed.length === 0;

  return Object.freeze({
    valid,
    checks: Object.freeze(checks),
    passedCheckCount: passed.length,
    failedCheckCount: failed.length,
    issues: Object.freeze(failed.map((entry) => entry.id)),
    readyForConsumer: valid && RELEASE_GATE.readiness === "ReadyForConsumer",
    rex6Complete: valid,
  });
}
