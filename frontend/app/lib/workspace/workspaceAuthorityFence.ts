/**
 * NPA-T WORKSPACE-CONCURRENCY-INTEGRITY:1
 *
 * One Workspace authority fence for canonical mutations.
 * The Web Lock is the linearization point for callers that enter it.
 * A lock does not protect a writer that skips this protocol.
 * Node has no navigator.locks; unit tests cover the authority decision,
 * not overlapping browser tabs.
 */

import { isCustomerHostedWorkspaceId } from "../workspace-auth/hostedWorkspaceId.ts";
import { isProtectedDemoWorkspaceId } from "./workspaceRegistryContract.ts";
import {
  MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY,
  getActiveWorkspaceId,
  getWorkspaceRegistrySnapshot,
  recoverWorkspaceRegistryFromStorage,
  workspaceRegistryStorageIsAuthoritative,
  workspaceRevocationLedgerIsReadable,
} from "./workspaceRegistryStore.ts";

export const WORKSPACE_AUTHORITY_LOCK_NAME = "nexora.workspace.authority" as const;

export const WORKSPACE_UNAVAILABLE_MESSAGE =
  "Workspace is no longer available. Refresh or select another Workspace." as const;

export type WorkspaceAuthorityFailure = "invalid-workspace" | "deletion-in-progress" | "workspace-revoked";

export type WorkspaceAuthorityVerdict =
  | Readonly<{ ok: true; generation: number }>
  | Readonly<{ ok: false; reason: WorkspaceAuthorityFailure }>;

const DELETION_PHASES = new Set(["DELETE_REQUESTED", "DELETING", "DELETE_BLOCKED"]);

function deletionPhase(metadata: Readonly<Record<string, unknown>> | undefined): string | null {
  const lifecycle = metadata?.deletionLifecycle;
  if (!lifecycle || typeof lifecycle !== "object") return null;
  const phase = (lifecycle as { phase?: unknown }).phase;
  return typeof phase === "string" ? phase : null;
}

/**
 * Reloads the registry, then decides whether an ordinary canonical mutation
 * may still name this Workspace. Revocation and deletion both refuse.
 */
export function evaluateWorkspaceAuthority(workspaceId: string): WorkspaceAuthorityVerdict {
  const id = workspaceId.trim();
  if (id.length === 0) return Object.freeze({ ok: false, reason: "invalid-workspace" });
  recoverWorkspaceRegistryFromStorage();
  if (!workspaceRevocationLedgerIsReadable() && !isProtectedDemoWorkspaceId(id)) {
    return Object.freeze({ ok: false, reason: "invalid-workspace" });
  }
  const snapshot = getWorkspaceRegistrySnapshot();
  if (snapshot.revokedWorkspaces[id]) return Object.freeze({ ok: false, reason: "workspace-revoked" });
  const workspace = snapshot.workspaces[id];
  if (!workspace) {
    // A hosted id is not a browser-registry fixture. Its absence is not a
    // generation-0 local workspace, and it is not revocation evidence.
    if (isCustomerHostedWorkspaceId(id)) return Object.freeze({ ok: false, reason: "invalid-workspace" });
    // A registry loaded from storage is the authority. Missing means revoked
    // or unknown, and neither may receive a canonical write. Unit fixtures
    // that never loaded a registry stay on the in-memory path.
    if (workspaceRegistryStorageIsAuthoritative()) return Object.freeze({ ok: false, reason: "workspace-revoked" });
    return Object.freeze({ ok: true, generation: 0 });
  }
  if (workspace.status !== "active") return Object.freeze({ ok: false, reason: "invalid-workspace" });
  const phase = deletionPhase(workspace.metadata);
  if (phase && DELETION_PHASES.has(phase)) return Object.freeze({ ok: false, reason: "deletion-in-progress" });
  const generation = Number(workspace.metadata?.authorityGeneration ?? 1);
  return Object.freeze({ ok: true, generation: Number.isFinite(generation) ? generation : 1 });
}

/**
 * Drops buckets that would recreate a revoked or deleted Workspace.
 * A changed bucket for an unauthorized Workspace rejects the write.
 * An unchanged stored bucket is left in place. Cleanup writes that omit
 * the Workspace id are not resurrection.
 */
