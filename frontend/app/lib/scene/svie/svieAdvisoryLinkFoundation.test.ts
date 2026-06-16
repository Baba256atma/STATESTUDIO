import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_ADVISORY_LINK_FOUNDATION_TAG,
  SVIE_ADVISORY_LINK_RUNTIME_LOG,
} from "./svieAdvisoryLinkFoundationContract.ts";
import {
  collectAdvisoryFindingObjectIds,
  resolveSvieAdvisoryVisualLink,
} from "./svieAdvisoryLinkResolver.ts";
import {
  buildSvieAdvisoryLinkSnapshot,
  guardSvieAdvisoryLinkRouteWrite,
  guardSvieAdvisoryLinkWorkspaceWrite,
  initializeSvieAdvisoryLinkRuntime,
  resetSvieAdvisoryLinkRuntimeForTests,
  syncSvieAdvisoryLinkSnapshot,
} from "./svieAdvisoryLinkRuntime.ts";
import { resetSvieRiskLayerCertificationForTests, runSvieRiskLayerCertification } from "./svieRiskLayerCertification.ts";
import { resetSvieRuntimeFoundationForTests } from "./svieRuntimeFoundation.ts";

const SAMPLE_SCENE = Object.freeze({
  scene: Object.freeze({
    objects: Object.freeze([
      Object.freeze({ id: "inventory", name: "Inventory" }),
      Object.freeze({ id: "supplier", name: "Supplier" }),
      Object.freeze({ id: "production", name: "Production" }),
      Object.freeze({ id: "warehouse", name: "Warehouse" }),
    ]),
  }),
});

const INVENTORY_SAFETY_FINDING = Object.freeze({
  recommendationId: "recommendation:increase-inventory-safety-stock",
  title: "Increase Inventory Safety Stock",
  linkedLabels: Object.freeze(["Inventory", "Supplier", "Production"]),
  confidence: 0.82,
  impact: 0.74,
});

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieAdvisoryLinkRuntimeForTests();
  resetSvieRiskLayerCertificationForTests();
});

test("exports SVIE advisory link foundation tag", () => {
  assert.equal(SVIE_ADVISORY_LINK_FOUNDATION_TAG, "[SVIE:3:1_ADVISORY_LINK_FOUNDATION]");
});

test("A — advisory finding maps to scene object references", () => {
  initializeSvieAdvisoryLinkRuntime();
  const snapshot = buildSvieAdvisoryLinkSnapshot({
    findings: [INVENTORY_SAFETY_FINDING],
    sceneJson: SAMPLE_SCENE,
  });

  const link = snapshot.linkByRecommendationId["recommendation:increase-inventory-safety-stock"];
  assert.ok(link);
  assert.deepEqual(link?.objectIds, ["inventory", "production", "supplier"]);
  assert.equal(link?.confidence, 0.82);
  assert.equal(link?.impact, 0.74);
});

test("B — multi-object linking merges explicit and label references", () => {
  const sceneIndex = new Map<string, { id: string; name?: string }>([
    ["inventory", { id: "inventory", name: "Inventory" }],
    ["supplier", { id: "supplier", name: "Supplier" }],
    ["production", { id: "production", name: "Production" }],
  ]);

  const objectIds = collectAdvisoryFindingObjectIds(
    {
      recommendationId: "rec-1",
      objectIds: ["inventory"],
      relatedObjectIds: ["supplier"],
      linkedLabels: ["Production"],
    },
    sceneIndex as never
  );

  assert.deepEqual(objectIds, ["inventory", "production", "supplier"]);

  const invalid = resolveSvieAdvisoryVisualLink(
    { recommendationId: "   ", objectIds: ["inventory"] },
    sceneIndex as never
  );
  assert.equal(invalid, null);
});

test("C — same input produces deterministic snapshot output", () => {
  const input = {
    findings: [INVENTORY_SAFETY_FINDING],
    sceneJson: SAMPLE_SCENE,
  };

  const first = buildSvieAdvisoryLinkSnapshot(input);
  const second = buildSvieAdvisoryLinkSnapshot(input);
  assert.equal(JSON.stringify(first.links), JSON.stringify(second.links));
  assert.equal(first.signature, second.signature);

  const cached = syncSvieAdvisoryLinkSnapshot(input);
  const cachedAgain = syncSvieAdvisoryLinkSnapshot(input);
  assert.equal(cached, cachedAgain);
});

test("D — routing and workspace writes remain blocked", () => {
  initializeSvieAdvisoryLinkRuntime();
  const route = guardSvieAdvisoryLinkRouteWrite({
    action: "requestWorkspaceLaunch",
    source: "svie-advisory-link-test",
  });
  const workspace = guardSvieAdvisoryLinkWorkspaceWrite({
    action: "commitExecutiveWorkspaceTransition",
    source: "svie-advisory-link-test",
  });

  assert.equal(route.allowed, false);
  assert.equal(workspace.allowed, false);
});

test("E — SVIE risk layer certification reports no lifecycle regressions", () => {
  const result = runSvieRiskLayerCertification({ force: true });
  assert.equal(result.certified, true);
  for (const gate of result.gates) {
    assert.notEqual(gate.status, "FAIL", `${gate.id}: ${gate.detail}`);
  }
});

test("sync logs AdvisoryLink once per signature", () => {
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    syncSvieAdvisoryLinkSnapshot({
      findings: [INVENTORY_SAFETY_FINDING],
      sceneJson: SAMPLE_SCENE,
    });
    syncSvieAdvisoryLinkSnapshot({
      findings: [INVENTORY_SAFETY_FINDING],
      sceneJson: SAMPLE_SCENE,
    });
    assert.equal(logs.filter((entry) => entry === SVIE_ADVISORY_LINK_RUNTIME_LOG).length, 1);
  } finally {
    console.debug = originalDebug;
  }
});

test("unknown scene object ids are ignored safely", () => {
  const snapshot = buildSvieAdvisoryLinkSnapshot({
    findings: [
      {
        recommendationId: "rec-safe",
        objectIds: ["inventory", "missing-node"],
        confidence: "high",
        impact: 0.5,
      },
    ],
    sceneJson: SAMPLE_SCENE,
  });

  const link = snapshot.linkByRecommendationId["rec-safe"];
  assert.deepEqual(link?.objectIds, ["inventory"]);
  assert.equal(link?.confidence, 0.85);
});
