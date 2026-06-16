export type MainRightPanelTab = "dashboard" | "assistant";

export type DashboardContext =
  | "overview"
  | "sources"
  | "compare"
  | "scenario"
  | "risk"
  | "war_room"
  | "timeline"
  | "settings"
  | "advisory"
  | "governance";

export type MainRightPanelRoute = Readonly<{
  tab: MainRightPanelTab;
  dashboardContext: DashboardContext | null;
  reason: string;
}>;

export const MAIN_RIGHT_PANEL_TABS: readonly MainRightPanelTab[] = Object.freeze([
  "dashboard",
  "assistant",
]);

export const DASHBOARD_CONTEXTS: readonly DashboardContext[] = Object.freeze([
  "overview",
  "sources",
  "compare",
  "scenario",
  "risk",
  "war_room",
  "timeline",
  "settings",
  "advisory",
  "governance",
]);

const DASHBOARD_CONTEXT_SET = new Set<string>(DASHBOARD_CONTEXTS);

const LEGACY_PANEL_ROUTE_TO_DASHBOARD_CONTEXT: Readonly<Record<string, DashboardContext>> = Object.freeze({
  dashboard: "overview",
  executive_dashboard: "overview",
  executive: "overview",
  sources: "sources",
  source: "sources",
  input: "sources",
  live_operations: "sources",
  compare: "compare",
  scenario: "scenario",
  scenario_tree: "scenario",
  simulate: "scenario",
  simulation: "scenario",
  risk: "risk",
  risk_view: "risk",
  rsk: "risk",
  risk_flow: "risk",
  fragility: "risk",
  fragility_scan: "risk",
  conflict: "risk",
  explanation: "risk",
  war_room: "war_room",
  war: "war_room",
  timeline: "timeline",
  decision_timeline: "timeline",
  replay: "timeline",
  settings: "settings",
  controls: "settings",
  ctrl: "settings",
  advice: "advisory",
  strategic_advice: "advisory",
  recommendation: "advisory",
  recommendations: "advisory",
  open_decision_analysis: "advisory",
  explain_object: "advisory",
  next_move: "advisory",
  governance: "governance",
  policy: "governance",
  approval: "governance",
  operational_topology: "overview",
  ops: "overview",
  exe: "overview",
  executive_control: "settings",
  canonical_route: "overview",
  routed_panel: "overview",
  panel_view: "overview",
});

export function isMainRightPanelTab(value: unknown): value is MainRightPanelTab {
  return typeof value === "string" && (MAIN_RIGHT_PANEL_TABS as readonly string[]).includes(value.trim().toLowerCase());
}

export function isDashboardContext(value: unknown): value is DashboardContext {
  return typeof value === "string" && DASHBOARD_CONTEXT_SET.has(value.trim().toLowerCase());
}

export function normalizeMainRightPanelTab(value: unknown, options?: { warn?: boolean }): MainRightPanelTab {
  if (isMainRightPanelTab(value)) return value.trim().toLowerCase() as MainRightPanelTab;

  if (options?.warn !== false) {
    console.warn("[MRP][Brake] Invalid tab detected.", {
      tab: value ?? null,
      fallbackTab: "dashboard",
    });
  }
  return "dashboard";
}

export function normalizeDashboardContext(value: unknown, options?: { warn?: boolean }): DashboardContext {
  if (isDashboardContext(value)) return value.trim().toLowerCase() as DashboardContext;

  if (options?.warn !== false) {
    console.warn("[MRP][Brake] Dashboard context routing failed.", {
      dashboardContext: value ?? null,
      fallbackContext: "overview",
    });
  }
  return "overview";
}

export function mapLegacyPanelRouteToDashboardContext(
  value: unknown,
  options?: { warn?: boolean }
): DashboardContext {
  const raw = typeof value === "string" ? value.trim().toLowerCase() : "";
  const mapped = raw ? LEGACY_PANEL_ROUTE_TO_DASHBOARD_CONTEXT[raw] : null;
  if (mapped) {
    if (options?.warn !== false && raw !== "dashboard" && raw !== "executive_dashboard") {
      console.warn("[MRP][Brake] Legacy panel route detected.", {
        legacyRoute: value,
        dashboardContext: mapped,
      });
    }
    return mapped;
  }
  return normalizeDashboardContext(value, options);
}

export function resolveMainRightPanelRoute(input: {
  requestedTab?: unknown;
  requestedContext?: unknown;
  legacyRoute?: unknown;
}): MainRightPanelRoute {
  const requestedTab =
    input.requestedTab === undefined || input.requestedTab === null
      ? "dashboard"
      : normalizeMainRightPanelTab(input.requestedTab);

  if (requestedTab === "assistant") {
    return {
      tab: "assistant",
      dashboardContext: null,
      reason: "assistant_isolated",
    };
  }

  const dashboardContext =
    input.requestedContext !== undefined && input.requestedContext !== null
      ? normalizeDashboardContext(input.requestedContext)
      : mapLegacyPanelRouteToDashboardContext(input.legacyRoute ?? "overview");

  return {
    tab: "dashboard",
    dashboardContext,
    reason: "dashboard_context_route",
  };
}

export function warnUnauthorizedMainRightPanelTab(tab: unknown): void {
  if (isMainRightPanelTab(tab)) return;
  console.warn("[MRP][Brake] Unauthorized tab creation attempt.", {
    attemptedTab: tab ?? null,
    allowedTabs: MAIN_RIGHT_PANEL_TABS,
  });
}
