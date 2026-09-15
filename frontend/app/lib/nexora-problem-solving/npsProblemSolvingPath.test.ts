import assert from "node:assert/strict";
import test from "node:test";
import {
  NPS_PROBLEM_SOLVING_PATH_BOUNDARY,
  NPS_PROBLEM_SOLVING_PATH_IDENTITY,
  attemptNpsPathAdvancement,
  composeNpsProblemSolvingPath,
  getNpsProblemSolvingPathIdentity,
  type NpsCanonicalFacts,
} from "./npsProblemSolvingPath.ts";

function facts(overrides: Partial<NpsCanonicalFacts> = {}): NpsCanonicalFacts {
  return Object.freeze({
    problem: Object.freeze({
      problemId: "ctx-problem-capacity",
      problemLabel: "Capacity Gap",
      confidence: "HIGH",
      observedFrom: "MO Context associatedProblem",
    }),
    investigationPresent: false,
    investigationId: null,
    evidenceState: "NONE",
    evidenceGapLabel: null,
    causeHypothesesAvailable: false,
    scenarioIds: Object.freeze([]),
    comparisonAvailable: false,
    recommendationReady: false,
    awaitingCommitment: false,
    approvedDecisionId: null,
    execution: Object.freeze({
      present: false,
      executionId: null,
      status: "NONE",
    }),
    outcome: Object.freeze({
      observed: false,
      problemResolved: null,
    }),
    stageFocusId: "ctx-problem-capacity",
    conversationSubjectId: "ctx-problem-capacity",
    collectionMemberIds: Object.freeze(["ctx-problem-capacity"]),
    ...overrides,
  });
}

test("identity and boundary: NPS is a path contract, not an authority layer", () => {
  const identity = getNpsProblemSolvingPathIdentity();
  assert.equal(identity.id, NPS_PROBLEM_SOLVING_PATH_IDENTITY);
  assert.equal(NPS_PROBLEM_SOLVING_PATH_BOUNDARY.newAuthorityLayer, false);
  assert.equal(NPS_PROBLEM_SOLVING_PATH_BOUNDARY.createsProblemStore, false);
  assert.equal(NPS_PROBLEM_SOLVING_PATH_BOUNDARY.createsScenarioStore, false);
  assert.equal(NPS_PROBLEM_SOLVING_PATH_BOUNDARY.writesEvidence, false);
  assert.equal(NPS_PROBLEM_SOLVING_PATH_BOUNDARY.commitsDecision, false);
  assert.equal(NPS_PROBLEM_SOLVING_PATH_BOUNDARY.startsExecution, false);
  assert.equal(NPS_PROBLEM_SOLVING_PATH_BOUNDARY.inventsOutcome, false);
  assert.equal(NPS_PROBLEM_SOLVING_PATH_BOUNDARY.inventsLearning, false);
  assert.equal(NPS_PROBLEM_SOLVING_PATH_BOUNDARY.bypassesEca, false);
  assert.equal(NPS_PROBLEM_SOLVING_PATH_BOUNDARY.bypassesCc10, false);
  assert.equal(NPS_PROBLEM_SOLVING_PATH_BOUNDARY.bypassesCc11, false);
  assert.equal(NPS_PROBLEM_SOLVING_PATH_BOUNDARY.replacesMo5, false);
  assert.equal(NPS_PROBLEM_SOLVING_PATH_BOUNDARY.pathAdvancementMutatesCanonicalState, false);
});

test("A — New Problem: exists without investigation → UNDERSTANDING / next = Investigate", () => {
  const path = composeNpsProblemSolvingPath(facts());
  assert.equal(path.problemOwnership, "DETERMINED");
  assert.equal(path.problemId, "ctx-problem-capacity");
  assert.equal(path.currentState, "UNDERSTANDING");
  assert.deepEqual(path.completedStates, ["PROBLEM_IDENTIFIED"]);
  assert.deepEqual(path.availableNextStates, ["INVESTIGATING"]);
  assert.equal(path.nextStep, "Investigate");
  assert.equal(path.managerProjection.problem, "Capacity Gap");
  assert.equal(path.managerProjection.currentStep, "Understanding");
  assert.equal(path.managerProjection.nextUsefulStep, "Investigate");
});

