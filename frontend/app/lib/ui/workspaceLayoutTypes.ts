import type { ExecutiveWorkspaceBreakpoint } from "./executiveWorkspaceLayout";

/** E2:18 — Canonical executive workspace layout presets. */
export type WorkspaceLayoutPreset = "executive" | "analysis" | "simulation";

export type PanelSizeMode = "compact" | "normal" | "expanded";

export type WorkspaceLayoutSettings = {
  preset: WorkspaceLayoutPreset;
};

export type WorkspacePanelId =
  | "sceneInfoHud"
  | "objectInfoHud"
  | "timelineHud"
  | "quickActionsDock"
  | "executiveStatusHud"
  | "aiAssistant"
  | "scenarioSuggestions"
  | "scenarioComparison"
  | "commandBar";

export type WorkspaceHudAnchor =
  | "top-left"
  | "top-right"
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "object-anchor";

export type WorkspaceHudPlacement = {
  visible: boolean;
  anchor: WorkspaceHudAnchor;
  top?: number;
  left?: number | string;
  right?: number;
  bottom?: number;
  transform?: string;
  maxWidth?: string;
  zIndex: number;
  sizeMode: PanelSizeMode;
};

export type WorkspaceRightRailStack = {
  assistantFlex: number;
  scenarioFlex: number;
  comparisonFlex: number;
  assistantMaxHeight?: string;
  scenarioMaxHeight?: string;
};

export type WorkspaceLayoutContract = {
  preset: WorkspaceLayoutPreset;
  breakpoint: ExecutiveWorkspaceBreakpoint;
  panelSizeMode: PanelSizeMode;
  transitionMs: number;
  rightRailWidthPx: number;
  scenePaddingPx: number;
  timelineExpanded: boolean;
  sceneFocus: "balanced" | "analysis" | "simulation";
  rightRailStack: WorkspaceRightRailStack;
  hud: Record<
    "sceneInfoHud" | "objectInfoHud" | "timelineHud" | "quickActionsDock" | "executiveStatusHud",
    WorkspaceHudPlacement
  >;
};

export const WORKSPACE_LAYOUT_PRESET_LABELS: Record<WorkspaceLayoutPreset, string> = {
  executive: "Executive",
  analysis: "Analysis",
  simulation: "Simulation",
};

export function isWorkspaceLayoutPreset(value: unknown): value is WorkspaceLayoutPreset {
  return value === "executive" || value === "analysis" || value === "simulation";
}

// E2:20 Executive Workspace Profiles
// E3 Scene Object Catalog Workspace
// D8 Strategic Memory Personalization
// D10 Production Workspace Management
