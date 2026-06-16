"use client";

import { useSyncExternalStore } from "react";

import {
  getTimelineWorkspaceState,
  getTimelineWorkspaceStateServerSnapshot,
  subscribeTimelineWorkspaceState,
} from "./timelineWorkspaceStateRuntime.ts";
import { buildTimelineWorkspaceViewFromState } from "./timelineWorkspaceStateViewMapper.ts";
import type { TimelineWorkspaceState } from "./timelineWorkspaceStateContract.ts";
import type { TimelineWorkspaceView } from "./timelineWorkspaceContract.ts";

export function useTimelineWorkspaceState(): TimelineWorkspaceState {
  return useSyncExternalStore(
    subscribeTimelineWorkspaceState,
    getTimelineWorkspaceState,
    getTimelineWorkspaceStateServerSnapshot
  );
}

export function useTimelineWorkspaceView(): TimelineWorkspaceView {
  const state = useTimelineWorkspaceState();
  return buildTimelineWorkspaceViewFromState(state);
}

export default useTimelineWorkspaceState;