test("B — Investigation: Problem + investigation → INVESTIGATING", () => {
  const path = composeNpsProblemSolvingPath(
    facts({
      investigationPresent: true,
      investigationId: "inv-capacity-1",
      investigationObservedFrom: "FINAL:5 investigation composer",
    }),
  );
  assert.equal(path.currentState, "INVESTIGATING");
  assert.ok(path.completedStates.includes("UNDERSTANDING"));
  assert.deepEqual(path.availableNextStates, ["EVIDENCE_REVIEW"]);
  assert.equal(path.nextStep, "Gather and review evidence");
});

test("C — Evidence: Problem + investigation + evidence → EVIDENCE_REVIEW", () => {
  const path = composeNpsProblemSolvingPath(
    facts({
      investigationPresent: true,
      evidenceState: "PARTIAL",
      evidenceObservedFrom: "Data Reality",
    }),
  );
  assert.equal(path.currentState, "EVIDENCE_REVIEW");
  assert.ok(path.completedStates.includes("INVESTIGATING"));
  assert.deepEqual(path.availableNextStates, ["CAUSE_ANALYSIS"]);
  assert.equal(path.nextStep, "Analyze possible causes");
});

test("C2 — Incomplete evidence blocks cause analysis without inventing causes", () => {
  const path = composeNpsProblemSolvingPath(
    facts({
      investigationPresent: true,
      evidenceState: "INSUFFICIENT",
      evidenceGapLabel: "Delivery evidence is still incomplete",
    }),
  );
  assert.equal(path.currentState, "EVIDENCE_REVIEW");
  assert.equal(path.blockingReason, "Delivery evidence is still incomplete");
  assert.deepEqual(path.availableNextStates, []);
  assert.equal(path.nextStep, "Finish reviewing evidence");
  assert.equal(path.managerProjection.blockedBy, "Delivery evidence is still incomplete");
  assert.equal(path.managerProjection.currentStep, "Evidence Review");
});

test("D — Options: evidence/cause analysis + scenarios → OPTIONS_AVAILABLE", () => {
  const path = composeNpsProblemSolvingPath(
    facts({
      investigationPresent: true,
      evidenceState: "SUFFICIENT",
      causeHypothesesAvailable: true,
      scenarioIds: Object.freeze(["scen-overtime", "scen-outsource"]),
    }),
  );
  assert.equal(path.currentState, "OPTIONS_AVAILABLE");
  assert.ok(path.completedStates.includes("CAUSE_ANALYSIS"));
  assert.ok(path.completedStates.includes("EVIDENCE_REVIEW"));
  assert.deepEqual(path.availableNextStates, ["COMPARING_OPTIONS"]);
  assert.equal(path.nextStep, "Compare options");
});

test("E — Recommendation: comparison + recommendation → RECOMMENDATION_READY", () => {
  const path = composeNpsProblemSolvingPath(
    facts({
      investigationPresent: true,
      evidenceState: "SUFFICIENT",
      causeHypothesesAvailable: true,
      scenarioIds: Object.freeze(["scen-overtime", "scen-outsource"]),
      comparisonAvailable: true,
      recommendationReady: true,
    }),
  );
  assert.equal(path.currentState, "RECOMMENDATION_READY");
  assert.ok(path.completedStates.includes("COMPARING_OPTIONS"));
  assert.deepEqual(path.availableNextStates, ["AWAITING_COMMITMENT"]);
  assert.equal(path.nextStep, "Review commitment");
});

