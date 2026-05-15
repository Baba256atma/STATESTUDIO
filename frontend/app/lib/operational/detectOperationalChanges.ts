import type {
  OperationalChangeRecord,
  OperationalChangeSummary,
  OperationalChangeType,
} from "./changeDetectionTypes.ts";
import {
  compareOperationalSeverity,
  deriveOperationalChangeSeverity,
  isOperationalChangeCritical,
} from "./changeSeverity.ts";
import {
  compareSignalSeverity,
  dedupeSortedObjectIds,
  indexSignalsById,
  isStatusBetter,
  isStatusWorse,
  isTrendBetter,
  isTrendWorse,
  statusesEqual,
  trendsEqual,
} from "./compareOperationalSignals.ts";
import type {
  OperationalMonitoringSignal,
  OperationalMonitoringSnapshot,
  OperationalMonitoringStatus,
  OperationalTrend,
} from "./monitoringTypes.ts";

export type DetectOperationalChangesInput = Readonly<{
  previousSnapshot: OperationalMonitoringSnapshot | null;
  currentSnapshot: OperationalMonitoringSnapshot | null;
  /** Epoch ms for summary `generatedAt` when tests need stability. */
  now?: number;
}>;

const EMPTY_SUMMARY: OperationalChangeSummary = {
  totalChanges: 0,
  criticalChanges: 0,
  worseningCount: 0,
  improvingCount: 0,
  stableCount: 0,
  affectedObjectIds: [],
  executiveSummary: "No operational changes detected.",
  generatedAt: new Date(0).toISOString(),
};

function isoNow(now?: number): string {
  const ms = typeof now === "number" && Number.isFinite(now) ? now : Date.now();
  return new Date(ms).toISOString();
}

function snapshotSignals(snapshot: OperationalMonitoringSnapshot | null): readonly OperationalMonitoringSignal[] {
  if (!snapshot) return [];
  return snapshot.signals ?? [];
}

function snapshotStatus(snapshot: OperationalMonitoringSnapshot | null): OperationalMonitoringStatus {
  return snapshot?.status ?? "idle";
}

function snapshotTrend(snapshot: OperationalMonitoringSnapshot | null): OperationalTrend {
  return snapshot?.trend ?? "unknown";
}

function snapshotAffected(snapshot: OperationalMonitoringSnapshot | null): readonly string[] {
  if (!snapshot?.affectedObjectIds) return [];
  return snapshot.affectedObjectIds;
}

function isWorseningRecord(r: OperationalChangeRecord): boolean {
  switch (r.type) {
    case "severity_increase":
    case "object_added":
    case "new_signal":
      return true;
    case "status_change": {
      const p = r.previousValue as OperationalMonitoringStatus | undefined;
      const c = r.currentValue as OperationalMonitoringStatus | undefined;
      if (p && c) return isStatusWorse(p, c);
      return false;
    }
    case "trend_change": {
      const p = r.previousValue as OperationalTrend | undefined;
      const c = r.currentValue as OperationalTrend | undefined;
      if (p && c) return isTrendWorse(p, c);
      return false;
    }
    default:
      return false;
  }
}

function isImprovingRecord(r: OperationalChangeRecord): boolean {
  switch (r.type) {
    case "severity_decrease":
    case "resolved_signal":
    case "object_removed":
      return true;
    case "status_change": {
      const p = r.previousValue as OperationalMonitoringStatus | undefined;
      const c = r.currentValue as OperationalMonitoringStatus | undefined;
      if (p && c) return isStatusBetter(p, c);
      return false;
    }
    case "trend_change": {
      const p = r.previousValue as OperationalTrend | undefined;
      const c = r.currentValue as OperationalTrend | undefined;
      if (p && c) return isTrendBetter(p, c);
      return false;
    }
    default:
      return false;
  }
}

const TYPE_PRIORITY: Record<OperationalChangeType, number> = {
  severity_increase: 100,
  status_change: 90,
  new_signal: 85,
  trend_change: 75,
  object_added: 70,
  severity_decrease: 55,
  resolved_signal: 50,
  object_removed: 45,
  stable: 5,
};

