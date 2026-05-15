import test from "node:test";
import assert from "node:assert/strict";

import {
  lifecycleFromMonitoring,
  monitoringStatusFromUrgency,
  monitoringTrendFromInputs,
  scoreMonitoringUrgency,
} from "./scoreMonitoringUrgency.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";

const timeline: TimelineIntelligence = {
  id: "timeline_supplier",
  title: "Supplier timeline",
  summary: "Supplier pressure is degrading.",
  relatedObjectIds: ["supplier"],
  trend: "degrading",
  momentumScore: 0.82,
  confidence: 0.86,
  domainId: "supply_chain",
  createdAt: 0,
};

const memory: StrategicMemoryRecord = {
  id: "memory_supplier",
  category: "dependency",
  title: "Supplier dependency recurrence",
  summary: "Supplier dependency has remained recurring.",
  relatedObjectIds: ["supplier", "inventory"],
  severity: "high",
  confidence: 0.84,
  recurrenceCount: 3,
  firstObservedAt: 0,
  lastObservedAt: 4,
  domainId: "supply_chain",
};

test("monitoring urgency is stable and clamped", () => {
  const score = scoreMonitoringUrgency({
    timeline,
    memory,
    propagationHints: [
      { sourceObjectId: "supplier", targetObjectId: "inventory", propagationStrength: 0.8, propagationType: "dependency" },
      { sourceObjectId: "inventory", targetObjectId: "delivery", propagationStrength: 0.72, propagationType: "delay" },
    ],
    fragility: { objectId: "supplier", score: 82, level: "critical" },
  });
  assert.equal(score, scoreMonitoringUrgency({
    timeline,
    memory,
    propagationHints: [
      { sourceObjectId: "supplier", targetObjectId: "inventory", propagationStrength: 0.8, propagationType: "dependency" },
      { sourceObjectId: "inventory", targetObjectId: "delivery", propagationStrength: 0.72, propagationType: "delay" },
    ],
    fragility: { objectId: "supplier", score: 82, level: "critical" },
  }));
  assert.ok(score >= 0);
  assert.ok(score <= 1);
  assert.equal(monitoringStatusFromUrgency(score), "critical");
});

test("monitoring status trend and lifecycle mappings are calm", () => {
  assert.equal(monitoringStatusFromUrgency(0.12), "stable");
  assert.equal(monitoringStatusFromUrgency(0.4), "watch");
  assert.equal(monitoringStatusFromUrgency(0.7), "elevated");
  assert.equal(monitoringTrendFromInputs({ timeline }), "degrading");
  assert.equal(monitoringTrendFromInputs({ timeline: { ...timeline, trend: "improving" } }), "improving");
  assert.equal(lifecycleFromMonitoring({ status: "elevated", recurrenceCount: 3 }), "persistent");
  assert.equal(lifecycleFromMonitoring({ status: "stable", trend: "improving" }), "recovering");
});
