/** E2:60 — Stable Scene Info HUD initial state for SSR and first client render. */

export type HudPanelInitialState = {
  collapsed: boolean;
  viewportWidth: number;
};

export const DEFAULT_SCENE_INFO_STATE: HudPanelInitialState = Object.freeze({
  collapsed: false,
  viewportWidth: 1440,
});

export const DEFAULT_OBJECT_INFO_STATE: HudPanelInitialState = Object.freeze({
  collapsed: true,
  viewportWidth: 1440,
});
