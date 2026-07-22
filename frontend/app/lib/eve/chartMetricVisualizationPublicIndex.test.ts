import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicExports from "./chartMetricVisualizationPublicIndex.ts";
import {
  ChartMetricVisualizationPublicApiRegistry,
  ChartMetricVisualizationPublicCertificationStatus,
  ChartMetricVisualizationPublicFoundation,
  ChartMetricVisualizationPublicFreezeStatus,
  ChartMetricVisualizationPublicIndex,
  ChartMetricVisualizationPublicIndexId,
  ChartMetricVisualizationPublicIndexName,
  ChartMetricVisualizationPublicIndexNamespace,
  ChartMetricVisualizationPublicIndexVersion,
  ChartMetricVisualizationPublicReadinessStatus,
  ChartMetricVisualizationPublicReleaseStatus,
  ChartMetricVisualizationPublicStabilityStatus,
} from "./chartMetricVisualizationPublicIndex.ts";

describe("EVE-5:9 Chart & Metric Visualization Public Index", () => {
  it("creates exactly the two requested Public Index files", () => {
    const actual = readdirSync(import.meta.dirname)
      .filter((name) => name.startsWith("chartMetricVisualizationPublicIndex"));
    assert.deepEqual(actual.sort(), [
      "chartMetricVisualizationPublicIndex.test.ts",
      "chartMetricVisualizationPublicIndex.ts",
    ]);
  });

  it("publishes exactly twelve stable public exports", () => {
    assert.equal(Object.keys(PublicExports).length, 12);
    assert.deepEqual(Object.keys(PublicExports).sort(),
      [...ChartMetricVisualizationPublicFoundation.publicExports].sort());
  });

  it("publishes the canonical identity and release state", () => {
    assert.equal(ChartMetricVisualizationPublicIndexId,
      "EVE-5:9/ChartMetricVisualizationPublicIndex");
    assert.equal(ChartMetricVisualizationPublicIndexName,
      "Chart & Metric Visualization Public Index");
    assert.equal(ChartMetricVisualizationPublicIndexVersion, "1.0.0");
    assert.equal(ChartMetricVisualizationPublicIndexNamespace,
      "nexora.eve.chart-metric-visualization.public-index");
    assert.equal(ChartMetricVisualizationPublicReleaseStatus, "Released");
    assert.equal(ChartMetricVisualizationPublicCertificationStatus, "Certified");
    assert.equal(ChartMetricVisualizationPublicFreezeStatus, "Frozen");
    assert.equal(ChartMetricVisualizationPublicStabilityStatus, "Stable");
    assert.equal(ChartMetricVisualizationPublicReadinessStatus, "ReadyForConsumer");
  });

  it("publishes exactly nine ordered canonical namespace sections", () => {
    const namespace = ChartMetricVisualizationPublicFoundation.namespace;
    assert.deepEqual(namespace.map(({ name }) => name), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
      "Certification", "Freeze", "Public Index",
    ]);
    assert.ok(namespace.every((entry, index) => Object.isFrozen(entry)
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
    assert.equal(namespace[7]!.canonicalSource,
      ChartMetricVisualizationPublicFoundation.frozenArchitecture);
    assert.equal(namespace[8]!.canonicalReference, ChartMetricVisualizationPublicIndexId);
  });

  it("publishes an immutable unique deterministically ordered API registry", () => {
    const entries = ChartMetricVisualizationPublicApiRegistry;
    assert.ok(Object.isFrozen(entries));
    assert.ok(entries.every(Object.isFrozen));
    assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
    assert.equal(new Set(entries.map(({ owningPhase, exportName }) =>
      `${owningPhase}/${exportName}`)).size, entries.length);
    assert.deepEqual(entries.map(({ deterministicOrdinal }) => deterministicOrdinal),
      [...entries].sort((a, b) => a.phaseOrder - b.phaseOrder
        || a.exportOrder - b.exportOrder).map(({ deterministicOrdinal }) =>
        deterministicOrdinal));
  });

  it("derives all public inventory counts dynamically", () => {
    const inventory = ChartMetricVisualizationPublicFoundation.inventory;
    assert.equal(inventory.counts.namespaceSectionCount,
      inventory.namespaceSections.length);
    assert.equal(inventory.counts.publicExportCount, inventory.publicExports.length);
    assert.equal(inventory.counts.publicApiCount, inventory.publicApiRegistry.length);
    assert.equal(inventory.canonicalInventoryRule.hardcodedPublicApiTotals, false);
    assert.equal(inventory.canonicalInventoryRule.reconstructsUpstreamCollections, false);
  });

  it("preserves every Freeze collection and complete reference chain", () => {
    const foundation = ChartMetricVisualizationPublicFoundation;
    const freeze = foundation.frozenArchitecture;
    assert.equal(foundation.freezeCollections, freeze.inventory);
    assert.equal(foundation.inventory.freezeLocks, freeze.locks);
    assert.equal(foundation.inventory.freezeBaselines, freeze.baselines);
    assert.equal(foundation.inventory.freezeRegistry, freeze.registry);
    assert.equal(foundation.inventory.freezeCompatibility, freeze.compatibility);
    assert.equal(foundation.inventory.freezeExtensions, freeze.extensions);
    assert.equal(freeze.metadata.lockId,
      "EVE-5-CHART-METRIC-VISUALIZATION-LOCKED");
    assert.equal(freeze.certification.platform.manifest.validation.model.registry
      .foundation.metadata.id, "EVE-5:1/ChartMetricVisualizationFoundation");
  });

  it("declares the sole supported consumer entry point", () => {
    assert.equal(ChartMetricVisualizationPublicIndex.soleConsumerEntryPoint,
      "chartMetricVisualizationPublicIndex.ts");
    assert.equal(ChartMetricVisualizationPublicFoundation.inventory.consumerMetadata
      .entryPointCount, 1);
  });

  it("uses Freeze as its only phase dependency", () => {
    assert.equal(ChartMetricVisualizationPublicIndex.dependency
      .chartMetricVisualizationFreezeOnly, true);
    const source = readFileSync(new URL("chartMetricVisualizationPublicIndex.ts",
      import.meta.url), "utf8");
    assert.doesNotMatch(source, /from ["']\.\/chartMetricVisualizationCertification/);
    assert.doesNotMatch(source, /from ["']\.\/chartMetricVisualizationPlatform/);
    assert.doesNotMatch(source, /from ["']\.\/chartMetricVisualizationManifest/);
    assert.doesNotMatch(source, /from ["']\.\/chartMetricVisualizationValidation/);
    assert.doesNotMatch(source, /from ["']\.\/chartMetricVisualizationModel/);
    assert.doesNotMatch(source, /from ["']\.\/chartMetricVisualizationRegistry/);
    assert.doesNotMatch(source, /from ["']\.\/chartMetricVisualizationFoundation/);
    assert.doesNotMatch(source, /from ["']\.\/timelineVisualization/);
  });

  it("is immutable metadata with no prohibited facilities", () => {
    assert.ok(Object.isFrozen(ChartMetricVisualizationPublicFoundation));
    assert.ok(Object.isFrozen(ChartMetricVisualizationPublicIndex));
    assert.equal(ChartMetricVisualizationPublicIndex.rendering, false);
    assert.equal(ChartMetricVisualizationPublicIndex.dashboardExecution, false);
    assert.equal(ChartMetricVisualizationPublicIndex.networking, false);
    assert.equal(ChartMetricVisualizationPublicIndex.persistence, false);
    assert.equal(ChartMetricVisualizationPublicIndex.services, false);
    assert.equal(ChartMetricVisualizationPublicIndex.factories, false);
    assert.equal(ChartMetricVisualizationPublicIndex.runtimeExecution, false);
  });
});
