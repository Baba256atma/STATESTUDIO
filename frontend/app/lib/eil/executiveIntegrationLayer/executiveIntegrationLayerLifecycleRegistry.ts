/**
 * EIL-9:2 — Executive Integration Layer Lifecycle Registry.
 *
 * Canonical registry for the nine Foundation lifecycle stages.
 * Consumes only the EIL-9:1 Foundation aggregate public surface.
 * Metadata-only. No lifecycle execution.
 *
 * Ownership: owned exclusively by EIL-9:2.
 */

import { ExecutiveIntegrationLayerFoundation } from "./executiveIntegrationLayerFoundation.ts";

const foundation = ExecutiveIntegrationLayerFoundation;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.namespace;

/** Immutable lifecycle registry record. */
export interface ExecutiveIntegrationLayerLifecycleRegistryRecord {
  readonly id: `EIL-9:2/Lifecycle/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "Lifecycle";
  readonly namespace: "nexora.eil.executive-integration-layer.registry";
  readonly sourcePhase: "EIL-9:1";
  readonly sourceCanonicalId: string;
  readonly sourceReference: string;
  readonly sourceNamespace: string;
  readonly order: number;
  readonly status: "Registered";
  readonly resolvesRuntime: false;
  readonly foundationReference: (typeof foundation.lifecycle.stages)[number];
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly nine lifecycle registry entries preserving Foundation order.
 */
export const ExecutiveIntegrationLayerLifecycleRegistry: readonly ExecutiveIntegrationLayerLifecycleRegistryRecord[] =
  Object.freeze(
    foundation.lifecycle.stages.map((item) =>
      Object.freeze({
        id: `EIL-9:2/Lifecycle/${item.stageKey}` as const,
        key: item.stageKey,
        name: item.canonicalName,
        category: "Lifecycle" as const,
        namespace: "nexora.eil.executive-integration-layer.registry" as const,
        sourcePhase: "EIL-9:1" as const,
        sourceCanonicalId: item.stageId,
        sourceReference: `${foundationId}/lifecycle/stages/${item.stageKey}`,
        sourceNamespace: foundationNamespace,
        order: item.order,
        status: "Registered" as const,
        resolvesRuntime: false as const,
        foundationReference: item,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
