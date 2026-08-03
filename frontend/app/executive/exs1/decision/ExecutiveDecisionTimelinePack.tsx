/**
 * Helper view-model for Decision Packs shown in Timeline Pack Strip.
 * Pack history grows on approve; timeline lens/position stays unchanged.
 */

import type { DecisionTimelinePack } from "./ExecutiveDecisionConfig";
import type { ExecutiveTimelinePack } from "../shell/ExecutiveTimelineDock";

export function mapDecisionPacksToTimeline(
  packs: readonly DecisionTimelinePack[],
): ExecutiveTimelinePack[] {
  return packs.map((pack) => ({
    id: pack.id,
    title: pack.title,
    risk: pack.risk,
  }));
}
