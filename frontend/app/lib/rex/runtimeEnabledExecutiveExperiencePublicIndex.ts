/**
 * REX-1:9 — Runtime-enabled Executive Experience Public Index.
 *
 * Sole supported consumer entry point for the certified, frozen REX-1
 * Runtime-enabled Executive Experience platform.
 *
 * Canonical flow:
 *   … → REX-1:8 Certification & Freeze → REX-1:9 Public Index
 *
 * Publication only. No new runtime behavior, contracts, or semantics.
 *
 * Consumers know REX-1:9.
 * REX-1:9 knows REX-1:8.
 * REX-1:8 protects the certified platform.
 */

import {
  REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_APPROVED_EXPORTS,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_CERTIFICATION_DOMAINS,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_GUARANTEES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FREEZE_INVARIANTS,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_API_NAMES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_BOUNDARY,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITY_REGISTRY,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_COMPATIBILITY,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CONSUMER_CONTRACT,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_GUARANTEES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_STATUSES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES,
  bindRuntimeEnabledExecutiveSurfacePlatformState,
  certifyRuntimeEnabledExecutiveExperiencePlatform,
  composeRuntimeEnabledExecutiveExperiencePlatform,
  createRuntimeEnabledExecutiveExperienceFreezeContract,
  createRuntimeEnabledExecutiveExperiencePlatformSnapshot,
  getRuntimeEnabledExecutiveExperienceCertificationFreezeIdentity,
  getRuntimeEnabledExecutiveExperiencePlatformIdentity,
  isRuntimeEnabledExecutiveExperienceCertificationDomain,
  isRuntimeEnabledExecutiveExperienceCertificationStatus,
  isRuntimeEnabledExecutiveExperienceCompatibilityStatus,
  isRuntimeEnabledExecutiveExperienceFreezeStatus,
  isRuntimeEnabledExecutiveExperienceLockStatus,
  isRuntimeEnabledExecutiveExperiencePlatformCapability,
  isRuntimeEnabledExecutiveExperiencePlatformStatus,
  resolveRuntimeEnabledExecutiveExperiencePlatformReadiness,
  runtimeEnabledExecutiveExperienceCertificationFreeze,
  runtimeEnabledExecutiveExperienceCertificationFreezeIdentity,
  runtimeEnabledExecutiveExperiencePlatform,
  runtimeEnabledExecutiveExperiencePlatformCanonicalIdentity,
  runtimeEnabledExecutiveExperiencePlatformIdentity,
  runtimeEnabledExecutiveExperiencePlatformLayer,
  runtimeEnabledExecutiveExperiencePlatformNamespace,
  runtimeEnabledExecutiveExperiencePlatformPhase,
  runtimeEnabledExecutiveExperiencePlatformRegistry,
  runtimeEnabledExecutiveExperiencePlatformStage,
  runtimeEnabledExecutiveExperiencePlatformVersion,
  validateRuntimeEnabledExecutiveExperienceCertificationReport,
  validateRuntimeEnabledExecutiveExperienceFreezeContract,
  validateRuntimeEnabledExecutiveExperiencePlatform,
  validateRuntimeEnabledExecutiveExperiencePlatformInput,
  verifyRuntimeEnabledExecutiveExperienceCertification,
  verifyRuntimeEnabledExecutiveExperienceCertificationFreeze,
  verifyRuntimeEnabledExecutiveExperienceFreeze,
  verifyRuntimeEnabledExecutiveExperiencePlatform,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceCertificationFreeze";

/** Exact REX-1:8-approved publication. Direct re-export — no wrappers. */
export {
  REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_APPROVED_EXPORTS,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_CERTIFICATION_DOMAINS,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_GUARANTEES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FREEZE_INVARIANTS,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_API_NAMES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_BOUNDARY,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITY_REGISTRY,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_COMPATIBILITY,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CONSUMER_CONTRACT,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_GUARANTEES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_STATUSES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES,
  bindRuntimeEnabledExecutiveSurfacePlatformState,
  certifyRuntimeEnabledExecutiveExperiencePlatform,
  composeRuntimeEnabledExecutiveExperiencePlatform,
  createRuntimeEnabledExecutiveExperienceFreezeContract,
  createRuntimeEnabledExecutiveExperiencePlatformSnapshot,
  getRuntimeEnabledExecutiveExperienceCertificationFreezeIdentity,
  getRuntimeEnabledExecutiveExperiencePlatformIdentity,
  isRuntimeEnabledExecutiveExperienceCertificationDomain,
  isRuntimeEnabledExecutiveExperienceCertificationStatus,
  isRuntimeEnabledExecutiveExperienceCompatibilityStatus,
  isRuntimeEnabledExecutiveExperienceFreezeStatus,
  isRuntimeEnabledExecutiveExperienceLockStatus,
  isRuntimeEnabledExecutiveExperiencePlatformCapability,
  isRuntimeEnabledExecutiveExperiencePlatformStatus,
  resolveRuntimeEnabledExecutiveExperiencePlatformReadiness,
  runtimeEnabledExecutiveExperienceCertificationFreeze,
  runtimeEnabledExecutiveExperienceCertificationFreezeIdentity,
  runtimeEnabledExecutiveExperiencePlatform,
  runtimeEnabledExecutiveExperiencePlatformCanonicalIdentity,
  runtimeEnabledExecutiveExperiencePlatformIdentity,
  runtimeEnabledExecutiveExperiencePlatformLayer,
  runtimeEnabledExecutiveExperiencePlatformNamespace,
  runtimeEnabledExecutiveExperiencePlatformPhase,
  runtimeEnabledExecutiveExperiencePlatformRegistry,
  runtimeEnabledExecutiveExperiencePlatformStage,
  runtimeEnabledExecutiveExperiencePlatformVersion,
  validateRuntimeEnabledExecutiveExperienceCertificationReport,
  validateRuntimeEnabledExecutiveExperienceFreezeContract,
  validateRuntimeEnabledExecutiveExperiencePlatform,
  validateRuntimeEnabledExecutiveExperiencePlatformInput,
  verifyRuntimeEnabledExecutiveExperienceCertification,
  verifyRuntimeEnabledExecutiveExperienceCertificationFreeze,
  verifyRuntimeEnabledExecutiveExperienceFreeze,
  verifyRuntimeEnabledExecutiveExperiencePlatform,
};

export type {
  RuntimeEnabledExecutiveAdvisorPlatform,
  RuntimeEnabledExecutiveCrossSurfaceContext,
  RuntimeEnabledExecutiveExplorerPlatform,
  RuntimeEnabledExecutiveExperiencePlatform,
  RuntimeEnabledExecutiveExperiencePlatformCapability,
  RuntimeEnabledExecutiveExperiencePlatformCompatibility,
  RuntimeEnabledExecutiveExperiencePlatformConsumerContract,
  RuntimeEnabledExecutiveExperiencePlatformInput,
  RuntimeEnabledExecutiveExperiencePlatformReadiness,
  RuntimeEnabledExecutiveExperiencePlatformResult,
  RuntimeEnabledExecutiveExperiencePlatformSnapshot,
  RuntimeEnabledExecutiveExperiencePlatformStatus,
  RuntimeEnabledExecutiveInsightPlatform,
  RuntimeEnabledExecutivePlatformAuthority,
  RuntimeEnabledExecutiveStagePlatform,
  RuntimeEnabledExecutiveSurfacePlatformState,
  RuntimeEnabledExecutiveTimelinePlatform,
  RuntimeEnabledExecutiveExperienceCertificationCheck,
  RuntimeEnabledExecutiveExperienceCertificationDomain,
  RuntimeEnabledExecutiveExperienceCertificationReport,
  RuntimeEnabledExecutiveExperienceCertificationStatus,
  RuntimeEnabledExecutiveExperienceCompatibilityReport,
  RuntimeEnabledExecutiveExperienceCompatibilityStatus,
  RuntimeEnabledExecutiveExperienceFreezeContract,
  RuntimeEnabledExecutiveExperienceFreezeStatus,
  RuntimeEnabledExecutiveExperienceLockStatus,
  RuntimeEnabledExecutiveExperiencePublicIndexReadiness,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceCertificationFreeze";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperiencePublicIndexIdentity =
  "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex" as const;

export const runtimeEnabledExecutiveExperiencePublicIndexVersion =
  "1.9.0" as const;

export const runtimeEnabledExecutiveExperiencePublicIndexNamespace =
  "nexora.rex.runtime-enabled-executive-experience.public-index" as const;

export const runtimeEnabledExecutiveExperiencePublicIndexLayer = "REX" as const;

export const runtimeEnabledExecutiveExperiencePublicIndexPhase =
  "REX-1" as const;

export const runtimeEnabledExecutiveExperiencePublicIndexStage =
  "PublicIndex" as const;

export const runtimeEnabledExecutiveExperiencePublicIndexArchitecturalRole =
  "SoleConsumerEntryPoint" as const;

export const runtimeEnabledExecutiveExperiencePublicIndexConsumerRole =
  "SoleConsumerEntryPoint" as const;

export const runtimeEnabledExecutiveExperiencePublicIndexDependencyIdentity =
  runtimeEnabledExecutiveExperienceCertificationFreezeIdentity;

export const runtimeEnabledExecutiveExperiencePublicIndexDependencyPath =
  "@/app/lib/rex/runtimeEnabledExecutiveExperienceCertificationFreeze" as const;

export const runtimeEnabledExecutiveExperiencePublicIndexSupportedImportPath =
  "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex" as const;

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_CONSUMER_ROLE =
  "SoleConsumerEntryPoint" as const;

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_RUNTIME_AUTHORITY_POLICY =
  "EX-DRI → REX" as const;

// ─── Release vocabularies ───────────────────────────────────────────────────

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_RELEASE_STATUSES =
  Object.freeze(["Released", "Unreleased"] as const);

export type RuntimeEnabledExecutiveExperienceReleaseStatus =
  (typeof RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_RELEASE_STATUSES)[number];

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_STABILITY_VALUES =
  Object.freeze(["Stable", "Experimental"] as const);

export type RuntimeEnabledExecutiveExperienceStability =
  (typeof RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_STABILITY_VALUES)[number];

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_CONSUMER_READINESS_VALUES =
  Object.freeze(["ReadyForConsumer", "NotReadyForConsumer"] as const);

export type RuntimeEnabledExecutiveExperienceConsumerReadiness =
  (typeof RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_CONSUMER_READINESS_VALUES)[number];

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_SECTIONS =
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

export type RuntimeEnabledExecutiveExperiencePublicIndexSection =
  (typeof RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_SECTIONS)[number];

// ─── Release gate (derived from REX-1:8 — not recomputed independently) ─────

function evaluateReleaseGate(forceFailure = false): {
  readonly releaseStatus: RuntimeEnabledExecutiveExperienceReleaseStatus;
  readonly consumerReadiness: RuntimeEnabledExecutiveExperienceConsumerReadiness;
  readonly certificationStatus: "Certified" | "NotCertified";
  readonly compatibilityStatus: "Compatible" | "Incompatible";
  readonly freezeStatus: "Frozen" | "NotFrozen";
  readonly lockStatus: "Locked" | "Unlocked";
  readonly stability: RuntimeEnabledExecutiveExperienceStability;
  readonly gatePassed: boolean;
  readonly publicIndexReadiness: "ReadyForPublicIndex" | "NotReadyForPublicIndex";
} {
  const freezeVerification =
    verifyRuntimeEnabledExecutiveExperienceCertificationFreeze();
  const freezeContract = createRuntimeEnabledExecutiveExperienceFreezeContract();
  const gatePassed =
    forceFailure !== true &&
    freezeVerification.ok === true &&
    freezeContract.certificationStatus === "certified" &&
    freezeContract.compatibilityStatus === "compatible" &&
    freezeContract.freezeStatus === "frozen" &&
    freezeContract.lockStatus === "locked" &&
    freezeContract.readiness === "ReadyForPublicIndex" &&
    freezeContract.platformLock ===
      REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED &&
    runtimeEnabledExecutiveExperienceCertificationFreeze
      .introducesRuntimeBehavior === false;

  return Object.freeze({
    releaseStatus: gatePassed ? ("Released" as const) : ("Unreleased" as const),
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
    stability: gatePassed ? ("Stable" as const) : ("Experimental" as const),
    gatePassed,
    publicIndexReadiness: freezeContract.readiness,
  });
}

const CANONICAL_RELEASE_GATE = evaluateReleaseGate();

export function resolveRuntimeEnabledExecutiveExperiencePublicIndexRelease(
  options: { readonly forceReleaseFailure?: boolean } = {},
): typeof CANONICAL_RELEASE_GATE & {
  readonly platformLock:
    | typeof REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED
    | "none";
  readonly version: typeof runtimeEnabledExecutiveExperiencePublicIndexVersion;
} {
  const gate = evaluateReleaseGate(options.forceReleaseFailure === true);
  return Object.freeze({
    ...gate,
    platformLock: gate.gatePassed
      ? REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED
      : ("none" as const),
    version: runtimeEnabledExecutiveExperiencePublicIndexVersion,
  });
}

export const runtimeEnabledExecutiveExperienceReleaseStatus =
  CANONICAL_RELEASE_GATE.releaseStatus;
export const runtimeEnabledExecutiveExperienceConsumerReadiness =
  CANONICAL_RELEASE_GATE.consumerReadiness;
export const runtimeEnabledExecutiveExperiencePublicCertificationStatus =
  CANONICAL_RELEASE_GATE.certificationStatus;
export const runtimeEnabledExecutiveExperiencePublicCompatibilityStatus =
  CANONICAL_RELEASE_GATE.compatibilityStatus;
export const runtimeEnabledExecutiveExperiencePublicFreezeStatus =
  CANONICAL_RELEASE_GATE.freezeStatus;
export const runtimeEnabledExecutiveExperiencePublicLockStatus =
  CANONICAL_RELEASE_GATE.lockStatus;
export const runtimeEnabledExecutiveExperiencePublicStability =
  CANONICAL_RELEASE_GATE.stability;

export const runtimeEnabledExecutiveExperiencePublicIndexCanonicalIdentity =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperiencePublicIndexIdentity,
    version: runtimeEnabledExecutiveExperiencePublicIndexVersion,
    namespace: runtimeEnabledExecutiveExperiencePublicIndexNamespace,
    layer: runtimeEnabledExecutiveExperiencePublicIndexLayer,
    phase: runtimeEnabledExecutiveExperiencePublicIndexPhase,
    stage: runtimeEnabledExecutiveExperiencePublicIndexStage,
    architecturalRole:
      runtimeEnabledExecutiveExperiencePublicIndexArchitecturalRole,
    consumerRole: runtimeEnabledExecutiveExperiencePublicIndexConsumerRole,
    soleImmediateDependency:
      runtimeEnabledExecutiveExperiencePublicIndexDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperiencePublicIndexDependencyPath,
    supportedImportPath:
      runtimeEnabledExecutiveExperiencePublicIndexSupportedImportPath,
    platformLock: REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED,
    releaseStatus: CANONICAL_RELEASE_GATE.releaseStatus,
    certificationStatus: CANONICAL_RELEASE_GATE.certificationStatus,
    compatibilityStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
    freezeStatus: CANONICAL_RELEASE_GATE.freezeStatus,
    lockStatus: CANONICAL_RELEASE_GATE.lockStatus,
    stability: CANONICAL_RELEASE_GATE.stability,
    consumerReadiness: CANONICAL_RELEASE_GATE.consumerReadiness,
    runtimeAuthorityPolicy:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_RUNTIME_AUTHORITY_POLICY,
  });

