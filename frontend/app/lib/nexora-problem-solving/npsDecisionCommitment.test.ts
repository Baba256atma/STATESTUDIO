import assert from "node:assert/strict";
import test from "node:test";
import type { EcaExecutiveCommitmentJudgment } from "@/app/lib/nexora-conversation/ecaExecutiveCommitment.ts";
import { ECA_EXECUTIVE_COMMITMENT_IDENTITY } from "@/app/lib/nexora-conversation/ecaExecutiveCommitment.ts";
import {
  composeNpsProblemSolvingPath,
  type NpsCanonicalFacts,
} from "./npsProblemSolvingPath.ts";
import {
  composeNpsEvidenceCauseAnalysis,
  type NpsContributorFact,
  type NpsEvidenceCauseFacts,
  type NpsEvidenceItemFact,
} from "./npsEvidenceCauseAnalysis.ts";
import { composeNpsOptionGeneration } from "./npsOptionGeneration.ts";
import { composeNpsComparisonRecommendation } from "./npsComparisonRecommendation.ts";
import {
  NPS_DECISION_COMMITMENT_BOUNDARY,
  attemptNpsDecisionCommitmentAdvancement,
  composeNpsDecisionCommitment,
  npsPathStateAfterCommitment,
} from "./npsDecisionCommitment.ts";
import { applyNpsDecisionCommitmentToPresentedResponse } from "./npsDecisionCommitmentRuntime.ts";

function pathFacts(overrides: Partial<NpsCanonicalFacts> = {}): NpsCanonicalFacts {
  return Object.freeze({
    problem: Object.freeze({
      problemId: "ctx-problem-capacity",
      problemLabel: "Capacity Gap",
      confidence: "HIGH",
      observedFrom: "NPS:1",
    }),
    investigationPresent: true,
    investigationId: "inv-capacity-1",
    evidenceState: "PARTIAL",
    causeHypothesesAvailable: true,
    scenarioIds: Object.freeze([]),
    comparisonAvailable: false,
    recommendationReady: false,
    awaitingCommitment: false,
    approvedDecisionId: null,
    execution: Object.freeze({ present: false, executionId: null, status: "NONE" }),
    outcome: Object.freeze({ observed: false, problemResolved: null }),
    stageFocusId: "ctx-scenario-demand",
    conversationSubjectId: "ctx-problem-margin",
    ...overrides,
  });
}

function item(overrides: Partial<NpsEvidenceItemFact> = {}): NpsEvidenceItemFact {
  return Object.freeze({
    id: "e1",
    label: "Demand",
    classification: "OBSERVATION",
    observation: "Demand increased 18%.",
    interpretation: null,
    sourceId: "src-demand",
    sourceType: "kpi",
    field: "demand",
    timeRange: "current period",
    semanticConfidence: "CONFIRMED",
    managerConfirmation: false,
    evidenceStatus: "TRUSTED",
    existingCausalAuthority: false,
    contradicting: false,
    confounder: false,
    supportingReference: "Data Reality / CC:8",
    ...overrides,
  });
}

function contributor(overrides: Partial<NpsContributorFact> = {}): NpsContributorFact {
  return Object.freeze({
    candidateId: "demand-surge",
    label: "Demand Surge",
    relationshipToProblem: "associated with Capacity Gap",
    supportingEvidenceIds: Object.freeze(["obs-demand"]),
    contradictingEvidenceIds: Object.freeze([]),
    status: "SUPPORTED_CONTRIBUTOR",
    confidence: "medium",
    uncertainty: "Demand Surge may be related, but it is not a confirmed cause.",
    existingCausalAuthority: false,
    ...overrides,
  });
}

