import test from "node:test";
import assert from "node:assert/strict";

import {
  KpiDiscoveryEngine,
  buildDiscoveredKpiRegistry,
  getDiscoveredKpiRegistry,
  resetKpiDiscoveryEngineForTests,
} from "./KpiDiscoveryEngine.ts";
import {
  KPI_DISCOVERY_COMPLETE_DIAGNOSTIC,
  KPI_DISCOVERY_ENGINE_DIAGNOSTIC,
} from "./kpiDiscoveryContract.ts";

test.beforeEach(() => {
  resetKpiDiscoveryEngineForTests();
});

test("discovers KPI candidates from data sources objects and relationships", () => {
  const registry = buildDiscoveredKpiRegistry({
    dataSources: [
      {
        id: "sales-csv",
        name: "Revenue export",
        kpis: ["Revenue", "Margin"],
        sourceConfidence: 0.92,
      },
    ],
    objects: [
      {
        id: "warehouse",
        label: "Warehouse capacity",
        category: "Capacity",
        confidence: 75,
      },
    ],
    relationships: [
      {
        id: "supplier-delivery",
        sourceId: "supplier",
        targetId: "delivery",
        type: "delivery risk",
        metricName: "Delivery risk exposure",
      },
    ],
  });

  assert.equal(registry.discoveredCount, 5);
  assert.equal(registry.discoveredKpis.some((kpi) => kpi.type === "Revenue"), true);
  assert.equal(registry.discoveredKpis.some((kpi) => kpi.type === "Margin"), true);
  assert.equal(registry.discoveredKpis.some((kpi) => kpi.type === "Capacity"), true);
  assert.equal(registry.discoveredKpis.some((kpi) => kpi.type === "Delivery"), true);
  assert.equal(registry.discoveredKpis.some((kpi) => kpi.type === "Risk Exposure"), true);
  assert.equal(registry.discoveredKpis.some((kpi) => kpi.source === "data_source"), true);
  assert.equal(registry.discoveredKpis.some((kpi) => kpi.source === "object"), true);
  assert.equal(registry.discoveredKpis.some((kpi) => kpi.source === "relationship"), true);
});

test("builds immutable discovered KPI registry with diagnostics", () => {
  const registry = buildDiscoveredKpiRegistry({
    dataSources: [{ id: "cost-sheet", label: "Cost efficiency metrics" }],
  });

  assert.equal(registry.discoveredCount, 1);
  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.objectMutation, false);
  assert.equal(registry.relationshipMutation, false);
  assert.equal(registry.diagnostics.includes(KPI_DISCOVERY_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(KPI_DISCOVERY_COMPLETE_DIAGNOSTIC), true);
  assert.equal(registry.discoveredKpis[0]?.name, "Cost efficiency metrics");
  assert.equal(registry.discoveredKpis[0]?.confidence, 72);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.discoveredKpis), true);
  assert.equal(Object.isFrozen(registry.discoveredKpis[0]), true);
  assert.equal(Object.isFrozen(registry.discoveredKpiById), true);
  assert.equal(getDiscoveredKpiRegistry().discoveredCount, 1);
});

test("discovery reads scene payload without mutation", () => {
  const sceneJson = {
    scene: {
      dataSources: [{ id: "quality-feed", metricName: "Quality defects" }],
      objects: [{ id: "dock", label: "Delivery dock" }],
      relationships: [{ id: "rel-risk", sourceId: "dock", targetId: "customer", type: "risk" }],
    },
  };
  const before = JSON.stringify(sceneJson);

  const registry = KpiDiscoveryEngine.buildDiscoveredKpiRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
  assert.equal(registry.discoveredKpis.some((kpi) => kpi.type === "Quality"), true);
  assert.equal(registry.discoveredKpis.some((kpi) => kpi.type === "Delivery"), true);
  assert.equal(registry.discoveredKpis.some((kpi) => kpi.type === "Risk Exposure"), true);
  assert.equal(Object.prototype.hasOwnProperty.call(sceneJson.scene.dataSources[0], "confidenceScore"), false);
});
