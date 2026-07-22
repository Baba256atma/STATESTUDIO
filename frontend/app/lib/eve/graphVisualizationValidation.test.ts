import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import * as PublicValidation from "./graphVisualizationValidation.ts";
import {
  getGraphVisualizationValidationCount, getGraphVisualizationValidationReleaseMetadata,
  getGraphVisualizationValidationSummary, GraphVisualizationValidation,
  GraphVisualizationValidationIdentity, GraphVisualizationValidationInventory,
  GraphVisualizationValidationMetadata, GraphVisualizationValidationReadiness,
} from "./graphVisualizationValidation.ts";

const FILES = Object.freeze([
  "graphVisualizationValidationTypes.ts", "graphVisualizationValidationRules.ts",
  "graphVisualizationValidationGates.ts", "graphVisualizationValidationDiagnostics.ts",
  "graphVisualizationValidationPolicies.ts", "graphVisualizationValidationInventory.ts",
  "graphVisualizationValidation.ts", "graphVisualizationValidation.test.ts",
]);

describe("EVE-3:4 Graph Visualization Validation", () => {
  it("adds exactly eight Validation files and eight public exports", () => {
    assert.ok(FILES.every((file) => readdirSync(import.meta.dirname).includes(file)));
    assert.equal(Object.keys(PublicValidation).length, 8);
  });

  it("has canonical identity, namespace, and readiness", () => {
    assert.equal(GraphVisualizationValidationIdentity.id,
      "EVE-3:4/GraphVisualizationValidation");
    assert.equal(GraphVisualizationValidationIdentity.version, "1.0.0");
    assert.equal(GraphVisualizationValidationIdentity.namespace,
      "nexora.eve.graph-visualization.validation");
    assert.equal(GraphVisualizationValidationMetadata.status, "ReadyForManifest");
    assert.equal(GraphVisualizationValidationReadiness.status, "ReadyForManifest");
    assert.equal(GraphVisualizationValidationMetadata.modelReference,
      "EVE-3:3/GraphVisualizationModel");
  });

  it("publishes exact immutable category, rule, and gate inventories", () => {
    assert.equal(GraphVisualizationValidation.categories.length, 16);
    assert.equal(GraphVisualizationValidation.rules.length, 16);
    assert.equal(GraphVisualizationValidation.gates.length, 14);
    for (const collection of [GraphVisualizationValidation.categories,
      GraphVisualizationValidation.rules, GraphVisualizationValidation.gates]) {
      assert.ok(Object.isFrozen(collection));
      assert.ok(collection.every((entry, index) =>
        Object.isFrozen(entry) && entry.deterministicOrder === index + 1));
    }
  });

  it("publishes exact diagnostic, severity, outcome, policy, and readiness inventories", () => {
    assert.equal(GraphVisualizationValidation.diagnostics.length, 8);
    assert.equal(GraphVisualizationValidation.severityLevels.length, 6);
    assert.equal(GraphVisualizationValidation.outcomes.length, 6);
    assert.equal(GraphVisualizationValidation.policies.length, 12);
    assert.equal(GraphVisualizationValidation.readiness.declarations.length, 7);
    assert.ok(GraphVisualizationValidation.diagnostics.every(Object.isFrozen));
    assert.ok(GraphVisualizationValidation.policies.every((entry) =>
      Object.isFrozen(entry) && !entry.executes));
  });

  it("preserves Model collections, ownership, and boundaries by reference", () => {
    assert.equal(GraphVisualizationValidationInventory.modelInventory,
      GraphVisualizationValidation.model.inventory);
    assert.equal(GraphVisualizationValidationInventory.modelDescriptors,
      GraphVisualizationValidation.model.descriptors);
    assert.equal(GraphVisualizationValidationInventory.modelRelationships,
      GraphVisualizationValidation.model.relationships);
    assert.equal(GraphVisualizationValidationInventory.modelComposition,
      GraphVisualizationValidation.model.composition);
    assert.equal(GraphVisualizationValidationMetadata.ownership.modelOwnershipReference,
      GraphVisualizationValidation.model.metadata.ownership);
    assert.equal(GraphVisualizationValidationMetadata.boundaryReference,
      GraphVisualizationValidation.model.registry.foundation.boundaries);
  });

  it("derives all inventory counts from immutable collections", () => {
    const inventory = GraphVisualizationValidationInventory;
    assert.equal(inventory.categoryCount, GraphVisualizationValidation.categories.length);
    assert.equal(inventory.ruleCount, GraphVisualizationValidation.rules.length);
    assert.equal(inventory.gateCount, GraphVisualizationValidation.gates.length);
    assert.equal(inventory.diagnosticCount, GraphVisualizationValidation.diagnostics.length);
    assert.equal(inventory.policyCount, GraphVisualizationValidation.policies.length);
    assert.equal(inventory.readinessDeclarationCount,
      GraphVisualizationValidation.readiness.declarations.length);
    assert.equal(inventory.hardcodesAggregateTotals, false);
    assert.equal(inventory.reconstructsUpstreamCollections, false);
    assert.equal(getGraphVisualizationValidationCount(), GraphVisualizationValidation.rules.length);
  });

  it("consumes only Graph Visualization Model", () => {
    assert.equal(GraphVisualizationValidationMetadata.dependency.graphVisualizationModelOnly, true);
    for (const file of FILES.filter((name) => !name.endsWith(".test.ts"))) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      assert.doesNotMatch(source, /from ["']\.\/graphVisualization(?:Registry|Foundation)/);
      assert.doesNotMatch(source, /from ["']\.\/sceneRendering/);
      assert.doesNotMatch(source, /from ["']\.\/visualization/);
      assert.equal([...source.matchAll(/from ["'](\.\.\/[^"']+)["']/g)].length, 0);
    }
  });

  it("is immutable and exposes no validation, graph, or rendering runtime", () => {
    assert.ok(Object.isFrozen(GraphVisualizationValidation));
    assert.ok(Object.isFrozen(GraphVisualizationValidationMetadata));
    assert.ok(Object.isFrozen(GraphVisualizationValidationInventory));
    assert.equal(GraphVisualizationValidation.validationEngine, false);
    assert.equal(GraphVisualizationValidation.runtimeValidation, false);
    assert.equal(GraphVisualizationValidation.analyticsExecution, false);
    assert.equal(GraphVisualizationValidation.traversal, false);
    assert.equal(GraphVisualizationValidation.pathfinding, false);
    assert.equal(GraphVisualizationValidation.layoutExecution, false);
    assert.equal(GraphVisualizationValidation.rendering, false);
    assert.equal(GraphVisualizationValidation.services, false);
    assert.equal(GraphVisualizationValidation.factories, false);
  });

  it("provides stable summary and release metadata", () => {
    assert.equal(getGraphVisualizationValidationSummary(), GraphVisualizationValidationMetadata);
    assert.equal(getGraphVisualizationValidationReleaseMetadata().modelReference,
      GraphVisualizationValidationMetadata.modelReference);
  });
});
