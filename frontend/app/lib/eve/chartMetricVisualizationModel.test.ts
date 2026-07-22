import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ModelExports from "./chartMetricVisualizationModel.ts";
import {
  ChartMetricVisualizationModelIdentityMetadata,
  ChartMetricVisualizationModelInventoryMetadata,
  ChartMetricVisualizationModelMetadata,
  ChartMetricVisualizationModelPlatform,
  ChartMetricVisualizationModelReadinessMetadata,
  getChartMetricVisualizationModelCount,
  getChartMetricVisualizationModelReleaseMetadata,
  getChartMetricVisualizationModelSummary,
} from "./chartMetricVisualizationModel.ts";

const files = Object.freeze([
  "chartMetricVisualizationModel.test.ts", "chartMetricVisualizationModel.ts",
  "chartMetricVisualizationModelDescriptors.ts", "chartMetricVisualizationModelInventory.ts",
  "chartMetricVisualizationModelMetadata.ts", "chartMetricVisualizationModelPolicies.ts",
  "chartMetricVisualizationModelRelationships.ts", "chartMetricVisualizationModelTypes.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => ({ name, source: readFileSync(new URL(name, import.meta.url), "utf8") }));

describe("EVE-5:3 Chart & Metric Visualization Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) => files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ModelExports).sort(), [
      "ChartMetricVisualizationModelIdentityMetadata",
      "ChartMetricVisualizationModelInventoryMetadata",
      "ChartMetricVisualizationModelMetadata",
      "ChartMetricVisualizationModelPlatform",
      "ChartMetricVisualizationModelReadinessMetadata",
      "getChartMetricVisualizationModelCount",
      "getChartMetricVisualizationModelReleaseMetadata",
      "getChartMetricVisualizationModelSummary",
    ].sort());
  });

  it("publishes the canonical identity and readiness", () => {
    const identity = ChartMetricVisualizationModelIdentityMetadata;
    assert.equal(identity.id, "EVE-5:3/ChartMetricVisualizationModel");
    assert.equal(identity.name, "Chart & Metric Visualization Model");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace, "nexora.eve.chart-metric-visualization.model");
    assert.equal(identity.status, "ReadyForValidation");
    assert.equal(ChartMetricVisualizationModelReadinessMetadata.status,
      "ReadyForValidation");
  });

  it("publishes exactly twenty immutable typed model descriptors", () => {
    const { descriptors, registry } = ChartMetricVisualizationModelPlatform;
    assert.equal(descriptors.length, 20);
    assert.ok(Object.isFrozen(descriptors));
    assert.equal(new Set(descriptors.map(({ id }) => id)).size, descriptors.length);
    descriptors.forEach((descriptor, index) => {
      assert.ok(Object.isFrozen(descriptor));
      assert.ok(Object.isFrozen(descriptor.structuralMetadata));
      assert.equal(descriptor.deterministicOrder, index + 1);
      assert.equal(descriptor.registryReference, registry.categories[index]);
      assert.equal(descriptor.executableBehavior, false);
    });
  });

  it("publishes exactly eighteen immutable architectural relationships", () => {
    const relationships = ChartMetricVisualizationModelPlatform.relationships;
    assert.equal(relationships.length, 18);
    assert.ok(Object.isFrozen(relationships));
    assert.equal(new Set(relationships.map(({ id }) => id)).size, relationships.length);
    assert.ok(relationships.every((relationship, index) => Object.isFrozen(relationship)
      && relationship.deterministicOrder === index + 1
      && !relationship.executionProvided && !relationship.aggregationProvided));
  });

  it("publishes structural composition and exactly fourteen policies", () => {
    const { composition, policies } = ChartMetricVisualizationModelPlatform;
    assert.equal(composition.length, 18);
    assert.equal(policies.length, 14);
    for (const collection of [composition, policies]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly && entry.deterministicOrder === index + 1));
    }
  });

  it("preserves Registry collections and Foundation reachability by reference", () => {
    const { registry, inventory } = ChartMetricVisualizationModelPlatform;
    assert.equal(inventory.registryVocabularyRegistries, registry.vocabularyRegistries);
    assert.equal(inventory.registryCategories, registry.categories);
    assert.equal(inventory.registryInventory, registry.inventory);
    assert.equal(inventory.registryPolicies, registry.policies);
    assert.equal(inventory.registryExtensions, registry.extensions);
    assert.equal(inventory.registryFoundationReference, registry.foundation);
  });

  it("derives every Model inventory count dynamically", () => {
    const inventory = ChartMetricVisualizationModelInventoryMetadata;
    assert.equal(inventory.counts.modelCount, inventory.models.length);
    assert.equal(inventory.counts.relationshipCount, inventory.relationships.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(inventory.counts.compositionEntryCount,
      inventory.structuralComposition.length);
    assert.equal(getChartMetricVisualizationModelCount(), inventory.models.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsRegistryCollections, false);
  });

  it("uses Registry as its only upstream phase dependency", () => {
    assert.equal(ChartMetricVisualizationModelMetadata.dependency
      .chartMetricVisualizationRegistryOnly, true);
    const combined = sources.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/timelineVisualization/);
    assert.doesNotMatch(combined, /from ["']\.\/(?:graphVisualization|sceneRendering)/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("is immutable metadata with no prohibited runtime facilities", () => {
    const metadata = ChartMetricVisualizationModelMetadata;
    assert.ok(Object.isFrozen(ChartMetricVisualizationModelPlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.calculation, false);
    assert.equal(metadata.aggregation, false);
    assert.equal(metadata.forecasting, false);
    assert.equal(metadata.statisticalAnalysis, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.dashboardExecution, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
    const combined = sources.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined,
      /from ["'](?:react|next|d3|chart\.js|recharts|echarts|plotly|vega)/i);
    assert.doesNotMatch(combined, /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getChartMetricVisualizationModelSummary().status, "ReadyForValidation");
    const release = getChartMetricVisualizationModelReleaseMetadata();
    assert.equal(release.status, "ReadyForValidation");
    assert.equal(release.registryReference,
      "EVE-5:2/ChartMetricVisualizationRegistry");
  });
});
