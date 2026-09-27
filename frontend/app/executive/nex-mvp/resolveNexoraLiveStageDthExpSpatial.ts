/**
 * NPA-T OVS:3-FIX1B — retain certified DTH-EXP response.spatial for Stage.
 * Does not select Nexo, compose Theatre, or compute layout.
 */

import type { NexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreContract.ts";
import type { DthExpSpatialLayoutProjection } from "@/app/lib/dth-exp/dthExpSpatialLayoutContract.ts";
import { projectDthExpLiveTheatreSceneResponse } from "@/app/lib/dth-exp/dthExpPublicIndex.ts";

export const nexoraLiveStageDthExpSpatialHandoffIdentity =
  "NPA-T OVS:3-FIX1B/LiveStageDthExpSpatialHandoff" as const;

/**
 * Live host consumption of already-authoritative 7B spatial.
 * Returns null when DTH-EXP returns null. No last-valid fallback.
 */
export function resolveNexoraLiveStageDthExpSpatial(
  theatre: NexoraDecisionTheatreFoundation | null,
): DthExpSpatialLayoutProjection | null {
  return projectDthExpLiveTheatreSceneResponse({ theatre }).spatial;
}
