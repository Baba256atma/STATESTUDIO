"use client";

import { useSyncExternalStore } from "react";

import {
  getGovernanceWorkspaceState,
  getGovernanceWorkspaceStateServerSnapshot,
  subscribeGovernanceWorkspaceState,
  type GovernanceWorkspaceState,
} from "./governanceWorkspaceState.ts";
import { buildGovernanceWorkspaceViewFromState } from "./governanceWorkspaceStateViewMapper.ts";
import type { GovernanceWorkspaceView } from "./governanceWorkspaceContract.ts";

export function useGovernanceWorkspaceState(): GovernanceWorkspaceState {
  return useSyncExternalStore(
    subscribeGovernanceWorkspaceState,
    getGovernanceWorkspaceState,
    getGovernanceWorkspaceStateServerSnapshot
  );
}

export function useGovernanceWorkspaceView(): GovernanceWorkspaceView {
  const state = useGovernanceWorkspaceState();
  return buildGovernanceWorkspaceViewFromState(state);
}

export default useGovernanceWorkspaceState;
