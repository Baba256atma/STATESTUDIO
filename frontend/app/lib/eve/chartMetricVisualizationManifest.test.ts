import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ManifestExports from "./chartMetricVisualizationManifest.ts";
import {
  ChartMetricVisualizationManifestIdentityMetadata,
  ChartMetricVisualizationManifestInventoryMetadata,
  ChartMetricVisualizationManifestMetadata,
  ChartMetricVisualizationManifestPlatform,
  ChartMetricVisualizationManifestReadinessMetadata,
  getChartMetricVisualizationManifestCount,
  getChartMetricVisualizationManifestReleaseMetadata,
  getChartMetricVisualizationManifestSummary,
} from "./chartMetricVisualizationManifest.ts";

const files = Object.freeze([
  "chartMetricVisualizationManifest.test.ts", "chartMetricVisualizationManifest.ts",
  "chartMetricVisualizationManifestCompatibility.ts",
  "chartMetricVisualizationManifestGuarantees.ts",
  "chartMetricVisualizationManifestInventory.ts",
  "chartMetricVisualizationManifestMetadata.ts",
  "chartMetricVisualizationManifestReadiness.ts",
  "chartMetricVisualizationManifestTypes.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => ({ name, source: readFileSync(new URL(name, import.meta.url), "utf8") }));

describe("EVE-5:5 Chart & Metric Visualization Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) => files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ManifestExports).sort(), [
      "ChartMetricVisualizationManifestIdentityMetadata",
      "ChartMetricVisualizationManifestInventoryMetadata",
      "ChartMetricVisualizationManifestMetadata",
      "ChartMetricVisualizationManifestPlatform",
      "ChartMetricVisualizationManifestReadinessMetadata",
      "getChartMetricVisualizationManifestCount",
      "getChartMetricVisualizationManifestReleaseMetadata",
      "getChartMetricVisualizationManifestSummary",
    ].sort());
  });

  it("publishes the canonical identity and readiness", () => {
    const identity = ChartMetricVisualizationManifestIdentityMetadata;
    assert.equal(identity.id, "EVE-5:5/ChartMetricVisualizationManifest");
    assert.equal(identity.name, "Chart & Metric Visualization Manifest");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace, "nexora.eve.chart-metric-visualization.manifest");
    assert.equal(identity.status, "ReadyForPlatform");
    assert.equal(ChartMetricVisualizationManifestReadinessMetadata.status,
      "ReadyForPlatform");
  });

  it("publishes the canonical five-phase composition by reference", () => {
    const { composition, validation } = ChartMetricVisualizationManifestPlatform;
    const model = validation.model;
    const registry = model.registry;
    const foundation = registry.foundation;
    assert.deepEqual(composition.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest",
    ]);
    assert.equal(composition[0]!.canonicalSource, foundation);
    assert.equal(composition[1]!.canonicalSource, registry);
    assert.equal(composition[2]!.canonicalSource, model);
    assert.equal(composition[3]!.canonicalSource, validation);
    assert.equal(composition[4]!.canonicalSource, null);
    assert.ok(composition.every((entry, index) => Object.isFrozen(entry)
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
  });

  it("publishes exactly twelve guarantees and eight compatibility declarations", () => {
    const { guarantees, compatibility } = ChartMetricVisualizationManifestPlatform;
    assert.equal(guarantees.length, 12);
    assert.equal(compatibility.length, 8);
    for (const collection of [guarantees, compatibility]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly && entry.deterministicOrder === index + 1));
    }
  });

  it("publishes exactly seven immutable readiness declarations", () => {
    const readiness = ChartMetricVisualizationManifestPlatform.readinessDeclarations;
    assert.equal(readiness.length, 7);
    assert.ok(Object.isFrozen(readiness));
    assert.ok(readiness.every((entry, index) => Object.isFrozen(entry)
      && entry.ready && !entry.executes && entry.deterministicOrder === index + 1));
  });

  it("preserves every Validation collection by canonical reference", () => {
    const { validation, inventory } = ChartMetricVisualizationManifestPlatform;
    assert.equal(inventory.validationInventory, validation.inventory);
    assert.equal(inventory.validationCategories, validation.categories);
    assert.equal(inventory.validationRules, validation.rules);
    assert.equal(inventory.validationGates, validation.gates);
    assert.equal(inventory.validationDiagnostics, validation.diagnostics);
    assert.equal(inventory.validationSeverityLevels, validation.severityLevels);
    assert.equal(inventory.validationOutcomes, validation.outcomes);
    assert.equal(inventory.validationPolicies, validation.policies);
    assert.equal(inventory.validationReadinessDeclarations,
      validation.readinessDeclarations);
  });

  it("derives all Manifest inventory counts dynamically", () => {
    const inventory = ChartMetricVisualizationManifestInventoryMetadata;
    assert.equal(inventory.counts.phaseCount, inventory.phaseComposition.length);
    assert.equal(inventory.counts.validationCategoryCount,
      inventory.validationCategories.length);
    assert.equal(inventory.counts.validationRuleCount, inventory.validationRules.length);
    assert.equal(inventory.counts.validationGateCount, inventory.validationGates.length);
    assert.equal(inventory.counts.validationDiagnosticCount,
      inventory.validationDiagnostics.length);
    assert.equal(inventory.counts.guaranteeCount, inventory.guarantees.length);
    assert.equal(inventory.counts.compatibilityCount, inventory.compatibility.length);
    assert.equal(inventory.counts.readinessCount, inventory.readiness.length);
    assert.equal(inventory.counts.publicSurfaceCount, inventory.publicManifestSurface.length);
    assert.equal(getChartMetricVisualizationManifestCount(),
      inventory.phaseComposition.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Validation as its only upstream phase dependency", () => {
    assert.equal(ChartMetricVisualizationManifestMetadata.dependency
      .chartMetricVisualizationValidationOnly, true);
    const combined = sources.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationModel/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationRegistry/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/timelineVisualization/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("is immutable metadata with no manifest or visualization runtime", () => {
    const metadata = ChartMetricVisualizationManifestMetadata;
    assert.ok(Object.isFrozen(ChartMetricVisualizationManifestPlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.manifestExecution, false);
    assert.equal(metadata.validationExecution, false);
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
      /from ["'](?:react|next|d3|chart\.js|echarts|plotly|vega)/i);
    assert.doesNotMatch(combined, /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getChartMetricVisualizationManifestSummary().status, "ReadyForPlatform");
    const release = getChartMetricVisualizationManifestReleaseMetadata();
    assert.equal(release.status, "ReadyForPlatform");
    assert.equal(release.validationReference,
      "EVE-5:4/ChartMetricVisualizationValidation");
  });
});
