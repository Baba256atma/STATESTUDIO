/**
 * NEA-8:2 — Executive Gateway Suite Registry Capabilities.
 *
 * Capability registry derived from every NEA-8:1 Foundation suite capability.
 * Declarations only. No runtime execution. No duplication of Foundation values.
 *
 * Ownership: owned exclusively by NEA-8:2.
 */

import {
  ExecutiveGatewaySuiteFoundationId,
  ExecutiveGatewaySuiteFoundationPlatform,
} from "./executiveGatewaySuiteFoundation.ts";
import type { ExecutiveGatewaySuiteRegistryEntry } from "./executiveGatewaySuiteRegistryTypes.ts";

const foundation = ExecutiveGatewaySuiteFoundationPlatform;

/** Capability registry — Foundation capability references preserved. */
export const ExecutiveGatewaySuiteCapabilityRegistry: readonly ExecutiveGatewaySuiteRegistryEntry[] =
  Object.freeze(
    foundation.capabilities.capabilities.map((item) =>
      Object.freeze({
        id: item.capabilityId,
        label: item.capabilityName,
        description: item.description,
        sourcePhase: "NEA-8:1" as const,
        foundationReference: `${ExecutiveGatewaySuiteFoundationId}/capabilities/${item.capabilityId}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Canonical immutable capability registry catalog. */
export const ExecutiveGatewaySuiteCapabilityRegistryCatalog = Object.freeze({
  catalogId: "NEA-8:2/CapabilityRegistry",
  sourcePhase: "NEA-8:2" as const,
  capabilities: ExecutiveGatewaySuiteCapabilityRegistry,
  capabilityCount: ExecutiveGatewaySuiteCapabilityRegistry.length,
  executesRuntime: false as const,
  duplicatesFoundationValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
