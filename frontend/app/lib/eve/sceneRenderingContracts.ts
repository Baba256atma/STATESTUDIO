import type {
  SceneRenderingContractDeclaration,
  SceneRenderingContractName,
} from "./sceneRenderingFoundationTypes.ts";

const seeds: readonly [SceneRenderingContractName, readonly string[]][] = Object.freeze([
  ["SceneIdentity", ["id", "type", "version", "namespace", "name"]],
  ["SceneReference", ["id", "type", "visualizationSceneReference"]],
  ["RenderContext", ["id", "type", "profileReference", "surfaceReference"]],
  ["RenderPass", ["id", "type", "stageReference", "order"]],
  ["RenderStage", ["id", "type", "passReferences"]],
  ["RenderLayer", ["id", "type", "order", "sceneReference"]],
  ["RenderTarget", ["id", "type", "surfaceReference"]],
  ["RenderSurface", ["id", "type", "targetReference"]],
  ["FrameDescriptor", ["id", "type", "sceneReference", "outputReference", "frameGeneration"]],
  ["SceneCompositionContract", ["id", "type", "layerReferences", "executionProvided"]],
  ["OutputDescriptor", ["id", "type", "outputType", "targetReference"]],
  ["RenderingProfile", ["id", "type", "capabilityReferences", "policyReferences"]],
  ["RenderingPolicy", ["id", "type", "description", "enforcement"]],
  ["RenderingCapability", ["id", "type", "description", "implementationProvided"]],
  ["ExtensionPoint", ["id", "type", "extensionType", "implementationProvided"]],
  ["FoundationMetadata", ["id", "type", "readiness", "runtimeExecution"]],
]);

export const SceneRenderingContracts: readonly SceneRenderingContractDeclaration[] =
  Object.freeze(seeds.map(([name, fields], index) => Object.freeze({
    id: `EVE-2:1/Contract/${name}`,
    name,
    description: `Canonical immutable Scene Rendering contract for ${name}.`,
    fields: Object.freeze([...fields]),
    deterministicOrder: index + 1,
    runtimeBehavior: "None",
    metadataOnly: true,
    immutable: true,
  })));

export const SceneRenderingContractNames = Object.freeze(
  SceneRenderingContracts.map(({ name }) => name),
);

