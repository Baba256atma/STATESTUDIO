import { VisualizationFoundation } from "./visualizationFoundation.ts";
import type {
  VisualizationRegistryCategory,
  VisualizationRegistryEntry,
} from "./visualizationRegistryTypes.ts";

const contractId = (name: string): `EVE-1:1/Contract/${string}` => {
  const contract = VisualizationFoundation.contracts.find((item) => item.name === name);
  return (contract?.id ?? `EVE-1:1/Contract/${name}`) as `EVE-1:1/Contract/${string}`;
};

const entries = (
  category: string,
  foundationContract: string,
  names: readonly string[],
): readonly VisualizationRegistryEntry[] => Object.freeze(names.map((name, index) =>
  Object.freeze({
    id: `EVE-1:2/${category}/${name}`,
    name,
    description: `Canonical EVE ${category} classification for ${name}.`,
    category,
    version: "1.0.0",
    namespace: `nexora.eve.registry.${category.toLowerCase()}`,
    stability: "Stable",
    foundationContractId: contractId(foundationContract),
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

export const VisualObjectTypeRegistry = entries("VisualObjectType", "VisualObject", [
  "Primitive", "Composite", "Reference", "Annotation",
]);
export const SceneTypeRegistry = entries("SceneType", "SceneReference", [
  "DirectorScene", "PresentationScene", "AnalyticalScene", "CustomScene",
]);
export const RenderingTargetRegistry = entries("RenderingTarget", "RenderingTarget", [
  "ViewportTarget", "SurfaceTarget", "ExportTarget",
]);
export const RenderingSurfaceRegistry = entries("RenderingSurface", "RenderingSurface", [
  "PrimarySurface", "SecondarySurface", "OffscreenSurface",
]);
export const ViewportTypeRegistry = entries("ViewportType", "Viewport", [
  "Primary", "Secondary", "Inset", "FullFrame",
]);
export const CameraTypeRegistry = entries("CameraType", "CameraContract", [
  "Perspective", "Orthographic", "Abstract",
]);
export const LayerTypeRegistry = entries("LayerType", "LayerContract", [
  "Background", "Content", "Context", "Overlay", "Annotation",
]);
export const VisualStateTypeRegistry = entries("VisualStateType", "VisualState", [
  "Default", "Emphasized", "Muted", "Hidden",
]);
export const InteractionStateTypeRegistry = entries("InteractionStateType", "InteractionState", [
  "Passive", "Available", "Selected", "Disabled",
]);
export const RenderingModeRegistry = entries("RenderingMode", "RenderingMode", [
  "Standard", "Comparison", "Focus", "Presentation",
]);
export const CapabilityTypeRegistry = entries("CapabilityType", "RenderingCapability", [
  "Representation", "Composition", "Projection", "Extension",
]);

export const VisualizationRegistryCategories: readonly VisualizationRegistryCategory[] =
  Object.freeze(VisualizationFoundation.contracts.map((contract, index) => Object.freeze({
    id: `EVE-1:2/Category/${contract.name}`,
    name: contract.name,
    foundationContractId: contract.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));

export const VisualizationRegistryCatalog = Object.freeze({
  visualObjectTypes: VisualObjectTypeRegistry,
  sceneTypes: SceneTypeRegistry,
  renderingTargets: RenderingTargetRegistry,
  renderingSurfaces: RenderingSurfaceRegistry,
  viewportTypes: ViewportTypeRegistry,
  cameraTypes: CameraTypeRegistry,
  layerTypes: LayerTypeRegistry,
  visualStateTypes: VisualStateTypeRegistry,
  interactionStateTypes: InteractionStateTypeRegistry,
  renderingModes: RenderingModeRegistry,
  capabilityTypes: CapabilityTypeRegistry,
  categories: VisualizationRegistryCategories,
  metadataOnly: true,
  immutable: true,
} as const);
