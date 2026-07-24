/**
 * NEX-2:6 — Manifest-derived metadata-only Platform public API Registry.
 */

import { ProductRoadmapManifest } from "./productRoadmapManifest.ts";

export const ProductRoadmapPlatformPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-2:6/PublicPlatformExport/01/Id", order: 1, exportName: "ProductRoadmapPlatformId", artifact: "Identity", sourceManifestId: ProductRoadmapManifest.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:6/PublicPlatformExport/02/Name", order: 2, exportName: "ProductRoadmapPlatformName", artifact: "Identity", sourceManifestId: ProductRoadmapManifest.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:6/PublicPlatformExport/03/Namespace", order: 3, exportName: "ProductRoadmapPlatformNamespace", artifact: "Identity", sourceManifestId: ProductRoadmapManifest.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:6/PublicPlatformExport/04/Version", order: 4, exportName: "ProductRoadmapPlatformVersion", artifact: "Identity", sourceManifestId: ProductRoadmapManifest.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:6/PublicPlatformExport/05/Status", order: 5, exportName: "ProductRoadmapPlatformStatus", artifact: "Identity", sourceManifestId: ProductRoadmapManifest.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:6/PublicPlatformExport/06/Readiness", order: 6, exportName: "ProductRoadmapPlatformReadiness", artifact: "Readiness", sourceManifestId: ProductRoadmapManifest.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:6/PublicPlatformExport/07/PublicApiRegistry", order: 7, exportName: "ProductRoadmapPlatformPublicApiRegistry", artifact: "PublicApiRegistry", sourceManifestId: ProductRoadmapManifest.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:6/PublicPlatformExport/08/Platform", order: 8, exportName: "ProductRoadmapPlatform", artifact: "Aggregate", sourceManifestId: ProductRoadmapManifest.identity.id, executableApi: false, metadataOnly: true }),
] as const);
