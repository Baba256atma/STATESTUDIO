/**
 * MRP:4F:2 — War Room commitment runtime state store.
 */

import { getWarRoomScenarioHandoffState } from "./warRoomScenarioHandoffRuntime.ts";
import {
  DEFAULT_WAR_ROOM_STATE,
  WAR_ROOM_RUNTIME_STATE_TAG,
  WAR_ROOM_STATUS_VALUES,
  type WarRoomState,
  type WarRoomStatePublishResult,
  type WarRoomStatus,
} from "./warRoomStateContract.ts";
import {
  buildWarRoomStateSignature,
  resolveWarRoomStateFromContext,
  type WarRoomStateContextInput,
} from "./warRoomStateContextResolver.ts";
import { buildWarRoomWorkspaceSnapshotsFromState } from "./warRoomStateWorkspaceSync.ts";
import {
  getWarRoomWorkspaceState,
  publishWarRoomWorkspaceState,
} from "./warRoomWorkspaceStateRuntime.ts";
import type { GeneratedScenarioId } from "../scenario/scenarioGenerationContract.ts";

const listeners = new Set<() => void>();
const loggedRuntimeKeys = new Set<string>();

let revision = 0;
let lastSignature: string | null = null;
let publishCount = 0;

let state: WarRoomState = DEFAULT_WAR_ROOM_STATE;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

function normalizeScenarioId(
  value: GeneratedScenarioId | null | undefined,
  fallback: GeneratedScenarioId | null
): GeneratedScenarioId | null {
  if (value === "best_case" || value === "expected_case" || value === "worst_case") {
    return value;
  }
  return fallback;
}

function normalizeText(value: unknown, fallback: string | null): string | null {
  if (value === null) return null;
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function normalizeIdList(value: readonly string[] | undefined, fallback: readonly string[]): readonly string[] {
  if (!value?.length) return fallback;
  return Object.freeze(value.map((id) => id.trim()).filter(Boolean));
}

function normalizeStatus(value: unknown, fallback: WarRoomStatus): WarRoomStatus {
  if (
    typeof value === "string" &&
    (WAR_ROOM_STATUS_VALUES as readonly string[]).includes(value)
  ) {
    return value as WarRoomStatus;
  }
  return fallback;
}

function logRuntimeOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedRuntimeKeys.has(key)) return;
  loggedRuntimeKeys.add(key);
  globalThis.console?.debug?.(WAR_ROOM_RUNTIME_STATE_TAG, detail);
}

export function getWarRoomState(): WarRoomState {
  return state;
}

export function getWarRoomStateServerSnapshot(): WarRoomState {
  return DEFAULT_WAR_ROOM_STATE;
}

export function subscribeWarRoomState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function syncWarRoomWorkspaceFromState(warRoomState: WarRoomState): void {
  const workspaceState = getWarRoomWorkspaceState();
  const snapshots = buildWarRoomWorkspaceSnapshotsFromState({
    warRoomState,
    workspaceContext: workspaceState.workspaceContext,
    actionPlanLayer: workspaceState.actionPlanLayer,
    monitoringLayer: workspaceState.monitoringLayer,
  });

  publishWarRoomWorkspaceState({
    phase: "ready",
    workspaceContext: workspaceState.workspaceContext,
    ...snapshots,
  });
}

export function publishWarRoomState(
  input: Partial<Omit<WarRoomState, "revision" | "signature">>
): WarRoomStatePublishResult {
  publishCount += 1;

  const nextCandidate = Object.freeze({
    activeDecisionId: normalizeText(
      input.activeDecisionId,
      state.activeDecisionId
    ),
    activeScenarioId: normalizeScenarioId(input.activeScenarioId, state.activeScenarioId),
    selectedStrategy: normalizeText(input.selectedStrategy, state.selectedStrategy),
    actionPlanIds: normalizeIdList(input.actionPlanIds, state.actionPlanIds),
    watchListIds: normalizeIdList(input.watchListIds, state.watchListIds),
    status: normalizeStatus(input.status, state.status),
  });

  const signature = buildWarRoomStateSignature(nextCandidate);
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

  syncWarRoomWorkspaceFromState(nextState);

  logRuntimeOnce(signature, {
    action: "war_room_state_published",
    revision: nextRevision,
    status: nextState.status,
    activeDecisionId: nextState.activeDecisionId,
  });

  notifyListeners();

  return Object.freeze({
    changed: true,
    state,
    revision: nextRevision,
    guarded: false,
  });
}

export function buildWarRoomStateContextInputFromStores(): WarRoomStateContextInput {
  const handoff = getWarRoomScenarioHandoffState();
  return Object.freeze({
    workspaceContext: getWarRoomWorkspaceState().workspaceContext,
    handoffActiveScenarioId: handoff.activeScenarioId,
    handoffSelectedStrategy: handoff.commitPackage?.title ?? null,
  });
}

export function syncWarRoomStateFromContext(
  input?: Partial<WarRoomStateContextInput>
): WarRoomState {
  const base = buildWarRoomStateContextInputFromStores();
  const resolved = resolveWarRoomStateFromContext(
    Object.freeze({
      workspaceContext: input?.workspaceContext ?? base.workspaceContext,
      handoffActiveScenarioId:
        input?.handoffActiveScenarioId !== undefined
          ? input.handoffActiveScenarioId
          : base.handoffActiveScenarioId,
      handoffSelectedStrategy:
        input?.handoffSelectedStrategy !== undefined
          ? input.handoffSelectedStrategy
          : base.handoffSelectedStrategy,
    })
  );

  const result = publishWarRoomState(resolved);
  return result.state;
}

export function hydrateWarRoomStateOnMount(mountKey: string): WarRoomState {
  const warRoomState = syncWarRoomStateFromContext();
  syncWarRoomWorkspaceFromState(warRoomState);
  logRuntimeOnce(`hydrate:${mountKey}`, {
    action: "war_room_state_hydrated",
    mountKey,
    status: warRoomState.status,
    activeDecisionId: warRoomState.activeDecisionId,
  });
  return warRoomState;
}

export function traceWarRoomRuntimeOnce(mountKey?: string | null): void {
  logRuntimeOnce(`trace:${mountKey ?? "default"}`, {
    action: "war_room_runtime_active",
    mountKey: mountKey ?? null,
    status: state.status,
  });
}

export function resetWarRoomStateRuntimeForTests(): void {
  revision = 0;
  lastSignature = null;
  publishCount = 0;
  loggedRuntimeKeys.clear();
  state = DEFAULT_WAR_ROOM_STATE;
  notifyListeners();
}

/** @internal */
export function getWarRoomStatePublishCountForTests(): number {
  return publishCount;
}
