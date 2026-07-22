import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ValidationExports from "./visualizationSuiteValidation.ts";
import {
  VisualizationSuiteValidationIdentityMetadata,
  VisualizationSuiteValidationInventoryMetadata,
  VisualizationSuiteValidationMetadata,
  VisualizationSuiteValidationPlatform,
  VisualizationSuiteValidationReadinessMetadata,
  getVisualizationSuiteValidationCount,
  getVisualizationSuiteValidationReleaseMetadata,
  getVisualizationSuiteValidationSummary,
} from "./visualizationSuiteValidation.ts";

const files = Object.freeze([
  "visualizationSuiteValidation.test.ts", "visualizationSuiteValidation.ts",
  "visualizationSuiteValidationDiagnostics.ts",
  "visualizationSuiteValidationInventory.ts",
  "visualizationSuiteValidationMetadata.ts",
  "visualizationSuiteValidationPolicies.ts",
  "visualizationSuiteValidationRules.ts",
  "visualizationSuiteValidationTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-9:4 Visualization Suite Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ValidationExports).sort(), [
      "VisualizationSuiteValidationIdentityMetadata",
      "VisualizationSuiteValidationInventoryMetadata",
      "VisualizationSuiteValidationMetadata",
      "VisualizationSuiteValidationPlatform",
      "VisualizationSuiteValidationReadinessMetadata",
      "getVisualizationSuiteValidationCount",
      "getVisualizationSuiteValidationReleaseMetadata",
      "getVisualizationSuiteValidationSummary",
    ].sort());
  });

  it("publishes canonical identity and Manifest readiness", () => {
    assert.equal(VisualizationSuiteValidationIdentityMetadata.id,
      "EVE-9:4/VisualizationSuiteValidation");
    assert.equal(VisualizationSuiteValidationIdentityMetadata.namespace,
      "nexora.eve.visualization-suite.validation");
    assert.equal(VisualizationSuiteValidationReadinessMetadata.status,
      "ReadyForManifest");
  });

  it("publishes fourteen immutable paired categories and rules", () => {
    const { categories, rules } = VisualizationSuiteValidationPlatform;
    assert.equal(categories.length, 14);
    assert.equal(rules.length, 14);
    assert.ok(rules.every((rule, index) => Object.isFrozen(rule)
      && rule.categoryReference === categories[index]
      && rule.expectedOutcome === "Passed" && !rule.executes
      && rule.deterministicOrder === index + 1));
  });

  it("publishes fourteen gates and ten policies", () => {
    const { gates, policies } = VisualizationSuiteValidationPlatform;
    assert.equal(gates.length, 14);
    assert.equal(policies.length, 10);
    for (const collection of [gates, policies]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.metadataOnly && entry.immutable
        && entry.deterministicOrder === index + 1));
    }
  });

  it("publishes immutable diagnostic metadata", () => {
    const platform = VisualizationSuiteValidationPlatform;
    for (const collection of [platform.diagnostics, platform.severityLevels,
      platform.outcomes, platform.failureCategories,
      platform.recommendationCategories]) {
      assert.ok(Object.isFrozen(collection));
    }
    assert.ok(platform.diagnostics.every((diagnostic) =>
      Object.isFrozen(diagnostic) && !diagnostic.runtimeReporting));
  });

  it("preserves every Model collection by canonical reference", () => {
    const { model, inventory } = VisualizationSuiteValidationPlatform;
    assert.equal(inventory.modelDescriptors, model.descriptors);
    assert.equal(inventory.modelRelationships, model.relationships);
    assert.equal(inventory.modelComposition, model.composition);
    assert.equal(inventory.modelPolicies, model.policies);
    assert.equal(inventory.modelMetadata, model.metadata);
    assert.equal(inventory.modelInventory, model.inventory);
    assert.equal(inventory.modelRegistryReference, model.registry);
  });

  it("derives all Validation inventory counts dynamically", () => {
    const inventory = VisualizationSuiteValidationInventoryMetadata;
    assert.equal(inventory.counts.categoryCount, inventory.categories.length);
    assert.equal(inventory.counts.ruleCount, inventory.rules.length);
    assert.equal(inventory.counts.gateCount, inventory.gates.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(inventory.counts.diagnosticCount,
      inventory.diagnostics.length);
    assert.equal(getVisualizationSuiteValidationCount(),
      inventory.rules.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsModelCollections, false);
  });

  it("uses Model as its only phase dependency", () => {
    assert.equal(VisualizationSuiteValidationMetadata.dependency
      .visualizationSuiteModelOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationSuiteRegistry/);
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationSuiteFoundation/);
    assert.doesNotMatch(combined, /PublicIndex\.ts["']/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("contains immutable metadata and no prohibited runtime", () => {
    const metadata = VisualizationSuiteValidationMetadata;
    assert.ok(Object.isFrozen(VisualizationSuiteValidationPlatform));
    assert.equal(metadata.validationEngine, false);
    assert.equal(metadata.runtimeValidation, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.visualizationExecution, false);
    assert.equal(metadata.runtimeComposition, false);
    assert.equal(metadata.orchestration, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined,
      /from ["'](?:react|next|three|babylon|pixi|d3|chart\.js)/i);
    assert.doesNotMatch(combined,
      /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getVisualizationSuiteValidationSummary().status,
      "ReadyForManifest");
    const release = getVisualizationSuiteValidationReleaseMetadata();
    assert.equal(release.status, "ReadyForManifest");
    assert.equal(release.modelReference, "EVE-9:3/VisualizationSuiteModel");
  });
});
