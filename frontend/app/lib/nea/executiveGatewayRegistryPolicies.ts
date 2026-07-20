/**
 * NEA-1:2 — Executive Gateway Registry Policies.
 *
 * Immutable policy registry derived from NEA-1:1 Foundation policies.
 * Declarations only. No policy execution.
 *
 * Ownership: owned exclusively by NEA-1:2.
 */

import {
  ExecutiveGatewayFoundationId,
  ExecutiveGatewayFoundationPlatform,
} from "./executiveGatewayFoundation.ts";
import type { ExecutiveGatewayRegistryEntry } from "./executiveGatewayRegistryTypes.ts";

const foundation = ExecutiveGatewayFoundationPlatform;

/** Policy registry — Foundation policy references preserved. */
export const ExecutiveGatewayPolicyRegistry: readonly ExecutiveGatewayRegistryEntry[] =
  Object.freeze(
    foundation.policies.map((item) =>
      Object.freeze({
        id: item.policyId,
        label: item.policyName,
        description: item.statement,
        sourcePhase: "NEA-1:1" as const,
        foundationReference: `${ExecutiveGatewayFoundationId}/policies/${item.policyId}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Canonical immutable policy registry catalog. */
export const ExecutiveGatewayPolicyRegistryCatalog = Object.freeze({
  catalogId: "NEA-1:2/PolicyRegistry",
  sourcePhase: "NEA-1:2" as const,
  policies: ExecutiveGatewayPolicyRegistry,
  policyCount: ExecutiveGatewayPolicyRegistry.length,
  executesPolicies: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
