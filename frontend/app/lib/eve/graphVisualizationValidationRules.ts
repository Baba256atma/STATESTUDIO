import { GraphVisualizationModel } from "./graphVisualizationModel.ts";
import type {
  GraphVisualizationValidationCategory,
  GraphVisualizationValidationRule,
} from "./graphVisualizationValidationTypes.ts";

const categoryNames: readonly GraphVisualizationValidationCategory[] = Object.freeze([
  "IdentityValidation", "RegistryReferenceValidation", "OwnershipValidation",
  "LifecycleValidation", "CapabilityValidation", "BoundaryValidation",
  "StructuralCompositionValidation", "RelationshipValidation",
  "GraphStructureValidation", "NodeValidation", "EdgeValidation",
  "PresentationValidation", "CompatibilityValidation", "InventoryValidation",
  "PublicSurfaceValidation", "CanonicalInventoryRuleValidation",
]);

export const GraphVisualizationValidationCategories = Object.freeze(
  categoryNames.map((name, index) => Object.freeze({
    id: `EVE-3:4/Category/${name}`,
    name,
    modelReference: GraphVisualizationModel.metadata.id,
    modelOwnershipReference: GraphVisualizationModel.metadata.ownership,
    modelBoundaryReference: GraphVisualizationModel.registry.foundation.boundaries,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

const ruleNames = Object.freeze([
  "Stable Identity Rule", "Namespace Rule", "Registry Reference Rule",
  "Ownership Preservation Rule", "Lifecycle Reference Rule", "Capability Reference Rule",
  "Boundary Preservation Rule", "Structural Composition Rule",
  "Relationship Integrity Rule", "Graph Consistency Rule", "Compatibility Rule",
  "Inventory Derivation Rule", "Public Export Rule", "Immutability Rule",
  "Dependency Rule", "Canonical Inventory Rule Compliance",
] as const);

export const GraphVisualizationValidationRules: readonly GraphVisualizationValidationRule[] =
  Object.freeze(ruleNames.map((name, index) => Object.freeze({
    id: `EVE-3:4/Rule/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative Graph Visualization Model requirement for ${name}.`,
    category: categoryNames[index]!,
    severity: "Error",
    expectedOutcome: "Passed",
    modelReference: GraphVisualizationModel.metadata.id,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })));
