import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PlatformExports from "./dashboardExecutiveWorkspaceVisualizationPlatform.ts";
import {
  DashboardExecutiveWorkspaceVisualizationPlatform,
  DashboardExecutiveWorkspaceVisualizationPlatformIdentityMetadata,
  DashboardExecutiveWorkspaceVisualizationPlatformInventoryMetadata,
  DashboardExecutiveWorkspaceVisualizationPlatformMetadata,
  DashboardExecutiveWorkspaceVisualizationPlatformReadinessMetadata,
  getDashboardExecutiveWorkspaceVisualizationPlatformCount,
  getDashboardExecutiveWorkspaceVisualizationPlatformReleaseMetadata,
  getDashboardExecutiveWorkspaceVisualizationPlatformSummary,
} from "./dashboardExecutiveWorkspaceVisualizationPlatform.ts";

const files = Object.freeze([
  "dashboardExecutiveWorkspaceVisualizationPlatform.test.ts",
  "dashboardExecutiveWorkspaceVisualizationPlatform.ts",
  "dashboardExecutiveWorkspaceVisualizationPlatformCapabilities.ts",
  "dashboardExecutiveWorkspaceVisualizationPlatformCompatibility.ts",
  "dashboardExecutiveWorkspaceVisualizationPlatformGuarantees.ts",
  "dashboardExecutiveWorkspaceVisualizationPlatformInventory.ts",
  "dashboardExecutiveWorkspaceVisualizationPlatformMetadata.ts",
  "dashboardExecutiveWorkspaceVisualizationPlatformTypes.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-6:6 Dashboard & Executive Workspace Visualization Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(PlatformExports).sort(), [
      "DashboardExecutiveWorkspaceVisualizationPlatform",
      "DashboardExecutiveWorkspaceVisualizationPlatformIdentityMetadata",
      "DashboardExecutiveWorkspaceVisualizationPlatformInventoryMetadata",
      "DashboardExecutiveWorkspaceVisualizationPlatformMetadata",
      "DashboardExecutiveWorkspaceVisualizationPlatformReadinessMetadata",
      "getDashboardExecutiveWorkspaceVisualizationPlatformCount",
      "getDashboardExecutiveWorkspaceVisualizationPlatformReleaseMetadata",
      "getDashboardExecutiveWorkspaceVisualizationPlatformSummary",
    ].sort());
  });

  it("publishes the canonical identity and readiness", () => {
    const identity = DashboardExecutiveWorkspaceVisualizationPlatformIdentityMetadata;
    assert.equal(identity.id,
      "EVE-6:6/DashboardExecutiveWorkspaceVisualizationPlatform");
    assert.equal(identity.name,
      "Dashboard & Executive Workspace Visualization Platform");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace,
      "nexora.eve.dashboard-executive-workspace-visualization.platform");
    assert.equal(identity.status, "ReadyForCertification");
    assert.equal(DashboardExecutiveWorkspaceVisualizationPlatformReadinessMetadata.status,
      "ReadyForCertification");
  });

  it("publishes the canonical six-phase composition through Manifest", () => {
    const { composition, manifest } =
      DashboardExecutiveWorkspaceVisualizationPlatform;
    assert.equal(composition.length, 6);
    assert.deepEqual(composition.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
    ]);
    manifest.composition.forEach((entry, index) =>
      assert.equal(composition[index], entry));
    assert.equal(composition[5]!.canonicalReference,
      "EVE-6:6/DashboardExecutiveWorkspaceVisualizationPlatform");
    assert.ok(composition.every((entry, index) => Object.isFrozen(entry)
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
  });

  it("publishes exact immutable capabilities, guarantees, and compatibility", () => {
    const { capabilities, guarantees, compatibility } =
      DashboardExecutiveWorkspaceVisualizationPlatform;
    assert.equal(capabilities.length, 10);
    assert.equal(guarantees.length, 12);
    assert.equal(compatibility.length, 8);
    for (const collection of [capabilities, guarantees, compatibility]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly
        && entry.deterministicOrder === index + 1));
    }
    assert.ok(capabilities.every(({ implementationProvided }) =>
      !implementationProvided));
    assert.ok(guarantees.every(({ guaranteed }) => guaranteed));
    assert.ok(compatibility.every(({ compatible, runtimeVerification }) =>
      compatible && !runtimeVerification));
  });

  it("preserves every Manifest collection by canonical reference", () => {
    const { manifest, inventory } =
      DashboardExecutiveWorkspaceVisualizationPlatform;
    assert.equal(inventory.manifestInventory, manifest.inventory);
    assert.equal(inventory.manifestComposition, manifest.composition);
    assert.equal(inventory.manifestGuarantees, manifest.guarantees);
    assert.equal(inventory.manifestCompatibility, manifest.compatibility);
    assert.equal(inventory.manifestReadiness, manifest.readiness);
    assert.equal(inventory.manifestReadinessDeclarations,
      manifest.readinessDeclarations);
    assert.equal(inventory.manifestMetadata, manifest.metadata);
  });

  it("derives all Platform inventory counts dynamically", () => {
    const inventory =
      DashboardExecutiveWorkspaceVisualizationPlatformInventoryMetadata;
    assert.equal(inventory.counts.phaseCount, inventory.phaseComposition.length);
    assert.equal(inventory.counts.capabilityCount, inventory.capabilities.length);
    assert.equal(inventory.counts.guaranteeCount, inventory.guarantees.length);
    assert.equal(inventory.counts.compatibilityCount, inventory.compatibility.length);
    assert.equal(inventory.counts.publicSurfaceCount,
      inventory.publicPlatformSurface.length);
    assert.equal(getDashboardExecutiveWorkspaceVisualizationPlatformCount(),
      inventory.phaseComposition.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Manifest as its only upstream phase dependency", () => {
    assert.equal(DashboardExecutiveWorkspaceVisualizationPlatformMetadata.dependency
      .dashboardExecutiveWorkspaceVisualizationManifestOnly, true);
    const combined = sources.join("\n");
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

  it("is immutable metadata with no platform or visualization runtime", () => {
    const metadata = DashboardExecutiveWorkspaceVisualizationPlatformMetadata;
    assert.ok(Object.isFrozen(DashboardExecutiveWorkspaceVisualizationPlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.platformExecution, false);
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
      /from ["'](?:react|next|d3|chart\.js|echarts|plotly|vega)/i);
    assert.doesNotMatch(combined,
      /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getDashboardExecutiveWorkspaceVisualizationPlatformSummary().status,
      "ReadyForCertification");
    const release =
      getDashboardExecutiveWorkspaceVisualizationPlatformReleaseMetadata();
    assert.equal(release.status, "ReadyForCertification");
    assert.equal(release.manifestReference,
      "EVE-6:5/DashboardExecutiveWorkspaceVisualizationManifest");
  });
});
