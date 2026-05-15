import test from "node:test";
import assert from "node:assert/strict";
import type { SceneJson } from "../../sceneTypes.ts";
import type { NormalizedExternalOperationalSignal } from "../../connectors/externalSignalTypes.ts";
import { deriveOperationalMonitoringSnapshot } from "../deriveMonitoringSnapshot.ts";
import { detectOperationalChanges } from "../detectOperationalChanges.ts";
import { deriveOperationalPropagationPreview } from "../deriveOperationalPropagationPreview.ts";
import { deriveOperationalRiskImpactMap } from "../deriveOperationalRiskImpactMap.ts";
import { evaluateOperationalAlerts } from "../evaluateOperationalAlerts.ts";
import { defaultOperationalAlertRules } from "../defaultOperationalAlertRules.ts";
import {
  buildD3MonitoringSignature,
  buildOperationalAlertSignature,
  buildOperationalChangeSignature,
  buildOperationalRiskSignature,
  buildPropagationSignature,
  compareD3Signatures,
} from "../d3SignatureDeduplication.ts";
import { clampOperationalArraySize, safeOperationalTraversalLimit } from "../d3StabilityGuards.ts";
import type { OperationalMonitoringSnapshot } from "../monitoringTypes.ts";
import type { OperationalChangeSummary } from "../changeDetectionTypes.ts";

const T = "2026-05-10T10:00:00.000Z";

function freeze<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function baseSnapshot(): OperationalMonitoringSnapshot {
  return {
    id: "m-smoke",
    status: "degraded",
    trend: "degrading",
    signals: [
      {
        id: "sig-1",
        sourceId: "conn-a",
        objectId: "machine_a",
        label: "Stress",
        severity: 0.62,
        trend: "degrading",
        message: "m",
        detectedAt: T,
        confidence: 0.7,
      },
    ],
    affectedObjectIds: ["machine_a"],
    topRiskObjectId: "machine_a",
    summary: "Operational pressure",
    recommendedFocus: "Watch connectivity",
    updatedAt: T,
  };
}

function baseChange(s: OperationalMonitoringSnapshot): OperationalChangeSummary {
  return detectOperationalChanges({ previousSnapshot: null, currentSnapshot: s });
}

function chainScene(): SceneJson {
  return {
    state_vector: {},
    scene: {
      objects: [
        { id: "machine_a", label: "Machine", dependencies: ["production_line"] },
        { id: "production_line", label: "Line" },
        { id: "inventory_cluster", label: "Inventory" },
      ],
      loops: [
        {
          id: "loop1",
          type: "delivery_customer",
          edges: [{ from: "production_line", to: "inventory_cluster", weight: 1 }],
        },
      ],
    },
  };
}

test("D3 pipeline: repeated identical inputs are deterministic", () => {
  const snap = baseSnapshot();
  const ch = baseChange(snap);
  const scene = chainScene();
  const prop1 = deriveOperationalPropagationPreview({
    monitoringSnapshot: snap,
    operationalChangeSummary: ch,
    sceneJson: scene,
    now: 42,
  });
  const prop2 = deriveOperationalPropagationPreview({
    monitoringSnapshot: snap,
    operationalChangeSummary: ch,
    sceneJson: scene,
    now: 42,
  });
  assert.equal(buildPropagationSignature(prop1), buildPropagationSignature(prop2));

  const risk1 = deriveOperationalRiskImpactMap({
    monitoringSnapshot: snap,
    operationalChangeSummary: ch,
    propagationPreview: prop1,
    sceneJson: scene,
    now: 42,
  });
  const risk2 = deriveOperationalRiskImpactMap({
    monitoringSnapshot: snap,
    operationalChangeSummary: ch,
    propagationPreview: prop2,
    sceneJson: scene,
    now: 42,
  });
  assert.equal(buildOperationalRiskSignature(risk1), buildOperationalRiskSignature(risk2));

  const alerts1 = evaluateOperationalAlerts({
    monitoringSnapshot: snap,
    operationalChangeSummary: ch,
    propagationPreview: prop1,
    operationalRiskImpactMap: risk1,
    rules: defaultOperationalAlertRules,
  });
  const alerts2 = evaluateOperationalAlerts({
    monitoringSnapshot: snap,
    operationalChangeSummary: ch,
    propagationPreview: prop2,
    operationalRiskImpactMap: risk2,
    rules: defaultOperationalAlertRules,
  });
  assert.equal(buildOperationalAlertSignature(alerts1), buildOperationalAlertSignature(alerts2));
});

