import test from "node:test";
import assert from "node:assert/strict";

import { attachAnalyzeIntelligenceBinding } from "./analyzeIntelligenceBindingBridge.ts";
import { ANALYZE_WORKSPACE_MODULES } from "./analyzeModeContract.ts";

const SAMPLE_SCENE = {
  scene: {
    objects: [
      {
        id: "supplier-1",
        label: "Primary Supplier",
        type: "supplier",
        active: false,
        sourceConfidence: 15,
      },
    ],
    relationships: [],
    kpis: [{ id: "revenue", label: "Revenue", category: "Revenue", value: 80, target: 100 }],
    risks: [{ id: "delay-risk", label: "Delay Risk", severity: 75 }],
  },
};

test("object selected flows through analyze binding to intelligence readout", () => {
  const context = attachAnalyzeIntelligenceBinding(
    Object.freeze({
      objectId: "supplier-1",
      objectName: "Primary Supplier",
      analysisStatus: "ready",
      analysisStatusLabel: "Ready",
      modules: ANALYZE_WORKSPACE_MODULES,
      intelligence: null,
      executiveSummary: null,
    }),
    { objectId: "supplier-1", sceneJson: SAMPLE_SCENE }
  );

  assert.ok(context);
  assert.equal(context.objectId, "supplier-1");
  assert.ok(context.intelligence);
  assert.equal(context.intelligence?.objectId, "supplier-1");
  assert.ok(context.intelligence?.healthScore >= 0);
  assert.ok(context.intelligence?.intelligenceSummary.includes("Analyze binding"));
  assert.ok(context.executiveSummary);
  assert.equal(context.executiveSummary?.summaryReady, true);
  assert.ok(context.executiveSummary?.impactLabel.length > 0);
  assert.ok(context.executiveSummary?.confidenceLabel.length >= 0);
  assert.ok(context.executiveSummary?.scenarioSummaryLabel.length > 0);
  assert.ok(context.executiveSummary?.trendLabel.length > 0);
});

test("returns null when analyze context is missing", () => {
  assert.equal(attachAnalyzeIntelligenceBinding(null, { objectId: null }), null);
});
