import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as platformSurface from "./directorRuntimeIntegrationPlatform.ts";
import {
  DIRECTOR_RUNTIME_INTEGRATION_FREEZE_ISSUE_CODES,
  DIRECTOR_RUNTIME_INTEGRATION_FREEZE_STATES,
  DIRECTOR_RUNTIME_INTEGRATION_RELEASE_STATUSES,
  DIRECTOR_RUNTIME_INTEGRATION_STABILITY_STATUSES,
  createDirectorRuntimeIntegrationPlatform,
  createDirectorRuntimeIntegrationPlatformFreeze,
  directorRuntimeCanonicalFreezeCandidate,
  directorRuntimeIntegrationFreezeCompatibility,
  directorRuntimeIntegrationFreezeConsumerRuleCount,
  directorRuntimeIntegrationFreezeConsumerRules,
  directorRuntimeIntegrationFreezeGuaranteeCount,
  directorRuntimeIntegrationFreezeGuarantees,
  directorRuntimeIntegrationFreezeRegistry,
  directorRuntimeIntegrationFreezeRegistryCount,
  directorRuntimeIntegrationFreezeReleaseInformation,
  directorRuntimeIntegrationFrozenIdentityChain,
  directorRuntimeIntegrationFrozenIdentityChainCount,
  directorRuntimeIntegrationFrozenPlatformGuaranteeCount,
  directorRuntimeIntegrationFrozenPlatformGuarantees,
  directorRuntimeIntegrationFrozenPlatformLimitationCount,
  directorRuntimeIntegrationFrozenPlatformLimitations,
  directorRuntimeIntegrationFrozenPublicApiCount,
  directorRuntimeIntegrationFrozenPublicApiSurface,
  directorRuntimeIntegrationPlatform,
  directorRuntimeIntegrationPlatformCapabilityRegistry,
  directorRuntimeIntegrationPlatformFreeze,
  directorRuntimeIntegrationPlatformFreezeIdentity,
  directorRuntimeIntegrationPlatformFreezeNamespace,
  directorRuntimeIntegrationPlatformFreezeUpstream,
  directorRuntimeIntegrationPlatformFreezeVersion,
  directorRuntimeIntegrationPlatformIdentity,
  directorRuntimeIntegrationPlatformLock,
  directorRuntimeIntegrationPlatformRegistry,
  directorRuntimeIntegrationPublicIndexReadiness,
  getDirectorRuntimeIntegrationFreezeCompatibility,
  getDirectorRuntimeIntegrationFreezeConsumerRules,
  getDirectorRuntimeIntegrationFreezeRegistry,
  getDirectorRuntimeIntegrationFrozenPublicApiSurface,
  getDirectorRuntimeIntegrationPlatformFreezeManifest,
  getDirectorRuntimeIntegrationPlatformLock,
  isDirectorRuntimeIntegrationFreezeState,
  isDirectorRuntimeIntegrationReleaseStatus,
  isDirectorRuntimeIntegrationStabilityStatus,
  resolveDirectorRuntimeIntegrationFreezeEligibility,
  resolveDirectorRuntimeIntegrationPlatformReadiness,
  verifyDirectorRuntimeIntegrationPlatform,
  verifyDirectorRuntimeIntegrationPlatformFreeze,
  type DirectorRuntimeIntegrationFreezeCandidate,
} from "./directorRuntimeIntegrationPlatformFreeze.ts";

const sourceText = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "directorRuntimeIntegrationPlatformFreeze.ts"),
  "utf8",
);

function candidate(
  overrides: Partial<DirectorRuntimeIntegrationFreezeCandidate> = {},
): DirectorRuntimeIntegrationFreezeCandidate {
  const base = structuredClone(directorRuntimeCanonicalFreezeCandidate);
  return {
    ...base,
    ...overrides,
    platform: overrides.platform ?? base.platform,
    identityChain: overrides.identityChain ?? base.identityChain,
    guarantees: overrides.guarantees ?? base.guarantees,
    limitations: overrides.limitations ?? base.limitations,
    publicApiSurface: overrides.publicApiSurface ?? base.publicApiSurface,
    platformRegistry: overrides.platformRegistry ?? base.platformRegistry,
    compatibility: overrides.compatibility ?? base.compatibility,
  };
}

