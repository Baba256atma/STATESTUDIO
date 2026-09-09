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

function setup() {
  ensureBrowserLocalStorageHarness();
  window.localStorage.clear();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceRegistryForTests();
  return createWorkspace("ECA:5 Runtime Proofs").workspaceId;
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
    messageIdSeed: `eca-5-runtime-${utterance}`,
  });
}

test("ECA:5 runtime — fact intake does not write", () => {
  const workspaceId = setup();
  const asked = run("What is Supplier B's lead time?", workspaceId);
  const answered = run("6 weeks.", workspaceId, asked);
  assert.equal(answered.ecaAnswerIntakeJudgment?.bound, true);
  assert.equal(answered.ecaAnswerIntakeJudgment?.answerType, "FACT_CLAIM");
  assert.equal(answered.ecaAnswerIntakeJudgment?.boundaries.writesDataTruth, false);
  assert.equal(answered.ecaInformationNeedJudgment?.identity, "NPA-T ECA:4/ExecutiveQuestioningInformationAcquisition");
});

test("ECA:5 runtime — estimate keeps uncertainty", () => {
  const workspaceId = setup();
  const asked = run("What is Supplier B's expected cost?", workspaceId);
  const answered = run("Probably around $40,000.", workspaceId, asked);
  assert.equal(answered.ecaAnswerIntakeJudgment?.answerType, "ESTIMATE");
  assert.equal(answered.ecaAnswerIntakeJudgment?.confidence, "ESTIMATED");
  assert.match(answered.response, /estimated|about|around/i);
});

test("ECA:5 runtime — partial cost leaves lead time open", () => {
  const workspaceId = setup();
  const asked = run("What are Supplier B's cost and lead time?", workspaceId);
  const answered = run("Cost is 40k.", workspaceId, asked);
  assert.equal(answered.ecaAnswerIntakeJudgment?.completeness, "PARTIAL");
  assert.equal(answered.ecaAnswerIntakeJudgment?.needSatisfaction, "PARTIALLY_SATISFIED");
});

test("ECA:5 runtime — I don’t know is unknown", () => {
  const workspaceId = setup();
  const asked = run("What is Supplier B's available capacity?", workspaceId);
  const unknown = run("I don't know.", workspaceId, asked);
  assert.equal(unknown.ecaAnswerIntakeJudgment?.answerType, "UNKNOWN");
  assert.doesNotMatch(unknown.response, /supplier b['’]s current available capacity\?/i);
});

test("ECA:5 runtime — conflict does not overwrite", () => {
  const workspaceId = setup();
  const seeded = run("Supplier B's lead time in our data is 4 weeks.", workspaceId);
  const asked = run("What is Supplier B's lead time?", workspaceId, seeded);
  const conflict = run("6 weeks.", workspaceId, asked);
  assert.equal(conflict.ecaAnswerIntakeJudgment?.conflict, "VALUE_CONFLICT");
  assert.equal(conflict.ecaAnswerIntakeJudgment?.silentOverwrite, false);
  assert.match(conflict.response, /4 weeks/);
});

test("ECA:5 runtime — CAP_AV Yes is DATA-ADV handoff only", () => {
  const workspaceId = setup();
  const asked = run("Should I worry about CAP_AV?", workspaceId);
  const yes = run("Yes.", workspaceId, asked);
  assert.ok(
    yes.ecaAnswerIntakeJudgment?.authorityTarget === "DATA-ADV/Data Reality" ||
      yes.ecaAnswerIntakeJudgment?.staleConfirmation === true ||
      yes.ecaAnswerIntakeJudgment?.answerType === "CONFIRMATION",
  );
  assert.equal(yes.ecaAnswerIntakeJudgment?.boundaries.writesDataTruth, false);
});

test("ECA:5 runtime — scenario choice does not commit", () => {
  const workspaceId = setup();
  const asked = run("Which scenario do you choose?", workspaceId);
  const chosen = run("Scenario A.", workspaceId, asked);
  assert.equal(chosen.ecaAnswerIntakeJudgment?.boundaries.commitsDecision, false);
  assert.equal(chosen.ecaActionPlan?.intent !== "COMMIT_DECISION" || chosen.ecaAnswerIntakeJudgment?.boundaries.commitsDecision === false, true);
});

test("ECA:5 runtime — ECA:1–4 regression on explanation", () => {
  const workspaceId = setup();
  const result = run("Explain Capacity Gap.", workspaceId);
  assert.equal(result.ecaWorkingContext?.identity, "NPA-T ECA:1/WorkingConversationContext");
  assert.equal(result.ecaActionPlan?.intent, "EXPLAIN");
  assert.equal(result.ecaInitiativeJudgment?.shouldIntervene, false);
  assert.equal(result.ecaInformationNeedJudgment?.shouldAsk, false);
  assert.equal(result.ecaAnswerIntakeJudgment?.staleYesMutation, false);
});
