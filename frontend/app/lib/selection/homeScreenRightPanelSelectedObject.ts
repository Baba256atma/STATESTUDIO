export const CHECKPOINT1_FIX4_HOMESCREEN_SELECTED_OBJECT_TAGS = Object.freeze([
  "[CHECKPOINT1_FIX4_HOMESCREEN_SELECTED_OBJECT_PROP]",
  "[READONLY_SELECTION_PASSED_TO_RIGHT_PANEL]",
  "[OBJECT_PANEL_PROP_WIRING_FIXED]",
  "[NO_ROUTE_COMMIT_REINTRODUCED]",
  "[CHECKPOINT1_FIX4_COMPLETE]",
] as const);

function normalizeSelectedObjectId(value: string | null | undefined): string | null {
  const normalized = String(value ?? "").trim();
  return normalized || null;
}

export function resolveRightPanelSelectedObjectId(input: {
  canonicalSelectedId?: string | null;
  selectedObjectIdState?: string | null;
}): string | null {
  return (
    normalizeSelectedObjectId(input.canonicalSelectedId) ??
    normalizeSelectedObjectId(input.selectedObjectIdState)
  );
}
