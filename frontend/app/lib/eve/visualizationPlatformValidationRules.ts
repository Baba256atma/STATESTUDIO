import { VisualizationPlatformModelPlatform } from "./visualizationPlatformModel.ts";
import type { VisualizationPlatformValidationRule } from "./visualizationPlatformValidationTypes.ts";

const categoryNames = Object.freeze([
  "Identity Integrity", "Module Composition Integrity",
  "Registry Reference Integrity", "Model Completeness",
  "Relationship Integrity", "Ownership Consistency", "Boundary Compliance",
  "Lifecycle Consistency", "Capability Consistency",
  "Compatibility Consistency", "Namespace Integrity", "Dependency Compliance",
  "Inventory Consistency", "Canonical Inventory Rule Compliance",
] as const);

export const VisualizationPlatformValidationCategories = Object.freeze(
  categoryNames.map((name, index) => Object.freeze({
    id: `EVE-8:4/Category/${index + 1}` as const,
    name,
    description: `Declarative Visualization Platform validation category: ${name}.`,
    modelReference: VisualizationPlatformModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

const ruleNames = Object.freeze([
  "Stable identities", "Unique module identities", "Registry references",
  "Platform composition", "Required model descriptors",
  "Relationship completeness", "Ownership validity", "Boundary preservation",
  "Lifecycle correctness", "Capability references", "Compatibility references",
  "Namespace consistency", "Inventory derivation", "Dependency restrictions",
] as const);

export const VisualizationPlatformValidationRules:
readonly VisualizationPlatformValidationRule[] = Object.freeze(ruleNames.map(
  (name, index) => Object.freeze({
    id: `EVE-8:4/Rule/${index + 1}` as const,
    name,
    categoryReference: VisualizationPlatformValidationCategories[index]!,
    description: `Declarative Visualization Platform Model requirement: ${name}.`,
    expectedOutcome: "Passed" as const,
    modelReference: VisualizationPlatformModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
