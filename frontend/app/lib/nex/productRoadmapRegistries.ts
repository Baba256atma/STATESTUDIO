/**
 * NEX-2:2 — Sixteen immutable Product Roadmap registries.
 */

import { ProductRoadmapFoundation } from "./productRoadmapFoundation.ts";

const Foundation = ProductRoadmapFoundation;

export const RoadmapVisionRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/Vision/ProductEvolution", canonicalName: "Product Evolution Roadmap Vision", description: Foundation.strategy.vision.statement, category: "RoadmapVision", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["roadmap", "vision"]), version: "1.0.0", sourceIdentifier: Foundation.strategy.vision.id, metadataOnly: true, immutable: true }),
] as const);

export const RoadmapMissionRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/Mission/StrategicPlanning", canonicalName: "Strategic Roadmap Mission", description: Foundation.strategy.mission.statement, category: "RoadmapMission", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["roadmap", "mission"]), version: "1.0.0", sourceIdentifier: Foundation.strategy.mission.id, metadataOnly: true, immutable: true }),
] as const);

export const RoadmapPrincipleRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/Principle/OutcomeCentered", canonicalName: "Outcome-centered Roadmapping", description: "Prioritize intended product and user outcomes over activity.", category: "RoadmapPrinciple", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["principle", "outcomes"]), version: "1.0.0", sourceIdentifier: Foundation.strategy.principles[0].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-2:2/Principle/StrategicAlignment", canonicalName: "Strategic Roadmap Alignment", description: "Keep roadmap direction aligned with canonical product strategy.", category: "RoadmapPrinciple", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["principle", "alignment"]), version: "1.0.0", sourceIdentifier: Foundation.strategy.principles[1].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-2:2/Principle/TransparentIntent", canonicalName: "Transparent Roadmap Intent", description: "Make roadmap intent, assumptions, and constraints understandable.", category: "RoadmapPrinciple", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["principle", "transparency"]), version: "1.0.0", sourceIdentifier: Foundation.strategy.principles[2].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-2:2/Principle/Evolution", canonicalName: "Evolution over Prediction", description: "Treat the roadmap as governed direction rather than guaranteed scheduling.", category: "RoadmapPrinciple", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["principle", "evolution"]), version: "1.0.0", sourceIdentifier: Foundation.strategy.principles[3].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductEvolutionRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/Evolution/CoherentValue", canonicalName: "Coherent Product Value Evolution", description: "Strategic metadata describing progressive evolution of Nexora product value.", category: "ProductEvolution", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["evolution", "strategy"]), version: "1.0.0", sourceIdentifier: Foundation.domains[3].id, metadataOnly: true, immutable: true }),
] as const);

export const RoadmapHorizonRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/Horizon/NearTerm", canonicalName: "Near-term Horizon", description: "Roadmap direction nearest to current product context.", category: "RoadmapHorizon", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["horizon", "near-term"]), version: "1.0.0", sourceIdentifier: Foundation.domains[4].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-2:2/Horizon/MidTerm", canonicalName: "Mid-term Horizon", description: "Roadmap direction connecting immediate intent with longer-term evolution.", category: "RoadmapHorizon", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["horizon", "mid-term"]), version: "1.0.0", sourceIdentifier: Foundation.domains[4].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-2:2/Horizon/LongTerm", canonicalName: "Long-term Horizon", description: "Roadmap direction expressing enduring product evolution.", category: "RoadmapHorizon", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["horizon", "long-term"]), version: "1.0.0", sourceIdentifier: Foundation.domains[4].id, metadataOnly: true, immutable: true }),
] as const);

export const ReleaseStrategyRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/ReleaseStrategy/ValueProgression", canonicalName: "Value Progression Release Strategy", description: "Intended progression of coherent product value through releases.", category: "ReleaseStrategy", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["release", "strategy"]), version: "1.0.0", sourceIdentifier: Foundation.domains[5].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductMilestoneRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/Milestone/StrategicValue", canonicalName: "Strategic Product Value Milestone", description: "A significant roadmap point representing intended product evolution.", category: "ProductMilestone", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["milestone", "release-strategy:value-progression"]), version: "1.0.0", sourceIdentifier: Foundation.domains[6].id, metadataOnly: true, immutable: true }),
] as const);

