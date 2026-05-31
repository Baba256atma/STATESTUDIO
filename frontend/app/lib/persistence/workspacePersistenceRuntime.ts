import { hydrateOverlayVisibilityFromStorage } from "../overlay/overlayRuntime";
import { setWorkspaceViewMode } from "../workspace/workspaceViewModeRuntime";
import { isWorkspaceViewMode } from "../workspace/workspaceViewModeTypes";
import {
  hydrateExecutiveFocusMode,
  setExecutiveFocusModeEnabled,
  setExecutiveFocusProfile,
} from "../workspace/executiveFocusModeRuntime";
import { isFocusModeProfileId } from "../workspace/focusModeProfiles";
import type { OverlayRuntimeVisibility } from "../overlay/overlayContracts";
import { persistHudPreferences } from "../ui/hudPreferencesStore";
import { persistThemeMode } from "../ui/nexoraUiTheme";
import { persistWorkspaceLayoutPreset } from "../ui/workspaceLayoutStore";
import type { WorkspaceLayoutPreset } from "../ui/workspaceLayoutTypes";
import { deserializeWorkspaceToScene, toWorkspacePreview } from "./workspaceDeserializer";
import {
  logWorkspaceLoaded,
  logWorkspaceSaved,
  logWorkspaceValidated,
  logWorkspaceVersionChecked,
} from "./workspacePersistenceInstrumentation";
import { validateSavedWorkspace } from "./workspacePersistenceValidation";
import type {
  LoadWorkspaceResult,
  SaveWorkspaceRequest,
  SaveWorkspaceResult,
  SavedWorkspace,
  SavedWorkspaceSummary,
  SavedWorkspaceViewPreferences,
} from "./workspacePersistenceTypes";
import {
  resolveDefaultWorkspaceName,
  serializeWorkspace,
  serializeWorkspaceForUpdate,
} from "./workspaceSerializer";
import {
  getWorkspacePersistenceVersion,
  isSupportedWorkspaceVersion,
  migrateSavedWorkspace,
} from "./workspaceVersioning";

export const WORKSPACE_PERSISTENCE_INDEX_KEY = "nexora.executive.saved-workspaces.v1";

type WorkspacePersistenceIndex = {
  version: string;
  workspaces: SavedWorkspace[];
};

function readIndex(): WorkspacePersistenceIndex {
  if (typeof window === "undefined") {
    return { version: getWorkspacePersistenceVersion(), workspaces: [] };
  }
  try {
    const raw = window.localStorage.getItem(WORKSPACE_PERSISTENCE_INDEX_KEY);
    if (!raw) return { version: getWorkspacePersistenceVersion(), workspaces: [] };
    const parsed = JSON.parse(raw) as WorkspacePersistenceIndex;
    if (!parsed || !Array.isArray(parsed.workspaces)) {
      return { version: getWorkspacePersistenceVersion(), workspaces: [] };
    }
    return parsed;
  } catch {
    return { version: getWorkspacePersistenceVersion(), workspaces: [] };
  }
}

function writeIndex(index: WorkspacePersistenceIndex): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WORKSPACE_PERSISTENCE_INDEX_KEY, JSON.stringify(index));
  } catch {
    // ignore storage failures
  }
}

