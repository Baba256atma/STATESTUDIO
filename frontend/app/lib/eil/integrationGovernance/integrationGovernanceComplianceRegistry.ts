/**
 * EIL-7:2 — Integration Governance Compliance Registry.
 *
 * Canonical registry for the eight Foundation compliance categories.
 * Consumes only the EIL-7:1 Foundation aggregate public surface.
 * Metadata-only. No compliance evaluation.
 *
 * Ownership: owned exclusively by EIL-7:2.
 */

import { IntegrationGovernanceFoundationPlatform } from "./integrationGovernanceFoundation.ts";

const foundation = IntegrationGovernanceFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

/** Immutable compliance registry record. */
export interface IntegrationGovernanceComplianceRegistryRecord {
  readonly id: `EIL-7:2/ComplianceCategory/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "ComplianceCategory";
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
 * Exactly eight compliance category registry entries preserving Foundation order.
 */
export const IntegrationGovernanceComplianceRegistry: readonly IntegrationGovernanceComplianceRegistryRecord[] =
  Object.freeze(
    foundation.complianceCategories.map((item) =>
      Object.freeze({
        id: `EIL-7:2/ComplianceCategory/${item.categoryKey}` as const,
        key: item.categoryKey,
        name: item.canonicalName,
        category: "ComplianceCategory" as const,
        namespace: "nexora.eil.integration-governance.registry" as const,
        sourcePhase: "EIL-7:1" as const,
        sourceCanonicalId: item.categoryId,
        sourceReference: `${foundationId}/complianceCategories/${item.categoryKey}`,
        sourceNamespace: foundationNamespace,
        order: item.deterministicOrder,
        status: "Registered" as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
