/**
 * RTC-2:8 — Executive Journal Runtime Reconciliation & Assurance Tests.
 *
 * Deterministic coverage for fail-closed evidence reconciliation.
 * No mocks. No randomness. No network. No databases. No repair.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { evaluateExecutiveJournalRuntimePolicy } from "./executiveJournalRuntimePolicy.ts";
import type { ExecutiveJournalRuntimePolicyRequest } from "./executiveJournalRuntimePolicyTypes.ts";
import { planExecutiveJournalRuntimeEnforcement } from "./executiveJournalRuntimeEnforcement.ts";
import type { ExecutiveJournalRuntimeEnforcementRequest } from "./executiveJournalRuntimeEnforcementTypes.ts";
import {
  constructExecutiveJournalRuntimeExecutionIntent,
  createExecutiveJournalRuntimeExecutionReceipt,
  ExecutiveJournalRuntimeExecution,
} from "./executiveJournalRuntimeExecution.ts";
import type {
  ExecutiveJournalRuntimeExecutionIntent,
  ExecutiveJournalRuntimeExecutionIntentRequest,
  ExecutiveJournalRuntimeExecutionOutcomeEvidence,
  ExecutiveJournalRuntimeExecutionReceipt,
  ExecutiveJournalRuntimeProposedEventDescriptor,
} from "./executiveJournalRuntimeExecutionTypes.ts";
import * as AssuranceModule from "./executiveJournalRuntimeAssurance.ts";
import {
  assessExecutiveJournalRuntimeAssurance,
  ExecutiveJournalRuntimeAssurance,
  ExecutiveJournalRuntimeAssuranceId,
  ExecutiveJournalRuntimeAssuranceName,
  ExecutiveJournalRuntimeAssuranceNamespace,
  ExecutiveJournalRuntimeAssurancePreviousPhase,
  ExecutiveJournalRuntimeAssuranceReadiness,
  ExecutiveJournalRuntimeAssuranceStatus,
  ExecutiveJournalRuntimeAssuranceVersion,
  getExecutiveJournalRuntimeAssuranceFindings,
  getExecutiveJournalRuntimeAssuranceSummary,
  isExecutiveJournalRuntimeReconciled,
  reconcileExecutiveJournalRuntimeEvidenceBundle,
  reconcileExecutiveJournalRuntimeIntentReceipt,
  validateExecutiveJournalAssuranceRuleCatalogue,
} from "./executiveJournalRuntimeAssurance.ts";
import type { ExecutiveJournalRuntimeAssuranceEvidenceBundle } from "./executiveJournalRuntimeAssuranceTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC28_FILES = Object.freeze([
  "executiveJournalRuntimeAssurance.ts",
  "executiveJournalRuntimeAssuranceTypes.ts",
  "executiveJournalRuntimeAssuranceIdentity.ts",
  "executiveJournalRuntimeAssuranceLifecycle.ts",
  "executiveJournalRuntimeAssuranceContracts.ts",
  "executiveJournalRuntimeAssuranceRules.ts",
  "executiveJournalRuntimeAssuranceMetadata.ts",
  "executiveJournalRuntimeAssurance.test.ts",
]);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|decision-journal|ex)\//,
  /from ["']\.\/executiveJournalRuntimeFoundation\.ts["']/,
  /from ["']\.\/executiveJournalRuntimeRegistry\.ts["']/,
  /from ["']\.\/executiveJournalRuntimeModel\.ts["']/,
  /from ["']\.\/executiveJournalRuntimeValidation\.ts["']/,
  /from ["']\.\/executiveJournalRuntimePolicy\.ts["']/,
  /from ["']\.\/executiveJournalRuntimeEnforcement\.ts["']/,
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
]);

const policyRequest = (
  overrides: Partial<ExecutiveJournalRuntimePolicyRequest> = {},
): ExecutiveJournalRuntimePolicyRequest =>
  Object.freeze({
    requestId: "req-1",
    operation: "Propose",
    actorId: "actor-1",
    actorKind: "Human",
    authorityRef: "authority-1",
    delegation: null,
    purpose: "continuity",
    targetJournalId: "RTC-JRN-00000001",
    targetEntityKind: "Intent",
    targetEntityId: "intent-1",
    recordCategory: "ExecutiveRecord",
    classification: "internal",
    proposedEffect: "record-intent",
    evidenceRefs: Object.freeze(["evidence-1"]),
    lifecycleState: "Proposed",
    requestedScope: Object.freeze(["fields:metadata"]),
    jurisdictionContext: null,
    jurisdictionRequired: false,
    breakGlass: null,
    validation: Object.freeze({
      outcome: "Valid" as const,
      valid: true,
      warningCount: 0,
      errorCount: 0,
    }),
    retentionPolicyRef: null,
    dispositionPolicyRef: null,
    exportPolicyRef: null,
    dualControlRequired: false,
    ...overrides,
  });

const proposedEvent = (): ExecutiveJournalRuntimeProposedEventDescriptor =>
  Object.freeze({
    eventIdDescriptor: "event-desc-1",
    eventType: "IntentProposed",
    eventVersion: "1.0.0",
    journalId: "RTC-JRN-00000001",
    sequenceOffset: 0,
    actorId: "actor-1",
    authorityRef: "authority-1",
    purpose: "continuity",
    classification: "internal",
    recordCategory: "ExecutiveRecord",
    evidenceRefs: Object.freeze(["evidence-1"]),
    causationRef: null,
    correlationRef: "req-1",
    payloadSchemaRef: "schema://intent-proposed/1",
    integrityRequirements: Object.freeze(["hash", "seal"]),
    predecessorRef: null,
    disputeRef: null,
    metadataOnly: true as const,
    immutable: true as const,
    containsPayload: false as const,
  });

const buildExecutable = (): {
  readonly intent: ExecutiveJournalRuntimeExecutionIntent;
  readonly receipt: ExecutiveJournalRuntimeExecutionReceipt;
} => {
  const decision = evaluateExecutiveJournalRuntimePolicy(policyRequest());
  const enforcementReq: ExecutiveJournalRuntimeEnforcementRequest = Object
    .freeze({
      requestId: decision.requestId,
      policyDecision: decision,
      operation: "Propose",
      actorId: "actor-1",
      actorKind: "Human",
      authorityRef: "authority-1",
      authorityStatus: "Active",
      purpose: decision.purpose,
      targetJournalId: "RTC-JRN-00000001",
      targetEntityKind: "Intent",
      targetEntityId: decision.targetId,
      proposedEffect: "record-intent",
      lifecycleState: "Proposed",
      recordCategory: "ExecutiveRecord",
      classification: "internal",
      validationOutcome: "Valid",
      evidenceRefs: Object.freeze([...decision.evidenceRefs]),
      predecessorRef: null,
      affectedRef: null,
      retentionPolicyRef: null,
      dispositionPolicyRef: null,
      exportPolicyRef: null,
      confirmationEvidence: null,
      requiresUnresolvedOpenIssueDefault: false,
    });
  const enforcement = planExecutiveJournalRuntimeEnforcement(enforcementReq);
  assert.equal(enforcement.kind, "Enforceable");
  assert.ok(enforcement.plan);
  const intentReq: ExecutiveJournalRuntimeExecutionIntentRequest = Object.freeze(
    {
      requestId: enforcement.plan.requestId,
      enforcementResult: enforcement,
      policyDecisionCode: enforcement.plan.policyDecisionCode,
      policyVersion: enforcement.plan.policyVersion,
      validationOutcome: "Valid",
      actorId: enforcement.plan.actorId,
      actorKind: "Human",
      authorityRef: enforcement.plan.authorityRef,
      purpose: enforcement.plan.purpose,
      targetJournalId: enforcement.plan.targetJournalId,
      operation: enforcement.plan.operation,
      expectedJournalSequence: 7,
      idempotencyKey: "idem-1",
      commandDigest: "digest-1",
      proposedEvents: Object.freeze([proposedEvent()]),
      evidenceRefs: Object.freeze([...enforcement.plan.requiredEvidence]),
      privacyCategory: enforcement.plan.privacyCategory,
      classification: enforcement.plan.classification,
      lifecyclePrecondition: enforcement.plan.lifecyclePrecondition,
      expectedLifecycleResult: enforcement.plan.resultingLifecycleState,
      confirmationEvidence: null,
      requiresUnresolvedOpenIssueDefault: false,
      requestsInPlaceMutation: false,
      requestsHistoricalOverwrite: false,
      requestsHistoricalDeletion: false,
      requestsSequenceReuse: false,
    },
  );
  const intentResult = constructExecutiveJournalRuntimeExecutionIntent(
    intentReq,
  );
  assert.equal(intentResult.kind, "Executable");
  const intent = intentResult.intent;
  const outcome: ExecutiveJournalRuntimeExecutionOutcomeEvidence = Object.freeze(
    {
      outcomeKind: "Committed",
      durableCommitEvidence: "commit-ev-1",
      acceptedEventRefs: Object.freeze(["accepted-1"]),
      allocatedSequence: "7-7",
      integrityEvidenceRef: "integrity-1",
      idempotencyRecordRef: "idem-rec-1",
      atomicBoundaryEvidence: "atomic-1",
      outboxEvidenceRef: "outbox-1",
      expectedSequence: 7,
      observedSequence: null,
      conflictCode: null,
      idempotencyConflict: false,
      priorCommandDigest: null,
      failureCode: null,
      provesNoAcceptedEffect: false,
      uncertain: false,
      partialCommit: false,
      recoveryInstructionCode: null,
    },
  );
  const receipt = createExecutiveJournalRuntimeExecutionReceipt(intent, outcome);
  assert.equal(receipt.kind, "Committed");
  return Object.freeze({ intent, receipt });
};

const mutateFrozen = (value: object): boolean => {
  try {
    Reflect.set(value, "__mutation_probe__", true);
    return Reflect.has(value, "__mutation_probe__");
  } catch {
    return false;
  }
};

describe("RTC-2:8 Executive Journal Runtime Reconciliation & Assurance", () => {
  it("1-4: exact identity, namespace, status, and ReadyForCertification readiness", () => {
    assert.equal(RTC28_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC28_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      ExecutiveJournalRuntimeAssuranceId,
      "RTC-2:8/ExecutiveJournalRuntimeReconciliationAssurance",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssuranceNamespace,
      "nexora.rtc.executive.journal.assurance",
    );
    assert.equal(ExecutiveJournalRuntimeAssuranceStatus, "Assurance");
    assert.notEqual(ExecutiveJournalRuntimeAssuranceStatus, "Freeze");
    assert.equal(
      ExecutiveJournalRuntimeAssuranceReadiness,
      "ReadyForCertification",
    );
    assert.equal(ExecutiveJournalRuntimeAssuranceVersion, "1.0.0");
    assert.equal(
      ExecutiveJournalRuntimeAssuranceName,
      "Executive Journal Runtime Reconciliation & Assurance",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurancePreviousPhase,
      "RTC-2:7 — Executive Journal Runtime Execution Contract",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.previousPhase,
      "RTC-2:7 — Executive Journal Runtime Execution Contract",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.nextPhase,
      "RTC-2:9 — Executive Journal Runtime Certification & Release Readiness",
    );
    assert.equal(ExecutiveJournalRuntimeAssurance.freezePhase, false);
    assert.equal(ExecutiveJournalRuntimeAssurance.assurancePhase, true);
    assert.ok("assessExecutiveJournalRuntimeAssurance" in AssuranceModule);
  });

  it("5-6: imports RTC-2:7 by reference and preserves upstream chain", () => {
    assert.equal(
      ExecutiveJournalRuntimeAssurance.execution,
      ExecutiveJournalRuntimeExecution,
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.upstreamChain.execution,
      "RTC-2:7/ExecutiveJournalRuntimeExecutionContract",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.upstreamChain.enforcement,
      "RTC-2:6/ExecutiveJournalRuntimePolicyEnforcement",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.upstreamChain.policy,
      "RTC-2:5/ExecutiveJournalRuntimePolicy",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.upstreamChain.validation,
      "RTC-2:4/ExecutiveJournalRuntimeValidation",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.upstreamChain.model,
      "RTC-2:3/ExecutiveJournalRuntimeModel",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.upstreamChain.registry,
      "RTC-2:2/ExecutiveJournalRuntimeRegistry",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.upstreamChain.foundation,
      "RTC-2:1/ExecutiveJournalRuntimeFoundation",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.aiMustNot,
      ExecutiveJournalRuntimeExecution.aiMustNot,
    );
    assert.equal(
      ExecutiveJournalRuntimeExecution.readiness,
      "ReadyForAssurance",
    );
  });

  it("7-11: reconciled/invalid/divergent/indeterminate and precedence", () => {
    const { intent, receipt } = buildExecutable();
    const reconciled = reconcileExecutiveJournalRuntimeIntentReceipt(
      intent,
      receipt,
    );
    assert.equal(reconciled.kind, "Reconciled");
    assert.equal(isExecutiveJournalRuntimeReconciled(reconciled), true);

    const malformed = reconcileExecutiveJournalRuntimeEvidenceBundle(
      Object.freeze({
        bundleId: "bad",
        intent: null,
        receipt: null,
        enforcementPlanId: null,
        policyDecisionCode: null,
        validationOutcome: null,
        requestId: null,
        idempotencyKey: null,
        commandDigest: null,
        targetJournalId: null,
        expectedJournalSequence: null,
        reportedSequenceRange: null,
        eventBatchDigest: null,
        proposedEventRefs: Object.freeze([]),
        acceptedEventRefs: Object.freeze([]),
        allocatedSequences: Object.freeze([]),
        atomicCommitEvidence: null,
        idempotencyRecordEvidence: null,
        integrityEvidence: null,
        previousEventDigestRef: null,
        batchDigestEvidence: null,
        writerSignatureEvidenceRef: null,
        keyVersionRef: null,
        integrityVerificationResult: null,
        outboxEvidence: null,
        projection: null,
        replay: null,
        recovery: null,
        privacyCategory: null,
        classification: null,
        authorityRef: null,
        confirmationEvidenceRef: null,
        confirmationReused: false,
        confirmationActorKind: null,
        actorKind: null,
        operation: null,
        disclosureEvidenceRef: null,
        exportEvidenceRef: null,
        exportFormatSelected: false,
        retentionEvidenceRef: null,
        retentionPeriodSelected: false,
        dispositionEvidenceRef: null,
        governanceEventRef: null,
        predecessorRef: null,
        disputeRef: null,
        affectedHistoricalRef: null,
        appendOnlyViolation: false,
        inPlaceCorrection: false,
        historicalOverwrite: false,
        historicalDeletion: false,
        sequenceReuse: false,
        duplicateCommittedEffect: false,
        partialCommit: false,
        crossJournalBatch: false,
        aiSatisfiedConfirmation: false,
        aiCreatedAuthority: false,
        aiClosedCommitment: false,
        aiDisclosedOrExported: false,
        aiRetentionOrDisposition: false,
        privateInSharedSearch: false,
        privateInSharedProjection: false,
        privateExported: false,
        privatePromotionValid: null,
        telemetryContainsPayload: false,
        requiresUnresolvedOpenIssueDefault: false,
        externalSequenceHistoryPresent: false,
        metadataOnly: true as const,
        immutable: true as const,
        containsPayload: false as const,
      }),
    );
    assert.equal(malformed.kind, "Invalid");

    const divergent = reconcileExecutiveJournalRuntimeIntentReceipt(
      intent,
      receipt,
      { appendOnlyViolation: true },
    );
    assert.equal(divergent.kind, "Divergent");

    const indeterminate = reconcileExecutiveJournalRuntimeIntentReceipt(
      intent,
      receipt,
      {
        atomicCommitEvidence: null,
        idempotencyRecordEvidence: null,
        integrityEvidence: null,
        reportedSequenceRange: null,
        acceptedEventRefs: Object.freeze([]),
        allocatedSequences: Object.freeze([]),
        externalSequenceHistoryPresent: false,
        outboxEvidence: null,
      },
    );
    assert.equal(indeterminate.kind, "Indeterminate");

    assert.deepEqual(
      [...ExecutiveJournalRuntimeAssurance.lifecycle.precedence],
      ["Invalid", "Divergent", "Indeterminate", "Reconciled"],
    );
    const mixed = reconcileExecutiveJournalRuntimeIntentReceipt(
      intent,
      receipt,
      {
        appendOnlyViolation: true,
        exportFormatSelected: true,
      },
    );
    assert.equal(mixed.kind, "Invalid");
  });

  it("12-16: binding mismatches for intent, policy, enforcement, request, authority", () => {
    const { intent, receipt } = buildExecutable();
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        // force receipt mismatch via synthetic receipt overlay path:
      }).kind,
      "Reconciled",
    );
    const badReceipt = Object.freeze({
      ...receipt,
      intentId: "other-intent",
    });
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, badReceipt).kind,
      "Divergent",
    );
    assert.ok(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, badReceipt)
        .findings
        .some((item) => item.findingCode === "ASR-INTENT-RECEIPT-MISMATCH"),
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        policyDecisionCode: "other-policy",
      }).findings.some((item) => item.findingCode === "ASR-POLICY-MISMATCH"),
      true,
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        enforcementPlanId: "other-plan",
      }).findings.some((item) =>
        item.findingCode === "ASR-ENFORCEMENT-MISMATCH"
      ),
      true,
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        requestId: "other-req",
      }).findings.some((item) => item.findingCode === "ASR-REQUEST-MISMATCH"),
      true,
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        authorityRef: "other-authority",
      }).findings.some((item) => item.findingCode === "ASR-AUTHORITY-MISMATCH"),
      true,
    );
  });

  it("17-19: idempotency key/digest and duplicate committed effect", () => {
    const { intent, receipt } = buildExecutable();
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        idempotencyKey: "other-key",
      }).findings.some((item) =>
        item.findingCode === "ASR-IDEMPOTENCY-KEY-MISMATCH"
      ),
      true,
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        commandDigest: "other-digest",
      }).findings.some((item) => item.findingCode === "ASR-DIGEST-MISMATCH"),
      true,
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        duplicateCommittedEffect: true,
      }).kind,
      "Divergent",
    );
  });

  it("20-25: sequence/batch/atomicity detections", () => {
    const { intent, receipt } = buildExecutable();
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        allocatedSequences: Object.freeze([7, 9]),
      }).findings.some((item) => item.findingCode === "ASR-SEQUENCE-GAP"),
      true,
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        allocatedSequences: Object.freeze([7, 7]),
      }).findings.some((item) => item.findingCode === "ASR-DUPLICATE-SEQUENCE"),
      true,
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        sequenceReuse: true,
      }).kind,
      "Divergent",
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        crossJournalBatch: true,
      }).kind,
      "Divergent",
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        allocatedSequences: Object.freeze([7, 8]),
        acceptedEventRefs: Object.freeze(["accepted-1"]),
        proposedEventRefs: Object.freeze(["event-desc-1", "event-desc-2"]),
      }).findings.some((item) =>
        item.findingCode === "ASR-BATCH-COUNT-MISMATCH"
        || item.findingCode === "ASR-ACCEPTED-COUNT"
      ),
      true,
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        partialCommit: true,
      }).kind,
      "Divergent",
    );
  });

  it("26-29: commit evidence, failed, indeterminate, integrity", () => {
    const { intent, receipt } = buildExecutable();
    const missingCommit = reconcileExecutiveJournalRuntimeIntentReceipt(
      intent,
      receipt,
      {
        atomicCommitEvidence: null,
        idempotencyRecordEvidence: null,
        integrityEvidence: null,
        reportedSequenceRange: null,
        acceptedEventRefs: Object.freeze([]),
        allocatedSequences: Object.freeze([]),
        externalSequenceHistoryPresent: false,
        outboxEvidence: null,
      },
    );
    assert.equal(missingCommit.kind, "Indeterminate");

    const failedReceipt = createExecutiveJournalRuntimeExecutionReceipt(
      intent,
      Object.freeze({
        outcomeKind: "Failed",
        durableCommitEvidence: null,
        acceptedEventRefs: Object.freeze([]),
        allocatedSequence: null,
        integrityEvidenceRef: null,
        idempotencyRecordRef: null,
        atomicBoundaryEvidence: null,
        outboxEvidenceRef: null,
        expectedSequence: 7,
        observedSequence: null,
        conflictCode: null,
        idempotencyConflict: false,
        priorCommandDigest: null,
        failureCode: "EXEC-FAILED",
        provesNoAcceptedEffect: true,
        uncertain: false,
        partialCommit: false,
        recoveryInstructionCode: null,
      }),
    );
    assert.equal(failedReceipt.kind, "Failed");
    const failed = reconcileExecutiveJournalRuntimeIntentReceipt(
      intent,
      failedReceipt,
      {
        acceptedEventRefs: Object.freeze([]),
        allocatedSequences: Object.freeze([]),
        atomicCommitEvidence: null,
        idempotencyRecordEvidence: null,
        integrityEvidence: null,
        outboxEvidence: null,
        previousEventDigestRef: null,
        batchDigestEvidence: null,
        writerSignatureEvidenceRef: null,
        keyVersionRef: null,
        integrityVerificationResult: null,
        reportedSequenceRange: null,
      },
    );
    assert.equal(failed.kind, "Reconciled");
    assert.ok(failedReceipt.provesNoAcceptedEffect);
    assert.equal(failedReceipt.kind, "Failed");

    const indeterminateReceipt = createExecutiveJournalRuntimeExecutionReceipt(
      intent,
      Object.freeze({
        outcomeKind: "Indeterminate",
        durableCommitEvidence: null,
        acceptedEventRefs: Object.freeze([]),
        allocatedSequence: null,
        integrityEvidenceRef: null,
        idempotencyRecordRef: null,
        atomicBoundaryEvidence: null,
        outboxEvidenceRef: null,
        expectedSequence: 7,
        observedSequence: null,
        conflictCode: null,
        idempotencyConflict: false,
        priorCommandDigest: null,
        failureCode: null,
        provesNoAcceptedEffect: false,
        uncertain: true,
        partialCommit: false,
        recoveryInstructionCode: "RECONCILE_SAME_IDEMPOTENCY_KEY",
      }),
    );
    assert.equal(indeterminateReceipt.kind, "Indeterminate");
    const uncertain = reconcileExecutiveJournalRuntimeIntentReceipt(
      intent,
      indeterminateReceipt,
      {
        acceptedEventRefs: Object.freeze([]),
        allocatedSequences: Object.freeze([]),
        atomicCommitEvidence: null,
        outboxEvidence: null,
        integrityEvidence: null,
        previousEventDigestRef: null,
        batchDigestEvidence: null,
        writerSignatureEvidenceRef: null,
        keyVersionRef: null,
        integrityVerificationResult: null,
        reportedSequenceRange: null,
        idempotencyRecordEvidence: null,
      },
    );
    assert.notEqual(uncertain.kind, "Reconciled");

    const missingIntegrity = reconcileExecutiveJournalRuntimeIntentReceipt(
      intent,
      receipt,
      {
        previousEventDigestRef: null,
        writerSignatureEvidenceRef: null,
        keyVersionRef: null,
        integrityVerificationResult: null,
        batchDigestEvidence: null,
      },
    );
    assert.ok(
      missingIntegrity.findings.some((item) =>
        item.findingCode === "ASR-MISSING-INTEGRITY"
      ),
    );
  });

  it("30-32: append-only, correction, supersession detections", () => {
    const { intent, receipt } = buildExecutable();
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        inPlaceCorrection: true,
      }).kind,
      "Divergent",
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        operation: "Correct",
        affectedHistoricalRef: null,
      }).findings.some((item) => item.findingCode === "ASR-CORRECTION-REF"),
      true,
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        operation: "Supersede",
        predecessorRef: null,
      }).findings.some((item) => item.findingCode === "ASR-SUPERSESSION-REF"),
      true,
    );
  });

  it("33-37: AI boundary failures", () => {
    const { intent, receipt } = buildExecutable();
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        aiSatisfiedConfirmation: true,
      }).kind,
      "Divergent",
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        aiCreatedAuthority: true,
      }).kind,
      "Divergent",
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        aiClosedCommitment: true,
      }).kind,
      "Divergent",
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        aiDisclosedOrExported: true,
      }).kind,
      "Divergent",
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        aiRetentionOrDisposition: true,
      }).kind,
      "Divergent",
    );
  });

  it("38-41: private reflection boundaries and valid promotion", () => {
    const { intent, receipt } = buildExecutable();
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        privateInSharedSearch: true,
      }).kind,
      "Divergent",
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        privateInSharedProjection: true,
      }).kind,
      "Divergent",
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        privateExported: true,
      }).kind,
      "Divergent",
    );
    const promotion = reconcileExecutiveJournalRuntimeIntentReceipt(
      intent,
      receipt,
      {
        operation: "PromotePrivateReflection",
        privacyCategory: "PrivateReflection",
        privatePromotionValid: true,
        confirmationEvidenceRef: "conf-1",
        confirmationActorKind: "Human",
      },
    );
    assert.equal(promotion.kind, "Reconciled");
  });

  it("42-44: disclosure, export format, retention period", () => {
    const { intent, receipt } = buildExecutable();
    assert.ok(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        operation: "Disclose",
        disclosureEvidenceRef: null,
      }).findings.some((item) =>
        item.findingCode === "ASR-DISCLOSURE-EVIDENCE"
      ),
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        exportFormatSelected: true,
      }).kind,
      "Invalid",
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        retentionPeriodSelected: true,
      }).kind,
      "Invalid",
    );
  });

  it("45-48: projection, replay, recovery, telemetry", () => {
    const { intent, receipt } = buildExecutable();
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        projection: Object.freeze({
          projectorId: "proj-1",
          projectorVersion: "1.0.0",
          sourceJournalId: intent.targetJournalId,
          sourceSequencePosition: 7,
          producingEventRefs: Object.freeze(["accepted-1"]),
          checkpointId: "cp-1",
          reconciliationDigest: "rd-1",
          hasProvenance: false,
        }),
      }).kind,
      "Divergent",
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        replay: Object.freeze({
          restoredRange: "7-7",
          sequenceContinuityOk: false,
          acceptedEventCount: 1,
          integrityVerificationResult: "ok",
          projectorId: "proj-1",
          projectorVersion: "1.0.0",
          projectionReconciliationOk: true,
          accessControlProbeOk: true,
          provenanceProbeOk: true,
          residualRiskRefs: Object.freeze([]),
        }),
      }).kind,
      "Divergent",
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        recovery: Object.freeze({
          restoredRange: "7-7",
          sequenceContinuityOk: true,
          acceptedEventCount: 1,
          integrityVerificationResult: "ok",
          projectorId: "proj-1",
          projectorVersion: "1.0.0",
          projectionReconciliationOk: false,
          accessControlProbeOk: true,
          provenanceProbeOk: true,
          residualRiskRefs: Object.freeze(["risk-1"]),
        }),
      }).kind,
      "Divergent",
    );
    assert.equal(
      reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
        telemetryContainsPayload: true,
      }).kind,
      "Divergent",
    );
  });

  it("49-52: ordering, determinism, immutability", () => {
    const { intent, receipt } = buildExecutable();
    const a = reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
      appendOnlyViolation: true,
      aiCreatedAuthority: true,
      privateExported: true,
    });
    const b = reconcileExecutiveJournalRuntimeIntentReceipt(intent, receipt, {
      appendOnlyViolation: true,
      aiCreatedAuthority: true,
      privateExported: true,
    });
    assert.deepEqual(a, b);
    const keys = a.findings.map((item) => item.orderingKey);
    assert.deepEqual(keys, [...keys].sort());
    const findings = getExecutiveJournalRuntimeAssuranceFindings(a);
    assert.equal(findings, a.findings);
    assert.equal(mutateFrozen(a), false);
    assert.equal(mutateFrozen(a.findings), false);

    const inputBundle: ExecutiveJournalRuntimeAssuranceEvidenceBundle = Object
      .freeze({
        bundleId: "bundle-mut",
        intent,
        receipt,
        enforcementPlanId: intent.enforcementPlanId,
        policyDecisionCode: intent.policyDecisionCode,
        validationOutcome: "Valid",
        requestId: intent.requestId,
        idempotencyKey: intent.idempotencyKey,
        commandDigest: intent.commandDigest,
        targetJournalId: intent.targetJournalId,
        expectedJournalSequence: intent.expectedJournalSequence,
        reportedSequenceRange: receipt.kind === "Committed"
          ? receipt.allocatedSequence
          : null,
        eventBatchDigest: intent.eventBatchDigest,
        proposedEventRefs: Object.freeze(["event-desc-1"]),
        acceptedEventRefs: Object.freeze(["accepted-1"]),
        allocatedSequences: Object.freeze([7]),
        atomicCommitEvidence: "atomic-1",
        idempotencyRecordEvidence: "idem-rec-1",
        integrityEvidence: "integrity-1",
        previousEventDigestRef: "prev-digest-1",
        batchDigestEvidence: intent.eventBatchDigest,
        writerSignatureEvidenceRef: "writer-sig-1",
        keyVersionRef: "key-v1",
        integrityVerificationResult: "integrity-ok",
        outboxEvidence: "outbox-1",
        projection: null,
        replay: null,
        recovery: null,
        privacyCategory: intent.privacyCategory,
        classification: intent.classification,
        authorityRef: intent.authorityRef,
        confirmationEvidenceRef: null,
        confirmationReused: false,
        confirmationActorKind: null,
        actorKind: "Human",
        operation: intent.operation,
        disclosureEvidenceRef: null,
        exportEvidenceRef: null,
        exportFormatSelected: false,
        retentionEvidenceRef: null,
        retentionPeriodSelected: false,
        dispositionEvidenceRef: null,
        governanceEventRef: null,
        predecessorRef: null,
        disputeRef: null,
        affectedHistoricalRef: null,
        appendOnlyViolation: false,
        inPlaceCorrection: false,
        historicalOverwrite: false,
        historicalDeletion: false,
        sequenceReuse: false,
        duplicateCommittedEffect: false,
        partialCommit: false,
        crossJournalBatch: false,
        aiSatisfiedConfirmation: false,
        aiCreatedAuthority: false,
        aiClosedCommitment: false,
        aiDisclosedOrExported: false,
        aiRetentionOrDisposition: false,
        privateInSharedSearch: false,
        privateInSharedProjection: false,
        privateExported: false,
        privatePromotionValid: null,
        telemetryContainsPayload: false,
        requiresUnresolvedOpenIssueDefault: false,
        externalSequenceHistoryPresent: true,
        metadataOnly: true as const,
        immutable: true as const,
        containsPayload: false as const,
      });
    const before = JSON.stringify(inputBundle);
    const assessed = assessExecutiveJournalRuntimeAssurance(inputBundle);
    assert.equal(JSON.stringify(inputBundle), before);
    assert.equal(assessed.kind, "Reconciled");
    assert.equal(
      mutateFrozen(getExecutiveJournalRuntimeAssuranceSummary()),
      false,
    );
    assert.equal(mutateFrozen(ExecutiveJournalRuntimeAssurance), false);
  });

  it("53: OI-01 through OI-06 remain unresolved", () => {
    const ids = ExecutiveJournalRuntimeAssurance.openIssues.map(
      (item) => item.issueId,
    );
    assert.deepEqual(ids, [
      "OI-01",
      "OI-02",
      "OI-03",
      "OI-04",
      "OI-05",
      "OI-06",
    ]);
    assert.ok(
      ExecutiveJournalRuntimeAssurance.openIssues.every(
        (item) => item.resolved === false && item.resolvedByAssurance === false,
      ),
    );
    const { intent, receipt } = buildExecutable();
    const openIssue = reconcileExecutiveJournalRuntimeIntentReceipt(
      intent,
      receipt,
      { requiresUnresolvedOpenIssueDefault: true },
    );
    assert.equal(openIssue.kind, "Indeterminate");
  });

  it("54: no prohibited imports exist in RTC-2:8 files", () => {
    for (const file of RTC28_FILES) {
      if (file.endsWith(".test.ts")) {
        continue;
      }
      const source = readFileSync(`${HERE}/${file}`, "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.equal(
          pattern.test(source),
          false,
          `${file} matches prohibited import ${pattern}`,
        );
      }
    }
    const aggregate = readFileSync(
      `${HERE}/executiveJournalRuntimeAssurance.ts`,
      "utf8",
    );
    assert.ok(
      aggregate.includes('from "./executiveJournalRuntimeExecution.ts"'),
    );
    assert.ok(
      !aggregate.includes('from "./executiveJournalRuntimeEnforcement.ts"'),
    );
  });

  it("55: rule catalogue complete; evaluate-only aggregate", () => {
    assert.equal(validateExecutiveJournalAssuranceRuleCatalogue(), true);
    assert.equal(ExecutiveJournalRuntimeAssurance.evaluatesOnly, true);
    assert.equal(ExecutiveJournalRuntimeAssurance.repairsEvidence, false);
    assert.equal(ExecutiveJournalRuntimeAssurance.verifiesCryptography, false);
    assert.equal(ExecutiveJournalRuntimeAssurance.performsReplay, false);
  });
});
