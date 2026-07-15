import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveReasoningPipelineFoundation.ts";
import {
  ExecutiveConfidenceLevels,
  ExecutiveEvidenceCategories,
  ExecutiveInferenceTypes,
  ExecutiveReasoningDomains,
  ExecutiveReasoningLifecycle,
  ExecutiveReasoningPipelineContracts,
  ExecutiveReasoningPipelineFoundation,
} from "./executiveReasoningPipelineFoundation.ts";

test("publishes exactly seven approved public exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveConfidenceLevels",
    "ExecutiveEvidenceCategories",
    "ExecutiveInferenceTypes",
    "ExecutiveReasoningDomains",
    "ExecutiveReasoningLifecycle",
    "ExecutiveReasoningPipelineContracts",
    "ExecutiveReasoningPipelineFoundation",
  ].sort());
  assert.equal(Object.keys(publicApi).length, 7);
});

test("foundation aggregates immutable contracts, domains, lifecycle, evidence, inference, and confidence", () => {
  assert.equal(ExecutiveReasoningPipelineFoundation.contracts, ExecutiveReasoningPipelineContracts);
  assert.equal(ExecutiveReasoningPipelineFoundation.domains, ExecutiveReasoningDomains);
  assert.equal(ExecutiveReasoningPipelineFoundation.lifecycle, ExecutiveReasoningLifecycle);
  assert.equal(ExecutiveReasoningPipelineFoundation.evidenceCategories, ExecutiveEvidenceCategories);
  assert.equal(ExecutiveReasoningPipelineFoundation.inferenceTypes, ExecutiveInferenceTypes);
  assert.equal(ExecutiveReasoningPipelineFoundation.confidenceLevels, ExecutiveConfidenceLevels);
  assert.equal(Object.isFrozen(ExecutiveReasoningPipelineFoundation), true);
  assert.equal(ExecutiveReasoningPipelineFoundation.metadataOnly, true);
  assert.equal(ExecutiveReasoningPipelineFoundation.runtimeFree, true);
  assert.equal(ExecutiveReasoningPipelineFoundation.aiFree, true);
  assert.equal(ExecutiveReasoningPipelineFoundation.llmFree, true);
  assert.equal(ExecutiveReasoningPipelineFoundation.platformId, "ENG-6:1");
  assert.equal(ExecutiveReasoningPipelineFoundation.nextPhase, "ENG-6:2");
});

test("contracts define the six executive reasoning contracts", () => {
  assert.equal(ExecutiveReasoningPipelineContracts.length, 6);
  assert.equal(Object.isFrozen(ExecutiveReasoningPipelineContracts), true);
  assert.equal(ExecutiveReasoningPipelineContracts.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveReasoningPipelineContracts.map(({ id }) => id)).size, 6);
  assert.deepEqual(ExecutiveReasoningPipelineContracts.map(({ name }) => name), [
    "ExecutiveReasoningPipelineContract",
    "ExecutiveEvidenceContract",
    "ExecutiveHypothesisContract",
    "ExecutiveInferenceContract",
    "ExecutiveConfidenceContract",
    "ExecutiveReasoningLifecycleContract",
  ]);
});

test("domains cover the required reasoning domains", () => {
  assert.equal(ExecutiveReasoningDomains.length, 12);
  assert.equal(Object.isFrozen(ExecutiveReasoningDomains), true);
  assert.equal(ExecutiveReasoningDomains.every(Object.isFrozen), true);
  assert.deepEqual(ExecutiveReasoningDomains.map(({ name }) => name), [
    "Evidence Evaluation",
    "Evidence Collection",
    "Hypothesis Formation",
    "Logical Inference",
    "Comparative Reasoning",
    "Causal Reasoning",
    "Risk Reasoning",
    "Scenario Reasoning",
    "Confidence Evaluation",
    "Contradiction Detection",
    "Executive Explanation",
    "Reasoning Summary",
  ]);
});

