/** EVE-1:1 immutable visualization contract shapes. Metadata only. */

export type VisualizationLifecycleState =
  | "Declared"
  | "Contracted"
  | "Boundaried"
  | "CapabilityDefined"
  | "ReadyForRegistry";

export type VisualizationContractName =
  | "VisualizationIdentity"
  | "VisualObject"
  | "SceneReference"
  | "Viewport"
  | "CameraContract"
  | "LayerContract"
  | "RenderingTarget"
  | "RenderingSurface"
  | "RenderingMode"
  | "VisualState"
  | "InteractionState"
  | "RenderingCapability"
  | "RenderingPolicy"
  | "ExtensionPoint";

export interface VisualizationIdentity {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly namespace: string;
}

export interface VisualObject {
  readonly id: string;
  readonly visualType: string;
  readonly sceneReference: string;
  readonly sourceReference: string;
}

export interface SceneReference {
  readonly id: string;
  readonly directorSceneReference: string;
  readonly immutable: true;
}

export interface Viewport {
  readonly id: string;
  readonly viewportType: string;
  readonly boundsMetadata: string;
}

export interface CameraContract {
  readonly id: string;
  readonly cameraType: string;
  readonly targetReference: string;
  readonly projectionMetadata: string;
}

export interface LayerContract {
  readonly id: string;
  readonly layerType: string;
  readonly order: number;
  readonly visualObjectReferences: readonly string[];
}

export interface RenderingTarget {
  readonly id: string;
  readonly targetType: string;
  readonly surfaceReference: string;
}

export interface RenderingSurface {
  readonly id: string;
  readonly surfaceType: string;
  readonly capabilityReferences: readonly string[];
}

export interface RenderingMode {
  readonly id: string;
  readonly modeType: string;
  readonly policyReferences: readonly string[];
}

export interface VisualState {
  readonly id: string;
  readonly stateType: string;
  readonly visualObjectReference: string;
  readonly runtimeState: false;
}

export interface InteractionState {
  readonly id: string;
  readonly stateType: string;
  readonly targetReference: string;
  readonly interactionRuntime: false;
}

export interface RenderingCapability {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly implementationProvided: false;
}

export interface RenderingPolicy {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly enforcement: "DescriptiveOnly";
}

export interface ExtensionPoint {
  readonly id: string;
  readonly name: string;
  readonly extensionType: string;
  readonly implementationProvided: false;
}

export interface VisualizationContractDeclaration {
  readonly id: `EVE-1:1/Contract/${VisualizationContractName}`;
  readonly name: VisualizationContractName;
  readonly description: string;
  readonly fields: readonly string[];
  readonly deterministicOrder: number;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
}

