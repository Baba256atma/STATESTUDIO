import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_RISK_CRITICAL_HOTSPOT_CAP,
  SVIE_RISK_HOTSPOTS_LOG,
  SVIE_RISK_HOTSPOT_VISUALIZATION_TAG,
} from "./svieRiskHotspotVisualizationContract.ts";
import {
  buildSvieRiskHotspotVisualizationSnapshot,
  mapSvieRiskLevelToHotspotVisualStyle,
  resolveEffectiveRiskHotspotLevels,
} from "./svieRiskHotspotVisualizationResolver.ts";
import {
  resetSvieRiskHotspotVisualizationRuntimeForTests,
  syncSvieRiskHotspotVisualization,
} from "./svieRiskHotspotVisualizationRuntime.ts";
import { resetSvieRiskRuntimeForTests } from "./svieRiskRuntime.ts";
import { resetSvieRuntimeFoundationForTests } from "./svieRuntimeFoundation.ts";
import { resetSviePhase1CertificationForTests, runSviePhase1Certification } from "./sviePhase1Certification.ts";
import type { SvieRiskState } from "./svieRiskRuntimeContract.ts";

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieRiskRuntimeForTests();
  resetSvieRiskHotspotVisualizationRuntimeForTests();
  resetSviePhase1CertificationForTests();
});

test("exports SVIE risk hotspot tag", () => {
  assert.equal(SVIE_RISK_HOTSPOT_VISUALIZATION_TAG, "[SVIE:2:2_RISK_HOTSPOT]");
});

test("A — maps risk levels to visible hotspot overlays", () => {
  const low = mapSvieRiskLevelToHotspotVisualStyle({
    riskLevel: "low",
    effectiveLevel: "low",
    riskScore: 0,
  });
  const medium = mapSvieRiskLevelToHotspotVisualStyle({
    riskLevel: "medium",
    effectiveLevel: "medium",
    riskScore: 30,
  });
  const high = mapSvieRiskLevelToHotspotVisualStyle({
    riskLevel: "high",
    effectiveLevel: "high",
    riskScore: 60,
  });
  const critical = mapSvieRiskLevelToHotspotVisualStyle({
    riskLevel: "critical",
    effectiveLevel: "critical",
    riskScore: 90,
  });

  assert.equal(low.showOverlay, false);
  assert.equal(medium.showOverlay, true);
  assert.equal(medium.showOutline, true);
  assert.equal(medium.pulseEnabled, false);
  assert.equal(high.showOverlay, true);
  assert.equal(high.pulseEnabled, true);
  assert.equal(high.haloEnabled, false);
  assert.equal(critical.showOverlay, true);
  assert.equal(critical.pulseEnabled, true);
  assert.equal(critical.haloEnabled, true);
});

test("caps critical hotspot highlights to top 3 by risk score", () => {
  const objects: SvieRiskState[] = [
    { objectId: "a", riskScore: 95, riskLevel: "critical" },
    { objectId: "b", riskScore: 88, riskLevel: "critical" },
    { objectId: "c", riskScore: 80, riskLevel: "critical" },
    { objectId: "d", riskScore: 78, riskLevel: "critical" },
    { objectId: "e", riskScore: 76, riskLevel: "critical" },
  ];

  const snapshot = buildSvieRiskHotspotVisualizationSnapshot({
    objects,
    sceneSignature: "test",
    generatedAt: Date.now(),
  });

  assert.equal(snapshot.criticalCount, 5);
  assert.equal(snapshot.highlightedCount, SVIE_RISK_CRITICAL_HOTSPOT_CAP);
  assert.equal(snapshot.visualByObjectId.a?.effectiveLevel, "critical");
  assert.equal(snapshot.visualByObjectId.d?.effectiveLevel, "high");
  assert.equal(snapshot.visualByObjectId.d?.haloEnabled, false);
  assert.equal(snapshot.visualByObjectId.e?.pulseEnabled, true);

  const effective = resolveEffectiveRiskHotspotLevels(objects);
  assert.equal(effective.get("a"), "critical");
  assert.equal(effective.get("d"), "high");
});

test("B/E — sync dedupes scene signatures for responsive recompute budget", () => {
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const sceneJson = {
      scene: {
        objects: [
          { id: "line-1", risk: 0.82 },
          { id: "line-2", risk: 0.52 },
          { id: "line-3", risk: 0.28 },
        ],
      },
    };

    const first = syncSvieRiskHotspotVisualization({ sceneJson });
    const second = syncSvieRiskHotspotVisualization({ sceneJson });

    assert.equal(first, second);
    assert.equal(first.objectCount, 3);
    assert.equal(logs.filter((entry) => entry === SVIE_RISK_HOTSPOTS_LOG).length, 1);

    for (let index = 0; index < 20; index += 1) {
      assert.equal(syncSvieRiskHotspotVisualization({ sceneJson }), first);
    }
  } finally {
    console.debug = originalDebug;
  }
});

test("C — hotspot styles never encode position, scale, or rotation writes", () => {
  const style = mapSvieRiskLevelToHotspotVisualStyle({
    riskLevel: "critical",
    effectiveLevel: "critical",
    riskScore: 92,
  });
  const keys = Object.keys(style);
  assert.ok(!keys.some((key) => /position|scale|rotation|transform/i.test(key)));
});

test("D — SVIE phase 1 certification reports no MRP lifecycle regressions", () => {
  const result = runSviePhase1Certification({ force: true });
  assert.equal(result.certified, true);
  for (const gate of result.gates) {
    assert.notEqual(gate.status, "FAIL", `${gate.id}: ${gate.detail}`);
  }
});
