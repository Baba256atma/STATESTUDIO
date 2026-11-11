import assert from "node:assert/strict";
import test from "node:test";
import {
  approveManagerDecision,
  archiveDecisionNode,
  canonicalDecisionAuthorityStatus,
  CANONICAL_DECISION_STORAGE_KEY,
  createDecisionGoal,
  createDecisionScenario,
  createExecutionPlan,
  createManagerDecision,
  deleteDecisionNode,
  listDecisionRelationships,
  rejectManagerDecision,
  renameDecisionGoal,
  resetDecisionDomainForTests,
} from "./canonicalDecisionDomain.ts";
import { projectDecisionSolar } from "./decisionSolarProjection.ts";
import {
  createCanonicalObject,
  listCanonicalObjects,
  resetCanonicalObjectsForTests,
} from "./canonicalObjectRegistry.ts";
import { listCanonicalRelationships, resetCanonicalRelationshipsForTests } from "./canonicalRelationshipGraph.ts";
import {
  parseSceneOrgSavedScenes,
  sceneOrgSavedSceneDurabilityIdentity,
  serializeSceneOrgSavedScenes,
} from "./sceneOrgSavedSceneDurability.ts";
import { createSceneOrgSavedScene } from "./sceneOrgWorkspacePlacementContract.ts";

function memory(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear() { values.clear(); },
    getItem(key: string) { return values.get(key) ?? null; },
    key(index: number) { return [...values.keys()][index] ?? null; },
    removeItem(key: string) { values.delete(key); },
    setItem(key: string, value: string) { values.set(key, value); },
  };
}

function setup() {
  resetCanonicalObjectsForTests(memory());
  resetCanonicalRelationshipsForTests(memory());
  resetDecisionDomainForTests(memory());
}

test("decision records keep stable ids and do not enter the organizational registry", () => {
  setup();
  const machine = createCanonicalObject({
    workspaceId: "company-a",
    objectType: "MACHINE",
    displayName: "CNC Machine A",
    deckId: "production",
  });
  assert.equal(machine.ok, true);
  if (!machine.ok) return;
  const goal = createDecisionGoal({
    workspaceId: "company-a",
    deckId: "production",
    name: "Reduce Production Downtime",
    description: "Reduce downtime by 15 percent next quarter",
    targetValue: "15",
    measurementUnit: "percent",
    timeHorizon: "Next Quarter",
  });
  assert.equal(goal.ok, true);
  if (!goal.ok) return;
  const renamed = renameDecisionGoal({
    workspaceId: "company-a",
    deckId: "production",
    goalId: goal.value.goalId,
    name: "Reduce Downtime",
  });
  assert.equal(renamed.ok && renamed.value.goalId, goal.value.goalId);
  const scenario = createDecisionScenario({
    workspaceId: "company-a",
    deckId: "production",
    name: "Introduce Preventive Maintenance",
    goalId: goal.value.goalId,
  });
  assert.equal(scenario.ok, true);
  if (!scenario.ok) return;
  const decision = createManagerDecision({
    workspaceId: "company-a",
    deckId: "production",
    name: "Approve Preventive Maintenance Pilot",
    scenarioId: scenario.value.scenarioId,
  });
  assert.equal(decision.ok && decision.value.lifecycleStatus, "PROPOSED");
  if (!decision.ok) return;
  const blocked = createExecutionPlan({
    workspaceId: "company-a",
    deckId: "production",
    name: "Maintenance Pilot",
    decisionId: decision.value.decisionId,
    organizationalObjectId: machine.value.canonicalObjectId,
  });
  assert.equal(blocked.ok, false);
  const approved = approveManagerDecision({
    workspaceId: "company-a",
    deckId: "production",
    decisionId: decision.value.decisionId,
  });
  assert.equal(approved.ok && approved.value.lifecycleStatus, "APPROVED");
  assert.equal(approved.ok && approved.value.provenance, "MANAGER_APPROVED");
  const plan = createExecutionPlan({
    workspaceId: "company-a",
    deckId: "production",
    name: "Maintenance Pilot",
    decisionId: decision.value.decisionId,
    organizationalObjectId: machine.value.canonicalObjectId,
  });
  assert.equal(plan.ok && plan.value.lifecycleStatus, "PLANNED");
  const solar = projectDecisionSolar({ workspaceId: "company-a", deckId: "production" });
  assert.deepEqual(solar.nodes.map((node) => node.kind).sort(), [
    "DECISION",
    "EXECUTION_PLAN",
    "GOAL",
    "ORGANIZATIONAL_OBJECT",
    "SCENARIO",
  ]);
  assert.equal(solar.nodes.filter((node) => node.id === machine.value.canonicalObjectId).length, 1);
  assert.deepEqual(solar.edges.map((edge) => edge.relationshipType).sort(), [
    "AUTHORIZES",
    "EVALUATED_BY",
    "SUPPORTS",
    "TARGETS",
  ]);
  assert.equal(listCanonicalObjects("company-a").length, 1);
  assert.equal(listCanonicalRelationships("company-a").length, 0);
  const again = projectDecisionSolar({ workspaceId: "company-a", deckId: "production" });
  assert.deepEqual(again.nodes.map((node) => node.id), solar.nodes.map((node) => node.id));
  assert.equal(again.placements[0]?.position.z, 0);
});

