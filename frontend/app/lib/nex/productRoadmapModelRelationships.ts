/**
 * NEX-2:3 — Immutable metadata-only Roadmap Model relationships.
 */

export const ProductRoadmapModelRelationships = Object.freeze([
  Object.freeze({ id: "NEX-2:3/Relationship/VisionContainsMission", sourceModel: "NEX-2:3/Model/RoadmapVision", relationship: "contains", targetModel: "NEX-2:3/Model/RoadmapMission", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Relationship/MissionDrivesInitiatives", sourceModel: "NEX-2:3/Model/RoadmapMission", relationship: "drives", targetModel: "NEX-2:3/Model/StrategicInitiative", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Relationship/InitiativesProduceMilestones", sourceModel: "NEX-2:3/Model/StrategicInitiative", relationship: "produce", targetModel: "NEX-2:3/Model/ProductMilestone", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Relationship/MilestonesBelongToRelease", sourceModel: "NEX-2:3/Model/ProductMilestone", relationship: "belongTo", targetModel: "NEX-2:3/Model/ReleaseStrategy", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Relationship/ReleaseSupportsEvolution", sourceModel: "NEX-2:3/Model/ReleaseStrategy", relationship: "support", targetModel: "NEX-2:3/Model/ProductEvolution", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Relationship/ThemesOrganizePriorities", sourceModel: "NEX-2:3/Model/ProductTheme", relationship: "organize", targetModel: "NEX-2:3/Model/ProductPriority", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Relationship/PrioritiesInfluenceOutcomes", sourceModel: "NEX-2:3/Model/ProductPriority", relationship: "influence", targetModel: "NEX-2:3/Model/ProductOutcome", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Relationship/OutcomesMeasuredByCriteria", sourceModel: "NEX-2:3/Model/ProductOutcome", relationship: "measuredBy", targetModel: "NEX-2:3/Model/SuccessCriteria", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Relationship/AssumptionsInfluencePlanning", sourceModel: "NEX-2:3/Model/PlanningAssumption", relationship: "influence", targetModel: "NEX-2:3/RoadmapPlanning", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Relationship/ConstraintsRestrictPlanning", sourceModel: "NEX-2:3/Model/PlanningConstraint", relationship: "restrict", targetModel: "NEX-2:3/RoadmapPlanning", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Relationship/LifecycleGovernsEvolution", sourceModel: "NEX-2:3/Model/RoadmapLifecycle", relationship: "governs", targetModel: "NEX-2:3/Model/ProductEvolution", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Relationship/GovernanceOverseesLifecycle", sourceModel: "NEX-2:3/Model/RoadmapGovernance", relationship: "oversees", targetModel: "NEX-2:3/Model/RoadmapLifecycle", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Relationship/PrinciplesGuideRoadmap", sourceModel: "NEX-2:3/Model/RoadmapPrinciple", relationship: "guide", targetModel: "NEX-2:3/Model/ProductEvolution", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Relationship/HorizonsFramePlanning", sourceModel: "NEX-2:3/Model/RoadmapHorizon", relationship: "frame", targetModel: "NEX-2:3/RoadmapPlanning", runtimeRelationship: false, metadataOnly: true, immutable: true }),
] as const);
