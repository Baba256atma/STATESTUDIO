/**
 * NEX-ENT:5 — Guided Attention education over DIR:GA.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  isNexoraEntranceRestrained,
  projectNexoraEntranceCatalog,
} from "./nexoraEntranceExperience.ts";
import {
  shouldNexoraGuidedEntranceOwnUtterance,
  withActiveNexoraGuidedEntrance,
} from "./nexoraGuidedEntranceExperience.ts";
import { conversationEducationOf } from "./nexoraConversationEducationExperience.ts";
import { objectEducationOf } from "./nexoraObjectEducationExperience.ts";
import {
  NEXORA_ATTENTION_EDUCATION_BOUNDARY,
  attentionEducationOf,
  verifyNexoraAttentionEducation,
} from "./nexoraAttentionEducationExperience.ts";
import { NEXORA_GUIDED_ATTENTION_RESERVED } from "./nexoraGuidedEntranceTypes.ts";
import { NEXORA_GUIDED_ATTENTION_DURATION_MS } from "../director/nexoraGuidedAttentionPresentation.ts";

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
  extra?: {
    readonly mounted?: readonly ("DATA_ENTRY" | "BACK_CONTROL" | "STAGE")[];
    readonly nowMs?: number;
    readonly reducedMotion?: boolean;
  },
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
    previousGuidedAttention: previous?.guidedAttention ?? null,
    mountedGuidedAttentionTargets: extra?.mounted ?? Object.freeze(["DATA_ENTRY", "STAGE"]),
    attentionNowMs: extra?.nowMs ?? (previous ? 1_000 : 0),
    reducedMotion: extra?.reducedMotion === true,
    messageIdSeed: `nex-ent5-${utterance}`,
  });
}

function afterStage() {
  return run("Show me how focus works", run("Show me"));
}

function atGoal() {
  return run("Show me the next one", afterStage());
}

function advance(steps: number, from = atGoal()) {
  let current = from;
  for (let index = 0; index < steps; index += 1) {
    current = run("Show me the next one", current);
  }
  return current;
}

function atConversationAsk() {
  return run("Show me the next one", advance(7));
}

function atAttentionIntro() {
  return run("Show me the next one", advance(5, atConversationAsk()));
}

function assertNoBusinessTruth(
  result: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session = result.nextEntranceSession;
  assert.equal(session?.goalDiscovery, null);
  assert.equal(session?.issueDiscovery, null);
  assert.equal(session?.decisionExperience, null);
  assert.equal(session?.identity.sufficiency, "INSUFFICIENT");
}

describe("NEX-ENT:5 Guided Attention education", () => {
  it("teaches Guided Attention without owning the capability", () => {
    assert.equal(verifyNexoraAttentionEducation().ok, true);
    assert.equal(NEXORA_ATTENTION_EDUCATION_BOUNDARY.ownsGuidedAttention, false);
    assert.equal(NEXORA_ATTENTION_EDUCATION_BOUNDARY.advisorDomManipulation, false);
    assert.equal(NEXORA_GUIDED_ATTENTION_RESERVED.implemented, false);
  });

  it("Proof A — How do I add my data? highlights Data without opening it", () => {
    const intro = atAttentionIntro();
    assert.equal(attentionEducationOf(intro.nextEntranceSession).state, "INTRODUCING");
    const result = run("How do I add my data?", intro, { nowMs: 2_000 });
    assert.match(result.nexoraMessage.text, /use data/i);
    assert.equal(result.guidedAttention?.presentation?.target, "DATA_ENTRY");
    assert.equal(result.guidedAttention?.presentation?.availability, "AVAILABLE");
    assert.equal(result.guidedAttention?.presentation?.mutatesFocus, false);
    assert.equal(result.nextRuntimeState.focusedSubject?.id, intro.nextRuntimeState.focusedSubject?.id);
    assertNoBusinessTruth(result);
  });

  it("Proof B — paraphrase uses the same semantic target", () => {
    const result = run("Where can I upload information?", atAttentionIntro(), { nowMs: 3_000 });
    assert.equal(result.guidedAttention?.presentation?.target, "DATA_ENTRY");
    assert.equal(shouldNexoraGuidedEntranceOwnUtterance(atAttentionIntro().nextEntranceSession, "Where can I upload information?"), false);
  });

  it("Proof C — Stage is a second semantic target", () => {
    const result = run("Where do objects appear?", atAttentionIntro(), { nowMs: 4_000 });
    assert.equal(result.guidedAttention?.presentation?.target, "STAGE");
    assert.match(result.nexoraMessage.text, /stage/i);
  });

  it("Proof D/E — attention does not click Data or change focus", () => {
    const focused = atAttentionIntro();
    const before = focused.nextRuntimeState.focusedSubject?.id;
    const result = run("How do I add my data?", focused, { nowMs: 5_000 });
    assert.equal(result.nextRuntimeState.focusedSubject?.id, before);
    assert.equal(result.nextRuntimeState.selectedSubject?.id, focused.nextRuntimeState.selectedSubject?.id);
    assert.equal(result.shouldCommitRuntime, focused.shouldCommitRuntime || result.guidedAttention != null ? result.shouldCommitRuntime : false);
  });

  it("Proof F — expiry is deterministic", () => {
    const shown = run("How do I add my data?", atAttentionIntro(), { nowMs: 10_000 });
    const later = run("Why do I need it?", shown, { nowMs: 10_000 + NEXORA_GUIDED_ATTENTION_DURATION_MS });
    assert.equal(later.guidedAttention?.presentation, null);
    assert.ok(later.nexoraMessage.text.length > 8);
  });

  it("Proof G — repeat replaces rather than stacking", () => {
    const first = run("How do I add my data?", atAttentionIntro(), { nowMs: 20_000 });
    const second = run("How do I add my data?", first, { nowMs: 20_500 });
    assert.equal(second.guidedAttention?.presentation?.target, "DATA_ENTRY");
    assert.notEqual(
      second.guidedAttention?.presentation?.requestId,
      first.guidedAttention?.presentation?.requestId,
    );
  });

  it("Proof H — replacement prefers the newest request", () => {
    const data = run("How do I add my data?", atAttentionIntro(), { nowMs: 30_000 });
    const stage = run("Where do objects appear?", data, { nowMs: 30_400 });
    assert.equal(stage.guidedAttention?.presentation?.target, "STAGE");
  });

  it("Proof I — missing Back does not fake a highlight", () => {
    const result = run("How do I go back?", atAttentionIntro(), {
      nowMs: 40_000,
      mounted: ["DATA_ENTRY", "STAGE"],
    });
    assert.equal(result.guidedAttention?.presentation?.availability, "UNAVAILABLE");
    assert.equal(result.guidedAttention?.presentation?.cue, null);
    assert.match(result.nexoraMessage.text, /isn.t available/i);
  });

  it("Proof J — reduced motion uses emphasis", () => {
    const result = run("How do I add my data?", atAttentionIntro(), {
      nowMs: 50_000,
      reducedMotion: true,
    });
    assert.equal(result.guidedAttention?.presentation?.cue, "EMPHASIS");
  });

  it("Proof K — Show me the problems is not Guided Attention", () => {
    const result = run("Show me the problems", atAttentionIntro(), { nowMs: 60_000 });
    assert.notEqual(result.guidedAttention?.presentation?.target, "DATA_ENTRY");
  });

  it("Proof L — contextual Show me uses the pending offer", () => {
    const intro = atAttentionIntro();
    assert.equal(intro.guidedAttention?.pendingOfferTarget, "DATA_ENTRY");
    const shown = run("Show me", intro, { nowMs: 70_000 });
    assert.equal(shown.guidedAttention?.presentation?.target, "DATA_ENTRY");
    assert.match(shown.nexoraMessage.text, /use data/i);
  });

  it("Proof M — conversation continues during attention", () => {
    const shown = run("How do I add my data?", atAttentionIntro(), { nowMs: 80_000 });
    const follow = run("Why do I need it?", shown, { nowMs: 80_500 });
    assert.ok(follow.nexoraMessage.text.length > 8);
    assert.doesNotMatch(follow.nexoraMessage.text, /SHOW\(/);
  });

  it("Proof N — skip clears attention", () => {
    const shown = run("How do I add my data?", atAttentionIntro(), { nowMs: 90_000 });
    const skipped = run("Skip this", shown, { nowMs: 90_200 });
    assert.equal(attentionEducationOf(skipped.nextEntranceSession).state, "SKIPPED");
    assert.equal(skipped.guidedAttention?.presentation, null);
    assert.equal(objectEducationOf(skipped.nextEntranceSession).state, "SKIPPED");
    assertNoBusinessTruth(skipped);
  });

  it("suggested Where is Data? is a question and Show me is an answer", () => {
    const intro = atAttentionIntro();
    const questions = intro.nexoraMessage.suggestedActions?.filter((action) => action.kind === "question");
    const answers = intro.nexoraMessage.suggestedActions?.filter((action) => action.kind === "answer");
    assert.ok(questions?.some((action) => /where is data/i.test(action.label)));
    assert.ok(answers?.some((action) => action.label === "Show me"));
  });

  it("capability works outside NEX-ENT", () => {
    const existing = createNexoraEntranceSession({
      workspaceResolution: "existing-workspace",
    });
    const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
    const result = executeNexoraConversationalExperience({
      utterance: "How do I add my data?",
      executiveSubjects: projectManagerObjectConversationalSubjects(catalog),
      runtimeState: initialState(),
      catalog,
      previousEntranceSession: existing,
      mountedGuidedAttentionTargets: Object.freeze(["DATA_ENTRY", "STAGE"]),
      attentionNowMs: 1,
      messageIdSeed: "nex-ent5-outside",
    });
    assert.equal(result.guidedAttention?.presentation?.target, "DATA_ENTRY");
  });
});
