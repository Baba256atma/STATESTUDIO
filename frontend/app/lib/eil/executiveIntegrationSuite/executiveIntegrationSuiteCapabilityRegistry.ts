/**
 * EIL-8:2 — Executive Integration Suite Capability Registry.
 *
 * Canonical registry for the eight Foundation suite capabilities.
 * Consumes only the EIL-8:1 Foundation aggregate public surface.
 * Metadata-only. No capability execution.
 *
 * Ownership: owned exclusively by EIL-8:2.
 */

import { ExecutiveIntegrationSuiteFoundation } from "./executiveIntegrationSuiteFoundation.ts";

const foundation = ExecutiveIntegrationSuiteFoundation;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.namespace;

/** Immutable capability registry record. */
export interface ExecutiveIntegrationSuiteCapabilityRegistryRecord {
  readonly id: `EIL-8:2/Capability/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "Capability";
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
 * Exactly eight capability registry entries preserving Foundation order.
 */
export const ExecutiveIntegrationSuiteCapabilityRegistry: readonly ExecutiveIntegrationSuiteCapabilityRegistryRecord[] =
  Object.freeze(
    foundation.capabilities.map((item) =>
      Object.freeze({
        id: `EIL-8:2/Capability/${item.capabilityKey}` as const,
        key: item.capabilityKey,
        name: item.capabilityName,
        category: "Capability" as const,
        namespace: "nexora.eil.executive-integration-suite.registry" as const,
        sourcePhase: "EIL-8:1" as const,
        sourceCanonicalId: item.capabilityId,
        sourceReference: `${foundationId}/capabilities/${item.capabilityKey}`,
        sourceNamespace: foundationNamespace,
        order: item.order,
        status: "Registered" as const,
        foundationReference: item,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
