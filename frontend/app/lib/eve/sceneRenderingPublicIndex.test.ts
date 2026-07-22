import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicIndex from "./sceneRenderingPublicIndex.ts";
import {
  getSceneRenderingPublicApiCount, getSceneRenderingPublicReleaseMetadata,
  getSceneRenderingPublicSummary, SceneRenderingPlatformPublicFoundation,
  SceneRenderingPublicApiRegistry, SceneRenderingPublicCertificationStatus,
  SceneRenderingPublicFreezeStatus, SceneRenderingPublicIndexId,
  SceneRenderingPublicIndexNamespace, SceneRenderingPublicIndexVersion,
  SceneRenderingPublicReleaseStatus,
} from "./sceneRenderingPublicIndex.ts";

describe("EVE-2:9 Scene Rendering Public Index", () => {
  it("adds exactly the two requested Public Index files", () => {
    const files = readdirSync(import.meta.dirname)
      .filter((name) => name.startsWith("sceneRenderingPublicIndex"));
    assert.deepEqual(files.sort(), [
      "sceneRenderingPublicIndex.test.ts", "sceneRenderingPublicIndex.ts",
    ]);
  });

  it("exports exactly twelve stable public symbols", () => {
    assert.equal(Object.keys(PublicIndex).length, 12);
    assert.deepEqual(Object.keys(PublicIndex).sort(),
      [...SceneRenderingPlatformPublicFoundation.publicExports].sort());
  });

  it("has canonical released, certified, frozen identity", () => {
    assert.equal(SceneRenderingPublicIndexId, "EVE-2:9/SceneRenderingPublicIndex");
    assert.equal(SceneRenderingPublicIndexVersion, "1.0.0");
    assert.equal(SceneRenderingPublicIndexNamespace, "nexora.eve.scene-rendering.public-index");
    assert.equal(SceneRenderingPublicReleaseStatus, "Released");
    assert.equal(SceneRenderingPublicCertificationStatus, "Certified");
    assert.equal(SceneRenderingPublicFreezeStatus, "Frozen");
    assert.equal(getSceneRenderingPublicSummary().stability, "Stable");
    assert.equal(getSceneRenderingPublicSummary().readiness, "ReadyForConsumer");
    assert.equal(getSceneRenderingPublicSummary().lockId, "EVE-2-SCENE-RENDERING-LOCKED");
  });

  it("publishes exactly nine ordered canonical namespace sections", () => {
    const namespace = SceneRenderingPlatformPublicFoundation.namespace;
    assert.deepEqual(namespace.map(({ name }) => name), [
      "Foundation", "Registry", "Model", "Validation", "Manifest",
      "Platform", "Certification", "Freeze", "Public Index",
    ]);
    assert.ok(namespace.every((entry, index) => Object.isFrozen(entry)
      && entry.deterministicOrder === index + 1 && entry.preservedByReference));
    assert.equal(namespace[7]!.canonicalSource,
      SceneRenderingPlatformPublicFoundation.frozenArchitecture);
  });

  it("publishes an immutable unique deterministically ordered API registry", () => {
    const entries = SceneRenderingPublicApiRegistry.entries;
    assert.ok(Object.isFrozen(SceneRenderingPublicApiRegistry));
    assert.ok(Object.isFrozen(entries));
    assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
    assert.deepEqual(entries.map(({ deterministicOrdinal }) => deterministicOrdinal),
      [...entries].sort((a, b) => a.phaseOrder - b.phaseOrder || a.exportOrder - b.exportOrder)
        .map(({ deterministicOrdinal }) => deterministicOrdinal));
    assert.ok(entries.every(Object.isFrozen));
  });

  it("derives API counts and contributions canonically", () => {
    assert.equal(SceneRenderingPublicApiRegistry.apiCount,
      SceneRenderingPublicApiRegistry.entries.length);
    assert.equal(getSceneRenderingPublicApiCount(), SceneRenderingPublicApiRegistry.entries.length);
    assert.equal(SceneRenderingPublicApiRegistry.namespaceSectionCount, 9);
    assert.equal(SceneRenderingPublicApiRegistry.canonicalInventoryRule.hardcodedApiTotals, false);
    assert.equal(SceneRenderingPublicApiRegistry.canonicalInventoryRule.hardcodedUpstreamPhaseCounts, false);
    assert.equal(SceneRenderingPublicApiRegistry.canonicalInventoryRule.duplicatesUpstreamMetadata, false);
  });

  it("declares one consumer entry point and preserves release metadata", () => {
    const metadata = getSceneRenderingPublicReleaseMetadata();
    assert.equal(SceneRenderingPlatformPublicFoundation.soleConsumerEntryPoint,
      "sceneRenderingPublicIndex.ts");
    assert.equal(metadata.freezeReference, "EVE-2:8/SceneRenderingFreeze");
    assert.equal(metadata.lockId, "EVE-2-SCENE-RENDERING-LOCKED");
    assert.equal(metadata.inventory,
      SceneRenderingPlatformPublicFoundation.frozenArchitecture.inventory);
  });

  it("consumes only Scene Rendering Freeze", () => {
    const metadata = getSceneRenderingPublicReleaseMetadata();
    assert.equal(metadata.dependency.sceneRenderingFreezeOnly, true);
    const source = readFileSync(new URL("sceneRenderingPublicIndex.ts", import.meta.url), "utf8");
    assert.doesNotMatch(source,
      /from ["']\.\/sceneRendering(?:Foundation|Registry|Model|Validation|Manifest|Platform|Certification)/);
    assert.doesNotMatch(source, /from ["']\.\/visualization/);
  });

  it("is immutable and exposes no runtime facilities", () => {
    const metadata = getSceneRenderingPublicReleaseMetadata();
    assert.ok(Object.isFrozen(SceneRenderingPlatformPublicFoundation));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.execution, false);
    assert.equal(metadata.renderingRuntime, false);
    assert.equal(metadata.sceneExecution, false);
    assert.equal(metadata.frameGeneration, false);
    assert.equal(metadata.orchestration, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
  });
});