test("decision relationships reject invalid, foreign, and unauthorized endpoints", () => {
  setup();
  const machine = createCanonicalObject({
    workspaceId: "company-a",
    objectType: "MACHINE",
    displayName: "CNC Machine A",
    deckId: "production",
  });
  assert.equal(machine.ok, true);
  if (!machine.ok) return;
  assert.equal(createDecisionGoal({ workspaceId: "demo_workspace", deckId: "production", name: "Leak" }).ok, false);
  const goal = createDecisionGoal({ workspaceId: "company-a", deckId: "production", name: "Uptime" });
  assert.equal(goal.ok, true);
  if (!goal.ok) return;
  assert.equal(createDecisionScenario({
    workspaceId: "company-a",
    deckId: "finance",
    name: "Other deck",
    goalId: goal.value.goalId,
  }).ok, false);
  const scenario = createDecisionScenario({
    workspaceId: "company-a",
    deckId: "production",
    name: "Maintenance",
    goalId: goal.value.goalId,
  });
  assert.equal(scenario.ok, true);
  if (!scenario.ok) return;
  const decision = createManagerDecision({
    workspaceId: "company-a",
    deckId: "production",
    name: "Pilot",
    scenarioId: scenario.value.scenarioId,
  });
  assert.equal(decision.ok, true);
  if (!decision.ok) return;
  const rejected = rejectManagerDecision({
    workspaceId: "company-a",
    deckId: "production",
    decisionId: decision.value.decisionId,
  });
  assert.equal(rejected.ok && rejected.value.lifecycleStatus, "REJECTED");
  assert.equal(rejected.ok && rejected.value.approvedAt, null);
  assert.equal(approveManagerDecision({
    workspaceId: "company-a",
    deckId: "production",
    decisionId: decision.value.decisionId,
  }).ok, false);
  const proposed = createManagerDecision({
    workspaceId: "company-a",
    deckId: "production",
    name: "Second pilot",
    scenarioId: scenario.value.scenarioId,
  });
  assert.equal(proposed.ok, true);
  if (!proposed.ok) return;
  approveManagerDecision({ workspaceId: "company-a", deckId: "production", decisionId: proposed.value.decisionId });
  assert.equal(createExecutionPlan({
    workspaceId: "company-a",
    deckId: "production",
    name: "Foreign",
    decisionId: proposed.value.decisionId,
    organizationalObjectId: "org:other:o1",
  }).ok, false);
  assert.equal(createExecutionPlan({
    workspaceId: "company-a",
    deckId: "finance",
    name: "Wrong deck",
    decisionId: proposed.value.decisionId,
    organizationalObjectId: machine.value.canonicalObjectId,
  }).ok, false);
  const finance = projectDecisionSolar({ workspaceId: "company-a", deckId: "finance" });
  assert.equal(finance.nodes.length, 0);
  const other = projectDecisionSolar({ workspaceId: "company-b", deckId: "production" });
  assert.equal(other.nodes.length, 0);
});

