/**
 * EXS-1.5 — Executive Cockpit Shell public surface.
 */

export { ExecutiveCockpitShell } from "./ExecutiveCockpitShell";
export type { ExecutiveCockpitShellProps } from "./ExecutiveCockpitShell";
export { ExecutiveContextBar } from "./ExecutiveContextBar";
export { ExecutiveLeftNav } from "./ExecutiveLeftNav";
export { ExecutiveExplorerDrawer } from "./ExecutiveExplorerDrawer";
export { ExecutiveStageFrame } from "./ExecutiveStageFrame";
export { ExecutiveModeSelector } from "./ExecutiveModeSelector";
export { ExecutiveAdvisorPanel } from "./ExecutiveAdvisorPanel";
export type { ExecutiveAdvisorContent } from "./ExecutiveAdvisorPanel";
export { ExecutiveResizablePanel } from "./ExecutiveResizablePanel";
export { ExecutiveTimelineDock } from "./ExecutiveTimelineDock";
export type { ExecutiveTimelinePack } from "./ExecutiveTimelineDock";
export { ExecutiveStatusBar } from "./ExecutiveStatusBar";
export { ExecutiveFloatingPanel } from "./ExecutiveFloatingPanel";
export { ExecutiveEmptyState } from "./ExecutiveEmptyState";
export {
  cockpit,
  directorLanguage,
  elevation,
  motion,
  radius,
  typeScale,
} from "./executiveCockpitTheme";
export {
  EXECUTIVE_MODES,
  EXECUTIVE_NAV_ITEMS,
  EXECUTIVE_TIMELINE_LENSES,
  explorerTitle,
  navToExplorer,
} from "./executiveCockpitTypes";
export type {
  ExecutiveAdvisorTab,
  ExecutiveContextSnapshot,
  ExecutiveExplorerKind,
  ExecutiveFloatingPanelKind,
  ExecutiveModeId,
  ExecutiveNavId,
  ExecutiveThemeMode,
  ExecutiveTimelineLens,
} from "./executiveCockpitTypes";
