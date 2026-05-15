import test from "node:test";
import assert from "node:assert/strict";

import {
  buildMonitoringAttention,
  buildMonitoringSummary,
  buildMonitoringTitle,
  describeMonitoringLifecycle,
} from "./monitoringNarratives.ts";

test("monitoring narratives are executive and low-noise", () => {
  const title = buildMonitoringTitle({ status: "elevated", focus: "Supplier dependency pressure" });
  const summary = buildMonitoringSummary({ status: "elevated", trend: "degrading", focus: "Supplier dependency pressure" });
  const attention = buildMonitoringAttention({ status: "critical", focus: "Supplier dependency pressure" });

  assert.equal(title, "Supplier dependency pressure remains elevated");
  assert.ok(summary.includes("calm executive attention"));
  assert.ok(attention.includes("active executive review"));
});

test("monitoring lifecycle language is stable", () => {
  assert.ok(describeMonitoringLifecycle("persistent").includes("persisted"));
  assert.ok(describeMonitoringLifecycle("recovering").includes("easing"));
  assert.ok(describeMonitoringLifecycle("resolved").includes("passive monitoring"));
});
