/**
 * B.36 — Domain-aware review / synthesis mapping.
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { NexoraPilotReview } from "./nexoraPilotReview.ts";
import type { NexoraPilotSynthesis } from "./nexoraPilotSynthesis.ts";
import {
  mapReviewByDomain,
  mapSynthesisByDomain,
  normalizeReviewDomain,
} from "./nexoraReviewDomain.ts";

const sampleGenericReview: NexoraPilotReview = {
  summary: "Nexora is promising for pilot, but users are not completing the learning loop.",
  weaknesses: ["Users are not exploring scenarios enough", "Learning loop is weak"],
  strengths: ["Decision quality is improving over time"],
  recommendations: ["Improve compare clarity and visibility", "Improve outcome recording flow"],
};

test("generic: mapReviewByDomain is identity", () => {
  const out = mapReviewByDomain(sampleGenericReview, "generic");
  assert.equal(out, sampleGenericReview);
});

test("retail: review weaknesses and recommendations map", () => {
  const r = mapReviewByDomain(sampleGenericReview, "retail");
  assert.ok(r.weaknesses.includes("Operators are not comparing operational paths enough"));
  assert.ok(r.weaknesses.includes("Operational feedback loop is weak"));
  assert.ok(r.recommendations.includes("Improve visibility of operational options"));
  assert.ok(r.recommendations.includes("Improve execution outcome capture flow"));
  assert.ok(r.strengths.includes("Operational decision quality is improving over time"));
  assert.ok(r.summary.includes("operators"));
});

test("supply_chain: review maps flow language", () => {
  const r = mapReviewByDomain(sampleGenericReview, "supply_chain");
  assert.ok(r.weaknesses.some((w) => w.includes("Flow scenarios")));
  assert.ok(r.summary.includes("downstream"));
});

test("finance: review maps risk language", () => {
  const r = mapReviewByDomain(sampleGenericReview, "finance");
  assert.ok(r.weaknesses.some((w) => w.includes("Risk paths")));
  assert.ok(/outcome tracking/i.test(r.summary));
});

test("psych_yung: review maps interpretive language", () => {
  const r = mapReviewByDomain(sampleGenericReview, "psych_yung");
  assert.ok(r.weaknesses.some((w) => w.includes("Interpretive paths")));
  assert.ok(r.summary.includes("reflection"));
});

const sampleGenericSynthesis: NexoraPilotSynthesis = {
  overallStatus: "moderate",
  summary: "Nexora is analytically strong but user engagement is still shallow.",
  keyFindings: ["Users are not exploring scenarios", "Decision engagement is low"],
  priorities: ["Improve compare visibility", "Improve outcome capture UX"],
};

test("synthesis summary and lines change by domain", () => {
  const fin = mapSynthesisByDomain(sampleGenericSynthesis, "finance");
  assert.equal(
    fin.summary,
    "Risk analysis is stable, but decision engagement is limited.",
  );
  assert.ok(fin.keyFindings[0].includes("Risk paths"));
  assert.ok(fin.priorities[0].includes("risk scenarios"));

  const psych = mapSynthesisByDomain(sampleGenericSynthesis, "psych_yung");
  assert.ok(psych.summary.includes("Interpretive structure"));
  assert.ok(psych.keyFindings[0].includes("Interpretive paths"));
});

test("deterministic: repeated mapping is stable", () => {
  const a = mapSynthesisByDomain(sampleGenericSynthesis, "retail");
  const b = mapSynthesisByDomain(sampleGenericSynthesis, "retail");
  assert.deepEqual(a, b);
  assert.equal(normalizeReviewDomain("unknown_domain_xyz"), "generic");
});
