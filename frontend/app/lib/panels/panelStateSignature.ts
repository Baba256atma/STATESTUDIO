import type { RightPanelState } from "../ui/right-panel/rightPanelTypes";

export type PanelStateSignatureInput = {
  view: string | null;
  panelId?: string | null;
  contextId?: string | null;
  isOpen?: boolean;
  selectedObjectId?: string | null;
  mode?: string | null;
};

/** Stable panel write signature — excludes timestamp and other volatile fields. */
export function buildPanelStateSignature(input: PanelStateSignatureInput): string {
  return JSON.stringify({
    view: input.view ?? null,
    panelId: input.panelId ?? input.view ?? null,
    contextId: input.contextId ?? null,
    isOpen: input.isOpen ?? true,
    selectedObjectId: input.selectedObjectId ?? null,
    mode: input.mode ?? null,
  });
}

export function buildPanelStateSignatureFromState(
  state: RightPanelState,
  extras?: { selectedObjectId?: string | null; mode?: string | null }
): string {
  return buildPanelStateSignature({
    view: state.view ?? null,
    panelId: state.view ?? null,
    contextId: state.contextId ?? null,
    isOpen: state.isOpen,
    selectedObjectId: extras?.selectedObjectId ?? null,
    mode: extras?.mode ?? null,
  });
}

export function arePanelStateSignaturesEqual(
  prev: RightPanelState,
  next: RightPanelState,
  extras?: { selectedObjectId?: string | null; mode?: string | null }
): boolean {
  return buildPanelStateSignatureFromState(prev, extras) === buildPanelStateSignatureFromState(next, extras);
}

export function shouldCommitPanelWrite(
  prev: RightPanelState,
  next: RightPanelState,
  extras?: { selectedObjectId?: string | null; mode?: string | null }
): boolean {
  return !arePanelStateSignaturesEqual(prev, next, extras);
}
