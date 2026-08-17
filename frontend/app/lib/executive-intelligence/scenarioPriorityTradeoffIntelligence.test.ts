import assert from "node:assert/strict";
import test from "node:test";
import { createNexoraScenarioBaselineSnapshot, evaluateNexoraExecutiveScenario } from "../conversational-control/executiveScenarioEvaluation.ts";
import type { NexoraExecutiveScenario } from "../conversational-control/executiveScenarioDefinition.ts";
import { createExecutiveIntelligenceTrace, type ExecutiveRealityReference } from "./executiveIntelligenceIntegration.ts";
import type { StrategicContext } from "./strategicIntelligenceIntegration.ts";
import {
  createExecutiveClaim,
  createExecutiveConstraintReference,
  createExecutiveIssueFraming,
} from "./problemRiskOpportunityIntelligence.ts";
import {
  SCENARIO_PRIORITY_TRADEOFF_BOUNDARY,
  certifyScenarioPriorityTradeoffIntelligence,
  compareExplainablePriorities,
  compareScenarioAlternatives,
  createExpectedEffect,
  createIssueScenarioContext,
  createPriorityFactor,
  createScenarioIntelligenceEvaluation,
  createScenarioPriorityTradeoffTrace,
  createScenarioTradeoff,
  evaluateScenarioConstraint,
  projectScenarioComparisonForAdvisor,
  referenceCanonicalScenario,
  resolveExplainablePriority,
  scenarioPriorityTradeoffCapabilityMap,
  scenarioPriorityTradeoffGapRegister,
  scenarioPriorityTradeoffStageCompatibility,
  type PriorityFactor,
} from "./scenarioPriorityTradeoffIntelligence.ts";

const workspaceId = "workspace-ei4";
const subjectId = "obj-capacity";
const observedAt = "2026-08-17T12:00:00.000Z";
const evidence = Object.freeze({ sourceKind: "data-reality" as const, sourceId: "github-live", subjectId, factKey: "kpi-capacity" });

function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value)) return true;
  seen.add(value);
  return Object.isFrozen(value) && Object.values(value).every((child) => deeplyFrozen(child, seen));
}

function scenario(id: string, name: string, kind: "intervention" | "do-nothing", action?: string): NexoraExecutiveScenario {
  return Object.freeze({ scenarioId: `cc9:scenario:${id}`, name, revision: 1, baseContextId: workspaceId, subjectIds: Object.freeze([subjectId]), assumptions: Object.freeze(kind === "do-nothing" ? [{ key: "current-course", subjectId, metricKey: "capacity", operator: "hold" as const, evidenceSource: "dataset-capacity-live" }] : [{ key: "demand-persists", subjectId, metricKey: "demand", operator: "hold" as const, evidenceSource: "github-live" }]), interventions: Object.freeze(action ? [{ subjectId, actionKind: action, value: action === "increase-by" ? 20 : 10, unit: "%" }] : []), horizon: Object.freeze({ amount: 1, unit: "quarter" as const }), source: "conversation", status: "evaluated", recommendationId: null, parentScenarioId: null, kind });
}

