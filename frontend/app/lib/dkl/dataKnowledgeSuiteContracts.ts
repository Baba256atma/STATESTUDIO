/**
 * DKL-9:1 — Data Knowledge Suite Contracts.
 *
 * Suite composition, ownership, catalog, boundary, lifecycle, dependency,
 * integration, and readiness contracts. Declarations only.
 *
 * Ownership: owned exclusively by DKL-9:1.
 */

import type {
  DataKnowledgeSuiteContractDeclaration,
  DataKnowledgeSuiteIntegrationContract,
} from "./dataKnowledgeSuiteFoundationTypes.ts";

const contract = (
  key: string,
  contractName: string,
  description: string,
  fields: readonly string[],
  order: number,
): DataKnowledgeSuiteContractDeclaration =>
  Object.freeze({
    contractId: `DKL-9:1/Contract/${key}`,
    contractName,
    description,
    fields: Object.freeze([...fields]),
    metadataOnly: true as const,
    immutable: true as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Suite foundation contracts — composition metadata only. */
export const DataKnowledgeSuiteContracts: readonly DataKnowledgeSuiteContractDeclaration[] =
  Object.freeze([
    contract(
      "SuiteIdentity",
      "Suite Identity",
      "Canonical identity for the Data Knowledge Suite.",
      Object.freeze([
        "foundationId",
        "foundationVersion",
        "foundationNamespace",
        "suiteName",
      ]),
      1,
    ),
    contract(
      "SuiteComposition",
      "Suite Composition",
      "Ordered composition of DKL-1 through DKL-8 Public Indexes.",
      Object.freeze([
        "capabilityId",
        "publicIndexId",
        "publicIndexVersion",
        "deterministicOrder",
      ]),
      2,
    ),
    contract(
      "SuiteCapabilityCatalog",
      "Suite Capability Catalog",
      "Catalog of integrated DKL capabilities without new knowledge domains.",
      Object.freeze([
        "capabilityId",
        "capabilityName",
        "publicIndexModule",
        "publicApiCount",
      ]),
      3,
    ),
    contract(
      "SuiteOwnership",
      "Suite Ownership",
      "Ownership and non-ownership declarations for suite composition.",
      Object.freeze(["owns", "doesNotOwn", "owner"]),
      4,
    ),
    contract(
      "SuiteBoundaries",
      "Suite Boundaries",
      "Explicit boundaries separating suite composition from runtime surfaces.",
      Object.freeze([
        "prohibitedSurfaces",
        "consumes",
        "provides",
        "runtimeEnforcement",
      ]),
      5,
    ),
    contract(
      "SuiteLifecycle",
      "Suite Lifecycle",
      "Declarative suite lifecycle states and transitions.",
      Object.freeze(["states", "transitions", "currentState"]),
      6,
    ),
    contract(
      "SuiteDependencies",
      "Suite Dependencies",
      "Public-Index-only dependency declarations for DKL-1 through DKL-8.",
      Object.freeze([
        "publicIndexModule",
        "capabilityId",
        "integrationMode",
        "canonicalPath",
      ]),
      7,
    ),
    contract(
      "SuiteIntegration",
      "Suite Integration",
      "Cross-capability integration contracts via Public Indexes only.",
      Object.freeze([
        "integrationContractId",
        "capabilityId",
        "publicIndexModule",
        "preservesCanonicalReferences",
      ]),
      8,
    ),
    contract(
      "SuiteInventory",
      "Suite Inventory",
      "Inventory derived exclusively from Public Index canonical surfaces.",
      Object.freeze([
        "capabilityPublicApiCounts",
        "publicApiInventoryTotal",
        "sourcedThroughPublicIndexes",
      ]),
      9,
    ),
    contract(
      "SuiteReadiness",
      "Suite Readiness",
      "Foundation readiness for DKL-9:2 Registry.",
      Object.freeze(["status", "readiness", "nextPhase"]),
      10,
    ),
  ]);

const integration = (
  capabilityId: DataKnowledgeSuiteIntegrationContract["capabilityId"],
  publicIndexModule: string,
  order: number,
): DataKnowledgeSuiteIntegrationContract =>
  Object.freeze({
    integrationContractId: `DKL-9:1/Integration/${capabilityId}`,
    capabilityId,
    publicIndexModule,
    integrationMode: "PublicIndexOnly" as const,
    preservesCanonicalReferences: true as const,
    reconstructsCapability: false as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Exactly eight Public-Index integration contracts. */
export const DataKnowledgeSuiteIntegrationContracts: readonly DataKnowledgeSuiteIntegrationContract[] =
  Object.freeze([
    integration("DKL-1", "dataKnowledgeFoundationPublicIndex.ts", 1),
    integration("DKL-2", "dataSourceKnowledgeRegistryPublicIndex.ts", 2),
    integration("DKL-3", "dataUnderstandingPublicIndex.ts", 3),
    integration("DKL-4", "knowledgeModelingPublicIndex.ts", 4),
    integration("DKL-5", "knowledgeValidationPublicIndex.ts", 5),
    integration("DKL-6", "knowledgeRepositoryPublicIndex.ts", 6),
    integration("DKL-7", "knowledgeServicesPublicIndex.ts", 7),
    integration("DKL-8", "knowledgeGovernancePublicIndex.ts", 8),
  ]);
