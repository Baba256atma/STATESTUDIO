import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveReasoningRegistryIndex.ts";
import {
  ExecutiveReasoningCapabilityRegistry,
  ExecutiveReasoningComponentRegistry,
  ExecutiveReasoningLifecycleRegistry,
  ExecutiveReasoningRegistryMetadata,
  getReasoningCapabilityById,
  getReasoningComponentById,
  getReasoningRegistrySummary,
} from "./executiveReasoningRegistryIndex.ts";
import { ExecutiveReasoningRegistry } from "./executiveReasoningRegistry.ts";
import {
  getReasoningConfidenceLevelById,
  getReasoningEvidenceCategoryById,
  getReasoningInferenceTypeById,
  getReasoningLifecycleStageById,
} from "./executiveReasoningRegistry.ts";

test("publishes exactly seven approved public exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveReasoningCapabilityRegistry",
    "ExecutiveReasoningComponentRegistry",
    "ExecutiveReasoningLifecycleRegistry",
    "ExecutiveReasoningRegistryMetadata",
    "getReasoningCapabilityById",
    "getReasoningComponentById",
    "getReasoningRegistrySummary",
  ].sort());
  assert.equal(Object.keys(publicApi).length, 7);
});

test("component registry registers the eight reasoning components immutably", () => {
  assert.equal(ExecutiveReasoningComponentRegistry.length, 8);
  assert.equal(Object.isFrozen(ExecutiveReasoningComponentRegistry), true);
  assert.equal(ExecutiveReasoningComponentRegistry.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveReasoningComponentRegistry.map(({ id }) => id)).size, 8);
  assert.deepEqual(ExecutiveReasoningComponentRegistry.map(({ name }) => name), [
    "EvidenceCollector",
    "EvidenceEvaluator",
    "HypothesisBuilder",
    "InferenceCoordinator",
    "ContradictionResolver",
    "ConfidenceEvaluator",
    "ExplanationComposer",
    "ReasoningSummarizer",
  ]);
  assert.equal(ExecutiveReasoningComponentRegistry.every(({ owner, metadataOnly, runtimeFree, aiFree }) => (
    owner === "ENG-6" && metadataOnly && runtimeFree && aiFree
  )), true);
});

test("capability registry registers the eight reasoning capabilities", () => {
  assert.equal(ExecutiveReasoningCapabilityRegistry.length, 8);
  assert.equal(Object.isFrozen(ExecutiveReasoningCapabilityRegistry), true);
  assert.deepEqual(ExecutiveReasoningCapabilityRegistry.map(({ name }) => name), [
    "CollectEvidence",
    "ValidateEvidence",
    "BuildHypothesis",
    "ExecuteInference",
    "DetectContradictions",
    "EvaluateConfidence",
    "GenerateExplanation",
    "ProduceReasoningSummary",
  ]);
});

test("lifecycle registry mirrors ENG-6:1 foundation lifecycle stages", () => {
  assert.equal(ExecutiveReasoningLifecycleRegistry.length, 9);
  assert.equal(Object.isFrozen(ExecutiveReasoningLifecycleRegistry), true);
  assert.deepEqual(ExecutiveReasoningLifecycleRegistry.map(({ name }) => name), [
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
});

test("registry metadata and summary are complete and deterministic", () => {
  assert.equal(Object.isFrozen(ExecutiveReasoningRegistryMetadata), true);
  assert.equal(ExecutiveReasoningRegistryMetadata.registryId, "ENG-6:2");
  assert.equal(ExecutiveReasoningRegistryMetadata.totalComponentCount, 8);
  assert.equal(ExecutiveReasoningRegistryMetadata.totalCapabilityCount, 8);
  assert.equal(ExecutiveReasoningRegistryMetadata.nextPhase, "ENG-6:3");
  const summary = getReasoningRegistrySummary();
  assert.equal(summary, getReasoningRegistrySummary());
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(summary.componentCount, 8);
  assert.equal(summary.capabilityCount, 8);
  assert.equal(summary.lifecycleStageCount, 9);
  assert.equal(summary.evidenceCategoryCount, 10);
  assert.equal(summary.inferenceTypeCount, 8);
  assert.equal(summary.confidenceLevelCount, 7);
  assert.equal(summary.hypothesisTypeCount, 5);
  assert.equal(summary.modelReady, true);
});

test("lookup helpers return immutable metadata or undefined", () => {
  const component = getReasoningComponentById("eng-6-component-evidence-collector");
  assert.ok(component);
  assert.equal(component.name, "EvidenceCollector");
  assert.equal(Object.isFrozen(component), true);
  assert.equal(getReasoningComponentById("missing"), undefined);

  const capability = getReasoningCapabilityById("eng-6-capability-collect-evidence");
  assert.ok(capability);
  assert.equal(capability.name, "CollectEvidence");
  assert.equal(getReasoningCapabilityById("missing"), undefined);

  assert.equal(getReasoningLifecycleStageById("eng-6-lifecycle-input")?.name, "Input");
  assert.equal(getReasoningLifecycleStageById("missing"), undefined);
  assert.equal(getReasoningEvidenceCategoryById("eng-6-evidence-business")?.name, "Business Evidence");
  assert.equal(getReasoningEvidenceCategoryById("missing"), undefined);
  assert.equal(getReasoningInferenceTypeById("eng-6-inference-deductive")?.name, "Deductive");
  assert.equal(getReasoningInferenceTypeById("missing"), undefined);
  assert.equal(getReasoningConfidenceLevelById("eng-6-confidence-medium")?.name, "Medium");
  assert.equal(getReasoningConfidenceLevelById("missing"), undefined);
});

test("aggregate registry ownership and secondary registries remain immutable and metadata-only", () => {
  assert.equal(Object.isFrozen(ExecutiveReasoningRegistry), true);
  assert.equal(ExecutiveReasoningRegistry.metadataOnly, true);
  assert.equal(ExecutiveReasoningRegistry.aiFree, true);
  assert.equal(ExecutiveReasoningRegistry.ownership.owner, "ENG-6");
  assert.ok(ExecutiveReasoningRegistry.ownership.neverOwns.includes("reasoning execution"));
  assert.ok(ExecutiveReasoningRegistry.ownership.neverOwns.includes("confidence computation"));
  assert.equal(Object.isFrozen(ExecutiveReasoningRegistry.evidence), true);
  assert.equal(Object.isFrozen(ExecutiveReasoningRegistry.inference), true);
  assert.equal(Object.isFrozen(ExecutiveReasoningRegistry.confidence), true);
  assert.equal(Object.isFrozen(ExecutiveReasoningRegistry.hypotheses), true);
});

test("public surface exposes no runtime, AI, scoring, or planner APIs", () => {
  assert.equal(Object.keys(publicApi).every((name) => (
    !/Builder|Runner|Planner|Scorer|Executor|LLM|OpenAI|Query|Reflect/i.test(name)
  )), true);
});
