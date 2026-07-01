import { IDENTITY_SESSION_CONTRACT_VERSION } from "./identitySessionEnums.ts";
import type { PermissionAssignment } from "./identityPermissionIndex.ts";
import type { RoleAssignment } from "./identityRoleIndex.ts";
import type {
  CreateSessionContextInput,
  CreateSessionMetadataInput,
  SessionContext,
  SessionMetadata,
  SessionMetadataMap,
  SessionPermissionSnapshot,
  SessionRoleSnapshot,
} from "./identitySessionTypes.ts";

function freezeMetadata(metadata: SessionMetadataMap | undefined): SessionMetadataMap {
  return Object.freeze({ ...(metadata ?? {}) });
}

export function createSessionRoleSnapshot(roleAssignment: RoleAssignment): SessionRoleSnapshot {
  return Object.freeze({
    roleId: roleAssignment.roleId,
    roleName: roleAssignment.roleName,
    scopeIdentityId: roleAssignment.scopeIdentityId,
    scopeLevel: roleAssignment.scopeLevel,
    lifecycleState: roleAssignment.lifecycleState,
    sourceAssignmentId: roleAssignment.assignmentId,
  });
}

export function createSessionPermissionSnapshot(permissionAssignment: PermissionAssignment): SessionPermissionSnapshot {
  return Object.freeze({
    permissionId: permissionAssignment.permissionId,
    action: permissionAssignment.action,
    resource: permissionAssignment.resource,
    scopeIdentityId: permissionAssignment.scopeIdentityId,
    scopeLevel: permissionAssignment.scopeLevel,
    lifecycleState: permissionAssignment.lifecycleState,
    sourceAssignmentId: permissionAssignment.assignmentId,
  });
}

export function createSessionMetadata(input: CreateSessionMetadataInput): SessionMetadata {
  return Object.freeze({
    contractVersion: IDENTITY_SESSION_CONTRACT_VERSION,
    sessionId: input.sessionId,
    sessionIdentityId: input.sessionIdentityId,
    subjectIdentityId: input.subjectIdentityId,
    subjectIdentityType: input.subjectIdentityType,
    scope: Object.freeze({ ...input.scope }),
    roleSnapshots: Object.freeze([...(input.roleSnapshots ?? [])]),
    permissionSnapshots: Object.freeze([...(input.permissionSnapshots ?? [])]),
    lifecycleState: input.lifecycleState ?? "Created",
    createdAt: input.createdAt,
    updatedAt: input.updatedAt ?? input.createdAt,
    metadata: freezeMetadata(input.metadata),
    version: input.version ?? 1,
  });
}

export function createSessionContext(input: CreateSessionContextInput): SessionContext {
  return Object.freeze({
    contractVersion: IDENTITY_SESSION_CONTRACT_VERSION,
    contextId: input.contextId,
    sessionId: input.sessionMetadata.sessionId,
    subjectIdentityId: input.sessionMetadata.subjectIdentityId,
    activeTenantId: input.sessionMetadata.scope.tenantId,
    activeWorkspaceId: input.sessionMetadata.scope.workspaceId,
    activeProjectId: input.sessionMetadata.scope.projectId,
    activeScopeIdentityId: input.sessionMetadata.scope.activeScopeIdentityId,
    activeScopeLevel: input.sessionMetadata.scope.activeScopeLevel,
    roleSnapshots: Object.freeze([...input.sessionMetadata.roleSnapshots]),
    permissionSnapshots: Object.freeze([...input.sessionMetadata.permissionSnapshots]),
    lifecycleState: input.sessionMetadata.lifecycleState,
    metadata: freezeMetadata(input.metadata),
    version: input.version ?? input.sessionMetadata.version,
  });
}
