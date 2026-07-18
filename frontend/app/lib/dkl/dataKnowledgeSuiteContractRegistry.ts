/**
 * DKL-9:2 — Data Knowledge Suite Contract Registry.
 *
 * Registers suite contracts and integration contracts by Foundation reference.
 *
 * Ownership: owned exclusively by DKL-9:2.
 */

import { DataKnowledgeSuiteFoundationPlatform } from "./dataKnowledgeSuiteFoundation.ts";
import type { DataKnowledgeSuiteRegistryEntryBase } from "./dataKnowledgeSuiteRegistryTypes.ts";

const foundation = DataKnowledgeSuiteFoundationPlatform;

export interface DataKnowledgeSuiteContractRegistration
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly contractReference: (typeof foundation.contracts)[number];
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuiteIntegrationContractRegistration
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly integrationContractReference: (typeof foundation.integrationContracts)[number];
  readonly capabilityId: (typeof foundation.integrationContracts)[number]["capabilityId"];
  readonly preservesCanonicalReference: true;
}

/** Suite contracts — Foundation contracts preserved by reference. */
export const DataKnowledgeSuiteContractRegistry: readonly DataKnowledgeSuiteContractRegistration[] =
  Object.freeze(
    foundation.contracts.map((contract, index) =>
      Object.freeze({
        id: `DKL-9:2/Contract/${contract.contractId}`,
        name: contract.contractName,
        contractReference: contract,
        preservesCanonicalReference: true as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Integration contracts — Foundation integration contracts preserved by reference. */
export const DataKnowledgeSuiteIntegrationContractRegistry: readonly DataKnowledgeSuiteIntegrationContractRegistration[] =
  Object.freeze(
    foundation.integrationContracts.map((contract, index) =>
      Object.freeze({
        id: `DKL-9:2/IntegrationContract/${contract.integrationContractId}`,
        name: `${contract.capabilityId} Integration Contract`,
        integrationContractReference: contract,
        capabilityId: contract.capabilityId,
        preservesCanonicalReference: true as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );
