/**
 * NEX-1:2 — Declarative Registry relationships.
 *
 * References only. No graph, traversal, resolution, or runtime relationships.
 */

import type { ProductRegistryRelationship } from "./productVisionStrategyRegistryTypes.ts";

export const ProductVisionStrategyRegistryRelationships: readonly ProductRegistryRelationship[] =
  Object.freeze([
    Object.freeze({ identifier: "NEX-1:2/Relationship/VisionSupportsMission", sourceIdentifier: "NEX-1:2/Vision/DecisionClarity", relationship: "supports", targetIdentifier: "NEX-1:2/Mission/StrategicComplexity", description: "The product vision supports the mission.", status: "Declared", version: "1.0.0", runtimeRelationship: false, metadataOnly: true, immutable: true }),
    Object.freeze({ identifier: "NEX-1:2/Relationship/MissionDrivesSharedUnderstanding", sourceIdentifier: "NEX-1:2/Mission/StrategicComplexity", relationship: "drives", targetIdentifier: "NEX-1:2/Goal/SharedUnderstanding", description: "The mission drives the shared-understanding goal.", status: "Declared", version: "1.0.0", runtimeRelationship: false, metadataOnly: true, immutable: true }),
    Object.freeze({ identifier: "NEX-1:2/Relationship/GoalSupportsTrustedReference", sourceIdentifier: "NEX-1:2/Goal/SharedUnderstanding", relationship: "supports", targetIdentifier: "NEX-1:2/Objective/TrustedReference", description: "Shared understanding supports the trusted-reference objective.", status: "Declared", version: "1.0.0", runtimeRelationship: false, metadataOnly: true, immutable: true }),
    Object.freeze({ identifier: "NEX-1:2/Relationship/ObjectiveMeasuredByClarity", sourceIdentifier: "NEX-1:2/Objective/TrustedReference", relationship: "measuredBy", targetIdentifier: "NEX-1:2/Metric/DecisionClarity", description: "Decision clarity is a declared measure of trusted-reference progress.", status: "Declared", version: "1.0.0", runtimeRelationship: false, metadataOnly: true, immutable: true }),
    Object.freeze({ identifier: "NEX-1:2/Relationship/CapabilitySupportsGoal", sourceIdentifier: "NEX-1:2/Capability/ContextualUnderstanding", relationship: "supports", targetIdentifier: "NEX-1:2/Goal/SharedUnderstanding", description: "Contextual understanding supports shared strategic understanding.", status: "Declared", version: "1.0.0", runtimeRelationship: false, metadataOnly: true, immutable: true }),
    Object.freeze({ identifier: "NEX-1:2/Relationship/LifecycleGovernsEvolution", sourceIdentifier: "NEX-1:2/Lifecycle/Evolve", relationship: "governs", targetIdentifier: "NEX-1:2/Scope/ProductGovernance", description: "Lifecycle evolution is governed as product-reference metadata.", status: "Declared", version: "1.0.0", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  ] as const);
