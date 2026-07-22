import { VisualizationSuitePlatform } from "./visualizationSuitePlatform.ts";
import type { VisualizationSuiteCertificationCriterion } from "./visualizationSuiteCertificationTypes.ts";

const criterionNames = Object.freeze([
  "Platform identity integrity", "Phase composition integrity",
  "Foundation preservation", "Registry preservation", "Model preservation",
  "Validation preservation", "Manifest preservation", "Dependency integrity",
  "Canonical reference integrity", "Inventory consistency",
  "Capability consistency", "Guarantee consistency", "Compatibility consistency",
  "Namespace integrity", "Canonical Inventory Rule compliance",
  "Architectural boundary compliance",
] as const);

export const VisualizationSuiteCertificationCriteria:
readonly VisualizationSuiteCertificationCriterion[] = Object.freeze(
  criterionNames.map((name, index) => Object.freeze({
    id: `EVE-9:7/Criterion/${index + 1}` as const,
    name,
    description: `Declarative certification criterion: ${name}.`,
    platformReference: VisualizationSuitePlatform.metadata.id,
    status: "Certified" as const,
    deterministicOrder: index + 1,
    verification: "DeclarativeOnly" as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
