import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import type { AdaptiveSceneLabelMode } from "./executiveDensityTypes";
import type { RelationshipDensityMode } from "../../relationships/executive/executiveRelationshipTypes";

export type WorkspaceDensityModeProfile = {
  mode: WorkspaceViewMode;
  scaleMultiplier: number;
  spacingMultiplier: number;
  labelMode: AdaptiveSceneLabelMode;
  relationshipDensity: RelationshipDensityMode;
  optimizeFor: readonly string[];
};

const DENSITY_PROFILES: Readonly<Record<WorkspaceViewMode, WorkspaceDensityModeProfile>> = Object.freeze({
  "2D": {
    mode: "2D",
    scaleMultiplier: 1.04,
    spacingMultiplier: 1.08,
    labelMode: "CONDENSED",
    relationshipDensity: "FULL",
    optimizeFor: ["many_objects", "large_systems", "organizational_maps", "operational_topology"],
  },
  "3D": {
    mode: "3D",
    scaleMultiplier: 1.08,
    spacingMultiplier: 1,
    labelMode: "FULL",
    relationshipDensity: "FOCUSED",
    optimizeFor: ["presentations", "investigation", "relationship_exploration", "executive_demonstrations"],
  },
});

export function resolveWorkspaceDensityProfile(mode: WorkspaceViewMode): WorkspaceDensityModeProfile {
  return DENSITY_PROFILES[mode];
}
