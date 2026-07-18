/**
 * DKL-9:1 — Data Knowledge Suite Foundation Tests.
 *
 * Deterministic coverage for the immutable Data Knowledge Suite Foundation.
 * No mocks. No randomness. No network. No databases.
 */

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { DataKnowledgeFoundationPublicPlatform } from "./dataKnowledgeFoundationPublicIndex.ts";
import { DataSourceKnowledgeRegistryPublicPlatform } from "./dataSourceKnowledgeRegistryPublicIndex.ts";
import { DataUnderstandingPlatformPublicFoundation } from "./dataUnderstandingPublicIndex.ts";
import * as FoundationModule from "./dataKnowledgeSuiteFoundation.ts";
import {
  DataKnowledgeSuiteFoundationId,
  DataKnowledgeSuiteFoundationName,
  DataKnowledgeSuiteFoundationNamespace,
  DataKnowledgeSuiteFoundationPlatform,
  DataKnowledgeSuiteFoundationReadiness,
  DataKnowledgeSuiteFoundationStatus,
  DataKnowledgeSuiteFoundationVersion,
  getDataKnowledgeSuiteFoundationSummary,
} from "./dataKnowledgeSuiteFoundation.ts";
import { KnowledgeGovernancePlatformPublicFoundation } from "./knowledgeGovernancePublicIndex.ts";
import { KnowledgeModelingPlatformPublicFoundation } from "./knowledgeModelingPublicIndex.ts";
import { KnowledgeRepositoryPlatformPublicFoundation } from "./knowledgeRepositoryPublicIndex.ts";
import { KnowledgeServicesPlatformPublicFoundation } from "./knowledgeServicesPublicIndex.ts";
import { KnowledgeValidationPlatformPublicFoundation } from "./knowledgeValidationPublicIndex.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const DKL91_FILES = Object.freeze([
  "dataKnowledgeSuiteFoundationTypes.ts",
  "dataKnowledgeSuiteContracts.ts",
  "dataKnowledgeSuiteOwnership.ts",
  "dataKnowledgeSuiteCapabilityCatalog.ts",
  "dataKnowledgeSuiteLifecycle.ts",
  "dataKnowledgeSuiteBoundaries.ts",
  "dataKnowledgeSuiteFoundation.ts",
  "dataKnowledgeSuiteFoundation.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "DataKnowledgeSuiteFoundationId",
  "DataKnowledgeSuiteFoundationVersion",
  "DataKnowledgeSuiteFoundationName",
  "DataKnowledgeSuiteFoundationNamespace",
  "DataKnowledgeSuiteFoundationStatus",
  "DataKnowledgeSuiteFoundationReadiness",
  "DataKnowledgeSuiteFoundationPlatform",
  "getDataKnowledgeSuiteFoundationSummary",
] as const);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "integrationContracts",
  "ownership",
  "capabilityCatalog",
  "lifecycle",
  "boundaries",
  "inventory",
  "readiness",
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

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

