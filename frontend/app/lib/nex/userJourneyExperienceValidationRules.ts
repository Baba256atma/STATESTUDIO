/**
 * NEX-4:4 — Exactly twenty declarative validation rules.
 */

import { UserJourneyExperienceModel } from "./userJourneyExperienceModel.ts";

export const UserJourneyExperienceValidationRules = Object.freeze([
  Object.freeze({ id: "NEX-4:4/Rule/VisionExists", requirement: "User Journey Vision shall exist.", category: "Completeness", modelReference: UserJourneyExperienceModel.models[0].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/PrinciplesExist", requirement: "Experience Principles shall exist.", category: "Completeness", modelReference: UserJourneyExperienceModel.models[1].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/PersonaJourney", requirement: "Every Persona belongs to one Journey.", category: "Relationship", modelReference: UserJourneyExperienceModel.models[2].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/JourneyStages", requirement: "Every Journey contains one or more Stages.", category: "Completeness", modelReference: UserJourneyExperienceModel.models[4].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/StageTouchpoints", requirement: "Every Stage contains one or more Touchpoints.", category: "Completeness", modelReference: UserJourneyExperienceModel.models[5].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/OnboardingEntry", requirement: "Every Onboarding Experience has one entry point.", category: "Completeness", modelReference: UserJourneyExperienceModel.models[6].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/UniqueWorkspaceEntry", requirement: "Every Workspace Entry is uniquely identified.", category: "Uniqueness", modelReference: UserJourneyExperienceModel.models[7].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/DataConnectionDefined", requirement: "Every Data Connection Experience is defined.", category: "Completeness", modelReference: UserJourneyExperienceModel.models[8].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/AdvisorDefined", requirement: "Every Advisor Interaction is defined.", category: "Completeness", modelReference: UserJourneyExperienceModel.models[9].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/DecisionDefined", requirement: "Every Decision Experience is defined.", category: "Completeness", modelReference: UserJourneyExperienceModel.models[10].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/TimelineDefined", requirement: "Every Timeline Experience is defined.", category: "Completeness", modelReference: UserJourneyExperienceModel.models[11].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/UniqueBoundary", requirement: "Every Experience Boundary is uniquely identified.", category: "Uniqueness", modelReference: UserJourneyExperienceModel.models[13].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/UniqueSuccessCriterion", requirement: "Every Success Criterion is uniquely identified.", category: "Uniqueness", modelReference: UserJourneyExperienceModel.models[15].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/GovernanceComplete", requirement: "Experience Governance is complete.", category: "Completeness", modelReference: UserJourneyExperienceModel.models[14].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/NoDuplicateIdentifiers", requirement: "No duplicate identifiers are permitted.", category: "Uniqueness", modelReference: UserJourneyExperienceModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/NoDuplicateNames", requirement: "No duplicate canonical names are permitted.", category: "Uniqueness", modelReference: UserJourneyExperienceModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/AcyclicRelationships", requirement: "No circular metadata relationships are permitted.", category: "Relationship", modelReference: UserJourneyExperienceModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/PublicApiConsistency", requirement: "Public API Registry is internally consistent.", category: "Consistency", modelReference: UserJourneyExperienceModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/CanonicalIdentity", requirement: "Canonical identity is valid.", category: "Identity", modelReference: UserJourneyExperienceModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Rule/ImmutableMetadata", requirement: "Metadata shall remain immutable.", category: "Integrity", modelReference: UserJourneyExperienceModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
] as const);
