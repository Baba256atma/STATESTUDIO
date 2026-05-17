/**
 * D7:2:5 — Organizational recovery capacity intelligence tests.
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
import type { SceneJson } from "../../sceneTypes.ts";
import {
  evaluateRecoveryCapacity,
  freezeOrganizationalRecoverySnapshot,
} from "./organizationalRecoveryCapacityEngine.ts";
import { buildRegionalRecoveryProfiles } from "./regionalRecoveryCapacityModel.ts";
import { clusterRecoveryCapacityZones } from "./recoveryZoneClustering.ts";
import {
  buildRecoveryContentFingerprint,
  detectRecoveryZoneOverlap,
  guardEvaluateRecoveryCapacity,
} from "./recoveryGuards.ts";
import { buildExecutiveRecoverySemantics } from "./executiveRecoverySemantics.ts";
import {
  calculateResilienceScore,
  classifyResilienceLabel,
} from "./resilienceModeling.ts";
import { detectRecoveryBottlenecks } from "./recoveryBottleneckAnalysis.ts";
import { analyzeRecoveryPropagation } from "./recoveryPropagationIntelligence.ts";

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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-recovery", objects });
  assert.ok(built.ok);
  if (!built.ok) throw new Error("topology build failed");
  return built.snapshot.topology;
}

const strainedMetrics = {
  manufacturing: { fragility: 0.62, operationalLoad: 0.7, recoveryCapacity: 0.3 },
  logistics: { fragility: 0.78, operationalLoad: 0.85, recoveryCapacity: 0.25 },
  customer_systems: { fragility: 0.48, operationalLoad: 0.5, recoveryCapacity: 0.45 },
  finance: { fragility: 0.28, operationalLoad: 0.35, recoveryCapacity: 0.7, coordinationStrength: 0.75 },
};

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
  return {
    topology,
    flow: flow.snapshot.state,
    pressure: pressure.snapshot.state,
    fragility: fragility.snapshot.map,
  };
}

test("deterministic recovery analysis", () => {
  const { topology, flow, pressure, fragility } = buildFullStack();
  const r1 = evaluateRecoveryCapacity({
    topology,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  const r2 = evaluateRecoveryCapacity({
    topology,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
  assert.ok(r1.snapshot.state.regionProfiles.length > 0);
});

test("resilience modeling under strain", () => {
  const { topology, flow, pressure, fragility } = buildFullStack();
  const profiles = buildRegionalRecoveryProfiles({
    topology,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  const zones = clusterRecoveryCapacityZones({ topology, profiles });
  const resilienceScore = calculateResilienceScore({ profiles, fragilityMap: fragility, zones });
  assert.ok(resilienceScore >= 0 && resilienceScore <= 1);
  const label = classifyResilienceLabel({
    resilienceScore,
    fragilityMap: fragility,
    bottleneckCount: 0,
  });
  assert.ok(["robust", "strained", "fragile"].includes(label));
});

test("recovery bottleneck detection", () => {
  const { topology, fragility } = buildFullStack();
  const profiles = buildRegionalRecoveryProfiles({
    topology,
    fragilityMap: fragility,
    regionMetrics: {
      logistics: { recoveryCapacity: 0.2, operationalLoad: 0.85, fragility: 0.8 },
    },
  });
  const bottlenecks = detectRecoveryBottlenecks({
    topology,
    profiles,
    regionMetrics: {
      logistics: { recoveryCapacity: 0.2, operationalLoad: 0.85 },
    },
  });
  assert.ok(bottlenecks.some((b) => b.regionId === "logistics"));
});

test("stabilization propagation consistency", () => {
  const { topology, fragility } = buildFullStack();
  const profiles = buildRegionalRecoveryProfiles({ topology, fragilityMap: fragility });
  const p1 = analyzeRecoveryPropagation({ topology, profiles, fragilityMap: fragility });
  const p2 = analyzeRecoveryPropagation({ topology, profiles, fragilityMap: fragility });
  assert.equal(
    p1.map((r) => r.recordId).join("|"),
    p2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen recovery snapshot", () => {
  const { topology, fragility } = buildFullStack();
  const result = evaluateRecoveryCapacity({ topology, fragilityMap: fragility });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeOrganizationalRecoverySnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { resilienceScore: number }).resilienceScore = 0;
  });
});

test("rejects recovery zone overlap", () => {
  const overlap = detectRecoveryZoneOverlap([
    {
      zoneId: "z1",
      affectedRegionIds: ["a", "b"],
      recoveryCapacity: "stable",
      averageRecoveryScore: 0.6,
      peakRecoveryScore: 0.65,
      stabilizationDrivers: [],
    },
    {
      zoneId: "z2",
      affectedRegionIds: ["a"],
      recoveryCapacity: "limited",
      averageRecoveryScore: 0.45,
      peakRecoveryScore: 0.5,
      stabilizationDrivers: [],
    },
  ]);
  assert.ok(overlap);
  const guard = guardEvaluateRecoveryCapacity({
    topologyId: "topo",
    topologyRegionIds: ["a", "b"],
    zones: [
      {
        zoneId: "z1",
        affectedRegionIds: ["a", "b"],
        recoveryCapacity: "stable",
        averageRecoveryScore: 0.6,
        peakRecoveryScore: 0.65,
        stabilizationDrivers: [],
      },
      {
        zoneId: "z2",
        affectedRegionIds: ["a"],
        recoveryCapacity: "limited",
        averageRecoveryScore: 0.45,
        peakRecoveryScore: 0.5,
        stabilizationDrivers: [],
      },
    ],
    propagationRecordCount: 0,
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "unstable_recovery_loop");
});

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

test("rejects duplicate recovery build fingerprint", () => {
  const { topology, fragility } = buildFullStack();
  const first = evaluateRecoveryCapacity({ topology, fragilityMap: fragility, tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildRecoveryContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    fragilityFingerprint: stableStringify({
      systemic: fragility.systemicExposureScore,
      cascade: fragility.cascadePotentialScore,
      collapse: fragility.collapseRiskLabel,
    }),
    tick: 0,
    regionMetricKeys: [],
  });
  const second = evaluateRecoveryCapacity({
    topology,
    fragilityMap: fragility,
    tick: 0,
    priorRecoveryFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_recovery_build");
});

test("upstream state immutability preserved", () => {
  const { topology, flow, pressure, fragility } = buildFullStack();
  const topoFrozen = JSON.stringify(topology);
  const flowFrozen = JSON.stringify(flow);
  const pressureFrozen = JSON.stringify(pressure);
  const fragilityFrozen = JSON.stringify(fragility);
  evaluateRecoveryCapacity({
    topology,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.equal(JSON.stringify(topology), topoFrozen);
  assert.equal(JSON.stringify(flow), flowFrozen);
  assert.equal(JSON.stringify(pressure), pressureFrozen);
  assert.equal(JSON.stringify(fragility), fragilityFrozen);
});

test("executive recovery semantics are readable", () => {
  const { topology, flow, pressure, fragility } = buildFullStack();
  const result = evaluateRecoveryCapacity({
    topology,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /recovery|stabilization|resilience|coordination|capacity|Logistics|Manufacturing/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("recursion variance"));

  const manual = buildExecutiveRecoverySemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.length > 0);
});

test("integrated stack panel contract", () => {
  const { topology, flow, pressure, fragility } = buildFullStack();
  const recovery = evaluateRecoveryCapacity({
    topology,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.ok(recovery.ok);
  if (!recovery.ok) return;
  assert.equal(recovery.panelContract.topologyId, topology.topologyId);
  assert.ok(recovery.panelContract.zones.length >= 0);
});

test("governance guard rails reject invalid zone regions", () => {
  const guard = guardEvaluateRecoveryCapacity({
    topologyId: "topo",
    topologyRegionIds: ["a"],
    zones: [
      {
        zoneId: "bad",
        affectedRegionIds: ["a", "ghost"],
        recoveryCapacity: "weak",
        averageRecoveryScore: 0.3,
        peakRecoveryScore: 0.35,
        stabilizationDrivers: [],
      },
    ],
    propagationRecordCount: 0,
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_zone_region");
});
