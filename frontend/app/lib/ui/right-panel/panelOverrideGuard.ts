import type { RightPanelView } from "./rightPanelTypes";

type PanelOverrideSource =
  | "event:nexora:open-right-panel"
  | "event:nexora:inspector-section-changed"
  | "effect:activeDomainExperience.preferredRightPanelTab"
  | "adapter:applyExecutionResultToUi.openRightPanel"
  | "adapter:applyExecutionResultToUi.setRightPanelTab"
  | "adapter:applyExecutionResultToUi.setActiveInspectorReportTab"
  | string;

function isDashboardView(view: RightPanelView) {
  return view === "dashboard";
}

function isExplicitDashboardSource(source: PanelOverrideSource, requestedLegacyTab: string | null) {
  if (requestedLegacyTab === "dashboard" || requestedLegacyTab === "executive_dashboard") {
    return true;
  }
  return source === "explicit:dashboard";
}

export function shouldAllowPanelOverride(
  previousView: RightPanelView,
  nextView: RightPanelView,
  source: PanelOverrideSource,
  requestedLegacyTab: string | null = null
): boolean {
  if (!previousView || previousView === nextView) return true;
  if (!nextView) return true;

  if (isDashboardView(nextView) && !isExplicitDashboardSource(source, requestedLegacyTab)) {
    return false;
  }

  return true;
}
