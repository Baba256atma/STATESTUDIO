/**
 * EIL-6:2 — Integration Observability Metric Category Registry.
 *
 * Canonical registry for the eight Foundation metric categories.
 * Consumes only the EIL-6:1 Foundation aggregate public surface.
 * Metadata-only. No metric collection or exporters.
 *
 * Ownership: owned exclusively by EIL-6:2.
 */

import { IntegrationObservabilityFoundationPlatform } from "./integrationObservabilityFoundation.ts";

const foundation = IntegrationObservabilityFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

/** Immutable metric-category registry record. */
export interface IntegrationObservabilityMetricRegistryRecord {
  readonly id: `EIL-6:2/MetricCategory/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "MetricCategory";
  readonly namespace: "nexora.eil.integration-observability.registry";
  readonly sourcePhase: "EIL-6:1";
  readonly sourceCanonicalId: string;
  readonly sourceReference: string;
  readonly sourceNamespace: string;
  readonly order: number;
  readonly status: "Registered";
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly eight metric-category registry entries preserving Foundation order.
 */
export const IntegrationObservabilityMetricRegistry: readonly IntegrationObservabilityMetricRegistryRecord[] =
  Object.freeze(
    foundation.metricCategories.map((item) =>
      Object.freeze({
        id: `EIL-6:2/MetricCategory/${item.categoryKey}` as const,
        key: item.categoryKey,
        name: item.canonicalName,
        category: "MetricCategory" as const,
        namespace: "nexora.eil.integration-observability.registry" as const,
        sourcePhase: "EIL-6:1" as const,
        sourceCanonicalId: item.categoryId,
        sourceReference: `${foundationId}/metricCategories/${item.categoryKey}`,
        sourceNamespace: foundationNamespace,
        order: item.deterministicOrder,
        status: "Registered" as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
