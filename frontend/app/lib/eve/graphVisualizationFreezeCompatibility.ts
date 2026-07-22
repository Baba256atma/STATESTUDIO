import { GraphVisualizationCertification } from "./graphVisualizationCertification.ts";
import type { GraphVisualizationFreezeDeclaration } from "./graphVisualizationFreezeTypes.ts";

const composition = GraphVisualizationCertification.platform.metadata.composition;
const compatibilitySources = Object.freeze([
  ["Foundation compatibility preserved", composition[0]],
  ["Registry compatibility preserved", composition[1]],
  ["Model compatibility preserved", composition[2]],
  ["Validation compatibility preserved", composition[3]],
  ["Manifest compatibility preserved", composition[4]],
  ["Platform compatibility preserved", GraphVisualizationCertification.platform],
  ["Certification compatibility preserved", GraphVisualizationCertification],
  ["Public Index compatibility preserved", GraphVisualizationCertification.metadata.readinessMetadata],
] as const);

export const GraphVisualizationFreezeCompatibility:
readonly GraphVisualizationFreezeDeclaration[] = Object.freeze(
  compatibilitySources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-3:8/Compatibility/${name.replaceAll(" ", "")}`,
    name,
    canonicalReference,
    preservedByReference: true,
    deterministicOrder: index + 1,
    runtimeExecution: false,
    metadataOnly: true,
    immutable: true,
  })),
);
