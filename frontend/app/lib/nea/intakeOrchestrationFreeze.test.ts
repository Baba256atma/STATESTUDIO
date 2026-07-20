/**
 * NEA-7:8 — Intake Orchestration Freeze Tests.
 *
 * Deterministic coverage for the immutable Intake Orchestration Freeze.
 * No mocks. No randomness. No network. No databases. No system time.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  IntakeOrchestrationCertificationId,
  IntakeOrchestrationCertificationPlatform,
  getIntakeOrchestrationCertificationSummary,
} from "./intakeOrchestrationCertification.ts";
import * as FreezeModule from "./intakeOrchestrationFreeze.ts";
import {
  IntakeOrchestrationFreezeId,
  IntakeOrchestrationFreezeName,
  IntakeOrchestrationFreezeNamespace,
  IntakeOrchestrationFreezePlatform,
  IntakeOrchestrationFreezeReadiness,
  IntakeOrchestrationFreezeStatus,
  IntakeOrchestrationFreezeVersion,
  getIntakeOrchestrationFreezeSummary,
} from "./intakeOrchestrationFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const NEA78_FILES = Object.freeze([
  "intakeOrchestrationFreezeTypes.ts",
  "intakeOrchestrationFreezeRegistry.ts",
  "intakeOrchestrationFreezeCompatibility.ts",
  "intakeOrchestrationFreezeLocks.ts",
  "intakeOrchestrationFreezeExtensions.ts",
  "intakeOrchestrationFreezeMetadata.ts",
  "intakeOrchestrationFreeze.ts",
  "intakeOrchestrationFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "IntakeOrchestrationFreezeId",
  "IntakeOrchestrationFreezeVersion",
  "IntakeOrchestrationFreezeName",
  "IntakeOrchestrationFreezeNamespace",
  "IntakeOrchestrationFreezeStatus",
  "IntakeOrchestrationFreezeReadiness",
  "IntakeOrchestrationFreezePlatform",
  "getIntakeOrchestrationFreezeSummary",
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
  "ExecutiveIntakePackageLock",
  "IntakeIdentityRegistryLock",
  "ReferenceRegistryLock",
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
  "ExecutiveIntakePackageCompatibility",
  "RegistryCompatibility",
  "PublicApiCompatibility",
  "InventoryCompatibility",
  "VersionCompatibility",
  "DependencyCompatibility",
  "CertificationCompatibility",
] as const);

describe("NEA-7:8 Intake Orchestration Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    assert.equal(NEA78_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of NEA78_FILES) {
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
      IntakeOrchestrationFreezeId,
      "NEA-7:8/IntakeOrchestrationFreeze",
    );
    assert.equal(IntakeOrchestrationFreezeVersion, "1.0.0");
    assert.equal(
      IntakeOrchestrationFreezeName,
      "Intake Orchestration Freeze",
    );
    assert.equal(
      IntakeOrchestrationFreezeNamespace,
      "nexora.nea.intake-orchestration.freeze",
    );
    assert.equal(IntakeOrchestrationFreezeStatus, "Freeze");
    assert.equal(IntakeOrchestrationFreezeReadiness, "ReadyForPublicIndex");
    assert.equal(IntakeOrchestrationFreezePlatform.identity.phase, "NEA-7:8");
    assert.equal(IntakeOrchestrationFreezePlatform.identity.layer, "NEA");
    assert.equal(
      IntakeOrchestrationFreezePlatform.identity.certificationId,
      IntakeOrchestrationCertificationId,
    );
    assert.equal(
      IntakeOrchestrationFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      IntakeOrchestrationFreezePlatform.nextPhase,
      "NEA-7:9 — Intake Orchestration Public Index",
    );
  });

  it("consumes only NEA-7:7 Certification and preserves certified reference", () => {
    const dependency = IntakeOrchestrationFreezePlatform.dependency;
    assert.equal(dependency.certificationOnly, true);
    assert.equal(dependency.certificationPublicSurfaceOnly, true);
    assert.equal(
      dependency.directPreviousPhaseModule,
      "intakeOrchestrationCertification.ts",
    );
    assert.equal(
      dependency.certificationId,
      IntakeOrchestrationCertificationId,
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
      IntakeOrchestrationFreezePlatform.certification,
      IntakeOrchestrationCertificationPlatform,
    );
    assert.equal(
      IntakeOrchestrationFreezePlatform.certifiedPlatformReference
        .certification,
      IntakeOrchestrationCertificationPlatform,
    );
    assert.equal(
      IntakeOrchestrationFreezePlatform.certifiedPlatformReference.platform,
      IntakeOrchestrationCertificationPlatform.platform,
    );

    const ns =
      IntakeOrchestrationFreezePlatform.certification.platform.namespace;
    assert.equal(ns.foundation, ns.registry.foundationPlatform);
    assert.equal(ns.registry, ns.model.registryPlatform);
    assert.equal(ns.model, ns.validation.modelPlatform);
    assert.equal(ns.validation, ns.manifest.validationPlatform);
  });

  it("declares seventeen freeze locks with all Locked status", () => {
    const locks = IntakeOrchestrationFreezePlatform.locks;
    assert.equal(locks.lockCount, 17);
    assert.deepEqual(
      locks.locks.map((item) => item.lockId),
      [...EXPECTED_LOCKS],
    );
    assert.equal(locks.lockedLockCount, 17);
    assert.equal(locks.allLocksActive, true);
    assert.ok(locks.locks.every((item) => item.status === "Locked"));
    assert.ok(locks.locks.every((item) => item.executesRuntime === false));
  });

  it("declares ten Compatible declarations and extension policy 4/9", () => {
    const { compatibility, extensions } = IntakeOrchestrationFreezePlatform;
    assert.equal(compatibility.compatibilityCount, 10);
    assert.equal(compatibility.allCompatible, true);
    assert.deepEqual(
      compatibility.declarations.map((item) => item.compatibilityId),
      [...EXPECTED_COMPATIBILITY],
    );
    assert.ok(
      compatibility.declarations.every((item) => item.compatible === true),
    );
    assert.equal(extensions.allowedExtensionCount, 4);
    assert.equal(extensions.forbiddenExtensionCount, 9);
    assert.deepEqual([...extensions.allowedExtensions], [
      "Future NEA Versions",
      "Additive Public APIs",
      "Metadata Extensions",
      "Documentation Extensions",
    ]);
    assert.deepEqual([...extensions.forbiddenExtensions], [
      "Runtime Orchestration",
      "Runtime Intake Assembly",
      "Runtime Validation",
      "Breaking Public APIs",
      "Contract Mutation",
      "Registry Mutation",
      "Model Mutation",
      "Inventory Reconstruction",
      "Dependency Direction Changes",
    ]);
    assert.equal(
      extensions.futurePublicIndexReadiness.readiness,
      "ReadyForPublicIndex",
    );
  });

  it("freezes seven components and preserves Certification inventory by reference", () => {
    const { registry } = IntakeOrchestrationFreezePlatform;
    const certPlatform = IntakeOrchestrationCertificationPlatform.platform;
    assert.equal(registry.componentCount, 7);
    assert.equal(
      registry.intakeIdentities,
      certPlatform.namespace.registry.collections.intakeIdentities,
    );
    assert.equal(
      registry.referenceTypes,
      certPlatform.namespace.registry.collections.referenceTypes,
    );
    assert.equal(
      registry.canonicalExecutiveIntakePackageContracts,
      certPlatform.namespace.foundation.contracts
        .canonicalExecutiveIntakePackageContracts,
    );
    assert.equal(registry.intakeIdentityCount, 8);
    assert.equal(registry.referenceTypeCount, 10);
    assert.equal(registry.canonicalExecutiveIntakePackageCount, 1);
  });

  it("declares ownership and forbidden boundaries without runtime behavior", () => {
    const { ownership, boundaries } = IntakeOrchestrationFreezePlatform;
    assert.ok(ownership.owns.includes("Freeze Locks"));
    assert.ok(ownership.owns.includes("Extension Policy"));
    assert.ok(ownership.owns.includes("Freeze Registry"));
    assert.ok(ownership.doesNotOwn.includes("Certification Gates"));
    assert.ok(ownership.doesNotOwn.includes("Runtime Orchestration"));
    assert.ok(ownership.doesNotOwn.includes("Contracts"));
    assert.equal(ownership.ownsCertificationGates, false);
    assert.equal(ownership.ownsRuntimeOrchestration, false);

    assert.ok(boundaries.prohibitedSurfaces.includes("Runtime Freeze"));
    assert.ok(boundaries.prohibitedSurfaces.includes("DKL Invocation"));
    assert.ok(boundaries.prohibitedSurfaces.includes("HTTP"));
    assert.equal(boundaries.runtimeFreezeLogic, false);
    assert.equal(boundaries.runtimeLocking, false);
    assert.equal(boundaries.assemblesRuntimePackage, false);
    assert.equal(boundaries.invokesDkl, false);
    assert.equal(boundaries.reconstructsInventories, false);
  });

  it("preserves ordered freeze sections and immutable collections", () => {
    const platform = IntakeOrchestrationFreezePlatform;
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
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.summary), true);
    assert.equal(Object.isFrozen(platform.readiness), true);
  });

  it("derives deterministic summary from Certification inventory collections", () => {
    const summaryA = getIntakeOrchestrationFreezeSummary();
    const summaryB = getIntakeOrchestrationFreezeSummary();
    const certificationSummary = getIntakeOrchestrationCertificationSummary();
    const platformMeta =
      IntakeOrchestrationCertificationPlatform.platform.metadata;
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.freezeId, IntakeOrchestrationFreezeId);
    assert.equal(summaryA.status, "Freeze");
    assert.equal(summaryA.readiness, "ReadyForPublicIndex");
    assert.equal(summaryA.certificationId, certificationSummary.certificationId);
    assert.equal(summaryA.certificationOutcome, "Pass");
    assert.equal(summaryA.lockCount, 17);
    assert.equal(summaryA.lockedLockCount, 17);
    assert.equal(summaryA.compatibilityCount, 10);
    assert.equal(summaryA.componentCount, 7);
    assert.equal(summaryA.allowedExtensionCount, 4);
    assert.equal(summaryA.forbiddenExtensionCount, 9);
    assert.equal(
      summaryA.inventoryEntryCount,
      platformMeta.inventoryEntryCount,
    );
    assert.equal(
      summaryA.totalArchitectureCount,
      platformMeta.totalArchitectureCount,
    );
    assert.equal(summaryA.composedPhaseCount, platformMeta.composedPhaseCount);
    assert.equal(summaryA.inventoryEntryCount, 20);
    assert.equal(summaryA.totalArchitectureCount, 323);
    assert.equal(summaryA.composedPhaseCount, 6);
    assert.equal(summaryA.publicExportCount, 8);
    assert.equal(summaryA.sectionCount, 11);
    assert.equal(
      summaryA.nextPhase,
      "NEA-7:9 — Intake Orchestration Public Index",
    );
    assert.equal(
      IntakeOrchestrationFreezePlatform.metadata.derivedFromCertification,
      true,
    );
    assert.equal(
      IntakeOrchestrationFreezePlatform.metadata.countsHardcoded,
      false,
    );
    assert.equal(
      IntakeOrchestrationFreezePlatform.metadata.runtimeBehavior,
      false,
    );
    assert.equal(
      IntakeOrchestrationFreezePlatform.metadata.runtimeFreeze,
      false,
    );
    assert.equal(
      IntakeOrchestrationFreezePlatform.metadata.runtimeLocking,
      false,
    );
    assert.equal(
      IntakeOrchestrationFreezePlatform.metadata.assemblesRuntimePackage,
      false,
    );
    assert.equal(IntakeOrchestrationFreezePlatform.metadata.invokesDKL, false);
  });

  it("declares ReadyForPublicIndex only and no forbidden runtime implementation", () => {
    assert.equal(
      IntakeOrchestrationFreezePlatform.readiness.readiness,
      "ReadyForPublicIndex",
    );
    assert.equal(
      IntakeOrchestrationFreezePlatform.readiness.claimsReadyForPublicIndex,
      true,
    );
    assert.equal(
      IntakeOrchestrationFreezePlatform.readiness.claimsPublicIndexPublished,
      false,
    );
    assert.equal(
      IntakeOrchestrationFreezePlatform.readiness.claimsRuntimeReady,
      false,
    );
    assert.equal(IntakeOrchestrationFreezePlatform.runtimeBehavior, false);
    assert.equal(IntakeOrchestrationFreezePlatform.runtimeFreezeLogic, false);
    assert.equal(IntakeOrchestrationFreezePlatform.runtimeLocking, false);
    assert.equal(
      IntakeOrchestrationFreezePlatform.runtimeOrchestration,
      false,
    );
    assert.equal(
      IntakeOrchestrationFreezePlatform.assemblesRuntimePackage,
      false,
    );
    assert.equal(IntakeOrchestrationFreezePlatform.aiReasoning, false);
    assert.equal(IntakeOrchestrationFreezePlatform.invokesDkl, false);
  });
});
