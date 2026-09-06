/**
 * NEX-CONV:1 — educational Goal/Why progression through the Conversation Kernel.
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
    messageIdSeed: `nex-conv1-${utterance}`,
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
}

describe("NEX-CONV:1 educational progression", () => {
  it("repeated What is this? on Goal answers, deepens, offers, then clarifies", () => {
    const goal = atGoal();
    const t1 = run("What is this?", goal);
    const t2 = run("What is this?", t1);
    const t3 = run("What is this?", t2);
    const t4 = run("What is this?", t3);
    const t5 = run("What is this?", t4);
    assert.match(t1.nexoraMessage.text, /that.s a goal/i);
    assert.match(t2.nexoraMessage.text, /in practice/i);
    assert.notEqual(t2.nexoraMessage.text, t1.nexoraMessage.text);
    assert.match(t3.nexoraMessage.text, /differ|next object/i);
    assert.match(t4.nexoraMessage.text, /may not be answering/i);
    assert.equal(t5.nexoraMessage.text, t4.nexoraMessage.text);
    assert.equal(objectEducationOf(t5.nextEntranceSession).state, "GOAL");
    assert.equal(
      coverageOf(
        conversationContinuityOf(t5.nextEntranceSession).working,
        "obj-nex-ent3-goal",
        "IDENTIFY",
      ),
      "SATURATED",
    );
    assert.equal(t3.conversationKernel?.move === "CONNECT" || t3.conversationKernel?.move === "OFFER_NEXT", true);
    assertNoWrites(t5);
  });

  it("repeated Why is it on Stage? progresses without an identical loop", () => {
    const t1 = run("Why is it on Stage?", atGoal());
    const t2 = run("Why is it on Stage?", t1);
    const t3 = run("Why is it on Stage?", t2);
    const t4 = run("Why is it on Stage?", t3);
    assert.match(t1.nexoraMessage.text, /on Stage because it matters/i);
    assert.notEqual(t2.nexoraMessage.text, t1.nexoraMessage.text);
    assert.notEqual(t4.nexoraMessage.text, t1.nexoraMessage.text);
    assert.match(t4.nexoraMessage.text, /may not be answering|compare|next object/i);
  });

  it("the same generic policy handles KPI, Problem, Scenario, Decision, Execution, Outcome", () => {
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
      assert.match(cursor.nexoraMessage.text, identity);
      const first = run("What is this?", cursor);
      const second = run("What is this?", first);
      assert.match(first.nexoraMessage.text, /in practice/i);
      assert.notEqual(second.nexoraMessage.text, first.nexoraMessage.text);
      assert.notEqual(second.nexoraMessage.text, cursor.nexoraMessage.text);
      assertNoWrites(second);
    }
  });

  it("subject change and purpose change do not inherit saturation", () => {
    let cursor = atGoal();
    cursor = run("What is this?", cursor);
    cursor = run("What is this?", cursor);
    cursor = run("What is this?", cursor);
    cursor = run("What is this?", cursor);
    const why = run("Why is it here?", cursor);
    assert.match(why.nexoraMessage.text, /on Stage because it matters/i);
    const next = run("Show me the next one", run("Show me the next one", why));
    const problem = run("What is this?", next);
    assert.match(problem.nexoraMessage.text, /problem/i);
    assert.doesNotMatch(problem.nexoraMessage.text, /may not be answering/i);
  });

  it("semantic equivalents share IDENTIFY progression", () => {
    const t1 = run("What is this?", atGoal());
    const t2 = run("Explain it.", t1);
    const t3 = run("Tell me more.", t2);
    assert.match(t2.nexoraMessage.text, /in practice/i);
    assert.match(t3.nexoraMessage.text, /differ|next object/i);
  });

  it("explicit repeat then tell me more returns to progression", () => {
    const first = run("What is this?", atGoal());
    const repeated = run("Repeat exactly.", first);
    assert.equal(repeated.nexoraMessage.text, first.nexoraMessage.text);
    const more = run("Tell me more.", repeated);
    assert.notEqual(more.nexoraMessage.text, first.nexoraMessage.text);
  });

  it("clarification after saturation can resolve to why", () => {
    let cursor = atGoal();
    cursor = run("What is this?", cursor);
    cursor = run("What is this?", cursor);
    cursor = run("What is this?", cursor);
    cursor = run("What is this?", cursor);
    const resolved = run("I mean why it matters.", cursor);
    assert.match(resolved.nexoraMessage.text, /on Stage|present in this lesson/i);
  });

  it("Continue does not approve a Decision", () => {
    let cursor = atGoal();
    for (let index = 0; index < 4; index += 1) {
      cursor = run("Show me the next one", cursor);
    }
    assert.equal(objectEducationOf(cursor.nextEntranceSession).state, "DECISION");
    const explained = run("Explain this Decision.", cursor);
    const more = run("Tell me more.", explained);
    const continued = run("Continue.", more);
    assert.equal(continued.nextEntranceSession?.decisionExperience, null);
    assert.equal(continued.nextEntranceSession?.executionPlanning, null);
    assert.doesNotMatch(continued.nexoraMessage.text, /committed for you/i);
  });

  it("does not own collection questions", () => {
    const goal = atGoal();
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(goal.nextEntranceSession, "Show problems"),
      false,
    );
  });
});
