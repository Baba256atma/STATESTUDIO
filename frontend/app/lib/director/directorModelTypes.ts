import type { DirectorRegistry } from "./directorRegistry.ts";

export type SceneType = (typeof DirectorRegistry.scenes.sceneTypes)[number]["name"];
export type SceneObjectType = (typeof DirectorRegistry.scenes.sceneObjectTypes)[number]["name"];
export type SceneLayerType = (typeof DirectorRegistry.scenes.sceneLayerTypes)[number]["name"];
export type SceneMarkerType = (typeof DirectorRegistry.scenes.sceneMarkerTypes)[number]["name"];
export type CameraFocusType = (typeof DirectorRegistry.cameras.focusTypes)[number]["name"];
export type CameraTargetType = (typeof DirectorRegistry.cameras.targetTypes)[number]["name"];
export type TimelineType = (typeof DirectorRegistry.timelines.timelineTypes)[number]["name"];
export type TimelineScaleType = (typeof DirectorRegistry.timelines.timelineScaleTypes)[number]["name"];
export type TransitionType = (typeof DirectorRegistry.timelines.transitionTypes)[number]["name"];
export type AnimationType = (typeof DirectorRegistry.timelines.animationInstructionTypes)[number]["name"];
export type VisualizationIntentType = (typeof DirectorRegistry.visualizations.intentTypes)[number]["name"];
export type ExecutiveFocusType = (typeof DirectorRegistry.visualizations.executiveFocusTypes)[number]["name"];

export interface DirectorModelMetadata<Type extends string> {
  readonly id: string;
  readonly type: Type;
  readonly version: "1.0.0";
  readonly namespace: `nexora.director.model.${string}`;
  readonly status: "Modeled";
  readonly stability: "Stable";
}

export interface ExecutiveSceneModel extends DirectorModelMetadata<"ExecutiveScene"> {
  readonly sceneType: SceneType;
  readonly title: string;
  readonly description: string;
  readonly scenePlanRef: string;
  readonly visualizationPlanRef: string;
  readonly timelinePlanRef: string;
  readonly cameraPlanRef: string;
  readonly sceneLayerRefs: readonly string[];
  readonly sceneObjectRefs: readonly string[];
  readonly executiveFocusRef: string;
  readonly markerRefs: readonly string[];
  readonly transitionPlanRefs: readonly string[];
}

export interface ScenePlanModel extends DirectorModelMetadata<"ScenePlan"> {
  readonly orderedSteps: readonly string[];
  readonly focusTargetRefs: readonly string[];
  readonly cameraSequenceRefs: readonly string[];
  readonly timelineRefs: readonly string[];
  readonly transitionRefs: readonly string[];
  readonly visualizationPriorities: readonly string[];
}

export interface SceneObjectModel extends DirectorModelMetadata<"SceneObject"> {
  readonly objectType: SceneObjectType;
  readonly sourceReference: string;
  readonly layerRef: string;
}

export interface SceneLayerModel extends DirectorModelMetadata<"SceneLayer"> {
  readonly layerType: SceneLayerType;
  readonly order: number;
  readonly sceneObjectRefs: readonly string[];
}

export interface CameraTargetModel extends DirectorModelMetadata<"CameraTarget"> {
  readonly targetType: CameraTargetType;
  readonly targetRefs: readonly string[];
}

export interface CameraPlanModel extends DirectorModelMetadata<"CameraPlan"> {
  readonly focusType: CameraFocusType;
  readonly focusTargetRef: string;
  readonly targetRef: string;
  readonly zoomLevel: string;
  readonly orientation: string;
  readonly transitionRef: string | null;
}

export interface VisualizationPlanModel extends DirectorModelMetadata<"VisualizationPlan"> {
  readonly visualizationIntent: VisualizationIntentType;
  readonly priority: number;
  readonly emphasis: readonly string[];
  readonly highlightTargetRefs: readonly string[];
  readonly comparisonMode: boolean;
  readonly simulationMode: boolean;
}

export interface ExecutiveFocusModel extends DirectorModelMetadata<"ExecutiveFocus"> {
  readonly focusType: ExecutiveFocusType;
  readonly targetRefs: readonly string[];
  readonly priority: number;
}

export interface TimelinePlanModel extends DirectorModelMetadata<"TimelinePlan"> {
  readonly timelineType: TimelineType;
  readonly scale: TimelineScaleType;
  readonly startReference: string;
  readonly endReference: string;
  readonly playbackMode: string;
  readonly snapshotReference: string | null;
}

export interface TransitionPlanModel extends DirectorModelMetadata<"TransitionPlan"> {
  readonly transitionType: TransitionType;
  readonly sourceSceneRef: string;
  readonly destinationSceneRef: string;
  readonly durationMetadata: string;
  readonly triggerMetadata: string;
}

export interface AnimationPlanModel extends DirectorModelMetadata<"AnimationPlan"> {
  readonly animationType: AnimationType;
  readonly targetSceneObjectRefs: readonly string[];
  readonly sequenceOrder: number;
  readonly emphasisMetadata: string;
}

export interface SceneMarkerModel extends DirectorModelMetadata<"SceneMarker"> {
  readonly markerType: SceneMarkerType;
  readonly sceneRef: string;
  readonly annotation: string;
  readonly sequenceOrder: number;
}

export interface DirectorModelDefinition {
  readonly id: `DIRECTOR-1:3/Model/${string}`;
  readonly type: string;
  readonly version: "1.0.0";
  readonly namespace: `nexora.director.model.${string}`;
  readonly status: "Model";
  readonly stability: "Stable";
  readonly registryReference: string;
  readonly fields: readonly string[];
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

