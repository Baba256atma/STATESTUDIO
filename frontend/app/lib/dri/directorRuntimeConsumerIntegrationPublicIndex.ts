/**
 * DRI-8:9 — Director Runtime Consumer Integration Public Index.
 *
 * Sole supported consumer entry point for the certified, frozen DRI-8
 * Consumer Integration platform. Publication only — no new runtime behavior,
 * wrappers, rendering, browser events, or business logic.
 *
 * Principle: Freeze decides what is approved. Public Index exposes what
 * was approved.
 */

import {
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_GUARANTEES,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK_STATUS,
  bindDirectorRuntimeConsumerContext,
  bindDirectorRuntimeExperienceSurfaces,
  bridgeDirectorRuntimeConsumerInteraction,
  certifyDirectorRuntimeConsumerAdapter,
  coordinateDirectorRuntimeExperience,
  directorRuntimeConsumerAdapterCertificationRegistry,
  directorRuntimeConsumerIntegrationFreeze,
  directorRuntimeConsumerIntegrationFreezeIdentity,
  directorRuntimeConsumerIntegrationFreezeRegistry,
  directorRuntimeConsumerIntegrationFreezeResult,
  freezeDirectorRuntimeConsumerIntegration,
  getDirectorRuntimeConsumerAdapterCertificationIdentity,
  getDirectorRuntimeConsumerAdapterCompatibility,
  getDirectorRuntimeConsumerContextBindingIdentity,
  getDirectorRuntimeConsumerIntegrationApprovedFrozenExports,
  getDirectorRuntimeConsumerIntegrationFoundationIdentity,
  getDirectorRuntimeConsumerIntegrationFreezeIdentity,
  getDirectorRuntimeConsumerIntegrationPlatformLock,
  getDirectorRuntimeConsumerInteractionBridgeIdentity,
  getDirectorRuntimeExperienceCoordinationPlatformIdentity,
  getDirectorRuntimeExperienceCoordinationRules,
  getDirectorRuntimeExperienceStateProjectionIdentity,
  getDirectorRuntimeExperienceSurfaceBindingIdentity,
  getDirectorRuntimeExperienceSurfaceCapabilities,
  getDirectorRuntimeSurfaceInteractionCapabilities,
  isDirectorRuntimeConsumerInteractionSupported,
  listDirectorRuntimeConsumerAdapterCertificationChecks,
  listDirectorRuntimeConsumerAdapterCertificationDomains,
  listDirectorRuntimeConsumerIntegrationFreezeInvariants,
  listDirectorRuntimeConsumerInteractionKinds,
  listDirectorRuntimeExperienceCoordinationStatuses,
  listDirectorRuntimeExperiencePresentationStates,
  listDirectorRuntimeExperienceSurfaceRoles,
  listDirectorRuntimeExperienceSurfaces,
  projectDirectorRuntimeExperienceState,
  resolveDirectorRuntimeConsumerContext,
  resolveDirectorRuntimeConsumerInteractionIntent,
  resolveDirectorRuntimeExperienceCoordination,
  resolveDirectorRuntimeExperienceStateProjection,
  resolveDirectorRuntimeExperienceSurfaceBinding,
  validateDirectorRuntimeConsumerContext,
  validateDirectorRuntimeConsumerInteraction,
  validateDirectorRuntimeExperienceCoordination,
  validateDirectorRuntimeExperienceStateProjection,
  validateDirectorRuntimeExperienceSurfaceBinding,
  verifyDirectorRuntimeConsumerAdapterCertification,
  verifyDirectorRuntimeConsumerContextBinding,
  verifyDirectorRuntimeConsumerIntegrationFoundation,
  verifyDirectorRuntimeConsumerIntegrationFreeze,
  verifyDirectorRuntimeConsumerInteractionBridge,
  verifyDirectorRuntimeExperienceCoordinationPlatform,
  verifyDirectorRuntimeExperienceStateProjection,
  verifyDirectorRuntimeExperienceSurfaceBinding,
  type DirectorRuntimeConsumerAdapterCertification,
  type DirectorRuntimeConsumerContext,
  type DirectorRuntimeConsumerInteraction,
  type DirectorRuntimeConsumerInteractionBridgeResult,
  type DirectorRuntimeConsumerInteractionIntent,
  type DirectorRuntimeConsumerSubject,
  type DirectorRuntimeExperienceCoordinationInput,
  type DirectorRuntimeExperienceCoordinationPlan,
  type DirectorRuntimeExperienceCoordinationResult,
  type DirectorRuntimeExperienceStateProjection,
  type DirectorRuntimeExperienceStateProjectionResult,
  type DirectorRuntimeExperienceSurfaceBinding,
  type DirectorRuntimeExperienceSurfaceBindingResult,
  type DirectorRuntimeExperienceSurfaceCoordinationOutcome,
  type DirectorRuntimeConsumerIntegrationFreezeResult,
  type DirectorRuntimeConsumerIntegrationFreezeVerification,
} from "@/app/lib/dri/directorRuntimeConsumerIntegrationFreeze";