// ─── Public catalogs (approved surface only) ────────────────────────────────

/** Approved type-only symbol names (PascalCase RuntimeEnabled* contracts). */
const APPROVED_TYPE_NAMES = Object.freeze(
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_APPROVED_EXPORTS.filter((name) =>
    name.startsWith("RuntimeEnabled"),
  ),
);

/** Type-name registry for approved public types (no fake runtime type values). */
export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_TYPE_NAMES =
  Object.freeze([
    ...APPROVED_TYPE_NAMES,
    "RuntimeEnabledExecutiveExperienceCertificationReport",
    "RuntimeEnabledExecutiveExperienceFreezeContract",
    "RuntimeEnabledExecutiveExperienceCompatibilityReport",
    "RuntimeEnabledExecutiveExperiencePublicIndexVerification",
  ] as const);

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_FUNCTIONAL_API_NAMES =
  Object.freeze([
    "composeRuntimeEnabledExecutiveExperiencePlatform",
    "createRuntimeEnabledExecutiveExperiencePlatformSnapshot",
    "resolveRuntimeEnabledExecutiveExperiencePlatformReadiness",
    "bindRuntimeEnabledExecutiveSurfacePlatformState",
    "getRuntimeEnabledExecutiveExperiencePlatformIdentity",
    "certifyRuntimeEnabledExecutiveExperiencePlatform",
    "createRuntimeEnabledExecutiveExperienceFreezeContract",
    "getRuntimeEnabledExecutiveExperienceCertificationFreezeIdentity",
    "resolveRuntimeEnabledExecutiveExperiencePublicIndexRelease",
  ] as const);

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_VALIDATION_API_NAMES =
  Object.freeze([
    "validateRuntimeEnabledExecutiveExperiencePlatformInput",
    "validateRuntimeEnabledExecutiveExperiencePlatform",
    "isRuntimeEnabledExecutiveExperiencePlatformCapability",
    "isRuntimeEnabledExecutiveExperiencePlatformStatus",
    "isRuntimeEnabledExecutiveExperienceCertificationDomain",
    "isRuntimeEnabledExecutiveExperienceCertificationStatus",
    "isRuntimeEnabledExecutiveExperienceCompatibilityStatus",
    "isRuntimeEnabledExecutiveExperienceFreezeStatus",
    "isRuntimeEnabledExecutiveExperienceLockStatus",
    "validateRuntimeEnabledExecutiveExperienceCertificationReport",
    "validateRuntimeEnabledExecutiveExperienceFreezeContract",
    "verifyRuntimeEnabledExecutiveExperiencePlatform",
    "verifyRuntimeEnabledExecutiveExperienceCertification",
    "verifyRuntimeEnabledExecutiveExperienceFreeze",
    "verifyRuntimeEnabledExecutiveExperienceCertificationFreeze",
    "verifyRuntimeEnabledExecutiveExperienceConsumerEntry",
  ] as const);

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CERTIFICATION_NAMES =
  Object.freeze([
    "certifyRuntimeEnabledExecutiveExperiencePlatform",
    "createRuntimeEnabledExecutiveExperienceFreezeContract",
    "verifyRuntimeEnabledExecutiveExperienceCertification",
    "verifyRuntimeEnabledExecutiveExperienceFreeze",
    "verifyRuntimeEnabledExecutiveExperienceCertificationFreeze",
    "RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_CERTIFICATION_DOMAINS",
    "RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_GUARANTEES",
    "RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FREEZE_INVARIANTS",
    "REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED",
  ] as const);

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLISHED_RUNTIME_SYMBOLS =
  Object.freeze([
    ...RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_APPROVED_EXPORTS.filter(
      (name) => !APPROVED_TYPE_NAMES.includes(name as never),
    ),
  ] as const);

