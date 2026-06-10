/**
 * MRP:11:2:5 — Assistant support accordion contract.
 */

export type AssistantSupportAccordionPanelId =
  | "suggestions"
  | "guidance"
  | "scenario"
  | "decision"
  | "actions";

export type AssistantSupportAccordionState = Readonly<{
  openPanelId: AssistantSupportAccordionPanelId | null;
}>;

export type AssistantSupportAccordionTraceAction =
  | "open"
  | "collapse_all"
  | `switch_from_${AssistantSupportAccordionPanelId}`;

export const DEFAULT_ASSISTANT_SUPPORT_ACCORDION_STATE: AssistantSupportAccordionState =
  Object.freeze({
    openPanelId: "suggestions",
  });

export const ASSISTANT_SUPPORT_ACCORDION_PANEL_ORDER: readonly AssistantSupportAccordionPanelId[] =
  Object.freeze(["suggestions", "guidance", "scenario", "decision", "actions"]);

export function resolveAssistantSupportAccordionPanelVisible(
  state: AssistantSupportAccordionState,
  panelId: AssistantSupportAccordionPanelId
): boolean {
  return state.openPanelId === panelId;
}

