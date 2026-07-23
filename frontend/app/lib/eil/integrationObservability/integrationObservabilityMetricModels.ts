/**
 * EIL-6:3 — Integration Observability Metric Models.
 *
 * Immutable metric models derived from Registry metric-category records.
 * Metadata-only. No metric calculation or collection.
 *
 * Ownership: owned exclusively by EIL-6:3.
 */

import {
  IntegrationObservabilityRegistry,
  IntegrationObservabilityRegistryIdentity,
} from "./integrationObservabilityRegistry.ts";

/** Immutable metric model descriptor. */
export interface IntegrationObservabilityMetricModel {
  readonly modelId: `EIL-6:3/MetricModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "MetricModel";
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
 * Exactly eight metric models preserving Registry order.
 */
export const IntegrationObservabilityMetricModels: readonly IntegrationObservabilityMetricModel[] =
  Object.freeze(
    IntegrationObservabilityRegistry.metricCategories.map((item) =>
      Object.freeze({
        modelId: `EIL-6:3/MetricModel/${item.key}` as const,
        canonicalKey: item.key,
        canonicalName: item.name,
        description: `Canonical architectural metric model for ${item.name}, sourced from Registry.`,
        category: "MetricModel" as const,
        namespace: "nexora.eil.integration-observability.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${IntegrationObservabilityRegistryIdentity.canonicalId}/metricCategories/${item.key}`,
        order: item.order,
        status: "Modeled" as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
