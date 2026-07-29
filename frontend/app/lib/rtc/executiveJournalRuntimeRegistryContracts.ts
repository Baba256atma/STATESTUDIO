/**
 * RTC-2:2 — Executive Journal Runtime Registry Contracts.
 *
 * Registration, lookup, conflict, and summary contract declarations.
 * Declarations only. No implementation. No UI.
 *
 * Ownership: owned exclusively by RTC-2:2.
 */

export type ExecutiveJournalRuntimeRegistryContractName =
  | "JournalRegistryRegistration"
  | "JournalRegistryLookup"
  | "JournalRegistryConflict"
  | "JournalRegistrySummary";

export interface ExecutiveJournalRuntimeRegistryContractDeclaration {
  readonly contractId:
    `RTC-2:2/Contract/${ExecutiveJournalRuntimeRegistryContractName}`;
  readonly contractName: ExecutiveJournalRuntimeRegistryContractName;
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
  contractName: ExecutiveJournalRuntimeRegistryContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveJournalRuntimeRegistryContractDeclaration =>
  Object.freeze({
    contractId: `RTC-2:2/Contract/${contractName}` as const,
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

/**
 * Public registry contracts. Order is deterministic and immutable.
 */
export const ExecutiveJournalRuntimeRegistryContracts:
  readonly ExecutiveJournalRuntimeRegistryContractDeclaration[] = Object.freeze([
    contract(
      "JournalRegistryRegistration",
      "Journal Registry Registration",
      "Seal approved foundation entries into the closed-world registry. Rejects duplicate identities, namespaces, and alias collisions. Requires foundation readiness ReadyForRegistry.",
      Object.freeze([
        "controlId",
        "namespace",
        "aliases",
        "foundation",
        "foundationReadiness",
        "order",
      ]),
      1,
    ),
    contract(
      "JournalRegistryLookup",
      "Journal Registry Lookup",
      "Resolve by canonical control ID, namespace, or approved alias. Returns discriminated success or explicit non-success. Successful resolution preserves exact entry object identity.",
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
      "JournalRegistryConflict",
      "Journal Registry Conflict",
      "Conflict codes for duplicate canonical IDs, duplicate namespaces, duplicate aliases, alias-to-canonical collisions, ambiguous aliases, identity key mismatch, and foundation readiness failures.",
      Object.freeze([
        "DuplicateCanonicalId",
        "DuplicateNamespace",
        "DuplicateAlias",
        "AliasCanonicalCollision",
        "AliasAmbiguous",
        "IdentityKeyMismatch",
        "FoundationNotReadyForRegistry",
      ]),
      3,
    ),
    contract(
      "JournalRegistrySummary",
      "Journal Registry Summary",
      "Deterministic inventory summary of sealed registry identity, entry counts, alias counts, open issues, and readiness.",
      Object.freeze([
        "registryId",
        "namespace",
        "entryCount",
        "aliasCount",
        "openIssueCount",
        "sourceFoundation",
        "readiness",
      ]),
      4,
    ),
  ]);

export const ExecutiveJournalRuntimeRegistryContractNames = Object.freeze([
  "JournalRegistryRegistration",
  "JournalRegistryLookup",
  "JournalRegistryConflict",
  "JournalRegistrySummary",
] as const satisfies readonly ExecutiveJournalRuntimeRegistryContractName[]);
