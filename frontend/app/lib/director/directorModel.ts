import { DirectorRegistry } from "./directorRegistry.ts";
import { DirectorCameraModels } from "./directorCameraModels.ts";
import { DirectorModelRelationships } from "./directorRelationships.ts";
import { DirectorSceneModels } from "./directorSceneModels.ts";
import { DirectorTimelineModels } from "./directorTimelineModels.ts";
import { DirectorVisualizationModels } from "./directorVisualizationModels.ts";

export const DirectorModelId = "DIRECTOR-1:3/DirectorModel" as const;
export const DirectorModelVersion = "1.0.0" as const;
export const DirectorModelName = "Director Model" as const;
export const DirectorModelNamespace = "nexora.director.model" as const;
export const DirectorModelLayer = "Director" as const;
export const DirectorModelStatus = "Model" as const;
export const DirectorModelReadiness = "ReadyForValidation" as const;

export const DirectorModel = Object.freeze({
  identity: Object.freeze({
    id: DirectorModelId, version: DirectorModelVersion, name: DirectorModelName,
    namespace: DirectorModelNamespace, layer: DirectorModelLayer,
    status: DirectorModelStatus, readiness: DirectorModelReadiness,
  }),
  dependency: Object.freeze({
    registryOnly: true,
    registryId: DirectorRegistry.identity.id,
    directPreviousPhaseModule: "directorRegistry.ts",
    importsEve: false,
    importsFutureDirectorPhases: false,
  }),
  registry: DirectorRegistry,
  definitions: Object.freeze([
    ...DirectorSceneModels,
    ...DirectorCameraModels,
    ...DirectorVisualizationModels,
    ...DirectorTimelineModels,
  ]),
  relationships: DirectorModelRelationships,
  producesFor: Object.freeze(["Director Validation", "Manifest", "Platform", "Certification"] as const),
  services: false, factories: false, orchestrationEngine: false,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);
