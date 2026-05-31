import type { WorkspaceViewMode } from "./workspaceViewModeTypes";
import { DEFAULT_WORKSPACE_VIEW_MODE, isWorkspaceViewMode } from "./workspaceViewModeTypes";
import { DEFAULT_FOCUS_MODE_PROFILE, isFocusModeProfileId, type FocusModeProfileId } from "./focusModeProfiles";

export const EXECUTIVE_NAVIGATION_STORAGE_KEY = "nexora:executive-navigation";

export type ExecutiveNavigationPreference = {
  selectedMode: WorkspaceViewMode;
  lastCameraProfile: WorkspaceViewMode;
  preferredViewMode: WorkspaceViewMode;
  focusModeEnabled: boolean;
  focusProfile: FocusModeProfileId;
};

const DEFAULT_PREFERENCE: ExecutiveNavigationPreference = Object.freeze({
  selectedMode: DEFAULT_WORKSPACE_VIEW_MODE,
  lastCameraProfile: DEFAULT_WORKSPACE_VIEW_MODE,
  preferredViewMode: DEFAULT_WORKSPACE_VIEW_MODE,
  focusModeEnabled: false,
  focusProfile: DEFAULT_FOCUS_MODE_PROFILE,
});

export function persistExecutiveNavigationPreference(patch: Partial<ExecutiveNavigationPreference>): void {
  if (typeof window === "undefined") return;
  try {
    const current = hydrateExecutiveNavigationPreference();
    const next: ExecutiveNavigationPreference = { ...current, ...patch };
    window.localStorage.setItem(EXECUTIVE_NAVIGATION_STORAGE_KEY, JSON.stringify(next));
    if (process.env.NODE_ENV !== "production") {
      globalThis.console?.debug?.("[Nexora][ViewPersistence]", next);
    }
  } catch {
    // Best-effort persistence only.
  }
}

export function hydrateExecutiveNavigationPreference(): ExecutiveNavigationPreference {
  if (typeof window === "undefined") return DEFAULT_PREFERENCE;
  try {
    const raw = window.localStorage.getItem(EXECUTIVE_NAVIGATION_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCE;
    const parsed = JSON.parse(raw) as Partial<ExecutiveNavigationPreference>;
    return {
      selectedMode: isWorkspaceViewMode(parsed.selectedMode) ? parsed.selectedMode : DEFAULT_WORKSPACE_VIEW_MODE,
      lastCameraProfile: isWorkspaceViewMode(parsed.lastCameraProfile)
        ? parsed.lastCameraProfile
        : DEFAULT_WORKSPACE_VIEW_MODE,
      preferredViewMode: isWorkspaceViewMode(parsed.preferredViewMode)
        ? parsed.preferredViewMode
        : DEFAULT_WORKSPACE_VIEW_MODE,
      focusModeEnabled: parsed.focusModeEnabled === true,
      focusProfile: isFocusModeProfileId(parsed.focusProfile) ? parsed.focusProfile : DEFAULT_FOCUS_MODE_PROFILE,
    };
  } catch {
    return DEFAULT_PREFERENCE;
  }
}

export function clearExecutiveNavigationPreferenceForTests(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(EXECUTIVE_NAVIGATION_STORAGE_KEY);
  } catch {
    // ignore
  }
}
