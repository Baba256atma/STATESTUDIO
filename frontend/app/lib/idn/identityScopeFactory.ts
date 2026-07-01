import type { CreateOwnershipRecordInput, IdentityOwnershipRecord } from "./identityOwnershipTypes.ts";
import { IDENTITY_SCOPE_CONTRACT_VERSION, type CreateIdentityScopeInput, type IdentityScope } from "./identityScopeTypes.ts";

function freezeMetadata(
  metadata: Readonly<Record<string, string | number | boolean | null>> | undefined
): Readonly<Record<string, string | number | boolean | null>> {
  return Object.freeze({ ...(metadata ?? {}) });
}

export function createIdentityScope(input: CreateIdentityScopeInput): IdentityScope {
  const path = Object.freeze([...(input.path ?? [input.identityId])]);
  return Object.freeze({
    contractVersion: IDENTITY_SCOPE_CONTRACT_VERSION,
    identityId: input.identityId,
    identityType: input.identityType,
    scopeLevel: input.scopeLevel,
    ownerIdentityId: input.ownerIdentityId ?? null,
    parentIdentityId: input.parentIdentityId ?? null,
    tenantId: input.tenantId ?? null,
    organizationId: input.organizationId ?? null,
    workspaceId: input.workspaceId ?? null,
    projectId: input.projectId ?? null,
    path,
    inheritedScope: Object.freeze({
      inheritedFromIdentityId: input.inheritedScope?.inheritedFromIdentityId ?? input.parentIdentityId ?? null,
      inheritedScopeLevel: input.inheritedScope?.inheritedScopeLevel ?? null,
      inheritedPath: Object.freeze([...(input.inheritedScope?.inheritedPath ?? path.slice(0, -1))]),
    }),
    metadata: freezeMetadata(input.metadata),
  });
}

export function createOwnershipRecord(input: CreateOwnershipRecordInput): IdentityOwnershipRecord {
  return Object.freeze({
    recordId: input.recordId ?? `${input.ownerIdentityId}->${input.childIdentityId}`,
    ownerIdentityId: input.ownerIdentityId,
    ownerIdentityType: input.ownerIdentityType,
    ownerScopeLevel: input.ownerScopeLevel,
    childIdentityId: input.childIdentityId,
    childIdentityType: input.childIdentityType,
    childScopeLevel: input.childScopeLevel,
    tenantId: input.tenantId ?? null,
    organizationId: input.organizationId ?? null,
    workspaceId: input.workspaceId ?? null,
    projectId: input.projectId ?? null,
    metadata: freezeMetadata(input.metadata),
  });
}
