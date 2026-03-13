import {
  createEmptyProjectState,
  DEFAULT_PROJECT_ID,
  DEFAULT_WORKSPACE_ID,
  type WorkspaceProjectState,
  type WorkspaceState,
} from "./workspaceModel";

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

function ensureProjectState(raw: any, fallbackId = DEFAULT_PROJECT_ID): WorkspaceProjectState {
  const id = String(raw?.id ?? fallbackId).trim() || fallbackId;
  const base = createEmptyProjectState(id, String(raw?.name ?? id));
  return {
    ...base,
    ...raw,
    id,
    name: String((raw?.name ?? base.name) || id),
    domain: typeof raw?.domain === "string" ? raw.domain : undefined,
    description: typeof raw?.description === "string" ? raw.description : undefined,
    semanticObjectMeta: raw?.semanticObjectMeta && typeof raw.semanticObjectMeta === "object" ? raw.semanticObjectMeta : {},
    chat: {
      ...base.chat,
      ...(raw?.chat ?? {}),
      messages: Array.isArray(raw?.chat?.messages) ? raw.chat.messages : base.chat.messages,
      activeMode: typeof raw?.chat?.activeMode === "string" ? raw.chat.activeMode : base.chat.activeMode,
      episodeId: typeof raw?.chat?.episodeId === "string" ? raw.chat.episodeId : null,
    },
    scene: {
      ...base.scene,
      ...(raw?.scene ?? {}),
      loops: Array.isArray(raw?.scene?.loops) ? raw.scene.loops : base.scene.loops,
      objectUxById:
        raw?.scene?.objectUxById && typeof raw.scene.objectUxById === "object"
          ? raw.scene.objectUxById
          : base.scene.objectUxById,
      overrides:
        raw?.scene?.overrides && typeof raw.scene.overrides === "object"
          ? raw.scene.overrides
          : base.scene.overrides,
    },
    intelligence: {
      ...base.intelligence,
      ...(raw?.intelligence ?? {}),
      conflicts: Array.isArray(raw?.intelligence?.conflicts) ? raw.intelligence.conflicts : base.intelligence.conflicts,
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
  if ((parsed as any).version !== "1") return null;
  return ensureProjectState((parsed as any).project, fallbackId);
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
  if ((parsed as any).version !== "1") return null;
  const ws = (parsed as any).workspace;
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
