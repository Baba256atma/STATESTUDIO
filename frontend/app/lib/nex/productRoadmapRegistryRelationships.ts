/**
 * NEX-2:2 — Metadata-only Product Roadmap Registry relationships.
 */

export const ProductRoadmapRegistryRelationships = Object.freeze([
  Object.freeze({ id: "NEX-2:2/Relationship/VisionGuidesMission", source: "NEX-2:2/Vision/ProductEvolution", relationship: "guides", target: "NEX-2:2/Mission/StrategicPlanning", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Relationship/MissionDrivesInitiatives", source: "NEX-2:2/Mission/StrategicPlanning", relationship: "drives", target: "NEX-2:2/Initiative/ProductEvolution", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Relationship/InitiativesProduceMilestones", source: "NEX-2:2/Initiative/ProductEvolution", relationship: "produce", target: "NEX-2:2/Milestone/StrategicValue", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Relationship/MilestonesBelongToRelease", source: "NEX-2:2/Milestone/StrategicValue", relationship: "belongTo", target: "NEX-2:2/ReleaseStrategy/ValueProgression", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Relationship/ReleaseSupportsEvolution", source: "NEX-2:2/ReleaseStrategy/ValueProgression", relationship: "supports", target: "NEX-2:2/Evolution/CoherentValue", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Relationship/ThemesOrganizePriorities", source: "NEX-2:2/Theme/StrategicEvolution", relationship: "organize", target: "NEX-2:2/Priority/OutcomeAlignment", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Relationship/PrioritiesInfluenceOutcomes", source: "NEX-2:2/Priority/OutcomeAlignment", relationship: "influence", target: "NEX-2:2/Outcome/CoherentEvolution", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Relationship/OutcomesMeasuredByCriteria", source: "NEX-2:2/Outcome/CoherentEvolution", relationship: "measuredBy", target: "NEX-2:2/SuccessCriteria/StrategicAlignment", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Relationship/AssumptionsInfluencePlanning", source: "NEX-2:2/Assumption/EvolvingContext", relationship: "influence", target: "NEX-2:2/RoadmapPlanning", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Relationship/ConstraintsLimitPlanning", source: "NEX-2:2/Constraint/NoSchedulingCommitment", relationship: "limit", target: "NEX-2:2/RoadmapPlanning", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Relationship/LifecycleGovernsEvolution", source: "NEX-2:2/Lifecycle/RoadmapEvolution", relationship: "governs", target: "NEX-2:2/Evolution/CoherentValue", runtimeRelationship: false, metadataOnly: true, immutable: true }),
] as const);
