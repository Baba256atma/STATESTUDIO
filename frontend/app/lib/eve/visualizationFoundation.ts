import {
  DirectorPlatformPublicFoundation,
  DirectorPublicIndexId,
} from "../director/directorPublicIndex.ts";
import { VisualizationBoundaries } from "./visualizationBoundaries.ts";
import { VisualizationCapabilities } from "./visualizationCapabilities.ts";
import {
  VisualizationContractNames,
  VisualizationContracts,
} from "./visualizationContracts.ts";
import { VisualizationLifecycle } from "./visualizationLifecycle.ts";
import { VisualizationOwnership } from "./visualizationOwnership.ts";

export const VisualizationFoundationId = "EVE-1:1/VisualizationFoundation" as const;
export const VisualizationFoundationVersion = "1.0.0" as const;
export const VisualizationFoundationName = "Visualization Foundation" as const;
export const VisualizationFoundationNamespace = "nexora.eve.visualization.foundation" as const;
export const VisualizationFoundationLayer = "Visualization Engine (EVE)" as const;
export const VisualizationFoundationStatus = "Foundation" as const;
export const VisualizationFoundationReadiness = "ReadyForRegistry" as const;

export const VisualizationFoundation = Object.freeze({
  identity: Object.freeze({
    id: VisualizationFoundationId,
    version: VisualizationFoundationVersion,
    name: VisualizationFoundationName,
    namespace: VisualizationFoundationNamespace,
    layer: VisualizationFoundationLayer,
    status: VisualizationFoundationStatus,
    readiness: VisualizationFoundationReadiness,
  }),
  dependency: Object.freeze({
    directorPublicIndexOnly: true,
    directorPublicIndexId: DirectorPublicIndexId,
    directorPublicSurface: DirectorPlatformPublicFoundation,
    directDependencyModule: "directorPublicIndex.ts",
    otherDependencies: false,
  }),
  contracts: VisualizationContracts,
  contractNames: VisualizationContractNames,
  ownership: VisualizationOwnership,
  boundaries: VisualizationBoundaries,
  lifecycle: VisualizationLifecycle,
  capabilities: VisualizationCapabilities,
  inventory: Object.freeze({
    contractCount: VisualizationContracts.length,
    lifecycleStateCount: VisualizationLifecycle.states.length,
    capabilityCount: VisualizationCapabilities.length,
    countsDerivedFromCanonicalCollections: true,
  }),
  extensionPoints: Object.freeze(
    VisualizationContracts.filter(({ name }) => name === "ExtensionPoint"),
  ),
  services: false,
  factories: false,
  execution: false,
  rendering: false,
  orchestration: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

