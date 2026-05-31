export type {
  AdaptiveSceneLabelMode,
  CameraStabilityTrigger,
  ExecutiveCameraProfile,
  ExecutiveFocusWorkspaceInput,
  ExecutiveFocusWorkspaceState,
  ExecutiveObjectScaleProfileId,
  ExecutiveSceneDensityInput,
  ExecutiveSceneDensitySnapshot,
  SceneDensityTier,
  StrategicLayoutMode,
  WorkspaceScaleMetricsSnapshot,
} from "./executiveDensityTypes";

export {
  logAdaptiveSceneLabelMode,
  logExecutiveCameraStability,
  logExecutiveDensityResolved,
  logExecutiveFocusWorkspace,
  logExecutiveObjectScaleApplied,
  logExecutiveSpacingResolved,
  logStrategicLayoutApplied,
  logWorkspaceScaleMetrics,
  resetExecutiveDensityInstrumentationForTests,
} from "./executiveDensityInstrumentation";

export {
  applyExecutiveObjectScaleProfile,
  DEFAULT_EXECUTIVE_SCALE_PROFILE,
  EXECUTIVE_OBJECT_SCALE_PROFILES,
  getExecutiveObjectScaleProfile,
  resolveExecutiveBaseObjectScale,
  resetExecutiveObjectScaleProfileForTests,
  setExecutiveObjectScaleProfile,
} from "./executiveObjectScaleProfile";

export {
  computeDensityScore,
  evaluateExecutiveSceneDensity,
  resolveExecutiveCameraProfile,
  resolveRecommendedScale,
  resolveRecommendedSpacing,
  resolveSceneDensityTier,
} from "./executiveSceneDensityRuntime";

export {
  evaluateCameraStability,
  getLastAutoFrameSignature,
  registerAutoFrameSignature,
  resetExecutiveCameraStabilityForTests,
} from "./executiveCameraStabilityRuntime";
export type { CameraStabilityDecision } from "./executiveCameraStabilityRuntime";

export {
  isStrategicLayoutModeSupported,
  resolveGridLayoutPosition,
  resolveNetworkLayoutPosition,
  resolvePreferredStrategicLayoutMode,
  resolveStrategicLayoutPosition,
} from "./strategicLayoutEngine";
export type { StrategicLayoutInput } from "./strategicLayoutEngine";

export {
  resolveExecutiveSpacing,
  resolveSpacedCatalogPlacementPosition,
} from "./executiveSpacingRuntime";
export type { ExecutiveSpacingSnapshot } from "./executiveSpacingRuntime";

export {
  resolveAdaptiveSceneLabelState,
  shouldRenderSceneObjectLabel,
} from "./adaptiveSceneLabelRuntime";
export type { AdaptiveSceneLabelInput, AdaptiveSceneLabelState } from "./adaptiveSceneLabelRuntime";

export { resolveExecutiveFocusWorkspaceState } from "./executiveFocusWorkspaceRuntime";

export {
  computeWorkspaceScaleMetrics,
  getLatestWorkspaceScaleMetrics,
  resetWorkspaceScaleMetricsForTests,
} from "./workspaceScaleMetricsRuntime";
