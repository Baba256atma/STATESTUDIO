import { SceneRenderingCertification } from "./sceneRenderingCertification.ts";
import type { SceneRenderingFreezeRegistryEntry } from "./sceneRenderingFreezeTypes.ts";

const upstreamEntries: readonly SceneRenderingFreezeRegistryEntry[] = Object.freeze(
  SceneRenderingCertification.platform.metadata.composition.map((entry, index) => Object.freeze({
    id: `EVE-2:8/Registry/${entry.phase}`,
    phase: entry.phase,
    canonicalReference: entry.canonicalReference,
    source: "SceneRenderingCertification",
    deterministicOrder: index + 1,
    copiesMetadata: false,
    immutable: true,
  })),
);

export const SceneRenderingFreezeRegistry = Object.freeze({
  id: "EVE-2:8/FreezeRegistry",
  entries: Object.freeze([
    ...upstreamEntries,
    Object.freeze({
      id: "EVE-2:8/Registry/Certification",
      phase: "Certification",
      canonicalReference: SceneRenderingCertification.metadata.id,
      source: "SceneRenderingCertification",
      deterministicOrder: upstreamEntries.length + 1,
      copiesMetadata: false,
      immutable: true,
    }),
  ]),
  frozenInventory: SceneRenderingCertification.inventory,
  frozenCriteria: SceneRenderingCertification.criteria,
  frozenGates: SceneRenderingCertification.gates,
  inventoryPreservedByReference: true,
  certificationCollectionsPreservedByReference: true,
  recalculatesInventory: false,
  hardcodesInventoryTotals: false,
  duplicatesCertificationMetadata: false,
  reconstructsUpstreamCollections: false,
  modifiesCertifiedArchitecture: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
