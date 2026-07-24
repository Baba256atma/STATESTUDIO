/**
 * NEX-2:1 — Immutable Product Roadmap domain metadata.
 */

export const ProductRoadmapFoundationDomains = Object.freeze([
  Object.freeze({ id: "NEX-2:1/Domain/RoadmapVision", name: "Roadmap Vision", description: "Long-term direction for the evolution of Nexora product value.", category: "ProductDirection", order: 1, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/RoadmapMission", name: "Roadmap Mission", description: "Purpose of roadmap planning as a bridge between product strategy and coherent evolution.", category: "ProductDirection", order: 2, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/RoadmapPrinciples", name: "Roadmap Principles", description: "Durable principles guiding roadmap judgment and communication.", category: "Governance", order: 3, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/ProductEvolutionStrategy", name: "Product Evolution Strategy", description: "Strategic metadata describing how product value evolves over time.", category: "Strategy", order: 4, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/RoadmapHorizons", name: "Roadmap Horizons", description: "Near-, medium-, and long-term planning horizon concepts.", category: "Planning", order: 5, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/ReleaseStrategy", name: "Release Strategy", description: "Metadata describing the intended progression of product value through releases.", category: "ReleasePlanning", order: 6, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/ProductMilestones", name: "Product Milestones", description: "Significant roadmap points representing intended product evolution.", category: "Planning", order: 7, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/StrategicInitiatives", name: "Strategic Initiatives", description: "Strategic bodies of product intent supporting roadmap themes.", category: "Strategy", order: 8, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/ProductThemes", name: "Product Themes", description: "Coherent themes organizing roadmap investments and intended value.", category: "Strategy", order: 9, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/ProductPriorities", name: "Product Priorities", description: "Relative importance declarations for roadmap concerns.", category: "Planning", order: 10, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/ProductOutcomes", name: "Product Outcomes", description: "Intended product and user outcomes represented by roadmap metadata.", category: "Outcomes", order: 11, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/SuccessCriteria", name: "Success Criteria", description: "Declarative criteria describing successful roadmap outcomes.", category: "Outcomes", order: 12, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/PlanningAssumptions", name: "Planning Assumptions", description: "Explicit assumptions informing product roadmap planning.", category: "Planning", order: 13, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/PlanningConstraints", name: "Planning Constraints", description: "Immutable constraints bounding roadmap intent.", category: "Planning", order: 14, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/RoadmapLifecycle", name: "Roadmap Lifecycle", description: "Declarative stages through which roadmap metadata evolves.", category: "Lifecycle", order: 15, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:1/Domain/RoadmapGovernance", name: "Roadmap Governance", description: "Ownership and stewardship metadata for roadmap decisions.", category: "Governance", order: 16, metadataOnly: true, immutable: true }),
] as const);

export const ProductRoadmapFoundationStrategy = Object.freeze({
  vision: Object.freeze({
    id: "NEX-2:1/Vision",
    statement: "Guide Nexora's evolution through a coherent, outcome-centered, and adaptable product direction.",
    metadataOnly: true,
    immutable: true,
  }),
  mission: Object.freeze({
    id: "NEX-2:1/Mission",
    statement: "Translate product strategy into transparent horizons, themes, milestones, and intended outcomes.",
    metadataOnly: true,
    immutable: true,
  }),
  principles: Object.freeze([
    Object.freeze({ id: "NEX-2:1/Principle/OutcomeCentered", name: "Outcome-centered", description: "Prioritize intended product and user outcomes over activity.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-2:1/Principle/StrategicAlignment", name: "Strategic alignment", description: "Keep roadmap direction aligned with canonical product strategy.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-2:1/Principle/TransparentIntent", name: "Transparent intent", description: "Make roadmap intent, assumptions, and constraints understandable.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-2:1/Principle/EvolutionOverPrediction", name: "Evolution over prediction", description: "Treat the roadmap as governed direction rather than guaranteed scheduling.", metadataOnly: true, immutable: true }),
  ]),
  horizons: Object.freeze(["NearTerm", "MidTerm", "LongTerm"]),
  lifecycle: Object.freeze(["Declared", "Aligned", "Planned", "Published", "Reviewed", "Evolved"]),
  metadataOnly: true,
  immutable: true,
} as const);
