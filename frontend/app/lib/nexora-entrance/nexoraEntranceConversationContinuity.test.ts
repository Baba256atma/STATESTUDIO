/**
 * NEX-ENT-FIX1 — entrance conversation repetition and lesson-state continuity.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { interpretCanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaningInterpreter.ts";
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
  CAPABILITY_DEEPENED_COPY,
  CAPABILITY_INTRODUCTORY_COPY,
  CAPABILITY_PRACTICAL_COPY,
  FOCUS_DEMO_AGAIN_COPY,
  FOCUS_DEMO_COPY,
  FOCUS_EXPLAIN_AFTER_COPY,
  FOCUS_EXPLAIN_AFTER_REPEAT_COPY,
  NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY,
  conversationContinuityOf,
  verifyNexoraEntranceConversationContinuity,
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
    messageIdSeed: `nex-ent-fix1-${utterance}`,
  });
}

function assertNoBusinessWrites(
  result: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session = result.nextEntranceSession;
  assert.equal(session?.goalDiscovery, null);
  assert.equal(session?.realityDiscovery, null);
  assert.equal(session?.issueDiscovery, null);
  assert.equal(session?.scenarioDiscovery, null);
  assert.equal(session?.scenarioComparison, null);
  assert.equal(session?.decisionExperience, null);
  assert.equal(session?.executionPlanning, null);
  assert.equal(session?.outcomeMonitoring, null);
  assert.equal(session?.learningReassessment, null);
  assert.equal(session?.identity.sufficiency, "INSUFFICIENT");
}

function nexoraActorCount(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  const catalog = projectNexoraEntranceCatalog(result.nextEntranceSession!);
  return catalog.objects.filter((object) => object.id === NEXORA_ENTRANCE_OBJECT_ID).length;
}

describe("NEX-ENT-FIX1 entrance conversation continuity", () => {
  it("identity and architecture boundary", () => {
    assert.equal(verifyNexoraEntranceConversationContinuity().ok, true);
    assert.equal(NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY.secondConversationEngine, false);
    assert.equal(NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY.secondNlu, false);
    assert.equal(NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY.transcriptDatabase, false);
    assert.equal(NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY.duplicateLessonStore, false);
    assert.equal(NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY.secondStage, false);
    assert.equal(NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY.businessWriter, false);
    assert.equal(NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY.startsEnt11, false);
  });

  it("entranceConversationRepetitionContinuity — observed transcript no longer loops", () => {
    const first = run("What can Nexora do?");
    const second = run("What can Nexora do?", first);
    const show = run("Show me", second);
    const appears = run("What appears here?", show);
    const focus = run("Show me how focus works", appears);
    const explain = run("Explain first", focus);
    const focusAgain = run("Show me how focus works", explain);
    const explainAgain = run("Explain first", focusAgain);

    assert.equal(first.nexoraMessage.text, CAPABILITY_INTRODUCTORY_COPY);
    assert.equal(second.nexoraMessage.text, CAPABILITY_DEEPENED_COPY);
    assert.notEqual(first.nexoraMessage.text, second.nexoraMessage.text);
    assert.match(show.nexoraMessage.text, /this is your stage/i);
    assert.match(appears.nexoraMessage.text, /relevant things/i);
    assert.equal(focus.nexoraMessage.text, FOCUS_DEMO_COPY);
    assert.equal(explain.nexoraMessage.text, FOCUS_EXPLAIN_AFTER_COPY);
    assert.doesNotMatch(explain.nexoraMessage.text, /I can show you that now/i);
    assert.equal(focusAgain.nexoraMessage.text, FOCUS_DEMO_AGAIN_COPY);
    assert.equal(explainAgain.nexoraMessage.text, FOCUS_EXPLAIN_AFTER_REPEAT_COPY);
    assert.notEqual(explain.nexoraMessage.text, explainAgain.nexoraMessage.text);
    assert.equal(focus.nextEntranceSession?.guidedIntroduction?.stageEducation.focusDemonstrated, true);
    assert.equal(nexoraActorCount(focusAgain), 1);
    assertNoBusinessWrites(explainAgain);
  });

  it("Proof A/B — capability repeat and semantic equivalent deepen", () => {
    const first = run("What can Nexora do?");
    const equivalent = run("What do you do?", first);
    assert.equal(
      interpretCanonicalManagerMeaning({ utterance: "What do you do?", subjects: [] })
        .communicativeIntent,
      "ASK_CAPABILITY",
    );
    assert.equal(equivalent.nexoraMessage.text, CAPABILITY_DEEPENED_COPY);
    const third = run("How can you help me?", equivalent);
    assert.equal(third.nexoraMessage.text, CAPABILITY_PRACTICAL_COPY);
  });

  it("Proof C — Show me after capability enters Stage", () => {
    const next = run("Show me", run("What can Nexora do?", run("What can Nexora do?")));
    assert.match(next.nexoraMessage.text, /this is your stage/i);
    assert.doesNotMatch(next.nexoraMessage.text, /Goals, data, Problems/i);
  });

  it("Proof D — What appears here? then Like what?", () => {
    const appears = run("What appears here?", run("Show me"));
    const examples = run("Like what?", appears);
    assert.match(appears.nexoraMessage.text, /relevant things/i);
    assert.match(examples.nexoraMessage.text, /Goal/i);
    assert.match(examples.nexoraMessage.text, /not placing them on Stage/i);
  });

  it("Proof E/F — Focus show then explain refers to demonstration", () => {
    const demo = run("Show me how focus works", run("Show me"));
    const explained = run("Explain first", demo);
    assert.equal(demo.nextRuntimeState.focusedSubject?.id, NEXORA_ENTRANCE_OBJECT_ID);
    assert.equal(conversationContinuityOf(demo.nextEntranceSession).lastResult, "PRESENTED");
    assert.match(explained.nexoraMessage.text, /Focus means choosing/i);
    assert.doesNotMatch(explained.nexoraMessage.text, /I can show you that now/i);
  });

  it("Proof G — Explain then Show demonstrates without resetting", () => {
    const explained = run("Explain first", run("Show me"));
    assert.match(explained.nexoraMessage.text, /Focus means choosing/i);
    const demo = run("Show me", explained);
    assert.equal(demo.nextEntranceSession?.guidedIntroduction?.stageEducation.focusDemonstrated, true);
    assert.match(demo.nexoraMessage.text, /brought Nexora into focus/i);
  });

  it("Proof H/I — repeat Show is allowed and later Explain is not stale", () => {
    const first = run("Show me how focus works", run("Show me"));
    const explained = run("Explain first", first);
    const again = run("Show me how focus works", explained);
    const explainedAgain = run("Explain first", again);
    assert.equal(again.nexoraMessage.text, FOCUS_DEMO_AGAIN_COPY);
    assert.equal(nexoraActorCount(again), nexoraActorCount(first));
    assert.equal(explained.nexoraMessage.text, FOCUS_EXPLAIN_AFTER_COPY);
    assert.equal(explainedAgain.nexoraMessage.text, FOCUS_EXPLAIN_AFTER_REPEAT_COPY);
  });

  it("Proof J/K/L/M — Why, repeated Why, Explain it, Do it again keep Focus", () => {
    const demo = run("Show me how focus works", run("Show me"));
    const why = run("Why?", demo);
    const whyAgain = run("Why?", why);
    const explainIt = run("Explain it", whyAgain);
    const again = run("Do it again", explainIt);
    assert.match(why.nexoraMessage.text, /clutter/i);
    assert.notEqual(why.nexoraMessage.text, whyAgain.nexoraMessage.text);
    assert.match(whyAgain.nexoraMessage.text, /related context/i);
    assert.match(explainIt.nexoraMessage.text, /Focus means choosing|Stage staying organized/i);
    assert.equal(conversationContinuityOf(explainIt.nextEntranceSession).subject, "FOCUS");
    assert.match(again.nexoraMessage.text, /show it again/i);
  });

  it("Proof N/O/P — correction, I already understand, revisit Stage", () => {
    const demo = run("Show me how focus works", run("Show me"));
    const correction = run("No, that's not what I mean.", demo);
    assert.match(correction.nexoraMessage.text, /what you want to understand/i);
    assert.notEqual(correction.nexoraMessage.text, demo.nexoraMessage.text);
    const known = run("I already understand focus.", demo);
    assert.match(known.nexoraMessage.text, /continue without another Focus/i);
    const revisit = run("Explain Stage again.", demo);
    assert.match(revisit.nexoraMessage.text, /active executive workspace/i);
    assert.equal(
      revisit.nextEntranceSession?.guidedIntroduction?.stageEducation.focusDemonstrated,
      true,
    );
  });

  it("Proof Q/R/S/T/U — unrelated, collection, DIR:GA, visual, Decision are not swallowed", () => {
    const started = run("Show me");
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(started.nextEntranceSession, "Show problems"),
      false,
    );
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(started.nextEntranceSession, "Where is Data?"),
      false,
    );
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(
        started.nextEntranceSession,
        "Show delivery over time",
      ),
      false,
    );
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(
        started.nextEntranceSession,
        "What can Nexora decide?",
      ),
      false,
    );
    const existing = createNexoraEntranceSession({
      workspaceResolution: "existing-workspace",
    });
    assert.equal(shouldNexoraGuidedEntranceOwnUtterance(existing, "What can Nexora do?"), false);
    const problems = run("Show problems", undefined, existing);
    assert.match(problems.nexoraMessage.text.toLowerCase(), /problem/);
  });

  it("Proof V/W — ENT:10 finished and default /executive do not use entrance continuity", () => {
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
    assert.equal(shouldNexoraGuidedEntranceOwnUtterance(finished, "What can Nexora do?"), false);
    const existing = run(
      "What can Nexora do?",
      undefined,
      createNexoraEntranceSession({ workspaceResolution: "existing-workspace" }),
    );
    assert.notEqual(existing.nexoraMessage.text, CAPABILITY_INTRODUCTORY_COPY);
    assert.equal(existing.nextEntranceSession?.guidedIntroduction?.state, "INACTIVE");
  });

  it("Proof X/Y/Z — refresh seed, skip, and zero business writes", () => {
    const demo = run("Show me how focus works", run("Show me"));
    assert.equal(nexoraActorCount(demo), 1);
    const skipped = run("Skip this", demo);
    assert.equal(skipped.nextEntranceSession?.guidedIntroduction?.state, "SKIPPED");
    assert.equal(conversationContinuityOf(skipped.nextEntranceSession).subject, null);
    assertNoBusinessWrites(demo);
    assertNoBusinessWrites(skipped);
  });

  it("lesson transition clears Focus/capability continuity before Object education", () => {
    const objects = run(
      "Show me the next one",
      run("Show me how focus works", run("Show me")),
    );
    assert.equal(objectEducationOf(objects.nextEntranceSession).state, "GOAL");
    assert.equal(conversationContinuityOf(objects.nextEntranceSession).subject, null);
    assert.equal(conversationContinuityOf(objects.nextEntranceSession).capabilityDepth, "NONE");
    assert.equal(conversationContinuityOf(objects.nextEntranceSession).focusExplained, false);
  });
});
