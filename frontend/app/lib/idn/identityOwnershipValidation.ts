import type { IdentityRegistry } from "./identityRegistryIndex.ts";
import { getIdentity, hasIdentity } from "./identityRegistryIndex.ts";
import type { IdentityOwnershipRecord } from "./identityOwnershipTypes.ts";
import type {
  IdentityScopeValidationIssue,
  IdentityScopeValidationResult,
} from "./identityScopeContracts.ts";
import { isIdentityScopeLevel, isLegalOwnership } from "./identityScopeRules.ts";
import type { IdentityScope } from "./identityScopeTypes.ts";

export function scopeIssue(
  code: IdentityScopeValidationIssue["code"],
  field: string,
  message: string
): IdentityScopeValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

export function scopeValidationResult(
  issues: readonly IdentityScopeValidationIssue[]
): IdentityScopeValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

export function validateIdentityScope(scope: IdentityScope): IdentityScopeValidationResult {
  const issues: IdentityScopeValidationIssue[] = [];

  if (!scope.identityId.trim()) {
    issues.push(scopeIssue("invalid_identity", "identityId", "Scope identity id is required."));
  }
  if (!isIdentityScopeLevel(scope.scopeLevel)) {
    issues.push(scopeIssue("invalid_scope_level", "scopeLevel", "Scope level is not canonical."));
  }
  if (!scope.path.includes(scope.identityId)) {
    issues.push(scopeIssue("scope_path_inconsistent", "path", "Scope path must include the scoped identity."));
  }
  if (scope.path[scope.path.length - 1] !== scope.identityId) {
    issues.push(scopeIssue("scope_path_inconsistent", "path", "Scope path must end with the scoped identity."));
  }
  if (scope.parentIdentityId && !scope.path.includes(scope.parentIdentityId)) {
    issues.push(scopeIssue("invalid_parent", "parentIdentityId", "Parent identity must be present in scope path."));
  }
  if (scope.ownerIdentityId && scope.ownerIdentityId === scope.identityId) {
    issues.push(scopeIssue("circular_ownership", "ownerIdentityId", "Identity cannot own itself."));
  }

  return scopeValidationResult(issues);
}

export function validateOwnershipRecord(
  record: IdentityOwnershipRecord,
  registry: IdentityRegistry
): IdentityScopeValidationResult {
  const issues: IdentityScopeValidationIssue[] = [];
  const ownerIdentity =
    record.ownerIdentityId === "Global" ? null : getIdentity(registry, record.ownerIdentityId);
  const childIdentity = getIdentity(registry, record.childIdentityId);

  if (record.ownerIdentityId !== "Global" && !ownerIdentity) {
    issues.push(scopeIssue("missing_owner", "ownerIdentityId", "Ownership owner is missing from registry."));
  }
  if (!childIdentity || !hasIdentity(registry, record.childIdentityId)) {
    issues.push(scopeIssue("orphaned_identity", "childIdentityId", "Ownership child is missing from registry."));
  }
  if (ownerIdentity && ownerIdentity.type !== record.ownerIdentityType) {
    issues.push(scopeIssue("invalid_identity", "ownerIdentityType", "Owner identity type does not match registry."));
  }
  if (childIdentity && childIdentity.type !== record.childIdentityType) {
    issues.push(scopeIssue("invalid_identity", "childIdentityType", "Child identity type does not match registry."));
  }
  if (
    !isIdentityScopeLevel(record.ownerScopeLevel) ||
    !isIdentityScopeLevel(record.childScopeLevel) ||
    !isLegalOwnership(
      record.ownerIdentityType,
      record.childIdentityType,
      record.ownerScopeLevel,
      record.childScopeLevel
    )
  ) {
    issues.push(scopeIssue("illegal_containment", "ownership", "Ownership containment is not legal."));
  }
  if (record.ownerIdentityId === record.childIdentityId) {
    issues.push(scopeIssue("circular_ownership", "childIdentityId", "Ownership cannot target itself."));
  }

  return scopeValidationResult(issues);
}

export function validateCrossTenantOwnership(
  record: IdentityOwnershipRecord,
  ownerScope: IdentityScope | null,
  childScope: IdentityScope | null
): IdentityScopeValidationResult {
  if (!ownerScope || !childScope || !ownerScope.tenantId || !childScope.tenantId) {
    return scopeValidationResult([]);
  }
  if (ownerScope.tenantId === childScope.tenantId) {
    return scopeValidationResult([]);
  }
  return scopeValidationResult([
    scopeIssue("invalid_cross_tenant", "tenantId", `Cross-tenant ownership is invalid for ${record.recordId}.`),
  ]);
}
