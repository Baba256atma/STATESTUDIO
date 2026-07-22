import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ManifestExports from "./visualizationSuiteManifest.ts";
import {
  VisualizationSuiteManifestIdentityMetadata,
  VisualizationSuiteManifestInventoryMetadata,
  VisualizationSuiteManifestMetadata,
  VisualizationSuiteManifestPlatform,
  VisualizationSuiteManifestReadinessMetadata,
  getVisualizationSuiteManifestCount,
  getVisualizationSuiteManifestReleaseMetadata,
  getVisualizationSuiteManifestSummary,
} from "./visualizationSuiteManifest.ts";

const files = Object.freeze([
  "visualizationSuiteManifest.test.ts", "visualizationSuiteManifest.ts",
  "visualizationSuiteManifestCompatibility.ts",
  "visualizationSuiteManifestGuarantees.ts",
  "visualizationSuiteManifestInventory.ts",
  "visualizationSuiteManifestMetadata.ts",
  "visualizationSuiteManifestReadiness.ts",
  "visualizationSuiteManifestTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-9:5 Visualization Suite Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ManifestExports).sort(), [
      "VisualizationSuiteManifestIdentityMetadata",
      "VisualizationSuiteManifestInventoryMetadata",
      "VisualizationSuiteManifestMetadata",
      "VisualizationSuiteManifestPlatform",
      "VisualizationSuiteManifestReadinessMetadata",
      "getVisualizationSuiteManifestCount",
      "getVisualizationSuiteManifestReleaseMetadata",
      "getVisualizationSuiteManifestSummary",
    ].sort());
  });

  it("publishes canonical identity and Platform readiness", () => {
    assert.equal(VisualizationSuiteManifestIdentityMetadata.id,
      "EVE-9:5/VisualizationSuiteManifest");
    assert.equal(VisualizationSuiteManifestIdentityMetadata.namespace,
      "nexora.eve.visualization-suite.manifest");
    assert.equal(VisualizationSuiteManifestReadinessMetadata.status,
      "ReadyForPlatform");
  });

  it("publishes the canonical five-phase composition by reference", () => {
    const { composition, validation } = VisualizationSuiteManifestPlatform;
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
    const { guarantees, compatibility } = VisualizationSuiteManifestPlatform;
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
    const readiness = VisualizationSuiteManifestPlatform.readinessDeclarations;
    assert.equal(readiness.length, 7);
    assert.ok(readiness.every((entry, index) => Object.isFrozen(entry)
      && entry.ready && !entry.executes
      && entry.deterministicOrder === index + 1));
  });

  it("preserves every Validation collection by canonical reference", () => {
    const { validation, inventory } = VisualizationSuiteManifestPlatform;
    assert.equal(inventory.validationInventory, validation.inventory);
    assert.equal(inventory.validationCategories, validation.categories);
    assert.equal(inventory.validationRules, validation.rules);
    assert.equal(inventory.validationGates, validation.gates);
    assert.equal(inventory.validationDiagnostics, validation.diagnostics);
    assert.equal(inventory.validationSeverityLevels, validation.severityLevels);
    assert.equal(inventory.validationOutcomes, validation.outcomes);
    assert.equal(inventory.validationFailureCategories,
      validation.failureCategories);
    assert.equal(inventory.validationRecommendationCategories,
      validation.recommendationCategories);
    assert.equal(inventory.validationPolicies, validation.policies);
    assert.equal(inventory.validationReadinessDeclarations,
      validation.readinessDeclarations);
  });

  it("derives all Manifest inventory counts dynamically", () => {
    const inventory = VisualizationSuiteManifestInventoryMetadata;
    assert.equal(inventory.counts.phaseCount, inventory.phaseComposition.length);
    assert.equal(inventory.counts.validationCategoryCount,
      inventory.validationCategories.length);
    assert.equal(inventory.counts.validationRuleCount,
      inventory.validationRules.length);
    assert.equal(inventory.counts.guaranteeCount, inventory.guarantees.length);
    assert.equal(inventory.counts.compatibilityCount,
      inventory.compatibility.length);
    assert.equal(inventory.counts.readinessCount, inventory.readiness.length);
    assert.equal(getVisualizationSuiteManifestCount(),
      inventory.phaseComposition.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.recalculatesUpstreamInventories, false);
  });

  it("uses Validation as its only upstream phase dependency", () => {
    assert.equal(VisualizationSuiteManifestMetadata.dependency
      .visualizationSuiteValidationOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteModel/);
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteRegistry/);
    assert.doesNotMatch(combined, /from ["']\.\/visualizationSuiteFoundation/);
    assert.doesNotMatch(combined, /PublicIndex\.ts["']/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("contains no manifest, visualization, or prohibited runtime", () => {
    const metadata = VisualizationSuiteManifestMetadata;
    assert.ok(Object.isFrozen(VisualizationSuiteManifestPlatform));
    assert.equal(metadata.manifestExecution, false);
    assert.equal(metadata.validationExecution, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.visualizationExecution, false);
    assert.equal(metadata.runtimeComposition, false);
    assert.equal(metadata.orchestration, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getVisualizationSuiteManifestSummary().status,
      "ReadyForPlatform");
    const release = getVisualizationSuiteManifestReleaseMetadata();
    assert.equal(release.status, "ReadyForPlatform");
    assert.equal(release.validationReference,
      "EVE-9:4/VisualizationSuiteValidation");
  });
});
