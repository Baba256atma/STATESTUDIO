/**
 * MRP:12:9 — Timeline responsive width runtime diagnostics.
 */

import { resolveTimelineSceneWidthRatio } from "./timelineZoneContract.ts";

let lastTraceSignature: string | null = null;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceMrp129TimelineWidthUpdated(input: {
  sceneWidth: number;
  timelineWidth: number;
  ratio?: number;
}): void {
  if (!isDev()) return;

  const sceneWidth = Math.max(0, Math.round(input.sceneWidth));
  const timelineWidth = Math.max(0, Math.round(input.timelineWidth));
  const ratio = input.ratio ?? resolveTimelineSceneWidthRatio(sceneWidth);
  const signature = `${sceneWidth}:${timelineWidth}:${ratio}`;
  if (lastTraceSignature === signature) return;
  lastTraceSignature = signature;

  globalThis.console?.log?.(
    `[MRP129Runtime]\nTimelineWidthUpdated\nsceneWidth=${sceneWidth}\ntimelineWidth=${timelineWidth}\nratio=${ratio}`
  );
}

export function resetMrp129RuntimeDiagnosticsForTests(): void {
  lastTraceSignature = null;
}
