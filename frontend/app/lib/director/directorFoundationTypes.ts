/** Director-1:1 closed vocabularies and immutable contract shapes. */

export type DirectorLifecycleState =
  | "Declared"
  | "Validated"
  | "Prepared"
  | "Orchestrated"
  | "Delivered"
  | "Archived";

export type DirectorContractName =
  | "ExecutiveScene"
  | "ScenePlan"
  | "SceneObject"
  | "SceneLayer"
  | "CameraFocus"
  | "CameraTarget"
  | "VisualizationIntent"
  | "ExecutiveFocus"
  | "Timeline"
  | "AnimationInstruction"
  | "SceneTransition"
  | "SceneMarker";

export interface ExecutiveScene {
  readonly sceneId: string;
  readonly plan: ScenePlan;
  readonly lifecycleState: DirectorLifecycleState;
}

export interface ScenePlan {
  readonly planId: string;
  readonly intent: VisualizationIntent;
  readonly layers: readonly SceneLayer[];
  readonly cameraFocus: CameraFocus;
  readonly executiveFocus: ExecutiveFocus;
  readonly timeline: Timeline;
}

export interface SceneObject {
  readonly objectId: string;
  readonly objectType: string;
  readonly placementRef: string;
  readonly sourceRef: string;
}

export interface SceneLayer {
  readonly layerId: string;
  readonly order: number;
  readonly objects: readonly SceneObject[];
}

export interface CameraFocus {
  readonly focusId: string;
  readonly target: CameraTarget;
  readonly framing: string;
}

export interface CameraTarget {
  readonly targetId: string;
  readonly sceneObjectRef: string;
}

export interface VisualizationIntent {
  readonly intentId: string;
  readonly intentType: string;
  readonly sourceRef: string;
  readonly emphasis: readonly string[];
}

export interface ExecutiveFocus {
  readonly focusId: string;
  readonly subjectRefs: readonly string[];
  readonly priority: number;
}

export interface Timeline {
  readonly timelineId: string;
  readonly markers: readonly SceneMarker[];
  readonly transitions: readonly SceneTransition[];
  readonly animationInstructions: readonly AnimationInstruction[];
}

export interface AnimationInstruction {
  readonly instructionId: string;
  readonly targetRef: string;
  readonly animationType: string;
  readonly startMarkerRef: string;
  readonly endMarkerRef: string;
}

export interface SceneTransition {
  readonly transitionId: string;
  readonly fromMarkerRef: string;
  readonly toMarkerRef: string;
  readonly transitionType: string;
}

export interface SceneMarker {
  readonly markerId: string;
  readonly sequence: number;
  readonly label: string;
}

export interface DirectorContractDeclaration {
  readonly contractId: `DIRECTOR-1:1/Contract/${DirectorContractName}`;
  readonly contractName: DirectorContractName;
  readonly fields: readonly string[];
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeBehavior: "None";
}

