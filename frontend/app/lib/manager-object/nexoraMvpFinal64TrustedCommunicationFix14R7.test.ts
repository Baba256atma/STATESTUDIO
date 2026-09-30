/**
 * NPA-T SIM-TEST:6-FIX14-R7 — Trusted Communication verbosity recovery.
 * A bare "Why?" answers the active Object's cause; recommendation justification
 * is appended only when a recommendation is already in the discourse.
 */
import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { createEmptyManagerObjectSession } from "@/app/lib/manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { applyNpsComparisonRecommendationToPresentedResponse } from "@/app/lib/nexora-problem-solving/npsComparisonRecommendationRuntime.ts";
import type { NpsComparisonRecommendation } from "@/app/lib/nexora-problem-solving/npsComparisonRecommendation.ts";
import { resetWorkspaceRiskStoreForTests } from "@/app/lib/risk/workspaceRiskContract.ts";
import { ensureBrowserLocalStorageHarness } from "@/app/lib/test-harness/browserLocalStorageHarness.ts";
import { createWorkspace, resetWorkspaceRegistryForTests } from "@/app/lib/workspace/workspaceRegistryStore.ts";

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

function run(utterance: string, previous?: Turn): Turn {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `fix14-r7-${utterance}`,
  });
}

function runInWorkspace(utterance: string, workspaceId: string, previous?: Turn): Turn {
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
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    messageIdSeed: `fix14-r7-ws-${utterance}`,
    decisionRuntime: previous?.decisionRuntime ?? null,
    executionRuntime: previous?.executionRuntime ?? null,
  });
}

function freshWorkspace(): string {
  ensureBrowserLocalStorageHarness();
  window.localStorage.clear();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceRegistryForTests();
  return createWorkspace("FIX14-R7").workspaceId;
}

function sentenceCount(text: string): number {
  return text.split(/(?<=[.!?])\s+/).filter(Boolean).length;
}

function depthOf(turn: Turn): string {
  return turn.trustedCommunication.depth;
}

const UNPRESENTED_RECOMMENDATION = /That recommendation stays on|The trade-off is|I recommend\b/;

function assertBriefCausalWhy(turn: Turn, subjectId: string, name: string) {
  assert.equal(turn.nextExecutiveContext.currentSubject?.subjectId, subjectId);
  assert.equal(turn.clarificationTurn.action, "proceed");
  assert.equal(depthOf(turn), "BRIEF");
  assert.ok(sentenceCount(turn.response) <= 6, turn.response);
  assert.match(turn.response, new RegExp(`\\b${name}\\b`));
  assert.doesNotMatch(turn.response, UNPRESENTED_RECOMMENDATION);
}

test("R7 A — exact failing case: bare Why? after an Object stays brief and on the Object", () => {
  assertBriefCausalWhy(run("Why?", run("Show Delivery.")), "obj-delivery", "Delivery");
  for (const [id, name] of [
    ["obj-delivery", "Delivery"],
    ["obj-capacity", "Capacity"],
    ["obj-risk", "Risk"],
  ] as const) {
    assertBriefCausalWhy(run("Why?", run("Explain it.", run(`Show ${name}.`))), id, name);
  }
});

test("R7 B — another generic Object gets the same brief causal Why?", () => {
  const turn = run("Why?", run("Explain it.", run("Show Inventory.")));
  assertBriefCausalWhy(turn, "obj-inventory", "Inventory");
});

test("R7 C — explicit detail request keeps DEEP depth and is not capped to brief", () => {
  const turn = run("Walk me through the evidence.", run("Why?", run("Show Delivery.")));
  assert.equal(depthOf(turn), "DEEP");
  assert.ok(sentenceCount(turn.response) > 3, turn.response);
  assert.match(turn.response, /Evidence:/);
});

test("R7 D — Explain keeps its normal depth and relationship qualification", () => {
  const turn = run("Explain it.", run("Show Delivery."));
  assert.equal(depthOf(turn), "NORMAL");
  assert.equal(turn.nextExecutiveContext.currentSubject?.subjectId, "obj-delivery");
  assert.match(turn.response, /Delivery/);
  assert.match(turn.response, /does not by itself tell us/);
});

test("R7 E — evidence request keeps supporting and missing evidence", () => {
  const turn = run("What evidence supports that?", run("Show Delivery."));
  assert.equal(turn.clarificationTurn.action, "proceed");
  assert.equal(turn.nextExecutiveContext.currentSubject?.subjectId, "obj-delivery");
  assert.match(turn.response, /Supporting evidence:/);
  assert.match(turn.response, /not a confirmed cause|not enough evidence/i);
});

test("R7 F — Why? keeps causal qualification instead of promoting a cause", () => {
  const delivery = run("Why?", run("Show Delivery."));
  assert.match(delivery.response, /does not establish it as the confirmed cause/);
  assert.doesNotMatch(delivery.response, /\bis causing\b|\bis the (?:root )?cause\b/i);
  const risk = run("Why?", run("Explain it.", run("Show Risk.")));
  assert.match(risk.response, /does not by itself tell us whether Risk is affecting/);
});

test("R7 G — uncertainty follow-up after a brief Why? stays honest", () => {
  const turn = run("How sure are you?", run("Why?", run("Show Delivery.")));
  assert.equal(turn.trustedCommunication.uncertaintyPreserved, true);
  assert.match(turn.response, /not a confirmed cause|assumption|uncertain/i);
  assert.doesNotMatch(turn.response, /\b(?:definitely|certainly|guaranteed)\b/i);
});

test("R7 H — canonical subject fidelity: Why? does not justify another subject's recommendation", () => {
  const turn = run("Why?", run("Explain it.", run("Show Risk.")));
  assert.equal(turn.nextExecutiveContext.currentSubject?.subjectId, "obj-risk");
  assert.doesNotMatch(turn.response, /Margin Pressure because|Capacity Gap faster/);
  assert.doesNotMatch(turn.response, /Remaining uncertainty:/);
});

test("R7 I — Why? after a formed recommendation still justifies that recommendation", () => {
  const workspaceId = freshWorkspace();
  let turn = runInWorkspace("Investigate Capacity Gap.", workspaceId);
  for (const utterance of ["What options do we have?", "Compare the options.", "Which one do you recommend?"]) {
    turn = runInWorkspace(utterance, workspaceId, turn);
  }
  const why = runInWorkspace("Why?", workspaceId, turn);
  assert.match(why.response, /I recommend temporary capacity/);
  assert.match(why.response, /That recommendation stays on Capacity Gap/);
  assert.match(why.response, /Remaining uncertainty:/);
});

test("R7 J — NPS:5 bare why needs a recommendation in discourse; explicit forms do not", () => {
  const comparison = {
    problemId: "ctx-problem-capacity",
    problemTitle: "Capacity Gap",
    recommendationRationale: "It addresses the short-term gap faster.",
    recommendationUncertainty: "The cause is not confirmed.",
    comparedOptions: [],
    managerProjection: { text: "" },
  } as unknown as NpsComparisonRecommendation;
  const source = "Delivery has not been resolved yet.";
  const apply = (utterance: string, recommendationInDiscourse?: boolean) =>
    applyNpsComparisonRecommendationToPresentedResponse({ source, utterance, comparison, recommendationInDiscourse });
  assert.equal(apply("Why?", false), source);
  assert.match(apply("Why?", true), /That recommendation stays on Capacity Gap/);
  assert.match(apply("Why that one?", false), /That recommendation stays on Capacity Gap/);
  assert.match(apply("Why do you recommend that?", false), /That recommendation stays on Capacity Gap/);
});
