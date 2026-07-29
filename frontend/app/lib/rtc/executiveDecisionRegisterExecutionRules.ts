/**
 * RTC-3:7 — Executive Decision Register Execution Contract Rules.
 *
 * Pure deterministic plan-to-intent and outcome-to-receipt transforms.
 * Never persists, appends, signs, encrypts, or mutates state.
 *
 * Ownership: owned exclusively by RTC-3:7.
 */

import { ExecutiveDecisionRegisterEnforcement } from "./executiveDecisionRegisterEnforcement.ts";
import {
  ExecutiveDecisionRegisterExecutionId,
  ExecutiveDecisionRegisterExecutionVersion,
} from "./executiveDecisionRegisterExecutionIdentity.ts";
import {
  ExecutiveDecisionRegisterExecutionStepKinds,
  ExecutiveDecisionRegisterExecutionStepRoles,
} from "./executiveDecisionRegisterExecutionLifecycle.ts";
import type {
  ExecutiveDecisionRegisterExecutionIntent,
  ExecutiveDecisionRegisterExecutionIntentRequest,
  ExecutiveDecisionRegisterExecutionIntentResult,
  ExecutiveDecisionRegisterExecutionOutcomeEvidence,
  ExecutiveDecisionRegisterExecutionReceipt,
  ExecutiveDecisionRegisterExecutionRejectionCode,
  ExecutiveDecisionRegisterExecutionStep,
  ExecutiveDecisionRegisterExecutionStepKind,
  ExecutiveDecisionRegisterExecutionSuccessCode,
  ExecutiveDecisionRegisterProposedEventDescriptor,
} from "./executiveDecisionRegisterExecutionTypes.ts";

