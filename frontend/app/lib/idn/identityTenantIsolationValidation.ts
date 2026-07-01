import type { IdentityId } from "./identityIndex.ts";
import { getIdentity, hasIdentity, type IdentityRegistry } from "./identityRegistryIndex.ts";
import { isIdentityScopeLevel, type IdentityOwnershipRecord, type IdentityScopeGraph } from "./identityScopeIndex.ts";
import type { RoleAssignment } from "./identityRoleIndex.ts";
import type { PermissionAssignment } from "./identityPermissionIndex.ts";
import type { SessionMetadata } from "./identitySessionIndex.ts";
import type { AuditEvent } from "./identityAuditIndex.ts";
import { TENANT_BOUNDARY_LIFECYCLE_STATES } from "./identityTenantIsolationEnums.ts";
import type { TenantBoundaryLifecycleState } from "./identityTenantIsolationEnums.ts";
import { resolveIdentityTenant } from "./identityTenantIsolationResolver.ts";
import type {
  CrossTenantViolation,
  TenantBoundary,
  TenantIsolationResult,
  TenantIsolationValidationCode,
} from "./identityTenantIsolationTypes.ts";
import type {
  IdentityTenantIsolationValidationIssue,
  IdentityTenantIsolationValidationResult,
} from "./identityTenantIsolationContracts.ts";

export function isTenantBoundaryLifecycleState(value: unknown): value is TenantBoundaryLifecycleState {
  return typeof value === "string" && TENANT_BOUNDARY_LIFECYCLE_STATES.includes(value as TenantBoundaryLifecycleState);
}

export function tenantIsolationIssue(
  code: TenantIsolationValidationCode,
  field: string,
  message: string,
  sourceTenantId: IdentityId | null,
  targetTenantId: IdentityId | null
): IdentityTenantIsolationValidationIssue {
  return Object.freeze({ code, field, message, sourceTenantId, targetTenantId, severity: "error" as const });
}

export function tenantIsolationResult(
  tenantId: IdentityId | null,
  issues: readonly IdentityTenantIsolationValidationIssue[]
): IdentityTenantIsolationValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    tenantId,
    violations: Object.freeze([...issues]),
    issues: Object.freeze([...issues]),
  });
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function scopeExists(graph: IdentityScopeGraph, identityId: IdentityId | "Global"): boolean {
  if (identityId === "Global") return true;
  return graph.scopes.some((scope) => scope.identityId === identityId);
}

function sameTenantOrGlobal(sourceTenantId: IdentityId | null, targetTenantId: IdentityId | null): boolean {
  return sourceTenantId === null || targetTenantId === null || sourceTenantId === targetTenantId;
}

function compareTenants(
  code: TenantIsolationValidationCode,
  field: string,
  label: string,
  sourceTenantId: IdentityId | null,
  targetTenantId: IdentityId | null
): readonly IdentityTenantIsolationValidationIssue[] {
  if (sameTenantOrGlobal(sourceTenantId, targetTenantId)) return Object.freeze([]);
  return Object.freeze([
    tenantIsolationIssue(code, field, `${label} crosses tenant boundaries.`, sourceTenantId, targetTenantId),
  ]);
}

function resultFromComparisons(
  tenantId: IdentityId | null,
  comparisons: readonly (readonly IdentityTenantIsolationValidationIssue[])[]
): IdentityTenantIsolationValidationResult {
  const issues = comparisons.flat();
  return tenantIsolationResult(tenantId, issues);
}

