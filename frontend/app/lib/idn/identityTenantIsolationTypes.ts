import type { IdentityId } from "./identityIndex.ts";
import type { IdentityScopeLevel } from "./identityScopeIndex.ts";
import type { TenantBoundaryLifecycleState } from "./identityTenantIsolationEnums.ts";

export type TenantIsolationMetadataValue = string | number | boolean | null;

export type TenantIsolationMetadata = Readonly<Record<string, TenantIsolationMetadataValue>>;

export type TenantBoundary = Readonly<{
  contractVersion: "IDN-9";
  boundaryId: string;
  tenantIdentityId: IdentityId;
  displayName: string;
  lifecycleState: TenantBoundaryLifecycleState;
  rootScopeIdentityId: IdentityId;
  rootScopeLevel: IdentityScopeLevel;
  metadata: TenantIsolationMetadata;
  version: number;
}>;

export type CreateTenantBoundaryInput = Readonly<{
  boundaryId?: string;
  tenantIdentityId: IdentityId;
  displayName?: string;
  lifecycleState?: TenantBoundaryLifecycleState;
  rootScopeIdentityId?: IdentityId;
  rootScopeLevel?: IdentityScopeLevel;
  metadata?: TenantIsolationMetadata;
  version?: number;
}>;

export type TenantOwnershipReference = Readonly<{
  identityId: IdentityId | "Global";
  tenantId: IdentityId | null;
  scopeLevel: IdentityScopeLevel | "Global";
}>;

export type CrossTenantViolation = Readonly<{
  code: TenantIsolationValidationCode;
  field: string;
  message: string;
  sourceTenantId: IdentityId | null;
  targetTenantId: IdentityId | null;
}>;

export type TenantScopeValidation = Readonly<{
  identityId: IdentityId | "Global";
  expectedTenantId: IdentityId | null;
  actualTenantId: IdentityId | null;
  valid: boolean;
}>;

export type TenantIsolationResult = Readonly<{
  valid: boolean;
  tenantId: IdentityId | null;
  violations: readonly CrossTenantViolation[];
}>;

export type TenantIsolationValidationCode =
  | "invalid_tenant_boundary"
  | "invalid_lifecycle"
  | "missing_tenant"
  | "missing_identity_scope"
  | "cross_tenant_violation"
  | "invalid_scope_tenant"
  | "invalid_ownership_tenant"
  | "invalid_role_tenant"
  | "invalid_permission_tenant"
  | "invalid_session_tenant"
  | "invalid_audit_tenant";