/** Exact DRI-8:8-approved publication. Direct re-export — no wrappers. */
export {
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK,
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK_STATUS,
  bindDirectorRuntimeConsumerContext,
  bindDirectorRuntimeExperienceSurfaces,
  bridgeDirectorRuntimeConsumerInteraction,
  certifyDirectorRuntimeConsumerAdapter,
  coordinateDirectorRuntimeExperience,
  directorRuntimeConsumerAdapterCertificationRegistry,
  directorRuntimeConsumerIntegrationFreeze,
  directorRuntimeConsumerIntegrationFreezeIdentity,
  directorRuntimeConsumerIntegrationFreezeRegistry,
  directorRuntimeConsumerIntegrationFreezeResult,
  freezeDirectorRuntimeConsumerIntegration,
  getDirectorRuntimeConsumerAdapterCertificationIdentity,
  getDirectorRuntimeConsumerAdapterCompatibility,
  getDirectorRuntimeConsumerContextBindingIdentity,
  getDirectorRuntimeConsumerIntegrationApprovedFrozenExports,
  getDirectorRuntimeConsumerIntegrationFoundationIdentity,
  getDirectorRuntimeConsumerIntegrationFreezeIdentity,
  getDirectorRuntimeConsumerIntegrationPlatformLock,
  getDirectorRuntimeConsumerInteractionBridgeIdentity,
  getDirectorRuntimeExperienceCoordinationPlatformIdentity,
  getDirectorRuntimeExperienceCoordinationRules,
  getDirectorRuntimeExperienceStateProjectionIdentity,
  getDirectorRuntimeExperienceSurfaceBindingIdentity,
  getDirectorRuntimeExperienceSurfaceCapabilities,
  getDirectorRuntimeSurfaceInteractionCapabilities,
  isDirectorRuntimeConsumerInteractionSupported,
  listDirectorRuntimeConsumerAdapterCertificationChecks,
  listDirectorRuntimeConsumerAdapterCertificationDomains,
  listDirectorRuntimeConsumerIntegrationFreezeInvariants,
  listDirectorRuntimeConsumerInteractionKinds,
  listDirectorRuntimeExperienceCoordinationStatuses,
  listDirectorRuntimeExperiencePresentationStates,
  listDirectorRuntimeExperienceSurfaceRoles,
  listDirectorRuntimeExperienceSurfaces,
  projectDirectorRuntimeExperienceState,
  resolveDirectorRuntimeConsumerContext,
  resolveDirectorRuntimeConsumerInteractionIntent,
  resolveDirectorRuntimeExperienceCoordination,
  resolveDirectorRuntimeExperienceStateProjection,
  resolveDirectorRuntimeExperienceSurfaceBinding,
  validateDirectorRuntimeConsumerContext,
  validateDirectorRuntimeConsumerInteraction,
  validateDirectorRuntimeExperienceCoordination,
  validateDirectorRuntimeExperienceStateProjection,
  validateDirectorRuntimeExperienceSurfaceBinding,
  verifyDirectorRuntimeConsumerAdapterCertification,
  verifyDirectorRuntimeConsumerContextBinding,
  verifyDirectorRuntimeConsumerIntegrationFoundation,
  verifyDirectorRuntimeConsumerIntegrationFreeze,
  verifyDirectorRuntimeConsumerInteractionBridge,
  verifyDirectorRuntimeExperienceCoordinationPlatform,
  verifyDirectorRuntimeExperienceStateProjection,
  verifyDirectorRuntimeExperienceSurfaceBinding,
};

export type {
  DirectorRuntimeConsumerAdapterCertification,
  DirectorRuntimeConsumerContext,
  DirectorRuntimeConsumerInteraction,
  DirectorRuntimeConsumerInteractionBridgeResult,
  DirectorRuntimeConsumerInteractionIntent,
  DirectorRuntimeConsumerSubject,
  DirectorRuntimeExperienceCoordinationInput,
  DirectorRuntimeExperienceCoordinationPlan,
  DirectorRuntimeExperienceCoordinationResult,
  DirectorRuntimeExperienceStateProjection,
  DirectorRuntimeExperienceStateProjectionResult,
  DirectorRuntimeExperienceSurfaceBinding,
  DirectorRuntimeExperienceSurfaceBindingResult,
  DirectorRuntimeExperienceSurfaceCoordinationOutcome,
  DirectorRuntimeConsumerIntegrationFreezeResult,
  DirectorRuntimeConsumerIntegrationFreezeVerification,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeConsumerIntegrationPublicIndexIdentity =
  "DRI-8:9/DirectorRuntimeConsumerIntegrationPublicIndex" as const;
export const directorRuntimeConsumerIntegrationPublicIndexVersion =
  "8.9.0" as const;
export const directorRuntimeConsumerIntegrationPublicIndexNamespace =
  "nexora.dri.consumer-integration.public-index" as const;
export const directorRuntimeConsumerIntegrationPublicIndexUpstream =
  directorRuntimeConsumerIntegrationFreezeIdentity;
export const directorRuntimeConsumerIntegrationPublicIndexLayer =
  "DirectorRuntimeConsumerIntegration" as const;
export const directorRuntimeConsumerIntegrationPublicIndexRole =
  "SoleConsumerEntryPoint" as const;

export const directorRuntimeConsumerIntegrationPublicIndexCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeConsumerIntegrationPublicIndexIdentity,
    version: directorRuntimeConsumerIntegrationPublicIndexVersion,
    namespace: directorRuntimeConsumerIntegrationPublicIndexNamespace,
    upstream: directorRuntimeConsumerIntegrationPublicIndexUpstream,
    layer: directorRuntimeConsumerIntegrationPublicIndexLayer,
    role: directorRuntimeConsumerIntegrationPublicIndexRole,
  });

export const directorRuntimeConsumerIntegrationConsumerImportPath =
  "@/app/lib/dri/directorRuntimeConsumerIntegrationPublicIndex" as const;

export const directorRuntimeConsumerIntegrationConsumerRole =
  "SoleConsumerEntryPoint" as const;

// ─── Release vocabularies ───────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_RELEASE_STATUSES =
  Object.freeze(["Released", "NotReleased"] as const);
