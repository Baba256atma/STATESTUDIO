/**
 * RTC-3:8 — Executive Decision Register Reconciliation & Assurance Contracts.
 *
 * Ownership: owned exclusively by RTC-3:8.
 */

export type ExecutiveDecisionRegisterAssuranceContractName =
  | "DecisionRegisterAssuranceRequest"
  | "DecisionRegisterReconciliationInput"
  | "DecisionRegisterEvidenceSet"
  | "DecisionRegisterAssuranceFinding"
  | "DecisionRegisterReconciliationResult"
  | "DecisionRegisterAssuranceResult"
  | "DecisionRegisterAssuranceSummary";

export interface ExecutiveDecisionRegisterAssuranceContractDeclaration {
  readonly contractId:
    `RTC-3:8/Contract/${ExecutiveDecisionRegisterAssuranceContractName}`;
  readonly contractName: ExecutiveDecisionRegisterAssuranceContractName;
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
  contractName: ExecutiveDecisionRegisterAssuranceContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveDecisionRegisterAssuranceContractDeclaration =>
  Object.freeze({
    contractId: `RTC-3:8/Contract/${contractName}` as const,
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

export const ExecutiveDecisionRegisterAssuranceContracts = Object.freeze([
  contract(
    "DecisionRegisterAssuranceRequest",
    "Decision Register Assurance Request",
    "Request to reconcile a supplied RTC-3:7 intent, receipt, and evidence set.",
    Object.freeze([
      "assuranceRequestId",
      "bundleId",
      "intent",
      "receipt",
      "enforcementPlan",
      "evidenceItems",
    ]),
    1,
  ),
  contract(
    "DecisionRegisterReconciliationInput",
    "Decision Register Reconciliation Input",
    "Canonical intent, batch, receipt, and plan references for reconciliation.",
    Object.freeze([
      "requestId",
      "intentId",
      "enforcementPlanId",
      "eventBatchDigest",
      "idempotencyKey",
      "planDigest",
      "expectedRegisterSequence",
    ]),
    2,
  ),
  contract(
    "DecisionRegisterEvidenceSet",
    "Decision Register Evidence Set",
    "Closed set of external evidence items with completeness state.",
    Object.freeze([
      "evidenceId",
      "evidenceKind",
      "evidenceDigest",
      "completeness",
      "producingSource",
    ]),
    3,
  ),
  contract(
    "DecisionRegisterAssuranceFinding",
    "Decision Register Assurance Finding",
    "Deterministic immutable finding with severity, subject, and result hint.",
    Object.freeze([
      "ruleId",
      "findingCode",
      "severity",
      "subjectKind",
      "resultHint",
      "orderingKey",
    ]),
    4,
  ),
  contract(
    "DecisionRegisterReconciliationResult",
    "Decision Register Reconciliation Result",
    "Intermediate reconciliation outcome before assurance aggregation.",
    Object.freeze(["bundleId", "findings", "resultHint"]),
    5,
  ),
  contract(
    "DecisionRegisterAssuranceResult",
    "Decision Register Assurance Result",
    "Closed Assured | NotAssured | Indeterminate result. Never certifies.",
    Object.freeze([
      "kind",
      "reasonCode",
      "findings",
      "summary",
      "certifies",
      "authorizesDeployment",
    ]),
    6,
  ),
  contract(
    "DecisionRegisterAssuranceSummary",
    "Decision Register Assurance Summary",
    "Deterministic phase summary with readiness and architecture decisions.",
    Object.freeze([
      "assuranceId",
      "readiness",
      "ruleCount",
      "previousPhase",
      "nextPhase",
      "architectureDecisionIds",
    ]),
    7,
  ),
] as const);

export const ExecutiveDecisionRegisterAssuranceContractNames = Object.freeze(
  ExecutiveDecisionRegisterAssuranceContracts.map(
    (item) => item.contractName,
  ),
);
