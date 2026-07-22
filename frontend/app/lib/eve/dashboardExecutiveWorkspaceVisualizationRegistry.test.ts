import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as RegistryExports from "./dashboardExecutiveWorkspaceVisualizationRegistry.ts";
import {
  DashboardExecutiveWorkspaceVisualizationRegistryIdentityMetadata,
  DashboardExecutiveWorkspaceVisualizationRegistryInventoryMetadata,
  DashboardExecutiveWorkspaceVisualizationRegistryMetadata,
  DashboardExecutiveWorkspaceVisualizationRegistryPlatform,
  DashboardExecutiveWorkspaceVisualizationRegistryReadinessMetadata,
  getDashboardExecutiveWorkspaceVisualizationRegistryCount,
  getDashboardExecutiveWorkspaceVisualizationRegistryReleaseMetadata,
  getDashboardExecutiveWorkspaceVisualizationRegistrySummary,
} from "./dashboardExecutiveWorkspaceVisualizationRegistry.ts";

const files = Object.freeze([
  "dashboardExecutiveWorkspaceVisualizationCategories.ts",
  "dashboardExecutiveWorkspaceVisualizationExtensions.ts",
  "dashboardExecutiveWorkspaceVisualizationInventory.ts",
  "dashboardExecutiveWorkspaceVisualizationPolicies.ts",
  "dashboardExecutiveWorkspaceVisualizationRegistry.test.ts",
  "dashboardExecutiveWorkspaceVisualizationRegistry.ts",
  "dashboardExecutiveWorkspaceVisualizationRegistryTypes.ts",
  "dashboardExecutiveWorkspaceVisualizationVocabulary.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => ({ name, source: readFileSync(new URL(name, import.meta.url), "utf8") }));

describe("EVE-6:2 Dashboard & Executive Workspace Visualization Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) => files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(RegistryExports).sort(), [
      "DashboardExecutiveWorkspaceVisualizationRegistryIdentityMetadata",
      "DashboardExecutiveWorkspaceVisualizationRegistryInventoryMetadata",
      "DashboardExecutiveWorkspaceVisualizationRegistryMetadata",
      "DashboardExecutiveWorkspaceVisualizationRegistryPlatform",
      "DashboardExecutiveWorkspaceVisualizationRegistryReadinessMetadata",
      "getDashboardExecutiveWorkspaceVisualizationRegistryCount",
      "getDashboardExecutiveWorkspaceVisualizationRegistryReleaseMetadata",
      "getDashboardExecutiveWorkspaceVisualizationRegistrySummary",
    ].sort());
  });

  it("publishes the canonical identity and readiness", () => {
    const identity = DashboardExecutiveWorkspaceVisualizationRegistryIdentityMetadata;
    assert.equal(identity.id,
      "EVE-6:2/DashboardExecutiveWorkspaceVisualizationRegistry");
    assert.equal(identity.name,
      "Dashboard & Executive Workspace Visualization Registry");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace,
      "nexora.eve.dashboard-executive-workspace-visualization.registry");
    assert.equal(identity.status, "ReadyForModel");
    assert.equal(DashboardExecutiveWorkspaceVisualizationRegistryReadinessMetadata.status,
      "ReadyForModel");
  });

  it("publishes exactly twenty-two Foundation-aligned registries and categories", () => {
    const platform = DashboardExecutiveWorkspaceVisualizationRegistryPlatform;
    assert.equal(platform.vocabularyRegistries.length, 22);
    assert.equal(platform.categories.length, 22);
    platform.vocabularyRegistries.forEach((registry, index) => {
      assert.ok(Object.isFrozen(registry));
      assert.ok(Object.isFrozen(registry.entries));
      assert.equal(registry.deterministicOrder, index + 1);
      assert.equal(registry.foundationContractReference,
        platform.foundation.contracts[index]);
      assert.equal(platform.categories[index]!.vocabularyRegistryReference, registry);
      assert.ok(registry.entries.every((entry, entryIndex) => Object.isFrozen(entry)
        && entry.deterministicOrder === entryIndex + 1));
    });
  });

  it("publishes exactly eighteen extensions and fourteen policies", () => {
    const platform = DashboardExecutiveWorkspaceVisualizationRegistryPlatform;
    assert.equal(platform.extensions.length, 18);
    assert.equal(platform.policies.length, 14);
    for (const entries of [platform.extensions, platform.policies]) {
      assert.ok(Object.isFrozen(entries));
      assert.ok(entries.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly && entry.deterministicOrder === index + 1));
    }
  });

  it("registers the exact standard descriptive vocabulary", () => {
    const vocabulary = DashboardExecutiveWorkspaceVisualizationRegistryPlatform
      .standardVocabulary;
    assert.equal(vocabulary.workspaceZones.length, 8);
    assert.equal(vocabulary.dashboardTemplates.length, 8);
    assert.equal(vocabulary.widgetFamilies.length, 10);
    assert.equal(vocabulary.layoutModes.length, 5);
    assert.equal(vocabulary.navigationTypes.length, 5);
    assert.ok(Object.isFrozen(vocabulary));
  });

  it("preserves every Foundation collection by canonical reference", () => {
    const { foundation, inventory } =
      DashboardExecutiveWorkspaceVisualizationRegistryPlatform;
    assert.equal(inventory.foundationContracts, foundation.contracts);
    assert.equal(inventory.foundationOwnership, foundation.ownership);
    assert.equal(inventory.foundationBoundaries, foundation.boundaries);
    assert.equal(inventory.foundationLifecycle, foundation.lifecycle);
    assert.equal(inventory.foundationCapabilities, foundation.capabilities);
    assert.equal(inventory.foundationPolicies, foundation.policies);
    assert.equal(inventory.foundationIdentity, foundation.identity);
    assert.equal(inventory.foundationInventory, foundation.inventory);
  });

  it("derives all inventory counts dynamically", () => {
    const inventory = DashboardExecutiveWorkspaceVisualizationRegistryInventoryMetadata;
    assert.equal(inventory.counts.vocabularyRegistryCount,
      inventory.vocabularyRegistries.length);
    assert.equal(inventory.counts.categoryCount, inventory.categories.length);
    assert.equal(inventory.counts.vocabularyEntryCount, inventory.entries.length);
    assert.equal(inventory.counts.extensionClassificationCount,
      inventory.extensions.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(getDashboardExecutiveWorkspaceVisualizationRegistryCount(),
      inventory.entries.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsFoundationCollections, false);
  });

  it("uses Foundation as its only upstream phase dependency", () => {
    assert.equal(DashboardExecutiveWorkspaceVisualizationRegistryMetadata.dependency
      .dashboardExecutiveWorkspaceVisualizationFoundationOnly, true);
    const combined = sources.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualization/);
    assert.doesNotMatch(combined, /from ["']\.\/timelineVisualization/);
    assert.doesNotMatch(combined, /from ["']\.\/(?:graphVisualization|sceneRendering)/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("is immutable metadata with no dashboard, widget, or UI runtime", () => {
    const metadata = DashboardExecutiveWorkspaceVisualizationRegistryMetadata;
    assert.ok(Object.isFrozen(DashboardExecutiveWorkspaceVisualizationRegistryPlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.dashboardRuntime, false);
    assert.equal(metadata.widgetRuntime, false);
    assert.equal(metadata.layoutEngine, false);
    assert.equal(metadata.dragAndDrop, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.ui, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
    const combined = sources.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined,
      /from ["'](?:react|next|d3|chart\.js|echarts|plotly)/i);
    assert.doesNotMatch(combined, /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getDashboardExecutiveWorkspaceVisualizationRegistrySummary().status,
      "ReadyForModel");
    const release = getDashboardExecutiveWorkspaceVisualizationRegistryReleaseMetadata();
    assert.equal(release.status, "ReadyForModel");
    assert.equal(release.foundationReference,
      "EVE-6:1/DashboardExecutiveWorkspaceVisualizationFoundation");
  });
});
