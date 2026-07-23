/**
 * EIL-9:2 — Executive Integration Layer Contract Registry.
 *
 * Canonical registry for the eight Foundation layer contracts.
 * Consumes only the EIL-9:1 Foundation aggregate public surface.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-9:2.
 */

import { ExecutiveIntegrationLayerFoundation } from "./executiveIntegrationLayerFoundation.ts";

const foundation = ExecutiveIntegrationLayerFoundation;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.namespace;

/** Immutable contract registry record. */
export interface ExecutiveIntegrationLayerContractRegistryRecord {
  readonly id: `EIL-9:2/Contract/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "Contract";
  readonly namespace: "nexora.eil.executive-integration-layer.registry";
  readonly sourcePhase: "EIL-9:1";
  readonly sourceCanonicalId: string;
  readonly sourceReference: string;
  readonly sourceNamespace: string;
  readonly order: number;
  readonly status: "Registered";
  readonly resolvesRuntime: false;
  readonly foundationReference: (typeof foundation.contracts)[number];
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly eight contract registry entries preserving Foundation order.
 */
export const ExecutiveIntegrationLayerContractRegistry: readonly ExecutiveIntegrationLayerContractRegistryRecord[] =
  Object.freeze(
    foundation.contracts.map((item) =>
      Object.freeze({
        id: `EIL-9:2/Contract/${item.contractKey}` as const,
        key: item.contractKey,
        name: item.canonicalName,
        category: "Contract" as const,
        namespace: "nexora.eil.executive-integration-layer.registry" as const,
        sourcePhase: "EIL-9:1" as const,
        sourceCanonicalId: item.contractId,
        sourceReference: `${foundationId}/contracts/${item.contractKey}`,
        sourceNamespace: foundationNamespace,
        order: item.order,
        status: "Registered" as const,
        resolvesRuntime: false as const,
        foundationReference: item,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
