import type { SceneJson, SceneLoop, SemanticObjectMeta } from "../sceneTypes";

export type WorkspaceMsg = { id?: string; role: "user" | "assistant"; text: string };

export type ProjectSceneState = {
  sceneJson: SceneJson | null;
  selectedObjectId: string | null;
  focusedId: string | null;
  focusMode: "all" | "selected";
  focusPinned: boolean;
  loops: SceneLoop[];
  activeLoopId: string | null;
  selectedLoopId: string | null;
  objectUxById: Record<string, { opacity?: number; scale?: number }>;
  overrides: Record<string, unknown>;
};

export type ProjectIntelligenceState = {
  kpi: unknown | null;
  conflicts: unknown[];
  objectSelection: unknown | null;
  memoryInsights: unknown | null;
  riskPropagation: unknown | null;
  strategicAdvice: unknown | null;
  strategyKpi: unknown | null;
  decisionCockpit: unknown | null;
  productModeContext: unknown | null;
  aiReasoning: unknown | null;
  platformAssembly: unknown | null;
  autonomousExploration: unknown | null;
  opponentModel: unknown | null;
  strategicPatterns: unknown | null;
  decisionResult: unknown | null;
  responseData: unknown | null;
  sourceLabel: string | null;
  lastAnalysisSummary: string | null;
};

export type WorkspaceProjectState = {
  id: string;
  name: string;
  domain?: string;
  description?: string;
  semanticObjectMeta?: Record<string, SemanticObjectMeta | Record<string, unknown>>;
  scanner?: {
    lastMode?: "create" | "enrich";
    lastSource?: { type: string; id?: string; uri?: string; label?: string };
    confidence?: number;
    warnings?: string[];
    unresolvedItems?: string[];
    lastScannedAt?: string;
    [key: string]: unknown;
  };
  chat: { messages: WorkspaceMsg[]; activeMode: string; episodeId: string | null };
  scene: ProjectSceneState;
  intelligence: ProjectIntelligenceState;
};

export type WorkspaceState = {
  id: string;
  activeProjectId: string;
  projects: Record<string, WorkspaceProjectState>;
};

export const DEFAULT_WORKSPACE_ID = "default_workspace";
export const DEFAULT_PROJECT_ID = "default";
const LEGACY_WORKSPACE_STORE_KEY = "nexora.workspace.v1";

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function inferProjectMetaFromScene(sceneJson: SceneJson | null): {
  projectId: string; name: string; domain?: string;
} {
  const meta = readRecord(sceneJson?.meta);
  const projectId = String(meta.project_id ?? meta.demo_id ?? meta.workspace_project_id ?? "")
    .trim().toLowerCase() || DEFAULT_PROJECT_ID;
  const name = String(meta.project_name ?? meta.demo_name ?? projectId).trim() || projectId;
  const domain = String(meta.domain ?? "").trim() || undefined;
  return { projectId, name, domain };
}

export function createEmptyProjectState(projectId: string, name?: string): WorkspaceProjectState {
  return {
    id: projectId,
    name: name || projectId,
    chat: { messages: [], activeMode: "business", episodeId: null },
    scene: {
      sceneJson: null, selectedObjectId: null, focusedId: null, focusMode: "all",
      focusPinned: false, loops: [], activeLoopId: null, selectedLoopId: null,
      objectUxById: {}, overrides: {},
    },
    intelligence: {
      kpi: null, conflicts: [], objectSelection: null, memoryInsights: null,
      riskPropagation: null, strategicAdvice: null, strategyKpi: null,
      decisionCockpit: null, productModeContext: null, aiReasoning: null,
      platformAssembly: null, autonomousExploration: null, opponentModel: null,
      strategicPatterns: null, decisionResult: null, responseData: null,
      sourceLabel: null, lastAnalysisSummary: null,
    },
  };
}

export function loadWorkspaceState(): WorkspaceState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LEGACY_WORKSPACE_STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return null;
    const id = String(parsed.id ?? DEFAULT_WORKSPACE_ID);
    const activeProjectId = String(parsed.activeProjectId ?? DEFAULT_PROJECT_ID);
    const projects = parsed.projects;
    if (!projects || typeof projects !== "object") return null;
    return { id, activeProjectId, projects } as WorkspaceState;
  } catch {
    return null;
  }
}

