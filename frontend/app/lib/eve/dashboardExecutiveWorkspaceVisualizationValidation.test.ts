import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ValidationExports from "./dashboardExecutiveWorkspaceVisualizationValidation.ts";
import {
  DashboardExecutiveWorkspaceVisualizationValidationIdentityMetadata,
  DashboardExecutiveWorkspaceVisualizationValidationInventoryMetadata,
  DashboardExecutiveWorkspaceVisualizationValidationMetadata,
  DashboardExecutiveWorkspaceVisualizationValidationPlatform,
  DashboardExecutiveWorkspaceVisualizationValidationReadinessMetadata,
  getDashboardExecutiveWorkspaceVisualizationValidationCount,
  getDashboardExecutiveWorkspaceVisualizationValidationReleaseMetadata,
  getDashboardExecutiveWorkspaceVisualizationValidationSummary,
} from "./dashboardExecutiveWorkspaceVisualizationValidation.ts";

const files = Object.freeze([
  "dashboardExecutiveWorkspaceVisualizationValidation.test.ts",
  "dashboardExecutiveWorkspaceVisualizationValidation.ts",
  "dashboardExecutiveWorkspaceVisualizationValidationDiagnostics.ts",
  "dashboardExecutiveWorkspaceVisualizationValidationInventory.ts",
  "dashboardExecutiveWorkspaceVisualizationValidationMetadata.ts",
  "dashboardExecutiveWorkspaceVisualizationValidationPolicies.ts",
  "dashboardExecutiveWorkspaceVisualizationValidationRules.ts",
  "dashboardExecutiveWorkspaceVisualizationValidationTypes.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-6:4 Dashboard & Executive Workspace Visualization Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ValidationExports).sort(), [
      "DashboardExecutiveWorkspaceVisualizationValidationIdentityMetadata",
      "DashboardExecutiveWorkspaceVisualizationValidationInventoryMetadata",
      "DashboardExecutiveWorkspaceVisualizationValidationMetadata",
      "DashboardExecutiveWorkspaceVisualizationValidationPlatform",
      "DashboardExecutiveWorkspaceVisualizationValidationReadinessMetadata",
      "getDashboardExecutiveWorkspaceVisualizationValidationCount",
      "getDashboardExecutiveWorkspaceVisualizationValidationReleaseMetadata",
      "getDashboardExecutiveWorkspaceVisualizationValidationSummary",
    ].sort());
  });

  it("publishes the canonical identity and readiness", () => {
    const identity =
      DashboardExecutiveWorkspaceVisualizationValidationIdentityMetadata;
    assert.equal(identity.id,
      "EVE-6:4/DashboardExecutiveWorkspaceVisualizationValidation");
    assert.equal(identity.name,
      "Dashboard & Executive Workspace Visualization Validation");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace,
      "nexora.eve.dashboard-executive-workspace-visualization.validation");
    assert.equal(identity.status, "ReadyForManifest");
    assert.equal(
      DashboardExecutiveWorkspaceVisualizationValidationReadinessMetadata.status,
      "ReadyForManifest");
  });

  it("publishes twenty immutable validation categories and rules", () => {
    const { categories, rules, model } =
      DashboardExecutiveWorkspaceVisualizationValidationPlatform;
    assert.equal(categories.length, 20);
    assert.equal(rules.length, 20);
    assert.ok(Object.isFrozen(categories));
    assert.ok(Object.isFrozen(rules));
    rules.forEach((rule, index) => {
      assert.ok(Object.isFrozen(rule));
      assert.equal(rule.categoryReference, categories[index]);
      assert.equal(rule.modelReference, model.metadata.id);
      assert.equal(rule.expectedOutcome, "Passed");
      assert.equal(rule.deterministicOrder, index + 1);
      assert.equal(rule.executes, false);
    });
  });

  it("publishes every exact supporting validation inventory", () => {
    const platform = DashboardExecutiveWorkspaceVisualizationValidationPlatform;
    const inventories = [
      [platform.gates, 16], [platform.diagnostics, 8],
      [platform.severityLevels, 6], [platform.outcomes, 6],
      [platform.policies, 14], [platform.readinessDeclarations, 7],
    ] as const;
    for (const [entries, count] of inventories) {
      assert.equal(entries.length, count);
      assert.ok(Object.isFrozen(entries));
    }
    assert.ok(platform.gates.every((gate, index) => Object.isFrozen(gate)
      && gate.outcome === "Passed" && !gate.executes
      && gate.deterministicOrder === index + 1));
    for (const entries of [platform.diagnostics, platform.policies,
      platform.readinessDeclarations]) {
      assert.ok(entries.every((entry, index) => Object.isFrozen(entry)
        && entry.metadataOnly && entry.immutable
        && entry.deterministicOrder === index + 1));
    }
  });

  it("preserves Model collections and all upstream reachability by reference", () => {
    const { model, inventory } =
      DashboardExecutiveWorkspaceVisualizationValidationPlatform;
    assert.equal(inventory.modelDescriptors, model.descriptors);
    assert.equal(inventory.modelRelationships, model.relationships);
    assert.equal(inventory.modelComposition, model.composition);
    assert.equal(inventory.modelPolicies, model.policies);
    assert.equal(inventory.modelMetadata, model.metadata);
    assert.equal(inventory.modelInventory, model.inventory);
    assert.equal(inventory.modelIdentity, model.identity);
    assert.equal(inventory.modelRegistryReference, model.registry);
    assert.equal(model.registry.foundation.metadata.id,
      "EVE-6:1/DashboardExecutiveWorkspaceVisualizationFoundation");
    assert.equal(model.registry.foundation.upstreamPublicIndex.id,
      "EVE-5:9/ChartMetricVisualizationPublicIndex");
  });

  it("derives every Validation inventory count dynamically", () => {
    const inventory =
      DashboardExecutiveWorkspaceVisualizationValidationInventoryMetadata;
    const pairs = [
      [inventory.counts.categoryCount, inventory.categories.length],
      [inventory.counts.ruleCount, inventory.rules.length],
      [inventory.counts.gateCount, inventory.gates.length],
      [inventory.counts.diagnosticCount, inventory.diagnostics.length],
      [inventory.counts.severityLevelCount, inventory.severityLevels.length],
      [inventory.counts.outcomeCount, inventory.outcomes.length],
      [inventory.counts.policyCount, inventory.policies.length],
      [inventory.counts.readinessDeclarationCount,
        inventory.readinessDeclarations.length],
    ] as const;
    for (const [count, length] of pairs) assert.equal(count, length);
    assert.equal(getDashboardExecutiveWorkspaceVisualizationValidationCount(),
      inventory.rules.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsModelCollections, false);
  });

  it("uses Model as its only upstream phase dependency", () => {
    assert.equal(DashboardExecutiveWorkspaceVisualizationValidationMetadata.dependency
      .dashboardExecutiveWorkspaceVisualizationModelOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationRegistry/);
    assert.doesNotMatch(combined,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualization/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("is immutable metadata with no validation or visualization runtime", () => {
    const metadata = DashboardExecutiveWorkspaceVisualizationValidationMetadata;
    assert.ok(Object.isFrozen(
      DashboardExecutiveWorkspaceVisualizationValidationPlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.validationEngine, false);
    assert.equal(metadata.runtimeValidation, false);
    assert.equal(metadata.dashboardRuntime, false);
    assert.equal(metadata.widgetRuntime, false);
    assert.equal(metadata.layoutEngine, false);
    assert.equal(metadata.rendering, false);
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
      getDashboardExecutiveWorkspaceVisualizationValidationSummary().status,
      "ReadyForManifest");
    const release =
      getDashboardExecutiveWorkspaceVisualizationValidationReleaseMetadata();
    assert.equal(release.status, "ReadyForManifest");
    assert.equal(release.modelReference,
      "EVE-6:3/DashboardExecutiveWorkspaceVisualizationModel");
  });
});
