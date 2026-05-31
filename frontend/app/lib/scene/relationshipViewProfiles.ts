import type { WorkspaceViewMode } from "../workspace/workspaceViewModeTypes";
import type { RelationshipDensityMode } from "../relationships/executive/executiveRelationshipTypes";
import { setRelationshipDensityMode } from "../relationships/executive/relationshipDensityRuntime";

export type RelationshipViewProfile = {
  mode: WorkspaceViewMode;
  densityMode: RelationshipDensityMode;
  lineOpacity: number;
  showLabelDefault: boolean;
  depthCue: boolean;
  clarityFirst: boolean;
};

const PROFILES: Readonly<Record<WorkspaceViewMode, RelationshipViewProfile>> = Object.freeze({
  "2D": {
    mode: "2D",
    densityMode: "FULL",
    lineOpacity: 0.92,
    showLabelDefault: true,
    depthCue: false,
    clarityFirst: true,
  },
  "3D": {
    mode: "3D",
    densityMode: "FOCUSED",
    lineOpacity: 0.84,
    showLabelDefault: true,
    depthCue: true,
    clarityFirst: false,
  },
});

export function resolveRelationshipViewProfile(mode: WorkspaceViewMode): RelationshipViewProfile {
  return PROFILES[mode];
}

export function applyRelationshipViewProfileForMode(mode: WorkspaceViewMode): RelationshipViewProfile {
  const profile = resolveRelationshipViewProfile(mode);
  setRelationshipDensityMode(profile.densityMode);
  return profile;
}