export function saveWorkspaceState(state: WorkspaceState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LEGACY_WORKSPACE_STORE_KEY, JSON.stringify(state));
  } catch {
    // Preserve legacy best-effort persistence semantics.
  }
}

export type PersistedProjectStateV1 = {
  version: "1";
  savedAt: string;
  project: WorkspaceProjectState;
};

export type PersistedWorkspaceStateV1 = {
  version: "1";
  savedAt: string;
  workspace: WorkspaceState;
};

export type WorkspacePersistenceAdapter = {
  save: (key: string, value: string) => void;
  load: (key: string) => string | null;
  remove?: (key: string) => void;
  listKeys?: (prefix: string) => string[];
};

const WORKSPACE_KEY = "nexora.workspace.state.v1";
const PROJECT_KEY_PREFIX = "nexora.project.state.v1:";

function nowIso(): string {
  return new Date().toISOString();
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function ensureProjectState(raw: unknown, fallbackId = DEFAULT_PROJECT_ID): WorkspaceProjectState {
  const record = readRecord(raw);
  const id = String(record.id ?? fallbackId).trim() || fallbackId;
  const base = createEmptyProjectState(id, String(record.name ?? id));
  const chat = readRecord(record.chat);
  const scene = readRecord(record.scene);
  const intelligence = readRecord(record.intelligence);
  return {
    ...base,
    ...record,
    id,
    name: String((record.name ?? base.name) || id),
    domain: typeof record.domain === "string" ? record.domain : undefined,
    description: typeof record.description === "string" ? record.description : undefined,
    semanticObjectMeta: record.semanticObjectMeta && typeof record.semanticObjectMeta === "object" ? record.semanticObjectMeta as WorkspaceProjectState["semanticObjectMeta"] : {},
    chat: {
      ...base.chat,
      ...chat,
      messages: Array.isArray(chat.messages) ? chat.messages as WorkspaceProjectState["chat"]["messages"] : base.chat.messages,
      activeMode: typeof chat.activeMode === "string" ? chat.activeMode : base.chat.activeMode,
      episodeId: typeof chat.episodeId === "string" ? chat.episodeId : null,
    },
    scene: {
      ...base.scene,
      ...scene,
      loops: Array.isArray(scene.loops) ? scene.loops as WorkspaceProjectState["scene"]["loops"] : base.scene.loops,
      objectUxById:
        scene.objectUxById && typeof scene.objectUxById === "object"
          ? scene.objectUxById as WorkspaceProjectState["scene"]["objectUxById"]
          : base.scene.objectUxById,
      overrides:
        scene.overrides && typeof scene.overrides === "object"
          ? scene.overrides as WorkspaceProjectState["scene"]["overrides"]
          : base.scene.overrides,
    },
    intelligence: {
      ...base.intelligence,
      ...intelligence,
      conflicts: Array.isArray(intelligence.conflicts) ? intelligence.conflicts : base.intelligence.conflicts,
    },
  };
}

export function serializeProjectState(project: WorkspaceProjectState): PersistedProjectStateV1 {
  return {
    version: "1",
    savedAt: nowIso(),
    project: ensureProjectState(project, project?.id ?? DEFAULT_PROJECT_ID),
  };
}

export function deserializeProjectState(raw: unknown, fallbackId = DEFAULT_PROJECT_ID): WorkspaceProjectState | null {
  const parsed = raw as PersistedProjectStateV1 | null;
  if (!parsed || typeof parsed !== "object") return null;
  if (parsed.version !== "1") return null;
  return ensureProjectState(parsed.project, fallbackId);
}

export function serializeWorkspaceState(state: WorkspaceState): PersistedWorkspaceStateV1 {
  const activeProjectId = String(state?.activeProjectId ?? DEFAULT_PROJECT_ID).trim() || DEFAULT_PROJECT_ID;
  const projectsRaw = state?.projects && typeof state.projects === "object" ? state.projects : {};
  const projects: Record<string, WorkspaceProjectState> = {};
  Object.entries(projectsRaw).forEach(([key, value]) => {
    const pid = String(key || value?.id || DEFAULT_PROJECT_ID);
    projects[pid] = ensureProjectState(value, pid);
  });

  if (!projects[activeProjectId]) {
    projects[activeProjectId] = createEmptyProjectState(activeProjectId, activeProjectId);
  }

  return {
    version: "1",
    savedAt: nowIso(),
    workspace: {
      id: String(state?.id ?? DEFAULT_WORKSPACE_ID),
      activeProjectId,
      projects,
    },
  };
}

export function deserializeWorkspaceState(raw: unknown): WorkspaceState | null {
  const parsed = raw as PersistedWorkspaceStateV1 | null;
  if (!parsed || typeof parsed !== "object") return null;
  if (parsed.version !== "1") return null;
  const ws = readRecord(parsed.workspace);
  if (!ws || typeof ws !== "object") return null;
  const activeProjectId = String(ws.activeProjectId ?? DEFAULT_PROJECT_ID).trim() || DEFAULT_PROJECT_ID;
  const id = String(ws.id ?? DEFAULT_WORKSPACE_ID).trim() || DEFAULT_WORKSPACE_ID;
  const projectsRaw = ws.projects && typeof ws.projects === "object" ? ws.projects : {};
  const projects: Record<string, WorkspaceProjectState> = {};
  Object.entries(projectsRaw).forEach(([key, value]) => {
    projects[key] = ensureProjectState(value, key);
  });
  if (!projects[activeProjectId]) {
    projects[activeProjectId] = createEmptyProjectState(activeProjectId, activeProjectId);
  }
  return { id, activeProjectId, projects };
}

export function createLocalStorageWorkspaceAdapter(): WorkspacePersistenceAdapter {
  return {
    save: (key, value) => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // ignore
      }
    },
    load: (key) => {
      if (typeof window === "undefined") return null;
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    remove: (key) => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    },
    listKeys: (prefix) => {
      if (typeof window === "undefined") return [];
      try {
        const keys: string[] = [];
        for (let i = 0; i < window.localStorage.length; i += 1) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(prefix)) keys.push(key);
        }
        return keys;
      } catch {
        return [];
      }
    },
  };
}

