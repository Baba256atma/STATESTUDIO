/**
 * D7:1:4 — Immutable timeline history layer.
 */

import type { SimulationStateSnapshot } from "../simulationStateSnapshot.ts";
import type {
  OperationalTimelineHistory,
  OperationalTimelineHistoryEntry,
  TimelineCausalLink,
} from "./timelineTypes.ts";
import type { ExecutiveTimelinePhaseMarker } from "./timelineTypes.ts";
import { buildTimelineSnapshotId } from "./timelineSnapshotIndex.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

export function buildTimelineHistoryFingerprint(
  entries: readonly OperationalTimelineHistoryEntry[]
): string {
  return stableStringify(
    entries.map((e) => ({
      tick: e.tick,
      snapshotId: e.snapshotId,
      phase: e.executivePhase,
      causal: [...e.causalLinkIds].sort(),
    }))
  );
}

export function appendTimelineHistoryEntry(input: {
  history: OperationalTimelineHistory;
  snapshot: SimulationStateSnapshot;
  timelineId: string;
  executive: ExecutiveTimelinePhaseMarker;
  causalLinks: readonly TimelineCausalLink[];
}): OperationalTimelineHistory {
  const tick = input.snapshot.timestamp.tick;
  const snapshotId = buildTimelineSnapshotId(input.timelineId, tick, input.snapshot.fingerprint);
  const entry: OperationalTimelineHistoryEntry = {
    tick,
    snapshotId,
    executivePhase: input.executive.phase,
    executiveLabel: input.executive.label,
    causalLinkIds: input.causalLinks.map((l) => l.linkId).sort(),
    ...(input.snapshot.operationalMetrics
      ? { operationalMetrics: { ...input.snapshot.operationalMetrics } }
      : {}),
  };
  const entries = [...input.history.entries, entry];
  return {
    entries,
    fingerprint: buildTimelineHistoryFingerprint(entries),
  };
}

export function createEmptyTimelineHistory(): OperationalTimelineHistory {
  return { entries: [], fingerprint: stableStringify([]) };
}
