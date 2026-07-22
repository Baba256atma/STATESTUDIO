import { DirectorValidationSummary } from "./directorValidation.ts";
import { DirectorManifestCompatibility } from "./directorManifestCompatibility.ts";
import {
  DirectorManifestInventories,
  DirectorManifestInventoryTotals,
} from "./directorManifestInventory.ts";
import { DirectorManifestReadiness } from "./directorManifestReadiness.ts";

export const DirectorManifestMetadata = Object.freeze({
  manifestIdentity: Object.freeze({
    id: "DIRECTOR-1:5/DirectorManifest",
    name: "Director Manifest",
    namespace: "nexora.director.manifest",
    layer: "Director",
    status: "Manifest",
    readiness: "ReadyForPlatform",
  }),
  manifestVersion: "1.0.0",
  manifestNamespace: "nexora.director.manifest",
  inventories: DirectorManifestInventories,
  inventoryTotals: DirectorManifestInventoryTotals,
  compatibilitySummary: DirectorManifestCompatibility,
  readinessSummary: DirectorManifestReadiness,
  validationSummary: DirectorValidationSummary,
  dependency: Object.freeze({
    validationOnly: true,
    validationReference: DirectorValidationSummary.id,
    directPreviousPhaseModule: "directorValidation.ts",
    directFoundationImport: false,
    directRegistryImport: false,
    directModelImport: false,
    importsFutureDirectorPhases: false,
    importsEve: false,
  }),
  canonicalInventoryRule: Object.freeze({
    derivedOnly: true,
    reconstructsInventories: false,
    duplicatesMetadata: false,
    hardcodesInventoryTotals: false,
    manuallyCountsUpstreamObjects: false,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

