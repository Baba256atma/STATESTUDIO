import type { ExecutiveFocusWorkspaceInput, ExecutiveFocusWorkspaceState } from "./executiveDensityTypes";
import { logExecutiveFocusWorkspace } from "./executiveDensityInstrumentation";

function normalizeIds(ids?: string[]): Set<string> {
  return new Set((ids ?? []).map((id) => String(id).trim()).filter(Boolean));
}

/** Resolve per-object emphasis while preserving unrelated context in the scene. */
export function resolveExecutiveFocusWorkspaceState(
  input: ExecutiveFocusWorkspaceInput
): ExecutiveFocusWorkspaceState {
  const objectId = input.objectId.trim();
  const selectedId = input.selectedObjectId?.trim() ?? null;
  const focusedId = input.focusedObjectId?.trim() ?? null;
  const activeFocusId = selectedId ?? focusedId;
  const related = normalizeIds(input.relatedObjectIds);
  const dependencies = normalizeIds(input.dependencyObjectIds);

  if (!activeFocusId) {
    return {
      active: false,
      emphasis: 1,
      opacity: 1,
      scaleMultiplier: 1,
    };
  }

  const isSelected = objectId === selectedId;
  const isFocused = objectId === focusedId;
  const isRelated = related.has(objectId) || dependencies.has(objectId);
  const isActiveTarget = objectId === activeFocusId || isSelected || isFocused;

  let state: ExecutiveFocusWorkspaceState;
  if (isActiveTarget) {
    state = {
      active: true,
      emphasis: 1.08,
      opacity: 1,
      scaleMultiplier: 1.06,
      labelModeOverride: "FULL",
    };
  } else if (isRelated) {
    state = {
      active: true,
      emphasis: 0.96,
      opacity: 0.88,
      scaleMultiplier: 1,
      labelModeOverride: "CONDENSED",
    };
  } else {
    state = {
      active: true,
      emphasis: 0.72,
      opacity: 0.62,
      scaleMultiplier: 0.94,
      labelModeOverride: "MINIMAL",
    };
  }

  logExecutiveFocusWorkspace({
    objectId,
    activeFocusId,
    isActiveTarget,
    isRelated,
    emphasis: state.emphasis,
    opacity: state.opacity,
    scaleMultiplier: state.scaleMultiplier,
  });

  return state;
}
