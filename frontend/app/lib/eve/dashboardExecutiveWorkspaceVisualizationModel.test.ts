import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ModelExports from "./dashboardExecutiveWorkspaceVisualizationModel.ts";
import {
  DashboardExecutiveWorkspaceVisualizationModelIdentityMetadata,
  DashboardExecutiveWorkspaceVisualizationModelInventoryMetadata,
  DashboardExecutiveWorkspaceVisualizationModelMetadata,
  DashboardExecutiveWorkspaceVisualizationModelPlatform,
  DashboardExecutiveWorkspaceVisualizationModelReadinessMetadata,
  getDashboardExecutiveWorkspaceVisualizationModelCount,
  getDashboardExecutiveWorkspaceVisualizationModelReleaseMetadata,
  getDashboardExecutiveWorkspaceVisualizationModelSummary,
} from "./dashboardExecutiveWorkspaceVisualizationModel.ts";

const files = Object.freeze([
  "dashboardExecutiveWorkspaceVisualizationModel.test.ts",
  "dashboardExecutiveWorkspaceVisualizationModel.ts",
  "dashboardExecutiveWorkspaceVisualizationModelDescriptors.ts",
  "dashboardExecutiveWorkspaceVisualizationModelInventory.ts",
  "dashboardExecutiveWorkspaceVisualizationModelMetadata.ts",
  "dashboardExecutiveWorkspaceVisualizationModelPolicies.ts",
  "dashboardExecutiveWorkspaceVisualizationModelRelationships.ts",
  "dashboardExecutiveWorkspaceVisualizationModelTypes.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => ({
    name,
    source: readFileSync(new URL(name, import.meta.url), "utf8"),
  }));