function withPlatform(
  mutation: (platform: typeof directorRuntimeIntegrationPlatform) => typeof directorRuntimeIntegrationPlatform,
): DirectorRuntimeIntegrationFreezeCandidate {
  const cloned = structuredClone(directorRuntimeIntegrationPlatform);
  return candidate({ platform: mutation(cloned) });
}

function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  return Object.values(value as Record<string, unknown>).every((item) => deeplyFrozen(item, seen));
}

describe("DRI-1:8 Director Runtime Integration Platform Freeze", () => {
  it("publishes exact Freeze identity and imports only DRI-1:7 Platform", () => {
    assert.equal(directorRuntimeIntegrationPlatformFreezeIdentity, "DRI-1:8/DirectorRuntimeIntegrationPlatformFreeze");
    assert.equal(directorRuntimeIntegrationPlatformFreezeVersion, "1.8.0");
    assert.equal(directorRuntimeIntegrationPlatformFreezeNamespace, "nexora.dri.runtime.integration.platform.freeze");
    assert.equal(directorRuntimeIntegrationPlatformFreezeUpstream, directorRuntimeIntegrationPlatformIdentity);
    assert.deepEqual(directorRuntimeIntegrationPlatformFreeze.manifest, {
      freezeId: "DRI-1:8/DirectorRuntimeIntegrationPlatformFreeze",
      version: "1.8.0", namespace: "nexora.dri.runtime.integration.platform.freeze",
      layer: "DRI", phase: "DRI-1", stage: "Freeze", status: "Frozen",
      readiness: "ReadyForPublicIndex",
      upstreamIdentity: "DRI-1:7/DirectorRuntimeIntegrationPlatform",
      lockId: "DRI-1-DIRECTOR-RUNTIME-INTEGRATION-PLATFORM-LOCKED",
      releaseStatus: "released", stabilityStatus: "stable",
      integrationDirection: "runtime-to-director",
    });
    const imports = [...sourceText.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
    assert.deepEqual(imports, ["./directorRuntimeIntegrationPlatform.ts"]);
  });

  it("publishes the exact immutable lock without generated metadata", () => {
    assert.deepEqual(directorRuntimeIntegrationPlatformLock, {
      lockId: "DRI-1-DIRECTOR-RUNTIME-INTEGRATION-PLATFORM-LOCKED",
      locked: true, phase: "DRI-1", stage: "Freeze",
    });
    assert.equal(Object.isFrozen(directorRuntimeIntegrationPlatformLock), true);
    assert.equal("timestamp" in directorRuntimeIntegrationPlatformLock, false);
    assert.equal(getDirectorRuntimeIntegrationPlatformLock(), directorRuntimeIntegrationPlatformLock);
  });

  it("publishes exact Freeze, release, stability, and issue vocabularies", () => {
    assert.deepEqual(DIRECTOR_RUNTIME_INTEGRATION_FREEZE_STATES, ["draft", "candidate", "frozen", "invalid"]);
    assert.deepEqual(DIRECTOR_RUNTIME_INTEGRATION_RELEASE_STATUSES, ["unreleased", "release-candidate", "released", "withdrawn"]);
    assert.deepEqual(DIRECTOR_RUNTIME_INTEGRATION_STABILITY_STATUSES, ["experimental", "stable", "deprecated", "retired"]);
    assert.equal(DIRECTOR_RUNTIME_INTEGRATION_FREEZE_ISSUE_CODES.length, 14);
    assert.equal(isDirectorRuntimeIntegrationFreezeState("unknown"), false);
    assert.equal(isDirectorRuntimeIntegrationReleaseStatus("unknown"), false);
    assert.equal(isDirectorRuntimeIntegrationStabilityStatus("unknown"), false);
  });

  it("freezes the exact immutable eight-stage identity chain", () => {
    assert.deepEqual(directorRuntimeIntegrationFrozenIdentityChain, [
      "DRI-1:1/DirectorRuntimeIntegrationFoundation",
      "DRI-1:2/DirectorRuntimeIntegrationContracts",
      "DRI-1:3/DirectorRuntimeIntegrationMapping",
      "DRI-1:4/DirectorRuntimeIntegrationBinding",
      "DRI-1:5/DirectorRuntimeIntegrationValidation",
      "DRI-1:6/DirectorRuntimeIntegrationCertification",
      "DRI-1:7/DirectorRuntimeIntegrationPlatform",
      "DRI-1:8/DirectorRuntimeIntegrationPlatformFreeze",
    ]);
    assert.equal(directorRuntimeIntegrationFrozenIdentityChainCount, directorRuntimeIntegrationFrozenIdentityChain.length);
    assert.equal(new Set(directorRuntimeIntegrationFrozenIdentityChain).size, 8);
    assert.equal(Object.isFrozen(directorRuntimeIntegrationFrozenIdentityChain), true);
  });

  it("derives canonical eligibility from the ready certified Platform", () => {
    const eligibility = resolveDirectorRuntimeIntegrationFreezeEligibility(directorRuntimeCanonicalFreezeCandidate);
    assert.deepEqual(eligibility, {
      eligible: true, platformReady: true, certificationAccepted: true,
      requiredCapabilitiesAvailable: true, authorityPreserved: true,
      directionPreserved: true, issueCodes: [],
    });
    assert.equal(directorRuntimeIntegrationPlatformFreeze.state, "frozen");
    assert.equal(directorRuntimeIntegrationPlatformFreeze.manifest.releaseStatus, "released");
    assert.equal(directorRuntimeIntegrationPlatformFreeze.manifest.stabilityStatus, "stable");
    assert.equal(deeplyFrozen(directorRuntimeIntegrationPlatformFreeze), true);
  });

  it("rejects blocked Platform and invalid Certification without override", () => {
    const blockedPlatform = withPlatform((value) => ({
      ...value,
      manifest: { ...value.manifest, status: "blocked" },
      readiness: { ...value.readiness, status: "blocked", ready: false },
    }));
    const blockedEligibility = resolveDirectorRuntimeIntegrationFreezeEligibility(blockedPlatform);
    assert.equal(blockedEligibility.eligible, false);
    assert.equal(blockedEligibility.issueCodes.includes("DRI_FREEZE_PLATFORM_NOT_READY"), true);

    const invalidCertification = withPlatform((value) => ({
      ...value,
      certificationReport: {
        ...value.certificationReport,
        status: "not-certified",
        decision: { certified: false, status: "not-certified", readyForPlatform: false },
      },
    }));
    const invalidEligibility = resolveDirectorRuntimeIntegrationFreezeEligibility(invalidCertification);
    assert.equal(invalidEligibility.certificationAccepted, false);
    assert.equal(invalidEligibility.issueCodes.includes("DRI_FREEZE_CERTIFICATION_INVALID"), true);
    assert.equal(createDirectorRuntimeIntegrationPlatformFreeze(invalidCertification).state, "invalid");
  });

  it("reports missing and non-available required capabilities without promotion", () => {
    const missing = withPlatform((value) => ({
      ...value,
      capabilities: value.capabilities.filter(({ kind }) => kind !== "foundation"),
      manifest: { ...value.manifest, capabilities: value.capabilities.filter(({ kind }) => kind !== "foundation") },
    }));
    assert.equal(resolveDirectorRuntimeIntegrationFreezeEligibility(missing).issueCodes.includes("DRI_FREEZE_CAPABILITY_MISSING"), true);

    for (const status of ["limited", "blocked", "unavailable"] as const) {
      const invalid = withPlatform((value) => {
        const capabilities = value.capabilities.map((capability) => capability.kind === "foundation" ? { ...capability, status } : capability);
        return { ...value, capabilities, manifest: { ...value.manifest, capabilities } };
      });
      const before = structuredClone(invalid);
      const artifact = createDirectorRuntimeIntegrationPlatformFreeze(invalid);
      assert.deepEqual(invalid, before);
      assert.equal(artifact.eligibility.issueCodes.includes("DRI_FREEZE_CAPABILITY_NOT_AVAILABLE"), true);
      assert.equal(artifact.platform.capabilities.find(({ kind }) => kind === "foundation")?.status, status);
      assert.equal(artifact.state, "invalid");
    }
  });

  it("rejects invalid authority and direction without normalization", () => {
    const authority = withPlatform((value) => ({ ...value, manifest: { ...value.manifest, authority: "Director is business authority" } }));
    assert.equal(resolveDirectorRuntimeIntegrationFreezeEligibility(authority).issueCodes.includes("DRI_FREEZE_AUTHORITY_INVALID"), true);
    const direction = withPlatform((value) => ({ ...value, manifest: { ...value.manifest, direction: "director-to-runtime" as "runtime-to-director" } }));
    const artifact = createDirectorRuntimeIntegrationPlatformFreeze(direction);
    assert.equal(artifact.eligibility.issueCodes.includes("DRI_FREEZE_DIRECTION_INVALID"), true);
    assert.equal(artifact.platform.manifest.direction, "director-to-runtime");
  });

  it("rejects missing, duplicate, reordered, and incorrect identity stages", () => {
    const variants = [
      directorRuntimeIntegrationFrozenIdentityChain.slice(1),
      [...directorRuntimeIntegrationFrozenIdentityChain, directorRuntimeIntegrationFrozenIdentityChain[0]!],
      [...directorRuntimeIntegrationFrozenIdentityChain].reverse(),
      directorRuntimeIntegrationFrozenIdentityChain.map((value, index) => index === 2 ? "DRI-1:3/Wrong" : value),
    ];
    for (const identityChain of variants) {
      assert.equal(resolveDirectorRuntimeIntegrationFreezeEligibility(candidate({ identityChain })).issueCodes.includes("DRI_FREEZE_IDENTITY_INVALID"), true);
    }
  });

  it("preserves exact upstream guarantees and limitations by symbol identity", () => {
    assert.equal(directorRuntimeIntegrationFrozenPlatformGuarantees, platformSurface.directorRuntimeIntegrationPlatformGuarantees);
    assert.equal(directorRuntimeIntegrationFrozenPlatformLimitations, platformSurface.directorRuntimeIntegrationPlatformLimitations);
    assert.equal(directorRuntimeIntegrationFrozenPlatformGuaranteeCount, 18);
    assert.equal(directorRuntimeIntegrationFrozenPlatformLimitationCount, 14);
    assert.equal(directorRuntimeIntegrationFrozenPlatformGuarantees.includes("no-live-synchronization"), true);
    assert.equal(directorRuntimeIntegrationFrozenPlatformLimitations.includes("no-live-state-synchronization"), true);
    assert.equal(directorRuntimeIntegrationFreezeCompatibility.liveSynchronizationSupported, false);
    assert.equal(directorRuntimeIntegrationFreezeCompatibility.renderingSupported, false);
    assert.equal(directorRuntimeIntegrationFreezeCompatibility.reverseWriteBackSupported, false);
  });

  it("reports removed guarantees and limitations without repair", () => {
    const noGuarantee = candidate({ guarantees: directorRuntimeIntegrationFrozenPlatformGuarantees.slice(1) });
    const noLimitation = candidate({ limitations: directorRuntimeIntegrationFrozenPlatformLimitations.filter((value) => value !== "no-live-state-synchronization") });
    assert.equal(resolveDirectorRuntimeIntegrationFreezeEligibility(noGuarantee).issueCodes.includes("DRI_FREEZE_GUARANTEE_MISSING"), true);
    assert.equal(resolveDirectorRuntimeIntegrationFreezeEligibility(noLimitation).issueCodes.includes("DRI_FREEZE_LIMITATION_MISSING"), true);
    assert.deepEqual(noGuarantee.guarantees, directorRuntimeIntegrationFrozenPlatformGuarantees.slice(1));
    assert.equal(noLimitation.limitations.includes("no-live-state-synchronization"), false);
  });

  it("publishes and validates an exact ordered immutable 42-export surface", () => {
    assert.equal(directorRuntimeIntegrationFrozenPublicApiCount, 42);
    assert.equal(directorRuntimeIntegrationFrozenPublicApiCount, directorRuntimeIntegrationFrozenPublicApiSurface.length);
    assert.equal(new Set(directorRuntimeIntegrationFrozenPublicApiSurface.map(({ exportName }) => exportName)).size, 42);
    assert.equal(getDirectorRuntimeIntegrationFrozenPublicApiSurface(), directorRuntimeIntegrationFrozenPublicApiSurface);
    assert.equal(deeplyFrozen(directorRuntimeIntegrationFrozenPublicApiSurface), true);
    const duplicate = [...directorRuntimeIntegrationFrozenPublicApiSurface, directorRuntimeIntegrationFrozenPublicApiSurface[0]!];
    const missing = directorRuntimeIntegrationFrozenPublicApiSurface.slice(1);
    const reordered = [...directorRuntimeIntegrationFrozenPublicApiSurface].reverse();
    for (const publicApiSurface of [duplicate, missing, reordered]) {
      assert.equal(resolveDirectorRuntimeIntegrationFreezeEligibility(candidate({ publicApiSurface })).issueCodes.includes("DRI_FREEZE_PUBLIC_API_INVALID"), true);
    }
  });

  it("preserves re-exported Platform function and value identities", () => {
    assert.equal(createDirectorRuntimeIntegrationPlatform, platformSurface.createDirectorRuntimeIntegrationPlatform);
    assert.equal(resolveDirectorRuntimeIntegrationPlatformReadiness, platformSurface.resolveDirectorRuntimeIntegrationPlatformReadiness);
    assert.equal(verifyDirectorRuntimeIntegrationPlatform, platformSurface.verifyDirectorRuntimeIntegrationPlatform);
    assert.equal(directorRuntimeIntegrationPlatform, platformSurface.directorRuntimeIntegrationPlatform);
    assert.equal(directorRuntimeIntegrationPlatformCapabilityRegistry, platformSurface.directorRuntimeIntegrationPlatformCapabilityRegistry);
  });

  it("publishes exact compatibility, consumer rules, and release information", () => {
    assert.deepEqual(directorRuntimeIntegrationFreezeCompatibility, {
      phase: "DRI-1", platformVersion: "1.7.0", freezeVersion: "1.8.0",
      requiredUpstream: "DRI-1:7/DirectorRuntimeIntegrationPlatform",
      integrationDirection: "runtime-to-director", runtimeAuthorityRequired: true,
      liveSynchronizationSupported: false, renderingSupported: false,
      reverseWriteBackSupported: false, readyForPublicIndex: true,
    });
    assert.equal(getDirectorRuntimeIntegrationFreezeCompatibility(), directorRuntimeIntegrationFreezeCompatibility);
    assert.equal(directorRuntimeIntegrationFreezeConsumerRuleCount, 10);
    assert.equal(getDirectorRuntimeIntegrationFreezeConsumerRules(), directorRuntimeIntegrationFreezeConsumerRules);
    assert.equal(directorRuntimeIntegrationFreezeConsumerRules[0], "consume DRI-1 through DRI-1:9 Public Index");
    assert.equal(directorRuntimeIntegrationFreezeReleaseInformation.role, "FrozenUpstreamForPublicIndex");
    assert.equal(directorRuntimeIntegrationFreezeReleaseInformation.publicIndex, false);
    assert.equal(directorRuntimeIntegrationFreezeReleaseInformation.soleConsumerEntryPoint, false);
  });

  it("preserves every issue in deterministic evaluation order", () => {
    const invalid = withPlatform((value) => ({
      ...value,
      manifest: { ...value.manifest, status: "blocked", authority: "Director", direction: "bidirectional" as "runtime-to-director" },
      readiness: { ...value.readiness, status: "blocked", ready: false },
      certificationReport: { ...value.certificationReport, status: "blocked", decision: { certified: false, status: "blocked", readyForPlatform: false } },
    }));
    const result = resolveDirectorRuntimeIntegrationFreezeEligibility(candidate({
      ...invalid,
      platform: invalid.platform,
      identityChain: directorRuntimeIntegrationFrozenIdentityChain.slice(1),
      guarantees: directorRuntimeIntegrationFrozenPlatformGuarantees.slice(1),
      limitations: directorRuntimeIntegrationFrozenPlatformLimitations.slice(1),
      publicApiSurface: directorRuntimeIntegrationFrozenPublicApiSurface.slice(1),
      platformRegistry: [...directorRuntimeIntegrationPlatformRegistry].reverse(),
    }));
    assert.deepEqual(result.issueCodes, [
      "DRI_FREEZE_PLATFORM_NOT_READY", "DRI_FREEZE_CERTIFICATION_INVALID",
      "DRI_FREEZE_IDENTITY_INVALID", "DRI_FREEZE_AUTHORITY_INVALID",
      "DRI_FREEZE_DIRECTION_INVALID", "DRI_FREEZE_GUARANTEE_MISSING",
      "DRI_FREEZE_LIMITATION_MISSING", "DRI_FREEZE_PUBLIC_API_INVALID",
      "DRI_FREEZE_REGISTRY_INVALID",
    ]);
  });

  it("is deterministic, deeply immutable, and independent of business values", () => {
    const input = candidate();
    const before = structuredClone(input);
    const left = createDirectorRuntimeIntegrationPlatformFreeze(input);
    const right = createDirectorRuntimeIntegrationPlatformFreeze(input);
    assert.deepEqual(input, before);
    assert.deepEqual(left, right);
    assert.equal(deeplyFrozen(left), true);
    const low = candidate({ platform: { ...input.platform, certificationReport: { ...input.platform.certificationReport, validationReport: { ...input.platform.certificationReport.validationReport, validationId: "business-neutral" } } } });
    const high = candidate({ platform: { ...input.platform, certificationReport: { ...input.platform.certificationReport, validationReport: { ...input.platform.certificationReport.validationReport, validationId: "business-neutral" } } } });
    assert.deepEqual(resolveDirectorRuntimeIntegrationFreezeEligibility(low), resolveDirectorRuntimeIntegrationFreezeEligibility(high));
  });

  it("publishes sixteen Freeze guarantees and nineteen registry sections", () => {
    assert.equal(directorRuntimeIntegrationFreezeGuaranteeCount, 16);
    assert.equal(directorRuntimeIntegrationFreezeGuaranteeCount, directorRuntimeIntegrationFreezeGuarantees.length);
    assert.equal(directorRuntimeIntegrationFreezeRegistryCount, 19);
    assert.equal(directorRuntimeIntegrationFreezeRegistryCount, directorRuntimeIntegrationFreezeRegistry.length);
    assert.equal(getDirectorRuntimeIntegrationFreezeRegistry(), directorRuntimeIntegrationFreezeRegistry);
    assert.deepEqual(directorRuntimeIntegrationFreezeRegistry.map(({ order }) => order), Array.from({ length: 19 }, (_, index) => index + 1));
    assert.equal(new Set(directorRuntimeIntegrationFreezeRegistry.map(({ concept }) => concept)).size, 19);
    assert.equal(deeplyFrozen(directorRuntimeIntegrationFreezeRegistry), true);
  });

  it("verifies canonical Freeze and rejects invalid artifact metadata and registry order", () => {
    assert.equal(verifyDirectorRuntimeIntegrationPlatformFreeze(), true);
    assert.equal(getDirectorRuntimeIntegrationPlatformFreezeManifest(), directorRuntimeIntegrationPlatformFreeze.manifest);
    const artifact = directorRuntimeIntegrationPlatformFreeze;
    for (const manifest of [
      { ...artifact.manifest, freezeId: "wrong" },
      { ...artifact.manifest, version: "9.9.9" },
      { ...artifact.manifest, namespace: "wrong" },
      { ...artifact.manifest, upstreamIdentity: "wrong" },
      { ...artifact.manifest, lockId: "wrong" },
    ]) assert.equal(verifyDirectorRuntimeIntegrationPlatformFreeze({ ...artifact, manifest }), false);
    assert.equal(verifyDirectorRuntimeIntegrationPlatformFreeze(artifact, [...directorRuntimeIntegrationFreezeRegistry].reverse()), false);
  });

  it("declares readiness for DRI-1:9 without claiming Public Index status", () => {
    assert.deepEqual(directorRuntimeIntegrationPublicIndexReadiness, {
      nextStageId: "DRI-1:9/DirectorRuntimeIntegrationPublicIndex",
      readyForPublicIndex: true,
      role: "FrozenUpstreamForPublicIndex",
      publicIndex: false,
    });
    assert.doesNotMatch(directorRuntimeIntegrationPlatformFreeze.manifest.stage, /PublicIndex/);
  });

  it("contains no forbidden implementation dependency or live behavior", () => {
    assert.doesNotMatch(sourceText, /from\s+["'][^"']*(?:Foundation|Contracts|Mapping|Binding|Validation|Certification)[^"']*["']/);
    assert.doesNotMatch(sourceText, /\b(?:window|document|fetch|XMLHttpRequest|WebSocket|localStorage|IndexedDB|Math\.random|Date\.now|randomUUID|NODE_ENV)\b/);
    assert.doesNotMatch(sourceText, /from\s+["'][^"']*(?:renderer|database|network|store|nol\/)[^"']*["']/i);
  });
});
