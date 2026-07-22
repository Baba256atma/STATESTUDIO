import { TimelineVisualizationCertificationPlatform } from "./timelineVisualizationCertification.ts";
import type { TimelineVisualizationFreezeDeclaration } from "./timelineVisualizationFreezeTypes.ts";

const certification = TimelineVisualizationCertificationPlatform;
const composition = certification.platform.composition;
const compatibilitySources = Object.freeze([
  ["Foundation preserved", composition[0]], ["Registry preserved", composition[1]],
  ["Model preserved", composition[2]], ["Validation preserved", composition[3]],
  ["Manifest preserved", composition[4]], ["Platform preserved", certification.platform],
  ["Certification preserved", certification], ["Public API preserved", certification.readiness],
] as const);

export const TimelineVisualizationFreezeCompatibility:
readonly TimelineVisualizationFreezeDeclaration[] = Object.freeze(
  compatibilitySources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-4:8/Compatibility/${name.replaceAll(" ", "")}`,
    name,
    canonicalReference,
    preservedByReference: true,
    deterministicOrder: index + 1,
    runtimeExecution: false,
    metadataOnly: true,
    immutable: true,
  })),
);
