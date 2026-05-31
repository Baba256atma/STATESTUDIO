import type { WorkspaceViewMode } from "./workspaceViewModeTypes";
import {
  hydrateExecutiveNavigationPreference,
  persistExecutiveNavigationPreference,
  type ExecutiveNavigationPreference,
} from "./executiveNavigationPersistence";

/** @deprecated Use executiveNavigationPersistence */
export type WorkspaceViewModePreference = Pick<
  ExecutiveNavigationPreference,
  "selectedMode" | "lastCameraProfile" | "preferredViewMode"
>;

/** @deprecated Use EXECUTIVE_NAVIGATION_STORAGE_KEY */
export const WORKSPACE_VIEW_MODE_STORAGE_KEY = "nexora:workspace-view-mode";

export function persistWorkspaceViewModePreference(preference: WorkspaceViewModePreference): void {
  const current = hydrateExecutiveNavigationPreference();
  persistExecutiveNavigationPreference({ ...current, ...preference });
}

export function hydrateWorkspaceViewModePreference(): WorkspaceViewModePreference {
  const preference = hydrateExecutiveNavigationPreference();
  return {
    selectedMode: preference.selectedMode,
    lastCameraProfile: preference.lastCameraProfile,
    preferredViewMode: preference.preferredViewMode,
  };
}

export function clearWorkspaceViewModePreferenceForTests(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem("nexora:executive-navigation");
    window.localStorage.removeItem(WORKSPACE_VIEW_MODE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export type { WorkspaceViewMode };