function pickTopChange(records: readonly OperationalChangeRecord[]): OperationalChangeRecord | undefined {
  if (records.length === 0) return undefined;
  const sorted = [...records].sort((a, b) => {
    const sev = compareOperationalSeverity(b.severity, a.severity);
    if (sev !== 0) return sev;
    const tp = TYPE_PRIORITY[b.type] - TYPE_PRIORITY[a.type];
    if (tp !== 0) return tp;
    return a.id.localeCompare(b.id);
  });
  return sorted[0];
}

function buildExecutiveSummary(params: {
  totalChanges: number;
  criticalChanges: number;
  worseningCount: number;
  improvingCount: number;
  stableCount: number;
  affectedObjectIds: readonly string[];
  top?: OperationalChangeRecord;
}): string {
  if (params.totalChanges === 0) {
    return "No operational changes detected.";
  }
  const head = `Operational delta: ${params.totalChanges} change(s), ${params.criticalChanges} critical.`;
  const counts = `Worsening ${params.worseningCount}, improving ${params.improvingCount}, stable ${params.stableCount}.`;
  const obj =
    params.affectedObjectIds.length > 0
      ? `Affected objects: ${params.affectedObjectIds.slice(0, 8).join(", ")}${params.affectedObjectIds.length > 8 ? "…" : ""}.`
      : "No deduped object-scope changes.";
  const top = params.top ? `Lead item: ${params.top.message}` : "";
  return [head, counts, obj, top].filter(Boolean).join(" ");
}

/**
 * Pure read-model: diff two operational monitoring snapshots into change records + summary.
 * Does not mutate inputs.
 */
