/**
 * NEX-3:6 — Manifest-derived metadata-only Platform public API Registry.
 */

import { FeaturesModulesManifest } from "./featuresModulesManifest.ts";

export const FeaturesModulesPlatformPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-3:6/PublicPlatformExport/01/Id", order: 1, exportName: "FeaturesModulesPlatformId", artifact: "Identity", sourceManifestId: FeaturesModulesManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/PublicPlatformExport/02/Name", order: 2, exportName: "FeaturesModulesPlatformName", artifact: "Identity", sourceManifestId: FeaturesModulesManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/PublicPlatformExport/03/Namespace", order: 3, exportName: "FeaturesModulesPlatformNamespace", artifact: "Identity", sourceManifestId: FeaturesModulesManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/PublicPlatformExport/04/Version", order: 4, exportName: "FeaturesModulesPlatformVersion", artifact: "Identity", sourceManifestId: FeaturesModulesManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/PublicPlatformExport/05/Status", order: 5, exportName: "FeaturesModulesPlatformStatus", artifact: "Identity", sourceManifestId: FeaturesModulesManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/PublicPlatformExport/06/Readiness", order: 6, exportName: "FeaturesModulesPlatformReadiness", artifact: "Readiness", sourceManifestId: FeaturesModulesManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/PublicPlatformExport/07/PublicApiRegistry", order: 7, exportName: "FeaturesModulesPlatformPublicApiRegistry", artifact: "PublicApiRegistry", sourceManifestId: FeaturesModulesManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/PublicPlatformExport/08/Platform", order: 8, exportName: "FeaturesModulesPlatform", artifact: "Aggregate", sourceManifestId: FeaturesModulesManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
] as const);
