import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ValidationExports from "./visualizationPlatformValidation.ts";
import {
  VisualizationPlatformValidationIdentityMetadata,
  VisualizationPlatformValidationInventoryMetadata,
  VisualizationPlatformValidationMetadata,
  VisualizationPlatformValidationPlatform,
  VisualizationPlatformValidationReadinessMetadata,
  getVisualizationPlatformValidationCount,
  getVisualizationPlatformValidationReleaseMetadata,
  getVisualizationPlatformValidationSummary,
} from "./visualizationPlatformValidation.ts";

const files = Object.freeze([
  "visualizationPlatformValidation.test.ts", "visualizationPlatformValidation.ts",
  "visualizationPlatformValidationDiagnostics.ts",
  "visualizationPlatformValidationInventory.ts",
  "visualizationPlatformValidationMetadata.ts",
  "visualizationPlatformValidationPolicies.ts",
  "visualizationPlatformValidationRules.ts",
  "visualizationPlatformValidationTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-8:4 Visualization Platform Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ValidationExports).sort(), [
      "VisualizationPlatformValidationIdentityMetadata",
      "VisualizationPlatformValidationInventoryMetadata",
      "VisualizationPlatformValidationMetadata",
      "VisualizationPlatformValidationPlatform",
      "VisualizationPlatformValidationReadinessMetadata",
      "getVisualizationPlatformValidationCount",
      "getVisualizationPlatformValidationReleaseMetadata",
      "getVisualizationPlatformValidationSummary",
    ].sort());
  });

  it("publishes canonical identity and Manifest readiness", () => {
    assert.equal(VisualizationPlatformValidationIdentityMetadata.id,
      "EVE-8:4/VisualizationPlatformValidation");
    assert.equal(VisualizationPlatformValidationIdentityMetadata.namespace,
      "nexora.eve.visualization-platform.validation");
    assert.equal(VisualizationPlatformValidationReadinessMetadata.status,
      "ReadyForManifest");
  });

  it("publishes fourteen immutable paired categories and rules", () => {
    const { categories, rules, model } = VisualizationPlatformValidationPlatform;
    assert.equal(categories.length, 14);
    assert.equal(rules.length, 14);
    assert.ok(rules.every((rule, index) => Object.isFrozen(rule)
      && rule.categoryReference === categories[index]
      && rule.modelReference === model.metadata.id
      && rule.deterministicOrder === index + 1 && !rule.executes));
  });

  it("publishes fourteen gates and ten policies", () => {
    const { gates, policies } = VisualizationPlatformValidationPlatform;
    assert.equal(gates.length, 14);
    assert.equal(policies.length, 10);
    for (const collection of [gates, policies]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.metadataOnly && entry.immutable
        && entry.deterministicOrder === index + 1));
    }
    assert.ok(gates.every(({ outcome, executes }) =>
      outcome === "Passed" && !executes));
  });

  it("publishes immutable diagnostic metadata", () => {
    const platform = VisualizationPlatformValidationPlatform;
    for (const collection of [platform.diagnostics, platform.severityLevels,
      platform.outcomes, platform.failureCategories,
      platform.recommendationCategories]) {
      assert.ok(Object.isFrozen(collection));
    }
    assert.ok(platform.diagnostics.every((entry, index) =>
      Object.isFrozen(entry) && !entry.runtimeReporting
      && entry.deterministicOrder === index + 1));
  });

  it("preserves every Model collection by canonical reference", () => {
    const { model, inventory } = VisualizationPlatformValidationPlatform;
    assert.equal(inventory.modelDescriptors, model.descriptors);
    assert.equal(inventory.modelRelationships, model.relationships);
    assert.equal(inventory.modelComposition, model.composition);
    assert.equal(inventory.modelPolicies, model.policies);
    assert.equal(inventory.modelMetadata, model.metadata);
    assert.equal(inventory.modelInventory, model.inventory);
    assert.equal(inventory.modelIdentity, model.identity);
    assert.equal(inventory.modelRegistryReference, model.registry);
  });

  it("derives all Validation inventory counts dynamically", () => {
    const inventory = VisualizationPlatformValidationInventoryMetadata;
    assert.equal(inventory.counts.categoryCount, inventory.categories.length);
    assert.equal(inventory.counts.ruleCount, inventory.rules.length);
    assert.equal(inventory.counts.gateCount, inventory.gates.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(inventory.counts.diagnosticCount, inventory.diagnostics.length);
    assert.equal(getVisualizationPlatformValidationCount(),
      inventory.rules.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsModelCollections, false);
  });

  it("uses Model as its only phase dependency", () => {
    assert.equal(VisualizationPlatformValidationMetadata.dependency
      .visualizationPlatformModelOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationPlatformRegistry/);
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationPlatformFoundation/);
    assert.doesNotMatch(combined,
      /from ["']\.\/(?:sceneRendering|graphVisualization|timelineVisualization|chartMetricVisualization|dashboardExecutiveWorkspaceVisualization|animationEffects)/);
  });

  it("contains immutable metadata and no prohibited runtime", () => {
    const metadata = VisualizationPlatformValidationMetadata;
    assert.ok(Object.isFrozen(VisualizationPlatformValidationPlatform));
    assert.equal(metadata.validationEngine, false);
    assert.equal(metadata.runtimeValidation, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.visualizationExecution, false);
    assert.equal(metadata.graphExecution, false);
    assert.equal(metadata.timelineExecution, false);
    assert.equal(metadata.dashboardExecution, false);
    assert.equal(metadata.animationExecution, false);
    assert.equal(metadata.orchestration, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getVisualizationPlatformValidationSummary().status,
      "ReadyForManifest");
    const release = getVisualizationPlatformValidationReleaseMetadata();
    assert.equal(release.status, "ReadyForManifest");
    assert.equal(release.modelReference,
      "EVE-8:3/VisualizationPlatformModel");
  });
});
