/**
 * EIL-6:3 — Integration Observability Event Models.
 *
 * Immutable event models derived from Registry event-category records.
 * Metadata-only. No event emission.
 *
 * Ownership: owned exclusively by EIL-6:3.
 */

import {
  IntegrationObservabilityRegistry,
  IntegrationObservabilityRegistryIdentity,
} from "./integrationObservabilityRegistry.ts";

/** Immutable event model descriptor. */
export interface IntegrationObservabilityEventModel {
  readonly modelId: `EIL-6:3/EventModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "EventModel";
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
 * Exactly eight event models preserving Registry order.
 */
export const IntegrationObservabilityEventModels: readonly IntegrationObservabilityEventModel[] =
  Object.freeze(
    IntegrationObservabilityRegistry.eventCategories.map((item) =>
      Object.freeze({
        modelId: `EIL-6:3/EventModel/${item.key}` as const,
        canonicalKey: item.key,
        canonicalName: item.name,
        description: `Canonical architectural event model for ${item.name}, sourced from Registry.`,
        category: "EventModel" as const,
        namespace: "nexora.eil.integration-observability.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${IntegrationObservabilityRegistryIdentity.canonicalId}/eventCategories/${item.key}`,
        order: item.order,
        status: "Modeled" as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
