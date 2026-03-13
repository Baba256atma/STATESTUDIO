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
  overrides: Record<string, any>;
};

export type ProjectIntelligenceState = {
  kpi: any | null;
  conflicts: any[];
  objectSelection: any | null;
  memoryInsights: any | null;
  riskPropagation: any | null;
  strategicAdvice: any | null;
  strategyKpi: any | null;
  decisionCockpit: any | null;
  productModeContext: any | null;
  aiReasoning: any | null;
  platformAssembly: any | null;
  autonomousExploration: any | null;
  opponentModel: any | null;
  strategicPatterns: any | null;
  responseData: any | null;
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
  chat: {
    messages: WorkspaceMsg[];
    activeMode: string;
    episodeId: string | null;
  };
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
const WORKSPACE_STORE_KEY = "nexora.workspace.v1";

export function inferProjectMetaFromScene(sceneJson: SceneJson | null): {
  projectId: string;
  name: string;
  domain?: string;
} {
  const meta: any = sceneJson?.meta ?? {};
  const fromMeta =
    String(meta?.project_id ?? meta?.demo_id ?? meta?.workspace_project_id ?? "")
      .trim()
      .toLowerCase() || DEFAULT_PROJECT_ID;
  const name =
    String(meta?.project_name ?? meta?.demo_name ?? fromMeta)
      .trim() || fromMeta;
  const domain = String(meta?.domain ?? "").trim() || undefined;
  return { projectId: fromMeta, name, domain };
}

export function createEmptyProjectState(projectId: string, name?: string): WorkspaceProjectState {
  return {
    id: projectId,
    name: name || projectId,
    chat: {
      messages: [],
      activeMode: "business",
      episodeId: null,
    },
    scene: {
      sceneJson: null,
      selectedObjectId: null,
      focusedId: null,
      focusMode: "all",
      focusPinned: false,
      loops: [],
      activeLoopId: null,
      selectedLoopId: null,
      objectUxById: {},
      overrides: {},
    },
    intelligence: {
      kpi: null,
      conflicts: [],
      objectSelection: null,
      memoryInsights: null,
      riskPropagation: null,
      strategicAdvice: null,
      strategyKpi: null,
      decisionCockpit: null,
      productModeContext: null,
      aiReasoning: null,
      platformAssembly: null,
      autonomousExploration: null,
      opponentModel: null,
      strategicPatterns: null,
      responseData: null,
      sourceLabel: null,
      lastAnalysisSummary: null,
    },
  };
}

export function loadWorkspaceState(): WorkspaceState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(WORKSPACE_STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const id = String((parsed as any).id ?? DEFAULT_WORKSPACE_ID);
    const activeProjectId = String((parsed as any).activeProjectId ?? DEFAULT_PROJECT_ID);
    const projects = (parsed as any).projects;
    if (!projects || typeof projects !== "object") return null;
    return {
      id,
      activeProjectId,
      projects,
    } as WorkspaceState;
  } catch {
    return null;
  }
}

export function saveWorkspaceState(state: WorkspaceState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WORKSPACE_STORE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}
