import { mapLegacyPanelRouteToDashboardContext, type DashboardContext } from "./mainRightPanelContract";
import type { RightPanelView } from "./right-panel/rightPanelTypes";

export type MainRightPanelRuntimeView = "dashboard";

export type MainRightPanelRuntimeResolution = Readonly<{
  requestedView: RightPanelView | null;
  runtimeView: MainRightPanelRuntimeView;
  redirected: boolean;
  dashboardContext: DashboardContext;
  reason: string;
}>;

const warnedLegacySurfaces = new Set<string>();
const warnedDashboardRedirects = new Set<string>();
let mrpRuntimeLogged = false;

/**
 * Phase 2:1 architecture brake.
 *
 * The Main Right Panel runtime exposes exactly one renderable right-panel
 * surface: Dashboard. Assistant is isolated outside this legacy host. All
 * former right-rail surfaces remain compatibility inputs only and must be
 * redirected before they can render, hydrate, subscribe, or own state.
 */
export function isAllowedMainRightPanelRuntimeView(view: unknown): view is MainRightPanelRuntimeView {
  return typeof view === "string" && view.trim().toLowerCase() === "dashboard";
}

export function isDeprecatedRightRailRuntimeSurface(view: unknown): boolean {
  if (view == null || view === "") return false;
  return !isAllowedMainRightPanelRuntimeView(view);
}

export function resolveMainRightPanelRuntimeView(input: {
  requestedView: RightPanelView | null | undefined;
  reason?: string | null;
}): MainRightPanelRuntimeResolution {
  const requestedView =
    typeof input.requestedView === "string" && input.requestedView.trim().length > 0
      ? (input.requestedView.trim().toLowerCase() as RightPanelView)
      : null;
  if (isAllowedMainRightPanelRuntimeView(requestedView)) {
    return {
      requestedView,
      runtimeView: "dashboard",
      redirected: false,
      dashboardContext: "overview",
      reason: input.reason ?? "mrp_runtime_allowed",
    };
  }
  return {
    requestedView,
    runtimeView: "dashboard",
    redirected: requestedView !== null,
    dashboardContext: mapLegacyPanelRouteToDashboardContext(requestedView, { warn: false }),
    reason: input.reason ?? "legacy_right_rail_surface_redirected",
  };
}

export function logMainRightPanelRuntime(detail: Record<string, unknown> = {}): void {
  if (process.env.NODE_ENV === "production") return;
  if (mrpRuntimeLogged) return;
  mrpRuntimeLogged = true;
  globalThis.console?.info?.("[Nexora][MRP]", {
    contract: "dashboard_assistant_only",
    runtimeViews: ["dashboard"],
    assistantIsolation: true,
    ...detail,
  });
}

export function warnLegacySurfaceBlocked(surface: unknown, detail: Record<string, unknown> = {}): void {
  if (!isDeprecatedRightRailRuntimeSurface(surface)) return;
  const surfaceKey = String(surface);
  const signature = JSON.stringify({ surface: surfaceKey, ...detail });
  if (warnedLegacySurfaces.has(signature)) return;
  warnedLegacySurfaces.add(signature);
  globalThis.console?.warn?.("[Nexora][LegacySurfaceBlocked]", {
    surface: surfaceKey,
    redirectedTo: "dashboard",
    ...detail,
  });
}

export function warnDashboardRedirect(from: unknown, detail: Record<string, unknown> = {}): void {
  if (!isDeprecatedRightRailRuntimeSurface(from)) return;
  const fromKey = String(from);
  const signature = JSON.stringify({ from: fromKey, ...detail });
  if (warnedDashboardRedirects.has(signature)) return;
  warnedDashboardRedirects.add(signature);
  globalThis.console?.warn?.("[Nexora][DashboardRedirect]", {
    from: fromKey,
    to: "dashboard",
    ...detail,
  });
}
