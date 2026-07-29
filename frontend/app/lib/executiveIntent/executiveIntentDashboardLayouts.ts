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
    sectionKeys: Object.freeze(["executive_summary", "intent_overview"] as const),
    widgetKeys: Object.freeze(["summary"] as const),
    cardKeys: Object.freeze(["executive_summary", "intent"] as const),
    readOnly: true as const,
  }),
  Object.freeze({
    panelId: "status_overview",
    label: "Status Overview",
    sectionKeys: Object.freeze(["current_state", "readiness"] as const),
    widgetKeys: Object.freeze(["status"] as const),
    cardKeys: Object.freeze(["state", "readiness"] as const),
    readOnly: true as const,
  }),
  Object.freeze({
    panelId: "confidence_panel",
    label: "Confidence Panel",
    sectionKeys: Object.freeze(["confidence"] as const),
    widgetKeys: Object.freeze(["confidence"] as const),
    cardKeys: Object.freeze(["confidence"] as const),
    readOnly: true as const,
  }),
  Object.freeze({
    panelId: "conflict_panel",
    label: "Conflict Panel",
    sectionKeys: Object.freeze(["conflicts"] as const),
    widgetKeys: Object.freeze(["conflict"] as const),
    cardKeys: Object.freeze(["conflict"] as const),
    readOnly: true as const,
  }),
  Object.freeze({
    panelId: "dependency_panel",
    label: "Dependency Panel",
    sectionKeys: Object.freeze(["dependencies"] as const),
    widgetKeys: Object.freeze(["dependency"] as const),
    cardKeys: Object.freeze(["dependency"] as const),
    readOnly: true as const,
  }),
  Object.freeze({
    panelId: "evolution_panel",
    label: "Evolution Panel",
    sectionKeys: Object.freeze(["evolution"] as const),
    widgetKeys: Object.freeze(["evolution"] as const),
    cardKeys: Object.freeze(["evolution"] as const),
    readOnly: true as const,
  }),
  Object.freeze({
    panelId: "unknowns_panel",
    label: "Unknowns Panel",
    sectionKeys: Object.freeze(["unknown_information", "known_information"] as const),
    widgetKeys: Object.freeze(["unknowns"] as const),
    cardKeys: Object.freeze(["unknowns"] as const),
    readOnly: true as const,
  }),
  Object.freeze({
    panelId: "readiness_panel",
    label: "Readiness Panel",
    sectionKeys: Object.freeze(["readiness", "highlights", "issues"] as const),
    widgetKeys: Object.freeze(["readiness"] as const),
    cardKeys: Object.freeze(["readiness"] as const),
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
