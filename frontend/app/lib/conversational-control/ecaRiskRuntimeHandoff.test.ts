import assert from "node:assert/strict";
import test from "node:test";

import { createWorkspace, resetWorkspaceRegistryForTests } from "@/app/lib/workspace/workspaceRegistryStore.ts";
import { ensureBrowserLocalStorageHarness } from "@/app/lib/test-harness/browserLocalStorageHarness.ts";
import { getWorkspaceRisks, resetWorkspaceRiskStoreForTests } from "@/app/lib/risk/workspaceRiskContract.ts";
import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "./executiveContextSnapshot.ts";
import { createInitialNexoraMVPObjectInteractionState, getDefaultNexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "./conversationalSubjectRegistry.ts";
import { createEmptyManagerObjectSession } from "@/app/lib/manager-object/managerObjectActive.ts";

function setup() {
  ensureBrowserLocalStorageHarness();
  window.localStorage.clear();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceRegistryForTests();
  return createWorkspace("Conversational Risk Runtime").workspaceId;
}

function run(utterance: string, workspaceId: string, previous?: ReturnType<typeof executeNexoraConversationalExperience>) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext ?? { currentSubjectId: null, previousSubjectIds: [], currentWorkspaceId: workspaceId },
    executiveContext: previous?.nextExecutiveContext ?? createEmptyNexoraExecutiveContextSnapshot({ currentWorkspaceId: workspaceId }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: previous?.nextRuntimeState ?? createInitialNexoraMVPObjectInteractionState({ workspace: "overview", presentationState: "minimum", environmentIntent: "neutral" }),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    messageIdSeed: `eca-fix2-${utterance}`,
  });
}

test("live orchestration binds proposal, confirms through canonical writer, and clears session state", () => {
  const workspaceId = setup();
  const proposed = run("Add Supplier Delay as a Risk.", workspaceId);
  assert.match(proposed.nexoraMessage.text, /Add it/i);
  assert.equal(proposed.ecaActionPlan?.intent, "PROPOSE_CHANGE");
  assert.equal(proposed.ecaActionPlan?.nextAction, "PREPARE_PROPOSAL");
  assert.equal(getWorkspaceRisks(workspaceId).length, 0);
  const confirmed = run("Add it.", workspaceId, proposed);
  assert.equal(confirmed.ecaActionPlan?.intent, "CONFIRM_ACTION");
  assert.equal(confirmed.ecaActionPlan?.authorityTarget, "Canonical Risk Writer");
  assert.equal(getWorkspaceRisks(workspaceId).length, 1);
  assert.match(confirmed.nexoraMessage.text, /added as a Risk/i);
  assert.equal(confirmed.managerObjectTurn.session.ecaMutationProposal, null);
});

test("cancel clears proposal and never writes a Risk", () => {
  const workspaceId = setup();
  const proposed = run("Add Supplier Quality as a Risk.", workspaceId);
  const cancelled = run("Never mind.", workspaceId, proposed);
  assert.equal(getWorkspaceRisks(workspaceId).length, 0);
  assert.match(cancelled.nexoraMessage.text, /won.t add/i);
  assert.equal(cancelled.managerObjectTurn.session.ecaMutationProposal, null);
});

test("explanatory follow-up preserves the active proposal for its later confirmation", () => {
  const workspaceId = setup();
  const proposed = run("Add Supplier Delay as a Risk.", workspaceId);
  const explained = run("Why?", workspaceId, proposed);
  assert.equal(explained.ecaActionPlan?.intent, "EXPLAIN");
  assert.equal(
    explained.managerObjectTurn.session.ecaMutationProposal?.proposalId,
    proposed.managerObjectTurn.session.ecaMutationProposal?.proposalId,
  );
  assert.equal(getWorkspaceRisks(workspaceId).length, 0);
  const confirmed = run("Add it.", workspaceId, explained);
  assert.equal(confirmed.ecaActionPlan?.intent, "CONFIRM_ACTION");
  assert.equal(getWorkspaceRisks(workspaceId).length, 1);
});
