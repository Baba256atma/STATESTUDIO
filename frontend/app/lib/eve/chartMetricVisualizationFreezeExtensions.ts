import { ChartMetricVisualizationCertificationPlatform } from "./chartMetricVisualizationCertification.ts";
import type { ChartMetricVisualizationFreezeDeclaration } from "./chartMetricVisualizationFreezeTypes.ts";

const certification = ChartMetricVisualizationCertificationPlatform;
const composition = certification.platform.composition;
const extensionSources = Object.freeze([
  ["Foundation extension", composition[0]], ["Registry extension", composition[1]],
  ["Model extension", composition[2]], ["Validation extension", composition[3]],
  ["Manifest extension", composition[4]], ["Platform extension", certification.platform],
  ["Certification extension", certification], ["Public Index extension", certification.readiness],
] as const);

export const ChartMetricVisualizationFreezeExtensions:
readonly ChartMetricVisualizationFreezeDeclaration[] = Object.freeze(extensionSources.map(
  ([name, canonicalReference], index) => Object.freeze({
    id: `EVE-5:8/Extension/${name.replaceAll(" ", "")}` as const,
    name,
    canonicalReference,
    preservedByReference: true as const,
    deterministicOrder: index + 1,
    runtimeExecution: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
