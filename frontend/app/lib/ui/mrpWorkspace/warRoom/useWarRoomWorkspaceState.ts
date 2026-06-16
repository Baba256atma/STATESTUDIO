"use client";

import { useSyncExternalStore } from "react";

import {
  getWarRoomWorkspaceState,
  getWarRoomWorkspaceStateServerSnapshot,
  subscribeWarRoomWorkspaceState,
} from "./warRoomWorkspaceStateRuntime.ts";
import { buildWarRoomWorkspaceViewFromState } from "./warRoomWorkspaceStateViewMapper.ts";
import type { WarRoomWorkspaceState } from "./warRoomWorkspaceStateContract.ts";
import type { WarRoomWorkspaceView } from "./warRoomWorkspaceContract.ts";

export function useWarRoomWorkspaceState(): WarRoomWorkspaceState {
  return useSyncExternalStore(
    subscribeWarRoomWorkspaceState,
    getWarRoomWorkspaceState,
    getWarRoomWorkspaceStateServerSnapshot
  );
}

export function useWarRoomWorkspaceView(): WarRoomWorkspaceView {
  const state = useWarRoomWorkspaceState();
  return buildWarRoomWorkspaceViewFromState(state);
}

export default useWarRoomWorkspaceState;
