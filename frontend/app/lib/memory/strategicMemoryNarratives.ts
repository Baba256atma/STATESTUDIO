import type {
  StrategicMemoryCategory,
  StrategicMemoryRecord,
  StrategicMemoryState,
} from "./strategicMemoryTypes.ts";

function focus(record: Pick<StrategicMemoryRecord, "title" | "relatedObjectIds">): string {
  const title = String(record.title ?? "").trim();
  if (title) return title;
  return record.relatedObjectIds[0] ?? "the current operating model";
}

export function buildStrategicMemoryTitle(params: {
  category: StrategicMemoryCategory;
  focus?: string;
}): string {
  const value = String(params.focus ?? "").trim() || "Operational pressure";
  switch (params.category) {
    case "fragility":
      return `${value} fragility recurrence`;
    case "propagation":
      return `${value} propagation recurrence`;
    case "scenario":
      return `${value} scenario recurrence`;
    case "recommendation":
      return `${value} recommendation continuity`;
    case "timeline":
      return `${value} timeline continuity`;
    case "dependency":
      return `${value} dependency recurrence`;
    case "monitoring":
      return `${value} monitoring continuity`;
  }
}

export function describeStrategicMemoryRecord(record: StrategicMemoryRecord): string {
  const target = focus(record);
  const recurrence = Math.max(1, Math.round(Number(record.recurrenceCount ?? 1)));
  switch (record.category) {
    case "fragility":
      return `${target} has remained a recurring operational pressure point across ${recurrence} cycle${recurrence === 1 ? "" : "s"}.`;
    case "propagation":
      return `${target} continues to reappear across dependency pathways.`;
    case "recommendation":
      return `${target} remains unresolved across recent recommendation cycles.`;
    case "timeline":
      return `${target} has carried continuity across recent timeline movement.`;
    case "scenario":
      return `${target} keeps returning as a strategic scenario pattern.`;
    case "dependency":
      return `${target} remains historically elevated as a dependency concern.`;
    case "monitoring":
      return `${target} should remain visible in monitoring until the pattern settles.`;
  }
}

export function describeStrategicMemoryState(state: StrategicMemoryState, record?: StrategicMemoryRecord | null): string {
  const target = record ? focus(record) : "Operational pressure";
  switch (state) {
    case "emerging":
      return `${target} is newly emerging in strategic memory.`;
    case "persistent":
      return `${target} is persistent and deserves executive attention.`;
    case "stabilizing":
      return `${target} appears to be stabilizing, but should stay visible.`;
    case "resolved":
      return `${target} appears resolved for now.`;
    case "monitoring":
      return `${target} is in monitoring mode.`;
  }
}

export function buildStrategicContinuityLine(records: StrategicMemoryRecord[]): string {
  const top = records[0] ?? null;
  if (!top) return "No strategic memory pattern is available yet.";
  return describeStrategicMemoryRecord(top);
}
