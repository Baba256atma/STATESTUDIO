/**
 * FIX-LINE-12 — Dev-only adapted Nexora relationship cache diagnostics.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";

export const RELATIONSHIP_ADAPTATION_CACHE_TAGS = Object.freeze([
  "FIX_LINE_12",
  "RELATIONSHIP_ADAPTATION_CACHE",
  "RELATIONSHIP_REFERENCE_STABLE",
] as const);

const loggedEvents = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logOnce(signature: string, message: string, payload?: Record<string, unknown>): void {
  if (!isDev()) return;
  if (loggedEvents.has(signature)) return;
  loggedEvents.add(signature);
  devDiagnosticLog("relationshipAdaptationCache", `[RelationshipAdaptationCache] ${message}`, {
    ...payload,
    tags: RELATIONSHIP_ADAPTATION_CACHE_TAGS,
  });
}

export function logRelationshipAdaptationCacheHit(workspaceId: string): void {
  logOnce(`hit:${workspaceId}`, "Cache Hit", { workspaceId });
}

export function logRelationshipAdaptationCacheMiss(workspaceId: string): void {
  logOnce(`miss:${workspaceId}`, "Cache Miss", { workspaceId });
}

export function logRelationshipAdaptationsAdapted(
  workspaceId: string,
  relationshipCount: number
): void {
  logOnce(`adapted:${workspaceId}:${relationshipCount}`, "Relationships Adapted", {
    workspaceId,
    relationshipCount,
  });
}

export function resetRelationshipAdaptationCacheDevLogsForTests(): void {
  loggedEvents.clear();
}
