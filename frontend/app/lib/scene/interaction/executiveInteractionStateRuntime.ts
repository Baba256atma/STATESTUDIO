import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";

export type ExecutiveInteractionState = {
  hoveredObjectId: string | null;
  selectedObjectId: string | null;
  focusedObjectId: string | null;
  viewMode: WorkspaceViewMode;
  orbitActive: boolean;
  panActive: boolean;
  zoomActive: boolean;
};

const DEFAULT_STATE: ExecutiveInteractionState = {
  hoveredObjectId: null,
  selectedObjectId: null,
  focusedObjectId: null,
  viewMode: "3D",
  orbitActive: false,
  panActive: false,
  zoomActive: false,
};

let state: ExecutiveInteractionState = { ...DEFAULT_STATE };
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function getExecutiveInteractionState(): ExecutiveInteractionState {
  return state;
}

export function getExecutiveInteractionStateSnapshot(): ExecutiveInteractionState {
  return state;
}

export function getExecutiveInteractionStateServerSnapshot(): ExecutiveInteractionState {
  return state;
}

export function subscribeExecutiveInteractionState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function buildExecutiveInteractionSignature(
  next: Partial<ExecutiveInteractionState>
): string {
  return JSON.stringify({
    hoveredObjectId: next.hoveredObjectId ?? state.hoveredObjectId,
    selectedObjectId: next.selectedObjectId ?? state.selectedObjectId,
    focusedObjectId: next.focusedObjectId ?? state.focusedObjectId,
    viewMode: next.viewMode ?? state.viewMode,
    orbitActive: next.orbitActive ?? state.orbitActive,
    panActive: next.panActive ?? state.panActive,
    zoomActive: next.zoomActive ?? state.zoomActive,
  });
}

export function patchExecutiveInteractionState(
  patch: Partial<ExecutiveInteractionState>
): ExecutiveInteractionState {
  const next: ExecutiveInteractionState = {
    hoveredObjectId:
      patch.hoveredObjectId !== undefined ? patch.hoveredObjectId : state.hoveredObjectId,
    selectedObjectId:
      patch.selectedObjectId !== undefined ? patch.selectedObjectId : state.selectedObjectId,
    focusedObjectId:
      patch.focusedObjectId !== undefined ? patch.focusedObjectId : state.focusedObjectId,
    viewMode: patch.viewMode ?? state.viewMode,
    orbitActive: patch.orbitActive ?? state.orbitActive,
    panActive: patch.panActive ?? state.panActive,
    zoomActive: patch.zoomActive ?? state.zoomActive,
  };
  const signature = buildExecutiveInteractionSignature(next);
  const previousSignature = buildExecutiveInteractionSignature(state);
  if (signature === previousSignature) return state;
  state = next;
  emit();
  return state;
}

export function resetExecutiveInteractionStateForTests(): void {
  state = { ...DEFAULT_STATE };
  listeners.clear();
}
