/**
 * NEA-3:8 — Session & Conversation Freeze Tests.
 *
 * Deterministic coverage for the immutable Session & Conversation Freeze.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SessionConversationCertificationId,
  SessionConversationCertificationPlatform,
  getSessionConversationCertificationSummary,
} from "./sessionConversationCertification.ts";
import * as FreezeModule from "./sessionConversationFreeze.ts";
import {
  SessionConversationFreezeId,
  SessionConversationFreezeName,
  SessionConversationFreezeNamespace,
  SessionConversationFreezePlatform,
  SessionConversationFreezeReadiness,
  SessionConversationFreezeStatus,
  SessionConversationFreezeVersion,
  getSessionConversationFreezeSummary,
} from "./sessionConversationFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA38_FILES = Object.freeze([
  "sessionConversationFreezeTypes.ts",
  "sessionConversationFreezeRegistry.ts",
  "sessionConversationFreezeCompatibility.ts",
  "sessionConversationFreezeLocks.ts",
  "sessionConversationFreezeExtensions.ts",
  "sessionConversationFreezeMetadata.ts",
  "sessionConversationFreeze.ts",
  "sessionConversationFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "SessionConversationFreezeId",
  "SessionConversationFreezeVersion",
  "SessionConversationFreezeName",
  "SessionConversationFreezeNamespace",
  "SessionConversationFreezeStatus",
  "SessionConversationFreezeReadiness",
  "SessionConversationFreezePlatform",
  "getSessionConversationFreezeSummary",
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
  "SessionIdentityLock",
  "ConversationIdentityLock",
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
  "SessionIdentityCompatibility",
  "ConversationIdentityCompatibility",
  "PublicApiCompatibility",
  "InventoryCompatibility",
  "VersionCompatibility",
  "DependencyCompatibility",
  "CertificationCompatibility",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-3:8 Session & Conversation Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(NEA38_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA38_FILES) {
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
      SessionConversationFreezeId,
      "NEA-3:8/SessionConversationFreeze",
    );
    assert.equal(SessionConversationFreezeVersion, "1.0.0");
    assert.equal(
      SessionConversationFreezeName,
      "Session & Conversation Freeze",
    );
    assert.equal(
      SessionConversationFreezeNamespace,
      "nexora.nea.session-conversation.freeze",
    );
    assert.equal(SessionConversationFreezeStatus, "Freeze");
    assert.equal(SessionConversationFreezeReadiness, "ReadyForPublicIndex");
    assert.equal(SessionConversationFreezePlatform.identity.phase, "NEA-3:8");
    assert.equal(SessionConversationFreezePlatform.identity.layer, "NEA");
    assert.equal(
      SessionConversationFreezePlatform.identity.certificationId,
      SessionConversationCertificationId,
    );
    assert.equal(
      SessionConversationFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      SessionConversationFreezePlatform.nextPhase,
      "NEA-3:9 — Session & Conversation Public Index",
    );
  });

  it("consumes only NEA-3:7 Certification and preserves certified reference", () => {
    const dependency = SessionConversationFreezePlatform.dependency;
    assert.equal(dependency.certificationOnly, true);
    assert.equal(dependency.certificationPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "sessionConversationCertification.ts",
    );
    assert.equal(
      dependency.certificationId,
      SessionConversationCertificationId,
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
      SessionConversationFreezePlatform.certification,
      SessionConversationCertificationPlatform,
    );
    assert.equal(
      SessionConversationFreezePlatform.certifiedPlatformReference
        .certification,
      SessionConversationCertificationPlatform,
    );
    assert.equal(
      SessionConversationFreezePlatform.certifiedPlatformReference.platform,
      SessionConversationCertificationPlatform.platform,
    );
  });

  it("declares seventeen freeze locks with all Locked status", () => {
    const locks = SessionConversationFreezePlatform.locks;
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
      locks.locks.some((item) => item.lockId === "SessionIdentityLock"),
    );
    assert.ok(
      locks.locks.some((item) => item.lockId === "ConversationIdentityLock"),
    );
  });

  it("declares ten compatibility entries and extension policy", () => {
    const { compatibility, extensions } = SessionConversationFreezePlatform;
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

  it("registers seven certified components and preserves session/conversation identities", () => {
    const registry = SessionConversationFreezePlatform.registry;
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
    assert.equal(registry.sessionIdentityCount, 8);
    assert.equal(registry.conversationIdentityCount, 8);
    assert.equal(registry.sessionIdentities.length, 8);
    assert.equal(registry.conversationIdentities.length, 8);
    assert.equal(
      registry.sessionIdentities,
      SessionConversationCertificationPlatform.platform.namespace.registry
        .collections.sessionIdentities,
    );
    assert.equal(
      registry.conversationIdentities,
      SessionConversationCertificationPlatform.platform.namespace.registry
        .collections.conversationIdentities,
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = SessionConversationFreezePlatform;
    assert.ok(ownership.owns.includes("Freeze State"));
    assert.ok(ownership.owns.includes("Compatibility Metadata"));
    assert.ok(ownership.owns.includes("Certified Platform Reference"));
    assert.ok(ownership.doesNotOwn.includes("Foundation Contracts"));
    assert.ok(ownership.doesNotOwn.includes("Certification Gates"));
    assert.ok(ownership.doesNotOwn.includes("Platform Composition"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Sessions"));
    assert.ok(ownership.doesNotOwn.includes("Executive Gateway Routing"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsCertificationGates, false);
    assert.equal(ownership.ownsRuntimeSessions, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime freeze logic"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Sessions"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Message Processing"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeFreezeLogic, false);
    assert.equal(boundaries.runtimeCertification, false);
    assert.equal(boundaries.managesRuntimeSessions, false);
    assert.equal(boundaries.duplicatesCertificationMetadata, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = SessionConversationFreezePlatform;
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
    const summaryA = getSessionConversationFreezeSummary();
    const summaryB = getSessionConversationFreezeSummary();
    const certificationSummary = getSessionConversationCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.freezeId, SessionConversationFreezeId);
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
    assert.equal(summaryA.sessionIdentityCount, 8);
    assert.equal(summaryA.conversationIdentityCount, 8);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 11);
    assert.equal(
      summaryA.nextPhase,
      "NEA-3:9 — Session & Conversation Public Index",
    );
    assert.equal(
      SessionConversationFreezePlatform.metadata.derivedFromCertification,
      true,
    );
    assert.equal(
      SessionConversationFreezePlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      SessionConversationFreezePlatform.metadata
        .duplicatesCertificationMetadata,
      false,
    );
  });

  it("declares ReadyForPublicIndex only and no forbidden runtime implementation", () => {
    assert.equal(
      SessionConversationFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      SessionConversationFreezePlatform.readiness.claimsReadyForPublicIndex,
      true,
    );
    assert.equal(
      SessionConversationFreezePlatform.readiness.claimsPublicIndexPublished,
      false,
    );
    assert.equal(
      SessionConversationFreezePlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(SessionConversationFreezePlatform.runtimeBehavior, false);
    assert.equal(SessionConversationFreezePlatform.runtimeFreezeLogic, false);
    assert.equal(
      SessionConversationFreezePlatform.runtimeCertification,
      false,
    );
    assert.equal(SessionConversationFreezePlatform.runtimeValidation, false);
    assert.equal(
      SessionConversationFreezePlatform.managesRuntimeSessions,
      false,
    );
    assert.equal(SessionConversationFreezePlatform.processesMessages, false);
    assert.equal(SessionConversationFreezePlatform.aiReasoning, false);
  });
});