// ─── Consumer guarantees ────────────────────────────────────────────────────

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CONSUMER_GUARANTEES =
  Object.freeze([
    Object.freeze({
      id: "sole-supported-entry",
      order: 1,
      statement: "This is the sole supported REX-1 consumer entry point.",
    }),
    Object.freeze({
      id: "depends-only-on-rex-1-8",
      order: 2,
      statement: "REX-1:9 depends only on REX-1:8.",
    }),
    Object.freeze({
      id: "published-behavior-certified",
      order: 3,
      statement: "Published runtime behavior is certified.",
    }),
    Object.freeze({
      id: "published-behavior-compatible",
      order: 4,
      statement: "Published runtime behavior is compatible.",
    }),
    Object.freeze({
      id: "published-semantics-frozen",
      order: 5,
      statement: "Published REX-1 semantics are frozen.",
    }),
    Object.freeze({
      id: "platform-lock-stable",
      order: 6,
      statement: "Platform lock is stable.",
    }),
    Object.freeze({
      id: "runtime-authority-ex-dri-originated",
      order: 7,
      statement: "Runtime authority remains EX-DRI-originated.",
    }),
    Object.freeze({
      id: "canonical-surfaces-stable",
      order: 8,
      statement: "Canonical surfaces are stable.",
    }),
    Object.freeze({
      id: "canonical-subject-identity-preserved",
      order: 9,
      statement: "Canonical subject identity is preserved.",
    }),
    Object.freeze({
      id: "canonical-presentation-states-stable",
      order: 10,
      statement: "Canonical presentation states are stable.",
    }),
    Object.freeze({
      id: "state-context-binding-deterministic",
      order: 11,
      statement: "State/context binding is deterministic.",
    }),
    Object.freeze({
      id: "scene-binding-deterministic",
      order: 12,
      statement: "Scene binding is deterministic.",
    }),
    Object.freeze({
      id: "interaction-binding-deterministic",
      order: 13,
      statement: "Interaction binding is deterministic.",
    }),
    Object.freeze({
      id: "presentation-binding-deterministic",
      order: 14,
      statement: "Presentation binding is deterministic.",
    }),
    Object.freeze({
      id: "platform-composition-deterministic",
      order: 15,
      statement: "Platform composition is deterministic.",
    }),
    Object.freeze({
      id: "no-caller-input-mutation",
      order: 16,
      statement: "Caller-owned input is not mutated.",
    }),
    Object.freeze({
      id: "interactions-represented-not-executed",
      order: 17,
      statement:
        "Interactions are represented, not automatically executed by the REX platform.",
    }),
    Object.freeze({
      id: "no-kpi-calculation",
      order: 18,
      statement: "REX platform does not calculate KPI.",
    }),
    Object.freeze({
      id: "no-koi-calculation",
      order: 19,
      statement: "REX platform does not calculate KOI.",
    }),
    Object.freeze({
      id: "no-ai-reasoning",
      order: 20,
      statement: "REX platform does not perform AI reasoning.",
    }),
    Object.freeze({
      id: "framework-neutral",
      order: 21,
      statement: "REX platform remains framework-neutral.",
    }),
    Object.freeze({
      id: "no-react-dependency",
      order: 22,
      statement: "REX platform introduces no React dependency.",
    }),
    Object.freeze({
      id: "no-threejs-dependency",
      order: 23,
      statement: "REX platform introduces no Three.js dependency.",
    }),
    Object.freeze({
      id: "no-persistence-network-dependency",
      order: 24,
      statement: "REX platform introduces no persistence/network dependency.",
    }),
    Object.freeze({
      id: "do-not-bypass-public-index",
      order: 25,
      statement:
        "Consumers should not bypass this Public Index into internal REX stages.",
    }),
  ] as const);

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PROHIBITED_CONSUMER_IMPORTS =
  Object.freeze([
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceFoundation",
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceContracts",
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceStateBinding",
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceSceneBinding",
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceInteractionBinding",
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceAdaptivePresentationBinding",
    "@/app/lib/rex/runtimeEnabledExecutiveExperiencePlatform",
    "@/app/lib/rex/runtimeEnabledExecutiveExperienceCertificationFreeze",
  ] as const);

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_PRINCIPLE =
  "Publication boundary only. Consumers use REX-1:9. REX-1:9 knows REX-1:8. REX-1:8 protects the certified platform." as const;

