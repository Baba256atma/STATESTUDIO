/**
 * NEX-MVP-FINAL:6.4 — Trusted Executive Communication tests.
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
  COMMUNICATION_CERTIFICATION_DIALOGUES,
  countCommunicationTurns,
} from "./nexoraMvpFinal64CommunicationCorpus.ts";
import {
  NEXORA_MVP_FINAL64_COMMUNICATION_BOUNDARY,
  composeTrustedExecutiveCommunication,
  getNexoraMvpFinal64CommunicationIdentity,
  validateTrustedExecutiveCopy,
  verifyNexoraMvpFinal64Communication,
} from "./nexoraMvpFinal64TrustedCommunication.ts";
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
    messageIdSeed: `nex-mvp-final64-${utterance}`,
  });
}

describe("NEX-MVP-FINAL:6.4 Trusted Executive Communication", () => {
  it("has FINAL:6.4 identity and does not create competing engines", () => {
    assert.equal(
      getNexoraMvpFinal64CommunicationIdentity().id,
      "NEX-MVP-FINAL:6.4/TrustedExecutiveCommunication",
    );
    assert.equal(NEXORA_MVP_FINAL64_COMMUNICATION_BOUNDARY.createsSecondExplainEngine, false);
    assert.equal(NEXORA_MVP_FINAL64_COMMUNICATION_BOUNDARY.inventsBusinessTruth, false);
    assert.equal(verifyNexoraMvpFinal64Communication().ok, true);
  });

  it("meets corpus size", () => {
    assert.ok(COMMUNICATION_CERTIFICATION_DIALOGUES.length >= 80);
    assert.ok(countCommunicationTurns() >= 250);
  });

  it("keeps facts direct and hypotheses qualified", () => {
    const meaning = interpretCanonicalManagerMeaning({
      utterance: "Why is Delivery below target?",
      subjects: syntheticSubjects(),
    });
    const composed = composeTrustedExecutiveCommunication({
      sourceText:
        "Delivery is 91% against a 96% target. Capacity Gap is causing Delivery. We should definitely act.",
      utterance: "Why is Delivery below target?",
      meaning,
      clarification: null,
      status: "applied",
      intentKind: "explain",
      explanation: null,
    });
    assert.match(composed.answer, /91%/);
    assert.doesNotMatch(composed.answer, /is causing/i);
    assert.doesNotMatch(composed.answer, /definitely/i);
  });

  it("does not hedge authoritative facts", () => {
    const meaning = interpretCanonicalManagerMeaning({
      utterance: "What is Delivery?",
      subjects: syntheticSubjects(),
    });
    const composed = composeTrustedExecutiveCommunication({
      sourceText: "Delivery is 91% against a 96% target.",
      utterance: "What is Delivery?",
      meaning,
      clarification: null,
      status: "applied",
      intentKind: "explain",
      explanation: null,
    });
    assert.match(composed.answer, /Delivery is 91%/);
    assert.doesNotMatch(composed.answer, /might possibly/i);
  });

  it("answers mixed certainty without exposing enums", () => {
    const meaning = interpretCanonicalManagerMeaning({
      utterance: "Are you sure Capacity is the cause?",
      subjects: syntheticSubjects(),
    });
    const composed = composeTrustedExecutiveCommunication({
      sourceText: "Capacity is related to Delivery. Recommendation: Review Capacity Gap.",
      utterance: "Are you sure Capacity is the cause?",
      meaning,
      clarification: null,
      status: "applied",
      intentKind: "evidence",
      explanation: null,
    });
    assert.doesNotMatch(composed.answer, /Confidence:/);
    assert.doesNotMatch(composed.answer, /\bMEDIUM\b/);
  });

  it("challenges unsupported causal certainty", () => {
    const meaning = interpretCanonicalManagerMeaning({
      utterance: "Capacity is definitely the cause.",
      subjects: syntheticSubjects(),
    });
    const composed = composeTrustedExecutiveCommunication({
      sourceText: "Capacity is related to Delivery.",
      utterance: "Capacity is definitely the cause.",
      meaning,
      clarification: null,
      status: "applied",
      intentKind: "evidence",
      explanation: null,
    });
    assert.match(composed.answer, /careful with that conclusion/i);
    assert.doesNotMatch(composed.answer, /You're wrong/i);
  });

  it("keeps clarification short", () => {
    const meaning = interpretCanonicalManagerMeaning({
      utterance: "Explain that.",
      subjects: syntheticSubjects(),
    });
    const composed = composeTrustedExecutiveCommunication({
      sourceText: "Do you mean the Delivery KPI or the Capacity problem?",
      utterance: "Explain that.",
      meaning,
      clarification: {
        identity: "NEX-MVP-FINAL:6.3/SmartClarificationCorrection",
        action: "clarify",
        question: "Do you mean the Delivery KPI or the Capacity problem?",
        reason: "REFERENCE_AMBIGUITY",
        pending: null,
        resumeOperation: null,
        resumeReference: null,
        resumeIntentKind: null,
        correctionDetected: false,
        correctionScope: null,
        correctionBeforeId: null,
        correctionAfterId: null,
        cancelled: false,
        consequence: "INQUIRY",
        commitsDecision: false,
        startsExecution: false,
      },
      status: "clarification-required",
      intentKind: "explain",
      explanation: null,
    });
    assert.equal(composed.answer, "Do you mean the Delivery KPI or the Capacity problem?");
    assert.ok(composed.answer.length < 120);
  });

  it("does not encode certification sentences in production", () => {
    const source = readFileSync(
      join(here, "nexoraMvpFinal64TrustedCommunication.ts"),
      "utf8",
    );
    assert.equal(source.includes("So it worked?"), false);
    assert.equal(source.includes("Are you challenging me?"), false);
  });

  it("certifies trusted-communication dialogues", () => {
    const failures: string[] = [];
    for (const dialogue of COMMUNICATION_CERTIFICATION_DIALOGUES) {
      let previous: ReturnType<typeof run> | undefined;
      for (const [index, turn] of dialogue.turns.entries()) {
        previous = run(turn.utterance, previous);
        const text = previous.response;
        assert.doesNotMatch(text, NEXORA_MANAGER_ARCHITECTURE_LEAK);
        assert.doesNotMatch(text, /Absolutely!|Great question!|As an AI/i);
        for (const phrase of turn.forbid ?? []) {
          if (new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(text)) {
            failures.push(`${dialogue.id}:${index} FORBID ${phrase}`);
          }
        }
        for (const phrase of turn.require ?? []) {
          if (!new RegExp(phrase, "i").test(text)) {
            failures.push(`${dialogue.id}:${index} REQUIRE ${phrase} got=${text.slice(0, 180)}`);
          }
        }
        if (turn.mustStayShort && text.split(/(?<=[.!?])\s+/).length > 6) {
          failures.push(`${dialogue.id}:${index} COMMUNICATION_VERBOSITY_FAILURE`);
        }
        if (
          turn.mustNotClarifyLong &&
          previous.clarificationTurn.action === "clarify" &&
          text.length > 180
        ) {
          failures.push(`${dialogue.id}:${index} CLARIFICATION_REGRESSION`);
        }
        if (turn.mustNotCommit) {
          assert.notEqual(previous.intentResult.intent.kind, "confirm-decision-commitment");
          assert.doesNotMatch(text, /decision is approved/i);
        }
        if (turn.mustNotExecute) {
          assert.doesNotMatch(text, /execution has started/i);
        }
        const copyFailures = validateTrustedExecutiveCopy(text);
        if (copyFailures.length > 0) {
          failures.push(`${dialogue.id}:${index} ${copyFailures.join(",")}`);
        }
      }
    }
    assert.deepEqual(failures, []);
  });
});
