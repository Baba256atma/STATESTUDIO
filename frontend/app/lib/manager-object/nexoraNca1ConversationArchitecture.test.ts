/**
 * NCA:1 — Manager Conversation Architecture tests A–L.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
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
  NEXORA_NCA1_BOUNDARY,
  getNexoraNca1Identity,
  refineOperationForManagerNeed,
  verifyNexoraNca1,
} from "./nexoraNca1ConversationArchitecture.ts";
import { interpretCanonicalManagerMeaning } from "./canonicalManagerMeaningInterpreter.ts";

const here = dirname(fileURLToPath(import.meta.url));

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function subjects() {
  return Object.freeze([
    ...projectManagerObjectConversationalSubjects(catalog()),
    freezeConversationalSubjectRecord({
      subjectId: "obj-profit-nca",
      subjectKind: "object",
      canonicalName: "Profit",
      aliases: Object.freeze(["Profit"]),
      businessKey: "obj-profit-nca",
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
    messageIdSeed: `nca1-${utterance}`,
  });
}

describe("NCA:1 Manager Conversation Architecture", () => {
  it("identity does not create a second engine", () => {
    assert.equal(
      getNexoraNca1Identity().id,
      "NCA:1/ManagerConversationArchitectureAdvisorBehaviorFoundation",
    );
    assert.equal(NEXORA_NCA1_BOUNDARY.createsSecondConversationEngine, false);
    assert.equal(NEXORA_NCA1_BOUNDARY.createsSecondAdvisor, false);
    assert.equal(NEXORA_NCA1_BOUNDARY.usesLiveLlm, false);
    assert.equal(verifyNexoraNca1().ok, true);
  });

  it("A. What Capacity Gap? is knowledge, not navigation", () => {
    const meaning = interpretCanonicalManagerMeaning({
      utterance: "What Capacity Gap?",
      subjects: subjects(),
    });
    assert.equal(meaning.requestedOperation, "EXPLAIN");
    assert.equal(meaning.objectReference?.canonicalName, "Capacity Gap");
    const result = run("What Capacity Gap?");
    assert.equal(result.ncaTurn.need.family, "UNDERSTAND");
    assert.ok(
      result.ncaTurn.advisorBehavior === "EXPLAIN" ||
        result.ncaTurn.advisorBehavior === "ANSWER",
    );
    assert.notEqual(result.intentResult.intent.kind, "focus");
    assert.doesNotMatch(result.response, /^Focused on /i);
    assert.match(result.response, /Capacity Gap/i);
  });

  it("B. Explain it keeps Capacity Gap", () => {
    let previous = run("What Capacity Gap?");
    previous = run("Explain it.", previous);
    assert.equal(previous.ncaTurn.reference.resolvedName, "Capacity Gap");
    assert.match(previous.response, /Capacity Gap/i);
    assert.doesNotMatch(previous.response, /^Focused on Capacity\.?$/i);
  });

  it("C. Show Delivery. Why? stays Delivery and does not invent cause", () => {
    let previous = run("Show Delivery.");
    previous = run("Why?", previous);
    assert.match(
      previous.ncaTurn.reference.resolvedName ?? "",
      /Delivery/i,
    );
    assert.doesNotMatch(previous.response, /\bis causing\b/i);
    assert.doesNotMatch(previous.response, /WATCH|canonical intent|resolver/i);
  });

  it("D. What should I do? guides from the active subject", () => {
    let previous = run("Show Delivery.");
    previous = run("What should I do?", previous);
    assert.ok(
      previous.ncaTurn.need.family === "REQUEST_RECOMMENDATION" ||
        previous.ncaTurn.need.family === "ORIENT",
    );
    assert.ok(
      previous.ncaTurn.advisorBehavior === "GUIDE" ||
        previous.ncaTurn.advisorBehavior === "RECOMMEND" ||
        previous.ncaTurn.advisorBehavior === "ANSWER",
    );
    assert.ok(previous.response.length > 12);
  });

  it("E. Should we increase capacity? asks one high-value question", () => {
    const result = run("Should we increase capacity?");
    assert.equal(result.ncaTurn.need.family, "EVALUATE");
    assert.equal(result.ncaTurn.advisorBehavior, "ASK");
    assert.equal(result.ncaTurn.knowledgeState.sufficient, false);
    assert.equal(
      (result.response.match(/\?/g) ?? []).length,
      1,
    );
    assert.match(result.response, /continue|demand/i);
  });

  it("F. Compare them uses existing scenario context rather than unknown failure", () => {
    const result = run("Compare them.");
    assert.equal(result.ncaTurn.need.family, "COMPARE");
    assert.doesNotMatch(result.response, /I don't understand/i);
    assert.ok(result.response.length > 8);
  });

  it("G. Show Delivery remains navigation", () => {
    const result = run("Show Delivery.");
    assert.equal(result.ncaTurn.need.family, "LOCATE");
    assert.equal(result.ncaTurn.advisorBehavior, "NAVIGATE");
    assert.match(
      result.nextRuntimeState.focusedSubject?.id ?? "",
      /delivery/i,
    );
  });

  it("H. How do I use Nexora? teaches", () => {
    const result = run("How do I use Nexora?");
    assert.ok(
      result.ncaTurn.need.family === "TEACH" ||
        result.ncaTurn.need.family === "ORIENT",
    );
    assert.ok(
      result.ncaTurn.advisorBehavior === "TEACH" ||
        result.ncaTurn.advisorBehavior === "GUIDE",
    );
    assert.match(result.response, /goal|outcome|speak naturally/i);
  });

  it("I. Thanks acknowledges and preserves context", () => {
    let previous = run("Show Delivery.");
    const focused = previous.nextRuntimeState.focusedSubject?.id;
    previous = run("Thanks.", previous);
    assert.equal(previous.ncaTurn.need.family, "SOCIAL_CONVERSATION");
    assert.equal(previous.ncaTurn.advisorBehavior, "ACKNOWLEDGE");
    assert.match(previous.response, /welcome|Understood/i);
    assert.equal(previous.nextRuntimeState.focusedSubject?.id, focused);
    assert.equal(previous.shouldCommitRuntime, false);
  });

  it("J. Unsupported supplier recommendation does not fabricate capability", () => {
    const result = run("Can you recommend a supplier?");
    assert.doesNotMatch(result.response, /I found a supplier|I'll email/i);
    assert.ok(result.response.length > 8);
  });

  it("K. Association is not confirmed causality", () => {
    let previous = run("Show Delivery.");
    previous = run("What might be causing it?", previous);
    assert.doesNotMatch(previous.response, /Capacity Gap caused/i);
    assert.equal(previous.ncaTurn.strategy.uncertainty != null, true);
  });

  it("L. Explain is object-generic", () => {
    const delivery = run("Explain Delivery.");
    const risk = run("Explain Risk.");
    const profit = run("Explain Profit.");
    assert.equal(delivery.ncaTurn.need.family, "UNDERSTAND");
    assert.equal(risk.ncaTurn.need.family, "UNDERSTAND");
    assert.equal(profit.ncaTurn.need.family, "UNDERSTAND");
    const source = readFileSync(
      join(here, "nexoraNca1ConversationArchitecture.ts"),
      "utf8",
    );
    assert.doesNotMatch(source, /if \(.*=== ["']Profit["']\)/);
    assert.doesNotMatch(source, /if \(.*=== ["']Delivery["']\)/);
    assert.equal(
      refineOperationForManagerNeed("what capacity gap", "FOCUS", true, "INTERROGATIVE"),
      "EXPLAIN",
    );
    assert.equal(
      refineOperationForManagerNeed("show delivery", "FOCUS", true, "IMPERATIVE"),
      "FOCUS",
    );
  });
});
