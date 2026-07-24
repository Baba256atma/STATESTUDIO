/**
 * NEX-2:1 — Metadata-only Foundation public API Registry.
 */

export const ProductRoadmapFoundationPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-2:1/PublicFoundationExport/Id", exportName: "ProductRoadmapFoundationId", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:1/PublicFoundationExport/Name", exportName: "ProductRoadmapFoundationName", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:1/PublicFoundationExport/Namespace", exportName: "ProductRoadmapFoundationNamespace", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:1/PublicFoundationExport/Version", exportName: "ProductRoadmapFoundationVersion", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:1/PublicFoundationExport/Status", exportName: "ProductRoadmapFoundationStatus", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:1/PublicFoundationExport/Readiness", exportName: "ProductRoadmapFoundationReadiness", artifact: "Readiness", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:1/PublicFoundationExport/PublicApiRegistry", exportName: "ProductRoadmapFoundationPublicApiRegistry", artifact: "PublicApiRegistry", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:1/PublicFoundationExport/Foundation", exportName: "ProductRoadmapFoundation", artifact: "Aggregate", executableApi: false, metadataOnly: true }),
] as const);
