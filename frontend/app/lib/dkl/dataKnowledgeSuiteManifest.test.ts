/**
 * DKL-9:5 — Data Knowledge Suite Manifest Tests.
 *
 * Deterministic coverage for the immutable Data Knowledge Suite Manifest.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ManifestModule from "./dataKnowledgeSuiteManifest.ts";
import {
  DataKnowledgeSuiteManifestId,
  DataKnowledgeSuiteManifestName,
  DataKnowledgeSuiteManifestNamespace,
  DataKnowledgeSuiteManifestPlatform,
  DataKnowledgeSuiteManifestReadiness,
  DataKnowledgeSuiteManifestStatus,
  DataKnowledgeSuiteManifestVersion,
  getDataKnowledgeSuiteManifestSummary,
} from "./dataKnowledgeSuiteManifest.ts";
import {
  DataKnowledgeSuiteValidationId,
  DataKnowledgeSuiteValidationPlatform,
} from "./dataKnowledgeSuiteValidation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL95_FILES = Object.freeze([
  "dataKnowledgeSuiteManifestTypes.ts",
  "dataKnowledgeSuiteManifestInventory.ts",
  "dataKnowledgeSuiteManifestCounts.ts",
  "dataKnowledgeSuiteManifestMetadata.ts",
  "dataKnowledgeSuiteManifestGuarantees.ts",
  "dataKnowledgeSuiteManifestReadiness.ts",
  "dataKnowledgeSuiteManifest.ts",
  "dataKnowledgeSuiteManifest.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "DataKnowledgeSuiteManifestId",
  "DataKnowledgeSuiteManifestVersion",
  "DataKnowledgeSuiteManifestName",
  "DataKnowledgeSuiteManifestNamespace",
  "DataKnowledgeSuiteManifestStatus",
  "DataKnowledgeSuiteManifestReadiness",
  "DataKnowledgeSuiteManifestPlatform",
  "getDataKnowledgeSuiteManifestSummary",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-9:5 Data Knowledge Suite Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    assert.equal(DKL95_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL95_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(ManifestModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(ManifestModule).length, 8);
  });

  it("has canonical identity, ManifestDefined status, and ReadyForPlatform", () => {
    assert.equal(
      DataKnowledgeSuiteManifestId,
      "DKL-9:5/DataKnowledgeSuiteManifest",
    );
    assert.equal(DataKnowledgeSuiteManifestVersion, "1.0.0");
    assert.equal(
      DataKnowledgeSuiteManifestName,
      "Data Knowledge Suite Manifest",
    );
    assert.equal(
      DataKnowledgeSuiteManifestNamespace,
      "nexora.dkl.data-knowledge-suite.manifest",
    );
    assert.equal(DataKnowledgeSuiteManifestStatus, "ManifestDefined");
    assert.equal(DataKnowledgeSuiteManifestReadiness, "ReadyForPlatform");
    assert.equal(
      DataKnowledgeSuiteManifestPlatform.nextPhase,
      "DKL-9:6 — Data Knowledge Suite Platform",
    );
  });

  it("consumes only Validation with no Model, Registry, Foundation, or DKL imports", () => {
    const dependency = DataKnowledgeSuiteManifestPlatform.dependency;
    assert.equal(
      dependency.directPreviousPhaseModule,
      "dataKnowledgeSuiteValidation.ts",
    );
    assert.equal(dependency.validationOnly, true);
    assert.equal(dependency.validationId, DataKnowledgeSuiteValidationId);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.dkl1DirectImport, false);
    assert.equal(dependency.dkl8DirectImport, false);
    assert.equal(dependency.reconstructsValidation, false);
    assert.equal(dependency.reconstructsUpstream, false);
    assert.equal(
      DataKnowledgeSuiteManifestPlatform.upstreamValidation,
      DataKnowledgeSuiteValidationPlatform,
    );
  });

  it("derives inventory only through Validation and preserves canonical references", () => {
    const platform = DataKnowledgeSuiteManifestPlatform;
    const validation = DataKnowledgeSuiteValidationPlatform;
    const model = validation.model;

    assert.equal(platform.inventory.sourcedThroughValidation, true);
    assert.equal(platform.inventory.reconstructed, false);
    assert.equal(platform.inventory.hardcoded, false);
    assert.equal(platform.inventory.duplicated, false);
    assert.equal(platform.inventory.validationInventory, validation.inventory);
    assert.equal(platform.inventory.modelInventory, model.inventory);
    assert.equal(
      platform.inventory.capabilityCount,
      model.inventory.capabilityModelCount,
    );
    assert.equal(
      platform.inventory.publicApiInventoryTotal,
      model.inventory.publicApiInventoryTotal,
    );
    assert.equal(
      platform.inventory.validationRuleCount,
      validation.inventory.ruleCount,
    );
    assert.equal(
      platform.inventory.validationGateCount,
      validation.inventory.gateCount,
    );

    assert.equal(
      platform.capabilityInventory.capabilities,
      model.capabilities,
    );
    assert.equal(
      platform.platformInventory.publicPlatformReferences,
      model.publicPlatformReferences,
    );
    assert.equal(
      platform.apiInventory.publicApiRegistryReferences,
      model.publicApiRegistryReferences,
    );
    assert.equal(
      platform.validationInventory.rules,
      validation.rules,
    );
    assert.equal(platform.validationInventory.gates, validation.gates);
    assert.equal(platform.upstream.validation, validation);
    assert.equal(platform.upstream.model, model);
    assert.equal(platform.upstream.registry, model.registry);
    assert.equal(platform.upstream.foundation, model.registry.foundation);
  });

  it("publishes exactly sixteen unique satisfied guarantees", () => {
    const guarantees = DataKnowledgeSuiteManifestPlatform.guarantees;
    assert.equal(guarantees.length, 16);
    assertUnique(
      guarantees.map((item) => item.guaranteeId),
      "guarantee IDs",
    );
    assert.ok(guarantees.every((item) => item.status === "Satisfied"));
    assert.ok(
      guarantees.some((item) => item.name === "SingleSourceOfTruth"),
    );
    assert.ok(guarantees.some((item) => item.name === "CanonicalInventory"));
    assert.ok(guarantees.some((item) => item.name === "NoReconstruction"));
    assert.ok(guarantees.some((item) => item.name === "NoDuplicateInventories"));
    assert.ok(guarantees.some((item) => item.name === "ReadyForPlatform"));
  });

  it("exposes immutable collections and deterministic counting rule", () => {
    const platform = DataKnowledgeSuiteManifestPlatform;
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.inventory), true);
    assert.equal(Object.isFrozen(platform.guarantees), true);
    assert.equal(Object.isFrozen(platform.capabilityInventory), true);
    assert.equal(Object.isFrozen(platform.validationInventory), true);
    assert.ok(platform.inventory.countingRule.includes("capabilityModelCount"));
    assert.equal(
      platform.inventory.totalEntryCount,
      platform.counts.totalEntryCount,
    );
    assert.equal(platform.reconstructsUpstream, false);
    assert.equal(platform.duplicatesInventories, false);
    assert.equal(platform.runtimeBehavior, false);
  });

  it("returns a deterministic summary and is ready for DKL-9:6", () => {
    const summaryA = getDataKnowledgeSuiteManifestSummary();
    const summaryB = getDataKnowledgeSuiteManifestSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.manifestId, DataKnowledgeSuiteManifestId);
    assert.equal(summaryA.status, "ManifestDefined");
    assert.equal(summaryA.readiness, "ReadyForPlatform");
    assert.equal(summaryA.validationId, DataKnowledgeSuiteValidationId);
    assert.equal(summaryA.capabilityCount, 8);
    assert.equal(summaryA.validationRuleCount, 48);
    assert.equal(summaryA.validationGateCount, 16);
    assert.equal(summaryA.guaranteeCount, 16);
    assert.equal(
      summaryA.publicApiInventoryTotal,
      DataKnowledgeSuiteValidationPlatform.model.inventory
        .publicApiInventoryTotal,
    );
    assert.equal(
      summaryA.nextPhase,
      "DKL-9:6 — Data Knowledge Suite Platform",
    );
  });
});
