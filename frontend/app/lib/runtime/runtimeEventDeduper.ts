/**
 * E2:64 — Suppress identical runtime events within the same frame bucket.
 */

import { traceEventDeduped } from "./runtimeChurnDiagnostics";

let frameBucket = -1;
const frameEventKeys = new Set<string>();

function syncFrameBucket(): number {
  const bucket = Math.floor(Date.now() / 16);
  if (bucket !== frameBucket) {
    frameBucket = bucket;
    frameEventKeys.clear();
  }
  return bucket;
}

export function shouldEmitRuntimeEvent(eventKey: string): boolean {
  if (process.env.NODE_ENV === "production") return true;
  syncFrameBucket();
  if (frameEventKeys.has(eventKey)) {
    traceEventDeduped({ eventKey });
    return false;
  }
  frameEventKeys.add(eventKey);
  return true;
}

export function resetRuntimeEventDeduperForTests(): void {
  frameBucket = -1;
  frameEventKeys.clear();
}
