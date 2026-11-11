import { requireWorkspaceMutationCoordination } from "./workspaceAuthorityFence.ts";
import { forgetWorkspaceDatasetReferences } from "../deck/nexoraDeckDatasetReferenceRegistry.ts";
import { forgetWorkspaceDecks } from "../deck/nexoraDeckRegistry.ts";
import { forgetWorkspaceSavedScenes } from "../scene-org/sceneOrgSavedSceneDurability.ts";
import { forgetWorkspaceCanonicalRelationships } from "../scene-org/canonicalRelationshipGraph.ts";
import { forgetWorkspaceCanonicalObjects } from "../scene-org/canonicalObjectRegistry.ts";
import { forgetWorkspaceCausalInvestigations } from "../scene-org/canonicalCausalInvestigationDomain.ts";
import { forgetWorkspaceDecisionDomain } from "../scene-org/canonicalDecisionDomain.ts";
import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import { isCustomerHostedWorkspaceId } from "../workspace-auth/hostedWorkspaceId.ts";
import {
  BUSINESS_DEMO_WORKSPACE,
  BUSINESS_DEMO_WORKSPACE_ID,
  DEMO_WORKSPACE,
  DEMO_WORKSPACE_ID,
  WORKSPACE_REGISTRY_VERSION,
  isLegacyWorkflowWorkspaceIdentifier,
  isManagerWorkspaceKind,
  isProtectedDemoWorkspaceId,
  isWorkspace,
  normalizeWorkspaceId,
  type RevokedWorkspaceIdentity,
  type Workspace,
  type WorkspaceId,
  type WorkspaceRegistryMutation,
  type WorkspaceRegistrySnapshot,
} from "./workspaceRegistryContract.ts";

type WorkspaceRegistryListener = () => void;

const workspaceRegistryListeners = new Set<WorkspaceRegistryListener>();

let registryInitialized = false;
let registryStorageAuthoritative = false;
let registrySnapshot: WorkspaceRegistrySnapshot = createInitialWorkspaceRegistrySnapshot();

function createInitialWorkspaceRegistrySnapshot(): WorkspaceRegistrySnapshot {
  return Object.freeze({
    version: WORKSPACE_REGISTRY_VERSION,
    workspaces: Object.freeze({
      [DEMO_WORKSPACE_ID]: DEMO_WORKSPACE,
      [BUSINESS_DEMO_WORKSPACE_ID]: BUSINESS_DEMO_WORKSPACE,
    }),
    workspaceOrder: Object.freeze([DEMO_WORKSPACE_ID, BUSINESS_DEMO_WORKSPACE_ID]),
    activeWorkspaceId: DEMO_WORKSPACE_ID,
    revokedWorkspaces: Object.freeze({}),
  });
}

function freezeWorkspaceRegistrySnapshot(input: {
  workspaces: Record<WorkspaceId, Workspace>;
  workspaceOrder: WorkspaceId[];
  activeWorkspaceId: WorkspaceId | null;
  revokedWorkspaces: Readonly<Record<string, RevokedWorkspaceIdentity>>;
}): WorkspaceRegistrySnapshot {
  const revoked: Record<string, RevokedWorkspaceIdentity> = {};
  for (const [workspaceId, identity] of Object.entries(input.revokedWorkspaces)) {
    revoked[workspaceId] = Object.freeze({ revokedAt: identity.revokedAt, generation: identity.generation });
  }
  return Object.freeze({
    version: WORKSPACE_REGISTRY_VERSION,
    workspaces: Object.freeze({ ...input.workspaces }),
    workspaceOrder: Object.freeze([...input.workspaceOrder]),
    activeWorkspaceId: input.activeWorkspaceId,
    revokedWorkspaces: Object.freeze(revoked),
  });
}

function freezeCarryingRevocations(
  snapshot: WorkspaceRegistrySnapshot,
  input: {
    workspaces: Record<WorkspaceId, Workspace>;
    workspaceOrder: WorkspaceId[];
    activeWorkspaceId: WorkspaceId | null;
    revokedWorkspaces?: Readonly<Record<string, RevokedWorkspaceIdentity>>;
  },
): WorkspaceRegistrySnapshot {
  return freezeWorkspaceRegistrySnapshot({
    workspaces: input.workspaces,
    workspaceOrder: input.workspaceOrder,
    activeWorkspaceId: input.activeWorkspaceId,
    revokedWorkspaces: input.revokedWorkspaces ?? snapshot.revokedWorkspaces,
  });
}

function readRevokedWorkspaces(value: unknown): Record<string, RevokedWorkspaceIdentity> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const revoked: Record<string, RevokedWorkspaceIdentity> = {};
  for (const [workspaceId, entry] of Object.entries(value as Record<string, unknown>)) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const record = entry as { revokedAt?: unknown; generation?: unknown };
    if (typeof record.revokedAt !== "string" || record.revokedAt.length === 0) continue;
    const generation = typeof record.generation === "number" && Number.isFinite(record.generation) ? record.generation : 0;
    revoked[workspaceId] = Object.freeze({ revokedAt: record.revokedAt, generation });
  }
  return revoked;
}

