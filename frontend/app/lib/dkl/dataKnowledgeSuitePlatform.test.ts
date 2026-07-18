/**
 * DKL-9:6 — Data Knowledge Suite Platform Tests.
 *
 * Deterministic coverage for the immutable Data Knowledge Suite Platform.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  DataKnowledgeSuiteManifestId,
  DataKnowledgeSuiteManifestPlatform,
} from "./dataKnowledgeSuiteManifest.ts";
import * as PlatformModule from "./dataKnowledgeSuitePlatform.ts";
import {
  DataKnowledgeSuitePlatform,
  DataKnowledgeSuitePlatformId,
  DataKnowledgeSuitePlatformName,
  DataKnowledgeSuitePlatformNamespace,
  DataKnowledgeSuitePlatformReadiness,
  DataKnowledgeSuitePlatformStatus,
  DataKnowledgeSuitePlatformVersion,
  getDataKnowledgeSuitePlatformSummary,
} from "./dataKnowledgeSuitePlatform.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL96_FILES = Object.freeze([
  "dataKnowledgeSuitePlatformTypes.ts",
  "dataKnowledgeSuitePlatformArchitecture.ts",
  "dataKnowledgeSuitePlatformDependencies.ts",
  "dataKnowledgeSuitePlatformCompatibility.ts",
  "dataKnowledgeSuitePlatformGuarantees.ts",
  "dataKnowledgeSuitePlatformReadiness.ts",
  "dataKnowledgeSuitePlatform.ts",
  "dataKnowledgeSuitePlatform.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "DataKnowledgeSuitePlatformId",
  "DataKnowledgeSuitePlatformVersion",
  "DataKnowledgeSuitePlatformName",
  "DataKnowledgeSuitePlatformNamespace",
  "DataKnowledgeSuitePlatformStatus",
  "DataKnowledgeSuitePlatformReadiness",
  "DataKnowledgeSuitePlatform",
  "getDataKnowledgeSuitePlatformSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "metadata",
  "dependency",
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "capabilityCatalog",
  "ownership",
  "boundaries",
  "contracts",
  "integrationContracts",
  "inventory",
  "counts",
  "compatibility",
  "guarantees",
  "readiness",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-9:6 Data Knowledge Suite Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    assert.equal(DKL96_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL96_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(PlatformModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(PlatformModule).length, 8);
  });

  it("has canonical identity, PlatformDefined status, and ReadyForCertification", () => {
    assert.equal(
      DataKnowledgeSuitePlatformId,
      "DKL-9:6/DataKnowledgeSuitePlatform",
    );
    assert.equal(DataKnowledgeSuitePlatformVersion, "1.0.0");
    assert.equal(
      DataKnowledgeSuitePlatformName,
      "Data Knowledge Suite Platform",
    );
    assert.equal(
      DataKnowledgeSuitePlatformNamespace,
      "nexora.dkl.data-knowledge-suite.platform",
    );
    assert.equal(DataKnowledgeSuitePlatformStatus, "PlatformDefined");
    assert.equal(
      DataKnowledgeSuitePlatformReadiness,
      "ReadyForCertification",
    );
    assert.equal(
      DataKnowledgeSuitePlatform.nextPhase,
      "DKL-9:7 — Data Knowledge Suite Certification",
    );
  });

  it("consumes only Manifest with no Validation, Model, Registry, Foundation, or DKL imports", () => {
    const dependency = DataKnowledgeSuitePlatform.dependency;
    assert.equal(
      dependency.directPreviousPhaseModule,
      "dataKnowledgeSuiteManifest.ts",
    );
    assert.equal(dependency.manifestOnly, true);
    assert.equal(dependency.manifestId, DataKnowledgeSuiteManifestId);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.dkl1DirectImport, false);
    assert.equal(dependency.dkl8DirectImport, false);
    assert.equal(dependency.reconstructsManifest, false);
    assert.equal(dependency.reconstructsUpstream, false);
    assert.equal(DataKnowledgeSuitePlatform.manifest, DataKnowledgeSuiteManifestPlatform);
  });

  it("exposes canonical ordered sections with Manifest-chain references preserved", () => {
    const platform = DataKnowledgeSuitePlatform;
    const manifest = DataKnowledgeSuiteManifestPlatform;
    const validation = manifest.upstreamValidation;
    const model = validation.model;
    const registry = model.registry;
    const foundation = registry.foundation;

    assert.deepEqual(Object.keys(platform).slice(0, 18), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 18);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);

    assert.equal(platform.manifest, manifest);
    assert.equal(platform.validation, validation);
    assert.equal(platform.model, model);
    assert.equal(platform.registry, registry);
    assert.equal(platform.foundation, foundation);
    assert.equal(platform.capabilityCatalog, model.capabilities);
    assert.equal(
      platform.ownership,
      model.ownershipReferences[0]!.ownership,
    );
    assert.equal(
      platform.boundaries,
      model.boundaryReferences[0]!.boundaries,
    );
    assert.equal(platform.contracts, registry.contracts);
    assert.equal(
      platform.integrationContracts,
      registry.integrationContracts,
    );
  });

  it("satisfies Canonical Inventory Rule through Manifest-derived counts", () => {
    const platform = DataKnowledgeSuitePlatform;
    const manifest = DataKnowledgeSuiteManifestPlatform;

    assert.equal(platform.inventory.sourcedThroughManifest, true);
    assert.equal(platform.inventory.reconstructed, false);
    assert.equal(platform.inventory.hardcoded, false);
    assert.equal(platform.inventory.duplicated, false);
    assert.equal(platform.inventory.manifestInventory, manifest.inventory);
    assert.equal(
      platform.inventory.manifestTotalEntryCount,
      manifest.inventory.totalEntryCount,
    );
    assert.equal(
      platform.inventory.capabilityCount,
      manifest.inventory.capabilityCount,
    );
    assert.equal(
      platform.inventory.publicApiInventoryTotal,
      manifest.inventory.publicApiInventoryTotal,
    );
    assert.equal(
      platform.inventory.validationRuleCount,
      manifest.inventory.validationRuleCount,
    );
    assert.equal(platform.reconstructsUpstream, false);
    assert.equal(platform.duplicatesInventories, false);
  });

  it("publishes exactly eighteen guarantees and twelve compatibility declarations", () => {
    const platform = DataKnowledgeSuitePlatform;
    assert.equal(platform.guarantees.length, 18);
    assert.equal(platform.compatibility.length, 12);
    assertUnique(
      platform.guarantees.map((item) => item.guaranteeId),
      "guarantee IDs",
    );
    assertUnique(
      platform.compatibility.map((item) => item.id),
      "compatibility IDs",
    );
    assert.ok(platform.guarantees.every((item) => item.status === "Satisfied"));
    assert.ok(
      platform.compatibility.every(
        (item) =>
          item.compatible === true &&
          item.protected === true &&
          item.status === "Compatible",
      ),
    );
    assert.ok(
      platform.guarantees.some((item) => item.name === "SingleIntegrationSurface"),
    );
    assert.ok(
      platform.guarantees.some((item) => item.name === "ReadyForCertification"),
    );
    assert.ok(
      platform.guarantees.some((item) => item.name === "PlatformComplete"),
    );
  });

  it("exposes immutable collections and a deterministic summary", () => {
    const platform = DataKnowledgeSuitePlatform;
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.inventory), true);
    assert.equal(Object.isFrozen(platform.guarantees), true);
    assert.equal(Object.isFrozen(platform.compatibility), true);
    assert.equal(platform.runtimeBehavior, false);

    const summaryA = getDataKnowledgeSuitePlatformSummary();
    const summaryB = getDataKnowledgeSuitePlatformSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.platformId, DataKnowledgeSuitePlatformId);
    assert.equal(summaryA.status, "PlatformDefined");
    assert.equal(summaryA.readiness, "ReadyForCertification");
    assert.equal(summaryA.manifestId, DataKnowledgeSuiteManifestId);
    assert.equal(summaryA.capabilityCount, 8);
    assert.equal(summaryA.validationRuleCount, 48);
    assert.equal(summaryA.validationGateCount, 16);
    assert.equal(summaryA.guaranteeCount, 18);
    assert.equal(summaryA.compatibilityCount, 12);
    assert.equal(
      summaryA.publicApiInventoryTotal,
      DataKnowledgeSuiteManifestPlatform.inventory.publicApiInventoryTotal,
    );
    assert.equal(
      summaryA.nextPhase,
      "DKL-9:7 — Data Knowledge Suite Certification",
    );
  });
});