test("archived and deleted decision records stay out of the projection", () => {
  setup();
  const goal = createDecisionGoal({ workspaceId: "company-a", deckId: "production", name: "Uptime" });
  assert.equal(goal.ok, true);
  if (!goal.ok) return;
  const scenario = createDecisionScenario({
    workspaceId: "company-a",
    deckId: "production",
    name: "Maintenance",
    goalId: goal.value.goalId,
  });
  assert.equal(scenario.ok, true);
  if (!scenario.ok) return;
  archiveDecisionNode({ workspaceId: "company-a", deckId: "production", nodeId: goal.value.goalId });
  const archived = projectDecisionSolar({ workspaceId: "company-a", deckId: "production" });
  assert.equal(archived.nodes.some((node) => node.id === goal.value.goalId), false);
  assert.equal(archived.edges.some((edge) => edge.relationshipType === "EVALUATED_BY"), false);
  assert.equal(archived.missingReferences.length, 1);
  deleteDecisionNode({ workspaceId: "company-a", deckId: "production", nodeId: scenario.value.scenarioId });
  const deleted = projectDecisionSolar({ workspaceId: "company-a", deckId: "production" });
  assert.equal(deleted.nodes.length, 0);
  assert.equal(listDecisionRelationships("company-a").length, 1);
});

test("a failed decision write leaves the previous snapshot unchanged", () => {
  const store = memory();
  resetDecisionDomainForTests(store);
  const goal = createDecisionGoal({ workspaceId: "company-a", deckId: "production", name: "Uptime" });
  assert.equal(goal.ok, true);
  const saved = store.getItem(CANONICAL_DECISION_STORAGE_KEY);
  const original = store.setItem.bind(store);
  store.setItem = () => { throw new Error("injected"); };
  const failed = createDecisionGoal({ workspaceId: "company-a", deckId: "production", name: "Second" });
  assert.equal(failed.ok, false);
  store.setItem = original;
  assert.equal(store.getItem(CANONICAL_DECISION_STORAGE_KEY), saved);
  const solar = projectDecisionSolar({ workspaceId: "company-a", deckId: "production" });
  assert.equal(solar.nodes.length, 1);
});

test("corrupt and unsupported decision storage fail closed", () => {
  const store = memory();
  store.setItem(CANONICAL_DECISION_STORAGE_KEY, "{");
  resetDecisionDomainForTests(store);
  assert.equal(canonicalDecisionAuthorityStatus(), "corrupt");
  assert.equal(createDecisionGoal({ workspaceId: "company-a", deckId: "production", name: "Uptime" }).ok, false);
  assert.equal(store.getItem(CANONICAL_DECISION_STORAGE_KEY), "{");
  const versioned = memory();
  versioned.setItem(CANONICAL_DECISION_STORAGE_KEY, JSON.stringify({
    identity: "NPA-T DECISION-SOLAR-FOUNDATION:1/CanonicalDecisionDomain",
    schemaVersion: 2,
    workspaces: {},
  }));
  resetDecisionDomainForTests(versioned);
  assert.equal(canonicalDecisionAuthorityStatus(), "unsupported-version");
  assert.equal(createDecisionGoal({ workspaceId: "company-a", deckId: "production", name: "Uptime" }).ok, false);
});

test("a decision solar scene keeps its view and drops an unknown view", () => {
  const scene = createSceneOrgSavedScene({
    sceneId: "scene-decision",
    name: "Decision",
    kind: "SAVED",
    sceneIntentType: "manager-view",
    managerWorkspaceId: "company-a",
    ownerDeckId: "production",
    canonicalReferences: [],
    layout: {
      presentationDepth: "minimum",
      leftRegion: "management",
      rightRegion: "contextual",
      detailWorkspace: "closed",
    },
    stageView: "decision-solar",
  });
  assert.equal(scene.stageView, "decision-solar");
  const parsed = parseSceneOrgSavedScenes(serializeSceneOrgSavedScenes([scene]));
  assert.equal(parsed.status, "loaded");
  assert.equal(parsed.scenes[0]?.stageView, "decision-solar");
  const raw = JSON.parse(serializeSceneOrgSavedScenes([scene])) as { scenes: Array<Record<string, unknown>> };
  raw.scenes[0]!.stageView = "not-a-solar-view";
  const unknown = parseSceneOrgSavedScenes(JSON.stringify({
    identity: sceneOrgSavedSceneDurabilityIdentity,
    version: 1,
    scenes: raw.scenes,
  }));
  assert.equal(unknown.scenes[0]?.stageView, undefined);
});
