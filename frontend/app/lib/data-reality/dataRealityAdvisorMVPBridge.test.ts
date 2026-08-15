/**
 * P2:1 — Certified Advisor → MVP Runtime Bridge tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_ADVISOR_MVP_BRIDGE_BOUNDARY,
  DATA_REALITY_ADVISOR_MVP_BRIDGE_PROVENANCE_CHAIN,
  dataRealityAdvisorMVPBridgeArchitecturalRole,
  dataRealityAdvisorMVPBridgeIdentity,
  dataRealityAdvisorMVPBridgeNamespace,
  dataRealityAdvisorMVPBridgePhase,
  dataRealityAdvisorMVPBridgeVersion,
  getDataRealityAdvisorMVPBridgeIdentity,
  resolveDataRealityAdvisorForMVPRuntime,
  resolveMVPExecutiveAdvisorReality,
} from "./dataRealityAdvisorMVPBridge.ts";
import {
  dataRealityExecutiveAdvisorIntegrationIdentity,
  dataRealityExecutiveAdvisorIntegrationNamespace,
  dataRealityExecutiveAdvisorIntegrationVersion,
  resolveDataRealityExecutiveAdvisorIntegration,
} from "./dataRealityFoundation.ts";
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
  };
}

function objectById(
  result: ReturnType<typeof resolveDataRealityAdvisorForMVPRuntime>,
  objectId: string,
) {
  return result.objectRealities.find((entry) => entry.objectId === objectId);
}

test("P2:1 bridge identity and boundary", () => {
  const identity = getDataRealityAdvisorMVPBridgeIdentity();
  assert.equal(
    dataRealityAdvisorMVPBridgeIdentity,
    "P2:1/DataRealityAdvisorMVPBridge",
  );
  assert.equal(identity.identity, "P2:1/DataRealityAdvisorMVPBridge");
  assert.equal(dataRealityAdvisorMVPBridgeVersion, "2.1.0");
  assert.equal(
    dataRealityAdvisorMVPBridgeNamespace,
    "nexora.data-reality.advisor.mvp-bridge",
  );
  assert.equal(
    dataRealityAdvisorMVPBridgePhase,
    "CertifiedAdvisorToMVPRuntimeBridge",
  );
  assert.equal(
    dataRealityAdvisorMVPBridgeArchitecturalRole,
    "DataRealityAwareExecutiveExperienceIntegration",
  );
  assert.equal(Object.isFrozen(identity), true);
  assert.equal(DATA_REALITY_ADVISOR_MVP_BRIDGE_BOUNDARY.ownsKpiComputation, false);
  assert.equal(
    DATA_REALITY_ADVISOR_MVP_BRIDGE_BOUNDARY.ownsExecutiveStateResolution,
    false,
  );
  assert.equal(
    DATA_REALITY_ADVISOR_MVP_BRIDGE_BOUNDARY.ownsAdvisorReasoning,
    false,
  );
  assert.equal(
    DATA_REALITY_ADVISOR_MVP_BRIDGE_BOUNDARY.duplicatesBusinessThresholds,
    false,
  );
  assert.equal(DATA_REALITY_ADVISOR_MVP_BRIDGE_BOUNDARY.bridgeCertified, false);
  assert.equal(
    DATA_REALITY_ADVISOR_MVP_BRIDGE_BOUNDARY.certifiedUpstreamIdentity,
    "P1:6/DataRealityExecutiveAdvisorIntegration",
  );
});

test("TEST 1 — Same Input Determinism", () => {
  const input = {
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  };
  const a = resolveDataRealityAdvisorForMVPRuntime(input);
  const b = resolveDataRealityAdvisorForMVPRuntime(input);
  assert.deepEqual(a, b);
  assert.equal(
    resolveMVPExecutiveAdvisorReality(input).bridgeId,
    a.bridgeId,
  );
});

test("TEST 2 — Dataset Reality Propagation", () => {
  const context = sharedContext();
  const a = resolveDataRealityAdvisorForMVPRuntime({
    dataset: getExecutiveOperationsDemoDataset(),
    ...context,
  });
  const b = resolveDataRealityAdvisorForMVPRuntime({
    dataset: getExecutiveOperationsPressureDataset(),
    ...context,
  });

  assert.notEqual(a.datasetId, b.datasetId);
  assert.notDeepEqual(a.overallCondition, b.overallCondition);
  assert.notEqual(a.executiveSummary.headline, b.executiveSummary.headline);
  assert.notDeepEqual(
    a.objectRealities.map(
      (entry) => `${entry.objectId}:${entry.executiveState}:${entry.attention}`,
    ),
    b.objectRealities.map(
      (entry) => `${entry.objectId}:${entry.executiveState}:${entry.attention}`,
    ),
  );
});

test("TEST 3 — Object Identity Preservation", () => {
  const bridge = resolveDataRealityAdvisorForMVPRuntime({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });
  const certified = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });

  const bridgeIds = bridge.objectRealities.map((entry) => entry.objectId).sort();
  const observationIds = certified.advisorContext.observations
    .filter((entry) => entry.subjectKind === "object")
    .map((entry) => entry.subjectId)
    .sort();

  assert.deepEqual(bridgeIds, observationIds);
  for (const id of [
    "obj-revenue",
    "obj-capacity",
    "obj-inventory",
    "obj-delivery",
    "obj-customer",
    "cost",
  ]) {
    assert.ok(bridgeIds.includes(id), `missing ${id}`);
  }
});

test("TEST 4 — Executive State Preservation", () => {
  const bridge = resolveDataRealityAdvisorForMVPRuntime({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });
  const certified = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });

  for (const observation of certified.advisorContext.observations.filter(
    (entry) => entry.subjectKind === "object",
  )) {
    const projected = objectById(bridge, observation.subjectId)!;
    assert.equal(projected.executiveState, observation.state);
    assert.equal(projected.attention, observation.attention);
  }

  const capacity = objectById(bridge, "obj-capacity")!;
  assert.ok(
    capacity.executiveState === "critical" ||
      capacity.executiveState === "risk" ||
      capacity.executiveState === "watch",
  );
  assert.notEqual(capacity.executiveState, "unresolved");
  assert.notEqual(capacity.executiveState, "stable");
});

test("TEST 5 — Missing Truth Preservation", () => {
  const bridge = resolveDataRealityAdvisorForMVPRuntime({
    dataset: getExecutiveOperationsDemoDataset(),
    ...sharedContext(),
  });
  const cost = objectById(bridge, "cost")!;
  assert.ok(cost);
  assert.equal(cost.executiveState, "unresolved");
  assert.notEqual(cost.executiveState, "stable");
  assert.equal(cost.p0ExecutiveState, undefined);
  assert.equal(cost.hasKPI, false);
  assert.ok(
    cost.resolutionStatus === "unresolved" ||
      cost.resolutionStatus === "unavailable",
  );
  assert.ok(bridge.unresolvedObjectIds.includes("cost"));
  assert.ok(bridge.unavailableInformation.length > 0);

  const revenue = objectById(bridge, "obj-revenue")!;
  assert.equal(revenue.executiveState, "stable");
  assert.equal(revenue.resolutionStatus, "resolved");
  assert.notEqual(revenue.executiveState, cost.executiveState);
});

test("TEST 6 — Advisor Meaning Propagation", () => {
  const bridge = resolveDataRealityAdvisorForMVPRuntime({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });
  const certified = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });

  for (const observation of certified.advisorContext.observations.filter(
    (entry) => entry.subjectKind === "object",
  )) {
    const projected = objectById(bridge, observation.subjectId)!;
    assert.equal(projected.advisorMeaning, observation.executiveMeaning);
  }

  assert.equal(
    bridge.executiveSummary.headline,
    certified.response.headline,
  );
  assert.equal(bridge.executiveSummary.summary, certified.response.summary);
  assert.equal(
    bridge.overallCondition.dominantState,
    certified.advisorContext.dominantState,
  );
});

test("TEST 7 — Recommendation Propagation", () => {
  const bridge = resolveDataRealityAdvisorForMVPRuntime({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });
  const certified = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });

  assert.ok(certified.advisoryResolution.guidance.length > 0);
  assert.deepEqual(
    bridge.recommendedActions,
    certified.advisoryResolution.guidance,
  );
  assert.equal(
    bridge.recommendedFocus?.subjectId,
    certified.response.primarySubjectId,
  );

  const capacity = objectById(bridge, "obj-capacity");
  if (capacity?.recommendedAction) {
    assert.ok(
      certified.advisoryResolution.guidance.some(
        (entry) => entry.id === capacity.recommendedAction!.id,
      ),
    );
  }
});

test("TEST 8 — No Fabricated Recommendation", () => {
  const bridge = resolveDataRealityAdvisorForMVPRuntime({
    dataset: getExecutiveOperationsDemoDataset(),
    ...sharedContext(),
  });
  const certified = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: getExecutiveOperationsDemoDataset(),
    ...sharedContext(),
  });

  assert.deepEqual(
    bridge.recommendedActions,
    certified.advisoryResolution.guidance,
  );

  const cost = objectById(bridge, "cost")!;
  const costGuidance = certified.advisoryResolution.guidance.filter(
    (entry) => entry.subjectId === "cost",
  );
  if (costGuidance.length === 0) {
    assert.equal(cost.recommendedAction, undefined);
  } else {
    assert.ok(cost.recommendedAction);
    assert.equal(cost.recommendedAction!.subjectId, "cost");
  }

  const recommendCandidates = certified.advisoryResolution.candidates.filter(
    (entry) => entry.subjectId === "cost" && entry.intent === "recommend",
  );
  assert.equal(recommendCandidates.length, 0);
});

test("TEST 9 — Provenance", () => {
  const bridge = resolveDataRealityAdvisorForMVPRuntime({
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  });

  assert.equal(
    bridge.provenance.bridgeIdentity,
    "P2:1/DataRealityAdvisorMVPBridge",
  );
  assert.equal(bridge.provenance.bridgeCertified, false);
  assert.deepEqual(
    bridge.provenance.chain,
    DATA_REALITY_ADVISOR_MVP_BRIDGE_PROVENANCE_CHAIN,
  );
  assert.equal(
    bridge.provenance.certifiedP1Identity,
    dataRealityExecutiveAdvisorIntegrationIdentity,
  );
  assert.equal(
    bridge.provenance.certifiedP1Version,
    dataRealityExecutiveAdvisorIntegrationVersion,
  );
  assert.equal(
    bridge.provenance.certifiedP1Namespace,
    dataRealityExecutiveAdvisorIntegrationNamespace,
  );
  assert.equal(
    bridge.provenance.integrationId,
    bridge.certifiedAdvisorResult.integrationId,
  );
  assert.equal(
    bridge.provenance.traceability.responseId,
    bridge.certifiedAdvisorResult.response.id,
  );
  assert.ok(
    bridge.provenance.traceability.traceLinks.some(
      (link) => link.relation === "dataset-produces-snapshot",
    ),
  );
});

test("TEST 10 — Architecture Boundary", () => {
  const source = readFileSync(
    join(here, "dataRealityAdvisorMVPBridge.ts"),
    "utf8",
  );

  assert.ok(source.includes("resolveDataRealityExecutiveAdvisorIntegration"));
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
    /from\s+["']openai["']/,
    /from\s+["']@anthropic-ai\//,
  ]) {
    assert.equal(pattern.test(source), false, String(pattern));
  }
});

test("P2:1 certified advisor result is preserved by reference equality of content", () => {
  const input = {
    dataset: getExecutiveOperationsPressureDataset(),
    ...sharedContext(),
  };
  const bridge = resolveDataRealityAdvisorForMVPRuntime(input);
  const certified = resolveDataRealityExecutiveAdvisorIntegration(input);
  assert.deepEqual(bridge.certifiedAdvisorResult, certified);
  assert.equal(Object.isFrozen(bridge), true);
  assert.equal(Object.isFrozen(bridge.objectRealities), true);
});
