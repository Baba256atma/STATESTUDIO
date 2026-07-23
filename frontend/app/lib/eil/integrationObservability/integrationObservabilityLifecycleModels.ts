/**
 * EIL-6:3 — Integration Observability Lifecycle Models.
 *
 * Immutable lifecycle models derived from Registry lifecycle records.
 * Metadata-only. No lifecycle execution.
 *
 * Ownership: owned exclusively by EIL-6:3.
 */

import {
  IntegrationObservabilityRegistry,
  IntegrationObservabilityRegistryIdentity,
} from "./integrationObservabilityRegistry.ts";

/** Immutable lifecycle model descriptor. */
export interface IntegrationObservabilityLifecycleModel {
  readonly modelId: `EIL-6:3/LifecycleModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "LifecycleModel";
  readonly namespace: "nexora.eil.integration-observability.model";
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
export const IntegrationObservabilityLifecycleModels: readonly IntegrationObservabilityLifecycleModel[] =
  Object.freeze(
    IntegrationObservabilityRegistry.lifecycle.map((item) =>
      Object.freeze({
        modelId: `EIL-6:3/LifecycleModel/${item.key}` as const,
        canonicalKey: item.key,
        canonicalName: item.name,
        description: `Canonical architectural lifecycle model for ${item.name}, sourced from Registry.`,
        category: "LifecycleModel" as const,
        namespace: "nexora.eil.integration-observability.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${IntegrationObservabilityRegistryIdentity.canonicalId}/lifecycle/${item.key}`,
        order: item.order,
        status: "Modeled" as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
