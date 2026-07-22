import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as FoundationExports from "./animationEffectsFoundation.ts";
import {
  AnimationEffectsFoundationIdentityMetadata,
  AnimationEffectsFoundationInventoryMetadata,
  AnimationEffectsFoundationMetadata,
  AnimationEffectsFoundationPlatform,
  AnimationEffectsFoundationReadinessMetadata,
  getAnimationEffectsFoundationCount,
  getAnimationEffectsFoundationReleaseMetadata,
  getAnimationEffectsFoundationSummary,
} from "./animationEffectsFoundation.ts";

const files = Object.freeze([
  "animationEffectsBoundaries.ts", "animationEffectsCapabilities.ts",
  "animationEffectsContracts.ts", "animationEffectsFoundation.test.ts",
  "animationEffectsFoundation.ts", "animationEffectsFoundationTypes.ts",
  "animationEffectsLifecycle.ts", "animationEffectsOwnership.ts",
]);

const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-7:1 Animation & Effects Foundation", () => {
  it("creates exactly eight Foundation files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(FoundationExports).sort(), [
      "AnimationEffectsFoundationIdentityMetadata",
      "AnimationEffectsFoundationInventoryMetadata",
      "AnimationEffectsFoundationMetadata",
      "AnimationEffectsFoundationPlatform",
      "AnimationEffectsFoundationReadinessMetadata",
      "getAnimationEffectsFoundationCount",
      "getAnimationEffectsFoundationReleaseMetadata",
      "getAnimationEffectsFoundationSummary",
    ].sort());
  });

  it("publishes canonical identity and readiness", () => {
    const identity = AnimationEffectsFoundationIdentityMetadata;
    assert.equal(identity.id, "EVE-7:1/AnimationEffectsFoundation");
    assert.equal(identity.name, "Animation & Effects Foundation");
    assert.equal(identity.version, "1.0.0");
    assert.equal(identity.namespace, "nexora.eve.animation-effects.foundation");
    assert.equal(identity.status, "ReadyForRegistry");
    assert.equal(AnimationEffectsFoundationReadinessMetadata.status,
      "ReadyForRegistry");
  });

  it("preserves the canonical Scene Rendering Public Index", () => {
    const platform = AnimationEffectsFoundationPlatform;
    assert.equal(platform.upstreamPublicIndex.metadata.identity.id,
      "EVE-2:9/SceneRenderingPublicIndex");
    assert.equal(platform.metadata.upstreamPublicIndex,
      platform.upstreamPublicIndex);
    assert.equal(platform.upstreamPublicIndex.metadata.release, "Released");
    assert.equal(platform.upstreamPublicIndex.metadata.certification, "Certified");
    assert.equal(platform.upstreamPublicIndex.metadata.freeze, "Frozen");
    assert.equal(platform.upstreamPublicIndex.metadata.readiness,
      "ReadyForConsumer");
  });

  it("publishes twenty-two immutable architectural contracts", () => {
    const { contracts } = AnimationEffectsFoundationPlatform;
    assert.equal(contracts.length, 22);
    assert.ok(Object.isFrozen(contracts));
    assert.equal(new Set(contracts.map(({ id }) => id)).size, contracts.length);
    assert.ok(contracts.every((contract, index) => Object.isFrozen(contract)
      && Object.isFrozen(contract.structuralMetadata)
      && contract.ownership === AnimationEffectsFoundationPlatform.ownership
      && contract.lifecycle === AnimationEffectsFoundationPlatform.lifecycle
      && !contract.executableBehavior
      && contract.deterministicOrder === index + 1));
  });

  it("publishes immutable lifecycle, boundaries, capabilities, and ownership", () => {
    const platform = AnimationEffectsFoundationPlatform;
    assert.equal(platform.lifecycle.length, 5);
    assert.deepEqual(platform.lifecycle.map(({ name }) => name), [
      "Declared", "Registered", "Modeled", "Certified", "Frozen",
    ]);
    assert.equal(platform.boundaries.length, 12);
    assert.equal(platform.capabilities.length, 14);
    for (const collection of [platform.lifecycle, platform.boundaries,
      platform.capabilities]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly
        && entry.deterministicOrder === index + 1));
    }
    assert.ok(Object.isFrozen(platform.ownership));
    assert.ok(Object.isFrozen(platform.ownership.owns));
    assert.ok(Object.isFrozen(platform.ownership.excludes));
  });

  it("derives every inventory count from canonical collections", () => {
    const platform = AnimationEffectsFoundationPlatform;
    const inventory = AnimationEffectsFoundationInventoryMetadata;
    assert.equal(inventory.contractCount, platform.contracts.length);
    assert.equal(inventory.boundaryCount, platform.boundaries.length);
    assert.equal(inventory.lifecycleStateCount, platform.lifecycle.length);
    assert.equal(inventory.capabilityCount, platform.capabilities.length);
    assert.equal(getAnimationEffectsFoundationCount(), platform.contracts.length);
    assert.equal(inventory.canonicalInventoryRule.hardcodedAggregateTotals, false);
    assert.equal(inventory.canonicalInventoryRule
      .reconstructsSceneRenderingArchitecture, false);
  });

  it("uses Scene Rendering Public Index as its only phase dependency", () => {
    assert.equal(AnimationEffectsFoundationMetadata.dependency
      .sceneRenderingPublicIndexOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined,
      /from ["']\.\/sceneRendering(?:Freeze|Certification|Platform|Manifest|Validation|Model|Registry|Foundation)/);
    assert.doesNotMatch(combined, /from ["']\.\/visualization/);
    assert.doesNotMatch(combined, /from ["']\.\/director/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("is immutable metadata with no animation or rendering runtime", () => {
    const metadata = AnimationEffectsFoundationMetadata;
    assert.ok(Object.isFrozen(AnimationEffectsFoundationPlatform));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.animationEngine, false);
    assert.equal(metadata.animationScheduler, false);
    assert.equal(metadata.frameGeneration, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.timingCalculation, false);
    assert.equal(metadata.easingCalculation, false);
    assert.equal(metadata.physicsEngine, false);
    assert.equal(metadata.timelinePlayback, false);
    assert.equal(metadata.gpuExecution, false);
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
    assert.equal(getAnimationEffectsFoundationSummary().status,
      "ReadyForRegistry");
    const release = getAnimationEffectsFoundationReleaseMetadata();
    assert.equal(release.status, "ReadyForRegistry");
    assert.equal(release.upstreamPublicIndexReference,
      "EVE-2:9/SceneRenderingPublicIndex");
  });
});
