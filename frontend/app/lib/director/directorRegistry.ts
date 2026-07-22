import { DirectorFoundation } from "./directorFoundation.ts";
import { DirectorCameraRegistry } from "./directorCameraRegistry.ts";
import { DirectorRegistryMetadata } from "./directorRegistryMetadata.ts";
import { DirectorSceneRegistry } from "./directorSceneRegistry.ts";
import { DirectorTimelineRegistry } from "./directorTimelineRegistry.ts";
import { DirectorVisualizationRegistry } from "./directorVisualizationRegistry.ts";
import type { DirectorRegistryDescriptor } from "./directorRegistryTypes.ts";

export const DirectorRegistryId = DirectorRegistryMetadata.id;
export const DirectorRegistryVersion = DirectorRegistryMetadata.version;
export const DirectorRegistryName = DirectorRegistryMetadata.name;
export const DirectorRegistryNamespace = DirectorRegistryMetadata.namespace;
export const DirectorRegistryLayer = DirectorRegistryMetadata.layer;
export const DirectorRegistryStatus = DirectorRegistryMetadata.status;
export const DirectorRegistryReadiness = DirectorRegistryMetadata.readiness;

/** Canonical public Director-1:2 export. Registry metadata only. */
export const DirectorRegistry = Object.freeze({
  identity: Object.freeze({
    id: DirectorRegistryId,
    version: DirectorRegistryVersion,
    name: DirectorRegistryName,
    namespace: DirectorRegistryNamespace,
    layer: DirectorRegistryLayer,
    status: DirectorRegistryStatus,
    readiness: DirectorRegistryReadiness,
  }),
  foundation: DirectorFoundation,
  scenes: DirectorSceneRegistry,
  cameras: DirectorCameraRegistry,
  timelines: DirectorTimelineRegistry,
  visualizations: DirectorVisualizationRegistry,
  metadata: DirectorRegistryMetadata,
  services: false,
  factories: false,
  execution: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DirectorRegistryDescriptor);

