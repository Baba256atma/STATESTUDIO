/**
 * EIL-8:3 — Executive Integration Suite Lifecycle Models.
 *
 * Immutable lifecycle models derived from Registry lifecycle records.
 * Metadata-only. No lifecycle execution.
 *
 * Ownership: owned exclusively by EIL-8:3.
 */

import {
  ExecutiveIntegrationSuiteRegistry,
  ExecutiveIntegrationSuiteRegistryIdentity,
} from "./executiveIntegrationSuiteRegistry.ts";

/** Immutable lifecycle model descriptor. */
export interface ExecutiveIntegrationSuiteLifecycleModel {
  readonly modelId: `EIL-8:3/LifecycleModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "LifecycleModel";
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
 * Exactly nine lifecycle models preserving Registry order.
 */
export const ExecutiveIntegrationSuiteLifecycleModels: readonly ExecutiveIntegrationSuiteLifecycleModel[] =
  Object.freeze(
    ExecutiveIntegrationSuiteRegistry.lifecycle.map((item) =>
      Object.freeze({
        modelId: `EIL-8:3/LifecycleModel/${item.key}` as const,
        canonicalKey: item.key,
        canonicalName: item.name,
        description: `Canonical architectural lifecycle model for ${item.name}, sourced from Registry.`,
        category: "LifecycleModel" as const,
        namespace: "nexora.eil.executive-integration-suite.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${ExecutiveIntegrationSuiteRegistryIdentity.canonicalId}/lifecycle/${item.key}`,
        order: item.order,
        status: "Modeled" as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