export function validateTenantBoundary(
  boundary: TenantBoundary,
  registry: IdentityRegistry,
  graph: IdentityScopeGraph
): IdentityTenantIsolationValidationResult {
  const issues: IdentityTenantIsolationValidationIssue[] = [];
  const tenant = getIdentity(registry, boundary.tenantIdentityId);

  if (!boundary.boundaryId.trim() || !boundary.displayName.trim() || !isPositiveInteger(boundary.version)) {
    issues.push(
      tenantIsolationIssue(
        "invalid_tenant_boundary",
        "boundary",
        "Tenant boundary requires id, display name, and version.",
        boundary.tenantIdentityId,
        null
      )
    );
  }
  if (!tenant || tenant.type !== "Tenant") {
    issues.push(
      tenantIsolationIssue(
        "missing_tenant",
        "tenantIdentityId",
        "Tenant boundary tenant is missing or invalid.",
        boundary.tenantIdentityId,
        null
      )
    );
  }
  if (!isTenantBoundaryLifecycleState(boundary.lifecycleState)) {
    issues.push(
      tenantIsolationIssue(
        "invalid_lifecycle",
        "lifecycleState",
        "Tenant boundary lifecycle is not canonical.",
        boundary.tenantIdentityId,
        null
      )
    );
  }
  if (!isIdentityScopeLevel(boundary.rootScopeLevel) || !scopeExists(graph, boundary.rootScopeIdentityId)) {
    issues.push(
      tenantIsolationIssue(
        "invalid_scope_tenant",
        "rootScopeIdentityId",
        "Tenant boundary root scope is invalid.",
        boundary.tenantIdentityId,
        null
      )
    );
  }

  return tenantIsolationResult(boundary.tenantIdentityId, issues);
}

export function validateIdentityTenantIsolation(
  identityId: IdentityId | "Global",
  expectedTenantId: IdentityId | null,
  registry: IdentityRegistry,
  graph: IdentityScopeGraph,
  boundaries: readonly TenantBoundary[] = []
): IdentityTenantIsolationValidationResult {
  const actualTenantId = resolveIdentityTenant(identityId, registry, graph, boundaries);
  const issues: IdentityTenantIsolationValidationIssue[] = [];

  if (identityId !== "Global" && !hasIdentity(registry, identityId)) {
    issues.push(
      tenantIsolationIssue("missing_identity_scope", "identityId", "Identity is missing from registry.", null, expectedTenantId)
    );
  }
  if (identityId !== "Global" && !scopeExists(graph, identityId) && actualTenantId === null) {
    issues.push(
      tenantIsolationIssue(
        "missing_identity_scope",
        "identityId",
        "Identity has no resolvable tenant scope.",
        actualTenantId,
        expectedTenantId
      )
    );
  }
  issues.push(
    ...compareTenants(
      "cross_tenant_violation",
      "tenantId",
      "Identity tenant isolation",
      actualTenantId,
      expectedTenantId
    )
  );

  return tenantIsolationResult(actualTenantId, issues);
}

export function validateOwnershipTenantIsolation(
  record: IdentityOwnershipRecord,
  registry: IdentityRegistry,
  graph: IdentityScopeGraph,
  boundaries: readonly TenantBoundary[] = []
): IdentityTenantIsolationValidationResult {
  const ownerTenantId = resolveIdentityTenant(record.ownerIdentityId, registry, graph, boundaries);
  const childTenantId = resolveIdentityTenant(record.childIdentityId, registry, graph, boundaries);
  return resultFromComparisons(childTenantId, [
    compareTenants("invalid_ownership_tenant", "ownership", "Ownership", ownerTenantId, childTenantId),
    compareTenants("invalid_ownership_tenant", "record.tenantId", "Ownership record tenant", record.tenantId, childTenantId),
  ]);
}

export function validateRoleTenantIsolation(
  assignment: RoleAssignment,
  registry: IdentityRegistry,
  graph: IdentityScopeGraph,
  boundaries: readonly TenantBoundary[] = []
): IdentityTenantIsolationValidationResult {
  const subjectTenantId = resolveIdentityTenant(assignment.subjectIdentityId, registry, graph, boundaries);
  const scopeTenantId = resolveIdentityTenant(assignment.scopeIdentityId, registry, graph, boundaries);
  const assignedByTenantId = resolveIdentityTenant(assignment.assignedBy, registry, graph, boundaries);
  return resultFromComparisons(scopeTenantId, [
    compareTenants("invalid_role_tenant", "subjectIdentityId", "Role subject", subjectTenantId, scopeTenantId),
    compareTenants("invalid_role_tenant", "assignedBy", "Role assigner", assignedByTenantId, scopeTenantId),
  ]);
}