export function retainAuthorizedWorkspaceBuckets<T>(
  stored: Readonly<Record<string, T>> | null,
  next: Readonly<Record<string, T>>,
): Readonly<{ ok: true; workspaces: Readonly<Record<string, T>> } | { ok: false; reason: WorkspaceAuthorityFailure }> {
  const workspaces: Record<string, T> = { ...next };
  for (const workspaceId of Object.keys(workspaces)) {
    const verdict = evaluateWorkspaceAuthority(workspaceId);
    if (verdict.ok) continue;
    const storedBucket = stored?.[workspaceId];
    if (storedBucket === undefined) {
      delete workspaces[workspaceId];
      continue;
    }
    if (JSON.stringify(storedBucket) !== JSON.stringify(workspaces[workspaceId])) {
      return Object.freeze({ ok: false, reason: verdict.reason });
    }
  }
  return Object.freeze({ ok: true, workspaces: Object.freeze(workspaces) });
}

export function workspaceAuthorityFailureMessage(reason: string): string | null {
  if (reason === "invalid-workspace" || reason === "workspace-revoked" || reason === "deletion-in-progress") {
    return WORKSPACE_UNAVAILABLE_MESSAGE;
  }
  return null;
}

export type WorkspaceMutationContext = Readonly<{
  workspaceId: string;
  authorityGeneration?: number;
  operationId?: string;
}>;

export type WorkspaceMutationCoordinationRuntime = "web-lock" | "node-direct" | "unavailable";

type CoordinationFrame = {
  depth: number;
  workspaceId: string | null;
  mode: "mutation" | "deletion";
  generation: number;
  runtime: "web-lock" | "node-direct";
};

let frame: CoordinationFrame | null = null;

type LockManagerLike = {
  request<T>(name: string, callback: () => T | Promise<T>): Promise<T>;
};

function browserNavigator(): (Navigator & { locks?: LockManagerLike }) | null {
  if (typeof window === "undefined") return null;
  const candidate = (window as Window & { navigator?: Navigator }).navigator;
  return candidate ?? null;
}

function lockManager(): LockManagerLike | null {
  const locks = browserNavigator()?.locks;
  return locks?.request ? locks : null;
}

/**
 * Node, SSR, and storage-stub tests have no window navigator. That path is
 * not cross-tab safety. A browser window without Web Locks fails closed.
 */
export function workspaceMutationCoordinationRuntime(): WorkspaceMutationCoordinationRuntime {
  const browser = browserNavigator();
  if (!browser) return "node-direct";
  return lockManager() ? "web-lock" : "unavailable";
}

export function workspaceMutationCoordinationActive(): boolean {
  return frame !== null && frame.depth > 0;
}

/**
 * Browser commits require the shared frame. Node returns null and must not
 * be described as cross-tab serialization.
 */
export function requireWorkspaceMutationCoordination(): null | "coordination-required" | "coordination-unavailable" {
  if (workspaceMutationCoordinationRuntime() === "node-direct") return null;
  if (!lockManager()) return "coordination-unavailable";
  if (!frame || frame.depth < 1) return "coordination-required";
  return null;
}

function rejectCoordination(reason: "coordination-required" | "coordination-unavailable" | WorkspaceAuthorityFailure | "workspace-generation-stale"): never {
  const message = reason === "coordination-unavailable"
    ? "Workspace mutation coordination is unavailable in this browser."
    : reason === "coordination-required"
      ? "This write is outside the shared Workspace mutation boundary."
      : WORKSPACE_UNAVAILABLE_MESSAGE;
  throw Object.assign(new Error(message), { reason });
}

function consumeCertificationFault(): void {
  if (process.env.NODE_ENV === "production") return;
  if (typeof window === "undefined") return;
  const target = window as Window & { __nexoraCertificationFault?: string };
  if (target.__nexoraCertificationFault !== "callback-throw") return;
  target.__nexoraCertificationFault = undefined;
  throw Object.assign(new Error("Injected mutation failure before commit."), { reason: "injected-callback-failure" });
}

async function certificationHold(): Promise<void> {
  if (process.env.NODE_ENV === "production") return;
  if (typeof window === "undefined") return;
  const hold = (window as Window & {
    __nexoraCertificationHold?: { entered: number; gate: Promise<void> | null };
  }).__nexoraCertificationHold;
  if (!hold) return;
  hold.entered += 1;
  if (hold.gate) await hold.gate;
}

async function enterFrame<T>(
  next: CoordinationFrame,
  mutation: () => T | Promise<T>,
): Promise<T> {
  if (frame && frame.depth > 0) {
    frame.depth += 1;
    try {
      return await mutation();
    } finally {
      if (frame) frame.depth -= 1;
    }
  }
  frame = next;
  try {
    await certificationHold();
    consumeCertificationFault();
    return await mutation();
  } finally {
    frame = null;
  }
}