function comparison() {
  const canonical = pathFacts();
  const cause = composeNpsEvidenceCauseAnalysis({
    path: composeNpsProblemSolvingPath(canonical),
    pathFacts: canonical,
    facts: Object.freeze({
      items: Object.freeze([
        item({ id: "obs-demand" }),
        item({ id: "obs-cap", label: "Capacity", observation: "Available capacity remained approximately stable." }),
      ]),
      contributors: Object.freeze([contributor()]),
      hypotheses: Object.freeze([]),
      patterns: Object.freeze([]),
      nextEvidenceNeed: null,
      nextCausalTest: null,
      managerKnowledgeRequired: false,
    }) satisfies NpsEvidenceCauseFacts,
  });
  const options = composeNpsOptionGeneration({
    path: cause.path,
    pathFacts: canonical,
    analysis: cause,
    facts: Object.freeze({
      existingScenarios: Object.freeze([
        Object.freeze({
          id: "ctx-scenario-capacity",
          title: "Capacity Expansion Plan",
          mechanism: "capacity expansion",
          problemId: "ctx-problem-capacity",
        }),
      ]),
      hardConstraints: Object.freeze([]),
      externalAvailabilityUnknown: true,
      includeHiringOption: false,
      managerKnowledgeRequired: false,
    }),
  });
  return {
    canonical,
    comparison: composeNpsComparisonRecommendation({
      pathFacts: canonical,
      options,
      facts: { managerPriority: "FAST_RECOVERY" },
    }),
  };
}

function eca(overrides: Partial<EcaExecutiveCommitmentJudgment>): EcaExecutiveCommitmentJudgment {
  return {
    identity: ECA_EXECUTIVE_COMMITMENT_IDENTITY,
    commitmentState: "NONE",
    target: null,
    targetResolution: "UNKNOWN",
    preDecisionChallenge: "NONE",
    challengeRequired: false,
    challengeAcknowledged: false,
    confirmationRequired: false,
    canonicalHandoffAllowed: false,
    canonicalAuthority: "CC:10 Decision Commitment",
    uncertaintyAcknowledged: false,
    reusedSuggestedManagerTurns: Object.freeze([]),
    managerFacingNote: null,
    speak: false,
    commitmentReview: false,
    falseCommitment: false,
    staleYesMutation: false,
    targetDrift: false,
    unnecessaryBlocker: false,
    duplicateChallenge: false,
    boundaries: {
      mutatesBusinessState: false,
      writesStage: false,
      writesDataTruth: false,
      writesRisk: false,
      writesGoal: false,
      writesScenario: false,
      commitsDecision: false,
      startsExecution: false,
      writesOutcome: false,
      writesLearning: false,
      createsSecondDecisionWriter: false,
      replacesDth8: false,
      replacesCc10: false,
      createsSecondConfirmationEngine: false,
      preferenceEqualsCommitment: false,
      recommendationAcceptanceEqualsDecision: false,
    },
    provenance: { sources: Object.freeze(["ECA:8"]), rationale: "test" },
    ...overrides,
  } as EcaExecutiveCommitmentJudgment;
}

const external = Object.freeze({ id: "opt-external-capacity", label: "Use external capacity for overflow", kind: "option" as const });
const expansion = Object.freeze({ id: "ctx-scenario-capacity", label: "Capacity Expansion Plan", kind: "option" as const });

test("boundary: NPS:6 does not create commitment, confirmation, or Decision authorities", () => {
  assert.equal(NPS_DECISION_COMMITMENT_BOUNDARY.createsCommitmentEngine, false);
  assert.equal(NPS_DECISION_COMMITMENT_BOUNDARY.createsConfirmationEngine, false);
  assert.equal(NPS_DECISION_COMMITMENT_BOUNDARY.createsDecisionStore, false);
  assert.equal(NPS_DECISION_COMMITMENT_BOUNDARY.autoCommitsRecommendation, false);
  assert.equal(NPS_DECISION_COMMITMENT_BOUNDARY.npsWritesDecision, false);
  assert.equal(NPS_DECISION_COMMITMENT_BOUNDARY.approvalEqualsExecution, false);
});

test("A — Recommendation only is not a Decision", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({ pathFacts: canonical, comparison: compared });
  assert.match(compared.nexoraRecommendation ?? "", /external/i);
  assert.equal(result.commitmentIntent, "NONE");
  assert.equal(result.approvedDecisionId, null);
  assert.equal(result.npsWritesDecision, false);
  assert.equal(result.decisionHandoffStatus, "NOT_AUTHORIZED");
});

