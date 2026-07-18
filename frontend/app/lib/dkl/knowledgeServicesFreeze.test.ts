/**
 * DKL-7:8 — Knowledge Services Freeze Tests.
 *
 * Deterministic coverage for the immutable Knowledge Services Freeze.
 * No mocks. No randomness. No network. No databases. No source inspection.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  getKnowledgeServicesCertificationInventoryCount,
  KnowledgeServicesCertification,
  KnowledgeServicesCertificationId,
  KnowledgeServicesCertificationResult,
  KnowledgeServicesCertificationStatus,
} from "./knowledgeServicesCertification.ts";
import * as FreezeModule from "./knowledgeServicesFreeze.ts";
import {
  getKnowledgeServicesFreezeInventoryCount,
  getKnowledgeServicesFreezeSummary,
  KnowledgeServicesFreeze,
  KnowledgeServicesFreezeGuarantees,
  KnowledgeServicesFreezeId,
  KnowledgeServicesFreezeLock,
  KnowledgeServicesFreezeName,
  KnowledgeServicesFreezeNamespace,
  KnowledgeServicesFreezeReadiness,
  KnowledgeServicesFreezeRegistry,
  KnowledgeServicesFreezeStatus,
  KnowledgeServicesFreezeVersion,
} from "./knowledgeServicesFreeze.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL78_FILES = Object.freeze([
  "knowledgeServicesFreezeTypes.ts",
  "knowledgeServicesFreezeRegistry.ts",
  "knowledgeServicesFreezeBaselines.ts",
  "knowledgeServicesFreezeCompatibility.ts",
  "knowledgeServicesFreezeLocks.ts",
  "knowledgeServicesFreezeExtensions.ts",
  "knowledgeServicesFreeze.ts",
  "knowledgeServicesFreeze.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "KnowledgeServicesFreeze",
  "KnowledgeServicesFreezeId",
  "KnowledgeServicesFreezeName",
  "KnowledgeServicesFreezeVersion",
  "KnowledgeServicesFreezeNamespace",
  "KnowledgeServicesFreezeStatus",
  "KnowledgeServicesFreezeLock",
  "KnowledgeServicesFreezeReadiness",
  "KnowledgeServicesFreezeRegistry",
  "KnowledgeServicesFreezeGuarantees",
  "getKnowledgeServicesFreezeSummary",
  "getKnowledgeServicesFreezeInventoryCount",
] as const);

const CANONICAL_SECTIONS = Object.freeze([
  "identity",
  "metadata",
  "certification",
  "architecture",
  "registry",
  "components",
  "baselines",
  "locks",
  "dependencies",
  "ownership",
  "boundaries",
  "compatibility",
  "extensions",
  "publicIndexPreparation",
  "inventory",
  "guarantees",
  "status",
  "readiness",
] as const);

const COMPONENT_ORDER = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Platform",
  "Certification",
  "Freeze",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-7:8 Knowledge Services Freeze", () => {
  it("creates exactly eight Freeze files and twelve public exports", () => {
    assert.equal(DKL78_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL78_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FreezeModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FreezeModule).length, 12);
    assert.equal(KnowledgeServicesFreeze.publicApi.length, 12);
    assert.ok(
      !Object.keys(FreezeModule).some((name) =>
        /mutex|semaphore|handler|executor|client|adapter|publicIndex/i.test(
          name,
        ),
      ),
    );
  });

  it("has exact identity, Frozen status, lock, and ReadyForPublicIndex", () => {
    assert.equal(KnowledgeServicesFreezeId, "DKL-7:8/KnowledgeServicesFreeze");
    assert.equal(KnowledgeServicesFreezeName, "Knowledge Services Freeze");
    assert.equal(KnowledgeServicesFreezeVersion, "1.0.0");
    assert.equal(
      KnowledgeServicesFreezeNamespace,
      "nexora.dkl.knowledge-services.freeze",
    );
    assert.equal(KnowledgeServicesFreezeStatus, "Frozen");
    assert.equal(
      KnowledgeServicesFreeze.certificationStatus,
      KnowledgeServicesCertificationStatus,
    );
    assert.equal(
      KnowledgeServicesFreeze.certificationResult,
      KnowledgeServicesCertificationResult,
    );
    assert.equal(
      KnowledgeServicesFreeze.architectureStatus,
      "StableAndFrozen",
    );
    assert.equal(
      KnowledgeServicesFreezeLock,
      "DKL-7-KNOWLEDGE-SERVICES-LOCKED",
    );
    assert.equal(KnowledgeServicesFreezeReadiness, "ReadyForPublicIndex");
    assert.equal(KnowledgeServicesFreeze.identity.status, "Frozen");
    assert.equal(KnowledgeServicesFreeze.identity.certificationStatus, "Certified");
    assert.equal(KnowledgeServicesFreeze.identity.certificationResult, "Pass");
  });

  it("consumes Certification only and preserves the canonical chain by reference", () => {
    assert.equal(
      KnowledgeServicesFreeze.certification,
      KnowledgeServicesCertification,
    );
    assert.equal(
      KnowledgeServicesFreeze.dependencyDeclarations.directPreviousPhaseModule,
      "knowledgeServicesCertification.ts",
    );
    assert.equal(
      KnowledgeServicesFreeze.dependencyDeclarations.certificationOnly,
      true,
    );
    assert.equal(
      KnowledgeServicesFreeze.dependencyDeclarations.platformDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesFreeze.dependencyDeclarations.manifestDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesFreeze.dependencyDeclarations.validationDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesFreeze.dependencyDeclarations.modelDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesFreeze.dependencyDeclarations.registryDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesFreeze.dependencyDeclarations.foundationDirectImport,
      false,
    );
    assert.equal(
      KnowledgeServicesFreeze.dependencyDeclarations.dkl6DirectImport,
      false,
    );

    const cert = KnowledgeServicesFreeze.certification;
    const platform = cert.platform;
    const manifest = platform.manifest;
    const validation = manifest.validation;
    const model = validation.model;
    const registry = model.registry;
    const foundation = registry.foundation;

    assert.equal(cert.identity.certificationId, KnowledgeServicesCertificationId);
    assert.equal(platform, cert.platform);
    assert.equal(manifest, platform.manifest);
    assert.equal(validation, manifest.validation);
    assert.equal(model, validation.model);
    assert.equal(registry, model.registry);
    assert.equal(foundation, registry.foundation);
    assert.ok(platform.identity.dkl6PublicIndexId.length > 0);
  });

  it("preserves exact canonical section order with 18 sections", () => {
    const keys = Object.keys(KnowledgeServicesFreeze);
    assert.deepEqual(keys.slice(0, 18), [...CANONICAL_SECTIONS]);
    assert.equal(CANONICAL_SECTIONS.length, 18);
  });

  it("registers eight Certified Frozen Protected components", () => {
    assert.equal(KnowledgeServicesFreeze.components.length, 8);
    assert.equal(KnowledgeServicesFreezeRegistry.componentCount, 8);
    assert.equal(KnowledgeServicesFreezeRegistry.certifiedCount, 8);
    assert.equal(KnowledgeServicesFreezeRegistry.frozenCount, 8);
    assert.equal(KnowledgeServicesFreezeRegistry.protectedCount, 8);
    assert.equal(KnowledgeServicesFreezeRegistry.failedCount, 0);
    assertUnique(
      KnowledgeServicesFreeze.components.map((item) => item.componentId),
      "component IDs",
    );
    assert.deepEqual(
      KnowledgeServicesFreeze.components.map((item) => item.stage),
      [...COMPONENT_ORDER],
    );
    for (const item of KnowledgeServicesFreeze.components) {
      assert.equal(item.certifiedStatus, "Certified");
      assert.equal(item.freezeStatus, "Frozen");
      assert.equal(item.protectionStatus, "Protected");
      assert.equal(item.runtimeBehavior, "None");
    }
    assert.equal(
      KnowledgeServicesFreeze.certification,
      KnowledgeServicesCertification,
    );
  });

  it("declares eighteen FrozenAndMatched baselines preserving certified inventories", () => {
    assert.equal(KnowledgeServicesFreeze.baselines.length, 18);
    assertUnique(
      KnowledgeServicesFreeze.baselines.map((item) => item.baselineId),
      "baseline IDs",
    );
    for (const item of KnowledgeServicesFreeze.baselines) {
      assert.equal(item.status, "FrozenAndMatched");
      assert.equal(item.certifiedValue, item.frozenValue);
    }

    const platform = KnowledgeServicesFreeze.certification.platform;
    assert.equal(platform.ownership.ownedCount, 6);
    assert.equal(platform.ownership.nonOwnedCount, 24);
    assert.equal(platform.boundaries.prohibitedSurfaceCount, 29);
    assert.equal(platform.services.length, 12);
    assert.equal(platform.capabilities.length, 12);
    assert.equal(platform.contracts.length, 11);
    assert.equal(platform.inventory.accessModeCount, 10);
    assert.equal(platform.inventory.mutationModeCount, 0);
    assert.equal(platform.model.totalInventoryCount, 79);
    assert.equal(platform.model.relationshipCount, 28);
    assert.equal(platform.validation.passCount, 48);
    assert.equal(platform.validation.failCount, 0);
    assert.equal(platform.manifest.inventory.totalEntryCount, 447);
    assert.equal(platform.inventory.totalEntryCount, 527);
    assert.equal(getKnowledgeServicesCertificationInventoryCount(), 137);
    assert.equal(
      KnowledgeServicesFreeze.certification.resultInventory.passed,
      18,
    );
    assert.equal(
      KnowledgeServicesFreeze.certification.resultInventory.failed,
      0,
    );
    assert.equal(KnowledgeServicesFreeze.runtimeBehavior, false);
    assert.ok(KnowledgeServicesFreeze.baselineMatches);
  });

  it("activates twelve Locked architectural locks", () => {
    assert.equal(KnowledgeServicesFreeze.locks.length, 12);
    assertUnique(
      KnowledgeServicesFreeze.locks.map((item) => item.lockId),
      "lock IDs",
    );
    for (const item of KnowledgeServicesFreeze.locks) {
      assert.equal(item.lockStatus, "Locked");
      assert.equal(item.runtimeEnforcement, false);
    }
    const lockIds = KnowledgeServicesFreeze.locks.map((item) => item.lockId);
    assert.ok(lockIds.includes("LOCK-KS-PUBLIC-API"));
    assert.ok(lockIds.includes("LOCK-KS-DEPENDENCY-CHAIN"));
    assert.ok(lockIds.includes("LOCK-KS-OWNERSHIP"));
    assert.ok(lockIds.includes("LOCK-KS-BOUNDARY"));
    assert.ok(lockIds.includes("LOCK-KS-SERVICE-INVENTORY"));
    assert.ok(lockIds.includes("LOCK-KS-CAPABILITY-INVENTORY"));
    assert.ok(lockIds.includes("LOCK-KS-CONTRACT-INVENTORY"));
    assert.ok(lockIds.includes("LOCK-KS-MODEL-INVENTORY"));
    assert.ok(lockIds.includes("LOCK-KS-VALIDATION-STATE"));
    assert.ok(lockIds.includes("LOCK-KS-COMPATIBILITY"));
    assert.ok(lockIds.includes("LOCK-KS-RUNTIME-PROHIBITION"));
    assert.ok(lockIds.includes("LOCK-KS-CERTIFICATION-BASELINE"));
    assert.equal(KnowledgeServicesFreeze.allLocksActive, true);
  });

  it("declares twelve dependencies and eighteen Compatible Frozen declarations", () => {
    assert.equal(KnowledgeServicesFreeze.dependencies.length, 12);
    assertUnique(
      KnowledgeServicesFreeze.dependencies.map((item) => item.dependencyId),
      "dependency IDs",
    );

    const publicIndexDep = KnowledgeServicesFreeze.dependencies.find((item) =>
      item.source.includes("PublicIndex"),
    );
    assert.ok(publicIndexDep);
    assert.equal(publicIndexDep.target, KnowledgeServicesFreezeId);

    for (const item of KnowledgeServicesFreeze.dependencies) {
      assert.equal(item.runtimeAuthorization, "None");
      assert.equal(item.introducesFutureImport, false);
    }

    const consumerDeps = KnowledgeServicesFreeze.dependencies.filter((item) =>
      item.dependencyType === "FutureConsumer",
    );
    assert.equal(consumerDeps.length, 3);
    for (const item of consumerDeps) {
      assert.ok(item.target.includes("PublicIndex"));
    }

    assert.equal(KnowledgeServicesFreeze.compatibility.length, 18);
    assertUnique(
      KnowledgeServicesFreeze.compatibility.map((item) => item.compatibilityId),
      "compatibility IDs",
    );
    for (const item of KnowledgeServicesFreeze.compatibility) {
      assert.equal(item.status, "Compatible");
      assert.equal(item.freezeStatus, "Frozen");
      assert.equal(item.runtimeAuthorization, "None");
    }
  });

  it("declares eight safe extension policies and Public Index preparation", () => {
    assert.equal(KnowledgeServicesFreeze.extensions.length, 8);
    assertUnique(
      KnowledgeServicesFreeze.extensions.map((item) => item.extensionId),
      "extension IDs",
    );
    for (const item of KnowledgeServicesFreeze.extensions) {
      assert.ok(
        item.changeClass === "Additive" || item.changeClass === "Versioned",
      );
      assert.equal(item.backwardCompatibilityRequirement, true);
      assert.equal(item.ownershipPreservation, true);
      assert.equal(item.boundaryPreservation, true);
      assert.equal(item.certificationRequirement, true);
      assert.equal(item.reFreezeRequirement, true);
      assert.equal(item.versioningRequirement, true);
      assert.equal(item.runtimeAuthorization, "None");
    }

    const prep = KnowledgeServicesFreeze.publicIndexPreparation;
    assert.equal(prep.freezeStatus, "Frozen");
    assert.equal(prep.certificationStatus, "Certified");
    assert.equal(prep.certificationResult, "Pass");
    assert.equal(prep.allComponentsFrozen, true);
    assert.equal(prep.allBaselinesMatch, true);
    assert.equal(prep.allLocksActive, true);
    assert.equal(prep.allCompatibilityCompatible, true);
    assert.equal(prep.allExtensionPoliciesSafe, true);
    assert.equal(prep.mutationModesRemainZero, true);
    assert.equal(prep.runtimeBehaviorRemainsAbsent, true);
    assert.equal(prep.readiness, "ReadyForPublicIndex");
    assert.equal(prep.publicIndexImplemented, false);
    assert.equal(prep.released, false);
    assert.equal(prep.readyForConsumer, false);
    assert.equal(KnowledgeServicesFreeze.publicIndexImplemented, false);
  });

  it("declares twenty-four guarantees, is immutable, and returns inventory 121", () => {
    assert.equal(KnowledgeServicesFreezeGuarantees.length, 24);
    assertUnique(
      KnowledgeServicesFreezeGuarantees.map((item) => item.guaranteeId),
      "guarantee IDs",
    );

    assert.equal(Object.isFrozen(KnowledgeServicesFreeze), true);
    assert.equal(Object.isFrozen(KnowledgeServicesFreeze.components), true);
    assert.equal(Object.isFrozen(KnowledgeServicesFreeze.baselines), true);
    assert.equal(Object.isFrozen(KnowledgeServicesFreeze.locks), true);
    assert.equal(Object.isFrozen(KnowledgeServicesFreeze.compatibility), true);
    assert.equal(Object.isFrozen(KnowledgeServicesFreeze.extensions), true);

    assert.equal(KnowledgeServicesFreeze.runtimeBehavior, false);
    assert.equal(KnowledgeServicesFreeze.runtimeLocking, false);
    assert.equal(KnowledgeServicesFreeze.serviceExecution, false);
    assert.equal(KnowledgeServicesFreeze.repositoryAccess, false);
    assert.equal(KnowledgeServicesFreeze.searchExecution, false);
    assert.equal(KnowledgeServicesFreeze.graphTraversal, false);
    assert.equal(KnowledgeServicesFreeze.aiBehavior, false);
    assert.equal(KnowledgeServicesFreeze.transportBehavior, false);
    assert.equal(KnowledgeServicesFreeze.authenticationBehavior, false);
    assert.equal(KnowledgeServicesFreeze.authorizationBehavior, false);
    assert.equal(KnowledgeServicesFreeze.mutationBehavior, false);

    assert.equal(KnowledgeServicesFreeze.architecture.completedPhaseCount, 8);
    assert.equal(KnowledgeServicesFreeze.architecture.futurePhaseCount, 1);
    assert.equal(KnowledgeServicesFreeze.architecture.totalPhaseCount, 9);

    const summaryA = getKnowledgeServicesFreezeSummary();
    const summaryB = getKnowledgeServicesFreezeSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.freezeId, KnowledgeServicesFreezeId);
    assert.equal(summaryA.status, "Frozen");
    assert.equal(summaryA.lock, KnowledgeServicesFreezeLock);
    assert.equal(summaryA.readiness, "ReadyForPublicIndex");
    assert.equal(summaryA.manifestInventoryCount, 447);
    assert.equal(summaryA.platformInventoryCount, 527);
    assert.equal(summaryA.certificationInventoryCount, 137);
    assert.equal(summaryA.runtimeBehaviorStatus, "Absent");
    assert.equal(summaryA.freezeInventoryCount, 121);

    const expected =
      8 +
      1 +
      KnowledgeServicesFreeze.components.length +
      KnowledgeServicesFreeze.baselines.length +
      KnowledgeServicesFreeze.locks.length +
      KnowledgeServicesFreeze.dependencies.length +
      KnowledgeServicesFreeze.compatibility.length +
      KnowledgeServicesFreeze.extensions.length +
      KnowledgeServicesFreeze.guarantees.length +
      KnowledgeServicesFreeze.publicApi.length;
    assert.equal(expected, 121);
    assert.equal(getKnowledgeServicesFreezeInventoryCount(), expected);
    assert.equal(
      KnowledgeServicesFreeze.inventory.countingRule,
      "8+1+8+18+12+12+18+8+24+12",
    );
  });
});
