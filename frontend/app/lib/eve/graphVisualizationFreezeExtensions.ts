import { GraphVisualizationCertification } from "./graphVisualizationCertification.ts";
import type { GraphVisualizationFreezeDeclaration } from "./graphVisualizationFreezeTypes.ts";

const composition = GraphVisualizationCertification.platform.metadata.composition;
const extensionSources = Object.freeze([
  ["Foundation extension", composition[0]],
  ["Registry extension", composition[1]],
  ["Model extension", composition[2]],
  ["Validation extension", composition[3]],
  ["Manifest extension", composition[4]],
  ["Platform extension", GraphVisualizationCertification.platform],
  ["Certification extension", GraphVisualizationCertification],
  ["Public Index extension", GraphVisualizationCertification.metadata.readinessMetadata],
] as const);

export const GraphVisualizationFreezeExtensions:
readonly GraphVisualizationFreezeDeclaration[] = Object.freeze(
  extensionSources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-3:8/Extension/${name.replaceAll(" ", "")}`,
    name,
    canonicalReference,
    preservedByReference: true,
    deterministicOrder: index + 1,
    runtimeExecution: false,
    metadataOnly: true,
    immutable: true,
  })),
);
