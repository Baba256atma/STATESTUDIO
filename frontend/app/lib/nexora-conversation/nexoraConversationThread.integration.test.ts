/**
 * NEX-CONV:2 — thread intelligence through educational conversation.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  isNexoraEntranceRestrained,
  projectNexoraEntranceCatalog,
} from "../nexora-entrance/nexoraEntranceExperience.ts";
import { conversationContinuityOf } from "../nexora-entrance/nexoraEntranceConversationContinuity.ts";
import {
  shouldNexoraGuidedEntranceOwnUtterance,
  withActiveNexoraGuidedEntrance,
} from "../nexora-entrance/nexoraGuidedEntranceExperience.ts";
import { objectEducationOf } from "../nexora-entrance/nexoraObjectEducationExperience.ts";
import { coverageOf } from "./nexoraConversationWorkingContext.ts";

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function guidedSession() {
  return withActiveNexoraGuidedEntrance(
    createNexoraEntranceSession({ workspaceResolution: "first-time" }),
  );
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session = previous?.nextEntranceSession ?? guidedSession();
  const catalog = isNexoraEntranceRestrained(session)
    ? projectNexoraEntranceCatalog(session)
    : getDefaultNexoraMVPObjectInteractionCatalog();
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: projectManagerObjectConversationalSubjects(catalog),
    runtimeState:
      previous?.nextRuntimeState ?? applyEntranceCenterSubject(initialState(), session),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    previousEntranceSession: session,
    messageIdSeed: `nex-conv2-${utterance}`,
  });
}

function atGoal() {
  return run("Show me the next one", run("Show me how focus works", run("Show me")));
}

function assertNoWrites(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  const session = result.nextEntranceSession;
  assert.equal(session?.goalDiscovery, null);
  assert.equal(session?.decisionExperience, null);
  assert.equal(session?.executionPlanning, null);
  assert.equal(session?.outcomeMonitoring, null);
  assert.equal(session?.learningReassessment, null);
}

function labels(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  return (result.nexoraMessage.suggestedActions ?? []).map((action) => action.label);
}

describe("NEX-CONV:2 educational thread progression", () => {
  it("the observed Goal sequence ends in thread-aware progression, not a clarification loop", () => {
    const goal = atGoal();
    const t1 = run("What is this?", goal);
    const t2 = run("What is this?", t1);
    const t3 = run("What is this?", t2);
    const why1 = run("Why is it on Stage?", t3);
    const t4 = run("What is this?", why1);
    const why2 = run("Why is it on Stage?", t4);
    const t5 = run("What is this?", why2);
    const compare = run("What's the difference?", t5);
    const t6 = run("What is this?", compare);
    assert.match(t1.nexoraMessage.text, /that.s a goal/i);
    assert.match(t3.nexoraMessage.text, /differ|next object/i);
    assert.doesNotMatch(t6.nexoraMessage.text, /I may not be answering the part you mean/);
    assert.match(t6.nexoraMessage.text, /we've covered|we can look/i);
    assert.equal(objectEducationOf(t6.nextEntranceSession).state, "GOAL");
    const working = conversationContinuityOf(t6.nextEntranceSession).working;
    assert.ok(coverageOf(working, "obj-nex-ent3-goal", "IDENTIFY") !== "NONE");
    assert.ok(coverageOf(working, "obj-nex-ent3-goal", "WHY_PRESENT") !== "NONE");
    assert.ok(coverageOf(working, "obj-nex-ent3-goal", "COMPARE") !== "NONE");
    assert.equal(working.lastThreadDecision?.turnMove, "CLARIFY");
    assert.notEqual(working.lastThreadDecision?.resolvedMove, "CLARIFY");
    assert.equal(t6.conversationThread?.objective, "UNDERSTAND_SUBJECT");
    assertNoWrites(t6);
  });

  it("suggested actions evolve as purposes are covered", () => {
    const afterIdentify = run("What is this?", atGoal());
    assert.ok(labels(afterIdentify).includes("Why is it on Stage?"));
    const afterWhy = run("Why is it on Stage?", afterIdentify);
    assert.equal(labels(afterWhy).includes("Why is it on Stage?"), false);
    const afterCompare = run("What's the difference?", afterWhy);
    assert.equal(labels(afterCompare).includes("What’s the difference?"), false);
    assert.ok(labels(afterCompare).includes("Show me the next one"));
    assert.ok(labels(afterCompare).includes("Skip"));
  });

  it("KPI transition starts a fresh IDENTIFY thread and keeps Goal coverage", () => {
    let cursor = atGoal();
    cursor = run("What is this?", cursor);
    cursor = run("Why is it on Stage?", cursor);
    cursor = run("What's the difference?", cursor);
    const kpi = run("Show me the next one", cursor);
    const first = run("What is this?", kpi);
    assert.match(first.nexoraMessage.text, /kpi/i);
    assert.doesNotMatch(first.nexoraMessage.text, /may not be answering/i);
    const working = conversationContinuityOf(first.nextEntranceSession).working;
    assert.equal(working.conversationThread?.primarySubject, "obj-nex-ent3-kpi");
    assert.ok(coverageOf(working, "obj-nex-ent3-goal", "IDENTIFY") !== "NONE");
    const difference = run("What's the difference?", first);
    assert.match(difference.nexoraMessage.text, /goal|kpi/i);
    assertNoWrites(difference);
  });

  it("the same thread architecture handles Problem through Outcome without per-object engines", () => {
    const kinds = [
      ["Show me the next one", /kpi/i],
      ["Show me the next one", /problem/i],
      ["Show me the next one", /scenario/i],
      ["Show me the next one", /decision/i],
      ["Show me the next one", /execution/i],
      ["Show me the next one", /outcome/i],
    ] as const;
    let cursor = atGoal();
    for (const [, identity] of kinds) {
      cursor = run("Show me the next one", cursor);
      const first = run("What is this?", cursor);
      const second = run("What is this?", first);
      assert.match(first.nexoraMessage.text, identity);
      assert.notEqual(second.nexoraMessage.text, first.nexoraMessage.text);
      assertNoWrites(second);
    }
  });

  it("Continue on Decision education does not write a Decision or Execution", () => {
    let cursor = atGoal();
    for (let index = 0; index < 4; index += 1) {
      cursor = run("Show me the next one", cursor);
    }
    assert.equal(objectEducationOf(cursor.nextEntranceSession).state, "DECISION");
    const continued = run("Continue.", run("Tell me more.", run("Explain this Decision.", cursor)));
    assert.equal(continued.nextEntranceSession?.decisionExperience, null);
    assert.equal(continued.nextEntranceSession?.executionPlanning, null);
  });

  it("Skip supersedes educational thread guidance", () => {
    const skipped = run("Skip this", atGoal());
    assert.equal(objectEducationOf(skipped.nextEntranceSession).state, "SKIPPED");
    const actions = labels(skipped);
    assert.equal(actions.includes("Show me the next one"), false);
    assertNoWrites(skipped);
  });

  it("does not own collection ranking", () => {
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(atGoal().nextEntranceSession, "Show problems"),
      false,
    );
  });

  it("that's not what I mean still clarifies after coverage", () => {
    let cursor = atGoal();
    cursor = run("What is this?", cursor);
    cursor = run("Why is it on Stage?", cursor);
    cursor = run("What's the difference?", cursor);
    const clarified = run("That's not what I mean.", cursor);
    assert.match(clarified.nexoraMessage.text, /may not be answering/i);
  });

  it("explicit repeat still returns the previous educational copy", () => {
    const first = run("What is this?", atGoal());
    const repeated = run("Repeat exactly.", first);
    assert.equal(repeated.nexoraMessage.text, first.nexoraMessage.text);
  });
});
