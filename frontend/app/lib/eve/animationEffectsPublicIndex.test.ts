import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicExports from "./animationEffectsPublicIndex.ts";
import {
  AnimationEffectsPlatformPublicFoundation,
  AnimationEffectsPublicApiRegistry,
  AnimationEffectsPublicCertificationStatus,
  AnimationEffectsPublicFreezeStatus,
  AnimationEffectsPublicIndexId,
  AnimationEffectsPublicIndexName,
  AnimationEffectsPublicIndexNamespace,
  AnimationEffectsPublicIndexVersion,
  AnimationEffectsPublicReleaseStatus,
  getAnimationEffectsPublicApiCount,
  getAnimationEffectsPublicReleaseMetadata,
  getAnimationEffectsPublicSummary,
} from "./animationEffectsPublicIndex.ts";

describe("EVE-7:9 Animation & Effects Public Index", () => {
  it("creates exactly two Public Index files and twelve public exports", () => {
    const actual = readdirSync(import.meta.dirname).filter((name) =>
      name.startsWith("animationEffectsPublicIndex"));
    assert.deepEqual(actual.sort(), [
      "animationEffectsPublicIndex.test.ts", "animationEffectsPublicIndex.ts",
    ]);
    assert.equal(Object.keys(PublicExports).length, 12);
    assert.deepEqual(Object.keys(PublicExports).sort(),
      [...AnimationEffectsPlatformPublicFoundation.publicExports].sort());
  });

  it("publishes canonical identity, release state, and readiness", () => {
    assert.equal(AnimationEffectsPublicIndexId,
      "EVE-7:9/AnimationEffectsPublicIndex");
    assert.equal(AnimationEffectsPublicIndexName,
      "Animation & Effects Public Index");
    assert.equal(AnimationEffectsPublicIndexVersion, "1.0.0");
    assert.equal(AnimationEffectsPublicIndexNamespace,
      "nexora.eve.animation-effects.public-index");
    assert.equal(AnimationEffectsPublicReleaseStatus, "Released");
    assert.equal(AnimationEffectsPublicCertificationStatus, "Certified");
    assert.equal(AnimationEffectsPublicFreezeStatus, "Frozen");
    const metadata = getAnimationEffectsPublicReleaseMetadata();
    assert.equal(metadata.stability, "Stable");
    assert.equal(metadata.readiness, "ReadyForConsumer");
    assert.equal(metadata.lockId, "EVE-7-ANIMATION-EFFECTS-LOCKED");
  });

  it("publishes exactly nine ordered namespace sections", () => {
    const namespace = AnimationEffectsPlatformPublicFoundation.namespace;
    assert.deepEqual(namespace.map(({ name }) => name), [
      "Foundation", "Registry", "Model", "Validation", "Manifest", "Platform",
      "Certification", "Freeze", "Public Index",
    ]);
    assert.ok(namespace.every((entry, index) => Object.isFrozen(entry)
      && entry.preservedByReference && entry.deterministicOrder === index + 1));
    assert.equal(namespace[7]!.canonicalSource,
      AnimationEffectsPlatformPublicFoundation.frozenArchitecture);
    assert.equal(namespace[8]!.canonicalReference, AnimationEffectsPublicIndexId);
  });

  it("publishes immutable unique deterministic per-export API records", () => {
    const entries = AnimationEffectsPublicApiRegistry.entries;
    assert.ok(Object.isFrozen(AnimationEffectsPublicApiRegistry));
    assert.ok(Object.isFrozen(entries));
    assert.ok(entries.every((entry) => Object.isFrozen(entry)
      && Object.isFrozen(entry.deterministicOrdinal)
      && !entry.executableBehavior));
    assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
    assert.equal(new Set(entries.map(({ owningPhase, exportName }) =>
      `${owningPhase}/${exportName}`)).size, entries.length);
    assert.deepEqual(entries.map(({ deterministicOrdinal }) =>
      deterministicOrdinal), [...entries].sort((a, b) =>
      a.phaseOrder - b.phaseOrder || a.exportOrder - b.exportOrder)
      .map(({ deterministicOrdinal }) => deterministicOrdinal));
    assert.equal(entries.filter(({ owningPhase }) =>
      owningPhase === "Public Index").length, Object.keys(PublicExports).length);
  });

  it("derives all API and namespace counts dynamically", () => {
    const registry = AnimationEffectsPublicApiRegistry;
    assert.equal(registry.apiCount, registry.entries.length);
    assert.equal(getAnimationEffectsPublicApiCount(), registry.entries.length);
    assert.equal(registry.namespaceSectionCount,
      AnimationEffectsPlatformPublicFoundation.namespace.length);
    assert.equal(registry.canonicalInventoryRule.hardcodedApiTotals, false);
    assert.equal(registry.canonicalInventoryRule.hardcodedUpstreamPhaseCounts,
      false);
    assert.equal(registry.canonicalInventoryRule.reconstructsUpstreamCollections,
      false);
  });

  it("preserves Freeze collections and the complete canonical chain", () => {
    const publicIndex = AnimationEffectsPlatformPublicFoundation;
    const freeze = publicIndex.frozenArchitecture;
    assert.equal(publicIndex.freezeCollections, freeze.inventory);
    assert.equal(publicIndex.publicApiRegistry.frozenInventory, freeze.inventory);
    assert.equal(freeze.metadata.lockId, "EVE-7-ANIMATION-EFFECTS-LOCKED");
    assert.equal(freeze.certification.platform.manifest.validation.model.registry
      .foundation.metadata.id, "EVE-7:1/AnimationEffectsFoundation");
  });

  it("declares exactly one supported consumer entry point", () => {
    const metadata = getAnimationEffectsPublicReleaseMetadata();
    assert.equal(metadata.soleConsumerEntryPoint,
      "animationEffectsPublicIndex.ts");
    assert.deepEqual(metadata.supportedConsumerEntries,
      ["animationEffectsPublicIndex.ts"]);
  });

  it("uses Freeze as its only phase dependency", () => {
    const metadata = getAnimationEffectsPublicReleaseMetadata();
    assert.equal(metadata.dependency.animationEffectsFreezeOnly, true);
    const source = readFileSync(new URL(
      "animationEffectsPublicIndex.ts", import.meta.url), "utf8");
    assert.doesNotMatch(source, /from ["']\.\/animationEffectsCertification/);
    assert.doesNotMatch(source, /from ["']\.\/animationEffectsPlatform/);
    assert.doesNotMatch(source, /from ["']\.\/animationEffectsManifest/);
    assert.doesNotMatch(source, /from ["']\.\/animationEffectsValidation/);
    assert.doesNotMatch(source, /from ["']\.\/animationEffectsModel/);
    assert.doesNotMatch(source, /from ["']\.\/animationEffectsRegistry/);
    assert.doesNotMatch(source, /from ["']\.\/animationEffectsFoundation/);
    assert.doesNotMatch(source, /from ["']\.\/sceneRendering/);
  });

  it("contains immutable metadata and no prohibited runtime facilities", () => {
    const publicIndex = AnimationEffectsPlatformPublicFoundation;
    const metadata = publicIndex.metadata;
    assert.ok(Object.isFrozen(publicIndex));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.animationExecution, false);
    assert.equal(metadata.scheduling, false);
    assert.equal(metadata.transitionExecution, false);
    assert.equal(metadata.timingExecution, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.frameGeneration, false);
    assert.equal(metadata.gpuProcessing, false);
    assert.equal(metadata.orchestration, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
  });

  it("provides stable summary and release accessors", () => {
    const summary = getAnimationEffectsPublicSummary();
    assert.equal(summary.release, "Released");
    assert.equal(summary.certification, "Certified");
    assert.equal(summary.freeze, "Frozen");
    assert.equal(summary.readiness, "ReadyForConsumer");
    assert.equal(summary.publicApiCount, getAnimationEffectsPublicApiCount());
    assert.equal(getAnimationEffectsPublicReleaseMetadata().freezeReference,
      "EVE-7:8/AnimationEffectsFreeze");
  });
});
