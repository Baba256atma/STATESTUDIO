/**
 * E2:98 — Twin object selection for living scene state.
 */

import type { ExecutiveCognitiveTwinState, TwinObjectSelection } from "./executiveCognitiveTwinTypes";

export function resolveTwinObjectSelection(
  state: ExecutiveCognitiveTwinState | null
): TwinObjectSelection | null {
  if (!state?.active) return null;

  const livingObjects = state.livingObjectIds;
  const riskSources = state.relationships
    .filter((entry) => entry.health === "stressed" || entry.health === "broken")
    .map((entry) => entry.sourceId);
  const riskTargets = state.relationships
    .filter((entry) => entry.health === "stressed" || entry.health === "broken")
    .map((entry) => entry.targetId);

  if (livingObjects.length === 0 && riskSources.length === 0) return null;

  return {
    highlighted_objects: [...livingObjects],
    risk_sources: [...new Set(riskSources)],
    risk_targets: [...new Set(riskTargets)],
    dim_unrelated_objects: false,
  };
}

export function resolveTwinStressedRelationshipIds(state: ExecutiveCognitiveTwinState | null): readonly string[] {
  return state?.stressedRelationshipIds ?? [];
}
