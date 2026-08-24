/**
 * NCA:4 — Executive advisory reasoning and recommendation-dialogue tests A–W.
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
import {
  NEXORA_NCA4_BOUNDARY,
  classifyAdvisoryDialogueMove,
  getNexoraNca4Identity,
  verifyNexoraNca4,
} from "./nexoraNca4AdvisoryIntelligence.ts";

const here = dirname(fileURLToPath(import.meta.url));

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function subjects() {
  return Object.freeze([
    ...projectManagerObjectConversationalSubjects(catalog()),
    freezeConversationalSubjectRecord({
      subjectId: "obj-margin-nca4",
      subjectKind: "object",
      canonicalName: "Margin",
      aliases: Object.freeze(["Margin"]),
      businessKey: "obj-margin-nca4",
    }),
    freezeConversationalSubjectRecord({
      subjectId: "obj-quality-nca4",
      subjectKind: "object",
      canonicalName: "Quality",
      aliases: Object.freeze(["Quality"]),
      businessKey: "obj-quality-nca4",
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
    messageIdSeed: `nca4-${utterance}`,
  });
}

function advised(result: ReturnType<typeof run>) {
  return result.nca4Strategy?.position.recommendation.optionLabel ?? "";
}

describe("NCA:4 Executive Advisory Reasoning & Recommendation Dialogue", () => {
  it("identity does not create a second recommendation or decision engine", () => {
    assert.equal(
      getNexoraNca4Identity().id,
      "NCA:4/ExecutiveAdvisoryReasoningRecommendationDialogueIntelligence",
    );
    assert.equal(NEXORA_NCA4_BOUNDARY.createsSecondRecommendationEngine, false);
    assert.equal(NEXORA_NCA4_BOUNDARY.commitsDecision, false);
    assert.equal(NEXORA_NCA4_BOUNDARY.startsExecution, false);
    assert.equal(NEXORA_NCA4_BOUNDARY.usesLiveLlm, false);
    assert.equal(verifyNexoraNca4().ok, true);
  });

  it("A. Basic recommendation from goal and evidence", () => {
    const result = run("What should I do?");
    assert.equal(result.nca4Strategy?.shouldAdvise, true);
    assert.match(result.response, /recommend|lean toward/i);
    assert.match(result.response, /temporary capacity/i);
    assert.doesNotMatch(result.response, /decision is approved|execution started/i);
  });

  it("B. Insufficient information — NCA:3 question wins", () => {
    const result = run("Should we permanently increase capacity?");
    assert.equal(result.nca3Strategy?.shouldAsk, true);
    assert.equal(result.nca4Strategy?.shouldAdvise, false);
    assert.equal((result.response.match(/\?/g) ?? []).length, 1);
    assert.doesNotMatch(result.response, /\bI recommend\b/i);
  });

  it("C. Sufficient with uncertainty includes a condition", () => {
    let previous = run("Should we permanently increase capacity?");
    previous = run("No, it's seasonal and should normalize in about three months.", previous);
    previous = run("What do you recommend?", previous);
    assert.match(previous.response, /temporary capacity/i);
    assert.match(previous.response, /moderate|uncertain|if demand/i);
  });

  it("D. Why that one explains the current recommendation", () => {
    let previous = run("What should I do?");
    const option = advised(previous);
    previous = run("Why that one?", previous);
    assert.match(previous.response, new RegExp(option.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    assert.match(previous.response, /goal|reversib|uncertain/i);
  });

  it("E. Why not the other explains the weakened alternative", () => {
    let previous = run("What should I do?");
    previous = run("Why not the permanent option?", previous);
    assert.match(previous.response, /permanent/i);
    assert.match(previous.response, /demand|normaliz|downside/i);
  });

  it("F. Biggest downside returns the key cost/risk", () => {
    let previous = run("What should I do?");
    previous = run("What's the downside?", previous);
    assert.match(previous.response, /cost|downside/i);
  });

  it("G. Confidence is calibrated in manager language", () => {
    let previous = run("What should I do?");
    previous = run("How sure are you?", previous);
    assert.match(previous.response, /moderate/i);
    assert.doesNotMatch(previous.response, /83\.7%/);
  });

  it("H. What would change the recommendation returns sensitivities", () => {
    let previous = run("What should I do?");
    previous = run("What would change your recommendation?", previous);
    assert.match(previous.response, /demand|labor|cheaper/i);
  });

  it("I. Assumptions are material, not architectural", () => {
    let previous = run("What should I do?");
    previous = run("What are you assuming?", previous);
    assert.match(previous.response, /demand|persist/i);
    assert.doesNotMatch(previous.response, /NCA:4|fingerprint|optionId/i);
  });

  it("J. Cost-first preference re-evaluates the recommendation", () => {
    let previous = run("What should I do?");
    const before = advised(previous);
    previous = run("What if cost matters more than delivery speed?", previous);
    assert.notEqual(advised(previous).toLowerCase(), before.toLowerCase());
    assert.match(previous.response, /cost|do nothing|monitor/i);
  });

  it("K. Material new evidence revises the recommendation", () => {
    let previous = run("What should I do?");
    assert.match(previous.response, /temporary capacity/i);
    previous = run(
      "We just signed an 18-month customer contract that keeps this demand level.",
      previous,
    );
    assert.equal(previous.nca4Strategy?.position.status, "REVISED");
    assert.match(previous.response, /changes my recommendation|now recommend/i);
    assert.match(previous.response, /permanent/i);
    previous = run("I disagree. I still want temporary capacity.", previous);
    assert.equal(previous.ncaConversationState?.lastAdvisoryPosition?.optionId, "committed-change");
    assert.match(previous.response, /understood|main risk/i);
  });

  it("L. Secondary evidence does not flip the recommendation", () => {
    let previous = run("What should I do?");
    const option = advised(previous);
    previous = run("Labor cost is 8% higher than expected.", previous);
    assert.equal(advised(previous), option);
    assert.match(previous.response, /does not change my recommendation|stays/i);
  });

  it("M. Unsupported strong action is challenged", () => {
    let previous = run("What should I do?");
    previous = run("Let's permanently expand capacity because delivery is down.", previous);
    assert.match(previous.response, /would not recommend|not established|not recommend committing/i);
    assert.doesNotMatch(previous.response, /you should permanently expand/i);
  });

  it("N. Disagreement stays open and is not defensive", () => {
    let previous = run("What should I do?");
    const option = advised(previous);
    previous = run("I disagree. I want the permanent option.", previous);
    assert.equal(advised(previous), option);
    assert.match(previous.response, /understood|main risk/i);
    assert.match(previous.response, /advice, not a Decision|not a Decision/i);
  });

  it("O. Manager override does not commit a Decision", () => {
    let previous = run("What should I do?");
    previous = run("I understand, but I still want the permanent option.", previous);
    assert.equal(previous.nextDecisionSession, null);
    assert.match(previous.response, /will not convert|not a Decision|start Execution/i);
    assert.equal(previous.nca4Strategy?.position.commitsDecision, false);
  });

  it("P. No recommendation without comparable supplier evidence", () => {
    const result = run("Which supplier should we choose?");
    assert.equal(result.nca4Strategy?.position.status, "NO_RECOMMENDATION");
    assert.match(result.response, /can'?t responsibly recommend|comparable supplier|will not invent availability/i);
    assert.doesNotMatch(result.response, /I recommend supplier/i);
  });

  it("Q. Do-nothing remains a valid path", () => {
    let previous = run("What should I do?");
    previous = run("What if we do nothing?", previous);
    assert.match(previous.response, /do(?:ing)? nothing|valid path|without intervention/i);
  });

  it("R. Counterargument is the strongest supported objection", () => {
    let previous = run("What should I do?");
    previous = run("What's the best argument against your recommendation?", previous);
    assert.match(previous.response, /permanent|elevated|expensive/i);
  });

  it("S. Object-generic architecture — no sentence-specific branches", () => {
    const source = readFileSync(join(here, "nexoraNca4AdvisoryIntelligence.ts"), "utf8");
    assert.doesNotMatch(source, /What should I do\?/);
    assert.doesNotMatch(source, /Should we permanently increase capacity\?/);
    const quality = run("What should I do about Quality?");
    const inventory = run("What should I do about Inventory?");
    assert.equal(quality.nca4Strategy?.identity, "NCA:4/ExecutiveAdvisoryReasoningRecommendationDialogueIntelligence");
    assert.equal(inventory.nca4Strategy?.identity, "NCA:4/ExecutiveAdvisoryReasoningRecommendationDialogueIntelligence");
    assert.equal(classifyAdvisoryDialogueMove("What should I do?"), "REQUEST");
    assert.equal(classifyAdvisoryDialogueMove("What would you pick?"), "PERSONAL");
  });

  it("T. Recommendation continuity across why / downside / confidence", () => {
    let previous = run("What should I do?");
    const option = advised(previous);
    previous = run("Why that one?", previous);
    assert.match(previous.response, new RegExp(option, "i"));
    previous = run("What's the downside?", previous);
    assert.match(previous.response, new RegExp(option, "i"));
    previous = run("How sure are you?", previous);
    assert.equal(advised(previous), option);
  });

  it("U. Goal/evidence change expires the old recommendation", () => {
    let previous = run("What should I do?");
    assert.match(previous.response, /temporary capacity/i);
    previous = run(
      "We just signed an 18-month customer contract that keeps this demand level.",
      previous,
    );
    assert.notEqual(previous.ncaConversationState?.lastAdvisoryPosition?.optionId, "reversible-relief");
    assert.match(previous.response, /permanent/i);
  });

  it("V. Advice does not write Decision state", () => {
    const result = run("What should I do?");
    assert.equal(result.nextDecisionSession, null);
    assert.equal(result.nca4Strategy?.position.commitsDecision, false);
    assert.doesNotMatch(result.response, /decision is approved/i);
  });

  it("W. Advice does not start Execution", () => {
    const result = run("What should I do?");
    assert.equal(result.nca4Strategy?.position.startsExecution, false);
    assert.doesNotMatch(result.response, /execution started|starting the plan/i);
  });
});
