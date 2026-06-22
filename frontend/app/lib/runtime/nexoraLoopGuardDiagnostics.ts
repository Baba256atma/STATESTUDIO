/**
 * MRP-STAB-1 — throttled NexoraLoopGuard diagnostics.
 */

import { stableDiagnosticSignature } from "./diagnosticIdleGate.ts";

export type NexoraLoopGuardAction =
  | "write_applied"
  | "write_skipped"
  | "selection_resolved"
  | "selection_cleared"
  | "dashboard_commit_blocked";

export type NexoraLoopGuardInput = Readonly<{
  source: string | null;
  action: NexoraLoopGuardAction;
  reason: string;
  stateSignature: string;
  objectId?: string | null;
  surfaceId?: string | null;
  workspaceId?: string | null;
  prevView?: string | null;
  nextView?: string | null;
  prevContextId?: string | null;
  nextContextId?: string | null;
  dashboardContext?: string | null;
}>;

type ThrottleEntry = {
  signature: string;
  suppressedCount: number;
  timer: ReturnType<typeof setTimeout> | null;
  pendingPayload: Record<string, unknown> | null;
};

const throttleEntries = new Map<string, ThrottleEntry>();
const THROTTLE_IDLE_MS = 120;

function buildThrottleKey(input: NexoraLoopGuardInput): string {
  return `${input.action}::${input.source ?? "unknown"}`;
}

function buildLoopGuardPayload(input: NexoraLoopGuardInput): Record<string, unknown> {
  return {
    source: input.source,
    action: input.action,
    reason: input.reason,
    stateSignature: input.stateSignature,
    objectId: input.objectId ?? null,
    surfaceId: input.surfaceId ?? null,
    workspaceId: input.workspaceId ?? null,
    prevView: input.prevView ?? null,
    nextView: input.nextView ?? null,
    prevContextId: input.prevContextId ?? null,
    nextContextId: input.nextContextId ?? null,
    dashboardContext: input.dashboardContext ?? null,
  };
}

function flushThrottleEntry(key: string): void {
  const entry = throttleEntries.get(key);
  if (!entry?.pendingPayload) return;
  const payload =
    entry.suppressedCount > 0
      ? { ...entry.pendingPayload, suppressedCount: entry.suppressedCount }
      : entry.pendingPayload;
  globalThis.console?.warn?.("[NexoraLoopGuard]", payload);
  if (entry.timer) {
    clearTimeout(entry.timer);
  }
  throttleEntries.delete(key);
}

function scheduleThrottleFlush(key: string): void {
  const entry = throttleEntries.get(key);
  if (!entry) return;
  if (entry.timer) {
    clearTimeout(entry.timer);
  }
  entry.timer = setTimeout(() => {
    flushThrottleEntry(key);
  }, THROTTLE_IDLE_MS);
}

export function traceNexoraLoopGuard(input: NexoraLoopGuardInput): void {
  if (process.env.NODE_ENV === "production") return;

  const payload = buildLoopGuardPayload(input);
  const signature = stableDiagnosticSignature(payload);
  const key = buildThrottleKey(input);
  const entry = throttleEntries.get(key);

  if (entry && entry.signature === signature) {
    entry.suppressedCount += 1;
    scheduleThrottleFlush(key);
    return;
  }

  if (entry) {
    flushThrottleEntry(key);
  }

  throttleEntries.set(key, {
    signature,
    suppressedCount: 0,
    timer: null,
    pendingPayload: payload,
  });
  scheduleThrottleFlush(key);
}

export function flushNexoraLoopGuardDiagnosticsForTests(): void {
  for (const key of [...throttleEntries.keys()]) {
    flushThrottleEntry(key);
  }
}

export function resetNexoraLoopGuardDiagnosticsForTests(): void {
  for (const entry of throttleEntries.values()) {
    if (entry.timer) {
      clearTimeout(entry.timer);
    }
  }
  throttleEntries.clear();
}
