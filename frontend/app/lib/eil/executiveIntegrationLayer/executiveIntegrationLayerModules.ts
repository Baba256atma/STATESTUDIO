/**
 * EIL-9:1 — Executive Integration Layer Modules.
 *
 * Exactly one layer module referencing the EIL-8 Public Index only.
 * Composition metadata only. No runtime integration.
 * No direct references to EIL-1 through EIL-7.
 *
 * Ownership: owned exclusively by EIL-9:1.
 */

import {
  ExecutiveIntegrationSuiteConsumerEntry,
  ExecutiveIntegrationSuitePublicApiCount,
  ExecutiveIntegrationSuitePublicIndex,
  ExecutiveIntegrationSuitePublicIndexIdentity,
  ExecutiveIntegrationSuitePublicReadiness,
  ExecutiveIntegrationSuitePublicRelease,
} from "../executiveIntegrationSuite/executiveIntegrationSuitePublicIndex.ts";

/** Closed layer-module key vocabulary. */
export type LayerModuleKey = "ExecutiveIntegrationSuite";

/** Immutable layer module membership descriptor. */
export interface ExecutiveIntegrationLayerModule {
  readonly moduleId: "EIL-9:1/Module/ExecutiveIntegrationSuite";
  readonly moduleKey: LayerModuleKey;
  readonly canonicalName: string;
  readonly stageId: string;
  readonly publicIndexId: string;
  readonly publicIndexName: string;
  readonly publicIndexNamespace: string;
  readonly publicIndexVersion: string;
  readonly publicIndexModule: string;
  readonly publicIndexEntryPoint: string;
  readonly publicApiCount: number;
  readonly suiteReleaseStatus: "Released";
  readonly suiteCertification: "Certified";
  readonly suiteFreeze: "Frozen";
  readonly suiteStability: "Stable";
  readonly suiteReadiness: typeof ExecutiveIntegrationSuitePublicReadiness;
  readonly suiteLockId: string;
  readonly suiteConsumerEntry: string;
  readonly publicIndexAggregate: typeof ExecutiveIntegrationSuitePublicIndex;
  readonly publicIndexIdentity: typeof ExecutiveIntegrationSuitePublicIndexIdentity;
  readonly referencesPublicIndexOnly: true;
  readonly bypassesPublicIndex: false;
  readonly reconstructsUpstream: false;
  readonly duplicatesArchitecture: false;
  readonly referencesEil1ThroughEil7Directly: false;
  readonly order: number;
  readonly status: "Declared";
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly one layer module. References EIL-8 Public Index only.
 */
export const ExecutiveIntegrationLayerModules: readonly ExecutiveIntegrationLayerModule[] =
  Object.freeze([
    Object.freeze({
      moduleId: "EIL-9:1/Module/ExecutiveIntegrationSuite" as const,
      moduleKey: "ExecutiveIntegrationSuite" as const,
      canonicalName: "Executive Integration Suite",
      stageId: "EIL-8:9",
      publicIndexId: ExecutiveIntegrationSuitePublicIndexIdentity.canonicalId,
      publicIndexName: ExecutiveIntegrationSuitePublicIndexIdentity.name,
      publicIndexNamespace:
        ExecutiveIntegrationSuitePublicIndexIdentity.namespace,
      publicIndexVersion: ExecutiveIntegrationSuitePublicIndexIdentity.version,
      publicIndexModule: "executiveIntegrationSuitePublicIndex.ts",
      publicIndexEntryPoint:
        "frontend/app/lib/eil/executiveIntegrationSuite/executiveIntegrationSuitePublicIndex",
      publicApiCount: ExecutiveIntegrationSuitePublicApiCount,
      suiteReleaseStatus: ExecutiveIntegrationSuitePublicRelease.release,
      suiteCertification: ExecutiveIntegrationSuitePublicRelease.certification,
      suiteFreeze: ExecutiveIntegrationSuitePublicRelease.freeze,
      suiteStability: ExecutiveIntegrationSuitePublicRelease.stability,
      suiteReadiness: ExecutiveIntegrationSuitePublicReadiness,
      suiteLockId: ExecutiveIntegrationSuitePublicIndexIdentity.lockId,
      suiteConsumerEntry: ExecutiveIntegrationSuiteConsumerEntry.entryPoint,
      publicIndexAggregate: ExecutiveIntegrationSuitePublicIndex,
      publicIndexIdentity: ExecutiveIntegrationSuitePublicIndexIdentity,
      referencesPublicIndexOnly: true as const,
      bypassesPublicIndex: false as const,
      reconstructsUpstream: false as const,
      duplicatesArchitecture: false as const,
      referencesEil1ThroughEil7Directly: false as const,
      order: 1,
      status: "Declared" as const,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ]);
