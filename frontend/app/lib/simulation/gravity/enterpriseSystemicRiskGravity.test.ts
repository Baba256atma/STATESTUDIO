/**
 * D7:2:8 — Enterprise systemic risk gravity intelligence tests.
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
import { evaluateOperationalMomentum } from "../momentum/enterpriseOperationalMomentumEngine.ts";
import { evaluateOperationalEquilibrium } from "../equilibrium/strategicOperationalEquilibriumEngine.ts";
import type { SceneJson } from "../../sceneTypes.ts";
import {
  evaluateSystemicRiskGravity,
  freezeEnterpriseRiskGravitySnapshot,
} from "./enterpriseSystemicRiskGravityEngine.ts";
import { buildRegionalGravityProfiles } from "./regionalGravityModel.ts";
import { clusterSystemicRiskGravityZones } from "./gravityZoneClustering.ts";
import {
  buildGravityContentFingerprint,
  guardEvaluateSystemicRiskGravity,
} from "./gravityGuards.ts";
import { buildExecutiveGravitySemantics } from "./executiveGravitySemantics.ts";
import { detectInstabilityAttractors } from "./instabilityAttractionModel.ts";
import { calculateSystemicCollapsePressure } from "./systemicCollapsePressureAnalysis.ts";
import { analyzeRiskConvergence } from "./riskConvergenceIntelligence.ts";

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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-gravity", objects });
  assert.ok(built.ok);
  if (!built.ok) throw new Error("topology build failed");
  return built.snapshot.topology;
}

const strainedMetrics = {
  manufacturing: { fragility: 0.62, operationalLoad: 0.7, recoveryCapacity: 0.3 },
  logistics: { fragility: 0.78, operationalLoad: 0.85, recoveryCapacity: 0.25 },
  customer_systems: { fragility: 0.48, operationalLoad: 0.5, recoveryCapacity: 0.45 },
  finance: { fragility: 0.28, operationalLoad: 0.35, recoveryCapacity: 0.7 },
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
  const momentum = evaluateOperationalMomentum({
    topology,
    recoveryState: recovery.snapshot.state,
    fragilityMap: fragility.snapshot.map,
    flowState: flow.snapshot.state,
    pressureState: pressure.snapshot.state,
    regionMetrics: strainedMetrics,
  });
  assert.ok(momentum.ok);
  if (!momentum.ok) throw new Error("momentum failed");
  const equilibrium = evaluateOperationalEquilibrium({
    topology,
    momentumState: momentum.snapshot.state,
    recoveryState: recovery.snapshot.state,
    fragilityMap: fragility.snapshot.map,
    flowState: flow.snapshot.state,
    pressureState: pressure.snapshot.state,
    regionMetrics: strainedMetrics,
  });
  assert.ok(equilibrium.ok);
  if (!equilibrium.ok) throw new Error("equilibrium failed");
  return {
    topology,
    flow: flow.snapshot.state,
    pressure: pressure.snapshot.state,
    fragility: fragility.snapshot.map,
    recovery: recovery.snapshot.state,
    momentum: momentum.snapshot.state,
    equilibrium: equilibrium.snapshot.state,
  };
}

test("deterministic gravity analysis", () => {
  const { topology, equilibrium, fragility, pressure, momentum, recovery, flow } = buildFullStack();
  const r1 = evaluateSystemicRiskGravity({
    topology,
    equilibriumState: equilibrium,
    fragilityMap: fragility,
    pressureState: pressure,
    momentumState: momentum,
    recoveryState: recovery,
    flowState: flow,
    regionMetrics: strainedMetrics,
  });
  const r2 = evaluateSystemicRiskGravity({
    topology,
    equilibriumState: equilibrium,
    fragilityMap: fragility,
    pressureState: pressure,
    momentumState: momentum,
    recoveryState: recovery,
    flowState: flow,
    regionMetrics: strainedMetrics,
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
  assert.ok(r1.snapshot.state.gravityZones.length >= 0);
});

test("instability attraction modeling", () => {
  const { topology, equilibrium, fragility, pressure, momentum, recovery } = buildFullStack();
  const profiles = buildRegionalGravityProfiles({
    topology,
    equilibriumState: equilibrium,
    fragilityMap: fragility,
    pressureState: pressure,
    momentumState: momentum,
    recoveryState: recovery,
    regionMetrics: strainedMetrics,
  });
  const zones = clusterSystemicRiskGravityZones({ topology, profiles });
  const attractors = detectInstabilityAttractors({ topology, profiles, gravityZones: zones });
  assert.ok(attractors.some((a) => a.regionId === "logistics") || zones.length > 0);
});

test("collapse pressure consistency", () => {
  const { topology, equilibrium, fragility, momentum } = buildFullStack();
  const profiles = buildRegionalGravityProfiles({
    topology,
    equilibriumState: equilibrium,
    fragilityMap: fragility,
    momentumState: momentum,
  });
  const zones = clusterSystemicRiskGravityZones({ topology, profiles });
  const pressure = calculateSystemicCollapsePressure({
    profiles,
    gravityZones: zones,
    fragilityMap: fragility,
    equilibriumState: equilibrium,
    momentumState: momentum,
  });
  assert.ok(pressure >= 0 && pressure <= 1);
});

test("risk convergence propagation consistency", () => {
  const { topology, equilibrium, fragility } = buildFullStack();
  const profiles = buildRegionalGravityProfiles({
    topology,
    equilibriumState: equilibrium,
    fragilityMap: fragility,
  });
  const c1 = analyzeRiskConvergence({ topology, profiles });
  const c2 = analyzeRiskConvergence({ topology, profiles });
  assert.equal(
    c1.map((r) => r.recordId).join("|"),
    c2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen gravity snapshot", () => {
  const { topology, equilibrium, fragility } = buildFullStack();
  const result = evaluateSystemicRiskGravity({
    topology,
    equilibriumState: equilibrium,
    fragilityMap: fragility,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeEnterpriseRiskGravitySnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { systemicCollapsePressure: number }).systemicCollapsePressure = 0;
  });
});

test("rejects duplicate gravity build fingerprint", () => {
  const { topology, equilibrium, fragility, momentum } = buildFullStack();
  const first = evaluateSystemicRiskGravity({
    topology,
    equilibriumState: equilibrium,
    fragilityMap: fragility,
    momentumState: momentum,
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildGravityContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    equilibriumFingerprint: stableStringify({
      label: equilibrium.equilibriumLabel,
      score: equilibrium.equilibriumScore,
    }),
    fragilityFingerprint: stableStringify({
      systemic: fragility.systemicExposureScore,
      collapse: fragility.collapseRiskLabel,
    }),
    momentumFingerprint: stableStringify({ trend: momentum.momentumTrendLabel }),
    tick: 0,
    regionMetricKeys: [],
  });
  const second = evaluateSystemicRiskGravity({
    topology,
    equilibriumState: equilibrium,
    fragilityMap: fragility,
    momentumState: momentum,
    tick: 0,
    priorGravityFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_gravity_build");
});

test("upstream state immutability preserved", () => {
  const { topology, equilibrium, fragility, momentum } = buildFullStack();
  const frozen = {
    equilibrium: JSON.stringify(equilibrium),
    fragility: JSON.stringify(fragility),
    momentum: JSON.stringify(momentum),
  };
  evaluateSystemicRiskGravity({
    topology,
    equilibriumState: equilibrium,
    fragilityMap: fragility,
    momentumState: momentum,
  });
  assert.equal(JSON.stringify(equilibrium), frozen.equilibrium);
  assert.equal(JSON.stringify(fragility), frozen.fragility);
  assert.equal(JSON.stringify(momentum), frozen.momentum);
});

test("executive gravity semantics are readable", () => {
  const { topology, equilibrium, fragility, pressure, momentum, recovery, flow } = buildFullStack();
  const result = evaluateSystemicRiskGravity({
    topology,
    equilibriumState: equilibrium,
    fragilityMap: fragility,
    pressureState: pressure,
    momentumState: momentum,
    recoveryState: recovery,
    flowState: flow,
    regionMetrics: strainedMetrics,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /gravity|instability|collapse|Logistics|imbalance|convergence/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("recursion variance"));

  const manual = buildExecutiveGravitySemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.length > 0);
});

test("integrated stack panel contract", () => {
  const { topology, equilibrium, fragility, momentum } = buildFullStack();
  const gravity = evaluateSystemicRiskGravity({
    topology,
    equilibriumState: equilibrium,
    fragilityMap: fragility,
    momentumState: momentum,
  });
  assert.ok(gravity.ok);
  if (!gravity.ok) return;
  assert.equal(gravity.panelContract.topologyId, topology.topologyId);
  assert.ok(["contained", "elevated", "critical"].includes(gravity.panelContract.gravityRiskLabel));
});

test("governance guard rails reject invalid gravity regions", () => {
  const guard = guardEvaluateSystemicRiskGravity({
    topologyId: "topo",
    topologyRegionIds: ["a"],
    zones: [
      {
        zoneId: "bad",
        affectedRegionIds: ["ghost"],
        gravityLevel: "critical",
        averageGravityScore: 0.8,
        peakGravityScore: 0.9,
        dominantGravityDrivers: [],
      },
    ],
    convergenceRecordCount: 0,
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_gravity_region");
});