export function saveWorkspaceSnapshot(
  state: WorkspaceState,
  adapter: WorkspacePersistenceAdapter = createLocalStorageWorkspaceAdapter()
): void {
  const payload = serializeWorkspaceState(state);
  adapter.save(WORKSPACE_KEY, JSON.stringify(payload));
}

export function loadWorkspaceSnapshot(
  adapter: WorkspacePersistenceAdapter = createLocalStorageWorkspaceAdapter()
): WorkspaceState | null {
  const parsed = safeParse<PersistedWorkspaceStateV1>(adapter.load(WORKSPACE_KEY));
  return deserializeWorkspaceState(parsed);
}

export function saveProjectSnapshot(
  project: WorkspaceProjectState,
  adapter: WorkspacePersistenceAdapter = createLocalStorageWorkspaceAdapter()
): void {
  const payload = serializeProjectState(project);
  const id = String(project?.id ?? DEFAULT_PROJECT_ID).trim() || DEFAULT_PROJECT_ID;
  adapter.save(`${PROJECT_KEY_PREFIX}${id}`, JSON.stringify(payload));
}

export function loadProjectSnapshot(
  projectId: string,
  adapter: WorkspacePersistenceAdapter = createLocalStorageWorkspaceAdapter()
): WorkspaceProjectState | null {
  const id = String(projectId || DEFAULT_PROJECT_ID).trim() || DEFAULT_PROJECT_ID;
  const parsed = safeParse<PersistedProjectStateV1>(adapter.load(`${PROJECT_KEY_PREFIX}${id}`));
  return deserializeProjectState(parsed, id);
}

export function listSavedProjectIds(
  adapter: WorkspacePersistenceAdapter = createLocalStorageWorkspaceAdapter()
): string[] {
  const keys = adapter.listKeys?.(PROJECT_KEY_PREFIX) ?? [];
  return keys
    .map((k) => k.slice(PROJECT_KEY_PREFIX.length).trim())
    .filter(Boolean);
}
