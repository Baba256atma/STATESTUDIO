/**
 * RTC-3:8 — Executive Decision Register Reconciliation & Assurance Tests.
 *
 * Direct coverage for rules, results, findings, bindings, receipts, evidence,
 * and subjects. No mocks. No randomness. No network. No databases.
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
  ExecutiveDecisionRegisterEnforcementPlan,
  ExecutiveDecisionRegisterEnforcementRequest,
  ExecutiveDecisionRegisterEnforcementResult,
} from "./executiveDecisionRegisterEnforcementTypes.ts";
import {
  constructExecutiveDecisionRegisterExecutionIntent,
  createExecutiveDecisionRegisterExecutionReceipt,
  ExecutiveDecisionRegisterExecution,
} from "./executiveDecisionRegisterExecution.ts";
import type {
  ExecutiveDecisionRegisterExecutionIntent,
  ExecutiveDecisionRegisterExecutionIntentRequest,
  ExecutiveDecisionRegisterExecutionOutcomeEvidence,
  ExecutiveDecisionRegisterExecutionReceipt,
  ExecutiveDecisionRegisterProposedEventDescriptor,
} from "./executiveDecisionRegisterExecutionTypes.ts";
import * as AssuranceModule from "./executiveDecisionRegisterAssurance.ts";
import {
  assessExecutiveDecisionRegisterAssurance,
  ExecutiveDecisionRegisterAssurance,
  ExecutiveDecisionRegisterAssuranceId,
  ExecutiveDecisionRegisterAssuranceNamespace,
  ExecutiveDecisionRegisterAssuranceReadiness,
  ExecutiveDecisionRegisterAssuranceStatus,
  getExecutiveDecisionRegisterAssuranceSummary,
  isExecutiveDecisionRegisterAssured,
  isExecutiveDecisionRegisterNotAssured,
  reconcileExecutiveDecisionRegisterEvidenceBundle,
  reconcileExecutiveDecisionRegisterIntentReceipt,
} from "./executiveDecisionRegisterAssurance.ts";
import {
  ExecutiveDecisionRegisterAssuranceFindingCodes,
  ExecutiveDecisionRegisterAssuranceRules,
} from "./executiveDecisionRegisterAssuranceRules.ts";
import {
  ExecutiveDecisionRegisterAssuranceEvidenceKinds,
  ExecutiveDecisionRegisterAssuranceResultPrecedence,
  ExecutiveDecisionRegisterAssuranceSubjectKinds,
} from "./executiveDecisionRegisterAssuranceLifecycle.ts";
import {
  isApprovedDecisionRegisterAssuranceAlias,
  isWellFormedDecisionRegisterAssuranceIdentity,
  isWellFormedDecisionRegisterAssuranceNamespace,
} from "./executiveDecisionRegisterAssuranceIdentity.ts";
import type {
  ExecutiveDecisionRegisterAssuranceEvidenceItem,
  ExecutiveDecisionRegisterAssuranceResultKind,
} from "./executiveDecisionRegisterAssuranceTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC38_FILES = Object.freeze([
  "executiveDecisionRegisterAssurance.ts",
  "executiveDecisionRegisterAssuranceTypes.ts",
  "executiveDecisionRegisterAssuranceIdentity.ts",
  "executiveDecisionRegisterAssuranceLifecycle.ts",
  "executiveDecisionRegisterAssuranceContracts.ts",
  "executiveDecisionRegisterAssuranceRules.ts",
  "executiveDecisionRegisterAssuranceMetadata.ts",
  "executiveDecisionRegisterAssurance.test.ts",
]);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']next["']/,
  /from ["']\.\/executiveDecisionRegisterFoundation\.ts["']/,
  /from ["']\.\/executiveDecisionRegisterRegistry\.ts["']/,
  /from ["']\.\/executiveDecisionRegisterModel\.ts["']/,
  /from ["']\.\/executiveDecisionRegisterValidation\.ts["']/,
  /from ["']\.\/executiveDecisionRegisterPolicy\.ts["']/,
  /from ["']\.\/executiveDecisionRegisterEnforcement\.ts["']/,
  /from ["']\.\/executiveJournalRuntime/,
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /Math\.random/,
  /Date\.now/,
]);

const mutateFrozen = (value: object): boolean => {
  try {
    Reflect.set(value, "__mutation_probe__", true);
    return Reflect.has(value, "__mutation_probe__");
  } catch {
    return false;
  }
};

const VALIDATION_REF = "RTC-3:4/ExecutiveDecisionRegisterValidation" as const;

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

const enforceablePropose = (): ExecutiveDecisionRegisterEnforcementResult => {
  const result = planExecutiveDecisionRegisterEnforcement(
    enforcementRequest(evaluateExecutiveDecisionRegisterPolicy(policyRequest())),
  );
  assert.equal(result.kind, "Enforceable");
  return result;
};

const proposedEvent = (
  overrides: Partial<ExecutiveDecisionRegisterProposedEventDescriptor> = {},
): ExecutiveDecisionRegisterProposedEventDescriptor =>
  Object.freeze({
    eventIdDescriptor: "evt-1",
    eventType: "PrepareProposalEvent",
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

const canonicalBatchFor = (
  plan: ExecutiveDecisionRegisterEnforcementPlan,
): readonly ExecutiveDecisionRegisterProposedEventDescriptor[] => {
  const seen = new Set<string>();
  const kinds: string[] = [];
  for (const step of plan.steps) {
    if (!seen.has(step.kind)) {
      seen.add(step.kind);
      kinds.push(step.kind);
    }
  }
  return Object.freeze(
    kinds.map((stepKind, index) =>
      proposedEvent({
        eventIdDescriptor: `evt-${index}`,
        eventType: stepKind,
        sequenceOffset: index,
        stepKind,
      })
    ),
  );
};

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
    proposedEvents: plan ? canonicalBatchFor(plan) : Object.freeze([proposedEvent()]),
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

const executablePair = (): {
  readonly intent: ExecutiveDecisionRegisterExecutionIntent;
  readonly plan: ExecutiveDecisionRegisterEnforcementPlan;
} => {
  const enforced = enforceablePropose();
  assert.equal(enforced.kind, "Enforceable");
  if (enforced.kind !== "Enforceable") {
    assert.fail("expected Enforceable");
  }
  const constructed = constructExecutiveDecisionRegisterExecutionIntent(
    intentRequest(enforced),
  );
  assert.equal(constructed.kind, "Executable");
  if (constructed.kind !== "Executable") {
    assert.fail("expected Executable");
  }
  return Object.freeze({
    intent: constructed.intent,
    plan: enforced.plan,
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

const evidenceItem = (
  overrides: Partial<ExecutiveDecisionRegisterAssuranceEvidenceItem> = {},
): ExecutiveDecisionRegisterAssuranceEvidenceItem => {
  const pair = executablePair();
  return Object.freeze({
    evidenceId: "ev-1",
    evidenceKind: "CommitEvidence",
    producingSource: "external-executor",
    requestId: pair.intent.requestId,
    intentId: pair.intent.intentId,
    batchDigest: pair.intent.eventBatchDigest,
    receiptId: null,
    idempotencyKey: pair.intent.idempotencyKey,
    planDigest: pair.intent.planDigest,
    evidenceDigest: "digest-1",
    observedSequence: 1,
    completeness: "Complete",
    metadataOnly: true as const,
    immutable: true as const,
    containsPayload: false as const,
    ...overrides,
  });
};

const committedReceipt = (
  intent: ExecutiveDecisionRegisterExecutionIntent,
): ExecutiveDecisionRegisterExecutionReceipt =>
  createExecutiveDecisionRegisterExecutionReceipt(intent, outcome());

type RuleCoverage = {
  readonly ruleKey: string;
  readonly ruleId: string;
  readonly expectedKind: ExecutiveDecisionRegisterAssuranceResultKind;
  readonly expectedCode: string;
  readonly run: () => ReturnType<typeof assessExecutiveDecisionRegisterAssurance>;
};

const RULE_COVERAGE: readonly RuleCoverage[] = Object.freeze([
  Object.freeze({
    ruleKey: "AggregateIdentity",
    ruleId: "RTC-3:8/Rule/01",
    expectedKind: "Assured" as const,
    expectedCode: "ASR-ASSURED",
    run: () => {
      const { intent } = executablePair();
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
      );
    },
  }),
  Object.freeze({
    ruleKey: "BundleShape",
    ruleId: "RTC-3:8/Rule/02",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-MALFORMED-REQUEST",
    run: () =>
      reconcileExecutiveDecisionRegisterEvidenceBundle(
        Object.freeze({
          bundleId: "b-missing",
          assuranceRequestId: "a-1",
          intent: null,
          receipt: null,
          enforcementPlan: null,
          evidenceItems: Object.freeze([]),
          reportedAppendOnlyViolation: false,
          reportedHistoricalErasure: false,
          reportedAuthorityCreated: false,
          reportedAuthorityBroadened: false,
          reportedConfirmationSubstituted: false,
          reportedAiAuthoritativeAction: false,
          reportedSilentRebase: false,
          reportedIdempotencyRotation: false,
          reportedProjectionCreatesAuthority: false,
          reportedProjectionErasesProvenance: false,
          reportedUnauthorizedDisclosure: false,
          reportedRetentionAltered: false,
          reportedTelemetryContainsPayload: false,
          reportedIndeterminateUpgraded: false,
          requiresUnresolvedOpenIssueDefault: false,
          metadataOnly: true as const,
          immutable: true as const,
          containsPayload: false as const,
        }),
      ),
  }),
  Object.freeze({
    ruleKey: "PlanReference",
    ruleId: "RTC-3:8/Rule/03",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-PLAN-REFERENCE-MISMATCH",
    run: () => {
      const { intent, plan } = executablePair();
      const other = enforceablePropose();
      assert.equal(other.kind, "Enforceable");
      if (other.kind !== "Enforceable") {
        assert.fail("expected Enforceable");
      }
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        { enforcementPlan: other.plan === plan ? Object.freeze({ ...other.plan }) : other.plan },
      );
    },
  }),
  Object.freeze({
    ruleKey: "ExecutableOnly",
    ruleId: "RTC-3:8/Rule/04",
    expectedKind: "Assured" as const,
    expectedCode: "ASR-ASSURED",
    run: () => {
      const { intent } = executablePair();
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
      );
    },
  }),
  Object.freeze({
    ruleKey: "BatchIntegrity",
    ruleId: "RTC-3:8/Rule/05",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-EMPTY-BATCH",
    run: () => {
      const { intent, plan } = executablePair();
      const broken = Object.freeze({
        ...intent,
        eventBatch: Object.freeze([]) as readonly [],
      });
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        broken as ExecutiveDecisionRegisterExecutionIntent,
        committedReceipt(intent),
        { enforcementPlan: plan },
      );
    },
  }),
  Object.freeze({
    ruleKey: "RequestPlanBinding",
    ruleId: "RTC-3:8/Rule/06",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-REQUEST-MISMATCH",
    run: () => {
      const { intent, plan } = executablePair();
      const broken = Object.freeze({ ...intent, requestId: "other-req" });
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        broken as ExecutiveDecisionRegisterExecutionIntent,
        committedReceipt(intent),
        { enforcementPlan: plan },
      );
    },
  }),
  Object.freeze({
    ruleKey: "AuthorityObligationBinding",
    ruleId: "RTC-3:8/Rule/07",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-AUTHORITY-MISMATCH",
    run: () => {
      const { intent, plan } = executablePair();
      const broken = Object.freeze({ ...intent, authorityRef: "other-auth" });
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        broken as ExecutiveDecisionRegisterExecutionIntent,
        committedReceipt(intent),
        { enforcementPlan: plan },
      );
    },
  }),
  Object.freeze({
    ruleKey: "KeyDigestBinding",
    ruleId: "RTC-3:8/Rule/08",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-IDEMPOTENCY-KEY-MISMATCH",
    run: () => {
      const { intent } = executablePair();
      const receipt = committedReceipt(intent);
      const brokenReceipt = Object.freeze({
        ...receipt,
        idempotencyKey: "rotated-key",
      });
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        brokenReceipt as ExecutiveDecisionRegisterExecutionReceipt,
      );
    },
  }),
  Object.freeze({
    ruleKey: "SequenceBinding",
    ruleId: "RTC-3:8/Rule/09",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-SILENT-REBASE",
    run: () => {
      const { intent } = executablePair();
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        { reportedSilentRebase: true },
      );
    },
  }),
  Object.freeze({
    ruleKey: "ReceiptClaimSupport",
    ruleId: "RTC-3:8/Rule/10",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-ACK-AS-COMMIT",
    run: () => {
      const { intent } = executablePair();
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        {
          evidenceItems: Object.freeze([
            evidenceItem({
              evidenceKind: "AcknowledgementEvidence",
              requestId: intent.requestId,
              intentId: intent.intentId,
              batchDigest: intent.eventBatchDigest,
              idempotencyKey: intent.idempotencyKey,
              planDigest: intent.planDigest,
            }),
          ]),
        },
      );
    },
  }),
  Object.freeze({
    ruleKey: "CommitCompleteness",
    ruleId: "RTC-3:8/Rule/11",
    expectedKind: "Indeterminate" as const,
    expectedCode: "ASR-MISSING-COMMIT-EVIDENCE",
    run: () => {
      const { intent } = executablePair();
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        { evidenceItems: Object.freeze([]) },
      );
    },
  }),
  Object.freeze({
    ruleKey: "AppendOnlyControls",
    ruleId: "RTC-3:8/Rule/12",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-APPEND-ONLY",
    run: () => {
      const { intent } = executablePair();
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        { reportedAppendOnlyViolation: true },
      );
    },
  }),
  Object.freeze({
    ruleKey: "AuthorityControls",
    ruleId: "RTC-3:8/Rule/13",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-AUTHORITY-CREATED",
    run: () => {
      const { intent } = executablePair();
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        { reportedAuthorityCreated: true },
      );
    },
  }),
  Object.freeze({
    ruleKey: "ConfirmationControls",
    ruleId: "RTC-3:8/Rule/14",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-CONFIRMATION-MISMATCH",
    run: () => {
      const { intent } = executablePair();
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        { reportedConfirmationSubstituted: true },
      );
    },
  }),
  Object.freeze({
    ruleKey: "AiProhibitions",
    ruleId: "RTC-3:8/Rule/15",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-AI-AUTHORITATIVE",
    run: () => {
      const { intent } = executablePair();
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        { reportedAiAuthoritativeAction: true },
      );
    },
  }),
  Object.freeze({
    ruleKey: "PrivacyControls",
    ruleId: "RTC-3:8/Rule/16",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-UNAUTHORIZED-DISCLOSURE",
    run: () => {
      const { intent } = executablePair();
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        { reportedUnauthorizedDisclosure: true },
      );
    },
  }),
  Object.freeze({
    ruleKey: "ProjectionControls",
    ruleId: "RTC-3:8/Rule/17",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-PROJECTION-AUTHORITY",
    run: () => {
      const { intent } = executablePair();
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        { reportedProjectionCreatesAuthority: true },
      );
    },
  }),
  Object.freeze({
    ruleKey: "IndeterminatePreservation",
    ruleId: "RTC-3:8/Rule/18",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-INDETERMINATE-UPGRADED",
    run: () => {
      const { intent } = executablePair();
      const receipt = createExecutiveDecisionRegisterExecutionReceipt(
        intent,
        outcome({ uncertain: true }),
      );
      return reconcileExecutiveDecisionRegisterIntentReceipt(intent, receipt, {
        reportedIndeterminateUpgraded: true,
      });
    },
  }),
  Object.freeze({
    ruleKey: "RetentionControls",
    ruleId: "RTC-3:8/Rule/19",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-RETENTION-ALTERED",
    run: () => {
      const { intent } = executablePair();
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        { reportedRetentionAltered: true },
      );
    },
  }),
  Object.freeze({
    ruleKey: "TelemetryMetadataOnly",
    ruleId: "RTC-3:8/Rule/20",
    expectedKind: "NotAssured" as const,
    expectedCode: "ASR-TELEMETRY-PAYLOAD",
    run: () => {
      const { intent } = executablePair();
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        { reportedTelemetryContainsPayload: true },
      );
    },
  }),
  Object.freeze({
    ruleKey: "OpenIssueDefaults",
    ruleId: "RTC-3:8/Rule/21",
    expectedKind: "Indeterminate" as const,
    expectedCode: "ASR-OPEN-ISSUE",
    run: () => {
      const { intent } = executablePair();
      return reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        { requiresUnresolvedOpenIssueDefault: true },
      );
    },
  }),
]);

describe("RTC-3:8 Executive Decision Register Reconciliation & Assurance", () => {
  describe("Rule traceability", () => {
    it("covers every canonical rule exactly once in production order", () => {
      assert.equal(ExecutiveDecisionRegisterAssuranceRules.length, 21);
      assert.equal(RULE_COVERAGE.length, 21);
      assert.deepEqual(
        RULE_COVERAGE.map((item) => item.ruleKey),
        ExecutiveDecisionRegisterAssuranceRules.map((item) => item.ruleKey),
      );
    });

    for (const coverage of RULE_COVERAGE) {
      it(`direct coverage: ${coverage.ruleId} ${coverage.ruleKey}`, () => {
        const result = coverage.run();
        assert.equal(result.kind, coverage.expectedKind);
        assert.equal(result.reasonCode, coverage.expectedCode);
        assert.equal(result.repairs, false);
        assert.equal(result.certifies, false);
        assert.equal(result.authorizesDeployment, false);
      });
    }
  });

  describe("Identity and upstream", () => {
    it("has exact identity, namespace, status, readiness, phases, aliases", () => {
      for (const file of RTC38_FILES) {
        assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
      }
      assert.equal(
        ExecutiveDecisionRegisterAssuranceId,
        "RTC-3:8/ExecutiveDecisionRegisterAssurance",
      );
      assert.equal(
        ExecutiveDecisionRegisterAssuranceNamespace,
        "nexora.rtc.executive.decision.register.assurance",
      );
      assert.equal(ExecutiveDecisionRegisterAssuranceStatus, "Assurance");
      assert.equal(
        ExecutiveDecisionRegisterAssuranceReadiness,
        "ReadyForCertification",
      );
      assert.equal(
        ExecutiveDecisionRegisterAssurance.previousPhase,
        "RTC-3:7 — Executive Decision Register Execution Contract",
      );
      assert.equal(
        ExecutiveDecisionRegisterAssurance.nextPhase,
        "RTC-3:9 — Executive Decision Register Certification & Release Readiness",
      );
      assert.equal(
        isWellFormedDecisionRegisterAssuranceIdentity(
          ExecutiveDecisionRegisterAssuranceId,
        ),
        true,
      );
      assert.equal(
        isWellFormedDecisionRegisterAssuranceIdentity(
          " rtc-3:8/executivedecisionregisterassurance ",
        ),
        false,
      );
      assert.equal(
        isApprovedDecisionRegisterAssuranceAlias("RTC-3:8"),
        true,
      );
      assert.equal(
        isApprovedDecisionRegisterAssuranceAlias("rtc-3:8"),
        false,
      );
      assert.equal(
        isWellFormedDecisionRegisterAssuranceNamespace(
          ExecutiveDecisionRegisterAssuranceNamespace,
        ),
        true,
      );
      assert.ok("assessExecutiveDecisionRegisterAssurance" in AssuranceModule);
      assert.equal(
        ExecutiveDecisionRegisterAssurance.certificationPhase,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterAssurance.assurancePhase,
        true,
      );
    });

    it("preserves exact RTC-3:7 aggregate and AI prohibitions by reference", () => {
      assert.equal(
        ExecutiveDecisionRegisterAssurance.execution,
        ExecutiveDecisionRegisterExecution,
      );
      assert.equal(
        ExecutiveDecisionRegisterAssurance.aiMustNot,
        ExecutiveDecisionRegisterExecution.aiMustNot,
      );
      assert.equal(
        ExecutiveDecisionRegisterAssurance.upstreamArchitectureDecisionAdrtc306,
        ExecutiveDecisionRegisterExecution.upstreamArchitectureDecision,
      );
      assert.equal(
        ExecutiveDecisionRegisterAssurance.upstreamArchitectureDecisionAdrtc307,
        ExecutiveDecisionRegisterExecution.architectureDecision,
      );
      assert.equal(
        ExecutiveDecisionRegisterAssurance.architectureDecision.decisionId,
        "AD-RTC3-08",
      );
      assert.equal(
        ExecutiveDecisionRegisterAssurance.architectureDecision.status,
        "Accepted",
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterAssurance.architectureDecisionIds],
        ["AD-RTC3-06", "AD-RTC3-07", "AD-RTC3-08"],
      );
    });

    it("bans direct RTC-3:1–3:6 runtime imports", () => {
      for (const file of RTC38_FILES.filter((name) => !name.endsWith(".test.ts"))) {
        const source = readFileSync(new URL(file, import.meta.url), "utf8");
        for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
          // Type-only EnforcementTypes import is allowed in types/rules.
          if (
            pattern.source.includes("Enforcement")
            && file.endsWith("Types.ts")
          ) {
            continue;
          }
          if (
            pattern.source.includes("Enforcement")
            && file.endsWith("Rules.ts")
          ) {
            // rules may type-import EnforcementPlan
            const runtimeImport =
              /import \{[^}]*ExecutiveDecisionRegisterEnforcement[^}]*\} from ["']\.\/executiveDecisionRegisterEnforcement\.ts["']/;
            assert.doesNotMatch(source, runtimeImport);
            continue;
          }
          assert.doesNotMatch(source, pattern);
        }
      }
      assert.equal(
        ExecutiveDecisionRegisterAssurance.importsExecutionOnly,
        true,
      );
      assert.equal(
        ExecutiveDecisionRegisterAssurance.upstreamChain.foundation,
        "RTC-3:1/ExecutiveDecisionRegisterFoundation",
      );
    });
  });

  describe("Assurance results and precedence", () => {
    it("Assured for complete committed evidence", () => {
      const { intent } = executablePair();
      const result = reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
      );
      assert.equal(result.kind, "Assured");
      assert.equal(result.reasonCode, "ASR-ASSURED");
      assert.equal(isExecutiveDecisionRegisterAssured(result), true);
      assert.equal(result.findings.length, 0);
      assert.equal(mutateFrozen(result), false);
    });

    it("NotAssured for definitive control violation", () => {
      const { intent } = executablePair();
      const result = reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        { reportedAppendOnlyViolation: true },
      );
      assert.equal(result.kind, "NotAssured");
      assert.equal(isExecutiveDecisionRegisterNotAssured(result), true);
    });

    it("Indeterminate for missing commit evidence", () => {
      const { intent } = executablePair();
      const result = reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        { evidenceItems: Object.freeze([]) },
      );
      assert.equal(result.kind, "Indeterminate");
    });

    it("precedence NotAssured > Indeterminate > Assured", () => {
      assert.deepEqual(
        [...ExecutiveDecisionRegisterAssuranceResultPrecedence],
        ["NotAssured", "Indeterminate", "Assured"],
      );
      const { intent } = executablePair();
      const both = reconcileExecutiveDecisionRegisterIntentReceipt(
        intent,
        committedReceipt(intent),
        {
          evidenceItems: Object.freeze([]),
          reportedAppendOnlyViolation: true,
        },
      );
      assert.equal(both.kind, "NotAssured");
    });
  });

  describe("Receipt reconciliation", () => {
    it("Committed / Conflict / Failed / Indeterminate paths", () => {
      const { intent } = executablePair();
      assert.equal(
        reconcileExecutiveDecisionRegisterIntentReceipt(
          intent,
          committedReceipt(intent),
        ).kind,
        "Assured",
      );
      const conflict = createExecutiveDecisionRegisterExecutionReceipt(
        intent,
        outcome({
          outcomeKind: "Conflict",
          conflictCode: "SEQ-STALE",
          expectedSequence: 1,
          observedSequence: 9,
        }),
      );
      assert.equal(
        reconcileExecutiveDecisionRegisterIntentReceipt(intent, conflict).kind,
        "Assured",
      );
      const failed = createExecutiveDecisionRegisterExecutionReceipt(
        intent,
        outcome({
          outcomeKind: "Failed",
          failureCode: "EXEC-FAILED",
          provesNoAcceptedEffect: true,
        }),
      );
      assert.equal(
        reconcileExecutiveDecisionRegisterIntentReceipt(intent, failed).kind,
        "Assured",
      );
      const indeterminate = createExecutiveDecisionRegisterExecutionReceipt(
        intent,
        outcome({ uncertain: true }),
      );
      assert.equal(
        reconcileExecutiveDecisionRegisterIntentReceipt(intent, indeterminate)
          .kind,
        "Assured",
      );
      assert.equal(
        reconcileExecutiveDecisionRegisterIntentReceipt(intent, conflict, {
          evidenceItems: Object.freeze([]),
        }).kind,
        "Indeterminate",
      );
      assert.equal(
        reconcileExecutiveDecisionRegisterIntentReceipt(intent, failed, {
          evidenceItems: Object.freeze([
            evidenceItem({
              evidenceKind: "TimeoutEvidence",
              requestId: intent.requestId,
              intentId: intent.intentId,
              batchDigest: intent.eventBatchDigest,
              idempotencyKey: intent.idempotencyKey,
              planDigest: intent.planDigest,
            }),
          ]),
        }).kind,
        "Indeterminate",
      );
    });
  });

  describe("Bindings, batch, idempotency, concurrency", () => {
    it("binding mismatches fail closed and preserve mutation safety", () => {
      const { intent, plan } = executablePair();
      const request = Object.freeze({
        intent,
        receipt: committedReceipt(intent),
        plan,
      });
      const before = JSON.stringify(request);
      const result = reconcileExecutiveDecisionRegisterIntentReceipt(
        Object.freeze({ ...intent, actorId: "other" }) as ExecutiveDecisionRegisterExecutionIntent,
        request.receipt,
        { enforcementPlan: plan },
      );
      assert.equal(result.kind, "NotAssured");
      assert.equal(result.reasonCode, "ASR-ACTOR-MISMATCH");
      assert.equal(JSON.stringify(request), before);
    });

    it("missing/extra/unknown/reordered steps and mixed bindings", () => {
      const { intent, plan } = executablePair();
      const kinds = intent.eventBatch.map((event) => event.stepKind);
      const withoutFirst = Object.freeze({
        ...intent,
        eventBatch: Object.freeze(
          intent.eventBatch.slice(1).map((event, index) =>
            proposedEvent({ ...event, sequenceOffset: index })
          ),
        ),
      });
      assert.equal(
        reconcileExecutiveDecisionRegisterIntentReceipt(
          withoutFirst as ExecutiveDecisionRegisterExecutionIntent,
          committedReceipt(intent),
          { enforcementPlan: plan },
        ).reasonCode,
        "ASR-MISSING-STEP",
      );
      const withExtra = Object.freeze({
        ...intent,
        eventBatch: Object.freeze([
          ...intent.eventBatch,
          proposedEvent({
            stepKind: "PrepareClosureEvent",
            eventType: "PrepareClosureEvent",
            sequenceOffset: kinds.length,
            eventIdDescriptor: "evt-extra",
          }),
        ]),
      });
      assert.equal(
        reconcileExecutiveDecisionRegisterIntentReceipt(
          withExtra as ExecutiveDecisionRegisterExecutionIntent,
          committedReceipt(intent),
          { enforcementPlan: plan },
        ).reasonCode,
        "ASR-EXTRA-STEP",
      );
      assert.equal(
        reconcileExecutiveDecisionRegisterIntentReceipt(
          intent,
          committedReceipt(intent),
          { reportedIdempotencyRotation: true },
        ).reasonCode,
        "ASR-IDEMPOTENCY-ROTATION",
      );
    });
  });

  describe("Coverage completeness tables", () => {
    it("subjects and evidence kinds are closed and covered", () => {
      assert.equal(ExecutiveDecisionRegisterAssuranceSubjectKinds.length, 20);
      assert.equal(ExecutiveDecisionRegisterAssuranceEvidenceKinds.length, 14);
      assert.ok(ExecutiveDecisionRegisterAssuranceFindingCodes.length >= 50);
      assert.equal(
        new Set(ExecutiveDecisionRegisterAssuranceFindingCodes).size,
        ExecutiveDecisionRegisterAssuranceFindingCodes.length,
      );
      assert.equal(
        ExecutiveDecisionRegisterAssuranceFindingCodes.includes("ASR-ASSURED"),
        true,
      );
    });

    it("ASSURANCE_RESULT_COVERAGE positive and negative", () => {
      const { intent } = executablePair();
      const results = Object.freeze([
        reconcileExecutiveDecisionRegisterIntentReceipt(
          intent,
          committedReceipt(intent),
        ),
        reconcileExecutiveDecisionRegisterIntentReceipt(
          intent,
          committedReceipt(intent),
          { reportedAppendOnlyViolation: true },
        ),
        reconcileExecutiveDecisionRegisterIntentReceipt(
          intent,
          committedReceipt(intent),
          { evidenceItems: Object.freeze([]) },
        ),
      ]);
      assert.deepEqual(
        results.map((item) => item.kind),
        ["Assured", "NotAssured", "Indeterminate"],
      );
    });
  });

  describe("Metadata and safety", () => {
    it("preserves D-43–D-48, AD-RTC3-06/07/08, and OI-01–OI-06", () => {
      assert.deepEqual(
        ExecutiveDecisionRegisterAssurance.decisions.map(
          (item) => item.decisionId,
        ),
        ["D-43", "D-44", "D-45", "D-46", "D-47", "D-48"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterAssurance.upstreamExecutionDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-37", "D-38", "D-39", "D-40", "D-41", "D-42"],
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterAssurance.upstreamFoundationDecisions.map(
          (item) => item.decisionId,
        ),
        ["D-01", "D-02", "D-03", "D-04", "D-05", "D-06"],
      );
      assert.equal(
        ExecutiveDecisionRegisterEnforcement.architectureDecision.decisionId,
        "AD-RTC3-06",
      );
      for (const issue of ExecutiveDecisionRegisterAssurance.openIssues) {
        assert.equal(issue.resolved, false);
        assert.equal(issue.resolvedByAssurance, false);
        assert.equal(issue.carriedByPhase, "RTC-3:8");
      }
      const summary = getExecutiveDecisionRegisterAssuranceSummary();
      assert.equal(summary.readiness, "ReadyForCertification");
      assert.equal(summary.ruleCount, 21);
      assert.equal(ExecutiveDecisionRegisterAssurance.executes, false);
      assert.equal(ExecutiveDecisionRegisterAssurance.persists, false);
      assert.equal(ExecutiveDecisionRegisterAssurance.certifies, false);
      assert.equal(ExecutiveDecisionRegisterAssurance.repairsInput, false);
      assert.equal(
        ExecutiveDecisionRegisterAssurance.authorizesDeployment,
        false,
      );
      assert.equal(
        assessExecutiveDecisionRegisterAssurance ===
          reconcileExecutiveDecisionRegisterEvidenceBundle,
        false,
      );
      assert.equal(
        typeof assessExecutiveDecisionRegisterAssurance,
        "function",
      );
    });
  });
});
