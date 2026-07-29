/**
 * RTC-3:2 — Executive Decision Register Registry Contracts.
 *
 * Registration, lookup, conflict, seal, and summary contract declarations.
 * Declarations only. No implementation. No UI.
 *
 * Ownership: owned exclusively by RTC-3:2.
 */

export type ExecutiveDecisionRegisterRegistryContractName =
  | "DecisionRegisterRegistryRegistration"
  | "DecisionRegisterRegistryLookup"
  | "DecisionRegisterRegistryConflict"
  | "DecisionRegisterRegistrySeal"
  | "DecisionRegisterRegistrySummary";

export interface ExecutiveDecisionRegisterRegistryContractDeclaration {
  readonly contractId:
    `RTC-3:2/Contract/${ExecutiveDecisionRegisterRegistryContractName}`;
  readonly contractName: ExecutiveDecisionRegisterRegistryContractName;
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
  contractName: ExecutiveDecisionRegisterRegistryContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveDecisionRegisterRegistryContractDeclaration =>
  Object.freeze({
    contractId: `RTC-3:2/Contract/${contractName}` as const,
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
export const ExecutiveDecisionRegisterRegistryContracts:
  readonly ExecutiveDecisionRegisterRegistryContractDeclaration[] =
    Object.freeze([
      contract(
        "DecisionRegisterRegistryRegistration",
        "Decision Register Registry Registration",
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
        "DecisionRegisterRegistryLookup",
        "Decision Register Registry Lookup",
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
        "DecisionRegisterRegistryConflict",
        "Decision Register Registry Conflict",
        "Conflict codes for duplicate canonical IDs, duplicate namespaces, duplicate aliases, alias-to-canonical-ID collisions, alias-to-namespace collisions, ambiguous aliases, identity key mismatch, and foundation readiness failures. AliasCanonicalCollision covers both alias-to-ID and alias-to-namespace cases.",
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
        "DecisionRegisterRegistrySeal",
        "Decision Register Registry Seal",
        "Sealed registries freeze entries, aliases, ordering, and summary. Sealing removes runtime registration APIs from the published aggregate.",
        Object.freeze([
          "currentState",
          "acceptsFurtherRegistration",
          "entries",
          "aliases",
          "summary",
        ]),
        4,
      ),
      contract(
        "DecisionRegisterRegistrySummary",
        "Decision Register Registry Summary",
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
        5,
      ),
    ]);

export const ExecutiveDecisionRegisterRegistryContractNames = Object.freeze([
  "DecisionRegisterRegistryRegistration",
  "DecisionRegisterRegistryLookup",
  "DecisionRegisterRegistryConflict",
  "DecisionRegisterRegistrySeal",
  "DecisionRegisterRegistrySummary",
] as const satisfies readonly ExecutiveDecisionRegisterRegistryContractName[]);
