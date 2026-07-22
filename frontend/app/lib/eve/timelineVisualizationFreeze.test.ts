import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicFreeze from "./timelineVisualizationFreeze.ts";
import {
  getTimelineVisualizationFreezeCount, getTimelineVisualizationFreezeReleaseMetadata,
  getTimelineVisualizationFreezeSummary, TimelineVisualizationFreezeId,
  TimelineVisualizationFreezeMetadata, TimelineVisualizationFreezeNamespace,
  TimelineVisualizationFreezePlatform, TimelineVisualizationFreezeVersion,
} from "./timelineVisualizationFreeze.ts";

const FILES = Object.freeze([
  "timelineVisualizationFreezeTypes.ts", "timelineVisualizationFreezeRegistry.ts",
  "timelineVisualizationFreezeBaselines.ts", "timelineVisualizationFreezeCompatibility.ts",
  "timelineVisualizationFreezeLocks.ts", "timelineVisualizationFreezeExtensions.ts",
  "timelineVisualizationFreeze.ts", "timelineVisualizationFreeze.test.ts",
]);

describe("EVE-4:8 Timeline & Temporal Visualization Freeze", () => {
  it("adds exactly eight Freeze files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicFreeze).length, 8);
  });

  it("publishes the canonical frozen identity, lock, and readiness", () => {
    assert.equal(TimelineVisualizationFreezeId, "EVE-4:8/TimelineVisualizationFreeze");
    assert.equal(TimelineVisualizationFreezeVersion, "1.0.0");
    assert.equal(TimelineVisualizationFreezeNamespace,
      "nexora.eve.timeline-visualization.freeze");
    assert.equal(TimelineVisualizationFreezeMetadata.status, "Frozen");
    assert.equal(TimelineVisualizationFreezeMetadata.readiness, "ReadyForPublicIndex");
    assert.equal(TimelineVisualizationFreezeMetadata.lockId,
      "EVE-4-TIMELINE-VISUALIZATION-LOCKED");
    assert.equal(TimelineVisualizationFreezeMetadata.certificationReference,
      "EVE-4:7/TimelineVisualizationCertification");
  });

  it("publishes exact immutable Freeze collections", () => {
    const freeze = TimelineVisualizationFreezePlatform;
    assert.equal(freeze.locks.length, 12);
    assert.equal(freeze.baselines.length, 8);
    assert.equal(freeze.registry.length, 7);
    assert.equal(freeze.compatibility.length, 8);
    assert.equal(freeze.extensions.length, 8);
    assert.ok(freeze.locks.every(({ status }) => status === "Frozen"));
    for (const collection of [freeze.locks, freeze.baselines, freeze.registry,
      freeze.compatibility, freeze.extensions]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.deterministicOrder === index + 1));
    }
  });

  it("preserves Certification collections by canonical reference", () => {
    const { certification, inventory } = TimelineVisualizationFreezePlatform;
    assert.equal(inventory.certificationInventory, certification.inventory);
    assert.equal(inventory.certificationCriteria, certification.criteria);
    assert.equal(inventory.certificationGates, certification.gates);
    assert.equal(inventory.certificationCompatibility, certification.compatibility);
    assert.equal(TimelineVisualizationFreezePlatform.registry[6]!.canonicalReference,
      certification);
  });

  it("derives all Freeze inventory counts dynamically", () => {
    const { inventory } = TimelineVisualizationFreezePlatform;
    assert.equal(inventory.counts.lockCount, inventory.locks.length);
    assert.equal(inventory.counts.baselineCount, inventory.baselines.length);
    assert.equal(inventory.counts.registryEntryCount, inventory.registry.length);
    assert.equal(inventory.counts.compatibilityCount, inventory.compatibility.length);
    assert.equal(inventory.counts.extensionCount, inventory.extensions.length);
    assert.equal(getTimelineVisualizationFreezeCount(), inventory.locks.length);
    assert.equal(inventory.hardcodesAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("consumes only Timeline Visualization Certification", () => {
    assert.equal(TimelineVisualizationFreezeMetadata.dependency
      .timelineVisualizationCertificationOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationPlatform/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationManifest/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationValidation/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationModel/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationRegistry/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationFoundation/);
      assert.doesNotMatch(source, /from ["']\.\/graphVisualization/);
    }
  });

  it("is immutable metadata with no locking or temporal runtime", () => {
    const freeze = TimelineVisualizationFreezePlatform;
    assert.ok(Object.isFrozen(freeze));
    assert.ok(Object.isFrozen(TimelineVisualizationFreezeMetadata));
    assert.equal(freeze.freezeEngine, false);
    assert.equal(freeze.runtimeLocking, false);
    assert.equal(freeze.playbackExecution, false);
    assert.equal(freeze.animationExecution, false);
    assert.equal(freeze.scheduling, false);
    assert.equal(freeze.simulation, false);
    assert.equal(freeze.rendering, false);
    assert.equal(freeze.services, false);
    assert.equal(freeze.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getTimelineVisualizationFreezeSummary(), TimelineVisualizationFreezeMetadata);
    const release = getTimelineVisualizationFreezeReleaseMetadata();
    assert.equal(release.status, "Frozen");
    assert.equal(release.readiness, "ReadyForPublicIndex");
    assert.equal(release.lockId, "EVE-4-TIMELINE-VISUALIZATION-LOCKED");
  });
});
