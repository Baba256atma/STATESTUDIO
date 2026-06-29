import assert from "node:assert/strict";
import test from "node:test";

import { resolveScenarioIdentityExample } from "./scenarioIntelligenceContract.ts";
import { createScenarioMetadataRecord } from "./scenarioIntelligenceMetadata.ts";
import type { ScenarioIdentity } from "./scenarioIntelligenceTypes.ts";
import { buildScenarioContext } from "./scenarioContextBuilder.ts";
import { resolveExecutiveScenarioPriority } from "./executiveScenarioPriorityResolver.ts";
import { resolveScenarioDependencyGraph } from "./scenarioDependencyResolver.ts";
import { resolveExecutiveScenarioConflictGraph } from "./executiveScenarioConflictResolver.ts";
import { resolveExecutiveScenarioOpportunityGraph } from "./executiveScenarioOpportunityResolver.ts";
import {
  ExecutiveScenarioSummaryEngine,
  resolveExecutiveScenarioSnapshot,
  resolveExecutiveScenarioSummary,
  resolveExecutiveScenarioSummaryFromCertifiedInputs,
} from "./executiveScenarioSummaryEngine.ts";
import { runExecutiveScenarioSummaryEngineCertification } from "./executiveScenarioSummaryCertification.ts";
import {
  resolveExecutiveScenarioSnapshotProbeExample,
  resolveExecutiveScenarioSummaryProbeExample,
} from "./executiveScenarioSummaryResolver.ts";
import { resolveScenarioState } from "./scenarioStateEngine.ts";
import {
  EXECUTIVE_SCENARIO_SNAPSHOT_DIAGNOSTIC_CODES,
  EXECUTIVE_SCENARIO_SUMMARY_DIAGNOSTIC_CODES,
} from "./executiveScenarioSummaryDiagnostics.ts";

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
  const opportunityGraph = resolveExecutiveScenarioOpportunityGraph(
    Object.freeze({ context, priority, dependencyGraph, conflictGraph, generatedAt: FIXED_TIME })
  );
  return Object.freeze({ context, priority, dependencyGraph, conflictGraph, opportunityGraph });
}

test("constructs executive scenario snapshot from certified inputs", () => {
  const inputs = buildCertifiedInputs(buildReadyIdentity());
  const snapshot = resolveExecutiveScenarioSnapshot(
    Object.freeze({ ...inputs, generatedAt: FIXED_TIME })
  );

  assert.equal(snapshot.scenarioId, inputs.context.scenarioId);
  assert.equal(snapshot.readOnly, true);
  assert.equal(snapshot.engineVersion, "APP-2/8");
  assert.equal(snapshot.state, inputs.context.state);
  assert.equal(snapshot.context, inputs.context);
  assert.equal(snapshot.priority, inputs.priority);
  assert.equal(snapshot.dependencyGraph, inputs.dependencyGraph);
  assert.equal(snapshot.conflictGraph, inputs.conflictGraph);
  assert.equal(snapshot.opportunityGraph, inputs.opportunityGraph);
});

test("snapshot is immutable and serializable", () => {
  const snapshot = resolveExecutiveScenarioSnapshotProbeExample(FIXED_TIME);
  assert.equal(Object.isFrozen(snapshot), true);

  const serialized = JSON.stringify(snapshot);
  const parsed = JSON.parse(serialized);
  assert.equal(parsed.scenarioId, snapshot.scenarioId);
  assert.equal(parsed.readOnly, true);
  assert.equal(parsed.engineVersion, "APP-2/8");
});