export const StrategicInitiativeRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/Initiative/ProductEvolution", canonicalName: "Product Evolution Initiative", description: "Strategic product intent supporting coherent roadmap evolution.", category: "StrategicInitiative", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["initiative", "mission:strategic-planning"]), version: "1.0.0", sourceIdentifier: Foundation.domains[7].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductThemeRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/Theme/StrategicEvolution", canonicalName: "Strategic Product Evolution", description: "Theme organizing roadmap direction around durable product evolution.", category: "ProductTheme", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["theme", "evolution"]), version: "1.0.0", sourceIdentifier: Foundation.domains[8].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductPriorityRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/Priority/OutcomeAlignment", canonicalName: "Outcome Alignment Priority", description: "Priority metadata emphasizing alignment with intended outcomes.", category: "ProductPriority", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["priority", "theme:strategic-evolution"]), version: "1.0.0", sourceIdentifier: Foundation.domains[9].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductOutcomeRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/Outcome/CoherentEvolution", canonicalName: "Coherent Product Evolution Outcome", description: "Intended outcome of understandable and strategically aligned product evolution.", category: "ProductOutcome", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["outcome", "priority:outcome-alignment"]), version: "1.0.0", sourceIdentifier: Foundation.domains[10].id, metadataOnly: true, immutable: true }),
] as const);

export const SuccessCriteriaRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/SuccessCriteria/StrategicAlignment", canonicalName: "Strategic Alignment Criterion", description: "Roadmap direction remains aligned with canonical product strategy.", category: "SuccessCriteria", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["success", "alignment"]), version: "1.0.0", sourceIdentifier: Foundation.domains[11].id, metadataOnly: true, immutable: true }),
] as const);

export const PlanningAssumptionRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/Assumption/EvolvingContext", canonicalName: "Evolving Product Context", description: "Product context and evidence will evolve across roadmap horizons.", category: "PlanningAssumption", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["assumption", "planning"]), version: "1.0.0", sourceIdentifier: Foundation.domains[12].id, metadataOnly: true, immutable: true }),
] as const);

export const PlanningConstraintRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/Constraint/NoSchedulingCommitment", canonicalName: "No Scheduling Commitment", description: "Roadmap metadata expresses direction and does not guarantee scheduling.", category: "PlanningConstraint", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["constraint", "non-executable"]), version: "1.0.0", sourceIdentifier: Foundation.domains[13].id, metadataOnly: true, immutable: true }),
] as const);

export const RoadmapLifecycleRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/Lifecycle/RoadmapEvolution", canonicalName: "Roadmap Evolution Lifecycle", description: "Declared, aligned, planned, published, reviewed, and evolved metadata stages.", category: "RoadmapLifecycle", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["lifecycle", "evolution"]), version: "1.0.0", sourceIdentifier: Foundation.domains[14].id, metadataOnly: true, immutable: true }),
] as const);

export const RoadmapGovernanceRegistry = Object.freeze([
  Object.freeze({ identifier: "NEX-2:2/Governance/ProductStewardship", canonicalName: "Product Roadmap Stewardship", description: "Ownership and stewardship metadata for roadmap direction.", category: "RoadmapGovernance", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["governance", "stewardship"]), version: "1.0.0", sourceIdentifier: Foundation.domains[15].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductRoadmapRegistryCollections = Object.freeze({
  roadmapVision: RoadmapVisionRegistry,
  roadmapMission: RoadmapMissionRegistry,
  roadmapPrinciples: RoadmapPrincipleRegistry,
  productEvolution: ProductEvolutionRegistry,
  roadmapHorizons: RoadmapHorizonRegistry,
  releaseStrategy: ReleaseStrategyRegistry,
  productMilestones: ProductMilestoneRegistry,
  strategicInitiatives: StrategicInitiativeRegistry,
  productThemes: ProductThemeRegistry,
  productPriorities: ProductPriorityRegistry,
  productOutcomes: ProductOutcomeRegistry,
  successCriteria: SuccessCriteriaRegistry,
  planningAssumptions: PlanningAssumptionRegistry,
  planningConstraints: PlanningConstraintRegistry,
  roadmapLifecycle: RoadmapLifecycleRegistry,
  roadmapGovernance: RoadmapGovernanceRegistry,
} as const);
