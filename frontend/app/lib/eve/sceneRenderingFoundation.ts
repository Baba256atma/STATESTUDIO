import {
  VisualizationPlatformPublicFoundation,
  VisualizationPublicIndexId,
} from "./visualizationPublicIndex.ts";
import { SceneRenderingBoundaries } from "./sceneRenderingBoundaries.ts";
import { SceneRenderingCapabilities } from "./sceneRenderingCapabilities.ts";
import {
  SceneRenderingContractNames,
  SceneRenderingContracts,
} from "./sceneRenderingContracts.ts";
import { SceneRenderingLifecycle } from "./sceneRenderingLifecycle.ts";
import { SceneRenderingOwnership } from "./sceneRenderingOwnership.ts";

export const SceneRenderingFoundationId = "EVE-2:1/SceneRenderingFoundation" as const;
export const SceneRenderingFoundationVersion = "1.0.0" as const;
export const SceneRenderingFoundationName = "Scene Rendering Foundation" as const;
export const SceneRenderingFoundationNamespace = "nexora.eve.scene-rendering.foundation" as const;
export const SceneRenderingFoundationLayer = "Visualization Engine (EVE)" as const;
export const SceneRenderingFoundationStatus = "Foundation" as const;
export const SceneRenderingFoundationReadiness = "ReadyForRegistry" as const;

export const SceneRenderingFoundation = Object.freeze({
  identity: Object.freeze({
    id: SceneRenderingFoundationId,
    version: SceneRenderingFoundationVersion,
    name: SceneRenderingFoundationName,
    namespace: SceneRenderingFoundationNamespace,
    layer: SceneRenderingFoundationLayer,
    status: SceneRenderingFoundationStatus,
    readiness: SceneRenderingFoundationReadiness,
  }),
  dependency: Object.freeze({
    visualizationPublicIndexOnly: true,
    visualizationPublicIndexId: VisualizationPublicIndexId,
    visualizationPublicSurface: VisualizationPlatformPublicFoundation,
    directDependencyModule: "visualizationPublicIndex.ts",
    directEveOnePhaseImports: false,
    otherDependencies: false,
  }),
  contracts: SceneRenderingContracts,
  contractNames: SceneRenderingContractNames,
  ownership: SceneRenderingOwnership,
  boundaries: SceneRenderingBoundaries,
  lifecycle: SceneRenderingLifecycle,
  capabilities: SceneRenderingCapabilities,
  inventory: Object.freeze({
    contractCount: SceneRenderingContracts.length,
    lifecycleStateCount: SceneRenderingLifecycle.states.length,
    capabilityCount: SceneRenderingCapabilities.length,
    countsDerivedFromCanonicalCollections: true,
  }),
  renderingPipeline: false,
  frameGeneration: false,
  gpuExecution: false,
  sceneCompositionExecution: false,
  runtimeExecution: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

