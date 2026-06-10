/**
 * MRP:11:2:3 — Assistant panel overflow observation + dev trace runtime.
 */

import type { AssistantPanelDockId } from "./assistantPanelDockContract";
import {
  detectAssistantPanelOverflow,
  resolveAssistantPanelOverflowTrace,
} from "./assistantPanelOverflowContract.ts";

const overflowByPanel = new Map<AssistantPanelDockId, boolean>();

export function getAssistantPanelOverflow(panelId: AssistantPanelDockId): boolean {
  return overflowByPanel.get(panelId) ?? false;
}

export function traceAssistantPanelOverflow(input: {
  panel: AssistantPanelDockId;
  overflow: boolean;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(resolveAssistantPanelOverflowTrace(input));
}

export function setAssistantPanelOverflow(panelId: AssistantPanelDockId, overflow: boolean): void {
  if (overflowByPanel.get(panelId) === overflow) return;
  overflowByPanel.set(panelId, overflow);
  traceAssistantPanelOverflow({ panel: panelId, overflow });
}

export function measureAssistantPanelOverflow(element: HTMLElement): boolean {
  return detectAssistantPanelOverflow(element.scrollHeight, element.clientHeight);
}

export function observeAssistantPanelOverflow(input: {
  panelId: AssistantPanelDockId;
  element: HTMLElement | null;
  visible: boolean;
}): () => void {
  const { panelId, element, visible } = input;

  if (!element || !visible) {
    setAssistantPanelOverflow(panelId, false);
    delete element?.dataset.nxOverflow;
    return () => undefined;
  }

  const measure = () => {
    const overflow = measureAssistantPanelOverflow(element);
    element.dataset.nxOverflow = overflow ? "true" : "false";
    setAssistantPanelOverflow(panelId, overflow);
  };

  measure();

  if (typeof ResizeObserver === "undefined") {
    return () => undefined;
  }

  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(element);

  const mutationObserver =
    typeof MutationObserver !== "undefined"
      ? new MutationObserver(measure)
      : null;
  mutationObserver?.observe(element, { childList: true, subtree: true, characterData: true });

  return () => {
    resizeObserver.disconnect();
    mutationObserver?.disconnect();
    delete element.dataset.nxOverflow;
    setAssistantPanelOverflow(panelId, false);
  };
}

/** Test-only reset. */
export function resetAssistantPanelOverflowForTests(): void {
  overflowByPanel.clear();
}
