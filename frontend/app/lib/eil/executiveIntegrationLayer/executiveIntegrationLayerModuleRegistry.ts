/**
 * EIL-9:2 — Executive Integration Layer Module Registry.
 *
 * Canonical registry for the single Foundation layer module.
 * Consumes only the EIL-9:1 Foundation aggregate public surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-9:2.
 */

import { ExecutiveIntegrationLayerFoundation } from "./executiveIntegrationLayerFoundation.ts";

const foundation = ExecutiveIntegrationLayerFoundation;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.namespace;

/** Immutable module registry record. */
export interface ExecutiveIntegrationLayerModuleRegistryRecord {
  readonly id: `EIL-9:2/Module/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "Module";
  readonly namespace: "nexora.eil.executive-integration-layer.registry";
  readonly sourcePhase: "EIL-9:1";
  readonly sourceCanonicalId: string;
  readonly sourceReference: string;
  readonly sourceNamespace: string;
  readonly publicIndexId: string;
  readonly publicIndexNamespace: string;
  readonly publicIndexVersion: string;
  readonly publicIndexModule: string;
  readonly suiteReleaseStatus: "Released";
  readonly suiteReadiness: string;
  readonly suiteLockId: string;
  readonly suiteConsumerEntry: string;
  readonly referencesPublicIndexOnly: true;
  readonly bypassesPublicIndex: false;
  readonly referencesEil1ThroughEil7Directly: false;
  readonly order: number;
  readonly status: "Registered";
  readonly resolvesRuntime: false;
  readonly foundationReference: (typeof foundation.modules)[number];
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly one module registry entry preserving Foundation order.
 */
export const ExecutiveIntegrationLayerModuleRegistry: readonly ExecutiveIntegrationLayerModuleRegistryRecord[] =
  Object.freeze(
    foundation.modules.map((item) =>
      Object.freeze({
        id: `EIL-9:2/Module/${item.moduleKey}` as const,
        key: item.moduleKey,
        name: item.canonicalName,
        category: "Module" as const,
        namespace: "nexora.eil.executive-integration-layer.registry" as const,
        sourcePhase: "EIL-9:1" as const,
        sourceCanonicalId: item.moduleId,
        sourceReference: `${foundationId}/modules/${item.moduleKey}`,
        sourceNamespace: foundationNamespace,
        publicIndexId: item.publicIndexId,
        publicIndexNamespace: item.publicIndexNamespace,
        publicIndexVersion: item.publicIndexVersion,
        publicIndexModule: item.publicIndexModule,
        suiteReleaseStatus: item.suiteReleaseStatus,
        suiteReadiness: item.suiteReadiness,
        suiteLockId: item.suiteLockId,
        suiteConsumerEntry: item.suiteConsumerEntry,
        referencesPublicIndexOnly: item.referencesPublicIndexOnly,
        bypassesPublicIndex: item.bypassesPublicIndex,
        referencesEil1ThroughEil7Directly:
          item.referencesEil1ThroughEil7Directly,
        order: item.order,
        status: "Registered" as const,
        resolvesRuntime: false as const,
        foundationReference: item,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
