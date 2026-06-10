/**
 * MRP:11:2:2 / MRP:11:2:5 — Assistant support panel dock compatibility contract.
 */

import type { AssistantSupportAccordionPanelId } from "./assistantSupportAccordionContract.ts";

export type AssistantPanelDockId = AssistantSupportAccordionPanelId;

export type AssistantPanelVisibility = Readonly<{
  suggestions: boolean;
  guidance: boolean;
  scenario: boolean;
  decision: boolean;
  actions: boolean;
}>;

export type AssistantPanelDockAction = "expand" | "collapse";

export const DEFAULT_ASSISTANT_PANEL_VISIBILITY: AssistantPanelVisibility = Object.freeze({
  suggestions: true,
  guidance: false,
  scenario: false,
  decision: false,
  actions: false,
});

export const ASSISTANT_PANEL_DOCK_STORAGE_KEY = "nexora:assistant-panel-dock-visibility" as const;

export type AssistantPanelDockDefinition = Readonly<{
  id: AssistantPanelDockId;
  label: string;
  icon: string;
}>;

export const ASSISTANT_PANEL_DOCK_DEFINITIONS: Readonly<Record<AssistantPanelDockId, AssistantPanelDockDefinition>> =
  Object.freeze({
    suggestions: { id: "suggestions", label: "Suggested Questions", icon: "💡" },
    guidance: { id: "guidance", label: "Guidance", icon: "📘" },
    scenario: { id: "scenario", label: "Scenario", icon: "📊" },
    decision: { id: "decision", label: "Decision", icon: "⚖️" },
    actions: { id: "actions", label: "Actions", icon: "⚡" },
  });

export function resolveAssistantPanelDockAction(visible: boolean): AssistantPanelDockAction {
  return visible ? "collapse" : "expand";
}

export function resolveAssistantPanelExpandTooltip(panelId: AssistantPanelDockId): string {
  return `Show ${ASSISTANT_PANEL_DOCK_DEFINITIONS[panelId].label}`;
}

export function resolveAssistantPanelCollapseTooltip(panelId: AssistantPanelDockId): string {
  return `Hide ${ASSISTANT_PANEL_DOCK_DEFINITIONS[panelId].label}`;
}
