import type { IdentityId } from "./identityIndex.ts";
import type { IdentityRoleId } from "./identityRoleIndex.ts";
import type { IdentityScopeLevel } from "./identityScopeIndex.ts";
import type {
  PermissionAction,
  PermissionLifecycleState,
  PermissionResource,
  PermissionScopeLevel,
  PermissionSubjectType,
} from "./identityPermissionEnums.ts";

export type PermissionId = string;

export type PermissionMetadataValue = string | number | boolean | null;

export type PermissionMetadata = Readonly<Record<string, PermissionMetadataValue>>;

export type PermissionDefinition = Readonly<{
  contractVersion: "IDN-5";
  permissionId: PermissionId;
  action: PermissionAction;
  resource: PermissionResource;
  displayName: string;
  description: string | null;
  lifecycleState: PermissionLifecycleState;
  metadata: PermissionMetadata;
  version: number;
}>;

export type PermissionAssignment = Readonly<{
  contractVersion: "IDN-5";
  assignmentId: string;
  permissionId: PermissionId;
  action: PermissionAction;
  resource: PermissionResource;
  subjectIdentityId: IdentityId | null;
  roleId: IdentityRoleId | null;
  subjectType: PermissionSubjectType;
  scopeIdentityId: IdentityId | "Global";
  scopeLevel: IdentityScopeLevel;
  assignedBy: IdentityId;
  assignedAt: string;
  lifecycleState: PermissionLifecycleState;
  metadata: PermissionMetadata;
  version: number;
}>;

export type CreatePermissionDefinitionInput = Readonly<{
  permissionId?: PermissionId;
  action: PermissionAction;
  resource: PermissionResource;
  displayName?: string;
  description?: string | null;
  lifecycleState?: PermissionLifecycleState;
  metadata?: PermissionMetadata;
  version?: number;
}>;

export type CreatePermissionAssignmentInput = Readonly<{
  assignmentId?: string;
  permissionId: PermissionId;
  action: PermissionAction;
  resource: PermissionResource;
  subjectIdentityId?: IdentityId | null;
  roleId?: IdentityRoleId | null;
  subjectType: PermissionSubjectType;
  scopeIdentityId: IdentityId | "Global";
  scopeLevel: PermissionScopeLevel;
  assignedBy: IdentityId;
  assignedAt: string;
  lifecycleState?: PermissionLifecycleState;
  metadata?: PermissionMetadata;
  version?: number;
}>;
