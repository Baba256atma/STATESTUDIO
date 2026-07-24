/**
 * NEX-4:3 — Metadata-only Model public API Registry.
 */

export const UserJourneyExperienceModelPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-4:3/PublicModelExport/01/Id", order: 1, exportName: "UserJourneyExperienceModelId", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/PublicModelExport/02/Name", order: 2, exportName: "UserJourneyExperienceModelName", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/PublicModelExport/03/Namespace", order: 3, exportName: "UserJourneyExperienceModelNamespace", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/PublicModelExport/04/Version", order: 4, exportName: "UserJourneyExperienceModelVersion", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/PublicModelExport/05/Status", order: 5, exportName: "UserJourneyExperienceModelStatus", artifact: "Identity", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/PublicModelExport/06/Readiness", order: 6, exportName: "UserJourneyExperienceModelReadiness", artifact: "Readiness", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/PublicModelExport/07/PublicApiRegistry", order: 7, exportName: "UserJourneyExperienceModelPublicApiRegistry", artifact: "PublicApiRegistry", executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/PublicModelExport/08/Model", order: 8, exportName: "UserJourneyExperienceModel", artifact: "Aggregate", executableApi: false, metadataOnly: true, immutable: true }),
] as const);
