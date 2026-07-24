/**
 * NEX-3:3 — Metadata-only Model public API Registry.
 */

export const FeaturesModulesModelPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-3:3/PublicModelExport/Id", exportName: "FeaturesModulesModelId", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/PublicModelExport/Name", exportName: "FeaturesModulesModelName", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/PublicModelExport/Namespace", exportName: "FeaturesModulesModelNamespace", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/PublicModelExport/Version", exportName: "FeaturesModulesModelVersion", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/PublicModelExport/Status", exportName: "FeaturesModulesModelStatus", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/PublicModelExport/Readiness", exportName: "FeaturesModulesModelReadiness", artifact: "Readiness", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/PublicModelExport/PublicApiRegistry", exportName: "FeaturesModulesModelPublicApiRegistry", artifact: "PublicApiRegistry", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/PublicModelExport/Model", exportName: "FeaturesModulesModel", artifact: "Aggregate", executableApi: false, metadataOnly: true, immutable: true }),
] as const);
