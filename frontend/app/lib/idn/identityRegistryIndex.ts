export {
  IDENTITY_REGISTRY_CONTRACT_VERSION,
} from "./identityRegistryTypes.ts";
export type {
  IdentityRegistry,
  IdentityRegistryIndexes,
  IdentityRegistryIndexBucket,
  IdentityRegistryMetadataUpdate,
  IdentityRegistryQuery,
} from "./identityRegistryTypes.ts";
export type {
  IdentityRegistryLookupResult,
  IdentityRegistryMutationResult,
  IdentityRegistryRegistrationInput,
  IdentityRegistrySnapshot,
  IdentityRegistryStatistics,
  IdentityRegistryUnregisterInput,
  IdentityRegistryValidationCode,
  IdentityRegistryValidationIssue,
  IdentityRegistryValidationResult,
} from "./identityRegistryContracts.ts";
export {
  clearRegistry,
  createIdentityRegistry,
  getIdentity,
  hasIdentity,
  listIdentities,
  lookupIdentity,
  registerIdentity,
  unregisterIdentity,
  updateIdentityMetadata,
} from "./identityRegistry.ts";
export { queryIdentities } from "./identityRegistryQueries.ts";
export { getRegistryStatistics } from "./identityRegistryStatistics.ts";
export { createIdentityRegistrySnapshot, exportRegistrySnapshot } from "./identityRegistrySnapshot.ts";
export {
  registryIssue,
  registryValidationResult,
  validateMetadataUpdate,
  validateRegistryConsistency,
  validateSnapshotIntegrity,
} from "./identityRegistryValidation.ts";
