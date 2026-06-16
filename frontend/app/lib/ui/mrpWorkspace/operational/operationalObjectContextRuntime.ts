/**
 * MRP:4:9 — Sync Operational workspace object context from MRP selection (read-only).
 */

import type { MrpContextStoreSnapshot } from "../../mrpContext/mrpContextStoreContract.ts";
import { publishOperationalWorkspaceState } from "./operationalWorkspaceStateRuntime.ts";
import {
  OPERATIONAL_OBJECT_CONTEXT_TAG,
  type OperationalObjectContext,
  type OperationalObjectContextInput,
} from "./operationalObjectContextContract.ts";
import {
  buildOperationalObjectContextSignature,
  resolveOperationalObjectContext,
} from "./operationalObjectContextResolver.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logObjectContextOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(OPERATIONAL_OBJECT_CONTEXT_TAG, detail);
}

export function buildOperationalObjectContextInputFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: OperationalObjectContextInput
): OperationalObjectContextInput {
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

export function syncOperationalObjectContext(
  input: OperationalObjectContextInput
): OperationalObjectContext {
  const objectContext = resolveOperationalObjectContext(input);
  const signature = buildOperationalObjectContextSignature(objectContext);

  publishOperationalWorkspaceState({ objectContext });

  logObjectContextOnce(signature, {
    action: "object_context_synced",
    hasSelection: objectContext.hasSelection,
    selectedObject: objectContext.selectedObject,
  });

  return objectContext;
}

export function syncOperationalObjectContextFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: OperationalObjectContextInput
): OperationalObjectContext {
  return syncOperationalObjectContext(
    buildOperationalObjectContextInputFromMrpSnapshot(snapshot, extended)
  );
}

export function resetOperationalObjectContextRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
