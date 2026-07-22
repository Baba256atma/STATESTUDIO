import { ChartMetricVisualizationCertificationPlatform } from "./chartMetricVisualizationCertification.ts";
import type { ChartMetricVisualizationFrozenBaseline } from "./chartMetricVisualizationFreezeTypes.ts";

const certification = ChartMetricVisualizationCertificationPlatform;
const composition = certification.platform.composition;
const baselineSources = Object.freeze([
  ["Foundation baseline", composition[0]], ["Registry baseline", composition[1]],
  ["Model baseline", composition[2]], ["Validation baseline", composition[3]],
  ["Manifest baseline", composition[4]], ["Platform baseline", certification.platform],
  ["Certification baseline", certification],
  ["Chart & Metric Visualization architecture baseline", certification],
] as const);

export const ChartMetricVisualizationFrozenBaselines:
readonly ChartMetricVisualizationFrozenBaseline[] = Object.freeze(baselineSources.map(
  ([name, canonicalReference], index) => Object.freeze({
    id: `EVE-5:8/Baseline/${name.replaceAll(" ", "").replaceAll("&", "And")}` as const,
    name,
    canonicalReference,
    preservedByReference: true as const,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
