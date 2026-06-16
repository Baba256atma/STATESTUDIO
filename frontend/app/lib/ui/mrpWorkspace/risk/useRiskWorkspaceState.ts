"use client";

import { useSyncExternalStore } from "react";

import {
  getRiskWorkspaceState,
  getRiskWorkspaceStateServerSnapshot,
  subscribeRiskWorkspaceState,
} from "./riskWorkspaceStateRuntime.ts";
import { buildRiskWorkspaceViewFromState } from "./riskWorkspaceStateViewMapper.ts";
import type { RiskWorkspaceState } from "./riskWorkspaceStateContract.ts";
import type { RiskWorkspaceView } from "./riskWorkspaceContract.ts";

export function useRiskWorkspaceState(): RiskWorkspaceState {
  return useSyncExternalStore(
    subscribeRiskWorkspaceState,
    getRiskWorkspaceState,
    getRiskWorkspaceStateServerSnapshot
  );
}

export function useRiskWorkspaceView(): RiskWorkspaceView {
  const state = useRiskWorkspaceState();
  return buildRiskWorkspaceViewFromState(state);
}

export default useRiskWorkspaceState;
