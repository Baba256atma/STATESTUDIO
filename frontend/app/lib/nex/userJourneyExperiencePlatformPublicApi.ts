/**
 * NEX-4:6 — Manifest-derived metadata-only Platform API Registry.
 */

import { UserJourneyExperienceManifest } from "./userJourneyExperienceManifest.ts";

export const UserJourneyExperiencePlatformPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-4:6/PublicPlatformExport/01/Id", order: 1, exportName: "UserJourneyExperiencePlatformId", artifact: "Identity", sourceManifestId: UserJourneyExperienceManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/PublicPlatformExport/02/Name", order: 2, exportName: "UserJourneyExperiencePlatformName", artifact: "Identity", sourceManifestId: UserJourneyExperienceManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/PublicPlatformExport/03/Namespace", order: 3, exportName: "UserJourneyExperiencePlatformNamespace", artifact: "Identity", sourceManifestId: UserJourneyExperienceManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/PublicPlatformExport/04/Version", order: 4, exportName: "UserJourneyExperiencePlatformVersion", artifact: "Identity", sourceManifestId: UserJourneyExperienceManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/PublicPlatformExport/05/Status", order: 5, exportName: "UserJourneyExperiencePlatformStatus", artifact: "Identity", sourceManifestId: UserJourneyExperienceManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/PublicPlatformExport/06/Readiness", order: 6, exportName: "UserJourneyExperiencePlatformReadiness", artifact: "Readiness", sourceManifestId: UserJourneyExperienceManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/PublicPlatformExport/07/PublicApiRegistry", order: 7, exportName: "UserJourneyExperiencePlatformPublicApiRegistry", artifact: "PublicApiRegistry", sourceManifestId: UserJourneyExperienceManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/PublicPlatformExport/08/Platform", order: 8, exportName: "UserJourneyExperiencePlatform", artifact: "Aggregate", sourceManifestId: UserJourneyExperienceManifest.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
] as const);
