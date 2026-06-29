import assert from "node:assert/strict";
import test from "node:test";

import { resolveScenarioIdentityExample } from "./scenarioIntelligenceContract.ts";
import { createScenarioMetadataRecord } from "./scenarioIntelligenceMetadata.ts";
import type { ScenarioIdentity } from "./scenarioIntelligenceTypes.ts";
import { buildScenarioContext } from "./scenarioContextBuilder.ts";
import { resolveScenarioContextProbeExample } from "./scenarioContextResolver.ts";
import { resolveScenarioState } from "./scenarioStateEngine.ts";
import {
  ExecutiveScenarioPriorityEngine,
  resolveExecutiveScenarioPriority,
} from "./executiveScenarioPriority.ts";
import { resolveExecutiveScenarioPriorityProbeExample } from "./executiveScenarioPriorityResolver.ts";
import { runExecutiveScenarioPriorityEngineCertification } from "./executiveScenarioPriorityCertification.ts";
import {
  EXECUTIVE_SCENARIO_PRIORITY_LEVELS,
  isExecutiveScenarioPriorityLevel,
} from "./executiveScenarioPriorityResult.ts";

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
        label: "Active Simulation",
        status: "active",
        readOnly: true as const,
      }),
    ]),
  });
}

function buildContextFromIdentity(identity: ScenarioIdentity) {
  const metadata = createScenarioMetadataRecord();
  const state = resolveScenarioState({
    scenarioId: identity.scenarioId,
    workspaceId: identity.workspaceId,
    evaluatedAt: FIXED_TIME,
    identity,
    metadata,
  });
  return buildScenarioContext(
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
}

test("evaluates executive priority from ScenarioContext", () => {
  const context = buildContextFromIdentity(buildReadyIdentity());
  const priority = resolveExecutiveScenarioPriority(
    Object.freeze({ context, evaluatedAt: FIXED_TIME })
  );

  assert.equal(priority.scenarioId, context.scenarioId);
  assert.equal(priority.readOnly, true);
  assert.equal(priority.engineVersion, "APP-2/4");
  assert.ok(isExecutiveScenarioPriorityLevel(priority.priorityLevel));
  assert.ok(priority.priorityFactors.length > 0);
  assert.ok(priority.supportingEvidence.length > 0);
  assert.ok(priority.priorityReasonCodes.includes("state_contribution"));
});

test("generates evidence across executive dimensions", () => {
  const context = buildContextFromIdentity(buildReadyIdentity());
  const priority = resolveExecutiveScenarioPriority(
    Object.freeze({ context, evaluatedAt: FIXED_TIME })
  );

  const dimensions = new Set(priority.supportingEvidence.map((entry) => entry.dimension));
  assert.ok(dimensions.has("state"));
  assert.ok(dimensions.has("executive_time"));
  assert.ok(dimensions.has("timeline"));
  assert.ok(dimensions.has("risk"));
  assert.ok(dimensions.has("kpi"));
});

test("enforces workspace isolation", () => {
  const context = resolveScenarioContextProbeExample(FIXED_TIME);
  const priority = resolveExecutiveScenarioPriority(
    Object.freeze({
      context,
      evaluatedAt: FIXED_TIME,
      workspaceId: "ws-other",
    })
  );

  assert.equal(priority.priorityLevel, "none");
  assert.ok(priority.diagnostics.some((entry) => entry.code === "invalid_priority"));
});

test("returns none priority when context lacks identity and state", () => {
  const context = buildScenarioContext(
    Object.freeze({
      scenarioId: "scn-empty",
      workspaceId: "ws-001",
      generatedAt: FIXED_TIME,
      identity: null,
      metadata: null,
      state: null,
      references: null,
    })
  );
  const priority = resolveExecutiveScenarioPriority(
    Object.freeze({ context, evaluatedAt: FIXED_TIME })
  );

  assert.equal(priority.priorityLevel, "none");
  assert.ok(priority.diagnostics.some((entry) => entry.code === "missing_context"));
  assert.ok(priority.diagnostics.some((entry) => entry.code === "missing_state"));
});

test("elevates priority for blocked scenario state", () => {
  const identity = buildReadyIdentity();
  const metadata = createScenarioMetadataRecord();
  const blockedIdentity = buildReadyIdentity();
  const waitingIdentity = Object.freeze({ ...blockedIdentity, status: "waiting" as const });
  const state = resolveScenarioState({
    scenarioId: waitingIdentity.scenarioId,
    workspaceId: waitingIdentity.workspaceId,
    evaluatedAt: FIXED_TIME,
    identity: waitingIdentity,
    metadata,
  });
  const context = buildScenarioContext(
    Object.freeze({
      scenarioId: waitingIdentity.scenarioId,
      workspaceId: waitingIdentity.workspaceId,
      generatedAt: FIXED_TIME,
      identity: waitingIdentity,
      metadata,
      state,
      references: buildFullReferences(identity),
    })
  );
  const priority = resolveExecutiveScenarioPriority(
    Object.freeze({ context, evaluatedAt: FIXED_TIME })
  );

  assert.ok(["high", "critical"].includes(priority.priorityLevel));
});

test("produces deterministic output for identical input", () => {
  const first = resolveExecutiveScenarioPriorityProbeExample(FIXED_TIME);
  const second = resolveExecutiveScenarioPriorityProbeExample(FIXED_TIME);

  assert.equal(first.priorityLevel, second.priorityLevel);
  assert.equal(first.priorityFactors.length, second.priorityFactors.length);
  assert.equal(first.supportingEvidence.length, second.supportingEvidence.length);
  assert.deepEqual(
    first.priorityReasonCodes.slice().sort(),
    second.priorityReasonCodes.slice().sort()
  );
});

test("uses only defined priority levels", () => {
  assert.equal(EXECUTIVE_SCENARIO_PRIORITY_LEVELS.length, 5);
  for (const level of EXECUTIVE_SCENARIO_PRIORITY_LEVELS) {
    assert.equal(isExecutiveScenarioPriorityLevel(level), true);
  }
});

test("runExecutiveScenarioPriorityEngineCertification passes all gates", () => {
  const result = runExecutiveScenarioPriorityEngineCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 16);
});

test("engine declares read-only rules and consumes ScenarioContext", () => {
  assert.equal(ExecutiveScenarioPriorityEngine.rules.consumesScenarioContext, true);
  assert.equal(ExecutiveScenarioPriorityEngine.rules.rebuildsContext, false);
  assert.equal(ExecutiveScenarioPriorityEngine.rules.noGlobalCache, true);
  assert.equal(
    ExecutiveScenarioPriorityEngine.getExecutiveScenarioPriorityEngineVersionMetadata().engineVersion,
    "APP-2/4"
  );
});

test("does not throw for expected boundary cases", () => {
  const context = resolveScenarioContextProbeExample(FIXED_TIME);
  assert.doesNotThrow(() =>
    resolveExecutiveScenarioPriority(
      Object.freeze({
        context,
        evaluatedAt: FIXED_TIME,
        workspaceId: "ws-other",
      })
    )
  );
});
