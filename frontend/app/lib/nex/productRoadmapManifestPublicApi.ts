/**
 * NEX-2:5 — Metadata-only Manifest public API Registry.
 */

import { ProductRoadmapValidation } from "./productRoadmapValidation.ts";

export const ProductRoadmapManifestPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-2:5/PublicManifestExport/01/Id", order: 1, exportName: "ProductRoadmapManifestId", artifact: "Identity", sourceValidationId: ProductRoadmapValidation.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:5/PublicManifestExport/02/Name", order: 2, exportName: "ProductRoadmapManifestName", artifact: "Identity", sourceValidationId: ProductRoadmapValidation.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:5/PublicManifestExport/03/Namespace", order: 3, exportName: "ProductRoadmapManifestNamespace", artifact: "Identity", sourceValidationId: ProductRoadmapValidation.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:5/PublicManifestExport/04/Version", order: 4, exportName: "ProductRoadmapManifestVersion", artifact: "Identity", sourceValidationId: ProductRoadmapValidation.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:5/PublicManifestExport/05/Status", order: 5, exportName: "ProductRoadmapManifestStatus", artifact: "Identity", sourceValidationId: ProductRoadmapValidation.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:5/PublicManifestExport/06/Readiness", order: 6, exportName: "ProductRoadmapManifestReadiness", artifact: "Readiness", sourceValidationId: ProductRoadmapValidation.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:5/PublicManifestExport/07/PublicApiRegistry", order: 7, exportName: "ProductRoadmapManifestPublicApiRegistry", artifact: "PublicApiRegistry", sourceValidationId: ProductRoadmapValidation.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:5/PublicManifestExport/08/Manifest", order: 8, exportName: "ProductRoadmapManifest", artifact: "Aggregate", sourceValidationId: ProductRoadmapValidation.identity.id, executableApi: false, metadataOnly: true }),
] as const);
