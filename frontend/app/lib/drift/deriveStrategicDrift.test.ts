import assert from "node:assert/strict";
import test from "node:test";
import {
  buildStrategicDriftOverlayState,
  deriveStrategicDriftSignals,
} from "./deriveStrategicDrift.ts";

test("strategic drift derives from prior stabilization and renewed propagation", () => {
  const previousForecasts = [{
    id: "forecast_supplier_improving",
    title: "Supplier improving",
    summary: "Supplier pathway improving.",
    direction: "improving" as const,
    relatedObjectIds: ["supplier", "inventory", "delivery"],
    confidence: 0.82,
    domainIds: ["supply_chain"],
    createdAt: 0,
  }];
  const currentForecasts = [{
    id: "forecast_supplier_degrading",
    title: "Supplier degrading",
    summary: "Supplier pressure returned.",
    direction: "degrading" as const,
    relatedObjectIds: ["supplier", "inventory", "delivery"],
    confidence: 0.8,
    domainIds: ["supply_chain"],
    createdAt: 0,
  }];
  const fragilityZones = [{
    id: "zone_supplier_delivery",
    title: "Supplier delivery corridor",
    summary: "Supplier pressure returned.",
    zoneType: "critical_corridor" as const,
    relatedObjectIds: ["supplier", "inventory", "delivery"],
    propagationIntensity: 0.86,
    fragilityScore: 82,
    systemicReach: 0.78,
    domainIds: ["supply_chain"],
    createdAt: 0,
  }];

  const signals = deriveStrategicDriftSignals({
    forecasts: currentForecasts,
    previousForecasts,
    fragilityZones,
  });

  assert.ok(signals.length >= 1);
  assert.equal(signals[0].relatedObjectIds.includes("supplier"), true);
  assert.ok(signals[0].driftIntensity > 0.5);
  assert.ok(signals.some((signal) => signal.driftType === "propagation_expansion" || signal.driftType === "stability_regression"));
});

test("strategic drift derivation is deterministic and does not mutate input", () => {
  const params = {
    forecasts: [{
      id: "forecast_uncertain",
      title: "Uncertain",
      summary: "Mixed evidence.",
      direction: "uncertain" as const,
      relatedObjectIds: ["database", "service"],
      confidence: 0.62,
      uncertaintyFactors: ["Propagation patterns remain volatile", "Monitoring history is too short"],
      createdAt: 0,
    }],
    monitoringSignals: [{
      id: "monitoring_service",
      title: "Service monitoring",
      summary: "Service monitoring degraded.",
      relatedObjectIds: ["database", "service"],
      monitoringStatus: "elevated" as const,
      trend: "degrading" as const,
      confidence: 0.74,
      urgencyScore: 0.75,
      createdAt: 0,
    }],
  };
  const before = JSON.stringify(params);

  const first = deriveStrategicDriftSignals(params);
  const second = deriveStrategicDriftSignals(params);

  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(params), before);
});

test("strategic drift overlay is passive and empty state is safe", () => {
  const empty = buildStrategicDriftOverlayState({ signals: [] });
  assert.equal(empty.driftIntensity, 0);
  assert.equal(empty.relatedObjectIds.length, 0);

  const overlay = buildStrategicDriftOverlayState({
    signals: [{
      id: "strategic_drift_monitoring_supplier",
      title: "Monitoring Gap: supplier",
      summary: "Operational visibility may be degrading across supplier.",
      driftType: "monitoring_gap",
      relatedObjectIds: ["supplier"],
      driftIntensity: 0.7,
      createdAt: 0,
    }],
  });

  assert.equal(overlay.topSignalId, "strategic_drift_monitoring_supplier");
  assert.equal(overlay.driftType, "monitoring_gap");
});
