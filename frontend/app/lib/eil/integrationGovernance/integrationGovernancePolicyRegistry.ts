/**
 * EIL-7:2 — Integration Governance Policy Registry.
 *
 * Canonical registry for the eight Foundation policy categories.
 * Consumes only the EIL-7:1 Foundation aggregate public surface.
 * Metadata-only. No policy execution.
 *
 * Ownership: owned exclusively by EIL-7:2.
 */

import { IntegrationGovernanceFoundationPlatform } from "./integrationGovernanceFoundation.ts";

const foundation = IntegrationGovernanceFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

/** Immutable policy registry record. */
export interface IntegrationGovernancePolicyRegistryRecord {
  readonly id: `EIL-7:2/PolicyCategory/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "PolicyCategory";
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
 * Exactly eight policy category registry entries preserving Foundation order.
 */
export const IntegrationGovernancePolicyRegistry: readonly IntegrationGovernancePolicyRegistryRecord[] =
  Object.freeze(
    foundation.policyCategories.map((item) =>
      Object.freeze({
        id: `EIL-7:2/PolicyCategory/${item.categoryKey}` as const,
        key: item.categoryKey,
        name: item.canonicalName,
        category: "PolicyCategory" as const,
        namespace: "nexora.eil.integration-governance.registry" as const,
        sourcePhase: "EIL-7:1" as const,
        sourceCanonicalId: item.categoryId,
        sourceReference: `${foundationId}/policyCategories/${item.categoryKey}`,
        sourceNamespace: foundationNamespace,
        order: item.deterministicOrder,
        status: "Registered" as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
