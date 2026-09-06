/**
 * NEX-ENT-FIX2 — repetition saturation and conversational progression.
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
  NEXORA_ENTRANCE_OBJECT_ID,
  projectNexoraEntranceCatalog,
} from "./nexoraEntranceExperience.ts";
import {
  APPEARS_CLARIFY_COPY,
  APPEARS_EXAMPLES_COPY,
  APPEARS_PROGRESS_COPY,
  CAPABILITY_CLARIFY_COPY,
  CAPABILITY_DEEPENED_COPY,
  CAPABILITY_INTRODUCTORY_COPY,
  CAPABILITY_PRACTICAL_COPY,
  conversationContinuityOf,
  progressionModeForDepth,
} from "./nexoraEntranceConversationContinuity.ts";
import {
  shouldNexoraGuidedEntranceOwnUtterance,
  withActiveNexoraGuidedEntrance,
} from "./nexoraGuidedEntranceExperience.ts";
import { objectEducationOf } from "./nexoraObjectEducationExperience.ts";
import { isNexoraPersonalDemoHandoffFinished } from "./nexoraPersonalDemoHandoffExperience.ts";
import { inactiveNexoraPersonalDemoHandoffSession } from "./nexoraGuidedEntranceTypes.ts";

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
  session = previous?.nextEntranceSession ?? guidedSession(),
) {
  const restrained = isNexoraEntranceRestrained(session);
  const catalog = restrained
    ? projectNexoraEntranceCatalog(session)
    : getDefaultNexoraMVPObjectInteractionCatalog();
  const runtimeState = previous?.nextRuntimeState
    ?? (restrained
      ? applyEntranceCenterSubject(initialState(), session)
      : initialState());
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: projectManagerObjectConversationalSubjects(catalog),
    runtimeState,
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    previousEntranceSession: session,
    previousGuidedAttention: previous?.guidedAttention ?? null,
    previousVisualView: previous?.visualView ?? null,
    mountedGuidedAttentionTargets: Object.freeze(["DATA_ENTRY", "STAGE"]),
    attentionNowMs: previous ? 2_000 : 0,
    messageIdSeed: `nex-ent-fix2-${utterance}`,
  });
}

function assertNoBusinessWrites(
  result: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session = result.nextEntranceSession;
  assert.equal(session?.goalDiscovery, null);
  assert.equal(session?.decisionExperience, null);
  assert.equal(session?.executionPlanning, null);
  assert.equal(session?.identity.sufficiency, "INSUFFICIENT");
}

describe("NEX-ENT-FIX2 repetition saturation", () => {
  it("reported Stage-content loop answers, deepens, progresses, then clarifies", () => {
    const shown = run("Show me");
    const dashboard = run("Is this a dashboard?", shown);
    const a1 = run("What appears here?", dashboard);
    const a2 = run("What appears here?", a1);
    const a3 = run("What appears here?", a2);
    const a4 = run("What appears here?", a3);
    const focus = run("Show me how focus works", a4);

    assert.match(dashboard.nexoraMessage.text, /isn.t a fixed dashboard/i);
    assert.match(a1.nexoraMessage.text, /relevant things from the current situation/i);
    assert.equal(a2.nexoraMessage.text, APPEARS_EXAMPLES_COPY);
    assert.equal(a3.nexoraMessage.text, APPEARS_PROGRESS_COPY);
    assert.notEqual(a3.nexoraMessage.text, a2.nexoraMessage.text);
    assert.equal(a4.nexoraMessage.text, APPEARS_CLARIFY_COPY);
    assert.notEqual(a4.nexoraMessage.text, a2.nexoraMessage.text);
    assert.equal(progressionModeForDepth(conversationContinuityOf(a3.nextEntranceSession).appearsDepth), "PROGRESS");
    assert.equal(progressionModeForDepth(conversationContinuityOf(a4.nextEntranceSession).appearsDepth), "CLARIFY");
    assert.equal(a3.nextEntranceSession?.guidedIntroduction?.stageEducation.state, "INTRODUCING");
    assert.match(focus.nexoraMessage.text, /brought Nexora into focus/i);
    assert.equal(projectNexoraEntranceCatalog(a4.nextEntranceSession!).objects.length, 1);
    assertNoBusinessWrites(a4);
  });

  it("semantic-equivalent appears wording does not reset progression", () => {
    const shown = run("Show me");
    const a1 = run("What appears here?", shown);
    const a2 = run("What can appear on the Stage?", a1);
    const a3 = run("What kinds of things do I see here?", a2);
    const a4 = run("What can this workspace show?", a3);
    assert.equal(a2.nexoraMessage.text, APPEARS_EXAMPLES_COPY);
    assert.equal(a3.nexoraMessage.text, APPEARS_PROGRESS_COPY);
    assert.equal(a4.nexoraMessage.text, APPEARS_CLARIFY_COPY);
  });

  it("capability saturation does not loop the practical paragraph", () => {
    const c1 = run("What can Nexora do?");
    const c2 = run("What do you do?", c1);
    const c3 = run("How can you help me?", c2);
    const c4 = run("What can Nexora do?", c3);
    assert.equal(c1.nexoraMessage.text, CAPABILITY_INTRODUCTORY_COPY);
    assert.equal(c2.nexoraMessage.text, CAPABILITY_DEEPENED_COPY);
    assert.equal(c3.nexoraMessage.text, CAPABILITY_PRACTICAL_COPY);
    assert.equal(c4.nexoraMessage.text, CAPABILITY_CLARIFY_COPY);
  });

  it("Focus explanation and Why saturate, then Show me demonstrates", () => {
    const shown = run("Show me");
    const e1 = run("What is focus?", shown);
    const e2 = run("Explain focus.", e1);
    const e3 = run("Explain focus.", e2);
    const e4 = run("Explain focus again.", e3);
    assert.match(e4.nexoraMessage.text, /I may not be answering|show you how Focus/i);
    assert.match(e1.nexoraMessage.text, /Focus means choosing/i);
    assert.notEqual(e2.nexoraMessage.text, e1.nexoraMessage.text);
    assert.notEqual(e3.nexoraMessage.text, e2.nexoraMessage.text);
    assert.match(e3.nexoraMessage.text, /show you how Focus|I may not be answering/i);
    const why1 = run("Why?", shown);
    const why2 = run("Why?", why1);
    const why3 = run("Why?", why2);
    const why4 = run("Why?", why3);
    assert.notEqual(why2.nexoraMessage.text, why1.nexoraMessage.text);
    assert.notEqual(why4.nexoraMessage.text, why2.nexoraMessage.text);
    const demo = run("Show me.", e3);
    assert.match(demo.nexoraMessage.text, /brought Nexora into focus/i);
  });

  it("explicit exact-repeat is allowed", () => {
    const shown = run("Show me");
    const appears = run("What appears here?", shown);
    const repeated = run("Repeat exactly what you said.", appears);
    assert.equal(repeated.nexoraMessage.text, appears.nexoraMessage.text);
  });

  it("simpler and more-detail remain distinct from saturation", () => {
    const shown = run("Show me");
    const stage = run("What is the Stage?", shown);
    const simple = run("Explain it more simply.", stage);
    assert.match(simple.nexoraMessage.text, /workspace in front of you/i);
    const more = run("Tell me more.", stage);
    assert.notEqual(more.nexoraMessage.text, simple.nexoraMessage.text);
    const more2 = run("Tell me more.", more);
    const more3 = run("Tell me more.", more2);
    assert.doesNotMatch(more3.nexoraMessage.text, /fabricat/i);
  });

  it("current Stage vs possible Stage", () => {
    const shown = run("Show me");
    const possible = run("What can appear here?", shown);
    const current = run("What is here right now?", shown);
    assert.match(possible.nexoraMessage.text, /relevant things/i);
    assert.match(current.nexoraMessage.text, /right now/i);
    assert.notEqual(possible.nexoraMessage.text, current.nexoraMessage.text);
  });

  it("appears saturation then Show me is Focus, then Explain that is Focus", () => {
    const a1 = run("What appears here?", run("Show me"));
    const a2 = run("What appears here?", a1);
    const a3 = run("What appears here?", a2);
    assert.equal(a3.nexoraMessage.text, APPEARS_PROGRESS_COPY);
    const demo = run("Show me.", a3);
    assert.match(demo.nexoraMessage.text, /brought Nexora into focus/i);
    const explained = run("Explain that.", demo);
    assert.match(explained.nexoraMessage.text, /Focus means choosing|Stage staying organized/i);
    assert.equal(conversationContinuityOf(explained.nextEntranceSession).subject, "FOCUS");
  });

  it("manager correction and I understand", () => {
    const appears = run("What appears here?", run("Show me"));
    const correction = run("No, I mean what is actually on the Stage now.", appears);
    assert.match(correction.nexoraMessage.text, /right now/i);
    const understood = run("I understand.", appears);
    assert.match(understood.nexoraMessage.text, /Understood/i);
  });

  it("lesson skip, object transition, routing isolation, default executive", () => {
    const a2 = run("What appears here?", run("What appears here?", run("Show me")));
    const skipped = run("Skip this.", a2);
    assert.equal(skipped.nextEntranceSession?.guidedIntroduction?.state, "SKIPPED");
    const objects = run(
      "Show me the next one",
      run("Show me how focus works", run("Show me")),
    );
    assert.equal(objectEducationOf(objects.nextEntranceSession).state, "GOAL");
    assert.equal(conversationContinuityOf(objects.nextEntranceSession).appearsDepth, "NONE");
    const started = run("Show me");
    assert.equal(shouldNexoraGuidedEntranceOwnUtterance(started.nextEntranceSession, "Show problems"), false);
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(started.nextEntranceSession, "What can Nexora decide?"),
      false,
    );
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(started.nextEntranceSession, "Show delivery over time"),
      false,
    );
    const existing = createNexoraEntranceSession({ workspaceResolution: "existing-workspace" });
    assert.equal(shouldNexoraGuidedEntranceOwnUtterance(existing, "What appears here?"), false);
    const finished = Object.freeze({
      ...guidedSession(),
      guidedIntroduction: Object.freeze({
        ...guidedSession().guidedIntroduction!,
        state: "COMPLETED" as const,
        personalDemoHandoff: Object.freeze({
          ...inactiveNexoraPersonalDemoHandoffSession(),
          state: "COMPLETED" as const,
        }),
      }),
    });
    assert.equal(isNexoraPersonalDemoHandoffFinished(finished), true);
    assert.equal(shouldNexoraGuidedEntranceOwnUtterance(finished, "What appears here?"), false);
    assert.equal(
      projectNexoraEntranceCatalog(run("Show me how focus works", started).nextEntranceSession!)
        .objects.filter((object) => object.id === NEXORA_ENTRANCE_OBJECT_ID).length,
      1,
    );
  });
});