export const MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY = "nexora.workspace.registry.v1";

/**
 * Revocation ledger for the same registry contract.
 * The snapshot remains the Workspace list. This record is the durable
 * revocation authority, so replacing the snapshot cannot drop a revocation.
 * One module owns both records. A revoked id cannot become active.
 */
export const WORKSPACE_REVOCATION_LEDGER_STORAGE_KEY = "nexora.workspace.registry.v1.revocation-ledger";

type RevocationLedgerRead =
  | Readonly<{ status: "missing" | "ready"; revocations: Record<string, RevokedWorkspaceIdentity> }>
  | Readonly<{ status: "corrupt" }>;

let revocationLedgerReadable = true;
let revocationPersistFailure: "ledger" | null = null;

function emitWorkspaceRegistryChange(): void {
  for (const listener of workspaceRegistryListeners) {
    listener();
  }
}

function registryStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function stripRevokedWorkspaceRecords(
  snapshot: WorkspaceRegistrySnapshot,
  revokedWorkspaces: Readonly<Record<string, RevokedWorkspaceIdentity>>,
): WorkspaceRegistrySnapshot {
  const revokedIds = Object.keys(revokedWorkspaces);
  if (revokedIds.length === 0) return snapshot;
  const workspaces = { ...snapshot.workspaces };
  let removed = false;
  for (const workspaceId of revokedIds) {
    if (workspaces[workspaceId]) {
      delete workspaces[workspaceId];
      removed = true;
    }
  }
  const workspaceOrder = snapshot.workspaceOrder.filter((workspaceId) => !revokedWorkspaces[workspaceId]);
  const activeWorkspaceId = snapshot.activeWorkspaceId && revokedWorkspaces[snapshot.activeWorkspaceId]
    ? resolveProtectedActiveWorkspaceId(workspaces, workspaceOrder, null)
    : snapshot.activeWorkspaceId;
  const revocationChanged = JSON.stringify(snapshot.revokedWorkspaces) !== JSON.stringify(revokedWorkspaces);
  if (!removed && !revocationChanged && workspaceOrder.length === snapshot.workspaceOrder.length && activeWorkspaceId === snapshot.activeWorkspaceId) {
    return snapshot;
  }
  return freezeWorkspaceRegistrySnapshot({
    workspaces,
    workspaceOrder,
    activeWorkspaceId,
    revokedWorkspaces,
  });
}

let registryPersistDepth = 0;

function omitProtectedRevocations(
  revocations: Readonly<Record<string, RevokedWorkspaceIdentity>>,
): Record<string, RevokedWorkspaceIdentity> {
  const next: Record<string, RevokedWorkspaceIdentity> = {};
  for (const [workspaceId, record] of Object.entries(revocations)) {
    if (isProtectedDemoWorkspaceId(workspaceId)) continue;
    next[workspaceId] = record;
  }
  return next;
}

function unionRevocations(
  ...groups: Array<Readonly<Record<string, RevokedWorkspaceIdentity>> | undefined>
): Record<string, RevokedWorkspaceIdentity> {
  const merged: Record<string, RevokedWorkspaceIdentity> = {};
  for (const group of groups) {
    if (!group) continue;
    for (const [workspaceId, record] of Object.entries(group)) {
      if (isProtectedDemoWorkspaceId(workspaceId)) continue;
      const current = merged[workspaceId];
      if (!current || record.generation > current.generation) {
        merged[workspaceId] = record;
        continue;
      }
      if (record.generation === current.generation && record.revokedAt < current.revokedAt) {
        merged[workspaceId] = record;
      }
    }
  }
  return merged;
}

function readRevocationLedger(storage: Storage | null): RevocationLedgerRead {
  if (!storage) return { status: "missing", revocations: {} };
  const raw = storage.getItem(WORKSPACE_REVOCATION_LEDGER_STORAGE_KEY);
  if (raw == null) return { status: "missing", revocations: {} };
  try {
    const parsed = JSON.parse(raw) as { version?: unknown; revocations?: unknown };
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { status: "corrupt" };
    if (parsed.version !== WORKSPACE_REGISTRY_VERSION || !("revocations" in parsed)) return { status: "corrupt" };
    return { status: "ready", revocations: omitProtectedRevocations(readRevokedWorkspaces(parsed.revocations)) };
  } catch {
    return { status: "corrupt" };
  }
}

function writeRevocationLedger(
  storage: Storage,
  revocations: Readonly<Record<string, RevokedWorkspaceIdentity>>,
): boolean {
  if (revocationPersistFailure === "ledger") return false;
  try {
    storage.setItem(WORKSPACE_REVOCATION_LEDGER_STORAGE_KEY, JSON.stringify({
      version: WORKSPACE_REGISTRY_VERSION,
      revocations: omitProtectedRevocations(revocations),
    }));
    revocationLedgerReadable = true;
    return true;
  } catch {
    return false;
  }
}

