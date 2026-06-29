import assert from "node:assert/strict";
import test from "node:test";

import { resolveScenarioIdentityExample } from "./scenarioIntelligenceContract.ts";
import { createScenarioMetadataRecord } from "./scenarioIntelligenceMetadata.ts";
import type { ScenarioIdentity } from "./scenarioIntelligenceTypes.ts";
import { buildScenarioContext } from "./scenarioContextBuilder.ts";
import { resolveExecutiveScenarioPriority } from "./executiveScenarioPriorityResolver.ts";
import { resolveScenarioDependencyGraph } from "./scenarioDependencyResolver.ts";
import { resolveExecutiveScenarioConflictGraph } from "./executiveScenarioConflictResolver.ts";
import {
  ExecutiveScenarioOpportunityEngine,
  resolveExecutiveScenarioOpportunityGraph,
} from "./executiveScenarioOpportunityEngine.ts";
import { runExecutiveScenarioOpportunityEngineCertification } from "./executiveScenarioOpportunityCertification.ts";
import { EXECUTIVE_SCENARIO_OPPORTUNITY_CATEGORIES } from "./executiveScenarioOpportunityGraph.ts";
import { resolveExecutiveScenarioOpportunityGraphProbeExample } from "./executiveScenarioOpportunityResolver.ts";
import { resolveScenarioState } from "./scenarioStateEngine.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function buildReadyIdentity(): ScenarioIdentity {
  const base = resolveScenarioIdentityExample();
  return Object.freeze({
    ...base,
    status: "active",
    executiveTimeReference: Object.freeze({
      contextKey: "now",
      eventId: "evt-001",
      timestamp: FIXED_TIME,
      readOnly: true as const,
    }),
    timelineReference: Object.freeze({
      timelineId: "timeline-001",
      anchorTimestamp: FIXED_TIME,
      readOnly: true as const,
    }),
  });
}

function buildFullReferences(identity: ScenarioIdentity) {
  return Object.freeze({
    workspace: Object.freeze({ workspaceId: identity.workspaceId, readOnly: true as const }),
    executiveTime: identity.executiveTimeReference,
    timeline: identity.timelineReference,
    objects: Object.freeze([
      Object.freeze({ objectId: "obj-001", label: "Primary Object", readOnly: true as const }),
    ]),
    relationships: Object.freeze([
      Object.freeze({
        relationshipId: "rel-001",
        sourceId: "obj-001",
        targetId: "obj-002",
        readOnly: true as const,
      }),
    ]),
    kpis: Object.freeze([
      Object.freeze({ kpiId: "kpi-001", label: "Revenue", readOnly: true as const }),
    ]),
    risks: Object.freeze([
      Object.freeze({ riskId: "risk-001", label: "Supply Risk", readOnly: true as const }),
    ]),
    decisionReferences: Object.freeze([
      Object.freeze({ journalEntryId: "dj-001", decisionId: "dec-001", readOnly: true as const }),
    ]),
    simulationReferences: Object.freeze([
      Object.freeze({
        simulationId: "sim-001",
        label: "Completed Simulation",
        status: "completed",
        readOnly: true as const,
      }),
    ]),
    compareReferences: Object.freeze([
      Object.freeze({
        compareId: "cmp-001",
        baselineScenarioId: identity.scenarioId,
        candidateScenarioId: "scn-candidate-001",
        readOnly: true as const,
      }),
    ]),
    dataSources: Object.freeze([
      Object.freeze({ dataSourceId: "ds-001", label: "ERP Feed", readOnly: true as const }),
    ]),
  });
}

function buildCertifiedInputs(identity: ScenarioIdentity) {
  const metadata = createScenarioMetadataRecord();
  const state = resolveScenarioState({
    scenarioId: identity.scenarioId,
    workspaceId: identity.workspaceId,
    evaluatedAt: FIXED_TIME,
    identity,
    metadata,
  });
  const context = buildScenarioContext(
    Object.freeze({
      scenarioId: identity.scenarioId,
      workspaceId: identity.workspaceId,
      generatedAt: FIXED_TIME,
      identity,
      metadata,
      state,
      references: buildFullReferences(identity),
    })
  );
  const priority = resolveExecutiveScenarioPriority(
    Object.freeze({ context, evaluatedAt: FIXED_TIME })
  );
  const dependencyGraph = resolveScenarioDependencyGraph(
    Object.freeze({ context, priority, generatedAt: FIXED_TIME })
  );
  const conflictGraph = resolveExecutiveScenarioConflictGraph(
    Object.freeze({ context, priority, dependencyGraph, generatedAt: FIXED_TIME })
  );
  return Object.freeze({ context, priority, dependencyGraph, conflictGraph });
}

