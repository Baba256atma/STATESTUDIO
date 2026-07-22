import { GraphVisualizationCertification } from "./graphVisualizationCertification.ts";
import type { GraphVisualizationFreezeRegistryEntry } from "./graphVisualizationFreezeTypes.ts";

const platformEntries = GraphVisualizationCertification.platform.metadata.composition;

export const GraphVisualizationFreezeRegistry:
readonly GraphVisualizationFreezeRegistryEntry[] = Object.freeze([
  ...platformEntries.map((entry, index) => Object.freeze({
    id: `EVE-3:8/Registry/${entry.phase}`,
    phase: entry.phase,
    canonicalReference: entry,
    certificationReference: GraphVisualizationCertification.metadata.id,
    deterministicOrder: index + 1,
    preservedByReference: true,
    immutable: true,
  })),
  Object.freeze({
    id: "EVE-3:8/Registry/Certification",
    phase: "Certification",
    canonicalReference: GraphVisualizationCertification,
    certificationReference: GraphVisualizationCertification.metadata.id,
    deterministicOrder: platformEntries.length + 1,
    preservedByReference: true,
    immutable: true,
  }),
]);
