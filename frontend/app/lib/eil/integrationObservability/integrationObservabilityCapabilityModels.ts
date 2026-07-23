/**
 * EIL-6:3 — Integration Observability Capability Models.
 *
 * Immutable capability models derived from Registry capability records.
 * Metadata-only. No capability execution.
 *
 * Ownership: owned exclusively by EIL-6:3.
 */

import {
  IntegrationObservabilityRegistry,
  IntegrationObservabilityRegistryIdentity,
} from "./integrationObservabilityRegistry.ts";

/** Immutable capability model descriptor. */
export interface IntegrationObservabilityCapabilityModel {
  readonly modelId: `EIL-6:3/CapabilityModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "CapabilityModel";
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
 * Exactly ten capability models preserving Registry order.
 */
export const IntegrationObservabilityCapabilityModels: readonly IntegrationObservabilityCapabilityModel[] =
  Object.freeze(
    IntegrationObservabilityRegistry.capabilities.map((item) =>
      Object.freeze({
        modelId: `EIL-6:3/CapabilityModel/${item.key}` as const,
        canonicalKey: item.key,
        canonicalName: item.name,
        description: `Canonical architectural capability model for ${item.name}, sourced from Registry.`,
        category: "CapabilityModel" as const,
        namespace: "nexora.eil.integration-observability.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${IntegrationObservabilityRegistryIdentity.canonicalId}/capabilities/${item.key}`,
        order: item.order,
        status: "Modeled" as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
