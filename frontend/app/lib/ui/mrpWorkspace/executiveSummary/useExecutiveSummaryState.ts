"use client";

import { useSyncExternalStore } from "react";

import {
  getExecutiveSummaryState,
  getExecutiveSummaryStateServerSnapshot,
  subscribeExecutiveSummaryState,
} from "./executiveSummaryStateRuntime.ts";
import { buildExecutiveSummaryWorkspaceViewFromState } from "./executiveSummaryStateViewMapper.ts";
import type { ExecutiveSummaryState } from "./executiveSummaryStateContract.ts";
import type { ExecutiveSummaryWorkspaceView } from "./executiveSummaryWorkspaceContract.ts";

export function useExecutiveSummaryState(): ExecutiveSummaryState {
  return useSyncExternalStore(
    subscribeExecutiveSummaryState,
    getExecutiveSummaryState,
    getExecutiveSummaryStateServerSnapshot
  );
}

export function useExecutiveSummaryWorkspaceView(): ExecutiveSummaryWorkspaceView {
  const state = useExecutiveSummaryState();
  return buildExecutiveSummaryWorkspaceViewFromState(state);
}

export default useExecutiveSummaryState;