export function validatePermissionTenantIsolation(
  assignment: PermissionAssignment,
  registry: IdentityRegistry,
  graph: IdentityScopeGraph,
  boundaries: readonly TenantBoundary[] = []
): IdentityTenantIsolationValidationResult {
  const subjectTenantId = assignment.subjectIdentityId
    ? resolveIdentityTenant(assignment.subjectIdentityId, registry, graph, boundaries)
    : null;
  const scopeTenantId = resolveIdentityTenant(assignment.scopeIdentityId, registry, graph, boundaries);
  const assignedByTenantId = resolveIdentityTenant(assignment.assignedBy, registry, graph, boundaries);
  return resultFromComparisons(scopeTenantId, [
    compareTenants("invalid_permission_tenant", "subjectIdentityId", "Permission subject", subjectTenantId, scopeTenantId),
    compareTenants("invalid_permission_tenant", "assignedBy", "Permission assigner", assignedByTenantId, scopeTenantId),
  ]);
}

export function validateSessionTenantIsolation(
  session: SessionMetadata,
  registry: IdentityRegistry,
  graph: IdentityScopeGraph,
  boundaries: readonly TenantBoundary[] = []
): IdentityTenantIsolationValidationResult {
  const subjectTenantId = resolveIdentityTenant(session.subjectIdentityId, registry, graph, boundaries);
  const sessionIdentityTenantId = resolveIdentityTenant(session.sessionIdentityId, registry, graph, boundaries);
  const activeScopeTenantId = resolveIdentityTenant(session.scope.activeScopeIdentityId, registry, graph, boundaries);
  return resultFromComparisons(activeScopeTenantId, [
    compareTenants("invalid_session_tenant", "subjectIdentityId", "Session subject", subjectTenantId, activeScopeTenantId),
    compareTenants(
      "invalid_session_tenant",
      "sessionIdentityId",
      "Session identity",
      sessionIdentityTenantId,
      activeScopeTenantId
    ),
    compareTenants("invalid_session_tenant", "scope.tenantId", "Session scope tenant", session.scope.tenantId, activeScopeTenantId),
  ]);
}

export function validateAuditTenantIsolation(
  event: AuditEvent,
  registry: IdentityRegistry,
  graph: IdentityScopeGraph,
  boundaries: readonly TenantBoundary[] = []
): IdentityTenantIsolationValidationResult {
  const actorTenantId = resolveIdentityTenant(event.actor.actorIdentityId, registry, graph, boundaries);
  const targetTenantId = resolveIdentityTenant(event.target.targetIdentityId, registry, graph, boundaries);
  const scopeTenantId = resolveIdentityTenant(event.scope.scopeIdentityId, registry, graph, boundaries);
  const sessionTenantId = event.session.sessionIdentityId
    ? resolveIdentityTenant(event.session.sessionIdentityId, registry, graph, boundaries)
    : null;
  return resultFromComparisons(scopeTenantId, [
    compareTenants("invalid_audit_tenant", "actor", "Audit actor", actorTenantId, scopeTenantId),
    compareTenants("invalid_audit_tenant", "target", "Audit target", targetTenantId, scopeTenantId),
    compareTenants("invalid_audit_tenant", "session", "Audit session", sessionTenantId, scopeTenantId),
  ]);
}

export function detectCrossTenantViolations(results: readonly TenantIsolationResult[]): readonly CrossTenantViolation[] {
  return Object.freeze(results.flatMap((result) => [...result.violations]));
}
