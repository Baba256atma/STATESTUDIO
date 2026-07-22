export type SceneRenderingContractName =
  | "SceneIdentity" | "SceneReference" | "RenderContext" | "RenderPass"
  | "RenderStage" | "RenderLayer" | "RenderTarget" | "RenderSurface"
  | "FrameDescriptor" | "SceneCompositionContract" | "OutputDescriptor"
  | "RenderingProfile" | "RenderingPolicy" | "RenderingCapability"
  | "ExtensionPoint" | "FoundationMetadata";

export type SceneRenderingLifecycleState =
  | "Declared" | "Contracted" | "Boundaried" | "CapabilityDefined"
  | "ReadyForRegistry";

export interface SceneRenderingMetadataBase<Type extends string> {
  readonly id: string;
  readonly type: Type;
  readonly version: string;
  readonly namespace: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SceneIdentity extends SceneRenderingMetadataBase<"SceneIdentity"> {
  readonly name: string;
}
export interface SceneReference extends SceneRenderingMetadataBase<"SceneReference"> {
  readonly visualizationSceneReference: string;
}
export interface RenderContext extends SceneRenderingMetadataBase<"RenderContext"> {
  readonly profileReference: string;
  readonly surfaceReference: string;
}
export interface RenderPass extends SceneRenderingMetadataBase<"RenderPass"> {
  readonly stageReference: string;
  readonly order: number;
}
export interface RenderStage extends SceneRenderingMetadataBase<"RenderStage"> {
  readonly passReferences: readonly string[];
}
export interface RenderLayer extends SceneRenderingMetadataBase<"RenderLayer"> {
  readonly order: number;
  readonly sceneReference: string;
}
export interface RenderTarget extends SceneRenderingMetadataBase<"RenderTarget"> {
  readonly surfaceReference: string;
}
export interface RenderSurface extends SceneRenderingMetadataBase<"RenderSurface"> {
  readonly targetReference: string;
}
export interface FrameDescriptor extends SceneRenderingMetadataBase<"FrameDescriptor"> {
  readonly sceneReference: string;
  readonly outputReference: string;
  readonly frameGeneration: false;
}
export interface SceneCompositionContract extends SceneRenderingMetadataBase<"SceneCompositionContract"> {
  readonly layerReferences: readonly string[];
  readonly executionProvided: false;
}
export interface OutputDescriptor extends SceneRenderingMetadataBase<"OutputDescriptor"> {
  readonly outputType: string;
  readonly targetReference: string;
}
export interface RenderingProfile extends SceneRenderingMetadataBase<"RenderingProfile"> {
  readonly capabilityReferences: readonly string[];
  readonly policyReferences: readonly string[];
}
export interface RenderingPolicy extends SceneRenderingMetadataBase<"RenderingPolicy"> {
  readonly description: string;
  readonly enforcement: "DescriptiveOnly";
}
export interface RenderingCapability extends SceneRenderingMetadataBase<"RenderingCapability"> {
  readonly description: string;
  readonly implementationProvided: false;
}
export interface ExtensionPoint extends SceneRenderingMetadataBase<"ExtensionPoint"> {
  readonly extensionType: string;
  readonly implementationProvided: false;
}
export interface FoundationMetadata extends SceneRenderingMetadataBase<"FoundationMetadata"> {
  readonly readiness: "ReadyForRegistry";
  readonly runtimeExecution: false;
}

export interface SceneRenderingContractDeclaration {
  readonly id: `EVE-2:1/Contract/${SceneRenderingContractName}`;
  readonly name: SceneRenderingContractName;
  readonly description: string;
  readonly fields: readonly string[];
  readonly deterministicOrder: number;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
}

