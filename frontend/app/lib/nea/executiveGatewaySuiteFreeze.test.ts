/**
 * NEA-8:8 — Executive Gateway Suite Freeze Tests.
 *
 * Deterministic coverage for the immutable Executive Gateway Suite Freeze.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ExecutiveGatewaySuiteCertificationId,
  ExecutiveGatewaySuiteCertificationPlatform,
  getExecutiveGatewaySuiteCertificationSummary,
} from "./executiveGatewaySuiteCertification.ts";
import * as FreezeModule from "./executiveGatewaySuiteFreeze.ts";
import {
  ExecutiveGatewaySuiteFreezeId,
  ExecutiveGatewaySuiteFreezeName,
  ExecutiveGatewaySuiteFreezeNamespace,
  ExecutiveGatewaySuiteFreezePlatform,
  ExecutiveGatewaySuiteFreezeReadiness,
  ExecutiveGatewaySuiteFreezeStatus,
  ExecutiveGatewaySuiteFreezeVersion,
  getExecutiveGatewaySuiteFreezeSummary,
} from "./executiveGatewaySuiteFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA88_FILES = Object.freeze([
  "executiveGatewaySuiteFreezeTypes.ts",
  "executiveGatewaySuiteFreezeRegistry.ts",
  "executiveGatewaySuiteFreezeCompatibility.ts",
  "executiveGatewaySuiteFreezeLocks.ts",
  "executiveGatewaySuiteFreezeExtensions.ts",
  "executiveGatewaySuiteFreezeMetadata.ts",
  "executiveGatewaySuiteFreeze.ts",
  "executiveGatewaySuiteFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveGatewaySuiteFreezeId",
  "ExecutiveGatewaySuiteFreezeVersion",
  "ExecutiveGatewaySuiteFreezeName",
  "ExecutiveGatewaySuiteFreezeNamespace",
  "ExecutiveGatewaySuiteFreezeStatus",
  "ExecutiveGatewaySuiteFreezeReadiness",
  "ExecutiveGatewaySuiteFreezePlatform",
  "getExecutiveGatewaySuiteFreezeSummary",
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

const EXPECTED_LOCK_IDS = Object.freeze([
  "FoundationLock",
  "RegistryLock",
  "ModelLock",
  "ValidationLock",
  "ManifestLock",
  "PlatformLock",
  "CertificationLock",
  "SuiteCompositionLock",
  "ComponentIdentityLock",
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

const EXPECTED_COMPATIBILITY_IDS = Object.freeze([
  "PlatformCompatibility",
  "NamespaceCompatibility",
  "ConsumerCompatibility",
  "SuiteCompositionCompatibility",
  "ComponentIdentityCompatibility",
  "PublicApiCompatibility",
  "InventoryCompatibility",
  "VersionCompatibility",
  "DependencyCompatibility",
  "CertificationCompatibility",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("NEA-8:8 Executive Gateway Suite Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(NEA88_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA88_FILES) {
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
      ExecutiveGatewaySuiteFreezeId,
      "NEA-8:8/ExecutiveGatewaySuiteFreeze",
    );
    assert.equal(ExecutiveGatewaySuiteFreezeVersion, "1.0.0");
    assert.equal(
      ExecutiveGatewaySuiteFreezeName,
      "Executive Gateway Suite Freeze",
    );
    assert.equal(
      ExecutiveGatewaySuiteFreezeNamespace,
      "nexora.nea.executive-gateway-suite.freeze",
    );
    assert.equal(ExecutiveGatewaySuiteFreezeStatus, "Freeze");
    assert.equal(
      ExecutiveGatewaySuiteFreezeReadiness,
      "ReadyForPublicIndex",
    );
    assert.equal(ExecutiveGatewaySuiteFreezePlatform.identity.phase, "NEA-8:8");
    assert.equal(
      ExecutiveGatewaySuiteFreezePlatform.identity.certificationId,
      ExecutiveGatewaySuiteCertificationId,
    );
    assert.equal(
      ExecutiveGatewaySuiteFreezePlatform.nextPhase,
      "NEA-8:9 — Executive Gateway Suite Public Index",
    );
  });

  it("consumes only NEA-8:7 Certification and preserves the canonical chain", () => {
    const dependency = ExecutiveGatewaySuiteFreezePlatform.dependency;
    assert.equal(dependency.certificationOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "executiveGatewaySuiteCertification.ts",
    );
    assert.equal(
      dependency.certificationId,
      ExecutiveGatewaySuiteCertificationId,
    );
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.duplicatesCertificationMetadata, false);
    assert.equal(
      ExecutiveGatewaySuiteFreezePlatform.certification,
      ExecutiveGatewaySuiteCertificationPlatform,
    );
    assert.equal(
      ExecutiveGatewaySuiteFreezePlatform.certifiedPlatformReference.platform,
      ExecutiveGatewaySuiteCertificationPlatform.platform,
    );

    const ns =
      ExecutiveGatewaySuiteFreezePlatform.certification.platform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
  });

  it("declares exactly 18 Locked locks with required fields", () => {
    const { locks } = ExecutiveGatewaySuiteFreezePlatform;
    assert.equal(locks.lockCount, 18);
    assert.equal(locks.lockedLockCount, 18);
    assert.equal(locks.allLocksActive, true);
    assert.deepEqual(
      locks.locks.map((item) => item.id),
      [...EXPECTED_LOCK_IDS],
    );
    assertUnique(
      locks.locks.map((item) => item.id),
      "lock ids",
    );
    assert.ok(locks.locks.every((item) => item.state === "Locked"));
    assert.ok(locks.locks.every((item) => item.name.length > 0));
    assert.ok(locks.locks.every((item) => item.description.length > 0));
    assert.ok(locks.locks.every((item) => item.rationale.length > 0));
    assert.ok(locks.locks.every((item) => item.executesRuntime === false));
  });

  it("declares exactly 10 Compatible compatibility declarations and extension policy", () => {
    const { compatibility, extensions, registry } =
      ExecutiveGatewaySuiteFreezePlatform;
    assert.equal(compatibility.compatibilityCount, 10);
    assert.equal(compatibility.allCompatible, true);
    assert.deepEqual(
      compatibility.declarations.map((item) => item.compatibilityId),
      [...EXPECTED_COMPATIBILITY_IDS],
    );
    assert.ok(
      compatibility.declarations.every((item) => item.compatible === true),
    );

    assert.equal(extensions.allowedExtensionCount, 4);
    assert.equal(extensions.forbiddenExtensionCount, 9);
    assert.ok(
      extensions.allowedExtensions.includes("Public Index publication"),
    );
    assert.ok(extensions.forbiddenExtensions.includes("Runtime behavior"));
    assert.ok(
      extensions.forbiddenExtensions.includes("Architecture changes"),
    );
    assert.equal(
      extensions.futurePublicIndexReadiness.nextPhase,
      "NEA-8:9 — Executive Gateway Suite Public Index",
    );

    assert.equal(registry.componentCount, 7);
    assert.equal(registry.suiteComponentCount, 7);
    assert.equal(
      registry.suiteComponents,
      ExecutiveGatewaySuiteCertificationPlatform.platform.namespace
        .suiteComponents,
    );
    assert.equal(
      registry.entries.certificationOutcome.outcome,
      "Pass",
    );
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = ExecutiveGatewaySuiteFreezePlatform;
    assert.ok(ownership.owns.includes("Freeze Identity"));
    assert.ok(ownership.owns.includes("Freeze Locks"));
    assert.ok(ownership.owns.includes("Freeze Extension Policy"));
    assert.ok(ownership.doesNotOwn.includes("Foundation"));
    assert.ok(ownership.doesNotOwn.includes("Certification"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Gateway"));
    assert.ok(ownership.doesNotOwn.includes("DKL"));
    assert.equal(ownership.ownsCertification, false);
    assert.equal(ownership.ownsRuntimeGateway, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Freeze"));
    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Gateway"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL invocation"));
    assert.equal(boundaries.runtimeFreezeLogic, false);
    assert.equal(boundaries.runtimeLocking, false);
    assert.equal(boundaries.platformDirectImport, false);
    assert.equal(boundaries.duplicatesCertificationMetadata, false);
  });

  it("preserves ordered platform sections and immutable collections", () => {
    const platform = ExecutiveGatewaySuiteFreezePlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 11), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 11);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.registry), true);
    assert.equal(Object.isFrozen(platform.locks), true);
    assert.equal(Object.isFrozen(platform.compatibility), true);
    assert.equal(Object.isFrozen(platform.extensions), true);
    assert.equal(Object.isFrozen(platform.metadata), true);
    assert.equal(Object.isFrozen(platform.summary), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary with public API inventory 532 and architecture count 820", () => {
    const summaryA = getExecutiveGatewaySuiteFreezeSummary();
    const summaryB = getExecutiveGatewaySuiteFreezeSummary();
    const certificationSummary = getExecutiveGatewaySuiteCertificationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.freezeId, ExecutiveGatewaySuiteFreezeId);
    assert.equal(summaryA.status, "Freeze");
    assert.equal(summaryA.readiness, "ReadyForPublicIndex");
    assert.equal(summaryA.certificationId, ExecutiveGatewaySuiteCertificationId);
    assert.equal(summaryA.certificationOutcome, "Pass");
    assert.equal(summaryA.lockCount, 18);
    assert.equal(summaryA.lockedLockCount, 18);
    assert.equal(summaryA.compatibilityCount, 10);
    assert.equal(summaryA.componentCount, 7);
    assert.equal(summaryA.suiteComponentCount, 7);
    assert.equal(summaryA.publicApiInventoryTotal, 532);
    assert.equal(
      summaryA.publicApiInventoryTotal,
      certificationSummary.publicApiInventoryTotal,
    );
    assert.equal(summaryA.totalArchitectureCount, 820);
    assert.equal(
      summaryA.totalArchitectureCount,
      certificationSummary.totalArchitectureCount,
    );
    assert.equal(summaryA.inventoryEntryCount, 20);
    assert.equal(summaryA.composedPhaseCount, 6);
    assert.equal(summaryA.allowedExtensionCount, 4);
    assert.equal(summaryA.forbiddenExtensionCount, 9);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 11);
    assert.equal(
      summaryA.nextPhase,
      "NEA-8:9 — Executive Gateway Suite Public Index",
    );
    assert.equal(
      ExecutiveGatewaySuiteFreezePlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteFreezePlatform.metadata.derivedFromCertification,
      true,
    );
    assert.equal(
      ExecutiveGatewaySuiteFreezePlatform.metadata.canonicalReferenceMode,
      "CertificationOnly",
    );
  });

  it("declares ReadyForPublicIndex only and no forbidden runtime implementation", () => {
    assert.equal(
      ExecutiveGatewaySuiteFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      ExecutiveGatewaySuiteFreezePlatform.readiness.claimsReadyForPublicIndex,
      true,
    );
    assert.equal(
      ExecutiveGatewaySuiteFreezePlatform.readiness.claimsPublicIndexPublished,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteFreezePlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(
      ExecutiveGatewaySuiteFreezePlatform.readiness.certificationOutcome,
      "Pass",
    );
    assert.equal(ExecutiveGatewaySuiteFreezePlatform.runtimeBehavior, false);
    assert.equal(ExecutiveGatewaySuiteFreezePlatform.runtimeFreezeLogic, false);
    assert.equal(ExecutiveGatewaySuiteFreezePlatform.runtimeLocking, false);
    assert.equal(
      ExecutiveGatewaySuiteFreezePlatform.implementsRuntimeGateway,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteFreezePlatform.invokesDkl, false);
    assert.equal(
      ExecutiveGatewaySuiteFreezePlatform.invokesExecutiveEngine,
      false,
    );
    assert.equal(ExecutiveGatewaySuiteFreezePlatform.invokesAssistant, false);
    assert.equal(ExecutiveGatewaySuiteFreezePlatform.aiReasoning, false);
    assert.equal(ExecutiveGatewaySuiteFreezePlatform.businessLogic, false);
  });
});
