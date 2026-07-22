import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ManifestExports from "./visualizationPlatformManifest.ts";
import {
  VisualizationPlatformManifestIdentityMetadata,
  VisualizationPlatformManifestInventoryMetadata,
  VisualizationPlatformManifestMetadata,
  VisualizationPlatformManifestPlatform,
  VisualizationPlatformManifestReadinessMetadata,
  getVisualizationPlatformManifestCount,
  getVisualizationPlatformManifestReleaseMetadata,
  getVisualizationPlatformManifestSummary,
} from "./visualizationPlatformManifest.ts";

const files = Object.freeze([
  "visualizationPlatformManifest.test.ts", "visualizationPlatformManifest.ts",
  "visualizationPlatformManifestCompatibility.ts",
  "visualizationPlatformManifestGuarantees.ts",
  "visualizationPlatformManifestInventory.ts",
  "visualizationPlatformManifestMetadata.ts",
  "visualizationPlatformManifestReadiness.ts",
  "visualizationPlatformManifestTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-8:5 Visualization Platform Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ManifestExports).sort(), [
      "VisualizationPlatformManifestIdentityMetadata",
      "VisualizationPlatformManifestInventoryMetadata",
      "VisualizationPlatformManifestMetadata",
      "VisualizationPlatformManifestPlatform",
      "VisualizationPlatformManifestReadinessMetadata",
      "getVisualizationPlatformManifestCount",
      "getVisualizationPlatformManifestReleaseMetadata",
      "getVisualizationPlatformManifestSummary",
    ].sort());
  });

  it("publishes canonical identity and Platform readiness", () => {
    assert.equal(VisualizationPlatformManifestIdentityMetadata.id,
      "EVE-8:5/VisualizationPlatformManifest");
    assert.equal(VisualizationPlatformManifestIdentityMetadata.namespace,
      "nexora.eve.visualization-platform.manifest");
    assert.equal(VisualizationPlatformManifestReadinessMetadata.status,
      "ReadyForPlatform");
  });

  it("publishes the canonical five-phase composition by reference", () => {
    const { composition, validation } = VisualizationPlatformManifestPlatform;
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
    const { guarantees, compatibility } = VisualizationPlatformManifestPlatform;
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
    const readiness = VisualizationPlatformManifestPlatform
      .readinessDeclarations;
    assert.equal(readiness.length, 7);
    assert.ok(readiness.every((entry, index) => Object.isFrozen(entry)
      && entry.ready && !entry.executes
      && entry.deterministicOrder === index + 1));
  });

  it("preserves every Validation collection by canonical reference", () => {
    const { validation, inventory } = VisualizationPlatformManifestPlatform;
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
    const inventory = VisualizationPlatformManifestInventoryMetadata;
    assert.equal(inventory.counts.phaseCount, inventory.phaseComposition.length);
    assert.equal(inventory.counts.validationCategoryCount,
      inventory.validationCategories.length);
    assert.equal(inventory.counts.validationRuleCount,
      inventory.validationRules.length);
    assert.equal(inventory.counts.guaranteeCount, inventory.guarantees.length);
    assert.equal(inventory.counts.compatibilityCount,
      inventory.compatibility.length);
    assert.equal(inventory.counts.readinessCount, inventory.readiness.length);
    assert.equal(inventory.counts.publicSurfaceCount,
      inventory.publicManifestSurface.length);
    assert.equal(getVisualizationPlatformManifestCount(),
      inventory.phaseComposition.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.recalculatesUpstreamInventories, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Validation as its only upstream phase dependency", () => {
    assert.equal(VisualizationPlatformManifestMetadata.dependency
      .visualizationPlatformValidationOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationPlatformModel/);
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationPlatformRegistry/);
    assert.doesNotMatch(combined,
      /from ["']\.\/visualizationPlatformFoundation/);
    assert.doesNotMatch(combined,
      /from ["']\.\/(?:visualization(?!Platform)|graph|timeline|dashboard|animationEffects)/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("contains no manifest, visualization, or prohibited runtime", () => {
    const metadata = VisualizationPlatformManifestMetadata;
    assert.ok(Object.isFrozen(VisualizationPlatformManifestPlatform));
    assert.equal(metadata.manifestExecution, false);
    assert.equal(metadata.validationExecution, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.visualizationExecution, false);
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
    assert.equal(getVisualizationPlatformManifestSummary().status,
      "ReadyForPlatform");
    const release = getVisualizationPlatformManifestReleaseMetadata();
    assert.equal(release.status, "ReadyForPlatform");
    assert.equal(release.validationReference,
      "EVE-8:4/VisualizationPlatformValidation");
  });
});
