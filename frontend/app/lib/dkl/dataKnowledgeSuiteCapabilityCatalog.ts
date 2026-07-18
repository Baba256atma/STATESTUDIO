/**
 * DKL-9:1 — Data Knowledge Suite Capability Catalog.
 *
 * Catalog of DKL-1 through DKL-8 capabilities composed exclusively through
 * their Public Indexes. Preserves canonical Public Index references.
 *
 * Ownership: owned exclusively by DKL-9:1.
 */

import {
  DataKnowledgeFoundationPublicApiRegistry,
  DataKnowledgeFoundationPublicIndexId,
  DataKnowledgeFoundationPublicIndexName,
  DataKnowledgeFoundationPublicIndexNamespace,
  DataKnowledgeFoundationPublicIndexVersion,
  DataKnowledgeFoundationPublicPlatform,
} from "./dataKnowledgeFoundationPublicIndex.ts";
import {
  DataSourceKnowledgeRegistryPublicApiRegistry,
  DataSourceKnowledgeRegistryPublicIndexId,
  DataSourceKnowledgeRegistryPublicIndexName,
  DataSourceKnowledgeRegistryPublicIndexNamespace,
  DataSourceKnowledgeRegistryPublicIndexVersion,
  DataSourceKnowledgeRegistryPublicPlatform,
} from "./dataSourceKnowledgeRegistryPublicIndex.ts";
import {
  DataUnderstandingPublicIndexId,
  DataUnderstandingPublicIndexName,
  DataUnderstandingPublicIndexNamespace,
  DataUnderstandingPublicIndexVersion,
  DataUnderstandingPlatformPublicFoundation,
  getDataUnderstandingPublicApiCount,
} from "./dataUnderstandingPublicIndex.ts";
import {
  getKnowledgeModelingPublicApiCount,
  KnowledgeModelingPlatformPublicFoundation,
  KnowledgeModelingPublicIndexId,
  KnowledgeModelingPublicIndexName,
  KnowledgeModelingPublicIndexNamespace,
  KnowledgeModelingPublicIndexVersion,
} from "./knowledgeModelingPublicIndex.ts";
import {
  getKnowledgeValidationPublicApiCount,
  KnowledgeValidationPlatformPublicFoundation,
  KnowledgeValidationPublicIndexId,
  KnowledgeValidationPublicIndexName,
  KnowledgeValidationPublicIndexNamespace,
  KnowledgeValidationPublicIndexVersion,
} from "./knowledgeValidationPublicIndex.ts";
import {
  getKnowledgeRepositoryPublicApiCount,
  KnowledgeRepositoryPlatformPublicFoundation,
  KnowledgeRepositoryPublicIndexId,
  KnowledgeRepositoryPublicIndexName,
  KnowledgeRepositoryPublicIndexNamespace,
  KnowledgeRepositoryPublicIndexVersion,
} from "./knowledgeRepositoryPublicIndex.ts";
import {
  getKnowledgeServicesPublicApiCount,
  KnowledgeServicesPlatformPublicFoundation,
  KnowledgeServicesPublicIndexId,
  KnowledgeServicesPublicIndexName,
  KnowledgeServicesPublicIndexNamespace,
  KnowledgeServicesPublicIndexVersion,
} from "./knowledgeServicesPublicIndex.ts";
import {
  getKnowledgeGovernancePublicApiCount,
  KnowledgeGovernancePlatformPublicFoundation,
  KnowledgeGovernancePublicIndexId,
  KnowledgeGovernancePublicIndexName,
  KnowledgeGovernancePublicIndexNamespace,
  KnowledgeGovernancePublicIndexVersion,
} from "./knowledgeGovernancePublicIndex.ts";
import type { DataKnowledgeSuiteCapabilityDescriptor } from "./dataKnowledgeSuiteFoundationTypes.ts";