export type DirectorRuntimeConsumerIntegrationReleaseStatus =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_RELEASE_STATUSES)[number];

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_READINESS_VALUES =
  Object.freeze(["ReadyForConsumer", "NotReadyForConsumer"] as const);
export type DirectorRuntimeConsumerIntegrationConsumerReadiness =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_READINESS_VALUES)[number];

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_STABILITY_VALUES =
  Object.freeze(["Stable", "Unstable"] as const);
export type DirectorRuntimeConsumerIntegrationPublicStability =
  (typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_STABILITY_VALUES)[number];

// ─── Namespace sections (canonical nine-section order) ──────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_SECTIONS =
  Object.freeze([
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

// ─── Release gate (derived from DRI-8:8 freeze) ─────────────────────────────

export interface DirectorRuntimeConsumerIntegrationPublicReleaseGateInput {
  readonly forceReleaseFailure?: boolean;
}

function evaluateReleaseGate(
  input: DirectorRuntimeConsumerIntegrationPublicReleaseGateInput = {},
): {
  readonly releaseStatus: DirectorRuntimeConsumerIntegrationReleaseStatus;
  readonly stability: DirectorRuntimeConsumerIntegrationPublicStability;
  readonly consumerReadiness: DirectorRuntimeConsumerIntegrationConsumerReadiness;
  readonly certificationStatus: "Certified" | "NotCertified";
  readonly compatibilityStatus: "Compatible" | "Incompatible";
  readonly freezeStatus: "Frozen" | "NotFrozen";
  readonly lockStatus: "Locked" | "Unlocked";
  readonly gatePassed: boolean;
} {
  const freeze = freezeDirectorRuntimeConsumerIntegration();
  const freezeVerification = verifyDirectorRuntimeConsumerIntegrationFreeze();
  const gatePassed =
    input.forceReleaseFailure !== true &&
    freeze.certificationStatus === "certified" &&
    freeze.compatibilityStatus === "compatible" &&
    freeze.freezeStatus === "frozen" &&
    freeze.lockStatus === "locked" &&
    freeze.stability === "stable" &&
    freeze.readiness === "ReadyForPublicIndex" &&
    freeze.lock === "DRI-8-CONSUMER-INTEGRATION-PLATFORM-LOCKED" &&
    freezeVerification.ok;

  return Object.freeze({
    releaseStatus: gatePassed
      ? ("Released" as const)
      : ("NotReleased" as const),
    stability: gatePassed ? ("Stable" as const) : ("Unstable" as const),
    consumerReadiness: gatePassed
      ? ("ReadyForConsumer" as const)
      : ("NotReadyForConsumer" as const),
    certificationStatus: gatePassed
      ? ("Certified" as const)
      : ("NotCertified" as const),
    compatibilityStatus: gatePassed
      ? ("Compatible" as const)
      : ("Incompatible" as const),
    freezeStatus: gatePassed ? ("Frozen" as const) : ("NotFrozen" as const),
    lockStatus: gatePassed ? ("Locked" as const) : ("Unlocked" as const),
    gatePassed,
  });
}

const CANONICAL_RELEASE_GATE = evaluateReleaseGate();

export function resolveDirectorRuntimeConsumerIntegrationRelease(
  input: DirectorRuntimeConsumerIntegrationPublicReleaseGateInput = {},
): {
  readonly releaseStatus: DirectorRuntimeConsumerIntegrationReleaseStatus;
  readonly stability: DirectorRuntimeConsumerIntegrationPublicStability;
  readonly consumerReadiness: DirectorRuntimeConsumerIntegrationConsumerReadiness;
  readonly certificationStatus: "Certified" | "NotCertified";
  readonly compatibilityStatus: "Compatible" | "Incompatible";
  readonly freezeStatus: "Frozen" | "NotFrozen";
  readonly lockStatus: "Locked" | "Unlocked";
  readonly lock:
    | typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK
    | "none";
  readonly version: typeof directorRuntimeConsumerIntegrationPublicIndexVersion;
  readonly namespace: typeof directorRuntimeConsumerIntegrationPublicIndexNamespace;
  readonly gatePassed: boolean;
} {
  const gate = evaluateReleaseGate(input);
  return Object.freeze({
    ...gate,
    lock: gate.gatePassed
      ? DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK
      : ("none" as const),
    version: directorRuntimeConsumerIntegrationPublicIndexVersion,
    namespace: directorRuntimeConsumerIntegrationPublicIndexNamespace,
  });
}

export const directorRuntimeConsumerIntegrationReleaseStatus =
  CANONICAL_RELEASE_GATE.releaseStatus;
export const directorRuntimeConsumerIntegrationStability =
  CANONICAL_RELEASE_GATE.stability;
export const directorRuntimeConsumerIntegrationConsumerReadiness =
  CANONICAL_RELEASE_GATE.consumerReadiness;
export const directorRuntimeConsumerIntegrationCertificationStatus =
  CANONICAL_RELEASE_GATE.certificationStatus;
export const directorRuntimeConsumerIntegrationCompatibilityStatus =
  CANONICAL_RELEASE_GATE.compatibilityStatus;
export const directorRuntimeConsumerIntegrationFreezeStatus =
  CANONICAL_RELEASE_GATE.freezeStatus;
export const directorRuntimeConsumerIntegrationLockStatus =
  CANONICAL_RELEASE_GATE.lockStatus;

// ─── Public export manifest ─────────────────────────────────────────────────

export interface DirectorRuntimeConsumerIntegrationPublicExportManifestEntry {
  readonly exportName: string;
  readonly category: string;
  readonly source: string;
  readonly approvedFrozenStatus: "approved-frozen";
  readonly publicStatus: "public";
}

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_EXPORT_MANIFEST =
  Object.freeze(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS.map(
      (entry) =>
        Object.freeze({
          exportName: entry.exportName,
          category: entry.category,
          source: entry.sourceIdentity,
          approvedFrozenStatus: "approved-frozen" as const,
          publicStatus: "public" as const,
        }),
    ),
  ) as ReadonlyArray<DirectorRuntimeConsumerIntegrationPublicExportManifestEntry>;

export type DirectorRuntimeConsumerIntegrationPublicExportManifest =
  typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_EXPORT_MANIFEST;

// ─── Public API / type / validation name lists ──────────────────────────────

const APPROVED_EXPORT_NAMES = Object.freeze(
  DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS.map(
    (entry) => entry.exportName,
  ),
);

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "DirectorRuntimeConsumerContext",
    "DirectorRuntimeConsumerSubject",
    "DirectorRuntimeExperienceSurfaceBinding",
    "DirectorRuntimeExperienceSurfaceBindingResult",
    "DirectorRuntimeExperienceStateProjection",
    "DirectorRuntimeExperienceStateProjectionResult",
    "DirectorRuntimeConsumerInteraction",
    "DirectorRuntimeConsumerInteractionBridgeResult",
    "DirectorRuntimeConsumerInteractionIntent",
    "DirectorRuntimeExperienceCoordinationInput",
    "DirectorRuntimeExperienceCoordinationPlan",
    "DirectorRuntimeExperienceSurfaceCoordinationOutcome",
    "DirectorRuntimeExperienceCoordinationResult",
    "DirectorRuntimeConsumerAdapterCertification",
    "DirectorRuntimeConsumerIntegrationFreezeResult",
    "DirectorRuntimeConsumerIntegrationReleaseInformation",
    "DirectorRuntimeConsumerIntegrationConsumerInformation",
    "DirectorRuntimeConsumerIntegrationPublicExportManifest",
  ] as const);

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_FUNCTIONAL_API_NAMES =
  Object.freeze(
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS.filter(
      (entry) =>
        entry.category === "consumer-context-apis" ||
        entry.category === "surface-binding-apis" ||
        entry.category === "state-projection-apis" ||
        entry.category === "interaction-bridge-apis" ||
        entry.category === "coordination-apis" ||
        entry.category === "identity" ||
        entry.category === "public-types" ||
        entry.category === "freeze-information" ||
        entry.category === "certification-information" ||
        entry.category === "registry-information",
    )
      .map((entry) => entry.exportName)
      .filter((name) => !name.startsWith("DirectorRuntime")),
  );

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_VALIDATION_API_NAMES =
  Object.freeze([
    "verifyDirectorRuntimeConsumerIntegrationFoundation",
    "verifyDirectorRuntimeConsumerContextBinding",
    "verifyDirectorRuntimeExperienceSurfaceBinding",
    "verifyDirectorRuntimeExperienceStateProjection",
    "verifyDirectorRuntimeConsumerInteractionBridge",
    "verifyDirectorRuntimeExperienceCoordinationPlatform",
    "verifyDirectorRuntimeConsumerAdapterCertification",
    "verifyDirectorRuntimeConsumerIntegrationFreeze",
    "verifyDirectorRuntimeConsumerIntegrationPublicIndex",
  ] as const);

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_CERTIFICATION_NAMES =
  Object.freeze([
    "certifyDirectorRuntimeConsumerAdapter",
    "getDirectorRuntimeConsumerAdapterCompatibility",
    "verifyDirectorRuntimeConsumerAdapterCertification",
    "listDirectorRuntimeConsumerAdapterCertificationDomains",
    "listDirectorRuntimeConsumerAdapterCertificationChecks",
    "directorRuntimeConsumerAdapterCertificationRegistry",
  ] as const);

