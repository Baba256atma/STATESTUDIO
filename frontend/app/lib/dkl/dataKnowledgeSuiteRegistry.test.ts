/**
 * DKL-9:2 — Data Knowledge Suite Registry Tests.
 *
 * Deterministic coverage for the immutable Data Knowledge Suite Registry.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  DataKnowledgeSuiteFoundationId,
  DataKnowledgeSuiteFoundationPlatform,
} from "./dataKnowledgeSuiteFoundation.ts";
import * as RegistryModule from "./dataKnowledgeSuiteRegistry.ts";
import {
  DataKnowledgeSuiteRegistryId,
  DataKnowledgeSuiteRegistryName,
  DataKnowledgeSuiteRegistryNamespace,
  DataKnowledgeSuiteRegistryPlatform,
  DataKnowledgeSuiteRegistryReadiness,
  DataKnowledgeSuiteRegistryStatus,
  DataKnowledgeSuiteRegistryVersion,
  getDataKnowledgeSuiteRegistrySummary,
} from "./dataKnowledgeSuiteRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL92_FILES = Object.freeze([
  "dataKnowledgeSuiteRegistryTypes.ts",
  "dataKnowledgeSuiteCapabilityRegistry.ts",
  "dataKnowledgeSuiteDependencyRegistry.ts",
  "dataKnowledgeSuiteContractRegistry.ts",
  "dataKnowledgeSuiteOwnershipRegistry.ts",
  "dataKnowledgeSuiteLifecycleRegistry.ts",
  "dataKnowledgeSuiteRegistry.ts",
  "dataKnowledgeSuiteRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "DataKnowledgeSuiteRegistryId",
  "DataKnowledgeSuiteRegistryVersion",
  "DataKnowledgeSuiteRegistryName",
  "DataKnowledgeSuiteRegistryNamespace",
  "DataKnowledgeSuiteRegistryStatus",
  "DataKnowledgeSuiteRegistryReadiness",
  "DataKnowledgeSuiteRegistryPlatform",
  "getDataKnowledgeSuiteRegistrySummary",
] as const);

const EXPECTED_CAPABILITIES = Object.freeze([
  "DKL-1",
  "DKL-2",
  "DKL-3",
  "DKL-4",
  "DKL-5",
  "DKL-6",
  "DKL-7",
  "DKL-8",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "capabilities",
  "capabilityReferences",
  "capabilityOrder",
  "publicPlatforms",
  "publicApiRegistryRefs",
  "publicApiCounts",
  "versions",
  "statuses",
  "readinessEntries",
  "dependencies",
  "ownership",
  "boundaries",
  "compatibility",
  "lifecycle",
  "contracts",
  "integrationContracts",
  "guarantees",
  "inventory",
  "readiness",
] as const);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-9:2 Data Knowledge Suite Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    assert.equal(DKL92_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL92_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(RegistryModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(RegistryModule).length, 8);
  });

  it("has canonical identity, RegistryDefined status, and ReadyForModel", () => {
    assert.equal(
      DataKnowledgeSuiteRegistryId,
      "DKL-9:2/DataKnowledgeSuiteRegistry",
    );
    assert.equal(DataKnowledgeSuiteRegistryVersion, "1.0.0");
    assert.equal(
      DataKnowledgeSuiteRegistryName,
      "Data Knowledge Suite Registry",
    );
    assert.equal(
      DataKnowledgeSuiteRegistryNamespace,
      "nexora.dkl.data-knowledge-suite.registry",
    );
    assert.equal(DataKnowledgeSuiteRegistryStatus, "RegistryDefined");
    assert.equal(DataKnowledgeSuiteRegistryReadiness, "ReadyForModel");
    assert.equal(
      DataKnowledgeSuiteRegistryPlatform.nextPhase,
      "DKL-9:3 — Data Knowledge Suite Model",
    );
  });

  it("consumes only Foundation with no direct DKL-1…DKL-8 or Public Index imports", () => {
    const dependency = DataKnowledgeSuiteRegistryPlatform.dependency;
    assert.equal(
      dependency.directPreviousPhaseModule,
      "dataKnowledgeSuiteFoundation.ts",
    );
    assert.equal(dependency.foundationOnly, true);
    assert.equal(dependency.foundationId, DataKnowledgeSuiteFoundationId);
    assert.equal(dependency.publicIndexDirectImport, false);
    assert.equal(dependency.dkl1DirectImport, false);
    assert.equal(dependency.dkl2DirectImport, false);
    assert.equal(dependency.dkl3DirectImport, false);
    assert.equal(dependency.dkl4DirectImport, false);
    assert.equal(dependency.dkl5DirectImport, false);
    assert.equal(dependency.dkl6DirectImport, false);
    assert.equal(dependency.dkl7DirectImport, false);
    assert.equal(dependency.dkl8DirectImport, false);
    assert.equal(dependency.reconstructsFoundation, false);
    assert.equal(dependency.reconstructsUpstreamCapabilities, false);
    assert.equal(
      DataKnowledgeSuiteRegistryPlatform.foundation,
      DataKnowledgeSuiteFoundationPlatform,
    );
  });

  it("registers exactly eight capabilities with canonical order and references", () => {
    const platform = DataKnowledgeSuiteRegistryPlatform;
    assert.equal(platform.capabilities.length, 8);
    assert.deepEqual(
      platform.capabilities.map((item) => item.capabilityId),
      [...EXPECTED_CAPABILITIES],
    );
    assert.deepEqual([...platform.capabilityOrder], [...EXPECTED_CAPABILITIES]);
    assertUnique(
      platform.capabilities.map((item) => item.id),
      "capability IDs",
    );

    const foundationCatalog =
      DataKnowledgeSuiteFoundationPlatform.capabilityCatalog;
    for (let index = 0; index < 8; index += 1) {
      assert.equal(
        platform.capabilities[index]!.capabilityReference,
        foundationCatalog[index],
      );
      assert.equal(
        platform.capabilityReferences[index]!.capabilityReference,
        foundationCatalog[index],
      );
      assert.equal(
        platform.publicPlatforms[index]!.publicPlatform,
        foundationCatalog[index]!.publicPlatform,
      );
      assert.equal(
        platform.publicApiRegistryRefs[index]!.publicPlatform,
        foundationCatalog[index]!.publicPlatform,
      );
      assert.equal(
        platform.publicApiCounts[index]!.publicApiCount,
        foundationCatalog[index]!.publicApiCount,
      );
      assert.equal(
        platform.publicApiRegistryRefs[index]!.reconstructsUpstreamRegistry,
        false,
      );
      assert.equal(
        platform.publicApiRegistryRefs[index]!.duplicatesUpstreamRegistry,
        false,
      );
    }
  });

  it("satisfies Canonical Inventory Rule through Foundation-derived counts", () => {
    const platform = DataKnowledgeSuiteRegistryPlatform;
    const foundationInventory = DataKnowledgeSuiteFoundationPlatform.inventory;

    assert.equal(platform.inventory.sourcedThroughFoundation, true);
    assert.equal(platform.inventory.reconstructed, false);
    assert.equal(platform.inventory.hardcoded, false);
    assert.equal(
      platform.inventory.foundationInventory,
      foundationInventory,
    );
    assert.equal(
      platform.inventory.publicApiInventoryTotal,
      foundationInventory.publicApiInventoryTotal,
    );
    assert.equal(
      platform.inventory.publicApiInventoryTotal,
      platform.publicApiCounts.reduce(
        (total, item) => total + item.publicApiCount,
        0,
      ),
    );
    assert.equal(platform.inventory.capabilityCount, 8);
    assert.equal(
      platform.inventory.contractCount,
      DataKnowledgeSuiteFoundationPlatform.contracts.length,
    );
    assert.equal(
      platform.inventory.integrationContractCount,
      DataKnowledgeSuiteFoundationPlatform.integrationContracts.length,
    );
    assert.equal(
      platform.inventory.lifecycleStateCount,
      DataKnowledgeSuiteFoundationPlatform.lifecycle.stateCount,
    );
  });

  it("preserves ownership, boundaries, contracts, and lifecycle by reference", () => {
    const platform = DataKnowledgeSuiteRegistryPlatform;
    assert.equal(
      platform.ownership.foundationOwnership,
      DataKnowledgeSuiteFoundationPlatform.ownership,
    );
    assert.equal(
      platform.boundaries.foundationBoundaries,
      DataKnowledgeSuiteFoundationPlatform.boundaries,
    );
    assert.equal(
      platform.lifecycle.foundationLifecycle,
      DataKnowledgeSuiteFoundationPlatform.lifecycle,
    );
    assert.equal(
      platform.contracts[0]!.contractReference,
      DataKnowledgeSuiteFoundationPlatform.contracts[0],
    );
    assert.equal(
      platform.integrationContracts[0]!.integrationContractReference,
      DataKnowledgeSuiteFoundationPlatform.integrationContracts[0],
    );
    assert.equal(platform.guarantees.length, 7);
    assert.ok(
      platform.guarantees.every((item) => item.status === "Guaranteed"),
    );
  });

  it("exposes immutable platform sections and pure lookups", () => {
    const platform = DataKnowledgeSuiteRegistryPlatform;
    assert.deepEqual(Object.keys(platform).slice(0, 21), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, PLATFORM_SECTIONS.length);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.capabilities), true);
    assert.equal(Object.isFrozen(platform.inventory), true);

    const first = platform.capabilities[0]!;
    assert.equal(platform.lookups.getCapabilityById(first.id), first);
    assert.equal(
      platform.lookups.getCapabilityByCapabilityId("DKL-8")?.capabilityId,
      "DKL-8",
    );
    assert.equal(platform.lookups.getCapabilityCount(), 8);
    assert.equal(platform.lookups.getTotalEntryCount(), platform.totalEntryCount);
  });

  it("returns a deterministic summary and is ready for DKL-9:3", () => {
    const summaryA = getDataKnowledgeSuiteRegistrySummary();
    const summaryB = getDataKnowledgeSuiteRegistrySummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.registryId, DataKnowledgeSuiteRegistryId);
    assert.equal(summaryA.status, "RegistryDefined");
    assert.equal(summaryA.readiness, "ReadyForModel");
    assert.equal(summaryA.foundationId, DataKnowledgeSuiteFoundationId);
    assert.equal(summaryA.capabilityCount, 8);
    assert.equal(
      summaryA.publicApiInventoryTotal,
      DataKnowledgeSuiteFoundationPlatform.inventory.publicApiInventoryTotal,
    );
    assert.equal(
      summaryA.nextPhase,
      "DKL-9:3 — Data Knowledge Suite Model",
    );
    assert.equal(DataKnowledgeSuiteRegistryPlatform.runtimeBehavior, false);
    assert.equal(DataKnowledgeSuiteRegistryPlatform.reconstructsUpstream, false);
    assert.equal(
      DataKnowledgeSuiteRegistryPlatform.duplicatesUpstreamRegistries,
      false,
    );
  });
});
