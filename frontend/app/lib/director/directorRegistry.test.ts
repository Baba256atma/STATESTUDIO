import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicRegistry from "./directorRegistry.ts";
import {
  DirectorRegistry,
  DirectorRegistryId,
  DirectorRegistryLayer,
  DirectorRegistryNamespace,
  DirectorRegistryReadiness,
  DirectorRegistryStatus,
  DirectorRegistryVersion,
} from "./directorRegistry.ts";

const FILES = Object.freeze([
  "directorRegistryTypes.ts", "directorSceneRegistry.ts",
  "directorCameraRegistry.ts", "directorTimelineRegistry.ts",
  "directorVisualizationRegistry.ts", "directorRegistry.ts",
  "directorRegistryMetadata.ts", "directorRegistry.test.ts",
]);

const collections = Object.freeze([
  DirectorRegistry.scenes.sceneTypes,
  DirectorRegistry.scenes.sceneObjectTypes,
  DirectorRegistry.scenes.sceneLayerTypes,
  DirectorRegistry.scenes.sceneMarkerTypes,
  DirectorRegistry.cameras.focusTypes,
  DirectorRegistry.cameras.targetTypes,
  DirectorRegistry.timelines.timelineTypes,
  DirectorRegistry.timelines.timelineScaleTypes,
  DirectorRegistry.timelines.transitionTypes,
  DirectorRegistry.timelines.animationInstructionTypes,
  DirectorRegistry.visualizations.intentTypes,
  DirectorRegistry.visualizations.executiveFocusTypes,
]);

describe("DIRECTOR-1:2 Director Registry", () => {
  it("has canonical identity and readiness", () => {
    assert.equal(DirectorRegistryId, "DIRECTOR-1:2/DirectorRegistry");
    assert.equal(DirectorRegistryVersion, "1.0.0");
    assert.equal(DirectorRegistryNamespace, "nexora.director.registry");
    assert.equal(DirectorRegistryLayer, "Director");
    assert.equal(DirectorRegistryStatus, "Registry");
    assert.equal(DirectorRegistryReadiness, "ReadyForModel");
  });

  it("adds exactly the eight requested Registry files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.equal(Object.keys(PublicRegistry).length, 8);
  });

  it("publishes all twelve immutable registries", () => {
    assert.equal(collections.length, 12);
    assert.ok(collections.every((registry) => Object.isFrozen(registry)));
    assert.ok(collections.every((registry) => registry.length > 0));
    assert.ok(collections.flat().every((entry) => Object.isFrozen(entry)));
  });

  it("uses complete, unique metadata and deterministic ordering", () => {
    const entries = collections.flat();
    assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
    assert.ok(entries.every(({ id, name, description, category, version, namespace, stability }) =>
      Boolean(id && name && description && category && version && namespace && stability)));
    assert.ok(collections.every((registry) => registry.every(
      (entry, index) => entry.deterministicOrder === index + 1,
    )));
  });

  it("consumes only Foundation and exposes no runtime facilities", () => {
    assert.equal(DirectorRegistry.metadata.dependency.foundationOnly, true);
    assert.equal(DirectorRegistry.metadata.dependency.foundationId, "DIRECTOR-1:1/DirectorFoundation");
    assert.equal(DirectorRegistry.metadata.dependency.importsEve, false);
    assert.equal(DirectorRegistry.metadata.dependency.importsFutureDirectorPhases, false);
    assert.equal(DirectorRegistry.services, false);
    assert.equal(DirectorRegistry.factories, false);
    assert.equal(DirectorRegistry.execution, false);
    assert.ok(Object.isFrozen(DirectorRegistry));
  });
});
