import { IDENTITY_PERMISSION_CONTRACT_VERSION } from "./identityPermissionEnums.ts";
import type {
  CreatePermissionAssignmentInput,
  CreatePermissionDefinitionInput,
  PermissionAssignment,
  PermissionDefinition,
  PermissionMetadata,
} from "./identityPermissionTypes.ts";

function freezeMetadata(metadata: PermissionMetadata | undefined): PermissionMetadata {
  return Object.freeze({ ...(metadata ?? {}) });
}

function permissionIdFor(action: string, resource: string): string {
  return `permission:${resource}:${action}`;
}

export function createPermissionDefinition(input: CreatePermissionDefinitionInput): PermissionDefinition {
  return Object.freeze({
    contractVersion: IDENTITY_PERMISSION_CONTRACT_VERSION,
    permissionId: input.permissionId ?? permissionIdFor(input.action, input.resource),
    action: input.action,
    resource: input.resource,
    displayName: input.displayName ?? `${input.resource}.${input.action}`,
    description: input.description ?? null,
    lifecycleState: input.lifecycleState ?? "Active",
    metadata: freezeMetadata(input.metadata),
    version: input.version ?? 1,
  });
}

export function createPermissionAssignment(input: CreatePermissionAssignmentInput): PermissionAssignment {
  const subjectId = input.subjectType === "Role" ? input.roleId ?? "role:missing" : input.subjectIdentityId ?? "identity:missing";
  return Object.freeze({
    contractVersion: IDENTITY_PERMISSION_CONTRACT_VERSION,
    assignmentId:
      input.assignmentId ??
      `${input.permissionId}:${input.subjectType}:${subjectId}:${input.scopeIdentityId}:${input.scopeLevel}`,
    permissionId: input.permissionId,
    action: input.action,
    resource: input.resource,
    subjectIdentityId: input.subjectIdentityId ?? null,
    roleId: input.roleId ?? null,
    subjectType: input.subjectType,
    scopeIdentityId: input.scopeIdentityId,
    scopeLevel: input.scopeLevel,
    assignedBy: input.assignedBy,
    assignedAt: input.assignedAt,
    lifecycleState: input.lifecycleState ?? "Active",
    metadata: freezeMetadata(input.metadata),
    version: input.version ?? 1,
  });
}