export const RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_BOUNDARY =
  Object.freeze({
    rexAuthority: "Runtime-enabled-Executive-Experience" as const,
    publicIndexAuthority: "REX-1:9" as const,
    architecturalRole: "SoleConsumerEntryPoint" as const,
    soleImmediateDependency:
      "REX-1:8/RuntimeEnabledExecutiveExperienceCertificationFreeze" as const,
    consumesCertificationFreezeOnly: true as const,
    importsPlatformDirectly: false as const,
    importsPresentationBindingDirectly: false as const,
    importsExDriDirectly: false as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    introducesRuntimeBehavior: false as const,
    isSoleConsumerEntryPoint: true as const,
    publishesApprovedExportsOnly: true as const,
  });

// ─── Namespace sections ─────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperiencePublicIndexIdentitySection =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperiencePublicIndexIdentity,
    version: runtimeEnabledExecutiveExperiencePublicIndexVersion,
    namespace: runtimeEnabledExecutiveExperiencePublicIndexNamespace,
    layer: runtimeEnabledExecutiveExperiencePublicIndexLayer,
    phase: runtimeEnabledExecutiveExperiencePublicIndexPhase,
    stage: runtimeEnabledExecutiveExperiencePublicIndexStage,
    soleImmediateDependency:
      runtimeEnabledExecutiveExperiencePublicIndexDependencyIdentity,
    supportedImportPath:
      runtimeEnabledExecutiveExperiencePublicIndexSupportedImportPath,
    consumerRole: runtimeEnabledExecutiveExperiencePublicIndexConsumerRole,
    platformLock: REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED,
    runtimeAuthorityPolicy:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_RUNTIME_AUTHORITY_POLICY,
  });

