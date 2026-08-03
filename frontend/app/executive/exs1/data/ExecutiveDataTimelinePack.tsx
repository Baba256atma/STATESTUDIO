import type { DataTimelinePack } from "./ExecutiveDataConfig";
import type { ExecutiveTimelinePack } from "../shell/ExecutiveTimelineDock";

export function mapDataPacksToTimeline(
  packs: readonly DataTimelinePack[],
): ExecutiveTimelinePack[] {
  return packs.map((pack) => ({
    id: pack.id,
    title: pack.title,
    risk: pack.risk,
  }));
}
