import { auditedResolve } from "../../audit/auditedResolve";
import type { SceneHudDepthLayer, SceneHudDepthSnapshot } from "./sceneNativeHudVisualTypes";
import { logSceneHudDepth } from "./sceneNativeHudVisualInstrumentation";

const DEPTH_LAYERS: Record<
  SceneHudDepthLayer,
  Omit<SceneHudDepthSnapshot, "layer">
> = {
  BACKGROUND: { zIndex: 2, elevation: 0, opacityMultiplier: 0.72 },
  SCENE: { zIndex: 4, elevation: 1, opacityMultiplier: 0.82 },
  HUD: { zIndex: 6, elevation: 2, opacityMultiplier: 0.9 },
  FOCUS_HUD: { zIndex: 8, elevation: 3, opacityMultiplier: 0.96 },
  MODAL: { zIndex: 12, elevation: 4, opacityMultiplier: 1 },
};

const SURFACE_DEPTH: Partial<Record<string, SceneHudDepthLayer>> = {
  sceneInfoHud: "HUD",
  objectInfoHud: "HUD",
  timelineHud: "HUD",
  executiveStatusHud: "FOCUS_HUD",
  quickActionsDock: "HUD",
  sceneNavigationToolbar: "SCENE",
  commandBar: "FOCUS_HUD",
};

export function resolveSceneHudDepth(
  surface: string,
  focused = false
): SceneHudDepthSnapshot {
  return auditedResolve({
    auditName: "HudDepth",
    inputs: { surface, focused },
    compute: () => {
      const baseLayer = SURFACE_DEPTH[surface] ?? "HUD";
      const layer: SceneHudDepthLayer = focused ? "FOCUS_HUD" : baseLayer;
      return { layer, ...DEPTH_LAYERS[layer] };
    },
    formatLogPayload: (snapshot) => ({ surface, focused, ...snapshot }),
    log: logSceneHudDepth,
  });
}