export interface ExecutiveDecisionRegisterExecutionRuleDeclaration {
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
): ExecutiveDecisionRegisterExecutionRuleDeclaration =>
  Object.freeze({
    ruleId: `RTC-3:7/Rule/${String(priority).padStart(2, "0")}`,
    ruleKey,
    priority,
    description,
    evaluatesOnly: true as const,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveDecisionRegisterExecutionRules = Object.freeze([
  rule(1, "EnforceableOnly", "Only Enforceable RTC-3:6 results may form intents."),
  rule(2, "AuthorityBinding", "Authority, actor, request, subject, and operation must match the enforcement plan."),
  rule(3, "IdempotencyRequired", "Caller-scoped idempotency key and plan digest are mandatory."),
  rule(4, "SequenceRequired", "Expected register sequence is mandatory; never rebased."),
  rule(5, "AtomicBatch", "Batch must be non-empty, single-register, ordered, and atomic."),
  rule(6, "AppendOnly", "In-place mutation, overwrite, deletion, and sequence reuse are rejected."),
  rule(7, "RelationshipIntegrity", "Supersession, dispute, and disposition require relationship refs."),
  rule(8, "AiBoundary", "AI cannot be the executing authority for prohibited operations."),
  rule(9, "PrivacyBoundary", "Private reflection and missing classification cannot enter shared execution paths."),
  rule(10, "ReceiptEvidence", "Receipts require explicit outcome evidence; never invent facts."),
  rule(11, "NoPartialCommit", "Partial commit, acknowledgement-only, or timeout cannot produce Committed."),
  rule(12, "IndeterminateRetry", "Indeterminate retries must reuse the same idempotency key and plan digest."),
] as const);

/** Closed success-code vocabulary. Never used on Rejected results. */
export const ExecutiveDecisionRegisterExecutionSuccessCodes = Object.freeze([
  "EXEC-EXECUTABLE",
] as const satisfies readonly ExecutiveDecisionRegisterExecutionSuccessCode[]);

/**
 * Closed rejection-reason vocabulary. Never includes success codes.
 * Ordered for deterministic completeness coverage.
 */
export const ExecutiveDecisionRegisterExecutionRejectionCodes = Object.freeze([
  "EXEC-UNKNOWN-KIND",
  "EXEC-BLOCKED",
  "EXEC-AWAITING-CONFIRMATION",
  "EXEC-MISSING-PLAN",
  "EXEC-UNKNOWN-ENFORCEMENT",
  "EXEC-MISSING-POLICY",
  "EXEC-POLICY-MISMATCH",
  "EXEC-MISSING-VALIDATION",
  "EXEC-MISSING-AUTHORITY",
  "EXEC-AUTHORITY-MISMATCH",
  "EXEC-ACTOR-MISMATCH",
  "EXEC-REQUEST-MISMATCH",
  "EXEC-REGISTER-MISMATCH",
  "EXEC-SUBJECT-MISMATCH",
  "EXEC-OPERATION-MISMATCH",
  "EXEC-AI",
  "EXEC-MISSING-IDEMPOTENCY",
  "EXEC-MISSING-DIGEST",
  "EXEC-MISSING-OBLIGATION-DIGEST",
  "EXEC-MISSING-SEQUENCE",
  "EXEC-EMPTY-BATCH",
  "EXEC-UNKNOWN-STEP",
  "EXEC-EVENT-ORDER",
  "EXEC-EXTRA-STEP",
  "EXEC-MISSING-STEP",
  "EXEC-MULTI-REGISTER",
  "EXEC-APPEND-ONLY",
  "EXEC-SUPERSESSION",
  "EXEC-DISPUTE",
  "EXEC-DISPOSITION",
  "EXEC-OPEN-ISSUE",
  "EXEC-PRIVATE",
  "EXEC-CLASSIFICATION",
  "EXEC-CONFIRMATION-MISSING",
  "EXEC-CONFIRMATION-MISMATCH",
  "EXEC-AUTHORIZATION-EXPIRED",
] as const satisfies readonly ExecutiveDecisionRegisterExecutionRejectionCode[]);

/**
 * Combined decision-code catalogue (success then rejection).
 * Success and rejection remain independently typed subsets.
 */
export const ExecutiveDecisionRegisterExecutionDecisionCodes = Object.freeze([
  ...ExecutiveDecisionRegisterExecutionSuccessCodes,
  ...ExecutiveDecisionRegisterExecutionRejectionCodes,
] as const);

/**
 * Deterministic atomic-batch validation precedence:
 * 1 empty → 2 unknown/malformed step → 3 duplicate step →
 * 4 unauthorized extra → 5 missing required → 6 incorrect order →
 * 7 mixed-register (cross-binding within the batch).
 */
export const ExecutiveDecisionRegisterExecutionBatchValidationPrecedence =
  Object.freeze([
    "EXEC-EMPTY-BATCH",
    "EXEC-UNKNOWN-STEP",
    "EXEC-EVENT-ORDER",
    "EXEC-EXTRA-STEP",
    "EXEC-MISSING-STEP",
    "EXEC-EVENT-ORDER",
    "EXEC-MULTI-REGISTER",
  ] as const);

const STEP_ORDER = Object.freeze(
  Object.fromEntries(
    ExecutiveDecisionRegisterExecutionStepKinds.map((kind, index) => [
      kind,
      index + 1,
    ]),
  ) as Readonly<Record<ExecutiveDecisionRegisterExecutionStepKind, number>>,
);

const isPresent = (value: unknown): boolean =>
  value !== null && value !== undefined && value !== "";

/** Canonical token: non-empty, no leading/trailing whitespace. */
const isWellFormedToken = (value: unknown): boolean =>
  typeof value === "string"
  && value.length > 0
  && value.trim() === value;

const isCanonicalPlanIdentity = (planId: unknown): boolean =>
  isWellFormedToken(planId)
  && (planId as string).startsWith("RTC-3:6/Plan/");

/** Closed idempotency comparison classifications. */
export const ExecutiveDecisionRegisterExecutionConflictClassifications =
  Object.freeze(["Same", "Conflict", "Distinct"] as const);

const sameStringSet = (
  left: readonly string[],
  right: readonly string[],
): boolean => {
  if (left.length !== right.length) {
    return false;
  }
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return sortedLeft.every((value, index) => value === sortedRight[index]);
};

const makeStep = (
  kind: ExecutiveDecisionRegisterExecutionStepKind,
  description: string,
): ExecutiveDecisionRegisterExecutionStep =>
  Object.freeze({
    stepId: `RTC-3:7/Step/${kind}`,
    kind,
    order: STEP_ORDER[kind],
    role: ExecutiveDecisionRegisterExecutionStepRoles[kind],
    description,
    metadataOnly: true as const,
    immutable: true as const,
    executes: false as const,
  });

const canonicalSteps = (): readonly ExecutiveDecisionRegisterExecutionStep[] =>
  Object.freeze(
    ExecutiveDecisionRegisterExecutionStepKinds.map((kind) =>
      makeStep(kind, `Descriptor for required runtime behavior: ${kind}.`)
    ),
  );

const digestOf = (
  events: readonly ExecutiveDecisionRegisterProposedEventDescriptor[],
): string =>
  events
    .map((event) =>
      [
        event.eventIdDescriptor,
        event.eventType,
        event.eventVersion,
        event.registerId,
        String(event.sequenceOffset),
        event.stepKind,
        event.payloadSchemaRef,
        event.predecessorRef ?? "",
        event.successorRef ?? "",
        event.disputeRef ?? "",
      ].join(":")
    )
    .join("|");

const intentIdFor = (
  request: ExecutiveDecisionRegisterExecutionIntentRequest,
  planId: string,
  batchDigest: string,
): string =>
  [
    "RTC-3:7/Intent",
    request.requestId,
    planId,
    request.idempotencyKey ?? "",
    request.planDigest ?? "",
    batchDigest,
  ].join("/");

const rejected = (
  request: ExecutiveDecisionRegisterExecutionIntentRequest,
  reasonCode: ExecutiveDecisionRegisterExecutionRejectionCode,
  reason: string,
  enforcementPlanId: string | null = null,
): ExecutiveDecisionRegisterExecutionIntentResult =>
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

const isKnownEnforcementStepKind = (stepKind: string): boolean =>
  (ExecutiveDecisionRegisterEnforcement.stepKinds as readonly string[])
    .includes(stepKind);

/** Authorized batch steps: plan order, first occurrence only. */
const authorizedStepKindsFromPlan = (
  planSteps: readonly { readonly kind: string }[],
): readonly string[] => {
  const seen = new Set<string>();
  const authorized: string[] = [];
  for (const step of planSteps) {
    if (!seen.has(step.kind)) {
      seen.add(step.kind);
      authorized.push(step.kind);
    }
  }
  return Object.freeze(authorized);
};

const confirmationRequiredOps = Object.freeze([
  "ConfirmDecision",
  "MakeDecisionEffective",
  "ResolveDispute",
  "SupersedeDecision",
  "CloseDecision",
  "ExportDecision",
  "ApplyRetention",
  "DisposeDecision",
  "BreakGlassAccess",
]);

const aiForbiddenOps = Object.freeze([
  "ConfirmDecision",
  "MakeDecisionEffective",
  "ResolveDispute",
  "SupersedeDecision",
  "CloseDecision",
  "DiscloseDecision",
  "ExportDecision",
  "ApplyRetention",
  "DisposeDecision",
  "BreakGlassAccess",
]);

const confirmationValid = (
  request: ExecutiveDecisionRegisterExecutionIntentRequest,
  planActor: string,
  planAuthority: string,
  planTarget: string,
  policyDecisionCode: string,
  policyVersion: string,
  obligationKinds: readonly string[],
): boolean => {
  const evidence = request.confirmationEvidence;
  if (!evidence) {
    return false;
  }
  return evidence.actorKind === "Human"
    && evidence.actorId === request.actorId
    && evidence.actorId === planActor
    && evidence.requestId === request.requestId
    && evidence.policyDecisionCode === policyDecisionCode
    && evidence.policyVersion === policyVersion
    && evidence.targetId === planTarget
    && evidence.operation === request.operation
    && evidence.authorityRef === planAuthority
    && sameStringSet(evidence.evidenceSet, request.evidenceRefs)
    && sameStringSet(evidence.obligationKinds, obligationKinds)
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
export function constructExecutiveDecisionRegisterExecutionIntent(
  request: ExecutiveDecisionRegisterExecutionIntentRequest,
): ExecutiveDecisionRegisterExecutionIntentResult {
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
    ExecutiveDecisionRegisterEnforcement.identity.id
      !== "RTC-3:6/ExecutiveDecisionRegisterEnforcement"
    || !isCanonicalPlanIdentity(plan.planId)
  ) {
    return rejected(
      request,
      "EXEC-UNKNOWN-ENFORCEMENT",
      "Unrecognized enforcement aggregate identity or malformed plan identity.",
      isWellFormedToken(plan.planId) ? plan.planId : null,
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

  if (request.targetRegister !== plan.targetRegister) {
    return rejected(
      request,
      "EXEC-REGISTER-MISMATCH",
      "Target register must match the enforcement plan.",
      plan.planId,
    );
  }

  if (request.targetEntityId !== plan.targetEntityId) {
    return rejected(
      request,
      "EXEC-SUBJECT-MISMATCH",
      "Target entity must match the enforcement plan.",
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

  if (!isWellFormedToken(request.idempotencyKey)) {
    return rejected(
      request,
      "EXEC-MISSING-IDEMPOTENCY",
      "Caller-scoped idempotency key is required and must be a well-formed token.",
      plan.planId,
    );
  }

  if (!isWellFormedToken(request.planDigest)) {
    return rejected(
      request,
      "EXEC-MISSING-DIGEST",
      "Deterministic plan digest is required and must be a well-formed token.",
      plan.planId,
    );
  }

  if (!isWellFormedToken(request.obligationDigest)) {
    return rejected(
      request,
      "EXEC-MISSING-OBLIGATION-DIGEST",
      "Deterministic obligation digest is required and must be a well-formed token.",
      plan.planId,
    );
  }

  if (
    request.expectedRegisterSequence === null
    || request.expectedRegisterSequence === undefined
    || !Number.isInteger(request.expectedRegisterSequence)
    || request.expectedRegisterSequence < 0
  ) {
    return rejected(
      request,
      "EXEC-MISSING-SEQUENCE",
      "Expected register sequence is required and must be a non-negative integer.",
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

  const authorizedStepKinds = authorizedStepKindsFromPlan(plan.steps);
  const batchStepKinds = request.proposedEvents.map((event) => event.stepKind);

  // Precedence 2: unknown or malformed step kind.
  for (const stepKind of batchStepKinds) {
    if (!isWellFormedToken(stepKind) || !isKnownEnforcementStepKind(stepKind)) {
      return rejected(
        request,
        "EXEC-UNKNOWN-STEP",
        "Batch contains an unknown or malformed enforcement-plan step kind.",
        plan.planId,
      );
    }
  }

  // Precedence 3: duplicate step.
  if (new Set(batchStepKinds).size !== batchStepKinds.length) {
    return rejected(
      request,
      "EXEC-EVENT-ORDER",
      "Batch must not contain duplicate authorized steps.",
      plan.planId,
    );
  }

  // Precedence 4: unauthorized extra step (known vocabulary, not in plan).
  for (const stepKind of batchStepKinds) {
    if (!(authorizedStepKinds as readonly string[]).includes(stepKind)) {
      return rejected(
        request,
        "EXEC-EXTRA-STEP",
        "Batch contains a step not authorized by the enforcement plan.",
        plan.planId,
      );
    }
  }

  // Precedence 5: missing required plan step.
  for (const stepKind of authorizedStepKinds) {
    if (!batchStepKinds.includes(stepKind)) {
      return rejected(
        request,
        "EXEC-MISSING-STEP",
        "Batch omits one or more required enforcement-plan steps.",
        plan.planId,
      );
    }
  }

  // Precedence 6: incorrect canonical order (step kinds and sequence offsets).
  const offsets = request.proposedEvents.map((event) => event.sequenceOffset);
  const expectedOffsets = authorizedStepKinds.map((_, index) => index);
  if (
    batchStepKinds.join(",") !== authorizedStepKinds.join(",")
    || offsets.join(",") !== expectedOffsets.join(",")
  ) {
    return rejected(
      request,
      "EXEC-EVENT-ORDER",
      "Batch steps must follow the authorized enforcement-plan order.",
      plan.planId,
    );
  }

  // Precedence 7: mixed-register cross-binding within the batch.
  const registers = new Set(
    request.proposedEvents.map((event) => event.registerId),
  );
  if (registers.size !== 1 || !registers.has(request.targetRegister)) {
    return rejected(
      request,
      "EXEC-MULTI-REGISTER",
      "Event batch must bind to exactly one target register.",
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
    request.operation === "SupersedeDecision"
    && request.proposedEvents.some(
      (event) =>
        !isPresent(event.predecessorRef) || !isPresent(event.successorRef),
    )
  ) {
    return rejected(
      request,
      "EXEC-SUPERSESSION",
      "Supersession must preserve predecessor and successor references.",
      plan.planId,
    );
  }

  if (
    (
      request.operation === "ResolveDispute"
      || request.operation === "OpenDispute"
    )
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
    request.operation === "DisposeDecision"
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

  if (
    request.privacyCategory === "PrivateReflection"
    || request.proposedEvents.some(
      (event) => event.privacyCategory === "PrivateReflection",
    )
  ) {
    return rejected(
      request,
      "EXEC-PRIVATE",
      "Private reflection cannot enter shared execution paths.",
      plan.planId,
    );
  }

  if (
    (
      request.privacyCategory === "RestrictedExecutiveRecord"
      || request.privacyCategory === "RegulatedOrPrivilegedRecord"
      || request.privacyCategory === "RegulatedPrivileged"
    )
    && !isPresent(request.classification)
  ) {
    return rejected(
      request,
      "EXEC-CLASSIFICATION",
      "Restricted or privileged execution requires classification.",
      plan.planId,
    );
  }

  if (request.executionAuthorizationExpired) {
    return rejected(
      request,
      "EXEC-AUTHORIZATION-EXPIRED",
      "Expired execution authorization is rejected.",
      plan.planId,
    );
  }

  const obligationKinds = enforcement.obligations;
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
        obligationKinds,
      )
    ) {
      return rejected(
        request,
        "EXEC-CONFIRMATION-MISMATCH",
        "Confirmation evidence does not bind exactly to actor, request, target, obligations, or policy version.",
        plan.planId,
      );
    }
  }

  const events = Object.freeze(
    request.proposedEvents.map((event) => Object.freeze({ ...event })),
  );
  const eventBatchDigest = digestOf(events);
  const steps = canonicalSteps();
  const intent: ExecutiveDecisionRegisterExecutionIntent = Object.freeze({
    intentId: intentIdFor(request, plan.planId, eventBatchDigest),
    enforcementPlanId: plan.planId,
    enforcementPlan: plan,
    policyDecisionCode: plan.policyDecisionCode,
    policyVersion: plan.policyVersion,
    validationOutcome: "Valid" as const,
    requestId: request.requestId,
    targetRegister: request.targetRegister,
    targetEntityId: request.targetEntityId,
    actorId: request.actorId,
    authorityRef: request.authorityRef as string,
    purpose: request.purpose,
    operation: request.operation,
    expectedRegisterSequence: request.expectedRegisterSequence as number,
    idempotencyKey: request.idempotencyKey as string,
    planDigest: request.planDigest as string,
    obligationDigest: request.obligationDigest as string,
    eventBatch: events,
    eventBatchDigest,
    evidenceRefs: Object.freeze([...request.evidenceRefs]),
    privacyCategory: request.privacyCategory,
    classification: request.classification,
    currentLifecycleState: request.currentLifecycleState,
    proposedLifecycleState: request.proposedLifecycleState,
    steps,
    summary: [
      ExecutiveDecisionRegisterExecutionId,
      ExecutiveDecisionRegisterExecutionVersion,
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
    persists: false as const,
    dispatches: false as const,
    publishes: false as const,
    createsAuthority: false as const,
    confirmsDecisions: false as const,
    mutatesDomainState: false as const,
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
export function compareExecutiveDecisionRegisterIdempotency(
  left: ExecutiveDecisionRegisterExecutionIntent,
  right: ExecutiveDecisionRegisterExecutionIntent,
): "Same" | "Conflict" | "Distinct" {
  if (left.idempotencyKey !== right.idempotencyKey) {
    return "Distinct";
  }
  if (
    left.planDigest === right.planDigest
    && left.eventBatchDigest === right.eventBatchDigest
    && left.targetRegister === right.targetRegister
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
const receiptBindings = (
  intent: ExecutiveDecisionRegisterExecutionIntent,
  outcome: ExecutiveDecisionRegisterExecutionOutcomeEvidence,
  receiptId: string,
  summary: string,
) =>
  Object.freeze({
    receiptId,
    intentId: intent.intentId,
    enforcementPlanId: intent.enforcementPlanId,
    policyDecisionCode: intent.policyDecisionCode,
    requestId: intent.requestId,
    authorityRef: intent.authorityRef,
    idempotencyKey: intent.idempotencyKey,
    planDigest: intent.planDigest,
    targetRegister: intent.targetRegister,
    eventBatchDigest: intent.eventBatchDigest,
    expectedRegisterSequence: intent.expectedRegisterSequence,
    outcomeEvidenceId: outcome.outcomeEvidenceId,
    outcomeEvidenceDigest: outcome.outcomeEvidenceDigest,
    summary,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
    createsAuthority: false as const,
    confirmsDecisions: false as const,
    mutatesDomainState: false as const,
  });

const hasConflictEvidence = (
  outcome: ExecutiveDecisionRegisterExecutionOutcomeEvidence,
): boolean =>
  isWellFormedToken(outcome.conflictCode)
  || outcome.idempotencyConflict === true
  || (
    outcome.expectedSequence !== null
    && outcome.observedSequence !== null
    && outcome.expectedSequence !== outcome.observedSequence
  )
  || isWellFormedToken(outcome.priorPlanDigest);

const hasDefinitiveFailureEvidence = (
  outcome: ExecutiveDecisionRegisterExecutionOutcomeEvidence,
): boolean =>
  isWellFormedToken(outcome.failureCode)
  && outcome.provesNoAcceptedEffect === true;

export function createExecutiveDecisionRegisterExecutionReceipt(
  intent: ExecutiveDecisionRegisterExecutionIntent,
  outcome: ExecutiveDecisionRegisterExecutionOutcomeEvidence,
): ExecutiveDecisionRegisterExecutionReceipt {
  const receiptId = [
    "RTC-3:7/Receipt",
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
      ...receiptBindings(
        intent,
        outcome,
        receiptId,
        "Unknown outcome kind fails closed.",
      ),
      kind: "Failed" as const,
      failureCode: "EXEC-UNKNOWN-OUTCOME",
      provesNoAcceptedEffect: true as const,
    });
  }

  if (
    outcome.uncertain
    || outcome.partialCommit
    || outcome.timedOut
    || outcome.submissionAcknowledgementOnly
    || (
      outcome.outcomeKind === "Committed"
      && (
        !isWellFormedToken(outcome.outcomeEvidenceId)
        || !isWellFormedToken(outcome.outcomeEvidenceDigest)
        || !isWellFormedToken(outcome.durableCommitEvidence)
        || outcome.acceptedEventRefs.length === 0
        || !isWellFormedToken(outcome.allocatedSequence)
        || !isWellFormedToken(outcome.integrityEvidenceRef)
        || !isWellFormedToken(outcome.idempotencyRecordRef)
        || !isWellFormedToken(outcome.atomicBoundaryEvidence)
      )
    )
    || (
      outcome.outcomeKind === "Conflict"
      && !hasConflictEvidence(outcome)
    )
    || (
      outcome.outcomeKind === "Failed"
      && !hasDefinitiveFailureEvidence(outcome)
    )
  ) {
    return Object.freeze({
      ...receiptBindings(
        intent,
        outcome,
        receiptId,
        "Missing, partial, contradictory, timed-out, acknowledgement-only, or incomplete evidence produces Indeterminate.",
      ),
      kind: "Indeterminate" as const,
      recoveryInstructionCode:
        outcome.recoveryInstructionCode ?? "RETRY-SAME-KEY-AND-DIGEST",
    });
  }

  if (outcome.outcomeKind === "Conflict") {
    return Object.freeze({
      ...receiptBindings(
        intent,
        outcome,
        receiptId,
        "Explicit concurrency or idempotency conflict evidence recorded.",
      ),
      kind: "Conflict" as const,
      conflictCode: outcome.conflictCode ?? "EXEC-CONFLICT",
      expectedSequence: outcome.expectedSequence,
      observedSequence: outcome.observedSequence,
      priorPlanDigest: outcome.priorPlanDigest,
    });
  }

  if (outcome.outcomeKind === "Failed") {
    return Object.freeze({
      ...receiptBindings(
        intent,
        outcome,
        receiptId,
        "Explicit failure or rollback evidence recorded.",
      ),
      kind: "Failed" as const,
      failureCode: outcome.failureCode as string,
      provesNoAcceptedEffect: true as const,
    });
  }

  if (outcome.outcomeKind === "Indeterminate") {
    return Object.freeze({
      ...receiptBindings(
        intent,
        outcome,
        receiptId,
        "Explicit indeterminate outcome evidence recorded.",
      ),
      kind: "Indeterminate" as const,
      recoveryInstructionCode:
        outcome.recoveryInstructionCode ?? "RETRY-SAME-KEY-AND-DIGEST",
    });
  }

  return Object.freeze({
    ...receiptBindings(
      intent,
      outcome,
      receiptId,
      "Explicit durable commit evidence recorded.",
    ),
    kind: "Committed" as const,
    allocatedSequence: outcome.allocatedSequence as string,
    acceptedEventRefs: Object.freeze([...outcome.acceptedEventRefs]),
    integrityEvidenceRef: outcome.integrityEvidenceRef as string,
    idempotencyRecordRef: outcome.idempotencyRecordRef as string,
    atomicBoundaryEvidence: outcome.atomicBoundaryEvidence as string,
  });
}

export function isExecutiveDecisionRegisterExecutionRejected(
  result: ExecutiveDecisionRegisterExecutionIntentResult,
): boolean {
  return result.kind === "Rejected";
}

export function isExecutiveDecisionRegisterExecutionExecutable(
  result: ExecutiveDecisionRegisterExecutionIntentResult,
): boolean {
  return result.kind === "Executable";
}
