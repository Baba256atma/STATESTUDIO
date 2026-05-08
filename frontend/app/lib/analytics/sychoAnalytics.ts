"use client";

import { getSessionId } from "../session/sychoSession";

export type SychoAnalyticsEvent =
  | "enter_space"
  | "first_input"
  | "object_click"
  | "message_emitted"
  | "session_end";

const lastTrackedAt = new Map<string, number>();

export function track(event: SychoAnalyticsEvent, payload?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const key = `${event}:${JSON.stringify(payload ?? {})}`;
  const previous = lastTrackedAt.get(key) ?? 0;
  if (now - previous < 600) return;
  lastTrackedAt.set(key, now);

  window.setTimeout(() => {
    try {
      console.log("[Sycho][Launch][Analytics]", {
        event,
        payload: payload ?? {},
        sessionId: getSessionId(),
        at: new Date(now).toISOString(),
      });
    } catch {
      // Analytics must never affect the experience.
    }
  }, 0);
}
