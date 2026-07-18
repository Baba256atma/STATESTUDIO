/**
 * DKL-1:5 — Inventory Manifest.
 *
 * Immutable aggregate inventories of the DKL Foundation's public APIs, models,
 * registry, validation, and ownership. All counts and names are sourced from
 * the official public metadata of DKL-1:1 through DKL-1:4. No runtime behavior.
 */

import {
  DataKnowledgeFoundationOwnership,
} from "./dataKnowledgeFoundation.ts";
import * as foundationApi from "./dataKnowledgeFoundation.ts";
import {
  BusinessObjectModel,
  DataKnowledgeFoundationModelManifest,
  KnowledgeMetadataModel,
  KnowledgeRelationshipModel,
} from "./dataKnowledgeFoundationModel.ts";
import * as modelApi from "./dataKnowledgeFoundationModel.ts";
import {
  DataKnowledgeFoundationComponentRegistry,
  DataKnowledgeFoundationContractRegistry,
  DataKnowledgeFoundationPublicApiRegistry,
  DataKnowledgeFoundationRegistry,
} from "./dataKnowledgeFoundationRegistryIndex.ts";
import * as registryApi from "./dataKnowledgeFoundationRegistryIndex.ts";
import {
  DataKnowledgeFoundationValidationManifest,
  DataKnowledgeFoundationValidationRules,
} from "./dataKnowledgeFoundationValidation.ts";
import * as validationApi from "./dataKnowledgeFoundationValidation.ts";
import type { DataKnowledgeInventoryManifestDescriptor } from "./dataKnowledgeFoundationManifestTypes.ts";

const foundationApiCount = Object.keys(foundationApi).length;
const registryApiCount = Object.keys(registryApi).length;
const modelApiCount = Object.keys(modelApi).length;
const validationApiCount = Object.keys(validationApi).length;

export const DataKnowledgeFoundationInventoryManifest = Object.freeze({
  publicApis: Object.freeze({
    foundation: foundationApiCount,
    registry: registryApiCount,
    model: modelApiCount,
    validation: validationApiCount,
    total: foundationApiCount + registryApiCount + modelApiCount + validationApiCount,
  }),
  models: Object.freeze({
    names: Object.freeze(["Knowledge Object", "Business Object", "Relationship", "Metadata"]),
    registeredModelCount: DataKnowledgeFoundationModelManifest.registeredModels.length,
    businessObjectTypeCount: BusinessObjectModel.types.length,
    relationshipTypeCount: KnowledgeRelationshipModel.relationships.length,
    metadataFieldCount: KnowledgeMetadataModel.fields.length,
  }),
  registry: Object.freeze({
    components: DataKnowledgeFoundationComponentRegistry.length,
    contracts: DataKnowledgeFoundationContractRegistry.length,
    publicApis: DataKnowledgeFoundationPublicApiRegistry.length,
    capabilities: DataKnowledgeFoundationRegistry.capabilities.length,
  }),
  validation: Object.freeze({
    domains: DataKnowledgeFoundationValidationManifest.validationDomains.length,
    rules: DataKnowledgeFoundationValidationRules.length,
    status: DataKnowledgeFoundationValidationManifest.validationStatus,
    manifestId: DataKnowledgeFoundationValidationManifest.validationId,
  }),
  ownership: Object.freeze({
    owned: Object.freeze([...DataKnowledgeFoundationOwnership.owns]),
    nonOwned: Object.freeze([...DataKnowledgeFoundationOwnership.neverOwns]),
  }),
  metadataOnly: true,
  immutable: true,
} as const satisfies DataKnowledgeInventoryManifestDescriptor);
