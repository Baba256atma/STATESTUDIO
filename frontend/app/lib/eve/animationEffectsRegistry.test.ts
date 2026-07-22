import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as RegistryExports from "./animationEffectsRegistry.ts";
import {
  AnimationEffectsRegistryIdentityMetadata,
  AnimationEffectsRegistryInventoryMetadata,
  AnimationEffectsRegistryMetadata,
  AnimationEffectsRegistryPlatform,
  AnimationEffectsRegistryReadinessMetadata,
  getAnimationEffectsRegistryCount,
  getAnimationEffectsRegistryReleaseMetadata,
  getAnimationEffectsRegistrySummary,
} from "./animationEffectsRegistry.ts";

const files = Object.freeze([
  "animationEffectsRegistry.test.ts", "animationEffectsRegistry.ts",
  "animationEffectsRegistryCatalog.ts", "animationEffectsRegistryExtensions.ts",
  "animationEffectsRegistryInventory.ts", "animationEffectsRegistryMetadata.ts",
  "animationEffectsRegistryPolicies.ts", "animationEffectsRegistryTypes.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-7:2 Animation & Effects Registry", () => {
  it("creates exactly eight Registry files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(RegistryExports).sort(), [
      "AnimationEffectsRegistryIdentityMetadata",
      "AnimationEffectsRegistryInventoryMetadata",
      "AnimationEffectsRegistryMetadata",
      "AnimationEffectsRegistryPlatform",
      "AnimationEffectsRegistryReadinessMetadata",
      "getAnimationEffectsRegistryCount",
      "getAnimationEffectsRegistryReleaseMetadata",
      "getAnimationEffectsRegistrySummary",
    ].sort());
  });

  it("publishes canonical identity and readiness", () => {
    const identity = AnimationEffectsRegistryIdentityMetadata;
    assert.equal(identity.id, "EVE-7:2/AnimationEffectsRegistry");
    assert.equal(identity.name, "Animation & Effects Registry");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace, "nexora.eve.animation-effects.registry");
    assert.equal(identity.status, "ReadyForModel");
    assert.equal(AnimationEffectsRegistryReadinessMetadata.status,
      "ReadyForModel");
  });

  it("publishes eighteen immutable unique registry entries", () => {
    const { catalog, foundation } = AnimationEffectsRegistryPlatform;
    assert.equal(catalog.length, 18);
    assert.ok(Object.isFrozen(catalog));
    assert.equal(new Set(catalog.map(({ id }) => id)).size, catalog.length);
    assert.equal(new Set(catalog.map(({ canonicalKey }) => canonicalKey)).size,
      catalog.length);
    assert.ok(catalog.every((entry, index) => Object.isFrozen(entry)
      && entry.foundationContractReference === foundation.contracts[index]
      && entry.ownershipReference === foundation.ownership
      && entry.boundaryReference === foundation.boundaries
      && entry.lifecycleApplicability === foundation.lifecycle
      && entry.capabilityApplicability === foundation.capabilities
      && !entry.executable && !entry.deprecated
      && entry.deterministicOrder === index + 1));
  });

  it("publishes eighteen Foundation-derived immutable categories", () => {
    const { categories, catalog, foundation } = AnimationEffectsRegistryPlatform;
    assert.equal(categories.length, 18);
    assert.ok(Object.isFrozen(categories));
    assert.ok(categories.every((category, index) => Object.isFrozen(category)
      && Object.isFrozen(category.entries)
      && category.foundationReference === foundation.contracts[index]
      && category.entries[0] === catalog[index]
      && category.deterministicOrder === index + 1));
  });

  it("publishes ten policies and fourteen extension classifications", () => {
    const { policies, extensions } = AnimationEffectsRegistryPlatform;
    assert.equal(policies.length, 10);
    assert.equal(extensions.length, 14);
    for (const collection of [policies, extensions]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly
        && entry.deterministicOrder === index + 1));
    }
  });

  it("preserves every Foundation collection by canonical reference", () => {
    const { inventory, foundation } = AnimationEffectsRegistryPlatform;
    assert.equal(inventory.foundationContracts, foundation.contracts);
    assert.equal(inventory.foundationOwnership, foundation.ownership);
    assert.equal(inventory.foundationBoundaries, foundation.boundaries);
    assert.equal(inventory.foundationLifecycle, foundation.lifecycle);
    assert.equal(inventory.foundationCapabilities, foundation.capabilities);
    assert.equal(inventory.foundationIdentity, foundation.identity);
    assert.equal(inventory.foundationInventory, foundation.inventory);
  });

  it("derives every inventory count dynamically", () => {
    const inventory = AnimationEffectsRegistryInventoryMetadata;
    assert.equal(inventory.counts.catalogEntryCount, inventory.catalog.length);
    assert.equal(inventory.counts.categoryCount, inventory.categories.length);
    assert.equal(inventory.counts.extensionClassificationCount,
      inventory.extensions.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(getAnimationEffectsRegistryCount(), inventory.catalog.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsFoundationCollections, false);
  });

  it("uses Animation Effects Foundation as its only phase dependency", () => {
    assert.equal(AnimationEffectsRegistryMetadata.dependency
      .animationEffectsFoundationOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/sceneRendering/);
    assert.doesNotMatch(combined, /from ["']\.\/visualization/);
    assert.doesNotMatch(combined, /from ["']\.\/director/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("is immutable metadata with no animation or rendering runtime", () => {
    const metadata = AnimationEffectsRegistryMetadata;
    assert.ok(Object.isFrozen(AnimationEffectsRegistryPlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.animationEngine, false);
    assert.equal(metadata.animationScheduler, false);
    assert.equal(metadata.transitionExecution, false);
    assert.equal(metadata.timingExecution, false);
    assert.equal(metadata.easingCalculation, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.frameGeneration, false);
    assert.equal(metadata.gpuExecution, false);
    assert.equal(metadata.physicsEngine, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined,
      /from ["'](?:react|next|three|babylonjs|pixi\.js|d3|zod)/i);
    assert.doesNotMatch(combined,
      /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getAnimationEffectsRegistrySummary().status, "ReadyForModel");
    const release = getAnimationEffectsRegistryReleaseMetadata();
    assert.equal(release.status, "ReadyForModel");
    assert.equal(release.foundationReference,
      "EVE-7:1/AnimationEffectsFoundation");
  });
});
