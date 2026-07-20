/**
 * NEA-4:8 — Security Gateway Freeze Tests.
 *
 * Deterministic coverage for the immutable Security Gateway Freeze.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SecurityGatewayCertificationId,
  SecurityGatewayCertificationPlatform,
  getSecurityGatewayCertificationSummary,
} from "./securityGatewayCertification.ts";
import * as FreezeModule from "./securityGatewayFreeze.ts";
import {
  SecurityGatewayFreezeId,
  SecurityGatewayFreezeName,
  SecurityGatewayFreezeNamespace,
  SecurityGatewayFreezePlatform,
  SecurityGatewayFreezeReadiness,
  SecurityGatewayFreezeStatus,
  SecurityGatewayFreezeVersion,
  getSecurityGatewayFreezeSummary,
} from "./securityGatewayFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA48_FILES = Object.freeze([
  "securityGatewayFreezeTypes.ts",
  "securityGatewayFreezeRegistry.ts",
  "securityGatewayFreezeCompatibility.ts",
  "securityGatewayFreezeLocks.ts",
  "securityGatewayFreezeExtensions.ts",
  "securityGatewayFreezeMetadata.ts",
  "securityGatewayFreeze.ts",
  "securityGatewayFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SecurityGatewayFreezeId",
  "SecurityGatewayFreezeVersion",
  "SecurityGatewayFreezeName",
  "SecurityGatewayFreezeNamespace",
  "SecurityGatewayFreezeStatus",
  "SecurityGatewayFreezeReadiness",
  "SecurityGatewayFreezePlatform",
  "getSecurityGatewayFreezeSummary",
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
  "SecurityIdentityLock",
  "SecurityPolicyLock",
  "PermissionLock",
  "NamespaceLock",
  "PublicSurfaceLock",
  "MetadataLock",
  "InventoryLock",
  "DependencyLock",
  "CompatibilityLock",
  "ReleaseLock",
] as const);

const EXPECTED_COMPATIBILITY = Object.freeze([
  "PlatformCompatibility",
  "NamespaceCompatibility",
  "ConsumerCompatibility",
  "SecurityIdentityCompatibility",
  "SecurityPolicyCompatibility",
  "PermissionCompatibility",
  "PublicApiCompatibility",
  "InventoryCompatibility",
  "VersionCompatibility",
  "CertificationCompatibility",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-4:8 Security Gateway Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(NEA48_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA48_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FreezeModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FreezeModule).length, 8);
  });

  it("has canonical freeze identity, status Freeze, and ReadyForPublicIndex", () => {
    assert.equal(SecurityGatewayFreezeId, "NEA-4:8/SecurityGatewayFreeze");
    assert.equal(SecurityGatewayFreezeVersion, "1.0.0");
    assert.equal(SecurityGatewayFreezeName, "Security Gateway Freeze");
    assert.equal(
      SecurityGatewayFreezeNamespace,
      "nexora.nea.security-gateway.freeze",
    );
    assert.equal(SecurityGatewayFreezeStatus, "Freeze");
    assert.equal(SecurityGatewayFreezeReadiness, "ReadyForPublicIndex");
    assert.equal(SecurityGatewayFreezePlatform.identity.phase, "NEA-4:8");
    assert.equal(
      SecurityGatewayFreezePlatform.identity.certificationId,
      SecurityGatewayCertificationId,
    );
    assert.equal(
      SecurityGatewayFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      SecurityGatewayFreezePlatform.nextPhase,
      "NEA-4:9 — Security Gateway Public Index",
    );
  });

  it("consumes only NEA-4:7 Certification and preserves certified reference", () => {
    const dependency = SecurityGatewayFreezePlatform.dependency;
    assert.equal(dependency.certificationOnly, true);
    assert.equal(dependency.certificationPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "securityGatewayCertification.ts",
    );
    assert.equal(dependency.certificationId, SecurityGatewayCertificationId);
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
      SecurityGatewayFreezePlatform.certification,
      SecurityGatewayCertificationPlatform,
    );
    assert.equal(
      SecurityGatewayFreezePlatform.certifiedPlatformReference.certification,
      SecurityGatewayCertificationPlatform,
    );
    assert.equal(
      SecurityGatewayFreezePlatform.certifiedPlatformReference.platform,
      SecurityGatewayCertificationPlatform.platform,
    );
  });

  it("declares seventeen freeze locks with all Locked status", () => {
    const locks = SecurityGatewayFreezePlatform.locks;
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
  });

  it("declares ten compatibility entries and four allowed extension groups", () => {
    const { compatibility, extensions } = SecurityGatewayFreezePlatform;
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

    assert.equal(extensions.allowedExtensionGroupCount, 4);
    assert.equal(extensions.allowedExtensionCount, 4);
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

  it("registers seven certified components and preserves security registries", () => {
    const registry = SecurityGatewayFreezePlatform.registry;
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
    assert.equal(registry.securityIdentityCount, 8);
    assert.equal(registry.securityPolicyCount, 6);
    assert.equal(registry.permissionCount, 8);
    assert.equal(
      registry.securityIdentities,
      SecurityGatewayCertificationPlatform.platform.namespace.registry
        .collections.securityIdentities,
    );
    assert.equal(
      registry.securityPolicies,
      SecurityGatewayCertificationPlatform.platform.namespace.registry
        .collections.securityPolicies,
    );
    assert.equal(
      registry.permissions,
      SecurityGatewayCertificationPlatform.platform.namespace.registry
        .collections.permissions,
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = SecurityGatewayFreezePlatform;
    assert.ok(ownership.owns.includes("Freeze Locks"));
    assert.ok(ownership.owns.includes("Compatibility Metadata"));
    assert.ok(ownership.owns.includes("Extension Policy"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Certification Gates"));
    assert.ok(ownership.doesNotOwn.includes("Authentication"));
    assert.ok(ownership.doesNotOwn.includes("Encryption"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsCertificationGates, false);
    assert.equal(ownership.ownsRuntimeSecurity, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Authentication"));
    assert.ok(boundaries.prohibitedSurfaces.includes("OAuth"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Encryption"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeFreezeLogic, false);
    assert.equal(boundaries.executesAuthentication, false);
    assert.equal(boundaries.duplicatesCertificationMetadata, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SecurityGatewayFreezePlatform;
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
    const summaryA = getSecurityGatewayFreezeSummary();
    const summaryB = getSecurityGatewayFreezeSummary();
    const certificationSummary = getSecurityGatewayCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.freezeId, SecurityGatewayFreezeId);
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
    assert.equal(summaryA.securityIdentityCount, 8);
    assert.equal(summaryA.securityPolicyCount, 6);
    assert.equal(summaryA.permissionCount, 8);
    assert.equal(summaryA.allowedExtensionCount, 4);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 11);
    assert.equal(
      summaryA.nextPhase,
      "NEA-4:9 — Security Gateway Public Index",
    );
    assert.equal(
      SecurityGatewayFreezePlatform.metadata.derivedFromCertification,
      true,
    );
    assert.equal(
      SecurityGatewayFreezePlatform.metadata.architectureVersion,
      "NEA-4.0.0",
    );
    assert.equal(
      SecurityGatewayFreezePlatform.metadata.compatibilityStatus,
      "Compatible",
    );
    assert.equal(SecurityGatewayFreezePlatform.metadata.countsHardcoded, false);
    assert.equal(
      SecurityGatewayFreezePlatform.metadata.duplicatesCertificationMetadata,
      false,
    );
  });

  it("declares ReadyForPublicIndex only and no forbidden runtime implementation", () => {
    assert.equal(
      SecurityGatewayFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      SecurityGatewayFreezePlatform.readiness.claimsReadyForPublicIndex,
      true,
    );
    assert.equal(
      SecurityGatewayFreezePlatform.readiness.claimsPublicIndexPublished,
      false,
    );
    assert.equal(
      SecurityGatewayFreezePlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(SecurityGatewayFreezePlatform.runtimeBehavior, false);
    assert.equal(SecurityGatewayFreezePlatform.runtimeFreezeLogic, false);
    assert.equal(SecurityGatewayFreezePlatform.runtimeCertification, false);
    assert.equal(SecurityGatewayFreezePlatform.executesAuthentication, false);
    assert.equal(SecurityGatewayFreezePlatform.implementsEncryption, false);
    assert.equal(SecurityGatewayFreezePlatform.runtimeSecurity, false);
    assert.equal(SecurityGatewayFreezePlatform.aiReasoning, false);
  });
});
