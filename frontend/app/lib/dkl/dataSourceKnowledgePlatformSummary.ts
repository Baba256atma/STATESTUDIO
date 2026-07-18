/**
 * DKL-2:6 — Platform Summary.
 *
 * Immutable, deterministic summary of the complete Data Source & Knowledge
 * Registry Platform. All fields are derived by aggregating the DKL-2:6 platform
 * registry, the DKL-2:6 platform metadata, and the DKL-2:5 manifest public
 * surface. No runtime computation beyond deterministic aggregation.
 *
 * Ownership: owned exclusively by DKL-2:6.
 * Dependency rules: depends only on the DKL-2:6 registry/metadata/types and the
 * DKL-2:5 manifest public API.
 */

import {
  DataSourceKnowledgeRegistryManifestSummary,
  DataSourceKnowledgeReleaseReadiness,
} from "./dataSourceKnowledgeRegistryManifestPlatform.ts";
import { DataSourceKnowledgePlatformMetadata } from "./dataSourceKnowledgePlatformMetadata.ts";
import { DataSourceKnowledgePlatformRegistry } from "./dataSourceKnowledgePlatformRegistry.ts";
import { type PlatformSummaryDescriptor } from "./dataSourceKnowledgePlatformTypes.ts";

const completedPhases: readonly string[] = Object.freeze(
  DataSourceKnowledgePlatformRegistry.phases.map((phase) => phase.phaseId),
);

export const DataSourceKnowledgePlatformSummary: PlatformSummaryDescriptor =
  Object.freeze<PlatformSummaryDescriptor>({
    phaseCount: DataSourceKnowledgePlatformRegistry.phases.length,
    completedPhases,
    runtimeExportCount: DataSourceKnowledgePlatformMetadata.runtimeExportCount,
    artifactCount: DataSourceKnowledgePlatformMetadata.artifactCount,
    validationStatus: DataSourceKnowledgeReleaseReadiness.validationStatus,
    guaranteeCount: DataSourceKnowledgeRegistryManifestSummary.guaranteeCount,
    readiness: "ReadyForCertification",
    metadataOnly: true,
    deterministic: true,
    immutable: true,
  });
