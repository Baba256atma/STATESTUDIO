/**
 * MRP:4D:3 — Sync Timeline workspace object context from MRP selection (read-only).
 */

import type { MrpContextStoreSnapshot } from "../../mrpContext/mrpContextStoreContract.ts";
import { publishTimelineWorkspaceState } from "./timelineWorkspaceStateRuntime.ts";
import {
  MRP_TIMELINE_OBJECT_CONTEXT_TAG,
  type TimelineObjectContext,
  type TimelineObjectContextInput,
} from "./timelineObjectContextContract.ts";
import {
  buildTimelineObjectContextSignature,
  resolveTimelineObjectContext,
} from "./timelineObjectContextResolver.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logObjectContextOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(MRP_TIMELINE_OBJECT_CONTEXT_TAG, detail);
}

export function buildTimelineObjectContextInputFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: TimelineObjectContextInput
): TimelineObjectContextInput {
  return Object.freeze({
    selectedObjectId: extended?.selectedObjectId ?? snapshot.selectedObjectId,
    selectedObjectLabel:
      extended?.selectedObjectLabel ?? snapshot.header.selectedObject,
    selectedObjectType: extended?.selectedObjectType ?? null,
    selectedObjectStatus: extended?.selectedObjectStatus ?? null,
    routeObjectId: extended?.routeObjectId ?? null,
    routeObjectName: extended?.routeObjectName ?? null,
    sceneJson: extended?.sceneJson ?? null,
    navigationHistoryEntries: extended?.navigationHistoryEntries ?? null,
  });
}

export function syncTimelineObjectContext(
  input: TimelineObjectContextInput
): TimelineObjectContext {
  const objectContext = resolveTimelineObjectContext(input);
  const signature = buildTimelineObjectContextSignature(objectContext);

  const result = publishTimelineWorkspaceState({ objectContext });

  logObjectContextOnce(signature, {
    action: "object_context_synced",
    changed: result.changed,
    hasSelection: objectContext.hasSelection,
    selectedObject: objectContext.selectedObject,
  });

  return objectContext;
}

export function syncTimelineObjectContextFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: TimelineObjectContextInput
): TimelineObjectContext {
  return syncTimelineObjectContext(
    buildTimelineObjectContextInputFromMrpSnapshot(snapshot, extended)
  );
}

export function resetTimelineObjectContextRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
