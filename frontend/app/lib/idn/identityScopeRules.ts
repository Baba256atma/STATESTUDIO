import type { IdentityType } from "./identityIndex.ts";
import { IDENTITY_SCOPE_LEVELS, type IdentityScopeLevel } from "./identityScopeTypes.ts";

export type OwnershipRule = Readonly<{
  ownerType: IdentityType | "Global";
  childType: IdentityType;
  ownerScopeLevel: IdentityScopeLevel;
  childScopeLevel: IdentityScopeLevel;
}>;

export const IDENTITY_OWNERSHIP_RULES = Object.freeze([
  { ownerType: "Global", childType: "Tenant", ownerScopeLevel: "Global", childScopeLevel: "Tenant" },
  { ownerType: "Global", childType: "Service", ownerScopeLevel: "Global", childScopeLevel: "Service" },
  { ownerType: "Global", childType: "API", ownerScopeLevel: "Global", childScopeLevel: "Global" },
  { ownerType: "Tenant", childType: "Organization", ownerScopeLevel: "Tenant", childScopeLevel: "Organization" },
  { ownerType: "Tenant", childType: "Service", ownerScopeLevel: "Tenant", childScopeLevel: "Service" },
  { ownerType: "Organization", childType: "Workspace", ownerScopeLevel: "Organization", childScopeLevel: "Workspace" },
  { ownerType: "Organization", childType: "User", ownerScopeLevel: "Organization", childScopeLevel: "Organization" },
  { ownerType: "Workspace", childType: "Project", ownerScopeLevel: "Workspace", childScopeLevel: "Project" },
  { ownerType: "Workspace", childType: "Agent", ownerScopeLevel: "Workspace", childScopeLevel: "Workspace" },
  { ownerType: "Project", childType: "Object", ownerScopeLevel: "Project", childScopeLevel: "Object" },
  { ownerType: "Project", childType: "Session", ownerScopeLevel: "Project", childScopeLevel: "Session" },
] as const satisfies readonly OwnershipRule[]);

const scopeLevelSet = new Set<string>(IDENTITY_SCOPE_LEVELS);

export function isIdentityScopeLevel(value: unknown): value is IdentityScopeLevel {
  return typeof value === "string" && scopeLevelSet.has(value);
}

export function isLegalOwnership(
  ownerType: IdentityType | "Global",
  childType: IdentityType,
  ownerScopeLevel: IdentityScopeLevel,
  childScopeLevel: IdentityScopeLevel
): boolean {
  return IDENTITY_OWNERSHIP_RULES.some(
    (rule) =>
      rule.ownerType === ownerType &&
      rule.childType === childType &&
      rule.ownerScopeLevel === ownerScopeLevel &&
      rule.childScopeLevel === childScopeLevel
  );
}
