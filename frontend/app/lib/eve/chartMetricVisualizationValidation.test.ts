import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ValidationExports from "./chartMetricVisualizationValidation.ts";
import {
  ChartMetricVisualizationValidationIdentityMetadata,
  ChartMetricVisualizationValidationInventoryMetadata,
  ChartMetricVisualizationValidationMetadata,
  ChartMetricVisualizationValidationPlatform,
  ChartMetricVisualizationValidationReadinessMetadata,
  getChartMetricVisualizationValidationCount,
  getChartMetricVisualizationValidationReleaseMetadata,
  getChartMetricVisualizationValidationSummary,
} from "./chartMetricVisualizationValidation.ts";

const files = Object.freeze([
  "chartMetricVisualizationValidation.test.ts", "chartMetricVisualizationValidation.ts",
  "chartMetricVisualizationValidationDiagnostics.ts",
  "chartMetricVisualizationValidationGates.ts",
  "chartMetricVisualizationValidationInventory.ts",
  "chartMetricVisualizationValidationPolicies.ts",
  "chartMetricVisualizationValidationRules.ts",
  "chartMetricVisualizationValidationTypes.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => ({ name, source: readFileSync(new URL(name, import.meta.url), "utf8") }));

describe("EVE-5:4 Chart & Metric Visualization Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) => files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ValidationExports).sort(), [
      "ChartMetricVisualizationValidationIdentityMetadata",
      "ChartMetricVisualizationValidationInventoryMetadata",
      "ChartMetricVisualizationValidationMetadata",
      "ChartMetricVisualizationValidationPlatform",
      "ChartMetricVisualizationValidationReadinessMetadata",
      "getChartMetricVisualizationValidationCount",
      "getChartMetricVisualizationValidationReleaseMetadata",
      "getChartMetricVisualizationValidationSummary",
    ].sort());
  });

  it("publishes the canonical identity and readiness", () => {
    const identity = ChartMetricVisualizationValidationIdentityMetadata;
    assert.equal(identity.id, "EVE-5:4/ChartMetricVisualizationValidation");
    assert.equal(identity.name, "Chart & Metric Visualization Validation");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace, "nexora.eve.chart-metric-visualization.validation");
    assert.equal(identity.status, "ReadyForManifest");
    assert.equal(ChartMetricVisualizationValidationReadinessMetadata.status,
      "ReadyForManifest");
  });

  it("publishes exact immutable validation categories and rules", () => {
    const { categories, rules, model } = ChartMetricVisualizationValidationPlatform;
    assert.equal(categories.length, 18);
    assert.equal(rules.length, 18);
    assert.ok(Object.isFrozen(categories));
    assert.ok(Object.isFrozen(rules));
    rules.forEach((rule, index) => {
      assert.ok(Object.isFrozen(rule));
      assert.equal(rule.categoryReference, categories[index]);
      assert.equal(rule.modelReference, model.metadata.id);
      assert.equal(rule.deterministicOrder, index + 1);
      assert.equal(rule.executes, false);
    });
  });

  it("publishes exact gates, diagnostics, severities, outcomes, policies, and readiness", () => {
    const platform = ChartMetricVisualizationValidationPlatform;
    const inventories = [
      [platform.gates, 16], [platform.diagnostics, 8], [platform.severityLevels, 6],
      [platform.outcomes, 6], [platform.policies, 14],
      [platform.readinessDeclarations, 7],
    ] as const;
    for (const [entries, count] of inventories) {
      assert.equal(entries.length, count);
      assert.ok(Object.isFrozen(entries));
    }
    for (const entries of [platform.gates, platform.diagnostics, platform.policies,
      platform.readinessDeclarations]) {
      assert.ok(entries.every((entry, index) => Object.isFrozen(entry)
        && entry.metadataOnly && entry.immutable && entry.deterministicOrder === index + 1));
    }
  });

  it("preserves Model collections and upstream reachability by canonical reference", () => {
    const { model, inventory } = ChartMetricVisualizationValidationPlatform;
    assert.equal(inventory.modelDescriptors, model.descriptors);
    assert.equal(inventory.modelRelationships, model.relationships);
    assert.equal(inventory.modelComposition, model.composition);
    assert.equal(inventory.modelPolicies, model.policies);
    assert.equal(inventory.modelMetadata, model.metadata);
    assert.equal(inventory.modelInventory, model.inventory);
    assert.equal(inventory.modelIdentity, model.identity);
    assert.equal(inventory.modelRegistryReference, model.registry);
  });

  it("derives every Validation inventory count dynamically", () => {
    const inventory = ChartMetricVisualizationValidationInventoryMetadata;
    assert.equal(inventory.counts.categoryCount, inventory.categories.length);
    assert.equal(inventory.counts.ruleCount, inventory.rules.length);
    assert.equal(inventory.counts.gateCount, inventory.gates.length);
    assert.equal(inventory.counts.diagnosticCount, inventory.diagnostics.length);
    assert.equal(inventory.counts.severityLevelCount, inventory.severityLevels.length);
    assert.equal(inventory.counts.outcomeCount, inventory.outcomes.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(inventory.counts.readinessDeclarationCount,
      inventory.readinessDeclarations.length);
    assert.equal(getChartMetricVisualizationValidationCount(), inventory.rules.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsModelCollections, false);
  });

  it("uses Model as its only upstream phase dependency", () => {
    assert.equal(ChartMetricVisualizationValidationMetadata.dependency
      .chartMetricVisualizationModelOnly, true);
    const combined = sources.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationRegistry/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/timelineVisualization/);
    assert.doesNotMatch(combined, /from ["']\.\/(?:graphVisualization|sceneRendering)/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("is immutable metadata with no validation or visualization runtime", () => {
    const metadata = ChartMetricVisualizationValidationMetadata;
    assert.ok(Object.isFrozen(ChartMetricVisualizationValidationPlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.validationEngine, false);
    assert.equal(metadata.runtimeValidation, false);
    assert.equal(metadata.calculation, false);
    assert.equal(metadata.aggregation, false);
    assert.equal(metadata.forecasting, false);
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
    assert.equal(getChartMetricVisualizationValidationSummary().status, "ReadyForManifest");
    const release = getChartMetricVisualizationValidationReleaseMetadata();
    assert.equal(release.status, "ReadyForManifest");
    assert.equal(release.modelReference, "EVE-5:3/ChartMetricVisualizationModel");
  });
});
