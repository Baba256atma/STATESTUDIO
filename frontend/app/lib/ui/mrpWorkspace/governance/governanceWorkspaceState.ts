/**
 * MRP:5B:2 — Governance workspace runtime state.
 *
 * Read-only object context sync. No scene writes. No object mutation.
 */

import type { MrpContextStoreSnapshot } from "../../mrpContext/mrpContextStoreContract.ts";

export const GOVERNANCE_RUNTIME_TAG = "[MRP_5B2_RUNTIME]" as const;
export const GOVERNANCE_STATE_TAG = "[GOVERNANCE_STATE]" as const;

export const GOVERNANCE_WORKSPACE_STATE_VERSION = "5B.2.0";

export type GovernanceWorkspaceStatePhase = "loading" | "ready" | "empty" | "closed";

export type GovernanceApprovalStatus =
  | "pending_review"
  | "awaiting_authority"
  | "ready_for_review"
  | "unknown";

export type GovernancePolicyStatus = "aligned" | "partial" | "unknown";

export type GovernanceConstraintStatus = "clear" | "review_required" | "unknown";

export type GovernanceWorkspaceState = Readonly<{
  workspaceId: "governance";
  selectedObjectId: string | null;
  approvalStatus: GovernanceApprovalStatus;
  policyStatus: GovernancePolicyStatus;
  constraintStatus: GovernanceConstraintStatus;
  phase: GovernanceWorkspaceStatePhase;
  revision: number;
  signature: string;
}>;

export type GovernanceWorkspaceStatePublishResult = Readonly<{
  changed: boolean;
  state: GovernanceWorkspaceState;
  revision: number;
  guarded: boolean;
  guardReason?: string;
}>;

export type GovernanceWorkspaceContextInput = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
}>;

export const DEFAULT_GOVERNANCE_APPROVAL_STATUS: GovernanceApprovalStatus = "pending_review";
export const DEFAULT_GOVERNANCE_POLICY_STATUS: GovernancePolicyStatus = "unknown";
export const DEFAULT_GOVERNANCE_CONSTRAINT_STATUS: GovernanceConstraintStatus = "review_required";

const listeners = new Set<() => void>();
const loggedRuntimeKeys = new Set<string>();
const loggedStateKeys = new Set<string>();

let revision = 0;
let lastSignature: string | null = null;
let publishCount = 0;
let loopGuardWindowStart = 0;
let loopGuardPublishCount = 0;
let activeMountKey: string | null = null;

let state: GovernanceWorkspaceState = createGovernanceLoadingState(0);

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function normalizeApprovalStatus(value: unknown): GovernanceApprovalStatus {
  if (
    value === "pending_review" ||
    value === "awaiting_authority" ||
    value === "ready_for_review" ||
    value === "unknown"
  ) {
    return value;
  }
  return DEFAULT_GOVERNANCE_APPROVAL_STATUS;
}

function normalizePolicyStatus(value: unknown): GovernancePolicyStatus {
  if (value === "aligned" || value === "partial" || value === "unknown") {
    return value;
  }
  return DEFAULT_GOVERNANCE_POLICY_STATUS;
}

function normalizeConstraintStatus(value: unknown): GovernanceConstraintStatus {
  if (value === "clear" || value === "review_required" || value === "unknown") {
    return value;
  }
  return DEFAULT_GOVERNANCE_CONSTRAINT_STATUS;
}

function normalizePhase(value: unknown): GovernanceWorkspaceStatePhase {
  if (value === "loading" || value === "ready" || value === "empty" || value === "closed") {
    return value;
  }
  return "ready";
}

export function buildGovernanceWorkspaceStateSignature(input: {
  workspaceId: "governance";
  selectedObjectId: string | null;
  approvalStatus: GovernanceApprovalStatus;
  policyStatus: GovernancePolicyStatus;
  constraintStatus: GovernanceConstraintStatus;
  phase: GovernanceWorkspaceStatePhase;
}): string {
  return JSON.stringify({
    workspaceId: input.workspaceId,
    selectedObjectId: input.selectedObjectId,
    approvalStatus: input.approvalStatus,
    policyStatus: input.policyStatus,
    constraintStatus: input.constraintStatus,
    phase: input.phase,
  });
}