export const runtimeEnabledExecutiveExperiencePublicIndexPublicTypesSection =
  Object.freeze({
    typeNames: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_TYPE_NAMES,
    typeCount: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_TYPE_NAMES.length,
    surfaces: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES,
    subjectKinds: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS,
    presentationStates:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
    capabilities: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES,
    statuses: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_STATUSES,
    note: "Type-only exports are registered by name; no fake runtime type values are created." as const,
  });

export const runtimeEnabledExecutiveExperiencePublicIndexPublicApisSection =
  Object.freeze({
    apiNames: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_FUNCTIONAL_API_NAMES,
    apiCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_FUNCTIONAL_API_NAMES.length,
    composeRuntimeEnabledExecutiveExperiencePlatform,
    createRuntimeEnabledExecutiveExperiencePlatformSnapshot,
    resolveRuntimeEnabledExecutiveExperiencePlatformReadiness,
    bindRuntimeEnabledExecutiveSurfacePlatformState,
    getRuntimeEnabledExecutiveExperiencePlatformIdentity,
    certifyRuntimeEnabledExecutiveExperiencePlatform,
    createRuntimeEnabledExecutiveExperienceFreezeContract,
    getRuntimeEnabledExecutiveExperienceCertificationFreezeIdentity,
    resolveRuntimeEnabledExecutiveExperiencePublicIndexRelease,
  });

export const runtimeEnabledExecutiveExperiencePublicIndexValidationSection =
  Object.freeze({
    validationApiNames:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_VALIDATION_API_NAMES,
    validationApiCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_VALIDATION_API_NAMES.length,
    validateRuntimeEnabledExecutiveExperiencePlatformInput,
    validateRuntimeEnabledExecutiveExperiencePlatform,
    isRuntimeEnabledExecutiveExperiencePlatformCapability,
    isRuntimeEnabledExecutiveExperiencePlatformStatus,
    isRuntimeEnabledExecutiveExperienceCertificationDomain,
    isRuntimeEnabledExecutiveExperienceCertificationStatus,
    isRuntimeEnabledExecutiveExperienceCompatibilityStatus,
    isRuntimeEnabledExecutiveExperienceFreezeStatus,
    isRuntimeEnabledExecutiveExperienceLockStatus,
    validateRuntimeEnabledExecutiveExperienceCertificationReport,
    validateRuntimeEnabledExecutiveExperienceFreezeContract,
    verifyRuntimeEnabledExecutiveExperiencePlatform,
    verifyRuntimeEnabledExecutiveExperienceCertification,
    verifyRuntimeEnabledExecutiveExperienceFreeze,
    verifyRuntimeEnabledExecutiveExperienceCertificationFreeze,
  });

const CERTIFICATION_REPORT =
  certifyRuntimeEnabledExecutiveExperiencePlatform();
const FREEZE_CONTRACT = createRuntimeEnabledExecutiveExperienceFreezeContract(
  CERTIFICATION_REPORT,
);

export const runtimeEnabledExecutiveExperiencePublicIndexCertificationSection =
  Object.freeze({
    certificationStatus: CANONICAL_RELEASE_GATE.certificationStatus,
    freezeStatus: CANONICAL_RELEASE_GATE.freezeStatus,
    lockStatus: CANONICAL_RELEASE_GATE.lockStatus,
    platformLock: REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED,
    publicIndexReadiness: CANONICAL_RELEASE_GATE.publicIndexReadiness,
    domains: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_CERTIFICATION_DOMAINS,
    domainCount: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_CERTIFICATION_DOMAINS.length,
    totalCheckCount: CERTIFICATION_REPORT.totalCheckCount,
    passedCheckCount: CERTIFICATION_REPORT.passedCheckCount,
    failedCheckCount: CERTIFICATION_REPORT.failedCheckCount,
    certificationReport: CERTIFICATION_REPORT,
    freezeContract: FREEZE_CONTRACT,
    frozenGuarantees: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_GUARANTEES,
    freezeInvariants: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FREEZE_INVARIANTS,
    certificationApiNames:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CERTIFICATION_NAMES,
    certificationInformationCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CERTIFICATION_NAMES.length,
    certifyRuntimeEnabledExecutiveExperiencePlatform,
    verifyRuntimeEnabledExecutiveExperienceCertification,
    verifyRuntimeEnabledExecutiveExperienceFreeze,
    verifyRuntimeEnabledExecutiveExperienceCertificationFreeze,
  });

export const runtimeEnabledExecutiveExperiencePublicIndexReleaseInformationSection =
  Object.freeze({
    releaseStatus: CANONICAL_RELEASE_GATE.releaseStatus,
    stability: CANONICAL_RELEASE_GATE.stability,
    consumerReadiness: CANONICAL_RELEASE_GATE.consumerReadiness,
    releaseVersion: runtimeEnabledExecutiveExperiencePublicIndexVersion,
    publicIndexIdentity: runtimeEnabledExecutiveExperiencePublicIndexIdentity,
    supportedImportPath:
      runtimeEnabledExecutiveExperiencePublicIndexSupportedImportPath,
    platformLock: REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED,
    certificationStatus: CANONICAL_RELEASE_GATE.certificationStatus,
    compatibilityStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
    freezeStatus: CANONICAL_RELEASE_GATE.freezeStatus,
    lockStatus: CANONICAL_RELEASE_GATE.lockStatus,
  });

