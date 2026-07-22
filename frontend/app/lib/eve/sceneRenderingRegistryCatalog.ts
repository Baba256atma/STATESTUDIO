import { SceneRenderingFoundation } from "./sceneRenderingFoundation.ts";
import { SceneRenderingExtensionPointTypeRegistry } from "./sceneRenderingRegistryExtensions.ts";
import type {
  SceneRenderingRegistryCategory,
  SceneRenderingRegistryEntry,
} from "./sceneRenderingRegistryTypes.ts";

const contract = (name: string) => SceneRenderingFoundation.contracts.find(
  (item) => item.name === name,
)!;

const entries = (
  category: string,
  foundationContractName: string,
  names: readonly string[],
): readonly SceneRenderingRegistryEntry[] => {
  const foundationContract = contract(foundationContractName);
  return Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-2:2/${category}/${name}`,
    key: name,
    displayName: name,
    description: `Canonical Scene Rendering ${category} classification for ${name}.`,
    category,
    foundationContractReference: foundationContract.id,
    ownershipReference: SceneRenderingFoundation.ownership.id,
    boundaryReference: SceneRenderingFoundation.boundaries.id,
    lifecycleApplicability: SceneRenderingFoundation.lifecycle.states,
    capabilityApplicability: Object.freeze(
      SceneRenderingFoundation.capabilities.map(({ id }) => id),
    ),
    stability: "Stable",
    version: "1.0.0",
    extensionClassification: null,
    deprecated: false,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));
};

export const SceneTypeRegistry = entries("SceneType", "SceneIdentity", ["VisualScene", "ReferenceScene", "CompositeScene"]);
export const SceneReferenceTypeRegistry = entries("SceneReferenceType", "SceneReference", ["Canonical", "External", "Derived"]);
export const RenderContextTypeRegistry = entries("RenderContextType", "RenderContext", ["Primary", "Secondary", "Abstract"]);
export const RenderPassTypeRegistry = entries("RenderPassType", "RenderPass", ["Preparation", "Content", "Overlay", "Output"]);
export const RenderStageTypeRegistry = entries("RenderStageType", "RenderStage", ["Initial", "Intermediate", "Final"]);
export const RenderLayerTypeRegistry = entries("RenderLayerType", "RenderLayer", ["Background", "Content", "Context", "Overlay"]);
export const RenderTargetTypeRegistry = entries("RenderTargetType", "RenderTarget", ["Primary", "Secondary", "Output"]);
export const RenderSurfaceTypeRegistry = entries("RenderSurfaceType", "RenderSurface", ["Primary", "Secondary", "Abstract"]);
export const FrameDescriptorTypeRegistry = entries("FrameDescriptorType", "FrameDescriptor", ["Static", "Composite", "Output"]);
export const CompositionTypeRegistry = entries("CompositionType", "SceneCompositionContract", ["Layered", "Grouped", "Referenced"]);
export const OutputDescriptorTypeRegistry = entries("OutputDescriptorType", "OutputDescriptor", ["Display", "Export", "Reference"]);
export const RenderingProfileTypeRegistry = entries("RenderingProfileType", "RenderingProfile", ["Standard", "Quality", "Compatibility"]);
export const RenderingPolicyTypeRegistry = entries("RenderingPolicyType", "RenderingPolicy", ["Deterministic", "Immutable", "BoundarySafe"]);
export const RenderingCapabilityTypeRegistry = entries("RenderingCapabilityType", "RenderingCapability", ["Scene", "Layer", "Surface", "Output"]);

const registryCategorySeed = entries("RegistryCategoryType", "FoundationMetadata", ["FoundationContractCategory"]);

const collectionByContract = Object.freeze({
  SceneIdentity: SceneTypeRegistry,
  SceneReference: SceneReferenceTypeRegistry,
  RenderContext: RenderContextTypeRegistry,
  RenderPass: RenderPassTypeRegistry,
  RenderStage: RenderStageTypeRegistry,
  RenderLayer: RenderLayerTypeRegistry,
  RenderTarget: RenderTargetTypeRegistry,
  RenderSurface: RenderSurfaceTypeRegistry,
  FrameDescriptor: FrameDescriptorTypeRegistry,
  SceneCompositionContract: CompositionTypeRegistry,
  OutputDescriptor: OutputDescriptorTypeRegistry,
  RenderingProfile: RenderingProfileTypeRegistry,
  RenderingPolicy: RenderingPolicyTypeRegistry,
  RenderingCapability: RenderingCapabilityTypeRegistry,
  ExtensionPoint: SceneRenderingExtensionPointTypeRegistry,
  FoundationMetadata: registryCategorySeed,
} as const);

export const SceneRenderingRegistryCategories: readonly SceneRenderingRegistryCategory[] =
  Object.freeze(SceneRenderingFoundation.contracts.map((item, index) => Object.freeze({
    id: `EVE-2:2/Category/${item.name}`,
    canonicalName: item.name,
    description: `Foundation-derived Registry category for ${item.name}.`,
    foundationReference: item.id,
    ownershipReference: SceneRenderingFoundation.ownership.id,
    deterministicOrder: index + 1,
    entryCollection: collectionByContract[item.name],
    metadataOnly: true,
    immutable: true,
  })));

export const SceneRenderingRegistryCatalog = Object.freeze({
  sceneTypes: SceneTypeRegistry,
  sceneReferenceTypes: SceneReferenceTypeRegistry,
  renderContextTypes: RenderContextTypeRegistry,
  renderPassTypes: RenderPassTypeRegistry,
  renderStageTypes: RenderStageTypeRegistry,
  renderLayerTypes: RenderLayerTypeRegistry,
  renderTargetTypes: RenderTargetTypeRegistry,
  renderSurfaceTypes: RenderSurfaceTypeRegistry,
  frameDescriptorTypes: FrameDescriptorTypeRegistry,
  compositionTypes: CompositionTypeRegistry,
  outputDescriptorTypes: OutputDescriptorTypeRegistry,
  renderingProfileTypes: RenderingProfileTypeRegistry,
  renderingPolicyTypes: RenderingPolicyTypeRegistry,
  renderingCapabilityTypes: RenderingCapabilityTypeRegistry,
  extensionPointTypes: SceneRenderingExtensionPointTypeRegistry,
  registryCategoryTypes: SceneRenderingRegistryCategories,
  metadataOnly: true,
  immutable: true,
} as const);

