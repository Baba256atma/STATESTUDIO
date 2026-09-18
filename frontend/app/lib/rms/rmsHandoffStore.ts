/**
 * NPA-T RMS:9 — in-process Take Control view store.
 * Ownership is not inferred from UI.
 */

import type { RmsTakeControlView } from "./rmsHandoffContract.ts";

const VIEWS = new Map<string, RmsTakeControlView>();

export function setRmsTakeControlView(view: RmsTakeControlView): RmsTakeControlView {
  VIEWS.set(view.watchSessionId, view);
  return view;
}

export function getStoredRmsTakeControlView(watchSessionId: string): RmsTakeControlView | null {
  return VIEWS.get(watchSessionId) ?? null;
}

export function deleteRmsTakeControlView(watchSessionId: string): void {
  VIEWS.delete(watchSessionId);
}
