/**
 * MRP:1:2 — Dashboard Mode Runtime Contract.
 *
 * Single authority for executive dashboard modes inside MRP Dashboard tab.
 * Physical storage: NexoraWorkspaceState.dashboardMode (syncs legacy dashboardContext).
 */

export type DashboardMode =
  | "overview"
  | "focus"
  | "analyze"
  | "compare"
  | "scenario"
  | "war_room"
  | "risk"
  | "timeline"
  | "advisory"
  | "governance";

export const DASHBOARD_MODES: readonly DashboardMode[] = Object.freeze([
  "overview",
  "focus",
  "analyze",
  "compare",
  "scenario",
  "war_room",
  "risk",
  "timeline",
  "advisory",
  "governance",
]);

export const DEFAULT_DASHBOARD_MODE: DashboardMode = "overview";

export const CANONICAL_DASHBOARD_MODE_OWNER = "NexoraWorkspaceState.dashboardMode";

export type DashboardModeRouteSource =
  | "object_panel"
  | "scene_panel"
  | "timeline"
  | "assistant"
  | "executive_command_dock"
  | "legacy_router"
  | "workspace"
  | "unknown";

export type DashboardRuntimeState = Readonly<{
  mode: DashboardMode;
  owner: typeof CANONICAL_DASHBOARD_MODE_OWNER;
  defaultMode: DashboardMode;
}>;

export type DashboardModeRouteRequest = Readonly<{
  requestedMode?: unknown;
  source: DashboardModeRouteSource;
  reason?: string;
}>;

export type DashboardModeRouteResult = Readonly<{
  mode: DashboardMode;
  redirected: boolean;
  reason: string;
}>;

const DASHBOARD_MODE_SET = new Set<string>(DASHBOARD_MODES);
const loggedBrakes = new Set<string>();
const loggedRoutes = new Set<string>();

export function isDashboardMode(value: unknown): value is DashboardMode {
  return typeof value === "string" && DASHBOARD_MODE_SET.has(value.trim().toLowerCase());
}

export function warnDashboardRuntimeBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[DashboardRuntime][Brake]", { message, ...detail });
}

export function normalizeDashboardMode(
  value: unknown,
  options?: { warn?: boolean; source?: string }
): DashboardMode {
  if (isDashboardMode(value)) {
    return value.trim().toLowerCase() as DashboardMode;
  }
  if (options?.warn !== false) {
    warnDashboardRuntimeBrake("Invalid mode.", {
      mode: value ?? null,
      source: options?.source ?? "normalizeDashboardMode",
      fallback: DEFAULT_DASHBOARD_MODE,
    });
  }
  return DEFAULT_DASHBOARD_MODE;
}

export function resolveDashboardRuntimeState(input: {
  dashboardMode?: unknown;
}): DashboardRuntimeState {
  return Object.freeze({
    mode: normalizeDashboardMode(input.dashboardMode ?? DEFAULT_DASHBOARD_MODE, { warn: false }),
    owner: CANONICAL_DASHBOARD_MODE_OWNER,
    defaultMode: DEFAULT_DASHBOARD_MODE,
  });
}

export function resolveDashboardModeRoute(
  request: DashboardModeRouteRequest
): DashboardModeRouteResult {
  const requested = request.requestedMode;
  const mode = normalizeDashboardMode(requested ?? DEFAULT_DASHBOARD_MODE, {
    source: request.source,
  });
  const redirected = requested != null && !isDashboardMode(requested);
  const reason = redirected
    ? "invalid_mode_fallback_overview"
    : request.reason ?? `dashboard_mode_route:${request.source}`;

  if (process.env.NODE_ENV !== "production") {
    const key = `${request.source}:${String(requested)}->${mode}:${reason}`;
    if (!loggedRoutes.has(key)) {
      loggedRoutes.add(key);
      if (redirected) {
        warnDashboardRuntimeBrake("Unknown route.", {
          requestedMode: requested ?? null,
          source: request.source,
          resolvedMode: mode,
        });
      } else {
        globalThis.console?.debug?.("[DashboardRuntime][Route]", {
          source: request.source,
          mode,
          reason,
        });
      }
    }
  }

  return Object.freeze({ mode, redirected, reason });
}

export function dashboardModeLabel(mode: DashboardMode): string {
  switch (mode) {
    case "overview":
      return "Overview";
    case "focus":
      return "Focus";
    case "analyze":
      return "Analyze";
    case "compare":
      return "Compare";
    case "scenario":
      return "Scenario";
    case "war_room":
      return "War Room";
    case "risk":
      return "Risk";
    case "timeline":
      return "Timeline";
    case "advisory":
      return "Advisory";
    case "governance":
      return "Governance";
    default:
      return "Overview";
  }
}

export function resetDashboardModeRuntimeContractForTests(): void {
  loggedBrakes.clear();
  loggedRoutes.clear();
}
