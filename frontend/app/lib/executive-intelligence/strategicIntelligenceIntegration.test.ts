import assert from "node:assert/strict";
import test from "node:test";
import { EXECUTIVE_STRATEGY_DEFINITIONS } from "../bus/executiveStrategyDefinitionRegistry.ts";
import {
  EXECUTIVE_STRATEGIC_OBJECTIVES,
  EXECUTIVE_STRATEGIC_OBJECTIVE_RELATIONSHIPS,
} from "../bus/executiveStrategicObjectiveRegistry.ts";
import type { NexoraDataset, NexoraDataRealitySnapshot } from "../data-reality/dataRealityContracts.ts";
import type { NexoraDataRealityHandoff } from "../data-reality/realDataIntegrationFoundation.ts";
import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import {
  createExecutiveIntelligenceTrace,
  referenceExecutiveReality,
} from "./executiveIntelligenceIntegration.ts";
import {
  STRATEGIC_INTELLIGENCE_BOUNDARY,
  certifyStrategicIntelligence,
  createStrategicContext,
  enrichEi1TraceWithStrategicContext,
  projectStrategicContextForAdvisor,
  referenceBusStrategicRelationship,
  referenceConfiguredStrategicRisk,
  referenceDataRealityKpi,
  referenceEi1Reality,
  referenceKpiReality,
  referenceStrategicObjective,
  referenceStrategyDefinition,
  referenceWorkspaceRisk,
  resolveStrategicTrace,
  strategicCapabilityInventory,
  strategicGapRegister,
  strategicRelationshipMap,
  strategicStageCompatibility,
} from "./strategicIntelligenceIntegration.ts";

const workspaceId = "workspace-ei2";
const modelId = "model-ei2";
const observedAt = "2026-08-17T12:00:00.000Z";
const kpiId = "executive-operational-readiness";

function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value)) return true;
  seen.add(value);
  return Object.isFrozen(value) && Object.values(value).every((child) => deeplyFrozen(child, seen));
}

function realityFixture() {
  const dataset: NexoraDataset = Object.freeze({ id: "dataset-operational-readiness", name: "Operational readiness", version: "1", capturedAt: observedAt, source: "api", familyId: "operations", scenario: "baseline", records: Object.freeze([{ objectKey: "capacity", metricKey: "utilization", value: 78, unit: "%", observedAt }]) });
  const provenance = Object.freeze({ sourceId: "operations-live", sourceType: "api", providerName: "Operations", sourceRecordId: "capacity-1", sourceFieldKey: "utilization", observedAt, importedAt: observedAt, transformationRef: "mapping:readiness", confidenceState: "verified" as const, confidence: 0.97 });
  const handoff: NexoraDataRealityHandoff = Object.freeze({ workspaceId, sourceId: provenance.sourceId, sourceSnapshotId: "snapshot-operations-1", mappingId: "mapping:readiness", dataset, factProvenance: Object.freeze([{ objectKey: "capacity", metricKey: "utilization", provenance }]), destinationAuthority: "P0:1/NexoraDataRealityFoundation" });
  const snapshot: NexoraDataRealitySnapshot = Object.freeze({ datasetId: dataset.id, facts: Object.freeze([{ objectKey: "capacity", metricKey: "utilization", value: 78, unit: "%", sourceDatasetId: dataset.id }]), kpis: Object.freeze([{ kpiId, objectKey: "capacity", nexoraObjectId: "nol:capacity", value: 78, unit: "%", calculatedAt: observedAt }]), objectStates: Object.freeze([{ objectKey: "capacity", nexoraObjectId: "nol:capacity", state: "critical" as const, reasons: Object.freeze([{ kpiId, kpiName: "Operational Readiness", value: 78, unit: "%", state: "critical" as const, ruleId: "readiness-rule" }]) }]), createdAt: observedAt });
  const reality = referenceExecutiveReality({ handoff, snapshot });
  return { snapshot, reality };
}

