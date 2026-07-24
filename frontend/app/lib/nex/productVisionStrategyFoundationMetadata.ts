/**
 * NEX-1:1 — Canonical product identity metadata collections.
 */

import type {
  ProductReferenceEntry,
  ProductValidationDeclaration,
} from "./productVisionStrategyFoundationTypes.ts";

export const ProductVision = Object.freeze({
  id: "NEX-1:1/Vision",
  name: "Decision clarity at organizational scale",
  statement:
    "A future where leaders and organizations can understand complex realities, explore meaningful choices, and make aligned decisions with clarity and confidence.",
  horizon: "Long-term",
  immutable: true,
  metadataOnly: true,
} as const);

export const ProductMission = Object.freeze({
  id: "NEX-1:1/Mission",
  name: "Make strategic complexity understandable",
  statement:
    "Help decision-makers turn fragmented organizational context into shared understanding, credible options, and durable strategic alignment.",
  beneficiaries: Object.freeze(["Executive leaders", "Strategy leaders", "Operational leaders", "Cross-functional decision teams"]),
  contribution: "A coherent product reference for strategic understanding and decision support.",
  immutable: true,
  metadataOnly: true,
} as const);

export const ProductPrinciples: readonly ProductReferenceEntry[] = Object.freeze([
  Object.freeze({ id: "NEX-1:1/Principle/Clarity", name: "Clarity over complexity", description: "Make complex strategic situations understandable without erasing material nuance.", order: 1, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Principle/DecisionCentered", name: "Decision-centered value", description: "Anchor product value in consequential decisions and their outcomes.", order: 2, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Principle/SharedContext", name: "Shared context", description: "Promote a common, inspectable understanding across decision participants.", order: 3, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Principle/HumanAuthority", name: "Human authority", description: "Preserve accountable human judgment as the authority for consequential choices.", order: 4, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Principle/Traceability", name: "Traceable meaning", description: "Keep product claims, assumptions, and intended outcomes understandable.", order: 5, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Principle/LongTermTrust", name: "Long-term trust", description: "Prefer durable trust, reliability, and stewardship over short-lived engagement.", order: 6, immutable: true, metadataOnly: true }),
] as const);

export const TargetUsers: readonly ProductReferenceEntry[] = Object.freeze([
  Object.freeze({ id: "NEX-1:1/User/ExecutiveLeader", name: "Executive leaders", description: "Leaders accountable for enterprise direction, trade-offs, and outcomes.", order: 1, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/User/StrategyLeader", name: "Strategy leaders", description: "Leaders translating ambition, evidence, and constraints into coherent choices.", order: 2, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/User/OperationalLeader", name: "Operational leaders", description: "Leaders connecting strategy with operating realities, dependencies, and execution context.", order: 3, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/User/DecisionTeam", name: "Cross-functional decision teams", description: "Groups that need shared context and alignment around consequential choices.", order: 4, immutable: true, metadataOnly: true }),
] as const);

export const ProductGoals: readonly ProductReferenceEntry[] = Object.freeze([
  Object.freeze({ id: "NEX-1:1/Goal/SharedUnderstanding", name: "Create shared strategic understanding", description: "Enable decision participants to work from coherent context.", order: 1, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Goal/DecisionQuality", name: "Improve decision quality", description: "Help users consider evidence, assumptions, uncertainty, and trade-offs.", order: 2, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Goal/Alignment", name: "Strengthen alignment", description: "Make intended outcomes and strategic choices easier to communicate and govern.", order: 3, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Goal/Continuity", name: "Preserve decision continuity", description: "Maintain understandable strategic context across time and organizational change.", order: 4, immutable: true, metadataOnly: true }),
] as const);

export const StrategicObjectives: readonly ProductReferenceEntry[] = Object.freeze([
  Object.freeze({ id: "NEX-1:1/Objective/TrustedReference", name: "Become a trusted decision reference", description: "Establish Nexora as a dependable source of shared strategic context.", order: 1, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Objective/ConnectedThinking", name: "Connect strategic and operational thinking", description: "Bridge enterprise intent with the realities that shape outcomes.", order: 2, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Objective/InstitutionalLearning", name: "Support institutional learning", description: "Help organizations retain and improve decision knowledge over time.", order: 3, immutable: true, metadataOnly: true }),
] as const);

export const ProductScope: readonly ProductReferenceEntry[] = Object.freeze([
  Object.freeze({ id: "NEX-1:1/Scope/ProductIdentity", name: "Product identity", description: "Why Nexora exists and the value it intends to create.", order: 1, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Scope/ProductDirection", name: "Product direction", description: "Who Nexora serves and the strategic outcomes it pursues.", order: 2, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Scope/ProductGovernance", name: "Product governance", description: "Principles, boundaries, lifecycle, and success measures guiding downstream work.", order: 3, immutable: true, metadataOnly: true }),
] as const);

export const ProductBoundaries: readonly ProductReferenceEntry[] = Object.freeze([
  Object.freeze({ id: "NEX-1:1/Boundary/1", name: "Software architecture", description: "Software architecture is owned by downstream technical layers and is not defined by NEX-1:1.", order: 1, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Boundary/2", name: "Runtime behavior", description: "Runtime behavior is owned by downstream technical layers and is not defined by NEX-1:1.", order: 2, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Boundary/3", name: "UI or rendering", description: "UI and rendering are owned by downstream technical layers and are not defined by NEX-1:1.", order: 3, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Boundary/4", name: "Business logic", description: "Business logic is owned by downstream technical layers and is not defined by NEX-1:1.", order: 4, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Boundary/5", name: "Databases or persistence", description: "Databases and persistence are owned by downstream technical layers and are not defined by NEX-1:1.", order: 5, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Boundary/6", name: "APIs or networking", description: "APIs and networking are owned by downstream technical layers and are not defined by NEX-1:1.", order: 6, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Boundary/7", name: "AI reasoning or implementation", description: "AI reasoning and implementation are owned by downstream technical layers and are not defined by NEX-1:1.", order: 7, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Boundary/8", name: "Orchestration", description: "Orchestration is owned by downstream technical layers and is not defined by NEX-1:1.", order: 8, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Boundary/9", name: "Security implementation", description: "Security implementation is owned by downstream technical layers and is not defined by NEX-1:1.", order: 9, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Boundary/10", name: "Integrations or SDKs", description: "Integrations and SDKs are owned by downstream technical layers and are not defined by NEX-1:1.", order: 10, immutable: true, metadataOnly: true }),
] as const);

export const ProductValues: readonly ProductReferenceEntry[] = Object.freeze([
  Object.freeze({ id: "NEX-1:1/Value/Clarity", name: "Clarity", description: "Make meaning understandable and actionable.", order: 1, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Value/Integrity", name: "Integrity", description: "Represent evidence, uncertainty, and limitations honestly.", order: 2, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Value/Agency", name: "Agency", description: "Strengthen accountable human judgment and choice.", order: 3, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Value/Stewardship", name: "Stewardship", description: "Treat organizational knowledge and trust as enduring responsibilities.", order: 4, immutable: true, metadataOnly: true }),
] as const);

export const SuccessMetrics: readonly ProductReferenceEntry[] = Object.freeze([
  Object.freeze({ id: "NEX-1:1/Metric/DecisionClarity", name: "Decision clarity", description: "Users report clearer understanding of decisions, alternatives, and trade-offs.", order: 1, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Metric/Alignment", name: "Stakeholder alignment", description: "Decision participants share stronger agreement on context and intended outcomes.", order: 2, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Metric/Confidence", name: "Decision confidence", description: "Accountable leaders report appropriately grounded confidence in their choices.", order: 3, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Metric/Continuity", name: "Strategic continuity", description: "Decision context remains understandable and useful over time.", order: 4, immutable: true, metadataOnly: true }),
] as const);

export const StrategicThemes: readonly ProductReferenceEntry[] = Object.freeze([
  Object.freeze({ id: "NEX-1:1/Theme/Understanding", name: "Organizational understanding", description: "Unify fragmented context into a meaningful strategic picture.", order: 1, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Theme/Choice", name: "Consequential choice", description: "Improve how organizations frame, compare, and communicate important choices.", order: 2, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Theme/Alignment", name: "Strategic alignment", description: "Connect leaders, teams, intent, and outcomes around shared direction.", order: 3, immutable: true, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:1/Theme/Learning", name: "Institutional learning", description: "Preserve decision context and strengthen organizational judgment over time.", order: 4, immutable: true, metadataOnly: true }),
] as const);

export const ProductFoundationValidationMetadata: readonly ProductValidationDeclaration[] =
  Object.freeze([
    Object.freeze({ id: "NEX-1:1/ValidationDeclaration/1", name: "Vision presence", description: "Vision must exist.", requirement: "Vision must exist.", order: 1, declarativeOnly: true, executesValidation: false, immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/ValidationDeclaration/2", name: "Mission presence", description: "Mission must exist.", requirement: "Mission must exist.", order: 2, declarativeOnly: true, executesValidation: false, immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/ValidationDeclaration/3", name: "Goal alignment", description: "Every goal must support the vision.", requirement: "Every goal must support the vision.", order: 3, declarativeOnly: true, executesValidation: false, immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/ValidationDeclaration/4", name: "Principle uniqueness", description: "Every principle must be unique.", requirement: "Every principle must be unique.", order: 4, declarativeOnly: true, executesValidation: false, immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/ValidationDeclaration/5", name: "Target user definition", description: "Every target user must be defined.", requirement: "Every target user must be defined.", order: 5, declarativeOnly: true, executesValidation: false, immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/ValidationDeclaration/6", name: "Implementation exclusion", description: "No implementation details are allowed.", requirement: "No implementation details are allowed.", order: 6, declarativeOnly: true, executesValidation: false, immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/ValidationDeclaration/7", name: "Runtime exclusion", description: "No runtime behavior is allowed.", requirement: "No runtime behavior is allowed.", order: 7, declarativeOnly: true, executesValidation: false, immutable: true, metadataOnly: true }),
    Object.freeze({ id: "NEX-1:1/ValidationDeclaration/8", name: "Executable logic exclusion", description: "No executable logic is allowed.", requirement: "No executable logic is allowed.", order: 8, declarativeOnly: true, executesValidation: false, immutable: true, metadataOnly: true }),
  ] as const);
