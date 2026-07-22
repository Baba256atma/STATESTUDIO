import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicPlatform from "./timelineVisualizationPlatform.ts";
import {
  getTimelineVisualizationPlatformCount, getTimelineVisualizationPlatformReleaseMetadata,
  getTimelineVisualizationPlatformSummary, TimelineVisualizationPlatformId,
  TimelineVisualizationPlatformMetadata, TimelineVisualizationPlatformNamespace,
  TimelineVisualizationPlatformPlatform, TimelineVisualizationPlatformVersion,
} from "./timelineVisualizationPlatform.ts";

const FILES = Object.freeze([
  "timelineVisualizationPlatformTypes.ts", "timelineVisualizationPlatformComposition.ts",
  "timelineVisualizationPlatformCapabilities.ts", "timelineVisualizationPlatformGuarantees.ts",
  "timelineVisualizationPlatformCompatibility.ts", "timelineVisualizationPlatformMetadata.ts",
  "timelineVisualizationPlatform.ts", "timelineVisualizationPlatform.test.ts",
]);

describe("EVE-4:6 Timeline & Temporal Visualization Platform", () => {
  it("adds exactly eight Platform files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicPlatform).length, 8);
  });

  it("publishes the canonical identity and readiness", () => {
    assert.equal(TimelineVisualizationPlatformId,
      "EVE-4:6/TimelineVisualizationPlatform");
    assert.equal(TimelineVisualizationPlatformVersion, "1.0.0");
    assert.equal(TimelineVisualizationPlatformNamespace,
      "nexora.eve.timeline-visualization.platform");
    assert.equal(TimelineVisualizationPlatformMetadata.status, "ReadyForCertification");
    assert.equal(TimelineVisualizationPlatformMetadata.manifestReference,
      "EVE-4:5/TimelineVisualizationManifest");
  });

  it("publishes canonical six-phase composition preserving Manifest entries", () => {
    const { composition, manifest } = TimelineVisualizationPlatformPlatform;
    assert.deepEqual(composition.map(({ phase }) => phase),
      ["Foundation", "Registry", "Model", "Validation", "Manifest", "Platform"]);
    manifest.composition.forEach((entry, index) => assert.equal(composition[index], entry));
    assert.ok(composition.every((entry, index) => Object.isFrozen(entry)
      && entry.deterministicOrder === index + 1));
  });

  it("publishes exact immutable capabilities, guarantees, and compatibility", () => {
    const platform = TimelineVisualizationPlatformPlatform;
    assert.equal(platform.capabilities.length, 10);
    assert.equal(platform.guarantees.length, 12);
    assert.equal(platform.compatibility.length, 8);
    for (const collection of [platform.capabilities, platform.guarantees,
      platform.compatibility]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.deterministicOrder === index + 1));
    }
  });

  it("preserves Manifest collections by canonical reference", () => {
    const { inventory, manifest } = TimelineVisualizationPlatformPlatform;
    assert.equal(inventory.manifestInventory, manifest.inventory);
    assert.equal(inventory.manifestComposition, manifest.composition);
    assert.equal(inventory.manifestGuarantees, manifest.guarantees);
    assert.equal(inventory.manifestCompatibility, manifest.compatibility);
    assert.equal(inventory.manifestReadiness, manifest.readiness);
  });

  it("derives all Platform inventory counts dynamically", () => {
    const { inventory } = TimelineVisualizationPlatformPlatform;
    assert.equal(inventory.counts.phaseCount, inventory.phaseComposition.length);
    assert.equal(inventory.counts.capabilityCount, inventory.capabilities.length);
    assert.equal(inventory.counts.guaranteeCount, inventory.guarantees.length);
    assert.equal(inventory.counts.compatibilityCount, inventory.compatibility.length);
    assert.equal(getTimelineVisualizationPlatformCount(), inventory.phaseComposition.length);
    assert.equal(inventory.hardcodesAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("consumes only Timeline Visualization Manifest", () => {
    assert.equal(TimelineVisualizationPlatformMetadata.dependency
      .timelineVisualizationManifestOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationValidation/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationModel/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationRegistry/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationFoundation/);
      assert.doesNotMatch(source, /from ["']\.\/graphVisualization/);
    }
  });

  it("is immutable metadata with no certification or temporal runtime", () => {
    const platform = TimelineVisualizationPlatformPlatform;
    assert.ok(Object.isFrozen(platform));
    assert.ok(Object.isFrozen(TimelineVisualizationPlatformMetadata));
    assert.equal(platform.validationExecution, false);
    assert.equal(platform.certificationExecution, false);
    assert.equal(platform.playbackExecution, false);
    assert.equal(platform.animationExecution, false);
    assert.equal(platform.scheduling, false);
    assert.equal(platform.simulation, false);
    assert.equal(platform.rendering, false);
    assert.equal(platform.services, false);
    assert.equal(platform.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getTimelineVisualizationPlatformSummary(), TimelineVisualizationPlatformMetadata);
    const release = getTimelineVisualizationPlatformReleaseMetadata();
    assert.equal(release.status, "ReadyForCertification");
    assert.equal(release.manifestReference, "EVE-4:5/TimelineVisualizationManifest");
  });
});
