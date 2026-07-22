import { VisualizationPlatformPlatform } from "./visualizationPlatformPlatform.ts";
import type { VisualizationPlatformCertificationCriterion } from "./visualizationPlatformCertificationTypes.ts";

const criterionNames = Object.freeze([
  "Platform identity integrity", "Phase composition integrity",
  "Foundation preservation", "Registry preservation", "Model preservation",
  "Validation preservation", "Manifest preservation", "Dependency integrity",
  "Canonical reference integrity", "Inventory consistency",
  "Capability consistency", "Guarantee consistency", "Compatibility consistency",
  "Namespace integrity", "Canonical Inventory Rule compliance",
  "Architectural boundary compliance",
] as const);

export const VisualizationPlatformCertificationCriteria:
readonly VisualizationPlatformCertificationCriterion[] = Object.freeze(
  criterionNames.map((name, index) => Object.freeze({
    id: `EVE-8:7/Criterion/${index + 1}` as const,
    name,
    description: `Declarative certification criterion: ${name}.`,
    platformReference: VisualizationPlatformPlatform.metadata.id,
    status: "Certified" as const,
    deterministicOrder: index + 1,
    verification: "DeclarativeOnly" as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
