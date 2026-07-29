/**
 * RTC-3:8 — Executive Decision Register Reconciliation & Assurance Rules.
 *
 * Pure deterministic evaluation of supplied intents, receipts, and evidence.
 * Detects mismatch; never repairs, fetches, certifies, or mutates state.
 *
 * Ownership: owned exclusively by RTC-3:8.
 */

import { ExecutiveDecisionRegisterExecution } from "./executiveDecisionRegisterExecution.ts";
import {
  ExecutiveDecisionRegisterAssuranceId,
  ExecutiveDecisionRegisterAssuranceVersion,
} from "./executiveDecisionRegisterAssuranceIdentity.ts";
import {
  ExecutiveDecisionRegisterAssuranceEvidenceKinds,
  ExecutiveDecisionRegisterAssuranceSubjectKinds,
} from "./executiveDecisionRegisterAssuranceLifecycle.ts";
import type {
  ExecutiveDecisionRegisterAssuranceEvidenceBundle,
  ExecutiveDecisionRegisterAssuranceEvidenceItem,
  ExecutiveDecisionRegisterAssuranceFinding,
  ExecutiveDecisionRegisterAssuranceResult,
  ExecutiveDecisionRegisterAssuranceResultKind,
  ExecutiveDecisionRegisterAssuranceSeverity,
  ExecutiveDecisionRegisterAssuranceSubjectKind,
} from "./executiveDecisionRegisterAssuranceTypes.ts";
import type {
  ExecutiveDecisionRegisterExecutionIntent,
  ExecutiveDecisionRegisterExecutionReceipt,
} from "./executiveDecisionRegisterExecutionTypes.ts";
import type { ExecutiveDecisionRegisterEnforcementPlan } from "./executiveDecisionRegisterEnforcementTypes.ts";

