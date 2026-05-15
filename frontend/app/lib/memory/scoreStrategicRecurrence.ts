import type {
  StrategicMemoryRecord,
  StrategicMemoryScore,
  StrategicMemoryState,
} from "./strategicMemoryTypes.ts";

function clamp01(value: unknown): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(1, Math.max(0, number));
}

function severityWeight(severity: StrategicMemoryRecord["severity"]): number {
  if (severity === "critical") return 1;
  if (severity === "high") return 0.76;
  if (severity === "medium") return 0.48;
  if (severity === "low") return 0.2;
  return 0.28;
}

export function resolveStrategicMemoryState(params: {
  recurrenceCount?: number;
  severity?: StrategicMemoryRecord["severity"];
  confidence?: number;
  persistenceDuration?: number;
  improving?: boolean;
}): StrategicMemoryState {
  const recurrence = Math.max(1, Math.round(Number(params.recurrenceCount ?? 1)));
  const confidence = clamp01(params.confidence ?? 0.5);
  const duration = Math.max(0, Number(params.persistenceDuration ?? 0));

  if (params.improving && recurrence >= 2) return "stabilizing";
  if (params.severity === "low" && confidence >= 0.5 && recurrence >= 2) return "monitoring";
  if (params.severity === "critical" && recurrence >= 2) return "persistent";
  if (recurrence >= 3 || duration >= 3) return "persistent";
  if (recurrence <= 1) return "emerging";
  return "monitoring";
}

export function scoreStrategicRecurrence(record: StrategicMemoryRecord): StrategicMemoryScore {
  const recurrence = Math.max(1, Math.round(Number(record.recurrenceCount ?? 1)));
  const persistenceDuration = Math.max(0, Number(record.lastObservedAt) - Number(record.firstObservedAt));
  const confidence = clamp01(record.confidence ?? 0.45);
  const relatedReach = Math.min(1, record.relatedObjectIds.length / 6);
  const score =
    Math.min(1, recurrence / 5) * 0.34 +
    severityWeight(record.severity) * 0.26 +
    confidence * 0.2 +
    relatedReach * 0.12 +
    Math.min(1, persistenceDuration / 10) * 0.08;
  const memoryState = resolveStrategicMemoryState({
    recurrenceCount: recurrence,
    severity: record.severity,
    confidence,
    persistenceDuration,
  });

  return {
    recordId: record.id,
    recurrenceScore: Math.round(clamp01(score) * 100) / 100,
    memoryState,
    persistenceDuration,
  };
}
