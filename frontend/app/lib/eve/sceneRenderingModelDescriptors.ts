import { SceneRenderingRegistry } from "./sceneRenderingRegistry.ts";
import type { SceneRenderingModelDescriptor } from "./sceneRenderingModelTypes.ts";

type CatalogCollection = readonly {
  readonly id: `EVE-2:2/${string}/${string}`;
  readonly ownershipReference: "EVE-2:1/SceneRenderingOwnership";
  readonly boundaryReference: "EVE-2:1/SceneRenderingBoundaries";
  readonly lifecycleApplicability: readonly string[];
  readonly capabilityApplicability: readonly string[];
  readonly extensionClassification: string | null;
}[];

const categories = SceneRenderingRegistry.catalog.registryCategoryTypes;
const seeds: readonly [string, CatalogCollection, string, readonly string[]][] = Object.freeze([
  ["Scene", SceneRenderingRegistry.catalog.sceneTypes, "SceneIdentity", ["id", "sceneType", "sceneReferenceRef", "hierarchyRef", "renderContextRef", "frameDescriptorRef", "compositionDescriptorRef"]],
  ["SceneReference", SceneRenderingRegistry.catalog.sceneReferenceTypes, "SceneReference", ["id", "referenceType", "visualizationReference"]],
  ["SceneHierarchy", SceneRenderingRegistry.catalog.sceneReferenceTypes, "SceneReference", ["id", "parentSceneRef", "childSceneRefs", "layerRefs"]],
  ["RenderContext", SceneRenderingRegistry.catalog.renderContextTypes, "RenderContext", ["id", "contextType", "renderPassRefs"]],
  ["RenderPass", SceneRenderingRegistry.catalog.renderPassTypes, "RenderPass", ["id", "passType", "stageRef", "order"]],
  ["RenderStage", SceneRenderingRegistry.catalog.renderStageTypes, "RenderStage", ["id", "stageType", "layerRefs"]],
  ["RenderLayer", SceneRenderingRegistry.catalog.renderLayerTypes, "RenderLayer", ["id", "layerType", "surfaceRef", "order"]],
  ["RenderTarget", SceneRenderingRegistry.catalog.renderTargetTypes, "RenderTarget", ["id", "targetType", "outputDescriptorRef"]],
  ["RenderSurface", SceneRenderingRegistry.catalog.renderSurfaceTypes, "RenderSurface", ["id", "surfaceType", "targetRef"]],
  ["FrameDescriptor", SceneRenderingRegistry.catalog.frameDescriptorTypes, "FrameDescriptor", ["id", "frameType", "sceneRef", "frameGeneration"]],
  ["CompositionDescriptor", SceneRenderingRegistry.catalog.compositionTypes, "SceneCompositionContract", ["id", "compositionType", "sceneRef", "executionProvided"]],
  ["OutputDescriptor", SceneRenderingRegistry.catalog.outputDescriptorTypes, "OutputDescriptor", ["id", "outputType", "targetRef"]],
  ["RenderingProfile", SceneRenderingRegistry.catalog.renderingProfileTypes, "RenderingProfile", ["id", "profileType", "capabilityRefs"]],
  ["RenderingCapability", SceneRenderingRegistry.catalog.renderingCapabilityTypes, "RenderingCapability", ["id", "capabilityType", "implementationProvided"]],
  ["ExtensionDescriptor", SceneRenderingRegistry.catalog.extensionPointTypes, "ExtensionPoint", ["id", "extensionType", "sceneRef", "implementationProvided"]],
  ["ModelIdentity", SceneRenderingRegistry.catalog.registryCategoryTypes[0]!.entryCollection, "FoundationMetadata", ["id", "modelRef", "canonicalName"]],
  ["ModelMetadata", SceneRenderingRegistry.catalog.sceneTypes, "FoundationMetadata", ["id", "modelRef", "fieldNames"]],
  ["ModelVersion", SceneRenderingRegistry.catalog.sceneTypes, "FoundationMetadata", ["id", "modelRef", "modelVersion"]],
]);

export const SceneRenderingModelDescriptors: readonly SceneRenderingModelDescriptor[] =
  Object.freeze(seeds.map(([canonicalName, collection, categoryName, fields], index) => {
    const registryEntry = collection[0]!;
    const category = categories.find(({ canonicalName: name }) => name === categoryName)!;
    return Object.freeze({
      id: `EVE-2:3/Model/${canonicalName}`,
      canonicalName,
      registryReference: registryEntry.id,
      categoryReference: category.id,
      ownershipReference: registryEntry.ownershipReference,
      boundaryReference: registryEntry.boundaryReference,
      lifecycleApplicability: registryEntry.lifecycleApplicability,
      capabilityApplicability: registryEntry.capabilityApplicability,
      stability: "Stable",
      version: "1.0.0",
      extensionClassification: registryEntry.extensionClassification,
      fields: Object.freeze([...fields]),
      deterministicOrder: index + 1,
      metadataOnly: true,
      immutable: true,
    });
  }));
