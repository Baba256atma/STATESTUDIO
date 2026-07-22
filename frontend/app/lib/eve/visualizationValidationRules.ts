import { VisualizationModel } from "./visualizationModel.ts";
import type {
  VisualizationValidationCategory,
  VisualizationValidationGate,
  VisualizationValidationRule,
} from "./visualizationValidationTypes.ts";

const categories: readonly VisualizationValidationCategory[] = Object.freeze([
  "IdentityIntegrity", "RegistryReferenceIntegrity", "ModelCompleteness",
  "RelationshipConsistency", "OwnershipCorrectness", "LifecycleCompliance",
  "CapabilityIntegrity", "ExtensionCompatibility", "InventoryConsistency",
  "NamespaceIntegrity", "PublicExportConsistency", "DependencyCompliance",
  "ArchitecturalBoundaryEnforcement", "CanonicalInventoryRuleCompliance",
]);

export const VisualizationValidationCategories = Object.freeze(
  categories.map((name, index) => Object.freeze({
    id: `EVE-1:4/Category/${name}`,
    name,
    modelReference: VisualizationModel.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

export const VisualizationValidationRules: readonly VisualizationValidationRule[] =
  Object.freeze(categories.map((category, index) => Object.freeze({
    id: `EVE-1:4/Rule/${category}`,
    name: `${category} Rule`,
    description: `Declarative EVE validation requirement for ${category}.`,
    category,
    severity: "Error",
    expectedResult: "Compliant",
    modelReference: VisualizationModel.metadata.id,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })));

export const VisualizationValidationGates: readonly VisualizationValidationGate[] =
  Object.freeze(categories.map((category, index) => Object.freeze({
    id: `EVE-1:4/Gate/${category}`,
    name: `${category} Gate`,
    category,
    result: "Compliant",
    status: "Declared",
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })));

