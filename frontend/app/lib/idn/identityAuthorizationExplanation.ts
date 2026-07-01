import type { AuthorizationExplanation } from "./identityAuthorizationTypes.ts";
import type { AuthorizationReason } from "./identityAuthorizationEnums.ts";
import type { PermissionAssignment } from "./identityPermissionIndex.ts";
import type { RoleAssignment } from "./identityRoleIndex.ts";

export function explainAuthorizationDecision(input: {
  evaluatedIdentity: string | null;
  evaluatedScope: string | "Global" | null;
  evaluatedRoles: readonly RoleAssignment[];
  evaluatedPermissions: readonly PermissionAssignment[];
  matchedPermissions: readonly PermissionAssignment[];
  reasons: readonly AuthorizationReason[];
}): AuthorizationExplanation {
  const matchedPermissionIds = new Set(input.matchedPermissions.map((permission) => permission.permissionId));
  return Object.freeze({
    evaluatedIdentity: input.evaluatedIdentity,
    evaluatedScope: input.evaluatedScope,
    evaluatedRoles: Object.freeze(input.evaluatedRoles.map((role) => role.roleId).sort((left, right) => left.localeCompare(right))),
    evaluatedPermissions: Object.freeze(
      input.evaluatedPermissions.map((permission) => permission.permissionId).sort((left, right) => left.localeCompare(right))
    ),
    matchedPermission: input.matchedPermissions[0]?.permissionId ?? null,
    unmatchedPermissions: Object.freeze(
      input.evaluatedPermissions
        .filter((permission) => !matchedPermissionIds.has(permission.permissionId))
        .map((permission) => permission.permissionId)
        .sort((left, right) => left.localeCompare(right))
    ),
    reasons: Object.freeze([...input.reasons]),
  });
}

export function getMatchedPermissions(explanation: AuthorizationExplanation): readonly string[] {
  return Object.freeze(explanation.matchedPermission ? [explanation.matchedPermission] : []);
}

export function getMatchedRoles(explanation: AuthorizationExplanation): readonly string[] {
  return Object.freeze([...explanation.evaluatedRoles]);
}
