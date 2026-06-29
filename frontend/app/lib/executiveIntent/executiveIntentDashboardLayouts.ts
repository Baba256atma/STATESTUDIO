/**
 * APP-3:13 — Executive Intent dashboard layout definitions.
 * Layout metadata only — no UI rendering.
 */

import type {
  DashboardIntentCardKey,
  DashboardIntentSectionKey,
  DashboardIntentWidgetKey,
} from "./executiveIntentDashboardTypes.ts";

export const EXECUTIVE_INTENT_DASHBOARD_LAYOUTS_VERSION = "APP-3/13-LAYOUTS-1" as const;

export type DashboardLayoutPanelId =
  | "executive_summary"
  | "status_overview"
  | "confidence_panel"
  | "conflict_panel"
  | "dependency_panel"
  | "evolution_panel"
  | "unknowns_panel"
  | "readiness_panel";

export type DashboardLayoutPanel = Readonly<{
  panelId: DashboardLayoutPanelId;
  label: string;
  sectionKeys: readonly DashboardIntentSectionKey[];
  widgetKeys: readonly DashboardIntentWidgetKey[];
  cardKeys: readonly DashboardIntentCardKey[];
  readOnly: true;
}>;

export const DASHBOARD_LAYOUT_PANELS: readonly DashboardLayoutPanel[] = Object.freeze([
  Object.freeze({
    panelId: "executive_summary",
    label: "Executive Summary",
    sectionKeys: Object.freeze(["executive_summary", "intent_overview"]),
    widgetKeys: Object.freeze(["summary"]),
    cardKeys: Object.freeze(["executive_summary", "intent"]),
    readOnly: true as const,
  }),
  Object.freeze({
    panelId: "status_overview",
    label: "Status Overview",
    sectionKeys: Object.freeze(["current_state", "readiness"]),
    widgetKeys: Object.freeze(["status"]),
    cardKeys: Object.freeze(["state", "readiness"]),
    readOnly: true as const,
  }),
  Object.freeze({
    panelId: "confidence_panel",
    label: "Confidence Panel",
    sectionKeys: Object.freeze(["confidence"]),
    widgetKeys: Object.freeze(["confidence"]),
    cardKeys: Object.freeze(["confidence"]),
    readOnly: true as const,
  }),
  Object.freeze({
    panelId: "conflict_panel",
    label: "Conflict Panel",
    sectionKeys: Object.freeze(["conflicts"]),
    widgetKeys: Object.freeze(["conflict"]),
    cardKeys: Object.freeze(["conflict"]),
    readOnly: true as const,
  }),
  Object.freeze({
    panelId: "dependency_panel",
    label: "Dependency Panel",
    sectionKeys: Object.freeze(["dependencies"]),
    widgetKeys: Object.freeze(["dependency"]),
    cardKeys: Object.freeze(["dependency"]),
    readOnly: true as const,
  }),
  Object.freeze({
    panelId: "evolution_panel",
    label: "Evolution Panel",
    sectionKeys: Object.freeze(["evolution"]),
    widgetKeys: Object.freeze(["evolution"]),
    cardKeys: Object.freeze(["evolution"]),
    readOnly: true as const,
  }),
  Object.freeze({
    panelId: "unknowns_panel",
    label: "Unknowns Panel",
    sectionKeys: Object.freeze(["unknown_information", "known_information"]),
    widgetKeys: Object.freeze(["unknowns"]),
    cardKeys: Object.freeze(["unknowns"]),
    readOnly: true as const,
  }),
  Object.freeze({
    panelId: "readiness_panel",
    label: "Readiness Panel",
    sectionKeys: Object.freeze(["readiness", "highlights", "issues"]),
    widgetKeys: Object.freeze(["readiness"]),
    cardKeys: Object.freeze(["readiness"]),
    readOnly: true as const,
  }),
]);

export type DashboardLayoutDefinition = Readonly<{
  layoutId: string;
  label: string;
  panels: readonly DashboardLayoutPanel[];
  readOnly: true;
}>;

export const EXECUTIVE_INTENT_DASHBOARD_LAYOUT: DashboardLayoutDefinition = Object.freeze({
  layoutId: "executive-intent-default-layout",
  label: "Executive Intent Default Dashboard Layout",
  panels: DASHBOARD_LAYOUT_PANELS,
  readOnly: true as const,
});

export const DASHBOARD_SECTION_TITLES: Readonly<Record<DashboardIntentSectionKey, string>> =
  Object.freeze({
    executive_summary: "Executive Summary",
    intent_overview: "Intent Overview",
    current_state: "Current State",
    classification: "Classification",
    confidence: "Confidence",
    conflicts: "Conflicts",
    dependencies: "Dependencies",
    evolution: "Evolution",
    known_information: "Known Information",
    unknown_information: "Unknown Information",
    highlights: "Highlights",
    issues: "Issues",
    readiness: "Readiness",
    diagnostics: "Diagnostics",
  });

export function getDashboardLayoutPanel(
  panelId: DashboardLayoutPanelId
): DashboardLayoutPanel | null {
  return DASHBOARD_LAYOUT_PANELS.find((panel) => panel.panelId === panelId) ?? null;
}