test("B — Preference is not a Decision", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    eca: eca({
      commitmentState: "PREFERENCE",
      target: external,
      targetResolution: "RESOLVED",
      speak: true,
    }),
  });
  assert.equal(result.commitmentStatus, "PREFERENCE_EXPRESSED");
  assert.equal(result.approvedDecisionId, null);
  assert.match(result.managerPreference ?? "", /external/i);
});

test("C — Ambiguous commitment asks; no Decision", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    eca: eca({
      commitmentState: "EXPLICIT_COMMITMENT",
      target: null,
      targetResolution: "AMBIGUOUS",
      preDecisionChallenge: "CHALLENGE_TARGET_AMBIGUITY",
    }),
  });
  assert.equal(result.commitmentStatus, "COMMITMENT_AMBIGUOUS");
  assert.equal(result.approvedDecisionId, null);
  assert.equal(result.action, "CLARIFY_TARGET");
});

test("D — Explicit commitment still requires confirmation", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    eca: eca({
      commitmentState: "EXPLICIT_COMMITMENT",
      target: external,
      targetResolution: "RESOLVED",
      confirmationRequired: true,
    }),
  });
  assert.equal(result.commitmentIntent, "COMMIT_TO_OPTION");
  assert.match(result.candidateOptionId ?? "", /external/i);
  assert.equal(result.approvedDecisionId, null);
  assert.equal(result.confirmationRequired, true);
});

test("E — Unresolved supplier availability issues one material challenge", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    eca: eca({
      commitmentState: "EXPLICIT_COMMITMENT",
      target: external,
      targetResolution: "RESOLVED",
      challengeRequired: true,
      preDecisionChallenge: "CHALLENGE_CRITICAL_UNKNOWN",
      confirmationRequired: true,
    }),
  });
  assert.equal(result.commitmentStatus, "CHALLENGE_REQUIRED");
  assert.ok((result.unresolvedConditions.length ?? 0) >= 1);
  assert.equal(result.approvedDecisionId, null);
});

test("F — Manager override keeps Expansion Plan, not Nexora’s recommendation", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    eca: eca({
      commitmentState: "EXPLICIT_COMMITMENT",
      target: expansion,
      targetResolution: "RESOLVED",
      confirmationRequired: true,
    }),
  });
  assert.equal(result.candidateOptionId, "ctx-scenario-capacity");
  assert.notEqual(result.managerPreference, result.nexoraRecommendation);
  assert.equal(result.approvedDecisionId, null);
});

test("G — Valid confirmation is a CC:10 handoff, not an NPS write", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    eca: eca({
      commitmentState: "EXPLICIT_COMMITMENT",
      target: external,
      targetResolution: "RESOLVED",
      canonicalHandoffAllowed: true,
    }),
  });
  assert.equal(result.decisionHandoffStatus, "READY_FOR_CC10");
  assert.equal(result.npsWritesDecision, false);
  assert.equal(result.approvedDecisionId, null);
});

test("H — Generic Yes without pending proposal does not write", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    eca: eca({ commitmentState: "NONE" }),
  });
  assert.equal(result.decisionHandoffStatus, "NOT_AUTHORIZED");
  assert.equal(result.approvedDecisionId, null);
});

test("I — Topic change makes a later Yes stale", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    eca: eca({ commitmentState: "NONE" }),
    cc10: { topicChanged: true },
  });
  assert.equal(result.decisionHandoffStatus, "STALE");
  assert.equal(result.approvedDecisionId, null);
});

test("J — Pending External Capacity target does not silently switch", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    eca: eca({
      commitmentState: "AWAITING_CONFIRMATION",
      target: external,
      targetResolution: "RESOLVED",
      confirmationRequired: true,
    }),
    cc10: { pendingConfirmation: true, pendingTargetId: "opt-external-capacity" },
  });
  assert.match(result.candidateOptionId ?? "", /external/i);
  assert.notEqual(result.candidateOptionId, "ctx-scenario-capacity");
});

