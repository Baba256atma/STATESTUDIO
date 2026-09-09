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
  return createWorkspace("ECA:6 Runtime Proofs").workspaceId;
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
    messageIdSeed: `eca-6-runtime-${utterance}`,
  });
}

test("ECA:6 runtime — investigation continuity", () => {
  const workspaceId = setup();
  const first = run("Why are deliveries late?", workspaceId);
  const second = run("Show me the evidence.", workspaceId, first);
  const third = run("What about Capacity Gap?", workspaceId, second);
  assert.equal(first.ecaDialogueStrategy?.objectiveType, "INVESTIGATE_ISSUE");
  assert.equal(second.ecaDialogueStrategy?.objectiveType, "INVESTIGATE_ISSUE");
  assert.equal(third.ecaDialogueStrategy?.objectiveType, "INVESTIGATE_ISSUE");
  assert.equal(third.ecaDialogueStrategy?.boundaries.createsSecondObjectiveStore, false);
});

test("ECA:6 runtime — side question preserves objective", () => {
  const workspaceId = setup();
  const compare = run("Compare outsourcing and overtime.", workspaceId);
  const side = run("What does CAP_AV mean?", workspaceId, compare);
  assert.equal(side.ecaDialogueStrategy?.relationshipToCurrentTurn, "SIDE_QUESTION");
  assert.equal(side.ecaDialogueStrategy?.objectiveType, compare.ecaDialogueStrategy?.objectiveType);
});

test("ECA:6 runtime — return after side question", () => {
  const workspaceId = setup();
  const compare = run("Compare outsourcing and overtime.", workspaceId);
  const side = run("What does CAP_AV mean?", workspaceId, compare);
  const next = run("Which issue should we investigate first?", workspaceId, side);
  assert.ok(next.ecaDialogueStrategy?.objectiveType);
  assert.notEqual(next.ecaDialogueStrategy?.lifecycle, "ABANDONED");
});

test("ECA:6 runtime — explicit switch", () => {
  const workspaceId = setup();
  const first = run("Why are deliveries late?", workspaceId);
  const switched = run("Forget delivery. Show current Executions.", workspaceId, first);
  assert.equal(switched.ecaDialogueStrategy?.relationshipToCurrentTurn, "SWITCH");
  assert.equal(switched.ecaDialogueStrategy?.returnToObjective, false);
});

test("ECA:6 runtime — comparison recommendation is not a Decision", () => {
  const workspaceId = setup();
  const compare = run("Compare outsourcing and overtime.", workspaceId);
  const safer = run("Which has lower risk?", workspaceId, compare);
  const recommend = run("What do you recommend?", workspaceId, safer);
  assert.equal(recommend.ecaDialogueStrategy?.boundaries.commitsDecision, false);
  assert.notEqual(recommend.ecaActionPlan?.intent, "COMMIT_DECISION");
});

test("ECA:6 runtime — estimate does not confirm truth", () => {
  const workspaceId = setup();
  const compare = run("Compare Supplier A and Supplier B.", workspaceId);
  const estimate = run("Around 40k.", workspaceId, compare);
  assert.equal(estimate.ecaDialogueStrategy?.boundaries.writesDataTruth, false);
  assert.equal(estimate.ecaAnswerIntakeJudgment?.boundaries.writesDataTruth, false);
});

test("ECA:6 runtime — ECA:1–5 regression and Decision boundary", () => {
  const workspaceId = setup();
  const explain = run("Explain Capacity Gap.", workspaceId);
  assert.equal(explain.ecaWorkingContext?.identity, "NPA-T ECA:1/WorkingConversationContext");
  assert.equal(explain.ecaActionPlan?.intent, "EXPLAIN");
  assert.equal(explain.ecaInitiativeJudgment?.shouldIntervene, false);
  assert.equal(explain.ecaInformationNeedJudgment?.shouldAsk, false);
  assert.equal(explain.ecaAnswerIntakeJudgment?.staleYesMutation, false);
  assert.equal(explain.ecaDialogueStrategy?.unnecessaryObjective, false);
  const compare = run("Compare A and B.", workspaceId);
  const choose = run("I choose A.", workspaceId, compare);
  assert.equal(choose.ecaDialogueStrategy?.boundaries.commitsDecision, false);
});
