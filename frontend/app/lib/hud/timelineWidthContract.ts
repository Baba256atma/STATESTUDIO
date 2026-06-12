/**
 * MRP_TIMELINE:13:1 — Responsive scene-bound timeline width contract.
 */

import { TIMELINE_BOTTOM_INSET_PX } from "./timelineBottomAnchorContract.ts";
import {
  MIN_TIMELINE_TO_MRP_GAP,
  MIN_TIMELINE_TO_OBJECT_PANEL_GAP,
  MIN_TIMELINE_TO_SCENE_PANEL_GAP,
  resolveTimelineWidthFromSceneWidth,
} from "./timelineZoneContract.ts";

export type TimelineDisplayState = "expanded" | "compact";

export const TIMELINE_LAYOUT_TRANSITION_MS = 250;

export const TIMELINE_DISPLAY_HEIGHT = Object.freeze({
  compact: Object.freeze({ min: 70, max: 90, target: 80 }),
  expanded: Object.freeze({ min: 260, max: 340, target: 300 }),
});

export type TimelineSafeMargins = Readonly<{
  bottom: number;
  toObjectPanel: number;
  toScenePanel: number;
  toMrp: number;
}>;

export type TimelineWidthSnapshot = Readonly<{
  sceneVisibleWidth: number;
  timelineTargetWidth: number;
  timelineLeft: number;
  ratio: number;
}>;

let lastWidthSignature: string | null = null;
let lastWidthSnapshot: TimelineWidthSnapshot = Object.freeze({
  sceneVisibleWidth: 0,
  timelineTargetWidth: 0,
  timelineLeft: 0,
  ratio: 0,
});

let lastHeightSignature: string | null = null;

export function getTimelineSafeMargins(): TimelineSafeMargins {
  return Object.freeze({
    bottom: TIMELINE_BOTTOM_INSET_PX,
    toObjectPanel: MIN_TIMELINE_TO_OBJECT_PANEL_GAP,
    toScenePanel: MIN_TIMELINE_TO_SCENE_PANEL_GAP,
    toMrp: MIN_TIMELINE_TO_MRP_GAP,
  });
}

export function getSceneVisibleWidth(): number {
  return lastWidthSnapshot.sceneVisibleWidth;
}

export function getTimelineTargetWidth(sceneVisibleWidth?: number): number {
  if (sceneVisibleWidth != null && sceneVisibleWidth > 0) {
    return resolveTimelineWidthFromSceneWidth(sceneVisibleWidth).timelineWidth;
  }
  return lastWidthSnapshot.timelineTargetWidth;
}

export function resolveTimelineWidthSnapshot(sceneVisibleWidth: number): TimelineWidthSnapshot {
  const resolved = resolveTimelineWidthFromSceneWidth(sceneVisibleWidth);
  return Object.freeze({
    sceneVisibleWidth: resolved.sceneWidth,
    timelineTargetWidth: resolved.timelineWidth,
    timelineLeft: resolved.timelineLeft,
    ratio: resolved.ratio,
  });
}

export function commitTimelineWidthSnapshot(
  sceneVisibleWidth: number
): TimelineWidthSnapshot | null {
  const snapshot = resolveTimelineWidthSnapshot(sceneVisibleWidth);
  const signature = [
    snapshot.sceneVisibleWidth,
    snapshot.timelineTargetWidth,
    snapshot.timelineLeft,
  ].join(":");

  if (lastWidthSignature === signature) {
    return null;
  }

  lastWidthSignature = signature;
  lastWidthSnapshot = snapshot;
  return snapshot;
}

export function readTimelineWidthSnapshot(): TimelineWidthSnapshot {
  return lastWidthSnapshot;
}

export function resolveTimelineDisplayHeight(state: TimelineDisplayState): number {
  return TIMELINE_DISPLAY_HEIGHT[state].target;
}

export function toTimelineDisplayState(
  heightMode: string | null | undefined
): TimelineDisplayState {
  if (heightMode === "expanded" || heightMode === "full") return "expanded";
  return "compact";
}

export function timelineDisplayStateFromHeightMode(
  heightMode: string | null | undefined
): TimelineDisplayState {
  return toTimelineDisplayState(heightMode);
}

export function timelineHeightModeForDisplayState(
  state: TimelineDisplayState
): "compact" | "expanded" {
  return state;
}

export function commitTimelineHeightSnapshot(
  displayState: TimelineDisplayState,
  height: number
): boolean {
  const signature = `${displayState}:${height}`;
  if (lastHeightSignature === signature) {
    return false;
  }
  lastHeightSignature = signature;
  return true;
}

export function timelineLayoutTransitionStyle(): Readonly<{
  transitionProperty: string;
  transitionDuration: string;
  transitionTimingFunction: string;
}> {
  return Object.freeze({
    transitionProperty: "width, height, max-height, min-height",
    transitionDuration: `${TIMELINE_LAYOUT_TRANSITION_MS}ms`,
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  });
}

export function resetTimelineWidthContractForTests(): void {
  lastWidthSignature = null;
  lastHeightSignature = null;
  lastWidthSnapshot = Object.freeze({
    sceneVisibleWidth: 0,
    timelineTargetWidth: 0,
    timelineLeft: 0,
    ratio: 0,
  });
}