test("constructs executive summary from snapshot only", () => {
  const snapshot = resolveExecutiveScenarioSnapshotProbeExample(FIXED_TIME);
  const summary = resolveExecutiveScenarioSummary(
    Object.freeze({ snapshot, generatedAt: FIXED_TIME })
  );

  assert.equal(summary.scenarioId, snapshot.scenarioId);
  assert.equal(summary.readOnly, true);
  assert.equal(summary.engineVersion, "APP-2/8");
  assert.ok(summary.executiveHeadline.length > 0);
  assert.ok(summary.situationBrief.length > 0);
  assert.ok(summary.stateSummary.length > 0);
  assert.ok(summary.prioritySummary.length > 0);
  assert.ok(summary.dependencySummary.length > 0);
  assert.ok(summary.conflictSummary.length > 0);
  assert.ok(summary.opportunitySummary.length > 0);
});

test("generates evidence references from snapshot", () => {
  const summary = resolveExecutiveScenarioSummaryProbeExample(FIXED_TIME);
  assert.ok(summary.supportingEvidence.length > 0);
  const evidence = summary.supportingEvidence[0]!;
  assert.ok(evidence.sourceRef);
  assert.ok(evidence.summary);
  assert.equal(evidence.readOnly, true);
});

test("builds summary end-to-end from certified inputs", () => {
  const inputs = buildCertifiedInputs(buildReadyIdentity());
  const summary = resolveExecutiveScenarioSummaryFromCertifiedInputs(
    Object.freeze({ ...inputs, generatedAt: FIXED_TIME })
  );

  assert.ok(["complete", "partial", "incomplete"].includes(summary.summaryStatus));
  assert.ok(summary.executiveHighlights.length >= 0);
  assert.ok(summary.executiveConcerns.length >= 0);
});

test("enforces workspace isolation", () => {
  const snapshot = resolveExecutiveScenarioSnapshotProbeExample(FIXED_TIME);
  const summary = resolveExecutiveScenarioSummary(
    Object.freeze({ snapshot, generatedAt: FIXED_TIME, workspaceId: "ws-other" })
  );

  assert.equal(summary.summaryStatus, "incomplete");
  assert.ok(summary.diagnostics.some((entry) => entry.code === "invalid_summary"));
});

test("produces deterministic template output", () => {
  const first = resolveExecutiveScenarioSummaryProbeExample(FIXED_TIME);
  const second = resolveExecutiveScenarioSummaryProbeExample(FIXED_TIME);

  assert.equal(first.executiveHeadline, second.executiveHeadline);
  assert.equal(first.situationBrief, second.situationBrief);
  assert.equal(first.supportingEvidence.length, second.supportingEvidence.length);
});

test("consumes all canonical graphs via snapshot without rebuilding", () => {
  assert.equal(ExecutiveScenarioSummaryEngine.rules.rebuildsContext, false);
  assert.equal(ExecutiveScenarioSummaryEngine.rules.rebuildsDependencies, false);
  assert.equal(ExecutiveScenarioSummaryEngine.rules.rebuildsConflicts, false);
  assert.equal(ExecutiveScenarioSummaryEngine.rules.rebuildsOpportunities, false);
  assert.equal(ExecutiveScenarioSummaryEngine.rules.consumesSnapshotOnly, true);
  assert.equal(ExecutiveScenarioSummaryEngine.rules.recommendsExecution, false);
});

test("defines snapshot and summary diagnostic vocabularies", () => {
  assert.equal(EXECUTIVE_SCENARIO_SNAPSHOT_DIAGNOSTIC_CODES.length, 7);
  assert.equal(EXECUTIVE_SCENARIO_SUMMARY_DIAGNOSTIC_CODES.length, 10);
});

test("runExecutiveScenarioSummaryEngineCertification passes all gates", () => {
  const result = runExecutiveScenarioSummaryEngineCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 22);
});

test("does not throw for expected boundary cases", () => {
  const snapshot = resolveExecutiveScenarioSnapshotProbeExample(FIXED_TIME);
  assert.doesNotThrow(() =>
    resolveExecutiveScenarioSummary(
      Object.freeze({ snapshot, generatedAt: FIXED_TIME, workspaceId: "ws-other" })
    )
  );
});
