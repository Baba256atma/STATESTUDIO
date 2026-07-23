/**
 * EIL-8:2 — Executive Integration Suite Domain Registry.
 *
 * Canonical registry for the eight Foundation suite domains.
 * Consumes only the EIL-8:1 Foundation aggregate public surface.
 * Metadata-only. No domain runtime behavior.
 *
 * Ownership: owned exclusively by EIL-8:2.
 */

import { ExecutiveIntegrationSuiteFoundation } from "./executiveIntegrationSuiteFoundation.ts";

const foundation = ExecutiveIntegrationSuiteFoundation;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.namespace;

/** Immutable domain registry record. */
export interface ExecutiveIntegrationSuiteDomainRegistryRecord {
  readonly id: `EIL-8:2/Domain/${string}`;
  readonly key: string;
  readonly name: string;
  readonly category: "Domain";
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
 * Exactly eight domain registry entries preserving Foundation order.
 */
export const ExecutiveIntegrationSuiteDomainRegistry: readonly ExecutiveIntegrationSuiteDomainRegistryRecord[] =
  Object.freeze(
    foundation.domains.map((item) =>
      Object.freeze({
        id: `EIL-8:2/Domain/${item.domainKey}` as const,
        key: item.domainKey,
        name: item.canonicalName,
        category: "Domain" as const,
        namespace: "nexora.eil.executive-integration-suite.registry" as const,
        sourcePhase: "EIL-8:1" as const,
        sourceCanonicalId: item.domainId,
        sourceReference: `${foundationId}/domains/${item.domainKey}`,
        sourceNamespace: foundationNamespace,
        order: item.order,
        status: "Registered" as const,
        foundationReference: item,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );
