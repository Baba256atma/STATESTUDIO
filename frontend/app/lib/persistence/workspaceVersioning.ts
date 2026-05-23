import type { SavedWorkspace } from "./workspacePersistenceTypes";

export const WORKSPACE_PERSISTENCE_VERSION = "1";

export type WorkspaceMigrationContext = {
  fromVersion: string;
  toVersion: string;
};

export type WorkspaceMigration = {
  fromVersion: string;
  toVersion: string;
  migrate: (workspace: SavedWorkspace) => SavedWorkspace;
};

const migrations: WorkspaceMigration[] = [];

export function getWorkspacePersistenceVersion(): string {
  return WORKSPACE_PERSISTENCE_VERSION;
}

export function migrateSavedWorkspace(workspace: SavedWorkspace): SavedWorkspace {
  let current = { ...workspace, version: workspace.version || "0" };
  const target = WORKSPACE_PERSISTENCE_VERSION;

  if (current.version === target) return current;

  for (const migration of migrations) {
    if (current.version === migration.fromVersion) {
      current = migration.migrate(current);
    }
  }

  if (current.version !== target) {
    return { ...current, version: target };
  }

  return current;
}

export function isSupportedWorkspaceVersion(version: string | undefined): boolean {
  if (!version) return false;
  return version === WORKSPACE_PERSISTENCE_VERSION;
}
