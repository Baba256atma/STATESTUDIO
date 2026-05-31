import type { NexoraRelationship } from "../relationshipTypes";
import type { RelationshipDensityMode, RelationshipFocusRole } from "./executiveRelationshipTypes";
import { evaluateExecutiveRelationshipMetadata } from "./executiveRelationshipRuntime";
import { logRelationshipDensity } from "./executiveRelationshipInstrumentation";
import { resolveRelationshipFocusRole } from "./relationshipFocusRuntime";

export const DEFAULT_RELATIONSHIP_DENSITY_MODE: RelationshipDensityMode = "EXECUTIVE";

let activeDensityMode: RelationshipDensityMode = DEFAULT_RELATIONSHIP_DENSITY_MODE;

export function setRelationshipDensityMode(mode: RelationshipDensityMode): void {
  activeDensityMode = mode;
}

export function getRelationshipDensityMode(): RelationshipDensityMode {
  return activeDensityMode;
}

export function resetRelationshipDensityForTests(): void {
  activeDensityMode = DEFAULT_RELATIONSHIP_DENSITY_MODE;
}

function importanceThreshold(mode: RelationshipDensityMode, relationshipCount: number): number {
  if (mode === "FULL") return 0;
  if (mode === "FOCUSED") return relationshipCount > 40 ? 0.55 : 0.42;
  return relationshipCount > 80 ? 0.62 : relationshipCount > 30 ? 0.52 : 0.44;
}

export function shouldShowRelationshipInDensityMode(input: {
  relationship: NexoraRelationship;
  mode?: RelationshipDensityMode;
  focusRole: RelationshipFocusRole;
  selectedObjectId?: string | null;
  selectedRelationshipId?: string | null;
  relationshipCount: number;
}): boolean {
  const mode = input.mode ?? activeDensityMode;
  if (mode === "FULL") return true;
  if (input.selectedRelationshipId === input.relationship.id) return true;

  const metadata = evaluateExecutiveRelationshipMetadata(input.relationship);
  const threshold = importanceThreshold(mode, input.relationshipCount);

  if (
    input.focusRole === "direct_dependency" ||
    input.focusRole === "critical_influence" ||
    input.focusRole === "major_risk_route"
  ) {
    return true;
  }

  if (input.focusRole === "unrelated") {
    return mode !== "EXECUTIVE" && metadata.relationshipImportance >= threshold;
  }

  return metadata.relationshipImportance >= threshold;
}

export function resolveRelationshipDensitySnapshot(input: {
  relationships: NexoraRelationship[];
  mode?: RelationshipDensityMode;
  selectedObjectId?: string | null;
  selectedRelationshipId?: string | null;
}): { mode: RelationshipDensityMode; visibleCount: number; hiddenCount: number } {
  const mode = input.mode ?? activeDensityMode;
  let visibleCount = 0;
  for (const relationship of input.relationships) {
    const focusRole = resolveRelationshipFocusRole({
      relationship,
      selectedObjectId: input.selectedObjectId,
      selectedRelationshipId: input.selectedRelationshipId,
    });
    if (
      shouldShowRelationshipInDensityMode({
        relationship,
        mode,
        focusRole,
        selectedObjectId: input.selectedObjectId,
        selectedRelationshipId: input.selectedRelationshipId,
        relationshipCount: input.relationships.length,
      })
    ) {
      visibleCount += 1;
    }
  }

  const snapshot = {
    mode,
    visibleCount,
    hiddenCount: Math.max(0, input.relationships.length - visibleCount),
  };
  logRelationshipDensity(snapshot);
  return snapshot;
}
