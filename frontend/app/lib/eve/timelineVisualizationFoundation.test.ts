import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicFoundation from "./timelineVisualizationFoundation.ts";
import {
  getTimelineVisualizationFoundationCount,
  getTimelineVisualizationFoundationReleaseMetadata,
  getTimelineVisualizationFoundationSummary,
  TimelineVisualizationFoundationId,
  TimelineVisualizationFoundationMetadata,
  TimelineVisualizationFoundationNamespace,
  TimelineVisualizationFoundationPlatform,
  TimelineVisualizationFoundationVersion,
} from "./timelineVisualizationFoundation.ts";

const FILES = Object.freeze([
  "timelineVisualizationFoundationTypes.ts",
  "timelineVisualizationFoundationContracts.ts",
  "timelineVisualizationFoundationOwnership.ts",
  "timelineVisualizationFoundationLifecycle.ts",
  "timelineVisualizationFoundationCapabilities.ts",
  "timelineVisualizationFoundationMetadata.ts",
  "timelineVisualizationFoundation.ts",
  "timelineVisualizationFoundation.test.ts",
]);

describe("EVE-4:1 Timeline & Temporal Visualization Foundation", () => {
  it("adds exactly eight Foundation files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicFoundation).length, 8);
  });

  it("publishes the canonical identity and readiness", () => {
    assert.equal(TimelineVisualizationFoundationId,
      "EVE-4:1/TimelineVisualizationFoundation");
    assert.equal(TimelineVisualizationFoundationVersion, "1.0.0");
    assert.equal(TimelineVisualizationFoundationNamespace,
      "nexora.eve.timeline-visualization.foundation");
    assert.equal(TimelineVisualizationFoundationMetadata.name,
      "Timeline & Temporal Visualization Foundation");
    assert.equal(TimelineVisualizationFoundationMetadata.status, "ReadyForRegistry");
    assert.equal(TimelineVisualizationFoundationMetadata.upstreamPublicIndexReference,
      "EVE-3:9/GraphVisualizationPublicIndex");
  });

  it("publishes exact immutable temporal architecture collections", () => {
    const foundation = TimelineVisualizationFoundationPlatform;
    assert.equal(foundation.contracts.length, 18);
    assert.equal(foundation.boundaries.length, 10);
    assert.equal(foundation.lifecycle.states.length, 5);
    assert.equal(foundation.capabilities.length, 18);
    for (const collection of [foundation.contracts, foundation.boundaries,
      foundation.lifecycle.states, foundation.capabilities]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) =>
        Object.isFrozen(entry) && entry.deterministicOrder === index + 1));
    }
  });

  it("declares exact ownership and architectural exclusions", () => {
    assert.equal(TimelineVisualizationFoundationPlatform.ownership.owns.length, 10);
    assert.equal(TimelineVisualizationFoundationPlatform.ownership.doesNotOwn.length, 8);
    assert.ok(TimelineVisualizationFoundationPlatform.ownership.doesNotOwn
      .includes("Runtime playback"));
    assert.ok(Object.isFrozen(TimelineVisualizationFoundationPlatform.ownership));
  });

  it("derives Foundation inventory counts dynamically", () => {
    const { inventory } = TimelineVisualizationFoundationPlatform;
    assert.equal(inventory.counts.contractCount, inventory.contracts.length);
    assert.equal(inventory.counts.boundaryCount, inventory.boundaries.length);
    assert.equal(inventory.counts.lifecycleStateCount, inventory.lifecycleStates.length);
    assert.equal(inventory.counts.capabilityCount, inventory.capabilities.length);
    assert.equal(getTimelineVisualizationFoundationCount(), inventory.contracts.length);
    assert.equal(inventory.hardcodesAggregateCounts, false);
    assert.equal(inventory.reconstructsUpstreamInventory, false);
  });

  it("consumes only Graph Visualization Public Index", () => {
    assert.equal(TimelineVisualizationFoundationMetadata.dependency
      .graphVisualizationPublicIndexOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source,
        /from ["']\.\/graphVisualization(?:Foundation|Registry|Model|Validation|Manifest|Platform|Certification|Freeze)/);
      assert.doesNotMatch(source, /from ["']\.\/sceneRendering/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable metadata with no timeline or visualization runtime", () => {
    assert.ok(Object.isFrozen(TimelineVisualizationFoundationPlatform));
    assert.ok(Object.isFrozen(TimelineVisualizationFoundationMetadata));
    assert.equal(TimelineVisualizationFoundationPlatform.animation, false);
    assert.equal(TimelineVisualizationFoundationPlatform.playbackExecution, false);
    assert.equal(TimelineVisualizationFoundationPlatform.scheduling, false);
    assert.equal(TimelineVisualizationFoundationPlatform.simulation, false);
    assert.equal(TimelineVisualizationFoundationPlatform.graphProcessing, false);
    assert.equal(TimelineVisualizationFoundationPlatform.rendering, false);
    assert.equal(TimelineVisualizationFoundationPlatform.services, false);
    assert.equal(TimelineVisualizationFoundationPlatform.factories, false);
    assert.equal(TimelineVisualizationFoundationPlatform.runtimeExecution, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getTimelineVisualizationFoundationSummary(),
      TimelineVisualizationFoundationMetadata);
    const release = getTimelineVisualizationFoundationReleaseMetadata();
    assert.equal(release.status, "ReadyForRegistry");
    assert.equal(release.upstreamReference, "EVE-3:9/GraphVisualizationPublicIndex");
  });
});