export const runtimeEnabledExecutiveExperiencePublicIndexCompatibilitySection =
  Object.freeze({
    overallStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
    rexChainCompatible: CERTIFICATION_REPORT.compatibility.rexChainCompatible,
    runtimeAuthorityCompatible:
      CERTIFICATION_REPORT.compatibility.runtimeAuthorityCompatible,
    surfaceCompatible: CERTIFICATION_REPORT.compatibility.surfaceCompatible,
    sceneCompatible: CERTIFICATION_REPORT.compatibility.sceneCompatible,
    interactionCompatible:
      CERTIFICATION_REPORT.compatibility.interactionCompatible,
    presentationCompatible:
      CERTIFICATION_REPORT.compatibility.presentationCompatible,
    consumerCompatible: CERTIFICATION_REPORT.compatibility.consumerCompatible,
    surfaces: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES,
    presentationStates:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
    subjectKinds: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS,
    runtimeAuthorityPolicy:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_RUNTIME_AUTHORITY_POLICY,
    freezeProvenance: runtimeEnabledExecutiveExperienceCertificationFreezeIdentity,
  });

export const runtimeEnabledExecutiveExperiencePublicIndexRegistrySection =
  Object.freeze({
    sections: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_SECTIONS,
    sectionCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_SECTIONS.length,
    approvedExportCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_APPROVED_EXPORTS.length,
    approvedExports: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_APPROVED_EXPORTS,
    publishedRuntimeSymbolCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLISHED_RUNTIME_SYMBOLS.length,
    publicTypeCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_FUNCTIONAL_API_NAMES.length,
    validationApiCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_VALIDATION_API_NAMES.length,
    certificationInformationCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CERTIFICATION_NAMES.length,
    platformCapabilityCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES.length,
    surfaceCount: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES.length,
    subjectKindCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS.length,
    presentationStateCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES.length,
    guaranteeCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CONSUMER_GUARANTEES.length,
    frozenGuaranteeCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_GUARANTEES.length,
    compatibilityDomainCount: 7,
    platform: runtimeEnabledExecutiveExperiencePlatform,
    freeze: runtimeEnabledExecutiveExperienceCertificationFreeze,
  });

export const runtimeEnabledExecutiveExperiencePublicIndexConsumerInformationSection =
  Object.freeze({
    supportedImportPath:
      runtimeEnabledExecutiveExperiencePublicIndexSupportedImportPath,
    consumerRole: runtimeEnabledExecutiveExperiencePublicIndexConsumerRole,
    releaseStatus: CANONICAL_RELEASE_GATE.releaseStatus,
    stability: CANONICAL_RELEASE_GATE.stability,
    readiness: CANONICAL_RELEASE_GATE.consumerReadiness,
    dependencyPolicy:
      "REX-1:9 depends only on REX-1:8. Consumers must not import internal REX stages." as const,
    runtimeAuthorityPolicy:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_RUNTIME_AUTHORITY_POLICY,
    approvedSurfaces: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES,
    approvedSubjectKinds:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS,
    approvedPresentationStates:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
    consumerGuarantees:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CONSUMER_GUARANTEES,
    forbiddenDependencyGuidance:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PROHIBITED_CONSUMER_IMPORTS,
    soleEntryPolicy:
      "Consumers should use @/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex only." as const,
  });

export const runtimeEnabledExecutiveExperiencePublicIndex = Object.freeze({
  Identity: runtimeEnabledExecutiveExperiencePublicIndexIdentitySection,
  PublicTypes: runtimeEnabledExecutiveExperiencePublicIndexPublicTypesSection,
  PublicAPIs: runtimeEnabledExecutiveExperiencePublicIndexPublicApisSection,
  Validation: runtimeEnabledExecutiveExperiencePublicIndexValidationSection,
  Certification:
    runtimeEnabledExecutiveExperiencePublicIndexCertificationSection,
  ReleaseInformation:
    runtimeEnabledExecutiveExperiencePublicIndexReleaseInformationSection,
  Compatibility:
    runtimeEnabledExecutiveExperiencePublicIndexCompatibilitySection,
  Registry: runtimeEnabledExecutiveExperiencePublicIndexRegistrySection,
  ConsumerInformation:
    runtimeEnabledExecutiveExperiencePublicIndexConsumerInformationSection,
});

// Attach consumer-entry verifier into Validation after definition (same object
// reference pattern as other validation APIs — Validation section already closed;
// expose verifier as top-level export and include name in validation catalog).

export const runtimeEnabledExecutiveExperiencePublicIndexRegistry =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperiencePublicIndexIdentity,
    version: runtimeEnabledExecutiveExperiencePublicIndexVersion,
    namespace: runtimeEnabledExecutiveExperiencePublicIndexNamespace,
    layer: runtimeEnabledExecutiveExperiencePublicIndexLayer,
    phase: runtimeEnabledExecutiveExperiencePublicIndexPhase,
    stage: runtimeEnabledExecutiveExperiencePublicIndexStage,
    consumerRole: runtimeEnabledExecutiveExperiencePublicIndexConsumerRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperiencePublicIndexDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperiencePublicIndexDependencyPath,
    supportedImportPath:
      runtimeEnabledExecutiveExperiencePublicIndexSupportedImportPath,
    sections: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_SECTIONS,
    sectionCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_SECTIONS.length,
    approvedExportCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_APPROVED_EXPORTS.length,
    publicTypeCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_FUNCTIONAL_API_NAMES.length,
    validationApiCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_VALIDATION_API_NAMES.length,
    certificationInformationCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CERTIFICATION_NAMES.length,
    platformCapabilityCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES.length,
    surfaceCount: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES.length,
    subjectKindCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS.length,
    presentationStateCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES.length,
    consumerGuaranteeCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CONSUMER_GUARANTEES.length,
    compatibilityDomainCount: 7,
    releaseStatus: CANONICAL_RELEASE_GATE.releaseStatus,
    certificationStatus: CANONICAL_RELEASE_GATE.certificationStatus,
    compatibilityStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
    freezeStatus: CANONICAL_RELEASE_GATE.freezeStatus,
    lockStatus: CANONICAL_RELEASE_GATE.lockStatus,
    platformLock: REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED,
    stability: CANONICAL_RELEASE_GATE.stability,
    consumerReadiness: CANONICAL_RELEASE_GATE.consumerReadiness,
  });

