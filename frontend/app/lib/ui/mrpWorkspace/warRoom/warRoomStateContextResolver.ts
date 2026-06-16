/**
 * MRP:4F:2 — Pure resolver for War Room commitment runtime state.
 *
 * Consumes workspace context and optional Scenario handoff reference only.
 * Does not read Timeline or Scenario workspace stores.
 */

import type { GeneratedScenarioId } from "../scenario/scenarioGenerationContract.ts";
import type { WarRoomWorkspaceContext } from "./warRoomWorkspaceContextContract.ts";
import {
  DEFAULT_WAR_ROOM_STATE,
  type WarRoomState,
  type WarRoomStatus,
} from "./warRoomStateContract.ts";

export type WarRoomStateContextInput = Readonly<{
  workspaceContext: WarRoomWorkspaceContext;
  handoffActiveScenarioId?: GeneratedScenarioId | null;
  handoffSelectedStrategy?: string | null;
}>;

function normalizeScenarioId(
  value: GeneratedScenarioId | null | undefined
): GeneratedScenarioId | null {
  if (value === "best_case" || value === "expected_case" || value === "worst_case") {
    return value;
  }
  return null;
}

function resolveActiveDecisionId(
  context: WarRoomWorkspaceContext,
  handoffScenarioId?: GeneratedScenarioId | null
): string | null {
  if (!context.hasSelection && !handoffScenarioId) return null;

  const objectSegment =
    context.selectedObjectId?.trim() ||
    (context.hasSelection
      ? context.selectedObject.trim().toLowerCase().replace(/\s+/g, "-")
      : "objectless");

  if (handoffScenarioId) {
    return `decision:${objectSegment}:${handoffScenarioId}`;
  }

  if (!context.hasSelection) return null;
  return `decision:${objectSegment}`;
}

function resolveSelectedStrategy(input: WarRoomStateContextInput): string | null {
  const handoffStrategy = input.handoffSelectedStrategy?.trim();
  if (handoffStrategy) return handoffStrategy;
  if (!input.workspaceContext.hasSelection) return null;
  return input.workspaceContext.strategyFocus.trim() || null;
}

function resolveStatus(input: WarRoomStateContextInput): WarRoomStatus {
  if (input.handoffActiveScenarioId) return "review";
  if (input.workspaceContext.hasSelection) return "draft";
  return DEFAULT_WAR_ROOM_STATE.status;
}

function resolveActionPlanIds(
  context: WarRoomWorkspaceContext,
  handoffScenarioId?: GeneratedScenarioId | null
): readonly string[] {
  if (handoffScenarioId) {
    const objectSegment = context.selectedObjectId?.trim() || handoffScenarioId;
    return Object.freeze([`plan:${objectSegment}:handoff`]);
  }
  if (!context.hasSelection || !context.selectedObjectId) return Object.freeze([]);
  return Object.freeze([`plan:${context.selectedObjectId}:primary`]);
}

function resolveWatchListIds(
  context: WarRoomWorkspaceContext,
  handoffScenarioId?: GeneratedScenarioId | null
): readonly string[] {
  if (handoffScenarioId) {
    const objectSegment = context.selectedObjectId?.trim() || handoffScenarioId;
    return Object.freeze([`watch:${objectSegment}:handoff`]);
  }
  if (!context.hasSelection || !context.selectedObjectId) return Object.freeze([]);
  return Object.freeze([`watch:${context.selectedObjectId}:commitment`]);
}

export function resolveWarRoomStateFromContext(
  input: WarRoomStateContextInput
): Omit<WarRoomState, "revision" | "signature"> {
  const activeScenarioId = normalizeScenarioId(input.handoffActiveScenarioId);

  return Object.freeze({
    activeDecisionId: resolveActiveDecisionId(input.workspaceContext, activeScenarioId),
    activeScenarioId,
    selectedStrategy: resolveSelectedStrategy(input),
    actionPlanIds: resolveActionPlanIds(input.workspaceContext, activeScenarioId),
    watchListIds: resolveWatchListIds(input.workspaceContext, activeScenarioId),
    status: resolveStatus(input),
  });
}

export function buildWarRoomStateSignature(
  state: Omit<WarRoomState, "revision" | "signature">
): string {
  return JSON.stringify({
    activeDecisionId: state.activeDecisionId,
    activeScenarioId: state.activeScenarioId,
    selectedStrategy: state.selectedStrategy,
    actionPlanIds: state.actionPlanIds,
    watchListIds: state.watchListIds,
    status: state.status,
  });
}
