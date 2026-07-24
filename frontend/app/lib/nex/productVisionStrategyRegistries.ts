/**
 * NEX-1:2 — Canonical product strategy registries.
 *
 * Sixteen distinct immutable metadata registries. NEX-1:1 is the sole source.
 */

import { ProductVisionStrategyFoundation } from "./productVisionStrategyFoundation.ts";
import type { ProductRegistryEntry } from "./productVisionStrategyRegistryTypes.ts";

const Foundation = ProductVisionStrategyFoundation;

export const ProductVisionRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Vision/DecisionClarity", canonicalName: Foundation.vision.name, description: Foundation.vision.statement, category: "Vision", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["vision", "decision-clarity"]), version: "1.0.0", sourceIdentifier: Foundation.vision.id, metadataOnly: true, immutable: true }),
] as const);

export const ProductMissionRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Mission/StrategicComplexity", canonicalName: Foundation.mission.name, description: Foundation.mission.statement, category: "Mission", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["mission", "strategic-understanding"]), version: "1.0.0", sourceIdentifier: Foundation.mission.id, metadataOnly: true, immutable: true }),
] as const);

export const ProductPrincipleRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Principle/Clarity", canonicalName: "Clarity over complexity", description: "Make complex strategic situations understandable without erasing material nuance.", category: "Principle", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["principle", "clarity"]), version: "1.0.0", sourceIdentifier: Foundation.principles[0].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Principle/DecisionCentered", canonicalName: "Decision-centered value", description: "Anchor product value in consequential decisions and their outcomes.", category: "Principle", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["principle", "decisions"]), version: "1.0.0", sourceIdentifier: Foundation.principles[1].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Principle/SharedContext", canonicalName: "Shared context", description: "Promote a common, inspectable understanding across decision participants.", category: "Principle", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["principle", "context"]), version: "1.0.0", sourceIdentifier: Foundation.principles[2].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Principle/HumanAuthority", canonicalName: "Human authority", description: "Preserve accountable human judgment as the authority for consequential choices.", category: "Principle", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["principle", "human-authority"]), version: "1.0.0", sourceIdentifier: Foundation.principles[3].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Principle/Traceability", canonicalName: "Traceable meaning", description: "Keep product claims, assumptions, and intended outcomes understandable.", category: "Principle", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["principle", "traceability"]), version: "1.0.0", sourceIdentifier: Foundation.principles[4].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Principle/Trust", canonicalName: "Long-term trust", description: "Prefer durable trust, reliability, and stewardship over short-lived engagement.", category: "Principle", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["principle", "trust"]), version: "1.0.0", sourceIdentifier: Foundation.principles[5].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductValueRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Value/Clarity", canonicalName: "Clarity", description: "Make meaning understandable and actionable.", category: "Value", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["value", "clarity"]), version: "1.0.0", sourceIdentifier: Foundation.values[0].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Value/Integrity", canonicalName: "Integrity", description: "Represent evidence, uncertainty, and limitations honestly.", category: "Value", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["value", "integrity"]), version: "1.0.0", sourceIdentifier: Foundation.values[1].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Value/Agency", canonicalName: "Agency", description: "Strengthen accountable human judgment and choice.", category: "Value", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["value", "agency"]), version: "1.0.0", sourceIdentifier: Foundation.values[2].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Value/Stewardship", canonicalName: "Stewardship", description: "Treat organizational knowledge and trust as enduring responsibilities.", category: "Value", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["value", "stewardship"]), version: "1.0.0", sourceIdentifier: Foundation.values[3].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductGoalRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Goal/SharedUnderstanding", canonicalName: "Create shared strategic understanding", description: "Enable decision participants to work from coherent context.", category: "Goal", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["goal", "vision:decision-clarity"]), version: "1.0.0", sourceIdentifier: Foundation.goals[0].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Goal/DecisionQuality", canonicalName: "Improve decision quality", description: "Help users consider evidence, assumptions, uncertainty, and trade-offs.", category: "Goal", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["goal", "vision:decision-clarity"]), version: "1.0.0", sourceIdentifier: Foundation.goals[1].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Goal/Alignment", canonicalName: "Strengthen alignment", description: "Make intended outcomes and strategic choices easier to communicate and govern.", category: "Goal", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["goal", "vision:decision-clarity"]), version: "1.0.0", sourceIdentifier: Foundation.goals[2].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Goal/Continuity", canonicalName: "Preserve decision continuity", description: "Maintain understandable strategic context across time and organizational change.", category: "Goal", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["goal", "vision:decision-clarity"]), version: "1.0.0", sourceIdentifier: Foundation.goals[3].id, metadataOnly: true, immutable: true }),
] as const);

