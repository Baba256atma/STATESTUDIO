import type { IdentityId, IdentityType } from "./identityIndex.ts";
import type { IdentityScopeLevel } from "./identityScopeIndex.ts";
import type { IdentityRoleName, RoleLifecycleState, RoleScopeLevel } from "./identityRoleEnums.ts";

export type IdentityRoleId = string;

export type RoleMetadataValue = string | number | boolean | null;

export type RoleMetadata = Readonly<Record<string, RoleMetadataValue>>;

export type RoleScope = Readonly<{
  scopeIdentityId: IdentityId | "Global";
  scopeLevel: RoleScopeLevel;
  scopePath: readonly IdentityId[];
}>;

export type RoleDefinition = Readonly<{
  contractVersion: "IDN-4";
  roleId: IdentityRoleId;
  roleName: IdentityRoleName;
  displayName: string;
  description: string | null;
  allowedScopes: readonly RoleScopeLevel[];
  lifecycleState: RoleLifecycleState;
  metadata: RoleMetadata;
  version: number;
}>;

export type RoleAssignment = Readonly<{
  contractVersion: "IDN-4";
  assignmentId: string;
  roleId: IdentityRoleId;
  roleName: IdentityRoleName;
  subjectIdentityId: IdentityId;
  subjectIdentityType: IdentityType;
  scopeIdentityId: IdentityId | "Global";
  scopeLevel: IdentityScopeLevel;
  assignedBy: IdentityId;
  assignedAt: string;
  lifecycleState: RoleLifecycleState;
  metadata: RoleMetadata;
  version: number;
}>;

export type CreateRoleDefinitionInput = Readonly<{
  roleId?: IdentityRoleId;
  roleName: IdentityRoleName;
  displayName?: string;
  description?: string | null;
  allowedScopes?: readonly RoleScopeLevel[];
  lifecycleState?: RoleLifecycleState;
  metadata?: RoleMetadata;
  version?: number;
}>;

export type CreateRoleAssignmentInput = Readonly<{
  assignmentId?: string;
  roleId: IdentityRoleId;
  roleName: IdentityRoleName;
  subjectIdentityId: IdentityId;
  subjectIdentityType: IdentityType;
  scopeIdentityId: IdentityId | "Global";
  scopeLevel: IdentityScopeLevel;
  assignedBy: IdentityId;
  assignedAt: string;
  lifecycleState?: RoleLifecycleState;
  metadata?: RoleMetadata;
  version?: number;
}>;
