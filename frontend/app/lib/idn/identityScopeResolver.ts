import type { IdentityId } from "./identityIndex.ts";
import type { IdentityOwnershipRecord } from "./identityOwnershipTypes.ts";
import type { OwnershipResolution } from "./identityOwnershipContracts.ts";
import type { IdentityScope } from "./identityScopeTypes.ts";

export function getIdentityScopePath(scope: IdentityScope): readonly IdentityId[] {
  return Object.freeze([...scope.path]);
}

export function isIdentityInScope(identityId: IdentityId, scope: IdentityScope): boolean {
  return scope.path.includes(identityId) || scope.identityId === identityId;
}

export function resolveIdentityOwner(
  ownershipRecords: readonly IdentityOwnershipRecord[],
  identityId: IdentityId
): OwnershipResolution {
  const record = ownershipRecords.find((entry) => entry.childIdentityId === identityId) ?? null;
  return Object.freeze({ found: Boolean(record), record });
}
