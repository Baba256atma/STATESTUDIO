/**
 * EIL-8:2 — Executive Integration Suite Lifecycle Registry.
 *
 * Canonical registry for the nine Foundation lifecycle stages.
 * Consumes only the EIL-8:1 Foundation aggregate public surface.
 * Metadata-only. No lifecycle execution.
 *
 * Ownership: owned exclusively by EIL-8:2.
 */

import { ExecutiveIntegrationSuiteFoundation } from "./executiveIntegrationSuiteFoundation.ts";

const foundation = ExecutiveIntegrationSuiteFoundation;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.namespace;

/** Immutable lifecycle registry record. */
export interface ExecutiveIntegrationSuiteLifecycleRegistryRecord {
  readonly id: `EIL-8:2/Lifecycle/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "Lifecycle";
  readonly namespace: "nexora.eil.executive-integration-suite.registry";
  readonly sourcePhase: "EIL-8:1";
  readonly sourceCanonicalId: string;
  readonly sourceReference: string;
  readonly sourceNamespace: string;
  readonly order: number;
  readonly status: "Registered";
  readonly foundationReference: unknown;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly nine lifecycle registry entries preserving Foundation order.
 */
export const ExecutiveIntegrationSuiteLifecycleRegistry: readonly ExecutiveIntegrationSuiteLifecycleRegistryRecord[] =
  Object.freeze(
    foundation.lifecycle.stages.map((item) =>
      Object.freeze({
        id: `EIL-8:2/Lifecycle/${item.stageKey}` as const,
        key: item.stageKey,
        name: item.canonicalName,
        category: "Lifecycle" as const,
        namespace: "nexora.eil.executive-integration-suite.registry" as const,
        sourcePhase: "EIL-8:1" as const,
        sourceCanonicalId: item.stageId,
        sourceReference: `${foundationId}/lifecycle/stages/${item.stageKey}`,
        sourceNamespace: foundationNamespace,
        order: item.order,
        status: "Registered" as const,
        foundationReference: item,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
