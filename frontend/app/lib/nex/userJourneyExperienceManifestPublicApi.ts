/**
 * NEX-4:5 — Validation-derived metadata-only Manifest API Registry.
 */

import { UserJourneyExperienceValidation } from "./userJourneyExperienceValidation.ts";

export const UserJourneyExperienceManifestPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-4:5/PublicManifestExport/01/Id", order: 1, exportName: "UserJourneyExperienceManifestId", artifact: "Identity", sourceValidationId: UserJourneyExperienceValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/PublicManifestExport/02/Name", order: 2, exportName: "UserJourneyExperienceManifestName", artifact: "Identity", sourceValidationId: UserJourneyExperienceValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/PublicManifestExport/03/Namespace", order: 3, exportName: "UserJourneyExperienceManifestNamespace", artifact: "Identity", sourceValidationId: UserJourneyExperienceValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/PublicManifestExport/04/Version", order: 4, exportName: "UserJourneyExperienceManifestVersion", artifact: "Identity", sourceValidationId: UserJourneyExperienceValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/PublicManifestExport/05/Status", order: 5, exportName: "UserJourneyExperienceManifestStatus", artifact: "Identity", sourceValidationId: UserJourneyExperienceValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/PublicManifestExport/06/Readiness", order: 6, exportName: "UserJourneyExperienceManifestReadiness", artifact: "Readiness", sourceValidationId: UserJourneyExperienceValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/PublicManifestExport/07/PublicApiRegistry", order: 7, exportName: "UserJourneyExperienceManifestPublicApiRegistry", artifact: "PublicApiRegistry", sourceValidationId: UserJourneyExperienceValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/PublicManifestExport/08/Manifest", order: 8, exportName: "UserJourneyExperienceManifest", artifact: "Aggregate", sourceValidationId: UserJourneyExperienceValidation.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
] as const);