describe("EVE-6:3 Dashboard & Executive Workspace Visualization Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ModelExports).sort(), [
      "DashboardExecutiveWorkspaceVisualizationModelIdentityMetadata",
      "DashboardExecutiveWorkspaceVisualizationModelInventoryMetadata",
      "DashboardExecutiveWorkspaceVisualizationModelMetadata",
      "DashboardExecutiveWorkspaceVisualizationModelPlatform",
      "DashboardExecutiveWorkspaceVisualizationModelReadinessMetadata",
      "getDashboardExecutiveWorkspaceVisualizationModelCount",
      "getDashboardExecutiveWorkspaceVisualizationModelReleaseMetadata",
      "getDashboardExecutiveWorkspaceVisualizationModelSummary",
    ].sort());
  });

  it("publishes the canonical identity and readiness", () => {
    const identity = DashboardExecutiveWorkspaceVisualizationModelIdentityMetadata;
    assert.equal(identity.id,
      "EVE-6:3/DashboardExecutiveWorkspaceVisualizationModel");
    assert.equal(identity.name,
      "Dashboard & Executive Workspace Visualization Model");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace,
      "nexora.eve.dashboard-executive-workspace-visualization.model");
    assert.equal(identity.status, "ReadyForValidation");
    assert.equal(DashboardExecutiveWorkspaceVisualizationModelReadinessMetadata.status,
      "ReadyForValidation");
  });

  it("publishes exactly twenty-two immutable typed model descriptors", () => {
    const { descriptors, registry } =
      DashboardExecutiveWorkspaceVisualizationModelPlatform;
    assert.equal(descriptors.length, 22);
    assert.ok(Object.isFrozen(descriptors));
    assert.equal(new Set(descriptors.map(({ id }) => id)).size, descriptors.length);
    descriptors.forEach((descriptor, index) => {
      assert.ok(Object.isFrozen(descriptor));
      assert.ok(Object.isFrozen(descriptor.structuralMetadata));
      assert.equal(descriptor.deterministicOrder, index + 1);
      assert.equal(descriptor.registryVocabularyReference,
        registry.vocabularyRegistries[index]);
      assert.equal(descriptor.registryCategoryReference, registry.categories[index]);
      assert.equal(descriptor.ownershipReference, registry.foundation.ownership);
      assert.equal(descriptor.boundaryReferences, registry.foundation.boundaries);
      assert.equal(descriptor.executableBehavior, false);
    });
  });

  it("publishes exactly twenty immutable architectural relationships", () => {
    const relationships =
      DashboardExecutiveWorkspaceVisualizationModelPlatform.relationships;
    assert.equal(relationships.length, 20);
    assert.equal(new Set(relationships.map(({ id }) => id)).size,
      relationships.length);
    assert.ok(relationships.every((relationship, index) =>
      Object.isFrozen(relationship)
      && relationship.deterministicOrder === index + 1
      && !relationship.traversalProvided && !relationship.resolutionProvided
      && !relationship.executionProvided));
  });

  it("publishes twenty composition entries and fourteen policies", () => {
    const { composition, policies } =
      DashboardExecutiveWorkspaceVisualizationModelPlatform;
    assert.equal(composition.length, 20);
    assert.equal(policies.length, 14);
    for (const collection of [composition, policies]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly
        && entry.deterministicOrder === index + 1));
    }
  });

  it("preserves Registry, Foundation, EVE-5 index, and lock references", () => {
    const { registry, inventory } =
      DashboardExecutiveWorkspaceVisualizationModelPlatform;
    assert.equal(inventory.registryVocabularyRegistries,
      registry.vocabularyRegistries);
    assert.equal(inventory.registryCategories, registry.categories);
    assert.equal(inventory.registryInventory, registry.inventory);
    assert.equal(inventory.registryPolicies, registry.policies);
    assert.equal(inventory.registryExtensions, registry.extensions);
    assert.equal(inventory.registryFoundationReference, registry.foundation);
    assert.equal(registry.foundation.metadata.id,
      "EVE-6:1/DashboardExecutiveWorkspaceVisualizationFoundation");
    assert.equal(registry.foundation.upstreamPublicIndex.id,
      "EVE-5:9/ChartMetricVisualizationPublicIndex");
    assert.equal(registry.foundation.upstreamPublicIndex.lockId,
      "EVE-5-CHART-METRIC-VISUALIZATION-LOCKED");
  });

  it("derives every Model inventory count dynamically", () => {
    const inventory =
      DashboardExecutiveWorkspaceVisualizationModelInventoryMetadata;
    assert.equal(inventory.counts.modelCount, inventory.models.length);
    assert.equal(inventory.counts.relationshipCount, inventory.relationships.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(inventory.counts.compositionEntryCount,
      inventory.structuralComposition.length);
    assert.equal(getDashboardExecutiveWorkspaceVisualizationModelCount(),
      inventory.models.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsRegistryCollections, false);
    assert.equal(inventory.recountsUpstreamInventories, false);
  });

  it("uses Registry as its only upstream phase dependency", () => {
    assert.equal(DashboardExecutiveWorkspaceVisualizationModelMetadata.dependency
      .dashboardExecutiveWorkspaceVisualizationRegistryOnly, true);
    const combined = sources.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined,
      /from ["']\.\/dashboardExecutiveWorkspaceVisualizationFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/chartMetricVisualization/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("contains immutable metadata and no prohibited runtime facilities", () => {
    const metadata = DashboardExecutiveWorkspaceVisualizationModelMetadata;
    assert.ok(Object.isFrozen(DashboardExecutiveWorkspaceVisualizationModelPlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.dashboardRuntime, false);
    assert.equal(metadata.widgetRuntime, false);
    assert.equal(metadata.layoutEngine, false);
    assert.equal(metadata.dragAndDrop, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
    assert.equal(metadata.runtimeExecution, false);
    const combined = sources.map(({ source }) => source).join("\n");
    assert.doesNotMatch(combined,
      /from ["'](?:react|next|d3|chart\.js|echarts|plotly|vega)/i);
    assert.doesNotMatch(combined,
      /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getDashboardExecutiveWorkspaceVisualizationModelSummary().status,
      "ReadyForValidation");
    const release =
      getDashboardExecutiveWorkspaceVisualizationModelReleaseMetadata();
    assert.equal(release.status, "ReadyForValidation");
    assert.equal(release.registryReference,
      "EVE-6:2/DashboardExecutiveWorkspaceVisualizationRegistry");
  });
});