function fixture() {
  const reality: ExecutiveRealityReference = Object.freeze({ stage: "reality", authorityId: "P0:1/NexoraDataRealityFoundation", recordId: "dataset-capacity-live", workspaceId, subjectIds: Object.freeze([subjectId]), evidenceRefs: Object.freeze([Object.freeze({ ...evidence, observedAt, confidence: 0.98, confidenceState: "verified" })]), provenanceRefs: Object.freeze(["github-live:repo:nexora:utilization"]), observedAt, uncertaintyRefs: Object.freeze([]), sourceSnapshotId: "snapshot-github-1", datasetId: "dataset-capacity-live" });
  const strategicContext: StrategicContext = Object.freeze({ contextId: "strategic-capacity", workspaceId, modelId: "model-ei4", references: Object.freeze([]), relationships: Object.freeze([]), operationalSeverity: "watch", strategicRelevance: Object.freeze({ level: "high", rationale: "Explicit resilience objective relationship.", basisRelationshipIds: Object.freeze(["objective-capacity"]), source: "explicit-configuration" }), valid: true, issues: Object.freeze([]) });
  const fact = createExecutiveClaim({ claimId: "fact-capacity", type: "FACT", statement: "Capacity pressure is currently elevated.", evidenceRefs: [evidence], provenanceRefs: reality.provenanceRefs, observedAt, realityEvidence: reality.evidenceRefs });
  const assumption = createExecutiveClaim({ claimId: "assumption-demand", type: "ASSUMPTION", statement: "Demand may remain elevated.", evidenceRefs: [evidence], provenanceRefs: reality.provenanceRefs });
  const prediction = createExecutiveClaim({ claimId: "prediction-pressure", type: "PREDICTION", statement: "Capacity pressure may persist next quarter.", evidenceRefs: [evidence], provenanceRefs: reality.provenanceRefs });
  const unknown = createExecutiveClaim({ claimId: "unknown-duration", type: "UNKNOWN", statement: "Demand duration remains unknown." });
  const constraint = createExecutiveConstraintReference({ constraintId: "constraint-budget", category: "budget", summary: "Expansion budget is limited.", affectedEntityRefs: [subjectId], authorityId: "CC:8/ExecutiveAssessment", evidenceRefs: [evidence] });
  const issue = createExecutiveIssueFraming({ issueId: "issue-capacity", requestedType: "problem", title: "Capacity pressure", workspaceId, reality, strategicContext, claims: [fact, assumption, prediction, unknown], constraints: [constraint], operationalSeverity: "watch", uncertaintyRefs: [unknown.claimId] });
  const issueContext = createIssueScenarioContext(issue);
  const a = scenario("expand", "Increase capacity", "intervention", "increase-by");
  const b = scenario("optimize", "Optimize current capacity", "intervention", "decrease-by");
  const baselineScenario = scenario("baseline", "Do Nothing", "do-nothing");
  const baseline = createNexoraScenarioBaselineSnapshot({ baselineId: "baseline-capacity", attentionBySubject: { [subjectId]: "important" } });
  const cc9A = evaluateNexoraExecutiveScenario({ scenario: a, baseline }).evaluation!;
  const cc9B = evaluateNexoraExecutiveScenario({ scenario: b, baseline }).evaluation!;
  const cc9Baseline = evaluateNexoraExecutiveScenario({ scenario: baselineScenario, baseline }).evaluation!;
  const refA = referenceCanonicalScenario({ issueContext, scenario: a });
  const refB = referenceCanonicalScenario({ issueContext, scenario: b });
  const refBaseline = referenceCanonicalScenario({ issueContext, scenario: baselineScenario });
  const factor = (factorId: string, dimension: PriorityFactor["dimension"], level: PriorityFactor["level"], effect: PriorityFactor["effect"], reason: string): PriorityFactor => createPriorityFactor({ factorId, dimension, level, effect, reason, evidenceRefs: [evidence], assumptionRefs: [] });
  const tradeoff = (id: string, dimension: "capacity" | "cost" | "operational-stability", gain: string | null, sacrifice: string | null) => createScenarioTradeoff({ tradeoffId: id, dimension, gain, sacrifice, evidenceRefs: [evidence], assumptionRefs: [assumption.claimId], confidence: "medium", timeHorizon: { amount: 1, unit: "quarter" }, reversibility: "partially-reversible" });
  const constraintSatisfied = evaluateScenarioConstraint({ evaluationId: "constraint-a", constraintRef: constraint, mode: "hard", status: "satisfied", rationale: "Approved envelope explicitly covers the tested alternative.", evidenceRefs: [evidence], explicitlyConfigured: true });
  const constraintSoft = evaluateScenarioConstraint({ evaluationId: "constraint-b", constraintRef: constraint, mode: "soft", status: "reduced", rationale: "Optimization reduces required expenditure.", evidenceRefs: [evidence], explicitlyConfigured: true });
  const constraintBaseline = evaluateScenarioConstraint({ evaluationId: "constraint-baseline", constraintRef: constraint, mode: "soft", status: "satisfied", rationale: "No new expenditure is required.", evidenceRefs: [evidence], explicitlyConfigured: true });
  const benefit = (id: string, statement: string) => createExpectedEffect({ effectId: id, kind: "benefit", statement, claimType: "PREDICTION", evidenceRefs: [evidence], assumptionRefs: [assumption.claimId], confidence: "medium" });
  const risk = (id: string, statement: string) => createExpectedEffect({ effectId: id, kind: "risk", statement, claimType: "PREDICTION", evidenceRefs: [evidence], assumptionRefs: [prediction.claimId], confidence: "medium" });
  const evalA = createScenarioIntelligenceEvaluation({ evaluationId: "ei4-eval-a", scenarioRef: refA, cc9Evaluation: cc9A, expectedEffects: [benefit("benefit-a", "Material capacity relief is expected."), risk("risk-a", "Implementation cost may rise.")], claims: [assumption, unknown], constraints: [constraintSatisfied], tradeoffs: [tradeoff("tradeoff-a", "capacity", "Material capacity relief", "Higher short-term cost")], priorityFactors: [factor("a-strategy", "strategic-relevance", "high", "raises", "High strategic relevance"), factor("a-impact", "impact", "high", "raises", "Material expected capacity impact"), factor("a-uncertainty", "uncertainty", "medium", "reduces", "Demand duration is uncertain")] });
  const evalB = createScenarioIntelligenceEvaluation({ evaluationId: "ei4-eval-b", scenarioRef: refB, cc9Evaluation: cc9B, expectedEffects: [benefit("benefit-b", "Faster lower-cost optimization is expected.")], claims: [assumption, unknown], constraints: [constraintSoft], tradeoffs: [tradeoff("tradeoff-b", "cost", "Lower cost and faster action", "Capacity improvement may be limited")], priorityFactors: [factor("b-impact", "impact", "medium", "raises", "Moderate expected operational impact"), factor("b-time", "time-sensitivity", "medium", "raises", "Can begin sooner"), factor("b-uncertainty", "uncertainty", "medium", "reduces", "Efficiency ceiling is uncertain")] });
  const evalBaseline = createScenarioIntelligenceEvaluation({ evaluationId: "ei4-eval-baseline", scenarioRef: refBaseline, cc9Evaluation: cc9Baseline, expectedEffects: [risk("risk-baseline", "Current pressure may continue; deterioration is not asserted.")], claims: [prediction, unknown], constraints: [constraintBaseline], tradeoffs: [tradeoff("tradeoff-baseline", "operational-stability", "No immediate expenditure", "Existing capacity pressure remains")], priorityFactors: [factor("baseline-impact", "impact", "low", "neutral", "Maintains the current observed course"), factor("baseline-uncertainty", "uncertainty", "high", "reduces", "Future demand remains unknown")] });
  const evaluations = Object.freeze([evalA, evalB, evalBaseline]);
  const comparison = compareScenarioAlternatives({ comparisonId: "ei4-compare-capacity", evaluations });
  const ei1 = createExecutiveIntelligenceTrace({ traceId: "ei1-capacity", workspaceId, reality, issue: null, scenario: null, decision: null, execution: null, outcome: null, learning: null, memory: null });
  const trace = createScenarioPriorityTradeoffTrace({ traceId: "ei4-capacity", ei1, evaluations, comparison });
  return { reality, strategicContext, fact, assumption, prediction, unknown, constraint, issue, issueContext, a, b, baselineScenario, refA, refB, refBaseline, evalA, evalB, evalBaseline, evaluations, comparison, ei1, trace, factor };
}

