import type { IdentityId } from "./identityIndex.ts";
import type { IdentityRegistry } from "./identityRegistryIndex.ts";
import { getIdentity } from "./identityRegistryIndex.ts";
import type { IdentityScopeGraph } from "./identityScopeIndex.ts";
import type { TenantBoundary, TenantOwnershipReference } from "./identityTenantIsolationTypes.ts";

export function resolveIdentityTenant(
  identityId: IdentityId | "Global",
  registry: IdentityRegistry,
  graph: IdentityScopeGraph,
  boundaries: readonly TenantBoundary[] = []
): IdentityId | null {
  if (identityId === "Global") return null;

  const identity = getIdentity(registry, identityId);
  if (identity?.type === "Tenant") return identity.id;

  const scope = graph.scopes.find((candidate) => candidate.identityId === identityId);
  if (scope?.tenantId) return scope.tenantId;

  const boundary = boundaries.find((candidate) => candidate.rootScopeIdentityId === identityId);
  return boundary?.tenantIdentityId ?? null;
}

export function createTenantOwnershipReference(
  identityId: IdentityId | "Global",
  registry: IdentityRegistry,
  graph: IdentityScopeGraph,
  boundaries: readonly TenantBoundary[] = []
): TenantOwnershipReference {
  const scope = identityId === "Global" ? null : graph.scopes.find((candidate) => candidate.identityId === identityId);
  return Object.freeze({
    identityId,
    tenantId: resolveIdentityTenant(identityId, registry, graph, boundaries),
    scopeLevel: identityId === "Global" ? "Global" : scope?.scopeLevel ?? "Global",
  });
}
