import { ChartMetricVisualizationManifestPlatform } from "./chartMetricVisualizationManifest.ts";
import type { ChartMetricVisualizationPlatformGuarantee } from "./chartMetricVisualizationPlatformTypes.ts";

const guaranteeNames = Object.freeze([
  "Foundation preserved", "Registry preserved", "Model preserved", "Validation preserved",
  "Manifest preserved", "Canonical composition preserved", "Canonical references preserved",
  "Canonical inventories preserved", "Compatibility preserved",
  "Dependency integrity preserved", "Metadata immutability preserved",
  "ReadyForCertification guaranteed",
] as const);

export const ChartMetricVisualizationPlatformGuarantees:
readonly ChartMetricVisualizationPlatformGuarantee[] = Object.freeze(guaranteeNames.map(
  (name, index) => Object.freeze({
    id: `EVE-5:6/Guarantee/${name.replaceAll(" ", "")}` as const,
    name,
    guaranteed: true as const,
    manifestReference: ChartMetricVisualizationManifestPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
