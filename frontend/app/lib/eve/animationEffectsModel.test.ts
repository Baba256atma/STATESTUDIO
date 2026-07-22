import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as ModelExports from "./animationEffectsModel.ts";
import {
  AnimationEffectsModelIdentityMetadata,
  AnimationEffectsModelMetadata,
  AnimationEffectsModelPlatform,
  AnimationEffectsModelReadinessMetadata,
  getAnimationEffectsModelCount,
  getAnimationEffectsModelReleaseMetadata,
  getAnimationEffectsModelSummary,
} from "./animationEffectsModel.ts";

const files = Object.freeze([
  "animationEffectsModel.test.ts", "animationEffectsModel.ts",
  "animationEffectsModelDescriptors.ts", "animationEffectsModelInventory.ts",
  "animationEffectsModelMetadata.ts", "animationEffectsModelPolicies.ts",
  "animationEffectsModelRelationships.ts", "animationEffectsModelTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-7:3 Animation & Effects Model", () => {
  it("creates exactly eight Model files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(ModelExports).sort(), [
      "AnimationEffectsModelIdentityMetadata",
      "AnimationEffectsModelInventoryMetadata", "AnimationEffectsModelMetadata",
      "AnimationEffectsModelPlatform", "AnimationEffectsModelReadinessMetadata",
      "getAnimationEffectsModelCount", "getAnimationEffectsModelReleaseMetadata",
      "getAnimationEffectsModelSummary",
    ].sort());
  });

  it("publishes canonical identity and readiness", () => {
    assert.equal(AnimationEffectsModelIdentityMetadata.id,
      "EVE-7:3/AnimationEffectsModel");
    assert.equal(AnimationEffectsModelIdentityMetadata.name,
      "Animation & Effects Model");
    assert.equal(AnimationEffectsModelIdentityMetadata.namespace,
      "nexora.eve.animation-effects.model");
    assert.equal(AnimationEffectsModelReadinessMetadata.status,
      "ReadyForValidation");
  });

  it("publishes eighteen unique immutable typed descriptors", () => {
    const { descriptors, registry } = AnimationEffectsModelPlatform;
    assert.equal(descriptors.length, 18);
    assert.equal(new Set(descriptors.map(({ id }) => id)).size, descriptors.length);
    descriptors.forEach((descriptor, index) => {
      assert.ok(Object.isFrozen(descriptor));
      assert.ok(Object.isFrozen(descriptor.structuralMetadata));
      assert.equal(descriptor.registryReference, registry.catalog[index]);
      assert.equal(descriptor.categoryReference, registry.categories[index]);
      assert.equal(descriptor.deterministicOrder, index + 1);
      assert.equal(descriptor.executableBehavior, false);
    });
  });

  it("publishes all fifteen immutable canonical relationships", () => {
    const { relationships } = AnimationEffectsModelPlatform;
    assert.equal(relationships.length, 15);
    assert.equal(new Set(relationships.map(({ id }) => id)).size,
      relationships.length);
    assert.ok(relationships.every((relationship, index) =>
      Object.isFrozen(relationship)
      && relationship.deterministicOrder === index + 1
      && !relationship.traversalProvided && !relationship.resolutionProvided
      && !relationship.executionProvided));
  });

  it("publishes exactly ten immutable descriptive policies", () => {
    const { policies } = AnimationEffectsModelPlatform;
    assert.equal(policies.length, 10);
    assert.ok(policies.every((policy, index) => Object.isFrozen(policy)
      && policy.deterministicOrder === index + 1 && !policy.runtimeChecks));
  });

  it("preserves and derives canonical Registry collections by reference", () => {
    const { inventory, registry } = AnimationEffectsModelPlatform;
    assert.equal(inventory.registryCatalog, registry.catalog);
    assert.equal(inventory.registryCategories, registry.categories);
    assert.equal(inventory.registryInventory, registry.inventory);
    assert.equal(inventory.registryPolicies, registry.policies);
    assert.equal(inventory.registryExtensions, registry.extensions);
    assert.equal(inventory.registryFoundationReference, registry.foundation);
    assert.equal(inventory.counts.modelCount, inventory.models.length);
    assert.equal(inventory.counts.relationshipCount, inventory.relationships.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(getAnimationEffectsModelCount(), inventory.models.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsRegistryCollections, false);
  });

  it("uses Registry as its only upstream phase dependency", () => {
    assert.equal(AnimationEffectsModelMetadata.dependency
      .animationEffectsRegistryOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/sceneRendering/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("contains no runtime or prohibited facilities", () => {
    const metadata = AnimationEffectsModelMetadata;
    assert.ok(Object.isFrozen(AnimationEffectsModelPlatform));
    assert.equal(metadata.animationEngine, false);
    assert.equal(metadata.animationScheduler, false);
    assert.equal(metadata.transitionExecution, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.physicsSimulation, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.runtimeExecution, false);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined,
      /from ["'](?:react|next|three|babylon|pixi|d3|chart\.js)/i);
    assert.doesNotMatch(combined,
      /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getAnimationEffectsModelSummary().status, "ReadyForValidation");
    const release = getAnimationEffectsModelReleaseMetadata();
    assert.equal(release.status, "ReadyForValidation");
    assert.equal(release.registryReference,
      "EVE-7:2/AnimationEffectsRegistry");
  });
});