// ─── Consumer rules / information ───────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_RULES =
  Object.freeze([
    "Import DRI-8 only from DRI-8:9 Public Index.",
    "Do not import DRI-8:1–8:8 directly.",
    "Do not import DRI-7 through the DRI-8 consumer boundary.",
    "Do not depend on certification/freeze implementation modules.",
    "Do not use internal helpers as consumer APIs.",
  ] as const);

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PROHIBITED_CONSUMER_IMPORTS =
  Object.freeze([
    "@/app/lib/dri/directorRuntimeConsumerIntegrationFoundation",
    "@/app/lib/dri/directorRuntimeConsumerContextBinding",
    "@/app/lib/dri/directorRuntimeExperienceSurfaceBinding",
    "@/app/lib/dri/directorRuntimeExperienceStateProjection",
    "@/app/lib/dri/directorRuntimeConsumerInteractionBridge",
    "@/app/lib/dri/directorRuntimeExperienceCoordinationPlatform",
    "@/app/lib/dri/directorRuntimeConsumerAdapterCertification",
    "@/app/lib/dri/directorRuntimeConsumerIntegrationFreeze",
  ] as const);

export const DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES =
  Object.freeze([
    "sole-consumer-entry-point",
    "released",
    "certified",
    "compatible",
    "frozen",
    "locked",
    "stable",
    "ready-for-consumer",
    "semantic-only",
    "framework-independent",
    "immutable",
    "deterministic",
    "identity-preserving",
    "selection-focus-distinct",
    "surface-scoped",
    "surface-decoupled",
    "minimal-fan-out",
    "preserve-unaffected-surfaces",
    "browser-event-independent",
    "rendering-independent",
    "business-logic-independent",
    "Runtime-non-mutating",
  ] as const);

