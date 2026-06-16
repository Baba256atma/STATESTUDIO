/**
 * MRP:4D:3 — Pure resolver for Timeline workspace object context.
 */

import type { SceneJson } from "../../../sceneTypes.ts";
import type { WorkspaceNavigationHistoryEntry } from "../../../dashboard/executiveWorkspaceNavigationHistoryContract.ts";
import { getWorkspaceNavigationHistoryEntries } from "../../../dashboard/executiveWorkspaceNavigationHistoryRuntime.ts";
import { DEFAULT_MRP_SELECTED_OBJECT } from "../../mrpContext/mrpContextStoreContract.ts";
import {
  DEFAULT_TIMELINE_OBJECT_CONTEXT,
  TIMELINE_KNOWN_OBJECT_FIXTURES,
  TIMELINE_NO_OBJECT_SELECTED_LABEL,
  type TimelineObjectContext,
  type TimelineObjectContextInput,
} from "./timelineObjectContextContract.ts";
import {
  mergeTimelineEvents,
  scanNavigationTimelineEvents,
  scanSceneTimelineEvents,
  type ScannedTimelineEvent,
} from "./timelineEventScanResolver.ts";

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function resolveObjectId(input: TimelineObjectContextInput): string | null {
  return input.selectedObjectId?.trim() || input.routeObjectId?.trim() || null;
}

function resolveObjectLabel(input: TimelineObjectContextInput): string {
  const label =
    input.selectedObjectLabel ??
    input.routeObjectName ??
    input.selectedObjectId ??
    input.routeObjectId;
  return normalizeText(label, TIMELINE_NO_OBJECT_SELECTED_LABEL);
}

function isNoSelectionLabel(label: string): boolean {
  const normalized = label.trim().toLowerCase();
  return (
    normalized === TIMELINE_NO_OBJECT_SELECTED_LABEL.toLowerCase() ||
    normalized === DEFAULT_MRP_SELECTED_OBJECT.toLowerCase()
  );
}

function hasMeaningfulSelection(objectId: string | null, selectedObject: string): boolean {
  if (objectId) return true;
  if (isNoSelectionLabel(selectedObject)) return false;
  return selectedObject.length > 0;
}

function resolveNavigationEntries(
  input: TimelineObjectContextInput
): readonly WorkspaceNavigationHistoryEntry[] {
  if (input.navigationHistoryEntries) {
    return input.navigationHistoryEntries;
  }
  return getWorkspaceNavigationHistoryEntries();
}

function findSceneObject(sceneJson: SceneJson | null | undefined, objectId: string | null): unknown {
  if (!objectId) return null;
  const objects = sceneJson?.scene?.objects;
  if (!Array.isArray(objects)) return null;
  return (
    objects.find((obj) => {
      const record = asRecord(obj);
      return record && String(record.id ?? "") === objectId;
    }) ?? null
  );
}

function readSceneObjectField(obj: unknown, keys: readonly string[]): string {
  const record = asRecord(obj);
  if (!record) return "";
  const semantic = asRecord(record.semantic);
  const meta = asRecord(record.meta);
  for (const key of keys) {
    for (const source of [record, semantic, meta]) {
      if (!source) continue;
      const raw = source[key];
      if (typeof raw === "number" && Number.isFinite(raw)) {
        return String(raw);
      }
      const text = normalizeText(raw, "");
      if (text) return text;
    }
  }
  return "";
}

