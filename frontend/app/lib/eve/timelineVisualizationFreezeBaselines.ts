import { TimelineVisualizationCertificationPlatform } from "./timelineVisualizationCertification.ts";
import type { TimelineVisualizationFrozenBaseline } from "./timelineVisualizationFreezeTypes.ts";

const certification = TimelineVisualizationCertificationPlatform;
const composition = certification.platform.composition;
const baselineSources = Object.freeze([
  ["Foundation baseline", composition[0]],
  ["Registry baseline", composition[1]],
  ["Model baseline", composition[2]],
  ["Validation baseline", composition[3]],
  ["Manifest baseline", composition[4]],
  ["Platform baseline", certification.platform],
  ["Certification baseline", certification],
  ["Freeze baseline", "EVE-4:8/TimelineVisualizationFreeze"],
] as const);

export const TimelineVisualizationFrozenBaselines:
readonly TimelineVisualizationFrozenBaseline[] = Object.freeze(
  baselineSources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-4:8/Baseline/${name.replaceAll(" ", "")}`,
    name,
    canonicalReference,
    preservedByReference: true,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
