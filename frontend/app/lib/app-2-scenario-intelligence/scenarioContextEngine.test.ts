import assert from "node:assert/strict";
import test from "node:test";

import { resolveScenarioIdentityExample } from "./scenarioIntelligenceContract.ts";
import { createScenarioMetadataRecord } from "./scenarioIntelligenceMetadata.ts";
import type { ScenarioIdentity } from "./scenarioIntelligenceTypes.ts";
import { ScenarioContextEngine, resolveScenarioContext } from "./scenarioContextEngine.ts";
import { runScenarioContextEngineCertification } from "./scenarioContextEngineCertification.ts";
import { buildScenarioContext } from "./scenarioContextBuilder.ts";
import { resolveScenarioContextProbeExample } from "./scenarioContextResolver.ts";
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
        label: "Baseline Simulation",
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

test("constructs complete scenario context with state consumption", () => {
  const identity = buildReadyIdentity();
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

  assert.equal(context.scenarioId, identity.scenarioId);
  assert.equal(context.state?.currentState, "healthy");
  assert.equal(context.objects.length, 1);
  assert.equal(context.relationships.length, 1);
  assert.equal(context.kpis.length, 1);
  assert.equal(context.risks.length, 1);
  assert.equal(context.simulationReferences.length, 1);
  assert.equal(context.compareReferences.length, 1);
  assert.equal(context.readOnly, true);
  assert.equal(context.engineVersion, "APP-2/3");
});

test("enforces workspace isolation", () => {
  const identity = buildReadyIdentity();
  const context = resolveScenarioContext({
    scenarioId: identity.scenarioId,
    workspaceId: "ws-other",
    generatedAt: FIXED_TIME,
    identity,
    metadata: createScenarioMetadataRecord(),
    references: buildFullReferences(identity),
  });

  assert.ok(context.diagnostics.some((entry) => entry.code === "invalid_context"));
});

test("reports missing scenario and missing state diagnostics", () => {
  const context = resolveScenarioContext({
    scenarioId: "scn-missing",
    workspaceId: "ws-001",
    generatedAt: FIXED_TIME,
    identity: null,
    metadata: null,
    state: null,
  });

  assert.ok(context.diagnostics.some((entry) => entry.code === "missing_scenario"));
  assert.ok(context.diagnostics.some((entry) => entry.code === "missing_state"));
  assert.equal(context.identity, null);
  assert.equal(context.state, null);
});

test("collects executive time and timeline references read-only", () => {
  const identity = buildReadyIdentity();
  const context = resolveScenarioContext({
    scenarioId: identity.scenarioId,
    workspaceId: identity.workspaceId,
    generatedAt: FIXED_TIME,
    identity,
    metadata: createScenarioMetadataRecord(),
    references: buildFullReferences(identity),
  });

  assert.equal(context.executiveTimeReference?.readOnly, true);
  assert.equal(context.timelineReference?.readOnly, true);
  assert.equal(context.executiveTimeReference?.contextKey, "now");
  assert.equal(context.timelineReference?.timelineId, "timeline-001");
});

test("reports missing collections when references are empty", () => {
  const identity = buildReadyIdentity();
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
      references: Object.freeze({
        workspace: Object.freeze({ workspaceId: identity.workspaceId, readOnly: true as const }),
        executiveTime: identity.executiveTimeReference,
        timeline: identity.timelineReference,
        objects: Object.freeze([]),
        relationships: Object.freeze([]),
        kpis: Object.freeze([]),
        risks: Object.freeze([]),
      }),
    })
  );

  assert.ok(context.diagnostics.some((entry) => entry.code === "missing_object"));
  assert.ok(context.diagnostics.some((entry) => entry.code === "missing_kpi"));
  assert.ok(context.diagnostics.some((entry) => entry.code === "missing_risk"));
  assert.ok(context.diagnostics.some((entry) => entry.code === "missing_relationship"));
});

test("preserves metadata integrity", () => {
  const identity = buildReadyIdentity();
  const metadata = createScenarioMetadataRecord({ build: "APP-2/3-probe" });
  const context = resolveScenarioContext({
    scenarioId: identity.scenarioId,
    workspaceId: identity.workspaceId,
    generatedAt: FIXED_TIME,
    identity,
    metadata,
    references: buildFullReferences(identity),
  });

  assert.equal(context.metadata?.build, "APP-2/3-probe");
  assert.equal(context.metadata?.platform, "nexora-type-c");
});

test("produces deterministic output for identical input", () => {
  const first = resolveScenarioContextProbeExample(FIXED_TIME);
  const second = resolveScenarioContextProbeExample(FIXED_TIME);

  assert.deepEqual(
    {
      scenarioId: first.scenarioId,
      workspaceId: first.workspaceId,
      objectCount: first.objects.length,
      kpiCount: first.kpis.length,
      diagnosticCodes: first.diagnostics.map((entry) => entry.code).sort(),
    },
    {
      scenarioId: second.scenarioId,
      workspaceId: second.workspaceId,
      objectCount: second.objects.length,
      kpiCount: second.kpis.length,
      diagnosticCodes: second.diagnostics.map((entry) => entry.code).sort(),
    }
  );
});

test("resolves state through APP-2:2 when state not provided inline", () => {
  const identity = buildReadyIdentity();
  const context = resolveScenarioContext({
    scenarioId: identity.scenarioId,
    workspaceId: identity.workspaceId,
    generatedAt: FIXED_TIME,
    identity,
    metadata: createScenarioMetadataRecord(),
    references: buildFullReferences(identity),
  });

  assert.notEqual(context.state, null);
  assert.equal(context.state?.engineVersion, "APP-2/2");
});

test("runScenarioContextEngineCertification passes all gates", () => {
  const result = runScenarioContextEngineCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 18);
});

test("engine declares read-only rules and version metadata", () => {
  assert.equal(ScenarioContextEngine.rules.deterministic, true);
  assert.equal(ScenarioContextEngine.rules.noGlobalCache, true);
  assert.equal(ScenarioContextEngine.rules.consumesStateEngine, true);
  assert.equal(ScenarioContextEngine.getScenarioContextEngineVersionMetadata().engineVersion, "APP-2/3");
});

test("does not throw for expected boundary cases", () => {
  assert.doesNotThrow(() =>
    resolveScenarioContext({
      scenarioId: "",
      workspaceId: "",
      generatedAt: FIXED_TIME,
      identity: null,
      metadata: null,
    })
  );
});
