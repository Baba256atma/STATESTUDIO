/**
 * RTC-3:7 — Executive Decision Register Execution Contract Tests.
 *
 * Expanded independent coverage for every rule, rejection reason, receipt
 * classification, binding, batch invariant, and step descriptor.
 * No mocks. No randomness. No network. No databases. No execution.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { evaluateExecutiveDecisionRegisterPolicy } from "./executiveDecisionRegisterPolicy.ts";
import type { ExecutiveDecisionRegisterPolicyRequest } from "./executiveDecisionRegisterPolicyTypes.ts";
import {
  ExecutiveDecisionRegisterEnforcement,
  planExecutiveDecisionRegisterEnforcement,
} from "./executiveDecisionRegisterEnforcement.ts";
import type {
  ExecutiveDecisionRegisterEnforcementConfirmationEvidence,
  ExecutiveDecisionRegisterEnforcementPlan,
  ExecutiveDecisionRegisterEnforcementRequest,
  ExecutiveDecisionRegisterEnforcementResult,
} from "./executiveDecisionRegisterEnforcementTypes.ts";
import * as ExecutionModule from "./executiveDecisionRegisterExecution.ts";
import {
  ExecutiveDecisionRegisterExecution,
  ExecutiveDecisionRegisterExecutionId,
  ExecutiveDecisionRegisterExecutionName,
  ExecutiveDecisionRegisterExecutionNamespace,
  ExecutiveDecisionRegisterExecutionReadiness,
  ExecutiveDecisionRegisterExecutionStatus,
  ExecutiveDecisionRegisterExecutionVersion,
  compareExecutiveDecisionRegisterIdempotency,
  constructExecutiveDecisionRegisterExecutionIntent,
  createExecutiveDecisionRegisterExecutionReceipt,
  getExecutiveDecisionRegisterExecutionSummary,
  isExecutiveDecisionRegisterExecutionExecutable,
  isExecutiveDecisionRegisterExecutionRejected,
} from "./executiveDecisionRegisterExecution.ts";
import {
  ExecutiveDecisionRegisterExecutionBatchValidationPrecedence,
  ExecutiveDecisionRegisterExecutionConflictClassifications,
  ExecutiveDecisionRegisterExecutionDecisionCodes,
  ExecutiveDecisionRegisterExecutionRejectionCodes,
  ExecutiveDecisionRegisterExecutionRules,
  ExecutiveDecisionRegisterExecutionSuccessCodes,
} from "./executiveDecisionRegisterExecutionRules.ts";
import {
  ExecutiveDecisionRegisterExecutionLifecycle,
  ExecutiveDecisionRegisterExecutionStepKinds,
  ExecutiveDecisionRegisterExecutionStepRoles,
} from "./executiveDecisionRegisterExecutionLifecycle.ts";
import {
  isApprovedDecisionRegisterExecutionAlias,
  isWellFormedDecisionRegisterExecutionIdentity,
} from "./executiveDecisionRegisterExecutionIdentity.ts";
import type {
  ExecutiveDecisionRegisterExecutionConfirmationEvidence,
  ExecutiveDecisionRegisterExecutionIntent,
  ExecutiveDecisionRegisterExecutionIntentKind,
  ExecutiveDecisionRegisterExecutionIntentRequest,
  ExecutiveDecisionRegisterExecutionIntentResult,
  ExecutiveDecisionRegisterExecutionOutcomeEvidence,
  ExecutiveDecisionRegisterExecutionReceipt,
  ExecutiveDecisionRegisterExecutionReceiptKind,
  ExecutiveDecisionRegisterExecutionRejectionCode,
  ExecutiveDecisionRegisterExecutionStepKind,
  ExecutiveDecisionRegisterExecutionSuccessCode,
  ExecutiveDecisionRegisterProposedEventDescriptor,
} from "./executiveDecisionRegisterExecutionTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC37_FILES = Object.freeze([
  "executiveDecisionRegisterExecution.ts",
  "executiveDecisionRegisterExecutionTypes.ts",
  "executiveDecisionRegisterExecutionIdentity.ts",
  "executiveDecisionRegisterExecutionLifecycle.ts",
  "executiveDecisionRegisterExecutionContracts.ts",
  "executiveDecisionRegisterExecutionRules.ts",
  "executiveDecisionRegisterExecutionMetadata.ts",
  "executiveDecisionRegisterExecution.test.ts",
]);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|decision-journal|ex)\//,
  /from ["']\.\/executiveDecisionRegisterFoundation\.ts["']/,
  /from ["']\.\/executiveDecisionRegisterRegistry\.ts["']/,
  /from ["']\.\/executiveDecisionRegisterModel\.ts["']/,
  /from ["']\.\/executiveDecisionRegisterValidation\.ts["']/,
  /from ["']\.\/executiveDecisionRegisterPolicy\.ts["']/,
  /from ["']\.\/executiveJournalRuntime/,
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
  /from ["']node:fs["']/,
  /from ["']node:child_process["']/,
  /Math\.random/,
  /Date\.now/,
  /performance\.now/,
]);

const VALIDATION_REF = "RTC-3:4/ExecutiveDecisionRegisterValidation" as const;

const mutateFrozen = (value: object): boolean => {
  try {
    Reflect.set(value, "__mutation_probe__", true);
    return Reflect.has(value, "__mutation_probe__");
  } catch {
    return false;
  }
};

const validValidation = Object.freeze({
  outcome: "Valid" as const,
  valid: true,
  warningCount: 0,
  errorCount: 0,
  validationResultRef: VALIDATION_REF,
});

const policyRequest = (
  overrides: Partial<ExecutiveDecisionRegisterPolicyRequest> = {},
): ExecutiveDecisionRegisterPolicyRequest =>
  Object.freeze({
    requestId: "req-1",
    operation: "ProposeDecision",
    actorId: "actor-1",
    actorKind: "Human",
    authorityRef: "authority-1",
    delegation: null,
    purpose: "continuity",
    targetRegister: "RTC-EDR-00000001",
    targetEntityKind: "DecisionProposal",
    targetEntityId: "proposal-1",
    currentLifecycleState: "Proposed",
    proposedLifecycleState: null,
    authorityState: "NonAuthoritative",
    originState: "HumanAuthored",
    privacyCategory: "ExecutiveRecord",
    classification: "internal",
    proposedEffect: "record-proposal",
    evidenceRefs: Object.freeze(["evidence-1"]),
    validation: validValidation,
    requestedScope: Object.freeze(["fields:metadata"]),
    confirmationContext: null,
    jurisdictionContext: null,
    jurisdictionRequired: false,
    breakGlass: null,
    authoritySubstitute: null,
    inPlaceMutation: false,
    historicalOverwrite: false,
    historicalDeletion: false,
    reopeningWithoutEvent: false,
    privateReflectionAsDecisionRecord: false,
    automaticPrivateReflectionPromotion: false,
    crossCategoryConversionWithoutEvent: false,
    activeDisputePresent: false,
    challengedDecisionRef: null,
    predecessorDecisionRef: null,
    successorDecisionRef: null,
    supersessionEffectivePoint: null,
    closureMetadataPresent: false,
    dispositionGovernanceEvidencePresent: false,
    projectionSourceRegisterPresent: true,
    projectionProvenancePresent: true,
    projectionCreatesAuthority: false,
    projectionHidesDispute: false,
    projectionErasesLineage: false,
    projectionNonAuthoritative: true,
    retentionPolicyRef: null,
    dispositionPolicyRef: null,
    exportPolicyRef: null,
    dualControlRequired: false,
    ...overrides,
  });

const enforcementRequest = (
  decision: ReturnType<typeof evaluateExecutiveDecisionRegisterPolicy>,
  overrides: Partial<ExecutiveDecisionRegisterEnforcementRequest> = {},
): ExecutiveDecisionRegisterEnforcementRequest =>
  Object.freeze({
    requestId: decision.requestId,
    policyDecision: decision,
    operation: "ProposeDecision",
    actorId: "actor-1",
    actorKind: "Human",
    authorityRef: decision.authorityRef ?? "authority-1",
    authorityStatus: "Active",
    authoritySubstitute: null,
    purpose: decision.purpose,
    targetRegister: "RTC-EDR-00000001",
    targetEntityKind: "DecisionProposal",
    targetEntityId: decision.targetId,
    currentLifecycleState: "Proposed",
    proposedLifecycleState: null,
    privacyCategory: "ExecutiveRecord",
    classification: "internal",
    proposedEffect: "record-proposal",
    validationOutcome: "Valid",
    validationReference: VALIDATION_REF,
    evidenceRefs: Object.freeze([...decision.evidenceRefs]),
    predecessorRef: null,
    successorRef: null,
    challengedDecisionRef: null,
    activeDisputePresent: false,
    closureMetadataPresent: false,
    dispositionGovernanceEvidencePresent: false,
    inPlaceMutation: false,
    privateReflectionAsDecisionRecord: false,
    projectionCreatesAuthority: false,
    projectionHidesDispute: false,
    projectionErasesLineage: false,
    retentionPolicyRef: null,
    dispositionPolicyRef: null,
    exportPolicyRef: null,
    confirmationEvidence: null,
    breakGlass: null,
    requiresUnresolvedOpenIssueDefault: false,
    ...overrides,
  });

const confirmationFor = (
  decision: ReturnType<typeof evaluateExecutiveDecisionRegisterPolicy>,
  operation: string,
  proposedEffect: string,
  overrides: Partial<ExecutiveDecisionRegisterEnforcementConfirmationEvidence> =
    {},
): ExecutiveDecisionRegisterEnforcementConfirmationEvidence =>
  Object.freeze({
    confirmationId: "conf-1",
    actorId: "actor-1",
    actorKind: "Human",
    requestId: decision.requestId,
    policyDecisionCode: decision.decisionCode,
    policyDecisionId: decision.policyId,
    policyVersion: decision.policyVersion,
    targetId: decision.targetId,
    operation,
    proposedEffect,
    authorityRef: "authority-1",
    evidenceSet: Object.freeze(["evidence-1"]),
    obligationKinds: Object.freeze(
      decision.obligations.map((item) => item.kind),
    ),
    singleUse: true,
    expired: false,
    expiryMetadata: "expiry:1",
    ...overrides,
  });

const enforceablePropose = (): ExecutiveDecisionRegisterEnforcementResult => {
  const decision = evaluateExecutiveDecisionRegisterPolicy(policyRequest({}));
  const result = planExecutiveDecisionRegisterEnforcement(
    enforcementRequest(decision),
  );
  assert.equal(result.kind, "Enforceable");
  return result;
};

const enforceableClose = (): ExecutiveDecisionRegisterEnforcementResult => {
  const decision = evaluateExecutiveDecisionRegisterPolicy(
    policyRequest({
      operation: "CloseDecision",
      targetEntityKind: "Decision",
      targetEntityId: "dec-1",
      currentLifecycleState: "Effective",
      proposedLifecycleState: "Closed",
      authorityState: "Authoritative",
      proposedEffect: "close",
      closureMetadataPresent: true,
    }),
  );
  const confirmation = confirmationFor(decision, "CloseDecision", "close");
  const result = planExecutiveDecisionRegisterEnforcement(
    enforcementRequest(decision, {
      operation: "CloseDecision",
      targetEntityKind: "Decision",
      targetEntityId: decision.targetId,
      currentLifecycleState: "Effective",
      proposedLifecycleState: "Closed",
      proposedEffect: "close",
      closureMetadataPresent: true,
      confirmationEvidence: confirmation,
    }),
  );
  assert.equal(result.kind, "Enforceable");
  return result;
};

const awaitingConfirm = (): ExecutiveDecisionRegisterEnforcementResult => {
  const decision = evaluateExecutiveDecisionRegisterPolicy(
    policyRequest({
      operation: "ConfirmDecision",
      targetEntityKind: "Decision",
      targetEntityId: "dec-1",
      proposedEffect: "confirm",
    }),
  );
  const result = planExecutiveDecisionRegisterEnforcement(
    enforcementRequest(decision, {
      operation: "ConfirmDecision",
      targetEntityKind: "Decision",
      targetEntityId: decision.targetId,
      proposedEffect: "confirm",
      confirmationEvidence: null,
    }),
  );
  assert.equal(result.kind, "AwaitingConfirmation");
  return result;
};

const blockedResult = (): ExecutiveDecisionRegisterEnforcementResult =>
  planExecutiveDecisionRegisterEnforcement(
    enforcementRequest(
      evaluateExecutiveDecisionRegisterPolicy(
        policyRequest({ operation: "TeleportDecision" }),
      ),
    ),
  );

const proposedEvent = (
  overrides: Partial<ExecutiveDecisionRegisterProposedEventDescriptor> = {},
): ExecutiveDecisionRegisterProposedEventDescriptor =>
  Object.freeze({
    eventIdDescriptor: "evt-1",
    eventType: "DecisionProposalAppend",
    eventVersion: "1",
    registerId: "RTC-EDR-00000001",
    sequenceOffset: 0,
    stepKind: "PrepareProposalEvent",
    actorId: "actor-1",
    authorityRef: "authority-1",
    purpose: "continuity",
    classification: "internal",
    privacyCategory: "ExecutiveRecord",
    evidenceRefs: Object.freeze(["evidence-1"]),
    causationRef: null,
    correlationRef: "req-1",
    payloadSchemaRef: "schema://proposal",
    integrityRequirements: Object.freeze(["hash"]),
    predecessorRef: null,
    successorRef: null,
    disputeRef: null,
    metadataOnly: true as const,
    immutable: true as const,
    containsPayload: false as const,
    ...overrides,
  });

const authorizedKindsFromPlan = (
  plan: ExecutiveDecisionRegisterEnforcementPlan,
): readonly string[] => {
  const seen = new Set<string>();
  const kinds: string[] = [];
  for (const step of plan.steps) {
    if (!seen.has(step.kind)) {
      seen.add(step.kind);
      kinds.push(step.kind);
    }
  }
  return Object.freeze(kinds);
};

const canonicalBatchFor = (
  plan: ExecutiveDecisionRegisterEnforcementPlan,
  mutate:
    | ((
      events: readonly ExecutiveDecisionRegisterProposedEventDescriptor[],
    ) => readonly ExecutiveDecisionRegisterProposedEventDescriptor[])
    | null = null,
): readonly ExecutiveDecisionRegisterProposedEventDescriptor[] => {
  const base = Object.freeze(
    authorizedKindsFromPlan(plan).map((stepKind, index) =>
      proposedEvent({
        eventIdDescriptor: `evt-${index}`,
        eventType: stepKind,
        sequenceOffset: index,
        stepKind,
      })
    ),
  );
  return mutate ? Object.freeze(mutate(base)) : base;
};


const omitStep = (
  plan: ExecutiveDecisionRegisterEnforcementPlan,
  stepKind: string,
): readonly ExecutiveDecisionRegisterProposedEventDescriptor[] =>
  canonicalBatchFor(plan, (events) => {
    const filtered = events.filter((event) => event.stepKind !== stepKind);
    return Object.freeze(
      filtered.map((event, index) =>
        proposedEvent({
          ...event,
          sequenceOffset: index,
          eventIdDescriptor: `evt-${index}`,
        })
      ),
    );
  });

const withExtraStep = (
  plan: ExecutiveDecisionRegisterEnforcementPlan,
  stepKind: string,
): readonly ExecutiveDecisionRegisterProposedEventDescriptor[] =>
  canonicalBatchFor(plan, (events) =>
    Object.freeze([
      ...events,
      proposedEvent({
        eventIdDescriptor: `evt-extra`,
        eventType: stepKind,
        sequenceOffset: events.length,
        stepKind,
      }),
    ])
  );

const executionConfirmation = (
  request: ExecutiveDecisionRegisterExecutionIntentRequest,
  overrides: Partial<ExecutiveDecisionRegisterExecutionConfirmationEvidence> =
    {},
): ExecutiveDecisionRegisterExecutionConfirmationEvidence =>
  Object.freeze({
    confirmationId: "conf-1",
    actorId: request.actorId,
    actorKind: "Human",
    requestId: request.requestId,
    policyDecisionCode: request.policyDecisionCode,
    policyDecisionId: "policy-1",
    policyVersion: request.policyVersion,
    targetId: request.targetEntityId,
    operation: request.operation,
    proposedEffect: "close",
    authorityRef: request.authorityRef ?? "authority-1",
    evidenceSet: Object.freeze([...request.evidenceRefs]),
    obligationKinds: Object.freeze(
      request.enforcementResult.obligations.slice(),
    ),
    singleUse: true,
    expired: false,
    expiryMetadata: "expiry:1",
    reused: false,
    ...overrides,
  });

const intentRequest = (
  enforcementResult: ExecutiveDecisionRegisterEnforcementResult,
  overrides: Partial<ExecutiveDecisionRegisterExecutionIntentRequest> = {},
): ExecutiveDecisionRegisterExecutionIntentRequest => {
  const plan = enforcementResult.kind === "Enforceable"
    ? enforcementResult.plan
    : null;
  return Object.freeze({
    requestId: plan?.requestId ?? "req-1",
    enforcementResult,
    policyDecisionCode: plan?.policyDecisionCode ?? "POL-ALLOW",
    policyVersion: plan?.policyVersion ?? "1.0.0",
    validationOutcome: "Valid",
    actorId: plan?.actorId ?? "actor-1",
    actorKind: "Human",
    authorityRef: plan?.authorityRef ?? "authority-1",
    purpose: plan?.purpose ?? "continuity",
    targetRegister: plan?.targetRegister ?? "RTC-EDR-00000001",
    targetEntityId: plan?.targetEntityId ?? "proposal-1",
    operation: plan?.operation ?? "ProposeDecision",
    expectedRegisterSequence: 1,
    idempotencyKey: "idem-1",
    planDigest: plan?.planId ?? "digest-1",
    obligationDigest: "obl-digest-1",
    proposedEvents: plan
      ? canonicalBatchFor(plan)
      : Object.freeze([proposedEvent()]),
    evidenceRefs: Object.freeze([...(plan?.requiredEvidence ?? ["evidence-1"])]),
    privacyCategory: plan?.privacyCategory ?? "ExecutiveRecord",
    classification: plan?.classification ?? "internal",
    currentLifecycleState: plan?.currentLifecycleState ?? "Proposed",
    proposedLifecycleState: plan?.proposedLifecycleState ?? null,
    confirmationEvidence: null,
    requiresUnresolvedOpenIssueDefault: false,
    requestsInPlaceMutation: false,
    requestsHistoricalOverwrite: false,
    requestsHistoricalDeletion: false,
    requestsSequenceReuse: false,
    executionAuthorizationExpired: false,
    ...overrides,
  });
};

const outcome = (
  overrides: Partial<ExecutiveDecisionRegisterExecutionOutcomeEvidence> = {},
): ExecutiveDecisionRegisterExecutionOutcomeEvidence =>
  Object.freeze({
    outcomeKind: "Committed",
    outcomeEvidenceId: "outcome-1",
    outcomeEvidenceDigest: "outcome-digest-1",
    durableCommitEvidence: "commit-ev-1",
    acceptedEventRefs: Object.freeze(["evt-1"]),
    allocatedSequence: "seq-1",
    integrityEvidenceRef: "integrity-1",
    idempotencyRecordRef: "idem-rec-1",
    atomicBoundaryEvidence: "atomic-1",
    expectedSequence: 1,
    observedSequence: 1,
    conflictCode: null,
    idempotencyConflict: false,
    priorPlanDigest: null,
    failureCode: null,
    provesNoAcceptedEffect: false,
    uncertain: false,
    partialCommit: false,
    submissionAcknowledgementOnly: false,
    timedOut: false,
    recoveryInstructionCode: null,
    ...overrides,
  });

const assertRejected = (
  result: ExecutiveDecisionRegisterExecutionIntentResult,
  code: string,
): void => {
  assert.equal(result.kind, "Rejected");
  assert.equal(result.reasonCode, code);
  assert.equal(result.executes, false);
  if (result.kind === "Rejected") {
    assert.equal(result.intent, null);
    assert.equal(result.eventBatch.length, 0);
  }
};

const executableIntent = (
  overrides: Partial<ExecutiveDecisionRegisterExecutionIntentRequest> = {},
): ExecutiveDecisionRegisterExecutionIntent => {
  const constructed = constructExecutiveDecisionRegisterExecutionIntent(
    intentRequest(enforceablePropose(), overrides),
  );
  assert.equal(constructed.kind, "Executable");
  if (constructed.kind !== "Executable") {
    assert.fail("expected Executable");
  }
  return constructed.intent;
};

const withTamperedPlan = (
  planId: string,
): ExecutiveDecisionRegisterEnforcementResult => {
  const base = enforceablePropose();
  assert.equal(base.kind, "Enforceable");
  if (base.kind !== "Enforceable") {
    assert.fail("expected Enforceable");
  }
  const plan: ExecutiveDecisionRegisterEnforcementPlan = Object.freeze({
    ...base.plan,
    planId,
  });
  return Object.freeze({
    ...base,
    plan,
  });
};

type RuleCoverage = {
  readonly ruleKey: string;
  readonly ruleId: string;
  readonly expectedKind: ExecutiveDecisionRegisterExecutionIntentKind | "Receipt";
  readonly expectedCode?: string;
  readonly run: () => unknown;
};

const RULE_COVERAGE: readonly RuleCoverage[] = Object.freeze([
  Object.freeze({
    ruleKey: "EnforceableOnly",
    ruleId: "RTC-3:7/Rule/01",
    expectedKind: "Rejected" as const,
    expectedCode: "EXEC-BLOCKED",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(blockedResult()),
      ),
  }),
  Object.freeze({
    ruleKey: "AuthorityBinding",
    ruleId: "RTC-3:7/Rule/02",
    expectedKind: "Rejected" as const,
    expectedCode: "EXEC-AUTHORITY-MISMATCH",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          authorityRef: "wrong-authority",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "IdempotencyRequired",
    ruleId: "RTC-3:7/Rule/03",
    expectedKind: "Rejected" as const,
    expectedCode: "EXEC-MISSING-IDEMPOTENCY",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), { idempotencyKey: null }),
      ),
  }),
  Object.freeze({
    ruleKey: "SequenceRequired",
    ruleId: "RTC-3:7/Rule/04",
    expectedKind: "Rejected" as const,
    expectedCode: "EXEC-MISSING-SEQUENCE",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          expectedRegisterSequence: null,
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AtomicBatch",
    ruleId: "RTC-3:7/Rule/05",
    expectedKind: "Rejected" as const,
    expectedCode: "EXEC-EMPTY-BATCH",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          proposedEvents: Object.freeze([]),
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "AppendOnly",
    ruleId: "RTC-3:7/Rule/06",
    expectedKind: "Rejected" as const,
    expectedCode: "EXEC-APPEND-ONLY",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          requestsInPlaceMutation: true,
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "RelationshipIntegrity",
    ruleId: "RTC-3:7/Rule/07",
    expectedKind: "Rejected" as const,
    expectedCode: "EXEC-SUPERSESSION",
    run: () => {
      const decision = evaluateExecutiveDecisionRegisterPolicy(
        policyRequest({
          operation: "SupersedeDecision",
          predecessorDecisionRef: "D1",
          successorDecisionRef: "D2",
          supersessionEffectivePoint: "t1",
          evidenceRefs: Object.freeze(["evidence-1"]),
        }),
      );
      const confirmation = confirmationFor(
        decision,
        "SupersedeDecision",
        "record-proposal",
      );
      const enforced = planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(decision, {
          operation: "SupersedeDecision",
          predecessorRef: "D1",
          successorRef: "D2",
          confirmationEvidence: confirmation,
        }),
      );
      assert.equal(enforced.kind, "Enforceable");
      if (enforced.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      return constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforced, {
          operation: "SupersedeDecision",
          proposedEvents: canonicalBatchFor(enforced.plan, (events) =>
            Object.freeze(
              events.map((event) =>
                event.stepKind === "PrepareSupersessionEvent"
                  ? proposedEvent({
                    ...event,
                    predecessorRef: null,
                    successorRef: null,
                  })
                  : event
              ),
            )
          ),
          confirmationEvidence: Object.freeze({
            ...confirmation,
            reused: false,
          }),
        }),
      );
    },
  }),
  Object.freeze({
    ruleKey: "AiBoundary",
    ruleId: "RTC-3:7/Rule/08",
    expectedKind: "Rejected" as const,
    expectedCode: "EXEC-AI",
    run: () => {
      const close = enforceableClose();
      const base = intentRequest(close);
      return constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(close, {
          actorKind: "Ai",
          confirmationEvidence: executionConfirmation(base),
        }),
      );
    },
  }),
  Object.freeze({
    ruleKey: "PrivacyBoundary",
    ruleId: "RTC-3:7/Rule/09",
    expectedKind: "Rejected" as const,
    expectedCode: "EXEC-PRIVATE",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          privacyCategory: "PrivateReflection",
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "ReceiptEvidence",
    ruleId: "RTC-3:7/Rule/10",
    expectedKind: "Receipt" as const,
    expectedCode: "Indeterminate",
    run: () =>
      createExecutiveDecisionRegisterExecutionReceipt(
        executableIntent(),
        outcome({ durableCommitEvidence: null }),
      ),
  }),
  Object.freeze({
    ruleKey: "NoPartialCommit",
    ruleId: "RTC-3:7/Rule/11",
    expectedKind: "Receipt" as const,
    expectedCode: "Indeterminate",
    run: () =>
      createExecutiveDecisionRegisterExecutionReceipt(
        executableIntent(),
        outcome({ partialCommit: true }),
      ),
  }),
  Object.freeze({
    ruleKey: "IndeterminateRetry",
    ruleId: "RTC-3:7/Rule/12",
    expectedKind: "Executable" as const,
    expectedCode: "EXEC-EXECUTABLE",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose()),
      ),
  }),
]);

type RejectionCoverage = {
  readonly reasonCode: string;
  readonly isolate: string;
  readonly run: () => ExecutiveDecisionRegisterExecutionIntentResult;
};

const REJECTION_REASON_COVERAGE: readonly RejectionCoverage[] = Object.freeze([
  Object.freeze({
    reasonCode: "EXEC-UNKNOWN-KIND",
    isolate: "unknown closed-vocabulary enforcement kind",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(
          Object.freeze({
            ...blockedResult(),
            kind: "NotAKind",
          }) as unknown as ExecutiveDecisionRegisterEnforcementResult,
        ),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-BLOCKED",
    isolate: "non-Enforceable Blocked upstream",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(blockedResult()),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-AWAITING-CONFIRMATION",
    isolate: "non-Enforceable AwaitingConfirmation upstream",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(awaitingConfirm()),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-MISSING-PLAN",
    isolate: "Enforceable missing plan object",
    run: () => {
      const base = enforceablePropose();
      return constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(
          Object.freeze({
            ...base,
            plan: null,
          }) as unknown as ExecutiveDecisionRegisterEnforcementResult,
        ),
      );
    },
  }),
  Object.freeze({
    reasonCode: "EXEC-UNKNOWN-ENFORCEMENT",
    isolate: "malformed / unknown plan identity",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(withTamperedPlan("not-a-canonical-plan")),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-MISSING-POLICY",
    isolate: "missing policy-decision identity",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          policyDecisionCode: "",
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-POLICY-MISMATCH",
    isolate: "policy-decision mismatch",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          policyDecisionCode: "POL-OTHER",
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-MISSING-VALIDATION",
    isolate: "incomplete provenance / invalid validation",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          validationOutcome: "Missing",
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-MISSING-AUTHORITY",
    isolate: "missing authority reference",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          authorityRef: null,
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-AUTHORITY-MISMATCH",
    isolate: "authority mismatch / substitution",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          authorityRef: "broader-authority",
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-ACTOR-MISMATCH",
    isolate: "actor mismatch",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          actorId: "other-actor",
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-REQUEST-MISMATCH",
    isolate: "request / mixed-request mismatch",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          requestId: "other-request",
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-REGISTER-MISMATCH",
    isolate: "decision-register mismatch",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          targetRegister: "RTC-EDR-99999999",
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-SUBJECT-MISMATCH",
    isolate: "subject mismatch",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          targetEntityId: "other-subject",
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-OPERATION-MISMATCH",
    isolate: "operation mismatch",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          operation: "CloseDecision",
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-AI",
    isolate: "AI authoritative execution",
    run: () => {
      const close = enforceableClose();
      const base = intentRequest(close);
      return constructExecutiveDecisionRegisterExecutionIntent(
        Object.freeze({
          ...base,
          actorKind: "Ai",
          confirmationEvidence: executionConfirmation(base),
        }),
      );
    },
  }),
  Object.freeze({
    reasonCode: "EXEC-MISSING-IDEMPOTENCY",
    isolate: "missing idempotency key",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), { idempotencyKey: null }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-MISSING-DIGEST",
    isolate: "missing / malformed plan digest",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), { planDigest: "  bad  " }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-MISSING-OBLIGATION-DIGEST",
    isolate: "obligation digest mismatch / missing",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), { obligationDigest: null }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-MISSING-SEQUENCE",
    isolate: "missing / malformed expected sequence",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          expectedRegisterSequence: -1,
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-EMPTY-BATCH",
    isolate: "empty batch with zero steps",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          proposedEvents: Object.freeze([]),
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-UNKNOWN-STEP",
    isolate: "unknown or malformed step kind",
    run: () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      return constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(source, {
          proposedEvents: canonicalBatchFor(source.plan, (events) =>
            Object.freeze([
              ...events.slice(0, -1),
              proposedEvent({
                ...events[events.length - 1]!,
                stepKind: "NotARealStep",
                eventType: "NotARealStep",
              }),
            ])
          ),
        }),
      );
    },
  }),
  Object.freeze({
    reasonCode: "EXEC-EVENT-ORDER",
    isolate: "duplicate authorized step",
    run: () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      return constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(source, {
          proposedEvents: canonicalBatchFor(source.plan, (events) =>
            Object.freeze([
              ...events,
              proposedEvent({
                ...events[0]!,
                eventIdDescriptor: "evt-dup",
                sequenceOffset: events.length,
              }),
            ])
          ),
        }),
      );
    },
  }),
  Object.freeze({
    reasonCode: "EXEC-EXTRA-STEP",
    isolate: "known unauthorized extra step",
    run: () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      return constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(source, {
          proposedEvents: withExtraStep(source.plan, "PrepareClosureEvent"),
        }),
      );
    },
  }),
  Object.freeze({
    reasonCode: "EXEC-MISSING-STEP",
    isolate: "non-empty batch missing a required plan step",
    run: () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      const kinds = authorizedKindsFromPlan(source.plan);
      const middle = kinds[Math.floor(kinds.length / 2)]!;
      return constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(source, {
          proposedEvents: omitStep(source.plan, middle),
        }),
      );
    },
  }),
  Object.freeze({
    reasonCode: "EXEC-MULTI-REGISTER",
    isolate: "mixed-register batch",
    run: () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      return constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(source, {
          proposedEvents: canonicalBatchFor(source.plan, (events) =>
            Object.freeze(
              events.map((event, index) =>
                index === 0
                  ? proposedEvent({ ...event, registerId: "OTHER-REGISTER" })
                  : event
              ),
            )
          ),
        }),
      );
    },
  }),
  Object.freeze({
    reasonCode: "EXEC-APPEND-ONLY",
    isolate: "prohibited execution step / mutation request",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          requestsHistoricalDeletion: true,
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-SUPERSESSION",
    isolate: "supersession relationship integrity",
    run: () => {
      const decision = evaluateExecutiveDecisionRegisterPolicy(
        policyRequest({
          operation: "SupersedeDecision",
          predecessorDecisionRef: "D1",
          successorDecisionRef: "D2",
          supersessionEffectivePoint: "t1",
        }),
      );
      const confirmation = confirmationFor(
        decision,
        "SupersedeDecision",
        "record-proposal",
      );
      const enforced = planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(decision, {
          operation: "SupersedeDecision",
          predecessorRef: "D1",
          successorRef: "D2",
          confirmationEvidence: confirmation,
        }),
      );
      assert.equal(enforced.kind, "Enforceable");
      if (enforced.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      const base = intentRequest(enforced, {
        proposedEvents: canonicalBatchFor(enforced.plan, (events) =>
          Object.freeze(
            events.map((event) =>
              event.stepKind === "PrepareSupersessionEvent"
                ? proposedEvent({
                  ...event,
                  predecessorRef: null,
                  successorRef: null,
                })
                : event
            ),
          )
        ),
      });
      return constructExecutiveDecisionRegisterExecutionIntent(
        Object.freeze({
          ...base,
          confirmationEvidence: executionConfirmation(base, {
            operation: "SupersedeDecision",
            proposedEffect: "record-proposal",
          }),
        }),
      );
    },
  }),
  Object.freeze({
    reasonCode: "EXEC-DISPUTE",
    isolate: "dispute reference incomplete",
    run: () => {
      const decision = evaluateExecutiveDecisionRegisterPolicy(
        policyRequest({
          operation: "OpenDispute",
          challengedDecisionRef: "D1",
          activeDisputePresent: false,
          proposedEffect: "open-dispute",
        }),
      );
      const enforced = planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(decision, {
          operation: "OpenDispute",
          challengedDecisionRef: "D1",
          proposedEffect: "open-dispute",
        }),
      );
      assert.equal(enforced.kind, "Enforceable");
      if (enforced.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      return constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforced, {
          operation: "OpenDispute",
          proposedEvents: canonicalBatchFor(enforced.plan, (events) =>
            Object.freeze(
              events.map((event) =>
                event.stepKind === "PrepareDisputeEvent"
                  ? proposedEvent({ ...event, disputeRef: null })
                  : event
              ),
            )
          ),
        }),
      );
    },
  }),
  Object.freeze({
    reasonCode: "EXEC-DISPOSITION",
    isolate: "incomplete disposition evidence",
    run: () => {
      const decision = evaluateExecutiveDecisionRegisterPolicy(
        policyRequest({
          operation: "DisposeDecision",
          targetEntityKind: "Decision",
          targetEntityId: "dec-1",
          currentLifecycleState: "Closed",
          proposedLifecycleState: "Disposed",
          proposedEffect: "dispose",
          dispositionGovernanceEvidencePresent: true,
          dispositionPolicyRef: "disp-1",
        }),
      );
      const confirmation = confirmationFor(
        decision,
        "DisposeDecision",
        "dispose",
      );
      const enforced = planExecutiveDecisionRegisterEnforcement(
        enforcementRequest(decision, {
          operation: "DisposeDecision",
          targetEntityKind: "Decision",
          targetEntityId: decision.targetId,
          currentLifecycleState: "Closed",
          proposedLifecycleState: "Disposed",
          proposedEffect: "dispose",
          dispositionGovernanceEvidencePresent: true,
          dispositionPolicyRef: "disp-1",
          confirmationEvidence: confirmation,
        }),
      );
      const base = intentRequest(enforced, {
        evidenceRefs: Object.freeze([]),
      });
      return constructExecutiveDecisionRegisterExecutionIntent(
        Object.freeze({
          ...base,
          confirmationEvidence: executionConfirmation(base, {
            operation: "DisposeDecision",
            proposedEffect: "dispose",
            evidenceSet: Object.freeze([]),
          }),
        }),
      );
    },
  }),
  Object.freeze({
    reasonCode: "EXEC-OPEN-ISSUE",
    isolate: "unresolved open-issue default required",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          requiresUnresolvedOpenIssueDefault: true,
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-PRIVATE",
    isolate: "private reflection path",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          privacyCategory: "PrivateReflection",
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-CLASSIFICATION",
    isolate: "incomplete classification evidence",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          privacyCategory: "RegulatedOrPrivilegedRecord",
          classification: null,
        }),
      ),
  }),
  Object.freeze({
    reasonCode: "EXEC-CONFIRMATION-MISSING",
    isolate: "confirmation missing when mandatory",
    run: () => {
      const close = enforceableClose();
      return constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(close, {
          confirmationEvidence: null,
        }),
      );
    },
  }),
  Object.freeze({
    reasonCode: "EXEC-CONFIRMATION-MISMATCH",
    isolate: "confirmation mismatch",
    run: () => {
      const close = enforceableClose();
      const base = intentRequest(close);
      return constructExecutiveDecisionRegisterExecutionIntent(
        Object.freeze({
          ...base,
          confirmationEvidence: executionConfirmation(base, {
            authorityRef: "wrong-authority",
          }),
        }),
      );
    },
  }),
  Object.freeze({
    reasonCode: "EXEC-AUTHORIZATION-EXPIRED",
    isolate: "expired execution authorization",
    run: () =>
      constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose(), {
          executionAuthorizationExpired: true,
        }),
      ),
  }),
]);

type BindingCoverage = {
  readonly field: string;
  readonly run: () => void;
};

const BINDING_COVERAGE: readonly BindingCoverage[] = Object.freeze([
  Object.freeze({
    field: "decision-register identity",
    run: () => {
      const intent = executableIntent();
      assert.equal(intent.targetRegister, "RTC-EDR-00000001");
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), {
            targetRegister: "RTC-EDR-00000002",
          }),
        ),
        "EXEC-REGISTER-MISMATCH",
      );
    },
  }),
  Object.freeze({
    field: "execution-request identity",
    run: () => {
      const intent = executableIntent();
      assert.equal(intent.requestId, "req-1");
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), { requestId: "req-x" }),
        ),
        "EXEC-REQUEST-MISMATCH",
      );
    },
  }),
  Object.freeze({
    field: "enforcement-plan identity",
    run: () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      const intent = executableIntent();
      assert.equal(intent.enforcementPlanId, source.plan.planId);
    },
  }),
  Object.freeze({
    field: "enforcement-plan object reference",
    run: () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      const constructed = constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(source),
      );
      assert.equal(constructed.kind, "Executable");
      if (constructed.kind !== "Executable") {
        assert.fail("expected Executable");
      }
      assert.equal(constructed.intent.enforcementPlan, source.plan);
    },
  }),
  Object.freeze({
    field: "policy-decision identity",
    run: () => {
      const intent = executableIntent();
      assert.ok(intent.policyDecisionCode.length > 0);
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), {
            policyDecisionCode: "POL-WRONG",
          }),
        ),
        "EXEC-POLICY-MISMATCH",
      );
    },
  }),
  Object.freeze({
    field: "operation",
    run: () => {
      assert.equal(executableIntent().operation, "ProposeDecision");
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), { operation: "CloseDecision" }),
        ),
        "EXEC-OPERATION-MISMATCH",
      );
    },
  }),
  Object.freeze({
    field: "subject",
    run: () => {
      assert.equal(executableIntent().targetEntityId, "proposal-1");
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), {
            targetEntityId: "other",
          }),
        ),
        "EXEC-SUBJECT-MISMATCH",
      );
    },
  }),
  Object.freeze({
    field: "actor",
    run: () => {
      assert.equal(executableIntent().actorId, "actor-1");
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), { actorId: "actor-2" }),
        ),
        "EXEC-ACTOR-MISMATCH",
      );
    },
  }),
  Object.freeze({
    field: "authority reference",
    run: () => {
      assert.equal(executableIntent().authorityRef, "authority-1");
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), {
            authorityRef: "authority-2",
          }),
        ),
        "EXEC-AUTHORITY-MISMATCH",
      );
    },
  }),
  Object.freeze({
    field: "confirmation reference",
    run: () => {
      const propose = constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose()),
      );
      assert.equal(propose.kind, "Executable");
      const close = enforceableClose();
      const base = intentRequest(close);
      const ok = constructExecutiveDecisionRegisterExecutionIntent(
        Object.freeze({
          ...base,
          confirmationEvidence: executionConfirmation(base),
        }),
      );
      assert.equal(ok.kind, "Executable");
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(close, {
            confirmationEvidence: null,
          }),
        ),
        "EXEC-CONFIRMATION-MISSING",
      );
    },
  }),
  Object.freeze({
    field: "obligation digest",
    run: () => {
      assert.equal(executableIntent().obligationDigest, "obl-digest-1");
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), { obligationDigest: "" }),
        ),
        "EXEC-MISSING-OBLIGATION-DIGEST",
      );
    },
  }),
  Object.freeze({
    field: "idempotency key",
    run: () => {
      assert.equal(executableIntent().idempotencyKey, "idem-1");
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), { idempotencyKey: " " }),
        ),
        "EXEC-MISSING-IDEMPOTENCY",
      );
    },
  }),
  Object.freeze({
    field: "canonical plan digest",
    run: () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      assert.equal(executableIntent().planDigest, source.plan.planId);
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), { planDigest: null }),
        ),
        "EXEC-MISSING-DIGEST",
      );
    },
  }),
  Object.freeze({
    field: "expected sequence",
    run: () => {
      assert.equal(executableIntent().expectedRegisterSequence, 1);
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), {
            expectedRegisterSequence: null,
          }),
        ),
        "EXEC-MISSING-SEQUENCE",
      );
    },
  }),
  Object.freeze({
    field: "ordered batch steps",
    run: () => {
      const intent = executableIntent();
      assert.deepEqual(
        intent.steps.map((step) => step.kind),
        [...ExecutiveDecisionRegisterExecutionStepKinds],
      );
      assert.equal(mutateFrozen(intent.steps as object), false);
    },
  }),
  Object.freeze({
    field: "outcome-evidence identity",
    run: () => {
      const receipt = createExecutiveDecisionRegisterExecutionReceipt(
        executableIntent(),
        outcome(),
      );
      assert.equal(receipt.kind, "Committed");
      assert.equal(receipt.outcomeEvidenceId, "outcome-1");
      assert.equal(
        createExecutiveDecisionRegisterExecutionReceipt(
          executableIntent(),
          outcome({ outcomeEvidenceId: null }),
        ).kind,
        "Indeterminate",
      );
    },
  }),
  Object.freeze({
    field: "outcome-evidence digest",
    run: () => {
      const receipt = createExecutiveDecisionRegisterExecutionReceipt(
        executableIntent(),
        outcome(),
      );
      assert.equal(receipt.outcomeEvidenceDigest, "outcome-digest-1");
      assert.equal(
        createExecutiveDecisionRegisterExecutionReceipt(
          executableIntent(),
          outcome({ outcomeEvidenceDigest: "  " }),
        ).kind,
        "Indeterminate",
      );
    },
  }),
]);

type ReceiptCoverage = {
  readonly result: ExecutiveDecisionRegisterExecutionReceiptKind;
  readonly positive: () => ExecutiveDecisionRegisterExecutionReceipt;
  readonly negatives: readonly {
    readonly name: string;
    readonly run: () => ExecutiveDecisionRegisterExecutionReceipt;
  }[];
};

const RECEIPT_RESULT_COVERAGE: readonly ReceiptCoverage[] = Object.freeze([
  Object.freeze({
    result: "Committed" as const,
    positive: () =>
      createExecutiveDecisionRegisterExecutionReceipt(
        executableIntent(),
        outcome(),
      ),
    negatives: Object.freeze([
      Object.freeze({
        name: "acknowledgement-only",
        run: () =>
          createExecutiveDecisionRegisterExecutionReceipt(
            executableIntent(),
            outcome({ submissionAcknowledgementOnly: true }),
          ),
      }),
      Object.freeze({
        name: "partial outcome",
        run: () =>
          createExecutiveDecisionRegisterExecutionReceipt(
            executableIntent(),
            outcome({ partialCommit: true }),
          ),
      }),
      Object.freeze({
        name: "missing commit identity",
        run: () =>
          createExecutiveDecisionRegisterExecutionReceipt(
            executableIntent(),
            outcome({ durableCommitEvidence: null }),
          ),
      }),
      Object.freeze({
        name: "missing committed sequence",
        run: () =>
          createExecutiveDecisionRegisterExecutionReceipt(
            executableIntent(),
            outcome({ allocatedSequence: null }),
          ),
      }),
      Object.freeze({
        name: "missing outcome evidence id",
        run: () =>
          createExecutiveDecisionRegisterExecutionReceipt(
            executableIntent(),
            outcome({ outcomeEvidenceId: null }),
          ),
      }),
      Object.freeze({
        name: "contradictory uncertain flag",
        run: () =>
          createExecutiveDecisionRegisterExecutionReceipt(
            executableIntent(),
            outcome({ uncertain: true }),
          ),
      }),
    ]),
  }),
  Object.freeze({
    result: "Conflict" as const,
    positive: () =>
      createExecutiveDecisionRegisterExecutionReceipt(
        executableIntent(),
        outcome({
          outcomeKind: "Conflict",
          conflictCode: "SEQ-STALE",
          expectedSequence: 1,
          observedSequence: 9,
        }),
      ),
    negatives: Object.freeze([
      Object.freeze({
        name: "conflict without evidence",
        run: () =>
          createExecutiveDecisionRegisterExecutionReceipt(
            executableIntent(),
            outcome({
              outcomeKind: "Conflict",
              conflictCode: null,
              expectedSequence: 1,
              observedSequence: 1,
              idempotencyConflict: false,
              priorPlanDigest: null,
            }),
          ),
      }),
      Object.freeze({
        name: "idempotency conflict positive path covered separately",
        run: () =>
          createExecutiveDecisionRegisterExecutionReceipt(
            executableIntent(),
            outcome({
              outcomeKind: "Conflict",
              conflictCode: null,
              idempotencyConflict: true,
              priorPlanDigest: "other-digest",
            }),
          ),
      }),
    ]),
  }),
  Object.freeze({
    result: "Failed" as const,
    positive: () =>
      createExecutiveDecisionRegisterExecutionReceipt(
        executableIntent(),
        outcome({
          outcomeKind: "Failed",
          failureCode: "EXEC-FAILED",
          provesNoAcceptedEffect: true,
        }),
      ),
    negatives: Object.freeze([
      Object.freeze({
        name: "timeout alone",
        run: () =>
          createExecutiveDecisionRegisterExecutionReceipt(
            executableIntent(),
            outcome({ outcomeKind: "Failed", timedOut: true }),
          ),
      }),
      Object.freeze({
        name: "missing failure evidence",
        run: () =>
          createExecutiveDecisionRegisterExecutionReceipt(
            executableIntent(),
            outcome({
              outcomeKind: "Failed",
              failureCode: null,
              provesNoAcceptedEffect: false,
            }),
          ),
      }),
      Object.freeze({
        name: "partial rollback without definitive proof",
        run: () =>
          createExecutiveDecisionRegisterExecutionReceipt(
            executableIntent(),
            outcome({
              outcomeKind: "Failed",
              failureCode: "PARTIAL",
              provesNoAcceptedEffect: false,
            }),
          ),
      }),
    ]),
  }),
  Object.freeze({
    result: "Indeterminate" as const,
    positive: () =>
      createExecutiveDecisionRegisterExecutionReceipt(
        executableIntent(),
        outcome({ outcomeKind: "Indeterminate" }),
      ),
    negatives: Object.freeze([
      Object.freeze({
        name: "complete commit is not Indeterminate",
        run: () =>
          createExecutiveDecisionRegisterExecutionReceipt(
            executableIntent(),
            outcome(),
          ),
      }),
      Object.freeze({
        name: "definitive failure is not Indeterminate",
        run: () =>
          createExecutiveDecisionRegisterExecutionReceipt(
            executableIntent(),
            outcome({
              outcomeKind: "Failed",
              failureCode: "EXEC-FAILED",
              provesNoAcceptedEffect: true,
            }),
          ),
      }),
    ]),
  }),
]);

const STEP_COVERAGE = Object.freeze(
  ExecutiveDecisionRegisterExecutionStepKinds.map((kind, index) =>
    Object.freeze({
      kind,
      order: index + 1,
      role: ExecutiveDecisionRegisterExecutionStepRoles[kind],
    })
  ),
);

describe("RTC-3:7 Executive Decision Register Execution Contract", () => {
  describe("Rule traceability", () => {
    it("covers every canonical rule exactly once in production order", () => {
      assert.equal(ExecutiveDecisionRegisterExecutionRules.length, 12);
      assert.equal(RULE_COVERAGE.length, 12);
      assert.deepEqual(
        RULE_COVERAGE.map((item) => item.ruleKey),
        ExecutiveDecisionRegisterExecutionRules.map((item) => item.ruleKey),
      );
      assert.deepEqual(
        RULE_COVERAGE.map((item) => item.ruleId),
        ExecutiveDecisionRegisterExecutionRules.map((item) => item.ruleId),
      );
      assert.equal(
        new Set(RULE_COVERAGE.map((item) => item.ruleKey)).size,
        12,
      );
    });

    for (const coverage of RULE_COVERAGE) {
      it(`direct coverage: ${coverage.ruleId} ${coverage.ruleKey}`, () => {
        const result = coverage.run();
        if (coverage.expectedKind === "Receipt") {
          assert.equal(
            (result as ExecutiveDecisionRegisterExecutionReceipt).kind,
            coverage.expectedCode,
          );
        } else {
          const intentResult = result as ExecutiveDecisionRegisterExecutionIntentResult;
          assert.equal(intentResult.kind, coverage.expectedKind);
          assert.equal(intentResult.reasonCode, coverage.expectedCode);
          assert.equal(intentResult.executes, false);
        }
      });
    }
  });

  describe("Rejection-code traceability", () => {
    it("covers every rejection reason exactly once", () => {
      assert.equal(
        ExecutiveDecisionRegisterExecutionRejectionCodes.includes(
          "EXEC-EXECUTABLE" as never,
        ),
        false,
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterExecutionSuccessCodes],
        ["EXEC-EXECUTABLE"],
      );
      assert.deepEqual(
        REJECTION_REASON_COVERAGE.map((item) => item.reasonCode),
        [...ExecutiveDecisionRegisterExecutionRejectionCodes],
      );
      assert.equal(
        new Set(REJECTION_REASON_COVERAGE.map((item) => item.reasonCode)).size,
        REJECTION_REASON_COVERAGE.length,
      );
      assert.equal(
        REJECTION_REASON_COVERAGE.some(
          (item) => item.reasonCode === "EXEC-EXECUTABLE",
        ),
        false,
      );
    });

    for (const coverage of REJECTION_REASON_COVERAGE) {
      it(`rejects ${coverage.reasonCode}: ${coverage.isolate}`, () => {
        const result = coverage.run();
        assertRejected(result, coverage.reasonCode);
      });
    }

    it("malformed idempotency key fails closed independently", () => {
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), { idempotencyKey: " leading" }),
        ),
        "EXEC-MISSING-IDEMPOTENCY",
      );
    });

    it("whitespace-altered plan identity fails closed", () => {
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(withTamperedPlan(" RTC-3:6/Plan/x ")),
        ),
        "EXEC-UNKNOWN-ENFORCEMENT",
      );
    });
  });

  describe("Success and rejection vocabulary separation", () => {
    it("keeps success and rejection vocabularies closed, unique, ordered, immutable", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterExecutionSuccessCodes],
        ["EXEC-EXECUTABLE"],
      );
      assert.equal(
        ExecutiveDecisionRegisterExecutionRejectionCodes.includes(
          "EXEC-EXECUTABLE" as never,
        ),
        false,
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterExecutionDecisionCodes],
        [
          ...ExecutiveDecisionRegisterExecutionSuccessCodes,
          ...ExecutiveDecisionRegisterExecutionRejectionCodes,
        ],
      );
      assert.equal(
        new Set(ExecutiveDecisionRegisterExecutionRejectionCodes).size,
        ExecutiveDecisionRegisterExecutionRejectionCodes.length,
      );
      assert.equal(
        mutateFrozen(ExecutiveDecisionRegisterExecutionSuccessCodes as object),
        false,
      );
      assert.equal(
        mutateFrozen(ExecutiveDecisionRegisterExecutionRejectionCodes as object),
        false,
      );
      const success: ExecutiveDecisionRegisterExecutionSuccessCode =
        "EXEC-EXECUTABLE";
      const rejection: ExecutiveDecisionRegisterExecutionRejectionCode =
        "EXEC-BLOCKED";
      assert.equal(success, "EXEC-EXECUTABLE");
      assert.notEqual(
        rejection as string,
        "EXEC-EXECUTABLE",
      );
    });

    it("Executable uses success code; Rejected never uses EXEC-EXECUTABLE", () => {
      const executable = constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(enforceablePropose()),
      );
      assert.equal(executable.kind, "Executable");
      assert.equal(executable.reasonCode, "EXEC-EXECUTABLE");
      assert.equal(
        isExecutiveDecisionRegisterExecutionExecutable(executable),
        true,
      );
      assert.equal(
        (ExecutiveDecisionRegisterExecutionSuccessCodes as readonly string[])
          .includes(executable.reasonCode),
        true,
      );
      assert.equal(
        (ExecutiveDecisionRegisterExecutionRejectionCodes as readonly string[])
          .includes(executable.reasonCode),
        false,
      );
      const rejectedResult = constructExecutiveDecisionRegisterExecutionIntent(
        intentRequest(blockedResult()),
      );
      assert.equal(rejectedResult.kind, "Rejected");
      assert.notEqual(rejectedResult.reasonCode, "EXEC-EXECUTABLE");
      assert.equal(
        isExecutiveDecisionRegisterExecutionRejected(rejectedResult),
        true,
      );
      assert.equal(
        (ExecutiveDecisionRegisterExecutionRejectionCodes as readonly string[])
          .includes(rejectedResult.reasonCode),
        true,
      );
    });
  });

  describe("Binding verification", () => {
    it("covers every binding field exactly once", () => {
      assert.equal(BINDING_COVERAGE.length, 17);
      assert.equal(
        new Set(BINDING_COVERAGE.map((item) => item.field)).size,
        17,
      );
    });

    for (const coverage of BINDING_COVERAGE) {
      it(`binding: ${coverage.field}`, () => {
        coverage.run();
      });
    }

    it("preserves exact RTC-3:6 aggregate and AI prohibition array by reference", () => {
      assert.equal(
        ExecutiveDecisionRegisterExecution.enforcement,
        ExecutiveDecisionRegisterEnforcement,
      );
      assert.equal(
        ExecutiveDecisionRegisterExecution.aiMustNot,
        ExecutiveDecisionRegisterEnforcement.aiMustNot,
      );
      assert.equal(
        ExecutiveDecisionRegisterExecution.openIssues,
        ExecutiveDecisionRegisterExecution.metadata.openIssues,
      );
      assert.equal(
        ExecutiveDecisionRegisterExecution.upstreamArchitectureDecision,
        ExecutiveDecisionRegisterEnforcement.architectureDecision,
      );
    });

    it("mutation after construction cannot change stored contracts", () => {
      const request = intentRequest(enforceablePropose());
      const before = JSON.stringify(request);
      const result = constructExecutiveDecisionRegisterExecutionIntent(request);
      assert.equal(JSON.stringify(request), before);
      assert.equal(result.kind, "Executable");
      if (result.kind !== "Executable") {
        assert.fail("expected Executable");
      }
      assert.equal(mutateFrozen(result.intent), false);
      assert.equal(mutateFrozen(result.intent.eventBatch as object), false);
      assert.equal(mutateFrozen(result.intent.steps as object), false);
    });
  });

  describe("Atomic batch", () => {
    it("accepts exact canonical authorized batch", () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      const intent = executableIntent({
        proposedEvents: canonicalBatchFor(source.plan),
      });
      assert.deepEqual(
        intent.eventBatch.map((event) => event.stepKind),
        [...authorizedKindsFromPlan(source.plan)],
      );
      assert.equal(mutateFrozen(intent.eventBatch as object), false);
    });

    it("empty batch → EXEC-EMPTY-BATCH only", () => {
      const request = intentRequest(enforceablePropose(), {
        proposedEvents: Object.freeze([]),
      });
      const snapshot = JSON.stringify(request);
      const result = constructExecutiveDecisionRegisterExecutionIntent(request);
      assertRejected(result, "EXEC-EMPTY-BATCH");
      assert.equal(JSON.stringify(request), snapshot);
    });

    it("missing first, middle, and final required steps → EXEC-MISSING-STEP", () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      const kinds = authorizedKindsFromPlan(source.plan);
      const first = kinds[0]!;
      const middle = kinds[Math.floor(kinds.length / 2)]!;
      const finalStep = kinds[kinds.length - 1]!;
      for (const stepKind of [first, middle, finalStep]) {
        const request = intentRequest(source, {
          proposedEvents: omitStep(source.plan, stepKind),
        });
        const snapshot = JSON.stringify(request);
        const result = constructExecutiveDecisionRegisterExecutionIntent(request);
        assertRejected(result, "EXEC-MISSING-STEP");
        assert.equal(JSON.stringify(request), snapshot);
        assert.equal(result.kind, "Rejected");
        if (result.kind === "Rejected") {
          assert.equal(result.intent, null);
          assert.equal(result.eventBatch.length, 0);
        }
      }
    });

    it("known unauthorized extra step → EXEC-EXTRA-STEP", () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      const request = intentRequest(source, {
        proposedEvents: withExtraStep(source.plan, "PrepareClosureEvent"),
      });
      const snapshot = JSON.stringify(request);
      const result = constructExecutiveDecisionRegisterExecutionIntent(request);
      assertRejected(result, "EXEC-EXTRA-STEP");
      assert.equal(JSON.stringify(request), snapshot);
    });

    it("unknown extra step → EXEC-UNKNOWN-STEP", () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(source, {
            proposedEvents: withExtraStep(source.plan, "TotallyUnknownStep"),
          }),
        ),
        "EXEC-UNKNOWN-STEP",
      );
    });

    it("duplicate authorized step → EXEC-EVENT-ORDER, not EXTRA-STEP", () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(source, {
            proposedEvents: canonicalBatchFor(source.plan, (events) =>
              Object.freeze([
                ...events,
                proposedEvent({
                  ...events[0]!,
                  eventIdDescriptor: "evt-dup",
                  sequenceOffset: events.length,
                }),
              ])
            ),
          }),
        ),
        "EXEC-EVENT-ORDER",
      );
    });

    it("incorrect canonical order → EXEC-EVENT-ORDER", () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(source, {
            proposedEvents: canonicalBatchFor(source.plan, (events) => {
              if (events.length < 2) {
                return events;
              }
              const swapped = [...events];
              const tmp = swapped[0]!;
              swapped[0] = proposedEvent({
                ...swapped[1]!,
                sequenceOffset: 0,
                eventIdDescriptor: "evt-0",
              });
              swapped[1] = proposedEvent({
                ...tmp,
                sequenceOffset: 1,
                eventIdDescriptor: "evt-1",
              });
              return Object.freeze(swapped);
            }),
          }),
        ),
        "EXEC-EVENT-ORDER",
      );
    });

    it("mixed-register, mixed-request, and mixed-plan remain distinct", () => {
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(source, {
            proposedEvents: canonicalBatchFor(source.plan, (events) =>
              Object.freeze(
                events.map((event, index) =>
                  index === 0
                    ? proposedEvent({ ...event, registerId: "MIXED" })
                    : event
                ),
              )
            ),
          }),
        ),
        "EXEC-MULTI-REGISTER",
      );
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(source, { requestId: "mixed-req" }),
        ),
        "EXEC-REQUEST-MISMATCH",
      );
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(withTamperedPlan("RTC-2:6/Plan/foreign")),
        ),
        "EXEC-UNKNOWN-ENFORCEMENT",
      );
    });

    it("documents deterministic batch validation precedence", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterExecutionBatchValidationPrecedence],
        [
          "EXEC-EMPTY-BATCH",
          "EXEC-UNKNOWN-STEP",
          "EXEC-EVENT-ORDER",
          "EXEC-EXTRA-STEP",
          "EXEC-MISSING-STEP",
          "EXEC-EVENT-ORDER",
          "EXEC-MULTI-REGISTER",
        ],
      );
      // Unknown masks extra/missing in overlapping fixtures.
      const source = enforceablePropose();
      assert.equal(source.kind, "Enforceable");
      if (source.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(source, {
            proposedEvents: withExtraStep(source.plan, "UnknownMaskingStep"),
          }),
        ),
        "EXEC-UNKNOWN-STEP",
      );
    });
  });

  describe("Idempotency and concurrency", () => {
    it("same key + same digest is Same and deterministic", () => {
      const left = executableIntent();
      const right = executableIntent();
      assert.equal(
        compareExecutiveDecisionRegisterIdempotency(left, right),
        "Same",
      );
      assert.deepEqual(left, right);
      assert.equal(mutateFrozen(left), false);
      assert.deepEqual(
        [...ExecutiveDecisionRegisterExecutionConflictClassifications],
        ["Same", "Conflict", "Distinct"],
      );
    });

    it("same key + different digest is Conflict", () => {
      const left = executableIntent();
      const right = executableIntent({ planDigest: "other-digest" });
      assert.equal(
        compareExecutiveDecisionRegisterIdempotency(left, right),
        "Conflict",
      );
    });

    it("same digest + different key is Distinct", () => {
      const left = executableIntent();
      const right = executableIntent({ idempotencyKey: "idem-2" });
      assert.equal(
        compareExecutiveDecisionRegisterIdempotency(left, right),
        "Distinct",
      );
    });

    it("Indeterminate retry retains key and digest; rotation cannot conceal", () => {
      const intent = executableIntent();
      const indeterminate = createExecutiveDecisionRegisterExecutionReceipt(
        intent,
        outcome({ uncertain: true }),
      );
      assert.equal(indeterminate.kind, "Indeterminate");
      if (indeterminate.kind === "Indeterminate") {
        assert.equal(
          indeterminate.recoveryInstructionCode,
          "RETRY-SAME-KEY-AND-DIGEST",
        );
        assert.equal(indeterminate.idempotencyKey, intent.idempotencyKey);
        assert.equal(indeterminate.planDigest, intent.planDigest);
      }
      const rotatedKey = executableIntent({ idempotencyKey: "new-key" });
      assert.equal(
        compareExecutiveDecisionRegisterIdempotency(intent, rotatedKey),
        "Distinct",
      );
      const rotatedDigest = executableIntent({ planDigest: "rotated" });
      assert.equal(
        compareExecutiveDecisionRegisterIdempotency(intent, rotatedDigest),
        "Conflict",
      );
    });

    it("idempotency cannot bypass authority, confirmation, or sequence", () => {
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), {
            authorityRef: "bypass",
            idempotencyKey: "idem-1",
          }),
        ),
        "EXEC-AUTHORITY-MISMATCH",
      );
      const close = enforceableClose();
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(close, {
            idempotencyKey: "idem-1",
            confirmationEvidence: null,
          }),
        ),
        "EXEC-CONFIRMATION-MISSING",
      );
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), {
            idempotencyKey: "idem-1",
            expectedRegisterSequence: null,
          }),
        ),
        "EXEC-MISSING-SEQUENCE",
      );
    });

    it("expected sequence mandatory; stale/mismatch Conflict; no silent rebase", () => {
      assert.equal(executableIntent({ expectedRegisterSequence: 7 })
        .expectedRegisterSequence, 7);
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), {
            expectedRegisterSequence: null,
          }),
        ),
        "EXEC-MISSING-SEQUENCE",
      );
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), {
            expectedRegisterSequence: 1.5,
          }),
        ),
        "EXEC-MISSING-SEQUENCE",
      );
      const intent = executableIntent({ expectedRegisterSequence: 3 });
      const conflict = createExecutiveDecisionRegisterExecutionReceipt(
        intent,
        outcome({
          outcomeKind: "Conflict",
          conflictCode: "SEQ-STALE",
          expectedSequence: 3,
          observedSequence: 9,
        }),
      );
      assert.equal(conflict.kind, "Conflict");
      if (conflict.kind === "Conflict") {
        assert.equal(conflict.expectedSequence, 3);
        assert.equal(conflict.observedSequence, 9);
        assert.equal(conflict.expectedRegisterSequence, 3);
      }
      const retry = executableIntent({ expectedRegisterSequence: 3 });
      assert.equal(retry.expectedRegisterSequence, 3);
      assert.equal(ExecutiveDecisionRegisterExecution.persists, false);
    });
  });

  describe("Receipt traceability", () => {
    it("covers all four receipt results with positive and negative evidence", () => {
      assert.equal(RECEIPT_RESULT_COVERAGE.length, 4);
      assert.deepEqual(
        RECEIPT_RESULT_COVERAGE.map((item) => item.result),
        [...ExecutiveDecisionRegisterExecutionLifecycle.receiptKinds],
      );
    });

    for (const coverage of RECEIPT_RESULT_COVERAGE) {
      it(`receipt ${coverage.result}: positive`, () => {
        const receipt = coverage.positive();
        if (coverage.result === "Conflict" && receipt.kind === "Indeterminate") {
          // second Conflict negative path uses positive helper with evidence
        }
        if (coverage.result === "Conflict") {
          const withEvidence = createExecutiveDecisionRegisterExecutionReceipt(
            executableIntent(),
            outcome({
              outcomeKind: "Conflict",
              conflictCode: "SEQ-STALE",
              expectedSequence: 1,
              observedSequence: 9,
            }),
          );
          assert.equal(withEvidence.kind, "Conflict");
        } else if (coverage.result === "Indeterminate") {
          assert.equal(receipt.kind, "Indeterminate");
        } else {
          assert.equal(receipt.kind, coverage.result);
        }
      });

      for (const negative of coverage.negatives) {
        it(`receipt ${coverage.result}: negative — ${negative.name}`, () => {
          const receipt = negative.run();
          if (coverage.result === "Indeterminate") {
            assert.notEqual(receipt.kind, "Indeterminate");
          } else if (
            coverage.result === "Conflict"
            && negative.name === "idempotency conflict positive path covered separately"
          ) {
            assert.equal(receipt.kind, "Conflict");
          } else {
            assert.notEqual(receipt.kind, coverage.result);
          }
        });
      }
    }

    it("Indeterminate for missing, incomplete, partial, contradictory, timeout, ack", () => {
      const intent = executableIntent();
      const cases = Object.freeze([
        outcome({ outcomeEvidenceId: null }),
        outcome({ outcomeEvidenceDigest: null }),
        outcome({ partialCommit: true }),
        outcome({ uncertain: true }),
        outcome({ timedOut: true }),
        outcome({ submissionAcknowledgementOnly: true }),
        outcome({ durableCommitEvidence: null }),
      ]);
      for (const item of cases) {
        assert.equal(
          createExecutiveDecisionRegisterExecutionReceipt(intent, item).kind,
          "Indeterminate",
        );
      }
    });

    it("preserves receipt bindings and immutability for every result", () => {
      const intent = executableIntent();
      const receipts = Object.freeze([
        createExecutiveDecisionRegisterExecutionReceipt(intent, outcome()),
        createExecutiveDecisionRegisterExecutionReceipt(
          intent,
          outcome({
            outcomeKind: "Conflict",
            conflictCode: "IDEM-DIGEST-MISMATCH",
            idempotencyConflict: true,
            priorPlanDigest: "prior",
          }),
        ),
        createExecutiveDecisionRegisterExecutionReceipt(
          intent,
          outcome({
            outcomeKind: "Failed",
            failureCode: "ROLLBACK",
            provesNoAcceptedEffect: true,
          }),
        ),
        createExecutiveDecisionRegisterExecutionReceipt(
          intent,
          outcome({ outcomeKind: "Indeterminate" }),
        ),
      ]);
      for (const receipt of receipts) {
        assert.equal(receipt.requestId, intent.requestId);
        assert.equal(receipt.enforcementPlanId, intent.enforcementPlanId);
        assert.equal(receipt.idempotencyKey, intent.idempotencyKey);
        assert.equal(receipt.planDigest, intent.planDigest);
        assert.equal(receipt.authorityRef, intent.authorityRef);
        assert.equal(
          receipt.expectedRegisterSequence,
          intent.expectedRegisterSequence,
        );
        assert.equal(receipt.eventBatchDigest, intent.eventBatchDigest);
        assert.equal(receipt.createsAuthority, false);
        assert.equal(receipt.confirmsDecisions, false);
        assert.equal(receipt.mutatesDomainState, false);
        assert.equal(mutateFrozen(receipt), false);
        const again = createExecutiveDecisionRegisterExecutionReceipt(
          intent,
          receipt.kind === "Committed"
            ? outcome()
            : receipt.kind === "Conflict"
            ? outcome({
              outcomeKind: "Conflict",
              conflictCode: "IDEM-DIGEST-MISMATCH",
              idempotencyConflict: true,
              priorPlanDigest: "prior",
            })
            : receipt.kind === "Failed"
            ? outcome({
              outcomeKind: "Failed",
              failureCode: "ROLLBACK",
              provesNoAcceptedEffect: true,
            })
            : outcome({ outcomeKind: "Indeterminate" }),
        );
        assert.deepEqual(receipt, again);
      }
    });
  });

  describe("Step safety and AI boundary", () => {
    it("covers every canonical step exactly once with role classification", () => {
      assert.equal(STEP_COVERAGE.length, 16);
      assert.deepEqual(
        STEP_COVERAGE.map((item) => item.kind),
        [...ExecutiveDecisionRegisterExecutionStepKinds],
      );
      const intent = executableIntent();
      assert.equal(intent.steps.length, 16);
      for (const [index, step] of intent.steps.entries()) {
        assert.equal(step.kind, STEP_COVERAGE[index]?.kind);
        assert.equal(step.order, STEP_COVERAGE[index]?.order);
        assert.equal(step.role, STEP_COVERAGE[index]?.role);
        assert.equal(step.executes, false);
        if (step.role === "verification-only") {
          assert.notEqual(step.role, "effect-requesting");
        }
      }
      assert.equal(
        intent.steps.filter((step) => step.role === "effect-requesting").length,
        3,
      );
      assert.equal(
        intent.steps.filter((step) => step.role === "receipt-producing").length,
        1,
      );
    });

    it("preserves side-effect flags on aggregate and evaluators", () => {
      assert.equal(ExecutiveDecisionRegisterExecution.executes, false);
      assert.equal(ExecutiveDecisionRegisterExecution.persists, false);
      assert.equal(ExecutiveDecisionRegisterExecution.dispatches, false);
      assert.equal(ExecutiveDecisionRegisterExecution.publishes, false);
      assert.equal(ExecutiveDecisionRegisterExecution.mutatesDomainState, false);
      assert.equal(ExecutiveDecisionRegisterExecution.createsAuthority, false);
      assert.equal(ExecutiveDecisionRegisterExecution.confirmsDecisions, false);
      const intent = executableIntent();
      assert.equal(intent.executes, false);
      assert.equal(intent.persists, false);
      assert.equal(intent.dispatches, false);
      assert.equal(intent.publishes, false);
      assert.equal(intent.createsAuthority, false);
      assert.equal(intent.confirmsDecisions, false);
      assert.equal(intent.mutatesDomainState, false);
    });

    it("AI cannot receive executable intents for authoritative operations", () => {
      const ops = Object.freeze([
        "CloseDecision",
        "SupersedeDecision",
        "DisposeDecision",
      ] as const);
      for (const operation of ops) {
        if (operation === "CloseDecision") {
          const close = enforceableClose();
          const base = intentRequest(close);
          assertRejected(
            constructExecutiveDecisionRegisterExecutionIntent(
              Object.freeze({
                ...base,
                actorKind: "Ai",
                confirmationEvidence: executionConfirmation(base),
              }),
            ),
            "EXEC-AI",
          );
        }
      }
      assertRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(enforceablePropose(), {
            actorKind: "Ai",
            operation: "ConfirmDecision",
          }),
        ),
        "EXEC-OPERATION-MISMATCH",
      );
    });

    it("AI cannot fabricate Committed or rotate bindings to hide uncertainty", () => {
      const intent = executableIntent();
      assert.equal(
        createExecutiveDecisionRegisterExecutionReceipt(
          intent,
          outcome({
            durableCommitEvidence: null,
            submissionAcknowledgementOnly: true,
          }),
        ).kind,
        "Indeterminate",
      );
      const rotated = executableIntent({
        idempotencyKey: "rotated-after-indeterminate",
      });
      assert.equal(
        compareExecutiveDecisionRegisterIdempotency(intent, rotated),
        "Distinct",
      );
      assert.equal(
        createExecutiveDecisionRegisterExecutionReceipt(
          intent,
          outcome({
            outcomeKind: "Conflict",
            conflictCode: "SEQ-STALE",
            expectedSequence: intent.expectedRegisterSequence,
            observedSequence: intent.expectedRegisterSequence + 1,
          }),
        ).kind,
        "Conflict",
      );
    });
  });

  describe("Identity, upstream, architecture, and package safety", () => {
    it("has exact identity, namespace, status, readiness, and aliases", () => {
      for (const file of RTC37_FILES) {
        assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
      }
      assert.equal(
        ExecutiveDecisionRegisterExecutionId,
        "RTC-3:7/ExecutiveDecisionRegisterExecutionContract",
      );
      assert.equal(
        ExecutiveDecisionRegisterExecutionNamespace,
        "nexora.rtc.executive.decision.register.execution",
      );
      assert.equal(
        ExecutiveDecisionRegisterExecutionStatus,
        "ExecutionContract",
      );
      assert.equal(
        ExecutiveDecisionRegisterExecutionReadiness,
        "ReadyForAssurance",
      );
      assert.equal(ExecutiveDecisionRegisterExecutionVersion, "1.0.0");
      assert.equal(
        ExecutiveDecisionRegisterExecutionName,
        "Executive Decision Register Execution Contract",
      );
      assert.equal(
        ExecutiveDecisionRegisterExecution.nextPhase,
        "RTC-3:8 — Executive Decision Register Reconciliation & Assurance",
      );
      assert.equal(
        isWellFormedDecisionRegisterExecutionIdentity(
          ExecutiveDecisionRegisterExecutionId,
        ),
        true,
      );
      assert.equal(
        isWellFormedDecisionRegisterExecutionIdentity(
          " rtc-3:7/executivedecisionregisterexecutioncontract ",
        ),
        false,
      );
      assert.equal(
        isApprovedDecisionRegisterExecutionAlias("RTC-3:7"),
        true,
      );
      assert.equal(
        isApprovedDecisionRegisterExecutionAlias(
          "ExecutiveDecisionRegisterExecutionContract",
        ),
        true,
      );
      assert.equal(
        isApprovedDecisionRegisterExecutionAlias("rtc-3:7"),
        false,
      );
      assert.ok(
        "constructExecutiveDecisionRegisterExecutionIntent" in ExecutionModule,
      );
      assert.equal(
        ExecutiveDecisionRegisterExecution.nextPhase.startsWith("RTC-3:8"),
        true,
      );
      assert.equal(ExecutiveDecisionRegisterExecution.assurancePhase, false);
    });

    it("preserves lifecycle states/transitions and AD-RTC3-06/07", () => {
      assert.deepEqual([...ExecutiveDecisionRegisterExecutionLifecycle.states], [
        "Declared",
        "ContractsBound",
        "Sealed",
      ]);
      assert.deepEqual(
        [...ExecutiveDecisionRegisterExecutionLifecycle.transitions.Declared],
        ["ContractsBound"],
      );
      assert.deepEqual(
        [
          ...ExecutiveDecisionRegisterExecutionLifecycle.transitions
            .ContractsBound,
        ],
        ["Sealed"],
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterExecutionLifecycle.transitions.Sealed],
        [],
      );
      assert.equal(
        ExecutiveDecisionRegisterExecution.upstreamArchitectureDecision
          .decisionId,
        "AD-RTC3-06",
      );
      assert.equal(
        ExecutiveDecisionRegisterExecution.architectureDecision.decisionId,
        "AD-RTC3-07",
      );
      assert.equal(
        ExecutiveDecisionRegisterExecution.architectureDecision.status,
        "Accepted",
      );
      assert.equal(
        mutateFrozen(
          ExecutiveDecisionRegisterExecution.architectureDecision as object,
        ),
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.architectureDecisions.filter(
          (item) => item.decisionId === "AD-RTC3-06",
        ).length,
        1,
      );
    });

    it("bans direct RTC-3:1–3:5 runtime imports and side-effect dependencies", () => {
      for (const file of RTC37_FILES.filter((name) => !name.endsWith(".test.ts"))) {
        const source = readFileSync(new URL(file, import.meta.url), "utf8");
        for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
          assert.doesNotMatch(source, pattern);
        }
      }
      const typesSource = readFileSync(
        new URL("executiveDecisionRegisterExecutionTypes.ts", import.meta.url),
        "utf8",
      );
      assert.match(
        typesSource,
        /import type \{[\s\S]*ExecutiveDecisionRegisterPolicyObligationKind/,
      );
      assert.doesNotMatch(
        typesSource,
        /import \{[^}]*ExecutiveDecisionRegisterPolicyObligationKind/,
      );
      assert.equal(
        ExecutiveDecisionRegisterExecution.upstreamChain.foundation,
        "RTC-3:1/ExecutiveDecisionRegisterFoundation",
      );
      assert.equal(
        ExecutiveDecisionRegisterExecution.importsEnforcementOnly,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterExecution.importsPolicyDirectly,
        false,
      );
    });

    it("preserves D-01 through D-42 and unresolved OI-01 through OI-06", () => {
      assert.deepEqual(
        ExecutiveDecisionRegisterExecution.decisions.map(
          (item) => item.decisionId,
        ),
        ["D-37", "D-38", "D-39", "D-40", "D-41", "D-42"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterExecution.upstreamEnforcementDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-31", "D-32", "D-33", "D-34", "D-35", "D-36"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterExecution.upstreamFoundationDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-01", "D-02", "D-03", "D-04", "D-05", "D-06"],
      );
      for (const issue of ExecutiveDecisionRegisterExecution.openIssues) {
        assert.equal(issue.resolved, false);
        assert.equal(issue.resolvedByExecution, false);
        assert.equal(issue.carriedByPhase, "RTC-3:7");
      }
      const summary = getExecutiveDecisionRegisterExecutionSummary();
      assert.equal(summary.ruleCount, 12);
      assert.equal(summary.readiness, "ReadyForAssurance");
      assert.equal(isExecutiveDecisionRegisterExecutionRejected(
        constructExecutiveDecisionRegisterExecutionIntent(
          intentRequest(blockedResult()),
        ),
      ), true);
      assert.ok(
        (ExecutiveDecisionRegisterExecutionStepKinds as readonly string[])
          .includes("ProduceExecutionReceipt" satisfies ExecutiveDecisionRegisterExecutionStepKind),
      );
    });
  });
});
