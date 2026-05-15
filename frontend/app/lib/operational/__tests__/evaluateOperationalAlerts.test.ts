import test from "node:test";
import assert from "node:assert/strict";
import { evaluateOperationalAlerts, topOperationalAlert } from "../evaluateOperationalAlerts.ts";
import { defaultOperationalAlertRules } from "../defaultOperationalAlertRules.ts";
import type { OperationalMonitoringSnapshot } from "../monitoringTypes.ts";
import type { OperationalChangeSummary } from "../changeDetectionTypes.ts";
import type { OperationalPropagationPreview } from "../propagationPreviewTypes.ts";
import type { OperationalRiskImpactMap } from "../riskImpactTypes.ts";
import { buildOperationalAlertRecordSignature, dedupeOperationalAlerts } from "../alertDeduplication.ts";
import type { OperationalAlertRecord } from "../alertRuleTypes.ts";

const BASE_TIME = "2026-05-01T12:00:00.000Z";

function freeze<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

test("evaluateOperationalAlerts handles empty inputs safely", () => {
  const r = evaluateOperationalAlerts({
    monitoringSnapshot: null,
    operationalChangeSummary: null,
    propagationPreview: null,
    operationalRiskImpactMap: null,
    rules: [],
  });
  assert.equal(r.alerts.length, 0);
  assert.equal(r.criticalAlertCount, 0);
  assert.equal(r.warningAlertCount, 0);
  assert.equal(r.triggeredRuleIds.length, 0);
  assert.ok(r.generatedAt);
});

test("critical signal severity triggers critical alert", () => {
  const snap: OperationalMonitoringSnapshot = {
    id: "m1",
    status: "degraded",
    trend: "degrading",
    signals: [
      {
        id: "s1",
        sourceId: "src",
        objectId: "obj-a",
        label: "Latency",
        severity: 0.95,
        trend: "degrading",
        message: "High",
        detectedAt: BASE_TIME,
        confidence: 0.8,
      },
    ],
    affectedObjectIds: ["obj-a"],
    topRiskObjectId: "obj-a",
    summary: "Stress",
    recommendedFocus: "Watch",
    updatedAt: BASE_TIME,
  };
  const rules = defaultOperationalAlertRules.filter((x) => x.id === "default_signal_severity_critical");
  const r = evaluateOperationalAlerts({
    monitoringSnapshot: snap,
    operationalChangeSummary: null,
    propagationPreview: null,
    operationalRiskImpactMap: null,
    rules,
  });
  assert.ok(r.alerts.some((a) => a.severity === "critical" && a.ruleId === "default_signal_severity_critical"));
  assert.ok(r.criticalAlertCount >= 1);
});

test("propagation threshold triggers alert", () => {
  const preview: OperationalPropagationPreview = {
    id: "p1",
    sourceObjectIds: ["src-1"],
    affectedObjectIds: ["down-1"],
    propagationNodes: [
      {
        objectId: "down-1",
        riskLevel: "high",
        propagationScore: 0.7,
        sourceObjectId: "src-1",
        reason: "Cascade",
        affectedByChangeIds: [],
        estimatedImpact: "Medium",
      },
    ],
    highestRiskLevel: "high",
    summary: "Propagation",
    generatedAt: BASE_TIME,
  };
  const rules = defaultOperationalAlertRules.filter((x) => x.id === "default_propagation_stress_high");
  const r = evaluateOperationalAlerts({
    monitoringSnapshot: null,
    operationalChangeSummary: null,
    propagationPreview: preview,
    operationalRiskImpactMap: null,
    rules,
  });
  assert.ok(r.alerts.some((a) => a.ruleId === "default_propagation_stress_high"));
});

test("operational degradation triggers on worsening count", () => {
  const summary: OperationalChangeSummary = {
    totalChanges: 5,
    criticalChanges: 0,
    worseningCount: 4,
    improvingCount: 0,
    stableCount: 1,
    affectedObjectIds: [],
    executiveSummary: "Delta",
    generatedAt: BASE_TIME,
  };
  const rules = defaultOperationalAlertRules.filter((x) => x.id === "default_operational_worsening");
  const r = evaluateOperationalAlerts({
    monitoringSnapshot: null,
    operationalChangeSummary: summary,
    propagationPreview: null,
    operationalRiskImpactMap: null,
    rules,
  });
  assert.ok(r.alerts.some((a) => a.ruleId === "default_operational_worsening"));
});

