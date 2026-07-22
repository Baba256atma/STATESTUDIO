import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicCertification from "./timelineVisualizationCertification.ts";
import {
  getTimelineVisualizationCertificationCount,
  getTimelineVisualizationCertificationReleaseMetadata,
  getTimelineVisualizationCertificationSummary, TimelineVisualizationCertificationId,
  TimelineVisualizationCertificationMetadata, TimelineVisualizationCertificationNamespace,
  TimelineVisualizationCertificationPlatform, TimelineVisualizationCertificationVersion,
} from "./timelineVisualizationCertification.ts";

const FILES = Object.freeze([
  "timelineVisualizationCertificationTypes.ts", "timelineVisualizationCertificationCriteria.ts",
  "timelineVisualizationCertificationGates.ts",
  "timelineVisualizationCertificationCompatibility.ts",
  "timelineVisualizationCertificationInventory.ts",
  "timelineVisualizationCertificationMetadata.ts",
  "timelineVisualizationCertification.ts", "timelineVisualizationCertification.test.ts",
]);

describe("EVE-4:7 Timeline & Temporal Visualization Certification", () => {
  it("adds exactly eight Certification files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicCertification).length, 8);
  });

  it("publishes the canonical identity, status, and readiness", () => {
    assert.equal(TimelineVisualizationCertificationId,
      "EVE-4:7/TimelineVisualizationCertification");
    assert.equal(TimelineVisualizationCertificationVersion, "1.0.0");
    assert.equal(TimelineVisualizationCertificationNamespace,
      "nexora.eve.timeline-visualization.certification");
    assert.equal(TimelineVisualizationCertificationMetadata.status, "Certified");
    assert.equal(TimelineVisualizationCertificationMetadata.readiness, "ReadyForFreeze");
    assert.equal(TimelineVisualizationCertificationMetadata.platformReference,
      "EVE-4:6/TimelineVisualizationPlatform");
  });

  it("publishes exact immutable certification collections", () => {
    const certification = TimelineVisualizationCertificationPlatform;
    assert.equal(certification.criteria.length, 16);
    assert.equal(certification.gates.length, 12);
    assert.equal(certification.compatibility.length, 8);
    assert.ok(certification.gates.every(({ status }) => status === "Passed"));
    for (const collection of [certification.criteria, certification.gates,
      certification.compatibility]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.deterministicOrder === index + 1));
    }
  });

  it("preserves Platform collections by canonical reference", () => {
    const { inventory, platform } = TimelineVisualizationCertificationPlatform;
    assert.equal(inventory.platformInventory, platform.inventory);
    assert.equal(inventory.platformCapabilities, platform.capabilities);
    assert.equal(inventory.platformGuarantees, platform.guarantees);
    assert.equal(inventory.platformCompatibility, platform.compatibility);
    assert.equal(inventory.platformComposition, platform.composition);
    assert.equal(inventory.dependencyMetadata, platform.metadata.dependency);
  });

  it("derives all Certification inventory counts dynamically", () => {
    const { inventory } = TimelineVisualizationCertificationPlatform;
    assert.equal(inventory.counts.criteriaCount, inventory.criteria.length);
    assert.equal(inventory.counts.gateCount, inventory.gates.length);
    assert.equal(inventory.counts.compatibilityVerificationCount,
      inventory.compatibilityVerification.length);
    assert.equal(inventory.counts.platformPhaseCount, inventory.platformComposition.length);
    assert.equal(getTimelineVisualizationCertificationCount(), inventory.criteria.length);
    assert.equal(inventory.hardcodesAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("consumes only Timeline Visualization Platform", () => {
    assert.equal(TimelineVisualizationCertificationMetadata.dependency
      .timelineVisualizationPlatformOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationManifest/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationValidation/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationModel/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationRegistry/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationFoundation/);
      assert.doesNotMatch(source, /from ["']\.\/graphVisualization/);
    }
  });

  it("is immutable metadata with no certification or temporal runtime", () => {
    const certification = TimelineVisualizationCertificationPlatform;
    assert.ok(Object.isFrozen(certification));
    assert.ok(Object.isFrozen(TimelineVisualizationCertificationMetadata));
    assert.equal(certification.certificationEngine, false);
    assert.equal(certification.runtimeCertification, false);
    assert.equal(certification.validationExecution, false);
    assert.equal(certification.playbackExecution, false);
    assert.equal(certification.animationExecution, false);
    assert.equal(certification.scheduling, false);
    assert.equal(certification.simulation, false);
    assert.equal(certification.rendering, false);
    assert.equal(certification.services, false);
    assert.equal(certification.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getTimelineVisualizationCertificationSummary(),
      TimelineVisualizationCertificationMetadata);
    const release = getTimelineVisualizationCertificationReleaseMetadata();
    assert.equal(release.status, "Certified");
    assert.equal(release.readiness, "ReadyForFreeze");
    assert.equal(release.platformReference, "EVE-4:6/TimelineVisualizationPlatform");
  });
});
