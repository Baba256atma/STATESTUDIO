/**
 * NEX-CONV:1 — Conversation Kernel focused tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  NEXORA_CONVERSATION_KERNEL_BOUNDARY,
  verifyNexoraConversationKernel,
} from "./nexoraConversationKernelContract.ts";
import {
  conversationPurposeFromMeaning,
  emptyConversationCapabilities,
  resolveConversationalMove,
} from "./nexoraConversationPolicy.ts";
import { conversationMoveDiagnosticsOf } from "./nexoraConversationDiagnostics.ts";
import {
  coverageOf,
  emptyNexoraConversationWorkingContext,
  recordConversationKernelDecision,
} from "./nexoraConversationWorkingContext.ts";

const capabilities = Object.freeze({
  ...emptyConversationCapabilities(),
  compare: true,
  offerNext: true,
  connect: true,
});

function turn(input: Parameters<typeof resolveConversationalMove>[0]) {
  return resolveConversationalMove(input);
}

describe("NEX-CONV:1 Conversation Kernel", () => {
  it("identity and boundary", () => {
    assert.equal(verifyNexoraConversationKernel().ok, true);
    assert.equal(NEXORA_CONVERSATION_KERNEL_BOUNDARY.secondNlu, false);
    assert.equal(NEXORA_CONVERSATION_KERNEL_BOUNDARY.secondAdvisor, false);
    assert.equal(NEXORA_CONVERSATION_KERNEL_BOUNDARY.writesDecision, false);
    assert.equal(NEXORA_CONVERSATION_KERNEL_BOUNDARY.repeatCountLadder, false);
    assert.equal(NEXORA_CONVERSATION_KERNEL_BOUNDARY.autoAdvancesLessons, false);
  });

  it("progresses the same subject/purpose without a repeat count", () => {
    const a1 = turn({
      meaning: null,
      subjectId: "obj-nex-ent3-goal",
      purpose: "IDENTIFY",
      coverage: "NONE",
      previousMove: null,
      lastCapabilityRequest: null,
      lastCapabilityResult: "NONE",
      capabilities,
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
    });
    const a2 = turn({ ...a1, coverage: a1.progression, previousMove: a1.move, meaning: null, lastCapabilityRequest: null, lastCapabilityResult: "NONE", capabilities, explicitRepeat: false, materialContextChanged: false, pendingOfferAccepted: false, subjectId: a1.subjectId, purpose: a1.purpose });
    const a3 = turn({ ...a2, coverage: a2.progression, previousMove: a2.move, meaning: null, lastCapabilityRequest: null, lastCapabilityResult: "NONE", capabilities, explicitRepeat: false, materialContextChanged: false, pendingOfferAccepted: false, subjectId: a1.subjectId, purpose: a1.purpose });
    const a4 = turn({ ...a3, coverage: a3.progression, previousMove: a3.move, meaning: null, lastCapabilityRequest: null, lastCapabilityResult: "NONE", capabilities, explicitRepeat: false, materialContextChanged: false, pendingOfferAccepted: false, subjectId: a1.subjectId, purpose: a1.purpose });
    assert.equal(a1.move, "ANSWER");
    assert.equal(a2.move, "DEEPEN");
    assert.ok(a3.move === "CONNECT" || a3.move === "OFFER_NEXT");
    assert.equal(a4.move, "CLARIFY");
    assert.equal(a4.progression, "SATURATED");
  });

  it("scopes coverage by subject and purpose", () => {
    let working = emptyNexoraConversationWorkingContext();
    const goal = turn({
      meaning: null,
      subjectId: "obj-nex-ent3-goal",
      purpose: "IDENTIFY",
      coverage: "NONE",
      previousMove: null,
      lastCapabilityRequest: null,
      lastCapabilityResult: "NONE",
      capabilities,
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
    });
    working = recordConversationKernelDecision(working, goal);
    const saturated = turn({
      meaning: null,
      subjectId: "obj-nex-ent3-goal",
      purpose: "IDENTIFY",
      coverage: "PRACTICAL",
      previousMove: "CONNECT",
      lastCapabilityRequest: "COMPARE",
      lastCapabilityResult: "NONE",
      capabilities,
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
    });
    working = recordConversationKernelDecision(working, saturated);
    assert.equal(coverageOf(working, "obj-nex-ent3-goal", "IDENTIFY"), "SATURATED");
    assert.equal(coverageOf(working, "obj-nex-ent3-problem", "IDENTIFY"), "NONE");
    assert.equal(coverageOf(working, "obj-nex-ent3-goal", "WHY_PRESENT"), "NONE");
    const why = turn({
      meaning: null,
      subjectId: "obj-nex-ent3-goal",
      purpose: "WHY_PRESENT",
      coverage: coverageOf(working, "obj-nex-ent3-goal", "WHY_PRESENT"),
      previousMove: saturated.move,
      lastCapabilityRequest: null,
      lastCapabilityResult: "NONE",
      capabilities,
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
    });
    assert.equal(why.move, "EXPLAIN_WHY");
    const problem = turn({
      meaning: null,
      subjectId: "obj-nex-ent3-problem",
      purpose: "IDENTIFY",
      coverage: coverageOf(working, "obj-nex-ent3-problem", "IDENTIFY"),
      previousMove: saturated.move,
      lastCapabilityRequest: null,
      lastCapabilityResult: "NONE",
      capabilities,
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
    });
    assert.equal(problem.move, "ANSWER");
  });

  it("preserves explicit repeat and does not treat SHOW as demonstrated when failed", () => {
    const repeated = turn({
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
    assert.equal(repeated.move, "REPEAT");
    assert.equal(repeated.progression, "INTRODUCTORY");
    const unsupported = turn({
      meaning: null,
      subjectId: "obj-nex-ent3-goal",
      purpose: "IDENTIFY",
      coverage: "DEEPENED",
      previousMove: "DEEPEN",
      lastCapabilityRequest: "SHOW",
      lastCapabilityResult: "FAILED",
      capabilities: emptyConversationCapabilities(),
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
    });
    assert.notEqual(unsupported.move, "SHOW");
    assert.equal(unsupported.requestedCapability, null);
  });

  it("consumes NCA meaning for purpose and keeps diagnostics out of copy", () => {
    assert.equal(
      conversationPurposeFromMeaning({
        communicativeIntent: "ASK_WHY",
        requestedOperation: "NONE",
        questionType: "GOAL_RELEVANCE",
      }),
      "WHY_RELEVANT",
    );
    assert.equal(
      conversationPurposeFromMeaning({
        communicativeIntent: "ASK_EXPLANATION",
        requestedOperation: "EXPLAIN",
        questionType: "EXPLANATION",
      }),
      "IDENTIFY",
    );
    const decision = turn({
      meaning: null,
      subjectId: "obj-goal",
      purpose: "IDENTIFY",
      coverage: "INTRODUCTORY",
      previousMove: "ANSWER",
      lastCapabilityRequest: null,
      lastCapabilityResult: "NONE",
      capabilities,
      explicitRepeat: false,
      materialContextChanged: false,
      pendingOfferAccepted: false,
    });
    const diagnostics = conversationMoveDiagnosticsOf(decision, "INTRODUCTORY");
    assert.equal(diagnostics.readOnly, true);
    assert.equal(diagnostics.move, "DEEPEN");
    assert.equal(
      diagnostics.reason.includes("PRIOR_IDENTITY"),
      true,
    );
  });

  it("does not introduce phrase matching or per-object repeat patches in the kernel", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const policy = readFileSync(join(here, "nexoraConversationPolicy.ts"), "utf8");
    assert.equal(policy.includes('includes("what is this")'), false);
    assert.equal(policy.includes('includes("why")'), false);
    assert.equal(/repeatCount/.test(policy), false);
    assert.equal(/object\.type === "PROBLEM"/.test(policy), false);
    assert.equal(/goalRepeat2/.test(policy), false);
  });
});
