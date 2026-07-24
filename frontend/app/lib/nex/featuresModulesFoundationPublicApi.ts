/**
 * NEX-3:1 — Deterministic metadata-only Foundation public API Registry.
 */

export const FeaturesModulesFoundationPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-3:1/PublicFoundationExport/01/Id", order: 1, exportName: "FeaturesModulesFoundationId", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-3:1/PublicFoundationExport/02/Name", order: 2, exportName: "FeaturesModulesFoundationName", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-3:1/PublicFoundationExport/03/Namespace", order: 3, exportName: "FeaturesModulesFoundationNamespace", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-3:1/PublicFoundationExport/04/Version", order: 4, exportName: "FeaturesModulesFoundationVersion", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-3:1/PublicFoundationExport/05/Status", order: 5, exportName: "FeaturesModulesFoundationStatus", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-3:1/PublicFoundationExport/06/Readiness", order: 6, exportName: "FeaturesModulesFoundationReadiness", artifact: "Readiness", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-3:1/PublicFoundationExport/07/PublicApiRegistry", order: 7, exportName: "FeaturesModulesFoundationPublicApiRegistry", artifact: "PublicApiRegistry", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-3:1/PublicFoundationExport/08/Foundation", order: 8, exportName: "FeaturesModulesFoundation", artifact: "Aggregate", executableApi: false, metadataOnly: true }),
] as const);
