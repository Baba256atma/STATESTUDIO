import type {
  IdentityId,
  IdentityLifecycleState,
  IdentitySource,
  IdentityType,
  NexoraIdentity,
} from "./identityIndex.ts";
import type { IdentityRegistry, IdentityRegistryIndexes } from "./identityRegistryTypes.ts";

export type IdentityRegistryValidationCode =
  | "duplicate_id"
  | "invalid_identity"
  | "missing_identity"
  | "invalid_update"
  | "registry_inconsistent"
  | "index_inconsistent"
  | "snapshot_inconsistent";

export type IdentityRegistryValidationIssue = Readonly<{
  code: IdentityRegistryValidationCode;
  field: string;
  message: string;
  severity: "error";
}>;

export type IdentityRegistryValidationResult = Readonly<{
  valid: boolean;
  issues: readonly IdentityRegistryValidationIssue[];
}>;

export type IdentityRegistryMutationResult = Readonly<{
  success: boolean;
  registry: IdentityRegistry;
  identity: NexoraIdentity | null;
  validation: IdentityRegistryValidationResult;
}>;

export type IdentityRegistryLookupResult = Readonly<{
  found: boolean;
  identity: NexoraIdentity | null;
}>;

export type IdentityRegistrySnapshot = Readonly<{
  contractVersion: "IDN-2";
  registryId: string;
  totalIdentities: number;
  identities: readonly NexoraIdentity[];
  indexes: IdentityRegistryIndexes;
  statistics: IdentityRegistryStatistics;
}>;

export type IdentityRegistryStatistics = Readonly<{
  totalIdentities: number;
  identitiesByType: Readonly<Record<IdentityType, number>>;
  identitiesByLifecycle: Readonly<Record<IdentityLifecycleState, number>>;
  activeIdentities: number;
  archivedIdentities: number;
  deletedIdentities: number;
  identitiesBySource: Readonly<Record<IdentitySource, number>>;
  tagCount: number;
}>;

export type IdentityRegistryRegistrationInput = Readonly<{
  registry: IdentityRegistry;
  identity: NexoraIdentity;
}>;

export type IdentityRegistryUnregisterInput = Readonly<{
  registry: IdentityRegistry;
  identityId: IdentityId;
}>;
