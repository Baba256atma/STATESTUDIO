/**
 * EIL-7:3 — Integration Governance Capability Models.
 *
 * Immutable capability models derived from Registry capability records.
 * Metadata-only. No capability execution.
 *
 * Ownership: owned exclusively by EIL-7:3.
 */

import {
  IntegrationGovernanceRegistry,
  IntegrationGovernanceRegistryIdentity,
} from "./integrationGovernanceRegistry.ts";

/** Immutable capability model descriptor. */
export interface IntegrationGovernanceCapabilityModel {
  readonly modelId: `EIL-7:3/CapabilityModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "CapabilityModel";
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
 * Exactly ten capability models preserving Registry order.
 */
export const IntegrationGovernanceCapabilityModels: readonly IntegrationGovernanceCapabilityModel[] =
  Object.freeze(
    IntegrationGovernanceRegistry.capabilities.map((item) =>
      Object.freeze({
        modelId: `EIL-7:3/CapabilityModel/${item.key}` as const,
        canonicalKey: item.key,
        canonicalName: item.name,
        description: `Canonical architectural capability model for ${item.name}, sourced from Registry.`,
        category: "CapabilityModel" as const,
        namespace: "nexora.eil.integration-governance.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${IntegrationGovernanceRegistryIdentity.canonicalId}/capabilities/${item.key}`,
        order: item.order,
        status: "Modeled" as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
