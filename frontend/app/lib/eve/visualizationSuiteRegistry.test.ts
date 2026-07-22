import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as RegistryExports from "./visualizationSuiteRegistry.ts";
import {
  VisualizationSuiteRegistryIdentityMetadata,
  VisualizationSuiteRegistryMetadata,
  VisualizationSuiteRegistryPlatform,
  VisualizationSuiteRegistryReadinessMetadata,
  getVisualizationSuiteRegistryCount,
  getVisualizationSuiteRegistryReleaseMetadata,
  getVisualizationSuiteRegistrySummary,
} from "./visualizationSuiteRegistry.ts";

const files = Object.freeze([
  "visualizationSuiteRegistry.test.ts", "visualizationSuiteRegistry.ts",
  "visualizationSuiteRegistryCatalog.ts",
  "visualizationSuiteRegistryExtensions.ts",
  "visualizationSuiteRegistryInventory.ts",
  "visualizationSuiteRegistryMetadata.ts",
  "visualizationSuiteRegistryPolicies.ts",
  "visualizationSuiteRegistryTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-9:2 Visualization Suite Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(RegistryExports).sort(), [
      "VisualizationSuiteRegistryIdentityMetadata",
      "VisualizationSuiteRegistryInventoryMetadata",
      "VisualizationSuiteRegistryMetadata",
      "VisualizationSuiteRegistryPlatform",
      "VisualizationSuiteRegistryReadinessMetadata",
      "getVisualizationSuiteRegistryCount",
      "getVisualizationSuiteRegistryReleaseMetadata",
      "getVisualizationSuiteRegistrySummary",
    ].sort());
  });

  it("publishes canonical identity and Model readiness", () => {
    assert.equal(VisualizationSuiteRegistryIdentityMetadata.id,
      "EVE-9:2/VisualizationSuiteRegistry");
    assert.equal(VisualizationSuiteRegistryIdentityMetadata.namespace,
      "nexora.eve.visualization-suite.registry");
    assert.equal(VisualizationSuiteRegistryReadinessMetadata.status,
      "ReadyForModel");
  });

  it("publishes sixteen immutable registry collections", () => {
    const { collections, foundation } = VisualizationSuiteRegistryPlatform;
    assert.equal(collections.length, 16);
    assert.equal(new Set(collections.map(({ id }) => id)).size,
      collections.length);
    assert.ok(collections.every((entry, index) => Object.isFrozen(entry)
      && entry.foundationContractReference === foundation.contracts[index]
      && entry.deterministicOrder === index + 1 && !entry.executable));
  });

  it("registers exactly eight released Public Indexes by reference", () => {
    const { platforms, foundation } = VisualizationSuiteRegistryPlatform;
    assert.equal(platforms.length, 8);
    assert.ok(platforms.every((platform, index) => Object.isFrozen(platform)
      && platform.foundationPlatformReference === foundation.composition[index]
      && platform.publicIndexReference ===
        foundation.composition[index]!.publicIndex
      && platform.release === "Released"
      && platform.deterministicOrder === index + 1));
  });

  it("derives categories exclusively from Foundation contracts", () => {
    const { categories, foundation } = VisualizationSuiteRegistryPlatform;
    assert.equal(categories.length, foundation.contracts.length);
    assert.ok(categories.every((category, index) => Object.isFrozen(category)
      && category.foundationReference === foundation.contracts[index]
      && category.immutableCollection[0] === foundation.contracts[index]
      && category.deterministicOrder === index + 1));
  });

  it("publishes ten policies and twelve extension classifications", () => {
    const { policies, extensions } = VisualizationSuiteRegistryPlatform;
    assert.equal(policies.length, 10);
    assert.equal(extensions.length, 12);
    for (const collection of [policies, extensions]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.metadataOnly && entry.immutable
        && entry.deterministicOrder === index + 1));
    }
    assert.ok(extensions.every(({ runtimePluginRegistration }) =>
      !runtimePluginRegistration));
  });

  it("preserves Foundation collections and derives counts dynamically", () => {
    const { foundation, inventory } = VisualizationSuiteRegistryPlatform;
    assert.equal(inventory.foundationInventory, foundation.inventory);
    assert.equal(inventory.foundationPlatforms, foundation.composition);
    assert.equal(inventory.foundationContracts, foundation.contracts);
    assert.equal(inventory.foundationCapabilities, foundation.capabilities);
    assert.equal(inventory.foundationBoundaries, foundation.boundaries);
    assert.equal(inventory.foundationLifecycle, foundation.lifecycle);
    assert.equal(inventory.counts.collectionCount, inventory.collections.length);
    assert.equal(inventory.counts.platformCount, inventory.platformRegistry.length);
    assert.equal(inventory.counts.categoryCount, inventory.categories.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(inventory.counts.extensionCount, inventory.extensions.length);
    assert.equal(getVisualizationSuiteRegistryCount(),
      inventory.collections.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsFoundationInventory, false);
  });

  it("uses Foundation as its only phase dependency", () => {
    assert.equal(VisualizationSuiteRegistryMetadata.dependency
      .visualizationSuiteFoundationOnly, true);
    const combined = sources.join("\n");
    const imports = [...combined.matchAll(/from ["']\.\/(.+?)["']/g)]
      .map((match) => match[1]!);
    assert.ok(imports.every((name) => name.startsWith("visualizationSuite")));
    assert.doesNotMatch(combined, /PublicIndex\.ts["']/);
    assert.doesNotMatch(combined,
      /from ["']\.\/(?:sceneRendering|graphVisualization|timelineVisualization|chartMetricVisualization|dashboardExecutiveWorkspaceVisualization|animationEffects|visualizationPlatform)/);
  });

  it("contains immutable metadata and no prohibited runtime", () => {
    const metadata = VisualizationSuiteRegistryMetadata;
    assert.ok(Object.isFrozen(VisualizationSuiteRegistryPlatform));
    assert.equal(metadata.registryRuntime, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.visualizationExecution, false);
    assert.equal(metadata.runtimeComposition, false);
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
    assert.equal(getVisualizationSuiteRegistrySummary().status,
      "ReadyForModel");
    const release = getVisualizationSuiteRegistryReleaseMetadata();
    assert.equal(release.status, "ReadyForModel");
    assert.equal(release.foundationReference,
      "EVE-9:1/VisualizationSuiteFoundation");
  });
});
