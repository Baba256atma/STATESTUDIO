/**
 * NEX-4:1 — Exactly ten immutable declarative Foundation rules.
 */

export const UserJourneyExperienceFoundationRules = Object.freeze([
  Object.freeze({ id: "NEX-4:1/Rule/JourneyStages", requirement: "Every Journey contains one or more Stages.", category: "Completeness", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Rule/StageTouchpoints", requirement: "Every Stage contains one or more Touchpoints.", category: "Completeness", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Rule/PersonaJourney", requirement: "Every Persona has one primary Journey.", category: "Relationship", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Rule/ExperienceStage", requirement: "Every Experience is associated with one Journey Stage.", category: "Relationship", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Rule/OnboardingEntry", requirement: "Every Onboarding flow has a defined entry point.", category: "Completeness", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Rule/WorkspaceExperience", requirement: "Every Workspace entry belongs to one Experience.", category: "Relationship", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Rule/ExplicitBoundary", requirement: "Every Experience Boundary shall be explicitly defined.", category: "Boundary", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Rule/UniqueSuccessCriterion", requirement: "Every Experience Success Criterion shall be uniquely identified.", category: "Uniqueness", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Rule/ImmutableMetadata", requirement: "Foundation metadata shall remain immutable.", category: "Integrity", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Rule/ImplementationIndependent", requirement: "Foundation shall remain implementation independent.", category: "Architecture", executesRule: false, metadataOnly: true, immutable: true }),
] as const);
