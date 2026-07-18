/**
 * DKL-2:8 — Freeze Registry.
 *
 * Immutable registry of the eight frozen DKL-2 components (Foundation, Registry,
 * Model, Validation, Manifest, Platform, Certification, PublicSurfaceStrategy).
 * Each entry declares the frozen public module, the certification gate ids that
 * back the freeze, and the frozen runtime-API count for that surface. The total
 * frozen runtime API count is derived deterministically as the sum of the seven
 * module surfaces (52); the PublicSurfaceStrategy entry contributes zero modules.
 *
 * Ownership: owned exclusively by DKL-2:8.
 * Dependency rules: depends only on the DKL-2:8 freeze types.
 */

import {
  type FreezeComponentEntry,
  type FreezeRegistryContainer,
} from "./dataSourceKnowledgeFreezeTypes.ts";

const componentEntries: readonly FreezeComponentEntry[] = Object.freeze([
  Object.freeze<FreezeComponentEntry>({
    freezeEntryId: "FREEZE-FOUNDATION",
    componentName: "DKL-2 Foundation",
    componentKind: "Foundation",
    sourcePhase: "DKL-2:1",
    publicModule: "dataSourceKnowledgeRegistryFoundation.ts",
    certificationGateIds: Object.freeze(["GATE-FOUNDATION-COMPLETE"]),
    frozenApiCount: 7,
    freezeStatus: "Frozen",
    stability: "StableAndFrozen",
    ownershipStatus: "Protected",
    compatibilityStatus: "Compatible",
    readiness: "ReadyForPublicIndex",
  }),
  Object.freeze<FreezeComponentEntry>({
    freezeEntryId: "FREEZE-REGISTRY",
    componentName: "DKL-2 Registry",
    componentKind: "Registry",
    sourcePhase: "DKL-2:2",
    publicModule: "dataSourceKnowledgeRegistryPlatform.ts",
    certificationGateIds: Object.freeze(["GATE-REGISTRY-COMPLETE"]),
    frozenApiCount: 8,
    freezeStatus: "Frozen",
    stability: "StableAndFrozen",
    ownershipStatus: "Protected",
    compatibilityStatus: "Compatible",
    readiness: "ReadyForPublicIndex",
  }),
  Object.freeze<FreezeComponentEntry>({
    freezeEntryId: "FREEZE-MODEL",
    componentName: "DKL-2 Model",
    componentKind: "Model",
    sourcePhase: "DKL-2:3",
    publicModule: "dataSourceRegistryModelPlatform.ts",
    certificationGateIds: Object.freeze(["GATE-MODEL-COMPLETE"]),
    frozenApiCount: 9,
    freezeStatus: "Frozen",
    stability: "StableAndFrozen",
    ownershipStatus: "Protected",
    compatibilityStatus: "Compatible",
    readiness: "ReadyForPublicIndex",
  }),
  Object.freeze<FreezeComponentEntry>({
    freezeEntryId: "FREEZE-VALIDATION",
    componentName: "DKL-2 Validation",
    componentKind: "Validation",
    sourcePhase: "DKL-2:4",
    publicModule: "dataSourceKnowledgeValidationRunner.ts",
    certificationGateIds: Object.freeze(["GATE-VALIDATION-CERTIFIED"]),
    frozenApiCount: 7,
    freezeStatus: "Frozen",
    stability: "StableAndFrozen",
    ownershipStatus: "Protected",
    compatibilityStatus: "Compatible",
    readiness: "ReadyForPublicIndex",
  }),
  Object.freeze<FreezeComponentEntry>({
    freezeEntryId: "FREEZE-MANIFEST",
    componentName: "DKL-2 Manifest",
    componentKind: "Manifest",
    sourcePhase: "DKL-2:5",
    publicModule: "dataSourceKnowledgeRegistryManifestPlatform.ts",
    certificationGateIds: Object.freeze(["GATE-MANIFEST-COMPLETE"]),
    frozenApiCount: 8,
    freezeStatus: "Frozen",
    stability: "StableAndFrozen",
    ownershipStatus: "Protected",
    compatibilityStatus: "Compatible",
    readiness: "ReadyForPublicIndex",
  }),
  Object.freeze<FreezeComponentEntry>({
    freezeEntryId: "FREEZE-PLATFORM",
    componentName: "DKL-2 Platform",
    componentKind: "Platform",
    sourcePhase: "DKL-2:6",
    publicModule: "dataSourceKnowledgeRegistryPlatformIndex.ts",
    certificationGateIds: Object.freeze(["GATE-PLATFORM-COMPLETE"]),
    frozenApiCount: 6,
    freezeStatus: "Frozen",
    stability: "StableAndFrozen",
    ownershipStatus: "Protected",
    compatibilityStatus: "Compatible",
    readiness: "ReadyForPublicIndex",
  }),
  Object.freeze<FreezeComponentEntry>({
    freezeEntryId: "FREEZE-CERTIFICATION",
    componentName: "DKL-2 Certification",
    componentKind: "Certification",
    sourcePhase: "DKL-2:7",
    publicModule: "dataSourceKnowledgeCertificationPlatform.ts",
    certificationGateIds: Object.freeze([
      "GATE-REFERENCE-INTEGRITY-CERTIFIED",
      "GATE-PUBLIC-API-SURFACE-CERTIFIED",
    ]),
    frozenApiCount: 7,
    freezeStatus: "Frozen",
    stability: "StableAndFrozen",
    ownershipStatus: "Protected",
    compatibilityStatus: "Compatible",
    readiness: "ReadyForPublicIndex",
  }),
  Object.freeze<FreezeComponentEntry>({
    freezeEntryId: "FREEZE-PUBLIC-SURFACE-STRATEGY",
    componentName: "DKL-2 Public Surface Strategy",
    componentKind: "PublicSurfaceStrategy",
    sourcePhase: "DKL-2:7",
    publicModule: "dataSourceKnowledgeCertificationPlatform.ts",
    certificationGateIds: Object.freeze(["GATE-PUBLIC-SURFACE-AMBIGUITY-CONTROLLED"]),
    frozenApiCount: 0,
    freezeStatus: "Frozen",
    stability: "StableAndFrozen",
    ownershipStatus: "Protected",
    compatibilityStatus: "Compatible",
    readiness: "ReadyForPublicIndex",
  }),
]);

const frozenRuntimeApiCount = componentEntries.reduce(
  (total, entry) => total + entry.frozenApiCount,
  0,
);

const componentById: ReadonlyMap<string, FreezeComponentEntry> = new Map(
  componentEntries.map((entry) => [entry.freezeEntryId, entry]),
);

export const DataSourceKnowledgeFreezeRegistry: FreezeRegistryContainer =
  Object.freeze<FreezeRegistryContainer>({
    kind: "FreezeRegistry",
    components: componentEntries,
    frozenRuntimeApiCount,
    getComponentById: (freezeEntryId: string): FreezeComponentEntry | undefined =>
      componentById.get(freezeEntryId),
    metadataOnly: true,
    immutable: true,
  });
