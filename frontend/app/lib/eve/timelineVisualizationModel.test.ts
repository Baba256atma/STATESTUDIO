import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicModel from "./timelineVisualizationModel.ts";
import {
  getTimelineVisualizationModelCount, getTimelineVisualizationModelReleaseMetadata,
  getTimelineVisualizationModelSummary, TimelineVisualizationModelId,
  TimelineVisualizationModelMetadata, TimelineVisualizationModelNamespace,
  TimelineVisualizationModelPlatform, TimelineVisualizationModelVersion,
} from "./timelineVisualizationModel.ts";

const FILES = Object.freeze([
  "timelineVisualizationModelTypes.ts", "timelineVisualizationModelDescriptors.ts",
  "timelineVisualizationModelRelationships.ts", "timelineVisualizationModelPolicies.ts",
  "timelineVisualizationModelMetadata.ts", "timelineVisualizationModelInventory.ts",
  "timelineVisualizationModel.ts", "timelineVisualizationModel.test.ts",
]);

describe("EVE-4:3 Timeline & Temporal Visualization Model", () => {
  it("adds exactly eight Model files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicModel).length, 8);
  });

  it("publishes the canonical identity and readiness", () => {
    assert.equal(TimelineVisualizationModelId, "EVE-4:3/TimelineVisualizationModel");
    assert.equal(TimelineVisualizationModelVersion, "1.0.0");
    assert.equal(TimelineVisualizationModelNamespace,
      "nexora.eve.timeline-visualization.model");
    assert.equal(TimelineVisualizationModelMetadata.status, "ReadyForValidation");
    assert.equal(TimelineVisualizationModelMetadata.registryReference,
      "EVE-4:2/TimelineVisualizationRegistry");
  });

  it("publishes exactly eighteen immutable typed model descriptors", () => {
    const descriptors = TimelineVisualizationModelPlatform.descriptors;
    assert.equal(descriptors.length, 18);
    assert.equal(new Set(descriptors.map(({ id }) => id)).size, descriptors.length);
    assert.ok(Object.isFrozen(descriptors));
    assert.ok(descriptors.every((descriptor, index) => Object.isFrozen(descriptor)
      && descriptor.deterministicOrder === index + 1
      && TimelineVisualizationModelPlatform.registry.catalog.some(
        (category) => category === descriptor.registryReference)));
  });

  it("publishes exactly sixteen canonical relationship descriptors", () => {
    const relationships = TimelineVisualizationModelPlatform.relationships;
    assert.equal(relationships.length, 16);
    assert.ok(Object.isFrozen(relationships));
    assert.ok(relationships.every((relationship, index) => Object.isFrozen(relationship)
      && relationship.deterministicOrder === index + 1
      && !relationship.playbackExecutionProvided));
  });

  it("publishes twelve policies and immutable structural composition", () => {
    assert.equal(TimelineVisualizationModelPlatform.policies.length, 12);
    assert.equal(TimelineVisualizationModelPlatform.composition.length, 16);
    assert.ok(TimelineVisualizationModelPlatform.policies.every(Object.isFrozen));
    assert.ok(TimelineVisualizationModelPlatform.composition.every(Object.isFrozen));
  });

  it("preserves Registry collections and Foundation reachability by reference", () => {
    const { inventory, registry } = TimelineVisualizationModelPlatform;
    assert.equal(inventory.registryCatalog, registry.catalog);
    assert.equal(inventory.registryInventory, registry.inventory);
    assert.equal(inventory.registryPolicies, registry.policies);
    assert.equal(inventory.registryExtensions, registry.extensions);
    assert.equal(inventory.registryFoundationReference, registry.foundation);
    assert.equal(inventory.registryCollectionsPreservedByReference, true);
  });

  it("derives Model inventory counts dynamically", () => {
    const { inventory } = TimelineVisualizationModelPlatform;
    assert.equal(inventory.counts.modelCount, inventory.models.length);
    assert.equal(inventory.counts.relationshipCount, inventory.relationships.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(inventory.counts.compositionEntryCount, inventory.structuralComposition.length);
    assert.equal(getTimelineVisualizationModelCount(), inventory.models.length);
    assert.equal(inventory.hardcodesAggregateTotals, false);
    assert.equal(inventory.reconstructsRegistryCollections, false);
  });

  it("consumes only Timeline Visualization Registry", () => {
    assert.equal(TimelineVisualizationModelMetadata.dependency
      .timelineVisualizationRegistryOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/timelineVisualizationFoundation/);
      assert.doesNotMatch(source, /from ["']\.\/graphVisualization/);
      assert.doesNotMatch(source, /from ["']\.\/sceneRendering/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable metadata with no temporal or visualization runtime", () => {
    assert.ok(Object.isFrozen(TimelineVisualizationModelPlatform));
    assert.ok(Object.isFrozen(TimelineVisualizationModelMetadata));
    assert.equal(TimelineVisualizationModelPlatform.playbackExecution, false);
    assert.equal(TimelineVisualizationModelPlatform.animationExecution, false);
    assert.equal(TimelineVisualizationModelPlatform.scheduling, false);
    assert.equal(TimelineVisualizationModelPlatform.simulation, false);
    assert.equal(TimelineVisualizationModelPlatform.rendering, false);
    assert.equal(TimelineVisualizationModelPlatform.services, false);
    assert.equal(TimelineVisualizationModelPlatform.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getTimelineVisualizationModelSummary(), TimelineVisualizationModelMetadata);
    const release = getTimelineVisualizationModelReleaseMetadata();
    assert.equal(release.status, "ReadyForValidation");
    assert.equal(release.registryReference, "EVE-4:2/TimelineVisualizationRegistry");
  });
});
