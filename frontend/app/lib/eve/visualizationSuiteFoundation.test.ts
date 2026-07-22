import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as FoundationExports from "./visualizationSuiteFoundation.ts";
import {
  VisualizationSuiteFoundationIdentityMetadata,
  VisualizationSuiteFoundationInventoryMetadata,
  VisualizationSuiteFoundationMetadata,
  VisualizationSuiteFoundationPlatform,
  VisualizationSuiteFoundationReadinessMetadata,
  getVisualizationSuiteFoundationCount,
  getVisualizationSuiteFoundationReleaseMetadata,
  getVisualizationSuiteFoundationSummary,
} from "./visualizationSuiteFoundation.ts";

const files = Object.freeze([
  "visualizationSuiteFoundationTypes.ts", "visualizationSuiteContracts.ts",
  "visualizationSuiteOwnership.ts", "visualizationSuiteBoundaries.ts",
  "visualizationSuiteLifecycle.ts", "visualizationSuiteCapabilities.ts",
  "visualizationSuiteFoundation.ts", "visualizationSuiteFoundation.test.ts",
]);

describe("EVE-9:1 Visualization Suite Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(FoundationExports).sort(), [
      "VisualizationSuiteFoundationIdentityMetadata",
      "VisualizationSuiteFoundationInventoryMetadata",
      "VisualizationSuiteFoundationMetadata",
      "VisualizationSuiteFoundationPlatform",
      "VisualizationSuiteFoundationReadinessMetadata",
      "getVisualizationSuiteFoundationCount",
      "getVisualizationSuiteFoundationReleaseMetadata",
      "getVisualizationSuiteFoundationSummary",
    ].sort());
  });

  it("publishes canonical identity and Registry readiness", () => {
    assert.equal(VisualizationSuiteFoundationIdentityMetadata.id,
      "EVE-9:1/VisualizationSuiteFoundation");
    assert.equal(VisualizationSuiteFoundationIdentityMetadata.namespace,
      "nexora.eve.visualization-suite.foundation");
    assert.equal(VisualizationSuiteFoundationReadinessMetadata.status,
      "ReadyForRegistry");
  });

  it("composes exactly eight released Public Index platforms by reference", () => {
    const composition = VisualizationSuiteFoundationPlatform.composition;
    assert.equal(composition.length, 8);
    assert.deepEqual(composition.map(({ name }) => name), [
      "EVE-1 Visualization", "EVE-2 Scene Rendering",
      "EVE-3 Graph Visualization", "EVE-4 Timeline Visualization",
      "EVE-5 Chart & Metric Visualization",
      "EVE-6 Dashboard & Executive Workspace Visualization",
      "EVE-7 Animation & Effects", "EVE-8 Visualization Platform",
    ]);
    assert.ok(composition.every((entry, index) => Object.isFrozen(entry)
      && entry.release === "Released" && entry.certification === "Certified"
      && entry.freeze === "Frozen" && entry.readiness === "ReadyForConsumer"
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
  });

  it("publishes sixteen immutable contracts", () => {
    const { contracts } = VisualizationSuiteFoundationPlatform;
    assert.equal(contracts.length, 16);
    assert.equal(new Set(contracts.map(({ id }) => id)).size, contracts.length);
    assert.ok(contracts.every((contract, index) => Object.isFrozen(contract)
      && Object.isFrozen(contract.structuralMetadata)
      && !contract.executableBehavior
      && contract.deterministicOrder === index + 1));
  });

  it("publishes exact immutable lifecycle and capabilities", () => {
    const platform = VisualizationSuiteFoundationPlatform;
    assert.deepEqual(platform.lifecycle.map(({ name }) => name), [
      "Declared", "Registered", "Modeled", "Validated", "Published",
    ]);
    assert.equal(platform.capabilities.length, 10);
    for (const collection of [platform.lifecycle, platform.capabilities,
      platform.boundaries]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.metadataOnly && entry.immutable
        && entry.deterministicOrder === index + 1));
    }
  });

  it("derives all inventory counts dynamically", () => {
    const inventory = VisualizationSuiteFoundationInventoryMetadata;
    assert.equal(inventory.counts.platformCount, inventory.platforms.length);
    assert.equal(inventory.counts.contractCount, inventory.contracts.length);
    assert.equal(inventory.counts.boundaryCount, inventory.boundaries.length);
    assert.equal(inventory.counts.lifecycleStateCount, inventory.lifecycle.length);
    assert.equal(inventory.counts.capabilityCount, inventory.capabilities.length);
    assert.equal(getVisualizationSuiteFoundationCount(),
      inventory.contracts.length);
    assert.equal(inventory.canonicalInventoryRule.hardcodedInventoryTotals,
      false);
    assert.equal(inventory.canonicalInventoryRule.reconstructsUpstreamMetadata,
      false);
  });

  it("consumes only the eight released EVE Public Indexes", () => {
    assert.equal(VisualizationSuiteFoundationMetadata.dependency
      .releasedPublicIndexesOnly, true);
    const source = readFileSync(new URL(
      "visualizationSuiteFoundation.ts", import.meta.url), "utf8");
    const imports = [...source.matchAll(/from ["']\.\/(.+?)["']/g)]
      .map((match) => match[1]!);
    const phaseImports = imports.filter((name) => !name.startsWith(
      "visualizationSuite"));
    assert.deepEqual(phaseImports.sort(), [
      "animationEffectsPublicIndex.ts", "chartMetricVisualizationPublicIndex.ts",
      "dashboardExecutiveWorkspaceVisualizationPublicIndex.ts",
      "graphVisualizationPublicIndex.ts", "sceneRenderingPublicIndex.ts",
      "timelineVisualizationPublicIndex.ts",
      "visualizationPlatformPublicIndex.ts", "visualizationPublicIndex.ts",
    ]);
    assert.doesNotMatch(source,
      /from ["']\.\/.+(?:Foundation|Registry|Model|Validation|Manifest|Platform|Certification|Freeze)\.ts["']/);
  });

  it("contains immutable metadata and no prohibited runtime", () => {
    const metadata = VisualizationSuiteFoundationMetadata;
    assert.ok(Object.isFrozen(VisualizationSuiteFoundationPlatform));
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.sceneExecution, false);
    assert.equal(metadata.graphExecution, false);
    assert.equal(metadata.timelineExecution, false);
    assert.equal(metadata.dashboardExecution, false);
    assert.equal(metadata.animationExecution, false);
    assert.equal(metadata.visualizationPlatformExecution, false);
    assert.equal(metadata.orchestration, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getVisualizationSuiteFoundationSummary().status,
      "ReadyForRegistry");
    const release = getVisualizationSuiteFoundationReleaseMetadata();
    assert.equal(release.status, "ReadyForRegistry");
    assert.equal(release.releasedPlatformCount, 8);
  });
});
