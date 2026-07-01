import type { IdentityId, IdentityType } from "./identityIndex.ts";

export const IDENTITY_SCOPE_CONTRACT_VERSION = "IDN-3" as const;

export const IDENTITY_SCOPE_LEVELS = Object.freeze([
  "Global",
  "Tenant",
  "Organization",
  "Workspace",
  "Project",
  "Object",
  "Session",
  "Service",
] as const);

export type IdentityScopeLevel = (typeof IDENTITY_SCOPE_LEVELS)[number];

export type IdentityScopePath = readonly IdentityId[];

export type InheritedScopeMetadata = Readonly<{
  inheritedFromIdentityId: IdentityId | null;
  inheritedScopeLevel: IdentityScopeLevel | null;
  inheritedPath: IdentityScopePath;
}>;

export type IdentityScope = Readonly<{
  contractVersion: typeof IDENTITY_SCOPE_CONTRACT_VERSION;
  identityId: IdentityId;
  identityType: IdentityType;
  scopeLevel: IdentityScopeLevel;
  ownerIdentityId: IdentityId | null;
  parentIdentityId: IdentityId | null;
  tenantId: IdentityId | null;
  organizationId: IdentityId | null;
  workspaceId: IdentityId | null;
  projectId: IdentityId | null;
  path: IdentityScopePath;
  inheritedScope: InheritedScopeMetadata;
  metadata: Readonly<Record<string, string | number | boolean | null>>;
}>;

export type CreateIdentityScopeInput = Readonly<{
  identityId: IdentityId;
  identityType: IdentityType;
  scopeLevel: IdentityScopeLevel;
  ownerIdentityId?: IdentityId | null;
  parentIdentityId?: IdentityId | null;
  tenantId?: IdentityId | null;
  organizationId?: IdentityId | null;
  workspaceId?: IdentityId | null;
  projectId?: IdentityId | null;
  path?: IdentityScopePath;
  inheritedScope?: Partial<InheritedScopeMetadata>;
  metadata?: Readonly<Record<string, string | number | boolean | null>>;
}>;