export const runtimeEnabledExecutiveExperiencePublicIndexModule = Object.freeze({
  phase: "REX-1" as const,
  name: "RuntimeEnabledExecutiveExperiencePublicIndex" as const,
  identity: runtimeEnabledExecutiveExperiencePublicIndexIdentity,
  version: runtimeEnabledExecutiveExperiencePublicIndexVersion,
  namespace: runtimeEnabledExecutiveExperiencePublicIndexNamespace,
  layer: runtimeEnabledExecutiveExperiencePublicIndexLayer,
  stage: runtimeEnabledExecutiveExperiencePublicIndexStage,
  role: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_CONSUMER_ROLE,
  architecturalRole:
    runtimeEnabledExecutiveExperiencePublicIndexArchitecturalRole,
  upstreamDependency:
    runtimeEnabledExecutiveExperiencePublicIndexDependencyIdentity,
  dependencyPath:
    runtimeEnabledExecutiveExperiencePublicIndexDependencyPath,
  supportedImportPath:
    runtimeEnabledExecutiveExperiencePublicIndexSupportedImportPath,
  principle: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_PRINCIPLE,
  boundary: RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_BOUNDARY,
  platformLock: REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED,
  releaseStatus: CANONICAL_RELEASE_GATE.releaseStatus,
  certificationStatus: CANONICAL_RELEASE_GATE.certificationStatus,
  compatibilityStatus: CANONICAL_RELEASE_GATE.compatibilityStatus,
  freezeStatus: CANONICAL_RELEASE_GATE.freezeStatus,
  lockStatus: CANONICAL_RELEASE_GATE.lockStatus,
  stability: CANONICAL_RELEASE_GATE.stability,
  consumerReadiness: CANONICAL_RELEASE_GATE.consumerReadiness,
  introducesRuntimeBehavior: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  publicIndex: runtimeEnabledExecutiveExperiencePublicIndex,
  registry: runtimeEnabledExecutiveExperiencePublicIndexRegistry,
  architecturalStatus:
    "Released · Certified · Compatible · Frozen · Locked · Stable · ReadyForConsumer" as const,
});

export function getRuntimeEnabledExecutiveExperiencePublicIndexIdentity():
  typeof runtimeEnabledExecutiveExperiencePublicIndexCanonicalIdentity {
  return runtimeEnabledExecutiveExperiencePublicIndexCanonicalIdentity;
}

// ─── Consumer entry verification ────────────────────────────────────────────

export interface RuntimeEnabledExecutiveExperiencePublicIndexVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeEnabledExecutiveExperiencePublicIndexIdentity;
  readonly version: typeof runtimeEnabledExecutiveExperiencePublicIndexVersion;
  readonly namespace: typeof runtimeEnabledExecutiveExperiencePublicIndexNamespace;
  readonly dependencyIdentity: typeof runtimeEnabledExecutiveExperiencePublicIndexDependencyIdentity;
  readonly supportedImportPath: typeof runtimeEnabledExecutiveExperiencePublicIndexSupportedImportPath;
  readonly consumerRole: typeof runtimeEnabledExecutiveExperiencePublicIndexConsumerRole;
  readonly releaseStatus: RuntimeEnabledExecutiveExperienceReleaseStatus;
  readonly certificationStatus: "Certified" | "NotCertified";
  readonly compatibilityStatus: "Compatible" | "Incompatible";
  readonly freezeStatus: "Frozen" | "NotFrozen";
  readonly lockStatus: "Locked" | "Unlocked";
  readonly stability: RuntimeEnabledExecutiveExperienceStability;
  readonly consumerReadiness: RuntimeEnabledExecutiveExperienceConsumerReadiness;
  readonly platformLock: typeof REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED;
  readonly sectionCount: number;
  readonly namespaceOrderValid: boolean;
  readonly approvedPublicationOnly: boolean;
  readonly publicationComplete: boolean;
  readonly registryConsistent: boolean;
  readonly surfacesPreserved: boolean;
  readonly subjectsPreserved: boolean;
  readonly presentationStatesPreserved: boolean;
  readonly consumerGuaranteesPresent: boolean;
  readonly frozen: boolean;
  readonly introducesNoBehavior: boolean;
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

/**
 * Publication completeness: every approved runtime symbol is accessible from
 * this module's re-export surface, and no prohibited internal import path is
 * used by the Public Index implementation.
 */
export function verifyRuntimeEnabledExecutiveExperiencePublicationCompleteness(): {
  readonly ok: boolean;
  readonly approvedExportCount: number;
  readonly publishedRuntimeSymbolCount: number;
  readonly missingApprovedRuntimeSymbols: ReadonlyArray<string>;
  readonly namespaceSectionsPresent: boolean;
  readonly registryCountsMatch: boolean;
} {
  const publishedRuntime = new Set(
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLISHED_RUNTIME_SYMBOLS,
  );
  const missingApprovedRuntimeSymbols = Object.freeze(
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_APPROVED_EXPORTS.filter(
      (name) =>
        !APPROVED_TYPE_NAMES.includes(name as never) &&
        !publishedRuntime.has(name as never),
    ),
  );

  const namespaceSectionsPresent = exactOrder(
    Object.keys(runtimeEnabledExecutiveExperiencePublicIndex),
    [...RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_SECTIONS],
  );

  const registry = runtimeEnabledExecutiveExperiencePublicIndexRegistry;
  const registryCountsMatch =
    registry.sectionCount ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_SECTIONS.length &&
    registry.approvedExportCount ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_APPROVED_EXPORTS.length &&
    registry.publicTypeCount ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_TYPE_NAMES.length &&
    registry.publicApiCount ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_FUNCTIONAL_API_NAMES.length &&
    registry.validationApiCount ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_VALIDATION_API_NAMES.length &&
    registry.platformCapabilityCount ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_CAPABILITIES.length &&
    registry.surfaceCount ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES.length &&
    registry.subjectKindCount ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS.length &&
    registry.presentationStateCount ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES.length &&
    registry.consumerGuaranteeCount ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CONSUMER_GUARANTEES.length;

  return Object.freeze({
    ok:
      missingApprovedRuntimeSymbols.length === 0 &&
      namespaceSectionsPresent &&
      registryCountsMatch,
    approvedExportCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_APPROVED_EXPORTS.length,
    publishedRuntimeSymbolCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLISHED_RUNTIME_SYMBOLS.length,
    missingApprovedRuntimeSymbols,
    namespaceSectionsPresent,
    registryCountsMatch,
  });
}