const capability = (
  capabilityId: DataKnowledgeSuiteCapabilityDescriptor["capabilityId"],
  capabilityName: string,
  stageId: string,
  publicIndexId: string,
  publicIndexVersion: string,
  publicIndexName: string,
  publicIndexNamespace: string,
  publicApiCount: number,
  publicPlatform: unknown,
  order: number,
): DataKnowledgeSuiteCapabilityDescriptor =>
  Object.freeze({
    capabilityId,
    capabilityName,
    stageId,
    publicIndexId,
    publicIndexVersion,
    publicIndexName,
    publicIndexNamespace,
    publicApiCount,
    publicPlatform,
    integrationMode: "PublicIndexOnly" as const,
    introducesNewKnowledgeCapability: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly eight suite capabilities.
 * Public platforms preserved by canonical Public Index reference.
 */
export const DataKnowledgeSuiteCapabilityCatalog: readonly DataKnowledgeSuiteCapabilityDescriptor[] =
  Object.freeze([
    capability(
      "DKL-1",
      "Data Knowledge Foundation",
      "DKL-1:9",
      DataKnowledgeFoundationPublicIndexId,
      DataKnowledgeFoundationPublicIndexVersion,
      DataKnowledgeFoundationPublicIndexName,
      DataKnowledgeFoundationPublicIndexNamespace,
      DataKnowledgeFoundationPublicApiRegistry.releasedPublicApis,
      DataKnowledgeFoundationPublicPlatform,
      1,
    ),
    capability(
      "DKL-2",
      "Data Source & Knowledge Registry",
      "DKL-2:9",
      DataSourceKnowledgeRegistryPublicIndexId,
      DataSourceKnowledgeRegistryPublicIndexVersion,
      DataSourceKnowledgeRegistryPublicIndexName,
      DataSourceKnowledgeRegistryPublicIndexNamespace,
      DataSourceKnowledgeRegistryPublicApiRegistry.length,
      DataSourceKnowledgeRegistryPublicPlatform,
      2,
    ),
    capability(
      "DKL-3",
      "Data Understanding",
      "DKL-3:9",
      DataUnderstandingPublicIndexId,
      DataUnderstandingPublicIndexVersion,
      DataUnderstandingPublicIndexName,
      DataUnderstandingPublicIndexNamespace,
      getDataUnderstandingPublicApiCount(),
      DataUnderstandingPlatformPublicFoundation,
      3,
    ),
    capability(
      "DKL-4",
      "Knowledge Modeling",
      "DKL-4:9",
      KnowledgeModelingPublicIndexId,
      KnowledgeModelingPublicIndexVersion,
      KnowledgeModelingPublicIndexName,
      KnowledgeModelingPublicIndexNamespace,
      getKnowledgeModelingPublicApiCount(),
      KnowledgeModelingPlatformPublicFoundation,
      4,
    ),
    capability(
      "DKL-5",
      "Knowledge Validation",
      "DKL-5:9",
      KnowledgeValidationPublicIndexId,
      KnowledgeValidationPublicIndexVersion,
      KnowledgeValidationPublicIndexName,
      KnowledgeValidationPublicIndexNamespace,
      getKnowledgeValidationPublicApiCount(),
      KnowledgeValidationPlatformPublicFoundation,
      5,
    ),
    capability(
      "DKL-6",
      "Knowledge Repository",
      "DKL-6:9",
      KnowledgeRepositoryPublicIndexId,
      KnowledgeRepositoryPublicIndexVersion,
      KnowledgeRepositoryPublicIndexName,
      KnowledgeRepositoryPublicIndexNamespace,
      getKnowledgeRepositoryPublicApiCount(),
      KnowledgeRepositoryPlatformPublicFoundation,
      6,
    ),
    capability(
      "DKL-7",
      "Knowledge Services",
      "DKL-7:9",
      KnowledgeServicesPublicIndexId,
      KnowledgeServicesPublicIndexVersion,
      KnowledgeServicesPublicIndexName,
      KnowledgeServicesPublicIndexNamespace,
      getKnowledgeServicesPublicApiCount(),
      KnowledgeServicesPlatformPublicFoundation,
      7,
    ),
    capability(
      "DKL-8",
      "Knowledge Governance",
      "DKL-8:9",
      KnowledgeGovernancePublicIndexId,
      KnowledgeGovernancePublicIndexVersion,
      KnowledgeGovernancePublicIndexName,
      KnowledgeGovernancePublicIndexNamespace,
      getKnowledgeGovernancePublicApiCount(),
      KnowledgeGovernancePlatformPublicFoundation,
      8,
    ),
  ]);

/** Capability public API inventory derived only from Public Index surfaces. */
export const DataKnowledgeSuiteCapabilityPublicApiInventory = Object.freeze({
  inventoryId: "DKL-9:1/Inventory/CapabilityPublicApis",
  dkl1PublicApiCount: DataKnowledgeSuiteCapabilityCatalog[0]!.publicApiCount,
  dkl2PublicApiCount: DataKnowledgeSuiteCapabilityCatalog[1]!.publicApiCount,
  dkl3PublicApiCount: DataKnowledgeSuiteCapabilityCatalog[2]!.publicApiCount,
  dkl4PublicApiCount: DataKnowledgeSuiteCapabilityCatalog[3]!.publicApiCount,
  dkl5PublicApiCount: DataKnowledgeSuiteCapabilityCatalog[4]!.publicApiCount,
  dkl6PublicApiCount: DataKnowledgeSuiteCapabilityCatalog[5]!.publicApiCount,
  dkl7PublicApiCount: DataKnowledgeSuiteCapabilityCatalog[6]!.publicApiCount,
  dkl8PublicApiCount: DataKnowledgeSuiteCapabilityCatalog[7]!.publicApiCount,
  publicApiInventoryTotal: DataKnowledgeSuiteCapabilityCatalog.reduce(
    (total, item) => total + item.publicApiCount,
    0,
  ),
  capabilityCount: DataKnowledgeSuiteCapabilityCatalog.length,
  sourcedThroughPublicIndexes: true as const,
  reconstructed: false as const,
  hardcoded: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
