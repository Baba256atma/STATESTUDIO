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
  return createWorkspace("ECA:11 Runtime Proofs").workspaceId;
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
    messageIdSeed: `eca-11-runtime-${utterance}`,
  });
}

function isolation(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  assert.equal(result.ecaOutcomeJudgment?.boundaries.writesOutcome, false);
  assert.equal(result.ecaOutcomeJudgment?.boundaries.writesLearning, false);
  assert.equal(result.ecaOutcomeJudgment?.boundaries.createsSecondOutcomeWriter, false);
  assert.equal(result.ecaOutcomeJudgment?.boundaries.replacesDth11, false);
  assert.equal(result.ecaLiveExecutionJudgment?.boundaries.writesExecution, false);
}

test("ECA:11 runtime — Did it work without Outcome does not claim success", () => {
  const workspaceId = setup();
  const result = run("Did it work?", workspaceId);
  isolation(result);
  assert.notEqual(result.ecaOutcomeJudgment?.observationState, "OBSERVED");
  assert.equal(result.ecaOutcomeJudgment?.successInflation, false);
  assert.equal(result.ecaOutcomeJudgment?.identity, "NPA-T ECA:11/OutcomeDialogueExecutiveResultInterpretation");
});

test("ECA:11 runtime — causality question does not infer cause", () => {
  const workspaceId = setup();
  const result = run("Did this Decision cause the improvement?", workspaceId);
  isolation(result);
  assert.equal(result.ecaOutcomeJudgment?.attribution, "NOT_ESTABLISHED");
  assert.equal(result.ecaOutcomeJudgment?.causalityInflation, false);
});

test("ECA:11 runtime — ECA:1–10 identities remain", () => {
  const workspaceId = setup();
  const explain = run("Explain Capacity Gap.", workspaceId);
  isolation(explain);
  assert.equal(explain.ecaWorkingContext?.identity, "NPA-T ECA:1/WorkingConversationContext");
  assert.equal(explain.ecaLiveExecutionJudgment?.identity, "NPA-T ECA:10/LiveExecutionDialogueDeviationIntelligence");
  assert.equal(explain.ecaOutcomeJudgment?.identity, "NPA-T ECA:11/OutcomeDialogueExecutiveResultInterpretation");
});

test("ECA:11 runtime — CAP_AV does not become Outcome cause", () => {
  const workspaceId = setup();
  const cap = run("Should I worry about CAP_AV?", workspaceId);
  const cause = run("Did capacity cause the improvement?", workspaceId, cap);
  isolation(cause);
  assert.equal(cause.ecaOutcomeJudgment?.trustInflation, false);
});
