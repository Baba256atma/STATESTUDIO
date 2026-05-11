import { test } from "node:test";
import * as assert from "node:assert/strict";

import { insertDomainObjectIntoScene } from "./domainSceneInsertion.ts";
import { insertDomainRelationshipsIntoScene } from "./domainGraphInsertion.ts";
import { evaluateDomainRiskSignals } from "./domainRiskEvaluator.ts";
import { calculateObjectFragilityScores } from "./domainFragilityScoring.ts";
import { generateDomainScenarios } from "./domainScenarioGenerator.ts";
import { scoreDomainScenarios } from "./domainScenarioScoring.ts";
import { buildExecutiveInsights } from "./domainExecutiveSynthesis.ts";
import type { SceneJson } from "../sceneTypes.ts";

function scene(): SceneJson {
  return {
    state_vector: {},
    scene: {
      objects: [],
      loops: [],
    },
  };
}

function insertSupplyObject(currentScene: SceneJson, templateId: string): SceneJson {
  const result = insertDomainObjectIntoScene({
    currentScene,
    creationRequest: {
      domainId: "supply_chain",
      templateId,
      source: "user_add",
      preferredPosition: "auto",
    },
  });

  assert.equal(result.success, true);
  assert.ok(result.nextScene);
  return result.nextScene;
}

test("domain full flow smoke: supply chain object graph to executive insight", () => {
  const originalScene = scene();
  const withSupplier = insertSupplyObject(originalScene, "supply_chain_supplier");
  const withInventory = insertSupplyObject(withSupplier, "supply_chain_inventory");

  assert.equal(originalScene.scene.objects?.length, 0);
  assert.equal(withSupplier.scene.objects?.length, 1);
  assert.equal(withInventory.scene.objects?.length, 2);

  const duplicateSupplier = insertDomainObjectIntoScene({
    currentScene: withInventory,
    creationRequest: {
      domainId: "supply_chain",
      templateId: "supply_chain_supplier",
      source: "user_add",
      preferredPosition: "auto",
    },
  });

  assert.equal(duplicateSupplier.success, false);
  assert.equal(duplicateSupplier.nextScene, withInventory);

  const graph = insertDomainRelationshipsIntoScene({
    currentScene: withInventory,
    domainId: "supply_chain",
  });

  assert.equal(graph.success, true);
  assert.ok(graph.nextScene);
  assert.equal(withInventory.scene.loops?.length, 0);

  const objects = graph.nextScene.scene.objects ?? [];
  const edges = graph.nextScene.scene.loops?.flatMap((loop) => loop.edges ?? []) ?? [];
  const edgeKeys = edges.map((edge) => `${edge.from}->${edge.to}:${edge.kind}`);

  assert.equal(objects.map((object) => object.id).includes("domain_supply_chain_supplier"), true);
  assert.equal(objects.map((object) => object.id).includes("domain_supply_chain_inventory"), true);
  assert.equal(new Set(objects.map((object) => object.id)).size, objects.length);
  assert.equal(new Set(edgeKeys).size, edgeKeys.length);

  const risks = evaluateDomainRiskSignals({ domainId: "supply_chain", objects, edges });
  const fragilityScores = calculateObjectFragilityScores({ objects, edges });
  const scenarios = generateDomainScenarios({
    domainId: "supply_chain",
    objects,
    edges,
    riskSignals: risks,
    fragilityScores,
  });
  const scenarioScores = scoreDomainScenarios({ scenarios });
  const insights = buildExecutiveInsights({
    domainId: "supply_chain",
    riskSignals: risks,
    fragilityScores,
    scenarios,
    scenarioScores,
  });

  assert.ok(risks.length > 0);
  assert.ok(scenarios.length > 0);
  assert.ok(insights.length > 0);
  assert.ok(insights[0]?.title);
  assert.ok(insights[0]?.recommendedActions.length);

  const secondGraphPass = insertDomainRelationshipsIntoScene({
    currentScene: graph.nextScene,
    domainId: "supply_chain",
  });

  assert.equal(secondGraphPass.success, false);
  assert.ok(secondGraphPass.warnings?.includes("no_new_edges"));
});
