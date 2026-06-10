/**
 * E2:61 — Immutable SSR layout defaults for executive scene HUD overlays.
 *
 * Server render and the first client render must use these values without
 * reading window, matchMedia, or ResizeObserver.
 */

export const EXECUTIVE_HUD_SSR_VIEWPORT = Object.freeze({
  width: 1440,
  height: 900,
});

export const EXECUTIVE_HUD_SSR_LAYOUT = Object.freeze({
  sceneInfoTop: 12,
  sceneInfoLeft: 12,
  sceneInfoMaxWidth: "min(248px, 34vw)",
  toolbarTop: 12,
  toolbarMaxWidth: "min(360px, 832px)",
  timelineBottom: 112,
  timelineMaxWidth: "min(88vw, 860px)",
  rightRailWidth: 400,
});

export type ExecutiveHudSSRLayout = typeof EXECUTIVE_HUD_SSR_LAYOUT;
