export type {
  ExecutiveTransparencyMode,
  ExecutiveTransparencySnapshot,
  HudEdgeIntegrationSnapshot,
  SceneHudDepthLayer,
  SceneHudDepthSnapshot,
  SceneHudEdgeAnchor,
  SceneHudRendererContract,
  SceneHudRendererKind,
  SceneHudSpatialAlignmentSnapshot,
  SceneNativeHudDesignSnapshot,
  SceneNativeHudGlassLevel,
  SceneNativeHudGlowProfile,
  SceneNativeHudShadowProfile,
  SceneNativeHudShellInput,
  SceneNativeHudTypographyRole,
} from "./sceneNativeHudVisualTypes";

export {
  logExecutiveTransparency,
  logHudEdgeIntegration,
  logSceneHudDepth,
  logSceneHudSpatialAlignment,
  logSceneHudTypographyAudit,
  logSceneNativeHudVisualSystem,
  resetSceneNativeHudVisualInstrumentationForTests,
} from "./sceneNativeHudVisualInstrumentation";

export {
  DEFAULT_EXECUTIVE_TRANSPARENCY_MODE,
  getExecutiveTransparencyMode,
  resetExecutiveTransparencyForTests,
  resolveExecutiveTransparency,
  setExecutiveTransparencyMode,
} from "./executiveTransparencyRuntime";

export { resolveSceneHudDepth } from "./sceneHudDepthRuntime";

export {
  applyHudEdgeIntegrationStyle,
  resolveHudEdgeIntegration,
} from "./hudEdgeIntegrationRuntime";

export {
  auditSceneHudTypography,
  resolveSceneHudTypography,
} from "./sceneHudTypographyRuntime";

export {
  resolveExecutiveIconForSurface,
  resolveExecutiveIconSurface,
} from "./executiveIconSurfaceRuntime";
export type { ExecutiveIconSurfaceDescriptor, ExecutiveIconSurfaceKind } from "./executiveIconSurfaceRuntime";

export { resolveSceneHudSpatialAlignment } from "./sceneHudSpatialAlignmentRuntime";
export type { SpatialAlignmentInput } from "./sceneHudSpatialAlignmentRuntime";

export {
  resolveSceneNativeHudContextStyle,
  resolveSceneNativeHudDesign,
  resolveSceneNativeHudMetricStyle,
  resolveSceneNativeHudSectionLabel,
  resolveSceneNativeHudShell,
} from "./sceneNativeHudDesignSystem";

export {
  createSceneHudRendererContract,
  resolveSceneHudRendererBridge,
} from "./sceneHudRendererContract";
export type { SceneHudRendererBridge } from "./sceneHudRendererContract";
