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
  return createWorkspace("ECA:8 Runtime Proofs").workspaceId;
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
    messageIdSeed: `eca-8-runtime-${utterance}`,
  });
}

function isolation(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  assert.equal(result.ecaCommitmentJudgment?.boundaries.commitsDecision, false);
  assert.equal(result.ecaCommitmentJudgment?.boundaries.createsSecondDecisionWriter, false);
  assert.equal(result.ecaCommitmentJudgment?.boundaries.replacesCc10, false);
  assert.equal(result.ecaCommitmentJudgment?.boundaries.replacesDth8, false);
  assert.equal(result.ecaCommitmentJudgment?.boundaries.startsExecution, false);
}

test("ECA:8 runtime — preference is not a Decision", () => {
  const workspaceId = setup();
  const prefer = run("I prefer Scenario A.", workspaceId);
  isolation(prefer);
  assert.equal(prefer.ecaCommitmentJudgment?.commitmentState, "PREFERENCE");
  assert.equal(prefer.ecaCommitmentJudgment?.canonicalHandoffAllowed, false);
  assert.notEqual(prefer.ecaActionPlan?.intent, "COMMIT_DECISION");
});

test("ECA:8 runtime — explicit choose hands off, does not write", () => {
  const workspaceId = setup();
  const compare = run("Compare Scenario A and Scenario B.", workspaceId);
  const choose = run("Choose Scenario A.", workspaceId, compare);
  isolation(choose);
  assert.equal(choose.ecaCommitmentJudgment?.commitmentState, "EXPLICIT_COMMITMENT");
  assert.equal(
    choose.ecaActionPlan?.intent !== "COMMIT_DECISION" ||
      choose.ecaActionPlan.authorityTarget === "CC:10 Decision Commitment",
    true,
  );
});

test("ECA:8 runtime — generic Yes does not commit", () => {
  const workspaceId = setup();
  const yes = run("Yes.", workspaceId);
  isolation(yes);
  assert.equal(yes.ecaCommitmentJudgment?.canonicalHandoffAllowed, false);
  assert.equal(yes.ecaCommitmentJudgment?.staleYesMutation, false);
});

test("ECA:8 runtime — ambiguous it does not bind Stage focus", () => {
  const workspaceId = setup();
  const compare = run("Compare Scenario A and Scenario B.", workspaceId);
  const chooseIt = run("Choose it.", workspaceId, compare);
  isolation(chooseIt);
  assert.equal(chooseIt.ecaCommitmentJudgment?.targetResolution, "AMBIGUOUS");
  assert.equal(chooseIt.ecaCommitmentJudgment?.canonicalHandoffAllowed, false);
});

test("ECA:8 runtime — I agree is not a Decision", () => {
  const workspaceId = setup();
  const compare = run("Compare outsourcing and overtime.", workspaceId);
  const rec = run("What do you recommend?", workspaceId, compare);
  const agree = run("I agree.", workspaceId, rec);
  isolation(agree);
  assert.equal(agree.ecaCommitmentJudgment?.canonicalHandoffAllowed, false);
});

test("ECA:8 runtime — Decision confirmation does not start Execution", () => {
  const workspaceId = setup();
  const compare = run("Compare outsourcing and overtime.", workspaceId);
  const choose = run("I choose outsourcing.", workspaceId, compare);
  isolation(choose);
  assert.equal(choose.ecaCommitmentJudgment?.boundaries.startsExecution, false);
  assert.equal(choose.ecaRecommendationJudgment?.boundaries.commitsDecision, false);
});

test("ECA:8 runtime — ECA:1–7 identities remain", () => {
  const workspaceId = setup();
  const explain = run("Explain Capacity Gap.", workspaceId);
  isolation(explain);
  assert.equal(explain.ecaWorkingContext?.identity, "NPA-T ECA:1/WorkingConversationContext");
  assert.equal(explain.ecaActionPlan?.intent, "EXPLAIN");
  assert.equal(explain.ecaInitiativeJudgment?.shouldIntervene, false);
  assert.equal(
    explain.ecaRecommendationJudgment?.identity,
    "NPA-T ECA:7/ExecutiveRecommendationFramingDecisionReadiness",
  );
  assert.equal(
    explain.ecaCommitmentJudgment?.identity,
    "NPA-T ECA:8/ExecutiveCommitmentDialoguePreDecisionChallenge",
  );
});
