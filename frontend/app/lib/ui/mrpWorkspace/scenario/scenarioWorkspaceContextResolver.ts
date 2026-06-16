/**
 * MRP:4E:1 — Pure resolver for Scenario workspace context.
 */

import {
  DEFAULT_SCENARIO_WORKSPACE_CONTEXT,
  SCENARIO_KNOWN_OBJECT_FIXTURES,
  SCENARIO_NO_OBJECT_SELECTED_LABEL,
  type ScenarioWorkspaceContext,
  type ScenarioWorkspaceContextInput,
} from "./scenarioWorkspaceContextContract.ts";

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function resolveObjectId(input: ScenarioWorkspaceContextInput): string | null {
  return input.selectedObjectId?.trim() || input.routeObjectId?.trim() || null;
}

function resolveObjectLabel(input: ScenarioWorkspaceContextInput): string {
  const label =
    input.selectedObjectLabel ??
    input.routeObjectName ??
    input.selectedObjectId ??
    input.routeObjectId;
  return normalizeText(label, SCENARIO_NO_OBJECT_SELECTED_LABEL);
}

function hasMeaningfulSelection(objectId: string | null, selectedObject: string): boolean {
  if (objectId) return true;
  const normalized = selectedObject.trim().toLowerCase();
  return (
    normalized !== SCENARIO_NO_OBJECT_SELECTED_LABEL.toLowerCase() &&
    normalized !== "no object selected" &&
    selectedObject.length > 0
  );
}

function resolveKnownObjectFixture(
  selectedObject: string
): (typeof SCENARIO_KNOWN_OBJECT_FIXTURES)[string] | null {
  const key = selectedObject.trim().toLowerCase();
  return SCENARIO_KNOWN_OBJECT_FIXTURES[key] ?? null;
}

export function resolveScenarioWorkspaceContext(
  input: ScenarioWorkspaceContextInput
): ScenarioWorkspaceContext {
  const selectedObjectId = resolveObjectId(input);
  const selectedObject = resolveObjectLabel(input);
  const hasSelection = hasMeaningfulSelection(selectedObjectId, selectedObject);

  if (!hasSelection) {
    return DEFAULT_SCENARIO_WORKSPACE_CONTEXT;
  }

  const fixture = resolveKnownObjectFixture(selectedObject);

  return Object.freeze({
    selectedObjectId,
    selectedObject,
    explorationScope: fixture?.explorationScope ?? "General futures",
    comparisonMode: fixture?.comparisonMode ?? "Single-path review",
    projectionHorizon: fixture?.projectionHorizon ?? "30 days",
    hasSelection: true,
  });
}

export function buildScenarioWorkspaceContextSignature(
  context: ScenarioWorkspaceContext
): string {
  return JSON.stringify({
    selectedObjectId: context.selectedObjectId,
    selectedObject: context.selectedObject,
    explorationScope: context.explorationScope,
    comparisonMode: context.comparisonMode,
    projectionHorizon: context.projectionHorizon,
    hasSelection: context.hasSelection,
  });
}
