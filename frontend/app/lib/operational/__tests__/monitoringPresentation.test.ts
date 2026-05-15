import assert from "node:assert/strict";
import test from "node:test";

import {
  getMonitoringStatusLabel,
  getMonitoringStatusTone,
  getMonitoringTrendLabel,
  getMonitoringTrendTone,
} from "../monitoringPresentation.ts";

test("known statuses return stable labels", () => {
  assert.equal(getMonitoringStatusLabel("idle"), "Idle");
  assert.equal(getMonitoringStatusLabel("critical"), "Critical");
  assert.equal(getMonitoringStatusLabel("recovering"), "Recovering");
});

test("unknown or invalid status returns Unknown label", () => {
  assert.equal(getMonitoringStatusLabel(""), "Unknown");
  assert.equal(getMonitoringStatusLabel("not-a-real-status"), "Unknown");
});

test("known trends return stable labels", () => {
  assert.equal(getMonitoringTrendLabel("stable"), "Stable");
  assert.equal(getMonitoringTrendLabel("degrading"), "Degrading");
  assert.equal(getMonitoringTrendLabel("volatile"), "Volatile");
});

test("unknown or invalid trend returns Unknown label", () => {
  assert.equal(getMonitoringTrendLabel(""), "Unknown");
  assert.equal(getMonitoringTrendLabel("whiplash"), "Unknown");
});

test("tones return safe fallback values", () => {
  assert.equal(getMonitoringStatusTone("idle"), "neutral");
  assert.equal(getMonitoringStatusTone("critical"), "critical");
  assert.equal(getMonitoringStatusTone("recovering"), "positive");
  assert.equal(getMonitoringStatusTone("not-real"), "neutral");
  assert.equal(getMonitoringTrendTone("improving"), "positive");
  assert.equal(getMonitoringTrendTone("unknown"), "neutral");
  assert.equal(getMonitoringTrendTone("nope"), "neutral");
});
