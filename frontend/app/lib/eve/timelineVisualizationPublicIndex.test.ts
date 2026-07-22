import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicIndex from "./timelineVisualizationPublicIndex.ts";
import {
  getTimelineVisualizationPublicApiCount, getTimelineVisualizationPublicReleaseMetadata,
  getTimelineVisualizationPublicSummary, TimelineVisualizationPlatformPublicFoundation,
  TimelineVisualizationPublicApiRegistry, TimelineVisualizationPublicCertificationStatus,
  TimelineVisualizationPublicFreezeStatus, TimelineVisualizationPublicIndexId,
  TimelineVisualizationPublicIndexName, TimelineVisualizationPublicIndexNamespace,
  TimelineVisualizationPublicIndexVersion, TimelineVisualizationPublicReleaseStatus,
} from "./timelineVisualizationPublicIndex.ts";

describe("EVE-4:9 Timeline & Temporal Visualization Public Index", () => {
  it("adds exactly the two requested Public Index files", () => {
    const files = readdirSync(import.meta.dirname)
      .filter((name) => name.startsWith("timelineVisualizationPublicIndex"));
    assert.deepEqual(files.sort(), [
      "timelineVisualizationPublicIndex.test.ts", "timelineVisualizationPublicIndex.ts",
    ]);
  });

  it("exports exactly twelve stable public symbols", () => {
    assert.equal(Object.keys(PublicIndex).length, 12);
    assert.deepEqual(Object.keys(PublicIndex).sort(),
      [...TimelineVisualizationPlatformPublicFoundation.publicExports].sort());
  });

  it("publishes the canonical released identity and statuses", () => {
    assert.equal(TimelineVisualizationPublicIndexId,
      "EVE-4:9/TimelineVisualizationPublicIndex");
    assert.equal(TimelineVisualizationPublicIndexName,
      "Timeline & Temporal Visualization Public Index");
    assert.equal(TimelineVisualizationPublicIndexVersion, "1.0.0");
    assert.equal(TimelineVisualizationPublicIndexNamespace,
      "nexora.eve.timeline-visualization.public-index");
    assert.equal(TimelineVisualizationPublicReleaseStatus, "Released");
    assert.equal(TimelineVisualizationPublicCertificationStatus, "Certified");
    assert.equal(TimelineVisualizationPublicFreezeStatus, "Frozen");
    assert.equal(getTimelineVisualizationPublicSummary().stability, "Stable");
    assert.equal(getTimelineVisualizationPublicSummary().readiness, "ReadyForConsumer");
    assert.equal(getTimelineVisualizationPublicSummary().lockId,
      "EVE-4-TIMELINE-VISUALIZATION-LOCKED");
  });

  it("publishes exactly nine ordered canonical namespace sections", () => {
    const namespace = TimelineVisualizationPlatformPublicFoundation.namespace;
    assert.deepEqual(namespace.map(({ name }) => name), [
      "foundation", "registry", "model", "validation", "manifest",
      "platform", "certification", "freeze", "publicIndex",
    ]);
    assert.ok(namespace.every((entry, index) => Object.isFrozen(entry)
      && entry.deterministicOrder === index + 1 && entry.preservedByReference));
    assert.equal(namespace[7]!.canonicalSource,
      TimelineVisualizationPlatformPublicFoundation.frozenArchitecture);
    assert.equal(namespace[8]!.canonicalReference, TimelineVisualizationPublicIndexId);
  });

  it("publishes an immutable unique deterministically ordered API registry", () => {
    const entries = TimelineVisualizationPublicApiRegistry;
    assert.ok(Object.isFrozen(entries));
    assert.ok(entries.every(Object.isFrozen));
    assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
    assert.deepEqual(entries.map(({ deterministicOrdinal }) => deterministicOrdinal),
      [...entries].sort((a, b) => a.phaseOrder - b.phaseOrder || a.exportOrder - b.exportOrder)
        .map(({ deterministicOrdinal }) => deterministicOrdinal));
  });

  it("derives API counts and contributions canonically", () => {
    assert.equal(getTimelineVisualizationPublicApiCount(),
      TimelineVisualizationPublicApiRegistry.length);
    assert.equal(TimelineVisualizationPlatformPublicFoundation.namespace.length, 9);
    const rule = TimelineVisualizationPlatformPublicFoundation.canonicalInventoryRule;
    assert.equal(rule.hardcodedApiTotals, false);
    assert.equal(rule.reconstructsUpstreamInventories, false);
    assert.equal(rule.duplicatesUpstreamMetadata, false);
  });

  it("declares the sole consumer entry point and preserves frozen metadata", () => {
    const metadata = getTimelineVisualizationPublicReleaseMetadata();
    assert.equal(TimelineVisualizationPlatformPublicFoundation.soleConsumerEntryPoint,
      "frontend/app/lib/eve/timelineVisualizationPublicIndex.ts");
    assert.equal(metadata.freezeReference, "EVE-4:8/TimelineVisualizationFreeze");
    assert.equal(metadata.lockId, "EVE-4-TIMELINE-VISUALIZATION-LOCKED");
    assert.equal(metadata.frozenInventory,
      TimelineVisualizationPlatformPublicFoundation.frozenArchitecture.inventory);
    assert.ok(Object.isFrozen(metadata));
    assert.ok(Object.isFrozen(getTimelineVisualizationPublicSummary()));
  });

  it("consumes only Timeline Visualization Freeze", () => {
    const metadata = getTimelineVisualizationPublicReleaseMetadata();
    assert.equal(metadata.dependency.timelineVisualizationFreezeOnly, true);
    const source = readFileSync(new URL("timelineVisualizationPublicIndex.ts", import.meta.url),
      "utf8");
    assert.doesNotMatch(source,
      /from ["']\.\/timelineVisualization(?:Certification|Platform|Manifest|Validation|Model|Registry|Foundation)/);
    assert.doesNotMatch(source, /from ["']\.\/graphVisualization/);
    assert.doesNotMatch(source, /from ["']\.\/sceneRendering/);
  });

  it("is immutable metadata with no temporal or runtime facilities", () => {
    const metadata = getTimelineVisualizationPublicReleaseMetadata();
    assert.ok(Object.isFrozen(TimelineVisualizationPlatformPublicFoundation));
    assert.equal(metadata.execution, false);
    assert.equal(metadata.playback, false);
    assert.equal(metadata.animation, false);
    assert.equal(metadata.scheduling, false);
    assert.equal(metadata.rendering, false);
    assert.equal(metadata.simulation, false);
    assert.equal(metadata.networking, false);
    assert.equal(metadata.persistence, false);
    assert.equal(metadata.services, false);
    assert.equal(metadata.factories, false);
  });
});
