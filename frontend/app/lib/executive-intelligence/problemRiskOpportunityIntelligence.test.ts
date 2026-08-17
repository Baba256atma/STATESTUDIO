import assert from "node:assert/strict";
import test from "node:test";
import type { NexoraDataset, NexoraDataRealitySnapshot } from "../data-reality/dataRealityContracts.ts";
import type { NexoraDataRealityHandoff, NexoraDataSourceValidationResult } from "../data-reality/realDataIntegrationFoundation.ts";
import {
  createExecutiveIntelligenceTrace,
  referenceExecutiveReality,
} from "./executiveIntelligenceIntegration.ts";
import {
  createStrategicContext,
  enrichEi1TraceWithStrategicContext,
  referenceEi1Reality,
  type StrategicReference,
} from "./strategicIntelligenceIntegration.ts";
import {
  PROBLEM_RISK_OPPORTUNITY_BOUNDARY,
  certifyProblemRiskOpportunityIntelligence,
  createEvidenceBoundedRelationship,
  createExecutiveClaim,
  createExecutiveConstraintReference,
  createExecutiveIssueFraming,
  createProblemRiskOpportunityTrace,
  createRealityAssessmentEvidenceHandoff,
  problemRiskOpportunityCapabilityMap,
  problemRiskOpportunityGapRegister,
  problemRiskOpportunityStageCompatibility,
  projectIssueForAdvisor,
  referenceCanonicalAssessmentFraming,
} from "./problemRiskOpportunityIntelligence.ts";

const workspaceId = "workspace-ei3";
const modelId = "model-ei3";
const subjectId = "nol:capacity";
const observedAt = "2026-08-17T12:00:00.000Z";

function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value)) return true;
  seen.add(value);
  return Object.isFrozen(value) && Object.values(value).every((child) => deeplyFrozen(child, seen));
}

function fixture() {
  const dataset: NexoraDataset = Object.freeze({
    id: "dataset-capacity-live", name: "Capacity live", version: "1", capturedAt: observedAt,
    source: "api", familyId: "capacity", scenario: "baseline",
    records: Object.freeze([{ objectKey: "capacity", metricKey: "utilization", value: 21.3, unit: "%", observedAt }]),
  });
  const provenance = Object.freeze({ sourceId: "github-live", sourceType: "github", providerName: "GitHub", sourceRecordId: "repo:nexora", sourceFieldKey: "utilization", observedAt, importedAt: observedAt, transformationRef: "mapping:capacity", confidenceState: "verified" as const, confidence: 0.98 });
  const handoff: NexoraDataRealityHandoff = Object.freeze({ workspaceId, sourceId: provenance.sourceId, sourceSnapshotId: "snapshot-github-1", mappingId: "mapping:capacity", dataset, factProvenance: Object.freeze([{ objectKey: "capacity", metricKey: "utilization", provenance }]), destinationAuthority: "P0:1/NexoraDataRealityFoundation" });
  const snapshot: NexoraDataRealitySnapshot = Object.freeze({ datasetId: dataset.id, facts: Object.freeze([{ objectKey: "capacity", metricKey: "utilization", value: 21.3, unit: "%", sourceDatasetId: dataset.id }]), kpis: Object.freeze([{ kpiId: "kpi-capacity", objectKey: "capacity", nexoraObjectId: subjectId, value: 21.3, unit: "%", calculatedAt: observedAt }]), objectStates: Object.freeze([{ objectKey: "capacity", nexoraObjectId: subjectId, state: "attention" as const, reasons: Object.freeze([{ kpiId: "kpi-capacity", kpiName: "Capacity", value: 21.3, unit: "%", state: "attention" as const, ruleId: "rule-capacity" }]) }]), createdAt: observedAt });
  const validation: NexoraDataSourceValidationResult = Object.freeze({ state: "valid", accepted: true, issues: Object.freeze([]) });
  const reality = referenceExecutiveReality({ handoff, snapshot });
  const assessmentHandoff = createRealityAssessmentEvidenceHandoff({ handoff, snapshot, validation, reality });
  const evidence = assessmentHandoff.evidence.facts[0].source;
  const claim = createExecutiveClaim({ claimId: "claim-capacity-fact", type: "FACT", statement: "Capacity utilization is 21.3% and requires attention.", evidenceRefs: [evidence], provenanceRefs: assessmentHandoff.evidenceProvenance[assessmentHandoff.evidence.facts[0].evidenceId], observedAt, realityEvidence: reality.evidenceRefs });
  const ei1 = createExecutiveIntelligenceTrace({ traceId: "ei1-capacity", workspaceId, reality, issue: null, scenario: null, decision: null, execution: null, outcome: null, learning: null, memory: null });
  const realityStrategicRef = referenceEi1Reality({ reality, modelId });
  const strategicContext = createStrategicContext({ contextId: "strategic-capacity", workspaceId, modelId, references: [realityStrategicRef], relationships: [], operationalSeverity: "watch" });
  const strategic = enrichEi1TraceWithStrategicContext({ ei1, strategicContext });
  return { dataset, handoff, snapshot, validation, reality, assessmentHandoff, evidence, claim, ei1, strategicContext, strategic };
}

