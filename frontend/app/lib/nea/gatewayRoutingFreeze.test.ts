/**
 * NEA-5:8 — Gateway Routing Freeze Tests.
 *
 * Deterministic coverage for the immutable Gateway Routing Freeze.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  GatewayRoutingCertificationId,
  GatewayRoutingCertificationPlatform,
  getGatewayRoutingCertificationSummary,
} from "./gatewayRoutingCertification.ts";
import * as FreezeModule from "./gatewayRoutingFreeze.ts";
import {
  GatewayRoutingFreezeId,
  GatewayRoutingFreezeName,
  GatewayRoutingFreezeNamespace,
  GatewayRoutingFreezePlatform,
  GatewayRoutingFreezeReadiness,
  GatewayRoutingFreezeStatus,
  GatewayRoutingFreezeVersion,
  getGatewayRoutingFreezeSummary,
} from "./gatewayRoutingFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA58_FILES = Object.freeze([
  "gatewayRoutingFreezeTypes.ts",
  "gatewayRoutingFreezeRegistry.ts",
  "gatewayRoutingFreezeCompatibility.ts",
  "gatewayRoutingFreezeLocks.ts",
  "gatewayRoutingFreezeExtensions.ts",
  "gatewayRoutingFreezeMetadata.ts",
  "gatewayRoutingFreeze.ts",
  "gatewayRoutingFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "GatewayRoutingFreezeId",
  "GatewayRoutingFreezeVersion",
  "GatewayRoutingFreezeName",
  "GatewayRoutingFreezeNamespace",
  "GatewayRoutingFreezeStatus",
  "GatewayRoutingFreezeReadiness",
  "GatewayRoutingFreezePlatform",
  "getGatewayRoutingFreezeSummary",
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
  "RouteIdentityLock",
  "RouteDefinitionLock",
  "NamespaceLock",
  "PublicSurfaceLock",
  "MetadataLock",
  "InventoryLock",
  "OwnershipLock",
  "DependencyLock",
  "CompatibilityLock",
  "ReleaseLock",
] as const);

const EXPECTED_COMPATIBILITY = Object.freeze([
  "PlatformCompatibility",
  "NamespaceCompatibility",
  "ConsumerCompatibility",
  "RouteIdentityCompatibility",
  "RouteDefinitionCompatibility",
  "PublicApiCompatibility",
  "InventoryCompatibility",
  "VersionCompatibility",
  "DependencyCompatibility",
  "CertificationCompatibility",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-5:8 Gateway Routing Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(NEA58_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA58_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FreezeModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FreezeModule).length, 8);
  });

  it("has canonical freeze identity, status Freeze, and ReadyForPublicIndex", () => {
    assert.equal(GatewayRoutingFreezeId, "NEA-5:8/GatewayRoutingFreeze");
    assert.equal(GatewayRoutingFreezeVersion, "1.0.0");
    assert.equal(GatewayRoutingFreezeName, "Gateway Routing Freeze");
    assert.equal(
      GatewayRoutingFreezeNamespace,
      "nexora.nea.gateway-routing.freeze",
    );
    assert.equal(GatewayRoutingFreezeStatus, "Freeze");
    assert.equal(GatewayRoutingFreezeReadiness, "ReadyForPublicIndex");
    assert.equal(GatewayRoutingFreezePlatform.identity.phase, "NEA-5:8");
    assert.equal(GatewayRoutingFreezePlatform.identity.layer, "NEA");
    assert.equal(
      GatewayRoutingFreezePlatform.identity.certificationId,
      GatewayRoutingCertificationId,
    );
    assert.equal(
      GatewayRoutingFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      GatewayRoutingFreezePlatform.nextPhase,
      "NEA-5:9 — Gateway Routing Public Index",
    );
  });

  it("consumes only NEA-5:7 Certification and preserves certified reference", () => {
    const dependency = GatewayRoutingFreezePlatform.dependency;
    assert.equal(dependency.certificationOnly, true);
    assert.equal(dependency.certificationPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "gatewayRoutingCertification.ts",
    );
    assert.equal(dependency.certificationId, GatewayRoutingCertificationId);
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
      GatewayRoutingFreezePlatform.certification,
      GatewayRoutingCertificationPlatform,
    );
    assert.equal(
      GatewayRoutingFreezePlatform.certifiedPlatformReference.certification,
      GatewayRoutingCertificationPlatform,
    );
    assert.equal(
      GatewayRoutingFreezePlatform.certifiedPlatformReference.platform,
      GatewayRoutingCertificationPlatform.platform,
    );

    const ns =
      GatewayRoutingFreezePlatform.certification.platform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
  });

  it("declares seventeen freeze locks with all Locked status", () => {
    const locks = GatewayRoutingFreezePlatform.locks;
    assert.equal(locks.lockCount, 17);
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
    assert.equal(locks.lockedLockCount, 17);
    assert.equal(locks.allLocksActive, true);
    assert.ok(locks.locks.some((item) => item.lockId === "RouteIdentityLock"));
    assert.ok(
      locks.locks.some((item) => item.lockId === "RouteDefinitionLock"),
    );
  });

  it("declares ten compatibility entries and extension policy", () => {
    const { compatibility, extensions } = GatewayRoutingFreezePlatform;
    assert.equal(compatibility.compatibilityCount, 10);
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
    assert.ok(extensions.extensionRules.length > 0);
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

  it("registers seven certified components and preserves route identities", () => {
    const registry = GatewayRoutingFreezePlatform.registry;
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
    assert.equal(registry.routeIdentityCount, 10);
    assert.equal(registry.domainModelCount, 20);
    assert.equal(registry.routeIdentities.length, 10);
    assert.equal(registry.domainModels.length, 20);
    assert.equal(
      registry.routeIdentities,
      GatewayRoutingCertificationPlatform.platform.namespace.registry
        .collections.routeIdentities,
    );
    assert.equal(
      registry.domainModels,
      GatewayRoutingCertificationPlatform.platform.namespace.model.domainModels
        .models,
    );
    assert.ok(
      registry.domainModels.some(
        (item) => item.modelKind === "RouteDefinition",
      ),
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = GatewayRoutingFreezePlatform;
    assert.ok(ownership.owns.includes("Freeze Metadata"));
    assert.ok(ownership.owns.includes("Freeze Locks"));
    assert.ok(ownership.owns.includes("Compatibility Declarations"));
    assert.ok(ownership.owns.includes("Extension Policy"));
    assert.ok(ownership.owns.includes("Freeze Summary"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Certification Gates"));
    assert.ok(ownership.doesNotOwn.includes("Platform Composition"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Routing"));
    assert.ok(ownership.doesNotOwn.includes("Routing Algorithms"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsCertificationGates, false);
    assert.equal(ownership.ownsRuntimeRouting, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Freeze"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Routing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Routing Algorithms"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeFreezeLogic, false);
    assert.equal(boundaries.runtimeCertification, false);
    assert.equal(boundaries.implementsRuntimeRouting, false);
    assert.equal(boundaries.duplicatesCertificationMetadata, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = GatewayRoutingFreezePlatform;
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
    const summaryA = getGatewayRoutingFreezeSummary();
    const summaryB = getGatewayRoutingFreezeSummary();
    const certificationSummary = getGatewayRoutingCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.freezeId, GatewayRoutingFreezeId);
    assert.equal(summaryA.status, "Freeze");
    assert.equal(summaryA.readiness, "ReadyForPublicIndex");
    assert.equal(
      summaryA.certificationId,
      certificationSummary.certificationId,
    );
    assert.equal(
      summaryA.certificationOutcome,
      certificationSummary.certificationOutcome,
    );
    assert.equal(summaryA.lockCount, 17);
    assert.equal(summaryA.lockedLockCount, 17);
    assert.equal(summaryA.compatibilityCount, 10);
    assert.equal(summaryA.componentCount, 7);
    assert.equal(summaryA.routeIdentityCount, 10);
    assert.equal(summaryA.domainModelCount, 20);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 11);
    assert.equal(
      summaryA.nextPhase,
      "NEA-5:9 — Gateway Routing Public Index",
    );
    assert.equal(
      GatewayRoutingFreezePlatform.metadata.derivedFromCertification,
      true,
    );
    assert.equal(GatewayRoutingFreezePlatform.metadata.countsHardcoded, false);
    assert.equal(
      GatewayRoutingFreezePlatform.metadata.duplicatesCertificationMetadata,
      false,
    );
  });

  it("declares ReadyForPublicIndex only and no forbidden runtime implementation", () => {
    assert.equal(
      GatewayRoutingFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      GatewayRoutingFreezePlatform.readiness.claimsReadyForPublicIndex,
      true,
    );
    assert.equal(
      GatewayRoutingFreezePlatform.readiness.claimsPublicIndexPublished,
      false,
    );
    assert.equal(
      GatewayRoutingFreezePlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(GatewayRoutingFreezePlatform.runtimeBehavior, false);
    assert.equal(GatewayRoutingFreezePlatform.runtimeFreezeLogic, false);
    assert.equal(GatewayRoutingFreezePlatform.runtimeCertification, false);
    assert.equal(GatewayRoutingFreezePlatform.runtimeValidation, false);
    assert.equal(GatewayRoutingFreezePlatform.implementsRuntimeRouting, false);
    assert.equal(
      GatewayRoutingFreezePlatform.implementsRoutingAlgorithms,
      false,
    );
    assert.equal(GatewayRoutingFreezePlatform.aiReasoning, false);
  });
});
