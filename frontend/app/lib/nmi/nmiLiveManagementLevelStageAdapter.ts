/**
 * NPA-T MLEVEL:5 — apply certified MLEVEL:2 placement onto existing Stage objects.
 * OVS keeps geometry/material/state. MLEVEL only adjusts XY/scale/prominence.
 */

import type { NexoraMVPStageInteractionPresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { EXECUTIVE_STAGE_2D_DEPTH } from "@/app/lib/spatial-presentation/executiveStage2DFixedCamera.ts";
import { SCENE_ORG_NORMAL_STAGE_CARD_RULE } from "@/app/lib/scene-org/sceneOrgWorkspacePlacementContract.ts";
import type { ManagementLevelSpatialComposition } from "./nmiManagementLevelSpatialContract.ts";

export function applyManagementLevelSpatialToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
  spatial: ManagementLevelSpatialComposition | null | undefined,
  input: {
    readonly theatreActive?: boolean;
  } = {},
): NexoraMVPStageInteractionPresentation {
  if (spatial == null || spatial.visibleLevelCount < 2) {
    return presentation;
  }

  const byId = new Map(spatial.slots.map((slot) => [slot.canonicalId, slot]));
  const theatreProtectsActive = input.theatreActive === true;

  const objects = presentation.scene.objects.map((object) => {
    const slot = byId.get(object.id);
    if (slot == null) return object;
    if (theatreProtectsActive && slot.role === "ACTIVE") return object;
    const labelProminence =
      slot.detailMode === "FULL" ? "full" : slot.detailMode === "SUMMARY" ? "reduced" : "minimal";
    return Object.freeze({
      ...object,
      targetPosition: Object.freeze([
        slot.placement.world.x,
        slot.placement.world.y,
        EXECUTIVE_STAGE_2D_DEPTH,
      ] as const),
      scale: slot.scale,
      labelProminence,
      opacity: Math.min(object.opacity, slot.role === "ACTIVE" ? object.opacity : Math.max(0.45, object.opacity * slot.scale)),
    });
  });

  return Object.freeze({
    ...presentation,
    scene: Object.freeze({
      ...presentation.scene,
      objects: Object.freeze(objects),
    }),
  });
}

export const NMI_LIVE_MANAGEMENT_LEVEL_STAGE_ADAPTER = Object.freeze({
  ownsOvsGeometry: false as const,
  ownsOvsMaterial: false as const,
  ownsOvsManagementState: false as const,
  ownsSelection: false as const,
  cardAuthority: SCENE_ORG_NORMAL_STAGE_CARD_RULE,
  multipliesStageCardLimit: false as const,
  secondTheatre: false as const,
  usesZForHierarchy: false as const,
});
