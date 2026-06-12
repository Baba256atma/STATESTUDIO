/**
 * MRP_HUD:10:3 — Timeline HUD safe zone contract.
 * MRP_HUD:14:9 — Timeline width spans scene width minus unified edge insets.
 * MRP_TIMELINE:13:2 — Timeline bottom inset fixed at 4px.
 */

import { resolveTimelineZoneBottomInset } from "./timelineBottomAnchorContract.ts";
import {
  TIMELINE_LEFT,
  TIMELINE_RIGHT,
  TIMELINE_BOTTOM,
} from "../scene/sceneHudInsetContract.ts";

import type { SceneHudZoneRect } from "../scene/sceneHudZoneContract.ts";
import { SCENE_HUD_ZONE_METRICS } from "../scene/sceneHudZoneContract.ts";

export const MIN_TIMELINE_BOTTOM_INSET = TIMELINE_BOTTOM;
export const MIN_TIMELINE_TO_OBJECT_PANEL_GAP = 12;
export const MIN_TIMELINE_TO_SCENE_PANEL_GAP = 12;
export const MIN_TIMELINE_TO_MRP_GAP = 12;
export const TIMELINE_Z_INDEX = 4;
export const MIN_TIMELINE_CORE_WIDTH = 120;
export const MIN_TIMELINE_PREFERRED_WIDTH = 240;

export function resolveTimelineSceneWidthRatio(sceneWidth: number): number {
  const safeSceneWidth = Math.max(0, sceneWidth);
  if (safeSceneWidth <= 0) return 0;
  return Math.max(0, safeSceneWidth - TIMELINE_LEFT - TIMELINE_RIGHT) / safeSceneWidth;
}

/** @deprecated Use resolveTimelineSceneWidthRatio — retained for diagnostics compatibility. */
export const TIMELINE_SCENE_WIDTH_RATIO = resolveTimelineSceneWidthRatio(900);

export type TimelineSafeZone = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
  availableWidth: number;
}>;

export type TimelineZoneContract = Readonly<{
  timelineSafeZone: TimelineSafeZone;
  timelineReservedHeight: number;
  timelineBottomInset: number;
  timelineHorizontalInset: number;
  timelineToObjectPanelGap: number;
  timelineToScenePanelGap: number;
  timelineToMrpGap: number;
  timelineZIndex: number;
  timelineZone: SceneHudZoneRect;
  timelineLeft: number;
  timelineRight: number;
  scenePanelRight: number;
  objectPanelLeft: number;
  mrpLeft: number;
  availableWidth: number;
  sceneWidth: number;
  timelineSceneWidthRatio: number;
  overlapDetected: boolean;
  safeZoneViolation: boolean;
  clamped: boolean;
}>;

export type TimelineZoneInput = Readonly<{
  viewportWidth: number;
  layoutWidth: number;
  layoutHeight: number;
  sideInset: number;
  timelineTop: number;
  timelineHeight: number;
  timelineBottomOffset: number;
  scenePanelLeft: number;
  scenePanelWidth: number;
  objectPanelLeft: number;
  objectPanelWidth: number;
  /** Fixed compact object panel slot — timeline band ignores expand toggle. */
  objectPanelBandWidth: number;
  mrpWidth: number;
  mrpVisible: boolean;
  usingViewportFallback: boolean;
  isMobile: boolean;
}>;

function buildZoneRect(
  top: number,
  left: number,
  width: number,
  height: number,
  containerWidth: number,
  containerHeight: number,
  maxWidth: string
): SceneHudZoneRect {
  const safeWidth = Math.max(0, width);
  const safeHeight = Math.max(0, height);
  return {
    top,
    left,
    right: Math.max(0, containerWidth - left - safeWidth),
    bottom: Math.max(0, containerHeight - top - safeHeight),
    width: safeWidth,
    height: safeHeight,
    maxWidth,
    maxHeight: `${Math.floor(safeHeight)}px`,
  };
}

