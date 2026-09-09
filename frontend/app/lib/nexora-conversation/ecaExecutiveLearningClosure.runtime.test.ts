import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { createEmptyManagerObjectSession } from "@/app/lib/manager-object/managerObjectActive.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { resetWorkspaceRiskStoreForTests } from "@/app/lib/risk/workspaceRiskContract.ts";
import { ensureBrowserLocalStorageHarness } from "@/app/lib/test-harness/browserLocalStorageHarness.ts";
import { createWorkspace, resetWorkspaceRegistryForTests } from "@/app/lib/workspace/workspaceRegistryStore.ts";
import { resetOutcomeObservationCaptureForTests } from "@/app/lib/executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";

function setup() {
  ensureBrowserLocalStorageHarness();
  window.localStorage.clear();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceRegistryForTests();
  resetOutcomeObservationCaptureForTests();
  return createWorkspace("ECA:12 Runtime Proofs").workspaceId;
}

function run(
  utterance: string,
  workspaceId: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext ?? {
      currentSubjectId: null,
      previousSubjectIds: [],
      currentWorkspaceId: workspaceId,
    },
    executiveContext:
      previous?.nextExecutiveContext ??
      createEmptyNexoraExecutiveContextSnapshot({ currentWorkspaceId: workspaceId }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    previousManagerObjectSession:
      previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    messageIdSeed: `eca-12-runtime-${utterance}`,
  });
}

function isolation(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  assert.equal(result.ecaLearningClosureJudgment?.boundaries.writesLearning, false);
  assert.equal(result.ecaLearningClosureJudgment?.boundaries.writesApp4, false);
  assert.equal(result.ecaLearningClosureJudgment?.boundaries.createsSecondLearningEngine, false);
  assert.equal(result.ecaLearningClosureJudgment?.boundaries.replacesCoreOut2, false);
  assert.equal(result.ecaLearningClosureJudgment?.boundaries.createsSecondObjectiveStore, false);
  assert.equal(result.ecaOutcomeJudgment?.boundaries.writesOutcome, false);
}

test("ECA:12 runtime — no Outcome means no Learning write", () => {
  const workspaceId = setup();
  const result = run("What did we learn?", workspaceId);
  isolation(result);
  assert.notEqual(result.ecaLearningClosureJudgment?.learningState, "SUPPORTED");
  assert.equal(result.ecaLearningClosureJudgment?.durableWrite, false);
  assert.equal(result.ecaLearningClosureJudgment?.identity, "NPA-T ECA:12/ExecutiveLearningReassessmentConversationLoopClosure");
});

test("ECA:12 runtime — ECA:1–11 identities remain", () => {
  const workspaceId = setup();
  const explain = run("Explain Capacity Gap.", workspaceId);
  isolation(explain);
  assert.equal(explain.ecaWorkingContext?.identity, "NPA-T ECA:1/WorkingConversationContext");
  assert.equal(explain.ecaOutcomeJudgment?.identity, "NPA-T ECA:11/OutcomeDialogueExecutiveResultInterpretation");
  assert.equal(explain.ecaLearningClosureJudgment?.identity, "NPA-T ECA:12/ExecutiveLearningReassessmentConversationLoopClosure");
});

test("ECA:12 runtime — CAP_AV does not become causal Learning", () => {
  const workspaceId = setup();
  const cap = run("Should I worry about CAP_AV?", workspaceId);
  const cause = run("So we proved capacity was the cause.", workspaceId, cap);
  isolation(cause);
  assert.equal(cause.ecaLearningClosureJudgment?.causalLearningInflation, false);
  assert.doesNotMatch(cause.response, /capacity caused/i);
});

test("ECA:12 runtime — closure does not write Decision", () => {
  const workspaceId = setup();
  const result = run("That’s enough. Close this review.", workspaceId);
  isolation(result);
  assert.equal(result.ecaLearningClosureJudgment?.boundaries.commitsDecision, false);
});
