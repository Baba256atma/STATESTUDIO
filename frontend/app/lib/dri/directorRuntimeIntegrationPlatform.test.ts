import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS,
  DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_STATUSES,
  DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_STATUSES,
  createDirectorRuntimeIntegrationPlatform,
  directorRuntimeIntegrationPlatform,
  directorRuntimeIntegrationPlatformCapabilityRegistry,
  directorRuntimeIntegrationPlatformCapabilityRegistryCount,
  directorRuntimeIntegrationPlatformCompatibility,
  directorRuntimeIntegrationPlatformConsumerInformation,
  directorRuntimeIntegrationPlatformGuaranteeCount,
  directorRuntimeIntegrationPlatformGuarantees,
  directorRuntimeIntegrationPlatformIdentity,
  directorRuntimeIntegrationPlatformIdentityChain,
  directorRuntimeIntegrationPlatformIdentityChainCount,
  directorRuntimeIntegrationPlatformLimitationCount,
  directorRuntimeIntegrationPlatformLimitations,
  directorRuntimeIntegrationPlatformMetadata,
  directorRuntimeIntegrationPlatformNamespace,
  directorRuntimeIntegrationPlatformRegistry,
  directorRuntimeIntegrationPlatformRegistryCount,
  directorRuntimeIntegrationPlatformUpstream,
  directorRuntimeIntegrationPlatformVersion,
  findBlockedDirectorRuntimeIntegrationPlatformCapabilities,
  findDirectorRuntimeIntegrationPlatformCapabilityById,
  findDirectorRuntimeIntegrationPlatformCapabilityByKind,
  findLimitedDirectorRuntimeIntegrationPlatformCapabilities,
  findRequiredDirectorRuntimeIntegrationPlatformCapabilities,
  getDirectorRuntimeIntegrationPlatformRegistry,
  isDirectorRuntimeIntegrationPlatformCapabilityAvailable,
  isDirectorRuntimeIntegrationPlatformCapabilityKind,
  isDirectorRuntimeIntegrationPlatformCapabilityStatus,
  isDirectorRuntimeIntegrationPlatformStatus,
  resolveDirectorRuntimeIntegrationPlatformCapabilities,
  resolveDirectorRuntimeIntegrationPlatformReadiness,
  verifyDirectorRuntimeIntegrationPlatform,
  type DirectorRuntimeIntegrationPlatform,
  type DirectorRuntimeIntegrationPlatformCapability,
} from "./directorRuntimeIntegrationPlatform.ts";
import {
  directorRuntimeIntegrationCertificationIdentity,
  directorRuntimeIntegrationCertificationMetadata,
  type DirectorRuntimeCertificationReport,
} from "./directorRuntimeIntegrationCertification.ts";

const sourceText = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "directorRuntimeIntegrationPlatform.ts"),
  "utf8",
);

function certification(
  overrides: Partial<DirectorRuntimeCertificationReport> = {},
): DirectorRuntimeCertificationReport {
  return { ...structuredClone(directorRuntimeIntegrationPlatform.certificationReport), ...overrides };
}

function capabilities(
  mutations: Partial<Record<(typeof DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS)[number], Partial<DirectorRuntimeIntegrationPlatformCapability>>> = {},
): DirectorRuntimeIntegrationPlatformCapability[] {
  return directorRuntimeIntegrationPlatformCapabilityRegistry.map((capability) => ({
    ...capability,
    ...mutations[capability.kind],
    guaranteeIds: [...capability.guaranteeIds],
    dependencyIds: [...capability.dependencyIds],
  }));
}

function platform(
  caps = capabilities(),
  report = certification(),
): DirectorRuntimeIntegrationPlatform {
  return createDirectorRuntimeIntegrationPlatform({
    platformId: directorRuntimeIntegrationPlatformIdentity,
    compositionId: "platform-test-composition",
    certificationReport: report,
    capabilities: caps,
  });
}

function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  return Object.values(value as Record<string, unknown>).every((item) => deeplyFrozen(item, seen));
}

