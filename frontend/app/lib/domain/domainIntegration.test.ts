import { test } from "node:test";
import * as assert from "node:assert/strict";

import { auditDomainArchitecture } from "./domainArchitectureAudit.ts";
import {
  validateDomainEdge,
  validateDomainExecutiveInsight,
  validateDomainObject,
  validateDomainRiskSignal,
  validateDomainScenario,
} from "./domainContractValidation.ts";
import { buildDomainActionPlan } from "./domainActionPlanner.ts";
import { interpretDomainChatMessage } from "./domainChatInterpreter.ts";
import { insertDomainObjectIntoScene } from "./domainSceneInsertion.ts";
import { insertDomainRelationshipsIntoScene } from "./domainGraphInsertion.ts";
import { evaluateDomainRiskSignals } from "./domainRiskEvaluator.ts";
import { calculateObjectFragilityScores } from "./domainFragilityScoring.ts";
import { generateDomainScenarios } from "./domainScenarioGenerator.ts";
import { scoreDomainScenarios } from "./domainScenarioScoring.ts";
import { buildExecutiveInsights } from "./domainExecutiveSynthesis.ts";
import { buildExecutiveRecommendations } from "./domainExecutiveRecommendations.ts";
import { prioritizeExecutiveInsights } from "./domainExecutivePrioritization.ts";
import type { SceneJson } from "../sceneTypes.ts";

function emptyScene(): SceneJson {
  return {
    state_vector: {},
    scene: {
      objects: [],
      loops: [],
    },
  };
}

function addObject(scene: SceneJson, templateId: string): SceneJson {
  const result = insertDomainObjectIntoScene({
    currentScene: scene,
    creationRequest: {
      domainId: "supply_chain",
      templateId,
      source: "chat_inferred",
      preferredPosition: "auto",
    },
  });
  assert.equal(result.success, true);
  assert.ok(result.nextScene);
  return result.nextScene;
}

test("domain architecture audit is deterministic and warning-shaped", () => {
  const first = auditDomainArchitecture();
  const second = auditDomainArchitecture();

  assert.deepEqual(second, first);
  for (const warning of first) {
    assert.ok(warning.id);
    assert.ok(["duplication", "unsafe_mutation", "loop_risk", "schema_risk", "performance", "normalization"].includes(warning.category));
  }
});

test("end-to-end domain flow is deterministic and immutable", () => {
  const original = emptyScene();
  const withSupplier = addObject(original, "supply_chain_supplier");
  const withInventory = addObject(withSupplier, "supply_chain_inventory");
  const withRisk = addObject(withInventory, "supply_chain_delivery_risk");
  const graph = insertDomainRelationshipsIntoScene({
    currentScene: withRisk,
    domainId: "supply_chain",
  });

  assert.equal(original.scene.objects?.length, 0);
  assert.equal(graph.success, true);
  assert.ok(graph.nextScene);
  assert.notEqual(graph.nextScene, withRisk);
  assert.equal(withRisk.scene.loops?.length, 0);

  const objects = graph.nextScene.scene.objects ?? [];
  const edges = graph.nextScene.scene.loops?.flatMap((loop) => loop.edges ?? []) ?? [];
  const risks = evaluateDomainRiskSignals({ domainId: "supply_chain", objects, edges });
  const fragility = calculateObjectFragilityScores({ objects, edges });
  const scenarios = generateDomainScenarios({ domainId: "supply_chain", objects, edges, riskSignals: risks, fragilityScores: fragility });
  const scenarioScores = scoreDomainScenarios({ scenarios });
  const insights = buildExecutiveInsights({
    domainId: "supply_chain",
    riskSignals: risks,
    fragilityScores: fragility,
    scenarios,
    scenarioScores,
  });
  const recommendations = buildExecutiveRecommendations({ insights });
  const priorities = prioritizeExecutiveInsights({ insights });

  assert.ok(risks.length > 0);
  assert.ok(scenarios.length > 0);
  assert.ok(insights.length > 0);
  assert.ok(recommendations.headline.length > 0);
  assert.equal(priorities[0]?.rank, 1);

  assert.equal(validateDomainObject(objects[0]).valid, true);
  assert.equal(validateDomainEdge(edges[0]).valid, true);
  assert.equal(validateDomainRiskSignal(risks[0]).valid, true);
  assert.equal(validateDomainScenario(scenarios[0]).valid, true);
  assert.equal(validateDomainExecutiveInsight(insights[0]).valid, true);

  const rerun = {
    risks: evaluateDomainRiskSignals({ domainId: "supply_chain", objects, edges }),
    fragility: calculateObjectFragilityScores({ objects, edges }),
    scenarios: generateDomainScenarios({ domainId: "supply_chain", objects, edges, riskSignals: risks, fragilityScores: fragility }),
    scores: scoreDomainScenarios({ scenarios }),
  };

  assert.deepEqual(rerun.risks, risks);
  assert.deepEqual(rerun.fragility, fragility);
  assert.deepEqual(rerun.scenarios, scenarios);
  assert.deepEqual(rerun.scores, scenarioScores);
});

test("duplicate insertion and relationship generation stay idempotent", () => {
  const scene = addObject(emptyScene(), "supply_chain_supplier");
  const duplicate = insertDomainObjectIntoScene({
    currentScene: scene,
    creationRequest: {
      domainId: "supply_chain",
      templateId: "supply_chain_supplier",
      source: "chat_inferred",
      preferredPosition: "auto",
    },
  });

  assert.equal(duplicate.success, false);
  assert.equal(duplicate.nextScene, scene);
  assert.ok(duplicate.warnings?.includes("duplicate_object_skipped"));

  const withInventory = addObject(scene, "supply_chain_inventory");
  const once = insertDomainRelationshipsIntoScene({ currentScene: withInventory, domainId: "supply_chain" });
  const twice = insertDomainRelationshipsIntoScene({ currentScene: once.nextScene, domainId: "supply_chain" });

  assert.equal(once.success, true);
  assert.equal(twice.success, false);
  assert.ok(twice.warnings?.includes("no_new_edges"));
});

test("domain chat planning remains bounded and deduped", () => {
  const interpretation = interpretDomainChatMessage({ text: "we have supplier delays and supplier delays" });
  const actions = buildDomainActionPlan(interpretation);

  assert.ok(actions.length <= 2);
  assert.equal(new Set(actions.map((action) => `${action.type}:${JSON.stringify(action.payload)}`)).size, actions.length);
});

test("malformed contracts fail closed", () => {
  assert.equal(validateDomainObject(null).valid, false);
  assert.equal(validateDomainEdge({ from: "a" }).valid, false);
  assert.equal(validateDomainRiskSignal({ id: "risk", confidence: 2 }).valid, false);
  assert.equal(validateDomainScenario({ id: "scenario", confidence: -1 }).valid, false);
  assert.equal(validateDomainExecutiveInsight({ id: "insight", confidence: 3 }).valid, false);
});