export function resolveTimelineWidthFromSceneWidth(sceneWidth: number): Readonly<{
  sceneWidth: number;
  timelineWidth: number;
  timelineLeft: number;
  ratio: number;
}> {
  const safeSceneWidth = Math.max(0, sceneWidth);
  const timelineLeft = TIMELINE_LEFT;
  const timelineWidth = Math.max(0, safeSceneWidth - TIMELINE_LEFT - TIMELINE_RIGHT);
  return Object.freeze({
    sceneWidth: safeSceneWidth,
    timelineWidth,
    timelineLeft,
    ratio: resolveTimelineSceneWidthRatio(safeSceneWidth),
  });
}

export function resolveTimelineZoneContract(input: TimelineZoneInput): TimelineZoneContract {
  const mrpLeft = input.viewportWidth - (input.mrpVisible ? input.mrpWidth : 0);
  const scenePanelRight = input.scenePanelLeft + input.scenePanelWidth;
  const objectPanelLeft = input.objectPanelLeft;

  const mrpReservation =
    input.mrpVisible && input.usingViewportFallback
      ? input.mrpWidth + MIN_TIMELINE_TO_MRP_GAP
      : 0;
  const effectiveLayoutWidth = Math.max(320, input.layoutWidth - mrpReservation);
  const sceneWidth = effectiveLayoutWidth;

  const responsiveWidth = resolveTimelineWidthFromSceneWidth(sceneWidth);
  let timelineWidth = responsiveWidth.timelineWidth;
  let timelineLeft = responsiveWidth.timelineLeft;

  if (timelineWidth > 0 && timelineWidth < MIN_TIMELINE_CORE_WIDTH) {
    timelineWidth = Math.min(sceneWidth, MIN_TIMELINE_CORE_WIDTH);
    timelineLeft = Math.max(0, (sceneWidth - timelineWidth) / 2);
  }

  const timelineRight = timelineLeft + timelineWidth;
  const availableWidth = sceneWidth;

  const timelineBottomInset = resolveTimelineZoneBottomInset(input.timelineBottomOffset);

  const preClampOverflow =
    timelineLeft < -0.5 ||
    timelineRight > sceneWidth + 0.5 ||
    timelineWidth > sceneWidth + 0.5;

  const clamped =
    preClampOverflow ||
    Math.abs(timelineWidth - Math.max(0, sceneWidth - TIMELINE_LEFT - TIMELINE_RIGHT)) > 1;

  const maxWidthCss = input.isMobile
    ? `calc(100% - ${TIMELINE_LEFT + TIMELINE_RIGHT}px)`
    : `calc(100% - ${TIMELINE_LEFT + TIMELINE_RIGHT}px)`;

  const timelineZone = buildZoneRect(
    input.timelineTop,
    timelineLeft,
    timelineWidth,
    input.timelineHeight,
    effectiveLayoutWidth,
    input.layoutHeight,
    maxWidthCss
  );

  const timelineSafeZone = Object.freeze({
    left: timelineLeft,
    top: input.timelineTop,
    width: timelineWidth,
    height: input.timelineHeight,
    right: timelineRight,
    bottom: input.timelineTop + input.timelineHeight,
    availableWidth,
  });

  return Object.freeze({
    timelineSafeZone,
    timelineReservedHeight: input.timelineHeight,
    timelineBottomInset,
    timelineHorizontalInset: input.sideInset,
    timelineToObjectPanelGap: MIN_TIMELINE_TO_OBJECT_PANEL_GAP,
    timelineToScenePanelGap: MIN_TIMELINE_TO_SCENE_PANEL_GAP,
    timelineToMrpGap: MIN_TIMELINE_TO_MRP_GAP,
    timelineZIndex: TIMELINE_Z_INDEX,
    timelineZone,
    timelineLeft,
    timelineRight,
    scenePanelRight,
    objectPanelLeft,
    mrpLeft,
    availableWidth,
    sceneWidth,
    timelineSceneWidthRatio: resolveTimelineSceneWidthRatio(sceneWidth),
    overlapDetected: preClampOverflow,
    safeZoneViolation: preClampOverflow,
    clamped,
  });
}

export function timelineZoneSignature(contract: TimelineZoneContract): string {
  return [
    contract.sceneWidth,
    contract.timelineLeft,
    contract.timelineRight,
    contract.timelineSceneWidthRatio,
    contract.availableWidth,
    contract.overlapDetected,
    contract.clamped,
    contract.timelineZone.width,
    contract.timelineZone.height,
  ].join(":");
}
