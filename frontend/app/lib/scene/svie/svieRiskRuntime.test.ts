import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_RISK_RUNTIME_LOG,
  SVIE_RISK_RUNTIME_TAG,
  SVIE_RISK_LEVEL_THRESHOLDS,
} from "./svieRiskRuntimeContract.ts";
import { classifySvieRiskLevel, deriveSvieObjectRiskScore } from "./svieRiskDerivation.ts";
import { resolveSvieObjectRiskState } from "./svieRiskRuntimeResolver.ts";
import {
  buildSvieRiskSnapshot,
  getSvieRiskSnapshot,
  guardSvieRiskDashboardWrite,
  guardSvieRiskRouteWrite,
  guardSvieRiskSceneWrite,
  guardSvieRiskWorkspaceWrite,
  initializeSvieRiskRuntime,
  isSvieRiskRuntimeInitialized,
  resetSvieRiskRuntimeForTests,
} from "./svieRiskRuntime.ts";
import { resetSviePhase1CertificationForTests, runSviePhase1Certification } from "./sviePhase1Certification.ts";
import { resetSvieRuntimeFoundationForTests } from "./svieRuntimeFoundation.ts";

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieRiskRuntimeForTests();
  resetSviePhase1CertificationForTests();
});

test("exports SVIE risk runtime tag", () => {
  assert.equal(SVIE_RISK_RUNTIME_TAG, "[SVIE:2:1_RISK_RUNTIME]");
});

test("A — risk runtime initializes as read-only", () => {
  assert.equal(isSvieRiskRuntimeInitialized(), false);
  const init = initializeSvieRiskRuntime();
  assert.equal(init.initialized, true);
  assert.equal(init.readOnly, true);
  assert.equal(isSvieRiskRuntimeInitialized(), true);
});

test("classifies risk score thresholds", () => {
  assert.equal(classifySvieRiskLevel(0), "low");
  assert.equal(classifySvieRiskLevel(24), "low");
  assert.equal(classifySvieRiskLevel(25), "medium");
  assert.equal(classifySvieRiskLevel(49), "medium");
  assert.equal(classifySvieRiskLevel(50), "high");
  assert.equal(classifySvieRiskLevel(74), "high");
  assert.equal(classifySvieRiskLevel(75), "critical");
  assert.equal(classifySvieRiskLevel(100), "critical");
  assert.deepEqual(SVIE_RISK_LEVEL_THRESHOLDS.critical, { min: 75, max: 100 });
});

test("derives risk score from MVP fields with zero fallback", () => {
  assert.equal(deriveSvieObjectRiskScore({ id: "plain" }), 0);
  assert.equal(
    deriveSvieObjectRiskScore({ id: "a", risk: 0.82, impact: 0.3, confidence: 0.4, status: "watch" }),
    62
  );
  assert.equal(classifySvieRiskLevel(62), "high");
  assert.equal(deriveSvieObjectRiskScore({ id: "b", risk: 0.5, impact: 0.4, confidence: 0.4 }), 49);
  assert.equal(deriveSvieObjectRiskScore({ id: "c", risk: 0.3, impact: 0.2, confidence: 0.8 }), 25);
  assert.equal(deriveSvieObjectRiskScore({ id: "x", risk: 0.82 }), 82);
  assert.equal(classifySvieRiskLevel(82), "critical");
});

test("B — builds risk snapshot from scene objects", () => {
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const snapshot = buildSvieRiskSnapshot({
      sceneJson: {
        scene: {
          objects: [
            { id: "line-1", risk: 0.82, impact: 0.3, confidence: 0.4, status: "watch" },
            { id: "line-2", risk: 0.52, impact: 0.4, confidence: 0.5 },
            { id: "line-3", risk: 0.28, impact: 0.2, confidence: 0.7 },
            { id: "line-4" },
          ],
        },
      },
    });

    assert.equal(snapshot.objects.length, 4);
    assert.equal(snapshot.objects[0]?.objectId, "line-1");
    assert.equal(snapshot.objects[0]?.riskScore, 62);
    assert.equal(snapshot.objects[0]?.riskLevel, "high");
    assert.equal(snapshot.objects[3]?.riskScore, 0);
    assert.equal(snapshot.objects[3]?.riskLevel, "low");
    assert.ok(snapshot.generatedAt > 0);
    assert.equal(getSvieRiskSnapshot(), snapshot);
    assert.equal(logs.filter((entry) => entry === SVIE_RISK_RUNTIME_LOG).length, 1);

    const resolved = resolveSvieObjectRiskState({ id: "line-4" });
    assert.equal(resolved?.riskScore, 0);
    assert.equal(resolved?.riskLevel, "low");
  } finally {
    console.debug = originalDebug;
  }
});

test("C/D — scene, route, workspace, and dashboard writes are blocked", () => {
  initializeSvieRiskRuntime();

  const scene = guardSvieRiskSceneWrite({ action: "mutateSceneObject", source: "svie-risk-test" });
  const route = guardSvieRiskRouteWrite({ action: "requestWorkspaceLaunch", source: "svie-risk-test" });
  const workspace = guardSvieRiskWorkspaceWrite({
    action: "commitExecutiveWorkspaceTransition",
    source: "svie-risk-test",
  });
  const dashboard = guardSvieRiskDashboardWrite({ action: "setDashboardMode", source: "svie-risk-test" });

  assert.equal(scene.allowed, false);
  assert.equal(route.allowed, false);
  assert.equal(workspace.allowed, false);
  assert.equal(dashboard.allowed, false);
});

test("E — SVIE phase 1 certification reports no lifecycle regressions", () => {
  const result = runSviePhase1Certification({ force: true });
  assert.equal(result.certified, true);
  assert.ok(result.finalStatus === "PASS" || result.finalStatus === "PASS WITH WARNINGS");
  for (const gate of result.gates) {
    assert.notEqual(gate.status, "FAIL", `${gate.id}: ${gate.detail}`);
  }
});
