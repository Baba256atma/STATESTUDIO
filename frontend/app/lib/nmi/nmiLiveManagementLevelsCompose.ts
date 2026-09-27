/**
 * NPA-T MLEVEL:5 — live Management Levels composition over NMI:8.
 * Resolves path/spatial upstream of render. Does not invent belongs_to.
 */

import type { ManagementMap } from "./nmiManagementMapContract.ts";
import { composeNmiManagementLevelPath } from "./nmiManagementLevelPathCompose.ts";
import type { ManagementLevelPath } from "./nmiManagementLevelPathContract.ts";
import { composeNmiManagementLevelSpatial } from "./nmiManagementLevelSpatialCompose.ts";
import type {
  ManagementLevelSpatialComposition,
  ManagementLevelSpatialLayoutMode,
} from "./nmiManagementLevelSpatialContract.ts";
import { planManagementLevelMotion } from "./nmiManagementLevelMotionCompose.ts";
import type { ManagementLevelMotionPlan } from "./nmiManagementLevelMotionContract.ts";

export type NmiLiveManagementLevelsInput = {
  readonly map: ManagementMap | null;
  readonly selectedCanonicalId?: string | null;
  readonly layoutMode?: ManagementLevelSpatialLayoutMode;
  readonly previousSpatial?: ManagementLevelSpatialComposition | null;
  readonly reducedMotion?: boolean;
};

export type NmiLiveManagementLevels = {
  readonly path: ManagementLevelPath;
  readonly spatial: ManagementLevelSpatialComposition;
  readonly motion: ManagementLevelMotionPlan;
  readonly fabricatesBelongsTo: false;
  readonly resolvesHierarchyInRenderer: false;
  readonly secondStage: false;
  readonly secondTheatre: false;
};

export function composeNmiLiveManagementLevels(
  input: NmiLiveManagementLevelsInput,
): NmiLiveManagementLevels {
  const path = composeNmiManagementLevelPath({
    selectedCanonicalId: input.selectedCanonicalId,
    map: input.map,
  });
  const spatial = composeNmiManagementLevelSpatial({
    path,
    layoutMode: input.layoutMode,
  });
  const motion = planManagementLevelMotion({
    previous: input.previousSpatial ?? null,
    next: spatial,
    selectedCanonicalId: input.selectedCanonicalId ?? path.active?.canonicalId ?? null,
    reducedMotion: input.reducedMotion === true,
  });
  return Object.freeze({
    path,
    spatial,
    motion,
    fabricatesBelongsTo: false,
    resolvesHierarchyInRenderer: false,
    secondStage: false,
    secondTheatre: false,
  });
}
