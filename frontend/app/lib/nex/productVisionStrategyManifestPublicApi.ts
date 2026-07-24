/**
 * NEX-1:5 — Metadata-only public API Registry.
 */

export const ProductVisionStrategyManifestPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-1:5/PublicManifestExport/Id", exportName: "ProductVisionStrategyManifestId", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:5/PublicManifestExport/Name", exportName: "ProductVisionStrategyManifestName", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:5/PublicManifestExport/Namespace", exportName: "ProductVisionStrategyManifestNamespace", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:5/PublicManifestExport/Version", exportName: "ProductVisionStrategyManifestVersion", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:5/PublicManifestExport/Status", exportName: "ProductVisionStrategyManifestStatus", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:5/PublicManifestExport/Readiness", exportName: "ProductVisionStrategyManifestReadiness", artifact: "Readiness", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:5/PublicManifestExport/PublicApiRegistry", exportName: "ProductVisionStrategyManifestPublicApiRegistry", artifact: "PublicApiRegistry", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:5/PublicManifestExport/Manifest", exportName: "ProductVisionStrategyManifest", artifact: "Aggregate", executableApi: false, metadataOnly: true }),
] as const);
