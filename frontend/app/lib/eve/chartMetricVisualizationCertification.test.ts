import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as CertificationExports from "./chartMetricVisualizationCertification.ts";
import {
  ChartMetricVisualizationCertificationIdentityMetadata,
  ChartMetricVisualizationCertificationInventoryMetadata,
  ChartMetricVisualizationCertificationMetadata,
  ChartMetricVisualizationCertificationPlatform,
  ChartMetricVisualizationCertificationReadinessMetadata,
  getChartMetricVisualizationCertificationCount,
  getChartMetricVisualizationCertificationReleaseMetadata,
  getChartMetricVisualizationCertificationSummary,
} from "./chartMetricVisualizationCertification.ts";

const files = Object.freeze([
  "chartMetricVisualizationCertification.test.ts",
  "chartMetricVisualizationCertification.ts",
  "chartMetricVisualizationCertificationCompatibility.ts",
  "chartMetricVisualizationCertificationCriteria.ts",
  "chartMetricVisualizationCertificationGates.ts",
  "chartMetricVisualizationCertificationInventory.ts",
  "chartMetricVisualizationCertificationMetadata.ts",
  "chartMetricVisualizationCertificationTypes.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => ({ name, source: readFileSync(new URL(name, import.meta.url), "utf8") }));

describe("EVE-5:7 Chart & Metric Visualization Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) => files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(CertificationExports).sort(), [
      "ChartMetricVisualizationCertificationIdentityMetadata",
      "ChartMetricVisualizationCertificationInventoryMetadata",
      "ChartMetricVisualizationCertificationMetadata",
      "ChartMetricVisualizationCertificationPlatform",
      "ChartMetricVisualizationCertificationReadinessMetadata",
      "getChartMetricVisualizationCertificationCount",
      "getChartMetricVisualizationCertificationReleaseMetadata",
      "getChartMetricVisualizationCertificationSummary",
    ].sort());
  });

  it("publishes the canonical certified identity and readiness", () => {
    const identity = ChartMetricVisualizationCertificationIdentityMetadata;
    assert.equal(identity.id, "EVE-5:7/ChartMetricVisualizationCertification");
    assert.equal(identity.name, "Chart & Metric Visualization Certification");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace, "nexora.eve.chart-metric-visualization.certification");
    assert.equal(identity.status, "Certified");
    assert.equal(ChartMetricVisualizationCertificationReadinessMetadata.status, "Certified");
    assert.equal(ChartMetricVisualizationCertificationReadinessMetadata.readiness,
      "ReadyForFreeze");
  });

  it("publishes exactly sixteen immutable certification criteria", () => {
    const criteria = ChartMetricVisualizationCertificationPlatform.criteria;
    assert.equal(criteria.length, 16);
    assert.ok(Object.isFrozen(criteria));
    assert.ok(criteria.every((criterion, index) => Object.isFrozen(criterion)
      && criterion.status === "Certified" && criterion.verification === "DeclarativeOnly"
      && criterion.deterministicOrder === index + 1));
  });

  it("publishes exactly twelve deterministic passed certification gates", () => {
    const gates = ChartMetricVisualizationCertificationPlatform.gates;
    assert.equal(gates.length, 12);
    assert.ok(Object.isFrozen(gates));
    assert.ok(gates.every((gate, index) => Object.isFrozen(gate)
      && gate.outcome === "Passed" && !gate.executes
      && gate.deterministicOrder === index + 1));
  });

  it("publishes exactly eight immutable compatibility verification records", () => {
    const compatibility = ChartMetricVisualizationCertificationPlatform.compatibility;
    assert.equal(compatibility.length, 8);
    assert.ok(Object.isFrozen(compatibility));
    assert.ok(compatibility.every((entry, index) => Object.isFrozen(entry)
      && entry.verified && !entry.runtimeVerification
      && entry.deterministicOrder === index + 1));
  });

  it("preserves every Platform collection by canonical reference", () => {
    const { platform, inventory } = ChartMetricVisualizationCertificationPlatform;
    assert.equal(inventory.platformInventory, platform.inventory);
    assert.equal(inventory.platformCapabilities, platform.capabilities);
    assert.equal(inventory.platformGuarantees, platform.guarantees);
    assert.equal(inventory.platformCompatibility, platform.compatibility);
    assert.equal(inventory.platformComposition, platform.composition);
    assert.equal(inventory.platformMetadata, platform.metadata);
    assert.equal(inventory.platformReadiness, platform.readiness);
  });

  it("derives all Certification inventory counts dynamically", () => {
    const inventory = ChartMetricVisualizationCertificationInventoryMetadata;
    assert.equal(inventory.counts.criteriaCount, inventory.criteria.length);
    assert.equal(inventory.counts.gateCount, inventory.gates.length);
    assert.equal(inventory.counts.compatibilityVerificationCount,
      inventory.compatibilityVerification.length);
    assert.equal(inventory.counts.publicSurfaceCount,
      inventory.publicCertificationSurface.length);
    assert.equal(getChartMetricVisualizationCertificationCount(), inventory.criteria.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Platform as its only upstream phase dependency", () => {
    assert.equal(ChartMetricVisualizationCertificationMetadata.dependency
      .chartMetricVisualizationPlatformOnly, true);
    const combined = sources.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationManifest/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationValidation/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationModel/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationRegistry/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualizationFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/timelineVisualization/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("is immutable metadata with no certification or visualization runtime", () => {
    const metadata = ChartMetricVisualizationCertificationMetadata;
    assert.ok(Object.isFrozen(ChartMetricVisualizationCertificationPlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.certificationEngine, false);
    assert.equal(metadata.runtimeCertification, false);
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
    assert.equal(getChartMetricVisualizationCertificationSummary().status, "Certified");
    const release = getChartMetricVisualizationCertificationReleaseMetadata();
    assert.equal(release.status, "Certified");
    assert.equal(release.readiness, "ReadyForFreeze");
    assert.equal(release.platformReference,
      "EVE-5:6/ChartMetricVisualizationPlatform");
  });
});
