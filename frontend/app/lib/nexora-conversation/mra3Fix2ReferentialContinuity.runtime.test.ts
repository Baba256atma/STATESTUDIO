import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { interpretCanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaningInterpreter.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function overview() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(utterance: string, previous?: Turn): Turn {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState: previous?.nextRuntimeState ?? overview(),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `mra-3-fix2-${utterance}`,
  });
}

describe("MRA:3-FIX2 referential continuity and clarification", () => {
  it("unseen referential continuations keep the named object", () => {
    let turn = run("Show Delivery.");
    for (const utterance of [
      "tell me more about that",
      "what is happening with it?",
      "why is that important?",
      "what do we know about this one?",
    ]) {
      turn = run(utterance, turn);
      assert.equal(
        turn.contextualManagerMeaning.objectReference?.canonicalName,
        "Delivery",
        utterance,
      );
      assert.notEqual(turn.clarificationTurn.action, "clarify", utterance);
    }
  });

  it("look at capcity prefers the active Problem over the Capacity KPI", () => {
    const listed = run("What are the main problems?");
    const typo = run("look at capcity", listed);
    assert.equal(
      typo.contextualManagerMeaning.objectReference?.canonicalName,
      "Capacity Gap",
    );
    assert.match(typo.response, /Capacity Gap/i);
    assert.doesNotMatch(typo.response, /^Focused on Capacity\./);
    assert.equal(typo.intentResult.intent.kind, "focus");
  });

  it("look at demnd prefers Demand Surge over similarly named siblings after Scenarios", () => {
    const listed = run("show me scenarios");
    const typo = run("look at demnd", listed);
    assert.equal(
      typo.contextualManagerMeaning.objectReference?.canonicalName,
      "Demand Surge",
    );
    assert.match(typo.response, /Demand Surge/i);
  });

  it("pending clarification does not consume Explain that as proceed", () => {
    let turn = run("Show Delivery.");
    turn = run("Show Capacity.", turn);
    turn = run("Explain that.", turn);
    assert.equal(turn.clarificationTurn.action, "clarify");
    const follow = run("Explain that.", turn);
    assert.notEqual(follow.intentResult.intent.kind, "unknown");
    assert.equal(follow.naturalLanguageUnderstanding.requestedOperation, "EXPLAIN");
    assert.notEqual(follow.clarificationTurn.action, "resume");
  });

  it("Risk proposal then Explain that does not confirm mutation", () => {
    const proposed = run("Add this as a Risk.");
    const changed = run("show me problems", proposed);
    const explain = run("Explain that.", changed);
    assert.doesNotMatch(explain.response, /has been added as a Risk/i);
  });

  it("Risk proposal then yes does not silently write an unnamed Risk", () => {
    const proposed = run("Add this as a Risk.");
    const yes = run("yes", proposed);
    assert.doesNotMatch(yes.response, /has been added as a Risk/i);
  });

  it("explicit Capacity still outranks stale Problem context", () => {
    const listed = run("show me problems");
    const named = run("look at Capacity", listed);
    assert.equal(
      named.contextualManagerMeaning.objectReference?.canonicalName,
      "Capacity",
    );
  });

  it("Sequence A: Problems then named Problem then return then Explain it", () => {
    const listed = run("show me problems");
    const named = run("Capacity Gap", listed);
    const other = run("Explain Delivery.", named);
    const back = run("go back to the first problem", other);
    const explained = run("Explain it", back);
    assert.match(explained.response, /Capacity Gap/i);
    assert.equal(explained.contextualManagerMeaning.requestedOperation, "EXPLAIN");
  });

  it("Sequence B: compare then second one then What's going on with that?", () => {
    const listed = run("show me scenarios");
    const compared = run("compare them", listed);
    const second = run("explain the second one", compared);
    assert.match(second.response, /Demand Surge/i);
    const goingOn = run("What's going on with that?", second);
    assert.match(goingOn.response, /Demand Surge/i);
    assert.equal(goingOn.contextualManagerMeaning.requestedOperation, "EXPLAIN");
  });

  it("Sequence C: pending clarification then Explain that stays referential", () => {
    let turn = run("Show Delivery.");
    turn = run("Show Capacity.", turn);
    turn = run("Explain that.", turn);
    assert.equal(turn.clarificationTurn.action, "clarify");
    const follow = run("Explain that.", turn);
    assert.equal(follow.naturalLanguageUnderstanding.requestedOperation, "EXPLAIN");
    assert.notEqual(follow.clarificationTurn.action, "resume");
  });

  it("isolated NLU may still pick the exact-stem object when no conversational context exists", () => {
    const meaning = interpretCanonicalManagerMeaning({
      utterance: "look at capcity",
      subjects,
    });
    assert.equal(meaning.objectReference?.canonicalName, "Capacity");
    assert.ok(meaning.ambiguity.candidates.length >= 2);
  });
});
