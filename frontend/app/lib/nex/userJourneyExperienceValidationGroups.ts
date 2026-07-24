/**
 * NEX-4:4 — Exactly sixteen immutable validation groups.
 */

import { UserJourneyExperienceModel } from "./userJourneyExperienceModel.ts";

export const UserJourneyExperienceValidationGroups = Object.freeze([
  Object.freeze({ id: "NEX-4:4/Group/Identity", name: "Identity", domainCoverage: Object.freeze(["UserJourneyVision"]), modelReference: UserJourneyExperienceModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/Structure", name: "Structure", domainCoverage: Object.freeze(["JourneyStage"]), modelReference: UserJourneyExperienceModel.inventory.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/Relationships", name: "Relationships", domainCoverage: Object.freeze(["JourneyStage", "ExperienceTouchpoint"]), modelReference: UserJourneyExperienceModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/Dependencies", name: "Dependencies", domainCoverage: Object.freeze(["ModelDependency"]), modelReference: UserJourneyExperienceModel.dependency.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/Metadata", name: "Metadata", domainCoverage: Object.freeze(["ExperiencePrinciple"]), modelReference: UserJourneyExperienceModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/Compatibility", name: "Compatibility", domainCoverage: Object.freeze(["Compatibility"]), modelReference: UserJourneyExperienceModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/Readiness", name: "Readiness", domainCoverage: Object.freeze(["ExperienceGovernance"]), modelReference: UserJourneyExperienceModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/Inventory", name: "Inventory", domainCoverage: Object.freeze(["ModelInventory"]), modelReference: UserJourneyExperienceModel.inventory.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/Publication", name: "Publication", domainCoverage: Object.freeze(["PublicMetadata"]), modelReference: UserJourneyExperienceModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/Governance", name: "Governance", domainCoverage: Object.freeze(["ExperienceGovernance"]), modelReference: UserJourneyExperienceModel.models[14].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/Lifecycle", name: "Lifecycle", domainCoverage: Object.freeze(["ExperienceLifecycle"]), modelReference: UserJourneyExperienceModel.models[12].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/Journey", name: "Journey", domainCoverage: Object.freeze(["UserJourneyVision", "JourneyStage"]), modelReference: UserJourneyExperienceModel.models[0].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/Experience", name: "Experience", domainCoverage: Object.freeze(["Onboarding", "WorkspaceEntry", "DataConnection", "AdvisorInteraction", "Decision", "Timeline"]), modelReference: UserJourneyExperienceModel.models[6].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/Personas", name: "Personas", domainCoverage: Object.freeze(["UserPersona", "ExecutiveGoal"]), modelReference: UserJourneyExperienceModel.models[2].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/Touchpoints", name: "Touchpoints", domainCoverage: Object.freeze(["ExperienceTouchpoint"]), modelReference: UserJourneyExperienceModel.models[5].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Group/ApiRegistry", name: "API Registry", domainCoverage: Object.freeze(["PublicApiRegistry"]), modelReference: UserJourneyExperienceModel.identity.id, metadataOnly: true, immutable: true }),
] as const);
