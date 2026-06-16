import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_EXECUTIVE_ATTENTION_LOG,
  SVIE_EXECUTIVE_RISK_ATTENTION_TAG,
} from "./svieExecutiveRiskAttentionContract.ts";
import {
  deriveExecutiveAttentionScore,
  deriveExecutiveConfidenceWeight,
  deriveExecutiveImpactWeight,
  resolveExecutiveAttentionTier,
} from "./svieExecutiveRiskAttentionDerivation.ts";
import { buildSvieExecutiveRiskAttentionSnapshot } from "./svieExecutiveRiskAttentionResolver.ts";
import { applyExecutiveAttentionVisualGuidance } from "./svieExecutiveRiskAttentionVisualizationResolver.ts";
import {
  guardSvieExecutiveAttentionDashboardWrite,
  guardSvieExecutiveAttentionRouteWrite,
  guardSvieExecutiveAttentionWorkspaceWrite,
  resetSvieExecutiveRiskAttentionRuntimeForTests,
  syncSvieExecutiveRiskAttention,
} from "./svieExecutiveRiskAttentionRuntime.ts";
import { resetSviePhase1CertificationForTests, runSviePhase1Certification } from "./sviePhase1Certification.ts";
import { resetSvieRiskHotspotVisualizationRuntimeForTests } from "./svieRiskHotspotVisualizationRuntime.ts";
import { buildSvieRiskHotspotVisualizationSnapshot } from "./svieRiskHotspotVisualizationResolver.ts";
import { resetSvieRiskRuntimeForTests } from "./svieRiskRuntime.ts";
import { resetSvieRuntimeFoundationForTests } from "./svieRuntimeFoundation.ts";
import { generateTopology } from "../topology/topologyEngine.ts";
import { FLOW_NODE_SPACING } from "../topology/flowTopologyGenerator.ts";

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieRiskRuntimeForTests();
  resetSvieRiskHotspotVisualizationRuntimeForTests();
  resetSvieExecutiveRiskAttentionRuntimeForTests();
  resetSviePhase1CertificationForTests();
});

test("exports SVIE executive attention tag", () => {
  assert.equal(SVIE_EXECUTIVE_RISK_ATTENTION_TAG, "[SVIE:2:3_EXECUTIVE_RISK_ATTENTION]");
});

test("A — attention ranking is stable with score and objectId tie-break", () => {
  const sceneJson = {
    scene: {
      objects: [
        { id: "b-line", risk: 0.5, impact: 0.4, confidence: 0.4 },
        { id: "a-line", risk: 0.5, impact: 0.4, confidence: 0.4 },
        { id: "z-line", risk: 0.82, impact: 0.8, confidence: 0.4 },
      ],
    },
  };

  const first = syncSvieExecutiveRiskAttention({ sceneJson });
  const second = syncSvieExecutiveRiskAttention({ sceneJson });

  assert.deepEqual(first.top1, second.top1);
  assert.deepEqual(first.top3, second.top3);
  assert.deepEqual(first.top5, second.top5);
  assert.equal(first.topObjectId, "z-line");
  assert.equal(first.top3[0], "z-line");
  assert.equal(first.top3[1], "a-line");
  assert.equal(first.top3[2], "b-line");
  assert.equal(first.objects[1]?.objectId, "a-line");
  assert.equal(first.objects[2]?.objectId, "b-line");
});

test("attentionScore = riskScore × impactWeight × confidenceWeight", () => {
  const impactWeight = deriveExecutiveImpactWeight({ id: "x", impact: 0.8 });
  const confidenceWeight = deriveExecutiveConfidenceWeight({ id: "x", confidence: 0.4 });
  const score = deriveExecutiveAttentionScore({
    riskScore: 82,
    impactWeight,
    confidenceWeight,
  });

  assert.equal(impactWeight, 1.3);
  assert.equal(confidenceWeight, 1.05);
  assert.equal(score, 111.93);
  assert.equal(resolveExecutiveAttentionTier(1), "top1");
  assert.equal(resolveExecutiveAttentionTier(3), "top3");
  assert.equal(resolveExecutiveAttentionTier(5), "top5");
  assert.equal(resolveExecutiveAttentionTier(6), "normal");
});

