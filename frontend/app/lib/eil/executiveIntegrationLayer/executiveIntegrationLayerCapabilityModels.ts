/**
 * EIL-9:3 — Executive Integration Layer Capability Models.
 *
 * Immutable capability models derived from Registry capability records.
 * Metadata-only. No capability execution.
 *
 * Ownership: owned exclusively by EIL-9:3.
 */

import {
  ExecutiveIntegrationLayerRegistry,
  ExecutiveIntegrationLayerRegistryIdentity,
} from "./executiveIntegrationLayerRegistry.ts";

/** Immutable capability model descriptor. */
export interface ExecutiveIntegrationLayerCapabilityModel {
  readonly modelId: `EIL-9:3/CapabilityModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "CapabilityModel";
  readonly namespace: "nexora.eil.executive-integration-layer.model";
  readonly sourceRegistryId: string;
  readonly sourceRegistryKey: string;
  readonly sourceReference: string;
  readonly registryRecord: (typeof ExecutiveIntegrationLayerRegistry.capabilities)[number];
  readonly order: number;
  readonly status: "Modeled";
  readonly resolvesRuntime: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly eight capability models preserving Registry order.
 */
export const ExecutiveIntegrationLayerCapabilityModels: readonly ExecutiveIntegrationLayerCapabilityModel[] =
  Object.freeze(
    ExecutiveIntegrationLayerRegistry.capabilities.map((item) =>
      Object.freeze({
        modelId: `EIL-9:3/CapabilityModel/${item.key}` as const,
        canonicalKey: item.key,
        canonicalName: item.name,
        description: `Canonical architectural capability model for ${item.name}, sourced from Registry.`,
        category: "CapabilityModel" as const,
        namespace: "nexora.eil.executive-integration-layer.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${ExecutiveIntegrationLayerRegistryIdentity.canonicalId}/capabilities/${item.key}`,
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
