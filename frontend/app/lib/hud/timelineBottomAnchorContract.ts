/**
 * MRP_TIMELINE:13:2 — Bottom-anchored timeline expansion contract.
 * Timeline bottom stays fixed; height changes grow upward only.
 */

import { TIMELINE_BOTTOM } from "../scene/sceneHudInsetContract.ts";

export const TIMELINE_BOTTOM_INSET_PX = TIMELINE_BOTTOM;

export type TimelineAnchorState = "expanded" | "compact" | "maximized";

let lastAnchorSignature: string | null = null;
let lastAnchorTrace: TimelineAnchorState | null = null;

export function resolveTimelineBottomAnchoredTop(input: {
  layoutHeight: number;
  timelineHeight: number;
  bottomInset?: number;
}): number {
  const bottomInset = input.bottomInset ?? TIMELINE_BOTTOM_INSET_PX;
  const safeHeight = Math.max(0, input.timelineHeight);
  return Math.max(0, input.layoutHeight - bottomInset - safeHeight);
}

export function resolveTimelineZoneBottomInset(_bottomInset?: number): number {
  return TIMELINE_BOTTOM_INSET_PX;
}

export function resolveTimelineAnchorState(
  heightMode: string | null | undefined
): TimelineAnchorState {
  if (heightMode === "full") return "maximized";
  if (heightMode === "expanded") return "expanded";
  return "compact";
}

export function isTimelineBottomAnchorValid(input: {
  layoutHeight: number;
  timelineTop: number;
  timelineHeight: number;
  bottomInset?: number;
}): boolean {
  const bottomInset = input.bottomInset ?? TIMELINE_BOTTOM_INSET_PX;
  const expectedTop = resolveTimelineBottomAnchoredTop({
    layoutHeight: input.layoutHeight,
    timelineHeight: input.timelineHeight,
    bottomInset,
  });
  const expectedBottom = bottomInset;
  const actualBottom = input.layoutHeight - input.timelineTop - input.timelineHeight;
  return (
    Math.abs(input.timelineTop - expectedTop) <= 0.5 &&
    Math.abs(actualBottom - expectedBottom) <= 0.5
  );
}

export function timelineBottomAnchorSignature(input: {
  layoutHeight: number;
  timelineHeight: number;
  anchorState: TimelineAnchorState;
}): string {
  return [
    input.layoutHeight,
    input.timelineHeight,
    TIMELINE_BOTTOM_INSET_PX,
    input.anchorState,
  ].join(":");
}

export function traceTimelineBottomAnchor(input: {
  anchorState: TimelineAnchorState;
  layoutHeight: number;
  timelineHeight: number;
}): void {
  if (process.env.NODE_ENV === "production") return;
  const signature = timelineBottomAnchorSignature({
    layoutHeight: input.layoutHeight,
    timelineHeight: input.timelineHeight,
    anchorState: input.anchorState,
  });
  if (lastAnchorSignature === signature) return;
  lastAnchorSignature = signature;
  lastAnchorTrace = input.anchorState;
  globalThis.console?.log?.(
    `[NexoraTimelineAnchor] bottomInset=${TIMELINE_BOTTOM_INSET_PX} state=${input.anchorState} anchored=true`
  );
}

export function traceTimelineBottomAnchorViolation(reason: string): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.warn?.(`[NexoraTimelineAnchor][Brake] reason=${reason}`);
}

export function resetTimelineBottomAnchorContractForTests(): void {
  lastAnchorSignature = null;
  lastAnchorTrace = null;
}
