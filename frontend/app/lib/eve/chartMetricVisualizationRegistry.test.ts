import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as RegistryExports from "./chartMetricVisualizationRegistry.ts";
import {
  ChartMetricVisualizationRegistryIdentityMetadata,
  ChartMetricVisualizationRegistryInventoryMetadata,
  ChartMetricVisualizationRegistryMetadata,
  ChartMetricVisualizationRegistryPlatform,
  ChartMetricVisualizationRegistryReadinessMetadata,
  getChartMetricVisualizationRegistryCount,
  getChartMetricVisualizationRegistryReleaseMetadata,
  getChartMetricVisualizationRegistrySummary,
} from "./chartMetricVisualizationRegistry.ts";

const files = Object.freeze([
  "chartMetricVisualizationCategories.ts", "chartMetricVisualizationExtensions.ts",
  "chartMetricVisualizationInventory.ts", "chartMetricVisualizationPolicies.ts",
  "chartMetricVisualizationRegistry.test.ts", "chartMetricVisualizationRegistry.ts",
  "chartMetricVisualizationRegistryTypes.ts", "chartMetricVisualizationVocabulary.ts",
]);

const implementationSources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => ({ name, source: readFileSync(new URL(name, import.meta.url), "utf8") }));

describe("EVE-5:2 Chart & Metric Visualization Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname)
      .filter((name) => files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(RegistryExports).sort(), [
      "ChartMetricVisualizationRegistryIdentityMetadata",
      "ChartMetricVisualizationRegistryInventoryMetadata",
      "ChartMetricVisualizationRegistryMetadata",
      "ChartMetricVisualizationRegistryPlatform",
      "ChartMetricVisualizationRegistryReadinessMetadata",
      "getChartMetricVisualizationRegistryCount",
      "getChartMetricVisualizationRegistryReleaseMetadata",
      "getChartMetricVisualizationRegistrySummary",
    ].sort());
  });

  it("publishes the canonical identity and readiness", () => {
    const identity = ChartMetricVisualizationRegistryIdentityMetadata;
    assert.equal(identity.id, "EVE-5:2/ChartMetricVisualizationRegistry");
    assert.equal(identity.name, "Chart & Metric Visualization Registry");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace, "nexora.eve.chart-metric-visualization.registry");
    assert.equal(identity.status, "ReadyForModel");
    assert.equal(ChartMetricVisualizationRegistryReadinessMetadata.status, "ReadyForModel");
  });

  it("publishes exact Foundation-aligned registries and categories", () => {
    const platform = ChartMetricVisualizationRegistryPlatform;
    assert.equal(platform.vocabularyRegistries.length, 20);
    assert.equal(platform.categories.length, 20);
    platform.vocabularyRegistries.forEach((registry, index) => {
      assert.ok(Object.isFrozen(registry));
      assert.ok(Object.isFrozen(registry.entries));
      assert.equal(registry.deterministicOrder, index + 1);
      assert.equal(registry.foundationContractReference, platform.foundation.contracts[index]);
      assert.ok(registry.entries.every((entry, entryIndex) => Object.isFrozen(entry)
        && entry.deterministicOrder === entryIndex + 1));
      assert.equal(platform.categories[index]!.vocabularyRegistryReference, registry);
    });
  });

  it("publishes exact immutable extensions and policies", () => {
    const platform = ChartMetricVisualizationRegistryPlatform;
    assert.equal(platform.extensions.length, 16);
    assert.equal(platform.policies.length, 14);
    for (const collection of [platform.extensions, platform.policies]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly && entry.deterministicOrder === index + 1));
    }
  });

  it("registers the required standard descriptive vocabulary", () => {
    const vocabulary = ChartMetricVisualizationRegistryPlatform.standardVocabulary;
    assert.equal(vocabulary.chartTypes.length, 18);
    assert.equal(vocabulary.metricStatuses.length, 10);
    assert.equal(vocabulary.metricDirections.length, 6);
    assert.equal(vocabulary.metricFormats.length, 12);
    assert.equal(vocabulary.comparisonTypes.length, 8);
    assert.ok(Object.isFrozen(vocabulary));
  });

  it("preserves all Foundation collections by canonical reference", () => {
    const { foundation, inventory } = ChartMetricVisualizationRegistryPlatform;
    assert.equal(inventory.foundationContracts, foundation.contracts);
    assert.equal(inventory.foundationOwnership, foundation.ownership);
    assert.equal(inventory.foundationBoundaries, foundation.boundaries);
    assert.equal(inventory.foundationLifecycle, foundation.lifecycle);
    assert.equal(inventory.foundationCapabilities, foundation.capabilities);
    assert.equal(inventory.foundationPolicies, foundation.policies);
    assert.equal(inventory.foundationIdentity, foundation.identity);
    assert.equal(inventory.foundationInventory, foundation.inventory);
  });

  it("derives inventory counts dynamically from Registry collections", () => {
    const inventory = ChartMetricVisualizationRegistryInventoryMetadata;
    assert.equal(inventory.counts.vocabularyRegistryCount,
      inventory.vocabularyRegistries.length);
    assert.equal(inventory.counts.categoryCount, inventory.categories.length);
    assert.equal(inventory.counts.vocabularyEntryCount, inventory.entries.length);
    assert.equal(inventory.counts.extensionClassificationCount, inventory.extensions.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(getChartMetricVisualizationRegistryCount(), inventory.entries.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsFoundationCollections, false);
  });

  it("uses Foundation as its only upstream phase dependency", () => {
    assert.equal(ChartMetricVisualizationRegistryMetadata.dependency
      .chartMetricVisualizationFoundationOnly, true);
    const combined = implementationSources.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/timelineVisualization/);
    assert.doesNotMatch(combined, /from ["']\.\/(?:graphVisualization|sceneRendering|visualizationPublicIndex)/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("is immutable metadata with no prohibited runtime facilities", () => {
    const platform = ChartMetricVisualizationRegistryPlatform;
    assert.ok(Object.isFrozen(platform));
    assert.ok(Object.isFrozen(ChartMetricVisualizationRegistryMetadata));
    assert.equal(platform.metadata.calculation, false);
    assert.equal(platform.metadata.aggregation, false);
    assert.equal(platform.metadata.forecasting, false);
    assert.equal(platform.metadata.rendering, false);
    assert.equal(platform.metadata.dashboardExecution, false);
    assert.equal(platform.metadata.networking, false);
    assert.equal(platform.metadata.persistence, false);
    assert.equal(platform.metadata.services, false);
    assert.equal(platform.metadata.factories, false);
    const combined = implementationSources.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined,
      /from ["'](?:react|next|d3|chart\.js|recharts|echarts|plotly|vega)/i);
    assert.doesNotMatch(combined, /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getChartMetricVisualizationRegistrySummary().status, "ReadyForModel");
    const release = getChartMetricVisualizationRegistryReleaseMetadata();
    assert.equal(release.status, "ReadyForModel");
    assert.equal(release.foundationReference,
      "EVE-5:1/ChartMetricVisualizationFoundation");
  });
});
