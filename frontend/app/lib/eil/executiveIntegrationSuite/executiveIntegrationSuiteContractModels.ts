/**
 * EIL-8:3 — Executive Integration Suite Contract Models.
 *
 * Immutable contract models derived from Registry contract records.
 * Metadata-only. No contract enforcement.
 *
 * Ownership: owned exclusively by EIL-8:3.
 */

import {
  ExecutiveIntegrationSuiteRegistry,
  ExecutiveIntegrationSuiteRegistryIdentity,
} from "./executiveIntegrationSuiteRegistry.ts";

/** Immutable contract model descriptor. */
export interface ExecutiveIntegrationSuiteContractModel {
  readonly modelId: `EIL-8:3/ContractModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "ContractModel";
  readonly namespace: "nexora.eil.executive-integration-suite.model";
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
 * Exactly eight contract models preserving Registry order.
 */
export const ExecutiveIntegrationSuiteContractModels: readonly ExecutiveIntegrationSuiteContractModel[] =
  Object.freeze(
    ExecutiveIntegrationSuiteRegistry.contracts.map((item) =>
      Object.freeze({
        modelId: `EIL-8:3/ContractModel/${item.key}Model` as const,
        canonicalKey: `${item.key}Model`,
        canonicalName: `${item.name} Model`,
        description: `Canonical architectural contract model for ${item.name}, sourced from Registry.`,
        category: "ContractModel" as const,
        namespace: "nexora.eil.executive-integration-suite.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${ExecutiveIntegrationSuiteRegistryIdentity.canonicalId}/contracts/${item.key}`,
        order: item.order,
        status: "Modeled" as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