export interface DirectorRuntimeConsumerIntegrationConsumerInformation {
  readonly consumerRole: "SoleConsumerEntryPoint";
  readonly supportedImportPath: typeof directorRuntimeConsumerIntegrationConsumerImportPath;
  readonly supportedConsumerFamily: "executive-experience";
  readonly frameworkIndependence: true;
  readonly semanticOnly: true;
  readonly frozenUpstreamRequired: true;
  readonly internalImportsProhibited: true;
  readonly prohibitedImports: typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PROHIBITED_CONSUMER_IMPORTS;
  readonly rules: typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_RULES;
  readonly guarantees: typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES;
}

export const directorRuntimeConsumerIntegrationConsumerInformation =
  Object.freeze({
    consumerRole: directorRuntimeConsumerIntegrationConsumerRole,
    supportedImportPath: directorRuntimeConsumerIntegrationConsumerImportPath,
    supportedConsumerFamily: "executive-experience" as const,
    frameworkIndependence: true as const,
    semanticOnly: true as const,
    frozenUpstreamRequired: true as const,
    internalImportsProhibited: true as const,
    prohibitedImports:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PROHIBITED_CONSUMER_IMPORTS,
    rules: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_RULES,
    guarantees: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES,
  }) satisfies DirectorRuntimeConsumerIntegrationConsumerInformation;

// ─── Release information ────────────────────────────────────────────────────

export interface DirectorRuntimeConsumerIntegrationReleaseInformation {
  readonly releaseStatus: DirectorRuntimeConsumerIntegrationReleaseStatus;
  readonly certificationStatus: "Certified" | "NotCertified";
  readonly compatibilityStatus: "Compatible" | "Incompatible";
  readonly freezeStatus: "Frozen" | "NotFrozen";
  readonly lockStatus: "Locked" | "Unlocked";
  readonly stability: DirectorRuntimeConsumerIntegrationPublicStability;
  readonly consumerReadiness: DirectorRuntimeConsumerIntegrationConsumerReadiness;
  readonly version: typeof directorRuntimeConsumerIntegrationPublicIndexVersion;
  readonly namespace: typeof directorRuntimeConsumerIntegrationPublicIndexNamespace;
  readonly lock:
    | typeof DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK
    | "none";
  readonly supportedImportPath: typeof directorRuntimeConsumerIntegrationConsumerImportPath;
  readonly consumerRole: typeof directorRuntimeConsumerIntegrationConsumerRole;
}

export const directorRuntimeConsumerIntegrationReleaseInformation =
  Object.freeze({
    releaseStatus: directorRuntimeConsumerIntegrationReleaseStatus,
    certificationStatus: directorRuntimeConsumerIntegrationCertificationStatus,
    compatibilityStatus: directorRuntimeConsumerIntegrationCompatibilityStatus,
    freezeStatus: directorRuntimeConsumerIntegrationFreezeStatus,
    lockStatus: directorRuntimeConsumerIntegrationLockStatus,
    stability: directorRuntimeConsumerIntegrationStability,
    consumerReadiness: directorRuntimeConsumerIntegrationConsumerReadiness,
    version: directorRuntimeConsumerIntegrationPublicIndexVersion,
    namespace: directorRuntimeConsumerIntegrationPublicIndexNamespace,
    lock: CANONICAL_RELEASE_GATE.gatePassed
      ? DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK
      : ("none" as const),
    supportedImportPath: directorRuntimeConsumerIntegrationConsumerImportPath,
    consumerRole: directorRuntimeConsumerIntegrationConsumerRole,
  }) satisfies DirectorRuntimeConsumerIntegrationReleaseInformation;

// ─── Namespace sections ─────────────────────────────────────────────────────

export const directorRuntimeConsumerIntegrationPublicIdentity = Object.freeze({
  identity: directorRuntimeConsumerIntegrationPublicIndexIdentity,
  version: directorRuntimeConsumerIntegrationPublicIndexVersion,
  namespace: directorRuntimeConsumerIntegrationPublicIndexNamespace,
  layer: directorRuntimeConsumerIntegrationPublicIndexLayer,
  role: directorRuntimeConsumerIntegrationPublicIndexRole,
  dependency: directorRuntimeConsumerIntegrationPublicIndexUpstream,
  supportedImportPath: directorRuntimeConsumerIntegrationConsumerImportPath,
});

export const directorRuntimeConsumerIntegrationPublicTypes = Object.freeze({
  names: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES,
  count: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES.length,
  surfaces: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES,
  surfaceCount: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES.length,
  interactionKinds: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS,
  interactionKindCount:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS.length,
  presentationStates:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES,
  presentationStateCount:
    DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES.length,
  coordinationStatuses: listDirectorRuntimeExperienceCoordinationStatuses(),
  coordinationRoles: listDirectorRuntimeExperienceSurfaceRoles(),
  source: "DRI-8:8/DirectorRuntimeConsumerIntegrationFreeze" as const,
});

export const directorRuntimeConsumerIntegrationPublicApis = Object.freeze({
  names: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_FUNCTIONAL_API_NAMES,
  count: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_FUNCTIONAL_API_NAMES.length,
  approvedFrozenExports:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS,
  approvedFrozenExportCount:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS.length,
  publicExportManifest:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_EXPORT_MANIFEST,
  publicExportCount:
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_EXPORT_MANIFEST.length,
  // Direct frozen references — no wrappers.
  bindDirectorRuntimeConsumerContext,
  validateDirectorRuntimeConsumerContext,
  bindDirectorRuntimeExperienceSurfaces,
  resolveDirectorRuntimeExperienceSurfaceBinding,
  projectDirectorRuntimeExperienceState,
  resolveDirectorRuntimeExperienceStateProjection,
  bridgeDirectorRuntimeConsumerInteraction,
  resolveDirectorRuntimeConsumerInteractionIntent,
  coordinateDirectorRuntimeExperience,
  resolveDirectorRuntimeExperienceCoordination,
  source: "DRI-8:8/DirectorRuntimeConsumerIntegrationFreeze" as const,
});

