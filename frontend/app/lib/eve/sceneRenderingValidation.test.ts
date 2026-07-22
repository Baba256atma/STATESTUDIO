import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicValidation from "./sceneRenderingValidation.ts";
import {
  SceneRenderingValidation, SceneRenderingValidationId,
  SceneRenderingValidationMetadata, SceneRenderingValidationNamespace,
  SceneRenderingValidationReadiness, SceneRenderingValidationStatus,
  SceneRenderingValidationVersion,
} from "./sceneRenderingValidation.ts";

const FILES = Object.freeze([
  "sceneRenderingValidationTypes.ts", "sceneRenderingValidationRules.ts",
  "sceneRenderingValidationDiagnostics.ts", "sceneRenderingValidationPolicies.ts",
  "sceneRenderingValidationMetadata.ts", "sceneRenderingValidationInventory.ts",
  "sceneRenderingValidation.ts", "sceneRenderingValidation.test.ts",
]);

describe("EVE-2:4 Scene Rendering Validation", () => {
  it("adds exactly eight Validation files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.equal(Object.keys(PublicValidation).length, 8);
  });

  it("has canonical identity, namespace, and readiness", () => {
    assert.equal(SceneRenderingValidationId, "EVE-2:4/SceneRenderingValidation");
    assert.equal(SceneRenderingValidationVersion, "1.0.0");
    assert.equal(SceneRenderingValidationNamespace, "nexora.eve.scene-rendering.validation");
    assert.equal(SceneRenderingValidationStatus, "ReadyForManifest");
    assert.equal(SceneRenderingValidationReadiness, "ReadyForManifest");
    assert.equal(SceneRenderingValidationMetadata.modelReference, "EVE-2:3/SceneRenderingModel");
  });

  it("publishes all categories, rules, and gates deterministically", () => {
    assert.equal(SceneRenderingValidation.categories.length, 14);
    assert.equal(SceneRenderingValidation.rules.length, 14);
    assert.equal(SceneRenderingValidation.gates.length, 12);
    assert.ok(SceneRenderingValidation.rules.every((rule, index) =>
      Object.isFrozen(rule) && rule.deterministicOrder === index + 1 && !rule.executes));
    assert.ok(SceneRenderingValidation.gates.every((gate, index) =>
      Object.isFrozen(gate) && gate.deterministicOrder === index + 1 && !gate.executes));
  });

  it("publishes immutable diagnostic and policy metadata", () => {
    assert.deepEqual(SceneRenderingValidation.severityLevels, ["Information", "Warning", "Error"]);
    assert.deepEqual(SceneRenderingValidation.outcomes, ["Compliant", "NonCompliant", "NotEvaluated"]);
    assert.ok(SceneRenderingValidation.diagnostics.every((item) => Object.isFrozen(item) && !item.runtimeReporting));
    assert.ok(SceneRenderingValidation.policies.every((item) => Object.isFrozen(item) && !item.executes));
  });

  it("preserves and derives inventories only from Model", () => {
    const inventory = SceneRenderingValidation.inventory;
    assert.equal(inventory.modelDescriptorCount, SceneRenderingValidation.model.descriptors.length);
    assert.equal(inventory.relationshipCount, SceneRenderingValidation.model.relationships.length);
    assert.equal(inventory.modelInventoryReference, SceneRenderingValidation.model.inventory);
    assert.equal(inventory.modelDescriptorsReference, SceneRenderingValidation.model.descriptors);
    assert.equal(inventory.modelRelationshipsReference, SceneRenderingValidation.model.relationships);
    assert.equal(inventory.countsDerivedFromCanonicalCollections, true);
    assert.equal(inventory.hardcodesInventoryTotals, false);
    assert.equal(inventory.reconstructsModelInventory, false);
    assert.equal(inventory.duplicatesModelMetadata, false);
  });

  it("consumes only Scene Rendering Model", () => {
    assert.equal(SceneRenderingValidationMetadata.dependency.sceneRenderingModelOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/sceneRendering(?:Foundation|Registry)/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable and provides no validation or rendering runtime", () => {
    assert.ok(Object.isFrozen(SceneRenderingValidation));
    assert.ok(Object.isFrozen(SceneRenderingValidationMetadata));
    assert.ok(Object.isFrozen(SceneRenderingValidation.inventory));
    assert.equal(SceneRenderingValidation.validationEngine, false);
    assert.equal(SceneRenderingValidation.automaticRuleExecution, false);
    assert.equal(SceneRenderingValidation.runtimeDiagnostics, false);
    assert.equal(SceneRenderingValidation.rendering, false);
    assert.equal(SceneRenderingValidation.sceneExecution, false);
    assert.equal(SceneRenderingValidation.services, false);
    assert.equal(SceneRenderingValidation.factories, false);
  });
});
