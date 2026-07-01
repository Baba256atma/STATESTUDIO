import { hasIdentity, getIdentity, type IdentityRegistry } from "./identityRegistryIndex.ts";
import { isIdentityScopeLevel, type IdentityScopeGraph } from "./identityScopeIndex.ts";
import { CANONICAL_ROLE_SCOPE_ALLOWANCES, IDENTITY_ROLES, ROLE_LIFECYCLE_STATES, ROLE_SCOPE_LEVELS } from "./identityRoleEnums.ts";
import type { IdentityRoleName, RoleLifecycleState, RoleScopeLevel } from "./identityRoleEnums.ts";
import type { IdentityRoleValidationIssue, IdentityRoleValidationResult } from "./identityRoleContracts.ts";
import type { RoleAssignment, RoleDefinition } from "./identityRoleTypes.ts";

export function roleIssue(
  code: IdentityRoleValidationIssue["code"],
  field: string,
  message: string
): IdentityRoleValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

export function roleValidationResult(
  issues: readonly IdentityRoleValidationIssue[]
): IdentityRoleValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

export function isIdentityRole(value: unknown): value is IdentityRoleName {
  return typeof value === "string" && IDENTITY_ROLES.includes(value as IdentityRoleName);
}

export function isRoleLifecycleState(value: unknown): value is RoleLifecycleState {
  return typeof value === "string" && ROLE_LIFECYCLE_STATES.includes(value as RoleLifecycleState);
}

export function isRoleScopeAllowed(roleName: IdentityRoleName, scopeLevel: unknown): scopeLevel is RoleScopeLevel {
  const allowedScopes: readonly RoleScopeLevel[] = CANONICAL_ROLE_SCOPE_ALLOWANCES[roleName];
  return (
    typeof scopeLevel === "string" &&
    ROLE_SCOPE_LEVELS.includes(scopeLevel as RoleScopeLevel) &&
    allowedScopes.includes(scopeLevel as RoleScopeLevel)
  );
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isValidTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && Number.isFinite(Date.parse(value));
}

function hasScopeReference(graph: IdentityScopeGraph, scopeIdentityId: string, scopeLevel: string): boolean {
  if (scopeIdentityId === "Global") return scopeLevel === "Global";
  return graph.scopes.some((scope) => scope.identityId === scopeIdentityId && scope.scopeLevel === scopeLevel);
}

export function validateRoleDefinition(definition: RoleDefinition): IdentityRoleValidationResult {
  const issues: IdentityRoleValidationIssue[] = [];

  if (!definition.roleId.trim() || !isIdentityRole(definition.roleName) || !definition.displayName.trim()) {
    issues.push(roleIssue("invalid_role_definition", "role", "Role definition requires a canonical role id, name, and display name."));
  }
  if (!isRoleLifecycleState(definition.lifecycleState)) {
    issues.push(roleIssue("invalid_lifecycle_state", "lifecycleState", "Role lifecycle state is not canonical."));
  }
  if (!isPositiveInteger(definition.version)) {
    issues.push(roleIssue("invalid_role_definition", "version", "Role definition version must be a positive integer."));
  }
  if (definition.allowedScopes.length === 0) {
    issues.push(roleIssue("invalid_role_definition", "allowedScopes", "Role definition requires at least one scope."));
  }
  definition.allowedScopes.forEach((scopeLevel, index) => {
    if (!isRoleScopeAllowed(definition.roleName, scopeLevel)) {
      issues.push(roleIssue("illegal_role_scope", `allowedScopes.${index}`, "Role scope is not allowed."));
    }
  });

  return roleValidationResult(issues);
}

export function validateRoleAssignment(
  assignment: RoleAssignment,
  registry: IdentityRegistry,
  graph: IdentityScopeGraph,
  definitions: readonly RoleDefinition[]
): IdentityRoleValidationResult {
  const issues: IdentityRoleValidationIssue[] = [];
  const definition = definitions.find((entry) => entry.roleId === assignment.roleId && entry.roleName === assignment.roleName);
  const subject = getIdentity(registry, assignment.subjectIdentityId);

  if (!definition || !validateRoleDefinition(definition).valid) {
    issues.push(roleIssue("invalid_role_definition", "roleId", "Role assignment references an invalid role definition."));
  }
  if (!subject || !hasIdentity(registry, assignment.subjectIdentityId)) {
    issues.push(roleIssue("missing_subject_identity", "subjectIdentityId", "Role assignment subject is missing."));
  } else if (subject.type !== assignment.subjectIdentityType) {
    issues.push(roleIssue("invalid_role_assignment", "subjectIdentityType", "Subject identity type does not match registry."));
  }
  if (assignment.scopeIdentityId !== "Global" && !hasIdentity(registry, assignment.scopeIdentityId)) {
    issues.push(roleIssue("missing_scope_identity", "scopeIdentityId", "Role assignment scope identity is missing."));
  }
  if (!isIdentityScopeLevel(assignment.scopeLevel)) {
    issues.push(roleIssue("invalid_scope_level", "scopeLevel", "Scope level is not canonical."));
  }
  if (isIdentityRole(assignment.roleName) && !isRoleScopeAllowed(assignment.roleName, assignment.scopeLevel)) {
    issues.push(roleIssue("illegal_role_scope", "scopeLevel", "Role is not allowed in this scope."));
  }
  if (!isRoleLifecycleState(assignment.lifecycleState)) {
    issues.push(roleIssue("invalid_lifecycle_state", "lifecycleState", "Role assignment lifecycle state is not canonical."));
  }
  if (!isValidTimestamp(assignment.assignedAt)) {
    issues.push(roleIssue("invalid_role_assignment", "assignedAt", "Role assignment timestamp is invalid."));
  }
  if (!assignment.assignedBy.trim()) {
    issues.push(roleIssue("invalid_role_assignment", "assignedBy", "Role assignment requires assignedBy metadata."));
  }
  if (!isPositiveInteger(assignment.version)) {
    issues.push(roleIssue("invalid_role_assignment", "version", "Role assignment version must be a positive integer."));
  }
  if (!hasScopeReference(graph, assignment.scopeIdentityId, assignment.scopeLevel)) {
    issues.push(roleIssue("broken_scope_reference", "scopeIdentityId", "Role assignment scope is not present in graph."));
  }

  return roleValidationResult(issues);
}

export function validateRoleAssignmentCollection(
  assignments: readonly RoleAssignment[],
  registry: IdentityRegistry,
  graph: IdentityScopeGraph,
  definitions: readonly RoleDefinition[]
): IdentityRoleValidationResult {
  const issues: IdentityRoleValidationIssue[] = [];
  const seenAssignments = new Set<string>();

  assignments.forEach((assignment, index) => {
    validateRoleAssignment(assignment, registry, graph, definitions).issues.forEach((issue) => {
      issues.push(roleIssue(issue.code, `${index}.${issue.field}`, issue.message));
    });
    if (seenAssignments.has(assignment.assignmentId)) {
      issues.push(roleIssue("duplicate_role_assignment", `${index}.assignmentId`, "Role assignment id is duplicated."));
    }
    seenAssignments.add(assignment.assignmentId);
  });

  return roleValidationResult(issues);
}
