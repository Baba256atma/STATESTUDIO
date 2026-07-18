/**
 * DKL-2:8 — Data Source & Knowledge Registry Freeze Platform.
 *
 * The single canonical, immutable, metadata-only release-lock root for the
 * complete DKL-2 Data Source & Knowledge Registry Platform. It declares the
 * certified architecture Frozen, Stable, and ReadyForPublicIndex, and aggregates
 * — by reference — the freeze identity, frozen-component registry, architectural
 * baseline, compatibility policies, extension locks, guarantees, manifest, and
 * summary. It publishes exactly eight runtime public APIs.
 *
 * This is an architectural release lock, not a runtime lock: it defines the
 * official compatibility and release policy, adds no registry entries, models,
 * validation rules, manifests, or runtime behavior, and renames nothing.
 *
 * Ownership: owned exclusively by DKL-2:8.
 * Dependency rules: consumes DKL-2:1..2:7 only through approved public modules.
 * Forward-only, cycle-free, public-API-only. Zero runtime behavior: no I/O, no
 * network, no reflection, no async, no side effects.
 */

import { DataSourceKnowledgeInventoryManifest } from "./dataSourceKnowledgeRegistryManifestPlatform.ts";
import {
  DataSourceKnowledgeCertificationPlatform,
  DataSourceKnowledgeCertificationSummary,
} from "./dataSourceKnowledgeCertificationPlatform.ts";
import { DataSourceKnowledgeRegistryPlatform as Dkl26CompletePlatform } from "./dataSourceKnowledgeRegistryPlatformIndex.ts";

import { DataSourceKnowledgeFreezeBaseline } from "./dataSourceKnowledgeFreezeBaseline.ts";
import { DataSourceKnowledgeFreezeCompatibility } from "./dataSourceKnowledgeFreezeCompatibility.ts";
import {
  DataSourceKnowledgeFreezeGuarantees,
  DataSourceKnowledgeFreezeLocks,
} from "./dataSourceKnowledgeFreezeLocks.ts";
import { DataSourceKnowledgeFreezeManifest } from "./dataSourceKnowledgeFreezeManifest.ts";
import { DataSourceKnowledgeFreezeRegistry } from "./dataSourceKnowledgeFreezeRegistry.ts";
import {
  FREEZE_OWNER,
  FREEZE_VERSION,
  type FreezeIdentityDescriptor,
  type FreezePlatformDescriptor,
  type FreezeSummaryDescriptor,
} from "./dataSourceKnowledgeFreezeTypes.ts";

export { DataSourceKnowledgeFreezeRegistry } from "./dataSourceKnowledgeFreezeRegistry.ts";
export { DataSourceKnowledgeFreezeBaseline } from "./dataSourceKnowledgeFreezeBaseline.ts";
export { DataSourceKnowledgeFreezeCompatibility } from "./dataSourceKnowledgeFreezeCompatibility.ts";
export { DataSourceKnowledgeFreezeLocks, DataSourceKnowledgeFreezeGuarantees } from "./dataSourceKnowledgeFreezeLocks.ts";
export { DataSourceKnowledgeFreezeManifest } from "./dataSourceKnowledgeFreezeManifest.ts";

const registryInventory = DataSourceKnowledgeInventoryManifest.registry;
const registryEntryCount =
  registryInventory.dataSourceEntries +
  registryInventory.knowledgeEntries +
  registryInventory.connectorEntries +
  registryInventory.contentEntries +
  registryInventory.sourceGroupEntries +
  registryInventory.compatibilityRelationships;

const IDENTITY: FreezeIdentityDescriptor = Object.freeze<FreezeIdentityDescriptor>({
  freezeId: "DKL-2:8",
  freezeVersion: FREEZE_VERSION,
  freezeName: "Data Source & Knowledge Registry Freeze Platform",
  freezeNamespace: "nexora.dkl.dsk-registry.freeze",
  platformId: "DKL-2",
  platformVersion: "1.0.0",
  owner: FREEZE_OWNER,
  sourcePhase: "DKL-2:8",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  stability: "StableAndFrozen",
  readiness: "ReadyForPublicIndex",
  metadataOnly: true,
  immutable: true,
});

/** Concise, immutable summary of the DKL-2 freeze. */
export const DataSourceKnowledgeFreezeSummary: FreezeSummaryDescriptor =
  Object.freeze<FreezeSummaryDescriptor>({
    frozenComponentCount: DataSourceKnowledgeFreezeRegistry.components.length,
    frozenRuntimeApiCount: DataSourceKnowledgeFreezeRegistry.frozenRuntimeApiCount,
    registryEntryCount,
    modelCount: DataSourceKnowledgeInventoryManifest.model.totalModels,
    validationPassCount: DataSourceKnowledgeInventoryManifest.validation.pass,
    certificationGateCount: DataSourceKnowledgeCertificationSummary.gateCount,
    compatibilityDeclarationCount: DataSourceKnowledgeFreezeCompatibility.declarations.length,
    extensionLockCount: DataSourceKnowledgeFreezeLocks.locks.length,
    guaranteeCount: DataSourceKnowledgeFreezeGuarantees.guarantees.length,
    blockingIssueCount: 0,
    warningCount: 0,
    status: "Frozen",
    stability: "StableAndFrozen",
    readiness: "ReadyForPublicIndex",
    nextPhase: "DKL-2:9",
    metadataOnly: true,
    deterministic: true,
    immutable: true,
  });

/**
 * The canonical, deeply frozen aggregate root for the DKL-2 freeze.
 *
 * In addition to the eight release-lock sections declared by the freeze
 * descriptor, this root exposes — strictly by reference — the DKL-2:6 complete
 * aggregate platform (`certifiedPlatform`) and the DKL-2:7 certification platform
 * (`certification`). This is an additive, backward-compatible extension (no new
 * runtime exports, no renames) that lets the DKL-2:9 Public Index reference every
 * canonical phase surface through the freeze platform alone.
 */
export const DataSourceKnowledgeFreezePlatform: FreezePlatformDescriptor & {
  readonly certifiedPlatform: typeof Dkl26CompletePlatform;
  readonly certification: typeof DataSourceKnowledgeCertificationPlatform;
} = Object.freeze({
  identity: IDENTITY,
  registry: DataSourceKnowledgeFreezeRegistry,
  baseline: DataSourceKnowledgeFreezeBaseline,
  compatibility: DataSourceKnowledgeFreezeCompatibility,
  locks: DataSourceKnowledgeFreezeLocks,
  guarantees: DataSourceKnowledgeFreezeGuarantees,
  manifest: DataSourceKnowledgeFreezeManifest,
  summary: DataSourceKnowledgeFreezeSummary,
  certifiedPlatform: Dkl26CompletePlatform,
  certification: DataSourceKnowledgeCertificationPlatform,
  metadataOnly: true,
  runtimeFree: true,
  deterministic: true,
  immutable: true,
});
