import type { SceneJson, SceneObject } from "../sceneTypes";
import type { NexoraRelationship } from "../relationships/relationshipTypes";
import { readSceneRelationships } from "../relationships/relationshipRuntime";
import { readPropagationPaths, type PropagationPath } from "../propagation/propagationAuthoringRuntime";

export type ExecutiveScenario = {
  id: string;
  name: string;
  description?: string;
  scenarioType: "risk" | "growth" | "financial" | "operational" | "project" | "custom";
  parentScenarioId?: string;
  status: "draft" | "active" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type ExecutiveScenarioNote = {
  id: string;
  kind: "assumption" | "risk" | "observation" | "decision_rationale";
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type ExecutiveScenarioSnapshot = {
  objects: SceneObject[];
  relationships: NexoraRelationship[];
  propagationPaths: PropagationPath[];
};

export type ExecutiveScenarioRecord = ExecutiveScenario & {
  version: string;
  notes: ExecutiveScenarioNote[];
  comparisonTargets: string[];
  snapshot: ExecutiveScenarioSnapshot;
};

export type ScenarioWorkspaceState = {
  activeScenarioId: string;
  comparisonTargets: string[];
  scenarios: ExecutiveScenarioRecord[];
};

export type ScenarioCreateRequest = {
  name: string;
  scenarioType: ExecutiveScenario["scenarioType"];
  description?: string;
};

export const BASELINE_SCENARIO_ID = "baseline";
export const SCENARIO_AUTHORING_VERSION = "1";

const SCENARIO_RUNTIME_KEY = "scenarios";
const loggedScenarioEvents = new Set<string>();

function logScenarioEvent(
  tag: string,
  payload: {
    scenarioId: string;
    scenarioName: string;
    scenarioType: ExecutiveScenario["scenarioType"];
  }
): void {
  if (process.env.NODE_ENV === "production") return;
  const signature = `${tag}:${payload.scenarioId}:${payload.scenarioName}:${payload.scenarioType}`;
  if (loggedScenarioEvents.has(signature)) return;
  loggedScenarioEvents.add(signature);
  console.log(tag, payload);
}

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

function isSceneJson(value: unknown): value is SceneJson {
  return Boolean(value && typeof value === "object" && (value as SceneJson).scene);
}

function sceneObjects(sceneJson: SceneJson): SceneObject[] {
  return Array.isArray(sceneJson.scene.objects) ? sceneJson.scene.objects : [];
}

function nowIso(): string {
  return new Date().toISOString();
}

function createScenarioId(prefix = "scenario"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function readScenarioSnapshot(sceneJson: unknown): ExecutiveScenarioSnapshot {
  if (!isSceneJson(sceneJson)) {
    return { objects: [], relationships: [], propagationPaths: [] };
  }
  return {
    objects: cloneValue(sceneObjects(sceneJson)),
    relationships: cloneValue(readSceneRelationships(sceneJson)),
    propagationPaths: cloneValue(readPropagationPaths(sceneJson)),
  };
}

export function applyScenarioSnapshotToScene(
  sceneJson: SceneJson,
  snapshot: ExecutiveScenarioSnapshot
): SceneJson {
  return {
    ...sceneJson,
    scene: {
      ...sceneJson.scene,
      objects: cloneValue(snapshot.objects),
      relationships: cloneValue(snapshot.relationships),
      propagationPaths: cloneValue(snapshot.propagationPaths),
      loops: Array.isArray(sceneJson.scene.loops) ? sceneJson.scene.loops : [],
    },
  };
}

function createBaselineScenario(snapshot: ExecutiveScenarioSnapshot, createdAt = nowIso()): ExecutiveScenarioRecord {
  return {
    id: BASELINE_SCENARIO_ID,
    name: "Baseline",
    description: "Current Reality",
    scenarioType: "operational",
    status: "active",
    createdAt,
    updatedAt: createdAt,
    version: SCENARIO_AUTHORING_VERSION,
    notes: [],
    comparisonTargets: [],
    snapshot,
  };
}

function normalizeScenarioRecord(
  scenario: Partial<ExecutiveScenarioRecord>,
  fallbackSnapshot: ExecutiveScenarioSnapshot
): ExecutiveScenarioRecord | null {
  const id = String(scenario.id ?? "").trim();
  const name = String(scenario.name ?? "").trim();
  if (!id || !name) return null;
  const createdAt = String(scenario.createdAt ?? nowIso());
  const updatedAt = String(scenario.updatedAt ?? createdAt);
  const scenarioType = scenario.scenarioType ?? "custom";
  return {
    id,
    name,
    description: scenario.description,
    scenarioType,
    parentScenarioId: scenario.parentScenarioId,
    status: scenario.status === "archived" ? "archived" : scenario.status === "active" ? "active" : "draft",
    createdAt,
    updatedAt,
    version: String(scenario.version ?? SCENARIO_AUTHORING_VERSION),
    notes: Array.isArray(scenario.notes) ? cloneValue(scenario.notes) : [],
    comparisonTargets: Array.isArray(scenario.comparisonTargets) ? cloneValue(scenario.comparisonTargets) : [],
    snapshot: scenario.snapshot ? cloneValue(scenario.snapshot) : cloneValue(fallbackSnapshot),
  };
}

export function readScenarioWorkspaceState(sceneJson: unknown): ScenarioWorkspaceState {
  const fallbackSnapshot = readScenarioSnapshot(sceneJson);
  const raw = isSceneJson(sceneJson)
    ? ((sceneJson.scene as Record<string, unknown>)[SCENARIO_RUNTIME_KEY] as Partial<ScenarioWorkspaceState> | undefined)
    : undefined;
  const rawScenarios = Array.isArray(raw?.scenarios) ? raw.scenarios : [];
  const scenarios = rawScenarios
    .map((scenario) => normalizeScenarioRecord(scenario as Partial<ExecutiveScenarioRecord>, fallbackSnapshot))
    .filter((scenario): scenario is ExecutiveScenarioRecord => scenario != null);

  if (!scenarios.some((scenario) => scenario.id === BASELINE_SCENARIO_ID)) {
    scenarios.unshift(createBaselineScenario(fallbackSnapshot));
  }

  const requestedActiveId = String(raw?.activeScenarioId ?? "").trim();
  const activeScenario =
    scenarios.find((scenario) => scenario.id === requestedActiveId && scenario.status !== "archived") ??
    scenarios.find((scenario) => scenario.status === "active") ??
    scenarios.find((scenario) => scenario.id === BASELINE_SCENARIO_ID) ??
    scenarios[0];

  return {
    activeScenarioId: activeScenario.id,
    comparisonTargets: Array.isArray(raw?.comparisonTargets) ? cloneValue(raw.comparisonTargets) : [],
    scenarios: scenarios.map((scenario) => ({
      ...scenario,
      status:
        scenario.id === activeScenario.id && scenario.status !== "archived"
          ? "active"
          : scenario.status === "active"
            ? "draft"
            : scenario.status,
    })),
  };
}

export function writeScenarioWorkspaceState(
  sceneJson: SceneJson,
  state: ScenarioWorkspaceState
): SceneJson {
  return {
    ...sceneJson,
    scene: {
      ...sceneJson.scene,
      [SCENARIO_RUNTIME_KEY]: cloneValue(state),
    },
  };
}

export function ensureScenarioWorkspaceInScene(sceneJson: SceneJson): SceneJson {
  const existing = (sceneJson.scene as Record<string, unknown>)[SCENARIO_RUNTIME_KEY];
  if (existing && typeof existing === "object") return sceneJson;
  return writeScenarioWorkspaceState(sceneJson, readScenarioWorkspaceState(sceneJson));
}

export function captureActiveScenarioSnapshot(sceneJson: SceneJson): SceneJson {
  const state = readScenarioWorkspaceState(sceneJson);
  const now = nowIso();
  const scenarios = state.scenarios.map((scenario) =>
    scenario.id === state.activeScenarioId
      ? { ...scenario, snapshot: readScenarioSnapshot(sceneJson), updatedAt: now }
      : scenario
  );
  return writeScenarioWorkspaceState(sceneJson, { ...state, scenarios });
}

export function getScenarioMetrics(scenario: ExecutiveScenarioRecord): {
  objectCount: number;
  relationshipCount: number;
  propagationCount: number;
} {
  return {
    objectCount: scenario.snapshot.objects.length,
    relationshipCount: scenario.snapshot.relationships.length,
    propagationCount: scenario.snapshot.propagationPaths.length,
  };
}

export function createExecutiveScenario(
  sceneJson: SceneJson,
  request: ScenarioCreateRequest
): { nextScene: SceneJson; scenario: ExecutiveScenarioRecord | null } {
  const capturedScene = captureActiveScenarioSnapshot(ensureScenarioWorkspaceInScene(sceneJson));
  const state = readScenarioWorkspaceState(capturedScene);
  const baseSnapshot =
    state.scenarios.find((scenario) => scenario.id === state.activeScenarioId)?.snapshot ??
    readScenarioSnapshot(capturedScene);
  const createdAt = nowIso();
  const name = request.name.trim();
  if (!name) return { nextScene: capturedScene, scenario: null };
  const scenario: ExecutiveScenarioRecord = {
    id: createScenarioId("scenario"),
    name,
    description: request.description?.trim() || undefined,
    scenarioType: request.scenarioType,
    parentScenarioId: state.activeScenarioId,
    status: "active",
    createdAt,
    updatedAt: createdAt,
    version: SCENARIO_AUTHORING_VERSION,
    notes: [],
    comparisonTargets: [],
    snapshot: cloneValue(baseSnapshot),
  };
  const nextState: ScenarioWorkspaceState = {
    ...state,
    activeScenarioId: scenario.id,
    scenarios: [
      ...state.scenarios.map((entry) =>
        entry.status === "active" ? { ...entry, status: "draft" as const } : entry
      ),
      scenario,
    ],
  };
  const withState = writeScenarioWorkspaceState(capturedScene, nextState);
  const nextScene = applyScenarioSnapshotToScene(withState, scenario.snapshot);
  logScenarioEvent("[Nexora][ScenarioCreated]", {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    scenarioType: scenario.scenarioType,
  });
  logScenarioEvent("[Nexora][ScenarioActivated]", {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    scenarioType: scenario.scenarioType,
  });
  return { nextScene, scenario };
}

export function activateExecutiveScenario(
  sceneJson: SceneJson,
  scenarioId: string
): { nextScene: SceneJson; scenario: ExecutiveScenarioRecord | null } {
  const capturedScene = captureActiveScenarioSnapshot(ensureScenarioWorkspaceInScene(sceneJson));
  const state = readScenarioWorkspaceState(capturedScene);
  const target = state.scenarios.find((scenario) => scenario.id === scenarioId && scenario.status !== "archived") ?? null;
  if (!target) return { nextScene: capturedScene, scenario: null };
  const nextState: ScenarioWorkspaceState = {
    ...state,
    activeScenarioId: target.id,
    scenarios: state.scenarios.map((scenario) => ({
      ...scenario,
      status:
        scenario.id === target.id
          ? "active"
          : scenario.status === "active"
            ? "draft"
            : scenario.status,
    })),
  };
  const withState = writeScenarioWorkspaceState(capturedScene, nextState);
  const nextScene = applyScenarioSnapshotToScene(withState, target.snapshot);
  logScenarioEvent("[Nexora][ScenarioActivated]", {
    scenarioId: target.id,
    scenarioName: target.name,
    scenarioType: target.scenarioType,
  });
  return { nextScene, scenario: target };
}

export function duplicateExecutiveScenario(
  sceneJson: SceneJson,
  scenarioId: string
): { nextScene: SceneJson; scenario: ExecutiveScenarioRecord | null } {
  const capturedScene = captureActiveScenarioSnapshot(ensureScenarioWorkspaceInScene(sceneJson));
  const state = readScenarioWorkspaceState(capturedScene);
  const source = state.scenarios.find((scenario) => scenario.id === scenarioId) ?? null;
  if (!source) return { nextScene: capturedScene, scenario: null };
  const createdAt = nowIso();
  const scenario: ExecutiveScenarioRecord = {
    ...cloneValue(source),
    id: createScenarioId("scenario"),
    name: `${source.name} Copy`,
    parentScenarioId: source.id,
    status: "active",
    createdAt,
    updatedAt: createdAt,
    version: SCENARIO_AUTHORING_VERSION,
    comparisonTargets: [],
  };
  const nextState: ScenarioWorkspaceState = {
    ...state,
    activeScenarioId: scenario.id,
    scenarios: [
      ...state.scenarios.map((entry) =>
        entry.status === "active" ? { ...entry, status: "draft" as const } : entry
      ),
      scenario,
    ],
  };
  const withState = writeScenarioWorkspaceState(capturedScene, nextState);
  const nextScene = applyScenarioSnapshotToScene(withState, scenario.snapshot);
  logScenarioEvent("[Nexora][ScenarioDuplicated]", {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    scenarioType: scenario.scenarioType,
  });
  logScenarioEvent("[Nexora][ScenarioActivated]", {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    scenarioType: scenario.scenarioType,
  });
  return { nextScene, scenario };
}

export function archiveExecutiveScenario(
  sceneJson: SceneJson,
  scenarioId: string
): { nextScene: SceneJson; scenario: ExecutiveScenarioRecord | null } {
  const capturedScene = captureActiveScenarioSnapshot(ensureScenarioWorkspaceInScene(sceneJson));
  const state = readScenarioWorkspaceState(capturedScene);
  const target = state.scenarios.find((scenario) => scenario.id === scenarioId) ?? null;
  if (!target) return { nextScene: capturedScene, scenario: null };
  const now = nowIso();
  const scenarios = state.scenarios.map((scenario) =>
    scenario.id === scenarioId ? { ...scenario, status: "archived" as const, updatedAt: now } : scenario
  );
  const nextActive =
    state.activeScenarioId === scenarioId
      ? scenarios.find((scenario) => scenario.id === BASELINE_SCENARIO_ID && scenario.status !== "archived") ??
        scenarios.find((scenario) => scenario.status !== "archived") ??
        target
      : scenarios.find((scenario) => scenario.id === state.activeScenarioId) ?? target;
  const nextState: ScenarioWorkspaceState = {
    ...state,
    activeScenarioId: nextActive.id,
    scenarios: scenarios.map((scenario) => ({
      ...scenario,
      status:
        scenario.status === "archived"
          ? "archived"
          : scenario.id === nextActive.id
            ? "active"
            : "draft",
    })),
  };
  const withState = writeScenarioWorkspaceState(capturedScene, nextState);
  const nextScene = applyScenarioSnapshotToScene(withState, nextActive.snapshot);
  logScenarioEvent("[Nexora][ScenarioArchived]", {
    scenarioId: target.id,
    scenarioName: target.name,
    scenarioType: target.scenarioType,
  });
  return { nextScene, scenario: target };
}

export function compareExecutiveScenarios(sceneJson: SceneJson, scenarioIds: string[]): SceneJson {
  const state = readScenarioWorkspaceState(ensureScenarioWorkspaceInScene(sceneJson));
  const targets = scenarioIds
    .map((id) => id.trim())
    .filter((id, index, ids) => id && ids.indexOf(id) === index)
    .slice(0, 2);
  const scenarios = state.scenarios.map((scenario) =>
    scenario.id === state.activeScenarioId ? { ...scenario, comparisonTargets: targets } : scenario
  );
  for (const target of scenarios.filter((scenario) => targets.includes(scenario.id))) {
    logScenarioEvent("[Nexora][ScenarioCompared]", {
      scenarioId: target.id,
      scenarioName: target.name,
      scenarioType: target.scenarioType,
    });
  }
  return writeScenarioWorkspaceState(sceneJson, { ...state, comparisonTargets: targets, scenarios });
}
