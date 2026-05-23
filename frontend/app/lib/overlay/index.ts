export type {
  OverlayActivationReason,
  OverlayEdge,
  OverlayLayerPriority,
  OverlayRuntimeVisibility,
  OverlayVisibilityKey,
  RegisteredOverlayDefinition,
  SceneOverlay,
  SceneOverlayType,
} from "./overlayContracts";

export {
  DEFAULT_OVERLAY_VISIBILITY,
  OVERLAY_LAYER_PRIORITY,
} from "./overlayContracts";

export {
  getRegisteredOverlayDefinition,
  getRegisteredOverlayDefinitions,
  resetOverlayRegistryForTests,
} from "./overlayRegistry";

export {
  getActiveSceneOverlays,
  getOverlayRuntimeServerVisibility,
  getOverlayRuntimeVisibility,
  hydrateOverlayVisibilityFromStorage,
  isOverlayTypeVisible,
  registerSceneOverlay,
  removeSceneOverlay,
  resetOverlayRuntimeForTests,
  setOverlayTypeVisibility,
  subscribeOverlayRuntime,
  syncSceneOverlays,
} from "./overlayRuntime";

export { resolveOverlayThemeTokens } from "./overlayTheme";
export type { OverlayThemeTokens } from "./overlayTheme";

export {
  decisionPathOverlayToEdges,
  mergePropagationOverlayState,
  propagationOverlayToEdges,
} from "./mergePropagationOverlay";

export {
  resolveDependencySceneOverlay,
  resolvePropagationSceneOverlay,
  resolveRiskFlowSceneOverlay,
  resolveScenarioSceneOverlay,
  resolveSceneOverlays,
} from "./resolveSceneOverlays";

export { useSceneOverlayRuntime } from "./useSceneOverlayRuntime";
export type { SceneOverlayRuntimeState, UseSceneOverlayRuntimeParams } from "./useSceneOverlayRuntime";

export {
  logOverlayActivated,
  logOverlayRegistered,
  logOverlayRemoved,
  logOverlayVisibilityChanged,
  logPropagationOverlayRendered,
  logRiskFlowOverlayRendered,
  logScenarioOverlayRendered,
  resetOverlayInstrumentationForTests,
} from "./overlayInstrumentation";