/** False when the revocation ledger exists but cannot be parsed. Missing means no revocations yet. */
export function workspaceRevocationLedgerIsReadable(): boolean {
  return revocationLedgerReadable;
}

/** Test seam for the revocation write itself. Cleanup-step faults stay on the deletion lifecycle. */
export function failWorkspaceRevocationPersistForTests(mode: "ledger" | null): void {
  revocationPersistFailure = mode;
}

function commitWorkspaceRegistrySnapshot(next: WorkspaceRegistrySnapshot): WorkspaceRegistrySnapshot | null {
  const storage = registryStorage();
  if (!storage) return next;
  if (registryPersistDepth > 0) return next;
  registryPersistDepth += 1;
  try {
    const ledger = readRevocationLedger(storage);
    if (ledger.status === "corrupt") {
      revocationLedgerReadable = false;
      return null;
    }
    const existingRaw = storage.getItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY);
    const existing = existingRaw ? snapshotFromStorage(existingRaw) : null;
    const revokedWorkspaces = unionRevocations(
      ledger.revocations,
      existing?.revokedWorkspaces,
      next.revokedWorkspaces,
    );
    if (!writeRevocationLedger(storage, revokedWorkspaces)) return null;
    const stripped = stripRevokedWorkspaceRecords(next, revokedWorkspaces);
    storage.setItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY, JSON.stringify(stripped));
    return stripped;
  } catch {
    return null;
  } finally {
    registryPersistDepth -= 1;
  }
}

function replaceRegistrySnapshot(next: WorkspaceRegistrySnapshot): boolean {
  const committed = commitWorkspaceRegistrySnapshot(next);
  if (!committed) return false;
  const changed = committed !== registrySnapshot;
  registrySnapshot = committed;
  if (changed) emitWorkspaceRegistryChange();
  return true;
}

function snapshotFromStorage(raw: string): WorkspaceRegistrySnapshot | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const candidate = parsed as Partial<WorkspaceRegistrySnapshot>;
  if (candidate.version !== WORKSPACE_REGISTRY_VERSION) return null;
  if (!candidate.workspaces || typeof candidate.workspaces !== "object") return null;
  if (!Array.isArray(candidate.workspaceOrder)) return null;
  const workspaces: Record<WorkspaceId, Workspace> = {};
  for (const workspaceId of candidate.workspaceOrder) {
    if (typeof workspaceId !== "string" || isLegacyWorkflowWorkspaceIdentifier(workspaceId)) return null;
    const workspace = (candidate.workspaces as Record<string, unknown>)[workspaceId];
    if (!isWorkspace(workspace) || workspace.workspaceId !== workspaceId) return null;
    workspaces[workspaceId] = canonicalizeSeededDemoWorkspace(Object.freeze({ ...workspace }));
  }
  if (!workspaces[DEMO_WORKSPACE_ID] || workspaces[DEMO_WORKSPACE_ID].kind != null) return null;
  const seeded = ensureBusinessDemoWorkspace(workspaces, candidate.workspaceOrder.filter((workspaceId): workspaceId is WorkspaceId =>
    typeof workspaceId === "string" && Boolean(workspaces[workspaceId]),
  ));
  const activeWorkspaceId =
    typeof candidate.activeWorkspaceId === "string" ? candidate.activeWorkspaceId : null;
  if (
    activeWorkspaceId == null ||
    isLegacyWorkflowWorkspaceIdentifier(activeWorkspaceId) ||
    workspaces[activeWorkspaceId]?.status !== "active"
  ) {
    return null;
  }
  return freezeWorkspaceRegistrySnapshot({
    workspaces: seeded.workspaces,
    workspaceOrder: seeded.workspaceOrder,
    activeWorkspaceId,
    revokedWorkspaces: readRevokedWorkspaces((candidate as { revokedWorkspaces?: unknown }).revokedWorkspaces),
  });
}

function canonicalizeSeededDemoWorkspace(workspace: Workspace): Workspace {
  if (workspace.workspaceId !== BUSINESS_DEMO_WORKSPACE_ID) return workspace;
  return BUSINESS_DEMO_WORKSPACE;
}

function ensureBusinessDemoWorkspace(
  workspaces: Record<WorkspaceId, Workspace>,
  workspaceOrder: readonly WorkspaceId[],
): { workspaces: Record<WorkspaceId, Workspace>; workspaceOrder: WorkspaceId[] } {
  const order = workspaceOrder.includes(BUSINESS_DEMO_WORKSPACE_ID)
    ? [...workspaceOrder]
    : [...workspaceOrder, BUSINESS_DEMO_WORKSPACE_ID];
  return {
    workspaces: {
      ...workspaces,
      [BUSINESS_DEMO_WORKSPACE_ID]: BUSINESS_DEMO_WORKSPACE,
    },
    workspaceOrder: order,
  };
}