export const StrategicObjectiveRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Objective/TrustedReference", canonicalName: "Become a trusted decision reference", description: "Establish Nexora as a dependable source of shared strategic context.", category: "StrategicObjective", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["objective", "goal:shared-understanding"]), version: "1.0.0", sourceIdentifier: Foundation.strategicObjectives[0].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Objective/ConnectedThinking", canonicalName: "Connect strategic and operational thinking", description: "Bridge enterprise intent with the realities that shape outcomes.", category: "StrategicObjective", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["objective", "goal:decision-quality"]), version: "1.0.0", sourceIdentifier: Foundation.strategicObjectives[1].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Objective/InstitutionalLearning", canonicalName: "Support institutional learning", description: "Help organizations retain and improve decision knowledge over time.", category: "StrategicObjective", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["objective", "goal:continuity"]), version: "1.0.0", sourceIdentifier: Foundation.strategicObjectives[2].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductScopeRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Scope/ProductIdentity", canonicalName: "Product identity", description: "Why Nexora exists and the value it intends to create.", category: "Scope", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["scope", "identity"]), version: "1.0.0", sourceIdentifier: Foundation.scope[0].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Scope/ProductDirection", canonicalName: "Product direction", description: "Who Nexora serves and the strategic outcomes it pursues.", category: "Scope", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["scope", "direction"]), version: "1.0.0", sourceIdentifier: Foundation.scope[1].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Scope/ProductGovernance", canonicalName: "Product governance", description: "Principles, boundaries, lifecycle, and success measures guiding downstream work.", category: "Scope", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["scope", "governance"]), version: "1.0.0", sourceIdentifier: Foundation.scope[2].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductBoundaryRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Boundary/TechnicalImplementation", canonicalName: "Technical implementation boundary", description: "Architecture, runtime, UI, rendering, logic, data, APIs, networking, AI, orchestration, security, integrations, and SDKs remain outside NEX product-reference ownership.", category: "Boundary", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["boundary", "technical-layers"]), version: "1.0.0", sourceIdentifier: Foundation.boundaries[0].id, metadataOnly: true, immutable: true }),
] as const);

export const TargetUserRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/User/ExecutiveLeader", canonicalName: "Executive leaders", description: "Leaders accountable for enterprise direction, trade-offs, and outcomes.", category: "TargetUser", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["user", "executive"]), version: "1.0.0", sourceIdentifier: Foundation.targetUsers[0].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/User/StrategyLeader", canonicalName: "Strategy leaders", description: "Leaders translating ambition, evidence, and constraints into coherent choices.", category: "TargetUser", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["user", "strategy"]), version: "1.0.0", sourceIdentifier: Foundation.targetUsers[1].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/User/OperationalLeader", canonicalName: "Operational leaders", description: "Leaders connecting strategy with operating realities, dependencies, and execution context.", category: "TargetUser", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["user", "operations"]), version: "1.0.0", sourceIdentifier: Foundation.targetUsers[2].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/User/DecisionTeam", canonicalName: "Cross-functional decision teams", description: "Groups that need shared context and alignment around consequential choices.", category: "TargetUser", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["user", "decision-team"]), version: "1.0.0", sourceIdentifier: Foundation.targetUsers[3].id, metadataOnly: true, immutable: true }),
] as const);

