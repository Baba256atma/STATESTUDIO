/**
 * MRP:4D:4 — Derive decision history rows from read-only runtime data.
 */

import type { ExecutiveWorkspaceId } from "../../../dashboard/executiveWorkspaceRegistryContract.ts";
import type { WorkspaceNavigationHistoryEntry } from "../../../dashboard/executiveWorkspaceNavigationHistoryContract.ts";
import { getWorkspaceNavigationHistoryEntries } from "../../../dashboard/executiveWorkspaceNavigationHistoryRuntime.ts";
import type { TimelineWorkspaceDataInput } from "./timelineWorkspaceMetricsContract.ts";
import type { TimelineDecisionHistoryRow } from "./timelineVisualSurfaceContract.ts";
import { readObjectRiskLabel } from "../risk/riskSceneScanResolver.ts";

export const TIMELINE_DECISION_HISTORY_LIMIT = 8;

const DECISION_WORKSPACE_IDS = new Set<ExecutiveWorkspaceId>([
  "analyze",
  "compare",
  "scenario",
  "recommendations",
  "decision_center",
]);

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function normalizeText(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function resolveNavigationEntries(
  input: TimelineWorkspaceDataInput
): readonly WorkspaceNavigationHistoryEntry[] {
  if (input.navigationHistoryEntries) {
    return input.navigationHistoryEntries;
  }
  return getWorkspaceNavigationHistoryEntries();
}

function formatDecisionDate(timestamp: number): string {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function resolveNavigationDecisionLabel(entry: WorkspaceNavigationHistoryEntry): string {
  switch (entry.workspaceId) {
    case "analyze":
      return "Analyze Mode session";
    case "compare":
      return "Compare Mode session";
    case "scenario":
      return "Scenario Mode session";
    case "recommendations":
      return "Recommendations review";
    case "decision_center":
      return "Decision center session";
    default:
      return `${entry.workspaceName} decision workflow`;
  }
}

function readSceneDecisionStatus(obj: unknown): string {
  const record = asRecord(obj);
  if (!record) return "Recorded";
  const semantic = asRecord(record.semantic);
  return (
    normalizeText(record.decision_status) ||
    normalizeText(record.approval_status) ||
    normalizeText(semantic?.decision) ||
    normalizeText(record.status) ||
    "Recorded"
  );
}

function readObjectTimestamp(obj: unknown): number {
  const record = asRecord(obj);
  if (!record) return 0;
  for (const key of ["updated_at", "updatedAt", "timestamp"]) {
    const raw = record[key];
    if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
      return Math.floor(raw);
    }
  }
  return 0;
}

function readObjectDecisionHaystack(obj: unknown): string {
  const record = asRecord(obj);
  if (!record) return "";
  const semantic = asRecord(record.semantic);
  return [record.decision, record.decision_status, record.approval_status, semantic?.decision]
    .map((value) => normalizeText(value).toLowerCase())
    .filter(Boolean)
    .join(" ");
}

function isDecisionHaystack(haystack: string): boolean {
  return /\bdecision\b|\bapproved\b|\brejected\b|\bcommitted\b|\bpending approval\b/.test(
    haystack
  );
}

export function deriveTimelineDecisionHistoryRows(
  input: TimelineWorkspaceDataInput
): readonly TimelineDecisionHistoryRow[] {
  const rows: TimelineDecisionHistoryRow[] = [];

  for (const entry of resolveNavigationEntries(input)) {
    if (entry.transitionType === "audit_failure") continue;
    if (!DECISION_WORKSPACE_IDS.has(entry.workspaceId)) continue;
    rows.push(
      Object.freeze({
        decision: resolveNavigationDecisionLabel(entry),
        date: formatDecisionDate(entry.timestamp),
        status: entry.transitionType === "back" ? "Reviewed" : "Opened",
      })
    );
  }

  const objects = input.sceneJson?.scene?.objects;
  if (Array.isArray(objects)) {
    for (const obj of objects) {
      if (!isDecisionHaystack(readObjectDecisionHaystack(obj))) continue;
      rows.push(
        Object.freeze({
          decision: `${readObjectRiskLabel(obj)} decision checkpoint`,
          date: formatDecisionDate(readObjectTimestamp(obj)),
          status: readSceneDecisionStatus(obj),
        })
      );
    }
  }

  return Object.freeze(rows.slice(0, TIMELINE_DECISION_HISTORY_LIMIT));
}

export function buildTimelineDecisionHistoryRowsSignature(
  rows: readonly TimelineDecisionHistoryRow[]
): string {
  return JSON.stringify(rows);
}