/**
 * Restores the existing registry snapshot after a supported reload.
 * The in-memory registry remains the only authority after recovery.
 */
function hostedSessionPointer(snapshot: WorkspaceRegistrySnapshot): {
  workspaces: readonly Workspace[];
  activeWorkspaceId: WorkspaceId | null;
} {
  return {
    workspaces: Object.values(snapshot.workspaces).filter((workspace) => isCustomerHostedWorkspaceId(workspace.workspaceId)),
    activeWorkspaceId: snapshot.activeWorkspaceId && isCustomerHostedWorkspaceId(snapshot.activeWorkspaceId)
      ? snapshot.activeWorkspaceId
      : null,
  };
}

/**
 * The hosted session is an in-memory pointer to a server-authorized workspace.
 * Storage recovery must not drop it and must not write it into the browser registry.
 * A revoked id is not reattached.
 */
function withHostedSession(
  repaired: WorkspaceRegistrySnapshot,
  session: { workspaces: readonly Workspace[]; activeWorkspaceId: WorkspaceId | null },
): WorkspaceRegistrySnapshot {
  const retained = session.workspaces.filter((workspace) => !repaired.revokedWorkspaces[workspace.workspaceId]);
  const active = session.activeWorkspaceId && !repaired.revokedWorkspaces[session.activeWorkspaceId]
    ? session.activeWorkspaceId
    : null;
  if (retained.length === 0 && !active) return repaired;
  const workspaces = { ...repaired.workspaces };
  const workspaceOrder = [...repaired.workspaceOrder];
  for (const workspace of retained) {
    workspaces[workspace.workspaceId] = workspace;
    if (!workspaceOrder.includes(workspace.workspaceId)) workspaceOrder.push(workspace.workspaceId);
  }
  const activeWorkspaceId = active && workspaces[active] ? active : repaired.activeWorkspaceId;
  return freezeWorkspaceRegistrySnapshot({
    workspaces,
    workspaceOrder,
    activeWorkspaceId,
    revokedWorkspaces: repaired.revokedWorkspaces,
  });
}

export function recoverWorkspaceRegistryFromStorage(priorRaw: string | null = null): WorkspaceRegistrySnapshot {
  initializeWorkspaceRegistry();
  const session = hostedSessionPointer(registrySnapshot);
  const storage = registryStorage();
  const ledger = readRevocationLedger(storage);
  if (ledger.status === "corrupt") {
    revocationLedgerReadable = false;
    registryStorageAuthoritative = false;
    return registrySnapshot;
  }
  revocationLedgerReadable = true;
  const raw = storage?.getItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY) ?? null;
  const recovered = raw ? snapshotFromStorage(raw) : null;
  if (!raw || !recovered) registryStorageAuthoritative = false;
  else registryStorageAuthoritative = true;
  const prior = priorRaw ? snapshotFromStorage(priorRaw) : null;
  const revokedWorkspaces = unionRevocations(
    ledger.revocations,
    prior?.revokedWorkspaces,
    registrySnapshot.revokedWorkspaces,
    recovered?.revokedWorkspaces,
  );
  const base = recovered ?? registrySnapshot;
  const repaired = stripRevokedWorkspaceRecords(base, revokedWorkspaces);
  const memory = withHostedSession(repaired, session);
  if (storage && (ledger.status === "missing" || JSON.stringify(ledger.revocations) !== JSON.stringify(revokedWorkspaces))) {
    writeRevocationLedger(storage, revokedWorkspaces);
  }
  const storageDiffers = Boolean(raw && recovered && JSON.stringify(repaired) !== JSON.stringify(recovered));
  if (storage && storageDiffers) commitWorkspaceRegistrySnapshot(repaired);
  if (JSON.stringify(memory) === JSON.stringify(registrySnapshot)) return registrySnapshot;
  registrySnapshot = memory;
  emitWorkspaceRegistryChange();
  return registrySnapshot;
}

/** True only after a registry snapshot parsed from storage. A failed read must not authorize orphan deletion. */
export function workspaceRegistryStorageIsAuthoritative(): boolean {
  return registryStorageAuthoritative;
}

function logWorkspaceRegistryDiagnostic(label: string, payload?: unknown): void {
  devDiagnosticLog("workspaceRegistry", label, payload);
}

function logWorkspaceLifecycleDiagnostic(label: string, payload?: unknown): void {
  devDiagnosticLog("workspaceLifecycle", label, payload);
}

function nowIso(): string {
  return new Date().toISOString();
}

function slugWorkspaceName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || "workspace";
}

function createWorkspaceId(
  name: string,
  existing: Readonly<Record<WorkspaceId, Workspace>>,
  revoked: Readonly<Record<string, RevokedWorkspaceIdentity>>,
): WorkspaceId {
  const base = slugWorkspaceName(name);
  let candidate = `${base}_${Date.now().toString(36)}`;
  let counter = 2;
  while (existing[candidate] || revoked[candidate]) {
    candidate = `${base}_${Date.now().toString(36)}_${counter}`;
    counter += 1;
  }
  return candidate;
}

