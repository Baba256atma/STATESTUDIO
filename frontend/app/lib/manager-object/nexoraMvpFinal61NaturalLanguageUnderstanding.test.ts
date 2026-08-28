/**
 * NEX-MVP-FINAL:6.1 — Natural Language Understanding tests.
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
import { interpretCanonicalManagerMeaning } from "./canonicalManagerMeaningInterpreter.ts";
import {
  NLU_CERTIFICATION_CORPUS,
  NLU_FUTURE_OBJECT_UTTERANCES,
  NLU_PARAPHRASE_GROUPS,
} from "./nexoraMvpFinal61NluCorpus.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import {
  getNexoraMvpFinal61NluIdentity,
  NEXORA_MVP_FINAL61_NLU_BOUNDARY,
  overlayConversationalIntentWithCanonicalMeaning,
  verifyNexoraMvpFinal61Nlu,
} from "./nexoraMvpFinal61NaturalLanguageUnderstanding.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";

const here = dirname(fileURLToPath(import.meta.url));

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function subjects() {
  return projectManagerObjectConversationalSubjects(catalog());
}

function meaningOf(utterance: string, extra = subjects()) {
  return interpretCanonicalManagerMeaning({ utterance, subjects: extra });
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
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nex-mvp-final61-${utterance}`,
  });
}

function classifyFailure(input: {
  readonly id: string;
  readonly meaning: ReturnType<typeof meaningOf>;
  readonly expected: (typeof NLU_CERTIFICATION_CORPUS)[number]["expected"];
}): string | null {
  const { meaning, expected } = input;
  if (expected.mustNotCommit && meaning.commitsDecision) return "NLU_AUTHORITY_ROUTING_FAILURE";
  if (expected.mustNotExecute && meaning.startsExecution) return "NLU_AUTHORITY_ROUTING_FAILURE";
  if (expected.mustNotFabricateObject && meaning.objectReference?.subjectId && expected.unknown) {
    return "NLU_OBJECT_FAILURE";
  }
  if (expected.unknown && meaning.communicativeIntent !== "UNKNOWN" && meaning.confidence !== "UNKNOWN") {
    if (meaning.requestedOperation !== "NONE" && meaning.objectReference != null) {
      return "NLU_OVERFIT_FAILURE";
    }
  }
  if (expected.observation && meaning.requestedOperation !== "OBSERVE" && meaning.communicativeIntent !== "OBSERVE") {
    return "NLU_INTENT_FAILURE";
  }
  if (expected.challenge && meaning.communicativeIntent !== "CHALLENGE" && meaning.requestedOperation !== "CHALLENGE" && meaning.requestedOperation !== "EVIDENCE") {
    return "NLU_INTENT_FAILURE";
  }
  if (expected.meta && meaning.communicativeIntent !== "ASK_CAPABILITY" && meaning.requestedOperation !== "HELP") {
    return "NLU_INTENT_FAILURE";
  }
  if (expected.unresolved && !meaning.ambiguity.unresolved) return "NLU_AMBIGUITY_FAILURE";
  if (expected.operation && meaning.requestedOperation !== expected.operation) {
    if (expected.operation === "FOCUS" && meaning.requestedOperation === "STATUS" && expected.subjectName) {
      return "NLU_QUESTION_FAILURE";
    }
    return "NLU_INTENT_FAILURE";
  }
  if (
    expected.subjectName &&
    meaning.objectReference?.canonicalName !== expected.subjectName
  ) {
    return "NLU_OBJECT_FAILURE";
  }
  if (expected.questionType && meaning.questionType !== expected.questionType) {
    return "NLU_QUESTION_FAILURE";
  }
  return null;
}

describe("NEX-MVP-FINAL:6.1 Natural Language Understanding", () => {
  it("has FINAL:6.1 identity and does not create a second engine", () => {
    assert.equal(
      getNexoraMvpFinal61NluIdentity().id,
      "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding",
    );
    assert.equal(NEXORA_MVP_FINAL61_NLU_BOUNDARY.createsSecondConversationEngine, false);
    assert.equal(NEXORA_MVP_FINAL61_NLU_BOUNDARY.createsSecondObjectRegistry, false);
    assert.equal(NEXORA_MVP_FINAL61_NLU_BOUNDARY.createsSecondExplainEngine, false);
    assert.equal(NEXORA_MVP_FINAL61_NLU_BOUNDARY.usesLlm, false);
    assert.equal(verifyNexoraMvpFinal61Nlu().ok, true);
  });

  it("does not encode unseen certification paraphrases in production NLU", () => {
    const source = readFileSync(
      join(here, "canonicalManagerMeaningInterpreter.ts"),
      "utf8",
    );
    for (const phrase of [
      "Take me to the delivery picture",
      "Is anything putting the delivery goal at risk",
      "What would happen if management did nothing",
      "Which option gives us the best balance",
    ]) {
      assert.equal(source.includes(phrase), false, phrase);
    }
  });

  it("certifies the NLU corpus without hiding failures", () => {
    assert.ok(NLU_CERTIFICATION_CORPUS.length >= 100);
    const failures: string[] = [];
    for (const entry of NLU_CERTIFICATION_CORPUS) {
      const meaning = meaningOf(entry.utterance);
      const classified = classifyFailure({
        id: entry.id,
        meaning,
        expected: entry.expected,
      });
      if (classified) {
        failures.push(
          `${entry.id} ${classified} utterance=${JSON.stringify(entry.utterance)} op=${meaning.requestedOperation} subject=${meaning.objectReference?.canonicalName ?? "none"} intent=${meaning.communicativeIntent}`,
        );
      }
      assert.equal(meaning.commitsDecision, false);
      assert.equal(meaning.startsExecution, false);
      assert.equal(meaning.rawUtterance, entry.utterance);
    }
    assert.deepEqual(failures, []);
  });

  it("generalizes paraphrase groups to compatible operations", () => {
    for (const group of NLU_PARAPHRASE_GROUPS) {
      const ops = new Set<string>();
      const subjectsFound = new Set<string>();
      for (const utterance of group.utterances) {
        const meaning = meaningOf(utterance);
        ops.add(meaning.requestedOperation);
        if (meaning.objectReference?.canonicalName) {
          subjectsFound.add(meaning.objectReference.canonicalName);
        }
      }
      assert.ok(
        [...ops].every(
          (op) =>
            op === group.operation ||
            (group.operation === "FOCUS" && (op === "STATUS" || op === "EXPLAIN")) ||
            (group.operation === "EXPLAIN" && op === "CAUSE"),
        ),
        `${group.operation} ops=${[...ops].join(",")}`,
      );
      if (group.subjectName) {
        assert.ok(
          subjectsFound.has(group.subjectName),
          `${group.operation} missing ${group.subjectName}`,
        );
      }
    }
  });

  it("keeps mutated wording stable for Delivery focus", () => {
    for (const utterance of [
      "Could you show me Delivery?",
      "delivery pls",
      "Can I see delivery",
      "DELIVERY?",
      "let's check deliveries",
    ]) {
      const meaning = meaningOf(utterance);
      assert.equal(meaning.objectReference?.canonicalName, "Delivery");
      assert.ok(
        meaning.requestedOperation === "FOCUS" ||
          meaning.requestedOperation === "STATUS" ||
          // NXA:1 conversational-need precedence: interrogatives explain; they do not navigate.
          meaning.requestedOperation === "EXPLAIN",
      );
    }
  });

  it("does not fabricate objects or commitments for negative cases", () => {
    for (const utterance of [
      "Do something.",
      "Fix everything.",
      "Make it better.",
      "Make the business awesome.",
      "Take care of it.",
    ]) {
      const meaning = meaningOf(utterance);
      assert.equal(meaning.objectReference, null);
      assert.equal(meaning.commitsDecision, false);
      assert.equal(meaning.startsExecution, false);
      const overlay = overlayConversationalIntentWithCanonicalMeaning(
        resolveNexoraConversationalIntent({ utterance }),
        meaning,
      );
      assert.ok(
        overlay.intent.kind === "unknown" || overlay.intent.kind === "help",
      );
    }
  });

  it("distinguishes observations from focus commands", () => {
    const observed = meaningOf("Capacity seems tight.");
    assert.equal(observed.requestedOperation, "OBSERVE");
    assert.equal(observed.objectReference?.canonicalName, "Capacity");
    const shown = meaningOf("Show Capacity.");
    assert.equal(shown.requestedOperation, "FOCUS");
  });

  it("does not manufacture Focus from an unknown action plus a resolved entity", () => {
    const utterance = "frobnicate Demand Surge";
    const base = resolveNexoraConversationalIntent({ utterance });
    const meaning = meaningOf(utterance);
    const overlay = overlayConversationalIntentWithCanonicalMeaning(base, meaning);
    assert.equal(base.intent.kind, "unknown");
    assert.equal(meaning.objectReference?.canonicalName, "Demand Surge");
    assert.equal(overlay.intent.kind, "unknown");
  });

  it("retains explicit and entity-only navigation evidence", () => {
    for (const utterance of ["Can we look at Delivery?", "Demand Surge"]) {
      const base = resolveNexoraConversationalIntent({ utterance });
      const meaning = meaningOf(utterance);
      const overlay = overlayConversationalIntentWithCanonicalMeaning(base, meaning);
      assert.equal(meaning.requestedOperation, "FOCUS");
      assert.equal(overlay.intent.kind, "focus");
    }
  });

  it("classifies challenges without starting trusted-communication 6.4", () => {
    const meaning = meaningOf("Are you sure?");
    assert.equal(meaning.requestedOperation, "CHALLENGE");
    assert.equal(NEXORA_MVP_FINAL61_NLU_BOUNDARY.startsFinal62, false);
  });

  it("classifies Nexora meta questions without binding KPI as the business object", () => {
    const meaning = meaningOf("Can you help me investigate a KPI?");
    assert.equal(meaning.requestedOperation, "HELP");
    assert.equal(meaning.communicativeIntent, "ASK_CAPABILITY");
    assert.equal(meaning.objectReference, null);
  });

  it("resolves future synthetic registered objects", () => {
    const extra = [
      ...subjects(),
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
    ];
    for (const entry of NLU_FUTURE_OBJECT_UTTERANCES) {
      const meaning = interpretCanonicalManagerMeaning({
        utterance: entry.utterance,
        subjects: extra,
      });
      assert.equal(meaning.objectReference?.canonicalName, entry.subjectName);
      assert.equal(meaning.requestedOperation, entry.operation);
    }
  });

  it("never overlays suggestion into decision or execution", () => {
    const utterance = "Maybe we should expand capacity.";
    const meaning = meaningOf(utterance);
    const overlay = overlayConversationalIntentWithCanonicalMeaning(
      resolveNexoraConversationalIntent({ utterance }),
      meaning,
    );
    assert.equal(meaning.commitsDecision, false);
    assert.ok(
      overlay.intent.kind !== "commit-decision" &&
        overlay.intent.kind !== "confirm-decision-commitment" &&
        overlay.intent.kind !== "show-execution",
    );
    const turn = run(utterance);
    assert.notEqual(turn.intentResult.intent.kind, "commit-decision");
    assert.notEqual(turn.intentResult.intent.kind, "confirm-decision-commitment");
    assert.doesNotMatch(turn.response, NEXORA_MANAGER_ARCHITECTURE_LEAK);
  });

  it("routes unseen Delivery focus through existing conversation authorities", () => {
    const turn = run("Can we look at Delivery?");
    assert.equal(
      turn.nextRuntimeState.focusedSubject?.id ??
        turn.managerObjectTurn.activeObjectId,
      "obj-delivery",
    );
    assert.equal(turn.naturalLanguageUnderstanding.requestedOperation, "FOCUS");
    assert.doesNotMatch(turn.response, NEXORA_MANAGER_ARCHITECTURE_LEAK);
    assert.doesNotMatch(turn.response, /canonical intent|resolver|namespace/i);
  });

  it("preserves certified regression phrases", () => {
    let previous: ReturnType<typeof run> | undefined;
    for (const utterance of [
      "show delivery",
      "explain delivery",
      "show risk object",
      "explain it",
      "why?",
      "what does it affect?",
      "what should I do?",
      "Compare them",
      "Why",
    ]) {
      previous = run(utterance, previous);
      assert.doesNotMatch(previous.response, NEXORA_MANAGER_ARCHITECTURE_LEAK);
      assert.ok(previous.response.length > 8);
    }
  });
});
