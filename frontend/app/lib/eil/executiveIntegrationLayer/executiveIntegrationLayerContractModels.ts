/**
 * EIL-9:3 — Executive Integration Layer Contract Models.
 *
 * Immutable contract models derived from Registry contract records.
 * Metadata-only. No contract enforcement.
 *
 * Ownership: owned exclusively by EIL-9:3.
 */

import {
  ExecutiveIntegrationLayerRegistry,
  ExecutiveIntegrationLayerRegistryIdentity,
} from "./executiveIntegrationLayerRegistry.ts";

/** Immutable contract model descriptor. */
export interface ExecutiveIntegrationLayerContractModel {
  readonly modelId: `EIL-9:3/ContractModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "ContractModel";
  readonly namespace: "nexora.eil.executive-integration-layer.model";
  readonly sourceRegistryId: string;
  readonly sourceRegistryKey: string;
  readonly sourceReference: string;
  readonly registryRecord: (typeof ExecutiveIntegrationLayerRegistry.contracts)[number];
  readonly order: number;
  readonly status: "Modeled";
  readonly resolvesRuntime: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly eight contract models preserving Registry order.
 */
export const ExecutiveIntegrationLayerContractModels: readonly ExecutiveIntegrationLayerContractModel[] =
  Object.freeze(
    ExecutiveIntegrationLayerRegistry.contracts.map((item) =>
      Object.freeze({
        modelId: `EIL-9:3/ContractModel/${item.key}Model` as const,
        canonicalKey: `${item.key}Model`,
        canonicalName: `${item.name} Model`,
        description: `Canonical architectural contract model for ${item.name}, sourced from Registry.`,
        category: "ContractModel" as const,
        namespace: "nexora.eil.executive-integration-layer.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${ExecutiveIntegrationLayerRegistryIdentity.canonicalId}/contracts/${item.key}`,
        registryRecord: item,
        order: item.order,
        status: "Modeled" as const,
        resolvesRuntime: false as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
