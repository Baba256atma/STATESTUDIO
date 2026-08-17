import assert from "node:assert/strict";
import test from "node:test";
import { createEmptyNexoraExecutiveContextSnapshot, freezeExecutiveContextReference } from "../conversational-control/executiveContextSnapshot.ts";
import { createEmptyNexoraExecutiveDecisionSession } from "../conversational-control/executiveDecisionAuthority.ts";
import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createEmptyNexoraExecutiveScenarioSession, type NexoraExecutiveScenarioSession } from "../conversational-control/executiveScenarioResolver.ts";
import { createNexoraScenarioBaselineSnapshot, type NexoraExecutiveScenarioEvaluation } from "../conversational-control/executiveScenarioEvaluation.ts";
import type { NexoraExecutiveScenario } from "../conversational-control/executiveScenarioDefinition.ts";
import { createExecutiveIntelligenceTrace, type ExecutiveRealityReference } from "./executiveIntelligenceIntegration.ts";
import type { StrategicContext } from "./strategicIntelligenceIntegration.ts";
import { createExecutiveClaim, createExecutiveConstraintReference, createExecutiveIssueFraming } from "./problemRiskOpportunityIntelligence.ts";
import {
  compareScenarioAlternatives,
  createIssueScenarioContext,
  createPriorityFactor,
  createScenarioIntelligenceEvaluation,
  createScenarioPriorityTradeoffTrace,
  createScenarioTradeoff,
  evaluateScenarioConstraint,
  referenceCanonicalScenario,
  type ScenarioIntelligenceEvaluation,
} from "./scenarioPriorityTradeoffIntelligence.ts";
import {
  EXECUTIVE_DECISION_INTELLIGENCE_BOUNDARY,
  certifyExecutiveDecisionIntelligence,
  createDecisionRationaleHandoff,
  createExecutiveDecisionTrace,
  executiveDecisionCapabilityMap,
  executiveDecisionGapRegister,
  executiveDecisionStageCompatibility,
  executiveNextBestActionCompatibility,
  projectExecutiveDecisionForAdvisor,
  projectRecommendationForDecisionBrief,
  routeManagerCommitment,
  synthesizeExecutiveRecommendation,
} from "./executiveDecisionIntelligence.ts";

const workspaceId = "workspace-ei5";
const modelId = "model-ei5";
const subjectId = "obj-capacity";
const observedAt = "2026-08-17T12:00:00.000Z";
const evidence = Object.freeze({ sourceKind: "data-reality" as const, sourceId: "github-live", subjectId, factKey: "kpi-capacity" });

function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value)) return true;
  seen.add(value);
  return Object.isFrozen(value) && Object.values(value).every((child) => deeplyFrozen(child, seen));
}
function scenario(id: string, name: string, kind: "intervention" | "do-nothing"): NexoraExecutiveScenario {
  return Object.freeze({ scenarioId: `cc9:scenario:${id}`, name, revision: 1, baseContextId: workspaceId, subjectIds: Object.freeze([subjectId]), assumptions: Object.freeze([{ key: "demand-persists", subjectId, metricKey: "demand", operator: "hold" as const, evidenceSource: "github-live" }]), interventions: Object.freeze(kind === "intervention" ? [Object.freeze({ subjectId, actionKind: "increase-by", value: id === "expand" ? 20 : 10, unit: "%" })] : []), horizon: Object.freeze({ amount: 1, unit: "quarter" as const }), source: "conversation", status: "evaluated", recommendationId: null, parentScenarioId: null, kind });
}
function cc9Evaluation(s: NexoraExecutiveScenario, unknown = true): NexoraExecutiveScenarioEvaluation {
  return Object.freeze({ scenarioId: s.scenarioId, status: unknown ? "partial" : "evaluated", baseline: createNexoraScenarioBaselineSnapshot({ attentionBySubject: { [subjectId]: "important" } }), baselinePreserved: true, impacts: Object.freeze([]), risks: Object.freeze([]), tradeoffs: Object.freeze([]), uncertainties: Object.freeze(unknown ? [Object.freeze({ kind: "demand-duration", description: "Demand duration is unknown.", evidenceRefs: Object.freeze([evidence]) })] : []), evidenceRefs: Object.freeze([evidence]), horizon: s.horizon });
}

