/**
 * EIL-7:3 — Integration Governance Lifecycle Models.
 *
 * Immutable lifecycle models derived from Registry lifecycle records.
 * Metadata-only. No lifecycle execution.
 *
 * Ownership: owned exclusively by EIL-7:3.
 */

import {
  IntegrationGovernanceRegistry,
  IntegrationGovernanceRegistryIdentity,
} from "./integrationGovernanceRegistry.ts";

/** Immutable lifecycle model descriptor. */
export interface IntegrationGovernanceLifecycleModel {
  readonly modelId: `EIL-7:3/LifecycleModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "LifecycleModel";
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
 * Exactly nine lifecycle models preserving Registry order.
 */
export const IntegrationGovernanceLifecycleModels: readonly IntegrationGovernanceLifecycleModel[] =
  Object.freeze(
    IntegrationGovernanceRegistry.lifecycle.map((item) =>
      Object.freeze({
        modelId: `EIL-7:3/LifecycleModel/${item.key}` as const,
        canonicalKey: item.key,
        canonicalName: item.name,
        description: `Canonical architectural lifecycle model for ${item.name}, sourced from Registry.`,
        category: "LifecycleModel" as const,
        namespace: "nexora.eil.integration-governance.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${IntegrationGovernanceRegistryIdentity.canonicalId}/lifecycle/${item.key}`,
        order: item.order,
        status: "Modeled" as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
