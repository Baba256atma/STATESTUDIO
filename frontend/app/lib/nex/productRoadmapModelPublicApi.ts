/**
 * NEX-2:3 — Metadata-only Model public API Registry.
 */

export const ProductRoadmapModelPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-2:3/PublicModelExport/Id", exportName: "ProductRoadmapModelId", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:3/PublicModelExport/Name", exportName: "ProductRoadmapModelName", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:3/PublicModelExport/Namespace", exportName: "ProductRoadmapModelNamespace", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:3/PublicModelExport/Version", exportName: "ProductRoadmapModelVersion", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:3/PublicModelExport/Status", exportName: "ProductRoadmapModelStatus", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:3/PublicModelExport/Readiness", exportName: "ProductRoadmapModelReadiness", artifact: "Readiness", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:3/PublicModelExport/PublicApiRegistry", exportName: "ProductRoadmapModelPublicApiRegistry", artifact: "PublicApiRegistry", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:3/PublicModelExport/Model", exportName: "ProductRoadmapModel", artifact: "Aggregate", executableApi: false, metadataOnly: true }),
] as const);