test("F — Decision: approved canonical Decision → DECIDED / EXECUTION_READINESS", () => {
  const decided = composeNpsProblemSolvingPath(
    facts({
      investigationPresent: true,
      evidenceState: "SUFFICIENT",
      causeHypothesesAvailable: true,
      scenarioIds: Object.freeze(["scen-overtime"]),
      comparisonAvailable: true,
      recommendationReady: true,
      approvedDecisionId: "dec-capacity-1",
      decisionObservedFrom: "CC:10 Decision",
    }),
  );
  assert.equal(decided.currentState, "DECIDED");
  assert.deepEqual(decided.availableNextStates, ["EXECUTION_READINESS"]);
  assert.equal(decided.nextStep, "Check execution readiness");
  assert.equal(decided.commitsDecision, false);

  const ready = composeNpsProblemSolvingPath(
    facts({
      approvedDecisionId: "dec-capacity-1",
      execution: Object.freeze({
        present: true,
        executionId: "exec-capacity-1",
        status: "READY",
        observedFrom: "CC:11 Execution",
      }),
    }),
  );
  assert.equal(ready.currentState, "EXECUTION_READINESS");
  assert.ok(ready.completedStates.includes("DECIDED"));
  assert.deepEqual(ready.availableNextStates, ["EXECUTING"]);
});

test("G — Execution: canonical Execution active → EXECUTING or MONITORING", () => {
  const executing = composeNpsProblemSolvingPath(
    facts({
      approvedDecisionId: "dec-capacity-1",
      execution: Object.freeze({
        present: true,
        executionId: "exec-capacity-1",
        status: "ACTIVE",
        observedFrom: "CC:11 Execution",
      }),
    }),
  );
  assert.equal(executing.currentState, "EXECUTING");
  assert.equal(executing.nextStep, "Monitor");
  assert.equal(executing.startsExecution, false);

  const monitoring = composeNpsProblemSolvingPath(
    facts({
      approvedDecisionId: "dec-capacity-1",
      execution: Object.freeze({
        present: true,
        executionId: "exec-capacity-1",
        status: "MONITORING",
        observedFrom: "CC:11 Execution",
      }),
    }),
  );
  assert.equal(monitoring.currentState, "MONITORING");
  assert.equal(monitoring.nextStep, "Review the outcome");
});

test("H — Outcome: observed Outcome → OUTCOME_REVIEW", () => {
  const path = composeNpsProblemSolvingPath(
    facts({
      approvedDecisionId: "dec-capacity-1",
      execution: Object.freeze({
        present: true,
        executionId: "exec-capacity-1",
        status: "COMPLETED",
      }),
      outcome: Object.freeze({
        observed: true,
        problemResolved: null,
        observedFrom: "CORE-OUT Outcome",
      }),
    }),
  );
  assert.equal(path.currentState, "OUTCOME_REVIEW");
  assert.deepEqual(path.availableNextStates, ["RESOLVED", "REASSESSMENT"]);
  assert.equal(path.nextStep, "Resolve or reassess");
  assert.ok(path.unknowns.some((item) => /whether the Problem is resolved remains unknown/i.test(item)));
});

test("I — Reassessment: Outcome indicates unresolved Problem → REASSESSMENT", () => {
  const path = composeNpsProblemSolvingPath(
    facts({
      approvedDecisionId: "dec-capacity-1",
      execution: Object.freeze({
        present: true,
        executionId: "exec-capacity-1",
        status: "COMPLETED",
      }),
      outcome: Object.freeze({
        observed: true,
        problemResolved: false,
        observedFrom: "CORE-OUT Outcome",
      }),
    }),
  );
  assert.equal(path.currentState, "REASSESSMENT");
  assert.equal(path.nextStep, "Reopen understanding of the Problem");
  assert.ok(path.completedStates.includes("OUTCOME_REVIEW"));
});

test("I2 — Resolved Problem after observed Outcome → RESOLVED", () => {
  const path = composeNpsProblemSolvingPath(
    facts({
      approvedDecisionId: "dec-capacity-1",
      execution: Object.freeze({
        present: true,
        executionId: "exec-capacity-1",
        status: "COMPLETED",
      }),
      outcome: Object.freeze({
        observed: true,
        problemResolved: true,
      }),
    }),
  );
  assert.equal(path.currentState, "RESOLVED");
  assert.deepEqual(path.availableNextStates, []);
  assert.equal(path.nextStep, "None");
});

