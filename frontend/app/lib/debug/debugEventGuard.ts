/**
 * Dev-only global safety for the debug event pipeline (rate limit, dedup, tracing).
 * No production impact: callers gate on `shouldEmitSelfDebug()`.
 */

import type { DebugEventOrigin, DebugEventType, DebugLayer } from "./debugEventTypes";

export const DEBUG_GUARD_MAX_EVENTS_PER_SECOND = 80;
export const DEBUG_GUARD_DEDUP_MS = 100;
const MAX_EVENTS_PER_SECOND = DEBUG_GUARD_MAX_EVENTS_PER_SECOND;
const DEDUP_WINDOW_MS = DEBUG_GUARD_DEDUP_MS;
const WINDOW_MS = 1000;

const recentEmitTimes: number[] = [];

function pruneEmitTimes(now: number): void {
  const cutoff = now - WINDOW_MS;
  while (recentEmitTimes.length > 0 && recentEmitTimes[0]! < cutoff) {
    recentEmitTimes.shift();
  }
}

export function tryAcquireDebugEmitRateSlot(): boolean {
  const now = Date.now();
  pruneEmitTimes(now);
  if (recentEmitTimes.length >= MAX_EVENTS_PER_SECOND) {
    return false;
  }
  recentEmitTimes.push(now);
  return true;
}

let lastDedupKey = "";
let lastDedupAt = 0;

function dedupKeyOf(event: {
  origin: DebugEventOrigin;
  type: DebugEventType;
  source: string;
  message: string;
}): string {
  return `${event.origin}|${event.type}|${event.source}|${event.message}`;
}

/** True if this would duplicate the last committed event within the dedup window (read-only). */
export function isDebugEmitDuplicatePeek(event: {
  origin: DebugEventOrigin;
  type: DebugEventType;
  source: string;
  message: string;
}): boolean {
  const key = dedupKeyOf(event);
  const now = Date.now();
  return key === lastDedupKey && now - lastDedupAt < DEDUP_WINDOW_MS;
}

/** Call only after an event is actually appended (keeps dedup aligned with stored history). */
export function commitDebugEmitDedup(event: {
  origin: DebugEventOrigin;
  type: DebugEventType;
  source: string;
  message: string;
}): void {
  lastDedupKey = dedupKeyOf(event);
  lastDedupAt = Date.now();
}

const LAYER_TO_ORIGIN: Record<DebugLayer, DebugEventOrigin> = {
  chat: "chat",
  intent: "system",
  router: "router",
  panel: "panel",
  host: "panel",
  shell: "system",
  scene: "scene",
  contract: "panel",
  post_success: "system",
};

export function resolveDebugEventOrigin(input: {
  origin?: DebugEventOrigin | undefined;
  layer: DebugLayer;
}): DebugEventOrigin {
  if (input.origin !== undefined && input.origin !== null) {
    return input.origin;
  }
  return LAYER_TO_ORIGIN[input.layer] ?? "unknown";
}

export type DebugGuardLogBucket = "SelfLoop" | "Reentry" | "Throttled" | "Deduped";

export function logDebugGuard(bucket: DebugGuardLogBucket, detail: { origin: string; type: string; reason: string }): void {
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[DebugGuard][Blocked][${bucket}]`, detail);
}

export function logDebugGuardThrottled(detail: { origin: string; type: string; reason: string }): void {
  if (process.env.NODE_ENV === "production") return;
  console.warn("[DebugGuard][Throttled]", detail);
}

export function logDebugGuardDeduped(detail: { origin: string; type: string; reason: string }): void {
  if (process.env.NODE_ENV === "production") return;
  console.warn("[DebugGuard][Deduped]", detail);
}

export const DEBUG_GUARD_MAX_DEFERRED = 64;

export const FEEDBACK_SUPPRESSED_ORIGINS: ReadonlySet<DebugEventOrigin> = new Set(["debug_inspector", "render_cycle"]);
