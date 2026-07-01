import type { IdentityId, IdentityType } from "./identityIndex.ts";
import type { IdentityScopeLevel } from "./identityScopeIndex.ts";
import type { PermissionAction, PermissionResource } from "./identityPermissionIndex.ts";
import type { SessionLifecycleState } from "./identitySessionEnums.ts";

export type SessionMetadataValue = string | number | boolean | null;

export type SessionMetadataMap = Readonly<Record<string, SessionMetadataValue>>;

export type SessionRoleSnapshot = Readonly<{
  roleId: string;
  roleName: string;
  scopeIdentityId: IdentityId | "Global";
  scopeLevel: IdentityScopeLevel;
  lifecycleState: string;
  sourceAssignmentId: string;
}>;

export type SessionPermissionSnapshot = Readonly<{
  permissionId: string;
  action: PermissionAction;
  resource: PermissionResource;
  scopeIdentityId: IdentityId | "Global";
  scopeLevel: IdentityScopeLevel;
  lifecycleState: string;
  sourceAssignmentId: string;
}>;

export type SessionScope = Readonly<{
  tenantId: IdentityId | null;
  organizationId: IdentityId | null;
  workspaceId: IdentityId | null;
  projectId: IdentityId | null;
  activeScopeIdentityId: IdentityId | "Global";
  activeScopeLevel: IdentityScopeLevel;
}>;

export type SessionMetadata = Readonly<{
  contractVersion: "IDN-7";
  sessionId: IdentityId;
  sessionIdentityId: IdentityId;
  subjectIdentityId: IdentityId;
  subjectIdentityType: IdentityType;
  scope: SessionScope;
  roleSnapshots: readonly SessionRoleSnapshot[];
  permissionSnapshots: readonly SessionPermissionSnapshot[];
  lifecycleState: SessionLifecycleState;
  createdAt: string;
  updatedAt: string;
  metadata: SessionMetadataMap;
  version: number;
}>;

export type SessionContext = Readonly<{
  contractVersion: "IDN-7";
  contextId: string;
  sessionId: IdentityId;
  subjectIdentityId: IdentityId;
  activeTenantId: IdentityId | null;
  activeWorkspaceId: IdentityId | null;
  activeProjectId: IdentityId | null;
  activeScopeIdentityId: IdentityId | "Global";
  activeScopeLevel: IdentityScopeLevel;
  roleSnapshots: readonly SessionRoleSnapshot[];
  permissionSnapshots: readonly SessionPermissionSnapshot[];
  lifecycleState: SessionLifecycleState;
  metadata: SessionMetadataMap;
  version: number;
}>;

export type CreateSessionMetadataInput = Readonly<{
  sessionId: IdentityId;
  sessionIdentityId: IdentityId;
  subjectIdentityId: IdentityId;
  subjectIdentityType: IdentityType;
  scope: SessionScope;
  roleSnapshots?: readonly SessionRoleSnapshot[];
  permissionSnapshots?: readonly SessionPermissionSnapshot[];
  lifecycleState?: SessionLifecycleState;
  createdAt: string;
  updatedAt?: string;
  metadata?: SessionMetadataMap;
  version?: number;
}>;

export type CreateSessionContextInput = Readonly<{
  contextId: string;
  sessionMetadata: SessionMetadata;
  metadata?: SessionMetadataMap;
  version?: number;
}>;

export type SessionStateExplanation = Readonly<{
  sessionId: IdentityId;
  subjectIdentityId: IdentityId;
  lifecycleState: SessionLifecycleState;
  active: boolean;
  activeScopeIdentityId: IdentityId | "Global";
  activeScopeLevel: IdentityScopeLevel;
  roleCount: number;
  permissionCount: number;
  reasons: readonly string[];
}>;
