import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicExports from "./dashboardExecutiveWorkspaceVisualizationPublicIndex.ts";
import {
  DashboardExecutiveWorkspaceVisualizationPublicIndex,
  dashboardExecutiveWorkspaceVisualizationConsumerEntry,
  dashboardExecutiveWorkspaceVisualizationNamespace,
  dashboardExecutiveWorkspaceVisualizationPublicApiCount,
  dashboardExecutiveWorkspaceVisualizationPublicApiRegistry,
  dashboardExecutiveWorkspaceVisualizationPublicIndexIdentity,
  dashboardExecutiveWorkspaceVisualizationPublicIndexInventory,
  dashboardExecutiveWorkspaceVisualizationPublicIndexMetadata,
  dashboardExecutiveWorkspaceVisualizationReadiness,
  dashboardExecutiveWorkspaceVisualizationReleaseMetadata,
  dashboardExecutiveWorkspaceVisualizationStatus,
} from "./dashboardExecutiveWorkspaceVisualizationPublicIndex.ts";

describe("EVE-6:9 Dashboard & Executive Workspace Visualization Public Index", () => {
  it("creates exactly the two requested Public Index files", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      name.startsWith("dashboardExecutiveWorkspaceVisualizationPublicIndex"));
    assert.deepEqual(actual.sort(), [
      "dashboardExecutiveWorkspaceVisualizationPublicIndex.test.ts",
      "dashboardExecutiveWorkspaceVisualizationPublicIndex.ts",
    ]);
  });

  it("publishes exactly twelve stable public exports", () => {
    assert.equal(Object.keys(PublicExports).length, 12);
    assert.deepEqual(Object.keys(PublicExports).sort(),
      [...DashboardExecutiveWorkspaceVisualizationPublicIndex.publicExports].sort());
  });

  it("publishes the canonical identity and release state", () => {
    const identity =
      dashboardExecutiveWorkspaceVisualizationPublicIndexIdentity;
    assert.equal(identity.id,
      "EVE-6:9/DashboardExecutiveWorkspaceVisualizationPublicIndex");
    assert.equal(identity.name,
      "Dashboard & Executive Workspace Visualization Public Index");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace,
      "nexora.eve.dashboard-executive-workspace-visualization.public-index");
    assert.deepEqual(dashboardExecutiveWorkspaceVisualizationStatus, {
      release: "Released", certification: "Certified", freeze: "Frozen",
      stability: "Stable", readiness: "ReadyForConsumer",
    });
    assert.equal(dashboardExecutiveWorkspaceVisualizationReadiness.status,
      "ReadyForConsumer");
    assert.equal(dashboardExecutiveWorkspaceVisualizationReleaseMetadata.lockId,
      "EVE-6-DASHBOARD-EXECUTIVE-WORKSPACE-VISUALIZATION-LOCKED");
  });

  it("publishes exactly nine ordered canonical namespace sections", () => {
    const namespace = dashboardExecutiveWorkspaceVisualizationNamespace;
    assert.deepEqual(namespace.map(({ name }) => name), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
      "Certification", "Freeze", "Public Index",
    ]);
    assert.ok(namespace.every((entry, index) => Object.isFrozen(entry)
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
    assert.equal(namespace[7]!.canonicalSource,
      DashboardExecutiveWorkspaceVisualizationPublicIndex.frozenArchitecture);
    assert.equal(namespace[8]!.canonicalReference,
      dashboardExecutiveWorkspaceVisualizationPublicIndexIdentity.id);
  });

  it("publishes an immutable unique deterministic Public API Registry", () => {
    const entries = dashboardExecutiveWorkspaceVisualizationPublicApiRegistry;
    assert.ok(Object.isFrozen(entries));
    assert.ok(entries.every(Object.isFrozen));
    assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
    assert.equal(new Set(entries.map(({ owningPhase, exportName }) =>
      `${owningPhase}/${exportName}`)).size, entries.length);
    assert.deepEqual(entries.map(({ deterministicOrdinal }) => deterministicOrdinal),
      [...entries].sort((a, b) => a.phaseOrder - b.phaseOrder
        || a.exportOrder - b.exportOrder).map(({ deterministicOrdinal }) =>
        deterministicOrdinal));
    const ownEntries = entries.filter(({ owningPhase }) =>
      owningPhase === "Public Index");
    assert.equal(ownEntries.length, Object.keys(PublicExports).length);
  });

  it("derives all public inventory counts dynamically", () => {
    const inventory =
      dashboardExecutiveWorkspaceVisualizationPublicIndexInventory;
    assert.equal(inventory.counts.namespaceSectionCount,
      inventory.namespaceSections.length);
    assert.equal(inventory.counts.publicExportCount, inventory.publicExports.length);
    assert.equal(inventory.counts.publicApiCount, inventory.publicApiRegistry.length);
    assert.equal(dashboardExecutiveWorkspaceVisualizationPublicApiCount,
      inventory.publicApiRegistry.length);
    assert.equal(inventory.canonicalInventoryRule.hardcodedPublicApiTotals, false);
    assert.equal(inventory.canonicalInventoryRule.reconstructsUpstreamCollections,
      false);
  });

  it("preserves every Freeze collection and complete reference chain", () => {
    const publicIndex = DashboardExecutiveWorkspaceVisualizationPublicIndex;
    const freeze = publicIndex.frozenArchitecture;
    assert.equal(publicIndex.freezeCollections, freeze.inventory);
    assert.equal(publicIndex.inventory.freezeLocks, freeze.locks);
    assert.equal(publicIndex.inventory.freezeBaselines, freeze.baselines);
    assert.equal(publicIndex.inventory.freezeRegistry, freeze.registry);
    assert.equal(publicIndex.inventory.freezeCompatibility, freeze.compatibility);
    assert.equal(publicIndex.inventory.freezeExtensions, freeze.extensions);
    assert.equal(freeze.metadata.lockId,
      "EVE-6-DASHBOARD-EXECUTIVE-WORKSPACE-VISUALIZATION-LOCKED");
    assert.equal(freeze.certification.platform.manifest.validation.model.registry
      .foundation.metadata.id,
    "EVE-6:1/DashboardExecutiveWorkspaceVisualizationFoundation");
  });

  it("declares exactly one supported consumer entry point", () => {
    assert.equal(dashboardExecutiveWorkspaceVisualizationConsumerEntry
      .supportedEntryPoint,
    "dashboardExecutiveWorkspaceVisualizationPublicIndex.ts");
    assert.equal(dashboardExecutiveWorkspaceVisualizationConsumerEntry.entries.length,
      1);
  });

  it("uses Freeze as its only phase dependency", () => {
    assert.equal(dashboardExecutiveWorkspaceVisualizationPublicIndexMetadata.dependency
      .dashboardExecutiveWorkspaceVisualizationFreezeOnly, true);
    const source = readFileSync(new URL(
      "dashboardExecutiveWorkspaceVisualizationPublicIndex.ts", import.meta.url),
    "utf8");
    assert.doesNotMatch(source,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationCertification/);
    assert.doesNotMatch(source,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationPlatform/);
    assert.doesNotMatch(source,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationManifest/);
    assert.doesNotMatch(source,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationValidation/);
    assert.doesNotMatch(source,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationModel/);
    assert.doesNotMatch(source,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationRegistry/);
    assert.doesNotMatch(source,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationFoundation/);
    assert.doesNotMatch(source, /from ["']\.\/chartMetricVisualization/);
  });

  it("is immutable metadata with no prohibited runtime facilities", () => {
    const publicIndex = DashboardExecutiveWorkspaceVisualizationPublicIndex;
    assert.ok(Object.isFrozen(publicIndex));
    assert.ok(Object.isFrozen(publicIndex.metadata));
    assert.equal(publicIndex.metadata.dashboardRuntime, false);
    assert.equal(publicIndex.metadata.widgetRuntime, false);
    assert.equal(publicIndex.metadata.layoutEngine, false);
    assert.equal(publicIndex.metadata.rendering, false);
    assert.equal(publicIndex.metadata.navigationRuntime, false);
    assert.equal(publicIndex.metadata.networking, false);
    assert.equal(publicIndex.metadata.persistence, false);
    assert.equal(publicIndex.metadata.services, false);
    assert.equal(publicIndex.metadata.factories, false);
    assert.equal(publicIndex.metadata.runtimeExecution, false);
  });
});
