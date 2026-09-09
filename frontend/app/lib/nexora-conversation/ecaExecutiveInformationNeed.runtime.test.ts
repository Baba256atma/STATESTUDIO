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
  return createWorkspace("ECA:4 Runtime Proofs").workspaceId;
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
    messageIdSeed: `eca-4-runtime-${utterance}`,
  });
}

test("ECA:4 runtime — known delivery target is not re-asked", () => {
  const workspaceId = setup();
  const result = run(
    "The on-time delivery target is 96%. Compare Scenario A and Scenario B using the on-time delivery target.",
    workspaceId,
  );
  assert.equal(result.ecaActionPlan?.intent, "COMPARE");
  assert.equal(result.ecaInformationNeedJudgment?.shouldAsk, false);
  assert.equal(result.ecaInformationNeedJudgment?.acquisitionAction, "NO_ACQUISITION_NEEDED");
  assert.doesNotMatch(result.response, /what is (?:the |your )?delivery target/i);
  assert.equal(result.ecaInformationNeedJudgment?.boundaries.createsSecondClarificationEngine, false);
});

test("ECA:4 runtime — comparison missing cost", () => {
  const workspaceId = setup();
  const result = run("Which scenario is cheaper?", workspaceId);
  assert.equal(result.ecaInformationNeedJudgment?.primaryNeed?.informationType, "COST");
  assert.equal(result.ecaInformationNeedJudgment?.primaryNeed?.currentStatus, "MISSING");
  assert.match(
    `${result.response} ${result.ecaInformationNeedJudgment?.question?.text ?? ""}`,
    /cost/i,
  );
  assert.equal(result.ecaInformationNeedJudgment?.boundaries.writesDataTruth, false);
});

test("ECA:4 runtime — I don’t know is not fabricated or repeated", () => {
  const workspaceId = setup();
  const asked = run("What is Supplier B's available capacity?", workspaceId);
  const unknown = run("I don't know.", workspaceId, asked);
  assert.equal(unknown.ecaInformationNeedJudgment?.shouldAsk, false);
  assert.doesNotMatch(unknown.response, /supplier b['’]s current available capacity\?/i);
  assert.equal(unknown.ecaInformationNeedJudgment?.boundaries.writesDataTruth, false);
});

test("ECA:4 runtime — why explains the information value", () => {
  const workspaceId = setup();
  const asked = run("Which scenario is cheaper?", workspaceId);
  const why = run("Why do you need that?", workspaceId, asked);
  assert.match(why.response, /compar|cost/i);
  assert.equal(why.ecaInformationNeedJudgment?.shouldAsk, false);
});

test("ECA:4 runtime — skip then compare proceeds without trapping", () => {
  const workspaceId = setup();
  const asked = run("Do you know Supplier B's lead time?", workspaceId);
  const skip = run("Not now.", workspaceId, asked);
  const compare = run("Compare the scenarios anyway.", workspaceId, skip);
  assert.equal(skip.ecaInformationNeedJudgment?.acquisitionAction, "DEFER");
  assert.equal(compare.ecaInformationNeedJudgment?.shouldAsk, false);
});

test("ECA:4 runtime — CAP_AV value is not treated as missing or confirmed", () => {
  const workspaceId = setup();
  const result = run("Should I worry about CAP_AV?", workspaceId);
  assert.equal(result.ecaInformationNeedJudgment?.primaryNeed?.currentStatus, "KNOWN_UNCONFIRMED");
  assert.notEqual(result.ecaInformationNeedJudgment?.primaryNeed?.currentStatus, "MISSING");
  assert.equal(result.ecaInformationNeedJudgment?.acquisitionAction, "REQUEST_SEMANTIC_CONFIRMATION");
  assert.equal(result.ecaInformationNeedJudgment?.boundaries.writesDataTruth, false);
});

test("ECA:4 runtime — execution ask cannot start Execution", () => {
  const workspaceId = setup();
  const result = run("Start the plan.", workspaceId);
  assert.equal(result.ecaInformationNeedJudgment?.primaryNeed?.informationType, "PREREQUISITE");
  assert.equal(result.ecaInformationNeedJudgment?.boundaries.startsExecution, false);
  assert.equal(result.ecaActionPlan?.authorityTarget !== "CC:11 Execution Follow-up" || result.ecaActionPlan.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY", true);
});

test("ECA:4 runtime — ECA:1–3 regression on an explicit explanation", () => {
  const workspaceId = setup();
  const result = run("Explain Capacity Gap.", workspaceId);
  assert.equal(result.ecaWorkingContext?.identity, "NPA-T ECA:1/WorkingConversationContext");
  assert.equal(result.ecaActionPlan?.intent, "EXPLAIN");
  assert.equal(result.ecaInitiativeJudgment?.shouldIntervene, false);
  assert.equal(result.ecaInformationNeedJudgment?.shouldAsk, false);
  assert.equal(result.response.includes("?"), false);
});
