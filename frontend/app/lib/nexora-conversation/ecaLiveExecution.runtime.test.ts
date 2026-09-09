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
  return createWorkspace("ECA:10 Runtime Proofs").workspaceId;
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
    messageIdSeed: `eca-10-runtime-${utterance}`,
  });
}

function isolation(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  assert.equal(result.ecaLiveExecutionJudgment?.boundaries.writesExecution, false);
  assert.equal(result.ecaLiveExecutionJudgment?.boundaries.createsSecondExecutionWriter, false);
  assert.equal(result.ecaLiveExecutionJudgment?.boundaries.replacesDth10, false);
  assert.equal(result.ecaLiveExecutionJudgment?.boundaries.createsMonitoringDaemon, false);
  assert.equal(result.ecaLiveExecutionJudgment?.boundaries.createsSecondInitiativeEngine, false);
  assert.equal(result.ecaExecutionReadinessJudgment?.boundaries.startsExecution, false);
}

test("ECA:10 runtime — no live Execution means NOT_LIVE", () => {
  const workspaceId = setup();
  const going = run("How is execution going?", workspaceId);
  isolation(going);
  assert.equal(going.ecaLiveExecutionJudgment?.liveState, "NOT_LIVE");
  assert.equal(going.ecaLiveExecutionJudgment?.falseLive, false);
});

test("ECA:10 runtime — on-track without Execution stays unknown", () => {
  const workspaceId = setup();
  const track = run("Are we on track?", workspaceId);
  isolation(track);
  assert.equal(track.ecaLiveExecutionJudgment?.trackStatus, "UNKNOWN");
  assert.equal(track.ecaLiveExecutionJudgment?.falseDeviation, false);
});

test("ECA:10 runtime — CAP_AV does not inflate live track status", () => {
  const workspaceId = setup();
  const cap = run("Should I worry about CAP_AV?", workspaceId);
  const track = run("Are we on track?", workspaceId, cap);
  isolation(track);
  assert.equal(track.ecaLiveExecutionJudgment?.trustInflation, false);
  assert.equal(track.ecaLiveExecutionJudgment?.trackStatus, "UNKNOWN");
});

test("ECA:10 runtime — ECA:1–9 identities remain", () => {
  const workspaceId = setup();
  const explain = run("Explain Capacity Gap.", workspaceId);
  isolation(explain);
  assert.equal(explain.ecaWorkingContext?.identity, "NPA-T ECA:1/WorkingConversationContext");
  assert.equal(explain.ecaActionPlan?.intent, "EXPLAIN");
  assert.equal(explain.ecaExecutionReadinessJudgment?.identity, "NPA-T ECA:9/ExecutivePostDecisionDialogueExecutionReadinessGuidance");
  assert.equal(explain.ecaLiveExecutionJudgment?.identity, "NPA-T ECA:10/LiveExecutionDialogueDeviationIntelligence");
});

test("ECA:10 runtime — show blockers is not a write", () => {
  const workspaceId = setup();
  const show = run("Show blockers.", workspaceId);
  isolation(show);
  assert.equal(show.ecaLiveExecutionJudgment?.boundaries.writesExecution, false);
});
