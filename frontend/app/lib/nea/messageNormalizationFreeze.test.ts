/**
 * NEA-6:8 — Message Normalization Freeze Tests.
 *
 * Deterministic coverage for the immutable Message Normalization Freeze.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  MessageNormalizationCertificationId,
  MessageNormalizationCertificationPlatform,
  getMessageNormalizationCertificationSummary,
} from "./messageNormalizationCertification.ts";
import * as FreezeModule from "./messageNormalizationFreeze.ts";
import {
  MessageNormalizationFreezeId,
  MessageNormalizationFreezeName,
  MessageNormalizationFreezeNamespace,
  MessageNormalizationFreezePlatform,
  MessageNormalizationFreezeReadiness,
  MessageNormalizationFreezeStatus,
  MessageNormalizationFreezeVersion,
  getMessageNormalizationFreezeSummary,
} from "./messageNormalizationFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA68_FILES = Object.freeze([
  "messageNormalizationFreezeTypes.ts",
  "messageNormalizationFreezeRegistry.ts",
  "messageNormalizationFreezeCompatibility.ts",
  "messageNormalizationFreezeLocks.ts",
  "messageNormalizationFreezeExtensions.ts",
  "messageNormalizationFreezeMetadata.ts",
  "messageNormalizationFreeze.ts",
  "messageNormalizationFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "MessageNormalizationFreezeId",
  "MessageNormalizationFreezeVersion",
  "MessageNormalizationFreezeName",
  "MessageNormalizationFreezeNamespace",
  "MessageNormalizationFreezeStatus",
  "MessageNormalizationFreezeReadiness",
  "MessageNormalizationFreezePlatform",
  "getMessageNormalizationFreezeSummary",
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
  "ExecutiveMessageLock",
  "MessageIdentityRegistryLock",
  "PayloadRegistryLock",
  "NamespaceLock",
  "PublicSurfaceLock",
  "MetadataLock",
  "InventoryLock",
  "OwnershipLock",
  "DependencyLock",
  "ReleaseLock",
] as const);

const EXPECTED_COMPATIBILITY = Object.freeze([
  "PlatformCompatibility",
  "NamespaceCompatibility",
  "ConsumerCompatibility",
  "ExecutiveMessageCompatibility",
  "RegistryCompatibility",
  "PublicApiCompatibility",
  "InventoryCompatibility",
  "VersionCompatibility",
  "DependencyCompatibility",
  "CertificationCompatibility",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-6:8 Message Normalization Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(NEA68_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA68_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FreezeModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FreezeModule).length, 8);
  });

  it("has canonical freeze identity, status Freeze, and ReadyForPublicIndex", () => {
    assert.equal(
      MessageNormalizationFreezeId,
      "NEA-6:8/MessageNormalizationFreeze",
    );
    assert.equal(MessageNormalizationFreezeVersion, "1.0.0");
    assert.equal(
      MessageNormalizationFreezeName,
      "Message Normalization Freeze",
    );
    assert.equal(
      MessageNormalizationFreezeNamespace,
      "nexora.nea.message-normalization.freeze",
    );
    assert.equal(MessageNormalizationFreezeStatus, "Freeze");
    assert.equal(MessageNormalizationFreezeReadiness, "ReadyForPublicIndex");
    assert.equal(MessageNormalizationFreezePlatform.identity.phase, "NEA-6:8");
    assert.equal(MessageNormalizationFreezePlatform.identity.layer, "NEA");
    assert.equal(
      MessageNormalizationFreezePlatform.identity.certificationId,
      MessageNormalizationCertificationId,
    );
    assert.equal(
      MessageNormalizationFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      MessageNormalizationFreezePlatform.nextPhase,
      "NEA-6:9 — Message Normalization Public Index",
    );
  });

  it("consumes only NEA-6:7 Certification and preserves certified reference", () => {
    const dependency = MessageNormalizationFreezePlatform.dependency;
    assert.equal(dependency.certificationOnly, true);
    assert.equal(dependency.certificationPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "messageNormalizationCertification.ts",
    );
    assert.equal(
      dependency.certificationId,
      MessageNormalizationCertificationId,
    );
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
      MessageNormalizationFreezePlatform.certification,
      MessageNormalizationCertificationPlatform,
    );
    assert.equal(
      MessageNormalizationFreezePlatform.certifiedPlatformReference
        .certification,
      MessageNormalizationCertificationPlatform,
    );
    assert.equal(
      MessageNormalizationFreezePlatform.certifiedPlatformReference.platform,
      MessageNormalizationCertificationPlatform.platform,
    );

    const ns =
      MessageNormalizationFreezePlatform.certification.platform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
  });

  it("declares seventeen freeze locks with all Locked status", () => {
    const locks = MessageNormalizationFreezePlatform.locks;
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
    assert.ok(
      locks.locks.some((item) => item.lockId === "ExecutiveMessageLock"),
    );
    assert.ok(
      locks.locks.some(
        (item) => item.lockId === "MessageIdentityRegistryLock",
      ),
    );
    assert.ok(
      locks.locks.some((item) => item.lockId === "PayloadRegistryLock"),
    );
  });

  it("declares ten compatibility entries and extension policy", () => {
    const { compatibility, extensions } = MessageNormalizationFreezePlatform;
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

    assert.equal(extensions.allowedExtensionCount, 4);
    assert.equal(extensions.forbiddenExtensionCount, 9);
    assert.ok(extensions.allowedExtensions.includes("Future NEA Versions"));
    assert.ok(extensions.forbiddenExtensions.includes("Runtime Behavior"));
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

  it("registers seven certified components and preserves registry references", () => {
    const registry = MessageNormalizationFreezePlatform.registry;
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
    assert.equal(registry.messageIdentityCount, 8);
    assert.equal(registry.payloadCount, 8);
    assert.equal(registry.canonicalExecutiveMessageCount, 1);
    assert.equal(registry.messageIdentities.length, 8);
    assert.equal(registry.payloads.length, 8);
    assert.equal(
      registry.messageIdentities,
      MessageNormalizationCertificationPlatform.platform.namespace.registry
        .collections.messageIdentities,
    );
    assert.equal(
      registry.payloads,
      MessageNormalizationCertificationPlatform.platform.namespace.registry
        .collections.payloads,
    );
    assert.equal(
      registry.canonicalExecutiveMessageContracts,
      MessageNormalizationCertificationPlatform.platform.namespace.foundation
        .contracts.canonicalExecutiveMessageContracts,
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = MessageNormalizationFreezePlatform;
    assert.ok(ownership.owns.includes("Freeze Locks"));
    assert.ok(ownership.owns.includes("Compatibility Metadata"));
    assert.ok(ownership.owns.includes("Extension Policy"));
    assert.ok(ownership.owns.includes("Freeze Summary"));
    assert.ok(ownership.owns.includes("Freeze Metadata"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Certification Gates"));
    assert.ok(ownership.doesNotOwn.includes("Platform Namespace"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Normalization"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Freeze"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsCertificationGates, false);
    assert.equal(ownership.ownsRuntimeNormalization, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Freeze"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Normalization"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Message Parsing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeFreezeLogic, false);
    assert.equal(boundaries.runtimeCertification, false);
    assert.equal(boundaries.runtimeNormalization, false);
    assert.equal(boundaries.implementsMessageParsing, false);
    assert.equal(boundaries.duplicatesCertificationMetadata, false);
    assert.equal(boundaries.reconstructsInventories, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = MessageNormalizationFreezePlatform;
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
    const summaryA = getMessageNormalizationFreezeSummary();
    const summaryB = getMessageNormalizationFreezeSummary();
    const certificationSummary = getMessageNormalizationCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.freezeId, MessageNormalizationFreezeId);
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
    assert.equal(summaryA.messageIdentityCount, 8);
    assert.equal(summaryA.payloadCount, 8);
    assert.equal(summaryA.canonicalExecutiveMessageCount, 1);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 11);
    assert.equal(
      summaryA.nextPhase,
      "NEA-6:9 — Message Normalization Public Index",
    );
    assert.equal(
      MessageNormalizationFreezePlatform.metadata.derivedFromCertification,
      true,
    );
    assert.equal(
      MessageNormalizationFreezePlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      MessageNormalizationFreezePlatform.metadata
        .duplicatesCertificationMetadata,
      false,
    );
    assert.equal(
      MessageNormalizationFreezePlatform.metadata.lockSummary.allLocksActive,
      true,
    );
    assert.equal(
      MessageNormalizationFreezePlatform.metadata.compatibilitySummary
        .allCompatible,
      true,
    );
  });

  it("declares ReadyForPublicIndex only and no forbidden runtime implementation", () => {
    assert.equal(
      MessageNormalizationFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      MessageNormalizationFreezePlatform.readiness.claimsReadyForPublicIndex,
      true,
    );
    assert.equal(
      MessageNormalizationFreezePlatform.readiness.claimsPublicIndexPublished,
      false,
    );
    assert.equal(
      MessageNormalizationFreezePlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(MessageNormalizationFreezePlatform.runtimeBehavior, false);
    assert.equal(MessageNormalizationFreezePlatform.runtimeFreezeLogic, false);
    assert.equal(
      MessageNormalizationFreezePlatform.runtimeCertification,
      false,
    );
    assert.equal(
      MessageNormalizationFreezePlatform.runtimeNormalization,
      false,
    );
    assert.equal(MessageNormalizationFreezePlatform.runtimeValidation, false);
    assert.equal(
      MessageNormalizationFreezePlatform.implementsMessageParsing,
      false,
    );
    assert.equal(MessageNormalizationFreezePlatform.aiReasoning, false);
  });
});
