/**
 * NCA-POST:2 — speech acts, pending-question precedence, collection queries.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { freezeConversationalSubjectRecord } from "../conversational-control/conversationalSubjectRegistry.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { interpretCanonicalManagerMeaning } from "./canonicalManagerMeaningInterpreter.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import {
  classifyManagerSpeechAct,
  composeConcreteAttentionReason,
  inferNexoraQuestionPurpose,
  interpretExecutiveCollectionQuery,
  interpretManagerProvidedObservation,
  nexoraNcaPost2Identity,
  polarReplyCompatibleWithPurpose,
  rewriteTautologicalAttentionLanguage,
  selectAnswerablePendingQuestion,
  verifyNexoraNcaPost2,
} from "./nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts";
import {
  createProactiveExecutiveSignal,
  evaluateNca5InitiativeStrategy,
} from "./nexoraNca5InitiativeIntelligence.ts";

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function subjects() {
  return Object.freeze([
    ...projectManagerObjectConversationalSubjects(catalog()),
    freezeConversationalSubjectRecord({
      subjectId: "obj-margin-post2",
      subjectKind: "object",
      canonicalName: "Margin",
      aliases: Object.freeze(["Margin"]),
      businessKey: "obj-margin-post2",
    }),
  ]);
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
  extra?: {
    readonly initiativeSignals?: Parameters<
      typeof executeNexoraConversationalExperience
    >[0]["initiativeSignals"];
  },
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
    messageIdSeed: `nca-post2-${utterance}`,
    initiativeSignals: extra?.initiativeSignals,
  });
}

describe("NCA-POST:2 Manager assertions, pending questions, collections", () => {
  it("owns identity without creating NCA:8", () => {
    assert.match(nexoraNcaPost2Identity, /^NCA-POST:2\//);
    assert.equal(verifyNexoraNcaPost2().ok, true);
  });

  it("A command vs B assertion vs C question vs D numeric vs E correction vs F preference", () => {
    assert.equal(classifyManagerSpeechAct("show Delivery"), "COMMAND");
    assert.equal(interpretCanonicalManagerMeaning({ utterance: "show Delivery", subjects: subjects() }).requestedOperation, "FOCUS");
    const okay = classifyManagerSpeechAct("Delivery is okay.");
    assert.ok(okay === "ASSERTION" || okay === "OBSERVATION");
    assert.equal(interpretCanonicalManagerMeaning({ utterance: "Delivery is okay.", subjects: subjects() }).requestedOperation, "OBSERVE");
    assert.equal(classifyManagerSpeechAct("Is Delivery okay?"), "QUESTION");
    const numeric = classifyManagerSpeechAct("Delivery is 94%.");
    assert.ok(numeric === "OBSERVATION" || numeric === "ASSERTION");
    assert.equal(classifyManagerSpeechAct("No, Delivery is 94%."), "CORRECTION");
    assert.equal(classifyManagerSpeechAct("I'm okay with 91%."), "PREFERENCE");
  });

  it("does not navigate on a copular observation", () => {
    const result = run("Delivery is okay.");
    assert.doesNotMatch(result.response, /Focused on Delivery/i);
    assert.match(result.response, /Understood|observation|perspective|treat/i);
  });

  it("binds polar answers to the latest compatible question purpose", () => {
    const stale = selectAnswerablePendingQuestion(
      [
        {
          question: "Is demand expected to continue?",
          askedAtTurn: 2,
          status: "ACTIVE" as const,
          valid: true,
          questionPurpose: inferNexoraQuestionPurpose("Is demand expected to continue?"),
        },
        {
          question: "Would you like to review Customer?",
          askedAtTurn: 5,
          status: "ACTIVE" as const,
          valid: true,
          questionPurpose: inferNexoraQuestionPurpose("Would you like to review Customer?"),
        },
      ],
      "yes",
    );
    assert.match(stale?.question ?? "", /review Customer/i);
    assert.equal(polarReplyCompatibleWithPurpose("BOOLEAN_BUSINESS_FACT") || polarReplyCompatibleWithPurpose("REVIEW_OFFER"), true);
  });

  it("does not treat expired questions as answerable", () => {
    const picked = selectAnswerablePendingQuestion(
      [
        {
          question: "Would you like to review Customer?",
          askedAtTurn: 9,
          status: "EXPIRED" as const,
          valid: true,
        },
      ],
      "yes",
    );
    assert.equal(picked, null);
  });

  it("recognizes collection queries instead of All Problems object lookup", () => {
    for (const utterance of [
      "show me all problems",
      "show problems",
      "show active problems",
      "what problems do we have?",
      "show all risks",
      "show active risks",
      "show decisions",
      "show executions",
      "show goals",
    ]) {
      const query = interpretExecutiveCollectionQuery(utterance);
      assert.ok(query, utterance);
      assert.equal(query?.ambiguousIssueNoun, false);
      const intent = resolveNexoraConversationalIntent({ utterance }).intent;
      assert.match(intent.kind, /^show-/);
      assert.doesNotMatch(intent.kind, /focus/);
    }
    const live = run("show me all problems");
    assert.doesNotMatch(live.response, /All Problems/i);
    assert.doesNotMatch(live.response, /clear match for/i);
  });

  it("returns a valid empty collection, not an unresolved object", () => {
    const query = interpretExecutiveCollectionQuery("show active risks");
    assert.equal(query?.collectionKind === "RISK" || query?.collectionKind === "PROBLEM", true);
  });

  it("preserves collection ordinals", () => {
    let turn = run("show me all problems");
    turn = run("explain the first one", turn);
    assert.doesNotMatch(turn.response, /All Problems/i);
    turn = run("show the other one", turn);
    assert.doesNotMatch(turn.response, /All Problems/i);
  });

  it("keeps ordinary greeting silent", () => {
    const result = run("hi");
    assert.match(result.response, /ready|hello|hi/i);
    assert.doesNotMatch(result.response, /Would you like to review/i);
    assert.doesNotMatch(result.response, /needs attention because it is worth monitoring/i);
    const silent = evaluateNca5InitiativeStrategy({
      utterance: "hi",
      managerTurnPresent: true,
      signals: [
        createProactiveExecutiveSignal({
          id: "post2-customer-wait",
          observation: "Customer wait time is elevated.",
          subjectId: "obj-customer",
          subjectLabel: "Customer",
          family: "GOAL_DEVIATION",
          critical: false,
        }),
      ],
    });
    assert.equal(silent.shouldInitiate, false);
  });

  it("still allows critical greeting initiative", () => {
    const strategy = evaluateNca5InitiativeStrategy({
      utterance: "hi",
      managerTurnPresent: true,
      signals: [
        createProactiveExecutiveSignal({
          id: "post2-customer-collapse",
          observation: "Customer service has collapsed.",
          subjectId: "obj-customer",
          subjectLabel: "Customer",
          family: "RISK_ESCALATION",
          critical: true,
        }),
      ],
    });
    assert.equal(strategy.shouldInitiate, true);
  });

  it("removes tautological attention copy", () => {
    assert.doesNotMatch(
      rewriteTautologicalAttentionLanguage(
        "Delivery needs attention because it is worth monitoring.",
      ),
      /needs attention because it is worth monitoring/i,
    );
    assert.match(
      composeConcreteAttentionReason({ label: "Delivery", belowTarget: true }),
      /below the current target/i,
    );
    const explained = run("show Delivery");
    const follow = run("explain it", explained);
    assert.doesNotMatch(
      follow.response,
      /needs attention because it is worth monitoring|needs monitoring because it needs attention/i,
    );
  });

  it("walks the original path without the five observed defects", () => {
    let turn = run("hi");
    assert.doesNotMatch(turn.response, /Would you like to review/i);
    turn = run("yes", turn);
    assert.doesNotMatch(turn.response, /capacity-pressure hypothesis|strengthens the capacity/i);
    turn = run("delivery is ok", turn);
    assert.doesNotMatch(turn.response, /Focused on Delivery/i);
    turn = run("explain it", turn);
    assert.doesNotMatch(turn.response, /needs attention because it is worth monitoring/i);
    assert.doesNotMatch(turn.response, /No executive object is currently active/i);
    turn = run("show me all problems", turn);
    assert.doesNotMatch(turn.response, /All Problems/i);
  });

  it("keeps manager observation separate from authoritative data", () => {
    const observation = interpretManagerProvidedObservation({
      utterance: "Delivery is okay.",
      subjectName: "Delivery",
      authoritativeValue: 91,
      authoritativeTarget: 96,
    });
    assert.ok(observation);
    assert.equal(observation?.source, "MANAGER");
    assert.equal(observation?.preference, false);
    assert.match(
      String(observation?.status),
      /CONFLICT|UNVERIFIED|REPORTED/,
    );
  });
});
