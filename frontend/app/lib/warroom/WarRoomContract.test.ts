import test from "node:test";
import assert from "node:assert/strict";

import {
  buildWarRoomAlert,
  buildWarRoomPriority,
  buildWarRoomSignal,
  buildWarRoomSnapshot,
  W1_CONTRACT_COMPLETE_TAG,
  WAR_ROOM_CONTRACT,
  WAR_ROOM_CONTRACT_DIAGNOSTIC,
  WAR_ROOM_READY_DIAGNOSTIC,
} from "./WarRoomContract.ts";

test("exports W1 war room contract tag and diagnostics", () => {
  assert.equal(W1_CONTRACT_COMPLETE_TAG, "[W1_CONTRACT_COMPLETE]");
  assert.equal(WAR_ROOM_CONTRACT_DIAGNOSTIC, "[WAR_ROOM_CONTRACT]");
  assert.equal(WAR_ROOM_READY_DIAGNOSTIC, "[WAR_ROOM_READY]");
  assert.equal(WAR_ROOM_CONTRACT.executiveMonitoring, true);
  assert.equal(WAR_ROOM_CONTRACT.signalAggregation, true);
  assert.equal(WAR_ROOM_CONTRACT.priorityTracking, true);
  assert.equal(WAR_ROOM_CONTRACT.readOnly, true);
  assert.equal(WAR_ROOM_CONTRACT.mutation, false);
});

test("builds immutable war room signals alerts priorities and snapshot", () => {
  const signal = buildWarRoomSignal({
    signalId: "signal-1",
    source: "risk",
    sourceId: "risk-supplier",
    severity: "critical",
    title: "Supplier risk elevated",
    detail: "Supplier risk has crossed executive threshold.",
    confidence: 120,
    timestamp: "2026-06-18T00:00:00.000Z",
  });
  const alert = buildWarRoomAlert({
    alertId: "alert-1",
    signalIds: [signal.signalId],
    status: "open",
    severity: "critical",
    title: "Critical supplier alert",
    detail: "Executive monitoring alert.",
    createdAt: "2026-06-18T00:00:00.000Z",
  });
  const priority = buildWarRoomPriority({
    priorityId: "priority-1",
    level: "critical",
    rank: 1,
    title: "Stabilize supplier risk",
    rationale: "Critical signal has active open alert.",
    relatedSignalIds: [signal.signalId],
    relatedAlertIds: [alert.alertId],
  });
  const snapshot = buildWarRoomSnapshot({
    snapshotId: "snapshot-1",
    generatedAt: "2026-06-18T00:01:00.000Z",
    signals: [signal],
    alerts: [alert],
    priorities: [priority],
  });

  assert.equal(signal.confidence, 100);
  assert.equal(snapshot.signalCount, 1);
  assert.equal(snapshot.alertCount, 1);
  assert.equal(snapshot.priorityCount, 1);
  assert.equal(snapshot.criticalSignalCount, 1);
  assert.equal(snapshot.openAlertCount, 1);
  assert.equal(snapshot.highestPriority?.priorityId, "priority-1");
  assert.equal(snapshot.sceneMutation, false);
  assert.equal(snapshot.topologyMutation, false);
  assert.equal(snapshot.routingMutation, false);
  assert.equal(snapshot.dsMutation, false);
  assert.equal(Object.isFrozen(signal), true);
  assert.equal(Object.isFrozen(alert.signalIds), true);
  assert.equal(Object.isFrozen(priority.relatedSignalIds), true);
  assert.equal(Object.isFrozen(snapshot), true);
  assert.equal(Object.isFrozen(snapshot.signals), true);
  assert.throws(() => {
    (snapshot.signals as unknown as object[]).push({});
  }, TypeError);
});

test("tracks highest priority without mutating input order", () => {
  const lowPriority = buildWarRoomPriority({
    priorityId: "low",
    level: "low",
    rank: 1,
    title: "Low priority",
    rationale: "Monitor only.",
    relatedSignalIds: [],
    relatedAlertIds: [],
  });
  const criticalPriority = buildWarRoomPriority({
    priorityId: "critical",
    level: "critical",
    rank: 99,
    title: "Critical priority",
    rationale: "Immediate executive attention.",
    relatedSignalIds: [],
    relatedAlertIds: [],
  });
  const priorities = Object.freeze([lowPriority, criticalPriority]);
  const before = JSON.stringify(priorities);

  const snapshot = buildWarRoomSnapshot({
    snapshotId: "priority-snapshot",
    generatedAt: "2026-06-18T00:02:00.000Z",
    signals: [],
    alerts: [],
    priorities,
  });

  assert.equal(snapshot.highestPriority?.priorityId, "critical");
  assert.deepEqual(snapshot.priorities.map((priority) => priority.priorityId), ["critical", "low"]);
  assert.equal(JSON.stringify(priorities), before);
});
