/**
 * NEX-2:1 — Immutable Product Roadmap Foundation contracts.
 */

export const ProductRoadmapFoundationContracts = Object.freeze([
  Object.freeze({ id: "NEX-2:1/Contract/Roadmap", name: "Roadmap Contract", description: "Declares canonical roadmap identity and direction metadata.", requiredMetadata: Object.freeze(["roadmapId", "vision", "objectives"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Contract/ReleaseStrategy", name: "Release Strategy Contract", description: "Declares release strategy alignment metadata.", requiredMetadata: Object.freeze(["strategyId", "roadmapReference", "objectives"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Contract/Milestone", name: "Milestone Contract", description: "Declares a significant product evolution milestone.", requiredMetadata: Object.freeze(["milestoneId", "roadmapReference", "outcome"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Contract/Initiative", name: "Initiative Contract", description: "Declares strategic initiative metadata.", requiredMetadata: Object.freeze(["initiativeId", "themeReference", "outcomes"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Contract/Theme", name: "Theme Contract", description: "Declares a strategic roadmap theme.", requiredMetadata: Object.freeze(["themeId", "name", "description"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Contract/Priority", name: "Priority Contract", description: "Declares relative roadmap priority metadata.", requiredMetadata: Object.freeze(["priorityId", "subject", "rationale"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Contract/Outcome", name: "Outcome Contract", description: "Declares an intended product roadmap outcome.", requiredMetadata: Object.freeze(["outcomeId", "description", "successCriteria"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Contract/Governance", name: "Governance Contract", description: "Declares roadmap ownership and stewardship metadata.", requiredMetadata: Object.freeze(["governanceId", "owner", "principles"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Contract/Lifecycle", name: "Lifecycle Contract", description: "Declares roadmap lifecycle stages without transitions.", requiredMetadata: Object.freeze(["lifecycleId", "stages"]), executableContract: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Contract/Planning", name: "Planning Contract", description: "Declares planning assumptions, constraints, and horizons.", requiredMetadata: Object.freeze(["planningId", "assumptions", "constraints", "horizons"]), executableContract: false, metadataOnly: true, immutable: true }),
] as const);
