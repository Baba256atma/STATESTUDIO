import {
  getExecutiveHudViewportHeight,
  getExecutiveHudViewportWidth,
} from "../layout/executiveHudHydrationRuntime";
import { resolveTimelineSafeZone } from "../scene/timelineSafeZoneRuntime";

export type TimelineVisibleRegion = {
  anchor: "BOTTOM_CENTER";
  bottomOffset: number;
  compactHeight: number;
  expandedHeight: number;
  fullHeight: number;
  maxWidth: string;
};

export const EXECUTIVE_TIMELINE_VISIBLE_REGION: Readonly<TimelineVisibleRegion> = Object.freeze({
  anchor: "BOTTOM_CENTER",
  bottomOffset: 104,
  compactHeight: 72,
  expandedHeight: 220,
  fullHeight: 320,
  maxWidth: "min(88vw, 860px)",
});

const logKeys = new Set<string>();

function log(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.("[Nexora][TimelineDock]", payload);
}

export function getTimelineVisibleRegion(input?: {
  viewportWidth?: number;
  viewportHeight?: number;
}): TimelineVisibleRegion {
  const width = input?.viewportWidth ?? getExecutiveHudViewportWidth();
  const height = input?.viewportHeight ?? getExecutiveHudViewportHeight();
  const safeZone = resolveTimelineSafeZone({
    viewportWidth: width,
    viewportHeight: height,
    timelineVisible: true,
    quickActionsVisible: false,
    timelineExpanded: false,
  });
  const region: TimelineVisibleRegion = {
    ...EXECUTIVE_TIMELINE_VISIBLE_REGION,
    bottomOffset: safeZone.bottomOffset,
    maxWidth: safeZone.maxWidth,
  };
  log(region);
  return region;
}

export function resetTimelineVisibleRegionRuntimeForTests(): void {
  logKeys.clear();
}
