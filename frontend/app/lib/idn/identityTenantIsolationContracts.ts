import type { CrossTenantViolation, TenantIsolationResult } from "./identityTenantIsolationTypes.ts";

export type IdentityTenantIsolationValidationSeverity = "error";

export type IdentityTenantIsolationValidationIssue = CrossTenantViolation &
  Readonly<{
    severity: IdentityTenantIsolationValidationSeverity;
  }>;

export type IdentityTenantIsolationValidationResult = TenantIsolationResult &
  Readonly<{
    issues: readonly IdentityTenantIsolationValidationIssue[];
  }>;
