import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as FoundationExports from "./dashboardExecutiveWorkspaceVisualizationFoundation.ts";
import {
  DashboardExecutiveWorkspaceVisualizationFoundationIdentityMetadata,
  DashboardExecutiveWorkspaceVisualizationFoundationInventoryMetadata,
  DashboardExecutiveWorkspaceVisualizationFoundationMetadata,
  DashboardExecutiveWorkspaceVisualizationFoundationPlatform,
  DashboardExecutiveWorkspaceVisualizationFoundationReadinessMetadata,
  getDashboardExecutiveWorkspaceVisualizationFoundationCount,
  getDashboardExecutiveWorkspaceVisualizationFoundationReleaseMetadata,
  getDashboardExecutiveWorkspaceVisualizationFoundationSummary,
} from "./dashboardExecutiveWorkspaceVisualizationFoundation.ts";

const files = Object.freeze([
  "dashboardExecutiveWorkspaceVisualizationBoundaries.ts",
  "dashboardExecutiveWorkspaceVisualizationCapabilities.ts",
  "dashboardExecutiveWorkspaceVisualizationContracts.ts",
  "dashboardExecutiveWorkspaceVisualizationFoundation.test.ts",
  "dashboardExecutiveWorkspaceVisualizationFoundation.ts",
  "dashboardExecutiveWorkspaceVisualizationFoundationTypes.ts",
  "dashboardExecutiveWorkspaceVisualizationLifecycle.ts",
  "dashboardExecutiveWorkspaceVisualizationOwnership.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => ({ name, source: readFileSync(new URL(name, import.meta.url), "utf8") }));

describe("EVE-6:1 Dashboard & Executive Workspace Visualization Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) => files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(FoundationExports).sort(), [
      "DashboardExecutiveWorkspaceVisualizationFoundationIdentityMetadata",
      "DashboardExecutiveWorkspaceVisualizationFoundationInventoryMetadata",
      "DashboardExecutiveWorkspaceVisualizationFoundationMetadata",
      "DashboardExecutiveWorkspaceVisualizationFoundationPlatform",
      "DashboardExecutiveWorkspaceVisualizationFoundationReadinessMetadata",
      "getDashboardExecutiveWorkspaceVisualizationFoundationCount",
      "getDashboardExecutiveWorkspaceVisualizationFoundationReleaseMetadata",
      "getDashboardExecutiveWorkspaceVisualizationFoundationSummary",
    ].sort());
  });

  it("publishes the canonical identity and readiness", () => {
    const identity = DashboardExecutiveWorkspaceVisualizationFoundationIdentityMetadata;
    assert.equal(identity.id,
      "EVE-6:1/DashboardExecutiveWorkspaceVisualizationFoundation");
    assert.equal(identity.name,
      "Dashboard & Executive Workspace Visualization Foundation");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace,
      "nexora.eve.dashboard-executive-workspace-visualization.foundation");
    assert.equal(identity.status, "ReadyForRegistry");
    assert.equal(DashboardExecutiveWorkspaceVisualizationFoundationReadinessMetadata.status,
      "ReadyForRegistry");
  });

  it("preserves the canonical EVE-5 Public Index and lock", () => {
    const platform = DashboardExecutiveWorkspaceVisualizationFoundationPlatform;
    assert.equal(platform.upstreamPublicIndex.id,
      "EVE-5:9/ChartMetricVisualizationPublicIndex");
    assert.equal(platform.metadata.upstreamPublicIndex, platform.upstreamPublicIndex);
    assert.equal(platform.metadata.upstreamLockReference,
      "EVE-5-CHART-METRIC-VISUALIZATION-LOCKED");
    assert.equal(platform.upstreamPublicIndex.release, "Released");
    assert.equal(platform.upstreamPublicIndex.certification, "Certified");
    assert.equal(platform.upstreamPublicIndex.freeze, "Frozen");
    assert.equal(platform.upstreamPublicIndex.stability, "Stable");
    assert.equal(platform.upstreamPublicIndex.readiness, "ReadyForConsumer");
  });

  it("publishes exactly twenty-two immutable architectural contracts", () => {
    const { contracts } = DashboardExecutiveWorkspaceVisualizationFoundationPlatform;
    assert.equal(contracts.length, 22);
    assert.ok(Object.isFrozen(contracts));
    assert.equal(new Set(contracts.map(({ id }) => id)).size, contracts.length);
    assert.ok(contracts.every((contract, index) => Object.isFrozen(contract)
      && Object.isFrozen(contract.structuralMetadata)
      && contract.executableBehavior === false
      && contract.deterministicOrder === index + 1));
  });

  it("publishes exact boundaries, lifecycle, capabilities, and policies", () => {
    const platform = DashboardExecutiveWorkspaceVisualizationFoundationPlatform;
    const inventories = [
      [platform.boundaries, 14], [platform.lifecycle, 5],
      [platform.capabilities, 22], [platform.policies, 14],
    ] as const;
    for (const [entries, count] of inventories) {
      assert.equal(entries.length, count);
      assert.ok(Object.isFrozen(entries));
      assert.ok(entries.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly && entry.deterministicOrder === index + 1));
    }
  });

  it("publishes immutable workspace, template, and widget intents", () => {
    const intents = DashboardExecutiveWorkspaceVisualizationFoundationPlatform.intents;
    assert.equal(intents.workspaceZones.length, 8);
    assert.equal(intents.dashboardTemplates.length, 8);
    assert.equal(intents.widgetFamilies.length, 10);
    assert.ok(Object.isFrozen(intents));
    assert.ok(Object.isFrozen(intents.workspaceZones));
    assert.ok(Object.isFrozen(intents.dashboardTemplates));
    assert.ok(Object.isFrozen(intents.widgetFamilies));
  });

  it("derives all inventory counts dynamically", () => {
    const platform = DashboardExecutiveWorkspaceVisualizationFoundationPlatform;
    const inventory = DashboardExecutiveWorkspaceVisualizationFoundationInventoryMetadata;
    assert.equal(inventory.contractCount, platform.contracts.length);
    assert.equal(inventory.boundaryCount, platform.boundaries.length);
    assert.equal(inventory.lifecycleStateCount, platform.lifecycle.length);
    assert.equal(inventory.capabilityCount, platform.capabilities.length);
    assert.equal(inventory.policyCount, platform.policies.length);
    assert.equal(inventory.workspaceZoneCount, platform.intents.workspaceZones.length);
    assert.equal(inventory.dashboardTemplateCount, platform.intents.dashboardTemplates.length);
    assert.equal(inventory.widgetFamilyCount, platform.intents.widgetFamilies.length);
    assert.equal(getDashboardExecutiveWorkspaceVisualizationFoundationCount(),
      platform.contracts.length);
    assert.equal(inventory.canonicalInventoryRule.hardcodedAggregateTotals, false);
  });

  it("uses the EVE-5 Public Index as its only upstream phase dependency", () => {
    assert.equal(DashboardExecutiveWorkspaceVisualizationFoundationMetadata.dependency
      .chartMetricVisualizationPublicIndexOnly, true);
    const combined = sources.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualization(?:Freeze|Certification|Platform|Manifest|Validation|Model|Registry|Foundation)/);
    assert.doesNotMatch(combined, /from ["']\.\/timelineVisualization/);
    assert.doesNotMatch(combined, /from ["']\.\/(?:graphVisualization|sceneRendering)/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("is immutable metadata with no dashboard or UI runtime", () => {
    const metadata = DashboardExecutiveWorkspaceVisualizationFoundationMetadata;
    assert.ok(Object.isFrozen(DashboardExecutiveWorkspaceVisualizationFoundationPlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.dashboardRuntime, false);
    assert.equal(metadata.widgetExecution, false);
    assert.equal(metadata.layoutEngine, false);
    assert.equal(metadata.dragAndDrop, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.ui, false);
    assert.equal(metadata.animation, false);
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
    assert.equal(getDashboardExecutiveWorkspaceVisualizationFoundationSummary().status,
      "ReadyForRegistry");
    const release = getDashboardExecutiveWorkspaceVisualizationFoundationReleaseMetadata();
    assert.equal(release.status, "ReadyForRegistry");
    assert.equal(release.upstreamPublicIndexReference,
      "EVE-5:9/ChartMetricVisualizationPublicIndex");
    assert.equal(release.upstreamLockReference,
      "EVE-5-CHART-METRIC-VISUALIZATION-LOCKED");
  });
});
