/**
 * EIL-8:3 — Executive Integration Suite Domain Models.
 *
 * Immutable domain models derived from Registry domain records.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-8:3.
 */

import {
  ExecutiveIntegrationSuiteRegistry,
  ExecutiveIntegrationSuiteRegistryIdentity,
} from "./executiveIntegrationSuiteRegistry.ts";

/** Immutable domain model descriptor. */
export interface ExecutiveIntegrationSuiteDomainModel {
  readonly modelId: `EIL-8:3/DomainModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "DomainModel";
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
 * Exactly eight domain models preserving Registry order.
 */
export const ExecutiveIntegrationSuiteDomainModels: readonly ExecutiveIntegrationSuiteDomainModel[] =
  Object.freeze(
    ExecutiveIntegrationSuiteRegistry.domains.map((item) =>
      Object.freeze({
        modelId: `EIL-8:3/DomainModel/${item.key}Model` as const,
        canonicalKey: `${item.key}Model`,
        canonicalName: `${item.name} Model`,
        description: `Canonical architectural domain model for ${item.name}, sourced from Registry.`,
        category: "DomainModel" as const,
        namespace: "nexora.eil.executive-integration-suite.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${ExecutiveIntegrationSuiteRegistryIdentity.canonicalId}/domains/${item.key}`,
        order: item.order,
        status: "Modeled" as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
