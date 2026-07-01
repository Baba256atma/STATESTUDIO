import type { IdentityId } from "./identityIndex.ts";
import type { IdentityScopeLevel } from "./identityScopeIndex.ts";
import type { PermissionAction, PermissionAssignment, PermissionResource } from "./identityPermissionIndex.ts";
import type { RoleAssignment } from "./identityRoleIndex.ts";
import type { AuthorizationDecisionValue, AuthorizationReason } from "./identityAuthorizationEnums.ts";

export type AuthorizationMetadataValue = string | number | boolean | null;

export type AuthorizationMetadata = Readonly<Record<string, AuthorizationMetadataValue>>;

export type AuthorizationRequest = Readonly<{
  contractVersion: "IDN-6";
  requestId: string;
  subjectIdentityId: IdentityId;
  action: PermissionAction;
  resource: PermissionResource;
  resourceIdentityId: IdentityId | null;
  scopeIdentityId: IdentityId | "Global";
  timestamp: string;
  metadata: AuthorizationMetadata;
}>;

export type CreateAuthorizationRequestInput = Readonly<{
  requestId: string;
  subjectIdentityId: IdentityId;
  action: PermissionAction;
  resource: PermissionResource;
  resourceIdentityId?: IdentityId | null;
  scopeIdentityId: IdentityId | "Global";
  timestamp: string;
  metadata?: AuthorizationMetadata;
}>;

export type AuthorizationExplanation = Readonly<{
  evaluatedIdentity: IdentityId | null;
  evaluatedScope: IdentityId | "Global" | null;
  evaluatedRoles: readonly string[];
  evaluatedPermissions: readonly string[];
  matchedPermission: string | null;
  unmatchedPermissions: readonly string[];
  reasons: readonly AuthorizationReason[];
}>;

export type AuthorizationDecision = Readonly<{
  contractVersion: "IDN-6";
  decisionId: string;
  requestId: string;
  decision: AuthorizationDecisionValue;
  matchedRoleIds: readonly string[];
  matchedPermissionIds: readonly string[];
  evaluatedScope: IdentityId | "Global" | null;
  evaluatedIdentity: IdentityId | null;
  explanation: AuthorizationExplanation;
  denialReason: AuthorizationReason | null;
  metadata: AuthorizationMetadata;
}>;

export type AuthorizationEvaluationInput = Readonly<{
  request: AuthorizationRequest;
  roleAssignments: readonly RoleAssignment[];
  permissionAssignments: readonly PermissionAssignment[];
}>;

export type AuthorizationMatchedContext = Readonly<{
  activeRoles: readonly RoleAssignment[];
  activePermissions: readonly PermissionAssignment[];
  matchedPermissions: readonly PermissionAssignment[];
  matchedRoles: readonly RoleAssignment[];
}>;
