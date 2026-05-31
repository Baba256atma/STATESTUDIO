/** E2:44 — Executive scene density + strategic workspace scaling contracts. */

export type SceneDensityTier = "sparse" | "moderate" | "dense" | "critical";

export type ExecutiveCameraProfile = "overview" | "balanced" | "tactical" | "compact";

export type ExecutiveObjectScaleProfileId = "FOCUSED" | "BALANCED" | "STRATEGIC" | "SYSTEM";

export type StrategicLayoutMode = "GRID" | "CLUSTER" | "NETWORK" | "ORGANIZATION" | "SUPPLY_CHAIN";

export type AdaptiveSceneLabelMode = "FULL" | "CONDENSED" | "MINIMAL" | "HIDDEN";

export type CameraStabilityTrigger =
  | "object_created"
  | "object_moved"
  | "selection"
  | "fit_scene"
  | "auto_frame"
  | "focus_object";

export type ExecutiveSceneDensityInput = {
  objectCount: number;
  relationshipCount?: number;
  boundsSize?: [number, number, number] | null;
  viewportWidth?: number;
  viewportHeight?: number;
  layoutPreset?: string | null;
};

export type ExecutiveSceneDensitySnapshot = {
  objectCount: number;
  sceneDensity: SceneDensityTier;
  recommendedScale: number;
  recommendedSpacing: number;
  cameraProfile: ExecutiveCameraProfile;
  densityScore: number;
};

export type ExecutiveFocusWorkspaceInput = {
  objectId: string;
  selectedObjectId?: string | null;
  focusedObjectId?: string | null;
  relatedObjectIds?: string[];
  dependencyObjectIds?: string[];
};

export type ExecutiveFocusWorkspaceState = {
  active: boolean;
  emphasis: number;
  opacity: number;
  scaleMultiplier: number;
  labelModeOverride?: AdaptiveSceneLabelMode;
};

export type WorkspaceScaleMetricsSnapshot = {
  totalObjects: number;
  visibleObjects: number;
  relationships: number;
  densityScore: number;
  layoutHealth: number;
  timestamp: number;
};
