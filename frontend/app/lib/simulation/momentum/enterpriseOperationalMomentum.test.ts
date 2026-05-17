/**
 * D7:2:6 — Enterprise operational momentum intelligence tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildOperationalUniverseTopology,
  extractTopologyObjectsFromScene,
} from "../topology/operationalUniverseTopologyEngine.ts";
import { calculateOrganizationalFlows } from "../flow/organizationalFlowDynamicsEngine.ts";
import { evaluateDependencyPressure } from "../pressure/enterpriseDependencyPressureEngine.ts";
import { mapOperationalFragility } from "../fragility/operationalFragilityConcentrationEngine.ts";
import { evaluateRecoveryCapacity } from "../recovery/organizationalRecoveryCapacityEngine.ts";
import type { SceneJson } from "../../sceneTypes.ts";
import {
  evaluateOperationalMomentum,
  freezeEnterpriseMomentumSnapshot,
} from "./enterpriseOperationalMomentumEngine.ts";
import {
  buildRegionalMomentumProfiles,
  deriveMomentumSignalsFromProfiles,
} from "./regionalMomentumModel.ts";
import {
  buildMomentumContentFingerprint,
  guardEvaluateOperationalMomentum,
} from "./momentumGuards.ts";
import { buildExecutiveMomentumSemantics } from "./executiveMomentumSemantics.ts";
import {
  identifyDegradationZones,
  classifyMomentumTrendLabel,
} from "./accelerationDegradationModel.ts";
import { analyzeMomentumPropagation } from "./momentumPropagationIntelligence.ts";

function sceneFixture(): SceneJson {
  return {
    scene: {
      objects: [
        { id: "plant_a", label: "Plant A", domain: "manufacturing", dependencies: ["warehouse_hub"] },
        { id: "warehouse_hub", label: "Warehouse", domain: "logistics", dependencies: ["customer_ops"] },
        { id: "customer_ops", label: "Customer Ops", domain: "customer" },
        { id: "finance_core", label: "Finance Core", domain: "finance" },
      ],
    },
  };
}

function buildTopology() {
  const objects = extractTopologyObjectsFromScene(sceneFixture());
  const built = buildOperationalUniverseTopology({ topologyId: "topo-momentum", objects });
  assert.ok(built.ok);
  if (!built.ok) throw new Error("topology build failed");
  return built.snapshot.topology;
}

const strainedMetrics = {
  manufacturing: { fragility: 0.62, operationalLoad: 0.7, recoveryCapacity: 0.3, coordinationLag: 0.55 },
  logistics: { fragility: 0.78, operationalLoad: 0.85, recoveryCapacity: 0.25, coordinationLag: 0.5 },
  customer_systems: { fragility: 0.48, operationalLoad: 0.5, recoveryCapacity: 0.45 },
  finance: { fragility: 0.28, operationalLoad: 0.35, recoveryCapacity: 0.7, coordinationLag: 0.2 },
};

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function buildFullStack() {
  const topology = buildTopology();
  const flow = calculateOrganizationalFlows({ topology, regionMetrics: strainedMetrics });
  assert.ok(flow.ok);
  if (!flow.ok) throw new Error("flow failed");
  const pressure = evaluateDependencyPressure({
    topology,
    flowState: flow.snapshot.state,
    regionMetrics: strainedMetrics,
  });
  assert.ok(pressure.ok);
  if (!pressure.ok) throw new Error("pressure failed");
  const fragility = mapOperationalFragility({
    topology,
    flowState: flow.snapshot.state,
    pressureState: pressure.snapshot.state,
    regionMetrics: strainedMetrics,
  });
  assert.ok(fragility.ok);
  if (!fragility.ok) throw new Error("fragility failed");
  const recovery = evaluateRecoveryCapacity({
    topology,
    fragilityMap: fragility.snapshot.map,
    flowState: flow.snapshot.state,
    pressureState: pressure.snapshot.state,
    regionMetrics: strainedMetrics,
  });
  assert.ok(recovery.ok);
  if (!recovery.ok) throw new Error("recovery failed");
  return {
    topology,
    flow: flow.snapshot.state,
    pressure: pressure.snapshot.state,
    fragility: fragility.snapshot.map,
    recovery: recovery.snapshot.state,
  };
}

test("deterministic momentum analysis", () => {
  const { topology, flow, pressure, fragility, recovery } = buildFullStack();
  const r1 = evaluateOperationalMomentum({
    topology,
    recoveryState: recovery,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  const r2 = evaluateOperationalMomentum({
    topology,
    recoveryState: recovery,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
  assert.ok(r1.snapshot.state.activeMomentumSignals.length > 0);
});

test("acceleration and degradation modeling", () => {
  const { topology, recovery, fragility, flow, pressure } = buildFullStack();
  const profiles = buildRegionalMomentumProfiles({
    topology,
    recoveryState: recovery,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  const degradationZones = identifyDegradationZones(profiles);
  assert.ok(degradationZones.includes("logistics") || degradationZones.includes("manufacturing"));
});

test("stabilization trend consistency", () => {
  const { topology, recovery, fragility } = buildFullStack();
  const result = evaluateOperationalMomentum({
    topology,
    recoveryState: recovery,
    fragilityMap: fragility,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const label = classifyMomentumTrendLabel({
    organizationalMomentumScore: result.snapshot.state.organizationalMomentumScore,
    degradationZoneCount: result.snapshot.state.degradationZones.length,
    accelerationZoneCount: result.snapshot.state.accelerationZones.length,
    recoveryMomentumScore: result.snapshot.state.recoveryMomentumScore,
    collapseRisk: fragility.collapseRiskLabel,
  });
  assert.equal(label, result.snapshot.state.momentumTrendLabel);
});

test("momentum propagation consistency", () => {
  const { topology, recovery, fragility } = buildFullStack();
  const profiles = buildRegionalMomentumProfiles({
    topology,
    recoveryState: recovery,
    fragilityMap: fragility,
  });
  const p1 = analyzeMomentumPropagation({ topology, profiles, fragilityMap: fragility });
  const p2 = analyzeMomentumPropagation({ topology, profiles, fragilityMap: fragility });
  assert.equal(
    p1.map((r) => r.recordId).join("|"),
    p2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen momentum snapshot", () => {
  const { topology, recovery, fragility } = buildFullStack();
  const result = evaluateOperationalMomentum({
    topology,
    recoveryState: recovery,
    fragilityMap: fragility,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeEnterpriseMomentumSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { organizationalMomentumScore: number }).organizationalMomentumScore = 0;
  });
});

test("rejects duplicate momentum build fingerprint", () => {
  const { topology, recovery, fragility } = buildFullStack();
  const first = evaluateOperationalMomentum({
    topology,
    recoveryState: recovery,
    fragilityMap: fragility,
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildMomentumContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    recoveryFingerprint: stableStringify({
      resilience: recovery.resilienceScore,
      label: recovery.resilienceLabel,
    }),
    fragilityFingerprint: stableStringify({
      systemic: fragility.systemicExposureScore,
      collapse: fragility.collapseRiskLabel,
    }),
    tick: 0,
    regionMetricKeys: [],
  });
  const second = evaluateOperationalMomentum({
    topology,
    recoveryState: recovery,
    fragilityMap: fragility,
    tick: 0,
    priorMomentumFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_momentum_build");
});

test("upstream state immutability preserved", () => {
  const { topology, flow, pressure, fragility, recovery } = buildFullStack();
  const frozen = {
    topology: JSON.stringify(topology),
    flow: JSON.stringify(flow),
    pressure: JSON.stringify(pressure),
    fragility: JSON.stringify(fragility),
    recovery: JSON.stringify(recovery),
  };
  evaluateOperationalMomentum({
    topology,
    recoveryState: recovery,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.equal(JSON.stringify(topology), frozen.topology);
  assert.equal(JSON.stringify(flow), frozen.flow);
  assert.equal(JSON.stringify(pressure), frozen.pressure);
  assert.equal(JSON.stringify(fragility), frozen.fragility);
  assert.equal(JSON.stringify(recovery), frozen.recovery);
});

test("executive momentum semantics are readable", () => {
  const { topology, flow, pressure, fragility, recovery } = buildFullStack();
  const result = evaluateOperationalMomentum({
    topology,
    recoveryState: recovery,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /momentum|stabiliz|degrad|recover|Logistics|Manufacturing|inertia/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("recursion variance"));

  const manual = buildExecutiveMomentumSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.length > 0);
});

test("integrated stack panel contract", () => {
  const { topology, flow, pressure, fragility, recovery } = buildFullStack();
  const momentum = evaluateOperationalMomentum({
    topology,
    recoveryState: recovery,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.ok(momentum.ok);
  if (!momentum.ok) return;
  assert.equal(momentum.panelContract.topologyId, topology.topologyId);
  assert.ok(momentum.panelContract.signals.length > 0);
});

test("governance guard rails reject invalid momentum regions", () => {
  const guard = guardEvaluateOperationalMomentum({
    topologyId: "topo",
    topologyRegionIds: ["a"],
    signals: [
      {
        signalId: "bad",
        affectedRegionIds: ["ghost"],
        momentumDirection: "degrading",
        intensity: 0.5,
      },
    ],
    propagationRecordCount: 0,
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_momentum_region");
});

test("momentum signals derived from profiles", () => {
  const { topology, recovery, fragility } = buildFullStack();
  const profiles = buildRegionalMomentumProfiles({
    topology,
    recoveryState: recovery,
    fragilityMap: fragility,
  });
  const signals = deriveMomentumSignalsFromProfiles(profiles);
  assert.ok(signals.length > 0);
  assert.ok(signals.every((s) => s.intensity >= 0 && s.intensity <= 1));
});
