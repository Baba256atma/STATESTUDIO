import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { createEmptyManagerObjectSession } from "@/app/lib/manager-object/managerObjectActive.ts";
import { createProactiveExecutiveSignal } from "@/app/lib/manager-object/nexoraNca5InitiativeIntelligence.ts";
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
  return createWorkspace("ECA:3 Runtime Proofs").workspaceId;
}

function run(
  utterance: string,
  workspaceId: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
  extra?: Parameters<typeof executeNexoraConversationalExperience>[0]["initiativeSignals"],
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
    messageIdSeed: `eca-3-runtime-${utterance}`,
    initiativeSignals: extra,
  });
}

test("ECA:3 runtime — explicit request is not hijacked by a moderate unrelated signal", () => {
  const workspaceId = setup();
  const minor = createProactiveExecutiveSignal({
    id: "margin-tick",
    family: "MATERIAL_CHANGE",
    source: "caller",
    subjectId: "margin",
    subjectLabel: "Margin",
    observation: "Margin ticked from 12.1 to 12.0.",
    previousValue: 12.1,
    currentValue: 12.0,
    significance: 0.12,
    relevance: 0.2,
    urgency: 0.1,
    novelty: 0.4,
    actionability: 0.1,
    confidence: 0.9,
  });
  const explained = run("Explain Capacity Gap.", workspaceId, undefined, [minor]);
  assert.equal(explained.ecaActionPlan?.intent, "EXPLAIN");
  assert.equal(explained.ecaInitiativeJudgment?.shouldIntervene, false);
  assert.equal(explained.ecaInitiativeJudgment?.boundaries.createsSecondInitiativeEngine, false);
});

test("ECA:3 runtime — material goal deviation can justify bounded initiative", () => {
  const workspaceId = setup();
  const drop = createProactiveExecutiveSignal({
    id: "delivery:96:91",
    family: "GOAL_DEVIATION",
    source: "caller",
    subjectId: "delivery",
    subjectLabel: "Delivery",
    observation: "Delivery moved from 96 to 91.",
    previousValue: 96,
    currentValue: 91,
    targetValue: 96,
    significance: 0.88,
    relevance: 0.95,
    urgency: 0.78,
    novelty: 1,
    actionability: 0.8,
    confidence: 0.9,
    nextStep: "Review Capacity Gap.",
  });
  const asked = run("How are we doing?", workspaceId, undefined, [drop]);
  assert.equal(asked.ecaInitiativeJudgment?.shouldIntervene, true);
  assert.equal(asked.ecaInitiativeJudgment?.reason, "GOAL_AT_RISK");
  assert.equal(asked.ecaInitiativeJudgment?.boundaries.commitsDecision, false);
  assert.equal(asked.ecaActionPlan?.intent, asked.ecaInitiativeJudgment?.recommendedActionPlan?.intent);
});

test("ECA:3 runtime — dismissal suppresses then new evidence can resurface", () => {
  const workspaceId = setup();
  const firstSignal = createProactiveExecutiveSignal({
    id: "supplier:1",
    family: "RISK_ESCALATION",
    source: "caller",
    subjectId: "supplier-delay",
    subjectLabel: "Supplier Delay",
    observation: "Supplier Delay may need review.",
    previousValue: 1,
    currentValue: 2,
    significance: 0.7,
    relevance: 0.9,
    urgency: 0.6,
    novelty: 1,
    actionability: 0.7,
    confidence: 0.9,
  });
  const first = run("How are we doing?", workspaceId, undefined, [firstSignal]);
  const dismissed = run("Not now.", workspaceId, first, [firstSignal]);
  const same = run("How are we doing?", workspaceId, dismissed, [firstSignal]);
  const changed = createProactiveExecutiveSignal({
    id: "supplier:2",
    family: "RISK_ESCALATION",
    source: "caller",
    subjectId: "supplier-delay",
    subjectLabel: "Supplier Delay",
    observation: "Supplier Delay now has new material evidence.",
    previousValue: 2,
    currentValue: 9,
    significance: 0.9,
    relevance: 0.95,
    urgency: 0.8,
    novelty: 1,
    actionability: 0.8,
    confidence: 0.9,
  });
  const resurfaced = run("How are we doing?", workspaceId, same, [changed]);
  assert.equal(first.ecaInitiativeJudgment?.shouldIntervene, true);
  assert.equal(same.ecaInitiativeJudgment?.shouldIntervene, false);
  assert.equal(resurfaced.ecaInitiativeJudgment?.shouldIntervene, true);
});

test("ECA:3 runtime — CAP_AV uncertainty is not an authoritative warning", () => {
  const workspaceId = setup();
  const worry = run("Should I worry about CAP_AV?", workspaceId);
  assert.notEqual(worry.ecaInitiativeJudgment?.strength, "WARN");
  assert.doesNotMatch(worry.response, /available capacity has fallen dangerously/i);
  assert.equal(worry.ecaActionPlan?.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY", true);
});
