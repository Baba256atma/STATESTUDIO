import { DirectorManifestCompatibility } from "./directorManifestCompatibility.ts";
import { DirectorManifestPublicExportNames } from "./directorManifestExports.ts";
import { DirectorManifestMetadata } from "./directorManifestMetadata.ts";
import { DirectorManifestReadiness } from "./directorManifestReadiness.ts";

export const DirectorManifestId = DirectorManifestMetadata.manifestIdentity.id;
export const DirectorManifestVersion = DirectorManifestMetadata.manifestVersion;
export const DirectorManifestName = DirectorManifestMetadata.manifestIdentity.name;
export const DirectorManifestNamespace = DirectorManifestMetadata.manifestNamespace;
export const DirectorManifestLayer = DirectorManifestMetadata.manifestIdentity.layer;
export const DirectorManifestStatus = DirectorManifestMetadata.manifestIdentity.status;
export const DirectorManifestReadinessStatus = DirectorManifestMetadata.manifestIdentity.readiness;

export const DirectorManifest = Object.freeze({
  metadata: DirectorManifestMetadata,
  inventories: DirectorManifestMetadata.inventories,
  inventoryTotals: DirectorManifestMetadata.inventoryTotals,
  compatibility: DirectorManifestCompatibility,
  readiness: DirectorManifestReadiness,
  validationSummary: DirectorManifestMetadata.validationSummary,
  publicExports: DirectorManifestPublicExportNames,
  producesFor: Object.freeze([
    "Director Platform", "Director Certification", "Director Freeze",
    "Director Public Index",
  ] as const),
  services: false,
  factories: false,
  execution: false,
  orchestration: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

