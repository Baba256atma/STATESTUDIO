"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { AssistantPanelDockId } from "./assistantPanelDockContract";
import { DEFAULT_ASSISTANT_PANEL_VISIBILITY } from "./assistantPanelDockContract";
import {
  collapseAssistantPanel,
  expandAssistantPanel,
  getAssistantPanelVisibility,
  subscribeAssistantPanelVisibility,
  toggleAssistantPanelVisible,
} from "./assistantPanelDockRuntime";

export function useAssistantPanelVisibility(): ReturnType<typeof getAssistantPanelVisibility> {
  return useSyncExternalStore(
    subscribeAssistantPanelVisibility,
    getAssistantPanelVisibility,
    () => DEFAULT_ASSISTANT_PANEL_VISIBILITY
  );
}

export function useAssistantPanelVisible(panelId: AssistantPanelDockId): boolean {
  const visibility = useAssistantPanelVisibility();
  return visibility[panelId];
}

export function useAssistantPanelDockControls(): Readonly<{
  collapsePanel: (panelId: AssistantPanelDockId) => void;
  expandPanel: (panelId: AssistantPanelDockId) => void;
  togglePanel: (panelId: AssistantPanelDockId) => void;
}> {
  const collapsePanel = useCallback((panelId: AssistantPanelDockId) => {
    collapseAssistantPanel(panelId);
  }, []);
  const expandPanel = useCallback((panelId: AssistantPanelDockId) => {
    expandAssistantPanel(panelId);
  }, []);
  const togglePanel = useCallback((panelId: AssistantPanelDockId) => {
    toggleAssistantPanelVisible(panelId);
  }, []);

  return { collapsePanel, expandPanel, togglePanel };
}

export default useAssistantPanelVisibility;
