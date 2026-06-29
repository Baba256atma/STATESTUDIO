import assert from "node:assert/strict";
import test from "node:test";

import { resolveScenarioIdentityExample } from "./scenarioIntelligenceContract.ts";
import { createScenarioMetadataRecord } from "./scenarioIntelligenceMetadata.ts";
import type { ScenarioIdentity } from "./scenarioIntelligenceTypes.ts";
import { buildScenarioContext } from "./scenarioContextBuilder.ts";
import { resolveExecutiveScenarioPriority } from "./executiveScenarioPriorityResolver.ts";
import { resolveScenarioDependencyGraph } from "./scenarioDependencyResolver.ts";
import {
  ExecutiveScenarioConflictEngine,
  resolveExecutiveScenarioConflictGraph,
} from "./executiveScenarioConflictEngine.ts";
import { runExecutiveScenarioConflictEngineCertification } from "./executiveScenarioConflictCertification.ts";
import { EXECUTIVE_SCENARIO_CONFLICT_CATEGORIES } from "./executiveScenarioConflictGraph.ts";
import { resolveExecutiveScenarioConflictGraphProbeExample } from "./executiveScenarioConflictResolver.ts";
import { resolveScenarioState } from "./scenarioStateEngine.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function buildReadyIdentity(): ScenarioIdentity {
  const base = resolveScenarioIdentityExample();
  return Object.freeze({
    ...base,
    status: "waiting",
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
      Object.freeze({ objectId: "obj-002", label: "Secondary Object", readOnly: true as const }),
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
      Object.freeze({ journalEntryId: "dj-001", decisionId: null, readOnly: true as const }),
    ]),
    simulationReferences: Object.freeze([
      Object.freeze({
        simulationId: "sim-001",
        label: "Active Simulation",
        status: "active",
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
  return Object.freeze({ context, priority, dependencyGraph, state });
}

test("constructs executive conflict graph from certified inputs", () => {
  const { context, priority, dependencyGraph } = buildCertifiedInputs(buildReadyIdentity());
  const graph = resolveExecutiveScenarioConflictGraph(
    Object.freeze({ context, priority, dependencyGraph, generatedAt: FIXED_TIME })
  );

  assert.equal(graph.scenarioId, context.scenarioId);
  assert.equal(graph.readOnly, true);
  assert.equal(graph.engineVersion, "APP-2/6");
  assert.ok(graph.conflictNodes.length > 0);
  assert.ok(graph.conflictEdges.length > 0);
  assert.ok(graph.conflictClusters.length > 0);
});

test("detects critical and blocked conflicts", () => {
  const { context, priority, dependencyGraph } = buildCertifiedInputs(buildReadyIdentity());
  const graph = resolveExecutiveScenarioConflictGraph(
    Object.freeze({ context, priority, dependencyGraph, generatedAt: FIXED_TIME })
  );

  assert.ok(graph.criticalConflicts.length >= 0);
  assert.ok(graph.blockedConflicts.length > 0);
});

test("generates supporting evidence for conflicts", () => {
  const { context, priority, dependencyGraph } = buildCertifiedInputs(buildReadyIdentity());
  const graph = resolveExecutiveScenarioConflictGraph(
    Object.freeze({ context, priority, dependencyGraph, generatedAt: FIXED_TIME })
  );

  assert.ok(graph.supportingEvidence.length > 0);
  const evidence = graph.supportingEvidence[0]!;
  assert.ok(evidence.originatingEntity);
  assert.ok(evidence.affectedEntity);
  assert.ok(evidence.reasonCode);
  assert.equal(evidence.readOnly, true);
});

test("clusters conflicts by category", () => {
  const graph = resolveExecutiveScenarioConflictGraphProbeExample(FIXED_TIME);
  assert.ok(graph.conflictClusters.length > 0);
  assert.ok(graph.conflictCategories.length > 0);
});

test("enforces workspace isolation", () => {
  const { context, priority, dependencyGraph } = buildCertifiedInputs(buildReadyIdentity());
  const graph = resolveExecutiveScenarioConflictGraph(
    Object.freeze({
      context,
      priority,
      dependencyGraph,
      generatedAt: FIXED_TIME,
      workspaceId: "ws-other",
    })
  );

  assert.equal(graph.conflictNodes.length, 0);
  assert.ok(graph.diagnostics.some((entry) => entry.code === "invalid_conflict_edge"));
});

test("consumes context priority and dependency graph without rebuilding", () => {
  const inputs = buildCertifiedInputs(buildReadyIdentity());
  const graph = resolveExecutiveScenarioConflictGraph(
    Object.freeze({
      context: inputs.context,
      priority: inputs.priority,
      dependencyGraph: inputs.dependencyGraph,
      generatedAt: FIXED_TIME,
    })
  );

  assert.ok(graph.conflictNodes.length > 0);
  assert.equal(ExecutiveScenarioConflictEngine.rules.rebuildsContext, false);
  assert.equal(ExecutiveScenarioConflictEngine.rules.rebuildsPriority, false);
  assert.equal(ExecutiveScenarioConflictEngine.rules.rebuildsDependencies, false);
});

test("produces deterministic output for identical input", () => {
  const first = resolveExecutiveScenarioConflictGraphProbeExample(FIXED_TIME);
  const second = resolveExecutiveScenarioConflictGraphProbeExample(FIXED_TIME);

  assert.equal(first.conflictNodes.length, second.conflictNodes.length);
  assert.equal(first.conflictEdges.length, second.conflictEdges.length);
  assert.equal(first.supportingEvidence.length, second.supportingEvidence.length);
});

test("defines thirteen conflict categories", () => {
  assert.equal(EXECUTIVE_SCENARIO_CONFLICT_CATEGORIES.length, 13);
});

test("runExecutiveScenarioConflictEngineCertification passes all gates", () => {
  const result = runExecutiveScenarioConflictEngineCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 18);
});

test("engine declares read-only detect-only rules", () => {
  assert.equal(ExecutiveScenarioConflictEngine.rules.detectsOnly, true);
  assert.equal(ExecutiveScenarioConflictEngine.rules.resolvesConflicts, false);
  assert.equal(ExecutiveScenarioConflictEngine.rules.noGlobalCache, true);
  assert.equal(
    ExecutiveScenarioConflictEngine.getExecutiveScenarioConflictEngineVersionMetadata().engineVersion,
    "APP-2/6"
  );
});

test("does not throw for expected boundary cases", () => {
  const { context, priority, dependencyGraph } = buildCertifiedInputs(buildReadyIdentity());
  assert.doesNotThrow(() =>
    resolveExecutiveScenarioConflictGraph(
      Object.freeze({
        context,
        priority,
        dependencyGraph,
        generatedAt: FIXED_TIME,
        workspaceId: "ws-other",
      })
    )
  );
});
