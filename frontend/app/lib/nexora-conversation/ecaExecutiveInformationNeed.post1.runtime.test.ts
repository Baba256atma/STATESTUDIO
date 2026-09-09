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
  return createWorkspace("ECA:4-POST1 Runtime").workspaceId;
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
    messageIdSeed: `eca-4-post1-${utterance}`,
  });
}

function prepareRisk(workspaceId: string) {
  return run("show Risk", workspaceId);
}

const IDENTITY = /Nexora is the executive decision workspace/i;
const REPRO =
  "you say: Nexora does not yet have enough evidence to determine this. what do you need for determine it ?";

test("ECA:4-POST1 runtime sequence 1 — reported failure", () => {
  const workspaceId = setup();
  const focused = prepareRisk(workspaceId);
  const stage = run("what is on stage now ?", workspaceId, focused);
  const explain = run("Explain this.", workspaceId, stage);
  const need = run(REPRO, workspaceId, explain);
  assert.doesNotMatch(need.response, IDENTITY);
  assert.match(need.response, /Risk|Margin|evidence|timing/i);
  assert.equal(need.ecaInformationNeedJudgment?.boundaries.writesRisk, false);
  assert.equal(need.ecaInformationNeedJudgment?.boundaries.writesStage, false);
  assert.equal(need.ncaPost3Diagnostics?.semanticScope, "BUSINESS");
});

test("ECA:4-POST1 runtime sequence 2 — partial acquisition", () => {
  const workspaceId = setup();
  const focused = prepareRisk(workspaceId);
  const stage = run("what is on stage now ?", workspaceId, focused);
  const explain = run("Explain this.", workspaceId, stage);
  const asked = run("What do you need to determine it?", workspaceId, explain);
  const partial = run("Margin fell in July.", workspaceId, asked);
  assert.match(partial.response, /still need|timing|appeared|intensif/i);
  assert.doesNotMatch(partial.response, /What do you mean by margin/i);
  assert.doesNotMatch(partial.response, IDENTITY);
});

test("ECA:4-POST1 runtime sequence 4 — I don't know", () => {
  const workspaceId = setup();
  const focused = prepareRisk(workspaceId);
  const stage = run("what is on stage now ?", workspaceId, focused);
  const explain = run("Explain this.", workspaceId, stage);
  const asked = run("What do you need to determine it?", workspaceId, explain);
  const unknown = run("I don't know.", workspaceId, asked);
  assert.match(unknown.response, /unknown|unresolved/i);
  assert.equal(/\?/.test(unknown.response) && /when this Risk/i.test(unknown.response), false);
});

test("ECA:4-POST1 runtime sequence 6 — CAP_AV side question then resume", () => {
  const workspaceId = setup();
  const focused = prepareRisk(workspaceId);
  const stage = run("what is on stage now ?", workspaceId, focused);
  const explain = run("Explain this.", workspaceId, stage);
  const cap = run("What does CAP_AV mean?", workspaceId, explain);
  const resume = run("Okay. What do you still need for the Risk?", workspaceId, cap);
  assert.doesNotMatch(resume.response, IDENTITY);
  assert.match(resume.response, /Risk|evidence|timing|Margin/i);
  assert.doesNotMatch(resume.response, /confirmed available capacity evidence/i);
});

test("ECA:4-POST1 runtime sequence 8 — reassessment is not hijacked", () => {
  const workspaceId = setup();
  const result = run("Do we need to reassess the Decision?", workspaceId);
  assert.equal(result.ecaActionPlan?.intent, "REASSESS");
  assert.equal(result.ecaInformationNeedJudgment?.advisorConsumedInformationNeed, false);
});

test("ECA:4-POST1 runtime ordinary business need", () => {
  const workspaceId = setup();
  const result = run("We need to reduce cost.", workspaceId);
  assert.doesNotMatch(result.response, /I need evidence that connects this Risk/i);
});