function configuredFixture(relevance: "low" | "medium" | "high" = "high") {
  const strategyDefinition = EXECUTIVE_STRATEGY_DEFINITIONS.find((item) => item.identity.strategyId === "strategy-operational-resilience")!;
  const objectiveDefinition = EXECUTIVE_STRATEGIC_OBJECTIVES.find((item) => item.identity.objectiveId === "objective-strengthen-operational-adaptability")!;
  const strategy = referenceStrategyDefinition({ strategy: strategyDefinition, workspaceId, modelId });
  const objective = referenceStrategicObjective({ objective: objectiveDefinition, workspaceId, modelId });
  const { snapshot, reality } = realityFixture();
  const kpi = referenceDataRealityKpi({ snapshot, reality, kpiId, modelId });
  const realityRef = referenceEi1Reality({ reality, modelId });
  const strategyObjective = referenceBusStrategicRelationship(EXECUTIVE_STRATEGIC_OBJECTIVE_RELATIONSHIPS.find((item) => item.relationshipId === "strategy-operational-resilience-to-objective-resilience")!)!;
  const objectiveKpi = referenceBusStrategicRelationship(EXECUTIVE_STRATEGIC_OBJECTIVE_RELATIONSHIPS.find((item) => item.relationshipId === "objective-resilience-to-kpi-operational-readiness")!)!;
  const kpiReality = referenceKpiReality({ kpi, reality: realityRef });
  const relationships = Object.freeze([strategyObjective, objectiveKpi, kpiReality]);
  const context = createStrategicContext({ contextId: "strategic-context-readiness", workspaceId, modelId, references: [strategy, objective, kpi, realityRef], relationships, operationalSeverity: "critical", declaredRelevance: { level: relevance, rationale: "Operational readiness is explicitly linked to the resilience objective and strategy.", basisRelationshipIds: relationships.map((item) => item.relationshipId) } });
  const ei1 = createExecutiveIntelligenceTrace({ traceId: "ei1-readiness", workspaceId, reality, issue: null, scenario: null, decision: null, execution: null, outcome: null, learning: null, memory: null });
  return { strategy, objective, kpi, reality, realityRef, relationships, context, ei1, snapshot };
}

test("A. EI:2 references BUS/DS/Data Reality authorities and creates no strategic truth", () => {
  const fixture = configuredFixture();
  assert.equal(STRATEGIC_INTELLIGENCE_BOUNDARY.ownsStrategyTruth, false);
  assert.equal(STRATEGIC_INTELLIGENCE_BOUNDARY.infersRelationships, false);
  assert.equal(fixture.strategy.authorityId, "BUS-18/ExecutiveStrategyDefinitionPlatform");
  assert.equal(fixture.objective.authorityId, "BUS-20/ExecutiveStrategicObjectivesPlatform");
  assert.equal(fixture.kpi.authorityId, "P0:1/NexoraDataRealityFoundation");
  assert.ok(fixture.context.references.every((item) => !item.authorityId.startsWith("EI:2")));
});

test("B. Objective identity remains stable through strategic references", () => {
  const fixture = configuredFixture();
  assert.equal(fixture.objective.id, "objective-strengthen-operational-adaptability");
  assert.equal(resolveStrategicTrace(fixture.context).referenceIds[1], fixture.objective.id);
});

test("C. KPI traces to Objective only through explicit configured relationships", () => {
  const fixture = configuredFixture();
  const relation = fixture.context.relationships.find((item) => item.type === "objective-measured-by-kpi");
  assert.equal(relation?.sourceId, fixture.objective.id);
  assert.equal(relation?.targetId, fixture.kpi.id);
  assert.equal(relation?.configured, true);
  assert.equal(relation?.causal, false);
});

test("D. Reality evidence retains KPI and RDI provenance", () => {
  const fixture = configuredFixture();
  assert.equal(fixture.context.relationships.at(-1)?.type, "kpi-observed-in-reality");
  assert.ok(fixture.kpi.provenanceRefs.some((item) => item.includes("operations-live")));
  assert.equal(fixture.realityRef.id, fixture.reality.recordId);
});

