/**
 * MRP:12:7 — Assistant executive support dock contract.
 */

import type { AssistantSupportAccordionPanelId } from "./assistantSupportAccordionContract.ts";

export type AssistantPanelDockId = AssistantSupportAccordionPanelId;

export type AssistantPanelVisibility = Readonly<{
  insight: boolean;
  scenario: boolean;
  analytics: boolean;
  governance: boolean;
  actions: boolean;
  questions: boolean;
}>;

export type AssistantPanelDockAction = "expand" | "collapse";

export const DEFAULT_ASSISTANT_PANEL_VISIBILITY: AssistantPanelVisibility = Object.freeze({
  insight: false,
  scenario: false,
  analytics: false,
  governance: false,
  actions: false,
  questions: false,
});

export const ASSISTANT_PANEL_DOCK_STORAGE_KEY = "nexora:assistant-panel-dock-visibility" as const;

export type AssistantPanelDockDefinition = Readonly<{
  id: AssistantPanelDockId;
  label: string;
  icon: string;
}>;

export const ASSISTANT_PANEL_DOCK_DEFINITIONS: Readonly<Record<AssistantPanelDockId, AssistantPanelDockDefinition>> =
  Object.freeze({
    insight: { id: "insight", label: "Insight", icon: "💡" },
    scenario: { id: "scenario", label: "Scenario", icon: "📘" },
    analytics: { id: "analytics", label: "Analytics", icon: "📊" },
    governance: { id: "governance", label: "Governance", icon: "⚖" },
    actions: { id: "actions", label: "Actions", icon: "⚡" },
    questions: { id: "questions", label: "Executive Questions", icon: "❓" },
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
