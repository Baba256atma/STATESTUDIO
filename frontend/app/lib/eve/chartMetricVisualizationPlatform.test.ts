import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PlatformExports from "./chartMetricVisualizationPlatform.ts";
import {
  ChartMetricVisualizationPlatform,
  ChartMetricVisualizationPlatformIdentityMetadata,
  ChartMetricVisualizationPlatformInventoryMetadata,
  ChartMetricVisualizationPlatformMetadata,
  ChartMetricVisualizationPlatformReadinessMetadata,
  getChartMetricVisualizationPlatformCount,
  getChartMetricVisualizationPlatformReleaseMetadata,
  getChartMetricVisualizationPlatformSummary,
} from "./chartMetricVisualizationPlatform.ts";

const files = Object.freeze([
  "chartMetricVisualizationPlatform.test.ts", "chartMetricVisualizationPlatform.ts",
  "chartMetricVisualizationPlatformCapabilities.ts",
  "chartMetricVisualizationPlatformCompatibility.ts",
  "chartMetricVisualizationPlatformGuarantees.ts",
  "chartMetricVisualizationPlatformInventory.ts",
  "chartMetricVisualizationPlatformMetadata.ts",
  "chartMetricVisualizationPlatformTypes.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => ({ name, source: readFileSync(new URL(name, import.meta.url), "utf8") }));

describe("EVE-5:6 Chart & Metric Visualization Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) => files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(PlatformExports).sort(), [
      "ChartMetricVisualizationPlatform",
      "ChartMetricVisualizationPlatformIdentityMetadata",
      "ChartMetricVisualizationPlatformInventoryMetadata",
      "ChartMetricVisualizationPlatformMetadata",
      "ChartMetricVisualizationPlatformReadinessMetadata",
      "getChartMetricVisualizationPlatformCount",
      "getChartMetricVisualizationPlatformReleaseMetadata",
      "getChartMetricVisualizationPlatformSummary",
    ].sort());
  });

  it("publishes the canonical identity and readiness", () => {
    const identity = ChartMetricVisualizationPlatformIdentityMetadata;
    assert.equal(identity.id, "EVE-5:6/ChartMetricVisualizationPlatform");
    assert.equal(identity.name, "Chart & Metric Visualization Platform");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace, "nexora.eve.chart-metric-visualization.platform");
    assert.equal(identity.status, "ReadyForCertification");
    assert.equal(ChartMetricVisualizationPlatformReadinessMetadata.status,
      "ReadyForCertification");
  });

  it("publishes the canonical six-phase composition through Manifest", () => {
    const { composition, manifest } = ChartMetricVisualizationPlatform;
    assert.deepEqual(composition.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
    ]);
    manifest.composition.forEach((entry, index) => {
      assert.equal(composition[index], entry);
    });
    assert.equal(composition[5]!.canonicalReference,
      "EVE-5:6/ChartMetricVisualizationPlatform");
    assert.ok(composition.every((entry, index) => Object.isFrozen(entry)
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
  });

  it("publishes exact immutable capabilities, guarantees, and compatibility", () => {
    const inventories = [
      [ChartMetricVisualizationPlatform.capabilities, 10],
      [ChartMetricVisualizationPlatform.guarantees, 12],
      [ChartMetricVisualizationPlatform.compatibility, 8],
    ] as const;
    for (const [entries, count] of inventories) {
      assert.equal(entries.length, count);
      assert.ok(Object.isFrozen(entries));
      assert.ok(entries.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly && entry.deterministicOrder === index + 1));
    }
  });

  it("preserves all Manifest collections by canonical reference", () => {
    const { manifest, inventory } = ChartMetricVisualizationPlatform;
    assert.equal(inventory.manifestInventory, manifest.inventory);
    assert.equal(inventory.manifestComposition, manifest.composition);
    assert.equal(inventory.manifestGuarantees, manifest.guarantees);
    assert.equal(inventory.manifestCompatibility, manifest.compatibility);
    assert.equal(inventory.manifestReadiness, manifest.readiness);
    assert.equal(inventory.manifestReadinessDeclarations, manifest.readinessDeclarations);
    assert.equal(inventory.manifestMetadata, manifest.metadata);
  });

  it("derives all Platform inventory counts dynamically", () => {
    const inventory = ChartMetricVisualizationPlatformInventoryMetadata;
    assert.equal(inventory.counts.phaseCount, inventory.phaseComposition.length);
    assert.equal(inventory.counts.capabilityCount, inventory.capabilities.length);
    assert.equal(inventory.counts.guaranteeCount, inventory.guarantees.length);
    assert.equal(inventory.counts.compatibilityCount, inventory.compatibility.length);
    assert.equal(inventory.counts.publicSurfaceCount, inventory.publicPlatformSurface.length);
    assert.equal(getChartMetricVisualizationPlatformCount(),
      inventory.phaseComposition.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Manifest as its only upstream phase dependency", () => {
    assert.equal(ChartMetricVisualizationPlatformMetadata.dependency
      .chartMetricVisualizationManifestOnly, true);
    const combined = sources.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationValidation/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationModel/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationRegistry/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/timelineVisualization/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("is immutable metadata with no platform or visualization runtime", () => {
    const metadata = ChartMetricVisualizationPlatformMetadata;
    assert.ok(Object.isFrozen(ChartMetricVisualizationPlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.platformExecution, false);
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
    assert.equal(getChartMetricVisualizationPlatformSummary().status,
      "ReadyForCertification");
    const release = getChartMetricVisualizationPlatformReleaseMetadata();
    assert.equal(release.status, "ReadyForCertification");
    assert.equal(release.manifestReference,
      "EVE-5:5/ChartMetricVisualizationManifest");
  });
});
