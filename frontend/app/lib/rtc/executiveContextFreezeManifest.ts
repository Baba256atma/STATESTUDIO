/**
 * RTC-1:8 — Executive Context Freeze Manifest.
 *
 * Assembles locks, baselines, compatibility, public API and metadata
 * into the sealed Freeze package description.
 *
 * Ownership: owned exclusively by RTC-1:8.
 */

import {
  ExecutiveContextFreezeBaselineCatalog,
  ExecutiveContextFreezeBaselines,
} from "./executiveContextFreezeBaselines.ts";
import {
  ExecutiveContextFreezeCompatibility,
  ExecutiveContextFreezeCompatibilityDeclarations,
} from "./executiveContextFreezeCompatibility.ts";
import {
  ExecutiveContextArchitecturalLocks,
  ExecutiveContextFreezeLock,
  EXECUTIVE_CONTEXT_RUNTIME_LOCK,
} from "./executiveContextFreezeLock.ts";
import {
  ExecutiveContextFreezeIdentity,
  ExecutiveContextFreezeMetadata,
  ExecutiveContextFreezeReleaseStatuses,
} from "./executiveContextFreezeMetadata.ts";
import { ExecutiveContextFreezePublicApi } from "./executiveContextFreezePublicApi.ts";
import { ExecutiveContextRuntimeCertification } from "./executiveContextRuntimeCertification.ts";

/**
 * Sealed Freeze manifest package.
 */
export const ExecutiveContextFreezeManifest = Object.freeze({
  manifestId: "RTC-1:8/FreezeManifest",
  identity: ExecutiveContextFreezeIdentity,
  lock: ExecutiveContextFreezeLock,
  lockIdentifier: EXECUTIVE_CONTEXT_RUNTIME_LOCK,
  architecturalLocks: ExecutiveContextArchitecturalLocks,
  baselines: ExecutiveContextFreezeBaselines,
  baselineCatalog: ExecutiveContextFreezeBaselineCatalog,
  compatibility: ExecutiveContextFreezeCompatibility,
  compatibilityDeclarations: ExecutiveContextFreezeCompatibilityDeclarations,
  publicApi: ExecutiveContextFreezePublicApi,
  metadata: ExecutiveContextFreezeMetadata,
  releaseStatuses: ExecutiveContextFreezeReleaseStatuses,
  sourceCertification: ExecutiveContextRuntimeCertification.identity.id,
  baselinesPublished: Object.freeze({
    canonicalRuntimeLock: 1 as const,
    architecturalLocks: ExecutiveContextArchitecturalLocks.length,
    frozenBaselines: ExecutiveContextFreezeBaselines.length,
    compatibilityDeclarations:
      ExecutiveContextFreezeCompatibilityDeclarations.length,
    releaseStatusValues: ExecutiveContextFreezeReleaseStatuses.length,
    freezeMetadataGroups: ExecutiveContextFreezeMetadata.metadataGroups.length,
    publicApiRegistry: "Dynamic" as const,
  }),
  sealed: true as const,
  mutationAllowed: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
