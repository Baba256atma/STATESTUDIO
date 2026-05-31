import type { SceneHudRendererContract, SceneHudRendererKind } from "./sceneNativeHudVisualTypes";
import type { SceneHudThemeSurfaceId } from "../../theme/sceneThemeTokens";
import { resolveSceneHudDepth } from "./sceneHudDepthRuntime";

/** Future compatibility contract for HTML, Three.js, and hybrid HUD renderers. */
export function createSceneHudRendererContract(input: {
  surface: SceneHudThemeSurfaceId;
  rendererKind?: SceneHudRendererKind;
  focused?: boolean;
}): SceneHudRendererContract {
  const depth = resolveSceneHudDepth(input.surface, input.focused);
  return {
    rendererKind: input.rendererKind ?? "html",
    surface: input.surface,
    depthLayer: depth.layer,
    supportsSpatialAlignment: true,
    supportsNativeThreeMesh: input.rendererKind === "three" || input.rendererKind === "hybrid",
  };
}

export type SceneHudRendererBridge = {
  contract: SceneHudRendererContract;
  mountSelector: string;
  updateFrequencyHz: number;
};

export function resolveSceneHudRendererBridge(
  surface: SceneHudThemeSurfaceId,
  rendererKind: SceneHudRendererKind = "html"
): SceneHudRendererBridge {
  return {
    contract: createSceneHudRendererContract({ surface, rendererKind }),
    mountSelector: `[data-hud="${surface.replace(/Hud$/, "").replace(/([A-Z])/g, "-$1").toLowerCase()}"]`,
    updateFrequencyHz: rendererKind === "three" ? 30 : 0,
  };
}
