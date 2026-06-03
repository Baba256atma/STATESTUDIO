import type { RightPanelState } from "../ui/right-panel/rightPanelTypes";
import { devLogOnSignatureChange } from "./diagnosticIdleGate.ts";

/** Stable write signature — timestamp is intentionally excluded. */
export function buildRightPanelWriteSignature(state: RightPanelState): string {
  return JSON.stringify({
    view: state.view ?? null,
    isOpen: Boolean(state.isOpen),
    contextId: state.contextId ?? null,
  });
}

export function buildRightPanelSignature(state: {
  view: string | null;
  contextId?: string | null;
  source?: string | null;
  selectedObjectId?: string | null;
  mode?: string | null;
  isOpen?: boolean;
}): string {
  return [
    state.view ?? "none",
    state.contextId ?? "none",
    state.source ?? "none",
    state.selectedObjectId ?? "none",
    state.mode ?? "none",
    state.isOpen === false ? "closed" : "open",
  ].join("::");
}

export function buildRightPanelSignatureFromState(
  state: RightPanelState,
  extras?: {
    source?: string | null;
    selectedObjectId?: string | null;
    mode?: string | null;
  }
): string {
  return buildRightPanelSignature({
    view: state.view ?? null,
    contextId: state.contextId ?? null,
    source: extras?.source ?? null,
    selectedObjectId: extras?.selectedObjectId ?? null,
    mode: extras?.mode ?? null,
    isOpen: state.isOpen,
  });
}

export function areRightPanelCommitSignaturesEqual(
  prev: RightPanelState,
  next: RightPanelState,
  extras?: {
    source?: string | null;
    selectedObjectId?: string | null;
    mode?: string | null;
  }
): boolean {
  return (
    buildRightPanelSignatureFromState(prev, extras) ===
    buildRightPanelSignatureFromState(next, extras)
  );
}

export function logRightPanelWriteSkipped(reason: string, signature: string): void {
  devLogOnSignatureChange(
    "[NEXORA_RIGHT_PANEL_WRITE_SKIPPED]",
    signature,
    { reason, signature },
    "debug"
  );
}

export function areRightPanelStatesEquivalent(a: RightPanelState, b: RightPanelState): boolean {
  return buildRightPanelWriteSignature(a) === buildRightPanelWriteSignature(b);
}
