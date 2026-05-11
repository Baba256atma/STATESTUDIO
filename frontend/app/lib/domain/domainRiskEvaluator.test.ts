import { test } from "node:test";
import * as assert from "node:assert/strict";

import { calculateObjectFragilityScores } from "./domainFragilityScoring.ts";
import { evaluateDomainRiskSignals } from "./domainRiskEvaluator.ts";
import { buildDomainRiskSceneAnnotations } from "./domainRiskSceneAnnotations.ts";
import { summarizeDomainRiskSignals } from "./domainRiskSummary.ts";
import type { SceneLoopEdge, SceneObject } from "../sceneTypes.ts";

type TestEdge = SceneLoopEdge & { id: string };

const supplyChainObjects: SceneObject[] = [
  { id: "supplier", label: "Supplier", role: "input", semantic: { keywords: ["supplier delay"] } },
  { id: "inventory", label: "Inventory", role: "process" },
  { id: "delivery_risk", label: "Delivery Risk", role: "risk", semantic: { keywords: ["delivery risk", "late shipment"] } },
  { id: "decision", label: "Decision Gate", role: "decision" },
];

const supplyChainEdges: TestEdge[] = [
  { id: "edge_supplier_inventory", from: "supplier", to: "inventory", kind: "domain_flow", weight: 0.72 },
  { id: "edge_inventory_delivery_risk", from: "inventory", to: "delivery_risk", kind: "domain_risk_path", weight: 0.84 },
  { id: "edge_supplier_delivery_risk", from: "supplier", to: "delivery_risk", kind: "domain_risk_path", weight: 0.8 },
  { id: "edge_risk_decision", from: "delivery_risk", to: "decision", kind: "domain_risk_path", weight: 0.74 },
];

test("risk signals are generated from domain graph pressure", () => {
  const signals = evaluateDomainRiskSignals({
    domainId: "supply_chain",
    objects: supplyChainObjects,
    edges: supplyChainEdges,
  });

  assert.ok(signals.length > 0);
  assert.equal(signals.some((signal) => signal.signalType === "fragility"), true);
  assert.equal(signals.some((signal) => signal.signalType === "delay"), true);
});

test("risk evaluator is deterministic and deduped", () => {
  const first = evaluateDomainRiskSignals({ domainId: "supply_chain", objects: supplyChainObjects, edges: supplyChainEdges });
  const second = evaluateDomainRiskSignals({ domainId: "supply_chain", objects: supplyChainObjects, edges: supplyChainEdges });
  const keys = first.map((signal) => `${signal.signalType}|${signal.relatedObjectIds.join(",")}|${signal.relatedEdgeIds?.join(",") ?? ""}`);

  assert.deepEqual(second, first);
  assert.equal(new Set(keys).size, keys.length);
});

test("unsupported domain falls back safely", () => {
  const signals = evaluateDomainRiskSignals({
    domainId: "missing",
    objects: supplyChainObjects,
    edges: supplyChainEdges,
  });

  assert.ok(Array.isArray(signals));
});

test("confidence values are clamped", () => {
  const signals = evaluateDomainRiskSignals({
    domainId: "supply_chain",
    objects: supplyChainObjects,
    edges: supplyChainEdges,
  });

  for (const signal of signals) {
    assert.ok(signal.confidence >= 0 && signal.confidence <= 1);
  }
});

test("risk annotations are renderer-safe metadata", () => {
  const signals = evaluateDomainRiskSignals({
    domainId: "supply_chain",
    objects: supplyChainObjects,
    edges: supplyChainEdges,
  });
  const fragilityScores = calculateObjectFragilityScores({ objects: supplyChainObjects, edges: supplyChainEdges });
  const annotations = buildDomainRiskSceneAnnotations({ signals, fragilityScores });

  assert.ok(annotations.objectAnnotations.delivery_risk);
  assert.ok(Object.keys(annotations.edgeAnnotations).length > 0);
});

test("risk summary is concise", () => {
  const signals = evaluateDomainRiskSignals({
    domainId: "supply_chain",
    objects: supplyChainObjects,
    edges: supplyChainEdges,
  });
  const summary = summarizeDomainRiskSignals({ signals });

  assert.ok(summary.length > 0);
  assert.equal(summary.endsWith("."), true);
});

test("risk evaluator does not mutate input", () => {
  const objectCopy = structuredClone(supplyChainObjects);
  const edgeCopy = structuredClone(supplyChainEdges);
  evaluateDomainRiskSignals({ domainId: "supply_chain", objects: supplyChainObjects, edges: supplyChainEdges });

  assert.deepEqual(supplyChainObjects, objectCopy);
  assert.deepEqual(supplyChainEdges, edgeCopy);
});
