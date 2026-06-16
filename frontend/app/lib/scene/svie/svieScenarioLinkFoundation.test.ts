import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_SCENARIO_LINK_FOUNDATION_TAG,
  SVIE_SCENARIO_LINK_RUNTIME_LOG,
} from "./svieScenarioLinkFoundationContract.ts";
import {
  buildScenarioVisualLink,
  collectScenarioObjectIds,
  derivePredictedChangesFromImpacts,
  resolveScenarioVisualContext,
} from "./svieScenarioLinkResolver.ts";
import {
  buildSvieScenarioLinkSnapshot,
  guardSvieScenarioLinkRouteWrite,
  guardSvieScenarioLinkWorkspaceWrite,
  initializeSvieScenarioLinkRuntime,
  resetSvieScenarioLinkRuntimeForTests,
  syncSvieScenarioLinks,
} from "./svieScenarioLinkRuntime.ts";
import {
  resetSvieAdvisoryVisualIntelligenceCertificationForTests,
  runSvieAdvisoryVisualIntelligenceCertification,
} from "./svieAdvisoryVisualIntelligenceCertification.ts";
import { resetSvieRuntimeFoundationForTests } from "./svieRuntimeFoundation.ts";

const SAMPLE_SCENE = Object.freeze({
  scene: Object.freeze({
    objects: Object.freeze([
      Object.freeze({ id: "supplier", name: "Supplier" }),
      Object.freeze({ id: "inventory", name: "Inventory" }),
      Object.freeze({ id: "production", name: "Production" }),
    ]),
  }),
});

const SUPPLIER_DELAY_SCENARIO = Object.freeze({
  scenarioId: "scenario:supplier-delay",
  label: "Supplier Delay",
  linkedLabels: Object.freeze(["Supplier", "Inventory", "Production"]),
  objectImpacts: Object.freeze([
    Object.freeze({
      objectId: "supplier",
      beforeRisk: 0.42,
      afterRisk: 0.78,
      beforeStability: 0.7,
      afterStability: 0.45,
    }),
    Object.freeze({
      objectId: "inventory",
      beforeRisk: 0.35,
      afterRisk: 0.62,
    }),
    Object.freeze({
      objectId: "production",
      beforeActivity: 0.8,
      afterActivity: 0.55,
    }),
  ]),
  confidence: 0.84,
  simulationSource: "domainSimulationScenarioEngine",
});

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieScenarioLinkRuntimeForTests();
  resetSvieAdvisoryVisualIntelligenceCertificationForTests();
});

test("exports SVIE scenario link foundation tag", () => {
  assert.equal(SVIE_SCENARIO_LINK_FOUNDATION_TAG, "[SVIE:4:1_SCENARIO_LINK_FOUNDATION]");
});

test("A — scenario maps to affected objects and predicted changes", () => {
  initializeSvieScenarioLinkRuntime();
  const snapshot = buildSvieScenarioLinkSnapshot({
    scenarios: [SUPPLIER_DELAY_SCENARIO],
    sceneJson: SAMPLE_SCENE,
  });

  const link = snapshot.linkByScenarioId["scenario:supplier-delay"];
  assert.ok(link);
  assert.deepEqual(link?.objectIds, ["inventory", "production", "supplier"]);
  assert.equal(link?.confidence, 0.84);
  assert.ok(link!.predictedChanges.length >= 4);

  const supplierRisk = link?.predictedChanges.find(
    (change) => change.objectId === "supplier" && change.metric === "risk"
  );
  assert.equal(supplierRisk?.before, 0.42);
  assert.equal(supplierRisk?.after, 0.78);
  assert.equal(supplierRisk?.delta, 0.36);
});

test("B — multi-object linking merges explicit ids, labels, and simulation impacts", () => {
  const sceneIndex = new Map<string, { id: string; name?: string }>([
    ["supplier", { id: "supplier", name: "Supplier" }],
    ["inventory", { id: "inventory", name: "Inventory" }],
    ["production", { id: "production", name: "Production" }],
  ]);

  const objectIds = collectScenarioObjectIds(
    {
      scenarioId: "scenario:multi",
      objectIds: ["supplier"],
      affectedObjectIds: ["inventory"],
      linkedLabels: ["Production"],
    },
    sceneIndex as never
  );

  assert.deepEqual(objectIds, ["inventory", "production", "supplier"]);

  const changes = derivePredictedChangesFromImpacts([
    { objectId: "supplier", beforeRisk: 0.2, afterRisk: 0.5 },
    { objectId: "inventory", beforeActivity: 0.6, afterActivity: 0.4 },
  ]);
  assert.equal(changes.length, 2);

  const invalid = buildScenarioVisualLink({ scenarioId: "   ", objectIds: ["supplier"] }, sceneIndex as never);
  assert.equal(invalid, null);
});