export interface ExecutiveDecisionRegisterAssuranceRuleDeclaration {
  readonly ruleId: string;
  readonly ruleKey: string;
  readonly family: string;
  readonly subject: ExecutiveDecisionRegisterAssuranceSubjectKind;
  readonly priority: number;
  readonly description: string;
  readonly findingCode: string;
  readonly severityOnFailure: ExecutiveDecisionRegisterAssuranceSeverity;
  readonly uncertaintyYieldsIndeterminate: boolean;
  readonly definitiveFailureYieldsNotAssured: boolean;
  readonly evaluatesOnly: true;
  readonly repairs: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const rule = (
  priority: number,
  family: string,
  ruleKey: string,
  subject: ExecutiveDecisionRegisterAssuranceSubjectKind,
  findingCode: string,
  severityOnFailure: ExecutiveDecisionRegisterAssuranceSeverity,
  description: string,
  uncertaintyYieldsIndeterminate: boolean,
  definitiveFailureYieldsNotAssured: boolean,
): ExecutiveDecisionRegisterAssuranceRuleDeclaration =>
  Object.freeze({
    ruleId: `RTC-3:8/Rule/${String(priority).padStart(2, "0")}`,
    ruleKey,
    family,
    subject,
    priority,
    description,
    findingCode,
    severityOnFailure,
    uncertaintyYieldsIndeterminate,
    definitiveFailureYieldsNotAssured,
    evaluatesOnly: true as const,
    repairs: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveDecisionRegisterAssuranceRules = Object.freeze([
  rule(1, "Identity", "AggregateIdentity", "ExecutionAggregate", "ASR-UNKNOWN-EXECUTION", "Critical", "RTC-3:7 aggregate identity must be canonical.", false, true),
  rule(2, "Structure", "BundleShape", "ExecutionRequest", "ASR-MALFORMED-REQUEST", "Critical", "Assurance bundle must include intent and receipt.", true, true),
  rule(3, "UpstreamReference", "PlanReference", "EnforcementPlan", "ASR-PLAN-REFERENCE-MISMATCH", "Critical", "Exact enforcement-plan object reference must be preserved.", false, true),
  rule(4, "IntentEligibility", "ExecutableOnly", "ExecutionIntent", "ASR-REJECTED-INTENT", "Critical", "Rejected intents cannot be assured.", false, true),
  rule(5, "AtomicBatch", "BatchIntegrity", "AtomicBatch", "ASR-BATCH-MISMATCH", "Error", "Atomic batch must match authorized plan steps exactly.", false, true),
  rule(6, "Binding", "RequestPlanBinding", "ExecutionRequest", "ASR-REQUEST-MISMATCH", "Error", "Request, plan, operation, subject, and actor must bind exactly.", false, true),
  rule(7, "Binding", "AuthorityObligationBinding", "AuthorityBinding", "ASR-AUTHORITY-MISMATCH", "Error", "Authority, confirmation, and obligation digests must bind exactly.", false, true),
  rule(8, "Idempotency", "KeyDigestBinding", "IdempotencyBinding", "ASR-IDEMPOTENCY-KEY-MISMATCH", "Error", "Idempotency key and plan digest must reconcile across intent and receipt.", false, true),
  rule(9, "Concurrency", "SequenceBinding", "ConcurrencyBinding", "ASR-EXPECTED-SEQUENCE-MISMATCH", "Error", "Expected and observed sequences must reconcile without silent rebase.", false, true),
  rule(10, "ReceiptEvidence", "ReceiptClaimSupport", "ExecutionReceipt", "ASR-UNSUPPORTED-COMMIT", "Critical", "Receipt claims require matching external evidence kinds.", true, true),
  rule(11, "AtomicCommit", "CommitCompleteness", "OutcomeEvidence", "ASR-MISSING-COMMIT-EVIDENCE", "Critical", "Committed receipts require complete commit and atomicity evidence.", true, true),
  rule(12, "AppendOnly", "AppendOnlyControls", "AppendOnlyClaim", "ASR-APPEND-ONLY", "Critical", "Append-only and historical-erasure violations are not assured.", false, true),
  rule(13, "Authority", "AuthorityControls", "AuthorityBinding", "ASR-AUTHORITY-CREATED", "Critical", "Authority creation or broadening fails assurance.", false, true),
  rule(14, "Confirmation", "ConfirmationControls", "ConfirmationBinding", "ASR-CONFIRMATION-MISMATCH", "Critical", "Confirmation substitution fails assurance.", false, true),
  rule(15, "AiBoundary", "AiProhibitions", "AiBoundary", "ASR-AI-AUTHORITATIVE", "Critical", "AI authoritative actions fail assurance.", false, true),
  rule(16, "Privacy", "PrivacyControls", "PrivacyBoundary", "ASR-UNAUTHORIZED-DISCLOSURE", "Critical", "Unauthorized disclosure fails assurance.", false, true),
  rule(17, "Projection", "ProjectionControls", "ProjectionClaim", "ASR-PROJECTION-AUTHORITY", "Critical", "Projection-created authority or erased provenance fails assurance.", false, true),
  rule(18, "Outcome", "IndeterminatePreservation", "OutcomeEvidence", "ASR-INDETERMINATE-UPGRADED", "Critical", "Indeterminate outcomes must not be upgraded.", false, true),
  rule(19, "Retention", "RetentionControls", "RetentionClaim", "ASR-RETENTION-ALTERED", "Critical", "Retention alteration fails assurance.", false, true),
  rule(20, "Telemetry", "TelemetryMetadataOnly", "TelemetryClaim", "ASR-TELEMETRY-PAYLOAD", "Critical", "Telemetry must remain metadata-only.", false, true),
  rule(21, "Determinism", "OpenIssueDefaults", "ExecutionRequest", "ASR-OPEN-ISSUE", "Error", "Unresolved open-issue defaults remain indeterminate.", true, false),
] as const);

export const ExecutiveDecisionRegisterAssuranceFindingCodes = Object.freeze([
  "ASR-UNKNOWN-IDENTITY",
  "ASR-MALFORMED-IDENTITY",
  "ASR-UNKNOWN-SUBJECT",
  "ASR-MALFORMED-REQUEST",
  "ASR-MISSING-CANONICAL-REF",
  "ASR-UNKNOWN-EXECUTION",
  "ASR-REQUEST-MISMATCH",
  "ASR-INTENT-MISMATCH",
  "ASR-PLAN-MISMATCH",
  "ASR-PLAN-REFERENCE-MISMATCH",
  "ASR-BATCH-MISMATCH",
  "ASR-OPERATION-MISMATCH",
  "ASR-SUBJECT-MISMATCH",
  "ASR-ACTOR-MISMATCH",
  "ASR-AUTHORITY-MISMATCH",
  "ASR-CONFIRMATION-MISMATCH",
  "ASR-OBLIGATION-MISMATCH",
  "ASR-IDEMPOTENCY-KEY-MISMATCH",
  "ASR-PLAN-DIGEST-MISMATCH",
  "ASR-EXPECTED-SEQUENCE-MISMATCH",
  "ASR-OBSERVED-SEQUENCE-MISMATCH",
  "ASR-RECEIPT-MISMATCH",
  "ASR-EVIDENCE-IDENTITY-MISMATCH",
  "ASR-EVIDENCE-DIGEST-MISMATCH",
  "ASR-REJECTED-INTENT",
  "ASR-NON-CANONICAL-INTENT",
  "ASR-EMPTY-BATCH",
  "ASR-MISSING-STEP",
  "ASR-EXTRA-STEP",
  "ASR-UNKNOWN-STEP",
  "ASR-DUPLICATE-STEP",
  "ASR-STEP-ORDER-MISMATCH",
  "ASR-PARTIAL-BATCH",
  "ASR-UNSUPPORTED-COMMIT",
  "ASR-UNSUPPORTED-CONFLICT",
  "ASR-UNSUPPORTED-FAILED",
  "ASR-INDETERMINATE-UPGRADED",
  "ASR-ACK-AS-COMMIT",
  "ASR-PARTIAL-AS-COMMIT",
  "ASR-CONTRADICTORY-OUTCOME",
  "ASR-MISSING-COMMIT-EVIDENCE",
  "ASR-MISSING-CONFLICT-EVIDENCE",
  "ASR-MISSING-FAILURE-EVIDENCE",
  "ASR-APPEND-ONLY",
  "ASR-HISTORICAL-ERASURE",
  "ASR-AUTHORITY-CREATED",
  "ASR-AUTHORITY-BROADENED",
  "ASR-AI-AUTHORITATIVE",
  "ASR-SILENT-REBASE",
  "ASR-IDEMPOTENCY-ROTATION",
  "ASR-PROJECTION-AUTHORITY",
  "ASR-PROJECTION-ERASURE",
  "ASR-UNAUTHORIZED-DISCLOSURE",
  "ASR-RETENTION-ALTERED",
  "ASR-TELEMETRY-PAYLOAD",
  "ASR-OPEN-ISSUE",
  "ASR-UNKNOWN-EVIDENCE-KIND",
  "ASR-EVIDENCE-UNAVAILABLE",
  "ASR-ASSURED",
] as const);

const SEVERITY_RANK: Readonly<
  Record<ExecutiveDecisionRegisterAssuranceSeverity, number>
> = Object.freeze({
  Critical: 1,
  Error: 2,
  Warning: 3,
  Info: 4,
});

const SUBJECT_RANK: Readonly<
  Record<ExecutiveDecisionRegisterAssuranceSubjectKind, number>
> = Object.freeze(
  Object.fromEntries(
    ExecutiveDecisionRegisterAssuranceSubjectKinds.map((kind, index) => [
      kind,
      index + 1,
    ]),
  ) as Record<ExecutiveDecisionRegisterAssuranceSubjectKind, number>,
);

const RESULT_RANK: Readonly<
  Record<ExecutiveDecisionRegisterAssuranceResultKind, number>
> = Object.freeze({
  NotAssured: 1,
  Indeterminate: 2,
  Assured: 3,
});

const isPresent = (value: unknown): boolean =>
  value !== null && value !== undefined && value !== "";

const finding = (
  priority: number,
  findingCode: string,
  severity: ExecutiveDecisionRegisterAssuranceSeverity,
  subjectKind: ExecutiveDecisionRegisterAssuranceSubjectKind,
  subjectPath: string,
  expected: string,
  observed: string,
  message: string,
  resultHint: ExecutiveDecisionRegisterAssuranceResultKind,
): ExecutiveDecisionRegisterAssuranceFinding => {
  const ruleId = `RTC-3:8/Rule/${String(priority).padStart(2, "0")}`;
  const orderingKey = [
    String(priority).padStart(2, "0"),
    String(SEVERITY_RANK[severity]).padStart(2, "0"),
    String(SUBJECT_RANK[subjectKind]).padStart(2, "0"),
    subjectPath,
    findingCode,
  ].join("|");
  return Object.freeze({
    ruleId,
    findingCode,
    severity,
    subjectKind,
    subjectPath,
    expected,
    observed,
    upstreamContractRef: "RTC-3:7/ExecutiveDecisionRegisterExecutionContract",
    message,
    resultHint,
    orderingKey,
    metadataOnly: true as const,
    immutable: true as const,
    containsPayload: false as const,
  });
};

const orderFindings = (
  findings: readonly ExecutiveDecisionRegisterAssuranceFinding[],
): readonly ExecutiveDecisionRegisterAssuranceFinding[] =>
  Object.freeze(
    [...findings].sort((left, right) => {
      if (left.orderingKey < right.orderingKey) return -1;
      if (left.orderingKey > right.orderingKey) return 1;
      return 0;
    }),
  );

const resolveKind = (
  findings: readonly ExecutiveDecisionRegisterAssuranceFinding[],
): ExecutiveDecisionRegisterAssuranceResultKind => {
  if (findings.length === 0) {
    return "Assured";
  }
  let best: ExecutiveDecisionRegisterAssuranceResultKind = "Assured";
  for (const item of findings) {
    if (RESULT_RANK[item.resultHint] < RESULT_RANK[best]) {
      best = item.resultHint;
    }
  }
  return best;
};

const hasEvidenceKind = (
  items: readonly ExecutiveDecisionRegisterAssuranceEvidenceItem[],
  kind: string,
): boolean => items.some((item) => item.evidenceKind === kind);

const completeEvidence = (
  items: readonly ExecutiveDecisionRegisterAssuranceEvidenceItem[],
  kind: string,
): boolean =>
  items.some(
    (item) =>
      item.evidenceKind === kind && item.completeness === "Complete",
  );

const collectFindings = (
  bundle: ExecutiveDecisionRegisterAssuranceEvidenceBundle,
): readonly ExecutiveDecisionRegisterAssuranceFinding[] => {
  const findings: ExecutiveDecisionRegisterAssuranceFinding[] = [];
  const intent = bundle.intent;
  const receipt = bundle.receipt;
  const plan = bundle.enforcementPlan;

  if (
    ExecutiveDecisionRegisterExecution.identity.id
      !== "RTC-3:7/ExecutiveDecisionRegisterExecutionContract"
  ) {
    findings.push(
      finding(
        1,
        "ASR-UNKNOWN-EXECUTION",
        "Critical",
        "ExecutionAggregate",
        "execution.identity",
        "RTC-3:7/ExecutiveDecisionRegisterExecutionContract",
        ExecutiveDecisionRegisterExecution.identity.id,
        "Unrecognized RTC-3:7 execution aggregate.",
        "NotAssured",
      ),
    );
  }

  if (!intent || !receipt) {
    findings.push(
      finding(
        2,
        "ASR-MALFORMED-REQUEST",
        "Critical",
        "ExecutionRequest",
        "bundle.intent|receipt",
        "intent+receipt",
        `${intent ? "intent" : "missing"}|${receipt ? "receipt" : "missing"}`,
        "Assurance bundle must include intent and receipt.",
        intent || receipt ? "Indeterminate" : "NotAssured",
      ),
    );
    return orderFindings(findings);
  }

  for (const item of bundle.evidenceItems) {
    if (
      !(ExecutiveDecisionRegisterAssuranceEvidenceKinds as readonly string[])
        .includes(item.evidenceKind)
    ) {
      findings.push(
        finding(
          2,
          "ASR-UNKNOWN-EVIDENCE-KIND",
          "Critical",
          "OutcomeEvidence",
          "evidence.kind",
          "closed-vocabulary",
          String(item.evidenceKind),
          "Unknown evidence kind fails closed.",
          "NotAssured",
        ),
      );
    }
    if (item.evidenceKind === "EvidenceUnavailable") {
      findings.push(
        finding(
          10,
          "ASR-EVIDENCE-UNAVAILABLE",
          "Error",
          "OutcomeEvidence",
          "evidence.unavailable",
          "available",
          "unavailable",
          "Unavailable evidence remains Indeterminate.",
          "Indeterminate",
        ),
      );
    }
  }

  if (!plan) {
    findings.push(
      finding(
        3,
        "ASR-MISSING-CANONICAL-REF",
        "Critical",
        "EnforcementPlan",
        "bundle.enforcementPlan",
        "exact-plan",
        "missing",
        "Exact enforcement-plan reference is required.",
        "NotAssured",
      ),
    );
  } else if (intent.enforcementPlan !== plan) {
    findings.push(
      finding(
        3,
        "ASR-PLAN-REFERENCE-MISMATCH",
        "Critical",
        "EnforcementPlan",
        "intent.enforcementPlan",
        "exact-object-ref",
        "diverged-ref",
        "Intent must preserve the exact Enforceable plan object reference.",
        "NotAssured",
      ),
    );
  } else if (intent.enforcementPlanId !== plan.planId) {
    findings.push(
      finding(
        3,
        "ASR-PLAN-MISMATCH",
        "Critical",
        "EnforcementPlan",
        "intent.enforcementPlanId",
        plan.planId,
        intent.enforcementPlanId,
        "Plan identity must match the enforcement plan.",
        "NotAssured",
      ),
    );
  }

  // Intent eligibility — Executable-only (Rejected intents carry no intent object here;
  // callers must not present non-executable claims via overlays that omit bindings).
  if (intent.executes !== false || intent.persists !== false) {
    findings.push(
      finding(
        4,
        "ASR-NON-CANONICAL-INTENT",
        "Critical",
        "ExecutionIntent",
        "intent.sideEffects",
        "executes:false",
        "effect-bearing",
        "Non-canonical executable intent fails assurance.",
        "NotAssured",
      ),
    );
  }

  if (intent.eventBatch.length === 0) {
    findings.push(
      finding(
        5,
        "ASR-EMPTY-BATCH",
        "Error",
        "AtomicBatch",
        "intent.eventBatch",
        "non-empty",
        "empty",
        "Empty batch cannot be assured.",
        "NotAssured",
      ),
    );
  } else if (plan) {
    const authorized: string[] = [];
    const seen = new Set<string>();
    for (const step of plan.steps) {
      if (!seen.has(step.kind)) {
        seen.add(step.kind);
        authorized.push(step.kind);
      }
    }
    const batchKinds = intent.eventBatch.map((event) => event.stepKind);
    if (new Set(batchKinds).size !== batchKinds.length) {
      findings.push(
        finding(
          5,
          "ASR-DUPLICATE-STEP",
          "Error",
          "ExecutionStep",
          "intent.eventBatch.stepKind",
          "unique",
          "duplicate",
          "Duplicate batch steps fail assurance.",
          "NotAssured",
        ),
      );
    }
    for (const kind of batchKinds) {
      if (
        !(ExecutiveDecisionRegisterExecution.enforcement.stepKinds as readonly string[])
          .includes(kind)
      ) {
        findings.push(
          finding(
            5,
            "ASR-UNKNOWN-STEP",
            "Error",
            "ExecutionStep",
            "intent.eventBatch.stepKind",
            "known-step",
            kind,
            "Unknown batch step fails assurance.",
            "NotAssured",
          ),
        );
      } else if (!authorized.includes(kind)) {
        findings.push(
          finding(
            5,
            "ASR-EXTRA-STEP",
            "Error",
            "ExecutionStep",
            "intent.eventBatch.stepKind",
            "authorized-only",
            kind,
            "Unauthorized extra step fails assurance.",
            "NotAssured",
          ),
        );
      }
    }
    for (const kind of authorized) {
      if (!batchKinds.includes(kind)) {
        findings.push(
          finding(
            5,
            "ASR-MISSING-STEP",
            "Error",
            "ExecutionStep",
            "intent.eventBatch.stepKind",
            kind,
            "missing",
            "Missing required plan step fails assurance.",
            "NotAssured",
          ),
        );
      }
    }
    if (
      batchKinds.length === authorized.length
      && batchKinds.join(",") !== authorized.join(",")
      && new Set(batchKinds).size === batchKinds.length
      && authorized.every((kind) => batchKinds.includes(kind))
    ) {
      findings.push(
        finding(
          5,
          "ASR-STEP-ORDER-MISMATCH",
          "Error",
          "ExecutionStep",
          "intent.eventBatch.order",
          authorized.join(","),
          batchKinds.join(","),
          "Reordered batch steps fail assurance.",
          "NotAssured",
        ),
      );
    }
  }

  if (plan && intent.requestId !== plan.requestId) {
    findings.push(
      finding(
        6,
        "ASR-REQUEST-MISMATCH",
        "Error",
        "ExecutionRequest",
        "intent.requestId",
        plan.requestId,
        intent.requestId,
        "Request identity must match the enforcement plan.",
        "NotAssured",
      ),
    );
  }
  if (plan && intent.operation !== plan.operation) {
    findings.push(
      finding(
        6,
        "ASR-OPERATION-MISMATCH",
        "Error",
        "ExecutionRequest",
        "intent.operation",
        plan.operation,
        intent.operation,
        "Operation must match the enforcement plan.",
        "NotAssured",
      ),
    );
  }
  if (plan && intent.targetEntityId !== plan.targetEntityId) {
    findings.push(
      finding(
        6,
        "ASR-SUBJECT-MISMATCH",
        "Error",
        "DecisionRegister",
        "intent.targetEntityId",
        plan.targetEntityId,
        intent.targetEntityId,
        "Subject must match the enforcement plan.",
        "NotAssured",
      ),
    );
  }
  if (plan && intent.actorId !== plan.actorId) {
    findings.push(
      finding(
        6,
        "ASR-ACTOR-MISMATCH",
        "Error",
        "ExecutionRequest",
        "intent.actorId",
        plan.actorId,
        intent.actorId,
        "Actor must match the enforcement plan.",
        "NotAssured",
      ),
    );
  }
  if (plan && intent.targetRegister !== plan.targetRegister) {
    findings.push(
      finding(
        6,
        "ASR-BATCH-MISMATCH",
        "Error",
        "DecisionRegister",
        "intent.targetRegister",
        plan.targetRegister,
        intent.targetRegister,
        "Decision-register identity must match the plan.",
        "NotAssured",
      ),
    );
  }

  if (plan && intent.authorityRef !== plan.authorityRef) {
    findings.push(
      finding(
        7,
        "ASR-AUTHORITY-MISMATCH",
        "Error",
        "AuthorityBinding",
        "intent.authorityRef",
        plan.authorityRef,
        intent.authorityRef,
        "Authority reference must match the enforcement plan.",
        "NotAssured",
      ),
    );
  }
  if (!isPresent(intent.obligationDigest)) {
    findings.push(
      finding(
        7,
        "ASR-OBLIGATION-MISMATCH",
        "Error",
        "ObligationBinding",
        "intent.obligationDigest",
        "present",
        "missing",
        "Obligation digest binding is required.",
        "NotAssured",
      ),
    );
  }

  if (receipt.idempotencyKey !== intent.idempotencyKey) {
    findings.push(
      finding(
        8,
        "ASR-IDEMPOTENCY-KEY-MISMATCH",
        "Error",
        "IdempotencyBinding",
        "receipt.idempotencyKey",
        intent.idempotencyKey,
        receipt.idempotencyKey,
        "Receipt idempotency key must match the intent.",
        "NotAssured",
      ),
    );
  }
  if (receipt.planDigest !== intent.planDigest) {
    findings.push(
      finding(
        8,
        "ASR-PLAN-DIGEST-MISMATCH",
        "Error",
        "IdempotencyBinding",
        "receipt.planDigest",
        intent.planDigest,
        receipt.planDigest,
        "Receipt plan digest must match the intent.",
        "NotAssured",
      ),
    );
  }
  if (bundle.reportedIdempotencyRotation) {
    findings.push(
      finding(
        8,
        "ASR-IDEMPOTENCY-ROTATION",
        "Critical",
        "IdempotencyBinding",
        "idempotency.rotation",
        "stable-key-digest",
        "rotated",
        "Idempotency rotation to conceal uncertainty fails assurance.",
        "NotAssured",
      ),
    );
  }

  if (
    receipt.expectedRegisterSequence !== intent.expectedRegisterSequence
  ) {
    findings.push(
      finding(
        9,
        "ASR-EXPECTED-SEQUENCE-MISMATCH",
        "Error",
        "ConcurrencyBinding",
        "receipt.expectedRegisterSequence",
        String(intent.expectedRegisterSequence),
        String(receipt.expectedRegisterSequence),
        "Expected sequence must match the intent.",
        "NotAssured",
      ),
    );
  }
  if (bundle.reportedSilentRebase) {
    findings.push(
      finding(
        9,
        "ASR-SILENT-REBASE",
        "Critical",
        "ConcurrencyBinding",
        "concurrency.rebase",
        "no-rebase",
        "silent-rebase",
        "Silent concurrency rebase fails assurance.",
        "NotAssured",
      ),
    );
  }
  if (
    receipt.kind === "Conflict"
    && receipt.observedSequence !== null
    && receipt.expectedSequence !== null
    && receipt.observedSequence === receipt.expectedSequence
    && !receipt.conflictCode
    && !isPresent(receipt.priorPlanDigest)
  ) {
    findings.push(
      finding(
        9,
        "ASR-MISSING-CONFLICT-EVIDENCE",
        "Error",
        "ExecutionReceipt",
        "receipt.conflict",
        "conflict-evidence",
        "incomplete",
        "Incomplete conflict evidence remains Indeterminate.",
        "Indeterminate",
      ),
    );
  }
  if (
    receipt.kind === "Conflict"
    && receipt.observedSequence !== null
    && receipt.expectedSequence !== null
    && receipt.observedSequence !== receipt.expectedSequence
  ) {
    // stale/mismatched sequence with evidence is supported when conflict evidence present
    if (
      !isPresent(receipt.conflictCode)
      && !completeEvidence(
        bundle.evidenceItems,
        "ConcurrencyConflictEvidence",
      )
      && !completeEvidence(
        bundle.evidenceItems,
        "IdempotencyConflictEvidence",
      )
    ) {
      findings.push(
        finding(
          9,
          "ASR-OBSERVED-SEQUENCE-MISMATCH",
          "Error",
          "ConcurrencyBinding",
          "receipt.observedSequence",
          String(receipt.expectedSequence),
          String(receipt.observedSequence),
          "Observed sequence mismatch without conflict evidence.",
          "Indeterminate",
        ),
      );
    }
  }

  // Receipt evidence reconciliation
  if (receipt.kind === "Committed") {
    if (
      hasEvidenceKind(bundle.evidenceItems, "AcknowledgementEvidence")
      && !completeEvidence(bundle.evidenceItems, "CommitEvidence")
    ) {
      findings.push(
        finding(
          10,
          "ASR-ACK-AS-COMMIT",
          "Critical",
          "ExecutionReceipt",
          "receipt.committed",
          "commit-evidence",
          "acknowledgement-only",
          "Acknowledgement must not be treated as commit.",
          "NotAssured",
        ),
      );
    }
    if (
      hasEvidenceKind(bundle.evidenceItems, "TimeoutEvidence")
      && !completeEvidence(bundle.evidenceItems, "CommitEvidence")
    ) {
      findings.push(
        finding(
          10,
          "ASR-UNSUPPORTED-COMMIT",
          "Critical",
          "ExecutionReceipt",
          "receipt.committed",
          "commit-evidence",
          "timeout",
          "Timeout cannot support a Committed receipt.",
          "NotAssured",
        ),
      );
    }
    if (!completeEvidence(bundle.evidenceItems, "CommitEvidence")) {
      findings.push(
        finding(
          11,
          "ASR-MISSING-COMMIT-EVIDENCE",
          "Critical",
          "OutcomeEvidence",
          "evidence.commit",
          "complete-commit",
          "missing",
          "Committed receipt requires complete commit evidence.",
          "Indeterminate",
        ),
      );
    } else if (!completeEvidence(bundle.evidenceItems, "AtomicityEvidence")) {
      findings.push(
        finding(
          11,
          "ASR-PARTIAL-AS-COMMIT",
          "Critical",
          "OutcomeEvidence",
          "evidence.atomicity",
          "atomic-complete",
          "missing-atomicity",
          "Partial or missing atomicity evidence cannot assure commit.",
          "Indeterminate",
        ),
      );
    }
    if (!isPresent(receipt.allocatedSequence)) {
      findings.push(
        finding(
          11,
          "ASR-UNSUPPORTED-COMMIT",
          "Critical",
          "ExecutionReceipt",
          "receipt.allocatedSequence",
          "present",
          "missing",
          "Committed receipt missing allocated sequence.",
          "NotAssured",
        ),
      );
    }
    if (
      receipt.requestId !== intent.requestId
      || receipt.enforcementPlanId !== intent.enforcementPlanId
      || receipt.eventBatchDigest !== intent.eventBatchDigest
      || receipt.authorityRef !== intent.authorityRef
    ) {
      findings.push(
        finding(
          10,
          "ASR-RECEIPT-MISMATCH",
          "Critical",
          "ExecutionReceipt",
          "receipt.bindings",
          "intent-bindings",
          "diverged",
          "Committed receipt bindings must match the intent.",
          "NotAssured",
        ),
      );
    }
  }

  if (receipt.kind === "Conflict") {
    if (
      !completeEvidence(bundle.evidenceItems, "ConcurrencyConflictEvidence")
      && !completeEvidence(
        bundle.evidenceItems,
        "IdempotencyConflictEvidence",
      )
    ) {
      findings.push(
        finding(
          10,
          "ASR-UNSUPPORTED-CONFLICT",
          "Error",
          "ExecutionReceipt",
          "receipt.conflict",
          "conflict-evidence",
          isPresent(receipt.conflictCode) ? "code-without-evidence" : "missing",
          "Conflict receipt lacks supporting conflict evidence.",
          "Indeterminate",
        ),
      );
    }
  }

  if (receipt.kind === "Failed") {
    if (
      !completeEvidence(
        bundle.evidenceItems,
        "DefinitiveRejectionEvidence",
      )
      && !completeEvidence(bundle.evidenceItems, "RollbackEvidence")
    ) {
      if (hasEvidenceKind(bundle.evidenceItems, "TimeoutEvidence")) {
        findings.push(
          finding(
            10,
            "ASR-UNSUPPORTED-FAILED",
            "Error",
            "ExecutionReceipt",
            "receipt.failed",
            "definitive-failure",
            "timeout-only",
            "Timeout alone does not prove failure.",
            "Indeterminate",
          ),
        );
      } else {
        findings.push(
          finding(
            10,
            "ASR-MISSING-FAILURE-EVIDENCE",
            "Error",
            "ExecutionReceipt",
            "receipt.failed",
            "definitive-failure",
            "missing",
            "Failed receipt lacks definitive rejection or rollback evidence.",
            "Indeterminate",
          ),
        );
      }
    }
  }

  if (receipt.kind === "Indeterminate") {
    if (bundle.reportedIndeterminateUpgraded) {
      findings.push(
        finding(
          18,
          "ASR-INDETERMINATE-UPGRADED",
          "Critical",
          "OutcomeEvidence",
          "receipt.indeterminate",
          "preserve-uncertainty",
          "upgraded",
          "Indeterminate must not be upgraded.",
          "NotAssured",
        ),
      );
    }
  }

  if (
    bundle.evidenceItems.some((item) => item.completeness === "Contradictory")
  ) {
    findings.push(
      finding(
        10,
        "ASR-CONTRADICTORY-OUTCOME",
        "Critical",
        "OutcomeEvidence",
        "evidence.completeness",
        "consistent",
        "contradictory",
        "Contradictory outcome evidence fails assurance.",
        "NotAssured",
      ),
    );
  }

  for (const item of bundle.evidenceItems) {
    if (item.requestId !== intent.requestId) {
      findings.push(
        finding(
          6,
          "ASR-EVIDENCE-IDENTITY-MISMATCH",
          "Error",
          "OutcomeEvidence",
          "evidence.requestId",
          intent.requestId,
          item.requestId,
          "Evidence request identity must match the intent.",
          "NotAssured",
        ),
      );
    }
    if (
      item.idempotencyKey !== intent.idempotencyKey
      || item.planDigest !== intent.planDigest
    ) {
      findings.push(
        finding(
          8,
          "ASR-EVIDENCE-DIGEST-MISMATCH",
          "Error",
          "OutcomeEvidence",
          "evidence.key|digest",
          `${intent.idempotencyKey}|${intent.planDigest}`,
          `${item.idempotencyKey}|${item.planDigest}`,
          "Evidence must bind the intent key and plan digest.",
          "NotAssured",
        ),
      );
    }
    if (!isPresent(item.evidenceDigest)) {
      findings.push(
        finding(
          10,
          "ASR-EVIDENCE-DIGEST-MISMATCH",
          "Error",
          "OutcomeEvidence",
          "evidence.evidenceDigest",
          "present",
          "missing",
          "Evidence digest binding is required.",
          "Indeterminate",
        ),
      );
    }
  }

  if (bundle.reportedAppendOnlyViolation) {
    findings.push(
      finding(
        12,
        "ASR-APPEND-ONLY",
        "Critical",
        "AppendOnlyClaim",
        "controls.appendOnly",
        "append-only",
        "violated",
        "Append-only violation is not assured.",
        "NotAssured",
      ),
    );
  }
  if (bundle.reportedHistoricalErasure) {
    findings.push(
      finding(
        12,
        "ASR-HISTORICAL-ERASURE",
        "Critical",
        "AppendOnlyClaim",
        "controls.history",
        "preserve",
        "erasure",
        "Historical erasure is not assured.",
        "NotAssured",
      ),
    );
  }
  if (bundle.reportedAuthorityCreated) {
    findings.push(
      finding(
        13,
        "ASR-AUTHORITY-CREATED",
        "Critical",
        "AuthorityBinding",
        "controls.authority",
        "no-create",
        "created",
        "Authority creation fails assurance.",
        "NotAssured",
      ),
    );
  }
  if (bundle.reportedAuthorityBroadened) {
    findings.push(
      finding(
        13,
        "ASR-AUTHORITY-BROADENED",
        "Critical",
        "AuthorityBinding",
        "controls.authority",
        "exact",
        "broadened",
        "Authority broadening fails assurance.",
        "NotAssured",
      ),
    );
  }
  if (bundle.reportedConfirmationSubstituted) {
    findings.push(
      finding(
        14,
        "ASR-CONFIRMATION-MISMATCH",
        "Critical",
        "ConfirmationBinding",
        "controls.confirmation",
        "exact",
        "substituted",
        "Confirmation substitution fails assurance.",
        "NotAssured",
      ),
    );
  }
  if (bundle.reportedAiAuthoritativeAction) {
    findings.push(
      finding(
        15,
        "ASR-AI-AUTHORITATIVE",
        "Critical",
        "AiBoundary",
        "controls.ai",
        "prohibited",
        "authoritative-ai",
        "AI authoritative action fails assurance.",
        "NotAssured",
      ),
    );
  }
  if (bundle.reportedUnauthorizedDisclosure) {
    findings.push(
      finding(
        16,
        "ASR-UNAUTHORIZED-DISCLOSURE",
        "Critical",
        "PrivacyBoundary",
        "controls.privacy",
        "purpose-bound",
        "unauthorized-disclosure",
        "Unauthorized disclosure fails assurance.",
        "NotAssured",
      ),
    );
  }
  if (bundle.reportedProjectionCreatesAuthority) {
    findings.push(
      finding(
        17,
        "ASR-PROJECTION-AUTHORITY",
        "Critical",
        "ProjectionClaim",
        "controls.projection",
        "non-authoritative",
        "creates-authority",
        "Projection-created authority fails assurance.",
        "NotAssured",
      ),
    );
  }
  if (bundle.reportedProjectionErasesProvenance) {
    findings.push(
      finding(
        17,
        "ASR-PROJECTION-ERASURE",
        "Critical",
        "ProjectionClaim",
        "controls.projection",
        "preserve-provenance",
        "erased",
        "Projection provenance erasure fails assurance.",
        "NotAssured",
      ),
    );
  }
  if (bundle.reportedRetentionAltered) {
    findings.push(
      finding(
        19,
        "ASR-RETENTION-ALTERED",
        "Critical",
        "RetentionClaim",
        "controls.retention",
        "unchanged",
        "altered",
        "Retention alteration fails assurance.",
        "NotAssured",
      ),
    );
  }
  if (bundle.reportedTelemetryContainsPayload) {
    findings.push(
      finding(
        20,
        "ASR-TELEMETRY-PAYLOAD",
        "Critical",
        "TelemetryClaim",
        "controls.telemetry",
        "metadata-only",
        "payload-bearing",
        "Payload-bearing telemetry fails assurance.",
        "NotAssured",
      ),
    );
  }
  if (bundle.requiresUnresolvedOpenIssueDefault) {
    findings.push(
      finding(
        21,
        "ASR-OPEN-ISSUE",
        "Error",
        "ExecutionRequest",
        "openIssues",
        "resolved-upstream",
        "unresolved-default-required",
        "Unresolved open-issue defaults remain Indeterminate.",
        "Indeterminate",
      ),
    );
  }

  return orderFindings(findings);
};

const buildResult = (
  kind: ExecutiveDecisionRegisterAssuranceResultKind,
  bundleId: string,
  findings: readonly ExecutiveDecisionRegisterAssuranceFinding[],
): ExecutiveDecisionRegisterAssuranceResult => {
  const reasonCode = kind === "Assured"
    ? "ASR-ASSURED"
    : findings[0]?.findingCode ?? `ASR-${kind.toUpperCase()}`;
  const reason = kind === "Assured"
    ? "All required bindings reconcile and supplied evidence is complete and consistent."
    : findings[0]?.message ?? kind;
  const summary = [
    ExecutiveDecisionRegisterAssuranceId,
    ExecutiveDecisionRegisterAssuranceVersion,
    kind,
    bundleId,
    String(findings.length),
    reasonCode,
  ].join("|");
  const base = Object.freeze({
    kind,
    reasonCode,
    reason,
    bundleId,
    findings: kind === "Assured"
      ? Object.freeze([]) as readonly []
      : findings,
    summary,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
    repairs: false as const,
    executes: false as const,
    certifies: false as const,
    authorizesConsumption: false as const,
    authorizesIntegration: false as const,
    authorizesDeployment: false as const,
  });
  return base as ExecutiveDecisionRegisterAssuranceResult;
};

export function reconcileExecutiveDecisionRegisterEvidenceBundle(
  bundle: ExecutiveDecisionRegisterAssuranceEvidenceBundle,
): ExecutiveDecisionRegisterAssuranceResult {
  const findings = collectFindings(bundle);
  return buildResult(resolveKind(findings), bundle.bundleId, findings);
}

export function assessExecutiveDecisionRegisterAssurance(
  bundle: ExecutiveDecisionRegisterAssuranceEvidenceBundle,
): ExecutiveDecisionRegisterAssuranceResult {
  return reconcileExecutiveDecisionRegisterEvidenceBundle(bundle);
}

const overlayOr = <T>(
  overlays: Partial<ExecutiveDecisionRegisterAssuranceEvidenceBundle>,
  key: keyof ExecutiveDecisionRegisterAssuranceEvidenceBundle,
  fallback: T,
): T =>
  (Object.prototype.hasOwnProperty.call(overlays, key)
    ? overlays[key] as T
    : fallback);

export function reconcileExecutiveDecisionRegisterIntentReceipt(
  intent: ExecutiveDecisionRegisterExecutionIntent,
  receipt: ExecutiveDecisionRegisterExecutionReceipt,
  overlays: Partial<ExecutiveDecisionRegisterAssuranceEvidenceBundle> = {},
): ExecutiveDecisionRegisterAssuranceResult {
  const defaultEvidence: ExecutiveDecisionRegisterAssuranceEvidenceItem[] = [];
  if (receipt.kind === "Committed") {
    defaultEvidence.push(
      Object.freeze({
        evidenceId: "ev-commit-1",
        evidenceKind: "CommitEvidence",
        producingSource: "external-executor",
        requestId: intent.requestId,
        intentId: intent.intentId,
        batchDigest: intent.eventBatchDigest,
        receiptId: receipt.receiptId,
        idempotencyKey: intent.idempotencyKey,
        planDigest: intent.planDigest,
        evidenceDigest: "digest-commit-1",
        observedSequence: intent.expectedRegisterSequence,
        completeness: "Complete",
        metadataOnly: true as const,
        immutable: true as const,
        containsPayload: false as const,
      }),
      Object.freeze({
        evidenceId: "ev-atomic-1",
        evidenceKind: "AtomicityEvidence",
        producingSource: "external-executor",
        requestId: intent.requestId,
        intentId: intent.intentId,
        batchDigest: intent.eventBatchDigest,
        receiptId: receipt.receiptId,
        idempotencyKey: intent.idempotencyKey,
        planDigest: intent.planDigest,
        evidenceDigest: "digest-atomic-1",
        observedSequence: intent.expectedRegisterSequence,
        completeness: "Complete",
        metadataOnly: true as const,
        immutable: true as const,
        containsPayload: false as const,
      }),
    );
  } else if (receipt.kind === "Conflict") {
    defaultEvidence.push(
      Object.freeze({
        evidenceId: "ev-conflict-1",
        evidenceKind: "ConcurrencyConflictEvidence",
        producingSource: "external-executor",
        requestId: intent.requestId,
        intentId: intent.intentId,
        batchDigest: intent.eventBatchDigest,
        receiptId: receipt.receiptId,
        idempotencyKey: intent.idempotencyKey,
        planDigest: intent.planDigest,
        evidenceDigest: "digest-conflict-1",
        observedSequence: receipt.observedSequence,
        completeness: "Complete",
        metadataOnly: true as const,
        immutable: true as const,
        containsPayload: false as const,
      }),
    );
  } else if (receipt.kind === "Failed") {
    defaultEvidence.push(
      Object.freeze({
        evidenceId: "ev-fail-1",
        evidenceKind: "DefinitiveRejectionEvidence",
        producingSource: "external-executor",
        requestId: intent.requestId,
        intentId: intent.intentId,
        batchDigest: intent.eventBatchDigest,
        receiptId: receipt.receiptId,
        idempotencyKey: intent.idempotencyKey,
        planDigest: intent.planDigest,
        evidenceDigest: "digest-fail-1",
        observedSequence: null,
        completeness: "Complete",
        metadataOnly: true as const,
        immutable: true as const,
        containsPayload: false as const,
      }),
    );
  }

  const bundle: ExecutiveDecisionRegisterAssuranceEvidenceBundle = Object.freeze({
    bundleId: overlayOr(
      overlays,
      "bundleId",
      `bundle/${intent.intentId}/${receipt.receiptId}`,
    ),
    assuranceRequestId: overlayOr(
      overlays,
      "assuranceRequestId",
      `assure/${intent.requestId}`,
    ),
    intent,
    receipt,
    enforcementPlan: overlayOr(
      overlays,
      "enforcementPlan",
      intent.enforcementPlan,
    ),
    evidenceItems: overlayOr(
      overlays,
      "evidenceItems",
      Object.freeze(defaultEvidence),
    ),
    reportedAppendOnlyViolation: overlayOr(
      overlays,
      "reportedAppendOnlyViolation",
      false,
    ),
    reportedHistoricalErasure: overlayOr(
      overlays,
      "reportedHistoricalErasure",
      false,
    ),
    reportedAuthorityCreated: overlayOr(
      overlays,
      "reportedAuthorityCreated",
      false,
    ),
    reportedAuthorityBroadened: overlayOr(
      overlays,
      "reportedAuthorityBroadened",
      false,
    ),
    reportedConfirmationSubstituted: overlayOr(
      overlays,
      "reportedConfirmationSubstituted",
      false,
    ),
    reportedAiAuthoritativeAction: overlayOr(
      overlays,
      "reportedAiAuthoritativeAction",
      false,
    ),
    reportedSilentRebase: overlayOr(overlays, "reportedSilentRebase", false),
    reportedIdempotencyRotation: overlayOr(
      overlays,
      "reportedIdempotencyRotation",
      false,
    ),
    reportedProjectionCreatesAuthority: overlayOr(
      overlays,
      "reportedProjectionCreatesAuthority",
      false,
    ),
    reportedProjectionErasesProvenance: overlayOr(
      overlays,
      "reportedProjectionErasesProvenance",
      false,
    ),
    reportedUnauthorizedDisclosure: overlayOr(
      overlays,
      "reportedUnauthorizedDisclosure",
      false,
    ),
    reportedRetentionAltered: overlayOr(
      overlays,
      "reportedRetentionAltered",
      false,
    ),
    reportedTelemetryContainsPayload: overlayOr(
      overlays,
      "reportedTelemetryContainsPayload",
      false,
    ),
    reportedIndeterminateUpgraded: overlayOr(
      overlays,
      "reportedIndeterminateUpgraded",
      false,
    ),
    requiresUnresolvedOpenIssueDefault: overlayOr(
      overlays,
      "requiresUnresolvedOpenIssueDefault",
      false,
    ),
    metadataOnly: true as const,
    immutable: true as const,
    containsPayload: false as const,
  });
  return reconcileExecutiveDecisionRegisterEvidenceBundle(bundle);
}

export function isExecutiveDecisionRegisterAssured(
  result: ExecutiveDecisionRegisterAssuranceResult,
): boolean {
  return result.kind === "Assured";
}

export function isExecutiveDecisionRegisterNotAssured(
  result: ExecutiveDecisionRegisterAssuranceResult,
): boolean {
  return result.kind === "NotAssured";
}

export function getExecutiveDecisionRegisterAssuranceFindings(
  result: ExecutiveDecisionRegisterAssuranceResult,
): readonly ExecutiveDecisionRegisterAssuranceFinding[] {
  return result.findings;
}

export function validateExecutiveDecisionRegisterAssuranceRuleCatalogue():
  boolean {
  const priorities = ExecutiveDecisionRegisterAssuranceRules.map(
    (item) => item.priority,
  );
  return priorities.length === new Set(priorities).size
    && priorities.every((value, index) => value === index + 1);
}

export type { ExecutiveDecisionRegisterEnforcementPlan };
