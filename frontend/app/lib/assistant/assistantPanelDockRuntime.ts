/**
 * MRP:11:2:5 — Back-compat bridge for assistant panel dock visibility.
 *
 * The canonical state is assistantAccordionState.openPanelId. Visibility booleans are
 * derived snapshots so older callers cannot accidentally keep multiple panels open.
 */

import {
  resolveAssistantPanelDockAction,
  type AssistantPanelDockAction,
  type AssistantPanelDockId,
  type AssistantPanelVisibility,
} from "./assistantPanelDockContract.ts";
import {
  collapseAssistantSupportAccordionPanel,
  getCachedAssistantPanelVisibilitySnapshot,
  isAssistantSupportAccordionPanelOpen,
  openAssistantSupportAccordionPanel,
  resetAssistantSupportAccordionForTests,
  resolveAssistantAccordionOpenPanelFromVisibility,
  subscribeAssistantSupportAccordion,
  toggleAssistantSupportAccordionPanel,
} from "./assistantSupportAccordionRuntime.ts";

export function getAssistantPanelVisibility(): AssistantPanelVisibility {
  return getCachedAssistantPanelVisibilitySnapshot();
}

export function isAssistantPanelVisible(panelId: AssistantPanelDockId): boolean {
  return isAssistantSupportAccordionPanelOpen(panelId);
}

export function traceAssistantPanelDock(input: {
  panel: AssistantPanelDockId;
  action: AssistantPanelDockAction;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(
    `[AssistantPanelDock]\npanel=${input.panel}\naction=${input.action}`
  );
}

export function setAssistantPanelVisible(panelId: AssistantPanelDockId, visible: boolean): boolean {
  const wasVisible = isAssistantSupportAccordionPanelOpen(panelId);
  if (visible) {
    openAssistantSupportAccordionPanel(panelId);
  } else {
    collapseAssistantSupportAccordionPanel(panelId);
  }
  if (wasVisible !== visible) {
    traceAssistantPanelDock({
      panel: panelId,
      action: resolveAssistantPanelDockAction(visible),
    });
  }
  return isAssistantSupportAccordionPanelOpen(panelId);
}

export function collapseAssistantPanel(panelId: AssistantPanelDockId): boolean {
  return setAssistantPanelVisible(panelId, false);
}

export function expandAssistantPanel(panelId: AssistantPanelDockId): boolean {
  return setAssistantPanelVisible(panelId, true);
}

export function toggleAssistantPanelVisible(panelId: AssistantPanelDockId): boolean {
  toggleAssistantSupportAccordionPanel(panelId);
  traceAssistantPanelDock({
    panel: panelId,
    action: resolveAssistantPanelDockAction(isAssistantSupportAccordionPanelOpen(panelId)),
  });
  return isAssistantSupportAccordionPanelOpen(panelId);
}

export function subscribeAssistantPanelVisibility(listener: () => void): () => void {
  return subscribeAssistantSupportAccordion(listener);
}

/** Test-only reset. */
export function resetAssistantPanelVisibilityForTests(
  state?: AssistantPanelVisibility
): void {
  resetAssistantSupportAccordionForTests({
    openPanelId: state
      ? resolveAssistantAccordionOpenPanelFromVisibility(state)
      : "suggestions",
  });
}
