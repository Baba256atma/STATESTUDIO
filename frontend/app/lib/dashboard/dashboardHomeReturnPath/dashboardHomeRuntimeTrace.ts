/**
 * MRP:10:11-FIX — Dev-only runtime mount tracing for Dashboard Home path validation.
 */

export type Mrp10RuntimeTraceComponent =
  | "MainRightPanelShell mounted"
  | "DashboardRuntimePanel mounted"
  | "ExecutiveDashboardHomeSurface mounted"
  | "DedicatedDashboardModeHeader mounted"
  | "RightPanelHost legacy mounted"
  | "legacyDashboardHost mounted"
  | "legacyDashboardHost suppressed";

export type Mrp10RuntimeTraceDetail = Readonly<
  Record<string, unknown> & {
    activeTab?: string;
    dashboardMode?: string;
    dashboardContext?: string;
    selectedObjectId?: string | null;
    rendering?: string;
  }
>;

declare global {
  interface Window {
    __MRP10_RUNTIME_TRACE__?: Array<{ component: string; detail: Record<string, unknown>; ts: number }>;
  }
}

export function traceMrp10Runtime(
  component: Mrp10RuntimeTraceComponent,
  detail: Mrp10RuntimeTraceDetail = {}
): void {
  if (process.env.NODE_ENV === "production") return;

  const payload = { component, ...detail };
  globalThis.console?.log?.(`[MRP10RuntimeTrace] ${component}`, payload);

  if (typeof window !== "undefined") {
    window.__MRP10_RUNTIME_TRACE__ = window.__MRP10_RUNTIME_TRACE__ ?? [];
    window.__MRP10_RUNTIME_TRACE__.push({ component, detail: { ...detail }, ts: Date.now() });
  }
}

export function logMrp10RuntimeRenderChain(detail: Mrp10RuntimeTraceDetail): void {
  if (process.env.NODE_ENV === "production") return;
  const parts = [
    `[MRP10RuntimeTrace]`,
    detail.activeTab != null ? `activeTab=${detail.activeTab}` : null,
    detail.dashboardMode != null ? `dashboardMode=${detail.dashboardMode}` : null,
    detail.dashboardContext != null ? `dashboardContext=${detail.dashboardContext}` : null,
    detail.selectedObjectId != null ? `selectedObjectId=${detail.selectedObjectId ?? "null"}` : null,
    detail.rendering != null ? `rendering=${detail.rendering}` : null,
  ].filter(Boolean);
  globalThis.console?.log?.(parts.join("\n"));
}

/** Modern MRP dashboard modes that must not show legacy RightPanelHost accordion. */
export function shouldSuppressLegacyDashboardHost(mode: string): boolean {
  return (
    mode === "overview" ||
    mode === "focus" ||
    mode === "analyze" ||
    mode === "compare" ||
    mode === "scenario" ||
    mode === "war_room"
  );
}
