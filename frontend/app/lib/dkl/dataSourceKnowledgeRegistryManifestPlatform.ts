/**
 * DKL-2:5 — Data Source & Knowledge Registry Manifest Platform.
 *
 * The single canonical, immutable, metadata-only aggregate root for the DKL-2
 * platform manifest. It aggregates — by reference — the DKL-2:1 foundation, the
 * DKL-2:2 registry platform, the DKL-2:3 model platform, and the DKL-2:4
 * validation platform, alongside the derived phase, inventory, dependency,
 * compatibility, guarantee, release-readiness, and summary manifests. It
 * publishes exactly eight runtime public APIs.
 *
 * Responsibility: publish the authoritative DKL-2 architectural record.
 * Ownership: owned exclusively by DKL-2:5.
 * Dependency rules: consumes DKL-2:1/2:2/2:3/2:4 only through their public APIs.
 * Architectural purpose: the release-oriented DKL-2 manifest. Zero runtime
 * behavior: no I/O, no network, no reflection, no async, no side effects.
 */

import { DataSourceKnowledgeCompatibilityManifest } from "./dataSourceKnowledgeCompatibilityManifest.ts";
import { DataSourceKnowledgeDependencyManifest } from "./dataSourceKnowledgeDependencyManifest.ts";
import { DataSourceKnowledgeGuaranteeManifest } from "./dataSourceKnowledgeGuaranteeManifest.ts";
import { DataSourceKnowledgeInventoryManifest } from "./dataSourceKnowledgeInventoryManifest.ts";
import { DataSourceKnowledgePhaseManifest } from "./dataSourceKnowledgePhaseManifest.ts";
import { DataSourceKnowledgeRegistryFoundation } from "./dataSourceKnowledgeRegistryFoundation.ts";
import { DataSourceKnowledgeRegistryPlatform } from "./dataSourceKnowledgeRegistryPlatform.ts";
import { DataSourceRegistryModelPlatform } from "./dataSourceRegistryModelPlatform.ts";
import { DataSourceKnowledgeValidationPlatform } from "./dataSourceKnowledgeValidationRunner.ts";
import {
  CANONICAL_MANIFEST_SECTIONS,
  MANIFEST_OWNER,
  MANIFEST_VERSION,
  MANIFEST_SOURCE_PHASE,
  type GuaranteeManifestEntry,
  type ManifestIdentityDescriptor,
  type ManifestSummaryDescriptor,
  type PhaseManifestEntry,
  type ReleaseReadinessDescriptor,
} from "./dataSourceKnowledgeManifestTypes.ts";

export { DataSourceKnowledgePhaseManifest } from "./dataSourceKnowledgePhaseManifest.ts";
export { DataSourceKnowledgeInventoryManifest } from "./dataSourceKnowledgeInventoryManifest.ts";
export { DataSourceKnowledgeDependencyManifest } from "./dataSourceKnowledgeDependencyManifest.ts";
export { DataSourceKnowledgeCompatibilityManifest } from "./dataSourceKnowledgeCompatibilityManifest.ts";
export { DataSourceKnowledgeGuaranteeManifest } from "./dataSourceKnowledgeGuaranteeManifest.ts";

const IDENTITY: ManifestIdentityDescriptor = Object.freeze({
  manifestId: "DKL-2:5",
  manifestVersion: MANIFEST_VERSION,
  manifestName: "Data Source & Knowledge Registry Manifest Platform",
  manifestNamespace: "nexora.dkl.dsk-registry.manifest",
  owner: MANIFEST_OWNER,
  sourcePhase: MANIFEST_SOURCE_PHASE,
  platformId: "DKL-2",
  platformVersion: "1.0.0",
  status: "ManifestComplete",
  readiness: "ReadyForPlatform",
  sections: CANONICAL_MANIFEST_SECTIONS,
  metadataOnly: true,
  immutable: true,
});

/** Immutable release-readiness declaration for the DKL-2 platform. */
export const DataSourceKnowledgeReleaseReadiness = Object.freeze({
  foundationStatus: "Complete",
  registryStatus: "Complete",
  modelStatus: "Complete",
  validationStatus: "ValidationCertified",
  manifestStatus: "ManifestComplete",
  blockingIssueCount: 0,
  warningCount: 0,
  certificationState: "ReadyForPlatform",
  readiness: "ReadyForPlatform",
  nextPhase: "DKL-2:6",
  metadataOnly: true,
  immutable: true,
} as const satisfies ReleaseReadinessDescriptor);

const registryInventory = DataSourceKnowledgeInventoryManifest.registry;
const registryEntryCount =
  registryInventory.dataSourceEntries +
  registryInventory.knowledgeEntries +
  registryInventory.connectorEntries +
  registryInventory.contentEntries +
  registryInventory.sourceGroupEntries +
  registryInventory.compatibilityRelationships;

const artifactCount = DataSourceKnowledgePhaseManifest.entries.reduce(
  (total, entry) => total + entry.artifactCount,
  0
);

/** Concise immutable summary of the DKL-2 manifest platform. */
export const DataSourceKnowledgeRegistryManifestSummary = Object.freeze({
  phaseCount: DataSourceKnowledgePhaseManifest.entries.length,
  sectionCount: CANONICAL_MANIFEST_SECTIONS.length,
  artifactCount,
  priorRuntimeExportCount: DataSourceKnowledgeInventoryManifest.publicSurface.totalPriorExports,
  registryEntryCount,
  modelCount: DataSourceKnowledgeInventoryManifest.model.totalModels,
  validationRuleCount: DataSourceKnowledgeInventoryManifest.validation.rules,
  validationPassCount: DataSourceKnowledgeInventoryManifest.validation.pass,
  guaranteeCount: DataSourceKnowledgeGuaranteeManifest.guarantees.length,
  status: "ManifestComplete",
  readiness: "ReadyForPlatform",
  nextPhase: "DKL-2:6",
  metadataOnly: true,
  deterministic: true,
  immutable: true,
} as const satisfies ManifestSummaryDescriptor);

/** The canonical, deeply frozen aggregate root for the DKL-2 manifest. */
export const DataSourceKnowledgeRegistryManifestPlatform = Object.freeze({
  identity: IDENTITY,
  foundation: DataSourceKnowledgeRegistryFoundation,
  registry: DataSourceKnowledgeRegistryPlatform,
  model: DataSourceRegistryModelPlatform,
  validation: DataSourceKnowledgeValidationPlatform,
  phaseInventory: DataSourceKnowledgePhaseManifest,
  inventory: DataSourceKnowledgeInventoryManifest,
  dependencyMap: DataSourceKnowledgeDependencyManifest,
  compatibility: DataSourceKnowledgeCompatibilityManifest,
  guarantees: DataSourceKnowledgeGuaranteeManifest,
  releaseReadiness: DataSourceKnowledgeReleaseReadiness,
  summary: DataSourceKnowledgeRegistryManifestSummary,
  getPhaseById: (phaseId: string): PhaseManifestEntry | undefined =>
    DataSourceKnowledgePhaseManifest.getByPhaseId(phaseId),
  getGuaranteeById: (guaranteeId: string): GuaranteeManifestEntry | undefined =>
    DataSourceKnowledgeGuaranteeManifest.getByGuaranteeId(guaranteeId),
  getInventorySummary: () => DataSourceKnowledgeInventoryManifest,
  getDependencySummary: () => DataSourceKnowledgeDependencyManifest,
  getCompatibilitySummary: () => DataSourceKnowledgeCompatibilityManifest,
  getReleaseReadinessSummary: () => DataSourceKnowledgeReleaseReadiness,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
