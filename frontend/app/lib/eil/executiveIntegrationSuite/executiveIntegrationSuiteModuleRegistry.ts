/**
 * EIL-8:2 — Executive Integration Suite Module Registry.
 *
 * Canonical registry for the seven Foundation suite modules.
 * Consumes only the EIL-8:1 Foundation aggregate public surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-8:2.
 */

import { ExecutiveIntegrationSuiteFoundation } from "./executiveIntegrationSuiteFoundation.ts";

const foundation = ExecutiveIntegrationSuiteFoundation;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.namespace;

/** Immutable module registry record. */
export interface ExecutiveIntegrationSuiteModuleRegistryRecord {
  readonly id: `EIL-8:2/Module/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "Module";
  readonly namespace: "nexora.eil.executive-integration-suite.registry";
  readonly sourcePhase: "EIL-8:1";
  readonly sourceCanonicalId: string;
  readonly sourceReference: string;
  readonly sourceNamespace: string;
  readonly publicIndexId: string;
  readonly publicIndexModule: string;
  readonly order: number;
  readonly status: "Registered";
  readonly foundationReference: unknown;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly seven module registry entries preserving Foundation order.
 */
export const ExecutiveIntegrationSuiteModuleRegistry: readonly ExecutiveIntegrationSuiteModuleRegistryRecord[] =
  Object.freeze(
    foundation.modules.map((item) =>
      Object.freeze({
        id: `EIL-8:2/Module/${item.moduleKey}` as const,
        key: item.moduleKey,
        name: item.canonicalName,
        category: "Module" as const,
        namespace: "nexora.eil.executive-integration-suite.registry" as const,
        sourcePhase: "EIL-8:1" as const,
        sourceCanonicalId: item.moduleId,
        sourceReference: `${foundationId}/modules/${item.moduleKey}`,
        sourceNamespace: foundationNamespace,
        publicIndexId: item.publicIndexId,
        publicIndexModule: item.publicIndexModule,
        order: item.order,
        status: "Registered" as const,
        foundationReference: item,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
