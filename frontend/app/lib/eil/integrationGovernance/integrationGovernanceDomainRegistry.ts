/**
 * EIL-7:2 — Integration Governance Domain Registry.
 *
 * Canonical registry for the ten Foundation governance domains.
 * Consumes only the EIL-7:1 Foundation aggregate public surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-7:2.
 */

import { IntegrationGovernanceFoundationPlatform } from "./integrationGovernanceFoundation.ts";

const foundation = IntegrationGovernanceFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

/** Immutable domain registry record. */
export interface IntegrationGovernanceDomainRegistryRecord {
  readonly id: `EIL-7:2/Domain/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "Domain";
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
 * Exactly ten domain registry entries preserving Foundation order.
 */
export const IntegrationGovernanceDomainRegistry: readonly IntegrationGovernanceDomainRegistryRecord[] =
  Object.freeze(
    foundation.domains.map((item) =>
      Object.freeze({
        id: `EIL-7:2/Domain/${item.domainKey}` as const,
        key: item.domainKey,
        name: item.canonicalName,
        category: "Domain" as const,
        namespace: "nexora.eil.integration-governance.registry" as const,
        sourcePhase: "EIL-7:1" as const,
        sourceCanonicalId: item.domainId,
        sourceReference: `${foundationId}/domains/${item.domainKey}`,
        sourceNamespace: foundationNamespace,
        order: item.deterministicOrder,
        status: "Registered" as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
