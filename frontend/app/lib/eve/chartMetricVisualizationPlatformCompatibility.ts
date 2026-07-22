import { ChartMetricVisualizationManifestPlatform } from "./chartMetricVisualizationManifest.ts";
import type { ChartMetricVisualizationPlatformCompatibilityEntry } from "./chartMetricVisualizationPlatformTypes.ts";

const manifest = ChartMetricVisualizationManifestPlatform;
const composition = manifest.composition;
const compatibilitySources = Object.freeze([
  ["Foundation compatibility", composition[0]!.canonicalReference, composition[0]!.canonicalSource],
  ["Registry compatibility", composition[1]!.canonicalReference, composition[1]!.canonicalSource],
  ["Model compatibility", composition[2]!.canonicalReference, composition[2]!.canonicalSource],
  ["Validation compatibility", composition[3]!.canonicalReference, composition[3]!.canonicalSource],
  ["Manifest compatibility", manifest.metadata.id, manifest],
  ["Namespace compatibility", manifest.metadata.namespace, manifest.metadata],
  ["Public surface compatibility", manifest.metadata.id, manifest],
  ["Certification compatibility", manifest.metadata.id, manifest],
] as const);

export const ChartMetricVisualizationPlatformCompatibility:
readonly ChartMetricVisualizationPlatformCompatibilityEntry[] = Object.freeze(
  compatibilitySources.map(([name, canonicalReference, canonicalSource], index) =>
    Object.freeze({
      id: `EVE-5:6/Compatibility/${name.replaceAll(" ", "")}` as const,
      name,
      compatible: true as const,
      canonicalReference,
      canonicalSource,
      deterministicOrder: index + 1,
      runtimeVerification: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    })),
);
