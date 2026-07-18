/**
 * DKL-2:8 — Freeze Baseline.
 *
 * One immutable architectural baseline capturing the exact certified counts of
 * the complete DKL-2 platform. Every value is derived from, or verified against,
 * the approved public surfaces of DKL-2:1 through DKL-2:7. Two distinct artifact
 * semantics are preserved without recalculation:
 *   - platformMetadataArtifactCount (DKL-2:6 public metadata, covering 2:1..2:5)
 *   - physicalPhaseArtifactCountThroughDKL26 (explicit per-phase file total)
 *
 * Ownership: owned exclusively by DKL-2:8.
 * Dependency rules: consumes DKL-2:5/2:6/2:7 public modules and the DKL-2:8 types.
 */

import {
  DataSourceKnowledgeInventoryManifest,
  DataSourceKnowledgeRegistryManifestSummary,
} from "./dataSourceKnowledgeRegistryManifestPlatform.ts";
import { DataSourceKnowledgePlatformMetadata } from "./dataSourceKnowledgeRegistryPlatformIndex.ts";
import { DataSourceKnowledgeCertificationSummary } from "./dataSourceKnowledgeCertificationPlatform.ts";
import { type FreezeBaselineDescriptor } from "./dataSourceKnowledgeFreezeTypes.ts";

const inventory = DataSourceKnowledgeInventoryManifest;
const registryInventory = inventory.registry;
const totalRegistryEntryCount =
  registryInventory.dataSourceEntries +
  registryInventory.knowledgeEntries +
  registryInventory.connectorEntries +
  registryInventory.contentEntries +
  registryInventory.sourceGroupEntries +
  registryInventory.compatibilityRelationships;

// Explicit, immutable architectural metadata: the physical DKL-2 phase-file
// total across DKL-2:1 through DKL-2:6 (7 + 8 + 9 + 9 + 8 + 7). A declared count.
const physicalPhaseArtifactCountThroughDKL26 = 7 + 8 + 9 + 9 + 8 + 7;

export const DataSourceKnowledgeFreezeBaseline: FreezeBaselineDescriptor =
  Object.freeze<FreezeBaselineDescriptor>({
    baselineStatus: "BaselineLocked",
    foundation: Object.freeze({
      dataSourceCategoryCount: inventory.foundation.dataSourceCategories,
      knowledgeCategoryCount: inventory.foundation.knowledgeCategories,
      connectorCategoryCount: inventory.foundation.connectorCategories,
      contentCategoryCount: inventory.foundation.contentCategories,
      metadataCategoryCount: inventory.foundation.metadataCategories,
      sourceGroupCount: inventory.foundation.sourceGroups,
    }),
    registry: Object.freeze({
      dataSourceEntryCount: registryInventory.dataSourceEntries,
      knowledgeEntryCount: registryInventory.knowledgeEntries,
      connectorEntryCount: registryInventory.connectorEntries,
      contentEntryCount: registryInventory.contentEntries,
      sourceGroupEntryCount: registryInventory.sourceGroupEntries,
      compatibilityRelationshipCount: registryInventory.compatibilityRelationships,
      totalRegistryEntryCount,
    }),
    model: Object.freeze({
      identityModelCount: inventory.model.identityModels,
      dataSourceModelCount: inventory.model.dataSourceModels,
      knowledgeModelCount: inventory.model.knowledgeModels,
      connectorModelCount: inventory.model.connectorModels,
      compatibilityModelCount: inventory.model.compatibilityModels,
      totalModelCount: inventory.model.totalModels,
    }),
    validation: Object.freeze({
      validationCategoryCount: inventory.validation.categories,
      validationRuleCount: inventory.validation.rules,
      validationPassCount: inventory.validation.pass,
      validationFailCount: inventory.validation.fail,
      validationWarningCount: inventory.validation.warning,
      validationStatus: inventory.validation.status,
    }),
    manifest: Object.freeze({
      manifestSectionCount: DataSourceKnowledgeRegistryManifestSummary.sectionCount,
      guaranteeCount: DataSourceKnowledgeRegistryManifestSummary.guaranteeCount,
      manifestStatus: DataSourceKnowledgeRegistryManifestSummary.status,
    }),
    platform: Object.freeze({
      platformPhaseCount: DataSourceKnowledgePlatformMetadata.dependency.length,
      platformMetadataArtifactCount: DataSourceKnowledgePlatformMetadata.artifactCount,
      physicalPhaseArtifactCountThroughDKL26,
      platformStatus: "PlatformComplete",
    }),
    certification: Object.freeze({
      certificationComponentCount: DataSourceKnowledgeCertificationSummary.componentCount,
      certificationGateCount: DataSourceKnowledgeCertificationSummary.gateCount,
      certificationEvidenceCount: DataSourceKnowledgeCertificationSummary.evidenceCount,
      certificationCompatibilityCount: DataSourceKnowledgeCertificationSummary.compatibilityCount,
      certificationStatus: DataSourceKnowledgeCertificationSummary.status,
    }),
    metadataOnly: true,
    immutable: true,
  });