test("A. validated RDI observation reaches assessment with complete provenance", () => {
  const value = fixture();
  const issue = referenceCanonicalAssessmentFraming({ assessment: Object.freeze({ issueId: "cc8:capacity", subjectId, summary: "Capacity utilization requires attention.", severity: "important", evidenceRefs: Object.freeze([value.evidence]) }), requestedType: "problem", handoff: value.assessmentHandoff, operationalSeverity: "watch" });
  assert.equal(value.assessmentHandoff.validationAccepted, true);
  assert.equal(value.assessmentHandoff.sourceSnapshotId, value.reality.sourceSnapshotId);
  assert.equal(value.assessmentHandoff.evidence.facts[0].factValue, 21.3);
  assert.ok(value.assessmentHandoff.evidenceProvenance["ei3:dataset-capacity-live:kpi-capacity"].some((ref) => ref.includes("github-live")));
  assert.equal(issue.assessmentAuthorityId, "CC:8/ExecutiveAssessment");
  assert.equal(issue.claims[0].confidence, "high");
  assert.equal(deeplyFrozen(value.assessmentHandoff), true);
});

test("B. problem, risk, opportunity and unresolved classifications remain distinct", () => {
  const value = fixture();
  const make = (requestedType: "problem" | "risk" | "opportunity" | "unresolved", claims = [value.claim]) => createExecutiveIssueFraming({ issueId: `issue-${requestedType}`, requestedType, title: requestedType, workspaceId, reality: value.reality, claims, operationalSeverity: "watch" });
  assert.equal(make("problem").issueType, "problem");
  assert.equal(make("opportunity").issueType, "opportunity");
  assert.equal(make("risk", [createExecutiveClaim({ claimId: "future-risk", type: "PREDICTION", statement: "Capacity may become constrained.", evidenceRefs: [value.evidence], provenanceRefs: value.reality.provenanceRefs })]).issueType, "risk");
  assert.equal(make("unresolved").issueType, "unresolved");
  assert.equal(make("problem", []).issueType, "unresolved");
});

test("C. assumptions never become facts and unsupported facts are rejected", () => {
  const value = fixture();
  const assumption = createExecutiveClaim({ claimId: "assumption", type: "ASSUMPTION", statement: "Staffing may contribute.", evidenceRefs: [value.evidence], provenanceRefs: value.reality.provenanceRefs });
  assert.equal(assumption.type, "ASSUMPTION");
  assert.throws(() => createExecutiveClaim({ claimId: "unsupported", type: "FACT", statement: "Unsupported." }), /evidence-and-provenance/);
});

test("D. predictions never mutate observed reality", () => {
  const value = fixture();
  const before = JSON.stringify(value.reality);
  const prediction = createExecutiveClaim({ claimId: "prediction", type: "PREDICTION", statement: "Capacity could tighten next month.", evidenceRefs: [value.evidence], provenanceRefs: value.reality.provenanceRefs, observedAt });
  assert.equal(prediction.observedAt, null);
  assert.equal(JSON.stringify(value.reality), before);
  assert.equal(prediction.type, "PREDICTION");
});

test("E. unknowns remain explicit and semantically unconfident", () => {
  const unknown = createExecutiveClaim({ claimId: "unknown", type: "UNKNOWN", statement: "The cause is not established." });
  assert.equal(unknown.type, "UNKNOWN");
  assert.equal(unknown.confidence, "unknown");
  assert.equal(unknown.unresolved, true);
});

test("F. correlation and Stage proximity cannot establish causality", () => {
  const value = fixture();
  assert.throws(() => createEvidenceBoundedRelationship({ relationshipId: "correlation", kind: "supported-causal", sourceEntityId: "staffing", targetEntityId: subjectId, upstreamSupportKind: "correlated", authorityId: "CC:8/relationship", evidenceRefs: [value.evidence] }), /supported-causal|correlation/);
  const possible = createEvidenceBoundedRelationship({ relationshipId: "possible", kind: "possible-contributor", sourceEntityId: "staffing", targetEntityId: subjectId, upstreamSupportKind: "correlated", authorityId: "CC:8/relationship", evidenceRefs: [value.evidence] });
  assert.equal(possible.causeEstablished, false);
  assert.equal(problemRiskOpportunityStageCompatibility.proximityEstablishesCausality, false);
});

test("G. supported causality requires explicit causal authority and evidence", () => {
  const value = fixture();
  const causal = createEvidenceBoundedRelationship({ relationshipId: "causal", kind: "supported-causal", sourceEntityId: "dependency", targetEntityId: subjectId, upstreamSupportKind: "causal", authorityId: "canonical-relationship-registry", evidenceRefs: [value.evidence] });
  assert.equal(causal.causeEstablished, true);
  assert.throws(() => createEvidenceBoundedRelationship({ relationshipId: "missing", kind: "supported-causal", sourceEntityId: "a", targetEntityId: "b", upstreamSupportKind: "causal" }), /evidence/);
});

