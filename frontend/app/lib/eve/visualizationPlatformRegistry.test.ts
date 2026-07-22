import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as RegistryExports from "./visualizationPlatformRegistry.ts";
import {
  VisualizationPlatformRegistryIdentityMetadata,
  VisualizationPlatformRegistryMetadata,
  VisualizationPlatformRegistryPlatform,
  VisualizationPlatformRegistryReadinessMetadata,
  getVisualizationPlatformRegistryCount,
  getVisualizationPlatformRegistryReleaseMetadata,
  getVisualizationPlatformRegistrySummary,
} from "./visualizationPlatformRegistry.ts";

const files = Object.freeze([
  "visualizationPlatformRegistry.test.ts", "visualizationPlatformRegistry.ts",
  "visualizationPlatformRegistryCatalog.ts",
  "visualizationPlatformRegistryExtensions.ts",
  "visualizationPlatformRegistryInventory.ts",
  "visualizationPlatformRegistryMetadata.ts",
  "visualizationPlatformRegistryPolicies.ts",
  "visualizationPlatformRegistryTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-8:2 Visualization Platform Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(RegistryExports).sort(), [
      "VisualizationPlatformRegistryIdentityMetadata",
      "VisualizationPlatformRegistryInventoryMetadata",
      "VisualizationPlatformRegistryMetadata",
      "VisualizationPlatformRegistryPlatform",
      "VisualizationPlatformRegistryReadinessMetadata",
      "getVisualizationPlatformRegistryCount",
      "getVisualizationPlatformRegistryReleaseMetadata",
      "getVisualizationPlatformRegistrySummary",
    ].sort());
  });

  it("publishes canonical identity and Model readiness", () => {
    assert.equal(VisualizationPlatformRegistryIdentityMetadata.id,
      "EVE-8:2/VisualizationPlatformRegistry");
    assert.equal(VisualizationPlatformRegistryIdentityMetadata.namespace,
      "nexora.eve.visualization-platform.registry");
    assert.equal(VisualizationPlatformRegistryReadinessMetadata.status,
      "ReadyForModel");
  });

  it("publishes sixteen immutable registry collections", () => {
    const { collections, foundation } = VisualizationPlatformRegistryPlatform;
    assert.equal(collections.length, 16);
    assert.equal(new Set(collections.map(({ id }) => id)).size,
      collections.length);
    assert.ok(collections.every((entry, index) => Object.isFrozen(entry)
      && entry.foundationContractReference === foundation.contracts[index]
      && entry.deterministicOrder === index + 1 && !entry.executable));
  });

  it("registers exactly seven released modules by Foundation reference", () => {
    const { modules, foundation } = VisualizationPlatformRegistryPlatform;
    assert.equal(modules.length, 7);
    assert.ok(modules.every((module, index) => Object.isFrozen(module)
      && module.foundationModuleReference === foundation.composition[index]
      && module.publicIndexReference === foundation.composition[index]!.publicIndex
      && module.release === "Released"
      && module.deterministicOrder === index + 1));
  });

  it("derives categories exclusively from Foundation contracts", () => {
    const { categories, foundation } = VisualizationPlatformRegistryPlatform;
    assert.equal(categories.length, foundation.contracts.length);
    assert.ok(categories.every((category, index) => Object.isFrozen(category)
      && category.foundationReference === foundation.contracts[index]
      && category.immutableCollection[0] === foundation.contracts[index]
      && category.deterministicOrder === index + 1));
  });

  it("publishes ten policies and twelve extension classifications", () => {
    const { policies, extensions } = VisualizationPlatformRegistryPlatform;
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
    const { foundation, inventory } = VisualizationPlatformRegistryPlatform;
    assert.equal(inventory.foundationInventory, foundation.inventory);
    assert.equal(inventory.foundationModules, foundation.composition);
    assert.equal(inventory.foundationContracts, foundation.contracts);
    assert.equal(inventory.foundationCapabilities, foundation.capabilities);
    assert.equal(inventory.foundationBoundaries, foundation.boundaries);
    assert.equal(inventory.foundationLifecycle, foundation.lifecycle);
    assert.equal(inventory.counts.collectionCount, inventory.collections.length);
    assert.equal(inventory.counts.moduleCount, inventory.moduleRegistry.length);
    assert.equal(inventory.counts.categoryCount, inventory.categories.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(inventory.counts.extensionCount, inventory.extensions.length);
    assert.equal(getVisualizationPlatformRegistryCount(),
      inventory.collections.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsFoundationInventory, false);
  });

  it("uses Foundation as its only phase dependency", () => {
    assert.equal(VisualizationPlatformRegistryMetadata.dependency
      .visualizationPlatformFoundationOnly, true);
    const combined = sources.join("\n");
    const imports = [...combined.matchAll(/from ["']\.\/(.+?)["']/g)]
      .map((match) => match[1]!);
    assert.ok(imports.every((name) => name.startsWith("visualizationPlatform")));
    assert.doesNotMatch(combined,
      /from ["']\.\/(?:sceneRendering|graphVisualization|timelineVisualization|chartMetricVisualization|dashboardExecutiveWorkspaceVisualization|animationEffects)/);
  });

  it("contains immutable metadata and no prohibited runtime", () => {
    const metadata = VisualizationPlatformRegistryMetadata;
    assert.ok(Object.isFrozen(VisualizationPlatformRegistryPlatform));
    assert.equal(metadata.registryRuntime, false);
    assert.equal(metadata.rendering, false);
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
    assert.equal(getVisualizationPlatformRegistrySummary().status,
      "ReadyForModel");
    const release = getVisualizationPlatformRegistryReleaseMetadata();
    assert.equal(release.status, "ReadyForModel");
    assert.equal(release.foundationReference,
      "EVE-8:1/VisualizationPlatformFoundation");
  });
});
