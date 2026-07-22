import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicValidation from "./timelineVisualizationValidation.ts";
import {
  getTimelineVisualizationValidationCount,
  getTimelineVisualizationValidationReleaseMetadata,
  getTimelineVisualizationValidationSummary, TimelineVisualizationValidationId,
  TimelineVisualizationValidationMetadata, TimelineVisualizationValidationNamespace,
  TimelineVisualizationValidationPlatform, TimelineVisualizationValidationVersion,
} from "./timelineVisualizationValidation.ts";

const FILES = Object.freeze([
  "timelineVisualizationValidationTypes.ts", "timelineVisualizationValidationRules.ts",
  "timelineVisualizationValidationGates.ts", "timelineVisualizationValidationDiagnostics.ts",
  "timelineVisualizationValidationPolicies.ts", "timelineVisualizationValidationMetadata.ts",
  "timelineVisualizationValidation.ts", "timelineVisualizationValidation.test.ts",
]);

describe("EVE-4:4 Timeline & Temporal Visualization Validation", () => {
  it("adds exactly eight Validation files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicValidation).length, 8);
  });

  it("publishes the canonical identity and readiness", () => {
    assert.equal(TimelineVisualizationValidationId,
      "EVE-4:4/TimelineVisualizationValidation");
    assert.equal(TimelineVisualizationValidationVersion, "1.0.0");
    assert.equal(TimelineVisualizationValidationNamespace,
      "nexora.eve.timeline-visualization.validation");
    assert.equal(TimelineVisualizationValidationMetadata.status, "ReadyForManifest");
    assert.equal(TimelineVisualizationValidationMetadata.modelReference,
      "EVE-4:3/TimelineVisualizationModel");
  });

  it("publishes exact rule, category, and gate collections", () => {
    const validation = TimelineVisualizationValidationPlatform;
    assert.equal(validation.categories.length, 16);
    assert.equal(validation.rules.length, 16);
    assert.equal(validation.gates.length, 14);
    assert.ok(validation.gates.every(({ status }) => status === "Passed"));
    for (const collection of [validation.categories, validation.rules, validation.gates]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.deterministicOrder === index + 1));
    }
  });

  it("publishes exact diagnostic, outcome, policy, and readiness inventories", () => {
    const validation = TimelineVisualizationValidationPlatform;
    assert.equal(validation.diagnostics.length, 8);
    assert.equal(validation.severityLevels.length, 6);
    assert.equal(validation.outcomes.length, 6);
    assert.equal(validation.policies.length, 12);
    assert.equal(validation.readiness.length, 7);
    for (const collection of [validation.diagnostics, validation.severityLevels,
      validation.outcomes, validation.policies, validation.readiness]) {
      assert.ok(Object.isFrozen(collection));
    }
  });

  it("preserves Model collections by canonical reference", () => {
    const { inventory, model } = TimelineVisualizationValidationPlatform;
    assert.equal(inventory.modelInventory, model.inventory);
    assert.equal(inventory.modelDescriptors, model.descriptors);
    assert.equal(inventory.modelRelationships, model.relationships);
    assert.equal(inventory.modelComposition, model.composition);
    assert.equal(inventory.modelOwnership, model.metadata.ownership);
    assert.equal(inventory.modelBoundaries, model.registry.foundation.boundaries);
  });

  it("derives all Validation inventory counts dynamically", () => {
    const { inventory } = TimelineVisualizationValidationPlatform;
    assert.equal(inventory.counts.categoryCount, inventory.categories.length);
    assert.equal(inventory.counts.ruleCount, inventory.rules.length);
    assert.equal(inventory.counts.gateCount, inventory.gates.length);
    assert.equal(inventory.counts.diagnosticCount, inventory.diagnostics.length);
    assert.equal(inventory.counts.severityLevelCount, inventory.severityLevels.length);
    assert.equal(inventory.counts.outcomeCount, inventory.outcomes.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(inventory.counts.readinessDeclarationCount,
      inventory.readinessDeclarations.length);
    assert.equal(getTimelineVisualizationValidationCount(), inventory.rules.length);
    assert.equal(inventory.hardcodesAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
  });

  it("consumes only Timeline Visualization Model", () => {
    assert.equal(TimelineVisualizationValidationMetadata.dependency
      .timelineVisualizationModelOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationRegistry/);
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationFoundation/);
      assert.doesNotMatch(source, /from ["']\.\/graphVisualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable metadata with no validation or temporal runtime", () => {
    const validation = TimelineVisualizationValidationPlatform;
    assert.ok(Object.isFrozen(validation));
    assert.ok(Object.isFrozen(TimelineVisualizationValidationMetadata));
    assert.equal(validation.validationEngine, false);
    assert.equal(validation.runtimeValidation, false);
    assert.equal(validation.playbackExecution, false);
    assert.equal(validation.animationExecution, false);
    assert.equal(validation.scheduling, false);
    assert.equal(validation.simulation, false);
    assert.equal(validation.rendering, false);
    assert.equal(validation.services, false);
    assert.equal(validation.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getTimelineVisualizationValidationSummary(),
      TimelineVisualizationValidationMetadata);
    const release = getTimelineVisualizationValidationReleaseMetadata();
    assert.equal(release.status, "ReadyForManifest");
    assert.equal(release.modelReference, "EVE-4:3/TimelineVisualizationModel");
  });
});