export function detectOperationalChanges(input?: DetectOperationalChangesInput | null): OperationalChangeSummary {
  const generatedAt = isoNow(input?.now);
  if (!input) {
    return { ...EMPTY_SUMMARY, generatedAt };
  }

  const prevSnap = input.previousSnapshot;
  const currSnap = input.currentSnapshot;

  if (!currSnap) {
    return { ...EMPTY_SUMMARY, generatedAt };
  }

  const isBaseline = prevSnap === null;

  const prevMap = indexSignalsById(snapshotSignals(prevSnap));
  const currMap = indexSignalsById(snapshotSignals(currSnap));

  const records: OperationalChangeRecord[] = [];
  let idx = 0;

  const push = (r: Omit<OperationalChangeRecord, "id" | "severity" | "detectedAt"> & { id?: string }) => {
    idx += 1;
    const id = r.id ?? `opch:${r.type}:${idx}:${r.objectId ?? "global"}`;
    const severity = deriveOperationalChangeSeverity({
      type: r.type,
      previousValue: r.previousValue,
      currentValue: r.currentValue,
    });
    const detectedAt = currSnap.updatedAt || generatedAt;
    records.push({
      id,
      type: r.type,
      ...(r.objectId ? { objectId: r.objectId } : {}),
      ...(r.previousValue !== undefined ? { previousValue: r.previousValue } : {}),
      ...(r.currentValue !== undefined ? { currentValue: r.currentValue } : {}),
      message: r.message,
      severity,
      detectedAt,
    });
  };

  if (!isBaseline) {
    const prevStatus = snapshotStatus(prevSnap);
    const currStatus = snapshotStatus(currSnap);
    if (!statusesEqual(prevStatus, currStatus)) {
      push({
        type: "status_change",
        previousValue: prevStatus,
        currentValue: currStatus,
        message: `Operational status moved from ${prevStatus} to ${currStatus}.`,
      });
    }

    const prevTrend = snapshotTrend(prevSnap);
    const currTrend = snapshotTrend(currSnap);
    if (!trendsEqual(prevTrend, currTrend)) {
      push({
        type: "trend_change",
        previousValue: prevTrend,
        currentValue: currTrend,
        message: `Aggregate trend shifted from ${prevTrend} to ${currTrend}.`,
      });
    }

    const prevIds = new Set(snapshotAffected(prevSnap).map((x) => String(x).trim()).filter(Boolean));
    const currIds = new Set(snapshotAffected(currSnap).map((x) => String(x).trim()).filter(Boolean));
    for (const oid of currIds) {
      if (!prevIds.has(oid)) {
        push({
          type: "object_added",
          objectId: oid,
          message: `Object ${oid} entered the operational affected set.`,
        });
      }
    }
    for (const oid of prevIds) {
      if (!currIds.has(oid)) {
        push({
          type: "object_removed",
          objectId: oid,
          message: `Object ${oid} left the operational affected set.`,
        });
      }
    }
  }

  for (const [id, curr] of currMap) {
    const prev = prevMap.get(id);
    if (!prev) {
      push({
        id: `opch:new_signal:${curr.id}`,
        type: "new_signal",
        ...(curr.objectId ? { objectId: curr.objectId } : {}),
        currentValue: String(curr.severity),
        message: `New operational signal ${curr.label} (${curr.sourceId}).`,
      });
      continue;
    }

    const sevCmp = compareSignalSeverity(prev.severity, curr.severity);
    if (sevCmp === 1) {
      push({
        id: `opch:severity_increase:${curr.id}`,
        type: "severity_increase",
        ...(curr.objectId ? { objectId: curr.objectId } : {}),
        previousValue: String(prev.severity),
        currentValue: String(curr.severity),
        message: `Severity increased for ${curr.label} (${curr.sourceId}).`,
      });
    } else if (sevCmp === -1) {
      push({
        id: `opch:severity_decrease:${curr.id}`,
        type: "severity_decrease",
        ...(curr.objectId ? { objectId: curr.objectId } : {}),
        previousValue: String(prev.severity),
        currentValue: String(curr.severity),
        message: `Severity decreased for ${curr.label} (${curr.sourceId}).`,
      });
    }

    if (!trendsEqual(prev.trend, curr.trend)) {
      push({
        id: `opch:trend_change:${curr.id}`,
        type: "trend_change",
        ...(curr.objectId ? { objectId: curr.objectId } : {}),
        previousValue: prev.trend,
        currentValue: curr.trend,
        message: `Per-signal trend for ${curr.label} moved from ${prev.trend} to ${curr.trend}.`,
      });
    }

    if (sevCmp === 0 && trendsEqual(prev.trend, curr.trend)) {
      push({
        id: `opch:stable:${curr.id}`,
        type: "stable",
        ...(curr.objectId ? { objectId: curr.objectId } : {}),
        previousValue: String(prev.severity),
        currentValue: String(curr.severity),
        message: `Signal ${curr.label} remained stable (${curr.sourceId}).`,
      });
    }
  }

  for (const [id, prev] of prevMap) {
    if (!currMap.has(id)) {
      push({
        id: `opch:resolved_signal:${prev.id}`,
        type: "resolved_signal",
        ...(prev.objectId ? { objectId: prev.objectId } : {}),
        previousValue: String(prev.severity),
        message: `Operational signal cleared: ${prev.label} (${prev.sourceId}).`,
      });
    }
  }

  const worseningCount = records.filter(isWorseningRecord).length;
  const improvingCount = records.filter(isImprovingRecord).length;
  const stableCount = records.filter((r) => r.type === "stable").length;
  const criticalChanges = records.filter(isOperationalChangeCritical).length;

  const objectIdsFromRecords = dedupeSortedObjectIds(
    records.map((r) => r.objectId).filter((x): x is string => typeof x === "string" && Boolean(x.trim()))
  );
  const affectedObjectIds = dedupeSortedObjectIds([...snapshotAffected(currSnap), ...objectIdsFromRecords]);

  const topChange = pickTopChange(records);
  const executiveSummary = buildExecutiveSummary({
    totalChanges: records.length,
    criticalChanges,
    worseningCount,
    improvingCount,
    stableCount,
    affectedObjectIds,
    top: topChange,
  });

  return {
    totalChanges: records.length,
    criticalChanges,
    worseningCount,
    improvingCount,
    stableCount,
    affectedObjectIds,
    ...(topChange ? { topChange } : {}),
    executiveSummary,
    generatedAt,
  };
}
