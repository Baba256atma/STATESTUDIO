/**
 * NEX-CONV:2-FIX2 — action-result subject transition and response parity.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

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
import { withActiveNexoraGuidedEntrance } from "../nexora-entrance/nexoraGuidedEntranceExperience.ts";
import {
  objectEducationOf,
  resolveNexoraObjectEducationTurn,
} from "../nexora-entrance/nexoraObjectEducationExperience.ts";
import { freezeConversationActionResult } from "./nexoraConversationActionResult.ts";
import { reconcileConversationAfterAction } from "./nexoraConversationActionReconcile.ts";
import { coverageOf, emptyNexoraConversationWorkingContext } from "./nexoraConversationWorkingContext.ts";
import { resolveConversationalMove } from "./nexoraConversationPolicy.ts";
import { recordConversationKernelDecision } from "./nexoraConversationWorkingContext.ts";

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
    messageIdSeed: `nex-conv2-fix2-${utterance}`,
  });
}

function atGoal() {
  return run("Show me the next one", run("Show me how focus works", run("Show me")));
}

function coveredGoal() {
  return run(
    "What's the difference?",
    run("Why is it on Stage?", run("What is this?", atGoal())),
  );
}

function labels(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  return (result.nexoraMessage.suggestedActions ?? []).map((action) => action.label);
}

function workingOf(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  return conversationContinuityOf(result.nextEntranceSession).working;
}

describe("NEX-CONV:2-FIX2 action-result subject parity", () => {
  it("reconcile uses resulting subject after success and keeps the old subject on failure", () => {
    const compare = resolveConversationalMove({
      meaning: null,
      subjectId: "obj-nex-ent3-goal",
      purpose: "COMPARE",
      coverage: "NONE",
      previousMove: null,
      lastCapabilityRequest: "COMPARE",
      lastCapabilityResult: "NONE",
      capabilities: Object.freeze({
        show: false,
        compare: true,
        investigate: false,
        offerNext: true,
        connect: true,
      }),
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
    });
    const previous = recordConversationKernelDecision(
      emptyNexoraConversationWorkingContext(),
      compare,
      {
        pendingOffer: Object.freeze({
          capability: "COMPARE",
          subjectId: "obj-nex-ent3-goal",
          purpose: "COMPARE",
        }),
      },
    );
    const failed = reconcileConversationAfterAction({
      previous,
      result: freezeConversationActionResult({
        requestedCapability: "NEXT",
        status: "UNAVAILABLE",
        previousSubjectId: "obj-nex-ent3-goal",
        resultingSubjectId: "obj-nex-ent3-goal",
        owner: "NEX-ENT:3/ObjectLanguageEducation",
        lessonBefore: "GOAL",
        lessonAfter: "GOAL",
      }),
      establishIdentifyCoverage: true,
    });
    assert.equal(failed.working.lastDecision?.subjectId, "obj-nex-ent3-goal");
    assert.equal(failed.working.pendingOffer?.capability, "COMPARE");
    const succeeded = reconcileConversationAfterAction({
      previous,
      result: freezeConversationActionResult({
        requestedCapability: "NEXT",
        status: "SUCCEEDED",
        previousSubjectId: "obj-nex-ent3-goal",
        resultingSubjectId: "obj-nex-ent3-kpi",
        owner: "NEX-ENT:3/ObjectLanguageEducation",
        lessonBefore: "GOAL",
        lessonAfter: "KPI",
      }),
      relatedSubjects: Object.freeze(["obj-nex-ent3-goal"]),
      establishIdentifyCoverage: true,
    });
    assert.equal(succeeded.turn?.subjectId, "obj-nex-ent3-kpi");
    assert.equal(succeeded.turn?.purpose, "IDENTIFY");
    assert.notEqual(succeeded.turn?.purpose, "COMPARE");
    assert.equal(succeeded.working.pendingOffer, null);
    assert.equal(succeeded.working.conversationThread?.primarySubject, "obj-nex-ent3-kpi");
    assert.ok(coverageOf(succeeded.working, "obj-nex-ent3-kpi", "IDENTIFY") !== "NONE");
    assert.ok(coverageOf(succeeded.working, "obj-nex-ent3-goal", "COMPARE") !== "NONE");
  });

  it("Goal → KPI same-turn response and chips follow the KPI result, not COMPARE copy", () => {
    const before = coveredGoal();
    assert.equal(objectEducationOf(before.nextEntranceSession).state, "GOAL");
    const compareText = before.nexoraMessage.text;
    const kpi = run("Show me the next one", before);
    assert.equal(objectEducationOf(kpi.nextEntranceSession).state, "KPI");
    assert.equal(kpi.nextRuntimeState.focusedSubject?.id, "obj-nex-ent3-kpi");
    assert.equal(workingOf(kpi).conversationThread?.primarySubject, "obj-nex-ent3-kpi");
    assert.equal(workingOf(kpi).lastDecision?.subjectId, "obj-nex-ent3-kpi");
    assert.equal(workingOf(kpi).lastActionResult?.status, "SUCCEEDED");
    assert.equal(workingOf(kpi).lastActionResult?.resultingSubjectId, "obj-nex-ent3-kpi");
    assert.notEqual(kpi.nexoraMessage.text, compareText);
    assert.match(kpi.nexoraMessage.text, /kpi/i);
    assert.doesNotMatch(kpi.nexoraMessage.text, /A Goal is the direction; a KPI is how we observe performance/i);
    assert.ok(labels(kpi).some((item) => /why is it on stage|difference|next one|skip/i.test(item)));
    assert.equal(labels(kpi).some((item) => /next one/i.test(item)), true);
    assert.equal(kpi.nextEntranceSession?.decisionExperience, null);
    assert.equal(kpi.nextEntranceSession?.goalDiscovery, null);
  });

  it("immediate What is this? after KPI intro deepens instead of repeating or skipping twice", () => {
    const kpi = run("Show me the next one", coveredGoal());
    const first = run("What is this?", kpi);
    const second = run("What is this?", first);
    assert.match(first.nexoraMessage.text, /kpi/i);
    assert.notEqual(first.nexoraMessage.text, kpi.nexoraMessage.text);
    assert.notEqual(second.nexoraMessage.text, first.nexoraMessage.text);
    assert.equal(coverageOf(workingOf(kpi), "obj-nex-ent3-kpi", "IDENTIFY"), "INTRODUCTORY");
    assert.notEqual(coverageOf(workingOf(first), "obj-nex-ent3-kpi", "IDENTIFY"), "INTRODUCTORY");
  });

  it("KPI → Issue and Issue → Scenario keep the same lifecycle", () => {
    const cursor = run("Show me the next one", coveredGoal());
    const issue = run("Show me the next one", cursor);
    assert.equal(objectEducationOf(issue.nextEntranceSession).state, "ISSUE");
    assert.match(issue.nexoraMessage.text, /problem/i);
    assert.equal(workingOf(issue).conversationThread?.primarySubject, "obj-nex-ent3-problem");
    const scenario = run("Show me the next one", issue);
    assert.equal(objectEducationOf(scenario.nextEntranceSession).state, "SCENARIO");
    assert.match(scenario.nexoraMessage.text, /scenario/i);
    const asked = run("What is this?", scenario);
    assert.match(asked.nexoraMessage.text, /scenario/i);
    assert.doesNotMatch(asked.nexoraMessage.text, /that.s a kpi/i);
  });

  it("repeated NEXT transitions once per successful action", () => {
    const first = run("Show me the next one", atGoal());
    const second = run("Show me the next one", first);
    assert.equal(objectEducationOf(first.nextEntranceSession).state, "KPI");
    assert.equal(objectEducationOf(second.nextEntranceSession).state, "ISSUE");
    assert.notEqual(first.nexoraMessage.text, second.nexoraMessage.text);
  });

  it("chip utterance and free-text NEXT share one ENT owner path", () => {
    const typed = run("Show me the next one", coveredGoal());
    const equivalent = run("what next", coveredGoal());
    assert.equal(objectEducationOf(typed.nextEntranceSession).state, "KPI");
    assert.equal(objectEducationOf(equivalent.nextEntranceSession).state, "KPI");
    const source = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../nexora-entrance/nexoraObjectEducationExperience.ts"),
      "utf8",
    );
    assert.match(source, /reconcileConversationAfterAction/);
    assert.doesNotMatch(source, /if \(text === "Show me the next one"\)/);
    assert.doesNotMatch(source, /if \(currentObject === "GOAL"/);
  });

  it("unavailable NEXT does not optimistically change subject", () => {
    let review = atGoal();
    for (let index = 0; index < 7; index += 1) {
      review = run("Show me the next one", review);
    }
    assert.equal(objectEducationOf(review.nextEntranceSession).state, "REVIEW");
    const completed = resolveNexoraObjectEducationTurn({
      utterance: "Show me the next one",
      session: review.nextEntranceSession!,
      runtimeState: review.nextRuntimeState,
    });
    const failed = resolveNexoraObjectEducationTurn({
      utterance: "Show me the next one",
      session: completed.session,
      runtimeState: completed.nextRuntimeState,
    });
    assert.equal(objectEducationOf(completed.session).state, "COMPLETED");
    assert.equal(objectEducationOf(failed.session).state, "COMPLETED");
    assert.equal(
      conversationContinuityOf(failed.session).working.lastActionResult?.status,
      "UNAVAILABLE",
    );
    assert.match(failed.response, /can’t show the next object|can't show the next object/i);
    assert.equal(
      failed.nextRuntimeState.focusedSubject?.id,
      completed.nextRuntimeState.focusedSubject?.id,
    );
  });

  it("stale COMPARE offer is superseded by successful NEXT", () => {
    const before = coveredGoal();
    assert.match(before.nexoraMessage.text, /Goal is the direction/i);
    const kpi = run("Show me the next one", before);
    assert.equal(workingOf(kpi).pendingOffer, null);
    assert.notEqual(workingOf(kpi).lastDecision?.purpose, "COMPARE");
    const compare = run("What's the difference?", kpi);
    assert.match(compare.nexoraMessage.text, /kpi/i);
    assert.equal(workingOf(compare).conversationThread?.primarySubject, "obj-nex-ent3-kpi");
  });

  it("composition order is result then response then suggestions", () => {
    const source = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../nexora-entrance/nexoraObjectEducationExperience.ts",
      ),
      "utf8",
    );
    const present = source.slice(
      source.indexOf("function presentStep"),
      source.indexOf("function unavailableNext"),
    );
    const resultAt = present.indexOf("freezeConversationActionResult");
    const reconcileAt = present.indexOf("reconcileConversationAfterAction");
    const composeAt = present.indexOf("composeObjectProgressionCopy");
    const chipsAt = present.indexOf("suggestedActionsForObjectProgression");
    assert.ok(resultAt > 0 && reconcileAt > resultAt);
    assert.ok(composeAt > reconcileAt);
    assert.ok(chipsAt > composeAt);
  });

  it("What appears here? then Continue is Focus lesson pacing, not stale object NEXT", () => {
    const appears = run("What appears here?", run("Show me"));
    const continued = run("Continue", appears);
    assert.match(continued.nexoraMessage.text, /focus/i);
    assert.equal(objectEducationOf(continued.nextEntranceSession).state, "NOT_STARTED");
  });

  it("FIX1 Show me after relevance still presents Stage", () => {
    const shown = run(
      "Show me",
      run("Why is this important?", run("Why is this important?", run("Why is this important?"))),
    );
    assert.match(shown.nexoraMessage.text, /Stage/i);
  });

  it("normal /executive NEXT does not enter educational object curriculum", () => {
    const existing = executeNexoraConversationalExperience({
      utterance: "Show me the next one",
      conversationContext: undefined,
      executiveContext: undefined,
      executiveSubjects: projectManagerObjectConversationalSubjects(
        getDefaultNexoraMVPObjectInteractionCatalog(),
      ),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousManagerObjectSession: null,
      previousEntranceSession: createNexoraEntranceSession({
        workspaceResolution: "existing-workspace",
      }),
      messageIdSeed: "nex-conv2-fix2-existing-next",
    });
    assert.equal(objectEducationOf(existing.nextEntranceSession).state, "NOT_STARTED");
    assert.doesNotMatch(existing.nexoraMessage.text, /example Goal is Improve delivery/i);
  });
});
