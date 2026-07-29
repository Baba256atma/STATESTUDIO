/**
 * EX-1:8 — Executive Stage Freeze Registry.
 *
 * Read-only registry of frozen components, architectural locks,
 * compatibility, release metadata, baselines, and extensions.
 *
 * Ownership: owned exclusively by EX-1:8.
 */

import {
  ExecutiveStageArchitecturalLockNames,
  ExecutiveStageArchitecturalLocks,
  ExecutiveStageFreezeLock,
  EXECUTIVE_STAGE_LOCK,
} from "./executiveStageArchitecturalLocks.ts";
import { ExecutiveStageFreezeCompatibility } from "./executiveStageCompatibility.ts";
import { ExecutiveStageFreezeExtensionPolicy } from "./executiveStageExtensions.ts";
import {
  ExecutiveStageFrozenBaselineCatalog,
  ExecutiveStageFrozenBaselineNames,
  ExecutiveStageFrozenBaselines,
} from "./executiveStageFrozenBaselines.ts";
import {
  ExecutiveStageFreezeComposition,
  ExecutiveStageFreezeIdentity,
  ExecutiveStageFrozenPublicContracts,
  ExecutiveStageReleaseMetadata,
  ExecutiveStageReleaseMetadataFields,
} from "./executiveStageReleaseMetadata.ts";

/**
 * Canonical Freeze registry — read-only.
 */
export const ExecutiveStageFreezeRegistry = Object.freeze({
  registryId: "EX-1:8/FreezeRegistry",
  sourcePhase: "EX-1:8" as const,
  identity: ExecutiveStageFreezeIdentity,
  lockIdentifier: EXECUTIVE_STAGE_LOCK,
  lock: ExecutiveStageFreezeLock,
  frozenComponents: ExecutiveStageFreezeComposition,
  architecturalLocks: ExecutiveStageArchitecturalLocks,
  architecturalLockNames: ExecutiveStageArchitecturalLockNames,
  compatibility: ExecutiveStageFreezeCompatibility,
  releaseMetadata: ExecutiveStageReleaseMetadata,
  releaseMetadataFields: ExecutiveStageReleaseMetadataFields,
  baselines: ExecutiveStageFrozenBaselines,
  baselineNames: ExecutiveStageFrozenBaselineNames,
  baselineCatalog: ExecutiveStageFrozenBaselineCatalog,
  extensions: ExecutiveStageFreezeExtensionPolicy,
  publicContracts: ExecutiveStageFrozenPublicContracts,
  baselinesPublished: Object.freeze({
    architecturalLocks: ExecutiveStageArchitecturalLocks.length,
    frozenBaselines: ExecutiveStageFrozenBaselines.length,
    compatibilityTargets:
      ExecutiveStageFreezeCompatibility.declarationCount,
    extensionCategories: ExecutiveStageFreezeExtensionPolicy.categoryCount,
    publicContractIdentities: ExecutiveStageFrozenPublicContracts.length,
    releaseMetadataFields: ExecutiveStageReleaseMetadataFields.length,
  }),
  readOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