describe("DKL-9:1 Data Knowledge Suite Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    assert.equal(DKL91_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of DKL91_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.deepEqual(
      Object.keys(FoundationModule).sort(),
      [...REQUIRED_PUBLIC_EXPORTS].sort(),
    );
    assert.equal(Object.keys(FoundationModule).length, 8);
  });

  it("has canonical identity, FoundationDefined status, and ReadyForRegistry", () => {
    assert.equal(
      DataKnowledgeSuiteFoundationId,
      "DKL-9:1/DataKnowledgeSuiteFoundation",
    );
    assert.equal(DataKnowledgeSuiteFoundationVersion, "1.0.0");
    assert.equal(
      DataKnowledgeSuiteFoundationName,
      "Data Knowledge Suite Foundation",
    );
    assert.equal(
      DataKnowledgeSuiteFoundationNamespace,
      "nexora.dkl.data-knowledge-suite.foundation",
    );
    assert.equal(DataKnowledgeSuiteFoundationStatus, "FoundationDefined");
    assert.equal(DataKnowledgeSuiteFoundationReadiness, "ReadyForRegistry");
    assert.equal(
      DataKnowledgeSuiteFoundationPlatform.identity.status,
      "FoundationDefined",
    );
    assert.equal(
      DataKnowledgeSuiteFoundationPlatform.readiness,
      "ReadyForRegistry",
    );
    assert.equal(
      DataKnowledgeSuiteFoundationPlatform.nextPhase,
      "DKL-9:2 — Data Knowledge Suite Registry",
    );
  });

  it("consumes only the eight DKL Public Indexes with no lower-level imports", () => {
    const dependency = DataKnowledgeSuiteFoundationPlatform.dependency;
    assert.equal(dependency.publicIndexOnly, true);
    assert.equal(dependency.directPreviousPhaseModules.length, 8);
    assert.deepEqual(
      [...dependency.directPreviousPhaseModules],
      [
        "dataKnowledgeFoundationPublicIndex.ts",
        "dataSourceKnowledgeRegistryPublicIndex.ts",
        "dataUnderstandingPublicIndex.ts",
        "knowledgeModelingPublicIndex.ts",
        "knowledgeValidationPublicIndex.ts",
        "knowledgeRepositoryPublicIndex.ts",
        "knowledgeServicesPublicIndex.ts",
        "knowledgeGovernancePublicIndex.ts",
      ],
    );
    assert.equal(dependency.dkl1PublicIndex, true);
    assert.equal(dependency.dkl8PublicIndex, true);
    assert.equal(dependency.foundationDirectImport, false);
    assert.equal(dependency.registryDirectImport, false);
    assert.equal(dependency.modelDirectImport, false);
    assert.equal(dependency.validationDirectImport, false);
    assert.equal(dependency.manifestDirectImport, false);
    assert.equal(dependency.platformDirectImport, false);
    assert.equal(dependency.certificationDirectImport, false);
    assert.equal(dependency.freezeDirectImport, false);
    assert.equal(dependency.reconstructsUpstream, false);
    assert.equal(dependency.introducesNewKnowledgeCapability, false);

    const integrations =
      DataKnowledgeSuiteFoundationPlatform.integrationContracts;
    assert.equal(integrations.length, 8);
    assert.ok(
      integrations.every((item) => item.integrationMode === "PublicIndexOnly"),
    );
    assert.ok(
      integrations.every((item) => item.preservesCanonicalReferences === true),
    );
    assert.ok(
      integrations.every((item) => item.reconstructsCapability === false),
    );
  });

  it("publishes an eight-capability catalog with Public Index references preserved", () => {
    const catalog = DataKnowledgeSuiteFoundationPlatform.capabilityCatalog;
    assert.equal(catalog.length, 8);
    assert.deepEqual(
      catalog.map((item) => item.capabilityId),
      [...EXPECTED_CAPABILITIES],
    );
    assertUnique(
      catalog.map((item) => item.publicIndexId),
      "publicIndexId",
    );
    assert.ok(
      catalog.every((item) => item.introducesNewKnowledgeCapability === false),
    );
    assert.ok(
      catalog.every((item) => item.integrationMode === "PublicIndexOnly"),
    );

    assert.equal(
      catalog[0]!.publicPlatform,
      DataKnowledgeFoundationPublicPlatform,
    );
    assert.equal(
      catalog[1]!.publicPlatform,
      DataSourceKnowledgeRegistryPublicPlatform,
    );
    assert.equal(
      catalog[2]!.publicPlatform,
      DataUnderstandingPlatformPublicFoundation,
    );
    assert.equal(
      catalog[3]!.publicPlatform,
      KnowledgeModelingPlatformPublicFoundation,
    );
    assert.equal(
      catalog[4]!.publicPlatform,
      KnowledgeValidationPlatformPublicFoundation,
    );
    assert.equal(
      catalog[5]!.publicPlatform,
      KnowledgeRepositoryPlatformPublicFoundation,
    );
    assert.equal(
      catalog[6]!.publicPlatform,
      KnowledgeServicesPlatformPublicFoundation,
    );
    assert.equal(
      catalog[7]!.publicPlatform,
      KnowledgeGovernancePlatformPublicFoundation,
    );

    const inventory = DataKnowledgeSuiteFoundationPlatform.inventory;
    assert.equal(inventory.capabilityCount, 8);
    assert.equal(inventory.sourcedThroughPublicIndexes, true);
    assert.equal(inventory.reconstructed, false);
    assert.equal(inventory.hardcoded, false);
    assert.equal(
      inventory.publicApiInventoryTotal,
      catalog.reduce((total, item) => total + item.publicApiCount, 0),
    );
    assert.ok(inventory.publicApiInventoryTotal > 0);
  });

  it("declares ownership and boundaries without runtime behavior", () => {
    const { ownership, boundaries } = DataKnowledgeSuiteFoundationPlatform;
    assert.ok(ownership.owns.includes("Suite composition"));
    assert.ok(ownership.owns.includes("Capability catalog"));
    assert.ok(ownership.doesNotOwn.includes("Knowledge retrieval"));
    assert.ok(ownership.doesNotOwn.includes("Repository"));
    assert.ok(ownership.doesNotOwn.includes("Engine"));
    assert.ok(ownership.doesNotOwn.includes("NEA"));
    assert.ok(ownership.doesNotOwn.includes("Advisor"));
    assert.ok(ownership.doesNotOwn.includes("Scene"));
    assert.ok(ownership.doesNotOwn.includes("UI"));
    assert.ok(ownership.doesNotOwn.includes("Business Objects"));
    assert.equal(ownership.assignsUsers, false);
    assert.equal(ownership.runtimeBehavior, "None");

    assert.equal(boundaries.consumes.length, 8);
    assert.equal(boundaries.runtimeEnforcement, false);
    assert.equal(boundaries.retrievesKnowledge, false);
    assert.equal(boundaries.storesKnowledge, false);
    assert.equal(boundaries.executesGovernance, false);
    assert.equal(boundaries.engineReasoning, false);
    assert.equal(boundaries.uiBehavior, false);
    assert.equal(boundaries.importsLowerLevelDklModules, false);
    assert.ok(boundaries.prohibitedSurfaceCount >= 40);
  });

  it("preserves ordered platform sections and immutable public surface", () => {
    const platform = DataKnowledgeSuiteFoundationPlatform;
    const keys = Object.keys(platform);
    assert.deepEqual(keys.slice(0, 10), [...PLATFORM_SECTIONS]);
    assert.equal(platform.sectionCount, 10);
    assert.deepEqual([...platform.sectionOrder], [...PLATFORM_SECTIONS]);
    assert.equal(Object.isFrozen(platform), true);
    assert.equal(Object.isFrozen(platform.contracts), true);
    assert.equal(Object.isFrozen(platform.capabilityCatalog), true);
    assert.equal(Object.isFrozen(platform.ownership), true);
    assert.equal(Object.isFrozen(platform.boundaries), true);
    assert.equal(Object.isFrozen(platform.lifecycle), true);
    assert.equal(Object.isFrozen(platform.inventory), true);
  });

  it("declares suite lifecycle and contracts without executing them", () => {
    const { lifecycle, contracts, integrationContracts } =
      DataKnowledgeSuiteFoundationPlatform;
    assert.equal(lifecycle.currentState, "ReadyForRegistry");
    assert.equal(lifecycle.executesTransitions, false);
    assert.equal(lifecycle.runtimeStateMachine, false);
    assert.ok(lifecycle.stateCount >= 8);
    assertUnique([...lifecycle.states], "lifecycle states");
    assert.ok(contracts.length >= 8);
    assertUnique(
      contracts.map((item) => item.contractId),
      "contract IDs",
    );
    assert.equal(integrationContracts.length, 8);
    assertUnique(
      integrationContracts.map((item) => item.integrationContractId),
      "integration contract IDs",
    );
  });

  it("returns a deterministic summary and is ready for DKL-9:2", () => {
    const summaryA = getDataKnowledgeSuiteFoundationSummary();
    const summaryB = getDataKnowledgeSuiteFoundationSummary();
    assert.deepEqual(summaryA, summaryB);
    assert.equal(Object.isFrozen(summaryA), true);
    assert.equal(summaryA.foundationId, DataKnowledgeSuiteFoundationId);
    assert.equal(summaryA.status, "FoundationDefined");
    assert.equal(summaryA.readiness, "ReadyForRegistry");
    assert.equal(summaryA.capabilityCount, 8);
    assert.equal(summaryA.integrationContractCount, 8);
    assert.equal(summaryA.sectionCount, 10);
    assert.equal(
      summaryA.publicApiInventoryTotal,
      DataKnowledgeSuiteFoundationPlatform.inventory.publicApiInventoryTotal,
    );
    assert.equal(summaryA.metadataOnly, true);
    assert.equal(
      summaryA.nextPhase,
      "DKL-9:2 — Data Knowledge Suite Registry",
    );
    assert.equal(DataKnowledgeSuiteFoundationPlatform.runtimeBehavior, false);
    assert.equal(DataKnowledgeSuiteFoundationPlatform.runtimeEnforcement, false);
    assert.equal(DataKnowledgeSuiteFoundationPlatform.engineReasoning, false);
    assert.equal(DataKnowledgeSuiteFoundationPlatform.uiBehavior, false);
    assert.equal(
      DataKnowledgeSuiteFoundationPlatform.retrievesKnowledge,
      false,
    );
  });
});
