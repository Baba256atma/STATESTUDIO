/**
 * EIL-6:2 — Integration Observability Lifecycle Registry.
 *
 * Canonical registry for the nine Foundation lifecycle stages.
 * Consumes only the EIL-6:1 Foundation aggregate public surface.
 * Metadata-only. No lifecycle execution.
 *
 * Ownership: owned exclusively by EIL-6:2.
 */

import { IntegrationObservabilityFoundationPlatform } from "./integrationObservabilityFoundation.ts";

const foundation = IntegrationObservabilityFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

/** Immutable lifecycle registry record. */
export interface IntegrationObservabilityLifecycleRegistryRecord {
  readonly id: `EIL-6:2/Lifecycle/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "Lifecycle";
  readonly namespace: "nexora.eil.integration-observability.registry";
  readonly sourcePhase: "EIL-6:1";
  readonly sourceCanonicalId: string;
  readonly sourceReference: string;
  readonly sourceNamespace: string;
  readonly order: number;
  readonly status: "Registered";
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Exactly nine lifecycle registry entries preserving Foundation order.
 */
export const IntegrationObservabilityLifecycleRegistry: readonly IntegrationObservabilityLifecycleRegistryRecord[] =
  Object.freeze(
    foundation.lifecycle.states.map((state, index) =>
      Object.freeze({
        id: `EIL-6:2/Lifecycle/${state}` as const,
        key: state,
        name: state,
        category: "Lifecycle" as const,
        namespace: "nexora.eil.integration-observability.registry" as const,
        sourcePhase: "EIL-6:1" as const,
        sourceCanonicalId: `${foundation.lifecycle.lifecycleId}/states/${state}`,
        sourceReference: `${foundationId}/lifecycle/states/${state}`,
        sourceNamespace: foundationNamespace,
        order: index + 1,
        status: "Registered" as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
