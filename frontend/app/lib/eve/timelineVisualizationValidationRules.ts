import { TimelineVisualizationModelPlatform } from "./timelineVisualizationModel.ts";
import type { TimelineVisualizationValidationRule } from "./timelineVisualizationValidationTypes.ts";

const categoryNames = Object.freeze([
  "Identity Validation", "Namespace Validation", "Model Integrity Validation",
  "Registry Reference Validation", "Foundation Reference Validation",
  "Timeline Structure Validation", "Temporal Relationship Validation",
  "Ownership Validation", "Lifecycle Validation", "Capability Validation",
  "Boundary Validation", "Compatibility Validation", "Inventory Validation",
  "Metadata Validation", "Public Surface Validation", "Canonical Inventory Rule Validation",
] as const);

export const TimelineVisualizationValidationCategories = Object.freeze(
  categoryNames.map((name, index) => Object.freeze({
    id: `EVE-4:4/Category/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative architectural verification category: ${name}.`,
    modelReference: TimelineVisualizationModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

const ruleNames = Object.freeze([
  "Stable identities required", "Canonical namespace required",
  "Registry references preserved", "Foundation references preserved",
  "Structural composition complete", "Relationship consistency preserved",
  "Ownership preserved", "Lifecycle consistency preserved", "Capabilities preserved",
  "Architectural boundaries preserved", "Compatibility preserved", "Metadata immutable",
  "Dynamic inventory derivation required", "Public exports verified",
  "Deterministic ordering required", "Canonical Inventory Rule satisfied",
] as const);

export const TimelineVisualizationValidationRules:
readonly TimelineVisualizationValidationRule[] = Object.freeze(
  ruleNames.map((name, index) => Object.freeze({
    id: `EVE-4:4/Rule/${name.replaceAll(" ", "")}`,
    name,
    categoryReference: TimelineVisualizationValidationCategories[index]!,
    description: `Declarative Timeline Visualization Model requirement: ${name}.`,
    expectedOutcome: "Passed",
    modelReference: TimelineVisualizationModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })),
);
