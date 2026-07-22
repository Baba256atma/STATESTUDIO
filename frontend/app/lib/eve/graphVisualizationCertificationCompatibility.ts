import { GraphVisualizationPlatform } from "./graphVisualizationPlatform.ts";
import type { GraphVisualizationCertificationCompatibilityEntry } from "./graphVisualizationCertificationTypes.ts";

const composition = GraphVisualizationPlatform.metadata.composition;
const verificationSources = Object.freeze([
  ["Foundation compatibility verified", composition[0]!.canonicalReference],
  ["Registry compatibility verified", composition[1]!.canonicalReference],
  ["Model compatibility verified", composition[2]!.canonicalReference],
  ["Validation compatibility verified", composition[3]!.canonicalReference],
  ["Manifest compatibility verified", composition[4]!.canonicalReference],
  ["Platform compatibility verified", GraphVisualizationPlatform.metadata.id],
  ["Namespace compatibility verified", GraphVisualizationPlatform.metadata.namespace],
  ["Public API compatibility verified", GraphVisualizationPlatform.metadata.id],
] as const);

export const GraphVisualizationCertificationCompatibility:
readonly GraphVisualizationCertificationCompatibilityEntry[] = Object.freeze(
  verificationSources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-3:7/Compatibility/${name.replaceAll(" ", "")}`,
    name,
    verified: true,
    canonicalReference,
    deterministicOrder: index + 1,
    runtimeVerification: false,
    metadataOnly: true,
    immutable: true,
  })),
);
