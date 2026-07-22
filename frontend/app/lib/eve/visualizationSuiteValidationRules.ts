import { VisualizationSuiteModelPlatform } from "./visualizationSuiteModel.ts";
import type { VisualizationSuiteValidationRule } from "./visualizationSuiteValidationTypes.ts";

const categoryNames = Object.freeze([
  "Suite Identity Integrity", "Public Index Composition Integrity",
  "Registry Reference Integrity", "Model Completeness",
  "Relationship Integrity", "Ownership Consistency", "Boundary Compliance",
  "Lifecycle Consistency", "Capability Consistency",
  "Compatibility Consistency", "Namespace Integrity", "Dependency Compliance",
  "Inventory Consistency", "Canonical Inventory Rule Compliance",
] as const);

export const VisualizationSuiteValidationCategories = Object.freeze(
  categoryNames.map((name, index) => Object.freeze({
    id: `EVE-9:4/Category/${index + 1}` as const,
    name,
    description: `Declarative Visualization Suite validation category: ${name}.`,
    modelReference: VisualizationSuiteModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

const ruleNames = Object.freeze([
  "Stable suite identity", "Unique Public Index identities",
  "Registry reference validation", "Suite composition validation",
  "Required model descriptor validation", "Relationship completeness",
  "Ownership validation", "Boundary preservation", "Lifecycle correctness",
  "Capability validation", "Compatibility validation",
  "Namespace consistency", "Inventory derivation validation",
  "Dependency restriction validation",
] as const);

export const VisualizationSuiteValidationRules:
readonly VisualizationSuiteValidationRule[] = Object.freeze(ruleNames.map(
  (name, index) => Object.freeze({
    id: `EVE-9:4/Rule/${index + 1}` as const,
    name,
    categoryReference: VisualizationSuiteValidationCategories[index]!,
    description: `Declarative Visualization Suite Model requirement: ${name}.`,
    expectedOutcome: "Passed" as const,
    modelReference: VisualizationSuiteModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