export const directorRuntimeConsumerIntegrationPublicValidation =
  Object.freeze({
    names: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_VALIDATION_API_NAMES,
    count: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_VALIDATION_API_NAMES.length,
    verifyFoundation: verifyDirectorRuntimeConsumerIntegrationFoundation,
    verifyContextBinding: verifyDirectorRuntimeConsumerContextBinding,
    verifySurfaceBinding: verifyDirectorRuntimeExperienceSurfaceBinding,
    verifyStateProjection: verifyDirectorRuntimeExperienceStateProjection,
    verifyInteractionBridge: verifyDirectorRuntimeConsumerInteractionBridge,
    verifyCoordination: verifyDirectorRuntimeExperienceCoordinationPlatform,
    verifyAdapterCertification:
      verifyDirectorRuntimeConsumerAdapterCertification,
    verifyFreeze: verifyDirectorRuntimeConsumerIntegrationFreeze,
  });

export const directorRuntimeConsumerIntegrationPublicCertification =
  Object.freeze({
    authority: "DRI-8:8/DirectorRuntimeConsumerIntegrationFreeze" as const,
    certificationStatus: directorRuntimeConsumerIntegrationCertificationStatus,
    compatibilityStatus: directorRuntimeConsumerIntegrationCompatibilityStatus,
    names: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_CERTIFICATION_NAMES,
    count: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_CERTIFICATION_NAMES.length,
    certify: certifyDirectorRuntimeConsumerAdapter,
    compatibility: getDirectorRuntimeConsumerAdapterCompatibility,
    registry: directorRuntimeConsumerAdapterCertificationRegistry,
  });

export const directorRuntimeConsumerIntegrationPublicCompatibility =
  Object.freeze({
    authority: "DRI-8:8/DirectorRuntimeConsumerIntegrationFreeze" as const,
    compatibilityStatus: "compatible" as const,
    publicStatus: directorRuntimeConsumerIntegrationCompatibilityStatus,
    semanticConsumerCompatible: true as const,
  });

export const directorRuntimeConsumerIntegrationPublicIndexRegistry =
  Object.freeze({
    identity: directorRuntimeConsumerIntegrationPublicIndexIdentity,
    version: directorRuntimeConsumerIntegrationPublicIndexVersion,
    namespace: directorRuntimeConsumerIntegrationPublicIndexNamespace,
    dependency: directorRuntimeConsumerIntegrationPublicIndexUpstream,
    sections: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_SECTIONS,
    namespaceSectionCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_SECTIONS.length,
    approvedFrozenExports:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS,
    approvedFrozenExportCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS.length,
    publicExportManifest:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_EXPORT_MANIFEST,
    publicExportCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_EXPORT_MANIFEST.length,
    publicTypes: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES.length,
    publicApis: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_FUNCTIONAL_API_NAMES,
    publicApiCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_FUNCTIONAL_API_NAMES.length,
    validationApis:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_VALIDATION_API_NAMES,
    validationApiCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_VALIDATION_API_NAMES.length,
    certificationNames:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_CERTIFICATION_NAMES,
    certificationCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_CERTIFICATION_NAMES.length,
    consumerGuarantees:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES,
    consumerGuaranteeCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES.length,
    surfaces: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES,
    surfaceCount: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES.length,
    interactionKinds: DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS,
    interactionKindCount:
      DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_INTERACTION_KINDS.length,
    presentationStates:
      DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES,
    presentationStateCount:
      DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_PRESENTATION_STATES.length,
    freezeGuarantees: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_GUARANTEES,
    freezeGuaranteeCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_FREEZE_GUARANTEES.length,
    freezeRegistry: directorRuntimeConsumerIntegrationFreezeRegistry,
    releaseStatus: directorRuntimeConsumerIntegrationReleaseStatus,
    certificationStatus: directorRuntimeConsumerIntegrationCertificationStatus,
    compatibilityStatus: directorRuntimeConsumerIntegrationCompatibilityStatus,
    freezeStatus: directorRuntimeConsumerIntegrationFreezeStatus,
    lockStatus: directorRuntimeConsumerIntegrationLockStatus,
    stability: directorRuntimeConsumerIntegrationStability,
    consumerReadiness: directorRuntimeConsumerIntegrationConsumerReadiness,
    lock: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK,
    consumerRole: directorRuntimeConsumerIntegrationConsumerRole,
    registrySectionCount: 9 as const,
  });

