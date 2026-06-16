/**
 * MRP:4D:1 — Timeline workspace runtime.
 */

import {
  getTimelineWorkspaceState,
  resetTimelineWorkspaceStateRuntimeForTests,
} from "./timelineWorkspaceStateRuntime.ts";
import { resetTimelineVisualContractForTests } from "./timelineVisualContract.ts";
import { resetTimelineObjectContextRuntimeForTests } from "./timelineObjectContextRuntime.ts";
import { resetTimelineSceneAwarenessRuntimeForTests } from "./timelineSceneAwarenessRuntime.ts";
import { resetTimelineWorkspaceDataRuntimeForTests } from "./timelineWorkspaceDataRuntime.ts";
import { buildTimelineWorkspaceViewFromState } from "./timelineWorkspaceStateViewMapper.ts";
import type { TimelineWorkspaceView } from "./timelineWorkspaceContract.ts";

let foundationTraceLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceTimelineFoundationOnce(mountKey?: string | null): void {
  if (!isDev() || foundationTraceLogged) return;
  foundationTraceLogged = true;
  const state = getTimelineWorkspaceState();
  globalThis.console?.debug?.("[MRP_TIMELINE_FOUNDATION]", {
    action: "workspace_foundation_mounted",
    mountKey: mountKey ?? null,
    phase: state.phase,
  });
}

export function resetTimelineWorkspaceRuntimeForTests(): void {
  foundationTraceLogged = false;
  resetTimelineVisualContractForTests();
  resetTimelineObjectContextRuntimeForTests();
  resetTimelineSceneAwarenessRuntimeForTests();
  resetTimelineWorkspaceDataRuntimeForTests();
  resetTimelineWorkspaceStateRuntimeForTests();
}

export function buildTimelineWorkspaceView(_input?: {
  mountKey?: string | null;
}): TimelineWorkspaceView {
  return buildTimelineWorkspaceViewFromState(getTimelineWorkspaceState());
}
