/**
 * E2:110 — Executive scene visibility policy for Type-C operational maps.
 */

export type ExecutiveObjectSelectionLike = {
  highlighted_objects?: string[];
  risk_sources?: string[];
  risk_targets?: string[];
  dim_unrelated_objects?: boolean;
} | null;

export type ResolveExecutiveRenderVisibilityInput = {
  objectCount: number;
  focusMode: "all" | "selected" | "pinned";
  focusPinned?: boolean;
  executiveFocusModeEnabled: boolean;
  /** Explicit narrative/simulation overlay requesting isolation. */
  forceDimUnrelated?: boolean;
};

export function isExecutiveOperationalObjectScene(objectCount: number): boolean {
  return objectCount >= 6 && objectCount <= 12;
}

/** Focus isolation applies only when executive Focus Mode is active or focus is pinned. */
export function shouldRestrictVisibilityToFocus(input: {
  focusMode: "all" | "selected" | "pinned";
  focusPinned?: boolean;
  executiveFocusModeEnabled: boolean;
}): boolean {
  if (input.focusPinned) return true;
  if (!input.executiveFocusModeEnabled) return false;
  return input.focusMode === "selected" || input.focusMode === "pinned";
}

/** Default Type-C: render all objects unless executive focus isolation is active. */
export function shouldRenderAllSceneObjects(input: {
  focusMode: "all" | "selected" | "pinned";
  selectedObjectId?: string | null;
  focusPinned?: boolean;
  executiveFocusModeEnabled: boolean;
}): boolean {
  if (input.focusPinned) return false;
  return !shouldRestrictVisibilityToFocus(input);
}

export function resolveExecutiveRenderFocusMode(input: {
  focusMode: "all" | "selected" | "pinned";
  focusPinned?: boolean;
  executiveFocusModeEnabled: boolean;
}): "all" | "selected" | "pinned" {
  if (!shouldRestrictVisibilityToFocus(input)) return "all";
  return input.focusMode;
}

export function sanitizeExecutiveObjectSelectionForRender(
  selection: ExecutiveObjectSelectionLike,
  input: ResolveExecutiveRenderVisibilityInput
): ExecutiveObjectSelectionLike {
  if (!selection) return null;

  const restrictToFocus = shouldRestrictVisibilityToFocus(input);
  const operationalScene = isExecutiveOperationalObjectScene(input.objectCount);
  const allowDim =
    input.forceDimUnrelated === true ||
    (restrictToFocus && selection.dim_unrelated_objects === true);

  if (!operationalScene && !allowDim) {
    return selection.dim_unrelated_objects === true
      ? { ...selection, dim_unrelated_objects: false }
      : selection;
  }

  if (!allowDim) {
    return {
      ...selection,
      dim_unrelated_objects: false,
    };
  }

  return selection;
}

export function extractSceneObjectIds(sceneJson: unknown): string[] {
  const record = sceneJson as { scene?: { objects?: unknown[] } } | null | undefined;
  const objects = Array.isArray(record?.scene?.objects) ? record.scene.objects : [];
  return objects
    .map((obj, index) => {
      const item = obj as { id?: unknown; name?: unknown; type?: unknown };
      return String(item?.id ?? item?.name ?? `${item?.type ?? "obj"}:${index}`).trim();
    })
    .filter(Boolean);
}
