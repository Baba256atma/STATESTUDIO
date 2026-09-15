/**
 * NPA-T NPS:7 bounded live /executive recovery proof.
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
import { resetOutcomeObservationCaptureForTests } from "@/app/lib/executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";

function setup() {
  ensureBrowserLocalStorageHarness();
  window.localStorage.clear();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceRegistryForTests();
  resetOutcomeObservationCaptureForTests();
  return createWorkspace("NPS:7 Recovery Proofs").workspaceId;
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
    messageIdSeed: `nps-7-recovery-${utterance}`,
    decisionRuntime: previous?.decisionRuntime ?? null,
    executionRuntime: previous?.executionRuntime ?? null,
  });
}

test("NPS:7 recovery live — Decision to readiness to monitoring to NPS:8 Outcome Review", () => {
  const workspaceId = setup();
  const first = run("Investigate Capacity Gap.", workspaceId);
  const listed = run("What options do we have for Capacity Gap?", workspaceId, first);
  const choose = run("Which one should we choose?", workspaceId, listed);
  const prefer = run("I prefer External Capacity.", workspaceId, choose);
  const proceed = run("Let's proceed with it.", workspaceId, prefer);
  const yes = run("Yes.", workspaceId, proceed);
  assert.equal(yes.npsExecutionMonitoring?.identity, "NPA-T NPS:7/ExecutionMonitoring");
  assert.equal(yes.npsExecutionMonitoring?.npsWritesExecution, false);
  assert.equal(yes.npsExecutionMonitoring?.writesOutcome, false);
  assert.equal(yes.npsExecutionMonitoring?.writesLearning, false);

  const ready = run("Are we ready to execute?", workspaceId, yes);
  assert.equal(ready.npsExecutionMonitoring?.problemId, "ctx-problem-capacity");
  assert.equal(ready.npsExecutionMonitoring?.npsWritesExecution, false);
  if (!ready.npsExecutionMonitoring?.decisionId) {
    assert.equal(ready.npsExecutionMonitoring?.readinessStatus, "NOT_READY");
    assert.equal(ready.npsExecutionMonitoring?.executionId, null);
  } else {
    assert.notEqual(ready.npsPath?.currentState, "RESOLVED");
    assert.ok(
      ready.npsExecutionMonitoring.executionId == null ||
        ready.npsExecutionMonitoring.readinessStatus === "ALREADY_EXECUTING",
    );
  }

  const start = run("Start it.", workspaceId, ready);
  assert.equal(start.npsExecutionMonitoring?.problemId, "ctx-problem-capacity");
  assert.equal(start.npsExecutionMonitoring?.npsWritesExecution, false);
  if (start.npsExecutionMonitoring?.executionHandoffStatus === "FAILED") {
    assert.equal(start.npsExecutionMonitoring.executionId, null);
    assert.notEqual(start.npsPath?.currentState, "EXECUTING");
  }
  if (start.npsExecutionMonitoring?.readinessStatus === "BLOCKED") {
    assert.equal(start.npsExecutionMonitoring.executionHandoffStatus, "NOT_AUTHORIZED");
  }

  const going = run("How is it going?", workspaceId, start);
  assert.equal(going.npsExecutionMonitoring?.problemId, "ctx-problem-capacity");
  if (going.npsExecutionMonitoring?.progress !== "UNKNOWN" && going.npsExecutionMonitoring?.progress != null) {
    assert.equal(typeof going.npsExecutionMonitoring.progress, "number");
  } else {
    assert.equal(going.npsExecutionMonitoring?.progress, "UNKNOWN");
  }

  const worked = run("Did it work?", workspaceId, going);
  assert.equal(worked.npsOutcomeLearning?.problemId, "ctx-problem-capacity");
  if (worked.npsExecutionMonitoring?.outcomeHandoff.executionId) {
    assert.equal(worked.npsOutcomeLearning?.executionId, worked.npsExecutionMonitoring.outcomeHandoff.executionId);
    assert.equal(worked.npsOutcomeLearning?.decisionId, worked.npsExecutionMonitoring.outcomeHandoff.decisionId);
  }
  assert.notEqual(worked.npsOutcomeLearning?.resolutionStatus, "RESOLVED");
  assert.match(worked.response, /not enough Outcome evidence|completed, but|does not yet tell us whether|has not been reached|improved|Execution/i);
  assert.doesNotMatch(worked.response, /\bNPS:7\b|\bECA:9\b|\bCC:11\b/);
});
