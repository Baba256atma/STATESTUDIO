import type {
  VisualizationContractDeclaration,
  VisualizationContractName,
} from "./visualizationFoundationTypes.ts";

const seeds: readonly [VisualizationContractName, readonly string[]][] = Object.freeze([
  ["VisualizationIdentity", ["id", "name", "version", "namespace"]],
  ["VisualObject", ["id", "visualType", "sceneReference", "sourceReference"]],
  ["SceneReference", ["id", "directorSceneReference", "immutable"]],
  ["Viewport", ["id", "viewportType", "boundsMetadata"]],
  ["CameraContract", ["id", "cameraType", "targetReference", "projectionMetadata"]],
  ["LayerContract", ["id", "layerType", "order", "visualObjectReferences"]],
  ["RenderingTarget", ["id", "targetType", "surfaceReference"]],
  ["RenderingSurface", ["id", "surfaceType", "capabilityReferences"]],
  ["RenderingMode", ["id", "modeType", "policyReferences"]],
  ["VisualState", ["id", "stateType", "visualObjectReference", "runtimeState"]],
  ["InteractionState", ["id", "stateType", "targetReference", "interactionRuntime"]],
  ["RenderingCapability", ["id", "name", "description", "implementationProvided"]],
  ["RenderingPolicy", ["id", "name", "description", "enforcement"]],
  ["ExtensionPoint", ["id", "name", "extensionType", "implementationProvided"]],
]);

export const VisualizationContracts: readonly VisualizationContractDeclaration[] =
  Object.freeze(seeds.map(([name, fields], index) => Object.freeze({
    id: `EVE-1:1/Contract/${name}`,
    name,
    description: `Canonical immutable EVE contract for ${name}.`,
    fields: Object.freeze([...fields]),
    deterministicOrder: index + 1,
    runtimeBehavior: "None",
    metadataOnly: true,
    immutable: true,
  })));

export const VisualizationContractNames = Object.freeze(
  VisualizationContracts.map(({ name }) => name),
);

