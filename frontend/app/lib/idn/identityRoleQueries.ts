import { IDENTITY_ROLES } from "./identityRoleEnums.ts";
import { createRoleDefinition } from "./identityRoleFactory.ts";
import type { IdentityRoleName } from "./identityRoleEnums.ts";
import type { RoleAssignment, RoleDefinition } from "./identityRoleTypes.ts";

export function listCanonicalRoles(): readonly RoleDefinition[] {
  return Object.freeze(IDENTITY_ROLES.map((roleName) => createRoleDefinition({ roleName })));
}

export function getRoleAssignmentsForIdentity(
  assignments: readonly RoleAssignment[],
  subjectIdentityId: string
): readonly RoleAssignment[] {
  return Object.freeze(
    assignments
      .filter((assignment) => assignment.subjectIdentityId === subjectIdentityId)
      .sort((left, right) => left.assignmentId.localeCompare(right.assignmentId))
  );
}

export function getRoleAssignmentsForScope(
  assignments: readonly RoleAssignment[],
  scopeIdentityId: string
): readonly RoleAssignment[] {
  return Object.freeze(
    assignments
      .filter((assignment) => assignment.scopeIdentityId === scopeIdentityId)
      .sort((left, right) => left.assignmentId.localeCompare(right.assignmentId))
  );
}

export function getCanonicalRoleDefinition(roleName: IdentityRoleName): RoleDefinition {
  return createRoleDefinition({ roleName });
}
