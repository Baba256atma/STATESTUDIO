import type { DecisionPipelineState } from "./decisionPipelineTypes";

const DEFAULT_LIMIT = 20;

function key(workspaceId?: string | null, projectId?: string | null) {
  return `nexora.decisionPipeline.${String(workspaceId || "default_workspace")}.${String(projectId || "default_project")}`;
}

export function loadDecisionPipelineSnapshots(
  workspaceId?: string | null,
  projectId?: string | null
): DecisionPipelineState[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key(workspaceId, projectId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDecisionPipelineSnapshots(
  workspaceId: string | null | undefined,
  projectId: string | null | undefined,
  entries: DecisionPipelineState[]
) {
  if (typeof window === "undefined") return entries;
  const next = [...entries]
    .sort((a, b) => Number(b.updated_at || 0) - Number(a.updated_at || 0))
    .slice(0, DEFAULT_LIMIT);
  try {
    window.localStorage.setItem(key(workspaceId, projectId), JSON.stringify(next));
  } catch {
    return next;
  }
  return next;
}

export function appendDecisionPipelineSnapshot(params: {
  workspaceId?: string | null;
  projectId?: string | null;
  snapshot: DecisionPipelineState | null;
  existing?: DecisionPipelineState[];
}) {
  const current = params.existing ?? loadDecisionPipelineSnapshots(params.workspaceId, params.projectId);
  if (!params.snapshot) return current;
  const deduped = current.filter((entry) => entry.decision_id !== params.snapshot?.decision_id);
  return saveDecisionPipelineSnapshots(params.workspaceId, params.projectId, [params.snapshot, ...deduped]);
}
