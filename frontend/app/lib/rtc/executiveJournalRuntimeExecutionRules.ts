/**
 * RTC-2:7 — Executive Journal Runtime Execution Contract Rules.
 *
 * Pure deterministic plan-to-intent and outcome-to-receipt transforms.
 * Never persists, appends, signs, encrypts, or mutates state.
 *
 * Ownership: owned exclusively by RTC-2:7.
 */

import { ExecutiveJournalRuntimeEnforcement } from "./executiveJournalRuntimeEnforcement.ts";
import {
  ExecutiveJournalRuntimeExecutionId,
  ExecutiveJournalRuntimeExecutionVersion,
} from "./executiveJournalRuntimeExecutionIdentity.ts";
import { ExecutiveJournalRuntimeExecutionStepKinds } from "./executiveJournalRuntimeExecutionLifecycle.ts";
import type {
  ExecutiveJournalRuntimeExecutionIntent,
  ExecutiveJournalRuntimeExecutionIntentRequest,
  ExecutiveJournalRuntimeExecutionIntentResult,
  ExecutiveJournalRuntimeExecutionOutcomeEvidence,
  ExecutiveJournalRuntimeExecutionReceipt,
  ExecutiveJournalRuntimeExecutionStep,
  ExecutiveJournalRuntimeExecutionStepKind,
  ExecutiveJournalRuntimeProposedEventDescriptor,
} from "./executiveJournalRuntimeExecutionTypes.ts";

