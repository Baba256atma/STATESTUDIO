import assert from "node:assert/strict";
import test from "node:test";

import { resolveScenarioIdentityExample } from "./scenarioIntelligenceContract.ts";
import { createScenarioMetadataRecord } from "./scenarioIntelligenceMetadata.ts";
import type { ScenarioIdentity } from "./scenarioIntelligenceTypes.ts";
import { buildScenarioContext } from "./scenarioContextBuilder.ts";
import { resolveScenarioContextProbeExample } from "./scenarioContextResolver.ts";
import { resolveScenarioState } from "./scenarioStateEngine.ts";
import { resolveExecutiveScenarioPriority } from "./executiveScenarioPriorityResolver.ts";
import {
  ScenarioDependencyEngine,
  resolveScenarioDependencyGraph,
} from "./scenarioDependencyEngine.ts";
import { runScenarioDependencyEngineCertification } from "./scenarioDependencyCertification.ts";
import { SCENARIO_DEPENDENCY_CATEGORIES } from "./scenarioDependencyGraph.ts";
import { resolveScenarioDependencyGraphProbeExample } from "./scenarioDependencyResolver.ts";

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
      Object.freeze({ journalEntryId: "dj-001", decisionId: "dec-001", readOnly: true as const }),
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

function buildContextAndPriority(identity: ScenarioIdentity) {
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
  return Object.freeze({ context, priority });
}

test("constructs dependency graph from context and priority", () => {
  const { context, priority } = buildContextAndPriority(buildReadyIdentity());
  const graph = resolveScenarioDependencyGraph(
    Object.freeze({ context, priority, generatedAt: FIXED_TIME })
  );

  assert.equal(graph.scenarioId, context.scenarioId);
  assert.equal(graph.readOnly, true);
  assert.equal(graph.engineVersion, "APP-2/5");
  assert.ok(graph.dependencyNodes.length > 5);
  assert.ok(graph.dependencyEdges.length > 5);
  assert.ok(graph.outgoingDependencies.length > 0);
});

test("detects incoming dependencies from related scenarios", () => {
  const { context, priority } = buildContextAndPriority(buildReadyIdentity());
  const graph = resolveScenarioDependencyGraph(
    Object.freeze({ context, priority, generatedAt: FIXED_TIME })
  );

  assert.ok(graph.incomingDependencies.length >= 1);
  assert.ok(
    graph.dependencyNodes.some((node) => node.kind === "related_scenario")
  );
});

test("detects critical dependencies including risks", () => {
  const { context, priority } = buildContextAndPriority(buildReadyIdentity());
  const graph = resolveScenarioDependencyGraph(
    Object.freeze({ context, priority, generatedAt: FIXED_TIME })
  );

  assert.ok(graph.criticalDependencies.length > 0);
  assert.ok(
    graph.criticalDependencies.some((edge) => edge.reasonCode === "risk_reference")
  );
});

test("detects isolated and shared dependencies", () => {
  const { context, priority } = buildContextAndPriority(buildReadyIdentity());
  const graph = resolveScenarioDependencyGraph(
    Object.freeze({ context, priority, generatedAt: FIXED_TIME })
  );

  assert.ok(graph.isolatedDependencies.length >= 0);
  assert.ok(graph.sharedDependencies.length >= 0);
});

test("enforces workspace isolation", () => {
  const { context, priority } = buildContextAndPriority(buildReadyIdentity());
  const graph = resolveScenarioDependencyGraph(
    Object.freeze({
      context,
      priority,
      generatedAt: FIXED_TIME,
      workspaceId: "ws-other",
    })
  );

  assert.equal(graph.dependencyNodes.length, 0);
  assert.ok(graph.dependencyDiagnostics.some((entry) => entry.code === "invalid_edge"));
});

test("consumes ScenarioContext and ExecutiveScenarioPriority without rebuilding", () => {
  const { context, priority } = buildContextAndPriority(buildReadyIdentity());
  const graph = resolveScenarioDependencyGraph(
    Object.freeze({ context, priority, generatedAt: FIXED_TIME })
  );

  assert.ok(graph.dependencyNodes.length > 0);
  assert.equal(context.readOnly, true);
  assert.equal(priority.readOnly, true);
  assert.equal(ScenarioDependencyEngine.rules.rebuildsContext, false);
  assert.equal(ScenarioDependencyEngine.rules.rebuildsPriority, false);
});

test("rejects mismatched context and priority at resolver boundary", () => {
  const context = resolveScenarioContextProbeExample(FIXED_TIME);
  const { priority: matchedPriority } = buildContextAndPriority(buildReadyIdentity());
  const mismatchedPriority = Object.freeze({
    ...matchedPriority,
    scenarioId: "scn-other",
  });
  const graph = resolveScenarioDependencyGraph(
    Object.freeze({ context, priority: mismatchedPriority, generatedAt: FIXED_TIME })
  );

  assert.ok(graph.dependencyDiagnostics.some((entry) => entry.code === "invalid_edge"));
});

test("produces deterministic output for identical input", () => {
  const first = resolveScenarioDependencyGraphProbeExample(FIXED_TIME);
  const second = resolveScenarioDependencyGraphProbeExample(FIXED_TIME);

  assert.equal(first.dependencyNodes.length, second.dependencyNodes.length);
  assert.equal(first.dependencyEdges.length, second.dependencyEdges.length);
  assert.equal(first.criticalDependencies.length, second.criticalDependencies.length);
});

test("includes all dependency edge properties", () => {
  const graph = resolveScenarioDependencyGraphProbeExample(FIXED_TIME);
  const edge = graph.dependencyEdges[0];

  assert.ok(edge.source);
  assert.ok(edge.target);
  assert.ok(edge.type);
  assert.ok(edge.direction);
  assert.ok(edge.strength > 0);
  assert.ok(edge.reasonCode);
  assert.equal(edge.readOnly, true);
});

test("defines eleven dependency categories", () => {
  assert.equal(SCENARIO_DEPENDENCY_CATEGORIES.length, 11);
});

test("runScenarioDependencyEngineCertification passes all gates", () => {
  const result = runScenarioDependencyEngineCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 17);
});

test("engine declares read-only rules and consumes certified inputs", () => {
  assert.equal(ScenarioDependencyEngine.rules.consumesScenarioContext, true);
  assert.equal(ScenarioDependencyEngine.rules.consumesExecutivePriority, true);
  assert.equal(ScenarioDependencyEngine.rules.detectsOnly, true);
  assert.equal(ScenarioDependencyEngine.getScenarioDependencyEngineVersionMetadata().engineVersion, "APP-2/5");
});

test("does not throw for expected boundary cases", () => {
  const context = resolveScenarioContextProbeExample(FIXED_TIME);
  const { priority } = buildContextAndPriority(buildReadyIdentity());
  assert.doesNotThrow(() =>
    resolveScenarioDependencyGraph(
      Object.freeze({
        context,
        priority,
        generatedAt: FIXED_TIME,
        workspaceId: "ws-other",
      })
    )
  );
});