describe("DRI-1:7 Director Runtime Integration Platform", () => {
  it("publishes exact identity and consumes only DRI-1:6 Certification", () => {
    assert.equal(directorRuntimeIntegrationPlatformIdentity, "DRI-1:7/DirectorRuntimeIntegrationPlatform");
    assert.equal(directorRuntimeIntegrationPlatformVersion, "1.7.0");
    assert.equal(directorRuntimeIntegrationPlatformNamespace, "nexora.dri.runtime.integration.platform");
    assert.equal(directorRuntimeIntegrationPlatformUpstream, directorRuntimeIntegrationCertificationIdentity);
    assert.deepEqual(directorRuntimeIntegrationPlatformMetadata, {
      identity: "DRI-1:7/DirectorRuntimeIntegrationPlatform",
      version: "1.7.0",
      namespace: "nexora.dri.runtime.integration.platform",
      layer: "DRI", phase: "DRI-1", stage: "Platform", status: "PlatformReady",
      upstream: "DRI-1:6/DirectorRuntimeIntegrationCertification",
      direction: "runtime-to-director",
      authority: directorRuntimeIntegrationCertificationMetadata.authority,
      publicIndex: false, frozen: false, soleConsumerEntryPoint: false,
    });
    const imports = [...sourceText.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
    assert.deepEqual(imports, ["./directorRuntimeIntegrationCertification.ts"]);
  });

  it("publishes exact Platform and capability vocabulary", () => {
    assert.deepEqual(DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_STATUSES, ["initializing", "ready", "degraded", "blocked", "unavailable"]);
    assert.deepEqual(DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS, ["foundation", "contracts", "mapping", "binding", "validation", "certification", "registry", "verification"]);
    assert.deepEqual(DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_STATUSES, ["available", "limited", "blocked", "unavailable"]);
    assert.equal(isDirectorRuntimeIntegrationPlatformStatus("unknown"), false);
    assert.equal(isDirectorRuntimeIntegrationPlatformCapabilityKind("unknown"), false);
    assert.equal(isDirectorRuntimeIntegrationPlatformCapabilityStatus("unknown"), false);
  });

  it("publishes the exact immutable seven-stage identity chain", () => {
    assert.deepEqual(directorRuntimeIntegrationPlatformIdentityChain, [
      "DRI-1:1/DirectorRuntimeIntegrationFoundation",
      "DRI-1:2/DirectorRuntimeIntegrationContracts",
      "DRI-1:3/DirectorRuntimeIntegrationMapping",
      "DRI-1:4/DirectorRuntimeIntegrationBinding",
      "DRI-1:5/DirectorRuntimeIntegrationValidation",
      "DRI-1:6/DirectorRuntimeIntegrationCertification",
      "DRI-1:7/DirectorRuntimeIntegrationPlatform",
    ]);
    assert.equal(directorRuntimeIntegrationPlatformIdentityChainCount, directorRuntimeIntegrationPlatformIdentityChain.length);
    assert.equal(Object.isFrozen(directorRuntimeIntegrationPlatformIdentityChain), true);
    assert.equal(verifyDirectorRuntimeIntegrationPlatform(directorRuntimeIntegrationPlatform, directorRuntimeIntegrationPlatformIdentityChain.slice(1)), false);
    assert.equal(verifyDirectorRuntimeIntegrationPlatform(directorRuntimeIntegrationPlatform, [...directorRuntimeIntegrationPlatformIdentityChain].reverse()), false);
  });

  it("creates the canonical ready Platform from actual certified evidence", () => {
    assert.equal(directorRuntimeIntegrationPlatform.certificationReport.status, "certified");
    assert.equal(directorRuntimeIntegrationPlatform.readiness.status, "ready");
    assert.equal(directorRuntimeIntegrationPlatform.readiness.ready, true);
    assert.deepEqual(directorRuntimeIntegrationPlatform.readiness.blockedCapabilityIds, []);
    assert.deepEqual(directorRuntimeIntegrationPlatform.readiness.limitedCapabilityIds, []);
    assert.equal(directorRuntimeIntegrationPlatform.capabilities.every(({ status }) => status === "available"), true);
    assert.equal(deeplyFrozen(directorRuntimeIntegrationPlatform), true);
    assert.equal(verifyDirectorRuntimeIntegrationPlatform(), true);
  });

  it("resolves degraded, blocked, unavailable, and initializing precedence", () => {
    const degraded = platform(capabilities({ registry: { status: "limited" } }));
    assert.equal(degraded.readiness.status, "degraded");
    assert.equal(degraded.readiness.ready, true);
    assert.deepEqual(degraded.readiness.limitedCapabilityIds, ["dri-platform-capability:registry"]);

    const blocked = platform(capabilities({ foundation: { status: "blocked" } }));
    assert.equal(blocked.readiness.status, "blocked");
    assert.equal(blocked.readiness.ready, false);
    assert.deepEqual(blocked.readiness.blockedCapabilityIds, ["dri-platform-capability:foundation"]);

    const unavailable = platform(capabilities({ foundation: { status: "blocked" }, mapping: { status: "unavailable" } }));
    assert.equal(unavailable.readiness.status, "unavailable");
    assert.equal(unavailable.readiness.ready, false);
    assert.deepEqual(unavailable.readiness.unavailableCapabilityIds, ["dri-platform-capability:mapping"]);

    assert.equal(resolveDirectorRuntimeIntegrationPlatformReadiness(certification(), []).status, "initializing");
  });

  it("never overrides failed or blocked Certification", () => {
    for (const status of ["not-certified", "blocked"] as const) {
      const report = certification({
        status,
        decision: { certified: false, status, readyForPlatform: false },
      });
      const result = platform(capabilities(), report);
      assert.equal(result.readiness.ready, false);
      assert.equal(result.readiness.status, "blocked");
      assert.equal(result.capabilities.filter(({ required }) => required).every(({ status: capabilityStatus }) => capabilityStatus === "blocked"), true);
    }
    const notes = certification({ status: "certified-with-notes", decision: { certified: true, status: "certified-with-notes", readyForPlatform: true } });
    assert.equal(platform(capabilities(), notes).readiness.ready, true);
  });

  it("preserves explicit capability status without hidden promotion", () => {
    for (const status of ["available", "limited", "blocked", "unavailable"] as const) {
      const supplied = capabilities({ registry: { status } });
      const before = structuredClone(supplied);
      const resolved = resolveDirectorRuntimeIntegrationPlatformCapabilities(certification(), supplied);
      assert.deepEqual(supplied, before);
      assert.equal(resolved.find(({ kind }) => kind === "registry")?.status, status);
      assert.equal(deeplyFrozen(resolved), true);
    }
  });

  it("publishes exactly one ordered descriptor per capability kind", () => {
    assert.equal(directorRuntimeIntegrationPlatformCapabilityRegistryCount, 8);
    assert.equal(directorRuntimeIntegrationPlatformCapabilityRegistryCount, directorRuntimeIntegrationPlatformCapabilityRegistry.length);
    assert.deepEqual(directorRuntimeIntegrationPlatformCapabilityRegistry.map(({ kind }) => kind), DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS);
    assert.equal(new Set(directorRuntimeIntegrationPlatformCapabilityRegistry.map(({ kind }) => kind)).size, 8);
    assert.equal(directorRuntimeIntegrationPlatformCapabilityRegistry.find(({ kind }) => kind === "registry")?.required, false);
    assert.equal(deeplyFrozen(directorRuntimeIntegrationPlatformCapabilityRegistry), true);
  });

  it("queries capabilities without mutation and preserves registry order", () => {
    const caps = capabilities({ registry: { status: "limited" }, mapping: { status: "blocked" } });
    const before = structuredClone(caps);
    assert.equal(findDirectorRuntimeIntegrationPlatformCapabilityById(caps, "dri-platform-capability:mapping")?.kind, "mapping");
    assert.equal(findDirectorRuntimeIntegrationPlatformCapabilityByKind(caps, "binding")?.capabilityId, "dri-platform-capability:binding");
    assert.deepEqual(findBlockedDirectorRuntimeIntegrationPlatformCapabilities(caps).map(({ kind }) => kind), ["mapping"]);
    assert.deepEqual(findLimitedDirectorRuntimeIntegrationPlatformCapabilities(caps).map(({ kind }) => kind), ["registry"]);
    assert.deepEqual(findRequiredDirectorRuntimeIntegrationPlatformCapabilities(caps).map(({ kind }) => kind), ["foundation", "contracts", "mapping", "binding", "validation", "certification", "verification"]);
    assert.equal(isDirectorRuntimeIntegrationPlatformCapabilityAvailable(caps, "binding"), true);
    assert.equal(isDirectorRuntimeIntegrationPlatformCapabilityAvailable(caps, "mapping"), false);
    assert.deepEqual(caps, before);
  });

  it("assembles exact manifest and composition metadata", () => {
    const result = directorRuntimeIntegrationPlatform;
    assert.equal(result.manifest.platformId, directorRuntimeIntegrationPlatformIdentity);
    assert.equal(result.manifest.version, "1.7.0");
    assert.equal(result.manifest.namespace, "nexora.dri.runtime.integration.platform");
    assert.equal(result.manifest.upstreamIdentity, directorRuntimeIntegrationCertificationIdentity);
    assert.equal(result.manifest.direction, "runtime-to-director");
    assert.equal(result.manifest.authority, "Runtime is authoritative operational and business state");
    assert.equal(result.manifest.readinessTarget, "DRI-1:8/DirectorRuntimeIntegrationAdapter");
    assert.equal(result.composition.certificationId, result.certificationReport.certificationId);
    assert.deepEqual(result.composition.capabilityIds, result.capabilities.map(({ capabilityId }) => capabilityId));
  });

  it("publishes exact immutable guarantees and limitations", () => {
    assert.equal(directorRuntimeIntegrationPlatformGuaranteeCount, 18);
    assert.equal(directorRuntimeIntegrationPlatformGuaranteeCount, directorRuntimeIntegrationPlatformGuarantees.length);
    assert.equal(new Set(directorRuntimeIntegrationPlatformGuarantees).size, 18);
    assert.equal(directorRuntimeIntegrationPlatformLimitationCount, 14);
    assert.equal(directorRuntimeIntegrationPlatformLimitationCount, directorRuntimeIntegrationPlatformLimitations.length);
    assert.equal(directorRuntimeIntegrationPlatformLimitations.includes("no-live-state-synchronization"), true);
    assert.equal(directorRuntimeIntegrationPlatformLimitations.includes("no-director-rendering"), true);
    assert.equal(deeplyFrozen(directorRuntimeIntegrationPlatformGuarantees), true);
    assert.equal(deeplyFrozen(directorRuntimeIntegrationPlatformLimitations), true);
  });

  it("publishes compatibility and the single downstream Platform boundary", () => {
    assert.deepEqual(directorRuntimeIntegrationPlatformCompatibility, {
      compatibleDriPhase: "DRI-1", requiredUpstream: "DRI-1:6",
      integrationDirection: "runtime-to-director", runtimeAuthorityRequired: true,
      liveSynchronizationSupported: false, renderingSupported: false,
      reverseWriteBackSupported: false, businessEvaluationSupported: false,
    });
    assert.equal(directorRuntimeIntegrationPlatformConsumerInformation.consumerStage, "DRI-1:8/DirectorRuntimeIntegrationAdapter");
    assert.deepEqual(directorRuntimeIntegrationPlatformConsumerInformation.allowedCapabilities, DIRECTOR_RUNTIME_INTEGRATION_PLATFORM_CAPABILITY_KINDS);
    assert.equal(directorRuntimeIntegrationPlatformConsumerInformation.prohibitedDependencies.includes("DRI-1:1 internal implementation"), true);
    assert.equal(directorRuntimeIntegrationPlatformMetadata.publicIndex, false);
    assert.equal(directorRuntimeIntegrationPlatformMetadata.frozen, false);
    assert.equal(directorRuntimeIntegrationPlatformMetadata.soleConsumerEntryPoint, false);
  });

  it("is deterministic, deeply immutable, and business-value independent", () => {
    const caps = capabilities();
    const report = certification();
    const input = { platformId: " Platform:KEEP ", compositionId: " Composition:KEEP ", certificationReport: report, capabilities: caps };
    const before = structuredClone(input);
    const left = createDirectorRuntimeIntegrationPlatform(input);
    const right = createDirectorRuntimeIntegrationPlatform(input);
    assert.deepEqual(input, before);
    assert.deepEqual(left, right);
    assert.equal(deeplyFrozen(left), true);
    const low = certification({ validationReport: { ...report.validationReport, validationId: "same" } });
    const high = certification({ validationReport: { ...report.validationReport, validationId: "same" } });
    assert.deepEqual(platform(caps, low), platform(caps, high));
  });

  it("rejects duplicate capabilities and verifies invalid Platform fixtures", () => {
    assert.throws(() => platform([...capabilities(), capabilities()[0]!]), /unique/);
    const canonical = directorRuntimeIntegrationPlatform;
    assert.equal(verifyDirectorRuntimeIntegrationPlatform({ ...canonical, manifest: { ...canonical.manifest, platformId: "wrong" } }), false);
    assert.equal(verifyDirectorRuntimeIntegrationPlatform({ ...canonical, manifest: { ...canonical.manifest, upstreamIdentity: "DRI-1:3/Wrong" } }), false);
    assert.equal(verifyDirectorRuntimeIntegrationPlatform({ ...canonical, manifest: { ...canonical.manifest, direction: "director-to-runtime" as "runtime-to-director" } }), false);
    assert.equal(verifyDirectorRuntimeIntegrationPlatform({ ...canonical, manifest: { ...canonical.manifest, authority: "Director is authoritative" } }), false);
    assert.equal(verifyDirectorRuntimeIntegrationPlatform(platform(capabilities().slice(1))), false);
    const failed = platform(capabilities(), certification({ status: "not-certified", decision: { certified: false, status: "not-certified", readyForPlatform: false } }));
    assert.equal(verifyDirectorRuntimeIntegrationPlatform(failed), false);
    const reversedRegistry = [...directorRuntimeIntegrationPlatformRegistry].reverse();
    assert.equal(verifyDirectorRuntimeIntegrationPlatform(canonical, directorRuntimeIntegrationPlatformIdentityChain, reversedRegistry), false);
  });

  it("publishes the exact immutable 21-section Platform registry", () => {
    assert.equal(directorRuntimeIntegrationPlatformRegistryCount, 21);
    assert.equal(directorRuntimeIntegrationPlatformRegistryCount, directorRuntimeIntegrationPlatformRegistry.length);
    assert.equal(getDirectorRuntimeIntegrationPlatformRegistry(), directorRuntimeIntegrationPlatformRegistry);
    assert.deepEqual(directorRuntimeIntegrationPlatformRegistry.map(({ order }) => order), Array.from({ length: 21 }, (_, index) => index + 1));
    assert.equal(new Set(directorRuntimeIntegrationPlatformRegistry.map(({ concept }) => concept)).size, 21);
    assert.equal(deeplyFrozen(directorRuntimeIntegrationPlatformRegistry), true);
  });

  it("contains no UI, renderer, persistence, browser, network, or live integration dependency", () => {
    assert.doesNotMatch(sourceText, /\b(?:React|ReactDOM|THREE|SceneRenderer|window|document|fetch|XMLHttpRequest|WebSocket|localStorage|IndexedDB|Math\.random|Date\.now|randomUUID|NODE_ENV)\b/);
    assert.doesNotMatch(sourceText, /from\s+["'][^"']*(?:renderer|database|network|store|nol\/)[^"']*["']/i);
  });
});
