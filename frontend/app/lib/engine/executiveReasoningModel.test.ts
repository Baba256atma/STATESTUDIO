import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveReasoningModelIndex.ts";
import {
  ExecutiveReasoningModelMetadata,
  ExecutiveReasoningModelPlatform,
  ExecutiveReasoningModelRegistry,
  ExecutiveReasoningModels,
  ExecutiveReasoningRelationshipModel,
  getExecutiveReasoningModelMetadata,
  getExecutiveReasoningModels,
  getExecutiveReasoningModelSummary,
} from "./executiveReasoningModelIndex.ts";

test("publishes exactly eight approved public exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveReasoningModelMetadata",
    "ExecutiveReasoningModelPlatform",
    "ExecutiveReasoningModelRegistry",
    "ExecutiveReasoningModels",
    "ExecutiveReasoningRelationshipModel",
    "getExecutiveReasoningModelMetadata",
    "getExecutiveReasoningModels",
    "getExecutiveReasoningModelSummary",
  ].sort());
  assert.equal(Object.keys(publicApi).length, 8);
});

test("publishes eight immutable core reasoning models", () => {
  assert.equal(ExecutiveReasoningModels.length, 8);
  assert.equal(Object.isFrozen(ExecutiveReasoningModels), true);
  assert.equal(ExecutiveReasoningModels.every(Object.isFrozen), true);
  assert.deepEqual(ExecutiveReasoningModels.map(({ name }) => name), [
    "ExecutiveReasoningModel",
    "ExecutiveEvidenceModel",
    "ExecutiveHypothesisModel",
    "ExecutiveInferenceModel",
    "ExecutiveContradictionModel",
    "ExecutiveConfidenceModel",
    "ExecutiveExplanationModel",
    "ExecutiveReasoningResultModel",
  ]);
  assert.equal(new Set(ExecutiveReasoningModels.map(({ id }) => id)).size, 8);
  assert.equal(ExecutiveReasoningModels.every(({ metadataOnly, runtimeFree, aiFree, owner }) => (
    metadataOnly && runtimeFree && aiFree && owner === "ENG-6"
  )), true);
});

test("model registry and relationships are complete structural metadata", () => {
  assert.equal(Object.isFrozen(ExecutiveReasoningModelRegistry), true);
  assert.equal(ExecutiveReasoningModelRegistry.entries.length, 8);
  assert.equal(ExecutiveReasoningModelRegistry.modelCount, 8);
  assert.equal(Object.isFrozen(ExecutiveReasoningRelationshipModel), true);
  assert.deepEqual([...ExecutiveReasoningRelationshipModel.flow], [
    "Evidence",
    "Hypothesis",
    "Inference",
    "Contradiction Review",
    "Confidence",
    "Explanation",
    "Reasoning Result",
  ]);
  assert.equal(ExecutiveReasoningRelationshipModel.edges.length, 6);
  assert.equal(ExecutiveReasoningRelationshipModel.edges.every(({ executable }) => executable === false), true);
});

test("platform aggregates models, registry, relationships, and ownership", () => {
  assert.equal(Object.isFrozen(ExecutiveReasoningModelPlatform), true);
  assert.equal(ExecutiveReasoningModelPlatform.models, ExecutiveReasoningModels);
  assert.equal(ExecutiveReasoningModelPlatform.registry, ExecutiveReasoningModelRegistry);
  assert.equal(ExecutiveReasoningModelPlatform.relationships, ExecutiveReasoningRelationshipModel);
  assert.equal(ExecutiveReasoningModelPlatform.metadata, ExecutiveReasoningModelMetadata);
  assert.equal(ExecutiveReasoningModelPlatform.ownership.owner, "ENG-6");
  assert.ok(ExecutiveReasoningModelPlatform.ownership.neverOwns.includes("reasoning execution"));
  assert.ok(ExecutiveReasoningModelPlatform.ownership.neverOwns.includes("confidence calculation"));
});

test("helpers are deterministic and metadata is ready for validation", () => {
  assert.equal(getExecutiveReasoningModels(), ExecutiveReasoningModels);
  assert.equal(getExecutiveReasoningModelMetadata(), ExecutiveReasoningModelMetadata);
  assert.equal(getExecutiveReasoningModelSummary(), getExecutiveReasoningModelSummary());
  assert.equal(Object.isFrozen(getExecutiveReasoningModelMetadata()), true);
  assert.equal(Object.isFrozen(getExecutiveReasoningModelSummary()), true);
  assert.equal(ExecutiveReasoningModelMetadata.modelPlatformId, "ENG-6:3");
  assert.equal(ExecutiveReasoningModelMetadata.nextPhase, "ENG-6:4");
  assert.equal(ExecutiveReasoningModelMetadata.status.readyForValidation, "ReadyForValidation");
  const summary = getExecutiveReasoningModelSummary();
  assert.equal(summary.modelCount, 8);
  assert.equal(summary.registryEntryCount, 8);
  assert.equal(summary.relationshipEdgeCount, 6);
  assert.equal(summary.validationReady, true);
});

test("public surface exposes no runtime, AI, scoring, or planner APIs", () => {
  assert.equal(Object.keys(publicApi).every((name) => (
    !/Builder|Runner|Planner|Scorer|Executor|LLM|OpenAI|Query|Reflect/i.test(name)
  )), true);
});
