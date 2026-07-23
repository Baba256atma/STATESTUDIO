/**
 * EIL-8:3 — Executive Integration Suite Capability Models.
 *
 * Immutable capability models derived from Registry capability records.
 * Metadata-only. No capability execution.
 *
 * Ownership: owned exclusively by EIL-8:3.
 */

import {
  ExecutiveIntegrationSuiteRegistry,
  ExecutiveIntegrationSuiteRegistryIdentity,
} from "./executiveIntegrationSuiteRegistry.ts";

/** Immutable capability model descriptor. */
export interface ExecutiveIntegrationSuiteCapabilityModel {
  readonly modelId: `EIL-8:3/CapabilityModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "CapabilityModel";
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
 * Exactly eight capability models preserving Registry order.
 */
export const ExecutiveIntegrationSuiteCapabilityModels: readonly ExecutiveIntegrationSuiteCapabilityModel[] =
  Object.freeze(
    ExecutiveIntegrationSuiteRegistry.capabilities.map((item) =>
      Object.freeze({
        modelId: `EIL-8:3/CapabilityModel/${item.key}` as const,
        canonicalKey: item.key,
        canonicalName: item.name,
        description: `Canonical architectural capability model for ${item.name}, sourced from Registry.`,
        category: "CapabilityModel" as const,
        namespace: "nexora.eil.executive-integration-suite.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${ExecutiveIntegrationSuiteRegistryIdentity.canonicalId}/capabilities/${item.key}`,
        order: item.order,
        status: "Modeled" as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
