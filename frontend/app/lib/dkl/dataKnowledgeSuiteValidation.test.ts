/**
 * DKL-9:4 — Data Knowledge Suite Validation Tests.
 *
 * Deterministic coverage for Suite composition validation.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  DataKnowledgeSuiteModelId,
  DataKnowledgeSuiteModelPlatform,
} from "./dataKnowledgeSuiteModel.ts";
import * as ValidationModule from "./dataKnowledgeSuiteValidation.ts";
import {
  DataKnowledgeSuiteValidationId,
  DataKnowledgeSuiteValidationName,
  DataKnowledgeSuiteValidationNamespace,
  DataKnowledgeSuiteValidationPlatform,
  DataKnowledgeSuiteValidationReadiness,
  DataKnowledgeSuiteValidationStatus,
  DataKnowledgeSuiteValidationVersion,
  getDataKnowledgeSuiteValidationSummary,
} from "./dataKnowledgeSuiteValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL94_FILES = Object.freeze([
  "dataKnowledgeSuiteValidationTypes.ts",
  "dataKnowledgeSuiteValidationRules.ts",
  "dataKnowledgeSuiteValidationCategories.ts",
  "dataKnowledgeSuiteValidationGates.ts",
  "dataKnowledgeSuiteValidationInventory.ts",
  "dataKnowledgeSuiteValidationReports.ts",
  "dataKnowledgeSuiteValidation.ts",
  "dataKnowledgeSuiteValidation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "DataKnowledgeSuiteValidationId",
  "DataKnowledgeSuiteValidationVersion",
  "DataKnowledgeSuiteValidationName",
  "DataKnowledgeSuiteValidationNamespace",
  "DataKnowledgeSuiteValidationStatus",
  "DataKnowledgeSuiteValidationReadiness",
  "DataKnowledgeSuiteValidationPlatform",
  "getDataKnowledgeSuiteValidationSummary",
] as const);

const EXPECTED_GATES = Object.freeze([
  "IdentityGate",
  "DependencyGate",
  "CompositionGate",
  "CapabilityCatalogGate",
  "ReferenceIntegrityGate",
  "PlatformGate",
  "ApiRegistryGate",
  "OwnershipGate",
  "BoundaryGate",
  "InventoryGate",
  "ReadinessGate",
  "CompatibilityGate",
  "DeterminismGate",
  "ImmutabilityGate",
  "CanonicalInventoryGate",
  "ManifestReadinessGate",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-9:4 Data Knowledge Suite Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    assert.equal(DKL94_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL94_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ValidationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ValidationModule).length, 8);
  });

  it("has canonical identity, ValidationDefined status, and ReadyForManifest", () => {
    assert.equal(
      DataKnowledgeSuiteValidationId,
      "DKL-9:4/DataKnowledgeSuiteValidation",
    );
    assert.equal(DataKnowledgeSuiteValidationVersion, "1.0.0");
    assert.equal(
      DataKnowledgeSuiteValidationName,
      "Data Knowledge Suite Validation",
    );
    assert.equal(
      DataKnowledgeSuiteValidationNamespace,
      "nexora.dkl.data-knowledge-suite.validation",
    );
    assert.equal(DataKnowledgeSuiteValidationStatus, "ValidationDefined");
    assert.equal(DataKnowledgeSuiteValidationReadiness, "ReadyForManifest");
    assert.equal(
      DataKnowledgeSuiteValidationPlatform.nextPhase,
      "DKL-9:5 — Data Knowledge Suite Manifest",
    );
  });

  it("consumes only Model with no Foundation, Registry, or DKL-1…DKL-8 imports", () => {
    const dependency = DataKnowledgeSuiteValidationPlatform.dependency;
    assert.equal(
      dependency.directPreviousPhaseModule,
      "dataKnowledgeSuiteModel.ts",
    );
    assert.equal(dependency.modelOnly, true);
    assert.equal(dependency.modelId, DataKnowledgeSuiteModelId);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.dkl1DirectImport, false);
    assert.equal(dependency.dkl8DirectImport, false);
    assert.equal(dependency.reconstructsModel, false);
    assert.equal(dependency.revalidatesUpstreamCapabilities, false);
    assert.equal(
      DataKnowledgeSuiteValidationPlatform.model,
      DataKnowledgeSuiteModelPlatform,
    );
  });

  it("defines exactly 48 unique rules and 16 unique passing gates", () => {
    const platform = DataKnowledgeSuiteValidationPlatform;
    assert.equal(platform.rules.length, 48);
    assert.equal(platform.gateCount, 16);
    assert.equal(platform.gates.length, 16);
    assertUnique(
      platform.rules.map((item) => item.id),
      "rule IDs",
    );
    assertUnique(
      platform.gates.map((item) => item.id),
      "gate IDs",
    );
    assert.deepEqual(
      platform.gates.map((item) => item.name),
      [...EXPECTED_GATES],
    );
    assert.ok(platform.rules.every((item) => item.outcome === "Pass"));
    assert.ok(platform.gates.every((item) => item.outcome === "Pass"));
    assert.ok(platform.rules.every((item) => item.required === true));
    assert.ok(platform.rules.every((item) => item.status === "Active"));
    assert.equal(platform.categories.length, 12);
    assert.equal(platform.validationOutcome, "Pass");
  });

  it("validates capability catalog, ordering, and dependency graph", () => {
    const model = DataKnowledgeSuiteModelPlatform;
    assert.equal(model.capabilities.length, 8);
    assert.deepEqual(
      model.capabilities.map((item) => item.capabilityId),
      ["DKL-1", "DKL-2", "DKL-3", "DKL-4", "DKL-5", "DKL-6", "DKL-7", "DKL-8"],
    );
    assert.deepEqual(
      model.capabilityOrdering.map((item) => item.capabilityId),
      model.capabilities.map((item) => item.capabilityId),
    );
    assert.equal(
      model.capabilityDependencies[0]!.dependencyRegistration.priorCapabilityId,
      null,
    );
    assert.equal(
      model.capabilityDependencies[7]!.dependencyRegistration.priorCapabilityId,
      "DKL-7",
    );
  });

  it("preserves platform and API registry references through Model", () => {
    const validation = DataKnowledgeSuiteValidationPlatform;
    const model = DataKnowledgeSuiteModelPlatform;
    assert.equal(validation.model, model);
    assert.equal(
      model.publicPlatformReferences[0]!.publicPlatformRegistration,
      model.registry.publicPlatforms[0],
    );
    assert.equal(
      model.publicApiRegistryReferences[0]!.publicApiRegistryRef,
      model.registry.publicApiRegistryRefs[0],
    );
    assert.equal(
      model.ownershipReferences[0]!.ownership,
      model.registry.ownership,
    );
    assert.equal(
      model.boundaryReferences[0]!.boundaries,
      model.registry.boundaries,
    );
  });

  it("satisfies Canonical Inventory Rule through Model-derived counts", () => {
    const inventory = DataKnowledgeSuiteValidationPlatform.inventory;
    const modelInventory = DataKnowledgeSuiteModelPlatform.inventory;
    assert.equal(inventory.sourcedThroughModel, true);
    assert.equal(inventory.reconstructed, false);
    assert.equal(inventory.hardcoded, false);
    assert.equal(inventory.duplicated, false);
    assert.equal(inventory.modelInventory, modelInventory);
    assert.equal(
      inventory.publicApiInventoryTotal,
      modelInventory.publicApiInventoryTotal,
    );
    assert.equal(
      inventory.capabilityModelCount,
      modelInventory.capabilityModelCount,
    );
    assert.equal(inventory.modelKindCount, modelInventory.modelKindCount);
    assert.equal(inventory.ruleCount, 48);
    assert.equal(inventory.gateCount, 16);
    assert.equal(inventory.failedRuleCount, 0);
    assert.equal(inventory.failedGateCount, 0);
  });

  it("exposes immutable collections, deterministic summary, and Manifest readiness", () => {
    const platform = DataKnowledgeSuiteValidationPlatform;
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.rules), true);
    assert.equal(Object.isFrozen(platform.gates), true);
    assert.equal(Object.isFrozen(platform.inventory), true);
    assert.equal(Object.isFrozen(platform.findings), true);

    const manifestGate = platform.gates.find(
      (item) => item.name === "ManifestReadinessGate",
    );
    assert.equal(manifestGate?.outcome, "Pass");
    assert.equal(manifestGate?.readinessResult, "ReadyForManifest");
    assert.equal(platform.validationResult.readyForManifest, true);
    assert.equal(platform.runtimeBehavior, false);
    assert.equal(platform.revalidatesUpstreamCapabilities, false);

    const summaryA = getDataKnowledgeSuiteValidationSummary();
    const summaryB = getDataKnowledgeSuiteValidationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.status, "ValidationDefined");
    assert.equal(summaryA.readiness, "ReadyForManifest");
    assert.equal(summaryA.validationOutcome, "Pass");
    assert.equal(summaryA.ruleCount, 48);
    assert.equal(summaryA.gateCount, 16);
    assert.equal(summaryA.failedRuleCount, 0);
    assert.equal(summaryA.upstreamDependency, DataKnowledgeSuiteModelId);
    assert.equal(
      summaryA.nextPhase,
      "DKL-9:5 — Data Knowledge Suite Manifest",
    );
  });
});
