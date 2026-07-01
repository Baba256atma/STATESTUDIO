import type { IdentityId, IdentityType } from "./identityIndex.ts";
import type { IdentityScopeLevel } from "./identityScopeTypes.ts";

export type OwnershipRecordId = string;

export type IdentityOwnershipRecord = Readonly<{
  recordId: OwnershipRecordId;
  ownerIdentityId: IdentityId | "Global";
  ownerIdentityType: IdentityType | "Global";
  ownerScopeLevel: IdentityScopeLevel;
  childIdentityId: IdentityId;
  childIdentityType: IdentityType;
  childScopeLevel: IdentityScopeLevel;
  tenantId: IdentityId | null;
  organizationId: IdentityId | null;
  workspaceId: IdentityId | null;
  projectId: IdentityId | null;
  metadata: Readonly<Record<string, string | number | boolean | null>>;
}>;

export type CreateOwnershipRecordInput = Readonly<{
  ownerIdentityId: IdentityId | "Global";
  ownerIdentityType: IdentityType | "Global";
  ownerScopeLevel: IdentityScopeLevel;
  childIdentityId: IdentityId;
  childIdentityType: IdentityType;
  childScopeLevel: IdentityScopeLevel;
  tenantId?: IdentityId | null;
  organizationId?: IdentityId | null;
  workspaceId?: IdentityId | null;
  projectId?: IdentityId | null;
  recordId?: OwnershipRecordId;
  metadata?: Readonly<Record<string, string | number | boolean | null>>;
}>;
