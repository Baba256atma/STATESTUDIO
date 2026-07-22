import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicIndex from "./visualizationPublicIndex.ts";
import {
  VisualizationPlatformPublicFoundation, VisualizationPublicApiRegistry,
  VisualizationPublicCertificationStatus, VisualizationPublicFreezeStatus,
  VisualizationPublicIndexId, VisualizationPublicIndexNamespace,
  VisualizationPublicIndexVersion, VisualizationPublicReleaseStatus,
  getVisualizationPublicApiCount, getVisualizationPublicReleaseMetadata,
  getVisualizationPublicSummary,
} from "./visualizationPublicIndex.ts";

describe("EVE-1:9 Visualization Public Index", () => {
  it("adds exactly the two requested Public Index files", () => {
    const files = readdirSync(import.meta.dirname).filter((name) =>
      name.startsWith("visualizationPublicIndex"));
    assert.deepEqual(files.sort(), [
      "visualizationPublicIndex.test.ts", "visualizationPublicIndex.ts",
    ]);
  });

  it("has canonical released, certified, frozen identity", () => {
    assert.equal(VisualizationPublicIndexId, "EVE-1:9/VisualizationPublicIndex");
    assert.equal(VisualizationPublicIndexVersion, "1.0.0");
    assert.equal(VisualizationPublicIndexNamespace, "nexora.eve.visualization.public-index");
    assert.equal(VisualizationPublicReleaseStatus, "Released");
    assert.equal(VisualizationPublicCertificationStatus, "Certified");
    assert.equal(VisualizationPublicFreezeStatus, "Frozen");
    assert.equal(getVisualizationPublicSummary().stability, "Stable");
    assert.equal(getVisualizationPublicSummary().readiness, "ReadyForConsumer");
  });

  it("exports exactly twelve stable public symbols", () => {
    assert.equal(Object.keys(PublicIndex).length, 12);
    assert.deepEqual(
      Object.keys(PublicIndex).sort(),
      [...VisualizationPlatformPublicFoundation.publicExports].sort(),
    );
  });

  it("publishes exactly nine ordered namespace sections", () => {
    assert.deepEqual(
      VisualizationPlatformPublicFoundation.namespace.map(({ name }) => name),
      ["Foundation", "Registry", "Model", "Validation", "Manifest",
        "Platform", "Certification", "Freeze", "Public Index"],
    );
    assert.ok(VisualizationPlatformPublicFoundation.namespace.every(
      (entry, index) => entry.deterministicOrder === index + 1
      && entry.preservedByReference,
    ));
  });

  it("derives the public API registry and count from Freeze", () => {
    assert.equal(VisualizationPublicApiRegistry.entries.length, 9);
    assert.equal(
      VisualizationPublicApiRegistry.apiCount,
      VisualizationPublicApiRegistry.entries.reduce(
        (total, entry) => total + entry.apiReferences.length, 0,
      ),
    );
    assert.equal(getVisualizationPublicApiCount(), VisualizationPublicApiRegistry.apiCount);
    assert.equal(VisualizationPublicApiRegistry.canonicalInventoryRule.hardcodedApiTotals, false);
    assert.ok(VisualizationPublicApiRegistry.entries.every(({ derivedFromFreeze }) => derivedFromFreeze));
  });

  it("consumes only Visualization Freeze", () => {
    const metadata = getVisualizationPublicReleaseMetadata();
    assert.equal(metadata.dependency.visualizationFreezeOnly, true);
    assert.equal(metadata.dependency.downstreamEveDependencies, false);
    const source = readFileSync(new URL("visualizationPublicIndex.ts", import.meta.url), "utf8");
    assert.doesNotMatch(source, /from ["']\.\/visualization(?:Foundation|Registry|Model|Validation|Manifest|Platform|Certification)/);
    assert.doesNotMatch(source, /from ["'](?:react|next|three|@react|babylon|pixi)/i);
  });

  it("is immutable and exposes no runtime facilities", () => {
    const metadata = getVisualizationPublicReleaseMetadata();
    assert.ok(Object.isFrozen(VisualizationPlatformPublicFoundation));
    assert.ok(Object.isFrozen(VisualizationPublicApiRegistry));
    assert.ok(Object.isFrozen(VisualizationPublicApiRegistry.entries));
    assert.ok(Object.isFrozen(metadata));
    assert.equal(metadata.execution, false);
    assert.equal(metadata.visualizationRuntime, false);
    assert.equal(metadata.orchestration, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
  });
});
