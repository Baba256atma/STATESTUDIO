/**
 * MRP:1:2 — Bridge between Dashboard Mode Runtime and legacy DashboardContext routing.
 *
 * Legacy paths remain compatibility inputs only. All commits normalize to DashboardMode first.
 */

import type { DashboardContext } from "../ui/mainRightPanelContract.ts";
import { mapLegacyPanelRouteToDashboardContext } from "../ui/mainRightPanelContract.ts";
import {
  DEFAULT_DASHBOARD_MODE,
  normalizeDashboardMode,
  type DashboardMode,
  warnDashboardRuntimeBrake,
} from "./dashboardModeRuntimeContract.ts";

const LEGACY_CONTEXT_TO_MODE: Readonly<Record<DashboardContext, DashboardMode>> = Object.freeze({
  overview: "overview",
  sources: "overview",
  scenario: "scenario",
  risk: "analyze",
  war_room: "war_room",
  timeline: "overview",
  settings: "overview",
});

const MODE_TO_LEGACY_CONTEXT: Readonly<Record<DashboardMode, DashboardContext>> = Object.freeze({
  overview: "overview",
  focus: "overview",
  analyze: "risk",
  compare: "scenario",
  scenario: "scenario",
  war_room: "war_room",
});

const LEGACY_ROUTE_TO_MODE: Readonly<Record<string, DashboardMode>> = Object.freeze({
  dashboard: "overview",
  executive_dashboard: "overview",
  object: "focus",
  object_focus: "focus",
  focus: "focus",
  risk: "analyze",
  risk_flow: "analyze",
  fragility: "analyze",
  explanation: "analyze",
  conflict: "analyze",
  compare: "compare",
  simulate: "scenario",
  scenario: "scenario",
  scenario_tree: "scenario",
  war_room: "war_room",
  war: "war_room",
  timeline: "overview",
  decision_timeline: "overview",
});

export function mapLegacyDashboardContextToMode(context: unknown): DashboardMode {
  if (typeof context !== "string") {
    return DEFAULT_DASHBOARD_MODE;
  }
  const normalized = context.trim().toLowerCase() as DashboardContext;
  const mapped = LEGACY_CONTEXT_TO_MODE[normalized];
  if (mapped) return mapped;
  warnDashboardRuntimeBrake("Missing mode contract for legacy dashboard context.", {
    legacyContext: context,
    fallback: DEFAULT_DASHBOARD_MODE,
  });
  return DEFAULT_DASHBOARD_MODE;
}

export function mapDashboardModeToLegacyContext(mode: DashboardMode): DashboardContext {
  return MODE_TO_LEGACY_CONTEXT[mode] ?? "overview";
}

export function mapLegacyRouteToDashboardMode(route: unknown): DashboardMode {
  if (typeof route !== "string" || !route.trim()) {
    return DEFAULT_DASHBOARD_MODE;
  }
  const raw = route.trim().toLowerCase();
  const direct = LEGACY_ROUTE_TO_MODE[raw];
  if (direct) return direct;
  const legacyContext = mapLegacyPanelRouteToDashboardContext(raw, { warn: false });
  return mapLegacyDashboardContextToMode(legacyContext);
}

export function syncDashboardModeAndContext(input: {
  dashboardMode?: unknown;
  dashboardContext?: unknown;
}): { dashboardMode: DashboardMode; dashboardContext: DashboardContext } {
  if (input.dashboardMode !== undefined && input.dashboardMode !== null) {
    const dashboardMode = normalizeDashboardMode(input.dashboardMode, { warn: false });
    return {
      dashboardMode,
      dashboardContext: mapDashboardModeToLegacyContext(dashboardMode),
    };
  }
  const dashboardContext = mapLegacyPanelRouteToDashboardContext(
    input.dashboardContext ?? DEFAULT_DASHBOARD_MODE,
    { warn: false }
  );
  return {
    dashboardMode: mapLegacyDashboardContextToMode(dashboardContext),
    dashboardContext,
  };
}
