import type { SceneJson, SceneLoop, SceneObject } from "../sceneTypes.ts";
import { TYPE_C_CORE_OBJECT_ID } from "./typeCSceneBootstrap.ts";
import type { TypeCScenario, TypeCScenarioState } from "./typeCScenarioTypes.ts";

function sceneObjects(scene: SceneJson | null | undefined): SceneObject[] {
  return Array.isArray(scene?.scene?.objects) ? scene.scene.objects : [];
}

function sceneLoops(scene: SceneJson | null | undefined): SceneLoop[] {
  return Array.isArray(scene?.scene?.loops) ? scene.scene.loops : [];
}

function normalizeIdPart(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function objectLabel(object: SceneObject): string {
  return String(object.label ?? object.name ?? object.id ?? "").trim();
}

function nonCoreObjects(scene: SceneJson | null | undefined): SceneObject[] {
  return sceneObjects(scene).filter((object) => String(object.id ?? "") !== TYPE_C_CORE_OBJECT_ID);
}

function buildScenarioId(objectIds: string[], loopIds: string[]): string {
  const signature = [...objectIds, ...loopIds].map(normalizeIdPart).filter(Boolean).join("__");
  return `typec_scenario_${signature || "scene_graph"}`;
}

export function buildTypeCScenarioFromScene(scene: SceneJson | null | undefined): TypeCScenario | null {
  const objects = nonCoreObjects(scene);
  if (objects.length < 2) return null;

  const objectIds = objects.map((object) => String(object.id ?? "").trim()).filter(Boolean);
  if (objectIds.length < 2) return null;

  const loopIds = sceneLoops(scene).map((loop) => String(loop.id ?? "").trim()).filter(Boolean);
  const labels = objects.map(objectLabel).filter(Boolean);
  const now = new Date().toISOString();
  const title = `Scenario: ${labels.slice(0, 3).join(" → ")}`;

  return {
    id: buildScenarioId(objectIds, loopIds),
    title,
    status: "draft",
    source: "scene_graph",
    objectIds,
    loopIds,
    createdAt: now,
    updatedAt: now,
    summary: `Scenario based on ${labels.join(" → ")}`,
  };
}

export function addScenarioToState(state: TypeCScenarioState, scenario: TypeCScenario): TypeCScenarioState {
  if (state.scenarios.some((existing) => existing.id === scenario.id)) return state;

  return {
    ...state,
    scenarios: [...state.scenarios, scenario],
  };
}

export function selectTypeCScenario(state: TypeCScenarioState, scenarioId: string): TypeCScenarioState {
  const exists = state.scenarios.some((scenario) => scenario.id === scenarioId);
  if (!exists) return state;
  const alreadySelectedOnly =
    state.selectedScenarioId === scenarioId &&
    state.scenarios.every((scenario) => scenario.status !== "selected" || scenario.id === scenarioId);
  if (alreadySelectedOnly) return state;
  const now = new Date().toISOString();

  return {
    ...state,
    selectedScenarioId: scenarioId,
    scenarios: state.scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? { ...scenario, status: "selected", updatedAt: now }
        : scenario.status === "selected"
          ? { ...scenario, status: "draft", updatedAt: now }
        : scenario
    ),
  };
}

export function ignoreTypeCScenario(state: TypeCScenarioState, scenarioId: string): TypeCScenarioState {
  const existing = state.scenarios.find((scenario) => scenario.id === scenarioId);
  if (!existing || existing.status === "ignored") return state;

  return {
    ...state,
    selectedScenarioId: state.selectedScenarioId === scenarioId ? null : state.selectedScenarioId,
    scenarios: state.scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? { ...scenario, status: "ignored", updatedAt: new Date().toISOString() }
        : scenario
    ),
  };
}

export function markScenarioReadyForDecision(state: TypeCScenarioState, scenarioId: string): TypeCScenarioState {
  const scenario = state.scenarios.find((candidate) => candidate.id === scenarioId);
  if (!scenario || scenario.status === "ignored" || scenario.status === "ready_for_decision") return state;
  const now = new Date().toISOString();

  return {
    ...state,
    selectedScenarioId: scenarioId,
    scenarios: state.scenarios.map((candidate) =>
      candidate.id === scenarioId
        ? { ...candidate, status: "ready_for_decision", updatedAt: now }
        : candidate
    ),
  };
}

export function getSelectedTypeCScenario(state: TypeCScenarioState): TypeCScenario | null {
  if (!state.selectedScenarioId) return null;
  return state.scenarios.find((scenario) => scenario.id === state.selectedScenarioId) ?? null;
}

export function getReadyTypeCScenarios(state: TypeCScenarioState): TypeCScenario[] {
  return state.scenarios.filter((scenario) => scenario.status === "ready_for_decision");
}
