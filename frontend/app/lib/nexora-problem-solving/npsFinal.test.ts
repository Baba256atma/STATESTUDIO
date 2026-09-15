/**
 * NPA-T NPS:FINAL — architecture freeze and bounded invariant proofs.
 * Certification-only. Does not add NPS capabilities.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NPS_PROBLEM_SOLVING_PATH_IDENTITY } from "./npsProblemSolvingPath.ts";
import { NPS_PROBLEM_UNDERSTANDING_IDENTITY } from "./npsProblemUnderstanding.ts";
import { NPS_EVIDENCE_CAUSE_ANALYSIS_IDENTITY } from "./npsEvidenceCauseAnalysis.ts";
import { NPS_OPTION_GENERATION_IDENTITY } from "./npsOptionGeneration.ts";
import { NPS_COMPARISON_RECOMMENDATION_IDENTITY } from "./npsComparisonRecommendation.ts";
import { NPS_DECISION_COMMITMENT_IDENTITY } from "./npsDecisionCommitment.ts";
import {
  NPS_EXECUTION_MONITORING_IDENTITY,
  composeNpsExecutionMonitoring,
} from "./npsExecutionMonitoring.ts";
import {
  NPS_OUTCOME_LEARNING_IDENTITY,
  composeNpsOutcomeLearning,
} from "./npsOutcomeLearning.ts";
import type { NpsCanonicalFacts } from "./npsProblemSolvingPath.ts";

test("NPS:FINAL freeze — certified identities remain NPS:1 through NPS:8", () => {
  assert.equal(NPS_PROBLEM_SOLVING_PATH_IDENTITY, "NPA-T NPS:1/ProblemSolvingPathFoundation");
  assert.equal(NPS_PROBLEM_UNDERSTANDING_IDENTITY, "NPA-T NPS:2/ProblemUnderstandingInvestigation");
  assert.equal(NPS_EVIDENCE_CAUSE_ANALYSIS_IDENTITY, "NPA-T NPS:3/EvidenceCauseAnalysis");
  assert.equal(NPS_OPTION_GENERATION_IDENTITY, "NPA-T NPS:4/OptionsScenarioGeneration");
  assert.equal(NPS_COMPARISON_RECOMMENDATION_IDENTITY, "NPA-T NPS:5/ComparisonRecommendation");
  assert.equal(NPS_DECISION_COMMITMENT_IDENTITY, "NPA-T NPS:6/DecisionCommitment");
  assert.equal(NPS_EXECUTION_MONITORING_IDENTITY, "NPA-T NPS:7/ExecutionMonitoring");
  assert.equal(NPS_OUTCOME_LEARNING_IDENTITY, "NPA-T NPS:8/OutcomeLearningReassessment");
});

function facts(): NpsCanonicalFacts {
  return Object.freeze({
    problem: Object.freeze({
      problemId: "ctx-problem-capacity",
      problemLabel: "Capacity Gap",
      confidence: "HIGH" as const,
      observedFrom: "NPS:1",
    }),
    investigationPresent: true,
    evidenceState: "PARTIAL" as const,
    causeHypothesesAvailable: true,
    scenarioIds: Object.freeze(["ctx-scenario-capacity"]),
    comparisonAvailable: true,
    recommendationReady: true,
    awaitingCommitment: false,
    approvedDecisionId: "dec-capacity-1",
    execution: Object.freeze({
      present: true,
      executionId: "exec-capacity-1",
      status: "COMPLETED" as const,
    }),
    outcome: Object.freeze({ observed: false, problemResolved: null }),
  });
}

test("NPS:FINAL — REASSESSMENT branch: 91 / 96 / 94 is not resolved", () => {
  const result = composeNpsOutcomeLearning({
    pathFacts: facts(),
    observation: {
      decisionId: "dec-capacity-1",
      executionId: "exec-capacity-1",
      executionStatus: "completed",
      measure: "OTD",
      baseline: 91,
      goal: 96,
      expected: 96,
      observed: 94,
      evidencePresent: true,
    },
  });
  assert.equal(result.baseline, 91);
  assert.equal(result.goal, 96);
  assert.equal(result.observedOutcome, 94);
  assert.notEqual(result.baseline, result.goal);
  assert.notEqual(result.expectedOutcome, result.observedOutcome);
  assert.equal(result.resolutionStatus, "PARTIALLY_RESOLVED");
  assert.equal(result.path.currentState, "REASSESSMENT");
  assert.equal(result.attribution, "NOT_ESTABLISHED");
  assert.equal(result.learningDurable, false);
  assert.equal(result.writesOutcome, false);
  assert.equal(result.writesLearning, false);
});

test("NPS:FINAL — RESOLVED branch: observed Goal met is path resolution, not a Problem write", () => {
  const result = composeNpsOutcomeLearning({
    pathFacts: facts(),
    observation: {
      decisionId: "dec-capacity-1",
      executionId: "exec-capacity-1",
      executionStatus: "completed",
      measure: "OTD",
      baseline: 91,
      goal: 96,
      expected: 96,
      observed: 96.4,
      evidencePresent: true,
    },
  });
  assert.equal(result.resolutionStatus, "RESOLVED");
  assert.equal(result.path.currentState, "RESOLVED");
  assert.equal(result.writesGoal, false);
  assert.equal(result.npsWritesDecision, false);
});

test("NPS:FINAL — NPS:7 completion hands the same IDs to NPS:8 Outcome Review", () => {
  const execution = composeNpsExecutionMonitoring({
    pathFacts: facts(),
    commitment: {
      approvedDecisionId: "dec-capacity-1",
      committedOption: "External Capacity",
      problemId: "ctx-problem-capacity",
      unresolvedConditions: Object.freeze([]),
    } as never,
    cc11: {
      executionId: "exec-capacity-1",
      decisionId: "dec-capacity-1",
      status: "completed",
      resultStatus: "applied",
    },
  });
  const outcome = composeNpsOutcomeLearning({
    pathFacts: facts(),
    observation: {
      decisionId: execution.outcomeHandoff.decisionId,
      executionId: execution.outcomeHandoff.executionId,
      executionStatus: execution.outcomeHandoff.executionStatus,
      evidencePresent: false,
    },
  });
  assert.equal(execution.problemId, "ctx-problem-capacity");
  assert.equal(outcome.problemId, execution.problemId);
  assert.equal(outcome.decisionId, execution.decisionId);
  assert.equal(outcome.executionId, execution.executionId);
  assert.equal(outcome.path.currentState, "OUTCOME_REVIEW");
  assert.notEqual(outcome.resolutionStatus, "RESOLVED");
});
