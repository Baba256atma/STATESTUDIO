/**
 * DKL-2:5 — Inventory Manifest.
 *
 * Authoritative immutable inventory of the DKL-2 platform, derived deterministic-
 * ally from approved public objects. Counts are aggregated by reference; prior-
 * phase arrays are never duplicated here.
 *
 * Ownership: owned exclusively by DKL-2:5.
 * Dependency rules: depends only on the DKL-2:1/2:2/2:3/2:4 public modules and
 * the DKL-2:5 manifest types.
 */

import * as foundationModule from "./dataSourceKnowledgeRegistryFoundation.ts";
import { DataSourceKnowledgeRegistryMetadata } from "./dataSourceKnowledgeRegistryFoundation.ts";
import * as registryModule from "./dataSourceKnowledgeRegistryPlatform.ts";
import {
  ConnectorTypeRegistry,
  ContentTypeRegistry,
  DataSourceRegistry,
  KnowledgeTypeRegistry,
  SourceGroupRegistry,
  SourceKnowledgeCompatibilityRegistry,
} from "./dataSourceKnowledgeRegistryPlatform.ts";
import * as modelModule from "./dataSourceRegistryModelPlatform.ts";
import { DataSourceRegistryModelManifest } from "./dataSourceRegistryModelPlatform.ts";
import * as validationModule from "./dataSourceKnowledgeValidationRunner.ts";
import { DataSourceKnowledgeValidationManifest } from "./dataSourceKnowledgeValidationRunner.ts";
import type { InventoryManifestDescriptor } from "./dataSourceKnowledgeManifestTypes.ts";

const foundationExports = Object.keys(foundationModule).length;
const registryExports = Object.keys(registryModule).length;
const modelExports = Object.keys(modelModule).length;
const validationExports = Object.keys(validationModule).length;

export const DataSourceKnowledgeInventoryManifest = Object.freeze({
  foundation: Object.freeze({
    dataSourceCategories: DataSourceKnowledgeRegistryMetadata.dataSourceCategories.length,
    knowledgeCategories: DataSourceKnowledgeRegistryMetadata.knowledgeCategories.length,
    connectorCategories: DataSourceKnowledgeRegistryMetadata.connectorTypes.length,
    contentCategories: DataSourceKnowledgeRegistryMetadata.contentTypes.length,
    metadataCategories: DataSourceKnowledgeRegistryMetadata.metadataTypes.length,
    sourceGroups: DataSourceKnowledgeRegistryMetadata.sourceCategories.length,
  }),
  registry: Object.freeze({
    dataSourceEntries: DataSourceRegistry.entries.length,
    knowledgeEntries: KnowledgeTypeRegistry.entries.length,
    connectorEntries: ConnectorTypeRegistry.entries.length,
    contentEntries: ContentTypeRegistry.entries.length,
    sourceGroupEntries: SourceGroupRegistry.entries.length,
    compatibilityRelationships: SourceKnowledgeCompatibilityRegistry.entries.length,
  }),
  model: Object.freeze({
    identityModels: DataSourceRegistryModelManifest.identityModelCount,
    dataSourceModels: DataSourceRegistryModelManifest.dataSourceModelCount,
    knowledgeModels: DataSourceRegistryModelManifest.knowledgeModelCount,
    connectorModels: DataSourceRegistryModelManifest.connectorModelCount,
    compatibilityModels: DataSourceRegistryModelManifest.compatibilityModelCount,
    totalModels: DataSourceRegistryModelManifest.totalModels,
  }),
  validation: Object.freeze({
    categories: DataSourceKnowledgeValidationManifest.categories.length,
    rules: DataSourceKnowledgeValidationManifest.ruleCount,
    pass: DataSourceKnowledgeValidationManifest.passCount,
    fail: DataSourceKnowledgeValidationManifest.failCount,
    warning: DataSourceKnowledgeValidationManifest.warningCount,
    notApplicable: DataSourceKnowledgeValidationManifest.notApplicableCount,
    status: DataSourceKnowledgeValidationManifest.validationStatus,
  }),
  publicSurface: Object.freeze({
    foundationExports,
    registryExports,
    modelExports,
    validationExports,
    totalPriorExports: foundationExports + registryExports + modelExports + validationExports,
  }),
  metadataOnly: true,
  immutable: true,
} as const satisfies InventoryManifestDescriptor);
