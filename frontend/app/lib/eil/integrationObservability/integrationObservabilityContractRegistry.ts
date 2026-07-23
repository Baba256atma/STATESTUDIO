/**
 * EIL-6:2 — Integration Observability Contract Registry.
 *
 * Canonical registry for the ten Foundation observability contracts.
 * Consumes only the EIL-6:1 Foundation aggregate public surface.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-6:2.
 */

import { IntegrationObservabilityFoundationPlatform } from "./integrationObservabilityFoundation.ts";

const foundation = IntegrationObservabilityFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

/** Immutable contract registry record. */
export interface IntegrationObservabilityContractRegistryRecord {
  readonly id: `EIL-6:2/Contract/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "Contract";
  readonly namespace: "nexora.eil.integration-observability.registry";
  readonly sourcePhase: "EIL-6:1";
  readonly sourceCanonicalId: string;
  readonly sourceReference: string;
  readonly sourceNamespace: string;
  readonly order: number;
  readonly status: "Registered";
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly ten contract registry entries preserving Foundation order.
 */
export const IntegrationObservabilityContractRegistry: readonly IntegrationObservabilityContractRegistryRecord[] =
  Object.freeze(
    foundation.contracts.map((item) =>
      Object.freeze({
        id: `EIL-6:2/Contract/${item.contractName}` as const,
        key: item.contractName,
        name: item.canonicalName,
        category: "Contract" as const,
        namespace: "nexora.eil.integration-observability.registry" as const,
        sourcePhase: "EIL-6:1" as const,
        sourceCanonicalId: item.contractId,
        sourceReference: `${foundationId}/contracts/${item.contractName}`,
        sourceNamespace: foundationNamespace,
        order: item.deterministicOrder,
        status: "Registered" as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
