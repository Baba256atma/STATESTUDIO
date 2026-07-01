export {
  createIdentityScope,
  createOwnershipRecord,
} from "./identityScopeFactory.ts";
export {
  IDENTITY_SCOPE_CONTRACT_VERSION,
  IDENTITY_SCOPE_LEVELS,
} from "./identityScopeTypes.ts";
export type {
  CreateIdentityScopeInput,
  IdentityScope,
  IdentityScopeLevel,
  IdentityScopePath,
  InheritedScopeMetadata,
} from "./identityScopeTypes.ts";
export type {
  IdentityScopeGraphValidation,
  IdentityScopeValidationCode,
  IdentityScopeValidationIssue,
  IdentityScopeValidationResult,
} from "./identityScopeContracts.ts";
export {
  IDENTITY_OWNERSHIP_RULES,
  isIdentityScopeLevel,
  isLegalOwnership,
} from "./identityScopeRules.ts";
export type { OwnershipRule } from "./identityScopeRules.ts";
export type {
  CreateOwnershipRecordInput,
  IdentityOwnershipRecord,
  OwnershipRecordId,
} from "./identityOwnershipTypes.ts";
export type { IdentityScopeGraph, OwnershipResolution } from "./identityOwnershipContracts.ts";
export {
  scopeIssue,
  scopeValidationResult,
  validateCrossTenantOwnership,
  validateIdentityScope,
  validateOwnershipRecord,
} from "./identityOwnershipValidation.ts";
export {
  getIdentityScopePath,
  isIdentityInScope,
  resolveIdentityOwner,
} from "./identityScopeResolver.ts";
export {
  getScopeAncestors,
  getScopeDescendants,
  validateOwnershipGraph,
} from "./identityScopeGraph.ts";
