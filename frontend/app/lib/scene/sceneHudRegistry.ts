/** E2:56 — Registry of all scene HUD surfaces with zone, priority, and visibility rules. */

import type { ExecutiveHudZone } from "./executiveHudLayoutGovernance";

export type SceneHudPanelId =
  | "sceneInfoHud"
  | "executiveSceneToolbar"
  | "objectInfoHud"
  | "executiveStatusHud"
  | "timelineHud"
  | "quickActionsDock"
  | "objectInfoEmptyPlaceholder"
  | "pipelineStatusOverlay"
  | "orientationPanel"
  | "scenarioOverlay";

export type SceneHudVisibilityRule =
  | "always"
  | "when_selected"
  | "when_unselected"
  | "when_active"
  | "when_processing"
  | "dev_only"
  | "never";

export type SceneHudRegistryEntry = {
  panelId: SceneHudPanelId;
  label: string;
  zone: ExecutiveHudZone;
  priority: number;
  visibilityRule: SceneHudVisibilityRule;
  estimatedWidth: number;
  estimatedHeight: number;
  layer: number;
};

export type SceneHudVisibilityContext = {
  selectedObjectId: string | null;
  pipelineStatus: string;
  devSurfaces: boolean;
  panelVisible: boolean;
};

export const SCENE_HUD_REGISTRY: Readonly<Record<SceneHudPanelId, SceneHudRegistryEntry>> = Object.freeze({
  sceneInfoHud: {
    panelId: "sceneInfoHud",
    label: "Scene Info",
    zone: "LEFT_TOP",
    priority: 100,
    visibilityRule: "always",
    estimatedWidth: 244,
    estimatedHeight: 180,
    layer: 5,
  },
  executiveSceneToolbar: {
    panelId: "executiveSceneToolbar",
    label: "Toolbar",
    zone: "RIGHT_TOP",
    priority: 120,
    visibilityRule: "always",
    estimatedWidth: 360,
    estimatedHeight: 44,
    layer: 10,
  },
  objectInfoHud: {
    panelId: "objectInfoHud",
    label: "Object Info",
    zone: "RIGHT_TOP",
    priority: 100,
    visibilityRule: "when_selected",
    estimatedWidth: 344,
    estimatedHeight: 240,
    layer: 5,
  },
  executiveStatusHud: {
    panelId: "executiveStatusHud",
    label: "Status HUD",
    zone: "RIGHT_TOP",
    priority: 70,
    visibilityRule: "when_active",
    estimatedWidth: 280,
    estimatedHeight: 120,
    layer: 4,
  },
  timelineHud: {
    panelId: "timelineHud",
    label: "Timeline",
    zone: "BOTTOM_CENTER",
    priority: 90,
    visibilityRule: "always",
    estimatedWidth: 860,
    estimatedHeight: 96,
    layer: 4,
  },
  quickActionsDock: {
    panelId: "quickActionsDock",
    label: "Quick Actions",
    zone: "BOTTOM_CENTER",
    priority: 60,
    visibilityRule: "when_active",
    estimatedWidth: 420,
    estimatedHeight: 56,
    layer: 5,
  },
  objectInfoEmptyPlaceholder: {
    panelId: "objectInfoEmptyPlaceholder",
    label: "Object Empty State",
    zone: "RIGHT_TOP",
    priority: 20,
    visibilityRule: "when_unselected",
    estimatedWidth: 244,
    estimatedHeight: 64,
    layer: 3,
  },
  pipelineStatusOverlay: {
    panelId: "pipelineStatusOverlay",
    label: "Pipeline Status",
    zone: "LEFT_TOP",
    priority: 80,
    visibilityRule: "when_processing",
    estimatedWidth: 320,
    estimatedHeight: 120,
    layer: 6,
  },
  orientationPanel: {
    panelId: "orientationPanel",
    label: "Orientation",
    zone: "LEFT_TOP",
    priority: 50,
    visibilityRule: "dev_only",
    estimatedWidth: 320,
    estimatedHeight: 200,
    layer: 4,
  },
  scenarioOverlay: {
    panelId: "scenarioOverlay",
    label: "Scenario Visualization",
    zone: "BOTTOM_CENTER",
    priority: 30,
    visibilityRule: "when_active",
    estimatedWidth: 640,
    estimatedHeight: 120,
    layer: 2,
  },
});

export function getSceneHudRegistration(panelId: SceneHudPanelId): SceneHudRegistryEntry {
  return SCENE_HUD_REGISTRY[panelId];
}

export function resolveSceneHudVisibility(
  panelId: SceneHudPanelId,
  context: SceneHudVisibilityContext
): boolean {
  const entry = getSceneHudRegistration(panelId);
  if (!context.panelVisible && panelId !== "objectInfoEmptyPlaceholder") return false;

  switch (entry.visibilityRule) {
    case "always":
      return true;
    case "when_selected":
      return Boolean(context.selectedObjectId);
    case "when_unselected":
      return !context.selectedObjectId;
    case "when_active":
      return context.panelVisible;
    case "when_processing":
      return context.pipelineStatus === "processing" || context.pipelineStatus === "error";
    case "dev_only":
      return context.devSurfaces;
    case "never":
      return false;
    default:
      return context.panelVisible;
  }
}

export function listSceneHudPanelsForZone(zone: ExecutiveHudZone): SceneHudRegistryEntry[] {
  return Object.values(SCENE_HUD_REGISTRY).filter((entry) => entry.zone === zone);
}
