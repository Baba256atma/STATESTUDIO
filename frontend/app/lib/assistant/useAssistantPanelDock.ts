"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { AssistantPanelDockId } from "./assistantPanelDockContract";
import { DEFAULT_ASSISTANT_PANEL_VISIBILITY } from "./assistantPanelDockContract";
import { DEFAULT_ASSISTANT_SUPPORT_ACCORDION_STATE } from "./assistantSupportAccordionContract";
import {
  collapseAssistantPanel,
  expandAssistantPanel,
  getAssistantPanelVisibility,
  subscribeAssistantPanelVisibility,
  toggleAssistantPanelVisible,
} from "./assistantPanelDockRuntime";
import {
  getAssistantSupportAccordionState,
  subscribeAssistantSupportAccordion,
} from "./assistantSupportAccordionRuntime";

export function useAssistantSupportAccordionState(): ReturnType<
  typeof getAssistantSupportAccordionState
> {
  return useSyncExternalStore(
    subscribeAssistantSupportAccordion,
    getAssistantSupportAccordionState,
    () => DEFAULT_ASSISTANT_SUPPORT_ACCORDION_STATE
  );
}

export function useAssistantSupportAccordionOpenPanelId(): ReturnType<
  typeof getAssistantSupportAccordionState
>["openPanelId"] {
  return useAssistantSupportAccordionState().openPanelId;
}

export function useAssistantPanelVisibility(): ReturnType<typeof getAssistantPanelVisibility> {
  return useSyncExternalStore(
    subscribeAssistantPanelVisibility,
    getAssistantPanelVisibility,
    () => DEFAULT_ASSISTANT_PANEL_VISIBILITY
  );
}

export function useAssistantPanelVisible(panelId: AssistantPanelDockId): boolean {
  return useAssistantSupportAccordionOpenPanelId() === panelId;
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