function listActiveWorkspaceIdsFrom(
  workspaces: Readonly<Record<WorkspaceId, Workspace>>,
  workspaceOrder: readonly WorkspaceId[]
): WorkspaceId[] {
  return workspaceOrder.filter((workspaceId) => workspaces[workspaceId]?.status === "active");
}

function resolveProtectedActiveWorkspaceId(
  workspaces: Readonly<Record<WorkspaceId, Workspace>>,
  workspaceOrder: readonly WorkspaceId[],
  preferredWorkspaceId: WorkspaceId | null
): WorkspaceId | null {
  if (preferredWorkspaceId && workspaces[preferredWorkspaceId]?.status === "active") return preferredWorkspaceId;
  if (workspaces[DEMO_WORKSPACE_ID]?.status === "active") return DEMO_WORKSPACE_ID;
  return listActiveWorkspaceIdsFrom(workspaces, workspaceOrder)[0] ?? null;
}

function canArchiveWorkspaceInSnapshot(snapshot: WorkspaceRegistrySnapshot, workspaceId: WorkspaceId): boolean {
  if (isProtectedDemoWorkspaceId(workspaceId)) return false;
  if (snapshot.workspaces[workspaceId]?.status !== "active") return false;
  return listActiveWorkspaceIdsFrom(snapshot.workspaces, snapshot.workspaceOrder).length > 1;
}

function canDeleteWorkspaceInSnapshot(snapshot: WorkspaceRegistrySnapshot, workspaceId: WorkspaceId): boolean {
  if (isProtectedDemoWorkspaceId(workspaceId)) return false;
  if (!snapshot.workspaces[workspaceId]) return false;
  return listActiveWorkspaceIdsFrom(snapshot.workspaces, snapshot.workspaceOrder).length > 1;
}

export function listActiveWorkspaces(): readonly Workspace[] {
  const snapshot = getWorkspaceRegistrySnapshot();
  return Object.freeze(
    snapshot.workspaceOrder
      .map((workspaceId) => snapshot.workspaces[workspaceId])
      .filter((workspace): workspace is Workspace => Boolean(workspace) && workspace.status === "active")
  );
}

export function canArchiveWorkspace(workspaceId: unknown): boolean {
  const normalized = normalizeWorkspaceId(workspaceId);
  if (!normalized) return false;
  const snapshot = getWorkspaceRegistrySnapshot();
  return canArchiveWorkspaceInSnapshot(snapshot, normalized);
}

export function canDeleteWorkspace(workspaceId: unknown): boolean {
  const normalized = normalizeWorkspaceId(workspaceId);
  if (!normalized) return false;
  const snapshot = getWorkspaceRegistrySnapshot();
  return canDeleteWorkspaceInSnapshot(snapshot, normalized);
}

export function initializeWorkspaceRegistry(): WorkspaceRegistrySnapshot {
  if (registryInitialized) return registrySnapshot;
  registryInitialized = true;
  logWorkspaceRegistryDiagnostic("[WorkspaceRegistry][Init]", {
    version: WORKSPACE_REGISTRY_VERSION,
    workspaceCount: registrySnapshot.workspaceOrder.length,
    activeWorkspaceId: registrySnapshot.activeWorkspaceId,
  });
  logWorkspaceRegistryDiagnostic("[ActiveWorkspace][Resolved]", getActiveWorkspace());
  return registrySnapshot;
}

export function subscribeWorkspaceRegistry(listener: WorkspaceRegistryListener): () => void {
  workspaceRegistryListeners.add(listener);
  return () => {
    workspaceRegistryListeners.delete(listener);
  };
}

export function getWorkspaceRegistrySnapshot(): WorkspaceRegistrySnapshot {
  initializeWorkspaceRegistry();
  return registrySnapshot;
}

export function listWorkspaces(): readonly Workspace[] {
  const snapshot = getWorkspaceRegistrySnapshot();
  return Object.freeze(
    snapshot.workspaceOrder
      .map((workspaceId) => snapshot.workspaces[workspaceId])
      .filter(Boolean)
  );
}

export function getWorkspaceById(workspaceId: unknown): Workspace | null {
  const normalized = normalizeWorkspaceId(workspaceId);
  if (!normalized) return null;
  return getWorkspaceRegistrySnapshot().workspaces[normalized] ?? null;
}

export function getActiveWorkspaceId(): WorkspaceId | null {
  return getWorkspaceRegistrySnapshot().activeWorkspaceId;
}

export function getActiveWorkspace(): Workspace | null {
  const snapshot = getWorkspaceRegistrySnapshot();
  return snapshot.activeWorkspaceId ? snapshot.workspaces[snapshot.activeWorkspaceId] ?? null : null;
}

