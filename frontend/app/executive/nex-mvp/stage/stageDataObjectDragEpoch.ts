/** A drag continues only while the Stage spatial identity captured at pointer-down is still current. */
export function dragContinues(capturedEpoch: string, liveEpoch: string): boolean {
  return capturedEpoch === liveEpoch;
}

export type StageDragMove = "idle" | "cancel" | "continue";

/** Pointer movement follows the captured epoch. A Workspace, Deck, or demo change cancels the drag. */
export function stageDragMove(dragging: boolean, capturedEpoch: string, liveEpoch: string): StageDragMove {
  if (!dragging) return "idle";
  return dragContinues(capturedEpoch, liveEpoch) ? "continue" : "cancel";
}
