import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PlatformExports from "./animationEffectsPlatform.ts";
import {
  AnimationEffectsPlatform,
  AnimationEffectsPlatformIdentityMetadata,
  AnimationEffectsPlatformInventoryMetadata,
  AnimationEffectsPlatformMetadata,
  AnimationEffectsPlatformReadinessMetadata,
  getAnimationEffectsPlatformCount,
  getAnimationEffectsPlatformReleaseMetadata,
  getAnimationEffectsPlatformSummary,
} from "./animationEffectsPlatform.ts";

const files = Object.freeze([
  "animationEffectsPlatform.test.ts", "animationEffectsPlatform.ts",
  "animationEffectsPlatformCapabilities.ts",
  "animationEffectsPlatformCompatibility.ts",
  "animationEffectsPlatformGuarantees.ts", "animationEffectsPlatformInventory.ts",
  "animationEffectsPlatformMetadata.ts", "animationEffectsPlatformTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-7:6 Animation & Effects Platform", () => {
  it("creates exactly eight Platform files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(PlatformExports).sort(), [
      "AnimationEffectsPlatform", "AnimationEffectsPlatformIdentityMetadata",
      "AnimationEffectsPlatformInventoryMetadata", "AnimationEffectsPlatformMetadata",
      "AnimationEffectsPlatformReadinessMetadata", "getAnimationEffectsPlatformCount",
      "getAnimationEffectsPlatformReleaseMetadata",
      "getAnimationEffectsPlatformSummary",
    ].sort());
  });

  it("publishes canonical identity and readiness", () => {
    assert.equal(AnimationEffectsPlatformIdentityMetadata.id,
      "EVE-7:6/AnimationEffectsPlatform");
    assert.equal(AnimationEffectsPlatformIdentityMetadata.namespace,
      "nexora.eve.animation-effects.platform");
    assert.equal(AnimationEffectsPlatformReadinessMetadata.status,
      "ReadyForCertification");
  });

  it("publishes canonical six-phase composition through Manifest", () => {
    const { composition, manifest } = AnimationEffectsPlatform;
    assert.equal(composition.length, 6);
    assert.deepEqual(composition.map(({ phase }) => phase), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
    ]);
    manifest.composition.forEach((entry, index) =>
      assert.equal(composition[index], entry));
    assert.equal(composition[5]!.canonicalReference,
      "EVE-7:6/AnimationEffectsPlatform");
    assert.ok(composition.every((entry, index) => Object.isFrozen(entry)
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
  });

  it("publishes exact immutable capabilities, guarantees, and compatibility", () => {
    const { capabilities, guarantees, compatibility } = AnimationEffectsPlatform;
    assert.equal(capabilities.length, 10);
    assert.equal(guarantees.length, 12);
    assert.equal(compatibility.length, 8);
    for (const collection of [capabilities, guarantees, compatibility]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly
        && entry.deterministicOrder === index + 1));
    }
    assert.ok(capabilities.every(({ implementationProvided }) =>
      !implementationProvided));
    assert.ok(guarantees.every(({ guaranteed }) => guaranteed));
    assert.ok(compatibility.every(({ compatible, runtimeVerification }) =>
      compatible && !runtimeVerification));
  });

  it("preserves every Manifest collection by canonical reference", () => {
    const { manifest, inventory } = AnimationEffectsPlatform;
    assert.equal(inventory.manifestInventory, manifest.inventory);
    assert.equal(inventory.manifestComposition, manifest.composition);
    assert.equal(inventory.manifestGuarantees, manifest.guarantees);
    assert.equal(inventory.manifestCompatibility, manifest.compatibility);
    assert.equal(inventory.manifestReadiness, manifest.readiness);
    assert.equal(inventory.manifestReadinessDeclarations,
      manifest.readinessDeclarations);
    assert.equal(inventory.manifestMetadata, manifest.metadata);
    assert.equal(inventory.validationInventory,
      manifest.inventory.validationInventory);
  });

  it("derives all Platform inventory counts dynamically", () => {
    const inventory = AnimationEffectsPlatformInventoryMetadata;
    assert.equal(inventory.counts.phaseCount, inventory.phaseComposition.length);
    assert.equal(inventory.counts.capabilityCount, inventory.capabilities.length);
    assert.equal(inventory.counts.guaranteeCount, inventory.guarantees.length);
    assert.equal(inventory.counts.compatibilityCount,
      inventory.compatibility.length);
    assert.equal(inventory.counts.publicSurfaceCount,
      inventory.publicPlatformSurface.length);
    assert.equal(getAnimationEffectsPlatformCount(),
      inventory.phaseComposition.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Manifest as its only upstream phase dependency", () => {
    assert.equal(AnimationEffectsPlatformMetadata.dependency
      .animationEffectsManifestOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsValidation/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsModel/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsRegistry/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/sceneRendering/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("contains no platform, animation, rendering, or prohibited runtime", () => {
    const metadata = AnimationEffectsPlatformMetadata;
    assert.ok(Object.isFrozen(AnimationEffectsPlatform));
    assert.equal(metadata.platformExecution, false);
    assert.equal(metadata.animationEngine, false);
    assert.equal(metadata.animationScheduler, false);
    assert.equal(metadata.validationExecution, false);
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
    assert.equal(getAnimationEffectsPlatformSummary().status,
      "ReadyForCertification");
    const release = getAnimationEffectsPlatformReleaseMetadata();
    assert.equal(release.status, "ReadyForCertification");
    assert.equal(release.manifestReference, "EVE-7:5/AnimationEffectsManifest");
  });
});