test("E. DS-6 Risk can receive explicit strategic context without transferring Risk authority", () => {
  const fixture = configuredFixture();
  const risk = referenceWorkspaceRisk({ modelId, risk: Object.freeze({ contractVersion: "DS-6:1", riskId: "risk-resilience-disruption", workspaceId, title: "Resilience disruption", description: "Known operational disruption risk.", status: "active", category: "operational", createdAt: observedAt, updatedAt: observedAt, source: "ds-6:1-foundation" }) });
  const relation = referenceConfiguredStrategicRisk({ strategicEntity: fixture.objective, risk, authorityId: "BUS-20/ObjectiveRiskReference", evidenceRefs: ["objective-strengthen-operational-adaptability:risk-resilience-disruption"] });
  const context = createStrategicContext({ contextId: "risk-context", workspaceId, modelId, references: [...fixture.context.references, risk], relationships: [...fixture.relationships, relation], operationalSeverity: "critical", declaredRelevance: { level: "high", rationale: "Explicit configured risk reference.", basisRelationshipIds: fixture.relationships.map((item) => item.relationshipId) } });
  assert.equal(risk.authorityId, "DS-6:1/WorkspaceRisk");
  assert.equal(projectStrategicContextForAdvisor(context).answers.knownRisks.status, "LINKED");
  assert.equal(relation.causal, false);
});

test("F. missing strategic relationships remain unresolved", () => {
  const fixture = configuredFixture();
  const context = createStrategicContext({ contextId: "unlinked", workspaceId, modelId, references: [fixture.strategy, fixture.kpi, fixture.realityRef], relationships: [fixture.relationships[2]], operationalSeverity: "critical", declaredRelevance: { level: "high", rationale: "Unsupported claim", basisRelationshipIds: [fixture.relationships[2].relationshipId] } });
  assert.equal(resolveStrategicTrace(context).complete, false);
  assert.equal(context.strategicRelevance.level, "unresolved");
  assert.equal(projectStrategicContextForAdvisor(context).answers.whyKpiMatters.status, "KNOWN");
});

test("G. operational severity and strategic relevance remain independent", () => {
  const fixture = configuredFixture("low");
  assert.equal(fixture.context.operationalSeverity, "critical");
  assert.equal(fixture.context.strategicRelevance.level, "low");
  assert.equal(STRATEGIC_INTELLIGENCE_BOUNDARY.computesPriority, false);
});

test("H. EI:1 canonical Scenario/Decision/Execution behavior remains unchanged", () => {
  const decisions = createNexoraCanonicalDecisionRuntime();
  decisions.adapter.transitionDecision({ decisionId: "decision-ei2", action: "approve", title: "Protect resilience", scenarioId: "scenario-ei2", subjectIds: ["nol:capacity"], workspaceId, modelId, evidenceRefs: [{ sourceKind: "kpi", sourceId: kpiId, subjectId: "nol:capacity" }] });
  const executions = createNexoraCanonicalExecutionRuntime({ decisionRuntime: decisions.adapter });
  const execution = executions.createExecution({ decisionId: "decision-ei2", workspaceId, modelId });
  assert.equal(decisions.adapter.getDecision("decision-ei2")?.scenarioId, "scenario-ei2");
  assert.equal(execution.status, "created");
  assert.equal(execution.execution?.decisionId, "decision-ei2");
});

test("I. configured Strategy → Objective → KPI → Reality reconstructs and certifies", () => {
  const fixture = configuredFixture();
  const enriched = enrichEi1TraceWithStrategicContext({ ei1: fixture.ei1, strategicContext: fixture.context });
  const certification = certifyStrategicIntelligence(enriched);
  assert.deepEqual(enriched.strategicTrace.referenceIds, [fixture.strategy.id, fixture.objective.id, fixture.kpi.id, fixture.realityRef.id]);
  assert.equal(certification.certified, true);
  assert.equal(certification.ei1Compatible, true);
  assert.equal(deeplyFrozen(enriched), true);
});

test("J. Advisor reports KNOWN/LINKED/UNRESOLVED without promoting missing context", () => {
  const fixture = configuredFixture();
  const linked = projectStrategicContextForAdvisor(fixture.context);
  assert.equal(linked.answers.whyKpiMatters.status, "LINKED");
  assert.equal(linked.answers.knownRisks.status, "UNRESOLVED");
  assert.equal(linked.authority, false);
  assert.equal(linked.factsOnly, true);
  assert.equal(strategicStageCompatibility.strategicAuthorityOwnedByStage, false);
  assert.equal(deeplyFrozen(strategicCapabilityInventory), true);
  assert.equal(deeplyFrozen(strategicRelationshipMap), true);
  assert.equal(deeplyFrozen(strategicGapRegister), true);
});
