/**
 * D7:2:2 — Organizational flow dynamics tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildOperationalUniverseTopology,
  extractTopologyObjectsFromScene,
} from "../topology/operationalUniverseTopologyEngine.ts";
import type { SceneJson } from "../../sceneTypes.ts";
import {
  calculateOrganizationalFlows,
  freezeOrganizationalFlowSnapshot,
} from "./organizationalFlowDynamicsEngine.ts";
import { deriveFlowsFromTopology } from "./resourceCirculationModel.ts";
import {
  computeRegionFlowPressures,
  detectOperationalBottlenecks,
} from "./bottleneckDetection.ts";
import { calculateOperationalMomentum } from "./flowMomentumModel.ts";
import { buildFlowContentFingerprint, detectFlowCycle, guardCalculateOrganizationalFlows } from "./flowGuards.ts";
import { buildExecutiveFlowSemantics } from "./executiveFlowSemantics.ts";

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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-flow", objects });
  assert.ok(built.ok);
  if (!built.ok) throw new Error("topology build failed");
  return built.snapshot.topology;
}

test("deterministic flow generation", () => {
  const topology = buildTopology();
  const metrics = {
    manufacturing: { fragility: 0.35, operationalLoad: 0.5, throughput: 0.6 },
    logistics: { fragility: 0.65, operationalLoad: 0.75, throughput: 0.35 },
    customer_systems: { fragility: 0.4, operationalLoad: 0.45, throughput: 0.55 },
    finance: { fragility: 0.25, operationalLoad: 0.3, throughput: 0.7 },
  };
  const r1 = calculateOrganizationalFlows({ topology, regionMetrics: metrics });
  const r2 = calculateOrganizationalFlows({ topology, regionMetrics: metrics });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
  assert.ok(r1.snapshot.state.activeFlows.length > 0);
});

test("bottleneck detection for strained logistics", () => {
  const topology = buildTopology();
  const flows = deriveFlowsFromTopology({
    topology,
    regionMetrics: {
      logistics: { fragility: 0.7, operationalLoad: 0.8, throughput: 0.3 },
      manufacturing: { throughput: 0.65, operationalLoad: 0.55 },
    },
  });
  const pressures = computeRegionFlowPressures(flows);
  const bottlenecks = detectOperationalBottlenecks({
    regions: topology.operationalRegions,
    flows,
    regionPressures: pressures,
    regionMetrics: {
      logistics: { fragility: 0.7, operationalLoad: 0.8, throughput: 0.3 },
    },
  });
  assert.ok(bottlenecks.some((b) => b.regionId === "logistics"));
});

test("operational momentum consistency", () => {
  const healthy = calculateOperationalMomentum({
    flows: [
      { intensity: 0.3, throughput: 0.85 },
      { intensity: 0.28, throughput: 0.82 },
      { intensity: 0.25, throughput: 0.8 },
    ],
    bottlenecks: [],
    flowPressureScore: 0.22,
  });
  assert.equal(healthy.momentumLabel, "healthy");

  const unstable = calculateOperationalMomentum({
    flows: [{ intensity: 0.9, throughput: 0.2 }],
    bottlenecks: [
      {
        bottleneckId: "b1",
        regionId: "logistics",
        severity: "critical",
        reason: "Congestion",
        contributingFlowIds: [],
      },
    ],
    flowPressureScore: 0.85,
  });
  assert.equal(unstable.momentumLabel, "unstable");
});

test("replay-safe frozen flow snapshot", () => {
  const topology = buildTopology();
  const result = calculateOrganizationalFlows({ topology });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeOrganizationalFlowSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { flowPressureScore: number }).flowPressureScore = 0;
  });
});

test("rejects recursive flow loops", () => {
  const flows = [
    {
      flowId: "f1",
      sourceRegionId: "a",
      targetRegionId: "b",
      flowType: "resource" as const,
      intensity: 0.8,
    },
    {
      flowId: "f2",
      sourceRegionId: "b",
      targetRegionId: "c",
      flowType: "resource" as const,
      intensity: 0.8,
    },
    {
      flowId: "f3",
      sourceRegionId: "c",
      targetRegionId: "a",
      flowType: "resource" as const,
      intensity: 0.8,
    },
  ];
  const cycle = detectFlowCycle(flows);
  assert.ok(cycle);
  const guard = guardCalculateOrganizationalFlows({
    topologyId: "topo",
    topologyRegionIds: ["a", "b", "c"],
    flows,
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "recursive_flow_loop");
});

test("rejects duplicate flow build fingerprint", () => {
  const topology = buildTopology();
  const first = calculateOrganizationalFlows({ topology, tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildFlowContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    tick: 0,
    regionMetricKeys: [],
  });
  const second = calculateOrganizationalFlows({
    topology,
    tick: 0,
    priorFlowFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_flow_build");
});

test("topology immutability preserved", () => {
  const topology = buildTopology();
  const frozen = JSON.stringify(topology);
  calculateOrganizationalFlows({ topology });
  assert.equal(JSON.stringify(topology), frozen);
});

test("executive flow semantics are readable", () => {
  const topology = buildTopology();
  const result = calculateOrganizationalFlows({
    topology,
    regionMetrics: {
      manufacturing: { throughput: 0.6 },
      logistics: { fragility: 0.7, throughput: 0.3, operationalLoad: 0.75 },
    },
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(result.snapshot.semantics.headline, /pressure|circulation|flow|Manufacturing|Logistics/i);
  assert.ok(!result.snapshot.semantics.headline.includes("congestion index"));

  const manual = buildExecutiveFlowSemantics({
    state: result.snapshot.state,
    flows: result.snapshot.state.activeFlows,
  });
  assert.ok(manual.summary.length > 0);
});

test("integrated topology and flow panel contract", () => {
  const topology = buildTopology();
  const result = calculateOrganizationalFlows({
    topology,
    regionMetrics: {
      logistics: { throughput: 0.25, operationalLoad: 0.7, fragility: 0.65 },
    },
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.panelContract.topologyId, topology.topologyId);
  assert.ok(result.panelContract.flows.length > 0);
});
