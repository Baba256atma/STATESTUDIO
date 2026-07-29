/**
 * RTC-2:8 — Executive Journal Runtime Reconciliation & Assurance Rules.
 *
 * Pure deterministic evaluation of explicitly supplied evidence.
 * Detects divergence; never repairs, fetches, or verifies cryptography.
 *
 * Ownership: owned exclusively by RTC-2:8.
 */

import { ExecutiveJournalRuntimeExecution } from "./executiveJournalRuntimeExecution.ts";
import {
  ExecutiveJournalRuntimeAssuranceId,
  ExecutiveJournalRuntimeAssuranceVersion,
} from "./executiveJournalRuntimeAssuranceIdentity.ts";
import type {
  ExecutiveJournalRuntimeAssuranceEvidenceBundle,
  ExecutiveJournalRuntimeAssuranceFinding,
  ExecutiveJournalRuntimeAssuranceResult,
  ExecutiveJournalRuntimeAssuranceResultKind,
  ExecutiveJournalRuntimeAssuranceSeverity,
  ExecutiveJournalRuntimeAssuranceSubjectKind,
} from "./executiveJournalRuntimeAssuranceTypes.ts";
import type {
  ExecutiveJournalRuntimeExecutionIntent,
  ExecutiveJournalRuntimeExecutionReceipt,
} from "./executiveJournalRuntimeExecutionTypes.ts";

