/**
 * Persistence prep for HomeScreen: bundles, picks, and normalizations only.
 * No React state, no scene mutation — HomeScreen owns setters and sequencing.
 *
 * Also owns import/export/backup *prep* (parse → workspace import, export JSON shaping, backup V1 assembly,
 * restore-preview line bundles). Apply order and file/backup I/O stay in HomeScreen.
 *
 * `readSessionIdForPersistence` is also the single read path for SESSION_KEY used from the shell
 * (snapshots, backup build, backend user id bootstrap, dev replay) so session reads stay consistent.
 */

import type { HUDTabKey } from "../components/HUDShell";
import type { SceneJson, SceneLoop } from "../lib/sceneTypes";
import {
  createEmptyProjectState,
  inferProjectMetaFromScene,
  type WorkspaceProjectState,
  type WorkspaceState,
} from "../lib/workspace/workspaceModel";
import {
  exportProjectFile,
  importProjectFileToWorkspace,
  parseImportedProjectFile,
  type ImportResult,
} from "../lib/workspace/projectTransfer";
import type { Msg, PersistedProject, BackupV1 } from "./homeScreenUtils";
import { SESSION_KEY, normalizeMessages, normalizeSceneJson } from "./homeScreenUtils";
import { buildBackup as buildBackupV1Core, buildRestorePreviewLines } from "./backupController";

export function readSessionIdForPersistence(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function buildPersistedProjectSnapshot(args: {
  activeMode: string;
  sceneJson: SceneJson | null;
  messages: Msg[];
  savedAt?: string;
}): PersistedProject {
  return {
    version: "1",
    savedAt: args.savedAt ?? new Date().toISOString(),
    sessionId: readSessionIdForPersistence(),
    activeMode: args.activeMode,
    sceneJson: args.sceneJson,
    messages: args.messages,
  };
}

/** After undo pop: refresh savedAt before writing back to primary project store. */
export function withPersistedProjectSavedAt(
  prev: PersistedProject,
  savedAt: string = new Date().toISOString()
): PersistedProject {
  return { ...prev, savedAt };
}

export function pickWorkspaceProjectForHydrate(
  projects: Record<string, WorkspaceProjectState> | undefined | null,
  activeProjectId: string,
  fallbackProjectId: string
): WorkspaceProjectState | null {
  if (!projects || typeof projects !== "object") return null;
  const direct = projects[activeProjectId];
  if (direct) return direct;
  const firstKey = Object.keys(projects)[0] ?? fallbackProjectId;
  return projects[firstKey] ?? null;
}

/** Shape localStorage PersistedProject into workspace project state (matches HomeScreen hydrate). */
export function buildWorkspaceProjectStateFromLoadedProject(
  loaded: PersistedProject,
  defaultProjectId: string
): WorkspaceProjectState {
  const loadedScene = loaded.sceneJson ? normalizeSceneJson(loaded.sceneJson) : null;
  const inferred = inferProjectMetaFromScene(loadedScene);
  const loadedProjectId = inferred.projectId || defaultProjectId;
  const empty = createEmptyProjectState(loadedProjectId, inferred.name || loadedProjectId);
  return {
    ...empty,
    id: loadedProjectId,
    name: inferred.name || loadedProjectId,
    domain: inferred.domain,
    chat: {
      messages: normalizeMessages(loaded.messages),
      activeMode: loaded.activeMode ?? "business",
      episodeId: null,
    },
    scene: {
      ...empty.scene,
      sceneJson: loadedScene,
    },
  };
}

export function prepareUndoHistoryPop(history: PersistedProject[]): {
  nextHistory: PersistedProject[];
  target: PersistedProject;
} | null {
  if (history.length < 2) return null;
  const nextHistory = history.slice(0, -1);
  const target = nextHistory[nextHistory.length - 1];
  if (!target) return null;
  return { nextHistory, target };
}

/** HUD tab normalization when applying BackupV1 (shell-only tabs fall back to decisions). */
export function resolveHudTabAfterBackupRestore(
  hudTab: HUDTabKey | string | null | undefined,
  fallback: HUDTabKey = "decisions"
): HUDTabKey {
  if (
    hudTab &&
    hudTab !== "chat" &&
    hudTab !== "object" &&
    hudTab !== "scene" &&
    hudTab !== "loops" &&
    hudTab !== "kpi" &&
    hudTab !== "decisions"
  ) {
    return hudTab as HUDTabKey;
  }
  return fallback;
}

/** Assembles BackupV1 using current shell fields; session id from persistence reader unless overridden. */
export function buildScreenBackupV1(
  params: Omit<Parameters<typeof buildBackupV1Core>[0], "sessionId"> & { sessionId?: string | null }
): BackupV1 {
  return buildBackupV1Core({
    ...params,
    sessionId: params.sessionId ?? readSessionIdForPersistence(),
  });
}

/** Workspace envelope passed into `importProjectFileToWorkspace` (current workspace + active project snapshot). */
export function buildWorkspaceStateForProjectImport(args: {
  workspaceId: string;
  activeProjectId: string;
  workspaceProjects: Record<string, WorkspaceProjectState>;
  activeProjectSnapshot: WorkspaceProjectState;
}): WorkspaceState {
  return {
    id: args.workspaceId,
    activeProjectId: args.activeProjectId,
    projects: {
      ...args.workspaceProjects,
      [args.activeProjectId]: args.activeProjectSnapshot,
    },
  };
}

export type ProjectImportPrepareResult =
  | { ok: true; importResult: ImportResult; parseWarnings: string[] }
  | { ok: false; errorMessage: string };

/** Parse file text → normalized project file → import into workspace (no React, no I/O beyond parsing). */
export function prepareProjectImportFromFileText(
  fileText: string,
  workspace: WorkspaceState,
  opts?: { activate?: boolean; collision?: "rename" | "overwrite" }
): ProjectImportPrepareResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(fileText);
  } catch {
    return { ok: false, errorMessage: "Invalid JSON in project file." };
  }
  const normalized = parseImportedProjectFile(parsed);
  if (!normalized.file) {
    return { ok: false, errorMessage: normalized.errors[0] ?? "Invalid project file" };
  }
  const importResult = importProjectFileToWorkspace(workspace, normalized.file, opts);
  if (!importResult.ok) {
    return { ok: false, errorMessage: importResult.errors[0] ?? "Import failed" };
  }
  return { ok: true, importResult, parseWarnings: normalized.warnings };
}

