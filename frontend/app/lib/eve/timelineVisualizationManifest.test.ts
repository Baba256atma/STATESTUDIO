import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicManifest from "./timelineVisualizationManifest.ts";
import {
  getTimelineVisualizationManifestCount, getTimelineVisualizationManifestReleaseMetadata,
  getTimelineVisualizationManifestSummary, TimelineVisualizationManifestId,
  TimelineVisualizationManifestMetadata, TimelineVisualizationManifestNamespace,
  TimelineVisualizationManifestPlatform, TimelineVisualizationManifestVersion,
} from "./timelineVisualizationManifest.ts";

const FILES = Object.freeze([
  "timelineVisualizationManifestTypes.ts", "timelineVisualizationManifestComposition.ts",
  "timelineVisualizationManifestGuarantees.ts",
  "timelineVisualizationManifestCompatibility.ts",
  "timelineVisualizationManifestInventory.ts", "timelineVisualizationManifestMetadata.ts",
  "timelineVisualizationManifest.ts", "timelineVisualizationManifest.test.ts",
]);

describe("EVE-4:5 Timeline & Temporal Visualization Manifest", () => {
  it("adds exactly eight Manifest files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicManifest).length, 8);
  });

  it("publishes the canonical identity and readiness", () => {
    assert.equal(TimelineVisualizationManifestId,
      "EVE-4:5/TimelineVisualizationManifest");
    assert.equal(TimelineVisualizationManifestVersion, "1.0.0");
    assert.equal(TimelineVisualizationManifestNamespace,
      "nexora.eve.timeline-visualization.manifest");
    assert.equal(TimelineVisualizationManifestMetadata.status, "ReadyForPlatform");
    assert.equal(TimelineVisualizationManifestMetadata.validationReference,
      "EVE-4:4/TimelineVisualizationValidation");
  });

  it("publishes canonical five-phase composition preserving upstream objects", () => {
    const { composition, validation } = TimelineVisualizationManifestPlatform;
    assert.deepEqual(composition.map(({ phase }) => phase),
      ["Foundation", "Registry", "Model", "Validation", "Manifest"]);
    assert.equal(composition[0]!.canonicalSource, validation.model.registry.foundation);
    assert.equal(composition[1]!.canonicalSource, validation.model.registry);
    assert.equal(composition[2]!.canonicalSource, validation.model);
    assert.equal(composition[3]!.canonicalSource, validation);
    assert.ok(composition.every((entry, index) => Object.isFrozen(entry)
      && entry.deterministicOrder === index + 1));
  });

  it("publishes exact immutable guarantees, compatibility, and readiness", () => {
    const manifest = TimelineVisualizationManifestPlatform;
    assert.equal(manifest.guarantees.length, 12);
    assert.equal(manifest.compatibility.length, 8);
    assert.equal(manifest.readiness.length, 7);
    for (const collection of [manifest.guarantees, manifest.compatibility,
      manifest.readiness]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.deterministicOrder === index + 1));
    }
  });

  it("preserves Validation collections by canonical reference", () => {
    const { inventory, validation } = TimelineVisualizationManifestPlatform;
    assert.equal(inventory.validationInventory, validation.inventory);
    assert.equal(inventory.validationRules, validation.rules);
    assert.equal(inventory.validationGates, validation.gates);
    assert.equal(inventory.validationOutcomes, validation.outcomes);
    assert.equal(inventory.validationDiagnostics, validation.diagnostics);
  });

  it("derives all Manifest inventory counts dynamically", () => {
    const { inventory } = TimelineVisualizationManifestPlatform;
    assert.equal(inventory.counts.phaseCount, inventory.phaseComposition.length);
    assert.equal(inventory.counts.validationRuleCount, inventory.validationRules.length);
    assert.equal(inventory.counts.validationGateCount, inventory.validationGates.length);
    assert.equal(inventory.counts.validationOutcomeCount, inventory.validationOutcomes.length);
    assert.equal(inventory.counts.validationDiagnosticCount,
      inventory.validationDiagnostics.length);
    assert.equal(inventory.counts.guaranteeCount, inventory.guarantees.length);
    assert.equal(inventory.counts.compatibilityCount, inventory.compatibility.length);
    assert.equal(inventory.counts.readinessCount, inventory.readiness.length);
    assert.equal(getTimelineVisualizationManifestCount(), inventory.phaseComposition.length);
    assert.equal(inventory.hardcodesAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("consumes only Timeline Visualization Validation", () => {
    assert.equal(TimelineVisualizationManifestMetadata.dependency
      .timelineVisualizationValidationOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationModel/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationRegistry/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationFoundation/);
      assert.doesNotMatch(source, /from ["']\.\/graphVisualization/);
    }
  });

  it("is immutable metadata with no validation or temporal runtime", () => {
    const manifest = TimelineVisualizationManifestPlatform;
    assert.ok(Object.isFrozen(manifest));
    assert.ok(Object.isFrozen(TimelineVisualizationManifestMetadata));
    assert.equal(manifest.validationExecution, false);
    assert.equal(manifest.playbackExecution, false);
    assert.equal(manifest.animationExecution, false);
    assert.equal(manifest.scheduling, false);
    assert.equal(manifest.simulation, false);
    assert.equal(manifest.rendering, false);
    assert.equal(manifest.services, false);
    assert.equal(manifest.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getTimelineVisualizationManifestSummary(),
      TimelineVisualizationManifestMetadata);
    const release = getTimelineVisualizationManifestReleaseMetadata();
    assert.equal(release.status, "ReadyForPlatform");
    assert.equal(release.validationReference, "EVE-4:4/TimelineVisualizationValidation");
  });
});
