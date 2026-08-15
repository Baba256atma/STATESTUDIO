/**
 * SP:4.1C — Development-only Rendered-Bounds Truth Overlay gate.
 *
 * Enable:
 *   localStorage.setItem("nexora.sp41c.renderTruthOverlay", "1")
 *   or NEXT_PUBLIC_NEXORA_SP41C_RENDER_TRUTH_OVERLAY=1
 *
 * Disable:
 *   localStorage.removeItem("nexora.sp41c.renderTruthOverlay")
 *
 * Production builds never show the overlay.
 */

export const EXECUTIVE_RENDERED_BOUNDS_TRUTH_OVERLAY_STORAGE_KEY =
  "nexora.sp41c.renderTruthOverlay" as const;

export function isExecutiveRenderedBoundsTruthOverlayEnabled(): boolean {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") {
    return false;
  }
  const env = process.env.NEXT_PUBLIC_NEXORA_SP41C_RENDER_TRUTH_OVERLAY;
  if (env === "1" || env === "true" || env === "on") return true;
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(
      EXECUTIVE_RENDERED_BOUNDS_TRUTH_OVERLAY_STORAGE_KEY,
    ) === "1";
  } catch {
    return false;
  }
}

/** NDC (-1..1) → CSS percentage within the Stage canvas host. */
export function ndcToStageCssPercent(ndcX: number, ndcY: number): {
  readonly leftPercent: number;
  readonly topPercent: number;
} {
  return Object.freeze({
    leftPercent: ((ndcX + 1) / 2) * 100,
    topPercent: ((1 - ndcY) / 2) * 100,
  });
}

export function ndcRadiusToCssPercent(
  radiusNdc: number,
  axis: "x" | "y",
): number {
  // Full NDC span is 2 → 100%; radius is half-extent in NDC.
  void axis;
  return (radiusNdc / 2) * 100;
}
