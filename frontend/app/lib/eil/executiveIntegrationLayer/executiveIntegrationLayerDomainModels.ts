/**
 * EIL-9:3 — Executive Integration Layer Domain Models.
 *
 * Immutable domain models derived from Registry domain records.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-9:3.
 */

import {
  ExecutiveIntegrationLayerRegistry,
  ExecutiveIntegrationLayerRegistryIdentity,
} from "./executiveIntegrationLayerRegistry.ts";

/** Immutable domain model descriptor. */
export interface ExecutiveIntegrationLayerDomainModel {
  readonly modelId: `EIL-9:3/DomainModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "DomainModel";
  readonly namespace: "nexora.eil.executive-integration-layer.model";
  readonly sourceRegistryId: string;
  readonly sourceRegistryKey: string;
  readonly sourceReference: string;
  readonly registryRecord: (typeof ExecutiveIntegrationLayerRegistry.domains)[number];
  readonly order: number;
  readonly status: "Modeled";
  readonly resolvesRuntime: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly eight domain models preserving Registry order.
 */
export const ExecutiveIntegrationLayerDomainModels: readonly ExecutiveIntegrationLayerDomainModel[] =
  Object.freeze(
    ExecutiveIntegrationLayerRegistry.domains.map((item) =>
      Object.freeze({
        modelId: `EIL-9:3/DomainModel/${item.key}Model` as const,
        canonicalKey: `${item.key}Model`,
        canonicalName: `${item.name} Model`,
        description: `Canonical architectural domain model for ${item.name}, sourced from Registry.`,
        category: "DomainModel" as const,
        namespace: "nexora.eil.executive-integration-layer.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${ExecutiveIntegrationLayerRegistryIdentity.canonicalId}/domains/${item.key}`,
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
