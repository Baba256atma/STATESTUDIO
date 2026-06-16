/**
 * MRP:5A:1 — Sync Advisory workspace context from MRP selection (read-only).
 */

import type { MrpContextStoreSnapshot } from "../../mrpContext/mrpContextStoreContract.ts";
import { syncAdvisoryStateFromContext } from "./advisoryStateRuntime.ts";
import { publishAdvisoryWorkspaceState } from "./advisoryWorkspaceStateRuntime.ts";
import {
  ADVISORY_WORKSPACE_CONTEXT_TAG,
  type AdvisoryWorkspaceContext,
  type AdvisoryWorkspaceContextInput,
} from "./advisoryWorkspaceContextContract.ts";
import {
  buildAdvisoryWorkspaceContextSignature,
  resolveAdvisoryWorkspaceContext,
} from "./advisoryWorkspaceContextResolver.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logContextOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(ADVISORY_WORKSPACE_CONTEXT_TAG, detail);
}

export function buildAdvisoryWorkspaceContextInputFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: AdvisoryWorkspaceContextInput
): AdvisoryWorkspaceContextInput {
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

export function syncAdvisoryWorkspaceContext(
  input: AdvisoryWorkspaceContextInput
): AdvisoryWorkspaceContext {
  const workspaceContext = resolveAdvisoryWorkspaceContext(input);
  const signature = buildAdvisoryWorkspaceContextSignature(workspaceContext);

  publishAdvisoryWorkspaceState({ workspaceContext });

  syncAdvisoryStateFromContext({ workspaceContext });

  logContextOnce(signature, {
    action: "workspace_context_synced",
    hasSelection: workspaceContext.hasSelection,
    selectedObject: workspaceContext.selectedObject,
  });

  return workspaceContext;
}

export function syncAdvisoryWorkspaceContextFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: AdvisoryWorkspaceContextInput
): AdvisoryWorkspaceContext {
  return syncAdvisoryWorkspaceContext(
    buildAdvisoryWorkspaceContextInputFromMrpSnapshot(snapshot, extended)
  );
}

export function resetAdvisoryWorkspaceContextRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
