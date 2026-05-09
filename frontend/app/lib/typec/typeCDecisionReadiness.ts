import type { SceneJson, SceneLoop, SceneObject } from "../sceneTypes.ts";
import { TYPE_C_CORE_OBJECT_ID } from "./typeCSceneBootstrap.ts";
import type { TypeCScenario, TypeCScenarioState } from "./typeCScenarioTypes.ts";

export type TypeCDecisionReadinessLevel =
  | "not_ready"
  | "partial"
  | "ready";

export type TypeCDecisionReadinessSnapshot = {
  id: string;
  scenarioId: string | null;
  level: TypeCDecisionReadinessLevel;
  objectCount: number;
  loopCount: number;
  hasSelectedScenario: boolean;
  hasReadyScenario: boolean;
  missing: string[];
  summary: string;
  createdAt: string;
};

function sceneObjects(scene: SceneJson | null | undefined): SceneObject[] {
  return Array.isArray(scene?.scene?.objects) ? scene.scene.objects : [];
}

function sceneLoops(scene: SceneJson | null | undefined): SceneLoop[] {
  return Array.isArray(scene?.scene?.loops) ? scene.scene.loops : [];
}

function nonCoreObjectCount(scene: SceneJson | null | undefined): number {
  return sceneObjects(scene).filter((object) => String(object.id ?? "") !== TYPE_C_CORE_OBJECT_ID).length;
}

function selectedScenario(state: TypeCScenarioState): TypeCScenario | null {
  if (!state.selectedScenarioId) return null;
  return state.scenarios.find((scenario) => scenario.id === state.selectedScenarioId) ?? null;
}

function firstReadyScenario(state: TypeCScenarioState): TypeCScenario | null {
  return state.scenarios.find((scenario) => scenario.status === "ready_for_decision") ?? null;
}

function stableId(input: {
  scenarioId: string | null;
  level: TypeCDecisionReadinessLevel;
  objectCount: number;
  loopCount: number;
  missing: string[];
}): string {
  const scenarioPart = input.scenarioId ?? "none";
  const missingPart = input.missing.join("_") || "complete";
  return `typec_readiness_${scenarioPart}_${input.level}_${input.objectCount}_${input.loopCount}_${missingPart}`;
}

export function buildTypeCDecisionReadinessSnapshot(input: {
  scene: SceneJson | null;
  scenarioState: TypeCScenarioState;
}): TypeCDecisionReadinessSnapshot {
  try {
    const selected = selectedScenario(input.scenarioState);
    const ready = firstReadyScenario(input.scenarioState);
    const scenario = selected ?? ready;
    const objectCount = nonCoreObjectCount(input.scene);
    const loopCount = sceneLoops(input.scene).length;
    const missing: string[] = [];
    const hasSelectedScenario = Boolean(selected);
    const hasReadyScenario = Boolean(ready);

    if (!scenario) missing.push("selected_scenario");
    if (scenario && scenario.status !== "ready_for_decision") missing.push("scenario_ready_status");
    if (objectCount < 2) missing.push("minimum_objects");
    if (loopCount < 1) missing.push("connections");

    const level: TypeCDecisionReadinessLevel =
      scenario?.status === "ready_for_decision" && objectCount >= 2 && loopCount >= 1
        ? "ready"
        : scenario
          ? "partial"
          : "not_ready";
    const summary =
      !scenario
        ? "No selected scenario yet."
        : scenario.status !== "ready_for_decision"
          ? "Scenario selected but not marked ready for decision."
          : level === "ready"
            ? "Scenario is ready for decision analysis."
            : "Scenario needs more structure before decision analysis.";

    return {
      id: stableId({
        scenarioId: scenario?.id ?? null,
        level,
        objectCount,
        loopCount,
        missing,
      }),
      scenarioId: scenario?.id ?? null,
      level,
      objectCount,
      loopCount,
      hasSelectedScenario,
      hasReadyScenario,
      missing,
      summary,
      createdAt: new Date().toISOString(),
    };
  } catch {
    return {
      id: "typec_readiness_error_not_ready_0_0_selected_scenario",
      scenarioId: null,
      level: "not_ready",
      objectCount: 0,
      loopCount: 0,
      hasSelectedScenario: false,
      hasReadyScenario: false,
      missing: ["selected_scenario"],
      summary: "No selected scenario yet.",
      createdAt: new Date().toISOString(),
    };
  }
}
