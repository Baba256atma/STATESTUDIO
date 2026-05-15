import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { detectOperationalChanges } from "../detectOperationalChanges.ts";
import type { OperationalMonitoringSignal, OperationalMonitoringSnapshot } from "../monitoringTypes.ts";

const T0 = "2024-01-01T00:00:00.000Z";

function snap(
  partial: Partial<OperationalMonitoringSnapshot> & {
    id: string;
    signals: readonly OperationalMonitoringSignal[];
  }
): OperationalMonitoringSnapshot {
  return {
    status: partial.status ?? "idle",
    trend: partial.trend ?? "unknown",
    signals: partial.signals,
    affectedObjectIds: partial.affectedObjectIds ?? [],
    ...(partial.topRiskObjectId ? { topRiskObjectId: partial.topRiskObjectId } : {}),
    summary: partial.summary ?? "",
    recommendedFocus: partial.recommendedFocus ?? "",
    updatedAt: partial.updatedAt ?? T0,
    id: partial.id,
  };
}

function monSig(
  p: Pick<OperationalMonitoringSignal, "id" | "sourceId" | "label" | "severity" | "trend" | "message"> &
    Partial<Pick<OperationalMonitoringSignal, "objectId" | "detectedAt" | "confidence">>
): OperationalMonitoringSignal {
  return {
    id: p.id,
    sourceId: p.sourceId,
    label: p.label,
    severity: p.severity,
    trend: p.trend,
    message: p.message,
    ...(p.objectId ? { objectId: p.objectId } : {}),
    detectedAt: p.detectedAt ?? T0,
    confidence: p.confidence ?? 0.5,
  };
}

describe("detectOperationalChanges", () => {
  it("handles nullish input and null current snapshot safely", () => {
    const a = detectOperationalChanges(null);
    assert.equal(a.totalChanges, 0);
    assert.equal(a.executiveSummary, "No operational changes detected.");

    const b = detectOperationalChanges({
      previousSnapshot: null,
      currentSnapshot: null,
      now: 42,
    });
    assert.equal(b.totalChanges, 0);
  });

  it("detects new signals when previous snapshot is baseline null", () => {
    const curr = snap({
      id: "c1",
      status: "watching",
      trend: "stable",
      signals: [
        monSig({
          id: "s1",
          sourceId: "src",
          label: "Alpha",
          severity: 0.6,
          trend: "stable",
          message: "m",
        }),
      ],
      affectedObjectIds: [],
    });
    const out = detectOperationalChanges({ previousSnapshot: null, currentSnapshot: curr, now: 1 });
    assert.equal(out.totalChanges, 1);
    assert.equal(out.worseningCount, 1);
    assert.equal(out.improvingCount, 0);
    assert.equal(out.stableCount, 0);
    assert.ok(out.executiveSummary.startsWith("Operational delta"));
  });

  it("detects resolved signals when a signal disappears", () => {
    const prev = snap({
      id: "p1",
      status: "watching",
      trend: "stable",
      signals: [
        monSig({
          id: "gone",
          sourceId: "src",
          label: "Gone",
          severity: 0.5,
          trend: "stable",
          message: "m",
        }),
      ],
      affectedObjectIds: [],
    });
    const curr = snap({
      id: "c2",
      status: "watching",
      trend: "stable",
      signals: [],
      affectedObjectIds: [],
    });
    const out = detectOperationalChanges({ previousSnapshot: prev, currentSnapshot: curr, now: 2 });
    assert.ok(out.improvingCount >= 1);
    assert.ok(out.totalChanges >= 1);
  });

  it("detects severity increase and decrease", () => {
    const base = monSig({
      id: "s1",
      sourceId: "src",
      label: "L",
      severity: 0.2,
      trend: "stable",
      message: "m",
    });
    const prev = snap({
      id: "p",
      status: "watching",
      trend: "stable",
      signals: [base],
      affectedObjectIds: [],
    });
    const currUp = snap({
      id: "c",
      status: "watching",
      trend: "stable",
      signals: [{ ...base, severity: 0.9 }],
      affectedObjectIds: [],
    });
    const up = detectOperationalChanges({ previousSnapshot: prev, currentSnapshot: currUp, now: 3 });
    assert.ok(up.worseningCount >= 1);

    const currDown = snap({
      id: "c",
      status: "watching",
      trend: "stable",
      signals: [{ ...base, severity: 0.2 }],
      affectedObjectIds: [],
    });
    const down = detectOperationalChanges({ previousSnapshot: currUp, currentSnapshot: currDown, now: 4 });
    assert.ok(down.improvingCount >= 1);
  });

  it("derives worsening, improving, and stable counts", () => {
    const prev = snap({
      id: "p",
      status: "watching",
      trend: "stable",
      signals: [
        monSig({ id: "a", sourceId: "s", label: "A", severity: 0.2, trend: "stable", message: "m" }),
        monSig({ id: "b", sourceId: "s", label: "B", severity: 0.5, trend: "stable", message: "m" }),
      ],
      affectedObjectIds: [],
    });
    const curr = snap({
      id: "c",
      status: "degraded",
      trend: "degrading",
      signals: [
        monSig({ id: "a", sourceId: "s", label: "A", severity: 0.8, trend: "degrading", message: "m" }),
        monSig({ id: "b", sourceId: "s", label: "B", severity: 0.5, trend: "stable", message: "m" }),
      ],
      affectedObjectIds: [],
    });
    const out = detectOperationalChanges({ previousSnapshot: prev, currentSnapshot: curr, now: 5 });
    assert.ok(out.worseningCount >= 1);
    assert.ok(out.stableCount >= 1);
    assert.ok(out.totalChanges >= out.worseningCount + out.stableCount);
  });

  it("dedupes affectedObjectIds in summary", () => {
    const prev = snap({
      id: "p",
      status: "watching",
      trend: "stable",
      signals: [],
      affectedObjectIds: ["z"],
    });
    const curr = snap({
      id: "c",
      status: "watching",
      trend: "stable",
      signals: [
        monSig({
          id: "n1",
          sourceId: "s",
          label: "N",
          severity: 0.9,
          trend: "stable",
          message: "m",
          objectId: "a",
        }),
      ],
      affectedObjectIds: ["b", "a", "a"],
    });
    const out = detectOperationalChanges({ previousSnapshot: prev, currentSnapshot: curr, now: 6 });
    assert.deepEqual([...out.affectedObjectIds], ["a", "b", "z"]);
  });

  it("generates executiveSummary safely for empty and non-empty", () => {
    const empty = detectOperationalChanges({ previousSnapshot: null, currentSnapshot: null, now: 7 });
    assert.equal(empty.executiveSummary, "No operational changes detected.");

    const curr = snap({
      id: "c",
      status: "watching",
      trend: "stable",
      signals: [monSig({ id: "x", sourceId: "s", label: "X", severity: 0.5, trend: "stable", message: "m" })],
      affectedObjectIds: [],
    });
    const one = detectOperationalChanges({ previousSnapshot: null, currentSnapshot: curr, now: 8 });
    assert.ok(one.executiveSummary.length > 10);
    assert.ok(!/\bNaN\b/.test(one.executiveSummary));
  });
});
