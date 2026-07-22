import { TimelineVisualizationPlatformPlatform } from "./timelineVisualizationPlatform.ts";
import type { TimelineVisualizationCertificationCriterion } from "./timelineVisualizationCertificationTypes.ts";

const criterionNames = Object.freeze([
  "Foundation Integrity Certified", "Registry Integrity Certified",
  "Model Integrity Certified", "Validation Integrity Certified",
  "Manifest Integrity Certified", "Platform Integrity Certified",
  "Canonical Composition Certified", "Canonical Reference Integrity Certified",
  "Inventory Integrity Certified", "Dependency Integrity Certified",
  "Compatibility Integrity Certified", "Metadata Immutability Certified",
  "Public Surface Certified", "Architectural Boundary Certified",
  "Canonical Inventory Rule Certified", "ReadyForFreeze Certified",
] as const);

export const TimelineVisualizationCertificationCriteria:
readonly TimelineVisualizationCertificationCriterion[] = Object.freeze(
  criterionNames.map((name, index) => Object.freeze({
    id: `EVE-4:7/Criterion/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative certification criterion: ${name}.`,
    platformReference: TimelineVisualizationPlatformPlatform.metadata.id,
    status: "Certified",
    deterministicOrder: index + 1,
    verification: "DeclarativeOnly",
    metadataOnly: true,
    immutable: true,
  })),
);
