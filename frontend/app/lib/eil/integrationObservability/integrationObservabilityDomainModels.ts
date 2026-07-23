/**
 * EIL-6:3 — Integration Observability Domain Models.
 *
 * Immutable domain models derived from Registry domain records.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-6:3.
 */

import {
  IntegrationObservabilityRegistry,
  IntegrationObservabilityRegistryIdentity,
} from "./integrationObservabilityRegistry.ts";

/** Immutable domain model descriptor. */
export interface IntegrationObservabilityDomainModel {
  readonly modelId: `EIL-6:3/DomainModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "DomainModel";
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
 * Exactly ten domain models preserving Registry order.
 */
export const IntegrationObservabilityDomainModels: readonly IntegrationObservabilityDomainModel[] =
  Object.freeze(
    IntegrationObservabilityRegistry.domains.map((item) =>
      Object.freeze({
        modelId: `EIL-6:3/DomainModel/${item.key}Model` as const,
        canonicalKey: `${item.key}Model`,
        canonicalName: `${item.name} Model`,
        description: `Canonical architectural domain model for ${item.name}, sourced from Registry.`,
        category: "DomainModel" as const,
        namespace: "nexora.eil.integration-observability.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${IntegrationObservabilityRegistryIdentity.canonicalId}/domains/${item.key}`,
        order: item.order,
        status: "Modeled" as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
