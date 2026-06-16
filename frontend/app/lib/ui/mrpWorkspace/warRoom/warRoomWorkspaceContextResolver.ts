/**
 * MRP:4F:1 — Pure resolver for War Room workspace context.
 */

import {
  DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT,
  WAR_ROOM_KNOWN_OBJECT_FIXTURES,
  WAR_ROOM_NO_OBJECT_SELECTED_LABEL,
  type WarRoomWorkspaceContext,
  type WarRoomWorkspaceContextInput,
} from "./warRoomWorkspaceContextContract.ts";

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function resolveObjectId(input: WarRoomWorkspaceContextInput): string | null {
  return input.selectedObjectId?.trim() || input.routeObjectId?.trim() || null;
}

function resolveObjectLabel(input: WarRoomWorkspaceContextInput): string {
  const label =
    input.selectedObjectLabel ??
    input.routeObjectName ??
    input.selectedObjectId ??
    input.routeObjectId;
  return normalizeText(label, WAR_ROOM_NO_OBJECT_SELECTED_LABEL);
}

function hasMeaningfulSelection(objectId: string | null, selectedObject: string): boolean {
  if (objectId) return true;
  const normalized = selectedObject.trim().toLowerCase();
  return (
    normalized !== WAR_ROOM_NO_OBJECT_SELECTED_LABEL.toLowerCase() &&
    normalized !== "no object selected" &&
    selectedObject.length > 0
  );
}

function resolveKnownObjectFixture(
  selectedObject: string
): (typeof WAR_ROOM_KNOWN_OBJECT_FIXTURES)[string] | null {
  const key = selectedObject.trim().toLowerCase();
  return WAR_ROOM_KNOWN_OBJECT_FIXTURES[key] ?? null;
}

export function resolveWarRoomWorkspaceContext(
  input: WarRoomWorkspaceContextInput
): WarRoomWorkspaceContext {
  const selectedObjectId = resolveObjectId(input);
  const selectedObject = resolveObjectLabel(input);
  const hasSelection = hasMeaningfulSelection(selectedObjectId, selectedObject);

  if (!hasSelection) {
    return DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT;
  }

  const fixture = resolveKnownObjectFixture(selectedObject);

  return Object.freeze({
    selectedObjectId,
    selectedObject,
    strategyFocus: fixture?.strategyFocus ?? "General commitment",
    activeDecision: fixture?.activeDecision ?? "Pending review",
    commitmentStatus: fixture?.commitmentStatus ?? "Planning",
    hasSelection: true,
  });
}

export function buildWarRoomWorkspaceContextSignature(
  context: WarRoomWorkspaceContext
): string {
  return JSON.stringify({
    selectedObjectId: context.selectedObjectId,
    selectedObject: context.selectedObject,
    strategyFocus: context.strategyFocus,
    activeDecision: context.activeDecision,
    commitmentStatus: context.commitmentStatus,
    hasSelection: context.hasSelection,
  });
}
