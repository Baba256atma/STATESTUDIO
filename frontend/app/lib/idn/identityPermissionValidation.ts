import { getIdentity, hasIdentity, type IdentityRegistry } from "./identityRegistryIndex.ts";
import { isIdentityScopeLevel, type IdentityScopeGraph } from "./identityScopeIndex.ts";
import type { RoleDefinition } from "./identityRoleIndex.ts";
import {
  PERMISSION_ACTIONS,
  PERMISSION_LIFECYCLE_STATES,
  PERMISSION_RESOURCES,
  PERMISSION_SCOPE_LEVELS,
  PERMISSION_SUBJECT_TYPES,
} from "./identityPermissionEnums.ts";
import type {
  PermissionAction,
  PermissionLifecycleState,
  PermissionResource,
  PermissionScopeLevel,
  PermissionSubjectType,
} from "./identityPermissionEnums.ts";
import type {
  IdentityPermissionValidationIssue,
  IdentityPermissionValidationResult,
} from "./identityPermissionContracts.ts";
import type { PermissionAssignment, PermissionDefinition } from "./identityPermissionTypes.ts";

export function permissionIssue(
  code: IdentityPermissionValidationIssue["code"],
  field: string,
  message: string
): IdentityPermissionValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

export function permissionValidationResult(
  issues: readonly IdentityPermissionValidationIssue[]
): IdentityPermissionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

export function isPermissionAction(value: unknown): value is PermissionAction {
  return typeof value === "string" && PERMISSION_ACTIONS.includes(value as PermissionAction);
}

export function isPermissionResource(value: unknown): value is PermissionResource {
  return typeof value === "string" && PERMISSION_RESOURCES.includes(value as PermissionResource);
}

export function isPermissionLifecycleState(value: unknown): value is PermissionLifecycleState {
  return typeof value === "string" && PERMISSION_LIFECYCLE_STATES.includes(value as PermissionLifecycleState);
}

export function isPermissionSubjectType(value: unknown): value is PermissionSubjectType {
  return typeof value === "string" && PERMISSION_SUBJECT_TYPES.includes(value as PermissionSubjectType);
}

