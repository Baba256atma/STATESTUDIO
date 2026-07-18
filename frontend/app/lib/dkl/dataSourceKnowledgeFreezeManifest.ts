/**
 * DKL-2:8 — Freeze Manifest.
 *
 * One immutable freeze manifest aggregating the deterministic counts of the
 * frozen components, frozen runtime APIs, compatibility policies, extension
 * locks, and freeze guarantees. All counts are derived by reference from the
 * DKL-2:8 canonical containers.
 *
 * Ownership: owned exclusively by DKL-2:8.
 * Dependency rules: depends only on the DKL-2:8 freeze registry, compatibility,
 * locks, and types.
 */

import { DataSourceKnowledgeFreezeCompatibility } from "./dataSourceKnowledgeFreezeCompatibility.ts";
import {
  DataSourceKnowledgeFreezeGuarantees,
  DataSourceKnowledgeFreezeLocks,
} from "./dataSourceKnowledgeFreezeLocks.ts";
import { DataSourceKnowledgeFreezeRegistry } from "./dataSourceKnowledgeFreezeRegistry.ts";
import {
  FREEZE_OWNER,
  FREEZE_VERSION,
  type FreezeManifestDescriptor,
} from "./dataSourceKnowledgeFreezeTypes.ts";

export const DataSourceKnowledgeFreezeManifest: FreezeManifestDescriptor =
  Object.freeze<FreezeManifestDescriptor>({
    freezeId: "DKL-2:8",
    version: FREEZE_VERSION,
    name: "Data Source & Knowledge Registry Freeze Platform",
    owner: FREEZE_OWNER,
    sourcePhases: Object.freeze([
      "DKL-2:1",
      "DKL-2:2",
      "DKL-2:3",
      "DKL-2:4",
      "DKL-2:5",
      "DKL-2:6",
      "DKL-2:7",
    ]),
    dependencies: Object.freeze([
      "dataSourceKnowledgeRegistryFoundation.ts",
      "dataSourceKnowledgeRegistryPlatform.ts",
      "dataSourceRegistryModelPlatform.ts",
      "dataSourceKnowledgeValidationRunner.ts",
      "dataSourceKnowledgeRegistryManifestPlatform.ts",
      "dataSourceKnowledgeRegistryPlatformIndex.ts",
      "dataSourceKnowledgeCertificationPlatform.ts",
    ]),
    frozenComponentCount: DataSourceKnowledgeFreezeRegistry.components.length,
    frozenRuntimeApiCount: DataSourceKnowledgeFreezeRegistry.frozenRuntimeApiCount,
    compatibilityDeclarationCount: DataSourceKnowledgeFreezeCompatibility.declarations.length,
    extensionLockCount: DataSourceKnowledgeFreezeLocks.locks.length,
    guaranteeCount: DataSourceKnowledgeFreezeGuarantees.guarantees.length,
    baselineStatus: "BaselineLocked",
    certificationStatus: "Certified",
    freezeStatus: "Frozen",
    stability: "StableAndFrozen",
    blockingIssueCount: 0,
    warningCount: 0,
    metadataOnly: true,
    runtimeFree: true,
    deterministic: true,
    immutable: true,
    readiness: "ReadyForPublicIndex",
    nextPhase: "DKL-2:9",
  });
