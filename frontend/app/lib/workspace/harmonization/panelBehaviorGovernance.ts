import type { SceneHudThemeSurfaceId } from "../../theme/sceneThemeTokens";
import type { GovernedPanelId } from "../panelGovernanceRuntime";
import { logExecutivePanelGovernance } from "./executiveHarmonizationInstrumentation";

export type ExecutivePanelBehaviorAction =
  | "collapse"
  | "expand"
  | "dock"
  | "pin"
  | "hide"
  | "show"
  | "focus";

export type ExecutivePanelBehaviorContract = {
  panelId: GovernedPanelId | SceneHudThemeSurfaceId;
  supportsCollapse: boolean;
  supportsPin: boolean;
  supportsDock: boolean;
  defaultCollapsed: boolean;
  focusStealsSelection: boolean;
  collapseMode: "compact" | "hidden" | "minimized";
  expandMode: "normal" | "expanded" | "full";
};

const PANEL_BEHAVIOR: Record<string, ExecutivePanelBehaviorContract> = {
  sceneInfoHud: {
    panelId: "sceneInfoHud",
    supportsCollapse: true,
    supportsPin: true,
    supportsDock: true,
    defaultCollapsed: false,
    focusStealsSelection: false,
    collapseMode: "compact",
    expandMode: "normal",
  },
  objectInfoHud: {
    panelId: "objectInfoHud",
    supportsCollapse: true,
    supportsPin: true,
    supportsDock: true,
    defaultCollapsed: false,
    focusStealsSelection: true,
    collapseMode: "compact",
    expandMode: "normal",
  },
  timelineHud: {
    panelId: "timelineHud",
    supportsCollapse: true,
    supportsPin: false,
    supportsDock: true,
    defaultCollapsed: false,
    focusStealsSelection: false,
    collapseMode: "compact",
    expandMode: "expanded",
  },
  quickActionsDock: {
    panelId: "quickActionsDock",
    supportsCollapse: true,
    supportsPin: false,
    supportsDock: true,
    defaultCollapsed: false,
    focusStealsSelection: false,
    collapseMode: "minimized",
    expandMode: "normal",
  },
  executiveStatusHud: {
    panelId: "executiveStatusHud",
    supportsCollapse: true,
    supportsPin: false,
    supportsDock: true,
    defaultCollapsed: false,
    focusStealsSelection: false,
    collapseMode: "compact",
    expandMode: "normal",
  },
  commandBar: {
    panelId: "commandBar",
    supportsCollapse: false,
    supportsPin: true,
    supportsDock: true,
    defaultCollapsed: false,
    focusStealsSelection: false,
    collapseMode: "hidden",
    expandMode: "normal",
  },
  aiAssistant: {
    panelId: "aiAssistant",
    supportsCollapse: true,
    supportsPin: true,
    supportsDock: true,
    defaultCollapsed: false,
    focusStealsSelection: false,
    collapseMode: "compact",
    expandMode: "expanded",
  },
  scenarioSuggestions: {
    panelId: "scenarioSuggestions",
    supportsCollapse: true,
    supportsPin: false,
    supportsDock: true,
    defaultCollapsed: false,
    focusStealsSelection: false,
    collapseMode: "compact",
    expandMode: "normal",
  },
  scenarioComparison: {
    panelId: "scenarioComparison",
    supportsCollapse: true,
    supportsPin: false,
    supportsDock: true,
    defaultCollapsed: false,
    focusStealsSelection: false,
    collapseMode: "compact",
    expandMode: "expanded",
  },
};

/** E2:49 Part 4 — predictable panel behavior across the executive workspace. */
export function resolvePanelBehaviorContract(
  panelId: GovernedPanelId | SceneHudThemeSurfaceId
): ExecutivePanelBehaviorContract {
  const contract = PANEL_BEHAVIOR[panelId] ?? {
    panelId,
    supportsCollapse: true,
    supportsPin: false,
    supportsDock: true,
    defaultCollapsed: false,
    focusStealsSelection: false,
    collapseMode: "compact",
    expandMode: "normal",
  };
  logExecutivePanelGovernance("contract", contract);
  return contract;
}

export function canPerformPanelBehavior(
  panelId: GovernedPanelId | SceneHudThemeSurfaceId,
  action: ExecutivePanelBehaviorAction
): boolean {
  const contract = resolvePanelBehaviorContract(panelId);
  if (action === "collapse" || action === "expand") return contract.supportsCollapse;
  if (action === "pin") return contract.supportsPin;
  if (action === "dock") return contract.supportsDock;
  return true;
}

export function resolvePanelBehaviorLabel(action: ExecutivePanelBehaviorAction): string {
  const labels: Record<ExecutivePanelBehaviorAction, string> = {
    collapse: "Collapse panel",
    expand: "Expand panel",
    dock: "Dock panel",
    pin: "Pin panel",
    hide: "Hide panel",
    show: "Show panel",
    focus: "Focus panel",
  };
  return labels[action];
}
