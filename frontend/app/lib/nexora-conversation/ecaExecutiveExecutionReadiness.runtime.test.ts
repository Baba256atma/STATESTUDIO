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
  return createWorkspace("ECA:9 Runtime Proofs").workspaceId;
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
    messageIdSeed: `eca-9-runtime-${utterance}`,
  });
}

function isolation(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  assert.equal(result.ecaExecutionReadinessJudgment?.boundaries.createsExecution, false);
  assert.equal(result.ecaExecutionReadinessJudgment?.boundaries.startsExecution, false);
  assert.equal(result.ecaExecutionReadinessJudgment?.boundaries.createsSecondExecutionWriter, false);
  assert.equal(result.ecaExecutionReadinessJudgment?.boundaries.replacesCc11, false);
  assert.equal(result.ecaCommitmentJudgment?.boundaries.startsExecution, false);
}

test("ECA:9 runtime — no Decision means not post-Decision", () => {
  const workspaceId = setup();
  const rec = run("What do you recommend?", workspaceId);
  const next = run("What’s next?", workspaceId, rec);
  isolation(next);
  assert.equal(next.ecaExecutionReadinessJudgment?.readiness, "NOT_APPLICABLE");
  assert.equal(next.ecaExecutionReadinessJudgment?.implicitStart, false);
});

test("ECA:9 runtime — CAP_AV does not inflate capacity", () => {
  const workspaceId = setup();
  const cap = run("Should I worry about CAP_AV?", workspaceId);
  const ready = run("Are we ready to execute?", workspaceId, cap);
  isolation(ready);
  assert.equal(ready.ecaExecutionReadinessJudgment?.trustInflation, false);
});

test("ECA:9 runtime — start without Decision does not write", () => {
  const workspaceId = setup();
  const start = run("Start it.", workspaceId);
  isolation(start);
  assert.equal(start.ecaExecutionReadinessJudgment?.canonicalStartAllowed, false);
  assert.equal(start.ecaActionPlan?.intent !== "REQUEST_EXECUTION_ACTION" || start.ecaActionPlan.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY" || start.ecaActionPlan.authorityTarget === "CC:10 Decision Commitment" || start.ecaActionPlan.authorityTarget === "CC:11 Execution Follow-up", true);
});

test("ECA:9 runtime — ECA:1–8 identities remain", () => {
  const workspaceId = setup();
  const explain = run("Explain Capacity Gap.", workspaceId);
  isolation(explain);
  assert.equal(explain.ecaWorkingContext?.identity, "NPA-T ECA:1/WorkingConversationContext");
  assert.equal(explain.ecaActionPlan?.intent, "EXPLAIN");
  assert.equal(explain.ecaCommitmentJudgment?.identity, "NPA-T ECA:8/ExecutiveCommitmentDialoguePreDecisionChallenge");
  assert.equal(explain.ecaExecutionReadinessJudgment?.identity, "NPA-T ECA:9/ExecutivePostDecisionDialogueExecutionReadinessGuidance");
});

test("ECA:9 runtime — show execution is not a write", () => {
  const workspaceId = setup();
  const show = run("Show me the execution.", workspaceId);
  isolation(show);
  assert.equal(show.ecaExecutionReadinessJudgment?.boundaries.createsExecution, false);
});
