/**
 * D7:2:3 — Enterprise dependency pressure intelligence tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildOperationalUniverseTopology,
  extractTopologyObjectsFromScene,
} from "../topology/operationalUniverseTopologyEngine.ts";
import { calculateOrganizationalFlows } from "../flow/organizationalFlowDynamicsEngine.ts";
import type { SceneJson } from "../../sceneTypes.ts";
import {
  evaluateDependencyPressure,
  freezeEnterprisePressureSnapshot,
} from "./enterpriseDependencyPressureEngine.ts";
import { derivePressureSignalsFromDependencies } from "./pressureAccumulationModel.ts";
import { analyzePressurePropagation } from "./pressurePropagationAnalysis.ts";
import { detectSaturationRegions, detectFragilityHotspots } from "./saturationDetection.ts";
import {
  buildPressureContentFingerprint,
  detectPressureCycle,
  guardEvaluateDependencyPressure,
} from "./pressureGuards.ts";
import { buildExecutivePressureSemantics } from "./executivePressureSemantics.ts";
import { classifyPressureStability } from "./systemicPressureModel.ts";

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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-pressure", objects });
  assert.ok(built.ok);
  if (!built.ok) throw new Error("topology build failed");
  return built.snapshot.topology;
}

const strainedMetrics = {
  manufacturing: { fragility: 0.55, operationalLoad: 0.65, recoveryStrain: 0.7 },
  logistics: { fragility: 0.72, operationalLoad: 0.8, recoveryStrain: 0.65 },
  customer_systems: { fragility: 0.45, operationalLoad: 0.5 },
  finance: { fragility: 0.3, operationalLoad: 0.35 },
};

test("deterministic pressure analysis", () => {
  const topology = buildTopology();
  const flow = calculateOrganizationalFlows({ topology, regionMetrics: strainedMetrics });
  assert.ok(flow.ok);
  if (!flow.ok) return;

  const r1 = evaluateDependencyPressure({
    topology,
    flowState: flow.snapshot.state,
    regionMetrics: strainedMetrics,
  });
  const r2 = evaluateDependencyPressure({
    topology,
    flowState: flow.snapshot.state,
    regionMetrics: strainedMetrics,
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
  assert.ok(r1.snapshot.state.activePressureSignals.length > 0);
});

test("saturation detection for strained logistics", () => {
  const topology = buildTopology();
  const signals = derivePressureSignalsFromDependencies({
    topology,
    regionMetrics: {
      logistics: { fragility: 0.75, operationalLoad: 0.85, recoveryStrain: 0.7 },
      manufacturing: { fragility: 0.6, operationalLoad: 0.7, recoveryStrain: 0.65 },
    },
  });
  const accumulations = signals.length
    ? analyzePressurePropagation({
        topology,
        signals,
        regionAccumulations: topology.operationalRegions.map((r) =>
          Object.freeze({
            regionId: r.regionId,
            accumulatedPressure: r.regionId === "logistics" ? 0.78 : 0.4,
            inboundPressure: r.regionId === "logistics" ? 0.7 : 0.3,
            dependencyConcentration: 0.5,
            fragilityExposure: 0.45,
          })
        ),
      }).adjustedAccumulations
    : [];

  const saturated = detectSaturationRegions({
    accumulations,
    regionMetrics: {
      logistics: { fragility: 0.75, operationalLoad: 0.85, recoveryStrain: 0.7 },
    },
  });
  assert.ok(saturated.includes("logistics"));
});

test("pressure propagation consistency", () => {
  const topology = buildTopology();
  const signals = derivePressureSignalsFromDependencies({ topology, regionMetrics: strainedMetrics });
  const base = topology.operationalRegions.map((r) =>
    Object.freeze({
      regionId: r.regionId,
      accumulatedPressure: r.regionId === "manufacturing" ? 0.62 : 0.35,
      inboundPressure: 0.4,
      dependencyConcentration: 0.45,
      fragilityExposure: 0.35,
    })
  );
  const p1 = analyzePressurePropagation({ topology, signals, regionAccumulations: base });
  const p2 = analyzePressurePropagation({ topology, signals, regionAccumulations: base });
  assert.equal(
    p1.propagationRecords.map((r) => r.recordId).join("|"),
    p2.propagationRecords.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen pressure snapshot", () => {
  const topology = buildTopology();
  const result = evaluateDependencyPressure({ topology });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeEnterprisePressureSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { systemicPressureScore: number }).systemicPressureScore = 0;
  });
});

test("rejects recursive pressure loops", () => {
  const signals = [
    {
      signalId: "p1",
      sourceRegionId: "a",
      targetRegionId: "b",
      pressureType: "operational" as const,
      intensity: 0.8,
    },
    {
      signalId: "p2",
      sourceRegionId: "b",
      targetRegionId: "c",
      pressureType: "operational" as const,
      intensity: 0.8,
    },
    {
      signalId: "p3",
      sourceRegionId: "c",
      targetRegionId: "a",
      pressureType: "operational" as const,
      intensity: 0.8,
    },
  ];
  const cycle = detectPressureCycle(signals);
  assert.ok(cycle);
  const guard = guardEvaluateDependencyPressure({
    topologyId: "topo",
    topologyRegionIds: ["a", "b", "c"],
    signals,
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "recursive_pressure_loop");
});

test("rejects duplicate pressure build fingerprint", () => {
  const topology = buildTopology();
  const first = evaluateDependencyPressure({ topology, tick: 0 });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildPressureContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    tick: 0,
    regionMetricKeys: [],
  });
  const second = evaluateDependencyPressure({
    topology,
    tick: 0,
    priorPressureFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_pressure_build");
});

test("topology and flow state immutability preserved", () => {
  const topology = buildTopology();
  const flow = calculateOrganizationalFlows({ topology });
  assert.ok(flow.ok);
  if (!flow.ok) return;
  const topoFrozen = JSON.stringify(topology);
  const flowFrozen = JSON.stringify(flow.snapshot.state);
  evaluateDependencyPressure({ topology, flowState: flow.snapshot.state });
  assert.equal(JSON.stringify(topology), topoFrozen);
  assert.equal(JSON.stringify(flow.snapshot.state), flowFrozen);
});

test("executive pressure semantics are readable", () => {
  const topology = buildTopology();
  const flow = calculateOrganizationalFlows({
    topology,
    regionMetrics: strainedMetrics,
  });
  assert.ok(flow.ok);
  if (!flow.ok) return;
  const result = evaluateDependencyPressure({
    topology,
    flowState: flow.snapshot.state,
    regionMetrics: strainedMetrics,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.match(
    result.snapshot.semantics.headline,
    /pressure|saturation|Logistics|Manufacturing|dependency|strain/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("recursion threshold"));

  const manual = buildExecutivePressureSemantics({
    state: result.snapshot.state,
    propagationRecords: result.snapshot.state.propagationRecords,
  });
  assert.ok(manual.summary.length > 0);
});

test("integrated topology flow and pressure panel contract", () => {
  const topology = buildTopology();
  const flow = calculateOrganizationalFlows({
    topology,
    regionMetrics: strainedMetrics,
  });
  assert.ok(flow.ok);
  if (!flow.ok) return;
  const pressure = evaluateDependencyPressure({
    topology,
    flowState: flow.snapshot.state,
    regionMetrics: strainedMetrics,
  });
  assert.ok(pressure.ok);
  if (!pressure.ok) return;
  assert.equal(pressure.panelContract.topologyId, topology.topologyId);
  assert.ok(pressure.panelContract.signals.length > 0);
  assert.ok(
    ["stable", "elevated", "critical"].includes(pressure.panelContract.pressureStabilityLabel)
  );
});

test("governance guard rails reject invalid orphan pressure paths", () => {
  const guard = guardEvaluateDependencyPressure({
    topologyId: "topo",
    topologyRegionIds: ["a"],
    signals: [
      {
        signalId: "orphan",
        sourceRegionId: "a",
        targetRegionId: "missing",
        pressureType: "operational",
        intensity: 0.5,
      },
    ],
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "orphan_pressure_path");
});

test("pressure stability classification is consistent", () => {
  assert.equal(
    classifyPressureStability({
      systemicPressureScore: 0.3,
      cascadeRiskScore: 0.25,
      saturationRegionCount: 0,
    }),
    "stable"
  );
  assert.equal(
    classifyPressureStability({
      systemicPressureScore: 0.8,
      cascadeRiskScore: 0.75,
      saturationRegionCount: 4,
    }),
    "critical"
  );
});
