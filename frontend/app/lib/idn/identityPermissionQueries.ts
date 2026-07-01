import { PERMISSION_ACTIONS, PERMISSION_RESOURCES } from "./identityPermissionEnums.ts";
import type { PermissionAction, PermissionResource } from "./identityPermissionEnums.ts";
import type { PermissionAssignment } from "./identityPermissionTypes.ts";

export function listCanonicalPermissionActions(): readonly PermissionAction[] {
  return PERMISSION_ACTIONS;
}

export function listCanonicalPermissionResources(): readonly PermissionResource[] {
  return PERMISSION_RESOURCES;
}

export function getPermissionAssignmentsForIdentity(
  assignments: readonly PermissionAssignment[],
  subjectIdentityId: string
): readonly PermissionAssignment[] {
  return Object.freeze(
    assignments
      .filter((assignment) => assignment.subjectIdentityId === subjectIdentityId)
      .sort((left, right) => left.assignmentId.localeCompare(right.assignmentId))
  );
}

export function getPermissionAssignmentsForRole(
  assignments: readonly PermissionAssignment[],
  roleId: string
): readonly PermissionAssignment[] {
  return Object.freeze(
    assignments
      .filter((assignment) => assignment.roleId === roleId)
      .sort((left, right) => left.assignmentId.localeCompare(right.assignmentId))
  );
}

export function getPermissionAssignmentsForScope(
  assignments: readonly PermissionAssignment[],
  scopeIdentityId: string
): readonly PermissionAssignment[] {
  return Object.freeze(
    assignments
      .filter((assignment) => assignment.scopeIdentityId === scopeIdentityId)
      .sort((left, right) => left.assignmentId.localeCompare(right.assignmentId))
  );
}
