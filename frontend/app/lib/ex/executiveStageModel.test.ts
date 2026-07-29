/**
 * EX-1:3 — Executive Stage Model Tests.
 *
 * Deterministic coverage for the immutable Executive Stage Model.
 * No mocks. No randomness. No network. No databases. No React.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as ModelModule from "./executiveStageModel.ts";
import {
  ExecutiveStageModel,
  ExecutiveStageModelId,
  ExecutiveStageModelName,
  ExecutiveStageModelNamespace,
  ExecutiveStageModelReadiness,
  ExecutiveStageModelStatus,
  ExecutiveStageModelVersion,
  getExecutiveStageModel,
  getExecutiveStageModelSummary,
} from "./executiveStageModel.ts";
import { ExecutiveStageRegistry } from "./executiveStageRegistry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EX13_FILES = Object.freeze([
  "executiveStageModel.ts",
  "executiveStageSurfaceModel.ts",
  "executiveStageLayerModel.ts",
  "executiveStageObjectModel.ts",
  "executiveStageRelationshipModel.ts",
  "executiveStageInteractionModel.ts",
  "executiveStageRuntimeBindings.ts",
  "executiveStageModel.test.ts",
]);

const REQUIRED_PUBLIC_EXPORTS = Object.freeze([
  "ExecutiveStageModelId",
  "ExecutiveStageModelVersion",
  "ExecutiveStageModelName",
  "ExecutiveStageModelNamespace",
  "ExecutiveStageModelStatus",
  "ExecutiveStageModelReadiness",
  "ExecutiveStageModel",
  "getExecutiveStageModelSummary",
  "getExecutiveStageModel",
  "ExecutiveStageModelIdentity",
  "ExecutiveStageModelNextPhase",
] as const);

const EXPECTED_FIRST_LEVEL = Object.freeze([
  "Identity",
  "Surface",
  "Layers",
  "Objects",
  "Relationships",
  "Focus",
  "Interaction",
  "Overlay",
  "Viewport",
  "Metadata",
] as const);

const EXPECTED_LAYERS = Object.freeze([
  "Background",
  "Relationship",
  "Object",
  "Focus",
  "Interaction",
  "Overlay",
] as const);

const EXPECTED_BINDINGS = Object.freeze([
  "Runtime Object ID",
  "Runtime Focus ID",
  "Runtime Context ID",
] as const);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|rtc)\//,
  /from ["']\.\/executive(StageFoundation|Shell|StageSurface|ObjectLayer|RelationshipLayer|FocusLayer)\.tsx["']/,
  /from ["']\.\/executiveStageTypes\.ts["']/,
  /from ["']\.\/executiveStage(Layer|Object|Interaction|Layout|Overlay)Registry\.ts["']/,
  /from ["']\.\/executiveStageRegistryMetadata\.ts["']/,
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

describe("EX-1:3 Executive Stage Model", () => {
  it("creates exactly eight Model files", () => {
    assert.equal(EX13_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of EX13_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    const modelArtifacts = present.filter((name) => EX13_FILES.includes(name));
    assert.equal(modelArtifacts.length, 8);
    assert.ok(
      !EX13_FILES.some((name) =>
        /Validation|Manifest|Platform|Certification|Freeze/i.test(name)
      ),
      "Model artifact set must not include later-phase files",
    );
  });

  it("publishes required public exports", () => {
    for (const exportName of REQUIRED_PUBLIC_EXPORTS) {
      assert.ok(
        exportName in ModelModule,
        `missing public export ${exportName}`,
      );
    }
  });

  it("publishes canonical Model identity and ReadyForValidation readiness", () => {
    assert.equal(ExecutiveStageModelId, "EX-1:3/ExecutiveStageModel");
    assert.equal(ExecutiveStageModelName, "Executive Stage Model");
    assert.equal(ExecutiveStageModelVersion, "1.0.0");
    assert.equal(
      ExecutiveStageModelNamespace,
      "nexora.ex.executive.stage.model",
    );
    assert.equal(ExecutiveStageModelStatus, "Model");
    assert.equal(ExecutiveStageModelReadiness, "ReadyForValidation");
    assert.equal(ExecutiveStageModel.identity.status, "Model");
    assert.equal(ExecutiveStageModel.identity.readiness, "ReadyForValidation");
    assert.equal(
      ExecutiveStageModel.identity.sourceRegistry,
      "EX-1:2/ExecutiveStageRegistry",
    );
    assert.equal(
      ExecutiveStageModel.identity.upstream,
      "EX-1:2 — Executive Stage Registry",
    );
    assert.equal(
      ExecutiveStageModel.nextPhase,
      "EX-1:4 — Executive Stage Validation",
    );
  });

  it("consumes EX-1:2 Registry and defines one canonical ExecutiveStage root", () => {
    assert.equal(ExecutiveStageModel.registry, ExecutiveStageRegistry);
    assert.equal(ExecutiveStageModel.root.entityName, "ExecutiveStage");
    assert.equal(ExecutiveStageModel.root.root, true);
    assert.equal(ExecutiveStageModel.root.stableIdentity, true);
    assert.equal(
      ExecutiveStageModel.root.entityId,
      "EX-1:3/Entity/ExecutiveStage",
    );
    assert.equal(ExecutiveStageModel.root.fieldCount, 10);
    assert.deepEqual(
      ExecutiveStageModel.root.fields.map((item) => item.fieldName),
      [
        "identity",
        "surface",
        "layers",
        "objects",
        "relationships",
        "focus",
        "interaction",
        "overlay",
        "viewport",
        "metadata",
      ],
    );
  });

  it("registers first-level entities and canonical model baselines", () => {
    assert.deepEqual(
      [...ExecutiveStageModel.firstLevelEntities],
      [...EXPECTED_FIRST_LEVEL],
    );
    assert.equal(ExecutiveStageModel.baselines.rootStageModels, 1);
    assert.equal(ExecutiveStageModel.baselines.firstLevelEntities, 10);
    assert.equal(ExecutiveStageModel.baselines.canonicalLayers, 6);
    assert.equal(ExecutiveStageModel.baselines.runtimeBindingTypes, 3);
    assert.equal(ExecutiveStageModel.baselines.structuralInvariants, 7);
    assert.equal(ExecutiveStageModel.baselines.ownershipLevels, 2);
  });

  it("preserves canonical layer ordering from the Registry vocabulary", () => {
    assert.deepEqual(
      [...ExecutiveStageModel.canonicalLayers],
      [...EXPECTED_LAYERS],
    );
    assert.equal(ExecutiveStageModel.layerOrder.reorderable, false);
    assert.equal(ExecutiveStageModel.layerOrder.layerCount, 6);
    assert.deepEqual(
      ExecutiveStageRegistry.layerOrder.map((name) =>
        name.replace(/ Layer$/, "")
      ),
      [...EXPECTED_LAYERS],
    );
  });

  it("defines immutable Runtime bindings and ownership hierarchy", () => {
    assert.deepEqual(
      ExecutiveStageModel.runtimeBindings.map((item) => item.name),
      [...EXPECTED_BINDINGS],
    );
    for (const binding of ExecutiveStageModel.runtimeBindings) {
      assert.equal(binding.mutable, false);
      assert.equal(binding.allowsDirectMutation, false);
      assert.equal(binding.immutable, true);
    }
    assert.equal(ExecutiveStageModel.ownership.root, "ExecutiveStage");
    assert.equal(ExecutiveStageModel.ownership.ownershipLevels, 2);
    assert.equal(ExecutiveStageModel.ownership.childNeverOwnsStage, true);
    assert.deepEqual([...ExecutiveStageModel.ownership.ownedByRoot], [
      "Surface",
      "Layers",
      "Objects",
      "Relationships",
      "Focus",
      "Interaction",
      "Overlay",
      "Viewport",
    ]);
    assert.equal(ExecutiveStageModel.ownershipEdges.length, 8);
  });

  it("declares seven structural invariants and unique entity identities", () => {
    assert.equal(ExecutiveStageModel.invariants.length, 7);
    assertUnique(
      ExecutiveStageModel.invariants.map((item) => item.invariantId),
      "invariant ids",
    );
    assertUnique(
      ExecutiveStageModel.entities.map((item) => item.entityId),
      "entity ids",
    );
    for (const entity of ExecutiveStageModel.entities) {
      assert.equal(entity.stableIdentity, true);
      assert.equal(entity.ownsBusinessState, false);
      assert.equal(entity.executable, false);
      assert.equal(entity.immutable, true);
    }
  });

  it("remains non-rendering and Runtime-mutation free", () => {
    assert.equal(ExecutiveStageModel.rendersUi, false);
    assert.equal(ExecutiveStageModel.ownsRuntimeState, false);
    assert.equal(ExecutiveStageModel.ownsBusinessState, false);
    assert.ok(ExecutiveStageModel.prohibitedSurfaces.includes("render UI"));
    assert.ok(ExecutiveStageModel.prohibitedSurfaces.includes("modify Runtime"));
    assert.ok(
      ExecutiveStageModel.prohibitedSurfaces.includes("object animation"),
    );
    const summary = getExecutiveStageModelSummary();
    assert.equal(summary.readiness, "ReadyForValidation");
    assert.equal(summary.rendersUi, false);
    assert.equal(getExecutiveStageModel(), ExecutiveStageModel);
  });

  it("forbids React, rendering, and non-Registry upstream imports in Model sources", () => {
    for (const file of EX13_FILES) {
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
    const aggregate = readFileSync(`${HERE}/executiveStageModel.ts`, "utf8");
    assert.match(
      aggregate,
      /from ["']\.\/executiveStageRegistry\.ts["']/,
    );
  });
});
