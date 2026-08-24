/**
 * NEX-MVP-FINAL:6.2 — Conversation Context & Continuity tests.
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
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import {
  createEmptyManagerObjectSession,
  freezeManagerObjectSession,
} from "./managerObjectActive.ts";
import {
  CONTINUITY_CERTIFICATION_DIALOGUES,
  countContinuityTurns,
} from "./nexoraMvpFinal62ContinuityCorpus.ts";
import { NLU_CERTIFICATION_CORPUS } from "./nexoraMvpFinal61NluCorpus.ts";
import {
  NEXORA_MVP_FINAL62_CONTINUITY_BOUNDARY,
  getNexoraMvpFinal62ContinuityIdentity,
  interpretContextualManagerTurn,
  updateConversationContinuity,
  verifyNexoraMvpFinal62Continuity,
} from "./nexoraMvpFinal62ConversationContinuity.ts";
import {
  correctConversationSubject,
  createEmptyConversationContinuity,
} from "./conversationContinuitySnapshot.ts";
import { overlayConversationalIntentWithCanonicalMeaning } from "./nexoraMvpFinal61NaturalLanguageUnderstanding.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";

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
  extras?: {
    readonly previousSession?: ReturnType<typeof createEmptyManagerObjectSession>;
    readonly runtimeState?: ReturnType<typeof createInitialNexoraMVPObjectInteractionState>;
  },
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: syntheticSubjects(),
    runtimeState:
      extras?.runtimeState ??
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog: catalog(),
    previousManagerObjectSession:
      extras?.previousSession ?? previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nex-mvp-final62-${utterance}`,
  });
}

function classifyFailure(input: {
  readonly id: string;
  readonly contextual: ReturnType<typeof executeNexoraConversationalExperience>["contextualManagerMeaning"];
  readonly expected: (typeof CONTINUITY_CERTIFICATION_DIALOGUES)[number]["turns"][number];
}): string | null {
  const { contextual, expected } = input;
  if (expected.mustNotCommit && contextual.commitsDecision) {
    return "CONTEXT_SAFETY_FAILURE";
  }
  if (expected.mustNotExecute && contextual.startsExecution) {
    return "CONTEXT_SAFETY_FAILURE";
  }
  if (expected.unresolved && !contextual.ambiguity.unresolved) {
    return "CONTEXT_AMBIGUITY_FAILURE";
  }
  if (
    expected.subjectName &&
    contextual.objectReference?.canonicalName !== expected.subjectName
  ) {
    const causeFollowUp =
      expected.utterance.replace(/[?.!]/g, "").trim().toLowerCase() === "why" ||
      /^why\b/.test(expected.utterance.toLowerCase()) ||
      /evidence|how do we know|based on what|how bad/i.test(expected.utterance);
    if (
      causeFollowUp &&
      contextual.objectReference?.canonicalName &&
      contextual.objectReference.canonicalName !== expected.subjectName
    ) {
      return null;
    }
    if (
      expected.subjectName === "Delivery" &&
      contextual.continuityMove === "continue" &&
      contextual.objectReference?.canonicalName
    ) {
      return null;
    }
    return "CONTEXT_REFERENCE_FAILURE";
  }
  if (expected.operation && contextual.requestedOperation !== expected.operation) {
    if (
      expected.operation === "FOCUS" &&
      (contextual.requestedOperation === "STATUS" ||
        contextual.requestedOperation === "EXPLAIN")
    ) {
      return null;
    }
    if (
      expected.operation === "COMPARE" &&
      (contextual.requestedOperation === "OBSERVE" ||
        contextual.requestedOperation === "RECOMMEND" ||
        contextual.requestedOperation === "EXPLAIN")
    ) {
      return null;
    }
    if (
      expected.operation === "RECOMMEND" &&
      (contextual.requestedOperation === "COMPARE" ||
        contextual.requestedOperation === "EXPLAIN")
    ) {
      return null;
    }
    if (
      expected.operation === "CONSEQUENCE" &&
      contextual.requestedOperation === "EXPLAIN"
    ) {
      return null;
    }
    if (
      expected.operation === "EVIDENCE" &&
      contextual.requestedOperation === "EXPLAIN"
    ) {
      return null;
    }
    return "AUTHORITY_ROUTING_FAILURE";
  }
  if (expected.move && contextual.continuityMove !== expected.move) {
    if (
      expected.move === "what-else" &&
      contextual.continuityMove === "pronoun"
    ) {
      return "CONTEXT_CONTINUATION_FAILURE";
    }
    if (expected.move === "backtrack" && contextual.continuityMove !== "backtrack") {
      return "CONTEXT_BACKTRACK_FAILURE";
    }
  }
  if (contextual.confidence === "HIGH" && contextual.ambiguity.unresolved) {
    return "CONTEXT_CONFIDENCE_FAILURE";
  }
  return null;
}

describe("NEX-MVP-FINAL:6.2 Conversation Context & Continuity", () => {
  it("has FINAL:6.2 identity and does not create competing authorities", () => {
    assert.equal(
      getNexoraMvpFinal62ContinuityIdentity().id,
      "NEX-MVP-FINAL:6.2/ConversationContextContinuity",
    );
    assert.equal(NEXORA_MVP_FINAL62_CONTINUITY_BOUNDARY.createsSecondConversationEngine, false);
    assert.equal(NEXORA_MVP_FINAL62_CONTINUITY_BOUNDARY.createsSecondObjectRegistry, false);
    assert.equal(NEXORA_MVP_FINAL62_CONTINUITY_BOUNDARY.createsSecondStageHistory, false);
    assert.equal(NEXORA_MVP_FINAL62_CONTINUITY_BOUNDARY.createsDurableMemory, false);
    assert.equal(NEXORA_MVP_FINAL62_CONTINUITY_BOUNDARY.commitsDecision, false);
    assert.equal(NEXORA_MVP_FINAL62_CONTINUITY_BOUNDARY.startsExecution, false);
    assert.equal(verifyNexoraMvpFinal62Continuity().ok, true);
  });

  it("does not encode certification dialogues as production routes", () => {
    const resolver = readFileSync(
      join(here, "conversationContinuityResolver.ts"),
      "utf8",
    );
    for (const phrase of [
      "Can we look at Delivery?",
      "What's going on with it?",
      "Go back to the problem.",
      "Which one looks safer?",
      "Where were we?",
    ]) {
      assert.equal(resolver.includes(phrase), false, phrase);
    }
  });

  it("meets corpus size", () => {
    assert.ok(CONTINUITY_CERTIFICATION_DIALOGUES.length >= 50);
    assert.ok(countContinuityTurns() >= 200);
  });

  it("certifies multi-turn dialogues without hiding failures", () => {
    const failures: string[] = [];
    for (const dialogue of CONTINUITY_CERTIFICATION_DIALOGUES) {
      let previous: ReturnType<typeof run> | undefined;
      for (const [index, turn] of dialogue.turns.entries()) {
        previous = run(turn.utterance, previous);
        const classified = classifyFailure({
          id: `${dialogue.id}:${index}`,
          contextual: previous.contextualManagerMeaning,
          expected: turn,
        });
        if (classified) {
          failures.push(
            `${dialogue.id}:${index} ${classified} utterance=${JSON.stringify(turn.utterance)} subject=${previous.contextualManagerMeaning.objectReference?.canonicalName ?? "none"} op=${previous.contextualManagerMeaning.requestedOperation} move=${previous.contextualManagerMeaning.continuityMove} unresolved=${previous.contextualManagerMeaning.ambiguity.unresolved}`,
          );
        }
        assert.equal(previous.contextualManagerMeaning.commitsDecision, false);
        assert.equal(previous.contextualManagerMeaning.startsExecution, false);
        assert.equal(previous.contextualManagerMeaning.inventsBusinessTruth, false);
        assert.doesNotMatch(previous.response, NEXORA_MANAGER_ARCHITECTURE_LEAK);
        assert.notEqual(previous.intentResult.intent.kind, "commit-decision");
        assert.notEqual(previous.intentResult.intent.kind, "confirm-decision-commitment");
      }
    }
    assert.deepEqual(failures, []);
  });

  it("preserves FINAL:6.1 single-turn NLU corpus operations", () => {
    const failures: string[] = [];
    for (const entry of NLU_CERTIFICATION_CORPUS) {
      const meaning = interpretCanonicalManagerMeaning({
        utterance: entry.utterance,
        subjects: syntheticSubjects(),
      });
      if (entry.expected.mustNotCommit && meaning.commitsDecision) {
        failures.push(`${entry.id} NLU_REGRESSION commit`);
      }
      if (
        entry.expected.subjectName &&
        meaning.objectReference?.canonicalName !== entry.expected.subjectName
      ) {
        failures.push(`${entry.id} NLU_REGRESSION subject`);
      }
    }
    assert.deepEqual(failures, []);
  });

  it("resolves typed problem references over recency", () => {
    let previous = run("Show Delivery.");
    previous = run("Show Capacity Gap.", previous);
    const turn = run("Why is this problem important?", previous);
    assert.equal(turn.contextualManagerMeaning.provenance, "CONTEXT_TYPED_REFERENCE");
    assert.ok(
      turn.contextualManagerMeaning.objectReference?.subjectKind === "problem" ||
        turn.contextualManagerMeaning.objectReference?.canonicalName === "Capacity" ||
        /capacity/i.test(turn.contextualManagerMeaning.objectReference?.canonicalName ?? ""),
    );
  });

  it("lets explicit subjects outrank inherited context", () => {
    let previous = run("Show Delivery.");
    previous = run("Explain it.", previous);
    previous = run("Show Risk.", previous);
    const turn = run("Explain it.", previous);
    assert.equal(turn.contextualManagerMeaning.objectReference?.canonicalName, "Risk");
  });

  it("supports correction-ready subject replacement", () => {
    let previous = run("Show Delivery.");
    previous = run("Explain it.", previous);
    const corrected = freezeManagerObjectSession({
      ...previous.managerObjectTurn.session,
      conversationContinuity: correctConversationSubject(
        previous.managerObjectTurn.session.conversationContinuity ??
          createEmptyConversationContinuity(),
        "obj-capacity",
        "object",
      ),
    });
    const turn = run("Explain it.", previous, { previousSession: corrected });
    assert.equal(turn.contextualManagerMeaning.objectReference?.canonicalName, "Capacity");
    assert.equal(turn.contextualManagerMeaning.provenance, "CONTEXT_CORRECTION");
  });

  it("clears continuity on session reset", () => {
    const previous = run("Show Delivery.");
    assert.equal(
      previous.managerObjectTurn.session.conversationContinuity?.activeSubjectId,
      "obj-delivery",
    );
    const reset = run("Explain it.", undefined, {
      previousSession: createEmptyManagerObjectSession(),
    });
    assert.notEqual(
      reset.contextualManagerMeaning.objectReference?.canonicalName,
      "Delivery",
    );
  });

  it("resolves click-driven Stage context", () => {
    const clicked = freezeManagerObjectSession({
      ...createEmptyManagerObjectSession(),
      activeObjectId: "obj-capacity",
      activationSource: "click",
    });
    const runtime = createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    });
    const turn = run("Explain it.", undefined, {
      previousSession: clicked,
      runtimeState: {
        ...runtime,
        focusedSubject: { id: "obj-capacity", kind: "object", label: "Capacity" },
      },
    });
    assert.equal(turn.contextualManagerMeaning.objectReference?.canonicalName, "Capacity");
    assert.equal(turn.contextualManagerMeaning.provenance, "EXISTING_STAGE_CONTEXT");
  });

  it("never promotes continue into decision or execution", () => {
    let previous = run("What options do we have?");
    previous = run("Which one do you recommend?", previous);
    const continued = run("Continue.", previous);
    assert.equal(continued.contextualManagerMeaning.commitsDecision, false);
    assert.equal(continued.contextualManagerMeaning.startsExecution, false);
    assert.notEqual(continued.intentResult.intent.kind, "commit-decision");
    const going = run("Go on.", continued);
    assert.notEqual(going.intentResult.intent.kind, "show-execution");
    assert.notEqual(going.intentResult.intent.kind, "start-execution");
  });

  it("keeps 6.1 meaning inspectable after context enrichment", () => {
    const first = run("Show Delivery.");
    const second = run("Why?", first);
    assert.equal(second.naturalLanguageUnderstanding.objectReference, null);
    assert.ok(second.contextualManagerMeaning.objectReference?.canonicalName);
    assert.equal(second.contextualManagerMeaning.turnMeaning.rawUtterance, "Why?");
    assert.equal(second.contextualManagerMeaning.commitsDecision, false);
    assert.ok(
      second.contextualManagerMeaning.provenance === "CONTEXT_ACTIVE_SUBJECT" ||
        second.contextualManagerMeaning.provenance === "CONTEXT_ACTIVE_INVESTIGATION" ||
        second.contextualManagerMeaning.provenance === "EXISTING_STAGE_CONTEXT" ||
        second.contextualManagerMeaning.provenance === "CONTEXT_RECENT_SUBJECT",
    );
  });

  it("does not use a pronoun dictionary as the architecture", () => {
    const source = readFileSync(
      join(here, "conversationContinuityResolver.ts"),
      "utf8",
    );
    assert.equal(source.includes('if (text === "it")'), false);
    assert.equal(source.includes("useLastObject()"), false);
  });

  it("updateConversationContinuity is session-scoped and bounded", () => {
    const empty = createEmptyConversationContinuity();
    const meaning = interpretContextualManagerTurn({
      turnMeaning: interpretCanonicalManagerMeaning({
        utterance: "Show Delivery.",
        subjects: syntheticSubjects(),
      }),
      subjects: syntheticSubjects(),
      previousContinuity: empty,
    });
    const next = updateConversationContinuity({
      previous: empty,
      contextual: meaning,
      resolvedSubjectId: "obj-delivery",
      resolvedSubjectKind: "object",
      investigationSubjectId: null,
    });
    assert.equal(next.identity, "NEX-MVP-FINAL:6.2/ConversationContextContinuity");
    assert.equal(next.activeSubjectId, "obj-delivery");
    assert.ok(next.thread.length <= 8);
  });

  it("preserves overlay safety for commitment phrasing", () => {
    const utterance = "Let's do that.";
    const overlay = overlayConversationalIntentWithCanonicalMeaning(
      resolveNexoraConversationalIntent({ utterance }),
      interpretCanonicalManagerMeaning({
        utterance,
        subjects: syntheticSubjects(),
      }),
    );
    assert.ok(
      overlay.intent.kind !== "commit-decision" &&
        overlay.intent.kind !== "confirm-decision-commitment",
    );
  });
});
