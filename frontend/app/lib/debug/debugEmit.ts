import { getDebugSubscriberDispatchDepth, notifyDebugSubscribers } from "./debugEventBus";
import {
  commitDebugEmitDedup,
  DEBUG_GUARD_DEDUP_MS,
  DEBUG_GUARD_MAX_DEFERRED,
  FEEDBACK_SUPPRESSED_ORIGINS,
  isDebugEmitDuplicatePeek,
  logDebugGuard,
  logDebugGuardDeduped,
  logDebugGuardThrottled,
  resolveDebugEventOrigin,
  tryAcquireDebugEmitRateSlot,
} from "./debugEventGuard";
import { appendDebugEvent } from "./debugEventStore";
import type { DebugEvent, DebugEventInput, DebugEventOrigin } from "./debugEventTypes";

declare global {
  interface Window {
    /** When false in dev, suppresses self-debug emission (default: enabled in development). */
    __NEXORA_SELF_DEBUG__?: boolean;
  }
}

export function shouldEmitSelfDebug(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  if (typeof window !== "undefined" && window.__NEXORA_SELF_DEBUG__ === false) return false;
  return true;
}

function newEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `dbg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

let pendingNotify = false;

function scheduleNotifyDebugSubscribers(): void {
  if (pendingNotify) return;
  pendingNotify = true;
  const run =
    typeof queueMicrotask === "function"
      ? queueMicrotask
      : (cb: () => void) => Promise.resolve().then(cb);
  run(() => {
    pendingNotify = false;
    notifyDebugSubscribers();
  });
}

const deferredDuringSubscriber: DebugEventInput[] = [];
let deferredFlushScheduled = false;

function scheduleDeferredEmitFlush(): void {
  if (deferredFlushScheduled) return;
  deferredFlushScheduled = true;
  const run =
    typeof queueMicrotask === "function"
      ? queueMicrotask
      : (cb: () => void) => Promise.resolve().then(cb);
  run(() => {
    deferredFlushScheduled = false;
    const batch = deferredDuringSubscriber.splice(0, DEBUG_GUARD_MAX_DEFERRED);
    for (const input of batch) {
      emitDebugEvent(input);
    }
  });
}

function buildDebugEvent(input: DebugEventInput, origin: DebugEventOrigin): DebugEvent {
  return {
    id: input.id ?? newEventId(),
    timestamp: input.timestamp ?? Date.now(),
    type: input.type,
    layer: input.layer,
    origin,
    source: input.source,
    status: input.status,
    message: input.message,
    metadata: input.metadata ?? {},
    correlationId: input.correlationId ?? null,
  };
}

/**
 * Append a dev-only debug event and notify subscribers. No-op in production.
 * Global guard: re-entrant deferral, feedback-origin notify suppression, rate limit, dedup.
 */
export function emitDebugEvent(input: DebugEventInput): void {
  if (!shouldEmitSelfDebug()) return;

  const origin = resolveDebugEventOrigin(input);
  const subscriberDepth = getDebugSubscriberDispatchDepth();

  if (subscriberDepth > 0 && !FEEDBACK_SUPPRESSED_ORIGINS.has(origin)) {
    if (deferredDuringSubscriber.length >= DEBUG_GUARD_MAX_DEFERRED) {
      logDebugGuard("Reentry", {
        origin,
        type: input.type,
        reason: `deferred queue cap (${DEBUG_GUARD_MAX_DEFERRED})`,
      });
      return;
    }
    deferredDuringSubscriber.push(input);
    scheduleDeferredEmitFlush();
    return;
  }

  const event = buildDebugEvent(input, origin);

  if (isDebugEmitDuplicatePeek(event)) {
    logDebugGuardDeduped({
      origin: event.origin,
      type: event.type,
      reason: `same origin+type+source+message within ${DEBUG_GUARD_DEDUP_MS}ms`,
    });
    return;
  }

  if (!tryAcquireDebugEmitRateSlot()) {
    logDebugGuardThrottled({
      origin: event.origin,
      type: event.type,
      reason: "global rate limit (events/s)",
    });
    return;
  }

  appendDebugEvent(event);
  commitDebugEmitDedup(event);

  if (subscriberDepth > 0 && FEEDBACK_SUPPRESSED_ORIGINS.has(origin)) {
    logDebugGuard("SelfLoop", {
      origin: event.origin,
      type: event.type,
      reason: "feedback origin during subscriber notify — stored, notify skipped",
    });
    return;
  }

  scheduleNotifyDebugSubscribers();
}
