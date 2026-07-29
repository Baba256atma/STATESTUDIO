/**
 * RTC-2:7 — Executive Journal Runtime Execution Contract Declarations.
 *
 * Ownership: owned exclusively by RTC-2:7.
 */

export type ExecutiveJournalRuntimeExecutionContractName =
  | "JournalExecutionIntent"
  | "JournalExecutionBatch"
  | "JournalExecutionEvent"
  | "JournalExecutionOutcome"
  | "JournalExecutionReceipt"
  | "JournalExecutionIdempotency";

export interface ExecutiveJournalRuntimeExecutionContractDeclaration {
  readonly contractId:
    `RTC-2:7/Contract/${ExecutiveJournalRuntimeExecutionContractName}`;
  readonly contractName: ExecutiveJournalRuntimeExecutionContractName;
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
  contractName: ExecutiveJournalRuntimeExecutionContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveJournalRuntimeExecutionContractDeclaration =>
  Object.freeze({
    contractId: `RTC-2:7/Contract/${contractName}` as const,
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

export const ExecutiveJournalRuntimeExecutionContracts = Object.freeze([
  contract(
    "JournalExecutionIntent",
    "Journal Execution Intent",
    "Canonical intent derived from an Enforceable RTC-2:6 plan. Describes effects; performs none.",
    Object.freeze([
      "intentId",
      "enforcementPlanId",
      "policyDecisionCode",
      "idempotencyKey",
      "commandDigest",
      "expectedJournalSequence",
      "eventBatch",
    ]),
    1,
  ),
  contract(
    "JournalExecutionBatch",
    "Journal Execution Batch",
    "Non-empty ordered immutable atomic batch bound to one journal, request, plan, key, and digest.",
    Object.freeze([
      "eventBatch",
      "eventBatchDigest",
      "targetJournalId",
      "requestId",
      "enforcementPlanId",
      "idempotencyKey",
      "commandDigest",
    ]),
    2,
  ),
  contract(
    "JournalExecutionEvent",
    "Journal Execution Event Descriptor",
    "Proposed event metadata without journal payload values in summaries.",
    Object.freeze([
      "eventIdDescriptor",
      "eventType",
      "sequenceOffset",
      "payloadSchemaRef",
      "integrityRequirements",
      "predecessorRef",
      "disputeRef",
    ]),
    3,
  ),
  contract(
    "JournalExecutionOutcome",
    "Journal Execution Outcome Evidence",
    "Caller-supplied outcome evidence. RTC-2:7 never invents commit, conflict, or failure facts.",
    Object.freeze([
      "outcomeKind",
      "durableCommitEvidence",
      "acceptedEventRefs",
      "allocatedSequence",
      "partialCommit",
      "uncertain",
      "provesNoAcceptedEffect",
    ]),
    4,
  ),
  contract(
    "JournalExecutionReceipt",
    "Journal Execution Receipt",
    "Deterministic receipt from explicit outcome evidence only.",
    Object.freeze([
      "kind",
      "intentId",
      "idempotencyKey",
      "commandDigest",
      "eventBatchDigest",
      "summary",
    ]),
    5,
  ),
  contract(
    "JournalExecutionIdempotency",
    "Journal Execution Idempotency",
    "Caller-scoped key plus command digest. Same key + different digest is Conflict. Indeterminate retries keep the same key.",
    Object.freeze([
      "idempotencyKey",
      "commandDigest",
      "eventBatchDigest",
      "targetJournalId",
      "requestId",
    ]),
    6,
  ),
] as const);

export const ExecutiveJournalRuntimeExecutionContractNames = Object.freeze([
  "JournalExecutionIntent",
  "JournalExecutionBatch",
  "JournalExecutionEvent",
  "JournalExecutionOutcome",
  "JournalExecutionReceipt",
  "JournalExecutionIdempotency",
] as const satisfies readonly ExecutiveJournalRuntimeExecutionContractName[]);
