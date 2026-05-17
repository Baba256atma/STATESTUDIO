/**
 * D7:2:7 — Strategic operational equilibrium intelligence tests.
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
import type { SceneJson } from "../../sceneTypes.ts";
import {
  evaluateOperationalEquilibrium,
  freezeEnterpriseEquilibriumSnapshot,
} from "./strategicOperationalEquilibriumEngine.ts";
import {
  buildRegionalEquilibriumProfiles,
  deriveEquilibriumSignalsFromProfiles,
} from "./regionalEquilibriumModel.ts";
import {
  buildEquilibriumContentFingerprint,
  guardEvaluateOperationalEquilibrium,
} from "./equilibriumGuards.ts";
import { buildExecutiveEquilibriumSemantics } from "./executiveEquilibriumSemantics.ts";
import {
  identifyImbalanceZones,
  classifyEquilibriumLabel,
} from "./stabilityImbalanceModel.ts";
import { analyzeEquilibriumDrift } from "./equilibriumDriftAnalysis.ts";
import { mapCrossDomainEquilibrium } from "./crossDomainEquilibriumMapping.ts";

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
  const built = buildOperationalUniverseTopology({ topologyId: "topo-equilibrium", objects });
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
  return {
    topology,
    flow: flow.snapshot.state,
    pressure: pressure.snapshot.state,
    fragility: fragility.snapshot.map,
    recovery: recovery.snapshot.state,
    momentum: momentum.snapshot.state,
  };
}

test("deterministic equilibrium analysis", () => {
  const { topology, momentum, recovery, fragility, flow, pressure } = buildFullStack();
  const r1 = evaluateOperationalEquilibrium({
    topology,
    momentumState: momentum,
    recoveryState: recovery,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  const r2 = evaluateOperationalEquilibrium({
    topology,
    momentumState: momentum,
    recoveryState: recovery,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.ok(r1.ok && r2.ok);
  if (!r1.ok || !r2.ok) return;
  assert.equal(r1.snapshot.fingerprint, r2.snapshot.fingerprint);
  assert.ok(r1.snapshot.state.activeEquilibriumSignals.length > 0);
});

test("stability and imbalance modeling", () => {
  const { topology, momentum, recovery, fragility, flow, pressure } = buildFullStack();
  const profiles = buildRegionalEquilibriumProfiles({
    topology,
    momentumState: momentum,
    recoveryState: recovery,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  const imbalanceZones = identifyImbalanceZones(profiles);
  assert.ok(imbalanceZones.includes("logistics") || imbalanceZones.includes("manufacturing"));
});

test("equilibrium drift consistency", () => {
  const { topology, momentum, recovery, fragility } = buildFullStack();
  const profiles = buildRegionalEquilibriumProfiles({
    topology,
    momentumState: momentum,
    recoveryState: recovery,
    fragilityMap: fragility,
  });
  const d1 = analyzeEquilibriumDrift({ profiles, priorEquilibriumScore: 0.55 });
  const d2 = analyzeEquilibriumDrift({ profiles, priorEquilibriumScore: 0.55 });
  assert.equal(
    d1.map((r) => r.recordId).join("|"),
    d2.map((r) => r.recordId).join("|")
  );
});

test("replay-safe frozen equilibrium snapshot", () => {
  const { topology, momentum, recovery, fragility } = buildFullStack();
  const result = evaluateOperationalEquilibrium({
    topology,
    momentumState: momentum,
    recoveryState: recovery,
    fragilityMap: fragility,
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  const frozen = freezeEnterpriseEquilibriumSnapshot(result.snapshot);
  assert.throws(() => {
    (frozen.state as { equilibriumScore: number }).equilibriumScore = 0;
  });
});

test("rejects duplicate equilibrium build fingerprint", () => {
  const { topology, momentum, recovery, fragility } = buildFullStack();
  const first = evaluateOperationalEquilibrium({
    topology,
    momentumState: momentum,
    recoveryState: recovery,
    fragilityMap: fragility,
    tick: 0,
  });
  assert.ok(first.ok);
  if (!first.ok) return;
  const fp = buildEquilibriumContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    momentumFingerprint: stableStringify({
      trend: momentum.momentumTrendLabel,
      score: momentum.organizationalMomentumScore,
    }),
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
  const second = evaluateOperationalEquilibrium({
    topology,
    momentumState: momentum,
    recoveryState: recovery,
    fragilityMap: fragility,
    tick: 0,
    priorEquilibriumFingerprints: [fp],
  });
  assert.equal(second.ok, false);
  if (second.ok) return;
  assert.equal(second.guard.code, "duplicate_equilibrium_build");
});

test("upstream state immutability preserved", () => {
  const { topology, flow, pressure, fragility, recovery, momentum } = buildFullStack();
  const frozen = {
    topology: JSON.stringify(topology),
    flow: JSON.stringify(flow),
    pressure: JSON.stringify(pressure),
    fragility: JSON.stringify(fragility),
    recovery: JSON.stringify(recovery),
    momentum: JSON.stringify(momentum),
  };
  evaluateOperationalEquilibrium({
    topology,
    momentumState: momentum,
    recoveryState: recovery,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.equal(JSON.stringify(topology), frozen.topology);
  assert.equal(JSON.stringify(momentum), frozen.momentum);
  assert.equal(JSON.stringify(recovery), frozen.recovery);
  assert.equal(JSON.stringify(fragility), frozen.fragility);
});

test("executive equilibrium semantics are readable", () => {
  const { topology, momentum, recovery, fragility, flow, pressure } = buildFullStack();
  const result = evaluateOperationalEquilibrium({
    topology,
    momentumState: momentum,
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
    /equilibrium|balance|imbalance|stabiliz|Logistics|Manufacturing|pressure/i
  );
  assert.ok(!result.snapshot.semantics.headline.includes("variance recursion"));

  const manual = buildExecutiveEquilibriumSemantics({ state: result.snapshot.state });
  assert.ok(manual.summary.length > 0);
});

test("cross-domain equilibrium intelligence", () => {
  const { topology, momentum, recovery, fragility } = buildFullStack();
  const profiles = buildRegionalEquilibriumProfiles({
    topology,
    momentumState: momentum,
    recoveryState: recovery,
    fragilityMap: fragility,
  });
  const cross = mapCrossDomainEquilibrium({ topology, profiles });
  assert.ok(cross.length >= 1);
});

test("integrated stack panel contract", () => {
  const { topology, momentum, recovery, fragility, flow, pressure } = buildFullStack();
  const equilibrium = evaluateOperationalEquilibrium({
    topology,
    momentumState: momentum,
    recoveryState: recovery,
    fragilityMap: fragility,
    flowState: flow,
    pressureState: pressure,
    regionMetrics: strainedMetrics,
  });
  assert.ok(equilibrium.ok);
  if (!equilibrium.ok) return;
  assert.equal(equilibrium.panelContract.topologyId, topology.topologyId);
  assert.ok(equilibrium.panelContract.signals.length > 0);
});

test("governance guard rails reject invalid equilibrium regions", () => {
  const guard = guardEvaluateOperationalEquilibrium({
    topologyId: "topo",
    topologyRegionIds: ["a"],
    signals: [
      {
        signalId: "bad",
        affectedRegionIds: ["missing"],
        equilibriumState: "critical",
        intensity: 0.8,
      },
    ],
    driftRecordCount: 0,
  });
  assert.equal(guard.ok, false);
  if (guard.ok) return;
  assert.equal(guard.code, "invalid_equilibrium_region");
});

test("equilibrium label classification consistency", () => {
  const { fragility, momentum } = buildFullStack();
  const label = classifyEquilibriumLabel({
    equilibriumScore: 0.45,
    instabilityDriftScore: 0.5,
    imbalanceZoneCount: 2,
    momentumTrend: momentum.momentumTrendLabel,
    collapseRisk: fragility.collapseRiskLabel,
  });
  assert.ok(["balanced", "strained", "critical_imbalance", "recovering"].includes(label));
});

test("equilibrium signals derived from profiles", () => {
  const { topology, momentum, recovery, fragility } = buildFullStack();
  const profiles = buildRegionalEquilibriumProfiles({
    topology,
    momentumState: momentum,
    recoveryState: recovery,
    fragilityMap: fragility,
  });
  const signals = deriveEquilibriumSignalsFromProfiles(profiles);
  assert.ok(signals.length > 0);
  assert.ok(signals.every((s) => s.intensity >= 0 && s.intensity <= 1));
});
