/**
 * EIL-9:3 — Executive Integration Layer Module Models.
 *
 * Immutable module models derived from Registry module records.
 * Preserves Registry, Foundation, and EIL-8 Public Index relationships.
 * Metadata-only.
 *
 * Ownership: owned exclusively by EIL-9:3.
 */

import {
  ExecutiveIntegrationLayerRegistry,
  ExecutiveIntegrationLayerRegistryIdentity,
} from "./executiveIntegrationLayerRegistry.ts";

/** Immutable module model descriptor. */
export interface ExecutiveIntegrationLayerModuleModel {
  readonly modelId: `EIL-9:3/Module/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "ModuleModel";
  readonly namespace: "nexora.eil.executive-integration-layer.model";
  readonly sourceRegistryId: string;
  readonly sourceRegistryKey: string;
  readonly sourceReference: string;
  readonly registryRecord: (typeof ExecutiveIntegrationLayerRegistry.modules)[number];
  readonly foundationRecord: (typeof ExecutiveIntegrationLayerRegistry.modules)[number]["foundationReference"];
  readonly publicIndexId: string;
  readonly publicIndexNamespace: string;
  readonly publicIndexVersion: string;
  readonly publicIndexModule: string;
  readonly suiteLockId: string;
  readonly suiteConsumerEntry: string;
  readonly order: number;
  readonly status: "Modeled";
  readonly resolvesRuntime: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly one module model preserving Registry order and Public Index links.
 */
export const ExecutiveIntegrationLayerModuleModels: readonly ExecutiveIntegrationLayerModuleModel[] =
  Object.freeze(
    ExecutiveIntegrationLayerRegistry.modules.map((item) =>
      Object.freeze({
        modelId: `EIL-9:3/Module/${item.key}` as const,
        canonicalKey: item.key,
        canonicalName: item.name,
        description: `Canonical Layer module model for ${item.name}, sourced from Registry with Foundation and Public Index relationships preserved.`,
        category: "ModuleModel" as const,
        namespace: "nexora.eil.executive-integration-layer.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${ExecutiveIntegrationLayerRegistryIdentity.canonicalId}/modules/${item.key}`,
        registryRecord: item,
        foundationRecord: item.foundationReference,
        publicIndexId: item.publicIndexId,
        publicIndexNamespace: item.publicIndexNamespace,
        publicIndexVersion: item.publicIndexVersion,
        publicIndexModule: item.publicIndexModule,
        suiteLockId: item.suiteLockId,
        suiteConsumerEntry: item.suiteConsumerEntry,
        order: item.order,
        status: "Modeled" as const,
        resolvesRuntime: false as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
