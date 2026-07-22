import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicRegistry from "./timelineVisualizationRegistry.ts";
import {
  getTimelineVisualizationRegistryCount, getTimelineVisualizationRegistryReleaseMetadata,
  getTimelineVisualizationRegistrySummary, TimelineVisualizationRegistryId,
  TimelineVisualizationRegistryMetadata, TimelineVisualizationRegistryNamespace,
  TimelineVisualizationRegistryPlatform, TimelineVisualizationRegistryVersion,
} from "./timelineVisualizationRegistry.ts";

const FILES = Object.freeze([
  "timelineVisualizationRegistryTypes.ts", "timelineVisualizationRegistryCatalog.ts",
  "timelineVisualizationRegistryInventory.ts", "timelineVisualizationRegistryPolicies.ts",
  "timelineVisualizationRegistryExtensions.ts", "timelineVisualizationRegistryMetadata.ts",
  "timelineVisualizationRegistry.ts", "timelineVisualizationRegistry.test.ts",
]);

describe("EVE-4:2 Timeline & Temporal Visualization Registry", () => {
  it("adds exactly eight Registry files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicRegistry).length, 8);
  });

  it("publishes the canonical identity and readiness", () => {
    assert.equal(TimelineVisualizationRegistryId,
      "EVE-4:2/TimelineVisualizationRegistry");
    assert.equal(TimelineVisualizationRegistryVersion, "1.0.0");
    assert.equal(TimelineVisualizationRegistryNamespace,
      "nexora.eve.timeline-visualization.registry");
    assert.equal(TimelineVisualizationRegistryMetadata.status, "ReadyForModel");
    assert.equal(TimelineVisualizationRegistryMetadata.foundationReference,
      "EVE-4:1/TimelineVisualizationFoundation");
  });

  it("publishes exact Foundation-aligned categories and vocabularies", () => {
    const { catalog, foundation } = TimelineVisualizationRegistryPlatform;
    assert.equal(catalog.length, 18);
    assert.equal(TimelineVisualizationRegistryPlatform.inventory.vocabularyRegistries.length, 18);
    catalog.forEach((category, index) => {
      assert.ok(Object.isFrozen(category));
      assert.ok(Object.isFrozen(category.entries));
      assert.equal(category.deterministicOrder, index + 1);
      assert.equal(category.foundationContractReference, foundation.contracts[index]);
      assert.ok(category.entries.every((entry, entryIndex) => Object.isFrozen(entry)
        && entry.deterministicOrder === entryIndex + 1
        && entry.foundationContractReference === foundation.contracts[index]));
    });
  });

  it("publishes exact immutable policy and extension collections", () => {
    assert.equal(TimelineVisualizationRegistryPlatform.policies.length, 12);
    assert.equal(TimelineVisualizationRegistryPlatform.extensions.length, 14);
    for (const collection of [TimelineVisualizationRegistryPlatform.policies,
      TimelineVisualizationRegistryPlatform.extensions]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) => Object.isFrozen(entry)
        && entry.deterministicOrder === index + 1));
    }
  });

  it("preserves all Foundation architecture collections by reference", () => {
    const { foundation, inventory } = TimelineVisualizationRegistryPlatform;
    assert.equal(inventory.foundationContracts, foundation.contracts);
    assert.equal(inventory.foundationOwnership, foundation.ownership);
    assert.equal(inventory.foundationBoundaries, foundation.boundaries);
    assert.equal(inventory.foundationLifecycle, foundation.lifecycle);
    assert.equal(inventory.foundationCapabilities, foundation.capabilities);
    assert.equal(inventory.foundationCollectionsPreservedByReference, true);
  });

  it("derives Registry inventory counts dynamically", () => {
    const { inventory } = TimelineVisualizationRegistryPlatform;
    assert.equal(inventory.counts.vocabularyRegistryCount, inventory.vocabularyRegistries.length);
    assert.equal(inventory.counts.categoryCount, inventory.categories.length);
    assert.equal(inventory.counts.registryEntryCount, inventory.entries.length);
    assert.equal(inventory.counts.policyCount, inventory.policies.length);
    assert.equal(inventory.counts.extensionClassificationCount, inventory.extensions.length);
    assert.equal(getTimelineVisualizationRegistryCount(), inventory.entries.length);
    assert.equal(inventory.hardcodesAggregateCounts, false);
    assert.equal(inventory.reconstructsFoundationCollections, false);
  });

  it("consumes only Timeline Visualization Foundation", () => {
    assert.equal(TimelineVisualizationRegistryMetadata.dependency
      .timelineVisualizationFoundationOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/graphVisualization/);
      assert.doesNotMatch(source, /from ["']\.\/sceneRendering/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable metadata with no temporal or visualization runtime", () => {
    assert.ok(Object.isFrozen(TimelineVisualizationRegistryPlatform));
    assert.ok(Object.isFrozen(TimelineVisualizationRegistryMetadata));
    assert.equal(TimelineVisualizationRegistryPlatform.playbackExecution, false);
    assert.equal(TimelineVisualizationRegistryPlatform.animationExecution, false);
    assert.equal(TimelineVisualizationRegistryPlatform.scheduling, false);
    assert.equal(TimelineVisualizationRegistryPlatform.simulation, false);
    assert.equal(TimelineVisualizationRegistryPlatform.graphProcessing, false);
    assert.equal(TimelineVisualizationRegistryPlatform.rendering, false);
    assert.equal(TimelineVisualizationRegistryPlatform.services, false);
    assert.equal(TimelineVisualizationRegistryPlatform.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getTimelineVisualizationRegistrySummary(), TimelineVisualizationRegistryMetadata);
    const release = getTimelineVisualizationRegistryReleaseMetadata();
    assert.equal(release.status, "ReadyForModel");
    assert.equal(release.foundationReference, "EVE-4:1/TimelineVisualizationFoundation");
  });
});
