/**
 * MRP:4C:3 — Sync Risk workspace object context from MRP selection (read-only).
 */

import type { MrpContextStoreSnapshot } from "../../mrpContext/mrpContextStoreContract.ts";
import { publishRiskWorkspaceState } from "./riskWorkspaceStateRuntime.ts";
import {
  MRP_RISK_OBJECT_CONTEXT_TAG,
  type RiskObjectContext,
  type RiskObjectContextInput,
} from "./riskObjectContextContract.ts";
import {
  buildRiskObjectContextSignature,
  resolveRiskObjectContext,
} from "./riskObjectContextResolver.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logObjectContextOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(MRP_RISK_OBJECT_CONTEXT_TAG, detail);
}

export function buildRiskObjectContextInputFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: RiskObjectContextInput
): RiskObjectContextInput {
  return Object.freeze({
    selectedObjectId: extended?.selectedObjectId ?? snapshot.selectedObjectId,
    selectedObjectLabel:
      extended?.selectedObjectLabel ?? snapshot.header.selectedObject,
    selectedObjectType: extended?.selectedObjectType ?? null,
    selectedObjectStatus: extended?.selectedObjectStatus ?? null,
    routeObjectId: extended?.routeObjectId ?? null,
    routeObjectName: extended?.routeObjectName ?? null,
    sceneJson: extended?.sceneJson ?? null,
  });
}

export function syncRiskObjectContext(input: RiskObjectContextInput): RiskObjectContext {
  const objectContext = resolveRiskObjectContext(input);
  const signature = buildRiskObjectContextSignature(objectContext);

  const result = publishRiskWorkspaceState({ objectContext });

  logObjectContextOnce(signature, {
    action: "object_context_synced",
    changed: result.changed,
    hasSelection: objectContext.hasSelection,
    selectedObject: objectContext.selectedObject,
  });

  return objectContext;
}

export function syncRiskObjectContextFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: RiskObjectContextInput
): RiskObjectContext {
  return syncRiskObjectContext(buildRiskObjectContextInputFromMrpSnapshot(snapshot, extended));
}

export function resetRiskObjectContextRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
