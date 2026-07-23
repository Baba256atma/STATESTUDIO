/**
 * EIL-7:3 — Integration Governance Compliance Models.
 *
 * Immutable compliance models derived from Registry compliance-category records.
 * Metadata-only. No compliance evaluation.
 *
 * Ownership: owned exclusively by EIL-7:3.
 */

import {
  IntegrationGovernanceRegistry,
  IntegrationGovernanceRegistryIdentity,
} from "./integrationGovernanceRegistry.ts";

/** Immutable compliance model descriptor. */
export interface IntegrationGovernanceComplianceModel {
  readonly modelId: `EIL-7:3/ComplianceModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "ComplianceModel";
  readonly namespace: "nexora.eil.integration-governance.model";
  readonly sourceRegistryId: string;
  readonly sourceRegistryKey: string;
  readonly sourceReference: string;
  readonly order: number;
  readonly status: "Modeled";
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly eight compliance models preserving Registry order.
 */
export const IntegrationGovernanceComplianceModels: readonly IntegrationGovernanceComplianceModel[] =
  Object.freeze(
    IntegrationGovernanceRegistry.complianceCategories.map((item) =>
      Object.freeze({
        modelId: `EIL-7:3/ComplianceModel/${item.key}` as const,
        canonicalKey: item.key,
        canonicalName: item.name,
        description: `Canonical architectural compliance model for ${item.name}, sourced from Registry.`,
        category: "ComplianceModel" as const,
        namespace: "nexora.eil.integration-governance.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${IntegrationGovernanceRegistryIdentity.canonicalId}/complianceCategories/${item.key}`,
        order: item.order,
        status: "Modeled" as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
