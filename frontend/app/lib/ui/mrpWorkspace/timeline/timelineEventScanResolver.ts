/**
 * MRP:4D:2 — Read-only timeline event scan from navigation history and scene markers.
 */

import type { ExecutiveWorkspaceId } from "../../../dashboard/executiveWorkspaceRegistryContract.ts";
import type { WorkspaceNavigationHistoryEntry } from "../../../dashboard/executiveWorkspaceNavigationHistoryContract.ts";
import { classifyRiskBand, readObjectHaystack } from "../risk/riskSceneScanResolver.ts";

export const TIMELINE_RECENT_EVENT_WINDOW_MS = 86_400_000;

export type ScannedTimelineEvent = Readonly<{
  id: string;
  timestamp: number;
  isRecent: boolean;
  isDecision: boolean;
  isRisk: boolean;
}>;

const DECISION_WORKSPACE_IDS = new Set<ExecutiveWorkspaceId>([
  "analyze",
  "compare",
  "scenario",
  "recommendations",
  "decision_center",
]);

const RISK_WORKSPACE_IDS = new Set<ExecutiveWorkspaceId>(["risk", "war_room"]);

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readObjectTimestamp(obj: unknown): number {
  const record = asRecord(obj);
  if (!record) return 0;
  const semantic = asRecord(record.semantic);
  const meta = asRecord(record.meta);
  for (const source of [record, semantic, meta]) {
    if (!source) continue;
    for (const key of ["updated_at", "updatedAt", "timestamp", "last_event_at", "lastEventAt"]) {
      const raw = source[key];
      if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
        return Math.floor(raw);
      }
      const text = normalizeText(raw);
      if (!text) continue;
      const parsed = Date.parse(text);
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
  }
  return 0;
}

function readObjectDecisionHaystack(obj: unknown): string {
  const record = asRecord(obj);
  if (!record) return "";
  const semantic = asRecord(record.semantic);
  return [
    record.decision,
    record.decision_status,
    record.approval_status,
    record.commitment,
    semantic?.decision,
    semantic?.approval,
  ]
    .map((value) => normalizeText(value).toLowerCase())
    .filter(Boolean)
    .join(" ");
}

function isDecisionHaystack(haystack: string): boolean {
  if (!haystack) return false;
  return /\bdecision\b|\bapproved\b|\brejected\b|\bcommitted\b|\bpending approval\b/.test(
    haystack
  );
}

export function classifyNavigationTimelineEvent(
  entry: WorkspaceNavigationHistoryEntry,
  now: number
): ScannedTimelineEvent | null {
  if (entry.transitionType === "audit_failure") return null;

  const timestamp = entry.timestamp;
  const isRecent = timestamp > 0 && now - timestamp <= TIMELINE_RECENT_EVENT_WINDOW_MS;
  const isDecision = DECISION_WORKSPACE_IDS.has(entry.workspaceId);
  const isRisk = RISK_WORKSPACE_IDS.has(entry.workspaceId);

  return Object.freeze({
    id: `${entry.timestamp}:${entry.workspaceId}:${entry.transitionType}`,
    timestamp,
    isRecent,
    isDecision,
    isRisk,
  });
}

export function scanNavigationTimelineEvents(
  entries: readonly WorkspaceNavigationHistoryEntry[],
  now = Date.now()
): readonly ScannedTimelineEvent[] {
  const rows: ScannedTimelineEvent[] = [];
  const seen = new Set<string>();

  for (const entry of entries) {
    const scanned = classifyNavigationTimelineEvent(entry, now);
    if (!scanned || seen.has(scanned.id)) continue;
    seen.add(scanned.id);
    rows.push(scanned);
  }

  return Object.freeze(rows.sort((left, right) => right.timestamp - left.timestamp));
}

export function scanSceneTimelineEvents(
  objects: unknown[],
  now = Date.now()
): readonly ScannedTimelineEvent[] {
  const rows: ScannedTimelineEvent[] = [];

  for (let index = 0; index < objects.length; index += 1) {
    const obj = objects[index];
    const record = asRecord(obj);
    const objectId = normalizeText(record?.id) || `scene_object_${index + 1}`;
    const haystack = readObjectHaystack(obj);
    const decisionHaystack = readObjectDecisionHaystack(obj);
    const riskBand = classifyRiskBand(haystack);
    const isDecision = isDecisionHaystack(decisionHaystack);
    const isRisk = riskBand !== "none";

    if (!isDecision && !isRisk) continue;

    const timestamp = readObjectTimestamp(obj);
    rows.push(
      Object.freeze({
        id: `scene:${objectId}:${isDecision ? "decision" : "risk"}`,
        timestamp,
        isRecent: timestamp > 0 && now - timestamp <= TIMELINE_RECENT_EVENT_WINDOW_MS,
        isDecision,
        isRisk,
      })
    );
  }

  return Object.freeze(rows);
}

export function mergeTimelineEvents(
  ...groups: readonly (readonly ScannedTimelineEvent[])[]
): readonly ScannedTimelineEvent[] {
  const merged = new Map<string, ScannedTimelineEvent>();
  for (const group of groups) {
    for (const event of group) {
      const existing = merged.get(event.id);
      if (!existing) {
        merged.set(event.id, event);
        continue;
      }
      merged.set(
        event.id,
        Object.freeze({
          id: event.id,
          timestamp: Math.max(existing.timestamp, event.timestamp),
          isRecent: existing.isRecent || event.isRecent,
          isDecision: existing.isDecision || event.isDecision,
          isRisk: existing.isRisk || event.isRisk,
        })
      );
    }
  }
  return Object.freeze(
    [...merged.values()].sort((left, right) => right.timestamp - left.timestamp)
  );
}
