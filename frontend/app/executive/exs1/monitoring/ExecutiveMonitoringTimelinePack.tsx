/**
 * Helper view-model for Monitoring Packs shown in Timeline Pack Strip.
 * Pack history grows on Create Snapshot; timeline lens/position stays unchanged.
 */

import type { MonitoringTimelinePack } from "./ExecutiveMonitoringConfig";
import type { ExecutiveTimelinePack } from "../shell/ExecutiveTimelineDock";

export function mapMonitoringPacksToTimeline(
  packs: readonly MonitoringTimelinePack[],
): ExecutiveTimelinePack[] {
  return packs.map((pack) => ({
    id: pack.id,
    title: pack.title,
    risk: pack.risk,
  }));
}
