"use client";

import { useEffect, useState } from "react";

import { resolveNexoraTimelineDisplayTime } from "./nexoraTimeFormat";

export type HydratedTimelineDisplayTimeInput = {
  timestampIso?: string | null;
  timestamp?: string | null;
};

/** SSR-safe display: semantic labels only until mount; ISO times formatted after hydration. */
export function getStableTimelineDisplayTimeForRender(
  input: HydratedTimelineDisplayTimeInput
): string {
  if (input.timestampIso) return "";
  return input.timestamp?.trim() ?? "";
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
