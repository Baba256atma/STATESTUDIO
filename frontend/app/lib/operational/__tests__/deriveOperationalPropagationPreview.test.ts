import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { OperationalChangeSummary } from "../changeDetectionTypes.ts";
import type { OperationalMonitoringSnapshot } from "../monitoringTypes.ts";
import type { SceneJson } from "../../sceneTypes.ts";
import { deriveOperationalPropagationPreview } from "../deriveOperationalPropagationPreview.ts";

function snap(overrides: Partial<OperationalMonitoringSnapshot>): OperationalMonitoringSnapshot {
  return {
    id: "m1",
    status: overrides.status ?? "watching",
    trend: overrides.trend ?? "stable",
    signals: overrides.signals ?? [],
    affectedObjectIds: overrides.affectedObjectIds ?? [],
    summary: "",
    recommendedFocus: "",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...(overrides.topRiskObjectId ? { topRiskObjectId: overrides.topRiskObjectId } : {}),
  };
}

describe("deriveOperationalPropagationPreview", () => {
  it("handles empty / null inputs safely", () => {
    const a = deriveOperationalPropagationPreview(null);
    assert.equal(a.propagationNodes.length, 0);
    const b = deriveOperationalPropagationPreview({
      monitoringSnapshot: null,
      operationalChangeSummary: null,
      sceneJson: null,
      now: 1,
    });
    assert.equal(b.propagationNodes.length, 0);
    assert.ok(typeof b.summary === "string");
  });

  it("detects connected objects via loop edges and dependencies", () => {
    const scene: SceneJson = {
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
            edges: [
              { from: "production_line", to: "inventory_cluster", weight: 1.1 },
            ],
          },
        ],
      },
    };
    const monitoring = snap({
      affectedObjectIds: ["machine_a"],
      signals: [{ id: "s1", sourceId: "x", label: "L", severity: 0.82, trend: "degrading", message: "m", detectedAt: "t", confidence: 0.5 }],
    });
    const changes: OperationalChangeSummary = {
      totalChanges: 2,
      criticalChanges: 0,
      worseningCount: 2,
      improvingCount: 0,
      stableCount: 0,
      affectedObjectIds: ["machine_a"],
      executiveSummary: "e",
      generatedAt: "t",
    };
    const out = deriveOperationalPropagationPreview({
      monitoringSnapshot: monitoring,
      operationalChangeSummary: changes,
      sceneJson: scene,
      now: 2,
    });
    const ids = new Set(out.propagationNodes.map((n) => n.objectId));
    assert.ok(ids.has("production_line"));
    assert.ok(ids.has("inventory_cluster"));
  });

  it("clamps propagation scores between 0 and 1", () => {
    const scene: SceneJson = {
      state_vector: {},
      scene: {
        objects: [
          { id: "a", dependencies: ["b"] },
          { id: "b" },
        ],
      },
    };
    const monitoring = snap({
      affectedObjectIds: ["a"],
      status: "critical",
      signals: [
        {
          id: "s",
          sourceId: "c",
          label: "L",
          severity: 5,
          trend: "volatile",
          message: "m",
          detectedAt: "t",
          confidence: 0.5,
        },
      ],
    });
    const out = deriveOperationalPropagationPreview({
      monitoringSnapshot: monitoring,
      operationalChangeSummary: null,
      sceneJson: scene,
      now: 3,
    });
    for (const n of out.propagationNodes) {
      assert.ok(n.propagationScore >= 0 && n.propagationScore <= 1);
    }
  });

  it("derives highest risk level from nodes", () => {
    const scene: SceneJson = {
      state_vector: {},
      scene: {
        objects: [{ id: "x" }, { id: "y" }],
        loops: [{ id: "l", type: "risk_ignorance", edges: [{ from: "x", to: "y" }] }],
      },
    };
    const monitoring = snap({
      affectedObjectIds: ["x"],
      signals: [
        { id: "s", sourceId: "c", label: "L", severity: 0.95, trend: "degrading", message: "m", detectedAt: "t", confidence: 0.5 },
      ],
    });
    const out = deriveOperationalPropagationPreview({
      monitoringSnapshot: monitoring,
      operationalChangeSummary: null,
      sceneJson: scene,
      now: 4,
    });
    assert.ok(["low", "medium", "high", "critical"].includes(out.highestRiskLevel));
    if (out.propagationNodes.length > 0) {
      assert.equal(out.highestRiskLevel, out.propagationNodes[0]!.riskLevel);
    }
  });

  it("dedupes affected object ids", () => {
    const scene: SceneJson = {
      state_vector: {},
      scene: {
        objects: [{ id: "a", dependencies: ["b"] }, { id: "b" }],
      },
    };
    const monitoring = snap({
      affectedObjectIds: ["a", "a"],
      signals: [],
    });
    const out = deriveOperationalPropagationPreview({
      monitoringSnapshot: monitoring,
      operationalChangeSummary: null,
      sceneJson: scene,
      now: 5,
    });
    const u = [...new Set(out.affectedObjectIds)];
    assert.deepEqual(u, [...out.affectedObjectIds]);
  });

  it("generates stable summary string", () => {
    const scene: SceneJson = {
      state_vector: {},
      scene: { objects: [{ id: "only" }] },
    };
    const monitoring = snap({ affectedObjectIds: ["only"], signals: [] });
    const out = deriveOperationalPropagationPreview({
      monitoringSnapshot: monitoring,
      operationalChangeSummary: null,
      sceneJson: scene,
      now: 6,
    });
    assert.ok(out.summary.length > 10);
    assert.ok(!/\bNaN\b/.test(out.summary));
  });

  it("does not mutate scene input", () => {
    const scene: SceneJson = {
      state_vector: {},
      scene: {
        objects: [{ id: "a", dependencies: ["b"] }, { id: "b" }],
        loops: [{ id: "l", type: "delivery_customer", edges: [{ from: "a", to: "b" }] }],
      },
    };
    const frozen = JSON.stringify(scene);
    deriveOperationalPropagationPreview({
      monitoringSnapshot: snap({ affectedObjectIds: ["a"] }),
      operationalChangeSummary: null,
      sceneJson: scene,
    });
    assert.equal(JSON.stringify(scene), frozen);
  });
});
