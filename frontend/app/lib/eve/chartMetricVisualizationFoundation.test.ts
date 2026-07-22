import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as FoundationExports from "./chartMetricVisualizationFoundation.ts";
import {
  ChartMetricVisualizationFoundationIdentityMetadata,
  ChartMetricVisualizationFoundationInventoryMetadata,
  ChartMetricVisualizationFoundationMetadata,
  ChartMetricVisualizationFoundationPlatform,
  ChartMetricVisualizationFoundationReadinessMetadata,
  getChartMetricVisualizationFoundationCount,
  getChartMetricVisualizationFoundationReleaseMetadata,
  getChartMetricVisualizationFoundationSummary,
} from "./chartMetricVisualizationFoundation.ts";

const expectedFiles = [
  "chartMetricVisualizationBoundaries.ts",
  "chartMetricVisualizationCapabilities.ts",
  "chartMetricVisualizationContracts.ts",
  "chartMetricVisualizationFoundation.test.ts",
  "chartMetricVisualizationFoundation.ts",
  "chartMetricVisualizationFoundationTypes.ts",
  "chartMetricVisualizationLifecycle.ts",
  "chartMetricVisualizationOwnership.ts",
];

const sourceFiles = expectedFiles.map((name) => ({
  name,
  source: readFileSync(new URL(name, import.meta.url), "utf8"),
}));

describe("EVE-5:1 Chart & Metric Visualization Foundation", () => {
  it("creates exactly the eight requested files", () => {
    const actual = readdirSync(import.meta.dirname)
      .filter((name) => expectedFiles.includes(name));
    assert.deepEqual(actual.sort(), [...expectedFiles].sort());
  });

  it("publishes exactly eight stable public exports", () => {
    assert.deepEqual(Object.keys(FoundationExports).sort(), [
      "ChartMetricVisualizationFoundationIdentityMetadata",
      "ChartMetricVisualizationFoundationInventoryMetadata",
      "ChartMetricVisualizationFoundationMetadata",
      "ChartMetricVisualizationFoundationPlatform",
      "ChartMetricVisualizationFoundationReadinessMetadata",
      "getChartMetricVisualizationFoundationCount",
      "getChartMetricVisualizationFoundationReleaseMetadata",
      "getChartMetricVisualizationFoundationSummary",
    ].sort());
  });

  it("publishes the canonical identity and readiness", () => {
    const identity = ChartMetricVisualizationFoundationIdentityMetadata;
    assert.equal(identity.id, "EVE-5:1/ChartMetricVisualizationFoundation");
    assert.equal(identity.name, "Chart & Metric Visualization Foundation");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace, "nexora.eve.chart-metric-visualization.foundation");
    assert.equal(identity.status, "ReadyForRegistry");
    assert.equal(ChartMetricVisualizationFoundationReadinessMetadata.status,
      "ReadyForRegistry");
  });

  it("preserves the exact EVE-4 public index and lock references", () => {
    const platform = ChartMetricVisualizationFoundationPlatform;
    assert.equal(platform.upstreamPublicIndex.metadata.id,
      "EVE-4:9/TimelineVisualizationPublicIndex");
    assert.equal(platform.metadata.upstreamPublicIndex, platform.upstreamPublicIndex);
    assert.equal(platform.metadata.upstreamLockReference,
      "EVE-4-TIMELINE-VISUALIZATION-LOCKED");
    assert.equal(getChartMetricVisualizationFoundationReleaseMetadata()
      .upstreamLockReference, "EVE-4-TIMELINE-VISUALIZATION-LOCKED");
  });

  it("declares the exact immutable, unique, ordered inventories", () => {
    const platform = ChartMetricVisualizationFoundationPlatform;
    const inventories = [
      [platform.contracts, 20], [platform.boundaries, 12],
      [platform.lifecycle, 5], [platform.capabilities, 20], [platform.policies, 14],
    ] as const;
    for (const [entries, expectedCount] of inventories) {
      assert.equal(entries.length, expectedCount);
      assert.ok(Object.isFrozen(entries));
      assert.ok(entries.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly && entry.deterministicOrder === index + 1));
      assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
    }
    assert.equal(getChartMetricVisualizationFoundationCount(), platform.contracts.length);
  });

  it("derives all inventory counts from immutable local collections", () => {
    const platform = ChartMetricVisualizationFoundationPlatform;
    const inventory = ChartMetricVisualizationFoundationInventoryMetadata;
    assert.equal(inventory.contractCount, platform.contracts.length);
    assert.equal(inventory.boundaryCount, platform.boundaries.length);
    assert.equal(inventory.lifecycleStateCount, platform.lifecycle.length);
    assert.equal(inventory.capabilityCount, platform.capabilities.length);
    assert.equal(inventory.policyCount, platform.policies.length);
    assert.equal(inventory.canonicalInventoryRule.hardcodedAggregateTotals, false);
    assert.equal(inventory.canonicalInventoryRule.reconstructsUpstreamInventories, false);
    assert.equal(inventory.canonicalInventoryRule.countsUpstreamEntriesIndependently, false);
  });

  it("makes ownership and all published metadata immutable", () => {
    const platform = ChartMetricVisualizationFoundationPlatform;
    assert.ok(Object.isFrozen(platform));
    assert.ok(Object.isFrozen(platform.ownership));
    assert.ok(Object.isFrozen(platform.ownership.owns));
    assert.ok(Object.isFrozen(platform.ownership.excludes));
    assert.ok(Object.isFrozen(ChartMetricVisualizationFoundationMetadata));
    assert.ok(Object.isFrozen(getChartMetricVisualizationFoundationSummary()));
  });

  it("imports only the EVE-4 public index as an external phase dependency", () => {
    const foundationSource = sourceFiles.find(({ name }) =>
      name === "chartMetricVisualizationFoundation.ts")!.source;
    const phaseImports = [...foundationSource.matchAll(
      /from ["']\.\/(.*(?:Visualization|visualization).*)\.ts["']/g,
    )].map((match) => match[1]);
    assert.ok(phaseImports.includes("timelineVisualizationPublicIndex"));
    assert.doesNotMatch(foundationSource,
      /from ["']\.\/timelineVisualization(?:Foundation|Registry|Model|Validation|Manifest|Platform|Certification|Freeze)/);
    assert.doesNotMatch(foundationSource,
      /from ["']\.\/(?:graphVisualization|sceneRendering|visualizationPublicIndex)/);
  });

  it("contains no prohibited imports or executable facilities", () => {
    const combined = sourceFiles.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined,
      /from ["'](?:react|next|d3|chart\.js|recharts|highcharts|echarts|vega|plotly|victory|nivo|visx)/i);
    assert.doesNotMatch(combined, /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
    const metadata = ChartMetricVisualizationFoundationMetadata;
    assert.equal(metadata.calculation, false);
    assert.equal(metadata.analysis, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.ui, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
    assert.equal(metadata.runtimeExecution, false);
  });
});