export const StakeholderRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Stakeholder/AccountableLeader", canonicalName: "Accountable decision owner", description: "The person accountable for a consequential organizational decision.", category: "Stakeholder", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["stakeholder", "accountability"]), version: "1.0.0", sourceIdentifier: Foundation.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Stakeholder/DecisionParticipant", canonicalName: "Decision participant", description: "A contributor whose context or judgment informs a decision.", category: "Stakeholder", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["stakeholder", "participation"]), version: "1.0.0", sourceIdentifier: Foundation.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Stakeholder/AffectedTeam", canonicalName: "Affected team", description: "A team materially affected by a decision or its intended outcomes.", category: "Stakeholder", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["stakeholder", "outcomes"]), version: "1.0.0", sourceIdentifier: Foundation.identity.id, metadataOnly: true, immutable: true }),
] as const);

export const SuccessMetricRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Metric/DecisionClarity", canonicalName: "Decision clarity", description: "Users report clearer understanding of decisions, alternatives, and trade-offs.", category: "SuccessMetric", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["metric", "clarity"]), version: "1.0.0", sourceIdentifier: Foundation.successMetrics[0].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Metric/Alignment", canonicalName: "Stakeholder alignment", description: "Decision participants share stronger agreement on context and intended outcomes.", category: "SuccessMetric", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["metric", "alignment"]), version: "1.0.0", sourceIdentifier: Foundation.successMetrics[1].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Metric/Confidence", canonicalName: "Decision confidence", description: "Accountable leaders report appropriately grounded confidence in their choices.", category: "SuccessMetric", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["metric", "confidence"]), version: "1.0.0", sourceIdentifier: Foundation.successMetrics[2].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Metric/Continuity", canonicalName: "Strategic continuity", description: "Decision context remains understandable and useful over time.", category: "SuccessMetric", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["metric", "continuity"]), version: "1.0.0", sourceIdentifier: Foundation.successMetrics[3].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductLifecycleRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Lifecycle/Discover", canonicalName: "Discover", description: "Understand users, decisions, and strategic problems.", category: "Lifecycle", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["lifecycle", "discovery"]), version: "1.0.0", sourceIdentifier: Foundation.lifecycle.stages[0].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Lifecycle/Define", canonicalName: "Define", description: "Define product intent, outcomes, scope, and boundaries.", category: "Lifecycle", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["lifecycle", "definition"]), version: "1.0.0", sourceIdentifier: Foundation.lifecycle.stages[1].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Lifecycle/Develop", canonicalName: "Develop", description: "Guide delivery through approved downstream technical layers.", category: "Lifecycle", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["lifecycle", "development"]), version: "1.0.0", sourceIdentifier: Foundation.lifecycle.stages[2].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Lifecycle/Release", canonicalName: "Release", description: "Describe product releases and their intended value.", category: "Lifecycle", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["lifecycle", "release"]), version: "1.0.0", sourceIdentifier: Foundation.lifecycle.stages[3].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Lifecycle/Learn", canonicalName: "Learn", description: "Evaluate declared product outcomes and strategic fit.", category: "Lifecycle", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["lifecycle", "learning"]), version: "1.0.0", sourceIdentifier: Foundation.lifecycle.stages[4].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Lifecycle/Evolve", canonicalName: "Evolve", description: "Refine product direction through governed product-reference revisions.", category: "Lifecycle", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["lifecycle", "evolution"]), version: "1.0.0", sourceIdentifier: Foundation.lifecycle.stages[5].id, metadataOnly: true, immutable: true }),
] as const);

