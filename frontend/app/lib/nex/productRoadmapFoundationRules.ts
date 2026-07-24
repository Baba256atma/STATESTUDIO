/**
 * NEX-2:1 — Declarative Product Roadmap Foundation rules.
 */

export const ProductRoadmapFoundationRules = Object.freeze([
  Object.freeze({ id: "NEX-2:1/Rule/RoadmapVision", requirement: "Every roadmap shall define a vision.", category: "Completeness", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Rule/MilestoneRoadmap", requirement: "Every milestone shall belong to one roadmap.", category: "Reference", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Rule/InitiativeTheme", requirement: "Every initiative shall support one strategic theme.", category: "Relationship", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Rule/ReleaseAlignment", requirement: "Every release strategy shall align with roadmap objectives.", category: "Alignment", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Rule/UniquePriority", requirement: "Every priority shall have a unique identifier.", category: "Uniqueness", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Rule/ExplicitAssumptions", requirement: "Planning assumptions shall be explicit.", category: "Integrity", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Rule/ImmutableConstraints", requirement: "Planning constraints shall be immutable.", category: "Integrity", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Rule/VersionedMetadata", requirement: "Foundation metadata shall be versioned.", category: "Versioning", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Rule/ImplementationIndependent", requirement: "Foundation shall remain implementation independent.", category: "Architecture", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Rule/NoExecutableBehavior", requirement: "No executable behavior is permitted.", category: "Architecture", executesRule: false, metadataOnly: true, immutable: true }),
] as const);
