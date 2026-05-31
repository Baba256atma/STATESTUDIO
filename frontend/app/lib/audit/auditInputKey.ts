/** Stable serialization for audit input keys — prevents cache misses from key order drift. */

import { normalizeAuditViewportInputs } from "../layout/viewportResizeRuntime";

export function buildStableAuditInputKey(input: Record<string, unknown>): string {
  const normalizedInput = normalizeAuditViewportInputs(input);
  const sorted = Object.keys(normalizedInput).sort();
  const normalized: Record<string, unknown> = {};
  for (const key of sorted) {
    const value = normalizedInput[key];
    if (value === undefined) continue;
    normalized[key] = value;
  }
  return JSON.stringify(normalized);
}