export function listSavedWorkspaces(): SavedWorkspaceSummary[] {
  return readIndex()
    .workspaces.map(toWorkspacePreview)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

export function getSavedWorkspace(workspaceId: string): SavedWorkspace | null {
  const id = workspaceId.trim();
  if (!id) return null;
  return readIndex().workspaces.find((workspace) => workspace.id === id) ?? null;
}

export function saveWorkspace(request: SaveWorkspaceRequest): SaveWorkspaceResult {
  const startedAt = typeof performance !== "undefined" ? performance.now() : Date.now();
  const index = readIndex();
  const requestedName = (request.name ?? resolveDefaultWorkspaceName(request.sceneJson)).trim();
  const existing = index.workspaces.find(
    (workspace) => workspace.name.toLowerCase() === requestedName.toLowerCase()
  );

  const envelope = existing
    ? serializeWorkspaceForUpdate(existing, { ...request, name: requestedName })
    : serializeWorkspace({ ...request, name: requestedName });

  if (!envelope) {
    return { success: false, errors: ["invalid_scene"] };
  }

  const validation = validateSavedWorkspace(envelope.workspace);
  logWorkspaceValidated({
    workspaceId: envelope.workspace.id,
    valid: validation.valid,
    reason: validation.errors[0] ?? validation.warnings[0],
  });

  if (!validation.valid) {
    return { success: false, errors: validation.errors, warnings: validation.warnings };
  }

  const nextWorkspaces = existing
    ? index.workspaces.map((workspace) =>
        workspace.id === existing.id ? envelope.workspace : workspace
      )
    : [envelope.workspace, ...index.workspaces];

  writeIndex({
    version: getWorkspacePersistenceVersion(),
    workspaces: nextWorkspaces.slice(0, 24),
  });

  const durationMs = Math.round(
    (typeof performance !== "undefined" ? performance.now() : Date.now()) - startedAt
  );

  logWorkspaceSaved({
    workspaceId: envelope.workspace.id,
    workspaceName: envelope.workspace.name,
    objectCount: envelope.workspace.objects.length,
    relationshipCount: envelope.workspace.relationships.length,
    durationMs,
    version: envelope.workspace.version,
  });

  return {
    success: true,
    workspace: envelope.workspace,
    warnings: validation.warnings,
    durationMs,
  };
}

export function loadWorkspace(workspaceId: string, currentScene: unknown): LoadWorkspaceResult {
  const startedAt = typeof performance !== "undefined" ? performance.now() : Date.now();
  const stored = getSavedWorkspace(workspaceId);

  if (!stored) {
    return { success: false, errors: ["workspace_not_found"] };
  }

  const migrated = migrateSavedWorkspace(stored);
  const supported = isSupportedWorkspaceVersion(migrated.version);
  logWorkspaceVersionChecked({
    workspaceId: migrated.id,
    version: migrated.version,
    supported,
  });

  if (!supported) {
    return { success: false, errors: ["unsupported_workspace_version"] };
  }

  const validation = validateSavedWorkspace(migrated);
  logWorkspaceValidated({
    workspaceId: migrated.id,
    valid: validation.valid,
    reason: validation.errors[0] ?? validation.warnings[0],
  });

  if (!validation.valid) {
    return { success: false, errors: validation.errors, warnings: validation.warnings };
  }

  const nextScene = deserializeWorkspaceToScene(migrated, currentScene);
  const durationMs = Math.round(
    (typeof performance !== "undefined" ? performance.now() : Date.now()) - startedAt
  );

  logWorkspaceLoaded({
    workspaceId: migrated.id,
    workspaceName: migrated.name,
    objectCount: migrated.objects.length,
    relationshipCount: migrated.relationships.length,
    durationMs,
    version: migrated.version,
  });

  return {
    success: true,
    workspace: migrated,
    nextScene,
    viewPreferences: migrated.viewPreferences,
    warnings: validation.warnings,
    durationMs,
  };
}

export function applySavedViewPreferences(preferences: SavedWorkspaceViewPreferences | undefined): void {
  if (!preferences || typeof window === "undefined") return;

  if (preferences.themeMode) {
    persistThemeMode(preferences.themeMode);
    document.documentElement.setAttribute(
      "data-theme",
      preferences.themeMode === "day" ? "day" : preferences.themeMode === "night" ? "night" : document.documentElement.getAttribute("data-theme") ?? "night"
    );
  }

  if (preferences.layoutPreset) {
    persistWorkspaceLayoutPreset(preferences.layoutPreset as WorkspaceLayoutPreset);
    document.documentElement.setAttribute("data-nx-layout-preset", preferences.layoutPreset);
  }

  if (preferences.hudPreferences) {
    persistHudPreferences(preferences.hudPreferences);
  }

  if (preferences.overlayVisibility) {
    try {
      window.localStorage.setItem("nx-overlay-visibility", JSON.stringify(preferences.overlayVisibility));
      hydrateOverlayVisibilityFromStorage();
    } catch {
      // ignore
    }
  }

  if (isWorkspaceViewMode(preferences.workspaceViewMode)) {
    setWorkspaceViewMode(preferences.workspaceViewMode, "persistence");
  }

  if (typeof preferences.focusModeEnabled === "boolean") {
    setExecutiveFocusModeEnabled(preferences.focusModeEnabled, "persistence");
  } else {
    hydrateExecutiveFocusMode();
  }

  if (isFocusModeProfileId(preferences.focusProfile)) {
    setExecutiveFocusProfile(preferences.focusProfile, "persistence");
  }
}

export function deleteSavedWorkspace(workspaceId: string): boolean {
  const index = readIndex();
  const next = index.workspaces.filter((workspace) => workspace.id !== workspaceId);
  if (next.length === index.workspaces.length) return false;
  writeIndex({ ...index, workspaces: next });
  return true;
}

export type { SavedWorkspaceSummary, SavedWorkspaceViewPreferences };
