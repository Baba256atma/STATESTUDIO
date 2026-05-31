import type {
  ExecutiveRelationshipSceneInput,
  ExecutiveRelationshipScenePlan,
  RelationshipRenderPlan,
} from "./executiveRelationshipTypes";
import { CLASSIFICATION_EXECUTIVE_LABELS as LABELS } from "./executiveRelationshipTypes";
import { evaluateExecutiveRelationshipMetadata } from "./executiveRelationshipRuntime";
import { classifyExecutiveRelationship } from "./relationshipClassificationRuntime";
import {
  DEFAULT_RELATIONSHIP_DENSITY_MODE,
  resolveRelationshipDensitySnapshot,
  shouldShowRelationshipInDensityMode,
} from "./relationshipDensityRuntime";
import { resolveRelationshipFocusRole } from "./relationshipFocusRuntime";
import { resolveRelationshipVisualProfile } from "./relationshipVisualProfileRuntime";

/** Resolve full executive relationship scene visual plan. */
export function resolveExecutiveRelationshipScenePlan(
  input: ExecutiveRelationshipSceneInput
): ExecutiveRelationshipScenePlan {
  const densityMode = input.densityMode ?? DEFAULT_RELATIONSHIP_DENSITY_MODE;
  const densitySnapshot = resolveRelationshipDensitySnapshot({
    relationships: input.relationships,
    mode: densityMode,
    selectedObjectId: input.selectedObjectId,
    selectedRelationshipId: input.selectedRelationshipId,
  });

  const plans: Record<string, RelationshipRenderPlan> = {};

  for (const relationship of input.relationships) {
    const metadata = evaluateExecutiveRelationshipMetadata(relationship);
    const classification = classifyExecutiveRelationship(relationship);
    const focusRole = resolveRelationshipFocusRole({
      relationship,
      selectedObjectId: input.selectedObjectId,
      selectedRelationshipId: input.selectedRelationshipId,
    });
    const visible = shouldShowRelationshipInDensityMode({
      relationship,
      mode: densityMode,
      focusRole,
      selectedObjectId: input.selectedObjectId,
      selectedRelationshipId: input.selectedRelationshipId,
      relationshipCount: input.relationships.length,
    });
    const profile = resolveRelationshipVisualProfile({
      metadata,
      focusRole,
      selected: relationship.id === input.selectedRelationshipId,
      densityExecutive: densityMode === "EXECUTIVE",
    });

    plans[relationship.id] = {
      relationshipId: relationship.id,
      visible,
      showLabel: visible && profile.showLabel,
      emphasis: profile.emphasis,
      focusRole,
      opacity: profile.opacity,
      lineWidthMultiplier: profile.lineWidthMultiplier,
      glow: profile.glow,
      classification,
      executiveLabel: LABELS[classification],
    };
  }

  return {
    densityMode,
    relationshipCount: input.relationships.length,
    visibleCount: densitySnapshot.visibleCount,
    plans,
  };
}

export function getRelationshipRenderPlan(
  plan: ExecutiveRelationshipScenePlan,
  relationshipId: string
): RelationshipRenderPlan | null {
  return plan.plans[relationshipId] ?? null;
}
