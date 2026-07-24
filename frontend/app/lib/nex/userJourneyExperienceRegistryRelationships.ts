/**
 * NEX-4:2 — Immutable metadata-only Registry relationships.
 */

export const UserJourneyExperienceRegistryRelationships = Object.freeze([
  Object.freeze({ id: "NEX-4:2/Relationship/VisionGuidesPrinciples", source: "NEX-4:2/Vision/CoherentLifecycle", relationship: "guides", target: "NEX-4:2/Principle/Clarity", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Relationship/PrinciplesShapeStages", source: "NEX-4:2/Principle/Clarity", relationship: "shape", target: "NEX-4:2/JourneyStage/Onboarding", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Relationship/PersonasFollowJourneys", source: "NEX-4:2/Persona/Executive", relationship: "follow", target: "NEX-4:2/Vision/CoherentLifecycle", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Relationship/StagesContainTouchpoints", source: "NEX-4:2/JourneyStage/Onboarding", relationship: "contain", target: "NEX-4:2/Touchpoint/Orientation", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Relationship/OnboardingLeadsToWorkspace", source: "NEX-4:2/Experience/Onboarding", relationship: "leadsTo", target: "NEX-4:2/Experience/WorkspaceEntry", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Relationship/WorkspaceEnablesData", source: "NEX-4:2/Experience/WorkspaceEntry", relationship: "enables", target: "NEX-4:2/Experience/DataConnection", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Relationship/DataEnablesAdvisor", source: "NEX-4:2/Experience/DataConnection", relationship: "enables", target: "NEX-4:2/Experience/AdvisorInteraction", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Relationship/AdvisorSupportsDecision", source: "NEX-4:2/Experience/AdvisorInteraction", relationship: "supports", target: "NEX-4:2/Experience/Decision", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Relationship/DecisionContributesTimeline", source: "NEX-4:2/Experience/Decision", relationship: "contributesTo", target: "NEX-4:2/Experience/Timeline", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Relationship/GovernanceGovernsLifecycle", source: "NEX-4:2/Governance/ExperienceStewardship", relationship: "governs", target: "NEX-4:2/Lifecycle/UserExperience", runtimeRelationship: false, metadataOnly: true, immutable: true }),
] as const);
