import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as FreezeExports from "./animationEffectsFreeze.ts";
import {
  AnimationEffectsFreezeIdentityMetadata,
  AnimationEffectsFreezeInventoryMetadata,
  AnimationEffectsFreezeMetadata,
  AnimationEffectsFreezePlatform,
  AnimationEffectsFreezeReadinessMetadata,
  getAnimationEffectsFreezeCount,
  getAnimationEffectsFreezeReleaseMetadata,
  getAnimationEffectsFreezeSummary,
} from "./animationEffectsFreeze.ts";

const files = Object.freeze([
  "animationEffectsFreeze.test.ts", "animationEffectsFreeze.ts",
  "animationEffectsFreezeBaselines.ts", "animationEffectsFreezeCompatibility.ts",
  "animationEffectsFreezeExtensions.ts", "animationEffectsFreezeLocks.ts",
  "animationEffectsFreezeRegistry.ts", "animationEffectsFreezeTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-7:8 Animation & Effects Freeze", () => {
  it("creates exactly eight Freeze files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(FreezeExports).sort(), [
      "AnimationEffectsFreezeIdentityMetadata",
      "AnimationEffectsFreezeInventoryMetadata", "AnimationEffectsFreezeMetadata",
      "AnimationEffectsFreezePlatform", "AnimationEffectsFreezeReadinessMetadata",
      "getAnimationEffectsFreezeCount", "getAnimationEffectsFreezeReleaseMetadata",
      "getAnimationEffectsFreezeSummary",
    ].sort());
  });

  it("publishes canonical frozen identity, lock, and readiness", () => {
    assert.equal(AnimationEffectsFreezeIdentityMetadata.id,
      "EVE-7:8/AnimationEffectsFreeze");
    assert.equal(AnimationEffectsFreezeIdentityMetadata.namespace,
      "nexora.eve.animation-effects.freeze");
    assert.equal(AnimationEffectsFreezeIdentityMetadata.status, "Frozen");
    assert.equal(AnimationEffectsFreezeReadinessMetadata.readiness,
      "ReadyForPublicIndex");
    assert.equal(AnimationEffectsFreezeMetadata.lockId,
      "EVE-7-ANIMATION-EFFECTS-LOCKED");
  });

  it("publishes twelve immutable architectural locks", () => {
    const locks = AnimationEffectsFreezePlatform.locks;
    assert.equal(locks.length, 12);
    assert.ok(locks.every((lock, index) => Object.isFrozen(lock)
      && lock.status === "Locked" && !lock.runtimeLocking
      && lock.lockIdentifier === "EVE-7-ANIMATION-EFFECTS-LOCKED"
      && lock.deterministicOrder === index + 1));
  });

  it("publishes eight immutable baselines, compatibility, and extensions", () => {
    const { baselines, compatibility, extensions } = AnimationEffectsFreezePlatform;
    assert.equal(baselines.length, 8);
    assert.equal(compatibility.length, 8);
    assert.equal(extensions.length, 8);
    for (const collection of [baselines, compatibility, extensions]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.preservedByReference && entry.metadataOnly && entry.immutable
        && entry.deterministicOrder === index + 1));
    }
  });

  it("publishes the canonical seven-phase frozen registry", () => {
    const { registry, certification } = AnimationEffectsFreezePlatform;
    assert.equal(registry.length, 7);
    assert.deepEqual(registry.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
      "Certification",
    ]);
    assert.ok(registry.every((entry, index) => Object.isFrozen(entry)
      && entry.certificationReference === certification.metadata.id
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
  });

  it("preserves every Certification collection by canonical reference", () => {
    const { certification, inventory } = AnimationEffectsFreezePlatform;
    assert.equal(inventory.certificationInventory, certification.inventory);
    assert.equal(inventory.certificationCriteria, certification.criteria);
    assert.equal(inventory.certificationGates, certification.gates);
    assert.equal(inventory.certificationCompatibility, certification.compatibility);
    assert.equal(inventory.certificationMetadata, certification.metadata);
    assert.equal(inventory.certificationReadiness, certification.readiness);
  });

  it("derives all Freeze inventory counts dynamically", () => {
    const inventory = AnimationEffectsFreezeInventoryMetadata;
    assert.equal(inventory.counts.lockCount, inventory.locks.length);
    assert.equal(inventory.counts.baselineCount, inventory.baselines.length);
    assert.equal(inventory.counts.registryEntryCount, inventory.registry.length);
    assert.equal(inventory.counts.compatibilityCount,
      inventory.compatibility.length);
    assert.equal(inventory.counts.extensionCount, inventory.extensions.length);
    assert.equal(inventory.counts.publicSurfaceCount,
      inventory.publicFreezeSurface.length);
    assert.equal(getAnimationEffectsFreezeCount(), inventory.locks.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Certification as its only upstream phase dependency", () => {
    assert.equal(AnimationEffectsFreezeMetadata.dependency
      .animationEffectsCertificationOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsPlatform/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsManifest/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsValidation/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsModel/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsRegistry/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/sceneRendering/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("contains no freezing, animation, rendering, or prohibited runtime", () => {
    const metadata = AnimationEffectsFreezeMetadata;
    assert.ok(Object.isFrozen(AnimationEffectsFreezePlatform));
    assert.equal(metadata.freezeEngine, false);
    assert.equal(metadata.runtimeLocking, false);
    assert.equal(metadata.runtimeFreezeManagement, false);
    assert.equal(metadata.certificationExecution, false);
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
      /from ["'](?:react|next|three|babylon|pixi|d3|chart\.js|zod)/i);
    assert.doesNotMatch(combined,
      /\b(?:fetch|XMLHttpRequest|WebSocket|document|window)\s*[.(]/);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getAnimationEffectsFreezeSummary().status, "Frozen");
    const release = getAnimationEffectsFreezeReleaseMetadata();
    assert.equal(release.status, "Frozen");
    assert.equal(release.readiness, "ReadyForPublicIndex");
    assert.equal(release.lockId, "EVE-7-ANIMATION-EFFECTS-LOCKED");
    assert.equal(release.certificationReference,
      "EVE-7:7/AnimationEffectsCertification");
  });
});