test("A. EI:3 issue identity survives the typed Scenario handoff", () => {
  const value = fixture();
  assert.equal(value.refA.issueContext.issueId, value.issue.issueId);
  assert.equal(value.refA.issueIdentityPreserved, true);
  assert.deepEqual(value.issueContext.assumptionClaimRefs, [value.assumption.claimId]);
  assert.deepEqual(value.issueContext.constraintRefs, [value.constraint.constraintId]);
});

test("B. CC:9 remains authoritative for Scenario state and evaluation", () => {
  const value = fixture();
  assert.equal(value.refA.authorityId, "CC:9/ScenarioConversation");
  assert.equal(value.evalA.cc9Evaluation?.scenarioId, value.a.scenarioId);
  assert.equal(SCENARIO_PRIORITY_TRADEOFF_BOUNDARY.ownsScenarioState, false);
});

test("C. priority is not severity", () => {
  const value = fixture();
  const criticalOnly = resolveExplainablePriority([value.factor("critical", "operational-severity", "high", "raises", "Critical operational severity")]);
  const comparison = compareExplainablePriorities({ leftId: "critical-low-relevance", left: criticalOnly, rightId: "watch-high-relevance", right: value.evalA.priority });
  assert.equal(criticalOnly.level, "medium");
  assert.equal(value.issue.operationalSeverity, "watch");
  assert.equal(value.evalA.priority.level, "high");
  assert.equal(comparison.higherPriorityId, "watch-high-relevance");
  assert.equal(comparison.numericalDifference, null);
});

test("D. strategic relevance participates but is not the sole authority", () => {
  const value = fixture();
  assert.equal(value.issue.strategicRelevance, "high");
  assert.ok(value.evalA.priority.factors.some((factor) => factor.dimension === "strategic-relevance"));
  assert.ok(value.evalA.priority.factors.some((factor) => factor.dimension === "impact"));
});

test("E. hard constraint violations are explicitly infeasible and cannot be preferred", () => {
  const value = fixture();
  const violated = evaluateScenarioConstraint({ evaluationId: "hard-violation", constraintRef: value.constraint, mode: "hard", status: "violated", rationale: "Required cost exceeds the configured envelope.", evidenceRefs: [evidence], explicitlyConfigured: true });
  const infeasible = createScenarioIntelligenceEvaluation({ evaluationId: "infeasible", scenarioRef: value.refA, claims: [value.unknown], constraints: [violated], tradeoffs: value.evalA.tradeoffs, priorityFactors: value.evalA.priority.factors });
  const comparison = compareScenarioAlternatives({ comparisonId: "constraint-check", evaluations: [infeasible, value.evalB] });
  assert.equal(infeasible.feasible, false);
  assert.equal(infeasible.evaluationStatus, "infeasible");
  assert.equal(comparison.preferredAlternativeCandidateId, value.b.scenarioId);
});

