/**
 * EIL-9:3 — Executive Integration Layer Lifecycle Models.
 *
 * Immutable lifecycle models derived from Registry lifecycle records.
 * Metadata-only. No lifecycle execution.
 *
 * Ownership: owned exclusively by EIL-9:3.
 */

import {
  ExecutiveIntegrationLayerRegistry,
  ExecutiveIntegrationLayerRegistryIdentity,
} from "./executiveIntegrationLayerRegistry.ts";

/** Immutable lifecycle model descriptor. */
export interface ExecutiveIntegrationLayerLifecycleModel {
  readonly modelId: `EIL-9:3/LifecycleModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "LifecycleModel";
  readonly namespace: "nexora.eil.executive-integration-layer.model";
  readonly sourceRegistryId: string;
  readonly sourceRegistryKey: string;
  readonly sourceReference: string;
  readonly registryRecord: (typeof ExecutiveIntegrationLayerRegistry.lifecycle)[number];
  readonly order: number;
  readonly status: "Modeled";
  readonly resolvesRuntime: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly nine lifecycle models preserving Registry order.
 */
export const ExecutiveIntegrationLayerLifecycleModels: readonly ExecutiveIntegrationLayerLifecycleModel[] =
  Object.freeze(
    ExecutiveIntegrationLayerRegistry.lifecycle.map((item) =>
      Object.freeze({
        modelId: `EIL-9:3/LifecycleModel/${item.key}` as const,
        canonicalKey: item.key,
        canonicalName: item.name,
        description: `Canonical architectural lifecycle model for ${item.name}, sourced from Registry.`,
        category: "LifecycleModel" as const,
        namespace: "nexora.eil.executive-integration-layer.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${ExecutiveIntegrationLayerRegistryIdentity.canonicalId}/lifecycle/${item.key}`,
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
