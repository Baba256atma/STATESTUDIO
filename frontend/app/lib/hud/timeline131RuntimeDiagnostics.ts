/**
 * MRP_TIMELINE:13:1 — Timeline responsive layout diagnostics (once per signature).
 */

import type { TimelineDisplayState } from "./timelineWidthContract.ts";
import type { TimelineWidthSnapshot } from "./timelineWidthContract.ts";

const loggedWidthSignatures = new Set<string>();
const loggedResizeSignatures = new Set<string>();
let lastDisplayTrace: TimelineDisplayState | null = null;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceTimelineWidthContract(snapshot: TimelineWidthSnapshot): void {
  if (!isDev()) return;
  const signature = [
    snapshot.sceneVisibleWidth,
    snapshot.timelineTargetWidth,
    snapshot.ratio,
  ].join(":");
  if (loggedWidthSignatures.has(signature)) return;
  loggedWidthSignatures.add(signature);
  globalThis.console?.log?.(
    `[Nexora][TimelineWidthContract] sceneVisibleWidth=${snapshot.sceneVisibleWidth} timelineWidth=${snapshot.timelineTargetWidth} ratio=${snapshot.ratio}`
  );
}

export function traceTimelineResize(input: {
  previousWidth: number;
  nextWidth: number;
  sceneVisibleWidth: number;
}): void {
  if (!isDev()) return;
  const signature = `${input.previousWidth}:${input.nextWidth}:${input.sceneVisibleWidth}`;
  if (loggedResizeSignatures.has(signature)) return;
  loggedResizeSignatures.add(signature);
  globalThis.console?.log?.(
    `[Nexora][TimelineResize] previousWidth=${input.previousWidth} nextWidth=${input.nextWidth} sceneVisibleWidth=${input.sceneVisibleWidth}`
  );
}

export function traceTimelineCompact(): void {
  if (!isDev() || lastDisplayTrace === "compact") return;
  lastDisplayTrace = "compact";
  globalThis.console?.log?.("[Nexora][TimelineCompact]");
}

export function traceTimelineExpanded(): void {
  if (!isDev() || lastDisplayTrace === "expanded") return;
  lastDisplayTrace = "expanded";
  globalThis.console?.log?.("[Nexora][TimelineExpanded]");
}

export function traceTimelineDisplayState(state: TimelineDisplayState): void {
  if (state === "compact") {
    traceTimelineCompact();
    return;
  }
  traceTimelineExpanded();
}

export function resetTimeline131RuntimeDiagnosticsForTests(): void {
  loggedWidthSignatures.clear();
  loggedResizeSignatures.clear();
  lastDisplayTrace = null;
}
