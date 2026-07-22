import { AnimationEffectsModelPlatform } from "./animationEffectsModel.ts";
import type { AnimationEffectsValidationRule } from "./animationEffectsValidationTypes.ts";

const categoryNames = Object.freeze([
  "Identity Integrity", "Registry Reference Integrity", "Model Completeness",
  "Relationship Integrity", "Ownership Consistency", "Boundary Compliance",
  "Lifecycle Consistency", "Capability Consistency", "Extension Compatibility",
  "Inventory Consistency", "Namespace Integrity", "Public Export Consistency",
  "Dependency Compliance", "Canonical Inventory Rule Compliance",
] as const);

export const AnimationEffectsValidationCategories = Object.freeze(
  categoryNames.map((name, index) => Object.freeze({
    id: `EVE-7:4/Category/${index + 1}` as const,
    name,
    description: `Declarative architectural validation category: ${name}.`,
    modelReference: AnimationEffectsModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

export const AnimationEffectsValidationRules:
readonly AnimationEffectsValidationRule[] = Object.freeze(categoryNames.map(
  (name, index) => Object.freeze({
    id: `EVE-7:4/Rule/${index + 1}` as const,
    name: `${name} Rule`,
    categoryReference: AnimationEffectsValidationCategories[index]!,
    description: `Declarative Animation & Effects Model requirement: ${name}.`,
    expectedOutcome: "Passed" as const,
    modelReference: AnimationEffectsModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