export const directorRuntimeConsumerIntegrationPublicIndex = Object.freeze({
  phase: "DRI-8:9" as const,
  name: "DirectorRuntimeConsumerIntegrationPublicIndex" as const,
  identity: directorRuntimeConsumerIntegrationPublicIndexIdentity,
  version: directorRuntimeConsumerIntegrationPublicIndexVersion,
  namespace: directorRuntimeConsumerIntegrationPublicIndexNamespace,
  layer: directorRuntimeConsumerIntegrationPublicIndexLayer,
  role: directorRuntimeConsumerIntegrationPublicIndexRole,
  stage: "PublicIndex" as const,
  releaseStatus: directorRuntimeConsumerIntegrationReleaseStatus,
  certificationStatus: directorRuntimeConsumerIntegrationCertificationStatus,
  compatibilityStatus: directorRuntimeConsumerIntegrationCompatibilityStatus,
  freezeStatus: directorRuntimeConsumerIntegrationFreezeStatus,
  lockStatus: directorRuntimeConsumerIntegrationLockStatus,
  stability: directorRuntimeConsumerIntegrationStability,
  consumerReadiness: directorRuntimeConsumerIntegrationConsumerReadiness,
  supportedImportPath: directorRuntimeConsumerIntegrationConsumerImportPath,
  immediateDependency: directorRuntimeConsumerIntegrationPublicIndexUpstream,
  lock: DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK,
  publicationOnly: true as const,
  noNewRuntimeBehavior: true as const,
  noWrappers: true as const,
  sections: Object.freeze({
    Identity: directorRuntimeConsumerIntegrationPublicIdentity,
    PublicTypes: directorRuntimeConsumerIntegrationPublicTypes,
    PublicAPIs: directorRuntimeConsumerIntegrationPublicApis,
    Validation: directorRuntimeConsumerIntegrationPublicValidation,
    Certification: directorRuntimeConsumerIntegrationPublicCertification,
    ReleaseInformation: directorRuntimeConsumerIntegrationReleaseInformation,
    Compatibility: directorRuntimeConsumerIntegrationPublicCompatibility,
    Registry: directorRuntimeConsumerIntegrationPublicIndexRegistry,
    ConsumerInformation: directorRuntimeConsumerIntegrationConsumerInformation,
  }),
  identitySection: directorRuntimeConsumerIntegrationPublicIdentity,
  publicTypes: directorRuntimeConsumerIntegrationPublicTypes,
  publicApis: directorRuntimeConsumerIntegrationPublicApis,
  validation: directorRuntimeConsumerIntegrationPublicValidation,
  certification: directorRuntimeConsumerIntegrationPublicCertification,
  releaseInformation: directorRuntimeConsumerIntegrationReleaseInformation,
  compatibility: directorRuntimeConsumerIntegrationPublicCompatibility,
  registry: directorRuntimeConsumerIntegrationPublicIndexRegistry,
  consumerInformation: directorRuntimeConsumerIntegrationConsumerInformation,
  freeze: directorRuntimeConsumerIntegrationFreeze,
  architecturalStatus:
    "Released · Certified · Compatible · Frozen · Locked · Stable · ReadyForConsumer" as const,
});

// ─── Verification helpers ───────────────────────────────────────────────────

function exactOrder(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

export interface DirectorRuntimeConsumerIntegrationPublicIndexVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeConsumerIntegrationPublicIndexIdentity;
  readonly version: typeof directorRuntimeConsumerIntegrationPublicIndexVersion;
  readonly namespace: typeof directorRuntimeConsumerIntegrationPublicIndexNamespace;
  readonly dependency: typeof directorRuntimeConsumerIntegrationPublicIndexUpstream;
  readonly releaseStatus: DirectorRuntimeConsumerIntegrationReleaseStatus;
  readonly consumerReadiness: DirectorRuntimeConsumerIntegrationConsumerReadiness;
  readonly namespaceSectionCount: number;
  readonly approvedFrozenExportCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly validationApiCount: number;
  readonly consumerGuaranteeCount: number;
  readonly checks: readonly string[];
}

