import { IDENTITY_TENANT_ISOLATION_CONTRACT_VERSION } from "./identityTenantIsolationEnums.ts";
import type {
  CreateTenantBoundaryInput,
  TenantBoundary,
  TenantIsolationMetadata,
} from "./identityTenantIsolationTypes.ts";

function freezeMetadata(metadata: TenantIsolationMetadata | undefined): TenantIsolationMetadata {
  return Object.freeze({ ...(metadata ?? {}) });
}

export function createTenantBoundary(input: CreateTenantBoundaryInput): TenantBoundary {
  return Object.freeze({
    contractVersion: IDENTITY_TENANT_ISOLATION_CONTRACT_VERSION,
    boundaryId: input.boundaryId ?? `tenant-boundary:${input.tenantIdentityId}`,
    tenantIdentityId: input.tenantIdentityId,
    displayName: input.displayName ?? input.tenantIdentityId,
    lifecycleState: input.lifecycleState ?? "Active",
    rootScopeIdentityId: input.rootScopeIdentityId ?? input.tenantIdentityId,
    rootScopeLevel: input.rootScopeLevel ?? "Tenant",
    metadata: freezeMetadata(input.metadata),
    version: input.version ?? 1,
  });
}
