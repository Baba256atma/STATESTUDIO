/**
 * FIX-LINE-10 — Dev-only workspace SceneJson + relationships cache diagnostics.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";

export const RELATIONSHIP_SCENE_JSON_CACHE_TAGS = Object.freeze([
  "FIX_LINE_10",
  "SCENEJSON_RELATIONSHIP_CACHE",
  "SCENE_REFERENCE_STABLE",
] as const);

const loggedEvents = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logOnce(signature: string, message: string, payload?: Record<string, unknown>): void {
  if (!isDev()) return;
  if (loggedEvents.has(signature)) return;
  loggedEvents.add(signature);
  devDiagnosticLog("relationshipSceneJsonCache", `[RelationshipSceneJsonCache] ${message}`, {
    ...payload,
    tags: RELATIONSHIP_SCENE_JSON_CACHE_TAGS,
  });
}

export function logRelationshipSceneJsonCacheHit(workspaceId: string): void {
  logOnce(`hit:${workspaceId}`, "Cache Hit", { workspaceId });
}

export function logRelationshipSceneJsonCacheMiss(workspaceId: string): void {
  logOnce(`miss:${workspaceId}`, "Cache Miss", { workspaceId });
}

export function logRelationshipSceneJsonCacheUpdated(workspaceId: string): void {
  logOnce(`updated:${workspaceId}`, "Cache Updated", { workspaceId });
}

export function resetRelationshipSceneJsonCacheDevLogsForTests(): void {
  loggedEvents.clear();
}
