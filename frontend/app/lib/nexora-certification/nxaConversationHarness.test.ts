import assert from "node:assert/strict";
import test from "node:test";
import { NXA_CERTIFIED_CONVERSATION_CASES, NXA_HARNESS_INVALID_SYNTHETIC_CASE } from "./nxaConversationCertifiedCases.ts";
import { NXA_CONVERSATION_CASE_FAMILIES } from "./nxaConversationFixtureSchema.ts";
import { runConversationCase, runConversationHarness } from "./nxaConversationHarness.ts";
import { NXA_FUNNEL_LEVELS } from "./nxaTestFunnel.ts";

test("certified seed cases pass in deterministic order", () => {
  const first = runConversationHarness(NXA_CERTIFIED_CONVERSATION_CASES);
  const second = runConversationHarness(NXA_CERTIFIED_CONVERSATION_CASES);
  assert.equal(first.passed, true, first.cases.find((item) => !item.passed)?.diagnostic);
  assert.equal(first.totals.skipped, 0);
  assert.deepEqual(first.cases.map((item) => item.id), second.cases.map((item) => item.id));
  assert.deepEqual(
    NXA_CONVERSATION_CASE_FAMILIES.every((family) =>
      NXA_CERTIFIED_CONVERSATION_CASES.some((item) => item.families.includes(family)),
    ),
    true,
  );
});

test("invalid synthetic fixture is excluded from the certified set and fails at turn 0 as a Stage-effect error", () => {
  assert.equal(NXA_CERTIFIED_CONVERSATION_CASES.some((item) => item.id === NXA_HARNESS_INVALID_SYNTHETIC_CASE.id), false);
  const result = runConversationCase(NXA_HARNESS_INVALID_SYNTHETIC_CASE);
  assert.equal(result.passed, false);
  assert.equal(result.firstFailingTurn, 0);
  assert.equal(result.turns[0]?.failureKind, "stage-effect");
});

test("response failure is distinct from Stage-effect failure", () => {
  const result = runConversationCase({
    ...NXA_CERTIFIED_CONVERSATION_CASES[2]!,
    id: "prep-response-fail",
    turns: Object.freeze([
      Object.freeze({
        utterance: "show problems",
        expect: Object.freeze({
          responseIncludes: Object.freeze(["this-phrase-is-not-in-any-certified-reply"]),
          stageEffect: "collection" as const,
        }),
      }),
    ]),
  });
  assert.equal(result.turns[0]?.failureKind, "response");
  assert.equal(result.passed, false);
});

test("harness uses isolated runtime state per case", () => {
  const a = runConversationCase(NXA_CERTIFIED_CONVERSATION_CASES[1]!);
  const b = runConversationCase(NXA_CERTIFIED_CONVERSATION_CASES[1]!);
  assert.equal(a.passed, true);
  assert.equal(b.passed, true);
  assert.equal(a.turns[0]?.path.focusId, b.turns[0]?.path.focusId);
});

test("funnel catalog has four levels, no skips, and Level 4 is last", () => {
  assert.equal(NXA_FUNNEL_LEVELS[1].name, "Focused");
  assert.equal(NXA_FUNNEL_LEVELS[4].recommendedNext, null);
  assert.ok(NXA_FUNNEL_LEVELS[4].commands.every((item) => item.required));
});
