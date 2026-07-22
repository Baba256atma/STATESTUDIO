import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as CertificationExports from "./animationEffectsCertification.ts";
import {
  AnimationEffectsCertificationIdentityMetadata,
  AnimationEffectsCertificationInventoryMetadata,
  AnimationEffectsCertificationMetadata,
  AnimationEffectsCertificationPlatform,
  AnimationEffectsCertificationReadinessMetadata,
  getAnimationEffectsCertificationCount,
  getAnimationEffectsCertificationReleaseMetadata,
  getAnimationEffectsCertificationSummary,
} from "./animationEffectsCertification.ts";

const files = Object.freeze([
  "animationEffectsCertification.test.ts", "animationEffectsCertification.ts",
  "animationEffectsCertificationCompatibility.ts",
  "animationEffectsCertificationCriteria.ts",
  "animationEffectsCertificationGates.ts",
  "animationEffectsCertificationInventory.ts",
  "animationEffectsCertificationMetadata.ts",
  "animationEffectsCertificationTypes.ts",
]);
const sources = files.filter((name) => !name.endsWith(".test.ts"))
  .map((name) => readFileSync(new URL(name, import.meta.url), "utf8"));

describe("EVE-7:7 Animation & Effects Certification", () => {
  it("creates exactly eight Certification files and eight public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      files.includes(name));
    assert.deepEqual(actual.sort(), [...files].sort());
    assert.deepEqual(Object.keys(CertificationExports).sort(), [
      "AnimationEffectsCertificationIdentityMetadata",
      "AnimationEffectsCertificationInventoryMetadata",
      "AnimationEffectsCertificationMetadata",
      "AnimationEffectsCertificationPlatform",
      "AnimationEffectsCertificationReadinessMetadata",
      "getAnimationEffectsCertificationCount",
      "getAnimationEffectsCertificationReleaseMetadata",
      "getAnimationEffectsCertificationSummary",
    ].sort());
  });

  it("publishes canonical certified identity and Freeze readiness", () => {
    assert.equal(AnimationEffectsCertificationIdentityMetadata.id,
      "EVE-7:7/AnimationEffectsCertification");
    assert.equal(AnimationEffectsCertificationIdentityMetadata.namespace,
      "nexora.eve.animation-effects.certification");
    assert.equal(AnimationEffectsCertificationIdentityMetadata.status, "Certified");
    assert.equal(AnimationEffectsCertificationReadinessMetadata.readiness,
      "ReadyForFreeze");
  });

  it("publishes sixteen immutable certification criteria", () => {
    const { criteria, platform } = AnimationEffectsCertificationPlatform;
    assert.equal(criteria.length, 16);
    assert.ok(criteria.every((criterion, index) => Object.isFrozen(criterion)
      && criterion.status === "Certified"
      && criterion.verification === "DeclarativeOnly"
      && criterion.platformReference === platform.metadata.id
      && criterion.deterministicOrder === index + 1));
  });

  it("publishes twelve passed gates and eight compatibility records", () => {
    const { gates, compatibility } = AnimationEffectsCertificationPlatform;
    assert.equal(gates.length, 12);
    assert.equal(compatibility.length, 8);
    for (const collection of [gates, compatibility]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.immutable && entry.metadataOnly
        && entry.deterministicOrder === index + 1));
    }
    assert.ok(gates.every(({ outcome, executes }) =>
      outcome === "Passed" && !executes));
    assert.ok(compatibility.every(({ verified, runtimeVerification }) =>
      verified && !runtimeVerification));
  });

  it("publishes complete immutable certification results", () => {
    const results = AnimationEffectsCertificationMetadata.results;
    assert.ok(Object.isFrozen(results));
    assert.equal(results.outcome, "Passed");
    assert.equal(results.status, "Certified");
    assert.equal(results.readiness, "ReadyForFreeze");
    assert.equal(results.verificationComplete, true);
  });

  it("preserves every Platform collection by canonical reference", () => {
    const { platform, inventory } = AnimationEffectsCertificationPlatform;
    assert.equal(inventory.platformInventory, platform.inventory);
    assert.equal(inventory.platformCapabilities, platform.capabilities);
    assert.equal(inventory.platformGuarantees, platform.guarantees);
    assert.equal(inventory.platformCompatibility, platform.compatibility);
    assert.equal(inventory.platformComposition, platform.composition);
    assert.equal(inventory.platformMetadata, platform.metadata);
    assert.equal(inventory.platformReadiness, platform.readiness);
  });

  it("derives all Certification inventory counts dynamically", () => {
    const inventory = AnimationEffectsCertificationInventoryMetadata;
    assert.equal(inventory.counts.criteriaCount, inventory.criteria.length);
    assert.equal(inventory.counts.gateCount, inventory.gates.length);
    assert.equal(inventory.counts.compatibilityVerificationCount,
      inventory.compatibilityVerification.length);
    assert.equal(inventory.counts.publicSurfaceCount,
      inventory.publicCertificationSurface.length);
    assert.equal(getAnimationEffectsCertificationCount(),
      inventory.criteria.length);
    assert.equal(inventory.hardcodedAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("uses Platform as its only upstream phase dependency", () => {
    assert.equal(AnimationEffectsCertificationMetadata.dependency
      .animationEffectsPlatformOnly, true);
    const combined = sources.join("\n");
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsManifest/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsValidation/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsModel/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsRegistry/);
    assert.doesNotMatch(combined, /from ["']\.\/animationEffectsFoundation/);
    assert.doesNotMatch(combined, /from ["']\.\/sceneRendering/);
    assert.doesNotMatch(combined, /from ["']\.\.\//);
  });

  it("contains no certification, animation, rendering, or prohibited runtime", () => {
    const metadata = AnimationEffectsCertificationMetadata;
    assert.ok(Object.isFrozen(AnimationEffectsCertificationPlatform));
    assert.equal(metadata.certificationEngine, false);
    assert.equal(metadata.runtimeCertification, false);
    assert.equal(metadata.validationEngine, false);
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
    assert.equal(getAnimationEffectsCertificationSummary().status, "Certified");
    const release = getAnimationEffectsCertificationReleaseMetadata();
    assert.equal(release.status, "Certified");
    assert.equal(release.readiness, "ReadyForFreeze");
    assert.equal(release.platformReference, "EVE-7:6/AnimationEffectsPlatform");
  });
});
