const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

function devLogEvent(event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.(event, payload ?? {});
}

export function logWorkspaceSaved(payload: {
  workspaceId: string;
  workspaceName: string;
  objectCount: number;
  relationshipCount: number;
  durationMs: number;
  version: string;
}): void {
  devLogEvent("[Nexora][WorkspaceSaved]", payload);
}

export function logWorkspaceLoaded(payload: {
  workspaceId: string;
  workspaceName: string;
  objectCount: number;
  relationshipCount: number;
  durationMs: number;
  version: string;
}): void {
  devLogEvent("[Nexora][WorkspaceLoaded]", payload);
}

export function logWorkspaceSerialized(payload: {
  workspaceId: string;
  objectCount: number;
  relationshipCount: number;
}): void {
  devLogOnce(`workspace-serialized-${payload.workspaceId}`, "[Nexora][WorkspaceSerialized]", payload);
}

export function logWorkspaceDeserialized(payload: {
  workspaceId: string;
  objectCount: number;
  relationshipCount: number;
}): void {
  devLogOnce(`workspace-deserialized-${payload.workspaceId}`, "[Nexora][WorkspaceDeserialized]", payload);
}

export function logWorkspaceValidated(payload: {
  workspaceId?: string;
  valid: boolean;
  reason?: string;
}): void {
  devLogOnce(
    `workspace-validated-${payload.workspaceId ?? "unknown"}-${payload.valid}`,
    "[Nexora][WorkspaceValidated]",
    payload
  );
}

export function logWorkspaceRestored(payload: {
  workspaceId: string;
  objectCount: number;
  relationshipCount: number;
}): void {
  devLogEvent("[Nexora][WorkspaceRestored]", payload);
}

export function logWorkspaceVersionChecked(payload: {
  workspaceId: string;
  version: string;
  supported: boolean;
}): void {
  devLogOnce(
    `workspace-version-${payload.workspaceId}-${payload.version}`,
    "[Nexora][WorkspaceVersionChecked]",
    payload
  );
}

export function resetWorkspacePersistenceInstrumentationForTests(): void {
  loggedKeys.clear();
}
