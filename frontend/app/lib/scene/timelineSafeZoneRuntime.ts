/** E2:56 — Timeline + bottom command dock safe zone reservation. */

import { emitHudLayoutZoneLog } from "../layout/hudLayoutLogGuard";
import type { SceneHudPanelId } from "./sceneHudRegistry";
import { getSceneHudRegistration } from "./sceneHudRegistry";

export type TimelineSafeZone = {
  bottomOffset: number;
  reservedHeight: number;
  maxWidth: string;
  dockPanelIds: readonly SceneHudPanelId[];
};

export type TimelineSafeZoneContext = {
  viewportWidth: number;
  viewportHeight: number;
  timelineVisible: boolean;
  quickActionsVisible: boolean;
  timelineExpanded: boolean;
  timelineHeightMode?: "collapsed" | "compact" | "expanded" | "full";
};

const TIMELINE_HEIGHT_BY_MODE: Record<NonNullable<TimelineSafeZoneContext["timelineHeightMode"]>, number> = {
  collapsed: 36,
  compact: 72,
  expanded: 220,
  full: 320,
};

export function resolveTimelineSafeZone(context: TimelineSafeZoneContext): TimelineSafeZone {
  const isMobile = context.viewportWidth < 768;
  const timelineEntry = getSceneHudRegistration("timelineHud");
  const quickEntry = getSceneHudRegistration("quickActionsDock");
  const timelineHeight =
    context.timelineHeightMode != null
      ? TIMELINE_HEIGHT_BY_MODE[context.timelineHeightMode]
      : context.timelineExpanded
        ? timelineEntry.estimatedHeight + 80
        : timelineEntry.estimatedHeight;
  const quickHeight = context.quickActionsVisible ? quickEntry.estimatedHeight + 12 : 0;
  const reservedHeight = (context.timelineVisible ? timelineHeight : 0) + quickHeight;
  const bottomOffset = Math.max(isMobile ? 72 : 96, reservedHeight + (isMobile ? 12 : 16));

  const zone: TimelineSafeZone = {
    bottomOffset,
    reservedHeight,
    maxWidth: isMobile ? "calc(100vw - 24px)" : "min(88vw, 860px)",
    dockPanelIds: context.quickActionsVisible ? ["timelineHud", "quickActionsDock"] : ["timelineHud"],
  };

  logTimelineSafeZone({
    bottomOffset: zone.bottomOffset,
    reservedHeight: zone.reservedHeight,
    timelineVisible: context.timelineVisible,
    quickActionsVisible: context.quickActionsVisible,
    viewportWidth: context.viewportWidth,
  });

  return zone;
}

export function logTimelineSafeZone(payload: Record<string, unknown>): void {
  const viewportWidth = typeof payload.viewportWidth === "number" ? payload.viewportWidth : 1440;
  emitHudLayoutZoneLog("[Nexora][TimelineSafeZone]", "TimelineSafeZone", payload, viewportWidth);
}

export function resetTimelineSafeZoneLogsForTests(): void {
  // guarded by hudLayoutLogGuard reset
}
