/**
 * NEX-CONV:2 — Conversation Thread Intelligence focused tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  NEXORA_CONVERSATION_THREAD_BOUNDARY,
  verifyNexoraConversationThread,
} from "./nexoraConversationThreadContract.ts";
import {
  availablePurposesForUnderstandSubject,
  conversationThreadId,
  projectConversationThread,
} from "./nexoraConversationThread.ts";
import { resolveConversationThreadMove } from "./nexoraConversationThreadPolicy.ts";
import {
  resolveThreadIntelligence,
  utteranceIsGenuineAmbiguity,
} from "./nexoraConversationThreadApply.ts";
import {
  emptyConversationCapabilities,
  resolveConversationalMove,
} from "./nexoraConversationPolicy.ts";
import {
  emptyNexoraConversationWorkingContext,
  recordConversationKernelDecision,
  coverageOf,
} from "./nexoraConversationWorkingContext.ts";
import type { NexoraConversationWorkingContext } from "./nexoraConversationWorkingContext.ts";
import type { NexoraConversationKernelDecision } from "./nexoraConversationPolicy.ts";

const capabilities = Object.freeze({
  ...emptyConversationCapabilities(),
  compare: true,
  offerNext: true,
  connect: true,
});

function identifyTurn(
  subjectId: string,
  coverage: Parameters<typeof resolveConversationalMove>[0]["coverage"],
  previousMove: Parameters<typeof resolveConversationalMove>[0]["previousMove"],
) {
  return resolveConversationalMove({
    meaning: null,
    subjectId,
    purpose: "IDENTIFY",
    coverage,
    previousMove,
    lastCapabilityRequest: null,
    lastCapabilityResult: "NONE",
    capabilities,
    explicitRepeat: false,
    materialContextChanged: false,
    pendingOfferAccepted: false,
  });
}

function record(
  working: NexoraConversationWorkingContext,
  turn: NexoraConversationKernelDecision,
) {
  return recordConversationKernelDecision(working, turn);
}

describe("NEX-CONV:2 Conversation Thread Intelligence", () => {
  it("1. creates a bounded thread from CONV:1 coverage", () => {
    assert.equal(verifyNexoraConversationThread().ok, true);
    const thread = projectConversationThread({
      threads: Object.freeze([]),
      primarySubject: "obj-nex-ent3-goal",
      objective: "UNDERSTAND_SUBJECT",
      availablePurposes: availablePurposesForUnderstandSubject({
        compare: true,
        whyPresent: true,
      }),
    });
    assert.equal(thread.threadId, conversationThreadId("UNDERSTAND_SUBJECT", "obj-nex-ent3-goal"));
    assert.equal(thread.status, "ACTIVE");
    assert.deepEqual([...thread.openPurposes], ["IDENTIFY", "WHY_PRESENT", "COMPARE"]);
  });

  it("2. reuses the same thread identity for the same subject and objective", () => {
    const first = projectConversationThread({
      threads: Object.freeze([]),
      primarySubject: "obj-nex-ent3-goal",
      objective: "UNDERSTAND_SUBJECT",
      availablePurposes: ["IDENTIFY"],
    });
    const second = projectConversationThread({
      threads: Object.freeze([]),
      primarySubject: "obj-nex-ent3-goal",
      objective: "UNDERSTAND_SUBJECT",
      availablePurposes: ["IDENTIFY"],
    });
    assert.equal(first.threadId, second.threadId);
  });

  it("3-6. aggregates IDENTIFY, WHY_PRESENT, and COMPARE without a second coverage engine", () => {
    let working = emptyNexoraConversationWorkingContext();
    const identify = identifyTurn("obj-nex-ent3-goal", "NONE", null);
    working = record(working, identify);
    const why = resolveConversationalMove({
      ...identify,
      purpose: "WHY_PRESENT",
      coverage: "NONE",
      previousMove: identify.move,
      lastCapabilityRequest: null,
      lastCapabilityResult: "NONE",
      capabilities,
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
      meaning: null,
    });
    working = record(working, why);
    const compare = resolveConversationalMove({
      ...identify,
      purpose: "COMPARE",
      coverage: "NONE",
      previousMove: why.move,
      lastCapabilityRequest: null,
      lastCapabilityResult: "NONE",
      capabilities,
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
      meaning: null,
    });
    working = record(working, compare);
    const thread = projectConversationThread({
      threads: working.threads,
      primarySubject: "obj-nex-ent3-goal",
      objective: "UNDERSTAND_SUBJECT",
      availablePurposes: availablePurposesForUnderstandSubject({
        compare: true,
        whyPresent: true,
      }),
    });
    assert.equal(thread.coveredPurposes.length, 3);
    assert.equal(thread.status, "SUFFICIENTLY_COVERED");
    assert.equal(coverageOf(working, "obj-nex-ent3-goal", "IDENTIFY"), identify.progression);
    assert.equal(thread.openPurposes.length, 0);
  });

  it("7-8. broad coverage turns CONV:1 CLARIFY into a productive thread move", () => {
    let working = emptyNexoraConversationWorkingContext();
    working = record(
      working,
      identifyTurn("obj-nex-ent3-goal", "PRACTICAL", "CONNECT"),
    );
    const why = resolveConversationalMove({
      meaning: null,
      subjectId: "obj-nex-ent3-goal",
      purpose: "WHY_PRESENT",
      coverage: "NONE",
      previousMove: "CONNECT",
      lastCapabilityRequest: null,
      lastCapabilityResult: "NONE",
      capabilities,
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
    });
    working = record(working, why);
    const compare = resolveConversationalMove({
      meaning: null,
      subjectId: "obj-nex-ent3-goal",
      purpose: "COMPARE",
      coverage: "NONE",
      previousMove: why.move,
      lastCapabilityRequest: null,
      lastCapabilityResult: "NONE",
      capabilities,
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
    });
    working = record(working, compare);
    const clarify = identifyTurn("obj-nex-ent3-goal", "SATURATED", "CLARIFY");
    const decision = resolveThreadIntelligence({
      working,
      turn: clarify,
      capabilities,
    });
    assert.equal(clarify.move, "CLARIFY");
    assert.notEqual(decision.resolvedMove, "CLARIFY");
    assert.ok(
      decision.resolvedMove === "SUMMARIZE" || decision.resolvedMove === "OFFER_NEXT",
    );
    assert.equal(decision.turnMove, "CLARIFY");
  });

  it("9. genuine ambiguity still clarifies", () => {
    assert.equal(utteranceIsGenuineAmbiguity("That's not what I mean."), true);
    const clarify = identifyTurn("obj-nex-ent3-goal", "SATURATED", "CLARIFY");
    const decision = resolveThreadIntelligence({
      working: emptyNexoraConversationWorkingContext(),
      turn: clarify,
      capabilities,
      explicitAmbiguity: true,
    });
    assert.equal(decision.resolvedMove, "CLARIFY");
    assert.equal(decision.reason, "GENUINE_AMBIGUITY");
  });

  it("10. explicit repeat still repeats", () => {
    const repeat = resolveConversationalMove({
      meaning: null,
      subjectId: "obj-nex-ent3-goal",
      purpose: "IDENTIFY",
      coverage: "INTRODUCTORY",
      previousMove: "ANSWER",
      lastCapabilityRequest: null,
      lastCapabilityResult: "NONE",
      capabilities,
      explicitRepeat: true,
      materialContextChanged: false,
      pendingOfferAccepted: false,
    });
    const decision = resolveThreadIntelligence({
      working: emptyNexoraConversationWorkingContext(),
      turn: repeat,
      capabilities,
      explicitRepeat: true,
    });
    assert.equal(repeat.move, "REPEAT");
    assert.equal(decision.resolvedMove, "REPEAT");
  });

  it("11. subject change does not contaminate coverage", () => {
    let working = emptyNexoraConversationWorkingContext();
    working = record(working, identifyTurn("obj-nex-ent3-goal", "PRACTICAL", "CONNECT"));
    const kpi = identifyTurn("obj-nex-ent3-kpi", "NONE", null);
    const thread = projectConversationThread({
      threads: record(working, kpi).threads,
      primarySubject: "obj-nex-ent3-kpi",
      objective: "UNDERSTAND_SUBJECT",
      availablePurposes: ["IDENTIFY", "WHY_PRESENT", "COMPARE"],
      relatedSubjects: ["obj-nex-ent3-goal"],
    });
    assert.equal(thread.primarySubject, "obj-nex-ent3-kpi");
    assert.equal(thread.coveredPurposes.length, 1);
    assert.equal(coverageOf(working, "obj-nex-ent3-goal", "IDENTIFY"), "SATURATED");
  });

  it("12. purpose change keeps the same subject thread", () => {
    let working = emptyNexoraConversationWorkingContext();
    working = record(working, identifyTurn("obj-nex-ent3-problem", "NONE", null));
    const why = resolveConversationalMove({
      meaning: null,
      subjectId: "obj-nex-ent3-problem",
      purpose: "WHY_PRESENT",
      coverage: "NONE",
      previousMove: "ANSWER",
      lastCapabilityRequest: null,
      lastCapabilityResult: "NONE",
      capabilities,
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
    });
    working = record(working, why);
    const thread = projectConversationThread({
      threads: working.threads,
      primarySubject: "obj-nex-ent3-problem",
      objective: "UNDERSTAND_SUBJECT",
      availablePurposes: ["IDENTIFY", "WHY_PRESENT", "COMPARE"],
    });
    assert.equal(thread.coveredPurposes.length, 2);
  });

  it("13. related-subject comparison stays available after a subject change", () => {
    const thread = projectConversationThread({
      threads: Object.freeze([]),
      primarySubject: "obj-nex-ent3-kpi",
      objective: "UNDERSTAND_SUBJECT",
      availablePurposes: ["IDENTIFY"],
      relatedSubjects: ["obj-nex-ent3-goal"],
    });
    assert.deepEqual([...thread.relatedSubjects], ["obj-nex-ent3-goal"]);
  });

  it("14-15. pending offer validity is thread-subject scoped", () => {
    const accepted = resolveConversationThreadMove({
      turn: identifyTurn("obj-nex-ent3-goal", "NONE", null),
      thread: projectConversationThread({
        threads: Object.freeze([]),
        primarySubject: "obj-nex-ent3-goal",
        objective: "UNDERSTAND_SUBJECT",
        availablePurposes: ["IDENTIFY"],
      }),
      capabilities,
      explicitRepeat: false,
      explicitAmbiguity: false,
      explicitRevisit: false,
      needsDifferentStrategy: false,
      pendingOfferAccepted: true,
    });
    assert.equal(accepted.reason, "PENDING_OFFER_STILL_VALID");
    const superseded = projectConversationThread({
      threads: Object.freeze([]),
      primarySubject: "obj-nex-ent3-kpi",
      objective: "UNDERSTAND_SUBJECT",
      availablePurposes: ["IDENTIFY"],
      superseded: true,
    });
    assert.equal(superseded.status, "SUPERSEDED");
  });

  it("16-17. suggested actions derive from covered purposes, not per-object templates", () => {
    const source = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../nexora-entrance/nexoraEntranceConversationContinuity.ts"),
      "utf8",
    );
    assert.doesNotMatch(source, /goalActionsAfterIdentify|goalActionsAfterWhy|problemActionsAfterIdentify/);
    assert.match(source, /covered\.has\("IDENTIFY"\)/);
  });

  it("18. failed SHOW is not treated as covered", () => {
    const thread = projectConversationThread({
      threads: Object.freeze([
        Object.freeze({
          subjectId: "lesson:FOCUS",
          purpose: "FOCUS" as const,
          coverage: "INTRODUCTORY" as const,
          lastMove: "SHOW" as const,
          lastCapabilityRequest: "SHOW" as const,
          lastCapabilityResult: "FAILED" as const,
        }),
      ]),
      primarySubject: "lesson:FOCUS",
      objective: "UNDERSTAND_STAGE",
      availablePurposes: ["FOCUS"],
    });
    assert.equal(thread.coveredPurposes.length, 0);
  });

  it("19. successful SHOW can be covered", () => {
    const thread = projectConversationThread({
      threads: Object.freeze([
        Object.freeze({
          subjectId: "lesson:FOCUS",
          purpose: "FOCUS" as const,
          coverage: "INTRODUCTORY" as const,
          lastMove: "SHOW" as const,
          lastCapabilityRequest: "SHOW" as const,
          lastCapabilityResult: "SUCCEEDED" as const,
        }),
      ]),
      primarySubject: "lesson:FOCUS",
      objective: "UNDERSTAND_STAGE",
      availablePurposes: ["FOCUS"],
    });
    assert.equal(thread.coveredPurposes[0]?.purpose, "FOCUS");
  });

  it("20. manager redirect supersedes the thread", () => {
    const thread = projectConversationThread({
      threads: Object.freeze([]),
      primarySubject: "obj-nex-ent3-goal",
      objective: "UNDERSTAND_SUBJECT",
      availablePurposes: ["IDENTIFY"],
      superseded: true,
    });
    assert.equal(thread.status, "SUPERSEDED");
  });

  it("21-22. Skip and ENT:10 do not introduce a transcript store", () => {
    assert.equal(NEXORA_CONVERSATION_THREAD_BOUNDARY.transcriptDatabase, false);
    assert.equal(NEXORA_CONVERSATION_THREAD_BOUNDARY.durableConversationMemory, false);
    assert.equal(NEXORA_CONVERSATION_THREAD_BOUNDARY.autoAdvancesLessons, false);
  });

  it("23. the same policy works on a normal executive subject", () => {
    const turn = identifyTurn("issue-capacity-gap", "NONE", null);
    const decision = resolveThreadIntelligence({
      working: emptyNexoraConversationWorkingContext(),
      turn,
      capabilities,
    });
    assert.equal(decision.resolvedMove, turn.move);
    assert.equal(decision.thread.primarySubject, "issue-capacity-gap");
    assert.equal(decision.thread.objective, "UNDERSTAND_SUBJECT");
  });

  it("24. collection conversation can hold an investigation objective", () => {
    const turn = resolveConversationalMove({
      meaning: null,
      subjectId: "collection:problems",
      purpose: "INVESTIGATE",
      coverage: "NONE",
      previousMove: null,
      lastCapabilityRequest: null,
      lastCapabilityResult: "NONE",
      capabilities: Object.freeze({ ...capabilities, investigate: true }),
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
    });
    const decision = resolveThreadIntelligence({
      working: emptyNexoraConversationWorkingContext(),
      turn,
      capabilities: Object.freeze({ ...capabilities, investigate: true }),
    });
    assert.equal(decision.thread.objective, "INVESTIGATE_SUBJECT");
  });

  it("25-29. thread intelligence does not write business truth", () => {
    assert.equal(NEXORA_CONVERSATION_THREAD_BOUNDARY.writesBusinessTruth, false);
    assert.equal(NEXORA_CONVERSATION_THREAD_BOUNDARY.writesDecision, false);
    assert.equal(NEXORA_CONVERSATION_THREAD_BOUNDARY.writesExecution, false);
    assert.equal(NEXORA_CONVERSATION_THREAD_BOUNDARY.secondAdvisor, false);
    assert.equal(NEXORA_CONVERSATION_THREAD_BOUNDARY.secondNlu, false);
  });

  it("30. duplicate-authority audit", () => {
    const dir = dirname(fileURLToPath(import.meta.url));
    const files = [
      "nexoraConversationThread.ts",
      "nexoraConversationThreadPolicy.ts",
      "nexoraConversationThreadApply.ts",
      "nexoraConversationThreadContract.ts",
    ];
    for (const file of files) {
      const source = readFileSync(join(dir, file), "utf8");
      assert.doesNotMatch(source, /goalLessonThreadTracker|ThreadSuggestedActionsV2|repeatCount/);
      assert.doesNotMatch(source, /if \(kind === "goal"\)/);
    }
  });

  it("explicit manager intent outranks proactive progression", () => {
    const why = resolveConversationalMove({
      meaning: null,
      subjectId: "obj-nex-ent3-goal",
      purpose: "WHY_PRESENT",
      coverage: "NONE",
      previousMove: "CLARIFY",
      lastCapabilityRequest: null,
      lastCapabilityResult: "NONE",
      capabilities,
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
    });
    const decision = resolveThreadIntelligence({
      working: record(
        emptyNexoraConversationWorkingContext(),
        identifyTurn("obj-nex-ent3-goal", "PRACTICAL", "CONNECT"),
      ),
      turn: why,
      capabilities,
      explicitRevisit: true,
    });
    assert.equal(decision.resolvedMove, why.move);
    assert.equal(decision.reason, "EXPLICIT_MANAGER_INTENT");
  });

  it("does not hardcode a Goal curriculum", () => {
    const available = availablePurposesForUnderstandSubject({
      compare: false,
      whyPresent: false,
    });
    assert.deepEqual([...available], ["IDENTIFY"]);
  });
});
