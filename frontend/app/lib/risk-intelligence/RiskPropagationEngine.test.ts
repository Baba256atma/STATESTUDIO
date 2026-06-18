import test from "node:test";
import assert from "node:assert/strict";

import {
  RiskPropagationEngine,
  buildRiskPropagationProfile,
  buildRiskPropagationRegistry,
  getRiskPropagationRegistry,
  resetRiskPropagationEngineForTests,
} from "./RiskPropagationEngine.ts";
import {
  RISK_PROPAGATION_ENGINE_DIAGNOSTIC,
  RISK_PROPAGATION_UPDATED_DIAGNOSTIC,
} from "./riskPropagationProfileContract.ts";

test.beforeEach(() => {
  resetRiskPropagationEngineForTests();
});

test("exports canonical risk propagation diagnostics", () => {
  assert.equal(RISK_PROPAGATION_ENGINE_DIAGNOSTIC, "[RISK_PROPAGATION_ENGINE]");
  assert.equal(RISK_PROPAGATION_UPDATED_DIAGNOSTIC, "[RISK_PROPAGATION_UPDATED]");
});

test("returns empty propagation profile for an empty graph", () => {
  const profile = buildRiskPropagationProfile();

  assert.equal(profile.propagationScore, 0);
  assert.equal(profile.chainCount, 0);
  assert.equal(profile.riskSources.length, 0);
  assert.equal(profile.riskTargets.length, 0);
  assert.equal(Object.isFrozen(profile), true);
});

test("traverses objects relationships and KPIs to build risk chains", () => {
  const profile = buildRiskPropagationProfile({
    sceneJson: {
      scene: {
        objects: [
          {
            id: "supplier-1",
            label: "Primary Supplier",
            type: "supplier",
            active: false,
            sourceConfidence: 15,
            relationships: [{ status: "broken", confidence: 20 }],
          },
          {
            id: "inventory-1",
            label: "Inventory",
            type: "inventory",
            activityLevel: 55,
          },
          {
            id: "production-1",
            label: "Production",
            type: "production",
            role: "executive",
            importance: 90,
            active: false,
            sourceConfidence: 20,
          },
        ],
        relationships: [
          {
            id: "rel-supply",
            sourceId: "supplier-1",
            targetId: "inventory-1",
            type: "supplies",
            direction: "uni",
            metadata: { supplyRisk: 85, dependency: 88, strength: 0.9 },
            createdAt: "2026-01-01T00:00:00.000Z",
          },
          {
            id: "rel-dependency",
            sourceId: "inventory-1",
            targetId: "production-1",
            type: "dependency",
            direction: "uni",
            metadata: { operationalRisk: 90, dependency: 92, redundancy: 8 },
            createdAt: "2026-01-02T00:00:00.000Z",
          },
        ],
        kpis: [
          {
            id: "schedule",
            label: "Schedule",
            objectId: "production-1",
            value: 42,
            target: 60,
            category: "Schedule",
            confidence: 55,
          },
        ],
        kpiSnapshots: [
          { kpiId: "schedule", value: 58, capturedAt: "2026-01-01T00:00:00.000Z" },
          { kpiId: "schedule", value: 50, capturedAt: "2026-02-01T00:00:00.000Z" },
          { kpiId: "schedule", value: 42, capturedAt: "2026-03-01T00:00:00.000Z" },
        ],
      },
    },
  });

  assert.equal(profile.objectCount, 3);
  assert.equal(profile.relationshipCount, 2);
  assert.equal(profile.kpiCount, 1);
  assert.equal(profile.riskSources.length > 0, true);
  assert.equal(profile.riskChains.length > 0, true);
  assert.equal(profile.chainCount, profile.riskChains.length);
  assert.equal(typeof profile.propagationScore, "number");
  assert.equal(profile.propagationScore >= 35, true);
  assert.equal(profile.riskTargets.length > 0, true);
  assert.equal(profile.riskChains.some((chain) => chain.steps.some((step) => step.nodeKind === "relationship")), true);
  assert.equal(
    profile.riskChains.some((chain) => chain.targetKind === "kpi" || chain.targetKind === "object"),
    true
  );
  assert.equal(Object.isFrozen(profile.riskChains), true);
  assert.equal(Object.isFrozen(profile.riskSources), true);
});

test("detects risk sources targets and propagation scores on chains", () => {
  const profile = buildRiskPropagationProfile({
    sceneJson: {
      scene: {
        objects: [
          {
            id: "supplier-1",
            label: "Supplier",
            type: "supplier",
            active: false,
            sourceConfidence: 10,
          },
          { id: "inventory-1", label: "Inventory", type: "inventory" },
        ],
        relationships: [
          {
            id: "rel-1",
            sourceId: "supplier-1",
            targetId: "inventory-1",
            type: "supplies",
            metadata: { supplyRisk: 90, dependency: 95, redundancy: 5, strength: 0.95 },
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      },
    },
  });

  assert.equal(profile.riskSources.includes("supplier-1") || profile.riskSources.includes("rel-1"), true);
  assert.equal(profile.riskTargets.includes("inventory-1"), true);
  const chain = profile.riskChains.find((entry) => entry.targetId === "inventory-1");
  assert.equal(typeof chain?.propagationScore, "number");
  assert.equal((chain?.propagationScore ?? 0) >= 35, true);
  assert.equal(chain?.steps.some((step) => step.nodeKind === "object"), true);
  assert.equal(chain?.steps.some((step) => step.nodeKind === "relationship"), true);
});

test("creates immutable risk propagation registry with diagnostics", () => {
  const registry = buildRiskPropagationRegistry({
    sceneJson: {
      scene: {
        objects: [{ id: "a", label: "A", active: false, sourceConfidence: 10 }],
        relationships: [
          {
            id: "rel-a-b",
            sourceId: "a",
            targetId: "b",
            type: "dependency",
            metadata: { dependency: 90 },
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      },
    },
  });

  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.mrpMutation, false);
  assert.equal(registry.simulation, false);
  assert.equal(registry.diagnostics.includes(RISK_PROPAGATION_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(RISK_PROPAGATION_UPDATED_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.profile), true);
  assert.equal(getRiskPropagationRegistry().profile.propagationId, "business-graph-propagation");
});

test("risk propagation analysis does not mutate source graph records", () => {
  const object: Record<string, unknown> = { id: "source-1", label: "Source", type: "supplier" };
  const relationship: Record<string, unknown> = {
    id: "rel-1",
    sourceId: "source-1",
    targetId: "target-1",
    type: "dependency",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
  const kpi = { id: "kpi-1", label: "KPI", value: 40, target: 60, objectId: "target-1" };
  const beforeObject = JSON.stringify(object);
  const beforeRelationship = JSON.stringify(relationship);
  const beforeKpi = JSON.stringify(kpi);

  RiskPropagationEngine.buildRiskPropagationRegistry({
    objects: [object, { id: "target-1", label: "Target" }],
    relationships: [relationship],
    kpis: [kpi],
  });

  assert.equal(JSON.stringify(object), beforeObject);
  assert.equal(JSON.stringify(relationship), beforeRelationship);
  assert.equal(JSON.stringify(kpi), beforeKpi);
  assert.equal(Object.prototype.hasOwnProperty.call(object, "propagationScore"), false);
});