export function composeImportWarningAssistantText(parseWarnings: string[], importWarnings: string[]): string | null {
  const warnings = [...parseWarnings, ...importWarnings].filter(Boolean);
  return warnings.length ? `Project imported with notes: ${warnings.join(" ")}` : null;
}

export function messageImportUnknownError(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string" && m.trim()) return m;
  }
  return "Import failed";
}

export type RestorePreviewContents = { backup: BackupV1; lines: string[] };

export function buildBackupRestorePreviewContents(args: {
  backup: BackupV1;
  activeCompanyId: string;
  activeMode: string;
  activeTemplateId: string;
  hudTab: HUDTabKey;
  loops: SceneLoop[];
  activeLoopId: string | null;
  selectedLoopId: string | null;
  focusedId: string | null;
  focusMode: "all" | "selected";
  focusPinned: boolean;
  selectedObjectId: string | null;
  messagesLen: number;
  overridesKeysCount: number;
}): RestorePreviewContents {
  const lines = buildRestorePreviewLines({
    activeCompanyId: args.activeCompanyId,
    activeMode: args.activeMode,
    activeTemplateId: args.activeTemplateId,
    hudTab: args.hudTab,
    loops: args.loops,
    activeLoopId: args.activeLoopId,
    selectedLoopId: args.selectedLoopId,
    focusedId: args.focusedId,
    focusMode: args.focusMode,
    focusPinned: args.focusPinned,
    selectedObjectId: args.selectedObjectId,
    messagesLen: args.messagesLen,
    overridesKeysCount: args.overridesKeysCount,
    backup: args.backup,
  });
  return { backup: args.backup, lines };
}

export function prepareWorkspaceProjectExportJson(project: WorkspaceProjectState): {
  json: string;
  filename: string;
  mimeType: string;
} {
  const exported = exportProjectFile(project);
  const filename = `${project.id || "nexora"}-project.nexora.json`;
  return {
    json: JSON.stringify(exported.file, null, 2),
    filename,
    mimeType: "application/json",
  };
}