function fixture() {
  const reality: ExecutiveRealityReference = Object.freeze({ stage: "reality", authorityId: "P0:1/NexoraDataRealityFoundation", recordId: "dataset-capacity-live", workspaceId, subjectIds: Object.freeze([subjectId]), evidenceRefs: Object.freeze([Object.freeze({ ...evidence, observedAt, confidence: 0.98, confidenceState: "verified" })]), provenanceRefs: Object.freeze(["github-live:repo:nexora:utilization"]), observedAt, uncertaintyRefs: Object.freeze([]), sourceSnapshotId: "snapshot-github-1", datasetId: "dataset-capacity-live" });
  const objectiveRef = Object.freeze({ kind: "objective" as const, id: "objective-readiness", label: "Maintain Operational Readiness", authorityId: "DS-5:1/WorkspaceOkr", workspaceId, modelId, provenanceRefs: Object.freeze(["objective-readiness"]), observedAt });
  const strategicContext: StrategicContext = Object.freeze({ contextId: "strategic-capacity", workspaceId, modelId, references: Object.freeze([objectiveRef]), relationships: Object.freeze([]), operationalSeverity: "watch", strategicRelevance: Object.freeze({ level: "high", rationale: "Capacity explicitly supports readiness.", basisRelationshipIds: Object.freeze(["objective-capacity"]), source: "explicit-configuration" }), valid: true, issues: Object.freeze([]) });
  const fact = createExecutiveClaim({ claimId: "fact-capacity", type: "FACT", statement: "Capacity pressure is elevated.", evidenceRefs: [evidence], provenanceRefs: reality.provenanceRefs, observedAt, realityEvidence: reality.evidenceRefs });
  const assumption = createExecutiveClaim({ claimId: "assumption-resources", type: "ASSUMPTION", statement: "Existing resources remain available.", evidenceRefs: [evidence], provenanceRefs: reality.provenanceRefs });
  const prediction = createExecutiveClaim({ claimId: "prediction-pressure", type: "PREDICTION", statement: "Pressure may persist.", evidenceRefs: [evidence], provenanceRefs: reality.provenanceRefs });
  const unknown = createExecutiveClaim({ claimId: "unknown-demand", type: "UNKNOWN", statement: "Demand persistence remains unknown." });
  const budget = createExecutiveConstraintReference({ constraintId: "constraint-budget", category: "budget", summary: "Expansion budget is constrained.", affectedEntityRefs: [subjectId], authorityId: "CC:8/ExecutiveAssessment", evidenceRefs: [evidence] });
  const issue = createExecutiveIssueFraming({ issueId: "issue-capacity", requestedType: "problem", title: "Capacity pressure", workspaceId, reality, strategicContext, claims: [fact, assumption, prediction, unknown], constraints: [budget], operationalSeverity: "watch", uncertaintyRefs: [unknown.claimId] });
  const context = createIssueScenarioContext(issue);
  const expand = scenario("expand", "Expand capacity", "intervention");
  const optimize = scenario("optimize", "Optimize current capacity", "intervention");
  const baseline = scenario("baseline", "Do Nothing", "do-nothing");
  const makeEvaluation = (id: string, s: NexoraExecutiveScenario, feasible: boolean, priority: "high" | "medium" | "low", gain: string, sacrifice: string): ScenarioIntelligenceEvaluation => {
    const scenarioRef = referenceCanonicalScenario({ issueContext: context, scenario: s });
    const constraint = evaluateScenarioConstraint({ evaluationId: `constraint-${id}`, constraintRef: budget, mode: "hard", status: feasible ? "satisfied" : "violated", rationale: feasible ? "Explicitly within the known envelope." : "Explicitly exceeds the known envelope.", evidenceRefs: [evidence], explicitlyConfigured: true });
    const factors = priority === "high" ? [createPriorityFactor({ factorId: `${id}-strategy`, dimension: "strategic-relevance", level: "high", effect: "raises", reason: "High strategic relevance", evidenceRefs: [evidence], assumptionRefs: [] }), createPriorityFactor({ factorId: `${id}-impact`, dimension: "impact", level: "high", effect: "raises", reason: "Material expected impact", evidenceRefs: [evidence], assumptionRefs: [] })] : [createPriorityFactor({ factorId: `${id}-impact`, dimension: "impact", level: priority, effect: priority === "low" ? "neutral" : "raises", reason: priority === "low" ? "Maintains current course" : "Moderate expected impact", evidenceRefs: [evidence], assumptionRefs: [] })];
    const tradeoff = createScenarioTradeoff({ tradeoffId: `tradeoff-${id}`, dimension: id === "optimize" ? "cost" : "capacity", gain, sacrifice, evidenceRefs: [evidence], assumptionRefs: [assumption.claimId], confidence: "medium", timeHorizon: s.horizon, reversibility: "partially-reversible" });
    return createScenarioIntelligenceEvaluation({ evaluationId: `evaluation-${id}`, scenarioRef, cc9Evaluation: cc9Evaluation(s), claims: [assumption, prediction, unknown], constraints: [constraint], tradeoffs: [tradeoff], priorityFactors: factors });
  };
  const evalExpand = makeEvaluation("expand", expand, false, "high", "Largest potential relief", "Hard budget violation");
  const evalOptimize = makeEvaluation("optimize", optimize, true, "high", "Lower-cost near-term relief", "Lower upside than expansion");
  const evalBaseline = makeEvaluation("baseline", baseline, true, "low", "No immediate expenditure", "Current pressure remains");
  const evaluations = Object.freeze([evalExpand, evalOptimize, evalBaseline]);
  const comparison = compareScenarioAlternatives({ comparisonId: "comparison-capacity", evaluations });
  const ei1 = createExecutiveIntelligenceTrace({ traceId: "ei1-capacity", workspaceId, reality, issue: null, scenario: null, decision: null, execution: null, outcome: null, learning: null, memory: null });
  const ei4 = createScenarioPriorityTradeoffTrace({ traceId: "ei4-capacity", ei1, evaluations, comparison });
  const recommendation = synthesizeExecutiveRecommendation({ recommendationId: "ei5:recommendation:capacity", issue, comparison, evaluations, createdAt: observedAt });
  const rationale = createDecisionRationaleHandoff({ recommendation, issue, evaluation: evalOptimize, expectedOutcomeRefs: ["expected:capacity-relief"], successCriteriaRefs: ["success:kpi-capacity-normal"], kpiRefs: ["kpi-capacity"] });
  const scenarioSession: NexoraExecutiveScenarioSession = Object.freeze({ ...createEmptyNexoraExecutiveScenarioSession(), scenariosById: Object.freeze(Object.fromEntries([expand, optimize, baseline].map((s) => [s.scenarioId, s]))), evaluationsById: Object.freeze({ [expand.scenarioId]: cc9Evaluation(expand), [optimize.scenarioId]: cc9Evaluation(optimize), [baseline.scenarioId]: cc9Evaluation(baseline) }), candidateScenarioIds: Object.freeze([expand.scenarioId, optimize.scenarioId, baseline.scenarioId]), activeScenarioId: optimize.scenarioId, lastComparison: null });
  const executiveContext = createEmptyNexoraExecutiveContextSnapshot({ currentSubject: freezeExecutiveContextReference({ subjectId, subjectKind: "object", canonicalName: "Capacity", source: "conversation", turnIndex: 0 }), currentProblem: freezeExecutiveContextReference({ subjectId: issue.issueId, subjectKind: "problem", canonicalName: issue.title, source: "conversation", turnIndex: 0 }), currentGoal: freezeExecutiveContextReference({ subjectId: objectiveRef.id, subjectKind: "goal", canonicalName: objectiveRef.label, source: "conversation", turnIndex: 0 }), currentWorkspaceId: workspaceId, currentModelId: modelId, lastRecommendationId: recommendation.recommendationId });
  const runtime = createNexoraCanonicalDecisionRuntime({ authorityId: "nexora.canonical-decision-runtime" });
  const commitmentInput = (action: "preference" | "approve", strength: "preference" | "explicit") => ({ action, strength, executiveContext, decisionSession: createEmptyNexoraExecutiveDecisionSession(), decisionRuntime: runtime.adapter, scenarioSession, targetHintRaw: optimize.scenarioId, primarySubjectId: subjectId, commandId: `command-${action}`, utterance: action === "approve" ? "Approve Optimize current capacity" : "I like Optimize current capacity", committedAt: observedAt });
  return { reality, strategicContext, fact, assumption, prediction, unknown, budget, issue, expand, optimize, baseline, evalExpand, evalOptimize, evalBaseline, evaluations, comparison, ei1, ei4, recommendation, rationale, scenarioSession, executiveContext, runtime, commitmentInput };
}

