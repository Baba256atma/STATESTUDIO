"use client";

import { useSyncExternalStore } from "react";

import {
  getWarRoomState,
  getWarRoomStateServerSnapshot,
  subscribeWarRoomState,
} from "./warRoomStateRuntime.ts";
import type { WarRoomState } from "./warRoomStateContract.ts";

export function useWarRoomState(): WarRoomState {
  return useSyncExternalStore(
    subscribeWarRoomState,
    getWarRoomState,
    getWarRoomStateServerSnapshot
  );
}

export default useWarRoomState;