/**
 * One shared boundary. Nested calls reuse the held frame and do not
 * request the same non-reentrant Web Lock again.
 * The lock is not held across a caller that waits for the user.
 */
export function coordinateWorkspaceMutation<T>(
  context: WorkspaceMutationContext,
  mutation: () => T | Promise<T>,
): Promise<T> {
  const runtime = workspaceMutationCoordinationRuntime();
  if (runtime === "unavailable") return Promise.reject(Object.assign(new Error("Workspace mutation coordination is unavailable in this browser."), { reason: "coordination-unavailable" }));
  const run = () => {
    const verdict = evaluateWorkspaceAuthority(context.workspaceId);
    if (!verdict.ok) rejectCoordination(verdict.reason);
    if (
      context.authorityGeneration != null &&
      verdict.generation !== 0 &&
      context.authorityGeneration !== verdict.generation
    ) {
      rejectCoordination("workspace-generation-stale");
    }
    return enterFrame({
      depth: 1,
      workspaceId: context.workspaceId,
      mode: "mutation",
      generation: verdict.generation,
      runtime: runtime === "web-lock" ? "web-lock" : "node-direct",
    }, mutation);
  };
  const locks = lockManager();
  if (locks && !(frame && frame.depth > 0)) return locks.request(WORKSPACE_AUTHORITY_LOCK_NAME, run);
  return Promise.resolve().then(run);
}

/** Deletion transitions and cleanup. Ordinary mutation authority stays revoked. */
export function coordinateWorkspaceDeletion<T>(
  workspaceId: string,
  mutation: () => T | Promise<T>,
): Promise<T> {
  const runtime = workspaceMutationCoordinationRuntime();
  if (runtime === "unavailable") return Promise.reject(Object.assign(new Error("Workspace mutation coordination is unavailable in this browser."), { reason: "coordination-unavailable" }));
  const run = () => enterFrame({
    depth: 1,
    workspaceId,
    mode: "deletion",
    generation: 0,
    runtime: runtime === "web-lock" ? "web-lock" : "node-direct",
  }, mutation);
  const locks = lockManager();
  if (locks && !(frame && frame.depth > 0)) return locks.request(WORKSPACE_AUTHORITY_LOCK_NAME, run);
  return Promise.resolve().then(run);
}

export function coordinateCanonicalStoreMutation<T>(mutation: () => T | Promise<T>): Promise<T> {
  const runtime = workspaceMutationCoordinationRuntime();
  if (runtime === "unavailable") return Promise.reject(Object.assign(new Error("Workspace mutation coordination is unavailable in this browser."), { reason: "coordination-unavailable" }));
  const run = () => enterFrame({
    depth: 1,
    workspaceId: null,
    mode: "mutation",
    generation: 0,
    runtime: runtime === "web-lock" ? "web-lock" : "node-direct",
  }, mutation);
  const locks = lockManager();
  if (locks && !(frame && frame.depth > 0)) return locks.request(WORKSPACE_AUTHORITY_LOCK_NAME, run);
  return Promise.resolve().then(run);
}

/**
 * Other tabs reload the registry. A storage event is not write authority.
 */
export function installWorkspaceAuthorityStorageSync(): () => void {
  if (typeof window === "undefined") return () => undefined;
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY) return;
    const selected = getActiveWorkspaceId();
    recoverWorkspaceRegistryFromStorage(event.oldValue);
    if (!selected) return;
    const verdict = evaluateWorkspaceAuthority(selected);
    if (!verdict.ok) {
      window.dispatchEvent(new CustomEvent("nexora-workspace-unavailable", { detail: WORKSPACE_UNAVAILABLE_MESSAGE }));
    }
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

/**
 * Serializes participants that use this lock. The callback itself must
 * re-read storage; holding the lock is not a substitute for that read.
 */
export function runWithWorkspaceAuthorityLock<T>(body: () => T): Promise<T> {
  return coordinateCanonicalStoreMutation(body);
}

/**
 * Ordinary mutation entry. Deletion uses runWithWorkspaceAuthorityLock
 * directly because a Workspace in DELETE_REQUESTED is no longer writable
 * but must still be able to finish deletion.
 */
export function runFencedWorkspaceMutation<T>(
  workspaceId: string,
  body: (authority: Readonly<{ generation: number }>) => T,
): Promise<T> {
  return coordinateWorkspaceMutation({ workspaceId }, () => {
    const verdict = evaluateWorkspaceAuthority(workspaceId);
    if (!verdict.ok) rejectCoordination(verdict.reason);
    return body({ generation: verdict.generation });
  });
}