function isPermissionScopeLevel(value: unknown): value is PermissionScopeLevel {
  return typeof value === "string" && PERMISSION_SCOPE_LEVELS.includes(value as PermissionScopeLevel);
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

function hasRoleDefinition(definitions: readonly RoleDefinition[], roleId: string | null): boolean {
  return Boolean(roleId && definitions.some((definition) => definition.roleId === roleId));
}

export function validatePermissionDefinition(
  definition: PermissionDefinition
): IdentityPermissionValidationResult {
  const issues: IdentityPermissionValidationIssue[] = [];

  if (!definition.permissionId.trim() || !definition.displayName.trim()) {
    issues.push(
      permissionIssue("invalid_permission_definition", "permission", "Permission definition requires id and display name.")
    );
  }
  if (!isPermissionAction(definition.action)) {
    issues.push(permissionIssue("invalid_action", "action", "Permission action is not canonical."));
  }
  if (!isPermissionResource(definition.resource)) {
    issues.push(permissionIssue("invalid_resource", "resource", "Permission resource is not canonical."));
  }
  if (!isPermissionLifecycleState(definition.lifecycleState)) {
    issues.push(permissionIssue("invalid_lifecycle", "lifecycleState", "Permission lifecycle is not canonical."));
  }
  if (!isPositiveInteger(definition.version)) {
    issues.push(permissionIssue("invalid_permission_definition", "version", "Permission version must be a positive integer."));
  }

  return permissionValidationResult(issues);
}

export function validatePermissionAssignment(
  assignment: PermissionAssignment,
  registry: IdentityRegistry,
  graph: IdentityScopeGraph,
  definitions: readonly PermissionDefinition[],
  roleDefinitions: readonly RoleDefinition[]
): IdentityPermissionValidationResult {
  const issues: IdentityPermissionValidationIssue[] = [];
  const definition = definitions.find(
    (entry) =>
      entry.permissionId === assignment.permissionId &&
      entry.action === assignment.action &&
      entry.resource === assignment.resource
  );

  if (!definition || !validatePermissionDefinition(definition).valid) {
    issues.push(
      permissionIssue("invalid_permission_definition", "permissionId", "Assignment references invalid permission definition.")
    );
  }
  if (!isPermissionAction(assignment.action)) {
    issues.push(permissionIssue("invalid_action", "action", "Permission assignment action is not canonical."));
  }
  if (!isPermissionResource(assignment.resource)) {
    issues.push(permissionIssue("invalid_resource", "resource", "Permission assignment resource is not canonical."));
  }
  if (!isPermissionSubjectType(assignment.subjectType)) {
    issues.push(permissionIssue("invalid_subject_type", "subjectType", "Permission subject type is not canonical."));
  }
  if (assignment.subjectType === "Identity") {
    if (!assignment.subjectIdentityId) {
      issues.push(permissionIssue("missing_subject", "subjectIdentityId", "Identity subject is required."));
    } else if (!hasIdentity(registry, assignment.subjectIdentityId) || !getIdentity(registry, assignment.subjectIdentityId)) {
      issues.push(permissionIssue("broken_identity_reference", "subjectIdentityId", "Identity subject is missing."));
    }
  }
  if (assignment.subjectType === "Role") {
    if (!assignment.roleId) {
      issues.push(permissionIssue("missing_subject", "roleId", "Role subject is required."));
    } else if (!hasRoleDefinition(roleDefinitions, assignment.roleId)) {
      issues.push(permissionIssue("broken_role_reference", "roleId", "Role subject is missing."));
    }
  }
  if (!isIdentityScopeLevel(assignment.scopeLevel) || !isPermissionScopeLevel(assignment.scopeLevel)) {
    issues.push(permissionIssue("invalid_scope", "scopeLevel", "Permission scope level is not canonical."));
  }
  if (assignment.scopeIdentityId !== "Global" && !hasIdentity(registry, assignment.scopeIdentityId)) {
    issues.push(permissionIssue("invalid_scope", "scopeIdentityId", "Permission scope identity is missing."));
  }
  if (!hasScopeReference(graph, assignment.scopeIdentityId, assignment.scopeLevel)) {
    issues.push(permissionIssue("invalid_scope", "scopeIdentityId", "Permission scope is not present in graph."));
  }
  if (!isPermissionLifecycleState(assignment.lifecycleState)) {
    issues.push(permissionIssue("invalid_lifecycle", "lifecycleState", "Permission assignment lifecycle is not canonical."));
  }
  if (!isValidTimestamp(assignment.assignedAt)) {
    issues.push(permissionIssue("invalid_permission_assignment", "assignedAt", "Permission assignment timestamp is invalid."));
  }
  if (!assignment.assignedBy.trim()) {
    issues.push(permissionIssue("invalid_permission_assignment", "assignedBy", "Permission assignment requires assignedBy metadata."));
  }
  if (!isPositiveInteger(assignment.version)) {
    issues.push(permissionIssue("invalid_permission_assignment", "version", "Permission assignment version must be positive."));
  }

  return permissionValidationResult(issues);
}

export function validatePermissionAssignmentCollection(
  assignments: readonly PermissionAssignment[],
  registry: IdentityRegistry,
  graph: IdentityScopeGraph,
  definitions: readonly PermissionDefinition[],
  roleDefinitions: readonly RoleDefinition[]
): IdentityPermissionValidationResult {
  const issues: IdentityPermissionValidationIssue[] = [];
  const seenAssignments = new Set<string>();

  assignments.forEach((assignment, index) => {
    validatePermissionAssignment(assignment, registry, graph, definitions, roleDefinitions).issues.forEach((issue) => {
      issues.push(permissionIssue(issue.code, `${index}.${issue.field}`, issue.message));
    });
    if (seenAssignments.has(assignment.assignmentId)) {
      issues.push(permissionIssue("duplicate_assignment", `${index}.assignmentId`, "Permission assignment id is duplicated."));
    }
    seenAssignments.add(assignment.assignmentId);
  });

  return permissionValidationResult(issues);
}