test("C — same input produces deterministic snapshot output", () => {
  const input = {
    scenarios: [SUPPLIER_DELAY_SCENARIO],
    sceneJson: SAMPLE_SCENE,
  };

  const first = buildSvieScenarioLinkSnapshot(input);
  const second = buildSvieScenarioLinkSnapshot(input);
  assert.equal(JSON.stringify(first.links), JSON.stringify(second.links));
  assert.equal(first.signature, second.signature);

  resetSvieScenarioLinkRuntimeForTests();
  const cached = syncSvieScenarioLinks(input);
  const cachedAgain = syncSvieScenarioLinks(input);
  assert.equal(cached, cachedAgain);
});

test("resolveScenarioVisualContext preserves simulation source metadata", () => {
  const sceneIndex = new Map<string, { id: string; name?: string }>([
    ["supplier", { id: "supplier", name: "Supplier" }],
  ]);

  const context = resolveScenarioVisualContext(
    {
      scenarioId: "scenario:ctx",
      label: "Supplier Delay",
      objectIds: ["supplier"],
      confidence: 0.75,
      simulationSource: "domainSimulationScenarioEngine",
    },
    sceneIndex as never
  );

  assert.ok(context);
  assert.equal(context?.label, "Supplier Delay");
  assert.equal(context?.simulationSource, "domainSimulationScenarioEngine");
  assert.deepEqual(context?.link.objectIds, ["supplier"]);
});

test("D — routing and workspace writes remain blocked", () => {
  initializeSvieScenarioLinkRuntime();
  const route = guardSvieScenarioLinkRouteWrite({
    action: "requestWorkspaceLaunch",
    source: "svie-scenario-link-test",
  });
  const workspace = guardSvieScenarioLinkWorkspaceWrite({
    action: "commitExecutiveWorkspaceTransition",
    source: "svie-scenario-link-test",
  });

  assert.equal(route.allowed, false);
  assert.equal(workspace.allowed, false);
});

test("E — phase 3 certification reports no lifecycle regressions", () => {
  const result = runSvieAdvisoryVisualIntelligenceCertification({ force: true });
  assert.equal(result.certified, true);
  for (const gate of result.gates) {
    assert.notEqual(gate.status, "FAIL", `${gate.id}: ${gate.detail}`);
  }
});

test("sync logs ScenarioLink once per signature", () => {
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    syncSvieScenarioLinks({
      scenarios: [SUPPLIER_DELAY_SCENARIO],
      sceneJson: SAMPLE_SCENE,
    });
    syncSvieScenarioLinks({
      scenarios: [SUPPLIER_DELAY_SCENARIO],
      sceneJson: SAMPLE_SCENE,
    });
    assert.equal(logs.filter((entry) => entry === SVIE_SCENARIO_LINK_RUNTIME_LOG).length, 1);
  } finally {
    console.debug = originalDebug;
  }
});

test("unknown scene object ids are ignored safely", () => {
  const snapshot = buildSvieScenarioLinkSnapshot({
    scenarios: [
      {
        scenarioId: "scenario:safe",
        objectIds: ["inventory", "missing-node"],
        confidence: "high",
      },
    ],
    sceneJson: SAMPLE_SCENE,
  });

  const link = snapshot.linkByScenarioId["scenario:safe"];
  assert.deepEqual(link?.objectIds, ["inventory"]);
  assert.equal(link?.confidence, 0.85);
});

test("reads scenarios from sceneJson.svie.scenarios", () => {
  const sceneJson = {
    ...SAMPLE_SCENE,
    svie: {
      scenarios: [SUPPLIER_DELAY_SCENARIO],
    },
  };
  const snapshot = syncSvieScenarioLinks({ sceneJson });
  assert.equal(snapshot.links.length, 1);
  assert.ok(snapshot.linkByScenarioId["scenario:supplier-delay"]);
});
