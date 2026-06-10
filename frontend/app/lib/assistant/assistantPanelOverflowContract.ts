/**
 * MRP:11:2:3 — Assistant support panel overflow contract.
 */

import type { AssistantPanelDockId } from "./assistantPanelDockContract";

export type AssistantPanelOverflowSizeTier = "compact" | "small" | "medium";

export type AssistantPanelOverflowTrace = Readonly<{
  panel: AssistantPanelDockId;
  overflow: boolean;
}>;

/** Canonical max-height tier per support panel. */
export const ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL: Readonly<
  Record<AssistantPanelDockId, AssistantPanelOverflowSizeTier>
> = Object.freeze({
  suggestions: "compact",
  guidance: "medium",
  scenario: "medium",
  decision: "medium",
  actions: "small",
});

export function detectAssistantPanelOverflow(scrollHeight: number, clientHeight: number): boolean {
  if (clientHeight <= 0) return false;
  return scrollHeight > clientHeight + 1;
}

export function resolveAssistantPanelOverflowTrace(input: AssistantPanelOverflowTrace): string {
  return `[AssistantPanelOverflow]\npanel=${input.panel}\noverflow=${String(input.overflow)}`;
}