export function reduceWorkspaceRegistryMutation(
  snapshot: WorkspaceRegistrySnapshot,
  mutation: WorkspaceRegistryMutation
): WorkspaceRegistrySnapshot {
  switch (mutation.type) {
    case "setActiveWorkspace": {
      const workspaceId = normalizeWorkspaceId(mutation.workspaceId);
      if (
        !workspaceId ||
        isLegacyWorkflowWorkspaceIdentifier(workspaceId) ||
        snapshot.workspaces[workspaceId]?.status !== "active"
      ) {
        return snapshot;
      }
      if (snapshot.activeWorkspaceId === workspaceId) return snapshot;
      const activeWorkspace = snapshot.workspaces[workspaceId];
      const workspaces = {
        ...snapshot.workspaces,
        [workspaceId]: {
          ...activeWorkspace,
          lastOpenedAt: activeWorkspace.updatedAt,
        },
      };
      return freezeCarryingRevocations(snapshot, {
        workspaces,
        workspaceOrder: [...snapshot.workspaceOrder],
        activeWorkspaceId: workspaceId,
      });
    }
    case "upsertWorkspace": {
      if (!isWorkspace(mutation.workspace)) return snapshot;
      if (isLegacyWorkflowWorkspaceIdentifier(mutation.workspace.workspaceId)) return snapshot;
      if (snapshot.revokedWorkspaces[mutation.workspace.workspaceId]) return snapshot;
      const stored = canonicalizeSeededDemoWorkspace(Object.freeze({ ...mutation.workspace }));
      const exists = Boolean(snapshot.workspaces[stored.workspaceId]);
      const workspaces = {
        ...snapshot.workspaces,
        [stored.workspaceId]: stored,
      };
      const workspaceOrder = exists
        ? [...snapshot.workspaceOrder]
        : [...snapshot.workspaceOrder, mutation.workspace.workspaceId];
      return freezeCarryingRevocations(snapshot, {
        workspaces,
        workspaceOrder,
        activeWorkspaceId: resolveProtectedActiveWorkspaceId(
          workspaces,
          workspaceOrder,
          snapshot.activeWorkspaceId ?? mutation.workspace.workspaceId
        ),
      });
    }
    case "renameWorkspace": {
      const workspaceId = normalizeWorkspaceId(mutation.workspaceId);
      const workspaceName = mutation.workspaceName.trim();
      if (!workspaceId || !workspaceName || !snapshot.workspaces[workspaceId]) return snapshot;
      return freezeCarryingRevocations(snapshot, {
        workspaces: {
          ...snapshot.workspaces,
          [workspaceId]: Object.freeze({
            ...snapshot.workspaces[workspaceId],
            workspaceName,
            updatedAt: mutation.updatedAt ?? nowIso(),
          }),
        },
        workspaceOrder: [...snapshot.workspaceOrder],
        activeWorkspaceId: resolveProtectedActiveWorkspaceId(
          snapshot.workspaces,
          snapshot.workspaceOrder,
          snapshot.activeWorkspaceId
        ),
      });
    }
    case "archiveWorkspace": {
      const workspaceId = normalizeWorkspaceId(mutation.workspaceId);
      if (!workspaceId || !snapshot.workspaces[workspaceId]) return snapshot;
      if (!canArchiveWorkspaceInSnapshot(snapshot, workspaceId)) return snapshot;
      const archived = Object.freeze({
        ...snapshot.workspaces[workspaceId],
        status: "archived" as const,
        updatedAt: mutation.archivedAt ?? snapshot.workspaces[workspaceId].updatedAt,
      });
      const workspaces = {
        ...snapshot.workspaces,
        [workspaceId]: archived,
      };
      return freezeCarryingRevocations(snapshot, {
        workspaces,
        workspaceOrder: [...snapshot.workspaceOrder],
        activeWorkspaceId: resolveProtectedActiveWorkspaceId(
          workspaces,
          snapshot.workspaceOrder,
          snapshot.activeWorkspaceId === workspaceId ? null : snapshot.activeWorkspaceId
        ),
      });
    }
    case "deleteWorkspace": {
      const workspaceId = normalizeWorkspaceId(mutation.workspaceId);
      if (!workspaceId || !snapshot.workspaces[workspaceId]) return snapshot;
      if (!canDeleteWorkspaceInSnapshot(snapshot, workspaceId)) return snapshot;
      const removed = snapshot.workspaces[workspaceId];
      const generation = Number(removed.metadata?.authorityGeneration ?? 1);
      const workspaces = { ...snapshot.workspaces };
      delete workspaces[workspaceId];
      const workspaceOrder = snapshot.workspaceOrder.filter((id) => id !== workspaceId);
      return freezeCarryingRevocations(snapshot, {
        workspaces,
        workspaceOrder,
        activeWorkspaceId: resolveProtectedActiveWorkspaceId(
          workspaces,
          workspaceOrder,
          snapshot.activeWorkspaceId === workspaceId ? null : snapshot.activeWorkspaceId
        ),
        revokedWorkspaces: {
          ...snapshot.revokedWorkspaces,
          [workspaceId]: Object.freeze({
            revokedAt: nowIso(),
            generation: Number.isFinite(generation) ? generation : 1,
          }),
        },
      });
    }
    default:
      return snapshot;
  }
}

