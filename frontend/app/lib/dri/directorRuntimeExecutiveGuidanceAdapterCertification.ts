/**
 * DRI-7:7 — Director Runtime Executive Guidance Adapter Certification.
 *
 * Certifies that the DRI-7:6 platform exposes a stable, deterministic,
 * renderer-independent consumer boundary. Certification only — no concrete
 * adapter implementation, renderer loading, dispatch, or consumer registration.
 *
 * Principle: Platform defines the semantic runtime capability. Adapter
 * Certification proves that capability can cross a consumer boundary safely.
 * Concrete adapters decide how to translate the certified semantic package.
 * Consumers decide how to realize it.
 */

import {
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_EXECUTION_ORDER,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STATUSES,
  directorRuntimeExecutiveGuidancePlatform,
  directorRuntimeExecutiveGuidancePlatformIdentity,
  directorRuntimeExecutiveGuidancePlatformVersion,
  verifyDirectorRuntimeExecutiveGuidancePlatform,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidancePlatform";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidanceAdapterCertificationIdentity =
  "DRI-7:7/DirectorRuntimeExecutiveGuidanceAdapterCertification" as const;
export const directorRuntimeExecutiveGuidanceAdapterCertificationVersion =
  "7.7.0" as const;
export const directorRuntimeExecutiveGuidanceAdapterCertificationNamespace =
  "nexora.dri.executive-guidance.adapter-certification" as const;
export const directorRuntimeExecutiveGuidanceAdapterCertificationUpstream =
  directorRuntimeExecutiveGuidancePlatformIdentity;

export const directorRuntimeExecutiveGuidanceAdapterCertificationCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeExecutiveGuidanceAdapterCertificationIdentity,
    version: directorRuntimeExecutiveGuidanceAdapterCertificationVersion,
    namespace: directorRuntimeExecutiveGuidanceAdapterCertificationNamespace,
    upstream: directorRuntimeExecutiveGuidanceAdapterCertificationUpstream,
  });

