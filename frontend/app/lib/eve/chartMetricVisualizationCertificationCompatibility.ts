import { ChartMetricVisualizationPlatform } from "./chartMetricVisualizationPlatform.ts";
import type { ChartMetricVisualizationCertificationCompatibilityEntry } from "./chartMetricVisualizationCertificationTypes.ts";

const platform = ChartMetricVisualizationPlatform;
const composition = platform.composition;
const verificationSources = Object.freeze([
  ["Foundation compatibility verified", composition[0]!.canonicalReference],
  ["Registry compatibility verified", composition[1]!.canonicalReference],
  ["Model compatibility verified", composition[2]!.canonicalReference],
  ["Validation compatibility verified", composition[3]!.canonicalReference],
  ["Manifest compatibility verified", composition[4]!.canonicalReference],
  ["Platform compatibility verified", platform.metadata.id],
  ["Namespace compatibility verified", platform.metadata.namespace],
  ["Freeze compatibility verified", platform.metadata.id],
] as const);

export const ChartMetricVisualizationCertificationCompatibility:
readonly ChartMetricVisualizationCertificationCompatibilityEntry[] = Object.freeze(
  verificationSources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-5:7/Compatibility/${name.replaceAll(" ", "")}` as const,
    name,
    verified: true as const,
    canonicalReference,
    deterministicOrder: index + 1,
    runtimeVerification: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