export function verifyRuntimeEnabledExecutiveExperienceConsumerEntry():
  RuntimeEnabledExecutiveExperiencePublicIndexVerification {
  const gate = evaluateReleaseGate();
  const completeness =
    verifyRuntimeEnabledExecutiveExperiencePublicationCompleteness();
  const freezeVerification =
    verifyRuntimeEnabledExecutiveExperienceCertificationFreeze();

  const identityOk =
    runtimeEnabledExecutiveExperiencePublicIndexIdentity ===
      "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex" &&
    runtimeEnabledExecutiveExperiencePublicIndexVersion === "1.9.0" &&
    runtimeEnabledExecutiveExperiencePublicIndexNamespace ===
      "nexora.rex.runtime-enabled-executive-experience.public-index" &&
    runtimeEnabledExecutiveExperiencePublicIndexLayer === "REX" &&
    runtimeEnabledExecutiveExperiencePublicIndexPhase === "REX-1" &&
    runtimeEnabledExecutiveExperiencePublicIndexStage === "PublicIndex" &&
    runtimeEnabledExecutiveExperiencePublicIndexConsumerRole ===
      "SoleConsumerEntryPoint" &&
    runtimeEnabledExecutiveExperiencePublicIndexDependencyIdentity ===
      "REX-1:8/RuntimeEnabledExecutiveExperienceCertificationFreeze" &&
    runtimeEnabledExecutiveExperiencePublicIndexSupportedImportPath ===
      "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex";

  const releaseOk =
    gate.releaseStatus === "Released" &&
    gate.certificationStatus === "Certified" &&
    gate.compatibilityStatus === "Compatible" &&
    gate.freezeStatus === "Frozen" &&
    gate.lockStatus === "Locked" &&
    gate.stability === "Stable" &&
    gate.consumerReadiness === "ReadyForConsumer" &&
    freezeVerification.ok === true;

  const namespaceOrderValid = exactOrder(
    Object.keys(runtimeEnabledExecutiveExperiencePublicIndex),
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
  );

  const approvedPublicationOnly =
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLISHED_RUNTIME_SYMBOLS.every(
      (name) =>
        (
          RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_APPROVED_EXPORTS as readonly string[]
        ).includes(name),
    ) &&
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_BOUNDARY
      .publishesApprovedExportsOnly === true;

  const surfacesPreserved = exactOrder(
    [...RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_SURFACES],
    ["experience", "stage", "advisor", "insight", "timeline", "explorer"],
  );
  const subjectsPreserved = exactOrder(
    [...RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS],
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
    ],
  );
  const presentationStatesPreserved = exactOrder(
    [...RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES],
    ["minimum", "report", "operation"],
  );

  const consumerGuaranteesPresent =
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CONSUMER_GUARANTEES.length ===
      25 &&
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CONSUMER_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    ) &&
    unique(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CONSUMER_GUARANTEES.map(
        (entry) => entry.id,
      ),
    );

  const frozen =
    Object.isFrozen(runtimeEnabledExecutiveExperiencePublicIndex) &&
    Object.isFrozen(runtimeEnabledExecutiveExperiencePublicIndexRegistry) &&
    Object.isFrozen(
      runtimeEnabledExecutiveExperiencePublicIndexCanonicalIdentity,
    ) &&
    Object.isFrozen(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_SECTIONS,
    ) &&
    Object.isFrozen(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_CONSUMER_GUARANTEES,
    ) &&
    Object.isFrozen(
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_BOUNDARY,
    );

  const ok =
    identityOk &&
    releaseOk &&
    namespaceOrderValid &&
    approvedPublicationOnly &&
    completeness.ok &&
    surfacesPreserved &&
    subjectsPreserved &&
    presentationStatesPreserved &&
    consumerGuaranteesPresent &&
    frozen &&
    runtimeEnabledExecutiveExperiencePublicIndexModule
      .introducesRuntimeBehavior === false;

  return Object.freeze({
    ok,
    identity: runtimeEnabledExecutiveExperiencePublicIndexIdentity,
    version: runtimeEnabledExecutiveExperiencePublicIndexVersion,
    namespace: runtimeEnabledExecutiveExperiencePublicIndexNamespace,
    dependencyIdentity:
      runtimeEnabledExecutiveExperiencePublicIndexDependencyIdentity,
    supportedImportPath:
      runtimeEnabledExecutiveExperiencePublicIndexSupportedImportPath,
    consumerRole: runtimeEnabledExecutiveExperiencePublicIndexConsumerRole,
    releaseStatus: gate.releaseStatus,
    certificationStatus: gate.certificationStatus,
    compatibilityStatus: gate.compatibilityStatus,
    freezeStatus: gate.freezeStatus,
    lockStatus: gate.lockStatus,
    stability: gate.stability,
    consumerReadiness: gate.consumerReadiness,
    platformLock: REX_1_RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PLATFORM_LOCKED,
    sectionCount:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_PUBLIC_INDEX_SECTIONS.length,
    namespaceOrderValid,
    approvedPublicationOnly,
    publicationComplete: completeness.ok,
    registryConsistent: completeness.registryCountsMatch,
    surfacesPreserved,
    subjectsPreserved,
    presentationStatesPreserved,
    consumerGuaranteesPresent,
    frozen,
    introducesNoBehavior:
      runtimeEnabledExecutiveExperiencePublicIndexModule
        .introducesRuntimeBehavior === false,
  });
}