test("D3 pipeline: no mutation across pipelines", () => {
  const snap = freeze(baseSnapshot());
  const scene = freeze(chainScene());
  const ch = freeze(baseChange(snap));
  const snapCopy = freeze(snap);
  const sceneCopy = freeze(scene);
  const chCopy = freeze(ch);
  const prop = deriveOperationalPropagationPreview({
    monitoringSnapshot: snap,
    operationalChangeSummary: ch,
    sceneJson: scene,
  });
  const risk = deriveOperationalRiskImpactMap({
    monitoringSnapshot: snap,
    operationalChangeSummary: ch,
    propagationPreview: prop,
    sceneJson: scene,
  });
  evaluateOperationalAlerts({
    monitoringSnapshot: snap,
    operationalChangeSummary: ch,
    propagationPreview: prop,
    operationalRiskImpactMap: risk,
    rules: defaultOperationalAlertRules,
  });
  assert.deepEqual(snap, snapCopy);
  assert.deepEqual(scene, sceneCopy);
  assert.deepEqual(ch, chCopy);
});

test("D3 signatures: compareD3Signatures ordering stable", () => {
  assert.equal(compareD3Signatures("a", "b"), -1);
  assert.equal(compareD3Signatures("b", "a"), 1);
  assert.equal(compareD3Signatures("x", "x"), 0);
});

test("D3 monitoring snapshot pipeline stable", () => {
  const records: NormalizedExternalOperationalSignal[] = [
    {
      id: "r1",
      sourceConnectorId: "c1",
      signalType: "latency_risk",
      severity: 0.55,
      timestamp: 1_700_000_000,
      objectHints: ["a"],
      domainHints: ["general"],
      ingestionSignature: "sig-r1",
    },
  ];
  const a = deriveOperationalMonitoringSnapshot({ records, now: 1_700_000_000 });
  const b = deriveOperationalMonitoringSnapshot({ records, now: 1_700_000_000 });
  assert.equal(buildD3MonitoringSignature(a), buildD3MonitoringSignature(b));
});

test("operational change signature stable for same summary", () => {
  const s: OperationalChangeSummary = {
    totalChanges: 1,
    criticalChanges: 0,
    worseningCount: 1,
    improvingCount: 0,
    stableCount: 0,
    affectedObjectIds: ["x"],
    executiveSummary: "e",
    generatedAt: T,
  };
  assert.equal(buildOperationalChangeSignature(s), buildOperationalChangeSignature({ ...s }));
});

test("empty inputs safe across derivations", () => {
  const prop = deriveOperationalPropagationPreview(null);
  const risk = deriveOperationalRiskImpactMap(null);
  const alerts = evaluateOperationalAlerts({
    monitoringSnapshot: null,
    operationalChangeSummary: null,
    propagationPreview: null,
    operationalRiskImpactMap: null,
    rules: [],
  });
  assert.ok(prop.id);
  assert.ok(risk.id);
  assert.equal(alerts.alerts.length, 0);
});

test("large arrays clamp safely", () => {
  const arr = Array.from({ length: 500 }, (_, i) => i);
  const clamped = clampOperationalArraySize(arr, 40);
  assert.equal(clamped.length, 40);
  assert.equal(safeOperationalTraversalLimit(9999, 50), 50);
});
