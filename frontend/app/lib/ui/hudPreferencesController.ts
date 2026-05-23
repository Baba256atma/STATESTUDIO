import type { ExecutiveWorkspaceBreakpoint } from "./executiveWorkspaceLayout";
import { getHudPanelDefinitionOrThrow } from "./hudPanelRegistry";
import type {
  HudDockPosition,
  HudPanelId,
  HudPreferences,
  HudSizeMode,
} from "./hudPreferencesTypes";
import type {
  WorkspaceHudPlacement,
  WorkspaceLayoutContract,
  WorkspaceRightRailStack,
} from "./workspaceLayoutTypes";

type SceneHudKey = keyof WorkspaceLayoutContract["hud"];

const SCENE_HUD_KEYS: SceneHudKey[] = [
  "sceneInfoHud",
  "objectInfoHud",
  "timelineHud",
  "quickActionsDock",
  "executiveStatusHud",
];

export function isHudPanelVisible(preferences: HudPreferences, panelId: HudPanelId): boolean {
  return (preferences.visibility[panelId] ?? getHudPanelDefinitionOrThrow(panelId).defaultVisibility) === "visible";
}

export function resolveHudPanelSize(
  preferences: HudPreferences,
  panelId: HudPanelId,
  layoutDefault: HudSizeMode
): HudSizeMode {
  return preferences.size[panelId] ?? layoutDefault;
}

export function resolveHudPanelDock(
  preferences: HudPreferences,
  panelId: HudPanelId,
  layoutDefault?: HudDockPosition
): HudDockPosition {
  return preferences.dock[panelId] ?? layoutDefault ?? getHudPanelDefinitionOrThrow(panelId).defaultDock;
}

function edgeInset(breakpoint: ExecutiveWorkspaceBreakpoint): number {
  return breakpoint === "mobile" ? 8 : 12;
}

function applyDockToScenePlacement(
  panelId: SceneHudKey,
  placement: WorkspaceHudPlacement,
  dock: HudDockPosition,
  breakpoint: ExecutiveWorkspaceBreakpoint,
  timelineDock: HudDockPosition
): WorkspaceHudPlacement {
  const inset = edgeInset(breakpoint);
  const next: WorkspaceHudPlacement = {
    ...placement,
    top: undefined,
    left: undefined,
    right: undefined,
    bottom: undefined,
    transform: undefined,
  };

  if (panelId === "timelineHud") {
    if (dock === "top") {
      next.anchor = "top-left";
      next.top = inset;
      next.left = "50%";
      next.transform = "translateX(-50%)";
    } else {
      next.anchor = "bottom-center";
      next.bottom = inset;
      next.left = "50%";
      next.transform = "translateX(-50%)";
    }
    return next;
  }

  if (panelId === "quickActionsDock") {
    const stackAboveTimeline = timelineDock === "bottom";
    if (dock === "top") {
      next.anchor = "top-left";
      next.top = inset + 44;
      next.left = "50%";
      next.transform = "translateX(-50%)";
    } else {
      next.anchor = "bottom-center";
      next.bottom = stackAboveTimeline ? (breakpoint === "mobile" ? 118 : 132) : inset;
      next.left = "50%";
      next.transform = "translateX(-50%)";
    }
    return next;
  }

  if (panelId === "sceneInfoHud") {
    if (dock === "top") {
      next.anchor = "top-left";
      next.top = inset;
      next.left = "50%";
      next.transform = "translateX(-50%)";
    } else {
      next.anchor = "top-left";
      next.top = inset;
      next.left = inset;
    }
    return next;
  }

  if (panelId === "objectInfoHud") {
    if (dock === "left") {
      next.anchor = "top-left";
      next.top = inset + 168;
      next.left = inset;
    } else if (dock === "top") {
      next.anchor = "top-left";
      next.top = inset;
      next.right = inset;
      next.left = undefined;
    } else if (dock === "bottom") {
      next.anchor = "bottom-left";
      next.bottom = inset;
      next.left = inset;
    } else {
      next.anchor = "bottom-right";
      next.bottom = inset;
      next.right = inset;
    }
    return next;
  }

  if (panelId === "executiveStatusHud") {
    if (dock === "left") {
      next.anchor = "top-left";
      next.top = inset;
      next.left = inset;
    } else if (dock === "top") {
      next.anchor = "top-left";
      next.top = inset;
      next.left = "50%";
      next.transform = "translateX(-50%)";
      next.right = undefined;
    } else {
      next.anchor = "top-right";
      next.top = inset;
      next.right = inset;
    }
    return next;
  }

  return placement;
}

function scaleRightRailStack(stack: WorkspaceRightRailStack, panelId: HudPanelId, size: HudSizeMode): WorkspaceRightRailStack {
  const factor = size === "expanded" ? 1.12 : size === "compact" ? 0.88 : 1;
  if (panelId === "aiAssistant") {
    return { ...stack, assistantFlex: stack.assistantFlex * factor };
  }
  if (panelId === "scenarioSuggestions") {
    return { ...stack, scenarioFlex: stack.scenarioFlex * factor };
  }
  if (panelId === "scenarioComparison") {
    return { ...stack, comparisonFlex: stack.comparisonFlex * factor };
  }
  return stack;
}

/** Merge E2:19 HUD preferences into the E2:18 layout contract (user overrides win when set). */
export function applyHudPreferencesToLayoutContract(
  base: WorkspaceLayoutContract,
  preferences: HudPreferences
): WorkspaceLayoutContract {
  const timelineDock = resolveHudPanelDock(preferences, "timelineHud", "bottom");
  const hud = { ...base.hud };

  for (const key of SCENE_HUD_KEYS) {
    const layoutPlacement = base.hud[key];
    const dock = resolveHudPanelDock(preferences, key);
    const sizeMode = resolveHudPanelSize(preferences, key, layoutPlacement.sizeMode);
    const visible = isHudPanelVisible(preferences, key) && layoutPlacement.visible;

    hud[key] = applyDockToScenePlacement(key, layoutPlacement, dock, base.breakpoint, timelineDock);
    hud[key] = {
      ...hud[key],
      visible,
      sizeMode,
    };
  }

  let rightRailStack = base.rightRailStack;
  rightRailStack = scaleRightRailStack(rightRailStack, "aiAssistant", resolveHudPanelSize(preferences, "aiAssistant", "normal"));
  rightRailStack = scaleRightRailStack(
    rightRailStack,
    "scenarioSuggestions",
    resolveHudPanelSize(preferences, "scenarioSuggestions", "normal")
  );
  rightRailStack = scaleRightRailStack(
    rightRailStack,
    "scenarioComparison",
    resolveHudPanelSize(preferences, "scenarioComparison", "normal")
  );

  const timelineExpanded =
    resolveHudPanelSize(preferences, "timelineHud", base.hud.timelineHud.sizeMode) === "expanded" || base.timelineExpanded;

  return {
    ...base,
    hud,
    rightRailStack,
    timelineExpanded,
  };
}

export function resolveAssistantRailSide(preferences: HudPreferences): "left" | "right" {
  const dock = resolveHudPanelDock(preferences, "aiAssistant", "right");
  return dock === "left" ? "left" : "right";
}
