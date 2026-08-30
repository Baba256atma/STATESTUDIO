/**
 * MRP:12:7 — Assistant support panel overflow contract.
 *
 * Semantic size tiers and the panel→tier map live here. Panel identity is the
 * accordion panel-id leaf — not the dock contract — so this module stays a
 * renderer-neutral leaf. DockId is an alias of the same union; tokens/runtime
 * may still accept DockId at their public surface.
 */

import type { AssistantSupportAccordionPanelId } from "./assistantSupportAccordionContract.ts";

export type AssistantPanelOverflowSizeTier = "compact" | "small" | "medium";

export type AssistantPanelOverflowTrace = Readonly<{
  panel: AssistantSupportAccordionPanelId;
  overflow: boolean;
}>;

export const ASSISTANT_PANEL_OVERFLOW_CONTRACT_REQUIRED_VALUE_EXPORTS = Object.freeze([
  "ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL",
  "detectAssistantPanelOverflow",
  "resolveAssistantPanelOverflowTrace",
] as const);

/** Canonical max-height tier per support panel. One mapping; no silent fallback. */
export const ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL: Readonly<
  Record<AssistantSupportAccordionPanelId, AssistantPanelOverflowSizeTier>
> = Object.freeze({
  insight: "medium",
  scenario: "medium",
  analytics: "medium",
  governance: "medium",
  actions: "small",
  questions: "medium",
});

export function detectAssistantPanelOverflow(scrollHeight: number, clientHeight: number): boolean {
  if (clientHeight <= 0) return false;
  return scrollHeight > clientHeight + 1;
}

export function resolveAssistantPanelOverflowTrace(input: AssistantPanelOverflowTrace): string {
  return `[AssistantPanelOverflow]\npanel=${input.panel}\noverflow=${String(input.overflow)}`;
}
