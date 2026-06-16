/**
 * MRP:4F:1 — Sync War Room workspace context from MRP selection (read-only).
 */

import type { MrpContextStoreSnapshot } from "../../mrpContext/mrpContextStoreContract.ts";
import { publishWarRoomWorkspaceState } from "./warRoomWorkspaceStateRuntime.ts";
import { syncWarRoomStateFromContext } from "./warRoomStateRuntime.ts";
import {
  WAR_ROOM_WORKSPACE_CONTEXT_TAG,
  type WarRoomWorkspaceContext,
  type WarRoomWorkspaceContextInput,
} from "./warRoomWorkspaceContextContract.ts";
import {
  buildWarRoomWorkspaceContextSignature,
  resolveWarRoomWorkspaceContext,
} from "./warRoomWorkspaceContextResolver.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logContextOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(WAR_ROOM_WORKSPACE_CONTEXT_TAG, detail);
}

export function buildWarRoomWorkspaceContextInputFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: WarRoomWorkspaceContextInput
): WarRoomWorkspaceContextInput {
  return Object.freeze({
    selectedObjectId: extended?.selectedObjectId ?? snapshot.selectedObjectId,
    selectedObjectLabel:
      extended?.selectedObjectLabel ?? snapshot.header.selectedObject,
    selectedObjectType: extended?.selectedObjectType ?? null,
    selectedObjectStatus: extended?.selectedObjectStatus ?? null,
    routeObjectId: extended?.routeObjectId ?? null,
    routeObjectName: extended?.routeObjectName ?? null,
  });
}

export function syncWarRoomWorkspaceContext(
  input: WarRoomWorkspaceContextInput
): WarRoomWorkspaceContext {
  const workspaceContext = resolveWarRoomWorkspaceContext(input);
  const signature = buildWarRoomWorkspaceContextSignature(workspaceContext);

  publishWarRoomWorkspaceState({ workspaceContext });

  syncWarRoomStateFromContext({ workspaceContext });

  logContextOnce(signature, {
    action: "workspace_context_synced",
    hasSelection: workspaceContext.hasSelection,
    selectedObject: workspaceContext.selectedObject,
  });

  return workspaceContext;
}

export function syncWarRoomWorkspaceContextFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: WarRoomWorkspaceContextInput
): WarRoomWorkspaceContext {
  return syncWarRoomWorkspaceContext(
    buildWarRoomWorkspaceContextInputFromMrpSnapshot(snapshot, extended)
  );
}

export function resetWarRoomWorkspaceContextRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
