/**
 * NEX-MVP-FINAL:4 — investigation → do-nothing scenario continuity.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import {
  isNoActionConsequenceUtterance,
  normalizeNexoraConversationalUtterance,
} from "../conversational-control/conversationalIntentNormalization.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { NEXORA_MANAGER_ARCHITECTURE_LEAK } from "../nexora-entrance/nexoraMvpFinalCertification.ts";

const here = dirname(fileURLToPath(import.meta.url));
const LEAK =
  /scenario intent detected|current subject|active context|scenario authority|EI:4|CC:9|\bMO:|MISSING_GOAL|READY_FOR_SCENARIO|insufficient runtime binding|Try asking me to explain the situation/i;

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: projectManagerObjectConversationalSubjects(catalog()),
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
    messageIdSeed: `nex-mvp-final4-${utterance}`,
  });
}

describe("NEX-MVP-FINAL:4 Executive Investigation Continuity", () => {
  it("assigns no-action family to explore-scenario, not unknown", () => {
    const phrases = [
      "What happens if we ignore it?",
      "What if we ignore it?",
      "What if we do nothing?",
      "What happens if we do nothing?",
      "What if I leave it alone?",
      "What happens if we don’t act?",
      "What if we don’t fix this?",
      "What happens if this continues?",
      "What happens if we wait?",
      "What is the risk of doing nothing?",
      "What if we take no action?",
    ];
    for (const phrase of phrases) {
      const normalized = normalizeNexoraConversationalUtterance(phrase);
      assert.equal(isNoActionConsequenceUtterance(normalized), true, phrase);
      const intent = resolveNexoraConversationalIntent({ utterance: phrase }).intent;
      assert.equal(intent.kind, "explore-scenario", phrase);
      assert.equal(intent.scenarioPayload?.operation, "do-nothing", phrase);
    }
  });

  it("Risk investigation continues through ignore, options, compare, recommend", () => {
    let turn = run("show risk");
    // NCA-POST collection truth may present the one-member Risk collection directly.
    assert.match(turn.response, /Focused on Risk|Current Risks?: Risk|Showing problems for Risk/i);
    turn = run("explain it.", turn);
    assert.match(turn.response, /Risk/i);
    turn = run("why?", turn);
    assert.match(turn.response, /Risk|Margin Pressure/i);
    turn = run("What does it affect?", turn);
    assert.match(turn.response, /associated with|may affect/i);
    assert.doesNotMatch(turn.response, /Delivery is causing Risk/i);
    turn = run("What happens if we ignore it?", turn);
    assert.equal(turn.intentResult.intent.kind, "explore-scenario");
    assert.equal(
      turn.managerObjectTurn.session.activeObjectId ??
        turn.nextRuntimeState.focusedSubject?.id,
      "obj-risk",
    );
    assert.doesNotMatch(turn.response, /not sure how that relates/i);
    assert.match(turn.response, /scenario rather than a prediction/i);
    assert.doesNotMatch(turn.response, /\b20%\b|\bincrease by\b/i);
    assert.doesNotMatch(turn.response, LEAK);
    turn = run("What are my options?", turn);
    assert.doesNotMatch(turn.response, /not sure how that relates/i);
    assert.match(turn.response, /Do Nothing|Investigate|compare|option/i);
    turn = run("Compare them.", turn);
    assert.match(turn.response, /Comparison|trade-off|aligns|evidence/i);
    turn = run("Which is safer?", turn);
    assert.doesNotMatch(turn.response, /not sure how that relates/i);
    turn = run("Which better supports my goal?", turn);
    assert.doesNotMatch(turn.response, /not sure how that relates/i);
    turn = run("What do you recommend?", turn);
    assert.doesNotMatch(turn.response, /not sure how that relates/i);
    const decide = run("Let's do that.", turn);
    assert.notEqual(decide.intentResult.intent.kind, "unknown");
    assert.doesNotMatch(decide.response, /Approved decision/i);
    assert.match(
      decide.response,
      /confirm|preference|not a Decision|which option/i,
    );
  });

  it("does not hard-code a Risk ignore branch", () => {
    const resolver = readFileSync(
      join(here, "../conversational-control/conversationalIntentResolver.ts"),
      "utf8",
    );
    const orchestrator = readFileSync(
      join(here, "../conversational-control/conversationalExperienceOrchestrator.ts"),
      "utf8",
    );
    assert.doesNotMatch(
      resolver,
      /if \(.*Risk.*ignore it/i,
    );
    assert.doesNotMatch(orchestrator, /obj-risk.*ignore/);
  });

  it("works for Delivery, Capacity, and Margin Pressure", () => {
    for (const [show, ignore] of [
      ["show Delivery", "What happens if we ignore it?"],
      ["show Capacity", "What if we do nothing?"],
      ["show Margin Pressure", "What happens if this continues?"],
    ] as const) {
      const focused = run(show);
      const consequence = run(ignore, focused);
      assert.equal(consequence.intentResult.intent.kind, "explore-scenario", show);
      assert.doesNotMatch(consequence.response, /not sure how that relates/i);
      assert.match(consequence.response, /scenario rather than a prediction/i);
    }
  });

  it("keeps architecture leaks out of manager copy", () => {
    let turn = run("show risk");
    turn = run("What happens if we ignore it?", turn);
    assert.doesNotMatch(turn.response, NEXORA_MANAGER_ARCHITECTURE_LEAK);
    assert.doesNotMatch(turn.response, LEAK);
  });
});
