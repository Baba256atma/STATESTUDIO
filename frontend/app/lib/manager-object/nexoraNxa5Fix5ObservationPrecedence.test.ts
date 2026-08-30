import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import {
  classifyManagerSpeechAct,
  isCompleteManagerBusinessObservation,
  isManagerCausalAssertion,
} from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import { interpretManagerTurnMeaning } from "./nexoraMvpFinal61NaturalLanguageUnderstanding.ts";
import {
  classifyObservationContextOwnership,
  verifyNexoraNxa5Fix5,
} from "./nexoraNxa5Fix5ObservationPrecedence.ts";
import { projectAuthoritativeStageContext } from "./nexoraNxa5Fix4StageContextIntelligence.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

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
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nxa5-fix5-${utterance}`,
  });
}

describe("NXA:5-FIX5 manager observation precedence", () => {
  it("owns a boundary without a second observation store", () => {
    assert.equal(verifyNexoraNxa5Fix5().ok, true);
    assert.equal(isCompleteManagerBusinessObservation("delivery is too late"), true);
    assert.equal(classifyManagerSpeechAct("delivery is too late"), "OBSERVATION");
    assert.equal(isManagerCausalAssertion("Capacity is causing Delivery delays"), true);
    assert.equal(isCompleteManagerBusinessObservation("Capacity is causing Delivery delays"), false);
  });

  it("A — stale focused Capacity does not own a Delivery observation", () => {
    const shown = run("show Capacity");
    assert.equal(shown.nextRuntimeState.focusedSubject?.label, "Capacity");
    const observed = run("delivery is too late", shown);
    const meaning = interpretManagerTurnMeaning({ utterance: "delivery is too late", subjects });
    assert.equal(meaning.requestedOperation, "OBSERVE");
    assert.equal(meaning.objectReference?.canonicalName, "Delivery");
    assert.equal(observed.contextualManagerMeaning?.objectReference?.canonicalName, "Delivery");
    assert.doesNotMatch(observed.response, /without intervention/i);
    assert.match(observed.response, /Delivery/i);
    assert.match(observed.response, /observation|reported/i);
    assert.equal(observed.nextRuntimeState.focusedSubject?.label, "Capacity");
    assert.equal(observed.shouldCommitRuntime, false);
    assert.equal(observed.managerObjectTurn.session.managerObservations?.at(-1)?.matchedLabel, "Delivery");
    assert.equal(observed.managerObjectTurn.session.managerObservations?.at(-1)?.provenance, "manager-reported");
    const stage = projectAuthoritativeStageContext({ runtimeState: observed.nextRuntimeState, catalog });
    assert.equal(
      classifyObservationContextOwnership({
        utterance: "delivery is too late",
        explicitSubject: "Delivery",
        stage,
      }),
      "IRRELEVANT_TO_OWNERSHIP",
    );
  });

  it("B — stale Scenario collection does not own an Inventory observation", () => {
    const shown = run("show scenarios");
    const observed = run("inventory is too high", shown);
    assert.equal(observed.nextRuntimeState.collectionContext?.category, "scenario");
    assert.doesNotMatch(observed.response, /without intervention/i);
    assert.match(observed.response, /Inventory/i);
    assert.equal(observed.managerObjectTurn.session.managerObservations?.at(-1)?.matchedLabel, "Inventory");
  });

  it("C — a new observation does not continue a previous consequence intent", () => {
    const shown = run("show Capacity");
    const consequence = run("what happens if we ignore it?", shown);
    assert.match(consequence.response, /without intervention|ignore|scenario/i);
    const observed = run("delivery is too late", consequence);
    assert.doesNotMatch(observed.response, /If Capacity remains without intervention/i);
    assert.match(observed.response, /Delivery/i);
  });

  it("D — a new observation after explain is not owned by the explained object", () => {
    const explained = run("explain Capacity");
    const observed = run("budget is getting worse", explained);
    assert.match(observed.response, /Budget/i);
    assert.doesNotMatch(observed.response, /without intervention/i);
    assert.equal(observed.managerObjectTurn.session.managerObservations?.at(-1)?.matchedLabel, "Budget");
  });

  it("E — explicit causal assertions stay hypotheses, not Delivery observations", () => {
    const shown = run("show Capacity");
    const causal = run("Capacity is causing Delivery delays", shown);
    assert.match(causal.response, /causal hypothesis|causing/i);
    assert.doesNotMatch(causal.response, /I'll treat that as your current observation about Delivery/i);
    assert.equal(causal.nextRuntimeState.focusedSubject?.label, "Capacity");
  });

  it("F — genuine deictic consequence still resolves to the prior subject", () => {
    const shown = run("show Capacity");
    const low = run("capacity is insufficient", shown);
    assert.match(low.response, /Capacity/i);
    const ignore = run("what happens if we ignore it?", low);
    assert.match(ignore.response, /Capacity/i);
    assert.match(ignore.response, /without intervention|scenario/i);
  });

  it("preserves pending criterion answers and FIX4 talk-vs-show", () => {
    const shown = run("show scenarios");
    const asked = run("which one is more important?", shown);
    const risk = run("risk", asked);
    assert.equal(risk.nextRuntimeState.collectionContext?.category, "scenario");
    assert.notEqual(risk.nextRuntimeState.focusedSubject?.label, "Risk");
    const knowledge = run("what is Capacity?", shown);
    assert.equal(knowledge.nextRuntimeState.collectionContext?.category, "scenario");
    const focused = run("show Capacity", shown);
    assert.equal(focused.nextRuntimeState.focusedSubject?.label, "Capacity");
  });

  it("generalizes evaluative observations across object kinds", () => {
    for (const utterance of [
      "quality is getting worse",
      "costs increased",
      "customer satisfaction dropped",
    ]) {
      assert.equal(isCompleteManagerBusinessObservation(utterance), true, utterance);
      const result = run(utterance);
      assert.doesNotMatch(result.response, /without intervention/i, utterance);
    }
  });

  it("recalls the latest manager observation without changing Stage", () => {
    const shown = run("show Capacity");
    const observed = run("delivery is too late", shown);
    const recalled = run("what did I just tell you?", observed);
    assert.match(recalled.response, /delivery is too late/i);
    assert.match(recalled.response, /Delivery/i);
    assert.equal(recalled.nextRuntimeState.focusedSubject?.label, "Capacity");
    assert.equal(recalled.shouldCommitRuntime, false);
  });
});
