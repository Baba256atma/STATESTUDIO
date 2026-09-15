import assert from "node:assert/strict";
import test from "node:test";
import type { NpsCanonicalFacts } from "./npsProblemSolvingPath.ts";
import {
  NPS_OUTCOME_LEARNING_BOUNDARY,
  attemptNpsOutcomeLearningAdvancement,
  composeNpsOutcomeLearning,
} from "./npsOutcomeLearning.ts";
import { applyNpsOutcomeLearningToPresentedResponse } from "./npsOutcomeLearningRuntime.ts";

function pathFacts(overrides: Partial<NpsCanonicalFacts> = {}): NpsCanonicalFacts {
  return Object.freeze({
    problem: Object.freeze({
      problemId: "ctx-problem-capacity",
      problemLabel: "Capacity Gap",
      confidence: "HIGH",
      observedFrom: "NPS:1",
    }),
    investigationPresent: true,
    evidenceState: "PARTIAL",
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
      observedFrom: "CC:11 Execution",
    }),
    outcome: Object.freeze({ observed: false, problemResolved: null }),
    stageFocusId: "ctx-scenario-demand",
    conversationSubjectId: "ctx-problem-margin",
    ...overrides,
  });
}

const chain = {
  decisionId: "dec-capacity-1",
  decisionTitle: "External Capacity",
  executionId: "exec-capacity-1",
  executionStatus: "completed",
  executionTitle: "External Capacity rollout",
  measure: "OTD",
};

test("A — Execution complete with no Outcome is UNKNOWN, not RESOLVED", () => {
  const result = composeNpsOutcomeLearning({
    pathFacts: pathFacts(),
    observation: { ...chain, evidencePresent: false },
  });
  assert.equal(result.outcomeStatus, "UNKNOWN");
  assert.equal(result.resolutionStatus, "UNKNOWN");
  assert.notEqual(result.path.currentState, "RESOLVED");
  assert.equal(result.writesOutcome, false);
  assert.equal(result.npsWritesDecision, false);
});

test("B — Improvement below Goal is partial and reassessment is available", () => {
  const result = composeNpsOutcomeLearning({
    pathFacts: pathFacts(),
    observation: { ...chain, baseline: 91, goal: 96, expected: 96, observed: 94, evidencePresent: true },
  });
  assert.equal(result.baseline, 91);
  assert.equal(result.goal, 96);
  assert.equal(result.observedOutcome, 94);
  assert.equal(result.outcomeStatus, "PARTIAL");
  assert.equal(result.resolutionStatus, "PARTIALLY_RESOLVED");
  assert.ok(result.reassessmentStatus === "AVAILABLE" || result.reassessmentStatus === "ROUTED");
  assert.equal(result.path.currentState, "REASSESSMENT");
  assert.match(result.managerProjection.text, /improved/i);
  assert.doesNotMatch(result.managerProjection.text, /\bNPS\b|\bECA\b|CORE-OUT/i);
});

test("C / I — Goal reached allows RESOLVED from Outcome evidence", () => {
  const result = composeNpsOutcomeLearning({
    pathFacts: pathFacts(),
    observation: { ...chain, baseline: 91, goal: 96, expected: 96, observed: 96.4, evidencePresent: true },
  });
  assert.equal(result.outcomeStatus, "EXCEEDS_EXPECTATION");
  assert.equal(result.resolutionStatus, "RESOLVED");
  assert.equal(result.path.currentState, "RESOLVED");
  assert.equal(result.writesGoal, false);
});

test("D — Worse Outcome is WORSENED and reassessment is available", () => {
  const result = composeNpsOutcomeLearning({
    pathFacts: pathFacts(),
    observation: { ...chain, baseline: 91, goal: 96, observed: 88, evidencePresent: true },
  });
  assert.equal(result.resolutionStatus, "WORSENED");
  assert.ok(result.reassessmentStatus !== "NOT_WARRANTED");
});

test("E — Contradictory unchanged KPI weakens the hypothesis without false cause", () => {
  const result = composeNpsOutcomeLearning({
    pathFacts: pathFacts(),
    observation: {
      ...chain,
      baseline: 91,
      goal: 96,
      observed: 91,
      evidencePresent: true,
      causeHypothesisInvalidated: true,
    },
  });
  assert.equal(result.learningStatus, "WEAKENED_HYPOTHESIS");
  assert.equal(result.attribution, "NOT_ESTABLISHED");
  assert.match(result.learningStatements.join(" "), /does not prove capacity is irrelevant/i);
});

