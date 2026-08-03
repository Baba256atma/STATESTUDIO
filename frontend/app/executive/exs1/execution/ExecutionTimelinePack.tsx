/**
 * Helper view-model for Execution Packs shown in Timeline Pack Strip.
 * Pack history grows on Start Execution; timeline lens/position stays unchanged.
 */

import type { ExecutionTimelinePack } from "./ExecutionConfig";
import type { ExecutiveTimelinePack } from "../shell/ExecutiveTimelineDock";

export function mapExecutionPacksToTimeline(
  packs: readonly ExecutionTimelinePack[],
): ExecutiveTimelinePack[] {
  return packs.map((pack) => ({
    id: pack.id,
    title: pack.title,
    risk: pack.risk,
  }));
}
