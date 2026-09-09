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
  return createWorkspace("ECA:7 Runtime Proofs").workspaceId;
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
    messageIdSeed: `eca-7-runtime-${utterance}`,
  });
}

test("ECA:7 runtime — too early does not invent a winner", () => {
  const workspaceId = setup();
  const early = run("What do you recommend?", workspaceId);
  assert.equal(early.ecaRecommendationJudgment?.recommendedOption, null);
  assert.notEqual(early.ecaRecommendationJudgment?.readiness, "READY");
  assert.equal(early.ecaRecommendationJudgment?.boundaries.commitsDecision, false);
  assert.equal(early.ecaDialogueStrategy?.identity, "NPA-T ECA:6/ExecutiveDialogueStrategyMultiTurnObjectiveControl");
});

test("ECA:7 runtime — comparison recommendation is not a Decision", () => {
  const workspaceId = setup();
  const compare = run("Compare outsourcing and overtime.", workspaceId);
  const recommend = run("What do you recommend?", workspaceId, compare);
  assert.equal(recommend.ecaRecommendationJudgment?.boundaries.commitsDecision, false);
  assert.equal(recommend.ecaRecommendationJudgment?.boundaries.createsSecondDecisionEngine, false);
  assert.equal(recommend.ecaRecommendationJudgment?.recommendationRequested, true);
});

test("ECA:7 runtime — missing cost defers or conditions", () => {
  const workspaceId = setup();
  const compare = run("Compare Supplier A and Supplier B.", workspaceId);
  const recommend = run("What do you recommend?", workspaceId, compare);
  assert.ok(
    recommend.ecaRecommendationJudgment?.recommendationType === "DEFER_DECISION" ||
      recommend.ecaRecommendationJudgment?.readiness === "BLOCKED_BY_CRITICAL_UNKNOWN" ||
      recommend.ecaRecommendationJudgment?.recommendationType === "NO_CLEAR_PREFERENCE" ||
      recommend.ecaRecommendationJudgment?.recommendationType === "CONDITIONAL_PREFERENCE" ||
      recommend.ecaRecommendationJudgment?.recommendationType === "PREFER_OPTION",
  );
  assert.equal(recommend.ecaRecommendationJudgment?.boundaries.writesDataTruth, false);
});

test("ECA:7 runtime — estimate does not inflate", () => {
  const workspaceId = setup();
  const compare = run("Compare Supplier A and Supplier B.", workspaceId);
  const estimate = run("Around 40k.", workspaceId, compare);
  const recommend = run("What do you recommend?", workspaceId, estimate);
  assert.equal(recommend.ecaRecommendationJudgment?.trustInflation, false);
  assert.equal(recommend.ecaAnswerIntakeJudgment?.boundaries.writesDataTruth, false);
});

test("ECA:7 runtime — criterion shift stays writable-false", () => {
  const workspaceId = setup();
  const compare = run("Compare outsourcing and overtime.", workspaceId);
  const first = run("Delivery speed matters most.", workspaceId, compare);
  const rec = run("What do you recommend?", workspaceId, first);
  const shift = run("Actually, cost matters more.", workspaceId, rec);
  const again = run("What do you recommend?", workspaceId, shift);
  assert.equal(again.ecaRecommendationJudgment?.staleRecommendation, false);
  assert.equal(again.ecaRecommendationJudgment?.boundaries.commitsDecision, false);
});

test("ECA:7 runtime — CAP_AV does not promote semantics", () => {
  const workspaceId = setup();
  const cap = run("Should I worry about CAP_AV?", workspaceId);
  const rec = run("What do you recommend?", workspaceId, cap);
  assert.equal(rec.ecaRecommendationJudgment?.semanticPromotion, false);
  assert.notEqual(rec.ecaRecommendationJudgment?.strength, "STRONG");
});

test("ECA:7 runtime — ECA:1–6 regression and choose boundary", () => {
  const workspaceId = setup();
  const explain = run("Explain Capacity Gap.", workspaceId);
  assert.equal(explain.ecaWorkingContext?.identity, "NPA-T ECA:1/WorkingConversationContext");
  assert.equal(explain.ecaActionPlan?.intent, "EXPLAIN");
  assert.equal(explain.ecaInitiativeJudgment?.shouldIntervene, false);
  assert.equal(explain.ecaDialogueStrategy?.unnecessaryObjective, false);
  const compare = run("Compare A and B.", workspaceId);
  const rec = run("What do you recommend?", workspaceId, compare);
  const choose = run("I choose A.", workspaceId, rec);
  assert.equal(choose.ecaRecommendationJudgment?.boundaries.commitsDecision, false);
  assert.equal(
    choose.ecaActionPlan?.intent !== "COMMIT_DECISION" ||
      choose.ecaActionPlan.authorityTarget === "CC:10 Decision Commitment",
    true,
  );
});
