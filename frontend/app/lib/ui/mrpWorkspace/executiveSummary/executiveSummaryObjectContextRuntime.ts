/**
 * MRP:4:3 — Sync Executive Summary object context from MRP selection (read-only).
 */

import type { MrpContextStoreSnapshot } from "../../mrpContext/mrpContextStoreContract.ts";
import { publishExecutiveSummaryState } from "./executiveSummaryStateRuntime.ts";
import {
  EXEC_SUMMARY_OBJECT_CONTEXT_TAG,
  type ExecutiveSummaryObjectContext,
  type ExecutiveSummaryObjectContextInput,
} from "./executiveSummaryObjectContextContract.ts";
import {
  buildExecutiveSummaryObjectContextSignature,
  resolveExecutiveSummaryObjectContext,
} from "./executiveSummaryObjectContextResolver.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logObjectContextOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(EXEC_SUMMARY_OBJECT_CONTEXT_TAG, detail);
}

export function buildExecutiveSummaryObjectContextInputFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: ExecutiveSummaryObjectContextInput
): ExecutiveSummaryObjectContextInput {
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

export function syncExecutiveSummaryObjectContext(
  input: ExecutiveSummaryObjectContextInput
): ExecutiveSummaryObjectContext {
  const objectContext = resolveExecutiveSummaryObjectContext(input);
  const signature = buildExecutiveSummaryObjectContextSignature(objectContext);

  publishExecutiveSummaryState({ objectContext });

  logObjectContextOnce(signature, {
    action: "object_context_synced",
    hasSelection: objectContext.hasSelection,
    selectedObject: objectContext.selectedObject,
  });

  return objectContext;
}

export function syncExecutiveSummaryObjectContextFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: ExecutiveSummaryObjectContextInput
): ExecutiveSummaryObjectContext {
  return syncExecutiveSummaryObjectContext(
    buildExecutiveSummaryObjectContextInputFromMrpSnapshot(snapshot, extended)
  );
}

export function resetExecutiveSummaryObjectContextRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
