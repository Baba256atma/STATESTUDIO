/**
 * P2:2 — Data-Reality-Aware MVP Runtime State Integration tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_AWARE_MVP_RUNTIME_STATE_BOUNDARY,
  DATA_REALITY_AWARE_MVP_RUNTIME_STATE_PROVENANCE_CHAIN,
  dataRealityAwareMVPRuntimeStateArchitecturalRole,
  dataRealityAwareMVPRuntimeStateIdentity,
  dataRealityAwareMVPRuntimeStateNamespace,
  dataRealityAwareMVPRuntimeStatePhase,
  dataRealityAwareMVPRuntimeStateVersion,
  getDataRealityAwareMVPObjectRuntimeState,
  getDataRealityAwareMVPRecommendedFocus,
  getDataRealityAwareMVPRuntimeStateIdentity,
  getDataRealityAwareMVPUnresolvedObjects,
  resolveDataRealityAwareMVPRuntimeState,
} from "./dataRealityAwareMVPRuntimeState.ts";
import {
  dataRealityAdvisorMVPBridgeIdentity,
  resolveDataRealityAdvisorForMVPRuntime,
} from "./dataRealityAdvisorMVPBridge.ts";
import { DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT } from "./dataRealityExecutiveAdvisorCertification.ts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "./demo/executiveOperationsDemoDataset.ts";

const here = dirname(fileURLToPath(import.meta.url));

function sharedContext() {
  return {
    focusedObjectId:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.focusedObjectId,
    selectedObjectIds:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.selectedObjectIds,
    currentWorkspace:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.currentWorkspace,
    requestedIntent:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.requestedIntent,
    responseMode:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.responseMode,
    maxCandidates:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.maxCandidates,
    maxEvidenceItems:
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.maxEvidenceItems,
    presentationState: "report",
  };
}

function truthSignature(
  state: ReturnType<typeof resolveDataRealityAwareMVPRuntimeState>,
) {
  return state.objects
    .map(
      (entry) =>
        `${entry.objectId}:${entry.executiveState}:${entry.attention}:${entry.resolutionStatus}:${entry.hasData}:${entry.hasKPI}:${entry.advisorMeaning}`,
    )
    .sort();
}

test("P2:2 identity and boundary", () => {
  const identity = getDataRealityAwareMVPRuntimeStateIdentity();
  assert.equal(
    dataRealityAwareMVPRuntimeStateIdentity,
    "P2:2/DataRealityAwareMVPRuntimeStateIntegration",
  );
  assert.equal(
    identity.identity,
    "P2:2/DataRealityAwareMVPRuntimeStateIntegration",
  );
  assert.equal(dataRealityAwareMVPRuntimeStateVersion, "2.2.0");
  assert.equal(
    dataRealityAwareMVPRuntimeStateNamespace,
    "nexora.data-reality.mvp-runtime-state",
  );
  assert.equal(
    dataRealityAwareMVPRuntimeStatePhase,
    "MVPRuntimeRealityStateIntegration",
  );
  assert.equal(
    dataRealityAwareMVPRuntimeStateArchitecturalRole,
    "DataRealityAwareMVPRuntimeStateBoundary",
  );
  assert.equal(Object.isFrozen(identity), true);
  assert.equal(
    DATA_REALITY_AWARE_MVP_RUNTIME_STATE_BOUNDARY.consumesP21BridgeOnly,
    true,
  );
  assert.equal(
    DATA_REALITY_AWARE_MVP_RUNTIME_STATE_BOUNDARY.ownsPresentationLogic,
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_MVP_RUNTIME_STATE_BOUNDARY.introducesReactStore,
    false,
  );
  assert.equal(
    DATA_REALITY_AWARE_MVP_RUNTIME_STATE_BOUNDARY.immediateDataRealitySource,
    "P2:1/DataRealityAdvisorMVPBridge",
  );
});

test("TEST 1 — Determinism", () => {
  const input = {
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  };
  const a = resolveDataRealityAwareMVPRuntimeState(input);
  const b = resolveDataRealityAwareMVPRuntimeState(input);
  assert.deepEqual(a, b);
});

test("TEST 2 — P2:1 Consumption", () => {
  const input = {
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  };
  const runtime = resolveDataRealityAwareMVPRuntimeState(input);
  const bridge = resolveDataRealityAdvisorForMVPRuntime({
    dataset: input.dataset,
    focusedObjectId: input.focusedObjectId,
    selectedObjectIds: input.selectedObjectIds,
    currentWorkspace: input.currentWorkspace,
    requestedIntent: input.requestedIntent,
    responseMode: input.responseMode,
    maxCandidates: input.maxCandidates,
    maxEvidenceItems: input.maxEvidenceItems,
  });

  assert.deepEqual(runtime.sourceReality, bridge);
  assert.equal(
    runtime.provenance.immediateDataRealitySource,
    dataRealityAdvisorMVPBridgeIdentity,
  );
  assert.deepEqual(runtime.overallCondition, bridge.overallCondition);
  assert.deepEqual(runtime.summary, bridge.executiveSummary);
  assert.deepEqual(runtime.recommendations.actions, bridge.recommendedActions);
  assert.deepEqual(
    runtime.overallCondition,
    runtime.sourceReality.overallCondition,
  );

  const source = readFileSync(
    join(here, "dataRealityAwareMVPRuntimeState.ts"),
    "utf8",
  );
  assert.ok(source.includes("resolveDataRealityAdvisorForMVPRuntime"));
  assert.equal(/resolveDatasetExecutiveReality/.test(source), false);
  assert.equal(/resolveDataRealityExecutiveAdvisorIntegration/.test(source), false);
  assert.equal(/computeNexoraKPIs/.test(source), false);
  assert.equal(/resolveObjectExecutiveStates/.test(source), false);
});

test("TEST 3 — Dataset Reality Propagation", () => {
  const context = sharedContext();
  const a = resolveDataRealityAwareMVPRuntimeState({
    dataset: getExecutiveOperationsDemoDataset(),
    ...context,
  });
  const b = resolveDataRealityAwareMVPRuntimeState({
    dataset: getExecutiveOperationsPressureDataset(),
    ...context,
  });

  assert.notEqual(a.datasetIdentity.datasetId, b.datasetIdentity.datasetId);
  assert.notDeepEqual(a.overallCondition, b.overallCondition);
  assert.notEqual(a.summary.headline, b.summary.headline);
  assert.notDeepEqual(truthSignature(a), truthSignature(b));
});

test("TEST 4 — Object Identity Preservation", () => {
  const runtime = resolveDataRealityAwareMVPRuntimeState({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });
  const bridge = resolveDataRealityAdvisorForMVPRuntime({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });

  assert.deepEqual(
    runtime.objects.map((entry) => entry.objectId).sort(),
    bridge.objectRealities.map((entry) => entry.objectId).sort(),
  );
  for (const id of [
    "obj-revenue",
    "obj-capacity",
    "obj-inventory",
    "obj-delivery",
    "obj-customer",
    "cost",
  ]) {
    assert.ok(runtime.objects.some((entry) => entry.objectId === id));
  }
});

test("TEST 5 — Executive Truth Preservation", () => {
  const runtime = resolveDataRealityAwareMVPRuntimeState({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });
  const bridge = resolveDataRealityAdvisorForMVPRuntime({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });

  for (const objectReality of bridge.objectRealities) {
    const objectState = getDataRealityAwareMVPObjectRuntimeState(
      runtime,
      objectReality.objectId,
    )!;
    assert.equal(objectState.executiveState, objectReality.executiveState);
    assert.equal(objectState.attention, objectReality.attention);
    assert.equal(objectState.resolutionStatus, objectReality.resolutionStatus);
  }
});

test("TEST 6 — Missing Truth Preservation", () => {
  const runtime = resolveDataRealityAwareMVPRuntimeState({
    dataset: getExecutiveOperationsDemoDataset(),
    ...sharedContext(),
  });
  const cost = getDataRealityAwareMVPObjectRuntimeState(runtime, "cost")!;
  assert.equal(cost.executiveState, "unresolved");
  assert.notEqual(cost.executiveState, "stable");
  assert.equal(cost.hasKPI, false);
  assert.ok(
    cost.resolutionStatus === "unresolved" ||
      cost.resolutionStatus === "unavailable",
  );
  assert.ok(runtime.unresolved.objectIds.includes("cost"));
  assert.ok(
    getDataRealityAwareMVPUnresolvedObjects(runtime).some(
      (entry) => entry.objectId === "cost",
    ),
  );

  const revenue = getDataRealityAwareMVPObjectRuntimeState(
    runtime,
    "obj-revenue",
  )!;
  assert.equal(revenue.executiveState, "stable");
  assert.notEqual(revenue.executiveState, cost.executiveState);
});

test("TEST 7 — Selection Separation", () => {
  const dataset = getExecutiveOperationsPressureDataset();
  const base = {
    dataset,
    focusedObjectId: "obj-capacity",
    currentWorkspace: "problem" as const,
    requestedIntent: "investigate" as const,
    responseMode: "standard" as const,
    presentationState: "report",
  };

  const selectedCapacity = resolveDataRealityAwareMVPRuntimeState({
    ...base,
    selectedObjectIds: ["obj-capacity"],
    selectedObjectId: "obj-capacity",
  });
  const selectedRevenue = resolveDataRealityAwareMVPRuntimeState({
    ...base,
    selectedObjectIds: ["obj-revenue"],
    selectedObjectId: "obj-revenue",
  });

  assert.deepEqual(truthSignature(selectedCapacity), truthSignature(selectedRevenue));

  const capacityA = getDataRealityAwareMVPObjectRuntimeState(
    selectedCapacity,
    "obj-capacity",
  )!;
  const capacityB = getDataRealityAwareMVPObjectRuntimeState(
    selectedRevenue,
    "obj-capacity",
  )!;
  assert.equal(capacityA.executiveState, capacityB.executiveState);
  assert.equal(capacityA.isSelected, true);
  assert.equal(capacityB.isSelected, false);

  const revenueA = getDataRealityAwareMVPObjectRuntimeState(
    selectedCapacity,
    "obj-revenue",
  )!;
  const revenueB = getDataRealityAwareMVPObjectRuntimeState(
    selectedRevenue,
    "obj-revenue",
  )!;
  assert.equal(revenueA.executiveState, revenueB.executiveState);
  assert.equal(revenueA.isSelected, false);
  assert.equal(revenueB.isSelected, true);
  assert.notEqual(revenueB.executiveState, "critical");
});

test("TEST 8 — Focus Separation", () => {
  const runtime = resolveDataRealityAwareMVPRuntimeState({
    dataset: getExecutiveOperationsPressureDataset(),
    focusedObjectId: "obj-inventory",
    selectedObjectIds: ["obj-delivery"],
    selectedObjectId: "obj-delivery",
    currentWorkspace: "problem",
    requestedIntent: "investigate",
    responseMode: "standard",
    presentationState: "operation",
  });

  assert.equal(runtime.focus.focusedObjectId, "obj-inventory");
  assert.equal(runtime.focus.selectedObjectId, "obj-delivery");
  assert.ok(
    runtime.focus.recommendedObjectId === undefined ||
      typeof runtime.focus.recommendedObjectId === "string",
  );

  // Distinct fields must not be collapsed into one value when they differ.
  assert.notEqual(runtime.focus.focusedObjectId, runtime.focus.selectedObjectId);

  if (
    runtime.focus.recommendedObjectId !== undefined &&
    runtime.focus.recommendedObjectId !== runtime.focus.focusedObjectId &&
    runtime.focus.recommendedObjectId !== runtime.focus.selectedObjectId
  ) {
    assert.notEqual(
      runtime.focus.recommendedObjectId,
      runtime.focus.focusedObjectId,
    );
    assert.notEqual(
      runtime.focus.recommendedObjectId,
      runtime.focus.selectedObjectId,
    );
  }

  assert.equal(
    getDataRealityAwareMVPRecommendedFocus(runtime),
    runtime.focus.recommendedObjectId,
  );
});

test("TEST 9 — Recommendation Preservation", () => {
  const input = {
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  };
  const runtime = resolveDataRealityAwareMVPRuntimeState(input);
  const bridge = resolveDataRealityAdvisorForMVPRuntime({
    dataset: input.dataset,
    focusedObjectId: input.focusedObjectId,
    selectedObjectIds: input.selectedObjectIds,
    currentWorkspace: input.currentWorkspace,
    requestedIntent: input.requestedIntent,
    responseMode: input.responseMode,
    maxCandidates: input.maxCandidates,
    maxEvidenceItems: input.maxEvidenceItems,
  });

  assert.ok(bridge.recommendedActions.length > 0);
  assert.deepEqual(runtime.recommendations.actions, bridge.recommendedActions);
  assert.deepEqual(
    runtime.recommendations.recommendedFocus,
    bridge.recommendedFocus,
  );
  assert.equal(
    runtime.focus.recommendedObjectId,
    bridge.recommendedFocus?.subjectId,
  );
});

test("TEST 10 — No Fabricated Recommendation", () => {
  const input = {
    dataset: getExecutiveOperationsDemoDataset(),
    ...sharedContext(),
  };
  const runtime = resolveDataRealityAwareMVPRuntimeState(input);
  const bridge = resolveDataRealityAdvisorForMVPRuntime({
    dataset: input.dataset,
    focusedObjectId: input.focusedObjectId,
    selectedObjectIds: input.selectedObjectIds,
    currentWorkspace: input.currentWorkspace,
    requestedIntent: input.requestedIntent,
    responseMode: input.responseMode,
    maxCandidates: input.maxCandidates,
    maxEvidenceItems: input.maxEvidenceItems,
  });

  assert.deepEqual(runtime.recommendations.actions, bridge.recommendedActions);

  const cost = getDataRealityAwareMVPObjectRuntimeState(runtime, "cost")!;
  const bridgeCost = bridge.objectRealities.find(
    (entry) => entry.objectId === "cost",
  )!;
  assert.deepEqual(cost.recommendedAction, bridgeCost.recommendedAction);
  assert.deepEqual(
    cost.recommendedAction,
    runtime.sourceReality.objectRealities.find(
      (entry) => entry.objectId === "cost",
    )?.recommendedAction,
  );
});

test("TEST 11 — Context Preservation", () => {
  const runtime = resolveDataRealityAwareMVPRuntimeState({
    dataset: getExecutiveOperationsPressureDataset(),
    focusedObjectId: "obj-capacity",
    selectedObjectIds: ["obj-inventory", "obj-delivery"],
    selectedObjectId: "obj-inventory",
    currentWorkspace: "problem",
    presentationState: "operation",
    requestedIntent: "investigate",
    responseMode: "standard",
    currentGoalId: "goal-ops",
    currentScenarioId: "scenario-pressure",
    currentDecisionId: "decision-1",
  });

  assert.equal(runtime.context.workspace, "problem");
  assert.equal(runtime.context.presentationState, "operation");
  assert.equal(runtime.context.focusedObjectId, "obj-capacity");
  assert.equal(runtime.context.selectedObjectId, "obj-inventory");
  assert.deepEqual(runtime.context.selectedObjectIds, [
    "obj-inventory",
    "obj-delivery",
  ]);
  assert.equal(runtime.context.requestedIntent, "investigate");
  assert.equal(runtime.context.responseMode, "standard");
  assert.equal(runtime.context.currentGoalId, "goal-ops");
  assert.equal(runtime.context.currentScenarioId, "scenario-pressure");
  assert.equal(runtime.context.currentDecisionId, "decision-1");
});

test("TEST 12 — Provenance", () => {
  const runtime = resolveDataRealityAwareMVPRuntimeState({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });

  assert.equal(
    runtime.provenance.runtimeIdentity,
    "P2:2/DataRealityAwareMVPRuntimeStateIntegration",
  );
  assert.equal(runtime.provenance.runtimeStateCertified, false);
  assert.equal(
    runtime.provenance.immediateDataRealitySource,
    "P2:1/DataRealityAdvisorMVPBridge",
  );
  assert.deepEqual(
    runtime.provenance.chain,
    DATA_REALITY_AWARE_MVP_RUNTIME_STATE_PROVENANCE_CHAIN,
  );
  assert.equal(
    runtime.provenance.bridgeProvenance.bridgeIdentity,
    "P2:1/DataRealityAdvisorMVPBridge",
  );
});

test("TEST 13 — Source Traceability", () => {
  const runtime = resolveDataRealityAwareMVPRuntimeState({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });

  assert.ok(runtime.sourceReality);
  assert.equal(runtime.sourceReality.identity.identity, dataRealityAdvisorMVPBridgeIdentity);
  assert.equal(
    runtime.sourceReality.bridgeId,
    runtime.datasetIdentity.bridgeId,
  );
  // Primary consumer contract remains the runtime fields, not sourceReality.
  assert.ok(runtime.objects.length > 0);
  assert.ok(runtime.summary.headline.length > 0);
  assert.ok(runtime.attention.dominantAttention);
});

test("TEST 14 — No Presentation Logic", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareMVPRuntimeState.ts"),
    "utf8",
  );
  const runtime = resolveDataRealityAwareMVPRuntimeState({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });
  const serialized = JSON.stringify(runtime);

  for (const forbidden of [
    '"color"',
    '"opacity"',
    '"emissive"',
    '"glow"',
    '"scale"',
    '"geometry"',
    '"animation"',
    '"camera"',
    '"pulse"',
  ]) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }

  // Source must not introduce presentation decision fields/APIs.
  for (const token of [
    "opacity",
    "emissive",
    "glow",
    "geometry",
    "animation",
    "camera",
    "pulse",
    "mvpStatus",
    "emissiveIntensity",
  ]) {
    assert.equal(source.includes(token), false, token);
  }
  assert.equal(/["']color["']/.test(source), false);
  assert.equal(/\bscale\s*[:=]/.test(source), false);
});

test("TEST 15 — No Business Logic Duplication", () => {
  const source = readFileSync(
    join(here, "dataRealityAwareMVPRuntimeState.ts"),
    "utf8",
  );

  assert.ok(source.includes('from "./dataRealityAdvisorMVPBridge.ts"'));
  assert.ok(source.includes("resolveDataRealityAdvisorForMVPRuntime"));

  assert.equal(/normalizeDatasetToBusinessFacts/.test(source), false);
  assert.equal(/computeNexoraKPIs/.test(source), false);
  assert.equal(/resolveObjectExecutiveStates/.test(source), false);
  assert.equal(/resolveAdvisorStateFromDataReality/.test(source), false);
  assert.equal(/resolveDataRealityExecutiveAdvisoryResolution/.test(source), false);
  assert.equal(/composeDataRealityExecutiveAdvisorResponse/.test(source), false);
  assert.equal(/minInclusive|maxExclusive|worseWhen/.test(source), false);
  assert.equal(
    /NEXORA_KPI_THRESHOLD|evaluateThreshold|thresholdBand/.test(source),
    false,
  );

  for (const pattern of [
    /from\s+["']react["']/,
    /from\s+["']next\//,
    /from\s+["']three["']/,
    /from\s+["']@react-three\//,
    /from\s+["']zustand["']/,
    /createContext/,
  ]) {
    assert.equal(pattern.test(source), false, String(pattern));
  }
});
