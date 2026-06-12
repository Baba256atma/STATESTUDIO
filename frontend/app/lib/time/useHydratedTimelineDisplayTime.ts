"use client";

import { useEffect, useState } from "react";

import { resolveNexoraTimelineDisplayTime } from "./nexoraTimeFormat";
import { resolveHydrationSafeTimelineTime } from "./timelineHydrationSafeTimeContract";

export type HydratedTimelineDisplayTimeInput = {
  timestampIso?: string | null;
  timestamp?: string | null;
};

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
  const [displayTime, setDisplayTime] = useState(() =>
    getStableTimelineDisplayTimeForRender(input)
  );

  useEffect(() => {
    setDisplayTime(resolveNexoraTimelineDisplayTime(input));
  }, [input.timestamp, input.timestampIso]);

  return displayTime;
}
