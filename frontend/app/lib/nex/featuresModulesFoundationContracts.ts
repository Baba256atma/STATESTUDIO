/**
 * NEX-3:1 — Immutable Features & Modules Foundation contracts.
 */

export const FeaturesModulesFoundationContracts = Object.freeze([
  Object.freeze({ id: "NEX-3:1/Contract/Feature", name: "Feature Contract", description: "Declares canonical feature identity and value metadata.", requiredMetadata: Object.freeze(["featureId", "category", "capabilityGroup"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Contract/Module", name: "Module Contract", description: "Declares canonical module identity and responsibility metadata.", requiredMetadata: Object.freeze(["moduleId", "category", "boundary"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Contract/Capability", name: "Capability Contract", description: "Declares a product capability grouping.", requiredMetadata: Object.freeze(["capabilityId", "name", "description"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Contract/Taxonomy", name: "Taxonomy Contract", description: "Declares canonical vocabulary structure.", requiredMetadata: Object.freeze(["taxonomyId", "terms"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Contract/Category", name: "Category Contract", description: "Declares feature or module classification metadata.", requiredMetadata: Object.freeze(["categoryId", "name", "scope"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Contract/Boundary", name: "Boundary Contract", description: "Declares explicit product ownership limits.", requiredMetadata: Object.freeze(["boundaryId", "subject", "exclusions"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Contract/Dependency", name: "Dependency Contract", description: "Declares metadata-only dependency relationships.", requiredMetadata: Object.freeze(["dependencyId", "source", "target"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Contract/Lifecycle", name: "Lifecycle Contract", description: "Declares lifecycle stages without transitions.", requiredMetadata: Object.freeze(["lifecycleId", "stages"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Contract/Composition", name: "Composition Contract", description: "Declares canonical product composition metadata.", requiredMetadata: Object.freeze(["compositionId", "features", "modules"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Contract/Governance", name: "Governance Contract", description: "Declares ownership and stewardship metadata.", requiredMetadata: Object.freeze(["governanceId", "owner", "principles"]), executableContract: false, metadataOnly: true, immutable: true }),
] as const);
