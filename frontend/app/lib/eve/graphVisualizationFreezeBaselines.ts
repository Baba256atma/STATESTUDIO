import { GraphVisualizationCertification } from "./graphVisualizationCertification.ts";
import type { GraphVisualizationFrozenBaseline } from "./graphVisualizationFreezeTypes.ts";

const composition = GraphVisualizationCertification.platform.metadata.composition;
const baselineSources = Object.freeze([
  ["Foundation baseline", composition[0]],
  ["Registry baseline", composition[1]],
  ["Model baseline", composition[2]],
  ["Validation baseline", composition[3]],
  ["Manifest baseline", composition[4]],
  ["Platform baseline", GraphVisualizationCertification.platform],
  ["Certification baseline", GraphVisualizationCertification],
  ["Graph Visualization architecture baseline", GraphVisualizationCertification.inventory],
] as const);

export const GraphVisualizationFrozenBaselines:
readonly GraphVisualizationFrozenBaseline[] = Object.freeze(
  baselineSources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-3:8/Baseline/${name.replaceAll(" ", "")}`,
    name,
    canonicalReference,
    preservedByReference: true,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
