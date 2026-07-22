import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ValidationExports from "./animationEffectsValidation.ts";
import {
  AnimationEffectsValidationIdentityMetadata,
  AnimationEffectsValidationInventoryMetadata,
  AnimationEffectsValidationMetadata,
  AnimationEffectsValidationPlatform,
  AnimationEffectsValidationReadinessMetadata,
  getAnimationEffectsValidationCount,
  getAnimationEffectsValidationReleaseMetadata,
  getAnimationEffectsValidationSummary,
} from "./animationEffectsValidation.ts";

const files = Object.freeze([
  "animationEffectsValidation.test.ts", "animationEffectsValidation.ts",
  "animationEffectsValidationDiagnostics.ts",
  "animationEffectsValidationInventory.ts",
  "animationEffectsValidationMetadata.ts", "animationEffectsValidationPolicies.ts",
  "animationEffectsValidationRules.ts", "animationEffectsValidationTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-7:4 Animation & Effects Validation", () => {
  it("creates exactly eight Validation files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ValidationExports).sort(), [
      "AnimationEffectsValidationIdentityMetadata",
      "AnimationEffectsValidationInventoryMetadata",
      "AnimationEffectsValidationMetadata", "AnimationEffectsValidationPlatform",
      "AnimationEffectsValidationReadinessMetadata",
      "getAnimationEffectsValidationCount",
      "getAnimationEffectsValidationReleaseMetadata",
      "getAnimationEffectsValidationSummary",
    ].sort());
  });

  it("publishes canonical identity and readiness", () => {
    assert.equal(AnimationEffectsValidationIdentityMetadata.id,
      "EVE-7:4/AnimationEffectsValidation");
    assert.equal(AnimationEffectsValidationIdentityMetadata.namespace,
      "nexora.eve.animation-effects.validation");
    assert.equal(AnimationEffectsValidationReadinessMetadata.status,
      "ReadyForManifest");
  });

  it("publishes fourteen immutable paired categories and rules", () => {
    const { categories, rules, model } = AnimationEffectsValidationPlatform;
    assert.equal(categories.length, 14);
    assert.equal(rules.length, 14);
    rules.forEach((rule, index) => {
      assert.ok(Object.isFrozen(rule));
      assert.equal(rule.categoryReference, categories[index]);
      assert.equal(rule.modelReference, model.metadata.id);
      assert.equal(rule.deterministicOrder, index + 1);
      assert.equal(rule.executes, false);
    });
  });

  it("publishes twelve gates, ten policies, and immutable diagnostics", () => {
    const platform = AnimationEffectsValidationPlatform;
    assert.equal(platform.gates.length, 12);
    assert.equal(platform.policies.length, 10);
    for (const entries of [platform.gates, platform.policies,
      platform.diagnostics, platform.failureClassifications,
      platform.recommendationClassifications]) {
      assert.ok(Object.isFrozen(entries));
      assert.ok(entries.every((entry, index) => Object.isFrozen(entry)
        && entry.metadataOnly && entry.immutable
        && entry.deterministicOrder === index + 1));
    }
    assert.ok(platform.gates.every((gate) => gate.outcome === "Passed"
      && !gate.executes));
  });

  it("preserves every Model collection by canonical reference", () => {
    const { model, inventory } = AnimationEffectsValidationPlatform;
    assert.equal(inventory.modelDescriptors, model.descriptors);
    assert.equal(inventory.modelRelationships, model.relationships);
    assert.equal(inventory.modelPolicies, model.policies);
    assert.equal(inventory.modelMetadata, model.metadata);
    assert.equal(inventory.modelInventory, model.inventory);
    assert.equal(inventory.modelIdentity, model.identity);
    assert.equal(inventory.modelRegistryReference, model.registry);
  });

  it("derives every inventory count dynamically", () => {
    const inventory = AnimationEffectsValidationInventoryMetadata;
    assert.equal(inventory.counts.categoryCount, inventory.categories.length);
    assert.equal(inventory.counts.ruleCount, inventory.rules.length);
    assert.equal(inventory.counts.gateCount, inventory.gates.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(inventory.counts.diagnosticCount, inventory.diagnostics.length);
    assert.equal(getAnimationEffectsValidationCount(), inventory.rules.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsModelCollections, false);
  });

  it("uses Model as its only upstream phase dependency", () => {
    assert.equal(AnimationEffectsValidationMetadata.dependency
      .animationEffectsModelOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsRegistry/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/sceneRendering/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("contains no validation, animation, rendering, or prohibited runtime", () => {
    const metadata = AnimationEffectsValidationMetadata;
    assert.ok(Object.isFrozen(AnimationEffectsValidationPlatform));
    assert.equal(metadata.validationEngine, false);
    assert.equal(metadata.runtimeValidation, false);
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
      /from ["'](?:react|next|three|babylon|pixi|d3|chart\.js|zod)/i);
    assert.doesNotMatch(combined,
      /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getAnimationEffectsValidationSummary().status,
      "ReadyForManifest");
    const release = getAnimationEffectsValidationReleaseMetadata();
    assert.equal(release.status, "ReadyForManifest");
    assert.equal(release.modelReference, "EVE-7:3/AnimationEffectsModel");
  });
});
