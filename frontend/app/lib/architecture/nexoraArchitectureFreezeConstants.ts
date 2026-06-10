/** Frozen architecture constants shared without runtime side effects. */

export const CANONICAL_OBJECT_SELECTION_OWNER = "HomeScreen.selectedObjectIdState";

export const ALLOWED_MAIN_RIGHT_PANEL_RUNTIME_VIEWS = Object.freeze(["dashboard"] as const);

export function isDeprecatedRightRailRuntimeSurface(view: unknown): boolean {
  if (view == null || view === "") return false;
  if (typeof view !== "string") return false;
  return view.trim().toLowerCase() !== "dashboard";
}
