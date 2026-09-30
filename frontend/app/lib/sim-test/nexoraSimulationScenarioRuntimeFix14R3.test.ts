import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(utterance: string) {
  const runtimeState = initialState();
  return {
    runtimeState,
    result: executeNexoraConversationalExperience({
      utterance,
      executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
      runtimeState,
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      messageIdSeed: `fix14-r3-${utterance}`,
    }),
  };
}

test("R3: supported Scenario read semantics resolve without Runtime mutation", () => {
  for (const utterance of [
    "Explain Demand Surge",
    "What is Demand Surge Scenario?",
    "Describe Demand Surge",
    "Tell me about Demand Surge",
  ]) {
    const { runtimeState, result } = run(utterance);
    assert.equal(result.intentResult.intent.kind, "explain-scenario", utterance);
    assert.equal(result.intentResult.intent.scenarioPayload?.operation, "describe", utterance);
    assert.equal(result.contextResult.context.primarySubject?.subjectId, "ctx-scenario-demand", utterance);
    assert.equal(result.shouldCommitRuntime, false, utterance);
    assert.ok(result.directorPlan, utterance);
    assert.equal(result.directorPlan.mutationRequired, false, utterance);
    assert.equal(result.directorPlan.intent, "NO_CHANGE", utterance);
    assert.deepEqual(result.nextRuntimeState, runtimeState, utterance);
    assert.equal(result.decisionCommitmentResult, null, utterance);
  }
});

test("R3: explicit Scenario presentation still uses the existing Runtime mutation authority", () => {
  const { result } = run("Show scenarios");

  assert.equal(result.intentResult.intent.kind, "show-scenarios");
  assert.ok(result.directorPlan);
  assert.equal(result.directorPlan.intent, "SHOW_COLLECTION");
  assert.equal(result.directorPlan.mutationRequired, true);
  assert.equal(result.shouldCommitRuntime, true);
  assert.equal(result.nextRuntimeState.collectionContext?.category, "scenario");
});