export function dispatchWorkspaceRegistryMutation(mutation: WorkspaceRegistryMutation): WorkspaceRegistrySnapshot {
  if (requireWorkspaceMutationCoordination()) return registrySnapshot;
  initializeWorkspaceRegistry();
  recoverWorkspaceRegistryFromStorage();
  const next = reduceWorkspaceRegistryMutation(registrySnapshot, mutation);
  if (next === registrySnapshot) return registrySnapshot;
  if (!replaceRegistrySnapshot(next)) return registrySnapshot;
  logWorkspaceRegistryDiagnostic("[WorkspaceRegistry][Mutation]", {
    type: mutation.type,
    activeWorkspaceId: registrySnapshot.activeWorkspaceId,
    workspaceCount: registrySnapshot.workspaceOrder.length,
  });
  logWorkspaceRegistryDiagnostic("[ActiveWorkspace][Resolved]", getActiveWorkspace());
  return registrySnapshot;
}

export function setActiveWorkspace(workspaceId: WorkspaceId): WorkspaceRegistrySnapshot {
  return dispatchWorkspaceRegistryMutation({ type: "setActiveWorkspace", workspaceId });
}

export function upsertWorkspace(workspace: Workspace): WorkspaceRegistrySnapshot {
  return dispatchWorkspaceRegistryMutation({ type: "upsertWorkspace", workspace });
}

export function createWorkspace(workspaceName: string): Workspace {
  initializeWorkspaceRegistry();
  recoverWorkspaceRegistryFromStorage();
  const normalizedName = workspaceName.trim() || "Untitled Workspace";
  const timestamp = nowIso();
  const workspace: Workspace = Object.freeze({
    workspaceId: createWorkspaceId(normalizedName, registrySnapshot.workspaces, registrySnapshot.revokedWorkspaces),
    workspaceName: normalizedName,
    status: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
    lastOpenedAt: timestamp,
    domain: null,
    objectCount: 0,
    dataSourceCount: 0,
    metadata: Object.freeze({
      lifecycle: "empty_workspace",
      phase: "NW-A:3",
      authorityGeneration: 1,
    }),
  });
  upsertWorkspace(workspace);
  setActiveWorkspace(workspace.workspaceId);
  logWorkspaceLifecycleDiagnostic("[WorkspaceLifecycle] Created Workspace", {
    workspaceId: workspace.workspaceId,
    workspaceName: workspace.workspaceName,
  });
  return workspace;
}

export function renameWorkspace(
  workspaceId: WorkspaceId,
  workspaceName: string,
  updatedAt?: string
): WorkspaceRegistrySnapshot {
  const next = dispatchWorkspaceRegistryMutation({
    type: "renameWorkspace",
    workspaceId,
    workspaceName,
    updatedAt,
  });
  logWorkspaceLifecycleDiagnostic("[WorkspaceLifecycle] Renamed Workspace", {
    workspaceId,
    workspaceName: getWorkspaceById(workspaceId)?.workspaceName ?? null,
  });
  return next;
}

export function duplicateWorkspace(workspaceId: WorkspaceId): Workspace | null {
  initializeWorkspaceRegistry();
  recoverWorkspaceRegistryFromStorage();
  const source = getWorkspaceById(workspaceId);
  if (!source) return null;
  const timestamp = nowIso();
  const workspace: Workspace = Object.freeze({
    ...source,
    workspaceId: createWorkspaceId(`${source.workspaceName} Copy`, registrySnapshot.workspaces, registrySnapshot.revokedWorkspaces),
    workspaceName: `${source.workspaceName} Copy`,
    status: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
    lastOpenedAt: timestamp,
    metadata: Object.freeze({
      ...(source.metadata ?? {}),
      duplicatedFromWorkspaceId: source.workspaceId,
      phase: "NW-A:3",
    }),
  });
  upsertWorkspace(workspace);
  setActiveWorkspace(workspace.workspaceId);
  logWorkspaceLifecycleDiagnostic("[WorkspaceLifecycle] Duplicated Workspace", {
    sourceWorkspaceId: source.workspaceId,
    workspaceId: workspace.workspaceId,
    workspaceName: workspace.workspaceName,
  });
  return workspace;
}

export function archiveWorkspace(workspaceId: WorkspaceId, archivedAt?: string): WorkspaceRegistrySnapshot {
  const before = registrySnapshot;
  const next = dispatchWorkspaceRegistryMutation({ type: "archiveWorkspace", workspaceId, archivedAt });
  if (next !== before) {
    logWorkspaceLifecycleDiagnostic("[WorkspaceLifecycle] Archived Workspace", {
      workspaceId,
      activeWorkspaceId: next.activeWorkspaceId,
    });
  }
  return next;
}

