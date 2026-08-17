import assert from "node:assert/strict";
import test from "node:test";
import type { NexoraDataRealitySnapshot, NexoraDataset } from "../data-reality/dataRealityContracts.ts";
import type { NexoraDataRealityHandoff } from "../data-reality/realDataIntegrationFoundation.ts";
import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import type { NexoraExecutiveScenario } from "../conversational-control/executiveScenarioDefinition.ts";
import {
  EXECUTIVE_INTELLIGENCE_BOUNDARY,
  certifyExecutiveIntelligenceTrace,
  createExecutiveIntelligenceTrace,
  executiveIntelligenceCapabilityMap,
  executiveIntelligenceGapRegister,
  executiveIntelligenceTransitionMap,
  prepareExecutiveLearningPromotion,
  projectExecutiveIntelligenceForAdvisor,
  referenceCanonicalDecision,
  referenceCanonicalExecution,
  referenceExecutiveIssue,
  referenceExecutiveOutcome,
  referenceExecutiveReality,
  referenceExecutiveScenario,
  type ExecutiveEvidenceReference,
  type ExecutiveIntelligenceTrace,
  type ExecutiveOutcomeMeasurementReference,
} from "./executiveIntelligenceIntegration.ts";

const workspaceId = "workspace-ei1";
const observedAt = "2026-08-17T12:00:00.000Z";
const subjectId = "nol:capacity";

function isDeeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value)) return true;
  seen.add(value);
  return Object.isFrozen(value) && Object.values(value).every((child) => isDeeplyFrozen(child, seen));
}

function realityFixture() {
  const dataset: NexoraDataset = Object.freeze({
    id: "dataset-capacity-live", name: "Capacity live", version: "1", capturedAt: observedAt,
    source: "api", familyId: "capacity", scenario: "baseline",
    records: Object.freeze([{ objectKey: "capacity", metricKey: "utilization", value: 21.3, unit: "%", observedAt }]),
  });
  const provenance = Object.freeze({ sourceId: "github-live", sourceType: "github", providerName: "GitHub", sourceRecordId: "repo:nexora", sourceFieldKey: "utilization", observedAt, importedAt: observedAt, transformationRef: "mapping:capacity", confidenceState: "verified" as const, confidence: 0.98 });
  const handoff: NexoraDataRealityHandoff = Object.freeze({ workspaceId, sourceId: "github-live", sourceSnapshotId: "snapshot-github-1", mappingId: "mapping:capacity", dataset, factProvenance: Object.freeze([{ objectKey: "capacity", metricKey: "utilization", provenance }]), destinationAuthority: "P0:1/NexoraDataRealityFoundation" });
  const snapshot: NexoraDataRealitySnapshot = Object.freeze({ datasetId: dataset.id, facts: Object.freeze([{ objectKey: "capacity", metricKey: "utilization", value: 21.3, unit: "%", sourceDatasetId: dataset.id }]), kpis: Object.freeze([{ kpiId: "kpi-capacity", objectKey: "capacity", nexoraObjectId: subjectId, value: 21.3, unit: "%", calculatedAt: observedAt }]), objectStates: Object.freeze([{ objectKey: "capacity", nexoraObjectId: subjectId, state: "attention" as const, reasons: Object.freeze([{ kpiId: "kpi-capacity", kpiName: "Capacity", value: 21.3, unit: "%", state: "attention" as const, ruleId: "rule-capacity" }]) }]), createdAt: observedAt });
  return referenceExecutiveReality({ handoff, snapshot });
}

function evidence(sourceId: string, factKey: string): ExecutiveEvidenceReference {
  return Object.freeze({ sourceKind: "data-reality", sourceId, subjectId, factKey, observedAt, confidence: 0.98, confidenceState: "verified" });
}

function measurement(kind: "expected" | "actual", id: string, summary: string): ExecutiveOutcomeMeasurementReference {
  return Object.freeze({ outcomeId: id, kind, summary, observedAt: kind === "actual" ? "2026-09-17T12:00:00.000Z" : observedAt, evidenceRefs: Object.freeze([evidence(kind === "expected" ? "decision:expected-capacity" : "rdi:actual-capacity", "capacity")]) });
}

