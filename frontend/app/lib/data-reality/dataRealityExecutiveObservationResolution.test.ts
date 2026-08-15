/**
 * P1:2 — Executive Observation & Evidence Resolution unit tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { resolveDatasetExecutiveReality } from "./dataRealityFoundation.ts";
import {
  DATA_REALITY_ADVISOR_ATTENTION_SEVERITY_ORDER,
  DATA_REALITY_ADVISOR_STATE_SEVERITY_ORDER,
  DATA_REALITY_ADVISOR_STATE_TO_ATTENTION,
  DATA_REALITY_EXECUTIVE_OBSERVATION_RESOLUTION_CAPABILITIES,
  DATA_REALITY_EXECUTIVE_OBSERVATION_RESOLUTION_INVARIANTS,
  DATA_REALITY_TO_ADVISOR_STATE_MAP,
  dataRealityExecutiveObservationResolutionArchitecturalRole,
  dataRealityExecutiveObservationResolutionIdentity,
  dataRealityExecutiveObservationResolutionNamespace,
  dataRealityExecutiveObservationResolutionPhase,
  dataRealityExecutiveObservationResolutionVersion,
  getDataRealityExecutiveObservationResolutionIdentity,
  resolveAdvisorAttentionFromAdvisorState,
  resolveAdvisorStateFromDataReality,
  resolveDataRealityAdvisorEvidence,
  resolveDataRealityExecutiveObservationResolution,
  resolveDataRealityExecutiveObservations,
  resolveDominantDataRealityAdvisorAttention,
  resolveDominantDataRealityAdvisorState,
} from "./dataRealityExecutiveObservationResolution.ts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "./demo/executiveOperationsDemoDataset.ts";
import { getExecutiveOperationsKpiDefinitions } from "./demo/executiveOperationsKPIDefinitions.ts";
import { getExecutiveOperationsResolvedObjectBindings } from "./demo/executiveOperationsObjectBindings.ts";
import { getExecutiveOperationsExecutiveStateRules } from "./demo/executiveOperationsExecutiveStateRules.ts";
import type { NexoraDataRealitySnapshot } from "./dataRealityContracts.ts";
import type { DataRealityExecutiveObservation } from "./dataRealityAwareExecutiveAdvisorFoundation.ts";

const here = dirname(fileURLToPath(import.meta.url));
const resolutionSourcePath = join(
  here,
  "dataRealityExecutiveObservationResolution.ts",
);

function snapshotFor(
  scenario: "baseline" | "operational-pressure",
): NexoraDataRealitySnapshot {
  const dataset =
    scenario === "operational-pressure"
      ? getExecutiveOperationsPressureDataset()
      : getExecutiveOperationsDemoDataset();
  return resolveDatasetExecutiveReality(dataset, {
    bindings: getExecutiveOperationsResolvedObjectBindings(),
    definitions: getExecutiveOperationsKpiDefinitions(),
    rules: getExecutiveOperationsExecutiveStateRules(),
  }).snapshot;
}

function observationBySubject(
  observations: readonly DataRealityExecutiveObservation[],
  subjectId: string,
) {
  return observations.find((entry) => entry.subjectId === subjectId);
}

function truthFingerprint(
  observations: readonly DataRealityExecutiveObservation[],
) {
  return observations
    .map(
      (entry) =>
        `${entry.subjectId}|${entry.state}|${entry.attention}|${entry.headline}|${entry.executiveMeaning}|${entry.evidenceIds.join(",")}`,
    )
    .sort()
    .join("\n");
}

test("P1:2 identity", () => {
  const identity = getDataRealityExecutiveObservationResolutionIdentity();
  assert.equal(
    dataRealityExecutiveObservationResolutionIdentity,
    "P1:2/ExecutiveObservationEvidenceResolution",
  );
  assert.equal(
    identity.identity,
    "P1:2/ExecutiveObservationEvidenceResolution",
  );
  assert.equal(dataRealityExecutiveObservationResolutionVersion, "1.0.0");
  assert.equal(identity.version, "1.0.0");
  assert.equal(
    dataRealityExecutiveObservationResolutionNamespace,
    "nexora.data-reality.executive-advisor.observation-resolution",
  );
  assert.equal(
    identity.namespace,
    "nexora.data-reality.executive-advisor.observation-resolution",
  );
  assert.equal(
    dataRealityExecutiveObservationResolutionPhase,
    "ObservationEvidenceResolution",
  );
  assert.equal(identity.phase, "ObservationEvidenceResolution");
  assert.equal(
    dataRealityExecutiveObservationResolutionArchitecturalRole,
    "ExecutiveObservationEvidenceResolver",
  );
  assert.equal(
    identity.architecturalRole,
    "ExecutiveObservationEvidenceResolver",
  );
  assert.equal(Object.isFrozen(identity), true);
});

test("P1:2 capabilities and invariants", () => {
  assert.equal(
    DATA_REALITY_EXECUTIVE_OBSERVATION_RESOLUTION_CAPABILITIES.length,
    12,
  );
  assert.equal(
    DATA_REALITY_EXECUTIVE_OBSERVATION_RESOLUTION_INVARIANTS.length,
    18,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_EXECUTIVE_OBSERVATION_RESOLUTION_CAPABILITIES),
    true,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_EXECUTIVE_OBSERVATION_RESOLUTION_INVARIANTS),
    true,
  );
});

test("P1:2 state mapping from P0 executive states", () => {
  assert.equal(resolveAdvisorStateFromDataReality(undefined), "unresolved");
  assert.equal(resolveAdvisorStateFromDataReality(null), "unresolved");
  assert.equal(resolveAdvisorStateFromDataReality("normal"), "stable");
  assert.equal(resolveAdvisorStateFromDataReality("attention"), "watch");
  assert.equal(resolveAdvisorStateFromDataReality("critical"), "critical");
  assert.deepEqual(DATA_REALITY_TO_ADVISOR_STATE_MAP, {
    normal: "stable",
    attention: "watch",
    critical: "critical",
  });
});

test("P1:2 attention mapping", () => {
  assert.equal(resolveAdvisorAttentionFromAdvisorState("stable"), "none");
  assert.equal(resolveAdvisorAttentionFromAdvisorState("unresolved"), "low");
  assert.equal(resolveAdvisorAttentionFromAdvisorState("watch"), "medium");
  assert.equal(resolveAdvisorAttentionFromAdvisorState("risk"), "high");
  assert.equal(resolveAdvisorAttentionFromAdvisorState("critical"), "immediate");
  assert.equal(
    resolveAdvisorAttentionFromAdvisorState("opportunity"),
    "medium",
  );
  assert.equal(DATA_REALITY_ADVISOR_STATE_TO_ATTENTION.critical, "immediate");
});

test("P1:2 dominant state and attention priority", () => {
  assert.deepEqual([...DATA_REALITY_ADVISOR_STATE_SEVERITY_ORDER], [
    "critical",
    "risk",
    "watch",
    "opportunity",
    "unresolved",
    "stable",
  ]);
  assert.equal(
    resolveDominantDataRealityAdvisorState(["stable", "watch", "critical"]),
    "critical",
  );
  assert.equal(
    resolveDominantDataRealityAdvisorState(["opportunity", "watch", "risk"]),
    "risk",
  );
  assert.equal(
    resolveDominantDataRealityAdvisorAttention(["none", "medium", "immediate"]),
    "immediate",
  );
  assert.deepEqual([...DATA_REALITY_ADVISOR_ATTENTION_SEVERITY_ORDER], [
    "immediate",
    "high",
    "medium",
    "low",
    "none",
  ]);
});

test("P1:2 Dataset A observations match certified P0 reality", () => {
  const snapshot = snapshotFor("baseline");
  const result = resolveDataRealityExecutiveObservationResolution({ snapshot });

  const revenue = observationBySubject(result.observations, "obj-revenue")!;
  const production = observationBySubject(result.observations, "obj-capacity")!;
  const warehouse = observationBySubject(result.observations, "obj-inventory")!;
  const shipping = observationBySubject(result.observations, "obj-delivery")!;
  const customer = observationBySubject(result.observations, "obj-customer")!;
  const cost = observationBySubject(result.observations, "cost")!;

  assert.equal(revenue.state, "stable");
  assert.equal(revenue.attention, "none");
  assert.equal(production.state, "watch");
  assert.equal(production.attention, "medium");
  assert.equal(warehouse.state, "watch");
  assert.equal(shipping.state, "watch");
  assert.equal(customer.state, "watch");
  assert.ok(cost, `cost observation missing; subjects=${result.observedSubjectIds.join(",")}`);
  assert.equal(cost.state, "unresolved");
  assert.equal(cost.attention, "low");
  assert.equal(cost.headline, "Cost Performance Unresolved");
  assert.match(cost.executiveMeaning, /insufficient/i);

  assert.equal(result.dominantState, "watch");
  assert.equal(result.dominantAttention, "medium");
  assert.ok(result.unresolvedSubjectIds.includes(cost.subjectId));
});

test("P1:2 Dataset B differs from Dataset A because data changed", () => {
  const snapshotA = snapshotFor("baseline");
  const snapshotB = snapshotFor("operational-pressure");
  const a = resolveDataRealityExecutiveObservationResolution({
    snapshot: snapshotA,
  });
  const b = resolveDataRealityExecutiveObservationResolution({
    snapshot: snapshotB,
  });

  const revenueA = observationBySubject(a.observations, "obj-revenue")!;
  const revenueB = observationBySubject(b.observations, "obj-revenue")!;
  const productionA = observationBySubject(a.observations, "obj-capacity")!;
  const productionB = observationBySubject(b.observations, "obj-capacity")!;

  assert.equal(revenueA.state, "stable");
  assert.equal(revenueB.state, "watch");
  assert.equal(productionA.state, "watch");
  assert.equal(productionB.state, "critical");
  assert.equal(productionB.attention, "immediate");
  assert.equal(productionB.headline, "Production Capacity Under Pressure");
  assert.match(productionB.executiveMeaning, /practical capacity limit/i);

  assert.equal(b.dominantState, "critical");
  assert.equal(b.dominantAttention, "immediate");

  const changed = a.observations.filter((obsA) => {
    const obsB = observationBySubject(b.observations, obsA.subjectId);
    return obsB && obsB.state !== obsA.state;
  });
  assert.ok(changed.length >= 2, `expected >=2 changed observations, got ${changed.length}`);
});

test("P1:2 evidence is deterministic, canonical, and referenced", () => {
  const snapshot = snapshotFor("operational-pressure");
  const first = resolveDataRealityAdvisorEvidence({ snapshot });
  const second = resolveDataRealityAdvisorEvidence({ snapshot });
  assert.deepEqual(first, second);

  const ids = first.map((entry) => entry.id);
  assert.equal(new Set(ids).size, ids.length);

  const productionKpi = first.find(
    (entry) => entry.id === "evidence:obj-capacity:kpi:capacity-utilization",
  )!;
  assert.equal(productionKpi.sourceKind, "kpi");
  assert.equal(productionKpi.subjectId, "obj-capacity");
  assert.equal(productionKpi.value, 96);

  const productionState = first.find(
    (entry) => entry.id === "evidence:obj-capacity:executive-state",
  )!;
  assert.equal(productionState.sourceKind, "executive-state");
  assert.equal(productionState.value, "critical");

  const binding = first.find(
    (entry) => entry.id === "evidence:obj-capacity:object-binding",
  )!;
  assert.equal(binding.sourceKind, "object-binding");
  assert.match(binding.summary, /obj-capacity/);

  const fact = first.find((entry) =>
    entry.id.startsWith("evidence:obj-capacity:business-fact:"),
  );
  assert.ok(fact);
  assert.equal(fact!.sourceKind, "business-fact");

  const result = resolveDataRealityExecutiveObservationResolution({ snapshot });
  const evidenceIds = new Set(result.evidence.map((entry) => entry.id));
  for (const observation of result.observations) {
    for (const evidenceId of observation.evidenceIds) {
      assert.ok(
        evidenceIds.has(evidenceId),
        `missing evidence ${evidenceId} for ${observation.id}`,
      );
    }
  }
});

test("P1:2 observations are factual and recommendation-free", () => {
  const snapshot = snapshotFor("baseline");
  const observations = resolveDataRealityExecutiveObservations({ snapshot });
  for (const observation of observations) {
    assert.equal("recommendation" in observation, false);
    assert.equal("action" in observation, false);
    assert.equal("actions" in observation, false);
    assert.ok(observation.headline.length > 0);
    assert.ok(observation.executiveMeaning.length > 0);
  }

  const revenue = observationBySubject(observations, "obj-revenue")!;
  assert.equal(revenue.state, "stable");
  assert.equal(revenue.headline, "Revenue Performance Stable");
  assert.match(revenue.executiveMeaning, /expected operating range/i);
});

test("P1:2 focus changes ordering only, not truth", () => {
  const snapshot = snapshotFor("baseline");
  const unfocused = resolveDataRealityExecutiveObservationResolution({
    snapshot,
  });
  const focused = resolveDataRealityExecutiveObservationResolution({
    snapshot,
    focusedObjectId: "obj-capacity",
  });

  assert.equal(focused.observations[0]!.subjectId, "obj-capacity");
  assert.equal(
    truthFingerprint(unfocused.observations),
    truthFingerprint(focused.observations),
  );
  assert.deepEqual(
    unfocused.evidence.map((entry) => `${entry.id}:${entry.value}`).sort(),
    focused.evidence.map((entry) => `${entry.id}:${entry.value}`).sort(),
  );
  assert.equal(unfocused.dominantState, focused.dominantState);
  assert.ok(
    focused.resolutionReasons.includes("focused-subject:obj-capacity"),
  );
});

test("P1:2 stable !== unresolved; missing KPI cannot be stable", () => {
  assert.notEqual(
    resolveAdvisorStateFromDataReality("normal"),
    resolveAdvisorStateFromDataReality(undefined),
  );

  const snapshot = snapshotFor("baseline");
  const result = resolveDataRealityExecutiveObservationResolution({ snapshot });
  const cost = result.observations.find((entry) =>
    entry.headline.includes("Cost"),
  )!;
  assert.equal(cost.state, "unresolved");
  assert.notEqual(cost.state, "stable");

  const hasCostKpi = snapshot.kpis.some((kpi) => kpi.objectKey === "cost");
  assert.equal(hasCostKpi, false);
  assert.equal(
    snapshot.objectStates.some((entry) => entry.objectKey === "cost"),
    false,
  );
});

test("P1:2 filtering does not rewrite dominant reality", () => {
  const snapshot = snapshotFor("baseline");
  const full = resolveDataRealityExecutiveObservationResolution({ snapshot });
  const filtered = resolveDataRealityExecutiveObservationResolution({
    snapshot,
    includeStable: false,
    includeUnresolved: false,
  });

  assert.equal(full.dominantState, filtered.dominantState);
  assert.equal(full.dominantAttention, filtered.dominantAttention);
  assert.equal(
    filtered.observations.some((entry) => entry.state === "stable"),
    false,
  );
  assert.equal(
    filtered.observations.some((entry) => entry.state === "unresolved"),
    false,
  );
  assert.ok(filtered.unresolvedSubjectIds.length > 0);
});

test("P1:2 immutability and determinism", () => {
  const snapshot = snapshotFor("baseline");
  const originalJson = JSON.stringify(snapshot);
  const a = resolveDataRealityExecutiveObservationResolution({
    snapshot,
    focusedObjectId: "obj-customer",
    selectedObjectIds: ["obj-delivery"],
  });
  const b = resolveDataRealityExecutiveObservationResolution({
    snapshot,
    focusedObjectId: "obj-customer",
    selectedObjectIds: ["obj-delivery"],
  });

  assert.equal(JSON.stringify(snapshot), originalJson);
  assert.deepEqual(a, b);
  assert.equal(Object.isFrozen(a), true);
  assert.equal(Object.isFrozen(a.evidence), true);
  assert.equal(Object.isFrozen(a.observations), true);
  assert.equal(Object.isFrozen(a.resolutionReasons), true);
  assert.equal(a.observations[0]!.subjectId, "obj-customer");
});

test("P1:2 dependency and contract reuse rules", () => {
  const source = readFileSync(resolutionSourcePath, "utf8");
  assert.ok(
    source.includes(
      'from "./dataRealityAwareExecutiveAdvisorFoundation.ts"',
    ),
  );
  assert.ok(source.includes('from "./dataRealityContracts.ts"'));
  assert.equal(
    /export\s+(type|interface)\s+DataRealityAdvisorEvidence\b/.test(source),
    false,
  );
  assert.equal(
    /export\s+(type|interface)\s+DataRealityExecutiveObservation\b/.test(
      source,
    ),
    false,
  );
  assert.equal(
    /export\s+(type|interface)\s+NexoraDataRealitySnapshot\b/.test(source),
    false,
  );

  const forbidden = [
    /from\s+["']react["']/,
    /from\s+["']next\//,
    /from\s+["']three["']/,
    /from\s+["']@react-three\//,
    /from\s+["']openai["']/,
    /from\s+["']@anthropic-ai\//,
    /normalizeDatasetToBusinessFacts/,
    /computeNexoraKPIs/,
    /resolveObjectExecutiveStates/,
  ];
  for (const pattern of forbidden) {
    assert.equal(
      pattern.test(source),
      false,
      `forbidden dependency/pattern present: ${pattern}`,
    );
  }
});
