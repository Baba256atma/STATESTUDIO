/**
 * EX-2:2 — Executive Journal Experience Registry Contracts.
 *
 * Registration, lookup, resolution-result, conflict, and summary contract
 * declarations. Declarations only. No implementation. No UI.
 *
 * Ownership: owned exclusively by EX-2:2.
 */

import type { ExecutiveJournalExperienceRegistryConflictCode } from "./executiveJournalExperienceRegistryTypes.ts";

export type ExecutiveJournalExperienceRegistryContractName =
  | "ExperienceRegistryRegistration"
  | "ExperienceRegistryLookup"
  | "ExperienceRegistryResolutionResult"
  | "ExperienceRegistryConflict"
  | "ExperienceRegistrySummary";

export interface ExecutiveJournalExperienceRegistryContractDeclaration {
  readonly contractId:
    `EX-2:2/Contract/${ExecutiveJournalExperienceRegistryContractName}`;
  readonly contractName: ExecutiveJournalExperienceRegistryContractName;
  readonly canonicalName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly executable: false;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const contract = (
  contractName: ExecutiveJournalExperienceRegistryContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveJournalExperienceRegistryContractDeclaration =>
  Object.freeze({
    contractId: `EX-2:2/Contract/${contractName}` as const,
    contractName,
    canonicalName,
    description,
    fields: Object.freeze([...fields]),
    executable: false as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Ordered conflict catalogue with precedence (first match wins). */
export const ExecutiveJournalExperienceRegistryConflictCodes = Object.freeze([
  "RegistryAlreadySealed",
  "FoundationNotReadyForRegistry",
  "UnexpectedEntry",
  "EntryReferenceMismatch",
  "IdentityKeyMismatch",
  "DuplicateCanonicalId",
  "DuplicateNamespace",
  "DuplicateAlias",
  "AliasCanonicalCollision",
  "AliasAmbiguous",
] as const satisfies readonly ExecutiveJournalExperienceRegistryConflictCode[]);

export const ExecutiveJournalExperienceRegistryConflictPrecedence =
  ExecutiveJournalExperienceRegistryConflictCodes;

/**
 * Public Registry contracts. Order is deterministic and immutable.
 */
export const ExecutiveJournalExperienceRegistryContracts = Object.freeze([
  contract(
    "ExperienceRegistryRegistration",
    "Executive Journal Experience Registry Registration",
    "Seal the approved EX-2:1 Foundation entry into the closed-world Registry. Rejects duplicates, alias collisions, reference mismatches, unreadiness, unexpected entries, and post-seal registration.",
    Object.freeze([
      "controlId",
      "namespace",
      "aliases",
      "status",
      "readiness",
      "phase",
      "foundation",
      "order",
    ]),
    1,
  ),
  contract(
    "ExperienceRegistryLookup",
    "Executive Journal Experience Registry Lookup",
    "Resolve by canonical control ID, namespace, or approved alias. No normalization, trim, lowercase, repair or inference.",
    Object.freeze([
      "query",
      "resolvedBy",
      "ok",
      "code",
      "entry",
    ]),
    2,
  ),
  contract(
    "ExperienceRegistryResolutionResult",
    "Executive Journal Experience Registry Resolution Result",
    "Discriminated result vocabulary: Resolved, UnknownIdentity, MalformedIdentity. Success preserves exact entry and Foundation references.",
    Object.freeze([
      "Resolved",
      "UnknownIdentity",
      "MalformedIdentity",
    ]),
    3,
  ),
  contract(
    "ExperienceRegistryConflict",
    "Executive Journal Experience Registry Conflict",
    "Conflict codes for sealed-state, readiness, unexpected entries, reference mismatch, identity-key mismatch, duplicates, and alias collisions. Conflicts do not mutate the Registry.",
    ExecutiveJournalExperienceRegistryConflictCodes,
    4,
  ),
  contract(
    "ExperienceRegistrySummary",
    "Executive Journal Experience Registry Summary",
    "Deterministic summary of sealed Registry identity, entry count, aliases, authorization, and preserved gate/issue IDs without sensitive payloads.",
    Object.freeze([
      "identity",
      "namespace",
      "status",
      "readiness",
      "entryCount",
      "authorizationId",
      "pendingGateIds",
      "openIssueIds",
    ]),
    5,
  ),
] as const);

export const ExecutiveJournalExperienceRegistryContractCatalogue =
  Object.freeze({
    contracts: ExecutiveJournalExperienceRegistryContracts,
    conflictCodes: ExecutiveJournalExperienceRegistryConflictCodes,
    conflictPrecedence:
      ExecutiveJournalExperienceRegistryConflictPrecedence,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  } as const);
