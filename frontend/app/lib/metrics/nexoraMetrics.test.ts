/**
 * B.28 — Metrics summary + drop-off helpers.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildNexoraMetricDropoffs,
  buildNexoraMetricsSummary,
  describeBiggestMetricsDropoff,
  type NexoraMetricRecord,
} from "./nexoraMetrics.ts";

test("buildNexoraMetricsSummary: empty → zeros", () => {
  const s = buildNexoraMetricsSummary([]);
  assert.equal(s.totalRuns, 0);
  assert.equal(s.completedRuns, 0);
  assert.equal(s.compareRate, 0);
  assert.equal(s.decisionRate, 0);
  assert.equal(s.outcomeRate, 0);
  assert.equal(s.errorRate, 0);
});

test("buildNexoraMetricsSummary: rates vs inputs", () => {
  const rows: NexoraMetricRecord[] = [
    { event: "input_submitted", timestamp: 1, mode: "adaptive" },
    { event: "input_submitted", timestamp: 2, mode: "adaptive" },
    { event: "compare_opened", timestamp: 3 },
    { event: "decision_made", timestamp: 4 },
    { event: "outcome_recorded", timestamp: 5 },
    { event: "error_occurred", timestamp: 6 },
  ];
  const s = buildNexoraMetricsSummary(rows);
  assert.equal(s.totalRuns, 2);
  assert.equal(s.completedRuns, 1);
  assert.equal(s.compareRate, 0.5);
  assert.equal(s.decisionRate, 0.5);
  assert.equal(s.outcomeRate, 0.5);
  assert.equal(s.errorRate, 0.5);
});

test("describeBiggestMetricsDropoff: picks Compare → Decision when compares never convert to decisions", () => {
  const rows: NexoraMetricRecord[] = [
    { event: "input_submitted", timestamp: 1 },
    { event: "analysis_completed", timestamp: 2 },
    { event: "input_submitted", timestamp: 3 },
    { event: "analysis_completed", timestamp: 4 },
    { event: "compare_opened", timestamp: 5 },
    { event: "compare_opened", timestamp: 6 },
  ];
  const msg = describeBiggestMetricsDropoff(rows);
  assert.ok(msg.includes("Compare → Decision"), msg);
});
