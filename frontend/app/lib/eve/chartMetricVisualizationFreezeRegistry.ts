import { ChartMetricVisualizationCertificationPlatform } from "./chartMetricVisualizationCertification.ts";
import type { ChartMetricVisualizationFreezeRegistryEntry } from "./chartMetricVisualizationFreezeTypes.ts";

const certification = ChartMetricVisualizationCertificationPlatform;
const platformEntries = certification.platform.composition;

export const ChartMetricVisualizationFreezeRegistry:
readonly ChartMetricVisualizationFreezeRegistryEntry[] = Object.freeze([
  ...platformEntries.map((entry, index) => Object.freeze({
    id: `EVE-5:8/Registry/${entry.phase}` as const,
    phase: entry.phase,
    canonicalReference: entry,
    certificationReference: certification.metadata.id,
    deterministicOrder: index + 1,
    preservedByReference: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
  Object.freeze({
    id: "EVE-5:8/Registry/Certification" as const,
    phase: "Certification",
    canonicalReference: certification,
    certificationReference: certification.metadata.id,
    deterministicOrder: platformEntries.length + 1,
    preservedByReference: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
]);
