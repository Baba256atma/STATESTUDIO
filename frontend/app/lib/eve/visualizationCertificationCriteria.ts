import { VisualizationPlatform } from "./visualizationPlatform.ts";
import type { VisualizationCertificationCriterion } from "./visualizationCertificationTypes.ts";

const names = Object.freeze([
  "Platform Identity Integrity", "Platform Composition Integrity",
  "Dependency Integrity", "Canonical Reference Preservation",
  "Inventory Consistency", "Capability Consistency", "Guarantee Consistency",
  "Compatibility Consistency", "Public Export Consistency",
  "Namespace Integrity", "Architectural Boundary Compliance",
  "Canonical Inventory Rule Compliance", "Metadata Immutability",
  "Version Consistency", "Release Consistency", "Readiness Completeness",
] as const);

export const VisualizationCertificationCriteria: readonly VisualizationCertificationCriterion[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-1:7/Criterion/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative EVE certification criterion for ${name}.`,
    platformReference: VisualizationPlatform.metadata.id,
    expectedResult: "Certified",
    deterministicOrder: index + 1,
    verification: "DeclarativeOnly",
    metadataOnly: true,
    immutable: true,
  })));