function completeFixture(): ExecutiveIntelligenceTrace {
  const reality = realityFixture();
  const issue = referenceExecutiveIssue({ workspaceId, observedAt, issueKind: "risk", issue: { issueId: "issue-capacity", subjectId, summary: "Capacity requires attention.", severity: "important", evidenceRefs: Object.freeze([{ sourceKind: "data-reality", sourceId: reality.recordId, subjectId, factKey: "kpi-capacity" }]) } });
  const scenario: NexoraExecutiveScenario = Object.freeze({ scenarioId: "cc9:scenario:capacity", name: "Increase capacity", revision: 1, baseContextId: workspaceId, subjectIds: Object.freeze([subjectId]), assumptions: Object.freeze([{ key: "capacity", subjectId, metricKey: "capacity", operator: "increase-by" as const, value: 10, unit: "%", evidenceSource: "dataset-capacity-live" }]), interventions: Object.freeze([{ subjectId, actionKind: "increase-capacity", value: 10, unit: "%" }]), horizon: Object.freeze({ amount: 1, unit: "month" }), source: "conversation", status: "evaluated", recommendationId: null, parentScenarioId: null, kind: "intervention" });
  const scenarioRef = referenceExecutiveScenario({ scenario, workspaceId });
  const decisions = createNexoraCanonicalDecisionRuntime();
  const decisionResult = decisions.adapter.transitionDecision({ decisionId: "decision-capacity", action: "approve", title: "Increase capacity", subjectIds: [subjectId], scenarioId: scenario.scenarioId, scenarioRevision: scenario.revision, workspaceId, modelId: "model-ei1", committedAt: observedAt, evidenceRefs: [{ sourceKind: "data-reality", sourceId: reality.recordId, subjectId, factKey: "kpi-capacity" }], rationale: { summary: "Capacity evidence requires intervention.", goalIds: [], problemIds: [issue.recordId], scenarioId: scenario.scenarioId, evidenceRefs: [{ sourceKind: "data-reality", sourceId: reality.recordId, subjectId, factKey: "kpi-capacity" }], uncertaintyRefs: [] } });
  assert.equal(decisionResult.status, "applied");
  const decision = referenceCanonicalDecision({ runtime: decisions.adapter, decisionId: "decision-capacity" })!;
  const executions = createNexoraCanonicalExecutionRuntime({ decisionRuntime: decisions.adapter });
  const created = executions.createExecution({ decisionId: decision.recordId, workspaceId, modelId: "model-ei1" });
  assert.equal(created.status, "created");
  const execution = referenceCanonicalExecution({ runtime: executions, executionId: created.execution!.executionId, subjectIds: [subjectId], observedAt })!;
  const outcome = referenceExecutiveOutcome({ outcomeId: "outcome-capacity", workspaceId, executionId: execution.recordId, subjectIds: [subjectId], authorityId: "APP-4:7/ExecutiveDecisionMemory", expected: measurement("expected", "outcome-capacity-expected", "Capacity improves by 10%."), actual: measurement("actual", "outcome-capacity-actual", "Capacity improved by 8%.") });
  const promotion = prepareExecutiveLearningPromotion({ outcome, memoryId: "memory-capacity-learning", lessonId: "lesson-capacity", lessonSummary: "Capacity lead time must be included.", lessonContext: "Expected improvement was 10%; observed improvement was 8%.", decisionId: decision.recordId, owner: "manager", confidence: 0.9, timestamp: "2026-09-17T12:00:00.000Z" });
  assert.equal(promotion.eligible, true);
  return createExecutiveIntelligenceTrace({ traceId: "trace-capacity", workspaceId, reality, issue, scenario: scenarioRef, decision, execution, outcome, learning: promotion.learning, memory: promotion.memory });
}

