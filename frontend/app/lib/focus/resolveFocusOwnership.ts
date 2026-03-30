import type { FocusOwnershipState } from "./focusOwnershipTypes";

type FocusOwnershipCandidate = FocusOwnershipState;

const PRIORITY: FocusOwnershipState["source"][] = [
  "user_click",
  "war_room_action",
  "executive_recommendation",
  "narrative_step",
  "backend_intelligence",
  "scanner_primary",
  "none",
];

export function resolveFocusOwnership(
  candidates: FocusOwnershipCandidate[],
  validObjectIds: Set<string>
): FocusOwnershipState {
  const validCandidates = candidates.filter(
    (candidate) =>
      candidate.source !== "none" &&
      typeof candidate.objectId === "string" &&
      candidate.objectId.length > 0 &&
      validObjectIds.has(candidate.objectId)
  );

  for (const source of PRIORITY) {
    const winner = validCandidates.find((candidate) => candidate.source === source);
    if (winner) return winner;
  }

  return {
    source: "none",
    objectId: null,
    isPersistent: false,
    reason: null,
  };
}
