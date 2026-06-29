/**
 * APP-4:8 — Workspace registry for context memory orphan prevention.
 */

import type {
  ExecutiveContextWorkspaceRegistration,
} from "./executiveContextMemoryTypes.ts";
import type { ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";

export type RegisteredExecutiveContextWorkspace = Readonly<{
  workspaceId: ExecutiveMemoryWorkspaceId;
  label: string | null;
  registeredAt: string;
  readOnly: true;
}>;

const registry = new Map<ExecutiveMemoryWorkspaceId, RegisteredExecutiveContextWorkspace>();

export function resetExecutiveContextWorkspaceRegistryForTests(): void {
  registry.clear();
}

export function registerExecutiveContextWorkspace(
  input: ExecutiveContextWorkspaceRegistration,
  registeredAt: string
): Readonly<{ success: boolean; reason: string }> {
  if (input.workspaceId.trim().length === 0) {
    return Object.freeze({ success: false, reason: "Workspace id must not be empty." });
  }
  registry.set(
    input.workspaceId,
    Object.freeze({
      workspaceId: input.workspaceId,
      label: input.label ?? null,
      registeredAt,
      readOnly: true as const,
    })
  );
  return Object.freeze({ success: true, reason: "Context workspace registered." });
}

export function isExecutiveContextWorkspaceRegistered(workspaceId: ExecutiveMemoryWorkspaceId): boolean {
  return registry.has(workspaceId);
}

export function getExecutiveContextWorkspace(
  workspaceId: ExecutiveMemoryWorkspaceId
): RegisteredExecutiveContextWorkspace | null {
  return registry.get(workspaceId) ?? null;
}

export function listRegisteredExecutiveContextWorkspaces(): readonly RegisteredExecutiveContextWorkspace[] {
  return Object.freeze(
    [...registry.values()].sort((left, right) => left.workspaceId.localeCompare(right.workspaceId))
  );
}

export const ExecutiveContextWorkspaceRegistry = Object.freeze({
  registerExecutiveContextWorkspace,
  isExecutiveContextWorkspaceRegistered,
  getExecutiveContextWorkspace,
  listRegisteredExecutiveContextWorkspaces,
  resetExecutiveContextWorkspaceRegistryForTests,
});
