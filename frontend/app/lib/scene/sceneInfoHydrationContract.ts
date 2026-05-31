/**
 * E2:60 — Scene Info HUD hydration contract.
 *
 * SSR HTML must match the first client render before effects run.
 */

export const SCENE_INFO_HYDRATION_CONTRACT = Object.freeze({
  rule: "No storage or viewport reads during render.",
  collapse: "Scene Info starts expanded until post-hydration preference restore.",
  viewport: "Viewport width defaults to 1440 until measured after hydration.",
});

const logKeys = new Set<string>();

function logOnce(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${label}:${JSON.stringify(payload)}`;
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

export function traceSceneInfoHydration(payload: {
  hydrated: boolean;
  source: string;
}): void {
  logOnce("[Nexora][SceneInfoHydration]", payload);
}

export function traceSceneInfoCollapsed(payload: {
  serverCollapsed: boolean;
  clientCollapsed: boolean;
  storedPreference: boolean | null;
  hydrated: boolean;
}): void {
  logOnce("[Nexora][SceneInfoCollapsed]", payload);
  if (payload.hydrated && payload.clientCollapsed !== payload.serverCollapsed) {
    logOnce("[Nexora][SceneInfoSSR]", {
      serverCollapsed: payload.serverCollapsed,
      clientCollapsed: payload.clientCollapsed,
      note: "post_hydration_preference_restore",
    });
  }
}

export function traceSceneInfoPreference(payload: {
  collapsed: boolean;
  source: string;
}): void {
  logOnce("[Nexora][SceneInfoPreference]", payload);
}

export function resetSceneInfoHydrationLogsForTests(): void {
  logKeys.clear();
}
