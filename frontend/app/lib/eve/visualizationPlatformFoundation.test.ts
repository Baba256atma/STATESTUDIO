import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as FoundationExports from "./visualizationPlatformFoundation.ts";
import {
  VisualizationPlatformFoundationIdentityMetadata,
  VisualizationPlatformFoundationInventoryMetadata,
  VisualizationPlatformFoundationMetadata,
  VisualizationPlatformFoundationPlatform,
  VisualizationPlatformFoundationReadinessMetadata,
  getVisualizationPlatformFoundationCount,
  getVisualizationPlatformFoundationReleaseMetadata,
  getVisualizationPlatformFoundationSummary,
} from "./visualizationPlatformFoundation.ts";

const files = Object.freeze([
  "visualizationPlatformFoundationTypes.ts", "visualizationPlatformContracts.ts",
  "visualizationPlatformOwnership.ts", "visualizationPlatformBoundaries.ts",
  "visualizationPlatformLifecycle.ts", "visualizationPlatformCapabilities.ts",
  "visualizationPlatformFoundation.ts", "visualizationPlatformFoundation.test.ts",
]);

describe("EVE-8:1 Visualization Platform Foundation", () => {
  it("has exactly the eight named Foundation files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(FoundationExports).sort(), [
      "VisualizationPlatformFoundationIdentityMetadata",
      "VisualizationPlatformFoundationInventoryMetadata",
      "VisualizationPlatformFoundationMetadata",
      "VisualizationPlatformFoundationPlatform",
      "VisualizationPlatformFoundationReadinessMetadata",
      "getVisualizationPlatformFoundationCount",
      "getVisualizationPlatformFoundationReleaseMetadata",
      "getVisualizationPlatformFoundationSummary",
    ].sort());
  });

  it("publishes canonical identity and Registry readiness", () => {
    assert.equal(VisualizationPlatformFoundationIdentityMetadata.id,
      "EVE-8:1/VisualizationPlatformFoundation");
    assert.equal(VisualizationPlatformFoundationIdentityMetadata.namespace,
      "nexora.eve.visualization-platform.foundation");
    assert.equal(VisualizationPlatformFoundationReadinessMetadata.status,
      "ReadyForRegistry");
  });

  it("composes exactly seven released Public Index modules by reference", () => {
    const composition = VisualizationPlatformFoundationPlatform.composition;
    assert.equal(composition.length, 7);
    assert.deepEqual(composition.map(({ name }) => name), [
      "EVE-1 Visualization", "EVE-2 Scene Rendering",
      "EVE-3 Graph Visualization", "EVE-4 Timeline Visualization",
      "EVE-5 Chart & Metric Visualization",
      "EVE-6 Dashboard & Executive Workspace Visualization",
      "EVE-7 Animation & Effects",
    ]);
    assert.ok(composition.every((entry, index) => Object.isFrozen(entry)
      && entry.release === "Released" && entry.certification === "Certified"
      && entry.freeze === "Frozen" && entry.readiness === "ReadyForConsumer"
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
  });

  it("publishes sixteen immutable contracts", () => {
    const { contracts } = VisualizationPlatformFoundationPlatform;
    assert.equal(contracts.length, 16);
    assert.equal(new Set(contracts.map(({ id }) => id)).size, contracts.length);
    assert.ok(contracts.every((contract, index) => Object.isFrozen(contract)
      && Object.isFrozen(contract.structuralMetadata)
      && !contract.executableBehavior
      && contract.deterministicOrder === index + 1));
  });

  it("publishes exact immutable lifecycle and capabilities", () => {
    const platform = VisualizationPlatformFoundationPlatform;
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
    const inventory = VisualizationPlatformFoundationInventoryMetadata;
    assert.equal(inventory.counts.moduleCount, inventory.modules.length);
    assert.equal(inventory.counts.contractCount, inventory.contracts.length);
    assert.equal(inventory.counts.boundaryCount, inventory.boundaries.length);
    assert.equal(inventory.counts.lifecycleStateCount, inventory.lifecycle.length);
    assert.equal(inventory.counts.capabilityCount, inventory.capabilities.length);
    assert.equal(getVisualizationPlatformFoundationCount(),
      inventory.contracts.length);
    assert.equal(inventory.canonicalInventoryRule.hardcodedInventoryTotals,
      false);
    assert.equal(inventory.canonicalInventoryRule.reconstructsUpstreamMetadata,
      false);
  });

  it("consumes only the seven released EVE Public Indexes", () => {
    assert.equal(VisualizationPlatformFoundationMetadata.dependency
      .releasedPublicIndexesOnly, true);
    const source = readFileSync(new URL(
      "visualizationPlatformFoundation.ts", import.meta.url), "utf8");
    const imports = [...source.matchAll(/from ["']\.\/(.+?)["']/g)]
      .map((match) => match[1]!);
    const phaseImports = imports.filter((name) => !name.startsWith(
      "visualizationPlatform"));
    assert.deepEqual(phaseImports.sort(), [
      "animationEffectsPublicIndex.ts", "chartMetricVisualizationPublicIndex.ts",
      "dashboardExecutiveWorkspaceVisualizationPublicIndex.ts",
      "graphVisualizationPublicIndex.ts", "sceneRenderingPublicIndex.ts",
      "timelineVisualizationPublicIndex.ts", "visualizationPublicIndex.ts",
    ]);
    assert.doesNotMatch(source,
      /from ["']\.\/.+(?:Foundation|Registry|Model|Validation|Manifest|Platform|Certification|Freeze)\.ts["']/);
  });

  it("contains immutable metadata and no prohibited runtime", () => {
    const metadata = VisualizationPlatformFoundationMetadata;
    assert.ok(Object.isFrozen(VisualizationPlatformFoundationPlatform));
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.sceneExecution, false);
    assert.equal(metadata.graphExecution, false);
    assert.equal(metadata.timelineExecution, false);
    assert.equal(metadata.dashboardExecution, false);
    assert.equal(metadata.animationExecution, false);
    assert.equal(metadata.orchestration, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getVisualizationPlatformFoundationSummary().status,
      "ReadyForRegistry");
    const release = getVisualizationPlatformFoundationReleaseMetadata();
    assert.equal(release.status, "ReadyForRegistry");
    assert.equal(release.releasedModuleCount, 7);
  });
});
