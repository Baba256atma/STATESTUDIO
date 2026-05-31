/**
 * E2:61 — Hydration-safe viewport resolution for executive HUD layout.
 *
 * Before hydration: always return SSR viewport dimensions.
 * After hydration: read live window dimensions (resize updates via provider).
 */

import { emitHudLayoutZoneLog } from "./hudLayoutLogGuard";
import {
  EXECUTIVE_HUD_SSR_LAYOUT,
  EXECUTIVE_HUD_SSR_VIEWPORT,
} from "./executiveHudSSRContract";

export { EXECUTIVE_HUD_SSR_LAYOUT, EXECUTIVE_HUD_SSR_VIEWPORT };

export type ExecutiveHudLayoutDiagnostics = {
  sceneInfo: { top: number; left: number; maxWidth: string };
  toolbar: { top: number; maxWidth: string };
  timeline: { bottom: number; maxWidth: string };
  rightRail: { width: number };
};

let layoutHydrated = false;
const hydrationListeners = new Set<() => void>();
const logKeys = new Set<string>();

function logOnce(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${label}:${JSON.stringify(payload)}`;
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

export function isExecutiveHudLayoutHydrated(): boolean {
  return layoutHydrated;
}

export function markExecutiveHudLayoutHydrated(): void {
  if (layoutHydrated) return;
  layoutHydrated = true;
  traceHUDHydration();
  hydrationListeners.forEach((listener) => listener());
}

export function subscribeExecutiveHudLayoutHydration(listener: () => void): () => void {
  hydrationListeners.add(listener);
  return () => hydrationListeners.delete(listener);
}

export function getExecutiveHudViewportWidth(): number {
  if (layoutHydrated && typeof window !== "undefined") {
    return Math.max(320, window.innerWidth || EXECUTIVE_HUD_SSR_VIEWPORT.width);
  }
  return EXECUTIVE_HUD_SSR_VIEWPORT.width;
}

export function getExecutiveHudViewportHeight(): number {
  if (layoutHydrated && typeof window !== "undefined") {
    return Math.max(420, window.innerHeight || EXECUTIVE_HUD_SSR_VIEWPORT.height);
  }
  return EXECUTIVE_HUD_SSR_VIEWPORT.height;
}

export function getExecutiveHudViewport(): Readonly<{ width: number; height: number }> {
  return Object.freeze({
    width: getExecutiveHudViewportWidth(),
    height: getExecutiveHudViewportHeight(),
  });
}

export function buildExecutiveHudLayoutDiagnostics(viewportWidth: number): ExecutiveHudLayoutDiagnostics {
  const mobile = viewportWidth < 768;
  return {
    sceneInfo: {
      top: mobile ? 8 : EXECUTIVE_HUD_SSR_LAYOUT.sceneInfoTop,
      left: mobile ? 8 : EXECUTIVE_HUD_SSR_LAYOUT.sceneInfoLeft,
      maxWidth: mobile ? "min(200px, 46vw)" : EXECUTIVE_HUD_SSR_LAYOUT.sceneInfoMaxWidth,
    },
    toolbar: {
      top: mobile ? 8 : EXECUTIVE_HUD_SSR_LAYOUT.toolbarTop,
      maxWidth: mobile ? "92vw" : EXECUTIVE_HUD_SSR_LAYOUT.toolbarMaxWidth,
    },
    timeline: {
      bottom: mobile ? 108 : EXECUTIVE_HUD_SSR_LAYOUT.timelineBottom,
      maxWidth: mobile ? "calc(100vw - 24px)" : EXECUTIVE_HUD_SSR_LAYOUT.timelineMaxWidth,
    },
    rightRail: {
      width: mobile ? 320 : EXECUTIVE_HUD_SSR_LAYOUT.rightRailWidth,
    },
  };
}

export function traceHUDSSRLayout(): void {
  logOnce("[Nexora][HUDSSRLayout]", {
    viewport: EXECUTIVE_HUD_SSR_VIEWPORT,
    layout: EXECUTIVE_HUD_SSR_LAYOUT,
  });
}

export function traceHUDClientLayout(viewportWidth: number): void {
  logOnce("[Nexora][HUDClientLayout]", buildExecutiveHudLayoutDiagnostics(viewportWidth));
}

export function traceHUDHydration(): void {
  logOnce("[Nexora][HUDHydration]", { hydrated: true });
}

export function traceResponsiveLayoutApplied(viewportWidth: number): void {
  if (!layoutHydrated) return;
  emitHudLayoutZoneLog(
    "[Nexora][ResponsiveLayoutApplied]",
    "ResponsiveLayoutApplied",
    {
      viewportWidth,
      ...buildExecutiveHudLayoutDiagnostics(viewportWidth),
    },
    viewportWidth
  );
}

export function resetExecutiveHudHydrationForTests(): void {
  layoutHydrated = false;
  hydrationListeners.clear();
  logKeys.clear();
}
