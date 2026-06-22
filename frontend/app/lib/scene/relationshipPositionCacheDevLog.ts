/**
 * FIX-LINE-07 — Dev-only relationship position lookup cache diagnostics.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";

export const RELATIONSHIP_POSITION_CACHE_TAGS = Object.freeze([
  "FIX_LINE_07",
  "OBJECT_POSITION_CACHE_READY",
  "RELATIONSHIP_LOOKUP_OPTIMIZED",
] as const);

const loggedBuiltSignatures = new Set<string>();
const loggedLookupSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logOnce(signature: string, store: Set<string>, message: string, payload?: Record<string, unknown>): void {
  if (!isDev()) return;
  if (store.has(signature)) return;
  store.add(signature);
  devDiagnosticLog("relationshipPositionCache", `[RelationshipPositionCache] ${message}`, {
    ...payload,
    tags: RELATIONSHIP_POSITION_CACHE_TAGS,
  });
}

export function logRelationshipPositionCacheBuilt(input: {
  signature: string;
  objectCount: number;
  aliasCount: number;
}): void {
  logOnce(`built:${input.signature}`, loggedBuiltSignatures, "Cache Built", {
    objectCount: input.objectCount,
    aliasCount: input.aliasCount,
    signature: input.signature,
  });
}

export function logRelationshipPositionCacheHit(objectId: string): void {
  logOnce(`hit:${objectId}`, loggedLookupSignatures, "Cache Hit", { objectId });
}

export function logRelationshipPositionCacheMiss(objectId: string): void {
  logOnce(`miss:${objectId}`, loggedLookupSignatures, "Cache Miss", { objectId });
}

export function logRelationshipPositionCacheFallback(objectId: string): void {
  logOnce(`fallback:${objectId}`, loggedLookupSignatures, "Fallback Used", { objectId });
}

export function resetRelationshipPositionCacheDevLogsForTests(): void {
  loggedBuiltSignatures.clear();
  loggedLookupSignatures.clear();
}
