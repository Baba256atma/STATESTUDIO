/**
 * DKL-2:6 — Platform Metadata.
 *
 * Immutable metadata describing the complete Data Source & Knowledge Registry
 * Platform. All quantitative fields (artifactCount, runtimeExportCount) are
 * derived deterministically by aggregating the DKL-2:6 platform registry.
 *
 * Ownership: owned exclusively by DKL-2:6.
 * Dependency rules: depends only on the DKL-2:6 platform registry and types.
 */

import { DataSourceKnowledgePlatformRegistry } from "./dataSourceKnowledgePlatformRegistry.ts";
import {
  PLATFORM_OWNER,
  PLATFORM_VERSION,
  type PlatformMetadataDescriptor,
} from "./dataSourceKnowledgePlatformTypes.ts";

const aggregatedArtifactCount: number = DataSourceKnowledgePlatformRegistry.phases.reduce(
  (total, phase) => total + phase.artifactCount,
  0,
);

const aggregatedRuntimeExportCount: number = DataSourceKnowledgePlatformRegistry.phases.reduce(
  (total, phase) => total + phase.runtimeExportCount,
  0,
);

export const DataSourceKnowledgePlatformMetadata: PlatformMetadataDescriptor =
  Object.freeze<PlatformMetadataDescriptor>({
    platformId: "DKL-2 Data Source & Knowledge Registry Platform",
    version: PLATFORM_VERSION,
    owner: PLATFORM_OWNER,
    namespace: "dkl.data-source-knowledge.registry.platform",
    releaseStage: "AggregatedPlatform",
    readiness: "ReadyForCertification",
    dependency: Object.freeze(["DKL-2:1", "DKL-2:2", "DKL-2:3", "DKL-2:4", "DKL-2:5"]),
    artifactCount: aggregatedArtifactCount,
    runtimeExportCount: aggregatedRuntimeExportCount,
    metadataOnly: true,
    immutable: true,
  });
