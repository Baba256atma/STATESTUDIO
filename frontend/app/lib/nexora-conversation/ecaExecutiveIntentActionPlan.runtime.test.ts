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
import { getWorkspaceRisks, resetWorkspaceRiskStoreForTests } from "@/app/lib/risk/workspaceRiskContract.ts";
import { ensureBrowserLocalStorageHarness } from "@/app/lib/test-harness/browserLocalStorageHarness.ts";
import { createWorkspace, resetWorkspaceRegistryForTests } from "@/app/lib/workspace/workspaceRegistryStore.ts";

function setup() {
  ensureBrowserLocalStorageHarness();
  window.localStorage.clear();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceRegistryForTests();
  return createWorkspace("ECA:2 Runtime Proofs").workspaceId;
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
    messageIdSeed: `eca-2-runtime-${utterance}`,
  });
}

test("ECA:2 runtime 1 — Understand then investigate evidence", () => {
  const workspaceId = setup();
  const explained = run("Explain Capacity Gap.", workspaceId);
  const why = run("Why is it important?", workspaceId, explained);
  const evidence = run("Show me the evidence.", workspaceId, why);
  assert.equal(explained.ecaActionPlan?.intent, "EXPLAIN");
  assert.equal(why.ecaActionPlan?.intent, "EXPLAIN");
  assert.equal(evidence.ecaActionPlan?.intent, "INSPECT_EVIDENCE");
  assert.equal(evidence.ecaActionPlan?.nextAction, "SHOW_EVIDENCE");
  assert.equal(explained.ecaActionPlan?.boundaries.writesStage, false);
});

test("ECA:2 runtime 2 — Comparison follow-ups do not commit", () => {
  const workspaceId = setup();
  const compared = run("Compare Scenario A and Scenario B.", workspaceId);
  const risk = run("Which has lower risk?", workspaceId, compared);
  const speed = run("What if delivery speed matters more?", workspaceId, risk);
  assert.equal(compared.ecaActionPlan?.intent, "COMPARE");
  assert.equal(risk.ecaActionPlan?.intent, "EVALUATE");
  assert.equal(speed.ecaActionPlan?.intent, "ASK_WHAT_IF");
  assert.equal(compared.ecaActionPlan?.boundaries.commitsDecision, false);
  assert.equal(speed.decisionCommitmentResult?.decision ?? null, null);
});

test("ECA:2 runtime 3 — Recommendation about Capacity Gap is not a Decision", () => {
  const workspaceId = setup();
  const explained = run("Explain Capacity Gap.", workspaceId);
  const advised = run("What should I do about Capacity Gap?", workspaceId, explained);
  assert.equal(advised.ecaActionPlan?.intent, "SEEK_RECOMMENDATION");
  assert.equal(advised.ecaActionPlan?.boundaries.commitsDecision, false);
  assert.notEqual(advised.ecaActionPlan?.nextAction, "HANDOFF_TO_CANONICAL_AUTHORITY");
});

test("ECA:2 runtime 4 — Two references then Investigate it stays bounded", () => {
  const workspaceId = setup();
  const first = run("Explain Capacity Gap.", workspaceId);
  const second = run("Now tell me about Demand Surge.", workspaceId, first);
  const ambiguous = run("Investigate it.", workspaceId, second);
  const clarified = run("Bring that thing up.", workspaceId);
  assert.equal(second.ecaWorkingContext?.activeSubject?.id != null, true);
  assert.ok(
    ambiguous.ecaActionPlan?.nextAction === "ASK_CLARIFICATION" ||
      ambiguous.ecaActionPlan?.intent === "INVESTIGATE",
  );
  assert.equal(clarified.ecaActionPlan?.nextAction, "ASK_CLARIFICATION");
});

test("ECA:2 runtime 5 — Mutation reuses the certified Risk path", () => {
  const workspaceId = setup();
  const proposed = run("Add Supplier Delay as a Risk.", workspaceId);
  assert.equal(proposed.ecaActionPlan?.intent, "PROPOSE_CHANGE");
  assert.equal(getWorkspaceRisks(workspaceId).length, 0);
  const confirmed = run("Add it.", workspaceId, proposed);
  assert.equal(confirmed.ecaActionPlan?.intent, "CONFIRM_ACTION");
  assert.equal(confirmed.ecaActionPlan?.authorityTarget, "Canonical Risk Writer");
  assert.equal(getWorkspaceRisks(workspaceId).length, 1);
});

test("ECA:2 runtime 6 — CAP_AV meaning remains uncertain until confirmed", () => {
  const workspaceId = setup();
  const meaning = run("What does CAP_AV mean?", workspaceId);
  const worry = run("Should I worry about it?", workspaceId, meaning);
  assert.notEqual(worry.ecaActionPlan?.nextAction, "HANDOFF_TO_CANONICAL_AUTHORITY");
  assert.equal(worry.ecaActionPlan?.boundaries.mutatesBusinessState, false);
});

test("ECA:2 runtime 7 — Recommendation after comparison is not commitment", () => {
  const workspaceId = setup();
  const compared = run("Compare Scenario A and Scenario B.", workspaceId);
  const advised = run("What should I do?", workspaceId, compared);
  assert.equal(advised.ecaActionPlan?.intent, "SEEK_RECOMMENDATION");
  assert.notEqual(advised.ecaActionPlan?.intent, "COMMIT_DECISION");
  assert.equal(advised.ecaActionPlan?.boundaries.commitsDecision, false);
});
