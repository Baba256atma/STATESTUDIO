/**
 * EIL-7:2 — Integration Governance Capability Registry.
 *
 * Canonical registry for the ten Foundation governance capabilities.
 * Consumes only the EIL-7:1 Foundation aggregate public surface.
 * Metadata-only. No runtime execution.
 *
 * Ownership: owned exclusively by EIL-7:2.
 */

import { IntegrationGovernanceFoundationPlatform } from "./integrationGovernanceFoundation.ts";

const foundation = IntegrationGovernanceFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

/** Immutable capability registry record. */
export interface IntegrationGovernanceCapabilityRegistryRecord {
  readonly id: `EIL-7:2/Capability/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "Capability";
  readonly namespace: "nexora.eil.integration-governance.registry";
  readonly sourcePhase: "EIL-7:1";
  readonly sourceCanonicalId: string;
  readonly sourceReference: string;
  readonly sourceNamespace: string;
  readonly order: number;
  readonly status: "Registered";
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly ten capability registry entries preserving Foundation order.
 */
export const IntegrationGovernanceCapabilityRegistry: readonly IntegrationGovernanceCapabilityRegistryRecord[] =
  Object.freeze(
    foundation.capabilityDeclarations.map((item) =>
      Object.freeze({
        id: `EIL-7:2/Capability/${item.capabilityKey}` as const,
        key: item.capabilityKey,
        name: item.capabilityName,
        category: "Capability" as const,
        namespace: "nexora.eil.integration-governance.registry" as const,
        sourcePhase: "EIL-7:1" as const,
        sourceCanonicalId: item.capabilityId,
        sourceReference: `${foundationId}/capabilities/${item.capabilityKey}`,
        sourceNamespace: foundationNamespace,
        order: item.deterministicOrder,
        status: "Registered" as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
