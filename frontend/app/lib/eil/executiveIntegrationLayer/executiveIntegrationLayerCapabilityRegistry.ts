/**
 * EIL-9:2 — Executive Integration Layer Capability Registry.
 *
 * Canonical registry for the eight Foundation layer capabilities.
 * Consumes only the EIL-9:1 Foundation aggregate public surface.
 * Metadata-only. No capability execution.
 *
 * Ownership: owned exclusively by EIL-9:2.
 */

import { ExecutiveIntegrationLayerFoundation } from "./executiveIntegrationLayerFoundation.ts";

const foundation = ExecutiveIntegrationLayerFoundation;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.namespace;

/** Immutable capability registry record. */
export interface ExecutiveIntegrationLayerCapabilityRegistryRecord {
  readonly id: `EIL-9:2/Capability/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "Capability";
  readonly namespace: "nexora.eil.executive-integration-layer.registry";
  readonly sourcePhase: "EIL-9:1";
  readonly sourceCanonicalId: string;
  readonly sourceReference: string;
  readonly sourceNamespace: string;
  readonly order: number;
  readonly status: "Registered";
  readonly resolvesRuntime: false;
  readonly foundationReference: (typeof foundation.capabilities)[number];
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly eight capability registry entries preserving Foundation order.
 */
export const ExecutiveIntegrationLayerCapabilityRegistry: readonly ExecutiveIntegrationLayerCapabilityRegistryRecord[] =
  Object.freeze(
    foundation.capabilities.map((item) =>
      Object.freeze({
        id: `EIL-9:2/Capability/${item.capabilityKey}` as const,
        key: item.capabilityKey,
        name: item.capabilityName,
        category: "Capability" as const,
        namespace: "nexora.eil.executive-integration-layer.registry" as const,
        sourcePhase: "EIL-9:1" as const,
        sourceCanonicalId: item.capabilityId,
        sourceReference: `${foundationId}/capabilities/${item.capabilityKey}`,
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
