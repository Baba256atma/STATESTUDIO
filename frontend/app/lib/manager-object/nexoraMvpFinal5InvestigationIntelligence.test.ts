/**
 * NEX-MVP-FINAL:5 — multi-object executive investigation intelligence.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import {
  collectInvestigationCandidates,
} from "./executiveInvestigationComposer.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { NEXORA_MANAGER_ARCHITECTURE_LEAK } from "../nexora-entrance/nexoraMvpFinalCertification.ts";

const here = dirname(fileURLToPath(import.meta.url));
const LEAK =
  /CORE-INT|CC:9|EI:4|\bMO:|MISSING_|READY_FOR_|graph|node id|edge id/i;
const CAUSE_CLAIM =
  /is the cause|caused Delivery|confirmed cause of Delivery/i;

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
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nex-mvp-final5-${utterance}`,
  });
}

describe("NEX-MVP-FINAL:5 Executive Investigation Intelligence", () => {
  it("does not collapse Delivery why to a single confirmed cause", () => {
    const focused = run("show Delivery");
    const why = run("Why is Delivery below target?", focused);
    assert.match(why.response, /91%|96%|target/i);
    assert.match(why.response, /plausible explanation/i);
    assert.match(why.response, /confirmed cause/i);
    const candidates = collectInvestigationCandidates("obj-delivery");
    assert.ok(candidates.length >= 2, "expected a multi-object neighborhood");
    assert.doesNotMatch(why.response, CAUSE_CLAIM);
    assert.doesNotMatch(why.response, LEAK);
  });

  it("keeps the Delivery investigation after focusing Capacity", () => {
    let turn = run("show Delivery");
    turn = run("Why is Delivery below target?", turn);
    turn = run("show Capacity", turn);
    assert.equal(turn.managerObjectTurn.session.activeObjectId, "obj-capacity");
    assert.equal(
      turn.managerObjectTurn.session.investigationSubjectId,
      "obj-delivery",
    );
    turn = run("what else could explain it?", turn);
    assert.match(turn.response, /still Delivery|larger investigation is still Delivery/i);
    assert.doesNotMatch(turn.response, /not sure how that relates/i);
  });

  it("separates evidence, strength, manager-reported provenance, and recommendation uncertainty", () => {
    let turn = run("show Delivery");
    turn = run("Why is Delivery below target?", turn);
    turn = run("what could explain it?", turn);
    turn = run("what evidence supports Capacity?", turn);
    assert.match(turn.response, /candidate explanation|not a confirmed cause/i);
    assert.match(turn.response, /Capacity/i);
    turn = run("which explanation has stronger evidence?", turn);
    assert.match(
      turn.response,
      /stronger supporting evidence|does not justify ranking/i,
    );
    turn = run("Supplier delays increased last month.", turn);
    assert.match(turn.response, /manager-reported/i);
    turn = run("what don’t we know?", turn);
    assert.match(turn.response, /not have validated causal proof|do not have validated/i);
    turn = run("what do you recommend?", turn);
    assert.match(turn.response, /uncertainty|not yet establish|reducing that uncertainty/i);
    assert.doesNotMatch(turn.response, LEAK);
  });

  it("reopens a new investigation when the manager asks why on another object", () => {
    let turn = run("show Delivery");
    turn = run("Why is Delivery below target?", turn);
    turn = run("show risk", turn);
    turn = run("Why is Risk at risk?", turn);
    assert.equal(turn.managerObjectTurn.session.investigationSubjectId, "obj-risk");
    assert.match(turn.response, /Risk/i);
    assert.doesNotMatch(turn.response, /91% against a 96%/i);
  });

  it("generalizes to Risk without Delivery-specific conclusions", () => {
    let turn = run("show risk");
    turn = run("Why is Risk below target?", turn);
    assert.doesNotMatch(turn.response, /not sure how that relates/i);
    assert.doesNotMatch(turn.response, /Capacity Gap caused/i);
    turn = run("what could explain it?", turn);
    assert.match(turn.response, /plausible|remain|confirmed cause/i);
    assert.equal(turn.managerObjectTurn.session.investigationSubjectId, "obj-risk");
    assert.doesNotMatch(turn.response, /\bDelivery is currently 91%/i);
  });

  it("contains no object-name investigation branches", () => {
    const composer = readFileSync(
      join(here, "executiveInvestigationComposer.ts"),
      "utf8",
    );
    assert.doesNotMatch(composer, /if \(subjectId === ["']obj-delivery["']\)/);
    assert.doesNotMatch(composer, /cause = ["']Capacity/);
    assert.doesNotMatch(composer, /same period as the Delivery result/);
  });

  it("resolves why-is-below-target to Delivery", () => {
    const intent = resolveNexoraConversationalIntent({
      utterance: "Why is Delivery below target?",
    }).intent;
    assert.equal(intent.kind, "explain");
    assert.equal(intent.targetHints[0]?.raw, "delivery");
  });
});
