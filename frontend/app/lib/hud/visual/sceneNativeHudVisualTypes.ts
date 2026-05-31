import type { SceneHudThemeSurfaceId } from "../../theme/sceneThemeTokens";
import type { NexoraHudThemeMode } from "../../scene/nexoraHudTheme";

/** E2:46 — Scene-native HUD visual integration contracts. */

export type SceneHudDepthLayer = "BACKGROUND" | "SCENE" | "HUD" | "FOCUS_HUD" | "MODAL";

export type ExecutiveTransparencyMode = "SUBTLE" | "BALANCED" | "FOCUSED";

export type SceneNativeHudGlassLevel = "instrument" | "glass" | "solid";

export type SceneNativeHudShadowProfile = "none" | "rim" | "ambient" | "elevated";

export type SceneNativeHudGlowProfile = "none" | "subtle" | "accent";

export type SceneHudEdgeAnchor =
  | "TOP_LEFT"
  | "TOP_RIGHT"
  | "BOTTOM_CENTER"
  | "BOTTOM_LEFT"
  | "BOTTOM_RIGHT"
  | "CENTER_FLOATING";

export type SceneHudRendererKind = "html" | "three" | "hybrid";

export type SceneNativeHudDesignSnapshot = {
  panelGlassLevel: SceneNativeHudGlassLevel;
  panelTransparency: number;
  panelBlur: number;
  panelBorderWeight: number;
  panelCornerRadius: number;
  panelShadowProfile: SceneNativeHudShadowProfile;
  panelGlowProfile: SceneNativeHudGlowProfile;
};

export type SceneHudDepthSnapshot = {
  layer: SceneHudDepthLayer;
  zIndex: number;
  elevation: number;
  opacityMultiplier: number;
};

export type ExecutiveTransparencySnapshot = {
  mode: ExecutiveTransparencyMode;
  surfaceOpacity: number;
  backdropOpacity: number;
  blurPx: number;
  allowSceneVisibility: boolean;
};

export type HudEdgeIntegrationSnapshot = {
  anchor: SceneHudEdgeAnchor;
  edgeInsetPx: number;
  edgeFade: boolean;
  structuralAttachment: boolean;
  safeZonePaddingPx: number;
};

export type SceneHudSpatialAlignmentSnapshot = {
  dominantAxis: "horizontal" | "vertical";
  maxWidthRatio: number;
  maxHeightRatio: number;
  preserveSceneCenter: boolean;
  alignmentBias: number;
};

export type SceneNativeHudTypographyRole =
  | "executiveHeader"
  | "sectionHeader"
  | "primaryMetric"
  | "contextText";

export type SceneNativeHudShellInput = {
  surface: SceneHudThemeSurfaceId;
  themeMode: NexoraHudThemeMode;
  depthLayer?: SceneHudDepthLayer;
  transparencyMode?: ExecutiveTransparencyMode;
  edgeAnchor?: SceneHudEdgeAnchor;
  focused?: boolean;
  collapsed?: boolean;
};

export type SceneHudRendererContract = {
  rendererKind: SceneHudRendererKind;
  surface: SceneHudThemeSurfaceId;
  depthLayer: SceneHudDepthLayer;
  supportsSpatialAlignment: boolean;
  supportsNativeThreeMesh: boolean;
};
