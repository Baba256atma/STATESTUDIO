/**
 * APP-4:3 — Executive Memory storage constants.
 */

export const EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION = "APP-4/3" as const;
export const EXECUTIVE_MEMORY_STORAGE_ARCHITECTURE_VERSION = "APP-4/3-storage-arch" as const;

export const EXECUTIVE_MEMORY_STORAGE_TAGS = Object.freeze([
  "[APP4_3]",
  "[EXECUTIVE_MEMORY_STORAGE]",
  "[STORAGE_ENGINE]",
  "[IN_MEMORY_PROVIDER]",
  "[NO_SEARCH]",
  "[NO_RANKING]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_MEMORY_STORAGE_LIFECYCLE_KEYS = Object.freeze(["active", "archived"] as const);

export const EXECUTIVE_MEMORY_STORAGE_PROVIDER_KINDS = Object.freeze([
  "in_memory",
  "local_storage",
  "database",
] as const);

export const EXECUTIVE_MEMORY_STORAGE_ERROR_CODES = Object.freeze({
  duplicateId: "duplicate_id",
  recordNotFound: "record_not_found",
  invalidSchema: "invalid_schema",
  invalidProvider: "invalid_provider",
  archiveFailure: "archive_failure",
  restoreFailure: "restore_failure",
  validationFailure: "validation_failure",
  transactionRollback: "transaction_rollback",
  unsupportedProvider: "unsupported_provider",
  idImmutable: "id_immutable",
  providerImmutable: "provider_immutable",
  alreadyArchived: "already_archived",
  notArchived: "not_archived",
} as const);

export const EXECUTIVE_MEMORY_STORAGE_FUTURE_PROVIDERS = Object.freeze({
  localStorage: Object.freeze({
    kind: "local_storage" as const,
    status: "placeholder" as const,
    implemented: false,
  }),
  database: Object.freeze({
    kind: "database" as const,
    status: "placeholder" as const,
    implemented: false,
  }),
} as const);