test("J — Safety: path advancement alone produces zero canonical mutations", () => {
  const input = facts({
    investigationPresent: true,
    evidenceState: "SUFFICIENT",
    recommendationReady: true,
    approvedDecisionId: "dec-capacity-1",
  });
  const frozen = Object.freeze({ ...input });
  const path = composeNpsProblemSolvingPath(frozen);
  const advanced = attemptNpsPathAdvancement(path);
  assert.equal(advanced.canonicalMutations.length, 0);
  assert.equal(advanced.decisionsCreated, 0);
  assert.equal(advanced.executionsStarted, 0);
  assert.equal(advanced.evidenceWritten, false);
  assert.equal(advanced.outcomesInvented, false);
  assert.equal(advanced.learningInvented, false);
  assert.equal(path.canonicalMutations.length, 0);
  assert.equal(path.commitsDecision, false);
  assert.equal(path.startsExecution, false);
  assert.equal(path.writesEvidence, false);
  assert.equal(Object.isFrozen(path), true);
  assert.equal(advanced.path, path);
});

test("uncertainty: missing Problem is explicit and does not guess from Stage or conversation", () => {
  const path = composeNpsProblemSolvingPath(
    facts({
      problem: Object.freeze({
        problemId: null,
        problemLabel: null,
        confidence: "UNKNOWN",
        observedFrom: "UNRESOLVED",
      }),
      stageFocusId: "obj-delivery",
      conversationSubjectId: "scen-overtime",
      scenarioIds: Object.freeze(["scen-stale"]),
      collectionMemberIds: Object.freeze(["ctx-problem-margin"]),
    }),
  );
  assert.equal(path.problemOwnership, "UNCERTAIN");
  assert.equal(path.problemId, null);
  assert.equal(path.currentState, null);
  assert.match(path.blockingReason ?? "", /cannot be determined safely/i);
  assert.equal(path.managerProjection.problem, "Not determined");
  assert.doesNotMatch(path.managerProjection.problem, /overtime|Delivery|Margin/i);
});

test("uncertainty: conflicting Problem candidates are not silently resolved", () => {
  const path = composeNpsProblemSolvingPath(
    facts({
      problem: Object.freeze({
        problemId: null,
        problemLabel: null,
        confidence: "LOW",
        observedFrom: "collection without active Problem",
        candidateProblemIds: Object.freeze(["ctx-problem-capacity", "ctx-problem-margin"]),
      }),
    }),
  );
  assert.equal(path.problemOwnership, "CONFLICTED");
  assert.equal(path.currentState, null);
  assert.match(path.blockingReason ?? "", /More than one Problem/i);
});

test("stale Scenario and Stage focus do not replace a determined Problem", () => {
  const path = composeNpsProblemSolvingPath(
    facts({
      stageFocusId: "scen-stale",
      conversationSubjectId: "ctx-problem-margin",
      scenarioIds: Object.freeze(["scen-stale"]),
    }),
  );
  assert.equal(path.problemId, "ctx-problem-capacity");
  assert.equal(path.currentState, "OPTIONS_AVAILABLE");
  assert.ok(path.unknowns.some((item) => /Stage focus is not used/i.test(item)));
  assert.ok(path.unknowns.some((item) => /Conversation subject is not used/i.test(item)));
});

test("manager projection keeps architecture terminology out of the facing text", () => {
  const path = composeNpsProblemSolvingPath(
    facts({
      investigationPresent: true,
      evidenceState: "INSUFFICIENT",
      evidenceGapLabel: "Delivery evidence is still incomplete",
    }),
  );
  const facing = `${path.managerProjection.problem} ${path.managerProjection.currentStep} ${path.managerProjection.completed.join(" ")} ${path.managerProjection.nextUsefulStep} ${path.managerProjection.blockedBy}`;
  assert.doesNotMatch(facing, /CC:10|CC:11|ECA|NPS|MO:5|Director|Theatre/i);
});

test("AWAITING_COMMITMENT is observed from pending confirmation, not invented as Decision", () => {
  const path = composeNpsProblemSolvingPath(
    facts({
      recommendationReady: true,
      awaitingCommitment: true,
    }),
  );
  assert.equal(path.currentState, "AWAITING_COMMITMENT");
  assert.equal(path.commitsDecision, false);
  assert.deepEqual(path.availableNextStates, ["DECIDED"]);
});