export const StrategicThemeRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Theme/Understanding", canonicalName: "Organizational understanding", description: "Unify fragmented context into a meaningful strategic picture.", category: "StrategicTheme", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["theme", "understanding"]), version: "1.0.0", sourceIdentifier: Foundation.strategicThemes[0].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Theme/Choice", canonicalName: "Consequential choice", description: "Improve how organizations frame, compare, and communicate important choices.", category: "StrategicTheme", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["theme", "choice"]), version: "1.0.0", sourceIdentifier: Foundation.strategicThemes[1].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Theme/Alignment", canonicalName: "Strategic alignment", description: "Connect leaders, teams, intent, and outcomes around shared direction.", category: "StrategicTheme", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["theme", "alignment"]), version: "1.0.0", sourceIdentifier: Foundation.strategicThemes[2].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Theme/Learning", canonicalName: "Institutional learning", description: "Preserve decision context and strengthen organizational judgment over time.", category: "StrategicTheme", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["theme", "learning"]), version: "1.0.0", sourceIdentifier: Foundation.strategicThemes[3].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductCapabilityRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Capability/ContextualUnderstanding", canonicalName: "Contextual understanding", description: "Product capability to help users form coherent understanding from fragmented strategic context.", category: "ProductCapability", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["capability", "theme:understanding"]), version: "1.0.0", sourceIdentifier: Foundation.strategicThemes[0].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Capability/ChoiceExploration", canonicalName: "Choice exploration", description: "Product capability to help users examine meaningful alternatives and trade-offs.", category: "ProductCapability", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["capability", "theme:choice"]), version: "1.0.0", sourceIdentifier: Foundation.strategicThemes[1].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Capability/AlignmentSupport", canonicalName: "Alignment support", description: "Product capability to help participants build shared context around direction and outcomes.", category: "ProductCapability", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["capability", "theme:alignment"]), version: "1.0.0", sourceIdentifier: Foundation.strategicThemes[2].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Capability/DecisionContinuity", canonicalName: "Decision continuity", description: "Product capability to preserve understandable decision context over time.", category: "ProductCapability", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["capability", "theme:learning"]), version: "1.0.0", sourceIdentifier: Foundation.strategicThemes[3].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductConstraintRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Constraint/HumanAuthority", canonicalName: "Human authority constraint", description: "Consequential choices remain under accountable human authority.", category: "ProductConstraint", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["constraint", "human-authority"]), version: "1.0.0", sourceIdentifier: Foundation.principles[3].id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Constraint/ProductReferenceOnly", canonicalName: "Product-reference-only constraint", description: "NEX defines product direction and does not replace downstream technical architecture.", category: "ProductConstraint", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["constraint", "boundary"]), version: "1.0.0", sourceIdentifier: Foundation.scope[0].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductAssumptionRegistry: readonly ProductRegistryEntry[] = Object.freeze([
  Object.freeze({ identifier: "NEX-1:2/Assumption/FragmentedContext", canonicalName: "Strategic context is fragmented", description: "Organizations commonly distribute material decision context across people, systems, and time.", category: "ProductAssumption", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["assumption", "context"]), version: "1.0.0", sourceIdentifier: Foundation.mission.id, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:2/Assumption/SharedUnderstanding", canonicalName: "Shared understanding improves alignment", description: "Clearer common context supports stronger organizational alignment around consequential choices.", category: "ProductAssumption", status: "Registered", owner: "Nexora Product", tags: Object.freeze(["assumption", "alignment"]), version: "1.0.0", sourceIdentifier: Foundation.goals[0].id, metadataOnly: true, immutable: true }),
] as const);

export const ProductVisionStrategyRegistryCollections = Object.freeze({
  visions: ProductVisionRegistry,
  missions: ProductMissionRegistry,
  principles: ProductPrincipleRegistry,
  values: ProductValueRegistry,
  goals: ProductGoalRegistry,
  strategicObjectives: StrategicObjectiveRegistry,
  scopes: ProductScopeRegistry,
  boundaries: ProductBoundaryRegistry,
  targetUsers: TargetUserRegistry,
  stakeholders: StakeholderRegistry,
  successMetrics: SuccessMetricRegistry,
  lifecycleStages: ProductLifecycleRegistry,
  strategicThemes: StrategicThemeRegistry,
  capabilities: ProductCapabilityRegistry,
  constraints: ProductConstraintRegistry,
  assumptions: ProductAssumptionRegistry,
} as const);
