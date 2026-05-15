import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { OperationalChangeSummary } from "../changeDetectionTypes.ts";
import type { OperationalMonitoringSnapshot } from "../monitoringTypes.ts";
import type { OperationalPropagationPreview } from "../propagationPreviewTypes.ts";
import type { SceneJson } from "../../sceneTypes.ts";
import { deriveOperationalRiskImpactMap } from "../deriveOperationalRiskImpactMap.ts";
import { maxOperationalExposureLevel } from "../riskImpactScoring.ts";

function mon(overrides: Partial<OperationalMonitoringSnapshot>): OperationalMonitoringSnapshot {
  return {
    id: "m",
    status: overrides.status ?? "degraded",
    trend: overrides.trend ?? "degrading",
    signals: overrides.signals ?? [],
    affectedObjectIds: overrides.affectedObjectIds ?? [],
    summary: "",
    recommendedFocus: "",
    updatedAt: "t",
    ...(overrides.topRiskObjectId ? { topRiskObjectId: overrides.topRiskObjectId } : {}),
  };
}

describe("deriveOperationalRiskImpactMap", () => {
  it("handles empty / null inputs safely", () => {
    const a = deriveOperationalRiskImpactMap(null);
    assert.equal(a.nodes.length, 0);
    const b = deriveOperationalRiskImpactMap({
      monitoringSnapshot: null,
      operationalChangeSummary: null,
      propagationPreview: null,
      sceneJson: null,
      now: 1,
    });
    assert.equal(b.nodes.length, 0);
    assert.ok(b.executiveRiskHeadline.length > 0);
  });

  it("derives exposure levels and highest exposure", () => {
    const scene: SceneJson = {
      state_vector: {},
      scene: {
        objects: [
          { id: "inv", label: "Inventory", scanner_emphasis: 0.55 },
          { id: "prod", label: "Production" },
        ],
        loops: [{ id: "l", type: "delivery_customer", edges: [{ from: "inv", to: "prod" }] }],
      },
    };
    const monitoring = mon({
      affectedObjectIds: ["inv"],
      signals: [
        {
          id: "s1",
          sourceId: "c",
          label: "L",
          severity: 0.88,
          trend: "degrading",
          message: "m",
          objectId: "inv",
          detectedAt: "t",
          confidence: 0.5,
        },
      ],
    });
    const change: OperationalChangeSummary = {
      totalChanges: 2,
      criticalChanges: 1,
      worseningCount: 2,
      improvingCount: 0,
      stableCount: 0,
      affectedObjectIds: ["inv"],
      executiveSummary: "e",
      generatedAt: "t",
    };
    const propagation: OperationalPropagationPreview = {
      id: "p",
      sourceObjectIds: ["inv"],
      affectedObjectIds: ["inv", "prod"],
      propagationNodes: [
        {
          objectId: "prod",
          riskLevel: "high",
          propagationScore: 0.7,
          sourceObjectId: "inv",
          reason: "r",
          affectedByChangeIds: [],
          estimatedImpact: "i",
        },
      ],
      highestRiskLevel: "high",
      summary: "ps",
      generatedAt: "t",
    };
    const out = deriveOperationalRiskImpactMap({
      monitoringSnapshot: monitoring,
      operationalChangeSummary: change,
      propagationPreview: propagation,
      sceneJson: scene,
      now: 2,
    });
    assert.ok(out.nodes.length >= 1);
    assert.ok(["minimal", "elevated", "high", "critical"].includes(out.highestExposureLevel));
    const fromNodes = maxOperationalExposureLevel(out.nodes.map((n) => n.exposureLevel));
    assert.equal(out.highestExposureLevel, fromNodes);
  });

  it("dedupes affected object ids", () => {
    const out = deriveOperationalRiskImpactMap({
      monitoringSnapshot: mon({
        affectedObjectIds: ["a", "a"],
        signals: [{ id: "s", sourceId: "x", label: "L", severity: 0.5, trend: "stable", message: "m", objectId: "a", detectedAt: "t", confidence: 0.5 }],
      }),
      operationalChangeSummary: null,
      propagationPreview: null,
      sceneJson: { state_vector: {}, scene: { objects: [{ id: "a" }] } },
    });
    const u = [...new Set(out.affectedObjectIds)];
    assert.deepEqual(u, [...out.affectedObjectIds]);
  });

  it("merges fragility safely when scanner fields present", () => {
    const scene: SceneJson = {
      state_vector: {},
      scene: {
        objects: [{ id: "x", scanner_severity: "high" }],
      },
    };
    const out = deriveOperationalRiskImpactMap({
      monitoringSnapshot: mon({
        affectedObjectIds: ["x"],
        signals: [{ id: "s", sourceId: "c", label: "L", severity: 0.4, trend: "stable", message: "m", objectId: "x", detectedAt: "t", confidence: 0.5 }],
      }),
      operationalChangeSummary: null,
      propagationPreview: null,
      sceneJson: scene,
    });
    const n = out.nodes.find((nn) => nn.objectId === "x");
    assert.ok(n?.fragilityScore != null && n.fragilityScore > 0);
  });

  it("clamps operational components", () => {
    const out = deriveOperationalRiskImpactMap({
      monitoringSnapshot: mon({
        affectedObjectIds: ["z"],
        signals: [
          {
            id: "s",
            sourceId: "c",
            label: "L",
            severity: 99,
            trend: "volatile",
            message: "m",
            objectId: "z",
            detectedAt: "t",
            confidence: 0.5,
          },
        ],
      }),
      operationalChangeSummary: null,
      propagationPreview: null,
      sceneJson: { state_vector: {}, scene: { objects: [{ id: "z" }] } },
    });
    const n = out.nodes[0];
    assert.ok(n != null);
    assert.ok(n.operationalSeverity >= 0 && n.operationalSeverity <= 1);
    assert.ok(n.propagationScore >= 0 && n.propagationScore <= 1);
  });

  it("does not mutate scene input", () => {
    const scene: SceneJson = {
      state_vector: {},
      scene: { objects: [{ id: "a", scanner_emphasis: 0.3 }] },
    };
    const sig = JSON.stringify(scene);
    deriveOperationalRiskImpactMap({
      monitoringSnapshot: mon({ affectedObjectIds: ["a"], signals: [] }),
      operationalChangeSummary: null,
      propagationPreview: null,
      sceneJson: scene,
    });
    assert.equal(JSON.stringify(scene), sig);
  });

  it("executive headline is non-empty and stable-ish", () => {
    const out = deriveOperationalRiskImpactMap({
      monitoringSnapshot: mon({
        affectedObjectIds: ["q"],
        signals: [{ id: "s", sourceId: "c", label: "L", severity: 0.9, trend: "degrading", message: "m", objectId: "q", detectedAt: "t", confidence: 0.5 }],
      }),
      operationalChangeSummary: null,
      propagationPreview: null,
      sceneJson: { state_vector: {}, scene: { objects: [{ id: "q", label: "Queue" }] } },
    });
    assert.ok(out.executiveRiskHeadline.length > 8);
    assert.ok(!/\bNaN\b/.test(out.executiveRiskHeadline));
  });
});
