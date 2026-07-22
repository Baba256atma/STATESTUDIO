import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ManifestExports from "./animationEffectsManifest.ts";
import {
  AnimationEffectsManifestIdentityMetadata,
  AnimationEffectsManifestInventoryMetadata,
  AnimationEffectsManifestMetadata,
  AnimationEffectsManifestPlatform,
  AnimationEffectsManifestReadinessMetadata,
  getAnimationEffectsManifestCount,
  getAnimationEffectsManifestReleaseMetadata,
  getAnimationEffectsManifestSummary,
} from "./animationEffectsManifest.ts";

const files = Object.freeze([
  "animationEffectsManifest.test.ts", "animationEffectsManifest.ts",
  "animationEffectsManifestCompatibility.ts",
  "animationEffectsManifestGuarantees.ts", "animationEffectsManifestInventory.ts",
  "animationEffectsManifestMetadata.ts", "animationEffectsManifestReadiness.ts",
  "animationEffectsManifestTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-7:5 Animation & Effects Manifest", () => {
  it("creates exactly eight Manifest files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ManifestExports).sort(), [
      "AnimationEffectsManifestIdentityMetadata",
      "AnimationEffectsManifestInventoryMetadata", "AnimationEffectsManifestMetadata",
      "AnimationEffectsManifestPlatform", "AnimationEffectsManifestReadinessMetadata",
      "getAnimationEffectsManifestCount", "getAnimationEffectsManifestReleaseMetadata",
      "getAnimationEffectsManifestSummary",
    ].sort());
  });

  it("publishes canonical identity and readiness", () => {
    assert.equal(AnimationEffectsManifestIdentityMetadata.id,
      "EVE-7:5/AnimationEffectsManifest");
    assert.equal(AnimationEffectsManifestIdentityMetadata.namespace,
      "nexora.eve.animation-effects.manifest");
    assert.equal(AnimationEffectsManifestReadinessMetadata.status,
      "ReadyForPlatform");
  });

  it("publishes the canonical five-phase composition by reference", () => {
    const { composition, validation } = AnimationEffectsManifestPlatform;
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
    const { guarantees, compatibility } = AnimationEffectsManifestPlatform;
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
    const readiness = AnimationEffectsManifestPlatform.readinessDeclarations;
    assert.equal(readiness.length, 7);
    assert.ok(readiness.every((entry, index) => Object.isFrozen(entry)
      && entry.ready && !entry.executes
      && entry.deterministicOrder === index + 1));
  });

  it("preserves every Validation collection by canonical reference", () => {
    const { validation, inventory } = AnimationEffectsManifestPlatform;
    assert.equal(inventory.validationInventory, validation.inventory);
    assert.equal(inventory.validationCategories, validation.categories);
    assert.equal(inventory.validationRules, validation.rules);
    assert.equal(inventory.validationGates, validation.gates);
    assert.equal(inventory.validationDiagnostics, validation.diagnostics);
    assert.equal(inventory.validationSeverityLevels, validation.severityLevels);
    assert.equal(inventory.validationOutcomes, validation.outcomes);
    assert.equal(inventory.validationFailureClassifications,
      validation.failureClassifications);
    assert.equal(inventory.validationRecommendationClassifications,
      validation.recommendationClassifications);
    assert.equal(inventory.validationPolicies, validation.policies);
    assert.equal(inventory.validationReadinessDeclarations,
      validation.readinessDeclarations);
  });

  it("derives all Manifest inventory counts dynamically", () => {
    const inventory = AnimationEffectsManifestInventoryMetadata;
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
    assert.equal(getAnimationEffectsManifestCount(),
      inventory.phaseComposition.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Validation as its only upstream phase dependency", () => {
    assert.equal(AnimationEffectsManifestMetadata.dependency
      .animationEffectsValidationOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsModel/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsRegistry/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/sceneRendering/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("contains no manifest, animation, rendering, or prohibited runtime", () => {
    const metadata = AnimationEffectsManifestMetadata;
    assert.ok(Object.isFrozen(AnimationEffectsManifestPlatform));
    assert.equal(metadata.manifestExecution, false);
    assert.equal(metadata.validationExecution, false);
    assert.equal(metadata.animationEngine, false);
    assert.equal(metadata.animationScheduler, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.physicsSimulation, false);
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
    assert.equal(getAnimationEffectsManifestSummary().status,
      "ReadyForPlatform");
    const release = getAnimationEffectsManifestReleaseMetadata();
    assert.equal(release.status, "ReadyForPlatform");
    assert.equal(release.validationReference,
      "EVE-7:4/AnimationEffectsValidation");
  });
});