export function deleteWorkspace(workspaceId: WorkspaceId): WorkspaceRegistrySnapshot {
  const before = registrySnapshot;
  const next = dispatchWorkspaceRegistryMutation({ type: "deleteWorkspace", workspaceId });
  if (next !== before) {
    forgetWorkspaceDecks(workspaceId);
    forgetWorkspaceDatasetReferences(workspaceId);
    forgetWorkspaceSavedScenes(workspaceId);
    forgetWorkspaceCanonicalRelationships(workspaceId);
    forgetWorkspaceCanonicalObjects(workspaceId);
    forgetWorkspaceDecisionDomain(workspaceId);
    forgetWorkspaceCausalInvestigations(workspaceId);
    logWorkspaceLifecycleDiagnostic("[WorkspaceLifecycle] Deleted Workspace", {
      workspaceId,
      activeWorkspaceId: next.activeWorkspaceId,
    });
  }
  return next;
}

/**
 * Session pointer for an already-authorized hosted workspace.
 * The server record remains the durable authority. This does not write the browser registry.
 */
export function adoptAuthorizedHostedWorkspace(workspace: Workspace): boolean {
  initializeWorkspaceRegistry();
  if (!isCustomerHostedWorkspaceId(workspace.workspaceId)) return false;
  if (!isManagerWorkspaceKind(workspace.kind)) return false;
  const upserted = reduceWorkspaceRegistryMutation(registrySnapshot, {
    type: "upsertWorkspace",
    workspace,
  });
  const next = reduceWorkspaceRegistryMutation(upserted, {
    type: "setActiveWorkspace",
    workspaceId: workspace.workspaceId,
  });
  if (next.activeWorkspaceId !== workspace.workspaceId) return false;
  registrySnapshot = next;
  logWorkspaceRegistryDiagnostic("[WorkspaceRegistry][Mutation]", {
    type: "adoptAuthorizedHostedWorkspace",
    activeWorkspaceId: registrySnapshot.activeWorkspaceId,
    workspaceCount: registrySnapshot.workspaceOrder.length,
  });
  logWorkspaceRegistryDiagnostic("[ActiveWorkspace][Resolved]", getActiveWorkspace());
  emitWorkspaceRegistryChange();
  return true;
}

/**
 * Drops an in-memory hosted workspace pointer after the server deletes it.
 * This does not write the browser registry.
 */
export function releaseAuthorizedHostedWorkspace(workspaceId: string): void {
  initializeWorkspaceRegistry();
  if (!isCustomerHostedWorkspaceId(workspaceId)) return;
  if (!registrySnapshot.workspaces[workspaceId] && registrySnapshot.activeWorkspaceId !== workspaceId) return;
  const workspaces = { ...registrySnapshot.workspaces };
  delete workspaces[workspaceId];
  const workspaceOrder = registrySnapshot.workspaceOrder.filter((id) => id !== workspaceId);
  const activeWorkspaceId = registrySnapshot.activeWorkspaceId === workspaceId
    ? DEMO_WORKSPACE_ID
    : registrySnapshot.activeWorkspaceId;
  registrySnapshot = freezeCarryingRevocations(registrySnapshot, {
    workspaces,
    workspaceOrder,
    activeWorkspaceId,
  });
  emitWorkspaceRegistryChange();
}

export function recordWorkspaceRevocation(workspaceId: string, revokedAt = nowIso()): void {
  initializeWorkspaceRegistry();
  const id = normalizeWorkspaceId(workspaceId);
  if (!id || isProtectedDemoWorkspaceId(id) || registrySnapshot.revokedWorkspaces[id]) return;
  const generation = Number(registrySnapshot.workspaces[id]?.metadata?.authorityGeneration ?? 0);
  const next = freezeCarryingRevocations(registrySnapshot, {
    workspaces: { ...registrySnapshot.workspaces },
    workspaceOrder: [...registrySnapshot.workspaceOrder],
    activeWorkspaceId: registrySnapshot.activeWorkspaceId,
    revokedWorkspaces: {
      ...registrySnapshot.revokedWorkspaces,
      [id]: Object.freeze({ revokedAt, generation: Number.isFinite(generation) ? generation : 0 }),
    },
  });
  replaceRegistrySnapshot(next);
}

/** Drops this process's registry memory without touching durable storage. */
export function abandonWorkspaceRegistryMemoryForTests(): void {
  registryInitialized = false;
  registryStorageAuthoritative = false;
  registrySnapshot = createInitialWorkspaceRegistrySnapshot();
  workspaceRegistryListeners.clear();
}

export function resetWorkspaceRegistryForTests(): void {
  abandonWorkspaceRegistryMemoryForTests();
  revocationLedgerReadable = true;
  revocationPersistFailure = null;
  try {
    const storage = registryStorage();
    storage?.removeItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY);
    storage?.removeItem(WORKSPACE_REVOCATION_LEDGER_STORAGE_KEY);
  } catch {
    // Test isolation still resets the in-memory registry.
  }
}
