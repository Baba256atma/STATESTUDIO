/**
 * MRP:4E:5 — War Room runtime store for ScenarioCommitPackage consumption.
 */

import type { ScenarioCommitPackage } from "../scenario/scenarioHandoffContract.ts";
import {
  DEFAULT_WAR_ROOM_SCENARIO_HANDOFF_STATE,
  WAR_ROOM_SCENARIO_HANDOFF_TAG,
  type WarRoomScenarioHandoffState,
} from "./warRoomScenarioHandoffContract.ts";
import { buildScenarioCommitPackageSignature } from "../scenario/scenarioHandoffResolver.ts";

const listeners = new Set<() => void>();
const loggedReceiveKeys = new Set<string>();

let state: WarRoomScenarioHandoffState = DEFAULT_WAR_ROOM_SCENARIO_HANDOFF_STATE;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

function logReceiveOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedReceiveKeys.has(key)) return;
  loggedReceiveKeys.add(key);
  globalThis.console?.debug?.(WAR_ROOM_SCENARIO_HANDOFF_TAG, detail);
}

export function getWarRoomScenarioHandoffState(): WarRoomScenarioHandoffState {
  return state;
}

export function subscribeWarRoomScenarioHandoffState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function receiveScenarioCommitPackage(
  commitPackage: ScenarioCommitPackage
): WarRoomScenarioHandoffState {
  const signature = buildScenarioCommitPackageSignature(commitPackage);
  state = Object.freeze({
    commitPackage,
    activeScenarioId: commitPackage.scenarioId,
    receivedAt: commitPackage.createdAt,
    executionBlocked: true,
  });
  notifyListeners();
  logReceiveOnce(signature, {
    action: "scenario_commit_package_received",
    scenarioId: commitPackage.scenarioId,
    title: commitPackage.title,
    selectedObjectId: commitPackage.selectedObjectId,
  });
  return state;
}

export function consumeWarRoomScenarioCommitPackage(): ScenarioCommitPackage | null {
  return state.commitPackage;
}

export function resetWarRoomScenarioHandoffRuntimeForTests(): void {
  loggedReceiveKeys.clear();
  state = DEFAULT_WAR_ROOM_SCENARIO_HANDOFF_STATE;
  notifyListeners();
}