test("A. EI is a frozen reference boundary and preserves specialized authority", () => {
  assert.equal(EXECUTIVE_INTELLIGENCE_BOUNDARY.ownsReality, false);
  assert.equal(EXECUTIVE_INTELLIGENCE_BOUNDARY.ownsDecisions, false);
  assert.equal(EXECUTIVE_INTELLIGENCE_BOUNDARY.persistsMemory, false);
  assert.equal(isDeeplyFrozen(executiveIntelligenceCapabilityMap), true);
  assert.equal(isDeeplyFrozen(executiveIntelligenceTransitionMap), true);
  assert.equal(isDeeplyFrozen(executiveIntelligenceGapRegister), true);
});

test("B/C. identity and RDI provenance survive the reference chain", () => {
  const trace = completeFixture();
  assert.equal(trace.valid, true);
  assert.ok(trace.reality?.subjectIds.includes(subjectId));
  assert.ok(trace.reality?.provenanceRefs.some((ref) => ref.includes("github-live")));
  assert.equal(trace.issue?.evidenceRefs[0]?.sourceId, trace.reality?.recordId);
});

test("D. committed Decision and derived Execution are read through canonical runtime ports", () => {
  const trace = completeFixture();
  assert.equal(trace.decision?.authorityId, "nexora.canonical-decision-runtime");
  assert.equal(trace.decision?.status, "Approved");
  assert.equal(trace.execution?.decisionId, trace.decision?.recordId);
  assert.equal(trace.execution?.authorityId, "nexora.canonical-execution-runtime");
});

test("E. expected and actual outcomes remain distinct and observation does not imply cause", () => {
  const trace = completeFixture();
  assert.equal(trace.outcome?.expected?.kind, "expected");
  assert.equal(trace.outcome?.actual?.kind, "actual");
  assert.notEqual(trace.outcome?.expected?.outcomeId, trace.outcome?.actual?.outcomeId);
  assert.equal(trace.outcome?.causeEstablished, false);
});

test("F. learning promotion delegates record creation to APP-4 and rejects incomplete evidence", () => {
  const trace = completeFixture();
  assert.equal(trace.memory?.authorityId, "APP-4/ExecutiveMemoryStorageEngine");
  const outcome = referenceExecutiveOutcome({ outcomeId: "outcome-incomplete", workspaceId, executionId: "execution-x", subjectIds: [subjectId], authorityId: "CC:12/ExecutionFollowUp", expected: measurement("expected", "expected-x", "Expected"), actual: null });
  const rejected = prepareExecutiveLearningPromotion({ outcome, memoryId: "memory-x", lessonId: "lesson-x", lessonSummary: "Do not invent", lessonContext: "Missing actual", decisionId: "decision-x", owner: "manager", confidence: null, timestamp: observedAt });
  assert.equal(rejected.eligible, false);
  assert.equal(rejected.record, null);
  assert.ok(rejected.reasons.includes("actual-outcome-missing"));
});

test("G. missing evidence and links remain explicitly unresolved for Advisor", () => {
  const reality = realityFixture();
  const trace = createExecutiveIntelligenceTrace({ traceId: "trace-partial", workspaceId, reality, issue: null, scenario: null, decision: null, execution: null, outcome: null, learning: null, memory: null });
  assert.equal(trace.complete, false);
  assert.equal(trace.links[0]?.status, "unresolved");
  const advisor = projectExecutiveIntelligenceForAdvisor(trace);
  assert.equal(advisor.answers.whatIsHappening.status, "supported");
  assert.equal(advisor.answers.whyAttention.status, "unresolved");
  assert.equal(advisor.authority, false);
});

test("H. a fully linked chain reconstructs and certifies from Reality through APP-4", () => {
  const trace = completeFixture();
  const certification = certifyExecutiveIntelligenceTrace(trace);
  assert.equal(trace.complete, true);
  assert.equal(trace.links.length, 7);
  assert.equal(trace.links.every((link) => link.status === "connected"), true);
  assert.equal(certification.certified, true);
  assert.equal(certification.provenancePreserved, true);
  assert.equal(isDeeplyFrozen(trace), true);
});
