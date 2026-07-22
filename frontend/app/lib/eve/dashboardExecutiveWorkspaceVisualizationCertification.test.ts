import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as CertificationExports from "./dashboardExecutiveWorkspaceVisualizationCertification.ts";
import {
  DashboardExecutiveWorkspaceVisualizationCertificationIdentityMetadata,
  DashboardExecutiveWorkspaceVisualizationCertificationInventoryMetadata,
  DashboardExecutiveWorkspaceVisualizationCertificationMetadata,
  DashboardExecutiveWorkspaceVisualizationCertificationPlatform,
  DashboardExecutiveWorkspaceVisualizationCertificationReadinessMetadata,
  getDashboardExecutiveWorkspaceVisualizationCertificationCount,
  getDashboardExecutiveWorkspaceVisualizationCertificationReleaseMetadata,
  getDashboardExecutiveWorkspaceVisualizationCertificationSummary,
} from "./dashboardExecutiveWorkspaceVisualizationCertification.ts";

const files = Object.freeze([
  "dashboardExecutiveWorkspaceVisualizationCertification.test.ts",
  "dashboardExecutiveWorkspaceVisualizationCertification.ts",
  "dashboardExecutiveWorkspaceVisualizationCertificationCompatibility.ts",
  "dashboardExecutiveWorkspaceVisualizationCertificationCriteria.ts",
  "dashboardExecutiveWorkspaceVisualizationCertificationInventory.ts",
  "dashboardExecutiveWorkspaceVisualizationCertificationMetadata.ts",
  "dashboardExecutiveWorkspaceVisualizationCertificationReadiness.ts",
  "dashboardExecutiveWorkspaceVisualizationCertificationTypes.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-6:7 Dashboard & Executive Workspace Visualization Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(CertificationExports).sort(), [
      "DashboardExecutiveWorkspaceVisualizationCertificationIdentityMetadata",
      "DashboardExecutiveWorkspaceVisualizationCertificationInventoryMetadata",
      "DashboardExecutiveWorkspaceVisualizationCertificationMetadata",
      "DashboardExecutiveWorkspaceVisualizationCertificationPlatform",
      "DashboardExecutiveWorkspaceVisualizationCertificationReadinessMetadata",
      "getDashboardExecutiveWorkspaceVisualizationCertificationCount",
      "getDashboardExecutiveWorkspaceVisualizationCertificationReleaseMetadata",
      "getDashboardExecutiveWorkspaceVisualizationCertificationSummary",
    ].sort());
  });

  it("publishes canonical certified identity and Freeze readiness", () => {
    const identity =
      DashboardExecutiveWorkspaceVisualizationCertificationIdentityMetadata;
    assert.equal(identity.id,
      "EVE-6:7/DashboardExecutiveWorkspaceVisualizationCertification");
    assert.equal(identity.name,
      "Dashboard & Executive Workspace Visualization Certification");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace,
      "nexora.eve.dashboard-executive-workspace-visualization.certification");
    assert.equal(identity.status, "Certified");
    assert.equal(
      DashboardExecutiveWorkspaceVisualizationCertificationReadinessMetadata
        .readiness,
      "ReadyForFreeze");
  });

  it("publishes sixteen immutable certification criteria", () => {
    const { criteria, platform } =
      DashboardExecutiveWorkspaceVisualizationCertificationPlatform;
    assert.equal(criteria.length, 16);
    assert.ok(Object.isFrozen(criteria));
    assert.ok(criteria.every((criterion, index) => Object.isFrozen(criterion)
      && criterion.status === "Certified"
      && criterion.verification === "DeclarativeOnly"
      && criterion.platformReference === platform.metadata.id
      && criterion.deterministicOrder === index + 1));
  });

  it("publishes twelve passed gates and eight compatibility records", () => {
    const { gates, compatibility } =
      DashboardExecutiveWorkspaceVisualizationCertificationPlatform;
    assert.equal(gates.length, 12);
    assert.equal(compatibility.length, 8);
    for (const collection of [gates, compatibility]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly
        && entry.deterministicOrder === index + 1));
    }
    assert.ok(gates.every(({ outcome, executes }) =>
      outcome === "Passed" && !executes));
    assert.ok(compatibility.every(({ verified, runtimeVerification }) =>
      verified && !runtimeVerification));
  });

  it("preserves every Platform collection by canonical reference", () => {
    const { platform, inventory } =
      DashboardExecutiveWorkspaceVisualizationCertificationPlatform;
    assert.equal(inventory.platformInventory, platform.inventory);
    assert.equal(inventory.platformCapabilities, platform.capabilities);
    assert.equal(inventory.platformGuarantees, platform.guarantees);
    assert.equal(inventory.platformCompatibility, platform.compatibility);
    assert.equal(inventory.platformComposition, platform.composition);
    assert.equal(inventory.platformMetadata, platform.metadata);
    assert.equal(inventory.platformReadiness, platform.readiness);
  });

  it("derives all Certification inventory counts dynamically", () => {
    const inventory =
      DashboardExecutiveWorkspaceVisualizationCertificationInventoryMetadata;
    assert.equal(inventory.counts.criteriaCount, inventory.criteria.length);
    assert.equal(inventory.counts.gateCount, inventory.gates.length);
    assert.equal(inventory.counts.compatibilityVerificationCount,
      inventory.compatibilityVerification.length);
    assert.equal(inventory.counts.publicSurfaceCount,
      inventory.publicCertificationSurface.length);
    assert.equal(getDashboardExecutiveWorkspaceVisualizationCertificationCount(),
      inventory.criteria.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Platform as its only upstream phase dependency", () => {
    assert.equal(DashboardExecutiveWorkspaceVisualizationCertificationMetadata
      .dependency.dashboardExecutiveWorkspaceVisualizationPlatformOnly, true);
    const combined = sources.join("\n");
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

  it("is immutable metadata with no certification or dashboard runtime", () => {
    const metadata =
      DashboardExecutiveWorkspaceVisualizationCertificationMetadata;
    assert.ok(Object.isFrozen(
      DashboardExecutiveWorkspaceVisualizationCertificationPlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.certificationEngine, false);
    assert.equal(metadata.runtimeCertification, false);
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
    assert.equal(
      getDashboardExecutiveWorkspaceVisualizationCertificationSummary().status,
      "Certified");
    const release =
      getDashboardExecutiveWorkspaceVisualizationCertificationReleaseMetadata();
    assert.equal(release.status, "Certified");
    assert.equal(release.readiness, "ReadyForFreeze");
    assert.equal(release.platformReference,
      "EVE-6:6/DashboardExecutiveWorkspaceVisualizationPlatform");
  });
});
