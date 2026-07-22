import type { ChartMetricVisualizationManifestGuarantee } from "./chartMetricVisualizationManifestTypes.ts";
import { ChartMetricVisualizationValidationPlatform } from "./chartMetricVisualizationValidation.ts";

const guaranteeNames = Object.freeze([
  "Foundation preserved", "Registry preserved", "Model preserved", "Validation preserved",
  "Canonical composition preserved", "Canonical references preserved",
  "Inventory preservation guaranteed", "Compatibility preservation guaranteed",
  "Dependency integrity guaranteed", "Metadata immutability guaranteed",
  "Public surface integrity guaranteed", "ReadyForPlatform guaranteed",
] as const);

export const ChartMetricVisualizationManifestGuarantees:
readonly ChartMetricVisualizationManifestGuarantee[] = Object.freeze(guaranteeNames.map(
  (name, index) => Object.freeze({
    id: `EVE-5:5/Guarantee/${name.replaceAll(" ", "")}` as const,
    name,
    description: `Declarative Manifest guarantee: ${name}.`,
    guaranteed: true as const,
    evidenceReference: ChartMetricVisualizationValidationPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