test("H. constraints name their category and affected entities", () => {
  const value = fixture();
  const constraint = createExecutiveConstraintReference({ constraintId: "constraint-capacity", category: "capacity", summary: "Available capacity constrains delivery.", affectedEntityRefs: [subjectId, "objective:resilience"], authorityId: "CC:8/ExecutiveAssessment", evidenceRefs: [value.evidence] });
  assert.equal(constraint.category, "capacity");
  assert.deepEqual(constraint.affectedEntityRefs, ["nol:capacity", "objective:resilience"]);
  assert.equal(deeplyFrozen(constraint), true);
});

test("I. DS-6 owns risk lifecycle while EI:3 owns no persistence", () => {
  const value = fixture();
  const risk: StrategicReference = Object.freeze({ kind: "risk", id: "risk-capacity", label: "Capacity risk", authorityId: "DS-6:1/WorkspaceRisk", workspaceId, modelId, provenanceRefs: Object.freeze(["ds6:risk-capacity"]), observedAt });
  const issue = createExecutiveIssueFraming({ issueId: "issue-risk", requestedType: "risk", title: "Capacity risk", workspaceId, reality: value.reality, riskLifecycleReference: risk, claims: [], operationalSeverity: "watch" });
  assert.equal(issue.issueType, "risk");
  assert.equal(issue.riskLifecycleReference?.authorityId, "DS-6:1/WorkspaceRisk");
  assert.equal(issue.persistenceAuthorityId, null);
  assert.equal(issue.contractAuthorityId, "EI:3/ProblemRiskOpportunityIntelligence");
  assert.equal(PROBLEM_RISK_OPPORTUNITY_BOUNDARY.ownsRiskLifecycle, false);
});

test("J. strategic context, severity and relevance are preserved without priority scoring", () => {
  const value = fixture();
  const before = JSON.stringify(value.strategicContext);
  const issue = createExecutiveIssueFraming({ issueId: "issue-context", requestedType: "problem", title: "Capacity pressure", workspaceId, reality: value.reality, strategicContext: value.strategicContext, claims: [value.claim], operationalSeverity: "watch" });
  assert.equal(issue.operationalSeverity, "watch");
  assert.equal(issue.strategicRelevance, "unresolved");
  assert.equal(JSON.stringify(value.strategicContext), before);
  assert.equal("priority" in issue, false);
});

test("K. Advisor distinguishes known, assumed, predicted and unknown claims", () => {
  const value = fixture();
  const claims = [
    value.claim,
    createExecutiveClaim({ claimId: "assumed", type: "ASSUMPTION", statement: "A dependency may contribute.", evidenceRefs: [value.evidence], provenanceRefs: value.reality.provenanceRefs }),
    createExecutiveClaim({ claimId: "predicted", type: "PREDICTION", statement: "Pressure may increase.", evidenceRefs: [value.evidence], provenanceRefs: value.reality.provenanceRefs }),
    createExecutiveClaim({ claimId: "unknown", type: "UNKNOWN", statement: "Root cause is unknown." }),
  ];
  const issue = createExecutiveIssueFraming({ issueId: "issue-advisor", requestedType: "problem", title: "Capacity pressure", workspaceId, reality: value.reality, claims, operationalSeverity: "watch" });
  assert.deepEqual(projectIssueForAdvisor(issue).claims.map((claim) => claim.status), ["KNOWN", "ASSUMED", "PREDICTED", "UNKNOWN"]);
});

test("L. EI:3 trace is deterministic, frozen, authority-preserving, and leaves later canonical references untouched", () => {
  const value = fixture();
  const issue = createExecutiveIssueFraming({ issueId: "issue-trace", requestedType: "problem", title: "Capacity pressure", workspaceId, reality: value.reality, strategicContext: value.strategicContext, claims: [value.claim], operationalSeverity: "watch" });
  const input = { traceId: "ei3-trace", ei1: value.ei1, strategic: value.strategic, assessmentHandoff: value.assessmentHandoff, issue };
  const traceA = createProblemRiskOpportunityTrace(input);
  const traceB = createProblemRiskOpportunityTrace(input);
  assert.deepEqual(traceA, traceB);
  assert.equal(traceA.valid, true);
  assert.equal(traceA.scenarioId, value.ei1.scenario?.recordId ?? null);
  assert.equal(traceA.decisionId, value.ei1.decision?.recordId ?? null);
  assert.equal(traceA.executionId, value.ei1.execution?.recordId ?? null);
  assert.equal(certifyProblemRiskOpportunityIntelligence(traceA).certified, true);
  assert.equal(deeplyFrozen(traceA), true);
  assert.equal(deeplyFrozen(problemRiskOpportunityCapabilityMap), true);
  assert.equal(deeplyFrozen(problemRiskOpportunityGapRegister), true);
});
