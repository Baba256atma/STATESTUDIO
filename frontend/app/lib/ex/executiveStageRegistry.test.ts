/**
 * EX-1:2 — Executive Stage Registry Tests.
 *
 * Deterministic coverage for the immutable Executive Stage Registry.
 * No mocks. No randomness. No network. No databases. No React.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveStageFoundationIdentity } from "./executiveStageTypes.ts";
import * as RegistryModule from "./executiveStageRegistry.ts";
import {
  ExecutiveStageRegistry,
  ExecutiveStageRegistryId,
  ExecutiveStageRegistryName,
  ExecutiveStageRegistryNamespace,
  ExecutiveStageRegistryReadiness,
  ExecutiveStageRegistryStatus,
  ExecutiveStageRegistryVersion,
  getExecutiveStageRegistry,
  getExecutiveStageRegistrySummary,
} from "./executiveStageRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EX12_FILES = Object.freeze([
  "executiveStageRegistry.ts",
  "executiveStageLayerRegistry.ts",
  "executiveStageObjectRegistry.ts",
  "executiveStageInteractionRegistry.ts",
  "executiveStageLayoutRegistry.ts",
  "executiveStageOverlayRegistry.ts",
  "executiveStageRegistryMetadata.ts",
  "executiveStageRegistry.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveStageRegistryId",
  "ExecutiveStageRegistryVersion",
  "ExecutiveStageRegistryName",
  "ExecutiveStageRegistryNamespace",
  "ExecutiveStageRegistryStatus",
  "ExecutiveStageRegistryReadiness",
  "ExecutiveStageRegistry",
  "getExecutiveStageRegistrySummary",
  "getExecutiveStageRegistry",
] as const);

const EXPECTED_DOMAINS = Object.freeze([
  "Stage",
  "Layer",
  "Object",
  "Focus",
  "Relationship",
  "Interaction",
  "Layout",
  "Overlay",
  "VisualState",
  "Metadata",
] as const);

const EXPECTED_STAGES = Object.freeze([
  "Executive Stage",
  "Executive Shell",
  "Stage Surface",
] as const);

const EXPECTED_LAYERS = Object.freeze([
  "Background Layer",
  "Relationship Layer",
  "Object Layer",
  "Focus Layer",
  "Interaction Layer",
  "Overlay Layer",
] as const);

const EXPECTED_OBJECTS = Object.freeze([
  "Executive Object",
  "Business Object",
  "Knowledge Object",
  "Relationship Object",
  "Placeholder Object",
] as const);

const EXPECTED_FOCUS = Object.freeze([
  "No Focus",
  "Object Focus",
  "Workspace Focus",
  "Pack Focus",
  "Timeline Focus",
] as const);

const EXPECTED_INTERACTIONS = Object.freeze([
  "Click",
  "Double Click",
  "Hover",
  "Context Menu",
  "Keyboard Focus",
  "Selection",
] as const);

const EXPECTED_VISUAL_STATES = Object.freeze([
  "Initializing",
  "Loading",
  "Ready",
  "Empty",
  "Error",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|rtc)\//,
  /from ["']\.\/executive(StageFoundation|Shell|StageSurface|ObjectLayer|RelationshipLayer|FocusLayer)\.tsx["']/,
]);

const PROHIBITED_SOURCE_PATTERNS = Object.freeze([
  /\bcreateElement\b/,
  /\buseState\b/,
  /\buseEffect\b/,
  /\bjsx\b/i,
  /\brender\s*\(/,
  /\brequestAnimationFrame\b/,
]);

const assertUnique = (values: readonly string[], label: string): void => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

const namesOf = (
  entries: readonly { readonly name: string }[],
): readonly string[] => entries.map((entry) => entry.name);

describe("EX-1:2 Executive Stage Registry", () => {
  it("creates exactly eight Registry files", () => {
    assert.equal(EX12_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EX12_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    const registryArtifacts = present.filter((name) =>
      EX12_FILES.includes(name)
    );
    assert.equal(registryArtifacts.length, 8);
  });

  it("publishes required public exports", () => {
    for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
      assert.ok(
        exportName in RegistryModule,
        `missing public export ${exportName}`,
      );
    }
  });

  it("publishes canonical Registry identity and ReadyForModel readiness", () => {
    assert.equal(
      ExecutiveStageRegistryId,
      "EX-1:2/ExecutiveStageRegistry",
    );
    assert.equal(ExecutiveStageRegistryName, "Executive Stage Registry");
    assert.equal(ExecutiveStageRegistryVersion, "1.0.0");
    assert.equal(
      ExecutiveStageRegistryNamespace,
      "nexora.ex.executive.stage.registry",
    );
    assert.equal(ExecutiveStageRegistryStatus, "Registry");
    assert.equal(ExecutiveStageRegistryReadiness, "ReadyForModel");
    assert.equal(ExecutiveStageRegistry.identity.status, "Registry");
    assert.equal(ExecutiveStageRegistry.identity.readiness, "ReadyForModel");
    assert.equal(
      ExecutiveStageRegistry.identity.upstream,
      "EX-1:1 — Executive Stage Foundation",
    );
    assert.equal(
      ExecutiveStageRegistry.nextPhase,
      "EX-1:3 — Executive Stage Model",
    );
    assert.equal(
      ExecutiveStageRegistry.foundation.id,
      ExecutiveStageFoundationIdentity.id,
    );
  });

  it("registers ten domains and canonical baseline counts", () => {
    assert.deepEqual(
      [...ExecutiveStageRegistry.domains],
      [...EXPECTED_DOMAINS],
    );
    assert.equal(ExecutiveStageRegistry.baselines.registryDomains, 10);
    assert.equal(ExecutiveStageRegistry.baselines.stageIdentities, 3);
    assert.equal(ExecutiveStageRegistry.baselines.layerIdentities, 6);
    assert.equal(ExecutiveStageRegistry.baselines.objectCategories, 5);
    assert.equal(ExecutiveStageRegistry.baselines.focusCategories, 5);
    assert.equal(ExecutiveStageRegistry.baselines.interactionTypes, 6);
    assert.equal(ExecutiveStageRegistry.baselines.visualStates, 5);
  });

  it("registers stage, layer, object, focus, interaction, and visual state identities", () => {
    assert.deepEqual(namesOf(ExecutiveStageRegistry.stages), [
      ...EXPECTED_STAGES,
    ]);
    assert.deepEqual(namesOf(ExecutiveStageRegistry.layers), [
      ...EXPECTED_LAYERS,
    ]);
    assert.deepEqual(namesOf(ExecutiveStageRegistry.objects), [
      ...EXPECTED_OBJECTS,
    ]);
    assert.deepEqual(namesOf(ExecutiveStageRegistry.focuses), [
      ...EXPECTED_FOCUS,
    ]);
    assert.deepEqual(namesOf(ExecutiveStageRegistry.interactions), [
      ...EXPECTED_INTERACTIONS,
    ]);
    assert.deepEqual(namesOf(ExecutiveStageRegistry.visualStates), [
      ...EXPECTED_VISUAL_STATES,
    ]);
  });

  it("defines canonical layer ordering", () => {
    assert.deepEqual([...ExecutiveStageRegistry.layerOrder], [
      ...EXPECTED_LAYERS,
    ]);
    for (let index = 0; index < ExecutiveStageRegistry.layers.length; index++) {
      assert.equal(ExecutiveStageRegistry.layers[index]?.order, index + 1);
      assert.equal(
        ExecutiveStageRegistry.layers[index]?.name,
        EXPECTED_LAYERS[index],
      );
    }
  });

  it("guarantees unique identities across the registry", () => {
    const ids = ExecutiveStageRegistry.entries.map((entry) => entry.id);
    const canonical = ExecutiveStageRegistry.entries.map(
      (entry) => entry.canonicalIdentity,
    );
    assertUnique(ids, "entry ids");
    assertUnique(canonical, "canonical identities");
    assert.ok(ExecutiveStageRegistry.entries.length > 0);
    for (const entry of ExecutiveStageRegistry.entries) {
      assert.equal(entry.status, "Registered");
      assert.equal(entry.rendersUi, false);
      assert.equal(entry.executable, false);
      assert.equal(entry.immutable, true);
    }
  });

  it("remains Runtime-independent and non-rendering", () => {
    assert.equal(ExecutiveStageRegistry.ownsRuntimeState, false);
    assert.equal(ExecutiveStageRegistry.rendersUi, false);
    assert.equal(ExecutiveStageRegistry.metadataOnly, true);
    assert.ok(
      ExecutiveStageRegistry.prohibitedSurfaces.includes("render UI"),
    );
    assert.ok(
      ExecutiveStageRegistry.prohibitedSurfaces.includes("manage Runtime"),
    );
    assert.ok(
      ExecutiveStageRegistry.prohibitedSurfaces.includes("React rendering"),
    );
  });

  it("exposes summary and resolver helpers", () => {
    const summary = getExecutiveStageRegistrySummary();
    assert.equal(summary.id, ExecutiveStageRegistryId);
    assert.equal(summary.readiness, "ReadyForModel");
    assert.equal(summary.rendersUi, false);
    assert.equal(summary.ownsRuntimeState, false);
    assert.equal(getExecutiveStageRegistry(), ExecutiveStageRegistry);
  });

  it("forbids React, Runtime, and rendering imports in Registry sources", () => {
    for (const file of EX12_FILES) {
      if (!file.endsWith(".ts") || file.endsWith(".test.ts")) {
        continue;
      }
      const source = readFileSync(`${HERE}/${file}`, "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.equal(
          pattern.test(source),
          false,
          `${file} must not match ${pattern}`,
        );
      }
      for (const pattern of PROHIBITED_SOURCE_PATTERNS) {
        assert.equal(
          pattern.test(source),
          false,
          `${file} must not match ${pattern}`,
        );
      }
    }
  });
});
