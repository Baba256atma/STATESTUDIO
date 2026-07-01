import { CANONICAL_ROLE_SCOPE_ALLOWANCES, IDENTITY_ROLE_CONTRACT_VERSION } from "./identityRoleEnums.ts";
import type { CreateRoleAssignmentInput, CreateRoleDefinitionInput, RoleAssignment, RoleDefinition } from "./identityRoleTypes.ts";

function freezeMetadata(metadata: CreateRoleDefinitionInput["metadata"] | CreateRoleAssignmentInput["metadata"]) {
  return Object.freeze({ ...(metadata ?? {}) });
}

function roleIdFor(roleName: string): string {
  return `role:${roleName.toLowerCase()}`;
}

export function createRoleDefinition(input: CreateRoleDefinitionInput): RoleDefinition {
  const allowedScopes = input.allowedScopes ?? CANONICAL_ROLE_SCOPE_ALLOWANCES[input.roleName];
  return Object.freeze({
    contractVersion: IDENTITY_ROLE_CONTRACT_VERSION,
    roleId: input.roleId ?? roleIdFor(input.roleName),
    roleName: input.roleName,
    displayName: input.displayName ?? input.roleName,
    description: input.description ?? null,
    allowedScopes: Object.freeze([...allowedScopes]),
    lifecycleState: input.lifecycleState ?? "Active",
    metadata: freezeMetadata(input.metadata),
    version: input.version ?? 1,
  });
}

export function createRoleAssignment(input: CreateRoleAssignmentInput): RoleAssignment {
  return Object.freeze({
    contractVersion: IDENTITY_ROLE_CONTRACT_VERSION,
    assignmentId:
      input.assignmentId ??
      `${input.roleId}:${input.subjectIdentityId}:${input.scopeIdentityId}:${input.scopeLevel}`,
    roleId: input.roleId,
    roleName: input.roleName,
    subjectIdentityId: input.subjectIdentityId,
    subjectIdentityType: input.subjectIdentityType,
    scopeIdentityId: input.scopeIdentityId,
    scopeLevel: input.scopeLevel,
    assignedBy: input.assignedBy,
    assignedAt: input.assignedAt,
    lifecycleState: input.lifecycleState ?? "Active",
    metadata: freezeMetadata(input.metadata),
    version: input.version ?? 1,
  });
}
