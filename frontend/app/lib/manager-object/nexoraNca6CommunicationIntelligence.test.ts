/**
 * NCA:6 — Manager model, communication adaptation, and trust tests A–Z.
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
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { createProactiveExecutiveSignal } from "./nexoraNca5InitiativeIntelligence.ts";
import {
  ADVISOR_TRUST_CONTRACT,
  NEXORA_NCA6_BOUNDARY,
  applyNca6StrategyToResponse,
  classifyCommunicationSignals,
  evaluateNca6CommunicationStrategy,
  getNexoraNca6Identity,
  preservedTruthTokens,
  verifyNexoraNca6,
} from "./nexoraNca6CommunicationIntelligence.ts";
import type { CommunicationDepth } from "./nexoraNca6CommunicationIntelligenceTypes.ts";
import type { CommunicationFraming } from "./nexoraNca6CommunicationIntelligenceTypes.ts";
import type { Nca6ManagerContextInput } from "./nexoraNca6CommunicationIntelligenceTypes.ts";

const here = dirname(fileURLToPath(import.meta.url));

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function subjects() {
  return Object.freeze([
    ...projectManagerObjectConversationalSubjects(catalog()),
    freezeConversationalSubjectRecord({
      subjectId: "obj-margin-nca6",
      subjectKind: "object",
      canonicalName: "Margin",
      aliases: Object.freeze(["Margin"]),
      businessKey: "obj-margin-nca6",
    }),
  ]);
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
  extra?: {
    readonly managerCommunicationContext?: Nca6ManagerContextInput | null;
    readonly initiativeSignals?: Parameters<
      typeof executeNexoraConversationalExperience
    >[0]["initiativeSignals"];
    readonly conversationImportance?: Parameters<
      typeof executeNexoraConversationalExperience
    >[0]["conversationImportance"];
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
    messageIdSeed: `nca6-${utterance}`,
    managerCommunicationContext: extra?.managerCommunicationContext,
    initiativeSignals: extra?.initiativeSignals,
    conversationImportance: extra?.conversationImportance,
  });
}

function optionOf(result: ReturnType<typeof run>) {
  return result.nca4Strategy?.position.recommendation.optionLabel ?? "";
}

const TRUTH =
  "I recommend temporary capacity. Delivery is 91% against a 96% target. Demand persistence remains uncertain. I'm moderately confident. This is advice, not an approved Decision, and execution has not started.";

function adapt(
  utterance: string,
  source = TRUTH,
  managerContext?: Nca6ManagerContextInput,
  extras?: {
    readonly nca4?: Parameters<typeof evaluateNca6CommunicationStrategy>[0]["nca4"];
    readonly nca5?: Parameters<typeof evaluateNca6CommunicationStrategy>[0]["nca5"];
    readonly previousResponse?: string | null;
  },
) {
  return evaluateNca6CommunicationStrategy({
    utterance,
    source,
    managerContext,
    nca4: extras?.nca4,
    nca5: extras?.nca5,
    previousResponse: extras?.previousResponse,
  });
}

describe("NCA:6 Manager Model, Communication Adaptation & Trust", () => {
  it("identity is presentation-only and does not profile personality", () => {
    assert.equal(
      getNexoraNca6Identity().id,
      "NCA:6/ManagerModelCommunicationAdaptationTrustIntelligence",
    );
    assert.equal(NEXORA_NCA6_BOUNDARY.createsPersonalityProfiler, false);
    assert.equal(NEXORA_NCA6_BOUNDARY.commitsDecision, false);
    assert.equal(NEXORA_NCA6_BOUNDARY.startsExecution, false);
    assert.equal(NEXORA_NCA6_BOUNDARY.usesLiveLlm, false);
    assert.equal(NEXORA_NCA6_BOUNDARY.adaptsTruthToPersonality, false);
    assert.equal(ADVISOR_TRUST_CONTRACT.preserveRecommendationMeaning, true);
    assert.equal(verifyNexoraNca6().ok, true);
  });

  it("A. Brief request shortens presentation without changing the recommendation", () => {
    let previous = run("What should I do?");
    const option = optionOf(previous);
    previous = run("Give me the short version.", previous);
    assert.equal(previous.nca6Strategy?.strategy.depth, "BRIEF");
    assert.equal(optionOf(previous), option);
    assert.match(previous.response, /temporary capacity/i);
    assert.ok(
      previous.response.length <=
        Math.max(180, previous.nca4Strategy?.response?.length ?? previous.response.length),
    );
  });

  it("B. Detailed request keeps the same advisory position", () => {
    let previous = run("What should I do?");
    const option = optionOf(previous);
    previous = run("Walk me through the reasoning.", previous);
    assert.equal(previous.nca6Strategy?.strategy.depth, "DETAILED");
    assert.equal(optionOf(previous), option);
  });

  it("C. Confusion simplifies language without changing truth", () => {
    const strategy = adapt("I don't understand what Capacity Gap means.");
    assert.equal(strategy.snapshot.confusionDetected, true);
    assert.match(strategy.response ?? "", /difference between the capacity you need/i);
    assert.match(strategy.response ?? "", /temporary capacity/i);
    assert.doesNotMatch(strategy.response ?? "", /canonical resolver|state machine/i);
  });

  it("D. Executive framing uses goal/decision language", () => {
    const result = run("What should I do?", undefined, {
      managerCommunicationContext: { role: "Executive" },
    });
    assert.equal(result.nca6Strategy?.snapshot.role, "EXECUTIVE");
    assert.equal(result.nca6Strategy?.strategy.framing, "EXECUTIVE");
    assert.match(result.response, /decision|protect/i);
    assert.match(result.response, /temporary capacity/i);
  });

  it("E. Operations framing uses constraint/throughput language", () => {
    const result = run("What should I do?", undefined, {
      managerCommunicationContext: { role: "Operations Manager" },
    });
    assert.equal(result.nca6Strategy?.strategy.framing, "OPERATIONS");
    assert.match(result.response, /constraint|backlog|throughput|capacity pressure/i);
    assert.match(result.response, /temporary capacity/i);
  });

  it("F. Finance framing uses cost/exposure language without inventing numbers", () => {
    const result = run("What should I do?", undefined, {
      managerCommunicationContext: { role: "Finance Manager" },
    });
    assert.equal(result.nca6Strategy?.strategy.framing, "FINANCE");
    assert.match(result.response, /cost|exposure|commitment/i);
    assert.doesNotMatch(result.response, /NPV|IRR|\$12\.4m/i);
    assert.match(result.response, /temporary capacity/i);
  });

  it("G. Unknown role stays neutral and does not guess", () => {
    const result = run("What should I do?");
    assert.equal(result.nca6Strategy?.snapshot.role, "UNKNOWN");
    assert.equal(result.nca6Strategy?.strategy.framing, "NEUTRAL");
    assert.doesNotMatch(result.response, /as an executive|as finance/i);
  });

  it("H. Explicit request beats a brief profile", () => {
    const first = adapt("Always keep it short.");
    const second = evaluateNca6CommunicationStrategy({
      utterance: "Walk me through the reasoning.",
      source: TRUTH,
      conversation: { lastCommunicationSnapshot: first.snapshot } as never,
    });
    assert.equal(second.strategy.depth, "DETAILED");
  });

  it("I. Keep this one short stays temporary", () => {
    const strategy = adapt("Keep this one short.");
    assert.equal(strategy.strategy.depth, "BRIEF");
    assert.equal(strategy.snapshot.sessionPreferredDepth, null);
    assert.equal(strategy.model.currentInteraction.requestedDepth, "BRIEF");
  });

  it("J. New Nexora user gets indirect teaching", () => {
    const strategy = adapt("What should I do here?", TRUTH, { familiarity: "NEW" });
    assert.match(strategy.response ?? "", /start with the outcome you want to improve/i);
  });

  it("K. Familiar user is not given a basic tutorial", () => {
    const strategy = adapt("What should I do here?", TRUTH, { familiarity: "FAMILIAR" });
    assert.doesNotMatch(strategy.response ?? "", /start with the outcome you want to improve/i);
    assert.doesNotMatch(strategy.response ?? "", /a scenario is a possible course of action/i);
  });

  it("L. Confusion is not treated as disagreement", () => {
    let previous = run("What should I do?");
    const option = optionOf(previous);
    previous = run("I don't understand.", previous);
    assert.equal(optionOf(previous), option);
    assert.equal(previous.nca6Strategy?.snapshot.confusionDetected, true);
    assert.doesNotMatch(previous.response, /that's a valid alternative if you're willing/i);
  });

  it("M. Challenge preserves the recommendation without appeasement", () => {
    let previous = run("What should I do?");
    const option = optionOf(previous);
    previous = run("I disagree. Permanent expansion is better.", previous);
    assert.equal(optionOf(previous), option);
    assert.match(previous.response, /still remains|remains temporary capacity|temporary capacity/i);
    assert.doesNotMatch(previous.response, /you're wrong/i);
  });

  it("N. Recommendation revision is explained", () => {
    let previous = run("What should I do?");
    previous = run(
      "We just signed an 18-month customer contract that keeps this demand level.",
      previous,
    );
    assert.match(previous.response, /earlier|changes|now/i);
    assert.match(previous.response, /permanent/i);
  });

  it("O. Recommendation stability is explained", () => {
    let previous = run("What should I do?");
    previous = run("Labor cost is 8% higher than expected.", previous);
    assert.match(previous.response, /does not change my recommendation|remains/i);
  });

  it("P. Fact / inference / advice remain distinguishable", () => {
    const text = adapt("Walk me through the reasoning.").response ?? "";
    assert.match(text, /91%|96%|delivery/i);
    assert.match(text, /uncertain|may|moderately/i);
    assert.match(text, /recommend/i);
  });

  it("Q. Uncertainty remains visible in brief and detailed modes", () => {
    const brief = adapt("Give me the short version.");
    const detailed = adapt("Walk me through the reasoning.");
    assert.match(brief.response ?? "", /uncertain|moderately/i);
    assert.match(detailed.response ?? "", /uncertain|moderately/i);
  });

  it("R. Manager correction is acknowledged without mutating RDI", () => {
    let previous = run("What should I do?");
    const decision = previous.nextDecisionSession;
    previous = run("That's not right. The target is 98%, not 96%.", previous);
    assert.match(previous.response, /understood/i);
    assert.equal(previous.nextDecisionSession, decision);
  });

  it("S. Nexora self-corrects a prior conversational misspeak", () => {
    const strategy = adapt("What should I do?", "Delivery is 91% against a 98% target. I recommend temporary capacity. Demand remains uncertain.", undefined, {
      previousResponse: "The 96% target is the current bar.",
    });
    assert.match(strategy.response ?? "", /correct my earlier statement|98%.+not 96%/i);
  });

  it("T. Goal/preference conflict is surfaced", () => {
    const strategy = adapt(
      "I want the cheapest option.",
      `${TRUTH} The current goal is to protect delivery.`,
    );
    assert.match(strategy.response ?? "", /conflicts with the current delivery goal/i);
    assert.match(strategy.response ?? "", /temporary capacity/i);
  });

  it("U. Capability honesty does not fabricate supplier research", () => {
    const result = run("Find me the best supplier in Vancouver.");
    assert.match(result.response, /don't currently have verified|cannot look up|will not invent|can't responsibly recommend/i);
    assert.doesNotMatch(result.response, /I found a supplier in Vancouver named/i);
  });

  it("V. NCA:5 critical initiative is presented with CRITICAL structure", () => {
    const strategy = adapt("ok", TRUTH, undefined, {
      nca5: {
        shouldInitiate: true,
        decision: { priority: "CRITICAL" },
        response:
          "Before we continue: an important assumption no longer holds. I recommend reviewing the decision.",
      } as never,
    });
    assert.equal(strategy.strategy.structure, "CRITICAL");
    assert.match(strategy.response ?? "", /assumption no longer holds|before we continue/i);
  });

  it("W. Ordinary NCA:5 initiative is not buried in a lecture", () => {
    const result = run("Thanks.", undefined, {
      initiativeSignals: [
        createProactiveExecutiveSignal({
          id: "delivery:93:89",
          family: "GOAL_DEVIATION",
          source: "caller",
          subjectId: "delivery",
          subjectLabel: "Delivery",
          observation: "Delivery moved from 93 to 89.",
          previousValue: 93,
          currentValue: 89,
          targetValue: 96,
          significance: 0.88,
          relevance: 0.95,
          urgency: 0.78,
          novelty: 1,
          actionability: 0.8,
          confidence: 0.9,
          evidence: Object.freeze(["Delivery 93 → 89"]),
          uncertainties: Object.freeze([]),
          nextStep: "Investigate capacity.",
        }),
      ],
    });
    if (result.nca5Strategy?.shouldInitiate) {
      assert.notEqual(result.nca6Strategy?.strategy.structure, "CRITICAL");
    }
    assert.equal(result.nca6Strategy?.commitsDecision, false);
  });

  it("X. Role does not alter truth", () => {
    const executive = run("What should I do?", undefined, {
      managerCommunicationContext: { role: "Executive" },
    });
    const operations = run("What should I do?", undefined, {
      managerCommunicationContext: { role: "Operations Manager" },
    });
    const finance = run("What should I do?", undefined, {
      managerCommunicationContext: { role: "Finance Manager" },
    });
    assert.equal(optionOf(executive), optionOf(operations));
    assert.equal(optionOf(executive), optionOf(finance));
    assert.equal(
      executive.nca4Strategy?.position.confidence.level,
      finance.nca4Strategy?.position.confidence.level,
    );
    assert.equal(
      executive.nca4Strategy?.position.recommendation.strength,
      operations.nca4Strategy?.position.recommendation.strength,
    );
  });

  it("Y. Object-generic adaptation — no role × object sentence matrix", () => {
    const source = readFileSync(join(here, "nexoraNca6CommunicationIntelligence.ts"), "utf8");
    assert.doesNotMatch(source, /executiveDeliveryResponse|financeCapacityResponse/);
    const quality = run("What should I do about Quality?");
    const inventory = run("What should I do about Inventory?");
    assert.equal(quality.nca6Strategy?.identity, getNexoraNca6Identity().id);
    assert.equal(inventory.nca6Strategy?.identity, getNexoraNca6Identity().id);
  });

  it("Z. Adapted response does not alter Decision or Execution state", () => {
    let previous = run("What should I do?");
    previous = run("Give me the short version.", previous);
    previous = run("I disagree. Permanent expansion is better.", previous);
    assert.equal(previous.nextDecisionSession, null);
    assert.equal(previous.nca6Strategy?.commitsDecision, false);
    assert.equal(previous.nca6Strategy?.startsExecution, false);
    assert.doesNotMatch(previous.response, /I approved it|I started execution/i);
  });

  it("trust invariant: depth and framing preserve recommendation, confidence, uncertainty, and authority", () => {
    const depths: CommunicationDepth[] = ["BRIEF", "STANDARD", "DETAILED"];
    const framings: CommunicationFraming[] = ["NEUTRAL", "EXECUTIVE", "OPERATIONS", "FINANCE"];
    const utterances: Record<CommunicationDepth, string> = {
      BRIEF: "Give me the short version.",
      STANDARD: "What should I do?",
      DETAILED: "Walk me through the reasoning.",
    };
    const roles: Partial<Record<CommunicationFraming, string>> = {
      EXECUTIVE: "Executive",
      OPERATIONS: "Operations Manager",
      FINANCE: "Finance Manager",
    };
    for (const depth of depths) {
      for (const framing of framings) {
        const strategy = adapt(utterances[depth], TRUTH, {
          role: roles[framing] ?? null,
        });
        const tokens = preservedTruthTokens(strategy.response ?? "");
        assert.equal(tokens.option, "temporary capacity", `${depth}/${framing}`);
        assert.ok(tokens.numbers.includes("91") || tokens.numbers.includes("91%"));
        assert.ok(tokens.numbers.includes("96") || tokens.numbers.includes("96%"));
        assert.equal(tokens.uncertaintyVisible, true, `${depth}/${framing}`);
        assert.equal(tokens.fabricatedApproval, false);
        assert.equal(tokens.fabricatedExecution, false);
        assert.equal(strategy.commitsDecision, false);
        assert.equal(strategy.startsExecution, false);
      }
    }
  });

  it("locked presentation is not rewritten", () => {
    const strategy = adapt("Give me the short version.");
    const locked = applyNca6StrategyToResponse({
      source: TRUTH,
      strategy,
      locked: true,
    });
    assert.equal(locked, TRUTH);
  });

  it("signals classify explicit depth without personality labels", () => {
    assert.equal(classifyCommunicationSignals("Give me the short version.").brief, true);
    assert.equal(classifyCommunicationSignals("Walk me through the reasoning.").detailed, true);
    const source = readFileSync(join(here, "nexoraNca6CommunicationIntelligence.ts"), "utf8");
    assert.doesNotMatch(source, /aggressive manager|type a personality|emotional manager/i);
  });
});
