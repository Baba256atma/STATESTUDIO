import { TimelineVisualizationCertificationPlatform } from "./timelineVisualizationCertification.ts";
import type { TimelineVisualizationFreezeRegistryEntry } from "./timelineVisualizationFreezeTypes.ts";

const certification = TimelineVisualizationCertificationPlatform;
const platformEntries = certification.platform.composition;

export const TimelineVisualizationFreezeRegistry:
readonly TimelineVisualizationFreezeRegistryEntry[] = Object.freeze([
  ...platformEntries.map((entry, index) => Object.freeze({
    id: `EVE-4:8/Registry/${entry.phase}`,
    phase: entry.phase,
    canonicalReference: entry,
    certificationReference: certification.metadata.id,
    deterministicOrder: index + 1,
    preservedByReference: true,
    immutable: true,
  })),
  Object.freeze({
    id: "EVE-4:8/Registry/Certification",
    phase: "Certification",
    canonicalReference: certification,
    certificationReference: certification.metadata.id,
    deterministicOrder: platformEntries.length + 1,
    preservedByReference: true,
    immutable: true,
  }),
]);
