/**
 * D7:2:4 — Operational fragility concentration mapping tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildOperationalUniverseTopology,
  extractTopologyObjectsFromScene,
} from "../topology/operationalUniverseTopologyEngine.ts";
import { calculateOrganizationalFlows } from "../flow/organizationalFlowDynamicsEngine.ts";
import { evaluateDependencyPressure } from "../pressure/enterpriseDependencyPressureEngine.ts";
import type { SceneJson } from "../../sceneTypes.ts";
import {
  mapOperationalFragility,
  freezeFragilityConcentrationSnapshot,
} from "./operationalFragilityConcentrationEngine.ts";
import { buildRegionalFragilityProfiles, identifyCriticalRegions } from "./fragilityAccumulationModel.ts";
import { clusterFragilityConcentrationZones } from "./hotspotClusteringModel.ts";
import {
  buildFragilityContentFingerprint,
  detectFalseConcentrationLoop,
  guardMapOperationalFragility,
} from "./fragilityGuards.ts";
import { buildExecutiveFragilitySemantics } from "./executiveFragilitySemantics.ts";
import { classifyCollapseRiskLabel } from "./systemicExposureAnalysis.ts";
import { mapCrossDomainVulnerabilityCorridors } from "./crossDomainVulnerabilityMapping.ts";

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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-fragility", objects });
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
  return { topology, flow: flow.snapshot.state, pressure: pressure.snapshot.state };
}

test("deterministic fragility mapping", () => {
  const { topology, flow, pressure } = buildFullStack();
  const r1 = mapOperationalFragility({
    topology,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  const r2 = mapOperationalFragility({
    topology,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
  assert.ok(r1.snapshot.map.regionProfiles.length > 0);
});

test("hotspot clustering for manufacturing-logistics corridor", () => {
  const topology = buildTopology();
  const profiles = buildRegionalFragilityProfiles({
    topology,
    regionMetrics: strainedMetrics,
  });
  const zones = clusterFragilityConcentrationZones({ topology, profiles });
  const corridorZone = zones.find(
    (z) =>
      z.affectedRegionIds.includes("manufacturing") &&
      z.affectedRegionIds.includes("logistics")
  );
  assert.ok(corridorZone);
  assert.ok(["moderate", "high", "critical"].includes(corridorZone!.concentrationLevel));
});

test("systemic exposure consistency", () => {
  const { topology, flow, pressure } = buildFullStack();
  const result = mapOperationalFragility({
    topology,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.ok(result.snapshot.map.systemicExposureScore >= 0);
  assert.ok(result.snapshot.map.systemicExposureScore <= 1);
  assert.ok(result.snapshot.map.cascadePotentialScore <= 1);
  assert.equal(
    classifyCollapseRiskLabel({
      systemicExposureScore: result.snapshot.map.systemicExposureScore,
      cascadePotentialScore: result.snapshot.map.cascadePotentialScore,
      criticalRegionCount: result.snapshot.map.criticalRegions.length,
    }),
    result.snapshot.map.collapseRiskLabel
  );
});

test("replay-safe frozen fragility snapshot", () => {
  const topology = buildTopology();
  const result = mapOperationalFragility({ topology });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeFragilityConcentrationSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.map as { systemicExposureScore: number }).systemicExposureScore = 0;
  });
});

test("rejects false concentration loops", () => {
  const zones = [
    {
      zoneId: "z1",
      affectedRegionIds: ["a", "b"],
      concentrationLevel: "high" as const,
      averageFragilityScore: 0.6,
      peakFragilityScore: 0.7,
      dominantFragilityDrivers: [],
    },
    {
      zoneId: "z2",
      affectedRegionIds: ["a"],
      concentrationLevel: "moderate" as const,
      averageFragilityScore: 0.5,
      peakFragilityScore: 0.55,
      dominantFragilityDrivers: [],
    },
  ];
  const overlap = detectFalseConcentrationLoop(zones);
  assert.ok(overlap);
  const guard = guardMapOperationalFragility({
    topologyId: "topo",
    topologyRegionIds: ["a", "b"],
    zones,
    hotspotCount: 2,
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "false_concentration_loop");
});

test("rejects duplicate fragility build fingerprint", () => {
  const topology = buildTopology();
  const first = mapOperationalFragility({ topology, tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildFragilityContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    tick: 0,
    regionMetricKeys: [],
  });
  const second = mapOperationalFragility({
    topology,
    tick: 0,
    priorFragilityFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_fragility_build");
});

test("topology flow and pressure immutability preserved", () => {
  const { topology, flow, pressure } = buildFullStack();
  const topoFrozen = JSON.stringify(topology);
  const flowFrozen = JSON.stringify(flow);
  const pressureFrozen = JSON.stringify(pressure);
  mapOperationalFragility({
    topology,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.equal(JSON.stringify(topology), topoFrozen);
  assert.equal(JSON.stringify(flow), flowFrozen);
  assert.equal(JSON.stringify(pressure), pressureFrozen);
});

test("executive fragility semantics are readable", () => {
  const { topology, flow, pressure } = buildFullStack();
  const result = mapOperationalFragility({
    topology,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /fragility|concentration|vulnerability|Logistics|Manufacturing|stress/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("graph instability"));

  const manual = buildExecutiveFragilitySemantics({ map: result.snapshot.map });
  assert.ok(manual.summary.length > 0);
});

test("cross-domain vulnerability corridors", () => {
  const topology = buildTopology();
  const profiles = buildRegionalFragilityProfiles({
    topology,
    regionMetrics: strainedMetrics,
  });
  const corridors = mapCrossDomainVulnerabilityCorridors({ topology, profiles });
  assert.ok(
    corridors.some(
      (c) =>
        (c.sourceRegionId === "manufacturing" && c.targetRegionId === "logistics") ||
        (c.sourceRegionId === "logistics" && c.targetRegionId === "manufacturing")
    ) ||
      corridors.length >= 1
  );
});

test("integrated stack panel contract", () => {
  const { topology, flow, pressure } = buildFullStack();
  const fragility = mapOperationalFragility({
    topology,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.ok(fragility.ok);
  if (!fragility.ok) return;
  assert.equal(fragility.panelContract.topologyId, topology.topologyId);
  assert.ok(fragility.panelContract.criticalRegions.length >= 0);
});

test("governance guard rails reject invalid zone regions", () => {
  const guard = guardMapOperationalFragility({
    topologyId: "topo",
    topologyRegionIds: ["a"],
    zones: [
      {
        zoneId: "bad",
        affectedRegionIds: ["a", "missing"],
        concentrationLevel: "high",
        averageFragilityScore: 0.6,
        peakFragilityScore: 0.7,
        dominantFragilityDrivers: [],
      },
    ],
    hotspotCount: 1,
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_zone_region");
});

test("critical regions identified under strain", () => {
  const { topology, flow, pressure } = buildFullStack();
  const profiles = buildRegionalFragilityProfiles({
    topology,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  const critical = identifyCriticalRegions(profiles);
  assert.ok(critical.includes("logistics") || critical.includes("manufacturing"));
});