test("B — same input returns cached snapshot", () => {
  const sceneJson = {
    scene: {
      objects: [{ id: "line-1", risk: 0.82, impact: 0.8, confidence: 0.4 }],
    },
  };
  const first = syncSvieExecutiveRiskAttention({ sceneJson });
  const second = syncSvieExecutiveRiskAttention({ sceneJson });
  assert.equal(first, second);
});

test("executive attention applies top1/top3/top5 pulse guidance", () => {
  const riskObjects = [
    { objectId: "o1", riskScore: 95, riskLevel: "critical" as const },
    { objectId: "o2", riskScore: 88, riskLevel: "critical" as const },
    { objectId: "o3", riskScore: 80, riskLevel: "critical" as const },
    { objectId: "o4", riskScore: 78, riskLevel: "critical" as const },
    { objectId: "o5", riskScore: 76, riskLevel: "critical" as const },
    { objectId: "o6", riskScore: 20, riskLevel: "low" as const },
  ];

  const attentionSnapshot = buildSvieExecutiveRiskAttentionSnapshot({
    riskObjects,
    sceneJson: {
      scene: {
        objects: riskObjects.map((entry) => ({
          id: entry.objectId,
          risk: entry.riskScore / 100,
          impact: 0.5,
          confidence: 0.5,
        })),
      },
    },
    sceneSignature: "attention-test",
    generatedAt: Date.now(),
  });

  const hotspotSnapshot = buildSvieRiskHotspotVisualizationSnapshot({
    objects: riskObjects,
    sceneSignature: "attention-test",
    generatedAt: Date.now(),
  });
  const visuals = applyExecutiveAttentionVisualGuidance(hotspotSnapshot, attentionSnapshot);

  assert.equal(visuals.o1?.executiveAttentionTier, "top1");
  assert.equal(visuals.o1?.executivePulseEnabled, true);
  assert.equal(visuals.o2?.executiveAttentionTier, "top3");
  assert.equal(visuals.o4?.executiveAttentionTier, "top5");
  assert.equal(visuals.o6?.executiveAttentionTier, "normal");
  assert.equal(visuals.o6?.executivePulseEnabled, false);
});

test("C — routing and workspace writes are blocked", () => {
  const route = guardSvieExecutiveAttentionRouteWrite({
    action: "requestWorkspaceLaunch",
    source: "svie-attention-test",
  });
  const workspace = guardSvieExecutiveAttentionWorkspaceWrite({
    action: "commitExecutiveWorkspaceTransition",
    source: "svie-attention-test",
  });
  const dashboard = guardSvieExecutiveAttentionDashboardWrite({
    action: "setDashboardMode",
    source: "svie-attention-test",
  });

  assert.equal(route.allowed, false);
  assert.equal(workspace.allowed, false);
  assert.equal(dashboard.allowed, false);
});

test("D — SVIE phase 1 certification reports no lifecycle regressions", () => {
  const result = runSviePhase1Certification({ force: true });
  assert.equal(result.certified, true);
  for (const gate of result.gates) {
    assert.notEqual(gate.status, "FAIL", `${gate.id}: ${gate.detail}`);
  }
});

test("E — topology engine positions remain unchanged", () => {
  const nodes = [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ];
  const result = generateTopology("flow", nodes);
  assert.equal(result.nodes[0]?.position?.x, 0);
  assert.equal(result.nodes[1]?.position?.x, FLOW_NODE_SPACING);
});

test("logs ExecutiveAttention once per scene signature", () => {
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    syncSvieExecutiveRiskAttention({
      sceneJson: { scene: { objects: [{ id: "line-1", risk: 0.82, impact: 0.8 }] } },
    });
    syncSvieExecutiveRiskAttention({
      sceneJson: { scene: { objects: [{ id: "line-1", risk: 0.82, impact: 0.8 }] } },
    });
    assert.equal(logs.filter((entry) => entry === SVIE_EXECUTIVE_ATTENTION_LOG).length, 1);
  } finally {
    console.debug = originalDebug;
  }
});
