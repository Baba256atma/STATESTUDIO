import type { RightPanelState } from "../ui/right-panel/rightPanelTypes";
import { arePanelStateSignaturesEqual, shouldCommitPanelWrite } from "./panelStateSignature";

export { arePanelStateSignaturesEqual, shouldCommitPanelWrite };

export type PanelWriteGateResult =
  | { commit: true; prev: RightPanelState; next: RightPanelState }
  | { commit: false; prev: RightPanelState; next: RightPanelState; reason: "no_op" };

export function evaluatePanelWriteGate(
  prev: RightPanelState,
  next: RightPanelState
): PanelWriteGateResult {
  if (shouldCommitPanelWrite(prev, next)) {
    return { commit: true, prev, next };
  }
  return { commit: false, prev, next, reason: "no_op" };
}
