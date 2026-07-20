/**
 * NEA-1:8 — Executive Gateway Freeze Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Freeze.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveGatewayCertificationId,
  ExecutiveGatewayCertificationPlatform,
  getExecutiveGatewayCertificationSummary,
} from "./executiveGatewayCertification.ts";
import * as FreezeModule from "./executiveGatewayFreeze.ts";
import {
  ExecutiveGatewayFreezeId,
  ExecutiveGatewayFreezeName,
  ExecutiveGatewayFreezeNamespace,
  ExecutiveGatewayFreezePlatform,
  ExecutiveGatewayFreezeReadiness,
  ExecutiveGatewayFreezeStatus,
  ExecutiveGatewayFreezeVersion,
  getExecutiveGatewayFreezeSummary,
} from "./executiveGatewayFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA18_FILES = Object.freeze([
  "executiveGatewayFreezeTypes.ts",
  "executiveGatewayFreezeRegistry.ts",
  "executiveGatewayFreezeCompatibility.ts",
  "executiveGatewayFreezeLocks.ts",
  "executiveGatewayFreezeExtensions.ts",
  "executiveGatewayFreezeMetadata.ts",
  "executiveGatewayFreeze.ts",
  "executiveGatewayFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewayFreezeId",
  "ExecutiveGatewayFreezeVersion",
  "ExecutiveGatewayFreezeName",
  "ExecutiveGatewayFreezeNamespace",
  "ExecutiveGatewayFreezeStatus",
  "ExecutiveGatewayFreezeReadiness",
  "ExecutiveGatewayFreezePlatform",
  "getExecutiveGatewayFreezeSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "registry",
  "locks",
  "compatibility",
  "extensions",
  "metadata",
  "ownership",
  "boundaries",
  "summary",
  "readiness",
] as const);

const EXPECTED_LOCKS = Object.freeze([
  "FoundationLock",
  "RegistryLock",
  "ModelLock",
  "ValidationLock",
  "ManifestLock",
  "PlatformLock",
  "CertificationLock",
  "NamespaceLock",
  "PublicSurfaceLock",
  "MetadataLock",
  "InventoryLock",
  "OwnershipLock",
  "DependencyLock",
  "CompatibilityLock",
  "ArchitectureLock",
  "ReleaseLock",
] as const);

const EXPECTED_COMPATIBILITY = Object.freeze([
  "PlatformCompatibility",
  "NamespaceCompatibility",
  "ConsumerCompatibility",
  "PublicApiCompatibility",
  "InventoryCompatibility",
  "VersionCompatibility",
  "DependencyCompatibility",
  "CertificationCompatibility",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-1:8 Executive Gateway Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(NEA18_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA18_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FreezeModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FreezeModule).length, 8);
  });

  it("has canonical freeze identity, status Freeze, and ReadyForPublicIndex", () => {
    assert.equal(ExecutiveGatewayFreezeId, "NEA-1:8/ExecutiveGatewayFreeze");
    assert.equal(ExecutiveGatewayFreezeVersion, "1.0.0");
    assert.equal(ExecutiveGatewayFreezeName, "Executive Gateway Freeze");
    assert.equal(
      ExecutiveGatewayFreezeNamespace,
      "nexora.nea.executive-gateway.freeze",
    );
    assert.equal(ExecutiveGatewayFreezeStatus, "Freeze");
    assert.equal(ExecutiveGatewayFreezeReadiness, "ReadyForPublicIndex");
    assert.equal(ExecutiveGatewayFreezePlatform.identity.phase, "NEA-1:8");
    assert.equal(ExecutiveGatewayFreezePlatform.identity.layer, "NEA");
    assert.equal(
      ExecutiveGatewayFreezePlatform.identity.certificationId,
      ExecutiveGatewayCertificationId,
    );
    assert.equal(
      ExecutiveGatewayFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ExecutiveGatewayFreezePlatform.nextPhase,
      "NEA-1:9 — Executive Gateway Public Index",
    );
  });

  it("consumes only NEA-1:7 Certification and preserves certified reference", () => {
    const dependency = ExecutiveGatewayFreezePlatform.dependency;
    assert.equal(dependency.certificationOnly, true);
    assert.equal(dependency.certificationPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewayCertification.ts",
    );
    assert.equal(dependency.certificationId, ExecutiveGatewayCertificationId);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesCertificationMetadata, false);
    assert.equal(dependency.duplicatesPlatformMetadata, false);
    assert.equal(dependency.reconstructsCertification, false);
    assert.equal(dependency.reconstructsPlatform, false);
    assert.equal(
      ExecutiveGatewayFreezePlatform.certification,
      ExecutiveGatewayCertificationPlatform,
    );
    assert.equal(
      ExecutiveGatewayFreezePlatform.certifiedPlatformReference.certification,
      ExecutiveGatewayCertificationPlatform,
    );
    assert.equal(
      ExecutiveGatewayFreezePlatform.certifiedPlatformReference.platform,
      ExecutiveGatewayCertificationPlatform.platform,
    );
  });

  it("declares sixteen freeze locks with all Locked status", () => {
    const locks = ExecutiveGatewayFreezePlatform.locks;
    assert.equal(locks.lockCount, 16);
    assert.deepEqual(
      locks.locks.map((item) => item.lockId),
      [...EXPECTED_LOCKS],
    );
    assertUnique(
      locks.locks.map((item) => item.lockId),
      "lock ids",
    );
    assert.ok(locks.locks.every((item) => item.executesRuntime === false));
    assert.ok(locks.locks.every((item) => item.status === "Locked"));
    assert.equal(locks.lockedLockCount, 16);
    assert.equal(locks.allLocksActive, true);
  });

  it("declares eight compatibility entries and extension policy", () => {
    const { compatibility, extensions } = ExecutiveGatewayFreezePlatform;
    assert.equal(compatibility.compatibilityCount, 8);
    assert.deepEqual(
      compatibility.declarations.map((item) => item.compatibilityId),
      [...EXPECTED_COMPATIBILITY],
    );
    assert.ok(
      compatibility.declarations.every((item) => item.compatible === true),
    );
    assert.equal(compatibility.allCompatible, true);
    assert.equal(compatibility.executesRuntime, false);

    assert.ok(extensions.allowedExtensionCount > 0);
    assert.ok(extensions.forbiddenExtensionCount > 0);
    assert.equal(
      extensions.backwardCompatibility.breakingChangeRequiresMajorVersion,
      true,
    );
    assert.equal(
      extensions.futurePublicIndexReadiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(extensions.additiveOnly, true);
  });

  it("registers seven certified components without reconstructing upstream", () => {
    const registry = ExecutiveGatewayFreezePlatform.registry;
    assert.equal(registry.componentCount, 7);
    assertUnique(
      registry.components.map((item) => item.componentId),
      "component ids",
    );
    assert.ok(registry.components.every((item) => item.frozen === true));
    assert.ok(registry.components.every((item) => item.certified === true));
    assert.ok(
      registry.components.every((item) => item.reconstructsUpstream === false),
    );
    assert.equal(registry.reconstructsUpstream, false);
    assert.equal(registry.duplicatesArchitecture, false);
    assert.equal(
      registry.certifiedPlatformReference.duplicatesCertificationMetadata,
      false,
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = ExecutiveGatewayFreezePlatform;
    assert.ok(ownership.owns.includes("Freeze State"));
    assert.ok(ownership.owns.includes("Compatibility Metadata"));
    assert.ok(ownership.owns.includes("Certified Platform Reference"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Certification Gates"));
    assert.ok(ownership.doesNotOwn.includes("Platform Composition"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsCertificationGates, false);
    assert.equal(ownership.ownsRuntimeProcessing, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime freeze logic"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeFreezeLogic, false);
    assert.equal(boundaries.runtimeCertification, false);
    assert.equal(boundaries.duplicatesCertificationMetadata, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ExecutiveGatewayFreezePlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 11), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 11);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.registry), true);
    assert.equal(Object.isFrozen(platform.locks), true);
    assert.equal(Object.isFrozen(platform.locks.locks), true);
    assert.equal(Object.isFrozen(platform.compatibility), true);
    assert.equal(Object.isFrozen(platform.extensions), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.summary), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary exclusively from Certification", () => {
    const summaryA = getExecutiveGatewayFreezeSummary();
    const summaryB = getExecutiveGatewayFreezeSummary();
    const certificationSummary = getExecutiveGatewayCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.freezeId, ExecutiveGatewayFreezeId);
    assert.equal(summaryA.status, "Freeze");
    assert.equal(summaryA.readiness, "ReadyForPublicIndex");
    assert.equal(summaryA.certificationId, certificationSummary.certificationId);
    assert.equal(
      summaryA.certificationOutcome,
      certificationSummary.certificationOutcome,
    );
    assert.equal(summaryA.lockCount, 16);
    assert.equal(summaryA.lockedLockCount, 16);
    assert.equal(summaryA.compatibilityCount, 8);
    assert.equal(summaryA.componentCount, 7);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 11);
    assert.equal(
      summaryA.nextPhase,
      "NEA-1:9 — Executive Gateway Public Index",
    );
    assert.equal(
      ExecutiveGatewayFreezePlatform.metadata.derivedFromCertification,
      true,
    );
    assert.equal(
      ExecutiveGatewayFreezePlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      ExecutiveGatewayFreezePlatform.metadata.duplicatesCertificationMetadata,
      false,
    );
  });

  it("declares ReadyForPublicIndex only and no forbidden runtime implementation", () => {
    assert.equal(
      ExecutiveGatewayFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ExecutiveGatewayFreezePlatform.readiness.claimsReadyForPublicIndex,
      true,
    );
    assert.equal(
      ExecutiveGatewayFreezePlatform.readiness.claimsPublicIndexPublished,
      false,
    );
    assert.equal(
      ExecutiveGatewayFreezePlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(ExecutiveGatewayFreezePlatform.runtimeBehavior, false);
    assert.equal(ExecutiveGatewayFreezePlatform.runtimeFreezeLogic, false);
    assert.equal(ExecutiveGatewayFreezePlatform.runtimeCertification, false);
    assert.equal(ExecutiveGatewayFreezePlatform.runtimeValidation, false);
    assert.equal(ExecutiveGatewayFreezePlatform.authenticationExecution, false);
    assert.equal(ExecutiveGatewayFreezePlatform.authorizationExecution, false);
    assert.equal(ExecutiveGatewayFreezePlatform.routingExecution, false);
    assert.equal(ExecutiveGatewayFreezePlatform.aiReasoning, false);
  });
});
