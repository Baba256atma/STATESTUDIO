import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicValidation from "./visualizationValidation.ts";
import {
  VisualizationValidation, VisualizationValidationId,
  VisualizationValidationMetadata, VisualizationValidationNamespace,
  VisualizationValidationReadiness, VisualizationValidationStatus,
  VisualizationValidationVersion,
} from "./visualizationValidation.ts";

const FILES = Object.freeze([
  "visualizationValidationTypes.ts", "visualizationValidationRules.ts",
  "visualizationValidationDiagnostics.ts", "visualizationValidationPolicies.ts",
  "visualizationValidationMetadata.ts", "visualizationValidationInventory.ts",
  "visualizationValidation.ts", "visualizationValidation.test.ts",
]);

describe("EVE-1:4 Visualization Validation", () => {
  it("adds exactly eight Validation files and eight public exports", () => {
    const present = readdirSync(import.meta.dirname);
    assert.ok(FILES.every((file) => present.includes(file)));
    assert.equal(Object.keys(PublicValidation).length, 8);
  });

  it("has canonical Validation identity and readiness", () => {
    assert.equal(VisualizationValidationId, "EVE-1:4/VisualizationValidation");
    assert.equal(VisualizationValidationVersion, "1.0.0");
    assert.equal(VisualizationValidationNamespace, "nexora.eve.visualization.validation");
    assert.equal(VisualizationValidationStatus, "Validation");
    assert.equal(VisualizationValidationReadiness, "ReadyForManifest");
  });

  it("publishes all required rules and gates deterministically", () => {
    assert.equal(VisualizationValidation.categories.length, 14);
    assert.equal(VisualizationValidation.rules.length, 14);
    assert.equal(VisualizationValidation.gates.length, 14);
    assert.ok(VisualizationValidation.rules.every((rule, index) => rule.deterministicOrder === index + 1 && !rule.executes));
    assert.ok(VisualizationValidation.gates.every((gate, index) => gate.deterministicOrder === index + 1 && !gate.executes));
  });

  it("publishes descriptive diagnostics, results, severity, and policies", () => {
    assert.deepEqual(VisualizationValidation.severityLevels, ["Information", "Warning", "Error"]);
    assert.deepEqual(VisualizationValidation.results, ["Compliant", "NonCompliant", "NotEvaluated"]);
    assert.ok(VisualizationValidation.diagnostics.every(({ runtimeDiagnostic }) => !runtimeDiagnostic));
    assert.ok(VisualizationValidation.policies.every(Object.isFrozen));
  });

  it("derives inventory canonically from Model", () => {
    const inventory = VisualizationValidation.inventory;
    assert.equal(inventory.ruleCount, VisualizationValidation.rules.length);
    assert.equal(inventory.gateCount, VisualizationValidation.gates.length);
    assert.equal(inventory.modelCount, VisualizationValidation.model.descriptors.length);
    assert.equal(inventory.relationshipCount, VisualizationValidation.model.relationships.length);
    assert.equal(inventory.countsDerivedFromCanonicalCollections, true);
    assert.equal(inventory.reconstructsModelInventory, false);
    assert.equal(inventory.duplicatesModelMetadata, false);
  });

  it("consumes only Visualization Model", () => {
    assert.equal(VisualizationValidationMetadata.dependency.visualizationModelOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/visualization(?:Foundation|Registry)/);
      const parentImports = [...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)];
      assert.equal(parentImports.length, 0);
    }
  });

  it("is immutable and has no runtime validator or diagnostics", () => {
    assert.ok(Object.isFrozen(VisualizationValidation));
    assert.ok(Object.isFrozen(VisualizationValidationMetadata));
    assert.ok(Object.isFrozen(VisualizationValidation.rules));
    assert.ok(Object.isFrozen(VisualizationValidation.gates));
    assert.equal(VisualizationValidation.validationEngine, false);
    assert.equal(VisualizationValidation.automaticRuleExecution, false);
    assert.equal(VisualizationValidation.runtimeDiagnostics, false);
    assert.equal(VisualizationValidation.services, false);
    assert.equal(VisualizationValidation.factories, false);
    assert.equal(VisualizationValidation.rendering, false);
  });
});
