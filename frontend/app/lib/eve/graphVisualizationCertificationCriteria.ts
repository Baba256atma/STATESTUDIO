import { GraphVisualizationPlatform } from "./graphVisualizationPlatform.ts";
import type { GraphVisualizationCertificationCriterion } from "./graphVisualizationCertificationTypes.ts";

const criterionNames = Object.freeze([
  "Foundation Integrity Certified",
  "Registry Integrity Certified",
  "Model Integrity Certified",
  "Validation Integrity Certified",
  "Manifest Integrity Certified",
  "Platform Integrity Certified",
  "Canonical Composition Certified",
  "Canonical Reference Integrity Certified",
  "Inventory Integrity Certified",
  "Dependency Integrity Certified",
  "Compatibility Integrity Certified",
  "Metadata Immutability Certified",
  "Public Surface Certified",
  "Architectural Boundary Certified",
  "Canonical Inventory Rule Certified",
  "ReadyForFreeze Certified",
] as const);

export const GraphVisualizationCertificationCriteria:
readonly GraphVisualizationCertificationCriterion[] = Object.freeze(
  criterionNames.map((name, index) => Object.freeze({
    id: `EVE-3:7/Criterion/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative certification criterion: ${name}.`,
    platformReference: GraphVisualizationPlatform.metadata.id,
    status: "Certified",
    deterministicOrder: index + 1,
    verification: "DeclarativeOnly",
    metadataOnly: true,
    immutable: true,
  })),
);
