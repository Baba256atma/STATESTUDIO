"use client";

import { useSyncExternalStore } from "react";

import {
  getOperationalWorkspaceState,
  getOperationalWorkspaceStateServerSnapshot,
  subscribeOperationalWorkspaceState,
} from "./operationalWorkspaceStateRuntime.ts";
import { buildOperationalWorkspaceViewFromState } from "./operationalWorkspaceStateViewMapper.ts";
import type { OperationalWorkspaceState } from "./operationalWorkspaceStateContract.ts";
import type { OperationalWorkspaceView } from "./operationalWorkspaceContract.ts";

export function useOperationalWorkspaceState(): OperationalWorkspaceState {
  return useSyncExternalStore(
    subscribeOperationalWorkspaceState,
    getOperationalWorkspaceState,
    getOperationalWorkspaceStateServerSnapshot
  );
}

export function useOperationalWorkspaceView(): OperationalWorkspaceView {
  const state = useOperationalWorkspaceState();
  return buildOperationalWorkspaceViewFromState(state);
}

export default useOperationalWorkspaceState;
