import { TimelineVisualizationValidationPlatform } from "./timelineVisualizationValidation.ts";
import type { TimelineVisualizationManifestGuarantee } from "./timelineVisualizationManifestTypes.ts";

const guaranteeNames = Object.freeze([
  "Foundation preserved", "Registry preserved", "Model preserved", "Validation preserved",
  "Canonical phase composition preserved", "Canonical references preserved",
  "Canonical inventories preserved", "Dependency integrity preserved",
  "Compatibility preserved", "Architectural boundaries preserved",
  "Metadata immutability preserved", "ReadyForPlatform",
] as const);

export const TimelineVisualizationManifestGuarantees:
readonly TimelineVisualizationManifestGuarantee[] = Object.freeze(
  guaranteeNames.map((name, index) => Object.freeze({
    id: `EVE-4:5/Guarantee/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative Manifest guarantee: ${name}.`,
    guaranteed: true,
    evidenceReference: TimelineVisualizationValidationPlatform.metadata.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
