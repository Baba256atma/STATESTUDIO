import { TimelineVisualizationManifestPlatform } from "./timelineVisualizationManifest.ts";
import type { TimelineVisualizationPlatformGuarantee } from "./timelineVisualizationPlatformTypes.ts";

const guaranteeNames = Object.freeze([
  "Foundation preserved", "Registry preserved", "Model preserved", "Validation preserved",
  "Manifest preserved", "Canonical composition preserved", "Canonical references preserved",
  "Dependency integrity preserved", "Compatibility preserved",
  "Metadata immutability preserved", "Dynamic inventories preserved", "ReadyForCertification",
] as const);

export const TimelineVisualizationPlatformGuarantees:
readonly TimelineVisualizationPlatformGuarantee[] = Object.freeze(
  guaranteeNames.map((name, index) => Object.freeze({
    id: `EVE-4:6/Guarantee/${name.replaceAll(" ", "")}`,
    name,
    guaranteed: true,
    manifestReference: TimelineVisualizationManifestPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
