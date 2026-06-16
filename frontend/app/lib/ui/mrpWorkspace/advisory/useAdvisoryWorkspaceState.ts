"use client";

import { useSyncExternalStore } from "react";

import {
  getAdvisoryWorkspaceState,
  getAdvisoryWorkspaceStateServerSnapshot,
  subscribeAdvisoryWorkspaceState,
} from "./advisoryWorkspaceStateRuntime.ts";
import { buildAdvisoryWorkspaceViewFromState } from "./advisoryWorkspaceStateViewMapper.ts";
import type { AdvisoryWorkspaceState } from "./advisoryWorkspaceStateContract.ts";
import type { AdvisoryWorkspaceView } from "./advisoryWorkspaceContract.ts";

export function useAdvisoryWorkspaceState(): AdvisoryWorkspaceState {
  return useSyncExternalStore(
    subscribeAdvisoryWorkspaceState,
    getAdvisoryWorkspaceState,
    getAdvisoryWorkspaceStateServerSnapshot
  );
}

export function useAdvisoryWorkspaceView(): AdvisoryWorkspaceView {
  const state = useAdvisoryWorkspaceState();
  return buildAdvisoryWorkspaceViewFromState(state);
}

export default useAdvisoryWorkspaceState;
