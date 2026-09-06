/**
 * NEX-ENT:9 — Trust + Quick Review. Lesson state is not trust truth.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
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
import { decisionLoopEducationOf } from "./nexoraDecisionLoopEducationExperience.ts";
import {
  NEXORA_TRUST_REVIEW_BOUNDARY,
  classifyTrustReviewMove,
  shouldNexoraTrustReviewOwnUtterance,
  trustReviewOf,
  verifyNexoraTrustReview,
} from "./nexoraTrustReviewExperience.ts";
import { NEXORA_GUIDED_ATTENTION_RESERVED } from "./nexoraGuidedEntranceTypes.ts";

const here = dirname(fileURLToPath(import.meta.url));

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
    previousGuidedAttention: previous?.guidedAttention ?? null,
    previousVisualView: previous?.visualView ?? null,
    mountedGuidedAttentionTargets: Object.freeze(["DATA_ENTRY", "STAGE"]),
    attentionNowMs: previous ? 2_000 : 0,
    messageIdSeed: `nex-ent9-${utterance}`,
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

let sourceSeed: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
let purposeSeed: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
let evidenceSeed: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
let trustSeed: ReturnType<typeof executeNexoraConversationalExperience> | undefined;

function atDataSource() {
  sourceSeed ??= run("Show me the next one", advance(3, atAttentionIntro()));
  return sourceSeed;
}

function atVisualPurpose() {
  if (!purposeSeed) {
    let current = run("Show me an example", atDataSource());
    for (let index = 0; index < 5; index += 1) {
      current = run("Show me the next one", current);
    }
    purposeSeed = run("Show me the next one", current);
  }
  return purposeSeed;
}

function atEvidence() {
  if (!evidenceSeed) {
    let current = atVisualPurpose();
    for (let index = 0; index < 4; index += 1) {
      current = run("Show me the next one", current);
    }
    evidenceSeed = run("Show me the next one", current);
  }
  return evidenceSeed;
}

function atTrustSource() {
  if (!trustSeed) {
    let current = atEvidence();
    for (let index = 0; index < 9; index += 1) {
      current = run("Show me the next one", current);
    }
    trustSeed = run("Show me the next one", current);
  }
  return trustSeed;
}

function stepFromTrust(steps: number) {
  let current = atTrustSource();
  for (let index = 0; index < steps; index += 1) {
    current = run("Show me the next one", current);
  }
  return current;
}

function atQuickReview() {
  return stepFromTrust(5);
}

function assertNoBusinessTruth(
  result: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session = result.nextEntranceSession;
  assert.equal(session?.goalDiscovery, null);
  assert.equal(session?.issueDiscovery, null);
  assert.equal(session?.decisionExperience, null);
  assert.equal(session?.executionPlanning, null);
  assert.equal(session?.outcomeMonitoring, null);
  assert.equal(session?.learningReassessment, null);
  assert.equal(session?.identity.sufficiency, "INSUFFICIENT");
  assert.equal(result.shouldCommitRuntime, false);
}

describe("NEX-ENT:9 Trust + Quick Review", () => {
  it("reviews trust without a score, quiz engine, or Personal Demo", () => {
    assert.equal(verifyNexoraTrustReview().ok, true);
    assert.equal(NEXORA_TRUST_REVIEW_BOUNDARY.trustScore, false);
    assert.equal(NEXORA_TRUST_REVIEW_BOUNDARY.quizEngine, false);
    assert.equal(NEXORA_TRUST_REVIEW_BOUNDARY.secondTrustSystem, false);
    assert.equal(NEXORA_TRUST_REVIEW_BOUNDARY.writesDecision, false);
    assert.equal(NEXORA_TRUST_REVIEW_BOUNDARY.writesSemantics, false);
    assert.equal(NEXORA_TRUST_REVIEW_BOUNDARY.startsPersonalDemo, false);
    assert.equal(NEXORA_GUIDED_ATTENTION_RESERVED.implemented, false);
  });

  it("Proof A — ENT:8 recap continues into Trust review", () => {
    const source = atTrustSource();
    assert.equal(decisionLoopEducationOf(source.nextEntranceSession).state, "COMPLETED");
    assert.equal(trustReviewOf(source.nextEntranceSession).state, "SOURCE");
    assert.match(source.nexoraMessage.text, /rules I follow/i);
    assert.doesNotMatch(source.nexoraMessage.text, /You can trust Nexora|98%|CERTIFIED|trust score/i);
    assertNoBusinessTruth(source);
  });

  it("Proof B — source provenance without treating source as truth", () => {
    const from = run("Where did this information come from?", atTrustSource());
    assert.match(from.nexoraMessage.text, /example operations source/i);
    assert.match(from.nexoraMessage.text, /not confirmation/i);
    assert.equal(trustReviewOf(from.nextEntranceSession).state, "SOURCE");
    assertNoBusinessTruth(from);
  });

  it("Proof C/D/E — UNKNOWN stays unknown; LIKELY stays provisional; I don't know", () => {
    const unknown = run("What does this mean?", atTrustSource());
    assert.match(unknown.nexoraMessage.text, /don.t know/i);
    assert.match(unknown.nexoraMessage.text, /value field/i);
    assert.equal(trustReviewOf(unknown.nextEntranceSession).state, "UNCERTAINTY");
    const likely = run("Are you sure?", unknown);
    assert.match(likely.nexoraMessage.text, /likely meaning/i);
    assert.match(likely.nexoraMessage.text, /different from knowing/i);
    const unsure = run("I don't know", likely);
    assert.match(unsure.nexoraMessage.text, /unresolved/i);
    assertNoBusinessTruth(unsure);
  });

  it("Proof F — Why are you asking", () => {
    const why = run("Why are you asking me this?", atTrustSource());
    assert.match(why.nexoraMessage.text, /false confidence|automatic Decision/i);
    assert.doesNotMatch(why.nexoraMessage.text, /CC:10|DATA-ADV|canonical/i);
  });

  it("Proof G/H — evidence and Outcome are not cause", () => {
    const cause = run(
      "If capacity and delivery move together, does that prove capacity caused the problem?",
      atTrustSource(),
    );
    assert.match(cause.nexoraMessage.text, /does not prove/i);
    const outcome = run(
      "The result improved after our Decision. Did our Decision cause this?",
      cause,
    );
    assert.match(outcome.nexoraMessage.text, /does not, by itself, prove/i);
    assertNoBusinessTruth(outcome);
  });

  it("Proof I/J/K — recommendation explanation, not a Decision; cannot decide for manager", () => {
    const why = run("Why did you recommend that?", stepFromTrust(3));
    assert.match(why.nexoraMessage.text, /not a fact and not a Decision/i);
    assert.equal(why.nextEntranceSession?.decisionExperience, null);
    const decide = run("Can you decide for me?", why);
    assert.match(decide.nexoraMessage.text, /commitment remains yours/i);
    assert.equal(decide.nextEntranceSession?.decisionExperience, null);
    assert.equal(
      shouldNexoraTrustReviewOwnUtterance(decide.nextEntranceSession, "Approve Temporary Capacity."),
      false,
    );
    assertNoBusinessTruth(decide);
  });

  it("Proof L/M/N — quick review wrong answer, free text, action kinds", () => {
    const review = atQuickReview();
    assert.equal(trustReviewOf(review.nextEntranceSession).state, "QUICK_REVIEW");
    assert.equal(trustReviewOf(review.nextEntranceSession).reviewStep, 1);
    const kinds = review.nexoraMessage.suggestedActions?.map((action) => action.kind) ?? [];
    assert.ok(kinds.every((kind) => kind === "answer"));
    const wrong = run("Guess the most likely meaning", review);
    assert.match(wrong.nexoraMessage.text, /provisional|ask rather than treat it as confirmed/i);
    assert.doesNotMatch(wrong.nexoraMessage.text, /\bFAIL\b|trust score|Incorrect/i);
    assert.equal(trustReviewOf(wrong.nextEntranceSession).reviewStep, 2);
    const causeNo = run("No", wrong);
    assert.equal(trustReviewOf(causeNo.nextEntranceSession).reviewStep, 3);
    const free = run("I decide", atQuickReview());
    assert.equal(classifyTrustReviewMove("You should ask me."), "ASK");
    const asked = run("You should ask me.", atQuickReview());
    assert.match(asked.nexoraMessage.text, /ask or keep it unresolved/i);
    assert.equal(trustReviewOf(asked.nextEntranceSession).reviewStep, 2);
    assertNoBusinessTruth(wrong);
  });

  it("Proof O/X — unrelated conversation and routing precedence", () => {
    const source = atTrustSource();
    assert.equal(
      shouldNexoraTrustReviewOwnUtterance(source.nextEntranceSession, "Show me the problems"),
      false,
    );
    const problems = run("Show me the problems", source);
    assert.match(problems.nexoraMessage.text, /problem/i);
    const locate = run("Where is Data?", source);
    assert.equal(locate.guidedAttention?.presentation?.target, "DATA_ENTRY");
    const trend = run("Show me delivery over time", source);
    assert.equal(trend.visualView?.view?.purpose, "TREND");
    assert.equal(trustReviewOf(trend.nextEntranceSession).state, "SOURCE");
  });

  it("Proof P — skip does not write business or trust truth", () => {
    const skipped = run("Skip review", atTrustSource());
    assert.equal(trustReviewOf(skipped.nextEntranceSession).state, "SKIPPED");
    assertNoBusinessTruth(skipped);
  });

  it("Proof Q/R — READY is not ENT:10; default /executive stays outside", () => {
    const ready = run("No, I still decide", run("No", run("Ask me or keep it unresolved", atQuickReview())));
    assert.equal(trustReviewOf(ready.nextEntranceSession).state, "READY");
    assert.match(ready.nexoraMessage.text, /ready to make this workspace yours/i);
    assert.doesNotMatch(ready.nexoraMessage.text, /What business|What should this central workspace|who are you/i);
    const existing = executeNexoraConversationalExperience({
      utterance: "What rules?",
      executiveSubjects: projectManagerObjectConversationalSubjects(
        getDefaultNexoraMVPObjectInteractionCatalog(),
      ),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousEntranceSession: createNexoraEntranceSession({
        workspaceResolution: "existing-workspace",
      }),
      messageIdSeed: "nex-ent9-outside",
    });
    assert.equal(trustReviewOf(existing.nextEntranceSession).state, "NOT_STARTED");
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(
        createNexoraEntranceSession({ workspaceResolution: "existing-workspace" }),
        "What rules?",
        [],
      ),
      false,
    );
  });

  it("source does not add a trust score or semantic writer", () => {
    const source = readFileSync(join(here, "nexoraTrustReviewExperience.ts"), "utf8");
    assert.doesNotMatch(source, /applyCsvSemanticClarification/);
    assert.doesNotMatch(source, /trustScore|proficiency|passFail/);
    assert.doesNotMatch(source, /shouldCommitRuntime: true/);
    assert.match(source, /shouldCommitRuntime: false/);
  });
});
