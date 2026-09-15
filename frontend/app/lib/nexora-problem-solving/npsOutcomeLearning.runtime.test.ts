/**
 * NPA-T NPS:8 bounded live /executive proof via the production conversational path.
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
  return createWorkspace("NPS:8 Runtime Proofs").workspaceId;
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
    messageIdSeed: `nps-8-runtime-${utterance}`,
    decisionRuntime: previous?.decisionRuntime ?? null,
    executionRuntime: previous?.executionRuntime ?? null,
  });
}

test("NPS:8 live — Did it work, resolution, reassessment, and causal safety on Capacity Gap", () => {
  const workspaceId = setup();
  const first = run("Investigate Capacity Gap.", workspaceId);
  const listed = run("What options do we have for Capacity Gap?", workspaceId, first);
  const choose = run("Which one should we choose?", workspaceId, listed);
  const prefer = run("I prefer External Capacity.", workspaceId, choose);
  const proceed = run("Let's proceed with it.", workspaceId, prefer);
  const yes = run("Yes.", workspaceId, proceed);
  assert.equal(yes.npsOutcomeLearning?.problemId, "ctx-problem-capacity");
  assert.equal(yes.npsOutcomeLearning?.writesOutcome, false);
  assert.equal(yes.npsOutcomeLearning?.writesLearning, false);
  assert.equal(yes.npsOutcomeLearning?.npsWritesDecision, false);
  assert.equal(yes.npsOutcomeLearning?.writesExecution, false);

  const worked = run("Did it work?", workspaceId, yes);
  assert.equal(worked.npsOutcomeLearning?.problemId, "ctx-problem-capacity");
  assert.notEqual(worked.npsPath?.currentState, "RESOLVED");
  assert.match(worked.response, /not enough Outcome evidence|completed, but|does not yet tell us whether|has not been reached|improved/i);
  assert.doesNotMatch(worked.response, /\bNPS:8\b|\bCORE-OUT\b|\bECA:11\b/);
  assert.equal(worked.npsOutcomeLearning?.attribution, "NOT_ESTABLISHED");
  assert.equal(worked.npsOutcomeLearning?.learningDurable, false);

  const solved = run("Is Capacity Gap solved?", workspaceId, worked);
  assert.equal(solved.npsOutcomeLearning?.problemId, "ctx-problem-capacity");
  assert.match(solved.response, /not solved|not fully resolved|not enough|Execution completion/i);
  assert.notEqual(solved.npsOutcomeLearning?.resolutionStatus, "RESOLVED");

  const next = run("What should we do now?", workspaceId, solved);
  assert.equal(next.npsOutcomeLearning?.problemId, "ctx-problem-capacity");
  assert.match(next.response, /reassess|Outcome|evidence|remaining/i);
  assert.equal(next.npsOutcomeLearning?.npsWritesDecision, false);
  assert.equal(next.npsOutcomeLearning?.writesExecution, false);

  const caused = run("So External Capacity caused the improvement?", workspaceId, next);
  assert.equal(caused.npsOutcomeLearning?.problemId, "ctx-problem-capacity");
  assert.equal(caused.npsOutcomeLearning?.attribution, "NOT_ESTABLISHED");
  assert.match(caused.response, /does not establish|doesn’t establish|doesn't establish|not establish/i);
  assert.equal(caused.decisionRuntime == null || caused.npsOutcomeLearning?.npsWritesDecision === false, true);
  assert.equal(caused.executionRuntime == null || caused.npsOutcomeLearning?.writesExecution === false, true);
});