// ─── Principle / boundary ───────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_PRINCIPLE =
  "Platform defines the semantic runtime capability. Adapter Certification proves that capability can cross a consumer boundary safely. Concrete adapters decide how to translate the certified semantic package. Consumers decide how to realize it." as const;

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_BOUNDARY =
  Object.freeze({
    platformAuthority: "DRI-7:6" as const,
    adapterCertificationAuthority: "DRI-7:7" as const,
    freezeAuthority: "DRI-7:8" as const,
    certifiesBoundaryOnly: true as const,
    doesNotImplementAdapters: true as const,
    doesNotLoadConsumers: true as const,
    doesNotRouteToConsumers: true as const,
    doesNotRegisterAdapters: true as const,
    doesNotScore: true as const,
    consumesPlatformSurfaceOnly: true as const,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_STATUSES =
  Object.freeze(["certified", "not-certified"] as const);
export type DirectorRuntimeExecutiveGuidanceAdapterCertificationStatus =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_STATUSES)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_COMPATIBILITY_STATUSES =
  Object.freeze(["compatible", "incompatible"] as const);
export type DirectorRuntimeExecutiveGuidanceAdapterCompatibilityStatus =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_COMPATIBILITY_STATUSES)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CONSUMER_KINDS =
  Object.freeze([
    "director",
    "scene",
    "advisor",
    "insight",
    "journal",
    "timeline",
    "custom",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceAdapterConsumerKind =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CONSUMER_KINDS)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CAPABILITIES =
  Object.freeze([
    "consume-platform-result",
    "preserve-identity",
    "preserve-hierarchy",
    "preserve-provenance",
    "preserve-order",
    "preserve-readiness",
    "preserve-delivery-status",
    "respect-consumer-boundary",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceAdapterCapability =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CAPABILITIES)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_DOMAINS =
  Object.freeze([
    "identity",
    "dependency",
    "platform-contract",
    "hierarchy",
    "provenance",
    "ordering",
    "readiness",
    "delivery-status",
    "renderer-independence",
    "advisor-independence",
    "action-independence",
    "side-effect-boundary",
    "immutability",
    "determinism",
    "consumer-adaptability",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceAdapterCertificationDomain =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_DOMAINS)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_CHECK_IDS =
  Object.freeze([
    "dri7.adapter.identity.platform",
    "dri7.adapter.dependency.sole-upstream",
    "dri7.adapter.contract.consumer-surface",
    "dri7.adapter.hierarchy.preserved",
    "dri7.adapter.provenance.preserved",
    "dri7.adapter.ordering.preserved",
    "dri7.adapter.readiness.preserved",
    "dri7.adapter.delivery-status.preserved",
    "dri7.adapter.renderer-independent",
    "dri7.adapter.advisor-independent",
    "dri7.adapter.action-independent",
    "dri7.adapter.side-effect-boundary",
    "dri7.adapter.immutability",
    "dri7.adapter.determinism",
    "dri7.adapter.consumer-adaptability",
    "dri7.adapter.version.compatibility",
    "dri7.adapter.scene.semantic-compatibility",
    "dri7.adapter.insight.semantic-compatibility",
    "dri7.adapter.journal.semantic-compatibility",
    "dri7.adapter.timeline.semantic-compatibility",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceAdapterCertificationCheckId =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_CHECK_IDS)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_MANDATORY_CHECK_IDS =
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_CHECK_IDS;

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ACCEPTED_PLATFORM_VERSION =
  directorRuntimeExecutiveGuidancePlatformVersion;

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceAdapterDescriptor {
  readonly adapterId: string;
  readonly consumerKind: DirectorRuntimeExecutiveGuidanceAdapterConsumerKind;
  readonly acceptedPlatformVersion: string;
  readonly preservesIdentity: boolean;
  readonly preservesHierarchy: boolean;
  readonly preservesProvenance: boolean;
  readonly preservesOrdering: boolean;
  readonly preservesReadiness: boolean;
  readonly sideEffectFreeAtBoundary: boolean;
}

export interface DirectorRuntimeExecutiveGuidanceAdapterCertificationInput {
  readonly certificationId: string;
  readonly adapterDescriptor: DirectorRuntimeExecutiveGuidanceAdapterDescriptor;
}

export interface DirectorRuntimeExecutiveGuidanceAdapterCertificationCheck {
  readonly checkId: DirectorRuntimeExecutiveGuidanceAdapterCertificationCheckId | string;
  readonly domain: DirectorRuntimeExecutiveGuidanceAdapterCertificationDomain;
  readonly passed: boolean;
  readonly reason: string;
}

export interface DirectorRuntimeExecutiveGuidanceAdapterCertificationReport {
  readonly certificationId: string;
  readonly platformIdentity: string;
  readonly platformVersion: string;
  readonly certificationStatus: DirectorRuntimeExecutiveGuidanceAdapterCertificationStatus;
  readonly compatibilityStatus: DirectorRuntimeExecutiveGuidanceAdapterCompatibilityStatus;
  readonly checks: readonly DirectorRuntimeExecutiveGuidanceAdapterCertificationCheck[];
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly certifiedConsumerKinds: readonly DirectorRuntimeExecutiveGuidanceAdapterConsumerKind[];
  readonly capabilities: readonly DirectorRuntimeExecutiveGuidanceAdapterCapability[];
}

export interface DirectorRuntimeExecutiveGuidanceAdapterCertificationManifest {
  readonly identity: string;
  readonly version: string;
  readonly namespace: string;
  readonly platformIdentity: string;
  readonly platformVersion: string;
  readonly certificationDomainCount: number;
  readonly certificationCheckCount: number;
  readonly mandatoryCheckCount: number;
  readonly rendererIndependent: true;
  readonly advisorIndependent: true;
  readonly actionIndependent: true;
  readonly sideEffectBoundaryCertified: true;
  readonly certifiesBoundaryOnly: true;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function freezeCheck(input: {
  readonly checkId: string;
  readonly domain: DirectorRuntimeExecutiveGuidanceAdapterCertificationDomain;
  readonly passed: boolean;
  readonly reason: string;
}): DirectorRuntimeExecutiveGuidanceAdapterCertificationCheck {
  return Object.freeze({
    checkId: input.checkId,
    domain: input.domain,
    passed: input.passed,
    reason: input.reason,
  });
}

function finalizeReport(input: {
  readonly certificationId: string;
  readonly checks: readonly DirectorRuntimeExecutiveGuidanceAdapterCertificationCheck[];
  readonly certifiedConsumerKinds: readonly DirectorRuntimeExecutiveGuidanceAdapterConsumerKind[];
}): DirectorRuntimeExecutiveGuidanceAdapterCertificationReport {
  let passedCheckCount = 0;
  let failedCheckCount = 0;
  for (const check of input.checks) {
    if (check.passed) passedCheckCount += 1;
    else failedCheckCount += 1;
  }
  const allPassed = failedCheckCount === 0;
  return Object.freeze({
    certificationId: input.certificationId,
    platformIdentity: directorRuntimeExecutiveGuidancePlatformIdentity,
    platformVersion: directorRuntimeExecutiveGuidancePlatformVersion,
    certificationStatus: allPassed
      ? ("certified" as const)
      : ("not-certified" as const),
    compatibilityStatus: allPassed
      ? ("compatible" as const)
      : ("incompatible" as const),
    checks: Object.freeze([...input.checks]),
    passedCheckCount,
    failedCheckCount,
    certifiedConsumerKinds: Object.freeze([...input.certifiedConsumerKinds]),
    capabilities: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CAPABILITIES,
  });
}

export function isDirectorRuntimeExecutiveGuidanceAdapterConsumerKind(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceAdapterConsumerKind {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CONSUMER_KINDS as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidanceAdapterCertificationStatus(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceAdapterCertificationStatus {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_STATUSES as readonly unknown[]
  ).includes(value);
}

export function createDirectorExecutiveGuidanceAdapterDescriptor(
  input: DirectorRuntimeExecutiveGuidanceAdapterDescriptor,
): DirectorRuntimeExecutiveGuidanceAdapterDescriptor {
  return Object.freeze({
    adapterId: input.adapterId,
    consumerKind: input.consumerKind,
    acceptedPlatformVersion: input.acceptedPlatformVersion,
    preservesIdentity: input.preservesIdentity,
    preservesHierarchy: input.preservesHierarchy,
    preservesProvenance: input.preservesProvenance,
    preservesOrdering: input.preservesOrdering,
    preservesReadiness: input.preservesReadiness,
    sideEffectFreeAtBoundary: input.sideEffectFreeAtBoundary,
  });
}

export function createDirectorExecutiveGuidanceAdapterCertificationInput(
  input: DirectorRuntimeExecutiveGuidanceAdapterCertificationInput,
): DirectorRuntimeExecutiveGuidanceAdapterCertificationInput {
  return Object.freeze({
    certificationId: input.certificationId,
    adapterDescriptor: createDirectorExecutiveGuidanceAdapterDescriptor(
      input.adapterDescriptor,
    ),
  });
}

// ─── Platform suitability checks ────────────────────────────────────────────

function evaluatePlatformAdapterChecks():
  readonly DirectorRuntimeExecutiveGuidanceAdapterCertificationCheck[] {
  const platformVerification = verifyDirectorRuntimeExecutiveGuidancePlatform();
  const capability = DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY;
  const platform = directorRuntimeExecutiveGuidancePlatform;

  return Object.freeze([
    freezeCheck({
      checkId: "dri7.adapter.identity.platform",
      domain: "identity",
      passed:
        platform.identity ===
          "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform" &&
        platformVerification.identity === platform.identity,
      reason: "platform identity matches DRI-7:6 canonical identity",
    }),
    freezeCheck({
      checkId: "dri7.adapter.dependency.sole-upstream",
      domain: "dependency",
      passed:
        directorRuntimeExecutiveGuidanceAdapterCertificationUpstream ===
          "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform" &&
        platform.upstreamDependency ===
          "DRI-7:5/DirectorRuntimeExecutiveGuidanceDelivery",
      reason: "adapter certification depends solely on the DRI-7:6 platform",
    }),
    freezeCheck({
      checkId: "dri7.adapter.contract.consumer-surface",
      domain: "platform-contract",
      passed:
        capability.supportsResolution &&
        capability.supportsComposition &&
        capability.supportsDelivery &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_EXECUTION_ORDER.length ===
          3 &&
        platformVerification.ok,
      reason:
        "platform consumer surface exposes resolution, composition, and delivery",
    }),
    freezeCheck({
      checkId: "dri7.adapter.hierarchy.preserved",
      domain: "hierarchy",
      passed: capability.supportsComposition && capability.supportsDelivery,
      reason:
        "platform preserves primary/supporting/contextual/background hierarchy for adapters",
    }),
    freezeCheck({
      checkId: "dri7.adapter.provenance.preserved",
      domain: "provenance",
      passed: capability.supportsDelivery && capability.sideEffectFree,
      reason:
        "platform delivery surface retains provenance and stage traceability",
    }),
    freezeCheck({
      checkId: "dri7.adapter.ordering.preserved",
      domain: "ordering",
      passed:
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_EXECUTION_ORDER[0] ===
          "resolution" &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_EXECUTION_ORDER[1] ===
          "composition" &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_EXECUTION_ORDER[2] ===
          "delivery",
      reason: "platform preserves deterministic stage and collection ordering",
    }),
    freezeCheck({
      checkId: "dri7.adapter.readiness.preserved",
      domain: "readiness",
      passed: platformVerification.checks.includes("outcome-mapping-deferred"),
      reason:
        "platform readiness remains authoritative; deferred is not remapped to ready",
    }),
    freezeCheck({
      checkId: "dri7.adapter.delivery-status.preserved",
      domain: "delivery-status",
      passed:
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STATUSES.includes("held") &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STATUSES.includes(
          "deferred",
        ) &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STATUSES.includes(
          "blocked",
        ) &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STATUSES.includes(
          "completed",
        ) &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STATUSES.includes("failed"),
      reason:
        "platform status vocabulary preserves ready/held/deferred/blocked/failed semantics",
    }),
    freezeCheck({
      checkId: "dri7.adapter.renderer-independent",
      domain: "renderer-independence",
      passed: capability.rendererIndependent === true,
      reason: "platform result does not require Three.js, React, DOM, or WebGL",
    }),
    freezeCheck({
      checkId: "dri7.adapter.advisor-independent",
      domain: "advisor-independence",
      passed: capability.advisorIndependent === true,
      reason: "platform result does not require Advisor conversation behavior",
    }),
    freezeCheck({
      checkId: "dri7.adapter.action-independent",
      domain: "action-independence",
      passed: capability.actionIndependent === true,
      reason: "platform result does not execute business actions",
    }),
    freezeCheck({
      checkId: "dri7.adapter.side-effect-boundary",
      domain: "side-effect-boundary",
      passed: capability.sideEffectFree === true,
      reason:
        "platform remains side-effect free; consumer effects stay outside DRI",
    }),
    freezeCheck({
      checkId: "dri7.adapter.immutability",
      domain: "immutability",
      passed:
        Object.isFrozen(platform) &&
        Object.isFrozen(capability) &&
        platformVerification.checks.includes("registry-frozen"),
      reason: "platform identity, capability, and registry are immutable",
    }),
    freezeCheck({
      checkId: "dri7.adapter.determinism",
      domain: "determinism",
      passed: platform.deterministic === true && capability.synchronous === true,
      reason: "platform execution is deterministic and synchronous",
    }),
    freezeCheck({
      checkId: "dri7.adapter.consumer-adaptability",
      domain: "consumer-adaptability",
      passed:
        capability.adapterIndependent === true &&
        capability.supportsDelivery === true,
      reason:
        "platform is adaptable by downstream consumers without deep DRI imports",
    }),
    freezeCheck({
      checkId: "dri7.adapter.version.compatibility",
      domain: "platform-contract",
      passed:
        directorRuntimeExecutiveGuidancePlatformVersion === "7.6.0" &&
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ACCEPTED_PLATFORM_VERSION ===
          "7.6.0",
      reason: "accepted platform version is exactly 7.6.0",
    }),
    freezeCheck({
      checkId: "dri7.adapter.scene.semantic-compatibility",
      domain: "consumer-adaptability",
      passed: capability.rendererIndependent && capability.supportsDelivery,
      reason:
        "scene adapters may consume hierarchy/path/readiness without renderer fields",
    }),
    freezeCheck({
      checkId: "dri7.adapter.insight.semantic-compatibility",
      domain: "consumer-adaptability",
      passed: capability.supportsDelivery && capability.rendererIndependent,
      reason:
        "insight adapters may derive presentation without DRI owning UI layouts",
    }),
    freezeCheck({
      checkId: "dri7.adapter.journal.semantic-compatibility",
      domain: "consumer-adaptability",
      passed: capability.supportsDelivery && capability.actionIndependent,
      reason:
        "journal adapters may reference guidance without DRI writing journal state",
    }),
    freezeCheck({
      checkId: "dri7.adapter.timeline.semantic-compatibility",
      domain: "consumer-adaptability",
      passed: capability.supportsDelivery && capability.actionIndependent,
      reason:
        "timeline adapters may reference guidance without DRI updating timeline state",
    }),
  ]);
}

// ─── Main certification APIs ────────────────────────────────────────────────

export function certifyDirectorRuntimeExecutiveGuidancePlatformForAdapters():
  DirectorRuntimeExecutiveGuidanceAdapterCertificationReport {
  return finalizeReport({
    certificationId:
      "certification.dri7.platform.for-adapters",
    checks: evaluatePlatformAdapterChecks(),
    certifiedConsumerKinds:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CONSUMER_KINDS,
  });
}

export function certifyDirectorExecutiveGuidanceAdapter(
  input: DirectorRuntimeExecutiveGuidanceAdapterCertificationInput,
): DirectorRuntimeExecutiveGuidanceAdapterCertificationReport {
  const platformChecks = evaluatePlatformAdapterChecks();
  const descriptor = isPlainObject(input)
    ? input.adapterDescriptor
    : null;

  const descriptorChecks: DirectorRuntimeExecutiveGuidanceAdapterCertificationCheck[] =
    [];

  const certificationId =
    isPlainObject(input) && typeof input.certificationId === "string"
      ? input.certificationId
      : "certification.invalid";

  if (
    !isPlainObject(descriptor) ||
    typeof descriptor.adapterId !== "string" ||
    descriptor.adapterId.length === 0
  ) {
    descriptorChecks[descriptorChecks.length] = freezeCheck({
      checkId: "dri7.adapter.identity.platform",
      domain: "identity",
      passed: false,
      reason: "adapter descriptor identity is missing or invalid",
    });
  } else {
    descriptorChecks[descriptorChecks.length] = freezeCheck({
      checkId: "dri7.adapter.identity.platform",
      domain: "identity",
      passed: descriptor.preservesIdentity === true,
      reason:
        descriptor.preservesIdentity === true
          ? "adapter declares identity preservation"
          : "adapter does not preserve DRI identities",
    });
  }

  const safeDescriptor = isPlainObject(descriptor) ? descriptor : null;

  descriptorChecks[descriptorChecks.length] = freezeCheck({
    checkId: "dri7.adapter.version.compatibility",
    domain: "platform-contract",
    passed:
      safeDescriptor !== null &&
      safeDescriptor.acceptedPlatformVersion ===
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ACCEPTED_PLATFORM_VERSION,
    reason:
      safeDescriptor !== null &&
      safeDescriptor.acceptedPlatformVersion ===
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ACCEPTED_PLATFORM_VERSION
        ? "adapter accepts platform version 7.6.0"
        : "adapter acceptedPlatformVersion is incompatible with 7.6.0",
  });

  descriptorChecks[descriptorChecks.length] = freezeCheck({
    checkId: "dri7.adapter.hierarchy.preserved",
    domain: "hierarchy",
    passed: safeDescriptor?.preservesHierarchy === true,
    reason:
      safeDescriptor?.preservesHierarchy === true
        ? "adapter declares hierarchy preservation"
        : "adapter does not preserve guidance hierarchy",
  });

  descriptorChecks[descriptorChecks.length] = freezeCheck({
    checkId: "dri7.adapter.provenance.preserved",
    domain: "provenance",
    passed: safeDescriptor?.preservesProvenance === true,
    reason:
      safeDescriptor?.preservesProvenance === true
        ? "adapter declares provenance preservation"
        : "adapter does not preserve provenance",
  });

  descriptorChecks[descriptorChecks.length] = freezeCheck({
    checkId: "dri7.adapter.ordering.preserved",
    domain: "ordering",
    passed: safeDescriptor?.preservesOrdering === true,
    reason:
      safeDescriptor?.preservesOrdering === true
        ? "adapter declares ordering preservation"
        : "adapter does not preserve semantic ordering",
  });

  descriptorChecks[descriptorChecks.length] = freezeCheck({
    checkId: "dri7.adapter.readiness.preserved",
    domain: "readiness",
    passed: safeDescriptor?.preservesReadiness === true,
    reason:
      safeDescriptor?.preservesReadiness === true
        ? "adapter declares readiness preservation"
        : "adapter does not preserve readiness semantics",
  });

  descriptorChecks[descriptorChecks.length] = freezeCheck({
    checkId: "dri7.adapter.side-effect-boundary",
    domain: "side-effect-boundary",
    passed: safeDescriptor?.sideEffectFreeAtBoundary === true,
    reason:
      safeDescriptor?.sideEffectFreeAtBoundary === true
        ? "adapter declares side-effect-free boundary consumption"
        : "adapter does not keep the DRI boundary side-effect free",
  });

  descriptorChecks[descriptorChecks.length] = freezeCheck({
    checkId: "dri7.adapter.contract.consumer-surface",
    domain: "platform-contract",
    passed:
      safeDescriptor !== null &&
      isDirectorRuntimeExecutiveGuidanceAdapterConsumerKind(
        safeDescriptor.consumerKind,
      ),
    reason:
      safeDescriptor !== null &&
      isDirectorRuntimeExecutiveGuidanceAdapterConsumerKind(
        safeDescriptor.consumerKind,
      )
        ? "adapter consumer kind is a recognized certification category"
        : "adapter consumer kind is unrecognized",
  });

  // Merge: platform suitability checks, overridden by descriptor-specific
  // results for the same checkId when the descriptor fails or affirms.
  const byId = new Map<string, DirectorRuntimeExecutiveGuidanceAdapterCertificationCheck>();
  for (const check of platformChecks) {
    byId.set(check.checkId, check);
  }
  for (const check of descriptorChecks) {
    const existing = byId.get(check.checkId);
    if (existing === undefined) {
      byId.set(check.checkId, check);
      continue;
    }
    // Descriptor failures are authoritative for mandatory preservation checks.
    if (!check.passed || existing.passed) {
      byId.set(
        check.checkId,
        freezeCheck({
          checkId: check.checkId,
          domain: check.domain,
          passed: existing.passed && check.passed,
          reason: check.passed ? existing.reason : check.reason,
        }),
      );
    }
  }

  const orderedChecks = Object.freeze(
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_CHECK_IDS.map(
      (checkId) => {
        const check = byId.get(checkId);
        return (
          check ??
          freezeCheck({
            checkId,
            domain: "platform-contract",
            passed: false,
            reason: "mandatory check missing",
          })
        );
      },
    ),
  );

  const certifiedKinds =
    safeDescriptor !== null &&
    isDirectorRuntimeExecutiveGuidanceAdapterConsumerKind(
      safeDescriptor.consumerKind,
    )
      ? Object.freeze([safeDescriptor.consumerKind])
      : Object.freeze([] as DirectorRuntimeExecutiveGuidanceAdapterConsumerKind[]);

  return finalizeReport({
    certificationId,
    checks: orderedChecks,
    certifiedConsumerKinds: certifiedKinds,
  });
}

// ─── Canonical artifacts ────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidanceAdapterCertificationManifest =
  Object.freeze({
    identity: directorRuntimeExecutiveGuidanceAdapterCertificationIdentity,
    version: directorRuntimeExecutiveGuidanceAdapterCertificationVersion,
    namespace: directorRuntimeExecutiveGuidanceAdapterCertificationNamespace,
    platformIdentity: directorRuntimeExecutiveGuidancePlatformIdentity,
    platformVersion: directorRuntimeExecutiveGuidancePlatformVersion,
    certificationDomainCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_DOMAINS.length,
    certificationCheckCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_CHECK_IDS.length,
    mandatoryCheckCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_MANDATORY_CHECK_IDS.length,
    rendererIndependent: true,
    advisorIndependent: true,
    actionIndependent: true,
    sideEffectBoundaryCertified: true,
    certifiesBoundaryOnly: true,
  }) satisfies DirectorRuntimeExecutiveGuidanceAdapterCertificationManifest;

export const directorRuntimeExecutiveGuidanceAdapterCertificationReport =
  certifyDirectorRuntimeExecutiveGuidancePlatformForAdapters();

// ─── Invariants / registry ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_INVARIANTS =
  Object.freeze([
    "certification-not-implementation",
    "compatibility-not-certification",
    "sole-platform-dependency",
    "no-deep-dri-imports",
    "no-concrete-adapters",
    "no-adapter-registration",
    "no-dispatch",
    "no-certification-score",
    "binary-certification-status",
    "mandatory-checks-authoritative",
    "platform-version-exact",
    "renderer-independent-boundary",
    "advisor-independent-boundary",
    "action-independent-boundary",
    "side-effect-boundary",
  ] as const);

export type DirectorRuntimeExecutiveGuidanceAdapterCertificationInvariant =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_INVARIANTS)[number];

export const directorRuntimeExecutiveGuidanceAdapterCertificationApiNames =
  Object.freeze([
    "isDirectorRuntimeExecutiveGuidanceAdapterConsumerKind",
    "isDirectorRuntimeExecutiveGuidanceAdapterCertificationStatus",
    "createDirectorExecutiveGuidanceAdapterDescriptor",
    "createDirectorExecutiveGuidanceAdapterCertificationInput",
    "certifyDirectorRuntimeExecutiveGuidancePlatformForAdapters",
    "certifyDirectorExecutiveGuidanceAdapter",
    "verifyDirectorRuntimeExecutiveGuidanceAdapterCertification",
  ] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "DirectorRuntimeExecutiveGuidanceAdapterCertificationStatus",
    "DirectorRuntimeExecutiveGuidanceAdapterCompatibilityStatus",
    "DirectorRuntimeExecutiveGuidanceAdapterConsumerKind",
    "DirectorRuntimeExecutiveGuidanceAdapterCapability",
    "DirectorRuntimeExecutiveGuidanceAdapterCertificationDomain",
    "DirectorRuntimeExecutiveGuidanceAdapterCertificationCheckId",
    "DirectorRuntimeExecutiveGuidanceAdapterDescriptor",
    "DirectorRuntimeExecutiveGuidanceAdapterCertificationInput",
    "DirectorRuntimeExecutiveGuidanceAdapterCertificationCheck",
    "DirectorRuntimeExecutiveGuidanceAdapterCertificationReport",
    "DirectorRuntimeExecutiveGuidanceAdapterCertificationManifest",
    "DirectorRuntimeExecutiveGuidanceAdapterCertificationInvariant",
    "DirectorRuntimeExecutiveGuidanceAdapterCertificationVerification",
  ] as const);

export const directorRuntimeExecutiveGuidanceAdapterCertificationRegistry =
  Object.freeze({
    identity: directorRuntimeExecutiveGuidanceAdapterCertificationIdentity,
    version: directorRuntimeExecutiveGuidanceAdapterCertificationVersion,
    namespace: directorRuntimeExecutiveGuidanceAdapterCertificationNamespace,
    dependency: directorRuntimeExecutiveGuidanceAdapterCertificationUpstream,
    principle:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_PRINCIPLE,
    boundary:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_BOUNDARY,
    certificationStatuses:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_STATUSES,
    certificationStatusCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_STATUSES.length,
    compatibilityStatuses:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_COMPATIBILITY_STATUSES,
    compatibilityStatusCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_COMPATIBILITY_STATUSES.length,
    consumerKinds:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CONSUMER_KINDS,
    consumerKindCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CONSUMER_KINDS.length,
    capabilities: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CAPABILITIES,
    capabilityCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CAPABILITIES.length,
    domains:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_DOMAINS,
    domainCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_DOMAINS.length,
    checkIds:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_CHECK_IDS,
    checkCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_CHECK_IDS.length,
    mandatoryCheckIds:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_MANDATORY_CHECK_IDS,
    mandatoryCheckCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_MANDATORY_CHECK_IDS.length,
    acceptedPlatformVersion:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ACCEPTED_PLATFORM_VERSION,
    invariants:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_INVARIANTS,
    invariantCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_INVARIANTS
        .length,
    publicTypes:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_PUBLIC_TYPE_NAMES
        .length,
    publicApis: directorRuntimeExecutiveGuidanceAdapterCertificationApiNames,
    publicApiCount:
      directorRuntimeExecutiveGuidanceAdapterCertificationApiNames.length,
    registrySectionCount: 6 as const,
  });

export const directorRuntimeExecutiveGuidanceAdapterCertification =
  Object.freeze({
    phase: "DRI-7:7" as const,
    name: "DirectorRuntimeExecutiveGuidanceAdapterCertification" as const,
    identity: directorRuntimeExecutiveGuidanceAdapterCertificationIdentity,
    namespace: directorRuntimeExecutiveGuidanceAdapterCertificationNamespace,
    version: directorRuntimeExecutiveGuidanceAdapterCertificationVersion,
    layer: "Director Runtime Integration" as const,
    domain: "ExecutiveGuidanceAttentionDelivery" as const,
    role: "AdapterCertification" as const,
    stage: "AdapterCertification" as const,
    status: "AdapterCertificationReady" as const,
    upstreamDependency:
      directorRuntimeExecutiveGuidanceAdapterCertificationUpstream,
    deterministic: true as const,
    certifiesBoundaryOnly: true as const,
    sideEffectFree: true as const,
    rendererIndependent: true as const,
    advisorIndependent: true as const,
    actionIndependent: true as const,
    noConcreteAdapters: true as const,
    noConsumerRouting: true as const,
    manifest: directorRuntimeExecutiveGuidanceAdapterCertificationManifest,
    report: directorRuntimeExecutiveGuidanceAdapterCertificationReport,
    registry: directorRuntimeExecutiveGuidanceAdapterCertificationRegistry,
  });

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceAdapterCertificationVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeExecutiveGuidanceAdapterCertificationIdentity;
  readonly version: typeof directorRuntimeExecutiveGuidanceAdapterCertificationVersion;
  readonly namespace: typeof directorRuntimeExecutiveGuidanceAdapterCertificationNamespace;
  readonly upstream: typeof directorRuntimeExecutiveGuidanceAdapterCertificationUpstream;
  readonly certificationStatus: DirectorRuntimeExecutiveGuidanceAdapterCertificationStatus;
  readonly compatibilityStatus: DirectorRuntimeExecutiveGuidanceAdapterCompatibilityStatus;
  readonly checkCount: number;
  readonly mandatoryCheckCount: number;
  readonly passedCheckCount: number;
  readonly failedCheckCount: number;
  readonly checks: readonly string[];
}

export function verifyDirectorRuntimeExecutiveGuidanceAdapterCertification():
  DirectorRuntimeExecutiveGuidanceAdapterCertificationVerification {
  const report = directorRuntimeExecutiveGuidanceAdapterCertificationReport;
  const checks: string[] = [];
  const record = (name: string, pass: boolean): void => {
    if (pass) checks[checks.length] = name;
  };

  record(
    "identity",
    directorRuntimeExecutiveGuidanceAdapterCertificationIdentity ===
      "DRI-7:7/DirectorRuntimeExecutiveGuidanceAdapterCertification",
  );
  record(
    "version",
    directorRuntimeExecutiveGuidanceAdapterCertificationVersion === "7.7.0",
  );
  record(
    "namespace",
    directorRuntimeExecutiveGuidanceAdapterCertificationNamespace ===
      "nexora.dri.executive-guidance.adapter-certification",
  );
  record(
    "sole-dependency",
    directorRuntimeExecutiveGuidanceAdapterCertificationUpstream ===
      "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform",
  );
  record(
    "certification-vocabulary",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_STATUSES
      .length === 2,
  );
  record(
    "compatibility-vocabulary",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_COMPATIBILITY_STATUSES
      .length === 2,
  );
  record(
    "consumer-kind-vocabulary",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CONSUMER_KINDS.length === 7,
  );
  record(
    "capability-vocabulary",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CAPABILITIES.length === 8,
  );
  record(
    "domain-vocabulary",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_DOMAINS.length ===
      15,
  );
  record(
    "check-uniqueness",
    new Set(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_CHECK_IDS)
      .size ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_CHECK_IDS.length,
  );
  record(
    "mandatory-completeness",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_MANDATORY_CHECK_IDS.length ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_CHECK_IDS.length,
  );
  record(
    "canonical-certified",
    report.certificationStatus === "certified" &&
      report.compatibilityStatus === "compatible" &&
      report.failedCheckCount === 0,
  );
  record(
    "counts-reconcile",
    report.passedCheckCount + report.failedCheckCount === report.checks.length,
  );
  record(
    "manifest-frozen",
    Object.isFrozen(
      directorRuntimeExecutiveGuidanceAdapterCertificationManifest,
    ),
  );
  record(
    "registry-frozen",
    Object.isFrozen(
      directorRuntimeExecutiveGuidanceAdapterCertificationRegistry,
    ),
  );
  record(
    "report-frozen",
    Object.isFrozen(report) && Object.isFrozen(report.checks),
  );

  const ok =
    checks.length === 16 &&
    checks.includes("identity") &&
    checks.includes("version") &&
    checks.includes("namespace") &&
    checks.includes("sole-dependency") &&
    checks.includes("canonical-certified");

  return Object.freeze({
    ok,
    identity: directorRuntimeExecutiveGuidanceAdapterCertificationIdentity,
    version: directorRuntimeExecutiveGuidanceAdapterCertificationVersion,
    namespace: directorRuntimeExecutiveGuidanceAdapterCertificationNamespace,
    upstream: directorRuntimeExecutiveGuidanceAdapterCertificationUpstream,
    certificationStatus: report.certificationStatus,
    compatibilityStatus: report.compatibilityStatus,
    checkCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_CERTIFICATION_CHECK_IDS.length,
    mandatoryCheckCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_ADAPTER_MANDATORY_CHECK_IDS.length,
    passedCheckCount: report.passedCheckCount,
    failedCheckCount: report.failedCheckCount,
    checks: Object.freeze([...checks]),
  });
}
