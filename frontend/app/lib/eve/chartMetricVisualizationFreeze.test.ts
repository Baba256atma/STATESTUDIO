import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as FreezeExports from "./chartMetricVisualizationFreeze.ts";
import {
  ChartMetricVisualizationFreezeIdentityMetadata,
  ChartMetricVisualizationFreezeInventoryMetadata,
  ChartMetricVisualizationFreezeMetadata,
  ChartMetricVisualizationFreezePlatform,
  ChartMetricVisualizationFreezeReadinessMetadata,
  getChartMetricVisualizationFreezeCount,
  getChartMetricVisualizationFreezeReleaseMetadata,
  getChartMetricVisualizationFreezeSummary,
} from "./chartMetricVisualizationFreeze.ts";

const files = Object.freeze([
  "chartMetricVisualizationFreeze.test.ts", "chartMetricVisualizationFreeze.ts",
  "chartMetricVisualizationFreezeBaselines.ts",
  "chartMetricVisualizationFreezeCompatibility.ts",
  "chartMetricVisualizationFreezeExtensions.ts",
  "chartMetricVisualizationFreezeLocks.ts", "chartMetricVisualizationFreezeRegistry.ts",
  "chartMetricVisualizationFreezeTypes.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => ({ name, source: readFileSync(new URL(name, import.meta.url), "utf8") }));

describe("EVE-5:8 Chart & Metric Visualization Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) => files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(FreezeExports).sort(), [
      "ChartMetricVisualizationFreezeIdentityMetadata",
      "ChartMetricVisualizationFreezeInventoryMetadata",
      "ChartMetricVisualizationFreezeMetadata",
      "ChartMetricVisualizationFreezePlatform",
      "ChartMetricVisualizationFreezeReadinessMetadata",
      "getChartMetricVisualizationFreezeCount",
      "getChartMetricVisualizationFreezeReleaseMetadata",
      "getChartMetricVisualizationFreezeSummary",
    ].sort());
  });

  it("publishes the canonical frozen identity, lock, and readiness", () => {
    const identity = ChartMetricVisualizationFreezeIdentityMetadata;
    assert.equal(identity.id, "EVE-5:8/ChartMetricVisualizationFreeze");
    assert.equal(identity.name, "Chart & Metric Visualization Freeze");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace, "nexora.eve.chart-metric-visualization.freeze");
    assert.equal(identity.status, "Frozen");
    assert.equal(ChartMetricVisualizationFreezeReadinessMetadata.readiness,
      "ReadyForPublicIndex");
    assert.equal(ChartMetricVisualizationFreezeMetadata.lockId,
      "EVE-5-CHART-METRIC-VISUALIZATION-LOCKED");
  });

  it("publishes exactly twelve immutable architectural locks", () => {
    const locks = ChartMetricVisualizationFreezePlatform.locks;
    assert.equal(locks.length, 12);
    assert.ok(Object.isFrozen(locks));
    assert.ok(locks.every((lock, index) => Object.isFrozen(lock)
      && lock.status === "Locked" && !lock.runtimeLocking
      && lock.lockIdentifier === "EVE-5-CHART-METRIC-VISUALIZATION-LOCKED"
      && lock.deterministicOrder === index + 1));
  });

  it("publishes exact immutable baselines, compatibility, and extensions", () => {
    const inventories = [
      ChartMetricVisualizationFreezePlatform.baselines,
      ChartMetricVisualizationFreezePlatform.compatibility,
      ChartMetricVisualizationFreezePlatform.extensions,
    ];
    for (const entries of inventories) {
      assert.equal(entries.length, 8);
      assert.ok(Object.isFrozen(entries));
      assert.ok(entries.every((entry, index) => Object.isFrozen(entry)
        && entry.preservedByReference && entry.deterministicOrder === index + 1));
    }
  });

  it("publishes the canonical seven-phase frozen architecture registry", () => {
    const { registry, certification } = ChartMetricVisualizationFreezePlatform;
    assert.deepEqual(registry.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
      "Certification",
    ]);
    certification.platform.composition.forEach((entry, index) => {
      assert.equal(registry[index]!.canonicalReference, entry);
    });
    assert.equal(registry[6]!.canonicalReference, certification);
  });

  it("preserves every Certification collection by canonical reference", () => {
    const { certification, inventory } = ChartMetricVisualizationFreezePlatform;
    assert.equal(inventory.certificationInventory, certification.inventory);
    assert.equal(inventory.certificationCriteria, certification.criteria);
    assert.equal(inventory.certificationGates, certification.gates);
    assert.equal(inventory.certificationCompatibility, certification.compatibility);
    assert.equal(inventory.certificationMetadata, certification.metadata);
    assert.equal(inventory.certificationReadiness, certification.readiness);
  });

  it("derives all Freeze inventory counts dynamically", () => {
    const inventory = ChartMetricVisualizationFreezeInventoryMetadata;
    assert.equal(inventory.counts.lockCount, inventory.locks.length);
    assert.equal(inventory.counts.baselineCount, inventory.baselines.length);
    assert.equal(inventory.counts.registryEntryCount, inventory.registry.length);
    assert.equal(inventory.counts.compatibilityCount, inventory.compatibility.length);
    assert.equal(inventory.counts.extensionCount, inventory.extensions.length);
    assert.equal(inventory.counts.publicSurfaceCount, inventory.publicFreezeSurface.length);
    assert.equal(getChartMetricVisualizationFreezeCount(), inventory.locks.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Certification as its only upstream phase dependency", () => {
    assert.equal(ChartMetricVisualizationFreezeMetadata.dependency
      .chartMetricVisualizationCertificationOnly, true);
    const combined = sources.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationPlatform/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationManifest/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationValidation/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationModel/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationRegistry/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/timelineVisualization/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("is immutable metadata with no freeze or visualization runtime", () => {
    const metadata = ChartMetricVisualizationFreezeMetadata;
    assert.ok(Object.isFrozen(ChartMetricVisualizationFreezePlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.freezeEngine, false);
    assert.equal(metadata.runtimeLocking, false);
    assert.equal(metadata.lockManager, false);
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
    assert.equal(getChartMetricVisualizationFreezeSummary().status, "Frozen");
    const release = getChartMetricVisualizationFreezeReleaseMetadata();
    assert.equal(release.status, "Frozen");
    assert.equal(release.readiness, "ReadyForPublicIndex");
    assert.equal(release.lockId, "EVE-5-CHART-METRIC-VISUALIZATION-LOCKED");
    assert.equal(release.certificationReference,
      "EVE-5:7/ChartMetricVisualizationCertification");
  });
});
