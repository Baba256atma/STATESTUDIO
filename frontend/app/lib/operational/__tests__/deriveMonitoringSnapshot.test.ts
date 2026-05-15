import assert from "node:assert/strict";
import test from "node:test";

import type { NormalizedExternalOperationalSignal } from "../../connectors/externalSignalTypes.ts";
import { deriveOperationalMonitoringSnapshot } from "../deriveMonitoringSnapshot.ts";

function baseSignal(
  overrides: Partial<NormalizedExternalOperationalSignal> & Pick<NormalizedExternalOperationalSignal, "id">
): NormalizedExternalOperationalSignal {
  return {
    sourceConnectorId: "manual",
    signalType: "operational_signal",
    severity: 0.3,
    objectHints: [],
    domainHints: ["general"],
    ingestionSignature: `sig-${overrides.id}`,
    timestamp: 1_700_000_000_000,
    payload: null,
    ...overrides,
  };
}

test("empty input returns idle snapshot", () => {
  const snap = deriveOperationalMonitoringSnapshot({ records: [] });
  assert.equal(snap.status, "idle");
  assert.equal(snap.trend, "unknown");
  assert.equal(snap.signals.length, 0);
  assert.deepEqual([...snap.affectedObjectIds], []);
  assert.equal(snap.summary.includes("No live operational signals"), true);
  assert.equal(snap.recommendedFocus.includes("Connect or upload"), true);
});

test("high severity event yields critical status", () => {
  const snap = deriveOperationalMonitoringSnapshot({
    records: [
      baseSignal({
        id: "a",
        severity: 0.92,
        signalType: "operational_instability",
        objectHints: ["obj-1"],
      }),
    ],
  });
  assert.equal(snap.status, "critical");
  assert.ok(snap.signals[0]?.severity <= 1);
});

test("affectedObjectIds are deduped", () => {
  const snap = deriveOperationalMonitoringSnapshot({
    records: [
      baseSignal({ id: "1", objectHints: ["x", "y"], timestamp: 1 }),
      baseSignal({ id: "2", objectHints: ["y", "z"], timestamp: 2 }),
    ],
  });
  assert.deepEqual([...snap.affectedObjectIds].sort(), ["x", "y", "z"]);
});

test("severity is clamped to 0..1", () => {
  const snap = deriveOperationalMonitoringSnapshot({
    records: [baseSignal({ id: "hot", severity: 2.5 })],
  });
  assert.equal(snap.signals[0]?.severity, 1);
  assert.equal(snap.status, "critical");
});

test("topRiskObjectId follows highest-severity weighted hints", () => {
  const snap = deriveOperationalMonitoringSnapshot({
    records: [
      baseSignal({
        id: "low",
        severity: 0.2,
        objectHints: ["alpha"],
        timestamp: 10,
      }),
      baseSignal({
        id: "high",
        severity: 0.95,
        objectHints: ["beta", "gamma"],
        timestamp: 20,
      }),
    ],
  });
  assert.equal(snap.topRiskObjectId, "beta");
});

test("trend is derived safely for degrading series", () => {
  const snap = deriveOperationalMonitoringSnapshot({
    records: [
      baseSignal({ id: "s1", severity: 0.2, timestamp: 1 }),
      baseSignal({ id: "s2", severity: 0.55, timestamp: 2 }),
      baseSignal({ id: "s3", severity: 0.9, timestamp: 3 }),
    ],
  });
  assert.equal(snap.trend, "degrading");
  assert.equal(["degraded", "critical"].includes(snap.status), true);
});

test("nullish input behaves as empty", () => {
  const snap = deriveOperationalMonitoringSnapshot(null);
  assert.equal(snap.status, "idle");
});