test("F — Causal safety: improvement is association, not caused-by", () => {
  const result = composeNpsOutcomeLearning({
    pathFacts: pathFacts(),
    observation: { ...chain, baseline: 91, goal: 96, observed: 94, evidencePresent: true },
  });
  assert.equal(result.attribution, "NOT_ESTABLISHED");
  assert.equal(result.boundary.correlationEqualsCausality, false);
  assert.match(result.learningStatements.join(" "), /does not confirm capacity as the sole cause/i);
});

test("G — Durable Learning remains false; no new writer", () => {
  const result = composeNpsOutcomeLearning({
    pathFacts: pathFacts(),
    observation: { ...chain, baseline: 91, goal: 96, observed: 94, evidencePresent: true },
  });
  assert.equal(result.learningDurable, false);
  assert.equal(result.writesLearning, false);
  assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.inventsDurableLearning, false);
  assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.durableLearningWriter, false);
});

test("H — Cause picture invalidated loops to CAUSE_ANALYSIS, not NPS:1", () => {
  const result = composeNpsOutcomeLearning({
    pathFacts: pathFacts(),
    observation: {
      ...chain,
      baseline: 91,
      goal: 96,
      observed: 91,
      evidencePresent: true,
      causeHypothesisInvalidated: true,
    },
  });
  assert.equal(result.loopBackState, "CAUSE_ANALYSIS");
  assert.notEqual(result.loopBackState, "PROBLEM_IDENTIFIED");
});

test("J / K — Poor Outcome does not write Decision or Execution", () => {
  const result = composeNpsOutcomeLearning({
    pathFacts: pathFacts(),
    observation: { ...chain, baseline: 91, goal: 96, observed: 88, evidencePresent: true },
  });
  const advanced = attemptNpsOutcomeLearningAdvancement(result);
  assert.equal(advanced.npsDecisionWrites, 0);
  assert.equal(advanced.executionWrites, 0);
  assert.equal(advanced.outcomeWrites, 0);
  assert.equal(result.npsWritesDecision, false);
  assert.equal(result.writesExecution, false);
});

test("L — Did it work stays on the Capacity Gap chain", () => {
  const result = composeNpsOutcomeLearning({
    pathFacts: pathFacts(),
    observation: { ...chain, baseline: 91, goal: 96, observed: 94, evidencePresent: true },
  });
  assert.equal(result.problemId, "ctx-problem-capacity");
  assert.equal(result.decisionId, "dec-capacity-1");
  assert.equal(result.executionId, "exec-capacity-1");
  const text = applyNpsOutcomeLearningToPresentedResponse({
    source: "Working.",
    utterance: "Did it work?",
    outcome: result,
  });
  assert.match(text, /Capacity Gap|improved|Goal/i);
  assert.doesNotMatch(text, /NPS:8|CORE-OUT|CC:11/);
});

test("Uncertain Problem blocks Outcome resolution", () => {
  const result = composeNpsOutcomeLearning({
    pathFacts: pathFacts({
      problem: Object.freeze({
        problemId: null,
        problemLabel: null,
        confidence: "UNKNOWN",
        observedFrom: "none",
        candidateProblemIds: Object.freeze(["ctx-problem-capacity", "ctx-problem-margin"]),
      }),
    }),
    observation: { ...chain, baseline: 91, goal: 96, observed: 96.4, evidencePresent: true },
  });
  assert.equal(result.action, "CLARIFY_PROBLEM");
  assert.notEqual(result.resolutionStatus, "RESOLVED");
});

test("Baseline remains distinct from Goal and expected remains distinct from observed", () => {
  const result = composeNpsOutcomeLearning({
    pathFacts: pathFacts(),
    observation: { ...chain, baseline: 91, goal: 96, expected: 96, observed: 94, evidencePresent: true },
  });
  assert.equal(result.baseline, 91);
  assert.equal(result.goal, 96);
  assert.equal(result.expectedOutcome, 96);
  assert.equal(result.observedOutcome, 94);
  assert.notEqual(result.baseline, result.goal);
  assert.notEqual(result.expectedOutcome, result.observedOutcome);
});
