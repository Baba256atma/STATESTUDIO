import assert from "node:assert/strict";
import test from "node:test";

import {
  isScenarioHealthState,
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "./scenarioIntelligenceContract.ts";
import { createScenarioMetadataRecord } from "./scenarioIntelligenceMetadata.ts";
import { ScenarioStateEngine, resolveScenarioState } from "./scenarioStateEngine.ts";
import { runScenarioStateEngineCertification } from "./scenarioStateEngineCertification.ts";
import { evaluateScenarioState } from "./scenarioStateEvaluator.ts";
import {
  createScenarioStateLookupFromRecords,
  normalizeScenarioStateResolveRequest,
  resolveScenarioStateProbeExample,
} from "./scenarioStateResolver.ts";
import type { ScenarioIdentity } from "./scenarioIntelligenceTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function buildIdentity(overrides: Partial<ScenarioIdentity> = {}): ScenarioIdentity {
  const base = resolveScenarioIdentityExample();
  return Object.freeze({ ...base, ...overrides });
}

function buildReadyIdentity(): ScenarioIdentity {
  return buildIdentity({
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

test("resolves healthy active scenario with complete references", () => {
  const identity = buildReadyIdentity();
  const result = evaluateScenarioState(
    Object.freeze({
      scenarioId: identity.scenarioId,
      workspaceId: identity.workspaceId,
      evaluatedAt: FIXED_TIME,
      identity,
      metadata: createScenarioMetadataRecord(),
    })
  );

  assert.equal(result.currentState, "healthy");
  assert.equal(result.lifecycle, "active");
  assert.equal(result.operationalState, "active");
  assert.equal(result.monitoringEligible, true);
  assert.equal(result.isBlocked, false);
  assert.equal(result.isArchived, false);
  assert.equal(result.readOnly, true);
  assert.equal(result.engineVersion, "APP-2/2");
  assert.equal(result.confidence, 1);
});

test("returns unknown state and missing scenario diagnostic when identity absent", () => {
  const result = resolveScenarioState({
    scenarioId: "scn-missing",
    workspaceId: "ws-001",
    evaluatedAt: FIXED_TIME,
    identity: null,
    metadata: null,
  });

  assert.equal(result.currentState, "unknown");
  assert.equal(result.operationalState, "unknown");
  assert.equal(result.completeness, 0);
  assert.ok(result.diagnostics.some((entry) => entry.code === "missing_scenario"));
});

test("enforces workspace isolation", () => {
  const identity = buildReadyIdentity();
  const result = resolveScenarioState({
    scenarioId: identity.scenarioId,
    workspaceId: "ws-other",
    evaluatedAt: FIXED_TIME,
    identity,
    metadata: createScenarioMetadataRecord(),
  });

  assert.equal(result.isBlocked, true);
  assert.equal(result.operationalState, "blocked");
  assert.equal(result.currentState, "blocked");
  assert.ok(result.diagnostics.some((entry) => entry.code === "invalid_workspace"));
});

test("maps waiting lifecycle to blocked health and operational state", () => {
  const identity = buildIdentity({ status: "waiting" });
  const result = evaluateScenarioState(
    Object.freeze({
      scenarioId: identity.scenarioId,
      workspaceId: identity.workspaceId,
      evaluatedAt: FIXED_TIME,
      identity,
      metadata: createScenarioMetadataRecord(),
    })
  );

  assert.equal(result.lifecycle, "waiting");
  assert.equal(result.currentState, "blocked");
  assert.equal(result.operationalState, "blocked");
  assert.equal(result.isBlocked, true);
});

test("maps archived lifecycle to archived operational state", () => {
  const identity = buildReadyIdentity();
  const archived = buildIdentity({
    ...identity,
    status: "archived",
  });
  const result = evaluateScenarioState(
    Object.freeze({
      scenarioId: archived.scenarioId,
      workspaceId: archived.workspaceId,
      evaluatedAt: FIXED_TIME,
      identity: archived,
      metadata: createScenarioMetadataRecord(),
    })
  );

  assert.equal(result.isArchived, true);
  assert.equal(result.operationalState, "archived");
  assert.equal(result.isInactive, true);
});

test("reports invalid timeline and missing context diagnostics", () => {
  const identity = buildIdentity({
    status: "draft",
    executiveTimeReference: null,
    timelineReference: Object.freeze({
      timelineId: "",
      anchorTimestamp: FIXED_TIME,
      readOnly: true as const,
    }),
  });
  const result = evaluateScenarioState(
    Object.freeze({
      scenarioId: identity.scenarioId,
      workspaceId: identity.workspaceId,
      evaluatedAt: FIXED_TIME,
      identity,
      metadata: createScenarioMetadataRecord(),
    })
  );

  assert.ok(result.diagnostics.some((entry) => entry.code === "invalid_timeline"));
  assert.ok(result.diagnostics.some((entry) => entry.code === "missing_context"));
  assert.equal(result.currentState, "warning");
});

test("reports contract violation for invalid metadata", () => {
  const identity = buildReadyIdentity();
  const metadata = createScenarioMetadataRecord();
  const invalidMetadata = { ...metadata, version: undefined } as unknown as typeof metadata;
  const result = evaluateScenarioState(
    Object.freeze({
      scenarioId: identity.scenarioId,
      workspaceId: identity.workspaceId,
      evaluatedAt: FIXED_TIME,
      identity,
      metadata: invalidMetadata,
    })
  );

  assert.ok(result.diagnostics.some((entry) => entry.code === "contract_violation"));
  assert.equal(result.currentState, "critical");
});

test("produces deterministic output for identical input", () => {
  const input = resolveScenarioStateProbeExample(FIXED_TIME);
  const first = evaluateScenarioState(input);
  const second = evaluateScenarioState(input);

  assert.deepEqual(
    {
      currentState: first.currentState,
      lifecycle: first.lifecycle,
      operationalState: first.operationalState,
      confidence: first.confidence,
      completeness: first.completeness,
      diagnostics: first.diagnostics.map((entry) => entry.code),
    },
    {
      currentState: second.currentState,
      lifecycle: second.lifecycle,
      operationalState: second.operationalState,
      confidence: second.confidence,
      completeness: second.completeness,
      diagnostics: second.diagnostics.map((entry) => entry.code),
    }
  );
});

test("resolves scenarios through lookup without global state", () => {
  const identity = buildReadyIdentity();
  const metadata = createScenarioMetadataRecord();
  const lookup = createScenarioStateLookupFromRecords([Object.freeze({ identity, metadata })]);

  const result = ScenarioStateEngine.resolveScenarioState({
    scenarioId: identity.scenarioId,
    workspaceId: identity.workspaceId,
    evaluatedAt: FIXED_TIME,
    lookup,
  });

  assert.equal(result.currentState, "healthy");
});

test("uses only APP-2 contract health states", () => {
  const identity = buildReadyIdentity();
  const result = evaluateScenarioState(
    Object.freeze({
      scenarioId: identity.scenarioId,
      workspaceId: identity.workspaceId,
      evaluatedAt: FIXED_TIME,
      identity,
      metadata: createScenarioMetadataRecord(),
    })
  );
  assert.equal(isScenarioHealthState(result.currentState), true);
});

test("validates contract identity compatibility", () => {
  const identity = buildReadyIdentity();
  assert.equal(validateScenarioIdentityShape(identity).valid, true);
  const normalized = normalizeScenarioStateResolveRequest({
    scenarioId: identity.scenarioId,
    workspaceId: identity.workspaceId,
    evaluatedAt: FIXED_TIME,
    identity,
    metadata: createScenarioMetadataRecord(),
  });
  assert.equal(normalized.identity?.scenarioId, identity.scenarioId);
});

test("runScenarioStateEngineCertification passes all gates", () => {
  const result = runScenarioStateEngineCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 15);
});

test("engine declares read-only rules and version metadata", () => {
  assert.equal(ScenarioStateEngine.rules.deterministic, true);
  assert.equal(ScenarioStateEngine.rules.noGlobalCache, true);
  assert.equal(ScenarioStateEngine.rules.executiveTimeReadOnly, true);
  assert.equal(ScenarioStateEngine.rules.timelineReadOnly, true);
  assert.equal(ScenarioStateEngine.getScenarioStateEngineVersionMetadata().engineVersion, "APP-2/2");
});
