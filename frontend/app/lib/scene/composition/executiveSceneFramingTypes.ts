import type { ExecutiveCameraPresetId } from "../camera/executiveCameraPresetRegistry";
import type { ExecutiveCameraBounds } from "../camera/executive2DCameraProfile";
import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import type { ExecutiveDensityCompressionResult } from "../objectScaling/executiveObjectScalingTypes";

export type ExecutiveSceneBoundsKind =
  | "object"
  | "visible"
  | "active"
  | "relationship"
  | "operational";

export type ExecutiveSceneBoundsSnapshot = {
  kind: ExecutiveSceneBoundsKind;
  min: [number, number, number];
  max: [number, number, number];
  center: [number, number, number];
  size: [number, number, number];
  span: number;
  objectCount: number;
};

export type ExecutiveLayoutPreset = "OPERATIONAL" | "STRATEGIC" | "RISK";

export type ExecutiveObjectClusterKind = "operational" | "risk" | "scenario" | "general";

export type ExecutiveObjectCluster = {
  id: string;
  objectIds: string[];
  center: [number, number, number];
  radius: number;
  kind: ExecutiveObjectClusterKind;
};

export type ExecutiveSceneFramingInput = {
  sceneJson: unknown;
  preset: ExecutiveCameraPresetId;
  mode: WorkspaceViewMode;
  viewportWidth?: number;
  viewportHeight?: number;
  focusObjectId?: string | null;
  visibleObjectIds?: string[] | null;
  activeObjectIds?: string[] | null;
};

export type ExecutiveSceneFramingResult = {
  bounds: ExecutiveCameraBounds & {
    min: [number, number, number];
    max: [number, number, number];
  };
  boundsAnalysis: {
    object: ExecutiveSceneBoundsSnapshot;
    visible: ExecutiveSceneBoundsSnapshot;
    active: ExecutiveSceneBoundsSnapshot | null;
    relationship: ExecutiveSceneBoundsSnapshot | null;
    operational: ExecutiveSceneBoundsSnapshot;
  };
  cameraRadius: number;
  adaptivePadding: number;
  layoutPreset: ExecutiveLayoutPreset;
  readabilityScore: number;
  emptySpaceRatio: number;
  emptySpaceRecoveryApplied: boolean;
  clusters: ExecutiveObjectCluster[];
  compression: ExecutiveDensityCompressionResult;
  signature: string;
};
