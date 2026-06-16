/**
 * MRP:4E:1 — Sync Scenario workspace context from MRP selection (read-only).
 */

import type { MrpContextStoreSnapshot } from "../../mrpContext/mrpContextStoreContract.ts";
import { publishScenarioWorkspaceState } from "./scenarioWorkspaceStateRuntime.ts";
import {
  SCENARIO_WORKSPACE_CONTEXT_TAG,
  type ScenarioWorkspaceContext,
  type ScenarioWorkspaceContextInput,
} from "./scenarioWorkspaceContextContract.ts";
import {
  buildScenarioWorkspaceContextSignature,
  resolveScenarioWorkspaceContext,
} from "./scenarioWorkspaceContextResolver.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logContextOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(SCENARIO_WORKSPACE_CONTEXT_TAG, detail);
}

export function buildScenarioWorkspaceContextInputFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: ScenarioWorkspaceContextInput
): ScenarioWorkspaceContextInput {
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

export function syncScenarioWorkspaceContext(
  input: ScenarioWorkspaceContextInput
): ScenarioWorkspaceContext {
  const workspaceContext = resolveScenarioWorkspaceContext(input);
  const signature = buildScenarioWorkspaceContextSignature(workspaceContext);

  publishScenarioWorkspaceState({ workspaceContext });

  logContextOnce(signature, {
    action: "workspace_context_synced",
    hasSelection: workspaceContext.hasSelection,
    selectedObject: workspaceContext.selectedObject,
  });

  return workspaceContext;
}

export function syncScenarioWorkspaceContextFromMrpSnapshot(
  snapshot: MrpContextStoreSnapshot,
  extended?: ScenarioWorkspaceContextInput
): ScenarioWorkspaceContext {
  return syncScenarioWorkspaceContext(
    buildScenarioWorkspaceContextInputFromMrpSnapshot(snapshot, extended)
  );
}

export function resetScenarioWorkspaceContextRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
