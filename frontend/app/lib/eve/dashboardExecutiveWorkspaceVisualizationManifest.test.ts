import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ManifestExports from "./dashboardExecutiveWorkspaceVisualizationManifest.ts";
import {
  DashboardExecutiveWorkspaceVisualizationManifestIdentityMetadata,
  DashboardExecutiveWorkspaceVisualizationManifestInventoryMetadata,
  DashboardExecutiveWorkspaceVisualizationManifestMetadata,
  DashboardExecutiveWorkspaceVisualizationManifestPlatform,
  DashboardExecutiveWorkspaceVisualizationManifestReadinessMetadata,
  getDashboardExecutiveWorkspaceVisualizationManifestCount,
  getDashboardExecutiveWorkspaceVisualizationManifestReleaseMetadata,
  getDashboardExecutiveWorkspaceVisualizationManifestSummary,
} from "./dashboardExecutiveWorkspaceVisualizationManifest.ts";

const files = Object.freeze([
  "dashboardExecutiveWorkspaceVisualizationManifest.test.ts",
  "dashboardExecutiveWorkspaceVisualizationManifest.ts",
  "dashboardExecutiveWorkspaceVisualizationManifestCompatibility.ts",
  "dashboardExecutiveWorkspaceVisualizationManifestGuarantees.ts",
  "dashboardExecutiveWorkspaceVisualizationManifestInventory.ts",
  "dashboardExecutiveWorkspaceVisualizationManifestMetadata.ts",
  "dashboardExecutiveWorkspaceVisualizationManifestReadiness.ts",
  "dashboardExecutiveWorkspaceVisualizationManifestTypes.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-6:5 Dashboard & Executive Workspace Visualization Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ManifestExports).sort(), [
      "DashboardExecutiveWorkspaceVisualizationManifestIdentityMetadata",
      "DashboardExecutiveWorkspaceVisualizationManifestInventoryMetadata",
      "DashboardExecutiveWorkspaceVisualizationManifestMetadata",
      "DashboardExecutiveWorkspaceVisualizationManifestPlatform",
      "DashboardExecutiveWorkspaceVisualizationManifestReadinessMetadata",
      "getDashboardExecutiveWorkspaceVisualizationManifestCount",
      "getDashboardExecutiveWorkspaceVisualizationManifestReleaseMetadata",
      "getDashboardExecutiveWorkspaceVisualizationManifestSummary",
    ].sort());
  });

  it("publishes the canonical identity and readiness", () => {
    const identity = DashboardExecutiveWorkspaceVisualizationManifestIdentityMetadata;
    assert.equal(identity.id,
      "EVE-6:5/DashboardExecutiveWorkspaceVisualizationManifest");
    assert.equal(identity.name,
      "Dashboard & Executive Workspace Visualization Manifest");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace,
      "nexora.eve.dashboard-executive-workspace-visualization.manifest");
    assert.equal(identity.status, "ReadyForPlatform");
    assert.equal(DashboardExecutiveWorkspaceVisualizationManifestReadinessMetadata.status,
      "ReadyForPlatform");
  });

  it("publishes the canonical five-phase composition by reference", () => {
    const { composition, validation } =
      DashboardExecutiveWorkspaceVisualizationManifestPlatform;
    const model = validation.model;
    const registry = model.registry;
    const foundation = registry.foundation;
    assert.deepEqual(composition.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest",
    ]);
    assert.equal(composition[0]!.canonicalSource, foundation);
    assert.equal(composition[1]!.canonicalSource, registry);
    assert.equal(composition[2]!.canonicalSource, model);
    assert.equal(composition[3]!.canonicalSource, validation);
    assert.equal(composition[4]!.canonicalSource, null);
    assert.ok(composition.every((entry, index) => Object.isFrozen(entry)
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
  });

  it("publishes twelve guarantees and eight compatibility declarations", () => {
    const { guarantees, compatibility } =
      DashboardExecutiveWorkspaceVisualizationManifestPlatform;
    assert.equal(guarantees.length, 12);
    assert.equal(compatibility.length, 8);
    for (const collection of [guarantees, compatibility]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly
        && entry.deterministicOrder === index + 1));
    }
  });

  it("publishes seven immutable readiness declarations", () => {
    const readiness =
      DashboardExecutiveWorkspaceVisualizationManifestPlatform.readinessDeclarations;
    assert.equal(readiness.length, 7);
    assert.ok(Object.isFrozen(readiness));
    assert.ok(readiness.every((entry, index) => Object.isFrozen(entry)
      && entry.ready && !entry.executes
      && entry.deterministicOrder === index + 1));
  });

  it("preserves every Validation collection by canonical reference", () => {
    const { validation, inventory } =
      DashboardExecutiveWorkspaceVisualizationManifestPlatform;
    assert.equal(inventory.validationInventory, validation.inventory);
    assert.equal(inventory.validationCategories, validation.categories);
    assert.equal(inventory.validationRules, validation.rules);
    assert.equal(inventory.validationGates, validation.gates);
    assert.equal(inventory.validationDiagnostics, validation.diagnostics);
    assert.equal(inventory.validationSeverityLevels, validation.severityLevels);
    assert.equal(inventory.validationOutcomes, validation.outcomes);
    assert.equal(inventory.validationPolicies, validation.policies);
    assert.equal(inventory.validationReadinessDeclarations,
      validation.readinessDeclarations);
  });

  it("derives all Manifest inventory counts dynamically", () => {
    const inventory =
      DashboardExecutiveWorkspaceVisualizationManifestInventoryMetadata;
    const pairs = [
      [inventory.counts.phaseCount, inventory.phaseComposition.length],
      [inventory.counts.validationCategoryCount,
        inventory.validationCategories.length],
      [inventory.counts.validationRuleCount, inventory.validationRules.length],
      [inventory.counts.validationGateCount, inventory.validationGates.length],
      [inventory.counts.validationDiagnosticCount,
        inventory.validationDiagnostics.length],
      [inventory.counts.validationSeverityLevelCount,
        inventory.validationSeverityLevels.length],
      [inventory.counts.validationOutcomeCount, inventory.validationOutcomes.length],
      [inventory.counts.validationPolicyCount, inventory.validationPolicies.length],
      [inventory.counts.validationReadinessCount,
        inventory.validationReadinessDeclarations.length],
      [inventory.counts.guaranteeCount, inventory.guarantees.length],
      [inventory.counts.compatibilityCount, inventory.compatibility.length],
      [inventory.counts.readinessCount, inventory.readiness.length],
      [inventory.counts.publicSurfaceCount, inventory.publicManifestSurface.length],
    ] as const;
    for (const [count, length] of pairs) assert.equal(count, length);
    assert.equal(getDashboardExecutiveWorkspaceVisualizationManifestCount(),
      inventory.phaseComposition.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Validation as its only upstream phase dependency", () => {
    assert.equal(DashboardExecutiveWorkspaceVisualizationManifestMetadata.dependency
      .dashboardExecutiveWorkspaceVisualizationValidationOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationModel/);
    assert.doesNotMatch(combined,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationRegistry/);
    assert.doesNotMatch(combined,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualization/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("is immutable metadata with no manifest or visualization runtime", () => {
    const metadata = DashboardExecutiveWorkspaceVisualizationManifestMetadata;
    assert.ok(Object.isFrozen(
      DashboardExecutiveWorkspaceVisualizationManifestPlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.manifestExecution, false);
    assert.equal(metadata.validationExecution, false);
    assert.equal(metadata.dashboardRuntime, false);
    assert.equal(metadata.widgetRuntime, false);
    assert.equal(metadata.layoutEngine, false);
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
    assert.equal(getDashboardExecutiveWorkspaceVisualizationManifestSummary().status,
      "ReadyForPlatform");
    const release =
      getDashboardExecutiveWorkspaceVisualizationManifestReleaseMetadata();
    assert.equal(release.status, "ReadyForPlatform");
    assert.equal(release.validationReference,
      "EVE-6:4/DashboardExecutiveWorkspaceVisualizationValidation");
  });
});
