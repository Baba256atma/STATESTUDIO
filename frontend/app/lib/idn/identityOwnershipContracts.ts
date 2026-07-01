import type { IdentityOwnershipRecord } from "./identityOwnershipTypes.ts";
import type { IdentityScope } from "./identityScopeTypes.ts";

export type IdentityScopeGraph = Readonly<{
  scopes: readonly IdentityScope[];
  ownershipRecords: readonly IdentityOwnershipRecord[];
}>;

export type OwnershipResolution = Readonly<{
  found: boolean;
  record: IdentityOwnershipRecord | null;
}>;
