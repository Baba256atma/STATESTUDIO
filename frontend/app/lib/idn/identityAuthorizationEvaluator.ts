import type { IdentityRegistry } from "./identityRegistryIndex.ts";
import type { IdentityScopeGraph } from "./identityScopeIndex.ts";
import type { PermissionAssignment } from "./identityPermissionIndex.ts";
import type { RoleAssignment } from "./identityRoleIndex.ts";
import { createAuthorizationDecision } from "./identityAuthorizationFactory.ts";
import { explainAuthorizationDecision } from "./identityAuthorizationExplanation.ts";
import { validateAuthorizationRequest } from "./identityAuthorizationValidation.ts";
import type { AuthorizationDecision, AuthorizationEvaluationInput } from "./identityAuthorizationTypes.ts";
import type { AuthorizationReason } from "./identityAuthorizationEnums.ts";

function scopeMatches(permission: PermissionAssignment, scopeIdentityId: string | "Global"): boolean {
  return permission.scopeIdentityId === scopeIdentityId;
}

function activeRolesForSubject(
  roleAssignments: readonly RoleAssignment[],
  subjectIdentityId: string,
  scopeIdentityId: string | "Global"
): readonly RoleAssignment[] {
  return Object.freeze(
    roleAssignments
      .filter(
        (role) =>
          role.subjectIdentityId === subjectIdentityId &&
          role.lifecycleState === "Active" &&
          role.scopeIdentityId === scopeIdentityId
      )
      .sort((left, right) => left.assignmentId.localeCompare(right.assignmentId))
  );
}

function activePermissionsForSubject(
  permissionAssignments: readonly PermissionAssignment[],
  subjectIdentityId: string,
  activeRoleIds: readonly string[],
  scopeIdentityId: string | "Global"
): readonly PermissionAssignment[] {
  const roleIds = new Set(activeRoleIds);
  return Object.freeze(
    permissionAssignments
      .filter((permission) => {
        if (permission.lifecycleState !== "Active") return false;
        if (!scopeMatches(permission, scopeIdentityId)) return false;
        if (permission.subjectType === "Identity") return permission.subjectIdentityId === subjectIdentityId;
        if (permission.subjectType === "Role") return Boolean(permission.roleId && roleIds.has(permission.roleId));
        return false;
      })
      .sort((left, right) => left.assignmentId.localeCompare(right.assignmentId))
  );
}

function matchingPermissions(
  permissions: readonly PermissionAssignment[],
  request: AuthorizationEvaluationInput["request"]
): readonly PermissionAssignment[] {
  return Object.freeze(
    permissions.filter((permission) => permission.action === request.action && permission.resource === request.resource)
  );
}

function determineDenialReason(
  allPermissions: readonly PermissionAssignment[],
  activePermissions: readonly PermissionAssignment[],
  request: AuthorizationEvaluationInput["request"],
  activeRoles: readonly RoleAssignment[],
  allRoles: readonly RoleAssignment[]
): AuthorizationReason {
  if (allRoles.some((role) => role.subjectIdentityId === request.subjectIdentityId && role.lifecycleState !== "Active")) {
    return "RoleInactive";
  }
  if (allPermissions.some((permission) => permission.lifecycleState !== "Active")) {
    return "PermissionInactive";
  }
  if (activePermissions.some((permission) => permission.action === request.action && permission.resource !== request.resource)) {
    return "ResourceMismatch";
  }
  if (allPermissions.some((permission) => permission.action === request.action && permission.resource === request.resource && permission.scopeIdentityId !== request.scopeIdentityId)) {
    return "ScopeMismatch";
  }
  if (activeRoles.length === 0 && allRoles.length > 0) {
    return "RoleMissing";
  }
  return "PermissionMissing";
}

export function evaluateAuthorization(
  input: AuthorizationEvaluationInput,
  registry: IdentityRegistry,
  graph: IdentityScopeGraph
): AuthorizationDecision {
  const requestValidation = validateAuthorizationRequest(input.request, registry, graph);
  if (!requestValidation.valid) {
    const explanation = explainAuthorizationDecision({
      evaluatedIdentity: null,
      evaluatedScope: null,
      evaluatedRoles: [],
      evaluatedPermissions: [],
      matchedPermissions: [],
      reasons: ["InvalidRequest"],
    });
    return createAuthorizationDecision({
      requestId: input.request.requestId,
      decision: "Indeterminate",
      matchedRoleIds: [],
      matchedPermissionIds: [],
      evaluatedScope: null,
      evaluatedIdentity: null,
      explanation,
      denialReason: "InvalidRequest",
    });
  }

  const activeRoles = activeRolesForSubject(input.roleAssignments, input.request.subjectIdentityId, input.request.scopeIdentityId);
  const activeRoleIds = activeRoles.map((role) => role.roleId);
  const activePermissions = activePermissionsForSubject(
    input.permissionAssignments,
    input.request.subjectIdentityId,
    activeRoleIds,
    input.request.scopeIdentityId
  );
  const matchedPermissions = matchingPermissions(activePermissions, input.request);
  const matchedRoles = Object.freeze(
    activeRoles.filter((role) =>
      matchedPermissions.some((permission) => permission.subjectType === "Role" && permission.roleId === role.roleId)
    )
  );

  if (matchedPermissions.length > 0) {
    const reasons: AuthorizationReason[] = matchedRoles.length > 0 ? ["RoleGranted", "PermissionGranted"] : ["PermissionGranted"];
    const explanation = explainAuthorizationDecision({
      evaluatedIdentity: input.request.subjectIdentityId,
      evaluatedScope: input.request.scopeIdentityId,
      evaluatedRoles: activeRoles,
      evaluatedPermissions: activePermissions,
      matchedPermissions,
      reasons,
    });
    return createAuthorizationDecision({
      requestId: input.request.requestId,
      decision: "Allow",
      matchedRoleIds: matchedRoles.map((role) => role.roleId),
      matchedPermissionIds: matchedPermissions.map((permission) => permission.permissionId),
      evaluatedScope: input.request.scopeIdentityId,
      evaluatedIdentity: input.request.subjectIdentityId,
      explanation,
      denialReason: null,
    });
  }

  const denialReason = determineDenialReason(
    input.permissionAssignments,
    activePermissions,
    input.request,
    activeRoles,
    input.roleAssignments
  );
  const explanation = explainAuthorizationDecision({
    evaluatedIdentity: input.request.subjectIdentityId,
    evaluatedScope: input.request.scopeIdentityId,
    evaluatedRoles: activeRoles,
    evaluatedPermissions: activePermissions,
    matchedPermissions,
    reasons: [denialReason],
  });

  return createAuthorizationDecision({
    requestId: input.request.requestId,
    decision: "Deny",
    matchedRoleIds: [],
    matchedPermissionIds: [],
    evaluatedScope: input.request.scopeIdentityId,
    evaluatedIdentity: input.request.subjectIdentityId,
    explanation,
    denialReason,
  });
}