test("A. EI:4 alternatives produce an evidence-backed recommendation", () => {
  const value = fixture();
  assert.equal(value.recommendation.recommendationStatus, "supported");
  assert.equal(value.recommendation.preferredScenarioId, value.optimize.scenarioId);
  assert.ok(value.recommendation.evidenceRefs.length > 0);
});
test("B. missing evidence produces an unresolved recommendation", () => {
  const value = fixture();
  const issue = Object.freeze({ ...value.issue, claims: Object.freeze([]), evidenceStrength: "unknown" as const });
  const result = synthesizeExecutiveRecommendation({ recommendationId: "missing", issue, comparison: value.comparison, evaluations: value.evaluations, createdAt: observedAt });
  assert.equal(result.recommendationStatus, "unresolved");
  assert.equal(result.preferredScenarioId, null);
  assert.equal(result.confidence, "unknown");
});
test("C. a hard-constraint violation cannot become the recommendation", () => {
  const value = fixture();
  const comparison = Object.freeze({ ...value.comparison, preferredAlternativeCandidateId: value.expand.scenarioId });
  const result = synthesizeExecutiveRecommendation({ recommendationId: "infeasible", issue: value.issue, comparison, evaluations: value.evaluations, createdAt: observedAt });
  assert.notEqual(result.recommendationStatus, "supported");
  assert.equal(result.preferredScenarioId, null);
});
test("D. recommendation preserves gain and sacrifice rationale", () => {
  const value = fixture();
  assert.equal(value.recommendation.tradeoffRationale[0].gain, "Lower-cost near-term relief");
  assert.equal(value.recommendation.tradeoffRationale[0].sacrifice, "Lower upside than expansion");
});
test("E. assumptions, predictions and unknowns survive recommendation and rationale", () => {
  const value = fixture();
  assert.deepEqual(value.recommendation.assumptionRefs, [value.assumption.claimId]);
  assert.deepEqual(value.recommendation.predictionRefs, [value.prediction.claimId]);
  assert.deepEqual(value.recommendation.unknownRefs, [value.unknown.claimId]);
  assert.ok(value.rationale.runtimeRationale.uncertaintyRefs.includes(value.unknown.claimId));
});
test("F. material conflicting evidence stays visible", () => {
  const value = fixture();
  assert.ok(value.recommendation.conflictingEvidence.some((item) => item.includes("Lower upside")));
});
test("G. creating a recommendation never creates a Decision", () => {
  const value = fixture();
  assert.equal(value.runtime.adapter.listDecisions().length, 0);
  assert.equal(value.recommendation.recommendationOnly, true);
});
test("H. preference language does not transition CC:10R", () => {
  const value = fixture();
  const result = routeManagerCommitment({ recommendation: value.recommendation, rationaleHandoff: value.rationale, commitmentInput: value.commitmentInput("preference", "preference") });
  assert.equal(result.state, "preferred");
  assert.equal(result.canonicalDecisionConfirmed, false);
  assert.equal(value.runtime.adapter.listDecisions().length, 0);
});
test("I. explicit manager commitment routes through CC:10 and canonical CC:10R", () => {
  const value = fixture();
  const result = routeManagerCommitment({ recommendation: value.recommendation, rationaleHandoff: value.rationale, commitmentInput: value.commitmentInput("approve", "explicit") });
  assert.equal(result.state, "committed");
  assert.equal(result.canonicalDecisionConfirmed, true);
  assert.equal(result.commitment.decision?.status, "Approved");
  assert.equal(value.runtime.adapter.getDecision(result.commitment.decision!.decisionId)?.decisionId, result.commitment.decision?.decisionId);
});
test("J. EI:5 owns no local Decision authority", () => {
  assert.equal(EXECUTIVE_DECISION_INTELLIGENCE_BOUNDARY.ownsDecisionState, false);
  assert.equal(EXECUTIVE_DECISION_INTELLIGENCE_BOUNDARY.decisionAuthority, "CC:10R/CanonicalDecisionRuntime");
});
test("K. committed Decision traces to scenario, recommendation, issue, and evidence", () => {
  const value = fixture();
  const result = routeManagerCommitment({ recommendation: value.recommendation, rationaleHandoff: value.rationale, commitmentInput: value.commitmentInput("approve", "explicit") });
  const decision = result.commitment.decision!;
  assert.equal(decision.scenarioId, value.optimize.scenarioId);
  assert.equal(decision.recommendationId, value.recommendation.recommendationId);
  assert.ok(decision.rationale?.problemIds.includes(value.issue.issueId));
  assert.ok(decision.evidenceRefs.length > 0);
  assert.ok(decision.evidenceRefs.some((ref) => ref.sourceId === "github-live"));
  assert.ok(decision.uncertaintyRefs.includes(value.assumption.claimId));
  assert.ok(decision.uncertaintyRefs.includes(value.prediction.claimId));
  assert.ok(decision.uncertaintyRefs.includes(value.unknown.claimId));
});
test("L. EI:2 strategic context survives rationale", () => {
  const value = fixture();
  assert.ok(value.rationale.strategicContextRefs.includes(value.strategicContext.contextId));
  assert.ok(value.rationale.runtimeRationale.goalIds.includes("objective-readiness"));
});
test("M. PROD:3 remains workflow guidance only", () => {
  assert.equal(executiveNextBestActionCompatibility.workflowGuidanceOnly, true);
  assert.equal(executiveNextBestActionCompatibility.substantiveRecommendationAuthority, false);
});
test("N. PROD:4 remains presentation-only", () => {
  const value = fixture();
  const brief = projectRecommendationForDecisionBrief(value.recommendation);
  assert.equal(brief.presentationOnly, true);
  assert.equal(brief.truthAuthority, false);
  assert.equal(brief.recommendationRef, value.recommendation.recommendationId);
});
test("O. Advisor distinguishes recommendation from canonical approval", () => {
  const value = fixture();
  const before = createExecutiveDecisionTrace({ traceId: "before", ei1: value.ei1, ei4: value.ei4, recommendation: value.recommendation, rationale: value.rationale });
  assert.equal(projectExecutiveDecisionForAdvisor(before).decisionApproved, false);
  const commitment = routeManagerCommitment({ recommendation: value.recommendation, rationaleHandoff: value.rationale, commitmentInput: value.commitmentInput("approve", "explicit") });
  const after = createExecutiveDecisionTrace({ traceId: "after", ei1: value.ei1, ei4: value.ei4, recommendation: value.recommendation, rationale: value.rationale, commitment });
  assert.equal(projectExecutiveDecisionForAdvisor(after).decisionApproved, true);
  assert.equal(projectExecutiveDecisionForAdvisor(after).canonicalDecisionId, commitment.commitment.decision?.decisionId);
});
test("P. EI:1 trace remains stable", () => {
  const value = fixture(); const before = JSON.stringify(value.ei1);
  createExecutiveDecisionTrace({ traceId: "regression", ei1: value.ei1, ei4: value.ei4, recommendation: value.recommendation, rationale: value.rationale });
  assert.equal(JSON.stringify(value.ei1), before);
});
test("Q. EI:2 strategic context remains immutable", () => {
  const value = fixture(); assert.equal(deeplyFrozen(value.strategicContext), true); assert.equal(value.issue.strategicContext, value.strategicContext);
});
test("R. EI:3 claim taxonomy and constraints remain intact", () => {
  const value = fixture(); assert.deepEqual(value.issue.claims.map((claim) => claim.type), ["FACT", "ASSUMPTION", "PREDICTION", "UNKNOWN"]); assert.equal(value.issue.constraints[0], value.budget);
});
test("S. EI:4 analysis remains immutable and EI:5 trace certifies", () => {
  const value = fixture(); const before = JSON.stringify(value.ei4);
  const trace = createExecutiveDecisionTrace({ traceId: "ei5-capacity", ei1: value.ei1, ei4: value.ei4, recommendation: value.recommendation, rationale: value.rationale });
  assert.equal(JSON.stringify(value.ei4), before);
  assert.equal(certifyExecutiveDecisionIntelligence(trace).certified, true);
  assert.equal(deeplyFrozen(trace), true);
  assert.equal(executiveDecisionStageCompatibility.clickCommitsDecision, false);
  assert.equal(deeplyFrozen(executiveDecisionCapabilityMap), true);
  assert.equal(deeplyFrozen(executiveDecisionGapRegister), true);
});
