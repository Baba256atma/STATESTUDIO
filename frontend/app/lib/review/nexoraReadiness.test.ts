/**
 * B.30 — Readiness gate (deterministic).
 */

import test from "node:test";
import assert from "node:assert/strict";

import { buildNexoraReadinessReport, type NexoraReadinessBuilderInput } from "./nexoraReadiness.ts";
import type { NexoraMetricsSummary } from "../metrics/nexoraMetrics.ts";

function m(partial: Partial<NexoraMetricsSummary>): NexoraMetricsSummary {
  return {
    totalRuns: 5,
    completedRuns: 1,
    compareRate: 0.7,
    decisionRate: 0.6,
    outcomeRate: 0.4,
    errorRate: 0.05,
    ...partial,
  };
}

test("buildNexoraReadinessReport: hard blocker validation < 0.6 → not_ready", () => {
  const input: NexoraReadinessBuilderInput = {
    metrics: m({}),
    quality: null,
    validation: { passRate: 0.5 },
  };
  const r = buildNexoraReadinessReport(input);
  assert.equal(r.status, "not_ready");
  assert.ok(r.blockers.includes("Core analysis is not reliable"));
});

test("buildNexoraReadinessReport: hard blocker errorRate > 0.25", () => {
  const input: NexoraReadinessBuilderInput = {
    metrics: m({ errorRate: 0.3, compareRate: 0.9, decisionRate: 0.9, outcomeRate: 0.9 }),
    quality: null,
    validation: { passRate: 0.9 },
  };
  const r = buildNexoraReadinessReport(input);
  assert.equal(r.status, "not_ready");
  assert.ok(r.blockers.some((b) => b.includes("reliability")));
});

test("buildNexoraReadinessReport: hard blocker quality low", () => {
  const input: NexoraReadinessBuilderInput = {
    metrics: m({}),
    quality: {
      score: 0.2,
      qualityTier: "low",
      trend: "stable",
      successfulRuns: 0,
      failedRuns: 0,
      totalRatedRuns: 0,
      summary: "x",
    },
    validation: { passRate: 0.9 },
  };
  const r = buildNexoraReadinessReport(input);
  assert.equal(r.status, "not_ready");
  assert.ok(r.blockers.some((b) => b.includes("quality")));
});

test("buildNexoraReadinessReport: all soft checks pass → ready", () => {
  const input: NexoraReadinessBuilderInput = {
    metrics: m({
      compareRate: 0.65,
      decisionRate: 0.55,
      outcomeRate: 0.35,
      errorRate: 0.1,
    }),
    quality: {
      score: 0.7,
      qualityTier: "high",
      trend: "stable",
      successfulRuns: 2,
      failedRuns: 0,
      totalRatedRuns: 2,
      summary: "ok",
    },
    validation: { passRate: 0.8 },
  };
  const r = buildNexoraReadinessReport(input);
  assert.equal(r.status, "ready");
  assert.ok(r.score >= 0.75);
  assert.equal(r.blockers.length, 0);
});
