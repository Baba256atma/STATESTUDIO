/**
 * MRP:11:2:5 — Single-open assistant support accordion runtime.
 */

import {
  ASSISTANT_SUPPORT_ACCORDION_PANEL_ORDER,
  DEFAULT_ASSISTANT_SUPPORT_ACCORDION_STATE,
  type AssistantSupportAccordionPanelId,
  type AssistantSupportAccordionState,
  type AssistantSupportAccordionTraceAction,
} from "./assistantSupportAccordionContract.ts";
import type { AssistantPanelVisibility } from "./assistantPanelDockContract.ts";
import {
  traceMrp127AccordionContractPassed,
  traceMrp127SupportPanelOpened,
  traceMrp127SupportPanelSwitched,
} from "./mrp127RuntimeDiagnostics.ts";
import { traceMrp128SingleOpenContractPassed } from "./mrp128RuntimeDiagnostics.ts";

const listeners = new Set<() => void>();

let assistantAccordionState: AssistantSupportAccordionState = {
  ...DEFAULT_ASSISTANT_SUPPORT_ACCORDION_STATE,
};

let cachedAssistantPanelVisibility: AssistantPanelVisibility =
  deriveAssistantPanelVisibilityFromAccordion(assistantAccordionState);

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

export function getAssistantSupportAccordionState(): AssistantSupportAccordionState {
  return assistantAccordionState;
}

export function getAssistantSupportAccordionOpenPanelId(): AssistantSupportAccordionPanelId | null {
  return assistantAccordionState.openPanelId;
}

export function isAssistantSupportAccordionPanelOpen(
  panelId: AssistantSupportAccordionPanelId
): boolean {
  return assistantAccordionState.openPanelId === panelId;
}

export function deriveAssistantPanelVisibilityFromAccordion(
  state: AssistantSupportAccordionState = assistantAccordionState
): AssistantPanelVisibility {
  return {
    insight: state.openPanelId === "insight",
    scenario: state.openPanelId === "scenario",
    analytics: state.openPanelId === "analytics",
    governance: state.openPanelId === "governance",
    actions: state.openPanelId === "actions",
    questions: state.openPanelId === "questions",
  };
}

export function getCachedAssistantPanelVisibilitySnapshot(): AssistantPanelVisibility {
  return cachedAssistantPanelVisibility;
}

export function resolveAssistantAccordionOpenPanelFromVisibility(
  visibility: Partial<AssistantPanelVisibility>
): AssistantSupportAccordionPanelId | null {
  for (const panelId of ASSISTANT_SUPPORT_ACCORDION_PANEL_ORDER) {
    if (visibility[panelId]) return panelId;
  }
  return null;
}

export function traceAssistantSupportAccordion(input: {
  openPanel: AssistantSupportAccordionPanelId | null;
  action: AssistantSupportAccordionTraceAction;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(
    `[AssistantSupportAccordion]\nopenPanel=${input.openPanel ?? "null"}\naction=${input.action}`
  );
}

export function traceAssistantPanelDockSnapshot(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(
    `[AssistantPanelDockSnapshot]\nstable=true\nopenPanelId=${
      assistantAccordionState.openPanelId ?? "null"
    }\nlistenerCount=${listeners.size}`
  );
}

function commitAssistantSupportAccordionState(
  nextOpenPanelId: AssistantSupportAccordionPanelId | null,
  action: AssistantSupportAccordionTraceAction
): AssistantSupportAccordionPanelId | null {
  if (assistantAccordionState.openPanelId === nextOpenPanelId) return nextOpenPanelId;
  assistantAccordionState = { openPanelId: nextOpenPanelId };
  cachedAssistantPanelVisibility =
    deriveAssistantPanelVisibilityFromAccordion(assistantAccordionState);
  traceAssistantSupportAccordion({ openPanel: nextOpenPanelId, action });
  traceAssistantPanelDockSnapshot();
  notifyListeners();
  return nextOpenPanelId;
}

export function openAssistantSupportAccordionPanel(
  panelId: AssistantSupportAccordionPanelId
): AssistantSupportAccordionPanelId {
  const currentOpenPanelId = assistantAccordionState.openPanelId;
  const action: AssistantSupportAccordionTraceAction =
    currentOpenPanelId && currentOpenPanelId !== panelId
      ? `switch_from_${currentOpenPanelId}`
      : "open";
  if (currentOpenPanelId && currentOpenPanelId !== panelId) {
    traceMrp127SupportPanelSwitched(currentOpenPanelId, panelId);
  } else if (!currentOpenPanelId || currentOpenPanelId !== panelId) {
    traceMrp127SupportPanelOpened(panelId);
  }
  commitAssistantSupportAccordionState(panelId, action);
  traceMrp127AccordionContractPassed(assistantAccordionState.openPanelId ? 1 : 0);
  traceMrp128SingleOpenContractPassed(assistantAccordionState.openPanelId ? 1 : 0);
  return panelId;
}

export function collapseAssistantSupportAccordionPanel(
  panelId: AssistantSupportAccordionPanelId
): AssistantSupportAccordionPanelId | null {
  if (assistantAccordionState.openPanelId !== panelId) return assistantAccordionState.openPanelId;
  return commitAssistantSupportAccordionState(null, "collapse_all");
}

export function collapseAllAssistantSupportAccordionPanels(): null {
  commitAssistantSupportAccordionState(null, "collapse_all");
  return null;
}

export function setAssistantSupportAccordionPanelOpen(
  panelId: AssistantSupportAccordionPanelId,
  open: boolean
): AssistantSupportAccordionPanelId | null {
  return open
    ? openAssistantSupportAccordionPanel(panelId)
    : collapseAssistantSupportAccordionPanel(panelId);
}

export function toggleAssistantSupportAccordionPanel(
  panelId: AssistantSupportAccordionPanelId
): AssistantSupportAccordionPanelId | null {
  return assistantAccordionState.openPanelId === panelId
    ? collapseAssistantSupportAccordionPanel(panelId)
    : openAssistantSupportAccordionPanel(panelId);
}

export function subscribeAssistantSupportAccordion(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Test-only reset. */
export function resetAssistantSupportAccordionForTests(
  state: AssistantSupportAccordionState = DEFAULT_ASSISTANT_SUPPORT_ACCORDION_STATE
): void {
  assistantAccordionState = { ...state };
  cachedAssistantPanelVisibility =
    deriveAssistantPanelVisibilityFromAccordion(assistantAccordionState);
  traceAssistantPanelDockSnapshot();
  notifyListeners();
}
