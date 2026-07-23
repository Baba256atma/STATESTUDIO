/**
 * EIL-6:2 — Integration Observability Event Category Registry.
 *
 * Canonical registry for the eight Foundation event categories.
 * Consumes only the EIL-6:1 Foundation aggregate public surface.
 * Metadata-only. No event emission or brokers.
 *
 * Ownership: owned exclusively by EIL-6:2.
 */

import { IntegrationObservabilityFoundationPlatform } from "./integrationObservabilityFoundation.ts";

const foundation = IntegrationObservabilityFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

/** Immutable event-category registry record. */
export interface IntegrationObservabilityEventRegistryRecord {
  readonly id: `EIL-6:2/EventCategory/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "EventCategory";
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
 * Exactly eight event-category registry entries preserving Foundation order.
 */
export const IntegrationObservabilityEventRegistry: readonly IntegrationObservabilityEventRegistryRecord[] =
  Object.freeze(
    foundation.eventCategories.map((item) =>
      Object.freeze({
        id: `EIL-6:2/EventCategory/${item.categoryKey}` as const,
        key: item.categoryKey,
        name: item.canonicalName,
        category: "EventCategory" as const,
        namespace: "nexora.eil.integration-observability.registry" as const,
        sourcePhase: "EIL-6:1" as const,
        sourceCanonicalId: item.categoryId,
        sourceReference: `${foundationId}/eventCategories/${item.categoryKey}`,
        sourceNamespace: foundationNamespace,
        order: item.deterministicOrder,
        status: "Registered" as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
