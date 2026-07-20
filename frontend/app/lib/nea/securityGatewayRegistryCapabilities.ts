/**
 * NEA-4:2 — Security Gateway Registry Capabilities.
 *
 * Capability registry derived from every NEA-4:1 Foundation capability.
 * Declarations only. No runtime execution.
 *
 * Ownership: owned exclusively by NEA-4:2.
 */

import {
  SecurityGatewayFoundationId,
  SecurityGatewayFoundationPlatform,
} from "./securityGatewayFoundation.ts";
import type { SecurityGatewayRegistryEntry } from "./securityGatewayRegistryTypes.ts";

const foundation = SecurityGatewayFoundationPlatform;

/** Capability registry — Foundation capability references preserved. */
export const SecurityGatewayCapabilityRegistry: readonly SecurityGatewayRegistryEntry[] =
  Object.freeze(
    foundation.capabilities.capabilities.map((item) =>
      Object.freeze({
        id: item.capabilityId,
        label: item.capabilityName,
        description: item.description,
        sourcePhase: "NEA-4:1" as const,
        foundationReference: `${SecurityGatewayFoundationId}/capabilities/${item.capabilityId}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Canonical immutable capability registry catalog. */
export const SecurityGatewayCapabilityRegistryCatalog = Object.freeze({
  catalogId: "NEA-4:2/CapabilityRegistry",
  sourcePhase: "NEA-4:2" as const,
  capabilities: SecurityGatewayCapabilityRegistry,
  capabilityCount: SecurityGatewayCapabilityRegistry.length,
  executesRuntime: false as const,
  duplicatesFoundationValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
