import { VisualizationCertification } from "./visualizationCertification.ts";
import type { VisualizationFreezeRegistryEntry } from "./visualizationFreezeTypes.ts";

const upstreamEntries: readonly VisualizationFreezeRegistryEntry[] = Object.freeze(
  VisualizationCertification.platform.metadata.composition.map((entry, index) =>
    Object.freeze({
      id: `EVE-1:8/Registry/${entry.phase}`,
      phase: entry.phase,
      canonicalReference: entry.canonicalReference,
      source: "VisualizationCertification",
      deterministicOrder: index + 1,
      copiesMetadata: false,
      immutable: true,
    })),
);

export const VisualizationFreezeRegistry = Object.freeze({
  id: "EVE-1:8/FreezeRegistry",
  entries: Object.freeze([
    ...upstreamEntries,
    Object.freeze({
      id: "EVE-1:8/Registry/Certification",
      phase: "Certification",
      canonicalReference: VisualizationCertification.metadata.id,
      source: "VisualizationCertification",
      deterministicOrder: upstreamEntries.length + 1,
      copiesMetadata: false,
      immutable: true,
    }),
  ]),
  frozenInventory: VisualizationCertification.inventory,
  inventoryPreservedByReference: true,
  recalculatesInventory: false,
  hardcodesInventoryCounts: false,
  duplicatesCertificationMetadata: false,
  modifiesCertifiedArchitecture: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

