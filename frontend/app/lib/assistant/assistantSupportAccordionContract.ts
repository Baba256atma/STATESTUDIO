/**
 * MRP:12:7 — Assistant support accordion contract (executive utility dock).
 */

export type AssistantSupportAccordionPanelId =
  | "insight"
  | "scenario"
  | "analytics"
  | "governance"
  | "actions"
  | "questions";

export type AssistantSupportAccordionState = Readonly<{
  openPanelId: AssistantSupportAccordionPanelId | null;
}>;

export type AssistantSupportAccordionTraceAction =
  | "open"
  | "collapse_all"
  | `switch_from_${AssistantSupportAccordionPanelId}`;

/** Chat-first default — no support panel open on mount. */
export const DEFAULT_ASSISTANT_SUPPORT_ACCORDION_STATE: AssistantSupportAccordionState =
  Object.freeze({
    openPanelId: null,
  });

export const ASSISTANT_SUPPORT_ACCORDION_PANEL_ORDER: readonly AssistantSupportAccordionPanelId[] =
  Object.freeze(["insight", "scenario", "analytics", "governance", "actions", "questions"]);

export function resolveAssistantSupportAccordionPanelVisible(
  state: AssistantSupportAccordionState,
  panelId: AssistantSupportAccordionPanelId
): boolean {
  return state.openPanelId === panelId;
}
