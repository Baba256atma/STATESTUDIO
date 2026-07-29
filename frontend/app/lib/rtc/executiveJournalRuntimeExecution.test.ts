/**
 * RTC-2:7 — Executive Journal Runtime Execution Contract Tests.
 *
 * Deterministic coverage for fail-closed intent/receipt transforms.
 * No mocks. No randomness. No network. No databases. No execution.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { evaluateExecutiveJournalRuntimePolicy } from "./executiveJournalRuntimePolicy.ts";
import type { ExecutiveJournalRuntimePolicyRequest } from "./executiveJournalRuntimePolicyTypes.ts";
import {
  ExecutiveJournalRuntimeEnforcement,
  planExecutiveJournalRuntimeEnforcement,
} from "./executiveJournalRuntimeEnforcement.ts";
import type {
  ExecutiveJournalRuntimeEnforcementConfirmationEvidence,
  ExecutiveJournalRuntimeEnforcementPlan,
  ExecutiveJournalRuntimeEnforcementRequest,
  ExecutiveJournalRuntimeEnforcementResult,
} from "./executiveJournalRuntimeEnforcementTypes.ts";
import {
  ExecutiveContextRuntimeCertificationId,
  ExecutiveContextRuntimeCertificationNextPhase,
  ExecutiveContextRuntimeCertificationReadiness,
  ExecutiveContextRuntimeCertificationStatus,
} from "./executiveContextCertificationMetadata.ts";
import * as ExecutionModule from "./executiveJournalRuntimeExecution.ts";
import {
  compareExecutiveJournalRuntimeIdempotency,
  constructExecutiveJournalRuntimeExecutionIntent,
  createExecutiveJournalRuntimeExecutionReceipt,
  ExecutiveJournalRuntimeArchitectureDecisionAdrtc207,
  ExecutiveJournalRuntimeExecution,
  ExecutiveJournalRuntimeExecutionArchitectureDivergence,
  ExecutiveJournalRuntimeExecutionDecisions,
  ExecutiveJournalRuntimeExecutionId,
  ExecutiveJournalRuntimeExecutionName,
  ExecutiveJournalRuntimeExecutionNamespace,
  ExecutiveJournalRuntimeExecutionReadiness,
  ExecutiveJournalRuntimeExecutionStatus,
  ExecutiveJournalRuntimeExecutionVersion,
  getExecutiveJournalRuntimeExecutionSummary,
  isExecutiveJournalExecutionExecutable,
  isExecutiveJournalExecutionRejected,
} from "./executiveJournalRuntimeExecution.ts";
import type {
  ExecutiveJournalRuntimeExecutionConfirmationEvidence,
  ExecutiveJournalRuntimeExecutionIntentRequest,
  ExecutiveJournalRuntimeExecutionOutcomeEvidence,
  ExecutiveJournalRuntimeProposedEventDescriptor,
} from "./executiveJournalRuntimeExecutionTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC27_FILES = Object.freeze([
  "executiveJournalRuntimeExecution.ts",
  "executiveJournalRuntimeExecutionTypes.ts",
  "executiveJournalRuntimeExecutionIdentity.ts",
  "executiveJournalRuntimeExecutionLifecycle.ts",
  "executiveJournalRuntimeExecutionContracts.ts",
  "executiveJournalRuntimeExecutionRules.ts",
  "executiveJournalRuntimeExecutionMetadata.ts",
  "executiveJournalRuntimeExecution.test.ts",
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
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
]);

const validValidation = Object.freeze({
  outcome: "Valid" as const,
  valid: true,
  warningCount: 0,
  errorCount: 0,
});

const policyRequest = (
  overrides: Partial<ExecutiveJournalRuntimePolicyRequest>,
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
    validation: validValidation,
    retentionPolicyRef: null,
    dispositionPolicyRef: null,
    exportPolicyRef: null,
    dualControlRequired: false,
    ...overrides,
  });

const confirmationFor = (
  request: ExecutiveJournalRuntimeEnforcementRequest,
  overrides: Partial<ExecutiveJournalRuntimeEnforcementConfirmationEvidence> =
    {},
): ExecutiveJournalRuntimeEnforcementConfirmationEvidence =>
  Object.freeze({
    confirmationId: "conf-1",
    actorId: request.actorId,
    requestId: request.requestId,
    policyDecisionCode: request.policyDecision.decisionCode,
    policyVersion: request.policyDecision.policyVersion,
    targetId: request.targetEntityId,
    operation: request.operation,
    proposedEffect: request.proposedEffect,
    authorityRef: request.authorityRef ?? "",
    singleUse: true as const,
    expired: false,
    expiryMetadata: "expiry:upstream-authority",
    ...overrides,
  });

const enforcementRequest = (
  decision: ReturnType<typeof evaluateExecutiveJournalRuntimePolicy>,
  overrides: Partial<ExecutiveJournalRuntimeEnforcementRequest> = {},
): ExecutiveJournalRuntimeEnforcementRequest =>
  Object.freeze({
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
    ...overrides,
  });

type EnforceableEnforcementResult = Extract<
  ExecutiveJournalRuntimeEnforcementResult,
  { readonly kind: "Enforceable" }
>;

const enforceablePropose = (): EnforceableEnforcementResult => {
  const decision = evaluateExecutiveJournalRuntimePolicy(policyRequest({}));
  const result = planExecutiveJournalRuntimeEnforcement(
    enforcementRequest(decision),
  );
  if (result.kind !== "Enforceable") {
    assert.fail(`Expected Enforceable, received ${result.kind}`);
  }
  return result;
};

const enforceableWithPlan = (
  planOverrides: Partial<ExecutiveJournalRuntimeEnforcementPlan>,
): EnforceableEnforcementResult => {
  const base = enforceablePropose();
  return Object.freeze({
    kind: "Enforceable" as const,
    reasonCode: base.reasonCode,
    reason: base.reason,
    policyDecisionCode: base.policyDecisionCode,
    requestId: base.requestId,
    matchingRuleIds: base.matchingRuleIds,
    obligations: base.obligations,
    steps: base.steps,
    plan: Object.freeze({
      ...base.plan,
      ...planOverrides,
    }),
    revealsProtectedMetadata: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
    executes: false as const,
  });
};

const proposedEvent = (
  overrides: Partial<ExecutiveJournalRuntimeProposedEventDescriptor> = {},
): ExecutiveJournalRuntimeProposedEventDescriptor =>
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
    ...overrides,
  });

const intentRequest = (
  enforcementResult: EnforceableEnforcementResult,
  overrides: Partial<ExecutiveJournalRuntimeExecutionIntentRequest> = {},
): ExecutiveJournalRuntimeExecutionIntentRequest => {
  if (enforcementResult.kind !== "Enforceable") {
    assert.fail(`Expected Enforceable, received ${enforcementResult.kind}`);
  }
  const plan = enforcementResult.plan;
  return Object.freeze({
    requestId: plan.requestId,
    enforcementResult,
    policyDecisionCode: plan.policyDecisionCode,
    policyVersion: plan.policyVersion,
    validationOutcome: "Valid",
    actorId: plan.actorId,
    actorKind: "Human",
    authorityRef: plan.authorityRef,
    purpose: plan.purpose,
    targetJournalId: plan.targetJournalId,
    operation: plan.operation,
    expectedJournalSequence: 7,
    idempotencyKey: "idem-1",
    commandDigest: "digest-1",
    proposedEvents: Object.freeze([proposedEvent()]),
    evidenceRefs: Object.freeze([...plan.requiredEvidence]),
    privacyCategory: plan.privacyCategory,
    classification: plan.classification,
    lifecyclePrecondition: plan.lifecyclePrecondition,
    expectedLifecycleResult: plan.resultingLifecycleState,
    confirmationEvidence: null,
    requiresUnresolvedOpenIssueDefault: false,
    requestsInPlaceMutation: false,
    requestsHistoricalOverwrite: false,
    requestsHistoricalDeletion: false,
    requestsSequenceReuse: false,
    ...overrides,
  });
};

const executionConfirmation = (
  request: ExecutiveJournalRuntimeExecutionIntentRequest,
  overrides: Partial<ExecutiveJournalRuntimeExecutionConfirmationEvidence> =
    {},
): ExecutiveJournalRuntimeExecutionConfirmationEvidence =>
  Object.freeze({
    confirmationId: "conf-1",
    actorId: request.actorId,
    requestId: request.requestId,
    policyDecisionCode: request.policyDecisionCode,
    policyVersion: request.policyVersion,
    targetId: request.enforcementResult.kind === "Enforceable"
      ? request.enforcementResult.plan.targetEntityId
      : "unknown",
    operation: request.operation,
    proposedEffect: "confirmed-effect",
    authorityRef: request.authorityRef ?? "",
    singleUse: true as const,
    expired: false,
    expiryMetadata: "expiry:upstream-authority",
    reused: false,
    ...overrides,
  });

const outcome = (
  overrides: Partial<ExecutiveJournalRuntimeExecutionOutcomeEvidence> = {},
): ExecutiveJournalRuntimeExecutionOutcomeEvidence =>
  Object.freeze({
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
    ...overrides,
  });

const mutateFrozen = (value: object): boolean => {
  try {
    Reflect.set(value, "__mutation_probe__", true);
    return Reflect.has(value, "__mutation_probe__");
  } catch {
    return false;
  }
};

describe("RTC-2:7 Executive Journal Runtime Execution Contract", () => {
  it("1-4: exact identity, namespace, status, and ReadyForAssurance readiness", () => {
    assert.equal(RTC27_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC27_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      ExecutiveJournalRuntimeExecutionId,
      "RTC-2:7/ExecutiveJournalRuntimeExecutionContract",
    );
    assert.equal(
      ExecutiveJournalRuntimeExecutionNamespace,
      "nexora.rtc.executive.journal.execution",
    );
    assert.equal(ExecutiveJournalRuntimeExecutionStatus, "ExecutionContract");
    assert.equal(ExecutiveJournalRuntimeExecutionReadiness, "ReadyForAssurance");
    assert.notEqual(ExecutiveJournalRuntimeExecutionReadiness, "ReadyForFreeze");
    assert.equal(ExecutiveJournalRuntimeExecutionVersion, "1.0.0");
    assert.equal(
      ExecutiveJournalRuntimeExecutionName,
      "Executive Journal Runtime Execution Contract",
    );
    assert.equal(
      ExecutiveJournalRuntimeExecution.nextPhase,
      "RTC-2:8 — Executive Journal Runtime Reconciliation & Assurance",
    );
    assert.ok("constructExecutiveJournalRuntimeExecutionIntent" in ExecutionModule);
  });

  it("AD-RTC2-07: exists once, immutable, records intentional RTC-1:7 divergence", () => {
    const matches = ExecutiveJournalRuntimeExecutionDecisions.filter(
      (decision) => decision.decisionId === "AD-RTC2-07",
    );
    assert.equal(matches.length, 1);
    assert.equal(
      ExecutiveJournalRuntimeArchitectureDecisionAdrtc207.decisionId,
      "AD-RTC2-07",
    );
    assert.equal(
      ExecutiveJournalRuntimeArchitectureDecisionAdrtc207.title,
      "Retain RTC-2:7 as Executive Journal Runtime Execution Contract",
    );
    assert.ok(
      ExecutiveJournalRuntimeArchitectureDecisionAdrtc207.decision.includes(
        "intentionally diverges from the RTC-1:7 phase role",
      ),
    );
    assert.ok(
      ExecutiveJournalRuntimeArchitectureDecisionAdrtc207.decision.includes(
        "ReadyForAssurance, not ReadyForFreeze",
      ),
    );
    assert.equal(
      ExecutiveJournalRuntimeArchitectureDecisionAdrtc207.immutable,
      true,
    );
    assert.equal(
      mutateFrozen(ExecutiveJournalRuntimeArchitectureDecisionAdrtc207),
      false,
    );
    assert.equal(
      mutateFrozen(ExecutiveJournalRuntimeExecutionDecisions),
      false,
    );
    assert.equal(
      ExecutiveJournalRuntimeExecutionArchitectureDivergence,
      "Intentional architecture divergence governed by AD-RTC2-07",
    );
    assert.deepEqual(
      [...getExecutiveJournalRuntimeExecutionSummary().architectureDecisionIds],
      ["AD-RTC2-07"],
    );
    assert.deepEqual(
      [...ExecutiveJournalRuntimeExecution.metadata.architectureDecisionIds],
      ["AD-RTC2-07"],
    );
    assert.equal(
      ExecutiveContextRuntimeCertificationId,
      "RTC-1:7/ExecutiveContextRuntimeCertification",
    );
    assert.equal(
      ExecutiveContextRuntimeCertificationStatus,
      "Certification",
    );
    assert.equal(
      ExecutiveContextRuntimeCertificationReadiness,
      "ReadyForFreeze",
    );
    assert.equal(
      ExecutiveContextRuntimeCertificationNextPhase,
      "RTC-1:8 — Executive Context Runtime Freeze",
    );
  });

  it("5-6: imports RTC-2:6 by reference and preserves upstream chain", () => {
    assert.equal(
      ExecutiveJournalRuntimeExecution.enforcement,
      ExecutiveJournalRuntimeEnforcement,
    );
    assert.equal(
      ExecutiveJournalRuntimeExecution.upstreamChain.enforcement,
      "RTC-2:6/ExecutiveJournalRuntimePolicyEnforcement",
    );
    assert.equal(
      ExecutiveJournalRuntimeExecution.upstreamChain.policy,
      "RTC-2:5/ExecutiveJournalRuntimePolicy",
    );
    assert.equal(
      ExecutiveJournalRuntimeExecution.upstreamChain.validation,
      "RTC-2:4/ExecutiveJournalRuntimeValidation",
    );
    assert.equal(
      ExecutiveJournalRuntimeExecution.upstreamChain.model,
      "RTC-2:3/ExecutiveJournalRuntimeModel",
    );
    assert.equal(
      ExecutiveJournalRuntimeExecution.upstreamChain.registry,
      "RTC-2:2/ExecutiveJournalRuntimeRegistry",
    );
    assert.equal(
      ExecutiveJournalRuntimeExecution.upstreamChain.foundation,
      "RTC-2:1/ExecutiveJournalRuntimeFoundation",
    );
    assert.equal(
      ExecutiveJournalRuntimeExecution.aiMustNot,
      ExecutiveJournalRuntimeEnforcement.aiMustNot,
    );
    assert.equal(
      ExecutiveJournalRuntimeEnforcement.readiness,
      "ReadyForCertification",
    );
  });

  it("7-10: Blocked/Awaiting/unknown rejected; Enforceable produces Executable", () => {
    const denied = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({ operation: "Teleport" }),
    );
    const blocked = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(denied, { operation: "Teleport" }),
    );
    assert.equal(blocked.kind, "Blocked");
    const blockedResult = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose(), { enforcementResult: blocked }),
    );
    assert.equal(blockedResult.kind, "Rejected");
    assert.equal(isExecutiveJournalExecutionRejected(blockedResult), true);
    assert.equal(blockedResult.eventBatch.length, 0);

    const confirmDecision = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "Confirm",
        targetEntityKind: "Decision",
        targetEntityId: "decision-1",
        proposedEffect: "confirm-decision",
      }),
    );
    const awaiting = planExecutiveJournalRuntimeEnforcement(
      enforcementRequest(confirmDecision, {
        operation: "Confirm",
        targetEntityKind: "Decision",
        targetEntityId: "decision-1",
        proposedEffect: "confirm-decision",
      }),
    );
    assert.equal(awaiting.kind, "AwaitingConfirmation");
    const awaitingResult = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose(), { enforcementResult: awaiting }),
    );
    assert.equal(awaitingResult.kind, "Rejected");

    const baseForInvalidKind = enforceablePropose();
    const invalidKindRequest = Object.freeze({
      ...intentRequest(baseForInvalidKind),
      enforcementResult: Object.freeze(
        Object.assign({}, baseForInvalidKind, { kind: "Maybe" }),
      ),
    }) satisfies ExecutiveJournalRuntimeExecutionIntentRequest;
    const unknown = constructExecutiveJournalRuntimeExecutionIntent(
      invalidKindRequest,
    );
    assert.equal(unknown.kind, "Rejected");
    assert.equal(unknown.reasonCode, "EXEC-UNKNOWN-KIND");

    const executable = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose()),
    );
    assert.equal(executable.kind, "Executable");
    assert.equal(isExecutiveJournalExecutionExecutable(executable), true);
    assert.ok(executable.intent);
    assert.equal(executable.intent.executes, false);
  });

  it("11-15: missing/mismatched authority, policy, validation, idempotency rejected", () => {
    const base = enforceablePropose();
    assert.equal(
      constructExecutiveJournalRuntimeExecutionIntent(
        intentRequest(base, { authorityRef: null }),
      ).kind,
      "Rejected",
    );
    assert.equal(
      constructExecutiveJournalRuntimeExecutionIntent(
        intentRequest(base, { authorityRef: "other-authority" }),
      ).reasonCode,
      "EXEC-AUTHORITY-MISMATCH",
    );
    assert.equal(
      constructExecutiveJournalRuntimeExecutionIntent(
        intentRequest(base, { policyDecisionCode: "" }),
      ).reasonCode,
      "EXEC-MISSING-POLICY",
    );
    assert.equal(
      constructExecutiveJournalRuntimeExecutionIntent(
        intentRequest(base, { validationOutcome: "Missing" }),
      ).reasonCode,
      "EXEC-MISSING-VALIDATION",
    );
    assert.equal(
      constructExecutiveJournalRuntimeExecutionIntent(
        intentRequest(base, { idempotencyKey: null }),
      ).reasonCode,
      "EXEC-MISSING-IDEMPOTENCY",
    );
  });

  it("16-19: idempotency same/different digest; missing sequence; no silent rebase", () => {
    const first = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose()),
    );
    const second = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose()),
    );
    assert.equal(first.kind, "Executable");
    assert.equal(second.kind, "Executable");
    if (first.kind === "Executable" && second.kind === "Executable") {
      assert.equal(
        compareExecutiveJournalRuntimeIdempotency(first.intent, second.intent),
        "Same",
      );
      const different = constructExecutiveJournalRuntimeExecutionIntent(
        intentRequest(enforceablePropose(), { commandDigest: "digest-2" }),
      );
      assert.equal(different.kind, "Executable");
      if (different.kind === "Executable") {
        assert.equal(
          compareExecutiveJournalRuntimeIdempotency(
            first.intent,
            different.intent,
          ),
          "Conflict",
        );
      }
      assert.equal(first.intent.expectedJournalSequence, 7);
      assert.notEqual(first.intent.expectedJournalSequence, 8);
    }
    assert.equal(
      constructExecutiveJournalRuntimeExecutionIntent(
        intentRequest(enforceablePropose(), { expectedJournalSequence: null }),
      ).reasonCode,
      "EXEC-MISSING-SEQUENCE",
    );
  });

  it("20-22: empty/multi-journal batch rejected; event ordering deterministic", () => {
    assert.equal(
      constructExecutiveJournalRuntimeExecutionIntent(
        intentRequest(enforceablePropose(), {
          proposedEvents: Object.freeze([]),
        }),
      ).reasonCode,
      "EXEC-EMPTY-BATCH",
    );
    assert.equal(
      constructExecutiveJournalRuntimeExecutionIntent(
        intentRequest(enforceablePropose(), {
          proposedEvents: Object.freeze([
            proposedEvent(),
            proposedEvent({
              eventIdDescriptor: "event-desc-2",
              journalId: "RTC-JRN-00000002",
              sequenceOffset: 1,
            }),
          ]),
        }),
      ).reasonCode,
      "EXEC-MULTI-JOURNAL",
    );
    const unordered = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose(), {
        proposedEvents: Object.freeze([
          proposedEvent({ sequenceOffset: 1, eventIdDescriptor: "b" }),
          proposedEvent({ sequenceOffset: 0, eventIdDescriptor: "a" }),
        ]),
      }),
    );
    assert.equal(unordered.reasonCode, "EXEC-EVENT-ORDER");

    const ordered = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose(), {
        proposedEvents: Object.freeze([
          proposedEvent({ sequenceOffset: 0, eventIdDescriptor: "a" }),
          proposedEvent({ sequenceOffset: 1, eventIdDescriptor: "b" }),
        ]),
      }),
    );
    assert.equal(ordered.kind, "Executable");
    if (ordered.kind === "Executable") {
      assert.deepEqual(
        ordered.intent.eventBatch.map((event) => event.sequenceOffset),
        [0, 1],
      );
    }
  });

  it("23-27: append-only, correction, supersession, dispute, disposition rules", () => {
    assert.equal(
      constructExecutiveJournalRuntimeExecutionIntent(
        intentRequest(enforceablePropose(), { requestsInPlaceMutation: true }),
      ).reasonCode,
      "EXEC-APPEND-ONLY",
    );

    const correction = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose(), {
        operation: "Correct",
        proposedEvents: Object.freeze([
          proposedEvent({
            eventType: "CorrectionAppended",
            eventIdDescriptor: "correction-1",
          }),
        ]),
        enforcementResult: enforceableWithPlan(Object.freeze({
          operation: "Correct",
        })),
      }),
    );
    assert.equal(correction.kind, "Executable");
    if (correction.kind === "Executable") {
      assert.equal(
        correction.intent.eventBatch[0]?.eventType,
        "CorrectionAppended",
      );
    }

    const supersedeMissing = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose(), {
        operation: "Supersede",
        proposedEvents: Object.freeze([
          proposedEvent({ eventType: "SupersessionAppended" }),
        ]),
        enforcementResult: enforceableWithPlan(Object.freeze({
          operation: "Supersede",
        })),
      }),
    );
    assert.equal(supersedeMissing.reasonCode, "EXEC-SUPERSESSION");

    const supersede = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose(), {
        operation: "Supersede",
        proposedEvents: Object.freeze([
          proposedEvent({
            eventType: "SupersessionAppended",
            predecessorRef: "decision-1",
          }),
        ]),
        enforcementResult: enforceableWithPlan(Object.freeze({
          operation: "Supersede",
        })),
      }),
    );
    assert.equal(supersede.kind, "Executable");

    const disputeMissing = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose(), {
        operation: "ResolveDispute",
        proposedEvents: Object.freeze([
          proposedEvent({ eventType: "DisputeResolved" }),
        ]),
        enforcementResult: enforceableWithPlan(Object.freeze({
          operation: "ResolveDispute",
        })),
      }),
    );
    assert.equal(disputeMissing.reasonCode, "EXEC-DISPUTE");

    const disposeMissing = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose(), {
        operation: "Dispose",
        evidenceRefs: Object.freeze([]),
        proposedEvents: Object.freeze([
          proposedEvent({ eventType: "RecordDisposed" }),
        ]),
        confirmationEvidence: executionConfirmation(
          intentRequest(enforceablePropose(), { operation: "Dispose" }),
        ),
        enforcementResult: enforceableWithPlan(Object.freeze({
          operation: "Dispose",
          targetEntityId: "intent-1",
        })),
      }),
    );
    assert.equal(disposeMissing.reasonCode, "EXEC-DISPOSITION");
  });

  it("28-32: receipt evidence rules for committed, failed, indeterminate", () => {
    const executable = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose()),
    );
    assert.equal(executable.kind, "Executable");
    if (executable.kind !== "Executable") {
      return;
    }
    const intent = executable.intent;

    const partial = createExecutiveJournalRuntimeExecutionReceipt(
      intent,
      outcome({ partialCommit: true, outcomeKind: "Committed" }),
    );
    assert.equal(partial.kind, "Indeterminate");

    const incomplete = createExecutiveJournalRuntimeExecutionReceipt(
      intent,
      outcome({
        durableCommitEvidence: null,
        outcomeKind: "Committed",
      }),
    );
    assert.equal(incomplete.kind, "Indeterminate");

    const committed = createExecutiveJournalRuntimeExecutionReceipt(
      intent,
      outcome(),
    );
    assert.equal(committed.kind, "Committed");
    if (committed.kind === "Committed") {
      assert.equal(committed.acceptedEventRefs.length, 1);
      assert.ok(committed.allocatedSequence);
    }

    const failedUnproven = createExecutiveJournalRuntimeExecutionReceipt(
      intent,
      outcome({
        outcomeKind: "Failed",
        provesNoAcceptedEffect: false,
        durableCommitEvidence: null,
        acceptedEventRefs: Object.freeze([]),
      }),
    );
    assert.equal(failedUnproven.kind, "Indeterminate");

    const failed = createExecutiveJournalRuntimeExecutionReceipt(
      intent,
      outcome({
        outcomeKind: "Failed",
        provesNoAcceptedEffect: true,
        failureCode: "EXEC-FAILED",
        durableCommitEvidence: null,
        acceptedEventRefs: Object.freeze([]),
        allocatedSequence: null,
        integrityEvidenceRef: null,
        idempotencyRecordRef: null,
        atomicBoundaryEvidence: null,
        outboxEvidenceRef: null,
      }),
    );
    assert.equal(failed.kind, "Failed");

    const indeterminate = createExecutiveJournalRuntimeExecutionReceipt(
      intent,
      outcome({
        outcomeKind: "Indeterminate",
        uncertain: true,
        durableCommitEvidence: null,
        acceptedEventRefs: Object.freeze([]),
        allocatedSequence: null,
        integrityEvidenceRef: null,
        idempotencyRecordRef: null,
        atomicBoundaryEvidence: null,
        outboxEvidenceRef: null,
        recoveryInstructionCode: "RECONCILE_SAME_IDEMPOTENCY_KEY",
      }),
    );
    assert.equal(indeterminate.kind, "Indeterminate");
    if (indeterminate.kind === "Indeterminate") {
      assert.equal(indeterminate.idempotencyKey, intent.idempotencyKey);
      assert.equal(indeterminate.retryRequiresSameIdempotencyKey, true);
      assert.equal(indeterminate.prohibitsNewIdempotencyKey, true);
      assert.equal(indeterminate.acceptedEventRefs.length, 0);
    }

    const conflict = createExecutiveJournalRuntimeExecutionReceipt(
      intent,
      outcome({
        outcomeKind: "Conflict",
        expectedSequence: 7,
        observedSequence: 9,
        conflictCode: "SEQUENCE_MISMATCH",
        durableCommitEvidence: null,
        acceptedEventRefs: Object.freeze([]),
        allocatedSequence: null,
        integrityEvidenceRef: null,
        idempotencyRecordRef: null,
        atomicBoundaryEvidence: null,
        outboxEvidenceRef: null,
      }),
    );
    assert.equal(conflict.kind, "Conflict");
    if (conflict.kind === "Conflict") {
      assert.equal(conflict.expectedSequence, 7);
      assert.equal(conflict.observedSequence, 9);
      assert.equal(conflict.revealsRestrictedContent, false);
    }
  });

  it("33-37: confirmation, AI, private reflection, and promotion boundaries", () => {
    const confirmDecision = evaluateExecutiveJournalRuntimePolicy(
      policyRequest({
        operation: "Confirm",
        targetEntityKind: "Decision",
        targetEntityId: "decision-1",
        proposedEffect: "confirm-decision",
      }),
    );
    const pending = enforcementRequest(confirmDecision, {
      operation: "Confirm",
      targetEntityKind: "Decision",
      targetEntityId: "decision-1",
      proposedEffect: "confirm-decision",
    });
    const enforceableConfirm = planExecutiveJournalRuntimeEnforcement(
      Object.freeze({
        ...pending,
        confirmationEvidence: confirmationFor(pending),
      }),
    );
    assert.equal(enforceableConfirm.kind, "Enforceable");

    const missingConfirmation = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceableConfirm, {
        operation: "Confirm",
        confirmationEvidence: null,
        proposedEvents: Object.freeze([
          proposedEvent({ eventType: "DecisionConfirmed" }),
        ]),
      }),
    );
    assert.equal(missingConfirmation.reasonCode, "EXEC-CONFIRMATION-MISSING");

    const mismatch = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceableConfirm, {
        operation: "Confirm",
        confirmationEvidence: executionConfirmation(
          intentRequest(enforceableConfirm, { operation: "Confirm" }),
          { actorId: "other-actor" },
        ),
        proposedEvents: Object.freeze([
          proposedEvent({ eventType: "DecisionConfirmed" }),
        ]),
      }),
    );
    assert.equal(mismatch.reasonCode, "EXEC-CONFIRMATION-MISMATCH");

    const ai = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceableConfirm, {
        operation: "Confirm",
        actorKind: "Ai",
        confirmationEvidence: executionConfirmation(
          intentRequest(enforceableConfirm, { operation: "Confirm" }),
        ),
        proposedEvents: Object.freeze([
          proposedEvent({ eventType: "DecisionConfirmed" }),
        ]),
      }),
    );
    assert.equal(ai.reasonCode, "EXEC-AI");

    for (const operation of [
      "CloseCommitment",
      "Disclose",
      "Export",
      "ApplyRetention",
      "Dispose",
    ] as const) {
      const result = constructExecutiveJournalRuntimeExecutionIntent(
        intentRequest(enforceablePropose(), {
          operation,
          actorKind: "Ai",
          confirmationEvidence: executionConfirmation(
            intentRequest(enforceablePropose(), { operation }),
          ),
          proposedEvents: Object.freeze([
            proposedEvent({
              eventType: `${operation}Event`,
              eventIdDescriptor: `ai-${operation}`,
            }),
          ]),
          enforcementResult: enforceableWithPlan(Object.freeze({
          operation,
        })),
          evidenceRefs: Object.freeze(["evidence-1"]),
        }),
      );
      assert.equal(result.reasonCode, "EXEC-AI", operation);
    }

    const privateSearch = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose(), {
        operation: "Search",
        privacyCategory: "PrivateReflection",
        proposedEvents: Object.freeze([
          proposedEvent({
            eventType: "SearchProjected",
            recordCategory: "PrivateReflection",
          }),
        ]),
        enforcementResult: enforceableWithPlan(Object.freeze({
          operation: "Search",
          privacyCategory: "PrivateReflection",
        })),
      }),
    );
    assert.equal(privateSearch.reasonCode, "EXEC-PRIVATE");

    const promote = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose(), {
        operation: "PromotePrivateReflection",
        privacyCategory: "PrivateReflection",
        confirmationEvidence: executionConfirmation(
          intentRequest(enforceablePropose(), {
            operation: "PromotePrivateReflection",
          }),
        ),
        proposedEvents: Object.freeze([
          proposedEvent({
            eventType: "SharedPromotionAppended",
            recordCategory: "ExecutiveRecord",
            causationRef: "private-1",
          }),
        ]),
        enforcementResult: enforceableWithPlan(Object.freeze({
          operation: "PromotePrivateReflection",
          privacyCategory: "PrivateReflection",
          targetEntityId: "intent-1",
        })),
      }),
    );
    assert.equal(promote.kind, "Executable");
    if (promote.kind === "Executable") {
      assert.equal(promote.intent.privacyCategory, "PrivateReflection");
      assert.equal(
        promote.intent.eventBatch[0]?.recordCategory,
        "ExecutiveRecord",
      );
      assert.equal(promote.intent.eventBatch[0]?.causationRef, "private-1");
    }
  });

  it("38-40: export format and retention period not selected; telemetry payload-free", () => {
    const exported = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose(), {
        operation: "Export",
        confirmationEvidence: executionConfirmation(
          intentRequest(enforceablePropose(), { operation: "Export" }),
        ),
        proposedEvents: Object.freeze([
          proposedEvent({ eventType: "ExportEvidencePrepared" }),
        ]),
        enforcementResult: enforceableWithPlan(Object.freeze({
          operation: "Export",
        })),
      }),
    );
    assert.equal(exported.kind, "Executable");
    if (exported.kind === "Executable") {
      assert.ok(!exported.intent.summary.toLowerCase().includes("pdf"));
      assert.ok(!JSON.stringify(exported.intent).includes("exportFormat"));
      assert.equal(exported.intent.telemetry.containsPayload, false);
    }

    const retention = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose(), {
        operation: "ApplyRetention",
        confirmationEvidence: executionConfirmation(
          intentRequest(enforceablePropose(), { operation: "ApplyRetention" }),
        ),
        proposedEvents: Object.freeze([
          proposedEvent({ eventType: "RetentionGovernanceAppended" }),
        ]),
        enforcementResult: enforceableWithPlan(Object.freeze({
          operation: "ApplyRetention",
        })),
      }),
    );
    assert.equal(retention.kind, "Executable");
    if (retention.kind === "Executable") {
      assert.ok(!JSON.stringify(retention.intent).includes("retentionPeriod"));
      assert.ok(!JSON.stringify(retention.intent).includes("days="));
    }
  });

  it("41-44: no input mutation, deterministic repeats, mutation-safe exports", () => {
    const input = intentRequest(enforceablePropose());
    const before = JSON.stringify(input);
    const first = constructExecutiveJournalRuntimeExecutionIntent(input);
    const second = constructExecutiveJournalRuntimeExecutionIntent(input);
    assert.equal(JSON.stringify(input), before);
    assert.deepEqual(first, second);
    assert.equal(mutateFrozen(first), false);
    if (first.kind === "Executable") {
      assert.equal(mutateFrozen(first.intent), false);
      const receiptInput = outcome();
      const receiptBefore = JSON.stringify(receiptInput);
      const receipt = createExecutiveJournalRuntimeExecutionReceipt(
        first.intent,
        receiptInput,
      );
      assert.equal(JSON.stringify(receiptInput), receiptBefore);
      assert.equal(mutateFrozen(receipt), false);
      const again = createExecutiveJournalRuntimeExecutionReceipt(
        first.intent,
        receiptInput,
      );
      assert.deepEqual(receipt, again);
    }
    assert.equal(
      mutateFrozen(getExecutiveJournalRuntimeExecutionSummary()),
      false,
    );
    assert.equal(mutateFrozen(ExecutiveJournalRuntimeExecution), false);
  });

  it("45: OI-01 through OI-06 remain unresolved", () => {
    const ids = ExecutiveJournalRuntimeExecution.openIssues.map(
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
      ExecutiveJournalRuntimeExecution.openIssues.every(
        (item) => item.resolved === false && item.resolvedByExecution === false,
      ),
    );
    const blockedOpenIssue = constructExecutiveJournalRuntimeExecutionIntent(
      intentRequest(enforceablePropose(), {
        requiresUnresolvedOpenIssueDefault: true,
      }),
    );
    assert.equal(blockedOpenIssue.kind, "Rejected");
    assert.equal(blockedOpenIssue.reasonCode, "EXEC-OPEN-ISSUE");
  });

  it("46: no prohibited imports exist in RTC-2:7 files", () => {
    for (const file of RTC27_FILES) {
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
      `${HERE}/executiveJournalRuntimeExecution.ts`,
      "utf8",
    );
    assert.ok(
      aggregate.includes('from "./executiveJournalRuntimeEnforcement.ts"'),
    );
    assert.ok(
      !aggregate.includes('from "./executiveJournalRuntimePolicy.ts"'),
    );
    assert.ok(
      !aggregate.includes('from "./executiveJournalRuntimeValidation.ts"'),
    );
  });

  it("47: contracts-only aggregate never executes intents", () => {
    assert.equal(ExecutiveJournalRuntimeExecution.executesIntents, false);
    assert.equal(ExecutiveJournalRuntimeExecution.contractsOnly, true);
    assert.equal(ExecutiveJournalRuntimeExecution.inventsOutcomes, false);
    assert.deepEqual(
      [...ExecutiveJournalRuntimeExecution.lifecycle.intentKinds],
      ["Rejected", "Executable"],
    );
    assert.deepEqual(
      [...ExecutiveJournalRuntimeExecution.lifecycle.receiptKinds],
      ["Committed", "Conflict", "Failed", "Indeterminate"],
    );
  });
});
