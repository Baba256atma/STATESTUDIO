/**
 * PHASE-2 / DS1:2 — Workspace Registry Adapter diagnostics.
 * Link and sync boundary events only — no runtime synchronization.
 */

import {
  NEXORA_WORKSPACE_REGISTRY_ADAPTER_LOG_PREFIX,
  WORKSPACE_REGISTRY_ADAPTER_SOURCE,
} from "./workspaceDataSourceRegistryAdapterContract.ts";
import type {
  WorkspaceRegistryAdapterDiagnosticEntry,
  WorkspaceRegistryAdapterEvent,
  WorkspaceRegistryAdapterEventType,
  WorkspaceRegistryAdapterWorkspaceId,
} from "./workspaceDataSourceRegistryAdapterTypes.ts";

const eventLog: WorkspaceRegistryAdapterEvent[] = [];
const diagnosticLog: WorkspaceRegistryAdapterDiagnosticEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordWorkspaceRegistryAdapterEvent(input: {
  type: WorkspaceRegistryAdapterEventType;
  adapterLinkId?: string | null;
  workspaceId?: WorkspaceRegistryAdapterWorkspaceId | null;
}): WorkspaceRegistryAdapterEvent {
  const event = Object.freeze({
    type: input.type,
    adapterLinkId: input.adapterLinkId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordWorkspaceRegistryAdapterDiagnostic(input: {
  type: WorkspaceRegistryAdapterEventType;
  adapterLinkId?: string | null;
  workspaceId?: WorkspaceRegistryAdapterWorkspaceId | null;
  message: string;
}): WorkspaceRegistryAdapterDiagnosticEntry {
  const entry = Object.freeze({
    adapterLinkId: input.adapterLinkId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(NEXORA_WORKSPACE_REGISTRY_ADAPTER_LOG_PREFIX, {
      source: WORKSPACE_REGISTRY_ADAPTER_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getWorkspaceRegistryAdapterEvents(): readonly WorkspaceRegistryAdapterEvent[] {
  return Object.freeze([...eventLog]);
}

export function getWorkspaceRegistryAdapterDiagnosticsLog(): readonly WorkspaceRegistryAdapterDiagnosticEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetWorkspaceRegistryAdapterDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const WorkspaceRegistryAdapterDiagnostics = Object.freeze({
  recordWorkspaceRegistryAdapterEvent,
  recordWorkspaceRegistryAdapterDiagnostic,
  getWorkspaceRegistryAdapterEvents,
  getWorkspaceRegistryAdapterDiagnosticsLog,
  resetWorkspaceRegistryAdapterDiagnosticsForTests,
});