export function verifyDirectorRuntimeConsumerIntegrationPublicIndex():
  DirectorRuntimeConsumerIntegrationPublicIndexVerification {
  const checks: string[] = [];
  const record = (name: string, pass: boolean): void => {
    if (pass) checks[checks.length] = name;
  };

  const freeze = directorRuntimeConsumerIntegrationFreezeResult;
  const freezeVerification = verifyDirectorRuntimeConsumerIntegrationFreeze();
  const release = resolveDirectorRuntimeConsumerIntegrationRelease();
  const registry = directorRuntimeConsumerIntegrationPublicIndexRegistry;
  const manifest = DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_EXPORT_MANIFEST;
  const approvedNames = APPROVED_EXPORT_NAMES;

  record(
    "identity",
    directorRuntimeConsumerIntegrationPublicIndexIdentity ===
      "DRI-8:9/DirectorRuntimeConsumerIntegrationPublicIndex",
  );
  record(
    "version",
    directorRuntimeConsumerIntegrationPublicIndexVersion === "8.9.0",
  );
  record(
    "namespace",
    directorRuntimeConsumerIntegrationPublicIndexNamespace ===
      "nexora.dri.consumer-integration.public-index",
  );
  record(
    "sole-dependency",
    directorRuntimeConsumerIntegrationPublicIndexUpstream ===
      "DRI-8:8/DirectorRuntimeConsumerIntegrationFreeze",
  );
  record(
    "upstream-certification",
    freeze.certificationStatus === "certified" &&
      directorRuntimeConsumerIntegrationCertificationStatus === "Certified",
  );
  record(
    "upstream-compatibility",
    freeze.compatibilityStatus === "compatible" &&
      directorRuntimeConsumerIntegrationCompatibilityStatus === "Compatible",
  );
  record(
    "upstream-freeze",
    freeze.freezeStatus === "frozen" &&
      directorRuntimeConsumerIntegrationFreezeStatus === "Frozen",
  );
  record(
    "upstream-lock",
    freeze.lockStatus === "locked" &&
      freeze.lock === "DRI-8-CONSUMER-INTEGRATION-PLATFORM-LOCKED" &&
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PLATFORM_LOCK ===
        "DRI-8-CONSUMER-INTEGRATION-PLATFORM-LOCKED",
  );
  record(
    "upstream-stability",
    freeze.stability === "stable" &&
      directorRuntimeConsumerIntegrationStability === "Stable",
  );
  record(
    "ready-for-public-index",
    freeze.readiness === "ReadyForPublicIndex" && freezeVerification.ok,
  );
  record(
    "release-status",
    release.releaseStatus === "Released" &&
      directorRuntimeConsumerIntegrationReleaseStatus === "Released",
  );
  record(
    "ready-for-consumer",
    release.consumerReadiness === "ReadyForConsumer" &&
      directorRuntimeConsumerIntegrationConsumerReadiness ===
        "ReadyForConsumer",
  );
  record(
    "export-manifest-integrity",
    unique(manifest.map((entry) => entry.exportName)) &&
      manifest.length ===
        DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS.length &&
      manifest.every(
        (entry) =>
          entry.approvedFrozenStatus === "approved-frozen" &&
          entry.publicStatus === "public" &&
          approvedNames.includes(entry.exportName),
      ),
  );
  record(
    "namespace-sections",
    exactOrder(
      [...DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_SECTIONS],
      [
        "Identity",
        "PublicTypes",
        "PublicAPIs",
        "Validation",
        "Certification",
        "ReleaseInformation",
        "Compatibility",
        "Registry",
        "ConsumerInformation",
      ],
    ) &&
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_SECTIONS.length === 9,
  );
  record(
    "consumer-role",
    directorRuntimeConsumerIntegrationConsumerRole ===
      "SoleConsumerEntryPoint",
  );
  record(
    "supported-import-path",
    directorRuntimeConsumerIntegrationConsumerImportPath ===
      "@/app/lib/dri/directorRuntimeConsumerIntegrationPublicIndex",
  );
  record(
    "framework-independence",
    directorRuntimeConsumerIntegrationConsumerInformation.frameworkIndependence ===
      true &&
      directorRuntimeConsumerIntegrationConsumerInformation.semanticOnly ===
        true,
  );
  record(
    "canonical-surfaces",
    exactOrder(
      [...DIRECTOR_RUNTIME_CONSUMER_ADAPTER_EXPECTED_SURFACES],
      ["stage", "advisor", "insight", "live-lens", "timeline", "explorer"],
    ),
  );
  record(
    "selection-focus",
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES.includes(
      "selection-focus-distinct",
    ),
  );
  record(
    "minimal-fan-out",
    DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES.includes(
      "minimal-fan-out",
    ) &&
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES.includes(
        "preserve-unaffected-surfaces",
      ),
  );
  record(
    "internal-import-prohibition",
    directorRuntimeConsumerIntegrationConsumerInformation.internalImportsProhibited ===
      true &&
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PROHIBITED_CONSUMER_IMPORTS
        .length === 8,
  );
  record(
    "registry-integrity",
    registry.namespaceSectionCount ===
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_SECTIONS.length &&
      registry.publicExportCount === manifest.length &&
      registry.publicTypeCount ===
        DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES.length &&
      registry.publicApiCount ===
        DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_FUNCTIONAL_API_NAMES.length &&
      registry.surfaceCount === 6 &&
      Object.isFrozen(registry) &&
      Object.isFrozen(directorRuntimeConsumerIntegrationPublicIndex) &&
      Object.isFrozen(manifest) &&
      Object.isFrozen(directorRuntimeConsumerIntegrationReleaseInformation) &&
      Object.isFrozen(directorRuntimeConsumerIntegrationConsumerInformation),
  );
  record(
    "direct-reexport-identity",
    directorRuntimeConsumerIntegrationPublicApis.bindDirectorRuntimeConsumerContext ===
      bindDirectorRuntimeConsumerContext &&
      directorRuntimeConsumerIntegrationPublicApis.projectDirectorRuntimeExperienceState ===
        projectDirectorRuntimeExperienceState &&
      directorRuntimeConsumerIntegrationPublicApis.bridgeDirectorRuntimeConsumerInteraction ===
        bridgeDirectorRuntimeConsumerInteraction &&
      directorRuntimeConsumerIntegrationPublicApis.coordinateDirectorRuntimeExperience ===
        coordinateDirectorRuntimeExperience,
  );

  const requiredChecks = [
    "identity",
    "version",
    "namespace",
    "sole-dependency",
    "upstream-certification",
    "upstream-compatibility",
    "upstream-freeze",
    "upstream-lock",
    "upstream-stability",
    "ready-for-public-index",
    "release-status",
    "ready-for-consumer",
    "export-manifest-integrity",
    "namespace-sections",
    "consumer-role",
    "supported-import-path",
    "framework-independence",
    "canonical-surfaces",
    "selection-focus",
    "minimal-fan-out",
    "internal-import-prohibition",
    "registry-integrity",
    "direct-reexport-identity",
  ] as const;

  const ok = requiredChecks.every((name) => checks.includes(name));

  return Object.freeze({
    ok,
    identity: directorRuntimeConsumerIntegrationPublicIndexIdentity,
    version: directorRuntimeConsumerIntegrationPublicIndexVersion,
    namespace: directorRuntimeConsumerIntegrationPublicIndexNamespace,
    dependency: directorRuntimeConsumerIntegrationPublicIndexUpstream,
    releaseStatus: directorRuntimeConsumerIntegrationReleaseStatus,
    consumerReadiness: directorRuntimeConsumerIntegrationConsumerReadiness,
    namespaceSectionCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_INDEX_SECTIONS.length,
    approvedFrozenExportCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_APPROVED_FROZEN_EXPORTS.length,
    publicTypeCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_FUNCTIONAL_API_NAMES.length,
    validationApiCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_PUBLIC_VALIDATION_API_NAMES.length,
    consumerGuaranteeCount:
      DIRECTOR_RUNTIME_CONSUMER_INTEGRATION_CONSUMER_GUARANTEES.length,
    checks: Object.freeze([...checks]),
  });
}
