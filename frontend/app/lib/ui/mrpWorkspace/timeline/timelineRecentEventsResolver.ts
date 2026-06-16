/**
 * MRP:4D:4 — Derive recent timeline event rows from read-only runtime data.
 */

import type { ExecutiveWorkspaceId } from "../../../dashboard/executiveWorkspaceRegistryContract.ts";
import type { WorkspaceNavigationHistoryEntry } from "../../../dashboard/executiveWorkspaceNavigationHistoryContract.ts";
import { getWorkspaceNavigationHistoryEntries } from "../../../dashboard/executiveWorkspaceNavigationHistoryRuntime.ts";
import type { TimelineWorkspaceDataInput } from "./timelineWorkspaceMetricsContract.ts";
import type { TimelineRecentEventRow } from "./timelineVisualSurfaceContract.ts";
import { classifyRiskBand, readObjectHaystack, readObjectRiskLabel } from "../risk/riskSceneScanResolver.ts";

export const TIMELINE_RECENT_EVENTS_LIMIT = 8;

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

function resolveNavigationEntries(
  input: TimelineWorkspaceDataInput
): readonly WorkspaceNavigationHistoryEntry[] {
  if (input.navigationHistoryEntries) {
    return input.navigationHistoryEntries;
  }
  return getWorkspaceNavigationHistoryEntries();
}

function formatEventTime(timestamp: number): string {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function resolveNavigationEventLabel(entry: WorkspaceNavigationHistoryEntry): string {
  if (entry.transitionType === "back") {
    return `Returned to ${entry.workspaceName}`;
  }
  switch (entry.workspaceId) {
    case "analyze":
      return "Opened Analyze Mode";
    case "compare":
      return "Opened Compare Mode";
    case "scenario":
      return "Opened Scenario Mode";
    case "war_room":
      return "Opened War Room";
    case "focus":
      return "Selected Object";
    case "risk":
      return "Opened Risk Workspace";
    case "timeline":
      return "Opened Timeline Workspace";
    default:
      return `Opened ${entry.workspaceName}`;
  }
}

function resolveNavigationEventCategory(entry: WorkspaceNavigationHistoryEntry): string {
  if (entry.transitionType === "back") return "Navigation";
  if (DECISION_WORKSPACE_IDS.has(entry.workspaceId)) return "Decision";
  if (RISK_WORKSPACE_IDS.has(entry.workspaceId)) return "Risk";
  if (entry.workspaceId === "focus") return "Object";
  return "Workspace";
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
  return [record.decision_status, record.approval_status, semantic?.decision]
    .map((value) => normalizeText(value).toLowerCase())
    .filter(Boolean)
    .join(" ");
}

function isDecisionHaystack(haystack: string): boolean {
  return /\bdecision\b|\bapproved\b|\brejected\b|\bcommitted\b/.test(haystack);
}

export function deriveTimelineRecentEventRows(
  input: TimelineWorkspaceDataInput
): readonly TimelineRecentEventRow[] {
  const rows: TimelineRecentEventRow[] = [];

  for (const entry of resolveNavigationEntries(input)) {
    if (entry.transitionType === "audit_failure") continue;
    rows.push(
      Object.freeze({
        time: formatEventTime(entry.timestamp),
        event: resolveNavigationEventLabel(entry),
        category: resolveNavigationEventCategory(entry),
      })
    );
  }

  const objects = input.sceneJson?.scene?.objects;
  if (Array.isArray(objects)) {
    for (const obj of objects) {
      const haystack = readObjectHaystack(obj);
      const decisionHaystack = readObjectDecisionHaystack(obj);
      const riskBand = classifyRiskBand(haystack);
      const isDecision = isDecisionHaystack(decisionHaystack);
      const isRisk = riskBand !== "none";
      if (!isDecision && !isRisk) continue;

      rows.push(
        Object.freeze({
          time: formatEventTime(readObjectTimestamp(obj)),
          event: isDecision
            ? `${readObjectRiskLabel(obj)} decision marker`
            : `${readObjectRiskLabel(obj)} risk marker`,
          category: isDecision ? "Decision" : "Risk",
        })
      );
    }
  }

  return Object.freeze(rows.slice(0, TIMELINE_RECENT_EVENTS_LIMIT));
}

export function buildTimelineRecentEventRowsSignature(
  rows: readonly TimelineRecentEventRow[]
): string {
  return JSON.stringify(rows);
}
