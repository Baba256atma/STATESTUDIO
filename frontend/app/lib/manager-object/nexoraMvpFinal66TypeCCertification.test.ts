/**
 * NEX-MVP-FINAL:6.6 — Type-C manager conversation certification.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { freezeConversationalSubjectRecord } from "../conversational-control/conversationalSubjectRegistry.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "../conversational-control/executiveContextSnapshot.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_MANAGER_ARCHITECTURE_LEAK } from "../nexora-entrance/nexoraMvpFinalCertification.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import {
  TYPEC_CERTIFICATION_DIALOGUES,
  countFuzzTurns,
  countMutations,
  countTypeCLongDialogues,
  countTypeCTurns,
  countUnseenUtterances,
} from "./nexoraMvpFinal66TypeCCorpus.ts";
import {
  NEXORA_MVP_FINAL66_TYPEC_BOUNDARY,
  TYPEC_ARCHITECTURE_MAP,
  getNexoraMvpFinal66TypeCIdentity,
  verifyNexoraMvpFinal66TypeC,
} from "./nexoraMvpFinal66TypeCCertification.ts";

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function syntheticSubjects() {
  return Object.freeze([
    ...projectManagerObjectConversationalSubjects(catalog()),
    freezeConversationalSubjectRecord({
      subjectId: "obj-profit-synth",
      subjectKind: "object",
      canonicalName: "Profit",
      aliases: Object.freeze(["Profit"]),
      businessKey: "obj-profit-synth",
    }),
    freezeConversationalSubjectRecord({
      subjectId: "obj-cash-synth",
      subjectKind: "object",
      canonicalName: "Cash Flow",
      aliases: Object.freeze(["cash flow"]),
      businessKey: "obj-cash-synth",
    }),
    freezeConversationalSubjectRecord({
      subjectId: "obj-loan-synth",
      subjectKind: "object",
      canonicalName: "Loan Exposure",
      aliases: Object.freeze(["loan exposure"]),
      businessKey: "obj-loan-synth",
    }),
    freezeConversationalSubjectRecord({
      subjectId: "obj-quality-synth",
      subjectKind: "object",
      canonicalName: "Quality",
      aliases: Object.freeze(["Quality"]),
      businessKey: "obj-quality-synth",
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
    executiveSubjects: syntheticSubjects(),
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
    messageIdSeed: `nex-mvp-final66-${utterance}`,
  });
}

const FILLER = /Absolutely!|Great question!|As an AI|Happy to help!|Certainly!/i;
const COMMIT = /decision is approved|I(?:'ll| will) decide|I have approved/i;
const EXECUTE = /execution has started|I(?:'ve| have) started execution/i;
const CAUSE = /\bis causing\b|definitely the cause|definitely caused/i;
const WIZARD = /Step 1 complete|Now perform Step 2/i;
const FICTION = /I'll send|I'll update the ERP|I'll query|RAG index is ready/i;

function assertSafety(
  result: ReturnType<typeof run>,
  turn: { readonly utterance: string; readonly require?: readonly string[]; readonly forbid?: readonly string[] },
  dialogueId: string,
) {
  const text = result.response;
  assert.doesNotMatch(text, NEXORA_MANAGER_ARCHITECTURE_LEAK, `${dialogueId}: ${turn.utterance}`);
  assert.doesNotMatch(text, FILLER, `${dialogueId}: filler`);
  assert.doesNotMatch(text, WIZARD, `${dialogueId}: wizard`);
  assert.doesNotMatch(text, FICTION, `${dialogueId}: fiction`);
  assert.doesNotMatch(text, CAUSE, `${dialogueId}: causal`);
  assert.doesNotMatch(
    text,
    /UNRESOLVED_ISSUE|DECISION_REQUIRED|READY_FOR_|goal-executive-discovered|JOURNEY BLOCKER|GOAL RELEVANCE/,
  );
  if (
    result.status !== "confirmation-required" &&
    !/confirm/i.test(turn.utterance)
  ) {
    assert.doesNotMatch(text, COMMIT, `${dialogueId}: commit`);
    assert.doesNotMatch(text, EXECUTE, `${dialogueId}: execute`);
  }
  assert.equal(result.guidanceTurn.commitsDecision, false);
  assert.equal(result.guidanceTurn.startsExecution, false);
  assert.equal(result.naturalLanguageUnderstanding.commitsDecision, false);
  assert.equal(result.naturalLanguageUnderstanding.startsExecution, false);
  if (result.clarificationTurn.action === "clarify") {
    assert.ok(text.length < 280, `${dialogueId}: long clarification`);
    assert.doesNotMatch(text, COMMIT);
    assert.doesNotMatch(text, EXECUTE);
  }
  if (turn.require) {
    for (const needle of turn.require) {
      assert.match(text, new RegExp(needle, "i"), `${dialogueId}: ${turn.utterance}`);
    }
  }
  if (turn.forbid) {
    for (const needle of turn.forbid) {
      assert.doesNotMatch(text, new RegExp(needle, "i"), `${dialogueId}: ${turn.utterance}`);
    }
  }
}

describe("NEX-MVP-FINAL:6.6 Type-C Manager Conversation", () => {
  it("has FINAL:6.6 identity and does not create a conversation engine", () => {
    assert.equal(
      getNexoraMvpFinal66TypeCIdentity().id,
      "NEX-MVP-FINAL:6.6/TypeCManagerConversationCertification",
    );
    assert.equal(NEXORA_MVP_FINAL66_TYPEC_BOUNDARY.createsSecondConversationEngine, false);
    assert.equal(NEXORA_MVP_FINAL66_TYPEC_BOUNDARY.usesLiveLlm, false);
    assert.equal(verifyNexoraMvpFinal66TypeC().ok, true);
    assert.equal(TYPEC_ARCHITECTURE_MAP.pipeline.length, 6);
  });

  it("meets Type-C corpus size", () => {
    assert.ok(TYPEC_CERTIFICATION_DIALOGUES.length >= 150);
    assert.ok(countTypeCTurns() >= 600);
    assert.ok(countTypeCLongDialogues() >= 10);
    assert.ok(countUnseenUtterances() >= 80);
    assert.ok(countMutations() >= 10);
    assert.ok(countFuzzTurns() >= 20);
  });

  it("certifies the Type-C corpus without unsafe mutations", () => {
    for (const dialogue of TYPEC_CERTIFICATION_DIALOGUES) {
      let previous: ReturnType<typeof run> | undefined;
      for (const turn of dialogue.turns) {
        previous = run(turn.utterance, previous);
        assertSafety(previous, turn, dialogue.id);
      }
    }
  });

  it("clears continuity after session reset", () => {
    let previous = run("Show Delivery.");
    previous = run("Explain it.", previous);
    void previous;
    const reset = executeNexoraConversationalExperience({
      utterance: "Explain it.",
      conversationContext: undefined,
      executiveContext: createEmptyNexoraExecutiveContextSnapshot(),
      executiveSubjects: syntheticSubjects(),
      runtimeState: createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
      catalog: catalog(),
      previousManagerObjectSession: createEmptyManagerObjectSession(),
      scenarioSession: null,
      decisionSession: null,
      messageIdSeed: "nex-mvp-final66-reset",
    });
    assert.doesNotMatch(reset.response, /Delivery is 91%/i);
  });

  it("does not treat clarification yes as approval", () => {
    let previous = run("Show Delivery.");
    previous = run("Show Capacity.", previous);
    previous = run("Explain that.", previous);
    if (previous.clarificationTurn.action === "clarify") {
      const yes = run("Yes.", previous);
      assert.doesNotMatch(yes.response, COMMIT);
      assert.equal(yes.status !== "applied" || !/approved/i.test(yes.response), true);
    }
  });

  it("keeps pipeline trace fields for certification", () => {
    const result = run("What can you do for me?");
    assert.ok(result.naturalLanguageUnderstanding);
    assert.ok(result.contextualManagerMeaning);
    assert.ok(result.clarificationTurn);
    assert.ok(result.trustedCommunication);
    assert.ok(result.guidanceTurn);
    assert.equal(result.trace.nluCommunicativeIntent != null, true);
  });
});