export interface ExecutiveJournalRuntimeAssuranceRuleDeclaration {
  readonly ruleId: string;
  readonly ruleKey: string;
  readonly family: string;
  readonly priority: number;
  readonly description: string;
  readonly evaluatesOnly: true;
  readonly repairs: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const rule = (
  priority: number,
  family: string,
  ruleKey: string,
  description: string,
): ExecutiveJournalRuntimeAssuranceRuleDeclaration =>
  Object.freeze({
    ruleId: `RTC-2:8/Rule/${String(priority).padStart(2, "0")}`,
    ruleKey,
    family,
    priority,
    description,
    evaluatesOnly: true as const,
    repairs: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveJournalRuntimeAssuranceRules = Object.freeze([
  rule(1, "Contract", "EvidenceBundleShape", "Bundle must include intent and receipt references."),
  rule(2, "Contract", "IntentReceiptBinding", "Receipt must bind to the exact intent."),
  rule(3, "Contract", "PolicyBinding", "Policy references must match across the chain."),
  rule(4, "Contract", "EnforcementBinding", "Enforcement-plan references must match."),
  rule(5, "Contract", "RequestBinding", "Request identity must match across the chain."),
  rule(6, "Contract", "AuthorityBinding", "Authority must match intent and enforcement."),
  rule(7, "Receipt", "ReceiptKindEvidence", "Receipt kind must match supplied evidence."),
  rule(8, "Idempotency", "IdempotencyConsistency", "Key and digests must be consistent."),
  rule(9, "Sequence", "SequenceContinuity", "Sequences must be contiguous without reuse or gaps."),
  rule(10, "Atomicity", "AtomicCommitCompleteness", "Committed effects require one atomic boundary."),
  rule(11, "Integrity", "IntegrityEvidencePresence", "Integrity evidence metadata must be present."),
  rule(12, "AppendOnly", "AppendOnlyIntegrity", "Append-only violations are divergent."),
  rule(13, "Authority", "ConfirmationIntegrity", "Confirmation and authority boundaries."),
  rule(14, "Ai", "AiBoundary", "AI must not satisfy prohibited authority actions."),
  rule(15, "Privacy", "PrivateReflectionBoundary", "Private reflection must stay structurally separate."),
  rule(16, "Disclosure", "DisclosureExportEvidence", "Disclosure/export evidence without format selection."),
  rule(17, "Retention", "RetentionDispositionEvidence", "Retention/disposition without period selection."),
  rule(18, "Projection", "ProjectionProvenance", "Projection evidence requires provenance."),
  rule(19, "Replay", "ReplayRecoveryConsistency", "Replay/recovery mismatches are divergent."),
  rule(20, "Telemetry", "TelemetryPayloadFree", "Routine telemetry must remain payload-free."),
] as const);

const SEVERITY_RANK: Readonly<
  Record<ExecutiveJournalRuntimeAssuranceSeverity, number>
> = Object.freeze({
  Critical: 1,
  Error: 2,
  Warning: 3,
});

const SUBJECT_RANK: Readonly<
  Record<ExecutiveJournalRuntimeAssuranceSubjectKind, number>
> = Object.freeze(
  Object.fromEntries(
    [
      "ExecutionIntent",
      "ExecutionReceipt",
      "EventBatch",
      "AcceptedEvent",
      "JournalSequence",
      "IdempotencyRecord",
      "IntegrityEvidence",
      "PolicyEvidence",
      "EnforcementEvidence",
      "AuthorityEvidence",
      "ConfirmationEvidence",
      "DisclosureEvidence",
      "ExportEvidence",
      "RetentionEvidence",
      "DispositionEvidence",
      "ProjectionCheckpoint",
      "ReplayEvidence",
      "RecoveryEvidence",
      "TelemetryEvidence",
    ].map((kind, index) => [kind, index + 1]),
  ) as Record<ExecutiveJournalRuntimeAssuranceSubjectKind, number>,
);

const RESULT_RANK: Readonly<
  Record<ExecutiveJournalRuntimeAssuranceResultKind, number>
> = Object.freeze({
  Invalid: 1,
  Divergent: 2,
  Indeterminate: 3,
  Reconciled: 4,
});

const isPresent = (value: unknown): boolean =>
  value !== null && value !== undefined && value !== "";

const finding = (
  priority: number,
  findingCode: string,
  severity: ExecutiveJournalRuntimeAssuranceSeverity,
  subjectKind: ExecutiveJournalRuntimeAssuranceSubjectKind,
  subjectPath: string,
  expected: string,
  observed: string,
  message: string,
  recommendedResponseCode: string,
  resultHint: ExecutiveJournalRuntimeAssuranceResultKind,
): ExecutiveJournalRuntimeAssuranceFinding => {
  const ruleId = `RTC-2:8/Rule/${String(priority).padStart(2, "0")}`;
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
    upstreamContractRef: "RTC-2:7/ExecutiveJournalRuntimeExecutionContract",
    message,
    recommendedResponseCode,
    orderingKey,
    resultHint,
    metadataOnly: true as const,
    immutable: true as const,
    containsPayload: false as const,
  });
};

const orderFindings = (
  findings: readonly ExecutiveJournalRuntimeAssuranceFinding[],
): readonly ExecutiveJournalRuntimeAssuranceFinding[] =>
  Object.freeze(
    [...findings].sort((left, right) => {
      if (left.orderingKey < right.orderingKey) return -1;
      if (left.orderingKey > right.orderingKey) return 1;
      return 0;
    }),
  );

const resolveKind = (
  findings: readonly ExecutiveJournalRuntimeAssuranceFinding[],
): ExecutiveJournalRuntimeAssuranceResultKind => {
  if (findings.length === 0) {
    return "Reconciled";
  }
  let best: ExecutiveJournalRuntimeAssuranceResultKind = "Reconciled";
  for (const item of findings) {
    if (RESULT_RANK[item.resultHint] < RESULT_RANK[best]) {
      best = item.resultHint;
    }
  }
  return best;
};

const collectFindings = (
  bundle: ExecutiveJournalRuntimeAssuranceEvidenceBundle,
): readonly ExecutiveJournalRuntimeAssuranceFinding[] => {
  const findings: ExecutiveJournalRuntimeAssuranceFinding[] = [];
  const intent = bundle.intent;
  const receipt = bundle.receipt;

  if (!intent || !receipt) {
    findings.push(
      finding(
        1,
        "ASR-MALFORMED-BUNDLE",
        "Critical",
        "ExecutionIntent",
        "bundle.intent|receipt",
        "intent+receipt",
        `${intent ? "intent" : "missing"}/${receipt ? "receipt" : "missing"}`,
        "Assurance bundle must include canonical intent and receipt references.",
        "REJECT_BUNDLE",
        "Invalid",
      ),
    );
    return orderFindings(findings);
  }

  if (
    ExecutiveJournalRuntimeExecution.identity.id
      !== "RTC-2:7/ExecutiveJournalRuntimeExecutionContract"
  ) {
    findings.push(
      finding(
        1,
        "ASR-UNKNOWN-EXECUTION",
        "Critical",
        "ExecutionIntent",
        "execution.identity",
        "RTC-2:7/ExecutiveJournalRuntimeExecutionContract",
        "unrecognized",
        "Unrecognized execution-contract aggregate.",
        "REJECT_BUNDLE",
        "Invalid",
      ),
    );
  }

  if (receipt.intentId !== intent.intentId) {
    findings.push(
      finding(
        2,
        "ASR-INTENT-RECEIPT-MISMATCH",
        "Critical",
        "ExecutionReceipt",
        "receipt.intentId",
        intent.intentId,
        receipt.intentId,
        "Receipt is not bound to the supplied execution intent.",
        "REFRESH_AND_REPLAN",
        "Divergent",
      ),
    );
  }

  if (
    !isPresent(bundle.policyDecisionCode)
    || bundle.policyDecisionCode !== intent.policyDecisionCode
    || bundle.policyDecisionCode !== receipt.policyDecisionCode
  ) {
    findings.push(
      finding(
        3,
        "ASR-POLICY-MISMATCH",
        "Critical",
        "PolicyEvidence",
        "policyDecisionCode",
        intent.policyDecisionCode,
        String(bundle.policyDecisionCode),
        "Policy-decision reference mismatch across the chain.",
        "REFRESH_AND_REPLAN",
        "Divergent",
      ),
    );
  }

  if (
    !isPresent(bundle.enforcementPlanId)
    || bundle.enforcementPlanId !== intent.enforcementPlanId
    || bundle.enforcementPlanId !== receipt.enforcementPlanId
  ) {
    findings.push(
      finding(
        4,
        "ASR-ENFORCEMENT-MISMATCH",
        "Critical",
        "EnforcementEvidence",
        "enforcementPlanId",
        intent.enforcementPlanId,
        String(bundle.enforcementPlanId),
        "Enforcement-plan reference mismatch across the chain.",
        "REFRESH_AND_REPLAN",
        "Divergent",
      ),
    );
  }

  if (
    !isPresent(bundle.requestId)
    || bundle.requestId !== intent.requestId
    || bundle.requestId !== receipt.requestId
  ) {
    findings.push(
      finding(
        5,
        "ASR-REQUEST-MISMATCH",
        "Critical",
        "ExecutionIntent",
        "requestId",
        intent.requestId,
        String(bundle.requestId),
        "Request identity mismatch across the chain.",
        "REFRESH_AND_REPLAN",
        "Divergent",
      ),
    );
  }

  if (
    !isPresent(bundle.authorityRef)
    || bundle.authorityRef !== intent.authorityRef
  ) {
    findings.push(
      finding(
        6,
        "ASR-AUTHORITY-MISMATCH",
        "Critical",
        "AuthorityEvidence",
        "authorityRef",
        intent.authorityRef,
        String(bundle.authorityRef),
        "Authority reference does not match the execution intent.",
        "REFRESH_AND_REPLAN",
        "Divergent",
      ),
    );
  }

  if (bundle.validationOutcome !== "Valid") {
    findings.push(
      finding(
        1,
        "ASR-VALIDATION-INVALID",
        "Critical",
        "PolicyEvidence",
        "validationOutcome",
        "Valid",
        String(bundle.validationOutcome),
        "Validation reference is missing or invalid.",
        "REJECT_BUNDLE",
        "Invalid",
      ),
    );
  }

  if (bundle.requiresUnresolvedOpenIssueDefault) {
    findings.push(
      finding(
        1,
        "ASR-OPEN-ISSUE",
        "Error",
        "PolicyEvidence",
        "openIssues",
        "resolved-or-explicit",
        "unresolved-default-required",
        "Unresolved open-issue default cannot be treated as compliant.",
        "HOLD_FOR_POLICY",
        "Indeterminate",
      ),
    );
  }

  // Receipt kind evidence
  if (receipt.kind === "Committed") {
    if (bundle.partialCommit) {
      findings.push(
        finding(
          10,
          "ASR-PARTIAL-COMMIT",
          "Critical",
          "ExecutionReceipt",
          "receipt.partialCommit",
          "atomic-complete",
          "partial",
          "Partial commit cannot reconcile as Committed.",
          "RECONCILE_SAME_KEY",
          "Divergent",
        ),
      );
    }
    const missingCommit = !isPresent(bundle.atomicCommitEvidence)
      || !isPresent(bundle.idempotencyRecordEvidence)
      || !isPresent(bundle.integrityEvidence)
      || !isPresent(bundle.reportedSequenceRange)
      || bundle.acceptedEventRefs.length === 0;
    if (missingCommit) {
      findings.push(
        finding(
          7,
          "ASR-MISSING-COMMIT-EVIDENCE",
          "Error",
          "ExecutionReceipt",
          "receipt.commitEvidence",
          "complete-commit-evidence",
          "incomplete",
          "Committed receipt lacks complete commit evidence metadata.",
          "SUPPLY_EVIDENCE",
          "Indeterminate",
        ),
      );
    }
    if (
      isPresent(bundle.outboxEvidence) === false
      && intent.requiredOutboxOperations.length > 0
      && !missingCommit
    ) {
      findings.push(
        finding(
          10,
          "ASR-MISSING-OUTBOX",
          "Error",
          "ExecutionReceipt",
          "outboxEvidence",
          "outbox-evidence",
          "missing",
          "Transactional outbox evidence is required for this committed intent.",
          "SUPPLY_EVIDENCE",
          "Indeterminate",
        ),
      );
    }
  }

  if (receipt.kind === "Failed" && receipt.provesNoAcceptedEffect !== true) {
    findings.push(
      finding(
        7,
        "ASR-FAILED-UNPROVEN",
        "Critical",
        "ExecutionReceipt",
        "receipt.provesNoAcceptedEffect",
        "true",
        "false",
        "Failed receipt must prove no accepted effect.",
        "RECONCILE_SAME_KEY",
        "Divergent",
      ),
    );
  }

  if (receipt.kind === "Indeterminate") {
    if (
      bundle.acceptedEventRefs.length > 0
      || isPresent(bundle.atomicCommitEvidence)
    ) {
      findings.push(
        finding(
          7,
          "ASR-INDETERMINATE-CLAIMS",
          "Critical",
          "ExecutionReceipt",
          "receipt.indeterminate",
          "no-success-or-failure-claim",
          "claims-present",
          "Indeterminate receipt must not claim success or failure.",
          "RECONCILE_SAME_KEY",
          "Divergent",
        ),
      );
    } else {
      findings.push(
        finding(
          7,
          "ASR-INDETERMINATE-OUTCOME",
          "Error",
          "ExecutionReceipt",
          "receipt.kind",
          "reconciled-or-divergent-evidence",
          "indeterminate",
          "Uncertain outcome remains indeterminate pending reconciliation.",
          "RECONCILE_SAME_KEY",
          "Indeterminate",
        ),
      );
    }
  }

  if (receipt.kind === "Conflict" && !isPresent(String(receipt.conflictCode))) {
    findings.push(
      finding(
        7,
        "ASR-CONFLICT-EVIDENCE",
        "Error",
        "ExecutionReceipt",
        "receipt.conflictCode",
        "conflict-evidence",
        "missing",
        "Conflict receipt requires conflict evidence.",
        "SUPPLY_EVIDENCE",
        "Indeterminate",
      ),
    );
  }

  // Idempotency
  if (
    bundle.idempotencyKey !== intent.idempotencyKey
    || bundle.idempotencyKey !== receipt.idempotencyKey
  ) {
    findings.push(
      finding(
        8,
        "ASR-IDEMPOTENCY-KEY-MISMATCH",
        "Critical",
        "IdempotencyRecord",
        "idempotencyKey",
        intent.idempotencyKey,
        String(bundle.idempotencyKey),
        "Idempotency key mismatch across intent, receipt, and bundle.",
        "REFRESH_AND_REPLAN",
        "Divergent",
      ),
    );
  }

  if (
    bundle.commandDigest !== intent.commandDigest
    || bundle.eventBatchDigest !== intent.eventBatchDigest
    || bundle.commandDigest !== receipt.commandDigest
    || bundle.eventBatchDigest !== receipt.eventBatchDigest
  ) {
    findings.push(
      finding(
        8,
        "ASR-DIGEST-MISMATCH",
        "Critical",
        "IdempotencyRecord",
        "commandDigest|eventBatchDigest",
        `${intent.commandDigest}/${intent.eventBatchDigest}`,
        `${String(bundle.commandDigest)}/${String(bundle.eventBatchDigest)}`,
        "Same idempotency key with different digest is divergent.",
        "REFRESH_AND_REPLAN",
        "Divergent",
      ),
    );
  }

  if (bundle.duplicateCommittedEffect) {
    findings.push(
      finding(
        8,
        "ASR-DUPLICATE-COMMIT",
        "Critical",
        "IdempotencyRecord",
        "duplicateCommittedEffect",
        "one-effect",
        "duplicate",
        "Duplicate committed effect detected for the same intended effect.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }

  if (
    receipt.kind === "Indeterminate"
    && bundle.idempotencyKey !== intent.idempotencyKey
  ) {
    findings.push(
      finding(
        8,
        "ASR-INDETERMINATE-KEY",
        "Critical",
        "IdempotencyRecord",
        "indeterminate.retryKey",
        intent.idempotencyKey,
        String(bundle.idempotencyKey),
        "Indeterminate retry must preserve the original idempotency key.",
        "RECONCILE_SAME_KEY",
        "Divergent",
      ),
    );
  }

  // Sequence
  if (bundle.crossJournalBatch) {
    findings.push(
      finding(
        9,
        "ASR-CROSS-JOURNAL",
        "Critical",
        "EventBatch",
        "eventBatch.journal",
        intent.targetJournalId,
        "multiple-journals",
        "Cross-journal sequences are not mixed in one atomic batch.",
        "REFRESH_AND_REPLAN",
        "Divergent",
      ),
    );
  }

  if (bundle.sequenceReuse) {
    findings.push(
      finding(
        9,
        "ASR-SEQUENCE-REUSE",
        "Critical",
        "JournalSequence",
        "sequence.reuse",
        "unique",
        "reused",
        "Sequence reuse is divergent.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }

  const sequences = bundle.allocatedSequences;
  if (sequences.length > 0) {
    const sorted = [...sequences].sort((a, b) => a - b);
    const unique = new Set(sequences);
    if (unique.size !== sequences.length) {
      findings.push(
        finding(
          9,
          "ASR-DUPLICATE-SEQUENCE",
          "Critical",
          "JournalSequence",
          "allocatedSequences",
          "unique-contiguous",
          "duplicate",
          "Duplicate sequence detected within supplied evidence.",
          "INCIDENT_REVIEW",
          "Divergent",
        ),
      );
    }
    if (
      intent.expectedJournalSequence !== null
      && sorted[0] !== intent.expectedJournalSequence
    ) {
      findings.push(
        finding(
          9,
          "ASR-SEQUENCE-START",
          "Critical",
          "JournalSequence",
          "allocatedSequences.start",
          String(intent.expectedJournalSequence),
          String(sorted[0]),
          "Reported sequence does not begin at the expected position.",
          "REFRESH_AND_REPLAN",
          "Divergent",
        ),
      );
    }
    for (let index = 1; index < sorted.length; index += 1) {
      if (sorted[index] !== sorted[index - 1]! + 1) {
        findings.push(
          finding(
            9,
            "ASR-SEQUENCE-GAP",
            "Critical",
            "JournalSequence",
            "allocatedSequences.gap",
            "contiguous",
            `${sorted[index - 1]}->${sorted[index]}`,
            "Committed event sequences must be contiguous.",
            "INCIDENT_REVIEW",
            "Divergent",
          ),
        );
        break;
      }
    }
    if (
      receipt.kind === "Committed"
      && sequences.length !== bundle.acceptedEventRefs.length
    ) {
      findings.push(
        finding(
          9,
          "ASR-BATCH-COUNT-MISMATCH",
          "Critical",
          "AcceptedEvent",
          "acceptedEventRefs.count",
          String(sequences.length),
          String(bundle.acceptedEventRefs.length),
          "Sequence range length must match accepted-event count.",
          "INCIDENT_REVIEW",
          "Divergent",
        ),
      );
    }
  } else if (receipt.kind === "Committed" && !bundle.externalSequenceHistoryPresent) {
    findings.push(
      finding(
        9,
        "ASR-SEQUENCE-HISTORY-MISSING",
        "Error",
        "JournalSequence",
        "allocatedSequences",
        "supplied-or-external-history",
        "missing",
        "Missing sequence history evidence; cannot confirm continuity.",
        "SUPPLY_EVIDENCE",
        "Indeterminate",
      ),
    );
  }

  if (
    receipt.kind === "Committed"
    && isPresent(bundle.atomicCommitEvidence)
    && bundle.proposedEventRefs.length > 0
    && bundle.acceptedEventRefs.length !== bundle.proposedEventRefs.length
    && !bundle.partialCommit
  ) {
    findings.push(
      finding(
        10,
        "ASR-ACCEPTED-COUNT",
        "Critical",
        "EventBatch",
        "acceptedEventRefs",
        String(bundle.proposedEventRefs.length),
        String(bundle.acceptedEventRefs.length),
        "Accepted-event count must match the atomic batch.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }

  // Integrity
  if (
    receipt.kind === "Committed"
    && (
      !isPresent(bundle.integrityEvidence)
      || !isPresent(bundle.batchDigestEvidence)
      || !isPresent(bundle.previousEventDigestRef)
      || !isPresent(bundle.writerSignatureEvidenceRef)
      || !isPresent(bundle.keyVersionRef)
      || !isPresent(bundle.integrityVerificationResult)
    )
  ) {
    // Avoid duplicate if already flagged missing commit evidence
    if (isPresent(bundle.atomicCommitEvidence)) {
      findings.push(
        finding(
          11,
          "ASR-MISSING-INTEGRITY",
          "Error",
          "IntegrityEvidence",
          "integrityEvidence",
          "complete-integrity-metadata",
          "incomplete",
          "Missing integrity evidence metadata.",
          "SUPPLY_EVIDENCE",
          "Indeterminate",
        ),
      );
    }
  }

  // Append-only
  if (
    bundle.appendOnlyViolation
    || bundle.inPlaceCorrection
    || bundle.historicalOverwrite
    || bundle.historicalDeletion
  ) {
    findings.push(
      finding(
        12,
        "ASR-APPEND-ONLY",
        "Critical",
        "EventBatch",
        "appendOnly",
        "append-only",
        "violation",
        "Append-only violation detected in supplied evidence.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }

  if (
    bundle.operation === "Correct"
    && !isPresent(bundle.affectedHistoricalRef)
  ) {
    findings.push(
      finding(
        12,
        "ASR-CORRECTION-REF",
        "Critical",
        "AcceptedEvent",
        "affectedHistoricalRef",
        "historical-reference",
        "missing",
        "Correction without historical reference is divergent.",
        "REFRESH_AND_REPLAN",
        "Divergent",
      ),
    );
  }

  if (
    bundle.operation === "Supersede"
    && !isPresent(bundle.predecessorRef)
  ) {
    findings.push(
      finding(
        12,
        "ASR-SUPERSESSION-REF",
        "Critical",
        "AcceptedEvent",
        "predecessorRef",
        "predecessor-reference",
        "missing",
        "Supersession without predecessor is divergent.",
        "REFRESH_AND_REPLAN",
        "Divergent",
      ),
    );
  }

  if (
    (bundle.operation === "ResolveDispute" || bundle.operation === "Dispute")
    && !isPresent(bundle.disputeRef)
  ) {
    findings.push(
      finding(
        12,
        "ASR-DISPUTE-REF",
        "Critical",
        "AcceptedEvent",
        "disputeRef",
        "dispute-reference",
        "missing",
        "Dispute resolution without dispute reference is divergent.",
        "REFRESH_AND_REPLAN",
        "Divergent",
      ),
    );
  }

  if (
    bundle.operation === "Dispose"
    && !isPresent(bundle.governanceEventRef)
  ) {
    findings.push(
      finding(
        12,
        "ASR-DISPOSITION-GOVERNANCE",
        "Critical",
        "DispositionEvidence",
        "governanceEventRef",
        "governance-event",
        "missing",
        "Disposition without governance-event evidence is divergent.",
        "REFRESH_AND_REPLAN",
        "Divergent",
      ),
    );
  }

  // AI / confirmation
  if (bundle.aiSatisfiedConfirmation) {
    findings.push(
      finding(
        14,
        "ASR-AI-CONFIRMATION",
        "Critical",
        "ConfirmationEvidence",
        "aiSatisfiedConfirmation",
        "human-confirmation",
        "ai",
        "AI cannot satisfy human confirmation.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }
  if (bundle.aiCreatedAuthority) {
    findings.push(
      finding(
        14,
        "ASR-AI-AUTHORITY",
        "Critical",
        "AuthorityEvidence",
        "aiCreatedAuthority",
        "human-authority",
        "ai",
        "AI cannot create or broaden authority.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }
  if (bundle.aiClosedCommitment) {
    findings.push(
      finding(
        14,
        "ASR-AI-CLOSE",
        "Critical",
        "AuthorityEvidence",
        "aiClosedCommitment",
        "human-actor",
        "ai",
        "AI cannot close commitments.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }
  if (bundle.aiDisclosedOrExported) {
    findings.push(
      finding(
        14,
        "ASR-AI-DISCLOSE-EXPORT",
        "Critical",
        "DisclosureEvidence",
        "aiDisclosedOrExported",
        "human-actor",
        "ai",
        "AI cannot disclose or export restricted material.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }
  if (bundle.aiRetentionOrDisposition) {
    findings.push(
      finding(
        14,
        "ASR-AI-RETENTION-DISPOSE",
        "Critical",
        "RetentionEvidence",
        "aiRetentionOrDisposition",
        "human-actor",
        "ai",
        "AI cannot change retention or dispose records.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }

  if (bundle.confirmationReused) {
    findings.push(
      finding(
        13,
        "ASR-CONFIRMATION-REUSED",
        "Critical",
        "ConfirmationEvidence",
        "confirmation.reused",
        "single-use",
        "reused",
        "Single-use confirmation represented as reused.",
        "REFRESH_AND_REPLAN",
        "Divergent",
      ),
    );
  }

  if (
    bundle.confirmationActorKind === "Ai"
    && bundle.confirmationEvidenceRef
  ) {
    findings.push(
      finding(
        13,
        "ASR-CONFIRMATION-AI-ACTOR",
        "Critical",
        "ConfirmationEvidence",
        "confirmation.actorKind",
        "Human",
        "Ai",
        "Confirmation actor kind cannot be AI.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }

  // Private reflection
  if (bundle.privateInSharedSearch) {
    findings.push(
      finding(
        15,
        "ASR-PRIVATE-SEARCH",
        "Critical",
        "ProjectionCheckpoint",
        "private.search",
        "excluded",
        "present",
        "Private reflection in shared search fails assurance.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }
  if (bundle.privateInSharedProjection) {
    findings.push(
      finding(
        15,
        "ASR-PRIVATE-PROJECTION",
        "Critical",
        "ProjectionCheckpoint",
        "private.projection",
        "excluded",
        "present",
        "Private reflection in shared projection fails assurance.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }
  if (bundle.privateExported) {
    findings.push(
      finding(
        15,
        "ASR-PRIVATE-EXPORT",
        "Critical",
        "ExportEvidence",
        "private.export",
        "excluded",
        "present",
        "Private reflection export fails assurance.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }
  if (
    bundle.operation === "PromotePrivateReflection"
    && bundle.privatePromotionValid === false
  ) {
    findings.push(
      finding(
        15,
        "ASR-PRIVATE-PROMOTION",
        "Critical",
        "AcceptedEvent",
        "private.promotion",
        "valid-promotion",
        "invalid",
        "Promotion must preserve private original and create a new shared event.",
        "REFRESH_AND_REPLAN",
        "Divergent",
      ),
    );
  }

  // Disclosure / export
  if (
    bundle.operation === "Disclose"
    && !isPresent(bundle.disclosureEvidenceRef)
    && !isPresent(bundle.policyDecisionCode)
  ) {
    findings.push(
      finding(
        16,
        "ASR-DISCLOSURE-POLICY",
        "Error",
        "DisclosureEvidence",
        "disclosureEvidence",
        "policy+disclosure-evidence",
        "missing",
        "Disclosure without policy evidence is detected.",
        "SUPPLY_EVIDENCE",
        "Indeterminate",
      ),
    );
  }
  if (
    bundle.operation === "Disclose"
    && isPresent(bundle.policyDecisionCode)
    && !isPresent(bundle.disclosureEvidenceRef)
  ) {
    findings.push(
      finding(
        16,
        "ASR-DISCLOSURE-EVIDENCE",
        "Error",
        "DisclosureEvidence",
        "disclosureEvidenceRef",
        "disclosure-evidence",
        "missing",
        "Disclosure without disclosure evidence is detected.",
        "SUPPLY_EVIDENCE",
        "Indeterminate",
      ),
    );
  }
  if (bundle.exportFormatSelected) {
    findings.push(
      finding(
        16,
        "ASR-EXPORT-FORMAT",
        "Critical",
        "ExportEvidence",
        "exportFormatSelected",
        "unresolved-OI-06",
        "format-selected",
        "Export format must not be selected by assurance defaults.",
        "HOLD_FOR_POLICY",
        "Invalid",
      ),
    );
  }

  // Retention
  if (bundle.retentionPeriodSelected) {
    findings.push(
      finding(
        17,
        "ASR-RETENTION-PERIOD",
        "Critical",
        "RetentionEvidence",
        "retentionPeriodSelected",
        "unresolved-period",
        "period-selected",
        "Retention period must not be selected by assurance defaults.",
        "HOLD_FOR_POLICY",
        "Invalid",
      ),
    );
  }

  // Projection
  if (bundle.projection) {
    if (!bundle.projection.hasProvenance) {
      findings.push(
        finding(
          18,
          "ASR-PROJECTION-PROVENANCE",
          "Critical",
          "ProjectionCheckpoint",
          "projection.provenance",
          "provenance-present",
          "missing",
          "Projection without provenance is detected.",
          "INCIDENT_REVIEW",
          "Divergent",
        ),
      );
    }
    if (bundle.projection.sourceJournalId !== intent.targetJournalId) {
      findings.push(
        finding(
          18,
          "ASR-PROJECTION-JOURNAL",
          "Critical",
          "ProjectionCheckpoint",
          "projection.sourceJournalId",
          intent.targetJournalId,
          bundle.projection.sourceJournalId,
          "Projection source journal mismatch.",
          "INCIDENT_REVIEW",
          "Divergent",
        ),
      );
    }
  }

  // Replay / recovery
  if (bundle.replay && !bundle.replay.sequenceContinuityOk) {
    findings.push(
      finding(
        19,
        "ASR-REPLAY-MISMATCH",
        "Critical",
        "ReplayEvidence",
        "replay.sequenceContinuity",
        "ok",
        "mismatch",
        "Replay mismatch is detected.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }
  if (bundle.recovery && !bundle.recovery.projectionReconciliationOk) {
    findings.push(
      finding(
        19,
        "ASR-RECOVERY-MISMATCH",
        "Critical",
        "RecoveryEvidence",
        "recovery.projectionReconciliation",
        "ok",
        "mismatch",
        "Recovery reconciliation mismatch is detected.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }

  // Telemetry
  if (bundle.telemetryContainsPayload) {
    findings.push(
      finding(
        20,
        "ASR-TELEMETRY-PAYLOAD",
        "Critical",
        "TelemetryEvidence",
        "telemetry.containsPayload",
        "metadata-only",
        "payload-bearing",
        "Payload-bearing routine telemetry fails assurance.",
        "INCIDENT_REVIEW",
        "Divergent",
      ),
    );
  }

  return orderFindings(findings);
};

const buildResult = (
  kind: ExecutiveJournalRuntimeAssuranceResultKind,
  bundleId: string,
  findings: readonly ExecutiveJournalRuntimeAssuranceFinding[],
): ExecutiveJournalRuntimeAssuranceResult => {
  const reasonCode = kind === "Reconciled"
    ? "ASR-RECONCILED"
    : findings[0]?.findingCode ?? `ASR-${kind.toUpperCase()}`;
  const reason = kind === "Reconciled"
    ? "All mandatory supplied evidence is complete and mutually consistent."
    : findings[0]?.message ?? kind;
  const summary = [
    ExecutiveJournalRuntimeAssuranceId,
    ExecutiveJournalRuntimeAssuranceVersion,
    kind,
    bundleId,
    String(findings.length),
    reasonCode,
  ].join("|");
  return Object.freeze({
    kind,
    reasonCode,
    reason,
    bundleId,
    findings,
    summary,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
    repairs: false as const,
  });
};

/**
 * Reconcile an immutable evidence bundle.
 */
export function reconcileExecutiveJournalRuntimeEvidenceBundle(
  bundle: ExecutiveJournalRuntimeAssuranceEvidenceBundle,
): ExecutiveJournalRuntimeAssuranceResult {
  const findings = collectFindings(bundle);
  const kind = resolveKind(findings);
  return buildResult(kind, bundle.bundleId, findings);
}

/**
 * Assess one execution receipt against its intent and evidence bundle fields.
 */
export function assessExecutiveJournalRuntimeAssurance(
  bundle: ExecutiveJournalRuntimeAssuranceEvidenceBundle,
): ExecutiveJournalRuntimeAssuranceResult {
  return reconcileExecutiveJournalRuntimeEvidenceBundle(bundle);
}

/**
 * Reconcile an intent and receipt with optional evidence overlays.
 */
const overlayOr = <T>(
  overlays: Partial<ExecutiveJournalRuntimeAssuranceEvidenceBundle>,
  key: keyof ExecutiveJournalRuntimeAssuranceEvidenceBundle,
  fallback: T,
): T =>
  (Object.prototype.hasOwnProperty.call(overlays, key)
    ? overlays[key] as T
    : fallback);

export function reconcileExecutiveJournalRuntimeIntentReceipt(
  intent: ExecutiveJournalRuntimeExecutionIntent,
  receipt: ExecutiveJournalRuntimeExecutionReceipt,
  overlays: Partial<ExecutiveJournalRuntimeAssuranceEvidenceBundle> = {},
): ExecutiveJournalRuntimeAssuranceResult {
  const proposed = intent.eventBatch.map((event) => event.eventIdDescriptor);
  const accepted = receipt.kind === "Committed"
    ? receipt.acceptedEventRefs
    : Object.freeze([]) as readonly string[];
  const bundle: ExecutiveJournalRuntimeAssuranceEvidenceBundle = Object.freeze({
    bundleId: overlayOr(
      overlays,
      "bundleId",
      `bundle/${intent.intentId}/${receipt.receiptId}`,
    ),
    intent,
    receipt,
    enforcementPlanId: overlayOr(
      overlays,
      "enforcementPlanId",
      intent.enforcementPlanId,
    ),
    policyDecisionCode: overlayOr(
      overlays,
      "policyDecisionCode",
      intent.policyDecisionCode,
    ),
    validationOutcome: overlayOr(
      overlays,
      "validationOutcome",
      intent.validationOutcome,
    ),
    requestId: overlayOr(overlays, "requestId", intent.requestId),
    idempotencyKey: overlayOr(overlays, "idempotencyKey", intent.idempotencyKey),
    commandDigest: overlayOr(overlays, "commandDigest", intent.commandDigest),
    targetJournalId: overlayOr(
      overlays,
      "targetJournalId",
      intent.targetJournalId,
    ),
    expectedJournalSequence: overlayOr(
      overlays,
      "expectedJournalSequence",
      intent.expectedJournalSequence,
    ),
    reportedSequenceRange: overlayOr(
      overlays,
      "reportedSequenceRange",
      receipt.kind === "Committed" ? receipt.allocatedSequence : null,
    ),
    eventBatchDigest: overlayOr(
      overlays,
      "eventBatchDigest",
      intent.eventBatchDigest,
    ),
    proposedEventRefs: overlayOr(
      overlays,
      "proposedEventRefs",
      Object.freeze([...proposed]),
    ),
    acceptedEventRefs: overlayOr(
      overlays,
      "acceptedEventRefs",
      Object.freeze([...accepted]),
    ),
    allocatedSequences: overlayOr(
      overlays,
      "allocatedSequences",
      receipt.kind === "Committed"
        ? Object.freeze([intent.expectedJournalSequence])
        : Object.freeze([]),
    ),
    atomicCommitEvidence: overlayOr(
      overlays,
      "atomicCommitEvidence",
      receipt.kind === "Committed" ? receipt.atomicBoundaryEvidence : null,
    ),
    idempotencyRecordEvidence: overlayOr(
      overlays,
      "idempotencyRecordEvidence",
      receipt.kind === "Committed" ? receipt.idempotencyRecordRef : null,
    ),
    integrityEvidence: overlayOr(
      overlays,
      "integrityEvidence",
      receipt.kind === "Committed" ? receipt.integrityEvidenceRef : null,
    ),
    previousEventDigestRef: overlayOr(
      overlays,
      "previousEventDigestRef",
      "prev-digest-1",
    ),
    batchDigestEvidence: overlayOr(
      overlays,
      "batchDigestEvidence",
      intent.eventBatchDigest,
    ),
    writerSignatureEvidenceRef: overlayOr(
      overlays,
      "writerSignatureEvidenceRef",
      "writer-sig-1",
    ),
    keyVersionRef: overlayOr(overlays, "keyVersionRef", "key-v1"),
    integrityVerificationResult: overlayOr(
      overlays,
      "integrityVerificationResult",
      "integrity-ok",
    ),
    outboxEvidence: overlayOr(
      overlays,
      "outboxEvidence",
      receipt.kind === "Committed" ? receipt.outboxEvidenceRef : null,
    ),
    projection: overlayOr(overlays, "projection", null),
    replay: overlayOr(overlays, "replay", null),
    recovery: overlayOr(overlays, "recovery", null),
    privacyCategory: overlayOr(
      overlays,
      "privacyCategory",
      intent.privacyCategory,
    ),
    classification: overlayOr(overlays, "classification", intent.classification),
    authorityRef: overlayOr(overlays, "authorityRef", intent.authorityRef),
    confirmationEvidenceRef: overlayOr(
      overlays,
      "confirmationEvidenceRef",
      null,
    ),
    confirmationReused: overlayOr(overlays, "confirmationReused", false),
    confirmationActorKind: overlayOr(overlays, "confirmationActorKind", null),
    actorKind: overlayOr(overlays, "actorKind", "Human"),
    operation: overlayOr(overlays, "operation", intent.operation),
    disclosureEvidenceRef: overlayOr(overlays, "disclosureEvidenceRef", null),
    exportEvidenceRef: overlayOr(overlays, "exportEvidenceRef", null),
    exportFormatSelected: overlayOr(overlays, "exportFormatSelected", false),
    retentionEvidenceRef: overlayOr(overlays, "retentionEvidenceRef", null),
    retentionPeriodSelected: overlayOr(
      overlays,
      "retentionPeriodSelected",
      false,
    ),
    dispositionEvidenceRef: overlayOr(overlays, "dispositionEvidenceRef", null),
    governanceEventRef: overlayOr(overlays, "governanceEventRef", null),
    predecessorRef: overlayOr(overlays, "predecessorRef", null),
    disputeRef: overlayOr(overlays, "disputeRef", null),
    affectedHistoricalRef: overlayOr(overlays, "affectedHistoricalRef", null),
    appendOnlyViolation: overlayOr(overlays, "appendOnlyViolation", false),
    inPlaceCorrection: overlayOr(overlays, "inPlaceCorrection", false),
    historicalOverwrite: overlayOr(overlays, "historicalOverwrite", false),
    historicalDeletion: overlayOr(overlays, "historicalDeletion", false),
    sequenceReuse: overlayOr(overlays, "sequenceReuse", false),
    duplicateCommittedEffect: overlayOr(
      overlays,
      "duplicateCommittedEffect",
      false,
    ),
    partialCommit: overlayOr(overlays, "partialCommit", false),
    crossJournalBatch: overlayOr(overlays, "crossJournalBatch", false),
    aiSatisfiedConfirmation: overlayOr(
      overlays,
      "aiSatisfiedConfirmation",
      false,
    ),
    aiCreatedAuthority: overlayOr(overlays, "aiCreatedAuthority", false),
    aiClosedCommitment: overlayOr(overlays, "aiClosedCommitment", false),
    aiDisclosedOrExported: overlayOr(overlays, "aiDisclosedOrExported", false),
    aiRetentionOrDisposition: overlayOr(
      overlays,
      "aiRetentionOrDisposition",
      false,
    ),
    privateInSharedSearch: overlayOr(overlays, "privateInSharedSearch", false),
    privateInSharedProjection: overlayOr(
      overlays,
      "privateInSharedProjection",
      false,
    ),
    privateExported: overlayOr(overlays, "privateExported", false),
    privatePromotionValid: overlayOr(overlays, "privatePromotionValid", null),
    telemetryContainsPayload: overlayOr(
      overlays,
      "telemetryContainsPayload",
      false,
    ),
    requiresUnresolvedOpenIssueDefault: overlayOr(
      overlays,
      "requiresUnresolvedOpenIssueDefault",
      false,
    ),
    externalSequenceHistoryPresent: overlayOr(
      overlays,
      "externalSequenceHistoryPresent",
      true,
    ),
    metadataOnly: true as const,
    immutable: true as const,
    containsPayload: false as const,
  });
  return reconcileExecutiveJournalRuntimeEvidenceBundle(bundle);
}

export function isExecutiveJournalRuntimeReconciled(
  result: ExecutiveJournalRuntimeAssuranceResult,
): boolean {
  return result.kind === "Reconciled";
}

export function getExecutiveJournalRuntimeAssuranceFindings(
  result: ExecutiveJournalRuntimeAssuranceResult,
): readonly ExecutiveJournalRuntimeAssuranceFinding[] {
  return result.findings;
}

export function validateExecutiveJournalAssuranceRuleCatalogue(): boolean {
  const rules: readonly ExecutiveJournalRuntimeAssuranceRuleDeclaration[] =
    ExecutiveJournalRuntimeAssuranceRules;
  if (rules.length === 0) {
    return false;
  }
  const priorities = rules.map((item) => item.priority);
  const unique = new Set(priorities);
  return unique.size === priorities.length;
}
