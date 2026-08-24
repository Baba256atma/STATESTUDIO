/**
 * NCA:2 — Conversational context, topic, and dialogue-state tests A–R.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { freezeConversationalSubjectRecord } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import {
  createEmptyManagerObjectSession,
  freezeManagerObjectSession,
} from "./managerObjectActive.ts";
import {
  NEXORA_NCA2_BOUNDARY,
  getNexoraNca2Identity,
  verifyNexoraNca2,
} from "./nexoraNca2ConversationState.ts";

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function subjects() {
  return Object.freeze([
    ...projectManagerObjectConversationalSubjects(catalog()),
    freezeConversationalSubjectRecord({
      subjectId: "obj-profit-nca",
      subjectKind: "object",
      canonicalName: "Profit",
      aliases: Object.freeze(["Profit"]),
      businessKey: "obj-profit-nca",
    }),
  ]);
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects(),
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog: catalog(),
    previousManagerObjectSession:
      previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nca2-${utterance}`,
  });
}

function withDialogue(
  previous: ReturnType<typeof executeNexoraConversationalExperience>,
  patch: Partial<NonNullable<typeof previous.ncaConversationState>>,
) {
  const state = previous.ncaConversationState;
  if (!state) throw new Error("missing nca conversation state");
  return {
    ...previous,
    managerObjectTurn: {
      ...previous.managerObjectTurn,
      session: freezeManagerObjectSession({
        ...previous.managerObjectTurn.session,
        ncaConversationState: Object.freeze({ ...state, ...patch }),
      }),
    },
  };
}

describe("NCA:2 Conversational Context & Dialogue State", () => {
  it("identity does not create a second memory", () => {
    assert.equal(
      getNexoraNca2Identity().id,
      "NCA:2/ConversationalContextTopicDialogueStateIntelligence",
    );
    assert.equal(NEXORA_NCA2_BOUNDARY.createsSecondDurableMemory, false);
    assert.equal(NEXORA_NCA2_BOUNDARY.createsSecondAdvisor, false);
    assert.equal(NEXORA_NCA2_BOUNDARY.usesLiveLlm, false);
    assert.equal(verifyNexoraNca2().ok, true);
  });

  it("A. Yes, about 20% answers the pending Nexora question", () => {
    let previous = run("Should we increase capacity?");
    assert.equal(previous.ncaConversationState?.pendingQuestion?.askedBy, "NEXORA");
    previous = run("Yes, about 20%.", previous);
    assert.equal(previous.ncaConversationState?.dialogueMove, "ANSWER_NEXORA");
    assert.ok(previous.ncaConversationState?.lastAnswer);
    assert.equal(previous.ncaConversationState?.lastAnswer?.kind, "PERCENTAGE");
    assert.ok(
      previous.ncaConversationState?.answeredMissing.includes("demand-persistence"),
    );
    assert.match(previous.response, /demand pressure|capacity/i);
    assert.doesNotMatch(previous.response, /executive object/i);
  });

  it("B. 20% is a numeric short answer to expected information", () => {
    let previous = run("Should we increase capacity?");
    previous = run("20%.", previous);
    assert.equal(previous.ncaConversationState?.dialogueMove, "ANSWER_NEXORA");
    assert.equal(previous.ncaConversationState?.lastAnswer?.display, "20%");
  });

  it("C. Three months is a duration answer", () => {
    let previous = run("Should we increase capacity?");
    previous = run("Three months.", previous);
    assert.equal(previous.ncaConversationState?.dialogueMove, "ANSWER_NEXORA");
    assert.equal(previous.ncaConversationState?.lastAnswer?.kind, "DURATION");
  });

  it("D. What about Inventory? suspends Capacity", () => {
    let previous = run("Should we increase capacity?");
    previous = run("What about Inventory?", previous);
    assert.ok(
      previous.ncaConversationState?.dialogueMove === "TOPIC_SHIFT" ||
        previous.ncaConversationState?.dialogueMove === "PAUSE_TOPIC",
    );
    assert.match(previous.ncaConversationState?.activeSubject?.name ?? "", /Inventory/i);
    const capacity = previous.ncaConversationState?.threads.find((thread) =>
      /capacity/i.test(thread.subject.name ?? thread.topic.label),
    );
    assert.equal(capacity?.state, "SUSPENDED");
  });

  it("E. Go back to Capacity restores the thread", () => {
    let previous = run("Should we increase capacity?");
    previous = run("What about Inventory?", previous);
    previous = run("Go back to Capacity.", previous);
    assert.equal(previous.ncaConversationState?.dialogueMove, "RETURN_TO_TOPIC");
    assert.match(previous.ncaConversationState?.activeSubject?.name ?? "", /Capacity/i);
    assert.match(previous.response, /Returning to/i);
  });

  it("F. Continue where we were restores the suspended thread", () => {
    let previous = run("Should we increase capacity?");
    previous = run("What about Inventory?", previous);
    previous = run("Continue where we were.", previous);
    assert.equal(previous.ncaConversationState?.dialogueMove, "RETURN_TO_TOPIC");
    assert.match(previous.ncaConversationState?.activeSubject?.name ?? "", /Capacity/i);
  });

  it("G. Before that, show Delivery navigates and keeps Capacity pending", () => {
    let previous = run("Should we increase capacity?");
    const pending = previous.ncaConversationState?.pendingQuestion?.question;
    previous = run("Before that, show Delivery.", previous);
    assert.match(
      previous.nextRuntimeState.focusedSubject?.id ?? "",
      /delivery/i,
    );
    const capacity = previous.ncaConversationState?.threads.find((thread) =>
      /capacity/i.test(`${thread.subject.name ?? ""} ${thread.topic.label}`),
    );
    assert.equal(capacity?.state, "SUSPENDED");
    assert.equal(capacity?.pendingQuestion?.question, pending);
  });

  it("H. Forget Capacity. Let's focus on Inventory abandons Capacity", () => {
    let previous = run("Should we increase capacity?");
    previous = run("Forget Capacity. Let's focus on Inventory.", previous);
    const capacity = previous.ncaConversationState?.threads.find((thread) =>
      /capacity/i.test(`${thread.subject.name ?? ""} ${thread.topic.label}`),
    );
    assert.equal(capacity?.state, "ABANDONED");
    assert.equal(capacity?.pendingExpired, true);
    assert.match(previous.ncaConversationState?.activeSubject?.name ?? "", /Inventory/i);
  });

  it("I. No, I meant Capacity Gap corrects without writing business data", () => {
    let previous = run("Show Delivery.");
    previous = run("No, I meant Capacity Gap.", previous);
    assert.equal(previous.ncaConversationState?.dialogueMove, "CORRECT");
    assert.match(previous.ncaConversationState?.activeSubject?.name ?? "", /Capacity Gap/i);
    assert.equal(previous.ncaConversationState?.pendingQuestion?.askedBy ?? "NEXORA", "NEXORA");
  });

  it("J. The second one resolves Option B from offered options", () => {
    let previous = run("Should we increase capacity?");
    previous = withDialogue(previous, {
      lastOfferedOptions: Object.freeze(["Option A", "Option B"]),
    });
    previous = run("The second one.", previous);
    assert.equal(previous.ncaConversationState?.dialogueMove, "FOLLOW_UP");
    assert.match(previous.ncaConversationState?.activeSubject?.name ?? "", /Option B/i);
  });

  it("K. Why that one? resolves the last recommendation", () => {
    let previous = run("Should we increase capacity?");
    previous = withDialogue(previous, {
      lastRecommendation: "Temporary capacity",
    });
    previous = run("Why that one?", previous);
    assert.equal(previous.ncaConversationState?.dialogueMove, "FOLLOW_UP");
    assert.match(previous.response, /Temporary capacity/i);
    assert.doesNotMatch(previous.response, /decision is approved/i);
  });

  it("L. That makes sense accepts without creating a Decision", () => {
    let previous = run("Should we increase capacity?");
    previous = run("That makes sense.", previous);
    assert.equal(previous.ncaConversationState?.dialogueMove, "ACCEPT");
    assert.equal(previous.nextDecisionSession, null);
    assert.doesNotMatch(previous.response, /approved/i);
  });

  it("M. I don't like that option rejects without dropping comparison context", () => {
    let previous = run("Compare them.");
    previous = run("I don't like that option.", previous);
    assert.equal(previous.ncaConversationState?.dialogueMove, "REJECT");
    assert.match(previous.response, /comparison|another approach/i);
  });

  it("N. Multi-turn investigation stays on one thread", () => {
    let previous = run("Why is delivery below target?");
    assert.match(previous.response, /\?/);
    const threadId = previous.ncaConversationState?.currentThreadId;
    previous = run("Yes.", previous);
    assert.equal(previous.ncaConversationState?.dialogueMove, "ANSWER_NEXORA");
    assert.equal(previous.ncaConversationState?.currentThreadId, threadId);
    previous = run("More orders.", previous);
    assert.ok(
      previous.ncaConversationState?.dialogueMove === "ANSWER_NEXORA" ||
        previous.ncaConversationState?.currentThreadId === threadId,
    );
    assert.match(previous.response, /demand pressure|orders/i);
  });

  it("O. That answers my question resolves the thread", () => {
    let previous = run("Should we increase capacity?");
    previous = run("That answers my question.", previous);
    assert.equal(previous.ncaConversationState?.dialogueMove, "CLOSE_TOPIC");
    const current = previous.ncaConversationState?.threads.find(
      (thread) => thread.id === previous.ncaConversationState?.currentThreadId,
    );
    assert.equal(current?.state, "RESOLVED");
  });

  it("P. Thanks acknowledges and keeps the thread", () => {
    let previous = run("Should we increase capacity?");
    const threadId = previous.ncaConversationState?.currentThreadId;
    const pending = previous.ncaConversationState?.pendingQuestion?.question;
    previous = run("Thanks.", previous);
    assert.equal(previous.ncaConversationState?.dialogueMove, "ACKNOWLEDGE");
    assert.equal(previous.ncaConversationState?.currentThreadId, threadId);
    assert.equal(previous.ncaConversationState?.pendingQuestion?.question, pending);
  });

  it("Q. Abandoned pending questions are not resurrected", () => {
    let previous = run("Should we increase capacity?");
    previous = run("Forget Capacity. Let's focus on Inventory.", previous);
    previous = run("Go back to Capacity.", previous);
    assert.equal(previous.ncaConversationState?.pendingQuestion, null);
    const capacity = previous.ncaConversationState?.threads.find((thread) =>
      /capacity/i.test(`${thread.subject.name ?? ""} ${thread.topic.label}`),
    );
    assert.equal(capacity?.pendingExpired, true);
    assert.equal(capacity?.pendingQuestion, null);
  });

  it("R. Conversation subject wins over Stage focus", () => {
    let previous = run("Show Delivery.");
    assert.match(previous.nextRuntimeState.focusedSubject?.id ?? "", /delivery/i);
    previous = run("What Capacity Gap?", previous);
    assert.match(previous.ncaConversationState?.activeSubject?.name ?? "", /Capacity Gap/i);
    assert.notEqual(previous.ncaTurn.advisorBehavior, "NAVIGATE");
  });
});
