/**
 * B.29 — Pilot review builder (deterministic).
 */

import test from "node:test";
import assert from "node:assert/strict";

import { buildNexoraPilotReview, type NexoraPilotReviewInput } from "./nexoraPilotReview.ts";

test("buildNexoraPilotReview: learning loop weakness + example summary", () => {
  const input: NexoraPilotReviewInput = {
    metrics: {
      totalRuns: 4,
      completedRuns: 0,
      compareRate: 0.75,
      decisionRate: 0.6,
      outcomeRate: 0.1,
      errorRate: 0.05,
    },
    quality: null,
    validation: { passRate: 0.9 },
  };
  const r = buildNexoraPilotReview(input);
  assert.ok(r.weaknesses.some((w) => w.includes("Learning loop")));
  assert.equal(r.summary, "Nexora is promising for pilot, but users are not completing the learning loop.");
});

test("buildNexoraPilotReview: reliability + validation summary line", () => {
  const input: NexoraPilotReviewInput = {
    metrics: {
      totalRuns: 3,
      completedRuns: 0,
      compareRate: 0.5,
      decisionRate: 0.4,
      outcomeRate: 0.2,
      errorRate: 0.2,
    },
    quality: null,
    validation: { passRate: 0.5 },
  };
  const r = buildNexoraPilotReview(input);
  assert.equal(r.summary, "Nexora is improving, but reliability and validation still need work.");
});
