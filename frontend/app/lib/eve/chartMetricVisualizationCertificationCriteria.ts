import { ChartMetricVisualizationPlatform } from "./chartMetricVisualizationPlatform.ts";
import type { ChartMetricVisualizationCertificationCriterion } from "./chartMetricVisualizationCertificationTypes.ts";

const criterionNames = Object.freeze([
  "Foundation integrity certified", "Registry integrity certified",
  "Model integrity certified", "Validation integrity certified",
  "Manifest integrity certified", "Platform integrity certified",
  "Canonical composition certified", "Canonical references certified",
  "Inventory derivation certified", "Public surface certified", "Compatibility certified",
  "Dependency isolation certified", "Metadata immutability certified",
  "Canonical Inventory Rule certified", "Architecture completeness certified",
  "Freeze readiness certified",
] as const);

export const ChartMetricVisualizationCertificationCriteria:
readonly ChartMetricVisualizationCertificationCriterion[] = Object.freeze(criterionNames.map(
  (name, index) => Object.freeze({
    id: `EVE-5:7/Criterion/${name.replaceAll(" ", "")}` as const,
    name,
    description: `Declarative certification criterion: ${name}.`,
    platformReference: ChartMetricVisualizationPlatform.metadata.id,
    status: "Certified" as const,
    deterministicOrder: index + 1,
    verification: "DeclarativeOnly" as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
