/**
 * NEX-4:3 — Immutable metadata-only Model relationships.
 */

export const UserJourneyExperienceModelRelationships = Object.freeze([
  Object.freeze({ id: "NEX-4:3/Relationship/VisionGuidesPrinciples", sourceModel: "NEX-4:3/Model/UserJourneyVision", relationship: "guides", targetModel: "NEX-4:3/Model/ExperiencePrinciple", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Relationship/PrinciplesDefineStages", sourceModel: "NEX-4:3/Model/ExperiencePrinciple", relationship: "define", targetModel: "NEX-4:3/Model/JourneyStage", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Relationship/PersonasFollowJourneys", sourceModel: "NEX-4:3/Model/UserPersona", relationship: "follow", targetModel: "NEX-4:3/Model/UserJourneyVision", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Relationship/StagesContainTouchpoints", sourceModel: "NEX-4:3/Model/JourneyStage", relationship: "contain", targetModel: "NEX-4:3/Model/ExperienceTouchpoint", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Relationship/OnboardingLeadsToWorkspace", sourceModel: "NEX-4:3/Model/OnboardingExperience", relationship: "leadsTo", targetModel: "NEX-4:3/Model/WorkspaceEntry", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Relationship/WorkspaceEnablesData", sourceModel: "NEX-4:3/Model/WorkspaceEntry", relationship: "enables", targetModel: "NEX-4:3/Model/DataConnectionExperience", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Relationship/DataEnablesAdvisor", sourceModel: "NEX-4:3/Model/DataConnectionExperience", relationship: "enables", targetModel: "NEX-4:3/Model/AdvisorInteraction", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Relationship/AdvisorSupportsDecision", sourceModel: "NEX-4:3/Model/AdvisorInteraction", relationship: "supports", targetModel: "NEX-4:3/Model/DecisionExperience", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Relationship/DecisionContributesTimeline", sourceModel: "NEX-4:3/Model/DecisionExperience", relationship: "contributesTo", targetModel: "NEX-4:3/Model/TimelineExperience", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Relationship/LifecycleGovernsJourney", sourceModel: "NEX-4:3/Model/ExperienceLifecycle", relationship: "governs", targetModel: "NEX-4:3/Model/UserJourneyVision", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Relationship/GovernanceOverseesLifecycle", sourceModel: "NEX-4:3/Model/ExperienceGovernance", relationship: "oversees", targetModel: "NEX-4:3/Model/ExperienceLifecycle", runtimeRelationship: false, metadataOnly: true, immutable: true }),
] as const);