function readSceneObjectTimestamp(obj: unknown): number {
  const raw = readSceneObjectField(obj, [
    "updated_at",
    "updatedAt",
    "timestamp",
    "last_event_at",
    "lastEventAt",
  ]);
  if (!raw) return 0;
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric > 0) return Math.floor(numeric);
  const parsed = Date.parse(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function formatTimelineTimestamp(timestamp: number): string {
  if (!timestamp) return "No recent activity";
  const now = new Date();
  const date = new Date(timestamp);
  const timeLabel = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfEntryDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDelta = Math.round((startOfToday - startOfEntryDay) / 86_400_000);

  if (dayDelta === 0) return `Today · ${timeLabel}`;
  if (dayDelta === 1) return `Yesterday · ${timeLabel}`;
  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} · ${timeLabel}`;
}

function isObjectScopedSceneEvent(event: ScannedTimelineEvent, selectedObjectId: string): boolean {
  return event.id.startsWith(`scene:${selectedObjectId}:`);
}

function collectObjectScopedEvents(
  input: TimelineObjectContextInput,
  selectedObjectId: string,
  now = Date.now()
): readonly ScannedTimelineEvent[] {
  const navigationEvents = scanNavigationTimelineEvents(resolveNavigationEntries(input), now).filter(
    (event) => {
      const [, workspaceId] = event.id.split(":");
      return workspaceId === "focus";
    }
  );
  const sceneObjects = input.sceneJson?.scene?.objects;
  const sceneEvents = Array.isArray(sceneObjects)
    ? scanSceneTimelineEvents(sceneObjects, now).filter((event) =>
        isObjectScopedSceneEvent(event, selectedObjectId)
      )
    : Object.freeze([]);

  return mergeTimelineEvents(navigationEvents, sceneEvents);
}

function resolveKnownObjectFixture(
  selectedObject: string
): (typeof TIMELINE_KNOWN_OBJECT_FIXTURES)[string] | null {
  const key = selectedObject.trim().toLowerCase();
  return TIMELINE_KNOWN_OBJECT_FIXTURES[key] ?? null;
}

function resolveLastChangeFromScene(obj: unknown, statusInput: string): string {
  if (statusInput) return statusInput;
  const change = readSceneObjectField(obj, [
    "last_change",
    "lastChange",
    "change_summary",
    "status",
    "state",
  ]);
  return change || "";
}

function resolveLastActivityFromEvents(events: readonly ScannedTimelineEvent[]): string {
  const latest = events.reduce(
    (max, event) => (event.timestamp > max ? event.timestamp : max),
    0
  );
  return formatTimelineTimestamp(latest);
}

export function resolveTimelineObjectContext(
  input: TimelineObjectContextInput,
  now = Date.now()
): TimelineObjectContext {
  const selectedObjectId = resolveObjectId(input);
  const selectedObject = resolveObjectLabel(input);
  const hasSelection = hasMeaningfulSelection(selectedObjectId, selectedObject);

  if (!hasSelection || !selectedObjectId) {
    return DEFAULT_TIMELINE_OBJECT_CONTEXT;
  }

  const sceneObject = findSceneObject(input.sceneJson, selectedObjectId);
  const fixture = resolveKnownObjectFixture(selectedObject);
  const statusInput = normalizeText(input.selectedObjectStatus, "");
  const objectEvents = collectObjectScopedEvents(input, selectedObjectId, now);
  const recentEventsCount = objectEvents.filter((event) => event.isRecent).length;

  const lastActivity =
    resolveLastActivityFromEvents(objectEvents) !== "No recent activity"
      ? resolveLastActivityFromEvents(objectEvents)
      : fixture?.lastActivity ||
        formatTimelineTimestamp(readSceneObjectTimestamp(sceneObject)) ||
        "No recent activity";

  const lastChange =
    resolveLastChangeFromScene(sceneObject, statusInput) ||
    fixture?.lastChange ||
    "No recorded change";

  return Object.freeze({
    selectedObjectId,
    selectedObject,
    lastActivity,
    lastChange,
    recentEventsCount: String(
      recentEventsCount > 0
        ? recentEventsCount
        : Number(fixture?.recentEventsCount ?? "0")
    ),
    hasSelection: true,
  });
}

export function buildTimelineObjectContextSignature(context: TimelineObjectContext): string {
  return JSON.stringify({
    selectedObjectId: context.selectedObjectId,
    selectedObject: context.selectedObject,
    lastActivity: context.lastActivity,
    lastChange: context.lastChange,
    recentEventsCount: context.recentEventsCount,
    hasSelection: context.hasSelection,
  });
}
