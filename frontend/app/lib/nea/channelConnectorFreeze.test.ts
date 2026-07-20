/**
 * NEA-2:8 — Channel Connectors Freeze Tests.
 *
 * Deterministic coverage for the immutable Channel Connectors Freeze.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ChannelConnectorCertificationId,
  ChannelConnectorCertificationPlatform,
  getChannelConnectorCertificationSummary,
} from "./channelConnectorCertification.ts";
import * as FreezeModule from "./channelConnectorFreeze.ts";
import {
  ChannelConnectorFreezeId,
  ChannelConnectorFreezeName,
  ChannelConnectorFreezeNamespace,
  ChannelConnectorFreezePlatform,
  ChannelConnectorFreezeReadiness,
  ChannelConnectorFreezeStatus,
  ChannelConnectorFreezeVersion,
  getChannelConnectorFreezeSummary,
} from "./channelConnectorFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA28_FILES = Object.freeze([
  "channelConnectorFreezeTypes.ts",
  "channelConnectorFreezeRegistry.ts",
  "channelConnectorFreezeCompatibility.ts",
  "channelConnectorFreezeLocks.ts",
  "channelConnectorFreezeExtensions.ts",
  "channelConnectorFreezeMetadata.ts",
  "channelConnectorFreeze.ts",
  "channelConnectorFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ChannelConnectorFreezeId",
  "ChannelConnectorFreezeVersion",
  "ChannelConnectorFreezeName",
  "ChannelConnectorFreezeNamespace",
  "ChannelConnectorFreezeStatus",
  "ChannelConnectorFreezeReadiness",
  "ChannelConnectorFreezePlatform",
  "getChannelConnectorFreezeSummary",
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
  "ConnectorIdentityLock",
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
  "ConnectorIdentityCompatibility",
  "PublicApiCompatibility",
  "InventoryCompatibility",
  "VersionCompatibility",
  "DependencyCompatibility",
  "CertificationCompatibility",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-2:8 Channel Connectors Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(NEA28_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA28_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FreezeModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FreezeModule).length, 8);
  });

  it("has canonical freeze identity, status Freeze, and ReadyForPublicIndex", () => {
    assert.equal(ChannelConnectorFreezeId, "NEA-2:8/ChannelConnectorFreeze");
    assert.equal(ChannelConnectorFreezeVersion, "1.0.0");
    assert.equal(ChannelConnectorFreezeName, "Channel Connectors Freeze");
    assert.equal(
      ChannelConnectorFreezeNamespace,
      "nexora.nea.channel-connectors.freeze",
    );
    assert.equal(ChannelConnectorFreezeStatus, "Freeze");
    assert.equal(ChannelConnectorFreezeReadiness, "ReadyForPublicIndex");
    assert.equal(ChannelConnectorFreezePlatform.identity.phase, "NEA-2:8");
    assert.equal(ChannelConnectorFreezePlatform.identity.layer, "NEA");
    assert.equal(
      ChannelConnectorFreezePlatform.identity.certificationId,
      ChannelConnectorCertificationId,
    );
    assert.equal(
      ChannelConnectorFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ChannelConnectorFreezePlatform.nextPhase,
      "NEA-2:9 — Channel Connectors Public Index",
    );
  });

  it("consumes only NEA-2:7 Certification and preserves certified reference", () => {
    const dependency = ChannelConnectorFreezePlatform.dependency;
    assert.equal(dependency.certificationOnly, true);
    assert.equal(dependency.certificationPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "channelConnectorCertification.ts",
    );
    assert.equal(dependency.certificationId, ChannelConnectorCertificationId);
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
      ChannelConnectorFreezePlatform.certification,
      ChannelConnectorCertificationPlatform,
    );
    assert.equal(
      ChannelConnectorFreezePlatform.certifiedPlatformReference.certification,
      ChannelConnectorCertificationPlatform,
    );
    assert.equal(
      ChannelConnectorFreezePlatform.certifiedPlatformReference.platform,
      ChannelConnectorCertificationPlatform.platform,
    );
  });

  it("declares sixteen freeze locks with all Locked status", () => {
    const locks = ChannelConnectorFreezePlatform.locks;
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
    assert.ok(
      locks.locks.some((item) => item.lockId === "ConnectorIdentityLock"),
    );
  });

  it("declares nine compatibility entries and extension policy", () => {
    const { compatibility, extensions } = ChannelConnectorFreezePlatform;
    assert.equal(compatibility.compatibilityCount, 9);
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

  it("registers seven certified components and preserves connector identities", () => {
    const registry = ChannelConnectorFreezePlatform.registry;
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
    assert.equal(registry.connectorIdentityCount, 12);
    assert.equal(registry.connectorIdentities.length, 12);
    assert.equal(
      registry.connectorIdentities,
      ChannelConnectorCertificationPlatform.platform.namespace.registry
        .collections.identities,
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = ChannelConnectorFreezePlatform;
    assert.ok(ownership.owns.includes("Freeze State"));
    assert.ok(ownership.owns.includes("Compatibility Metadata"));
    assert.ok(ownership.owns.includes("Certified Platform Reference"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Certification Gates"));
    assert.ok(ownership.doesNotOwn.includes("Platform Composition"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Connectors"));
    assert.ok(ownership.doesNotOwn.includes("Executive Gateway"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsCertificationGates, false);
    assert.equal(ownership.ownsRuntimeConnectors, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime freeze logic"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP Requests"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Telegram Bot"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeFreezeLogic, false);
    assert.equal(boundaries.runtimeCertification, false);
    assert.equal(boundaries.implementsConnectors, false);
    assert.equal(boundaries.duplicatesCertificationMetadata, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ChannelConnectorFreezePlatform;
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
    const summaryA = getChannelConnectorFreezeSummary();
    const summaryB = getChannelConnectorFreezeSummary();
    const certificationSummary = getChannelConnectorCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.freezeId, ChannelConnectorFreezeId);
    assert.equal(summaryA.status, "Freeze");
    assert.equal(summaryA.readiness, "ReadyForPublicIndex");
    assert.equal(summaryA.certificationId, certificationSummary.certificationId);
    assert.equal(
      summaryA.certificationOutcome,
      certificationSummary.certificationOutcome,
    );
    assert.equal(summaryA.lockCount, 16);
    assert.equal(summaryA.lockedLockCount, 16);
    assert.equal(summaryA.compatibilityCount, 9);
    assert.equal(summaryA.componentCount, 7);
    assert.equal(summaryA.connectorIdentityCount, 12);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 11);
    assert.equal(
      summaryA.nextPhase,
      "NEA-2:9 — Channel Connectors Public Index",
    );
    assert.equal(
      ChannelConnectorFreezePlatform.metadata.derivedFromCertification,
      true,
    );
    assert.equal(
      ChannelConnectorFreezePlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      ChannelConnectorFreezePlatform.metadata.duplicatesCertificationMetadata,
      false,
    );
  });

  it("declares ReadyForPublicIndex only and no forbidden runtime implementation", () => {
    assert.equal(
      ChannelConnectorFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ChannelConnectorFreezePlatform.readiness.claimsReadyForPublicIndex,
      true,
    );
    assert.equal(
      ChannelConnectorFreezePlatform.readiness.claimsPublicIndexPublished,
      false,
    );
    assert.equal(
      ChannelConnectorFreezePlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(ChannelConnectorFreezePlatform.runtimeBehavior, false);
    assert.equal(ChannelConnectorFreezePlatform.runtimeFreezeLogic, false);
    assert.equal(ChannelConnectorFreezePlatform.runtimeCertification, false);
    assert.equal(ChannelConnectorFreezePlatform.runtimeValidation, false);
    assert.equal(ChannelConnectorFreezePlatform.implementsConnectors, false);
    assert.equal(ChannelConnectorFreezePlatform.oauthFlow, false);
    assert.equal(ChannelConnectorFreezePlatform.aiReasoning, false);
  });
});
