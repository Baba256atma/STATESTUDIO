/**
 * NEX-MVP-FINAL:6.3 — Smart Clarification & Correction tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { freezeConversationalSubjectRecord } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_MANAGER_ARCHITECTURE_LEAK } from "../nexora-entrance/nexoraMvpFinalCertification.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import {
  CLARIFICATION_CERTIFICATION_DIALOGUES,
  countClarificationTurns,
  NO_CLARIFICATION_UTTERANCES,
} from "./nexoraMvpFinal63ClarificationCorpus.ts";
import {
  NEXORA_MVP_FINAL63_CLARIFICATION_BOUNDARY,
  getNexoraMvpFinal63ClarificationIdentity,
  verifyNexoraMvpFinal63Clarification,
} from "./nexoraMvpFinal63SmartClarification.ts";
import { interpretCanonicalManagerMeaning } from "./canonicalManagerMeaningInterpreter.ts";

const here = dirname(fileURLToPath(import.meta.url));

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
    messageIdSeed: `nex-mvp-final63-${utterance}`,
  });
}

describe("NEX-MVP-FINAL:6.3 Smart Clarification & Correction", () => {
  it("has FINAL:6.3 identity and does not create competing engines", () => {
    assert.equal(
      getNexoraMvpFinal63ClarificationIdentity().id,
      "NEX-MVP-FINAL:6.3/SmartClarificationCorrection",
    );
    assert.equal(NEXORA_MVP_FINAL63_CLARIFICATION_BOUNDARY.createsSecondNluEngine, false);
    assert.equal(NEXORA_MVP_FINAL63_CLARIFICATION_BOUNDARY.createsSecondContinuityEngine, false);
    assert.equal(NEXORA_MVP_FINAL63_CLARIFICATION_BOUNDARY.commitsDecision, false);
    assert.equal(verifyNexoraMvpFinal63Clarification().ok, true);
  });

  it("does not encode unseen correction sentences in production", () => {
    const source = readFileSync(
      join(here, "nexoraMvpFinal63ClarificationResolver.ts"),
      "utf8",
    );
    for (const phrase of [
      "That's not the one.",
      "I was talking about Capacity.",
      "Scratch that — Risk.",
    ]) {
      assert.equal(source.includes(phrase), false, phrase);
    }
  });

  it("meets corpus size", () => {
    assert.ok(CLARIFICATION_CERTIFICATION_DIALOGUES.length >= 50);
    assert.ok(countClarificationTurns() >= 180);
  });

  it("does not ask unnecessary clarification", () => {
    const failures: string[] = [];
    for (const utterance of NO_CLARIFICATION_UTTERANCES) {
      const turn = run(utterance);
      if (turn.clarificationTurn.action === "clarify") {
        failures.push(utterance);
      }
    }
    assert.deepEqual(failures, []);
  });

  it("certifies clarification/correction dialogues", () => {
    const failures: string[] = [];
    for (const dialogue of CLARIFICATION_CERTIFICATION_DIALOGUES) {
      let previous: ReturnType<typeof run> | undefined;
      for (const [index, turn] of dialogue.turns.entries()) {
        previous = run(turn.utterance, previous);
        const action = previous.clarificationTurn.action;
        if (turn.mustNotClarify && action === "clarify") {
          failures.push(`${dialogue.id}:${index} CLARIFICATION_FALSE_POSITIVE ${turn.utterance}`);
        }
        if (turn.mustClarify && action !== "clarify" && action !== "unpark" && action !== "fail") {
          failures.push(`${dialogue.id}:${index} CLARIFICATION_FALSE_NEGATIVE ${turn.utterance} action=${action}`);
        }
        if (turn.correction && !previous.clarificationTurn.correctionDetected && previous.clarificationTurn.action !== "resume") {
          failures.push(
            `${dialogue.id}:${index} CORRECTION_DETECTION_FAILURE ${turn.utterance} action=${previous.clarificationTurn.action} prepared=${previous.naturalLanguageUnderstanding.preparedUtterance} intent=${previous.naturalLanguageUnderstanding.communicativeIntent} op=${previous.naturalLanguageUnderstanding.requestedOperation} subject=${previous.naturalLanguageUnderstanding.objectReference?.canonicalName ?? "none"}`,
          );
        }
        if (turn.resumeSubject) {
          const resolved =
            previous.clarificationTurn.resumeReference?.canonicalName ??
            previous.contextualManagerMeaning.objectReference?.canonicalName ??
            previous.naturalLanguageUnderstanding.objectReference?.canonicalName ??
            "";
          if (resolved !== turn.resumeSubject) {
            failures.push(
              `${dialogue.id}:${index} CLARIFICATION_RESUME_FAILURE expected=${turn.resumeSubject} got=${resolved || "none"} action=${action}`,
            );
          }
        }
        if (turn.mustNotCommit) {
          assert.equal(previous.clarificationTurn.commitsDecision, false);
          assert.notEqual(previous.intentResult.intent.kind, "confirm-decision-commitment");
        }
        if (turn.mustNotExecute) {
          assert.equal(previous.clarificationTurn.startsExecution, false);
        }
        assert.doesNotMatch(previous.response, NEXORA_MANAGER_ARCHITECTURE_LEAK);
        assert.doesNotMatch(previous.response, /Ambiguous reference\. Candidate count/i);
      }
    }
    assert.deepEqual(failures, []);
  });

  it("classifies correction speech acts in 6.1", () => {
    const meaning = interpretCanonicalManagerMeaning({
      utterance: "No, I meant Capacity.",
      subjects: syntheticSubjects(),
    });
    assert.equal(meaning.communicativeIntent, "CORRECT");
    assert.equal(meaning.objectReference?.canonicalName, "Capacity");
  });

  it("resumes EXPLAIN after a short clarification answer", () => {
    let previous = run("Show Delivery.");
    previous = run("Show Capacity.", previous);
    previous = run("Explain that.", previous);
    assert.equal(previous.clarificationTurn.action, "clarify");
    const resumed = run("Capacity.", previous);
    assert.equal(resumed.clarificationTurn.action, "resume");
    assert.equal(resumed.clarificationTurn.resumeReference?.canonicalName, "Capacity");
    assert.equal(resumed.intentResult.intent.kind, "explain");
  });

  it("repairs context so later it refers to the correction", () => {
    let previous = run("Show Delivery.");
    previous = run("No, I meant Capacity.", previous);
    const next = run("Explain it.", previous);
    assert.ok(
      next.contextualManagerMeaning.objectReference?.canonicalName === "Capacity" ||
        next.managerObjectTurn.activeObjectId === "obj-capacity",
    );
  });

  it("clears pending clarification on session reset", () => {
    let previous = run("Show Delivery.");
    previous = run("Show Capacity.", previous);
    previous = run("Explain that.", previous);
    assert.ok(previous.managerObjectTurn.session.pendingClarification);
    const reset = executeNexoraConversationalExperience({
      utterance: "Capacity.",
      executiveSubjects: syntheticSubjects(),
      runtimeState: createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
      catalog: catalog(),
      previousManagerObjectSession: createEmptyManagerObjectSession(),
      messageIdSeed: "nex-mvp-final63-reset",
    });
    assert.equal(reset.managerObjectTurn.session.pendingClarification, null);
  });

  it("does not treat yes as decision authorization during clarification", () => {
    let previous = run("Show Delivery.");
    previous = run("Show Capacity.", previous);
    previous = run("Explain that.", previous);
    const yes = run("Yes.", previous);
    assert.notEqual(yes.intentResult.intent.kind, "commit-decision");
    assert.notEqual(yes.intentResult.intent.kind, "confirm-decision-commitment");
  });
});
