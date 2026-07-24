/**
 * NEX-3:5 — Metadata-only Manifest public API Registry.
 */

import { FeaturesModulesValidation } from "./featuresModulesValidation.ts";

export const FeaturesModulesManifestPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-3:5/PublicManifestExport/01/Id", order: 1, exportName: "FeaturesModulesManifestId", artifact: "Identity", sourceValidationId: FeaturesModulesValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/PublicManifestExport/02/Name", order: 2, exportName: "FeaturesModulesManifestName", artifact: "Identity", sourceValidationId: FeaturesModulesValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/PublicManifestExport/03/Namespace", order: 3, exportName: "FeaturesModulesManifestNamespace", artifact: "Identity", sourceValidationId: FeaturesModulesValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/PublicManifestExport/04/Version", order: 4, exportName: "FeaturesModulesManifestVersion", artifact: "Identity", sourceValidationId: FeaturesModulesValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/PublicManifestExport/05/Status", order: 5, exportName: "FeaturesModulesManifestStatus", artifact: "Identity", sourceValidationId: FeaturesModulesValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/PublicManifestExport/06/Readiness", order: 6, exportName: "FeaturesModulesManifestReadiness", artifact: "Readiness", sourceValidationId: FeaturesModulesValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/PublicManifestExport/07/PublicApiRegistry", order: 7, exportName: "FeaturesModulesManifestPublicApiRegistry", artifact: "PublicApiRegistry", sourceValidationId: FeaturesModulesValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/PublicManifestExport/08/Manifest", order: 8, exportName: "FeaturesModulesManifest", artifact: "Aggregate", sourceValidationId: FeaturesModulesValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
] as const);
