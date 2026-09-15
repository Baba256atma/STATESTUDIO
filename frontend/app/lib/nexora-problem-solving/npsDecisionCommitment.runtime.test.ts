/**
 * NPA-T NPS:6 bounded live /executive proof via the production conversational path.
 */
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
  return createWorkspace("NPS:6 Runtime Proofs").workspaceId;
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
    messageIdSeed: `nps-6-runtime-${utterance}`,
    decisionRuntime: previous?.decisionRuntime ?? null,
    executionRuntime: previous?.executionRuntime ?? null,
  });
}

test("NPS:6 live — preference, challenge, and Decision vs Execution on Capacity Gap", () => {
  const workspaceId = setup();
  const first = run("Investigate Capacity Gap.", workspaceId);
  const listed = run("What options do we have for Capacity Gap?", workspaceId, first);
  const choose = run("Which one should we choose?", workspaceId, listed);
  assert.equal(choose.npsComparisonRecommendation?.problemId, "ctx-problem-capacity");
  const prefer = run("I prefer External Capacity.", workspaceId, choose);
  assert.equal(prefer.npsDecisionCommitment?.problemId, "ctx-problem-capacity");
  assert.equal(prefer.npsDecisionCommitment?.commitmentStatus, "PREFERENCE_EXPRESSED");
  assert.equal(prefer.npsDecisionCommitment?.approvedDecisionId, null);
  assert.equal(prefer.npsDecisionCommitment?.npsWritesDecision, false);
  assert.doesNotMatch(prefer.response, /\bNPS\b|\bECA:8\b|CC:10/i);
  const proceed = run("Let's proceed with it.", workspaceId, prefer);
  assert.equal(proceed.npsDecisionCommitment?.problemId, "ctx-problem-capacity");
  assert.equal(proceed.npsDecisionCommitment?.approvedDecisionId, null);
  assert.ok(
    proceed.npsDecisionCommitment?.commitmentStatus === "CHALLENGE_REQUIRED" ||
      proceed.npsDecisionCommitment?.commitmentStatus === "AWAITING_CONFIRMATION" ||
      proceed.npsDecisionCommitment?.commitmentStatus === "COMMITMENT_AMBIGUOUS" ||
      proceed.npsDecisionCommitment?.commitmentStatus === "PREFERENCE_EXPRESSED",
  );
  const yes = run("Yes.", workspaceId, proceed);
  assert.equal(yes.npsDecisionCommitment?.problemId, "ctx-problem-capacity");
  assert.equal(yes.npsDecisionCommitment?.npsWritesDecision, false);
  assert.equal(yes.npsDecisionCommitment?.startsExecution, false);
  if (yes.npsDecisionCommitment?.approvedDecisionId) {
    assert.equal(yes.npsPath?.currentState, "DECIDED");
  } else {
    assert.notEqual(yes.npsPath?.currentState, "DECIDED");
  }
  const decided = run("Did we decide?", workspaceId, yes);
  assert.equal(decided.npsDecisionCommitment?.problemId, "ctx-problem-capacity");
  if (decided.npsDecisionCommitment?.approvedDecisionId) {
    assert.match(decided.response, /approved Decision/i);
  } else {
    assert.match(decided.response, /has not been approved as the Decision/i);
  }
  const start = run("Start it.", workspaceId, decided);
  assert.match(start.response, /execution readiness/i);
  assert.equal(start.npsDecisionCommitment?.startsExecution, false);
  assert.equal(start.executionRuntime == null || start.npsDecisionCommitment?.writesExecution === false, true);
});
