import type { MainRightPanelTab } from "./mainRightPanelStateContract";
import type { DashboardMode } from "../dashboard/dashboardModeRuntimeContract";
import { EXECUTIVE_WORKSPACE_ZONE_IDS } from "./executiveWorkspaceLayout";
import {
  shouldShowExecutiveObjectPanelDock,
  shouldShowExecutiveRightAssistantPanel,
} from "./executiveWorkspacePresentation";
import { NEXORA_RIGHT_PANEL_PORTAL_HOST_ID } from "./right-panel/rightPanelRouter";

export const VISIBLE_MRP_RIGHT_RAIL_HOST_ID = EXECUTIVE_WORKSPACE_ZONE_IDS.visibleMrpHost;

/** Type-C clean mode: MRP must mount in visible right dock, not headless ObjectPanelShell. */
export function shouldUseVisibleMrpRightRailHost(): boolean {
  return shouldShowExecutiveRightAssistantPanel() && !shouldShowExecutiveObjectPanelDock();
}

export function resolveMrpPortalHostId(): string {
  return shouldUseVisibleMrpRightRailHost()
    ? VISIBLE_MRP_RIGHT_RAIL_HOST_ID
    : NEXORA_RIGHT_PANEL_PORTAL_HOST_ID;
}

export type Mrp10VisibleHostTraceDetail = Readonly<{
  activeTab: MainRightPanelTab;
  dashboardMode: DashboardMode;
  visibleHost: string;
  rendering: string;
  hiddenObjectPanelShell?: boolean;
  dashboardHomeWidth?: number;
  dashboardHomeHeight?: number;
  executiveAssistantShellHidden?: boolean;
}>;

declare global {
  interface Window {
    __MRP10_VISIBLE_HOST_TRACE__?: Mrp10VisibleHostTraceDetail[];
  }
}

export function traceMrp10VisibleHost(detail: Mrp10VisibleHostTraceDetail): void {
  if (process.env.NODE_ENV === "production") return;

  const lines = [
    `[MRP10VisibleHost] activeTab=${detail.activeTab}`,
    `dashboardMode=${detail.dashboardMode}`,
    `visibleHost=${detail.visibleHost}`,
    `rendering=${detail.rendering}`,
    detail.hiddenObjectPanelShell != null
      ? `hiddenObjectPanelShell=${String(detail.hiddenObjectPanelShell)}`
      : null,
    detail.dashboardHomeWidth != null && detail.dashboardHomeHeight != null
      ? `dashboardHomeBox width=${detail.dashboardHomeWidth} height=${detail.dashboardHomeHeight}`
      : null,
    detail.executiveAssistantShellHidden != null
      ? `executiveAssistantShell hidden when dashboard active=${String(detail.executiveAssistantShellHidden)}`
      : null,
  ].filter(Boolean);

  globalThis.console?.log?.(lines.join("\n"));

  if (typeof window !== "undefined") {
    window.__MRP10_VISIBLE_HOST_TRACE__ = window.__MRP10_VISIBLE_HOST_TRACE__ ?? [];
    window.__MRP10_VISIBLE_HOST_TRACE__.push(detail);
  }
}

export function measureDashboardHomeBoundingBox(): { width: number; height: number } | null {
  if (typeof document === "undefined") return null;
  const el = document.querySelector('[data-nx="executive-dashboard-home-surface"]');
  if (!(el instanceof HTMLElement)) return null;
  const rect = el.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

export function applyVisibleMrpRightRailPresentation(input: {
  activeTab: MainRightPanelTab;
  dashboardMode: DashboardMode;
}): void {
  if (typeof document === "undefined") return;
  if (!shouldUseVisibleMrpRightRailHost()) return;

  const isDashboard = input.activeTab === "dashboard";
  const rendering = isDashboard
    ? input.dashboardMode === "overview"
      ? "ExecutiveDashboardHomeSurface"
      : "DedicatedDashboardModeHeader"
    : "ExecutiveAssistantPanelStack";

  const objectPanelShell = document.querySelector('[data-nx="object-panel-shell"]');
  const hiddenObjectPanelShell =
    objectPanelShell instanceof HTMLElement &&
    (objectPanelShell.getAttribute("data-nx-state") === "headless" ||
      Number(getComputedStyle(objectPanelShell).opacity) === 0);

  const homeBox = isDashboard ? measureDashboardHomeBoundingBox() : null;

  traceMrp10VisibleHost({
    activeTab: input.activeTab,
    dashboardMode: input.dashboardMode,
    visibleHost: "right-rail",
    rendering,
    hiddenObjectPanelShell,
    dashboardHomeWidth: homeBox?.width,
    dashboardHomeHeight: homeBox?.height,
    executiveAssistantShellHidden: isDashboard,
  });
}
