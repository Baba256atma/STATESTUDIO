"use client";

import { useCallback, useReducer } from "react";
import type { DashboardContext } from "../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "./dashboardContextTypes.ts";
import { initializeDashboardAccordionRuntime, reduceDashboardAccordionRuntime } from "./dashboardAccordionRuntime.ts";

export function useDashboardAccordionRuntime(input: {
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
}) {
  const [state, dispatch] = useReducer(
    reduceDashboardAccordionRuntime,
    input,
    initializeDashboardAccordionRuntime
  );

  const expandPanel = useCallback((panelId: string) => {
    dispatch({ type: "expand_one", panelId });
  }, []);

  const collapsePanel = useCallback((panelId: string) => {
    dispatch({ type: "collapse_one", panelId });
  }, []);

  const expandMultiple = useCallback((panelIds: readonly string[]) => {
    dispatch({ type: "expand_multiple", panelIds });
  }, []);

  const collapseAll = useCallback(() => {
    dispatch({ type: "collapse_all" });
  }, []);

  const togglePanel = useCallback((panelId: string) => {
    dispatch({ type: "toggle", panelId });
  }, []);

  return {
    panels: state.panels,
    expandedPanelIds: state.expandedPanelIds,
    contextSignature: state.contextSignature,
    expandPanel,
    collapsePanel,
    expandMultiple,
    collapseAll,
    togglePanel,
  };
}
