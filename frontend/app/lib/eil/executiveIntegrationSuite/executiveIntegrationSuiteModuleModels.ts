/**
 * EIL-8:3 — Executive Integration Suite Module Models.
 *
 * Immutable module models derived from Registry module records.
 * Preserves Public Index relationships. Metadata-only.
 *
 * Ownership: owned exclusively by EIL-8:3.
 */

import {
  ExecutiveIntegrationSuiteRegistry,
  ExecutiveIntegrationSuiteRegistryIdentity,
} from "./executiveIntegrationSuiteRegistry.ts";

/** Immutable module model descriptor. */
export interface ExecutiveIntegrationSuiteModuleModel {
  readonly modelId: `EIL-8:3/ModuleModel/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "ModuleModel";
  readonly namespace: "nexora.eil.executive-integration-suite.model";
  readonly sourceRegistryId: string;
  readonly sourceRegistryKey: string;
  readonly sourceReference: string;
  readonly publicIndexId: string;
  readonly publicIndexModule: string;
  readonly order: number;
  readonly status: "Modeled";
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly seven module models preserving Registry order and Public Index links.
 */
export const ExecutiveIntegrationSuiteModuleModels: readonly ExecutiveIntegrationSuiteModuleModel[] =
  Object.freeze(
    ExecutiveIntegrationSuiteRegistry.modules.map((item) =>
      Object.freeze({
        modelId: `EIL-8:3/ModuleModel/${item.key}Model` as const,
        canonicalKey: `${item.key}Model`,
        canonicalName: `${item.name} Model`,
        description: `Canonical Suite module model for ${item.name}, sourced from Registry with Public Index relationship preserved.`,
        category: "ModuleModel" as const,
        namespace: "nexora.eil.executive-integration-suite.model" as const,
        sourceRegistryId: item.id,
        sourceRegistryKey: item.key,
        sourceReference: `${ExecutiveIntegrationSuiteRegistryIdentity.canonicalId}/modules/${item.key}`,
        publicIndexId: item.publicIndexId,
        publicIndexModule: item.publicIndexModule,
        order: item.order,
        status: "Modeled" as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