test("K — CC:10 failure does not appear approved", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    eca: eca({
      commitmentState: "EXPLICIT_COMMITMENT",
      target: external,
      canonicalHandoffAllowed: true,
    }),
    cc10: { status: "failed", approvedDecisionId: null },
  });
  assert.equal(result.approvedDecisionId, null);
  assert.equal(result.decisionHandoffStatus, "FAILED");
  assert.notEqual(npsPathStateAfterCommitment(result), "DECIDED");
});

test("L — CC:10 success is observed as DECIDED", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    eca: eca({
      commitmentState: "EXPLICIT_COMMITMENT",
      target: external,
      canonicalHandoffAllowed: true,
    }),
    cc10: { status: "applied", approvedDecisionId: "dec-capacity-1" },
  });
  assert.equal(result.approvedDecisionId, "dec-capacity-1");
  assert.equal(result.commitmentStatus, "DECISION_APPROVED");
  assert.equal(npsPathStateAfterCommitment(result), "DECIDED");
  assert.equal(result.npsWritesDecision, false);
});

test("M — Approved Decision does not start Execution", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    cc10: { status: "applied", approvedDecisionId: "dec-capacity-1" },
  });
  assert.equal(result.startsExecution, false);
  assert.equal(result.writesExecution, false);
  assert.ok(result.path.availableNextStates.includes("EXECUTION_READINESS"));
});

test("N — Do it without a Decision does not approve and execute", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    eca: eca({ commitmentState: "NONE" }),
  });
  const spoken = applyNpsDecisionCommitmentToPresentedResponse({
    source: "Noted.",
    utterance: "Do it.",
    commitment: result,
  });
  assert.equal(result.approvedDecisionId, null);
  assert.equal(result.startsExecution, false);
  assert.match(spoken, /does not approve a Decision or start execution/i);
});

test("O — Invalidated recommendation blocks stale approval", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    eca: eca({
      commitmentState: "AWAITING_CONFIRMATION",
      target: external,
      confirmationRequired: true,
    }),
    cc10: { recommendationInvalidated: true, pendingConfirmation: true, pendingTargetId: "opt-external-capacity" },
  });
  assert.equal(result.commitmentStatus, "CHALLENGE_REQUIRED");
  assert.equal(result.approvedDecisionId, null);
  assert.equal(result.decisionHandoffStatus, "NOT_AUTHORIZED");
});

test("P — Before valid CC:10 observation there are zero NPS writes", () => {
  const { canonical, comparison: compared } = comparison();
  const result = composeNpsDecisionCommitment({ pathFacts: canonical, comparison: compared });
  const advanced = attemptNpsDecisionCommitmentAdvancement(result);
  assert.equal(result.canonicalMutations.length, 0);
  assert.equal(result.npsWritesDecision, false);
  assert.equal(result.writesExecution, false);
  assert.equal(result.writesOutcome, false);
  assert.equal(advanced.npsDecisionWrites, 0);
  assert.equal(advanced.executionWrites, 0);
  assert.equal(advanced.decisionsCreated, 0);
});

test("Did we decide? answers from canonical Decision truth", () => {
  const { canonical, comparison: compared } = comparison();
  const before = composeNpsDecisionCommitment({ pathFacts: canonical, comparison: compared });
  const no = applyNpsDecisionCommitmentToPresentedResponse({
    source: "Checking.",
    utterance: "Did we decide?",
    commitment: before,
  });
  assert.match(no, /has not been approved as the Decision/i);
  const after = composeNpsDecisionCommitment({
    pathFacts: canonical,
    comparison: compared,
    cc10: { status: "applied", approvedDecisionId: "dec-capacity-1" },
  });
  const yes = applyNpsDecisionCommitmentToPresentedResponse({
    source: "Checking.",
    utterance: "Did we decide?",
    commitment: after,
  });
  assert.match(yes, /approved Decision for Capacity Gap/i);
});
