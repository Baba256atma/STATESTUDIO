/**
 * NW-B:8-6A — read-only empty scene click deselect (selection + panel close only).
 */

import { traceNexoraLoopGuard } from "../runtime/nexoraLoopGuardDiagnostics.ts";
import { reportSelectionResolved } from "./objectSelectionRuntimeContract.ts";
import {
  clearObjectClickSelectionContext,
  getObjectClickSelectionContext,
} from "./objectClickSelectionContextCache.ts";
import { clearPointerSelectionGate } from "./nexoraObjectClickTransaction.ts";

const OBJECT_SELECTION_PANEL_VIEWS = new Set(["object", "executive_object", "object_focus"]);

function normalizeSelectedObjectId(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function isObjectSelectionPanelView(view: string | null | undefined): boolean {
  return OBJECT_SELECTION_PANEL_VIEWS.has(String(view ?? ""));
}

export function shouldCloseObjectPanelOnEmptySceneDeselect(input: {
  panelView: string | null;
  panelIsOpen: boolean;
  selectedObjectId: string | null;
}): boolean {
  if (!input.panelIsOpen) return false;
  if (!isObjectSelectionPanelView(input.panelView)) return false;
  return normalizeSelectedObjectId(input.selectedObjectId) == null;
}

export function hasPendingEmptySceneDeselectWork(input: {
  selectedObjectId: string | null;
  panelView: string | null;
  panelIsOpen: boolean;
}): boolean {
  if (normalizeSelectedObjectId(input.selectedObjectId) != null) return true;
  if (getObjectClickSelectionContext()) return true;
  return shouldCloseObjectPanelOnEmptySceneDeselect({
    panelView: input.panelView,
    panelIsOpen: input.panelIsOpen,
    selectedObjectId: null,
  });
}

export function clearEmptySceneDeselectReadModels(): void {
  clearObjectClickSelectionContext();
  clearPointerSelectionGate();
}

export function traceEmptySceneClickDeselect(input: {
  previousObjectId: string | null;
  panelView: string | null;
  panelClosed: boolean;
}): void {
  traceNexoraLoopGuard({
    source: "empty_scene_click",
    action: "selection_cleared",
    reason: "deselect_only",
    stateSignature: JSON.stringify({
      previousObjectId: input.previousObjectId ?? null,
      panelView: input.panelView ?? null,
      panelClosed: input.panelClosed,
    }),
    objectId: null,
    prevContextId: input.previousObjectId ?? null,
    nextContextId: null,
  });
  reportSelectionResolved({
    objectId: null,
    priorObjectId: input.previousObjectId ?? null,
    source: "empty_scene_click",
    phase: "deselect",
    reason: "deselect_only",
  });
}
