/**
 * NEX-4:1 — Exactly ten immutable Foundation contracts.
 */

export const UserJourneyExperienceFoundationContracts = Object.freeze([
  Object.freeze({ id: "NEX-4:1/Contract/Journey", name: "Journey Contract", description: "Declares canonical journey metadata.", requiredMetadata: Object.freeze(["journeyId", "stages"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Contract/Experience", name: "Experience Contract", description: "Declares conceptual experience metadata.", requiredMetadata: Object.freeze(["experienceId", "journeyStage"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Contract/Persona", name: "Persona Contract", description: "Declares user persona metadata.", requiredMetadata: Object.freeze(["personaId", "primaryJourney"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Contract/Stage", name: "Stage Contract", description: "Declares journey stage metadata.", requiredMetadata: Object.freeze(["stageId", "touchpoints"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Contract/Touchpoint", name: "Touchpoint Contract", description: "Declares conceptual touchpoint metadata.", requiredMetadata: Object.freeze(["touchpointId", "stageId"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Contract/Onboarding", name: "Onboarding Contract", description: "Declares onboarding experience metadata.", requiredMetadata: Object.freeze(["onboardingId", "entryPoint"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Contract/Workspace", name: "Workspace Contract", description: "Declares workspace entry metadata.", requiredMetadata: Object.freeze(["workspaceEntryId", "experienceId"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Contract/Lifecycle", name: "Lifecycle Contract", description: "Declares experience lifecycle stages.", requiredMetadata: Object.freeze(["lifecycleId", "stages"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Contract/Boundary", name: "Boundary Contract", description: "Declares explicit experience boundaries.", requiredMetadata: Object.freeze(["boundaryId", "scope"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Contract/Governance", name: "Governance Contract", description: "Declares experience ownership and stewardship.", requiredMetadata: Object.freeze(["governanceId", "owner"]), executableContract: false, metadataOnly: true, immutable: true }),
] as const);