export function createGovernanceLoadingState(rev = 0): GovernanceWorkspaceState {
  const candidate = Object.freeze({
    workspaceId: "governance" as const,
    selectedObjectId: null,
    approvalStatus: DEFAULT_GOVERNANCE_APPROVAL_STATUS,
    policyStatus: DEFAULT_GOVERNANCE_POLICY_STATUS,
    constraintStatus: DEFAULT_GOVERNANCE_CONSTRAINT_STATUS,
    phase: "loading" as const,
  });
  return Object.freeze({
    ...candidate,
    revision: rev,
    signature: buildGovernanceWorkspaceStateSignature(candidate),
  });
}

export function createGovernanceReadyState(
  input: Partial<
    Omit<GovernanceWorkspaceState, "workspaceId" | "revision" | "signature" | "phase">
  > = {},
  rev = 0
): GovernanceWorkspaceState {
  const candidate = Object.freeze({
    workspaceId: "governance" as const,
    selectedObjectId: normalizeText(input.selectedObjectId) ?? null,
    approvalStatus: normalizeApprovalStatus(input.approvalStatus),
    policyStatus: normalizePolicyStatus(input.policyStatus),
    constraintStatus: normalizeConstraintStatus(input.constraintStatus),
    phase: "ready" as const,
  });
  return Object.freeze({
    ...candidate,
    revision: rev,
    signature: buildGovernanceWorkspaceStateSignature(candidate),
  });
}

function logStateOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedStateKeys.has(key)) return;
  loggedStateKeys.add(key);
  globalThis.console?.debug?.(GOVERNANCE_STATE_TAG, detail);
}

function logRuntimeOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedRuntimeKeys.has(key)) return;
  loggedRuntimeKeys.add(key);
  globalThis.console?.debug?.(GOVERNANCE_RUNTIME_TAG, detail);
}

function detectRenderLoop(): boolean {
  const now = Date.now();
  if (now - loopGuardWindowStart > 1000) {
    loopGuardWindowStart = now;
    loopGuardPublishCount = 0;
  }
  loopGuardPublishCount += 1;
  return loopGuardPublishCount > 30;
}

export function getGovernanceWorkspaceState(): GovernanceWorkspaceState {
  return state;
}

export function getGovernanceWorkspaceStateServerSnapshot(): GovernanceWorkspaceState {
  return createGovernanceLoadingState(0);
}

export function subscribeGovernanceWorkspaceState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publishGovernanceWorkspaceState(
  input: Partial<Omit<GovernanceWorkspaceState, "workspaceId" | "revision" | "signature">> & {
    phase?: GovernanceWorkspaceStatePhase;
  }
): GovernanceWorkspaceStatePublishResult {
  publishCount += 1;

  if (detectRenderLoop()) {
    logRuntimeOnce("render_loop", { reason: "publish_rate_exceeded" });
    return Object.freeze({
      changed: false,
      state,
      revision: state.revision,
      guarded: true,
      guardReason: "render_loop",
    });
  }

  const nextCandidate = Object.freeze({
    workspaceId: "governance" as const,
    selectedObjectId:
      input.selectedObjectId !== undefined
        ? normalizeText(input.selectedObjectId)
        : state.selectedObjectId,
    approvalStatus: normalizeApprovalStatus(input.approvalStatus ?? state.approvalStatus),
    policyStatus: normalizePolicyStatus(input.policyStatus ?? state.policyStatus),
    constraintStatus: normalizeConstraintStatus(
      input.constraintStatus ?? state.constraintStatus
    ),
    phase: normalizePhase(input.phase ?? state.phase),
  });

  const signature = buildGovernanceWorkspaceStateSignature(nextCandidate);
  if (signature === lastSignature) {
    return Object.freeze({
      changed: false,
      state,
      revision: state.revision,
      guarded: false,
    });
  }

  const nextRevision = revision + 1;
  const nextState = Object.freeze({
    ...nextCandidate,
    revision: nextRevision,
    signature,
  });

  revision = nextRevision;
  lastSignature = signature;
  state = nextState;

  logStateOnce(signature, {
    phase: state.phase,
    revision: nextRevision,
    selectedObjectId: state.selectedObjectId,
    approvalStatus: state.approvalStatus,
  });
  logRuntimeOnce(`${state.phase}:${signature}`, {
    action: "state_published",
    revision: nextRevision,
  });

  notifyListeners();

  return Object.freeze({
    changed: true,
    state,
    revision: nextRevision,
    guarded: false,
  });
}

