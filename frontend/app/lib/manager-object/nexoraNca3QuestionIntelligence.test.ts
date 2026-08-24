/**
 * NCA:3 — Clarification, information-gap, and executive question tests A–T.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { freezeConversationalSubjectRecord } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import { nexoraNca1Identity } from "./nexoraNca1ConversationTypes.ts";
import type { ManagerConversationTurn } from "./nexoraNca1ConversationTypes.ts";
import { createEmptyNcaConversationState } from "./nexoraNca2ConversationState.ts";
import {
  NEXORA_NCA3_BOUNDARY,
  evaluateNca3QuestionStrategy,
  getNexoraNca3Identity,
  verifyNexoraNca3,
} from "./nexoraNca3QuestionIntelligence.ts";

const here = dirname(fileURLToPath(import.meta.url));

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function subjects() {
  return Object.freeze([
    ...projectManagerObjectConversationalSubjects(catalog()),
    freezeConversationalSubjectRecord({
      subjectId: "obj-profit-nca3",
      subjectKind: "object",
      canonicalName: "Profit",
      aliases: Object.freeze(["Profit"]),
      businessKey: "obj-profit-nca3",
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
    messageIdSeed: `nca3-${utterance}`,
  });
}

function questionMarks(text: string): number {
  return (text.match(/\?/g) ?? []).length;
}

function sampleTurn(
  family: ManagerConversationTurn["need"]["family"],
  name: string,
  utterance: string,
): ManagerConversationTurn {
  return Object.freeze({
    identity: nexoraNca1Identity,
    message: utterance,
    managerContext: Object.freeze({ role: "COO", domain: "operations" }),
    conversationContext: Object.freeze({
      activeTopic: name,
      activeObject: name,
      activeGoal: null,
      activeJourneyState: null,
    }),
    reference: Object.freeze({
      explicit: name,
      resolvedId: `obj-${name.toLowerCase()}`,
      resolvedName: name,
      confidence: "HIGH" as const,
      provenance: "test",
    }),
    need: Object.freeze({ family, confidence: 0.9 }),
    knowledgeState: Object.freeze({
      sufficient: family === "UNDERSTAND",
      missing: Object.freeze([]) as readonly string[],
      evidenceState: "observed" as const,
      uncertainty: null,
    }),
    advisorBehavior: family === "EVALUATE" ? ("ASK" as const) : ("ANSWER" as const),
    strategy: Object.freeze({
      behavior: family === "EVALUATE" ? ("ASK" as const) : ("ANSWER" as const),
      subject: name,
      objective: "advise",
      evidence: Object.freeze([]) as readonly string[],
      uncertainty: null,
      question: null,
      recommendedAction: null,
      capability: "MO:2",
      continuity: "update-subject" as const,
    }),
  });
}

describe("NCA:3 Clarification, Information-Gap & Executive Question Intelligence", () => {
  it("identity does not create a second knowledge system", () => {
    assert.equal(
      getNexoraNca3Identity().id,
      "NCA:3/ClarificationInformationGapExecutiveQuestionIntelligence",
    );
    assert.equal(NEXORA_NCA3_BOUNDARY.createsSecondEvidenceStore, false);
    assert.equal(NEXORA_NCA3_BOUNDARY.createsSurveyFramework, false);
    assert.equal(NEXORA_NCA3_BOUNDARY.usesLiveLlm, false);
    assert.equal(verifyNexoraNca3().ok, true);
  });

  it("A. Enough information — What does Delivery show? asks nothing", () => {
    const result = run("What does Delivery show?");
    assert.equal(result.nca3Strategy?.shouldAsk, false);
    assert.equal(questionMarks(result.response), 0);
    assert.match(result.response, /Delivery|91%|on-time/i);
  });

  it("B. Critical gap — permanently increase capacity asks persistence", () => {
    const result = run("Should we permanently increase capacity?");
    assert.equal(result.ncaTurn.need.family, "EVALUATE");
    assert.equal(result.nca3Strategy?.shouldAsk, true);
    assert.equal(questionMarks(result.response), 1);
    assert.match(result.response, /continue|demand|months/i);
    assert.equal(result.nca3Strategy?.gap?.id, "demand-persistence");
  });

  it("C. One-question rule when several gaps exist", () => {
    const result = run("Should we permanently increase capacity?");
    assert.ok((result.nca3Strategy?.gaps.length ?? 0) >= 2);
    assert.equal(questionMarks(result.response), 1);
    assert.doesNotMatch(result.response, /budget[\s\S]*labor|labor[\s\S]*budget/i);
  });

  it("D. Recompute after seasonal answer; no scripted next question", () => {
    let previous = run("Should we permanently increase capacity?");
    previous = run("No, it's seasonal and should normalize in about three months.", previous);
    assert.equal(previous.nca3Strategy?.shouldAsk, false);
    assert.match(previous.response, /temporary|harder to justify/i);
    assert.doesNotMatch(previous.response, /labor available|what budget/i);
    assert.ok(
      previous.nca3Strategy?.gaps.some(
        (gap) => gap.id === "demand-persistence" && gap.status !== "OPEN",
      ),
    );
  });

  it("E. Partial sufficiency answers with calibrated uncertainty", () => {
    let previous = run("Should we permanently increase capacity?");
    previous = run("No, it's seasonal.", previous);
    assert.match(previous.response, /moderate confidence|unconfirmed|uncertainty/i);
    assert.equal(questionMarks(previous.response), 0);
  });

  it("F. Existing Delivery KPI is not requested from the manager", () => {
    const result = run("What does Delivery show?");
    assert.doesNotMatch(result.response, /what is (?:the )?current delivery/i);
    assert.equal(result.nca3Strategy?.shouldAsk, false);
  });

  it("G. Missing target is asked only when judgement needs it", () => {
    const strategy = evaluateNca3QuestionStrategy({
      utterance: "Is quality bad?",
      nca: sampleTurn("EVALUATE", "Quality", "Is quality bad?"),
      conversation: createEmptyNcaConversationState(),
      knownFacts: {
        hasCurrentKpi: true,
        hasTarget: false,
        demandPersistence: "unknown",
      },
    });
    assert.equal(strategy.shouldAsk, true);
    assert.equal(strategy.gap?.id, "missing-target");
  });

  it("H. Preference is asked when cost vs speed is unresolved", () => {
    const strategy = evaluateNca3QuestionStrategy({
      utterance: "Should we protect cost or delivery speed?",
      nca: sampleTurn("COMPARE", "Delivery", "Should we protect cost or delivery speed?"),
      conversation: createEmptyNcaConversationState(),
      knownFacts: { hasGoal: false, goalProtectsDelivery: false },
    });
    assert.equal(strategy.shouldAsk, true);
    assert.equal(strategy.gap?.id, "manager-priority");
  });

  it("I. Existing delivery goal does not re-ask the preference", () => {
    const strategy = evaluateNca3QuestionStrategy({
      utterance: "Should we protect cost or delivery speed?",
      nca: sampleTurn("COMPARE", "Delivery", "Should we protect cost or delivery speed?"),
      conversation: createEmptyNcaConversationState(),
      knownFacts: { hasGoal: true, goalProtectsDelivery: true },
    });
    assert.equal(strategy.shouldAsk, false);
  });

  it("J. Causal uncertainty asks evidence without asserting cause", () => {
    const result = run("Why is delivery below target?");
    assert.doesNotMatch(result.response, /\bis causing\b|definitely caused/i);
    if (questionMarks(result.response) > 0) {
      assert.equal(questionMarks(result.response), 1);
      assert.doesNotMatch(result.response, /\bis causing\b/);
    }
  });

  it("K. I don't know uses fallback and does not loop", () => {
    let previous = run("Should we permanently increase capacity?");
    const question = previous.response;
    previous = run("I don't know.", previous);
    assert.notEqual(previous.response, question);
    assert.equal(questionMarks(previous.response), 0);
    assert.match(previous.response, /avoid treating|permanent|evidence we do have/i);
  });

  it("L. Refusal is respected", () => {
    let previous = run("Should we permanently increase capacity?");
    const asked = previous.response;
    previous = run("Skip that.", previous);
    assert.notEqual(previous.response, asked);
    assert.doesNotMatch(previous.response, /Do you expect this higher demand/i);
  });

  it("M. Partial answer is preserved as useful timeframe", () => {
    let previous = run("Should we permanently increase capacity?");
    previous = run("Probably through Q4, maybe longer.", previous);
    assert.match(previous.response, /temporary|Q4|harder to justify|continue/i);
  });

  it("N. Correction updates conversational interpretation without writing business data", () => {
    let previous = run("Should we permanently increase capacity?");
    previous = run("Yes, about 20%.", previous);
    previous = run("Actually, closer to 8%.", previous);
    assert.doesNotMatch(previous.response, /I'll update the ERP|decision is approved/i);
    assert.ok(previous.ncaConversationState);
  });

  it("O. External gap is marked and not invented", () => {
    const result = run("Which supplier in Vancouver can deliver this part by Friday?");
    assert.match(result.response, /cannot look up|will not invent|do not have/i);
    assert.doesNotMatch(result.response, /Acme Logistics can deliver/i);
    assert.ok(
      result.nca3Strategy?.gaps.some((gap) => gap.externalSourceRequired) ||
        /cannot look up/i.test(result.response),
    );
  });

  it("P. Scenario comparison asks a criterion only if it can change ranking", () => {
    const strategy = evaluateNca3QuestionStrategy({
      utterance: "Compare the cost vs speed options.",
      nca: sampleTurn("COMPARE", "Capacity", "Compare the cost vs speed options."),
      conversation: createEmptyNcaConversationState(),
      knownFacts: { hasGoal: false, goalProtectsDelivery: false },
    });
    assert.equal(strategy.shouldAsk, true);
    assert.equal(strategy.gap?.couldChangeRecommendation, true);
  });

  it("Q. Decision readiness asks the critical constraint first", () => {
    const result = run("Should we permanently expand capacity?");
    assert.equal(result.nca3Strategy?.shouldAsk, true);
    assert.match(result.response, /continue|demand/i);
    assert.doesNotMatch(result.response, /decision is approved/i);
  });

  it("R. Low-value gaps do not block advice", () => {
    const strategy = evaluateNca3QuestionStrategy({
      utterance: "Should we permanently increase capacity?",
      nca: sampleTurn("EVALUATE", "Capacity", "Should we permanently increase capacity?"),
      conversation: createEmptyNcaConversationState(),
      knownFacts: { demandPersistence: "temporary" },
    });
    assert.equal(strategy.shouldAsk, false);
    const budget = strategy.gaps.find((gap) => gap.id === "budget-cap");
    if (budget) {
      assert.ok(budget.questionValue < 0.35 || budget.status !== "OPEN");
    }
  });

  it("S. Multi-turn sequence stays on one advisory thread", () => {
    let previous = run("Should we add capacity?");
    const thread = previous.ncaConversationState?.currentThreadId;
    previous = run("It's only seasonal.", previous);
    assert.equal(previous.ncaConversationState?.currentThreadId, thread);
    assert.equal(previous.nca3Strategy?.shouldAsk, false);
    assert.match(previous.response, /temporary|harder to justify/i);
  });

  it("T. Object-generic: no sentence-specific architecture branches", () => {
    const source = readFileSync(join(here, "nexoraNca3QuestionIntelligence.ts"), "utf8");
    assert.doesNotMatch(source, /What does Delivery show\?/);
    assert.doesNotMatch(source, /Should we permanently increase capacity\?/);
    const objects = ["Delivery", "Risk", "Profit", "Inventory", "Quality", "Project", "Supplier"];
    for (const name of objects) {
      const strategy = evaluateNca3QuestionStrategy({
        utterance: `Should we permanently increase ${name}?`,
        nca: sampleTurn("EVALUATE", name, `Should we permanently increase ${name}?`),
        conversation: createEmptyNcaConversationState(),
      });
      assert.equal(strategy.identity, "NCA:3/ClarificationInformationGapExecutiveQuestionIntelligence");
      assert.ok(strategy.gaps.every((gap) => typeof gap.category === "string"));
    }
  });
});