test("F. trade-off gains and sacrifices remain separate", () => {
  const value = fixture();
  assert.equal(value.evalA.tradeoffs[0].gain, "Material capacity relief");
  assert.equal(value.evalA.tradeoffs[0].sacrifice, "Higher short-term cost");
});

test("G. assumptions, predictions and unknowns survive forward-looking comparison", () => {
  const value = fixture();
  assert.equal(value.evalA.forwardLooking, true);
  assert.equal(value.evalA.assumptions[0].type, "ASSUMPTION");
  assert.equal(value.evalA.uncertainties[0].type, "UNKNOWN");
  assert.ok(value.comparison.unresolvedReasons.some((reason) => reason.includes("Demand duration")));
});

test("H. priority and comparison invent no unsupported numeric precision", () => {
  const value = fixture();
  assert.equal(value.evalA.priority.numericalScore, null);
  assert.equal(value.trace.noFakePrecision, true);
  assert.equal("scenarioScores" in value.comparison, false);
  assert.equal(SCENARIO_PRIORITY_TRADEOFF_BOUNDARY.usesOpaqueScores, false);
});

test("I. Do Nothing is a legitimate baseline alternative without invented deterioration", () => {
  const value = fixture();
  assert.equal(value.baselineScenario.kind, "do-nothing");
  assert.equal(value.comparison.baselineScenarioId, value.baselineScenario.scenarioId);
  assert.match(value.evalBaseline.expectedRisks[0].statement, /may continue/);
});

test("J. preferred candidate is neither Recommendation nor committed Decision", () => {
  const value = fixture();
  assert.equal(value.comparison.preferredAlternativeCandidateId, value.a.scenarioId);
  assert.equal(value.comparison.recommendation, null);
  assert.equal(value.comparison.committedDecisionId, null);
  assert.equal(value.comparison.requiresDecisionCommitment, true);
});

test("K. Advisor exposes gains, sacrifices, supporting reasons and conflicts", () => {
  const value = fixture();
  const advisor = projectScenarioComparisonForAdvisor(value.comparison, value.evaluations);
  assert.ok(advisor.options[0].gains.length > 0);
  assert.ok(advisor.options[0].sacrifices.length > 0);
  assert.ok(advisor.supportingReasons.length > 0);
  assert.ok(advisor.conflictingEvidence.length > 0);
  assert.equal(advisor.recommendation, null);
});

test("L. Issue→Scenario→Trade-off trace reconstructs deterministically", () => {
  const value = fixture();
  const again = createScenarioPriorityTradeoffTrace({ traceId: "ei4-capacity", ei1: value.ei1, evaluations: value.evaluations, comparison: value.comparison });
  assert.deepEqual(value.trace, again);
  assert.equal(value.trace.valid, true);
  assert.equal(value.trace.complete, true);
  assert.equal(certifyScenarioPriorityTradeoffIntelligence(value.trace).certified, true);
  assert.equal(deeplyFrozen(value.trace), true);
});

test("M. EI:1 canonical references are consumed without mutation", () => {
  const value = fixture();
  const before = JSON.stringify(value.ei1);
  createScenarioPriorityTradeoffTrace({ traceId: "regression", ei1: value.ei1, evaluations: value.evaluations, comparison: value.comparison });
  assert.equal(JSON.stringify(value.ei1), before);
  assert.equal(SCENARIO_PRIORITY_TRADEOFF_BOUNDARY.mutatesEi1, false);
});

test("N. EI:2 strategic context remains immutable", () => {
  const value = fixture();
  assert.equal(value.issue.strategicContext, value.strategicContext);
  assert.equal(deeplyFrozen(value.strategicContext), true);
  assert.equal(SCENARIO_PRIORITY_TRADEOFF_BOUNDARY.mutatesEi2, false);
});

test("O. EI:3 claims and constraints remain intact and Stage stays projection-only", () => {
  const value = fixture();
  assert.deepEqual(value.issue.claims.map((claim) => claim.type), ["FACT", "ASSUMPTION", "PREDICTION", "UNKNOWN"]);
  assert.equal(value.issue.constraints[0], value.constraint);
  assert.equal(SCENARIO_PRIORITY_TRADEOFF_BOUNDARY.mutatesEi3, false);
  assert.equal(scenarioPriorityTradeoffStageCompatibility.positionRepresentsPriority, false);
  assert.equal(scenarioPriorityTradeoffStageCompatibility.proximityRepresentsCausality, false);
  assert.equal(deeplyFrozen(scenarioPriorityTradeoffCapabilityMap), true);
  assert.equal(deeplyFrozen(scenarioPriorityTradeoffGapRegister), true);
});
