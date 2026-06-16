/**
 * MRP:5A:1 — Pure resolver for Advisory workspace context.
 */

import {
  ADVISORY_KNOWN_OBJECT_FIXTURES,
  ADVISORY_NO_OBJECT_SELECTED_LABEL,
  DEFAULT_ADVISORY_WORKSPACE_CONTEXT,
  type AdvisoryWorkspaceContext,
  type AdvisoryWorkspaceContextInput,
} from "./advisoryWorkspaceContextContract.ts";

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function resolveObjectId(input: AdvisoryWorkspaceContextInput): string | null {
  return input.selectedObjectId?.trim() || input.routeObjectId?.trim() || null;
}

function resolveObjectLabel(input: AdvisoryWorkspaceContextInput): string {
  const label =
    input.selectedObjectLabel ??
    input.routeObjectName ??
    input.selectedObjectId ??
    input.routeObjectId;
  return normalizeText(label, ADVISORY_NO_OBJECT_SELECTED_LABEL);
}

function hasMeaningfulSelection(objectId: string | null, selectedObject: string): boolean {
  if (objectId) return true;
  const normalized = selectedObject.trim().toLowerCase();
  return (
    normalized !== ADVISORY_NO_OBJECT_SELECTED_LABEL.toLowerCase() &&
    normalized !== "no object selected" &&
    selectedObject.length > 0
  );
}

function resolveKnownObjectFixture(
  selectedObject: string
): (typeof ADVISORY_KNOWN_OBJECT_FIXTURES)[string] | null {
  const key = selectedObject.trim().toLowerCase();
  return ADVISORY_KNOWN_OBJECT_FIXTURES[key] ?? null;
}

export function resolveAdvisoryWorkspaceContext(
  input: AdvisoryWorkspaceContextInput
): AdvisoryWorkspaceContext {
  const selectedObjectId = resolveObjectId(input);
  const selectedObject = resolveObjectLabel(input);
  const hasSelection = hasMeaningfulSelection(selectedObjectId, selectedObject);

  if (!hasSelection) {
    return DEFAULT_ADVISORY_WORKSPACE_CONTEXT;
  }

  const fixture = resolveKnownObjectFixture(selectedObject);

  return Object.freeze({
    selectedObjectId,
    selectedObject,
    recommendationFocus: fixture?.recommendationFocus ?? "General recommendation review",
    confidenceLevel: fixture?.confidenceLevel ?? "Moderate",
    reviewScope: fixture?.reviewScope ?? "Executive advisory",
    hasSelection: true,
  });
}

export function buildAdvisoryWorkspaceContextSignature(
  context: AdvisoryWorkspaceContext
): string {
  return JSON.stringify({
    selectedObjectId: context.selectedObjectId,
    selectedObject: context.selectedObject,
    recommendationFocus: context.recommendationFocus,
    confidenceLevel: context.confidenceLevel,
    reviewScope: context.reviewScope,
    hasSelection: context.hasSelection,
  });
}
