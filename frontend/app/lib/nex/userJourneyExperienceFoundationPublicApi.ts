/**
 * NEX-4:1 — Metadata-only Foundation public API Registry.
 */

export const UserJourneyExperienceFoundationPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-4:1/PublicFoundationExport/01/Id", order: 1, exportName: "UserJourneyExperienceFoundationId", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/PublicFoundationExport/02/Name", order: 2, exportName: "UserJourneyExperienceFoundationName", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/PublicFoundationExport/03/Namespace", order: 3, exportName: "UserJourneyExperienceFoundationNamespace", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/PublicFoundationExport/04/Version", order: 4, exportName: "UserJourneyExperienceFoundationVersion", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/PublicFoundationExport/05/Status", order: 5, exportName: "UserJourneyExperienceFoundationStatus", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/PublicFoundationExport/06/Readiness", order: 6, exportName: "UserJourneyExperienceFoundationReadiness", artifact: "Readiness", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/PublicFoundationExport/07/PublicApiRegistry", order: 7, exportName: "UserJourneyExperienceFoundationPublicApiRegistry", artifact: "PublicApiRegistry", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/PublicFoundationExport/08/Foundation", order: 8, exportName: "UserJourneyExperienceFoundation", artifact: "Aggregate", executableApi: false, metadataOnly: true, immutable: true }),
] as const);
