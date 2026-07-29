"use client";

import { useSyncExternalStore } from "react";

import { resolveNexoraTimelineDisplayTime } from "./nexoraTimeFormat";
import { resolveHydrationSafeTimelineTime } from "./timelineHydrationSafeTimeContract";

export type HydratedTimelineDisplayTimeInput = {
  timestampIso?: string | null;
  timestamp?: string | null;
};

function subscribeNoop() {
  return () => {};
}

/** SSR-safe display: semantic labels only until mount; ISO times deferred until hydration. */
export function getStableTimelineDisplayTimeForRender(
  input: HydratedTimelineDisplayTimeInput
): string {
  return resolveHydrationSafeTimelineTime({
    eventTime: input.timestampIso ?? input.timestamp ?? null,
    hydrated: false,
  });
}

export function useHydratedTimelineDisplayTime(
  input: HydratedTimelineDisplayTimeInput
): string {
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  if (!hydrated) {
    return getStableTimelineDisplayTimeForRender(input);
  }
  return resolveNexoraTimelineDisplayTime(input);
}
