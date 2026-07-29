/**
 * RTC-2:8 — Executive Journal Runtime Assurance Contracts.
 *
 * Ownership: owned exclusively by RTC-2:8.
 */

export type ExecutiveJournalRuntimeAssuranceContractName =
  | "JournalAssuranceEvidenceBundle"
  | "JournalAssuranceFinding"
  | "JournalAssuranceReconciliation"
  | "JournalAssuranceReport";

export interface ExecutiveJournalRuntimeAssuranceContractDeclaration {
  readonly contractId:
    `RTC-2:8/Contract/${ExecutiveJournalRuntimeAssuranceContractName}`;
  readonly contractName: ExecutiveJournalRuntimeAssuranceContractName;
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
  contractName: ExecutiveJournalRuntimeAssuranceContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveJournalRuntimeAssuranceContractDeclaration =>
  Object.freeze({
    contractId: `RTC-2:8/Contract/${contractName}` as const,
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

export const ExecutiveJournalRuntimeAssuranceContracts = Object.freeze([
  contract(
    "JournalAssuranceEvidenceBundle",
    "Journal Assurance Evidence Bundle",
    "Immutable metadata-only evidence supplied by the caller. No journal payloads. No live fetches.",
    Object.freeze([
      "bundleId",
      "intent",
      "receipt",
      "enforcementPlanId",
      "policyDecisionCode",
      "idempotencyKey",
      "commandDigest",
      "eventBatchDigest",
      "acceptedEventRefs",
      "integrityEvidence",
      "projection",
    ]),
    1,
  ),
  contract(
    "JournalAssuranceFinding",
    "Journal Assurance Finding",
    "Stable ordered finding with severity, subject, expected/observed metadata, and response code.",
    Object.freeze([
      "ruleId",
      "findingCode",
      "severity",
      "subjectKind",
      "subjectPath",
      "expected",
      "observed",
      "orderingKey",
      "recommendedResponseCode",
    ]),
    2,
  ),
  contract(
    "JournalAssuranceReconciliation",
    "Journal Assurance Reconciliation",
    "Precedence-ordered reconciliation of intent, receipt, and evidence into Reconciled/Divergent/Indeterminate/Invalid.",
    Object.freeze([
      "kind",
      "findings",
      "reasonCode",
      "summary",
      "repairs",
    ]),
    3,
  ),
  contract(
    "JournalAssuranceReport",
    "Journal Assurance Report",
    "Deterministic assurance summary over ordered findings. Metadata only.",
    Object.freeze([
      "assuranceId",
      "resultKind",
      "findingCount",
      "summary",
      "openIssueCount",
    ]),
    4,
  ),
] as const);

export const ExecutiveJournalRuntimeAssuranceContractNames = Object.freeze([
  "JournalAssuranceEvidenceBundle",
  "JournalAssuranceFinding",
  "JournalAssuranceReconciliation",
  "JournalAssuranceReport",
] as const satisfies readonly ExecutiveJournalRuntimeAssuranceContractName[]);
