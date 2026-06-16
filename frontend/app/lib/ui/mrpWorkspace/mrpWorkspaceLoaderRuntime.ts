/**
 * MRP:3:4 — Workspace mount/unmount lifecycle runtime.
 */

import {
  MRP_DYNAMIC_RENDER_ZONE_TAG,
  MRP_WORKSPACE_LOADER_TAG,
  MRP_WORKSPACE_REGISTRY_MAX_ACTIVE_MOUNTS,
  type MrpWorkspaceId,
  type MrpWorkspaceLoaderSnapshot,
  type MrpWorkspaceMountLifecycleResult,
  type MrpWorkspaceMountRecord,
} from "./mrpWorkspaceLoaderContract.ts";

const listeners = new Set<() => void>();
const loggedMountKeys = new Set<string>();
const loggedUnmountKeys = new Set<string>();

let mountGeneration = 0;
let activeMount: MrpWorkspaceMountRecord | null = null;
let lastMountKey: string | null = null;
let lastUnmountKey: string | null = null;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

function logLoaderOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedMountKeys.has(key)) return;
  loggedMountKeys.add(key);
  globalThis.console?.debug?.(MRP_WORKSPACE_LOADER_TAG, detail);
}

function logUnmountOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedUnmountKeys.has(key)) return;
  loggedUnmountKeys.add(key);
  globalThis.console?.debug?.(MRP_DYNAMIC_RENDER_ZONE_TAG, detail);
}

export function getMrpWorkspaceLoaderSnapshot(): MrpWorkspaceLoaderSnapshot {
  return Object.freeze({
    activeMount: activeMount ? Object.freeze({ ...activeMount }) : null,
    activeMountCount: activeMount ? 1 : 0,
    mountGeneration,
    lastMountKey,
    lastUnmountKey,
  });
}

export function subscribeMrpWorkspaceLoader(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function mountMrpWorkspace(input: {
  workspaceId: MrpWorkspaceId;
  mountKey: string;
}): MrpWorkspaceMountLifecycleResult {
  const { workspaceId, mountKey } = input;

  if (activeMount?.mountKey === mountKey) {
    logLoaderOnce(`duplicate:${mountKey}`, {
      action: "duplicate_mount_prevented",
      workspaceId,
      mountKey,
    });
    return Object.freeze({
      mounted: false,
      unmountedPrevious: false,
      duplicatePrevented: true,
      workspaceId,
      mountKey,
    });
  }

  const unmountedPrevious = activeMount != null;
  if (unmountedPrevious && activeMount) {
    lastUnmountKey = activeMount.mountKey;
    logUnmountOnce(activeMount.mountKey, {
      action: "workspace_unmounted",
      workspaceId: activeMount.workspaceId,
      mountKey: activeMount.mountKey,
      mountGeneration: activeMount.mountGeneration,
    });
  }

  mountGeneration += 1;
  activeMount = Object.freeze({
    workspaceId,
    mountKey,
    mountGeneration,
    mountedAt: Date.now(),
  });
  lastMountKey = mountKey;

  logLoaderOnce(mountKey, {
    action: "workspace_mounted",
    workspaceId,
    mountKey,
    mountGeneration,
    activeMountCount: 1,
  });

  notifyListeners();

  return Object.freeze({
    mounted: true,
    unmountedPrevious,
    duplicatePrevented: false,
    workspaceId,
    mountKey,
  });
}

export function unmountMrpWorkspace(mountKey: string): boolean {
  if (!activeMount || activeMount.mountKey !== mountKey) {
    return false;
  }

  lastUnmountKey = activeMount.mountKey;
  logUnmountOnce(mountKey, {
    action: "workspace_unmounted",
    workspaceId: activeMount.workspaceId,
    mountKey,
    mountGeneration: activeMount.mountGeneration,
  });

  activeMount = null;
  notifyListeners();
  return true;
}

export function validateMrpWorkspaceLoaderInvariants(): Readonly<{
  valid: boolean;
  activeMountCount: number;
  maxActiveMounts: number;
}> {
  const activeMountCount = activeMount ? 1 : 0;
  return Object.freeze({
    valid: activeMountCount <= MRP_WORKSPACE_REGISTRY_MAX_ACTIVE_MOUNTS,
    activeMountCount,
    maxActiveMounts: MRP_WORKSPACE_REGISTRY_MAX_ACTIVE_MOUNTS,
  });
}

export function resetMrpWorkspaceLoaderRuntimeForTests(): void {
  mountGeneration = 0;
  activeMount = null;
  lastMountKey = null;
  lastUnmountKey = null;
  loggedMountKeys.clear();
  loggedUnmountKeys.clear();
  notifyListeners();
}

/** @internal */
export function getMrpWorkspaceMountGenerationForTests(): number {
  return mountGeneration;
}
