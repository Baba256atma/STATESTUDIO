import { GraphVisualizationManifest } from "./graphVisualizationManifest.ts";
import type { GraphVisualizationPlatformCompatibilityEntry } from "./graphVisualizationPlatformTypes.ts";

const phaseComposition = GraphVisualizationManifest.composition;
const sources = Object.freeze([
  ["FoundationCompatibility", phaseComposition[0]!.canonicalReference, phaseComposition[0]!.canonicalPhase],
  ["RegistryCompatibility", phaseComposition[1]!.canonicalReference, phaseComposition[1]!.canonicalPhase],
  ["ModelCompatibility", phaseComposition[2]!.canonicalReference, phaseComposition[2]!.canonicalPhase],
  ["ValidationCompatibility", phaseComposition[3]!.canonicalReference, phaseComposition[3]!.canonicalPhase],
  ["ManifestCompatibility", GraphVisualizationManifest.metadata.id, GraphVisualizationManifest],
  ["NamespaceCompatibility", GraphVisualizationManifest.metadata.namespace, GraphVisualizationManifest.metadata],
  ["PublicSurfaceCompatibility", GraphVisualizationManifest.metadata.id, GraphVisualizationManifest],
  ["CertificationCompatibility", GraphVisualizationManifest.metadata.id, GraphVisualizationManifest],
] as const);

export const GraphVisualizationPlatformCompatibility:
readonly GraphVisualizationPlatformCompatibilityEntry[] = Object.freeze(
  sources.map(([name, canonicalReference, canonicalSource], index) => Object.freeze({
    id: `EVE-3:6/Compatibility/${name}`,
    name,
    compatible: true,
    canonicalReference,
    canonicalSource,
    deterministicOrder: index + 1,
    runtimeVerification: false,
    metadataOnly: true,
    immutable: true,
  })),
);
