/**
 * RTC-3:7 — Executive Decision Register Execution Contract Contracts.
 *
 * Ownership: owned exclusively by RTC-3:7.
 */

export type ExecutiveDecisionRegisterExecutionContractName =
  | "DecisionRegisterExecutionRequest"
  | "DecisionRegisterAtomicBatch"
  | "DecisionRegisterIdempotencyBinding"
  | "DecisionRegisterConcurrencyBinding"
  | "DecisionRegisterExecutionIntent"
  | "DecisionRegisterOutcomeEvidence"
  | "DecisionRegisterExecutionReceipt";

export interface ExecutiveDecisionRegisterExecutionContractDeclaration {
  readonly contractId:
    `RTC-3:7/Contract/${ExecutiveDecisionRegisterExecutionContractName}`;
  readonly contractName: ExecutiveDecisionRegisterExecutionContractName;
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
  contractName: ExecutiveDecisionRegisterExecutionContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveDecisionRegisterExecutionContractDeclaration =>
  Object.freeze({
    contractId: `RTC-3:7/Contract/${contractName}` as const,
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

export const ExecutiveDecisionRegisterExecutionContracts = Object.freeze([
  contract(
    "DecisionRegisterExecutionRequest",
    "Decision Register Execution Request",
    "Planning input bound to an exact RTC-3:6 Enforceable plan. No inferred application state.",
    Object.freeze([
      "requestId",
      "enforcementResult",
      "policyDecisionCode",
      "operation",
      "actorId",
      "authorityRef",
      "targetRegister",
      "idempotencyKey",
      "planDigest",
      "expectedRegisterSequence",
      "proposedEvents",
      "confirmationEvidence",
    ]),
    1,
  ),
  contract(
    "DecisionRegisterAtomicBatch",
    "Decision Register Atomic Batch",
    "Immutable non-empty ordered batch bound to one register, request, plan, key, digest, and sequence.",
    Object.freeze([
      "registerId",
      "requestId",
      "enforcementPlanId",
      "operation",
      "idempotencyKey",
      "planDigest",
      "expectedRegisterSequence",
      "orderedEvents",
      "stepKind",
    ]),
    2,
  ),
  contract(
    "DecisionRegisterIdempotencyBinding",
    "Decision Register Idempotency Binding",
    "Same key + same plan digest is stable; same key + different digest is Conflict. Metadata only.",
    Object.freeze([
      "idempotencyKey",
      "planDigest",
      "eventBatchDigest",
      "requestId",
    ]),
    3,
  ),
  contract(
    "DecisionRegisterConcurrencyBinding",
    "Decision Register Concurrency Binding",
    "Expected register sequence is mandatory and never silently rebased.",
    Object.freeze([
      "expectedRegisterSequence",
      "observedSequence",
      "conflictCode",
    ]),
    4,
  ),
  contract(
    "DecisionRegisterExecutionIntent",
    "Decision Register Execution Intent",
    "Executable means submitable to an external authorized executor — never executed, committed, or certified here.",
    Object.freeze([
      "intentId",
      "enforcementPlanId",
      "steps",
      "eventBatch",
      "idempotencyKey",
      "planDigest",
      "expectedRegisterSequence",
      "executes",
    ]),
    5,
  ),
  contract(
    "DecisionRegisterOutcomeEvidence",
    "Decision Register Outcome Evidence",
    "Caller-supplied outcome evidence only. RTC-3:7 never invents commit facts.",
    Object.freeze([
      "outcomeKind",
      "durableCommitEvidence",
      "acceptedEventRefs",
      "conflictCode",
      "failureCode",
      "partialCommit",
      "uncertain",
      "timedOut",
      "submissionAcknowledgementOnly",
    ]),
    6,
  ),
  contract(
    "DecisionRegisterExecutionReceipt",
    "Decision Register Execution Receipt",
    "Committed, Conflict, Failed, or Indeterminate with complete binding preservation.",
    Object.freeze([
      "kind",
      "receiptId",
      "intentId",
      "enforcementPlanId",
      "idempotencyKey",
      "planDigest",
      "eventBatchDigest",
    ]),
    7,
  ),
] as const);

export const ExecutiveDecisionRegisterExecutionContractNames = Object.freeze([
  "DecisionRegisterExecutionRequest",
  "DecisionRegisterAtomicBatch",
  "DecisionRegisterIdempotencyBinding",
  "DecisionRegisterConcurrencyBinding",
  "DecisionRegisterExecutionIntent",
  "DecisionRegisterOutcomeEvidence",
  "DecisionRegisterExecutionReceipt",
] as const satisfies readonly ExecutiveDecisionRegisterExecutionContractName[]);