export interface ExecutiveJournalRuntimeExecutionRuleDeclaration {
  readonly ruleId: string;
  readonly ruleKey: string;
  readonly priority: number;
  readonly description: string;
  readonly evaluatesOnly: true;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const rule = (
  priority: number,
  ruleKey: string,
  description: string,
): ExecutiveJournalRuntimeExecutionRuleDeclaration =>
  Object.freeze({
    ruleId: `RTC-2:7/Rule/${String(priority).padStart(2, "0")}`,
    ruleKey,
    priority,
    description,
    evaluatesOnly: true as const,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveJournalRuntimeExecutionRules = Object.freeze([
  rule(1, "EnforceableOnly", "Only Enforceable RTC-2:6 results may form intents."),
  rule(2, "AuthorityBinding", "Authority must match the enforcement plan exactly."),
  rule(3, "IdempotencyRequired", "Caller-scoped idempotency key and digest are mandatory."),
  rule(4, "SequenceRequired", "Expected journal sequence is mandatory; never rebased."),
  rule(5, "AtomicBatch", "Batch must be non-empty, single-journal, ordered, and atomic."),
  rule(6, "AppendOnly", "In-place mutation, overwrite, deletion, and sequence reuse are rejected."),
  rule(7, "RelationshipIntegrity", "Supersession, dispute, and disposition require relationship refs."),
  rule(8, "AiBoundary", "AI cannot be the executing authority for prohibited operations."),
  rule(9, "PrivateReflection", "Private reflection cannot enter shared execution paths."),
  rule(10, "ReceiptEvidence", "Receipts require explicit outcome evidence; never invent facts."),
  rule(11, "NoPartialCommit", "Partial commit cannot produce Committed."),
  rule(12, "IndeterminateRetry", "Indeterminate retries must reuse the same idempotency key."),
] as const);

const STEP_ORDER = Object.freeze(
  Object.fromEntries(
    ExecutiveJournalRuntimeExecutionStepKinds.map((kind, index) => [
      kind,
      index + 1,
    ]),
  ) as Readonly<Record<ExecutiveJournalRuntimeExecutionStepKind, number>>,
);

const isPresent = (value: unknown): boolean =>
  value !== null && value !== undefined && value !== "";

const makeStep = (
  kind: ExecutiveJournalRuntimeExecutionStepKind,
  description: string,
): ExecutiveJournalRuntimeExecutionStep =>
  Object.freeze({
    stepId: `RTC-2:7/Step/${kind}`,
    kind,
    order: STEP_ORDER[kind],
    description,
    metadataOnly: true as const,
    immutable: true as const,
    executes: false as const,
  });

const canonicalSteps = (): readonly ExecutiveJournalRuntimeExecutionStep[] =>
  Object.freeze(
    ExecutiveJournalRuntimeExecutionStepKinds.map((kind) =>
      makeStep(kind, `Descriptor for required runtime behavior: ${kind}.`)
    ),
  );

const digestOf = (
  events: readonly ExecutiveJournalRuntimeProposedEventDescriptor[],
): string =>
  events
    .map((event) =>
      [
        event.eventIdDescriptor,
        event.eventType,
        event.eventVersion,
        event.journalId,
        String(event.sequenceOffset),
        event.payloadSchemaRef,
        event.predecessorRef ?? "",
        event.disputeRef ?? "",
      ].join(":")
    )
    .join("|");

const intentIdFor = (
  request: ExecutiveJournalRuntimeExecutionIntentRequest,
  planId: string,
  batchDigest: string,
): string =>
  [
    "RTC-2:7/Intent",
    request.requestId,
    planId,
    request.idempotencyKey ?? "",
    request.commandDigest ?? "",
    batchDigest,
  ].join("/");

const rejected = (
  request: ExecutiveJournalRuntimeExecutionIntentRequest,
  reasonCode: string,
  reason: string,
  enforcementPlanId: string | null = null,
): ExecutiveJournalRuntimeExecutionIntentResult =>
  Object.freeze({
    kind: "Rejected" as const,
    reasonCode,
    reason,
    requestId: request.requestId,
    enforcementPlanId,
    eventBatch: Object.freeze([]) as readonly [],
    intent: null,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
    executes: false as const,
  });

const confirmationRequiredOps = Object.freeze([
  "Confirm",
  "Accept",
  "CloseCommitment",
  "Dispose",
  "ApplyRetention",
  "BreakGlassAccess",
  "PromotePrivateReflection",
]);

const aiForbiddenOps = Object.freeze([
  "Confirm",
  "Accept",
  "CloseCommitment",
  "Disclose",
  "Export",
  "ApplyRetention",
  "Dispose",
  "BreakGlassAccess",
  "PromotePrivateReflection",
]);

const confirmationValid = (
  request: ExecutiveJournalRuntimeExecutionIntentRequest,
  planActor: string,
  planAuthority: string,
  planTarget: string,
  policyDecisionCode: string,
  policyVersion: string,
): boolean => {
  const evidence = request.confirmationEvidence;
  if (!evidence) {
    return false;
  }
  return evidence.actorId === request.actorId
    && evidence.actorId === planActor
    && evidence.requestId === request.requestId
    && evidence.policyDecisionCode === policyDecisionCode
    && evidence.policyVersion === policyVersion
    && evidence.targetId === planTarget
    && evidence.operation === request.operation
    && evidence.authorityRef === planAuthority
    && evidence.singleUse === true
    && evidence.expired === false
    && evidence.reused === false
    && isPresent(evidence.confirmationId)
    && isPresent(evidence.expiryMetadata)
    && isPresent(evidence.proposedEffect);
};

/**
 * Construct an execution intent from an enforcement result.
 * Pure. Deterministic. Never executes.
 */
export function constructExecutiveJournalRuntimeExecutionIntent(
  request: ExecutiveJournalRuntimeExecutionIntentRequest,
): ExecutiveJournalRuntimeExecutionIntentResult {
  const enforcement = request.enforcementResult;

  if (
    enforcement.kind !== "Blocked"
    && enforcement.kind !== "AwaitingConfirmation"
    && enforcement.kind !== "Enforceable"
  ) {
    return rejected(request, "EXEC-UNKNOWN-KIND", "Unknown enforcement result kind.");
  }

  if (enforcement.kind === "Blocked") {
    return rejected(
      request,
      "EXEC-BLOCKED",
      "Blocked enforcement results cannot form an execution intent.",
    );
  }

  if (enforcement.kind === "AwaitingConfirmation") {
    return rejected(
      request,
      "EXEC-AWAITING-CONFIRMATION",
      "AwaitingConfirmation results cannot form an execution intent.",
    );
  }

  const plan = enforcement.plan;
  if (!plan) {
    return rejected(
      request,
      "EXEC-MISSING-PLAN",
      "Enforceable result is missing its enforcement plan.",
    );
  }

  if (
    ExecutiveJournalRuntimeEnforcement.identity.id
      !== "RTC-2:6/ExecutiveJournalRuntimePolicyEnforcement"
  ) {
    return rejected(
      request,
      "EXEC-UNKNOWN-ENFORCEMENT",
      "Unrecognized enforcement aggregate identity.",
      plan.planId,
    );
  }

  if (!isPresent(request.policyDecisionCode) || !isPresent(request.policyVersion)) {
    return rejected(
      request,
      "EXEC-MISSING-POLICY",
      "Missing policy-decision reference.",
      plan.planId,
    );
  }

  if (
    request.policyDecisionCode !== plan.policyDecisionCode
    || request.policyVersion !== plan.policyVersion
    || request.policyDecisionCode !== enforcement.policyDecisionCode
  ) {
    return rejected(
      request,
      "EXEC-POLICY-MISMATCH",
      "Policy-decision reference does not match the enforcement plan.",
      plan.planId,
    );
  }

  if (request.validationOutcome !== "Valid") {
    return rejected(
      request,
      "EXEC-MISSING-VALIDATION",
      "Missing or invalid validation reference.",
      plan.planId,
    );
  }

  if (!isPresent(request.authorityRef) || !isPresent(plan.authorityRef)) {
    return rejected(
      request,
      "EXEC-MISSING-AUTHORITY",
      "Missing authority reference.",
      plan.planId,
    );
  }

  if (request.authorityRef !== plan.authorityRef) {
    return rejected(
      request,
      "EXEC-AUTHORITY-MISMATCH",
      "Authority reference must exactly match the enforcement plan.",
      plan.planId,
    );
  }

  if (request.actorId !== plan.actorId) {
    return rejected(
      request,
      "EXEC-ACTOR-MISMATCH",
      "Actor reference must exactly match the enforcement plan.",
      plan.planId,
    );
  }

  if (
    request.requestId !== plan.requestId
    || request.requestId !== enforcement.requestId
  ) {
    return rejected(
      request,
      "EXEC-REQUEST-MISMATCH",
      "Request identity must match the enforcement plan.",
      plan.planId,
    );
  }

  if (request.targetJournalId !== plan.targetJournalId) {
    return rejected(
      request,
      "EXEC-JOURNAL-MISMATCH",
      "Target journal must match the enforcement plan.",
      plan.planId,
    );
  }

  if (request.operation !== plan.operation) {
    return rejected(
      request,
      "EXEC-OPERATION-MISMATCH",
      "Operation must match the enforcement plan.",
      plan.planId,
    );
  }

  if (
    request.actorKind === "Ai"
    && (aiForbiddenOps as readonly string[]).includes(request.operation)
  ) {
    return rejected(
      request,
      "EXEC-AI",
      "AI cannot become the executing authority for this operation.",
      plan.planId,
    );
  }

  if (!isPresent(request.idempotencyKey)) {
    return rejected(
      request,
      "EXEC-MISSING-IDEMPOTENCY",
      "Caller-scoped idempotency key is required.",
      plan.planId,
    );
  }

  if (!isPresent(request.commandDigest)) {
    return rejected(
      request,
      "EXEC-MISSING-DIGEST",
      "Deterministic command digest is required.",
      plan.planId,
    );
  }

  if (
    request.expectedJournalSequence === null
    || request.expectedJournalSequence === undefined
    || !Number.isInteger(request.expectedJournalSequence)
    || request.expectedJournalSequence < 0
  ) {
    return rejected(
      request,
      "EXEC-MISSING-SEQUENCE",
      "Expected journal sequence is required and must be a non-negative integer.",
      plan.planId,
    );
  }

  if (request.proposedEvents.length === 0) {
    return rejected(
      request,
      "EXEC-EMPTY-BATCH",
      "Event batch must be non-empty.",
      plan.planId,
    );
  }

  const journals = new Set(request.proposedEvents.map((event) => event.journalId));
  if (journals.size !== 1 || !journals.has(request.targetJournalId)) {
    return rejected(
      request,
      "EXEC-MULTI-JOURNAL",
      "Event batch must bind to exactly one target journal.",
      plan.planId,
    );
  }

  const offsets = request.proposedEvents.map((event) => event.sequenceOffset);
  const sortedOffsets = [...offsets].sort((a, b) => a - b);
  if (offsets.join(",") !== sortedOffsets.join(",")) {
    return rejected(
      request,
      "EXEC-EVENT-ORDER",
      "Proposed events must be supplied in deterministic sequence-offset order.",
      plan.planId,
    );
  }

  if (
    request.requestsInPlaceMutation
    || request.requestsHistoricalOverwrite
    || request.requestsHistoricalDeletion
    || request.requestsSequenceReuse
  ) {
    return rejected(
      request,
      "EXEC-APPEND-ONLY",
      "In-place mutation, overwrite, deletion, and sequence reuse are rejected.",
      plan.planId,
    );
  }

  if (
    request.operation === "Supersede"
    && request.proposedEvents.some((event) => !isPresent(event.predecessorRef))
  ) {
    return rejected(
      request,
      "EXEC-SUPERSESSION",
      "Supersession must preserve predecessor references.",
      plan.planId,
    );
  }

  if (
    (request.operation === "ResolveDispute" || request.operation === "Dispute")
    && request.proposedEvents.some((event) => !isPresent(event.disputeRef))
  ) {
    return rejected(
      request,
      "EXEC-DISPUTE",
      "Dispute and resolution must preserve dispute references.",
      plan.planId,
    );
  }

  if (
    request.operation === "Dispose"
    && (
      request.evidenceRefs.length === 0
      || request.proposedEvents.every(
        (event) => !event.eventType.includes("Governance"),
      )
    )
  ) {
    return rejected(
      request,
      "EXEC-DISPOSITION",
      "Disposition requires append-only governance-event evidence.",
      plan.planId,
    );
  }

  if (request.requiresUnresolvedOpenIssueDefault) {
    return rejected(
      request,
      "EXEC-OPEN-ISSUE",
      "Execution requires an unresolved open-issue default and is rejected.",
      plan.planId,
    );
  }

  if (request.privacyCategory === "PrivateReflection") {
    if (
      request.operation === "Search"
      || request.operation === "Project"
      || request.operation === "Export"
      || request.operation === "Disclose"
    ) {
      return rejected(
        request,
        "EXEC-PRIVATE",
        "Private reflection cannot enter shared execution paths.",
        plan.planId,
      );
    }
  }

  if (
    (confirmationRequiredOps as readonly string[]).includes(request.operation)
  ) {
    if (!request.confirmationEvidence) {
      return rejected(
        request,
        "EXEC-CONFIRMATION-MISSING",
        "Required confirmation evidence is missing.",
        plan.planId,
      );
    }
    if (
      !confirmationValid(
        request,
        plan.actorId,
        plan.authorityRef,
        plan.targetEntityId,
        plan.policyDecisionCode,
        plan.policyVersion,
      )
    ) {
      return rejected(
        request,
        "EXEC-CONFIRMATION-MISMATCH",
        "Confirmation evidence does not bind exactly to actor, request, target, effect, or policy version.",
        plan.planId,
      );
    }
  }

  if (
    request.operation === "PromotePrivateReflection"
    && request.proposedEvents.every((event) =>
      event.recordCategory === "PrivateReflection"
    )
  ) {
    return rejected(
      request,
      "EXEC-PROMOTION",
      "Valid promotion must prepare a new shared event while preserving the private original.",
      plan.planId,
    );
  }

  const events = Object.freeze(
    request.proposedEvents.map((event) => Object.freeze({ ...event })),
  );
  const eventBatchDigest = digestOf(events);
  const steps = canonicalSteps();
  const intent: ExecutiveJournalRuntimeExecutionIntent = Object.freeze({
    intentId: intentIdFor(request, plan.planId, eventBatchDigest),
    enforcementPlanId: plan.planId,
    policyDecisionCode: plan.policyDecisionCode,
    policyVersion: plan.policyVersion,
    validationOutcome: "Valid" as const,
    requestId: request.requestId,
    targetJournalId: request.targetJournalId,
    actorId: request.actorId,
    authorityRef: request.authorityRef as string,
    purpose: request.purpose,
    operation: request.operation,
    expectedJournalSequence: request.expectedJournalSequence as number,
    idempotencyKey: request.idempotencyKey as string,
    commandDigest: request.commandDigest as string,
    eventBatch: events,
    eventBatchDigest,
    evidenceRefs: Object.freeze([...request.evidenceRefs]),
    privacyCategory: request.privacyCategory,
    classification: request.classification,
    lifecyclePrecondition: request.lifecyclePrecondition,
    expectedLifecycleResult: request.expectedLifecycleResult,
    steps,
    requiredIntegrityOperations: Object.freeze([
      "PrepareIntegritySeal",
      "VerifyEvidenceBinding",
    ]),
    requiredTransactionOperations: Object.freeze([
      "BeginAtomicBoundary",
      "AllocateJournalSequence",
      "PrepareEventAppend",
      "PrepareIdempotencyRecord",
      "CommitAtomicBoundary",
    ]),
    requiredOutboxOperations: Object.freeze([
      "PrepareTransactionalOutbox",
    ]),
    summary: [
      ExecutiveJournalRuntimeExecutionId,
      ExecutiveJournalRuntimeExecutionVersion,
      plan.planId,
      request.operation,
      String(events.length),
      eventBatchDigest,
    ].join("|"),
    telemetry: Object.freeze({
      resultKind: "Executable" as const,
      operation: request.operation,
      entityKind: events[0]?.eventType ?? "Unknown",
      batchSize: events.length,
      policyCode: plan.policyDecisionCode,
      enforcementCode: enforcement.reasonCode,
      correlationId: request.requestId,
      containsPayload: false as const,
      metadataOnly: true as const,
    }),
    metadataOnly: true as const,
    immutable: true as const,
    executes: false as const,
  });

  return Object.freeze({
    kind: "Executable" as const,
    reasonCode: "EXEC-EXECUTABLE",
    reason: "Canonical execution intent constructed from Enforceable plan.",
    requestId: request.requestId,
    intent,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
    executes: false as const,
  });
}

/**
 * Compare two executable intents for idempotency semantics.
 * Same key + different digest → Conflict descriptor (no receipt yet).
 */
export function compareExecutiveJournalRuntimeIdempotency(
  left: ExecutiveJournalRuntimeExecutionIntent,
  right: ExecutiveJournalRuntimeExecutionIntent,
): "Same" | "Conflict" | "Distinct" {
  if (left.idempotencyKey !== right.idempotencyKey) {
    return "Distinct";
  }
  if (
    left.commandDigest === right.commandDigest
    && left.eventBatchDigest === right.eventBatchDigest
    && left.targetJournalId === right.targetJournalId
    && left.requestId === right.requestId
  ) {
    return "Same";
  }
  return "Conflict";
}

/**
 * Create a receipt from an executable intent and explicit outcome evidence.
 * Never invents outcome facts.
 */
export function createExecutiveJournalRuntimeExecutionReceipt(
  intent: ExecutiveJournalRuntimeExecutionIntent,
  outcome: ExecutiveJournalRuntimeExecutionOutcomeEvidence,
): ExecutiveJournalRuntimeExecutionReceipt {
  const receiptId = [
    "RTC-2:7/Receipt",
    intent.intentId,
    outcome.outcomeKind,
  ].join("/");

  if (
    outcome.outcomeKind !== "Committed"
    && outcome.outcomeKind !== "Conflict"
    && outcome.outcomeKind !== "Failed"
    && outcome.outcomeKind !== "Indeterminate"
  ) {
    return Object.freeze({
      kind: "Failed" as const,
      receiptId,
      intentId: intent.intentId,
      enforcementPlanId: intent.enforcementPlanId,
      policyDecisionCode: intent.policyDecisionCode,
      requestId: intent.requestId,
      idempotencyKey: intent.idempotencyKey,
      commandDigest: intent.commandDigest,
      targetJournalId: intent.targetJournalId,
      eventBatchDigest: intent.eventBatchDigest,
      failureCode: "EXEC-UNKNOWN-OUTCOME",
      provesNoAcceptedEffect: true as const,
      summary: "Unknown outcome kind fails closed.",
      metadataOnly: true as const,
      immutable: true as const,
      deterministic: true as const,
    });
  }

  if (outcome.partialCommit || outcome.uncertain) {
    return Object.freeze({
      kind: "Indeterminate" as const,
      receiptId: [
        "RTC-2:7/Receipt",
        intent.intentId,
        "Indeterminate",
      ].join("/"),
      intentId: intent.intentId,
      enforcementPlanId: intent.enforcementPlanId,
      policyDecisionCode: intent.policyDecisionCode,
      requestId: intent.requestId,
      idempotencyKey: intent.idempotencyKey,
      commandDigest: intent.commandDigest,
      targetJournalId: intent.targetJournalId,
      eventBatchDigest: intent.eventBatchDigest,
      recoveryInstructionCode:
        outcome.recoveryInstructionCode ?? "RECONCILE_SAME_IDEMPOTENCY_KEY",
      retryRequiresSameIdempotencyKey: true as const,
      prohibitsNewIdempotencyKey: true as const,
      acceptedEventRefs: Object.freeze([]) as readonly [],
      summary:
        "Partial or uncertain outcome is Indeterminate; retry must reuse the same idempotency key.",
      metadataOnly: true as const,
      immutable: true as const,
      deterministic: true as const,
    });
  }

  if (outcome.outcomeKind === "Committed") {
    const complete = isPresent(outcome.durableCommitEvidence)
      && isPresent(outcome.allocatedSequence)
      && isPresent(outcome.integrityEvidenceRef)
      && isPresent(outcome.idempotencyRecordRef)
      && isPresent(outcome.atomicBoundaryEvidence)
      && outcome.acceptedEventRefs.length === intent.eventBatch.length
      && !outcome.partialCommit;

    if (!complete) {
      return Object.freeze({
        kind: "Indeterminate" as const,
        receiptId: [
          "RTC-2:7/Receipt",
          intent.intentId,
          "Indeterminate",
        ].join("/"),
        intentId: intent.intentId,
        enforcementPlanId: intent.enforcementPlanId,
        policyDecisionCode: intent.policyDecisionCode,
        requestId: intent.requestId,
        idempotencyKey: intent.idempotencyKey,
        commandDigest: intent.commandDigest,
        targetJournalId: intent.targetJournalId,
        eventBatchDigest: intent.eventBatchDigest,
        recoveryInstructionCode:
          outcome.recoveryInstructionCode ?? "RECONCILE_SAME_IDEMPOTENCY_KEY",
        retryRequiresSameIdempotencyKey: true as const,
        prohibitsNewIdempotencyKey: true as const,
        acceptedEventRefs: Object.freeze([]) as readonly [],
        summary:
          "Incomplete commit evidence cannot produce Committed; result is Indeterminate.",
        metadataOnly: true as const,
        immutable: true as const,
        deterministic: true as const,
      });
    }

    return Object.freeze({
      kind: "Committed" as const,
      receiptId,
      intentId: intent.intentId,
      enforcementPlanId: intent.enforcementPlanId,
      policyDecisionCode: intent.policyDecisionCode,
      requestId: intent.requestId,
      idempotencyKey: intent.idempotencyKey,
      commandDigest: intent.commandDigest,
      targetJournalId: intent.targetJournalId,
      eventBatchDigest: intent.eventBatchDigest,
      allocatedSequence: outcome.allocatedSequence as string,
      acceptedEventRefs: Object.freeze([...outcome.acceptedEventRefs]),
      integrityEvidenceRef: outcome.integrityEvidenceRef as string,
      idempotencyRecordRef: outcome.idempotencyRecordRef as string,
      atomicBoundaryEvidence: outcome.atomicBoundaryEvidence as string,
      outboxEvidenceRef: outcome.outboxEvidenceRef,
      summary: [
        "Committed",
        intent.intentId,
        outcome.allocatedSequence,
        String(outcome.acceptedEventRefs.length),
      ].join("|"),
      telemetry: Object.freeze({
        resultKind: "Committed" as const,
        operation: intent.operation,
        batchSize: intent.eventBatch.length,
        sequenceRange: outcome.allocatedSequence as string,
        policyCode: intent.policyDecisionCode,
        enforcementCode: intent.enforcementPlanId,
        integrityResultCode: "integrity-ok",
        correlationId: intent.requestId,
        containsPayload: false as const,
        metadataOnly: true as const,
      }),
      metadataOnly: true as const,
      immutable: true as const,
      deterministic: true as const,
    });
  }

  if (outcome.outcomeKind === "Conflict") {
    return Object.freeze({
      kind: "Conflict" as const,
      receiptId,
      intentId: intent.intentId,
      enforcementPlanId: intent.enforcementPlanId,
      policyDecisionCode: intent.policyDecisionCode,
      requestId: intent.requestId,
      idempotencyKey: intent.idempotencyKey,
      commandDigest: intent.commandDigest,
      targetJournalId: intent.targetJournalId,
      eventBatchDigest: intent.eventBatchDigest,
      expectedSequence:
        outcome.expectedSequence ?? intent.expectedJournalSequence,
      observedSequence: outcome.observedSequence,
      conflictCode: outcome.conflictCode
        ?? (outcome.idempotencyConflict
          ? "IDEMPOTENCY_DIGEST_MISMATCH"
          : "SEQUENCE_MISMATCH"),
      idempotencyConflict: outcome.idempotencyConflict,
      summary: [
        "Conflict",
        intent.intentId,
        String(outcome.expectedSequence ?? intent.expectedJournalSequence),
        String(outcome.observedSequence ?? "unknown"),
      ].join("|"),
      revealsRestrictedContent: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministic: true as const,
    });
  }

  if (outcome.outcomeKind === "Failed") {
    if (!outcome.provesNoAcceptedEffect) {
      return Object.freeze({
        kind: "Indeterminate" as const,
        receiptId: [
          "RTC-2:7/Receipt",
          intent.intentId,
          "Indeterminate",
        ].join("/"),
        intentId: intent.intentId,
        enforcementPlanId: intent.enforcementPlanId,
        policyDecisionCode: intent.policyDecisionCode,
        requestId: intent.requestId,
        idempotencyKey: intent.idempotencyKey,
        commandDigest: intent.commandDigest,
        targetJournalId: intent.targetJournalId,
        eventBatchDigest: intent.eventBatchDigest,
        recoveryInstructionCode:
          outcome.recoveryInstructionCode ?? "RECONCILE_SAME_IDEMPOTENCY_KEY",
        retryRequiresSameIdempotencyKey: true as const,
        prohibitsNewIdempotencyKey: true as const,
        acceptedEventRefs: Object.freeze([]) as readonly [],
        summary:
          "Failure without proof of no accepted effect is Indeterminate.",
        metadataOnly: true as const,
        immutable: true as const,
        deterministic: true as const,
      });
    }
    return Object.freeze({
      kind: "Failed" as const,
      receiptId,
      intentId: intent.intentId,
      enforcementPlanId: intent.enforcementPlanId,
      policyDecisionCode: intent.policyDecisionCode,
      requestId: intent.requestId,
      idempotencyKey: intent.idempotencyKey,
      commandDigest: intent.commandDigest,
      targetJournalId: intent.targetJournalId,
      eventBatchDigest: intent.eventBatchDigest,
      failureCode: outcome.failureCode ?? "EXEC-FAILED",
      provesNoAcceptedEffect: true as const,
      summary: ["Failed", intent.intentId, outcome.failureCode ?? "EXEC-FAILED"]
        .join("|"),
      metadataOnly: true as const,
      immutable: true as const,
      deterministic: true as const,
    });
  }

  return Object.freeze({
    kind: "Indeterminate" as const,
    receiptId,
    intentId: intent.intentId,
    enforcementPlanId: intent.enforcementPlanId,
    policyDecisionCode: intent.policyDecisionCode,
    requestId: intent.requestId,
    idempotencyKey: intent.idempotencyKey,
    commandDigest: intent.commandDigest,
    targetJournalId: intent.targetJournalId,
    eventBatchDigest: intent.eventBatchDigest,
    recoveryInstructionCode:
      outcome.recoveryInstructionCode ?? "RECONCILE_SAME_IDEMPOTENCY_KEY",
    retryRequiresSameIdempotencyKey: true as const,
    prohibitsNewIdempotencyKey: true as const,
    acceptedEventRefs: Object.freeze([]) as readonly [],
    summary:
      "Indeterminate outcome preserves the same idempotency key and requires reconciliation.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export function isExecutiveJournalExecutionRejected(
  result: ExecutiveJournalRuntimeExecutionIntentResult,
): boolean {
  return result.kind === "Rejected";
}

export function isExecutiveJournalExecutionExecutable(
  result: ExecutiveJournalRuntimeExecutionIntentResult,
): boolean {
  return result.kind === "Executable";
}
