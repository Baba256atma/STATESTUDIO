/**
 * NCA:7 — End-to-end conversation orchestration and final NCA certification.
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
  NEXORA_NCA7_BOUNDARY,
  composeNca7TurnResult,
  getNexoraNca7Identity,
  verifyNexoraNca7,
} from "./nexoraNca7EndToEndOrchestration.ts";

const here = dirname(fileURLToPath(import.meta.url));

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function subjects() {
  return Object.freeze([
    ...projectManagerObjectConversationalSubjects(catalog()),
    freezeConversationalSubjectRecord({
      subjectId: "obj-margin-nca7",
      subjectKind: "object",
      canonicalName: "Margin",
      aliases: Object.freeze(["Margin"]),
      businessKey: "obj-margin-nca7",
    }),
    freezeConversationalSubjectRecord({
      subjectId: "obj-risk-nca7",
      subjectKind: "object",
      canonicalName: "Risk",
      aliases: Object.freeze(["Risk"]),
      businessKey: "obj-risk-nca7",
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
    readonly managerCommunicationContext?: Parameters<
      typeof executeNexoraConversationalExperience
    >[0]["managerCommunicationContext"];
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
    messageIdSeed: `nca7-${utterance}`,
    initiativeSignals: extra?.initiativeSignals,
    managerCommunicationContext: extra?.managerCommunicationContext,
  });
}

function asked(result: ReturnType<typeof run>): boolean {
  const strategy = result.nca3Strategy as { shouldAsk?: boolean } | null;
  return Boolean(strategy?.shouldAsk);
}

function advised(result: ReturnType<typeof run>): boolean {
  const strategy = result.nca4Strategy as { shouldAdvise?: boolean } | null;
  return Boolean(strategy?.shouldAdvise);
}

function optionOf(result: ReturnType<typeof run>): string {
  const position = (
    result.nca4Strategy as {
      position?: { recommendation?: { optionLabel?: string } };
    } | null
  )?.position;
  return position?.recommendation?.optionLabel ?? "";
}

function subjectOf(result: ReturnType<typeof run>): string {
  const state = result.ncaConversationState as { activeSubject?: { name?: string } } | null;
  return state?.activeSubject?.name ?? result.nca7Turn?.dialogue.subject ?? "";
}

function initiated(result: ReturnType<typeof run>): boolean {
  const strategy = result.nca5Strategy as { shouldInitiate?: boolean } | null;
  return Boolean(strategy?.shouldInitiate);
}

function deliveryDrop(from: number, to: number, critical = false) {
  return createProactiveExecutiveSignal({
    id: `delivery:${from}:${to}:${critical ? "c" : "n"}`,
    family: "GOAL_DEVIATION",
    source: "caller",
    subjectId: "delivery",
    subjectLabel: "Delivery",
    observation: `Delivery moved from ${from} to ${to}.`,
    previousValue: from,
    currentValue: to,
    targetValue: 96,
    significance: Math.abs(from - to) >= 3 ? 0.88 : 0.12,
    relevance: 0.9,
    urgency: critical ? 0.95 : 0.55,
    novelty: 0.8,
    actionability: 0.7,
    confidence: 0.85,
    nextStep: "Investigate delivery pressure.",
    critical,
  });
}

function sourceHasExactSentence(file: string, sentence: string): boolean {
  const text = readFileSync(join(here, file), "utf8");
  return text.includes(`"${sentence}"`) || text.includes(`'${sentence}'`);
}

describe("NCA:7 End-to-End Conversation Orchestration", () => {
  it("identity does not create a seventh intelligence engine", () => {
    assert.equal(
      getNexoraNca7Identity().id,
      "NCA:7/EndToEndConversationOrchestrationFinalCertification",
    );
    assert.equal(NEXORA_NCA7_BOUNDARY.createsSeventhIntelligenceEngine, false);
    assert.equal(NEXORA_NCA7_BOUNDARY.usesLiveLlm, false);
    assert.equal(NEXORA_NCA7_BOUNDARY.hidesLowerLayerDefects, false);
    assert.equal(verifyNexoraNca7().ok, true);
  });

  it("Collision A: NCA:3 ask beats provisional NCA:4 advice", () => {
    const result = run("Should we permanently increase capacity?");
    assert.equal(asked(result), true);
    assert.equal(advised(result), false);
    assert.ok(String(result.nca7Turn?.authority.owner ?? "").includes("GAP"));
    assert.match(result.response, /\?/);
    assert.doesNotMatch(result.response, /\bI recommend\b/i);
  });

  it("Collision B: EXPLAIN beats moderate NCA:5 initiative", () => {
    const previous = run("Show Capacity Gap.");
    const result = run("Explain Inventory.", previous, {
      initiativeSignals: [deliveryDrop(95.2, 94.6)],
    });
    const interruption = (
      result.nca5Strategy as { decision?: { interruption?: { justified?: boolean } } } | null
    )?.decision;
    assert.equal(interruption?.interruption?.justified ?? false, false);
    assert.match(result.response, /Inventory/i);
    assert.doesNotMatch(result.response.slice(0, 48), /Before we continue/i);
  });

  it("Collision C: Decision confirmation beats moderate initiative", () => {
    const composed = composeNca7TurnResult({
      utterance: "Confirm.",
      response: "Please confirm this Decision before I commit it.",
      nca: { need: { family: "DECIDE" } },
      conversation: {},
      nca3: { shouldAsk: false },
      nca4: {
        shouldAdvise: true,
        position: { recommendation: { optionLabel: "temporary capacity" } },
      },
      nca5: {
        shouldInitiate: true,
        decision: { behavior: "SURFACE", interruption: { justified: false } },
      },
      nca6: { strategy: { depth: "STANDARD" } },
      decisionConfirmation: true,
    });
    assert.equal(composed.authority.owner, "DECISION_CONFIRMATION");
  });

  it("Collision D: material NCA:4 revision may be initiated", () => {
    let previous = run("What should I do?");
    previous = run(
      "We just signed an 18-month customer contract that keeps this demand level.",
      previous,
    );
    assert.match(previous.response, /changes my recommendation|now recommend|permanent/i);
  });

  it("Collision E: BRIEF still preserves uncertainty", () => {
    let previous = run("What should I do?");
    previous = run("Give me the short version.", previous);
    assert.match(
      previous.response,
      /uncertain|moderate|if demand|not certain|depends on whether demand/i,
    );
  });

  it("Collision F: locked entrance ownership is preserved", () => {
    const composed = composeNca7TurnResult({
      utterance: "Hi.",
      response: "Welcome. I can help you inspect Delivery, Capacity, and related decisions.",
      nca: { need: { family: "SOCIAL_CONVERSATION" } },
      conversation: {},
      nca3: { shouldAsk: false },
      nca4: { shouldAdvise: true },
      nca5: { shouldInitiate: true, decision: { interruption: { justified: false } } },
      nca6: { strategy: { depth: "STANDARD" } },
      locked: true,
      entranceOwned: true,
    });
    assert.equal(composed.authority.owner, "ENTRANCE");
  });

  it("Explain it keeps Capacity Gap", () => {
    let previous = run("Show Capacity Gap.");
    previous = run("Explain it.", previous);
    assert.match(subjectOf(previous), /Capacity Gap/i);
    assert.match(previous.response, /Capacity Gap/i);
    assert.doesNotMatch(previous.response, /\bI recommend\b/i);
  });

  it("short answer is not a new topic", () => {
    let previous = run("Should we permanently increase capacity?");
    previous = run("About three months.", previous);
    assert.doesNotMatch(previous.response, /new topic|unrelated object/i);
  });

  it("suspend and return restores Capacity", () => {
    let previous = run("Show Capacity Gap.");
    previous = run("What about Inventory?", previous);
    assert.match(subjectOf(previous), /Inventory/i);
    previous = run("Go back to Capacity.", previous);
    assert.match(subjectOf(previous), /Capacity/i);
  });

  it("conversation correction does not write business truth", () => {
    let previous = run("Show Capacity.");
    previous = run("No, I meant Capacity Gap, not Capacity.", previous);
    assert.match(subjectOf(previous), /Capacity Gap/i);
    assert.equal(previous.nca7Turn?.effects.writesBusinessTruth, false);
  });

  it("social turns do not commit Decision or Execution", () => {
    for (const utterance of ["Hi.", "Thanks.", "Okay."]) {
      const result = run(utterance);
      assert.equal(result.nca7Turn?.effects.commitsDecision, false);
      assert.equal(result.nca7Turn?.effects.startsExecution, false);
    }
  });

  it("unsupported capability is not fabricated", () => {
    const result = run("Find me the best supplier in Vancouver.");
    assert.doesNotMatch(result.response, /Acme Supplies|I found a supplier in Vancouver/i);
    assert.match(result.response, /can'?t|don't have|not available|can't search|cannot|don't search/i);
  });

  it("teaching Nexora is not a recommendation hijack", () => {
    const result = run("How do I use Nexora?");
    assert.doesNotMatch(result.response, /\bI recommend temporary capacity\b/i);
  });

  it("object-generic subjects remain generic", () => {
    for (const subject of ["Delivery", "Risk", "Inventory", "Margin"]) {
      const result = run(`What is ${subject}?`);
      assert.doesNotMatch(result.response, /explainDelivery|explainInventory|recommendInventory/i);
      assert.doesNotMatch(result.response, /I invented a ${subject} scenario/i);
    }
  });

  it("no demo sentence table in NCA:7", () => {
    assert.equal(sourceHasExactSentence("nexoraNca7EndToEndOrchestration.ts", "why that one"), false);
    assert.equal(sourceHasExactSentence("nexoraNca7EndToEndOrchestration.ts", "go back to capacity"), false);
  });

  it("main multi-turn manager conversation stays one Nexora", () => {
    let previous = run("Hi.");
    previous = run("What can you do for me?", previous);
    previous = run("I'm responsible for operations.", previous);
    previous = run("I need to improve delivery performance.", previous);
    previous = run("What does Delivery show?", previous);
    previous = run("What Capacity Gap?", previous);
    previous = run("Explain it.", previous);
    assert.match(subjectOf(previous), /Capacity/i);
    previous = run("Why is this happening?", previous);
    assert.doesNotMatch(previous.response, /definitely caused Delivery/i);
    previous = run("Should we permanently increase capacity?", previous);
    assert.equal(asked(previous), true);
    previous = run("Probably seasonal — around three months.", previous);
    previous = run("What do you recommend?", previous);
    const firstOption = optionOf(previous);
    previous = run("Why that one?", previous);
    if (firstOption) assert.match(previous.response, new RegExp(firstOption.slice(0, 8), "i"));
    previous = run("What's the downside?", previous);
    previous = run("Give me the short version.", previous);
    previous = run("Actually, explain the reasoning.", previous);
    previous = run("What about Inventory?", previous);
    previous = run("Go back to Capacity.", previous);
    assert.match(subjectOf(previous), /Capacity/i);
    previous = run("What would change your recommendation?", previous);
    previous = run(
      "We just signed an 18-month contract at this demand level.",
      previous,
    );
    assert.match(previous.response, /changes my recommendation|now recommend|revised|permanent/i);
    previous = run("I disagree. I still prefer temporary capacity.", previous);
    previous = run("Let's choose permanent capacity.", previous);
    assert.doesNotMatch(previous.response, /decision is approved/i);
    previous = run("Thanks.", previous);
    assert.doesNotMatch(previous.response, /NCA:3 is speaking|NCA:4 is speaking/i);
    assert.ok(previous.nca7Turn?.diagnosticTrace.includes("NCA:1"));
    assert.doesNotMatch(previous.response, /Need = |Authority NCA/);
  });

  it("non-happy path stays graceful", () => {
    let previous = run("Explain Risk.");
    previous = run("What does it affect?", previous);
    previous = run("Why?", previous);
    previous = run("I don't understand.", previous);
    previous = run("Explain it simply.", previous);
    previous = run("What about Inventory?", previous);
    previous = run("Continue where we were.", previous);
    previous = run("What should I do?", previous);
    previous = run("Not now.", previous);
    previous = run("Find me the best supplier in Vancouver.", previous);
    previous = run("Go back.", previous);
    previous = run("What were you recommending?", previous);
    previous = run("How sure are you?", previous);
    assert.doesNotMatch(previous.response, /I found a supplier/i);
    assert.doesNotMatch(previous.response, /decision is approved|execution started/i);
  });

  it("proactive path silences noise and can return on critical worsening", () => {
    const silent = run("", undefined, {
      initiativeSignals: [deliveryDrop(89.1, 89.0)],
    });
    assert.equal(initiated(silent), false);
    const material = run("", undefined, {
      initiativeSignals: [deliveryDrop(93, 89)],
    });
    assert.equal(initiated(material), true);
    const dismissed = run("Not now.", material);
    const same = run("", dismissed, {
      initiativeSignals: [deliveryDrop(93, 89)],
    });
    assert.equal(initiated(same), false);
    const critical = run("", dismissed, {
      initiativeSignals: [deliveryDrop(89, 82, true)],
    });
    assert.equal(initiated(critical), true);
  });

  it("trust path holds, stays, then revises without committing", () => {
    let previous = run("What should I do?");
    const first = optionOf(previous);
    previous = run("I disagree. I want permanent capacity.", previous);
    if (first) assert.equal(optionOf(previous).toLowerCase(), first.toLowerCase());
    previous = run("Labor cost is 8% higher than expected.", previous);
    if (first) assert.equal(optionOf(previous).toLowerCase(), first.toLowerCase());
    previous = run(
      "We just signed an 18-month customer contract that keeps this demand level.",
      previous,
    );
    if (first) assert.notEqual(optionOf(previous).toLowerCase(), first.toLowerCase());
    previous = run("Let's choose the other option anyway.", previous);
    assert.doesNotMatch(previous.response, /decision is approved/i);
  });

  it("communication adaptation preserves meaning", () => {
    const base = run("What should I do?");
    const option = optionOf(base);
    const brief = run("Give me the short version.", base);
    const detailed = run("Now walk me through it.", base);
    const exec = run("What should I do?", undefined, {
      managerCommunicationContext: { role: "Executive" },
    });
    const ops = run("What should I do?", undefined, {
      managerCommunicationContext: { role: "Operations" },
    });
    const finance = run("What should I do?", undefined, {
      managerCommunicationContext: { role: "Finance" },
    });
    const unknown = run("What should I do?", undefined, {
      managerCommunicationContext: { role: "Unknown" },
    });
    for (const result of [brief, detailed, exec, ops, finance, unknown]) {
      if (option) assert.match(result.response, new RegExp(option.slice(0, 8), "i"));
      assert.doesNotMatch(result.response, /decision is approved|execution started/i);
    }
  });

  it("turn contract is attached and diagnostic-only", () => {
    const result = run("What should I do?");
    assert.ok(result.nca7Turn);
    assert.equal(
      result.nca7Turn?.identity,
      "NCA:7/EndToEndConversationOrchestrationFinalCertification",
    );
    assert.equal(typeof result.nca7Turn?.diagnosticTrace, "string");
    assert.doesNotMatch(result.response, /Need = |Authority NCA/);
    assert.equal(result.nca7Turn?.effects.commitsDecision, false);
    assert.equal(result.nca7Turn?.effects.startsExecution, false);
  });
});
