/**
 * @import assert from "node:assert/strict";
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildSessionSummary,
  formatSessionSummary,
  type NexoraSessionSummary,
} from "./nexoraSessionSummary.ts";

const headline = { headline: "Focus line from B.45" };
const actions = [
  { title: "First action from B.44", description: "d", priority: "high" as const },
  { title: "Second", description: "d2", priority: "medium" as const },
];

describe("nexoraSessionSummary (B.48)", () => {
  it("full summary: feedback + quality + actions", () => {
    const s = buildSessionSummary({
      headline,
      actions,
      feedbackSummary: { helpfulRate: 0.7, confusionRate: 0.05 },
      quality: { tier: "high", trend: "stable" },
    });
    assert.equal(s.focus, "Focus line from B.45");
    assert.equal(s.outcome, "Results were useful.");
    assert.equal(s.insight, "Analysis completed successfully.");
    assert.equal(s.nextAction, "First action from B.44");
  });

  it("no feedback: omits outcome", () => {
    const s = buildSessionSummary({
      headline,
      actions,
      feedbackSummary: null,
      quality: { tier: "high", trend: "stable" },
    });
    assert.equal(s.outcome, undefined);
  });

  it("high confusion outcome beats ambiguous middle band", () => {
    const s = buildSessionSummary({
      headline,
      actions,
      feedbackSummary: { helpfulRate: 0.4, confusionRate: 0.25 },
      quality: null,
    });
    assert.equal(s.outcome, "Results were unclear.");
  });

  it("no actions: nextAction fallback", () => {
    const s = buildSessionSummary({
      headline,
      actions: [],
      feedbackSummary: null,
      quality: null,
    });
    assert.equal(s.nextAction, "No immediate action required.");
  });

  it("low quality: insight priority over improving trend", () => {
    const s = buildSessionSummary({
      headline,
      actions,
      feedbackSummary: null,
      quality: { tier: "low", trend: "improving" },
    });
    assert.equal(s.insight, "Decision quality needs improvement.");
  });

  it("improving trend when quality not low", () => {
    const s = buildSessionSummary({
      headline,
      actions,
      feedbackSummary: null,
      quality: { tier: "medium", trend: "improving" },
    });
    assert.equal(s.insight, "System is improving.");
  });

  it("formatSessionSummary omits empty outcome and is deterministic", () => {
    const a: NexoraSessionSummary = {
      focus: "F",
      insight: "I",
      nextAction: "N",
    };
    const b: NexoraSessionSummary = { ...a, outcome: "O" };
    const fa = formatSessionSummary(a);
    const fb = formatSessionSummary(b);
    assert.equal(fa, formatSessionSummary(a));
    assert.ok(!fa.includes("Outcome:"));
    assert.ok(fb.includes("Outcome:"));
    assert.ok(fb.includes("O"));
  });

  it("buildSessionSummary is deterministic for identical inputs", () => {
    const input = {
      headline,
      actions,
      feedbackSummary: { helpfulRate: 0.2, confusionRate: 0.1 } as const,
      quality: { tier: "high" as const, trend: "stable" as const },
    };
    const s1 = buildSessionSummary(input);
    const s2 = buildSessionSummary(input);
    assert.deepEqual(s1, s2);
  });
});
