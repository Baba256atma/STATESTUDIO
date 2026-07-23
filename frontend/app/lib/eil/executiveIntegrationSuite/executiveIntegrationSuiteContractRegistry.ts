/**
 * EIL-8:2 — Executive Integration Suite Contract Registry.
 *
 * Canonical registry for the eight Foundation suite contracts.
 * Consumes only the EIL-8:1 Foundation aggregate public surface.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-8:2.
 */

import { ExecutiveIntegrationSuiteFoundation } from "./executiveIntegrationSuiteFoundation.ts";

const foundation = ExecutiveIntegrationSuiteFoundation;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.namespace;

/** Immutable contract registry record. */
export interface ExecutiveIntegrationSuiteContractRegistryRecord {
  readonly id: `EIL-8:2/Contract/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "Contract";
  readonly namespace: "nexora.eil.executive-integration-suite.registry";
  readonly sourcePhase: "EIL-8:1";
  readonly sourceCanonicalId: string;
  readonly sourceReference: string;
  readonly sourceNamespace: string;
  readonly order: number;
  readonly status: "Registered";
  readonly foundationReference: unknown;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly eight contract registry entries preserving Foundation order.
 */
export const ExecutiveIntegrationSuiteContractRegistry: readonly ExecutiveIntegrationSuiteContractRegistryRecord[] =
  Object.freeze(
    foundation.contracts.map((item) =>
      Object.freeze({
        id: `EIL-8:2/Contract/${item.contractKey}` as const,
        key: item.contractKey,
        name: item.canonicalName,
        category: "Contract" as const,
        namespace: "nexora.eil.executive-integration-suite.registry" as const,
        sourcePhase: "EIL-8:1" as const,
        sourceCanonicalId: item.contractId,
        sourceReference: `${foundationId}/contracts/${item.contractKey}`,
        sourceNamespace: foundationNamespace,
        order: item.order,
        status: "Registered" as const,
        foundationReference: item,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