test("lifecycle stages are complete, ordered, and immutable", () => {
  assert.equal(ExecutiveReasoningLifecycle.length, 9);
  assert.equal(Object.isFrozen(ExecutiveReasoningLifecycle), true);
  assert.equal(ExecutiveReasoningLifecycle.every(Object.isFrozen), true);
  assert.deepEqual(ExecutiveReasoningLifecycle.map(({ name }) => name), [
    "Input",
    "Evidence Collection",
    "Evidence Evaluation",
    "Hypothesis Generation",
    "Inference",
    "Contradiction Resolution",
    "Confidence Evaluation",
    "Executive Explanation",
    "Reasoning Result",
  ]);
  assert.deepEqual(ExecutiveReasoningLifecycle.map(({ order }) => order), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test("evidence, inference, and confidence inventories are complete and immutable", () => {
  assert.equal(ExecutiveEvidenceCategories.length, 10);
  assert.deepEqual(ExecutiveEvidenceCategories.map(({ name }) => name), [
    "Business Evidence",
    "Financial Evidence",
    "Operational Evidence",
    "Strategic Evidence",
    "Project Evidence",
    "Resource Evidence",
    "Scheduling Evidence",
    "Dependency Evidence",
    "Historical Evidence",
    "External Evidence",
  ]);
  assert.equal(ExecutiveInferenceTypes.length, 8);
  assert.deepEqual(ExecutiveInferenceTypes.map(({ name }) => name), [
    "Deductive",
    "Inductive",
    "Abductive",
    "Comparative",
    "Causal",
    "Temporal",
    "Statistical",
    "Rule-Based",
  ]);
  assert.equal(ExecutiveConfidenceLevels.length, 7);
  assert.deepEqual(ExecutiveConfidenceLevels.map(({ name }) => name), [
    "Unknown",
    "Very Low",
    "Low",
    "Medium",
    "High",
    "Very High",
    "Certain",
  ]);
  assert.equal(ExecutiveEvidenceCategories.every(Object.isFrozen), true);
  assert.equal(ExecutiveInferenceTypes.every(Object.isFrozen), true);
  assert.equal(ExecutiveConfidenceLevels.every(Object.isFrozen), true);
});

test("ownership separates reasoning from planning, decision, execution, and AI runtime", () => {
  assert.equal(ExecutiveReasoningPipelineFoundation.ownership.owner, "ENG-6");
  assert.equal(ExecutiveReasoningPipelineFoundation.ownership.planningOwner, "ENG-5");
  assert.equal(ExecutiveReasoningPipelineFoundation.ownership.decisionOwner, "ENG-7");
  assert.equal(ExecutiveReasoningPipelineFoundation.ownership.executionOwner, "OPS");
  assert.ok(ExecutiveReasoningPipelineFoundation.ownership.neverOwns.includes("LLM inference"));
  assert.ok(ExecutiveReasoningPipelineFoundation.ownership.neverOwns.includes("AI models"));
  assert.ok(ExecutiveReasoningPipelineFoundation.ownership.neverOwns.includes("runtime logic"));
  assert.equal(ExecutiveReasoningPipelineFoundation.hypothesisTypes.length, 5);
  assert.equal(Object.isFrozen(ExecutiveReasoningPipelineFoundation.hypothesisTypes), true);
});

test("public surface exposes no runtime, AI, scoring, or planner APIs", () => {
  assert.equal(Object.keys(publicApi).every((name) => (
    !/Builder|Runner|Planner|Scorer|Executor|Model|Query|Reflect|LLM|OpenAI/i.test(name)
    || name === "ExecutiveInferenceTypes"
  )), true);
  assert.equal(typeof ExecutiveReasoningPipelineFoundation, "object");
  assert.equal(ExecutiveReasoningPipelineFoundation.publicDependencies.every(
    ({ consumption }) => consumption === "PublicIndexOnly",
  ), true);
});