export function resolveGovernanceSelectedObjectId(
  snapshot: MrpContextStoreSnapshot,
  input: GovernanceWorkspaceContextInput = {}
): string | null {
  return (
    normalizeText(input.routeObjectId) ??
    normalizeText(input.selectedObjectId) ??
    normalizeText(snapshot.selectedObjectId) ??
    null
  );
}

export function syncGovernanceWorkspaceContext(
  snapshot: MrpContextStoreSnapshot,
  input: GovernanceWorkspaceContextInput = {}
): GovernanceWorkspaceState {
  const selectedObjectId = resolveGovernanceSelectedObjectId(snapshot, input);
  const approvalStatus = selectedObjectId
    ? "ready_for_review"
    : DEFAULT_GOVERNANCE_APPROVAL_STATUS;
  const policyStatus = selectedObjectId ? "partial" : DEFAULT_GOVERNANCE_POLICY_STATUS;
  const constraintStatus = selectedObjectId
    ? "review_required"
    : DEFAULT_GOVERNANCE_CONSTRAINT_STATUS;
  const phase = state.phase === "closed" ? "ready" : state.phase;
  const signature = buildGovernanceWorkspaceStateSignature({
    workspaceId: "governance",
    selectedObjectId,
    approvalStatus,
    policyStatus,
    constraintStatus,
    phase,
  });

  if (signature === state.signature) {
    return state;
  }

  const result = publishGovernanceWorkspaceState({
    selectedObjectId,
    phase,
    approvalStatus,
    policyStatus,
    constraintStatus,
  });

  logRuntimeOnce(`context:${result.state.signature}`, {
    action: "object_context_synced",
    changed: result.changed,
    selectedObjectId: result.state.selectedObjectId,
  });

  return result.state;
}

export function hydrateGovernanceWorkspaceStateOnMount(mountKey: string): GovernanceWorkspaceState {
  activeMountKey = mountKey;
  publishGovernanceWorkspaceState({ phase: "loading" });
  const ready = publishGovernanceWorkspaceState({
    phase: "ready",
    approvalStatus: DEFAULT_GOVERNANCE_APPROVAL_STATUS,
    policyStatus: DEFAULT_GOVERNANCE_POLICY_STATUS,
    constraintStatus: DEFAULT_GOVERNANCE_CONSTRAINT_STATUS,
  });
  logRuntimeOnce(`hydrate:${mountKey}`, {
    action: "workspace_state_hydrated",
    mountKey,
    phase: ready.state.phase,
    workspaceId: ready.state.workspaceId,
  });
  return ready.state;
}

export function teardownGovernanceWorkspaceStateOnUnmount(mountKey?: string | null): void {
  if (mountKey && activeMountKey && activeMountKey !== mountKey) {
    return;
  }
  activeMountKey = null;
  publishGovernanceWorkspaceState({ phase: "closed" });
  logRuntimeOnce(`teardown:${mountKey ?? "unknown"}`, {
    action: "workspace_state_teardown",
    mountKey: mountKey ?? null,
    phase: state.phase,
  });
}

export function getGovernanceWorkspaceStatePublishCountForTests(): number {
  return publishCount;
}

export function getGovernanceActiveMountKeyForTests(): string | null {
  return activeMountKey;
}

export function resetGovernanceWorkspaceStateForTests(): void {
  revision = 0;
  lastSignature = null;
  publishCount = 0;
  loopGuardWindowStart = 0;
  loopGuardPublishCount = 0;
  activeMountKey = null;
  loggedRuntimeKeys.clear();
  loggedStateKeys.clear();
  state = createGovernanceLoadingState(0);
  notifyListeners();
}
