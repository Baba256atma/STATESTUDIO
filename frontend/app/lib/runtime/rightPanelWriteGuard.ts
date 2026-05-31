import type { RightPanelState } from "../ui/right-panel/rightPanelTypes";

/** Stable write signature — timestamp is intentionally excluded. */
export function buildRightPanelWriteSignature(state: RightPanelState): string {
  return JSON.stringify({
    view: state.view ?? null,
    isOpen: Boolean(state.isOpen),
    contextId: state.contextId ?? null,
  });
}

export function areRightPanelStatesEquivalent(a: RightPanelState, b: RightPanelState): boolean {
  return buildRightPanelWriteSignature(a) === buildRightPanelWriteSignature(b);
}
