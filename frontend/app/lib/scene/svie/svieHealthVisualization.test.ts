import test from "node:test";
import assert from "node:assert/strict";

import { deriveSvieObjectHealthLevel } from "./svieHealthDerivation.ts";
import {
  SVIE_HEALTH_COMPUTED_LOG,
  SVIE_HEALTH_VISUAL_PALETTE,
} from "./svieHealthVisualizationContract.ts";
import { mapSvieHealthLevelToVisualStyle } from "./svieHealthVisualizationResolver.ts";
import {
  buildSvieSceneSignature,
  resetSvieHealthVisualizationRuntimeForTests,
  syncSvieHealthVisualization,
} from "./svieHealthVisualizationRuntime.ts";
import { resetSvieRuntimeFoundationForTests } from "./svieRuntimeFoundation.ts";

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieHealthVisualizationRuntimeForTests();
});

test("derives health from MVP impact risk confidence status fields", () => {
  assert.equal(
    deriveSvieObjectHealthLevel({ id: "a", risk: 0.8, impact: 0.2, confidence: 0.4, status: "ok" }),
    "critical"
  );
  assert.equal(
    deriveSvieObjectHealthLevel({ id: "b", risk: 0.5, impact: 0.4, confidence: 0.4, status: "watch" }),
    "warning"
  );
  assert.equal(
    deriveSvieObjectHealthLevel({ id: "c", risk: 0.1, impact: 0.2, confidence: 0.8, status: "opportunity" }),
    "opportunity"
  );
  assert.equal(deriveSvieObjectHealthLevel({ id: "d", label: "plain" }), "healthy");
});

test("maps health levels to soft glow palette colors", () => {
  const healthy = mapSvieHealthLevelToVisualStyle("healthy");
  const warning = mapSvieHealthLevelToVisualStyle("warning");
  const critical = mapSvieHealthLevelToVisualStyle("critical");
  const opportunity = mapSvieHealthLevelToVisualStyle("opportunity");

  assert.equal(healthy.glowColor, SVIE_HEALTH_VISUAL_PALETTE.healthy.glowColor);
  assert.equal(warning.glowColor, SVIE_HEALTH_VISUAL_PALETTE.warning.glowColor);
  assert.equal(critical.glowColor, SVIE_HEALTH_VISUAL_PALETTE.critical.glowColor);
  assert.equal(opportunity.glowColor, SVIE_HEALTH_VISUAL_PALETTE.opportunity.glowColor);
  assert.equal(healthy.showGlowLayer, true);
});

test("sync computes once per scene signature and logs HealthComputed", () => {
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const sceneJson = {
      scene: {
        objects: [
          { id: "line-1", risk: 0.8 },
          { id: "line-2", confidence: 0.85, risk: 0.1, status: "opportunity" },
          { id: "line-3" },
        ],
      },
    };

    const first = syncSvieHealthVisualization({ sceneJson });
    const second = syncSvieHealthVisualization({ sceneJson });

    assert.equal(first, second);
    assert.equal(first.objectCount, 3);
    assert.equal(first.criticalCount, 1);
    assert.equal(first.opportunityCount, 1);
    assert.equal(first.healthyCount, 1);
    assert.equal(first.visualByObjectId["line-1"]?.healthLevel, "critical");
    assert.equal(logs.filter((entry) => entry === SVIE_HEALTH_COMPUTED_LOG).length, 1);

    const signature = buildSvieSceneSignature(sceneJson);
    syncSvieHealthVisualization({
      sceneJson: {
        scene: {
          objects: [{ id: "line-1", risk: 0.9 }],
        },
      },
    });
    assert.notEqual(buildSvieSceneSignature({ scene: { objects: [{ id: "line-1", risk: 0.9 }] } }), signature);
  } finally {
    console.debug = originalDebug;
  }
});

test("scene signature changes trigger a single recomputation", () => {
  const first = syncSvieHealthVisualization({
    sceneJson: { scene: { objects: [{ id: "a", status: "ok" }] } },
  });
  const second = syncSvieHealthVisualization({
    sceneJson: { scene: { objects: [{ id: "a", status: "critical" }] } },
  });
  assert.notEqual(first.sceneSignature, second.sceneSignature);
  assert.equal(second.criticalCount, 1);
});