test("constructs executive opportunity graph from certified inputs", () => {
  const { context, priority, dependencyGraph, conflictGraph } = buildCertifiedInputs(
    buildReadyIdentity()
  );
  const graph = resolveExecutiveScenarioOpportunityGraph(
    Object.freeze({ context, priority, dependencyGraph, conflictGraph, generatedAt: FIXED_TIME })
  );

  assert.equal(graph.scenarioId, context.scenarioId);
  assert.equal(graph.readOnly, true);
  assert.equal(graph.engineVersion, "APP-2/7");
  assert.ok(graph.opportunityNodes.length > 0);
  assert.ok(graph.opportunityEdges.length > 0);
  assert.ok(graph.opportunityClusters.length > 0);
});

test("detects strategic and quick-win opportunities", () => {
  const { context, priority, dependencyGraph, conflictGraph } = buildCertifiedInputs(
    buildReadyIdentity()
  );
  const graph = resolveExecutiveScenarioOpportunityGraph(
    Object.freeze({ context, priority, dependencyGraph, conflictGraph, generatedAt: FIXED_TIME })
  );

  assert.ok(graph.strategicOpportunities.length > 0);
  assert.ok(graph.quickWinOpportunities.length > 0);
  assert.ok(graph.highValueOpportunities.length > 0);
});

test("generates supporting evidence for opportunities", () => {
  const graph = resolveExecutiveScenarioOpportunityGraphProbeExample(FIXED_TIME);
  assert.ok(graph.supportingEvidence.length > 0);
  const evidence = graph.supportingEvidence[0]!;
  assert.ok(evidence.originatingEntity);
  assert.ok(evidence.affectedEntity);
  assert.ok(evidence.reasonCode);
  assert.equal(evidence.readOnly, true);
});

test("enforces workspace isolation", () => {
  const inputs = buildCertifiedInputs(buildReadyIdentity());
  const graph = resolveExecutiveScenarioOpportunityGraph(
    Object.freeze({
      ...inputs,
      generatedAt: FIXED_TIME,
      workspaceId: "ws-other",
    })
  );

  assert.equal(graph.opportunityNodes.length, 0);
  assert.ok(graph.diagnostics.some((entry) => entry.code === "invalid_opportunity_edge"));
});

test("consumes context priority dependency and conflict without rebuilding", () => {
  const inputs = buildCertifiedInputs(buildReadyIdentity());
  const graph = resolveExecutiveScenarioOpportunityGraph(
    Object.freeze({ ...inputs, generatedAt: FIXED_TIME })
  );

  assert.ok(graph.opportunityNodes.length > 0);
  assert.equal(ExecutiveScenarioOpportunityEngine.rules.rebuildsContext, false);
  assert.equal(ExecutiveScenarioOpportunityEngine.rules.rebuildsDependencies, false);
  assert.equal(ExecutiveScenarioOpportunityEngine.rules.rebuildsConflicts, false);
  assert.equal(ExecutiveScenarioOpportunityEngine.rules.ranksOpportunities, false);
});

test("produces deterministic output for identical input", () => {
  const first = resolveExecutiveScenarioOpportunityGraphProbeExample(FIXED_TIME);
  const second = resolveExecutiveScenarioOpportunityGraphProbeExample(FIXED_TIME);

  assert.equal(first.opportunityNodes.length, second.opportunityNodes.length);
  assert.equal(first.opportunityEdges.length, second.opportunityEdges.length);
  assert.equal(first.supportingEvidence.length, second.supportingEvidence.length);
});

test("defines fifteen opportunity categories", () => {
  assert.equal(EXECUTIVE_SCENARIO_OPPORTUNITY_CATEGORIES.length, 15);
});

test("runExecutiveScenarioOpportunityEngineCertification passes all gates", () => {
  const result = runExecutiveScenarioOpportunityEngineCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 18);
});

test("engine declares read-only detect-only rules", () => {
  assert.equal(ExecutiveScenarioOpportunityEngine.rules.detectsOnly, true);
  assert.equal(ExecutiveScenarioOpportunityEngine.rules.recommendsExecution, false);
  assert.equal(ExecutiveScenarioOpportunityEngine.rules.noGlobalCache, true);
  assert.equal(
    ExecutiveScenarioOpportunityEngine.getExecutiveScenarioOpportunityEngineVersionMetadata()
      .engineVersion,
    "APP-2/7"
  );
});

test("does not throw for expected boundary cases", () => {
  const inputs = buildCertifiedInputs(buildReadyIdentity());
  assert.doesNotThrow(() =>
    resolveExecutiveScenarioOpportunityGraph(
      Object.freeze({ ...inputs, generatedAt: FIXED_TIME, workspaceId: "ws-other" })
    )
  );
});
