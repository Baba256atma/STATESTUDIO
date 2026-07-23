/**
 * EIL-7:3 — Integration Governance Policy Models.
 *
 * Immutable policy models derived from Registry policy-category records.
 * Metadata-only. No policy execution.
 *
 * Ownership: owned exclusively by EIL-7:3.
 */

import {
  IntegrationGovernanceRegistry,
  IntegrationGovernanceRegistryIdentity,
} from "./integrationGovernanceRegistry.ts";

/** Immutable policy model descriptor. */
export interface IntegrationGovernancePolicyModel {
  readonly modelId: `EIL-7:3/PolicyModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "PolicyModel";
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
 * Exactly eight policy models preserving Registry order.
 */
export const IntegrationGovernancePolicyModels: readonly IntegrationGovernancePolicyModel[] =
  Object.freeze(
    IntegrationGovernanceRegistry.policyCategories.map((item) =>
      Object.freeze({
        modelId: `EIL-7:3/PolicyModel/${item.key}` as const,
        canonicalKey: item.key,
        canonicalName: item.name,
        description: `Canonical architectural policy model for ${item.name}, sourced from Registry.`,
        category: "PolicyModel" as const,
        namespace: "nexora.eil.integration-governance.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${IntegrationGovernanceRegistryIdentity.canonicalId}/policyCategories/${item.key}`,
        order: item.order,
        status: "Modeled" as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
