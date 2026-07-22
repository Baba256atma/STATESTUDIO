import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as FreezeExports from "./dashboardExecutiveWorkspaceVisualizationFreeze.ts";
import {
  DashboardExecutiveWorkspaceVisualizationFreezeIdentityMetadata,
  DashboardExecutiveWorkspaceVisualizationFreezeInventoryMetadata,
  DashboardExecutiveWorkspaceVisualizationFreezeMetadata,
  DashboardExecutiveWorkspaceVisualizationFreezePlatform,
  DashboardExecutiveWorkspaceVisualizationFreezeReadinessMetadata,
  getDashboardExecutiveWorkspaceVisualizationFreezeCount,
  getDashboardExecutiveWorkspaceVisualizationFreezeReleaseMetadata,
  getDashboardExecutiveWorkspaceVisualizationFreezeSummary,
} from "./dashboardExecutiveWorkspaceVisualizationFreeze.ts";

const files = Object.freeze([
  "dashboardExecutiveWorkspaceVisualizationFreeze.test.ts",
  "dashboardExecutiveWorkspaceVisualizationFreeze.ts",
  "dashboardExecutiveWorkspaceVisualizationFreezeBaselines.ts",
  "dashboardExecutiveWorkspaceVisualizationFreezeCompatibility.ts",
  "dashboardExecutiveWorkspaceVisualizationFreezeExtensions.ts",
  "dashboardExecutiveWorkspaceVisualizationFreezeLocks.ts",
  "dashboardExecutiveWorkspaceVisualizationFreezeRegistry.ts",
  "dashboardExecutiveWorkspaceVisualizationFreezeTypes.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-6:8 Dashboard & Executive Workspace Visualization Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(FreezeExports).sort(), [
      "DashboardExecutiveWorkspaceVisualizationFreezeIdentityMetadata",
      "DashboardExecutiveWorkspaceVisualizationFreezeInventoryMetadata",
      "DashboardExecutiveWorkspaceVisualizationFreezeMetadata",
      "DashboardExecutiveWorkspaceVisualizationFreezePlatform",
      "DashboardExecutiveWorkspaceVisualizationFreezeReadinessMetadata",
      "getDashboardExecutiveWorkspaceVisualizationFreezeCount",
      "getDashboardExecutiveWorkspaceVisualizationFreezeReleaseMetadata",
      "getDashboardExecutiveWorkspaceVisualizationFreezeSummary",
    ].sort());
  });

  it("publishes canonical frozen identity, lock, and readiness", () => {
    const identity = DashboardExecutiveWorkspaceVisualizationFreezeIdentityMetadata;
    assert.equal(identity.id,
      "EVE-6:8/DashboardExecutiveWorkspaceVisualizationFreeze");
    assert.equal(identity.name,
      "Dashboard & Executive Workspace Visualization Freeze");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace,
      "nexora.eve.dashboard-executive-workspace-visualization.freeze");
    assert.equal(identity.status, "Frozen");
    assert.equal(DashboardExecutiveWorkspaceVisualizationFreezeReadinessMetadata
      .readiness, "ReadyForPublicIndex");
    assert.equal(DashboardExecutiveWorkspaceVisualizationFreezeMetadata.lockId,
      "EVE-6-DASHBOARD-EXECUTIVE-WORKSPACE-VISUALIZATION-LOCKED");
  });

  it("publishes twelve immutable architectural locks", () => {
    const locks = DashboardExecutiveWorkspaceVisualizationFreezePlatform.locks;
    assert.equal(locks.length, 12);
    assert.ok(Object.isFrozen(locks));
    assert.ok(locks.every((lock, index) => Object.isFrozen(lock)
      && lock.status === "Locked" && !lock.runtimeLocking
      && lock.lockIdentifier
        === "EVE-6-DASHBOARD-EXECUTIVE-WORKSPACE-VISUALIZATION-LOCKED"
      && lock.deterministicOrder === index + 1));
  });

  it("publishes exact immutable baselines, compatibility, and extensions", () => {
    const { baselines, compatibility, extensions } =
      DashboardExecutiveWorkspaceVisualizationFreezePlatform;
    assert.equal(baselines.length, 8);
    assert.equal(compatibility.length, 8);
    assert.equal(extensions.length, 8);
    for (const collection of [baselines, compatibility, extensions]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.preservedByReference && entry.metadataOnly && entry.immutable
        && entry.deterministicOrder === index + 1));
    }
  });

  it("publishes the canonical seven-phase frozen architecture registry", () => {
    const { registry, certification } =
      DashboardExecutiveWorkspaceVisualizationFreezePlatform;
    assert.equal(registry.length, 7);
    assert.deepEqual(registry.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
      "Certification",
    ]);
    assert.ok(registry.every((entry, index) => Object.isFrozen(entry)
      && entry.certificationReference === certification.metadata.id
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
  });

  it("preserves every Certification collection by canonical reference", () => {
    const { certification, inventory } =
      DashboardExecutiveWorkspaceVisualizationFreezePlatform;
    assert.equal(inventory.certificationInventory, certification.inventory);
    assert.equal(inventory.certificationCriteria, certification.criteria);
    assert.equal(inventory.certificationGates, certification.gates);
    assert.equal(inventory.certificationCompatibility, certification.compatibility);
    assert.equal(inventory.certificationMetadata, certification.metadata);
    assert.equal(inventory.certificationReadiness, certification.readiness);
  });

  it("derives all Freeze inventory counts dynamically", () => {
    const inventory =
      DashboardExecutiveWorkspaceVisualizationFreezeInventoryMetadata;
    assert.equal(inventory.counts.lockCount, inventory.locks.length);
    assert.equal(inventory.counts.baselineCount, inventory.baselines.length);
    assert.equal(inventory.counts.registryEntryCount, inventory.registry.length);
    assert.equal(inventory.counts.compatibilityCount, inventory.compatibility.length);
    assert.equal(inventory.counts.extensionCount, inventory.extensions.length);
    assert.equal(inventory.counts.publicSurfaceCount,
      inventory.publicFreezeSurface.length);
    assert.equal(getDashboardExecutiveWorkspaceVisualizationFreezeCount(),
      inventory.locks.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Certification as its only upstream phase dependency", () => {
    assert.equal(DashboardExecutiveWorkspaceVisualizationFreezeMetadata.dependency
      .dashboardExecutiveWorkspaceVisualizationCertificationOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationPlatform/);
    assert.doesNotMatch(combined,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationManifest/);
    assert.doesNotMatch(combined,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationValidation/);
    assert.doesNotMatch(combined,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationModel/);
    assert.doesNotMatch(combined,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationRegistry/);
    assert.doesNotMatch(combined,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualization/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("is immutable metadata with no locking or dashboard runtime", () => {
    const metadata = DashboardExecutiveWorkspaceVisualizationFreezeMetadata;
    assert.ok(Object.isFrozen(DashboardExecutiveWorkspaceVisualizationFreezePlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.freezeEngine, false);
    assert.equal(metadata.runtimeLocking, false);
    assert.equal(metadata.lockManager, false);
    assert.equal(metadata.dashboardRuntime, false);
    assert.equal(metadata.widgetRuntime, false);
    assert.equal(metadata.layoutEngine, false);
    assert.equal(metadata.dragAndDrop, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.navigationRuntime, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined,
      /from ["'](?:react|next|d3|chart\.js|echarts|plotly|vega|zod)/i);
    assert.doesNotMatch(combined,
      /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getDashboardExecutiveWorkspaceVisualizationFreezeSummary().status,
      "Frozen");
    const release =
      getDashboardExecutiveWorkspaceVisualizationFreezeReleaseMetadata();
    assert.equal(release.status, "Frozen");
    assert.equal(release.readiness, "ReadyForPublicIndex");
    assert.equal(release.lockId,
      "EVE-6-DASHBOARD-EXECUTIVE-WORKSPACE-VISUALIZATION-LOCKED");
    assert.equal(release.certificationReference,
      "EVE-6:7/DashboardExecutiveWorkspaceVisualizationCertification");
  });
});