test("duplicate alerts dedupe correctly", () => {
  const t = BASE_TIME;
  const dupA: OperationalAlertRecord = {
    id: "a1",
    severity: "warning",
    ruleId: "r1",
    title: "T",
    message: "M",
    triggeredBy: "same",
    acknowledged: false,
    createdAt: t,
  };
  const dupB: OperationalAlertRecord = {
    id: "a2",
    severity: "critical",
    ruleId: "r1",
    title: "T",
    message: "M2",
    triggeredBy: "same",
    acknowledged: false,
    createdAt: t,
  };
  const out = dedupeOperationalAlerts([dupA, dupB]);
  assert.equal(out.length, 1);
  assert.equal(out[0]?.severity, "critical");
});

test("dedupe signature is stable", () => {
  const s1 = buildOperationalAlertRecordSignature({ ruleId: "rule", objectId: "obj", triggeredBy: "t" });
  const s2 = buildOperationalAlertRecordSignature({ ruleId: "rule", objectId: "obj", triggeredBy: "t" });
  assert.equal(s1, s2);
});

test("severity classification counts critical vs warning", () => {
  const snap: OperationalMonitoringSnapshot = {
    id: "m1",
    status: "critical",
    trend: "degrading",
    signals: [{ id: "s1", sourceId: "x", objectId: "o1", label: "L", severity: 0.95, trend: "degrading", message: "m", detectedAt: BASE_TIME, confidence: 0.5 }],
    affectedObjectIds: ["o1"],
    topRiskObjectId: "o1",
    summary: "Critical path",
    recommendedFocus: "Act",
    updatedAt: BASE_TIME,
  };
  const r = evaluateOperationalAlerts({
    monitoringSnapshot: snap,
    operationalChangeSummary: null,
    propagationPreview: null,
    operationalRiskImpactMap: null,
    rules: defaultOperationalAlertRules,
  });
  assert.ok(r.criticalAlertCount >= 1);
  assert.equal(typeof r.warningAlertCount, "number");
});

test("stable generated alert messages for same inputs", () => {
  const snap: OperationalMonitoringSnapshot = {
    id: "m1",
    status: "degraded",
    trend: "stable",
    signals: [{ id: "s1", sourceId: "x", objectId: "o1", label: "L", severity: 0.91, trend: "stable", message: "m", detectedAt: BASE_TIME, confidence: 0.5 }],
    affectedObjectIds: ["o1"],
    summary: "S",
    recommendedFocus: "F",
    updatedAt: BASE_TIME,
  };
  const a = evaluateOperationalAlerts({
    monitoringSnapshot: snap,
    operationalChangeSummary: null,
    propagationPreview: null,
    operationalRiskImpactMap: null,
    rules: defaultOperationalAlertRules.filter((x) => x.id === "default_signal_severity_critical"),
  });
  const b = evaluateOperationalAlerts({
    monitoringSnapshot: snap,
    operationalChangeSummary: null,
    propagationPreview: null,
    operationalRiskImpactMap: null,
    rules: defaultOperationalAlertRules.filter((x) => x.id === "default_signal_severity_critical"),
  });
  assert.deepEqual(
    a.alerts.map((x) => ({ title: x.title, message: x.message, triggeredBy: x.triggeredBy })),
    b.alerts.map((x) => ({ title: x.title, message: x.message, triggeredBy: x.triggeredBy }))
  );
});

test("no mutation of input objects", () => {
  const snap: OperationalMonitoringSnapshot = {
    id: "m1",
    status: "watching",
    trend: "stable",
    signals: [],
    affectedObjectIds: [],
    summary: "Ok",
    recommendedFocus: "—",
    updatedAt: BASE_TIME,
  };
  const map: OperationalRiskImpactMap = {
    id: "rim",
    nodes: [],
    highestExposureLevel: "minimal",
    affectedObjectIds: [],
    summary: "Low",
    executiveRiskHeadline: "Stable",
    generatedAt: BASE_TIME,
  };
  const snapCopy = freeze(snap);
  const mapCopy = freeze(map);
  evaluateOperationalAlerts({
    monitoringSnapshot: snap,
    operationalChangeSummary: null,
    propagationPreview: null,
    operationalRiskImpactMap: map,
    rules: defaultOperationalAlertRules,
  });
  assert.deepEqual(snap, snapCopy);
  assert.deepEqual(map, mapCopy);
});

test("topOperationalAlert prefers critical severity", () => {
  const t = BASE_TIME;
  const alerts: OperationalAlertRecord[] = [
    { id: "i1", severity: "info", ruleId: "a", title: "I", message: "m", triggeredBy: "i", acknowledged: false, createdAt: t },
    { id: "c1", severity: "critical", ruleId: "b", title: "C", message: "m", triggeredBy: "c", acknowledged: false, createdAt: t },
  ];
  const top = topOperationalAlert(alerts);
  assert.equal(top?.severity, "critical");
});
